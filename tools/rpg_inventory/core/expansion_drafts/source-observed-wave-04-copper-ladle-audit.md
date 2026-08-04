# Wave 04 preflight — `focus_copper_ladle`

Date: 2026-07-24  
Generation status: **not generated**

## Decision

**HOLD the current row for a grid/canvas correction.** The historical source,
complete construction, tier, and roster niche all pass. The object is nearly
square and belongs to the broad handled-vessel exception, however, not the
current 1 × 3 portrait footprint. Change it to 2 × 2 square before dispatch.

## Exact source pack

- British Museum, *ladle*, N.120 / museum number 124593, Neo-Assyrian,
  900–700 BC, excavated by Austen Henry Layard in Room AB of the North West
  Palace at Nimrud:
  <https://www.britishmuseum.org/collection/object/W_N-120>
- Official British Museum primary image, inspected at 2112 × 2500:
  `Z:\Code\WIZARD\tools\rpg_inventory\assets_staging\source-observed-wave-04\references\british_museum_N120_neo_assyrian_side_spouted_ladle.jpg`
- Image SHA-256:
  `f9aecfaf374fa2c1e02a8e5f6414f3b53551627d83ff2a71e68a5e3e2da230b8`

The museum identifies the object as a mould-made copper-alloy dipper ladle.
The bowl is 9.9 cm in diameter and 9.4 cm high; complete overall dimensions
are 15.4 cm high by 14.3 cm wide. It weighs 369.5 g and holds approximately
450 ml. It belonged to a wine-service family with cauldrons, strainers, and
bowls.

## Complete handle, bowl, and spout geometry

- One deep, round, almost hemispherical bowl with a gently swollen lower
  body; it is not a shallow spoon bowl.
- A continuous circular rim except where it opens into one short horizontal
  side spout.
- The spout is a broad open-top trough with raised side walls and a blunt,
  nearly squared terminal. It is not a closed tube, bird beak, long ewer
  spout, or pinched pouring lip.
- Opposite the spout, one wide flat strap rises steeply from the bowl,
  doubles over in a tight high arch, and returns behind the bowl.
- The visible outer handle face carries restrained longitudinal/ribbed
  mouldings. These are integral raised ribs, not applied strips, lacing,
  studs, or engraved ornament.
- The handle remains over the bowl rather than projecting laterally like a
  modern saucepan or long spoon.
- For active-service restoration, close the museum object's missing bowl
  patch and rim cracks, remove the painted accession number, and show healthy
  copper/bronze with only light handling wear.

## Existing-art and supply audit

- `assets/bowl_bronze_offering.png` is a low, footed, two-loop-handle bowl
  with no spout. It shares material and a round vessel body but not the
  one-tall-strap/one-side-trough silhouette.
- The balanced output assigned to `focus_bronze_censer` is a closed, lidded,
  footed vessel with side rings. It does not duplicate an open dipper.
- The balanced output assigned to `focus_ram_rhyton` is an animal-headed
  handled cup; its tall figural terminal and cylindrical vessel remain
  distinct.
- `focus_copper_ewer` is the nearest planned neighbor. Its low rounded body,
  vessel neck, high loop handle, and defined projecting spout must remain
  ewer-like. The ladle must stay neckless, fully open, and use a short
  rim-level trough.
- `focus_stone_bowl` and `focus_bronze_phiale` are unhandled open vessels;
  the former is deep with one lip and the latter broad and shallow with an
  omphalos.
- The post-calibration triage contains no reusable ladle or equivalent
  side-spouted dipper. Relevant ritual candidates are rejected props, a
  mortar-and-pestle set, or a rod.
- `offhands-supply-map.tsv` assigns the censer, pronged sceptre, and rhyton
  candidates and rejects the remaining weak ritual props. No mapped source
  duplicates this exact macro.

The source-faithful ladle therefore passes roster dedupe provided the handle
and open trough are preserved.

## Grid, canvas, and framing

- Current row: **1 × 3 portrait**.
- Source proportions: **15.4 × 14.3 cm overall**, essentially square.
- Correct runtime grid: **2 × 2 square**, using the canonical broad
  bowl/handled-vessel exception for rite foci.
- Correct generator canvas: **1024 × 1024 square**.
- Frame in a high three-quarter view. Turn the open bowl toward camera, keep
  the short spout fully silhouetted to one side, and let the tall strap
  handle rise on the opposite/rear side. Preserve all three identity cues in
  one complete uncropped object.

A portrait canvas encourages the model to invent a long spoon handle, stretch
the arch, or shrink the bowl. A square canvas matches both the measured object
and its gameplay-readable silhouette.

## Hazards

- modern long-handled soup ladle, saucepan, skillet, dipper, teapot, ewer, oil
  lamp, or shaving mug;
- closed tubular spout instead of the open-top trough;
- shallow spoon bowl instead of the deep 450 ml vessel;
- handle projecting sideways rather than rising in a tight vertical loop;
- one-legged handle, broken return, unsupported floating strap, or a solid
  slab filling the handle opening;
- copying the museum break, missing patch, accession number, burial crust,
  pitting, or heavy verdigris;
- extra feet, lid, second handle, hanging chain, scoop contents, liquid,
  smoke, flame, deity head, script, or solar/radial ornament;
- overdeveloped ribs that become fluting, rails, blades, or applied prestige
  decoration;
- convergence with the ewer if a neck or long beak is added;
- convergence with the offering bowl if the spout and high strap are weak.

## Release condition

Change the target from **P / 1 × 3** to **S / 2 × 2**, then lock the prompt to
the complete deep open bowl, short open-top side trough, and high returning
ribbed strap handle visible in British Museum N.120. With that correction the
source pack is a **PASS**; until then the dispatch verdict remains
**HOLD / DO NOT GENERATE**.
