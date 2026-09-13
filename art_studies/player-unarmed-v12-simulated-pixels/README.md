# Simulated48x96 pixel art through Pixel Respecter

This corrects the v11 workflow. Imagegen now creates coarse simulated pixel art from the already-pixelized48x96 Blender guide. The existing Pixel Respecter engine reconstructs the implied grid. A detailed generation is never shrunk into a sprite.

## Results

- `generated/*-original.png`: the unmodified simulated pixel-art generations, with visibly large pixel clusters and an olive-slate matte.
- `reconstructed/*_reconstructed.png`: actual Pixel Respecter CLI output, before robust matte cleanup and frame registration.
- `final/*-48x96.png`: reconstructed RGBA frames. Recovered foreground pixels remain unchanged after matte removal; only integer registration and empty margins are adjusted.
- `review/respected-native.png`, `review/respected-3x.png`: inspected native-size and exact3x light/dark previews.
- `review/*-source-versus-respected.png`: generated-source versus reconstructed-pixel comparisons, both visually inspected.

## Inputs and generation

The unchanged editable source is `../player-unarmed-v11-48x96/sources/players-mpfb-v11-48x96.blend`. Its actual48x96 renders were explicitly pixelized and enlarged8x. The exact `../player-unarmed-v11-48x96/guides/*-input-8x.png` images were supplied to imagegen, with the inspected Diablo II Amazon crop as rendering-style reference only. Smooth Blender inspection renders and v11 detailed generations were not supplied.

`imagegen-prompts.json` records exact prompts and paths. Two built-in calls were made, one per figure. The prompt makes coarse, flat-color implied pixel squares the primary deliverable, retaining realistic adult proportions and D2-like shading. A flat matte replaces the unreliable alpha request; final alpha is produced locally. The source matte has slight color variation, addressed with Pixel Respecter's existing border-connected removal at RGB-distance tolerance24.

## Existing engine and processing

Engine: `Z:/Code/Python/pixel-perfecter`, base commit `cf7786cb438ad51be5dfc08d963c2a6edcfd72f7`, with preexisting local modifications. This study did not modify that checkout. `reconstruction.json` hashes the actual engine sources used, records grid metadata, original/final hashes and pixel-preservation checks.

Executed its existing CLI with the generated directory, `--transparent-bg --skip-overlays`. Both detected cell sizes were18 physical pixels; male offset(7,0), female(1,7). Automatic reconstruction produced48x98 male and49x98 female canvases. It was not forced to48x96. The engine uses its own quantized label-space / cell-color reconstruction; no extra palette option was requested.

`finish_respected.py` uses the existing `make_border_connected_transparent` and `remove_background_speckles` helpers. Initial adaptive tolerance left olive edge cells at the female toe; inspected cleanup with explicit tolerance24 removed those matte remnants. The final speckle pass removed zero additional cells. Final registration is male(-1,0), female(-1,-1), with feet at y90. Every remaining foreground pixel/color is verified identical before and after frame registration. Final PNGs are48x96 RGBA with alpha0/255; exact8x previews are also verified. No BOX, bilinear, Lanczos or arbitrary sprite resizing is used in processing. A display-only source thumbnail appears in comparison boards and is never fed to reconstruction.

`reproduce.py` repeats these local steps on the preserved source images. It makes no generation calls. The steps were already executed separately during this study.

## Inspection and limitations

Both generated sources visibly contain simulated pixel clusters before processing. The reconstructed sprites were inspected at native size, enlarged on light/dark backgrounds and beside the source. Male auto reconstruction emitted `Core mismatch7.9% - inspect alignment`; the comparison remains readable but reconstruction changes some cluster boundaries. The warning is retained in the metrics, not treated as an exact-fidelity pass. Female reported tolerant core difference4.06%. The CSV also contains strict raw-color differences, which should not be confused with those tolerant values.

Imagegen changed the figure occupancy: final visible heights are79px male and81px female versus the Blender guides'76px and72px. This is a remaining generated scale drift; the figures were deliberately not resized to conceal it. Camera/pose and hair details remain approximate. This is a corrected-workflow study for review, not an approved animation frame set or production asset replacement.
