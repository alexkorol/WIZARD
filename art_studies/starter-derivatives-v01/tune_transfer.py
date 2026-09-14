"""Compare cell transfer policies on the SAME detected Pixel Respecter grid.

No outline synthesis, sharpening, global palette replacement or image resize.
Every nontransparent output RGB is an actual visible sample from its source cell.
"""
from pathlib import Path
import sys, json
import numpy as np
from PIL import Image
from scipy.ndimage import binary_erosion
sys.path.insert(0, 'Z:/Code/Python/pixel-perfecter')
from pixel_perfecter.reconstructor import PixelArtReconstructor

R = Path(__file__).resolve().parent

def transfer(source, xs, ys):
    out = np.zeros((len(ys)-1,len(xs)-1,4),np.uint8)
    for y,(y0,y1) in enumerate(zip(ys,ys[1:])):
        for x,(x0,x1) in enumerate(zip(xs,xs[1:])):
            cell=source[y0:y1,x0:x1]
            visible=cell[:,:,3]>=128
            # Count the entire cell, including its boundary. Ties stay opaque.
            if not visible.any() or visible.mean()<.5: continue
            pixels=cell[:,:,:3][visible]
            # Local color clusters group only small generation noise. Pick the
            # dominant cluster without discarding the cell's boundary samples.
            bins=pixels.astype(np.int32)//16
            codes=bins[:,0]*256+bins[:,1]*16+bins[:,2]
            chosen=pixels[codes==np.bincount(codes).argmax()]
            median=np.median(chosen.astype(float),axis=0)
            color=chosen[np.abs(chosen.astype(float)-median).sum(axis=1).argmin()]
            out[y,x]=[*color,255]
    return out

def expand(image,xs,ys,shape):
    out=np.zeros(shape,np.uint8)
    for y,(y0,y1) in enumerate(zip(ys,ys[1:])):
        for x,(x0,x1) in enumerate(zip(xs,xs[1:])):out[y0:y1,x0:x1]=image[y,x]
    return out

def metrics(source,recovered):
    a=source[:,:,3]>=128;b=recovered[:,:,3]>=128
    both=a&b;edge=a&~binary_erosion(a,iterations=2)
    err=np.abs(source[:,:,:3].astype(float)-recovered[:,:,:3]).mean(axis=2)
    return {'alpha_iou':float((a&b).sum()/max(1,(a|b).sum())),
            'lost_source_coverage':float((a&~b).sum()/max(1,a.sum())),
            'extra_coverage':float((b&~a).sum()/max(1,a.sum())),
            'visible_rgb_mae':float(err[both].mean()),
            'boundary_rgb_mae':float(err[edge&b].mean()),
            'boundary_retained':float((edge&b).sum()/max(1,edge.sum()))}

if __name__=='__main__':
    (R/'tuning').mkdir(exist_ok=True)
    for name in sys.argv[1:] or ['unarmed','male-sprint','female-sprint','weapons','diagonals','male-walk','female-walk','focused-walk']:
        source=np.array(Image.open(R/'inputs'/f'{name}.png').convert('RGBA'))
        rec=PixelArtReconstructor(image=source);old=rec.run()
        if rec.mesh_lines is not None:
            xs,ys=[list(map(int,v)) for v in rec.mesh_lines]
        else:
            s=rec.cell_size;ox,oy=rec.offset
            xs=list(range(ox,source.shape[1]+1,s));ys=list(range(oy,source.shape[0]+1,s))
        assert old.shape[:2]==(len(ys)-1,len(xs)-1)
        tuned=transfer(source,xs,ys)
        Image.fromarray(tuned).save(R/'reconstructed'/f'{name}-tuned.png')
        old_rt=expand(old,xs,ys,source.shape);new_rt=expand(tuned,xs,ys,source.shape)
        report={'grid':{'size':rec.cell_size,'kind':'mesh' if rec.mesh_lines is not None else 'rigid','x':xs,'y':ys},'before':metrics(source,old_rt),'tuned':metrics(source,new_rt),'every_output_rgb_from_own_source_cell':True}
        (R/'tuning'/f'{name}-transfer.json').write_text(json.dumps(report,indent=2))
        # Source-size round trips allow direct inspection without rescaling.
        for suffix,a in [('source',source),('before',old_rt),('tuned',new_rt)]:Image.fromarray(a).save(R/'tuning'/f'{name}-{suffix}.png')
        print(name,json.dumps({k:v for k,v in report.items() if k!='grid'}),flush=True)
