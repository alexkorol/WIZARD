# Wave 05 source audit — `wpn_dag_copper_lingulate`

## Verdict

**HOLD — do not draft a prompt and do not generate.**

The British Museum record and five inspected official images firmly support the
surviving metal component: a small hammered copper-alloy tanged dagger with a
flat lingulate blade, marked edge bevels, angled shoulders, and a narrow tang
with slight hammered flanges. The record also says that it was found with
"traces of a wooden handle."

That evidence does **not** visually or textually establish the ready row's
specific **plain wood grip plates**. No surviving plate, reconstructed handle,
plate outline, plate thickness, end profile, pin/rivet, binding, or complete
blade-to-grip transition appears in any of the official images. A generic pair
of modern knife scales would therefore be an invented assembly, not a
source-observed completion.

This is a repairable source gap rather than a claim that the archaeological
object is unsuitable. Advance only after finding an inspected, dated,
construction-compatible complete tanged-dagger assembly or a scholarly
reconstruction explicitly tied to this tanged class. That source must visibly
resolve how the organic grip engages the 36 mm narrow flanged tang. Otherwise
replace this rung with a different T2 dagger whose complete hilt survives or is
authoritatively reconstructed.

Character/loadout reference art has no evidentiary role here. Equipment worn or
held by a mock character is context, not an instruction to create every visible
object and not authority for this missing handle.

## Official source record

- Object: British Museum `1862,0719.7`
- URL: <https://www.britishmuseum.org/collection/object/H_1862-0719-7>
- Museum classification: Early Bronze Age; found at Sutton Courtenay.
- Material/technique: copper alloy, hammered.
- Dimensions: total length 160 mm; tang length 36 mm; maximum width 41 mm;
  tang width 14 mm; blade/object thickness 2 mm; weight 43.27 g.
- Museum description: flat lingulate blade, marked edge bevels, angled
  shoulders, narrow tang with slight hammered flanges, and a possible curved
  hilt-mark defined by corrosion.
- Curator note: found beside a skeleton with traces of a wooden handle and a
  Beaker association.
- Chronology gate: **PASS.** "Early Bronze Age" is explicit and safely inside
  the project's chronology ceiling. No narrower absolute date is asserted
  because this record does not provide one.
- Image licence stated on the museum image pages: CC BY-NC-SA 4.0, credit
  `© The Trustees of the British Museum`.

## Exact local reference set and source roles

All five files are untouched downloads from the image assets linked by the
official object page.

1. `references/bm_1862_0719_7_img_714269001_mid.jpg`
   - **Primary silhouette/proportion authority.**
   - Isolated plan view of the exact dagger, including the full lingulate blade,
     angled shoulders, narrow tang, and small flared tang end.
   - SHA-256:
     `EB3D17F774FDE54815A456D65DD7A2F5B243247F1441F77DD58171DF3DD4B951`
2. `references/bm_1862_0719_7_img_1162284001_max.jpg`
   - **Face and shoulder/tang transition authority.**
   - Historical monochrome view with the complete surviving metal component.
   - SHA-256:
     `565879E8F6B9F6C8100753149ABA8B2AC7D71EF9F11D09B32B96667B1FCF427F`
3. `references/bm_1862_0719_7_img_1162285001_max.jpg`
   - **Opposite-face/profile corroboration.**
   - Confirms the narrow tang and asymmetric survival at the shoulder; it does
     not show an organic grip.
   - SHA-256:
     `215406199FE84A9DD419A237141591C1D458E2145A1F853BEBFE4B5ACB403B46`
4. `references/bm_1862_0719_7_img_246784001_max.jpg`
   - **Find-group/context authority.**
   - Shows the exact numbered dagger with associated grave objects. Use only
     the dagger geometry; do not import the other objects.
   - SHA-256:
     `3EDB3DD2E8A3F4280DCE5F4905E59388B06F5ED5E49027D939903FC9E4DE1EAB`
5. `references/bm_1862_0719_7_img_164692001_max.jpg`
   - **Comparative close-view corroboration.**
   - The numbered exact dagger is the right-hand object. The left-hand dagger
     is a comparison object and is not authority for this row.
   - SHA-256:
     `DC1F8DA83D29484EBE39C12C9737A7B30B675876530B85CFF00C84F585D05253`

The older Wave 03 download
`assets_staging/source-observed-wave-03/references/british_museum_1862_0719_7_copper_lingulate_dagger.jpg`
was also inspected. It duplicates the comparative museum view and supplies no
additional handle evidence.

## Construction locks if the hold is later cleared

- Preserve a thin, flat, long tongue-shaped copper blade rather than a thick
  fantasy leaf blade.
- Preserve the marked edge-bevel fields; do not introduce an oversized central
  fantasy ridge.
- Preserve the angled shoulders and keep the 36 mm narrow tang mechanically
  legible at the blade/grip interface.
- Preserve the slight hammered tang flanges; do not turn them into a
  crossguard, ricasso, socket, or decorative collar.
