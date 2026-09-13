"""Pose the imported, weighted MakeHuman meshes and retain the existing kit designs."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v10_MPFB'];bpy.context.window.scene=scene
cam=scene.camera;original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
P=json.loads((ROOT/'parameters.json').read_text());report={}
for sex in ['female','male']:
    oldcol=bpy.data.collections['VG_'+sex];oldcol.hide_viewport=False
    body=bpy.data.objects['MH_'+sex+'_Body'];rig=bpy.data.objects['MH_'+sex+'_Rig'];col=bpy.data.collections['MH_'+sex]
    R=bpy.data.objects[sex+'_ROOT'].matrix_world.copy()
    scale=P[sex]['height']/body.dimensions.z
    rig.matrix_world=R@Matrix.Translation(Vector((.025,0,0)))@Matrix.Scale(scale,4)
    def aim(name,direction):
        p=rig.pose.bones[name];head=p.head.copy();q=(p.tail-p.head).rotation_difference(Vector(direction))
        p.matrix=Matrix.Translation(head)@q.to_matrix().to_4x4()@Matrix.Translation(-head)@p.matrix
        bpy.context.view_layer.update()
    for side,sign in [('l',1),('r',-1)]:
        aim('upperarm_'+side,(sign*.040,-.008,-.245))
        aim('lowerarm_'+side,(sign*.017,-.045,-.235))
        aim('hand_'+side,(sign*.005,-.008,-.040))
        # Mild stagger and almost vertical shins, with naturally soft knees.
        aim('thigh_'+side,(sign*.012,-.034 if sign==1 else .018,-.37))
        aim('calf_'+side,(sign*.012,.021,-.38))
    bpy.context.view_layer.update()
    # Ground actual evaluated body; no camera refit or aspect changes.
    dg=bpy.context.evaluated_depsgraph_get();ev=body.evaluated_get(dg);mesh=ev.to_mesh()
    pts=[ev.matrix_world@v.co for v in mesh.vertices];lowest=min(p.z for p in pts)
    rig.location.z-=lowest
    ev.to_mesh_clear();bpy.context.view_layer.update()
    # Hide only the former anatomical primitives. Clothing/hair remain editable.
    anatomical=['head','nose','neck','upper_chest']+[f'{p}_{sign}' for p in ['ear','upper_arm','forearm','empty_hand','thumb','thigh','knee','calf'] for sign in [-1,1]]
    for suffix in anatomical:
        o=bpy.data.objects.get(sex+'_'+suffix)
        if o:o.hide_render=True;o.hide_set(True)
    # Align the low footwear and bracers with the new rig.
    for side,sign in [('l',1),('r',-1)]:
        foot=rig.pose.bones['foot_'+side];ankle=R.inverted()@(rig.matrix_world@foot.head)
        shoe=bpy.data.objects[f'{sex}_shoe_{sign}'];shoe.matrix_world=R@Matrix.Translation(Vector((ankle.x,ankle.y-.052,.047)))@Matrix.Diagonal((.057 if sex=='female' else .064,.127,.047,1))
        boot=bpy.data.objects[f'{sex}_ankle_shoe_{sign}'];boot.hide_render=True;boot.hide_set(True)
        guard=bpy.data.objects[f'{sex}_wrist_guard_{sign}'];pb=rig.pose.bones['lowerarm_'+side]
        a=R.inverted()@(rig.matrix_world@pb.head);b=R.inverted()@(rig.matrix_world@pb.tail);a=a.lerp(b,.68)
        length=max(v.co.z for v in guard.data.vertices)
        guard.matrix_world=R@Matrix.Translation(a)@(b-a).to_track_quat('Z','Y').to_matrix().to_4x4()@Matrix.Diagonal((.78,.78,(b-a).length/length,1))
    # Fit clothing radially to the actual torso surface, preserving seams and hems.
    dg=bpy.context.evaluated_depsgraph_get();ev=body.evaluated_get(dg);mesh=ev.to_mesh()
    T=R.inverted()@bpy.data.objects[sex+'_hide_vest'].matrix_world
    inv=(R@T).inverted();verts=[inv@(ev.matrix_world@v.co) for v in mesh.vertices]
    tree=BVHTree.FromPolygons(verts,[tuple(f.vertices) for f in mesh.polygons],all_triangles=False)
    fitted=[]
    names=['hide_vest','linen_tunic','belt']+(['fitted_open_vest'] if sex=='female' else [])
    for suffix in names:
        o=bpy.data.objects.get(sex+'_'+suffix)
        if not o or o.hide_render:continue
        o.data=o.data.copy();space=inv@o.matrix_world;back=space.inverted()
        for v in o.data.vertices:
            p=space@v.co;origin=Vector((0,0,p.z));d=Vector((p.x,p.y,0));length=d.length
            if length<.02:continue
            d.normalize();hit,normal,idx,dist=tree.ray_cast(origin,d,.32)
            if hit is not None and dist+.009>length:
                p=origin+d*(dist+(.016 if suffix=='fitted_open_vest' else .009));v.co=back@p
        o.data.update();fitted.append(suffix)
    ev.to_mesh_clear()
    col.hide_render=False
    report[sex]={'source':'MakeHuman MPFB 2.0.17 CC0 basemesh and game_engine weighted rig','scale':scale,'height_target':P[sex]['height'],'fitted':fitted,'pose':{n:{'head':list(p.head),'tail':list(p.tail)} for n,p in rig.pose.bones.items() if n.startswith(('upperarm','lowerarm','thigh','calf'))}}
P['status']='MakeHuman anatomical bases replacing primitive guides; imagegen requested'
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2));(ROOT/'fit-verification.json').write_text(json.dumps(report,indent=2))
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
for sex in ['male','female']:
    for other in ['male','female']:
        bpy.data.collections['VG_'+other].hide_render=other!=sex;bpy.data.collections['MH_'+other].hide_render=other!=sex
    render(sex+'-logical-render.png',32,64);render(sex+'-structural-inspection.png',256,512)
    for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
        target=Vector((0,0,.86));az=math.radians(az);el=math.radians(el)
        cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
        render(sex+'-inspect-'+name+'.png',256,384)
    cam.matrix_world=original[0];cam.data.lens=original[1];cam.data.shift_y=original[2]
scene.render.resolution_x=32;scene.render.resolution_y=64
bpy.data.texts.new('pose_and_fit_v10.py').write((ROOT/'pose_and_fit.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'players-mpfb-v10.blend'),compress=True)
print('Imported anatomical models posed, dressed and rendered in fixed camera.')
