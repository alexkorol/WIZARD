# MakeHuman player bases and first imagegen candidates

The owner requested established male/female models to replace the primitive anatomy, and asked to run the resulting images through imagegen. Both figures now use MakeHuman's existing anatomical base mesh, adult phenotype targets and weighted `game_engine` rig via MPFB 2.0.17. Faces, hands and connected limbs come from this mesh. The previous male kit and female silhouette direction were fitted to the new models.

## Deliverables

- `sources/players-mpfb-v10.blend`: editable anatomical models, rigs, fitted kits and original scene work.
- `normalized/male-32x64.png`, `normalized/female-32x64.png`: transparent logical-resolution appearance candidates.
- `normalized/*-8x.png`: exact nearest-neighbour enlargements.
- `generated/*-original.png`: unmodified built-in imagegen outputs, including their baked checkerboards.
- `review/generated-candidates-4x.png`, `review/generated-native-size.png`: inspected light/dark review boards.
- `imagegen-prompts.json`: exact prompts and reference roles/paths.
- `imagegen-execution.json`: actual structural input hashes and generated output identities.

## Source and licence

MakeHuman Community MPFB repository: https://github.com/makehumancommunity/mpfb2 . Source commit `437dd513888a92399d1d3200d2e80859fae55abc`, manifest version 2.0.17. Core mesh, targets and rig assets are CC0; the asset licence is preserved in `licenses/MakeHuman-CC0.md`. The addon code is separately GPLv3 and lives outside this project. It is installed as `bl_ext.user_default.mpfb` in Blender's User Default extension repository. No proprietary model or downloaded reference image is packaged in git.

`import_bases.py` calls MPFB through the live Blender MCP connection. Both 19,158-vertex source basemeshes retain phenotype shape keys and built-in bone weights. Age macro 0.5 selects the young-adult endpoint, gender 0 female and 1 male. Target heights are 1.70m and 1.78m. `import-verification.json` records source dimensions, morphs and bones. `sources/imported-bases.blend` preserves the imported bases before fitting.

## Blender and pre-generation pipeline

The recorded recipe sequence is `import_bases.py`, `pose_and_fit.py`, `refine_fit.py`, `final_fit.py`, `finish_drape.py`, then `render_views.py`. Execute through `../player-unarmed-v01/mcp_run.py`; every invocation queries the scene first. The corrective recipes address garment intersections, obsolete primitive hair placement, shoes and shoulder coverage found during actual multiview inspection. They preserve earlier source checkpoints. Under-clothing masks hide covered skin, while the source anatomy remains editable.

The camera and lighting continue from the existing study. Actual Blender renders at 32x64 were explicitly pixelized with alpha threshold 128 and shared +2px vertical registration. The resulting transparent logical guides were enlarged exactly 8x with nearest-neighbour to 256x512. `validation.json` verifies all dimensions, alpha values, margins and every enlarged pixel block. Visible body heights are 50px male and 48px female. The exact `guides/*-input-8x.png` files were supplied as imagegen structural references. Smooth renders and comparison boards were not supplied.

## Imagegen and normalization

One built-in imagegen call was made per figure. The previously inspected Diablo II Amazon crop was supplied for pixel shading and clusters only, as an assistant-selected style candidate. The owner's latest image was also supplied to the female call for garment construction; the prompt explicitly gave the Blender guide control of camera, pose and layout. These reference choices are recorded, not labelled owner-approved style.

Both generations returned 887x1774 RGB images with painted checkerboards, despite the request for RGBA transparency. `normalize_generated.py` removes bright neutral pixels connected to the image boundary (channel spread <=20 and minimum channel >=120), retains the largest foreground component, preserves a full-size cutout, then crops and resizes uniformly using BOX to each guide's body height. It places the feet at logical y60 on a 32x64 canvas, thresholds alpha at128 and creates exact 8x enlargements. No palette limit was imposed. `normalization.json` records source/output hashes, crop bounds, dimensions and checks.

Native-size and enlarged normalized candidates were visually inspected on light and dark backgrounds. The final PNGs have true binary alpha, with no visible checkerboard in the review boards. The large imagegen outputs contain finer pseudo-pixel detail than a 32x64 grid; the normalized copies are the actual game-size candidates.

## Visible limitations

The female generation shifts toward a more frontal camera and changes head/hair proportions from the structural guide. The male stays closer to the elevated view but changes facial treatment, hand shapes and clothing detail. These are appearance candidates for review, not verified camera-faithful production sprites. The fitted Blender clothes also remain guide geometry rather than animation-ready wardrobe assets. Runtime displayed scale and final camera calibration remain unverified. No production assets, gameplay code or native checkout changed.
