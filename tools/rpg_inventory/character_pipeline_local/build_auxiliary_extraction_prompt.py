#!/usr/bin/env python3
"""Build a paste-ready six-lane auxiliary extraction prompt with family targets."""
import argparse
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
CORE = HERE.parent / "core"
LOADOUT_FILE = CORE / "LOADOUT-EXTRACTION.md"
TAXONOMY_FILE = CORE / "ANCIENT-EQUIPMENT-TAXONOMY.md"
OUTPUT_FILE = HERE / "auxiliary-extraction-prompt-v1.md"

LANES = [
    ("warcall", "WC-", "War-call"),
    ("quickrig", "Q-", "Quick Rig"),
    ("attendant", "AT-", "Attendant"),
    ("spoils", "SP-", "Spoils Roll"),
    ("preparation", "PR-", "Preparation Case"),
    ("reliquary", "RL-", "Reliquary"),
]

DEFAULTS = {
    "warcall": "WC-16",
    "quickrig": "Q-15",
    "attendant": "AT-09",
    "spoils": "SP-02",
    "preparation": "PR-09",
    "reliquary": "RL-04",
}


def extract_base_prompt():
    text = LOADOUT_FILE.read_text(encoding="utf-8")
    marker = "Use this exact prompt block after the main ten-slot extraction:"
    start = text.find(marker)
    if start < 0:
        sys.exit("ERROR: auxiliary prompt marker missing from LOADOUT-EXTRACTION.md")
    match = re.search(r"```text\n(Generate 6 images\.[\s\S]*?)\n```", text[start:])
    if not match:
        sys.exit("ERROR: exact six-image prompt block missing")
    return match.group(1).strip()


def parse_taxonomy():
    families = {}
    row_pattern = re.compile(
        r"^\| ([A-Z]+-\d+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$"
    )
    for line in TAXONOMY_FILE.read_text(encoding="utf-8").splitlines():
        match = row_pattern.match(line)
        if match:
            item_id, family, anchor, visual, priority = (
                part.strip() for part in match.groups()
            )
            families[item_id] = {
                "family": family,
                "anchor": anchor,
                "visual": visual,
                "priority": priority,
            }
    return families


def target_block(selected, families):
    lines = [
        "MANDATORY FAMILY TARGETS FOR THIS RUN:",
        "Use exactly these six category families. The taxonomy target controls the object family; the attached character controls its materials, palette, wear, and craft language.",
    ]
    for number, (key, _prefix, label) in enumerate(LANES, 1):
        item_id = selected[key]
        data = families[item_id]
        lines.append(
            f"{number}. {label} - {item_id} {data['family']}: {data['visual']}."
        )
    lines.extend([
        "Do not substitute a different family and do not combine multiple listed families into one item.",
        "",
    ])
    return "\n".join(lines)


def build(selected):
    families = parse_taxonomy()
    for key, prefix, _label in LANES:
        item_id = selected[key]
        if item_id not in families:
            sys.exit(f"ERROR: unknown taxonomy family {item_id}")
        if not item_id.startswith(prefix):
            sys.exit(f"ERROR: {item_id} is not valid for {key}; expected {prefix} family")

    prompt = extract_base_prompt()
    insertion = "Infer each object from the source character's materials"
    if insertion not in prompt:
        sys.exit("ERROR: target insertion point missing from six-image prompt")
    prompt = prompt.replace(insertion, target_block(selected, families) + insertion, 1)

    bad = sorted({char for char in prompt if ord(char) > 127})
    if bad:
        sys.exit(f"ERROR: non-ASCII prompt characters: {bad!r}")
    if not prompt.startswith("Generate 6 images. No commentary."):
        sys.exit("ERROR: exact numeric prompt opener lost")
    if prompt.count("MANDATORY FAMILY TARGETS FOR THIS RUN:") != 1:
        sys.exit("ERROR: mandatory target block missing or duplicated")
    required = [
        "SOURCE EVIDENCE OVERRIDES THE GENERIC LIST",
        "If the source character is a beast",
        "Never generate sticks, twigs, branches, firewood",
        "stick bundle as Spoils",
        "Dry nonhuman tusks, teeth, claws",
        "rigid backboard or pack frame",
        "never assigned to the off-hand slot",
        "purse, handbag, satchel, messenger bag, briefcase, suitcase",
    ]
    absent = [text for text in required if text not in prompt]
    if absent:
        sys.exit(f"ERROR: auxiliary source/beast contracts absent: {absent!r}")
    return prompt


def wrap(prompt, selected):
    ids = ", ".join(selected[key] for key, _prefix, _label in LANES)
    return (
        "# Six-Lane Auxiliary Extraction Prompt v1\n\n"
        "BUILT ARTIFACT: assembled by build_auxiliary_extraction_prompt.py "
        "from core/LOADOUT-EXTRACTION.md and "
        "core/ANCIENT-EQUIPMENT-TAXONOMY.md. Do not hand-edit.\n\n"
        f"Selected families: {ids}.\n\n"
        "Attach one source-character image, then paste the complete prompt below.\n\n"
        f"```text\n{prompt}\n```\n"
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for key, _prefix, label in LANES:
        parser.add_argument(
            f"--{key}",
            default=DEFAULTS[key],
            help=f"taxonomy family ID for {label} (default: {DEFAULTS[key]})",
        )
    parser.add_argument("--write", action="store_true", help="write the built Markdown prompt")
    args = parser.parse_args()
    selected = {key: getattr(args, key) for key, _prefix, _label in LANES}
    prompt = build(selected)
    if args.write:
        OUTPUT_FILE.write_text(wrap(prompt, selected), encoding="utf-8", newline="\n")
        print(f"wrote {OUTPUT_FILE.name} ({len(prompt)} chars)")
    else:
        print(prompt)


if __name__ == "__main__":
    main()
