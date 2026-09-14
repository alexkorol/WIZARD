"""Sample the second continuous cycle; rotate camera/lights, never the solver.
Call once simulation has reached frame 72. Saves actual simulated cloth meshes
as editable shape keys as well as the original cloth setup and disk cache.
"""
import bpy,math,json
from pathlib import Path
from mathutils import Matrix
R=Path(__file__).parent
SEX=globals().get('SEX','female');GAIT=globals().get('GAIT','sprint')
s=bpy.context.scene;cloth=bpy.data.objects[f'player-{SEX}_linen_single_shell']
out=R/'motion';camera=s.camera
transforms=[(o,o.matrix_world.copy()) for o in s.objects if o.type in ('CAMERA','LIGHT')]
snap=None;report=[]
for frame in range(72,101):
    s.frame_set(frame);bpy.context.view_layer.update()
    dg=bpy.context.evaluated_depsgraph_get();ev=cloth.evaluated_get(dg)
    mesh=bpy.data.meshes.new_from_object(ev,preserve_all_data_layers=True,depsgraph=dg)
    if (frame-72)%4:
        bpy.data.meshes.remove(mesh);continue
    phase=(frame-72)//4+1
    if snap is None:
        snap=bpy.data.objects.new(f'{SEX}_{GAIT}_baked_cloth_samples',mesh);s.collection.objects.link(snap)
        snap.matrix_world=cloth.matrix_world.copy();snap.shape_key_add(name='Basis')
    else:
        for key in list(snap.data.shape_keys.key_blocks)[1:]:key.value=0
    key=snap.shape_key_add(name=f'Phase_{phase}')
    for a,b in zip(key.data,mesh.vertices):a.co=b.co
    for f in range(72,101,4):key.value=1 if f==frame else 0;key.keyframe_insert('value',frame=f)
    for k in list(snap.data.shape_keys.key_blocks)[1:]:
        if k!=key:k.value=0;k.keyframe_insert('value',frame=frame)
    key.value=1
    if mesh!=snap.data:bpy.data.meshes.remove(mesh)
    cloth.hide_render=True;snap.hide_render=False
    for direction,angle in globals().get('RENDER_DIRECTIONS',[('front',0),('right',90),('back',180),('left',270)]):
        rot=Matrix.Rotation(math.radians(-angle),4,'Z')
        for ob,matrix in transforms:ob.matrix_world=rot@matrix
        s.render.resolution_x=48;s.render.resolution_y=96
        s.render.filepath=str(out/f'{SEX}-{GAIT}-{direction}-{phase}.png');bpy.ops.render.render(write_still=True)
        if phase in [1,3] and direction in ['front','right']:
            s.render.resolution_x=384;s.render.resolution_y=768
            s.render.filepath=str(out/f'{SEX}-{GAIT}-{direction}-{phase}-cloth-inspection.png');bpy.ops.render.render(write_still=True)
    for ob,matrix in transforms:ob.matrix_world=matrix
    snap.hide_render=True;cloth.hide_render=False
    report.append({'phase':phase,'simulation_frame':frame,'cloth_vertices':len(snap.data.vertices)})
s.render.resolution_x=48;s.render.resolution_y=96
cloth.hide_render=True;snap.hide_render=False
(R/f'{SEX}-{GAIT}-simulation.json').write_text(json.dumps({'source':'Blender cloth solver, body and self collisions, pinned neckline and waist','phases':report,'quality_steps':12,'collision_quality':8,'distance_m':.008,'self_distance_m':.006,'warmup_frames':20,'transition_frames':20,'cycle_frames':32},indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-{GAIT}-cloth-trial.blend'),compress=True)
print('SAMPLED_SIMULATED_CLOTH',SEX,GAIT)
