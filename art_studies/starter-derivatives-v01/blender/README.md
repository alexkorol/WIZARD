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

The existing separate MakeHuman models and bindings are preserved. The rejected
procedural gait is archived in `{sex}-bound-motion.blend`; do not use those
old gait actions for new renders. `retarget_mocap.py` imports recorded CMU motion
through Blender's BVH importer, maps joint directions onto the anatomical bones,
removes horizontal travel for in-place playback, and retains captured vertical
motion. `mocap/READMEFIRST.txt` includes the source/conversion usage terms.

- Walk: CMU 07_01, frames 101–230, 130 source frames per cycle at 120 fps.
- Run: CMU 09_01, frames 32–119, 88 source frames per cycle at 120 fps.
- Eight evenly sampled phases per cycle. Original captures and calibrated
  per-character timing/speed metadata are in `mocap/`.
- Hands retain a relaxed local finger pose; CMU did not capture finger motion.
- Imported source armatures and editable retargeted actions are saved in
  `{sex}-mocap-motion.blend`. Final baked files include head calibration.

The real stride exceeds the old 48-pixel crop. All new motion frames use a
**64×96 transparent canvas at the same character pixel density**. This adds
horizontal field of view; it does not shrink characters or change world scale.
Ground anchors are `(32,76)` front/back, `(34,76)` right, `(30,76)` left,
shared by both sexes and gaits. These are fixed principal-point translations.
Occupied border pixels fail export. The village still uses 44.39376 pixels/metre.

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

1. Open the preserved `{sex}-bound-motion.blend` binding milestone.
2. Execute `retarget_mocap.py` with `SEX`. It saves `{sex}-mocap-motion.blend`.
3. Open that new source; execute `cloth_trial.py` with `SEX`/`GAIT`.
4. Advance frames 1–72 sequentially, evaluating the cloth mesh each frame.
5. Execute `sample_cloth.py` with `SEX`/`GAIT`, `RENDER_DIRECTIONS=[]` to avoid
   redundant renders before final framing. Saved cloth shape keys are the
   portable baked result; disk caches can be regenerated.
6. Execute `finish_cloth_loop.py`, then `render_baked_frames.py`. The new cache
   namespace is `cmu_v1`; old procedural caches must not be reused. Walk physics
   runs at 30 fps, run at 44 fps, giving 32-frame cycles close to capture timing.
   Successive-cycle cloth differences remain measured, not certified seamless.
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
