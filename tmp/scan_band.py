# Compare v4 vs June scanline through life-orb top; map screen px -> art/mask space.
from PIL import Image
import math

ART_W, ART_H = 1672, 941
ORBL = (541.0, 484.5, 252.0)  # cx, cy (y-up), r  -- y-up in art space

v4 = Image.open(r"tmp/local_v4.png").convert("RGB")
jn = Image.open(r"tmp/june_settled.png").convert("RGB")
mask = Image.open(r"tools/wizard_orbs/src/assets/mask.png").convert("L").resize((ART_W, ART_H), Image.BILINEAR)

W, H = v4.size
# find stage rect: non-black bounding box
px = v4.load()
minx, maxx, miny, maxy = W, 0, H, 0
for y in range(0, H, 4):
    for x in range(0, W, 4):
        r, g, b = px[x, y]
        if r + g + b > 24:
            if x < minx: minx = x
            if x > maxx: maxx = x
            if y < miny: miny = y
            if y > maxy: maxy = y
print("stage bbox", minx, miny, maxx, maxy, "size", maxx - minx, maxy - miny)

sx = (maxx - minx) / ART_W
# life orb center in screen coords (art y is y-up; screen is y-down)
cx = minx + ORBL[0] * sx
cy = miny + (ART_H - ORBL[1]) * sx
print("life orb screen center", round(cx, 1), round(cy, 1), "r_screen", round(ORBL[2] * sx, 1))

pv4, pjn, pm = v4.load(), jn.load(), mask.load()
print(f"{'y':>4} {'rr':>6} {'p.y':>6} {'mask':>4}  {'v4':>14} {'june':>14}")
xi = int(round(cx))
for y in range(140, 220):
    ax = (xi - minx) / sx
    ay_down = (y - miny) / sx
    ay_up = ART_H - ay_down
    pxr = (ax - ORBL[0]) / ORBL[2]
    pyr = (ay_up - ORBL[1]) / ORBL[2]
    rr = math.hypot(pxr, pyr)
    mv = pm[int(ax), int(ay_down)]
    c4 = pv4[xi, y]
    cj = pjn[xi, y]
    print(f"{y:>4} {rr:6.3f} {pyr:6.3f} {mv:>4}  {str(c4):>14} {str(cj):>14}")
