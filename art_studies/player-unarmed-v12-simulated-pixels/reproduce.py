"""Re-run only the local Pixel Respecter stages on preserved simulated artwork."""
from pathlib import Path
import subprocess,sys
R=Path(__file__).resolve().parent;ENGINE=Path('Z:/Code/Python/pixel-perfecter')
subprocess.run([str(ENGINE/'.venv/Scripts/python.exe'),'-m','pixel_perfecter.cli',str(R/'generated'),'--output-dir',str(R/'reconstructed'),'--transparent-bg','--skip-overlays'],cwd=ENGINE,check=True)
subprocess.run([sys.executable,str(R/'finish_respected.py')],check=True)
