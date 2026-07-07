#!/usr/bin/env python3
"""Sanitize Gemini web mattes before compose_assets.py.

- Hard-binarize at 128 (kills soft gradients → compose keeps crisp edge)
- Keep only the largest white connected component (kills Gemini's sparkle
  watermark and stray specks)
- Reports what changed; idempotent.

Usage: python3 cleanup_masks.py STAGING_DIR [name ...]
"""
import sys
import os
import numpy as np
from PIL import Image
from scipy import ndimage


def otsu(a):
    hist, _ = np.histogram(a, bins=256, range=(0, 256))
    total = a.size
    sum_all = np.dot(np.arange(256), hist)
    sum_b = 0.0
    w_b = 0.0
    best_t, best_var = 128, -1.0
    for t in range(256):
        w_b += hist[t]
        if w_b == 0:
            continue
        w_f = total - w_b
        if w_f == 0:
            break
        sum_b += t * hist[t]
        m_b = sum_b / w_b
        m_f = (sum_all - sum_b) / w_f
        var = w_b * w_f * (m_b - m_f) ** 2
        if var > best_var:
            best_var, best_t = var, t
    return best_t


def clean(path):
    raw = path.replace('_mask.png', '_mask_raw.png')
    if os.path.exists(raw):
        img = Image.open(raw).convert('L')   # re-clean from pristine raw
    else:
        img = Image.open(path).convert('L')
        img.save(raw)                        # stash pristine copy once
    a = np.array(img)
    # Mattes are white-on-black: anything clearly above background is subject.
    # (Gemini sometimes renders the "white" region as mid-grey; Otsu then
    # splits inside the subject, so use a low fixed threshold instead.)
    t = 40
    binary = a >= t
    labels, n = ndimage.label(binary)
    if n == 0:
        print(f'{os.path.basename(path)}: EMPTY mask?!')
        return
    sizes = ndimage.sum(binary, labels, range(1, n + 1))
    keep = 1 + int(np.argmax(sizes))
    out = np.where(labels == keep, 255, 0).astype(np.uint8)
    removed = int(binary.sum() - (out > 0).sum())
    mid_before = int(((a > 24) & (a < 232)).sum())
    Image.fromarray(out, 'L').save(path)
    print(f'{os.path.basename(path)}: {n} components, kept largest '
          f'({int(sizes[keep-1])} px), removed {removed} stray px, '
          f'binarized {mid_before} mid-tone px')


if __name__ == '__main__':
    staging = sys.argv[1]
    names = sys.argv[2:]
    files = ([os.path.join(staging, f'{n}_mask.png') for n in names] if names
             else [os.path.join(staging, f) for f in sorted(os.listdir(staging))
                   if f.endswith('_mask.png')])
    for p in files:
        if os.path.exists(p):
            clean(p)
        else:
            print(f'missing: {p}')
