#!/usr/bin/env python3
"""Validate the enriched 300-row expansion manifest and its supply maps."""

from __future__ import annotations

import argparse
import csv
from collections import Counter, defaultdict
import hashlib
import os
from pathlib import Path
import re
import sys
from urllib.parse import urlparse


CORE = Path(__file__).resolve().parent
READY = CORE / "expansion_ready"
PORTFOLIOS = (
    "weapons",
    "offhands",
    "armor_helms",
    "wearables",
    "jewelry_relics",
    "auxiliary",
)
FIELDS = (
    "art_id", "class", "tier", "display_name", "canvas", "grid_w", "grid_h",
    "desc", "historical_anchor", "source_url", "action", "source_kind",
    "source_path", "source_sha256", "source_verdict", "overlap_key",
    "qa_status", "ladder_id", "rung", "runtime_kind", "mechanical_identity",
)
MAP_FIELDS = (
    "source_kind", "source_path", "source_sha256", "source_class", "decision",
    "assigned_art_id", "reason",
)
ACTIONS = {
    "generate_new", "review_reuse", "alias_existing",
    "reference_only_generate", "hold_redesign", "retire",
}
SOURCE_KINDS = {"none", "post_calib", "balanced_output", "existing_target"}
SOURCE_VERDICTS = {"promote", "review", "reject", "not_audited"}
QA_STATUSES = {"unreviewed", "accepted", "rejected", "needs_user"}
MAP_DECISIONS = {
    "assign_to_row", "alias_existing", "reject_base_reuse", "needs_user",
}
ID_RE = re.compile(r"^[a-z0-9_]+$")


def read_tsv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        return list(reader.fieldnames or []), list(reader)


def normalized_path(value: str) -> str:
    return os.path.normcase(os.path.abspath(os.path.normpath(value)))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def footprint_rules(item_class: str, runtime_kind: str) -> set[tuple[int, int]] | None:
    key = runtime_kind or item_class
    if key in {"dagger", "throwing"}:
        return {(1, 2), (1, 3)}
    if key in {"short_blade", "sword", "axe", "adze", "mace", "club", "caster_rod"}:
        return {(1, 2), (1, 3)}
    if key in {"two_hand", "great2h"}:
        return {(2, 4)}
    if key in {"spear", "polearm"}:
        return {(1, 4), (2, 4)}
    if key == "bow":
        return {(2, 3), (2, 4)}
    if key in {"buckler", "defensive_offhand"}:
        return {(1, 2), (2, 2)}
    if key == "shield":
        return {(2, 3), (2, 4)}
    if key in {"ritefocus", "caster_focus"}:
        return {(1, 3), (2, 2)}
    if key == "body":
        return {(2, 3), (2, 4)}
    if key in {"outer", "cloak", "mantle"}:
        return {(2, 3), (2, 4)}
    if key in {"helmet", "gloves", "boots"}:
        return {(2, 2)}
    if key == "belt":
        return {(2, 1)}
    if key in {"ring", "amulet"}:
        return {(1, 1)}
    if key in {"curio", "relic"}:
        return {(1, 1), (2, 1), (2, 2)}
    if key in {"quiver", "gorytos"}:
        return {(2, 2), (2, 3)}
    if key == "warcall":
        return {(2, 2), (1, 3), (2, 3)}
    if key == "warbanner":
        return {(1, 4), (2, 4)}
    if key in {"quickrig", "mobility", "trapkit", "attendant"}:
        return {(2, 2)}
    if key in {"preparation", "preparation_content", "spoil", "reliquary_content"}:
        return {(1, 1), (2, 1)}
    return None


