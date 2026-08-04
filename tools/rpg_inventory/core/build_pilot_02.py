#!/usr/bin/env python3
"""Build the six-item mixed-ratio expansion pilot from the proven prompt lane."""

from __future__ import annotations

import csv
import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT / "core"
DOWNLOADS = Path(r"C:\Users\Alex\Downloads")
BALANCED = DOWNLOADS / "items_multi_context_balanced_v1"
EXTERNAL = BALANCED / "external_references"
PILOT_ROOT = ROOT / "assets_staging" / "pilot-02"
PROMPT_DIR = PILOT_ROOT / "prompts"
CORRECTION_PROMPT_DIR = PILOT_ROOT / "correction-prompts"
REFERENCE_DIR = PILOT_ROOT / "references"

BUILDER_PATH = ROOT / "character_pipeline_local" / "build_balanced_item_manifest.py"
SPEC = importlib.util.spec_from_file_location("balanced_builder", BUILDER_PATH)
assert SPEC and SPEC.loader
BUILDER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUILDER
SPEC.loader.exec_module(BUILDER)


PILOT = [
    {
        "art_id": "wpn_short_cypriot_rivet",
        "ladder": "faction_stonewood - DEX - tier 2",
        "prompt_class": "short_blade",
        "external": [
            EXTERNAL / "met_251786_mycenaean_copper_dagger.jpg",
            EXTERNAL / "pinterest_promoted" / "pinterest_16408d0f75a5.jpg",
        ],
        "scope": (
            "The museum blade controls the compact triangular blade, shoulder, midrib, and rivet logic. "
            "The Pinterest typology image may inform only hand-worked metal-to-haft assembly. "
            "The handle is a short pair of plain hardwood grip scales seated directly on the flat tang and held only by the two broad shoulder rivets. "
            "Do not copy its axes, spears, long shafts, cord wrapping, leather wrapping, grip bands, socket, or spear-like haft."
        ),
    },
    {
        "art_id": "shield_bronze_yetholm",
        "ladder": "faction_dustwind - STR - tier 3",
        "prompt_class": "shield",
        "external": [
            EXTERNAL / "replica_reconstruction" / "bronze_age_replica_weapon_shield_experiment.jpg",
            EXTERNAL / "met_244565_shield_boss_plain.jpg",
        ],
        "scope": (
            "The reconstruction controls the one-piece shallow bronze disc, stepped boss, turned rim, "
            "and functional concentric strengthening ribs. The ribs are structural, not a sun or celestial motif. "
            "Do not copy the surrounding weapons, wooden shield, picnic furniture, radial rays, small decorative bosses, or outdoor scene."
        ),
    },
    {
        "art_id": "helmet_light_bronze_pilos",
        "ladder": "faction_dustwind - STR - tier 3",
        "prompt_class": "headgear",
        "external": [
            REFERENCE_DIR / "pinterest_discovery_unverified" / "pinterest_pilos_dodona.jpg",
        ],
        "scope": (
            "The Pinterest museum photograph is a discovery lead for the steep conical pilos silhouette, blunt apex, "
            "simple lower groove, and flared edge only; the cited museum/history anchor controls attribution. "
            "Ignore the display stand, room, archaeological green patina, dents, and missing active-service finish."
        ),
    },
    {
        "art_id": "belt_woven_linen_girdle",
        "ladder": "faction_dustwind - DEX - tier 2",
        "prompt_class": "belt",
        "external": [
            EXTERNAL / "met_443650_textile_egyptian_linen.jpg",
            REFERENCE_DIR / "calibrated_icon" / "post_calib_belt_silhouette.png",
        ],
        "scope": (
            "The museum textile controls plain hand-woven fiber and bounded stripe logic only, not its damage or color. "
            "The calibrated icon controls only the shallow horizontal inventory occupancy and folded-band readability. "
            "The target must visibly break into two short textile ends and close with one simple low-profile hand tie. "
            "Do not copy the calibrated icon's ornament, closure, dangling end, material, or tier, and do not make a seamless woven hoop."
        ),
    },
    {
        "art_id": "relic_bronze_bell",
        "ladder": "faction_dustwind - INT - tier 3",
        "prompt_class": "ritual",
        "external": [
            EXTERNAL / "met_326604_bell_iran_iron_age.jpg",
        ],
        "scope": (
            "The museum bell controls the substantial flared sounding body and cast-metal mass only. "
            "The target brief controls the thick arched hand grip and visible internal clapper. "
            "Ignore the museum object's corrosion, encrustation, stamped mark, damaged surface, and display lighting."
        ),
    },
    {
        "art_id": "quiver_lacquered_reed",
        "ladder": "faction_dustwind - DEX - tier 3",
        "prompt_class": "bow_gorytos",
        "target_tier": 4,
        "external": [
            EXTERNAL / "pinterest_promoted" / "pinterest_64a5b627f42b.jpg",
            EXTERNAL / "met_324433_persian_guard_relief.jpg",
        ],
        "scope": (
            "The promoted Pinterest archery sheet and Persian guard relief provide only ancient archery-kit context, "
            "carried scale, and compact load placement. The target brief alone controls the standalone rigid reed body, "
            "mineral lacquer, fitted hardwood hoops and lid, leather back strip, fiber or sinew binding, and strap. "
            "This cheap-material item is organic-led even at Tier 4: faction bronze/brass language does not apply to it. "
            "Do not include bronze, brass, metal collars, rivets, lid knob, buckle, polished hardware, figure, armor, bow, arrows, text, or surrounding kit."
        ),
    },
]

