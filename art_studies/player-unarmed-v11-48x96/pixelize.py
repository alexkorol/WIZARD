from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parent
for name in ('guides','review','generated','normalized'): (R/name).mkdir(exist_ok=True)
P=json.loads((R/'parameters.json').read_text());W,H=P['logical_canvas'];N=P['enlargement'];anchor=P['anchor']
report={'logical_canvas':[W,H],'anchor':anchor,'method':'Actual 48x96 Blender render; alpha threshold128; common integer Y registration; exact8x NEAREST. No palette reduction.','outputs':{}}
for sex in ('male','female'):
    p=R/'renders'/f'{sex}-logical-render.png';raw=Image.open(p).convert('RGBA');assert raw.size==(W,H)
    raw.putalpha(raw.getchannel('A').point(lambda a:255 if a>=128 else 0))
    if sex=='male':dy=anchor[1]+1-raw.getbbox()[3]
    im=Image.new('RGBA',(W,H));im.alpha_composite(raw,(0,dy));im.putdata([p if p[3] else (0,0,0,0) for p in im.getdata()])
    lp=R/'guides'/f'{sex}-logical-guide.png';ep=R/'guides'/f'{sex}-input-8x.png';im.save(lp)
    large=im.resize((W*N,H*N),Image.Resampling.NEAREST);large.save(ep)
    assert all(large.getpixel((x,y))==im.getpixel((x//N,y//N)) for y in range(H*N) for x in range(W*N))
    b=im.getbbox();assert b[0]>0 and b[1]>0 and b[2]<W and b[3]<H
    report['outputs'][sex]={'visible_body_height_px':b[3]-b[1],'bbox':list(b),'translation_xy':[0,dy],'logical_sha256':hashlib.sha256(lp.read_bytes()).hexdigest(),'input_sha256':hashlib.sha256(ep.read_bytes()).hexdigest(),'exact_integer_enlargement_verified':True}
(R/'validation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
