# Wearables expansion draft

Scope: exactly 50 ARPG base items: 17 handwear, 17 footwear/greaves, and 16 belts/girdles. The classes follow PoE1/Diablo 2 base-economy logic rather than a form-by-material matrix. Each class has a crude-to-endgame ladder with repeated tiers but structurally distinct bases within each tier.

## Canonical inventory footprints

- Handwear: square canvas, `2x2`, matching the runtime `bracers` form.
- Footwear and greaves: square canvas, `2x2`, matching the runtime `sandals` and `greaves` forms.
- Belts and girdles: landscape canvas, `2x1`, matching the runtime `girdle` form.

The assigned slots do not contain the large weapon/body/shield families that justify `2x3`, `2x4`, or larger footprints. Even the heaviest paired greaves stay at the canonical `2x2` equipment footprint. Their visual weight comes from coverage and material mass, not an inconsistent grid exception.

## Ladder balance

| Class | T1 | T2 | T3 | T4 | T5 | Total |
|---|---:|---:|---:|---:|---:|---:|
| Handwear | 4 | 4 | 4 | 3 | 2 | 17 |
| Footwear/greaves | 4 | 4 | 4 | 3 | 2 | 17 |
| Belts/girdles | 4 | 4 | 4 | 2 | 2 | 16 |
| **Total** | **12** | **12** | **12** | **8** | **6** | **50** |

Tier contrast is driven by construction: crude wraps and gathered hide; fitted leather, copper facing fields, and splints; bronze scales, sheet shells, marching footwear, and broad military belt reinforcement; bounded protected prestige fields and lacquer; then raw dark meteoritic iron made by ancient hammering, riveting, lacing, and leather backing. There are no medieval plate harnesses, welted modern shoes, molded soles, zippers, machine stitching, modern eyelets, prompted tiny closures, or fashion-belt clutter.

## Calibrated-manifest deduplication

`C:\Users\Alex\Downloads\items_multi_context_balanced_v1\balanced_item_manifest.tsv` was checked after the first draft. It contains 40 planned `hands_arms` rows and 40 planned `legs_footwear` rows, but those rows collapse to only a few repeated briefs:

- `hands_arms`: materially continuous quilted cloth archer mitts with enclosed hand pouches and doubled palms.
- `legs_footwear` T1: cloth-and-splint shin guards integrated with woven/felt/simple footwear.
- `legs_footwear` T2: woven-fibre shoes or one-piece felt boots with sparse lacing.
- `legs_footwear` T3: shaped bronze greaves integrated with wrapped-hide shoes or sandals.

Only five hand/arm and five leg/footwear output paths currently exist. They are review-first reuse/alias candidates and must be sorted before any nearby generation. This draft therefore:

- removed the initially proposed padded quilted mitt; after historical QA also removed the unsupported copper armlet and jewelry-like wrist band, replacing them with a directly attested protective transverse-lame forearm construction;
- keeps mitts only where the primitive hide/fur construction is materially and structurally distinct from the generated quilted-cloth family;
- removes the exact woven-fibre shoe and one-piece felt-boot concepts;
- preserves a full footwear read on every greave row while differentiating new rows by construction: hide-splint boots, bronze greaves over sandals, skymetal greaves over sandals, and scale-shin soft boots. Existing bronze-greave generations remain review-first possible aliases;
- contains belts as net-new gap candidates because the calibrated manifest has no belt class.

## Historical-QA correction pass

The wearables section of `qa-historical.md` was applied row by row. Every `REVISE`, `HOLD`, and `REJECT` was resolved rather than merely annotated.

### Handwear

- Replaced speculative bark with the directly attested polished stone wrist-guard.
- Converted ambiguous hand-shaped strips into true forearm wraps.
- Removed the unsupported copper armlets and fitted panel gloves.
- Removed every hard plate or scale pasted onto a soft glove body.
- Expanded scale constructions into complete rigid bracers or full manica sleeves with continuous backing and explicit pierced/laced attachment.
- Removed jade and obsidian from wrists and all other flex points.
- Removed articulated half-gauntlets and separate knuckle lames. T5 now uses a contiguous meteoric wristguard and coherent sheet-metal vambraces.

### Footwear

- Removed the prompted copper lace hook.
- Removed bronze plates from beneath sandal soles.
- Integrated every greave or shin defense with complete visible footwear and full soles.
- Replaced the weakly anchored Scythian boot with directly depicted Classical riding boots.
- Removed shell-edge buskins and all obsidian ankle plaques.
- Replaced armored toe/instep shoes with scale protection limited to boot shins, eliminating sabaton and safety-shoe drift.
- Added direct object anchors for Late Roman hobnail shoes and Graeco-Roman fur-lined embossed leather shoes.

