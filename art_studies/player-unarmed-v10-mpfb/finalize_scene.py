import bpy,json,addon_utils
from pathlib import Path
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v10_MPFB'];bpy.context.window.scene=scene
for sex in ['male','female']:
    for prefix in ['VG_','MH_']:
        c=bpy.data.collections[prefix+sex];c.hide_render=sex!='female';c.hide_viewport=sex!='female'
    bpy.data.objects['MH_'+sex+'_Rig'].hide_set(True)
bpy.ops.object.select_all(action='DESELECT');o=bpy.data.objects['MH_female_Body'];o.select_set(True);bpy.context.view_layer.objects.active=o
scene.render.resolution_x=32;scene.render.resolution_y=64;scene.render.filepath=str(ROOT/'renders'/'female-logical-render.png')
scene['status']='Editable MakeHuman bases; imagegen candidate files saved externally in this study'
for path in ROOT.glob('*.py'):
    if path.name not in ['check_mpfb.py','enable_extension.py','inspect_fit.py']:
        text=bpy.data.texts.get('v10_'+path.name) or bpy.data.texts.new('v10_'+path.name);text.clear();text.write(path.read_text())
bpy.ops.wm.save_userpref()
assert addon_utils.check('bl_ext.user_default.mpfb')[1]
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'players-mpfb-v10.blend'),compress=True)
print('Saved editable female-visible scene and enabled MPFB extension preferences.')
