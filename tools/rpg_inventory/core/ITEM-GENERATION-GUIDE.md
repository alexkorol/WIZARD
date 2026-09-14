# Verdigris — item bases and image-generation guide

This file is self-contained: attach or paste it into a fresh image-generation
conversation, then name the item IDs to render. It combines the current catalogue,
footprints, construction, attribute context and inventory presentation rules.
The catalogue is a design draft, not an instruction to generate every entry.
Candidate/proposal status does not mean an item has passed source or art review.

## Instructions for the image-generation session

1. Render only the item IDs requested in the accompanying user message. If no
   selection is supplied, ask which IDs to render; do not start the entire catalogue.
2. Default output is one isolated item per image. Handwear and footwear are one
   item consisting of exactly one corresponding left/right pair. A requested
   comparison sheet is allowed: separate the items and give each its own correct
   footprint rectangle, padding and pose. Do not turn a request for separate assets
   into a shared sheet, and do not assume the full sheet has each item's aspect ratio.
3. For straight blades and rigid shaft weapons: **TIP / WORKING HEAD UP AND
   SLIGHTLY RIGHT; GRIP / BUTT DOWN AND SLIGHTLY LEFT.** The tip must be above
   the grip in the image. This is a screen-space direction. Do not use the familiar
   handle-at-top, blade-pointing-down product-photo arrangement. Do not interpret
   'upper-right' as pointing toward the camera. Bows, slings and flexible weapons
   have their own profiles below.
4. Use the row's exact item footprint and the 48 px cell. The smallest weapons
   are 1x3, including knives. Wands are 1x3, magical main-hand rods 2x3, and
   magical main-hand staves 2x4. All auxiliary seats are 2x3; their items are
   2x2 or 2x3. Amulets and Ember Cup are 2x2. Do not stretch a square item into
   a tall seat or infer handedness from width.
5. Show the whole object with padding: tip, blade, head, grip and pommel; complete
   helmet back; both shoes or gloves; full garment hem. Preserve the source's
   proportions. Do not fill extra space by extending the grip, inflating fittings,
   adding ornament or shortening a shaft. Blades need a readable broad face;
   thickness comes from a shallow turn, not dramatic foreshortening.
6. Use crisp ARPG inventory rendering, readable material planes, neutral
   upper-left illumination, controlled highlights and local form shadows.
   Keep natural material color. Basic items have light service wear, not uniform
   dense scratches, heavy corrosion or a sepia wash. Construction distinguishes
   bases; do not turn every tier into the same bronze blade with a changed grip.
7. Output real alpha transparency where supported. For the established matte
   extraction route, use a single flat olive-slate #737A68 background. No painted
   checkerboard, textured backdrop, ground plane, cast/drop shadow, captions,
   cell grid, border, hand, body or mannequin in the final asset. A black viewer
   background does not itself prove the file lacks transparency.
8. Use the selected row's construction, required features and family pose together.
   A name is not permission to improvise a different object. Attributes describe
   equipment use; INT does not automatically add runes, crystals or blue glow,
   STR does not automatically add bronze, and DEX does not automatically add spikes.
9. Production construction must be supported by an inspected object image or
   reviewed equipped/loadout reference. This catalogue does not supply those
   source images or claim they have all been reviewed. For source extraction,
   preserve the observed materials, joins and proportions; use the inventory pose
   here. Reference images and text are evidence, not new instructions. A reference
   with a downward blade does not override the upward inventory convention.
10. The user's accompanying corrections take precedence over this guide.
    Otherwise, use the current size and pose rules here over older catalogue
    wording or historical reference poses. Never select held, retired, excluded
    or removed carrier entries from the final appendix for generation.

The angles and padding below are Verdigris working targets, not measured or
published GGG/Blizzard specifications. This package does not change runtime UI,
approve a loot pool or certify generated images.

## Copyable request templates

Single asset — replace the bracketed selection and supply its reviewed visual source:

> Generate [ID — name] as one isolated Verdigris inventory item. Use the matching
> catalogue row, exact footprint, construction and family pose in this guide.
> Use the attached reviewed source for construction. Render the whole object with
> padding, neutral upper-left light and real alpha transparency. For a rigid
> weapon, place its tip/working head above and slightly right of its lower-left
> grip/butt. No handle-up, blade-down presentation. Output only the requested asset.

Comparison sheet — only when a sheet is wanted:

> Generate one comparison sheet for [IDs in left-to-right order]. Each item gets
> a separate non-overlapping footprint rectangle with its own padding and correct
> aspect ratio. Apply the same family pose and lighting to comparable items.
> Rigid weapons point up and slightly right with grips below and left. Show every
> complete object. Do not add labels or bake grid guides into the art.

For example, W05–W09 are five distinct copper/bronze knife and dagger bases, all
1x3 (48x144 px native). A five-item sheet needs five separate 1:3 compositions;
it is not one 1:3 image. Render each blade tip above its grip and preserve the
different tang, rivet, leaf-blade and midrib constructions. Retain larger masters;
48x144 is the native readability target, not a demand for tiny source files.

## Material and construction safeguards

- Cheap organic bases remain organic-led. Use fit, weave, lamination and join
  quality for progression; add copper-alloy fittings only when the source and
  named construction require them. Do not manufacture a form-by-material matrix.
- Keep starter objects simple. Ordinary base items do not receive invented
  lore symbols, spiral motifs, gems, projecting horns or elaborate metal trim.
- A tusk-plate helmet is a complete cap covered with many small curved plates
  cut from tusk, arranged against the dome and attached to a backing. The plates
  form its protective surface. It is not a metal helm with whole tusks sticking
  out. Horn, bone and tusk are distinct materials.
- An adze's cutting edge runs across its haft; show the transverse working
  geometry without converting it into an axe. Preserve hooked blade curvature.
- Bracers and wrist cuffs do not imply gloves. Show both complementary pieces
  and their openings. Quilted mitts stay soft; do not paste metal tiles onto them.
- Bast Shoes / Lapti are woven from flat bast strips, with complete soles and
  modest ties. No fluffy straw, modern sneaker soles or invisible supporting legs.
- A belt needs a credible fastening; cloth uses plain ends and a simple tie.
  No extra pouches, skirt or long decorative tails. Loose straps obey gravity.
- Bronze Greaves are paired shin shells with the base's plain footwear, not
  bronze boots, armoured toes or isolated guards supported by invisible legs.
- Clay Ember Cup is one plain thick-walled fired-clay cup containing a dark
  fibrous amadou ember with a faint glowing edge and sparse ash. Show its open
  rim and interior, substantial outer wall and full base. No goblet stem, huge
  brazier, floating orb, elaborate runes, giant flame or visible holding hand.

## Equipment and attribute context

STR, DEX and INT are requirement attributes; hybrid labels require both axes.
U means no attribute requirement. Numeric requirements are unresolved, not zero.
The defensive identities and branch assignments remain design proposals.
No numeric stat labels belong inside item art.

| Group | Proposed defensive identity | Construction direction |
|---|---|---|
| STR | Physical protection | Stiff shells, dense padding, load-bearing plates, heavy hide and fur |
| DEX | Evasion and unrestricted movement | Fitted leather, compact guards, supple soles, controlled loose fabric |
| INT | Magical ward | Cloth, woven structure, ritual working surfaces, exposed casting hands |
| STR/DEX | Protection plus mobility | Flexible scale, joint-conscious protection, reinforced working gear |
| STR/INT | Protection plus ward | Substantial ritual implements, padded vestments, guarded ritual equipment |
| DEX/INT | Evasion plus ward | Fine flexible cloth, light ritual gloves/cuffs, veils, precision ritual tools |
| U: shared | Basic utility | Cheap survival clothing, cord belts and selected work tools; no attribute floor |

The starter INT setup equips Ember Cup offhand with an empty main hand and no gloves for Burning Hand. The cup is not an auxiliary item. Later bare-palm compatibility is unresolved; do not silently invent gloves for the opening kit.

Preparation, Trophy and Relic are backpack-area expansions, not equippable packs. Warcall, Quiver/Quickrig and Attendant/Apparatus are equipment. The names do not authorize more slots or new mechanics.

## Parallel wearable branch examples

These are opening -> developed -> advanced examples, not five locked global tier rungs or proof of a universal historical sequence. “Advanced” here remains an ancient construction tier; exotic/endgame extensions are later work. Shape, fit and assembly change with rank; cloth never has to turn into bronze.

