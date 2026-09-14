"""Verify exact guide pixels, nearest-neighbor blocks, crop integrity and UI data."""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parent.parent
for version in ['v01','v02']:
    r=ROOT/f'web-padding-{version}'
    layout=json.loads((r/'layout.json').read_text())
    native=np.array(Image.open(r/'padded-guide-native.png'))
    scale=layout['upscale']
    enlarged=np.array(Image.open(r/f'padded-guide-{scale}x.png'))
    assert np.array_equal(enlarged,np.repeat(np.repeat(native,scale,axis=0),scale,axis=1))
    for f in layout['frames']:
        x,y,w,h=f['inner_rect']
        assert np.array_equal(native[y:y+h,x:x+w],np.array(Image.open(ROOT/f['source'])))
    for filename,sha in json.loads((r/'input-hashes.json').read_text()).items():
        assert hashlib.sha256((r/filename).read_bytes()).hexdigest()==sha
    audit=json.loads((r/'audit.json').read_text())
    raw=Image.open(r/'generated.png')
    assert raw.mode=='RGBA' and raw.getchannel('A').getextrema()==(0,255)
    assert hashlib.sha256((r/'generated.png').read_bytes()).hexdigest()==audit['sha256']
    if version=='v01':
        assert not audit['all_foreground_preserved']
        continue
    assert audit['mesh_rejection'] and audit['grid_kind']=='rigid'
    assert not audit['fit']['peaked'] and not audit['game_ready']
    assert audit['all_foreground_preserved'] and audit['unique_frames']==4
    reconstructed=np.array(Image.open(r/'recovered.png'))
    framesheet=np.array(Image.open(r/'frames96.png'))
    retained=0
    for i,f in enumerate(audit['frames']):
        actual=np.array(Image.open(r/f'frame-{i+1}.png'))
        assert actual.shape==(96,96,4)
        assert hashlib.sha256(actual.tobytes()).hexdigest()==f['rgba_sha256']
        assert np.array_equal(framesheet[(i//2)*96:(i//2+1)*96,(i%2)*96:(i%2+1)*96],actual)
        x,y=f['crop_origin']
        yy,xx=np.nonzero(actual[:,:,3])
        assert np.array_equal(actual[yy,xx],reconstructed[yy+y,xx+x])
        retained+=len(yy)
    assert retained==np.count_nonzero(reconstructed[:,:,3])
records=json.loads((ROOT/'web-v01/recovery.json').read_text())
assert not any(r['name']=='female-sprint-right-padded-v01' for r in records)
r=next(r for r in records if r['name']=='female-sprint-right-padded-v02')
assert r['key']=='female-sprint-right' and len(r['frames'])==4 and not r['game_ready']
assert 'LOW' in r['review_status'] and 'incomplete' in r['review_status']
print('PASS: exact guides, native alpha, rejected clipping, square-grid fallback, 4 unique lossless 96x96 crops, incomplete/unapproved demo metadata')
