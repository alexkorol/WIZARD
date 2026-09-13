"""Deterministic background/canvas normalization; preserve imagegen originals."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from scipy import ndimage
import numpy as np,json,hashlib
R=Path(__file__).resolve().parent;V=json.loads((R/'validation.json').read_text());report={};out={}
W,H=V['logical_canvas'];AX,AY=V['anchor']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for sex in ('male','female'):
    p=R/'generated'/f'{sex}-original.png';source=Image.open(p);im=source.convert('RGB');a=np.array(im).astype(np.int16)
    if source.mode=='RGBA' and source.getchannel('A').getextrema()[0]<255:
        rgba=source.copy();method='Preserved actual generated alpha'
    else:
        neutral=((a.max(2)-a.min(2))<=22)&(a.min(2)>=75)
        seed=np.zeros(neutral.shape,dtype=bool);seed[0,:]=neutral[0,:];seed[-1,:]=neutral[-1,:];seed[:,0]=neutral[:,0];seed[:,-1]=neutral[:,-1]
        bg=ndimage.binary_propagation(seed,mask=neutral)
        labels,n=ndimage.label(~bg);counts=np.bincount(labels.ravel());counts[0]=0;fg=labels==counts.argmax()
        rgba=im.convert('RGBA');rgba.putalpha(Image.fromarray((fg*255).astype('uint8')))
        method='RGB painted checkerboard removed: boundary-connected neutral pixels (channel range<=22, minimum>=75); retain largest foreground component'
    rgba.save(R/'normalized'/f'{sex}-cutout-full.png');bbox=rgba.getbbox();crop=rgba.crop(bbox)
    height=V['outputs'][sex]['visible_body_height_px'];width=round(crop.width*height/crop.height);assert width<W
    resized=crop.resize((width,height),Image.Resampling.BOX);resized.putalpha(resized.getchannel('A').point(lambda v:255 if v>=128 else 0))
    x=AX-width//2;y=AY+1-height;logical=Image.new('RGBA',(W,H));logical.alpha_composite(resized,(x,y));logical.putdata([p if p[3] else (0,0,0,0) for p in logical.getdata()])
    lp=R/'normalized'/f'{sex}-{W}x{H}.png';logical.save(lp);large=logical.resize((W*8,H*8),Image.Resampling.NEAREST);large.save(R/'normalized'/f'{sex}-8x.png')
    assert set(logical.getchannel('A').getdata())=={0,255}
    assert all(large.getpixel((xx,yy))==logical.getpixel((xx//8,yy//8)) for yy in range(H*8) for xx in range(W*8))
    out[sex]=logical
    report[sex]={'source_mode':source.mode,'source_dimensions':list(source.size),'source_sha256':sha(p),'alpha_processing':method,'cutout_bbox':list(bbox),'normalization':'Aspect-preserving BOX resize to guide body height; alpha threshold128; common anchor; no palette reduction','body_dimensions':[width,height],'placement_xy':[x,y],'logical_file':str(lp.relative_to(R)),'logical_dimensions':[W,H],'logical_sha256':sha(lp),'alpha_values':[0,255],'integer8x_verified':True}
bg='#e9e5dc';dark='#232c31';ink='#273330';font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',14);small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',11)
def paste(canvas,im,xy,color=bg):
    b=Image.new('RGBA',im.size,color);b.alpha_composite(im);canvas.paste(b.convert('RGB'),xy)
board=Image.new('RGB',(670,372),bg);d=ImageDraw.Draw(board)
for i,sex in enumerate(('male','female')):
    x=16+i*330;d.text((x,12),sex.capitalize()+' / 48x96 trial',font=font,fill=ink)
    pix=out[sex].resize((144,288),Image.Resampling.NEAREST);paste(board,pix,(x,42));paste(board,pix,(x+154,42),dark)
d.text((16,346),'Shown 3x nearest neighbour. Individual PNGs have true alpha; preview backgrounds are solid.',font=small,fill=ink)
board.save(R/'review/generated-candidates-3x.png')
native=Image.new('RGB',(310,148),bg);d=ImageDraw.Draw(native)
for i,sex in enumerate(('male','female')):
    x=12+i*155;d.text((x,7),sex+' / native 1x',font=small,fill=ink);paste(native,out[sex],(x,29));paste(native,out[sex],(x+60,29),dark)
d.text((12,130),'48x96 RGBA; no painted checkerboard in final files',font=small,fill=ink);native.save(R/'review/generated-native-size.png')
(R/'normalization.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
