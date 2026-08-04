#!/usr/bin/env python3
"""Build supplemental faction plausibility moodboards from reviewed references.

The character ladder remains the design authority. These boards constrain
construction, proportion, joins, and material behavior; they are deliberately
not item recipes or palette shopping lists.
"""

from __future__ import annotations

import json
import shutil
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[3]
PROJECT = ROOT / "tools" / "rpg_inventory"
OUTPUT = PROJECT / "assets_staging" / "faction-moodboards-v1"
SOURCES = OUTPUT / "sources"
EXTERNAL = Path(
    r"C:\Users\Alex\Downloads\items_multi_context_balanced_v1\external_references"
)
REPLICA = EXTERNAL / "replica_reconstruction"
PINTEREST = EXTERNAL / "pinterest_promoted"

BOARD_SIZE = (2048, 1536)
BACKGROUND = "#15191b"
PANEL = "#242a2d"
TEXT = "#f0eee8"
MUTED = "#b9b9b2"
RULE = "#3a4245"


def ref(
    *,
    key: str,
    title: str,
    role: str,
    culture_date: str,
    medium: str,
    source_url: str,
    transfer: str,
    local: Path | None = None,
    image_url: str | None = None,
    evidence: str = "dated artifact",
) -> dict:
    return {
        "key": key,
        "title": title,
        "role": role,
        "culture_date": culture_date,
        "medium": medium,
        "source_url": source_url,
        "transfer": transfer,
        "local": str(local) if local else None,
        "image_url": image_url,
        "evidence": evidence,
    }


