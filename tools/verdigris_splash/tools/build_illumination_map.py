"""Build a seam-safe 4K Verdigris RGB illumination map from aligned sources.

The image-model concept supplies art direction only.  Atlas color and relief
gate every emitted feature so generated fissures cannot migrate into unrelated
biomes.  The final result is written through sixteen overlapping, feathered
tiles to retain fine detail without visible grid seams.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


SIZE = 4096
GRID = 4
CORE = SIZE // GRID
OVERLAP = 96


def smoothstep(edge0: float, edge1: float, value: np.ndarray) -> np.ndarray:
    amount = np.clip((value - edge0) / max(1e-6, edge1 - edge0), 0.0, 1.0)
    return amount * amount * (3.0 - 2.0 * amount)


def load_rgb(path: Path) -> np.ndarray:
    image = Image.open(path).convert("RGB").resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    return np.asarray(image, dtype=np.float32) / 255.0


def load_relief(path: Path) -> np.ndarray:
    image = Image.open(path).convert("I;16").resize((SIZE, SIZE), Image.Resampling.BILINEAR)
    return np.asarray(image, dtype=np.float32) / 65535.0


def normalized(signal: np.ndarray, percentile: float = 99.7) -> np.ndarray:
    scale = float(np.percentile(signal[signal > 0], percentile)) if np.any(signal > 0) else 1.0
    return np.clip(signal / max(scale, 1e-6), 0.0, 1.0)


def largest_components(mask: np.ndarray, count: int) -> np.ndarray:
    labels, total = ndimage.label(mask)
    if total <= count:
        return mask
    sizes = ndimage.sum(mask, labels, index=np.arange(1, total + 1))
    selected = np.argsort(sizes)[-count:] + 1
    return np.isin(labels, selected)


def feather_axis(length: int, before: bool, after: bool) -> np.ndarray:
    weights = np.ones(length, dtype=np.float32)
    if before:
        ramp = smoothstep(0.0, 1.0, np.linspace(0.0, 1.0, OVERLAP, dtype=np.float32))
        weights[:OVERLAP] *= ramp
    if after:
        ramp = smoothstep(0.0, 1.0, np.linspace(1.0, 0.0, OVERLAP, dtype=np.float32))
        weights[-OVERLAP:] *= ramp
    return np.maximum(weights, 0.0001)


def build_emission(atlas: np.ndarray, concept: np.ndarray, relief: np.ndarray) -> tuple[np.ndarray, dict[str, float]]:
    red, green, blue = np.moveaxis(atlas, -1, 0)
    concept_red, concept_green, concept_blue = np.moveaxis(concept, -1, 0)
    maximum = atlas.max(axis=2)
    minimum = atlas.min(axis=2)
    chroma = maximum - minimum
    luma = red * 0.2126 + green * 0.7152 + blue * 0.0722
    footprint = maximum > 0.018
    land = footprint & (relief > 0.166)

    # Dark, neutral-warm exposed stone identifies the actual two volcanic
    # provinces.  Expanding this mask admits their orange fissures but rejects
    # similarly colored desert and steppe elsewhere in the atlas.
    dark_igneous = (
        land
        & (luma > 0.055)
        & (luma < 0.34)
        & (blue < red * 1.08)
        & (green < red * 1.12)
        & (chroma < 0.24)
    )
    volcanic_density = ndimage.gaussian_filter(dark_igneous.astype(np.float32), 34.0)
    volcanic_region = land & (volcanic_density > 0.055)
    volcanic_region = ndimage.binary_dilation(volcanic_region, iterations=34)

    atlas_orange = np.clip((red - green * 0.96) * 2.8, 0.0, 1.0)
    atlas_orange *= smoothstep(0.12, 0.62, red) * smoothstep(0.015, 0.24, green - blue)
    lava_provinces = ndimage.binary_dilation((atlas_orange > 0.12) & volcanic_region, iterations=52)
    lava_provinces = largest_components(lava_provinces, 2)
    volcanic_region &= ndimage.binary_dilation(lava_provinces, iterations=38)
    concept_orange = np.clip(concept_red - concept_blue * 0.62, 0.0, 1.0)
    concept_orange *= smoothstep(0.06, 0.42, concept_red - concept_green * 0.66)
    fine_contrast = np.maximum(0.0, atlas_orange - ndimage.gaussian_filter(atlas_orange, 4.5))
    lava_core = normalized((atlas_orange * 0.72 + fine_contrast * 1.8 + concept_orange * 0.32) * volcanic_region)
    lava_core = smoothstep(0.16, 0.72, lava_core)
    lava_hot = smoothstep(0.48, 0.9, lava_core)
    lava_near = ndimage.gaussian_filter(lava_core, 2.2)
    lava_glow = ndimage.gaussian_filter(lava_core, 9.0)
    lava_halo = ndimage.gaussian_filter(lava_core, 24.0)

    water_blue = blue - np.maximum(red * 0.86, green * 0.72)
    water = footprint & (relief < 0.235) & (water_blue > 0.0)
    shallow = smoothstep(0.154, 0.205, relief) * (1.0 - smoothstep(0.215, 0.285, relief))
    atlas_cyan = np.clip((green + blue) * 0.5 - red * 0.9, 0.0, 1.0)
    concept_cyan = np.clip((concept_green + concept_blue) * 0.5 - concept_red * 0.8, 0.0, 1.0)
    reef_structure = normalized((atlas_cyan * 0.82 + concept_cyan * 0.18) * shallow * water)
    reef_detail = np.maximum(0.0, reef_structure - ndimage.gaussian_filter(reef_structure, 5.0))
    reef_core = smoothstep(0.18, 0.78, reef_structure * 0.58 + reef_detail * 1.7)
    reef_near = ndimage.gaussian_filter(reef_core, 2.0)
    reef_glow = ndimage.gaussian_filter(reef_core, 8.0)

    forest = land & (green > red * 1.08) & (green > blue * 1.12) & (luma > 0.12) & (luma < 0.62)
    forest_weight = smoothstep(0.018, 0.2, green - np.maximum(red, blue)) * forest
    random = np.random.default_rng(1784669863)
    seeds = (random.random(forest.shape) > 0.99994).astype(np.float32) * forest_weight
    # Existing tiny generated green/gold marks are useful as placement hints,
    # but only their strongest isolated maxima survive.
    concept_grove = np.clip(concept_green - np.maximum(concept_red, concept_blue) * 0.78, 0.0, 1.0) * forest_weight
    grove_maxima = (concept_grove == ndimage.maximum_filter(concept_grove, size=17)) & (concept_grove > 0.18)
    grove_seeds = seeds + grove_maxima.astype(np.float32) * 0.5
    grove_core = ndimage.gaussian_filter(grove_seeds, 1.6)
    grove_core = normalized(grove_core, 99.9) * 0.13
    grove_glow = ndimage.gaussian_filter(grove_core, 7.0)

    emission = np.zeros_like(atlas)
    emission += lava_halo[..., None] * np.array([0.18, 0.012, 0.001], dtype=np.float32)
    emission += lava_glow[..., None] * np.array([0.62, 0.075, 0.005], dtype=np.float32)
    emission += lava_near[..., None] * np.array([0.92, 0.32, 0.025], dtype=np.float32)
    emission += lava_hot[..., None] * np.array([1.0, 0.78, 0.28], dtype=np.float32)
    emission += reef_glow[..., None] * np.array([0.0, 0.065, 0.12], dtype=np.float32)
    emission += reef_near[..., None] * np.array([0.006, 0.23, 0.34], dtype=np.float32)
    emission += grove_glow[..., None] * np.array([0.035, 0.095, 0.018], dtype=np.float32)
    emission += grove_core[..., None] * np.array([0.34, 0.48, 0.08], dtype=np.float32)
    emission *= footprint[..., None]
    emission = np.clip(emission, 0.0, 1.0)

    report = {
        "lava_pixels_percent": round(float(np.mean(lava_core > 0.05) * 100.0), 4),
        "reef_pixels_percent": round(float(np.mean(reef_core > 0.04) * 100.0), 4),
        "grove_pixels_percent": round(float(np.mean(grove_core > 0.01) * 100.0), 4),
        "near_black_percent": round(float(np.mean(emission.max(axis=2) < 0.015) * 100.0), 4),
        "peak_emission": round(float(emission.max()), 4),
    }
    return emission, report


def stitch_tiles(emission: np.ndarray, tile_dir: Path) -> np.ndarray:
    tile_dir.mkdir(parents=True, exist_ok=True)
    accumulation = np.zeros_like(emission, dtype=np.float32)
    weight_sum = np.zeros((SIZE, SIZE), dtype=np.float32)
    manifest = []
    for row in range(GRID):
        for column in range(GRID):
            core_y = row * CORE
            core_x = column * CORE
            top = max(0, core_y - OVERLAP)
            left = max(0, core_x - OVERLAP)
            bottom = min(SIZE, core_y + CORE + OVERLAP)
            right = min(SIZE, core_x + CORE + OVERLAP)
            tile = emission[top:bottom, left:right]
            tile_path = tile_dir / f"illumination_r{row}_c{column}.png"
            Image.fromarray(np.round(tile * 255.0).astype(np.uint8), "RGB").save(tile_path, optimize=True)

            weight_y = feather_axis(tile.shape[0], row > 0, row < GRID - 1)
            weight_x = feather_axis(tile.shape[1], column > 0, column < GRID - 1)
            weight = weight_y[:, None] * weight_x[None, :]
            accumulation[top:bottom, left:right] += tile * weight[..., None]
            weight_sum[top:bottom, left:right] += weight
            manifest.append({
                "row": row,
                "column": column,
                "file": tile_path.name,
                "bounds": [left, top, right, bottom],
            })

    (tile_dir / "manifest.json").write_text(json.dumps({
        "grid": GRID,
        "size": SIZE,
        "core": CORE,
        "overlap": OVERLAP,
        "tiles": manifest,
    }, indent=2) + "\n", encoding="utf-8")
    return accumulation / np.maximum(weight_sum[..., None], 1e-6)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--atlas", type=Path, required=True)
    parser.add_argument("--concept", type=Path, required=True)
    parser.add_argument("--relief", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--tiles", type=Path, required=True)
    args = parser.parse_args()

    atlas = load_rgb(args.atlas)
    concept = load_rgb(args.concept)
    relief = load_relief(args.relief)
    emission, report = build_emission(atlas, concept, relief)
    stitched = stitch_tiles(emission, args.tiles)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.round(stitched * 255.0).astype(np.uint8), "RGB").save(args.output, optimize=True)
    report.update({
        "output": str(args.output.resolve()),
        "tiles": GRID * GRID,
        "tile_overlap_pixels": OVERLAP,
        "width": SIZE,
        "height": SIZE,
    })
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
