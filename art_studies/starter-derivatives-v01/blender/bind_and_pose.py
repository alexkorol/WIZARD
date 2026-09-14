"""Bind the existing MakeHuman character and author in-place locomotion poses.

Run via Blender MCP. This is a structural reference, not an approved animation.
The source's fitted pose becomes the new rest pose; no anatomy is replaced.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector, Matrix
from mathutils.kdtree import KDTree
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
R=Path(__file__).parent
SEX=globals().get('SEX','male')
NAME='player-'+SEX
# Open this source in a separate MCP call before executing: Blender's window
# context finishes switching after open_mainfile returns to its event loop.
assert Path(bpy.data.filepath).name == NAME+'.blend'
s=bpy.context.scene
rig=bpy.data.objects[f'MH_{SEX}_Rig'];body=bpy.data.objects[f'MH_{SEX}_Body']
pivot=bpy.data.objects['Sheet_Direction_'+SEX];pivot.rotation_euler.z=0
visible=[o for o in s.objects if o.type in ('MESH','CURVE') and not o.hide_render and o.visible_get()]
masks=[(m,m.show_viewport,m.show_render) for m in body.modifiers if m.type=='MASK']
for m,_,_ in masks:m.show_viewport=False;m.show_render=False
bpy.context.view_layer.update()
dg=bpy.context.evaluated_depsgraph_get()
baked=bpy.data.meshes.new_from_object(body.evaluated_get(dg),preserve_all_data_layers=True,depsgraph=dg)
assert len(baked.vertices)==len(body.data.vertices),'Never change anatomical topology during rest-pose baking'
body.data=baked
for m in list(body.modifiers):
    if m.type=='ARMATURE':body.modifiers.remove(m)
bpy.ops.object.select_all(action='DESELECT');rig.hide_set(False);rig.select_set(True);bpy.context.view_layer.objects.active=rig
# Bone-parented objects must retain their world transform when rest bones change.
attached=[(o,o.matrix_world.copy()) for o in visible if o.parent==rig]
bpy.ops.object.mode_set(mode='POSE');bpy.ops.pose.armature_apply(selected=False);bpy.ops.object.mode_set(mode='OBJECT')
for o,world in attached:o.matrix_world=world
arm=body.modifiers.new('Locomotion anatomical deformation','ARMATURE');arm.object=rig
for m,a,b in masks:m.show_viewport=a;m.show_render=b
bpy.context.view_layer.update()
rest={b.name:b.matrix.copy() for b in rig.pose.bones}

def parent_bone(o,bone):
    world=o.matrix_world.copy();o.parent=rig;o.parent_type='BONE';o.parent_bone=bone;o.matrix_world=world

# Transfer only anatomical bone weights. Helpers/material-selection groups do not deform kit.
bone_names=set(rig.data.bones.keys())
weights=[]
tree=KDTree(len(body.data.vertices))
for v in body.data.vertices:
    ws={body.vertex_groups[g.group].name:g.weight for g in v.groups if body.vertex_groups[g.group].name in bone_names}
    weights.append(ws);tree.insert(v.co,v.index)
tree.balance()
garment=bpy.data.objects[NAME+'_linen_single_shell']
for name in bone_names:garment.vertex_groups.new(name=name)
for v in garment.data.vertices:
    p=garment.matrix_world@v.co
    if p.z<1.03:
        # A skirt is a shared garment, so its centre retains pelvis influence.
        side='l' if p.x>0 else 'r';leg=max(0,min(.65,(1.02-p.z)/.5))
        ws={'pelvis':1-leg,'thigh_'+side:leg}
    else:
        nearest=tree.find_n(p,4);ws={}
        for _,idx,dist in nearest:
            for name,w in weights[idx].items():
                if any(t in name for t in ('arm','hand','finger','thumb','index','middle','pinky','ring')):continue
                ws[name]=ws.get(name,0)+w/max(.003,dist)**2
        if not ws:ws={'spine_03':1}
    total=sum(ws.values())
    for name,w in ws.items():garment.vertex_groups[name].add([v.index],w/total,'REPLACE')
mod=garment.modifiers.new('Bound tunic follows pelvis and legs','ARMATURE');mod.object=rig
for o in visible:
    if o==body or o==garment or o.parent_type=='BONE':continue
    if 'hair' in o.name or 'beard' in o.name or 'braid' in o.name:parent_bone(o,'head')
    elif 'sandal' in o.name:
        center=sum((o.matrix_world@Vector(c) for c in o.bound_box),Vector())/8
        parent_bone(o,'foot_l' if center.x>0 else 'foot_r')
    elif 'neck_binding' in o.name:parent_bone(o,'spine_03')
    elif 'waist_cord' in o.name or 'belt_ends' in o.name:parent_bone(o,'pelvis')

club=bpy.data.objects.get(NAME+'_gripped_club')
if club:club.hide_render=True;club.hide_set(True)
for side in ['l','r']:
    for finger in ['index','middle','ring','pinky']:
        for link in [1,2,3]:
            b=rig.pose.bones[f'{finger}_{link:02d}_{side}']
            if side=='r':b.rotation_mode='XYZ';b.rotation_euler.x=math.radians(-30)

neutral={b.name:b.matrix_basis.copy() for b in rig.pose.bones}
garment.shape_key_add(name='Basis')
body_group=body.vertex_groups['body'].index
skin_ids={v.index for v in body.data.vertices if any(g.group==body_group and g.weight>.5 for g in v.groups)}
skin_faces=[tuple(p.vertices) for p in body.data.polygons if all(i in skin_ids for i in p.vertices)]
assert skin_faces,'Collision surface must contain anatomical skin, not helper geometry'
def correct_cloth(gait,index):
    for key in list(garment.data.shape_keys.key_blocks)[1:]:key.value=0
    saved=[(m,m.show_viewport,m.show_render) for m in body.modifiers if m.type=='MASK']
    for m,_,_ in saved:m.show_viewport=False;m.show_render=False
    bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
    ev=body.evaluated_get(dg);mesh=ev.to_mesh()
    tree=BVHTree.FromPolygons([v.co for v in mesh.vertices],skin_faces)
    ev.to_mesh_clear()
    ev=garment.evaluated_get(dg);mesh=ev.to_mesh();points=[v.co.copy() for v in mesh.vertices];ev.to_mesh_clear()
    key=garment.shape_key_add(name=f'{gait}_clearance_{index+1}')
    corrections=0
    for v,p in zip(garment.data.vertices,points):
        hit,n,_,dist=tree.find_nearest(p)
        target=None
        if p.z<1.08:
            # Keep the front/back cloth panels on their own side of both legs.
            # A nearest-surface push can choose the back of a raised thigh.
            side=-1 if v.co.y<0 else 1
            ray=tree.ray_cast(Vector((p.x,side*2,p.z)),Vector((0,-side,0)),4)[0]
            if ray is not None and (p.y-ray.y)*side<.025:
                target=Vector((p.x,ray.y+side*.03,p.z))
        elif dist<.13 and (p-hit).dot(n)<.018:
            target=hit+n*.025
        if target is not None:
            transform=Matrix(((0,0,0,0),)*4)
            for g in v.groups:
                name=garment.vertex_groups[g.group].name
                transform+=(rig.pose.bones[name].matrix@rig.data.bones[name].matrix_local.inverted())*g.weight
            key.data[v.index].co=transform.inverted()@target;corrections+=1
    for m,a,b in saved:m.show_viewport=a;m.show_render=b
    for k in list(garment.data.shape_keys.key_blocks)[1:]:
        if k==key:
            for frame in range(1,9):
                k.value=1 if frame==index+1 else 0
                k.keyframe_insert('value',frame=frame)
        else:
            k.value=0;k.keyframe_insert('value',frame=index+1)
    key.value=1
    bpy.context.view_layer.update()
    return corrections
def aim(name,target):
    b=rig.pose.bones[name];head=b.head.copy()
    q=(b.tail-b.head).rotation_difference(Vector(target)-head)
    b.matrix=Matrix.Translation(head)@q.to_matrix().to_4x4()@Matrix.Translation(-head)@b.matrix
    bpy.context.view_layer.update()

def leg(side,ankle):
    thigh=rig.pose.bones['thigh_'+side];calf=rig.pose.bones['calf_'+side]
    hip=thigh.head.copy();v=ankle-hip;d=v.length;a=thigh.length;b=calf.length
    assert d<a+b,'Foot target exceeds anatomical leg reach'
    axis=v.normalized();along=(a*a-b*b+d*d)/(2*d)
    pole=Vector((0,-1,0));pole=(pole-axis*pole.dot(axis)).normalized()
    knee=hip+axis*along+pole*math.sqrt(max(0,a*a-along*along))
    aim('thigh_'+side,knee);aim('calf_'+side,ankle)
    foot=rig.pose.bones['foot_'+side]
    foot.matrix=Matrix.Translation(ankle)@rest['foot_'+side].to_3x3().to_4x4()
    bpy.context.view_layer.update()

def pose(gait,index):
    s.frame_set(index+1)
    for b in rig.pose.bones:b.matrix_basis=neutral[b.name].copy()
    t=index*math.tau/8; sprint=gait=='sprint'
    root=rig.pose.bones['Root'];root.location.z=(-.12 if sprint else -.085)+(.025 if sprint else .015)*math.cos(2*t)
    bpy.context.view_layer.update()
    # Slight forward torso inclination, with the pelvis/root kept in place.
    b=rig.pose.bones['spine_03'];aim('spine_03',b.head+Vector((0,-.035 if sprint else -.01,.13)))
    for side,phase,sign in [('l',t,1),('r',t+math.pi,-1)]:
        stride=.27 if sprint else .24
        lift=(.23 if sprint else .095)*max(0,-math.sin(phase))
        if sprint:lift+=.035*max(0,(abs(math.sin(phase))-.6)/.4)
        ankle=Vector((sign*.105,-stride*math.cos(phase),.068+lift))
        leg(side,ankle)
        shoulder=rig.pose.bones['upperarm_'+side].head.copy()
        swing=-math.cos(phase)*(.17 if sprint else .12)
        aim('upperarm_'+side,shoulder+Vector((sign*.055,swing,-.20)))
        elbow=rig.pose.bones['lowerarm_'+side].head.copy()
        aim('lowerarm_'+side,elbow+Vector((sign*.015,-.09 if sprint else -.08,.23 if sprint else -.24)))
        forearm=rig.pose.bones['lowerarm_'+side]
        aim('hand_'+side,forearm.tail+(forearm.tail-forearm.head).normalized()*.075)
    # Every animated component is keyed into the editable source.
    for b in rig.pose.bones:
        b.keyframe_insert('location',frame=index+1,group=b.name)
        if b.rotation_mode=='QUATERNION':b.keyframe_insert('rotation_quaternion',frame=index+1,group=b.name)
        else:b.keyframe_insert('rotation_euler',frame=index+1,group=b.name)
        b.keyframe_insert('scale',frame=index+1,group=b.name)
    count=correct_cloth(gait,index)
    return {'left_ankle':list(rig.pose.bones['foot_l'].head),'right_ankle':list(rig.pose.bones['foot_r'].head),'root':list(root.location),'cloth_vertices_corrected':count}

s.render.resolution_x=48;s.render.resolution_y=96;s.render.resolution_percentage=100
s.cycles.samples=32;s.cycles.use_denoising=False
s.render.film_transparent=True;s.render.image_settings.color_mode='RGBA'
s.frame_start=1;s.frame_end=8
if not globals().get('BIND_ONLY',False):
    out=R/'motion';out.mkdir(exist_ok=True)
    for gait in globals().get('GAITS',['walk']):
        if rig.animation_data:rig.animation_data.action=None
        if garment.data.shape_keys.animation_data:garment.data.shape_keys.animation_data.action=None
        rows=[]
        for i in range(8):rows.append(pose(gait,i))
        rig.animation_data.action.name=NAME+'_'+gait+'_eight_phases'
        rig.animation_data.action.use_fake_user=True
        garment.data.shape_keys.animation_data.action.name=NAME+'_'+gait+'_cloth_clearance'
        garment.data.shape_keys.animation_data.action.use_fake_user=True
        for direction,angle in globals().get('DIRECTIONS',[('right',90)]):
            pivot.rotation_euler.z=math.radians(angle)
            for i in range(8):
                s.frame_set(i+1);s.render.filepath=str(out/f'{SEX}-{gait}-{direction}-{i+1}.png');bpy.ops.render.render(write_still=True)
        (out/f'{SEX}-{gait}-kinematics.json').write_text(json.dumps(rows,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(R/f'{SEX}-bound-motion.blend'),compress=True)
print('BOUND_AND_POSED',SEX)