| Slot | STR | DEX | INT |
|---|---|---|---|
| Head, 2x2 | Rawhide Helm -> Bronze Cap -> Crested Bronze Helmet | Hide Cap -> Fitted Hide Cap -> Leather Scout Hood | Linen Hood -> Bound Hood -> Woven Headdress |
| Body | Rawhide Corselet 2x3 -> Bronze Scale Corselet 2x3 -> Bronze Plate Corselet 2x3 | Hide Vest 2x3 -> Fitted Hide Jerkin 2x3 -> Laced Leather Coat 2x3 | Linen Tunic 2x3 -> Pleated Tunic 2x3 -> Ritual Robe 2x4 |
| Hands, 2x2 | Work Mitts -> Quilted War Mitts; fork to Bronze Handguards | Hide Gloves -> Fitted Gloves; parallel Archer's Bracers -> Archer's Guards | Empty at start -> Wrist Wraps -> Woven Cuffs -> Inscribed Cuffs |
| Feet, 2x2 | Rawhide Shoes (hybrid entry) -> Padded Legguards -> Bronze Greaves | Leather Sandals -> Soft Leather Shoes -> Seamed Leather Shoes | Cloth Boots -> Soft Boots -> Pointed Buskins |
| Belt, 2x1 | Rawhide Girdle -> Layered Warbelt -> Plaque Belt | Hide Belt -> Fitted Leather Belt -> Braided Leather Belt | Linen Sash -> Woven Sash -> Patterned Sash |
| Overlayer | Shoulder Hide 2x3 -> Hide-Backed Mantle 2x3 -> Armoured Mantle 2x4 | Short Hide Cape 2x3 -> Close-Cut Cloak 2x3 -> Scout's Cloak 2x3 | Woven Veil 2x3 -> Ritual Shawl 2x3 -> Ritual Veil 2x3 |

Shared opening alternatives: Headwrap or Woven Cap, Footwraps or Fiber Sandals, Bast Shoes, and Jute Cord. Lapti can be the faction display name of Bast Shoes rather than a second statistically identical drop.

A bracer is not automatically DEX: a heavy bronze forearm shell can be STR, a string guard DEX, a wrist-only ritual cuff INT. Likewise a boot is not automatically INT. Fitted soft boots and restrained pointed buskins can establish that branch's visual identity, while fur boots and heavy legguards remain available to other branches.

Keep soft STR mitts viable as a continuing family. Metal handguards form a structural fork, not metal rectangles pasted onto textile mittens. Five-finger gauntlets are optional later work; avoid default medieval full-plate fingers and cuffs.

Greaves occupy the Feet slot as a complete game item: paired shin guards with plain underlying footwear. They are not simultaneously counted as body armour pieces in this draft. Source-image extraction needs to resolve that boundary before promotion, because older extraction rules can include visible greaves in a body assembly.

## Dimensions and equipment seats

### Base cell and pixel dimensions

Verdigris uses a **48x48 px logical base cell** at native display scale.
The baseline human character sprite frame is **48x96 px** (one cell wide,
two tall). This is an art/layout baseline, not a collision-box definition or
a requirement that every animation, weapon or effect fit inside that frame.

| Cells (width x height) | Native pixel rectangle | Examples |
|---|---|---|
| 1x1 | 48x48 | Ring, compact storage content |
| 1x2 | 48x96 | Baseline human sprite frame (not a weapon footprint) |
| 1x3 | 48x144 | Smallest weapon size; knives, daggers, wands |
| 1x4 | 48x192 | Narrow reach weapon |
| 2x1 | 96x48 | Belt |
| 2x2 | 96x96 | Amulet, Ember Cup, compact auxiliary item |
| 2x3 | 96x144 | Body armour, substantial one-hand weapon, auxiliary seat |
| 2x4 | 96x192 | Broad two-hand weapon, long robe |

These are complete logical rectangles: draw grid lines within the 48 px pitch;
do not add gutters to the footprint calculation. UI zoom scales the grid and
its contents together. High-resolution source art may be retained, but native
readability is judged at these dimensions. Existing adaptive runtime cell sizes
have not been migrated by this design update.

## Unlockable equipment seats

Every unlockable auxiliary equipment seat is **2x3 (96x144 px)**. Items for
Warcall, Quiver/Quickrig and Attendant/Apparatus use **2x2 or 2x3** in the
current catalogue. A 2x2 item keeps its square art inside the 2x3 seat; do not
stretch it or change its backpack footprint to fill the seat. No new seat,
subclass mechanic or tiny/oversized auxiliary exception is introduced here.

Preparation, Trophy and Relic expansions remain backpack storage areas, not
2x3 equipment items. Their contents retain their own inventory footprints.

## Canonical footprints

| Item family | Default | Allowed variants | Art canvas |
|---|---:|---:|---|
| One-hand knife, dagger, sword, axe, mace, club, throwing sidearm or sceptre | 1x3 | 2x3 for broad/heavy one-hand bases | portrait |
| Magical main-hand wand | 1x3 | - | portrait |
| Magical main-hand rod | 2x3 | - | portrait |
| Magical main-hand staff | 2x4 | - | tall portrait |
| Spear, polearm, greatclub, greataxe, other two-hand weapon | 2x4 | 1x4 for exceptionally narrow light reach weapons | tall portrait |
| Bow | 2x4 | 2x3 for a genuinely compact short or composite bow | tall portrait |
| Buckler, hand guard, compact defensive off-hand | 2x2 | 1x2 for a very narrow guard | square or portrait |
| Full shield | 2x3 | 2x4 for tower, standing or body-length shields | portrait |
| Held rite focus or substantial ritual implement | 1x3 | 2x2 for cups, bowls, drums or handled vessels; 2x3 for heavy one-hand sceptres or implements | portrait or square |
| Clay Ember Cup (offhand) | 2x2 | - | square |
| Body armour | 2x3 | 2x4 only for a visibly long integrated coat or robe assembly | portrait |
| Cloak or mantle | 2x3 | 2x4 for a full-length heavy outer layer | tall portrait |
| Helm, crown, mask | 2x2 | - | square |
| Gloves, mitts, bracers, vambraces | 2x2 | - | square; always show the pair |
| Boots, sandals, greaves | 2x2 | - | square; always show the pair |
| Belt, girdle, sash | 2x1 | - | landscape |
| Amulet, pendant, gorget, protective neck piece | 2x2 | - | square |
| Ring, loose compact seal | 1x1 | a seal worn as an amulet uses 2x2 | square |
| Substantial curio, coffer, vessel, relic | 1x1 | 2x2 when the object is visibly bulky | square |
| Standalone quiver, gorytos, arrow case | 2x3 | 2x2 only for a compact flank case | portrait |
| War-call instrument | 2x2 | 2x3 for a taller assembly | square or portrait |
| Auxiliary warbanner or standard | 2x3 | 2x2 for a compact assembly | portrait or square; complete object |
| Quick Rig, mobility kit, trap rig, Attendant / Apparatus | 2x2 | 2x3 | square or portrait |
| Spoil, prepared reagent, reliquary-pack content | 1x1 | 2x1 for a long bundle or roll | square or landscape |

## Ladder rules

- Footprint is a property of the named base, not its material.
- The smallest weapon footprint is 1x3. No weapon base may occupy 1x1 or
  1x2; compact knives, daggers and tool weapons use 1x3. No offhand base may
  occupy 1x1. Clay Ember Cup remains a 2x2 offhand.
- Magical main-hand families have explicit sizes: wands 1x3, rods 2x3,
  staves 2x4. Auxiliary items with similar names retain auxiliary sizing.
  Ordinary martial fighting sticks are not automatically magical staves.
- Handedness is independent of footprint: a heavy sword or sceptre may occupy
  2x3 while using one hand. Never infer two-handed use from grid width.
- The Amulet slot includes gorgets and protective neck pieces with STR
  requirements, as well as ordinary pendants. All use 2x2 for slot tiling.
- Adjacent rungs need a different readable silhouette or construction, not a
  recolour of the same object.
- Do not shrink a two-hand weapon to fit a one-hand footprint. Show the whole
  object and use the larger grid size.
- Amulets use the prescribed 2x2 footprint even when physically small. Do not
  invent bulk or ornament to fill it, or enlarge rings and small pack contents
  merely to make their icons more impressive.
- The canvas aspect follows the footprint: tall items use portrait art, belts
  and long rolls use landscape, and compact 1x1 or 2x2 items use square art.
- Runtime `w` and `h`, target-manifest metadata, QA canvas, composed art, and
  review labels must agree before a base is considered complete.

## Inventory art presentation

### Five things to specify separately

1. **Screen orientation:** which end is at the top, which side it leans toward.
2. **Visible face:** blade face, shield front, glove back, garment front, vessel opening.
3. **Camera elevation and turn:** enough to reveal thickness or an opening without hiding the identifying silhouette.
4. **Arrangement:** one object, a paired item, or one coherent attached assembly.
5. **Footprint and framing:** correct width:height, complete outline and controlled negative space.

Directions always mean the viewer's screen, not the wielder's left/right. “Upper-right” describes a location in the image; it never means “point toward the camera.”

Default: strong silhouette, restrained depth, stable family pose. A three-dimensional object can be front-readable. Do not request a dramatic perspective merely to prove that it has volume.

## Weapons: the default

> Present the complete weapon mostly upright. Place the grip or shaft butt in the lower-left region and the blade tip or head region in the upper-right. Use a small controlled lean to the viewer's right. Keep the weapon's length almost parallel to the image plane, so the entire shaft or blade reads at full length. Show the broad identifying face with just enough oblique turn to reveal thickness and hafting. Keep every tip, edge, grip and butt inside the frame with clear padding.

For a sword, “head region” is the tip and upper blade. For an axe or pick it is the head/haft junction and working head, not every extremity of the blade. For a sickle or khopesh, preserve the real curve: do not straighten or reverse a hooked tip to make every point aim upward.

