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
- we need better shields, armor, belts, footwear, War-calls, Quick Rigs,
  Attendants, specialty-pack contents, relic gear, or offhands than the vacuum
  prompt pipeline is producing

Do not use it to copy an existing commercial character or living artist style.
For Verdigris, use original generated/source-owned character concepts or
approved project references.

## Source Character Calibration

Before extracting item slots, calibrate source characters with prompts that
make the faction and gear system visible. Prefer multiple separate images for
these calibration sets when possible; dense collages often collapse bodies,
silhouettes, values, and offhand items into near-copies. Use collages only when
the goal is a quick lineup sheet.

Every calibration prompt should include:

- faction body/silhouette archetype, not only faction palette
- faction virtue/vice design pressure expressed through gear weight, restraint,
  austerity, wealth, mobility, or weather-readiness
- distinct material value range so the set does not become the same dark grey
  outfit with different accents
- a pure neutral-white source-character background with neutral-white key and
  rim lighting; no blue-gray backdrop, cool grading, or global desaturation
- tier progression for belts, amulets, foci/offhands, handwear, footwear, and
  outer layers, not only torso armor
- distinct offhand/focus families for Mages so all foci do not become mirrors

Name factions by the craft system we want the model to render, not by a biome
that accidentally dictates grime and color grading. The northern starter
faction is the Northern Bronze Houses. Describe it through pale hemmed wool and
linen, spatially separate madder-crimson, spruce-green, and golden-ochre woven
borders, polished bronze, pale wood, horn, tailored shawls, rectangular
mantles, and restrained amber jewelry. Do not use
marsh, taiga, bog, peat, damp-survival, bog-iron, or dark-wool framing in its
generation prompts; those cues produced muddy grey-brown clothing.

Do not write private elemental planning labels into final prompts. If a faction
was planned from an ice/earth/air/fire association, translate that into
concrete culture, material, climate, clothing, and silhouette language before
prompting.

Likewise, source-character ladder prompts use Strength, Dexterity, and
Intelligence as equipment-design axes rather than naming fixed fantasy classes.
An attribute axis specifies construction pressure and handling logic; it does
not decide the character's profession before the faction design is interpreted.

Keep the source-character render environment colorless. Use a pure
neutral-white studio background, neutral-white key and rim lights, and neutral
daylight/studio white balance. A blue-gray background plus cool rim and cool
grading was found to contaminate every faction and tier with subdued slate-blue
equipment. Low tier should be cheap because its components, joins, and materials
are simple, not because its colors are faded. Reserve blue-family palette
drivers for the one explicitly assigned Nile Intelligence true-lapis field;
Northern, Cedar, and Silkroad source-character ladders use other local colors.
This source-character rule does not replace the later isolated-item matte block.

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

## Auxiliary Extraction Pass

Run a second six-image pass for source characters that have enough design
language to support the unlockable categories. These are real item categories,
not miscellaneous curios:

1. STR War-call: war horn, signal drum, command rattle, or compact standard.
2. DEX Quick Rig: quiver, knife roll, dart case, sling-pouch, trap case, or
   fast-access harness.
3. INT Attendant: a hands-free semi-floating or orbiting magical orb, caged
   light, rotating ring, hovering mirror, bound stone, or comparable focus.
4. STR+DEX Spoil: a dressed trophy, monster part, mounted hunt token, shell,
   fang, claw, antler, hide, or carapace.
5. DEX+INT Preparation: an identifiable reagent, venom, resin, herb, root,
   pigment, measured powder, ampoule, instrument, chart, or trap component.
6. INT+STR Reliquary object: a relic, charm, offering, sanctified object,
   codex, scroll case, votive vessel, or ancestor fragment.

Use this exact prompt block after the main ten-slot extraction:

