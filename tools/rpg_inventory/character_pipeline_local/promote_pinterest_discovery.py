#!/usr/bin/env python3
"""Promote visually reviewed Pinterest discoveries into a labeled ref pool."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument(
        "--promote",
        action="append",
        default=[],
        metavar="FILENAME|ROLE|REASON",
    )
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    discovery = json.loads((args.source / "pinterest_discovery_catalog.json").read_text(encoding="utf-8"))
    by_name = {Path(row["file"]).name: row for row in discovery}

    promoted = []
    for spec in args.promote:
        filename, role, reason = spec.split("|", 2)
        source = args.source / filename
        if filename not in by_name or not source.is_file():
            raise FileNotFoundError(filename)
        destination = args.output / filename
        shutil.copy2(source, destination)
        row = dict(by_name[filename])
        row.update({
            "status": "visually_reviewed_discovery_reference",
            "role": role,
            "review_reason": reason,
            "file": str(destination),
            "generation_limit": "silhouette, proportions, assembly, or reconstruction lead only; museum artifacts remain authoritative",
        })
        promoted.append(row)

    catalog = args.output / "pinterest_promoted_catalog.json"
    catalog.write_text(json.dumps(promoted, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"promoted": len(promoted), "catalog": str(catalog)}, indent=2))


if __name__ == "__main__":
    main()
