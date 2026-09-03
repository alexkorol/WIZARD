# gui_framekit — frozen interfaces (wave 1)

This file is the contract every FK packet codes against. It is frozen for the
wave; changes arrive only as orchestrator commits with a D-number.

## Hard rules

- No build step. Vanilla HTML + CSS + JS ES modules. GitHub Pages static.
- Everything visual is driven by CSS custom properties from
  `tokens/tokens.css`. Component CSS must not contain color/length literals
  except `0`, `100%`, and token fallbacks like `var(--fk-x, #000)`.
- Every component lives at `components/<group>/<name>/` and ships:
  `<name>.css`, `<name>.js` (optional), and `demo.html` (standalone page that
  imports `../../../tokens/tokens.css` then the component CSS).
- Class prefix `fk-`; one root class per component: `.fk-<name>`.
- JS, when present, is an optional progressive-enhancement ES module
  exporting `init(root: HTMLElement): void`. Components must render and read
  correctly with CSS alone.

## Frozen token names (FK-101 implements exactly these)

Colors: `--fk-bg-0`, `--fk-bg-1`, `--fk-bg-2`, `--fk-fg-0`, `--fk-fg-1`,
`--fk-accent`, `--fk-accent-2`, `--fk-ok`, `--fk-warn`, `--fk-danger`,
`--fk-border`, `--fk-border-hi`, `--fk-frame-bg`, `--fk-frame-edge`

Spacing scale (4px base): `--fk-space-1` … `--fk-space-6`
Shape/type: `--fk-radius`, `--fk-border-w`, `--fk-font`, `--fk-font-mono`,
`--fk-text-1`, `--fk-text-2`, `--fk-text-3`

## Frozen component paths (FK-108 imports exactly these)

- `components/frames/window/` · `panel/` · `dialog/`
- `components/controls/button/` · `input/` · `slider/` · `toggle/` · `tabs/`
- `components/hud/bar/` · `globe/` · `orb/` · `meter/` · `buff-icon/`
- `components/inventory/grid/` · `slot/` · `item-tooltip/` · `drag-ghost/`
- `components/overlays/modal/` · `menu/` · `toast/` · `context-menu/`

## Assets (FK-107)

Nine-slice textures land in `assets/textures/<name>.png` with sidecar
`<name>.json` (`{ "slice": [top, right, bottom, left], "width", "height" }`),
referenced by components via `border-image` with a pure-CSS fallback.
Generation scripts live in `tools/gui_framekit/tools/` (Python stdlib +
Pillow or Node — lane's choice, pinned in its README).

## Aesthetic target

Dark arcane laboratory: deep near-black backgrounds, verdigris/teal accents,
warm brass highlights, engraved borders, readable mono for numbers. Match the
existing WIZARD modules' mood; do not invent a second visual language.