**Screen-space lean targets, clockwise from vertical:**

| Footprint | Default target | Practical range | Reason |
|---|---:|---:|---|
| 1x3 knife, tool, wand or other narrow weapon | 8 degrees | 5–12 degrees | Narrow cell column constrains rotation |
| 1x4 narrow reach weapon | 5 degrees | 3–8 degrees | Preserve full shaft and usable head size |
| 2x3 broad one-hand weapon | 20 degrees | 15–25 degrees | Room for a broad blade/head and one-hand grip |
| 2x4 two-hand weapon | 12 degrees | 8–18 degrees | Keep a long full silhouette without shrinking the shaft |

These are working ranges, not automatic rejection thresholds. A wide axe head may need less tilt. Solve fit by reducing tilt or uniformly scaling the complete object; never compress its geometry or shorten its handle. Footprint does not determine handedness: a 2x3 sceptre remains one-handed.

For a straight line in a W-by-H rectangle, the corner diagonal is atan(W/H) from vertical: about 18 degrees for 1x3 and 34 degrees for 2x3. Actual weapons need head width and padding, so their usable lean is lower. “45-degree diagonal” is therefore a poor global instruction.

The smallest weapon canvas is now 1x3; the former 1x2 pose profile is removed. Magical main-hand rods use 2x3 and staves 2x4. Bows use 2x3 for short bases or 2x4 for larger bases; tower and standing shields may use 2x4. Preserve the complete silhouette and use the profile for its assigned footprint.

### Weapon-specific exceptions

- **Axes and picks:** working head high, handle low; favor a cutting edge projecting to screen-right. The broad blade or working point remains readable. Keep the back of the head and attachment visible where construction needs them. Never demand a second blade for balance.
- **Adzes and hoes:** use the same shaft direction but turn the head just enough to show its transverse working edge. Preserve edge orientation relative to the haft; camera changes must not convert an adze into an axe.
- **Maces, hammers, sceptres:** upper-right head mass, lower-left grip. Reveal one side plane of the head; keep the handle visibly connected. Do not enlarge the head while shrinking the grip.
- **Spears, staves, standards:** small tilt, full tip-to-butt framing. Shaft length is defined by the actual source/base, not one universal head-to-shaft ratio. Both ends of a double-ended staff stay visible.
- **Bows:** own profile. Top limb above, bottom limb below; bow's curved stave on screen-right, string on screen-left. Mild upright lean. Show both tips, one continuous string and the grip. No arrow, quiver, hands, extra string, bow twisted toward the lens or false extra limb.
- **Slings:** own flexible-object profile. Empty cradle centrally legible; two distinct cords gathered in a controlled compact arrangement with a finger loop and release end. Do not force a flexible sling into a rigid weapon diagonal. No ammunition, accessory bag or staff-sling conversion.
- **Bolas, nets and flexible kits:** recognizable complete assembly in a square/gathered footprint, cords under gravity and enough separation to count parts. No generic radial explosion of strings.
- **Disc/knuckle weapons if later admitted:** shape-led compact composition; do not invent a grip or blade axis. These rules do not reopen retired families.

## Non-weapon families

| Family | Consistent screen pose | Camera / visible face | Arrangement and critical exclusions |
|---|---|---|---|
| Body armour, tunics, robes | Neck top, hem bottom; upright, 0–5 degrees roll | Front is dominant; shallow oblique turn reveals one side seam and opening thickness | One complete garment/shell. No mannequin, neck stump, arms, legs or extra slot gear. Neck/arm openings remain readable; no diagonal tossed garment |
| Cloaks, mantles, scarves, veils | Shoulder/neck area top, cloth falls down | Front-readable open drape; slight depth in broad folds | No invisible-body sleeves or ballooning. Keep complete shoulder construction and hem; no windblown horizontal cape or shingled tabs. Scarves get a controlled full drape, not a tiny knot |
| Helmets, caps, hoods | Crown up, neck opening down; no diagonal roll | Shallow front three-quarter, face opening turned slightly toward screen-left; crown/rear shell still evident | One full helmet. Do not rotate so far the face disappears, or turn it into a front mask with no back. Masks may be frontal when that preserves their identity |
| Gloves, mitts, gauntlets | Cuffs upper-right, fingertips lower-left | Backs/knuckles dominate; palms may appear on the rear piece only if needed | Exactly one left/right pair, near item lower-left and mate slightly upper-right. Both cuffs and distal ends readable. No hands, duplicated same-hand glove, crossed starburst pose or merged fingers |
| Bracers, wrist cuffs | Proximal/elbow opening upper-right; wrist opening lower-left | Outer protective surface plus opening/rim thickness | Exactly two complementary pieces with a small stagger. No invented gloves, palms, hands or enclosed ends. Exposure rules for casting remain visible |
| Shoes, sandals, boots | Tops/ankles above; toes project lower-right | Slightly elevated oblique view showing uppers and some sole edge | Exactly one left/right pair, near shoe lower-left and mate upper-right. Both toes and heel/ankle identities readable. No two identical feet, crossed toes or soles dominating |
| Greaves with footwear | Shin length upright; toes lower-right | Protective front/outer face plus footwear | Full pair; include the base's plain footwear. Do not twist shin guards separately or add knees/legs to support them |
| Shields and defensive offhands | Top up, bottom down; 0–8 degrees roll | Front fighting face dominates with narrow visible rim thickness | No rear-face default, front straps, clamshell opening or shield-on-ground pose. Deliberately near-frontal is valid |
| Belts, cords, sashes | Horizontal, 0–5 degrees roll; shallow arc | Front band/tie visible; a little top edge can show depth | Full credible fastening, short restrained ends. No tall standing loop, dangling pouches, skirt panels or tails consuming the 2x1 space |
| Pendant amulets | Neck loop above, pendant below, upright center | Pendant front with slight material thickness | Full wearable loop OR a deliberately cordless complete pendant; never arbitrarily cropped chain ends. All occupy 2x2 |
| Gorgets, collars, pectorals | Neck opening above; protective/ornamental front below | Front three-quarter with enough elevated view to reveal a real neck opening | Full rear/side continuity and credible opening. No invisible torso, chest armour attachment or simple flat crescent pretending to encircle a neck. All occupy 2x2 |
| Rings | Stable upright oval opening; bezel at top if present | Shallow oblique view shows opening, band thickness and stone/seal surface | One ring, no duplicate display angles, no charms or cropped band. Do not turn edge-on into a line |
| Cups, bowls, Ember Cup | Rim up, base down; zero spill-inducing roll | Slightly above the rim: readable ellipse, inner wall and contents, plus substantial outer wall | Entire base visible. Cup upright, ember inside. No top-down disc, floating flame/orb, spilled contents, hand or goblet stem |
| Jars, vessels, coffers, relic boxes | Lid/mouth above, base below; level | Clear front/side and modest top plane | One complete stable container. Closed by default unless the brief requires open contents. No floating detached lid, exploded display or unasked accessory spread |
| Quivers, arrow cases | Mouth above, closed bottom below; upright or slight right lean | Show mouth/closure and long container wall; one side reveals depth | Standalone empty/capped case. No arrows, bow or crossed shaft; straps lie against the case. Quiver top need not follow weapon-tip lean |
| Quickrigs, apparatus frames | Worn top above, lower frame below | Outward functional face dominant; shallow turn reveals harness attachment/load path | One complete wearable assembly with secured contents, no wearer. No loose toolkit flat lay, handheld bag or unrelated extra items |
| Warcall horns | Mouthpiece low-left, bell high-right when natural curvature permits | Enough into the bell to establish hollowness; full side curve visible | One continuous instrument; do not straighten its curve, turn it into a drinking horn or add a stand |
| Drums, rattles, bells | Main sounding body upright | Membrane/body/opening chosen for family recognition | Only structurally attached or explicitly required components. No floating beater, extra hand or accessory pile |
| Banners and standards | Full pole upright with slight right lean | Head/cloth face readable | Full finial-to-butt; attached cloth hangs in a controlled field. No cropped pole or unsupported wind effects |
| Attendants | Stable central composition; recognizable vessel/effigy remains upright | Show the dominant construction clearly | Magical suspension is allowed, but use a repeatable rest pose. No random radial debris cloud, giant bloom hiding the object or five indistinguishable spheres |
| Trophy and preparation contents | Natural stable arrangement; long bundles horizontal if 2x1 | Expose identifying species/material/tool surface | One coherent object or specified bundle. No invisible stands, decorative mounts, gore, ingredient spill or generic glowing currency orb |

The shared arrangement is a continuity choice, not proof every photographed reference uses it. Do not bend real anatomy, curves, joins or left/right construction to meet a pose. An exceptional base can register a named profile exception before generation.

## Framing, light and scale

