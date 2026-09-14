# Transparent padding calibration

Two controlled ChatGPT Web image-generation tests, using the existing 96×96
Blender female sprint-right frames and the successful single-frame pixel example.
Conversation: https://chatgpt.com/c/6aa79da7-9128-83ea-87e7-360c33b468f2

Both outputs have native RGBA alpha (0–255). They were exported from observed
page assets without a browser Save File dialog. Prompts explicitly request the
transparent background setting; the internal web tool arguments are not visible.

| Test | Input layout | Returned PNG | Reconstruction outcome |
| --- | --- | --- | --- |
| v01 | 4 columns × 2 rows; 96×96 inner frames, 24 px margins; 576×288 at exact 3× | 1774×887 | Automatic 3 px rigid grid → 591×295. Fixed 96×96 crops discard foreground in all eight phases. Rejected. |
| v02 | 2 columns × 2 rows; phases 1–4 only; 96×96 inner frames, 16 px margins; 256×256 at exact 4× | 1254×1254 | Automatic mesh is anisotropic. Its own alternative 6 px rigid candidate → 208×208. Four 96×96 frames fit with zero recovered foreground loss. Low-confidence experiment, not approved art. |

Padding makes lossless frame extraction possible in v02; it does **not** establish
reliable 48 px/metre parity. The four recovered silhouettes are 73, 72, 70 and
68 pixels tall versus the corresponding Blender heights 78, 76, 71 and 71.
Their top bounds are 19, 20, 19 and 18 versus Blender 5, 7, 10 and 7: registration
and physical scale still differ. Imagegen also changes the braid and some limb
shapes. The review page intentionally shows these discrepancies without fitting
or centering the figures. Four consecutive phases are only half the motion cycle.

## Grid diagnosis

Neither test has a peaked grid score. The old “147” number is an automatic
sampling result, not proof of an authored 147-pixel grid. v02's winning mesh has
mean horizontal pitch 5.44 and vertical pitch 6.74: mapping each mesh cell to a
square would compress anatomical height by about 19% relative to width.

The local adapter rejects meshes whose axis pitch ratio exceeds 1.05 for these
square-pixel, unchanged-aspect inputs. It falls back to Pixel Respecter's own
previously selected rigid candidate and offset. It does not choose a pitch from
the desired 96-pixel dimensions. Full candidate diagnostics are retained in
`fit.json` and `audit.json`; the shared Pixel Respecter checkout was not modified.
The alternative rigid candidate is still low-confidence, so these are review
frames and have `game_ready: false`.

## Reproduce and verify

From the art worktree, with Python, Pillow, NumPy and the existing Pixel Respecter
checkout at `Z:/Code/Python/pixel-perfecter`:

```powershell
python art_studies/starter-derivatives-v01/web-padding-v01/build_guides.py
python art_studies/starter-derivatives-v01/web-padding-v01/process_padding.py
# v01 deliberately exits nonzero: its fixed crops would clip foreground.
python art_studies/starter-derivatives-v01/web-padding-v01/process_padding.py art_studies/starter-derivatives-v01/web-padding-v02
python art_studies/starter-derivatives-v01/web-padding-v01/verify_padding.py
```

The build verifies original native RGBA pixels and exact nearest-neighbor blocks.
Input/output hashes, layout origins, alpha, grid fit and transfer metrics are
saved. Crop verification checks that every nontransparent recovered pixel is
retained unchanged in its corresponding 96×96 frame. This guarantee applies to
padding/cropping **after** source-cell color/alpha reconstruction, not to every
high-resolution generated sample.

`diagnostic-crop-*.png` files are diagnostics, not approved exports. v01's are
explicitly clipped and must not enter animation playback or the game. v02's
`frames96.png` is a 192×192 review sheet; `frames96-3x.png` is exact nearest neighbor.

Visual review: native-size frames on dark and light ground, frame 1 and frame 4
alongside Blender, plus the 3× recovered sheet. Playback and frame selection were
checked in `demo/web-sheets.html`. No game sprites or gameplay code were changed.
