"""Fit clothing as layered surfaces, and align hair/footwear to the imported anatomy."""
import bpy,json
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v10_MPFB']
for sex in ['female','male']:
    bpy.data.collections['VG_'+sex].hide_viewport=False
    body=bpy.data.objects['MH_'+sex+'_Body'];rig=bpy.data.objects['MH_'+sex+'_Rig'];R=bpy.data.objects[sex+'_ROOT'].matrix_world.copy()
    dg=bpy.context.evaluated_depsgraph_get();ev=body.evaluated_get(dg);me=ev.to_mesh()
    pts=[ev.matrix_world@v.co for v in me.vertices];polys=[tuple(f.vertices) for f in me.polygons]
    tree=BVHTree.FromPolygons(pts,polys)
    # Hair placement uses the anatomical head's measured bounding box.
    top=max(p.z for p in pts);headpts=[p for p in pts if p.z>top-(.225 if sex=='female' else .235)]
    newmin=Vector(tuple(min(p[i] for p in headpts) for i in range(3)));newmax=Vector(tuple(max(p[i] for p in headpts) for i in range(3)))
    old=bpy.data.objects[sex+'_head'];hp=[old.matrix_world@v.co for v in old.data.vertices]
    oldmin=Vector(tuple(min(p[i] for p in hp) for i in range(3)));oldmax=Vector(tuple(max(p[i] for p in hp) for i in range(3)))
    ratios=[(newmax[i]-newmin[i])/(oldmax[i]-oldmin[i]) for i in range(3)]
    delta=Matrix.Translation((newmin+newmax)/2)@Matrix.Diagonal((*ratios,1))@Matrix.Translation(-(oldmin+oldmax)/2)
    for o in bpy.data.collections['VG_'+sex].objects:
        if o.name.startswith(sex+'_hair') and not o.hide_render:o.matrix_world=delta@o.matrix_world
    # Footwear encloses the measured feet rather than using mannequin ankle positions.
    localpts=[R.inverted()@p for p in pts]
    for sign in [-1,1]:
        footpts=[p for p in localpts if p.z<.11 and (p.x-.025)*sign>0]
        mi=Vector(tuple(min(p[i] for p in footpts) for i in range(3)));ma=Vector(tuple(max(p[i] for p in footpts) for i in range(3)))
        center=(mi+ma)/2;center.z=.045
        bpy.data.objects[f'{sex}_shoe_{sign}'].matrix_world=R@Matrix.Translation(center)@Matrix.Diagonal(((ma.x-mi.x)/2+.012,(ma.y-mi.y)/2+.016,.050,1))
    ev.to_mesh_clear()
    # Subdivide clothing, then correct penetration using actual surface normals.
    names=['hide_vest','linen_tunic'] if sex=='female' else ['linen_tunic']
    layers=[]
    for suffix in names+(['fitted_open_vest'] if sex=='female' else ['hide_vest','belt']):
        o=bpy.data.objects.get(sex+'_'+suffix)
        if not o or o.hide_render:continue
        bpy.ops.object.select_all(action='DESELECT');o.hide_set(False);o.select_set(True);bpy.context.view_layer.objects.active=o
        sub=o.modifiers.new('Fit_surface_resolution','SUBSURF');sub.subdivision_type='SIMPLE';sub.levels=2
        bpy.ops.object.modifier_apply(modifier=sub.name)
        inv=o.matrix_world.inverted()
        for v in o.data.vertices:
            p=o.matrix_world@v.co
            for surface,margin in [(tree,.014)]+[(t,.010) for t in layers]:
                hit,normal,idx,dist=surface.find_nearest(p)
                if hit is not None and dist<.16:
                    signed=(p-hit).dot(normal)
                    if signed<margin:p=hit+normal*margin
            v.co=inv@p
        o.data.update();bpy.context.view_layer.update()
        dg=bpy.context.evaluated_depsgraph_get();e=o.evaluated_get(dg);m=e.to_mesh()
        layers.append(BVHTree.FromPolygons([e.matrix_world@v.co for v in m.vertices],[tuple(f.vertices) for f in m.polygons]));e.to_mesh_clear()
    # An under-clothing mask is standard for fitted game garments. It removes only
    # covered torso/pelvis skin, leaving limbs, neckline, face and hands visible.
    visible=body.vertex_groups.new(name='Guide_visible_skin')
    for v in body.data.vertices:
        # Shape-key coordinates in rest space, before the pose modifier.
        co=body.data.shape_keys.key_blocks[0].data[v.index].co.copy()
        for key in body.data.shape_keys.key_blocks[1:]:
            if key.value:co+=(key.data[v.index].co-body.data.shape_keys.key_blocks[0].data[v.index].co)*key.value
        p=body.matrix_world@co;local=R.inverted()@p
        covered=(.66 if sex=='female' else .70)<p.z<(1.30 if sex=='female' else 1.39) and abs(local.x-.025)<(.19 if sex=='female' else .225)
        if not covered:visible.add([v.index],1,'REPLACE')
    mod=body.modifiers.new('Hide skin under kit','MASK');mod.vertex_group=visible.name
bpy.context.view_layer.update()
bpy.data.texts.new('refine_fit_v10.py').write((ROOT/'refine_fit.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'players-mpfb-v10.blend'),compress=True)
print('Layered clothes, anatomical hair fit, footwear and under-clothing masks saved.')
