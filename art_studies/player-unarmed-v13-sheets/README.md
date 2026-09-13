# Sprite-sheet layout trials

Owner request: try1x4,2x2,2x4 sheets. Layout notation here is **rows x columns**. Each frame targets48x96 implied logical pixels. All views are unarmed idle rotations, not a walk animation.

| Layout | Contents in row-major order | Final sheet |
| --- | --- | --- |
| 1x4 | Female: front, right, back, left |192x96 RGBA|
| 2x2 | Female: front/right above back/left |96x192 RGBA|
| 2x4 | Male four directions above female four directions |192x192 RGBA|

`final/*-sheet.png` are native transparent sheets; `frames/` contains the extracted48x96 PNG frames. `review/sheet-comparison-2x.png` shows every layout at exact2x. Native light/dark previews and exact3x sheet enlargements are included. No production game assets or runtime grid changed.

## Blender -> pixelized guides -> simulated sheet

`render_directions.py` ran through actual Blender MCP, querying the scene first via the existing runner. It opens the preserved v11 source, parents each character's complete existing kit/anatomy roots to a direction pivot, renders four90-degree turns at actual48x96, verifies the camera matrix unchanged, and saves `sources/players-four-directions.blend`. No anatomy, clothes or poses were rebuilt. The fitted MakeHuman source and CC0 licence provenance remain in v10. Direction names are nominal relative to the inherited slightly turned idle pose.

`build_sheets.py` thresholds alpha128, applies the same integer(0,2) registration to every render, packs the logical sheets and enlarges them exactly8x NEAREST. Every enlarged pixel block is verified. `sheet-manifest.json` records cell order and exact input hashes. All eight directions and three structural sheet inputs were visually inspected before generation.

One built-in imagegen call per layout, three total. The structural sheet controls composition and implied pixel density; the inspected Diablo II Amazon crop supplies rendering style only. `imagegen-prompts.json` and `imagegen-execution.json` preserve exact requests and original identities. `generated/` contains unmodified output sheets that already show simulated pixel clusters. No smooth or detailed-render intermediate was generated.

## Pixel Respecter

The existing engine at `Z:/Code/Python/pixel-perfecter` processed each **whole sheet once** through its CLI, using `--transparent-bg --skip-overlays`. No independent per-frame grid detection was performed. The checkout's preexisting changes were preserved; this study did not modify it. Actual engine source hashes are recorded.

- 1x4: automatic3px selected an excessively fine590x295 grid and emitted a small-grid warning. `inspect_grids.py` saved detector evidence and existing-engine reconstructions for8px,9px,10px. All three were visually compared;10px, offset(2,5), was selected. It is the highest-scored autocorrelation candidate, not a grid invented to force target dimensions. The recovered sheet is177x88.
- 2x2: automatic8px grid, offset(6,0), recovered110x221. The8.0% tolerant core mismatch warning remains recorded.
- 2x4: automatic variable mesh (nominal6px), recovered218x213. The8.6% tolerant core mismatch warning remains recorded.

`grid-diagnostics.json` retains full grid evidence and metrics, including the2x4 mesh lines. Candidate review is reproducible with `inspect_grids.py`. The CLI strict color-difference CSV values differ from tolerant alignment diagnostics and should not be interpreted as acceptance scores.

`finish_sheets.py` uses the engine's border-connected matte removal at RGB-distance tolerance24 and conservative background-speckle helper. It splits the recovered grid at regular sheet-cell boundaries, then applies one shared integer translation to **all frames within each layout**:1x4(2,10),2x2(-4,-12),2x4(-3,-5). Only empty margins are cropped/padded. Every remaining foreground pixel and color is verified unchanged during frame registration. All16 frames fit without sprite resizing; output alpha is binary0/255 and integer3x enlargements are verified.

## Visual review

All three generations preserve requested sprite counts and direction order. Clothing colors and the female shoulder-cloth side stay reasonably coherent across rotations. The2x4 reads most cohesively as a male/female set. The1x4 is smaller and softer after its selected reconstruction; the2x2 and2x4 remain denser. Imagegen did not lock the exact implied48x96 pixel density across layouts. Final frames are48x96 canvases, but body occupancy differs because recovered pixels were preserved rather than resized to disguise that drift. Faces and side views are somewhat more frontal/illustrative than the Blender camera. These are layout experiments for review, not approved production animation sheets.

Native light/dark and enlarged results were inspected. Source rendering, layout, generation, reconstruction and final frame hashes are retained. The editable blend and every prior study remain available.
