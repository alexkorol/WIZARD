# Geometric Skill Tree Overhaul Log

Newest entries first. This is the running memory for the north-star overhaul.

## 2026-07-12 — Phase 0 scaffolding and tenth ring

- Read `NORTH-STAR.md`, `research/POE1-PASSIVES.md`, and `research/POE2-PASSIVES.md` in full before code changes.
- Generated `assets/tree-data.js` as a Phase 0 bootstrap dump: 331 explicit main-lattice seats, `mainRingDepth: 10`, `startPoints.skill: 140`, designer `status`/`notes`/`clusterId` metadata, and ring-10 gateway entries.
- Patched `index.html` to load `assets/tree-data.js` as a classic script before the app runtime. `buildMainTree()` now consumes authored seat data first and only falls back to the old procedural pools if a seat is missing.
- Moved the six subtree gateways from ring-9 corners to ring-10 corners: `10,0`, `0,-10`, `-10,10`, `10,-10`, `-10,0`, `0,10`.
- Added `tests/tree-data.test.mjs` as the Phase 0 coverage lint: it verifies 331 seats, exact ten-ring coordinate coverage, gateway placement, designer metadata, and file-compatible classic-script loading with no runtime `fetch()`.
- Added `tests/runtime-smoke.test.mjs`, a no-browser standalone runtime smoke that evaluates `tree-data.js` and the main app script in classic-script order against a small DOM shim. It verifies initialization, 331 main nodes, 140 points, and subtree roots attached to the six ring-10 gateways.
- Updated README and UI copy from nine rings/271 nodes/123 points to ten rings/331 nodes/140 points.

Acceptance notes:

- `node tools/geometric_skilltree/tests/progression.test.mjs` passes.
- `node tools/geometric_skilltree/tests/tree-data.test.mjs` passes.
- `node tools/geometric_skilltree/tests/runtime-smoke.test.mjs` passes.
- Browser verification caveat: the in-app browser refused direct `file://` navigation under its URL policy. I did not work around that with another browser surface. File-compatibility is covered by tests: classic scripts only, data loaded before runtime, no `fetch()`, no module script, and runtime initialization through the same script order.

Carry-forward notes:

- The Phase 0 bootstrap intentionally preserves the old generated content vocabulary, including repeated names and placeholder effects. Phase 4 must replace this with authored wedge-by-wedge data and then delete the procedural fallback pools.
- Gateway data is explicit now, even though `buildSubtrees()` still overwrites the same names/effects during runtime. Keep it this way so designer export has complete seat coverage.
