"""Remove the rejected braid from current female sources and render 64 frames.

This is only a hair removal, not approval of the character or asset workflow.
The existing scalp mesh remains. No substitute tail or bun is generated.
"""
import bpy,shutil
from pathlib import Path
R=Path(__file__).parent
sources=[R.parent.parent/'starter-slice-v02-identities/sources/player-female.blend',
         R/'female-bound-motion.blend',R/'female-mocap-motion.blend',
         R/'female-walk-cloth-trial.blend',R/'female-sprint-cloth-trial.blend']
for source in sources:
    backup=R/'pose-review'/('before-braid-removal-'+source.name)
    if not backup.exists():shutil.copy2(source,backup)
    bpy.ops.wm.open_mainfile(filepath=str(source))
    for obj in list(bpy.data.objects):
        if obj.name.startswith('player-female_braid_strand_'):
            bpy.data.objects.remove(obj,do_unlink=True)
    bpy.data.objects['player-female_hair_scalp']['style']='short scalp hair; rejected side braid removed'
    bpy.ops.wm.save_as_mainfile(filepath=str(source),compress=True)
    print('REMOVED_SIDE_BRAID',source.name,flush=True)
    if source.name in ['female-walk-cloth-trial.blend','female-sprint-cloth-trial.blend']:
        p=R/'render_baked_frames.py';gait=source.name.split('-')[1]
        exec(compile(p.read_text(),str(p),'exec'),dict(__file__=str(p),SEX='female',GAIT=gait,OUTPUT_DIR=str(R/'pose-review/candidate-motion')))
