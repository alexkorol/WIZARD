#!/usr/bin/env python3
"""Build an eight-record source-observed manifest with prior-art reuse gates."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets_staging" / "source-observed-wave-01"
PROMPTS = OUT / "prompts"
RAW = OUT / "raw"
BUILDER_PATH = ROOT / "character_pipeline_local" / "build_balanced_item_manifest.py"

SPEC = importlib.util.spec_from_file_location("balanced_builder_source_wave", BUILDER_PATH)
assert SPEC and SPEC.loader
BUILDER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUILDER
SPEC.loader.exec_module(BUILDER)

DOWNLOADS = Path(r"C:\Users\Alex\Downloads")
DUSTWIND_SOURCE = DOWNLOADS / "ladders" / "faction_dustwind - DEX - tier 2" / "ChatGPT Image Jul 12, 2026, 09_25_56 PM (3).png"
NORTH_SOURCE = DOWNLOADS / "ladders" / "faction_north - STR - tier 3" / "ChatGPT Image Jul 9, 2026, 09_40_32 PM (3).png"
EXTERNAL = DOWNLOADS / "items_multi_context_balanced_v1" / "external_references"
POST_CALIB = DOWNLOADS / "items_post_calib_batch"


ITEMS = [
    {
        "art_id": "source_plateau_recurve_bow",
        "name": "Plateau Recurve Bow",
        "ladder": "faction_dustwind - DEX - tier 2",
        "prompt_class": "bow",
        "source": DUSTWIND_SOURCE,
        "location": "the complete unheld bow laid out immediately left of the mounted rider",
        "brief": (
            "the exact compact recurved bow visible in the primary source: one complete dark horn-and-wood bow with a narrow waist, "
            "strongly recurved black tips, a short red-wrapped center grip, a few narrow bounded woven binding bands, and one taut string; "
            "no arrows, quiver, hand, rider, horse, spear, ribbons, or surrounding kit"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [EXTERNAL / "pinterest_promoted" / "pinterest_64a5b627f42b.jpg"],
    },
    {
        "art_id": "source_plateau_woven_quiver",
        "name": "Plateau Woven Quiver",
        "ladder": "faction_dustwind - DEX - tier 2",
        "prompt_class": "carry",
        "source": DUSTWIND_SOURCE,
        "location": "the complete quiver laid out to the lower right of the mounted rider",
        "brief": (
            "the exact tall quiver visible in the primary source: a long slightly tapered woven-and-hide body with bounded red, ochre, "
            "blue, and dark geometric textile panels, one broad russet leather side/back strip, two large plain suspension loops, "
            "a short dense fiber fringe at the closed base, and a clearly visible empty dark open mouth; "
            "the quiver is an empty standalone container with no arrows, shafts, fletching, bow, bowstring, grip, or combined archery set; "
            "no bow, figure, horse, modern buckle, polished metal collar, metal rivets, or invented lid"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [],
    },
    {
        "art_id": "source_plateau_felt_helm",
        "name": "Plateau Felt Riding Helm",
        "ladder": "faction_dustwind - DEX - tier 2",
        "prompt_class": "headgear",
        "source": DUSTWIND_SOURCE,
        "location": "the empty conical riding helmet laid out above and right of the mounted rider",
        "brief": (
            "the exact complete empty ochre felt riding helmet visible in the primary source: a low conical stitched crown with rounded apex, "
            "one small dark-blue cloth top button, narrow dark reinforced seam bands, short side ear flaps, and a continuous dark rear neck flap; "
            "soft textile construction only, no bronze, brass, metal studs, face, hair, crest, nasal, horns, or medieval point"
        ),
        "canvas": "S",
        "grid": "2x2",
        "external": [],
        "reuse_existing": POST_CALIB / "ChatGPT Image Jul 14, 2026, 01_03_23 AM (3).png",
        "reuse_art_id": "helmet_ridged_hide_point",
    },
    {
        "art_id": "source_plateau_riding_coat",
        "name": "Plateau Riding Coat",
        "ladder": "faction_dustwind - DEX - tier 2",
        "prompt_class": "outer_layer",
        "source": DUSTWIND_SOURCE,
        "location": "the complete empty short-sleeved riding coat laid out at far right",
        "brief": (
            "the exact complete empty ochre felt-and-wool riding coat visible in the primary source: knee-length open-front body, short sleeves, "
            "dark plain lining, one narrow red-and-blue woven border following the front opening, sleeve edges, and lower hem, and two small side vents; "
            "no body, belt, armor, trousers, collar jewelry, metal clasp, long tassels, or added panels"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [],
    },
    {
        "art_id": "source_north_leaf_sword",
        "name": "Northern Leaf Sword",
        "ladder": "faction_north - STR - tier 3",
        "prompt_class": "long_sword",
        "source": NORTH_SOURCE,
        "location": "the complete isolated sword displayed vertically at far right",
        "brief": (
            "the exact complete bare bronze sword visible at far right of the primary source: a long broad leaf-shaped blade with a low faceted midrib, "
            "modest shoulders, a short straight guard, a compact ribbed grip, and a rounded disc pommel; no scabbard, hand, figure, shield, text, or extra weapon"
        ),
        "canvas": "P",
        "grid": "1x3",
        "external": [EXTERNAL / "met_27513_sword_middle_bronze_age.jpg"],
    },
    {
        "art_id": "source_north_oval_shield",
        "name": "Northern Oval Shield",
        "ladder": "faction_north - STR - tier 3",
        "prompt_class": "shield",
        "source": NORTH_SOURCE,
        "location": "the large oval shield carried by either warrior",
        "brief": (
            "the exact front fighting face of the tall oval shield visible in the primary source: a pale plain hide-covered wood face, "
            "one low round bronze hand boss, a narrow dark rawhide-bound rim with sparse hand-fastened bronze edge points, and two small plain balancing bosses; "
            "front face only, no arm, hand, figure, rear straps, sun motif, painted emblem, or added ornament"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [],
    },
    {
        "art_id": "source_north_banded_corselet",
        "name": "Northern Banded Corselet",
        "ladder": "faction_north - STR - tier 3",
        "prompt_class": "body_armor",
        "source": NORTH_SOURCE,
        "location": "the bronze torso defense worn beneath the pale mantle",
        "brief": (
            "the exact complete empty hip-short corselet visible on the warriors in the primary source: many broad horizontal bronze splints or bands "
            "joined in close courses over a dark textile backing, compact shoulder coverage, open neck, straight lower edge, and restrained side lacing; "
            "torso armor only, no body, mantle, brooches, belt, skirt, trousers, greaves, shield, sun badges, or medieval mail"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [EXTERNAL / "met_326389_armor_scales_achaemenid.jpg"],
    },
    {
        "art_id": "source_north_bronze_cap",
        "name": "Northern Bronze Cap",
        "ladder": "faction_north - STR - tier 3",
        "prompt_class": "headgear",
        "source": NORTH_SOURCE,
        "location": "the bronze helmet worn by either warrior",
        "brief": (
            "the exact complete empty bronze helmet visible in the primary source: a low hemispherical cap of several hand-hammered panels, "
            "a narrow reinforced brow band, one low central seam ridge, paired short cheek guards, and a continuous shallow rear edge; "
            "no head, hair, crest, horns, nasal, plume, symbols, medieval point, or added ornament"
        ),
        "canvas": "S",
        "grid": "2x2",
        "external": [],
    },
]


def canvas_block(item: dict) -> str:
    ratio = {"P": "2:3 portrait", "S": "1:1 square", "L": "3:2 landscape"}[item["canvas"]]
    return (
        "SOURCE-OBSERVED INVENTORY TARGET\n"
        f"Primary object source: {item['source'].name}. Extract {item['location']}. "
        "That visible object is authoritative for silhouette, materials, joins, closure, proportions, and bounded ornament. "
        "Do not synthesize a new object, merge neighboring equipment, or add faction materials that are absent from it.\n\n"
        f"Runtime footprint: {item['grid']} cells. Required generator canvas: {item['canvas']}, {ratio}. "
        "Use Path of Exile only as an inventory-icon composition benchmark: one complete isolated object, strong silhouette, readable occupancy, and no UI."
    )


def main() -> None:
    PROMPTS.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    records = []
    for number, item in enumerate(ITEMS, start=1):
        if "quiver" in item["art_id"].lower():
            brief = item["brief"].lower()
            if "empty" not in brief or "no arrows" not in brief:
                raise RuntimeError(
                    f"{item['art_id']}: quiver prompt must require a visibly "
                    "open/capped empty container and explicitly say no arrows"
                )
        if not item["source"].is_file():
            raise FileNotFoundError(item["source"])
        if item.get("reuse_existing"):
            reuse_path = item["reuse_existing"]
            if not reuse_path.is_file():
                raise FileNotFoundError(reuse_path)
            records.append(
                {
                    "number": number,
                    "art_id": item["art_id"],
                    "name": item["name"],
                    "action": "reuse_existing_do_not_generate",
                    "reuse_art_id": item["reuse_art_id"],
                    "reuse_path": str(reuse_path),
                    "prompt_path": None,
                    "reference_paths": [str(reuse_path)],
                    "output_path": str(reuse_path),
                }
            )
            continue
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
    (OUT / "manifest.json").write_text(json.dumps(records, indent=2) + "\n", encoding="utf-8")
    generated = sum(1 for record in records if record.get("prompt_path"))
    reused = len(records) - generated
    print(
        f"Built {len(records)} source-observed records: "
        f"{generated} generation prompts, {reused} reuse-only"
    )


if __name__ == "__main__":
    main()
