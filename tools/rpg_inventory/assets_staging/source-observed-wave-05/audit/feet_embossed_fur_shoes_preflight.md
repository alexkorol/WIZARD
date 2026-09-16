# Wave 05 source audit — `feet_embossed_fur_shoes`

Generation status: **DO NOT GENERATE**

## Verdict

**HOLD pending a defensible paired reconstruction and complete visual
construction source.**

British Museum EA21727 directly documents a fur-lined leather shoe with a
separate sole and an embossed square-and-line upper. Those material and
decoration claims are genuine. It does **not** document a pair: the catalogue
specifically identifies one shoe for the **right foot**. That shoe is incomplete
and fragmentary, with its upper detached and broken into several pieces.

The row requests a complete empty pair with rounded uppers, intact openings,
flat soles, and matching vamp fields. Producing that pair now would require
reconstructing the damaged right upper and then mirroring it into an unsupported
left mate. No exact public object photograph, mate, same-type pair, pattern
drawing, or museum reconstruction was found during this audit. The pair rule
therefore blocks generation even though the historical material concept is
promising.

This is an audit-only hold. No prompt was authored and no image was generated.

## Exact official source

- British Museum object:
  <https://www.britishmuseum.org/collection/object/Y_EA21727>
- Object type: shoe
- Museum number / BM big number: `EA21727`
- Registration number: `1888,0514.15`
- Department: Egypt and Sudan
- Findspot: Akhmim
- Culture/period: **Graeco-Roman (?)**
- Materials: **leather; fur**
- Technique: **embossed**
- Dimensions: 18 cm long, 8.10 cm wide, 1.40 cm high; 33 g
- Condition: fair; **incomplete and fragmentary**
- Acquisition: donated by Rev. Greville John Chester in 1888
- Local catalogue snapshot:
  `references/british_museum_EA21727_catalogue_snapshot.md`

The catalogue description establishes:

- one shoe for the **right foot**;
- a leather upper and leather sole;
- a fur lining;
- an upper embossed with a design of squares and lines;
- the upper is now detached and broken into several pieces.

The current BM collection page exposes no downloadable object photograph in
its static record, and a British Museum Images search for `EA21727` returned no
results. Browser inspection of hidden JavaScript media was attempted but no
browser connection was available. Consequently, there is no local official
object view to inspect or cite. The absence of a view is a source limitation,
not permission to invent the missing construction.

## Fur-lining verification

**PASS.**

Fur lining is not inferred from a fuzzy edge or burial residue:

- the BM catalogue lists `fur` as a material and says the leather is lined with
  fur;
- the ICOM-CC Leather 2019 proceedings describe EA21727 as a leather slipper
  with fur lining from the Greco-Roman period;
- that study publishes an SEM image of hair from EA21727 and discusses fungal
  obscuration of its hair cuticles.

Technical publication:
<https://orfeo.belnet.be/bitstream/handle/internal/9686/1_Leather%202019_ICOM%20CC.pdf?isAllowed=y&sequence=1>

The SEM is material confirmation only. It does not establish the complete shoe
shape, pile length, collar treatment, fur color, or appearance of an intact
active-service lining.

## Date gate

**Qualified PASS for ancient-period eligibility; exact date unresolved.**

The museum assigns only **Graeco-Roman (?)** and gives no production-year
range. The question mark must be retained. The record supports an ancient or
Late Antique Egyptian context broadly enough for the project ceiling, but it
does not justify a precise century, dynasty, or claim that the shoe is Roman
military footwear.

If chronology materially affects the ladder, obtain the museum's more specific
dating rationale or a publication that dates this exact object before release.

## Observed versus unverified construction

### Direct catalogue locks

- right-foot topology;
- leather sole;
- leather upper;
- fur lining between the leather and foot space;
- embossed square-and-line decoration on the upper;
- low physical height of 1.40 cm in its current flattened state;
- incomplete, detached, multi-fragment upper.

### Not visually verified

