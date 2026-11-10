#!/usr/bin/env python3
"""WIZARD-SURGE-039: derive the guardian-foreground channel for mask.png.

Diagnosis (see tools/wizard_orbs/tests/face-occlusion.test.mjs evidence):
no aligned plate encodes a SOLID portrait-in-front-of-glass mask inside the
orbs. The normal plate's high-frequency detail covers textured masses
(head/braid/hands) but drops below the glass' JPEG-noise floor on smooth
drapery/arms; pack G is partial; |art-empty| isolates liquid, not statue.

This script derives a foreground weight from the existing aligned plates,
cleans it morphologically, and stores it in the GREEN channel of mask.png
(R keeps the original orb-silhouette bytes; B=255). Lossless PNG -> the
shader reads a stable, GPU-independent mask.
"""
import numpy as np
from PIL import Image, ImageFilter

base='/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets'
ART=(1672,941)
up=lambda f,c: np.asarray(Image.open(f'{base}/{f}').convert(c).resize(ART,Image.BILINEAR),dtype=np.float32)/255.
Nr=up('normal_aligned.jpg','RGB'); Er=up('empty_aligned.jpg','RGB')
Ar=up('art.jpg','RGB'); M=np.asarray(Image.open(f'{base}/mask_fullres.png'),dtype=np.float32)/255.
H,W=M.shape

def boxmax(a,r):
    out=a.copy()
    for _ in range(r): out=np.maximum(out,np.roll(out,1,0)); out=np.maximum(out,np.roll(out,-1,0))
    o=out.copy()
    for _ in range(r): o=np.maximum(o,np.roll(o,1,1)); o=np.maximum(o,np.roll(o,-1,1))
    return o
def boxmin(a,r):
    out=a.copy()
    for _ in range(r): out=np.minimum(out,np.roll(out,1,0)); out=np.minimum(out,np.roll(out,-1,0))
    o=out.copy()
    for _ in range(r): o=np.minimum(o,np.roll(o,1,1)); o=np.minimum(o,np.roll(o,-1,1))
    return o
def ss(a,b,x):
    t=np.clip((x-a)/(b-a),0,1); return t*t*(3-2*t)

def luma(c): return c[...,0]*0.299+c[...,1]*0.587+c[...,2]*0.114

# --- 1) normal-detail edge field (center-vs-tap, two scales, take max pair) ---
nl=luma(Nr)
def offdiff(img,r):
    c=img[r:-r,r:-r]
    d=(np.abs(img[r:-r,r+r:]-c)+np.abs(img[r:-r,:-2*r]-c)
       +np.abs(img[2*r:,r:-r]-c)+np.abs(img[:-2*r,r:-r]-c))/4.
    out=np.zeros_like(img); out[r:-r,r:-r]=d; return out
E=ss(0.004,0.010,np.maximum(offdiff(nl,3),offdiff(nl,9)))     # textured statue edges

# --- 2) liquid field from |art-empty| (open liquid is far apart) ---
D=np.abs(Ar-Er).mean(-1)
LIQ=ss(28.,45.,D)

# --- 3) seed = edges; fill interiors near edges; recover smooth drapery ---
seed=(E>0.35)&(M>0.5)
solid=boxmin(boxmax(seed.astype(np.float32),9),7)>0.5          # close gaps <=~9px
drapery=(M>0.5)&(solid<0.5)&(LIQ<0.45)&(luma(Er)>0.075)&(boxmax(seed.astype(np.float32),13)>0.5)
fg=np.maximum(solid,drapery)

# --- 4) kill anything in open liquid, outside discs, or above rim ---
fg&=~(LIQ>0.55)
fg*=M>0.5
# radial guard: nothing beyond the sphere silhouette band
yy,xx=np.mgrid[0:H,0:W]
rrL=np.sqrt((xx-541.)**2+(H-1-yy-484.5)**2)/252.
rrR=np.sqrt((xx-1128.)**2+(H-1-yy-483.)**2)/252.
rr=np.minimum(rrL,rrR)
fg&=~(rr>1.01)

fimg=Image.fromarray((fg*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
fgs=np.asarray(fimg,dtype=np.float32)/255.

out=np.zeros((H,W,3),dtype=np.uint8)
out[...,0]=(M*255).astype(np.uint8)          # original silhouette, byte-identical intent
out[...,1]=(np.clip(fgs,0,1)*255).astype(np.uint8)
out[...,2]=255
Image.fromarray(out,'RGB').save(f'{base}/mask.png')            # 836x470 downsize below
Image.fromarray(out,'RGB').resize((836,470),Image.LANCZOS).save(f'{base}/mask.png')

# --- report + QA sheet ---
print('fg coverage inside discs:', round(float(((fgs>0.5)&(M>0.5)).sum()/ (M>0.5).sum()),4))
qa=Ar.copy()
overlay=qa.copy(); overlay[...,0]=overlay[...,0]*0.25+200*fgs; overlay[...,1]=overlay[...,1]*0.25+230*fgs*0.4
sheet=np.concatenate([qa,overlay],axis=1)
Image.fromarray((sheet*255).astype(np.uint8)).save('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/tests/diag_fg_derived.png')
print('QA sheet saved (left=art, right=fg overlay)')
