from pathlib import Path
import sys,json
from PIL import Image
ENGINE=Path('Z:/Code/Python/pixel-perfecter');sys.path.insert(0,str(ENGINE))
from pixel_perfecter.reconstructor import PixelArtReconstructor
from pixel_perfecter.colors import make_border_connected_transparent
R=Path(__file__).resolve().parent;(R/'candidates').mkdir(exist_ok=True)
report={}
for layout in ('1x4','2x2','2x4'):
    rec=PixelArtReconstructor(str(R/'generated'/f'{layout}.png'));rec.run()
    report[layout]={'fit':rec.last_fit_debug,'metrics':rec.last_metrics}
    print(layout,json.dumps(rec.last_fit_debug['candidates'][:12]))
    if layout=='1x4':
        for size in (8,9,10):
            candidate=next((c for c in rec.last_fit_debug['candidates'] if c['size']==size),None)
            if not candidate:continue
            rec.cell_size=size;rec.offset=tuple(candidate['offset'])
            arr=rec._empirical_pixel_reconstruction();arr,bg=make_border_connected_transparent(arr,tolerance=24)
            im=Image.fromarray(arr);im.save(R/'candidates'/f'1x4-grid{size}.png')
            im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST).save(R/'candidates'/f'1x4-grid{size}-3x.png')
(R/'grid-diagnostics.json').write_text(json.dumps(report,indent=2,default=lambda x:x.tolist() if hasattr(x,'tolist') else str(x)))