- rounded toe/vamp profile;
- closed heel and complete collar/opening;
- exact throat cut and foot-entry shape;
- seam map joining upper to sole;
- number, placement, and direction of seams;
- sole thickness, layering, tread, edge binding, and flexibility;
- whether the fur lines the whole shoe or only selected fields;
- intact pile length and how much fur was visible at the opening;
- exact dimensions and placement of the square-line embossed field;
- whether the pattern spans only the vamp or continues onto quarters;
- fastening method, if any;
- left-shoe geometry or evidence that a matched left shoe existed.

The row's “complete rounded uppers,” “flat soles,” “fur visible only at the
openings,” and “one field across each vamp” are plausible design choices, but
they are not inspectable facts from the accessible exact source.

## Paired-item strategy

**Fail in current form.**

The runtime footwear slot requires a pair, while the source is one damaged
right shoe. Simple horizontal mirroring is not acceptable:

- it falsely turns one accessioned object into a preserved pair;
- it repeats every break, asymmetry, emboss irregularity, and wear mark;
- it may copy right-foot-specific sole/upper shaping incorrectly;
- perfect bilateral duplication conflicts with hand-made ancient manufacture.

A defensible pair strategy would require one of:

1. the actual left mate to EA21727;
2. a complete left/right pair from the same documented Akhmim construction
   type;
3. a museum or specialist reconstruction with a published pattern showing how
   a left shoe is cut and assembled;
4. two independently preserved shoes close enough in date, place, materials,
   closure, sole, and embossed layout to support a cautious matched-pair
   restoration.

Even then, the generated pair should be near-matched rather than cloned:
corresponding construction, small hand-made variation, and no mirrored damage.

## `S` / `2x2` framing

The concept can be legible in **S / 2x2** after the source hold is resolved:

- show one complete empty pair on a grounded shallow diagonal;
- lead shoe in three-quarter top view, mate offset behind it;
- both toes, heels, openings, and full sole outlines remain visible;
- enough elevated view to show inward fur without exposing anatomy;
- embossing reduced to one broad readable square-line field per shoe;
- pair fills the square while retaining safe margin on every edge.

Gravity must remain credible:

- both shoes rest naturally rather than hovering toe-up;
- soles stay below the uppers;
- empty soft leather may slump slightly but cannot preserve invisible feet;
- any ties must lie against the shoes or ground naturally;
- no rigid floating laces, spiral calf wraps, or straps held aloft by absent
  anatomy.

The source's 18 cm length supports ordinary low shoes, not tall boots or
oversized armored footwear.

## Strict footwear dedupe

Visual audit sheets inspected:

- `assets_staging/source-observed-wave-03/audit/footwear_existing_staged_contact.jpg`
- `assets_staging/source-observed-wave-03/audit/footwear_postcalib_contact.jpg`

The sheets cover current/staged footwear, every footwear-classified
post-calibration item, and the promoted/rejected pool. Current targets and
supply mappings were checked separately.

### Closest overlaps

- Post-calibration row 152 /
  `ChatGPT Image Jul 13, 2026, 11_24_38 PM (10).png` is a pair of low closed
  brown leather lace shoes. It occupies nearly the same low-shoe silhouette but
  was correctly rejected for developed lasted construction, built sole/heel,
  and modern-looking standardized paneling.
- `feet_hobnail_low_shoes` plans another pair of closed low leather shoes. Its
  cut-openwork upper and visibly hobnailed heavy sole can distinguish it, but
  both rows depend on the same low-shoe macro.
- `feet_wrapped_hide_shoes` is mapped to promoted row 19, a complete pair of
  wrapped-hide ankle shoes. Its broad wraps and gathered construction remain
  distinct from a low embossed slipper.
- Current `boots_fur.png` is already a fur-collared brown leather pair, but it
  is a tall modern-laced/built-sole boot silhouette. It is not suitable exact
  reuse; it does mean fur alone cannot carry the new row's identity.
- `feet_fur_footbags` and `feet_grass_net_shoes` already reserve bulky
  insulation-led organic footwear. The candidate must remain a refined low
  leather shoe whose shallow embossed field, not a huge fur cuff, carries its
  distinction.

### Distinct neighbors

