#!/usr/bin/env python3
"""Turn CLIP diagnostics into conservative apply/review/ignore decisions."""

from __future__ import annotations

import argparse
import csv
import json
import math
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw


RESAMPLING = getattr(Image, "Resampling", Image)


def softmax(scores: dict[str, float], scale: float = 55.0) -> dict[str, float]:
    maximum = max(scores.values())
    values = {key: math.exp((value - maximum) * scale) for key, value in scores.items()}
    total = sum(values.values())
    return {key: value / total for key, value in values.items()}


def ranked(scores: dict[str, float]) -> tuple[str, float]:
    order = sorted(scores, key=scores.get, reverse=True)
    return order[0], scores[order[0]] - scores[order[1]]


def axis_decision(row: dict) -> tuple[str, str, str]:
    text_axis = row["axis"]
    reference_axis = row["axis_reference"]
    text_margin = float(row["axis_margin"])
    reference_margin = float(row["axis_reference_margin"])
    if text_axis == reference_axis:
        confidence = "high" if max(text_margin, reference_margin) >= 0.014 else "medium"
        return text_axis, confidence, "semantic and reviewed-reference models agree"
    if text_margin >= 0.018 and reference_margin < 0.020:
        return text_axis, "high", "strong equipment-semantic score"
    if reference_margin >= 0.024 and text_margin < 0.010:
        return reference_axis, "high", "strong match to reviewed ladder examples"
    if text_margin >= 0.010:
        return text_axis, "medium", "moderate equipment-semantic score"
    if reference_margin >= 0.014:
        return reference_axis, "medium", "moderate match to reviewed ladder examples"
    return text_axis, "low", "axis models disagree without a clear margin"


def make_audit_sheets(rows: list[dict], crops: Path, destination: Path, prefix: str) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    cell_width, cell_height = 360, 330
    for page, start in enumerate(range(0, len(rows), 16), 1):
        sheet = Image.new("RGB", (4 * cell_width, 4 * cell_height), "#111512")
        draw = ImageDraw.Draw(sheet)
        for offset, row in enumerate(rows[start : start + 16]):
            path = crops / row["source_name"]
            x0 = (offset % 4) * cell_width
            y0 = (offset // 4) * cell_height
            if path.is_file():
                with Image.open(path) as image:
                    copy = image.convert("RGB")
                    copy.thumbnail((cell_width - 12, cell_height - 58), RESAMPLING.LANCZOS)
                    sheet.paste(copy, (x0 + (cell_width - copy.width) // 2, y0 + 52 + (cell_height - 56 - copy.height) // 2))
            draw.text((x0 + 7, y0 + 6), f"#{int(row['board_index']):03d} p{row['position']}  {row['action'].upper()}", fill="white")
            draw.text((x0 + 7, y0 + 25), f"{row['faction'].removeprefix('faction_')} {row['axis']} t{row['tier']}  {row['confidence']}", fill="#e8b55e")
        sheet.save(destination / f"{prefix}_{page:02d}.jpg", quality=92)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--scores", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--crops", type=Path)
    parser.add_argument("--audit-dir", type=Path)
    args = parser.parse_args()

    with args.scores.open("r", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle, delimiter="\t"))
    boards: dict[int, list[dict]] = defaultdict(list)
    for row in rows:
        boards[int(row["board_index"])].append(row)

    board_tiers = {}
    for board_index, board_rows in boards.items():
        usable = [
            row for row in board_rows
            if row["eligibility"] == "human" and float(row["eligibility_margin"]) >= 0.020
        ] or [row for row in board_rows if row["eligibility"] == "human"] or board_rows
        combined = {"1": 0.0, "2": 0.0, "3": 0.0}
        for row in usable:
            text = softmax({key: float(value) for key, value in json.loads(row["scores"])["tier"].items()})
            reference = softmax({key: float(value) for key, value in json.loads(row["reference_scores"])["tier"].items()})
            for tier in combined:
                combined[tier] += 0.35 * text[tier] + 0.65 * reference[tier]
        combined = {tier: value / len(usable) for tier, value in combined.items()}
        tier, margin = ranked(combined)
        tier_confidence = "high" if margin >= 0.22 else ("medium" if margin >= 0.10 else "low")
        board_tiers[board_index] = (tier, tier_confidence, margin, combined)

    output = []
    for row in rows:
        board_index = int(row["board_index"])
        position = int(row["position"])
        eligibility_margin = float(row["eligibility_margin"])
        tier, tier_confidence, tier_margin, tier_scores = board_tiers[board_index]
        axis, axis_confidence, axis_reason = axis_decision(row)
        faction = row["faction_prior"]

        if row["eligibility"] != "human":
            action = "ignore"
            confidence = "high" if eligibility_margin >= 0.025 else "medium"
            note = f"Non-character vision margin {eligibility_margin:.3f}; beast, spirit, or construct candidate"
        else:
            eligibility_uncertain = eligibility_margin < 0.060
            action = "review" if eligibility_uncertain or axis_confidence == "low" or tier_confidence == "low" else "assign"
            confidence = "high" if axis_confidence == tier_confidence == "high" and not eligibility_uncertain else "medium"
            note = (
                f"Position p{position} faction prior; {axis_reason}; "
                f"board-level tier margin {tier_margin:.3f}."
            )
            if eligibility_uncertain:
                note += f" Human/non-character margin is only {eligibility_margin:.3f}."

        output.append(
            {
                "index": row["index"],
                "source_name": row["crop_name"],
                "board_index": board_index,
                "position": position,
                "faction": faction,
                "axis": axis,
                "tier": tier,
                "confidence": confidence,
                "action": action,
                "note": note,
                "diagnostic": json.dumps(
                    {
                        "eligibility": row["eligibility"],
                        "eligibility_margin": eligibility_margin,
                        "axis_text": row["axis"],
                        "axis_reference": row["axis_reference"],
                        "axis_confidence": axis_confidence,
                        "tier_confidence": tier_confidence,
                        "tier_scores": tier_scores,
                    },
                    separators=(",", ":"),
                ),
            }
        )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(output[0]), delimiter="\t")
        writer.writeheader()
        writer.writerows(output)
    counts = {action: sum(row["action"] == action for row in output) for action in ("assign", "review", "ignore")}
    tier_counts = {tier: sum(row["tier"] == tier and row["action"] != "ignore" for row in output) for tier in ("1", "2", "3")}
    axis_counts = {axis: sum(row["axis"] == axis and row["action"] != "ignore" for row in output) for axis in ("STR", "DEX", "INT")}
    if args.crops and args.audit_dir:
        ignored_rows = [row for row in output if row["action"] == "ignore"]
        make_audit_sheets(ignored_rows, args.crops, args.audit_dir, "ignored")
        for action in ("assign", "review"):
            candidates = [row for row in output if row["action"] == action]
            step = max(1, len(candidates) // 64)
            sample = candidates[::step][:64]
            make_audit_sheets(sample, args.crops, args.audit_dir, f"{action}_sample")
    print(json.dumps({"rows": len(output), **counts, "tiers": tier_counts, "axes": axis_counts, "output": str(args.output)}, indent=2))


if __name__ == "__main__":
    main()
