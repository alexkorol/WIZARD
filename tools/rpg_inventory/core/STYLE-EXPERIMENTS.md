# RPG Inventory Style Experiments

This is a lab notebook for prompt style tests. It is not the active production
prompt. The active prompt remains `PROMPT.txt`, which is hand-tuned and should
not be edited by agents.

## Crisp AAA Render Test

The recent manual saves are stronger when they read like product-rendered game
assets instead of painted concept art. The first read was that the useful
transfer from the older character prompts was mostly rendering stack. Alex's
2026-07-07 loadout test corrected that: a complete character/source image is
also a coherent equipment system. The item art gets better because image-2 can
see how the gear fits together before it isolates each slot.

- photorealistic 3D asset, not illustration language
- ultra-fine material detail
- high-contrast studio lighting
- clean neutral backdrop or true alpha
- crisp silhouette and hard-surface bevel clarity
- physically based metal, leather, stone, hide, and jade response

Avoid carrying over character-prompt baggage as literal output: low-angle
portrait pose, body, allure wording, class label, and "concept art" wording do
not belong in final item prompts. But do use the source image's integrated
equipment language when it is grounded in the object: feathers, tassels,
scratches, shell plates, cords, chains, cloth panels, stones, and ornaments are
valid when they are physically attached, proportional, and clearly part of a
usable item.

## 2026-07-07 Source-Image Loadout Extraction Breakthrough

Alex's trial prompt used a full character image as the initial reference and
asked image-2 to generate separate ARPG paperdoll-slot item icons from the gear
worn by that character. This worked better than isolated item prompts because
the model did not have to invent the equipment system from a single noun. The
source image provides silhouette family, ornament density, material palette,
construction logic, and attachment logic.

This is a first-class experimental generation mode:

1. Start with a strong full-character/loadout image.
2. Ask for separate transparent PNG outputs, one per paperdoll slot.
3. Let the model infer the slot items from the visible equipment.
4. Keep details that are integrated into the object and consistent with the
   kit; reject details that look pasted on, unreadable, or physically
   impossible.
5. After acceptance, normalize names/material tags for the game.

Transfer these traits from the source image:

- white studio product-render clarity with no painterly brush texture
- high local contrast and sharp specular separation on metal
- precise bevels, seams, scratches, leather grain, hammered metal, and stone
- material-specific highlights: bronze/gold glints, dark leather absorption,
  polished hardstone/jade depth, sheer fabric translucency where relevant
- clean edge definition that survives downscaling to an inventory icon
- controlled key light from upper-left plus a cool rim light
- coherent ornament density and kit-specific construction
- reference-derived feathers, tassels, shell plates, cords, chains, veils, or
  symbols when they are physically integrated into the item

Do not transfer these traits blindly:

- character bodies, faces, hands, feet, mannequins, or portrait composition
- class-label prose, allure wording, or fashion-shot language
- ungrounded lore symbols added to unrelated base rows
- loose clutter that is not visibly attached to the item
- fixed costume palettes copied into unrelated items outside the source kit
- detail density that makes the item unreadable at inventory scale

The corrected rule is not "ban feathers/tassels/symbols." The rule is "ban
ungrounded detail." A turtle-shell shield, feather-edged shield, tasselled
spear, coin-strung belt, or veiled shawl can be excellent if the source image
shows how it belongs to the equipment kit.

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
