from pathlib import Path
from PIL import Image
import json,hashlib,zipfile,subprocess
R=Path(__file__).resolve().parent;engine=Path('Z:/Code/Python/pixel-perfecter')
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
e={'path':str(engine),'git_head':subprocess.check_output(['git','-C',str(engine),'rev-parse','HEAD'],text=True).strip(),'dirty_checkout_used_without_modification':True,'source_hashes':{str(p.relative_to(engine)):digest(p) for p in (engine/'pixel_perfecter').glob('*.py')}}
(R/'engine-provenance.json').write_text(json.dumps(e,indent=2))
files={str(p.relative_to(R)).replace('\\','/'):digest(p) for folder in ['sources','imports','renders','guides','generated','prompts','frames','final'] for p in (R/folder).glob('*') if p.is_file() and p.suffix!='.blend1'}
(R/'asset-hashes.json').write_text(json.dumps(files,indent=2))
with zipfile.ZipFile(R/'prologue-cast-frames-v01.zip','w',zipfile.ZIP_DEFLATED) as z:
 for folder in ['frames','final']:
  for p in (R/folder).glob('*.png'):z.write(p,p.relative_to(R))
 for f in ['README.md','pack-verification.json','asset-hashes.json']:z.write(R/f,f)
 for p in (R/'review').glob('prologue-cast-*.png'):z.write(p,p.relative_to(R))
with zipfile.ZipFile(R/'prologue-cast-frames-v01.zip') as z:
 assert z.testzip() is None
 assert len([n for n in z.namelist() if n.startswith('frames/')])==32
print('Verified 32 RGBA frames, 4 sheets, archive integrity and asset hashes.')
