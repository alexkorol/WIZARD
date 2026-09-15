"""Bake decorative cords against cloth topology, not unrelated bone transforms.

Bind each source curve point to a rest-cloth triangle once. Barycentric
coordinates then follow all cloth samples; tube thickness stays in metres.
The original editable curves remain hidden for revisions.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
R=Path(__file__).parent
SEX=globals().get('SEX','female'); GAIT=globals().get('GAIT','walk')
s=bpy.context.scene;s.frame_set(1)
cloth=bpy.data.objects[f'player-{SEX}_linen_single_shell']
snap=bpy.data.objects[f'{SEX}_{GAIT}_baked_cloth_samples']
assert len(cloth.data.vertices)==len(snap.data.vertices)
cloth.data.calc_loop_triangles()
triangles=[tuple(t.vertices) for t in cloth.data.loop_triangles]
rest=[cloth.matrix_world@v.co for v in cloth.data.vertices]
tree=BVHTree.FromPolygons(rest,triangles,all_triangles=True)

def barycentric(p,a,b,c):
    u=b-a;v=c-a;w=p-a
    aa=u.dot(u);ab=u.dot(v);bb=v.dot(v);wa=w.dot(u);wb=w.dot(v)
    det=aa*bb-ab*ab
    y=(bb*wa-ab*wb)/det;z=(aa*wb-ab*wa)/det
    return (1-y-z,y,z)

report=[]
for suffix in ['waist_cord','belt_ends','neck_binding_-1','neck_binding_1']:
    source=bpy.data.objects[f'player-{SEX}_{suffix}']
    name=source.name+'_cloth_bound'
    if bpy.data.objects.get(name):bpy.data.objects.remove(bpy.data.objects[name],do_unlink=True)
    spline=source.data.splines[0]
    controls=[source.matrix_world@p.co.xyz for p in spline.points]
    # Subdivide long belt-tail spans before binding them to skirt triangles.
    pts=[];cyclic=spline.use_cyclic_u
    for i,a in enumerate(controls):
        if i==len(controls)-1 and not cyclic:pts.append(a);break
        b=controls[(i+1)%len(controls)]
        steps=max(1,math.ceil((b-a).length/.012))
        pts.extend(a.lerp(b,j/steps) for j in range(steps))
    bindings=[]
    for p in pts:
        hit,normal,ti,distance=tree.find_nearest(p)
        ids=triangles[ti]
        bindings.append((ids,barycentric(hit,*(rest[k] for k in ids))))
    radius=source.data.bevel_depth
    def tube(key):
        positions=[snap.matrix_world@v.co for v in key.data]
        centers=[];normals=[]
        for ids,weights in bindings:
            a,b,c=(positions[k] for k in ids)
            n=(b-a).cross(c-a).normalized()
            centers.append(sum((positions[k]*w for k,w in zip(ids,weights)),Vector())+n*radius*.65)
            normals.append(n)
        verts=[]
        for i,center in enumerate(centers):
            prev=centers[(i-1)%len(centers)] if cyclic or i else center
            nxt=centers[(i+1)%len(centers)] if cyclic or i<len(centers)-1 else center
            tangent=(nxt-prev).normalized()
            u=tangent.cross(normals[i]).normalized();v=tangent.cross(u).normalized()
            for j in range(8):
                angle=2*math.pi*j/8
                verts.append(center+radius*(math.cos(angle)*u+math.sin(angle)*v))
        return verts
    keys=snap.data.shape_keys.key_blocks
    faces=[]
    for i in range(len(pts) if cyclic else len(pts)-1):
        for j in range(8):
            n=(i+1)%len(pts);k=(j+1)%8
            faces.append((i*8+j,n*8+j,n*8+k,i*8+k))
    if not cyclic:
        faces.extend([tuple(reversed(range(8))),tuple((len(pts)-1)*8+j for j in range(8))])
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(tube(keys['Phase_1']),[],faces);mesh.update()
    ob=bpy.data.objects.new(name,mesh);s.collection.objects.link(ob)
    for mat in source.data.materials:mesh.materials.append(mat)
    for face in mesh.polygons:face.use_smooth=True
    ob.shape_key_add(name='Basis')
    for i in range(1,10):
        srcname=f'Phase_{i}' if i<9 else 'Next_cycle_first_phase'
        key=ob.shape_key_add(name=srcname)
        for v,p in zip(key.data,tube(keys[srcname])):v.co=p
        for phase,frame in enumerate(range(72,105,4),1):
            key.value=1 if phase==i else 0;key.keyframe_insert('value',frame=frame)
    source.hide_render=True;source.hide_set(True)
    report.append(dict(name=name,points=len(pts),radius_m=radius,attachment='fixed rest-triangle barycentric coordinates'))
s.frame_set(72)
bpy.context.view_layer.update()
path=R/'pose-review'/f'{SEX}-{GAIT}-posture.json'
audit=json.loads(path.read_text());audit['cloth_trim']=report;path.write_text(json.dumps(audit,indent=2))
print('CLOTH_BOUND_TRIM',SEX,GAIT)
