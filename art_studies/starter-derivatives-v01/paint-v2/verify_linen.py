"""Verify the wardrobe export contract, separately from its visual review."""
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
manifest = json.loads((ROOT.parent / 'manifest-linen.json').read_text())
assert len(manifest['clips']) == 16 and manifest['game_ready'] is False
for key, clip in manifest['clips'].items():
    assert len(clip['frames']) == 8
    hashes = set()
    for frame in clip['frames']:
        path = ROOT.parent / frame['src']
        assert hashlib.sha256(path.read_bytes()).hexdigest() == frame['sha256']
        assert frame['anchor'] == [48, 80]
        with Image.open(path) as image:
            assert image.mode == 'RGBA' and image.size == (96, 96)
            pixels = np.array(image)
        alpha = pixels[:, :, 3]
        assert set(np.unique(alpha)) == {0, 255}
        assert not pixels[alpha == 0, :3].any()
        assert not (alpha[0].any() or alpha[-1].any() or alpha[:, 0].any() or alpha[:, -1].any())
        raw = np.array(Image.open(ROOT / 'linen-references' / path.name))
        assert np.array_equal(raw[alpha > 0, :3], pixels[alpha > 0, :3])
        hashes.add(frame['sha256'])
    assert len(hashes) == 8, f'Duplicate phases: {key}'
for record in json.loads((ROOT / 'blender' / 'provenance.json').read_text()):
    assert hashlib.sha256((ROOT.parent / record['source']).read_bytes()).hexdigest() == record['source_sha256']
for path in (ROOT / 'blender').glob('*-framing.json'):
    for facing in json.loads(path.read_text()).values():
        assert facing['anchor'] == [48, 80]
        assert facing['pixels_per_metre_at_player_plane'] == 48
        assert facing['pixel_focal_length'] == 612
print('PASS: 128 unique-phase native RGBA frames; original RGB, anchors, camera density and prior source files preserved')
