#!/usr/bin/env python3
"""Reconcile Gemini mattes with the art itself.

The art sits on pure #000 black, so:
  - any pixel with luma > ART_LIT is certainly subject  -> union into mask
  - an enclosed mask hole whose art content is lit is a matte error -> fill
  - an enclosed hole over black art is a REAL background gap -> keep
Then keep the largest connected component. Idempotent.

Usage: python3 fix_masks.py STAGING_DIR name [name ...]
"""
import sys
import os
import numpy as np
from PIL import Image
from scipy import ndimage

ART_LIT = 26      # luma above this = definitely subject
HOLE_LIT = 16     # mean hole luma above this = matte error, fill it


def fix(staging, name):
    mp = os.path.join(staging, f'{name}_mask.png')
    ap = os.path.join(staging, f'{name}.png')
    art = Image.open(ap).convert('L')
    mask_img = Image.open(mp).convert('L')
    if mask_img.size != art.size:
        mask_img = mask_img.resize(art.size, Image.LANCZOS)
    m = np.array(mask_img) > 128
    a = np.array(art)
    before = m.mean()
    # 1. union with clearly lit art
    m |= (a > ART_LIT)
    # 2. largest component only
    labels, n = ndimage.label(m)
    if n > 1:
        sizes = ndimage.sum(m, labels, range(1, n + 1))
        m = labels == (1 + int(np.argmax(sizes)))
    # 3. fill enclosed holes that cover lit art; keep true background gaps
    holes, hn = ndimage.label(~m)
    border = set(np.unique(np.concatenate([
        holes[0, :], holes[-1, :], holes[:, 0], holes[:, -1]])))
    filled_px = 0
    kept = 0
    for i in range(1, hn + 1):
        if i in border:
            continue                      # touches frame edge = background
        sel = holes == i
        if a[sel].mean() > HOLE_LIT:
            m[sel] = True                 # matte error over visible art
            filled_px += int(sel.sum())
        else:
            kept += 1                     # legit hole (background shows)
    Image.fromarray((m * 255).astype(np.uint8), 'L').save(mp)
    print(f'{name}: white {before:.3f} -> {m.mean():.3f}, '
          f'filled {filled_px} error px, kept {kept} real hole(s)')


if __name__ == '__main__':
    staging = sys.argv[1]
    for nm in sys.argv[2:]:
        fix(staging, nm)
