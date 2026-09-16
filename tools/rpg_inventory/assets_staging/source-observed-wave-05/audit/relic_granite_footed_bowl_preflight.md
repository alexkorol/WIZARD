# Wave 05 source audit — `relic_granite_footed_bowl`

Generation status: **DO NOT GENERATE**

## Verdict

**REJECT as authored.**

Met 327125 is an excellent exact source for a small Neolithic granite vessel,
but it does not show the requested “single broad integral pedestal foot.” The
only official view shows a tall cylindrical basin narrowing toward a set of
short separated feet. Two feet and the open gap between them are plainly
visible from the front; the single view does not establish the hidden total.

Correcting the row to the observed multi-foot geometry also fails the current
ARPG relic/offhand roster gate. The Met calls it only a footed bowl, publishes
no ritual or offering function, and gives a height of 9.73 cm. At icon scale it
is a plain small stone cup/bowl on low feet, closely overlapping the planned
stone offering bowl, the planned two-foot clay offering bowl, the existing
footed bronze offering bowl, and the broader vessel/mortar pool. Material color
alone is not enough to earn another 2x2 relic slot.

This is an audit-only rejection. No prompt was authored and no image was
generated.

## Exact official source

- Metropolitan Museum of Art object:
  <https://www.metmuseum.org/art/collection/search/327125>
- Title: **Footed bowl**
- Object name: Bowl
- Object number: `1985.356.20`
- Period: Neolithic
- Date: **ca. late 8th millennium BCE**
- Geography: Syria
- Medium: **Granite**
- Height: **9.73 cm (3.83 in.)**
- Credit line: Gift of Sheldon and Barbara Breitbart, 1985
- Public Domain official image:
  <https://images.metmuseum.org/CRDImages/an/original/vs1985_356_20.jpg>
- Official Open Access API:
  <https://collectionapi.metmuseum.org/public/collection/v1/objects/327125>

Local official references:

- `references/met_327125_vs1985_356_20_granite_footed_bowl.jpg`
  - current full-resolution Met primary image
  - 734x719 RGB; 124,557 bytes
  - SHA-256
    `970fc605ddc09206b48420d2380cf92a783d08cbdf94bb2e069592056c1aaeea`
- `references/met_327125_api.json`
  - exact current catalogue/API metadata snapshot
  - 1,498 bytes
  - SHA-256
    `8ee515eaaad458c740a4f8a00c4fede648c949915985a45fdc5057c1e2f9ea07`

The API lists no additional images. The one near-front view is sufficient to
reject a continuous pedestal, but not sufficient to establish whether the
vessel originally has three, four, or another number of short feet around its
hidden circumference.

## Source roles and observed construction

### Primary material and date role

- **Date: PASS.** The late eighth millennium BCE is securely Neolithic and
  comfortably inside the project ceiling.
- **Material: PASS.** The museum explicitly catalogs granite.
- The official photograph shows strongly mottled pale gray stone with dense
  dark mineral speckling. It must remain stone, not ceramic, plaster, marble,
  metal, or painted resin.

### Direct visual construction locks

The official image directly shows:

- one deep, high-sided, approximately cylindrical basin;
- a thick rounded/everted continuous rim;
- a visible empty interior with a broad round mouth;
- walls that are nearly vertical through most of the body;
- a softly rounded lower body that contracts toward the underside;
- at least two short blunt feet visible at the front;
- a real open gap between the visible feet;
- plain surfaces with no handles, spout, lid, metal fittings, contents,
  inscription, relief, or applied ornament;
- one continuous granite material family.

The image does **not** show:

- a single broad pedestal, stem, ring foot, or continuous flared base;
- an underside join or separately attached base;
- the hidden rear feet or a complete count;
- a pouring lip, lug, handle, socket, perforation, lid seat, or fitted cover;
- evidence of a ritual, offering, incense, grinding, or offhand function.

The source is consistent with a vessel carved as one stone object, but the
single view does not prove whether the feet and basin are integral or whether
the underside was repaired. Do not describe an “integral pedestal” or invent
joinery that is not visible.

## Pedestal / foot test

**Fail.**

The row’s “single broad integral pedestal foot” is not a conservative
restoration. It replaces the source-observed separated feet and central gap
with a different base topology. The current image cannot support a pedestal
silhouette, and the missing rear view prevents a precise multi-foot
reconstruction.

An exact-source revision would have to say “short separated feet” and either:

1. obtain a museum-authorized rear/underside view that establishes the complete
   count and attachment; or
2. keep the far-side structure visually occluded without claiming a count.

Neither option solves the roster duplication described below.

## Active-service restoration limits

A source-faithful active-service treatment may:

- recover crisp but hand-softened rim and foot edges;
- keep the natural pale/dark granite grain strongly visible;
- show light handling polish inside the basin;
- retain sparse shallow scratches and small edge wear;
- remove photographic dust, burial dirt, deep abrasion, breaks, and
  conservation artifacts.

It may not:

- polish the object into glossy modern countertop stone;
- regularize the body and feet into lathe-perfect symmetry;
- turn mineral speckling into painted dots, runes, stars, or magical motes;
- copy cracks, missing chips, deep pits, burial staining, or unstable damage;
- add repaired metal staples, gold kintsugi, trim, bands, rivets, or a separate
  pedestal.

The rim may show mild use wear, but “worn rim” cannot become the primary
surface story for active-service gear.

## ARPG relic/offhand and `S` / `2x2` gate

**Fail.**

The vessel can be framed legibly on an S canvas:

- a slightly elevated three-quarter view would expose the round basin and at
  least two separated feet;
- the full rim, body, feet, and empty dark interior could fit uncropped;
- mottled granite can read at inventory scale if simplified into a few broad
  mineral fields.

However, physical and gameplay identity are weak:

- the museum height is only 9.73 cm, closer to a small cup/bowl or palm-sized
  mortar than a substantial 2x2 relic;
- the catalogue supplies no ritual, offering, ceremonial, or offhand use;
- at 64 px the low feet become tiny bumps beneath a generic cylindrical cup;
- the distinctive granite speckle becomes texture, not silhouette;
- exaggerating the feet, depth, or scale to force a 2x2 relic read would
  depart from the source.

A visually accurate icon would be readable as **tableware/vessel**, but not
distinctive enough as a separate relic base.

## Strict prior-art and roster dedupe

Current assets, Wave 04 accepted outputs, balanced reuse, post-calibration
promotions, `targets-600.tsv`, expansion-ready rows, and supply mappings were
checked for bowls, ladles, pyxides, censers, palettes, mortars, and vessels.

### Closest collisions

- `assets/bowl_bronze_offering.png` is already a substantial deep bowl on a
  broad foot. Its paired loop handles and bronze material differ, but in
  compact silhouette it already owns the high bowl-on-base read.
- `focus_stone_bowl` plans a one-piece deep stone offering bowl with a low foot
  and pouring lip. Removing the lip leaves almost exactly the candidate’s
  generic stone bowl macro.
- `relic_clay_offering_bowl` plans an open bowl on paired integral feet. Once
  this row is corrected away from the false pedestal, both are open bowls whose
  gameplay distinction is chiefly material and foot count.
- `focus_bronze_censer` is already mapped to balanced
  `faction_dustwind - Misc/02__ritual.png`: a footed bowl-shaped vessel with a
  fitted pierced lid. The lid/perforations give it stronger rite identity.
- promoted post-calibration row 123 /
  `ChatGPT Image Jul 12, 2026, 11_12_54 PM (5).png` is assigned to
  `preparation_root_mortar`. Its paired pestle supplies a functional identity
  the plain granite bowl lacks.

### Distinct but crowding neighbors

- accepted Wave 04 `focus_copper_ladle_clean.png` has a deep bowl, short open
  trough spout, and high returning strap handle. It is clearly an implement,
  not generic tableware.
- accepted Wave 04 `relic_stone_pyxis_clean.png` is a squat lidded stone
  container with pierced lugs and a closed storage function. Its high
  cylindrical stone body is a close material/volume neighbor, while its lid
  gives it a stronger macro.
- `relic_stone_pyxis`, `relic_earthenware_ampulla`, `relic_copper_ewer`,
  `relic_bronze_censer`, `relic_amber_spouted_bowl`, and
  `relic_skymetal_longspout` already span closed, handled, suspended, spouted,
  and long-spouted vessel silhouettes.
- `focus_bronze_phiale` is a shallow omphalos dish, and
  `focus_obsidian_lug_bowl` is a broad oval vessel with four prominent lugs.
  Both retain stronger functional silhouettes than the granite cup.
- `relic_jade_palette` is a long flat rhomboid grinding slab with a central
  depression, so it is not a direct duplicate.
- `relic_stone_pyxis`, the mortar, ladle, palette, and censer are not reasons to
  misdescribe this source; together they show that the roster already rewards
  vessels with lids, handles, spouts, grinding partners, or strong planar
  profiles.

No exact pixel duplicate of Met 327125 was found. The rejection is a
construction mismatch plus a crowded generic macro, not a duplicate filename.

## Failure hazards

- **False pedestal:** separated feet fused into one broad pedestal or ring foot.
- **Invented foot count:** unseen rear geometry guessed as tripod, quadruped,
  paired feet, or full ring.
- **Generic tableware:** plain stone cup enlarged and mislabeled as a ritual
  relic without source evidence.
- **Scale inflation:** 9.73 cm vessel exaggerated into a large altar basin or
  cauldron to justify 2x2.
- **Mortar drift:** thickened basin plus pestle, ingredients, powder, or grinding
  wear added to create function.
- **Censer drift:** holes, lid, chains, smoke, soot, fire, charcoal, or tripod
  legs added.
- **Pyxis drift:** fitted lid, knob, hinge, latch, pierced lugs, or closed box
  body added.
- **Libation drift:** handle, pouring lip, spout, omphalos, or contents added.
- **Prestige completion:** bronze/gold rim, metal foot, gems, inlay, symbols,
  sacred text, solar motif, or decorative bands.
- **Archaeology finish:** cracks, missing chips, deep pitting, dirt, chalky
  burial surface, monochrome museum-photo treatment, stand, or label copied.
- **Modern finish:** granite countertop gloss, lathe-perfect cylinder, molded
  flowerpot, planter, sink, or contemporary pedestal bowl.
- **Bad framing:** top-down circle that hides feet, front-flat cup silhouette,
  cropped rim/feet, contents, hand, table, cast shadow, or multiple views.

## Disposition

Do not generate `relic_granite_footed_bowl` from Met 327125.

If this exact object is ever reconsidered as a small utility vessel rather than
a 2x2 relic, first obtain an official rear/underside view to lock the full foot
geometry. It must then clear a renewed dedupe against `focus_stone_bowl`,
`relic_clay_offering_bowl`, the accepted bronze offering bowl, and the promoted
mortar. Do not manufacture distinctiveness with a pedestal, handle, spout,
lid, contents, metal trim, symbolism, or ritual claim.
