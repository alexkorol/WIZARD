# Wave 05 source audit — `amulet_gold_keel_bulla`

## Verdict

**REJECT; do not generate.**

British Museum 2020,8005.1 passes the date, material, standalone-object,
complete-suspension, and pendant-only framing gates. It fails the current symbol
restriction: both faces, the suspension tube, and the lower edge carry dense
engraved geometry whose total effect the British Museum explicitly calls
solar. The decoration is the object's defining surface construction.

Removing that decoration would no longer be a faithful translation of the exact
source. At `S` / `1x1`, partial retention would tend to read as rays,
pseudo-script, or a generic magical emblem. A plain substitute would collapse
into the already saturated bulla/capsule roster and would overlap especially
with the planned gold bulla, copper D-bulla, and skymetal D-bulla.

This is an audit-only rejection. No prompt was authored and no image was
generated or regenerated.

## Exact source and gate results

- Exact record: British Museum `2020,8005.1`
  <https://www.britishmuseum.org/collection/object/H_2020-8005-1>
- Object: one hollow gold-sheet bulla-pendant
- Date: about 1000–800 BC, Late Bronze Age — **PASS**
- Material: composite gold sheet — **PASS**
- Object count: one standalone pendant — **PASS**
- Complete suspension: integral long false tube / loop survives — **PASS**
- Standalone status: not catalogued as one component of a necklace — **PASS**
- `S` / `1x1` silhouette: broad D-crescent and wedge/keel profile are readable —
  **PASS**
- Active-service conversion: possible without copying archaeological damage —
  **PASS**
- Symbol restriction: all-over decoration is explicitly solar in character —
  **FAIL**
- Strict dedupe after required symbol removal: plain result overlaps the planned
  bulla/capsule family — **FAIL**

The local exact-source record is
`references/british_museum_2020-8005-1_source_record.md`.

## Official views and their roles

- `references/british_museum_2020-8005-1_2018_T343_view_1.jpg`
  - complete first face
  - broad crescent / D outline
  - concentric curved bands and hatched triangular fields
  - both terminal collars and complete top suspension tube
- `references/british_museum_2020-8005-1_2018_T343_view_2.jpg`
  - complete reverse face
  - second arrangement of triangular fields and curved bands
  - complete lower edge and both tube ends

Both are isolated object studies on black. They show no cord, chain, wearer,
neighboring charm, or character equipment to extract.

## Construction locks

These are documentary locks only; the failed item is not cleared for a prompt.

- Preserve a broad D-shaped crescent in plan.
- Preserve the trapezoidal wedge / keel profile and box-like hollow body.
- Preserve the approximate 47.4 mm width by 36.7 mm height proportions.
- Preserve the 13 mm maximum base thickness and shallower 6.8 mm top.
- Preserve composite sheet construction, including the pointed-oval closing
  base plate, slightly beaded external edge, and concealed sheet joints.
- Preserve the complete long false suspension tube, approximately 7.7 mm
  external and 4.8 mm internal diameter.
- Do not simplify the top into a tiny jump ring, drilled hole, modern bail, or
  floating loop.
- Do not reinterpret the object as solid cast gold.

## Suspension and framing decision

**Pendant-only / no-cord framing is defensible and preferred.**

The exact record documents one standalone pendant with an intact integral
suspension tube. It does not document a surviving cord or chain. Showing the
complete pendant and complete tube alone would satisfy the complete-suspension
rule without inventing attachment hardware.

The current target row's “full leather neck loop” is unsupported. Do not add:

- a full leather loop;
- a metal chain;
- two cropped or severed cord ends;
- a short cord fragment threaded through the tube;
- a shared necklace chain borrowed from another bulla source;
- extra beads or charms.

This valid framing decision does not rescue the candidate from its symbol and
dedupe failures.

## `S` / `1x1` roster gate

The keel silhouette is large and legible enough for a small square icon if
shown nearly frontal with a slight three-quarter tilt that reveals the wedge
depth and top tube. The problem is the surface:

