# Player figures v04 — 32x64 human canvas

Owner-selected grid: 32x32 pixels per inventory cell / small monster; 32x64 for a typical humanoid occupying 1x2 cells. See `../PIXEL_GRID.md`.

Both existing v03 figures were rendered again through Blender MCP at an actual 32x64 resolution. Geometry, relaxed poses, female proportions, materials, lighting and camera properties are preserved. Vertical sensor fit retains the perspective and vertical framing while narrowing the horizontal canvas. Transparent padding remains; bodies are not stretched to fill the canvas.

`sources/player-32x64-v04.blend` is the editable milestone. Both figures are present; female is visible initially. Previous studies are preserved. `render_32x64.py` records the one-time revision from the existing v03 scene and is embedded in the Blender file. It was executed using `../player-unarmed-v01/mcp_run.py`.

The pre-generation pipeline is actual 32x64 RGBA render, alpha threshold at 128, shared integer translation of +2px vertically, then exact 8x nearest-neighbour enlargement to 256x512. RGB is preserved. `pixelize_and_review.py` reproduces guides, review boards and validation from the renders.

- `guides/*-logical-guide.png`: 32x64 transparent structural guides, common anchor (16,60).
- `guides/*-input-8x.png`: 256x512 structural inputs for later imagegen.
- `review/native-size.png`: actual 1x scale on light and dark backgrounds.
- `review/structural-review.png`: smooth inspection beside 4x pixel guides.
- `review/grid-comparison.png`: 1x2 human canvases beside a blank 1x1 cell.
- `validation.json`: dimensions, hashes, binary alpha, bounds and exact integer-block checks, all passed.
- `render-verification.json`: unchanged camera and actual logical render size.

The native-size and enlarged outputs were visually inspected. Visible body heights are 49px male and 47px female within their padded 64px canvases. Figures remain structural studies with unfinished faces, hands, hair and cloth. Figure/pose/style approval and runtime camera calibration remain pending. No imagegen call or game integration was performed.
