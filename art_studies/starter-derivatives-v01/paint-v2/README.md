# Natural linen starter wardrobe

The current deliverable is the updated **Blender reference set**, not an
accepted painted game-sprite pack. The demo defaults to `manifest-linen.json`:
128 native 96×96 frames, male/female walk and sprint, four cardinal facings,
eight phases per cycle, fixed [48,80] origin and 48 logical pixels/metre.

The tunic uses undyed oatmeal flax and a natural cord. Decorative neckline
bindings are hidden. The female hem is shorter: its bottom panel rows are
interpolated upward along the existing simulated cloth surface in every
baked phase. Pose, anatomical rig, camera, hair and footwear are unchanged.
This is a garment mesh edit, not a new cloth simulation. The source panel
topology is the existing 33×37 front/back panel from `revise_models.py`.

## Files and rebuilding

- `blender/*linen*.blend`: editable wardrobe milestones. Female `linen-sport`
  is current; the unshortened female intermediate remains local.
- `linen_sources.py`: preserves the original reviewed scenes and creates the
  linen material/binding variants. `sporty_cut.py` applies the female cut.
- `linen-references/`: untouched native renders plus larger inspection views.
- `review/linen-review.json`: reviewed native render and source hashes.
- `package_linen.py`: validates the reviewed hashes, thresholds native alpha
  at 128 and retains every covered native RGB pixel without resampling.
- `linen-frames/`: packaged native RGBA PNGs used by both review pages.
- `prepare_guides.py`: packs the current linen export on an exact 5× NEAREST
  grid. It removes only empty side margins and proves that all foreground
  pixels survive. Current inputs are under `inputs/linen-v1/`.
- `verify_linen.py`: complete phases, true binary alpha, native RGB transfer,
  margins, content hashes, fixed origin, camera calibration and preservation
  of the original scenes.

Run these from the art worktree:

```
python art_studies/starter-derivatives-v01/paint-v2/verify_linen.py
python art_studies/starter-derivatives-v01/test_blender_pack.py
node scripts/wizard-lab.mjs verify
```

The browser bundle was checked using `verify_browser_assets.py` with
`manifest-linen.json`. All 128 delivered RGBA images matched current exports.
Both wardrobe versions in the village comparison use the same motion phase.

## Paint experiments — not accepted

Exact prompts and a hash/status ledger are preserved. Untouched failed PNGs,
reconstruction candidates and intermediate previews remain local and are
not linked by either active demo. Do not promote them merely because they
contain eight figures or can be cropped into 96×96 canvases.

The ChatGPT requests explicitly asked for imagegen's transparent background
setting. Its hidden invocation was not exposed for verification. Returned
PNGs do have native alpha: the latest files contain transparent regions and
foreground alpha near 253–254. The inspection viewer displayed hidden RGB as
a brown glow; normal alpha compositing showed that these regions were
transparent. A maximum alpha of 254 is not proof of a failed cutout.

The blocking paint defects are inconsistent implied pixel density, row
registration, and character/style changes. The coarse edit restored visible
pixel clusters but did not establish consistent scale and appearance across
the cast. The final generator trials also precede the completed Blender
wardrobe revision; use `inputs/linen-v1/` for subsequent work.

`reconstruct_sheet.py` is an experimental candidate inspector. A selected
detector grid is not artistic or scale acceptance. The reconstructor's
automatic grid selection can mistake sparse-sheet gutters for pixel pitch.
Never force a candidate into the target by resizing it. The game-ready flag
remains false until the actual painted cycles pass visual and delivery review.