```text
Generate 6 images. No commentary.

Use the attached character image as the authoritative design reference. Extract
six additional independent ARPG inventory item icons belonging to the same
equipment culture and craftsmanship. Create six separate image files, never a
sheet, collage, lineup, grid, paperdoll, or multi-item canvas. If you cannot
generate six separate files, generate only item 1 instead of combining them.

1. One 2x2 War-call instrument: a war horn, signal drum, command rattle, or
compact standard. It must be a complete carried object with physical authority.
2. One 2x2 Quick Rig: a complete quiver, knife roll, dart case, sling-pouch,
trap case, or fast-access harness. Show the rig alone with its straps and
carrying structure, never attached to a body.
3. One 2x2 Attendant focus: a hands-free semi-floating or orbiting magical orb,
caged light, rotating ring, hovering mirror, bound stone, or comparable focus.
Overt magical levitation, glow, orbiting components, and impossible suspension
are allowed. It must not include a hand, arm, person, or paperdoll slot.
4. One Spoils Roll item: a dressed trophy, monster part, mounted hunt token,
shell, fang, claw, antler, hide, or carapace with a strong readable silhouette.
5. One Preparation Case item: an identifiable reagent, venom, resin, herb,
root, pigment, measured powder, ampoule, compact instrument, folded chart, or
prepared trap component. It must read as a concrete physical object rather than
abstract currency.
6. One Reliquary item: a relic, charm, offering, sanctified object, codex,
scroll case, votive vessel, or ancestor fragment with credible ritual use.

Infer each object from the source character's materials, construction, palette,
ornament density, social status, and attribute-axis equipment logic. The six
items should belong to the same culture but must not repeat one identical gem,
emblem, face, medallion, or central motif. Render each complete object isolated
on the standard flat olive-slate #737A68 matte, with no cast shadow, ground
plane, scenery, UI, hands, body parts, mannequin, text, border, or frame.
```

## Prompt Template

Use this as the working multi-image prompt. ChatGPT/image-2 batch output has
not been reliable for true alpha: it may bake checkerboards or return opaque
white backgrounds even when asked for transparent PNGs. For loadout extraction,
generate on a flat slate matte instead, then run `core/chroma_key.py` locally.

The current matte color is `#737A68` / sampled around `#6A6E5F` in outputs. It
is far less toxic than magenta if a small edge fringe survives: the remainder
reads as neutral dirt or cloth fuzz instead of a hot colored halo.

```text
Generate 10 images. No commentary.

Use the attached character image as the authoritative equipment reference. The
goal is not to make a paperdoll UI screen, not to make a contact sheet, and not
to redesign the character. The goal is to extract the character's worn
equipment into separate ARPG inventory item icons.

Output-file rule:
The opening instruction deliberately says "Generate 10 images." The exact image
count is required. Create one separate PNG image output for each item slot
below. Each output must be its own independent image file. Do not combine items
into one sheet, collage, grid, lineup, contact sheet, UI board, paperdoll, or
multi-item canvas. If you cannot generate 10 separate independent files in this
request, generate only slot 1 as a single item image instead of making a sheet.

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

Gender presentation rule:
All equipment bases are unisex. Do not turn the same kit into revealing female
armor and covered male armor. If the source contains male and female versions,
use the same item base language for both: same coverage, protection level,
construction, material logic, and slot identity. Body fit may vary: feminine
versions can be more fitted or waist-shaped, masculine versions can be broader
or heavier, but the equipment category should remain the same.

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

Motif budget and anti-overmatching:
The set should share material language, craftsmanship, wear level, and faction
construction logic, but it must not repeat the same focal motif on every item.
Do not put a central round blue stone, central gem, central boss, eye, sun mark,
wheel mark, face, medallion, or emblem on every slot. Use strong focal motifs
on at most one or two items total. Other items should coordinate through
different design features: edge profile, plate layout, grip wrap, weave,
stitched seam, carved rim, scale pattern, shell edge, hammered surface, or
material contrast. Coordinated does not mean matching centerpieces.

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

Side-laid weapon and shield rule:
If the source image shows a weapon or shield laid beside the character, treat
that separate object as the authoritative reference for that slot. Preserve its
complete silhouette, proportions, full length, material construction, and
outline. Do not shorten a side-laid weapon, do not thicken the shaft into a
club, do not crop the tip or butt, and do not convert a side-laid shield into a
different shield shape.

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
- side-laid weapons and shields preserve the source object's proportions
- flat slate matte is uniform enough for `chroma_key.py`
- no body parts, UI, checkerboard, contact sheet, or extra background
- small neutral cloth/fiber edge residue is acceptable if it reads as material

Reject:

- baked white/gray checkerboard
- magenta, green-screen, white, black, gradient, or textured backgrounds
- paperdoll UI, contact sheet, or combined grid
- multiple extracted slots combined into one sheet instead of separate files
- item that only works as costume decoration and not loot
- floating, ungrounded tassels/coins/symbols with no physical attachment
- overmatched set where every item repeats the same central blue stone, gem,
  boss, emblem, sun, wheel, face, medallion, or focal ornament
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
- side-laid weapon or shield reinterpreted, shortened, thickened, cropped, or
  changed into a different object
- ragged fringe so heavy that body armor reads like torn costume trash instead
  of usable gear

After acceptance, the item still needs normal intake: save from Downloads,
record in `DOWNLOAD-INTAKE.md` / `download-intake.js`, run
`python3 core/chroma_key.py SOURCE_DIR --out CLEAN_DIR`, then compose the
resulting RGBA as a true-alpha source if promoted into runtime assets. Update
duplicate exclusions.
