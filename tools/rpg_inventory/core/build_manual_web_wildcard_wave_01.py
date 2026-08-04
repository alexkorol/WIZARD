#!/usr/bin/env python3
"""Build six manual web prompts for coherent ten-slot loadout extraction.

This is the default roster-generation unit: two reviewed character/loadout
references define one shared equipment culture. The prompt asks the web app for
up to ten separate paperdoll-slot item images. It does not predesign individual
item materials, forms, or decorations.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


CORE = Path(__file__).resolve().parent
PROJECT = CORE.parent
TEMPLATE_PATH = (
    PROJECT
    / "character_pipeline_local"
    / "prompts"
    / "FACTION-DUSTWIND-DEX-T1-TWO-REFERENCE-ITEM-EXTRACTION.md"
)
OUTPUT_DIR = PROJECT / "assets_staging" / "manual-web-wildcard-wave-01"
MOODBOARD_DIR = PROJECT / "assets_staging" / "faction-moodboards-v4"


@dataclass(frozen=True)
class Batch:
    number: int
    faction_id: str
    faction_name: str
    axis: str
    tier: int
    references: tuple[Path, Path]
    faction_calibration: str

    @property
    def batch_id(self) -> str:
        return f"{self.faction_id} - {self.axis} - tier {self.tier}"


NORTH = (
    "The character references are authoritative. Northern Bronze Houses are "
    "recognized by pale hemmed wool and linen, spatially separate madder, "
    "spruce, and ochre woven accents, active-service bronze, pale wood, horn, "
    "tailored shawls or rectangular mantles, and restrained amber when those "
    "features are actually visible. This is a consistency check, not a material "
    "shopping list. Never add bronze, amber, fur, a border, or any other feature "
    "to a slot merely because it appears in this paragraph. Do not turn the set "
    "into medieval Viking gear, mail-and-plate fantasy, dark bog survival gear, "
    "or generic fur barbarian equipment."
)

RIVERSPILL = (
    "The character references are authoritative. Nile-Ziggurat Kingdoms are "
    "recognized by brilliant white linen, active-service copper alloy, "
    "neutral-black structural hide, polished wood or reed construction, and "
    "bounded carnelian, green faience, or malachite when those features are "
    "actually visible. True lapis is reserved for clearly source-supported INT "
    "gear and is not a general faction garnish. This is a consistency check, "
    "not a material shopping list. Never add metal, reed, faience, beads, or "
    "jewelry to a slot merely because it appears in this paragraph. Do not turn "
    "the set into pharaonic regalia, a sacred costume, a hieroglyph display, or "
    "a sun-disk motif set."
)


BATCHES = (
    Batch(
        1,
        "faction_north",
        "Northern Bronze Houses",
        "STR",
        1,
        (
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_north - STR - tier 1"
                r"\ChatGPT Image Jul 12, 2026, 05_24_54 PM (1).png"
            ),
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_north - STR - tier 1"
                r"\ChatGPT Image Jul 12, 2026, 09_46_56 PM (1).png"
            ),
        ),
        NORTH,
    ),
    Batch(
        2,
        "faction_north",
        "Northern Bronze Houses",
        "STR",
        2,
        (
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_north - STR - tier 2"
                r"\ChatGPT Image Jul 12, 2026, 09_25_56 PM (1).png"
            ),
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_north - STR - tier 2"
                r"\ChatGPT Image Jul 12, 2026, 09_57_48 PM (1).png"
            ),
        ),
        NORTH,
    ),
    Batch(
        3,
        "faction_north",
        "Northern Bronze Houses",
        "STR",
        3,
        (
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_north - STR - tier 3"
                r"\ChatGPT Image Jul 12, 2026, 10_11_04 PM (1).png"
            ),
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_north - STR - tier 3"
                r"\075__p1__ChatGPT Image Jul 11, 2026, 07_40_19 PM.png"
            ),
        ),
        NORTH,
    ),
    Batch(
        4,
        "faction_riverspill",
        "Nile-Ziggurat Kingdoms",
        "STR",
        1,
        (
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_riverspill - STR - tier 1"
                r"\ChatGPT Image Jul 12, 2026, 05_24_56 PM (4).png"
            ),
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_riverspill - STR - tier 1"
                r"\ChatGPT Image Jul 12, 2026, 09_46_57 PM (4).png"
            ),
        ),
        RIVERSPILL,
    ),
    Batch(
        5,
        "faction_riverspill",
        "Nile-Ziggurat Kingdoms",
        "STR",
        2,
        (
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_riverspill - STR - tier 2"
                r"\ChatGPT Image Jul 12, 2026, 05_33_06 PM (3).png"
            ),
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_riverspill - STR - tier 2"
                r"\ChatGPT Image Jul 12, 2026, 09_52_57 PM (4).png"
            ),
        ),
        RIVERSPILL,
    ),
    Batch(
        6,
        "faction_riverspill",
        "Nile-Ziggurat Kingdoms",
        "STR",
        3,
        (
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_riverspill - STR - tier 3"
                r"\ChatGPT Image Jul 12, 2026, 10_06_54 PM (4).png"
            ),
            Path(
                r"C:\Users\Alex\Downloads\ladders\faction_riverspill - STR - tier 3"
                r"\188__p4__ChatGPT Image Jul 11, 2026, 07_47_29 PM.png"
            ),
        ),
        RIVERSPILL,
    ),
)


TIER_RULES = {
    1: (
        "Tier 1 means few components, simple seams and joins, locally plausible "
        "low-cost materials, modest repairs, and incomplete matching. It does "
        "not mean dirty, shredded, colorless, or incompetent. Valuable copper "
        "alloy is used only where the references visibly support a functional "
        "metal part; it is never prestige trim on cheap organic equipment."
    ),
    2: (
        "Tier 2 means trained common-use craft, purposeful reinforcement, and a "
        "small number of coherent components. Improve fit, balance, overlap, "
        "weave, stitching, and joins before adding valuable material. It is not "
        "royal, ceremonial, machine-regular, or densely decorated."
    ),
    3: (
        "Tier 3 means the best craft in this ancient ladder while remaining "
        "buildable with pre-ancient tools. Quality comes from fit, balance, "
        "coverage, clean overlap, material selection, and controlled finish, "
        "not medieval complexity, palace regalia, dense filigree, repeated gems, "
        "or factory-perfect symmetry."
    ),
}

STRENGTH_RULE = (
    "Strength is an equipment-design pressure, not a named fantasy class. Favor "
    "leverage, stable load paths, robust protection, impact management, secure "
    "grips, and credible weight distribution when supported by the references. "
    "Do not turn every slot into heavy metal, oversize every object, or default "
    "to a barbarian, knight, gladiator, Viking, or fantasy tank."
)


def fenced_prompt(markdown: str) -> str:
    start = markdown.index("```text") + len("```text")
    end = markdown.index("```", start)
    return markdown[start:end].strip()


def replace_block(text: str, start_heading: str, end_heading: str, body: str) -> str:
    start = text.index(start_heading)
    end = text.index(end_heading, start)
    return text[:start] + body.rstrip() + "\n\n" + text[end:]


def build_prompt(template: str, batch: Batch) -> str:
    template = template.replace(
        "Generate 10 images. No commentary.",
        "Generate up to 10 images. No commentary.",
        1,
    )
    batch_identity = f"""BATCH IDENTITY
