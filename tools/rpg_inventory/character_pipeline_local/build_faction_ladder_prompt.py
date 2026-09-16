#!/usr/bin/env python3
"""Build four self-contained nine-image faction ladder prompts.

The generated PRODUCTION-*-9-IMAGE-LADDER.md files are local paste-ready
artifacts. Edit FACTION-LADDER-BLOCKS.md, the shared prompt blocks, or
BASE-FAMILIES.md, then rebuild:

    python build_faction_ladder_prompt.py --all
"""
import argparse
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LADDER_FILE = HERE / "FACTION-LADDER-BLOCKS.md"
SHARED_FILE = HERE / "PROMPT-BLOCKS-STARTER-FOUR-FACTION.md"
FAMILIES_FILE = HERE / "BASE-FAMILIES.md"
TAXONOMY_ASSIGNMENTS_FILE = HERE / "TAXONOMY-ASSIGNMENTS.md"
PROMPTS_DIR = HERE / "prompts"

# Prompt-facing axes map to legacy BASE-FAMILIES.md group keys. The legacy keys
# are storage compatibility only and must never appear in generated prompts.
AXES = {
    "strength": ("Strength", "warrior"),
    "dexterity": ("Dexterity", "rogue"),
    "intelligence": ("Intelligence", "mage"),
}
BASE_FAMILY_GROUPS = {legacy_key for _name, legacy_key in AXES.values()}

TIERS = {
    1: "Scion",
    2: "Adventurer",
    3: "Champion",
}

FACTIONS = {
    "northern": ("Northern Bronze Houses", "NORTHERN-BRONZE-HOUSES"),
    "cedar": ("Cedar-Obsidian Clans", "CEDAR-OBSIDIAN-CLANS"),
    "silkroad": ("Silkroad Plateau Nomads", "SILKROAD-PLATEAU-NOMADS"),
    "nile": ("Nile-Ziggurat Kingdoms", "NILE-ZIGGURAT-KINGDOMS"),
}

# Keep palette vocabularies isolated. Image models can treat even a negated
# color word as a suggestion, so these terms must be absent from the complete
# production prompt rather than merely preceded by "no" or "avoid".
FORBIDDEN_COLOR_TERMS = {
    "northern": (
        "blue", "indigo", "lapis", "turquoise", "carnelian", "malachite",
        "faience", "bitumen",
    ),
    "cedar": (
        "blue", "indigo", "lapis", "turquoise", "saffron", "mulberry",
        "faience", "bitumen", "amber",
    ),
    "silkroad": (
        "blue", "indigo", "lapis", "turquoise", "greenstone", "jade",
        "faience", "malachite", "amber", "madder", "spruce",
    ),
}

GLOBAL_LADDER_BLOCKS = [
    "Output Contract Block",
    "Canvas And Background Block",
    "Identity Continuity Block",
    "Attribute Axis Interpretation Block",
    "Shared Render Block",
    "Color Accuracy And Chroma Block",
    "Unisex Pair Block",
    "Faction Cohesion Without Uniformity Block",
    "Tier Ladder Block",
    "Tier Contrast Enforcement Block",
    "Color Distribution And Anti-Match Block",
    "Dynamic Pose Block",
    "Slot Readability Block",
    "Six Auxiliary Lane Seeding Block",
    "Taxonomy Coverage And Anti-Convergence Block",
    "Construction And Wearability Block",
    "Motif Budget Block",
    "Authoritative Reference Object Block",
    "Long Weapon Block",
    "Period And Content Guard Block",
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


def parse_families(path, allowed_groups=BASE_FAMILY_GROUPS):
    families = {}
    family_group = tier = None
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^## (\w+)$", line)
        if match:
            family_group, tier = match.group(1).lower(), None
            continue
        match = re.match(r"^### tier (\d+)$", line)
        if match:
            tier = int(match.group(1))
            continue
        match = re.match(r"^- (\w+): (.+)$", line)
        if match and family_group in allowed_groups and tier in TIERS:
            families[(family_group, tier, match.group(1).lower())] = match.group(2).strip()
    return families


def blocks_version(path):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"^Blocks version:\s*(.+)$", text, re.M)
    return match.group(1).strip() if match else "unknown"


