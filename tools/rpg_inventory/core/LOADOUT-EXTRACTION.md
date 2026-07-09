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
2. Off hand shield, focus, ritual tool, or secondary weapon
3. Helmet, crown, hood, cap, or headgear
4. Amulet, pendant, necklace, or compact throat ornament
5. Body armor, cuirass, harness, vest, robe armor, or chest piece
6. Outer layer: cloak, shawl, scarf, veil, mantle, or hooded layer
7. Belt, girdle, sash, waist harness, or horizontal hip piece
8. Ring or compact finger jewelry
9. Hands, gloves, bracers, wrist wraps, or vambraces
10. Footwear, boots, sandals, greaves, anklets, or leg armor

If the reference has no meaningful outer layer, use slot 6 for a second ring or
another prominent accessory. If the character is barefoot, depict sandal sole,
anklet, toe ring, greave, or foot jewelry only; do not draw feet.

## Prompt Template

Use this as the working multi-image prompt. ChatGPT/image-2 batch output has
not been reliable for true alpha: it may bake checkerboards or return opaque
white backgrounds even when asked for transparent PNGs. For loadout extraction,
generate on a flat slate matte instead, then run `core/chroma_key.py` locally.

The current matte color is `#737A68` / sampled around `#6A6E5F` in outputs. It
is far less toxic than magenta if a small edge fringe survives: the remainder
reads as neutral dirt or cloth fuzz instead of a hot colored halo.

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
2. Off hand shield, focus, ritual tool, or secondary weapon
3. Helmet, crown, hood, cap, or headgear
4. Amulet, pendant, necklace, or compact throat ornament
5. Body armor, cuirass, harness, vest, robe armor, or chest piece
6. Outer layer: cloak, shawl, scarf, veil, mantle, or hooded layer
7. Belt, girdle, sash, waist harness, or horizontal hip piece
8. Ring or compact finger jewelry
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
integrated ornament, believable straps and attachment points, coherent
metalwork, coherent leather/cloth/stone/shell treatment, and details that
support the item instead of feeling pasted on. Details are allowed when they
are physically attached, proportional, and part of the object's construction.
Do not add decorative clutter just because the source outfit is ornate.

Slot hygiene rules:
Rings for fingers must be compact bands, signets, coils, socket rings, or seal
rings. Do not put dangling charms, tassels, chains, bells, chimes, or hanging
ornaments on rings.

Do not add invasive charms, loose dangling rings, chimes, delicate chains,
coins, tassels, or harness clutter to every item. Helmets must not have
vision-hazard dangles. Armor and cloaks must not have stealth-hazard chimes or
fragile loose charms. Weapons must not have fragile dangling jewelry unless it
is a short, physically plausible grip wrap or lanyard. Chains, if present, must
be period-appropriate cord or substantial chain, not delicate modern jewelry
filigree.

Solar symbols, eight-spoked wheel symbols, and human-face centerpieces are
overrepresented and high-risk. Avoid them by default. If the reference clearly
uses one of these motifs, use it on at most one extracted item, not across the
whole set. The set should feel coordinated, not matchy.

Amulets must be one pendant, stone, bead cluster, metal piece, or small charm
on a long-ish cord, twine, leather string, or simple chain. The pendant must be
the main readable object and take up most of the image; curl the string behind
or around it. Do not render a gorget, collar, neck armor, choker plate, or
turtleneck throat-piece for the amulet slot unless explicitly requested.

Body armor must be the body/chest piece only. Prefer open neck and open chest
construction consistent with ancient and Bronze Age gear. Do not include an
attached gorget, collar, turtleneck, belt, skirt, faulds, tassets, or cloak as
part of the body armor item.

Belts must render as horizontal waist items for a landscape 1x2 slot: belt,
girdle, sash, cord, or waist band. Do not turn the belt slot into a skirt,
faulds, tassets, apron, or hanging costume panel.

Shields must show the front fighting face only. Do not render the back side,
inside of the shield, clamshell openings, front-side straps, dangling front
hardware, handle loops, random rings, or utility rigging. The shield may have a
boss or face material, but the visible front should remain clean and functional.

Use gauze, translucent cloth, shredded cloth, and ragged fringe sparingly.
Prefer opaque linen, wool, hide, leather, bark cloth, felt, woven fiber, or
thicker silk-like panels. Cloak edges can be worn, but not so shredded that the
asset becomes hard to cut out or reads as costume trash.

For every image: render exactly one isolated inventory item cutout. No character
body, no hands, no face, no mannequin, no torso, no feet, no floating UI slot,
no paperdoll silhouette. If generating sandals or barefoot-style footwear,
depict the sandal soles, straps, anklets, or greaves only; do not draw feet. If
generating gloves or bracers, show the pair as objects only, not worn on arms.
If generating rings, show the ring as a distinct object, large enough to read as
loot.

