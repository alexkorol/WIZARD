import bpy, json
from pathlib import Path
ROOT=Path(STUDY_ROOT)
scene=bpy.data.scenes['VG_Player_Unarmed_v01'];bpy.context.window.scene=scene
bpy.data.collections['VG_male'].hide_render=False
bpy.data.collections['VG_female'].hide_render=True
bpy.data.collections['VG_female'].hide_viewport=True
for area in bpy.context.screen.areas:
    if area.type=='VIEW_3D':
        area.spaces.active.region_3d.view_perspective='CAMERA'
        area.spaces.active.shading.type='MATERIAL'
scene.render.filepath=str(ROOT/'renders'/'male-logical-render.png')
bpy.data.texts['build_guides.py'].clear();bpy.data.texts['build_guides.py'].write((ROOT/'build_guides.py').read_text())
result={'status':'unapproved','scene':scene.name,'original_scene_objects':[o.name for o in bpy.data.scenes['Scene'].objects],'study_mesh_count':len([o for o in scene.objects if o.type=='MESH']),'camera':scene.camera.name,'projection':scene.camera.data.type,'male_objects':len(bpy.data.collections['VG_male'].objects),'female_objects':len(bpy.data.collections['VG_female'].objects),'logical_render_resolution':[scene.render.resolution_x,scene.render.resolution_y],'dof':scene.camera.data.dof.use_dof,'motion_blur':scene.render.use_motion_blur,'transparent':scene.render.film_transparent,'active_preview':'male; toggle the female collection visibility for the other figure'}
assert result['original_scene_objects']==['Cube','Light','Camera'] or set(result['original_scene_objects'])=={'Cube','Light','Camera'}
assert result['transparent'] and not result['dof'] and not result['motion_blur']
(ROOT/'scene-verification.json').write_text(json.dumps(result,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-unarmed-v01.blend'),compress=True)
print(json.dumps(result,indent=2))