def fill(text, faction):
    return text.replace("{FACTION}", faction)


def check_ascii(text, label):
    bad = sorted({char for char in text if ord(char) > 127})
    if bad:
        sys.exit(f"ERROR: non-ASCII characters {bad!r} in {label}")


def require(sections, heading, source):
    if heading not in sections:
        sys.exit(f"ERROR: missing block '{heading}' in {source.name}")
    return sections[heading]


def remaining_accessories(family, axis_key):
    """Remove legacy main/offhand clauses superseded by taxonomy assignments."""
    clauses = family.split(", ")
    covered_clause_count = 1 if axis_key == "intelligence" else 2
    if len(clauses) <= covered_clause_count:
        sys.exit(f"ERROR: base family cannot be split into covered and accessory clauses: {family}")
    return ", ".join(clauses[covered_clause_count:])


def image_entry(number, axis_key, tier, faction_key, faction, ladder, families, taxonomy_assignments):
    axis_name, family_group = AXES[axis_key]
    tier_name = TIERS[tier]
    completion_name = f"{axis_name} Tier {tier} Completion Block"
    completion = require(ladder, completion_name, LADDER_FILE)
    colorway_name = f"{faction} {axis_name} Colorway Block"
    colorway = require(ladder, colorway_name, LADDER_FILE)
    escalation_name = f"{faction} Tier {tier} Escalation Block"
    escalation = require(ladder, escalation_name, LADDER_FILE)
    family = families.get((family_group, tier, faction_key))
    if not family:
        sys.exit(f"ERROR: no base family for {axis_key}/tier {tier}/{faction_key}")
    taxonomy_assignment = taxonomy_assignments.get((axis_key, tier, faction_key))
    if not taxonomy_assignment:
        sys.exit(f"ERROR: no taxonomy assignment for {axis_key}/tier {tier}/{faction_key}")
    auxiliary_patterns = {
        "strength": r"\b(War-call|horn|trumpet|drum|rattle|bell|standard|clapper)\b",
        "dexterity": r"\bQuick Rig\b",
        "intelligence": r"\bAttendant\b",
    }
    if not re.search(auxiliary_patterns[axis_key], taxonomy_assignment, re.I):
        sys.exit(
            f"ERROR: {axis_key}/tier {tier}/{faction_key} assignment lacks "
            "its pure-axis auxiliary family"
        )
    if "one carried hybrid-lane seed:" not in taxonomy_assignment:
        sys.exit(
            f"ERROR: {axis_key}/tier {tier}/{faction_key} assignment lacks "
            "a hybrid-lane seed"
        )
    accessories = remaining_accessories(family, axis_key)

    return "\n".join([
        f"IMAGE {number}: TIER {tier} {tier_name.upper()} {axis_name.upper()} ATTRIBUTE-AXIS PAIR",
        f"Create one independent image containing exactly the recurring {faction} woman and man assigned to the {axis_name} attribute ladder. Both are Tier {tier} {tier_name} characters aligned primarily to the {axis_name} axis. Do not assign them a named fantasy profession. Apply the complete faction, attribute-axis, tier, render, unisex, construction, motif, pose, and slot-readability rules above.",
        "",
        f"Tier-and-axis completion: {completion}",
        "",
        f"Axis-specific material-local color distribution: {colorway}",
        "",
        f"Faction-specific Tier {tier} color, intricacy, and silhouette target: {escalation}",
        "",
        f"Exact remaining Tier {tier} {axis_name}-axis accessory family: {accessories}.",
        "",
        f"Mandatory taxonomy coverage assignment: {taxonomy_assignment}.",
        "",
        "Show every named accessory and mandatory taxonomy base as a usable part of one coherent loadout. The mandatory taxonomy assignment supersedes legacy main-hand, offhand, focus, helmet, armor, and auxiliary defaults; render only the taxonomy-assigned family for those slots. Use its main weapon, shield, or Intelligence-axis focus as the single detached authoritative reference object beside the pair. Do not add any second legacy or default object for a slot already covered by the taxonomy assignment. Keep the pair's shared coverage, construction, and protection identical across body presentations.",
    ])


