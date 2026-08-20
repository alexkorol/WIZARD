# WIZARD standardization status

Audit date: 2026-08-19  
Base: `origin/gh-pages` @ `81695a6`  
Task: `WIZARD-REVAMP-001`  
Scope: classify modules, map dependencies, and record what the revamp must change. This document is the Milestone 0 migration matrix and is updated as later milestones land.

## Repository shape

WIZARD is a static GitHub Pages site (`gh-pages`). Root `index.html` is a hand-maintained marketing dashboard. There is no root `package.json`, no `.github/workflows`, no module manifest, and no generated registry. Cards, README tables, and social metadata are three separate inventories.

Live URLs are path-stable today:

| Public URL | Files |
|---|---|
| `/` | `index.html` |
| `/tools/<name>/` | `tools/<name>/index.html` (wordcloud uses `dist/`) |

Default local run: `python -m http.server` from repo root.

## Classification

| Path | Public name | Class | Dashboard now | Target public surface | README | Tests | Preview |
|---|---|---|---|---|---|---|---|
| `tools/wizard_orbs` | Vessels of Life & Mana | **active** | featured + card | dashboard | yes | via `tools/performance.test.mjs` | `screenshots/shot_hero.png` |
| `tools/geometric_skilltree` | Geometric Passive Tree | **active** | card | dashboard | yes | 6 local suites + performance | none dedicated |
| `tools/rpg_inventory` | Vesselforge & Inventory | **active** | card (“Brands & Bonds”) | dashboard | yes | `core/test.js`, `core/verdigris-stats.test.js` | none dedicated |
| `tools/arcane_lattice` | Arcane Lattice | **active** | card | dashboard | yes | none local on `gh-pages` | none |
| `tools/cartographer` | Cartographer | **active** | card | dashboard | yes | `core/test.js` | none dedicated |
| `tools/mason` | Mason Terrain Forge | **active** | card | dashboard | yes | `core/test.js` | none dedicated |
| `tools/verdigris_splash` | Verdigris World Presentation | **active** | card | dashboard | yes | `validate.mjs` | world atlas assets, not a card thumb |
| `tools/rp_account_creator` | Chronicles: Houses & Scions | **active** | card | dashboard | **missing** | none | none |
| `tools/health_globe` | Health Globe v1 | **legacy/reference** | card | no primary card; files kept | none | none | none |
| `tools/pixelart` | Pixel Art Creator | **internal** | card | not a public card | yes | none | none |
| `tools/slerp` | SLerp | **internal** | card | not a public card | yes | none | none |
| `tools/pixel_sandbox` | Pixel Alchemy Sandbox | **archive candidate** | card | absent from all active surfaces | none | none | none |
| `tools/wordcloud` | Interactive Word Cloud | **archive candidate** | card | absent | yes | none | none |
| `tools/wordsphere` | WordSphere | **archive candidate** | card | absent | yes | none | none |
| `tools/space_shooter` | Wireframe Space Shooter | **archive candidate** | card | absent | yes | none | none |
| `tools/sokoban` | The Endless Descent | **archive candidate** | card | absent | yes | none | none |
| `tools/systems_bench` | Verdigris Systems Bench | **planned (M6)** | — | dashboard | — | — | — |

## Dependency map

```
index.html  (manual card inventory + marketing copy)
  ├─ tools/wizard_orbs          standalone WebGL2; predecessor link to health_globe in README
  ├─ tools/geometric_skilltree  loads ../rpg_inventory/core/verdigris-stats.js
  │                             localStorage bridge `verdigris-bridge` → rpg_inventory
  ├─ tools/rpg_inventory        React+Babel standalone; VesselForge engine in core/
  ├─ tools/arcane_lattice       Three.js r128 from CDN; no inbound deps
  ├─ tools/cartographer         core/mapgen.js (node + browser)
  ├─ tools/mason                core/mason.js (node + canvas)
  ├─ tools/verdigris_splash     ES modules; prefers HTTP; own asset pipeline
  └─ tools/rp_account_creator   standalone; lore mirrors verdigris-pack thematically only

tools/performance.test.mjs      skill tree harness + string contracts for orbs, cartographer, inventory
```

