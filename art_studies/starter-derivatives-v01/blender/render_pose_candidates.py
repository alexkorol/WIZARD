"""Render already corrected source scenes into the isolated candidate folder."""
import bpy
from pathlib import Path
R=Path(__file__).parent
for sex in ['female','male']:
    for gait in ['walk','sprint']:
        bpy.ops.wm.open_mainfile(filepath=str(R/f'{sex}-{gait}-cloth-trial.blend'))
        p=R/'render_baked_frames.py'
        exec(compile(p.read_text(),str(p),'exec'),dict(__file__=str(p),SEX=sex,GAIT=gait,OUTPUT_DIR=str(R/'pose-review/candidate-motion')))