def validate_handwear_mix(faction_key, families):
    """Keep each faction ladder from converging on forearm bracers."""
    faction_families = [
        families[(family_group, tier, faction_key)]
        for _axis_name, family_group in AXES.values()
        for tier in TIERS
    ]
    bracer_count = sum(
        bool(re.search(r"\b(?:bracers?|vambraces?)\b", family, re.I))
        for family in faction_families
    )
    if bracer_count > 2:
        sys.exit(
            f"ERROR: {faction_key} assigns {bracer_count} bracer/vambrace "
            "families; handwear cap is 2"
        )
    required = {
        "mitt": r"\bmitts?\b",
        "closed-finger glove": r"\bclosed-finger\b.*\bgloves?\b|\bgloves?\b.*\bclosed-finger\b",
        "half-gauntlet or gauntlet": r"\b(?:half-gauntlets?|gauntlets?)\b",
        "short cuff or wrist band": r"\b(?:wrist cuffs?|wrist bands?)\b",
        "flexible wrap": r"\b(?:hand|wrist|forearm|arm) wraps?\b|\bwrapped forearms?\b",
    }
    missing = [
        label for label, pattern in required.items()
        if not any(re.search(pattern, family, re.I) for family in faction_families)
    ]
    if missing:
        sys.exit(
            f"ERROR: {faction_key} handwear mix lacks: {', '.join(missing)}"
        )


def build(faction_key, ladder, shared, families, taxonomy_assignments):
    faction, _slug = FACTIONS[faction_key]
    validate_handwear_mix(faction_key, families)
    parts = [
        "Generate 9 images. No commentary.",
        f"Photorealistic Stylized {faction} Three-Attribute Three-Tier Paired Character Ladder",
    ]

    for heading in GLOBAL_LADDER_BLOCKS:
        parts.append(fill(require(ladder, heading, LADDER_FILE), faction))

    faction_heading = f"{faction} Faction Block"
    parts.append("Faction design language:\n" + require(shared, faction_heading, SHARED_FILE))

    number = 1
    for axis_key in ("strength", "dexterity", "intelligence"):
        for tier in (1, 2, 3):
            parts.append(image_entry(number, axis_key, tier, faction_key, faction, ladder, families, taxonomy_assignments))
            number += 1

    parts.append(fill(require(ladder, "Final Target Block", LADDER_FILE), faction))
    prompt = "\n\n".join(parts)
    check_ascii(prompt, f"{faction} prompt")

    if not prompt.startswith("Generate 9 images. No commentary."):
        sys.exit("ERROR: prompt opener lost the exact numeric image count")
    if len(re.findall(r"^IMAGE [1-9]:", prompt, re.M)) != 9:
        sys.exit("ERROR: prompt does not contain exactly nine image assignments")
    if faction_key == "northern" and re.search(
            r"\b(marsh|taiga|bog|peat)\b|wet-weather|bog-iron|dark wool",
            prompt, re.I):
        sys.exit("ERROR: retired muddy northern taxonomy leaked into prompt")
    if re.search(r"female expression is minimal|male expression is.+more covered|different gendered armor coverage",
                 prompt, re.I):
        sys.exit("ERROR: retired gendered coverage split leaked into prompt")
    if re.search(r"\b(Warrior|Rogue|Mage)\b", prompt, re.I):
        sys.exit("ERROR: a named fantasy class leaked into the attribute-axis prompt")
    if "no single dyed hue should occupy more than roughly one-third" not in prompt:
        sys.exit("ERROR: anti-match color distribution block is missing")
    if "pure neutral-white studio background" not in prompt:
        sys.exit("ERROR: neutral-white character background block is missing")
    if "crisp neutral-white rim light" not in prompt:
        sys.exit("ERROR: neutral-white character lighting block is missing")
    if re.search(r"light blue-gray studio background|crisp cool rim light|white balance neutral to cool",
                 prompt, re.I):
        sys.exit("ERROR: retired blue environment leaked into prompt")
    if "Clear color is allowed at every tier" not in prompt:
        sys.exit("ERROR: chroma-preservation tier rule is missing")
    if "at least four clearly different main-hand silhouettes" not in prompt:
        sys.exit("ERROR: taxonomy coverage block is missing")
    if "six unlockable auxiliary lanes" not in prompt:
        sys.exit("ERROR: six auxiliary lane seeding block is missing")
    if "HANDWEAR DIVERSITY IS MANDATORY" not in prompt:
        sys.exit("ERROR: handwear anti-convergence block is missing")
    if "end of the 6th century AD" not in prompt:
        sys.exit("ERROR: historical scope guard is missing")
    forbidden = FORBIDDEN_COLOR_TERMS.get(faction_key, ())
    if forbidden:
        match = re.search(
            r"\b(?:" + "|".join(map(re.escape, forbidden)) + r")\b",
            prompt,
            re.I,
        )
        if match:
            sys.exit(
                f"ERROR: unassigned color term '{match.group(0)}' leaked into "
                f"{faction_key} prompt"
            )
    return prompt


