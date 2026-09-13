from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
ROOT=Path(__file__).resolve().parent
P=json.loads((ROOT/'parameters.json').read_text())
for name in ('guides','review'): (ROOT/name).mkdir(exist_ok=True)
W,H=P['logical_canvas'];N=P['enlargement'];anchor=P['anchor']
LIGHT='#e9e5dc';DARK='#232c31';INK='#273330'
font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',14)
small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',11)
bold=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',19)
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def paste(canvas,im,xy,bg):
    back=Image.new('RGBA',im.size,bg);back.alpha_composite(im);canvas.paste(back.convert('RGB'),xy)
report={'canvas_selected_by_owner':True,'logical_canvas':[W,H],'grid_cell':P['grid_cell'],'humanoid_footprint_cells':[1,2],'anchor':anchor,'method':'Actual 32x64 Blender render -> RGB preserved, alpha threshold 128 -> shared integer Y registration -> exact 8x NEAREST. No resizing of v03 guides, no stretching, no palette reduction.','outputs':{}}
pixels={}
for sex in ('male','female'):
    raw_path=ROOT/'renders'/f'{sex}-logical-render.png';raw=Image.open(raw_path).convert('RGBA');assert raw.size==(W,H)
    raw.putalpha(raw.getchannel('A').point(lambda a:255 if a>=128 else 0))
    if sex=='male':dy=anchor[1]+1-raw.getbbox()[3]
    im=Image.new('RGBA',(W,H));im.alpha_composite(raw,(0,dy))
    im.putdata([p if p[3] else (0,0,0,0) for p in im.getdata()])
    lp=ROOT/'guides'/f'{sex}-logical-guide.png';ep=ROOT/'guides'/f'{sex}-input-8x.png'
    im.save(lp);enlarged=im.resize((W*N,H*N),Image.Resampling.NEAREST);enlarged.save(ep)
    assert enlarged.resize((W,H),Image.Resampling.NEAREST).tobytes()==im.tobytes()
    # Verify every enlarged pixel, not only a downsampled sample from each block.
    assert all(enlarged.getpixel((x,y))==im.getpixel((x//N,y//N)) for y in range(H*N) for x in range(W*N))
    bbox=im.getbbox();assert bbox and bbox[0]>0 and bbox[1]>0 and bbox[2]<W and bbox[3]<H
    assert set(im.getchannel('A').getdata())=={0,255}
    pixels[sex]=im
    report['outputs'][sex]={'logical_file':str(lp.relative_to(ROOT)),'logical_sha256':sha(lp),'input_file':str(ep.relative_to(ROOT)),'input_sha256':sha(ep),'raw_sha256':sha(raw_path),'visible_bbox_xyxy':list(bbox),'visible_body_height_px':bbox[3]-bbox[1],'translation_xy':[0,dy],'logical_dimensions':[W,H],'input_dimensions':[W*N,H*N],'alpha_values':[0,255],'all_integer_blocks_verified':True}

board=Image.new('RGB',(650,646),LIGHT);d=ImageDraw.Draw(board)
d.text((16,10),'HUMANOIDS / 32 × 64 LOGICAL PIXELS',font=bold,fill=INK)
d.text((16,39),'1 × 2 cells · female revised from supplied photo · unapproved',font=font,fill=INK)
for i,sex in enumerate(('male','female')):
    y=88+i*277
    smooth=Image.open(ROOT/'renders'/f'{sex}-structural-inspection.png').convert('RGBA').resize((128,256),Image.Resampling.LANCZOS)
    pixel=pixels[sex].resize((128,256),Image.Resampling.NEAREST)
    for x,label in [(16,'Blender guide'),(162,'Pixel guide ×4'),(308,'Dark preview ×4')]:d.text((x,y-19),label,font=small,fill=INK)
    paste(board,smooth,(16,y),LIGHT);paste(board,pixel,(162,y),LIGHT);paste(board,pixel,(308,y),DARK)
    d.text((465,y+30),sex.upper(),font=bold,fill=INK)
    d.text((465,y+68),'Canvas: 32 × 64',font=font,fill=INK)
    d.text((465,y+96),'Anchor: (16, 60)',font=font,fill=INK)
    d.text((465,y+132),'Visible body: '+str(report['outputs'][sex]['visible_body_height_px'])+' px',font=font,fill=INK)
    d.text((465,y+178),'Input: 256 × 512',font=font,fill=INK)
    d.text((465,y+205),'Exact 8× nearest',font=font,fill=INK)
board.save(ROOT/'review'/'structural-review.png')

native=Image.new('RGB',(260,117),LIGHT);d=ImageDraw.Draw(native)
for i,sex in enumerate(('male','female')):
    x=12+i*132;d.text((x,8),sex+' · native 1×',font=small,fill=INK)
    paste(native,pixels[sex],(x,30),LIGHT);paste(native,pixels[sex],(x+44,30),DARK)
d.text((12,101),'32 × 64 pixels each · true transparent guides',font=small,fill=INK)
native.save(ROOT/'review'/'native-size.png')

grid=Image.new('RGB',(566,240),LIGHT);d=ImageDraw.Draw(grid)
d.text((16,10),'SELECTED GRID / 32 × 32 PER CELL',font=bold,fill=INK)
for i,sex in enumerate(('male','female')):
    x=24+i*116;y=70
    paste(grid,pixels[sex].resize((64,128),Image.Resampling.NEAREST),(x,y),LIGHT)
    d.rectangle((x,y,x+63,y+127),outline='#788b85');d.line((x,y+64,x+63,y+64),fill='#adb8b0')
    d.text((x,y-21),sex+' · 1×2',font=small,fill=INK)
    d.text((x,y+138),'preview ×2',font=small,fill=INK)
x=286;y=134;d.rectangle((x,y,x+63,y+63),outline='#788b85')
d.text((280,72),'Small monster / inventory cell',font=font,fill=INK)
d.text((286,103),'1×1 = 32×32',font=font,fill=INK)
d.text((374,147),'Canvas guide only;',font=small,fill=INK)
d.text((374,168),'no monster generated.',font=small,fill=INK)
grid.save(ROOT/'review'/'grid-comparison.png')
(ROOT/'validation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
