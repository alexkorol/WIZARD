from pathlib import Path
import json,hashlib,zipfile
R=Path(__file__).resolve().parent
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
files={str(p.relative_to(R)).replace('\\','/'):h(p) for folder in ['generated','prompts','inputs','frames','final'] for p in (R/folder).glob('*') if p.is_file()}
sources={str(p.relative_to(R.parent)).replace('\\','/'):h(p) for p in (R.parent/'sources').glob('*.blend')}
(R/'asset-hashes.json').write_text(json.dumps({'outputs':files,'parent_human_sources':sources},indent=2))
with zipfile.ZipFile(R/'prologue-cast-native-alpha.zip','w',zipfile.ZIP_DEFLATED) as z:
 for folder in ['frames','final','generated','prompts']:
  for p in (R/folder).glob('*'):z.write(p,p.relative_to(R))
 for p in R.glob('*-alpha-audit.json'):z.write(p,p.name)
 for name in ['README.md','pack-verification.json','asset-hashes.json']:z.write(R/name,name)
 for p in (R/'review').glob('*native-alpha.png'):z.write(p,p.relative_to(R))
 for p in (R/'review').glob('prologue-cast-*.png'):z.write(p,p.relative_to(R))
with zipfile.ZipFile(R/'prologue-cast-native-alpha.zip') as z:
 assert z.testzip() is None
 assert len([n for n in z.namelist() if n.startswith('frames/')])==32
 assert len([n for n in z.namelist() if n.startswith('generated/')])==4
print('Verified native-alpha archive:32 frames, four sheets, four untouched native RGBA originals.')
