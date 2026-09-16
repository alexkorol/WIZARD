# Wave 05 source audit — `relic_earthenware_ampulla`

## Verdict

**REJECT for generation in its current roster row.**

The exact museum object is authentic, securely inside the project's date ceiling,
and does support the compact clay body, short cylindrical neck, open mouth, and
two pierced shoulders. However, its broad faces are not neutral: both sides are
dominated by molded half-length saint figures, with a cross-bearing book and
traces of inscription. Removing those defining reliefs leaves a generic tiny clay
flask whose only remaining icon-scale differentiator is the twin shoulder holes.
That does not earn a separate `1x1` relic base, especially because the current
roster already assigns this exact source to `relic_copper_ampulla` and separately
contains another pierced-shoulder clay ampulla (`reliquary_jade_ampulla`).

This is an audit-only rejection. No prompt was authored and no image was
generated.

## Exact source and source roles

- Object record: British Museum 1892,0613.49  
  https://www.britishmuseum.org/collection/object/H_1892-0613-49
- Catalogue facts:
  - object type: ampulla
  - culture/period: Early Byzantine
  - date: 6th century
  - material: clay
  - techniques: relief; pierced
  - dimensions: 68 mm high x 47 mm wide
  - production place: Lampsacus (?) 
  - description records an oval body, cylindrical neck, pierced shoulders,
    a bearded saint holding a book adorned with a cross on either side, and
    traces of an inscription
- Chronology gate: **PASS**. Sixth century is within the through-AD-600 ceiling.
- Shape/construction role: **primary exact source** for the flattened oval body,
  very short neck, thick rolled mouth, and two shoulder perforations.
- Material role: **primary exact source** for reddish-brown earthenware/clay.
- Surface/ornament role: **exclusion evidence only**. The sacred figurative relief,
  book/cross, and inscription cannot be copied or treated as neutral decoration.
- Lighting/finish role: **none**. The official photographs are black-and-white
  archaeological documentation, not a color or game-render finish reference.

## Local official references

- `references/british_museum_1892-0613-49_ampulla_front.jpg`
  - official BM asset `564855001`
  - 1978 x 2500
  - SHA-256:
    `132254ff88b2828af56bf6a6f18bdd9da46ee6fff6d4742d276306b16f2c5645`
  - direct source:
    https://media.britishmuseum.org/media/Repository/Documents/2014_10/10_14/d3f143a2_c914_4a19_b354_a3c000ed22d5/max_00564855_001.jpg
- `references/british_museum_1892-0613-49_ampulla_reverse.jpg`
  - official BM asset `564856001`
  - 2223 x 2500
  - SHA-256:
    `057adb0d26a66fd9f668a6327dc22cef1c71316b8b4232a77573d4f84b9953b6`
  - direct source:
    https://media.britishmuseum.org/media/Repository/Documents/2014_10/10_14/8a1db850_52ea_4cf6_837a_a3c000ed24bc/max_00564856_001.jpg
- `audit/relic_earthenware_ampulla_prior_art_contact.jpg`
  compares the official front/reverse against current assets, Wave 04's pyxis,
  the post-calibration flask/canteen, and two balanced-output container/ritual
  objects.

## Observed geometry and construction locks

If this source is ever reconsidered for a single surviving ampulla slot, lock:

- reddish-brown fired clay/earthenware, not copper, bronze, stone, or jade
- one compact hollow vessel, approximately 68:47 overall height-to-width
- distinctly flattened oval/egg body rather than a globular bottle
- very short, broad cylindrical neck with a thick rounded rim and visible open
  mouth
- two actual circular perforations through broad lateral shoulder ears
- slight three-quarter view so body thickness, mouth, and both holes remain clear
- complete lower edge/base
- no handles, applied metal loops, cap, stopper, cork, chain, bail, cord, tassel,
  side spout, foot, lid, gems, or inset

The two pierced shoulders are directly source-observed in the catalogue and both
official photographs. A surviving suspension cord, chain, or harness is **not**
shown. The object is suspension-ready; an actual suspension system is not
source-observed and should not be invented.

