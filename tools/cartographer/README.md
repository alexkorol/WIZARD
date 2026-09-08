# Cartographer � Expedition Atelier

The main module now builds graph-directed Bronze Age expeditions: four original
biomes, authored chamber recipes, cardinal sockets, optional offering vaults,
loop budgets, paced encounters and a terminal guardian arena. A generated
limestone material is baked into the terrain; art does not alter collision.

- **World / Automap / Topology:** inspect the same map at three levels.
- **Explore:** WASD or arrows reveal line-of-sight terrain. Click revealed floor
  to pathfind, drag to pan, scroll to zoom. Route and landmark overlays are optional.
- **Reproduce:** seed and generation controls persist in the URL fragment.
- **Exchange:** export/import validated versioned JSON, or save terrain PNG.
- **Terrain lab:** the original eight zone families and texture-pack editor live
  at `terrain-lab.html` and remain linked from the atelier.

`core/expedition.js` is pure, dependency-free apart from the existing `mapgen.js`
tile/palette definitions. `Expedition.generate({recipe:'necropolis', seed:2718,
columns:6, rows:4, branches:5, loops:2})` returns a map with tile collision,
reciprocal three-tile sockets, graph edges, chamber roles, landmarks, encounter
anchors, a shortest walking route, and measured coverage/population. Loop budget
is a maximum: only compatible neighboring chambers can form a loop.

Run `node tools/cartographer/core/expedition.test.js`: 1,200 seeds across all four
recipes and three extents check full packet determinism, socket widths,
connectivity, safe spawns, contiguous paths, JSON round trips and invalid imports.

See [RESEARCH.md](RESEARCH.md) for sources and implementation decisions and
[asset provenance](assets/PROVENANCE.md) for the built-in imagegen prompt.
The native Verdigris port is verified against the same generator by seed-batch
fingerprints of tiles, graph connections, room variants and encounters.

The laboratory adapter capabilities remain undeclared: raw expedition JSON is
not a WIZARD calibration envelope.

---

## Original terrain generator reference


Procedural 2D zone generator in the spirit of Diablo 2 and Path of Exile area generation:
eight zone families, twenty-six themes, seeded and deterministic. Built as a WIZARD module —
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
| Dungeon | packed rooms + doorway links + loops | Crypt, Fortress, Sewer, Prison |
| Caves | cellular automata + liquid pools | Cavern, Ice, Lava, Fungal, Spider, Mines |
| Catacombs | wide braided maze + galleries + chambers | Bone, Flooded, Tomb |
| Sanctum | platforms + walkways over the void | Arcane, Infernal |
| Ruins | decayed building shells + worn paths | Desert, Overgrown |
| City | street grid + plaza + building blocks | Market, Derelict |
| Shore | linear coastline, beach as the highway | Coast, Harbor |
| Wilds | fBm terrain + river + road | Forest, Swamp, Ash, Tundra, Moor |

The zone/theme roster is drawn from the Diablo 2 and Path of Exile tileset
catalogues — arcane sanctuaries, desert tombs, spider lairs, harbor docks,
street markets, frozen tundra, moors with stone circles.

Every generator ends with the same guarantees: all walkable regions are stitched
together, the entrance and exit are placed at far ends of the walk graph, and
decoration never blocks the gates.

Layouts follow the Diablo 2 / Path of Exile 1 school of map pacing: compact
zones, short connections, loops instead of backtracking, and dead ends kept
small and rewarding. The test suite enforces a clear-speed bound — the
entrance-to-exit walk may never exceed 2.2× the map perimeter.

### Directional flow

Every map has a **flow axis**: the portal spawns in the starting band, a
carved **boss arena** holds the far band, and the exit portal sits just
past the boss. The engine computes the **main path** (portal to boss) and
places **spawns**: monster packs pacing the spine every 7–12 tiles, extra
packs and elites in side pockets off it, and the boss with guards in the
arena. `map.boss`, `map.axis`, `map.mainPath`, and `map.spawns` all ship
in the output and the JSON export. Tests enforce that the boss sits at
least halfway along the axis and that the main path is contiguous — the
"push forward, clear packs, reach the boss" loop is a build guarantee,
not a hope.

### Real tilesets: the texture pack

The demo renders from a **texture pack** when one is loaded, falling back
to the procedural painter for anything missing — partial packs work. Pick
a terrain (grass, water, floor, path, sand, lava, murk) and import any
image: it gets the Mason treatment (center-square crop, size cap, forced
wrap-seamlessness), then ground tiles pattern-fill from the world-anchored
texture. Land tiles that touch a liquid are painted as [Mason](../mason/)
transition tiles inline — wobbled shorelines cut through the real art,
with the liquid texture as the outer terrain. Packs save and load as a
single JSON file, so a theme's art travels as one artifact.

This is the AI-art pipeline end to end: generate or crop a texture per
terrain with an image model (no structural constraints — the model only
paints flat art), import, and the whole zone renders with it. Walls,
entities, and lighting stay procedural on top.

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