### Belts

- Removed every prompted buckle, hook, toggle, keeper, peg, ring cluster, and displayed closure.
- Recast copper and bronze as broad terminal, facing, plaque, or stiffener fields peened flat to continuous backing.
- Replaced the complex double-suspension harness with a directly anchored Etruscan sheet-faced girdle.
- Kept sword suspension as one broad integral leather tab folded flush, based on the visually confirmed shallow intake silhouette.
- Removed jade from the belt ladder entirely and replaced the fragile clasp concept with a directly anchored Late Roman gilt-bronze facing plate.
- Removed closure hardware from both T5 belts.

## Intake triage: sorted indices 130-173

The intake directory was sorted by filename exactly as assigned. These are visual-reference decisions, not promotions or acceptances.

| Index | Visual read | Decision for this portfolio |
|---:|---|---|
| 130 | Ornate open leather sandals with modern layered sole and decorative hardware | Reject; modern manufactured sandal language. |
| 131 | Open fitted tool/jewelry case | Out of scope. |
| 132 | Jewel-heavy crown/collar | Reject; costume regalia and celestial ornament. |
| 133 | Turquoise pendant | Out of scope. |
| 134 | Decorated sleeveless robe | Out of scope. |
| 135 | Feathered cloak | Out of scope. |
| 136 | Gem-centered ornate belt | Reject; modern/fantasy costume belt, radial centerpiece. |
| 137 | Gemmed ring | Out of scope. |
| 138 | Pair of dark leather forearm guards with bounded metal fittings | Useful silhouette reference after removing radial motifs, blue inlay, and excess decoration. Referenced by `hands_bronze_vambraces`. |
| 139 | Curved sword | Out of scope. |
| 140 | Round shield | Out of scope. |
| 141 | Padded hood | Out of scope. |
| 142 | Celestial pendant | Out of scope. |
| 143 | Long coat/outfit | Out of scope. |
| 144 | Draped mantle | Out of scope. |
| 145 | Buckled open-toe high sandals/boots | Reject; costume footwear with modern paneling and too many buckles. |
| 146 | Shallow leather belt with cord binding and compact buckle | Useful reference once the rosette-like plaque is removed. Referenced by `belt_bronze_plaque_belt`. |
| 147 | Radial signet ring | Out of scope; solar-symbol failure. |
| 148 | Pair of strapped forearm guards | Useful reference for plain hide-splint construction after removing decorative bosses. Referenced by `hands_hide_splint_bracers`. |
| 149 | Rod/staff | Out of scope. |
| 150 | Hide round shield | Out of scope. |
| 151 | Hide cap | Out of scope. |
| 152 | Pendant | Out of scope. |
| 153 | Hide torso wrap | Out of scope. |
| 154 | Dangling tool bundle | Out of scope and too cluttered for belt-slot use. |
| 155 | Plain shallow leather belt with simple buckle | Strong usable concept reference; referenced by `belt_plain_leather_belt`. |
| 156 | Low leather shoes with welted, shaped modern construction | Reject; specifically excluded from ancient footwear language. |
| 157 | Signet ring | Out of scope. |
| 158 | Paired padded forearm/hand wraps | Useful texture and binding reference, but future item must keep an explicit hand body if classed as hand wraps. Referenced by `hands_sinew_wraps`. |
| 159 | Crooked staff | Out of scope. |
| 160 | Sling | Out of scope. |
| 161 | Cloth hood | Out of scope. |
| 162 | Pendant | Out of scope. |
| 163 | Tunic outfit | Out of scope. |
| 164 | Cloth cowl | Out of scope. |
| 165 | Plain shallow leather belt with tied repair and compact fittings | Useful reference for a restrained military/sword belt. Referenced by `belt_bronze_sword_girdle`. |
| 166 | Signet ring | Out of scope. |
| 167 | Pair of rough hide wrist/forearm wraps | Useful primitive reference; referenced by `hands_rawhide_wrist_cuffs`. |
| 168 | Pair of tall soft leather boots | Usable silhouette reference if rebuilt without welted soles, molded toe structure, or machine-perfect lacing. Referenced by `feet_classical_riding_boots`. |
| 169 | Fitted black fingered gauntlets | Reject as final; too medieval/modern and too machine-finished. |
| 170 | Multi-item sheet including belt, handwear, sandals, boots | Reference-only overview. Individual objects are too small to promote; confirms useful slot breadth but not production details. |
| 171 | Spear | Out of scope. |
| 172 | Tall oval shield | Out of scope. |
| 173 | Plain wrapped textile sash with short tied end | Strong usable concept reference after tucking the tail inside the 2:1 silhouette. Referenced by `belt_folded_wool_sash`. |

