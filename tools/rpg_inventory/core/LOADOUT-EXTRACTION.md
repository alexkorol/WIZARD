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
5. Body armor plus only clearly visible source lower-body components, such as a
   skirt, kilt, robe hem, faulds, tassets, cuisses, greaves, or actual pants/leggings
6. Outer layer: cloak, shawl, scarf, veil, mantle, or hooded layer
7. Belt, girdle, sash, waist harness, or horizontal hip piece
8. Ring or compact finger jewelry
9. Handwear: mitts, closed-finger gloves, half-gauntlets, gauntlets, short
   cuffs, wrist bands, wraps, archer guards, bracers, or vambraces
10. Footwear, boots, sandals, shoes, or anklets; greaves stay with body armor

If the reference has no meaningful outer layer, use slot 6 for a second ring or
another prominent accessory. If the character is barefoot, depict sandal sole,
anklet, toe ring, greave, or foot jewelry only; do not draw feet.

## Four-Character Separation Pass

When the available source is one composite containing four characters, do not
send the dense composite directly into final ten-slot extraction. First create
exactly four separate 3:2 landscape character reference boards in source reading
order. Each file contains one full-body character plus four or five enlarged,
non-overlapping equipment studies from that character only. The central
character preserves identity and the surrounding objects expose construction
details for the later item pass.

This bridge pass must not merge characters, average their designs, duplicate a
character, or exchange equipment between them. Preserve full cloak, mantle,
coat, robe-armor, and long body-piece silhouettes rather than shortening them.
Keep structural shoulder armor with its body piece, but keep separable belts,
sashes, amulets, necklaces, gorgets, and outer layers separate. Treat claw
weapons as main/off-hand weapons with credible grips or fastening structures,
not as mitts, gloves, gauntlets, cuffs, bracers, grafts, or anatomy. Paired mitts,
gloves, gauntlets, cuffs, wrist bands, wraps, bracers, boots, and sandals appear empty and as a
pair; greaves remain inside the full body-armor
assembly. No surrounding study may contain
hands, arms, legs, feet, toes, heads, faces, skin, or mannequin fragments.

Preserve the source handwear family rather than defaulting it to bracers. Mitts
retain their compact hand-covering body, closed-finger gloves retain their
fitted fingers, short cuffs and wrist bands stop near the wrist, and wraps stay
flexible and visibly wound. Only true bracers and vambraces extend over a
substantial part of the forearm. Never cut the hand portion from mitts or gloves,
lengthen a cuff into forearm armor, or add generic plates absent from the source.
Any protection crossing the wrist onto the backhand, palm, knuckles, or fingers
is a half-gauntlet or gauntlet: preserve its complete empty hand cage and never
trim it at the wrist into a bracer.

The enlarged body-armor study must be ungirdled and beltless even when the
central character wears a belt over it. Remove every separable belt, girdle,
sash, waist cord, waist harness, gorget, necklace, pendant, collar plate, throat
guard, scarf, mantle, and cloak from the armor study. If an accessory is too
unremarkable to use one of the four or five studies, omit the accessory
entirely; this never permits it to remain overlaid on the armor. Preserve only
the armor's integral seams, plates, shoulder protection, closures, hem, and
structurally attached lower construction.

The same body-armor study includes only lower-body clothing and protection that
is clearly visible in the source: skirts, kilts, robe hems, coat tails, faulds,
tassets, cuisses, greaves, or actual trousers/pants/leggings. Most armor studies
should not contain pants or leggings. Never invent trousers, leggings, an
undersuit, or a bodysuit to connect pieces, cover empty space, or complete an
outfit. Arrange only observed components beneath the torso armor as one empty
exploded gear composition with small clean gaps, never worn by an invisible
mannequin. Do not extract them as separate studies and do
not reinterpret any of them as a belt. A belt study is reserved for a genuine
narrow waist-worn belt, girdle, sash, cord, or harness only.