The molded relief is also constructionally source-observed on both faces. A
plain neutral face is therefore not an exact-source observation. Omitting sacred
imagery may be necessary for project policy, but replacing it with generic raised
geometry or pseudo-inscription would be an invented hybrid rather than a faithful
translation.

## `S` / `1x1` legibility

- The source silhouette can fit `1x1` with roughly 10–12% safe margin.
- The short neck, open mouth, flattened body, and paired shoulder holes are the
  only viable low-resolution read.
- At 64 px the holes must remain visibly open; a cord would obscure them and
  push the object toward pendant/canteen ambiguity.
- Once the face relief is removed, the broad oval body becomes quiet and generic.
  The result reads first as a potion bottle, canteen, or ordinary pottery flask,
  not as a distinct ARPG relic base.
- The post-calibration round flask/canteen already occupies the nearby closed
  round-vessel macro, while the accepted Wave 04 stone pyxis provides a stronger,
  functionally legible compact relic-container silhouette.

## Strict prior-art / roster dedupe

1. **Exact-source collision — decisive**
   - `targets-600.tsv:232` / `jewelry_relics.tsv:32`:
     `relic_earthenware_ampulla`
   - `targets-600.tsv:248` / `jewelry_relics.tsv:48`:
     `relic_copper_ampulla`
   - Both rows cite BM 1892,0613.49 and share the same flat twin-pierced flask
     macro. The copper material in the second row is not supported by this clay
     source. These cannot be defended as distinct bases.

2. **Ampulla-family collision**
   - `targets-600.tsv:295` / `auxiliary.tsv:45`:
     `reliquary_jade_ampulla`
   - It is another `1x1` flattened fired-clay, pierced-shoulder ampulla, sourced
     to BM 1876,1014.10. Its stopper and jade inset create detail differences, but
     the fundamental inventory silhouette is the same family.

3. **Existing/downloaded container proximity**
   - post-calibration triage row 124 is a complete round flask/canteen with an
     overhead handle, cap, and decorated body; it is not an exact duplicate but
     already covers the small closed-flask visual neighborhood
   - Wave 04 `relic_stone_pyxis` is a compact lidded relic container with a much
     clearer container-specific construction and stronger `1x1` identity
   - the balanced-output wood pyxis and tripod censer are not direct silhouette
     duplicates, but further reduce the need for an undifferentiated pottery
     container
   - current `relic_curio`, `curio_amber`, `curio_bone`, and
     `bowl_bronze_offering` are materially and structurally distinct

No exact image duplicate of the BM ampulla was found in current assets, staged
generated output, or the audited download candidates. The rejection is a roster
concept/source collision, not a pixel duplicate.

## Failure taxonomy

- **Exact-source contradiction:** requested “neutral plain face” is not what the
  cited object shows; both faces carry defining figural relief.
- **Unsupported material translation:** the duplicate copper row uses this clay
  object as its only stated source.
- **Macro duplicate:** two planned relic rows use the exact same source and
  flat twin-pierced silhouette.
- **Cross-slot family crowding:** a third planned `1x1` pierced-shoulder clay
  ampulla exists in the reliquary pool.
- **Icon-scale identity loss:** deleting the relief collapses the object into a
  generic small pottery flask.
- **Role ambiguity:** without its source-observed devotional face, the object
  reads as consumable/canteen clutter more readily than a concrete relic base.
- **Inference hazard:** holes support possible suspension, but no cord or chain is
  present; adding one would be unsupported and would obscure the useful holes.
- **Copy hazard:** retaining the source's saint, cross-bearing book, inscription,
  or close pseudo-equivalents would violate the neutral/no-sacred-copy constraint.

## Disposition

Do not generate `relic_earthenware_ampulla` from this row. Collapse the three
ampulla-family candidates to at most one roster slot, then source that survivor
from an exact ancient object whose nonfigurative geometry is itself distinctive
at `1x1`. Do not manufacture distinction through material swaps, decorative
insets, or invented suspension gear.
