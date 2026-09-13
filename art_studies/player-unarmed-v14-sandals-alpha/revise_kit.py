"""Editable open sandals and removal of shoulder drape; actual Blender MCP recipe."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
R=Path(STUDY_ROOT)
for n in ('renders','sources'): (R/n).mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(R.parent/'player-unarmed-v13-sheets/sources/players-four-directions.blend'))
s=bpy.context.scene;s.name='VG_Player_Unarmed_v14_Sandals'
camera=[list(row) for row in s.camera.matrix_world]
bpy.data.objects['female_short_shoulder_drape'].hide_render=True;bpy.data.objects['female_short_shoulder_drape'].hide_set(True)
report={'changes':['Closed shoes replaced with thin hide soles and two narrow open straps; toes and most foot exposed','Female shoulder cloth hidden; other outfit, camera and poses retained'],'characters':{}}
for sex in ('male','female'):
    pivot=bpy.data.objects['Sheet_Direction_'+sex];pivot.rotation_euler.z=0
    for prefix in ('VG_','MH_'):bpy.data.collections[prefix+sex].hide_viewport=False
    body=bpy.data.objects['MH_'+sex+'_Body'];root=bpy.data.objects[sex+'_ROOT'].matrix_world.copy();inv=root.inverted()
    bpy.context.view_layer.update();ev=body.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    pts=[ev.matrix_world@v.co for v in me.vertices];local=[inv@p for p in pts];tree=BVHTree.FromPolygons(pts,[tuple(p.vertices) for p in me.polygons])
    report['characters'][sex]=[]
    for sign in (-1,1):
        old=bpy.data.objects[f'{sex}_shoe_{sign}'];old.hide_render=True;old.hide_set(True)
        material=old.data.materials[0]
        foot=[p for p in local if p.z<.105 and (p.x-.025)*sign>0]
        mi=Vector(tuple(min(p[i] for p in foot) for i in range(3)));ma=Vector(tuple(max(p[i] for p in foot) for i in range(3)))
        cx=(mi.x+ma.x)/2;cy=(mi.y+ma.y)/2;rx=(ma.x-mi.x)/2+.002;ry=(ma.y-mi.y)/2+.002
        def mesh_obj(name,verts,faces):
            mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.materials.append(material);mesh.update()
            obj=bpy.data.objects.new(name,mesh);bpy.data.collections['VG_'+sex].objects.link(obj);obj.parent=pivot
            return obj
        verts=[]
        for z in (mi.z-.009,mi.z-.002):
            verts.extend([root@Vector((cx+rx*math.cos(i*2*math.pi/24),cy+ry*math.sin(i*2*math.pi/24),z)) for i in range(24)])
        faces=[tuple(range(23,-1,-1)),tuple(range(24,48))]+[(i,(i+1)%24,(i+1)%24+24,i+24) for i in range(24)]
        mesh_obj(f'{sex}_sandal_sole_{sign}',verts,faces)
        # Narrow straps conform to the actual anatomical instep; open toes remain visible.
        for band,fraction in enumerate((.30,.66)):
            points=[];y0=mi.y+(ma.y-mi.y)*fraction
            for j in range(11):
                x=cx+rx*(j/10*2-1)*.96
                for dy in (-.007,.007):
                    localp=Vector((x,y0+dy,.20));hit,normal,index,dist=tree.ray_cast(root@localp,root.to_3x3()@Vector((0,0,-1)),.3)
                    if hit is None:hit=root@Vector((x,y0+dy,mi.z+.007));normal=root.to_3x3()@Vector((0,0,1))
                    points.append(hit+normal*.003)
            strap=mesh_obj(f'{sex}_sandal_strap_{sign}_{band}',points,[(j*2,j*2+1,j*2+3,j*2+2) for j in range(10)])
            sol=strap.modifiers.new('Thin hide strap','SOLIDIFY');sol.thickness=.002
        report['characters'][sex].append({'foot':sign,'foot_bounds_local':[list(mi),list(ma)],'sole_thickness_m':.007,'strap_width_m':.014})
    ev.to_mesh_clear()
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.film_transparent=True;s.render.resolution_percentage=100
for sex in ('male','female'):
    for other in ('male','female'):
        for prefix in ('VG_','MH_'):
            c=bpy.data.collections[prefix+other];c.hide_render=other!=sex;c.hide_viewport=other!=sex
    pivot=bpy.data.objects['Sheet_Direction_'+sex]
    for i,direction in enumerate(('front','right','back','left')):
        pivot.rotation_euler.z=math.radians(i*90);bpy.context.view_layer.update()
        for suffix,w,h in [('',48,96),('-inspection',192,384)]:
            s.render.resolution_x=w;s.render.resolution_y=h;s.render.filepath=str(R/'renders'/f'{sex}-{direction}{suffix}.png');bpy.ops.render.render(write_still=True)
    pivot.rotation_euler.z=0
s.render.resolution_x=48;s.render.resolution_y=96
assert camera==[list(row) for row in s.camera.matrix_world]
bpy.data.texts.new('v14_revise_kit.py').write((R/'revise_kit.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(R/'sources/players-open-sandals.blend'),compress=True)
(R/'changes.json').write_text(json.dumps(report,indent=2));print('Open sandals, no female shoulder drape; eight logical and eight inspection renders saved.')
