# assets + tools — FK-107

Procedural asset pipeline. `tools/generate_assets.py` (Python stdlib +
Pillow, deterministic/seeded) generates:

- `assets/textures/panel.png` — nine-slice arcane window frame
  (slice 12,4x4 corners), sidecar `panel.json`
- `assets/textures/slot.png` — recessed inventory slot nine-slice (slice 12)
- `assets/sprites/orb-{vitality,mana,essence}.png` — 16x16 orb sprites

Sidecars follow INTERFACES.md: `{ "slice": [t,r,b,l], "width", "height" }`.

Commands (run from this directory):

    python generate_assets.py           # regenerate all assets
    python generate_assets.py --check   # byte-for-byte reproduction proof

`assets/demo.html` shows the panel texture via `border-image` with a
pure-CSS fallback underneath.
