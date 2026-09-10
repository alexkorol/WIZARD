# Cartographer — Expedition Atelier

Six map types generate different kinds of places, each with its own architecture
or geographic structure. The default opens a Mesa at extended extent.

| Map type | Structure and navigation |
|---|---|
| Sunken Temple | Nine precincts with stepped pools, colonnades, side shrines and offset galleries |
| Saffron Mesa | Central high plateau, broken outer terraces, gullies and two escarpment ramps |
| Cold River | Two glacial banks, a winding channel, tributaries, islands and three bridge crossings |
| Copper Canyon | Variable-width gorge, branching ravines, sheltered basins and dividing rock fins |
| Iron Cages | Four cell blocks, barred doors, guard galleries and a connecting exercise yard |
| White Summit | Successive snowfields, contour ridges, alternating saddles and a high destination |

These are original place grammars informed by ARPG map studies. Materials,
obstacles, elevation, route constraints and encounter distribution follow the
selected map type. Earlier five-biome terrain studies and v4 layout grammars
remain available in the expandable **Earlier terrain studies** section.

- **Forge:** rolls a fresh seed. Typing a seed or enabling **Keep this seed for
  comparisons** makes regeneration repeatable. Shared URLs restore the map.
- **World / Automap / Topology:** view materials, collision boundaries or actual
  walking routes between landmarks. New map types distribute dozens of encounter
  groups over reachable ground; landmarks are points of interest, not monster quotas.
- **Expand map:** fills the window with the map. Escape returns to the editor.
- **Explore:** WASD/arrows reveal line-of-sight terrain; click discovered floor to walk.
- **Exchange:** validated versioned JSON includes features and elevation; PNG
  exports the world terrain. The original texture tool remains at `terrain-lab.html`.

```js
const Expedition = require('./core/expedition.js');
const map = Expedition.generate({recipe:'cold_river',seed:2718,columns:6,rows:4});
const packet = Expedition.toJSON(map);
```

`core/map-types.js` builds v5 geometry independently of the earlier room graph.
The packet adds `area: {type, features}` and a `Uint8Array` elevation field (0–4,
serialized as hexadecimal rows). Elevation informs presentation; traversability
remains authoritative in `tiles`. The landmark graph traces sampled walking
routes and is **not** a complete inventory of every possible terrain connection.

Run `node tools/cartographer/core/expedition.test.js` for 1,500 natural-terrain,
1,350 layout-grammar and 360 map-type cases. The new suite verifies reproducible
collision and packets, substantial playable ground, encounters, landmark routes,
JSON round trips and essential crossings. Sealing bridges or passes must disconnect
the destination. `node scripts/wizard-lab.mjs verify --full` also runs these suites.

Browser scripts load `mapgen.js`, `landscape.js`, `layouts.js`, `map-types.js`,
then `expedition.js` from `core/`. No build step or new bitmap assets are required.

See [research and visual observations](RESEARCH.md), [outdoor asset provenance](assets/OUTDOOR-PROVENANCE.md)
and [limestone provenance](assets/PROVENANCE.md). New v4/v5 generators are currently
JavaScript-only; native Verdigris parity has not been implemented for them.
Earlier v3 seed output remains unchanged. Imports accept packet versions 2–5.
The laboratory adapter capabilities remain undeclared: expedition JSON is not
a WIZARD calibration envelope.

---

## Original terrain generator reference


Procedural 2D zone generator in the spirit of Diablo 2 and Path of Exile area generation:
eight zone families, twenty-six themes, seeded and deterministic. Built as a WIZARD module â€”
the engine is one dependency-free file you can drop into any game project.

