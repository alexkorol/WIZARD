"""Generate alpha mattes for staged art via Nano Banana Pro (OpenRouter).

Scans assets_staging/ for {name}.png without a {name}_mask.png and creates
the matte with google/gemini-3-pro-image. Art generation happens elsewhere
(ChatGPT web app); this script only does mattes (~$0.14 each).

Key: read from HKCU\\Environment OPENROUTER_API_KEY, fallback to process env.
Usage: python gen_masks.py [--staging DIR] [--workers N] [--model ID]
Then run compose_assets.py to produce the final RGBA assets.
"""
import argparse
import base64
import os
import subprocess
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_STAGING = os.path.normpath(os.path.join(HERE, '..', 'assets_staging'))
DEFAULT_MODEL = 'google/gemini-3-pro-image'

MATTE_PROMPT = (
    'Create a precise binary alpha matte for the attached image: render the subject as a '
    'solid pure white silhouette on a solid pure black background. Preserve the exact '
    'outline, including thin cords, straps and points; any region showing the black '
    'background inside or around the subject must be black. Only ~1px of soft antialiasing '
    'at edges. Same canvas size and framing as the original. Output only the matte image, no text.'
)

_lock = threading.Lock()
_cost = [0.0]


def get_key():
    """Key lookup, cross-platform: env var -> ~/.openrouter_key file ->
    Windows user registry (survives even when the shell env is stale)."""
    key = os.environ.get('OPENROUTER_API_KEY', '').strip()
    if key:
        return key
    keyfile = os.path.expanduser('~/.openrouter_key')
    if os.path.exists(keyfile):
        with open(keyfile) as f:
            key = f.read().strip()
        if key:
            return key
    if sys.platform == 'win32':
        try:
            out = subprocess.run(
                ['powershell.exe', '-NoProfile', '-Command',
                 '(Get-ItemProperty -Path HKCU:\\Environment -Name OPENROUTER_API_KEY -ErrorAction SilentlyContinue).OPENROUTER_API_KEY'],
                capture_output=True, text=True, timeout=30).stdout.strip()
            if out:
                return out
        except Exception:
            pass
    return ''


def make_mask(key, model, staging, name):
    art_p = os.path.join(staging, f'{name}.png')
    mask_p = os.path.join(staging, f'{name}_mask.png')
    with open(art_p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    r = requests.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={'Authorization': f'Bearer {key}'},
        json={'model': model,
              'messages': [{'role': 'user', 'content': [
                  {'type': 'text', 'text': MATTE_PROMPT},
                  {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}},
              ]}],
              'modalities': ['image', 'text'],
              'usage': {'include': True}},
        timeout=420)
    r.raise_for_status()
    data = r.json()
    if 'error' in data:
        raise RuntimeError(str(data['error'])[:300])
    cost = (data.get('usage') or {}).get('cost') or 0
    with _lock:
        _cost[0] += cost
    images = data['choices'][0]['message'].get('images') or []
    if not images:
        raise RuntimeError('no image in response')
    png = base64.b64decode(images[0]['image_url']['url'].split(',', 1)[1])
    with open(mask_p, 'wb') as f:
        f.write(png)
    return cost


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--staging', default=DEFAULT_STAGING)
    ap.add_argument('--workers', type=int, default=3)
    ap.add_argument('--model', default=DEFAULT_MODEL)
    args = ap.parse_args()

    key = get_key()
    if not key:
        sys.exit('no OpenRouter key found (HKCU env OPENROUTER_API_KEY)')
    staging = os.path.normpath(args.staging)
    if not os.path.isdir(staging):
        sys.exit(f'staging dir not found: {staging}')

    todo = sorted(
        f[:-4] for f in os.listdir(staging)
        if f.endswith('.png') and not f.endswith('_mask.png')
        and not os.path.exists(os.path.join(staging, f[:-4] + '_mask.png')))
    if not todo:
        print('nothing to do — all staged art already has masks')
        return
    print(f'{len(todo)} masks to generate via {args.model}')

    failures = {}
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futs = {pool.submit(make_mask, key, args.model, staging, n): n for n in todo}
        for fut in as_completed(futs):
            n = futs[fut]
            try:
                cost = fut.result()
                print(f'[{time.strftime("%H:%M:%S")}] ok   {n} (${cost:.3f})')
            except Exception as e:
                failures[n] = str(e)
                print(f'[{time.strftime("%H:%M:%S")}] FAIL {n}: {e}')

    print(f'\ndone: {len(todo) - len(failures)}/{len(todo)} masks, total ${_cost[0]:.2f}')
    if failures:
        print('failed (rerun to retry just these):', ', '.join(failures))
        sys.exit(1)


if __name__ == '__main__':
    main()
