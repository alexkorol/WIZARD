# Source-observed wave 01 report

Date: 2026-07-24

## Decision

Eight locked prompts were generated once in parallel from objects visibly
present in two reviewed ladder/loadout images. No same-run rerolls were made.
The full batch remains stopped pending review of this report.

Strict result: **1 accept, 2 hold, 4 reject, 1 redundant/reuse**.

## Results

| Item | Grid / requested canvas | Numeric QA | Visual and construction QA | Decision |
|---|---:|---|---|---|
| Plateau recurve bow | 2x3 / P | REJECT, square 1254x1254, 3% coverage | Rare successful full bow: coherent string, limbs, recurved tips and grip, with no truncation. The square slate is a framing defect, not an object failure; preserve this generation and reframe the cleaned cutout locally instead of rerolling a failure-prone family. | **ACCEPT / salvage framing** |
| Plateau woven quiver | 2x3 / P | PASS, 1024x1536, 23% coverage | Strong organic woven/hide container with credible straps and no prestige metal, but it includes arrows. This violates the established quiver-isolation rule: the mouth must be visibly open and empty because arrows are separate inventory items. The wave builder itself incorrectly requested the arrows despite the durable rule already present in `AGENTS.md`. | **HOLD: remove arrows; not usable as-is** |
| Plateau felt helm | 2x2 / S | PASS, 1254x1254, 33% coverage | The output is coherent, but the rung was already filled by `ChatGPT Image Jul 14, 2026, 01_03_23 AM (3).png`, promoted as `helmet_ridged_hide_point` / `helmet_hide_point`. The prior image already supplies the tan pointed Mongolian/steppe-style hide helmet macro-shape. | **REDUNDANT: reuse prior art; retire new prompt** |
| Plateau riding coat | 2x3 / P | PASS, 1024x1536, 43% coverage | Complete readable coat, but it drifted from felt/wool toward smooth modern leather and multiplied decorative sleeve and hem panels beyond the observed narrow border. | **HOLD: material/source drift** |
| North leaf sword | 1x3 / P | PASS, 1024x1536, 10% coverage | Bronze leaf blade is readable, but the all-metal hilt, dense circular ornament, regular rings and polished symmetry push it toward a fantasy/medieval prestige prop rather than restrained Bronze Age service gear. | **REJECT: ornament and workshop drift** |
| North oval shield | 2x3 / P | PASS, 1024x1536, 50% coverage | Readable hide-faced oval shield, but the model added a precision rim system, many repeated metal fittings and two unsupported secondary bosses. Too much copper-alloy hardware and regularity. | **REJECT: unsupported hardware** |
| North banded corselet | 2x3 / P | PASS, 1024x1536, 52% coverage | Correct inventory silhouette, but the extremely regular identical plates, dense paired rivets, uniform lacing and finished leather edging read industrial and later-period. | **REJECT: machine regularity / medieval drift** |
| North bronze cap | 2x2 / S | PASS, 1254x1254, 42% coverage | Complete helmet, but it resolves as a highly regular riveted spangenhelm with compound panels and cheek pieces: a medieval-feeling construction, not the intended early bronze cap. | **REJECT: medieval silhouette and construction** |

## Batch-level findings

- Starting from a visible equipped or laid-out object materially improved the
  organic material construction. The quiver avoids the speculative
  lacquered-reed concept's expensive metal garnish, but source transcription
  must still obey slot-separation rules: a visible source arrow bundle is not
  part of the standalone quiver inventory art.
- Quivers must show a visibly open, empty mouth with no arrows, shafts,
  fletching, bow parts or combined archery kit. Arrows are separate items.
- A visually successful hard-to-generate object is not discarded solely
  because its removable matte used the wrong aspect ratio. Preserve the bow
  and fix framing locally after extraction.
- A character image alone is not enough for close-up metal construction. The
  source can support silhouette and loadout identity while still leaving joins
  ambiguous; the model fills that ambiguity with regular rivets, plates,
  fittings and later-period helmet grammar.
- Before scaling metal items, each prompt needs a close, exact artifact or
  reconstruction image that visibly resolves the hilt, rim, plate joins or
  helmet assembly. Broad museum analogues are not sufficient.
- Numeric canvas QA catches framing failures but cannot validate historical
  construction. Both gates remain mandatory, with explicit salvage judgment
  for rare successful objects.
- Source-first is not sufficient without prior-art-first. Every generation
  candidate must be visually compared with promoted post-calibration images,
  expansion-ready supply maps, current assets, and staging before dispatch.
  Different names do not make two materially equivalent silhouettes distinct
  roster entries.

## Output

- Raw one-attempt generations:
  `assets_staging/source-observed-wave-01/raw/`
- Cleaned accepted cutouts only:
  `assets_staging/source-observed-wave-01/clean/`
- Cleaned held cutouts retained for possible targeted edits:
  `assets_staging/source-observed-wave-01/hold/`
- Redundant new cutouts preserved for audit but barred from promotion:
  `assets_staging/source-observed-wave-01/redundant/`
- Retired duplicate prompts:
  `assets_staging/source-observed-wave-01/retired-prompts/`
- Frozen prompts:
  `assets_staging/source-observed-wave-01/prompts/`
- Prompt/reference manifest:
  `assets_staging/source-observed-wave-01/manifest.json`

No rejected or held image is approved for promotion or later pixel-art
variation.
