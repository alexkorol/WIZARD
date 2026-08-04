#!/usr/bin/env python3
"""Build mixed faction reference boards for manual web-app generation.

These boards deliberately mix approved project ladder characters, interpretive
loadout/typology imagery, complete reconstructions, accepted Verdigris item art,
and a small number of construction anchors.  The prompt-specific ladder pair
still outranks every tile on the board.
"""

from __future__ import annotations

import json
import shutil
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[3]
PROJECT = ROOT / "tools" / "rpg_inventory"
STAGING = PROJECT / "assets_staging"
V1 = STAGING / "faction-moodboards-v1"
OUTPUT = STAGING / "faction-moodboards-v2"
SOURCES = OUTPUT / "sources"
USER = OUTPUT / "user-supplied"
LADDERS = Path(r"C:\Users\Alex\Downloads\ladders")
GOOD_BOW = Path(
    r"C:\Users\Alex\.codex\generated_images"
    r"\019f971d-736a-7491-b56c-fd604e172039"
    r"\call_vZq1aaNsNK904yIurHomoFeo.png"
)

BOARD_SIZE = (3072, 2304)
BG = "#121719"
CARD = "#23292c"
TEXT = "#f1eee7"
MUTED = "#b7b8b3"
RULE = "#3d464a"


def local_tile(
    *,
    key: str,
    title: str,
    source_class: str,
    path: Path,
    source: str,
    culture_date: str,
    transfer: str,
    do_not_transfer: str,
    authority_scope: str,
) -> dict:
    return {
        "key": key,
        "title": title,
        "source_class": source_class,
        "path": str(path),
        "source": source,
        "source_url": None,
        "culture_date": culture_date,
        "transfer": transfer,
        "do_not_transfer": do_not_transfer,
        "authority_scope": authority_scope,
    }


def remote_tile(
    *,
    key: str,
    title: str,
    source_class: str,
    image_url: str,
    source_url: str,
    source: str,
    culture_date: str,
    transfer: str,
    do_not_transfer: str,
    authority_scope: str,
) -> dict:
    return {
        "key": key,
        "title": title,
        "source_class": source_class,
        "image_url": image_url,
        "source_url": source_url,
        "source": source,
        "culture_date": culture_date,
        "transfer": transfer,
        "do_not_transfer": do_not_transfer,
        "authority_scope": authority_scope,
    }


def ladder(faction: str, axis: str, tier: int, filename: str) -> dict:
    folder = LADDERS / f"{faction} - {axis} - tier {tier}"
    return local_tile(
        key=f"{faction}_{axis.lower()}_t{tier}_ladder",
        title=f"{axis} tier {tier} project ladder",
        source_class="PROJECT LADDER — DESIGN AUTHORITY",
        path=folder / filename,
        source="Approved Verdigris faction ladder",
        culture_date=f"{faction} · {axis} · tier {tier}",
        transfer=(
            "Faction silhouette, material balance, equipment relationships, "
            "and ornament density."
        ),
        do_not_transfer=(
            "Outside a matching prompt tier this is faction context only; "
            "do not extract every visible object."
        ),
        authority_scope="faction context; prompt-specific ladder pair still wins",
    )


