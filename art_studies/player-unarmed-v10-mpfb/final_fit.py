"""Refit clean original garment surfaces and use anatomical scalp geometry."""
import bpy,math
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
ROOT=Path(STUDY_ROOT)
for sex in ['female','male']:
    body=bpy.data.objects['MH_'+sex+'_Body'];rig=bpy.data.objects['MH_'+sex+'_Rig'];R=bpy.data.objects[sex+'_ROOT'].matrix_world.copy()
    mask=body.modifiers.get('Hide skin under kit');mask.show_viewport=False;mask.show_render=False;bpy.context.view_layer.update()
    ev=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    pts=[ev.matrix_world@v.co for v in me.vertices];faces=[tuple(f.vertices) for f in me.polygons];tree=BVHTree.FromPolygons(pts,faces)
    top=max(p.z for p in pts)
    # The scalp is a fitted part of the imported mesh, not a resized mannequin cap.
    scalpfaces=[]
    for f in me.polygons:
        ok=True
        for vi in f.vertices:
            p=R.inverted()@pts[vi]
            cutoff=top-(.09 if p.y<-.040 else .165)
            if p.z<cutoff:ok=False;break
        if ok:scalpfaces.append(tuple(f.vertices))
    used=sorted({i for f in scalpfaces for i in f});mapping={old:i for i,old in enumerate(used)}
    normals=[(ev.matrix_world.to_3x3()@v.normal).normalized() for v in me.vertices]
    sm=bpy.data.meshes.new('MH_'+sex+'_scalp');sm.from_pydata([pts[i]+normals[i]*.004 for i in used],[],[tuple(mapping[i] for i in f) for f in scalpfaces]);sm.materials.append(bpy.data.materials['VG_wrap_chestnut_hair_v08'] if sex=='female' else bpy.data.materials['VG_hair_blockout']);sm.update()
    so=bpy.data.objects.new('MH_'+sex+'_Scalp',sm);bpy.data.collections['MH_'+sex].objects.link(so)
    for f in sm.polygons:f.use_smooth=True
    for o in bpy.data.collections['VG_'+sex].objects:
        if o.name.startswith(sex+'_hair') and (sex=='male' or o.name!=sex+'_hair_high_tail'):o.hide_render=True;o.hide_set(True)
    ev.to_mesh_clear()
    names=[sex+'_'+n for n in ['hide_vest','linen_tunic','belt']]+([sex+'_fitted_open_vest'] if sex=='female' else [])
    with bpy.data.libraries.load(str(ROOT/'sources'/'before-mpfb.blend'),link=False) as (src,dst):dst.objects=[n for n in names if n in src.objects]
    for loaded in dst.objects:
        if loaded is None:continue
        # The loaded datablock is automatically suffixed because the original exists.
        name=loaded.name.rsplit('.',1)[0] if loaded.name.rsplit('.',1)[-1].isdigit() else loaded.name
        o=bpy.data.objects[name];o.data=loaded.data.copy();o.matrix_world=loaded.matrix_world.copy()
        for mod in list(o.modifiers):o.modifiers.remove(mod)
        bpy.data.objects.remove(loaded,do_unlink=True)
        if o.hide_render:continue
        inv=o.matrix_world.inverted()
        for v in o.data.vertices:
            p=o.matrix_world@v.co
            if sex=='female':p.z+=max(0,p.z-1.00)*.21
            else:p.z+=max(0,p.z-1.02)*.07
            v.co=inv@p
        bpy.ops.object.select_all(action='DESELECT');o.hide_set(False);o.select_set(True);bpy.context.view_layer.objects.active=o
        sub=o.modifiers.new('Surface_fit_resolution','SUBSURF');sub.subdivision_type='SIMPLE';sub.levels=2;bpy.ops.object.modifier_apply(modifier=sub.name)
        outer=(sex=='female' and name.endswith('fitted_open_vest')) or (sex=='male' and name.endswith('hide_vest'))
        margin=.034 if outer else .014
        for v in o.data.vertices:
            p=o.matrix_world@v.co;hit,normal,idx,dist=tree.find_nearest(p)
            if hit is not None and dist<.15 and (p-hit).dot(normal)<margin:p=hit+normal*margin
            v.co=inv@p
        o.data.update()
    mask.show_viewport=True;mask.show_render=True
    # Shoulder drape rises with the refitted neckline and remains on the shoulder.
    if sex=='female':bpy.data.objects['female_short_shoulder_drape'].location.z+=.045
bpy.context.view_layer.update()
bpy.data.texts.new('final_fit_v10.py').write((ROOT/'final_fit.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'players-mpfb-v10.blend'),compress=True)
print('Clean garment surfaces refitted, anatomical scalps fitted and model saved.')
