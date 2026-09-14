# VERDIGRIS art studies: owner workflow

The owner correction on 2026-09-13 defines the required steps:

1. Editable Blender source, using the established anatomy, camera, pose and kit.
2. Actual render at the selected logical frame dimensions (current trial48x96), pixelized explicitly, then enlarged by an exact integer with NEAREST for imagegen input.
3. Imagegen generates **simulated pixel art already aiming for the same implied48x96 pixel size per frame**. The coarse pixel clusters must be visible in the generated source. Preserve the gritty realistic pre-rendered Diablo II style through pixel shading and natural proportions.
4. Use the existing Pixel Respecter scripts at `Z:/Code/Python/pixel-perfecter` to reconstruct that implied grid. Inspect generated source and reconstructed result, including native size and alpha on light/dark backgrounds.

Do not generate full-detail art and then downsample it into a sprite. BOX/Lanczos reduction of a detailed generation is not this pipeline. Do not force detected art into a target by resizing or imposing an arbitrary coarse grid. Empty-margin adjustments and whole-pixel registration can fit recovered pixels to a frame while preserving them; verify that no foreground pixels are lost or changed. Report generated scale/camera drift honestly.

V11 is preserved as the prior, incorrect high-detail-generation approach. V12 records the corrected simulated-pixel generation and actual Pixel Respecter execution. Keep the32x64 baseline preserved beside the48x96 experiment. No production grid migration is implied.

The existing reconstructor checkout may have unrelated local changes: read its guide and use it without altering/staging those changes. Preserve exact generation prompts, input/output paths and hashes, reconstruction settings and inspected previews. Do not infer that a request to improve art authorizes repeated imagegen batches.

Owner kit/alpha correction: novice human footwear should expose the foot (simple open sandals), not full-foot clog-like shoes. Remove the female's awkward shoulder cloth; retain the remaining outfit unless asked otherwise. For true-alpha generation requests, repeat the requirement across the prompt, including its end, as the owner explicitly requested. Inspect the untouched output's actual PNG color type, mode and alpha channel before processing. Native generated alpha and a locally computed cutout are different outcomes; never claim that a local cutout proves imagegen supplied real alpha. V14 preserves a five-section repeated-alpha attempt whose raw output still had no alpha, alongside explicitly labelled local-alpha exports.


Native-alpha discovery (2026-09-13): use concise positive transparent-PNG requests with clean RGBA guides or edit targets, and explicitly preserve alpha during edits. The v02 alpha-discovery pass returned native RGBA in six consecutive calls, including a fresh generation from the pixelized Blender guide. Do not feed an RGB painted transparency preview back as the next edit target. Audit the untouched returned PNG before processing. For the preferred native-alpha workflow, a missing native alpha channel is a failed generation to diagnose, not a reason to silently substitute color-key cleanup. Preserve the raw native output and let sprite processing threshold its returned alpha; keep all origins explicit. Exact prompts and observations live in starter-slice-v02-identities/native-alpha/README.md and alpha-discovery/results.json. This empirical recipe does not establish backend model identity or guarantee all future calls.

Latest owner clarification: the base cell is 48 pixels; an actual humanoid motion sprite is about 96×96. Current starter-derivatives Blender exports are native 96×96, camera-calibrated to 48 pixels per one-metre demo cell at the player plane. Preserve that density across scenery and actors. The user requires setting background=transparent on the image-generation request, not further prompt-only retries. The current built-in schema lacks that field; do not claim to have set it. Keep unverified painted outputs out of the demo.
