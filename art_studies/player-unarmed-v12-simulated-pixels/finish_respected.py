"""Finish existing Pixel Respecter CLI outputs; never resize recovered pixels."""
from pathlib import Path
import sys,json,csv,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ENGINE=Path('Z:/Code/Python/pixel-perfecter');sys.path.insert(0,str(ENGINE))
from pixel_perfecter.colors import make_border_connected_transparent,remove_background_speckles
R=Path(__file__).resolve().parent
for name in ('final','review'): (R/name).mkdir(exist_ok=True)
rows={r['image'].split('-')[0]:r for r in csv.DictReader((R/'reconstructed/metrics.csv').open())}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
report={'engine_path':ENGINE.as_posix(),'engine_base_commit':'cf7786cb438ad51be5dfc08d963c2a6edcfd72f7','engine_has_preexisting_uncommitted_changes':True,'engine_modified_by_this_study':False,'processing':'Existing Pixel Respecter CLI auto grid reconstruction; existing adaptive border-connected matte removal; integer translation and empty-margin adjustment only. NO BOX, bilinear, Lanczos or sprite resizing. No requested palette reduction.','engine_source_sha256':{p:sha(ENGINE/p) for p in ['pixel_perfecter/reconstructor.py','pixel_perfecter/colors.py','pixel_perfecter/grid.py','pixel_perfecter/mesh.py','pixel_perfecter/cli.py']},'outputs':{}}
out={}
font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',13);small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',11)
BG='#e9e5dc';DARK='#232c31';INK='#273330'
def paste(canvas,im,xy,bg=BG):
    back=Image.new('RGBA',im.size,bg);back.alpha_composite(im);canvas.paste(back.convert('RGB'),xy)
for sex in ('male','female'):
    source=R/'generated'/f'{sex}-original.png';rp=R/'reconstructed'/f'{sex}-original_reconstructed.png'
    # Restore RGB matte for the adaptive key rather than inheriting exact-color CLI key holes.
    raw=np.array(Image.open(rp).convert('RGB'));rgba,bg=make_border_connected_transparent(raw,tolerance=24)
    rgba,cleanup=remove_background_speckles(rgba,bg)
    rgba[rgba[:,:,3]==0,:3]=0;recovered=Image.fromarray(rgba);recovered.save(R/'final'/f'{sex}-recovered.png')
    bbox=recovered.getbbox();assert bbox
    dx=24-(bbox[0]+bbox[2])//2;dy=91-bbox[3]
    assert bbox[0]+dx>=0 and bbox[2]+dx<=48 and bbox[1]+dy>=0 and bbox[3]+dy<=96
    frame=Image.new('RGBA',(48,96));frame.alpha_composite(recovered,(dx,dy))
    assert np.count_nonzero(np.array(frame)[:,:,3])==np.count_nonzero(rgba[:,:,3])
    for yy,xx in zip(*np.nonzero(rgba[:,:,3])):
        assert frame.getpixel((int(xx+dx),int(yy+dy)))==recovered.getpixel((int(xx),int(yy)))
    fp=R/'final'/f'{sex}-48x96.png';frame.save(fp)
    large=frame.resize((384,768),Image.Resampling.NEAREST);large.save(R/'final'/f'{sex}-8x.png')
    assert set(frame.getchannel('A').getdata())=={0,255}
    assert all(large.getpixel((x,y))==frame.getpixel((x//8,y//8)) for y in range(768) for x in range(384))
    out[sex]=frame
    report['outputs'][sex]={'source_sha256':sha(source),'cli_output_sha256':sha(rp),'detected_grid':rows[sex],'recovered_canvas':list(recovered.size),'recovered_bbox':list(bbox),'border_color':list(bg),'speckle_cleanup':cleanup,'integer_translation_xy':[dx,dy],'final_canvas':[48,96],'final_bbox':list(frame.getbbox()),'all_foreground_pixels_preserved_exactly':True,'source_alpha_mode':Image.open(source).mode,'final_alpha_values':[0,255],'final_file':fp.relative_to(R).as_posix(),'final_sha256':sha(fp),'exact8x_verified':True}
    # Diagnostic shows the generated source and exact recovered enlargement at matching approximate scale.
    original=Image.open(source).convert('RGBA');preview=Image.new('RGB',(810,835),BG);draw=ImageDraw.Draw(preview)
    draw.text((12,10),sex.upper()+' / generated simulated pixels',font=font,fill=INK)
    draw.text((414,10),'Pixel Respecter / recovered pixels x8',font=font,fill=INK)
    # Left is a DISPLAY thumbnail only; never an input to reconstruction.
    original.thumbnail((384,768),Image.Resampling.NEAREST);paste(preview,original,(12,40))
    paste(preview,large,(414,40),DARK)
    draw.text((12,811),'Left: source preview only. Right: exact nearest enlargement of recovered48x96 frame.',font=small,fill=INK)
    preview.save(R/'review'/f'{sex}-source-versus-respected.png')
board=Image.new('RGB',(660,361),BG);d=ImageDraw.Draw(board)
for i,sex in enumerate(('male','female')):
    x=12+i*330;d.text((x,9),sex.capitalize()+' / Pixel Respecter / 48x96',font=font,fill=INK)
    p=out[sex].resize((144,288),Image.Resampling.NEAREST);paste(board,p,(x,35));paste(board,p,(x+155,35),DARK)
d.text((12,339),'3x preview. Recovered pixel colors preserved; only empty margins adjusted to fit48x96.',font=small,fill=INK)
board.save(R/'review/respected-3x.png')
native=Image.new('RGB',(310,147),BG);d=ImageDraw.Draw(native)
for i,sex in enumerate(('male','female')):
    x=12+i*155;d.text((x,7),sex+' / native1x',font=small,fill=INK);paste(native,out[sex],(x,29));paste(native,out[sex],(x+60,29),DARK)
d.text((12,130),'Actual48x96 RGBA frames; reconstructed, not resized.',font=small,fill=INK);native.save(R/'review/respected-native.png')
(R/'reconstruction.json').write_text(json.dumps(report,indent=2));print(json.dumps(report['outputs'],indent=2))
