"""Deterministic procedural painter for Verdigris splash-screen sprite textures.

Seeds every numpy random call (SEED constant), paints five RGBA PNGs into
../assets/textures/, and prints per-asset stats (path, size, alpha coverage).
Value-noise fields use wrap-periodic lattice interpolation so multi-octave
noise tiles seamlessly.
"""

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

MODULE_DIR = Path(__file__).resolve().parents[1]
OUT_DIR = MODULE_DIR / "assets" / "textures"
SEED = 20260822


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def radial(w, h):
    cx = (w - 1) / 2.0
    cy = (h - 1) / 2.0
    y, x = np.mgrid[0:h, 0:w].astype(np.float64)
    return x - cx, y - cy


def to_u8(arr):
    return np.clip(np.rint(arr), 0, 255).astype(np.uint8)


def value_noise(h, w, cells_y, cells_x, rng):
    g = rng.random((cells_y, cells_x))
    ys = np.arange(h, dtype=np.float64) * (cells_y / h)
    xs = np.arange(w, dtype=np.float64) * (cells_x / w)
    y0 = np.floor(ys).astype(np.int64) % cells_y
    y1 = (y0 + 1) % cells_y
    x0 = np.floor(xs).astype(np.int64) % cells_x
    x1 = (x0 + 1) % cells_x
    fy = ys - np.floor(ys)
    fx = xs - np.floor(xs)
    fy = fy * fy * (3.0 - 2.0 * fy)
    fx = fx * fx * (3.0 - 2.0 * fx)
    v00 = g[np.ix_(y0, x0)]
    v01 = g[np.ix_(y0, x1)]
    v10 = g[np.ix_(y1, x0)]
    v11 = g[np.ix_(y1, x1)]
    top = v00 * (1.0 - fx) + v01 * fx
    bot = v10 * (1.0 - fx) + v11 * fx
    return top * (1.0 - fy[:, None]) + bot * fy[:, None]


def fbm(h, w, octaves, rng):
    total = np.zeros((h, w), dtype=np.float64)
    amp_sum = 0.0
    for cy, cxg, amp in octaves:
        total += amp * value_noise(h, w, cy, cxg, rng)
        amp_sum += amp
    return total / amp_sum


class Field:
    def __init__(self, h, w):
        self.h = h
        self.w = w
        self.a = np.zeros((h, w), dtype=np.float64)

    def ellipse(self, cx, cy, rx, ry, ang, strength):
        rad = 3.0 * max(rx, ry) + 2.0
        x0 = max(int(cx - rad), 0)
        x1 = min(int(cx + rad) + 1, self.w)
        y0 = max(int(cy - rad), 0)
        y1 = min(int(cy + rad) + 1, self.h)
        if x0 >= x1 or y0 >= y1:
            return
        xs = np.arange(x0, x1, dtype=np.float64)[None, :]
        ys = np.arange(y0, y1, dtype=np.float64)[:, None]
        dx = xs - cx
        dy = ys - cy
        ca, sa = np.cos(ang), np.sin(ang)
        u = dx * ca + dy * sa
        v = -dx * sa + dy * ca
        g = np.exp(-(u * u / (rx * rx) + v * v / (ry * ry)))
        self.a[y0:y1, x0:x1] += strength * g


