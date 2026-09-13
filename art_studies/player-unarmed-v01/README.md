# Unarmed player figures — structural study v01

**UNAPPROVED. No image generation or production integration has occurred.**

Owner brief: first male and female figures in basic/light armor, unarmed. Later variants: darts; a knapped flint hand axe held directly without a handle or bindings; a small ritual bowl.

## Review

- `review/structural-review.png`: Blender structural renders alongside logical guides enlarged 3x with nearest neighbour on light and dark backgrounds.
- `review/native-size.png`: actual 64x96 logical guides displayed at 1x.
- `review/multi-angle-inspection.png`: actual camera, side, opposite and overhead Blender renders, visually inspected.
- `review/provisional-scale.png`: both figures at the same provisional camera and world pixel density. The intended current reference player remains missing, so this is not verified game-scale parity.

Both have short linen tunics, plain hide vests, belts, wrist guards and hide footwear with equal coverage. These are proposed construction choices. Male/female height, shoulder, waist, hip and head dimensions are in `parameters.json`. The body proportions and clothing are unapproved; the neutral material blocks are not an approved final art style.

## Editable Blender source

`sources/player-unarmed-v01.blend` retains the original `Scene` with Cube, Camera and Light. The separate `VG_Player_Unarmed_v01` scene contains named male/female collections, clothing objects, shoulder/elbow controls and hand sockets for later props. Female viewport/render visibility is initially off so the two figures do not overlap; toggle collections to inspect her. Both share the exact perspective camera, 35-degree elevated view, straight world grid and -18-degree body yaw. The camera is provisional, not a selected runtime calibration.

`build_guides.py` and `parameters.json` are also embedded as Blender text blocks. Reuse the saved model for revisions. `sources/before-cloth-padding-fix.blend` preserves the initial blockout. `refine_and_inspect.py` records the one-time correction applied to that initial file; do not run it again on the final file. The clean-build recipe already includes the correction.

Modeling and rendering used `execute_blender_code` through the actual Blender MCP 1.9.1 stdio server, connected to Blender 5.2.1 LTS at localhost:9876. The task's native tool catalog had not refreshed, so `mcp_run.py` used the MCP SDK client to call that configured server; no direct socket or standalone headless modeling substitution was used. Scene queries passed before modeling. Telemetry was disabled. `scene-verification.json` records the final scene checks.

## Exact pre-generation preprocessing

1. Blender renders each figure directly to a transparent **64x96** image (`renders/*-logical-render.png`). A separate smooth 384x576 render exists only for structural inspection.
2. `pixelize_and_review.py` preserves the low-resolution RGB and thresholds alpha at 128. It translates both figures down two logical pixels, giving the same foot anchor (32,89), and canonicalizes invisible RGB to zero. No stretching, palette reduction or smooth-render downsampling occurs.
3. The exact logical image is enlarged **8x nearest neighbour** to 512x768. Each source pixel becomes a uniform 8x8 block. Dimensions, alpha, margins, hashes and roundtrip checks are in `validation.json`.
4. After owner feedback, supply **only `guides/male-input-8x.png` or `guides/female-input-8x.png`** as the structural reference to the corresponding one-figure image generation. Supply the owner-selected style crop separately. Never supply the smooth inspection render or a review board as the structural input.

The measured visible heights are 76px male and 73px female. The 80px projected bounding-box fit was a provisional framing choice; it is not a claim that the visible body is 80px or that the game calibration is verified.

To regenerate deterministic pixel guides/review boards: `python pixelize_and_review.py`. Blender recipes must go through `mcp_run.py` using an environment with the MCP package. No gameplay files changed, so gameplay harnesses are not relevant to these art-only outputs.

## Reference and approval status

See `reference-notes.md`. Downloaded third-party source imagery, crops and the reference proposal board are in ignored `references-local/` and are excluded from Git. None is published as a Verdigris asset. No style reference has been selected by the owner. No imagegen prompt was executed and there is no generated candidate or normalized generated output yet.

Next intervention: review body proportions, clothing silhouette, stance and provisional camera; select the style reference before the first appearance pass. Preserve the accepted guide for subsequent equipment variations.
