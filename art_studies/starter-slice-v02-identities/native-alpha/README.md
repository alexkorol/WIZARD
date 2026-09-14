# Prologue cast — native returned alpha

This is the preferred output of the v02 study:32 frames across four sheets, with actual alpha returned by the final built-in imagegen calls. Humans remain48x96 and monsters96x96. It is an unapproved idle art study, not production animation.

## Working transparency recipe

Use short positive requests for a transparent PNG, supply a clean transparent structural guide or edit target, and explicitly preserve transparency during edits. Keep appearance constraints concise. Do not use an RGB image of a transparency preview as the next edit target.

Six consecutive diagnostic/production calls using this pattern returned real RGBA PNGs:
- One minimal club generation with no input image.
- One fresh player-sheet generation directly from the transparent pixelized Blender guide.
- Four preservation edits for the corrected players, villagers, defenders and beasts.

The last four edits used the earlier locally cleaned RGBA appearance sheets to retain corrected art and grips. Their output alpha was returned by imagegen, with no background-color removal afterward. The separate clean-Blender-guide test demonstrates that locally masked generation is not required for native alpha. That fresh test still had a missing club, so it was retained as a transparency diagnostic rather than selected art.

This is empirical evidence for a working recipe, not proof that prompt length alone caused the earlier failures or a guarantee for every future call. Earlier prompts, multiple references and painted-background edit targets changed together. The tool exposes no model selector or model-identifying result metadata; no specific backend identity is claimed.

Current official guidance confirms that Image2.5 supports transparent output and that API callers can explicitly set `background="transparent"` with PNG/WebP. The built-in tool used here does not expose that parameter, but the tests prove it can return native alpha through its available prompt interface. Sources checked2026-09-13:
[Image generation](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output),
[Image prompting](https://developers.openai.com/api/docs/guides/image-prompting#create-a-transparent-product-cutout).
The older local skill's Image2 transparency limitation is not evidence for current Image2.5 behavior.

## Files

- `generated/*-original.png`: untouched final native RGBA outputs.
- `*-alpha-audit.json`: mode, PNG color type, original hashes and transparent-pixel counts.
- `prompts/*.txt`: exact successful short edit prompts.
- `frames/*.png`:32 registered sprite frames.
- `final/*-sheet.png`: four sheets, each two rows by four columns.
- `review/*-native-alpha.png`: every direction at actual pixels on light and dark backgrounds.
- `review/prologue-cast-2x.png`: cast preview at integer2x.
- `../alpha-discovery/`: minimal and clean-guide prompts, untouched test images and six-call audit.
- `../sources/`: revised human Blender scenes; beast scenes are in `../../starter-slice-v01/sources/`.

All original player/NPC anatomy, outfit, pose and progression decisions are documented in the parent README. Nose-covering beard surfaces and wrist-based weapon placement were corrected in the sources before this appearance pass.

## Pixel pipeline and checks

The final images continue the Blender48x96 render → integer-enlarged pixel guide → simulated pixel art → Pixel Respecter workflow. No detailed illustration was downsampled into the sprites.

`process_native.py` rejects a raw image without native alpha. For binary sprites, it thresholds the returned alpha at128 and zeros hidden RGB; it never keys background colors. This also excludes nearly invisible colored edge pixels with alpha1–2 in the returned originals.

The existing Pixel Respecter detects candidate grids. Human6px and beast5px candidates were visually selected from its actual candidate tables, retaining the same intended pixel scale as the study. Default auto results are preserved and sometimes unsuitable. Recovered pixels are registered with integer translation only; every foreground RGBA pixel must survive unchanged. The exact selected grid/offset and per-frame translation are in `pack-verification.json`.

Native/light/dark and enlarged views were inspected for clubs, poles, tablet, garment seams, beards, feet, outlines and transparent gaps. The imagegen edit can still shift small appearance details; this is not an animation-consistent turntable or an all-poses clipping certification.

Run `process_native.py`, `inspect_grids.py`, `finish_pack.py`, then `package_art.py` to reproduce processing from the preserved returned originals. The archive includes32 frames, four final sheets, the four untouched native PNGs, prompts, audits and review previews.
