# Derive screen->art mapping from the red liquid circle in each screenshot,
# then rescan the life-orb top band.
from PIL import Image
import math

ART_W, ART_H = 1672, 941
ORBL = (541.0, 484.5, 252.0)
INNER = 0.9  # placeholder, will confirm from shader

def red_bbox(path):
    im = Image.open(path).convert("RGB")
    W, H = im.size
    px = im.load()
    minx, maxx, miny, maxy = W, 0, H, 0
    for y in range(0, H, 2):
        for x in range(0, W // 2, 2):  # left orb only
            r, g, b = px[x, y]
            if r > 200 and g < 95 and b < 95:
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
    return im, (minx, miny, maxx, maxy)

for name, path in [("v4", r"tmp/local_v4.png"), ("june", r"tmp/june_settled.png")]:
    im, bb = red_bbox(path)
    cx = (bb[0] + bb[2]) / 2
    cy = (bb[1] + bb[3]) / 2
    r = (bb[2] - bb[0]) / 2
    print(name, "red bbox", bb, "center", round(cx,1), round(cy,1), "r", round(r,1))
