"""Audit untouched outputs, explicitly derive local alpha if needed, run Pixel Respecter."""
from pathlib import Path
from PIL import Image
from scipy import ndimage
import numpy as np,json,hashlib,shutil,sys
R=Path(__file__).resolve().parent
ENGINE=Path('Z:/Code/Python/pixel-perfecter');sys.path.insert(0,str(ENGINE))
from pixel_perfecter.reconstructor import PixelArtReconstructor
SOURCES={'players':'players-braid-repair.png','villagers':'villagers-original.png','defense':'defense-original.png'}
if len(sys.argv)>1:SOURCES={k:v for k,v in SOURCES.items() if k in sys.argv[1:]}
for folder in ('locally-derived','reconstructed'): (R/folder).mkdir(exist_ok=True)
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for name,file in SOURCES.items():
 src=R/'generated'/file
 im=Image.open(src);a=np.array(im.convert('RGBA'));native='A' in im.getbands() and np.any(a[:,:,3]==0)
 report={'raw_source':str(src),'raw_sha256':h(src),'raw_mode':im.mode,'raw_size':im.size,'png_color_type':src.read_bytes()[25],'native_generated_alpha':bool(native),'generation':'Built-in image_gen; first pass per human sheet, targeted player grip and rear-braid repairs','prompt':f'prompts/{name}.txt'}
 if not native:
  rgb=a[:,:,:3].astype(np.int16);neutral=(rgb.max(2)-rgb.min(2)<=20)&(rgb.min(2)>=160)
  seed=np.zeros(neutral.shape,bool);seed[0]=neutral[0];seed[-1]=neutral[-1];seed[:,0]=neutral[:,0];seed[:,-1]=neutral[:,-1]
  bg=ndimage.binary_propagation(seed,mask=neutral)
  # Recognize enclosed pieces of the painted checkerboard by neutral-tone variation.
  labels,count=ndimage.label(neutral & ~bg)
  for label,box in enumerate(ndimage.find_objects(labels),1):
   if box is None:continue
   region=labels[box]==label;values=rgb[box][region]
   if len(values)>=12 and np.ptp(values.mean(1))>=20:bg[box]|=region
  # Tiny disconnected neutral residuals are generator background noise, not sprite bodies.
  fg,count=ndimage.label(~bg);counts=np.bincount(fg.ravel());tiny=np.where((counts>0)&(counts<=100))[0];tiny=tiny[tiny!=0]
  noise=np.isin(fg,tiny)&(rgb.max(2)-rgb.min(2)<=24);bg|=noise
  a[:,:,3]=np.where(bg,0,255);a[bg,:3]=0
  report['alpha_origin']='LOCALLY DERIVED boundary-connected neutral background; raw generation failed true-alpha request'
  report['local_mask_rule']='Neutral RGB spread<=20,min>=160 boundary flood; enclosed neutral components >=12 pixels with tone range>=20 identify checkerboard; disconnected residual components <=100 pixels removed only where RGB spread<=24. Remaining visible RGB unchanged.'
 else:report['alpha_origin']='Native generated alpha preserved'
 p=R/'locally-derived'/f'{name}.png';Image.fromarray(a).save(p);report['processing_source_sha256']=h(p)
 (R/f'{name}-alpha-audit.json').write_text(json.dumps(report,indent=2))
 rec=PixelArtReconstructor(str(p));result=rec.run();Image.fromarray(result).save(R/'reconstructed'/f'{name}-auto.png')
 info={'cell_size':rec.cell_size,'offset':rec.offset,'metrics':rec.last_metrics,'debug':rec.last_fit_debug,'dimensions':list(result.shape[:2][::-1])}
 (R/'reconstructed'/f'{name}-fit.json').write_text(json.dumps(info,indent=2,default=lambda o:o.tolist() if hasattr(o,'tolist') else str(o)))
 print(name,report['raw_mode'],'alpha',native,'grid',rec.cell_size,'output',result.shape,flush=True)
