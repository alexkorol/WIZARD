"""Resolution-only revision of the existing figures through Blender MCP."""
import bpy,json
from pathlib import Path
ROOT=Path(STUDY_ROOT)
for name in ('sources','renders'): (ROOT/name).mkdir(exist_ok=True)
scene=bpy.data.scenes['VG_Player_Unarmed_v03'];bpy.context.window.scene=scene
scene.name='VG_Player_Unarmed_v04_32x64';cam=scene.camera
before={'location':list(cam.location),'rotation':list(cam.rotation_euler),'lens':cam.data.lens,'sensor_fit':cam.data.sensor_fit,'shift_x':cam.data.shift_x,'shift_y':cam.data.shift_y}
assert cam.data.sensor_fit=='VERTICAL','Review aspect ratio behavior before rendering'
P=json.loads((ROOT/'parameters.json').read_text())
P.update({'logical_canvas':[32,64],'anchor':[16,60],'enlargement':8,'grid_cell':[32,32],
          'humanoid_footprint_cells':[1,2],'small_monster_footprint_cells':[1,1],
          'status':'32x64 canvas selected by owner; figure, pose and appearance unapproved',
          'scale_status':'Owner-selected logical grid: 32x32 inventory cell / small monster, 32x64 typical humanoid. Runtime displayed pixel size and final camera remain unverified.'})
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2))
for sex in ('male','female'):
    bpy.data.collections['VG_'+sex].hide_viewport=False
for sex in ('male','female'):
    for other in ('male','female'):bpy.data.collections['VG_'+other].hide_render=other!=sex
    for suffix,w,h in [('logical-render',32,64),('structural-inspection',256,512)]:
        scene.render.resolution_x=w;scene.render.resolution_y=h
        scene.render.filepath=str(ROOT/'renders'/f'{sex}-{suffix}.png')
        bpy.ops.render.render(write_still=True)
after={'location':list(cam.location),'rotation':list(cam.rotation_euler),'lens':cam.data.lens,'sensor_fit':cam.data.sensor_fit,'shift_x':cam.data.shift_x,'shift_y':cam.data.shift_y}
assert before==after
scene.render.resolution_x=32;scene.render.resolution_y=64
scene['logical_canvas']='32 x 64 - owner selected';scene['anchor']='16,60';scene['grid_cell']='32x32'
scene['status']='UNAPPROVED figures; owner-selected 1x2 humanoid canvas'
bpy.data.collections['VG_male'].hide_render=True;bpy.data.collections['VG_female'].hide_render=False;bpy.data.collections['VG_male'].hide_viewport=True
scene.render.filepath=str(ROOT/'renders'/'female-logical-render.png')
scene_data={'camera_preserved':True,'camera':after,'resolution':[32,64],'aspect_ratio_change':'vertical sensor fit retained; narrower horizontal crop, no anisotropic scaling','geometry_pose_lighting_materials':'unchanged from v03','transparent':scene.render.film_transparent,'dof':cam.data.dof.use_dof,'motion_blur':scene.render.use_motion_blur}
(ROOT/'render-verification.json').write_text(json.dumps(scene_data,indent=2))
txt=bpy.data.texts.new('render_32x64_v04.py');txt.write((ROOT/'render_32x64.py').read_text())
params=bpy.data.texts.new('parameters_v04.json');params.write(json.dumps(P,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-32x64-v04.blend'),compress=True)
print(json.dumps(scene_data,indent=2))
