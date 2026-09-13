"""Give the outer vest adequate clearance over the tunic at the hips."""
import bpy,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(STUDY_ROOT);scene=bpy.data.scenes['VG_Player_Unarmed_v09_Silhouette'];cam=scene.camera;s=1.70/1.78
rings=[(.81,.198,.146,.52),(.92,.183,.139,.35),(1.04,.135,.116,.18),(1.12,.135,.119,.20),(1.26,.174,.159,.45),(1.34,.180,.148,.65),(1.43,.163,.099,.72)]
vs=[];n=40
for row,(z,rx,ry,gap) in enumerate(rings):
    for j in range(n):
        a=-math.pi/2+gap+(2*math.pi-2*gap)*j/(n-1);zz=z
        if row==len(rings)-1:zz-=.10*abs(math.cos(a))**6
        if row==0:zz+=.025*math.sin(a+.3)
        vs.append((rx*s*math.cos(a),ry*s*math.sin(a)-.003*s,zz*s))
faces=[(k*n+j,k*n+j+1,(k+1)*n+j+1,(k+1)*n+j) for k in range(len(rings)-1) for j in range(n-1)]
o=bpy.data.objects['female_fitted_open_vest'];mesh=bpy.data.meshes.new('female_fitted_vest_clearance_v09');mesh.from_pydata(vs,[],faces)
for m in o.data.materials:mesh.materials.append(m)
mesh.update();o.data=mesh
for f in mesh.polygons:f.use_smooth=True
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
bpy.data.texts.new('finish_vest_v09.py').write((ROOT/'finish_vest.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-female-v09.blend'),compress=True)
print('Vest clearance corrected and all female views saved.')
