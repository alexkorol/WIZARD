import numpy as np
from PIL import Image

A = np.asarray(Image.open('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets/art.jpg'), dtype=np.float32)
E = np.asarray(Image.open('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets/empty_aligned.jpg'), dtype=np.float32)
P = np.asarray(Image.open('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets/pack_aligned.jpg'), dtype=np.float32)
M = np.asarray(Image.open('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets/mask_fullres.png'), dtype=np.float32)

print('shapes', A.shape, E.shape, P.shape, M.shape)
# upscale empty/pack to full-res frame for joint analysis
Ef = np.asarray(Image.open('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets/empty_aligned.jpg').resize((1672,941), Image.BILINEAR), dtype=np.float32)
Pf = np.asarray(Image.open('/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-orb-face/tools/wizard_orbs/src/assets/pack_aligned.jpg').resize((1672,941), Image.BILINEAR), dtype=np.float32)

# PIL coords: x right, y DOWN from top. Right orb center art-y-up (1128,483) -> top (1128, 941-483=458)
cx, cy, r = 1128, 458, 252

def patch(cx, cy, w=24):
    return slice(cy-w//2, cy+w//2+1), slice(cx-w//2, cx+w//2+1)

pts = {
 'face(cheek/hair over orb)': (1305, 300),
 'hands over orb':            (1255, 430),
 'braid over orb':            (1330, 520),
 'glass above fill (top)':    (1128, 260),
 'pure liquid mid-left':      (1000, 470),
 'pure liquid low':           (1090, 620),
 'outside disc (shoulder)':   (1420, 380),
}
print(f"{'point':28s} {'art RGB':>15s} {'empty RGB':>15s} {'|a-e|':>6s} {'packR':>6s} {'packG':>6s}")
for k,(x,y) in pts.items():
    s = patch(x,y)
    a = A[s].reshape(-1,3).mean(0); e = Ef[s].reshape(-1,3).mean(0)
    d = np.abs(A[s]-Ef[s]).mean()
    pr = Pf[...,0][s].mean()/255; pg = Pf[...,1][s].mean()/255
    print(f"{k:28s} {str(a.round(0)):>15s} {str(e.round(0)):>15s} {d:6.1f} {pr:6.2f} {pg:6.2f}")

# Where does |art-empty| exceed threshold (liquid region) vs mask?
diff = np.abs(A-Ef).mean(-1)
inside = M > 128
liq = (diff > 40) & inside
ys, xs = np.nonzero(liq)
print('\nliquid-ish pixels inside mask:', liq.sum(), 'fill rows y(top) range:', ys.min(), ys.max())

# Statue signature inside disc: high G channel of pack AND small |a-e|
g = Pf[...,1]/255.0
r_ = Pf[...,0]/255.0
fg_candidate = inside & (g > 0.55) & (r_ < 0.75)
ys2, xs2 = np.nonzero(fg_candidate)
print('statue-ish pixels inside disc:', fg_candidate.sum(), 'x range', xs2.min(), xs2.max(), 'y range', ys2.min(), ys2.max())
# how much of it is below the liquid top row? (would be covered by fill line today)
if len(ys): print('statue pixels below liquid top row:', int((ys2 >= ys.min()).sum()))
# distribution sanity for thresholds
print('\npack.g percentiles inside disc:', np.percentile(g[inside], [10,50,90]).round(2))
print('pack.r percentiles inside disc:', np.percentile(r_[inside], [10,50,90]).round(2))
# face ROI proposal: bounding box of statue-over-disc on right side
roi = fg_candidate & (np.arange(1672)[None,:] > cx) 
ys3, xs3 = np.nonzero(roi)
print('\nright-side statue-over-disc bbox: x', xs3.min(), xs3.max(), 'y', ys3.min(), ys3.max())
