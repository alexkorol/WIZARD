"""Explicitly LOCAL alpha derivation after raw generation failed; never overwrite raw."""
from pathlib import Path
from PIL import Image
from scipy import ndimage
import numpy as np,json,hashlib
R=Path(__file__).resolve().parent;(R/'locally-derived').mkdir(exist_ok=True)
source=R/'generated/2x4-original.png';im=Image.open(source);a=np.array(im.convert('RGB')).astype(np.int16)
assert im.mode=='RGB','This fallback is only for the recorded RGB failure; preserve native alpha if present.'
neutral=(a.max(2)-a.min(2)<=20)&(a.min(2)>=100)
seed=np.zeros(neutral.shape,bool);seed[0]=neutral[0];seed[-1]=neutral[-1];seed[:,0]=neutral[:,0];seed[:,-1]=neutral[:,-1]
bg=ndimage.binary_propagation(seed,mask=neutral)
rgba=np.dstack([a.astype(np.uint8),np.where(bg,0,255).astype(np.uint8)]);rgba[bg,:3]=0
p=R/'locally-derived/2x4-local-cutout.png';Image.fromarray(rgba).save(p)
report={'source':source.relative_to(R).as_posix(),'source_mode':im.mode,'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'output':p.relative_to(R).as_posix(),'output_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'alpha_origin':'Locally computed mask, NOT generated true alpha','method':'Boundary-connected neutral pixels with RGB channel spread<=20 and minimum channel>=100 become transparent; visible source RGB unchanged','transparent_pixels':int(bg.sum()),'opaque_pixels':int((~bg).sum()),'alpha_values':[0,255]}
(R/'local-alpha-audit.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
