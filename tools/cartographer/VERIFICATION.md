# Continuous-terrain correction — 2026-09-08

Supersedes the room-grid presentation described in the historical checkpoint below.

- Five biome materials visually inspected in the real browser: woodland grass,
  wetland grass/soil, volcanic scree, necropolis stone and sanctuary stone.
- Three seeds per biome inspected in `landscape-review.html`: actual collision
  contours, off-grid landmarks, merged clearings and curved routes.
- Normal browser load rolled seed 3593716629; unlocked Forge rolled 176627825,
  changing the route from 83 to 62 tiles. Locked Forge preserved 176627825 and
  its metrics. Subsequent biome switches rolled fresh seeds.
- New default: 96 × 78 cells, compact extent, three side destinations, one loop.
  No repeated internal waystone markers. Browser error log empty.
- Full laboratory verification passed after manifest/renderer changes.
- Outdoor material sources and exact built-in imagegen prompts are recorded in
  `assets/OUTDOOR-PROVENANCE.md`; each texture was viewed before integration.

## Historical checkpoint (superseded geometry)

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
- Export map and Save image were clicked in the real browser without errors.
- Browser console: no errors in the tested flow.
- Native parity: Verdigris's `native/tools/check_cartography_parity.cjs`
  compares 1,200 generated C++/JS fingerprints, including every terrain tile,
  room variant/rotation/depth/tier, graph edge, socket and encounter count.
  All passed. This proves generator parity; native gameplay/presentation
  integration has separate gates in the Verdigris checkout.

Generated asset and exact prompt: `assets/PROVENANCE.md`. Research source
limitations and application: `RESEARCH.md`.

Native integration shipped in Verdigris checkpoint
[`e2f814340`](https://github.com/alexkorol/verdigris/commit/e2f81434053a463a3cb07db35d894ffa08f4e0d2):
authoritative generated collision/population/loot, normal-protocol map publication,
textured native terrain and a discovery atlas. All 62 client scenarios passed;
full native evidence lives in that repository's `docs/rebuild/cartography/`.

## Map-reading grammars — 2026-09-09

Based on synced `gh-pages` commit `dceb692`; working branch
`codex/cartographer-map-reading`. Only Cartographer and its generated registry
entries changed.

- `node tools/cartographer/core/expedition.test.js`: existing 1,500 natural maps
  pass; this entry point now also loads the 1,350-map layout suite.
- `node tools/cartographer/core/layouts.test.js`: three new grammars × five
  biomes × three extents × 30 seeds. Checks deterministic full packets, JSON
  round trips, safe reachable encounters, physical three-wide socket clearance,
  reserved circuit void and extra loop budgets. Includes all four orientations.
- The crypt test seals exactly the three-cell terminal door and proves the
  guardian becomes unreachable. The circuit test seals each entrance arm
  separately and proves the other remains usable. A widened port was found
  during development and fixed by reserving more bend clearance.
- Direct comparison against `git show dceb692:tools/cartographer/core/expedition.js`:
  100 natural maps (five biomes × 20 seeds) match tiles, rooms, gates, boss,
  axis, main path, encounters and entities exactly. Natural packets remain v3.
- `node scripts/wizard-lab.mjs verify --full`: PASS (19 manifests, 9 dashboard
  modules). Registry regenerated from the module manifest.
- Real browser, loopback port 6523, seed 2718: inspected Cathedral and Crypt
  automaps, door tint and rotated bearings. Crypt entry faces west and terminal
  approach faces south, correctly preserving a relative left turn.
- Circuit inspected in Automap and World: distinct arms enclose a void and
  converge before the guardian. Exploration hides the rest of the map and shows
  gold frontier segments. Two left-arrow inputs moved from (77,37) to (75,37).
- Locked seed survived layout switches. Layout and seed survive a browser reload
  via the URL fragment. Canvas fit follows walkable bounds. Browser error log empty.
- Existing v2 fixture still imports. New grammars export v4; separate native
  generator parity has not been implemented or claimed for these layouts.

The actual game reference images inspected, source links, and the boundary
between evidence and our design synthesis are recorded in `RESEARCH.md`.
