# The Mason

Border tile forge: generates the directional transition art for where two
terrains meet — grass lipping over water, snow drifting onto stone, lava
crusting against basalt. Complete autotile sets for **square tiles**
(the 47-tile blob set) and **hex tiles** (all 64 edge combinations),
deterministic per seed. A WIZARD module.

**[Live demo](https://alexkorol.github.io/WIZARD/tools/mason/)** — paint
terrain and watch the autotiler pick borders live, then export the set.

## Layout

- [`core/mason.js`](core/mason.js) — bitmask logic (pure, runs in node) plus
  the per-pixel tile painters (need a canvas 2D context).
- [`core/test.js`](core/test.js) — `node core/test.js`: blob canonicalization,
  lookup-table completeness, seamlessness guarantees, determinism.
- [`index.html`](index.html) — paint playground, sheet viewer, exports.

## How it works

Each tile belongs to the **inner** terrain; its bitmask says which neighbors
are also inner. Border art is drawn along every edge facing the outer
terrain: a wobbled boundary curve, a rim treatment owned by the inner
terrain (grass lip and tufts, foam, glowing crust, soft snow shade), and a
contact effect on the outer side.

Two properties make the sets engine-ready:

1. **Canonical blob masks.** The 256 raw 8-neighbor masks collapse onto 47
   canonical tiles (corner bits only count when both adjacent edges are
   set). The exported JSON includes the full 256-entry lookup table, so
   in-game autotiling is one array index.
2. **Seamless by construction.** The boundary wobble along each edge
   direction is shared by every tile in the set and its envelope is zero at
   both edge endpoints — any two tiles butt together without seams. The
   playground exercises exactly this: it composes the same painted tiles you
   export.

Hex sets use pointy-top axial coordinates (neighbor order E, SE, SW, W,
NW, NE) and bake all 64 edge combinations.

## Exports

- **PNG sheet** — the tile set, 8 columns.
- **JSON** — layout, per-tile masks, neighbor bit order, and (for square)
  the 256-entry lookup table.
- **AI template sheet** — the same layout rendered as flat masks with a red
  boundary guide.

## Deterministic vs. generative AI

The generator itself is deterministic on purpose: border sets need per-seed
reproducibility, pixel-exact composability, and zero marginal cost per
variation. The AI hook is the **export contract** instead: render the
template sheet, hand it to an image model as the structural guide, paint
one style frame over it, and slice the result back into the same slots
using the JSON layout. Structure stays procedural and testable; art
direction can come from anywhere — the same mockup-to-asset pipeline used
for the WIZARD orbs.

## Integration

```js
const Mason = require('./core/mason.js'); // or window.Mason via <script>

// index into your sliced spritesheet:
let mask = 0;
Mason.SQUARE_NEIGHBORS.forEach(([dx, dy], bit) => {
  if (isSameTerrain(x + dx, y + dy)) mask |= 1 << bit;
});
const tileIndex = Mason.BLOB_LOOKUP[mask]; // 0..46
```
