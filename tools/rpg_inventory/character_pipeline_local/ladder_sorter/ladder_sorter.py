#!/usr/bin/env python3
"""Local review UI for safely sorting separated character boards into ladders."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import mimetypes
import os
import re
import secrets
import shutil
import sys
import threading
import time
import urllib.parse
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


HERE = Path(__file__).resolve().parent
UI_DIR = HERE / "ui"
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
FACTION_LABELS = {
    "faction_north": "North",
    "faction_stonewood": "Stonewood",
    "faction_dustwind": "Dustwind",
    "faction_riverspill": "Riverspill",
}
NUMBERED_RE = re.compile(r"\((\d+)\)\.(?:png|jpe?g|webp)$", re.IGNORECASE)
CROP_RE = re.compile(r"^(\d+)__p([1-4])__", re.IGNORECASE)
LADDER_RE = re.compile(r"^(faction_[^-]+) - (STR|DEX|INT) - tier ([123])$", re.IGNORECASE)
MISC_RE = re.compile(r"^(faction_[^-]+) - Misc$", re.IGNORECASE)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def inside(path: Path, root: Path) -> bool:
    try:
        path.resolve().relative_to(root.resolve())
        return True
    except ValueError:
        return False


def atomic_json_write(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(temporary, path)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def item_id(path: Path) -> str:
    stat = path.stat()
    seed = f"{path.name}\0{stat.st_size}\0{stat.st_mtime_ns}".encode("utf-8", "surrogatepass")
    return hashlib.sha1(seed).hexdigest()[:20]


def folder_metadata(folder_name: str) -> dict:
    match = LADDER_RE.match(folder_name)
    misc = MISC_RE.match(folder_name)
    if not match and not misc:
        raise ValueError(f"Unrecognized ladder folder: {folder_name}")
    return {
        "faction": (match or misc).group(1).lower(),
        "axis": match.group(2).upper() if match else "MISC",
        "tier": int(match.group(3)) if match else None,
    }


class SorterApp:
    def __init__(self, source_root: Path, ladder_root: Path):
        self.source_root = source_root.resolve()
        self.ladder_root = ladder_root.resolve()
        self.data_root = self.ladder_root / ".ladder-sorter"
        self.state_path = self.data_root / "state.json"
        self.feedback_path = self.data_root / "feedback.jsonl"
        self.lock = threading.RLock()
        self.csrf_token = secrets.token_urlsafe(24)
        self.image_tokens: dict[str, Path] = {}
        self.state = self._load_state()

    def _load_state(self) -> dict:
        default = {
            "version": 2,
            "created_at": utc_now(),
            "updated_at": utc_now(),
            "deferred": {},
            "undo_stack": [],
            "event_count": 0,
            "review_items": {},
        }
        if not self.state_path.exists():
            return default
        try:
            loaded = json.loads(self.state_path.read_text(encoding="utf-8"))
            default.update(loaded)
        except (OSError, json.JSONDecodeError):
            pass
        return default

    def save_state(self) -> None:
        self.state["updated_at"] = utc_now()
        atomic_json_write(self.state_path, self.state)

    def log_event(self, event: dict) -> None:
        event = {"timestamp": utc_now(), **event}
        self.data_root.mkdir(parents=True, exist_ok=True)
        with self.feedback_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event, ensure_ascii=False) + "\n")
        self.state["event_count"] = int(self.state.get("event_count", 0)) + 1

    def source_files(self) -> list[Path]:
        return sorted(
            (
                path
                for path in self.source_root.iterdir()
                if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
            ),
            key=lambda path: (path.stat().st_mtime_ns, path.name.casefold()),
        )

    def ladder_folders(self) -> list[dict]:
        folders = []
        for path in sorted((p for p in self.ladder_root.iterdir() if p.is_dir() and p != self.data_root), key=lambda p: p.name.casefold()):
            match = LADDER_RE.match(path.name)
            misc = MISC_RE.match(path.name)
            if not match and not misc:
                continue
            faction = (match or misc).group(1).lower()
            axis = match.group(2).upper() if match else "MISC"
            tier = int(match.group(3)) if match else None
            images = sorted(p for p in path.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS)
            cover = images[0] if images else None
            cover_token = self.register_image(cover) if cover else None
            folders.append(
                {
                    "name": path.name,
                    "faction": faction,
                    "factionLabel": FACTION_LABELS.get(faction, faction),
                    "axis": axis,
                    "tier": tier,
                    "count": len(images),
                    "coverUrl": f"/image/{cover_token}" if cover_token else None,
                }
            )
        return folders

    def register_image(self, path: Path | None) -> str | None:
        if path is None:
            return None
        resolved = path.resolve()
        if not (inside(resolved, self.source_root) or inside(resolved, self.ladder_root)):
            return None
        token = hashlib.sha1(str(resolved).encode("utf-8", "surrogatepass")).hexdigest()
        self.image_tokens[token] = resolved
        return token

    def scan(self) -> dict:
        with self.lock:
            self.image_tokens = {}
            files = self.source_files()
            unsafe_items = []
            numbered_count = 0
            for path in files:
                match = NUMBERED_RE.search(path.name)
                if match:
                    position = int(match.group(1))
                    numbered_count += 1
                    reason = f"Source output position {position} is metadata only; it does not imply faction, axis, or tier"
                else:
                    position = None
                    reason = "Filename has no source-position metadata; assign this board independently"
                unsafe_items.append(self._item_payload(path, position=position, reason=reason))

            deferred = self.state.get("deferred", {})
            for item in unsafe_items:
                item["deferred"] = item["id"] in deferred

            review_items = self.review_items_payload()
            folders = self.ladder_folders()
            visible_file_count = len(files)
            needs_review = sum(item["status"] == "needs_review" for item in review_items)
            reviewed = sum(item["status"] == "reviewed" for item in review_items)
            ignored = sum(item["status"] == "ignored" for item in review_items)
            assistant_sorted = sum(item["status"] == "assistant_sorted" for item in review_items)
            return {
                "sourceRoot": str(self.source_root),
                "ladderRoot": str(self.ladder_root),
                "statePath": str(self.state_path),
                "feedbackPath": str(self.feedback_path),
                "csrfToken": self.csrf_token,
                "folders": folders,
                "properGroups": [],
                "unsafeItems": unsafe_items,
                "reviewItems": review_items,
                "stats": {
                    "remaining": visible_file_count,
                    "safeGroups": 0,
                    "safeFiles": 0,
                    "positionMetadata": numbered_count,
                    "manualFiles": len(unsafe_items),
                    "deferred": len(deferred),
                    "savedEvents": int(self.state.get("event_count", 0)),
                    "undoable": len(self.state.get("undo_stack", [])),
                    "needsReview": needs_review,
                    "reviewed": reviewed,
                    "ignored": ignored,
                    "assistantSorted": assistant_sorted,
                    "assistantAssignments": len(review_items),
                },
            }

    def review_items_payload(self) -> list[dict]:
        payload = []
        records = self.state.setdefault("review_items", {})
        confidence_order = {"low": 0, "medium": 1, "high": 2, "user": 3}
        for review_id, record in sorted(
            records.items(),
            key=lambda pair: (
                pair[1].get("status") == "reviewed",
                confidence_order.get(pair[1].get("confidence", ""), 4),
                int(pair[1].get("source_index") or 10**9),
                pair[0],
            ),
        ):
            current_path = Path(record.get("current_path", "")).resolve()
            if not current_path.is_file() or not inside(current_path, self.ladder_root):
                continue
            token = self.register_image(current_path)
            payload.append(
                {
                    "id": review_id,
                    "kind": "review",
                    "name": record.get("original_name", current_path.name),
                    "currentName": current_path.name,
                    "imageUrl": f"/image/{token}",
                    "sourceIndex": record.get("source_index"),
                    "position": record.get("position"),
                    "folder": record["folder"],
                    "faction": record["faction"],
                    "axis": record["axis"],
                    "tier": record.get("tier"),
                    "confidence": record.get("confidence", "unknown"),
                    "assistantNote": record.get("assistant_note", ""),
                    "status": record.get("status", "needs_review"),
                    "reviewedAt": record.get("reviewed_at"),
                    "ignoredAt": record.get("ignored_at"),
                    "ignoreReason": record.get("ignore_reason", ""),
                    "reason": (
                        f"Assistant guess: {record['folder']} · "
                        f"{record.get('confidence', 'unknown')} confidence. "
                        f"{record.get('assistant_note', '')}"
                    ).strip(),
                }
            )
        return payload

    def _item_payload(self, path: Path, position: int | None, reason: str | None) -> dict:
        identifier = item_id(path)
        token = self.register_image(path)
        return {
            "id": identifier,
            "name": path.name,
            "size": path.stat().st_size,
            "position": position,
            "reason": reason,
            "imageUrl": f"/image/{token}",
        }

    def resolve_source_item(self, identifier: str) -> Path:
        for path in self.source_files():
            if item_id(path) == identifier:
                return path
        raise ValueError("The source item no longer exists or the queue changed. Refresh the page.")

    def resolve_folder(self, folder_name: str) -> Path:
        destination = (self.ladder_root / folder_name).resolve()
        if not inside(destination, self.ladder_root) or not destination.is_dir():
            raise ValueError("Invalid ladder folder")
        if not (LADDER_RE.match(destination.name) or MISC_RE.match(destination.name)):
            raise ValueError("Destination is not a recognized ladder folder")
        return destination

    def destination_for(self, faction: str, axis: str, tier: int) -> Path:
        expected = f"{faction} - {axis.upper()} - tier {int(tier)}"
        return self.resolve_folder(expected)

    def unique_destination(self, source: Path, destination_dir: Path) -> Path:
        candidate = destination_dir / source.name
        if not candidate.exists():
            return candidate
        source_hash = sha256_file(source)
        if sha256_file(candidate) == source_hash:
            raise ValueError(f"An identical file already exists at {candidate}")
        for number in range(2, 1000):
            candidate = destination_dir / f"{source.stem}__{number}{source.suffix}"
            if not candidate.exists():
                return candidate
        raise ValueError("Could not find a collision-free destination filename")

    def apply_assignment_manifest(self, assignments_path: Path, source_index_path: Path | None = None) -> dict:
        """Apply one independently judged destination per source image."""
        assignments_path = assignments_path.resolve()
        if not assignments_path.is_file():
            raise ValueError(f"Assignment manifest does not exist: {assignments_path}")
        with assignments_path.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle, delimiter="\t"))
        required = {"index", "faction", "axis", "tier", "confidence", "note"}
        if not rows or not required.issubset(rows[0]):
            raise ValueError(f"Assignment manifest must contain: {', '.join(sorted(required))}")

        indexed_rows: dict[int, dict] = {}
        for row in rows:
            try:
                index = int(row["index"])
            except (TypeError, ValueError) as error:
                raise ValueError(f"Invalid assignment index: {row.get('index')!r}") from error
            if index in indexed_rows:
                raise ValueError(f"Duplicate assignment index: {index}")
            indexed_rows[index] = row
        expected_indices = list(range(1, len(rows) + 1))
        if sorted(indexed_rows) != expected_indices:
            raise ValueError("Assignment indices must be continuous from 1 through the row count")

        if source_index_path:
            source_index_path = source_index_path.resolve()
            if not source_index_path.is_file():
                raise ValueError(f"Source index does not exist: {source_index_path}")
            with source_index_path.open("r", encoding="utf-8-sig", newline="") as handle:
                index_rows = list(csv.DictReader(handle))
            indexed_sources: dict[int, Path] = {}
            for row in index_rows:
                index = int(row.get("Index", row.get("index", "0")))
                name = row.get("Name", row.get("name", ""))
                path = (self.source_root / name).resolve()
                if not name or not inside(path, self.source_root):
                    raise ValueError(f"Invalid source-index filename at row {index}")
                indexed_sources[index] = path
        else:
            indexed_sources = {index: path for index, path in enumerate(self.source_files(), 1)}

        if sorted(indexed_sources) != expected_indices:
            raise ValueError("Source index and assignment manifest contain different index sets")
        current_sources = set(self.source_files())
        indexed_source_set = set(indexed_sources.values())
        if current_sources != indexed_source_set:
            missing = sorted(str(path) for path in indexed_source_set - current_sources)
            extra = sorted(str(path) for path in current_sources - indexed_source_set)
            raise ValueError(f"Source folder no longer matches the visual index (missing={missing}, extra={extra})")
        existing_hashes = {
            record.get("sha256")
            for record in self.state.get("review_items", {}).values()
            if record.get("sha256")
        }

        planned = []
        reserved: set[Path] = set()
        for index in expected_indices:
            row = indexed_rows[index]
            source = indexed_sources[index]
            action = row.get("action", "review").strip().lower() or "review"
            if action not in {"assign", "review", "ignore"}:
                raise ValueError(f"Invalid action at assignment {index}: {action}")
            faction = row["faction"].strip().lower()
            axis = row["axis"].strip().upper()
            try:
                tier_value = int(row["tier"])
            except (TypeError, ValueError) as error:
                raise ValueError(f"Invalid tier at assignment {index}: {row.get('tier')!r}") from error
            if faction not in FACTION_LABELS:
                raise ValueError(f"Invalid faction at assignment {index}: {faction}")
            if axis == "MISC":
                if tier_value != 0:
                    raise ValueError(f"Misc assignment {index} must use tier 0")
                folder_name = f"{faction} - Misc"
                tier = None
            elif axis in {"STR", "DEX", "INT"} and tier_value in {1, 2, 3}:
                folder_name = f"{faction} - {axis} - tier {tier_value}"
                tier = tier_value
            else:
                raise ValueError(f"Invalid axis/tier at assignment {index}: {axis}/{tier_value}")
            if action == "ignore":
                destination_dir = (self.data_root / "ignored").resolve()
                if not inside(destination_dir, self.data_root):
                    raise ValueError("Ignored-image path failed safety validation")
                destination_dir.mkdir(parents=True, exist_ok=True)
            else:
                destination_dir = self.resolve_folder(folder_name)
            destination = self.unique_destination(source, destination_dir)
            while destination in reserved:
                destination = destination.with_name(f"{destination.stem}__planned{destination.suffix}")
            reserved.add(destination)
            digest = sha256_file(source)
            if digest in existing_hashes:
                raise ValueError(f"Assignment {index} is already present in sorter state: {source.name}")
            crop_match = CROP_RE.search(source.name)
            position_match = crop_match or NUMBERED_RE.search(source.name)
            batch_key = hashlib.sha1(str(self.source_root).encode("utf-8", "surrogatepass")).hexdigest()[:8]
            planned.append(
                {
                    "review_id": f"b{batch_key}-{index:04d}-{digest[:12]}",
                    "source_index": index,
                    "source": source,
                    "destination": destination,
                    "sha256": digest,
                    "position": int(crop_match.group(2) if crop_match else position_match.group(1)) if position_match else None,
                    "faction": faction,
                    "axis": axis,
                    "tier": tier,
                    "folder": folder_name,
                    "confidence": row["confidence"].strip().lower(),
                    "assistant_note": row["note"].strip(),
                    "action": action,
                }
            )

        moved: list[dict] = []
        try:
            for entry in planned:
                shutil.move(str(entry["source"]), str(entry["destination"]))
                moved.append(entry)
        except Exception:
            for entry in reversed(moved):
                if entry["destination"].exists() and not entry["source"].exists():
                    shutil.move(str(entry["destination"]), str(entry["source"]))
            raise

        assigned_at = utc_now()
        with self.lock:
            review_items = self.state.setdefault("review_items", {})
            for entry in planned:
                status = {"assign": "assistant_sorted", "review": "needs_review", "ignore": "ignored"}[entry["action"]]
                record = {
                    "sha256": entry["sha256"],
                    "source_index": entry["source_index"],
                    "position": entry["position"],
                    "original_source": str(entry["source"]),
                    "original_name": entry["source"].name,
                    "current_path": str(entry["destination"]),
                    "faction": entry["faction"],
                    "axis": entry["axis"],
                    "tier": entry["tier"],
                    "folder": entry["folder"],
                    "confidence": entry["confidence"],
                    "assistant_note": entry["assistant_note"],
                    "status": status,
                    "method": "assistant_visual_best_effort",
                    "assigned_at": assigned_at,
                    "history": [],
                }
                if status == "ignored":
                    record["ignored_at"] = assigned_at
                    record["ignore_reason"] = entry["assistant_note"] or "Assistant-identified beast, spirit, or construct"
                review_items[entry["review_id"]] = record
                self.log_event(
                    {
                        "event": "assistant_assignment",
                        "review_id": entry["review_id"],
                        "source_index": entry["source_index"],
                        "source": str(entry["source"]),
                        "destination": str(entry["destination"]),
                        "sha256": entry["sha256"],
                        "faction": entry["faction"],
                        "axis": entry["axis"],
                        "tier": entry["tier"],
                        "confidence": entry["confidence"],
                        "note": entry["assistant_note"],
                        "action": entry["action"],
                        "status": status,
                        "method": "assistant_visual_best_effort",
                    }
                )
            self.save_state()
        return {
            "moved": len(planned),
            "assistant_sorted": sum(entry["action"] == "assign" for entry in planned),
            "needs_review": sum(entry["action"] == "review" for entry in planned),
            "ignored": sum(entry["action"] == "ignore" for entry in planned),
        }

    def move_group(self, group_id: str, axis: str, tier: int, note: str) -> dict:
        raise ValueError("Batch assignment is disabled. Every board must be assigned independently.")

    def move_one(self, identifier: str, folder_name: str, note: str) -> dict:
        source = self.resolve_source_item(identifier)
        destination_dir = self.resolve_folder(folder_name)
        destination = self.unique_destination(source, destination_dir)
        digest = sha256_file(source)
        original_identifier = item_id(source)
        shutil.move(str(source), str(destination))
        metadata = folder_metadata(destination_dir.name)
        review_id = f"u-{secrets.token_hex(8)}"
        operation = {
            "id": secrets.token_hex(8),
            "kind": "manual_assignment",
            "review_id": review_id,
            "note": note.strip(),
            "moves": [
                {
                    "source": str(source),
                    "destination": str(destination),
                    "original_name": source.name,
                    "sha256": digest,
                    "position": int(NUMBERED_RE.search(source.name).group(1)) if NUMBERED_RE.search(source.name) else None,
                    **metadata,
                    "method": "manual full-destination confirmation",
                }
            ],
        }
        with self.lock:
            self.state.setdefault("deferred", {}).pop(original_identifier, None)
            self.state.setdefault("review_items", {})[review_id] = {
                "sha256": digest,
                "source_index": None,
                "position": operation["moves"][0]["position"],
                "original_source": str(source),
                "original_name": source.name,
                "current_path": str(destination),
                **metadata,
                "folder": destination_dir.name,
                "confidence": "user",
                "assistant_note": "",
                "status": "reviewed",
                "method": "user_manual_assignment",
                "assigned_at": utc_now(),
                "reviewed_at": utc_now(),
                "history": [],
            }
            self.state.setdefault("undo_stack", []).append(operation)
            self.log_event({"event": "move_one", **operation})
            self.save_state()
        return {"moved": 1, "operation": operation["id"]}

    def review_assignment(self, review_id: str, folder_name: str, note: str) -> dict:
        with self.lock:
            review_items = self.state.setdefault("review_items", {})
            if review_id not in review_items:
                raise ValueError("The review item no longer exists. Refresh the page.")
            record = review_items[review_id]
            current_path = Path(record["current_path"]).resolve()
            if not inside(current_path, self.ladder_root) or not current_path.is_file():
                raise ValueError("The assigned image is missing or outside the ladder folder")
            if sha256_file(current_path) != record["sha256"]:
                raise ValueError("The assigned image changed since it was classified")
            destination_dir = self.resolve_folder(folder_name)
            metadata = folder_metadata(destination_dir.name)
            before = json.loads(json.dumps(record))
            old_folder = record["folder"]
            moves = []
            if current_path.parent.resolve() != destination_dir.resolve():
                destination = self.unique_destination(current_path, destination_dir)
                shutil.move(str(current_path), str(destination))
                moves.append(
                    {
                        "source": str(current_path),
                        "destination": str(destination),
                        "sha256": record["sha256"],
                    }
                )
                record["current_path"] = str(destination)
            reviewed_at = utc_now()
            record.update(
                {
                    **metadata,
                    "folder": destination_dir.name,
                    "status": "reviewed",
                    "reviewed_at": reviewed_at,
                }
            )
            history_entry = {
                "timestamp": reviewed_at,
                "old_folder": old_folder,
                "new_folder": destination_dir.name,
                "note": note.strip(),
            }
            record.setdefault("history", []).append(history_entry)
            operation = {
                "id": secrets.token_hex(8),
                "kind": "review",
                "review_id": review_id,
                "review_before": before,
                "moves": moves,
            }
            self.state.setdefault("undo_stack", []).append(operation)
            self.log_event(
                {
                    "event": "review_assignment",
                    "review_id": review_id,
                    "sha256": record["sha256"],
                    "old_folder": old_folder,
                    "new_folder": destination_dir.name,
                    "changed": old_folder != destination_dir.name,
                    "note": note.strip(),
                    "assistant_confidence": record.get("confidence"),
                    "assistant_note": record.get("assistant_note"),
                }
            )
            self.save_state()
        return {"reviewed": 1, "changed": old_folder != destination_dir.name}

    def ignore_assignment(self, review_id: str, note: str) -> dict:
        with self.lock:
            review_items = self.state.setdefault("review_items", {})
            if review_id not in review_items:
                raise ValueError("The review item no longer exists. Refresh the page.")
            record = review_items[review_id]
            current_path = Path(record["current_path"]).resolve()
            if not inside(current_path, self.ladder_root) or not current_path.is_file():
                raise ValueError("The assigned image is missing or outside the ladder folder")
            if sha256_file(current_path) != record["sha256"]:
                raise ValueError("The assigned image changed since it was classified")
            if record.get("status") == "ignored":
                raise ValueError("This image is already ignored")

            ignored_dir = (self.data_root / "ignored").resolve()
            if not inside(ignored_dir, self.data_root):
                raise ValueError("Ignored-image path failed safety validation")
            ignored_dir.mkdir(parents=True, exist_ok=True)
            destination = self.unique_destination(current_path, ignored_dir)
            before = json.loads(json.dumps(record))
            shutil.move(str(current_path), str(destination))
            ignored_at = utc_now()
            reason = note.strip() or "Not a character / construct or unusable board"
            record.update(
                {
                    "current_path": str(destination),
                    "status": "ignored",
                    "ignored_at": ignored_at,
                    "ignore_reason": reason,
                }
            )
            record.setdefault("history", []).append(
                {
                    "timestamp": ignored_at,
                    "action": "ignore",
                    "old_folder": before["folder"],
                    "reason": reason,
                }
            )
            operation = {
                "id": secrets.token_hex(8),
                "kind": "ignore",
                "review_id": review_id,
                "review_before": before,
                "moves": [
                    {
                        "source": str(current_path),
                        "destination": str(destination),
                        "sha256": record["sha256"],
                    }
                ],
            }
            self.state.setdefault("undo_stack", []).append(operation)
            self.log_event(
                {
                    "event": "ignore_assignment",
                    "review_id": review_id,
                    "sha256": record["sha256"],
                    "old_folder": before["folder"],
                    "ignored_path": str(destination),
                    "reason": reason,
                    "assistant_confidence": record.get("confidence"),
                    "assistant_note": record.get("assistant_note"),
                }
            )
            self.save_state()
        return {"ignored": 1}

    def defer(self, identifiers: list[str], reason: str) -> dict:
        with self.lock:
            deferred = self.state.setdefault("deferred", {})
            for identifier in identifiers:
                deferred[identifier] = {"timestamp": utc_now(), "reason": reason.strip()}
            self.log_event({"event": "defer", "item_ids": identifiers, "reason": reason.strip()})
            self.save_state()
        return {"deferred": len(identifiers)}

    def undo(self) -> dict:
        with self.lock:
            stack = self.state.setdefault("undo_stack", [])
            if not stack:
                raise ValueError("There is no move to undo")
            operation = stack[-1]
            for move in operation["moves"]:
                source = Path(move["source"]).resolve()
                destination = Path(move["destination"]).resolve()
                source_root = self.ladder_root if operation.get("kind") in {"review", "ignore"} else self.source_root
                if not inside(source, source_root) or not inside(destination, self.ladder_root):
                    raise ValueError("Undo paths failed safety validation")
                if source.exists():
                    raise ValueError(f"Cannot undo because the original path already exists: {source}")
                if not destination.exists():
                    raise ValueError(f"Cannot undo because the moved file is missing: {destination}")
                if sha256_file(destination) != move["sha256"]:
                    raise ValueError(f"Cannot undo because the moved file changed: {destination}")
            for move in reversed(operation["moves"]):
                shutil.move(move["destination"], move["source"])
            if operation.get("kind") in {"review", "ignore"}:
                self.state.setdefault("review_items", {})[operation["review_id"]] = operation["review_before"]
            elif operation.get("kind") == "manual_assignment":
                self.state.setdefault("review_items", {}).pop(operation.get("review_id"), None)
            stack.pop()
            self.log_event({"event": "undo", "operation_id": operation["id"], "moves": operation["moves"]})
            self.save_state()
        return {"undone": len(operation["moves"])}


class Handler(BaseHTTPRequestHandler):
    server_version = "VerdigrisLadderSorter/1.0"

    @property
    def app(self) -> SorterApp:
        return self.server.app  # type: ignore[attr-defined]

    def log_message(self, format_string: str, *args) -> None:
        sys.stdout.write(f"[{self.log_date_time_string()}] {format_string % args}\n")

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path: Path, cache: bool = False) -> None:
        if not path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        body = path.read_bytes()
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "public, max-age=300" if cache else "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/state":
            self.send_json(self.app.scan())
            return
        if parsed.path == "/api/export":
            payload = {
                "state": self.app.state,
                "feedbackPath": str(self.app.feedback_path),
                "scan": self.app.scan(),
            }
            self.send_json(payload)
            return
        if parsed.path.startswith("/image/"):
            token = parsed.path.removeprefix("/image/")
            path = self.app.image_tokens.get(token)
            if path is None or not path.is_file():
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            self.send_file(path, cache=True)
            return
        relative = "index.html" if parsed.path in {"", "/"} else parsed.path.lstrip("/")
        static_path = (UI_DIR / relative).resolve()
        if not inside(static_path, UI_DIR):
            self.send_error(HTTPStatus.FORBIDDEN)
            return
        self.send_file(static_path)

    def do_POST(self) -> None:
        if self.headers.get("X-CSRF-Token") != self.app.csrf_token:
            self.send_json({"error": "Invalid local session token"}, status=403)
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length > 1024 * 1024:
                raise ValueError("Request is too large")
            payload = json.loads(self.rfile.read(content_length) or b"{}")
            parsed = urllib.parse.urlparse(self.path)
            if parsed.path == "/api/move-group":
                result = self.app.move_group(payload["groupId"], payload["axis"], payload["tier"], payload.get("note", ""))
            elif parsed.path == "/api/move-one":
                result = self.app.move_one(payload["itemId"], payload["folder"], payload.get("note", ""))
            elif parsed.path == "/api/review":
                result = self.app.review_assignment(payload["reviewId"], payload["folder"], payload.get("note", ""))
            elif parsed.path == "/api/ignore":
                result = self.app.ignore_assignment(payload["reviewId"], payload.get("note", ""))
            elif parsed.path == "/api/defer":
                result = self.app.defer(list(payload["itemIds"]), payload.get("reason", ""))
            elif parsed.path == "/api/undo":
                result = self.app.undo()
            else:
                self.send_json({"error": "Unknown endpoint"}, status=404)
                return
            self.send_json({"ok": True, **result})
        except (KeyError, TypeError, ValueError, OSError) as error:
            self.send_json({"error": str(error)}, status=400)
        except Exception as error:  # pragma: no cover - final safety net for the local UI
            self.send_json({"error": f"Unexpected error: {error}"}, status=500)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path(r"C:\Users\Alex\Downloads\separate_chars"))
    parser.add_argument("--ladders", type=Path, default=Path(r"C:\Users\Alex\Downloads\ladders"))
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8766)
    parser.add_argument("--no-open", action="store_true")
    parser.add_argument("--scan-only", action="store_true")
    parser.add_argument("--apply-manifest", type=Path, help="Apply a validated TSV of independent assistant assignments")
    parser.add_argument("--source-index", type=Path, help="CSV mapping visual-review indices to exact source filenames")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.source.is_dir():
        print(f"ERROR: source directory does not exist: {args.source}", file=sys.stderr)
        return 2
    if not args.ladders.is_dir():
        print(f"ERROR: ladder directory does not exist: {args.ladders}", file=sys.stderr)
        return 2
    app = SorterApp(args.source, args.ladders)
    if args.apply_manifest:
        result = app.apply_assignment_manifest(args.apply_manifest, args.source_index)
        print(json.dumps(result, indent=2))
        print(f"Feedback: {app.feedback_path}")
        return 0
    scan = app.scan()
    if args.scan_only:
        print(json.dumps(scan["stats"], indent=2))
        print(f"Feedback: {scan['feedbackPath']}")
        return 0
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    server.app = app  # type: ignore[attr-defined]
    url = f"http://{args.host}:{args.port}/"
    print(f"Verdigris ladder sorter: {url}")
    print(f"Source: {app.source_root}")
    print(f"Ladders: {app.ladder_root}")
    print(f"Feedback: {app.feedback_path}")
    if not args.no_open:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
