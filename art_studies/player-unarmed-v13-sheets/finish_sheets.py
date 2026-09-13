"""Key whole reconstructed sheets, split their shared grid, pad frames without scaling."""
from pathlib import Path
import sys,json,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ENGINE=Path('Z:/Code/Python/pixel-perfecter');sys.path.insert(0,str(ENGINE))
from pixel_perfecter.colors import make_border_connected_transparent,remove_background_speckles
R=Path(__file__).resolve().parent;M=json.loads((R/'sheet-manifest.json').read_text());D=json.loads((R/'grid-diagnostics.json').read_text())
for name in ('final','frames','review'): (R/name).mkdir(exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
report={'engine':ENGINE.as_posix(),'frame_dimensions':[48,96],'method':'One shared reconstruction per generated sheet, existing border-connected key tolerance24, regular sheet splits, one shared integer XY registration per layout, empty-margin adjustment only. No frame resizing or independent frame grid detection.','layouts':{},'engine_source_sha256':{p:sha(ENGINE/p) for p in ('pixel_perfecter/reconstructor.py','pixel_perfecter/grid.py','pixel_perfecter/mesh.py','pixel_perfecter/colors.py')}}
out={}
for layout,entry in M['layouts'].items():
    p=R/('candidates/1x4-grid10.png' if layout=='1x4' else f'reconstructed/{layout}_reconstructed.png')
    raw=np.array(Image.open(p).convert('RGB'));rgba,bg=make_border_connected_transparent(raw,tolerance=24);rgba,cleanup=remove_background_speckles(rgba,bg)
    rgba[rgba[:,:,3]==0,:3]=0;whole=Image.fromarray(rgba);whole.save(R/'final'/f'{layout}-recovered-sheet.png')
    cols=entry['columns'];rows=entry['rows'];cells=[]
    for frame in entry['frames']:
        c=frame['column'];r=frame['row'];box=(round(c*whole.width/cols),round(r*whole.height/rows),round((c+1)*whole.width/cols),round((r+1)*whole.height/rows))
        cell=whole.crop(box);b=cell.getbbox();assert b
        cells.append((frame,box,cell,b))
    min_dx=max(-b[0] for _,_,_,b in cells);max_dx=min(48-b[2] for _,_,_,b in cells)
    min_dy=max(-b[1] for _,_,_,b in cells);max_dy=min(96-b[3] for _,_,_,b in cells)
    assert min_dx<=max_dx and min_dy<=max_dy,(layout,'Foreground cannot fit shared48x96 frames without resizing')
    dx=max(min_dx,min(max_dx,round(24-np.mean([(b[0]+b[2])/2 for _,_,_,b in cells]))))
    dy=max(min_dy,min(max_dy,91-max(b[3] for _,_,_,b in cells)))
    sheet=Image.new('RGBA',(48*cols,96*rows));frame_reports=[]
    for frame,box,cell,b in cells:
        final=Image.new('RGBA',(48,96));final.alpha_composite(cell,(dx,dy))
        a=np.array(cell);z=np.array(final);assert np.count_nonzero(a[:,:,3])==np.count_nonzero(z[:,:,3])
        for y,x in zip(*np.nonzero(a[:,:,3])):assert final.getpixel((int(x+dx),int(y+dy)))==cell.getpixel((int(x),int(y)))
        fp=R/'frames'/f"{layout}-{frame['sex']}-{frame['direction']}.png";final.save(fp)
        sheet.alpha_composite(final,(frame['column']*48,frame['row']*96))
        frame_reports.append({**frame,'source_cell_box':box,'recovered_cell_dimensions':list(cell.size),'final_bbox':final.getbbox(),'foreground_pixels_preserved_exactly':True,'file':fp.relative_to(R).as_posix(),'sha256':sha(fp)})
    sp=R/'final'/f'{layout}-sheet.png';sheet.save(sp);out[layout]=sheet
    assert set(sheet.getchannel('A').getdata())=={0,255}
    enlarged=sheet.resize((sheet.width*3,sheet.height*3),Image.Resampling.NEAREST);enlarged.save(R/'final'/f'{layout}-sheet-3x.png')
    assert all(enlarged.getpixel((x,y))==sheet.getpixel((x//3,y//3)) for y in range(enlarged.height) for x in range(enlarged.width))
    report['layouts'][layout]={'generated_sha256':sha(R/'generated'/f'{layout}.png'),'structural_input_sha256':entry['input_sha256'],'selected_reconstruction':p.relative_to(R).as_posix(),'grid_selection':'Manual highest-scored autocorrelation candidate10px, offset(2,5), compared visually against8px and9px; auto3px rejected' if layout=='1x4' else 'Automatic whole-sheet grid; retained warning for visual review','recovered_sheet_dimensions':list(whole.size),'final_sheet_dimensions':list(sheet.size),'shared_frame_translation':[dx,dy],'background_color':list(bg),'speckle_cleanup':cleanup,'frames':frame_reports,'final_sha256':sha(sp),'exact3x_verified':True}
BG='#e9e5dc';DARK='#232c31';INK='#273330';font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',14);small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',11)
def paste(board,im,xy,color=DARK):
    b=Image.new('RGBA',im.size,color);b.alpha_composite(im);board.paste(b.convert('RGB'),xy)
board=Image.new('RGB',(630,700),BG);d=ImageDraw.Draw(board)
d.text((16,10),'SHEET TESTS / rows x columns / 48x96 per frame',font=font,fill=INK)
d.text((16,37),'1x4 / female / front, right, back, left / shown2x',font=small,fill=INK);paste(board,out['1x4'].resize((384,192),Image.Resampling.NEAREST),(16,58))
d.text((16,270),'2x2 / female / shown2x',font=small,fill=INK);d.text((228,270),'2x4 / male above female / shown2x',font=small,fill=INK)
paste(board,out['2x2'].resize((192,384),Image.Resampling.NEAREST),(16,292));paste(board,out['2x4'].resize((384,384),Image.Resampling.NEAREST),(228,292))
board.save(R/'review/sheet-comparison-2x.png')
native=Image.new('RGB',(590,238),BG);d=ImageDraw.Draw(native)
for layout,x in [('1x4',12),('2x2',220),('2x4',332)]:
    d.text((x,8),layout+' / native1x',font=small,fill=INK);paste(native,out[layout],(x,31))
native.save(R/'review/sheet-native.png')
for layout,x in [('1x4',12),('2x2',220),('2x4',332)]:paste(native,out[layout],(x,31),BG)
native.save(R/'review/sheet-native-light.png')
(R/'reconstruction.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:{'recovered':v['recovered_sheet_dimensions'],'final':v['final_sheet_dimensions'],'translation':v['shared_frame_translation']} for k,v in report['layouts'].items()},indent=2))