def eclipse_corona():
    s = 1024
    rng = np.random.default_rng(SEED + 1)
    dx, dy = radial(s, s)
    r = np.hypot(dx, dy)

    intensity = np.zeros_like(r)
    m1 = (r >= 200.0) & (r < 210.0)
    m2 = (r >= 210.0) & (r < 260.0)
    m3 = (r >= 260.0) & (r < 430.0)
    t1 = (r[m1] - 200.0) / 10.0
    intensity[m1] = 0.86 + 0.14 * t1
    t2 = (r[m2] - 210.0) / 50.0
    intensity[m2] = 1.0 - 0.47 * t2 ** 0.85
    t3 = (r[m3] - 260.0) / 170.0
    intensity[m3] = 0.53 * (1.0 - t3) ** 2.1

    ang = np.arctan2(dy, dx)
    asym = 1.0 + 0.09 * np.sin(2.0 * ang + 0.9) + 0.06 * np.sin(5.0 * ang + 2.1)
    intensity *= asym

    mixc = smoothstep(215.0, 330.0, r)
    rr = np.full_like(r, 255.0)
    gg = lerp(np.full_like(r, 232.0), 152.0, mixc)
    bb = lerp(np.full_like(r, 192.0), 62.0, mixc)

    field = Field(s, s)
    n_rays = int(rng.integers(8, 13))
    for i in range(n_rays):
        theta = 2.0 * np.pi * i / n_rays + float(rng.uniform(-0.17, 0.17))
        length = float(rng.uniform(270.0, 480.0))
        half_w = float(rng.uniform(13.0, 32.0))
        curve = float(rng.uniform(-0.4, 0.4))
        segs = 11
        for k in range(segs):
            sk = 0.08 + 0.92 * k / (segs - 1)
            dist = 196.0 + sk * length
            lat = curve * length * 0.22 * sk * sk
            px = s / 2.0 + np.cos(theta) * dist - np.sin(theta) * lat
            py = s / 2.0 + np.sin(theta) * dist + np.cos(theta) * lat
            rl = (length / segs) * 0.95 + 6.0
            rw = half_w * (1.0 - 0.55 * sk) + 3.5
            field.ellipse(px, py, rl, rw, theta, 1.0 - 0.5 * sk)
    peak = float(field.a.max())
    ray_a = field.a / peak * 70.0 if peak > 0.0 else field.a

    corona_a = np.clip(intensity, 0.0, 1.0) * 255.0
    alpha = np.maximum(corona_a, ray_a)
    use_ray = ray_a > corona_a
    rgb = np.stack(
        [
            np.where(use_ray, 255.0, rr),
            np.where(use_ray, 242.0, gg),
            np.where(use_ray, 208.0, bb),
        ],
        axis=-1,
    )

    disc = r <= 200.0
    rgb[disc] = (0.0, 0.0, 0.0)
    alpha[disc] = 255.0

    return to_u8(np.dstack([rgb, alpha[..., None]]))


def blood_moon():
    s = 256
    rng = np.random.default_rng(SEED + 2)
    dx, dy = radial(s, s)
    R = 100.0
    r = np.hypot(dx, dy)
    rr_c = np.clip(r / R, 0.0, 1.0)
    mu = np.sqrt(np.clip(1.0 - rr_c * rr_c, 0.0, 1.0))

    limb = 0.40 + 0.60 * mu ** 0.62
    lx, ly, lz = -0.58, -0.52, 0.63
    norm_l = np.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx / norm_l, ly / norm_l, lz / norm_l
    ndl = np.clip(dx / R * lx + dy / R * ly + mu * lz, 0.0, 1.0)
    cres = smoothstep(0.12, 0.72, ndl)

    n = fbm(s, s, [(4, 4, 0.4), (9, 9, 0.3), (20, 20, 0.3)], rng)
    crat = smoothstep(0.60, 0.78, n)

    base = np.array([96.0, 52.0, 36.0])
    bright = np.array([150.0, 84.0, 56.0])
    col = lerp(base[None, :], bright[None, :], (0.88 * cres)[..., None])
    col = col * limb[..., None]
    col = col - (30.0 * crat)[..., None]
    col = np.clip(col, 0.0, 255.0)

    aa_edge = smoothstep(R + 0.7, R - 0.7, r)
    moon_a = 255.0 * aa_edge

    halo_a = np.where(r > R, 70.0 * np.exp(-(r - R) / 9.5), 0.0)
    halo_col = np.array([255.0, 132.0, 84.0])

    alpha = np.maximum(moon_a, halo_a)
    w_m = moon_a / np.maximum(alpha, 1e-6)
    rgb = col * w_m[..., None] + halo_col[None, None, :] * (1.0 - w_m[..., None])
    rgb = np.where(alpha[..., None] > 0, rgb, 0.0)

    return to_u8(np.dstack([rgb, alpha[..., None]]))


