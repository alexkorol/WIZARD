"""Targeted v02 revision: female proportions and relaxed, lowered arms for both figures."""
import bpy,math,json
from pathlib import Path
from mathutils import Matrix,Vector
ROOT=Path(STUDY_ROOT);P=json.loads((ROOT/'parameters.json').read_text())
for folder in ('renders','sources'): (ROOT/folder).mkdir(exist_ok=True)
scene=bpy.data.scenes['VG_Player_Unarmed_v02'];bpy.context.window.scene=scene
assert not scene.get('idle_v03_applied'),'Already revised'
scene.name='VG_Player_Unarmed_v03'
cam=scene.camera
before={'location':list(cam.location),'rotation':list(cam.rotation_euler),'lens':cam.data.lens,'shift_x':cam.data.shift_x,'shift_y':cam.data.shift_y}
P['female'].update({'shoulder_width':.350,'waist_width':.235,'hip_width':.365})
P['pose']='relaxed alert idle; arms lowered, soft elbow bends, mild stagger, weight on one leg'
P['status']='unapproved v03: owner-directed female silhouette and relaxed idle'
P['female']['limb_radius_factor']=.80
P['female']['head_width_factor']=.90
P['female']['chest_shape']='single shaped hide vest, equal coverage; no separate breast plates'
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2))
records={}
for sex in ('male','female'):
    col=bpy.data.collections['VG_'+sex];col.hide_viewport=False
    root=bpy.data.objects[sex+'_ROOT'];s=P[sex]['height']/1.78;R=root.matrix_world.copy()
    female=sex=='female';limb=.80 if female else 1.0
    pivot=Vector((0,0,.96*s))
    old=(Matrix.Translation(Vector((.020*s,-.023*s,-.078*s)))@Matrix.Translation(pivot)@Matrix.Rotation(math.radians(6),4,'X')@Matrix.Rotation(math.radians(-8),4,'Z')@Matrix.Translation(-pivot))
    hipx=(.035 if female else .025)*s
    new=(Matrix.Translation(Vector((hipx,-.006*s,-.035*s)))@Matrix.Translation(pivot)@Matrix.Rotation(math.radians(2),4,'X')@Matrix.Rotation(math.radians(4),4,'Z')@Matrix.Translation(-pivot))
    delta=R@new@old.inverted()@R.inverted()
    torso_names=['linen_tunic','hide_vest','belt','belt_knot','belt_end','neck','head','nose','hair','tied_hair','ear_-1','ear_1','shoulder_strap_-1','shoulder_strap_1','shoulder_strap_back_-1','shoulder_strap_back_1']
    for suffix in torso_names:
        obj=bpy.data.objects.get(sex+'_'+suffix)
        if obj:obj.matrix_world=delta@obj.matrix_world
    def ring_profile(name,profiles):
        obj=bpy.data.objects[name]
        for row,(rx,ry,cy,exponent) in enumerate(profiles):
            for j in range(16):
                t=j*2*math.pi/16;c=math.cos(t);v=math.sin(t)
                obj.data.vertices[row*16+j].co.x=rx*math.copysign(abs(c)**exponent,c)
                obj.data.vertices[row*16+j].co.y=cy+ry*math.copysign(abs(v)**exponent,v)
        obj.data.update()
    if female:
        # Shape the existing continuous clothing, with the same hem/coverage.
        ring_profile(sex+'_linen_tunic',[(.206,.143*s,-.008*s,.55),(.194,.122*s,0,.75),(.129,.094*s,0,1),(.131,.103*s,0,1),(.162,.116*s,-.007*s,1),(.165,.084*s,0,1),(.078*s,.067*s,0,1)])
        ring_profile(sex+'_hide_vest',[(.128,.103*s,0,1),(.135,.111*s,-.004*s,1),(.161,.126*s,-.011*s,1),(.158,.104*s,-.006*s,1)])
        ring_profile(sex+'_belt',[(.132,.108*s,0,1),(.132,.108*s,0,1)])
        # Less blocky face and neck; retain original face/hair objects.
        for suffix in ('head','hair'):
            obj=bpy.data.objects[sex+'_'+suffix]
            for v in obj.data.vertices:
                jaw_factor=.84 if suffix=='head' and v.co.z<P[sex]['height']-.15*s else .92
                v.co.x*=jaw_factor;v.co.y*=.93
        obj=bpy.data.objects[sex+'_neck']
        for v in obj.data.vertices:v.co.x*=.84;v.co.y*=.88
        nose=bpy.data.objects[sex+'_nose']
        for v in nose.data.vertices:v.co.x*=.83;v.co.y*=.80
    else:
        obj=bpy.data.objects[sex+'_linen_tunic']
        # Pose-related cloth clearance only: squared cloth cross section around both thighs.
        for row,rx,ry in [(0,.224,.15*s),(1,.211,.132*s)]:
            for j in range(16):
                t=j*2*math.pi/16;c=math.cos(t);v=math.sin(t)
                obj.data.vertices[row*16+j].co.x=rx*math.copysign(abs(c)**.55,c)
                obj.data.vertices[row*16+j].co.y=ry*math.copysign(abs(v)**.55,v)
        obj.data.update()
    def ctrl(name,p):bpy.data.objects[name].matrix_world=R@Matrix.Translation(Vector(p))
    def segment(name,a,b,radius_factor=1):
        obj=bpy.data.objects[name];a,b=Vector(a),Vector(b)
        length=max(v.co.z for v in obj.data.vertices)-min(v.co.z for v in obj.data.vertices)
        obj.matrix_world=R@Matrix.Translation(a)@(b-a).to_track_quat('Z','Y').to_matrix().to_4x4()@Matrix.Diagonal((radius_factor,radius_factor,(b-a).length/length,1))
    def oval(name,center,radii,direction=None):
        rot=Vector(direction).to_track_quat('Z','Y').to_matrix().to_4x4() if direction else Matrix.Identity(4)
        bpy.data.objects[name].matrix_world=R@Matrix.Translation(Vector(center))@rot@Matrix.Diagonal((*radii,1))
    arms={};shoulder_half=P[sex]['shoulder_width']/2
    for sign in (-1,1):
        # Upper arms track down beside the ribs; hands no longer form a boxing guard.
        shoulder=new@Vector((sign*(shoulder_half+.007),0,1.425*s))
        elbow=Vector((hipx+sign*(shoulder_half+.055),-.020*s,1.145*s))
        wrist=Vector((hipx+sign*(shoulder_half+.068),(-.135 if sign==1 else -.065)*s,(.975 if sign==1 else .930)*s))
        ctrl(sex+f'_shoulder_CTRL_{sign}',shoulder);ctrl(sex+f'_elbow_CTRL_{sign}',elbow);ctrl(sex+f'_hand_SOCKET_{sign}',wrist)
        segment(sex+f'_upper_arm_{sign}',shoulder,elbow,limb)
        segment(sex+f'_forearm_{sign}',elbow,wrist,limb)
        segment(sex+f'_wrist_guard_{sign}',elbow.lerp(wrist,.65),elbow.lerp(wrist,.94),limb)
        direction=(wrist-elbow).normalized();center=wrist+direction*.043*s
        hand_factor=.82 if female else 1
        oval(sex+f'_empty_hand_{sign}',center,(.035*s*hand_factor,.029*s*hand_factor,.054*s*hand_factor),direction)
        oval(sex+f'_thumb_{sign}',center+Vector((-sign*.025*s*hand_factor,-.012*s,.008*s)),(.016*s*hand_factor,.018*s*hand_factor,.029*s*hand_factor),direction)
        if female:
            x=sign*(shoulder_half-.04)
            segment(sex+f'_shoulder_strap_{sign}',new@Vector((x,-.093*s,1.39*s)),new@Vector((x,0,1.477*s)),.90)
            segment(sex+f'_shoulder_strap_back_{sign}',new@Vector((x,0,1.477*s)),new@Vector((x,.10*s,1.39*s)),.90)
        arms[str(sign)]={'shoulder':list(shoulder),'elbow':list(elbow),'wrist':list(wrist)}
    legs={}
    for sign in (-1,1):
        if sign==1:
            hip=Vector((hipx+.093*s,-.014*s,.839*s));knee=Vector((.137*s,-.072*s,.447*s));ankle=Vector((.146*s,-.068*s,.10*s));angle=-5
        else:
            hip=Vector((hipx-.093*s,0,.845*s));knee=Vector((-.095*s,-.017*s,.457*s));ankle=Vector((-.145*s,.065*s,.10*s));angle=12
        legfactor=.87 if female else 1
        segment(sex+f'_thigh_{sign}',hip,knee,legfactor)
        segment(sex+f'_calf_{sign}',knee,ankle,legfactor)
        oval(sex+f'_knee_{sign}',knee,(.061*s*legfactor,.056*s*legfactor,.062*s*legfactor))
        footfactor=.88 if female else 1
        segment(sex+f'_ankle_shoe_{sign}',(ankle.x,ankle.y,.06*s),(ankle.x,ankle.y,.19*s),footfactor)
        foot=bpy.data.objects[sex+f'_shoe_{sign}']
        foot.matrix_world=R@Matrix.Translation(Vector((ankle.x,ankle.y-.053*s,.05*s)))@Matrix.Rotation(math.radians(angle),4,'Z')@Matrix.Diagonal((.066*s*footfactor,.126*s*footfactor,.05*s,1))
        legs[str(sign)]={'hip':list(hip),'knee':list(knee),'ankle':list(ankle)}
    if female:
        # Move ears inward with the slimmer head; retain the same tied-hair design.
        for sign in (-1,1):
            obj=bpy.data.objects[sex+f'_ear_{sign}'];local=(R@new).inverted()@obj.matrix_world
            local.translation.x*=.91;obj.matrix_world=R@new@local
    for key,v in P[sex].items():
        if isinstance(v,(int,float,str)):root[key]=v
    root['pose']='v03 relaxed alert idle'
    records[sex]={'arms':arms,'legs':legs,'hip_shift_x':hipx,'forward_lean_degrees':2,'torso_turn_degrees':4}
