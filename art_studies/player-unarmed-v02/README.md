# Player ready poses v02 — unapproved

Owner correction: make the male and female unarmed figures more natural and ARPG-ready; the original hanging-arm stance looked like a limp ragdoll.

The existing Blender figures were reposed through the actual Blender MCP connection. Both now have staggered feet, flexed knees, lowered pelvis, slight forward torso lean/counter-turn, bent elbows and asymmetric empty hands in a low guard. Camera, lens, framing, lights, seed, materials and garment identity were held fixed. Lower tunic geometry was adjusted to follow the new leg position. The first study remains in `../player-unarmed-v01/`.

## Review files

- `review/structural-review.png`: actual Blender structural image and 3x nearest-neighbour logical guide, light/dark backgrounds.
- `review/native-size.png`: 64x96 guides at native resolution.
- `review/multi-angle-inspection.png`: camera, side, opposite and overhead renders actually inspected.
- `review/provisional-scale.png`: shared study pixel density. The owner-selected current player reference remains missing, so final game scale/camera are not verified.
- `sources/player-ready-v02.blend`: current editable scene, preserving the original startup scene. Female collection initially hidden to prevent overlap; toggle male/female collection visibility to inspect either figure.
- `pose-and-camera.json`: editable joint positions and verified camera invariants.
- `pose_ready.py`, then `refine_support.py`: exact revisions applied to the existing v01 Blender file through `../player-unarmed-v01/mcp_run.py`. These are one-time transformations; reuse the saved v02 file rather than applying them repeatedly. Both recipes are embedded in the Blender file.

## Before appearance generation

The low-resolution Blender renders are 64x96 RGBA. `pixelize_and_review.py` preserves their RGB, uses alpha >=128 for solid coverage, shifts both by the same integer Y offset (-1px for this pose), and enlarges by exactly 8x NEAREST to 512x768. Anchor: (32,89). Actual visible heights: male 73px, female 70px. Hashes, bounds, alpha and roundtrip evidence are in `validation.json`.

The exact future structural inputs are `guides/male-input-8x.png` and `guides/female-input-8x.png`, separately, one figure per imagegen call. No smooth inspection render or multi-figure board should be fed as a competing guide. No image generation has occurred. Style reference selection is still pending; the reference proposals/source URLs and excluded local crops remain with v01.

## Visible limitations for owner review

These are structural blockouts, not finished sprites. Hands, shoulders and faces are simplified volumes. A small foreground-thigh/tunic intersection remains visible and needs cloth clearance cleanup before the guide is finalized. Pose naturalness and the degree of combat readiness are for owner review; automated image checks do not establish artistic approval. Final player-plane calibration is provisional.

Later equipment variants remain: darts; a knapped flint hand axe held directly, with no handle or bindings; and a small ritual bowl. Keep the accepted body/camera/kit when adding them.

No game checkout, renderer, UI, launcher, saves or production assets were changed. These are isolated art outputs, so no gameplay harness claim is made. No external source imagery is included in this branch.
