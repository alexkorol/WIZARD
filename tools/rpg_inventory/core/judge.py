#!/usr/bin/env python3
"""Judge a generated item PNG against the Verdigris reject checklist (numeric part).

Checks:
1. Background pure black: sample 4 corner patches, mean must be very dark.
2. Yellow/sepia cast: brightest 5% of pixels, R/B ratio. >1.18 = warm reject,
   1.10-1.18 = borderline (visual call).
3. Size / aspect ratio report.

Usage: python3 judge.py file.png [file2.png ...]
"""
import sys
from PIL import Image

def judge(path):
    img = Image.open(path).convert('RGB')
    w, h = img.size
    px = img.load()
    # corners
    corner_means = []
    P = max(8, min(w, h) // 20)
    for cx, cy in [(0, 0), (w - P, 0), (0, h - P), (w - P, h - P)]:
        tot = [0, 0, 0]
        for x in range(cx, cx + P):
            for y in range(cy, cy + P):
                r, g, b = px[x, y]
                tot[0] += r; tot[1] += g; tot[2] += b
        n = P * P
        corner_means.append(tuple(t / n for t in tot))
    corner_max = max(max(c) for c in corner_means)
    # bright-pixel white balance
    small = img.resize((128, 128))
    data = sorted(small.getdata(), key=lambda p: sum(p), reverse=True)
    top = data[:max(1, len(data) // 20)]
    r = sum(p[0] for p in top) / len(top)
    g = sum(p[1] for p in top) / len(top)
    b = sum(p[2] for p in top) / len(top)
    rb = r / max(b, 1)
    verdict_bg = 'OK' if corner_max < 12 else ('SOFT' if corner_max < 30 else 'FAIL')
    verdict_wb = 'OK' if rb < 1.10 else ('BORDERLINE' if rb <= 1.18 else 'WARM-FAIL')
    ar = w / h
    print(f"{path.split('/')[-1]}: {w}x{h} ar={ar:.2f} | bg corner max={corner_max:.1f} [{verdict_bg}] | "
          f"highlights R={r:.0f} G={g:.0f} B={b:.0f} R/B={rb:.3f} [{verdict_wb}]")

if __name__ == '__main__':
    for p in sys.argv[1:]:
        judge(p)