**[Live demo](https://alexkorol.github.io/WIZARD/tools/cartographer/)** â€” drag to pan,
scroll to zoom, Space for a new map.

## Layout

- [`core/mapgen.js`](core/mapgen.js) â€” the generator. No dependencies, no DOM. Loads as a
  browser global (`window.MapGen`) or CommonJS module (`require('./mapgen.js')`).
- [`core/test.js`](core/test.js) â€” invariant tests (`node core/test.js`): determinism,
  entrance-to-exit connectivity, entity placement, JSON round trips, across every
  zone Ã— theme Ã— size.
- [`index.html`](index.html) â€” the demo. Canvas renderer with baked terrain, animated
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

Same seed and options always produce the same map â€” generate on a server and client
and they agree, or store nothing but the seed.

### Output

| Field | Contents |
|---|---|
| `tiles` | `Uint8Array` of `width * height` logical tile ids (`MapGen.TILE`) |
| `entities` | `[{type, x, y}]` â€” gates, torches, chests, shrines, scatter decor |
| `entrance`, `exit` | `{x, y}` â€” always mutually reachable over walkable tiles |
| `rooms` | `[{x, y, w, h, cx, cy}]` for room-based zones |
| `palette` | suggested colors for the theme â€” use them or ignore them |
| `seed`, `zone`, `theme` | what was actually used (echoed back) |

Tiles are logical terrain (`FLOOR`, `WALL`, `DOOR`, `WATER`, `LAVA`, `GRASS`, `TREE`,
`PATH`, `BRIDGE`, â€¦) â€” map them onto your own tileset. `MapGen.WALKABLE` is the
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
catalogues â€” arcane sanctuaries, desert tombs, spider lairs, harbor docks,
street markets, frozen tundra, moors with stone circles.

Every generator ends with the same guarantees: all walkable regions are stitched
together, the entrance and exit are placed at far ends of the walk graph, and
decoration never blocks the gates.

Layouts follow the Diablo 2 / Path of Exile 1 school of map pacing: compact
zones, short connections, loops instead of backtracking, and dead ends kept
small and rewarding. The test suite enforces a clear-speed bound â€” the
entrance-to-exit walk may never exceed 2.2Ã— the map perimeter.

### Directional flow

Every map has a **flow axis**: the portal spawns in the starting band, a
carved **boss arena** holds the far band, and the exit portal sits just
past the boss. The engine computes the **main path** (portal to boss) and
places **spawns**: monster packs pacing the spine every 7â€“12 tiles, extra
packs and elites in side pockets off it, and the boss with guards in the
arena. `map.boss`, `map.axis`, `map.mainPath`, and `map.spawns` all ship
in the output and the JSON export. Tests enforce that the boss sits at
least halfway along the axis and that the main path is contiguous â€” the
"push forward, clear packs, reach the boss" loop is a build guarantee,
not a hope.

### Real tilesets: the texture pack

The demo renders from a **texture pack** when one is loaded, falling back
to the procedural painter for anything missing â€” partial packs work. Pick
a terrain (grass, water, floor, path, sand, lava, murk) and import any
image: it gets the Mason treatment (center-square crop, size cap, forced
wrap-seamlessness), then ground tiles pattern-fill from the world-anchored
texture. Land tiles that touch a liquid are painted as [Mason](../mason/)
transition tiles inline â€” wobbled shorelines cut through the real art,
with the liquid texture as the outer terrain. Packs save and load as a
single JSON file, so a theme's art travels as one artifact.

This is the AI-art pipeline end to end: generate or crop a texture per
terrain with an image model (no structural constraints â€” the model only
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

Nothing else is required â€” no assets, no build step, no globals beyond `MapGen`.

## Map-reading layout grammars

The atelier now separates **Layout grammar** from biome. Natural terrain retains
its continuous landscape and v3 seed geometry. Cathedral spine, Oriented crypt,
and Island circuit add v4 layouts with actual cardinal doorways, reserved negative
space and seeded rotations. The circuit contains one base loop; **Extra loops**
is a budget above it. Side destinations are bounded by available space.

```js
const map = Expedition.generate({
  recipe: 'necropolis', layout: 'crypt', seed: 2718,
  columns: 4, rows: 3, branches: 3, loops: 1
});
```

Browser scripts load `core/mapgen.js`, `core/landscape.js`, `core/layouts.js`, `core/map-types.js`, then
`core/expedition.js`. CommonJS resolves these dependencies automatically.

Automap shows physical doorways and, during exploration, a gold frontier where
known floor meets unexplored floor. Layout notes explain the relative entry/exit
bearing. Fit frames the walkable footprint. Natural terrain's topology remains a
pacing scaffold rather than an exclusive navigation graph.

Research, visually inspected references, design limits and native compatibility
are documented in [RESEARCH.md](RESEARCH.md). New v4 layout generation is browser
and JavaScript engine work; native v4 generation parity is not yet implemented.

Validation: `node tools/cartographer/core/layouts.test.js` tests physical terminal
orientation, circuit alternatives, protected voids and complete packet round trips
across 1,350 maps, in addition to the existing expedition and terrain suites.