def milkyway():
    w, h = 2048, 512
    rng = np.random.default_rng(SEED + 3)
    ys = np.arange(h, dtype=np.float64)
    prof = np.exp(-((ys - (h - 1) / 2.0) ** 2) / (2 * 50.0 ** 2))
    prof = prof + 0.28 * np.exp(-((ys - (h - 1) / 2.0) ** 2) / (2 * 115.0 ** 2))
    prof = prof / prof.max()
    prof2d = np.repeat(prof[:, None], w, axis=1)

    dens = fbm(h, w, [(3, 22, 0.5), (7, 46, 0.3), (15, 92, 0.2)], rng)
    dens = np.clip(dens, 0.0, 1.0) ** 1.45

    vn = value_noise(h, w, 3, 11, rng)
    vmask = smoothstep(0.58, 0.80, vn) * 0.85

    amask = np.zeros((h, w), dtype=np.float64)
    xx = np.arange(w, dtype=np.float64)[None, :]
    yy = np.arange(h, dtype=np.float64)[:, None]
    for _ in range(3):
        ax = float(rng.uniform(120, w - 120))
        ay = (h - 1) / 2.0 + float(rng.uniform(-46, 46))
        sx = float(rng.uniform(90, 160))
        sy = float(rng.uniform(26, 46))
        g = np.exp(
            -(((xx - ax) ** 2) / (2 * sx * sx) + ((yy - ay) ** 2) / (2 * sy * sy))
        )
        amask = np.maximum(amask, g * float(rng.uniform(0.7, 0.95)))

    core = np.array([200.0, 215.0, 255.0])
    violet = np.array([110.0, 80.0, 180.0])
    amber = np.array([210.0, 170.0, 120.0])
    col = lerp(core[None, :], violet[None, :], vmask[..., None])
    col = lerp(col, amber[None, :], np.clip(amask, 0.0, 1.0)[..., None])

    lane_mult = np.ones((h, w), dtype=np.float64)
    for _ in range(3):
        y0 = (h - 1) / 2.0 + float(rng.uniform(-55, 55))
        amp = float(rng.uniform(18, 46))
        lam = float(rng.uniform(380, 900))
        ph = float(rng.uniform(0.0, 2.0 * np.pi))
        sig = float(rng.uniform(13, 26))
        depth = float(rng.uniform(0.30, 0.50))
        wob = float(rng.uniform(0.3, 0.6))
        yc = (
            y0
            + amp * np.sin(2.0 * np.pi * xx / lam + ph)
            + amp * wob * np.sin(2.0 * np.pi * xx / (lam * 0.37) + ph * 1.7)
        )
        lane_mult *= 1.0 - depth * np.exp(-((yy - yc) ** 2) / (2 * sig * sig))

    a = prof2d * dens * lane_mult
    amax = float(a.max())
    a = a / max(amax, 1e-9) * 150.0
    a = np.clip(a, 0.0, 165.0)

    shade = (0.55 + 0.45 * dens)[..., None]
    rgb = np.clip(col * shade, 0.0, 255.0)

    return to_u8(np.dstack([rgb, a[..., None]]))


