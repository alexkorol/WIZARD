"""Fixed per-facing margins; identical density, 48x96 canvas and root per cycle."""
import bpy,math,json
from pathlib import Path
from mathutils import Matrix,Vector
from bpy_extras.object_utils import world_to_camera_view
R=Path(__file__).parent;SEX=globals().get('SEX','male');GAIT=globals().get('GAIT','walk')
s=bpy.context.scene;c=s.camera
# Relax the open hand into a loose unarmed curl. The torso/legs and simulated
# garment stay unchanged; neither hand contacts the tunic in these poses.
rig=bpy.data.objects[f'MH_{SEX}_Rig']
for frame in range(72,105,4):
    s.frame_set(frame)
    for side in ['l','r']:
        for finger in ['index','middle','ring','pinky']:
            for link in [1,2,3]:
                b=rig.pose.bones[f'{finger}_{link:02d}_{side}'];b.rotation_mode='XYZ'
                b.rotation_euler=(math.radians((25 if link<3 else 15) if side=='l' else -20),0,0)
                b.keyframe_insert('rotation_euler',frame=frame)
transforms=[(o,o.matrix_world.copy()) for o in s.objects if o.type in ('CAMERA','LIGHT')]
base_x=c.get('original_shift_x',c.data.shift_x);base_y=c.get('original_shift_y',c.data.shift_y)
c['original_shift_x']=base_x;c['original_shift_y']=base_y
records={}
for direction,angle,dx in [('front',0,0),('right',90,-4),('back',180,0),('left',270,4)]:
    c.data.shift_x=base_x-dx/96;c.data.shift_y=base_y-6/96
    rot=Matrix.Rotation(math.radians(-angle),4,'Z')
    for o,m in transforms:o.matrix_world=rot@m
    s.render.resolution_x=48;s.render.resolution_y=96;s.render.resolution_percentage=100
    bpy.context.view_layer.update();p=world_to_camera_view(s,c,Vector((0,0,0)))
    anchor=[round(p.x*48),round((1-p.y)*96)]
    records[direction]={'anchor':anchor,'logical_translation':[dx,-6],'pixel_focal_length':c.data.lens/c.data.sensor_height*96}
    for i,frame in enumerate(range(72,101,4),1):
        s.frame_set(frame)
        s.render.resolution_x=48;s.render.resolution_y=96
        s.render.filepath=str(R/'motion'/f'{SEX}-{GAIT}-{direction}-{i}.png');bpy.ops.render.render(write_still=True)
        if i in [1,3] and direction in ['front','right']:
            s.render.resolution_x=384;s.render.resolution_y=768
            s.render.filepath=str(R/'motion'/f'{SEX}-{GAIT}-{direction}-{i}-cloth-inspection.png');bpy.ops.render.render(write_still=True)
for o,m in transforms:o.matrix_world=m
c.data.shift_x=base_x;c.data.shift_y=base_y-6/96
s.render.resolution_x=48;s.render.resolution_y=96;s.frame_start=72;s.frame_end=103;s.frame_set(72)
bpy.data.objects[f'player-{SEX}_linen_single_shell'].hide_set(True)
bpy.data.objects['Full_anatomical_cloth_collider'].hide_set(True)
(R/f'{SEX}-{GAIT}-framing.json').write_text(json.dumps(records,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-{GAIT}-cloth-trial.blend'),compress=True)
print('NATIVE_CAMERA_FRAMING',SEX,GAIT,records)
