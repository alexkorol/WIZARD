from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
p = ROOT / 'references-local'
font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 15)
small = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 12)
board = Image.new('RGB', (900, 390), '#e7e3d9')
d = ImageDraw.Draw(board)
d.text((18, 12), 'PROPOSED REFERENCES — none selected yet', fill='#252d2c', font=font)
# Exact unscaled source box; three 75px-tall sprites retain original pixels.
crop = Image.open(p/'amazon-light.gif').convert('RGB').crop((7, 14, 219, 92))
crop.save(p/'amazon-style-crop.png')
board.paste(crop.resize((636, 234), Image.Resampling.NEAREST), (18, 61))
for name, x, w in [('tarkhan-ucl.jpg', 673, 98), ('pinterest-tunic.jpg', 784, 98)]:
    im = Image.open(p/name).convert('RGB')
    im.thumbnail((w, 234))
    board.paste(im, (x, 61))
d.text((18, 312), 'STYLE · Diablo II Amazon (Light) · Spriters Resource', fill='#252d2c', font=font)
d.text((18, 338), 'Propose material shading + pixel clusters only; pose, clothing and camera stay separate.', fill='#394341', font=small)
d.text((670, 312), 'CONSTRUCTION · linen', fill='#252d2c', font=font)
d.text((670, 338), 'UCL photo + Pinterest discovery', fill='#394341', font=small)
d.text((18, 368), 'Structure: editable adult figures from your brief. Scale: provisional; current intended player reference unverified.', fill='#394341', font=small)
board.save(p/'reference-proposals.png')
