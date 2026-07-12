# Geometric Skill Tree Overhaul Log

Newest entries first. This is the running memory for the north-star overhaul.

## 2026-07-12 — Phase 3: designer mode

- Added `DesignerController` to `index.html`: toggled by the `Design` toolbar button, the `D` hotkey, or `?design=1`. Player mode carries zero designer chrome — the panel, heatmap, and pins exist only while `body.designer-on` is set.
- Seat inspector: in design mode a plain click inspects a seat instead of allocating (Shift+click keeps allocation so a node can be felt immediately). Editable fields: name, type, status (`empty/draft/review/final/cut`), stat (validated against the shared registry with a datalist of every id and alias; unknown ids are rejected), amount, tags, cluster id, effect lines, and free-text notes. Edits apply live to the running tree and node visuals.
- Overlays: status heatmap (default), node-type coverage, stat coverage, and cluster map, each with a legend; hash-colored for open vocabularies. Annotation pins mark seats with human-written notes (the Phase 0 bootstrap boilerplate note is excluded) and show the note on hover.
- Lint panel: missing seat entries, `empty` seats, unresolved stat ids, duplicate named seats, smalls without cluster ids, orphan local edits. Clicking an issue selects and centers the offending seat (new `ViewController.focusOn`). The bootstrap data immediately shows its known duplicates ("Berserker", "Gladiator", …) — the Phase 4 kill list.
- Data flow: edits persist to localStorage as per-seat overrides and are merged onto `TREE_DATA.seats` before the tree builds, so sessions survive reloads without touching the repo file. "Export tree-data.js" downloads a complete classic-script file body for committing back; "Export annotations" emits the overrides as JSON; import merges either format by seat and reports conflicts to the build log; "Clear local edits" resets to repo data.
- Decisions: subtree seats are authored in `SUBTREES` and are read-only in the inspector for now; conduits have no authored data yet so the inspector is node-focused. Both revisit in Phase 4/5.

Acceptance notes:

- New runtime smoke test drives the whole flow headlessly: toggle, inspect-not-allocate, rename/status/note edit, override tracking, export body contents, registry rejection, Shift+click allocation, clean disable. All 5 smoke tests green; full suite green.
- Browser-verified over localhost: clicked a ring-5 mastery, renamed it "Blue Arithmetic" with a review status and a note through the real form; edit survived a reload via localStorage merge; exactly one annotation pin rendered; `D` returned to a chrome-free player mode. Test edits cleared afterward.

## 2026-07-12 — Phase 2 complete: concentric compounding and vesica lenses

- Closed the two remaining §5.3 gaps from the WIP commit. Concentric crowns (radius-1 plus radius-2 loops around one center) now compound their empowerment multiplicatively instead of summing; the loop-empowerment curve moved into a named `LOOP_EMPOWER_TUNING` block. Verified live: an r1+r2 center reads 189% total increased effect (1.42 × 2.0 compounded) versus 154% under the old additive formula.
- Vesica lens nodes now inherit a tunable share (`patternTuning.vesica.lensShare`, 0.5) of each crowned center's loop empowerment, delivered through `getNodeBoost` so it stacks additively with wave/rod boosts per the §5.7 stacking law. The origin contributes nothing as a vesica center, honoring the "origin has no build bonus" rule.
- Tooltips gained explicit "Concentric crown" and "vesica lens" lines; `patterns.js` and the `tree-data.js` `patternTuning` block both carry the new vesica tunable.
- Extended `tests/patterns.test.js`: vesicas expose exactly two lens nodes adjacent to both centers, and the tuning clone carries `lensShare` through to the app layer.

Acceptance notes:

- All suites green: patterns (8), runtime smoke (4), tree-data (4), progression (3), verdigris-stats (44).
- Browser-verified over localhost (Phase 0's file:// blocker bypassed with a static server): built a twin-loop vesica plus an r1+r2 concentric crown in the live app; pattern panel, tooltips, and headline EHP/DPS all respond; console clean.

## 2026-07-12 — Phase 1 stat engine

- Added `tools/rpg_inventory/core/verdigris-stats.js`, a zero-dependency UMD module shared by Vesselforge and the passive tree.
- Implemented the Phase 1 stat vocabulary: Physical, Ember, River, Storm, Gloam; STR/DEX/INT conversions; Life/Spirit/Ward/Guard/Evasion/Accuracy/Block/resistance layers; Gloam bypassing Ward; Ward recharge; EHP profiles for bruiser, ember caster, and mixed pack; additive `increased` vs protected multiplicative `more`.
- Added `tools/rpg_inventory/core/verdigris-stats.test.js` with 44 stat checks covering registry aliases, caps, mitigation order, EHP, offense math, item-base reading, and legacy sheet fields.
- Rewired `verdigris-pack.js` so `derive()` delegates to `VerdigrisStats.deriveSheet()`. The Vesselforge character panel now surfaces EHP, Guard, Evasion, Block, and Ember/River/Storm/Gloam resistances.
- Rewired `tools/geometric_skilltree/index.html` to load the same stat module. Tree `computeStats()` now converts active nodes, boosts, shape bonuses, and conduit attributes into shared-stat inputs; the derived panel leads with Effective HP and DPS, and runtime smoke verifies a first allocation renders headline deltas.

Acceptance notes:

- `node tools/rpg_inventory/core/verdigris-stats.test.js` passes (44 tests).
- `node tools/rpg_inventory/core/test.js` passes.
- `node tools/geometric_skilltree/tests/progression.test.mjs` passes.
- `node tools/geometric_skilltree/tests/tree-data.test.mjs` passes.
- `node tools/geometric_skilltree/tests/runtime-smoke.test.mjs` passes.

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
