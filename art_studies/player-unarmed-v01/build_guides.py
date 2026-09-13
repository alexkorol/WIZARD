"""Run via execute_blender_code. All modeling and rendering occur in live Blender."""
import bpy
import math
import json
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

ROOT = Path(globals().get('STUDY_ROOT', r'Z:\Code\.worktrees\wizard-art-player-guides\art_studies\player-unarmed-v01'))
P = json.loads((ROOT/'parameters.json').read_text())
(ROOT/'renders').mkdir(exist_ok=True)
(ROOT/'sources').mkdir(exist_ok=True)
assert 'VG_Player_Unarmed_v01' not in bpy.data.scenes, 'Study exists: revise it instead of rebuilding.'
# Preserve the preexisting scene in the saved .blend; do not clear any objects.
scene = bpy.data.scenes.new('VG_Player_Unarmed_v01')
bpy.context.window.scene = scene
world = bpy.data.worlds.new('VG_neutral_world')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.34,0.37,0.40,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.45
scene.world = world
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = False
scene.cycles.seed = P['seed']
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.color_depth = '8'
scene.render.resolution_percentage = 100
scene.render.resolution_x, scene.render.resolution_y = P['logical_canvas']
scene.render.use_compositing = False
scene.render.use_sequencer = False
scene.render.use_motion_blur = False
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'
scene.view_settings.exposure = 0
scene.view_settings.gamma = 1

def material(name, color):
    m = bpy.data.materials.new('VG_'+name)
    m.diffuse_color = (*color,1)
    m.use_nodes = True
    bs = m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*color,1)
    bs.inputs['Roughness'].default_value = 0.82
    return m
skin = material('skin_blockout',(0.43,0.31,0.225))
linen = material('linen_blockout',(0.59,0.56,0.46))
hide = material('hide_blockout',(0.22,0.115,0.068))
edge = material('hide_edges',(0.115,0.065,0.040))
hair = material('hair_blockout',(0.068,0.044,0.030))

def link_obj(obj, collection, parent=None):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj

def ellipsoid(name, loc, scale, mat, collection, parent=None, segments=16, rings=8):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return link_obj(obj,collection,parent)

def loft(name, rings, mat, col, parent, n=16, cap=True):
    # Each ring: z, horizontal radius, depth radius, y center.
    verts = [(rx*math.cos(2*math.pi*j/n), cy+ry*math.sin(2*math.pi*j/n), z)
             for z,rx,ry,cy in rings for j in range(n)]
    faces = []
    for k in range(len(rings)-1):
        for j in range(n):
            faces.append((k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j))
    if cap:
        faces += [tuple(reversed(range(n))), tuple((len(rings)-1)*n+j for j in range(n))]
    mesh = bpy.data.meshes.new(name+'_mesh'); mesh.from_pydata(verts, [], faces); mesh.update()
    obj = bpy.data.objects.new(name,mesh); col.objects.link(obj); obj.parent=parent
    obj.data.materials.append(mat)
    return obj

def segment(name,a,b,radii,mat,col,parent,n=12):
    a,b=Vector(a),Vector(b)
    length=(b-a).length
    obj=loft(name,[(t*length,r,r*depth,0) for t,r,depth in radii],mat,col,parent,n=n)
    obj.location=a; obj.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler()
    return obj

def empty(name,location,col,parent=None):
    obj=bpy.data.objects.new(name,None);col.objects.link(obj);obj.location=location
    obj.empty_display_type='PLAIN_AXES';obj.empty_display_size=0.055
    if parent: obj.parent=parent
    return obj

def reparent_keep(obj,parent):
    bpy.context.view_layer.update()
    matrix=obj.matrix_world.copy();obj.parent=parent;obj.matrix_world=matrix

