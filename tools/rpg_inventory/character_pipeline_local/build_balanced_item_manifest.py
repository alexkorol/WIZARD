#!/usr/bin/env python3
"""Build a balanced five-item-per-ladder multi-reference generation manifest."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


FACTIONS = {
    "faction_north": ("Northern Bronze Houses", "pale hemmed wool and linen, bright tin bronze, pale ash wood, horn cream, clean russet structural hide, bounded madder, spruce, and ochre woven accents"),
    "faction_stonewood": ("Cedar-Obsidian Clans", "cedar-bark textile, woven fiber, shell white, raw copper, greenstone, neutral-black obsidian, mineral red, and warm hide used mainly as backing"),
    "faction_dustwind": ("Silkroad Plateau Nomads", "luminous felt, wool and linen, clean warm sand, saffron, mulberry and crimson, bright bronze or brass, neutral-black lacquered details, russet structural hide, and carnelian"),
    "faction_riverspill": ("Nile-Ziggurat Kingdoms", "brilliant white linen, bronze and brass, neutral-black structural hide, carnelian, malachite or green faience, polished wood and reed; true lapis only for INT"),
}

# Research routes follow the faction's implied historical cousins. These are
# search/verification clusters, not instructions to copy a modern artist or to
# collapse several cultures into one object. Each generated item should choose
# one coherent anchor inside its faction cluster.
HISTORICAL_RESEARCH_CLUSTERS = {
    "faction_north": (
        "Nordic and Central European Bronze Age material culture: Nordic Bronze Age, "
        "Unetice, Tumulus, and Urnfield clothing, amber exchange, cast bronze weapons, "
        "wool mantles, pins, helmets, shields, tools, and hafting"
    ),
    "faction_stonewood": (
        "cedar-, fiber-, shell-, stone-, and obsidian-working traditions: prehistoric "
        "Northwest Coast protective clothing and wood armor for construction logic, "
        "plus Neolithic Anatolian and pre-Columbian stone/obsidian tool and weapon forms; "
        "select one region per item and do not blend sacred imagery"
    ),
    "faction_dustwind": (
        "Iranian plateau and early Inner Asian equipment: Achaemenid Persian, Median, "
        "Saka/Scythian, Bactrian, Urartian, and Luristan clothing, feltwork, archery gear, "
        "scale armor, bronze/iron weapons, tack, quivers, and portable tools"
    ),
    "faction_riverspill": (
        "Nile and ancient West Asian river states: Predynastic and dynastic Egyptian, "
        "Sumerian, Akkadian, Elamite, Assyrian, and Babylonian linen clothing, reedwork, "
        "copper/bronze weapons, helmets, shields, scale armor, tools, and vessels; select "
        "one cultural anchor per item"
    ),
}

WEAPONS = [
    ("short_blade", "Achaemenid akinakes short sword or dagger: one bare compact double-edged iron or bronze blade, low midrib, swollen guard, and T-shaped pommel; no scabbard, sheath, case, or paired accessory"),
    ("long_sword", "Late Bronze Age Naue II or Mycenaean flanged-hilt sword: leaf-to-parallel bronze blade, raised central strengthening step, triangular shoulders, riveted organic grip plates"),
    ("axe_adze", "Luristan-style socketed axe-adze: one unusual hollow inclined bronze blade, compact pick or adze counterform, relief-cast socket, and a short practical wood haft"),
    ("impact", "Bronze Age impact weapon: perforated stone, antler, or cast bronze mace head on a short stout haft, with a strongly readable non-spear silhouette"),
    ("bow_gorytos", "Achaemenid, Saka, or steppe standalone rigid quiver or arrow case: one complete empty wood-slat, bark, woven-fiber, felt, or sheet-bronze gorytos-derived storage container with hide only as sparse binding or backing, ancient thong or toggle suspension, and a capped mouth or empty dark opening; absolutely no arrows, bow, stitched leather tube, metal snap, modern strap hardware, bow limb, bowstring, grip, or combined archery set"),
    ("sling_throwing", "one empty historical hand sling only: a broad woven cradle with two long braided release/retention cords, one ending in a simple finger loop and the other in a plain release knot; no projectile, stone, sling bullet, ammunition pouch, case, hand, figure, spear, pole, or long staff"),
    ("spear_reach", "Bronze Age short thrusting spear: one complete leaf-shaped socketed bronze head on a restrained straight shaft, full tip-to-butt diagonal, no halberd or medieval polearm elaboration"),
]

BODY_BY_TIER = {
    1: [
        "woven or quilted textile corselet with exactly one sparse reinforcement zone: either 3-8 small bronze discs total or 4-10 narrow splints total; cloth is visually dominant, at least eighty percent of the visible area remains textile, and leather is only hidden structural backing",
        "layered linen, wool, felt, bark-fiber, or reed-panel torso defense with finished hems and simple cord joins; no leather bodice",
    ],
    2: [
        "true overlapping bronze, copper, horn, shell, or hard-organic scale/lamellar corselet laced to a textile backing; every small plate overlaps coherently",
        "textile corselet reinforced by broad bronze pectoral discs and articulated vertical splints, visibly more metal than leather",
    ],
    3: [
        "Dendra-inspired articulated sheet-bronze panoply: separate shoulder arcs, broad torso plates, and hanging lower bands joined by cord or leather thongs; ancient plate, not medieval armor",
        "dense hand-linked ring mesh panels combined with a few shaped bronze plates and a textile lining; a rare fantasy early-ring construction, explicitly not a medieval riveted-mail hauberk",
        "high-density overlapping scale or lamellar armor with shaped bronze shoulder and chest plates; ancient lacing logic and no modern buckles",
    ],
}

SECONDARY = {
    "headgear": [
        "boar-tusk or horn-segment helmet built from many curved plaques sewn onto a textile cap",
        "Urartian-style tall pointed sheet-bronze helmet with restrained hammered bands and a complete empty dome",
        "Illyrian or Corinthian-derived bronze helmet with a full bowl, fixed cheek plates, readable brow and neck edge, but faction-specific construction rather than a replica",
        "layered felt, woven bast, or corded-fiber war cap made entirely from its continuous soft construction family, with denser woven ribs and a shaped folded brow but no bronze, brass, horn, stone, or decorative hard plates",
    ],
    "shield": [
        "Mycenaean figure-eight rawhide shield over a light wood or wicker frame",
        "tall Dipylon-like hide shield with opposing side cutouts and a strong woven frame",
        "crescent or deeply notched parrying shield of hide, reed, and bronze edging",
        "small Urartian-style round or tall oval shield with hammered bronze face over wood; no front straps",
    ],
    "outer_layer": [
        "substantial long finished woven mantle or rectangular shawl in a tall vertical 2:3 frame, full cloth fall visible from shoulder edge to lower hem, one plain undecorated non-circular ancient pin fastening; no disk brooch or radial clasp",
        "long quilted travel cloak in a tall vertical 2:3 frame, bounded woven border, full lower hem visible, and an empty hood or shoulder yoke; plain cord or toggle fastening, no disk brooch or radial clasp",
        "long continuous felt or linen travel mantle in a tall vertical 2:3 frame, built from broad uninterrupted cloth fields with a simply folded shoulder cape, sparse pleats or two large overlapping rectangular panels; no shingles, scale-like tabs, feathered rows, lamellar imitation, or repeated dangling panels; decoration is confined to one bounded lower hem or front-edge field",
    ],
    "hands_arms": [
        "paired materially continuous quilted cloth archer mitts with enclosed hand pouches, separate thumb volume, doubled palms, corded seams, and short soft wrist guards, empty and anatomy-free; no metal, horn, shell, stone, or obsidian plates; not fingerless gloves or standalone bracers",
        "paired enclosed felt, woven-fiber, or hide mitt guards with complete hand bodies, separate thumb volumes, dense quilting or doubled wear zones, and short flexible cuffs, empty and anatomy-free; no hard plates, visible finger stalls, or bare forearm-only bracers",
        "paired true metal gauntlets with contiguous articulated bronze or copper-alloy backhand, knuckle, and enclosed mitten-shell construction over a subordinate hidden lining; metal is the dominant visible body, not small plates pasted onto a soft mitten; empty and anatomy-free",
    ],
    "legs_footwear": [
        "paired shaped bronze greaves integrated with simple ancient one-piece wrapped-hide shoes or thong sandals; raw pierced lacing holes with no metal eyelets; each sole is one thin flat hand-cut hide or fiber layer with no raised sidewall or heel; empty shells, no anatomy, modern welts, molded toe boxes, sneaker seams, or dense regular stitching",
        "paired cloth-and-splint shin guards over woven wraps integrated with woven bast/fiber shoes, felt foot bags, or simple sandals with thin flat hide or fiber soles; complete empty pair, no anatomy or modern shoe construction",
        "paired woven bast/fiber shoes or simple one-piece felt boots with sparse hand lacing and modest bronze or shell ankle reinforcement; thin flat hand-cut soles, visibly empty, no modern panel seams, eyelets, welts, or stacked soles",
    ],
    "carry": [
        "rigid standalone empty wood-slat, bark, woven-fiber, felt, or sheet-bronze gorytos-derived quiver or arrow case with hide only as sparse binding or backing, simple thong or toggle suspension, and a capped mouth or empty dark opening; absolutely no arrows, bow, stitched leather tube, swivel ring, D-ring, metal snap, buckle, modern strap hardware, bow limb, bowstring, grip, or combined archery set",
        "lidded pyxis, scroll case, or divided preparation case in wood, bone, bronze, ceramic, or woven fiber; simple thong, pin, or toggle closure with no metal suspension ring",
        "packable pannier, reed basket case, or textile tool roll with faction-specific thong, pin, or toggle fastenings and no generic leather pouch or metal suspension ring",
        "bronze-sheet cylindrical quiver inspired by Urartian examples, with a complete rim and restrained hammered bands",
    ],
    "ritual": [
        "one handled ritual bell, sistrum-like rattle, or compact standard head with a credible socket; no staff",
        "one compact double-ended ritual weapon inspired by vajra/dorje and lajatang geometry: pronged bronze center grip with symmetric short crescent or spike heads, hand-held scale only, no long staff",
        "one lidded censer, oil lamp, offering vessel, or pyxis with clear functional openings and no vague glowing crystal",
        "one seal-cylinder spindle, spindle whorl, or bronze disc mirror in a rigid backing frame; no readable script",
        "one animal-headed Luristan-inspired bronze finial or yoke fitting, detached as a complete functional object rather than a figurine collage",
    ],
    "signal": [
        "one compact bronze trumpet or curved horn with complete mouthpiece and bell, no modern valves",
        "one ancient hand bell or rattle with a substantial handle and visible clapper or rattle frame",
        "one fire-making, fletching-repair, or medical textile roll with a few large readable implements",
        "one horse-bit, harness plate, or compact tack assembly with unusual ancient bronze geometry and no modern buckle system",
    ],
}

PATTERNS = [
    ("body_armor", "headgear", "shield", "weapon", "carry"),
    ("body_armor", "outer_layer", "hands_arms", "weapon", "ritual"),
    ("body_armor", "legs_footwear", "shield", "weapon", "signal"),
]

# Items 6-10 complete the ladder's equipment vocabulary without adding a
# second weapon. This keeps the expanded 400-item collection from drifting
# back toward the overrepresented spear/polearm and generic weapon mix.
COMPLEMENT_PATTERNS = [
    ("outer_layer", "hands_arms", "legs_footwear", "ritual", "signal"),
    ("headgear", "shield", "legs_footwear", "carry", "signal"),
    ("headgear", "outer_layer", "hands_arms", "carry", "ritual"),
]

# One-based picks from the rendered top-12 candidate sheets. These deliberately
# trade tiny score differences for visibly different silhouettes and item cues.
CROWDED_SELECTIONS = {
    "faction_dustwind - DEX - tier 2": [1, 3, 6, 7],
    "faction_north - DEX - tier 2": [1, 2, 9, 12],
    "faction_north - STR - tier 2": [1, 2, 3, 11],
    "faction_riverspill - DEX - tier 2": [3, 4, 5, 6],
    "faction_riverspill - INT - tier 2": [1, 2, 3, 4],
    "faction_riverspill - STR - tier 2": [1, 2, 6, 7],
    "faction_stonewood - DEX - tier 2": [1, 2, 3, 10],
    "faction_stonewood - STR - tier 2": [2, 3, 4, 7],
}

MISC_ITEMS = [
    ("carry", "a compact pack saddle or paired pannier with woven, wood, bronze, and textile construction; no animal or anatomy"),
    ("ritual", "a complete lidded ritual vessel, censer, pyxis, or offering bowl derived from the reference craft language"),
    ("signal", "a complete ancient bell, rattle, horn, or standard head with no long staff"),
    ("shield", "an unusual small shield or protective screen of wicker, hide, wood, shell, or bronze; front fighting face only"),
    ("carry", "a closed quiver, preparation case, scroll case, or tool roll with readable ancient fastenings and no generic belt pouch"),
]

MISC_ITEMS_EXTENDED = MISC_ITEMS + [
    ("headgear", "one complete ancient utility cap or light helmet using exactly one dominant construction family: either an all-woven/all-felt/all-fiber cap with no metal ornament, or a metal-led hammered bronze helmet with only a narrow functional lining; full dome and back visible"),
    ("outer_layer", "one long continuous travel mantle of broad woven cloth fields with simple folds and a plain pin, toggle, or cord; no shingles, scale-like tabs, or feather rows"),
    ("hands_arms", "a complete empty pair of materially continuous enclosed quilted, woven, felt, or hide mitt guards with doubled palms, corded seams, and short soft cuffs; no metal, horn, shell, stone, or obsidian plates, fingerless gloves, or standalone bracers"),
    ("legs_footwear", "a complete empty pair of ancient woven-fiber, felt, or wrapped-hide shoes with thin flat hand-cut soles and sparse thong lacing; no modern shoe construction"),
    ("impact", "one compact pre-ancient impact tool or war club with a perforated stone, antler, hardwood, or cast copper-alloy head on a short practical haft"),
]

BASE_RENDER = """Render one isolated dark low-fantasy ARPG inventory item as a complete solid three-dimensional object in a dynamic three-quarter product view. Crisp high-resolution game asset, sharp readable silhouette, material-specific seams, weave, lacing, hammered bronze, wood grain, bone, shell, stone, and restrained wear. Strong upper-left key, deep neutral shadows only on the object, crisp cool rim light, neutral white balance.

