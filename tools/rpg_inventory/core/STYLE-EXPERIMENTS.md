# RPG Inventory Style Experiments

This is a lab notebook for prompt style tests. It is not the active production
prompt. The active prompt remains `PROMPT.txt`, which is hand-tuned and should
not be edited by agents.

## Crisp AAA Render Test

The recent manual saves are stronger when they read like product-rendered game
assets instead of painted concept art. The useful transfer from the older
character prompts is not the character language; it is the rendering stack:

- photorealistic 3D asset, not illustration language
- ultra-fine material detail
- high-contrast studio lighting
- clean neutral backdrop or true alpha
- crisp silhouette and hard-surface bevel clarity
- physically based metal, leather, stone, hide, and jade response

Avoid carrying over character-prompt baggage: low-angle pose, portrait,
warrior, body, allure, cloth flutter, class/faction, and "concept art" wording
do not belong in item prompts. "Stylized" is risky by itself; if tested, it
should be subordinate to photoreal/PBR/product-render language.

## 2026-07-07 Character Reference Inspection

The attached character generations are useful because their rendering is crisp,
not because their subjects should leak into item bases. Transfer these traits:

- white studio product-render clarity with no painterly brush texture
- high local contrast and sharp specular separation on metal
- precise bevels, seams, scratches, leather grain, hammered metal, and stone
- material-specific highlights: bronze/gold glints, dark leather absorption,
  polished hardstone/jade depth, sheer fabric translucency where relevant
- clean edge definition that survives downscaling to an inventory icon
- controlled key light from upper-left plus a cool rim light

Do not transfer these traits into item prompts:

- characters, bodies, class portraits, low-angle fashion poses, allure wording
- faction costumes, deity/faction symbols, sun discs, eagle masks, named lore
- feather crowns, loose feather tassels, coin-chain clutter, veil language
- fixed costume palettes such as turquoise/gold, lapis/gold, red/green/gold
- over-ornate jewelry density on ordinary base items
- ceremonial story props that do not read as usable loot

For item-art experiments, "crisp AAA" means a single isolated product-rendered
object with excellent material fidelity. It does not mean a character concept
cropped down into an icon, and it does not reopen decorative faction language
for generic bases.

## No-Repeat Rule

When Alexei asks for "test prompts", that means new item concepts only. Do not
repeat, regenerate, style-test, or near-duplicate any item that already has art
in `assets/`, has an accepted entry in `download-intake.js`, appears in
`DOWNLOAD-INTAKE.md` exclusions, or is marked discard/rework in
`asset-review.js`, unless Alexei explicitly asks to restyle that exact item.

Style calibration prompts also use novel DESC content. The only exception is
when Alexei explicitly names an existing item and asks to restyle that exact
item; otherwise, the style block below must be paired with a new concept.

## Candidate Style Block

Manual A/B style block to try in place of the active style sentence only:

> AAA inventory item product render: {DESC}. Ultra-fine photoreal 3D game
> asset rendered with physically based materials and white-studio product
> clarity. Macro lens sharpness, crisp hard edges, sharp bevels, readable
> construction seams, fine scratches, hammered or carved surface grain, and
> material-specific specular response. Clean neutral color grading, controlled
> high-contrast studio key light from the upper-left, deep neutral contact
> shadows on the object itself, and a cool rim light along the far edge. Single
> isolated object only, centered, filling the frame while remaining entirely
> visible, true transparent PNG background preferred. If transparency is
> unavailable, use one flat uniform mid-grey fill.

Expected improvement:

- less painterly brush texture
- sharper small material reads at inventory scale
- cleaner metal/leather/jade highlights
- less invented lore decoration because the prompt reads like a product shot

Risks to watch:

- too much product-photo realism can make primitive items look luxury-polished
- "8k" and "cinematic" can over-zoom crops unless the canvas/framing prefix is
  kept
- studio render language can introduce gradients if true alpha is ignored, so
  the flat-background fallback and local matte QA still matter

## Prompt Shape

Use this structure for novel manual image-2 experiments. It intentionally does
not update `PROMPT.txt`.

> Generate an image, no commentary. {CANVAS PREFIX}. AAA inventory item product
> render: {NEW DESC}. Ultra-fine photoreal 3D game asset rendered with
> physically based {MATERIAL} and white-studio product clarity. Macro lens
> sharpness, crisp silhouette, hard edges, sharp bevels, readable construction
> seams, fine scratches, and material-specific specular response. Clean neutral
> color grading, controlled high-contrast studio key light from the upper-left,
> deep neutral shadows on the object itself, and a cool rim light along the far
> edge. Isolated single object, centered, filling the frame while remaining
> entirely visible, true transparent PNG background preferred. If transparency
> is unavailable, use one flat uniform mid-grey fill. No text, no watermark, no
> frame, no cast shadow.
