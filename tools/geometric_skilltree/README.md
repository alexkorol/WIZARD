# Geometric Passive Tree

A standalone fantasy RPG passive tree demo. The tree keeps a strict geometric lattice, but the game language is now a dense passive-skill system: small passives, notables, masteries, keystones, path attributes, outer subtrees, and shape-combo bonuses.

Open `index.html` directly in a browser.

## Current Feature Set

- Ten-ring main hex lattice (331 nodes) with `INT` running center-to-up, `DEX` center-to-bottom-left, and `STR` center-to-bottom-right. A maxed character has 140 points after the Phase 0 overhaul scaffold, and a center-to-rim route now costs 20 points before optional side paths.
- Six hidden outer subtrees attached through shared gateway nodes on the main rim, similar in purpose to cluster/ascendancy-style expansions without copying Path of Exile layouts.
- A single skill-point pool: every node costs 1 point and every path or extra loop link costs 1 point, so travel distance is itself the build cost.
- Every seat is authored data (`assets/tree-data.js`, emitted by `scripts/author-tree.mjs`): 96 unique named seats across six spoke identities (Champion, Acrobat, Archmage, Reaver, Nightblade, Ritualist) and six themed wedges (Kiln Line, Procession, Drowned Study, Unlit Road, High Paths, Red Field). No procedurally generated content remains.
- Named seat plan by ring: doorway smalls (1), first notables (2), masteries (3), notable belt (4), the Waist — Waystones plus jewel sockets (5), keystones (6), class milestones (7), the Signs — birthsign keystones, exactly one allocatable per character (8), deep notables plus a second socket set (9), gateways and frontier notables (10).
- Passive nodes provide build effects such as weapon damage, wards, minion damage, evasion, recovery, marks, ailments, and hybrid bonuses.
- The derived-stat panel now consumes the shared Verdigris stat engine and leads with Effective HP and DPS against the standard mixed-pack profile. Per-allocation deltas surface headline changes first.
- Passive hierarchy is geometric rather than random: inner notables, fixed axis masteries, ordered outer keystone seats, and rim gateways occupy repeatable ring roles.
- Every node-to-node connection has two curved arc variants. Each arc has its own `STR`, `DEX`, and `INT` attribute mix.
- Allocation flow: clicking or tapping an inactive allocatable node immediately spends the node and conduit points.
- The automatic conduit choice favors the clicked node's STR/DEX/INT weighting; click the path afterward to switch to the alternate curved arc.
- Allocated conduits can be edited in place: click the alternate curve to switch stat routing, or click the current curve to open the conduit editor.
- Allocated conduits can be refunded without removing either endpoint node when another active route keeps the graph connected.
- Extra active-to-active arc allocation supports loop building and redundant routes.
- One-by-one respec: click or right-click allocated nodes to refund them when graph connectivity allows it; click extra loop arcs to refund those arcs.
- Outer subtree unlock rule: activate the shared rim gateway and complete at least one inner six-node circle.
- Pattern bonuses now detect waves, flows, great-wave meridians, radius 1-3 loop crowns, concentric crowns, vesica lenses, grand orbits, smooth mirror symmetry, trines, mandalas, redundant circuits, warding enclosures, rods, and crossroads.
- Waves empower the nodes along alternating-chirality paths; flows amplify the attribute output of same-chirality conduits; loops keep the center-node empowerment fantasy.
- The pattern panel lists every §5 pattern family, and the SVG debug overlay renders wave, flow, and rod paths alongside the existing loop-crown effects.
- Completed loops visibly empower their center node, increase that node's own in-game stat effect, and add weighted attribute resonance.
- Larger loop crowns render additional scalloped rings, perimeter petals, internal chords, pulse effects, and stronger center auras.
- Loop/combo effects are attribute-aware: STR reads as restrained vitality pulses, DEX as light whirlwind arcs, INT as celestial orbit/star marks, and hybrid nodes blend those motifs by weight.
- Nodes use weighted STR/DEX/INT SVG gradients so off-axis nodes visually blend their stat correspondence instead of using only three flat colors.
- Allocated outer nodes and conduits gain stronger stroke, glow, and color intensity to read as higher-tier progression without adding global layer bands.
- Concentric crowns (radius-1 plus radius-2 loops on one center) compound their empowerment multiplicatively; vesica lens nodes inherit half of each crowned center's empowerment.
- Four visual themes: modern, 90s RPG, stone dungeon, and terminal/ASCII.
- Search, undo, reset, pan/zoom, center, desktop hover tooltips, click/tap allocation, and right-click refund.
- Carved stones (jewels): click an allocated socket to open the stone picker. Five families — Whorl (plain mods), Eye (radius grants), Change (conduit attribute rewrites), Saga (seeded deterministic transforms; same seed, same story; limit one; conquered nodes ignore other stones), and Pattern (geometry benders resolved inside the detector, e.g. waves count longer, loops may miss one conduit). Stones swap freely; `assets/jewels.js` holds the stash and saga tables.
- Designer mode (`Design` button, `D` hotkey, or `?design=1`): seat inspector with live edits and registry-validated stat ids, status/type/stat/cluster overlays with legends, annotation pins, a lint panel with click-to-jump, localStorage-persisted overrides, and tree-data.js/annotation export plus merge-import. Player mode carries zero designer chrome.

