"""Add the missing upper-chest backing beneath the wrap neckline."""
import bpy,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v08_Wrap'];cam=scene.camera;s=1.70/1.78
rings=[(1.32,.148,.108),(1.37,.145,.098),(1.42,.129,.075),(1.46,.086,.058),(1.51,.050,.051)]
vs=[(rx*s*math.cos(j*2*math.pi/32),ry*s*math.sin(j*2*math.pi/32),z*s) for z,rx,ry in rings for j in range(32)]
faces=[(k*32+j,k*32+(j+1)%32,(k+1)*32+(j+1)%32,(k+1)*32+j) for k in range(len(rings)-1) for j in range(32)]
mesh=bpy.data.meshes.new('female_upper_chest_v08');mesh.from_pydata(vs,[],faces);mesh.materials.append(bpy.data.materials['VG_skin_blockout']);mesh.update()
o=bpy.data.objects.new('female_upper_chest',mesh);bpy.data.collections['VG_female'].objects.link(o);o.parent=bpy.data.objects['female_ROOT'];o.matrix_world=bpy.data.objects['female_hide_vest'].matrix_world.copy()
for f in mesh.polygons:f.use_smooth=True
o=bpy.data.objects['female_hide_shoulder_layer']
for j in range(16):o.data.vertices[32+j].co.z-=.028*s*abs(math.cos(j*math.pi/15))
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
bpy.data.texts.new('finish_neckline_v08.py').write((ROOT/'finish_neckline.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v08.blend'),compress=True)
print('Neckline backed with chest surface and inspection views saved.')
