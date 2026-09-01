# FrameKit

FrameKit is WIZARD's reusable interface language for Verdigris, built from
the generated marble-and-brass sheet art. It is static, dependency-free, and
GitHub Pages-compatible.

## Game demo (flagship)

Open `game/index.html` for the playable game-UI demo. Every visible surface
is real cropped sheet art — nothing is redrawn in CSS:

- **Character screen** — the composed character/inventory spread with live
  equipment slots, a 13x8 drag-and-drop inventory grid, charm and relic
  sockets, a quick-use belt, and an inspect panel.
- **Skill web** — the constellation sheet with 40 auto-detected, clickable
  node hotspots and a point budget.
- **HUD** — portrait, health/mana bars with live depletion, a ten-slot
  ability rack with cooldown sweeps and keybinds 1-0, buffs, and an XP rail.
- **Settings** — a winged modal with art-swapped toggles, dropdown, and
  button states.

## Asset pipeline

`tools/crop_game_assets.py` cuts `game/assets/` from the source sheets in
`assets/concepts/`. It auto-detects sprite bounds on each sheet (bright
components over the dark ground), slot wells inside composed panels (dark
rectangles), and skill-web node positions (two-pass ring/disc detection),
writing pixel geometry to `game/assets/layout.json`. Re-run it after
replacing any concept sheet; the demo reads all coordinates from the
generated layout.

## Workbench

`index.html` is the older owner-facing component workbench (tokens, density
and accent controls, copyable patterns). `INTERFACES.md` remains the wave-one
compatibility contract, individual standalone demos live beside each
component, and `docs/ADOPTION.md` describes how existing WIZARD modules adopt
the kit. Only the generated annotations on the source sheets are
noncanonical: their labels and implied mechanics do not define the game's
interface model.
