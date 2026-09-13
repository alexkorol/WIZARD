"""Owner-photo-directed clothing, hair and stance, applied to the existing adult figure."""
import bpy, math, json, hashlib
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path(STUDY_ROOT)
for d in ('sources','renders'): (ROOT/d).mkdir(exist_ok=True)
scene=bpy.data.scenes['VG_Player_Unarmed_v05_Female'];bpy.context.window.scene=scene
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-v06.blend'),compress=True)
scene.name='VG_Player_Unarmed_v06_Reference'
cam=scene.camera;original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
P=json.loads((ROOT/'parameters.json').read_text());s=1.70/1.78
col=bpy.data.collections['VG_female'];col.hide_viewport=False
root=bpy.data.objects['female_ROOT'];R=root.matrix_world.copy()
T=R.inverted()@bpy.data.objects['female_hide_vest'].matrix_world
skin=bpy.data.materials['VG_skin_blockout'];hide=bpy.data.materials['VG_hide_blockout']
def mat(name,color):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*color,1)
    m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.82
    return m
cloth=mat('VG_female_woven_brown_v06',(.19,.125,.075))
hair=mat('VG_female_flax_hair_v06',(.37,.245,.12))
cord=mat('VG_female_dark_cord_v06',(.11,.065,.032))
bronze=mat('VG_female_bronze_v06',(.47,.29,.10))
def loft(name,rings,material,transform=None,n=32,corrugation=0):
    # z, half width, half depth, horizontal center, depth center
    vs=[]
    for z,rx,ry,cx,cy in rings:
        for j in range(n):
            a=2*math.pi*j/n;k=1+corrugation*(1 if j%2 else -1)
            vs.append(((cx+rx*math.cos(a)*k)*s,(cy+ry*math.sin(a)*k)*s,z*s))
    faces=[(k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j) for k in range(len(rings)-1) for j in range(n)]
    mesh=bpy.data.meshes.new(name+'_v06_mesh');mesh.from_pydata(vs,[],faces);mesh.materials.append(material);mesh.update()
    obj=bpy.data.objects.get(name)
    if obj:obj.data=mesh
    else:obj=bpy.data.objects.new(name,mesh);col.objects.link(obj);obj.parent=root
    obj.matrix_world=R@(T if transform is None else transform)
    for f in mesh.polygons:f.use_smooth=not corrugation
    return obj
def sphere(name,p,r,material,torso=True):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8)
    o=bpy.context.object;o.name=name
    for c in list(o.users_collection):c.objects.unlink(o)
    col.objects.link(o);o.parent=root;o.data.materials.append(material)
    o.matrix_world=R@(T if torso else Matrix.Identity(4))@Matrix.Translation(Vector(p)*s)@Matrix.Diagonal((r[0]*s,r[1]*s,r[2]*s,1))
    for f in o.data.polygons:f.use_smooth=True
    return o
# Reuse the former tunic volume as the covered pelvis and visible midriff.
loft('female_linen_tunic',[(.88,.166,.110,0,0),(.97,.154,.111,0,0),(1.06,.112,.085,0,0),(1.13,.113,.087,0,0),(1.205,.139,.106,0,0)],skin)
# Loose, cropped woven top: boat neckline and an uncinched hanging hem.
loft('female_hide_vest',[(1.18,.176,.134,0,-.010),(1.25,.182,.153,0,-.006),(1.34,.176,.148,0,-.006),(1.405,.169,.105,0,0),(1.445,.133,.073,0,0),(1.462,.083,.059,0,0)],cloth)
loft('female_cord_skirt',[(.695,.188,.128,0,0),(.75,.194,.138,0,0),(.90,.184,.130,0,0),(.985,.157,.118,0,0)],cord,n=64,corrugation=.028)
loft('female_belt',[(.960,.163,.124,0,0),(.995,.156,.119,0,0)],hide)
# Readable broad bands, directly based on the supplied reference.
loft('female_neck_band',[(1.485,.060,.058,0,0),(1.535,.054,.056,0,0)],bronze)
sphere('female_belt_disc',(0,-.142,.961),(.075,.020,.075),bronze)
sphere('female_belt_disc_boss',(0,-.165,.961),(.022,.010,.022),bronze)
for suffix in ['belt_knot','belt_end','tied_hair']+[f'{part}_{sign}' for part in ['shoulder_strap','shoulder_strap_back','wrist_guard'] for sign in [-1,1]]:
    o=bpy.data.objects['female_'+suffix];o.hide_render=True;o.hide_set(True)
# Long hanging belt ends and cord bunches are silhouette-scale geometry.
for i,x in enumerate([-.042,.045]):
    loft('female_belt_tail_'+str(i),[(.60+i*.055,.014,.008,x+.018,-.143),(.76,.013,.008,x+.012,-.144),(.962,.011,.008,x,-.144)],hide)
for i in range(24):
    a=2*math.pi*i/24;z=.691+.010*math.sin(i*2.3)
    sphere('female_skirt_fringe_'+str(i),(.188*math.cos(a),.128*math.sin(a),z),(.013,.013,.022),cloth)
