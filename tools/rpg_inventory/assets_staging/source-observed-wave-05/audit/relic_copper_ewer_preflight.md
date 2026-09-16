# Wave05 preflight — `relic_copper_ewer`

## Verdict

**REJECT the current separate relic row.**

BM EA36304 is a potentially readable handled vessel, but the proposed target is not exact-source faithful and does not earn a distinct roster base beside the existing T2 `focus_copper_ewer`. The record also has no attached official photograph, so the whole vessel, joins, feet arrangement, and preservation state cannot be visually authenticated.

A future **merged/replacement focus-row** treatment could be reconsidered only after obtaining adequate official views and correcting the material and construction language.

## Candidate

- ID: `relic_copper_ewer`
- Display name: Three-Foot Copper Ewer
- Slot/tier/footprint: relic / T2 / S 2x2
- Source: British Museum EA36304
- Current target claims: hammered copper; bulbous body; everted rim; single strap handle; flat base; three low feet; plain active-service surfaces; no zoomorphic terminals or script.

## Exact-source audit

Official record:

- https://www.britishmuseum.org/collection/object/Y_EA36304
- https://www.britishmuseum.org/api/_object?id=Y_EA36304
- Local catalogue snapshot: `../references/british_museum_EA36304_catalog_metadata.json`

The official description identifies:

- a **bronze** ewer;
- a flat base with incised concentric decoration;
- three low feet;
- a bulbous body;
- an everted rim;
- a **decorated handle with a lotiform terminal**;
- height 25 cm and diameter 16.8 cm;
- fair condition with some corrosion.

The proposed row materially departs from that record:

- “Copper” should be bronze/copper alloy.
- “Hammered” is unsupported; the recorded technique is incised.
- “Single strap handle” is unsupported by the text.
- “Plain” suppresses the source-defining decorated handle and lotiform terminal.
- A distinct spout is not documented; the record says everted rim.
- “Ancient Egyptian” is not established by the exact online record. It records Egypt as the find/acquisition place but supplies no production date, culture, or period.

## View and preservation gate

No official image or alternate view was attached to the object API response, and no downloadable official view was available from the record during this audit. Therefore there are **no local photographic source refs** for EA36304.

The catalogue describes a complete ewer and does not disclose reconstruction, but that absence is not proof that the vessel is wholly source-preserved. Without photographs or a conservation/technical record, the following remain unverified:

- whether all three feet are ancient and correctly attached;
- handle-to-rim and handle-to-body joins;
- rim/pouring profile and whether any discrete spout exists;
- base/body joins and restorations;
- exact lotiform-terminal construction;
- the silhouette needed to distinguish it from neighboring game vessels.

This fails the exact visual source gate independently of the roster collision.

## ARPG roster-worthiness and strict dedupe

The direct collision is:

- `focus_copper_ewer` — T2, S 2x2, a substantial copper pouring vessel with rounded body, one high loop handle, and short spout.

Both candidates occupy the same tier and footprint and communicate the same core pickup: a copper/bronze, rounded, one-handled pouring vessel. Relabeling one “relic” and emphasizing three low feet does not create a sufficiently different item base at inventory scale.

Additional vessel/focus neighbors increase crowding:

- accepted `focus_copper_ladle`: copper bowl, pouring trough, high returning strap handle;
- accepted bronze offering bowl: broad squat basin, paired loop handles, pedestal foot;
- `focus_bronze_censer`: rounded bronze ritual vessel, tripod/pedestal cues, side rings, lid;
- `focus_ram_rhyton`: tall handled pouring vessel with an animal-terminal silhouette;
- `relic_stone_pyxis`: squat lidded cylindrical container with lateral lugs;
- ampulla/flask candidates: closed rounded vessel bodies with top closures or bail handles.

The ewer is conceptually distinct from a ladle or rhyton only if its closed upright body, neck/rim, single decorated handle, and three separate low feet remain unmistakable. Even then, it still duplicates `focus_copper_ewer` most closely.

## Framing

S 2x2 is geometrically plausible: 25 cm high by 16.8 cm diameter is roughly 1.49:1 before handle width. A three-quarter upright view could expose the mouth, body, handle, and three feet. However, no exact view exists to prove that all defining construction survives at this scale.

## Construction locks if reconsidered as a merged focus item

- Bronze/copper alloy, not pure copper.
- Do not call the surface hammered without another authoritative source.
- Upright bulbous body, everted open rim, flat base with incised concentric rings, and three low feet.
- One decorated handle retaining the lotiform terminal; do not simplify it to a generic plain strap.
- Do not invent a beaked or sharply defined spout unless a verified view shows one.
- Three-quarter upright presentation must show the rim/interior, handle, and all three feet.
- No lid, bail, chain, second handle, pedestal foot, side rings, perforated censer lid, ram/animal head, gems, inlays, script, fire, smoke, or contents.
- Do not reproduce corrosion or museum damage as intentional ornament.

## Failure taxonomy

- **Exact-source mismatch — material:** copper/hammered target versus bronze/incised record.
- **Exact-source mismatch — construction:** plain strap target versus decorated lotiform-terminal handle.
- **Unsupported attribution:** no production date, culture, or period in the exact record.
- **Insufficient visual evidence:** no official photograph or alternate view attached.
- **Preservation ambiguity:** no visual or technical basis for certifying original feet and joins.
- **Mechanical/roster duplicate:** same-tier, same-footprint overlap with `focus_copper_ewer`.
- **Silhouette-collapse hazard:** can read as the accepted copper ladle if rendered too open/low, as an offering bowl if too broad, or as a rhyton/censer if the terminal or feet become theatrical.

## Disposition

Remove or replace `relic_copper_ewer` as an independent relic candidate. Do not generate from EA36304 under the present row. If the source is retained at all, use it to revise/merge the existing `focus_copper_ewer` only after official visual documentation resolves the construction and preservation uncertainties.
