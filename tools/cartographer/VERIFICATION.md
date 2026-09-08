# Cartographer checkpoint evidence

2026-09-08, branch `codex/cartographer-expeditions`.

- `node tools/cartographer/core/expedition.test.js`: 1,200 seeds across four
  recipes and three sizes; deterministic complete packets, all walkable cells
  connected, reciprocal sockets with three clear cells, safe unique encounter
  anchors, continuous routes, lossless JSON and malformed-import rejection.
- Existing `core/test.js`: 17,032 checks, zero failures.
- `node scripts/wizard-lab.mjs verify --full`: PASS after the new launch,
  manifest generation and addition of the expedition suite to the verifier.
- Real browser at loopback port 6517: inspected the textured necropolis and
  causeway, world/topology/automap switches, fog reveal, keyboard movement,
  generation controls and import. Imported `fixtures/necropolis-2718.json`,
  regenerated its numeric seed and confirmed the same seven rooms, 49-tile
  guardian route, three optional rooms, one loop and 24 monsters. Movement
  updates the canvas accessibility description to the current tile.
- Responsive inspection: desktop workspace keeps its controls scrollable and
  map visible; 390 × 844 viewport stacks controls and map with no horizontal
  overflow. Temporary viewport override reset after checking.
- Browser console: no errors in the tested flow.
- Native parity: Verdigris's `native/tools/check_cartography_parity.cjs`
  compares 1,200 generated C++/JS fingerprints, including every terrain tile,
  room variant/rotation/depth/tier, graph edge, socket and encounter count.
  All passed. This proves generator parity; native gameplay/presentation
  integration has separate gates in the Verdigris checkout.

Generated asset and exact prompt: `assets/PROVENANCE.md`. Research source
limitations and application: `RESEARCH.md`.
