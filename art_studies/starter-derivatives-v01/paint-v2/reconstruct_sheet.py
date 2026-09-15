"""Recover an inspected detector candidate; preserve pixels during registration.

This writes candidates only. A complete cycle still needs visual acceptance.
No resampling, keying, per-frame auto-centering or invented missing frames.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, 'Z:/Code/Python/pixel-perfecter')
from pixel_perfecter.reconstructor import PixelArtReconstructor

ROOT = Path(__file__).resolve().parent


def reconstruct(raw, clip, half, pitch, origin):
    raw = Path(raw)
    with Image.open(raw) as im:
        if im.mode != 'RGBA' or im.getchannel('A').getextrema()[0] != 0 or im.getchannel('A').getextrema()[1] < 250:
            raise ValueError('Original PNG must contain native transparent and substantially opaque alpha')
        pixels = np.array(im)
        raw_size = list(im.size)
    pixels[:, :, 3] = np.where(pixels[:, :, 3] >= 128, 255, 0)
    pixels[pixels[:, :, 3] == 0, :3] = 0
    rec = PixelArtReconstructor(image=pixels)
    rec.use_hough = False
    auto = rec.run()
    (ROOT / 'review' / f'{clip}-detector.json').write_text(json.dumps(rec.last_fit_debug, indent=2, default=str))
    candidate = next(c for c in rec.last_fit_debug['candidates'] if c['size'] == pitch)
    if candidate['gated_out']:
        raise ValueError('Selected grid failed the detector variance gate')
    rec.cell_size = pitch
    rec.offset = tuple(candidate['offset'])
    recovered = Image.fromarray(rec._empirical_pixel_reconstruction())
    for folder in ('review', 'candidate-frames'):
        (ROOT / folder).mkdir(exist_ok=True)
    key = f'{clip}-{half}' if half else f'{clip}-full'
    Image.fromarray(auto).save(ROOT / 'review' / f'{key}-auto.png')
    recovered.save(ROOT / 'review' / f'{key}-recovered.png')
    manifest = json.loads((ROOT.parent / 'manifest-blender.json').read_text())
    references = manifest['clips'][clip]['frames'][(half-1)*4:half*4] if half else manifest['clips'][clip]['frames']
    columns = 2 if half else 4
    report = {'raw_sha256': hashlib.sha256(raw.read_bytes()).hexdigest(),
              'raw_file': raw.name, 'raw_size': raw_size, 'native_alpha': True,
              'alpha_policy': 'Threshold returned alpha at 128; no color key',
              'detector_candidates': rec.last_fit_debug['candidates'],
              'selected_candidate': candidate, 'recovered_size': recovered.size,
              'registration': list(origin), 'frame_size': [96, 96],
              'anchor': [48, 80], 'visual_acceptance': False, 'frames': []}
    for i, ref in enumerate(references):
        box = tuple(round(v) for v in (i%columns*recovered.width/columns, i//columns*recovered.height/2,
                                      (i%columns+1)*recovered.width/columns, (i//columns+1)*recovered.height/2))
        cell = recovered.crop(box)
        frame = cell.crop((origin[0], origin[1], origin[0]+96, origin[1]+96))
        a, b = np.array(cell), np.array(frame)
        yy, xx = np.nonzero(a[:, :, 3])
        if not len(xx) or len(xx) != np.count_nonzero(b[:, :, 3]):
            raise ValueError(f'{key} phase {i+1}: empty frame or clipped foreground')
        if not np.array_equal(a[yy, xx], b[yy-origin[1], xx-origin[0]]):
            raise ValueError('Registration changed foreground pixels')
        if b[0,:,3].any() or b[-1,:,3].any() or b[:,0,3].any() or b[:,-1,3].any():
            raise ValueError('Foreground touches frame border')
        reference_path = ROOT.parent / ref['src']
        if hashlib.sha256(reference_path.read_bytes()).hexdigest() != ref['sha256']:
            raise ValueError('Blender reference has changed')
        p = ROOT / 'candidate-frames' / Path(ref['src']).name
        frame.save(p)
        report['frames'].append({'file': p.name, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(),
                                 'bbox': frame.getbbox(), 'reference': ref,
                                 'source_crop': box, 'all_foreground_pixels_preserved': True})
    (ROOT / 'review' / f'{key}-reconstruction.json').write_text(json.dumps(report, indent=2))
    print(key, len(references), 'candidate frames; all recovered foreground pixels preserved; visual review required')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('raw')
    parser.add_argument('clip')
    parser.add_argument('half', type=int, choices=[0, 1, 2], help='0 for a complete 4x2 sheet')
    parser.add_argument('--pitch', type=int, required=True)
    parser.add_argument('--origin', type=int, nargs=2, required=True)
    args = parser.parse_args()
    reconstruct(args.raw, args.clip, args.half, args.pitch, args.origin)
