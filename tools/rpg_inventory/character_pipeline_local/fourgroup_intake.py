#!/usr/bin/env python3
"""Split four-position character lineups with background-seeking seams.

The originals are never modified. Three dynamic vertical seams travel through
the lowest-detail background between subjects. Each crop masks pixels belonging
to neighboring regions back to the estimated row background, which avoids the
usual problem where a rectangular quarter-cut includes a neighbor's weapon.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
FACTION_PRIORS = ("faction_north", "faction_stonewood", "faction_dustwind", "faction_riverspill")
RESAMPLING = getattr(Image, "Resampling", Image)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def source_files(root: Path) -> list[Path]:
    return sorted(
        (path for path in root.iterdir() if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS),
        key=lambda path: (path.stat().st_mtime_ns, path.name.casefold()),
    )


def shifted(values: np.ndarray, offset: int) -> np.ndarray:
    result = np.full_like(values, np.inf)
    if offset < 0:
        result[:offset] = values[-offset:]
    elif offset > 0:
        result[offset:] = values[:-offset]
    else:
        result[:] = values
    return result


def minimum_seam(cost: np.ndarray, nominal_fraction: float) -> tuple[np.ndarray, dict]:
    height, width = cost.shape
    # The four subjects are positionally stable. Keep the cut close to the
    # midpoint so a low-cost seam cannot route around (and therefore retain)
    # most of a neighboring body.
    half_band = max(10, round(width * 0.045))
    nominal = round(width * nominal_fraction)
    x0 = max(1, nominal - half_band)
    x1 = min(width - 1, nominal + half_band + 1)
    band = cost[:, x0:x1].copy()
    band_width = band.shape[1]
    xs = np.arange(x0, x1)
    band += 0.65 * ((xs - nominal) / max(1, half_band)) ** 2

    max_step = max(2, round(width * 0.004))
    offsets = np.arange(-max_step, max_step + 1)
    back = np.zeros((height, band_width), dtype=np.int16)
    previous = band[0]
    for row in range(1, height):
        candidates = np.stack([shifted(previous, int(offset)) for offset in offsets])
        choices = np.argmin(candidates, axis=0)
        back[row] = offsets[choices]
        previous = band[row] + candidates[choices, np.arange(band_width)]

    seam = np.zeros(height, dtype=np.int32)
    seam[-1] = int(np.argmin(previous))
    for row in range(height - 1, 0, -1):
        seam[row - 1] = seam[row] - int(back[row, seam[row]])
        seam[row - 1] = int(np.clip(seam[row - 1], 0, band_width - 1))
    seam += x0
    seam_cost = cost[np.arange(height), seam]
    return seam, {
        "mean_cost": float(np.mean(seam_cost)),
        "p95_cost": float(np.percentile(seam_cost, 95)),
        "max_excursion": float(np.max(np.abs(seam - nominal)) / width),
    }


def estimate_row_background(rgb: np.ndarray) -> np.ndarray:
    """Estimate the studio backdrop with a per-row color mode, not a median.

    Four bodies can occupy more than half a row, which makes an RGB median turn
    into clothing-colored smears. The backdrop is comparatively uniform, so its
    quantized modal color remains the most common even when it is not a majority.
    """
    height, width, _ = rgb.shape
    sample = np.clip(rgb[:, :: max(1, width // 700)], 0, 255).astype(np.uint8)
    quantized = (sample // 8).astype(np.int32)
    packed = quantized[:, :, 0] * 1024 + quantized[:, :, 1] * 32 + quantized[:, :, 2]
    background = np.empty((height, 3), dtype=np.float32)
    for row in range(height):
        value = int(np.bincount(packed[row], minlength=32768).argmax())
        background[row] = ((value // 1024) * 8 + 4, ((value // 32) % 32) * 8 + 4, (value % 32) * 8 + 4)

    # Suppress one-row mode changes caused by a weapon or floor highlight.
    radius = max(2, round(height * 0.006))
    padded = np.pad(background, ((radius, radius), (0, 0)), mode="edge")
    smoothed = np.empty_like(background)
    for row in range(height):
        smoothed[row] = np.median(padded[row : row + 2 * radius + 1], axis=0)
    return smoothed


def analyze_image(image: Image.Image) -> tuple[list[np.ndarray], list[dict], np.ndarray]:
    original_width, original_height = image.size
    analysis_width = min(520, original_width)
    analysis_height = max(1, round(original_height * analysis_width / original_width))
    small = image.convert("RGB").resize((analysis_width, analysis_height), RESAMPLING.LANCZOS)
    rgb = np.asarray(small, dtype=np.float32)

    # Lineup backgrounds are horizontally stable (white, gray, or blue-gray).
    # The per-row median models both flat backdrops and vertical studio gradients.
    row_background = estimate_row_background(rgb)[:, None, :]
    distance = np.sqrt(np.sum((rgb - row_background) ** 2, axis=2))
    gray = np.mean(rgb, axis=2)
    grad_x = np.abs(np.diff(gray, axis=1, prepend=gray[:, :1]))
    grad_y = np.abs(np.diff(gray, axis=0, prepend=gray[:1, :]))
    texture = grad_x + grad_y
    cost = np.clip(distance / 34.0, 0, 6) + np.clip(texture / 28.0, 0, 5)

    seams_small = []
    metrics = []
    foreground = (distance > 26) | (texture > 24)
    for fraction in (0.25, 0.50, 0.75):
        seam, metric = minimum_seam(cost, fraction)
        neighborhood = []
        for delta in range(-2, 3):
            x = np.clip(seam + delta, 0, analysis_width - 1)
            neighborhood.append(foreground[np.arange(analysis_height), x])
        metric["foreground_fraction"] = float(np.mean(np.stack(neighborhood)))
        metric["risk"] = "high" if metric["foreground_fraction"] > 0.16 or metric["p95_cost"] > 3.2 else (
            "medium" if metric["foreground_fraction"] > 0.08 or metric["p95_cost"] > 2.3 else "low"
        )
        seams_small.append(seam)
        metrics.append(metric)

    source_rows = np.arange(original_height)
    analysis_rows = np.linspace(0, original_height - 1, analysis_height)
    seams = [
        np.rint(np.interp(source_rows, analysis_rows, seam) * original_width / analysis_width).astype(np.int32)
        for seam in seams_small
    ]
    full_rgb = np.asarray(image.convert("RGB"), dtype=np.float32)
    return seams, metrics, estimate_row_background(full_rgb)


def mask_slot(image: Image.Image, left: np.ndarray, right: np.ndarray, row_background: np.ndarray) -> Image.Image:
    rgb = np.asarray(image.convert("RGB"), dtype=np.uint8).copy()
    height, width, _ = rgb.shape
    pad = max(6, round(width * 0.008))
    x0 = max(0, int(np.min(left)) - pad)
    x1 = min(width, int(np.max(right)) + pad + 1)
    crop = rgb[:, x0:x1].copy()
    background = np.clip(row_background, 0, 255).astype(np.uint8)
    for row in range(height):
        local_left = int(np.clip(left[row] - x0, 0, crop.shape[1]))
        local_right = int(np.clip(right[row] - x0, 0, crop.shape[1]))
        if local_left:
            crop[row, :local_left] = background[row]
        if local_right < crop.shape[1]:
            crop[row, local_right:] = background[row]
    return Image.fromarray(crop, mode="RGB")


def overlay_image(image: Image.Image, seams: list[np.ndarray], metrics: list[dict], index: int) -> Image.Image:
    preview = image.convert("RGB").copy()
    draw = ImageDraw.Draw(preview)
    colors = ("#e34d59", "#e8a23a", "#38b9a0")
    step = max(1, image.height // 350)
    for seam, color, metric in zip(seams, colors, metrics):
        points = [(int(seam[row]), row) for row in range(0, image.height, step)]
        draw.line(points, fill=color, width=max(2, image.width // 500))
        draw.text((points[0][0] + 5, 8), metric["risk"].upper(), fill=color)
    draw.rectangle((0, 0, min(image.width, 450), 34), fill=(10, 14, 12))
    draw.text((8, 8), f"#{index:03d}  " + " | ".join(f"{i + 1}:{name.removeprefix('faction_')}" for i, name in enumerate(FACTION_PRIORS)), fill="white")
    return preview


def make_contact_sheets(overlays: list[Path], destination: Path, columns: int = 4, rows: int = 5) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    thumb_width, thumb_height = 440, 300
    page_size = columns * rows
    for page, start in enumerate(range(0, len(overlays), page_size), 1):
        page_paths = overlays[start:start + page_size]
        sheet = Image.new("RGB", (columns * thumb_width, rows * thumb_height), "#111512")
        for offset, path in enumerate(page_paths):
            with Image.open(path) as image:
                copy = image.convert("RGB")
                copy.thumbnail((thumb_width - 8, thumb_height - 8), RESAMPLING.LANCZOS)
                x = (offset % columns) * thumb_width + (thumb_width - copy.width) // 2
                y = (offset // columns) * thumb_height + (thumb_height - copy.height) // 2
                sheet.paste(copy, (x, y))
        sheet.save(destination / f"seam_sheet_{page:02d}.jpg", quality=90)


def make_crop_audit_sheet(crop_root: Path, destination: Path, board_indices: list[int]) -> None:
    """Render selected four-crop rows so the real masked outputs can be audited."""
    thumb_width, thumb_height = 360, 300
    sheet = Image.new("RGB", (4 * thumb_width, len(board_indices) * thumb_height), "#111512")
    for row, board_index in enumerate(board_indices):
        for position in range(1, 5):
            matches = sorted(crop_root.glob(f"{board_index:03d}__p{position}__*.png"))
            if not matches:
                continue
            with Image.open(matches[0]) as image:
                copy = image.convert("RGB")
                copy.thumbnail((thumb_width - 12, thumb_height - 36), RESAMPLING.LANCZOS)
                x = (position - 1) * thumb_width + (thumb_width - copy.width) // 2
                y = row * thumb_height + 28 + (thumb_height - 32 - copy.height) // 2
                sheet.paste(copy, (x, y))
            draw = ImageDraw.Draw(sheet)
            draw.text(((position - 1) * thumb_width + 8, row * thumb_height + 7), f"#{board_index:03d} p{position}", fill="white")
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination, quality=92)


def run(args: argparse.Namespace) -> dict:
    args.preview.mkdir(parents=True, exist_ok=True)
    overlay_dir = args.preview / "overlays"
    overlay_dir.mkdir(parents=True, exist_ok=True)
    if args.crops:
        args.crops.mkdir(parents=True, exist_ok=True)

    files = source_files(args.source)
    seen_hashes: dict[str, str] = {}
    records = []
    overlays = []
    crop_count = 0
    for index, path in enumerate(files, 1):
        digest = sha256_file(path)
        duplicate_of = seen_hashes.get(digest)
        if duplicate_of:
            records.append(
                {
                    "source_index": index,
                    "source_name": path.name,
                    "source_sha256": digest,
                    "position": "",
                    "faction_prior": "",
                    "crop_name": "",
                    "crop_risk": "duplicate",
                    "duplicate_of": duplicate_of,
                    "seam_metrics": "",
                }
            )
            continue
        seen_hashes[digest] = path.name
        with Image.open(path) as opened:
            image = opened.convert("RGB")
        seams, metrics, row_background = analyze_image(image)
        overlay = overlay_image(image, seams, metrics, index)
        overlay_path = overlay_dir / f"{index:03d}.jpg"
        overlay.thumbnail((1320, 900), RESAMPLING.LANCZOS)
        overlay.save(overlay_path, quality=90)
        overlays.append(overlay_path)

        boundaries = [np.zeros(image.height, dtype=np.int32), *seams, np.full(image.height, image.width, dtype=np.int32)]
        for position in range(1, 5):
            adjacent = []
            if position > 1:
                adjacent.append(metrics[position - 2]["risk"])
            if position < 4:
                adjacent.append(metrics[position - 1]["risk"])
            crop_risk = "high" if "high" in adjacent else ("medium" if "medium" in adjacent else "low")
            crop_name = f"{index:03d}__p{position}__{path.stem}.png"
            if args.crops:
                crop = mask_slot(image, boundaries[position - 1], boundaries[position], row_background)
                crop.save(args.crops / crop_name, optimize=True)
                crop_count += 1
            records.append(
                {
                    "source_index": index,
                    "source_name": path.name,
                    "source_sha256": digest,
                    "position": position,
                    "faction_prior": FACTION_PRIORS[position - 1],
                    "crop_name": crop_name,
                    "crop_risk": crop_risk,
                    "duplicate_of": "",
                    "seam_metrics": json.dumps(metrics, separators=(",", ":")),
                }
            )

    make_contact_sheets(overlays, args.preview / "sheets")
    manifest_path = args.preview / "crop_manifest.tsv"
    with manifest_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0]), delimiter="\t")
        writer.writeheader()
        writer.writerows(records)
    return {
        "source_files": len(files),
        "unique_sources": len(seen_hashes),
        "duplicate_sources": len(files) - len(seen_hashes),
        "crop_records": sum(bool(record["crop_name"]) for record in records),
        "crops_written": crop_count,
        "high_risk_crops": sum(record["crop_risk"] == "high" for record in records),
        "medium_risk_crops": sum(record["crop_risk"] == "medium" for record in records),
        "manifest": str(manifest_path),
        "preview_sheets": math.ceil(len(overlays) / 20),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path(r"C:\Users\Alex\Downloads\4group_chars"))
    parser.add_argument("--preview", type=Path, required=True)
    parser.add_argument("--crops", type=Path, help="Write masked position crops to this directory")
    return parser.parse_args()


if __name__ == "__main__":
    parsed = parse_args()
    if not parsed.source.is_dir():
        raise SystemExit(f"Source folder not found: {parsed.source}")
    print(json.dumps(run(parsed), indent=2))
