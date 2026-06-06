# Geometric Passive Tree

A standalone fantasy RPG passive tree demo. The tree keeps a strict geometric lattice, but the game language is now a dense passive-skill system: small passives, notables, masteries, keystones, path attributes, outer subtrees, and shape-combo bonuses.

Open `index.html` directly in a browser.

## Current Feature Set

- Seven-ring main hex lattice with `INT` running center-to-up, `DEX` center-to-bottom-left, and `STR` center-to-bottom-right.
- Six hidden outer subtrees attached through shared gateway nodes on the main rim, similar in purpose to cluster/ascendancy-style expansions without copying Path of Exile layouts.
- Separate point pools:
  - Skill points allocate passive nodes.
  - Conduit points allocate paths and extra loop links.
- Passive nodes provide build effects such as weapon damage, wards, minion damage, evasion, recovery, marks, ailments, and hybrid bonuses.
- Every node-to-node connection has two curved arc variants. Each arc has its own `STR`, `DEX`, and `INT` attribute mix.
- Allocation flow: clicking an inactive node opens an arc chooser. Pick the curved arc that should carry the new connection.
- Extra active-to-active arc allocation supports loop building and redundant routes.
- One-by-one respec: click or right-click allocated nodes to refund them when graph connectivity allows it; click extra loop arcs to refund those arcs.
- Outer subtree unlock rule: activate the shared rim gateway and complete at least one inner six-node circle.
- Shape bonuses detect:
  - Six-node circles around an allocated center.
  - Straight axis chains.
  - Mirrored left/right allocation.
  - Redundant circuit paths.
- Completed six-node circles render animated radiating rings, pulse effects, and spoke patterns around the empowered center.
- Nodes use weighted STR/DEX/INT SVG gradients so off-axis nodes visually blend their stat correspondence instead of using only three flat colors.
- Four visual themes: modern, 90s RPG, stone dungeon, and terminal/ASCII.
- Search, undo, reset, pan/zoom, center, hover tooltips, and right-click refund.

## Interaction Model

1. Click an allocatable node to allocate it.
2. If the node has one eligible allocated neighbor, the conduit is selected automatically.
3. The side-panel chooser lists each curved arc option. Click a highlighted arc or press `1`-`9`.
4. Click an available arc between two already-allocated nodes to spend a conduit point on an extra loop route.
5. Click or right-click an allocated node to refund it, unless doing so would disconnect allocated nodes from the origin.
6. Click an allocated loop arc to refund that arc if it is not required for connectivity.
7. Use `Undo`, `Reset`, zoom buttons, mouse wheel, and drag panning for planning.

## Game Design Rules

The demo uses a few rules that should survive if this is adapted into a full RPG:

- The origin has no build bonus. It only establishes the allocation root.
- Nodes should feel like passive powers. Paths should feel like stat and routing commitments.
- Small passives establish texture and travel value.
- Notables are local rewards and should shape build identity.
- Masteries summarize a local school and should make a region legible.
- Keystones should be rare and rule-changing, with tradeoffs.
- Gateways should touch the outside of the main tree and lead to compact, themed subtrees only after a shape-combo unlock.
- Geometric combo bonuses should reward deliberate shapes, not random wandering.
- Extra arc spending should matter because it enables loops, symmetry, redundant circuits, and alternate attribute routing.

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

The app is a single-file HTML/SVG implementation. The main runtime classes are:

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

Run the existing progression tests:

```bash
node tools/geometric_skilltree/tests/progression.test.mjs
```

The current UI is standalone and does not require a dev server.