models={}
for sex in ('male','female'):
    q=P[sex]; h=q['height']; s=h/1.78
    col=bpy.data.collections.new('VG_'+sex);scene.collection.children.link(col)
    root=empty(sex+'_ROOT',(0,0,0),col)
    for k,v in q.items(): root[k]=v
    root['equipment']='unarmed';root['approval']='unapproved';root['scale']='provisional'
    sw=q['shoulder_width']/2; hw=q['hip_width']/2; ww=q['waist_width']/2
    # Compact thorax and pelvis under the tunic; an unbroken vest wraps the torso.
    torso=loft(sex+'_linen_tunic',[(.72*s,hw+.055,.125*s,0),(.89*s,hw+.050,.125*s,0),(1.01*s,ww+.014,.103*s,0),(1.18*s,ww+.014,.115*s,0),(1.38*s,sw-.013,.12*s,0),(1.47*s,sw-.008,.09*s,0),(1.50*s,.09*s,.072*s,0)],linen,col,root)
    vest=loft(sex+'_hide_vest',[(1.015*s,ww+.022,.112*s,0),(1.15*s,ww+.029,.13*s,0),(1.31*s,sw-.005,.133*s,0),(1.405*s,sw-.012,.113*s,0)],hide,col,root,cap=False)
    # Broad shoulder straps connect the front and back panels; no floating plates.
    for sign in (-1,1):
        x=sign*(sw-.040)
        segment(sex+f'_shoulder_strap_{sign}',(x,-.093*s,1.39*s),(x,0,1.477*s),[(0,.038*s,.40),(1,.038*s,.40)],hide,col,root)
        segment(sex+f'_shoulder_strap_back_{sign}',(x,0,1.477*s),(x,.10*s,1.39*s),[(0,.038*s,.40),(1,.038*s,.40)],hide,col,root)
    loft(sex+'_belt',[(1.015*s,ww+.027,.117*s,0),(1.057*s,ww+.027,.117*s,0)],edge,col,root,cap=False)
    # Small side-lacing seam and plain tie; no metal fittings.
    ellipsoid(sex+'_belt_knot',(.025*s,-.12*s,1.035*s),(.022*s,.018*s,.018*s),hide,col,root)
    segment(sex+'_belt_end',(.027*s,-.13*s,1.02*s),(.040*s,-.135*s,.94*s),[(0,.012*s,.35),(1,.010*s,.35)],hide,col,root)
    # Weight distributed on both feet, subtly offset in depth.
    for sign in (-1,1):
        x=sign*.10*s; footx=sign*.14*s; fy=-.035*s if sign==1 else .04*s
        hip=(x,0,.86*s); knee=(sign*.125*s,fy*.5,.46*s); ankle=(footx,fy,.10*s)
        segment(sex+f'_thigh_{sign}',hip,knee,[(0,.092*s,.9),(.3,.087*s,.92),(.8,.065*s,.90),(1,.061*s,.90)],skin,col,root)
        segment(sex+f'_calf_{sign}',knee,ankle,[(0,.062*s,.9),(.25,.071*s,.93),(.6,.054*s,.9),(1,.036*s,.95)],skin,col,root)
        ellipsoid(sex+f'_knee_{sign}',knee,(.061*s,.056*s,.062*s),skin,col,root)
        segment(sex+f'_ankle_shoe_{sign}',(footx,fy,.06*s),(footx,fy,.19*s),[(0,.05*s,1.0),(1,.045*s,1.0)],hide,col,root)
        ellipsoid(sex+f'_shoe_{sign}',(footx,fy-.053*s,.050*s),(.066*s,.126*s,.050*s),hide,col,root)
        # Bare forearms and visible empty hands. Future held props parent to wrists.
        shoulder=(sign*(sw+.009),0,1.425*s)
        elbow=(sign*(sw+.068),-.012*s,1.14*s)
        wrist=(sign*(sw+.089),-.055*s,.93*s)
        sj=empty(sex+f'_shoulder_CTRL_{sign}',shoulder,col,root)
        ej=empty(sex+f'_elbow_CTRL_{sign}',elbow,col,root)
        wj=empty(sex+f'_hand_SOCKET_{sign}',wrist,col,root)
        upper=segment(sex+f'_upper_arm_{sign}',shoulder,elbow,[(0,.070*s,.90),(.25,.075*s,.91),(.65,.060*s,.92),(1,.047*s,.95)],skin,col,root)
        fore=segment(sex+f'_forearm_{sign}',elbow,wrist,[(0,.049*s,.95),(.27,.055*s,.92),(1,.032*s,1)],skin,col,root)
        palm=ellipsoid(sex+f'_empty_hand_{sign}',(wrist[0],wrist[1]-.01*s,wrist[2]-.05*s),(.037*s,.034*s,.065*s),skin,col,root)
        thumb=ellipsoid(sex+f'_thumb_{sign}',(wrist[0]-sign*.027*s,wrist[1]-.030*s,wrist[2]-.025*s),(.017*s,.019*s,.032*s),skin,col,root)
        cuff=segment(sex+f'_wrist_guard_{sign}',Vector(elbow).lerp(Vector(wrist),.65),Vector(elbow).lerp(Vector(wrist),.94),[(0,.044*s,1),(1,.038*s,1)],hide,col,root)
        reparent_keep(upper,sj);reparent_keep(fore,ej);reparent_keep(cuff,ej)
        reparent_keep(palm,wj);reparent_keep(thumb,wj)
        reparent_keep(wj,ej);reparent_keep(ej,sj)
    segment(sex+'_neck',(0,0,1.44*s),(0,0,1.59*s),[(0,.058*s,1),(1,.053*s,1)],skin,col,root)
    # Seven-and-a-half-head adult proportion, simple facial planes.
    hh=q['head_height']; chin=h-hh
    head=loft(sex+'_head',[(chin,.040*s,.047*s,-.014*s),(chin+.035*s,.065*s,.065*s,-.010*s),(chin+.10*s,.079*s,.076*s,0),(chin+.17*s,.080*s,.083*s,.006*s),(h-.022*s,.064*s,.065*s,.009*s),(h,.022*s,.03*s,.01*s)],skin,col,root)
    ellipsoid(sex+'_nose',(0,-.076*s,chin+.092*s),(.021*s,.029*s,.036*s),skin,col,root,segments=8,rings=4)
    for sign in (-1,1):
        ellipsoid(sex+f'_ear_{sign}',(sign*.077*s,0,chin+.10*s),(.013*s,.027*s,.038*s),skin,col,root,segments=10,rings=6)
    haircap=loft(sex+'_hair',[(chin+.148*s,.081*s,.084*s,.006*s),(h-.025*s,.071*s,.074*s,.01*s),(h+.005*s,.023*s,.033*s,.011*s)],hair,col,root)
    if sex=='female':
        ellipsoid(sex+'_tied_hair',(0,.082*s,chin+.125*s),(.067*s,.050*s,.065*s),hair,col,root)
    root.rotation_euler.z=math.radians(P['body_yaw_degrees'])
    models[sex]=(col,root)

