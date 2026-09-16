#!/usr/bin/env python3
"""Assemble the four-character separator prompt from its block library."""
import argparse
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
BLOCKS_FILE = HERE / "SEPARATOR-PROMPT-BLOCKS.md"
OUTPUT_FILE = HERE / "character-separator-prompt-v1.md"
COMBINED_OUTPUT_FILE = HERE / "character-separator-prompt-combined-auxiliary-v1.md"
MAX_COMBINED_PROMPT_CHARS = 23500

BLOCK_ORDER = [
    "Output Contract Block",
    "Character Mapping Block",
    "Early Anatomy Firewall Block",
    "Identity and Fidelity Block",
    "Board Composition Block",
    "Item Selection Block",
    "Taxonomy-Aware Selection Block",
    "Auxiliary Equipment Selection Block",
    "Garment and Armor Length Block",
    "Body Armor Isolation Block",
    "Lower Body Assembly Block",
    "Belt Slot Geometry Block",
    "Weapon and Pair Rules Block",
    "Footwear Coverage Block",
    "No Body Parts Block",
    "Material and Motif Block",
    "Render Block",
    "Background Block",
    "Final Anatomy Audit Block",
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


def blocks_version(path):
    match = re.search(r"^Blocks version:\s*(.+)$", path.read_text(encoding="utf-8"), re.M)
    return match.group(1).strip() if match else "unknown"


def build(combined_auxiliary=False, auxiliary_board_count=2):
    blocks = parse_sections(BLOCKS_FILE)
    block_order = list(BLOCK_ORDER)
    if combined_auxiliary:
        block_order.remove("Taxonomy-Aware Selection Block")
        block_order.remove("Auxiliary Equipment Selection Block")
        block_order.remove("Material and Motif Block")
        insert_at = block_order.index("Item Selection Block") + 1
        block_order.insert(insert_at, "Combined Auxiliary Sampling Block")
    missing = [name for name in block_order if name not in blocks]
    if missing:
        sys.exit(f"ERROR: missing blocks: {', '.join(missing)}")
    if auxiliary_board_count not in (1, 2, 3):
        sys.exit("ERROR: auxiliary board count must be 1, 2, or 3")
    prompt = "\n\n".join(blocks[name] for name in block_order)
    prompt = prompt.replace("{AUXILIARY_BOARD_COUNT}", str(auxiliary_board_count))
    bad = sorted({char for char in prompt if ord(char) > 127})
    if bad:
        sys.exit(f"ERROR: non-ASCII prompt characters: {bad!r}")
    required = [
        "Generate exactly 4 separate independent images.",
        "3:2 landscape",
        "four or five",
        "Taxonomy diversity may break a tie among visible choices",
        "HANDWEAR CLASSIFICATION MUST FOLLOW THE SOURCE",
        "Never lengthen a short cuff into a bracer",
        "never amputate the hand portion and output only its forearm shell",
        "Claw weapons are weapons",
        "render the armor by itself in an ungirdled, beltless state",
        "omit it entirely from the surrounding studies",
        "LOWER-BODY SLOT RULE IS MANDATORY AND SOURCE-EVIDENCE-ONLY",
        "Most body-armor studies should not include pants or leggings",
        "Never invent trousers, pants, leggings",
        "ZERO SEPARATE SKIRT OR GREAVE STUDIES",
        "BELT SLOT GEOMETRY IS MANDATORY",
        "at least twice as wide as it is tall",
        "Remove, tuck behind the band, or omit long tassels",
        "CLOSED-TOE FOOTWEAR IS THE DEFAULT",
        "only when the source character unmistakably wears open-toe sandals",
        "Boots, shoes, sandals, slippers, moccasins, soles, toe boxes, and all other footwear are completely excluded",
        "ANATOMY ZERO-TOLERANCE RULE",
        "No head, scalp, face, ears, ear shapes, hair, eyes, nose, mouth, or neck",
        "ANATOMY FIREWALL FOR ALL SURROUNDING ITEM STUDIES",
        "BODY-ARMOR ANATOMY FIREWALL - REPEAT",
        "FOOTWEAR ANATOMY FIREWALL - REPEAT",
        "HEADGEAR ANATOMY FIREWALL - REPEAT",
        "FINAL PRE-OUTPUT ANATOMY AUDIT - DO NOT SKIP",
        "no toes, no tummy or abdomen, and no hair",
        "pure neutral-white background",
    ]
    absent = [text for text in required if text not in prompt]
    if absent:
        sys.exit(f"ERROR: required prompt contracts absent: {absent!r}")
    if not combined_auxiliary:
        standard_required = [
            "The three pure-axis auxiliary equipment slots are valid surrounding item studies",
        ]
        absent = [text for text in standard_required if text not in prompt]
        if absent:
            sys.exit(f"ERROR: standard separator contracts absent: {absent!r}")
    if combined_auxiliary:
        combined_required = [
            "COMBINED OBSERVED-PLUS-AUXILIARY MODE",
            f"exactly {auxiliary_board_count} boards must include one auxiliary or unlockable item study",
            "SPOILS ARE RAW CRAFT MATERIALS, NOT PRESTIGE OBJECTS",
            "Do not polish, lacquer, gild, jewel, engrave, encrust",
            "every combined board must retain at least three studies of equipment visibly observed",
            "If the source character is a beast",
            "Never output sticks, twigs, branches, firewood, or a generic stick bundle as Spoils",
            "Combined Spoils exception only",
        ]
        absent = [text for text in combined_required if text not in prompt]
        if absent:
            sys.exit(f"ERROR: combined separator contracts absent: {absent!r}")
        if len(prompt) > MAX_COMBINED_PROMPT_CHARS:
            sys.exit(
                f"ERROR: combined separator is {len(prompt)} chars; "
                f"maximum is {MAX_COMBINED_PROMPT_CHARS}"
            )
    elif "COMBINED OBSERVED-PLUS-AUXILIARY MODE" in prompt:
        sys.exit("ERROR: combined block leaked into standard separator prompt")
    return prompt


def wrap(prompt, combined_auxiliary=False):
    version = blocks_version(BLOCKS_FILE)
    return (
        f"# Four-Character Separator Prompt{' - Combined Auxiliary Mode' if combined_auxiliary else ''} v1\n\n"
        "BUILT ARTIFACT: assembled by build_separator_prompt.py from "
        f"SEPARATOR-PROMPT-BLOCKS.md (blocks version {version}). "
        "Do not hand-edit; change the blocks and rebuild.\n\n"
        "Attach one source image containing four characters, then paste the full "
        "prompt below into a fresh image-generation request.\n\n"
        f"```text\n{prompt}\n```\n"
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="write the built Markdown prompt")
    parser.add_argument(
        "--combined-auxiliary",
        action="store_true",
        help="occasionally mix inferred unlockable items with observed equipment studies",
    )
    parser.add_argument(
        "--auxiliary-boards",
        type=int,
        choices=(1, 2, 3),
        default=2,
        help="number of the four boards that receive one auxiliary study (default: 2)",
    )
    args = parser.parse_args()
    prompt = build(args.combined_auxiliary, args.auxiliary_boards)
    if args.write:
        output_file = COMBINED_OUTPUT_FILE if args.combined_auxiliary else OUTPUT_FILE
        output_file.write_text(
            wrap(prompt, args.combined_auxiliary), encoding="utf-8", newline="\n"
        )
        print(f"wrote {output_file.name} ({len(prompt)} chars)")
    else:
        print(prompt)


if __name__ == "__main__":
    main()