CORRECTIONS = {
    "wpn_short_cypriot_rivet": (
        "This is the single allowed correction pass after user review. Use the attached prior raw output as an edit target. "
        "Preserve its approved compact triangular bronze blade, low midrib, two shoulder rivets, lighting, canvas, and overall ARPG rendering. "
        "Replace the entire cylindrical wrapped handle with a short believable knife hilt: two plain hand-shaped dark hardwood grip scales fitted directly to the flat tang and secured only by the same two broad shoulder rivets. "
        "No cord, leather wrapping, grip bands, socket, crossguard, pommel cap, or spear-like haft."
    ),
    "belt_woven_linen_girdle": (
        "This is the single allowed correction pass after user review. Use the attached prior raw output as an edit target. "
        "Preserve its approved linen weave, shallow 2x1 belt occupancy, undyed field, restrained woven stripes, lighting, and ARPG rendering. "
        "Open the impossible seamless hoop at one front-side point and form two short tapered textile ends closed by one simple low-profile hand tie. "
        "The knot and ends remain compact within the shallow belt silhouette. No metal clasp, buckle, hardware, long sash tails, or dangling cords."
    ),
    "quiver_lacquered_reed": (
        "This is the single allowed correction pass after user review. Use the attached prior raw output as an edit target. "
        "Preserve its approved tall complete reed-quiver silhouette, black mineral-lacquered reed body, leather back strip, strap placement, lighting, and ARPG rendering. "
        "Remove every bronze/brass/metal component, including the broad collars, base band, rivets, lid fitting, knob, and polished hardware. "
        "Replace them with fitted dark hardwood mouth and base hoops, a flush plain wooden lid without a knob, and irregular hand-bound fiber or sinew joins. "
        "The result must read as skilled organic nomad equipment, not high-tech or elite metalwork."
    ),
}

CORRECTION_DROP_NAMES = {
    "wpn_short_cypriot_rivet": {"pinterest_16408d0f75a5.jpg"},
    "belt_woven_linen_girdle": {"post_calib_belt_silhouette.png"},
    "quiver_lacquered_reed": {"pinterest_64a5b627f42b.jpg", "met_324433_persian_guard_relief.jpg"},
}


TIER_3_TEXT = (
    "Tier 3: best-in-class ancient craft for the ladder, but still made with pre-ancient tools and plausible labor. "
    "Complexity comes from fit, overlap, balance, and clean construction, not decorative density. "
    "Never medieval, industrial, palace-regalia, or fantasy-ornate."
)
TIER_4_TEXT = (
    "Tier 4: a major training, logistics, or material investment. Keep it culturally integrated and grounded. "
    "The requested construction and material allocation define the rung; do not add parade costume, copied sacred imagery, "
    "supernatural effects, or unrelated fantasy ornament."
)


def load_targets() -> dict[str, dict[str, str]]:
    with (CORE / "targets-600.tsv").open(encoding="utf-8", newline="") as handle:
        return {row["art_id"]: row for row in csv.DictReader(handle, delimiter="\t")}


def exact_canvas_block(row: dict[str, str]) -> str:
    canvas = row["canvas"]
    ratio = {"P": "2:3 portrait", "S": "1:1 square", "L": "3:2 landscape"}[canvas]
    subject = (
        "The belt subject itself must remain at least twice as wide as tall inside the landscape canvas."
        if row["class"] == "belt"
        else "Use the full canvas efficiently while preserving generous clear matte around every edge."
    )
    return (
        "INVENTORY FOOTPRINT AND POE BASE-ICON CALIBRATION\n"
        f"Runtime footprint: {row['grid_w']}x{row['grid_h']} cells. Required generator canvas: {canvas}, {ratio}. "
        f"{subject} Path of Exile equipment pages are used only as a composition and progression benchmark: one complete isolated item, "
        "strong silhouette, high slot-scale readability, clear material hierarchy, and base-tier escalation through construction. "
        "Do not copy a Path of Exile item design, medieval form, industrial detail, or ornament."
    )