The entire canvas background is one perfectly flat, uniform, unlit olive-slate matte #737A68: no cast shadow, contact shadow, gradient, texture, floor, horizon, reflection, smoke, particles, aura, text, border, UI, or watermark. Keep the item complete and uncropped with generous padding. Do not use #737A68 in the item.

Object only. No character, anatomy, hands, arms, fingers, head, face, hair, torso, legs, feet, toes, skin, invisible mannequin, or flesh-colored filler. Openings contain only deep neutral interior shadow or the flat matte. Do not create a sheet, grid, collage, lineup, inset, alternate view, or multiple-item board."""

WEAPON_CLASSES = {
    "short_blade",
    "long_sword",
    "axe_adze",
    "impact",
    "bow_gorytos",
    "sling_throwing",
    "spear_reach",
}

COMPACT_SQUARE_WEAPON_CLASSES = {
    "claw",
    "knuckles",
    "chakrum",
}

ARMOR_CLASSES = {
    "body_armor",
    "headgear",
    "shield",
    "outer_layer",
    "hands_arms",
    "legs_footwear",
}

EXTERNAL_REF_FILES = {
    "armor_scales": "met_326389_armor_scales_achaemenid.jpg",
    "axe_luristan": "met_327326_axe_luristan_spiked.jpg",
    "adze_complete": "met_568261_adze_egyptian_complete.jpg",
    "bronze_kit": "met_324433_persian_guard_relief.jpg",
    "dagger_hattian": "met_324457_sword_dagger_hattian.jpg",
    "dagger_minoan": "met_252405_dagger_minoan_bronze.jpg",
    "greaves": "met_247112_greaves_etruscan_pair.jpg",
    "helmet": "met_255927_helmet_cretan_bronze.jpg",
    "helmet_picene": "met_248010_helmet_picene_bronze.jpg",
    "mace": "met_244473_mace_cypriot_bronze.jpg",
    "ritual_mace": "met_324454_mace_hattian_bronze.jpg",
    "shield_plain": "met_244565_shield_boss_plain.jpg",
    "shield_herringbone": "met_248656_shield_boss_herringbone.jpg",
    "sword": "met_27513_sword_middle_bronze_age.jpg",
    "textile_linen": "met_443650_textile_egyptian_linen.jpg",
    "textile_wool_linen": "met_443341_textile_egyptian_wool_linen.jpg",
    "basket": "met_572181_basket_egyptian_coiled.jpg",
    "horse_bit": "met_324042_horse_bit_achaemenid.jpg",
    "bell": "met_326604_bell_iran_iron_age.jpg",
    "mirror": "met_253623_mirror_greek_bronze.jpg",
    "spindle": "met_323683_spindle_whorl_iran.jpg",
    "pinterest_tools": "pinterest_promoted/pinterest_16408d0f75a5.jpg",
    "sling_woven": "met_314617_woven_sling_inca.jpg",
    "footwear_sheet": "user_reference_footwear_history_sheet.png",
    "pinterest_scale": "pinterest_promoted/pinterest_299f87f23afe.jpg",
    "pinterest_archery": "pinterest_promoted/pinterest_64a5b627f42b.jpg",
    "pinterest_spear": "pinterest_promoted/pinterest_71668b278895.jpg",
    "pinterest_armor_board": "pinterest_discovery_unverified/pinterest_299f87f23afe.jpg",
    "pinterest_assyrian_kit": "pinterest_discovery_unverified/pinterest_3ca04651e17c.jpg",
    "pinterest_reenactor_kit": "pinterest_discovery_unverified/pinterest_4dad4cbe3dd5.jpg",
    "pinterest_bronze_age_lineup": "pinterest_discovery_unverified/pinterest_bdbf29800e20.jpg",
    "pinterest_equipment_typology": "pinterest_discovery_unverified/pinterest_e755acacb90e.jpg",
    "replica_dendra_artistic": "replica_reconstruction/dendra_replica_artistic_ccby.jpg",
    "replica_dendra_action": "replica_reconstruction/dendra_replica_action_ccby.jpg",
    "replica_weapon_shields": "replica_reconstruction/bronze_age_replica_weapon_shield_experiment.jpg",
}

MOTIF_LIBRARY_PATH = Path(__file__).with_name("historical_motif_library.json")
MANUFACTURING_LIBRARY_PATH = Path(__file__).with_name("manufacturing_anachronism_library.json")


@dataclass(frozen=True)
class Ladder:
    folder: str
    faction: str
    axis: str
    tier: int | None


def parse_ladder(name: str) -> Ladder:
    if name.endswith(" - Misc"):
        return Ladder(name, name.removesuffix(" - Misc"), "MISC", None)
    match = re.fullmatch(r"(faction_[a-z]+) - (STR|DEX|INT) - tier ([123])", name)
    if not match:
        raise ValueError(name)
    return Ladder(name, match.group(1), match.group(2), int(match.group(3)))


def image_quality(path: Path) -> float:
    try:
        with Image.open(path) as image:
            width, height = image.size
        portrait_bonus = 2.0 if height >= width else 0.0
        return min(width * height / 1_000_000, 8.0) + portrait_bonus
    except OSError:
        return -100.0


def load_records(state_path: Path) -> list[dict]:
    state = json.loads(state_path.read_text(encoding="utf-8"))
    return list(state["review_items"].values())


def record_score(record: dict) -> float:
    path = Path(record.get("current_path", ""))
    return (
        {"reviewed": 100, "assistant_sorted": 55}.get(record.get("status"), 0)
        + {"high": 20, "medium": 10, "low": 0}.get(record.get("confidence"), 0)
        + image_quality(path)
    )


def choose_references(ladder: Ladder, records: list[dict], limit: int = 3) -> tuple[list[Path], list[dict]]:
    valid = [r for r in records if r.get("status") != "ignored" and Path(r.get("current_path", "")).is_file()]
    direct = sorted((r for r in valid if r.get("folder") == ladder.folder), key=record_score, reverse=True)
    picks = CROWDED_SELECTIONS.get(ladder.folder)
    if picks:
        selected_records = [direct[index - 1] for index in picks[:limit] if index <= len(direct)]
        return [Path(record["current_path"]) for record in selected_records], direct
    pool = list(direct)
    if len(pool) < limit:
        if ladder.axis == "MISC":
            support = [r for r in valid if r.get("faction") == ladder.faction and r not in pool]
        else:
            support = [
                r for r in valid
                if r.get("faction") == ladder.faction and r.get("axis") == ladder.axis and r not in pool
            ]
            support.sort(key=lambda r: (abs(int(r.get("tier") or 2) - int(ladder.tier or 2)), -record_score(r)))
        pool.extend(support)
    selected: list[Path] = []
    seen = set()
    for record in pool:
        path = Path(record["current_path"])
        key = str(path).casefold()
        if key in seen:
            continue
        selected.append(path)
        seen.add(key)
        if len(selected) == limit:
            break
    return selected, direct


def make_assignment(ladder: Ladder, slot: str, index: int, global_index: int) -> tuple[str, str]:
    if slot == "weapon":
        family, description = WEAPONS[global_index % len(WEAPONS)]
        return family, description
    if slot == "body_armor":
        choices = BODY_BY_TIER[ladder.tier or 2]
        return slot, choices[(global_index + index) % len(choices)]
    choices = SECONDARY[slot]
    return slot, choices[(global_index + index) % len(choices)]


def choose_external_references(output: Path, item_class: str, brief: str) -> list[Path]:
    ref_dir = output / "external_references"
    names: list[str] = []
    if item_class == "headgear":
        names = ["pinterest_assyrian_kit", "replica_dendra_artistic"]
    elif item_class == "shield":
        names = ["replica_weapon_shields", "pinterest_reenactor_kit"]
    elif item_class == "body_armor":
        names = ["replica_dendra_artistic", "pinterest_armor_board"]
    elif item_class == "legs_footwear":
        names = ["footwear_sheet", "pinterest_bronze_age_lineup"]
    elif item_class in {"hands_arms", "outer_layer"}:
        names = ["pinterest_bronze_age_lineup", "pinterest_reenactor_kit"]
    elif item_class == "impact":
        names = ["pinterest_tools", "pinterest_equipment_typology"]
    elif item_class == "axe_adze":
        names = ["pinterest_tools", "pinterest_equipment_typology"]
    elif item_class == "short_blade":
        names = ["pinterest_equipment_typology", "pinterest_bronze_age_lineup"]
    elif item_class == "long_sword":
        names = ["pinterest_equipment_typology", "pinterest_bronze_age_lineup"]
    elif item_class == "bow_gorytos":
        names = ["pinterest_archery", "pinterest_assyrian_kit"]
    elif item_class == "spear_reach":
        names = ["pinterest_spear", "pinterest_bronze_age_lineup"]
    elif item_class == "sling_throwing":
        # Slings are a severe image-model failure mode. Always ground their
        # cradle-and-two-cords silhouette in a documented real object.
        names = ["sling_woven"]
    elif item_class in WEAPON_CLASSES:
        names = ["pinterest_equipment_typology", "pinterest_bronze_age_lineup"]
    elif item_class == "ritual":
        names = ["pinterest_equipment_typology", "pinterest_assyrian_kit"]
    elif item_class == "carry":
        names = ["pinterest_assyrian_kit", "pinterest_bronze_age_lineup"]
    elif item_class == "signal":
        names = ["pinterest_equipment_typology", "pinterest_assyrian_kit"]
    else:
        names = ["pinterest_bronze_age_lineup", "pinterest_equipment_typology"]
    paths = [ref_dir / EXTERNAL_REF_FILES[name] for name in names]
    return [path for path in paths if path.is_file()]


def load_motifs() -> list[dict]:
    data = json.loads(MOTIF_LIBRARY_PATH.read_text(encoding="utf-8"))
    return list(data["motifs"])


def manufacturing_rule(item_class: str) -> str:
    """Return slot-specific ancient workshop cues and modern completion bans."""
    data = json.loads(MANUFACTURING_LIBRARY_PATH.read_text(encoding="utf-8"))
    universal = data["universal"]
    specific = data["by_class"].get(item_class, {})
    avoid = universal["avoid"] + specific.get("avoid", [])
    prefer = universal["prefer"] + specific.get("prefer", [])
    return (
        "Avoid modern manufactured completion: " + "; ".join(avoid) + ".\n"
        "Instead show pre-ancient workshop construction: " + "; ".join(prefer) + "."
    )


def choose_motif(
    ladder: Ladder,
    item_class: str,
    brief: str,
    item_key: str,
    wave_counts: Counter,
    motifs: list[dict],
) -> dict | None:
    """Allocate sparse, non-celestial ornament without repeating a batch default."""
    seed = hashlib.sha256(item_key.encode("utf-8")).digest()
    none_threshold = 88 if ladder.tier == 1 else 72
    if item_class == "ritual":
        none_threshold = min(none_threshold, 58)
    if seed[0] % 100 < none_threshold:
        return None

    tier = ladder.tier or 2
    allowed_statuses = {"auto"}
    if tier >= 2:
        allowed_statuses.add("auto_tier2plus")
    if tier >= 3:
        allowed_statuses.add("auto_tier3")
    candidates = [motif for motif in motifs if motif.get("status") in allowed_statuses]
    if item_class in WEAPON_CLASSES:
        candidates = [motif for motif in candidates if motif.get("kind") in {"structural", "geometric", "surface"}]
    elif item_class in {"outer_layer", "hands_arms", "carry"}:
        candidates = [motif for motif in candidates if motif.get("kind") in {"textile", "material", "geometric", "botanical"}]
    metal_dominant = bool(re.search(r"\b(bronze|brass|copper|metal|sheet-metal|sheet-bronze)\b", brief, re.IGNORECASE))
    if metal_dominant:
        candidates = [
            motif
            for motif in candidates
            if motif.get("id") not in {"reed_bundle_stripes", "coiled_basket_rings", "diagonal_basket_twill"}
            and motif.get("kind") not in {"botanical", "textile", "material"}
        ]
    if not candidates:
        return None

    least_used = min(wave_counts[motif["id"]] for motif in candidates)
    candidates = [motif for motif in candidates if wave_counts[motif["id"]] == least_used]
    motif = candidates[int.from_bytes(seed[1:5], "big") % len(candidates)]
    wave_counts[motif["id"]] += 1
    return motif


def motif_rule(motif: dict | None) -> str:
    hard_ban = (
        "Hard ban even if a reference contains it: no sun, solar disk, rayed disk, starburst, rosette, radial spokes, "
        "eight-spoked wheel, celestial wheel, concentric sun rings, circular ray pattern, sun-like boss, halo emblem, "
        "winged disk, crescent-star, bright round centerpiece, spiral, spiral scroll, running spiral, volute, or repeated curl band. "
        "Do not replace a banned sun with a near-identical radial flower."
    )
    if motif is None:
        return (
            "MOTIF ALLOCATION: NONE. This item has no symbol, emblem, sigil, medallion, badge, sacred mark, animal badge, "
            "botanical badge, or decorative centerpiece. Let silhouette, material, seams, overlap, edge shape, and tool marks carry the design. "
            + hard_ban
        )
    return (
        f"MOTIF ALLOCATION: exactly one optional bounded accent: {motif['label']}. If used, follow this construction: {motif['prompt']}. "
        "It may appear once in one small edge, hem, rim, grip, socket, or terminal field only. It is not a faction logo, holy sign, central badge, or repeated set emblem. "
        "Do not add a second motif. Leave at least eighty percent of the visible surface as plain material. "
        + hard_ban
    )


def framing_rule(item_class: str) -> str:
    if item_class in WEAPON_CLASSES:
        return (
            "Canvas and framing: tall vertical portrait inventory image, usually 2:3 and sometimes closer to 2:4 for long weapons. Never use a horizontal or landscape weapon canvas. "
            "Place the complete weapon on a steep controlled diagonal or vertical three-quarter angle from tip to butt so the handle, grip, haft, bow case, sling cord, or shaft keeps natural proportions and is not stretched, flattened, shortened, or cropped. "
            "Only compact claw, knuckle, or chakrum-style weapons may use square 1:1 framing; all swords, daggers, axes, maces, clubs, bows, slings, spears, ritual weapons, vajra/dorje-like forms, and lajatang-like forms should be portrait."
        )
    if item_class == "outer_layer":
        return (
            "Canvas and framing: tall vertical portrait composition, ideally 2:3. Do not use a horizontal or landscape canvas. "
            "Show the full cloak, mantle, or shawl length from shoulder/yoke to lower hem without compressing it into a shoulder pad."
        )
    if item_class == "legs_footwear":
        return (
            "Canvas and framing: portrait or square composition, never horizontal. Show both complete greave/footwear forms with height preserved and soles visible."
        )
    if item_class in ARMOR_CLASSES:
        return (
            "Canvas and framing: square or portrait inventory icon composition, never horizontal or landscape. "
            "Preserve the armor silhouette and do not stretch it sideways to fill a wide frame."
        )
    return (
        "Canvas and framing: use square or portrait framing unless the item is explicitly a girdle or belt. "
        "The only standard horizontal inventory slot is a true girdle/belt."
    )


def individual_prompt(ladder: Ladder, item_class: str, brief: str, refs: list[Path], external_refs: list[Path], item_number: int, motif: dict | None) -> str:
    culture, materials = FACTIONS[ladder.faction]
    historical_cluster = HISTORICAL_RESEARCH_CLUSTERS[ladder.faction]
    tier_text = "auxiliary/Misc" if ladder.tier is None else f"Tier {ladder.tier}"
    ref_lines = "\n".join(f"- CHARACTER REFERENCE {chr(65 + i)}: {path.name}" for i, path in enumerate(refs))
    external_ref_lines = "\n".join(
        f"- {('VISUAL INSPIRATION' if path.parent.name.startswith('pinterest_') else 'REPLICA / EXPERIMENTAL RECONSTRUCTION' if path.parent.name == 'replica_reconstruction' else 'HISTORICAL VERIFICATION')} REFERENCE {i + 1}: {path.name}"
        for i, path in enumerate(external_refs)
    ) or "- none supplied"
    tier_rules = {
        None: "Keep this as a practical ancient auxiliary object rather than a prestige relic unless all references clearly support prestige. It should look like field equipment or workshop craft, not palace regalia.",
        1: "Tier 1: few components, simple seams and joins, locally plausible cheap materials, modest repair, no jewels, no complex mechanism, no parade finish, no high-status engraving. Repeated reinforcement is sparse rather than dense: one bounded zone and no long rows of dozens of identical plates, scales, splints, studs, or discs.",
        2: "Tier 2: trained craft and purposeful reinforcement, but still common-use equipment. Use several coherent components at most, with plain geometry and functional edges. No royal overbuilding, no all-over engraving, no dense filigree, no museum-masterpiece polish.",
        3: "Tier 3: best-in-class ancient craft for the ladder, but still made with pre-ancient tools and plausible labor. Complexity comes from fit, overlap, balance, and clean construction, not decorative density. Never medieval, industrial, palace-regalia, or fantasy-ornate.",
    }[ladder.tier]
    if ladder.tier == 1 and item_class == "hands_arms":
        tier_rules += (
            " Tier 1 handwear uses one continuous soft construction family only: quilted cloth, woven fiber, felt, or hide. "
            "Reinforce it with denser weave, quilting, doubled palms, corded seams, or hide wear patches. "
            "No bronze, brass, horn, shell, stone, ceramic, glass, or obsidian plates anywhere; no armored cuff, "
            "overlapping plate row, decorative plaque, or riveted panel."
        )
    return f"""Generate 1 image. No commentary.