def cloud_puff():
    w, h = 512, 320
    rng = np.random.default_rng(SEED + 4)
    field = Field(h, w)
    y_base = 276.0

    n_base = 24
    n_top = 11
    n_extra = int(rng.integers(3, 9))
    xs_base = np.linspace(116.0, 396.0, n_base)
    for i in range(n_base):
        cx = xs_base[i] + float(rng.uniform(-14, 14))
        falloff = float(np.exp(-(((xs_base[i] - 256.0) / 150.0) ** 2)))
        rx = lerp(34.0, 88.0, falloff) * float(rng.uniform(0.8, 1.18))
        ry = rx * float(rng.uniform(0.40, 0.60))
        cy = y_base - ry * float(rng.uniform(0.10, 0.45))
        field.ellipse(
            cx, cy, rx, ry, float(rng.uniform(-0.15, 0.15)), float(rng.uniform(0.8, 1.1))
        )
    for _ in range(n_top):
        cx = float(rng.uniform(166, 352))
        cy = float(rng.uniform(108, 198))
        rx = float(rng.uniform(24, 54))
        ry = rx * float(rng.uniform(0.72, 0.95))
        field.ellipse(
            cx, cy, rx, ry, float(rng.uniform(-0.2, 0.2)), float(rng.uniform(0.75, 1.05))
        )
    for _ in range(n_extra):
        side = float(rng.choice([-1.0, 1.0]))
        cx = 256.0 + side * float(rng.uniform(120, 175))
        cy = y_base - float(rng.uniform(6, 40))
        rx = float(rng.uniform(18, 34))
        ry = rx * float(rng.uniform(0.36, 0.52))
        field.ellipse(cx, cy, rx, ry, 0.0, float(rng.uniform(0.6, 0.9)))

    f = np.clip(field.a, 0.0, None)
    alpha = smoothstep(0.16, 0.62, f) * 255.0

    mott = value_noise(h, w, 6, 10, rng)
    yy = np.arange(h, dtype=np.float64)[:, None] * np.ones((1, w))
    hn = np.clip((yy - 120.0) / 180.0, 0.0, 1.0)
    shad = smoothstep(0.42, 0.96, hn)
    litv = np.clip(244.0 + (mott - 0.5) * 14.0, 235.0, 250.0)
    lit = np.stack([litv, litv + 2.0, litv + 6.0], axis=-1)
    shadc = np.array([180.0, 195.0, 205.0])
    col = lerp(lit, shadc[None, None, :], (shad * 0.9)[..., None])

    return to_u8(np.dstack([np.clip(col, 0.0, 255.0), alpha[..., None]]))


def ember_glow():
    s = 256
    dx, dy = radial(s, s)
    r = np.hypot(dx, dy)
    t = r / 128.0
    m = np.clip(t / 0.4, 0.0, 1.0)[..., None]
    c0 = np.array([255.0, 240.0, 210.0])
    c1 = np.array([255.0, 140.0, 50.0])
    col = lerp(c0[None, None, :], c1[None, None, :], m)
    a = np.clip(255.0 * np.exp(-4.0 * t), 0.0, 255.0)
    a = a * (1.0 - smoothstep(0.80, 1.0, t))
    return to_u8(np.dstack([col, a[..., None]]))


BUILDERS = [
    ("eclipse_corona_1024.png", eclipse_corona),
    ("blood_moon_256.png", blood_moon),
    ("milkyway_band_2048x512.png", milkyway),
    ("cloud_puff_512.png", cloud_puff),
    ("ember_glow_256.png", ember_glow),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--force",
        action="store_true",
        help="allow overwriting outputs previously produced by this script",
    )
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    existing = [name for name, _ in BUILDERS if (OUT_DIR / name).exists()]
    if existing and not args.force:
        sys.exit(
            "refusing to overwrite existing output(s): "
            + ", ".join(existing)
            + " (pass --force to allow)"
        )

    for name, fn in BUILDERS:
        arr = fn()
        img = Image.fromarray(arr, "RGBA")
        path = OUT_DIR / name
        img.save(path)
        h, w = arr.shape[:2]
        coverage = float((arr[..., 3] > 8).mean()) * 100.0
        print(f"{path} | {w}x{h} | alpha>8 coverage: {coverage:.2f}%")


if __name__ == "__main__":
    main()
