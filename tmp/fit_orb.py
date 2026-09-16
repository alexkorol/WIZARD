# Fit the life-orb glass circle in each screenshot from the bright rim arc,
# then report rr + mask along the vertical center column.
from PIL import Image
import math, random

ART_W, ART_H = 1672, 941
ORBL = (541.0, 484.5, 252.0)

def fit_circle(pts):
    # algebraic least-squares circle fit
    n = len(pts)
    sx = sum(p[0] for p in pts); sy = sum(p[1] for p in pts)
    sxx = sum(p[0]**2 for p in pts); syy = sum(p[1]**2 for p in pts)
    sxy = sum(p[0]*p[1] for p in pts)
    sz = sum(p[0]**2 + p[1]**2 for p in pts)
    sxz = sum(p[0]*(p[0]**2+p[1]**2) for p in pts)
    syz = sum(p[1]*(p[0]**2+p[1]**2) for p in pts)
    # solve [sxx sxy sx; sxy syy sy; sx sy n] * [a b c] = [sxz syz sz]
    import numpy as np
    A = np.array([[sxx, sxy, sx],[sxy, syy, sy],[sx, sy, n]], float)
    B = np.array([sxz, syz, sz], float)
    a, b, c = np.linalg.solve(A, B)
    cx, cy = a/2, b/2
    r = math.sqrt(c + cx*cx + cy*cy)
    return cx, cy, r

def rim_pts(path):
    im = Image.open(path).convert("RGB")
    W, H = im.size
    px = im.load()
    pts = []
    for y in range(60, 260):
        for x in range(300, 700):
            r, g, b = px[x, y]
            if r > 190 and g > 130 and b > 130:  # pale rim highlight
                pts.append((x, y))
    return pts, im

for name, path in [("v4", r"tmp/local_v4.png"), ("june", r"tmp/june_settled.png")]:
    pts, im = rim_pts(path)
    # RANSAC-ish: fit on subsample, keep if residual small
    best = None
    for _ in range(200):
        smp = random.sample(pts, 60)
        try:
            cx, cy, r = fit_circle(smp)
        except Exception:
            continue
        if not (100 < r < 320 and 350 < cx < 650):
            continue
        inl = [p for p in pts[::7] if abs(math.hypot(p[0]-cx, p[1]-cy) - r) < 2.0]
        if best is None or len(inl) > best[3]:
            best = (cx, cy, r, len(inl))
    cx, cy, r, ni = best
    scale = r / 252.0
    print(f"{name}: circle center=({cx:.1f},{cy:.1f}) r={r:.1f} inliers={ni} scale={scale:.4f}")

    mask = Image.open(r"tools/wizard_orbs/src/assets/mask.png").convert("L").resize((ART_W, ART_H), Image.BILINEAR)
    pm, pim = mask.load(), im.load()
    print(f"  {'y':>4} {'rr':>6} {'p.y':>6} {'mask':>4}  color")
    xi = int(round(cx))
    for y in range(int(cy - r) - 10, int(cy - r) + 60, 2):
        ax = ORBL[0]  # center column
        # screen->art: derive stage origin from circle: cx = ox + 541*scale
        ox = cx - ORBL[0] * scale
        oy = cy - (ART_H - ORBL[1]) * scale
        ay_down = (y - oy) / scale
        ay_up = ART_H - ay_down
        pyr = (ay_up - ORBL[1]) / ORBL[2]
        rr = abs(pyr)
        mv = pm[int(ax), int(ay_down)]
        print(f"  {y:>4} {rr:6.3f} {pyr:6.3f} {mv:>4}  {pim[xi, y]}")
