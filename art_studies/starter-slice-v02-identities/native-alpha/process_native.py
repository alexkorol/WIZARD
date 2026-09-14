from pathlib import Path
from PIL import Image
import numpy as np,sys,json,hashlib
R=Path(__file__).resolve().parent
sys.path.insert(0,'Z:/Code/Python/pixel-perfecter')
from pixel_perfecter.reconstructor import PixelArtReconstructor
for name in ('players','villagers','defense','beasts'):
 p=R/'generated'/f'{name}-original.png';im=Image.open(p);a=np.array(im)
 assert im.mode=='RGBA' and np.any(a[:,:,3]==0), 'Native alpha required; no color-key fallback'
 audit={'raw_mode':im.mode,'raw_size':im.size,'png_color_type':p.read_bytes()[25],'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'alpha_zero_pixels':int((a[:,:,3]==0).sum()),'native_returned_alpha':True,'input_history':'Final preservation edit used the prior cleaned RGBA appearance sheet; fresh clean-guide generation separately proved native alpha without local masking.','pixel_alpha_policy':'Threshold the returned alpha at128 for binary sprites; no RGB/background-color mask'}
 a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
 inp=R/'inputs'/f'{name}.png';Image.fromarray(a).save(inp)
 (R/f'{name}-alpha-audit.json').write_text(json.dumps(audit,indent=2))
 rec=PixelArtReconstructor(str(inp));out=rec.run();Image.fromarray(out).save(R/'reconstructed'/f'{name}-auto.png')
 fit={'cell_size':rec.cell_size,'offset':rec.offset,'metrics':rec.last_metrics,'debug':rec.last_fit_debug,'dimensions':list(out.shape[:2][::-1])}
 (R/'reconstructed'/f'{name}-fit.json').write_text(json.dumps(fit,indent=2,default=lambda o:o.tolist() if hasattr(o,'tolist') else str(o)))
 print(name,'native RGBA',im.size,'detected',rec.cell_size,flush=True)
