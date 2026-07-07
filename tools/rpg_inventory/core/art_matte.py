#!/usr/bin/env python3
"""Derive a clean binary alpha matte directly from item art.

The art is generated on a FLAT, UNIFORM background (mid-grey, blue-grey, or the
old pure black) that is distinct from the item. This matte samples the actual
background colour from the image corners and keys against it, so it works for
any flat backdrop — no generative matte needed.

Algorithm:
  1. sample bg colour = median of the four corner patches.
  2. background = pixels close to bg colour (Chebyshev distance < tol) reachable
     by flood-fill from the border. Tolerance is tight for near-black backdrops
     (so dark item parts survive) and looser for flat colour backdrops (where
     items are far from the bg colour anyway).
  3. subject = the rest; keep largest connected component; fill interior holes
     so recesses (helmet eye-slits, bowl interiors) stay OPAQUE.
  4. only for KEEP_HOLES forms (ring, sling, gorget, curio): re-open genuine
     see-through holes (enclosed regions that are large AND mostly bg-coloured).

Usage: python3 art_matte.py <staging_dir> [name ...]   (no names = all art)
Writes <staging_dir>/<name>_mask.png (pure white subject on black).
"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

MIN_HOLE = 700   # min px for an enclosed region to count as a real see-through hole

# forms whose icons have GENUINE see-through holes (background visible through
# them). Everything else keeps interior recesses OPAQUE (a helmet's eye slits
# show its dark interior, not the inventory slot behind it).
KEEP_HOLES = {'ring', 'sling', 'gorget', 'curio'}


def matte(art_path, keep_holes=False):
    src = Image.open(art_path)
    # TRUE-ALPHA fast path (2026-07-06): ChatGPT image gen now sometimes
    # outputs RGBA with a real transparent background. The alpha channel IS
    # the matte — no keying. (RGB values under transparent px are junk;
    # never flatten before checking.)
    if src.mode == 'RGBA':
        al = np.asarray(src)[:, :, 3]
        if (al < 128).mean() > 0.02:
            m = al >= 128
            lbl, n = ndimage.label(m)
            if n > 1:
                sizes = ndimage.sum(m, lbl, range(1, n + 1))
                m = lbl == (1 + int(np.argmax(sizes)))
            if not keep_holes:
                m = ndimage.binary_fill_holes(m)
            # bg_luma -1 marks the true-alpha path in the log line
            return (m * 255).astype(np.uint8), float(m.mean()), 0, -1.0
    a = np.asarray(src.convert('RGB')).astype(np.float32)
    h, w = a.shape[:2]
    P = max(6, min(h, w) // 25)
    corners = np.concatenate([
        a[:P, :P].reshape(-1, 3), a[:P, -P:].reshape(-1, 3),
        a[-P:, :P].reshape(-1, 3), a[-P:, -P:].reshape(-1, 3)])
    bg_col = np.median(corners, axis=0)
    bg_luma = float(0.299 * bg_col[0] + 0.587 * bg_col[1] + 0.114 * bg_col[2])
    dist = np.abs(a - bg_col).max(axis=2)          # per-pixel distance from bg
    tol = 6.0 if bg_luma < 24 else 34.0            # tight for black, looser for colour bg
    isbg = dist < tol
    border = np.zeros((h, w), bool)
    border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True
    bg = ndimage.binary_propagation(border & isbg, mask=isbg)
    subj = ndimage.binary_closing(~bg, iterations=1)
    lab, n = ndimage.label(subj)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        subj = lab == (int(np.argmax(sizes)) + 1)
    subj = ndimage.binary_fill_holes(subj)
    reopened = 0
    if keep_holes:
        pure_tol = tol * 0.7
        enclosed = subj & (dist < tol)
        lh, nh = ndimage.label(enclosed)
        if nh:
            idx = range(1, nh + 1)
            sizes = np.array(ndimage.sum(np.ones_like(lh), lh, idx))
            pure = np.array(ndimage.sum((dist < pure_tol).astype(np.float32), lh, idx))
            frac = pure / np.maximum(sizes, 1)
            real = {k for k in idx if sizes[k - 1] > MIN_HOLE and frac[k - 1] > 0.6}
            if real:
                subj[np.isin(lh, list(real))] = False
                reopened = len(real)
    return (subj * 255).astype(np.uint8), float(subj.mean()), reopened, bg_luma


def main():
    staging = sys.argv[1]
    names = sys.argv[2:]
    if not names:
        names = sorted(f[:-4] for f in os.listdir(staging)
                       if f.endswith('.png') and not f.endswith('_mask.png')
                       and not f.endswith('_mask_raw.png'))
    for nm in names:
        p = os.path.join(staging, f'{nm}.png')
        if not os.path.exists(p):
            print(f'skip {nm}: no art'); continue
        keep = nm.split('_')[0] in KEEP_HOLES
        m, cov, holes, bgl = matte(p, keep_holes=keep)
        Image.fromarray(m, 'L').save(os.path.join(staging, f'{nm}_mask.png'))
        print(f'ok   {nm}: coverage={cov:.3f} holes={holes} keep={keep} bg_luma={bgl:.0f}')


if __name__ == '__main__':
    main()
