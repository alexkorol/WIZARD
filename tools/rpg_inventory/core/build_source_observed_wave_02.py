#!/usr/bin/env python3
"""Build locked Wave 02 prompts from source-observed, prior-art-cleared items."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets_staging" / "source-observed-wave-02"
PROMPTS = OUT / "prompts"
RAW = OUT / "raw"
BUILDER_PATH = ROOT / "character_pipeline_local" / "build_balanced_item_manifest.py"

SPEC = importlib.util.spec_from_file_location("balanced_builder_wave02", BUILDER_PATH)
assert SPEC and SPEC.loader
BUILDER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUILDER
SPEC.loader.exec_module(BUILDER)

DOWNLOADS = Path(r"C:\Users\Alex\Downloads")
LADDERS = DOWNLOADS / "ladders"
EXTERNAL = (
    DOWNLOADS
    / "items_multi_context_balanced_v1"
    / "external_references"
)


ITEMS = [
    {
        "art_id": "source_dustwind_clipped_body_shield",
        "name": "Clipped-Corner Body Shield",
        "ladder": "faction_dustwind - STR - tier 2",
        "prompt_class": "shield",
        "source": LADDERS
        / "faction_dustwind - STR - tier 2"
        / "201__p3__ChatGPT Image Jul 13, 2026, 05_05_53 PM.png",
        "location": "the complete tall clipped-corner shield carried at viewer-right",
        "brief": (
            "the exact tall six-sided clipped-corner body shield visible in the "
            "primary source: a rigid wood body beneath a taut red-ochre woven or "
            "hide face, a narrow dark rawhide-bound rim with visible sparse "
            "perimeter lacing, one broad pale central vertical leaf-shaped field, "
            "and one low plain bronze hand boss on a compact collar; front fighting "
            "face only, no arm, hand, figure, rear straps, extra bosses, writing, "
            "radial emblem, dangling hardware, or broad metal facing"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [EXTERNAL / "met_244565_shield_boss_plain.jpg"],
    },
    {
        "art_id": "source_river_calf_wrap_sandals",
        "name": "River Calf-Wrap Sandals",
        "ladder": "faction_riverspill - DEX - tier 1",
        "prompt_class": "legs_footwear",
        "source": LADDERS
        / "faction_riverspill - DEX - tier 1"
        / "091__p4__ChatGPT Image Jul 11, 2026, 07_41_05 PM.png",
        "location": "the complete matched pair of sandals and lower-calf ties worn by the central figure",
        "brief": (
            "the exact empty matched pair of open sandals visible in the primary "
            "source: thin flat brown hand-cut hide soles, broad plain hide "
            "toe-and-forefoot bands, and long narrow hide or plant-fiber thongs "
            "crossing each instep and spiraling unevenly around both ankles and "
            "lower calves; show the pair side by side with credible handmade "
            "variation; no feet, legs, anatomy, buckle, rivet, eyelet, raised heel, "
            "heel counter, welt, molded toe box, metal plate, rigid cuff, or modern shoe"
        ),
        "canvas": "S",
        "grid": "2x2",
        "external": [EXTERNAL / "user_reference_footwear_history_sheet.png"],
    },
    {
        "art_id": "source_dustwind_woven_lobed_buckler",
        "name": "Woven Lobed Buckler",
        "ladder": "faction_dustwind - INT - tier 2",
        "prompt_class": "shield",
        "source": LADDERS
        / "faction_dustwind - INT - tier 2"
        / "215__p3__ChatGPT Image Jul 13, 2026, 05_07_09 PM.png",
        "location": "the compact irregular lobed woven shield carried at viewer-right",
        "brief": (
            "the exact front fighting face of the compact forearm-scale parrying "
            "shield visible in the primary source: an irregular vertically oval "
            "scalloped-lobed outline, dense brown basket-weave face, continuous "
            "pale cane or wood perimeter frame, broad structural cane cross-braces "
            "across the face, and sparse red-brown rawhide or fiber lashings fixing "
            "the face, braces, and rim; no boss, metal, arm, hand, figure, rear "
            "hardware, emblem, text, loose ornament, or invented symmetry"
        ),
        "canvas": "S",
        "grid": "2x2",
        "external": [EXTERNAL / "met_544843_basket_egyptian_palm.jpg"],
    },
    {
        "art_id": "source_dustwind_bronze_lozenge_amulet",
        "name": "Faceted Bronze Lozenge",
        "ladder": "faction_dustwind - DEX - tier 3",
        "prompt_class": "amulet",
        "source": LADDERS
        / "faction_dustwind - DEX - tier 3"
        / "165__p3__ChatGPT Image Jul 11, 2026, 07_45_36 PM.png",
        "location": "the single dominant diamond-shaped pectoral directly below the scarf",
        "brief": (
            "the exact compact warm-bronze lozenge amulet visible at the upper "
            "sternum in the primary source: one broad diamond silhouette, narrow "
            "plain raised perimeter, four shallow hand-worked triangular facet "
            "planes meeting along a blunt central ridge, and one short plain top "
            "suspension eye on a simple dark cord loop; no body, scarf, armor, "
            "secondary beads, stone, gem, script, dangling cluster, circular "
            "medallion, rays, spokes, sun symbol, or sacred mark"
        ),
        "canvas": "S",
        "grid": "1x1",
        "external": [],
    },
    {
        "art_id": "source_stonewood_bound_longbow",
        "name": "Bound Long Self Bow",
        "ladder": "faction_stonewood - DEX - tier 1",
        "prompt_class": "bow",
        "source": LADDERS
        / "faction_stonewood - DEX - tier 1"
        / "ChatGPT Image Jul 12, 2026, 09_25_56 PM (2).png",
        "location": "the complete standalone bow laid out at far left",
        "brief": (
            "the exact very tall narrow strung dark-brown wood-like stave bow "
            "visible at far left of the primary source: one continuous shallow "
            "D-shaped working curve, subtly thicker central handgrip, one complete "
            "plain dark cord string connected at both tips, several narrow tan and "
            "brown binding bands at the grip and spaced limb zones, and small dark "
            "terminal nocks; show tip to tip; no archer, hand, figure, quiver, "
            "arrows, armor, recurve hooks, metal collars, ornament, or modern hardware"
        ),
        "canvas": "P",
        "grid": "2x4",
        "external": [
            EXTERNAL / "pinterest_promoted" / "pinterest_64a5b627f42b.jpg"
        ],
    },
    {
        "art_id": "source_north_socketed_hook_sickle",
        "name": "Socketed Hook Sickle",
        "ladder": "faction_north - INT - tier 2",
        "prompt_class": "sickle",
        "source": LADDERS
        / "faction_north - INT - tier 2"
        / "014__p1__8c5cdf25-b299-42ae-8754-208ea02ea9b6.png",
        "location": "the complete hooked cutter held low at viewer-left",
        "brief": (
            "the exact complete compact hooked cutter visible in the primary "
            "source, historically anchored as a socketed Late Bronze Age sickle: "
            "one plain inward-curving copper-alloy cutting blade with its sharpened "
            "inner edge, seated through one short simple cylindrical socket or "
            "ferrule onto a medium straight plain wood haft; one-handed shaft-mounted "
            "hook-cutter silhouette, actively maintained bronze with light handling "
            "wear only; no hand, figure, shield, sword guard, sword hilt, decorative "
            "brass bands, symbols, tassels, serrations, medieval billhook, long "
            "polearm shaft, giant scythe blade, or added ornament"
        ),
        "canvas": "P",
        "grid": "1x3",
        "external": [EXTERNAL / "met_244233_sickle_cypriot_bronze.jpg"],
    },
]


def canvas_block(item: dict) -> str:
    ratio = {"P": "2:3 portrait", "S": "1:1 square", "L": "3:2 landscape"}[
        item["canvas"]
    ]
    return (
        "SOURCE-OBSERVED INVENTORY TARGET\n"
        f"Primary object source: {item['source'].name}. Extract {item['location']}. "
        "That visible object is authoritative for silhouette, materials, joins, "
        "closure, proportions, and bounded ornament. Do not synthesize a new "
        "object, merge neighboring equipment, or add faction materials absent "
        "from it.\n\n"
        f"Runtime footprint: {item['grid']} cells. Required generator canvas: "
        f"{item['canvas']}, {ratio}. Use Path of Exile only as an inventory-icon "
        "composition benchmark: one complete isolated object, strong silhouette, "
        "readable occupancy, and no UI."
    )


def main() -> None:
    PROMPTS.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    records = []
    for number, item in enumerate(ITEMS, start=1):
        if not item["source"].is_file():
            raise FileNotFoundError(item["source"])
        for path in item["external"]:
            if not path.is_file():
                raise FileNotFoundError(path)
        ladder = BUILDER.parse_ladder(item["ladder"])
        prompt = BUILDER.individual_prompt(
            ladder=ladder,
            item_class=item["prompt_class"],
            brief=item["brief"],
            refs=[item["source"]],
            external_refs=item["external"],
            item_number=number,
            motif=None,
        )
        batch = f"BATCH: {ladder.folder}; deliverable {number}; class {item['prompt_class']}."
        prompt = prompt.replace(batch, batch + "\n\n" + canvas_block(item), 1)
        prompt_path = PROMPTS / f"{number:02d}__{item['art_id']}.txt"
        prompt_path.write_text(prompt, encoding="utf-8")
        refs = [item["source"]] + item["external"]
        if len(refs) > 5:
            raise RuntimeError(f"too many references for {item['art_id']}")
        records.append(
            {
                "number": number,
                "art_id": item["art_id"],
                "name": item["name"],
                "canvas": item["canvas"],
                "grid": item["grid"],
                "prompt_path": str(prompt_path),
                "reference_paths": [str(path) for path in refs],
                "output_path": str(RAW / f"{item['art_id']}.png"),
            }
        )
    (OUT / "manifest.json").write_text(
        json.dumps(records, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Built {len(records)} locked Wave 02 prompts")


if __name__ == "__main__":
    main()
