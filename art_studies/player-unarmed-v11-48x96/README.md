# 48x96 gritty pre-rendered trial

The owner requested a 48x96 test and a realistic, gritty Diablo II pre-rendered finish with less cartoon facial detail. This is an experimental resolution alongside the preserved 32x64 baseline, not a runtime grid migration.

Final transparent candidates: `normalized/male-48x96.png` and `normalized/female-48x96.png`. `review/generated-native-size.png` shows actual native pixels; `review/generated-candidates-3x.png` shows exact 3x previews on solid light and dark backgrounds. Individual PNGs have real binary alpha. Both boards were visually inspected.

## Editable source and render

`sources/players-mpfb-v11-48x96.blend` contains the existing rigged MakeHuman models and fitted clothing. `render_trial.py` opens the v10 source, changes only resolution/output settings and scene naming, renders through the actual Blender MCP connection, and saves this separate source. Geometry, pose, clothing and camera are preserved; the camera matrix is checked unchanged. The original source, licence and import provenance remain in `../player-unarmed-v10-mpfb/`. Source assets are MakeHuman CC0, with licence at `../player-unarmed-v10-mpfb/licenses/MakeHuman-CC0.md`.

Actual 48x96 RGBA renders are thresholded at alpha128, registered with a common integer +2px Y offset to anchor (24,90), and enlarged exactly 8x NEAREST to 384x768. Visible body heights are76px male and72px female. `validation.json` records guide hashes, margins and complete integer block checks. The resulting `guides/*-input-8x.png` images, not smooth inspection renders, were sent to imagegen.

## Generation and transparency

Two built-in imagegen calls, one per figure. Exact prompts and input paths are in `imagegen-prompts.json`; execution identities are in `imagegen-execution.json`. The second input is the previously inspected original Diablo II Amazon crop, used only for rendering style. The owner explicitly requested D2 style in this revision. No photographic costume reference was resupplied; the Blender guide carries the established silhouette.

The prompts explicitly request real PNG alpha, preservation of transparency and no checkerboard. Both tool originals nevertheless contain painted checkerboards and are RGB,887x1774. They are preserved unmodified in `generated/`; they are NOT transparent deliverables.

`normalize_generated.py` removes boundary-connected neutral background (channel range<=22, minimum>=75), retains the largest foreground component, saves full cutouts, then performs aspect-preserving BOX resize to each structural guide's body height. It registers feet at y90 and centers at x24 on the48x96 canvas, thresholds alpha128 and produces exact8x NEAREST previews. No palette reduction or creative repainting is performed. `normalization.json` records original/final hashes, actual modes and checks. Final PNGs have only alpha0/255; native and enlarged light/dark previews show no visible checkerboard.

## Visual assessment and limits

This pass has more realistic shaded facial planes, worn materials and less illustrated facial detail than v10. Both generations retain a downward view more closely than the previous female result. Imagegen still changes details such as the female ponytail, hem and hands; it produces much finer source detail than the requested logical grid. The normalized images are the actual48x96 candidates. These remain art studies, not exact silhouette/camera matches or animation-ready production assets. No gameplay, production asset, established grid or native checkout was changed.

To reproduce Blender/guide stages from the worktree root:

```powershell
uvx --python C:/Python312/python.exe --from blender-mcp==1.9.1 python art_studies/player-unarmed-v01/mcp_run.py art_studies/player-unarmed-v11-48x96/render_trial.py
C:/Python312/python.exe art_studies/player-unarmed-v11-48x96/pixelize.py
C:/Python312/python.exe art_studies/player-unarmed-v11-48x96/normalize_generated.py
```

Normalization consumes the preserved imagegen outputs; rerunning it does not make generation calls.
