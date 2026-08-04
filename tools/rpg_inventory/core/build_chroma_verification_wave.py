#!/usr/bin/env python3
"""Build a six-item verification wave using the documented chroma fallback."""

from __future__ import annotations

import csv
import re
from pathlib import Path

import status


CORE = Path(__file__).resolve().parent
READY = CORE / "expansion_ready"
SELECTED = {
    "weapons": "wpn_dag_flint_lancet",
    "offhands": "buckler_skymetal",
    "armor_helms": "body_cuirass_bronze_bell",
    "wearables": "hands_quilted_linen_mitts",
    "jewelry_relics": "ring_copper_open",
    "auxiliary": "quiver_lacquered_reed",
}
AUTHORITATIVE_BACKGROUND_RE = re.compile(
    r"Rendered as a PNG with a fully TRANSPARENT background - true alpha "
    r"transparency, no background at all, NOT a painted checkerboard pattern\. "
    r"If transparency is impossible, fall back to one flat uniform "
    r"(?:mid-grey fill|blue-grey fill \(so the grey metal does not blend into it\))\."
)
CHROMA_BACKGROUND = (
    "Render against one perfectly flat, uniform olive-slate chroma-key fill "
    "(exact color #737A68) covering every background pixel. Do not render "
    "transparency, a checkerboard, scenery, texture, tonal variation, or a "
    "studio backdrop."
)


def read_tsv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        return list(reader.fieldnames or []), list(reader)


def main() -> None:
    chosen: list[dict[str, str]] = []
    fields: list[str] | None = None
    for portfolio, art_id in SELECTED.items():
        header, rows = read_tsv(READY / f"{portfolio}.tsv")
        fields = fields or header
        row = next(candidate for candidate in rows if candidate["art_id"] == art_id)
        if row["action"] not in {"generate_new", "reference_only_generate"}:
            raise RuntimeError(f"{art_id}: action is {row['action']}")
        if row["qa_status"] != "unreviewed":
            raise RuntimeError(f"{art_id}: qa_status is {row['qa_status']}")
        chosen.append({"portfolio": portfolio, **row})

    wave_path = READY / "wave-02-chroma.tsv"
    wave_fields = ["portfolio", *(fields or [])]
    with wave_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle, fieldnames=wave_fields, delimiter="\t", lineterminator="\n"
        )
        writer.writeheader()
        writer.writerows(chosen)

    prompt_dir = READY / "wave-02-chroma-prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)
    for row in chosen:
        prompt = status.build_prompt(row)
        if not prompt:
            raise RuntimeError(f"{row['art_id']}: prompt assembly failed")
        if len(AUTHORITATIVE_BACKGROUND_RE.findall(prompt)) != 1:
            raise RuntimeError(
                f"{row['art_id']}: authoritative background clause mismatch"
            )
        prompt = AUTHORITATIVE_BACKGROUND_RE.sub(CHROMA_BACKGROUND, prompt)
        (prompt_dir / f"{row['art_id']}.txt").write_text(
            prompt + "\n", encoding="ascii"
        )

    print(f"Wrote {wave_path}")
    print(f"Wrote {len(chosen)} chroma-fallback prompts to {prompt_dir}")


if __name__ == "__main__":
    main()
