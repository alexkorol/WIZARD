# The Cartographer

Procedural 2D zone generator in the spirit of Diablo 2 and Path of Exile area generation:
five zone families, fourteen themes, seeded and deterministic. Built as a WIZARD module —
the engine is one dependency-free file you can drop into any game project.

**[Live demo](https://alexkorol.github.io/WIZARD/tools/cartographer/)** — drag to pan,
scroll to zoom, Space for a new map.

## Layout

- [`core/mapgen.js`](core/mapgen.js) — the generator. No dependencies, no DOM. Loads as a
  browser global (`window.MapGen`) or CommonJS module (`require('./mapgen.js')`).
- [`core/test.js`](core/test.js) — invariant tests (`node core/test.js`): determinism,
  entrance-to-exit connectivity, entity placement, JSON round trips, across every
  zone × theme × size.
- [`index.html`](index.html) — the demo. Canvas renderer with baked terrain, animated
  liquids, dynamic torchlight, and a fog-of-war reveal. The renderer is demo-only;
  the engine knows nothing about it.

## Usage

```js
const MapGen = require('./core/mapgen.js'); // or <script src="core/mapgen.js"> for window.MapGen

const map = MapGen.generate({
  zone: 'dungeon',   // dungeon | caves | catacombs | ruins | wilds
  theme: 'crypt',    // optional; picked at random from the zone's themes if omitted
  seed: 1234,        // number or string; omit for a random map
  width: 72,
  height: 54
});
```

Same seed and options always produce the same map — generate on a server and client
and they agree, or store nothing but the seed.

### Output

| Field | Contents |
|---|---|
| `tiles` | `Uint8Array` of `width * height` logical tile ids (`MapGen.TILE`) |
| `entities` | `[{type, x, y}]` — gates, torches, chests, shrines, scatter decor |
| `entrance`, `exit` | `{x, y}` — always mutually reachable over walkable tiles |
| `rooms` | `[{x, y, w, h, cx, cy}]` for room-based zones |
| `palette` | suggested colors for the theme — use them or ignore them |
| `seed`, `zone`, `theme` | what was actually used (echoed back) |

Tiles are logical terrain (`FLOOR`, `WALL`, `DOOR`, `WATER`, `LAVA`, `GRASS`, `TREE`,
`PATH`, `BRIDGE`, …) — map them onto your own tileset. `MapGen.WALKABLE` is the
suggested walkability set; redefine it in your game if your rules differ.

### Zones and themes

| Zone | Algorithm | Themes |
|---|---|---|
| Dungeon | packed rooms + doorway links + loops | Crypt, Fortress, Sewer |
| Caves | cellular automata + liquid pools | Cavern, Ice, Lava, Fungal |
| Catacombs | wide braided maze + galleries + chambers | Bone, Flooded |
| Ruins | decayed building shells + worn paths | Desert, Overgrown |
| Wilds | fBm terrain + river + road | Forest, Swamp, Ash |

Every generator ends with the same guarantees: all walkable regions are stitched
together, the entrance and exit are placed at far ends of the walk graph, and
decoration never blocks the gates.

Layouts follow the Diablo 2 / Path of Exile 1 school of map pacing: compact
zones, short connections, loops instead of backtracking, and dead ends kept
small and rewarding. The test suite enforces a clear-speed bound — the
entrance-to-exit walk may never exceed 2.2× the map perimeter.

### JSON interchange

```js
const json = MapGen.toJSON(map);   // tiles as hex strings, one per row; includes a legend
const back = MapGen.fromJSON(json);
```

The demo's Export JSON button emits this format, so exported maps load directly
into any engine with a few lines of parsing.

## Porting notes

The engine is ES5, one IIFE, ~1100 lines. To use it in a game:

1. Copy `core/mapgen.js` into your project.
2. Call `MapGen.generate(...)` with your zone, size, and seed.
3. Map tile ids to your tileset and entity types to your prefabs.
4. Treat `entrance`/`exit` as player spawn and level exit.

Nothing else is required — no assets, no build step, no globals beyond `MapGen`.
