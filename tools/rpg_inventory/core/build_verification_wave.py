#!/usr/bin/env python3
"""Build the first mixed-category verification wave from expansion_ready."""

from __future__ import annotations

import csv
from pathlib import Path

import status


CORE = Path(__file__).resolve().parent
READY = CORE / "expansion_ready"
SELECTED = {
    "weapons": ("wpn_bow_holmegaard_flat", "wpn_rod_paddle_head"),
    "offhands": ("focus_antler_prong", "shield_shell_pelta"),
    "armor_helms": ("body_corselet_bast", "outer_full_sagum"),
    "wearables": ("hands_hide_pouch_mitts", "feet_meteor_cuff_footbags"),
    "jewelry_relics": ("ring_bone_plain", "relic_skymetal_longspout"),
    "auxiliary": ("warbanner_forked_stave", "mobility_riven_river_yoke"),
}


def read_tsv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        return list(reader.fieldnames or []), list(reader)


def main() -> None:
    chosen: list[dict[str, str]] = []
    fields: list[str] | None = None
    for portfolio, art_ids in SELECTED.items():
        header, rows = read_tsv(READY / f"{portfolio}.tsv")
        fields = fields or header
        by_id = {row["art_id"]: row for row in rows}
        for art_id in art_ids:
            row = by_id[art_id]
            if row["action"] not in {"generate_new", "reference_only_generate"}:
                raise RuntimeError(f"{art_id}: action is {row['action']}")
            if row["qa_status"] != "unreviewed":
                raise RuntimeError(f"{art_id}: qa_status is {row['qa_status']}")
            chosen.append({"portfolio": portfolio, **row})

    wave_path = READY / "wave-01.tsv"
    wave_fields = ["portfolio", *(fields or [])]
    with wave_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle, fieldnames=wave_fields, delimiter="\t", lineterminator="\n"
        )
        writer.writeheader()
        writer.writerows(chosen)

    prompt_dir = READY / "wave-01-prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)
    for row in chosen:
        prompt = status.build_prompt(row)
        if not prompt:
            raise RuntimeError(f"{row['art_id']}: prompt assembly failed")
        (prompt_dir / f"{row['art_id']}.txt").write_text(
            prompt + "\n", encoding="ascii"
        )

    print(f"Wrote {wave_path}")
    print(f"Wrote {len(chosen)} prompts to {prompt_dir}")


if __name__ == "__main__":
    main()
