# Framepack gallery visual evidence

Captured from the exact acceptance server command:

`python3 -m http.server 8162 --bind 127.0.0.1 --directory .`

## Captures

- `gallery-1280x800.png` — valid fixture, 1280 × 800 viewport. PASS is visible, guides are enabled, and the compact (240 × 120), card (360 × 180), and panel (640 × 240) targets are all visible. DOM inspection found 5 state rows, 15 target cards, 15 previews, 75 visible guide elements, and no external image origins.
- `gallery-375x900.png` — valid fixture, 375 × 900 viewport. DOM inspection measured `innerWidth=375`, `documentElement.scrollWidth=375`, and `body.scrollWidth=375`; therefore the page has no horizontal document scroll. All 5 state rows and 15 target cards remain present.
- `gallery-invalid-slice-overflow-1280x800.png` — malformed fixture, 1280 × 800 viewport. The page shows one `slice-overflow` rejection, withholds the preview, and renders zero `.frame-preview` elements.

Exact visible rejection:

`[slice-overflow] component "panel" state "default": horizontal slice overflow: left 70 + right 70 must be less than width 128`

The captures were personally inspected at their recorded viewport sizes. No clipping obscures the required validation result, controls, or target labels.

## SHA-256

```text
abf02113a33d0717f6c05a8263d996f3bf81ac0d438d386ef2db0da1b57c4a6b  gallery-1280x800.png
bc84feee36b6c1dc979a2b79a26c534868e7d343a3eb9612e3b26e0a43de7a5e  gallery-375x900.png
d2c534135ed34f6abf8c341c00c79101e00e6b5a3aeb003f6a8a879801450828  gallery-invalid-slice-overflow-1280x800.png
```
