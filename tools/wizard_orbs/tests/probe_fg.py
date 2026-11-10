import numpy as np
from PIL import Image

base='/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets'
Nr=np.asarray(Image.open(f'{base}/normal_aligned.jpg').convert('RGB'),dtype=np.float32)/255.
Er=np.asarray(Image.open(f'{base}/empty_aligned.jpg').convert('RGB'),dtype=np.float32)/255.
H,W=Nr.shape[:2]  # 706,1254

def bilin(img,x,y):  # x,y in texel coords (float)
    x0=int(np.floor(x)); y0=int(np.floor(y))
    fx=x-x0; fy=y-y0
    x1=min(x0+1,W-1); y1=min(y0+1,H-1); x0=max(0,min(x0,W-1)); y0=max(0,min(y0,H-1))
    return (img[y0,x0]*(1-fx)*(1-fy)+img[y0,x1]*fx*(1-fy)+img[y1,x0]*(1-fx)*fy+img[y1,x1]*fx*fy)

def uv_to_texel(auv):  # art uv (y-up) -> texel coords (y-down array)
    return auv[0]*W, (1.0-auv[1])*H

def norm_edge_at(ax,ay):  # art px coords, y-down top-origin
    u=(ax+0.5)/1672; v=1-(ay+0.5)/941
    tx,ty=uv_to_texel((u,v))
    c=bilin(Nr,tx,ty)
    s=0.0
    for dx,dy in ((3,0),(-3,0),(0,3),(0,-3),(9,0),(-9,0),(0,9),(0,-9)):
        du=dx/1672; dv=-dy/941
        dtx,dty=uv_to_texel((u+du,v+dv))
        t=bilin(Nr,dtx,dty)
        s+=np.linalg.norm(t-c)
    return s*0.125

def eL_at(ax,ay):
    u=(ax+0.5)/1672; v=1-(ay+0.5)/941
    tx,ty=uv_to_texel((u,v))
    c=bilin(Er,tx,ty)
    return float(c[...,0]*0.299+c[...,1]*0.587+c[...,2]*0.114)

def ss(a,b,x):
    t=min(1,max(0,(x-a)/(b-a))); return t*t*(3-2*t)

# sample grid over right-orb upper-right quadrant
print('scanning...')
pts={'cheek':(1230,285),'hands':(1265,370),'braid':(1320,430),'arm':(1305,460),
     'openliquid':(1050,500),'glasstop':(1100,290)}
for k,(ax,ay) in pts.items():
    nd=norm_edge_at(ax,ay); el=eL_at(ax,ay)
    print(f'{k:11s} nd={nd:.4f} eL={el:.3f} fg={ss(0.008,0.020,nd)*ss(0.055,0.135,el):.2f}')

# full map at 2px step over face region for visualization
x0,x1,y0,y1=1150,1400,220,520
g=np.zeros(((y1-y0)//2,(x1-x0)//2))
for iy,ay in enumerate(range(y0,y1,2)):
    for ix,ax in enumerate(range(x0,x1,2)):
        nd=norm_edge_at(ax,ay)
        g[iy,ix]=ss(0.008,0.020,nd)*ss(0.055,0.135,eL_at(ax,ay))
Image.fromarray((np.stack([g*255,g*255,np.zeros_like(g)],-1)).astype(np.uint8)).save(
  '/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/tests/diag_fg_exact.png')
print('map saved', g.shape, 'mean over map:', g.mean().round(3))
