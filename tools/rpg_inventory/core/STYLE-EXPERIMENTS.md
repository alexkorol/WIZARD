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

For itemization, also watch for motif cloning. Image-2 often turns a coherent
kit into an overmatched set by placing the same round blue stone, central gem,
boss, medallion, sun, eye, face, or emblem on every slot. This is a reject.
Prompts should set a motif budget: one or two strong focal motifs per extracted
set at most. Other items should coordinate through construction, materials,
edge shapes, plate layout, weave, stitching, grip wrap, carved rims, and
silhouette rather than repeated centerpieces.

Separate-image extraction is mandatory for itemization batches. The first line
must state the exact image count, for example `Generate 10 images. No
commentary.` Do not use vague openers that omit the number. If a prompt asks
for 10 slots, the model must produce separate independent image files, not a
contact sheet, collage, grid, lineup, paperdoll, or multi-item canvas. If the
model cannot produce separate files, it should generate only the first slot
instead of collapsing all slots into one sheet.

## Self-Contained Character Prompt Rule

Character/source prompts are not allowed to rely on chat context, project
memory, or terse faction names. The image model has no durable knowledge of
what "Jungle Empire", "Poludnica Spirit hunter", "Seven Kingdoms", or a class
name means in Verdigris. Every final prompt must explicitly include:

- full faction design language: materials, palette, construction, cultural
  analogies, body/silhouette archetype, virtue/vice tension, and banned
  cliches
- class/stat gear grammar: what Warrior, Rogue, Mage, Hunter, Druid, or Bard
  should look like in equipment terms
- tier language: low/mid/high or Tier 1-5 construction quality and authority
- gender presentation rule: equipment bases are unisex; character fit may vary
  by body, but coverage, protection level, construction, material logic, and
  slot identity stay the same
- rendering style, canvas, backdrop, spacing, and no-text/no-UI constraints
- weapon distribution and long-weapon constraints

Use composite prompt assembly if the prompt gets large: draft reusable blocks
for faction, class, tier, render style, and composition, then concatenate them
into one complete final prompt. Do not omit the expanded block just because the
faction or class was described earlier in the chat.

Do not optimize final character prompts for brevity. The desired output is not a
short elegant spec; it is a fully loaded image-generation prompt with expanded
paragraphs. A good final prompt repeats the relevant visual grammar in every
place the model might need it: faction block, class block, tier block, weapon
block, and per-character entry. Avoid title-only shorthand such as "Jungle
Empire Rogue" or "Seven Kingdoms Mage" unless the surrounding text fully
defines those terms again.

Do not save Alexei's proprietary legacy character prompt examples in this repo.
Only save distilled process rules and generic prompt structure.

## Calibration Prompt Feedback Loop

The 2026-07-09 character prompt tests showed that prompts asking for multiple
separate images usually preserve faction identity and readable silhouettes
better than dense collages. Collages are still useful for quick lineup sheets,
but they are high-risk when the goal is item-source characters or tier reads.
Default to separate-image sets for calibration unless Alex explicitly asks for
a single sheet.

The starter production ladder uses one faction per request, not one
attribute/tier across all factions. Run four full prompts. Each prompt requests
exactly nine separate image files: Strength T1-T3, Dexterity T1-T3, and
Intelligence T1-T3. Do not put fixed fantasy class names into final character
prompts. Attribute axes describe equipment logic, not profession: Strength is
load, leverage, stability, impact, and resistance; Dexterity is balance,
articulation, mobility, recovery, and precise handling; Intelligence is
preparation, precision, measurement, ordered systems, and focus integration.
Each image contains one male/female pair sharing the same unisex bases and
coverage. Reuse the same recognizable pair across an axis's three tiers so gear
progression can be judged without body-type noise; switch to a different pair
for the next axis. Nine is the complete matrix, so do not fill the model's
tenth-image capacity with an asymmetric extra concept.

Tier progression must alter macro design, not only finish. Between each
adjacent tier, force at least five visible changes among torso construction,
headgear outline, main-hand silhouette, offhand construction, mantle or shawl
cut, belt structure, hand protection, and footwear. Tier 3 should introduce
more sophisticated segmentation, layering, articulated pieces, edge treatment,
woven borders, inlay, and precise joins. These details must belong to the
construction rather than becoming loose ornaments.

Color progression is also tiered while lighting and grading stay fixed. Tier 1
uses a limited low-cost palette whose colors remain clean and legible, Tier 2
adds larger saturated textile fields, and Tier 3 uses the faction's richest
distributed palette with substantially more vivid color and bright material
highlights. Faction-specific tier blocks must name those colors directly so
higher tiers do not remain a slightly cleaner copy of lower tiers. Poverty is
shown through materials and construction, never a global gray filter.

