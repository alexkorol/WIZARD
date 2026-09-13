"""Close sleeve shoulder ends after multi-angle inspection exposed open mesh caps."""
import bpy,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v06_Reference'];cam=scene.camera
for sign in [-1,1]:
    o=bpy.data.objects['female_loose_sleeve_'+str(sign)];old=o.data
    mesh=bpy.data.meshes.new(o.name+'_closed');mesh.from_pydata([tuple(v.co) for v in old.vertices],[],[tuple(f.vertices) for f in old.polygons]+[tuple(range(64,96))])
    for m in old.materials:mesh.materials.append(m)
    mesh.update();o.data=mesh
    for f in mesh.polygons:f.use_smooth=len(f.vertices)==4
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
bpy.data.texts.new('close_sleeves_v06.py').write((ROOT/'close_sleeves.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v06.blend'),compress=True)
print('Closed sleeve shoulder ends and saved all views.')
