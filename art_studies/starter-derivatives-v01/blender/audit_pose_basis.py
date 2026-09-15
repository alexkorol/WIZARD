"""Read saved candidate rigs; detect heading/neck regressions before promotion."""
import bpy, math, json, hashlib
from pathlib import Path
from bpy_extras.object_utils import world_to_camera_view
R=Path(__file__).parent
for sex in ['male','female']:
    for gait in ['walk','sprint']:
        source=R/f'{sex}-{gait}-cloth-trial.blend'
        bpy.ops.wm.open_mainfile(filepath=str(source))
        s=bpy.context.scene;rig=bpy.data.objects[f'MH_{sex}_Rig']
        assert rig.get('anatomical_pose_basis_v2')
        assert abs(rig.matrix_world.to_euler().z)<1e-5
        records=[]
        for phase in range(1,9):
            s.frame_set(68+phase*4)
            neck=rig.pose.bones['neck_01'];rest=rig.data.bones['neck_01']
            v=neck.tail-neck.head;r=rest.tail_local-rest.head_local
            pitch=math.degrees(math.atan2(v.y,v.z)-math.atan2(r.y,r.z))
            assert abs(pitch)<3.01,(sex,gait,phase,pitch)
            # The visible head must be ahead of the pelvis during running.
            head_forward=(rig.pose.bones['pelvis'].head-rig.pose.bones['head'].head).y
            if gait=='sprint':assert head_forward>0,(sex,gait,phase,head_forward)
            records.append(dict(phase=phase,neck_pitch_from_rest_deg=pitch,head_forward_of_pelvis_m=head_forward))
        snap=bpy.data.objects[f'{sex}_{gait}_baked_cloth_samples']
        keys=snap.data.shape_keys.key_blocks
        # Measure the final corrected samples using the actual square camera.
        distances=[]
        for a,b in zip(keys['Phase_1'].data,keys['Next_cycle_first_phase'].data):
            u=world_to_camera_view(s,s.camera,snap.matrix_world@a.co)
            v=world_to_camera_view(s,s.camera,snap.matrix_world@b.co)
            distances.append(math.hypot((u.x-v.x)*96,(u.y-v.y)*96))
        p=R/f'{sex}-{gait}-simulation.json';sim=json.loads(p.read_text())
        sim.setdefault('raw_solver_seam_before_relaxation',sim['cloth_loop_seam'])
        sim['cloth_loop_seam']=dict(comparison='final mesh: phase 1 vs next-cycle phase 1',
            rms_logical_pixels=math.sqrt(sum(x*x for x in distances)/len(distances)),
            maximum_logical_pixels=max(distances),canvas=[96,96],status='measured; playback visually reviewed separately')
        p.write_text(json.dumps(sim,indent=2))
        p=R/'pose-review'/f'{sex}-{gait}-posture.json';audit=json.loads(p.read_text())
        audit['saved_blend_sha256']=hashlib.sha256(source.read_bytes()).hexdigest()
        audit['saved_pose_checks']=records;p.write_text(json.dumps(audit,indent=2))
        print('VERIFIED_SAVED_POSE',sex,gait,flush=True)
