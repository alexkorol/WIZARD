"""Art-directable ready pose applied to the EXISTING model through Blender MCP."""
import bpy, math, json
from pathlib import Path
from mathutils import Matrix, Vector
ROOT=Path(STUDY_ROOT)
P=json.loads((ROOT/'parameters.json').read_text())
P['status']='unapproved combat-ready pose revision'
P['pose']='staggered support, flexed knees, lowered pelvis, forward torso, asymmetric low guard with empty hands'
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2))
for folder in ('renders','sources'): (ROOT/folder).mkdir(exist_ok=True)
scene=bpy.data.scenes.get('VG_Player_Unarmed_v02') or bpy.data.scenes['VG_Player_Unarmed_v01'];bpy.context.window.scene=scene
assert not scene.get('ready_pose_v02_applied'), 'Already posed; revise rather than reapply.'
scene.name='VG_Player_Unarmed_v02'
cam=scene.camera
camera_before={'location':list(cam.location),'rotation':list(cam.rotation_euler),'lens':cam.data.lens,'shift_x':cam.data.shift_x,'shift_y':cam.data.shift_y}
pose_record={}
for sex in ('male','female'):
    col=bpy.data.collections['VG_'+sex];col.hide_viewport=False
    root=bpy.data.objects[sex+'_ROOT'];s=P[sex]['height']/1.78
    bpy.context.view_layer.update()
    root_world=root.matrix_world.copy()
    def point(p): return root_world@Vector(p)
    def ctrl(name,p): bpy.data.objects[name].matrix_world=root_world@Matrix.Translation(Vector(p))
    def move_segment(name,a,b):
        obj=bpy.data.objects[name];a,b=Vector(a),Vector(b)
        length=(b-a).length
        source_length=max(v.co.z for v in obj.data.vertices)-min(v.co.z for v in obj.data.vertices)
        obj.matrix_world=root_world@Matrix.Translation(a)@(b-a).to_track_quat('Z','Y').to_matrix().to_4x4()@Matrix.Diagonal((1,1,length/source_length,1))
    def place_oval(name,center,radii,direction=None):
        obj=bpy.data.objects[name]
        rot=Vector(direction).to_track_quat('Z','Y').to_matrix().to_4x4() if direction else Matrix.Identity(4)
        obj.matrix_world=root_world@Matrix.Translation(Vector(center))@rot@Matrix.Diagonal((*radii,1))
    # One torso transform for tunic, vest, straps, neck and head, preserving their relationships.
    pivot=Vector((0,0,.96*s))
    lean=(Matrix.Translation(Vector((.020*s,-.023*s,-.078*s)))@Matrix.Translation(pivot)
          @Matrix.Rotation(math.radians(6),4,'X')@Matrix.Rotation(math.radians(-8),4,'Z')@Matrix.Translation(-pivot))
    torso_names=['linen_tunic','hide_vest','belt','belt_knot','belt_end','neck','head','nose','hair','tied_hair','ear_-1','ear_1','shoulder_strap_-1','shoulder_strap_1','shoulder_strap_back_-1','shoulder_strap_back_1']
    for suffix in torso_names:
        obj=bpy.data.objects.get(sex+'_'+suffix)
        if obj:
            obj.matrix_world=root_world@lean@root_world.inverted()@obj.matrix_world
    shoulder_half=P[sex]['shoulder_width']/2
    arm_positions={}
    for sign in (-1,1):
        shoulder=lean@Vector((sign*(shoulder_half+.009),0,1.425*s))
        if sign==1:
            # Near arm: low, forward ready hand, open elbow-to-waist silhouette.
            elbow=Vector((.340*s,-.115*s,1.135*s))
            wrist=Vector((.295*s,-.305*s,1.220*s))
        else:
            # Far hand counters the forward hand instead of mirroring it.
            elbow=Vector((-.310*s,.020*s,1.110*s))
            wrist=Vector((-.245*s,-.160*s,1.185*s))
        ctrl(sex+f'_shoulder_CTRL_{sign}',shoulder)
        ctrl(sex+f'_elbow_CTRL_{sign}',elbow)
        ctrl(sex+f'_hand_SOCKET_{sign}',wrist)
        move_segment(sex+f'_upper_arm_{sign}',shoulder,elbow)
        move_segment(sex+f'_forearm_{sign}',elbow,wrist)
        move_segment(sex+f'_wrist_guard_{sign}',elbow.lerp(wrist,.65),elbow.lerp(wrist,.94))
        direction=(wrist-elbow).normalized()
        center=wrist+direction*.038*s
        place_oval(sex+f'_empty_hand_{sign}',center,(.040*s,.034*s,.048*s),direction)
        thumb=center+Vector((-sign*.029*s,-.012*s,-.006*s))
        place_oval(sex+f'_thumb_{sign}',thumb,(.018*s,.019*s,.026*s),direction)
        arm_positions[str(sign)]={'shoulder':list(shoulder),'elbow':list(elbow),'wrist':list(wrist)}
    legs={}
    for sign in (-1,1):
        if sign==1:
            hip=Vector((.115*s,-.033*s,.795*s));knee=Vector((.184*s,-.128*s,.418*s));ankle=Vector((.190*s,-.135*s,.10*s))
            angle=math.radians(-9)
        else:
            hip=Vector((-.085*s,-.010*s,.805*s));knee=Vector((-.133*s,.105*s,.446*s));ankle=Vector((-.175*s,.185*s,.10*s))
            angle=math.radians(16)
        move_segment(sex+f'_thigh_{sign}',hip,knee)
        move_segment(sex+f'_calf_{sign}',knee,ankle)
        place_oval(sex+f'_knee_{sign}',knee,(.061*s,.056*s,.062*s))
        move_segment(sex+f'_ankle_shoe_{sign}',(ankle.x,ankle.y,.06*s),(ankle.x,ankle.y,.19*s))
        foot_center=Vector((ankle.x,ankle.y-.053*s,.050*s))
        foot=bpy.data.objects[sex+f'_shoe_{sign}']
        foot.matrix_world=root_world@Matrix.Translation(foot_center)@Matrix.Rotation(angle,4,'Z')@Matrix.Diagonal((.066*s,.126*s,.05*s,1))
        legs[str(sign)]={'hip':list(hip),'knee':list(knee),'ankle':list(ankle),'foot_yaw_degrees':math.degrees(angle)}
    root['pose']='v02 grounded low guard';root['equipment']='unarmed'
    pose_record[sex]={'arms':arm_positions,'legs':legs,'torso_forward_lean_degrees':6,'torso_turn_degrees':-8,'pelvis_drop':.078*s}

