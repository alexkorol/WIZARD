# Source-Observed Wave 04 — Generation and QA Report

Date: 2026-07-24 PDT

Generation contract: six parallel agents, one locked prompt and one built-in
image-generation call per agent, exact local reference images attached, no
same-wave rerolls.

## Result

Strict result: **5 ACCEPT / 1 HOLD / 0 destructive losses**

Strict cumulative expansion additions today: **17**

All untouched raw outputs remain in:
`assets_staging/source-observed-wave-04/raw/`

Accepted alpha cutouts are in:
`assets_staging/source-observed-wave-04/clean/`

| Art ID | Raw numeric QA | Visual decision | Concrete reason |
|---|---|---|---|
| `wpn_bow_holmegaard_flat` | P reject at 5% coverage | **ACCEPT with metric exception** | Complete tip-to-tip bow and string; source-faithful broad flat elm limbs, deep narrow grip, continuous taper, and tiny shoulder nocks. It fills the portrait diagonally; the coverage gate mistakes a legitimately thin bow silhouette for a tiny render. No reroll. |
| `focus_copper_ladle` | S pass | **ACCEPT** | Preserves the BM N.120 deep hemispherical bowl, short open trough spout, and high returning flat strap handle. It reads as copper with restrained localized tarnish, not gold/brass palace ornament. |
| `relic_stone_pyxis` | S pass | **ACCEPT** | Preserves the Getty object's squat thick stone body, horizontal tooling, recessed lid seat, and paired compact pierced lugs. The only restoration is a plain fitted disc lid; there are no feet, knob, hinge, latch, pedestal, or large handles. |
| `amulet_calcite_drop` | S pass | **ACCEPT** | Small pale calcite vessel/drop body with a credible horizontal bore and one complete tied bast/flax cord loop. No cropped ends, metal collars, gem setting, chain, or invisible-anatomy suspension. |
| `shield_bronze_yetholm` | P pass | **ACCEPT** | A complete front fighting face with the source object's dense concentric structural ribs alternating with fields of tiny punched bosses. No front straps, lacing, large holes, fantasy emblem, or radial sun motif. |
| `wpn_axe_abydos_adze` | P pass | **HOLD** | The bent haft, leather binding, and unusually long narrow blade match the complete Met and BM evidence. However, the render copied extensive burial-green corrosion into an item that must read as recently made or actively maintained. It is preserved but not promoted or counted. |

## Clean-cutout QA

All five accepted derivatives were produced with
`chroma_key.py --no-decontaminate` to avoid false red/magenta speckling.

| Clean output | True-alpha QA |
|---|---|
| `wpn_bow_holmegaard_flat_clean.png` | Complete source-faithful thin-bow exception, 939×1498, 5% coverage, 0% edge |
| `focus_copper_ladle_clean.png` | PASS, 1015×1093, 44% coverage, 0% edge |
| `relic_stone_pyxis_clean.png` | PASS, 1196×918, 65% coverage, 0% edge; alpha autocrop makes square-source aspect warning harmless |
| `amulet_calcite_drop_clean.png` | PASS, 1029×1169, 9% coverage, 0% edge |
| `shield_bronze_yetholm_clean.png` | PASS, 906×1083, 66% coverage, 0% edge; alpha autocrop makes portrait-aspect warning harmless |

## Selection and failure-taxonomy notes

- The source-object comparison prevented a false geometry rejection of the
  adze: its long blade is real. The actual failure is archaeological surface
  drift, so the raw remains a possible non-generative color-salvage candidate.
- Thin complete bows need a documented visual exception when the numeric
  coverage gate interprets their legitimate silhouette as a fragment. This
  does not relax tip-to-tip, complete-string, source-morphology, or framing
  requirements.
- Source-observed regular tooling is not automatically modern manufacture.
  The pyxis's repeated horizontal grooves are present on the dated object;
  unsupported perfect seams, hinges, locks, or hardware would still fail.
- Mock/source images remain evidence banks, not extraction checklists. Only
  these six roster-approved concepts were dispatched; duplicates, costume
  clutter, and weak props were left out before generation.

