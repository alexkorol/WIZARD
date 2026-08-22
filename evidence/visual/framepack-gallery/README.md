# Framepack gallery visual evidence

Captured from the exact acceptance server command:

`python3 -m http.server 8162 --bind 127.0.0.1 --directory .`

## Captures

- `gallery-1280x800.png` — valid fixture, 1280 × 800 viewport. PASS is visible, guides are enabled, and the compact (240 × 120), card (360 × 180), and panel (640 × 240) targets are all visible. DOM inspection found 5 state rows, 15 target cards, 15 previews, 75 visible guide elements, and no external image origins.
- `gallery-375x900.png` — valid fixture, 375 × 900 viewport. DOM inspection measured `innerWidth=375`, `documentElement.scrollWidth=360`, and `body.scrollWidth=360`; therefore the page has no horizontal document scroll. All 5 state rows and 15 target cards remain present.
- `gallery-invalid-slice-overflow-1280x800.png` — malformed fixture, 1280 × 800 viewport. The page shows one `slice-overflow` rejection, withholds the preview, and renders zero `.frame-preview` elements.

Exact visible rejection:

`[slice-overflow] component "panel" state "default": horizontal slice overflow: left 70 + right 70 must be less than width 128`

The captures were personally inspected at their recorded viewport sizes. No clipping obscures the required validation result, controls, or target labels.

## SHA-256

```text
7e9fe4ad41b15b8a357800a0df1281fc617e2bd2a9e75e01f6ffcfc38a5d620e  gallery-1280x800.png
0d7d837a83334078e177a5331dbd52aef1e74c6144971c0b5ffb83cd960bf9fb  gallery-375x900.png
1889e81e6ca7f48b91c5ed28561eaa8419ecc999e0e960f997896f1a247f2afc  gallery-invalid-slice-overflow-1280x800.png
```
