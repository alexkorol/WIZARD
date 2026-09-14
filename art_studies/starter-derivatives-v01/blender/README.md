# Blender structure and player-plane recovery

The old village mixed a 320×320 dwelling, 384×384 tree, 384×288 shrine and
335×224 terrain image, with individual runtime scales of 0.8, 0.65 and 0.45.
Those canvases had no common world-size calibration. Integer scaling of the
characters alone did not establish parity. The legacy files are retained for
provenance but are no longer loaded as village scenery.

The replacement **structural review scene** retains the existing male player's
perspective camera transform, elevation and pixel focal length. Its larger
576×384 canvas expands the field of view without changing scale at the player
plane. One metre across that plane projects to **44.39376 logical pixels**.
The metre grid, metre-sized geometry and camera parameters are saved in
`parity/camera.json`. This verifies the shared Blender reference scale; it is
not a claim that the older generated sheets meet it. Generated scale drift
remains visible and those sheets remain unapproved.

The demo composites scenery and characters into one logical raster before
integer display enlargement. Character size changes with perspective away
from the reference plane. Its projected ground points are checked against
Blender. Actors are depth-sorted against the scenery. Moving sprites are
billboards scaled by ground depth, so off-centre 3D parallax is approximate.
The demo has no collision or combat and is not a production renderer change.

## Anatomy, binding and cloth

`bind_and_pose.py` reuses the existing separate male/female MakeHuman models.
It bakes their fitted stance into the rig's rest pose without replacing anatomy,
binds the tunic, attaches sandals to foot bones and hair/braid to the head, and
authors eight alternating leg phases with a fixed root. The camera is 48×96
throughout. Idle framing clipped the longest stride/hand reach; the sprint arm
swing and step were compacted, and transparent margins were set once per
facing. Ground anchors are `(24,76)` front/back, `(20,76)` right, `(28,76)` left,
shared by both sexes and gaits. These are principal-point shifts only: world
scale and perspective do not change. The demo applies each anchor so the root
does not move when facing changes. Native exports reject occupied edge pixels.
Early skin-weight and per-pose collision-correction trials still
showed visible thigh intersections; they are not the final exported reference.

`cloth_trial.py` sets up actual Blender Cloth physics with a full anatomical
collider. The existing skin visibility mask is not used as the collision body.
Neckline and waist are pinned; the skirt simulates freely. Coincident shoulder
seam vertices are welded. Body collision and self-collision are enabled, with
12 solver steps, 8 collision-quality steps, 8 mm object clearance and 6 mm
self-clearance. These are the tested settings for these metre-scale models,
not universal settings for every garment.

The animation is evaluated continuously: 20 frames to settle, 20 to enter the
gait, then 32 frames per cycle. Eight poses from the second cycle are sampled.
`sample_cloth.py` saves the solver setup, disk cache, and sampled cloth as
editable shape keys. All four views use the **same simulated geometry**;
camera and lights rotate together instead of restarting the solver per facing.
The rig actions, collider, pin weights and cloth settings remain editable.

Hair is bone-bound in this iteration. It does **not** have hair dynamics yet.
A braid chain/collision guide or hair simulation is the next appropriate tool
if head/chest contact or motion needs correction. Simulation does not excuse
bad initial intersections, poor fitting, disconnected seams or missing binding.

These are structural references, not finished gritty materials or accepted
animation. Gait polish, cloth loop continuity, hair motion and silhouette still
need art review. No new imagegen pass has been claimed for these references.
The earlier generated trials remain accessible in the demo for comparison.

## Reproduce

Use the installed Blender MCP connection. Open a source `.blend` in its own
call, then execute the script in the next call so Blender's UI context updates.
Set `__file__` to the script's absolute path when executing its source.

1. Open `../../starter-slice-v02-identities/sources/player-{sex}.blend`.
2. Execute `bind_and_pose.py`, with `SEX`, `GAITS=['walk','sprint']` and
   `DIRECTIONS=[('front',0),('right',90),('back',180),('left',270)]`.
3. Open `{sex}-bound-motion.blend`; execute `cloth_trial.py` with `SEX`/`GAIT`.
4. Advance frames 1–72 sequentially, evaluating the cloth mesh each frame.
5. Execute `sample_cloth.py` with the same `SEX`/`GAIT`.
6. Execute `finish_cloth_loop.py` to measure successive-cycle differences, then
   `render_baked_frames.py` to render with the fixed margins. Loop differences
   are recorded in `*-simulation.json`; these clips are not certified seamless.
7. Run `python package_references.py` outside Blender. It retains native RGB,
   thresholds alpha, and creates integer-nearest guide sheets. It does not
   resize detailed images into sprites.

Run `python ../test_blender_pack.py` and `node ../verify-demo.cjs` for native
frame, alpha/RGB preservation, exact guide enlargement and browser projection
checks. These checks are separate from visual/animation acceptance.

`build_parity_scene.py` runs after opening the original male source. It makes
a separate scene and preserves the original. `before-parity.blend` is the
pre-change milestone. Never overwrite the original source files.

Blender documentation: [cloth collisions](https://docs.blender.org/manual/en/latest/physics/cloth/settings/collisions.html),
[hair dynamics](https://docs.blender.org/manual/en/4.3/physics/particles/hair/dynamics.html).
