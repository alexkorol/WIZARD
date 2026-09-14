# Inventory art presentation standard

Working art-direction standard, 2026-09-13. Covers every item family, including new tool weapons and auxiliary equipment. It separates observed reference patterns from deliberate Verdigris conventions. Read [the evidence report](ITEM-ART-REFERENCE-ANALYSIS-2026-09-13.md) for the inspected sample and limitations.

This standard supersedes generic “dynamic three-quarter hero angle,” “edge-to-edge,” and “bold corner-to-corner diagonal” instructions for **isolated inventory items**. It does not change character/loadout poses, faction construction, slot ownership, material rules or the source-image gate. Exact angles and margins below are proposed production targets, not measurements or published rules from GGG/Blizzard.

## Five things to specify separately

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
| 1x2 compact knife/tool | 12 degrees | 8–18 degrees | Enough movement without losing blade width |
| 1x3 narrow weapon | 8 degrees | 5–12 degrees | Narrow cell column constrains rotation |
| 1x4 narrow reach weapon | 5 degrees | 3–8 degrees | Preserve full shaft and usable head size |
| 2x3 broad one-hand weapon | 20 degrees | 15–25 degrees | Room for a broad blade/head and one-hand grip |
| 2x4 two-hand weapon | 12 degrees | 8–18 degrees | Keep a long full silhouette without shrinking the shaft |

These are working ranges, not automatic rejection thresholds. A wide axe head may need less tilt. Solve fit by reducing tilt or uniformly scaling the complete object; never compress its geometry or shorten its handle. Footprint does not determine handedness: a 2x3 sceptre remains one-handed.

For a straight line in a W-by-H rectangle, the corner diagonal is atan(W/H) from vertical: about 18 degrees for 1x3 and 34 degrees for 2x3. Actual weapons need head width and padding, so their usable lean is lower. “45-degree diagonal” is therefore a poor global instruction.

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
- Review at the native **48x48 px base cell**: a 1x2 knife is 48x96 px, a 2x2 amulet or Ember Cup is 96x96 px, and 2x3 armour is 96x144 px. All auxiliary equipment seats are 96x144 px; their current items are 96x96 or 96x144 px. Keep square items square inside the taller seat. Existing adaptive runtime sizes and the earlier 54/36 px research sheet describe the prior UI, not this new target; runtime migration is still pending.
- The baseline human sprite frame is 48x96 px. This common unit does not make an inventory icon a literal world-scale depiction or define character collision bounds. Retain high-resolution masters and judge the downscaled art at native size. A ring at 1x1 and a gorget at 2x2 must not be compared at identical enlarged image size.
- Judge object identity, orientation, whole-object readability and pair completeness at game scale; inspect joins, holes and anatomy mistakes enlarged. Neither check replaces the other.

## Prompt construction

Use one complete prompt assembled in this order:

1. One named item and exact count (one object, or exactly one left/right pair).
2. Source-backed construction and materials.
3. Footprint/aspect ratio.
4. One family pose from this document.
5. Shared lighting, background and full-frame requirements.
6. Only the few relevant failure exclusions for this item.

Do not combine every family rule into one enormous prompt. Do not use “dynamic,” “dramatic angle,” “isometric,” “45 degrees,” or “corner-to-corner” as universal pose instructions. “Dramatic” may describe light, not the camera.

A complete generic rendering paragraph for new standalone prompts:

> Render an isolated inventory item with crisp material edges, readable construction and restrained three-dimensional depth. Use the family pose specified above. Keep the complete object inside the frame with clear padding and preserve its real proportions. Illuminate from the upper-left with neutral light, readable local shadows and subtle edge separation. Keep healthy material color and light active-service wear. Use true alpha transparency; if unavailable, use the pipeline's specified single flat matte color. No ground plane, cast shadow, baked drop shadow, text, border, watermark, hands, body, mannequin or unrequested accessories.

The protected, owner-tuned **PROMPT.txt has not been edited**. It still contains the old “dynamic three-quarter” and “bold diagonal” sentences. The new standalone prompts must replace that framing language when manually assembled, not be appended blindly to it. The current status.py assembler has not been migrated; this standard is not a claim that legacy generated prompts already comply.

## Review gates

Reject or hold: wrong directional family; weapon tip down; high foreshortening; shortened shaft; broad blade edge-on; cut-off extremity; missing or fused mate; glove/boot swapped anatomy; unsupported loose fabric; shield rear face; sealed vessel pretending to be an open cup; floating contents; cross-slot accessories.

Minor roll/centering drift in otherwise good accepted art is a normalization candidate, not automatic regeneration. A screen-plane rotation may be fixable without another model call. Do not horizontally mirror whole rendered assets just to match direction: that reverses lighting, anatomical sides, symbols and construction. Rotation also moves baked illumination, so recheck the light direction. Do not auto-fail on a principal-component angle: an axe head, a curved blade or a pair can skew the silhouette axis away from the true shaft/part axes.

No images were generated or retired as part of this research. Existing accepted assets remain available; apply the standard to new briefs and explicitly selected rework.
