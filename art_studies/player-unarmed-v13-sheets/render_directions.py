"""Render four idle directions through Blender MCP from preserved v11 source."""
import bpy,math,json
from pathlib import Path
R=Path(STUDY_ROOT)
for name in ('renders','sources'): (R/name).mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(R.parent/'player-unarmed-v11-48x96/sources/players-mpfb-v11-48x96.blend'))
s=bpy.context.scene;s.name='VG_Player_Unarmed_v13_Sheets'
camera_before=[list(row) for row in s.camera.matrix_world]
s.render.resolution_x=48;s.render.resolution_y=96;s.render.resolution_percentage=100
s.render.film_transparent=True;s.render.image_settings.color_mode='RGBA';s.render.image_settings.file_format='PNG'
report={'frame_dimensions':[48,96],'directions':['front','right','back','left'],'camera_matrix':camera_before,'characters':{}}
for sex in ('male','female'):
    members=set()
    for prefix in ('VG_','MH_'):members.update(bpy.data.collections[prefix+sex].all_objects)
    pivot=bpy.data.objects.new('Sheet_Direction_'+sex,None);s.collection.objects.link(pivot)
    roots=[o for o in members if o.parent not in members]
    for o in roots:
        matrix=o.matrix_world.copy();o.parent=pivot;o.matrix_world=matrix
    report['characters'][sex]={'pivot':pivot.name,'parented_roots':[o.name for o in roots]}
    for other in ('male','female'):
        for prefix in ('VG_','MH_'):
            c=bpy.data.collections[prefix+other];c.hide_render=other!=sex;c.hide_viewport=other!=sex
    for i,direction in enumerate(report['directions']):
        pivot.rotation_euler.z=math.radians(i*90);bpy.context.view_layer.update()
        s.render.filepath=str(R/'renders'/f'{sex}-{direction}.png');bpy.ops.render.render(write_still=True)
    pivot.rotation_euler.z=0
assert camera_before==[list(row) for row in s.camera.matrix_world]
t=bpy.data.texts.new('v13_render_directions.py');t.write((R/'render_directions.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(R/'sources/players-four-directions.blend'),compress=True)
(R/'parameters.json').write_text(json.dumps(report,indent=2))
print('Eight actual48x96 directional frames saved; camera and existing poses retained.')
