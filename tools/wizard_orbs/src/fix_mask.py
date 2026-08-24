#!/usr/bin/env python3
"""Repair tools/wizard_orbs/src/assets/mask.png.

The orb overlay shader gates all liquid/glass rendering with
    a = texture(uMask, uv).r * smoothstep(1.015, 0.995, r)
so wherever the mask is white over a statue / frame pixel of art.jpg,
the dynamic fill paints on top of the foreground art ("fill clips into
frames/statues"). The authored mask carves the two hands, but the carves
are undersized and the mana statue's head/hair and the bright metal rim
are not carved at all.

This script carves every bright, low-saturation (marble / metal) pixel
inside each orb disc that is connected to the disc boundary — i.e. the
statues leaning on the glass and the frame rim — then feathers the edge
and writes the mask back at its original 836x470 resolution.
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
R_INNER = 1.06    # only carve inside the disc (+ rim allowance)
RING_LO, RING_HI = 0.72, 1.06  # statue/frame components must touch this ring

art = np.asarray(Image.open(ASSETS / "art.jpg").convert("RGB")).astype(np.float64) / 255.0
mx = art.max(axis=2)
mn = art.min(axis=2)
sat = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0.0)
luma = art.mean(axis=2)

yy, xx = np.mgrid[0:ART_H, 0:ART_W].astype(np.float64)
cand = np.zeros((ART_H, ART_W), dtype=bool)
ring = np.zeros((ART_H, ART_W), dtype=bool)
for cx, cy_up, r in ORBS:
    cy = ART_H - cy_up  # shader constants are y-up
    rr = np.hypot(xx - cx, yy - cy) / r
    inside = rr < R_INNER
    cand |= inside & (luma > LUMA_MIN) & (sat < SAT_MAX)
    ring |= (rr >= RING_LO) & (rr < RING_HI)

# Downsample to mask resolution for the flood fill (fast, and the mask
# lives at this resolution anyway).
half = (ART_W // 2, ART_H // 2)  # 836x470 (941 -> 470, nearest row drop)
cand_h = np.asarray(Image.fromarray(cand).resize(half, Image.BOX)) > 0.35
grown = np.asarray(Image.fromarray(cand & ring).resize(half, Image.BOX)) > 0.35

# Flood the candidate mask from the ring seeds (repeated 3x3 dilation).
for _ in range(500):
    dil = np.asarray(
        Image.fromarray(grown).filter(ImageFilter.MaxFilter(3))
    )
    new = dil & cand_h
    if (new == grown).all():
        break
    grown = new

carve = grown.astype(np.uint8) * 255
carve_img = Image.fromarray(carve).filter(ImageFilter.MaxFilter(5))  # +2px safety
carve_img = carve_img.filter(ImageFilter.GaussianBlur(1.1))          # feathered AA edge
carve_f = np.asarray(carve_img).astype(np.float64) / 255.0

mask = Image.open(ASSETS / "mask.png").convert("L")
assert mask.size == half, mask.size
m = np.asarray(mask).astype(np.float64) / 255.0
m *= 1.0 - carve_f
out = Image.fromarray(np.clip(m * 255.0, 0, 255).astype(np.uint8), "L")
out.save(ASSETS / "mask.png")
print(f"carved {int(grown.sum())} half-res px; mask.png rewritten")