- `sandals_hide.png`, `sandals_quilted.png`, promoted row 173 /
  `feet_rawhide_cage_sandals`, and the planned bark, caliga, and closed-heel
  sandal rows are visibly open footwear with exposed sole/strap architecture.
- High riding boots, greave-shoe combinations, splint boots, and calf footbags
  occupy tall vertical silhouettes and should not influence this low shoe.

No exact reusable embossed fur-lined low-shoe pair was found. The concept could
clear the roster gate if its documented pair construction is supplied and the
embossed upper remains legible. The present hold is source completeness, not
an exact pixel duplicate.

## Active-service restoration limits

A future reconstruction may:

- restore flexible healthy brown leather;
- restore inward fur with a short, practical, compressed pile;
- use light handling polish, shallow flex creases, sparse scuffs, and mild edge
  wear;
- reconstruct the detached upper only from documented same-type seam and
  pattern evidence;
- retain hand-made variation between the two shoes.

It may not:

- copy desiccation, flattened mounting, torn detached pieces, cracks, missing
  leather, salt, dirt, fungus, dark rot, or burial staining;
- inflate the fur into a modern plush cuff, shearling fashion slipper, or
  winter boot;
- add a raised heel, stacked heel block, modern welt, molded sole, rubber tread,
  toe spring, stiff counter, machine stitching, eyelets, zipper, elastic, or
  retail polish;
- make the pair factory-identical or mirror all surface marks;
- add buckles, rings, studs, metal trim, tassels, floating laces, or rigid ties.

## Embossed-field limits

The catalogue supports squares and lines, but no accessible official image
establishes the exact composition. Until a view is obtained:

- do not invent a dense checkerboard, maze, meander, lattice, cross, rosette,
  sun, star, text, or pseudo-hieroglyphic panel;
- do not claim the field is centered on the vamp;
- do not repeat a speculative pattern identically across both shoes;
- do not enlarge tiny embossing into armored plates, quilting, studs, cutouts,
  or a modern branded toe cap.

If a future exact view shows the pattern, translate only its broad
non-symbolic square/line rhythm at icon scale. Do not copy damage or force every
small line to survive.

## Failure hazards

- **False pair:** one right shoe mirrored and presented as two preserved
  objects.
- **Damage mirroring:** identical tears, stains, broken edges, and wear on both
  shoes.
- **Unsupported completion:** missing upper, heel, collar, seams, and left shoe
  invented from generic modern loafers.
- **Modern low shoe:** developed last, welt, heel block, toe cap, quarters,
  tongue, eyelets, or lace system.
- **Gravity failure:** shoes or ties hover; empty uppers retain invisible feet;
  calf wraps rise around absent legs.
- **Anatomy:** feet, toes, ankles, socks, legs, skin, foot-shaped flesh filler,
  or mannequin forms inside openings.
- **Fur drift:** external shag covering the upper, plush ankle cuff, animal
  paws, claws, or taxidermy hide.
- **Pattern drift:** squares/lines become symbols, text, solar/radial ornament,
  metal plaques, or modern emboss branding.
- **Category collapse:** open toe converts the shoe into a sandal; tall collar
  converts it into a boot; missing heel converts it into a mule.
- **Bad sole:** raised/stacked heel, modern welt, rubber tread, molded outsole,
  or sole floating away from the upper.
- **Archaeology finish:** copied desiccation, fragmentation, black rot, fungal
  residue, cracks, dirt, or museum mounting.
- **Bad framing:** one shoe only, cropped pair, overlapping until one shoe
  disappears, flat top-down display, lineup sheet, ruler, label, or box.

## Release condition

Do not generate `feet_embossed_fur_shoes` from EA21727 alone.

Release requires:

1. a complete visual source for EA21727 or a documented same-type shoe that
   locks toe, heel, opening, seams, sole, lining placement, and embossed field;
2. a defensible left/right pair strategy from a real mate, same-type pair, or
   specialist pattern reconstruction;
3. a pair composition with no mirrored damage and no invisible anatomy;
4. icon-scale proof that the embossed low-shoe macro remains distinct from
   `feet_hobnail_low_shoes`, the promoted wrapped shoes, fur footbags, and the
   current sandal/boot pool.
