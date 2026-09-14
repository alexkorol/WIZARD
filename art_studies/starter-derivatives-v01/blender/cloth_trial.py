"""Controlled cloth simulation, evaluated continuously before sampling frames.

Run after loading female-bound-motion.blend in a separate MCP call.
No generated image is used to repair geometry.
"""
import bpy,bmesh,math,json
from mathutils import Matrix
from pathlib import Path
R=Path(__file__).parent
SEX=globals().get('SEX','female');GAIT=globals().get('GAIT','sprint')
s=bpy.context.scene;rig=bpy.data.objects[f'MH_{SEX}_Rig'];body=bpy.data.objects[f'MH_{SEX}_Body']
pivot=bpy.data.objects['Sheet_Direction_'+SEX];pivot.rotation_euler.z=0
cloth=bpy.data.objects[f'player-{SEX}_linen_single_shell']
rig.animation_data.action=bpy.data.actions[f'player-{SEX}_{GAIT}_eight_phases']
poses=[]
for frame in range(1,9):
    s.frame_set(frame);poses.append({b.name:b.matrix_basis.copy() for b in rig.pose.bones})
rig.animation_data.action=None
cloth.shape_key_clear()
bm=bmesh.new();bm.from_mesh(cloth.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001);bm.to_mesh(cloth.data);bm.free()
pin=cloth.vertex_groups.new(name='Neckline_and_belt_pins')
for v in cloth.data.vertices:
    w=max(0,min(1,(v.co.z-.94)/.055))
    if w:pin.add([v.index],w,'REPLACE')
proxy=body.copy();proxy.data=body.data.copy();s.collection.objects.link(proxy)
proxy.name='Full_anatomical_cloth_collider';proxy.hide_render=True;proxy.display_type='WIRE'
for m in list(proxy.modifiers):
    if m.type=='MASK':proxy.modifiers.remove(m)
mask=proxy.modifiers.new('Only actual skin','MASK');mask.vertex_group='body'
collider=proxy.modifiers.new('Cloth body collisions','COLLISION')
proxy.collision.thickness_outer=.006;proxy.collision.thickness_inner=.004
for b in rig.pose.bones:b.matrix_basis=Matrix.Identity(4)
sim=cloth.modifiers.new('Baked tunic cloth with pinned waist','CLOTH')
sim.settings.quality=12;sim.settings.mass=.25
sim.settings.tension_stiffness=35;sim.settings.compression_stiffness=35
sim.settings.shear_stiffness=20;sim.settings.bending_stiffness=.8
sim.settings.vertex_group_mass=pin.name
sim.collision_settings.use_collision=True;sim.collision_settings.distance_min=.008
sim.collision_settings.collision_quality=8
sim.collision_settings.use_self_collision=True;sim.collision_settings.self_distance_min=.006
s.render.fps=32;s.frame_start=1;s.frame_end=104
sim.point_cache.frame_start=1;sim.point_cache.frame_end=104
sim.point_cache.name=f'{SEX}_{GAIT}_compact_v2'
for frame in [1,20]:
    for b in rig.pose.bones:
        b.matrix_basis=Matrix.Identity(4)
        b.keyframe_insert('location',frame=frame)
        b.keyframe_insert('rotation_quaternion' if b.rotation_mode=='QUATERNION' else 'rotation_euler',frame=frame)
for cycle in range(3):
    for i,pose in enumerate(poses):
        frame=40+cycle*32+i*4
        if frame>104:continue
        for b in rig.pose.bones:
            b.matrix_basis=pose[b.name]
            b.keyframe_insert('location',frame=frame)
            b.keyframe_insert('rotation_quaternion' if b.rotation_mode=='QUATERNION' else 'rotation_euler',frame=frame)
rig.animation_data.action.name=f'{SEX}_{GAIT}_continuous_cloth_driver'
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-{GAIT}-cloth-trial.blend'),compress=True)
sim.point_cache.use_disk_cache=True
print('CLOTH_READY',len(cloth.data.vertices),len(cloth.data.polygons))