## Interaction Model

1. Click or tap an allocatable node to allocate it immediately.
2. The tree automatically chooses the best available arc by matching the node's attribute leaning and preferring inward progression when scores tie.
3. Click an available arc between two already-allocated nodes to spend a conduit point on an extra loop route.
4. Click the alternate curve on an allocated conduit to switch its stat choice without unallocating either node.
5. Click the current curve on an allocated conduit to edit or refund that path when graph connectivity allows it.
6. Right-click an allocated conduit to refund that path directly; if it is required for connectivity, the build log explains why it is blocked.
7. Click or right-click an allocated node to refund it, unless doing so would disconnect allocated nodes from the origin.
8. Use `Undo`, `Reset`, zoom buttons, mouse wheel, and drag panning for planning.

## Game Design Rules

The demo uses a few rules that should survive if this is adapted into a full RPG:

- The origin has no build bonus. It only establishes the allocation root.
- Nodes should feel like passive powers. Paths should feel like stat and routing commitments.
- Path arcs are the travel-stat layer. They are intentionally analogous to travel nodes, but with a real routing choice between two curved stat variants.
- Small passives establish texture and travel value.
- Notables are local rewards and should shape build identity at repeatable ring seats.
- Masteries summarize a local school and sit on fixed axis milestones.
- Keystones should be rare and rule-changing, with tradeoffs; in the main lattice they belong at ordered outer seats, not scattered throughout.
- Gateways should touch the outside of the main tree and lead to compact, themed subtrees only after a shape-combo unlock.
- Geometric combo bonuses should reward deliberate shapes, not random wandering. Larger concentric loops around the same center should feel like a meaningful investment, not only a cosmetic flourish.
- Extra arc spending should matter because it enables loops, symmetry, redundant circuits, and alternate attribute routing.

## System Direction

The tree should behave like a full character progression system, not a decorative graph:

- Rings 1-2 are foundation picks: cheap passives, first notables, and early identity choices.
- Rings 3-4 are specialization: axis masteries and stronger local notables start to define a build's school.
- Rings 5-6 are advanced commitment: expensive outer routing, larger pattern payoffs, and the first keystone seats.
- Rings 7-8 are outer mastery: class-named milestones (Champion, Acrobat, Archmage) and the Signs — birthsign-style keystones with a defining bonus and a real price.
- Ring 9 is the pre-rim deep notable layer; ring 10 and attached subtrees are capstone expansion: gateways, build-defining routes, and optional endgame branches.
- Curved paths are the attribute/travel layer. Nodes are passive-effect rewards. Shape patterns are a third layer that converts geometry into build power.
- Node size and type should follow geometric rules: ring seats, axes, side midpoints, gateways, and earned pattern upgrades. Random large nodes are explicitly out of scope.

## PoE2 Export Review

Reference sources used for design study:

- GGG PoE2 passive tree export: <https://github.com/grindinggear/poe2-skilltree-export>
- Raw export inspected during this pass: <https://raw.githubusercontent.com/grindinggear/poe2-skilltree-export/main/data.json>
- PoE2 0.4 to 0.5 comparison report: <https://poe2-05-tree.netlify.app/>
- PoE2 build planner architecture reference: <https://github.com/poe2-tools/poe2-build-planner>