def canvas_rules(footprint: tuple[int, int]) -> set[str]:
    w, h = footprint
    if w == h:
        return {"S"}
    if w > h:
        return {"L"}
    return {"P"}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--write-merged",
        type=Path,
        help="Write the validated additive 300-row release manifest.",
    )
    args = parser.parse_args()

    errors: list[str] = []
    warnings: list[str] = []
    rows: list[dict[str, str]] = []
    maps: list[dict[str, str]] = []

    for portfolio in PORTFOLIOS:
        ready_path = READY / f"{portfolio}.tsv"
        map_path = READY / f"{portfolio}-supply-map.tsv"
        if not ready_path.is_file():
            errors.append(f"{ready_path.name}: missing")
            continue
        header, batch = read_tsv(ready_path)
        if header != list(FIELDS):
            errors.append(f"{ready_path.name}: wrong schema")
        if len(batch) != 50:
            errors.append(f"{ready_path.name}: {len(batch)} rows, expected 50")
        for index, row in enumerate(batch, 2):
            row["_file"] = ready_path.name
            row["_row"] = str(index)
            row["_portfolio"] = portfolio
        rows.extend(batch)

        if not map_path.is_file():
            errors.append(f"{map_path.name}: missing")
            continue
        map_header, supply = read_tsv(map_path)
        if map_header != list(MAP_FIELDS):
            errors.append(f"{map_path.name}: wrong schema")
        for index, row in enumerate(supply, 2):
            row["_file"] = map_path.name
            row["_row"] = str(index)
            row["_portfolio"] = portfolio
        maps.extend(supply)

    if len(rows) != 300:
        errors.append(f"combined ready rows: {len(rows)}, expected 300")

    for key in ("art_id", "display_name"):
        values = Counter(row.get(key, "").casefold() for row in rows)
        for value, count in values.items():
            if value and count > 1:
                errors.append(f"duplicate {key}: {value!r} ({count})")

    for portfolio in PORTFOLIOS:
        portfolio_rows = [row for row in rows if row["_portfolio"] == portfolio]
        ladders: dict[str, list[dict[str, str]]] = defaultdict(list)
        for row in portfolio_rows:
            ladders[row.get("ladder_id", "")].append(row)
        if len(ladders) != 10:
            errors.append(f"{portfolio}: {len(ladders)} ladders, expected 10")
        for ladder_id, ladder_rows in ladders.items():
            rungs = sorted(row.get("rung", "") for row in ladder_rows)
            tiers = sorted(row.get("tier", "") for row in ladder_rows)
            if len(ladder_rows) != 5 or rungs != list("12345") or tiers != list("12345"):
                errors.append(
                    f"{portfolio}/{ladder_id}: needs exactly rung/tier 1-5"
                )
            identities = [row.get("mechanical_identity", "").casefold() for row in ladder_rows]
            if len(set(identities)) != len(identities):
                errors.append(f"{portfolio}/{ladder_id}: repeated mechanical_identity")

    ids = {row.get("art_id", "") for row in rows}
    for row in rows:
        where = f"{row['_file']}:{row['_row']} {row.get('art_id', '<blank>')}"
        blanks = [field for field in FIELDS if not row.get(field, "").strip()]
        if blanks:
            errors.append(f"{where}: blank fields {', '.join(blanks)}")
            continue
        for field in FIELDS:
            try:
                row[field].encode("ascii")
            except UnicodeEncodeError:
                errors.append(f"{where}: non-ASCII text in {field}")
        if not ID_RE.fullmatch(row["art_id"]) or not ID_RE.fullmatch(row["ladder_id"]):
            errors.append(f"{where}: invalid art_id or ladder_id")
        if row["tier"] not in set("12345") or row["rung"] != row["tier"]:
            errors.append(f"{where}: rung must equal tier 1-5")
        if row["action"] not in ACTIONS:
            errors.append(f"{where}: invalid action {row['action']!r}")
        if row["source_kind"] not in SOURCE_KINDS:
            errors.append(f"{where}: invalid source_kind")
        if row["source_verdict"] not in SOURCE_VERDICTS:
            errors.append(f"{where}: invalid source_verdict")
        if row["qa_status"] not in QA_STATUSES:
            errors.append(f"{where}: invalid qa_status")
        if row["action"] in {"generate_new", "reference_only_generate"}:
            if row["qa_status"] != "unreviewed":
                errors.append(
                    f"{where}: ungenerated art must have qa_status=unreviewed"
                )
        if row["action"] == "review_reuse" and row["qa_status"] != "needs_user":
            errors.append(
                f"{where}: review_reuse must remain qa_status=needs_user"
            )
        if row["action"] == "review_reuse" and row["source_kind"] not in {
            "post_calib", "balanced_output"
        }:
            errors.append(f"{where}: review_reuse needs a reusable source")
        if row["action"] == "alias_existing" and row["source_kind"] != "existing_target":
            errors.append(f"{where}: alias_existing needs existing_target")
        if row["action"] == "reference_only_generate" and row["source_verdict"] != "reject":
            errors.append(f"{where}: reference_only_generate must identify rejected art")
        if row["source_kind"] == "none":
            if row["source_path"] != "none" or row["source_sha256"] != "none":
                errors.append(f"{where}: source_kind none requires path/hash none")
        if row["source_kind"] == "post_calib":
            source = Path(row["source_path"])
            if not source.is_absolute():
                source = Path(r"C:\Users\Alex\Downloads\items_post_calib_batch") / source
            if not source.is_file():
                errors.append(f"{where}: missing post_calib source {source}")
            elif sha256(source).casefold() != row["source_sha256"].casefold():
                errors.append(f"{where}: post_calib SHA mismatch")
        if row["source_kind"] == "balanced_output" and not Path(row["source_path"]).is_file():
            errors.append(f"{where}: missing balanced output")
        try:
            footprint = (int(row["grid_w"]), int(row["grid_h"]))
        except ValueError:
            errors.append(f"{where}: non-integer footprint")
            continue
        allowed = footprint_rules(row["class"], row["runtime_kind"])
        if allowed is None:
            warnings.append(f"{where}: no footprint rule for {row['runtime_kind']}")
        elif footprint not in allowed:
            errors.append(f"{where}: invalid footprint {footprint}")
        if row["canvas"] not in canvas_rules(footprint):
            errors.append(f"{where}: canvas {row['canvas']} conflicts with {footprint}")
        parsed = urlparse(row["source_url"])
        if parsed.scheme != "https" or not parsed.netloc:
            errors.append(f"{where}: source_url is not absolute HTTPS")

    targets_header, targets = read_tsv(CORE / "targets.tsv")
    del targets_header
    target_ids = {row["art_id"] for row in targets}
    target_names = {row["display_name"].casefold() for row in targets}
    for row in rows:
        if row.get("art_id") in target_ids:
            errors.append(f"{row['art_id']}: collides with targets.tsv")
        if row.get("display_name", "").casefold() in target_names:
            errors.append(f"{row['display_name']}: name collides with targets.tsv")

    seen_supply: Counter[tuple[str, str]] = Counter()
    for row in maps:
        where = f"{row['_file']}:{row['_row']}"
        blanks = [field for field in MAP_FIELDS if not row.get(field, "").strip()]
        if blanks:
            errors.append(f"{where}: blank map fields {', '.join(blanks)}")
            continue
        if row["source_kind"] not in {"post_calib", "balanced_output"}:
            errors.append(f"{where}: supply source_kind must be post_calib/balanced_output")
        if row["decision"] not in MAP_DECISIONS:
            errors.append(f"{where}: invalid supply decision")
        if row["assigned_art_id"] != "none" and row["assigned_art_id"] not in ids:
            errors.append(f"{where}: assigned_art_id absent from ready roster")
        if row["decision"] == "assign_to_row" and row["assigned_art_id"] == "none":
            errors.append(f"{where}: assign_to_row requires assigned_art_id")
        if row["source_kind"] == "post_calib":
            source = Path(row["source_path"])
            if not source.is_absolute():
                source = Path(r"C:\Users\Alex\Downloads\items_post_calib_batch") / source
            if not source.is_file():
                errors.append(f"{where}: missing mapped post_calib source")
            elif sha256(source).casefold() != row["source_sha256"].casefold():
                errors.append(f"{where}: mapped post_calib SHA mismatch")
        elif row["source_kind"] == "balanced_output":
            if not Path(row["source_path"]).is_file():
                errors.append(f"{where}: missing mapped balanced output")
        key_path = (
            Path(row["source_path"]).name
            if row["source_kind"] == "post_calib"
            else normalized_path(row["source_path"])
        )
        seen_supply[(row["source_kind"], key_path)] += 1

    triage_header, triage = read_tsv(CORE / "expansion_drafts" / "post-calib-triage.tsv")
    del triage_header
    promoted = {row["filename"] for row in triage if row["verdict"] == "promote"}
    for filename in sorted(promoted):
        count = seen_supply[("post_calib", filename)]
        if count != 1:
            errors.append(f"promoted post_calib {filename!r} mapped {count} times")

    balanced_manifest = Path(
        r"C:\Users\Alex\Downloads\items_multi_context_balanced_v1\balanced_item_manifest.tsv"
    )
    balanced_header, balanced = read_tsv(balanced_manifest)
    del balanced_header
    present = {
        normalized_path(row["output_path"])
        for row in balanced
        if Path(row["output_path"]).is_file()
    }
    for output_path in sorted(present):
        count = seen_supply[("balanced_output", output_path)]
        if count != 1:
            errors.append(f"balanced output {output_path!r} mapped {count} times")

    for key, count in seen_supply.items():
        if count > 1:
            errors.append(f"supply {key} mapped {count} times")

    print(f"Ready rows: {len(rows)}; supply rows: {len(maps)}")
    print(f"Ladders: {len(set(row.get('ladder_id', '') for row in rows))}")
    print("Tiers:", ", ".join(f"T{k}={v}" for k, v in sorted(Counter(r.get("tier", "") for r in rows).items())))
    print(f"Required supply: post_calib promote={len(promoted)}, balanced present={len(present)}")
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
            writer = csv.DictWriter(
                handle, fieldnames=FIELDS, delimiter="\t", lineterminator="\n"
            )
            writer.writeheader()
            writer.writerows(
                {field: row[field] for field in FIELDS} for row in rows
            )
        print(f"Wrote {destination}")
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