scene['ready_pose_v02_applied']=True
bpy.context.view_layer.update()
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name)
    bpy.ops.render.render(write_still=True)
saved_loc=cam.location.copy();saved_rot=cam.rotation_euler.copy();saved_shift=cam.data.shift_y;saved_lens=cam.data.lens
for sex in ('male','female'):
    for other in ('male','female'):bpy.data.collections['VG_'+other].hide_render=(other!=sex)
    render(f'{sex}-logical-render.png',64,96)
    render(f'{sex}-structural-inspection.png',384,576)
    for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
        target=Vector((0,0,.84));az=math.radians(az);el=math.radians(el)
        cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
        render(f'{sex}-inspect-{name}.png',256,384)
    cam.location=saved_loc;cam.rotation_euler=saved_rot;cam.data.shift_y=saved_shift;cam.data.lens=saved_lens
camera_after={'location':list(cam.location),'rotation':list(cam.rotation_euler),'lens':cam.data.lens,'shift_x':cam.data.shift_x,'shift_y':cam.data.shift_y}
assert camera_before==camera_after
scene.render.resolution_x=64;scene.render.resolution_y=96
bpy.data.collections['VG_male'].hide_render=False;bpy.data.collections['VG_female'].hide_render=True;bpy.data.collections['VG_female'].hide_viewport=True
(ROOT/'pose-and-camera.json').write_text(json.dumps({'camera_preserved':True,'camera':camera_after,'poses':pose_record},indent=2))
text=bpy.data.texts.new('pose_ready_v02.py');text.write((ROOT/'pose_ready.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-ready-v02.blend'),compress=True)
print('Existing figures posed and rendered; camera, lights, clothing and materials preserved. Saved player-ready-v02.blend.')
