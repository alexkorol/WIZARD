#!/usr/bin/env python3
"""Transactionally replace four-character intake crops without losing sorter labels."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def atomic_bytes_write(path: Path, payload: bytes) -> None:
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_bytes(payload)
    os.replace(temporary, path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ladder-root", type=Path, required=True)
    parser.add_argument("--replacement-root", type=Path, required=True)
    parser.add_argument("--expected", type=int, default=1064)
    return parser.parse_args()


def main(args: argparse.Namespace) -> dict:
    ladder_root = args.ladder_root.resolve()
    replacement_root = args.replacement_root.resolve()
    data_root = ladder_root / ".ladder-sorter"
    state_path = data_root / "state.json"
    feedback_path = data_root / "feedback.jsonl"

    original_state_bytes = state_path.read_bytes()
    original_feedback_bytes = feedback_path.read_bytes() if feedback_path.exists() else b""
    state = json.loads(original_state_bytes.decode("utf-8"))
    review_items = state.get("review_items", {})
    selected = [
        (review_id, record)
        for review_id, record in review_items.items()
        if "4group_chars_cropped" in str(record.get("original_source", "")).casefold()
        and record.get("crop_version") != "v2"
    ]
    if len(selected) != args.expected:
        raise RuntimeError(f"Expected {args.expected} v1 crop records, found {len(selected)}")

    plans = []
    destination_paths: set[Path] = set()
    for review_id, record in selected:
        source = replacement_root / record["original_name"]
        destination = Path(record["current_path"]).resolve()
        if not source.is_file():
            raise FileNotFoundError(f"Missing replacement crop: {source}")
        if not destination.is_file():
            raise FileNotFoundError(f"Missing live crop: {destination}")
        if destination in destination_paths:
            raise RuntimeError(f"Duplicate live destination: {destination}")
        destination_paths.add(destination)
        old_sha = sha256_file(destination)
        if old_sha != record["sha256"]:
            raise RuntimeError(
                f"Live crop changed outside state for {review_id}: state={record['sha256']} disk={old_sha}"
            )
        new_sha = sha256_file(source)
        plans.append(
            {
                "review_id": review_id,
                "record": record,
                "source": source,
                "destination": destination,
                "old_sha256": old_sha,
                "new_sha256": new_sha,
            }
        )

    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_root = data_root / f"fourgroup-crop-v1-backup-{stamp}"
    files_backup = backup_root / "files"
    files_backup.mkdir(parents=True, exist_ok=False)
    (backup_root / "state.json").write_bytes(original_state_bytes)
    (backup_root / "feedback.jsonl").write_bytes(original_feedback_bytes)

    manifest = []
    for plan in plans:
        backup = files_backup / plan["review_id"] / plan["destination"].name
        backup.parent.mkdir(parents=True, exist_ok=False)
        shutil.copy2(plan["destination"], backup)
        plan["backup"] = backup
        manifest.append(
            {
                "review_id": plan["review_id"],
                "live_path": str(plan["destination"]),
                "backup_path": str(backup),
                "replacement_path": str(plan["source"]),
                "old_sha256": plan["old_sha256"],
                "new_sha256": plan["new_sha256"],
                "status": plan["record"].get("status"),
                "faction": plan["record"].get("faction"),
                "axis": plan["record"].get("axis"),
                "tier": plan["record"].get("tier"),
            }
        )
    (backup_root / "replacement_manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    timestamp = utc_now()
    replaced = []
    try:
        for plan in plans:
            temporary = plan["destination"].with_name(plan["destination"].name + ".crop-v2.tmp")
            shutil.copy2(plan["source"], temporary)
            os.replace(temporary, plan["destination"])
            replaced.append(plan)
            record = plan["record"]
            record["sha256"] = plan["new_sha256"]
            record["crop_version"] = "v2"
            record["replacement_source"] = str(plan["source"])
            record.setdefault("history", []).append(
                {
                    "timestamp": timestamp,
                    "event": "crop_replacement",
                    "crop_version": "v2",
                    "old_sha256": plan["old_sha256"],
                    "new_sha256": plan["new_sha256"],
                    "backup_path": str(plan["backup"]),
                }
            )

        event = {
            "timestamp": timestamp,
            "event": "crop_replacement_batch",
            "crop_version": "v2",
            "records": len(plans),
            "backup_root": str(backup_root),
            "reason": "Replaced wandering-seam crops and row-color background smears",
        }
        state["updated_at"] = timestamp
        state["event_count"] = int(state.get("event_count", 0)) + 1
        new_state_bytes = json.dumps(state, indent=2, ensure_ascii=False).encode("utf-8")
        new_feedback_bytes = original_feedback_bytes
        if new_feedback_bytes and not new_feedback_bytes.endswith(b"\n"):
            new_feedback_bytes += b"\n"
        new_feedback_bytes += json.dumps(event, ensure_ascii=False).encode("utf-8") + b"\n"
        atomic_bytes_write(state_path, new_state_bytes)
        atomic_bytes_write(feedback_path, new_feedback_bytes)
    except Exception:
        for plan in replaced:
            shutil.copy2(plan["backup"], plan["destination"])
        atomic_bytes_write(state_path, original_state_bytes)
        atomic_bytes_write(feedback_path, original_feedback_bytes)
        raise

    mismatches = []
    for plan in plans:
        disk_sha = sha256_file(plan["destination"])
        if disk_sha != plan["new_sha256"]:
            mismatches.append(str(plan["destination"]))
    if mismatches:
        raise RuntimeError(f"Post-write hash mismatches: {len(mismatches)}")

    return {
        "replaced": len(plans),
        "backup_root": str(backup_root),
        "state_path": str(state_path),
        "feedback_path": str(feedback_path),
        "hash_mismatches": len(mismatches),
    }


if __name__ == "__main__":
    print(json.dumps(main(parse_args()), indent=2))
