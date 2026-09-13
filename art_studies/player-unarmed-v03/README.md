# Player figures v03 — relaxed idle and female silhouette

**UNAPPROVED structural revision. No image generation or game integration.**

Owner feedback: the female looked like a bulky male; the stance was awkward, and the arms should be lower. This revision edits the existing v02 Blender figures through Blender MCP.

Changes:
- Both figures: lower hands, softer elbow bends, less outward elbow flare, smaller foot stagger, less knee crouch, 2-degree forward lean and a mild shift of weight onto one leg.
- Female: shoulder width .350m, waist .235m, hips .365m; narrower upper arms, forearms, wrists, legs and feet; slimmer jaw and neck; a shaped continuous hide vest over the same tunic. Coverage, garment identity and hair design are retained.
- Clothing follows the revised body and pose. The prior foreground thigh/tunic overlap is no longer visible in the main camera render.
- Perspective camera, lens, shifts, lights, materials, procedural seed and canvas remain fixed. `pose-and-camera.json` records the unchanged camera and revised joint positions.

## Editable source and reproduction

`sources/player-relaxed-v03.blend` is the current editable source. The original startup scene and existing mesh/control names are preserved. Female collection is visible initially; switch male/female collection viewport and render visibility to inspect the other figure.

`revise_figure_and_idle.py` is the exact one-time revision from the saved v02 scene, also embedded as a Blender text block. It runs through `../player-unarmed-v01/mcp_run.py` and the configured Blender MCP server. Reuse this saved v03 file for further changes rather than reapplying the recipe. Previous .blend files remain in v01/v02.

## Pre-generation guide and inspection

- `renders/*-logical-render.png`: true-alpha 64x96 Blender renders.
- `guides/*-logical-guide.png`: deterministic alpha threshold, shared +1px vertical registration; no stretching or palette reduction.
- `guides/*-input-8x.png`: exact 8x nearest-neighbour 512x768 inputs for future one-figure imagegen calls.
- `review/structural-review.png`: smooth structural inspection beside 3x pixelized guides on light/dark backgrounds.
- `review/native-size.png`: guides at native 1x size.
- `review/multi-angle-inspection.png`: actual Blender camera, side, opposite and top renders, visually inspected.
- `review/provisional-scale.png`: common study scale with the missing selected current-player reference explicitly indicated.
- `validation.json`: hashes, dimensions, alpha, bounds, registration and integer-block checks. Visible heights: 75px male, 70px female. Intended anchor: (32,89).

`pixelize_and_review.py` rebuilds the guide and review images from the low-resolution Blender renders. Smooth renders and review boards must never replace the enlarged logical guide as the structural input to imagegen. No imagegen prompt has been executed.

The figures are still simple structural volumes with unfinished face, hair, hand and fabric treatment. Artistic approval, selected style and final intended player-plane scale/camera are pending. Third-party reference crops remain excluded under v01/references-local; source identities are in v01/reference-notes.md.

No native checkout, production asset, renderer, UI, launcher or save file changed. Art-only checks were run; no gameplay harness claim is made.
