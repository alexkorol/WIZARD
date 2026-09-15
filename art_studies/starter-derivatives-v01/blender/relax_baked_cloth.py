"""Relax subpixel solver creases while retaining body clearance and the collar.

This is a mesh correction on the eight editable cloth samples. It never
changes rendered pixels, actor dimensions, skeletal motion or camera scale.
"""
import bpy,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
R=Path(__file__).parent
SEX=globals().get('SEX','female');GAIT=globals().get('GAIT','walk')
s=bpy.context.scene
snap=bpy.data.objects[f'{SEX}_{GAIT}_baked_cloth_samples']
if snap.get('relaxed_solver_creases'):
    raise RuntimeError('Already relaxed: reload the fresh simulation before repeating')
cloth=bpy.data.objects[f'player-{SEX}_linen_single_shell']
proxy=bpy.data.objects['Full_anatomical_cloth_collider'];proxy.hide_set(False)
neighbors=[set() for v in snap.data.vertices]
for edge in snap.data.edges:
    a,b=edge.vertices;neighbors[a].add(b);neighbors[b].add(a)
weights=[max(0,min(1,(1.04-v.co.z)/.10)) for v in cloth.data.vertices]
world=snap.matrix_world.copy();local=world.inverted();reports=[]
for phase in range(1,10):
    s.frame_set(68+phase*4);bpy.context.view_layer.update()
    ev=proxy.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    tree=BVHTree.FromPolygons([ev.matrix_world@v.co for v in me.vertices],[tuple(f.vertices) for f in me.polygons])
    ev.to_mesh_clear()
    key=snap.data.shape_keys.key_blocks[f'Phase_{phase}' if phase<9 else 'Next_cycle_first_phase']
    points=[world@v.co for v in key.data];original=[p.copy() for p in points]
    for _ in range(16):
        updated=[]
        for i,p in enumerate(points):
            if weights[i] and neighbors[i]:
                avg=sum((points[j] for j in neighbors[i]),Vector())/len(neighbors[i])
                p=p.lerp(avg,.48*weights[i])
                hit,n,_,distance=tree.find_nearest(p)
                if distance<.07 and (p-hit).dot(n)<.009:p=hit+n*.009
            updated.append(p)
        points=updated
    for v,p in zip(key.data,points):v.co=local@p
    reports.append(dict(phase=phase,max_mesh_correction_m=max((p-q).length for p,q in zip(points,original))))
# Basis is also used by the seam measurement and editable first pose.
for a,b in zip(snap.data.shape_keys.key_blocks['Basis'].data,snap.data.shape_keys.key_blocks['Phase_1'].data):a.co=b.co
snap['relaxed_solver_creases']=True
proxy.hide_set(True);s.frame_set(72)
path=R/'pose-review'/f'{SEX}-{GAIT}-posture.json';audit=json.loads(path.read_text())
audit['cloth_relaxation']=reports;path.write_text(json.dumps(audit,indent=2))
print('RELAXED_CLOTH',SEX,GAIT)
