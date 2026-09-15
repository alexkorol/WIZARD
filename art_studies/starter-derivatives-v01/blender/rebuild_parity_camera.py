"""Re-render the existing village using the corrected shared player camera."""
import bpy
from pathlib import Path
R=Path(__file__).parent
bpy.ops.wm.open_mainfile(filepath=str(R/'female-walk-cloth-trial.blend'))
p=R/'build_parity_scene.py'
exec(compile(p.read_text(),str(p),'exec'),dict(__file__=str(p)))