scene['idle_v03_applied']=True
bpy.context.view_layer.update()
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
loc=cam.location.copy();rot=cam.rotation_euler.copy();shift=cam.data.shift_y;lens=cam.data.lens
for sex in ('male','female'):
    for other in ('male','female'):bpy.data.collections['VG_'+other].hide_render=(other!=sex)
    render(f'{sex}-logical-render.png',64,96);render(f'{sex}-structural-inspection.png',384,576)
    for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
        target=Vector((0,0,.86));az=math.radians(az);el=math.radians(el)
        cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
        render(f'{sex}-inspect-{name}.png',256,384)
    cam.location=loc;cam.rotation_euler=rot;cam.data.shift_y=shift;cam.data.lens=lens
after={'location':list(cam.location),'rotation':list(cam.rotation_euler),'lens':cam.data.lens,'shift_x':cam.data.shift_x,'shift_y':cam.data.shift_y}
assert before==after
(ROOT/'pose-and-camera.json').write_text(json.dumps({'camera_preserved':True,'camera':after,'poses':records},indent=2))
scene.render.resolution_x=64;scene.render.resolution_y=96
bpy.data.collections['VG_male'].hide_render=True;bpy.data.collections['VG_female'].hide_render=False;bpy.data.collections['VG_male'].hide_viewport=True
txt=bpy.data.texts.new('revise_figure_and_idle_v03.py');txt.write((ROOT/'revise_figure_and_idle.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-relaxed-v03.blend'),compress=True)
print('Revised existing female proportions and lowered arms/relaxed support for both figures. Camera preserved. Saved v03.')
