"""Recorded cutout/canvas normalization of the preserved imagegen originals."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from scipy import ndimage
import numpy as np,json,hashlib
R=Path(__file__).resolve().parent;(R/'normalized').mkdir(exist_ok=True)
V=json.loads((R/'validation.json').read_text());report={};out={}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for sex in ['male','female']:
    p=R/'generated'/f'{sex}-original.png';im=Image.open(p).convert('RGB');a=np.array(im).astype(np.int16)
    # The model returned an RGB neutral checkerboard despite the transparency request.
    # Identify only bright neutral pixels connected to the canvas boundary.
    neutral=((a.max(2)-a.min(2))<=20)&(a.min(2)>=120)
    seed=np.zeros(neutral.shape,dtype=bool);seed[0,:]=neutral[0,:];seed[-1,:]=neutral[-1,:];seed[:,0]=neutral[:,0];seed[:,-1]=neutral[:,-1]
    bg=ndimage.binary_propagation(seed,mask=neutral)
    fg=~bg;labels,n=ndimage.label(fg);counts=np.bincount(labels.ravel());counts[0]=0;fg=labels==counts.argmax()
    rgba=im.convert('RGBA');rgba.putalpha(Image.fromarray((fg*255).astype('uint8')))
    cut=R/'normalized'/f'{sex}-cutout-full.png';rgba.save(cut)
    bbox=rgba.getbbox();crop=rgba.crop(bbox)
    height=V['outputs'][sex]['visible_body_height_px'];width=round(crop.width*height/crop.height)
    assert width<32
    resized=crop.resize((width,height),Image.Resampling.BOX)
    resized.putalpha(resized.getchannel('A').point(lambda v:255 if v>=128 else 0))
    x=16-width//2;y=61-height;logical=Image.new('RGBA',(32,64));logical.alpha_composite(resized,(x,y))
    logical.putdata([p if p[3] else (0,0,0,0) for p in logical.getdata()])
    lp=R/'normalized'/f'{sex}-32x64.png';logical.save(lp)
    large=logical.resize((256,512),Image.Resampling.NEAREST);large.save(R/'normalized'/f'{sex}-8x.png')
    assert logical.size==(32,64) and set(logical.getchannel('A').getdata())=={0,255}
    assert all(large.getpixel((xx,yy))==logical.getpixel((xx//8,yy//8)) for yy in range(512) for xx in range(256))
    out[sex]=logical
    report[sex]={'source_file':str(p.relative_to(R)),'source_sha256':sha(p),'source_mode':'RGB','source_dimensions':list(im.size),'background':'baked neutral checkerboard; removed by boundary-connected neutral mask (max-min<=20,min>=120), keeping largest foreground component','cutout_bbox':list(bbox),'normalization':'alpha cutout cropped, aspect-preserving BOX resize to structural-guide body height, binary alpha at128; bottom y60 and centered x16; no palette limit','resized_body_dimensions':[width,height],'placement_xy':[x,y],'logical_file':str(lp.relative_to(R)),'logical_sha256':sha(lp),'logical_dimensions':[32,64],'alpha_values':[0,255],'enlargement_exact_8x_verified':True}
bg='#e9e5dc';dark='#232c31';ink='#273330';font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',14);small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',11)
def paste(canvas,im,xy,color=bg):
    b=Image.new('RGBA',im.size,color);b.alpha_composite(im);canvas.paste(b.convert('RGB'),xy)
board=Image.new('RGB',(630,366),bg);d=ImageDraw.Draw(board)
for i,sex in enumerate(['male','female']):
    x=16+i*308;d.text((x,12),sex.capitalize()+' · imagegen candidate',font=font,fill=ink)
    pix=out[sex].resize((128,256),Image.Resampling.NEAREST)
    paste(board,pix,(x,44));paste(board,pix,(x+144,44),dark)
    d.text((x,309),'32×64 · shown 4×',font=font,fill=ink)
d.text((16,340),'Female camera is more frontal than the structural guide; candidates remain under review.',font=small,fill=ink)
board.save(R/'review/generated-candidates-4x.png')
native=Image.new('RGB',(260,117),bg);d=ImageDraw.Draw(native)
for i,sex in enumerate(['male','female']):
    x=12+i*132;d.text((x,8),sex+' · native 1×',font=small,fill=ink);paste(native,out[sex],(x,30));paste(native,out[sex],(x+44,30),dark)
d.text((12,101),'Normalized 32×64 RGBA candidates',font=small,fill=ink);native.save(R/'review/generated-native-size.png')
(R/'normalization.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
