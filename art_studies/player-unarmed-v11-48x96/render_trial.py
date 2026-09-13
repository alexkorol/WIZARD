"""Resolution-only trial, executed through Blender MCP; preserve v10 geometry."""
import bpy,json
from pathlib import Path
R=Path(STUDY_ROOT)
for name in ('renders','sources'): (R/name).mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(R.parent/'player-unarmed-v10-mpfb/sources/players-mpfb-v10.blend'))
s=bpy.context.scene;s.name='VG_Player_Unarmed_v11_48x96'
camera_before=[list(row) for row in s.camera.matrix_world]
s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.resolution_percentage=100
for sex in ('male','female'):
    for other in ('male','female'):
        for prefix in ('VG_','MH_'):
            c=bpy.data.collections[prefix+other];c.hide_render=other!=sex;c.hide_viewport=other!=sex
    for label,w,h in [('logical-render',48,96),('structural-inspection',384,768)]:
        s.render.resolution_x=w;s.render.resolution_y=h;s.render.filepath=str(R/'renders'/f'{sex}-{label}.png')
        bpy.ops.render.render(write_still=True)
s.render.resolution_x=48;s.render.resolution_y=96
assert camera_before==[list(row) for row in s.camera.matrix_world]
t=bpy.data.texts.new('v11_render_trial.py');t.write((R/'render_trial.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(R/'sources/players-mpfb-v11-48x96.blend'),compress=True)
(R/'parameters.json').write_text(json.dumps({'logical_canvas':[48,96],'enlargement':8,'anchor':[24,90],'status':'Experimental 1.5x resolution; established 32x64 baseline preserved','source_scene':'../player-unarmed-v10-mpfb/sources/players-mpfb-v10.blend','geometry_pose_clothing_unchanged':True,'camera_matrix':camera_before,'camera_lens':s.camera.data.lens,'camera_shift_y':s.camera.data.shift_y,'camera_unchanged_verified':True},indent=2))
print('48x96 RGBA renders and editable resolution trial saved; geometry and camera preserved.')
