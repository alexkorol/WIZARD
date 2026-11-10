import numpy as np
from PIL import Image

base='/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets'
ld=lambda f: np.asarray(Image.open(f'{base}/{f}').convert('RGB').resize((1672,941),Image.BILINEAR),dtype=np.float32)/255.
N=ld('normal_aligned.jpg'); E=ld('empty_aligned.jpg')
def luma(c): return c[...,0]*0.299+c[...,1]*0.587+c[...,2]*0.114
eL=luma(E)

def offdiff(img,r):
    # mean abs channel diff, center vs 4 axis taps at radius r (GLSL-replica)
    c=img[r:-r,r:-r]
    d=(np.abs(img[r:-r,r+r:]-c).mean(-1)+np.abs(img[r:-r,:-2*r]-c).mean(-1)
       +np.abs(img[2*r:,r:-r]-c).mean(-1)+np.abs(img[:-2*r,r:-r]-c).mean(-1))/4.
    out=np.zeros_like(img[...,0]); out[r:-r,r:-r]=d; return out

nd3=offdiff(N,3); nd9=offdiff(N,9)
def ss(a,b,x):
    t=np.clip((x-a)/(b-a),0,1); return t*t*(3-2*t)

# candidate fg maps
fgA = ss(0.004,0.012,nd3)
fgB = ss(0.004,0.012,nd9)
fgC = np.maximum(fgA,fgB)*ss(0.10,0.18,eL)
fgD = np.maximum(fgA,fgB)

# ground-truth tight boxes (from annotated grid): statue-in-disc vs open areas
FG={'hands':(1228,1305,338,408),'cheek':(1198,1262,250,318),'braid':(1292,1350,395,472),'arm':(1275,1345,415,500)}
BG={'glasstop':(1020,1180,255,330),'glassL':(935,1035,420,520),'liquid':(1000,1120,470,600),'glassR':(1150,1260,200,235)}
def rep(f,name):
    print(name, ' '.join(f'{k}={f[y0:y1,x0:x1].mean():.2f}' for k,(x0,x1,y0,y1) in {**FG,**BG}.items()))
for f,n in [(fgA,'fgA nd3'),(fgB,'fgB nd9'),(fgC,'fgC nd*eL'),(fgD,'fgD max(nd)')]: rep(f,n)

# visualize: art | empty | fgD | fgC  over right-orb crop
A=ld('art.jpg')
box=(1100,180,1420,520)
def sc(x): return (np.clip(x,0,1)[box[1]:box[3],box[0]:box[2]]*255).astype(np.uint8)
rows=[np.stack([sc(A[...,i]) for i in range(3)],-1),
      np.stack([sc(E[...,i]) for i in range(3)],-1)]
for f in (fgD,fgC):
    g=sc(f); rows.append(np.stack([g,g,np.zeros_like(g)],-1))
sheet=np.concatenate(rows,axis=0)
Image.fromarray(sheet.astype(np.uint8)).save('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/tests/diag_fg.png')
print('saved diag_fg.png')
