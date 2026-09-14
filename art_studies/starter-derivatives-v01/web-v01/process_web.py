"""Recover observed web outputs without imposing a target grid or resizing art."""
from pathlib import Path
import json, sys
import numpy as np
from PIL import Image

R = Path(__file__).resolve().parent
sys.path.insert(0, str(R.parent))
from tune_transfer import transfer, expand, metrics
from pixel_perfecter.reconstructor import PixelArtReconstructor

LABELS = {
    '7713bc39ff09': 'male-walk-front',
    '4e11398614d2': 'male-walk-right-a',
    '50c582e46e29': 'male-walk-right-b',
    '8d556d59bc10': 'female-sprint-right-a',
    '6dbef59b3cc7': 'male-walk-left',
    '4eaf8dcaff3f': 'female-sprint-front',
    '2e5de17a5040': 'female-sprint-back',
    'ec6879a25fbe': 'female-sprint-left',
    'a3e78e597526': 'male-sprint-right',
    'ce6218640113': 'female-walk-right',
    'bb427189904e': 'female-sprint-right-b',
}

def main():
    out = R/'recovered'
    out.mkdir(exist_ok=True)
    records = json.loads((R/'recovery.json').read_text()) if (R/'recovery.json').exists() else []
    if '--coarse' in sys.argv:
        LABELS.clear()
        LABELS['coarse-generated'] = 'female-sprint-right-coarse-v1'
    if '--coarse-v2' in sys.argv:
        LABELS.clear()
        LABELS['coarse-generated-v2'] = 'female-sprint-right-coarse-v2'
    for key, name in LABELS.items():
        source_path = R/f'{key}.png' if key.startswith('coarse-generated') else R/'raw'/f'{key}.png'
        source = np.array(Image.open(source_path))
        assert source.shape[2] == 4 and source[:,:,3].min() == 0
        rec = PixelArtReconstructor(image=source)
        rec.run()
        if key.startswith('coarse-generated'):
            (R/f'{key}-fit.json').write_text(json.dumps(rec.last_fit_debug, indent=2,
                default=lambda o:o.tolist() if hasattr(o,'tolist') else str(o)))
        if rec.mesh_lines is not None:
            xs, ys = [list(map(int, v)) for v in rec.mesh_lines]
        else:
            s = rec.cell_size
            ox, oy = rec.offset
            xs = list(range(ox, source.shape[1]+1, s))
            ys = list(range(oy, source.shape[0]+1, s))
        recovered = transfer(source, xs, ys)
        Image.fromarray(recovered).save(out/f'{name}.png')
        roundtrip = expand(recovered, xs, ys, source.shape)
        record = dict(name=name, raw=source_path.relative_to(R).as_posix(), recovered=f'recovered/{name}.png',
                      source_size=list(source.shape[1::-1]), recovered_size=list(recovered.shape[1::-1]),
                      grid_size=rec.cell_size, x=xs, y=ys,
                      transfer=metrics(source, roundtrip), game_ready=False)
        # Split at the original 4x2 guide cell boundaries in the recovered grid.
        # Preserve all samples. Never stretch/recenter individual animation phases.
        xcuts = [int(np.argmin(np.abs(np.array(xs)-source.shape[1]*i/4))) for i in range(5)]
        ycuts = [int(np.argmin(np.abs(np.array(ys)-source.shape[0]*i/2))) for i in range(3)]
        xcuts[-1] = recovered.shape[1]; ycuts[-1] = recovered.shape[0]
        record['frames'] = []
        for i in range(8):
            col, row = i%4, i//4
            x0,x1 = xcuts[col:col+2]; y0,y1 = ycuts[row:row+2]
            frame = recovered[y0:y1,x0:x1]
            dest = out/f'{name}-{i+1}.png'
            im = Image.fromarray(frame); im.save(dest)
            record['frames'].append(dict(src=f'recovered/{dest.name}', size=list(im.size), bbox=im.getbbox()))
        records = [v for v in records if v['name'] != name] + [record]
        print(name, 'detected',rec.cell_size,'recovered',record['recovered_size'],flush=True)
    (R/'recovery.json').write_text(json.dumps(records,indent=2))

if __name__ == '__main__': main()
