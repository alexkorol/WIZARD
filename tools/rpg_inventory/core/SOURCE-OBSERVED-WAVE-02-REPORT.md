# Source-observed Wave 02 report

Date: 2026-07-24

## Result

Wave 02 used six locked, prior-art-cleared generation prompts and one direct
salvage from an existing isolated equipment board. Every generation prompt was
called exactly once with no same-run reroll.

Strict result: **4 generated accepts, 1 direct-salvage accept, 1 hold, 1
reject**.

## Generated items

| Item | Grid / requested canvas | Numeric QA | Visual / construction QA | Decision |
|---|---:|---|---|---|
| Clipped-Corner Body Shield | 2x3 / P | PASS, 1024x1536, 42% raw coverage | Complete six-sided wood/hide body shield; source-faithful clipped corners, bounded pale field, rawhide rim lacing and one functional boss. No unsupported extra bosses or metal facade. | **ACCEPT** |
| Woven Lobed Buckler | 2x2 / S | PASS, 1254x1254, 33% raw coverage | Strong compact defensive silhouette; exposed basket weave, cane frame, face brace and sparse lashings; no metal, emblem or invented symmetry. | **ACCEPT** |
| Bound Long Self Bow | 2x4 / P | Raw numeric REJECT: square matte, 2% coverage | Rare complete coherent long bow with both tips, full string, continuous shallow curve and restrained bindings. The object is good; preserve and reframe the alpha locally instead of rerolling a failure-prone family. | **ACCEPT / salvage framing** |
| Socketed Hook Sickle | 1x3 / P | Raw numeric REJECT: square matte, 9% coverage | Complete one-hand inner-edge hook cutter with plain wood haft and one simple copper-alloy socket. Strong historical/ARPG read; no sword hilt, fantasy billhook or decorative fittings. Alpha autocrop passes and can be locally reframed. | **ACCEPT / salvage framing** |
| Faceted Bronze Lozenge | 1x1 / S | PASS, 1254x1254, 18% coverage | Pendant body is clean and source-faithful, but the two cord ends are cut at the upper frame rather than forming a complete wearable neck loop. | **HOLD: incomplete cord** |
| River Calf-Wrap Sandals | 2x2 / S | PASS, 1254x1254, 30% coverage | Pair and low-tech materials are readable, but long ties float upward in rigid spirals around absent legs. Soft straps cannot retain anatomy-dependent shape after isolation. | **REJECT: invisible-support failure** |

## Direct salvage

| Item | Source | QA | Decision |
|---|---|---|---|
| River Shell-Scale Corselet | Existing isolated armor at far right of `ChatGPT Image Jul 13, 2026, 11_04_36 PM.png` | Raw crop and true-alpha clean both PASS P; 470x692, 47% coverage, no neighboring contamination | **ACCEPT / no generation spent** |

## Cleanup finding

The standard `chroma_key.py` RGB decontamination created false red/magenta
speckling inside olive-adjacent brown wood and tarnished metal. The flawed
derivatives were preserved under `cleanup-failures/`. Accepted items were
re-keyed with `--no-decontaminate`; those true-alpha outputs pass numeric QA and
retain the raw subject colors.

## Output

- Frozen prompts and manifest:
  `assets_staging/source-observed-wave-02/prompts/`
  and `assets_staging/source-observed-wave-02/manifest.json`
- Untouched generated raws:
  `assets_staging/source-observed-wave-02/raw/`
- Accepted cleaned cutouts:
  `assets_staging/source-observed-wave-02/clean/`
- Existing-art salvage:
  `assets_staging/source-observed-wave-02/salvage/`
- Preserved cleanup failures:
  `assets_staging/source-observed-wave-02/cleanup-failures/`

Held and rejected items are not approved for composition or later pixel-art
variation.
