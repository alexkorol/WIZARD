#!/usr/bin/env python3
"""Render labeled contact sheets from an item-audit TSV."""

from __future__ import annotations

import argparse
import csv
import math
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


def fit_image(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as source:
        image = ImageOps.contain(source.convert("RGB"), size)
    canvas = Image.new("RGB", size, "#ecece8")
    canvas.paste(image, ((size[0] - image.width) // 2, (size[1] - image.height) // 2))
    return canvas


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--audit", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--group", choices=("item_class", "construction", "weapon_family"), default="item_class")
    parser.add_argument("--columns", type=int, default=5)
    parser.add_argument("--thumb", type=int, default=240)
    args = parser.parse_args()

    groups: dict[str, list[dict[str, str]]] = defaultdict(list)
    with args.audit.open("r", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle, delimiter="\t"):
            groups[row[args.group]].append(row)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default()
    label_height = 46
    for name, rows in sorted(groups.items()):
        cols = min(args.columns, len(rows))
        page_rows = math.ceil(len(rows) / cols)
        sheet = Image.new(
            "RGB",
            (cols * args.thumb, page_rows * (args.thumb + label_height)),
            "#20231f",
        )
        draw = ImageDraw.Draw(sheet)
        for index, row in enumerate(rows):
            x = (index % cols) * args.thumb
            y = (index // cols) * (args.thumb + label_height)
            sheet.paste(fit_image(Path(row["path"]), (args.thumb, args.thumb)), (x, y))
            label = f"{index + 1:02d} {row['name'][:28]}\n{row['item_class']} / {row['construction']}"
            draw.multiline_text((x + 5, y + args.thumb + 4), label, fill="#f3f0df", font=font, spacing=2)
        output = args.output_dir / f"{args.group}__{name}.jpg"
        sheet.save(output, quality=90)
        print(output)


if __name__ == "__main__":
    main()
