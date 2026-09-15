"""Pack verified Blender frames on an exact 5x reference grid, without scaling actors."""
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent


def build():
    manifest = json.loads((ROOT.parent / 'manifest-linen.json').read_text())
    output_dir = ROOT / 'inputs' / 'linen-v1'
    output_dir.mkdir(exist_ok=True)
    records = {}
    for clip, record in manifest['clips'].items():
        sheet = Image.new('RGBA', (304, 204))
        records[clip] = []
        for i, frame in enumerate(record['frames']):
            path = ROOT.parent / frame['src']
            assert hashlib.sha256(path.read_bytes()).hexdigest() == frame['sha256']
            with Image.open(path) as source:
                source = source.convert('RGBA')
                crop = source.crop((10, 0, 86, 96))
                assert np.count_nonzero(np.array(source)[:, :, 3]) == np.count_nonzero(np.array(crop)[:, :, 3])
                sheet.alpha_composite(crop, ((i % 4) * 76, (i // 4) * 102 + 3))
            records[clip].append(frame)
        output = Image.new('RGBA', (1536, 1024))
        output.alpha_composite(sheet.resize((1520, 1020), Image.Resampling.NEAREST), (8, 2))
        output.save(output_dir / f'{clip}-5x.png')
    (output_dir / 'provenance.json').write_text(json.dumps({
        'source_crop': [10, 0, 86, 96], 'slot': [76, 102], 'source_y': 3,
        'scale': 5, 'canvas_offset': [8, 2], 'clips': records,
    }, indent=2))
    print(f'{len(records)} guides; every source foreground pixel retained at exact 5x NEAREST')


if __name__ == '__main__':
    build()