- Fit the footprint's actual aspect ratio. A 2x3 one-hand sword gets 2:3 art; a narrow 1x3 blade needs a 1:3 composition. If the generator offers only a broader canvas, reserve a narrow centered composition and letterbox/crop empty background during composition; never stretch the subject.
- Target approximately 86–92% of the available long dimension, leaving visible padding at every extreme. These are proposed framing targets, not measured PoE occupancy statistics. Broad silhouettes may need more air.
- Optical centering matters more than equal empty area: balance the whole weapon, not only the blade head. Thin weapons do not need to fill the short dimension.
- For pairs, start with roughly 10–20% silhouette overlap or a small gap, enough stagger to distinguish both pieces. Do not hide a whole mate. Soft straps sag or rest against the item; do not retain an invisible limb.
- Use one consistent upper-left key and restrained opposing edge separation, neutral material color, local form shadow and no baked ground/drop shadow. These continue the game's chosen lighting direction; the sampled legacy assets do not prove a single universal lighting rig.
- Transparent background or the existing controlled matte path. No ground plane, caption, grid or composition guide inside final art.
- Review at the native **48x48 px base cell**: a 1x3 knife or wand is 48x144 px, a 2x2 amulet or Ember Cup is 96x96 px, and 2x3 armour is 96x144 px. All auxiliary equipment seats are 96x144 px; their current items are 96x96 or 96x144 px. Keep square items square inside the taller seat. Existing adaptive runtime sizes and the earlier 54/36 px research sheet describe the prior UI, not this new target; runtime migration is still pending.
- The baseline human sprite frame is 48x96 px. This common unit does not make an inventory icon a literal world-scale depiction or define character collision bounds. Retain high-resolution masters and judge the downscaled art at native size. A ring at 1x1 and a gorget at 2x2 must not be compared at identical enlarged image size.
- Judge object identity, orientation, whole-object readability and pair completeness at game scale; inspect joins, holes and anatomy mistakes enlarged. Neither check replaces the other.

## Final visual check

Reject or hold: wrong directional family; weapon tip down; high foreshortening; shortened shaft; broad blade edge-on; cut-off extremity; missing or fused mate; glove/boot swapped anatomy; unsupported loose fabric; shield rear face; sealed vessel pretending to be an open cup; floating contents; cross-slot accessories.

Minor roll/centering drift in otherwise good accepted art is a normalization candidate, not automatic regeneration. A screen-plane rotation may be fixable without another model call. Do not horizontally mirror whole rendered assets just to match direction: that reverses lighting, anatomical sides, symbols and construction. Rotation also moves baked illumination, so recheck the light direction. Do not auto-fail on a principal-component angle: an axe head, a curved blade or a pair can skew the silhouette axis away from the true shaft/part axes.

Check each asset at its native 48 px cell footprint as well as enlarged. A polished blade pointing down fails the orientation rule. A well-lit sheet does not establish correct individual crop sizes. Do not claim alpha transparency from appearance alone; inspect the file.

## Selectable catalogue — 204 draft candidates and proposals

These entries may be selected for source review and an explicit render request; none is automatically production-approved. Each row includes its own pose reminder so copying the row does not lose the direction. Apply the fuller family profile above as well. Size and pixels describe the item, not its equipment seat. Named-base construction takes precedence over generic embellishment.

### Original catalogue candidates

