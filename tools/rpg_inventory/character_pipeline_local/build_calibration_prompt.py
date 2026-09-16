#!/usr/bin/env python3
"""Assemble starter ladder calibration prompts from the prompt-block library.

The prompts/STARTER-*.md files are built artifacts. Edit
PROMPT-BLOCKS-STARTER-FOUR-FACTION.md or BASE-FAMILIES.md, then rebuild:

    python build_calibration_prompt.py warrior 2      # print one prompt
    python build_calibration_prompt.py --all          # rewrite all 9 files

Never hand-edit the built files; the header stamp records the blocks version
so a stale build is detectable at a glance.
"""
import argparse
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
BLOCKS_FILE = HERE / "PROMPT-BLOCKS-STARTER-FOUR-FACTION.md"
FAMILIES_FILE = HERE / "BASE-FAMILIES.md"
PROMPTS_DIR = HERE / "prompts"

CLASSES = {
    "warrior": ("Warrior", "Warriors"),
    "rogue": ("Rogue", "Rogues"),
    "mage": ("Mage", "Mages"),
}
TIER_NAMES = {1: "Scion", 2: "Adventurer", 3: "Champion"}
FACTIONS = [
    ("northern", "Northern Bronze Houses"),
    ("cedar", "Cedar-Obsidian Clans"),
    ("silkroad", "Silkroad Plateau Nomads"),
    ("nile", "Nile-Ziggurat Kingdoms"),
]

# Assembly order: (lead-in label or None, block heading). Faction paragraphs
# and the header/title lines are inserted by build() around these.
BLOCK_ORDER = [
    (None, "Output and Background Block"),
    (None, "Tier {TIER} Block"),
    ("Shared render style:", "Render Block"),
    ("Dynamic pose and readability requirement:", "Dynamic Pose Block"),
    ("Male/female paired item-base rule:", "Paired Base Block"),
    ("Female styling rule:", "Female Styling Block"),
    ("Male styling rule:", "Male Styling Block"),
    ("{CLASS} class design language:", "{CLASS} Class Block"),
    ("Construction and wearability:", "Construction Block"),
    ("Slot hygiene and motif restraint:", "Slot Hygiene and Motif Restraint Block"),
    ("Long weapon visibility:", "Long Weapon Visibility Block"),
    ("Extraction anchor rule:", "Extraction Anchor Block"),
]


def parse_sections(path):
    """Split a markdown file into {heading: body-text} by ## headings."""
    sections = {}
    current, lines = None, []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^## (.+)$", line)
        if m:
            if current:
                sections[current] = "\n".join(lines).strip()
            current, lines = m.group(1).strip(), []
        elif current:
            lines.append(line)
    if current:
        sections[current] = "\n".join(lines).strip()
    return sections


def blocks_version(path):
    m = re.search(r"^Blocks version:\s*(.+)$", path.read_text(encoding="utf-8"), re.M)
    return m.group(1).strip() if m else "unknown"


def parse_families(path):
    """Return {(class, tier, faction_key): text} from BASE-FAMILIES.md."""
    families = {}
    cls = tier = None
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^## (\w+)$", line)
        if m:
            cls, tier = m.group(1).lower(), None
            continue
        m = re.match(r"^### tier (\d+)$", line)
        if m:
            tier = int(m.group(1))
            continue
        m = re.match(r"^- (\w+): (.+)$", line)
        if m and cls in CLASSES and tier:
            families[(cls, tier, m.group(1).lower())] = m.group(2).strip()
    return families


def fill(text, cls_name, cls_plural, tier):
    return (text.replace("{CLASS_PLURAL}", cls_plural)
                .replace("{CLASS}", cls_name)
                .replace("{TIER_NAME}", TIER_NAMES[tier])
                .replace("{TIER}", str(tier)))


def check_ascii(text, label):
    bad = sorted({ch for ch in text if ord(ch) > 127})
    if bad:
        sys.exit(f"ERROR: non-ASCII characters {bad!r} in {label}. "
                 "Prompts must be ASCII only (see RUNBOOK).")


def build(cls_key, tier, blocks, families):
    cls_name, cls_plural = CLASSES[cls_key]
    parts = [
        "Generate exactly 4 separate images, no commentary.",
        f"Photorealistic Stylized Tier {tier} {cls_name} Male/Female Paired Calibration Set",
    ]
    for label, heading in BLOCK_ORDER:
        heading = fill(heading, cls_name, cls_plural, tier)
        if heading not in blocks:
            sys.exit(f"ERROR: block '{heading}' missing from {BLOCKS_FILE.name}")
        body = fill(blocks[heading], cls_name, cls_plural, tier)
        parts.append(f"{fill(label, cls_name, cls_plural, tier)}\n{body}" if label else body)

    for key, display in FACTIONS:
        block_name = f"{display} Faction Block"
        if block_name not in blocks:
            sys.exit(f"ERROR: block '{block_name}' missing from {BLOCKS_FILE.name}")
        fam = families.get((cls_key, tier, key))
        if not fam:
            sys.exit(f"ERROR: no base family for {cls_key}/tier {tier}/{key} in {FAMILIES_FILE.name}")
        parts.append(f"{display} {cls_name} pair:\n{blocks[block_name]}\n"
                     f"Tier {tier} {cls_name} item-base family: {fam}.")

    for label, heading in [("Variation requirement:", "Variation Block"),
                           ("Final target:", "Final Target Block")]:
        body = fill(blocks[heading], cls_name, cls_plural, tier)
        parts.append(f"{label}\n{body}")

    prompt = "\n\n".join(parts)
    check_ascii(prompt, f"{cls_key} T{tier} prompt")
    return prompt


def wrap_file(cls_key, tier, prompt, version):
    cls_name = CLASSES[cls_key][0]
    return (f"# Starter {cls_name} Tier {tier} Paired Calibration Prompt\n\n"
            f"BUILT ARTIFACT: assembled by build_calibration_prompt.py from "
            f"PROMPT-BLOCKS-STARTER-FOUR-FACTION.md (blocks version {version}) "
            f"and BASE-FAMILIES.md. Do not hand-edit; change the blocks and rebuild.\n\n"
            f"Copy the prompt below as one full image-generation request.\n\n"
            f"```text\n{prompt}\n```\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("cls", nargs="?", choices=sorted(CLASSES), help="class to build")
    ap.add_argument("tier", nargs="?", type=int, choices=sorted(TIER_NAMES), help="tier to build")
    ap.add_argument("--all", action="store_true", help="rewrite all prompt files in prompts/")
    args = ap.parse_args()

    blocks = parse_sections(BLOCKS_FILE)
    families = parse_families(FAMILIES_FILE)
    version = blocks_version(BLOCKS_FILE)

    if args.all:
        PROMPTS_DIR.mkdir(exist_ok=True)
        for cls_key in CLASSES:
            for tier in TIER_NAMES:
                prompt = build(cls_key, tier, blocks, families)
                out = PROMPTS_DIR / f"STARTER-{cls_key.upper()}-T{tier}-PAIRED-CALIBRATION.md"
                out.write_text(wrap_file(cls_key, tier, prompt, version),
                               encoding="utf-8", newline="\n")
                print(f"wrote {out.name} ({len(prompt)} chars)")
    elif args.cls and args.tier:
        print(build(args.cls, args.tier, blocks, families))
    else:
        ap.error("give CLASS TIER to print one prompt, or --all to rebuild the files")


if __name__ == "__main__":
    main()
