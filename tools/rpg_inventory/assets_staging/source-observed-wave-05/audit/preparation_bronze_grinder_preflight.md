# Wave 05 preflight: `preparation_bronze_grinder`

## Decision

**REJECT as queued; do not generate or regenerate.**

British Museum 1977,0403.1 does not support the queued complete two-piece
item. It is the mortar component only. The museum explicitly says that its
curved rod/pestle is missing. Two official comparison photographs place the
mortar beside a separate pestle, British Museum 1999,0802.52; that comparison
piece is not documented as the original mate and is not shown nested in the
groove.

The family can be roster-worthy: a documented complete Romano-British
cosmetic-grinder set would have a distinctive longitudinal rocking action,
unlike the conventional deep mortar and pestle already mapped to
`preparation_root_mortar`. This accession cannot authorize that complete set.
Generating from it would require inventing the functional half, its curvature,
its fit, and the claimed tight nesting. Simplifying the surviving mortar into
"plain tool geometry" would also erase its defining bull and bird heads,
heart-like central loop, and cast decoration.

Failure taxonomy:

- **incomplete exact source:** the cited accession preserves only the mortar;
- **invented matching component:** no original pestle survives with the
  object;
- **false association:** 1999,0802.52 is a separate accession used for
  comparison, not evidence of a matched pair;
- **unsupported mechanical fit:** "nested tightly together" is not observed
  for this accession;
- **unsupported simplification:** the queued wording omits the elaborate
  zoomorphic terminals and central suspension loop;
- **small-icon ambiguity:** the 103 x 12 mm bowed component can read as a
  pendant, buckle, crescent ornament, or animal fitting at S 1x1;
- **roster collision if generalized:** a generic mortar-and-pestle rendering
  duplicates `preparation_root_mortar`;
- **boundary collision if widened:** a round vessel, flat grinding surface, or
  handled cup drifts into the bowl, palette, or ladle families.

No prompt was prepared and no image generation or regeneration was performed.

## Exact official source

- British Museum object: 1977,0403.1, object type **cosmetic-grinder**.
- Component identity: centre-looped **mortar component**; the corresponding
  curved rod is missing.
- Culture/date: Romano-British, 1st century AD probable (`1stC (?)` in the
  catalog), within the project ceiling.
- Findspot: Hockwold, Norfolk, in a garden backing onto a Roman site.
- Catalog material: copper alloy.
- XRF result: leaded bronze (Cu-Sn-Pb).
- Dimensions: length 103 mm, width 12 mm, weight 80.30 g.
- Object record:
  <https://www.britishmuseum.org/collection/object/H_1977-0403-1>
- Main image record:
  <https://www.britishmuseum.org/collection/image/33360001>

Downloaded official views:

- `references/british_museum_1977-0403-1_main.jpg`
  - role: exact accession, isolated mortar component;
  - 1000 x 641 JPEG, 38,380 bytes;
  - SHA-256
    `eb0bae76cac2523ec114284a6d7d5215e2ce933055b92264385aa28c69b3f172`.
- `references/british_museum_1977-0403-1_comparison_2.jpg`
  - role: exact mortar plus separate comparison pestle 1999,0802.52; generic
    family/mechanism evidence only;
  - 1000 x 726 JPEG, 62,019 bytes;
  - SHA-256
    `5efd8c2295df72f1e1859cd42b80aa1bbece77472250c996ec1004bd92bd558a`.
- `references/british_museum_1977-0403-1_comparison_4.jpg`
  - role: reverse comparison view of the same two separate accessions; not a
    matched or nested set;
  - 1000 x 751 JPEG, 68,714 bytes;
  - SHA-256
    `69b7e74f3ded621970c3a06d3e50385c6a1fab21e8eca7b523c19ee8ede241ee`.

Separate comparison record:
<https://www.britishmuseum.org/collection/object/H_1999-0802-52>.
Its catalog describes a centre-looped pestle component: a small crescentic,
twin-tapered rod with a duck on its loop. It is independent comparative
evidence, not the missing original half of 1977,0403.1.

## Observed construction and use

The exact mortar has:

- a strongly bowed longitudinal body;
- a deep V-section grinding groove, with a flattened basal wear facet;
- a large centre suspension loop whose lower outline is heart-like;
- one bovid/bull-head terminal with horns, eyes, and muzzle;
- one duck- or swan-head terminal with bill and eyes;
- cast and incuse triangular, hatched, and ribbed ornament;
- a dark-to-green archaeological bronze patina;
- no case, hinge, lid, glass, inscription, celestial emblem, modern cosmetic
  product, or extra kit parts.

The museum's functional account is mechanically coherent: a curved pestle/rod
would sit longitudinally in the mortar's V groove and rock along it. Material
between the pestle's convex lower face and the groove would be crushed and
sheared into pigment. The loops allowed the pieces to be carried on a cord.

