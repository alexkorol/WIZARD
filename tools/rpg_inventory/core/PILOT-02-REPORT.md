# Pilot 02 report — mixed-ratio, source-grounded inventory icons

Date: 2026-07-24

## Decision

**The full batch is stopped.**

The pilot proved that the recovered multi-reference prompt architecture is
substantially better than the generic Wave-01 lane, but it also exposed a
planning error: several `generate_new` rows were prose-designed first and only
given references afterward. That is not the source-observed extraction
workflow established by the project.

The corrected rule is now durable in `AGENTS.md` and `ASSET-BRIEF.md`: inspect
and select the actual object image before writing the item brief. Faction and
PoE references may control finish, inventory occupancy, and progression, but
may not invent absent materials or construction.

## Preflight performed

- Re-read the RPG inventory agent instructions, goal, runbook, prompt builder,
  footprint specification, failure taxonomy, and post-calibration intake.
- Audited all 261 files in `items_post_calib_batch`: 44 promote candidates,
  71 review, 146 reject.
- Reused the proven `individual_prompt()` architecture from
  `items_multi_context_balanced_v1`; no generic `status.py` prompt was used.
- Inspected representative PoE equipment icons and base progressions on the
  Equipment, Bow, Body armour, Belt, Ring, Quiver, and Shield pages.
- Used PoE only for inventory footprint, icon occupancy, silhouette
  readability, and base-type progression—not for historical construction.
- Used three reviewed ladder images per item, plus role-scoped artifact,
  reconstruction, Pinterest, or calibrated-icon references.
- Used the established P/S/L canvases: 2:3 portrait, 1:1 square, and 3:2
  landscape. Grid dimensions did not get substituted for generator aspect
  ratios.
- All six first-pass images passed the numeric canvas/edge/background gate.
- The standard slate cleanup successfully keyed all six first-pass images.
- No full-batch generation started.

PoE pages inspected:

- https://www.poewiki.net/wiki/Equipment
- https://www.poewiki.net/wiki/Bow
- https://www.poewiki.net/wiki/Body_armour
- https://www.poewiki.net/wiki/Belt
- https://www.poewiki.net/wiki/Ring
- https://www.poewiki.net/wiki/Quiver
- https://www.poewiki.net/wiki/Shield

## Item results

| Item | Footprint / canvas | Numeric QA | Visual-source and construction result | Decision |
|---|---:|---|---|---|
| Cypriot Rivet Knife | 1x2 / P | PASS, 1024x1536 | First blade was good, but the cylindrical criss-cross-wrapped handle read as a fantasy spear haft. The correction is worse: the wood scales visually fuse into the blade instead of meeting a legible tang or shoulder, and the grip is too evenly machined for the intended hand-worked construction. Numeric QA does not override this physical-construction failure. | **REJECT — do not promote or pixel-variant** |
| Ribbed Bronze Shield | 2x3 / P | PASS, 1024x1536 | Strong complete Yetholm silhouette and structural ribs, but the model added perimeter holes and lashings inconsistent with a one-piece beaten bronze disc and turned rim. | **HOLD / construction failure** |
| Bronze Pilos Helm | 2x2 / S | PASS, 1254x1254 | The exact Pilos silhouette was found and inspected through Pinterest before generation and paired with historical verification. Output is complete, plain, and non-medieval. View is more frontal than ideal but the bowl/back is structurally present. | **PROVISIONAL ACCEPT** |
| Woven Linen Girdle | 2x1 / L | PASS, 1536x1024 | First pass was an impossible seamless woven hoop. The single correction visibly opens the band and closes it with a compact textile tie and two short ends, with no metal hardware. Corrected image also passes numeric QA. | **PROVISIONAL ACCEPT — corrected version only** |
| Bronze Hand Bell | 1x1 / S | PASS, 1254x1254 | Strong ARPG silhouette and plausible cast bronze, but the local inspected artifact image did not directly support the generated arched hand grip. Under the new visual-source gate, plausibility alone is insufficient. | **HOLD pending exact matching object photo** |
| Lacquered Reed Quiver | 2x3 / P | PASS, 1024x1536 | Rejected at the concept level. The model turned cheap reed into a precision object with broad polished copper-alloy collars, regular rivets, lid hardware, and a knob. More importantly, the “lacquered reed quiver” was a speculative prose construction rather than the quiver visibly equipped in the ladder source. The correction was stopped before generation. | **REJECT / retire speculative concept** |

## Material-economy finding

The first quiver failed because four prompt signals overpowered the intended
material hierarchy:

1. Dustwind faction language allowed bright bronze or brass.
2. The prose brief explicitly requested a bronze rim.
3. Tier 4 was described as a material/logistics investment.
4. The contextual Assyrian/Persian references contained valuable metal.

The model converted those cues into generic prestige hardware. This is now a
hard failure:

- copper alloy is expensive elite material in this setting;
- reed, bast, ordinary cloth, common wood, and plain hide remain organic-led;
- higher organic tiers progress through weave, lacquer, fitting, lamination,
  load paths, join quality, and labor;
- bronze/brass cannot be sprinkled onto cheap material as faction or tier
  decoration.

## Visual-source audit of the 300-row expansion

Current `targets-600.tsv` breakdown:

- 221 `generate_new` rows with no local source path;
- 69 `review_reuse` rows with a local source;
- 10 `reference_only_generate` rows with a local source.

Therefore the 300-row file is a **planning roster**, not a generation-ready
queue. The 221 unsupported rows are blocked by the new visual-source gate.
The remaining 79 source-linked rows still require individual visual inspection
to confirm that the named item is actually present and extractable.

## Required gate before any full batch

For every item:

1. Select and inspect the primary object image first.
2. Record whether it is:
   - visibly equipped or laid out in a reviewed ladder/loadout image; or
   - a specific artifact photograph or credible reconstruction; or
   - a reviewed Pinterest lead paired with museum/catalogue verification.
3. Transcribe only the visible silhouette, materials, joins, closure, and
   proportions into the brief.
4. Reject rows whose construction must be guessed.
5. Use faction ladder references for finish/material language only where those
   materials are actually present on the object.
6. Use PoE references only for footprint, occupancy, readability, and
   progression.
7. Run one generation, the numeric gate, the 12-part visual failure taxonomy,
   and local slate cleanup.

Same-culture auxiliary extrapolation is paused for this expansion unless Alexei
explicitly approves an exception.

## Files

- Locked first-pass prompts:
  `assets_staging/pilot-02/prompts/`
- User-approved correction prompts:
  `assets_staging/pilot-02/correction-prompts/`
- Raw outputs:
  `assets_staging/pilot-02/raw/`
- First-pass cleaned cutouts:
  `assets_staging/pilot-02/clean/`
- Prompt/reference manifests:
  `assets_staging/pilot-02/pilot-manifest.json`
  and `assets_staging/pilot-02/correction-manifest.json`
