"""Check frame packaging, not artistic acceptance."""
from pathlib import Path
import json
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parent
manifest = json.loads((root / 'manifest.json').read_text())
frames = [f for clip in manifest['clips'].values() for f in clip['frames']]
seen = set()
for frame in frames:
    assert frame['src'] not in seen
    seen.add(frame['src'])
    im = Image.open(root / frame['src'])
    assert im.mode == 'RGBA'
    assert im.size == (frame['width'], frame['height'])
    a = np.array(im)
    assert set(np.unique(a[:, :, 3])) == {0, 255}
    assert (a[a[:, :, 3] == 0, :3] == 0).all()
    for edge in [a[:2, :, 3], a[-2:, :, 3], a[:, :2, 3], a[:, -2:, 3]]:
        assert (edge == 0).all(), f"Foreground touches border: {frame['src']}"
result = {'packaging_passed': True, 'unique_frames': len(frames),
          'within_48x96': sum((f['width'],f['height']) == (48,96) for f in frames),
          'checks': ['PNG dimensions match manifest', 'binary returned-alpha processing',
                     'zero hidden RGB', 'transparent two-pixel margins', 'unique frame paths'],
          'artistic_acceptance': False}
(root / 'review' / 'frame-verification.json').write_text(json.dumps(result, indent=2))
print(json.dumps(result))