BATCH: {ladder.folder}; deliverable {item_number}; class {item_class}.

Use every attached character image as complementary visual context for one {culture} equipment culture. Use every attached historical reference image as authenticity support for object silhouette, period construction, proportions, and craft details. The attachments are:
{ref_lines}

Historical reference images:
{external_ref_lines}

Extract the character images' repeated craft logic: silhouette, material response, palette placement, edge shapes, weave, seams, lacing, wrapping, and plate layout. Museum artifact references correct authenticity only for object proportions, helmet/shield/weapon families, construction logic, silhouette, hafting, coverage, and ancient ornament restraint. Never copy a museum object's burial condition, corrosion, patina, pitting, encrustation, mineral staining, cracks, missing pieces, faded color, or conservation damage. A VISUAL INSPIRATION reference is a reconstruction or typology lead: use its useful silhouette, assembly, overlap, material placement, hafting, or coverage clue, but do not copy text, watermarks, sacred imagery, or an exact composition. A REPLICA / EXPERIMENTAL RECONSTRUCTION reference may guide complete assembly, functional joints, fit, healthy material color, and active-service finish, while the named faction still controls the design language. Character references and selected inspiration/replica references control faction identity and finish; museum references are verification constraints, not surface-finish drivers.

FACTION MATERIAL LANGUAGE
{materials}. Keep colors spatially separate and material-local. No copied sacred symbols, readable writing, faction logo, or repeated centerpiece gem.