Long weapon framing rule:
If the main hand or off hand is a spear, pike, staff, glaive, polearm, standard,
banner-staff, long axe, long hammer, or any other reach/two-handed weapon, the
entire object must be visible from tip to butt. Do not shorten it into a club,
mace, wand, or one-handed prop. The shaft must remain the dominant structure:
long, slender, and clearly visible; shaft at least five times the length of the
head or striking element. Place the complete weapon on a steep diagonal from
corner to corner so it fills the frame while remaining uncropped. The head
should not be enlarged so much that the shaft disappears.
Use this exact proportion cue for long weapons: shaft at least five times the length of the head.

Rendering style for every image:
Dark low-fantasy action-RPG inventory item icon. A complete, solid,
three-dimensional object shown from a dynamic three-quarter hero angle, with
real depth and volume. The item should be centered, large in frame, and fully
visible with no cropping. Paired items such as gloves, bracers, sandals,
greaves, or boots should appear together in one icon, slightly overlapping at a
readable angle.

Use dramatic high-contrast game lighting: a strong directional key light from
the upper left, deep neutral shadows on the object itself, and a crisp cool rim
light catching the silhouette. Rendered like a sharply modeled, high-detail AAA
3D game asset with photoreal material textures, crisp hard edges, precise
surface detail, readable bevels, seams, scratches, hammered metal, carved
stone, leather grain, cloth weave, shell, bone, feather, tassel, cord, chain,
or jewel surfaces where appropriate to the reference and slot.

Keep the item's material behavior physically believable. Metal should have sharp
specular highlights and darker recesses. Leather should absorb light and show
grain. Cloth should show weave and thickness. Stone, shell, jade, glass, or
enamel should have depth and polished surface response. Feathers, tassels,
cords, chains, coins, or shell plates may appear only when they are clearly
attached to the item, proportional, useful to the silhouette, and part of the
reference-derived equipment language.

Use neutral-to-cold white balance: deep neutral blacks, slate-grey shadows,
bone-white highlights. Warm tones should appear only where the material itself
is warm, never as a global sepia or yellow cast.

Background requirements are mandatory:
Place every item on the same perfectly flat, uniform matte olive-slate
background: #737A68. The background must be one single unlit solid color across
the entire canvas, with no shadows, no gradients, no texture, no paper grain, no
vignette, no floor plane, no reflection, and no lighting variation. This color
is only a removable matte color. Do not use olive-slate, green-grey, or matching
muted green tones anywhere in the item itself. Do not let the background color
reflect onto the object, tint the rim light, tint the metal, or appear as edge
glow. Keep the item edges clean and separated from the matte background.

Do not include text, labels, watermarks, frames, borders, UI elements, inventory
squares, or decorative backgrounds.

Generate the separate slate-background images now, one per slot.
```

## QA Notes

Accept:

- item clearly belongs to the source kit
- detail is integrated into the object and improves the silhouette/material read
- usable construction is visible or strongly implied
- slot identity is preserved: ring stays ring, amulet stays pendant, belt stays
  horizontal belt, body armor stays chest/body piece, shield shows its front
- reach weapons are full length, tip-to-butt, on a steep diagonal
- flat slate matte is uniform enough for `chroma_key.py`
- no body parts, UI, checkerboard, contact sheet, or extra background
- small neutral cloth/fiber edge residue is acceptable if it reads as material

Reject:

- baked white/gray checkerboard
- magenta, green-screen, white, black, gradient, or textured backgrounds
- paperdoll UI, contact sheet, or combined grid
- item that only works as costume decoration and not loot
- floating, ungrounded tassels/coins/symbols with no physical attachment
- dangling charms, chimes, tassels, or delicate chains added to rings, helmets,
  weapons, armor, or cloaks without a structural reason
- solar symbols, eight-spoked wheels, or human faces repeated across a whole set
- amulets rendered as gorgets/collars, body armor rendered with attached
  neckwear/belts/skirts, belts rendered as faulds/tassets/skirts, or shields
  rendered with front-side straps/hardware/clamshell construction
- copied body parts, hands, feet, face, or mannequin fragments
- unreadable over-ornamented silhouette at inventory scale
- polearm, spear, staff, or long weapon shortened into a club/wand/mace-length
  prop, or cropped so the butt/tip is missing
- ragged fringe so heavy that body armor reads like torn costume trash instead
  of usable gear

After acceptance, the item still needs normal intake: save from Downloads,
record in `DOWNLOAD-INTAKE.md` / `download-intake.js`, run
`python3 core/chroma_key.py SOURCE_DIR --out CLEAN_DIR`, then compose the
resulting RGBA as a true-alpha source if promoted into runtime assets. Update
duplicate exclusions.
