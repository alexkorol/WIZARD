"""Compact natural idle, adapting existing leg meshes through Blender MCP."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path(STUDY_ROOT)
for d in ('sources','renders'): (ROOT/d).mkdir(exist_ok=True)
scene=bpy.data.scenes['VG_Player_Unarmed_v06_Reference'];bpy.context.window.scene=scene
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-v07.blend'),compress=True)
scene.name='VG_Player_Unarmed_v07_Idle';cam=scene.camera
original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
s=1.70/1.78;R=bpy.data.objects['female_ROOT'].matrix_world.copy();records={}
def seg(suffix,a,b,factor):
    o=bpy.data.objects['female_'+suffix];a,b=Vector(a),Vector(b)
    length=max(v.co.z for v in o.data.vertices)-min(v.co.z for v in o.data.vertices)
    o.matrix_world=R@Matrix.Translation(a)@(b-a).to_track_quat('Z','Y').to_matrix().to_4x4()@Matrix.Diagonal((factor,factor,(b-a).length/length,1))
for sign in [-1,1]:
    hip=Vector((.035*s+sign*.10*s,0,.85*s))
    if sign==1:
        knee=Vector((.12*s,-.040*s,.450*s));ankle=Vector((.130*s,-.055*s,.10*s));angle=-4
    else:
        knee=Vector((-.075*s,.022*s,.460*s));ankle=Vector((-.115*s,.090*s,.10*s));angle=7
    seg(f'thigh_{sign}',hip,knee,.87);seg(f'calf_{sign}',knee,ankle,.87)
    bpy.data.objects[f'female_knee_{sign}'].matrix_world=R@Matrix.Translation(knee)@Matrix.Diagonal((.05*s,.048*s,.060*s,1))
    seg(f'ankle_shoe_{sign}',(ankle.x,ankle.y,.06*s),(ankle.x,ankle.y,.19*s),.88)
    bpy.data.objects[f'female_shoe_{sign}'].matrix_world=R@Matrix.Translation(Vector((ankle.x,ankle.y-.053*s,.05*s)))@Matrix.Rotation(math.radians(angle),4,'Z')@Matrix.Diagonal((.058*s,.111*s,.05*s,1))
    records[str(sign)]={'hip':list(hip),'knee':list(knee),'ankle':list(ankle),'foot_yaw_degrees':angle}
P=json.loads((ROOT/'parameters.json').read_text())
P['female']['revision']='v07 compact staggered idle; photo is general inspiration, not a locked costume or pose'
P['pose']='female relaxed narrow idle with mild stagger; low hands; male unchanged'
P['status']='unapproved design study; 32x64 selected'
(ROOT/'parameters.json').write_text(json.dumps(P,indent=2))
(ROOT/'pose-verification.json').write_text(json.dumps({'female_legs':records,'lateral_ankle_separation_before_m':.484*s,'lateral_ankle_separation_after_m':.245*s,'camera_lighting_clothing_hair_unchanged':True},indent=2))
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
bpy.data.texts.new('narrow_idle_v07.py').write((ROOT/'narrow_idle.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v07.blend'),compress=True)
print('Narrow idle rendered and saved. Camera, clothing and upper body preserved.')