LADDER_SETS = {
    "faction_north": [
        ladder(
            "faction_north",
            "STR",
            1,
            "ChatGPT Image Jul 9, 2026, 09_40_32 PM (1).png",
        ),
        ladder(
            "faction_north",
            "STR",
            3,
            "ChatGPT Image Jul 9, 2026, 09_40_32 PM (3).png",
        ),
        ladder(
            "faction_north",
            "DEX",
            1,
            "ChatGPT Image Jul 9, 2026, 09_40_32 PM (4).png",
        ),
        ladder(
            "faction_north",
            "INT",
            1,
            "ChatGPT Image Jul 9, 2026, 09_40_33 PM (7).png",
        ),
    ],
    "faction_stonewood": [
        ladder(
            "faction_stonewood",
            "STR",
            1,
            "ChatGPT Image Jul 9, 2026, 09_38_33 PM (1).png",
        ),
        ladder(
            "faction_stonewood",
            "STR",
            3,
            "ChatGPT Image Jul 9, 2026, 09_38_35 PM (6).png",
        ),
        ladder(
            "faction_stonewood",
            "DEX",
            1,
            "ChatGPT Image Jul 9, 2026, 09_38_34 PM (4).png",
        ),
        ladder(
            "faction_stonewood",
            "INT",
            1,
            "ChatGPT Image Jul 9, 2026, 09_38_35 PM (7).png",
        ),
    ],
    "faction_dustwind": [
        ladder(
            "faction_dustwind",
            "STR",
            1,
            "ChatGPT Image Jul 9, 2026, 09_42_24 PM (1).png",
        ),
        ladder(
            "faction_dustwind",
            "STR",
            3,
            "ChatGPT Image Jul 9, 2026, 09_42_25 PM (3).png",
        ),
        ladder(
            "faction_dustwind",
            "DEX",
            3,
            "ChatGPT Image Jul 9, 2026, 09_42_25 PM (6).png",
        ),
        ladder(
            "faction_dustwind",
            "INT",
            1,
            "ChatGPT Image Jul 9, 2026, 09_42_26 PM (7).png",
        ),
    ],
    "faction_riverspill": [
        ladder(
            "faction_riverspill",
            "STR",
            1,
            "ChatGPT Image Jul 9, 2026, 09_29_09 PM (1).png",
        ),
        ladder(
            "faction_riverspill",
            "STR",
            3,
            "ChatGPT Image Jul 9, 2026, 09_29_09 PM (3).png",
        ),
        ladder(
            "faction_riverspill",
            "DEX",
            3,
            "ChatGPT Image Jul 9, 2026, 09_29_10 PM (6).png",
        ),
        ladder(
            "faction_riverspill",
            "INT",
            1,
            "ChatGPT Image Jul 9, 2026, 09_29_10 PM (7).png",
        ),
    ],
}