def main() -> None:
    targets = load_targets()
    selected = json.loads((BALANCED / "selected_references.json").read_text(encoding="utf-8"))
    PROMPT_DIR.mkdir(parents=True, exist_ok=True)
    CORRECTION_PROMPT_DIR.mkdir(parents=True, exist_ok=True)

    manifest = []
    for number, item in enumerate(PILOT, start=1):
        row = targets[item["art_id"]]
        ladder = BUILDER.parse_ladder(item["ladder"])
        refs = [Path(path) for path in selected[item["ladder"]]]
        external = [Path(path) for path in item["external"]]
        paths = refs + external
        missing = [str(path) for path in paths if not path.is_file()]
        if missing:
            raise FileNotFoundError("\n".join(missing))

        prompt = BUILDER.individual_prompt(
            ladder=ladder,
            item_class=item["prompt_class"],
            brief=row["desc"],
            refs=refs,
            external_refs=external,
            item_number=number,
            motif=None,
        )
        batch_line = f"BATCH: {ladder.folder}; deliverable {number}; class {item['prompt_class']}."
        prompt = prompt.replace(batch_line, batch_line + "\n\n" + exact_canvas_block(row), 1)
        prompt = prompt.replace(
            "GENERATE EXACTLY THIS ONE ITEM\n",
            "REFERENCE-SCOPE OVERRIDES\n" + item["scope"] + "\n\nGENERATE EXACTLY THIS ONE ITEM\n",
            1,
        )
        if item.get("target_tier") == 4:
            if TIER_3_TEXT not in prompt:
                raise RuntimeError("Tier-3 source text changed; refusing an unsafe Tier-4 replacement.")
            prompt = prompt.replace(TIER_3_TEXT, TIER_4_TEXT, 1)

        prompt_path = PROMPT_DIR / f"{number:02d}__{item['art_id']}.txt"
        prompt_path.write_text(prompt, encoding="utf-8")
        manifest.append(
            {
                "number": number,
                "art_id": item["art_id"],
                "display_name": row["display_name"],
                "class": row["class"],
                "prompt_class": item["prompt_class"],
                "tier": int(row["tier"]),
                "canvas": row["canvas"],
                "grid": f"{row['grid_w']}x{row['grid_h']}",
                "prompt_path": str(prompt_path),
                "reference_paths": [str(path) for path in paths],
            }
        )

    (PILOT_ROOT / "pilot-manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    correction_manifest = []
    for entry in manifest:
        art_id = entry["art_id"]
        if art_id not in CORRECTIONS:
            continue
        prompt = Path(entry["prompt_path"]).read_text(encoding="utf-8")
        drop_names = CORRECTION_DROP_NAMES[art_id]
        prompt = "\n".join(
            line for line in prompt.splitlines()
            if not any(name in line for name in drop_names)
        ) + "\n"
        prompt = prompt.replace(
            "The Pinterest typology image may inform only hand-worked metal-to-haft assembly. ",
            "",
        )
        prompt = prompt.replace(
            "The calibrated icon controls only the shallow horizontal inventory occupancy and folded-band readability. ",
            "The prior raw edit target controls only the shallow horizontal inventory occupancy and approved weave. ",
        )
        prompt = prompt.replace(
            "The promoted Pinterest archery sheet and Persian guard relief provide only ancient archery-kit context, carried scale, and compact load placement. ",
            "",
        )
        prompt = prompt.replace(
            "Historical reference images:\n\nExtract the character images",
            "Historical reference images:\n- none supplied for this correction pass; the prior raw edit target and locked item brief control the edit.\n\nExtract the character images",
        )
        batch_end = prompt.index("\n\n", prompt.index("BATCH:"))
        correction_block = "\n\nCORRECTION PASS\n" + CORRECTIONS[art_id]
        prompt = prompt[:batch_end] + correction_block + prompt[batch_end:]
        correction_path = CORRECTION_PROMPT_DIR / f"{entry['number']:02d}__{art_id}__correction.txt"
        correction_path.write_text(prompt, encoding="utf-8")
        raw_path = PILOT_ROOT / "raw" / f"{art_id}.png"
        if not raw_path.is_file():
            raise FileNotFoundError(raw_path)
        correction_manifest.append(
            {
                **entry,
                "prompt_path": str(correction_path),
                "reference_paths": [str(raw_path)] + [
                    path for path in entry["reference_paths"]
                    if Path(path).name not in drop_names
                ],
            }
        )
    (PILOT_ROOT / "correction-manifest.json").write_text(
        json.dumps(correction_manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Built {len(manifest)} prompts in {PROMPT_DIR}")
    print(f"Built {len(correction_manifest)} correction prompts in {CORRECTION_PROMPT_DIR}")


if __name__ == "__main__":
    main()
