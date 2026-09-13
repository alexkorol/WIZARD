"""Pixelize actual renders; pack frames; exact integer enlargement only."""
from pathlib import Path
from PIL import Image
import json,hashlib
R=Path(__file__).resolve().parent
for name in ('guides','generated','review'): (R/name).mkdir(exist_ok=True)
dirs=['front','right','back','left'];frames={};report={'layout_notation':'rows x columns','frame_dimensions':[48,96],'shared_frame_translation':[0,2],'layouts':{}}
for sex in ('male','female'):
    for direction in dirs:
        raw=Image.open(R/'renders'/f'{sex}-{direction}.png').convert('RGBA');assert raw.size==(48,96)
        raw.putalpha(raw.getchannel('A').point(lambda a:255 if a>=128 else 0))
        im=Image.new('RGBA',(48,96));im.alpha_composite(raw,(0,2));im.putdata([p if p[3] else (0,0,0,0) for p in im.getdata()])
        im.save(R/'guides'/f'{sex}-{direction}-48x96.png');frames[(sex,direction)]=im
for layout,rows,cols,sexes in [('1x4',1,4,['female']),('2x2',2,2,['female']),('2x4',2,4,['male','female'])]:
    sheet=Image.new('RGBA',(cols*48,rows*96));entries=[]
    sequence=[(sex,d) for sex in sexes for d in dirs]
    for i,key in enumerate(sequence):
        x=(i%cols)*48;y=(i//cols)*96;sheet.alpha_composite(frames[key],(x,y));entries.append({'sex':key[0],'direction':key[1],'row':i//cols,'column':i%cols})
    lp=R/'guides'/f'{layout}-logical-sheet.png';ep=R/'guides'/f'{layout}-input-8x.png';sheet.save(lp)
    big=sheet.resize((sheet.width*8,sheet.height*8),Image.Resampling.NEAREST);big.save(ep)
    assert all(big.getpixel((x,y))==sheet.getpixel((x//8,y//8)) for y in range(big.height) for x in range(big.width))
    report['layouts'][layout]={'rows':rows,'columns':cols,'logical_dimensions':list(sheet.size),'input_dimensions':list(big.size),'frames':entries,'input_sha256':hashlib.sha256(ep.read_bytes()).hexdigest(),'exact8x_verified':True}
(R/'sheet-manifest.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
