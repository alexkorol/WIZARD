# Wave 03 preflight — `focus_copper_bell`

Date: 2026-07-24  
Generation status: **not generated**

## Decision

**REJECT as a new-generation row.** The replacement museum source is exact
and production-legible, but the proposed copper ring bell duplicates two
already present bell silhouettes. Keep the source pack for bell construction
authority; do not spend a generation on this row unless one of the existing
bell assets is retired and the roster is rebalanced.

## Exact source pack

- Primary object record: British Museum, *bell*, N.157, Neo-Assyrian,
  800–700 BC, excavated at the North West Palace at Nimrud:
  <https://www.britishmuseum.org/collection/object/W_N-157>
- Official British Museum primary image, inspected at 2500 × 1832:
  `Z:\Code\WIZARD\tools\rpg_inventory\assets_staging\source-observed-wave-03\references\british_museum_N157_neo_assyrian_bronze_bell.jpg`
- Image SHA-256:
  `07e4fca2b965bc0bac5398465f9abfb7eadb86d0738678221f0ac9dbe5539674`
- Secondary mechanism reference: Archaeological Museum of Thessaloniki,
  four cast bronze bells from Olynthus, early 4th century BC:
  <https://www.amth.gr/en/exhibitions/exhibit-of-the-month/four-small-bronze-bells-ancient-olynthus>
- Official Thessaloniki image, inspected at 922 × 795:
  `Z:\Code\WIZARD\tools\rpg_inventory\assets_staging\source-observed-wave-03\references\amth_olynthus_four_bronze_bells_4c_bc.png`
- Image SHA-256:
  `7c63baf4b18e4ef7490babf241de9e30605d6d6a8305b8e9203ccfe6d8acc8fe`

British Museum N.157 is copper alloy with iron fixture traces, cast in one
piece, 8.2 cm high, 5.9 cm in diameter, and 320 g. The record identifies it as
a large bell rather than a modern reconstruction. Its clapper is lost.

## Exact complete construction

- one-piece cast copper-alloy body;
- high rounded shoulders flowing into nearly straight/slightly convex sides;
- modest outward flange around the complete mouth;
- thick closed ring holder cast integrally at the top, with no separate
  handle, chain, hinge, or wood grip;
- internal iron fixture formerly centered under the crown;
- clapper was suspended from that fixture but does not survive;
- plain active-service reconstruction may restore one simple iron or bronze
  clapper, but must not invent a long handle, chain, cage, or decorated crown.

The official primary image is a group view. N.157 belongs to the large
Neo-Assyrian bell family visible at the back, whose complete ring/body/flange
profiles are unobstructed. The Olynthus record independently documents
lost-wax casting, a perforated top handle, and a wire-mounted movable clapper.

## Current-art and supply audit

- `assets/rattle_copper.png` is already a complete copper hand bell with a
  broad flared mouth, short grip, and visible ball clapper. It is the same
  material, function, tier neighborhood, and macro silhouette as the proposed
  row despite its `rattle` filename.
- `assets_staging/pilot-02/clean/relic_bronze_bell_clean.png` is an even
  closer collision: plain flared bronze body, very large integral top ring,
  and visible clapper. It already realizes the proposed visual thesis.
- `targets-600.tsv` also contains `relic_bronze_bell`,
  `amulet_bronze_bell`, `focus_amber_bell`, `focus_skymetal_bell`, and
  `attendant_bell_yoke`. A second plain copper/bronze bell would weaken all
  of those distinctions.
- `offhands-supply-map.tsv` explicitly says a handled ritual output overlaps
  the clearer bell and sistrum bases. No mapped reuse source gives this row a
  new silhouette.
- `auxiliary-supply-map.tsv` already assigns a signal output to
  `attendant_bell_yoke` and another to `warcall_bronze_sistrum`; the sound-tool
  lane is not missing representation.
- Relevant post-calibration ritual rows are either rejected for weak prop
  readability or are mortar/rod forms. None creates a defensible gap for
  another plain bell.

## Grid, canvas, and framing

- Current row: **1 × 3 portrait**, with a 1024 × 1536 generation canvas.
- Source proportions: 8.2 × 5.9 cm, a compact approximately 1.4:1 body. A
  source-native standalone bell is closer to **1 × 2 portrait** or the
  existing relic's **1 × 1 square** than to a long 1 × 3 implement.
- If the row were ever released as a held rite focus, retain the canonical
  **1 × 3** grid but fill the portrait canvas on a steep three-quarter
  diagonal. Show the entire integral ring, crown, body, mouth flange, and
  restored simple clapper. Do not elongate the ring into a handle merely to
  fill the canvas.

## Failure and dedupe risks

- exact duplicate of `rattle_copper.png` or the cleaned Bronze Hand Bell;
- generic church bell, cowbell, dinner bell, or modern turned-handle handbell;
- separate or hinged ring instead of the one-piece cast holder;
- exaggerated long grip, chain, crossbar, yoke, or dangling charm cluster;
- missing/cropped mouth, ring, or clapper;
- ornate sacred marks, faces, script, studs, solar bands, or fantasy runes;
- bright archaeological verdigris replacing maintained copper;
- broad ring mistaken for a padlock or kettle handle;
- small source body floating in a 1 × 3 canvas with weak 48 px readability.

## Release condition

Do not generate this plain copper ring bell while either current bell asset
remains in the roster. If a future audit removes both collisions, replace the
stale target citation with British Museum N.157, explicitly mark the clapper
as a conservative functional restoration, and use the source-faithful
one-piece ring/body/flange construction. Current verdict:
**REJECT / DUPLICATE / DO NOT GENERATE**.
