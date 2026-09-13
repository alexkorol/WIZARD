"""Reshape the existing female torso and clothing; use through Blender MCP."""
import bpy, math, json, hashlib
from pathlib import Path
from mathutils import Matrix, Vector
ROOT=Path(STUDY_ROOT)
for d in ('sources','renders'): (ROOT/d).mkdir(exist_ok=True)
scene=bpy.data.scenes['VG_Player_Unarmed_v04_32x64'];bpy.context.window.scene=scene
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-female-v05.blend'),compress=True)
scene.name='VG_Player_Unarmed_v05_Female'
cam=scene.camera; original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
def digest(col):
    return hashlib.sha256(repr([(o.name,list(map(list,o.matrix_world)),[tuple(v.co) for v in o.data.vertices] if o.type=='MESH' else []) for o in col.objects]).encode()).hexdigest()
male_before=digest(bpy.data.collections['VG_male'])
P=json.loads((ROOT/'parameters.json').read_text());s=P['female']['height']/1.78
col=bpy.data.collections['VG_female'];col.hide_viewport=False
root=bpy.data.objects['female_ROOT'];R=root.matrix_world.copy()
pivot=Vector((0,0,.96*s))
T=Matrix.Translation(Vector((.035*s,-.006*s,-.035*s)))@Matrix.Translation(pivot)@Matrix.Rotation(math.radians(2),4,'X')@Matrix.Rotation(math.radians(4),4,'Z')@Matrix.Translation(-pivot)
def reshape(suffix,rings,cap=True,chest=False):
    obj=bpy.data.objects['female_'+suffix];n=32;vs=[]
    for z,rx,front,back,cy in rings:
        for j in range(n):
            a=2*math.pi*j/n;x=rx*math.cos(a);sn=math.sin(a)
            y=cy+(front if sn<0 else back)*sn
            if chest and sn<0:
                # Two soft front volumes beneath one continuous garment surface.
                fullness=math.exp(-((z-1.305)/.075)**2)
                lobes=math.exp(-((abs(x)-.070)/.047)**2)
                y-=.025*fullness*lobes*(-sn)**2
            vs.append((x*s,y*s,z*s))
    faces=[(k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j) for k in range(len(rings)-1) for j in range(n)]
    if cap:faces.extend([tuple(reversed(range(n))),tuple((len(rings)-1)*n+j for j in range(n))])
    mesh=bpy.data.meshes.new('female_'+suffix+'_v05');mesh.from_pydata(vs,[],faces);mesh.update()
    for mat in obj.data.materials:mesh.materials.append(mat)
    obj.data=mesh
    for f in mesh.polygons:f.use_smooth=True
    return obj
# Long torso with a readable waist, sloping narrow shoulders and fuller pelvis.
# Keep the existing plain linen tunic and continuous hide vest, including coverage.
reshape('linen_tunic',[(.72,.205,.140,.140,0),(.80,.210,.147,.149,0),(.91,.196,.140,.147,0),(.98,.160,.113,.128,0),(1.055,.112,.082,.090,0),(1.13,.115,.085,.091,0),(1.22,.143,.109,.096,0),(1.30,.165,.142,.098,0),(1.37,.160,.119,.089,0),(1.43,.155,.076,.069,0),(1.47,.098,.065,.059,0),(1.49,.061,.058,.054,0)])
reshape('hide_vest',[(1.045,.120,.093,.100,0),(1.10,.119,.096,.100,0),(1.18,.136,.112,.106,0),(1.25,.157,.143,.111,0),(1.305,.171,.154,.108,0),(1.35,.171,.145,.101,0),(1.405,.151,.102,.088,0)],cap=False,chest=True)
reshape('belt',[(1.043,.123,.099,.105,0),(1.079,.123,.099,.105,0)],cap=False)
# The head retains the tied hairstyle; replace the angular jaw/helmet outline with
# a rounded cranium, cheek planes and a shorter tapered chin.
h=P['female']['height']/s;chin=h-P['female']['head_height']/s
reshape('head',[(chin,.032,.042,.038,-.012),(chin+.030,.050,.059,.051,-.009),(chin+.075,.064,.069,.068,-.001),(chin+.118,.073,.072,.080,.002),(chin+.172,.071,.077,.080,.005),(h-.014,.048,.055,.058,.005),(h,.011,.023,.023,.006)])
reshape('hair',[(chin+.146,.073,.076,.084,.005),(chin+.19,.071,.074,.081,.007),(h-.012,.051,.060,.062,.007),(h+.002,.015,.025,.026,.007)])
def seg(suffix,a,b,factor):
    o=bpy.data.objects['female_'+suffix];a,b=Vector(a),Vector(b)
    length=max(v.co.z for v in o.data.vertices)-min(v.co.z for v in o.data.vertices)
    o.matrix_world=R@Matrix.Translation(a)@(b-a).to_track_quat('Z','Y').to_matrix().to_4x4()@Matrix.Diagonal((factor,factor,(b-a).length/length,1))
