from pathlib import Path
from PIL import Image
import numpy as np,json,hashlib
R=Path(__file__).resolve().parent
LAYOUTS={'villagers':['field-hand','scribe'],'defense':['scout','defender'],'beasts':['pack-wolf','well-alpha']}
manifest={}
for key,names in LAYOUTS.items():
 w=96 if key=='beasts' else 48;h=96;scale=4 if key=='beasts' else 8
 sheet=Image.new('RGBA',(w*4,h*2));entries=[]
 for row,name in enumerate(names):
  for col,d in enumerate(('front','right','back','left')):
   path=R/'renders'/f'{name}-{d}.png';im=Image.open(path).convert('RGBA');a=np.array(im);a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
   pix=Image.fromarray(a);frame=Image.new('RGBA',(w,h));frame.alpha_composite(pix,(0,2))
   assert np.count_nonzero(np.array(frame)[:,:,3])==np.count_nonzero(a[:,:,3])
   sheet.alpha_composite(frame,(col*w,row*h));entries.append({'actor':name,'direction':d,'row':row,'column':col,'render_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bbox':frame.getbbox()})
 logical=R/'guides'/f'{key}-logical.png';sheet.save(logical)
 enlarged=sheet.resize((sheet.width*scale,sheet.height*scale),Image.Resampling.NEAREST);enlarged.save(R/'guides'/f'{key}-input.png')
 assert np.array_equal(np.array(enlarged),np.repeat(np.repeat(np.array(sheet),scale,0),scale,1))
 manifest[key]={'frame_size':[w,h],'rows':2,'columns':4,'integer_enlargement':scale,'alpha_threshold':128,'shared_guide_translation':[0,2],'entries':entries}
(R/'sheet-manifest.json').write_text(json.dumps(manifest,indent=2))
