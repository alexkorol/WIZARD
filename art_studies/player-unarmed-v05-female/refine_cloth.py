"""Remove ballooning from the revised tunic; retain a simple hanging hem."""
import bpy,math
from pathlib import Path
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v05_Female'];cam=scene.camera
s=1.70/1.78;o=bpy.data.objects['female_linen_tunic']
for row,rx,front,back in [(0,.185,.124,.126),(1,.189,.127,.130),(2,.185,.123,.132),(3,.153,.108,.119)]:
    for j in range(32):
        a=2*math.pi*j/32;sn=math.sin(a);v=o.data.vertices[row*32+j]
        v.co.x=rx*s*math.cos(a);v.co.y=(front if sn<0 else back)*s*sn
o.data.update()
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
render('female-logical-render.png',32,64);render('female-structural-inspection.png',256,512)
from mathutils import Vector
original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
    target=Vector((0,0,.86));az=math.radians(az);el=math.radians(el)
    cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
    render('female-inspect-'+name+'.png',256,384)
cam.matrix_world=original[0];cam.data.lens=original[1];cam.data.shift_y=original[2]
scene.render.resolution_x=32;scene.render.resolution_y=64
txt=bpy.data.texts.new('refine_cloth_v05.py');txt.write((ROOT/'refine_cloth.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v05.blend'),compress=True)
print('Refined tunic fall and rerendered female views.')