Measured from the GGG raw export during this pass:

- About 5,151 node records.
- About 1,621 groups.
- About 1,192 notables.
- About 368 mastery-like nodes.
- About 33 keystones.
- About 5,960 stat lines.

The important design takeaways are structural rather than cosmetic:

- PoE-style density comes from many small decisions, not only from large node count.
- Groups/orbits separate cluster identity from exact node position. This demo mirrors that with deterministic rings plus authored outer subtrees.
- Directed `in`/`out` and edge data make allocation feel like graph planning, not menu selection.
- Most power is spread across small passives and notables; keystones are comparatively rare and memorable.
- Naming mixes plain mechanical nodes with flavorful local rewards. This demo uses original names and generated categories rather than copying PoE names.
- Visual frames/icons matter because players need to distinguish travel, notable, mastery, keystone, and gateway decisions quickly.
- The 0.5 change report highlights how a mature tree evolves: new themes, jewel/gateway expansion, connection edits, and stat-line changes all matter independently.

## Implementation Notes

The app is a standalone HTML/SVG implementation with classic-script data assets. `assets/tree-data.js` defines `window.TREE_DATA`, including the Phase 0 bootstrap entries for every main-lattice seat and the central `patternTuning` table. `assets/patterns.js` defines the pure `VerdigrisPatterns` detector used by the runtime and tests. `../rpg_inventory/core/verdigris-stats.js` defines the shared stat registry and EHP/DPS math consumed by both this tree and Vesselforge. The main runtime classes are:

- `GeometricSkillTree`: builds nodes/conduits, handles allocation, refund, undo, stats, and shape bonuses.
- `SVGRenderer`: draws rings, axis lines, nodes, conduits, subtrees, tooltips, and render states.
- `UIController`: updates point pools, attributes, derived stats, selected node, shape bonuses, log, search, and theme controls.
- `ViewController`: handles pan, zoom, centering, and number-key conduit selection.

The geometry uses axial hex coordinates for the main lattice, rotated so the desired RPG axes read correctly on screen:

- `INT`: up from the origin.
- `DEX`: bottom-left from the origin.
- `STR`: bottom-right from the origin.

Subtrees use authored positions outside the main ring and connect through gateway nodes.

## Verification

Run the full suite:

```bash
node tools/geometric_skilltree/tests/progression.test.mjs
node tools/geometric_skilltree/tests/patterns.test.js
node tools/geometric_skilltree/tests/jewels.test.js
node tools/geometric_skilltree/tests/tree-data.test.mjs
node tools/geometric_skilltree/tests/runtime-smoke.test.mjs
node tools/geometric_skilltree/tests/balance.test.mjs
node tools/rpg_inventory/core/verdigris-stats.test.js
node tools/rpg_inventory/core/test.js
```

`balance.test.mjs` also maintains `tests/fixtures/reference-builds.json` — six
greedy archetype builds used as EHP/DPS canaries. Delete the file and re-run
after an intentional balance change to regenerate it. Run with
`BALANCE_MEASURE=1` to print observed cadence/share numbers without asserting.

The current UI is standalone and does not require a dev server.

## The 2026-07 overhaul, in short

What changed for anyone returning to this tool after June 2026:

- The tree grew to ten rings (331 seats) and every seat is now hand-authored —
  the old hash-generated filler is deleted. Six spoke identities (Champion,
  Acrobat, Archmage, Reaver, Nightblade, Ritualist) and six themed wedges.
- Geometry became buildcraft: waves, flows, meridians, loop crowns, vesicas,
  grand orbits, symmetry, circuits, enclosures, rods, and crossroads all
  detect, render, and pay through one tuning table.
- The tree and Vesselforge share one stat engine (`verdigris-stats.js`);
  Effective HP and DPS lead the sheet and every click shows its delta.
- Carved stones socket into the tree — five families including seeded
  saga-stones that deterministically rewrite whole neighborhoods.
- Ring-8 Signs are birthsign keystones (exactly one per life); ring-7 class
  callings unlock real gear slots on the Vesselforge page over a live bridge.
- Designer mode (press `D`) lets you inspect, rename, annotate, lint, and
  export the whole tree without leaving the page.
- A balance suite simulates six leveling archetypes and pins the pattern-power
  envelope so future edits can't silently break the cadence.