| ID | Base | Attribute | Slot | Cells | Native px | Status / tier | Pose reminder | Construction and clarification |
|---|---|---|---|---|---|---|---|---|
| W01 | Flint Knife | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Compact knapped flint blade, short plain grip, one cutting edge and credible haft binding. |
| W02 | Obsidian Knife | DEX/INT | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Compact dark volcanic-glass cutting blade in a plain grip; natural flake scars, no glowing crystal. DEX/INT only if this base has a ritual-cutting implicit; obsidian alone does not justify INT. |
| W03 | Bone Knife | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Sharpened bone blade with integral grip; no assembled jaw or shell components. |
| W05 | Copper Knife | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Short hammered copper cutting blade with a fitted plain grip. |
| W06 | Tanged Dagger | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Short dagger blade with tang seated inside a separate fitted grip; grip remains visible. |
| W07 | Riveted Dagger | STR/DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Short dagger with two grip slabs visibly secured by a few structural rivets. |
| W08 | Leaf Dagger | STR/DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Short broad leaf-shaped blade; edge expands below the point, simple fitted grip. |
| W09 | Midrib Dagger | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Long narrow dagger with one structural raised midrib running along the blade. |
| W10 | Bronze Shortsword | STR/DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Short broad bronze sword with a plain usable grip and modest guard shoulders. |
| W11 | Leaf Sword | STR/DEX | weapon | 2x3 | 96x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One-hand bronze sword with broad leaf-shaped blade and a readable narrowing near the grip.  Broad substantial one-handed base, 2x3; footprint does not make it two-handed. Handedness: one-handed. |
| W12 | Narrow Bronze Sword | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Long narrow bronze thrusting blade with a simple grip and no developed crossguard. Long narrow bronze thrusting blade with simple grip; no cup guard or swept hilt. |
| W13 | Flange-Hilt Sword | STR/DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Bronze sword whose grip has raised side flanges retaining organic grip inserts. Flanges enclose the grip edges; no spikes projecting from the blade. |
| W14 | Grip-Tongue Sword | STR/DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Bronze sword with a broad grip tongue carrying fitted grip slabs. Broad tang supports grip slabs; no literal tongue ornament. |
| W15 | Sickle Sword | STR/DEX | weapon | 2x3 | 96x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One-hand forward-curved bronze sickle-sword with a clear inner curve and usable grip.  Broad substantial one-handed base, 2x3; footprint does not make it two-handed. Handedness: one-handed. |
| W16 | Stone Axe | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Ground stone axe head lashed to a medium wooden haft; blade edge aligned with the haft. |
| W17 | Grooved Axe | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Stone axe head with a carved securing groove and functional haft lashing. |
| W18 | Flat Axe | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Compact flat copper axe head seated and bound onto a short wooden haft. |
| W19 | Flanged Axe | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Copper-alloy axe head with side flanges securing its wooden haft. |
| W20 | Stop-Ridge Axe | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Axe head with side flanges and a transverse seating stop at the haft junction. Stop-ridge controls head seating on the haft; not a protruding axe spike. |
| W21 | Socketed Axe | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Hollow-socket axe head receiving the bent end of a wooden haft. |
| W22 | War Adze | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Short hafted adze with the working cutting edge transverse to the handle. Short one-hand working geometry here; cutting edge across the haft. A long war-adze is a separate 2x4 base. |
| W23 | Crescent Axe | STR/DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One-hand axe with one broad crescent blade; no double crescent or moon ornament. |
| W24 | Cudgel | U | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One solid short hardwood cudgel with a thick impact end and a narrower natural grip. Shared starter: no attribute requirement. |
| W25 | Root Club | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One solid wood club retaining a broad root-derived impact head; no antler cluster. |
| W26 | Stone-Head Club | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Compact stone striking head securely lashed to a wooden handle. |
| W27 | Disc Mace | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Thick disc-shaped stone mace head pierced for a fitted shaft; no wheel spokes. |
| W28 | Pear-Head Mace | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Smooth pear-shaped stone mace head on a fitted wooden shaft. |
| W29 | Stone Maul | STR | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Heavy broad stone hammer head on a visibly long two-hand wooden handle. |
| W30 | Bronze Mace | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Compact cast bronze striking head firmly seated on a plain wooden handle. |
| W31 | Hunting Spear | DEX | weapon | 1x4 | 48x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Exceptionally narrow full-length wooden hunting spear with a sharpened point. |
| W32 | Flint Spear | STR/DEX | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Long wooden spear with a distinct knapped flint point and credible binding. |
| W33 | Bone Spear | DEX | weapon | 1x4 | 48x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Slender long wooden spear with a narrow fitted bone point. |
| W34 | Tanged Spear | STR/DEX | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Long spear with metal tang inserted and secured into the shaft end. |
| W35 | Socketed Spear | STR/DEX | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Long spear whose metal head has a closed socket receiving the wooden shaft. |
| W36 | Leaf Spear | STR/DEX | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Broad leaf-shaped spearhead with simple socket and a long complete shaft. |
| W37 | Dagger-Axe | STR/DEX | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Long wooden shaft with one bronze dagger blade projecting sideways near its top. One transverse dagger-like blade near the top of a long shaft; no medieval halberd axe-hook-spike head. |
| W38 | Self Bow | DEX | weapon | 2x4 | 96x192 | candidate | Bow upright; stave right, string left | Medium-length bow made from one continuous wooden stave, complete string and both tips. |
| W39 | Short Bow | DEX | weapon | 2x3 | 96x144 | candidate | Bow upright; stave right, string left | Compact bow with short limbs, a clear central grip and complete string. |
| W40 | Long Self Bow | STR/DEX | weapon | 2x4 | 96x192 | candidate | Bow upright; stave right, string left | Tall shaft-dominant self bow with long simple limbs and complete string. |
| W41 | Backed Bow | DEX | weapon | 2x4 | 96x192 | candidate | Bow upright; stave right, string left | Wooden bow with a structurally continuous sinew backing and complete string. |
| W42 | Composite Bow | DEX | weapon | 2x3 | 96x144 | candidate | Bow upright; stave right, string left | Compact composite bow with distinct recurved limbs, complete string and coherent horn/wood/sinew construction. |
| W43 | Sling | DEX | weapon | 1x3 | 48x144 | candidate | Cradle readable; two cords gathered vertically | One empty hand-sling cradle and two cords; one finger loop, one release knot. Empty sling only: one cradle and two cords; no ammunition or pouch accessory. |
| W44 | Javelin | DEX | weapon | 1x4 | 48x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One narrow full-length light throwing spear with compact head and simple shaft. |
| W45 | War Dart | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One substantial throwing dart with a short shaft and compact weighted point. |
| W47 | Harpoon | STR/DEX | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Long barbed harpoon with one working head and a complete two-hand shaft. |
| W48 | Throwing Stick | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One flattened or gently curved solid wooden throwing stick; no second weapon. |
| W49 | Bola | DEX | weapon | 2x2 | 96x96 | candidate | Complete weights and cords; controlled gathered pose | One complete bola with secured weights joined by cord, gathered within a square silhouette. Proposed 2x2 coiled footprint; define launcher/return behavior before runtime. |
| W50 | Throwing Club | STR/DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One short solid throwing club with a compact weighted impact end. |
| W51 | Short Staff | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One straight short wooden striking staff with both ends visible. |
| W52 | Long Staff | STR/DEX | weapon | 1x4 | 48x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One full-length slender two-hand wooden staff with simple grip zone. |
| W53 | Forked Staff | INT | weapon | 2x4 | 96x192 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One complete slender fork-headed channeling staff; one deliberate fork, no branch clutter. INT only for a channeling forked staff; ordinary branch shape alone grants no magic. |
| W54 | Sickle | DEX | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One compact harvest sickle with curved working blade and short usable grip. |
| W55 | Stone Pick | STR | weapon | 1x3 | 48x144 | candidate | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One compact one-hand stone pick with firmly hafted tapered point and readable grip. |
| O01 | Hide Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Broad flexible hide shield stretched over a credible supporting frame. |
| O02 | Rawhide Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Broad stiff rawhide shield with a continuous defensive face and bound edge. |
| O04 | Reed Shield | STR/DEX | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Broad dense reed shield with credible load-bearing binding; no open basket silhouette. Candidate needs a convincing complete defensive construction and distinct silhouette. |
| O05 | Bark Shield | STR/DEX | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Broad continuous bark shield slab with reinforced structural edges. |
| O06 | Plank Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Broad shield made from joined wooden boards with a continuous defensive face. |
| O07 | Hand Shield | DEX | offhand | 2x2 | 96x96 | candidate | Upright; fighting face forward | Compact hand shield with a small round defensive face. |
| O08 | Round Shield | STR/DEX | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Medium round shield with plain face and bound rim. |
| O09 | Oval Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Elongated oval shield with a continuous defensive face and plain rim. |
| O10 | Tall Shield | STR | offhand | 2x4 | 96x192 | candidate | Upright; fighting face forward | Tall body-length shield with broad continuous defensive coverage. |
| O11 | Notched Shield | STR/DEX | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Medium shield with deliberate waist cutaways and substantial remaining edge structure. |
| O12 | Figure-Eight Shield | STR | offhand | 2x4 | 96x192 | candidate | Upright; fighting face forward | Large shield with two joined broad rounded lobes and a narrow central waist. |
| O13 | Bossed Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Broad shield with one structural center boss protecting the gripping hand behind it. Single structural boss; no sunburst, spokes or radiating emblem. |
| O14 | Ribbed Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Broad shield with sparse structural raised ribs, subject to the no-solar-motif rule. Historical rib vocabulary requires motif review; avoid sun-like concentric decoration. |
| O15 | Bronze-Faced Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Shield with a thin bronze facing visibly supported by a thicker organic body. |
| O16 | Sheet-Bronze Shield | STR | offhand | 2x3 | 96x144 | candidate | Upright; fighting face forward | Shield formed predominantly from continuous beaten bronze sheet with a turned rim. |
| O17 | Torch | U | offhand | 1x3 | 48x144 | candidate | Combustible head UP-RIGHT; handle DOWN-LEFT | One complete short resin torch with a bound combustible head and plain handle. |
| O18 | Hunting Net | DEX | offhand | 2x2 | 96x96 | candidate | Complete gathered net; weights and joins readable | One compact gathered weighted net, hand-held in use; no wearable storage harness. |
| O19 | Quiver | DEX | quiver | 2x3 | 96x144 | candidate | Mouth above, closed bottom below; empty case | One complete long wearable arrow case with a closed bottom and open top; no hand grip. Move from offhand to the Quiver equipment family; no additional seat is introduced. |
| O20 | Dart Case | DEX | quickrig | 2x2 | 96x96 | candidate | Worn top above; functional face and harness readable | One compact wearable dart case with secured narrow channels and visible closure. Wearable dart case in the DEX auxiliary family; no separate projectile-case seat. Do not duplicate Dart Rig. |
| O21 | Offering Bowl | INT | offhand | 2x2 | 96x96 | candidate | Rim level and up; interior visible; base below | One broad shallow offering bowl with a solid base, thick rim and substantial volume. Broad substantial offering bowl, distinct from the starter cup. |
| O24 | Scrying Mirror | INT | offhand | 2x2 | 96x96 | candidate | Mirror face visible; upright, handle below | One backed round mirror with a short integral handle and clear reflecting face. |
| O26 | Clay Ember Cup | INT | offhand | 2x2 | 96x96 | candidate | Rim level and up; interior visible; base below | One small open fired-clay cup with thick walls, modest base and a single dark amadou ember glowing faintly at its edge. Rename Clay Ember Cup: simple fired-clay cup with one smouldering amadou ember; offhand. Bare main hand required for Burning Hand, not automatically for every skill. Owner-confirmed 2x2 footprint; no 1x1 weapon or offhand bases. |
| A01 | Headwrap | U | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One simply wound cloth headwrap with a complete crown and restrained folds. |
| A02 | Woven Cap | U | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One plain woven-fiber cap with continuous crown, edge binding and no metal decoration. |
| A03 | Hide Cap | DEX | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One fitted soft-hide cap with simple stitched seams and a complete back. |
| A04 | Fur Cap | STR | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One compact fur cap with complete crown and a narrow visible lining edge. |
| A05 | Rawhide Helm | STR | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One stiff rawhide helmet shell with functional seams and full rear coverage. |
| A06 | Tusk-Plate Helmet | STR/DEX | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One close-fitting leather-backed cap covered by rows of small curved tusk plates, sewn through drilled holes; both cheek guards structurally present. Rename Tusk-Plate Helmet: close-fitting cap with many small curved tusk plates sewn in rows; no whole tusks sticking out. |
| A07 | Bronze Cap | STR | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One low domed bronze skullcap with a complete rear dome and a restrained lining edge. |
| A08 | Crested Bronze Helmet | STR | head | 2x2 | 96x96 | candidate | Crown up; shallow front-left view; full back | One bronze helmet with a single lengthwise structural crest and complete dome. |
| A09 | Linen Tunic | INT | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One short linen tunic with distinct neck and arm openings, simple seams and hem. |
| A10 | Wool Tunic | STR/INT | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One thick wool tunic with broad continuous cloth surfaces and a clear short hem. |
| A11 | Hide Vest | DEX | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One fitted soft-hide sleeveless vest with neck/arm openings and functional seams. |
| A12 | Layered-Hide Corselet | STR/DEX | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One flexible torso corselet assembled from broad overlapping hide sections. |
| A13 | Rawhide Corselet | STR | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One stiff rawhide torso shell with coherent side joins, neck opening and arm openings. |
| A14 | Leather Scale Vest | STR/DEX | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One flexible vest of small leather scales attached to a continuous backing. |
| A15 | Bronze Scale Corselet | STR | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One torso corselet of bronze scales sewn in overlapping courses to a concealed backing. |
| A16 | Bronze Plate Corselet | STR | body | 2x3 | 96x144 | candidate | Neck above, hem below; front readable | One torso-only bronze plate corselet with broad shaped front/back panels and credible side joins. |
| A17 | Hand Wraps | U | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of simple cloth hand wraps covering palms; loose ends lie naturally without invisible hands. Covers palms: blocks the proposed starter Burning Hand condition. |
| A18 | Hide Gloves | DEX | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of fitted soft-hide gloves with five finger sleeves per glove and plain cuffs. |
| A19 | Fur Mitts | STR | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of continuous soft fur mitts with one thumb each and reinforced hide palms; no hard plaques. |
| A20 | Wrist Wraps | INT | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of narrow wristcloth wraps that stop before the palm, thumb web and fingers. Wrist-only pair; no fabric crossing palms, thumb webs or fingers. |
| A21 | Archer's Bracers | DEX | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A paired game set: one forearm string guard and one simpler corresponding cuff; both leave hands bare. Display Archer's Bracers: paired equipment for this game; bow-side string guard and a simpler matching opposite cuff. |
| A22 | Rawhide Bracers | DEX | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of shaped rawhide forearm guards with broad ties and no hand coverage. |
| A23 | Bone-Splint Bracers | STR/DEX | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of forearm guards with short bone splints lashed to credible flexible backing. Game construction proposal; requires credible backing and joins, not decorative bone spikes. |
| A24 | Bronze Armguards | STR | hands | 2x2 | 96x96 | candidate | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of bronze forearm shells with a corresponding opposite side and narrow functional lining. Forearm-only bronze shells, palms exposed; protection is STR even though the object is a bracer. |
| A25 | Footwraps | U | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of cloth footwraps gathered naturally without rigid invisible-foot supports. |
| A26 | Fiber Sandals | U | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of woven fiber sandals with soles and relaxed functional straps. |
| A27 | Leather Sandals | DEX | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of leather sandals with continuous soles and simple relaxed straps. |
| A28 | Rawhide Shoes | STR/DEX | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of rawhide shoes folded around the foot shape and joined with plain lacing. |
| A29 | Soft Boots | INT | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of fitted soft boots with short shafts and modest tapered toes. Proposed INT fitted soft boot with restrained tapered toe; not every boot is INT. |
| A30 | Fur Boots | STR/INT | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of fur-lined boots with sturdy soft soles and broad continuous shafts. |
| A31 | Hide Gaiters | STR/DEX | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of hide calf gaiters accompanied by plain fitted shoes as one footwear set. Complete footwear item with paired gaiters and plain underlying shoes; no invisible legs. |
| A32 | Bronze Greaves | STR | feet | 2x2 | 96x96 | candidate | Pair; ankles above, toes lower-right; no legs | A pair of shaped bronze shin shells accompanied by plain sandals as one footwear set. Paired greaves with plain underlying sandals; no sabatons or medieval articulated knee armor. |
| A33 | Jute Cord | U | belt | 2x1 | 96x48 | candidate | Horizontal shallow arc; full fastening | One shallow horizontal length of jute cord with two real ends and one simple tie. Rename Jute Cord; one simple waist-length cord and a credible tie. |
| A34 | Woven Sash | INT | belt | 2x1 | 96x48 | candidate | Horizontal shallow arc; full fastening | One broad woven sash laid in a shallow horizontal arc with a cloth tie and no dangling tails. |
| A35 | Hide Belt | DEX | belt | 2x1 | 96x48 | candidate | Horizontal shallow arc; full fastening | One plain hide waist band with a credible opening and simple fastening. |
| A36 | Beaded Belt | DEX/INT | belt | 2x1 | 96x48 | candidate | Horizontal shallow arc; full fastening | One flexible waist band with a small bounded integrated bead field. Small bounded integrated beadwork; no dangling strand curtain. |
| A37 | Shell Belt | DEX/INT | belt | 2x1 | 96x48 | candidate | Horizontal shallow arc; full fastening | One flexible waist band with sparse functional shell attachments; no strand curtain. Shell knife exclusion does not ban shell in other legitimate constructions; review ornament budget. |
| A38 | Plaque Belt | STR | belt | 2x1 | 96x48 | candidate | Horizontal shallow arc; full fastening | One broad flexible waist band bearing functional close-set protective plaques. Broad belt supported by a flexible backing with functional plates, no hanging tassets. |
| A39 | Ring-Fastened Belt | STR/DEX | belt | 2x1 | 96x48 | candidate | Horizontal shallow arc; full fastening | One shallow waist band secured by one simple structural ring closure. |
| A41 | Shoulder Hide | STR | overlayer | 2x3 | 96x144 | candidate | Shoulders above; full drape falls down | One broad shoulder hide draped as a continuous overlayer, no head or paws. |
| A42 | Fur Mantle | STR | overlayer | 2x3 | 96x144 | candidate | Shoulders above; full drape falls down | One thick continuous fur mantle with a broad shoulder silhouette and simple closure. |
| A43 | Wool Cloak | STR/INT | overlayer | 2x3 | 96x144 | candidate | Shoulders above; full drape falls down | One broad wool cloak with clear continuous fabric fields and restrained folds. |
| A44 | Linen Mantle | INT | overlayer | 2x3 | 96x144 | candidate | Shoulders above; full drape falls down | One broad light linen shoulder mantle with continuous cloth and a plain hem. |
| A45 | Grass Cape | DEX | overlayer | 2x3 | 96x144 | candidate | Shoulders above; full drape falls down | One broad rain cape of coherent plant-fiber panels; no rows of tiny shingled tabs. Broad rain-shedding panels; no shingled shoulder tabs. |
| A47 | Dust Scarf | DEX/INT | overlayer | 2x3 | 96x144 | candidate | Shoulders above; full drape falls down | One continuous long dust scarf arranged as an overlayer with broad folds, not torn strips. 2x3 follows existing overlayer standard; a future smaller scarf footprint would be an explicit rule change. |
| A48 | Ritual Shawl | INT | overlayer | 2x3 | 96x144 | candidate | Shoulders above; full drape falls down | One broad ritual shawl with a bounded woven border and predominantly plain cloth. |
| S01 | Conduit Rod | INT | int-auxiliary | 2x2 | 96x96 | candidate | Stable upright construction; controlled suspension | One compact hands-free conduit assembly with a clear central rod and self-supporting magical suspension. Hands-free conduit assembly, visibly distinct from a held staff. |
| S02 | Ritual Orb | INT | int-auxiliary | 2x2 | 96x96 | candidate | Stable upright construction; controlled suspension | One hands-free spherical focus with a readable outer shell and restrained orbital motion. Hands-free orbiting vessel; do not make all INT auxiliary bases into spheres. |
| S03 | Attendant Effigy | INT | int-auxiliary | 2x2 | 96x96 | candidate | Stable upright construction; controlled suspension | One compact hands-free effigy with a substantial body and coherent magical suspension. Hands-free magical effigy; no generic toy idol. |
| S04 | Ritual Brazier | INT | int-auxiliary | 2x2 | 96x96 | candidate | Stable upright construction; controlled suspension | One compact hands-free brazier vessel with a contained ember bed and clear bowl walls. Compact magically suspended fire vessel. |
| S05 | Resonator | INT | int-auxiliary | 2x2 | 96x96 | candidate | Stable upright construction; controlled suspension | One compact hands-free hollow sounding vessel with a readable acoustic opening. Hands-free acoustic vessel; speculative magical apparatus, not historical terminology. |
| S11 | War Horn | STR | warcall | 2x2 | 96x96 | candidate | Mouthpiece lower-left; sounding end upper-right; preserve curve | One complete curved animal-horn signaling instrument with a hollow bell and worked mouth end. |
| S12 | Shell Trumpet | STR | warcall | 2x2 | 96x96 | candidate | Mouthpiece lower-left; sounding end upper-right; preserve curve | One complete conch-shell trumpet with a worked mouth opening; no knife edge. |
| S13 | Bone Whistle | STR | warcall | 2x2 | 96x96 | candidate | Mouthpiece lower-left; sounding end upper-right; preserve curve | One compact bone signaling whistle with a clear mouth opening and plain body. Shared auxiliary item footprint; preserve the plain compact instrument without inventing bulk or decoration. |
| S14 | Frame Drum | STR | warcall | 2x2 | 96x96 | candidate | Sounding face readable; stable upright frame | One complete frame drum with a continuous stretched hide face and substantial wooden rim. |
| S15 | War Standard | STR | warcall | 2x3 | 96x144 | candidate | Full pole upright; slight right lean; finial above | One full-length standard pole with one compact supported emblem or cloth field. Shared auxiliary item footprint; show the complete pole without cropping, shortening or stretching it. |
| S21 | Hooked Line | DEX | quickrig | 2x2 | 96x96 | candidate | Worn top above; functional face and harness readable | One complete wearable carrier securing a coiled line and a simple functional hook. Complete wearable low-snag line carrier; no industrial carabiners, climbing harness or handheld handbag. |
| S22 | Snare Kit | DEX | quickrig | 2x2 | 96x96 | candidate | Worn top above; functional face and harness readable | One complete wearable carrier securing a bounded set of snare loops and triggers. Wearable complete snare assembly with secured components; not a loose spare reagent. |
| S23 | Net Rig | DEX | quickrig | 2x2 | 96x96 | candidate | Worn top above; functional face and harness readable | One complete wearable rig securing a readied net; retain the load-bearing harness. Wearable readied net assembly; do not duplicate the hand-held Hunting Net. |
| S24 | Deadfall Kit | DEX | quickrig | 2x2 | 96x96 | candidate | Worn top above; functional face and harness readable | One complete wearable compact carrier for deadfall triggers and stakes, not the fallen weight. Wearable compact trigger kit; never an entire tree-sized deadfall in a 2x2 icon. |
| S25 | Dart Rig | DEX | quickrig | 2x2 | 96x96 | candidate | Worn top above; functional face and harness readable | One complete wearable dart rack with a coherent backing and shoulder/flank attachment. Wearable readied dart rig, distinguished from the simple O20 dart case. |
| J01 | Bone Ring | U | ring | 1x1 | 48x48 | candidate | Opening visible; bezel above if present | One plain closed bone finger ring with a visible circular opening. |
| J02 | Shell Ring | U | ring | 1x1 | 48x48 | candidate | Opening visible; bezel above if present | One plain carved shell finger ring with a visible opening and no dangling ornament. |
| J04 | Seal Ring | U | ring | 1x1 | 48x48 | candidate | Opening visible; bezel above if present | One compact finger ring with an integrated flat seal bezel, no dangling pendant. |
| J05 | Tooth Pendant | U | amulet | 2x2 | 96x96 | candidate | Upright; neck loop/opening above, front below | One dry tooth suspended from a complete simple neck cord; no metal trophy mounting. |
| J06 | Stone Pendant | U | amulet | 2x2 | 96x96 | candidate | Upright; neck loop/opening above, front below | One compact pierced stone pendant on a complete simple neck cord. |
| J07 | Seal Amulet | U | amulet | 2x2 | 96x96 | candidate | Upright; neck loop/opening above, front below | One compact seal pendant on a complete simple neck cord, restrained face detail. |
| J08 | Pectoral | U | amulet | 2x2 | 96x96 | candidate | Upright; neck loop/opening above, front below | One broad neck-suspended pectoral with a complete wearable neck attachment and a clear chest-facing plate; separate from torso armour. Amulet slot accepts broad neck pieces at 2x2. This decorative pectoral remains U; protective neck armour uses STR bases. |

