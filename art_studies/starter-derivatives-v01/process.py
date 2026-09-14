"""Audit native alpha, then recover the generated pixel grid with Pixel Respecter.

No RGB keying, arbitrary resampling, invented poses, mirroring, or interpolation.
Run with the existing Pixel Respecter checkout available via --respecter.
"""
from pathlib import Path
import argparse, hashlib, json, shutil, sys
import numpy as np
from PIL import Image

R = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--respecter', default='Z:/Code/Python/pixel-perfecter')
parser.add_argument('names', nargs='*')
args = parser.parse_args()
sys.path.insert(0, args.respecter)
from pixel_perfecter.reconstructor import PixelArtReconstructor

for folder in ['generated', 'first-pass', 'inputs', 'reconstructed', 'frames', 'review']:
    (R / folder).mkdir(exist_ok=True)
sources = json.loads((R / 'generation-sources.json').read_text())
corrections = json.loads((R / 'alpha-sources.json').read_text()) if (R / 'alpha-sources.json').exists() else {}
for name in args.names or sources:
    raw = R / 'first-pass' / f'{name}.png'
    if not raw.exists(): shutil.copy2(sources[name], raw)
    chosen = corrections.get(name, sources[name])
    final = R / 'generated' / f'{name}.png'
    if not final.exists(): shutil.copy2(chosen, final)
    im = Image.open(final)
    audit = {'mode': im.mode, 'size': im.size, 'png_color_type': final.read_bytes()[25],
             'sha256': hashlib.sha256(final.read_bytes()).hexdigest(),
             'first_pass_mode': Image.open(raw).mode,
             'background_extraction_edit': name in corrections}
    native = im.mode == 'RGBA' and im.getchannel('A').getextrema()[0] == 0
    audit['native_alpha'] = native
    (R / 'review' / f'{name}-alpha.json').write_text(json.dumps(audit, indent=2))
    if not native:
        print(name, 'REJECTED: missing native alpha', flush=True)
        continue
    a = np.array(im)
    a[:, :, 3] = np.where(a[:, :, 3] >= 128, 255, 0)
    a[a[:, :, 3] == 0, :3] = 0
    inp = R / 'inputs' / f'{name}.png'
    Image.fromarray(a).save(inp)
    rec = PixelArtReconstructor(str(inp))
    out = rec.run()
    Image.fromarray(out).save(R / 'reconstructed' / f'{name}-auto.png')
    fit = {'cell_size': rec.cell_size, 'offset': rec.offset, 'metrics': rec.last_metrics,
           'debug': rec.last_fit_debug, 'dimensions': list(out.shape[:2][::-1])}
    (R / 'reconstructed' / f'{name}-fit.json').write_text(json.dumps(fit, indent=2, default=lambda o:o.tolist() if hasattr(o, 'tolist') else str(o)))
    print(name, 'native RGBA', im.size, 'detected grid', rec.cell_size, 'recovered', out.shape, flush=True)
