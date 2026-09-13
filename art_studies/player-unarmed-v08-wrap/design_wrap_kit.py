"""Original wrap-tunic light kit on the existing adult female; Blender MCP recipe."""
import bpy,math,json,hashlib
from pathlib import Path
from mathutils import Matrix,Vector
ROOT=Path(STUDY_ROOT)
for d in ('renders','sources'): (ROOT/d).mkdir(exist_ok=True)
scene=bpy.data.scenes['VG_Player_Unarmed_v07_Idle'];bpy.context.window.scene=scene
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-v08.blend'),compress=True)
scene.name='VG_Player_Unarmed_v08_Wrap';cam=scene.camera
original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
P=json.loads((ROOT/'parameters.json').read_text());s=1.70/1.78
col=bpy.data.collections['VG_female'];col.hide_viewport=False
root=bpy.data.objects['female_ROOT'];R=root.matrix_world.copy();T=R.inverted()@bpy.data.objects['female_hide_vest'].matrix_world
def mat(name,c):
    m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True
    b=m.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=(*c,1);b.inputs['Roughness'].default_value=.85
    return m
cloth=mat('VG_wrap_faded_green_v08',(.15,.24,.205));edge=mat('VG_wrap_pale_flax_v08',(.45,.40,.285))
leather=mat('VG_wrap_russet_hide_v08',(.24,.115,.055));dark=mat('VG_wrap_dark_hide_v08',(.085,.051,.028))
hair=mat('VG_wrap_chestnut_hair_v08',(.115,.043,.019));skin=bpy.data.materials['VG_skin_blockout']
# Preserve the discarded photo costume as hidden editable objects in this milestone.
discard=['cord_skirt','neck_band','belt_disc','belt_disc_boss','loose_sleeve_-1','loose_sleeve_1','hair_back','hair_sweep','hair_other_side','tied_hair','belt_tail_0','belt_tail_1']+[f'skirt_fringe_{i}' for i in range(24)]
for suffix in discard:
    o=bpy.data.objects['female_'+suffix];o.hide_render=True;o.hide_set(True)
def meshobj(name,vs,faces,material,transform=None):
    mesh=bpy.data.meshes.new(name+'_v08');mesh.from_pydata(vs,[],faces);mesh.materials.append(material);mesh.update()
    o=bpy.data.objects.get(name)
    if o:o.data=mesh
    else:o=bpy.data.objects.new(name,mesh);col.objects.link(o);o.parent=root
    o.matrix_world=R@(T if transform is None else transform);o.hide_render=False;o.hide_set(False)
    for f in mesh.polygons:f.use_smooth=True
    return o
def loft(name,rings,material,n=32,cap=False,transform=None):
    vs=[((cx+rx*math.cos(j*2*math.pi/n))*s,(cy+ry*math.sin(j*2*math.pi/n))*s,z*s) for z,rx,ry,cx,cy in rings for j in range(n)]
    faces=[(k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j) for k in range(len(rings)-1) for j in range(n)]
    if cap:faces.extend([tuple(reversed(range(n))),tuple((len(rings)-1)*n+j for j in range(n))])
    return meshobj(name,vs,faces,material,transform)
# Sleeveless fitted wrap, with an open V and a soft diagonal closure.
o=loft('female_hide_vest',[(1.015,.126,.104,0,0),(1.08,.123,.100,0,0),(1.17,.139,.116,0,-.003),(1.27,.163,.143,0,-.008),(1.34,.169,.133,0,-.008),(1.42,.163,.082,0,0),(1.47,.062,.056,0,0)],cloth)
for j in range(32):
    a=j*2*math.pi/32;v=o.data.vertices[6*32+j]
    if math.sin(a)<0:v.co.z-=(.115*(-math.sin(a))**3)*s
o.data.update()
# Short wrap tails stop above the knees, with overlapping diagonal front edges.
loft('female_linen_tunic',[(.815,.179,.124,0,0),(.91,.178,.126,0,0),(1.04,.127,.105,0,0)],cloth)
o=bpy.data.objects['female_linen_tunic']
for j in range(32):
    a=j*2*math.pi/32;o.data.vertices[j].co.z+=(.050*math.cos(a)+.018*math.sin(3*a))*s
