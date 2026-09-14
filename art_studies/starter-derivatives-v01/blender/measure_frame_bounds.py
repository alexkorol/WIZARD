"""Measure the full 3D silhouette before choosing a frame's transparent margins."""
import bpy,math,json
from pathlib import Path
from mathutils import Matrix
from bpy_extras.object_utils import world_to_camera_view
R=Path(__file__).parent;SEX=globals().get('SEX','female');GAIT=globals().get('GAIT','walk')
s=bpy.context.scene;s.render.resolution_x=48;s.render.resolution_y=96
c=s.camera;matrix=c.matrix_world.copy();records={}
for direction,angle in [('front',0),('right',90),('back',180),('left',270)]:
    c.matrix_world=Matrix.Rotation(math.radians(-angle),4,'Z')@matrix
    poses=[]
    for frame in range(72,101,4):
        s.frame_set(frame);bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();points=[]
        for o in s.objects:
            if o.type not in ('MESH','CURVE') or o.hide_render or not o.visible_get():continue
            ev=o.evaluated_get(dg);me=ev.to_mesh()
            # Only vertices participating in rendered polygons affect coverage.
            ids={i for p in me.polygons for i in p.vertices}
            for i in ids:
                v=world_to_camera_view(s,c,ev.matrix_world@me.vertices[i].co)
                points.append((v.x*48,(1-v.y)*96))
            ev.to_mesh_clear()
        poses.append([min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points)])
    records[direction]={'poses':poses,'envelope':[min(p[0] for p in poses),min(p[1] for p in poses),max(p[2] for p in poses),max(p[3] for p in poses)]}
c.matrix_world=matrix
(R/f'{SEX}-{GAIT}-bounds.json').write_text(json.dumps(records,indent=2))
print(SEX,GAIT,{k:v['envelope'] for k,v in records.items()})
