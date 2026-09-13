"""Import established MakeHuman/MPFB CC0 basemeshes and built-in weighted rigs via MCP."""
import bpy,sys,addon_utils,json
from pathlib import Path
ROOT=Path(STUDY_ROOT)
for d in ['sources','renders']: (ROOT/d).mkdir(exist_ok=True)
# Current MPFB is a Blender extension and must use its registered namespace.
addon_utils.modules_refresh()
if not addon_utils.check('bl_ext.user_default.mpfb')[1]:
    addon_utils.enable('bl_ext.user_default.mpfb',default_set=True,persistent=True)
from bl_ext.user_default.mpfb.services.humanservice import HumanService
from bl_ext.user_default.mpfb.services.targetservice import TargetService
scene=bpy.data.scenes['VG_Player_Unarmed_v09_Silhouette'];bpy.context.window.scene=scene
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-mpfb.blend'),compress=True)
scene.name='VG_Player_Unarmed_v10_MPFB'
info={}
for sex,gender in [('female',0.0),('male',1.0)]:
    collection=bpy.data.collections.new('MH_'+sex);scene.collection.children.link(collection)
    macros=TargetService.get_default_macro_info_dict();macros.update({'gender':gender,'age':.5,'muscle':.55,'weight':.42,'proportions':.55,'cupsize':.40,'firmness':.65})
    body=HumanService.create_human(macro_detail_dict=macros);body.name='MH_'+sex+'_Body'
    rig=HumanService.add_builtin_rig(body,'game_engine');rig.name='MH_'+sex+'_Rig'
    for o in [body,rig]:
        for c in list(o.users_collection):c.objects.unlink(o)
        collection.objects.link(o)
    body.data.materials.clear();body.data.materials.append(bpy.data.materials['VG_skin_blockout'])
    for f in body.data.polygons:f.use_smooth=True
    info[sex]={'macros':macros,'vertices':len(body.data.vertices),'dimensions':list(body.dimensions),'shape_keys':[k.name for k in body.data.shape_keys.key_blocks],'bones':{b.name:{'head':list(b.head_local),'tail':list(b.tail_local)} for b in rig.data.bones},'modifiers':[m.name for m in body.modifiers]}
    collection.hide_render=True
(ROOT/'import-verification.json').write_text(json.dumps(info,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'imported-bases.blend'),compress=True)
print(json.dumps(info,indent=2))