FACTION HISTORICAL RESEARCH ROUTE
{historical_cluster}. Use this as a research and plausibility route, not a collage instruction. Anchor this item in one compatible people/region/period and one real object family. Clothing, armor, weapons, tools, and their construction are primary evidence; raw materials and symbols are secondary evidence. Never imitate a reference artist's overall style.

AXIS AND TIER
{ladder.axis} is an equipment-design pressure only: STR favors leverage and robust protection; DEX favors articulation, compact access and balance; INT favors intricate functional implements and controlled ritual construction. {tier_rules}

ORNAMENT CONTROL
Use construction detail instead of random costume clutter. Most surfaces should be plain material: hammered metal, woven textile, wood grain, horn, bone, or hide. Put decoration only on one or two bounded bands, rims, bosses, or edge fields. Avoid all-over engraving, filigree, palace-regalia polish, repeated curls, repeated bosses, dense studs, gemstone-like centers, and fantasy luxury detailing. Avoid loose danglies, charms, tassels, chimes, hanging rings, dangling cords, and decorative straps unless the requested item cannot read without them. For DEX items, keep the silhouette especially low-snag, compact, quiet, and stealth-practical.

{motif_rule(motif)}

GENERATE EXACTLY THIS ONE ITEM
{brief}

{framing_rule(item_class)}

