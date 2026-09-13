"""Small construction correction to the existing guide; no rebuild."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(globals().get('STUDY_ROOT', r'Z:\Code\.worktrees\wizard-art-player-guides\art_studies\player-unarmed-v01'))
P=json.loads((ROOT/'parameters.json').read_text())
scene=bpy.data.scenes['VG_Player_Unarmed_v01'];bpy.context.window.scene=scene
cam=scene.camera
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'before-cloth-padding-fix.blend'),compress=True)
for sex in ('male','female'):
    q=P[sex];s=q['height']/1.78;hw=q['hip_width']/2
    obj=bpy.data.objects[sex+'_linen_tunic']
    for row,rx in [(0,hw+.055),(1,hw+.050)]:
        for j in range(16):
            obj.data.vertices[row*16+j].co.x=rx*math.cos(2*math.pi*j/16)
            obj.data.vertices[row*16+j].co.y=.125*s*math.sin(2*math.pi*j/16)
    obj.data.update()
cam.data.shift_y-=.070
fixed_location=cam.location.copy();fixed_rotation=cam.rotation_euler.copy();fixed_shift=cam.data.shift_y;fixed_lens=cam.data.lens
def select_sex(sex):
    for key in ('male','female'):
        bpy.data.collections['VG_'+key].hide_render=(key!=sex)
def render(path,w,h):
    scene.render.resolution_x=w;scene.render.resolution_y=h;scene.render.filepath=str(ROOT/'renders'/path)
    bpy.ops.render.render(write_still=True)
for sex in ('male','female'):
    select_sex(sex)
    render(f'{sex}-logical-render.png',64,96)
    render(f'{sex}-structural-inspection.png',384,576)
    # Actual multi-angle renders for construction inspection. These do not replace the locked input camera.
    for name,az,el in [('side',90,12),('opposite',-45,35),('top',0,85)]:
        target=Vector((0,0,.88));az=math.radians(az);el=math.radians(el)
        cam.location=target+Vector((8*math.cos(el)*math.sin(az),-8*math.cos(el)*math.cos(az),8*math.sin(el)))
        cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
        cam.data.shift_y=0;cam.data.lens=100
        render(f'{sex}-inspect-{name}.png',256,384)
    cam.location=fixed_location;cam.rotation_euler=fixed_rotation;cam.data.shift_y=fixed_shift;cam.data.lens=fixed_lens
select_sex('male')
scene.render.resolution_x=64;scene.render.resolution_y=96
settings=json.loads((ROOT/'camera-and-render.json').read_text());settings['shift_y']=fixed_shift
settings['padding_correction']='shift_y decreased 0.070 to keep full feet and transparent bottom padding'
settings.pop('projected_bounds',None)
(ROOT/'camera-and-render.json').write_text(json.dumps(settings,indent=2))
bpy.data.texts['build_guides.py'].clear();bpy.data.texts['build_guides.py'].write((ROOT/'build_guides.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources'/'player-unarmed-v01.blend'),compress=True)
print('Corrected tunic intersections and foot padding; saved locked-camera renders and six multi-angle inspection renders.')
