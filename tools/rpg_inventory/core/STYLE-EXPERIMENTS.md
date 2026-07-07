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

## Candidate Style Block

Manual A/B style block to try in place of the active style sentence only:

> AAA inventory item product render: {DESC}. Ultra-fine photoreal 3D game
> asset rendered with physically based materials, macro lens clarity, crisp
> silhouette, sharp bevels, detailed surface grain, clean neutral color
> grading, controlled high-contrast studio key light from the upper-left, and
> a cool rim light along the far edge. Isolated single object, centered,
> filling the frame while remaining entirely visible, true transparent PNG
> background preferred. If transparency is unavailable, use one flat uniform
> mid-grey fill.

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

## Full Manual Test Prompts

Use these only for manual image-2 experiments. They intentionally do not update
`PROMPT.txt`.

### Copper Torc

Generate an image, no commentary. Square canvas (1:1 aspect ratio). AAA
inventory item product render: a clean hammered copper torc with a thick
crescent body and rounded bulb terminals, one complete neck ring. Ultra-fine
photoreal 3D game asset rendered with physically based copper, macro lens
clarity, crisp silhouette, sharp bevels, detailed hammered surface grain, clean
neutral color grading, controlled high-contrast studio key light from the
upper-left, and a cool rim light along the far edge. Isolated single object,
centered, filling the frame while remaining entirely visible, true transparent
PNG background preferred. If transparency is unavailable, use one flat uniform
mid-grey fill. No text, no watermark, no frame, no cast shadow.

### Carved Jade Cudgel

Generate an image, no commentary. Vertical portrait canvas (2:3 aspect ratio).
AAA inventory item product render: a heavy blunt war club carved entirely from
dark green jade, blocky squared striking head, thick grip, the entire weapon
visible on a strong diagonal. Ultra-fine photoreal 3D game asset rendered with
physically based jade, macro lens clarity, crisp silhouette, sharp bevels,
detailed stone surface grain, clean neutral color grading, controlled
high-contrast studio key light from the upper-left, and a cool rim light along
the far edge. Isolated single object, centered, filling the frame while
remaining entirely visible, true transparent PNG background preferred. If
transparency is unavailable, use one flat uniform mid-grey fill. No text, no
watermark, no frame, no cast shadow.

### Boiled Leather War Cap

Generate an image, no commentary. Square canvas (1:1 aspect ratio). AAA
inventory item product render: a boiled dark leather war cap with a domed skull,
broad cheek guards, and complete wearable head protection, clean plain leather
surface. Ultra-fine photoreal 3D game asset rendered with physically based
leather, macro lens clarity, crisp silhouette, sharp folded edges, detailed
leather grain, clean neutral color grading, controlled high-contrast studio key
light from the upper-left, and a cool rim light along the far edge. Isolated
single object, centered, filling the frame while remaining entirely visible,
true transparent PNG background preferred. If transparency is unavailable, use
one flat uniform mid-grey fill. No text, no watermark, no frame, no cast
shadow.
