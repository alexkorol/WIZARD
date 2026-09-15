# Reviewed anatomical motion references

The female source carried a −18° presentation rotation. The CMU retargeter
also copied capture-segment directions directly onto a differently curved
anatomical spine and neck. Correcting only the head did not correct the neck.

`correct_pose_basis.py` transfers the CMU whole-trunk inclination onto the
anatomical rest curve, keeps the neck near its fitted rest direction, and
removes the actor's presentation yaw. It asserts that leg joints do not move.
Walk remains upright; sprint leans forward. The existing CMU 07_01 and 09_01
recordings still supply the gait and stride.

The tunic is simulated again on the corrected action. The sampled skirt mesh
then receives collision-constrained relaxation to remove solver spikes.
Decorative cords use fixed triangle/barycentric attachments to the cloth;
they no longer follow unrelated bone transforms through the garment.
Original curves and the simulation setup remain editable in each `.blend`.

The common camera depth is 12.75 m. Lens calibration retains 48 px/metre at
the player plane, 96×96 frames and the shared [48,80] ground origin. The village
is rendered with that same camera. There is no per-frame fitting or image
rescaling. The longer distance prevents away-running poses from clipping.

## Rebuild and acceptance

1. Start from a saved cloth-trial milestone. `rebake_pose_correction.py`
   corrects an uncorrected rig, simulates cloth, relaxes samples, attaches
   trim and renders only into the ignored `candidate-motion/` directory.
2. For already corrected scenes, `render_pose_candidates.py` only re-renders.
   `render_baked_frames.py` refuses the old head-only correction, wrong yaw,
   unfinished cloth or unattached trim.
3. Run `audit_pose_basis.py` in Blender. It reads all four saved scenes,
   verifies every neck pose and sprint head position, records file hashes,
   and measures the final cloth seam at the actual 96×96 camera resolution.
4. Inspect every native frame, all four facings and complete cycles on light
   and dark grounds. Check head/torso posture, hand clearance, cloth edges,
   consistent origin, border clearance, phase ordering and loop transition.
   Reject faulty candidates before any active export.
5. Record **only visually reviewed** render hashes in `visual-review.json`,
   then copy those candidates to `motion/` and run `package_references.py`.
   The packager checks the entire batch and its reviewed source hashes before
   writing active frames. Run `test_blender_pack.py` and verify the demo.
6. If the camera changes, run `rebuild_parity_camera.py` before acceptance
   and check village/actor parity. Never change just the sprite scale.

`visual-review.json` approves structural references only. These are not
finished painted game assets. Hair remains bone-bound, and the measured
next-cycle cloth seam is retained in each simulation report.

## Reference provenance

- Motion comes from the existing [CMU motion capture database](https://mocap.cs.cmu.edu/subjects.php)
  BVH recordings stored with this study.
- The [PAFA Muybridge locomotion plate](https://www.pafa.org/museum/collection/item/animal-locomotion-volume-vii-men-woman-draped-miscellaneous-subjects-plate-8)
  was visually inspected for directional body/head continuity; its draped
  figure is not a stride or costume template.
- Diablo II Rogue and Amazon sheets on The Spriters Resource were located,
  but the site blocked access during this pass. They were not inspected or
  used as source pixels. Do not report otherwise.

Failed interim renders and original `.blend` backups stay local; they are
not referenced by the demo or offered as new imagegen inputs.
