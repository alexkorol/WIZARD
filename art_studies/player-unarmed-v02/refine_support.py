"""Increase knee flexion and let the existing tunic clear the posed thighs."""
import bpy, math, json
from pathlib import Path
from mathutils import Matrix,Vector
ROOT=Path(STUDY_ROOT);P=json.loads((ROOT/'parameters.json').read_text())
scene=bpy.data.scenes['VG_Player_Unarmed_v02'];bpy.context.window.scene=scene;cam=scene.camera
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-knee-cloth-adjustment.blend'),compress=True)
record=json.loads((ROOT/'pose-and-camera.json').read_text())
for sex in ('male','female'):
    bpy.data.collections['VG_'+sex].hide_viewport=False
    root=bpy.data.objects[sex+'_ROOT'];R=root.matrix_world.copy();s=P[sex]['height']/1.78
    def segment(name,a,b):
        obj=bpy.data.objects[name];a,b=Vector(a),Vector(b)
        length=max(v.co.z for v in obj.data.vertices)-min(v.co.z for v in obj.data.vertices)
        obj.matrix_world=R@Matrix.Translation(a)@(b-a).to_track_quat('Z','Y').to_matrix().to_4x4()@Matrix.Diagonal((1,1,(b-a).length/length,1))
    for sign in (-1,1):
        p=record['poses'][sex]['legs'][str(sign)]
        knee=Vector((.178*s,-.205*s,.408*s)) if sign==1 else Vector((-.140*s,.035*s,.417*s))
        segment(sex+f'_thigh_{sign}',p['hip'],knee)
        segment(sex+f'_calf_{sign}',knee,p['ankle'])
        obj=bpy.data.objects[sex+f'_knee_{sign}'];obj.matrix_world=R@Matrix.Translation(knee)@Matrix.Diagonal((.061*s,.056*s,.062*s,1))
        p['knee']=list(knee)
    obj=bpy.data.objects[sex+'_linen_tunic']
    for row,depth in [(0,.182*s),(1,.150*s)]:
        for j in range(16):obj.data.vertices[row*16+j].co.y=depth*math.sin(2*math.pi*j/16)
    obj.data.update()
record['garment_pose_adjustment']='lower tunic cloth clears the flexed thighs; same garment, material and coverage'
(ROOT/'pose-and-camera.json').write_text(json.dumps(record,indent=2))
saved_loc=cam.location.copy();saved_rot=cam.rotation_euler.copy();saved_shift=cam.data.shift_y;saved_lens=cam.data.lens
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
for sex in ('male','female'):
    for other in ('male','female'):bpy.data.collections['VG_'+other].hide_render=(other!=sex)
    render(f'{sex}-logical-render.png',64,96);render(f'{sex}-structural-inspection.png',384,576)
    for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
        target=Vector((0,0,.84));az=math.radians(az);el=math.radians(el)
        cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
        render(f'{sex}-inspect-{name}.png',256,384)
    cam.location=saved_loc;cam.rotation_euler=saved_rot;cam.data.shift_y=saved_shift;cam.data.lens=saved_lens
scene.render.resolution_x=64;scene.render.resolution_y=96
bpy.data.collections['VG_male'].hide_render=False;bpy.data.collections['VG_female'].hide_render=True;bpy.data.collections['VG_female'].hide_viewport=True
text=bpy.data.texts.new('refine_support_v02.py');text.write((ROOT/'refine_support.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-ready-v02.blend'),compress=True)
print('Knees flexed; original tunic deformed to clear thighs. Fixed-camera and multi-angle renders updated.')
