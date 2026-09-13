from pathlib import Path
import sys,json
from PIL import Image,ImageDraw
sys.path.insert(0,'Z:/Code/Python/pixel-perfecter')
from pixel_perfecter.reconstructor import PixelArtReconstructor
R=Path(__file__).resolve().parent;(R/'candidates').mkdir(exist_ok=True)
for name,sizes in {'villagers':[6,7,8],'defense':[6,7,8],'beasts':[4,5,6]}.items():
 rec=PixelArtReconstructor(str(R/'locally-derived'/f'{name}.png'))
 # Reuse actual detector table, never invent a grid to force a frame size.
 rec._ensure_image_loaded();fit=json.loads((R/'reconstructed'/f'{name}-fit.json').read_text())
 previews=[]
 for size in sizes:
  c=next(c for c in fit['debug']['candidates'] if c['size']==size);rec.cell_size=size;rec.offset=tuple(c['offset'])
  a=rec._empirical_pixel_reconstruction();im=Image.fromarray(a);im.save(R/'candidates'/f'{name}-{size}.png')
  im=im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST);previews.append((size,im))
 board=Image.new('RGB',(max(i.width for _,i in previews)+20,sum(i.height+26 for _,i in previews)), '#283036');d=ImageDraw.Draw(board);y=0
 for size,im in previews:d.text((5,y+4),f'{name}: detected {size}px candidate, 2x',fill='white');board.paste(im,(10,y+22),im);y+=im.height+26
 board.save(R/'review'/f'{name}-grid-candidates.png')