Faction palette is not faction livery. Keep color material-local: natural metal
stays metallic, leather and wood retain their own browns or blacks, shell stays
pale, obsidian stays black, linen stays pale unless explicitly dyed, and stone
keeps its own color. Excluding skin and background, no single dyed hue should
occupy more than roughly one-third of the loadout. Use at least four separated
color-material zones and avoid repeating one accent across headgear, torso,
mantle, belt, hands, feet, shield, and weapon.

Strength, Dexterity, and Intelligence receive different color hierarchies
inside the same faction palette. This preserves faction identity through craft
and material choice while preventing all nine characters from looking like one
uniform team or one monochrome costume.

Source-character color calibration must be spectrally neutral. Use a pure
neutral-white studio background, neutral-white key light, neutral-white rim
light, and strictly neutral daylight/studio white balance. Do not use a
blue-gray backdrop, cool rim light, neutral-to-cool grading, or global
desaturation in character ladder prompts. Those shared cues become an unwanted
slate-blue material color on every item, tier, and faction. Blue is not a shared
faction signal: Northern, Cedar, and Silkroad prompt palettes avoid blue-family
drivers. Nile Intelligence alone may receive one bounded, saturated true-lapis
ultramarine field; Nile Strength and Dexterity use different hardstone accent
families. This correction applies to source-character renders, not the separate
isolated-item matte and lighting recipe.

Every faction block must define more than clothing palette. Add a body and
silhouette archetype so the factions do not become the same figure with
different accent colors:

- one faction can read taller, heavily built, burdened, or monumental
- one can read compact, explosive, athletic, or predatory
- one can read lean, austere, agile, or travel-worn
- one can read broad, grounded, shawled, cloaked, or weather-hardened

Add a restrained virtue/vice tension to each faction. This is not lore prose
for the model to decorate literally; it is a design pressure that changes the
gear. Example: a greedy river-palace Intelligence-axis loadout may be weighed
down by bronze, brass, one bounded true-lapis cloth field, and a few high-tier
gold highlights. The Northern Bronze
Houses show oath-bound order shading into rigid pride through clean patterned
shawls, hemmed rectangular mantles, pale wool and linen, polished bronze, pale
wood, horn, and restrained amber jewelry.

Do not use a biome label when it becomes an unwanted grading and wear command.
The discarded marsh/taiga framing made northern characters muddy, dark,
weather-beaten, and grey-brown. New Northern Bronze Houses prompts must use
craft and social language rather than marsh, taiga, bog, peat, damp, or
wet-weather survival language. Keep their value structure deliberately bright:
bone-white or natural pale cloth, spatially separate madder crimson,
spruce-green, and golden-ochre woven borders, bright bronze, golden amber used
on at most one focal slot, pale wood, polished horn, and clean russet leather
backing.

Tier prompts must force slot progression. Belts, amulets, foci, footwear,
cloaks, and handwear often get stuck while torso armor improves. For every tier
test, explicitly say how the belt, amulet, offhand/focus, outer layer, hands,
and footwear change from scavenged to trained to dazzling.

Mage and focus prompts need object diversity. Do not let all foci become
mirrors. Assign different offhand families per faction: carved amber or river
stone focus, spirit-net focus, vajra/dorje-like double-ended pronged implement
used only as structural inspiration, hardstone scepter, compact mirror disk, or
handled reliquary-like tool. Keep these as offhand/focus objects, not weapons
or vague glowing idols.

Avoid muddy sameness. If a previous run collapsed into dark grey silhouettes,
the next prompt must call for different values and material reads: pale wool
with crimson, spruce-green, and ochre borders against bright bronze; red clay
cotton against obsidian and shell; luminous sand felt against crimson, saffron,
black lacquer, and brass; or brilliant Nile linen against carnelian, malachite,
black leather, and selected true lapis only where the axis assigns it.

## Unisex Equipment And Fit Rule

Character/source prompts should not split the gear language into revealing
female armor and covered male armor. Treat every item base as unisex. A female
or feminine-presenting character may have a more fitted, waist-shaped, or
body-contoured version of the same gear, and a male or masculine-presenting
character may have broader proportions or a heavier stance, but both should
share coverage, protection level, construction, material system, and slot
identity.

Use body-fit variation, not different item categories. A cuirass remains a
cuirass, a mantle remains a mantle, a belt remains a horizontal belt, and a
shield remains the same shield family across character presentation.

## Side-Laid Item Reference Rule

If a character/source image shows a weapon or shield laid beside the character,
treat that side-laid object as the authoritative item reference during
extraction. It should be copied as a complete object, not reinterpreted from the
held pose. Preserve its full silhouette, material proportions, head-to-shaft
ratio, shield outline, and visible construction. Do not shorten, thicken, crop,
or simplify it into a smaller prop during itemization.

For large weapons and shields that keep distorting in 10-slot extraction, run a
separate item-only extraction pass for that slot: one isolated image, full
object visible, steep diagonal for long weapons, and no character body parts.

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
