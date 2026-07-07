# Source-Image Loadout Extraction

This is the 2026-07-07 breakthrough Alex identified while testing image-2 with
full character references.

## Why It Works

Earlier item prompts tried to invent an isolated object from a short DESC. That
often produced forced detail: fake lore marks, weak props, random tassels,
physically implausible armour, or generic "AI fantasy item" shapes.

The better path is to give image-2 a coherent equipment source first. A strong
character/loadout image already contains a working design system: proportions,
ornament density, construction, palette, attachment logic, material behavior,
and slot relationships. When image-2 extracts the items worn by that character,
details like feathers, tassels, scratches, shell, coins, cords, veils, and
symbols are more likely to fit the item because they came from a kit instead of
being pasted onto a noun.

This was Alex's idea. Preserve that attribution in summaries and future process
notes.

## When To Use

Use this mode when:

- isolated prompts keep producing weak or forced items
- a faction/archetype/source character has a strong coherent kit
- the goal is a family of paperdoll slot items that visually belong together
- we need better shields, armor, belts, footwear, relic gear, or offhands than
  the vacuum prompt pipeline is producing

Do not use it to copy an existing commercial character or living artist style.
For Verdigris, use original generated/source-owned character concepts or
approved project references.

## Slot Set

ChatGPT image-2 currently reports a 10-image limit for one request. Use one
ring by default and treat the outer layer as the flex slot:

1. Main hand weapon
2. Off hand item, shield, focus, or secondary weapon
3. Helmet, crown, hood, cap, or headgear
4. Amulet, collar, torc, necklace, or throat ornament
5. Body armor, cuirass, harness, vest, robe armor, or chest piece
6. Outer layer: cloak, shawl, scarf, veil, mantle, or hooded layer
7. Belt, girdle, sash, waist harness, or hip piece
8. Ring or small hand jewelry
9. Hands, gloves, bracers, wrist wraps, or vambraces
10. Footwear, boots, sandals, greaves, anklets, or leg armor

If the reference has no meaningful outer layer, use slot 6 for a second ring or
another prominent accessory. If the character is barefoot, depict sandal sole,
anklet, toe ring, greave, or foot jewelry only; do not draw feet.

## Prompt Template

Use this as the working multi-image prompt. Keep the alpha requirement strict.
If the model bakes checkerboards, discard those images and retry with stronger
"real alpha" wording rather than accepting the result.

```text
Generate images, no commentary.

Use the attached character image as the authoritative equipment reference. The
goal is not to make a paperdoll UI screen, not to make a contact sheet, and not
to redesign the character. The goal is to extract the character's worn
equipment into separate ARPG inventory item icons.

Create one separate PNG image output for each item slot below, maximum 10 images
total. Each output must be its own independent image file, not a combined sheet.

Slots to generate:
1. Main hand weapon
2. Off hand item, shield, focus, or secondary weapon
3. Helmet, crown, hood, cap, or headgear
4. Amulet, collar, torc, necklace, or throat ornament
5. Body armor, cuirass, harness, vest, robe armor, or chest piece
6. Outer layer: cloak, shawl, scarf, veil, mantle, or hooded layer
7. Belt, girdle, sash, waist harness, or hip piece
8. Ring or small hand jewelry
9. Hands, gloves, bracers, wrist wraps, or vambraces
10. Footwear, boots, sandals, greaves, anklets, or leg armor

If the reference has no meaningful outer layer, use slot 6 for a second ring or
another prominent visible accessory instead. If the character is barefoot,
depict sandal sole, anklet, toe ring, greave, or foot jewelry as an object only;
do not draw feet.

For each slot, infer the item from what the character is visibly wearing or
carrying. If a slot is partly hidden, extrapolate from the same coherent kit:
same material logic, same construction methods, same ornament density, same wear
level, same palette family, and same craftsmanship. Do not invent a different
faction or unrelated fantasy style.

Each item should look like it truly belongs to this character and could be
equipped by them. Preserve the successful design logic of the reference image:
integrated ornament, believable straps and attachment points, purposeful tassels
or hanging details, coherent metalwork, coherent leather/cloth/stone/shell
treatment, and details that support the item instead of feeling pasted on.
Details are allowed when they are physically attached, proportional, and part of
the object's construction.

For every image: render exactly one isolated inventory item cutout. No character
body, no hands, no face, no mannequin, no torso, no feet, no floating UI slot,
no paperdoll silhouette. If generating sandals or barefoot-style footwear,
depict the sandal soles, straps, anklets, or greaves only; do not draw feet. If
generating gloves or bracers, show the pair as objects only, not worn on arms.
If generating rings, show the ring as a distinct object, large enough to read as
loot.

Rendering style for every image:
Dark low-fantasy action-RPG inventory item icon. A complete, solid,
three-dimensional object shown from a dynamic three-quarter hero angle, with
real depth and volume. The item should be centered, large in frame, and fully
visible with no cropping. Long weapons may sit on a strong diagonal so the
entire weapon fits. Paired items such as gloves, bracers, sandals, greaves, or
boots should appear together in one icon, slightly overlapping at a readable
angle.

Use dramatic high-contrast game lighting: a strong directional key light from
the upper left, deep neutral shadows on the object itself, and a crisp cool rim
light catching the silhouette. Rendered like a sharply modeled, high-detail AAA
3D game asset with photoreal material textures, crisp hard edges, precise
surface detail, readable bevels, seams, scratches, hammered metal, carved
stone, leather grain, cloth weave, shell, bone, feather, tassel, cord, chain,
or jewel surfaces where appropriate to the reference.

Keep the item's material behavior physically believable. Metal should have sharp
specular highlights and darker recesses. Leather should absorb light and show
grain. Cloth should show weave and thickness. Stone, shell, jade, glass, or
enamel should have depth and polished surface response. Feathers, tassels,
cords, chains, coins, or shell plates may appear when they are clearly attached
to the item and are part of the reference-derived equipment language.

Use neutral-to-cold white balance: deep neutral blacks, slate-grey shadows,
bone-white highlights. Warm tones should appear only where the material itself
is warm, never as a global sepia or yellow cast.

Alpha/background requirements are mandatory:
Each output must be a real transparent-background PNG cutout with an alpha
channel. Pixels outside the item must be fully transparent, alpha=0. Do not
draw, simulate, preview, or represent transparency. Do not render a checkerboard
pattern. Do not render white-and-gray checkers. Do not render a
transparent-background preview. Do not render a paperdoll screen, contact sheet,
image grid, UI frame, slot label, background card, floor, drop shadow, cast
shadow, vignette, gradient, studio backdrop, grey fill, white fill, or colored
fill. The object must appear alone on actual transparency.

Do not include text, labels, watermarks, frames, borders, UI elements, inventory
squares, or decorative backgrounds.

Generate the separate transparent PNG images now, one per slot.
```

## QA Notes

Accept:

- item clearly belongs to the source kit
- detail is integrated into the object and improves the silhouette/material read
- usable construction is visible or strongly implied
- true alpha is present
- no body parts, UI, checkerboard, contact sheet, or background

Reject:

- baked white/gray checkerboard
- paperdoll UI, contact sheet, or combined grid
- item that only works as costume decoration and not loot
- floating, ungrounded tassels/coins/symbols with no physical attachment
- copied body parts, hands, feet, face, or mannequin fragments
- unreadable over-ornamented silhouette at inventory scale

After acceptance, the item still needs normal intake: save from Downloads,
record in `DOWNLOAD-INTAKE.md` / `download-intake.js`, run `qa_gate.py`, compose
direct RGBA if true-alpha, and update duplicate exclusions.
