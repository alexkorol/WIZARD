#!/usr/bin/env python3
"""Build the first paste-ready manual ChatGPT web generation pack.

The source-observed Wave 05 prompts are already audited and locked. This
builder leaves their item briefs and failure controls untouched and adds one
visually inspected ladder reference per prompt as faction/style context.
Historical references remain the construction authority.
"""

from __future__ import annotations

import json
from pathlib import Path


CORE = Path(__file__).resolve().parent
PROJECT = CORE.parent
SOURCE_DIR = PROJECT / "assets_staging" / "source-observed-wave-05"
OUTPUT_DIR = PROJECT / "assets_staging" / "manual-web-wave-01"

LADDER_REFERENCES = {
    "helmet_light_riverhide": Path(
        r"C:\Users\Alex\Downloads\ladders\faction_riverspill - DEX - tier 3"
        r"\144__p4__ChatGPT Image Jul 11, 2026, 07_44_40 PM.png"
    ),
    "body_cuirass_heroic": Path(
        r"C:\Users\Alex\Downloads\ladders\faction_north - STR - tier 3"
        r"\075__p1__ChatGPT Image Jul 11, 2026, 07_40_19 PM.png"
    ),
    "amulet_copper_cowrie": Path(
        r"C:\Users\Alex\Downloads\ladders\faction_dustwind - INT - tier 2"
        r"\ChatGPT Image Jul 12, 2026, 11_59_20 PM (3).png"
    ),
    "wpn_axe_canaan_window": Path(
        r"C:\Users\Alex\Downloads\ladders\faction_dustwind - STR - tier 3"
        r"\ChatGPT Image Jul 12, 2026, 10_06_53 PM (3).png"
    ),
    "helmet_open_bronze_chalcidian": Path(
        r"C:\Users\Alex\Downloads\ladders\faction_north - DEX - tier 3"
        r"\068__p1__ChatGPT Image Jul 11, 2026, 07_40_03 PM.png"
    ),
    "amulet_shell_oval": Path(
        r"C:\Users\Alex\Downloads\ladders\faction_riverspill - DEX - tier 1"
        r"\ChatGPT Image Jul 12, 2026, 05_27_55 PM (4).png"
    ),
}

COVERAGE_REASONS = {
    "helmet_light_riverhide": (
        "Source-audited distinct light-helmet rung; construction is not duplicated "
        "by the accepted bronze pilos."
    ),
    "body_cuirass_heroic": (
        "Body cuirass is thinly supplied and this complete front/rear source passed "
        "the evidence gate."
    ),
    "amulet_copper_cowrie": (
        "Amulets remain a ten-item gap even after all current salvage and this source "
        "supports the full pendant body."
    ),
    "wpn_axe_canaan_window": (
        "Axe/adze has no accepted or salvage-assigned addition; the paired-window "
        "head and haft seating are source-locked."
    ),
    "helmet_open_bronze_chalcidian": (
        "Open helmets remain thinly supplied; this is not the rejected ornate "
        "balanced-folder helmet reuse."
    ),
    "amulet_shell_oval": (
        "Amulets remain a ten-item gap and this complete natural-shell source supports "
        "a simple low-tier rung without invented cord or metal."
    ),
}


def add_character_reference(prompt: str, ladder_reference: Path) -> str:
    marker = "The attachments are:\n\n\nHistorical reference images:"
    replacement = (
        "The attachments are:\n"
        f"- CHARACTER REFERENCE A: {ladder_reference.name}\n\n"
        "Historical reference images:"
    )
    if marker not in prompt:
        raise RuntimeError("Expected attachment marker not found in locked prompt")
    return prompt.replace(marker, replacement, 1)