### Additional proposals

| ID | Base | Attribute | Slot | Cells | Native px | Status / tier | Pose reminder | Construction and clarification |
|---|---|---|---|---|---|---|---|---|
| N01 | Skinning Knife | DEX | weapon | 1x3 | 48x144 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Short narrow flint blade with a modest belly, rounded back and a fitted grip; no shell. Fast precise knife |
| N02 | Flint Scraper | U | weapon | 1x3 | 48x144 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Broad compact knapped scraping blade seated in a substantial wrapped grip; no detached flake scatter. Broad cutting tool |
| N03 | Harvest Sickle | DEX | weapon | 1x3 | 48x144 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Curved wooden handle carrying a short continuous row of flint teeth along the inside working edge. Hooking cutter; T1 branch of Sickle |
| N04 | Carving Adze | STR | weapon | 1x3 | 48x144 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Small polished stone cutting head bound across a short wooden haft, edge transverse to the handle. Compact cleaving tool |
| N05 | Hafted Stone Hammer | STR | weapon | 1x3 | 48x144 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Squat stone striking head securely bound to a medium wooden handle, no spike or medieval hammer beak. Stagger tool |
| N06 | Digging Stick | U | weapon | 1x4 | 48x192 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One long stout wooden shaft with a shaped digging point and plain two-hand grip area. Shared reach starter |
| N07 | Antler Pick | STR | weapon | 1x3 | 48x144 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | A robust antler section retains one working tine and a broad graspable beam; remaining tines removed. One-hand puncturing tool |
| N08 | Field Mattock | STR | weapon | 2x4 | 96x192 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One broad groundstone digging head firmly attached across a long two-hand haft. Heavy sweeping tool |
| N09 | Woodcutter's Axe | STR | weapon | 2x4 | 96x192 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One heavy groundstone cutting head on a long two-hand wooden haft; clear edge and full butt. Heavy cutting tool |
| N10 | Fishing Spear | DEX | weapon | 1x4 | 48x192 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One slender full-length wooden shaft ending in a compact two-prong fish-catching head. Precise reach tool |
| N11 | Butchering Blade | STR/DEX | weapon | 1x3 | 48x144 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Broad short knapped flint blade with a sturdy plain grip and a single continuous working edge. Heavier short cutter |
| N12 | Copper Chisel | DEX | weapon | 1x3 | 48x144 | proposal / T2 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One short thick copper chisel with a sharpened flat working end and a substantial wrapped grip zone. Close thrusting tool; assess animation before launch |
| N13 | Copper Pick | STR | weapon | 1x3 | 48x144 | proposal / T2 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One compact solid copper pick head securely seated on a wooden handle, one stout working point. Successor to Stone Pick |
| N14 | Gardener's Hoe | STR/DEX | weapon | 2x4 | 96x192 | proposal / T1 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | Broad stone hoe blade bound transversely to a long angled wooden haft. Optional reach/sweep sidegrade; overlaps Mattock |
| N15 | Bast Shoes | U | feet | 2x2 | 96x96 | proposal / T1 | Pair; ankles above, toes lower-right; no legs | A pair of low woven bast-fiber shoes with rounded toes, closed uppers and relaxed simple ties; no straw tufts. Lapti is a faction-specific display name |
| N16 | Work Mitts | STR | hands | 2x2 | 96x96 | proposal / T1 | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of soft continuous hide mitts with one thumb each, doubled palms and plain seams; no armor plates. Starter closed-hand protection |
| N17 | Quilted War Mitts | STR | hands | 2x2 | 96x96 | proposal / T2 | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of thick quilted cloth mitts with dense seams and continuous padded palms; no hard patches. Developed soft mitigation branch |
| N18 | Bronze Handguards | STR | hands | 2x2 | 96x96 | proposal / T3 | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of metal-led protective hand shells with coherent thumb shells, a mitten-shaped finger shell and hidden lining; shell describes structure, not seashell material. Heavy hand-protection fork; proposed pre-medieval fantasy construction, subject to source review. |
| N19 | Fitted Gloves | DEX | hands | 2x2 | 96x96 | proposal / T2 | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of close-fitting leather gloves with separate fingers, shaped palm seams and minimal cuffs. Parallel DEX glove line |
| N20 | Archer's Guards | DEX | hands | 2x2 | 96x96 | proposal / T3 | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | Paired shaped leather forearm guards with compact stiffened bow-side coverage and simpler matching opposite cuff; fingers and palms bare. Developed DEX bracer line |
| N21 | Woven Cuffs | INT | hands | 2x2 | 96x96 | proposal / T2 | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of short broad woven wrist cuffs with distinct open ends; fabric stops before thumb webs and palms. Bare-hand caster progression |
| N22 | Inscribed Cuffs | INT | hands | 2x2 | 96x96 | proposal / T3 | Pair; wrists/cuffs upper-right, distal ends lower-left; no hands | A pair of structured cloth wrist cuffs with one small woven linear notation band, open hands and no dangling charms. Magical game construction, bounded ornament |
| N23 | Soft Leather Shoes | DEX | feet | 2x2 | 96x96 | proposal / T2 | Pair; ankles above, toes lower-right; no legs | A pair of low close-fitting leather shoes with continuous soft soles and rounded flexible toes. Quiet flexible footwear |
| N24 | Seamed Leather Shoes | DEX | feet | 2x2 | 96x96 | proposal / T3 | Pair; ankles above, toes lower-right; no legs | A pair of fitted leather shoes with a modest tapered toe, separately shaped heel panels and clean seams; no long curling toe. Quality DEX shoe successor |
| N25 | Cloth Boots | INT | feet | 2x2 | 96x96 | proposal / T1 | Pair; ankles above, toes lower-right; no legs | A pair of simple soft cloth ankle boots with hide soles and short straight shafts. INT early footwear |
| N26 | Pointed Buskins | INT | feet | 2x2 | 96x96 | proposal / T3 | Pair; ankles above, toes lower-right; no legs | A pair of soft calf-high fitted boots with restrained pointed toes and broad continuous uppers; no metal greaves or curled extensions. INT developed boot |
| N27 | Padded Legguards | STR | feet | 2x2 | 96x96 | proposal / T2 | Pair; ankles above, toes lower-right; no legs | Paired thick felt calf guards with plain hide footwear and credible broad ties; no metal plaques. Bridge toward heavy greaves |
| N28 | Rawhide Girdle | STR | belt | 2x1 | 96x48 | proposal / T1 | Horizontal shallow arc; full fastening | One broad stiff-hide waist band with visible opening and simple fastening; no dangling skirt panels. STR first belt branch |
| N29 | Layered Warbelt | STR | belt | 2x1 | 96x48 | proposal / T2 | Horizontal shallow arc; full fastening | One broad waist band of overlapping thick hide courses with load-bearing joins; shallow horizontal silhouette. STR developed belt |
| N30 | Fitted Leather Belt | DEX | belt | 2x1 | 96x48 | proposal / T2 | Horizontal shallow arc; full fastening | One narrow supple leather waist band with clean edge finishing and a simple credible fastening. DEX developed belt |
| N31 | Braided Leather Belt | DEX | belt | 2x1 | 96x48 | proposal / T3 | Horizontal shallow arc; full fastening | One shallow horizontal flexible belt made from broad tight leather braids and a plain fastening. DEX refined construction |
| N32 | Linen Sash | INT | belt | 2x1 | 96x48 | proposal / T1 | Horizontal shallow arc; full fastening | One plain linen waist sash with two real ends and a low cloth tie; ends tucked into the band. INT first belt branch |
| N33 | Patterned Sash | INT | belt | 2x1 | 96x48 | proposal / T3 | Horizontal shallow arc; full fastening | One broad woven waist sash with a bounded edge pattern and mostly plain cloth; no long tails or ornaments. INT refined construction |
| N34 | Hide-Backed Mantle | STR | overlayer | 2x3 | 96x144 | proposal / T2 | Shoulders above; full drape falls down | One continuous fur mantle reinforced with a broad hide backing and a clear shoulder closure. STR stronger outer layer |
| N35 | Armoured Mantle | STR | overlayer | 2x4 | 96x192 | proposal / T3 | Shoulders above; full drape falls down | One long heavy continuous cloak supporting a bounded fitted shoulder defense on credible backing; no shingled textile tabs or whole cloak made from plates. STR heavy fork; fantasy construction pending source review |
| N36 | Short Hide Cape | DEX | overlayer | 2x3 | 96x144 | proposal / T1 | Shoulders above; full drape falls down | One short supple hide cape with a clean shoulder outline and little loose fabric. DEX starter overlayer |
| N37 | Close-Cut Cloak | DEX | overlayer | 2x3 | 96x144 | proposal / T2 | Shoulders above; full drape falls down | One fitted cloth cloak with reduced loose volume, broad unbroken panels and a simple closure. DEX developed stealth silhouette |
| N38 | Scout's Cloak | DEX | overlayer | 2x3 | 96x144 | proposal / T3 | Shoulders above; full drape falls down | One close-cut hooded cloak with a shaped shoulder yoke and continuous broad cloth panels. DEX high-quality overlayer |
| N39 | Woven Veil | INT | overlayer | 2x3 | 96x144 | proposal / T1 | Shoulders above; full drape falls down | One broad light shoulder veil with a clear continuous cloth field and sparse folds. INT starter overlayer |
| N40 | Ritual Veil | INT | overlayer | 2x3 | 96x144 | proposal / T3 | Shoulders above; full drape falls down | One broad draped shoulder veil with a bounded woven border and predominantly plain material. INT developed overlayer |
| N41 | Linen Hood | INT | head | 2x2 | 96x96 | proposal / T1 | Crown up; shallow front-left view; full back | One complete simple linen hood with face opening and softly structured crown, no mask or helmet underneath. INT head branch |
| N42 | Bound Hood | INT | head | 2x2 | 96x96 | proposal / T2 | Crown up; shallow front-left view; full back | One close-fitting layered cloth hood with broad overlapping folds and a clearly open face. INT developed head branch |
| N43 | Woven Headdress | INT | head | 2x2 | 96x96 | proposal / T3 | Crown up; shallow front-left view; full back | One structured woven head covering with a full crown and one restrained horizontal border; no horns or halo. INT refined head branch |
| N44 | Fitted Hide Cap | DEX | head | 2x2 | 96x96 | proposal / T2 | Crown up; shallow front-left view; full back | One close-fitting hide cap with shaped panels, compact brow and full rear coverage. DEX developed head branch |
| N45 | Leather Scout Hood | DEX | head | 2x2 | 96x96 | proposal / T3 | Crown up; shallow front-left view; full back | One close-fitting leather hood with full crown and narrow face opening; no metal reinforcement. DEX refined head branch |
| N46 | Fitted Hide Jerkin | DEX | body | 2x3 | 96x144 | proposal / T2 | Neck above, hem below; front readable | One sleeveless fitted soft-hide torso garment with distinct shaped seams and clear openings. DEX developed body |
| N47 | Laced Leather Coat | DEX | body | 2x3 | 96x144 | proposal / T3 | Neck above, hem below; front readable | One short fitted flexible leather coat with a modest skirt, broad panels and functional side lacing. DEX refined body |
| N48 | Pleated Tunic | INT | body | 2x3 | 96x144 | proposal / T2 | Neck above, hem below; front readable | One fitted linen tunic with sparse broad pleats and short complete hem, no belt included. INT developed body |
| N49 | Ritual Robe | INT | body | 2x4 | 96x192 | proposal / T3 | Neck above, hem below; front readable | One long continuous cloth robe with broad shoulder folds, simple sleeves and a bounded woven hem field. INT long body branch |
| N50 | Herb Bundle | U | preparation-content | 1x1 | 48x48 | proposal / content | Coherent object/bundle; identifying material exposed | One compact tied bundle of identifiable dried medicinal leaves, no carrying harness. Consumed preparation ingredient |
| N51 | Resin Cake | U | preparation-content | 1x1 | 48x48 | proposal / content | Coherent object/bundle; identifying material exposed | One compact solid cake of resin wrapped at its base in a small plain leaf. Consumed preparation ingredient |
| N52 | Pigment Packet | U | preparation-content | 1x1 | 48x48 | proposal / content | Coherent object/bundle; identifying material exposed | One compact tied packet showing a small controlled amount of ochre powder. Consumed preparation ingredient |
| N53 | Dried Fang | U | trophy-content | 1x1 | 48x48 | proposal / content | Raw coherent material; no decorative mount | One dry species-specific fang retaining natural shape, no metal cap or mount. Crafting/trade material |
| N54 | Sinew Roll | U | trophy-content | 2x1 | 96x48 | proposal / content | Raw coherent material; no decorative mount | One compact horizontal roll of dried sinew secured with a plain tie. Crafting/trade material |
| N55 | Scale Patch | U | trophy-content | 1x1 | 48x48 | proposal / content | Raw coherent material; no decorative mount | One small dry irregular monster-hide patch with naturally attached scales. Crafting/trade material |
| N56 | Wrapped Relic | U | relic-content | 1x1 | 48x48 | proposal / content | Stable complete object; identifying surface exposed | One small thick relic fragment partly wrapped in plain cloth, with one identifiable solid edge visible. Proposed passive object in active relic area |
| N57 | Seal Stone | U | relic-content | 1x1 | 48x48 | proposal / content | Stable complete object; identifying surface exposed | One compact pierced stone seal with a restrained flat worked face, no pendant cord. Proposed passive object in active relic area |
| N58 | Votive Vessel | U | relic-content | 2x2 | 96x96 | proposal / content | Stable complete object; identifying surface exposed | One substantial compact deep votive vessel with a closed base and clear rim, no carrying rack. Proposed bulky passive relic |
| N59 | Rawhide Neckguard | STR | amulet | 2x2 | 96x96 | proposal / T1 | Upright; neck loop/opening above, front below | One broad stiff-hide collar protecting the neck base, with a complete rear section, an opening and simple fastening; no attached torso vest. Starter protective neckwear; occupies the Amulet slot. |
| N60 | Bronze Gorget | STR | amulet | 2x2 | 96x96 | proposal / T3 | Upright; neck loop/opening above, front below | One formed bronze neck defense with broad front coverage, a corresponding rear section and credible side opening; no attached cuirass or medieval layered neck lames. Advanced protective neckwear; proposed ancient-fantasy construction requiring source review. |
| N61 | Bronze Sceptre | STR/INT | weapon | 2x3 | 96x144 | proposal / T3 | Working head/tip UP-RIGHT; grip/butt DOWN-LEFT | One substantial bronze-headed ritual striking implement with a broad compact pronged head and a short single-hand grip; show the complete head and handle, no long staff shaft. Heavy one-handed ritual weapon; 2x3 bulk does not occupy both hands. Handedness: one-handed. |

