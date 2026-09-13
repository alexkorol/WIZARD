"""Apply owner-selected garment massing to the editable adult female guide."""
import bpy,math,json
from pathlib import Path
from mathutils import Matrix,Vector
ROOT=Path(STUDY_ROOT)
for d in ('sources','renders'): (ROOT/d).mkdir(exist_ok=True)
scene=bpy.data.scenes['VG_Player_Unarmed_v08_Wrap'];bpy.context.window.scene=scene
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-v09.blend'),compress=True)
scene.name='VG_Player_Unarmed_v09_Silhouette';cam=scene.camera
original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
P=json.loads((ROOT/'parameters.json').read_text());s=1.70/1.78
col=bpy.data.collections['VG_female'];col.hide_viewport=False
root=bpy.data.objects['female_ROOT'];R=root.matrix_world.copy();T=R.inverted()@bpy.data.objects['female_hide_vest'].matrix_world
def mat(name,c):
    m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True
    bs=m.node_tree.nodes['Principled BSDF'];bs.inputs['Base Color'].default_value=(*c,1);bs.inputs['Roughness'].default_value=.9
    return m
linen=mat('VG_v09_linen',(.60,.55,.435));woven=mat('VG_v09_woven_hide',(.32,.215,.12));drape=mat('VG_v09_ochre_drape',(.34,.075,.033));cord=mat('VG_v09_binding',(.32,.245,.14))
skin=bpy.data.materials['VG_skin_blockout']
def meshobj(name,vs,faces,material):
    mesh=bpy.data.meshes.new(name+'_v09');mesh.from_pydata(vs,[],faces);mesh.materials.append(material);mesh.update()
    o=bpy.data.objects.get(name)
    if o:o.data=mesh
    else:o=bpy.data.objects.new(name,mesh);col.objects.link(o);o.parent=root
    o.matrix_world=R@T;o.hide_render=False;o.hide_set(False)
    for f in mesh.polygons:f.use_smooth=True
    return o
def loft(name,rings,material):
    vs=[(rx*s*math.cos(j*2*math.pi/32),ry*s*math.sin(j*2*math.pi/32),z*s) for z,rx,ry in rings for j in range(32)]
    faces=[(k*32+j,k*32+(j+1)%32,(k+1)*32+(j+1)%32,(k+1)*32+j) for k in range(len(rings)-1) for j in range(32)]
    return meshobj(name,vs,faces,material)
# Under-tunic follows the existing shaped torso and extends to above the knees.
o=bpy.data.objects['female_hide_vest'];o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(linen)
loft('female_linen_tunic',[(.68,.190,.130),(.78,.187,.132),(.92,.173,.126),(1.04,.127,.105)],linen)
# Open-front fitted vest: wider chest opening and two longer hip panels.
# Each row supplies its front gap, leaving the lighter tunic visible between panels.
rings=[(.81,.182,.137,.52),(1.04,.135,.116,.18),(1.12,.135,.119,.20),(1.26,.174,.159,.45),(1.34,.180,.148,.65),(1.43,.163,.099,.72)]
vs=[];n=40
for row,(z,rx,ry,gap) in enumerate(rings):
    for j in range(n):
        a=-math.pi/2+gap+(2*math.pi-2*gap)*j/(n-1)
        zz=z
        if row==len(rings)-1:zz-=.10*abs(math.cos(a))**6
        if row==0:zz+=.025*math.sin(a+.3)
        vs.append((rx*s*math.cos(a),ry*s*math.sin(a)-.003*s,zz*s))
faces=[(k*n+j,k*n+j+1,(k+1)*n+j+1,(k+1)*n+j) for k in range(len(rings)-1) for j in range(n-1)]
o=meshobj('female_fitted_open_vest',vs,faces,woven)
sol=o.modifiers.new('vest_thickness','SOLIDIFY');sol.thickness=.004
for suffix in ['wrap_binding','belt','side_tie','hide_shoulder_layer']:
    o=bpy.data.objects['female_'+suffix];o.hide_render=True;o.hide_set(True)
# A small waist tie preserves the fitted center without a heavy horizontal belt.
meshobj('female_vest_waist_tie',[(-.050*s,-.121*s,1.09*s),(.048*s,-.121*s,1.09*s),(.048*s,-.121*s,1.107*s),(-.050*s,-.121*s,1.107*s)],[(0,1,2,3)],cord)
# Broad soft shoulder drape wrapping over one shoulder, with gently uneven edges.
vs=[];nx=9;ny=9
for i in range(nx):
    x=-.275+.215*i/(nx-1)
    for j in range(ny):
        y=-.135+.29*j/(ny-1)
        z=1.475-.095*(max(0,-x-.15)/.125)**1.4-.13*(abs(y)/.155)**1.7
        if i in (0,nx-1) or j in (0,ny-1):z+=.006*math.sin(i*2+j*1.4)
        vs.append((x*s,y*s,z*s))
faces=[(i*ny+j,(i+1)*ny+j,(i+1)*ny+j+1,i*ny+j+1) for i in range(nx-1) for j in range(ny-1)]
o=meshobj('female_short_shoulder_drape',vs,faces,drape);o.modifiers.new('cloth_thickness','SOLIDIFY').thickness=.004
# Bare athletic limbs and low shoes; keep v07 joint positions and foot stagger.
for sign in [-1,1]:
    for part in ['thigh','knee','calf']:
        o=bpy.data.objects[f'female_{part}_{sign}'];o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(skin)
    for part,factor in [('upper_arm',1.10),('forearm',1.05)]:
        o=bpy.data.objects[f'female_{part}_{sign}'];o.data=o.data.copy()
        for v in o.data.vertices:v.co.x*=factor;v.co.y*=factor
        o.data.update()
    o=bpy.data.objects[f'female_wrist_guard_{sign}'];o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(cord)
    for part in ['shoe','ankle_shoe']:
        o=bpy.data.objects[f'female_{part}_{sign}'];o.data=o.data.copy();o.data.materials.clear();o.data.materials.append(woven)
    # The old ankle guards become low shoe collars.
    o=bpy.data.objects[f'female_ankle_shoe_{sign}'];o.scale.z*=.52
# Retain the lifted head and swept forelock; shorten the tail into a compact tied mass.
o=bpy.data.objects['female_hair_high_tail'];o.data=o.data.copy()
for v in o.data.vertices:
    v.co.z=(1.73*s)+(v.co.z-1.73*s)*.42
    v.co.x*=.65;v.co.y=.10*s+(v.co.y-.10*s)*.6
o.data.update()
P['female']['revision']='v09 owner silhouette: fitted open vest, short linen tunic, bare athletic limbs, broad single shoulder drape and compact tied hair'
P['status']='unapproved silhouette candidate; owner reference establishes broad garment massing, not final texture or palette'
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
bpy.data.texts.new('revise_silhouette_v09.py').write((ROOT/'revise_silhouette.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v09.blend'),compress=True)
print('Saved female silhouette v09 and logical/multi-angle renders. Unarmed; fixed camera and stance.')