This exact item class outranks any spear, polearm, belt, leather bodice, bracer, boot, gemmed circlet, or generic fantasy slot visible in the references. Do not substitute a belt. Do not substitute a spear or polearm unless this assignment explicitly names a spear. If armor is requested, make the named cloth, scale/lamellar, plate/splint, or ring construction visually dominant rather than defaulting to brown leather.

CLASS-SPECIFIC CORRECTIONS
If this is a sword or dagger, render the bare weapon only: no scabbard, sheath, case, display stand, or paired accessory. If this is a quiver, arrow case, or gorytos-derived container, render the standalone empty storage container only with a capped mouth or empty dark opening; no arrows, bow, bow limb, bowstring, grip, or combined archery set anywhere. If this is a sling, render exactly one empty hand sling based closely on the attached real sling reference: one woven cradle and exactly two long braided cords, with a simple finger loop on one cord and a plain release knot on the other; no stones, sling bullets, projectiles, ammunition pouch, bag, case, hand, figure, staff, or surrounding kit. If this is hands/arms, choose one coherent family: either a materially continuous pair of woven/felt/quilted/hide mitts reinforced only by weave, quilting, doubled palms, seams, or hide wear patches; or a true metal-led articulated gauntlet pair with contiguous backhand and knuckle construction over a subordinate lining. Never paste isolated metal, horn, shell, stone, or obsidian plates onto a soft mitten. Do not output fingerless gloves, modern gloves, standalone forearm bracers, or vambraces. If this is headgear, choose one coherent family: an all-woven/all-felt/all-fiber cap with no hard ornament, or a metal-led helmet with only narrow functional lining or ties; never decorate valuable metal with reeds, straw, bast, wicker, coarse fiber, or felt panels. If this is legs/footwear, include complete paired greaves or shin protection integrated with one-piece wrapped-hide shoes, woven bast/fiber shoes, felt foot bags, or simple thong sandals with thin flat hand-cut soles; no isolated greaves, anatomy, welted construction, molded toe boxes, sneaker-like panels, modern eyelets, stacked/rubber-like soles, or dense regular stitching. Treat only the Stone Age hide wrapping, Bronze Age yucca-fiber sandal, and basic palm-leaf slipper silhouettes in the supplied footwear study as positive construction evidence; explicitly ignore its Roman, Byzantine, and medieval shoes. If this is an outer layer, use a tall vertical composition, ideally 2:3, with the full cloak or mantle length visible.

