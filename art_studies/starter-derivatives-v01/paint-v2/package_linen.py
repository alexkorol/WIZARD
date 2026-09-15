"""Package visually reviewed linen renders with native pixels and content hashes."""
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
review = json.loads((ROOT / 'review' / 'linen-review.json').read_text())
assert review['structural_reference_accepted'] and not review['painted_art_accepted']
assert len(review['renders']) == 128
for name, digest in review['renders'].items():
    assert hashlib.sha256((ROOT / 'linen-references' / name).read_bytes()).hexdigest() == digest
manifest = json.loads((ROOT.parent / 'manifest-blender.json').read_text())
manifest.update(name='Natural linen Blender wardrobe references', review_revision='linen-sport-v1')
(ROOT / 'linen-frames').mkdir(exist_ok=True)
for clip in manifest['clips'].values():
    clip['note'] = 'Natural undyed linen and cord; no neckline trim. Female hem shortened on the existing cloth surface. Blender structure only; painted game art remains unaccepted.'
    for frame in clip['frames']:
        name = Path(frame['src']).name
        with Image.open(ROOT / 'linen-references' / name) as source:
            pixels = np.array(source.convert('RGBA'))
        assert pixels.shape == (96, 96, 4)
        pixels[:, :, 3] = np.where(pixels[:, :, 3] >= 128, 255, 0)
        pixels[pixels[:, :, 3] == 0, :3] = 0
        image = Image.fromarray(pixels)
        box = image.getbbox()
        assert box and 0 < box[0] < box[2] < 96 and 0 < box[1] < box[3] < 96
        dest = ROOT / 'linen-frames' / name
        image.save(dest)
        frame.update(src='paint-v2/linen-frames/' + name, sha256=hashlib.sha256(dest.read_bytes()).hexdigest())
(ROOT.parent / 'manifest-linen.json').write_text(json.dumps(manifest, indent=2))
print('Packaged 128 native linen reference frames, no RGB resampling')
