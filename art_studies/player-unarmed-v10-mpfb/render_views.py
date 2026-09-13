import bpy,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v10_MPFB'];cam=scene.camera
original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
for sex in ['male','female']:
    for other in ['male','female']:
        bpy.data.collections['VG_'+other].hide_render=other!=sex;bpy.data.collections['MH_'+other].hide_render=other!=sex
    render(sex+'-logical-render.png',32,64);render(sex+'-structural-inspection.png',256,512)
    for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
        target=Vector((0,0,.86));az=math.radians(az);el=math.radians(el)
        cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
        render(sex+'-inspect-'+name+'.png',256,384)
    cam.matrix_world=original[0];cam.data.lens=original[1];cam.data.shift_y=original[2]
scene.render.resolution_x=32;scene.render.resolution_y=64
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'players-mpfb-v10.blend'),compress=True)
print('Final logical and multi-angle renders saved.')
