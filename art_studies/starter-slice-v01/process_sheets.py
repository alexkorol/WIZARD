"""Audit untouched outputs, explicitly derive local alpha if needed, run Pixel Respecter."""
from pathlib import Path
from PIL import Image
from scipy import ndimage
import numpy as np,json,hashlib,shutil,sys
R=Path(__file__).resolve().parent
ENGINE=Path('Z:/Code/Python/pixel-perfecter');sys.path.insert(0,str(ENGINE))
from pixel_perfecter.reconstructor import PixelArtReconstructor
ORIGINAL=Path('C:/Users/Alex/.codex/generated_images/01a09918-529d-7150-91a6-6c624530795b')
SOURCES={'villagers':'exec-b4441d2d-931e-4446-a369-0013fe2fe747.png','defense':'exec-41697174-bced-453b-875a-11d8c36e74c5.png','beasts':'exec-737837e4-c67c-42bb-a27d-45ba60a67272.png'}
for folder in ('locally-derived','reconstructed'): (R/folder).mkdir(exist_ok=True)
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for name,file in SOURCES.items():
 src=R/'generated'/f'{name}-original.png';shutil.copy2(ORIGINAL/file,src)
 im=Image.open(src);a=np.array(im.convert('RGBA'));native='A' in im.getbands() and np.any(a[:,:,3]==0)
 report={'raw_source':str(ORIGINAL/file),'raw_sha256':h(src),'raw_mode':im.mode,'raw_size':im.size,'png_color_type':src.read_bytes()[25],'native_generated_alpha':bool(native),'generation':'Built-in image_gen; one call per sheet','prompt':f'prompts/{name}.txt'}
 if not native:
  rgb=a[:,:,:3].astype(np.int16);neutral=(rgb.max(2)-rgb.min(2)<=20)&(rgb.min(2)>=160)
  seed=np.zeros(neutral.shape,bool);seed[0]=neutral[0];seed[-1]=neutral[-1];seed[:,0]=neutral[:,0];seed[:,-1]=neutral[:,-1]
  bg=ndimage.binary_propagation(seed,mask=neutral);a[:,:,3]=np.where(bg,0,255);a[bg,:3]=0
  report['alpha_origin']='LOCALLY DERIVED boundary-connected neutral background; raw generation failed true-alpha request'
  report['local_mask_rule']='RGB channel spread <=20 and minimum >=160, flood from image edges; remaining visible RGB unchanged'
 else:report['alpha_origin']='Native generated alpha preserved'
 p=R/'locally-derived'/f'{name}.png';Image.fromarray(a).save(p);report['processing_source_sha256']=h(p)
 (R/f'{name}-alpha-audit.json').write_text(json.dumps(report,indent=2))
 rec=PixelArtReconstructor(str(p));result=rec.run();Image.fromarray(result).save(R/'reconstructed'/f'{name}-auto.png')
 info={'cell_size':rec.cell_size,'offset':rec.offset,'metrics':rec.last_metrics,'debug':rec.last_fit_debug,'dimensions':list(result.shape[:2][::-1])}
 (R/'reconstructed'/f'{name}-fit.json').write_text(json.dumps(info,indent=2,default=lambda o:o.tolist() if hasattr(o,'tolist') else str(o)))
 print(name,report['raw_mode'],'alpha',native,'grid',rec.cell_size,'output',result.shape,flush=True)
