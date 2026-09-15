"""Fixed per-facing margins; 96x96 native canvas and shared root anchor."""
import bpy,math,json
from pathlib import Path
from mathutils import Matrix,Vector
from bpy_extras.object_utils import world_to_camera_view
R=Path(__file__).parent;SEX=globals().get('SEX','male');GAIT=globals().get('GAIT','walk')
s=bpy.context.scene;c=s.camera
out=Path(globals().get('OUTPUT_DIR',str(R/'motion')));out.mkdir(parents=True,exist_ok=True)
# Fail closed: the former head-only patch left the anatomical neck backwards.
rig=bpy.data.objects[f'MH_{SEX}_Rig']
if SEX=='female':
    assert not any(o.name.startswith('player-female_braid_strand_') and not o.hide_render for o in s.objects), 'Rejected side braid is still visible'
assert rig.get('anatomical_pose_basis_v2'), 'Run rebake_pose_correction.py before exporting this rig'
assert abs(rig.matrix_world.to_euler().z)<1e-5, 'Actor contains a presentation yaw offset'
assert bpy.data.objects[f'{SEX}_{GAIT}_baked_cloth_samples'].get('relaxed_solver_creases'), 'Finish the cloth candidate first'
assert all(bpy.data.objects.get(f'player-{SEX}_{n}_cloth_bound') for n in ['waist_cord','belt_ends','neck_binding_-1','neck_binding_1']), 'Trim must follow cloth topology'
# Keep the same 48 px/metre player plane with a longer camera distance.
# The old near perspective clipped the away-running head in the 96px frame.
# A shared depth, rather than per-frame fitting, keeps all poses registered.
bpy.context.view_layer.update()
depth=-(c.matrix_world.inverted()@Vector((0,0,0))).z
c.location+=c.matrix_world.to_3x3()@Vector((0,0,12.75-depth))
bpy.context.view_layer.update()
transforms=[(o,o.matrix_world.copy()) for o in s.objects if o.type in ('CAMERA','LIGHT')]
# One world metre is the demo's base cell: exactly 48 logical pixels at
# the player plane. Calibrate the camera, never resize rendered art.
s.render.resolution_x=96;s.render.resolution_y=96
c.data.sensor_fit='VERTICAL'
depth=-(c.matrix_world.inverted()@Vector((0,0,0))).z
c.data.lens=48*depth*c.data.sensor_height/96
c.data.shift_x=0;c.data.shift_y=0
bpy.context.view_layer.update()
origin=world_to_camera_view(s,c,Vector((0,0,0)))
base_x=0;base_y=origin.y-(1-80/96)
records={}
for direction,angle,dx in [('front',0,0),('right',90,0),('back',180,0),('left',270,0)]:
    c.data.shift_x=base_x-dx/96;c.data.shift_y=base_y
    rot=Matrix.Rotation(math.radians(-angle),4,'Z')
    for o,m in transforms:o.matrix_world=rot@m
    s.render.resolution_x=96;s.render.resolution_y=96;s.render.resolution_percentage=100
    bpy.context.view_layer.update();p=world_to_camera_view(s,c,Vector((0,0,0)))
    anchor=[round(p.x*96),round((1-p.y)*96)]
    records[direction]={'anchor':anchor,'logical_translation':[dx,0],'pixel_focal_length':c.data.lens/c.data.sensor_height*96,'base_cell_px':48,'pixels_per_metre_at_player_plane':48}
    for i,frame in enumerate(range(72,101,4),1):
        s.frame_set(frame)
        s.render.resolution_x=96;s.render.resolution_y=96
        s.render.filepath=str(out/f'{SEX}-{GAIT}-{direction}-{i}.png');bpy.ops.render.render(write_still=True)
        if i in [1,3] and direction in ['front','right']:
            s.render.resolution_x=768;s.render.resolution_y=768
            s.render.filepath=str(out/f'{SEX}-{GAIT}-{direction}-{i}-cloth-inspection.png');bpy.ops.render.render(write_still=True)
for o,m in transforms:o.matrix_world=m
c.data.shift_x=base_x;c.data.shift_y=base_y
s.render.resolution_x=96;s.render.resolution_y=96;s.frame_start=72;s.frame_end=103;s.frame_set(72)
bpy.data.objects[f'player-{SEX}_linen_single_shell'].hide_set(True)
bpy.data.objects['Full_anatomical_cloth_collider'].hide_set(True)
(R/f'{SEX}-{GAIT}-framing.json').write_text(json.dumps(records,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-{GAIT}-cloth-trial.blend'),compress=True)
print('NATIVE_CAMERA_FRAMING',SEX,GAIT,records)
