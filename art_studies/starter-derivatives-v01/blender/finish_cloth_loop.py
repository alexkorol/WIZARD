"""Measure the actual next-cycle cloth seam and set a useful review range."""
import bpy,json,math
from pathlib import Path
from bpy_extras.object_utils import world_to_camera_view
R=Path(__file__).parent
SEX=globals().get('SEX','female');GAIT=globals().get('GAIT','walk')
s=bpy.context.scene;cloth=bpy.data.objects[f'player-{SEX}_linen_single_shell']
snap=bpy.data.objects[f'{SEX}_{GAIT}_baked_cloth_samples']
for frame in range(100,105):
    s.frame_set(frame);bpy.context.view_layer.update()
    ev=cloth.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    points=[v.co.copy() for v in me.vertices];ev.to_mesh_clear()
key=snap.shape_key_add(name='Next_cycle_first_phase')
distances=[]
for a,b,p in zip(key.data,snap.data.vertices,points):
    a.co=p
    u=world_to_camera_view(s,s.camera,snap.matrix_world@b.co)
    v=world_to_camera_view(s,s.camera,snap.matrix_world@p)
    distances.append(math.hypot((u.x-v.x)*s.render.resolution_x,(u.y-v.y)*s.render.resolution_y))
for frame in range(72,105,4):key.value=1 if frame==104 else 0;key.keyframe_insert('value',frame=frame)
for k in list(snap.data.shape_keys.key_blocks)[1:]:
    if k!=key:k.value=0;k.keyframe_insert('value',frame=104)
path=R/f'{SEX}-{GAIT}-simulation.json';data=json.loads(path.read_text())
data['cloth_loop_seam']={'comparison':'same skeletal phase: frame 72 vs frame 104','rms_logical_pixels':math.sqrt(sum(d*d for d in distances)/len(distances)),'maximum_logical_pixels':max(distances),'status':'measured; visual acceptance separate'}
path.write_text(json.dumps(data,indent=2))
s.frame_start=72;s.frame_end=103;s.frame_set(72)
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-{GAIT}-cloth-trial.blend'),compress=True)
print('CLOTH_LOOP',data['cloth_loop_seam'])