o.data.update()
# A narrow contrast binding follows the actual front surface.
points=[(-.103,-.072,1.438),(-.057,-.140,1.342),(.015,-.153,1.25),(.063,-.128,1.16),(.094,-.099,1.035)]
vs=[((x+dx)*s,y*s,z*s) for x,y,z in points for dx in [-.012,.012]]
meshobj('female_wrap_binding',vs,[(2*i,2*i+1,2*i+3,2*i+2) for i in range(len(points)-1)],edge)
loft('female_belt',[(1.027,.133,.111,0,0),(1.073,.131,.107,0,0)],dark)
# Compact knotted side fastening, no disc or ceremonial jewelry.
loft('female_side_tie',[(.897,.008,.007,-.118,-.078),(.98,.012,.009,-.111,-.088),(1.063,.019,.012,-.10,-.086)],edge,cap=True)
# A small hide shoulder layer uses a curved cloth surface, not a round armor ball.
vs=[]
for k,(z,rx,ry,cx) in enumerate([(1.315,.056,.075,-.187),(1.39,.064,.090,-.176),(1.465,.058,.085,-.139)]):
    for j in range(16):
        a=math.pi*j/15;vs.append(((cx+rx*math.cos(a))*s,(-ry*math.sin(a))*s,(z+.025*math.sin(a))*s))
faces=[(k*16+j,k*16+j+1,(k+1)*16+j+1,(k+1)*16+j) for k in range(2) for j in range(15)]
o=meshobj('female_hide_shoulder_layer',vs,faces,leather)
sol=o.modifiers.new('hide_thickness','SOLIDIFY');sol.thickness=.006
# Calf-length fitted leggings separate the cloth from the exposed arms.
for sign in [-1,1]:
    for part in ['thigh','knee','calf']:
        o=bpy.data.objects[f'female_{part}_{sign}'];o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(dark)
    o=bpy.data.objects[f'female_wrist_guard_{sign}'];o.hide_render=False;o.hide_set(False)
    # Follow the current relaxed forearm rather than its older socket placement.
    fore=bpy.data.objects[f'female_forearm_{sign}'];length=max(v.co.z for v in fore.data.vertices)
    o.matrix_world=fore.matrix_world@Matrix.Translation(Vector((0,0,length*.65)))
    old=max(v.co.z for v in o.data.vertices)
    o.scale.z*=length*.29/old
    o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(leather)
# Sweep the hair off the face into a high tail, with a few broad loose locks.
o=bpy.data.objects['female_hair'];o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(hair)
loft('female_hair_swept_front',[(1.65,.022,.022,-.067,-.038),(1.71,.061,.046,-.014,-.007),(1.765,.063,.047,.014,.014),(1.80,.026,.029,.014,.021)],hair,cap=True)
loft('female_hair_high_tail',[(1.44,.016,.019,.116,.15),(1.53,.037,.032,.122,.176),(1.65,.043,.044,.066,.171),(1.75,.031,.035,.018,.114)],hair,cap=True)
loft('female_hair_temple_lock',[(1.55,.009,.012,-.081,-.036),(1.64,.024,.030,-.079,-.015),(1.72,.029,.036,-.062,.017)],hair,cap=True)
# Lift the existing head slightly to face outward rather than down into the collar.
head_parts=['head','nose','ear_-1','ear_1','hair','hair_swept_front','hair_high_tail','hair_temple_lock']
pivot=Vector((0,0,1.54*s));lift=R@T@Matrix.Translation(pivot)@Matrix.Rotation(math.radians(-6),4,'X')@Matrix.Translation(-pivot)@(R@T).inverted()
for suffix in head_parts:
    o=bpy.data.objects['female_'+suffix];o.matrix_world=lift@o.matrix_world
P['female']['revision']='v08 original sleeveless wrap tunic, asymmetric hide shoulder layer, leggings, side tie and swept high tail'
P['status']='unapproved original VERDIGRIS light-kit candidate; photo costume discarded'
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2))
bpy.context.view_layer.update()
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
for sex in ['male','female']:
    for other in ['male','female']:bpy.data.collections['VG_'+other].hide_render=other!=sex
    render(sex+'-logical-render.png',32,64);render(sex+'-structural-inspection.png',256,512)
for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
    target=Vector((0,0,.86));az=math.radians(az);el=math.radians(el)
    cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
    render('female-inspect-'+name+'.png',256,384)
cam.matrix_world=original[0];cam.data.lens=original[1];cam.data.shift_y=original[2]
scene.render.resolution_x=32;scene.render.resolution_y=64
bpy.data.texts.new('design_wrap_kit_v08.py').write((ROOT/'design_wrap_kit.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v08.blend'),compress=True)
print('Saved original wrap-kit design and actual logical/multi-angle renders.')
