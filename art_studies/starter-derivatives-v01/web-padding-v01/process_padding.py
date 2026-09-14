"""Recover the observed grid; remove only transparent per-cell padding.

Never fit the grid to 96, resize figures, or center individual silhouettes.
"""
from pathlib import Path
import hashlib
import json
import sys

import numpy as np
from PIL import Image

SCRIPT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_ROOT.parent))
R = Path(sys.argv[1]).resolve() if len(sys.argv)>1 else SCRIPT_ROOT
from tune_transfer import transfer, expand, metrics
from pixel_perfecter.reconstructor import PixelArtReconstructor


def main():
    layout = json.loads((R / 'layout.json').read_text())
    columns, rows = layout.get('columns', 4), layout.get('rows', 2)
    native_width, native_height = layout['sheet_native']
    image = Image.open(R / 'generated.png')
    assert image.mode == 'RGBA' and image.getchannel('A').getextrema()[0] == 0
    source = np.array(image)
    rec = PixelArtReconstructor(image=source)
    rec.run()
    (R/'fit.json').write_text(json.dumps(rec.last_fit_debug,indent=2,default=lambda o:o.tolist() if hasattr(o,'tolist') else str(o)))
    print('Detected grid:',rec.cell_size,'mesh:',rec.mesh_lines is not None,flush=True)
    mesh_rejection = None
    grid_size = rec.cell_size
    grid_kind = 'mesh' if rec.mesh_lines is not None else 'rigid'
    if rec.mesh_lines is not None:
        mx, my = rec.mesh_lines
        pitch_x = (mx[-1]-mx[0])/(len(mx)-1)
        pitch_y = (my[-1]-my[0])/(len(my)-1)
        # Both upload and generated canvas preserve aspect ratio. A mesh with
        # unequal average axis pitches would change anatomical proportions.
        # Fall back to the reconstructor's OWN rigid pick, never a target size.
        if max(pitch_x,pitch_y)/min(pitch_x,pitch_y)>1.05:
            mesh_rejection = dict(reason='Non-square sampling would distort the unchanged square-pixel aspect ratio',
                mean_pitch_x=pitch_x,mean_pitch_y=pitch_y,max_allowed_axis_ratio=1.05)
            grid_kind='rigid'
            grid_size=rec.last_fit_debug['rigid_pick']['size']
    if grid_kind=='mesh':
        xs, ys = [list(map(int, v)) for v in rec.mesh_lines]
    else:
        step = grid_size
        if mesh_rejection:
            candidate=next(c for c in rec.last_fit_debug['candidates'] if c['size']==step)
            ox,oy=candidate['offset']
        else:
            ox, oy = rec.offset
        xs = list(range(ox, image.width + 1, step))
        ys = list(range(oy, image.height + 1, step))
    recovered = transfer(source, xs, ys)
    Image.fromarray(recovered).save(R / 'recovered.png')
    frames = []
    for i, entry in enumerate(layout['frames']):
        col, row = i % columns, i // columns
        # Map the SAME guide-space origin in each slot to the detected grid.
        # This is layout registration, independent of the generated silhouette.
        ax = int(np.argmin(np.abs(np.array(xs) - entry['anchor'][0] * image.width / native_width)))
        ay = int(np.argmin(np.abs(np.array(ys) - entry['anchor'][1] * image.height / native_height)))
        x0, y0 = ax - 48, ay - 80
        cx0, cx1 = [int(np.argmin(np.abs(np.array(xs) - image.width * c / columns))) for c in [col, col+1]]
        cy0, cy1 = [int(np.argmin(np.abs(np.array(ys) - image.height * r / rows))) for r in [row, row+1]]
        # When an observed slot is smaller than the target, extend only with
        # transparency. Never copy pixels from a neighboring slot.
        crop = np.zeros((96,96,4),np.uint8)
        sx0, sy0 = max(cx0,x0,0), max(cy0,y0,0)
        sx1, sy1 = min(cx1,x0+96,recovered.shape[1]), min(cy1,y0+96,recovered.shape[0])
        if sx1>sx0 and sy1>sy0:
            crop[sy0-y0:sy1-y0,sx0-x0:sx1-x0]=recovered[sy0:sy1,sx0:sx1]
        cell = recovered[cy0:cy1, cx0:cx1]
        inside = int(np.count_nonzero(crop[:, :, 3]))
        whole = int(np.count_nonzero(cell[:, :, 3]))
        discarded = whole - inside
        assert discarded >= 0, 'Crop overlaps another slot'
        im = Image.fromarray(crop)
        im.save(R / f'diagnostic-crop-{i+1}.png')
        frames.append(dict(src=f'../{R.name}/frame-{i+1}.png', size=[96,96],
            bbox=im.getbbox(), crop_origin=[x0,y0], anchor=[48,80],
            foreground_pixels=inside, discarded_foreground_pixels=discarded,
            rgba_sha256=hashlib.sha256(crop.tobytes()).hexdigest()))
    report = dict(conversation='https://chatgpt.com/c/6aa79da7-9128-83ea-87e7-360c33b468f2',
        source_size=list(image.size), alpha_extrema=image.getchannel('A').getextrema(),
        sha256=hashlib.sha256((R/'generated.png').read_bytes()).hexdigest(),
        grid_size=grid_size, grid_kind=grid_kind, mesh_rejection=mesh_rejection,
        recovered_size=list(recovered.shape[1::-1]), x=xs, y=ys,
        fit=rec.last_fit_debug, transfer=metrics(source,expand(recovered,xs,ys,source.shape)),
        frames=frames, all_foreground_preserved=all(f['discarded_foreground_pixels']==0 for f in frames),
        unique_frames=len({f['rgba_sha256'] for f in frames}), game_ready=False)
    if not report['all_foreground_preserved']:
        for i,f in enumerate(frames):
            f['src']=f'../{R.name}/diagnostic-crop-{i+1}.png'
    (R/'audit.json').write_text(json.dumps(report,indent=2,default=lambda o:o.tolist() if hasattr(o,'tolist') else str(o)))
    print(json.dumps({k:report[k] for k in ['source_size','grid_size','grid_kind','recovered_size','all_foreground_preserved','unique_frames']}),flush=True)
    print('Frame bounds:',[f['bbox'] for f in frames],flush=True)
    if not report['all_foreground_preserved']:
        raise SystemExit('Rejected: 96x96 crops would discard foreground. Audit and diagnostic crops saved; not added to demo.')
    sheet=Image.new('RGBA',(columns*96,rows*96))
    for i in range(len(frames)):
        im=Image.open(R/f'diagnostic-crop-{i+1}.png')
        im.save(R/f'frame-{i+1}.png')
        sheet.paste(im,((i%columns)*96,(i//columns)*96))
    sheet.save(R/'frames96.png')
    sheet.resize((sheet.width*3,sheet.height*3),Image.Resampling.NEAREST).save(R/'frames96-3x.png')
    records_path=R.parent/'web-v01/recovery.json'
    records=json.loads(records_path.read_text())
    name='female-sprint-right-padded-'+R.name.split('-')[-1]
    record=dict(name=name,key='female-sprint-right',raw=f'../{R.name}/generated.png',
        recovered=f'../{R.name}/frames96.png',source_size=list(image.size),
        recovered_size=list(sheet.size),grid_size=grid_size,game_ready=False,frames=frames,
        note=f'Padded-sheet experiment. {grid_kind} grid, {grid_size} source pixels per recovered pixel. Automatic grid evidence is unpeaked. Non-square mesh rejected when present. Fixed guide origins, no resizing; zero recovered foreground discarded. Scale and poses remain unapproved.',
        review_status=f'Padding test: {len(frames)} of 8 phases, 96×96 frames with no cropped foreground. Grid confidence is LOW; physical scale and poses still differ from Blender. This is an incomplete motion sample, not an approved loop.')
    records_path.write_text(json.dumps([r for r in records if r['name']!=name]+[record],indent=2))


if __name__=='__main__':
    main()
