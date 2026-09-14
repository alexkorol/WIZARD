# Web generation intake

Source: https://chatgpt.com/c/6aa7950f-8d30-83ea-b96f-40e71d25015f

The owner supplied this conversation and its directional sheets. Eleven unique PNGs were recovered, all native RGBA at 1774×887. Labels were assigned by inspecting the actual images; no missing facing is filled by a different clip. `intake.json` preserves untouched file hashes.

The existing Pixel Respecter automatically selects 3-source-pixel sampling in these sheets. `process_web.py` uses that selection and the existing tuned, source-sample transfer; it does not impose 96×96 by shrinking the recovered art. Each automatically recovered cell is around 147×147. **This number is not proof of the authored pixel size:** the calibration experiments below expose ambiguous grid evidence and a fine-sampling fallback. These candidates remain unapproved. The demo's `web-sheets.html` plays the recovered samples at integer zoom beside their 96×96 Blender references. Its inferred cell anchors intentionally expose drift; they are not accepted root tracking.

## Unattended export

Use the supported browser `pageAssets` capability on a freshly loaded, isolated copy of the supplied conversation. Read the generated-image DOM sources, inventory page assets, then `bundle` matching observed image assets into local files. Do not use `downloadMedia()` or the browser Download control: those invoke the owner's Save File dialog. Direct export was verified against all eleven earlier files by SHA-256, with zero mismatches and no save dialog. An older live tab's asset inventory returned stale/incomplete coverage; a fresh read-only tab resolved that issue without modifying the owner's draft or download preferences.

## Coarse-pixel experiment

One follow-up was submitted in the same ChatGPT conversation with `coarse-prompt.txt` and two uploaded PNGs:

- `../chatgpt-web-handoff/pose-sheets/female-sprint-right.png`: actual 96×96 Blender cells, enlarged 4×, in a 4×2 sheet.
- `pixel-example-4x.png`: the already-authored 48×96 starter female side frame, padded to 96×96 without changing its pixels, enlarged exactly 4×. This teaches pixel scale/shading, not pose or weapon.

The prompt asks for an actual coarser painting with about 1.5× larger clusters, native alpha, and unchanged body size/poses. It requests the transparent-background setting through ChatGPT; the internal setting is not observable from the page. Verify the returned PNG itself and reconstruct its grid before accepting the pass. No new equipment/armor/casting/monster batch has been requested yet; establish this scale-controlled recipe first.

The first pass (`coarse-generated.png`) returned native RGBA and automatic 4-pixel sampling, around 110×110 per cell. A second targeted pass (`coarse-generated-v2.png`, prompt `coarse-prompt-v2.txt`) returned native RGBA but automatic 3-pixel sampling. The second pass has a stronger rigid candidate at 6 pixels and a projection mesh near 5.65 pixels. The detector marks its score curve unpeaked and chooses the fine fallback; it cannot be treated as ground truth. `coarse-v2-mesh.png` is an explicitly separate candidate reconstruction, not a promoted replacement or resize. Both passes still require grid/pose review.

A third, isolated experiment uses a fresh ChatGPT conversation and `single-prompt.txt`, with `pose-single-8x.png` and `pixel-example-8x.png`. Both guides have identical 768×768 dimensions and exactly 8× native blocks. It tests one sprint frame without the earlier high-detail sheet history.

**Result:** https://chatgpt.com/c/6aa79da7-9128-83ea-87e7-360c33b468f2 returned a native RGBA 1254×1254 PNG. Pixel Respecter selected a 13-pixel grid automatically and recovered **96×95**, with a 45×75 foreground bounding box. `single-frame96.png` adds one transparent bottom row, preserving every recovered RGBA sample. `single-frame96-4x.png` is its exact nearest-neighbor enlargement for reuse as a painting reference. The viewer defaults to this isolated scale test; animation controls are disabled for its single frame. The other sheets retain working playback and step controls.

This is evidence for a workable lower-resolution generation pass, not approval of the whole animation pack. Hair/identity, precise pose registration and consistency across a new sheet still need checking. No forced grid, resize, invented extra frame or cross-sheet facing substitution was used to make this result fit. `single-audit.json` preserves the full detector evidence and raw alpha/hash; `process_single.py` reproduces recovery.
