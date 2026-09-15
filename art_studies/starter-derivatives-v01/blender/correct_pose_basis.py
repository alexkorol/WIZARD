"""Preserve anatomical spinal curvature and remove the actor's presentation yaw.

Run on the saved cloth milestone. Recorded legs, stride and camera stay fixed.
Baked cloth follows the change through its existing skin weights; it is not a
new physics simulation. Save the original file before applying this script.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Matrix, Vector

R=Path(__file__).parent
SEX=globals().get('SEX','female'); GAIT=globals().get('GAIT','sprint')
s=bpy.context.scene; rig=bpy.data.objects[f'MH_{SEX}_Rig']
assert not rig.get('anatomical_pose_basis_v2'), 'Already corrected; load the original milestone'
src=bpy.data.objects['CMU_'+('run' if GAIT=='sprint' else 'walk')+'_source']
snap=bpy.data.objects[f'{SEX}_{GAIT}_baked_cloth_samples']
meta=json.loads((R/'mocap'/f'{SEX}-retarget.json').read_text())[GAIT]
s.frame_set(meta['start']);p0=src.pose.bones['Hips'].head.copy()
s.frame_set(meta['start']+meta['period_source_frames']);p1=src.pose.bones['Hips'].head.copy()
heading=Matrix.Rotation(-math.atan2((p1-p0).x,-(p1-p0).y),3,'Z')
rest={b.name:b.matrix_local.copy() for b in rig.data.bones}
directions={b.name:b.tail_local-b.head_local for b in rig.data.bones}
trunks=[];head_pitches=[]
for f in meta['frames']:
    s.frame_set(int(f),subframe=f%1)
    trunk=heading@(src.pose.bones['Neck'].head-src.pose.bones['Hips'].head)
    trunks.append(trunk.normalized())
    neck=heading@(src.pose.bones['Head'].head-src.pose.bones['Neck1'].head)
    head_pitches.append(math.atan2(neck.y,neck.z))
mean_pitch=sum(head_pitches)/8

def aim(name,direction):
    b=rig.pose.bones[name];h=b.head.copy()
    q=(b.tail-b.head).rotation_difference(direction)
    b.matrix=Matrix.Translation(h)@q.to_matrix().to_4x4()@Matrix.Translation(-h)@b.matrix
    bpy.context.view_layer.update()

def deform_matrices():
    return {b.name:b.matrix@rest[b.name].inverted() for b in rig.pose.bones}

# Capture the original key poses before editing an action or baked shape.
old=[]
for i in range(8):
    s.frame_set(72+i*4)
    old.append(dict(basis={b.name:b.matrix_basis.copy() for b in rig.pose.bones},
        skin=deform_matrices(),
        limbs={n:(rig.pose.bones[n].tail-rig.pose.bones[n].head).copy()
            for side in ['l','r'] for n in [f'upperarm_{side}',f'lowerarm_{side}',f'hand_{side}']},
        legs={n:list(rig.pose.bones[n].head) for side in ['l','r'] for n in [f'thigh_{side}',f'calf_{side}',f'foot_{side}']},
        neck=list(rig.pose.bones['head'].head)))

new=[];audit=[]
for i in range(8):
    s.frame_set(72+i*4)
    for b in rig.pose.bones:b.matrix_basis=old[i]['basis'][b.name]
    bpy.context.view_layer.update()
    # CMU segment axes are not interchangeable with anatomical spine bones.
    # Carry the captured WHOLE trunk inclination onto the fitted rest curve.
    tilt=Vector((0,0,1)).rotation_difference(trunks[i])
    for n in ['spine_01','spine_02','spine_03']:aim(n,tilt@directions[n])
    nod=max(-math.radians(3),min(math.radians(3),head_pitches[i]-mean_pitch))
    head_tilt=Matrix.Rotation(-nod,3,'X')
    for n in ['neck_01','head']:aim(n,head_tilt@directions[n])
    for n,v in old[i]['limbs'].items():aim(n,v)
    new.append(dict(basis={b.name:b.matrix_basis.copy() for b in rig.pose.bones},skin=deform_matrices()))
    legs={n:list(rig.pose.bones[n].head) for n in old[i]['legs']}
    max_leg_delta=max((Vector(legs[n])-Vector(old[i]['legs'][n])).length for n in legs)
    assert max_leg_delta<1e-5, 'The posture correction must not move the captured legs'
    audit.append(dict(phase=i+1,capture_forward_trunk_deg=math.degrees(math.atan2(-trunks[i].y,trunks[i].z)),
        old_head_base=old[i]['neck'],new_head_base=list(rig.pose.bones['head'].head),leg_delta_m=max_leg_delta,
        neck_direction=list((rig.pose.bones['neck_01'].tail-rig.pose.bones['neck_01'].head).normalized())))

# Transport the existing simulated cloth through the exact weighted skin maps.
# Invert the blended old map, not individual bones, to preserve the cloth offset.
groups={g.index:g.name for g in snap.vertex_groups}
weights=[]
for v in snap.data.vertices:
    w=[(groups[g.group],g.weight) for g in v.groups if groups[g.group] in rest and g.weight>0]
    total=sum(t for _,t in w)
    assert total>0, 'Baked cloth vertex has no anatomical weights'
    weights.append([(n,t/total) for n,t in w])
to_rig=rig.matrix_world.inverted()@snap.matrix_world
from_rig=to_rig.inverted()
for key in snap.data.shape_keys.key_blocks:
    i=0 if key.name in ['Basis','Next_cycle_first_phase'] else int(key.name.split('_')[-1])-1
    before,after=old[i]['skin'],new[i]['skin']
    for v,w in zip(key.data,weights):
        a=Matrix(((0,0,0,0),)*4);b=Matrix(((0,0,0,0),)*4)
        for n,t in w:
            a+=before[n]*t;b+=after[n]*t
        v.co=from_rig@b@a.inverted()@to_rig@v.co

for frame in range(40,105,4):
    i=((frame-40)//4)%8;s.frame_set(frame)
    for b in rig.pose.bones:
        b.matrix_basis=new[i]['basis'][b.name]
        b.keyframe_insert('location',frame=frame)
        b.keyframe_insert('rotation_quaternion' if b.rotation_mode=='QUATERNION' else 'rotation_euler',frame=frame)

# The fitted female model carried a -18-degree beauty-view rotation. Rotate
# the whole actor, including the independently baked cloth, around its origin.
s.frame_set(72)
pivot=bpy.data.objects['Sheet_Direction_'+SEX]
yaw=rig.matrix_world.to_euler().z
correction=Matrix.Rotation(-yaw,4,'Z')
pivot.matrix_world=correction@pivot.matrix_world
snap.matrix_world=correction@snap.matrix_world
bpy.context.view_layer.update()
assert abs(rig.matrix_world.to_euler().z)<1e-5
rig['anatomical_pose_basis_v2']=True
rig['removed_presentation_yaw_deg']=math.degrees(yaw)
report=dict(version=2,sex=SEX,gait=GAIT,removed_presentation_yaw_deg=math.degrees(yaw),
    final_rig_yaw_deg=math.degrees(rig.matrix_world.to_euler().z),phases=audit,
    cloth='Existing physics samples transported through anatomical skinning; no new simulation',
    camera_changed=False,leg_pose_changed=False)
dest=R/'pose-review';dest.mkdir(exist_ok=True)
(dest/f'{SEX}-{GAIT}-posture.json').write_text(json.dumps(report,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-{GAIT}-cloth-trial.blend'),compress=True)
print('CORRECTED_POSTURE',SEX,GAIT,report['removed_presentation_yaw_deg'])
