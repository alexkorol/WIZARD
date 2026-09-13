"""Deterministic preprocessing of the LOW-resolution Blender renders, before imagegen."""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parent
P=json.loads((ROOT/'parameters.json').read_text())
OUT=ROOT/'guides';OUT.mkdir(exist_ok=True)
REVIEW=ROOT/'review';REVIEW.mkdir(exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',16)
small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',12)
heading=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',21)
LIGHT='#e9e5dc';DARK='#232c31';INK='#273330'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def composite(board,im,xy,bg=None):
    if bg:
        panel=Image.new('RGBA',im.size,bg);panel.alpha_composite(im);im=panel
    board.paste(im.convert('RGB') if bg else im,xy,None if bg else im)

report={'status':'UNAPPROVED structure; no imagegen calls yet','logical_canvas':P['logical_canvas'],'enlargement':P['enlargement'],'method':'Render directly at 64x96 in Blender; preserve RGB, threshold alpha at 128; translate both guides by the same integer Y offset to register the male foreground sole at y=89; enlarge 8x NEAREST. No palette reduction, stretch, or smooth-render input.','scale_status':P['scale_status'],'outputs':{}}
pixels={}
for sex in ('male','female'):
    path=ROOT/'renders'/f'{sex}-logical-render.png'
    raw=Image.open(path).convert('RGBA')
    assert list(raw.size)==P['logical_canvas']
    alpha=raw.getchannel('A').point(lambda a:255 if a>=128 else 0)
    raw.putalpha(alpha)
    if sex=='male': dy=P['anchor'][1]+1-raw.getbbox()[3]
    logical=Image.new('RGBA',raw.size)
    logical.alpha_composite(raw,(0,dy))
    # Canonical transparent pixels; preserve all RGB on covered pixels.
    logical.putdata([p if p[3] else (0,0,0,0) for p in logical.getdata()])
    lp=OUT/f'{sex}-logical-guide.png';logical.save(lp)
    enlarged=logical.resize((logical.width*8,logical.height*8),Image.Resampling.NEAREST)
    ep=OUT/f'{sex}-input-8x.png';enlarged.save(ep)
    assert enlarged.resize(logical.size,Image.Resampling.NEAREST).tobytes()==logical.tobytes()
    box=logical.getbbox();assert box and min(box[:2])>0 and box[2]<logical.width and box[3]<logical.height
    assert set(logical.getchannel('A').getdata())=={0,255}
    pixels[sex]=logical
    report['outputs'][sex]={'raw_render':str(path.relative_to(ROOT)),'raw_sha256':sha(path),'logical':str(lp.relative_to(ROOT)),'logical_sha256':sha(lp),'enlarged_input':str(ep.relative_to(ROOT)),'input_sha256':sha(ep),'bbox_xyxy':list(box),'visible_body_height_px':box[3]-box[1],'translation_xy':[0,dy],'anchor_xy':P['anchor'],'logical_dimensions':list(logical.size),'enlarged_dimensions':list(enlarged.size),'alpha_values':[0,255],'integer_blocks_verified':True}

board=Image.new('RGB',(872,744),LIGHT);d=ImageDraw.Draw(board)
d.text((20,12),'PLAYER FIGURES / FIRST STRUCTURAL REVIEW',font=heading,fill=INK)
d.text((20,43),'Unarmed · same light kit · provisional 64 × 96 canvas · appearance generation has not started',font=small,fill=INK)
for row,sex in enumerate(('male','female')):
    y=79+row*325
    d.text((20,y),sex.upper()+'  /  '+str(P[sex]['height'])+' m study height',font=font,fill=INK)
    smooth=Image.open(ROOT/'renders'/f'{sex}-structural-inspection.png').convert('RGBA').resize((192,288),Image.Resampling.LANCZOS)
    pixel=pixels[sex].resize((192,288),Image.Resampling.NEAREST)
    composite(board,smooth,(20,y+25),LIGHT)
    composite(board,pixel,(232,y+25),LIGHT)
    composite(board,pixel,(444,y+25),DARK)
    d.text((657,y+44),'Blender render',font=font,fill=INK)
    d.text((657,y+68),'← structural form',font=small,fill=INK)
    d.text((657,y+109),'Logical guide ×3',font=font,fill=INK)
    d.text((657,y+135),'Light + dark edge checks',font=small,fill=INK)
    d.text((657,y+181),'Editable controls',font=font,fill=INK)
    d.text((657,y+206),'Shoulder / elbow / hand',font=small,fill=INK)
    d.text((657,y+230),'Separate clothing pieces',font=small,fill=INK)
    d.text((657,y+258),'UNAPPROVED',font=font,fill=INK)
board.save(REVIEW/'structural-review.png')

native=Image.new('RGB',(336,142),LIGHT);d=ImageDraw.Draw(native)
for i,sex in enumerate(('male','female')):
    for j,bg in enumerate((LIGHT,DARK)):
        x=8+i*168+j*76
        composite(native,pixels[sex],(x,28),bg)
    d.text((8+i*168,6),sex+' · native 1×',font=small,fill=INK)
d.text((8,125),'64 × 96 logical guides; pixel parity still provisional',font=small,fill=INK)
native.save(REVIEW/'native-size.png')

scale=Image.new('RGB',(660,290),LIGHT);d=ImageDraw.Draw(scale)
d.text((18,12),'PROVISIONAL PLAYER-PLANE COMPARISON',font=heading,fill=INK)
d.text((18,44),'Same perspective camera and shared world-to-pixel scale for both figures.',font=small,fill=INK)
for i,sex in enumerate(('male','female')):
    x=32+i*170
    composite(scale,pixels[sex].resize((128,192),Image.Resampling.NEAREST),(x,66),LIGHT)
    d.text((x,266),f'{sex} · {P[sex]["height"]} m',font=small,fill=INK)
d.line((20,244,355,244),fill='#89928a',width=1)
d.text((389,96),'CURRENT PLAYER REFERENCE',font=font,fill=INK)
d.text((389,131),'Not established as owner-selected.',font=small,fill=INK)
d.text((389,155),'No older sprite substituted.',font=small,fill=INK)
d.text((389,193),'80 px body target is a study choice.',font=small,fill=INK)
d.text((389,217),'Final scale and camera await direction.',font=small,fill=INK)
scale.save(REVIEW/'provisional-scale.png')

angles=Image.new('RGB',(800,658),LIGHT);d=ImageDraw.Draw(angles)
d.text((16,10),'CONSTRUCTION CHECKS / ACTUAL BLENDER RENDERS',font=heading,fill=INK)
for row,sex in enumerate(('male','female')):
    for j,view in enumerate(('structural-inspection','inspect-side','inspect-opposite','inspect-top')):
        im=Image.open(ROOT/'renders'/f'{sex}-{view}.png').convert('RGBA')
        im.thumbnail((176,264),Image.Resampling.LANCZOS)
        x=16+j*198;y=60+row*300
        composite(angles,im,(x,y),LIGHT)
        d.text((x,y-18),sex+' / '+view.replace('structural-inspection','camera').replace('inspect-',''),font=small,fill=INK)
angles.save(REVIEW/'multi-angle-inspection.png')
(ROOT/'validation.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
