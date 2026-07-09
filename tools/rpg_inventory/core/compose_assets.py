"""Compose Verdigris assets from ChatGPT-generated art.

Input:
  assets_staging/{name}.png       TRUE-ALPHA PNG, or art on flat background
  assets_staging/{name}_mask.png  required only for flat-background art

Output:
  ../assets/{name}.png

TRUE-ALPHA image-2 downloads are preserved as RGBA and cropped directly from
their own alpha channel. They are not matted and not palette-quantized.

Usage:  python compose_assets.py [--staging DIR] [--no-crop NAME ...] [--wb] [NAME ...]

--wb applies a gentle white-balance correction that pulls a yellow/sepia cast
back to neutral (estimated from the brightest 5% of pixels). Use it if a batch
came out warm despite the prompt.
"""
import argparse
import os
import sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.normpath(os.path.join(HERE, '..', 'assets'))
MAX_DIM = 512
TRUE_ALPHA_MIN_TRANSPARENT = 0.02
ALPHA_CROP_THRESHOLD = 8
NO_CROP_DEFAULT = {'frame_ornate', 'divider_raw'}  # UI pieces keep full framing


def white_balance(img):
    """Grey-world-ish correction using bright pixels; tames the GPT yellow cast."""
    small = img.resize((64, 64))
    px = list(small.getdata())
    px.sort(key=lambda p: p[0] + p[1] + p[2], reverse=True)
    top = px[:max(1, len(px) // 20)]
    r = sum(p[0] for p in top) / len(top) or 1
    g = sum(p[1] for p in top) / len(top) or 1
    b = sum(p[2] for p in top) / len(top) or 1
    target = (r + g + b) / 3
    gains = (target / r, target / g, target / b)
    # clamp gains so we correct casts, not repaint the image
    gains = [min(1.25, max(0.8, x)) for x in gains]
    bands = img.split()
    bands = [band.point(lambda v, k=k: min(255, int(v * k))) for band, k in zip(bands, gains)]
    return Image.merge('RGB', bands)


def has_true_alpha(src):
    if src.mode != 'RGBA':
        return False
    alpha = src.getchannel('A')
    hist = alpha.histogram()
    transparent = sum(hist[:128]) / max(1, alpha.width * alpha.height)
    return transparent > TRUE_ALPHA_MIN_TRANSPARENT


def alpha_bbox(img):
    alpha = img.getchannel('A')
    return alpha.point(lambda p: 255 if p > ALPHA_CROP_THRESHOLD else 0).getbbox()


def save_true_alpha(name, src, no_crop, wb):
    out = src.convert('RGBA')
    if wb:
        rgb = white_balance(out.convert('RGB'))
        rgb.putalpha(out.getchannel('A'))
        out = rgb
    if name not in no_crop:
        bbox = alpha_bbox(out)
        if bbox:
            pad = 16
            l, t, r, b = bbox
            out = out.crop((max(0, l - pad), max(0, t - pad),
                            min(out.width, r + pad), min(out.height, b + pad)))
    out.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
    final = os.path.join(OUT_DIR, f'{name}.png')
    out.save(final, optimize=True)
    print(f'ok   {name} -> {os.path.relpath(final, HERE)} '
          f'({out.size[0]}x{out.size[1]}, true-alpha RGBA)')
    return True


def compose(name, staging, no_crop, wb):
    art_p = os.path.join(staging, f'{name}.png')
    mask_p = os.path.join(staging, f'{name}_mask.png')
    src = Image.open(art_p)
    if has_true_alpha(src):
        return save_true_alpha(name, src, no_crop, wb)
    if not os.path.exists(mask_p):
        print(f'skip {name}: no mask ({name}_mask.png missing)')
        return False
    art = src.convert('RGB')
    if wb:
        art = white_balance(art)
    mask = Image.open(mask_p).convert('L')
    if mask.size != art.size:
        mask = mask.resize(art.size, Image.LANCZOS)
    mask = mask.point(lambda p: 0 if p < 24 else (255 if p > 231 else p))
    out = art.copy()
    out.putalpha(mask)
    if name not in no_crop:
        bbox = out.getchannel('A').getbbox()
        if bbox:
            pad = 8
            l, t, r, b = bbox
            out = out.crop((max(0, l - pad), max(0, t - pad),
                            min(out.width, r + pad), min(out.height, b + pad)))
    out.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
    out = out.quantize(256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
    final = os.path.join(OUT_DIR, f'{name}.png')
    out.save(final, optimize=True)
    print(f'ok   {name} -> {os.path.relpath(final, HERE)} ({out.size[0]}x{out.size[1]})')
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--staging', default=os.path.join(HERE, '..', 'assets_staging'))
    ap.add_argument('--no-crop', nargs='*', default=[])
    ap.add_argument('--wb', action='store_true', help='apply anti-yellow white balance')
    ap.add_argument('names', nargs='*', help='optional asset names to compose')
    args = ap.parse_args()
    staging = os.path.normpath(args.staging)
    no_crop = NO_CROP_DEFAULT | set(args.no_crop)
    if not os.path.isdir(staging):
        sys.exit(f'staging dir not found: {staging}')
    os.makedirs(OUT_DIR, exist_ok=True)
    if args.names:
        names = sorted(n[:-4] if n.endswith('.png') else n for n in args.names)
    else:
        names = sorted(f[:-4] for f in os.listdir(staging)
                       if f.endswith('.png') and not f.endswith('_mask.png'))
    if not names:
        sys.exit('no art PNGs in staging')
    done = sum(compose(n, staging, no_crop, args.wb) for n in names)
    print(f'\n{done}/{len(names)} composed into {OUT_DIR}')


if __name__ == '__main__':
    main()
