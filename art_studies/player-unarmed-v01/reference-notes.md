# Reference notes — proposals, not approvals

## Structure

Owner's direct brief: adult male and female basic/light armor figures, first unarmed. No previously selected player guide was supplied. The scoped inventory found existing tree/bowl guides but no relevant player .blend or generator to reuse. Primitive-based volume construction is new and is editable. No culture/faction, ornament or weapon was inferred.

## Style proposal: Diablo II Amazon (Light)

- Source page: https://www.spriters-resource.com/pc_computer/diablo2diablo2lordofdestruction/asset/54286/
- Original image: https://www.spriters-resource.com/media/assets/51/54286.gif?updated=1755473105
- Original dimensions: 2578x6403 GIF, inspected via a focused full-pixel crop.
- `amazon-style-crop.png`: crop rectangle **(7,14,219,92)** in original-image pixels, x1/y1 exclusive. Three town-neutral sprites, 212x78. Reference board shows this exact crop at 3x NEAREST.
- Proposed role: material shading, pixel clusters and selective edge contrast. The costume, bow, anatomy and game camera are not structural instructions.
- The web page returned 403 through web retrieval, but the original GIF downloaded successfully and was actually viewed. It is not approved or licensed for inclusion in game assets.

## Construction proposal: linen garment photographs

- UCL/Petrie Museum article: https://blogs.ucl.ac.uk/museums/2016/03/07/fashions-that-are-dated-but-timeless-the-petrie-museum-wardrobe/
- Actually inspected UCL image: https://blogs.ucl.ac.uk/museums/files/2016/03/ch_5_fig_1a.jpg
- Visible contribution: linen shoulder construction, neckline and broad cloth planes. No copying of archaeological damage, photorealistic treatment, or exact garment length. Article retrieval returned 502; the image itself downloaded successfully and was viewed.
- Pinterest discovery: https://www.pinterest.com/pin/186477240807282749/
- Actually inspected image: https://i.pinimg.com/736x/77/f6/42/77f6427401f80a060025ca52e1d45f79--linen-tunic-british-museum.jpg
- Visible contribution: simple rectangular tunic construction and neck opening. The pin caption is not proof of object origin or date. No original-source outbound link was exposed by the retrieved pin page. A possible museum record https://www.britishmuseum.org/collection/object/Y_EA2565 was found, but page access returned 403 and identity was not verified. Do not state this is the same object as established fact.

## Scale: missing selected current target

Read-only scoped inspection of `Z:/Code/Games/delaford/delaford_game` found:
- `docs/player-art-pipeline.md`: older browser human-v2 64px frames, sword/shield medieval prompt. Not adopted for this study.
- `native/client/assets/svg/player.svg`: 64x64 graphical placeholder, not an owner-selected calibration.
- `native/client/main.cpp` around line 9495 currently calls `vector_art::humanoid`, whose adult body/head unit constants are 100/12. This checkout is diverged from its upstream; it cannot establish the intended current look. No native checkout changes or launches were made.
- The current renderer's orthographic camera scaffold is also not authority to override the owner's requested elevated perspective straight-grid art view.

Thus neither the intended native player image nor a trustworthy selected gameplay camera/display size has been verified. The study uses a clearly provisional 64x96 canvas, common perspective camera, 1.78m/1.70m modeling heights and shared logical pixel density. The scale review explicitly leaves the current-player reference empty rather than substituting an older character.

All external imagery is retained only in `references-local/`, ignored and excluded from the branch push. URLs and crop coordinates are published as notes; no third-party sprite pixels are included in published review boards.