Cross-module runtime coupling that must be preserved:

- Geometric tree → `verdigris-stats.js` (script tag + tests).
- Geometric tree → Vesselforge armoury unlocks via `localStorage['verdigris-bridge']`.
- Inventory idle pointer contract asserted by `tools/performance.test.mjs`.

Inspected and **not** depended on by any active Verdigris workflow:

- `pixelart` — no imports from active modules.
- `slerp` — no imports from active modules (space_shooter uses Three.js `Quaternion.slerp`, not this tool).
- `health_globe` — documentation predecessor only.
- archive candidates — dashboard/README only.

## State APIs and designer surfaces already present

| Module | Persistence | Notes / designer | Calibration-shaped API |
|---|---|---|---|
| wizard_orbs | none | slider/status sim (`S`, `setHP`, `setMP`) | internal only; no `WizardModule` |
| geometric_skilltree | build code + `verdigris-skill-tree-build`; designer overrides; player notes in build payload | Notes (`N`, Alt-click); Designer (`D`, `?design=1`) mutates **live seats** via local overrides | player notes ≠ owner proposals; designer export *can* rewrite tree-data |
| rpg_inventory | versioned localStorage serialize/deserialize | review HTML tools, not in-module annotations | engine has serialize; no shared adapter |
| arcane_lattice | in-page weave state | none shared | do not change adjacency / instability / undo |
| cartographer | seed + generate options | none | engine JSON round-trip exists |
| mason | playground + PNG/JSON export | none | none shared |
| verdigris_splash | `?view=` / `?moment=` | none | presentation only |
| rp_account_creator | versioned house localStorage | none | none shared |

Important distinction for Milestone 5: existing Notes ride **playable build codes**. Existing Designer edits are **local seat overrides** that can export into `tree-data.js`. Owner design proposals must be a third store and must not mutate `assets/tree-data.js` or allocation state.

## Generated / pipeline files (do not treat as dashboard inventory)

- `tools/rpg_inventory` asset generation (`AGENTS.md`, `core/status.py`, staging dirs).
- `tools/verdigris_splash` world-asset Python/Blender pipeline; `tmp/` gitignored.
- `tools/wizard_orbs`: `index.html` is produced by `python3 build.py` from `src/template.html`. Adapter hooks must land in **both** or they vanish on rebuild.
- `tools/wordcloud/dist/` is a bundled SPA.
- No `modules.json` or `wizard.module.json` exists yet.

## Public-surface drift to fix

Root `index.html` currently advertises archive toys (sandbox, wordcloud, wordsphere, shooter, sokoban), internal utilities (pixelart, slerp), and legacy health globe as first-class cards. Title/description/Open Graph still say “AI-built interactive web experiments” and mention falling-sand sandboxes.

`README.md` repeats that inventory, including health globe and archive candidates. `AGENTS.md` only points at rpg_inventory generation and wizard_orbs.

Direct module URLs must keep working. Archive files must not be deleted in this PR.

## Out of scope (confirmed)

- Branch `codex/arcane-lattice-1-0` / PR #29 (lattice 1.0 polish; not on this branch).
- Physical deletion or relocation of archive candidates.
- Rewriting VesselForge item rules, authored tree data, or lattice adjacency.
- Embedding production Verdigris netcode.

## Milestone follow-through

| Milestone | Status |
|---|---|
| M0 Audit / this matrix | in progress |
| M1 Manifest schema + generated registry | pending |
| M2 Manifest-driven dashboard | pending |
| M3 Docs / metadata / operating standard | pending |
| M4 Shared calibration adapter | pending |
| M5 Annotation model + passive-tree proposals | pending |
| M6 Systems Bench + orb event proof | pending |
| M7 Root verify, CI, captures | pending |