Every selected belt study targets the game's shallow 2:1 belt slot. Its visible
silhouette must be at least twice as wide as it is tall and read as a continuous
horizontal band, laid straight or in a shallow arc. Remove, tuck behind the
band, or omit long tassels, fringe, sash tails, hanging cords, straps, chains,
pouches, apron panels, tassets, streamers, and other vertical rigging. If the
waist item cannot retain its identity as a clean 2:1 band, omit it and select a
different item; the body armor remains ungirdled.

Body armor ends at the greaves or ankle. Exclude boots, shoes, sandals,
slippers, moccasins, soles, toe boxes, and all other footwear from the body-armor
study, even when greaves overlap boots in the source. Greaves are empty shin
shells with no boots, legs, ankles, feet, or skin inside. Footwear receives its
own separate study.

Use the pure neutral-white source-character environment for this separation
pass. Do not use the olive-slate extraction matte until generating the final
isolated item images. The private block-built prompt and builder live under
`character_pipeline_local/SEPARATOR-PROMPT-BLOCKS.md` and
`character_pipeline_local/build_separator_prompt.py`.

## Auxiliary Extraction Pass

### Taxonomy coverage steering

Read `ANCIENT-EQUIPMENT-TAXONOMY.md` before scheduling a batch. Track coverage
by family ID and visible construction, not only by paperdoll slot. When the
source supports multiple valid choices, prefer an underrepresented P2 or P3
family over another generic curved sword, paired dagger, round shield, circlet,
jeweled bodice, ornamental waist chain, generic bracer, open-toe shoe, or
staff-and-orb focus. A taxonomy target may resolve an ambiguous or flexible
slot, but it never authorizes inventing core equipment that the source does not
visibly carry or strongly evidence. The separate six-lane auxiliary pass is
intentionally a same-culture design pass: it may extrapolate a new War-call,
Quick Rig, Attendant, Spoil, Preparation, or Reliquary family from the source
craft system when that object is not literally worn by the character.

Rotate the auxiliary pass beyond one default per category. War-calls can be
animal horns, Bronze Age curved trumpets, straight salpinges or Etruscan
trumpets, hooked litui, cornua, carnyx-like vertical trumpets, drums, rattles,
sistra, clappers, bells, or compact standards. Quick Rigs can be bow quivers,
gorytoi, javelin or weighted-dart cases, sling-bullet side carriers, knife rolls,
archer kits, fletching cases, medicine rolls, pigment cases, trap cases, and
fire-and-trap cases. Attendants can derive from polycandelon lamp wheels,
chained censers, suspended oil lamps, mirrors, bells, pyxides, seal-cylinder
spindles, vessels, or armor-scale cages instead of defaulting to an orb.
Reliquaries can be boxes, coffers, pyxides, ampullae, offering bowls, libation
vessels, censers, lamps, codices, scroll cases, diptychs, wrapped relics, seal
sets, bells, staff heads, ladles, or shrine keys.
Preserve the exact source culture and implied era; do not combine unrelated
museum types merely to increase the count.

Run a second six-image pass for source characters that have enough design
language to support the unlockable categories. These are real item categories,
not miscellaneous curios:

1. STR War-call: one signaling-instrument or command-standard family.
2. DEX Quick Rig: one complete back-worn or side-strapped fast-access weapon,
   tool, ammunition, or field-kit carrier; never handheld or off-hand equipment.
3. INT Attendant: one hands-free magical focus structurally descended from an
   ancient lamp, censer, mirror, bell, vessel, spindle, ring, or scale cage.
4. STR+DEX Spoil: one source-evidenced raw crafting material, or one dry
   species-specific beast harvest, ready to sell or consume in item crafting.
5. DEX+INT Preparation: one gathered, measured, mixed, packed, or tool-bearing
   reagent or field-preparation family.
6. INT+STR Reliquary object: one strong container, vessel, book/case, preserved
   fragment, or handled ritual-object family.

Use this exact prompt block after the main ten-slot extraction:

```text
Generate 6 images. No commentary.

Use the attached character image as the authoritative design reference. Extract
six additional independent ARPG inventory item icons belonging to the same
equipment culture and craftsmanship. Create six separate image files, never a
sheet, collage, lineup, grid, paperdoll, or multi-item canvas. If you cannot
generate six separate files, generate only item 1 instead of combining them.

1. One 2x2 War-call. Choose exactly one complete family: animal horn; Bronze
Age broad-curved trumpet; straight salpinx or Etruscan bronze trumpet; hooked
lituus; braced circular cornu; tall carnyx-like trumpet; frame or signal drum;
handled rattle or sistrum; paired clappers; heavy bell; compact standard;
rigid standard finial on short stem; or bounded vexillum. Preserve the complete
mouthpiece, tube, bell, drum body, sounding frame, or standard head. Frame long
trumpets and standards tip to tip on a steep diagonal rather than shortening
them into a club or wand.

2. One 2x2 Quick Rig. Choose exactly one complete family: arrow quiver;
combined gorytos bowcase-quiver; lidded cylindrical quiver; javelin, dart, or
weighted-dart case; sling-bullet side carrier containing almond-shaped shot and one
rolled sling; knife roll; archer belt kit; fletching repair case; medicine
instrument roll; pigment-and-seal case; trap case; or fire-and-trap case. Show
the complete container, rigid backboard or pack frame, shoulder harness, broad
side straps, mouth/base, and recognizable secured contents. Render the rig
isolated and empty of anatomy while making its back/flank attachment obvious.
It is never held in a hand, never assigned to the off-hand slot, and never a
purse, handbag, satchel, messenger bag, briefcase, suitcase, doctor bag,
lunchbox, clutch, handled box, or modern luggage silhouette.

3. One 2x2 Attendant focus. Choose exactly one historical construction anchor:
openwork polycandelon lamp wheel; three-chain censer; suspended oil lamp;
backed bronze mirror; substantial bell and yoke; lidded pyxis; seal-cylinder
spindle; footed vessel; spindle whorl; arm ring; or overlapping scale cage.
Reinterpret that structure as a hands-free hovering magical focus.
Overt magical levitation, glow, orbiting components, counter-rotation, and
impossible suspension are allowed. Do not default to a bare glowing orb. It
must not include a hand, arm, person, severed body part, stand, or paperdoll.

4. One Spoils Roll crafting material. Choose exactly one raw or minimally
field-processed nonhuman product: unpolished tusk; naturally mismatched tusk
pair tied with plain cord; rough horn section; trimmed antler segment; dry jaw
section; fang bundle; claw bundle; large shell piece; carapace chunk; natural
scale patch; minimally cured pelt roll; scraped raw-hide sheet; usable feather
bundle; dry fin or spine section; wrapped stinger or barb; hoof; talon sheath;
or sinew bundle. It is merchandise and consumable crafting stock that could
plausibly supply the horn, bone, shell, hide, scale, sinew, feather, tooth, or
carapace used in equipment like the source character's visible gear.

SOURCE EVIDENCE OVERRIDES THE GENERIC LIST. First generate the raw precursor of
a conspicuous source-gear material: shell, bone, horn, tooth, scale, carapace,
hide, feather, or a rough uncut precious-stone nodule still in natural matrix.
If the source character is a beast, instead use one species-specific feature
clearly visible on it: shed horn/antler, tooth/fang, claw/talon sheath,
scale/plate patch, carapace, quill, pelt/hide, or stinger. Present it dry,
cleanly detached, and inventory-ready, never as a whole head, face, paw, limb,
or gory chunk. If neither source supports a material, choose a different
auxiliary family. Never generate sticks, twigs, branches, firewood, or a generic
stick bundle as Spoils.

Show only minimal practical harvesting or preservation: washed, scraped,
dried, salted, roughly trimmed, tied with plain cord, or wrapped in rough cloth
or hide. Preserve natural asymmetry, cracks, growth ridges, fibrous cut faces,
and irregular edges. Its value comes from rarity, size, usable material,
texture, and condition, not decorative workmanship.

SPOILS ARE RAW CRAFT MATERIALS, NOT PRESTIGE TROPHIES. Do not polish, lacquer,
gild, jewel, engrave, inlay, encrust, plate, cap, socket, pedestal-mount,
plaque-mount, frame, or turn the material into jewelry, ceremonial display,
weapon, or finished armor. Do not invent impossible branching horns, perfect
symmetry, decorative metal cages, or precious-metal fittings. No wet gore,
human remains, or butcher-shop horror.

5. One Preparation Case item. Choose exactly one concrete family: bound herb
sheaf; dried roots; resin or incense cake; protected venom ampulla; oil or
unguent flask; divided pigment cakes; measured powder vial; rectangular stone
ointment palette; two-piece bronze cosmetic grinder; mortar and pestle;
lidded pyxis; ointment jar; cased medicinal salve sticks; needle-and-probe case;
surgical instrument roll; bandage-and-suture packet; fletching kit; arrow-poison
pot; fire-making packet; or trap-trigger packet. It must look gathered,
measured, mixed, packed, or tool-bearing, never like abstract currency, a
generic potion-shop bottle, or a modern laboratory kit.
Botanical Preparations must be an identifiable herb, root, bark, resin, or dye
plant with useful leaves, flowers, roots, cake, or scraped material; never a
generic bundle of bare sticks.

6. One Reliquary item. Choose exactly one strong family: deep lidded relic box;
votive coffer; cylindrical pyxis; neutral-geometry 5th-6th-century ampulla;
offering bowl; libation vessel; lidded censer; ritual lamp; thick closed Late
Antique codex; sealed scroll case; hinged diptych; ancestor-knucklebone box;
wrapped nonhuman relic; sacred textile bundle; seal set; ritual bell; carved
staff head; robust votive figurine; ceremonial ladle; or large shrine key. It
must read as a container, vessel, book or case, preserved fragment, or handled
ritual implement before lore explains it. No generic crystal, flat plaque,
copied sacred symbol, readable text, or abstract magic token.

Infer each object from the source character's materials, construction, palette,
ornament density, social status, and attribute-axis equipment logic. The six
items should belong to the same culture but must not repeat one identical gem,
emblem, face, medallion, or central motif. Render each complete object isolated
on the standard flat olive-slate #737A68 matte, with no cast shadow, ground
plane, scenery, UI, human anatomy, hands, mannequin, text, border, or frame.
Dry nonhuman tusks, teeth, claws, jaws, hides, carapaces, scales, feathers,
spines, stingers, hooves, talons, and sinew are allowed only in item 4 as raw
or minimally preserved crafting stock; never include wet gore, human remains,
or butcher-shop horror.

Taxonomy coverage rule: the six-lane pass may extrapolate same-culture objects
from the source character's visible materials and craft, even when the exact
auxiliary object is not worn. Choose one underrepresented construction family
per lane rather than repeating the most familiar fantasy silhouette. Never
combine several listed families into one category mashup. Across batch history,
rotate family IDs from WC, Q, AT, SP, PR, and RL in
ANCIENT-EQUIPMENT-TAXONOMY.md and record the selected IDs with the saved batch.
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

ANATOMY FIREWALL - FIRST PASS:
Every extracted item is an object only. No toes, feet, heels, ankles, legs,
thighs, hips, belly, tummy, abdomen, midriff, navel, waist flesh, torso flesh,
arms, hands, fingers, neck, head, face, ears, scalp, hair, braids, locs, or skin
may appear in any item image. Do not copy anatomy along with worn gear. Never
use a body part, invisible mannequin, flesh-colored filler, or hairstyle as an
equipment stand. If an item cannot be separated without anatomy, omit it and
choose another source-supported item.

Slots to generate:
1. Main hand weapon
2. Off hand shield, focus, ritual tool, or secondary weapon
3. Helmet, crown, hood, cap, or headgear
4. Amulet, pendant, necklace, or compact throat ornament
5. Body armor plus only clearly visible source lower-body components, such as a
   skirt, kilt, robe hem, faulds, tassets, cuisses, greaves, or actual pants/leggings
6. Outer layer: cloak, shawl, scarf, veil, mantle, or hooded layer
7. Belt, girdle, sash, waist harness, or horizontal hip piece
8. Ring or compact finger jewelry
9. Handwear: mitts, closed-finger gloves, half-gauntlets, gauntlets, short
   cuffs, wrist bands, wraps, archer guards, bracers, or vambraces
10. Footwear, boots, sandals, shoes, or anklets; greaves stay with body armor

If the reference has no meaningful outer layer, use slot 6 for a second ring or
another prominent visible accessory instead. If the character is barefoot,
depict sandal sole, anklet, toe ring, greave, or foot jewelry as an object only;
do not draw feet.

For each slot, infer the item from what the character is visibly wearing or
carrying. If a slot is partly hidden, extrapolate from the same coherent kit:
same material logic, same construction methods, same ornament density, same wear
level, same palette family, and same craftsmanship. Do not invent a different
faction or unrelated fantasy style.

Taxonomy coverage rule:
Preserve enough visible construction to classify the item family: blade and
hilt outline, haft or socket, shield outline, helmet bowl with cheek or neck
elements, armor assembly, carrying case, signal-instrument body, or ritual-tool
grip. When the source supports multiple valid interpretations for a partly
hidden or flexible slot, prefer an underrepresented P2 or P3 family from
ANCIENT-EQUIPMENT-TAXONOMY.md over another generic curved sword, paired dagger,
round shield, circlet, jeweled bodice, ornamental waist chain, generic bracer,
open-toe shoe, or staff-and-orb focus. Taxonomy diversity may break a tie among
source-supported choices; it may never add an object absent from the character.

Handwear fidelity rule:
Do not turn every hands-slot item into bracers. Preserve mitts as compact
mitten-like hand coverings, closed-finger gloves as fitted hand coverings,
short cuffs or wrist bands as shallow bands ending near the wrist, and wraps as
flexible wound material. Only source-visible bracers or vambraces extend over a
substantial part of the forearm. Never amputate the hand body from mitts or
gloves, lengthen cuffs into bracers, or add metal forearm shells absent from the
source. Render the complete empty pair unless the source clearly uses one
asymmetric piece.
If protection crosses the wrist onto the backhand, palm, knuckles, or fingers,
classify it as a half-gauntlet or gauntlet and preserve its complete empty hand
structure. Never trim that structure at the wrist and output only a bracer.

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

Body armor begins with the torso armor. Prefer open neck construction consistent
with ancient and Bronze Age gear. Include only lower-body components clearly
visible in the source: skirt, kilt, robe hem, coat tails, loincloth panel,
faulds, tassets, cuisses, greaves, or actual trousers/pants/leggings. Most armor
studies should not contain pants or leggings. Never invent an underlayer,
undersuit, trousers, leggings, or bodysuit to complete the silhouette or connect
separate components. Do not include an attached gorget, collar, turtleneck,
belt, sash, necklace, scarf, mantle, or cloak.

Belts must render as horizontal waist items for a landscape 1x2 slot: belt,
girdle, sash, cord, or waist band. Do not turn the belt slot into a skirt,
faulds, tassets, cuisses, greaves, pants, leggings, apron, robe hem, or hanging
costume panel. Those lower-body pieces belong in the body-armor image.

Belt 2:1 geometry rule:
The belt's visible silhouette must be at least twice as wide as it is tall. Lay
it straight or in one shallow arc so the band dominates. Remove, tuck, or omit
long tassels, fringe, sash tails, hanging cords, straps, chains, pouches, apron
panels, streamers, and other vertical rigging. No hanging element may make the
belt taller than half its width. If the source waist item cannot retain its
identity as a clean shallow band, omit it rather than generating a square item.

Shields must show the front fighting face only. Do not render the back side,
inside of the shield, clamshell openings, front-side straps, dangling front
hardware, handle loops, random rings, or utility rigging. The shield may have a
boss or face material, but the visible front should remain clean and functional.

Use gauze, translucent cloth, shredded cloth, and ragged fringe sparingly.
Prefer opaque linen, wool, hide, leather, bark cloth, felt, woven fiber, or
thicker silk-like panels. Cloak edges can be worn, but not so shredded that the
asset becomes hard to cut out or reads as costume trash.

For every image: render exactly one isolated inventory item cutout. Anatomy is
zero tolerance: no character body, hands, fingers, arms, shoulders, legs, knees,
ankles, feet, heels, toes, head, face, ears, hair, neck, skin, ghost limbs,
flesh-colored filler, mannequin, or torso; no floating UI slot,
no paperdoll silhouette. If generating sandals or barefoot-style footwear,
depict the sandal soles, straps, or anklets only; do not draw feet. If
generating mitts, gloves, gauntlets, cuffs, wrist bands, wraps, or bracers, show the pair
as empty objects only, not worn on hands or arms.
If generating rings, show the ring as a distinct object, large enough to read as
loot.

Helmet and headgear images must be empty shells. Do not include a head, scalp,
face, ears, ear shapes, hair, eyes, nose, mouth, or neck. Fill visible helmet or
hood openings with deep neutral interior shadow rather than anatomy. Body armor,
trousers, leggings, and greaves must also be visibly empty; use hollow dark
openings and small component gaps rather than an invisible mannequin or skin.

Repeat slot-specific anatomy firewalls:
- Body armor: no belly, tummy, abdomen, midriff, navel, waist flesh, hips,
  thighs, legs, shoulders, arms, neck, chest flesh, or skin. Openings show only
  background or clearly non-flesh neutral charcoal lining.
- Headgear: hair is anatomy, not equipment. No head, scalp, face, ears, hair,
  braids, locs, ponytail, bun, or neck. If an ornament cannot stand alone after
  removing all hair and anatomy, omit it.
- Footwear: no toes, toenails, toe shapes, feet, heels, ankles, legs, or skin.
  If an empty sandal cannot be rendered without toes or feet, omit it.

Footwear coverage rule:
Closed-toe footwear is the default. Boots, shoes, slippers, moccasins, armored
shoes, and comparable footwear must have a complete enclosed toe box. Do not
convert them into sandals, open-toe boots, peep-toe shoes, toe-loop footwear, or
footwear with decorative toe cutouts. Use open-toe sandals only when the source
unmistakably shows them. If the source footwear is obscured or ambiguous, infer
a closed-toe boot or shoe from the same kit rather than inventing exposed toes.
Every footwear image is an empty pair with no feet, toes, skin, or flesh-colored
filler.

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
visible with no cropping. Paired items such as mitts, gloves, gauntlets, cuffs, wrist
bands, wraps, bracers, sandals, or boots should appear together in one icon,
slightly overlapping at a
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

FINAL ANATOMY AUDIT - REPEAT BEFORE GENERATING:
Reject or replace any item image containing toes or feet; belly, tummy, abdomen,
midriff, thighs, or skin; head, ears, hair, braids, or locs; hands, fingers, or
arms. Reject body armor containing footwear. Do not output anatomy. If anatomy
cannot be removed cleanly, omit that study and substitute another item. Repeat:
no toes, no tummy or abdomen, and no hair in any separated item.

Generate the separate slate-background images now, one per slot.
```

## QA Notes

Accept:

- item clearly belongs to the source kit
- detail is integrated into the object and improves the silhouette/material read
- usable construction is visible or strongly implied
- slot identity is preserved: ring stays ring, amulet stays pendant, belt stays
  a true 2:1 horizontal waist band, body armor includes only source-visible
  lower-body components, and shield shows its front
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
  neckwear/belts, missing clearly visible source lower pieces, or invented
  pants/leggings/undersuits; belts rendered as
  square objects, tassel/fringe rigs, skirts/pants/leggings/faulds/tassets/greaves,
  or shields
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