- At icon size, the dense hatching cannot remain cleanly archaeological.
- The triangular fields and concentric arcs tend to merge into a radiant emblem.
- Fine grooves tend to become pseudo-script or noisy engraving.
- Erasing the engraving produces a generic plain D/capsule pendant.

There is therefore no faithful icon-scale treatment that also obeys the
no-sun-motif and no-pseudo-script restrictions.

## Strict bulla/capsule dedupe

### Planned rows

- `amulet_copper_bulla` (`targets-600.tsv:223`): hollow D-shaped beaten-copper
  body with rolled suspension tube.
- `amulet_skymetal_capsule` (`targets-600.tsv:221`): another compact D-shaped
  hollow body with rolled tube.
- `amulet_bronze_capsule` (`targets-600.tsv:219`): oval capsule row already
  rejected in its Wave 05 audit because the cited source is a nine-gold-bulla
  necklace, not one bronze capsule.
- `amulet_gold_bulla` (`targets-600.tsv:230`): substantial hollow gold,
  double-convex bulla with top suspension ring.

The exact keel object's horizontal breadth and wedge section are more distinctive
than the round gold bulla or oval capsule. But the roster distinction depends on
the complete keel construction **and** its surface organization. Removing the
solar decoration leaves another gold hollow pendant with a broad top suspension
feature, while retaining it violates the explicit motif restriction.

### Existing and staged visual neighborhood

- Current `onyx_amulet` owns a compact oval pendant-on-chain macro.
- Existing/staged lozenge, barrel, calcite-drop, cowrie, and other simple
  pendant studies already occupy much of the small isolated amulet space.
- No exact pixel duplicate of BM 2020,8005.1 was found in the named asset set.
  The decisive overlap is roster-family and icon macro overlap, not a byte-level
  duplicate.
- The prior-art evidence already assembled for
  `amulet_bronze_capsule_preflight.md` covers the relevant current/staged
  bulla-adjacent neighborhood and records the family saturation.

The earlier broad historical QA pass marking the row/source as generally valid
does not override the present exact-source symbol gate or the stricter roster
compression rule.

## Active-service finish lock

If this artifact is ever used in a context where its defining solar decoration
is allowed, depict warm, clean high-gold sheet with restrained handling wear and
soft edge burnish. Do not add:

- modern mirror polish, chrome glare, or showroom jewelry finish;
- copied face crushing, depressions, cuts, compacted soil, or excavation
  abrasion;
- green corrosion or bronze patina;
- gems, enamel, glass, inlay, or a central cabochon;
- invented script, runes, lettering, radiant rays, or a separate sun disk.

Here, the no-sun rule means the correct action is rejection, not surface
sanitization.

## Failure taxonomy and hazards

- **Defining motif conflict:** official catalogue identifies the overall effect
  as solar.
- **Source erasure:** stripping all engraving removes defining evidence from
  every visible surface.
- **Icon-scale pseudo-script risk:** dense grooves cannot stay clean at `1x1`.
- **Icon-scale sun/ray risk:** arcs and opposed triangles consolidate into a
  radiant symbol.
- **Invented suspension:** the target row requests a leather loop absent from
  the source.
- **Family saturation:** a plain result duplicates adjacent D-shaped, capsule,
  and gold-bulla roles.
- **Technique drift:** the hollow composite sheet body could be mistaken for a
  solid casting.
- **Damage copying:** crushing and soil abrasion belong to archaeological
  condition, not active service.
- **Fantasy additions:** no gem, glow, pseudo-script, celestial emblem, extra
  charms, or modern polish.
- **Context over-extraction:** no worn or held character equipment is present in
  these exact views; in general, visibility on a mock character is not an item
  mandate and must not be used to manufacture roster entries.

## Disposition

Remove or replace `amulet_gold_keel_bulla` rather than generating a cleaned,
plain, cord-mounted approximation. The exact artifact can only be revisited if
the project deliberately permits its source-observed solar engraving and still
needs a fifth bulla/capsule-family item. Any replacement must be one complete
standalone object with independently documented suspension and a materially
different `S` / `1x1` silhouette.

