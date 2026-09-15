# VERDIGRIS art studies: current owner contract

## Current dimensions and workflow

- Starter scope: village-defense prologue. One base cell is 48 logical pixels; current humanoid motion frames are 96×96 with a shared [48,80] ground anchor. Preserve 48 px/metre at the player plane across actors and scenery. Earlier 32×64 and 48×96 studies are historical experiments, not current export dimensions.
- Editable Blender source → actual native-resolution render → exact integer NEAREST enlargement → imagegen simulated pixel art at the same implied pixel density → the existing Pixel Respecter reconstruction scripts at `Z:/Code/Python/pixel-perfecter`.
- The generated source must already contain coarse pixel clusters with gritty, realistic pre-rendered shading and natural proportions. Do not generate full-detail illustrations and downsample them into sprites.
- Do not force reconstructed art into the target by resizing or imposing an arbitrary grid. Empty padding and whole-pixel registration are allowed only after verifying that foreground pixels are preserved. Report scale, pose or camera drift as a failed candidate.

## Diagnose and verify the delivered result

1. Start with the exact page and frame the user sees. If Blender and the page disagree, compare source → native render → packaged PNG → manifest URL → browser-loaded image before editing the model. Compare decoded RGBA pixels when available; a refreshed label or a file on disk is insufficient.
2. Keep candidate exports separate from active assets. Inspect all changed frames and their animation sequence, every affected facing, native display size, and light/dark backgrounds. Check pose, identity, hair, grip, intersections, missing frames, loop transitions, dimensions and fixed origin.
3. Require technical validity, correct delivery and visual review separately. Never present a generated review JSON or passing dimension check as artistic acceptance. A user-rejected candidate remains rejected until the reported problem is resolved and rechecked.
4. Version image URLs by file content, including thumbnails, downloads and scenery. Load fresh manifests. Verify the actual browser assets against the current exports after promotion. If the browser cannot expose its loaded pixels, report that limit and verify through supported screenshots and asset inspection; do not claim a byte comparison.
5. For `starter-derivatives-v01`, use its Blender pose audit, `test_blender_pack.py`, and the actual demo. Export a fresh browser `pageAssets` bundle and run `verify_browser_assets.py <bundle-manifest.json>`. Follow `blender/pose-review/README.md` within that study; retain exact input/output hashes and review evidence. A new hash invalidates the old review. Add regression checks for proven failure modes instead of repeating failed generation batches.

## Character and transparency constraints

- Use existing anatomical models and dependable motion references. Inspect supplied successful examples and reuse their concrete features. Do not improvise anatomy from blobs or let imagegen repair structural Blender defects.
- Keep characters individually identifiable. The player female's recurring side braid is rejected; do not restore it through inherited meshes or a recipe override. Starter footwear exposes the foot through simple open sandals; no clog-like shoes. No awkward female shoulder cloth.
- The owner requested European facial-reference direction with individual faces. Keep beard geometry off the nose. Inspect weapon grips and garment/hair intersections in the actual final-facing frames.
- Current starter clothing: natural undyed flax/oatmeal/taupe crude fabric, without contrasting or red trim. The female cut should be sporty and practical, with a closer waist, freer armholes and a short split hem; earlier white/red costumes are appearance history.
- The owner requires the image-generation request's transparent-background setting. Inspect the callable schema at execution time and use a workflow that exposes the setting; never claim to have set an unavailable parameter. Repeat the true-alpha requirement through the prompt as requested.
- Inspect the untouched returned PNG's mode and alpha before processing. A painted checkerboard or a locally computed cutout does not establish native alpha. Keep failed alpha candidates out of the demo.

## Reuse and provenance

Preserve editable sources, exact prompts, input/output paths and hashes,
reconstruction settings and inspected previews. Do not alter unrelated local
changes in the Pixel Respecter checkout. Improving an art result does not
authorize uncontrolled repeated imagegen batches.

Historical alpha experiments are documented in
`starter-slice-v02-identities/native-alpha/README.md` and
`starter-slice-v02-identities/alpha-discovery/results.json`. Their successful
prompt examples are reference material, not proof of a current tool setting,
backend model identity, or guaranteed alpha support. Preserve historical
studies without loading rejected assets into active previews.
