#!/usr/bin/env python3
"""Build six locked Wave 05 prompts from already-audited exact sources."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets_staging" / "source-observed-wave-05"
PROMPTS = OUT / "prompts"
RAW = OUT / "raw"
REFS = OUT / "references"
BUILDER_PATH = ROOT / "character_pipeline_local" / "build_balanced_item_manifest.py"

SPEC = importlib.util.spec_from_file_location("balanced_builder_wave05", BUILDER_PATH)
assert SPEC and SPEC.loader
BUILDER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUILDER
SPEC.loader.exec_module(BUILDER)


ITEMS = [
    {
        "art_id": "helmet_light_riverhide",
        "name": "River-Hide War Hood",
        "ladder": "faction_riverspill - DEX - tier 3",
        "prompt_class": "helmet",
        "canvas": "S",
        "grid": "2x2",
        "refs": [
            REFS / "british_museum_EA5473_00020721001_preview.jpg",
            REFS / "british_museum_EA5473_00020722001_rear.jpg",
        ],
        "authority": (
            "British Museum EA5473 front and rear views control the complete "
            "crocodile-hide helmet, including the rear fall."
        ),
        "brief": (
            "one empty complete Roman-Egyptian crocodile-hide helmet: a fitted "
            "rounded crown sewn from contiguous natural scuted hide, a clean "
            "arched brow opening, mechanically corresponding side fields, and "
            "one distinctive long central posterior fall; slight three-quarter "
            "view proving crown, both sides, brow, and full rear fall; healthy "
            "supple dark brown hide with restrained natural scute variation; no "
            "crocodile head, snout, eyes, teeth, dragon styling, pasted scales, "
            "lamellae, metal bands, studs, jewels, chin buckle, modern aviator "
            "seams, corselet, shoulders, anatomy, mannequin, copied desiccation, "
            "tears, burial damage, or missing structural counterpart"
        ),
    },
    {
        "art_id": "body_cuirass_heroic",
        "name": "Heroic Bronze Cuirass",
        "ladder": "faction_north - STR - tier 3",
        "prompt_class": "body",
        "canvas": "P",
        "grid": "2x3",
        "refs": [
            REFS / "met_256134_DP102285_apulian_muscle_cuirass_primary.jpg",
            REFS / "met_256134_DP-44280-001_apulian_muscle_cuirass_reverse.jpg",
        ],
        "authority": (
            "Met 1992.180.3a,b front and reverse views control the complete "
            "two-shell Apulian bronze cuirass and its joins."
        ),
        "brief": (
            "one empty complete active-service fourth-century BCE Apulian bronze "
            "muscle cuirass with separate modeled front and back sheet-bronze "
            "shells, coherent mature torso anatomy, side hinges, paired shoulder "
            "rings with short functional leather ties, and short integral hip "
            "flanges; three-quarter view proving front volume, rear shell, both "
            "side joins, shoulder closures, waist, and complete lower rim; warm "
            "healthy bronze with light handling polish and shallow scratches; no "
            "body, underlayer, skirt, belt, pants, mail, medieval breastplate "
            "waist, giant pectorals, fantasy abs, gems, symbols, text, leather "
            "decoration, missing back, machine-perfect trim, copied corrosion, "
            "pitting, burial stain, display stand, or museum damage"
        ),
    },
    {
        "art_id": "amulet_copper_cowrie",
        "name": "Bronze Cowrie Amulet",
        "ladder": "faction_dustwind - INT - tier 2",
        "prompt_class": "amulet",
        "canvas": "S",
        "grid": "1x1",
        "refs": [
            REFS / "british_museum_WITT-434_cowrie_view_1.jpg",
            REFS / "british_museum_WITT-434_cowrie_view_2.jpg",
        ],
        "authority": (
            "British Museum WITT.434 controls the bronze cowrie-form body and "
            "small pierced top lug; omit museum string and secondary ring."
        ),
        "brief": (
            "one isolated pendant-only bronze cowrie-form amulet about 38 mm "
            "long: an elongated slightly tapering oval, strongly convex body, one "
            "deep narrow dark longitudinal slit occupying most of the front, "
            "rounded nearly plain reverse, narrow neck, and one small complete "
            "pierced top lug visibly distinct from the body; slight three-quarter "
            "front view; dark warm brown bronze with only mild localized tarnish; "
            "no cord, cord fragment, knot, chain, clasp, museum white string, "
            "separate giant bail, fused ring, natural-shell gloss, literal anatomy, "
            "tooth, second shell, beads, charms, gem, inlay, text, rays, symbols, "
            "corrosion lump, copied damage, or extra hardware"
        ),
    },
    {
        "art_id": "wpn_axe_canaan_window",
        "name": "Canaan Window-Axe",
        "ladder": "faction_dustwind - STR - tier 3",
        "prompt_class": "axe_adze",
        "canvas": "P",
        "grid": "1x3",
        "refs": [
            REFS / "met_325093_HB61_29_fenestrated_axe_original.jpg",
            REFS / "christies_19876_lot143_levantine_fenestrated_axe_view_1.jpg",
        ],
        "authority": (
            "Met 61.29 controls the compact paired-window bronze head; the "
            "complete Levantine comparison controls only straight haft seating."
        ),
        "brief": (
            "one complete active-service Canaanite Middle Bronze Age fenestrated "
            "axe: a compact tapered duckbill-like bronze head with exactly two "
            "elongated open windows separated by one robust central rib, a "
            "restrained short cutting edge, and three integral head collars seated "
            "cleanly around one continuous straight reddish-brown wooden haft; "
            "three-quarter view proving both windows, rib, edge, collars, and "
            "wood-to-metal load path; no single giant window, broad semicircular "
            "fantasy crescent, extra shaft sleeves, caps, ornament, metal grip, "
            "modern machining, fused wood/metal, loose head, conventional socketed "
            "axe, pick, hammer poll, copied verdigris, pitting, burial damage, or "
            "museum stand"
        ),
    },
    {
        "art_id": "helmet_open_bronze_chalcidian",
        "name": "Bronze Chalcidian Helm",
        "ladder": "faction_north - DEX - tier 3",
        "prompt_class": "helmet",
        "canvas": "S",
        "grid": "2x2",
        "refs": [
            REFS / "met_257636_2003.407.2_hinged_chalcidian_helmet.jpg",
            REFS / "bm_1873-0820-225_chalcidian_front.jpg",
            REFS / "bm_1873-0820-225_chalcidian_rear.jpg",
        ],
        "authority": (
            "Met 2003.407.2 controls one coherent hinged-cheek Chalcidian build; "
            "British Museum views corroborate full rear and open-face geometry."
        ),
        "brief": (
            "one empty complete active-service mature-bronze Chalcidian helmet: "
            "one continuous high deep rounded bowl with full rear volume, a close "
            "restrained brow, open eye field, modest central nasal, two long shaped "
            "leaf cheekpieces built as a mechanically matching hinged pair, deep "
            "open ear cutouts, and one short continuous mildly flared rear neck edge "
            "spanning the back; slightly elevated three-quarter view proving dome, "
            "rear, near cheek, far counterpart and hinge cue, ear opening, nasal, "
            "and rear lip; no crest, plume, socket, knob, horns, wings, spikes, "
            "fantasy face, spangen plates, crossbands, mail, articulated tail, "
            "symbols, engraving, gems, colored inlay, decorative leather stripes, "
            "machine-perfect trim plates, copied corrosion, holes, anatomy, hair, "
            "mannequin, label, or stand"
        ),
    },
    {
        "art_id": "amulet_shell_oval",
        "name": "Oval Shell Pendant",
        "ladder": "faction_riverspill - INT - tier 1",
        "prompt_class": "amulet",
        "canvas": "S",
        "grid": "1x1",
        "refs": [
            REFS / "met_571030_shell_pendant_view_1.jpg",
            REFS / "met_571030_shell_pendant_view_2.jpg",
        ],
        "authority": (
            "Met 571030 controls the complete Predynastic natural shell pendant; "
            "species is unstated and no cord is evidenced."
        ),
        "brief": (
            "one isolated pendant-only natural shell matching Met 571030: a small "
            "rounded-oval convex shell with one broad aperture and thick lip, muted "
            "cream, tan, and pink-brown natural growth bands, and one large irregular "
            "upper-side suspension perforation; slight three-quarter view so aperture, "
            "convex volume, lip, edge, and hole all read at icon scale; no species "
            "claim, cord, cord fragment, knot, chain, metal mount, bail, beads, "
            "cluster, second shell, fringe, charm, gemstone, symbol, nacre fantasy "
            "gloss, modern polish, copied chips, burial dirt, or museum backdrop"
        ),
    },
]


def canvas_block(item: dict) -> str:
    ratio = {"P": "2:3 portrait", "S": "1:1 square", "L": "3:2 landscape"}[
        item["canvas"]
    ]
    return (
        "SOURCE-OBSERVED INVENTORY TARGET\n"
        f"{item['authority']} Do not average sources, copy archaeological "
        "damage, or invent neighboring hardware.\n\n"
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
        for path in item["refs"]:
            if not path.is_file():
                raise FileNotFoundError(path)
        ladder = BUILDER.parse_ladder(item["ladder"])
        prompt = BUILDER.individual_prompt(
            ladder=ladder,
            item_class=item["prompt_class"],
            brief=item["brief"],
            refs=[],
            external_refs=item["refs"],
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
        records.append(
            {
                "number": number,
                "art_id": item["art_id"],
                "name": item["name"],
                "canvas": item["canvas"],
                "grid": item["grid"],
                "prompt_path": str(prompt_path),
                "reference_paths": [str(path) for path in item["refs"]],
                "output_path": str(RAW / f"{item['art_id']}.png"),
            }
        )
    (OUT / "manifest.json").write_text(
        json.dumps(records, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Built {len(records)} locked Wave 05 prompts")


if __name__ == "__main__":
    main()
