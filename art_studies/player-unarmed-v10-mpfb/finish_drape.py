import bpy
from pathlib import Path
from mathutils.bvhtree import BVHTree
ROOT=Path(STUDY_ROOT)
body=bpy.data.objects['MH_female_Body'];ev=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
tree=BVHTree.FromPolygons([ev.matrix_world@v.co for v in me.vertices],[tuple(f.vertices) for f in me.polygons]);ev.to_mesh_clear()
o=bpy.data.objects['female_short_shoulder_drape'];bpy.ops.object.select_all(action='DESELECT');o.hide_set(False);o.select_set(True);bpy.context.view_layer.objects.active=o
sub=o.modifiers.new('drape_fit_resolution','SUBSURF');sub.subdivision_type='SIMPLE';sub.levels=2;bpy.ops.object.modifier_apply(modifier=sub.name)
inv=o.matrix_world.inverted()
for v in o.data.vertices:
    p=o.matrix_world@v.co;hit,n,idx,dist=tree.find_nearest(p)
    if hit is not None and dist<.12 and (p-hit).dot(n)<.054:p=hit+n*.054
    v.co=inv@p
o.data.update()
for sex in ['male']:
    for sign in [-1,1]:
        for part in ['shoulder_strap','shoulder_strap_back']:
            o=bpy.data.objects[f'{sex}_{part}_{sign}'];o.hide_render=True;o.hide_set(True)
bpy.data.texts.new('finish_drape_v10.py').write((ROOT/'finish_drape.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'players-mpfb-v10.blend'),compress=True)
print('Drape fitted over anatomical shoulder; obsolete strap stubs hidden.')