This extraction batch is {batch.batch_id}. The batch identity is metadata only.
Do not print it, label it, or place text in any generated image."""

    reference_contract = f"""TWO-REFERENCE WILDCARD CONTRACT
Use both attached character/loadout images as complementary authoritative
references for one shared {batch.faction_name} equipment culture at Strength
Tier {batch.tier}. Inspect both before choosing any paperdoll item.

REFERENCE A: {batch.references[0].name}
REFERENCE B: {batch.references[1].name}

Do not treat the attachments as two commissions and do not design ten objects
from prose. The references decide the item families, silhouettes, proportions,
materials, joins, ornament density, palette placement, wear, and what actually
belongs together. Agreement is strongest evidence. A clearer side-laid or
isolated study may complete the same base. When references conflict, choose the
simpler coherent interpretation instead of combining every detail into a richer
hybrid. If a slot has no strong ARPG item and no credible same-kit completion,
skip that slot. Never invent filler merely to reach ten outputs.

REQUIRED VISUAL FACTION MOODBOARD CONTRACT
One matching portrait visual moodboard is attached as Image C. Images A and B
are the only authority for faction, axis, tier, material balance, item
membership, construction, and coherent loadout design.

Image C supplies visual energy only: overall faction mood, silhouette breadth,
equipment-family variety, color separation, heroic ARPG readability, and the
feeling of a complete ancient equipment culture. It is not a parts catalog,
material recipe, or source of additional paperdoll items.