- Any wood completion must come from the future assembly authority. It may not
  default to two machine-even slab scales merely because that is common modern
  knife construction.
- Add no rivets, pins, wire, cord wrap, guard, metal grip bands, or pommel unless
  the future completion source explicitly supports them.
- Show a healthy active-service copper/wood object. Do not copy corrosion,
  mineral staining, broken edges, catalog numbers, labels, or burial-group
  presentation.

## Framing and game-roster gate

- Requested footprint `P 1x2`: **PASS.** At 160 mm overall for the surviving
  metal and with a narrow straight silhouette, a portrait 1x2 icon is the
  correct inventory economy.
- Ladder concept: **conditionally distinct.** A flat T2 copper tanged dagger
  could bridge the T1 monolithic flint lancet and T3 flanged-hilt Peschiera
  dagger through a genuine construction change.
- Current roster: **not clean enough to override the source hold.**
  `assets/dagger_copper.png` already occupies the copper-dagger identity and
  `pilot-02/raw/wpn_short_cypriot_rivet_correction.png` occupies the extremely
  close 1x2 copper-blade/plain-wood-grip macro. The existing copper dagger is a
  broad leaf blade with crossguard, wrap, and stone pommel, so it is not an
  exact silhouette duplicate. The corrected Cypriot result is much closer at
  icon scale and is itself rejected for a fused blade/wood transition and
  machine-even grip.
- Roster consequence: if a valid complete assembly source is found, this row
  must read at 48 px as **flat lingulate blade + visibly narrow tang + distinct
  source-backed organic hilt**, not as another broad copper leaf dagger or a
  rivetless recolour of the rejected Cypriot knife. Treat it as a deliberate
  T2 ladder replacement/addition, never as a free extra produced because a
  reference character carries a knife.

## Strict prior-art audit

Visual audit sheet:
`audit/wpn_dag_copper_lingulate_prior_art_contact.jpg`

Inspected:

- all dagger/knife/copper-name matches in `tools/rpg_inventory/assets`;
- all dagger/knife/copper-name matches and relevant raw/clean results in
  `tools/rpg_inventory/assets_staging`, including Pilot 02 and Wave 03;
- the ready/draft manifests, target tables, source-observed reports, historical
  QA, correction memo, and weapon supply notes;
- all six `short_blade` manifest rows and all three present generated
  `04__short_blade.png` files under
  `C:\Users\Alex\Downloads\items_multi_context_balanced_v1`;
- the weapon-range triage for
  `C:\Users\Alex\Downloads\items_post_calib_batch` and its only dagger-like
  candidate, sorted index 29,
  `ChatGPT Image Jul 10, 2026, 11_04_16 PM (1).png`.

Findings:

- No inspected file is an exact copy of the British Museum lingulate metal
  component.
- The existing `dagger_copper.png` is a same-slot/same-material identity
  collision but a different broad-leaf/crossguard macro.
- The two Pilot 02 Cypriot results are the closest construction/silhouette
  collision; neither can legitimize this row because their wood junctions are
  generated failures, not source evidence.
- The balanced short blades are ornate akinakes-like straight blades with
  guards and T-pommels; they are not duplicates.
- Post-calibration index 29 is a long, narrow medieval-fantasy crossguard blade
  and is already rejected; it is not reusable supply.
- An older draft historical table marked the row PASS because organic scales
  were considered plausible. The later Wave 03 preflight correctly deferred
  it after visual inspection. Under the current source gate, plausibility
  cannot substitute for visible or explicit complete-assembly evidence.

## Failure taxonomy / reject hazards

Reject any future result exhibiting one or more of these:

- wood visually melting into copper, or an invisible tang/shoulder transition;
- two perfectly mirrored, machine-even modern knife scales guessed from the
  phrase "wooden handle";
- invented rivets, pins, fasteners, socket, ferrule, crossguard, ricasso, metal
  grip bands, wire, cord wrap, or pommel;
- a broad fantasy leaf blade that duplicates `dagger_copper.png`;
- a two-rivet triangular wood-handled knife that duplicates the Pilot 02
  Cypriot macro;
- a cylindrical spear-like haft instead of a compact dagger hilt;
- overly thick blade volume, exaggerated midrib, wavy/flame outline, or
  medieval/fantasy ornament;
- copied corrosion, missing/broken edges, white catalog numbers, paper labels,
  black museum backdrop, or multiple grave-group objects;
- cropped tip/pommel, landscape framing, or failure to remain readable in a
  portrait 1x2 / 48 px slot.

## Hold-clearing evidence

The minimum acceptable new evidence is an inspected authoritative image,
technical drawing, or museum/scholarly reconstruction for this exact object or
a tightly compatible tanged-dagger class that shows:

1. the complete hilt outline and material;
2. how the wood engages the narrow flanged tang and shoulders;
3. any actual fasteners or the explicit absence of them; and
4. enough visible separation between metal and wood to transcribe the joint
   without guessing.

Until all four are present, the row remains **HOLD**.
