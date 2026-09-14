# Village-defense prologue — individual models and corrected grips, v02

This revision supplies 24 new human idle frames and reuses the eight monster frames from v01: 32 frames total, four directions per actor. It is an art study for the village-defense prologue, with no game integration or production animation claim.

## Review and use

- `review/prologue-cast-2x.png`: cast overview at an exact 2x pixel enlargement.
- `review/*-native-alpha.png`: all four directions on light and dark backgrounds, actual pixels.
- `final/*-sheet.png`: four two-row, four-column sheets.
- `frames/*.png`: individual RGBA sprites. Humans are48x96; the carried-over beasts remain96x96.
- `sources/*.blend`: six independently saved editable human variants. Monster sources remain in `../starter-slice-v01/sources/`.
- `prologue-cast-frames-v02.zip`: frames, sheets, review previews and provenance documents.

Column order is front, right, back, left. Player sheet rows are male/female; villagers are field-hand/scribe; defense is scout/defender; beasts are pack-wolf/well-alpha candidate. NPC names denote proposed village roles, not newly established named canon.

## Owner direction applied

The two owner starter references show young athletic adults in simple single off-white sleeveless linen tunics, narrow russet binding, waist cords and crude wooden clubs. The open sandals come from the first reference. Both players now use that novice outfit, with no vest, cloak, bracers or travel harness. Small reference jewelry was not modeled in this pass.

The owner explicitly selected European facial-reference direction. Each human uses its own facial morph values, hairstyle mesh and assembly proportions, while retaining the same established CC0 MakeHuman anatomical foundation and rig topology. These are independent character variants, not six independently sourced body models. Source acquisition/license provenance remains in `../player-unarmed-v10-mpfb/`.

Player male: long dark-blond hair and short jaw beard. Player female: one brown braid. Field-hand: grey cropped-back hair and beard. Scribe: dark centered nape coil. Scout: short auburn crop. Defender: bald and clean-shaven. The inherited universal female side-tail is hidden in every revised source.

The owner's later bronze spear/shield, leather harness/bracer, cloak and travel-equipment reference is **level12–15 progression**, explicitly excluded from this starter revision. Original user images are referenced by path and hash in `owner-reference-directions.json`; they are not redistributed.

## Source corrections and inspection

The former beard selection used a broad height band that included nose vertices. The replacement uses a cheek line rising away from a bare central nose/lip region and a thinner jaw surface. Both bearded actors were inspected in front and side views.

Props now derive their handle position from the curled index/middle/ring/pinky grip centers rather than the wrist origin. Thumb opposition is posed toward the handle. Clubs, staff, spear and tablet are attached to the hand bone while preserving their world transforms. Pole holders' right forearms move forward so shafts clear the forearm and tunic. Clubs were turned upright to retain their full silhouette inside the frame.

The tablet now hangs from its grasped top edge; it is naturally edge-on in the front view. It is not a stick. The body's under-clothing mask now retains arm skin. NPC guide clothing uses one continuous visible surface with material-defined vest panels, avoiding duplicate overlapping shoulder/armhole shells. Hidden historical meshes are retained in the editable scenes; they are not rendered. This is a low-resolution idle-guide construction, not simulated layered cloth.

All six models have four384x768 inspection renders beside their actual48x96 renders. `review/*-model-four-views.png` records front/right/back/left inspection. This checks the supplied idle poses only; other poses and animation still require their own collision checks.

## Exact production chain

1. Existing editable MakeHuman/Blender anatomy, individually morphed and dressed.
2. Actual48x96 Blender render for each human direction.
3. Alpha threshold128 and integer(0,2) guide translation; exact8x NEAREST enlargement to a1536x1536 sheet. The script verifies enlargement equality and no foreground loss.
4. Built-in imagegen generates already-coarse simulated pixel art in the implied48x96-per-frame style. The D2 Amazon crop is style-only; the owner illustration is clothing/hair/face direction only. Neither changes the structural camera.
5. Three first-pass human sheets were generated. The player sheet needed two targeted edits: restore missing female side-view clubs and separate the male free hand; then correct the rear braid's side. All prompts and untouched outputs are retained.
6. Existing Pixel Respecter at `Z:/Code/Python/pixel-perfecter` reconstructed the implied grid. Its actual detector candidate tables are retained. The6px candidate was inspected against5/7/8px candidates and selected for all human sheets; it retained readable grips, toes and facial shading at the intended scale. Automatic reconstructions remain available.
7. Only whole-pixel frame translations and empty-margin cropping register reconstructed pixels into48x96. No resizing, BOX/Lanczos reduction, or forced arbitrary reconstruction grid. Every recovered foreground RGBA value is verified unchanged in the registered frame.

Imagegen output is1254x1254, not the requested1536 grid. Its pixel scale and silhouette occupancy drift from the guide; the recovered6px sheets are208/209 pixels square before empty-margin registration. These are authored sprite studies, not exact reproduction of Blender geometry or animation-consistent turntables. Feet are registered per frame, and club apparent length still varies with view.

## Alpha truth

**Every untouched human generation and both player edits are RGB PNGs with painted checkerboards. They failed the repeated true-alpha request.** The final RGBA alpha is locally derived, not supplied by imagegen.

The local cleanup floods boundary-connected light neutral background, recognizes enclosed neutral checkerboard components, and removes tiny disconnected neutral noise. Exact rules are in `process_sheets.py` and the alpha audits. Retained visible RGB is unchanged during masking. Final alpha is binary0/255 with zero RGB in transparent pixels. Both native and enlarged light/dark previews were inspected; mathematical alpha existence alone is not treated as visual acceptance.

## Reproduce / verify

Run the live Blender MCP recipe by setting `IDENTITY_TARGET` and executing `revise_models.py` in the established Blender/MPFB installation. Its referenced base scenes and local MPFB targets must be available.

Then run, with the installed Python/Pillow/NumPy/SciPy and existing Pixel Respecter checkout:

```text
python prepare_guides.py
python process_sheets.py
python inspect_grids.py
python finish_pack.py
python package_art.py
```

The imagegen calls themselves use the built-in tool and the persisted prompts. The Pixel Respecter checkout was used without modifying its unrelated local changes; source hashes record the actual engine used. No gameplay change was made or claimed, so the gameplay goal harness is outside this art-only revision.
