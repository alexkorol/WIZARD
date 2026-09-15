"""Finish and render staged posture candidates without touching active frames."""
import bpy
from pathlib import Path
R=Path(__file__).parent
for sex in ['female','male']:
    for gait in ['walk','sprint']:
        bpy.ops.wm.open_mainfile(filepath=str(R/f'{sex}-{gait}-cloth-trial.blend'))
        for filename in ['relax_baked_cloth.py','bind_trim_to_cloth.py','render_baked_frames.py']:
            p=R/filename
            exec(compile(p.read_text(),str(p),'exec'),dict(__file__=str(p),SEX=sex,GAIT=gait,OUTPUT_DIR=str(R/'pose-review/candidate-motion')))
        print('FINISHED_CANDIDATE',sex,gait,flush=True)
