# Female structure v05

Owner rejected the previous female figure's masculine, boxy appearance. This revision reshapes the existing female meshes through Blender MCP: narrower sloping shoulders, shaped ribcage and chest under one continuous hide vest, defined waist, fuller upper thighs, fitted tunic and a less angular head. The same plain clothing coverage and tied hairstyle remain. A side-view check prompted a correction to the tunic's ballooning hip volume.

The male logical guide is byte-identical to v04. The lowered-arm pose, 32x64 logical canvas, camera and lighting remain the basis for comparison. The shoulder and arm positions follow the revised shoulder width. No imagegen or production integration has occurred; this structure remains unapproved.

`sources/player-female-v05.blend` is the editable result; `sources/before-female-v05.blend` preserves the prior live scene. Reproduction from that checkpoint uses `revise_female.py` then `refine_cloth.py` through `../player-unarmed-v01/mcp_run.py`. Each recipe is also embedded in the result.

`pixelize_and_review.py` converts actual 32x64 Blender renders to binary-alpha guides, applies shared +2px vertical registration and verifies every pixel of the 8x nearest-neighbour enlargement. `compare.py` assembles review-only before/after and multi-angle boards. Guides have transparent padding and anchor (16,60). Validation passed for dimensions, bounds, alpha and integer blocks. The actual native-size, enlarged, side, opposite and top views were inspected. The female silhouette changed, but facial and hand detail remain unfinished structural volumes.

Use `guides/female-input-8x.png` as the structural reference for a future approved imagegen pass, never the smooth render or comparison board.