MANUFACTURING ANACHRONISM CONTROL
{manufacturing_rule(item_class)}

HISTORICAL LIMIT
Stay within the faction research route and Neolithic, Bronze Age, or early Iron Age construction adjacency. Do not average unrelated cultures into one object. No medieval knight armor, steel plate harness, modern tactical gear, guns, zippers, plastic, industrial fasteners, or post-medieval weapon forms.

TECH LEVEL RESTRAINT
The item should look buildable by pre-ancient workshops: cast, hammered, sewn, laced, woven, carved, riveted, wrapped, or shaped by hand. Avoid machine-perfect symmetry, excessive part counts, seamless compound curves, layered fantasy ornament, crisp modern leatherwork, and perfectly polished collector-object finish. A believable ancient artifact with strong game readability is better than a spectacular ornate prop.

ACTIVE-SERVICE CONDITION
This is usable equipment that was made recently or has been actively maintained, not an excavated archaeological object. Bronze, copper, wood, hide, textile, horn, bone, shell, and stone keep clear healthy material color. Allow light handling polish, shallow scratches, a little edge wear, soot where function requires it, small repairs, and mild localized tarnish only. No heavy green verdigris, black corrosion crust, powdery oxidation, burial staining, deep pitting, encrustation, flaking metal, rotten fiber, extensive cracking, missing material, faded museum-object color, or all-over distressed texture. Do not antique every surface.