cam_data=bpy.data.cameras.new('VG_fixed_camera');cam=bpy.data.objects.new('VG_fixed_camera',cam_data);scene.collection.objects.link(cam);scene.camera=cam
target=Vector((0,0,.87));distance=8;el=math.radians(P['camera_elevation_degrees'])
cam.location=target+Vector((0,-distance*math.cos(el),distance*math.sin(el)))
cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
cam_data.type='PERSP';cam_data.sensor_fit='VERTICAL';cam_data.sensor_height=32;cam_data.lens=130
cam_data.dof.use_dof=False
for name,loc,power,size in [('key',(-3,-4,6),420,4),('fill',(3,-1,3),140,3),('top',(0,3,5),230,3)]:
    light=bpy.data.lights.new('VG_'+name,'AREA');light.energy=power;light.shape='DISK';light.size=size
    obj=bpy.data.objects.new('VG_'+name,light);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(Vector((0,0,.9))-obj.location).to_track_quat('-Z','Y').to_euler()

bpy.context.view_layer.update()
def projected_bounds(col):
    points=[world_to_camera_view(scene,cam,o.matrix_world@Vector(c)) for o in col.objects if o.type=='MESH' for c in o.bound_box]
    return min(p.x for p in points),min(p.y for p in points),max(p.x for p in points),max(p.y for p in points)
# Fit the MALE once; female uses this exact camera and world pixel density.
col,_=models['male'];x0,y0,x1,y1=projected_bounds(col)
cam_data.lens *= (80/96)/(y1-y0)
bpy.context.view_layer.update()
x0,y0,x1,y1=projected_bounds(col)
foot=world_to_camera_view(scene,cam,Vector((0,0,0)))
cam_data.shift_x += (foot.x-.5)*64/96
cam_data.shift_y += foot.y-(1-P['anchor'][1]/96)-0.070
bpy.context.view_layer.update()
settings={'camera_location':list(cam.location),'camera_rotation_euler':list(cam.rotation_euler),'lens_mm':cam_data.lens,'sensor_height_mm':32,'sensor_fit':'VERTICAL','shift_x':cam_data.shift_x,'shift_y':cam_data.shift_y,'anchor':P['anchor'],'logical_canvas':P['logical_canvas'],'elevation_degrees':P['camera_elevation_degrees'],'projection':'perspective; camera aligned to straight world grid','seed':P['seed'],'samples':32,'scale_status':P['scale_status'],'projected_bounds':{sex:projected_bounds(c) for sex,(c,r) in models.items()}}
(ROOT/'camera-and-render.json').write_text(json.dumps(settings,indent=2))
scene['status']='UNAPPROVED - STRUCTURE ONLY';scene['logical_canvas']='64 x 96 - provisional';scene['anchor']='32,89'
recipe=bpy.data.texts.new('build_guides.py');recipe.write((ROOT/'build_guides.py').read_text())
params=bpy.data.texts.new('parameters.json');params.write(json.dumps(P,indent=2))
for sex in ('male','female'):
    for key,(c,r) in models.items(): c.hide_render=(key!=sex)
    scene.render.resolution_x,scene.render.resolution_y=P['logical_canvas']
    scene.render.filepath=str(ROOT/'renders'/f'{sex}-logical-render.png')
    bpy.ops.render.render(write_still=True)
    # Inspection-only smooth render, never an imagegen structural input.
    scene.render.resolution_x,scene.render.resolution_y=384,576
    scene.render.filepath=str(ROOT/'renders'/f'{sex}-structural-inspection.png')
    bpy.ops.render.render(write_still=True)
scene.render.resolution_x,scene.render.resolution_y=P['logical_canvas']
models['female'][0].hide_render=True;models['male'][0].hide_render=False
for c,r in models.values(): c.hide_viewport=False
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-unarmed-v01.blend'),compress=True)
print(json.dumps({'saved':str(ROOT/'sources'/'player-unarmed-v01.blend'),'settings':settings,'objects':{s:len(c.objects) for s,(c,r) in models.items()}},indent=2))