def wrap_file(faction_key, prompt, ladder_version, shared_version):
    faction, _slug = FACTIONS[faction_key]
    return (
        f"# {faction} Nine-Image Character Ladder Prompt\n\n"
        f"BUILT ARTIFACT: assembled by build_faction_ladder_prompt.py from "
        f"FACTION-LADDER-BLOCKS.md (version {ladder_version}), "
        f"PROMPT-BLOCKS-STARTER-FOUR-FACTION.md (version {shared_version}), "
        f"BASE-FAMILIES.md, and TAXONOMY-ASSIGNMENTS.md. Do not hand-edit.\n\n"
        f"Copy the complete prompt below as one image-generation request.\n\n"
        f"```text\n{prompt}\n```\n"
    )


def output_path(faction_key):
    _faction, slug = FACTIONS[faction_key]
    return PROMPTS_DIR / f"PRODUCTION-{slug}-9-IMAGE-LADDER.md"


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("faction", nargs="?", choices=sorted(FACTIONS))
    parser.add_argument("--all", action="store_true", help="write all four prompt files")
    args = parser.parse_args()

    ladder = parse_sections(LADDER_FILE)
    shared = parse_sections(SHARED_FILE)
    families = parse_families(FAMILIES_FILE)
    taxonomy_assignments = parse_families(TAXONOMY_ASSIGNMENTS_FILE, set(AXES))

    if args.all:
        PROMPTS_DIR.mkdir(exist_ok=True)
        for faction_key in FACTIONS:
            prompt = build(faction_key, ladder, shared, families, taxonomy_assignments)
            path = output_path(faction_key)
            path.write_text(
                wrap_file(
                    faction_key,
                    prompt,
                    blocks_version(LADDER_FILE),
                    blocks_version(SHARED_FILE),
                ),
                encoding="utf-8",
                newline="\n",
            )
            print(f"wrote {path.name} ({len(prompt)} chars)")
    elif args.faction:
        print(build(args.faction, ladder, shared, families, taxonomy_assignments))
    else:
        parser.error("give a faction key to print one prompt, or --all to write all four")


if __name__ == "__main__":
    main()
