import numpy as np
from PIL import Image

base='/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets'
Nr=np.asarray(Image.open(f'{base}/normal_aligned.jpg').convert('RGB'),dtype=np.float32)/255.
H,W=Nr.shape[:2]
def bilin(img,x,y):
    x0=int(np.floor(x)); y0=int(np.floor(y)); fx=x-x0; fy=y-y0
    x1=min(x0+1,W-1); y1=min(y0+1,H-1); x0=max(0,x0); y0=max(0,y0)
    return (img[y0,x0]*(1-fx)*(1-fy)+img[y0,x1]*fx*(1-fy)+img[y1,x0]*(1-fx)*fy+img[y1,x1]*fx*fy)
def sample(ax,ay,dx,dy):
    u=(ax+0.5)/1672+(dx/1672); v=1-(ay+0.5)/941+(-dy/941)
    tx,ty=u*W,(1-v)*H
    return bilin(Nr,tx,ty)
import math
def fg_v2(ax,ay,R=16.0,nang=6,fine=3):
    c=sample(ax,ay,0,0)
    diffs=[]
    for k in range(nang):
        a=2*math.pi*k/nang
        t=sample(ax,ay,R*math.cos(a),R*math.sin(a))
        diffs.append(float(np.linalg.norm(t-c)))
    for dx,dy in ((fine,0),(-fine,0),(0,fine),(0,-fine)):
        diffs.append(float(np.linalg.norm(sample(ax,ay,dx,dy)-c)))
    diffs.sort(reverse=True)
    return diffs[0],diffs[1]

def ss(a,b,x):
    t=min(1,max(0,(x-a)/(b-a))); return t*t*(3-2*t)
pts={'cheek':(1230,285),'hands':(1265,370),'braid':(1320,430),'arm':(1305,460),
     'arm2':(1310,480),'openliquid':(1050,500),'openliquid2':(1100,430),
     'glasstop':(1100,290),'noise-floor':(1000,350)}
print(f'{"pt":13s} {"d1":>7s} {"d2":>7s} fg(second-largest)')
for k,(ax,ay) in pts.items():
    d1,d2=fg_v2(ax,ay)
    print(f'{k:13s} {d1:.4f} {d2:.4f}   {ss(0.010,0.025,d2):.2f}')
