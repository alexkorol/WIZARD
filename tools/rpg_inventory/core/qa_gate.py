#!/usr/bin/env python3
"""QA gate for a staged art PNG. Catches known failure modes programmatically,
then prints the eyeball checklist for the ones only vision can judge.

Usage: python3 qa_gate.py assets_staging/NAME.png [P|L|S]
Exit code 0 = numeric checks pass; 1 = REJECT (do not stage/compose).
"""
import sys
import os
import numpy as np
from PIL import Image

TOL = 0.12          # aspect tolerance
BG_STD_MAX = 8.0    # background flatness (corner patches)
COVER_MIN = 0.07    # subject coverage of frame (cord jewelry runs ~8-12%)
COVER_MAX = 0.92
THIN_CLASSES = {'polearm'}   # corner-to-corner diagonals run 3-6% coverage
COVER_MIN_THIN = 0.025
EDGE_FRAC_MAX = 0.02  # fraction of border pixels the subject may touch


def fail(msgs, m):
    msgs.append(('FAIL', m))


def warn(msgs, m):
    msgs.append(('warn', m))


def item_class(path):
    """Look up the item's class in targets.tsv by art_id (filename stem)."""
    stem = os.path.basename(path).replace('.png', '')
    tsv = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                       'targets.tsv')
    if os.path.exists(tsv):
        for ln in open(tsv):
            p = ln.rstrip('\n').split('\t')
            if p and p[0] == stem and len(p) >= 2:
                return p[1]
    return None


def main():
    path = sys.argv[1]
    canvas = sys.argv[2] if len(sys.argv) > 2 else 'S'
    cover_min = (COVER_MIN_THIN if item_class(path) in THIN_CLASSES
                 else COVER_MIN)
    src = Image.open(path)

    # TRUE-ALPHA path (2026-07-06): ChatGPT sometimes outputs RGBA with a
    # real transparent bg. Judge from the ALPHA channel; NEVER flatten to
    # RGB first (the junk colors under transparent px read as a fake
    # gradient background and fail the flatness check spuriously).
    if src.mode == 'RGBA':
        al = np.asarray(src)[:, :, 3]
        if (al < 128).mean() > 0.02:
            h, w = al.shape
            m = al >= 128
            msgs = []
            want = {'P': 2 / 3, 'L': 3 / 2, 'S': 1.0}[canvas]
            ar = w / h
            if abs(ar - want) / want > TOL:
                # with true alpha, autocrop discards empty canvas — wrong
                # aspect can't squish the subject, so it's only a warning
                warn(msgs, f'aspect {ar:.2f} != canvas {canvas} '
                     f'({want:.2f}) - harmless with alpha (autocrop)')
            cover = m.mean()
            if cover < cover_min:
                fail(msgs, f'subject covers only {cover:.0%} - tiny/fragment')
            border = np.concatenate([m[0, :], m[-1, :], m[:, 0], m[:, -1]])
            ef = border.mean()
            if ef > EDGE_FRAC_MAX:
                fail(msgs, f'{ef:.1%} of border touched - item cropped by '
                     'frame edge')
            ok = not any(k == 'FAIL' for k, _ in msgs)
            print(f'{os.path.basename(path)}: {w}x{h} ar={ar:.2f} '
                  f'TRUE-ALPHA cover={cover:.0%} edge={ef:.2%} -> '
                  f'{"PASS" if ok else "REJECT"}')
            for k, m_ in msgs:
                print(f'  [{k}] {m_}')
            print('TRUE-ALPHA: no matte needed - art_matte.py uses the '
                  'alpha channel directly. Eyeball checklist still applies.')
            sys.exit(0 if ok else 1)

    img = src.convert('RGB')
    a = np.asarray(img).astype(int)
    h, w = a.shape[:2]
    msgs = []

    # 1. aspect matches canvas
    want = {'P': 2 / 3, 'L': 3 / 2, 'S': 1.0}[canvas]
    ar = w / h
    if abs(ar - want) / want > TOL:
        fail(msgs, f'aspect {ar:.2f} != canvas {canvas} ({want:.2f}) - '
             'squished/wrong canvas; regenerate with the right prefix')

    # 2. background flat + sampled color
    P = max(8, min(w, h) // 20)
    corners = [a[:P, :P], a[:P, -P:], a[-P:, :P], a[-P:, -P:]]
    cstack = np.concatenate([c.reshape(-1, 3) for c in corners])
    bg = cstack.mean(0)
    if cstack.std(0).max() > BG_STD_MAX:
        fail(msgs, f'background not flat (corner std {cstack.std(0).max():.1f})'
             ' - texture/vignette will break the matte')

    # 3. subject mask by distance from bg color
    dist = np.abs(a - bg).sum(2)
    m = dist > 48
    cover = m.mean()
    if cover < cover_min:
        fail(msgs, f'subject covers only {cover:.0%} - tiny/fragment render')
    if cover > COVER_MAX:
        fail(msgs, f'subject covers {cover:.0%} - background not keyable')

    # 4. crop check: subject touching frame edges
    border = np.concatenate([m[0, :], m[-1, :], m[:, 0], m[:, -1]])
    ef = border.mean()
    if ef > EDGE_FRAC_MAX:
        fail(msgs, f'{ef:.1%} of border touched by subject - item cropped by '
             'frame edge; regenerate ("entirely inside the frame")')

    # 5. warm-wash heuristic on bg (bg should be neutral grey, not sepia)
    if bg.max() - bg.min() > 18 and bg[0] > bg[2]:
        warn(msgs, f'background tinted warm (RGB {bg.astype(int)}) - check '
             'for sepia wash')

    ok = not any(k == 'FAIL' for k, _ in msgs)
    name = os.path.basename(path)
    print(f'{name}: {w}x{h} ar={ar:.2f} bg={bg.astype(int)} cover={cover:.0%} '
          f'edge={ef:.2%} -> {"PASS" if ok else "REJECT"}')
    for k, m_ in msgs:
        print(f'  [{k}] {m_}')
    print("""EYEBALL CHECKLIST (vision-only - look at the image and answer):
  - 3/4 hero angle with volume, not a flat museum photo?
  - COMPLETE object (helmet has back/dome, vest wraps a torso)?
  - Pair items (gloves/bracers/boots/greaves) shown as a PAIR?
  - Weapon proportions sane (spear shaft long, dagger not stubby,
    cords/loops long enough to wear)?
  - Reads as ONE cool game item (not two items, not a diorama)?
  - No spirals, no text, no extra materials beyond the DESC?""")
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
