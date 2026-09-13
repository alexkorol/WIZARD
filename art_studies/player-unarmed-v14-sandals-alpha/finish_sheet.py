"""Preserve Pixel Respecter's actual RGBA pixels; register all eight frames together."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,hashlib
R=Path(__file__).resolve().parent
for n in ('final','frames','review'): (R/n).mkdir(exist_ok=True)
src=R/'reconstructed/2x4-local-cutout_reconstructed.png';whole=Image.open(src);assert whole.mode=='RGBA'
entries=json.loads((R/'sheet-manifest.json').read_text())['layouts']['2x4']['frames'];cells=[]
for e in entries:
    c=e['column'];r=e['row'];box=(round(c*whole.width/4),round(r*whole.height/2),round((c+1)*whole.width/4),round((r+1)*whole.height/2));cell=whole.crop(box);b=cell.getbbox();assert b;cells.append((e,box,cell,b))
lowx=max(-b[0] for _,_,_,b in cells);highx=min(48-b[2] for _,_,_,b in cells)
lowy=max(-b[1] for _,_,_,b in cells);highy=min(96-b[3] for _,_,_,b in cells)
assert lowx<=highx and lowy<=highy,'Do not resize to force a fit'
dx=max(lowx,min(highx,round(24-np.mean([(b[0]+b[2])/2 for _,_,_,b in cells]))));dy=max(lowy,min(highy,91-max(b[3] for _,_,_,b in cells)))
sheet=Image.new('RGBA',(192,192));report={'alpha_origin':'Local neutral-background extraction after the raw RGB imagegen output failed true-alpha requirement','recovered_sheet_dimensions':list(whole.size),'final_sheet_dimensions':[192,192],'frame_dimensions':[48,96],'shared_integer_translation':[dx,dy],'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'frames':[]}
for e,box,cell,b in cells:
    frame=Image.new('RGBA',(48,96));frame.alpha_composite(cell,(dx,dy));a=np.array(cell);z=np.array(frame)
    assert np.count_nonzero(a[:,:,3])==np.count_nonzero(z[:,:,3])
    for y,x in zip(*np.nonzero(a[:,:,3])):assert frame.getpixel((int(x+dx),int(y+dy)))==cell.getpixel((int(x),int(y)))
    frame.save(R/'frames'/f"{e['sex']}-{e['direction']}-48x96.png");sheet.alpha_composite(frame,(e['column']*48,e['row']*96));report['frames'].append({**e,'source_box':box,'final_bbox':frame.getbbox(),'all_foreground_pixels_preserved':True})
sp=R/'final/2x4-local-alpha-sheet.png';sheet.save(sp);assert set(sheet.getchannel('A').getdata())=={0,255}
large=sheet.resize((576,576),Image.Resampling.NEAREST);large.save(R/'final/2x4-local-alpha-sheet-3x.png')
assert all(large.getpixel((x,y))==sheet.getpixel((x//3,y//3)) for y in range(576) for x in range(576))
report.update(final_sha256=hashlib.sha256(sp.read_bytes()).hexdigest(),alpha_values=[0,255],exact3x_verified=True)
BG='#e9e5dc';DARK='#232c31';font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',13);small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',11)
def preview(scale,name):
    w=192*scale;board=Image.new('RGB',(w*2+48,w+79),BG);d=ImageDraw.Draw(board)
    d.text((12,8),'OPEN SANDALS / SHOULDER CLOTH REMOVED',font=font,fill='#273330')
    for x,color in [(12,BG),(w+36,DARK)]:
        pix=sheet.resize((w,w),Image.Resampling.NEAREST);back=Image.new('RGBA',(w,w),color);back.alpha_composite(pix);board.paste(back.convert('RGB'),(x,34))
    d.text((12,w+47),f'{scale}x preview. Alpha is LOCALLY DERIVED; raw generation has no alpha channel.',font=small,fill='#273330')
    board.save(R/'review'/name)
preview(2,'kit-revision-2x.png');preview(1,'kit-revision-native.png')
(R/'final-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps({'translation':[dx,dy],'frame_bboxes':[r['final_bbox'] for r in report['frames']],'alpha_origin':report['alpha_origin']},indent=2))
