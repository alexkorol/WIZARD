"""Re-register trial frames around the tunic's torso rather than sheet cell centers.

This is whole-pixel translation only. It cannot repair scale drift in generation.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parent

def torso_x(im):
    a=np.array(im);box=im.getbbox();x0,y0,x1,y1=box
    rgb=a[:,:,:3].astype(float);r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
    yy,xx=np.indices(a.shape[:2]);height=y1-y0
    # Material selector, not an alpha mask: sample the off-white torso while
    # excluding warm skin/hair, hands and the swinging lower hem.
    linen=(a[:,:,3]>0)&(r>85)&(g>r*.80)&(b>r*.63)
    linen&=(yy>=y0+height*.30)&(yy<y0+height*.48)
    linen&=(xx>x0+(x1-x0)*.15)&(xx<x1-(x1-x0)*.15)
    if linen.sum()<3: return round((x0+x1)/2), 'bbox-fallback'
    return int(round(np.median(xx[linen]))), 'linen-torso'

if __name__=='__main__':
    manifest=json.loads((R/'manifest-tuned.json').read_text())
    records=[]
    for key,clip in manifest['clips'].items():
        if len(clip['frames'])<2:continue
        items=[]
        for f in clip['frames']:
            im=Image.open(R/f['src']).convert('RGBA');root,method=torso_x(im)
            box=im.getbbox();items.append((f,im,root,method,box))
        # One canvas and one anchor for every frame in a clip, preserving the
        # row's authored vertical motion. Root translation removes x drift.
        half=max(max(root-box[0],box[2]-root) for _,_,root,_,box in items)+2
        width=max(48,half*2);height=max(f['height'] for f,_,_,_,_ in items)
        for index,(f,im,root,method,box) in enumerate(items):
            dest=Image.new('RGBA',(width,height));dx=width//2-root;dy=height-f['height']
            dest.alpha_composite(im.crop(box),(box[0]+dx,box[1]+dy))
            assert sum(im.getchannel('A').histogram()[1:])==sum(dest.getchannel('A').histogram()[1:])
            dest.save(R/f['src'])
            record={'clip':key,'frame':index,'source_root_x':root,'method':method,'translation':[dx,dy],
                    'registered_root_x':root+dx,'size':[width,height], 'old_anchor':f['anchor']}
            records.append(record)
            f.update(width=width,height=height,anchor=[width//2,height-2],torso_root=[root+dx,round(box[1]+(box[3]-box[1])*.4)+dy])
        clip['note'] += ' Torso registration is applied; all four frame canvases and ground anchors match.'
    (R/'manifest-tuned.json').write_text(json.dumps(manifest,indent=2))
    (R/'tuning'/'registration.json').write_text(json.dumps(records,indent=2))
    groups={k:[v for v in records if v['clip']==k] for k in sorted({v['clip'] for v in records})}
    board=Image.new('RGB',(720,len(groups)*230),'#30382f');d=ImageDraw.Draw(board)
    for row,(key,group) in enumerate(groups.items()):
        d.text((5,row*230+4),key,fill='white')
        for col,record in enumerate(group):
            f=manifest['clips'][key]['frames'][col];im=Image.open(R/f['src']);x=col*180+(180-im.width)//2;y=row*230+25
            board.paste(im,(x,y),im);rx=x+f['torso_root'][0];ry=y+f['torso_root'][1]
            d.line((rx-4,ry,rx+4,ry),fill='#72d8d0');d.line((rx,ry-4,rx,ry+4),fill='#72d8d0')
            d.text((col*180+4,row*230+211),f"{col+1} shift {record['translation'][0]:+} px",fill='white')
    board.save(R/'tuning'/'registration-contact.png')
    print('Registered',len(records),'animation frames without resizing.')
