"""Add transparent margins without modifying any Blender or exemplar pixels."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT=Path(__file__).resolve().parent.parent
poses=json.loads((ROOT/'manifest-blender.json').read_text())['clips']['female-sprint-right']['frames']
for version,columns,rows,padding,scale in [('v01',4,2,24,3),('v02',2,2,16,4)]:
    out=ROOT/f'web-padding-{version}'
    out.mkdir(exist_ok=True)
    outer=96+padding*2
    sheet=Image.new('RGBA',(columns*outer,rows*outer))
    entries=[]
    for i,pose in enumerate(poses[:columns*rows]):
        path=ROOT/pose['src']; im=Image.open(path)
        assert im.size==(96,96) and im.mode=='RGBA'
        x,y=(i%columns)*outer+padding,(i//columns)*outer+padding
        sheet.paste(im,(x,y))
        assert sheet.crop((x,y,x+96,y+96)).tobytes()==im.tobytes()
        entries.append(dict(frame=i+1,inner_rect=[x,y,96,96],anchor=[x+48,y+80],
            source=pose['src'],sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
    sheet.save(out/'padded-guide-native.png')
    sheet.resize((sheet.width*scale,sheet.height*scale),Image.Resampling.NEAREST).save(out/f'padded-guide-{scale}x.png')
    example=Image.new('RGBA',(outer,outer))
    path=ROOT/'web-v01/single-frame96.png'
    example.paste(Image.open(path),(padding,padding))
    example.save(out/'padded-example-native.png')
    example.resize((outer*scale,outer*scale),Image.Resampling.NEAREST).save(out/f'padded-example-{scale}x.png')
    (out/'layout.json').write_text(json.dumps(dict(sheet_native=list(sheet.size),columns=columns,rows=rows,
        outer_cell=[outer,outer],inner_frame=[96,96],padding=padding,upscale=scale,base_cell=48,
        exemplar_source='web-v01/single-frame96.png',exemplar_sha256=hashlib.sha256(path.read_bytes()).hexdigest(),frames=entries),indent=2))
    (out/'input-hashes.json').write_text(json.dumps({p.name:hashlib.sha256(p.read_bytes()).hexdigest()
        for p in [out/f'padded-guide-{scale}x.png',out/f'padded-example-{scale}x.png',out/'prompt.txt']},indent=2))
    print(version,sheet.size,'padding',padding,'all native RGBA pixels preserved')
