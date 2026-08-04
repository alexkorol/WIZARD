#!/usr/bin/env python3
"""Validate the six additive 50-row Verdigris expansion portfolios."""

from __future__ import annotations

import argparse
import csv
from collections import Counter
from pathlib import Path
import re
import sys
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
DRAFT_DIR = ROOT / "expansion_drafts"
PORTFOLIOS = (
    "weapons.tsv",
    "offhands.tsv",
    "armor_helms.tsv",
    "wearables.tsv",
    "jewelry_relics.tsv",
    "auxiliary.tsv",
)
FIELDS = (
    "art_id",
    "class",
    "tier",
    "display_name",
    "canvas",
    "grid_w",
    "grid_h",
    "desc",
    "historical_anchor",
    "source_url",
    "intake_source",
)
ID_RE = re.compile(r"^[a-z0-9_]+$")


def read_tsv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        return list(reader.fieldnames or []), list(reader)


def allowed_footprints(item_class: str) -> set[tuple[int, int]] | None:
    exact = {
        "dagger": {(1, 2)},
        "sword": {(1, 3)},
        "two_hand": {(2, 4)},
        "spear_polearm": {(1, 4), (2, 4)},
        "buckler": {(2, 2)},
        "shield": {(2, 3), (2, 4)},
        "defensive_offhand": {(1, 2), (2, 2)},
        "rite_focus": {(1, 2), (1, 3), (2, 2)},
        "gloves": {(2, 2)},
        "boots": {(2, 2)},
        "belt": {(2, 1)},
        "ring": {(1, 1)},
        "amulet": {(1, 1)},
        "relic": {(1, 1), (2, 1), (2, 2)},
        "quiver": {(2, 2), (2, 3)},
        "gorytos": {(2, 2), (2, 3)},
        "war_call": {(2, 2), (1, 3), (2, 3)},
        "warbanner": {(1, 4), (2, 4)},
        "quick_rig": {(2, 2)},
        "trap_kit": {(2, 2)},
        "preparation_kit": {(1, 1), (2, 2)},
        "attendant": {(2, 2)},
        "reliquary": {(1, 1), (2, 1), (2, 2)},
        "spoils": {(1, 1), (2, 1)},
    }
    if item_class in exact:
        return exact[item_class]
    if item_class.startswith("body_"):
        return {(2, 3), (2, 4)}
    if item_class.startswith("helmet_"):
        return {(2, 2)}
    if item_class == "axe_adze":
        return {(1, 2), (1, 3)}
    if item_class == "club_mace":
        return {(1, 2), (1, 3), (2, 3)}
    if item_class == "throwing":
        return {(1, 2), (1, 3), (2, 2)}
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--write-merged",
        type=Path,
        help="Write the validated additive 300-row TSV in portfolio order.",
    )
    args = parser.parse_args()

    errors: list[str] = []
    warnings: list[str] = []
    rows: list[dict[str, str]] = []

    for filename in PORTFOLIOS:
        path = DRAFT_DIR / filename
        if not path.is_file():
            errors.append(f"{filename}: missing")
            continue
        header, portfolio = read_tsv(path)
        if header != list(FIELDS):
            errors.append(f"{filename}: schema {header!r}, expected {list(FIELDS)!r}")
        if len(portfolio) != 50:
            errors.append(f"{filename}: {len(portfolio)} rows, expected 50")
        for row_number, row in enumerate(portfolio, 2):
            row["_portfolio"] = filename
            row["_row"] = str(row_number)
        rows.extend(portfolio)

    if len(rows) != 300:
        errors.append(f"combined: {len(rows)} rows, expected 300")

    for key in ("art_id", "display_name"):
        counts = Counter(row.get(key, "") for row in rows)
        for value, count in sorted(counts.items()):
            if value and count > 1:
                errors.append(f"combined: duplicate {key} {value!r} ({count} rows)")

    for row in rows:
        where = f"{row['_portfolio']}:{row['_row']} {row.get('art_id', '<blank>')}"
        missing = [field for field in FIELDS if not row.get(field, "").strip()]
        if missing:
            errors.append(f"{where}: blank fields {', '.join(missing)}")
            continue
        if not ID_RE.fullmatch(row["art_id"]):
            errors.append(f"{where}: art_id is not lowercase ASCII snake case")
        if row["tier"] not in {"1", "2", "3", "4", "5"}:
            errors.append(f"{where}: invalid tier {row['tier']!r}")
        if row["canvas"] not in {"S", "P", "L"}:
            errors.append(f"{where}: invalid canvas {row['canvas']!r}")
        try:
            footprint = (int(row["grid_w"]), int(row["grid_h"]))
        except ValueError:
            errors.append(f"{where}: non-integer footprint")
            continue
        allowed = allowed_footprints(row["class"])
        if allowed is None:
            warnings.append(f"{where}: no footprint rule for class {row['class']!r}")
        elif footprint not in allowed:
            errors.append(
                f"{where}: footprint {footprint[0]}x{footprint[1]} not in "
                + ", ".join(f"{w}x{h}" for w, h in sorted(allowed))
            )
        parsed = urlparse(row["source_url"])
        if parsed.scheme != "https" or not parsed.netloc:
            errors.append(f"{where}: source_url is not an absolute HTTPS URL")

    targets_path = ROOT / "targets.tsv"
    if targets_path.is_file():
        _, existing = read_tsv(targets_path)
        existing_ids = {row["art_id"] for row in existing}
        existing_names = {row["display_name"].casefold() for row in existing}
        for row in rows:
            where = f"{row['_portfolio']}:{row['_row']} {row['art_id']}"
            if row["art_id"] in existing_ids:
                errors.append(f"{where}: art_id collides with targets.tsv")
            if row["display_name"].casefold() in existing_names:
                errors.append(
                    f"{where}: display_name {row['display_name']!r} collides with targets.tsv"
                )

    print(f"Validated {len(rows)} rows across {len(PORTFOLIOS)} portfolios")
    print("Classes:", ", ".join(f"{k}={v}" for k, v in sorted(Counter(r["class"] for r in rows).items())))
    print("Tiers:", ", ".join(f"T{k}={v}" for k, v in sorted(Counter(r["tier"] for r in rows).items())))
    if warnings:
        print(f"WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"  - {warning}")
    if errors:
        print(f"ERRORS ({len(errors)}):")
        for error in errors:
            print(f"  - {error}")
        return 1

    if args.write_merged:
        destination = args.write_merged
        if not destination.is_absolute():
            destination = (Path.cwd() / destination).resolve()
        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=FIELDS, delimiter="\t", lineterminator="\n")
            writer.writeheader()
            writer.writerows({field: row[field] for field in FIELDS} for row in rows)
        print(f"Wrote {destination}")

    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