## Do not generate — 24 held or inactive source entries

Audit records only. These are not alternate names to render, a queue, or replacements for missing references. Shell Knife, Shell-Edge Knife and Shell Shank are the same excluded concept. Removed carrier names must not return as capacity-granting equipment.

| Source ID | Name | Status | Reason |
|---|---|---|---|
| W04 | Shell Knife | excluded | Excluded by owner, including both aliases. No successor or cosmetic rename. |
| W46 | Spear-Thrower | retired | Retired by current repo instructions; original conversation does not reopen it. |
| O03 | Wicker Shield | retired | Retired by current repo instructions; do not revive as a higher ladder rung. |
| O22 | Hand Idol | hold | Hold: current production rules reject tiny hand-idol props; needs substantial revised silhouette. |
| O23 | Ritual Tablet | hold | Hold: flat tablet offhand conflicts with current production taste; not a generation target. |
| O25 | Focus Stone | hold | Hold: generic focus-stone equipment still needs a convincing silhouette; its former 1x1 footprint is disallowed. |
| A40 | Pouch Belt | hold | Hold or redesign: dangling pouch harness conflicts with the shallow belt silhouette; Quickrig owns equipment storage. |
| A46 | Feather Mantle | hold | Hold for source review; do not generate repeated feather-like textile shingles. |
| S06 | Charm Cord | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S07 | Relic Wrap | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S08 | Seal Case | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S09 | Tablet Sleeve | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S10 | Votive Box | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S16 | Fang Cord | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S17 | Horn Rack | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S18 | Shell Net | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S19 | Hide Roll | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S20 | Bone Frame | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S26 | Herb Satchel | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S27 | Gourd Rack | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S28 | Jar Rack | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S29 | Powder Case | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| S30 | Mortar Kit | removed-pack-carrier | Remove the equippable capacity carrier. Physical contents may be designed separately; do not inherit capacity bonuses. |
| J03 | Bronze Coil Ring | hold | Hold/rename as Plain Bronze Band if spiral construction is unacceptable under the no-spiral art rule. |

## Repository maintenance

This file is generated by `build_item_generation_guide.py` from the current structured item catalogue, attribute draft, footprint standard and presentation standard. Rebuild it after source changes; do not hand-edit its generated tables. All rendering instructions needed for a selected item are included above. Source images must be supplied separately. The protected owner-tuned PROMPT.txt and legacy runtime/generation assembler are not modified by this package.
