# Wave 05 preflight: `body_cuirass_heroic`

Date: 2026-07-24 PDT  
Generation status: **not generated**

## Decision

**PASS for prompt lock, with the construction and finish locks below.**

Met object 256134 / accession 1992.180.3a, b is the exact object claimed by
this row: a Greek Apulian bronze muscle cuirass dated to the fourth century
BCE. The official record and both official images support an empty prestige
torso defense made as separate modeled front and back shells. The side hinges,
shoulder attachment points, sculpted male-torso relief, and short flared lower
edges are visible or explicitly documented.

The row earns a T4 body-cuirass slot. No accepted current asset or promotable
download duplicates this complete, source-specific two-shell anatomical
construction. The falsely linked T3 bell-cuirass row was separately rejected
and must not be generated from this source.

## Exact official source

- Met record:
  <https://www.metmuseum.org/art/collection/search/256134>
- Title: *Bronze cuirass (body armor)*
- Object ID: 256134
- Accession: 1992.180.3a, b
- Culture: Greek, Apulian
- Period/date: Classical, fourth century BCE
- Medium: bronze
- Dimensions: front 49.8 cm high; back 51 cm high

The Met describes the front and back plates as modeled renderings of the male
torso. Its official audio record states that the two shells are hinged at the
sides and that shoulder rings were laced and tied with leather. The source is
therefore both chronologically and mechanically exact.

## Local official references

Both files are exact Met Open Access originals already downloaded for Wave 05.

| Local file | Role | Dimensions | SHA-256 |
|---|---|---:|---|
| `references/met_256134_DP102285_apulian_muscle_cuirass_primary.jpg` | **Primary silhouette/material reference:** front shell, sculpted pectorals and abdomen, short lower flare, shoulder and side join points | 1779x1779 | `C1A682DE1D7891570AD5F64562F73D3832D821FABE2B5F443981A50D9DEFA17A` |
| `references/met_256134_DP-44280-001_apulian_muscle_cuirass_reverse.jpg` | **Required structural reference:** rear shell, modeled back anatomy, corresponding side hinges and shoulder attachment points | 2953x4000 | `E5E4FF3C76F48C1263890BC8DC7702F7B2150D548E403824D0AABD85C30FA52A` |

Use both images together. The front image alone is insufficient because it can
encourage a facade breastplate with no rear shell.

## Current-description audit

Current release description:

> Empty fourth-century-BCE prestige muscle cuirass with separate modeled front
> and back bronze shells, compact shoulders, and short plain hip flange; value
> comes from hammerwork, not jewels, scenes, or added plates.

Clause-by-clause result:

- **Empty:** supported and required for isolated inventory art.
- **Fourth-century BCE / Greek Apulian:** exact official metadata.
- **Prestige muscle cuirass:** supported by the sculptural anatomical
  treatment and elite panoply context.
- **Separate modeled front and back bronze shells:** exact.
- **Compact shoulders:** fair visual shorthand for the narrow shoulder tabs;
  do not turn it into detached pauldrons.
- **Short plain hip flange:** visually supported as the integral outward lower
  edge of each shell; it is not a separate fauld or skirt.
- **Exceptional hammerwork:** reasonable construction/readability direction
  for the modeled bronze planes.
- **No jewels, scenes, or added plates:** source-faithful negative control.

The description does not invent a belt, lower garment, lining, gorget,
pauldrons, jewels, narrative engraving, or auxiliary plates. It is materially
and structurally sound.

Two details should be carried into the locked prompt even though the compact
row description omits them: paired side hinges and simple shoulder-ring
lacing. These are structural, not ornamental.

## Decoration boundary

The object's identity comes from sculpted bronze volume, not added decoration:

- strongly modeled pectorals, abdomen, navel, back, and waist;
- broad uninterrupted bronze fields remain dominant;
- small nipple/navel bosses are part of the anatomical relief, not separate
  applied ornaments;
- any faint incised lines remain subordinate and source-bounded;
- no large narrative scene, celestial emblem, gem setting, medallion, applied
  plate, filigree, fringe, or jewelry.

Do not interpret "heroic" as permission for fantasy regalia. Preserve the
specific sober Apulian shell.

## Active-service finish

The museum images are construction authorities only. They show burial patina,
surface loss, edge deformation, and conservation display conditions that must
not be copied.

Required finish translation:

- healthy warm bronze with natural alloy variation;
- restrained hammer undulation and shallow tool marks;
- localized handling polish and small active-use scratches;
- mild tarnish only in recesses and around hinges;
- no green crust, red burial accretions, pitting, cracks, missing edges,
  warped shoulder tips, stand, museum floor, cast shadow, or inventory number.

The finish may restore the intact working object but may not redesign its
shells or add modern completion.

## Game-roster gate

**PASS.**

- Strong, immediately readable ARPG body-armor silhouette.
- Mechanically meaningful complete torso defense, not costume clutter.
- Distinct ladder role: T4 prestige sculptural bronze after plainer T3
  sheet-bronze armor and before T5 dark meteoritic sheet armor.
- Recognizable at icon scale through the pectoral/abdominal modeling and short
  integral lower flare.
- Appropriate portrait `P` generator canvas and `2x3` runtime footprint.
- Enough visual mass for body armor without adding skirt length or shoulder
  bulk.

## Prior-art and manifest dedupe