def oval(suffix,p,r,d=None):
    rot=Vector(d).to_track_quat('Z','Y').to_matrix().to_4x4() if d else Matrix.Identity(4)
    bpy.data.objects['female_'+suffix].matrix_world=R@Matrix.Translation(Vector(p))@rot@Matrix.Diagonal((*r,1))
# Drop the deltoids into the shoulder slope; relaxed elbows and hands stay low.
for sign in (-1,1):
    sh=T@Vector((sign*.167*s,0,1.420*s));el=Vector((.035*s+sign*.208*s,-.017*s,1.145*s));wr=Vector((.035*s+sign*.230*s,(-.135 if sign==1 else -.065)*s,(.975 if sign==1 else .930)*s))
    for suffix,p in [(f'shoulder_CTRL_{sign}',sh),(f'elbow_CTRL_{sign}',el),(f'hand_SOCKET_{sign}',wr)]:bpy.data.objects['female_'+suffix].matrix_world=R@Matrix.Translation(p)
    seg(f'upper_arm_{sign}',sh,el,.68);seg(f'forearm_{sign}',el,wr,.73)
    seg(f'wrist_guard_{sign}',el.lerp(wr,.65),el.lerp(wr,.94),.73)
    d=(wr-el).normalized();p=wr+d*.043*s
    oval(f'empty_hand_{sign}',p,(.027*s,.023*s,.044*s),d)
    oval(f'thumb_{sign}',p+Vector((-sign*.019*s,-.010*s,.008*s)),(.012*s,.014*s,.024*s),d)
    x=sign*.123*s
    seg(f'shoulder_strap_{sign}',T@Vector((x,-.087*s,1.400*s)),T@Vector((x,0,1.455*s)),.70)
    seg(f'shoulder_strap_back_{sign}',T@Vector((x,0,1.455*s)),T@Vector((x,.070*s,1.400*s)),.70)
    # Upper thighs carry the pelvic width, tapering to the existing knees/feet.
    thigh=bpy.data.objects[f'female_thigh_{sign}']
    for v in thigh.data.vertices:
        t=v.co.z/max(vv.co.z for vv in thigh.data.vertices)
        f=1.12-.12*t;v.co.x*=f;v.co.y*=f
    for suffix in (f'upper_arm_{sign}',f'forearm_{sign}',f'thigh_{sign}',f'calf_{sign}',f'knee_{sign}'):
        for f in bpy.data.objects['female_'+suffix].data.polygons:f.use_smooth=True
# Align the existing tie with the newly fitted waist surface.
for suffix in ('belt_knot','belt_end'):
    o=bpy.data.objects['female_'+suffix];m=(R@T).inverted()@o.matrix_world;m.translation.y+=.021*s;m.translation.z+=.026*s;o.matrix_world=R@T@m
P['female'].update({'shoulder_width':.319,'waist_width':.214,'hip_width':.374,'chest_shape':'continuous fitted hide vest over shaped ribcage and chest','revision':'v05 female torso, sloping shoulders, pelvis, head and garment fit'})
P['status']='Owner-selected 32x64 canvas; revised female structure unapproved'
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2))
bpy.context.view_layer.update();assert digest(bpy.data.collections['VG_male'])==male_before
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
bpy.data.collections['VG_male'].hide_viewport=True
txt=bpy.data.texts.new('revise_female_v05.py');txt.write((ROOT/'revise_female.py').read_text())
(ROOT/'revision-verification.json').write_text(json.dumps({'male_geometry_and_transforms_unchanged':True,'camera_restored':True,'logical_canvas':[32,64],'status':'unapproved'},indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v05.blend'),compress=True)
print('Female v05 revised and rendered, male preserved, camera restored; saved editable milestone.')
