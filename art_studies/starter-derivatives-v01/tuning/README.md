# Transfer and registration correction

The demo now starts with a playing, east-facing sprint. **Play walk** and
**Play sprint** explicitly select motion, unpause, enable stationary looping
and set the appropriate playback rate. A changing frame counter makes the
state visible. These buttons work even after selecting equipment or stepping
a paused frame. Keyboard focus on a button no longer disables WASD.

Use **Pixel transfer → Previous / Tuned** to compare the original extraction
and the corrected extraction/registration. The fixed cyan body axis exposes
lateral drift. Frame dimensions and failure to meet 48x96 are displayed near
the main controls. `demo/pipeline.html` compares generated, previous and tuned
pixels at the same source coordinates. It has synchronized scrolling and
light/dark background checks.

## What changed in pixel transfer

The previous Pixel Respecter path can globally quantize a noisy sheet before
selecting modal colors; rigid cells also exclude boundary samples from voting.
At exactly half opaque coverage, the old alpha-majority test clears the cell.
Those operations can remove meaningful colors and partially covered features.

`tune_transfer.py` uses the **same detected grid** to isolate the transfer change:

- All visible samples in a cell participate, including its boundary.
- Small local RGB bins group generation noise; the winning group supplies an
  actual source color. No global palette replacement, averaged new RGB color,
  sharpening, added outlines, dilation, or background color key is applied.
- Half-opaque cells remain opaque; lower-coverage cells remain transparent.
- Every output RGB is selected from its own visible source-cell samples.
- Reconstructed pixels are mapped back through the actual rigid/mesh boundaries
  to measure error against the source. No arbitrary resampling hides the loss.

For unarmed, visible RGB MAE improves 17.29 → 16.60 and boundary RGB MAE
15.78 → 12.49. For male sprint, they improve 14.10 → 13.37 and
14.83 → 11.65. Reports for all eight sheets are in `*-transfer.json`.
These are 0–255 channel-error measurements, not visual acceptance scores.
The alpha tie policy trades slightly more coverage for fewer lost edge samples;
silhouette IoU improves slightly on affected sheets. It does not create an
outline style. All changes aim to transfer the source's existing rendering.

`test_transfer.py` checks an exact 8x fixture with thousands of unique colors,
an irregular grid, a half-covered boundary cell, and transparent RGB contamination.
The exact-grid fixtures recover byte-for-byte. Generated art is not necessarily
an exact grid: when multiple meaningful colors occupy one inferred cell, one
output pixel cannot retain all of them. The coarse-vs-fine generation problem
is therefore still material, not solved by these improvements.

The shared Pixel Respecter checkout has unrelated changes. This revision
leaves that checkout untouched and implements the controlled transfer policy
in the art pipeline adapter. The detector still comes from Pixel Respecter.

## Registration and dimensions

The vertical sheet splitter also cut through overlapping sprite bounding boxes.
In male sprint east it removed 21 recovered hand pixels from frame 2 and
assigned them to frame 3 as a floating fragment. `component_split.py` assigns
complete connected figures to their cells instead. Detached small pieces are
associated with the nearest substantial figure; no recovered foreground is
deleted or duplicated. A synthetic interleaving-arms fixture checks this case.
Sheets with too few substantial separated figures are rejected for review.

The old code centered the generated sheet cells. That is not a stable body
anchor. Male sprint right drifted **14 logical pixels** between torso positions.
`register_frames.py` samples the linen torso, excluding skin/hair and the lower
swinging hem, then translates complete frames by integer pixels to a shared
body anchor. A contact sheet records the sampled landmarks. No fallback was
needed for this pack. This material-specific selector is for this linen-clad
cast, not a universal character rig or anatomy detector.

All four frames in each animation clip now have the same canvas size and
ground anchor, and the measured horizontal torso position is stable. Vertical
motion from the generated row is preserved. These corrections do **not** fix
the character size changing between generated actions. Enlarging canvases
preserves artwork but does not make oversized generated art valid at 48x96.

`audit_pack.py` checks actual PNG dimensions, alpha, measured torso drift,
within-clip dimensions/anchors, disconnected fragments, cross-action body
height changes, missing idle/walk/sprint coverage and recorded motion defects.
`--require-game-ready` exits nonzero on this pack. The interactive trial loads
it for review; a production export must pass that gate. Known wrong facings
remain human-reviewed source failures, not automatically inferred as correct.

## Prompt experiment

The two prompt files and untouched returned PNGs are preserved here. The
reference guide repeats one actual 48x96 recovered male pose four times and
enlarges it by exactly 8x NEAREST. The longer prompt also includes the original
identity sheet. The short retry uses only the pixel-exact RGBA guide. Both ask
for whole-pixel detail and the existing style, without imposing new outlines.

Both results were RGB checkerboard failures, returned at 1774x887 instead of
the requested 1536x768, and repeat leg leads. Their art looks coarser, but they
fail native alpha and motion review. `prompt-audit.json` records modes, sizes
and hashes. Neither entered the demo or was silently color-keyed. This prompt
experiment has not solved consistent 48x96 generation.

## Reproduce

From the parent study directory:

```powershell
python tune_transfer.py
python assemble.py --tuned
python register_frames.py
python test_transfer.py
python test_pack_audit.py
python audit_pack.py
node verify-demo.cjs
python audit_pack.py --require-game-ready  # expected rejection of this trial
```

The old `frames/` and `manifest.json` remain the previous comparison.
The demo's revised default uses `frames-tuned/` and `manifest-tuned.json`.
File/registration checks passing is distinct from a game-ready art pack.