Never average, hybridize, or literally copy objects from Image C. Never import
a board-only material, item, motif, ornament, prestige level, or manufacturing
detail. Do not use Image C to fill an unsupported slot. Skip weak slots instead
of inventing filler.

QUIVER FIREWALL
Any quiver or bowcase generated as its own game item must be visibly open and
empty, with no arrows or arrow shafts showing. Arrows are separate inventory
items. Visible arrows in a character or moodboard reference are equipped
context only and must not transfer into the quiver deliverable."""

    output_rule = """OUTPUT FILE RULE - ABSOLUTE
Generate up to 10 deliverables, with no more than one useful item per numbered
paperdoll slot. Each deliverable must be its own separate independent image
file. Never put multiple deliverables into a sheet, grid, contact sheet, lineup,
inventory board, paperdoll, comparison image, or collage. Do not place inset
details or multiple panels inside an image. If the interface cannot produce
separate independent files, generate only deliverable 1 as one isolated image
instead of combining deliverables."""

    calibration = f"""FACTION, AXIS, AND TIER CALIBRATION
{batch.faction_calibration}

{STRENGTH_RULE}

{TIER_RULES[batch.tier]}

These calibration words resolve ambiguous source evidence only. They never
authorize adding a component, material, motif, or object absent from the shared
craft system visible in the references."""

    prompt = replace_block(
        template,
        "BATCH IDENTITY",
        "TWO-REFERENCE CONTRACT",
        batch_identity,
    )
    prompt = replace_block(
        prompt,
        "TWO-REFERENCE CONTRACT",
        "OUTPUT FILE RULE - ABSOLUTE",
        reference_contract,
    )
    prompt = replace_block(
        prompt,
        "OUTPUT FILE RULE - ABSOLUTE",
        "FACTION, AXIS, AND TIER CALIBRATION",
        output_rule,
    )
    prompt = replace_block(
        prompt,
        "FACTION, AXIS, AND TIER CALIBRATION",
        "ANATOMY FIREWALL - FIRST PASS",
        calibration,
    )
    prompt = prompt.replace(
        "GENERATE EXACTLY THESE 10 SEPARATE ITEM FILES",
        "PAPERDOLL WILDCARD SLOTS - GENERATE UP TO 10 SEPARATE ITEM FILES",
    )
    prompt = prompt.replace(
        "Make the ten items recognizable as one Dustwind DEX Tier 1 family",
        (
            f"Make all generated items recognizable as one {batch.faction_name} "
            f"Strength Tier {batch.tier} family"
        ),
    )
    prompt = prompt.replace(
        "small practical Tier 1 object",
        f"small practical Tier {batch.tier} object",
    )
    prompt = prompt.replace(
        "Do not turn Tier 1 into muddy gray-brown desaturation.",
        f"Do not turn Tier {batch.tier} into muddy gray-brown desaturation.",
    )
    prompt = prompt.replace(
        "Confirm there will be 10 separate independent image files",
        "Confirm every generated deliverable will be a separate independent image file",
    )
    prompt = prompt.replace(
        "Confirm the set remains\nDustwind, Dexterity-axis, Tier 1",
        (
            f"Confirm the set remains\n{batch.faction_name}, Strength-axis, "
            f"Tier {batch.tier}"
        ),
    )
    prompt = prompt.replace(
        "Generate the ten separate olive-slate-background inventory item images now,\none independent file per numbered slot.",
        (
            "Generate up to ten separate olive-slate-background inventory item "
            "images now,\none independent file per supported numbered slot. Skip "
            "weak, redundant, incidental, or unsupported slots."
        ),
    )
    return prompt


def main() -> None:
    template = fenced_prompt(TEMPLATE_PATH.read_text(encoding="utf-8"))
    prompt_dir = OUTPUT_DIR / "prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)

    manifest = []
    missing = []
    for batch in BATCHES:
        missing.extend(path for path in batch.references if not path.exists())
        moodboard_path = (
            MOODBOARD_DIR
            / f"{batch.faction_id}__visual-moodboard-v4.jpg"
        )
        if not moodboard_path.exists():
            missing.append(moodboard_path)
        prompt = build_prompt(template, batch)
        filename = (
            f"{batch.number:02d}__{batch.faction_id}__STR__T{batch.tier}"
            "__paperdoll-wildcard.txt"
        )
        prompt_path = prompt_dir / filename
        prompt_path.write_text(prompt + "\n", encoding="utf-8")
        manifest.append(
            {
                "number": batch.number,
                "batch_id": batch.batch_id,
                "faction": batch.faction_id,
                "axis": batch.axis,
                "tier": batch.tier,
                "max_outputs": 10,
                "prompt_path": str(prompt_path),
                "character_reference_paths": [
                    str(path) for path in batch.references
                ],
                "required_visual_faction_moodboard_paths": [str(moodboard_path)],
                "existing_balanced_outputs": 0,
                "generation_unit": "one coherent paperdoll/loadout set",
            }
        )

    if missing:
        paths = "\n".join(f"- {path}" for path in sorted(set(missing)))
        raise FileNotFoundError(f"Missing ladder references:\n{paths}")

    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )

    readme = [
        "# Manual Web Wildcard Wave 01",
        "",
        "Status: ready for manual web generation; no images have been generated.",
        "",
        "This supersedes `manual-web-wave-01` as the recommended roster workflow.",
        "Each request uses two reviewed ladder references to generate up to ten",
        "separate paperdoll-slot item images from one coherent loadout culture.",
        "The prompt does not predesign individual item materials or forms.",
        "",
        "For each batch:",
        "",
        "1. Start a fresh image conversation.",
        "2. Attach both character references in the listed order.",
        "3. Attach exactly one matching portrait visual moodboard as Image C.",
        "4. Paste the prompt verbatim.",
        "5. Keep every original output, including partial batches; do not reroll in",
        "   the same pass.",
        "",
        "A missing or weak paperdoll slot may be skipped. Do not ask the model to",
        "invent filler to reach ten.",
    ]
    for row in manifest:
        readme.extend(
            [
                "",
                f"## {row['number']:02d} - {row['batch_id']}",
                "",
                f"- Prompt: `{row['prompt_path']}`",
                (
                    "- Portrait visual moodboard: "
                    f"`{row['required_visual_faction_moodboard_paths'][0]}`"
                ),
                "- Attach:",
            ]
        )
        for index, path in enumerate(row["character_reference_paths"], 1):
            readme.append(f"  {index}. `{path}`")
    readme.append("")
    (OUTPUT_DIR / "README.md").write_text("\n".join(readme), encoding="utf-8")

    print(
        json.dumps(
            {
                "output": str(OUTPUT_DIR),
                "prompts": len(manifest),
                "maximum_images": sum(row["max_outputs"] for row in manifest),
                "ladder_references": sum(
                    len(row["character_reference_paths"]) for row in manifest
                ),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
