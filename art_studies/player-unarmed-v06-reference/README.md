# Female v06 — supplied clothing and attitude reference

Owner rejected v05 as dowdy and supplied a photograph. This revision uses the actual image for clothing construction, loose hair and stance: cropped brown woven top with loose short sleeves, visible midriff, low belt with a round bronze disc, short cord skirt and hanging ties, long asymmetric hair, relaxed low hands and a wider grounded stance. The existing adult female body, editable controls and male study are retained. This is a basic-clothing variant of the unarmed study.

The photograph is a structural/design reference, not a verified historical identification or approved pixel-rendering style. Its original filename is `codex-clipboard-659b4270-46f3-4e8c-b6f5-69c73b6d50d2.png`; a preservation copy is excluded from git in `references-local/`. No third-party image is packaged in the commit.

`sources/player-female-v06.blend` is the editable result, with the earlier live scene preserved in `sources/before-v06.blend`. Recipes run through the actual Blender MCP connection using `../player-unarmed-v01/mcp_run.py`, in order: `revise_from_reference.py`, `finish_reference.py`, `close_sleeves.py`. The later recipes correct shoulder coverage/open sleeve caps identified in multi-angle inspection. They are embedded in the Blender result.

The fixed perspective camera and 32x64 logical canvas continue from the previous study. Actual Blender renders are preserved in `renders/`. `pixelize_and_review.py` thresholds alpha, registers both guides with a common +2px vertical translation and enlarges each logical guide exactly 8x using nearest-neighbour. Dimensions, bounds, binary alpha and every enlarged pixel block passed validation. `compare.py` makes review boards from saved outputs. The native-size, enlarged and side/opposite/top views were visually inspected.

At 32x64 the long hair, cropped top, waist gap, disc and stance remain visible. Fine cords and jewelry are simplified by the pixel grid; face and hair treatment remain rough structural volumes. The female visible body height is 47 pixels within the padded canvas. Runtime camera calibration and appearance remain unapproved. No imagegen call or production integration occurred.

Future imagegen must use `guides/female-input-8x.png` as the exact structural input after owner review, with a separately selected pixel-style reference. Do not substitute the smooth inspection render or comparison board.