FACTIONS = {
    "faction_north": {
        "title": "NORTHERN BRONZE HOUSES",
        "accent": "#d3ad69",
        "guardrail": (
            "Organic low tiers first. Bronze is structural or elite, never casual "
            "trim. No Viking shorthand, horns, runes, mail, or seamless joins."
        ),
        "v1_keys": [
            (
                "north_replica_weapon_shields",
                "MODERN REPLICA / EXPERIMENT — FAMILY + ACTIVE USE",
                "Complete weapon/shield proportions and healthy working color.",
                "Painted motifs, modern workshop finish, or bronze on cheap soft gear.",
            ),
            (
                "north_tool_hafting_lead",
                "COMPARATIVE SHEET — RANGE ONLY; DO NOT COMBINE",
                "Distinct tool silhouettes and visible wood/metal/cord separation.",
                "Unverified decoration, hybridizing the assortment, or modern polish.",
            ),
            (
                "north_egtved_costume_actual",
                "GARMENT / COMPLETE KIT LAYOUT",
                "Garment cut, corded skirt, plain tie, and separate wearable pieces.",
                "Metal belt plates, museum arrangement as an inventory recipe, or prestige color.",
            ),
            (
                "north_otzi_bearskin_cap",
                "LATER/REGIONAL COMPARATOR — TECHNIQUE ONLY",
                "Cap volume, seam, and chin strap for a low-tier organic helm.",
                "Alpine identity, copied styling, or metal garnish.",
            ),
            (
                "north_central_europe_sword",
                "ARTIFACT — CONSTRUCTION ANCHOR",
                "Full blade proportion and a legible blade-to-hilt break.",
                "Corrosion, excavation damage, or a blended handle.",
            ),
            (
                "north_plain_bronze_helmet",
                "ARTIFACT — CONSTRUCTION ANCHOR",
                "Plain dome, rim, and believable sheet-metal continuity.",
                "Horns, fantasy crests, polished brass, or low-tier use.",
            ),
        ],
        "extra": [
            local_tile(
                key="north_arpg_hide_shield",
                title="Existing Verdigris hide-shield study",
                source_class="ARPG / PROJECT ART — SILHOUETTE + GRID ONLY",
                path=STAGING / "hideshield_oxhide.png",
                source="Current RPG inventory art study",
                culture_date="Project style reference",
                transfer="Bold contour, compact inventory read, and material legibility.",
                do_not_transfer="Exact shape, palette, lighting, stitching, or faction identity.",
                authority_scope="presentation only",
            ),
            local_tile(
                key="north_arpg_hide_mitts",
                title="Existing Verdigris stitched-mitt study",
                source_class="ARPG / PROJECT ART — SILHOUETTE + GRID ONLY",
                path=STAGING / "hands_hide_pouch_mitts.png",
                source="Current RPG inventory art study",
                culture_date="Project style reference",
                transfer="Readable paired-item staging, worn hide, seams, and clean grid occupancy.",
                do_not_transfer="Exact outline, fur trim, mitten construction, or modern polish.",
                authority_scope="presentation only",
            ),
        ],
    },
    "faction_stonewood": {
        "title": "CEDAR–OBSIDIAN CLANS",
        "accent": "#85c095",
        "guardrail": (
            "Wood, fiber, hide, and stone remain visibly separate. No sacred masks, "
            "spirals, pan-Indigenous motif blending, tooth substitution, or glossy fantasy joins."
        ),
        "v1_keys": [
            (
                "stonewood_tlingit_armor",
                "LATER CONTINUITY — ARMOR SYSTEM ONLY",
                "Slat overlap, lacing, wrapping, and believable load paths.",
                "Crest imagery, clan motifs, exact regalia, or copied carving.",
            ),
            (
                "stonewood_karuk_rod_armor",
                "LATER CONTINUITY — ASSEMBLY ONLY",
                "Rod-and-cord structure, flexible coverage, and closure logic.",
                "Culture-specific patterns or treating the late date as faction canon.",
            ),
            (
                "stonewood_wrapped_stone_knife",
                "COMPLETE OBJECT — JOIN ANCHOR",
                "Positive wood/stone/hide separation and a believable wrapped joint.",
                "Exact culture styling, modern glue, or stone melting into wood.",
            ),
            (
                "stonewood_plain_obsidian_blade",
                "ARTIFACT — MATERIAL ANCHOR",
                "Flaked edge behavior, asymmetry, and believable brittle thickness.",
                "A giant monolithic fantasy axe head or glossy machined edge.",
            ),
        ],
        "extra": [
            local_tile(
                key="stonewood_equipped_context",
                title="Equipped organic armor and club context",
                source_class="MODERN ILLUSTRATION — EQUIPPED CONTEXT ONLY",
                path=USER / "example_02.png",
                source="User-supplied type example; provenance not asserted",
                culture_date="Visual synthesis lead",
                transfer="Coverage, wearable layering, carried-club scale, and weight distribution.",
                do_not_transfer="Mask, faces, coins, motifs, exact regalia, teeth, or metal abundance.",
                authority_scope="equipped context only",
            ),
            local_tile(
                key="stonewood_club_family",
                title="Plain club family silhouette lead",
                source_class="COMPARATIVE SHEET — RANGE ONLY; DO NOT COMBINE",
                path=USER / "example_06.png",
                source="User-supplied type example; provenance not asserted",
                culture_date="Shape-selection lead",
                transfer="Several distinct one-piece organic club proportions.",
                do_not_transfer="Teeth, spikes, serrations, ornament, or provenance claims.",
                authority_scope="macro silhouette range only",
            ),
            local_tile(
                key="stonewood_arpg_stone_club",
                title="Existing Verdigris stone-club study",
                source_class="ARPG / PROJECT ART — SILHOUETTE + GRID ONLY",
                path=STAGING / "warclub_stone.png",
                source="Current RPG inventory art study",
                culture_date="Project style reference",
                transfer="Readable head-to-haft mass and strong inventory contour.",
                do_not_transfer="Exact polish, outline, metal-looking end cap, or join construction.",
                authority_scope="presentation only",
            ),
            local_tile(
                key="stonewood_arpg_bast_corselet",
                title="Existing Verdigris bast-corselet study",
                source_class="ARPG / PROJECT ART — SILHOUETTE + GRID ONLY",
                path=STAGING / "body_corselet_bast.png",
                source="Current RPG inventory art study",
                culture_date="Project style reference",
                transfer="Readable torso occupancy, organic layering, and tied structural rhythm.",
                do_not_transfer="Exact rib repetition, bone species, uniform machining, or join construction.",
                authority_scope="presentation only",
            ),
        ],
    },
    "faction_dustwind": {
        "title": "DUSTWIND STEPPE HOUSES",
        "accent": "#d29c67",
        "guardrail": (
            "Felt, hide, wood, cord, and layered cloth lead. Metal remains bounded. "
            "No costume trim, loaded quivers, modern bow laminates, or generic pseudo-Persia."
        ),
        "v1_keys": [
            (
                "dustwind_otzi_shoe_reconstruction",
                "MODERN RECONSTRUCTION — ORGANIC ASSEMBLY",
                "Complete layered footwear, ties, and material separation.",
                "Metal eyelets, Alpine identity, or modern finishing.",
            ),
            (
                "dustwind_ancient_wood_bow",
                "COMPLETE ARTIFACT — BOW PROPORTION",
                "Whole-bow continuity, tiller, and limb-to-grip scale.",
                "Museum damage, exact faction ornament, or an unsupported modern laminate.",
            ),
            (
                "dustwind_otzi_belt_pouch",
                "ARTIFACT — CLOSURE ANCHOR",
                "Real belt break, sewn pouch, wrap, stitch, and tie.",
                "A seamless cloth tube, decorative metal accents, or copied culture styling.",
            ),
            (
                "dustwind_otzi_grass_mat",
                "ARTIFACT — FIBER BEHAVIOR",
                "Coarse weave and visible edge stitching.",
                "Seamless modern textile, exact mat shape, or using it as armor plate.",
            ),
            (
                "dustwind_armor_scales",
                "ARTIFACT — ELITE ARMOR ANCHOR",
                "Scale overlap and lacing holes at a bounded high tier.",
                "Metal on low tiers, uniform modern stamping, or loose decorative scales.",
            ),
        ],
        "extra": [
            local_tile(
                key="dustwind_equipped_callout",
                title="Steppe archer with equipment callouts",
                source_class="MODERN ILLUSTRATION — EQUIPPED CONTEXT ONLY",
                path=USER / "type_example_04.png",
                source="User-supplied type example; provenance not asserted",
                culture_date="Interpretive steppe loadout",
                transfer="Soft cap, tunic/trouser layering, footwear, bow scale, and slot relationships.",
                do_not_transfer="Loaded quiver/arrows, patterns, jewelry, exact objects, or factual claims.",
                authority_scope="equipped context only",
            ),
            remote_tile(
                key="dustwind_scythian_reconstruction_plate",
                title="Scythian equipped reconstruction plate",
                source_class="HISTORIC ILLUSTRATION — LOADOUT RANGE ONLY",
                image_url=(
                    "https://upload.wikimedia.org/wikipedia/commons/3/3d/"
                    "Scythian_warriors_%28reconstruction%29.jpg"
                ),
                source_url=(
                    "https://commons.wikimedia.org/wiki/"
                    "File:Scythian_warriors_(reconstruction).jpg"
                ),
                source="Kretschmer/Rohrbach costume plate via Wikimedia Commons",
                culture_date="1882 interpretive plate · public domain",
                transfer="Complete clothing layers, carried-kit relationships, and silhouette range.",
                do_not_transfer="19th-century reconstruction assumptions, patterns, colors, or loaded quivers.",
                authority_scope="loadout range only",
            ),
            local_tile(
                key="dustwind_arpg_good_bow",
                title="Accepted Verdigris bow silhouette",
                source_class="ARPG / PROJECT ART — SILHOUETTE + GRID ONLY",
                path=GOOD_BOW,
                source="Previously approved project generation",
                culture_date="Project style reference",
                transfer="Tall readable bow silhouette, clean negative space, and inventory presentation.",
                do_not_transfer="Exact wraps, dark lacquer, metal-colored bands, or construction details.",
                authority_scope="presentation only",
            ),
        ],
    },
    "faction_riverspill": {
        "title": "RIVERSPILL NILE–ZIGGURAT KINGDOMS",
        "accent": "#72b7c4",
        "guardrail": (
            "River-city linen, reed, palm, wood, and ordinary hide lead. Bright metal "
            "is status-bound. No pharaoh costume, spiral ornament, loaded quivers, or cast fantasy forms."
        ),
        "v1_keys": [
            (
                "riverspill_egyptian_archers",
                "PERIOD DEPICTION — EQUIPPED CONTEXT",
                "Bow/body scale, harness position, and rank-and-file kit relationships.",
                "Relief patterns, loaded quivers, arrows, or extracting every depicted object.",
            ),
            (
                "riverspill_assyrian_cavalry",
                "PERIOD DEPICTION — ELITE CONTEXT",
                "Armor coverage, boot relationship, bow scale, and carried equipment.",
                "Relief motifs, elite metal on ordinary gear, loaded quivers, or horse tack.",
            ),
            (
                "riverspill_egyptian_adze",
                "COMPLETE ARTIFACT — JOIN ANCHOR",
                "Leather binding, blade seating, and visibly separate wood/metal.",
                "Wood morphing into the blade, corrosion, or polished fantasy metal.",
            ),
            (
                "riverspill_coiled_basket",
                "ARTIFACT — CARRY CONSTRUCTION",
                "Functional coiling, rim finish, and organic load-bearing volume.",
                "Spiral ornament, metal trim, or turning it into seamless cloth.",
            ),
            (
                "riverspill_egyptian_dagger",
                "COMPLETE ARTIFACT — ELITE HILT ANCHOR",
                "Riveted hilt break and compact short-blade proportion.",
                "Elite ivory/silver on low tiers, copied ornament, or a blended handle.",
            ),
        ],
        "extra": [
            local_tile(
                key="riverspill_predynastic_warrior_range",
                title="Neolithic and predynastic warrior range",
                source_class="MODERN ILLUSTRATION — LOADOUT RANGE ONLY",
                path=USER / "type_example_05.png",
                source="User-supplied type example; provenance not asserted",
                culture_date="Interpretive Neolithic/predynastic sheet",
                transfer="Organic kit range, shield/club/bow scale, and low-metal silhouette diversity.",
                do_not_transfer="Loaded quivers/arrows, labels, exact costumes, or unverified armor claims.",
                authority_scope="loadout range only",
            ),
            local_tile(
                key="riverspill_ancient_role_lineup",
                title="Ancient archer and spearman role lineup",
                source_class="MODERN ILLUSTRATION — EQUIPPED CONTEXT ONLY",
                path=USER / "type_example_06.png",
                source="User-supplied type example; provenance not asserted",
                culture_date="Interpretive ancient role study",
                transfer="Different role silhouettes, bow/spear scale, drape, and simple sandals.",
                do_not_transfer="Exact patterns, arrows, jewelry, ethnicity, or historical claims.",
                authority_scope="equipped context only",
            ),
            local_tile(
                key="riverspill_arpg_paddle",
                title="Existing Verdigris paddle-weapon study",
                source_class="ARPG / PROJECT ART — SILHOUETTE + GRID ONLY",
                path=STAGING / "wpn_rod_paddle_head.png",
                source="Current RPG inventory art study",
                culture_date="Project style reference",
                transfer="Bold implement silhouette and immediate inventory readability.",
                do_not_transfer="Exact object, polish, edge geometry, or construction.",
                authority_scope="presentation only",
            ),
        ],
    },
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path(r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf"),
        Path(r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.ImageFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=face)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def contain(source: Image.Image, size: tuple[int, int]) -> Image.Image:
    source = source.convert("RGBA")
    background = Image.new("RGBA", source.size, CARD)
    background.alpha_composite(source)
    return ImageOps.contain(background.convert("RGB"), size, Image.Resampling.LANCZOS)


def materialize(entry: dict) -> Path:
    SOURCES.mkdir(parents=True, exist_ok=True)
    suffix = ".jpg"
    if entry.get("path"):
        source = Path(entry["path"])
        suffix = source.suffix.lower() or ".png"
        if not source.exists():
            raise FileNotFoundError(source)
        destination = SOURCES / f"{entry['key']}{suffix}"
        shutil.copy2(source, destination)
        return destination
    image_url = entry.get("image_url")
    if not image_url:
        raise ValueError(f"No path or image URL for {entry['key']}")
    destination = SOURCES / f"{entry['key']}{suffix}"
    request = urllib.request.Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        destination.write_bytes(response.read())
    return destination


def load_v1() -> dict[str, dict]:
    manifest = json.loads((V1 / "manifest.json").read_text(encoding="utf-8"))
    result: dict[str, dict] = {}
    for faction in manifest["factions"].values():
        for entry in faction["references"]:
            result[entry["key"]] = entry
    return result


def v1_tile(base: dict, source_class: str, transfer: str, do_not_transfer: str) -> dict:
    return {
        "key": base["key"],
        "title": base["title"],
        "source_class": source_class,
        "path": base["prepared_path"],
        "source": base.get("evidence", "reviewed source"),
        "source_url": base.get("source_url"),
        "culture_date": base.get("culture_date", ""),
        "transfer": transfer,
        "do_not_transfer": do_not_transfer,
        "authority_scope": "bounded by tile label",
    }


def draw_board(faction: str, config: dict, entries: list[dict]) -> Path:
    board = Image.new("RGB", BOARD_SIZE, BG)
    draw = ImageDraw.Draw(board)
    accent = config["accent"]

    draw.text((54, 34), config["title"], font=font(44, True), fill=TEXT)
    draw.text(
        (54, 92),
        "MIXED FACTION REFERENCE BOARD · ladder characters + loadout context + family range + replicas + ARPG read + construction anchors",
        font=font(20, True),
        fill=accent,
    )
    draw.text(
        (54, 126),
        "Prompt-specific Images A and B remain the only tier/axis authority. This board is Image C and supplies only each tile's narrow TRANSFER scope.",
        font=font(19),
        fill=MUTED,
    )
    draw.line((54, 166, BOARD_SIZE[0] - 54, 166), fill=RULE, width=2)

    margin_x = 48
    gap_x = 20
    gap_y = 22
    top = 184
    card_w = (BOARD_SIZE[0] - margin_x * 2 - gap_x * 3) // 4
    card_h = 590
    image_h = 375

    for index, entry in enumerate(entries):
        col = index % 4
        row = index // 4
        x = margin_x + col * (card_w + gap_x)
        y = top + row * (card_h + gap_y)
        draw.rounded_rectangle(
            (x, y, x + card_w, y + card_h),
            radius=10,
            fill=CARD,
            outline=RULE,
            width=2,
        )

        image = contain(Image.open(entry["prepared_path"]), (card_w - 8, image_h - 8))
        ix = x + (card_w - image.width) // 2
        iy = y + 4 + (image_h - 8 - image.height) // 2
        board.paste(image, (ix, iy))
        draw.rectangle((x + 4, y + 4, x + card_w - 4, y + 48), fill="#101617")
        badge = wrap(draw, entry["source_class"], font(15, True), card_w - 24)[:2]
        by = y + 11
        for line in badge:
            draw.text((x + 12, by), line, font=font(15, True), fill=accent)
            by += 17

        ty = y + image_h + 9
        draw.text((x + 12, ty), entry["title"], font=font(19, True), fill=TEXT)
        ty += 27
        meta = f"{entry['source']} · {entry['culture_date']}"
        for line in wrap(draw, meta, font(14), card_w - 24)[:2]:
            draw.text((x + 12, ty), line, font=font(14), fill=MUTED)
            ty += 18
        draw.text((x + 12, ty + 2), "TRANSFER", font=font(14, True), fill=accent)
        ty += 22
        for line in wrap(draw, entry["transfer"], font(14), card_w - 24)[:2]:
            draw.text((x + 12, ty), line, font=font(14), fill=TEXT)
            ty += 18
        draw.text((x + 12, ty + 2), "DO NOT TRANSFER", font=font(14, True), fill="#e28b72")
        ty += 22
        for line in wrap(draw, entry["do_not_transfer"], font(14), card_w - 24)[:2]:
            draw.text((x + 12, ty), line, font=font(14), fill=MUTED)
            ty += 18

    footer_y = 2032
    draw.line((54, footer_y, BOARD_SIZE[0] - 54, footer_y), fill=RULE, width=2)
    draw.text((54, footer_y + 20), "FACTION GUARDRAIL", font=font(19, True), fill=accent)
    guard_lines = wrap(draw, config["guardrail"], font(20, True), BOARD_SIZE[0] - 108)[:2]
    gy = footer_y + 50
    for line in guard_lines:
        draw.text((54, gy), line, font=font(20, True), fill=TEXT)
        gy += 27
    draw.text(
        (54, 2165),
        "GLOBAL: never average tiles. No medieval/modern manufacture, sacred or spiral motifs, copied text, corrosion-as-style, unsupported slots, or prestige material leakage.",
        font=font(18),
        fill=MUTED,
    )
    draw.text(
        (54, 2200),
        "QUIVERS: open and empty. ARROWS: separate inventory items. Skip weak slots instead of inventing filler.",
        font=font(20, True),
        fill=accent,
    )

    destination = OUTPUT / f"{faction}__mixed-reference-board-v2.jpg"
    board.save(destination, quality=94, subsampling=0, optimize=True)
    return destination


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    v1 = load_v1()
    manifest = {
        "version": 2,
        "purpose": (
            "Mixed faction reference boards for wildcard paperdoll generation. "
            "Prompt-specific ladder Images A/B remain primary authority."
        ),
        "attachment_order": [
            "Image A: prompt-specific ladder reference 1",
            "Image B: prompt-specific ladder reference 2",
            "Image C: exactly one matching mixed faction board",
        ],
        "factions": {},
    }

    for faction, config in FACTIONS.items():
        entries = [dict(entry) for entry in LADDER_SETS[faction]]
        for key, source_class, transfer, do_not_transfer in config["v1_keys"]:
            if key not in v1:
                raise KeyError(f"Missing v1 reference key: {key}")
            entries.append(v1_tile(v1[key], source_class, transfer, do_not_transfer))
        entries.extend(dict(entry) for entry in config["extra"])
        if len(entries) != 12:
            raise ValueError(f"{faction}: expected 12 panels, got {len(entries)}")
        if len({entry["key"] for entry in entries}) != 12:
            raise ValueError(f"{faction}: duplicate source key")
        if sum(entry["source_class"].startswith("PROJECT LADDER") for entry in entries) < 2:
            raise ValueError(f"{faction}: requires at least two ladder panels")

        prepared = []
        for entry in entries:
            item = dict(entry)
            item["prepared_path"] = str(materialize(item))
            prepared.append(item)
        board_path = draw_board(faction, config, prepared)
        manifest["factions"][faction] = {
            "title": config["title"],
            "board_path": str(board_path),
            "panel_count": len(prepared),
            "guardrail": config["guardrail"],
            "references": prepared,
        }

    (OUTPUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Built {len(FACTIONS)} mixed faction boards in {OUTPUT}")
    for faction in manifest["factions"].values():
        print(faction["board_path"])


if __name__ == "__main__":
    main()
