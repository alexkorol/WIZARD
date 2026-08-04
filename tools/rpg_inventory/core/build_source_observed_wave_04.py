#!/usr/bin/env python3
"""Build locked Wave 04 prompts from verified museum and reconstruction sources."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets_staging" / "source-observed-wave-04"
PROMPTS = OUT / "prompts"
RAW = OUT / "raw"
REFS = OUT / "references"
BUILDER_PATH = ROOT / "character_pipeline_local" / "build_balanced_item_manifest.py"
EXTERNAL = (
    Path(r"C:\Users\Alex\Downloads")
    / "items_multi_context_balanced_v1"
    / "external_references"
)

SPEC = importlib.util.spec_from_file_location("balanced_builder_wave04", BUILDER_PATH)
assert SPEC and SPEC.loader
BUILDER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUILDER
SPEC.loader.exec_module(BUILDER)


ITEMS = [
    {
        "art_id": "wpn_axe_abydos_adze",
        "name": "Abydos Adze",
        "ladder": "faction_riverspill - STR - tier 2",
        "prompt_class": "axe_adze",
        "source": REFS / "british_museum_EA30079_asset_1211612001.jpg",
        "authority": (
            "British Museum EA30079 controls the exact copper blade. Met 568261 "
            "controls only the complete bent-wood haft and leather load path."
        ),
        "brief": (
            "one complete active-service Egyptian adze combining two explicitly "
            "bounded authorities: use the exact First Dynasty EA30079 blade as a "
            "very long narrow flat copper chisel strip, about seven times longer "
            "than its maximum width, with a squared butt, straight sides widening "
            "steadily toward the slightly convex widest cutting edge, and a "
            "one-face asymmetric chisel bevel; mount it exactly by the Met 568261 "
            "assembly logic against the outer flat seat of one short flattened limb "
            "on a one-piece naturally knee-bent wood haft; broad red-brown leather "
            "compression turns bind blade butt to the wood seat, and one separate "
            "narrow leather stay runs from that head binding back around the main "
            "shaft below the bend, leaving a small triangular throat; compact "
            "workmanlike haft about one-and-a-half blade lengths; show transverse "
            "cutting-edge orientation and every load-bearing contact; no conventional "
            "side axe, crescent head, socket, eye, tang-through-haft, metal collar, "
            "rivet, wedge, pick, hammer poll, straight handle, dangling strap, modern "
            "grip wrap, hoe, copied verdigris, linen remnant, museum number, or burial damage"
        ),
        "canvas": "P",
        "grid": "1x2",
        "external": [
            EXTERNAL / "met_568261_adze_egyptian_complete.jpg",
            EXTERNAL / "pinterest_promoted" / "pinterest_16408d0f75a5.jpg",
        ],
    },
    {
        "art_id": "wpn_bow_holmegaard_flat",
        "name": "Holmegaard Flatbow",
        "ladder": "faction_stonewood - DEX - tier 1",
        "prompt_class": "bow_gorytos",
        "source": REFS / "national_museum_denmark_holmegaard_iv_elm_bow.jpg",
        "authority": (
            "The National Museum artifact controls the elm profile and proportions; "
            "the Musée de l'Archerie reproduction supplies complete unbroken geometry only."
        ),
        "brief": (
            "one complete strung Mesolithic Holmegaard-style self bow in healthy "
            "plain elm: a rigid deep narrow one-piece handle waist, immediately "
            "widening above and below the grip into conspicuously broad flat "
            "plank-like inner limbs, then tapering continuously without abrupt "
            "shoulders into long narrow plain tips; rounded natural sapwood back, "
            "flat heartwood belly, small functional shoulder nocks, and one taut "
            "plain fiber string connected at both tips; show a mild long self-bow "
            "brace curve in slight front-three-quarter view so broad limb faces and "
            "the deep grip both read; tip to tip on a tall steep diagonal; no "
            "conservation bands, joins, gaps, support pieces, separate riser, grip "
            "wrap, repeated binding bands, recurve, hooks, horn caps, siyahs, "
            "Møllegabet-style abrupt shoulders, needle lever tips, arrow, quiver, "
            "archer, metal, decoration, museum damage, or generic narrow longbow"
        ),
        "canvas": "P",
        "grid": "2x4",
        "external": [REFS / "musee_archerie_valois_holmegaard_reproduction.jpg"],
    },
    {
        "art_id": "focus_copper_ladle",
        "name": "Copper Dipper Ladle",
        "ladder": "faction_riverspill - INT - tier 2",
        "prompt_class": "rite_focus",
        "source": REFS / "british_museum_N120_neo_assyrian_side_spouted_ladle.jpg",
        "authority": "British Museum N.120 controls the complete vessel geometry.",
        "brief": (
            "one complete active-service Neo-Assyrian copper-alloy side-spouted "
            "dipper matching British Museum N.120: a deep nearly hemispherical "
            "open bowl with no neck, one short blunt open-top trough spout emerging "
            "at rim level, and one high returning flat strap handle opposite the "
            "spout, the handle carrying only a few restrained longitudinal molded "
            "ribs; broad handled-vessel silhouette in slight three-quarter view, "
            "with the empty bowl interior, spout channel, and handle attachment all "
            "visible; no ewer neck, lid, foot, pedestal, second handle, long pouring "
            "beak, animal head, chain, ladle contents, engraved scene, gems, ornate "
            "regalia, copied corrosion, missing patches, catalog number, or museum backdrop"
        ),
        "canvas": "S",
        "grid": "2x2",
        "external": [],
    },
    {
        "art_id": "relic_stone_pyxis",
        "name": "Cycladic Stone Pyxis",
        "ladder": "faction_stonewood - INT - tier 1",
        "prompt_class": "relic",
        "source": REFS / "getty_88.AA.83_Early_Cycladic_cylindrical_pyxis.jpg",
        "authority": (
            "Getty 88.AA.83 controls the stone body, lid seat, and paired pierced lugs; "
            "restore only the documented missing lid as a plain fitted disc."
        ),
        "brief": (
            "one closed complete Early Cycladic pale marble pyxis based exactly on "
            "Getty 88.AA.83: a squat thick-walled slightly tapering cylinder with "
            "a flat bearing surface and no foot, a recessed circular rim collar, "
            "two opposed small pierced lugs immediately below the rim for cord "
            "closure, and one conservative plain close-fitting flat stone disc lid "
            "with minimal projection and a visible seam; slight three-quarter view "
            "showing both lid fit and at least one pierced lug; mostly plain active "
            "stone with restrained hand-tool variation; no open bowl, contents, red "
            "exterior pigment, top knob, domed lid, hinge, lock, metal band, feet, "
            "pedestal, foot ring, large carry handles, spiral, shrine architecture, "
            "all-over grooves, copied pitting, staining, worn breaks, or excavation damage"
        ),
        "canvas": "S",
        "grid": "1x1",
        "external": [],
    },
    {
        "art_id": "amulet_calcite_drop",
        "name": "Calcite Drop Amulet",
        "ladder": "faction_riverspill - INT - tier 1",
        "prompt_class": "amulet",
        "source": REFS / "british_museum_EA32123_calcite_vase_amulet.jpg",
        "authority": (
            "British Museum EA32123's rightmost pale calcite object controls the pendant; "
            "the neighboring blue and metal objects are not references."
        ),
        "brief": (
            "one complete wearable amulet using only the rightmost pale calcite "
            "object in the museum source: a narrow solid vase-shaped or drop-shaped "
            "pendant of circular section, about three times longer than its maximum "
            "diameter, with a gently flared rounded top, tapering body, pointed base, "
            "and one horizontal suspension bore through the top; pass one thin plain "
            "twisted bast or flax cord physically through that bore to form a full "
            "unbroken wearable neck loop, with one unobtrusive simple knot away from "
            "the pendant; pale translucent calcite with subtle natural variation; "
            "no mouth, hollow interior, vial, stopper, cap, bail, metal sleeve, bezel, "
            "cage, wire wrap, extra bead, charm, tassel, broad collar, symbol, inscription, "
            "gem facets, neighboring objects, catalog number, archaeological grime, or cropped cord"
        ),
        "canvas": "S",
        "grid": "1x1",
        "external": [],
    },
    {
        "art_id": "shield_bronze_yetholm",
        "name": "Ribbed Bronze Shield",
        "ladder": "faction_north - STR - tier 3",
        "prompt_class": "shield",
        "source": REFS / "british_museum_1873_0210_2_rhyd_y_gorse_yetholm_front.jpg",
        "authority": "The Rhyd-y-Gorse Yetholm shield controls the complete front construction.",
        "brief": (
            "one complete active-service Late Bronze Age Yetholm-type shield matching "
            "the primary source: one quite flat circular hand-beaten bronze sheet, "
            "one compact stepped conical central boss, exactly the dense field logic "
            "of about twenty shallow concentric ribs alternating with rows of tiny "
            "singly hand-punched bosses, and one continuous sheet rim turned toward "
            "the front; near-frontal slight three-quarter view preserving a true "
            "circle, boss projection, rib relief, and thousands of small non-jewel "
            "punches as historical sheet-working rather than attached hardware; "
            "healthy dark warm bronze with mild handling polish; no solar rays, "
            "spokes, radial emblem, whole-disc dome, ovalization, engraving replacing "
            "punches, jewels, holes, lacing, rawhide, wood backing, separate applied "
            "rim, exposed rear grip, segment seams, copied black museum backdrop, or corrosion crust"
        ),
        "canvas": "P",
        "grid": "2x3",
        "external": [],
    },
]


def canvas_block(item: dict) -> str:
    ratio = {"P": "2:3 portrait", "S": "1:1 square", "L": "3:2 landscape"}[
        item["canvas"]
    ]
    return (
        "SOURCE-OBSERVED INVENTORY TARGET\n"
        f"Primary object source: {item['source'].name}. {item['authority']} "
        "Use attached secondary sources only for the bounded completion role "
        "stated here and in the item brief. Do not average the sources, copy "
        "archaeological damage, or invent neighboring hardware.\n\n"
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
        for path in [item["source"]] + item["external"]:
            if not path.is_file():
                raise FileNotFoundError(path)
        ladder = BUILDER.parse_ladder(item["ladder"])
        prompt = BUILDER.individual_prompt(
            ladder=ladder,
            item_class=item["prompt_class"],
            brief=item["brief"],
            refs=[],
            external_refs=[item["source"]] + item["external"],
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
        reference_paths = [item["source"]] + item["external"]
        if len(reference_paths) > 5:
            raise RuntimeError(f"too many references for {item['art_id']}")
        records.append(
            {
                "number": number,
                "art_id": item["art_id"],
                "name": item["name"],
                "canvas": item["canvas"],
                "grid": item["grid"],
                "prompt_path": str(prompt_path),
                "reference_paths": [str(path) for path in reference_paths],
                "output_path": str(RAW / f"{item['art_id']}.png"),
            }
        )
    (OUT / "manifest.json").write_text(
        json.dumps(records, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Built {len(records)} locked Wave 04 prompts")


if __name__ == "__main__":
    main()