The audit reviewed current composed assets, all body-related staging/Wave art,
the post-calibration body classifications, the multi-context
`01__body_armor.png` outputs, body-family supply maps, `review_reuse` /
`promote` mappings, and the active/draft manifests.

Saved visual comparison:

- `audit/body_cuirass_heroic_prior_art_contact.jpg`

Broader body-family contacts retained from the paired bell audit:

- `audit/body_cuirass_bronze_bell_prior_art_01.jpg`
- `audit/body_cuirass_bronze_bell_prior_art_02.jpg`
- `audit/body_cuirass_bronze_bell_postcalib_contact.jpg`

Findings:

- Existing accepted `wrap_bronzescale`, `wrap_studded`, hide, quilted, and
  lamellar body assets use flexible backing, scales, studs, or plate rows.
  None is a two-shell sculpted muscle cuirass.
- Balanced download outputs supply pectoral, lamellar, scale, and skirted
  panoply families, not the Met shell construction.
- The closest anatomical post-calibration outputs are already rejected:
  jeweled/fantasy breast shaping, medallions, belts, skirts, oversized shoulder
  pieces, later plate language, or mixed outfits make them unusable and
  visually different.
- Met 248133 is a neighboring but distinct T3 Hallstatt bell family: cylindrical
  bell mass, knob-and-dot surface program, deep waist, and continuous flared
  rim rather than naturalistic sculptural anatomy.
- `body_cuirass_skymetal_sheet` is also distinct: severe angular dark sheet,
  cylindrical rib cage, and stepped hip edge rather than bronze human-form
  modeling.
- The only manifest collision is the erroneous
  `body_cuirass_bronze_bell` citation to the same Met object. Its Wave 05 audit
  verdict is **REJECT / DO NOT GENERATE**. The heroic row is the correct owner
  of Met 256134; the bell row must be retired or re-sourced before any wider
  manifest dispatch.
- No existing usable art should be reused in place of this row.

## Construction locks

1. One complete empty cuirass, shown as one assembled wearable object.
2. Two distinct thin hammered-bronze shells: fully modeled front and fully
   modeled back, with corresponding depth and edges.
3. Paired side hinges must remain legible in the three-quarter view; no
   one-sided or invented closure.
4. Shoulder tabs/rings use simple short leather lacing or ties consistent with
   the Met record. No buckles, clasps, modern rivets, or detached pauldrons.
5. Naturalistic but restrained male-torso relief on both shells: pectorals,
   abdominal planes, navel, back muscles, and waist are bronze surface
   modeling, not flesh.
6. Integral short outward hip edge only. No belt, fauld, pteruges, tassets,
   skirt, apron, loincloth, trousers, or lower-body assembly.
7. Broad bronze planes and modeled volume remain dominant; no added plaques,
   jewels, emblem, scenes, celestial/radial motifs, or all-over incised field.
8. Complete dynamic three-quarter product view showing the front, one side
   hinge line, rear-shell edge/depth, both shoulders, and full lower flange.
9. Portrait `P` framing for a `2x3` slot, uncropped with generous safe margins.
10. Healthy active-service bronze; museum corrosion and damage are excluded.

## Later-breastplate firewall

The source predates medieval and Renaissance plate harness. Suppress later
completion:

- no separate gorget or articulated neck defense;
- no pauldrons, spaulders, besagews, lance rest, vambrace integration, or
  articulated arm harness;
- no peascod belly, narrow corset waist, central keel, Gothic fluting, rolled
  modern armhole trim, or machine-perfect breastplate symmetry;
- no separate fauld lames, tassets, codpiece, skirt plates, or plate culet;
- no steel polish, blackened plate, gilded trim, heraldry, buckles, or modern
  leather harness;
- no female fantasy brassiere segmentation or gemmed bust cups.

The correct read is an ancient hammered bronze torso sculpture split into two
functional shells.

## Failure taxonomy and hazards

- **Facade failure:** front breastplate only, no back shell or join proof.
- **One-piece failure:** seamless cast tank top rather than two opposed shells.
- **Join failure:** missing/mismatched side hinges, floating rear plate,
  one-sided shoulder attachment, or invented buckles.
- **Anatomy contamination:** flesh, nipples/skin coloration, mannequin,
  undershirt, arms, or body inside the object.
- **Anatomy loss:** generic smooth bronze vest with no sculpted torso identity.
- **Fantasy-female drift:** separated bust cups, corset seams, gemmed breast
  plates, dangling ornament, or bare-midriff shaping.
- **Medieval/Renaissance drift:** gorget, pauldrons, peascod, fauld, tassets,
  Gothic fluting, heraldry, or plate-harness articulation.
- **Lower-garment contamination:** belt, skirt, pteruges, apron, trousers, or
  hanging panels.
- **Ornament drift:** solar bosses, rosettes, medallions, scenes, jewels,
  filigree, added plates, or dense border engraving.
- **Finish failure:** green archaeological crust, burial staining, pitting,
  cracks, missing metal, museum stand, or over-polished collector brass.
- **Construction regularity:** machine-perfect edges, identical modern
  fasteners, seamless molded compound curves, or chrome-like surface.
- **Framing failure:** square composition, cropped shoulder/lower flange,
  straight-on museum view, tiny occupancy, cast shadow, floor, or background
  gradient.

## Release condition

This row may advance only after the rejected bell row is excluded from the
same-source dispatch and the locked prompt carries both official Met views plus
the joins, active-service finish, lower-garment firewall, and later-breastplate
firewall above.

With those conditions: **PASS**.