FACTIONS = {
    "faction_north": {
        "title": "Northern Bronze Houses",
        "accent": "#d2aa62",
        "note": (
            "No horned helmets, runes, mail, or Viking shorthand. "
            "Bronze is valuable; low tiers remain textile, hide, wood, and horn-led."
        ),
        "refs": [
            ref(
                key="north_egtved_costume_actual",
                title="Egtved tunic and cord skirt",
                role="GARMENT CUT / BELT LOGIC",
                culture_date="Denmark · ca. 1370 BCE",
                medium="Wool, corded skirt, tie",
                source_url=(
                    "https://en.natmus.dk/historical-knowledge/denmark/"
                    "prehistoric-period-until-1050-ad/the-bronze-age/"
                    "the-egtved-girl/cord-skirts-and-rituals/"
                ),
                image_url=(
                    "https://en.natmus.dk/typo3temp/assets/images/"
                    "csm_Egtvedpigens_dragt__L_001817_e1362220b6_e485a69a60.jpg"
                ),
                transfer="Use the actual garment cut, cord skirt, and plain tie; add no metal belt plate.",
                evidence="dated archaeological garment",
            ),
            ref(
                key="north_plain_bronze_helmet",
                title="Plain Picene bronze helmet",
                role="HELMET CONSTRUCTION",
                culture_date="Italic, Picene · early 6th c. BCE",
                medium="Bronze",
                source_url="https://www.metmuseum.org/art/collection/search/248010",
                local=EXTERNAL / "met_248010_helmet_picene_bronze.jpg",
                transfer="Use dome, rim, and material continuity; no horns or fiber decoration.",
            ),
            ref(
                key="north_bronze_shield",
                title="European Bronze Age shield",
                role="SHIELD PROFILE",
                culture_date="Central Europe / Denmark · 1100–700 BCE",
                medium="Hammered bronze",
                source_url=(
                    "https://en.natmus.dk/historical-knowledge/denmark/"
                    "prehistoric-period-until-1050-ad/the-bronze-age/"
                    "the-bronze-age-shields/"
                ),
                image_url=(
                    "https://en.natmus.dk/typo3temp/assets/images/"
                    "csm_Skjold_uden_findested__8113-_00003_16e5d1148d_7806a78b9e.jpg"
                ),
                transfer="Prestige shield silhouette only; not a cheap-tier default.",
            ),
            ref(
                key="north_central_europe_sword",
                title="Central European bronze sword",
                role="BLADE PROPORTION",
                culture_date="Central Europe · 13th c. BCE",
                medium="Bronze",
                source_url="https://www.metmuseum.org/art/collection/search/27513",
                local=EXTERNAL / "met_27513_middle_bronze_age_sword.jpg",
                transfer="Use full-length proportion and hilt transition.",
            ),
            ref(
                key="north_otzi_bearskin_cap",
                title="Iceman bearskin cap",
                role="LOW-TIER ORGANIC HELM",
                culture_date="Alps · ca. 3300 BCE · construction comparator",
                medium="Stitched bearskin, chin strap",
                source_url="https://www.iceman.it/en/oetzi/clothing",
                image_url=(
                    "https://www.iceman.it/%C3%B6tzi/Abbigliamento/133/"
                    "image-thumb__133__thumbnail-wysiwygblock-contain/"
                    "-%EF%BF%BDwww.wisthaler.com_15_01_Archeologiemuseum_"
                    "oetzi_HAW_6547.22fb26d3.jpg"
                ),
                transfer="Use seam, cap volume, and chin strap only; no metal garnish or copied culture styling.",
                evidence="dated archaeological garment",
            ),
            ref(
                key="north_bronze_spearhead",
                title="Bronze Age spearhead",
                role="SOCKET / POINT",
                culture_date="Europe · 1200–800 BCE",
                medium="Copper alloy",
                source_url="https://www.metmuseum.org/art/collection/search/470329",
                image_url=(
                    "https://images.metmuseum.org/CRDImages/md/original/DT4350.jpg"
                ),
                transfer="Use socket and blade proportion; keep the whole shaft plausible.",
            ),
            ref(
                key="north_replica_weapon_shields",
                title="Replica weapons and shields after trials",
                role="ACTIVE-SERVICE ASSEMBLY",
                culture_date="Scottish Bronze Age reconstruction",
                medium="Wood, hide, bronze replicas",
                source_url=(
                    "https://scarf.scot/national/scarf-bronze-age-panel-report/"
                    "bronze-age-case-studies/case-study-experimental-archaeology-"
                    "bronze-age-weaponry/"
                ),
                local=REPLICA / "bronze_age_replica_weapon_shield_experiment.jpg",
                transfer="Use complete assembly and healthy material color, not exact decoration.",
                evidence="experimental reconstruction",
            ),
            ref(
                key="north_tool_hafting_lead",
                title="Bronze tool and haft assortment",
                role="HAFT / TOOL JOIN",
                culture_date="Reviewed reconstruction lead · verify per item",
                medium="Wood, copper alloy, cord",
                source_url="https://www.pinterest.com/pin/29766047532223213/",
                local=PINTEREST / "pinterest_16408d0f75a5.jpg",
                transfer="Assembly lead only; museum evidence must decide a generated gap item.",
                evidence="reviewed discovery lead",
            ),
        ],
    },
    "faction_stonewood": {
        "title": "Cedar-Obsidian Clans",
        "accent": "#bd5438",
        "note": (
            "Keep organic and hard-stone lanes distinct. Never melt wood into obsidian, "
            "copy sacred imagery, or use copper as casual trim on fiber gear."
        ),
        "refs": [
            ref(
                key="stonewood_tlingit_armor",
                title="Tlingit hardwood body armor",
                role="WOOD LAMELLAR / LACING",
                culture_date="Tlingit · 1810–1840 · continuity only",
                medium="Hardwood, sinew, hide thong",
                source_url=(
                    "https://americanindian.si.edu/collections-search/object/NMAI_19573"
                ),
                image_url=(
                    "https://ids.si.edu/ids/deliveryService?"
                    "id=ark%3A%2F65665%2Fom81a5308ed428641cd8b87e659f833330c&max=1800"
                ),
                transfer="Use carved slats, overlap, wrapping, and load paths only.",
                evidence="later ethnographic continuity",
            ),
            ref(
                key="stonewood_karuk_rod_armor",
                title="Karuk rod-armor vest",
                role="ROD / CORD ASSEMBLY",
                culture_date="Karuk · ca. 1900 · continuity only",
                medium="Wood, iris-fiber cord, leather",
                source_url=(
                    "https://americanindian.si.edu/exhibitions/infinityofnations/"
                    "california-greatbasin/052365.html"
                ),
                image_url=(
                    "https://americanindian.si.edu/exhibitions/infinityofnations/"
                    "images/california-greatbasin/052365_1000.jpg"
                ),
                transfer="Use the structural system only; do not claim this date for the faction.",
                evidence="later ethnographic continuity",
            ),
            ref(
                key="stonewood_plain_cedar_hat",
                title="Plain cedar-bark basket hat",
                role="CEDAR WEAVE / EDGE FINISH",
                culture_date="Chehalis · 1965 · continuity only",
                medium="Red cedar bark, cattail",
                source_url=(
                    "https://americanindian.si.edu/collections-search/object/NMAI_276268"
                ),
                image_url=(
                    "https://ids.si.edu/ids/deliveryService?"
                    "id=https%3A%2F%2Famericanindian.si.edu%2Fwebmultimedia%2F4120%2F029%2F13.700x700.jpg&max=1400"
                ),
                transfer="Use twining, profile, and rim construction only.",
                evidence="living-tradition construction",
            ),
            ref(
                key="stonewood_mexica_obsidian_blade",
                title="Mexica obsidian blade",
                role="OBSIDIAN EDGE",
                culture_date="Mexica · 13th–16th c.",
                medium="Obsidian",
                source_url="https://www.metmuseum.org/art/collection/search/307737",
                image_url=(
                    "https://images.metmuseum.org/CRDImages/ao/original/vs00_5_1046.jpg"
                ),
                transfer="Use chipped edge and thickness; add no metal collar.",
            ),
            ref(
                key="stonewood_plain_obsidian_blade",
                title="Plain obsidian blade",
                role="STONE BLADE PROPORTION",
                culture_date="Mexico · before 16th c.",
                medium="Obsidian",
                source_url="https://www.metmuseum.org/art/collection/search/317109",
                image_url=(
                    "https://images.metmuseum.org/CRDImages/ao/original/vs1994_35_470.jpg"
                ),
                transfer="Use simple flaked form; do not invent a seamless wood-stone blend.",
            ),
            ref(
                key="stonewood_plain_celt",
                title="Plain stone celt",
                role="GREENSTONE / AXE FORM",
                culture_date="Maya attribution · before 16th c.",
                medium="Ground stone",
                source_url="https://www.metmuseum.org/art/collection/search/317103",
                image_url=(
                    "https://images.metmuseum.org/CRDImages/ao/original/hz1994_35_338.jpg"
                ),
                transfer="Use ground profile and polish; hafting must remain a separate join.",
            ),
            ref(
                key="stonewood_wrapped_stone_knife",
                title="Wrapped stone knife",
                role="POSITIVE STONE / HANDLE JOIN",
                culture_date="Eastern Shoshone · collected 1923 · continuity only",
                medium="Stone, wood, hide wrapping",
                source_url=(
                    "https://americanindian.si.edu/collections-search/object/"
                    "NMAI_131303"
                ),
                image_url=(
                    "https://ids.si.edu/ids/deliveryService?"
                    "id=https%3A%2F%2Famericanindian.si.edu%2Fwebmultimedia"
                    "%2F4016%2F544%2F065.700x700.jpg&max=1400"
                ),
                transfer="Use the visibly separate wood, stone, and hide-wrapped join only.",
                evidence="later ethnographic continuity",
            ),
            ref(
                key="stonewood_plain_burden_basket",
                title="Plain twined burden basket",
                role="FIBER CARRY / OPEN RIM",
                culture_date="Paiute · collected 20th c. · continuity only",
                medium="Willow, sumac",
                source_url=(
                    "https://americanindian.si.edu/collections-search/object/"
                    "NMAI_266955"
                ),
                image_url=(
                    "https://ids.si.edu/ids/deliveryService?"
                    "id=https%3A%2F%2Famericanindian.si.edu%2Fwebmultimedia"
                    "%2F4145%2F346%2F004.700x700.jpg&max=1400"
                ),
                transfer="Use plain twining, load-bearing body, and open rim; do not copy decoration.",
                evidence="later ethnographic continuity",
            ),
        ],
    },
    "faction_dustwind": {
        "title": "Silkroad Plateau Nomads",
        "accent": "#d0a23f",
        "note": (
            "Portable, ridden-in construction. Organic carry gear stays organic-led: "
            "no polished brass garnish on reed, felt, common hide, or plain cloth."
        ),
        "refs": [
            ref(
                key="dustwind_achaemenid_servants",
                title="Persian and Median servants",
                role="TUNIC / TROUSER / SKIN CARRY",
                culture_date="Achaemenid · ca. 358–338 BCE",
                medium="Limestone relief",
                source_url="https://www.metmuseum.org/art/collection/search/323178",
                image_url=(
                    "https://collectionapi.metmuseum.org/api/collection/v1/"
                    "iiif/323178/713618/main-image"
                ),
                transfer="Use layered dress and flexible skin-container context; do not copy relief patterns.",
            ),
            ref(
                key="dustwind_armor_scales",
                title="Achaemenid armor scales",
                role="SCALE VERIFICATION",
                culture_date="Achaemenid · ca. 4th c. BCE",
                medium="Iron and leather",
                source_url="https://www.metmuseum.org/art/collection/search/326389",
                local=EXTERNAL / "met_326389_achaemenid_armor_scales.jpg",
                transfer="Overlap and attachment evidence only; never copy corrosion.",
            ),
            ref(
                key="dustwind_otzi_shoe_mesh",
                title="Iceman shoe inner mesh",
                role="FOOTWEAR CORD / LINING",
                culture_date="Alps · ca. 3300 BCE · construction comparator",
                medium="Linden-bast mesh, grass, leather",
                source_url="https://www.iceman.it/en/oetzi/clothing",
                image_url=(
                    "https://www.iceman.it/%C3%B6tzi/Abbigliamento/135/"
                    "image-thumb__135__thumbnail-wysiwygblock-contain/"
                    "-%EF%BF%BDwww.wisthaler.com_15_01_Archeologiemuseum_"
                    "oetzi_HAW_2186.bce06bd9.jpg"
                ),
                transfer="Use visible knotting and layered insulation only; ladder refs decide silhouette.",
                evidence="dated archaeological garment",
            ),
            ref(
                key="dustwind_otzi_belt_pouch",
                title="Iceman belt with sewn pouch",
                role="BELT / POUCH FASTENING",
                culture_date="Alps · ca. 3300 BCE · construction comparator",
                medium="Calfskin, stitching, tie",
                source_url="https://www.iceman.it/en/oetzi/clothing",
                image_url=(
                    "https://www.iceman.it/%C3%B6tzi/Abbigliamento/136/"
                    "image-thumb__136__thumbnail-wysiwygblock-contain/"
                    "-%EF%BF%BDwww.wisthaler.com_15_01_Archeologiemuseum_"
                    "oetzi_HAW_2743.3ddcde83.jpg"
                ),
                transfer="Use a real break, wrap, stitch, and closure; never render a seamless cloth tube.",
                evidence="dated archaeological garment",
            ),
            ref(
                key="dustwind_otzi_grass_mat",
                title="Iceman woven grass mat",
                role="FIBER WEAVE / EDGE STITCH",
                culture_date="Alps · ca. 3300 BCE · construction comparator",
                medium="Alpine swamp grass, cord",
                source_url="https://www.iceman.it/en/oetzi/clothing",
                image_url=(
                    "https://www.iceman.it/%C3%B6tzi/Abbigliamento/139/"
                    "image-thumb__139__thumbnail-wysiwygblock-contain/"
                    "-%EF%BF%BDwww.wisthaler.com_15_01_Archeologiemuseum_"
                    "oetzi_HAW_2470.8d4770e7.jpg"
                ),
                transfer="Use coarse weave and edge stitching only; do not turn this into seamless cloth.",
                evidence="dated archaeological textile",
            ),
            ref(
                key="dustwind_hattian_blade",
                title="Hattian sword or dagger",
                role="BLADE PROPORTION",
                culture_date="Anatolia · 2300–2000 BCE",
                medium="Bronze",
                source_url="https://www.metmuseum.org/art/collection/search/324457",
                local=EXTERNAL / "met_324457_sword_dagger_hattian.jpg",
                transfer="Use blade-to-tang transition; handle must remain visibly constructed.",
            ),
            ref(
                key="dustwind_otzi_shoe_reconstruction",
                title="Iceman footwear reconstruction",
                role="COMPLETE ORGANIC FOOTWEAR",
                culture_date="Alps · ca. 3300 BCE · museum reconstruction",
                medium="Hide, fur, bast net, grass, ties",
                source_url=(
                    "https://www.iceman.it/en/news/"
                    "new-reconstruction-of-the-iceman-s-shoes-and-coat_440"
                ),
                image_url=(
                    "https://www.iceman.it/foto_news_nuova_pagina_web/"
                    "20230420_Nuovi%20Vestiti%20%E6%AA%9Bzi/649/"
                    "image-thumb__649__thumbnail-maxwidth/"
                    "Schuhe%20%E6%AA%9Bzi%20Eva%20Ijsveld%208.f63523f4.jpg"
                ),
                transfer="Use complete layered construction and ties; no metal eyelets, studs, or trim.",
                evidence="museum archaeological reconstruction",
            ),
            ref(
                key="dustwind_ancient_wood_bow",
                title="Complete ancient self bow",
                role="BOW PROPORTION / TILLER",
                culture_date="Egypt · ca. 1492–1473 BCE · comparator",
                medium="Wood",
                source_url="https://www.metmuseum.org/art/collection/search/549079",
                image_url=(
                    "https://collectionapi.metmuseum.org/api/collection/v1/"
                    "iiif/549079/1294087/main-image"
                ),
                transfer="Use whole-bow proportion and continuous limbs; ladder refs decide faction details.",
            ),
        ],
    },
    "faction_riverspill": {
        "title": "Nile-Ziggurat Kingdoms",
        "accent": "#d6aa4c",
        "note": (
            "River-city craft, not pharaoh costume. Reed, palm, linen, and ordinary hide "
            "stay organic-led; gold and bright copper alloy are bounded status materials."
        ),
        "refs": [
            ref(
                key="riverspill_egyptian_archers",
                title="Old Kingdom archers",
                role="BOW / BODY HARNESS",
                culture_date="Egypt · 2551–2494 BCE",
                medium="Painted limestone relief",
                source_url="https://www.metmuseum.org/art/collection/search/543895",
                image_url=(
                    "https://images.metmuseum.org/CRDImages/eg/original/DT259178.jpg"
                ),
                transfer="Use bow and bandolier context; game quivers stay open and empty.",
            ),
            ref(
                key="riverspill_assyrian_cavalry",
                title="Assyrian cavalrymen relief",
                role="COMPLETE KIT CONTEXT",
                culture_date="Neo-Assyrian · 704–681 BCE",
                medium="Gypsum relief",
                source_url="https://www.metmuseum.org/art/collection/search/322623",
                image_url=(
                    "https://images.metmuseum.org/CRDImages/an/original/DP-441-001.jpg"
                ),
                transfer="Use armor coverage, boots, bows, and quiver placement; do not copy relief patterns.",
            ),
            ref(
                key="riverspill_egyptian_adze",
                title="Complete Egyptian adze",
                role="HAFT / LEATHER BINDING",
                culture_date="Egypt · 1550–1295 BCE",
                medium="Wood, copper alloy, leather",
                source_url="https://www.metmuseum.org/art/collection/search/568261",
                local=EXTERNAL / "met_568261_adze_egyptian_complete.jpg",
                transfer="Use visible, believable joining; wood never morphs into the blade.",
            ),
            ref(
                key="riverspill_coiled_basket",
                title="Coiled Egyptian basket",
                role="REED / FIBER CARRY",
                culture_date="Egypt · 1550–1295 BCE",
                medium="Coiled basketry",
                source_url="https://www.metmuseum.org/art/collection/search/572181",
                local=EXTERNAL / "met_572181_basket_egyptian_coiled.jpg",
                transfer="Functional coiling only, never spiral ornament; no metal trim, caps, or garnish.",
            ),
            ref(
                key="riverspill_palm_basket",
                title="Palm-leaf Egyptian basket",
                role="PALM WEAVE / RIM",
                culture_date="Egypt · 1525–1504 BCE",
                medium="Palm leaf",
                source_url="https://www.metmuseum.org/art/collection/search/544843",
                local=EXTERNAL / "met_544843_basket_egyptian_palm.jpg",
                transfer="Use weave density and rim finish only; never spiral ornament or metal accents.",
            ),
            ref(
                key="riverspill_linen",
                title="Plain-weave Egyptian linen",
                role="TEXTILE MATERIAL",
                culture_date="Egypt · 1st c. BCE–1st c. CE",
                medium="Linen, plain weave",
                source_url="https://www.metmuseum.org/art/collection/search/443650",
                local=EXTERNAL / "met_443650_textile_egyptian_linen.jpg",
                transfer="Transfer weave behavior only, not dye or saturation; wearables need an opening and tie.",
            ),
            ref(
                key="riverspill_hattian_mace",
                title="Hattian mace head",
                role="IMPACT WEAPON",
                culture_date="Anatolia · 2300–2000 BCE",
                medium="Bronze",
                source_url="https://www.metmuseum.org/art/collection/search/324454",
                local=EXTERNAL / "met_324454_hattian_bronze_mace.jpg",
                transfer="Elite metal only; generate a complete separately hafted weapon, never a bare head.",
            ),
            ref(
                key="riverspill_egyptian_dagger",
                title="Complete Egyptian dagger",
                role="SHORT BLADE / RIVETED HILT",
                culture_date="Egypt · ca. 1600–1500 BCE",
                medium="Copper alloy, ivory, silver",
                source_url="https://www.metmuseum.org/art/collection/search/544281",
                image_url=(
                    "https://collectionapi.metmuseum.org/api/collection/v1/"
                    "iiif/544281/1178656/main-image"
                ),
                transfer="Elite weapon only; use the real riveted hilt break, never a blended handle.",
            ),
        ],
    },
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path(r"C:\Windows\Fonts\seguisb.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf"),
        Path(r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def materialize(entry: dict) -> Path:
    SOURCES.mkdir(parents=True, exist_ok=True)
    suffix = Path(entry["local"]).suffix if entry["local"] else ".jpg"
    destination = SOURCES / f"{entry['key']}{suffix.lower()}"
    if destination.exists():
        return destination
    if entry["local"]:
        source = Path(entry["local"])
        if not source.exists():
            raise FileNotFoundError(source)
        shutil.copy2(source, destination)
        return destination
    request = urllib.request.Request(
        entry["image_url"],
        headers={"User-Agent": "Mozilla/5.0 VerdigrisMoodboardBuilder/1.0"},
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        destination.write_bytes(response.read())
    return destination


def contain(source: Image.Image, size: tuple[int, int]) -> Image.Image:
    source = ImageOps.exif_transpose(source).convert("RGB")
    source.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, "#ecebe6")
    x = (size[0] - source.width) // 2
    y = (size[1] - source.height) // 2
    canvas.paste(source, (x, y))
    return canvas


def draw_board(faction_key: str, config: dict, prepared: list[dict]) -> Path:
    board = Image.new("RGB", BOARD_SIZE, BACKGROUND)
    draw = ImageDraw.Draw(board)
    accent = config["accent"]

    draw.rectangle((0, 0, 18, BOARD_SIZE[1]), fill=accent)
    draw.text((70, 48), config["title"], font=font(58, True), fill=TEXT)
    draw.text(
        (72, 116),
        "SUPPLEMENTAL PLAUSIBILITY BOARD · CHARACTER LADDER REMAINS DESIGN AUTHORITY",
        font=font(22, True),
        fill=accent,
    )
    draw.text(
        (72, 156),
        "Transfer construction, proportion, joins, layering, and material response — never average all tiles into one object.",
        font=font(22),
        fill=MUTED,
    )
    draw.line((72, 202, 1976, 202), fill=RULE, width=2)

    margin_x = 72
    gap_x = 22
    gap_y = 22
    grid_top = 232
    card_w = (BOARD_SIZE[0] - (margin_x * 2) - (gap_x * 3)) // 4
    card_h = 500
    image_h = 322
    for index, entry in enumerate(prepared):
        row, col = divmod(index, 4)
        x = margin_x + col * (card_w + gap_x)
        y = grid_top + row * (card_h + gap_y)
        draw.rounded_rectangle(
            (x, y, x + card_w, y + card_h),
            radius=14,
            fill=PANEL,
            outline=RULE,
            width=2,
        )
        image = contain(Image.open(entry["prepared_path"]), (card_w - 4, image_h))
        board.paste(image, (x + 2, y + 2))
        draw.rectangle((x + 2, y + 2, x + card_w - 2, y + 42), fill="#111719")
        draw.text((x + 14, y + 10), entry["role"], font=font(18, True), fill=accent)
        draw.text((x + 14, y + image_h + 15), entry["title"], font=font(21, True), fill=TEXT)
        draw.text(
            (x + 14, y + image_h + 48),
            entry["culture_date"],
            font=font(17),
            fill=MUTED,
        )
        draw.text(
            (x + 14, y + image_h + 73),
            entry["medium"],
            font=font(16),
            fill=accent,
        )
        transfer_lines = wrap(
            draw, entry["transfer"], font(15), card_w - 28
        )[:3]
        ty = y + image_h + 103
        for line in transfer_lines:
            draw.text((x + 14, ty), line, font=font(15), fill="#d5d4cf")
            ty += 20

    footer_y = 1296
    draw.line((72, footer_y, 1976, footer_y), fill=RULE, width=2)
    draw.text((72, footer_y + 24), "FACTION-SPECIFIC GUARDRAIL", font=font(20, True), fill=accent)
    note_lines = wrap(draw, config["note"], font(21, True), 1835)[:2]
    for i, line in enumerate(note_lines):
        draw.text((72, footer_y + 58 + i * 28), line, font=font(21, True), fill=TEXT)
    draw.text(
        (72, 1430),
        "GLOBAL: do not copy corrosion, museum damage, sacred or spiral motifs, text, or unsupported slots. Skip weak items instead of inventing filler.",
        font=font(19),
        fill=MUTED,
    )
    draw.text(
        (72, 1463),
        "Quivers: open and empty. Arrows are separate inventory items.",
        font=font(21, True),
        fill=accent,
    )

    destination = OUTPUT / f"{faction_key}__historical-construction-moodboard.jpg"
    board.save(destination, quality=94, subsampling=0, optimize=True)
    return destination


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = {
        "version": 1,
        "purpose": (
            "Supplemental construction and plausibility reference. Character ladder "
            "images remain the design authority for coherent item families."
        ),
        "global_do_not_transfer": [
            "corrosion, excavation damage, museum lighting, mounts, or backgrounds",
            "sacred or culture-specific motifs, spiral motifs, readable scripts, or symbols",
            "a material merely because it appears elsewhere on the same board",
            "unsupported paperdoll slots or filler items",
            "loaded or closed quivers; game quivers are open and empty",
        ],
        "factions": {},
    }
    for faction_key, config in FACTIONS.items():
        prepared = []
        for entry in config["refs"]:
            prepared_entry = dict(entry)
            prepared_entry["prepared_path"] = str(materialize(entry))
            prepared.append(prepared_entry)
        board_path = draw_board(faction_key, config, prepared)
        manifest["factions"][faction_key] = {
            "title": config["title"],
            "board_path": str(board_path),
            "guardrail": config["note"],
            "references": prepared,
        }

    (OUTPUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Built {len(FACTIONS)} moodboards in {OUTPUT}")
    for faction in manifest["factions"].values():
        print(faction["board_path"])


if __name__ == "__main__":
    main()
