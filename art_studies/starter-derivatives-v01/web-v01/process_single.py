"""Inspect an isolated generated pixel-scale exemplar without forcing its grid."""
from pathlib import Path
import sys, json, hashlib
import numpy as np
from PIL import Image
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parent))
from tune_transfer import transfer, expand, metrics
from pixel_perfecter.reconstructor import PixelArtReconstructor

path=R/'single-generated.png'
im=Image.open(path); assert im.mode=='RGBA' and im.getchannel('A').getextrema()[0]==0
source=np.array(im)
rec=PixelArtReconstructor(image=source);rec.run()
if rec.mesh_lines is not None:
    xs,ys=[list(map(int,v)) for v in rec.mesh_lines]
else:
    s=rec.cell_size; ox,oy=rec.offset
    xs=list(range(ox,source.shape[1]+1,s));ys=list(range(oy,source.shape[0]+1,s))
out=transfer(source,xs,ys); recovered=Image.fromarray(out); recovered.save(R/'single-recovered.png')
assert recovered.width<=96 and recovered.height<=96, 'Recovered pixels do not fit; do not resize them'
frame=Image.new('RGBA',(96,96));frame.paste(recovered,(0,0));frame.save(R/'single-frame96.png')
frame.resize((384,384),Image.Resampling.NEAREST).save(R/'single-frame96-4x.png')
report=dict(conversation='https://chatgpt.com/c/6aa79da7-9128-83ea-87e7-360c33b468f2',
            sha256=hashlib.sha256(path.read_bytes()).hexdigest(),mode=im.mode,
            source_size=list(im.size),alpha_extrema=im.getchannel('A').getextrema(),
            prompt='single-prompt.txt',inputs=['pose-single-8x.png','pixel-example-8x.png'],
            grid_size=rec.cell_size,recovered_size=list(recovered.size),bbox=recovered.getbbox(),
            x=xs,y=ys,fit=rec.last_fit_debug,transfer=metrics(source,expand(out,xs,ys,source.shape)),
            game_ready=False)
(R/'single-audit.json').write_text(json.dumps(report,indent=2,default=lambda o:o.tolist() if hasattr(o,'tolist') else str(o)))
records=json.loads((R/'recovery.json').read_text())
records=[v for v in records if v['name']!='female-sprint-right-single']
records.append(dict(name='female-sprint-right-single',raw='single-generated.png',
    recovered='single-frame96.png',source_size=list(im.size),recovered_size=[96,96],
    grid_size=rec.cell_size,game_ready=False,
    note=f'Single-frame calibration; not an animation. Automatic recovery {recovered.width}x{recovered.height}, transparent padding only.',
    frames=[dict(src='single-frame96.png',size=[96,96],bbox=frame.getbbox())]))
(R/'recovery.json').write_text(json.dumps(records,indent=2))
print('Native alpha',im.size,'grid',rec.cell_size,'recovered',recovered.size,'bbox',recovered.getbbox(),flush=True)
