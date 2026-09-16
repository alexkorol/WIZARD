#!/usr/bin/env python3
"""Capture Pinterest-discovered images into an explicitly unverified queue.

Pinterest is a discovery surface, not an authority.  Files captured here must
not be promoted to the generation reference pool until their creator, museum,
book, reconstruction maker, or archaeological source has been identified.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import urllib.request
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument(
        "--candidate",
        action="append",
        default=[],
        metavar="PIN_URL|IMAGE_URL|NOTE",
        help="Repeat for each candidate.",
    )
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    rows = []
    for candidate in args.candidate:
        pin_url, image_url, note = candidate.split("|", 2)
        digest = hashlib.sha256(image_url.encode("utf-8")).hexdigest()[:12]
        destination = args.output / f"pinterest_{digest}.jpg"
        request = urllib.request.Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=60) as response:
            destination.write_bytes(response.read())
        rows.append({
            "status": "unverified_discovery_only",
            "pin_url": pin_url,
            "image_url": image_url,
            "note": note,
            "file": str(destination),
            "promotion_rule": "trace to an original museum, publication, reconstruction maker, or artist before generation use",
        })

    catalog = args.output / "pinterest_discovery_catalog.json"
    catalog.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"captured": len(rows), "catalog": str(catalog)}, indent=2))


if __name__ == "__main__":
    main()
