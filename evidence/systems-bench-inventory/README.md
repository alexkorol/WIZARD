# Systems Bench inventory evidence

- `inventory-session-1280x800.png` — inventory fixture at playhead `#2` / `1400ms`, with the inert target preview and raw event payload visible.
- `catalog-session-375x900.png` — narrow fixture catalog/session view at `375x900`; runtime measurement recorded `documentElement.scrollWidth = 360`, `body.scrollWidth = 360`, and `innerWidth = 375` (no horizontal body overflow).

Both captures were produced from `http://127.0.0.1:8171/tools/systems_bench/index.html?fixture=inventory-state.v1` after rebasing the implementation onto production base `bd209c34b2697540275daa00757aff3a18377aad`.