def main() -> None:
    source_manifest_path = SOURCE_DIR / "manifest.json"
    source_manifest = json.loads(source_manifest_path.read_text(encoding="utf-8"))

    prompt_dir = OUTPUT_DIR / "prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)

    output_manifest = []
    missing = []
    for row in source_manifest:
        art_id = row["art_id"]
        ladder_reference = LADDER_REFERENCES[art_id]
        historical_references = [Path(path) for path in row["reference_paths"]]
        required_paths = [Path(row["prompt_path"]), ladder_reference, *historical_references]
        missing.extend(path for path in required_paths if not path.exists())

        source_prompt_path = Path(row["prompt_path"])
        prompt = source_prompt_path.read_text(encoding="utf-8")
        prompt = add_character_reference(prompt, ladder_reference)
        output_prompt_path = prompt_dir / source_prompt_path.name
        output_prompt_path.write_text(prompt, encoding="utf-8")

        output_manifest.append(
            {
                "number": row["number"],
                "art_id": art_id,
                "name": row["name"],
                "canvas": row["canvas"],
                "grid": row["grid"],
                "prompt_path": str(output_prompt_path),
                "ladder_reference_paths": [str(ladder_reference)],
                "historical_reference_paths": [str(path) for path in historical_references],
                "attachment_order": [
                    str(ladder_reference),
                    *[str(path) for path in historical_references],
                ],
                "coverage_reason": COVERAGE_REASONS[art_id],
                "construction_authority": (
                    "historical references; ladder reference controls faction finish only"
                ),
                "output_filename": f"{art_id}.png",
            }
        )

    if missing:
        formatted = "\n".join(f"- {path}" for path in sorted(set(missing)))
        raise FileNotFoundError(f"Missing required pack inputs:\n{formatted}")

    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(output_manifest, indent=2) + "\n",
        encoding="utf-8",
    )

    readme_lines = [
        "# Manual Web Generation Pack 01 - Superseded",
        "",
        "Do not use this six-prompt pack as the default roster-generation workflow.",
        "It isolates and predesigns individual items, which loses the coherent",
        "loadout context that produces the strongest Verdigris equipment.",
        "",
        "Use `assets_staging/manual-web-wildcard-wave-01/` instead. The",
        "source-observed prompts below remain historical gap-item experiments only.",
        "",
        "Status: ready for manual ChatGPT web generation; no outputs exist yet.",
        "",
        "For each manifest row, start a fresh image chat, attach every file in",
        "`attachment_order`, paste the matching prompt verbatim, and request exactly",
        "one image. Do not combine rows into a sheet and do not reroll a failed concept",
        "in the same pass.",
        "",
        "The ladder image is faction/style context only. The historical references and",
        "the SOURCE-OBSERVED INVENTORY TARGET paragraph control object construction.",
        "Do not extract unrelated equipment from a character board.",
        "",
        "| # | Art ID | Canvas / grid | Attachments |",
        "|---:|---|---|---:|",
    ]
    for row in output_manifest:
        readme_lines.append(
            f"| {row['number']} | `{row['art_id']}` | "
            f"{row['canvas']} / {row['grid']} | {len(row['attachment_order'])} |"
        )
    for row in output_manifest:
        readme_lines.extend(
            [
                "",
                f"## {row['number']:02d} - {row['name']}",
                "",
                f"- Art ID: `{row['art_id']}`",
                f"- Canvas / grid: `{row['canvas']}` / `{row['grid']}`",
                f"- Prompt: `{row['prompt_path']}`",
                f"- Why now: {row['coverage_reason']}",
                "- Attach in this order:",
            ]
        )
        for index, path in enumerate(row["attachment_order"], 1):
            role = "ladder style reference" if index == 1 else "historical construction reference"
            readme_lines.append(f"  {index}. `{path}` - {role}")
    readme_lines.extend(
        [
            "",
            "After generation, keep the original downloads. Curation, alpha cleanup,",
            "composition, and pixel-art variants remain separate later passes.",
            "",
        ]
    )
    (OUTPUT_DIR / "README.md").write_text(
        "\n".join(readme_lines),
        encoding="utf-8",
    )

    print(
        json.dumps(
            {
                "output": str(OUTPUT_DIR),
                "prompts": len(output_manifest),
                "attachments": sum(
                    len(row["attachment_order"]) for row in output_manifest
                ),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
