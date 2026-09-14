"""Fixed per-facing margins; identical density, 64x96 padded canvas and root per cycle."""
import bpy,math,json
from pathlib import Path
from mathutils import Matrix,Vector
from bpy_extras.object_utils import world_to_camera_view
R=Path(__file__).parent;SEX=globals().get('SEX','male');GAIT=globals().get('GAIT','walk')
s=bpy.context.scene;c=s.camera
# Transfer recorded head rotation relative to its calibration pose. The fitted
# character's neutral head orientation must not inherit the CMU neck offset.
rig=bpy.data.objects[f'MH_{SEX}_Rig']
src=bpy.data.objects['CMU_'+('run' if GAIT=='sprint' else 'walk')+'_source']
meta=json.loads((R/'mocap'/f'{SEX}-retarget.json').read_text())[GAIT]
s.frame_set(1);reference=src.pose.bones['Head'].matrix.to_3x3().copy()
head_rest=rig.data.bones['head'].tail_local-rig.data.bones['head'].head_local
recorded=[]
for f in meta['frames']:
    s.frame_set(int(f),subframe=f%1)
    recorded.append(src.pose.bones['Head'].matrix.to_3x3()@reference.inverted()@head_rest)
for i,frame in enumerate(range(72,105,4)):
    s.frame_set(frame);b=rig.pose.bones['head'];h=b.head.copy()
    q=(b.tail-b.head).rotation_difference(recorded[i%8])
    b.matrix=Matrix.Translation(h)@q.to_matrix().to_4x4()@Matrix.Translation(-h)@b.matrix
    b.keyframe_insert('rotation_quaternion' if b.rotation_mode=='QUATERNION' else 'rotation_euler',frame=frame)
transforms=[(o,o.matrix_world.copy()) for o in s.objects if o.type in ('CAMERA','LIGHT')]
base_x=c.get('original_shift_x',c.data.shift_x);base_y=c.get('original_shift_y',c.data.shift_y)
c['original_shift_x']=base_x;c['original_shift_y']=base_y
records={}
for direction,angle,dx in [('front',0,0),('right',90,2),('back',180,0),('left',270,-2)]:
    c.data.shift_x=base_x-dx/96;c.data.shift_y=base_y-6/96
    rot=Matrix.Rotation(math.radians(-angle),4,'Z')
    for o,m in transforms:o.matrix_world=rot@m
    s.render.resolution_x=64;s.render.resolution_y=96;s.render.resolution_percentage=100
    bpy.context.view_layer.update();p=world_to_camera_view(s,c,Vector((0,0,0)))
    anchor=[round(p.x*64),round((1-p.y)*96)]
    records[direction]={'anchor':anchor,'logical_translation':[dx,-6],'pixel_focal_length':c.data.lens/c.data.sensor_height*96}
    for i,frame in enumerate(range(72,101,4),1):
        s.frame_set(frame)
        s.render.resolution_x=64;s.render.resolution_y=96
        s.render.filepath=str(R/'motion'/f'{SEX}-{GAIT}-{direction}-{i}.png');bpy.ops.render.render(write_still=True)
        if i in [1,3] and direction in ['front','right']:
            s.render.resolution_x=512;s.render.resolution_y=768
            s.render.filepath=str(R/'motion'/f'{SEX}-{GAIT}-{direction}-{i}-cloth-inspection.png');bpy.ops.render.render(write_still=True)
for o,m in transforms:o.matrix_world=m
c.data.shift_x=base_x;c.data.shift_y=base_y-6/96
s.render.resolution_x=64;s.render.resolution_y=96;s.frame_start=72;s.frame_end=103;s.frame_set(72)
bpy.data.objects[f'player-{SEX}_linen_single_shell'].hide_set(True)
bpy.data.objects['Full_anatomical_cloth_collider'].hide_set(True)
(R/f'{SEX}-{GAIT}-framing.json').write_text(json.dumps(records,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-{GAIT}-cloth-trial.blend'),compress=True)
print('NATIVE_CAMERA_FRAMING',SEX,GAIT,records)
