#!/usr/bin/env python3
"""Finalize remaining four-group sorter records using user-reviewed CLIP feedback."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import shutil
from collections import Counter
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path

from build_fourgroup_manifest import make_audit_sheets


AXES = ("STR", "DEX", "INT")

# Direct visual audit of every label that the feedback model wanted to change.
# These correct the remaining obvious whole-kit misses (for example, archers
# proposed as INT or ritual lantern/staff carriers proposed as DEX).
VISUAL_AXIS_OVERRIDES = {
    (21, 4): "DEX",
    (30, 2): "STR",
    (35, 4): "STR",
    (57, 2): "STR",
    (77, 1): "STR",
    (90, 3): "DEX",
    (94, 2): "STR",
    (97, 3): "DEX",
    (110, 2): "DEX",
    (125, 1): "STR",
    (142, 1): "INT",
    (159, 4): "STR",
    (161, 1): "STR",
    (161, 4): "INT",
    (166, 2): "INT",
    (167, 2): "INT",
    (172, 4): "INT",
    (178, 3): "INT",
    (183, 1): "STR",
    (184, 4): "INT",
    (186, 2): "INT",
    (193, 4): "DEX",
    (197, 1): "INT",
    (209, 1): "INT",
    (209, 4): "INT",
    (212, 4): "STR",
    (239, 3): "INT",
    (261, 4): "INT",
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def atomic_write(path: Path, payload: bytes) -> None:
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_bytes(payload)
    os.replace(temporary, path)


def proposed_axis(row: dict) -> tuple[str, float, dict[str, float]]:
    semantic = json.loads(row["scores"])["axis"]
    reference = json.loads(row["reference_scores"])["axis"]
    combined = {axis: 0.5 * semantic[axis] + 0.5 * reference[axis] for axis in AXES}
    ranking = sorted(AXES, key=combined.get, reverse=True)
    return ranking[0], combined[ranking[0]] - combined[ranking[1]], combined


def confidence(margin: float) -> str:
    if margin >= 0.015:
        return "high"
    if margin >= 0.007:
        return "medium"
    return "low"


def build_plan(state: dict, score_rows: dict[str, dict], ladder_root: Path) -> list[dict]:
    plan = []
    for review_id, record in state.get("review_items", {}).items():
        if record.get("status") != "needs_review" or "4group_chars" not in record.get("original_source", ""):
            continue
        name = record["original_name"]
        if name not in score_rows:
            raise RuntimeError(f"No feedback score for remaining review item: {name}")
        row = score_rows[name]
        axis, margin, combined = proposed_axis(row)
        visual_override = VISUAL_AXIS_OVERRIDES.get((int(row["board_index"]), int(row["position"])))
        if visual_override:
            axis = visual_override
        eligibility_margin = float(row["eligibility_margin"])
        should_ignore = row["eligibility"] != "human" and eligibility_margin >= 0.020
        faction = record["faction"]
        tier = int(record["tier"])
        folder = record["folder"] if should_ignore else f"{faction} - {axis} - tier {tier}"
        source = Path(record["current_path"]).resolve()
        destination = (
            ladder_root / ".ladder-sorter" / "ignored" / source.name
            if should_ignore
            else ladder_root / folder / source.name
        ).resolve()
        plan.append(
            {
                "review_id": review_id,
                "record": record,
                "row": row,
                "source_name": name,
                "board_index": int(row["board_index"]),
                "position": int(row["position"]),
                "faction": faction,
                "axis": axis,
                "tier": tier,
                "folder": folder,
                "confidence": confidence(margin),
                "action": "ignore" if should_ignore else "assign",
                "note": (
                    ("Direct visual audit override after feedback-model rescore. " if visual_override else
                     f"User-feedback centroid plus equipment-semantic axis blend; margin {margin:.4f}. ")
                    + f"Retained prior board-calibrated tier {tier}."
                ),
                "axis_margin": margin,
                "axis_scores": combined,
                "source": source,
                "destination": destination,
                "old_axis": record["axis"],
                "old_folder": record["folder"],
                "old_status": record["status"],
                "eligibility": row["eligibility"],
                "eligibility_margin": eligibility_margin,
                "visual_override": bool(visual_override),
            }
        )
    return plan


def manifest_rows(plan: list[dict]) -> list[dict]:
    return [
        {
            "review_id": item["review_id"],
            "source_name": item["source_name"],
            "board_index": item["board_index"],
            "position": item["position"],
            "faction": item["faction"],
            "old_axis": item["old_axis"],
            "axis": item["axis"],
            "tier": item["tier"],
            "confidence": item["confidence"],
            "action": item["action"],
            "axis_margin": f"{item['axis_margin']:.6f}",
            "eligibility": item["eligibility"],
            "eligibility_margin": f"{item['eligibility_margin']:.6f}",
            "visual_override": item["visual_override"],
            "source_path": str(item["source"]),
            "destination_path": str(item["destination"]),
            "note": item["note"],
        }
        for item in plan
    ]


def write_manifest(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]), delimiter="\t")
        writer.writeheader()
        writer.writerows(rows)


def apply_plan(args: argparse.Namespace, state: dict, plan: list[dict], rows: list[dict]) -> Path:
    state_path = args.state.resolve()
    data_root = state_path.parent
    feedback_path = data_root / "feedback.jsonl"
    original_state = state_path.read_bytes()
    original_feedback = feedback_path.read_bytes() if feedback_path.exists() else b""
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_root = data_root / f"feedback-resort-backup-{stamp}"
    backup_root.mkdir(parents=True, exist_ok=False)
    (backup_root / "state.json").write_bytes(original_state)
    (backup_root / "feedback.jsonl").write_bytes(original_feedback)
    write_manifest(backup_root / "apply_manifest.tsv", rows)

    destinations = set()
    for item in plan:
        if not item["source"].is_file():
            raise FileNotFoundError(item["source"])
        if sha256_file(item["source"]) != item["record"]["sha256"]:
            raise RuntimeError(f"Hash mismatch before move: {item['source']}")
        if item["destination"] != item["source"] and item["destination"].exists():
            raise FileExistsError(item["destination"])
        if item["destination"] in destinations:
            raise RuntimeError(f"Duplicate destination: {item['destination']}")
        destinations.add(item["destination"])

    new_state = deepcopy(state)
    timestamp = utc_now()
    moved = []
    try:
        for item in plan:
            if item["destination"] != item["source"]:
                item["destination"].parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(item["source"]), str(item["destination"]))
                moved.append(item)
            record = new_state["review_items"][item["review_id"]]
            record.setdefault("history", []).append(
                {
                    "timestamp": timestamp,
                    "event": "feedback_trained_best_effort_finalize",
                    "old_folder": item["old_folder"],
                    "new_folder": item["folder"] if item["action"] == "assign" else "ignored",
                    "old_status": item["old_status"],
                    "new_status": "assistant_sorted" if item["action"] == "assign" else "ignored",
                    "axis_margin": round(item["axis_margin"], 6),
                }
            )
            record["current_path"] = str(item["destination"])
            record["confidence"] = item["confidence"]
            record["assistant_note"] = item["note"]
            record["method"] = "feedback_trained_visual_best_effort_v2"
            if item["action"] == "ignore":
                record["status"] = "ignored"
                record["ignored_at"] = timestamp
                record["ignore_reason"] = "High-confidence spirit or construct eligibility result"
            else:
                record["axis"] = item["axis"]
                record["folder"] = item["folder"]
                record["status"] = "assistant_sorted"

        event = {
            "timestamp": timestamp,
            "event": "feedback_trained_best_effort_batch",
            "records": len(plan),
            "assigned": sum(item["action"] == "assign" for item in plan),
            "ignored": sum(item["action"] == "ignore" for item in plan),
            "axis_changes": sum(item["axis"] != item["old_axis"] for item in plan if item["action"] == "assign"),
            "backup_root": str(backup_root),
            "manifest": str(backup_root / "apply_manifest.tsv"),
        }
        new_state["updated_at"] = timestamp
        new_state["event_count"] = int(new_state.get("event_count", 0)) + 1
        new_feedback = original_feedback
        if new_feedback and not new_feedback.endswith(b"\n"):
            new_feedback += b"\n"
        new_feedback += json.dumps(event, ensure_ascii=False).encode("utf-8") + b"\n"
        atomic_write(state_path, json.dumps(new_state, indent=2, ensure_ascii=False).encode("utf-8"))
        atomic_write(feedback_path, new_feedback)
    except Exception:
        for item in reversed(moved):
            if item["destination"].exists() and not item["source"].exists():
                shutil.move(str(item["destination"]), str(item["source"]))
        atomic_write(state_path, original_state)
        atomic_write(feedback_path, original_feedback)
        raise
    return backup_root


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--state", type=Path, required=True)
    parser.add_argument("--scores", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--crops", type=Path)
    parser.add_argument("--audit-dir", type=Path)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    state = json.loads(args.state.read_text(encoding="utf-8"))
    with args.scores.open("r", encoding="utf-8", newline="") as handle:
        score_rows = {row["crop_name"]: row for row in csv.DictReader(handle, delimiter="\t")}
    ladder_root = args.state.resolve().parent.parent
    plan = build_plan(state, score_rows, ladder_root)
    if not plan:
        raise SystemExit("No remaining four-group needs_review records")
    rows = manifest_rows(plan)
    write_manifest(args.manifest, rows)

    if args.crops and args.audit_dir:
        changed = [row for row in rows if row["action"] == "ignore" or row["old_axis"] != row["axis"]]
        make_audit_sheets(changed, args.crops, args.audit_dir, "feedback_changes")

    backup_root = apply_plan(args, state, plan, rows) if args.apply else None
    print(
        json.dumps(
            {
                "records": len(plan),
                "actions": dict(Counter(item["action"] for item in plan)),
                "axes_before": dict(Counter(item["old_axis"] for item in plan if item["action"] == "assign")),
                "axes_after": dict(Counter(item["axis"] for item in plan if item["action"] == "assign")),
                "axis_changes": sum(item["old_axis"] != item["axis"] for item in plan if item["action"] == "assign"),
                "manifest": str(args.manifest),
                "backup_root": str(backup_root) if backup_root else None,
                "applied": args.apply,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
