# Female v07 — compact idle and broader reference use

Owner clarified that the supplied photograph was general inspiration and did not prescribe a wide stance or literal costume reproduction. This revision brings the feet closer, retains a mild depth stagger and small toe-out, and aligns the knees with the feet. Lateral ankle separation changes from 0.462m to 0.234m. Arms remain low. Clothing, hair, torso, male model, camera and lighting continue from v06 for a direct pose comparison. The costume remains exploratory.

Additional actual images inspected during this revision:

- Diablo II Amazon light sprites, previously saved in `../player-unarmed-v01/references-local/amazon-style-crop.png`: compact foot placement and readable silhouette at low resolution. Source image: https://www.spriters-resource.com/media/assets/51/54286.gif?updated=1755473105 . These sprites are larger than the selected 32x64 canvas and do not establish runtime scale.
- Guerrilla's Nora Huntress artwork: cropped hide layering, asymmetric hair and construction. Actual image: https://www.guerrilla-games.com/media/News/aloy-cosplay-guide1.webp . Used as a design reference for evaluation, not copied into the model in this pose-only revision.
- Guerrilla's Utaru Harvester artwork: natural-material layering and relaxed hand shape. Actual image: https://www.guerrilla-games.com/media/News/aloy-cosplay-guide2.webp . Its weapons, machine parts and intricate ornament are not selected VERDIGRIS requirements.
- Source article for the two official images: https://www.guerrilla-games.com/read/brand-new-cosplay-guides-for-two-of-aloys-new-outfits-in-horizon-forbidden-west . The separate Tenakth PDF exceeded the web reader's size limit and was not inspected; ArtStation search text was not used as visual evidence.

Reference files are excluded from git in `references-local/`. These sources are proposed visual references, not owner-approved pixel style, historical evidence or locked asset specifications.

`sources/player-female-v07.blend` is the editable result; `sources/before-v07.blend` preserves the earlier live scene. `narrow_idle.py` was run through the actual Blender MCP connection with `../player-unarmed-v01/mcp_run.py` after a scene query. It is embedded in the saved Blender source. `pose-verification.json` records joint coordinates.

Actual 32x64 Blender renders were explicitly pixelized using alpha threshold 128 and common +2px vertical registration, then enlarged exactly 8x with nearest-neighbour. `validation.json` records successful dimensions, margins, alpha and every-pixel enlargement checks. Native-size, enlarged before/after, side, opposite and top views were visually inspected. The narrower stance retains a visible gap between the legs at logical size.

This remains an unapproved structural guide with unfinished face and hair detail. No imagegen or production integration occurred. A future approved generation must use the exact `guides/female-input-8x.png` structural reference, with a separately selected pixel-style reference.
