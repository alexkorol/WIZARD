#!/usr/bin/env python3
"""Build the unattended seven-tier, four-faction lineup prompt."""
import argparse
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
BLOCKS_FILE = HERE / "SEVEN-TIER-LINEUP-PROMPT-BLOCKS.md"
OUTPUT_FILE = HERE / "seven-tier-lineup-prompt-v1.md"
MAX_PROMPT_CHARS = 18500

BLOCK_ORDER = [
    "Output Contract Block",
    "Roster Foundation Block",
    "Silent Wildcard Engine Block",
    "Faction Identity Block",
    "Tier Logic Block",
    "Unlockable Coverage Ledger Block",
    "Underrepresented Equipment Ledger Block",
    "Default Suppression Block",
    "Human Unit And Silhouette Block",
    "Color And Material Block",
    "Construction And Slot Hygiene Block",
    "Render And Composition Block",
    "Final Validation Block",
    "Final Instruction Block",
]


def parse_sections(path):
    sections = {}
    current, lines = None, []
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^## (.+)$", line)
        if match:
            if current:
                sections[current] = "\n".join(lines).strip()
            current, lines = match.group(1).strip(), []
        elif current:
            lines.append(line)
    if current:
        sections[current] = "\n".join(lines).strip()
    return sections


def blocks_version():
    text = BLOCKS_FILE.read_text(encoding="utf-8")
    match = re.search(r"^Blocks version:\s*(.+)$", text, re.M)
    return match.group(1).strip() if match else "unknown"


def build():
    blocks = parse_sections(BLOCKS_FILE)
    missing = [name for name in BLOCK_ORDER if name not in blocks]
    if missing:
        sys.exit(f"ERROR: missing lineup blocks: {', '.join(missing)}")
    prompt = "\n\n".join(blocks[name] for name in BLOCK_ORDER)
    bad = sorted({char for char in prompt if ord(char) > 127})
    if bad:
        sys.exit(f"ERROR: non-ASCII prompt characters: {bad!r}")
    required = [
        "Generate exactly seven separate new images",
        "ALL TWENTY-EIGHT UNITS ARE ADULT HUMAN-FORM INDIVIDUALS",
        "NO BEASTS THIS RUN",
        "exactly twenty mortal humans and eight superhuman",
        "at least four complete candidate rosters",
        "at least eight category-valid equipment constructions not explicitly named",
        "exactly one clearly visible unlockable or specialty item to every unit",
        "Each lane appears four or five times",
        "at least once in Tiers 1-2, once in Tiers 3-4, and once in Tiers 5-7",
        "Every tier image uses four different lanes",
        "never sticks, firewood, gore",
        "POLEARMS ARE FORBIDDEN THIS RUN",
        "No spear, pike, glaive, halberd, lance, trident, poleaxe",
        "Quick Rig is WORN LOAD-BEARING EQUIPMENT on the back or flank",
        "never held in hand and never consumes the off-hand slot",
        "No purse, handbag, satchel, messenger bag, briefcase, suitcase",
        "may collectively dominate no more than six units",
        "ten distinct headgear constructions",
        "six handwear constructions including mitts, gloves, half-gauntlets, cuffs, and wraps",
        "closed toes on at least twenty units",
        "No specific crystal, stone, or prestige accent appears on more than two units",
        "pure neutral-white background",
        "Generate exactly seven separate images and no commentary",
    ]
    absent = [text for text in required if text not in prompt]
    if absent:
        sys.exit(f"ERROR: required lineup contracts absent: {absent!r}")
    if len(prompt) > MAX_PROMPT_CHARS:
        sys.exit(
            f"ERROR: lineup prompt is {len(prompt)} chars; maximum is {MAX_PROMPT_CHARS}"
        )
    return prompt


def wrap(prompt):
    return (
        "# Seven-Tier Four-Faction Lineup Prompt v1\n\n"
        "BUILT ARTIFACT: assembled by build_seven_tier_lineup_prompt.py from "
        f"SEVEN-TIER-LINEUP-PROMPT-BLOCKS.md (blocks version {blocks_version()}). "
        "Do not hand-edit; change the blocks and rebuild.\n\n"
        "Paste the complete prompt below into a fresh image-generation request. "
        "No attachment is needed.\n\n"
        f"```text\n{prompt}\n```\n"
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="write the built prompt")
    args = parser.parse_args()
    prompt = build()
    if args.write:
        OUTPUT_FILE.write_text(wrap(prompt), encoding="utf-8", newline="\n")
        print(f"wrote {OUTPUT_FILE.name} ({len(prompt)} chars)")
    else:
        print(prompt)


if __name__ == "__main__":
    main()