MATERIAL ROLE AND JOIN AUDIT
Every material must have a mechanically credible job and interface. Choose one dominant construction family per object. Hard shell materials carry impact; textile, felt, hide, and plant fiber serve as backing, lining, edge binding, suspension, or a separate broad flexible body. Lower-cost organic material may support metal mechanically but may not decorate it: no exposed reed, straw, bast, wicker, coarse-fiber, or felt stripe, crest filler, ornamental panel, or prestige inlay on bronze/brass helmets, cuirasses, gauntlets, shields, or weapons. A woven helmet is entirely woven/felted/fiber construction; a metal helmet is metal-led. A soft mitt is entirely soft-material construction; a metal gauntlet uses contiguous articulated metal rather than isolated plates pasted onto cloth. Do not splice a narrow woven reed, plant-stem, basketry, or cloth stripe through the middle of a continuous bronze helmet or plate. Do not lace carefully cut rectangular stone, obsidian, ceramic, or glass tiles into mitts, cuffs, flexible armor, or articulated joints; brittle mineral may appear only as a tiny protected inset or a true cutting/tool edge. Show how every dissimilar material is joined with a plausible overlap, backing, holes, lacing, rivets, socket, wrapping, or edge binding.

STRUCTURAL COMPLETENESS AUDIT
The three-quarter view may occlude parts but may not invent one-sided construction. Paired cheek guards, ear flaps, neck guards, shoulder defenses, mitts, greaves, straps, hinges, and suspension points need a mechanically corresponding opposite side unless the assignment explicitly requests purposeful asymmetry. A rear neck guard must visibly continue across the back of the helmet rather than hanging from one side only. Show at least an edge, hinge, overlap, or silhouette cue proving the hidden counterpart exists. Handmade variation is welcome; missing structural halves are not.

