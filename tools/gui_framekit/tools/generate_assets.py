#!/usr/bin/env python3
"""gui_framekit procedural asset generator — FK-107.

Generates nine-slice panel textures (PNG + sidecar JSON per INTERFACES.md)
and simple item sprites. Python stdlib + Pillow only; deterministic output
(seeded noise, no timestamps) so re-running reproduces byte-identical files.

Usage:
  python generate_assets.py            # regenerate everything
  python generate_assets.py --check    # verify outputs reproduce exactly

Outputs land in ../assets/textures/ and ../assets/sprites/ relative to this
script. Slice geometry is recorded in each texture's sidecar JSON as
{ "slice": [top, right, bottom, left], "width", "height" }.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent / "assets"
TEXTURES = ASSETS / "textures"
SPRITES = ASSETS / "sprites"

# Palette mirrors tokens/tokens.css (FK-101) so textures match the kit.
PALETTE = {
    "bg": (13, 12, 10),          # --fk-bg-0
    "panel": (16, 15, 12),       # --fk-bg-1
    "raised": (22, 19, 16),      # --fk-bg-2
    "edge": (138, 113, 70),      # --fk-frame-edge (brass edge)
    "hi": (201, 169, 106),       # --fk-border-hi (brass highlight)
    "accent": (201, 162, 39),    # --fk-accent
    "teal": (76, 169, 154),      # --fk-accent-2
}

PANEL_SIZE = 48
SLICE = 12  # 4x scale of the 1px engraved border look


def _noise(img: Image.Image, seed: str, amount: int = 6) -> None:
    """Deterministic speckle noise keyed by seed."""
    px = img.load()
    w, h = img.size
    stream = hashlib.sha256(seed.encode()).digest()
    counter = 0
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b = px[x, y][:3]
            d = ((stream[counter % len(stream)] * 31 + counter) % (2 * amount + 1)) - amount
            px[x, y] = (max(0, min(255, r + d)), max(0, min(255, g + d)), max(0, min(255, b + d)), 255)
            counter += 1


def make_panel_texture() -> tuple[Image.Image, dict]:
    """Nine-slice arcane window frame: brass border, dark center, engraving."""
    img = Image.new("RGBA", (PANEL_SIZE, PANEL_SIZE), PALETTE["panel"])
    d = ImageDraw.Draw(img)

    # Outer frame band (brass edge) with inner engraved line.
    d.rectangle([0, 0, PANEL_SIZE - 1, PANEL_SIZE - 1], outline=PALETTE["edge"], width=2)
    d.rectangle([2, 2, PANEL_SIZE - 3, PANEL_SIZE - 3], outline=PALETTE["hi"], width=1)
    d.rectangle([SLICE, SLICE, PANEL_SIZE - SLICE - 1, PANEL_SIZE - SLICE - 1],
                fill=PALETTE["panel"])
    d.rectangle([SLICE, SLICE, PANEL_SIZE - SLICE - 1, PANEL_SIZE - SLICE - 1],
                outline=(60, 52, 40, 255))

    # Corner studs (brass dots).
    for cx, cy in ((5, 5), (PANEL_SIZE - 6, 5), (5, PANEL_SIZE - 6), (PANEL_SIZE - 6, PANEL_SIZE - 6)):
        d.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=PALETTE["accent"])

    _noise(img, "fk-panel")
    meta = {"slice": [SLICE, SLICE, SLICE, SLICE], "width": PANEL_SIZE, "height": PANEL_SIZE}
    return img, meta


def make_slot_texture() -> tuple[Image.Image, dict]:
    """Nine-slice inventory slot: recessed dark cell with faint brass rim."""
    img = Image.new("RGBA", (32, 32), PALETTE["bg"])
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 31, 31], outline=PALETTE["edge"], width=1)
    d.rectangle([SLICE // 2, SLICE // 2, 32 - SLICE // 2 - 1, 32 - SLICE // 2 - 1],
                fill=PALETTE["panel"])
    _noise(img, "fk-slot", amount=4)
    meta = {"slice": [SLICE, SLICE, SLICE, SLICE], "width": 32, "height": 32}
    return img, meta


def make_sprite_orb(name: str, color: tuple[int, int, int, int]) -> tuple[Image.Image, dict]:
    """16x16 radial orb sprite with highlight."""
    size = 16
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([1, 1, size - 2, size - 2], fill=color, outline=PALETTE["hi"])
    d.ellipse([4, 4, 7, 7], fill=(255, 255, 255, 180))
    _noise(img, f"fk-{name}", amount=3)
    return img, {"width": size, "height": size}


GENERATORS = {
    ("textures", "panel.png"): make_panel_texture,
    ("textures", "slot.png"): make_slot_texture,
    ("sprites", "orb-vitality.png"): lambda: make_sprite_orb("vitality", (127, 191, 163, 255)),
    ("sprites", "orb-mana.png"): lambda: make_sprite_orb("mana", (76, 169, 154, 255)),
    ("sprites", "orb-essence.png"): lambda: make_sprite_orb("essence", (200, 50, 58, 255)),
}


def build_all() -> dict[str, bytes]:
    out: dict[str, bytes] = {}
    for (subdir, fname), gen in GENERATORS.items():
        if subdir == "textures":
            img, meta = gen()
            target = TEXTURES / fname
        else:
            img, meta = gen()
            target = SPRITES / fname
        target.parent.mkdir(parents=True, exist_ok=True)
        import io
        buf = io.BytesIO()
        img.save(buf, "PNG")
        data = buf.getvalue()
        target.write_bytes(data)
        sidecar = target.with_suffix(".json")
        payload = json.dumps(meta, indent=2, sort_keys=True) + "\n"
        sidecar.write_bytes(payload.encode())
        out[str(target.relative_to(ASSETS))] = data
        out[str(sidecar.relative_to(ASSETS))] = payload.encode()
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true",
                    help="verify regeneration reproduces existing files byte-for-byte")
    args = ap.parse_args()

    fresh = build_all()
    if args.check:
        bad = []
        for rel in list(fresh):
            p = ASSETS / rel
            if not p.exists():
                bad.append(f"missing: {rel}")
                continue
            if hashlib.sha256(p.read_bytes()).hexdigest() != hashlib.sha256(fresh[rel]).hexdigest():
                bad.append(f"drift: {rel}")
        if bad:
            print("\n".join(bad))
            return 1
        print(f"OK: {len(fresh)} assets reproduce byte-for-byte")
        return 0

    print(f"wrote {len(fresh)} files under {ASSETS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
