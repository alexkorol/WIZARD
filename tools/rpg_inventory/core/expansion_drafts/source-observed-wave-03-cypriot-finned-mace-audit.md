# Wave 03 preflight — `wpn_club_cypriot_finned`

Date: 2026-07-24  
Generation status: **not generated**

## Decision

**HOLD the current target row.** The museum object is a viable source for a
distinctive socketed mace or authority-staff head, but the current brief
misreads its construction. Do not dispatch the existing “four broad axial
fins around a tubular shaft hole” description.

## Exact source pack

- Primary object record: Metropolitan Museum of Art, *Bronze mace head*,
  Cypriot, Geometric, 8th century BCE, bronze, overall 17.1 × 7.6 cm, object
  74.51.5594:
  <https://www.metmuseum.org/art/collection/search/244473>
- Local Open Access image, inspected at 1960 × 1816:
  `C:\Users\Alex\Downloads\items_multi_context_balanced_v1\external_references\met_244473_cypriot_bronze_mace.jpg`
- Construction authority: Vassos Karageorghis, with Joan R. Mertens and
  Marice E. Rose, *Ancient Art from Cyprus: The Cesnola Collection in The
  Metropolitan Museum of Art* (Metropolitan Museum of Art, 2000), p. 164,
  catalogue 269:
  <https://www.metmuseum.org/met-publications/ancient-art-from-cyprus-the-cesnola-collection-in-the-metropolitan-museum-of-art>

The catalogue describes a cast, bifurcated weapon whose two sides are ribbed
as convex eight-petaled rosettes, with a large **transverse** shaft socket in
the middle. The local photograph is an oblique/end-on view: it visibly shows
one rosette-like ribbed end and the large dark transverse socket, but not a
mounted haft or a retention fitting.

## Visible socket and load path

- Grounded: a straight hardwood haft entering the large central transverse
  socket, producing a T-shaped head-to-haft load path.
- Not grounded: an axial tube running along the haft, four fins, a crown
  wedge, peg, rivet, ferrule, collar, leather binding, decorated grip, or butt
  cap.
- A full haft can be completed conservatively only as a plain, close-fitted
  hardwood shaft inserted deeply into the visible transverse socket. Keep the
  actual retention method visually neutral; the source does not document it.

## Prior-art audit

- `assets/warclub_bronze.png` is the nearest current macro family, but it is a
  compact fantasy flanged head with a capped axial mount and wrapped short
  haft. It is not a duplicate of the bifurcated rosette head.
- Proposed T3 reuse
  `C:\Users\Alex\Downloads\items_multi_context_balanced_v1\faction_dustwind - INT - tier 1\04__impact.png`
  is not acceptable historical construction evidence: it has a spherical
  multi-hole fantasy head, lashings, cloth wrapping, and a decorated butt
  cap. It must not control the T4 reconstruction.
- `assets_staging/source-observed-wave-03/audit/str_t2_mace_crop.jpg` is a
  later-looking knobbed spherical mace with an all-metal decorated haft and is
  neither source evidence nor a duplicate.
- Promoted post-calibration impacts 021 and 071 and the River Paddle Cudgel are
  wooden club families, not duplicates.

The corrected bifurcated, double-rosette bronze head remains macro-distinct,
but the intended ladder must be rechecked after the T3 ribbed-mace row is
resolved.

## Grid, canvas, and framing if released

- Runtime grid: **1 × 3** one-hand mace.
- Generation canvas: **1024 × 1536 portrait**.
- Show the complete plain hardwood haft, tip to butt, on a steep diagonal.
  Turn the head three-quarter to camera so both the transverse socket/wood
  interface and the bifurcated rosette mass read clearly. Do not repeat the
  museum photograph’s end-on foreshortening.

## Hazards

- Current row’s “four axial fins” and axial tubular mounting contradict the
  catalogue.
- End-on source photography can collapse the bifurcated head into a generic
  flanged ball or cog.
- The Met calls this class a possible symbol of authority and says the exact
  users are unknown; avoid claiming a documented battlefield role.
- The model is likely to add unsupported medieval/fantasy hardware or turn the
  transverse socket into several decorative holes.
- Heavy green burial corrosion should inform surface age, not become a bright
  fantasy-green material.

## Release condition

Rewrite the target around a bifurcated bronze head with two convex
eight-petaled rosette faces and one central transverse haft socket, then
visually re-audit it against the eventual T3 bronze ribbed mace. Until that
rewrite is accepted, the verdict remains **HOLD / DO NOT GENERATE**.
