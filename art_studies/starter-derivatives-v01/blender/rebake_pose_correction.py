"""Headless staged rebuild: corrected pose -> fresh cloth -> candidate renders."""
import bpy,json
from pathlib import Path
R=Path(__file__).parent

def run(filename,sex,gait,**extra):
    p=R/filename
    exec(compile(p.read_text(),str(p),'exec'),dict(__file__=str(p),SEX=sex,GAIT=gait,**extra))

for sex,gait in [('female','walk'),('female','sprint'),('male','walk'),('male','sprint')]:
    bpy.ops.wm.open_mainfile(filepath=str(R/f'{sex}-{gait}-cloth-trial.blend'))
    rig=bpy.data.objects[f'MH_{sex}_Rig']
    if not rig.get('anatomical_pose_basis_v2'):run('correct_pose_basis.py',sex,gait)
    s=bpy.context.scene
    cloth=bpy.data.objects[f'player-{sex}_linen_single_shell']
    snap=bpy.data.objects[f'{sex}_{gait}_baked_cloth_samples']
    bpy.data.objects.remove(snap,do_unlink=True)
    cloth.hide_set(False);cloth.hide_render=False
    proxy=bpy.data.objects['Full_anatomical_cloth_collider'];proxy.hide_set(False)
    for m in list(cloth.modifiers):
        if m.type=='CLOTH':cloth.modifiers.remove(m)
    sim=cloth.modifiers.new('Fresh cloth after anatomical pose correction','CLOTH')
    sim.settings.quality=12;sim.settings.mass=.25
    sim.settings.tension_stiffness=35;sim.settings.compression_stiffness=35
    sim.settings.shear_stiffness=20;sim.settings.bending_stiffness=.8
    sim.settings.vertex_group_mass='Neckline_and_belt_pins'
    sim.collision_settings.use_collision=True;sim.collision_settings.distance_min=.008
    sim.collision_settings.collision_quality=8
    sim.collision_settings.use_self_collision=True;sim.collision_settings.self_distance_min=.006
    sim.point_cache.frame_start=1;sim.point_cache.frame_end=104
    sim.point_cache.name=f'{sex}_{gait}_anatomical_v2'
    s.frame_set(1)
    for frame in range(1,73):
        s.frame_set(frame);bpy.context.view_layer.update()
        ob=cloth.evaluated_get(bpy.context.evaluated_depsgraph_get())
        me=ob.to_mesh();ob.to_mesh_clear()
        if frame%20==0:print('FRESH_CLOTH',sex,gait,frame,flush=True)
    run('sample_cloth.py',sex,gait,RENDER_DIRECTIONS=[])
    run('finish_cloth_loop.py',sex,gait)
    # sample_cloth creates an unparented snapshot with its evaluated world
    # matrix; this includes the corrected actor heading exactly once.
    path=R/'pose-review'/f'{sex}-{gait}-posture.json'
    audit=json.loads(path.read_text());audit['cloth']='Fresh Blender cloth simulation on corrected action; 72-frame warmup, body/self collisions, eight sampled phases'
    path.write_text(json.dumps(audit,indent=2))
    run('relax_baked_cloth.py',sex,gait)
    run('bind_trim_to_cloth.py',sex,gait)
    run('render_baked_frames.py',sex,gait,OUTPUT_DIR=str(R/'pose-review/candidate-motion'))
    print('CANDIDATE_COMPLETE',sex,gait,flush=True)
