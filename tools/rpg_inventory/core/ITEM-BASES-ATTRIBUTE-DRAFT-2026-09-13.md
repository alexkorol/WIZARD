# Item bases: attributes, slots and footprints

Design draft, 2026-09-13. This is a reviewable continuation of [Martial Equipment Names](https://chatgpt.com/c/6a4ebe53-1a10-83ea-986a-cba67f7b1b7b), recovered through the task reader, including its 167-row named catalogue. It is not a runtime migration or an approved image-generation queue.

## Owner decisions and proposal boundaries

Confirmed by the current request:

- STR, DEX and INT are the three requirement attributes.
- Preparation, Trophy and Relic packs are backpack-area expansions, not equippable carriers. Their contents remain physical items.
- Warcall, Quiver/Quickrig and Attendant/Apparatus refer to actual equipment. Every unlockable equipment seat is 2x3; its items use 2x2 or 2x3 in this draft.
- The logical base cell is 48x48 px. The baseline human character sprite frame is 48x96 px.
- Most body armour occupies 2x3. The smallest weapon footprint is 1x3, including short knives, daggers and tool weapons; the old 1x2 weapon category is removed.
- Bows use 2x4 or 2x3 for shorter bases. Tower and standing shields can occupy 2x4.
- Magical main-hand wands use 1x3, rods 2x3 and staves 2x4.
- Amulets occupy 2x2 to accommodate equipment-seat tiling. This slot includes pendants, gorgets and armoured neck pieces, with STR requirements for protective bases.
- Clay Ember Cup occupies 2x2. No weapon or offhand item may occupy 1x1.
- Substantial one-handed weapons, including heavier swords and sceptres, may occupy 2x3 while remaining one-handed.
- Expand tool-derived weapons, particularly at the start.
- The starter INT focus is a simple clay cup containing an amadou ember, held offhand while the main hand is empty for Burning Hand. The opening build uses no gloves.
- Exclude Shell Knife, Shell-Edge Knife and Shell Shank as the same unwanted concept.
- Describe construction explicitly so “tusk helmet” cannot turn into a helmet with projecting tusks.

Suggestions, not locked decisions: the family assignments, new names, branch ladders, numerical requirement policy, later bare-palm compatibility, and all new item mechanics below. Lapti as faction flavor is welcome but remains a proposed name assignment. No numeric requirement curve, defence formula, extra equipment seat or spell behavior has been implemented.

## Attribute architecture

Use six branches plus a small shared opening pool. Requirements express the use and mechanics of a particular base, not simply its material.

| Group | Defensive identity proposed for this game | Construction direction |
|---|---|---|
| STR | Physical protection | Stiff shells, dense padding, load-bearing plates, heavy hide and fur |
| DEX | Evasion and unrestricted movement | Fitted leather, compact guards, supple soles, controlled loose fabric |
| INT | Magical ward | Cloth, woven structure, ritual working surfaces, exposed casting hands |
| STR/DEX | Protection plus mobility | Flexible scale, joint-conscious protection, reinforced working gear |
| STR/INT | Protection plus ward | Substantial ritual implements, padded vestments, guarded ritual equipment |
| DEX/INT | Evasion plus ward | Fine flexible cloth, light ritual gloves/cuffs, veils, precision ritual tools |
| U: shared | Basic utility | Cheap survival clothing, cord belts and selected work tools; no attribute floor |

This adapts PoE's distinction between STR armour, DEX evasion and INT energy shield; Ward here is a proposed Verdigris analogue, not PoE's separate Ward stat. PoE also distinguishes attribute-aligned weapons and generally attribute-free jewellery. [GGG item overview](https://www.pathofexile.com/item-data).

Keep one requirements record per base: STR, DEX, INT and required level. A hybrid requires BOTH attributes. Do not make the higher of two attributes satisfy both.

For eventual tuning, define a single-attribute budget R(level, slot). A pure base might require R in its axis; an initial hybrid tuning hypothesis is 0.65R in each of two axes. That is a starting test parameter, not a balance claim. Shared starters use zero; low-tier aligned starters must remain equippable by their intended starting characters. Numeric values remain null in the accompanying catalogue until starting stats and advancement are known.

Do not impose a seven-way art matrix on every noun. Every slot needs viable pure branches; add hybrids where a real construction and mechanical identity exist. Rings and ordinary pendant bases can remain U while their implicit bonuses favor an axis. The Amulet slot also supports STR neck armour: Rawhide Neckguard and Bronze Gorget are explicit 2x2 branch proposals. Pectoral is restored as a broad decorative neck item; it is not automatically STR unless it provides physical protection. Belts are intentionally being proposed as branching wearables here, rather than copying PoE jewellery behavior exactly.

## Equipment and backpack model

| System | Axis | What occupies it |
|---|---|---|
| Warcall | STR | Actual horn, whistle, drum, banner or standard |
| Quiver | DEX | Actual arrow case; moves out of the literal offhand |
| Quickrig | DEX | Actual worn mobility or proxy-combat apparatus |
| Attendant / Apparatus | INT | Actual hands-free magical equipment |
| Trophy expansion | STR/DEX | Additional storage cells for raw monster materials; no carrier item |
| Preparation expansion | DEX/INT | Additional storage cells for preparations and reagents; no carrier item |
| Relic expansion | STR/INT | Additional storage cells for passive relics; no carrier item |

All unlockable auxiliary equipment seats use the same 2x3 rectangle: 96x144 px at the 48 px base cell. Their items use 2x2 (96x96 px) or 2x3 (96x144 px). A square item stays square inside the taller seat. Bone Whistle is now 2x2; War Standard is 2x3, with the complete pole still visible and proportionate.

The earlier proposed extra seat splits, Attendant/Apparatus subclass behavior and special auxiliary footprint exceptions are withdrawn. Equipment-family labels do not establish additional seats or mechanics. Preparation, Trophy and Relic remain storage expansions; this correction does not resize those storage areas or their contents.

The old S06-S10, S16-S20 and S26-S30 carrier rows are removed from the equipment pool. Their source IDs are preserved as tombstones. Do not reuse an old carrier ID for a fang or herb bundle. New contents receive new IDs. A genuine jar containing reagent or a box containing a relic can be an item without becoming a capacity-granting pack.

No additional relic activation, stacking or storage-effect rules are established by this item-base draft.

## Parallel wearable ladders

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

Useful hybrid side branches:

| Group | Hands | Feet | Belt | Overlayer |
|---|---|---|---|---|
| STR/DEX | Bone-Splint Bracers | Rawhide Shoes / Hide Gaiters | Ring-Fastened Belt | Reinforced close-cut hide cloak, future base |
| STR/INT | Padded open-hand forearm protection, future base | Fur Boots | Padded ritual girdle, future base | Wool Cloak |
| DEX/INT | Fine open-palm casting cuffs, future base | Flexible ritual shoes, future base | Beaded Belt with restrained construction | Dust Scarf |

These future-base placeholders are coverage directions, not named production items.

## Clay Ember Cup and the hand slot

O26 becomes **Clay Ember Cup**, 2x2, offhand, INT-aligned, starter tier. Do not invent a separate weapon named “Burning Hand” to fill the empty main-hand slot.

Proposed starter activation conditions:

1. Clay Ember Cup, or another explicitly compatible ember vessel, is equipped offhand.
2. Main hand is empty. A visually absent weapon that still occupies this slot does not qualify.
3. The required casting palm is exposed. For the opening kit, both hands are bare and the Hands slot starts empty.
4. An ember is available under the eventual resource rule.

At the beginning, gloves, mitts and gauntlets obstruct this technique. Later wrist-only cuffs or forearm guards could be compatible because they leave the hands bare. That is a proposed progression solution, not an owner-approved permanent restriction on all INT skills. If the intended rule is literally “Hands slot must be empty,” keep it explicit instead and delay all caster hand-slot gear.

Represent coverage separately from slot: palm covered, fingers covered, forearm covered. Do not infer spell compatibility from the words “bracer” or “glove.” Early closed gloves can still serve non-pyromancy INT branches later.

The ember cup is neither an Attendant nor a backpack expansion nor a general reagent pouch. The contained amadou ember is part of its visible identity; whether fuel is replenished or consumed is still a combat/resource decision.

Construction brief: one small plain fired-clay cup, thick walls, open top, modest base, a dark fibrous amadou ember resting visibly inside with a faint glowing edge and sparse ash. No handle is necessary. No stemmed goblet, giant brazier, teapot spout, lid, runes, gems, floating orb, huge flame or hand in the isolated item image.

## Tool-derived weapon expansion

Tools use their actual weapon animation family: a carving adze is axe-like, a hafted stone hammer is blunt, a fishing spear is reach, a harvesting sickle is a hooked short blade. “Tool” is an origin/use tag, not an excuse to create incompatible skill behavior.

Prioritize these opening options:

| Base | Requirement family | Grip | Footprint | Mechanical purpose proposed |
|---|---|---|---|---|
| Skinning Knife | DEX | One hand | 1x3 | Fast precise cuts |
| Flint Scraper | Shared | One hand | 1x3 | Broad short cutting tool |
| Harvest Sickle | DEX | One hand | 1x3 | Hooking cuts |
| Carving Adze | STR | One hand | 1x3 | Compact chopping |
| Hafted Stone Hammer | STR | One hand | 1x3 | Staggering impacts |
| Antler Pick | STR | One hand | 1x3 | Puncturing impact |
| Butchering Blade | STR/DEX | One hand | 1x3 | Slower broad cuts |
| Digging Stick | Shared | Two hands | 1x4 | Basic reach |
| Fishing Spear | DEX | Two hands | 1x4 | Precise reach |
| Field Mattock | STR | Two hands | 2x4 | Heavy sweeps |
| Woodcutter's Axe | STR | Two hands | 2x4 | Heavy cutting |

Copper Pick and Copper Chisel extend the early crafted tier. Gardener's Hoe is a reserve sidegrade because it overlaps the Mattock. Existing Stone Pick and Sickle remain in the source mapping; Harvest Sickle is the specifically flint-inset opening variant rather than a second undefined copy.

Do not make all these drop immediately. A small opening-area pool could offer Cudgel, Flint Knife, Harvest Sickle, Carving Adze, Digging Stick and Clay Ember Cup, with faction/civilian occupation introducing the others. The cup supplies the early INT identity without forcing ordinary carpentry tools to require INT.

## Footprint decisions

All sizes are width x height in 48x48 px cells; one pair of footwear/handwear is one item. The human sprite baseline is 48x96 px; this is a frame-size convention, not a collision-box rule. See INVENTORY-FOOTPRINTS.md for the complete pixel table.

- Existing defaults retained: body 2x3, head/hands/feet 2x2, belt 2x1, rings 1x1, amulets/neckwear 2x2, one-hand weapon usually 1x3 or 2x3 for broad substantial bases, compact blade 1x3, two-hand weapon 2x4 or genuinely narrow 1x4.
- Long robe or heavy cloak: 2x4 only when the complete garment justifies it.
- All auxiliary seats are 2x3. Quiver 2x3; compact dart case 2x2; Quickrig and INT auxiliary items 2x2 or 2x3; Warcall items 2x2 or 2x3.
- Full shield 2x3, small hand shield 2x2, tower/standing/body-length shield 2x4. Bows are 2x4 or 2x3 for shorter bases.
- Magical main-hand wand 1x3 (48x144 px), rod 2x3 (96x144 px), staff 2x4 (96x192 px). Forked Staff follows the magical staff rule; ordinary Short Staff and Long Staff remain martial fighting-stick bases. Auxiliary Conduit Rod retains its auxiliary footprint. These family definitions do not add new named catalogue entries.
- Owner-confirmed: all Amulet-slot items and Clay Ember Cup are 2x2. No 1x1 weapon or offhand bases, including held concepts.
- A broad Leaf Sword, Sickle Sword or Bronze Sceptre may be 2x3 and one-handed. Handedness is an explicit equipment property, never inferred from grid width.
- Bone Whistle uses 2x2 and War Standard uses 2x3 under the shared auxiliary rule. Coiled Bola remains a proposed 2x2 weapon; it does not establish an auxiliary exception.
- The authoritative footprint document records the confirmed corrections; runtime forms have not yet been migrated.
- Scarves and veils currently remain 2x3 under the overlayer standard. A smaller rolled-scarf branch is a possible later grid-economy choice, not already implemented.
- Intrinsic size does not change with rarity or rolled modifiers. Faction variants sharing a base keep its size; a materially different silhouette deserves another base.
- Do not crop a long object or display one shoe instead of a pair. Amulet 2x2 is a deliberate slot-tiling rule, including for physically small pendants; show the complete neck item without inventing bulk or ornament to fill the square.
- Numeric stat magnitude is not a reason to enlarge the footprint.

## Descriptions that prevent model drift

Separate player-facing name, construction brief, required visible features and forbidden substitutions. The following are design descriptions, not approved generation prompts. Production still requires the repo's inspected source-image gate, appropriate faction anchor and visual QA.

**Tusk-Plate Helmet (A06):** one complete close-fitting cap covered with many small curved pale plates cut from tusk, laid against the dome in organized rows, attached through small holes to a leather backing. Include a complete back and structurally corresponding cheek guards. The plates make the protective surface; they are not ornaments mounted on an otherwise metal helmet. No whole projecting tusks, paired horns, antlers, animal skull, metal greathelm or spikes. Keep Horn-Plate Helmet and Bone-Plate Helmet as separate constructions if added; horn, bone and tusk are not interchangeable material terms. The museum record describes a tusk helmet built from rows attached to leather or cloth with cheek guards. [Heraklion museum record](https://ca.heraklionmuseum.gr/ca/pawtucket/index.php/Detail/objects/81).

**Bronze Greaves:** two shaped shin shells, corresponding left/right pieces, with plain sandals supplied by the same Feet item. No armored toes, sabatons, knee cops or boots made entirely of bronze.

**Quilted War Mitts:** two continuous soft quilted mitts with thumb pockets, thick palms and dense seams. No metal rectangles, stone plaques, armored cuffs or isolated riveted panels.

**Bast Shoes / Lapti:** two low closed shoes woven from flat bast strips, rounded toes, complete soles and modest ties lying under gravity. No fluffy straw slippers, modern sneaker soles, open sandals or invisible legs.

**Armoured Mantle:** broad continuous cloth or hide cloak bearing one coherent protective shoulder assembly. The load-bearing garment remains visible. No tessellated fabric shingles, feather rows, repeated dangling tabs or armor pasted randomly over cloth.

**Adze:** name the cutting-edge orientation and show a complete secured head and haft. An adze's edge is transverse to its handle; this distinction is also described in the [British Museum's wooden-adze presentation](https://artsandculture.google.com/asset/wooden-adze-with-bronze-blade/TwGVjbZZuHMlBA?hl=en).

The Appendix gives each retained source entry a construction brief and flags the highest-risk substitutions. Excluded names survive only as audit records. Do not use their aliases as alternate active drops.

## Review status

The source ledger preserves all 167 original IDs: 143 candidates, six held concepts, 15 removed pack carriers, two previously retired concepts and one owner-excluded concept. The draft also adds 61 proposals, including 14 tool weapons, wearable branch coverage, nine actual pack contents, two protective neckwear bases and one substantial one-handed sceptre. These counts are not a final approved drop pool. Both a candidate and a proposal still need balance/art review before runtime promotion.

The original eight-per-wearable-slot budget was insufficient for shared starters, three full pure-attribute ladders and hybrids. Expand deliberately around missing branches rather than maintaining that arbitrary quota.

Unresolved design choices are visible rather than silently decided: numeric stat/level progression; whether bare Hands is an early slot restriction or a palm-coverage rule; cup fuel behavior; and which held legacy items deserve redesign. None prevents reviewing the present named-base/footprint catalogue.

Companion files:
- ITEM-BASES-ATTRIBUTE-DRAFT-2026-09-13.json: structured source mapping plus new proposals.
- ITEM-BASES-CATALOGUE-2026-09-13.md: complete readable row-by-row catalogue with construction briefs.

The structured file is a design interchange format, not an import-ready replacement for runtime forms. Null numeric requirements mean unresolved, never zero. U is the explicit no-attribute group.