What the source does **not** establish is the missing pestle's exact length,
curvature, terminal treatment, decorative match, registration as a set, or
resting/nested fit. The comparison images demonstrate how this artifact
family works, but their separate pestle must never be silently reassigned to
1977,0403.1.

## Grid and roster gate

- Queued generator canvas: **S**.
- Queued runtime footprint: **1x1**.
- Exact-source compatibility: **fails**.
- Family-level roster value: **conditional**, if replaced by a documented
  complete associated set.

At 103 mm long and only 12 mm wide, the exact surviving component is a
slender personal implement. At S 1x1, its animal heads, central loop, and
groove compete for very few pixels. The main silhouette reads more readily as
an ornamental pendant, zoomorphic fitting, buckle-like loop, or crescent than
as a preparation implement.

A genuinely complete set could earn a distinct Preparation slot if both
pieces were presented close together with the convex pestle visibly aligned
to the mortar's longitudinal groove. That relationship, not a generic bowl,
must carry the icon. This accession cannot supply it.

The British Museum record for 1976,0501.505 is a possible future
source-replacement lead because it explicitly catalogs both an end-looped
mortar and pestle and says that the pestle fits snugly in the groove:
<https://www.britishmuseum.org/collection/object/H_1976-0501-505>.
It has **not** been adopted or passed here; it needs its own exact-view,
chronology, geometry, and dedupe audit before use.

## Strict visual dedupe

Audit artifacts:

- `audit/preparation_bronze_grinder_source_overlap_contact.jpg`
- `audit/preparation_bronze_grinder_dedupe_01.jpg`
- `audit/preparation_bronze_grinder_dedupe_02.jpg`
- `audit/preparation_bronze_grinder_dedupe_rank.tsv`

The broad scan scored 927 current assets, staged outputs, calibration outputs,
balanced-output files, and reference-library images against grinder,
mortar/pestle, bowl/ladle/palette, and unrelated-item prompts. The ranked
contact sheets were inspected directly; the numerical rank is a discovery aid,
not an approval decision.

Material overlaps and boundaries:

- `preparation_root_mortar` already maps to
  `C:\Users\Alex\Downloads\items_post_calib_batch\ChatGPT Image Jul 12, 2026, 11_12_54 PM (5).png`.
  It is a large, ornate deep mortar with a separate thick pestle and already
  occupies the conventional crush-in-a-vessel silhouette. A genericized bronze
  grinder would duplicate it.
- `focus_copper_ladle` maps to
  `assets_staging/source-observed-wave-04/clean/focus_copper_ladle_clean.png`.
  Any enlarged round cup, side projection, pouring lip, or strap handle would
  drift into this family.
- `bowl_bronze_offering.png` occupies the open bronze bowl silhouette. The
  grinder must never become a footed, handled, or ceremonial vessel.
- `relic_jade_palette` is queued as a long flat rhomboid grinding surface with
  a shallow central depression. Flattening or widening the mortar into a slab
  would collide with that role.
- Existing pigment-content icons such as `woad.png`, `red_ochre.png`, and
  `blood_omen.png` include bowls, powders, or grinding implements. Adding
  visible pigment, loose mineral piles, applicators, or a preparation spread
  would move the icon from one coherent implement into ingredient-kit
  territory.

No exact prior art for a complete curved bronze rocking pair was found. That
absence does not cure the missing-source problem.

## Construction locks and hazards

If this row is revisited with a different, complete exact source:

- lock both pieces to the same documented associated set;
- lock the mortar to a longitudinal V groove and the pestle to a convex
  underside that demonstrably contacts it;
- show the pieces aligned close enough to explain rocking/shearing, without
  inventing a hinge or claiming nested storage unless the source proves it;
- keep the set palm-sized and slender, not a full-size kitchen mortar;
- preserve source-visible terminals, loops, asymmetry, wear, and decoration;
- do not erase zoomorphic construction to obtain "plain tool geometry";
- do not add a case, lid, compact, mirror, hinge, clasp, palette, bottle,
  brush, applicator, powder puff, lipstick, modern cosmetic, laboratory glass,
  inscription, gemstone, or extra kit part;
- do not add pigment heaps, loose ingredients, or a staged preparation spread;
- do not turn the bowed profile into a moon/crescent or add any solar,
  celestial, or radial emblem;
- do not convert the groove into a bowl, ladle cup, palette depression, or
  generic hand mortar;
- do not treat comparative pieces, character equipment, or nearby objects in
  a museum/group image as automatic item components;
- do not regenerate merely because an object family has a taxonomy row.

For 1977,0403.1 specifically, the only source-faithful standalone rendering
would be the ornate mortar component by itself. That object does not satisfy
the queued complete-set identity or the S 1x1 Preparation readability gate, so
it remains rejected.
