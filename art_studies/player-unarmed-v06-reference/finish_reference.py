"""Close shoulder coverage and soften the loose hair silhouette."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v06_Reference'];cam=scene.camera;s=1.70/1.78
for sign in [-1,1]:
    o=bpy.data.objects['female_loose_sleeve_'+str(sign)]
    for j in range(32):o.data.vertices[64+j].co.z=1.452*s
    o.data.update()
o=bpy.data.objects['female_hair']
for v in o.data.vertices:
    if v.co.z>1.72*s:v.co.x*=1.17;v.co.y*=1.10
for name in ['female_hair_sweep','female_hair_other_side','female_hair_back']:
    o=bpy.data.objects[name]
    for v in o.data.vertices:
        z=v.co.z/s;v.co.x+=.008*s*math.sin((z-1.3)*24);v.co.y+=.006*s*math.cos((z-1.3)*29)
    o.data.update()
def render(name,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/name);bpy.ops.render.render(write_still=True)
render('female-logical-render.png',32,64);render('female-structural-inspection.png',256,512)
original=(cam.matrix_world.copy(),cam.data.lens,cam.data.shift_y)
for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
    target=Vector((0,0,.86));az=math.radians(az);el=math.radians(el)
    cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.shift_y=0;cam.data.lens=100
    render('female-inspect-'+name+'.png',256,384)
cam.matrix_world=original[0];cam.data.lens=original[1];cam.data.shift_y=original[2]
scene.render.resolution_x=32;scene.render.resolution_y=64
bpy.data.texts.new('finish_reference_v06.py').write((ROOT/'finish_reference.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v06.blend'),compress=True)
print('Shoulders covered; loose-hair outline softened; final views saved.')
