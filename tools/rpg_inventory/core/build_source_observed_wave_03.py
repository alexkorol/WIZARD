#!/usr/bin/env python3
"""Build locked Wave 03 prompts from source- and museum-observed objects."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets_staging" / "source-observed-wave-03"
PROMPTS = OUT / "prompts"
RAW = OUT / "raw"
REFS = OUT / "references"
BUILDER_PATH = ROOT / "character_pipeline_local" / "build_balanced_item_manifest.py"

SPEC = importlib.util.spec_from_file_location("balanced_builder_wave03", BUILDER_PATH)
assert SPEC and SPEC.loader
BUILDER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUILDER
SPEC.loader.exec_module(BUILDER)

DOWNLOADS = Path(r"C:\Users\Alex\Downloads")
LADDERS = DOWNLOADS / "ladders"
EXTERNAL = DOWNLOADS / "items_multi_context_balanced_v1" / "external_references"


ITEMS = [
    {
        "art_id": "source_river_bast_rib_corselet",
        "name": "Bast-Rib Corselet",
        "ladder": "faction_riverspill - DEX - tier 2",
        "prompt_class": "body_armor",
        "source_kind": "character",
        "source": LADDERS
        / "faction_riverspill - DEX - tier 2"
        / "206__p4__ChatGPT Image Jul 13, 2026, 05_06_31 PM.png",
        "contexts": [],
        "brief": (
            "the exact hip-short sleeveless bast-fiber torso defense worn by the "
            "figure in the primary source: one continuous pale tan woven backing "
            "densely reinforced by many narrow vertical corded or bundled-fiber "
            "ribs, broad plain integral shoulder bands, large arm openings, a "
            "plain round neck opening, a straight lower edge, and narrow dark "
            "fiber or rawhide binding only at structural edges; show the empty "
            "complete corselet in a slight three-quarter view, including both "
            "shoulders and enough side edge to prove a continuous wearable shell; "
            "no body, anatomy, undershirt, hat, belt, buckle, sash, apron, pouches, "
            "shield, turquoise plaque, metal trim, discs, scales, plates, rivets, "
            "skirt, dangling fringe, writing, or copied collar ornament"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [],
    },
    {
        "art_id": "source_river_faience_barrel_pendant",
        "name": "River Faience Barrel Pendant",
        "ladder": "faction_riverspill - INT - tier 1",
        "prompt_class": "amulet",
        "source_kind": "character",
        "source": LADDERS
        / "faction_riverspill - INT - tier 1"
        / "ChatGPT Image Jul 9, 2026, 09_29_10 PM (7).png",
        "contexts": [],
        "brief": (
            "the exact compact pendant repeated at the upper chest of both figures "
            "in the primary source: one complete dark twisted-fiber neck cord "
            "forming an unbroken wearable loop, supporting one short vertical "
            "three-part barrel stack; a blue-green flared upper faience bead, one "
            "plain pale buff cylindrical middle bead with two very narrow dark "
            "fiber separators, and one rounded blue-green lower barrel bead; the "
            "pendant is small relative to the full cord loop and remains the only "
            "focal object; no cropped cord ends, body, garment, broad collar, metal "
            "setting, gold, bronze, brass, chain, extra beads, gem, medallion, "
            "radial symbol, inscription, tassel, or dangling cluster"
        ),
        "canvas": "S",
        "grid": "1x1",
        "external": [],
    },
    {
        "art_id": "wpn_dag_flint_lancet",
        "name": "Flint Lancet",
        "ladder": "faction_stonewood - DEX - tier 1",
        "prompt_class": "short_blade",
        "source_kind": "museum",
        "source": REFS / "british_museum_1869-0724-95_asset_1072083001.jpg",
        "contexts": [],
        "brief": (
            "one intact active-service version of the exact Late Neolithic Type-I "
            "flint lancet in the primary museum source: one monolithic fine grey "
            "flint body with zero joins, extremely long and narrow near-parallel "
            "pressure-flaked margins, a sharp thrusting point at one end, a blunt "
            "thicker roughly squared-rounded integral hand end at the other, a "
            "very shallow lenticular section, and fine low-relief flake scars; "
            "preserve the approximately eight-to-one length-to-width body and pose "
            "it corner-to-corner with safe margins; no separate grip, wood, hide, "
            "wrap, tang, guard, pommel, rivet, socket, sheath, metal, serration, "
            "broad leaf belly, black glossy obsidian, museum ruler, inventory text, "
            "excavation damage, paired view, or spear shaft"
        ),
        "canvas": "P",
        "grid": "1x2",
        "external": [],
    },
    {
        "art_id": "wpn_throw_badarian_stick",
        "name": "Badarian Throwstick",
        "ladder": "faction_stonewood - DEX - tier 1",
        "prompt_class": "sling_throwing",
        "source_kind": "museum",
        "source": REFS / "british_museum_EA59703_throwing_stick.jpg",
        "contexts": [],
        "brief": (
            "one intact active-service version of the exact Badarian hardwood "
            "throwing stick in the primary museum source: a single flattened "
            "hand-shaped wood body, one long nearly straight arm forming about "
            "three quarters of the total length, one broad shallow elbow, and one "
            "shorter arm turning about forty degrees; unequal ends, with the long "
            "end mildly flared and squared-round and the short end tapering to a "
            "complete narrow tip; retain only shallow restrained dotted or lozenge "
            "incisions near the elbow; compact one-handed missile, not a club; no "
            "metal, stone, wrapping, grip plates, separate parts, deep V, symmetric "
            "boomerang crescent, paddle blade, pair of sticks, museum cracks, "
            "splintered tip, ruler, writing, or oversized two-handed proportions"
        ),
        "canvas": "P",
        "grid": "1x2",
        "external": [],
    },
    {
        "art_id": "feet_woven_fibre_sandals",
        "name": "Woven-Fibre Sandals",
        "ladder": "faction_riverspill - DEX - tier 1",
        "prompt_class": "legs_footwear",
        "source_kind": "museum",
        "source": REFS / "british_museum_EA4418_EA4419_woven_cord_pair.jpg",
        "contexts": [],
        "brief": (
            "one complete handmade pair based exactly on British Museum EA4418 "
            "and EA4419: two flat pointed-oval soles made entirely from tightly "
            "coiled and woven pale plant fiber, each with a simple braided-fiber "
            "toe thong anchored between the first and second toe position and "
            "joining sparse side and ankle cords; restore the deteriorated cord "
            "sections conservatively using the surviving mate; arrange the two "
            "empty sandals as authentic non-mirrored mates in a low open-V or "
            "shallow diagonal, with both full soles visible and every loose cord "
            "resting naturally against or beside a sole; no feet, toes, anatomy, "
            "upright loops around invisible ankles, floating spirals, leather, "
            "metal, buckles, modern flip-flop Y symmetry, heel, rigid sole, welt, "
            "toe box, boot upper, fused pair, museum dirt, or broken fibers"
        ),
        "canvas": "S",
        "grid": "2x2",
        "external": [EXTERNAL / "user_reference_footwear_history_sheet.png"],
    },
    {
        "art_id": "wpn_short_loop_knife",
        "name": "Loop-Ended Iron Knife",
        "ladder": "faction_north - DEX - tier 3",
        "prompt_class": "short_blade",
        "source_kind": "museum",
        "source": REFS / "british_museum_1919_1119_47_iron_loop_handle_knife.jpg",
        "contexts": [],
        "brief": (
            "one intact active-service version of the exact eighth-to-seventh "
            "century BC Greek iron knife in the primary museum source: a compact "
            "one-piece forged iron body about fifteen centimeters long, with a "
            "shallow-convex single cutting edge, nearly straight spine, modestly "
            "broadened blade heel, narrow point, and a long thin flat handle strap "
            "roughly equal to the blade length; the strap ends in one small "
            "flattened oval or teardrop terminal loop with a clearly open irregular "
            "aperture; continuous slab-and-strap construction with no joins; pose "
            "near-vertical or on a restrained diagonal without lengthening it into "
            "a sword; no ring grip, circular whole handle, D-guard, knuckle bow, "
            "scales, rivets, wrap, guard, pommel, separate ring, sheath, corrosion "
            "crust, museum breakage, paired view, ruler, or text"
        ),
        "canvas": "P",
        "grid": "1x2",
        "external": [],
    },
    {
        "art_id": "focus_copper_sistrum",
        "name": "Copper Bar Sistrum",
        "ladder": "faction_riverspill - INT - tier 2",
        "prompt_class": "rite_focus",
        "source_kind": "museum",
        "source": REFS / "walters_54.1207_bronze_bar_sistrum.jpg",
        "contexts": [],
        "brief": (
            "one complete active-service copper-alloy bar sistrum using the exact "
            "mechanical construction of Walters 54.1207: a tall closed arch with "
            "two continuous side rails and a rounded crown, exactly three separate "
            "straight transverse rods passing visibly through both rails and "
            "protruding slightly beyond them, and several loose thin metal sounding "
            "plates captured on the rods; both rails seat into one broad plain "
            "shallow-trapezoidal cast yoke above a thick straight integral handle; "
            "the plain yoke must preserve both rail sockets and the central handle "
            "load path while replacing all sacred imagery; slight three-quarter "
            "view so every rod penetration and several free plates read; no face, "
            "animal, deity, inscription, jewel, charm cluster, bell body, cage mace, "
            "fixed rods, floating jingles, fewer or more than three rods, pencil-thin "
            "grip, archaeological corrosion, bends, missing pieces, or ornate regalia"
        ),
        "canvas": "P",
        "grid": "1x3",
        "external": [],
    },
]


def canvas_block(item: dict) -> str:
    ratio = {"P": "2:3 portrait", "S": "1:1 square", "L": "3:2 landscape"}[
        item["canvas"]
    ]
    authority = (
        "The visible equipped object in the primary character source"
        if item["source_kind"] == "character"
        else "The primary museum object"
    )
    return (
        "SOURCE-OBSERVED INVENTORY TARGET\n"
        f"Primary object source: {item['source'].name}. {authority} is authoritative "
        "for silhouette, materials, joins, closure, proportions, and bounded "
        "ornament. Restore only documented missing or damaged portions into an "
        "active-service object. Do not synthesize a neighboring object family, "
        "copy museum damage, or add faction materials absent from the assignment.\n\n"
        f"Runtime footprint: {item['grid']} cells. Required generator canvas: "
        f"{item['canvas']}, {ratio}. Use Path of Exile only as an inventory-icon "
        "composition benchmark: one complete isolated item, strong silhouette, "
        "readable occupancy, no UI, and generous safe margins."
    )


def main() -> None:
    PROMPTS.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    records = []
    for number, item in enumerate(ITEMS, start=1):
        if not item["source"].is_file():
            raise FileNotFoundError(item["source"])
        for path in item["contexts"] + item["external"]:
            if not path.is_file():
                raise FileNotFoundError(path)
        ladder = BUILDER.parse_ladder(item["ladder"])
        if item["source_kind"] == "character":
            refs = [item["source"]] + item["contexts"]
            external_refs = item["external"]
        else:
            refs = item["contexts"]
            external_refs = [item["source"]] + item["external"]
        prompt = BUILDER.individual_prompt(
            ladder=ladder,
            item_class=item["prompt_class"],
            brief=item["brief"],
            refs=refs,
            external_refs=external_refs,
            item_number=number,
            motif=None,
        )
        batch = (
            f"BATCH: {ladder.folder}; deliverable {number}; "
            f"class {item['prompt_class']}."
        )
        prompt = prompt.replace(batch, batch + "\n\n" + canvas_block(item), 1)
        prompt_path = PROMPTS / f"{number:02d}__{item['art_id']}.txt"
        prompt_path.write_text(prompt, encoding="utf-8")
        reference_paths = refs + external_refs
        if len(reference_paths) > 5:
            raise RuntimeError(f"too many references for {item['art_id']}")
        records.append(
            {
                "number": number,
                "art_id": item["art_id"],
                "name": item["name"],
                "canvas": item["canvas"],
                "grid": item["grid"],
                "source_kind": item["source_kind"],
                "prompt_path": str(prompt_path),
                "reference_paths": [str(path) for path in reference_paths],
                "output_path": str(RAW / f"{item['art_id']}.png"),
            }
        )
    (OUT / "manifest.json").write_text(
        json.dumps(records, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Built {len(records)} locked Wave 03 prompts")


if __name__ == "__main__":
    main()