def seg(suffix,a,b,factor):
    o=bpy.data.objects['female_'+suffix];a,b=Vector(a),Vector(b)
    length=max(v.co.z for v in o.data.vertices)-min(v.co.z for v in o.data.vertices)
    o.matrix_world=R@Matrix.Translation(a)@(b-a).to_track_quat('Z','Y').to_matrix().to_4x4()@Matrix.Diagonal((factor,factor,(b-a).length/length,1))
def oval(suffix,p,r,d=None):
    rot=Vector(d).to_track_quat('Z','Y').to_matrix().to_4x4() if d else Matrix.Identity(4)
    bpy.data.objects['female_'+suffix].matrix_world=R@Matrix.Translation(Vector(p))@rot@Matrix.Diagonal((*r,1))
for sign in [-1,1]:
    sh=T@Vector((sign*.168*s,0,1.42*s));el=Vector((.035*s+sign*.232*s,-.024*s,1.145*s));wr=Vector((.035*s+sign*.25*s,-.05*s,.93*s))
    for suffix,p in [(f'shoulder_CTRL_{sign}',sh),(f'elbow_CTRL_{sign}',el),(f'hand_SOCKET_{sign}',wr)]:bpy.data.objects['female_'+suffix].matrix_world=R@Matrix.Translation(p)
    seg(f'upper_arm_{sign}',sh,el,.68);seg(f'forearm_{sign}',el,wr,.73)
    d=(wr-el).normalized();p=wr+d*.043*s
    oval(f'empty_hand_{sign}',p,(.027*s,.023*s,.045*s),d);oval(f'thumb_{sign}',p+Vector((-sign*.019*s,-.010*s,.008*s)),(.012*s,.014*s,.024*s),d)
    loft('female_loose_sleeve_'+str(sign),[(1.215,.068,.087,sign*.225,0),(1.31,.073,.098,sign*.208,0),(1.40,.052,.086,sign*.170,0)],cloth)
    # Wider grounded stance; knees track feet with a small depth stagger.
    hip=Vector((.035*s+sign*.10*s,0,.85*s));knee=Vector((sign*.176*s,(-.042 if sign==1 else .020)*s,.448*s));ankle=Vector((sign*.242*s,(-.05 if sign==1 else .070)*s,.10*s))
    seg(f'thigh_{sign}',hip,knee,.87);seg(f'calf_{sign}',knee,ankle,.87)
    oval(f'knee_{sign}',knee,(.050*s,.048*s,.060*s))
    seg(f'ankle_shoe_{sign}',(ankle.x,ankle.y,.06*s),(ankle.x,ankle.y,.19*s),.88)
    o=bpy.data.objects[f'female_shoe_{sign}'];o.matrix_world=R@Matrix.Translation(Vector((ankle.x,ankle.y-.053*s,.05*s)))@Matrix.Rotation(math.radians(-sign*10),4,'Z')@Matrix.Diagonal((.058*s,.111*s,.05*s,1))
# Loose hair, with more mass falling over one shoulder as in the supplied image.
o=bpy.data.objects['female_hair'];o.data.materials.clear();o.data.materials.append(hair)
for j in range(32):
    v=o.data.vertices[j];v.co.z-=.025*s*abs(math.cos(2*math.pi*j/32))
loft('female_hair_back',[(1.27,.078,.025,.022,.096),(1.42,.097,.040,.010,.105),(1.58,.092,.051,0,.080),(1.70,.074,.059,0,.049)],hair)
loft('female_hair_sweep',[(1.265,.016,.019,.145,-.084),(1.34,.049,.030,.146,-.107),(1.45,.054,.038,.112,-.095),(1.57,.043,.041,.075,-.030),(1.70,.045,.046,.049,.002),(1.765,.027,.038,.014,.009)],hair)
loft('female_hair_other_side',[(1.415,.016,.022,-.124,-.023),(1.51,.035,.034,-.098,-.014),(1.63,.033,.041,-.075,.004),(1.72,.031,.039,-.054,.009)],hair)
P['female']['revision']='v06 owner-photo-directed cropped woven top, cord skirt, bronze belt disc, loose hair and grounded stance'
P['status']='unapproved structural study based on owner-supplied clothing and attitude reference'
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2))
bpy.context.view_layer.update()
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
for sex in ('male','female'):
    for other in ('male','female'):bpy.data.collections['VG_'+other].hide_render=other!=sex
    render(sex+'-logical-render.png',32,64);render(sex+'-structural-inspection.png',256,512)
for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
    target=Vector((0,0,.86));az=math.radians(az);el=math.radians(el)
    cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
    render('female-inspect-'+name+'.png',256,384)
cam.matrix_world=original[0];cam.data.lens=original[1];cam.data.shift_y=original[2]
scene.render.resolution_x=32;scene.render.resolution_y=64
txt=bpy.data.texts.new('revise_from_reference_v06.py');txt.write((ROOT/'revise_from_reference.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v06.blend'),compress=True)
print('Saved owner-reference-directed female v06 and rendered 32x64 plus inspection views.')
