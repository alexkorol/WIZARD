"""Retarget recorded CMU joint directions; no procedural gait synthesis."""
import bpy,math,json,addon_utils
from pathlib import Path
from mathutils import Matrix,Vector
R=Path(__file__).parent
SEX=globals().get('SEX','male');s=bpy.context.scene
rig=bpy.data.objects[f'MH_{SEX}_Rig'];pivot=bpy.data.objects['Sheet_Direction_'+SEX];pivot.rotation_euler.z=0
rig.animation_data.action=None
for gait in ['walk','sprint']:
 old=bpy.data.actions.get(f'player-{SEX}_{gait}_eight_phases')
 if old:old.name=f'rejected-procedural-{SEX}-{gait}'
for b in rig.pose.bones:b.matrix_basis=Matrix.Identity(4)
cloth=bpy.data.objects[f'player-{SEX}_linen_single_shell']
cloth.shape_key_clear()
bpy.context.view_layer.update()
rest={b.name:b.matrix.copy() for b in rig.pose.bones}
addon_utils.enable('io_anim_bvh')
mapping=[('spine_01','LowerBack','Spine'),('spine_02','Spine','Spine1'),('spine_03','Neck','Neck1'),('neck_01','Neck1','Head')]
for side,cmu in [('l','Left'),('r','Right')]:
 mapping += [(f'thigh_{side}',cmu+'UpLeg',cmu+'Leg'),(f'calf_{side}',cmu+'Leg',cmu+'Foot'),(f'foot_{side}',cmu+'Foot',cmu+'ToeBase'),(f'upperarm_{side}',cmu+'Arm',cmu+'ForeArm'),(f'lowerarm_{side}',cmu+'ForeArm',cmu+'Hand')]
def aim(name,direction):
 b=rig.pose.bones[name];h=b.head.copy();q=(b.tail-b.head).rotation_difference(direction)
 b.matrix=Matrix.Translation(h)@q.to_matrix().to_4x4()@Matrix.Translation(-h)@b.matrix
 bpy.context.view_layer.update()
metadata={}
for gait,file,start,period in [('walk','07_01.bvh',101,130),('sprint','09_01.bvh',32,88)]:
 src=bpy.data.objects.get('CMU_'+('run' if gait=='sprint' else 'walk')+'_source')
 if src is None:
  bpy.ops.import_anim.bvh(filepath=str(R/'mocap'/file),axis_forward='-Z',axis_up='Y',global_scale=.0254,use_fps_scale=False)
  src=bpy.context.object;src.name='CMU_'+('run' if gait=='sprint' else 'walk')+'_source'
 src.hide_render=True
 s.frame_set(start);p0=src.pose.bones['Hips'].head.copy()
 s.frame_set(start+period);p1=src.pose.bones['Hips'].head.copy()
 heading=math.atan2((p1-p0).x,-(p1-p0).y)
 rot=Matrix.Rotation(-heading,3,'Z')
 scale=(rig.data.bones['thigh_l'].length+rig.data.bones['calf_l'].length)/(src.data.bones['LeftUpLeg'].length+src.data.bones['LeftLeg'].length)
 poses=[];foot_min=[]
 for i in range(8):
  f=start+i*period/8;s.frame_set(int(f),subframe=f%1)
  joints={b.name:rot@b.head for b in src.pose.bones}
  for b in rig.pose.bones:b.matrix_basis=Matrix.Identity(4)
  hipz=(joints['LeftUpLeg'].z+joints['RightUpLeg'].z)*.5*scale
  rig.pose.bones['Root'].location.z=hipz-(rest['thigh_l'].translation.z+rest['thigh_r'].translation.z)*.5
  bpy.context.view_layer.update()
  for name,a,b in mapping:aim(name,joints[b]-joints[a])
  # Head follows recorded neck orientation; hands follow forearms with relaxed fingers.
  for side in ['l','r']:
   fore=rig.pose.bones['lowerarm_'+side];aim('hand_'+side,fore.tail-fore.head)
   for finger in ['index','middle','ring','pinky']:
    for link in [1,2,3]:
     b=rig.pose.bones[f'{finger}_{link:02d}_{side}'];b.rotation_mode='XYZ';b.rotation_euler=(math.radians((25 if link<3 else 15) if side=='l' else -20),0,0)
  bpy.context.view_layer.update()
  poses.append({b.name:b.matrix_basis.copy() for b in rig.pose.bones})
  foot_min.append(min(rig.pose.bones['foot_'+side].tail.z for side in ['l','r']))
 # One constant ground correction per clip. Preserve captured bounce and flight.
 ground=.025-min(foot_min)
 rig.animation_data.action=None
 for i,pose in enumerate(poses):
  s.frame_set(i+1)
  for b in rig.pose.bones:
   b.matrix_basis=pose[b.name]
   if b.name=='Root':b.location.z+=ground
   b.keyframe_insert('location',frame=i+1)
   b.keyframe_insert('rotation_quaternion' if b.rotation_mode=='QUATERNION' else 'rotation_euler',frame=i+1)
 rig.animation_data.action.name=f'player-{SEX}_{gait}_eight_phases';rig.animation_data.action.use_fake_user=True
 metadata[gait]={'source':file,'start':start,'period_source_frames':period,'source_fps':120,'duration':period/120,'retarget_scale':scale,'metres_per_second':(p1-p0).length*scale/(period/120),'ground_translation':ground,'frames':[start+i*period/8 for i in range(8)]}
 rig.animation_data.action=None
(R/'mocap'/f'{SEX}-retarget.json').write_text(json.dumps(metadata,indent=2))
s.frame_start=1;s.frame_end=8
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-mocap-motion.blend'),compress=True)
print('RETARGETED',metadata)
