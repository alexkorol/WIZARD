"""Verify a fresh browser pageAssets bundle against the active sprite manifest.

Usage: python verify_browser_assets.py <browser-bundle-manifest.json>
Export the currently loaded page assets through the browser tool first.
This proves image delivery, not pose quality or artistic acceptance.
"""
import hashlib
import json
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from PIL import Image

ROOT = Path(__file__).parent


def verify(bundle_path):
    manifest = json.loads((ROOT / 'manifest-blender.json').read_text())
    expected = {Path(f['src']).name: f for c in manifest['clips'].values() for f in c['frames']}
    bundle = json.loads(Path(bundle_path).read_text())
    seen = set()
    errors = []
    for asset in bundle['assets']:
        url = urlparse(asset['url'])
        name = Path(url.path).name
        if name not in expected:
            continue
        local = ROOT / expected[name]['src']
        with Image.open(asset['path']) as served, Image.open(local) as current:
            served = served.convert('RGBA')
            current = current.convert('RGBA')
            if served.size != current.size or served.tobytes() != current.tobytes():
                errors.append(f'{name}: browser pixels differ from the active export')
        digest = hashlib.sha256(local.read_bytes()).hexdigest()
        if parse_qs(url.query).get('v') != [digest]:
            errors.append(f'{name}: URL does not identify current PNG content')
        seen.add(name)
    missing = set(expected) - seen
    if missing:
        errors.append(f'{len(missing)} current frames absent from the browser bundle')
    if errors:
        raise ValueError('\n'.join(errors))
    return len(seen)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('Usage: python verify_browser_assets.py <fresh-browser-bundle-manifest.json>')
    try:
        print(f'PASS: {verify(sys.argv[1])} browser assets match current RGBA pixels and content URLs')
    except (ValueError, KeyError, OSError) as error:
        sys.exit(f'FAIL: {error}')