{BASE_RENDER}
"""


def contact_sheet(records: list[dict], output: Path, title: str) -> None:
    rows = records[:12]
    thumb, label_h, cols = 260, 44, 4
    sheet = Image.new("RGB", (cols * thumb, math.ceil(len(rows) / cols) * (thumb + label_h) + 34), "#1d211d")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    draw.text((8, 8), title, fill="#f2d090", font=font)
    for index, record in enumerate(rows):
        path = Path(record["current_path"])
        with Image.open(path) as source:
            image = ImageOps.contain(source.convert("RGB"), (thumb, thumb))
        tile = Image.new("RGB", (thumb, thumb), "white")
        tile.paste(image, ((thumb - image.width) // 2, (thumb - image.height) // 2))
        x = index % cols * thumb
        y = 34 + index // cols * (thumb + label_h)
        sheet.paste(tile, (x, y))
        label = f"{index + 1:02d} {record.get('status')} {record.get('confidence')}\n{path.name[:34]}"
        draw.multiline_text((x + 4, y + thumb + 3), label, fill="white", font=font, spacing=2)
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, quality=91)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ladders", type=Path, required=True)
    parser.add_argument("--state", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    records = load_records(args.state)
    ladders = sorted(
        (parse_ladder(path.name) for path in args.ladders.iterdir() if path.is_dir() and path.name.startswith("faction_")),
        key=lambda item: item.folder,
    )
    args.output.mkdir(parents=True, exist_ok=True)
    prompt_dir = args.output / "prompts"
    candidate_dir = args.output / "reference_candidates"
    prompt_dir.mkdir(exist_ok=True)

    manifest = []
    motifs = load_motifs()
    motif_counts_by_wave: dict[int, Counter] = defaultdict(Counter)
    global_standard_index = 0
    chosen_refs = {}
    for ladder_index, ladder in enumerate(ladders):
        refs, direct = choose_references(ladder, records)
        if len(direct) > 30:
            contact_sheet(direct, candidate_dir / f"{ladder.folder}.jpg", ladder.folder)
        chosen_refs[ladder.folder] = [str(path) for path in refs]
        if ladder.axis == "MISC":
            assignments = MISC_ITEMS_EXTENDED
        else:
            pattern_index = global_standard_index % len(PATTERNS)
            first_five = [
                make_assignment(ladder, slot, item_index, global_standard_index)
                for item_index, slot in enumerate(PATTERNS[pattern_index])
            ]
            second_five = [
                make_assignment(ladder, slot, item_index + 5, global_standard_index + len(PATTERNS))
                for item_index, slot in enumerate(COMPLEMENT_PATTERNS[pattern_index])
            ]
            assignments = first_five + second_five
        folder_prompt_parts = ["Generate 10 images. No commentary.", f"Folder: {ladder.folder}", "Each numbered deliverable must be a separate independent image file, never a sheet or collage."]
        for item_index, (item_class, brief) in enumerate(assignments, 1):
            wave = math.floor((len(manifest)) / 60) + 1
            motif = choose_motif(
                ladder,
                item_class,
                brief,
                f"{ladder.folder}|{item_index}|{item_class}|{brief}",
                motif_counts_by_wave[wave],
                motifs,
            )
            external_refs = choose_external_references(args.output, item_class, brief)
            prompt = individual_prompt(ladder, item_class, brief, refs, external_refs, item_index, motif)
            prompt_path = prompt_dir / f"{ladder.folder}__{item_index:02d}__{item_class}.txt"
            prompt_path.write_text(prompt, encoding="utf-8")
            manifest.append({
                "folder": ladder.folder,
                "faction": ladder.faction,
                "axis": ladder.axis,
                "tier": "Misc" if ladder.tier is None else ladder.tier,
                "item_number": item_index,
                "item_class": item_class,
                "brief": brief,
                "references": json.dumps([str(path) for path in refs]),
                "external_references": json.dumps([str(path) for path in external_refs]),
                "motif_id": motif["id"] if motif else "none",
                "prompt_path": str(prompt_path),
                "output_path": str(args.output / ladder.folder / f"{item_index:02d}__{item_class}.png"),
                "wave": wave,
            })
            folder_prompt_parts.append(f"\nDELIVERABLE {item_index} — {item_class}\n{brief}")
        (prompt_dir / f"{ladder.folder}__WEBAPP-10-IMAGE-PROMPT.txt").write_text("\n".join(folder_prompt_parts), encoding="utf-8")
        if ladder.axis != "MISC":
            global_standard_index += 1

    manifest_path = args.output / "balanced_item_manifest.tsv"
    with manifest_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(manifest[0]), delimiter="\t")
        writer.writeheader()
        writer.writerows(manifest)
    (args.output / "selected_references.json").write_text(json.dumps(chosen_refs, indent=2), encoding="utf-8")
    summary = {
        "folders": len(ladders),
        "items": len(manifest),
        "waves": dict(Counter(row["wave"] for row in manifest)),
        "item_classes": dict(Counter(row["item_class"] for row in manifest)),
        "motifs": dict(Counter(row["motif_id"] for row in manifest)),
        "candidate_sheets": len(list(candidate_dir.glob("*.jpg"))) if candidate_dir.exists() else 0,
    }
    (args.output / "manifest_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
