from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parent;old=R.parent/'player-unarmed-v05-female'
bg='#e9e5dc';ink='#273330';font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',14)
def paste(out,im,xy):
    b=Image.new('RGBA',im.size,bg);b.alpha_composite(im);out.paste(b.convert('RGB'),xy)
out=Image.new('RGB',(600,356),bg);d=ImageDraw.Draw(out)
for i,(root,label) in enumerate([(old,'Previous'),(R,'Revised')]):
    x=16+i*298;d.text((x,12),label,font=font,fill=ink)
    smooth=Image.open(root/'renders/female-structural-inspection.png').convert('RGBA').resize((128,256),Image.Resampling.LANCZOS)
    pix=Image.open(root/'guides/female-logical-guide.png').convert('RGBA')
    paste(out,smooth,(x,42));paste(out,pix.resize((128,256),Image.Resampling.NEAREST),(x+140,42))
    d.text((x,309),'Blender',font=font,fill=ink);d.text((x+140,309),'32×64 · shown 4×',font=font,fill=ink)
out.save(R/'review/female-before-after.png')
out=Image.new('RGB',(768,422),bg);d=ImageDraw.Draw(out)
for i,name in enumerate(['side','opposite','top']):
    d.text((i*256+12,10),name,font=font,fill=ink)
    paste(out,Image.open(R/f'renders/female-inspect-{name}.png').convert('RGBA'),(i*256,34))
out.save(R/'review/multi-angle-inspection.png')
