#!/usr/bin/env python3
"""Remove a flat generated matte colour from item art.

Use this for ChatGPT batch images that cannot reliably return real alpha. The
input should be an item on one flat, uniform background colour such as the
loadout-extraction slate matte (#737A68). Unlike art_matte.py, this keys the
background colour everywhere it appears, including ring holes, chain gaps, and
other interior openings.

Usage:
  python3 chroma_key.py <source_dir> [name ...] --out <clean_dir>

Names may be file stems or PNG filenames. Outputs default to
<name>_clean.png unless --replace is passed.
"""
import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image


SOFT_DEFAULT = 7.0
HARD_DEFAULT = 46.0
ALPHA_CROP_THRESHOLD = 8


def sample_background(arr):
    h, w = arr.shape[:2]
    patch = max(6, min(h, w) // 25)
    corners = np.concatenate([
        arr[:patch, :patch].reshape(-1, 3),
        arr[:patch, -patch:].reshape(-1, 3),
        arr[-patch:, :patch].reshape(-1, 3),
        arr[-patch:, -patch:].reshape(-1, 3),
    ])
    return np.median(corners, axis=0)


def chroma_key(
    src,
    soft=SOFT_DEFAULT,
    hard=HARD_DEFAULT,
    crop=True,
    pad=16,
    decontaminate=True,
):
    rgb = src.convert('RGB')
    arr = np.asarray(rgb).astype(np.float32)
    bg = sample_background(arr)
    dist = np.max(np.abs(arr - bg), axis=2)

    alpha = np.clip((dist - soft) / max(1.0, hard - soft), 0, 1)
    alpha[dist <= soft] = 0
    alpha[dist >= hard] = 1

    # Pull the sampled matte colour out of antialiased edge pixels. This does
    # not fix reflected colour baked into opaque pixels, but it removes the
    # visible one-pixel matte halo without blurring the item.
    out_rgb = arr.copy()
    semi = (alpha > 0.02) & (alpha < 0.98)
    if decontaminate and np.any(semi):
        a = alpha[semi][:, None]
        out_rgb[semi] = np.clip((arr[semi] - bg * (1 - a)) / np.maximum(a, 0.02), 0, 255)

    out = Image.fromarray(np.dstack([out_rgb, alpha * 255]).astype(np.uint8), 'RGBA')
    if crop:
        bbox = out.getchannel('A').point(lambda px: 255 if px > ALPHA_CROP_THRESHOLD else 0).getbbox()
        if bbox:
            l, t, r, b = bbox
            out = out.crop((max(0, l - pad), max(0, t - pad),
                            min(out.width, r + pad), min(out.height, b + pad)))
    return out, bg


def source_names(source_dir, names):
    if names:
        for name in names:
            stem = name[:-4] if name.endswith('.png') else name
            yield stem
        return
    for p in sorted(source_dir.glob('*.png')):
        if p.name.endswith('_mask.png') or p.name.endswith('_mask_raw.png'):
            continue
        yield p.stem


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source_dir')
    ap.add_argument('names', nargs='*')
    ap.add_argument('--out', default=None, help='output directory; defaults to source_dir')
    ap.add_argument('--soft', type=float, default=SOFT_DEFAULT)
    ap.add_argument('--hard', type=float, default=HARD_DEFAULT)
    ap.add_argument('--no-crop', action='store_true')
    ap.add_argument('--replace', action='store_true',
                    help='write <name>.png instead of <name>_clean.png; use only after preserving originals')
    ap.add_argument(
        '--no-decontaminate',
        action='store_true',
        help=(
            'preserve source RGB in semitransparent pixels; use when matte '
            'division creates false red/magenta speckling inside brown or '
            'olive-adjacent subject textures'
        ),
    )
    args = ap.parse_args()

    source_dir = Path(args.source_dir)
    out_dir = Path(args.out) if args.out else source_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    done = 0
    for stem in source_names(source_dir, args.names):
        src_path = source_dir / f'{stem}.png'
        if not src_path.exists():
            print(f'skip {stem}: no PNG')
            continue
        out, bg = chroma_key(Image.open(src_path), soft=args.soft, hard=args.hard,
                             crop=not args.no_crop,
                             decontaminate=not args.no_decontaminate)
        out_name = f'{stem}.png' if args.replace else f'{stem}_clean.png'
        out_path = out_dir / out_name
        out.save(out_path, optimize=True)
        semi = sum(1 for a in out.getchannel('A').getdata() if 8 <= a < 248)
        try:
            shown_path = os.path.relpath(out_path, source_dir)
        except ValueError:
            shown_path = str(out_path)
        print(f'ok   {stem}: bg=#{int(bg[0]):02x}{int(bg[1]):02x}{int(bg[2]):02x} '
              f'-> {shown_path} ({out.width}x{out.height}, semialpha={semi})')
        done += 1
    print(f'\n{done} keyed')


if __name__ == '__main__':
    main()
