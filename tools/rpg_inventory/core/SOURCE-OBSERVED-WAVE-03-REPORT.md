# Source-Observed Wave 03 — generation and QA report

Date: 2026-07-24 PDT

Generation contract: seven parallel agents, one locked prompt and one imagegen
call per agent, no same-wave rerolls.

## Result

Strict result: **5 ACCEPT / 2 HOLD / 0 destructive losses**

All raw outputs remain in:
`assets_staging/source-observed-wave-03/raw/`

Accepted alpha cutouts are in:
`assets_staging/source-observed-wave-03/clean/`

| Art ID | Raw numeric QA | Visual decision | Concrete reason |
|---|---|---|---|
| `source_river_faience_barrel_pendant` | S reject at 6% raw coverage | **ACCEPT** | Full unbroken dark cord loop; one compact blue-green/pale three-part barrel stack; no metal setting, broad collar, radial symbol, or extra dangles. Alpha crop raises useful coverage to 10% and passes. |
| `wpn_dag_flint_lancet` | P pass | **ACCEPT** | Complete monolithic extremely narrow flint lancet; integral blunt hand end, no invented/fused grip, metal, guard, socket, or museum damage. |
| `wpn_throw_badarian_stick` | P pass | **ACCEPT** | One-piece hardwood missile with unequal long/short arms and shallow elbow; does not collapse into a straight club, paddle, or symmetric boomerang. |
| `feet_woven_fibre_sandals` | S pass | **ACCEPT** | Complete non-mirrored pair with woven soles and sparse fiber thongs; every cord rests against a sole, with no floating calf spirals or invisible anatomy. |
| `wpn_short_loop_knife` | P pass | **ACCEPT** | Complete integral iron knife; single-edge blade flows into a long flat strap handle and one open terminal loop; no guard, scales, rivets, D-guard, or separate ring. |
| `source_river_bast_rib_corselet` | P reject; model returned square | **HOLD** | Strong torso silhouette, but it turns source-observed bast/fiber ribs on backing into an overly rigid, extremely regular field of separate reed-like stems and bindings. Wrong canvas is locally fixable; the material interpretation is not. |
| `focus_copper_sistrum` | P pass | **HOLD** | Three rods, captured sounding plates, plain load-bearing yoke, and complete handle all pass. Surface reads as polished golden bronze/brass rather than the restrained copper target, so it is not promoted under `focus_copper_sistrum`. |

## Clean-cutout QA

All five accepted derivatives were produced with `chroma_key.py
--no-decontaminate` to prevent false red/magenta speckling in brown, olive,
fiber, flint, and iron-adjacent pixels.

| Clean output | True-alpha QA |
|---|---|
| `source_river_faience_barrel_pendant_clean.png` | PASS, 839x1102, 10% coverage, 0% edge |
| `wpn_dag_flint_lancet_clean.png` | PASS, 792x1389, 11% coverage, 0% edge |
| `wpn_throw_badarian_stick_clean.png` | PASS, 946x1233, 18% coverage, 0% edge |
| `feet_woven_fibre_sandals_clean.png` | PASS, 1151x938, 51% coverage, 0% edge |
| `wpn_short_loop_knife_clean.png` | PASS, 952x1362, 10% coverage, 0% edge |

## Durable lessons

- A low raw coverage failure is not automatically fatal for a complete wearable
  cord loop; alpha crop and runtime readability decide whether it is usable.
- Exact museum geometry substantially reduced drift in the flint lancet,
  throwing stick, sandals, and loop-ended knife.
- A character image can clearly show a macro without proving its material
  assembly. The bast-rib corselet remains held because the generation changed
  channels on backing into a regular rigid stem shell.
- Correct mechanical parts do not excuse a wrong material-tier read. The
  sistrum remains held rather than being renamed after the fact.
