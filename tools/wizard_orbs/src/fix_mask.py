#!/usr/bin/env python3
"""Repair tools/wizard_orbs/src/assets/mask.png.

The orb overlay shader gates all liquid/glass rendering with
    a = texture(uMask, uv).r * smoothstep(1.015, 0.995, r)
so wherever the mask is white over a statue / frame pixel of art.jpg,
the dynamic fill paints on top of the foreground art ("fill clips into
frames/statues"). The authored mask carves the two hands, but the carves
are undersized and the mana statue's head/hair and parts of the bright
metal frame rim are not carved at all.

Carve rules (learned the hard way — do NOT seed inside the disc):
- Candidate pixels are bright + unsaturated (marble / metal): liquid sits
  at saturation ~0.99 and empty glass is dark, so neither qualifies.
- Seeds live OUTSIDE the glass edge (rr in [1.01, 1.20]); the flood only
  follows candidate components that physically cross the frame. Glass
  glint arcs at the top of the sphere never touch that ring, so the top
  cap stays dynamic (an earlier version seeded from rr 0.72 and carved
  the entire glint band — at full fill it showed the static art's dark
  glass: "parts of the liquid not showing").
- Deep pixels (rr < 0.985) are kept only where the flooded component is a
  dense blob (statue mass), never a thin arc tendril.
- The rim band (rr >= 0.985) is always safe to carve: dynamic liquid
  never rises past p.y ~ 0.94, and the aligned art plate shows the same
  rim pixels underneath.

Writes the mask back at its original 836x470 resolution.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ASSETS = Path(__file__).parent / "assets"
ART_W, ART_H = 1672, 941
# Orb geometry baked into src/orb.frag (art pixels, y-up)
ORBS = [(541.0, 484.5, 252.0), (1128.0, 483.0, 252.0)]

LUMA_MIN = 0.25   # statue marble / metal rim are bright
SAT_MAX = 0.30    # ...and unsaturated; liquid sits at sat ~0.99
CAND_MAX_R = 1.25   # candidates may roam outside the disc (statue bodies)
SEED_LO, SEED_HI = 1.01, 1.20   # flood starts OUTSIDE the glass edge
RIM_MIN_R = 0.985   # frame band: always safe to carve (see docstring)
DEEP_BLUR = 5       # half-res px; blob density radius
DEEP_MIN_DENSITY = 0.30

art = np.asarray(Image.open(ASSETS / "art.jpg").convert("RGB")).astype(np.float64) / 255.0
mx = art.max(axis=2)
mn = art.min(axis=2)
sat = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0.0)
luma = art.mean(axis=2)

yy, xx = np.mgrid[0:ART_H, 0:ART_W].astype(np.float64)
cand = np.zeros((ART_H, ART_W), dtype=bool)
seeds = np.zeros((ART_H, ART_W), dtype=bool)
rr_all = np.full((ART_H, ART_W), 99.0)
for cx, cy_up, r in ORBS:
    cy = ART_H - cy_up  # shader constants are y-up
    rr = np.hypot(xx - cx, yy - cy) / r
    rr_all = np.minimum(rr_all, rr)
    here = (luma > LUMA_MIN) & (sat < SAT_MAX)
    cand |= here & (rr < CAND_MAX_R)
    seeds |= here & (rr >= SEED_LO) & (rr < SEED_HI)

# Downsample to mask resolution for the flood (fast, and the mask lives
# at this resolution anyway).
half = (ART_W // 2, ART_H // 2)  # 836x470
to_half = lambda a: np.asarray(Image.fromarray(a).resize(half, Image.BOX)) > 0.35
cand_h, grown = to_half(cand), to_half(seeds)
rr_h = np.asarray(
    Image.fromarray((np.clip(rr_all / 1.5, 0, 1) * 255).astype(np.uint8)).resize(half, Image.BOX)
).astype(np.float64) / 255.0 * 1.5

# Flood the candidate mask from the outside ring (repeated 3x3 dilation).
for _ in range(600):
    new = np.asarray(Image.fromarray(grown).filter(ImageFilter.MaxFilter(3))) & cand_h
    if (new == grown).all():
        break
    grown = new

# Rim band: carve whatever the flood reached near/over the frame edge.
carve = grown & (rr_h >= RIM_MIN_R) & (rr_h < 1.08)

# Deep statue mass: density-filtered blobs only (kills thin glint tendrils).
deep = grown & (rr_h < RIM_MIN_R)
density = np.asarray(
    Image.fromarray(deep.astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(DEEP_BLUR))
).astype(np.float64) / 255.0
blobs = density > DEEP_MIN_DENSITY
carve |= blobs
# Keep the rim/statue transition hugging each blob (frame near the head etc.)
carve |= grown & np.asarray(
    Image.fromarray(blobs).filter(ImageFilter.MaxFilter(31))
)
carve &= rr_h < 1.08

carve_img = Image.fromarray(carve.astype(np.uint8) * 255)
carve_img = carve_img.filter(ImageFilter.MaxFilter(5))     # +2px safety
carve_img = carve_img.filter(ImageFilter.GaussianBlur(1.1))  # feathered AA edge
carve_f = np.asarray(carve_img).astype(np.float64) / 255.0

mask = Image.open(ASSETS / "mask.png").convert("L")
assert mask.size == half, mask.size
m = np.asarray(mask).astype(np.float64) / 255.0
m *= 1.0 - carve_f
out = Image.fromarray(np.clip(m * 255.0, 0, 255).astype(np.uint8), "L")
out.save(ASSETS / "mask.png")
print(f"carved {int(carve.sum())} half-res px (blobs {int(blobs.sum())}); mask.png rewritten")
