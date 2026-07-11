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
variation. AI art enters through two supported routes.

### Route 1 — texture import (recommended)

Generate **seamless base textures** with an image model and let the Mason
cut the transitions. The tool's Inner/Outer texture buttons accept any PNG;
the per-pixel samplers tile it across world space, so texture continuity
across tiles is automatic and the seam guarantees still hold.

The tool's **Texture prompt** button copies a ready prompt built from the
selected terrain. The pattern:

> Top-down orthographic seamless tileable texture of dense green meadow
> grass, 16-bit ARPG pixel art style. Uniform detail density across the
> whole image, flat even lighting with no light direction, no shadows, no
> vignette, no border, no focal object or centerpiece. The image must tile
> perfectly when repeated: every edge continues seamlessly into the
> opposite edge. Fill the entire canvas.

Then: downscale to 64–128 px (nearest-neighbor), optionally quantize the
palette, and import. Verify seamlessness by offsetting the image by half —
models sometimes fake it. Turn the rim overlay off if the AI texture
already carries edge detail, or leave it on for the procedural
lip/foam/glow on top.

This route is robust because the model only ever paints flat texture —
it never has to align a 47-tile grid.

### Route 2 — painted sheet import (full control)

Export the **AI template sheet** (flat masks; the transition boundary and
each cell's frame are drawn in guide-red), give it to an image-editing
model as the structural input, then use **Painted sheet** to import the
result. The tool slices it by the JSON layout, **automatically heals any
guide-red the model kept in the art**, and the playground autotiles with
it immediately — the fastest way to eyeball whether the model held the
seams. Rescaling is handled if the model returned a different resolution.

Field notes from real runs — image models fail this in two specific ways,
so the prompt has to forbid both:

1. **They keep the red guides as literal art** (glossy red piping along
   every boundary). The import scrub heals this automatically.
2. **They merge shapes across cells**, composing one nice picture instead
   of 47 independent tiles. This one is fatal — sliced tiles become
   arbitrary fragments. If the model merges cells despite the prompt, use
   Route 1 — it cannot fail this way.

The tool's **Sheet prompt** button copies a full prompt built from the
current terrain pair and layout, engineered against both failure modes.
It names the grid dimensions, explains the white/dark/red semantics,
describes the two terrains and the transition treatment, and closes with
hard rules: every cell is an independent tile, never continue shapes
across cell frames, keep each cell's region placement exactly, no red in
the final image, identical terrain style across cells, flat lighting, no
margins, grid aligned to the canvas edges. Use it with the template image
as the edit input (image-to-image), not as a text-only generation, and at
the model's highest input-fidelity setting.

**Output sizes are fixed on these models** (gpt-image: 1024×1024,
1536×1024, 1024×1536), and the auto setting is biased toward 3:2
landscape — a template whose aspect doesn't match gets stretched or
padded before the model paints anything, which misaligns every cell.
Defenses, in order:

1. Both sheet layouts are square by design (blob 7×7, hex 8×8), and the
   generated prompts demand a square 1024×1024 output explicitly, twice.
2. **Set the size parameter yourself when you can** — `size: "1024x1024"`
   in the API, or say "square image" in a chat UI. Prompt text alone
   doesn't always beat the auto-size bias.
3. If a 3:2 output slips through anyway, the importer auto-detects flat
   letterbox/pillarbox bands and slices from the content rect; a
   uniformly *stretched* grid also survives, because slicing is
   proportional. What nothing can save is a recomposed grid — that's a
   regenerate.

The template exports near 1024 px so the guides stay crisp at the
model's input resolution.

A useful salvage when Route 2 produces beautiful but misaligned art: crop
a clean patch of each terrain out of it (any editor) and feed those to
Route 1 as textures.

Hand-drawn sheets go through the same door: draw over the template in
Aseprite, import, paint, export.

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