## Primary historical anchors

The TSV cites collection or official museum records row by row. Reused anchors are deliberate construction references, not claims that every proposed base survives archaeologically as a complete object.

- [South Tyrol Museum of Archaeology: Ötzi clothing and multilayer shoes](https://www.iceman.it/en/oetzi/clothing) — hide, leather, sinew/tree-bast sewing, deerskin upper, bast mesh, grass insulation, and leather sole.
- [British Museum: Late Neolithic/Early Bronze Age stone wrist-guard](https://www.britishmuseum.org/collection/object/H_1976-0401-3) — shallow curved plate, bevels, and paired fastening perforations.
- [British Museum: Early Bronze Age stone wrist-guard](https://www.britishmuseum.org/collection/object/H_1892-0517-3) — compact waisted plate and drilled attachment.
- [Met: Scythian/Subeixi leather scale armor](https://www.metmuseum.org/art/collection/search/26565) — hard scales secured by rawhide laces to soft leather.
- [Met: Achaemenid armor scales](https://www.metmuseum.org/art/collection/search/326389) — overlapping iron scales on leather backing.
- [National Museums Scotland: Roman laminated arm guard from Newstead](https://www.nms.ac.uk/explore-our-collections/collection-search-results/armour-laminated-arm-guard-fragment/135675) — protective transverse bronze lames, AD 80-180.
- [Vindolanda Trust: Roman leather boxing guards](https://www.vindolanda.com/Blogs/blog/vindolandas-top-10-finds-of-the-decade) — direct surviving protective leather hand equipment.
- [British Museum: Ancient Egyptian woven-cord sandal](https://www.britishmuseum.org/collection/object/Y_EA4418) — woven fibre sole, toe thong, and ankle strap.
- [British Museum: Antinoupolis leather sandal](https://www.britishmuseum.org/collection/object/Y_EA53916) — layered sole, thong stitching, closed heel, and cut upper.
- [British Museum: Graeco-Roman fur-lined embossed leather shoe](https://www.britishmuseum.org/collection/object/Y_EA21727) — closed leather upper, fur lining, and restrained embossed square-line decoration.
- [Met: Classical Greek bronze greave](https://www.metmuseum.org/art/collection/search/247494) — hammered anatomical shin shell with small lining holes around the edge.
- [British Museum: Etruscan bronze belt-buckle](https://www.britishmuseum.org/collection/object/G_1977-0214-2) — pre-AD long horizontal belt fitting.
- [British Museum: Late Roman belt-buckle](https://www.britishmuseum.org/collection/object/H_1849-1127-2) — cast buckle plate and belt-attachment studs.
- [British Museum: fifth-century Late Roman belt-buckle](https://www.britishmuseum.org/collection/object/H_1865-0518-3) — hinged plate, loop, tongue, and attachment rivets.

## Generation cautions for the later phase

- Render every mitt, cuff, bracer, shoe, boot, and greave as a pair unless the family is explicitly a single wristguard or one-arm manica.
- Empty objects only: no hands, fingers, feet, toes, mannequin limbs, or body fragments.
- The only glove-like base retained is a materially continuous hide mitten with a separate thumb volume and doubled palm. Bracers remain forearm-only; manicae remain complete arm sleeves.
- Metal hand-slot protection must be a contiguous wristguard, sheet forearm shell, or fully backed bracer/manica. Never add hard pieces to a soft glove body or articulate plates over knuckles/fingers.
- Footwear must show hand-cut gathered, wrapped, laced, woven, or felt construction. Ban welted soles, molded rubber-like bottoms, raised modern heels, zippers, modern eyelets, and machine-perfect stitching.
- Every greave, splint-shin, or scale-shin concept must include complete visible shoes, boots, or sandals and full sole silhouettes.
- Belts stay shallow landscape bands with fastening unseen. Ban prompted buckles, hooks, toggles, keepers, pegs, ring clusters, apron strips, tassels, chains, dangling pouches, trophy clutter, gem centers, sun disks, rosettes, and radial spokes.
- Keep roughly 72% motif-free overall and still plainer at Tier 1. Any allocated decoration stays in one bounded edge, inset, or plate field with most of the surface plain.

## Production-schema resolution

- All 50 rows now declare provenance: 41 use `new_generation`, while nine preserve exact canonical `items_post_calib_batch[index]:filename` mappings.
- Runtime collisions were resolved as distinct bases: `Bronze Lamellar Guards`, `Hammered Bronze Vambraces`, and `Meteor-Plate Warbelt`.
