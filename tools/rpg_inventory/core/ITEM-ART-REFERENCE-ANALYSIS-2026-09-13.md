# PoE / Diablo II inventory-art reference analysis

Research and visual inspection: 2026-09-13. Deliverable: a practical [inventory presentation standard](ITEM-ART-PRESENTATION.md) for Verdigris. Findings below are observations from artwork, not quotations from either studio's internal art guide.

## Evidence and selection

Inspected **98 distinct image files: 62 Path of Exile icons and 36 original Diablo II icons**. SHA-256 hashes, source pages, exact image URLs, original dimensions and local research paths are recorded in [the source manifest](item-art-reference-sources-2026-09-13.json). All 98 hashes are distinct.

PoE sample: 27 weapon icons, 22 armour/limb/head/shield icons, 10 belt/amulet/ring icons and three quivers. Selection deliberately covers narrow and broad weapons, one- and two-handed forms, curved blades, axes, staves, STR/DEX/INT clothing and pairs. Diablo II sample: three published illustrations from each of 12 families (swords, axes, maces, sceptres, spears, bows, body armour, helms, gloves, boots, belts and shields). It is a purposive comparison, not a random sample or census. Avoid universal percentages.

Primary visual material:
- GGG's [weapon index](https://www.pathofexile.com/item-data/weapon) and [armour index](https://www.pathofexile.com/item-data/armour), with linked official CDN PNGs.
- GGG accessory artwork hosted by the community [Belt](https://www.poewiki.net/wiki/Belt), [Amulet](https://www.poewiki.net/wiki/Amulet), [Ring](https://www.poewiki.net/wiki/Ring) and [Quiver](https://www.poewiki.net/wiki/Quiver) pages. Observations concern the embedded art, not wiki prose.
- Blizzard's Arreat Summit [swords](https://classic.battle.net/diablo2exp/items/normal/swords.shtml), [axes](https://classic.battle.net/diablo2exp/items/normal/axes.shtml), [sceptres](https://classic.battle.net/diablo2exp/items/normal/scepters.shtml), [spears](https://classic.battle.net/diablo2exp/items/normal/spears.shtml), [body armour](https://classic.battle.net/diablo2exp/items/normal/armor.shtml), [helms](https://classic.battle.net/diablo2exp/items/normal/helms.shtml), [gloves](https://classic.battle.net/diablo2exp/items/normal/gloves.shtml), [boots](https://classic.battle.net/diablo2exp/items/normal/boots.shtml), [belts](https://classic.battle.net/diablo2exp/items/normal/belts.shtml) and [shields](https://classic.battle.net/diablo2exp/items/normal/shields.shtml). Remaining family pages are in the manifest.

The requested Spriters Resource PoE page returned errors to the web reader and a security-verification screen in the browser. No challenge was bypassed. The sample therefore uses the publishers' actual icon art rather than treating inaccessible sprite-sheet thumbnails as inspected evidence. PoE Wiki was available to the HTTP reader even where the web reader returned an error.

These are PoE 1 and classic Diablo II reference assets, not PoE 2 or Diablo II: Resurrected. Dimensions describe retrieved image files; they are not automatically the original game's cell dimensions. Reused art across differently named PoE bases was not counted repeatedly.

## Observed patterns

### Weapon direction is consistent within each reference, but differs between them

The PoE selection strongly favors **grip lower-left, blade/head upper-right**. Narrow forms stay close to vertical; broad swords/sceptres use more diagonal space. Examples include Rusted Sword, Skinning Knife, Stiletto, Broad Sword, War Sword, Bronze Sceptre and Two-Handed Sword. Rusted Hatchet is almost upright; its broad cutting face still projects to the right.

In the Diablo II sample, Short Sword, War Sword, Great Sword, spear forms and several axes/sceptres lean **head upper-left, grip lower-right**. This is the opposite visual direction. Grand Scepter is near upright, and the flexible Flail cannot be described by the ball's location alone.

Inference: continuity comes from a repeated family pose, not an intrinsically correct diagonal. For Verdigris, adopting the PoE/rightward convention is a coherent choice and aligns with the owner's proposed wording. Mixing the two sources literally would alternate weapon direction.

### Blade-face visibility matters more than “three-quarter”

PoE swords show broad readable blade surfaces with restrained thickness cues. They are not pointing at the camera. Long Staff and two-hand weapon shafts preserve strong apparent length. Axe heads expose enough of the cutting silhouette and socket/haft relationship to identify the construction.

Inference: separate image-plane lean from depth rotation. “Tilted” alone allows a generator to aim the point toward the lens, shorten the shaft or hide the blade edge-on. A camera aimed almost perpendicular to the broad face can still show volume through bevels and light.

### Body armour keeps its worn up/down axis

Plate Vest, Shabby Jerkin, Simple Robe, Scholar's Robe and Full Plate remain upright, with neck/shoulders above hem and the garment front readily legible. Depth varies: a side opening is visible in Shabby Jerkin, while other examples read more frontally. Diablo II Quilted Armour, Chain Mail and Ancient Armour similarly preserve upright garment silhouettes.

The samples do not support “everything must be turned 45 degrees in three dimensions.” They support enough depth to explain structure while retaining the front. They also show some source-game costume/attached equipment conventions that should not override Verdigris slot separation.

### Paired gear has its own direction

PoE Rawhide Boots, Wool Shoes and Velvet Slippers present a staggered pair with toes generally toward screen-right/down-right. Iron Greaves preserve more upright shin mass. PoE gloves/mitts generally show cuffs above and to the right, with fingers toward lower-left; stagger/overlap varies.

Diablo II gloves use a more fanned arrangement, and its selected boots vary the near/far-foot view rather than obeying the exact PoE arrangement. All of this illustrates paired readability, not identical mathematical rotations for each piece.

Verdigris choice: prefer a restrained stagger, keep each opening/distal end readable, and use separate handed left/right forms. Do not direct an image model to “mirror one glove,” which can produce two same-hand objects or reversed illumination.

### Helmets and shields prioritize recognition over identical yaw

PoE Iron Hat and Cone Helmet read almost frontally; Leather Cap reveals a deep face opening; Close Helmet uses a shallow oblique view. Diablo II Cap and Great Helm also differ in turn. A complete crown and readable front are the repeated priorities. Exact front-left yaw is a Verdigris continuity proposal, not an observed rule across every sampled helmet.

Shields favor the fighting face. Painted Buckler has a readable shallow ellipse and rim; Cedar Tower Shield preserves a tall front; Reinforced Kite Shield keeps the whole face outline. Diablo II Buckler and Gothic Shield likewise show their fronts. Brass Spirit Shield is a shape exception: it reads as an open magical frame, not a conventional shield disc. Never force every offhand into one shield pose.

### Belts have a horizontal rest pose

PoE Rustic Sash and Leather Belt occupy shallow horizontal compositions, with enough top-edge/inner-loop view to explain thickness. Heavy Belt bends and overlaps more strongly while staying a broad belt. Diablo II Sash, Light Belt and Belt preserve a similar wide-band read.

Verdigris can use an open shallow arc or compact credible loop. A permanently seamless ring is not a valid substitute for fastening. Long tails and pouches should not expand a 2x1 belt into a vertical costume.

### Jewellery and quivers reveal conventions we should selectively reject

PoE rings use oblique oval openings that expose band thickness and bezel surfaces. The sampled amulets present the pendant as the focal mass and often crop chain ends. Verdigris's 2x2 Amulet area permits a complete wearable loop or protective collar; the cropped-chain convention is deliberately rejected.

The inspected quivers include arrows or crossed shafts and vary which way the case leans. Verdigris's standalone empty/capped case convention avoids those accessory/geometry risks. Therefore a fixed slight-right case pose is a new project rule, not a universal PoE observation.

### Stable light and complete silhouettes are more transferable than exact rendering style

Local highlights and shadows explain material thickness at icon scale. The sample is too small and stylistically mixed to reconstruct either studio's camera focal length or lighting rig. The upper-left key, neutral balance and no baked drop-shadow rule continue Verdigris's own chosen renderer direction.

Diablo II reference GIFs include black background/padding in the official gallery. Do not infer a black-background delivery requirement or native sprite dimensions from those page illustrations.

## Families without a direct equivalent in this sample

Standalone cloaks/veils, gorgets, ember cups, raw trophies, preparations, Quickrigs, Warcalls and Attendants were not directly validated against equivalent reference families. Their new profiles extrapolate the observed principles: stable functional up/down, visible identifying surface, coherent assembly, readable openings, restrained depth and family continuity. They are labeled project conventions rather than falsely attributed to PoE or Diablo II.

Cups require an elevated view into a level opening, not a weapon diagonal. Cloaks need a shoulder-to-hem drape, not a body-armour mannequin. Gorgets need a complete neck opening and rear continuity. Those structural needs outrank a generic pose phrase.

## Visual records and game-scale check

Research sheets preserve source orientation; PoE images are uniformly fitted as necessary and the Diablo II comparison uses nearest-neighbor enlargement within tiles. They are annotated research derivatives, not game assets; full source files stay in local staging:

- [PoE weapons](../review_assets/item-presentation-2026-09-13/poe_weapons.jpg)
- [PoE wearables](../review_assets/item-presentation-2026-09-13/poe_wearables.jpg)
- [PoE accessories](../review_assets/item-presentation-2026-09-13/poe_accessories.jpg)
- [Diablo II weapons](../review_assets/item-presentation-2026-09-13/diablo_ii_weapons.jpg)
- [Diablo II wearables](../review_assets/item-presentation-2026-09-13/diablo_ii_wearables.jpg)

[Cross-game orientation comparison](../review_assets/item-presentation-2026-09-13/orientation-comparison.jpg) juxtaposes five matching families without rotating or mirroring their art.

The [game-scale comparison](../review_assets/item-presentation-2026-09-13/game-scale-comparison.jpg) fits selected original artwork into Verdigris-proposed footprints at 54-pixel and 36-pixel cells. This changes display size only, never orientation or shape. It tests readability under our layout, not either source game's native presentation. The 12 selected examples were visually inspected at both sizes: overall poses, paired feet/hands and broad garment identities remain legible; fine chain/arrow details are more fragile at 36-pixel cells. This supports the simpler complete-loop/empty-quiver choices, but is not a generated-Verdigris-asset acceptance test.

No generation model was exercised. The orientation rules are informed art direction and failure-prevention proposals, not demonstrated generation success rates. Exact tilt bands, occupancy targets and overlap ranges are chosen working tolerances, not measured averages of the 98 files.
