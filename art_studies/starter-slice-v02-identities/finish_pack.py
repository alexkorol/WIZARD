"""Register recovered pixels, verify preservation, package exact-scale review assets."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,hashlib,shutil
R=Path(__file__).resolve().parent
for n in ('final','frames','review'): (R/n).mkdir(exist_ok=True)
manifest=json.loads((R/'sheet-manifest.json').read_text());report={'scope':'Village-defense prologue ONLY','status':'Revised individual human idle studies; not production animation or approved canon','alpha_origin':'Locally derived; all raw human generations and targeted edits failed true-alpha requests','layouts':{},'actors':{}}
for name,size in {'players':6,'villagers':6,'defense':6}.items():
 data=manifest[name];w,h=data['frame_size'];src=R/'candidates'/f'{name}-{size}.png';im=Image.open(src).convert('RGBA');cells=[]
 for e in data['entries']:
  c=e['column'];r=e['row'];box=(round(c*im.width/4),round(r*im.height/2),round((c+1)*im.width/4),round((r+1)*im.height/2));cell=im.crop(box);b=cell.getbbox();assert b;cells.append((e,box,cell,b))
 lowx=max(-b[0] for _,_,_,b in cells);highx=min(w-b[2] for _,_,_,b in cells);lowy=max(-b[1] for _,_,_,b in cells);highy=min(h-b[3] for _,_,_,b in cells)
 assert lowx<=highx and lowy<=highy,(name,'Cannot fit without losing pixels',lowx,highx,lowy,highy)
 dx=max(lowx,min(highx,round(w/2-np.mean([(b[0]+b[2])/2 for _,_,_,b in cells]))));dy=max(lowy,min(highy,h-5-max(b[3] for _,_,_,b in cells)))
 sheet=Image.new('RGBA',(w*4,h*2));entries=[]
 for e,box,cell,b in cells:
  # Whole-pixel frame registration; retain every recovered foreground pixel.
  dx=round((w-(b[2]-b[0]))/2)-b[0];dy=h-2-b[3]
  if b[1]+dy<2:dy=round((h-(b[3]-b[1]))/2)-b[1]
  f=Image.new('RGBA',(w,h));f.alpha_composite(cell,(dx,dy));a=np.array(cell);z=np.array(f);ys,xs=np.nonzero(a[:,:,3])
  assert len(ys)==np.count_nonzero(z[:,:,3]);assert np.array_equal(a[ys,xs],z[ys+dy,xs+dx])
  p=R/'frames'/f"{e['actor']}-{e['direction']}.png";f.save(p);sheet.alpha_composite(f,(e['column']*w,e['row']*h))
  entries.append({**e,'final_bbox':f.getbbox(),'source_crop':box,'integer_translation':[dx,dy],'foreground_pixels_preserved':True,'final_sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
  report['actors'][e['actor']]={'frame_size':[w,h],'directions':['front','right','back','left'],'source_blend':f"sources/{e['actor']}.blend",'kind':'starter player candidate' if name=='players' else 'villager candidate'}
 sheet.save(R/'final'/f'{name}-sheet.png');sheet.resize((sheet.width*3,sheet.height*3),Image.Resampling.NEAREST).save(R/'review'/f'{name}-sheet-3x.png')
 fit=json.loads((R/'reconstructed'/f'{name}-fit.json').read_text());chosen=next(c for c in fit['debug']['candidates'] if c['size']==size)
 report['layouts'][name]={'recovered_dimensions':im.size,'frame_size':[w,h],'registration':'Per-frame integer translation only, centered horizontally and bottom margin2 where possible','chosen_detector_candidate':chosen,'automatic_result_retained':f'reconstructed/{name}-auto.png','entries':entries}
 print(name,im.size,'shift',dx,dy,'bboxes',[e['final_bbox'] for e in entries])
old=R.parent/'starter-slice-v01'
prior=json.loads((old/'pack-verification.json').read_text())
for actor in ('pack-wolf','well-alpha'):
 for d in ('front','right','back','left'):shutil.copy2(old/'frames'/f'{actor}-{d}.png',R/'frames'/f'{actor}-{d}.png')
 report['actors'][actor]={**prior['actors'][actor],'source_study':'../starter-slice-v01','source_blend':f'../starter-slice-v01/sources/{actor}.blend','kind':'Unchanged monster candidate pixels from v01'}
shutil.copy2(old/'final/beasts-sheet.png',R/'final/beasts-sheet.png')
report['layouts']['beasts']={**prior['layouts']['beasts'],'reused_from':'../starter-slice-v01'}
order=['player-male','player-female','field-hand','scribe','scout','defender','pack-wolf','well-alpha']
titles=['Male player','Female player','Field hand','Village scribe','Village scout','Village defender','Pack wolf','Well alpha candidate']
for scale in (1,2):
 cw=110*scale;ch=126*scale;board=Image.new('RGB',(cw*4,ch*2+36),(233,229,220));draw=ImageDraw.Draw(board)
 font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',11 if scale==1 else 14)
 for i,(actor,title) in enumerate(zip(order,titles)):
  x=(i%4)*cw;y=(i//4)*ch;color=(35,44,49) if i%2 else (233,229,220);draw.rectangle((x,y,x+cw-1,y+ch-1),fill=color)
  im=Image.open(R/'frames'/f'{actor}-front.png');im=im.resize((im.width*scale,im.height*scale),Image.Resampling.NEAREST);board.paste(im,(x+(cw-im.width)//2,y+8*scale),im)
  draw.text((x+5,y+106*scale),title,font=font,fill='white' if i%2 else '#26312c')
 draw.text((8,ch*2+5),f'Prologue cast candidates | {scale}x actual pixels | locally derived alpha',font=font,fill='#26312c');board.save(R/'review'/f'prologue-cast-{scale}x.png')
for name in ['players','villagers','defense','beasts']:
 im=Image.open(R/'final'/f'{name}-sheet.png');board=Image.new('RGB',(im.width*2+12,im.height+24),'#e9e5dc');draw=ImageDraw.Draw(board)
 for x,color in [(0,'#e9e5dc'),(im.width+12,'#232c31')]:
  bg=Image.new('RGBA',im.size,color);bg.alpha_composite(im);board.paste(bg.convert('RGB'),(x,20))
 draw.text((4,3),name+' | native pixels / light + dark',fill='#26312c');board.save(R/'review'/f'{name}-native-alpha.png')
for p in (R/'frames').glob('*.png'):
 im=Image.open(p);a=np.array(im);assert im.mode=='RGBA' and set(np.unique(a[:,:,3]))=={0,255};assert not np.any(a[a[:,:,3]==0,:3])
report['frame_count']=len(list((R/'frames').glob('*.png')));report['final_alpha_values']=[0,255]
(R/'pack-verification.json').write_text(json.dumps(report,indent=2))
