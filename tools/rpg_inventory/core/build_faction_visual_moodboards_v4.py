#!/usr/bin/env python3
"""Build faction-locked, visual-first portrait moodboards.

User-pasted images define useful image types; they are not the source library.
Every non-ladder image in V4 was newly researched, visually inspected, and
assigned to one explicit faction-specific historical cluster before assembly.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[3]
PROJECT = ROOT / "tools" / "rpg_inventory"
STAGING = PROJECT / "assets_staging"
OUTPUT = STAGING / "faction-moodboards-v4"
SOURCES = OUTPUT / "sources"
CURATED = PROJECT / "review_assets" / "faction-moodboard-references-v4"
LADDERS = Path(r"C:\Users\Alex\Downloads\ladders")
SIZE = (2048, 3072)


def source(
    key: str,
    path: Path,
    role: str,
    faction_lock: str,
    cluster: str,
    transfer: str,
    do_not_transfer: str,
    source_url: str | None = None,
) -> dict:
    return {
        "key": key,
        "path": str(path),
        "role": role,
        "faction_lock": faction_lock,
        "historical_cluster": cluster,
        "transfer": transfer,
        "do_not_transfer": do_not_transfer,
        "source_url": source_url,
    }


def ladder(faction: str, axis: str, tier: int, filename: str) -> dict:
    return source(
        f"{faction}_{axis.lower()}_t{tier}_ladder",
        LADDERS / f"{faction} - {axis} - tier {tier}" / filename,
        "approved_project_ladder",
        faction,
        "approved_project_faction",
        "Faction silhouette, equipment culture, material placement, and coherent loadout.",
        "Do not extract every visible object or let the board override prompt Images A/B.",
    )


def curated(
    faction: str,
    filename: str,
    key: str,
    cluster: str,
    source_url: str,
    transfer: str,
    do_not_transfer: str,
) -> dict:
    return source(
        key,
        CURATED / faction / filename,
        "curated_visual_direction",
        f"faction_{faction}",
        cluster,
        transfer,
        do_not_transfer,
        source_url,
    )


FACTIONS = {
    "faction_north": {
        "title": "NORTHERN BRONZE HOUSES",
        "palette": ("#cda85f", "#813e30", "#4f6a52"),
        "allowed_clusters": {"nordic_bronze", "mycenaean_aegean"},
        "sources": [
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
            curated(
                "north",
                "n13_dendra_full.jpg",
                "north_dendra_full_character",
                "mycenaean_aegean",
                "https://cdnb.artstation.com/p/assets/images/images/065/789/281/large/michael-merulla-mycenean2-upg.jpg?1691225615",
                "Full equipped Bronze Age silhouette, heavy bronze tier, long spear scale, and handcrafted plate rhythm.",
                "Literal Dendra copy, face identity, all-over elite bronze, or mechanically perfect plate repetition.",
            ),
            curated(
                "north",
                "n14_mycenaean_blue.jpg",
                "north_mycenaean_blue_character",
                "mycenaean_aegean",
                "https://i.pinimg.com/736x/44/0c/c8/440cc8a97086126e615a88bc97919e57.jpg",
                "Bright painted character reference, bronze/leather/blue-textile separation, spear and shield scale.",
                "Exact crest, face, circular bosses, heraldic marks, or later hoplite treatment.",
            ),
            curated(
                "north",
                "n15_mycenaean_horned_warrior.png",
                "north_mycenaean_horned_warrior",
                "mycenaean_aegean",
                "https://i.pinimg.com/originals/34/8b/fb/348bfb2b7f15d9d302029b15933a6306.png",
                "Painterly full-body Bronze Age character, warm bronze/linen palette, shield mass, and ARPG presence.",
                "Exact tusked helmet, circular bosses, character identity, or copying the complete costume.",
            ),
            curated(
                "north",
                "n16_stylized_mycenae.jpg",
                "north_stylized_mycenaean_character",
                "mycenaean_aegean",
                "https://i.pinimg.com/originals/a8/be/9c/a8be9cf4b85c3f09156ca96d3d57be6e.jpg",
                "Warm graphic palette, textile layering, and a strong ARPG-ready upper-body read.",
                "Exact character identity, facial markings, written labels, or bull-horn helmet copy.",
            ),
            curated(
                "north",
                "n17_mycenaean_commander.jpg",
                "north_mycenaean_commander",
                "mycenaean_aegean",
                "https://i.pinimg.com/originals/fb/c8/5e/fbc85ed14a28bcf844bde99c3f854f13.jpg",
                "Heroic heavy-tier bronze, shield proportion, layered skirt protection, and color confidence.",
                "Exact sunburst shield, face, plume, perfect rivet rows, or later Classical cues.",
            ),
            curated(
                "north",
                "n18_mycenaean_pair.jpg",
                "north_mycenaean_pair",
                "mycenaean_aegean",
                "https://i.pinimg.com/originals/fe/b2/ea/feb2ea78fcb307ecf3115897437fcb50.jpg",
                "Two grounded Bronze Age loadouts, body-shield mass, long spear scale, and pale metal contrast.",
                "Literal pair, copied shield markings, later Greek gear, or page treatment.",
            ),
        ],
    },
    "faction_stonewood": {
        "title": "CEDAR-OBSIDIAN CLANS",
        "palette": ("#7fb084", "#733c28", "#171b1d"),
        "allowed_clusters": {"mesoamerican", "tlingit_haida_cedar"},
        "sources": [
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
            curated(
                "stonewood",
                "s10_tlingit_illustration.jpg",
                "stonewood_tlingit_equipped_character",
                "tlingit_haida_cedar",
                "https://i.pinimg.com/originals/ca/ea/45/caea45b008fdc0dc68d9cfdd31f8d21d.jpg",
                "Cedar-and-hide armor mass, worn construction, organic weapon grip, and bold warm color.",
                "Exact mask, crest, clan imagery, sacred identity, or post-contact equipment.",
            ),
            curated(
                "stonewood",
                "s11_tlingit_scene.jpg",
                "stonewood_tlingit_action_scene",
                "tlingit_haida_cedar",
                "https://forums.ageofempires.com/uploads/default/original/3X/4/a/4a7139948958d3cc1639e3c6d435fb0f48a52aa2.jpeg",
                "Cedar weapon scale in motion, hide layers, bright painted surfaces, and lived cultural context.",
                "Literal scene, sacred figures, masks, clan designs, or any firearm-era detail.",
            ),
            curated(
                "stonewood",
                "s12_haida_coast.jpg",
                "stonewood_haida_coastal_character",
                "tlingit_haida_cedar",
                "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/haida-warrior-joseph-feely.jpg",
                "Coastal cedar-and-hide silhouette, restrained layers, spear/knife relationship, and environmental palette.",
                "Exact crest, face paint, clan art, post-contact clothing, or literal composition.",
            ),
            curated(
                "stonewood",
                "s13_aztec_warrior.jpg",
                "stonewood_mesoamerican_bright_character",
                "mesoamerican",
                "https://i.pinimg.com/736x/10/a4/a4/10a4a4226ed4baa31e10a432f0a5498c.jpg",
                "Bright equipped warrior silhouette, textile/feather color blocks, organic shield, and carried club scale.",
                "Exact regalia, huge feather fan, face identity, sacred emblem, or metal-heavy embellishment.",
            ),
            curated(
                "stonewood",
                "s14_mesoamerican_spearman.jpg",
                "stonewood_mesoamerican_spearman",
                "mesoamerican",
                "https://i.pinimg.com/originals/66/8f/db/668fdb85359156ca8ac0244fe17b23ee.jpg",
                "Grounded cloth-and-hide layers, long spear silhouette, round hide shield, and low-metal hierarchy.",
                "Exact headdress, body paint, jewelry, sacred markings, or literal costume.",
            ),
            curated(
                "stonewood",
                "s15_mayan_warrior.jpg",
                "stonewood_mayan_warrior_character",
                "mesoamerican",
                "https://cdna.artstation.com/p/assets/images/images/030/989/692/large/luis-diaz-mayan-warrior-2.jpg?1602248818",
                "Painterly ARPG-ready character, obsidian club read, feathered head protection, and layered organic kit.",
                "Exact character, steel-like edges, copied ornament, ritual identity, or modern fantasy armor.",
            ),
        ],
    },
    "faction_dustwind": {
        "title": "DUSTWIND STEPPE HOUSES",
        "palette": ("#d09a5f", "#7f4732", "#5f6a56"),
        "allowed_clusters": {"scythian_saka_steppe"},
        "sources": [
            ladder(
                "faction_dustwind",
                "STR",
                1,
                "ChatGPT Image Jul 9, 2026, 09_42_24 PM (1).png",
            ),
            ladder(
                "faction_dustwind",
                "DEX",
                3,
                "ChatGPT Image Jul 9, 2026, 09_42_25 PM (6).png",
            ),
            curated(
                "dustwind",
                "d09_scythian_camp.png",
                "dustwind_scythian_camp_characters",
                "scythian_saka_steppe",
                "https://i.pinimg.com/originals/7a/48/76/7a48767d5f6f5a997bc749e34e09491a.png",
                "Bright steppe textile patterns, compact shields, axes, bows, and lived travel context.",
                "Literal pair, yurt, loaded quiver contents, copied trim, or modern reenactor detail.",
            ),
            curated(
                "dustwind",
                "d10_scythian_horseman.jpg",
                "dustwind_scythian_horseman",
                "scythian_saka_steppe",
                "https://i.pinimg.com/originals/5f/df/4c/5fdf4c7eec7e771387185bb81a3fa1c8.jpg",
                "Mounted armor silhouette, sagaris scale, layered riding clothing, and ochre/blue textile palette.",
                "Horse as an item, exact rider, fur excess, copied ornament, or medieval cavalry details.",
            ),
            curated(
                "dustwind",
                "d11_saka_warrior.jpg",
                "dustwind_saka_equipped_character",
                "scythian_saka_steppe",
                "https://i.pinimg.com/originals/e6/a1/a2/e6a1a29fe21e94956866c849fb471f6c.jpg",
                "Full Saka loadout, patterned trousers, soft cap, compound bow and compact case relationships.",
                "Exact costume, visible arrows as quiver contents, copied animal art, or later Persian armor.",
            ),
            curated(
                "dustwind",
                "d12_steppe_horseman.jpg",
                "dustwind_steppe_horseman",
                "scythian_saka_steppe",
                "https://i.pinimg.com/originals/97/d1/92/97d192baaadf6bf8a385dba35a746a7a.jpg",
                "Colorful mounted silhouette, pointed cap, scale protection, and compact mobile kit.",
                "Literal rider, horse gear, copied plume, late armor, or treating the mount as deliverable.",
            ),
            curated(
                "dustwind",
                "d13_steppe_infantry.jpg",
                "dustwind_steppe_infantry",
                "scythian_saka_steppe",
                "https://i.pinimg.com/originals/54/b9/ee/54b9ee4ee5611cd1be2d68fd6e5ae61f.jpg",
                "Grounded infantry silhouette, compact axe and sword pairing, restrained scale armor, and travel layers.",
                "Exact face, copied weapons, later lamellar, metal abundance, or generic Viking cues.",
            ),
            curated(
                "dustwind",
                "d14_scythian_group.png",
                "dustwind_scythian_group",
                "scythian_saka_steppe",
                "https://i.pinimg.com/originals/d3/c0/2a/d3c02adbf1efa0affe73e9c44c7a0478.png",
                "Coherent steppe rank variety, scale-and-textile contrast, long spear proportion, and banner color.",
                "Literal lineup, banner symbols, wolf imagery, visible arrow contents, or copied costumes.",
            ),
        ],
    },
    "faction_riverspill": {
        "title": "RIVERSPILL NILE-ZIGGURAT KINGDOMS",
        "palette": ("#d1a45e", "#3b8b8f", "#9b4f38"),
        "allowed_clusters": {"predynastic_egyptian", "sumerian_akkadian"},
        "sources": [
            ladder(
                "faction_riverspill",
                "STR",
                1,
                "ChatGPT Image Jul 9, 2026, 09_29_09 PM (1).png",
            ),
            ladder(
                "faction_riverspill",
                "INT",
                1,
                "ChatGPT Image Jul 9, 2026, 09_29_10 PM (7).png",
            ),
            curated(
                "riverspill",
                "r12_sumerian_pair.jpg",
                "riverspill_sumerian_light_pair",
                "sumerian_akkadian",
                "https://i.pinimg.com/originals/8d/bd/11/8dbd118d460c63c6388219698f341d14.jpg",
                "Low-metal spear-and-torch silhouettes, rough hide clothing, and early rectangular shield construction.",
                "Literal pair, flame effect, copied shield face, exact costume, or polished elite metal.",
            ),
            curated(
                "riverspill",
                "r13_sumerian_company.jpg",
                "riverspill_sumerian_company",
                "sumerian_akkadian",
                "https://i.pinimg.com/originals/8b/8e/e2/8b8ee23480b67f3c1f38269087038343.jpg",
                "Bright Mesopotamian role variety, woven textiles, shield scale, helmets, and ARPG palette.",
                "Monumental statues, exact outfits, copied standards, later Assyrian gear, or literal group.",
            ),
            curated(
                "riverspill",
                "r14_akkadian_infantry.jpg",
                "riverspill_akkadian_infantry",
                "sumerian_akkadian",
                "https://i.pinimg.com/originals/1c/d1/a1/1cd1a17738f789e5f32ee3b0dbdb5df0.jpg",
                "Studded cloak protection, socket axes, rectangular shields, and low-metal infantry tiers.",
                "Exact cloak studs, copied poses, captions, or treating every soldier as a combined kit.",
            ),
            curated(
                "riverspill",
                "r15_sumerian_infantry.jpg",
                "riverspill_sumerian_infantry_roles",
                "sumerian_akkadian",
                "https://i.pinimg.com/originals/5a/a0/a6/5aa0a6ab2991175d821437e3bd44369f.jpg",
                "Coherent spear, axe, rectangular shield, bronze cap, and textile relationships.",
                "Literal lineup, exact uniforms, page text, circular motifs, or later imperial equipment.",
            ),
            curated(
                "riverspill",
                "r16_egyptian_archers.jpg",
                "riverspill_egyptian_archer_roles",
                "predynastic_egyptian",
                "https://live.staticflickr.com/4033/4449675379_343b8210d8_b.jpg",
                "Bright linen, hide, short-bow, axe, dagger, and light-infantry role separation.",
                "Horse gear, literal figures, page labels, visible quiver contents, or later chariot assumptions.",
            ),
            curated(
                "riverspill",
                "r17_egyptian_melee.jpg",
                "riverspill_egyptian_melee_scene",
                "predynastic_egyptian",
                "https://i.pinimg.com/originals/f6/63/da/f663dadc25b8f6e5fcff65ef55ac6a24.jpg",
                "Dynamic low-metal melee kit, linen and hide contrast, simple shields, mace, and axe use.",
                "Literal battle, copied shield paint, exact figures, later crowns, or heroic metal excess.",
            ),
        ],
    },
}


# Sources remain in manifest order, but the visual cards are deliberately
# irregular. Ladder anchors are offset and partially covered rather than
# becoming full-width horizontal bands.
LAYOUT = [
    (1000, 105, 1110, 850, 5.0),
    (1230, 955, 900, 1060, 6.5),
    (-95, 165, 1110, 950, -6.5),
    (40, 990, 970, 1060, 4.8),
    (665, 790, 1060, 925, -5.8),
    (-105, 1830, 1090, 1130, -4.7),
    (620, 1700, 1070, 1190, 4.2),
    (1350, 1930, 845, 1110, -6.3),
]


def font(size: int) -> ImageFont.FreeTypeFont:
    for candidate in (
        Path(r"C:\Windows\Fonts\bahnschrift.ttf"),
        Path(r"C:\Windows\Fonts\segoeuib.ttf"),
        Path(r"C:\Windows\Fonts\arialbd.ttf"),
    ):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def validate_source(faction: str, config: dict, entry: dict) -> None:
    path = Path(entry["path"]).resolve()
    if not path.exists():
        raise FileNotFoundError(path)
    if entry["faction_lock"] != faction:
        raise ValueError(f"{entry['key']}: faction lock mismatch")

    if entry["role"] == "approved_project_ladder":
        try:
            path.relative_to(LADDERS.resolve())
        except ValueError as exc:
            raise ValueError(f"{entry['key']}: ladder source outside ladders") from exc
        if faction not in path.parent.name:
            raise ValueError(f"{entry['key']}: cross-faction ladder path {path}")
        return

    expected_root = (CURATED / faction.removeprefix("faction_")).resolve()
    try:
        path.relative_to(expected_root)
    except ValueError as exc:
        raise ValueError(f"{entry['key']}: source outside faction-curated root") from exc
    if entry["historical_cluster"] not in config["allowed_clusters"]:
        raise ValueError(
            f"{entry['key']}: cluster {entry['historical_cluster']} not allowed for {faction}"
        )
    if not entry["source_url"]:
        raise ValueError(f"{entry['key']}: curated source lacks provenance URL")


def materialize(entry: dict) -> Path:
    SOURCES.mkdir(parents=True, exist_ok=True)
    source_path = Path(entry["path"])
    destination = SOURCES / f"{entry['key']}{source_path.suffix.lower()}"
    shutil.copy2(source_path, destination)
    return destination


def rounded_image(source_image: Image.Image, size: tuple[int, int]) -> Image.Image:
    image = source_image.convert("RGB")
    image = ImageEnhance.Color(image).enhance(1.10)
    image = ImageEnhance.Contrast(image).enhance(1.04)
    fitted = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS)
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size[0], size[1]), radius=28, fill=255
    )
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.paste(fitted.convert("RGBA"), (0, 0), mask)
    return result


def paste_card(
    canvas: Image.Image,
    source_image: Image.Image,
    x: int,
    y: int,
    width: int,
    height: int,
    angle: float,
    border: str,
) -> None:
    inner = rounded_image(source_image, (width, height))
    framed = Image.new("RGBA", (width + 20, height + 20), (0, 0, 0, 0))
    ImageDraw.Draw(framed).rounded_rectangle(
        (0, 0, framed.width - 1, framed.height - 1),
        radius=34,
        fill=border,
    )
    framed.alpha_composite(inner, (10, 10))

    shadow = Image.new("RGBA", framed.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (8, 10, shadow.width - 3, shadow.height - 1),
        radius=34,
        fill=(0, 0, 0, 155),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))

    rotated_shadow = shadow.rotate(
        angle, resample=Image.Resampling.BICUBIC, expand=True
    )
    rotated = framed.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    px = int(x - (rotated.width - width) / 2)
    py = int(y - (rotated.height - height) / 2)
    canvas.alpha_composite(rotated_shadow, (px + 18, py + 22))
    canvas.alpha_composite(rotated, (px, py))


def background(primary: Image.Image, palette: tuple[str, str, str]) -> Image.Image:
    bg = ImageOps.fit(primary.convert("RGB"), SIZE, method=Image.Resampling.LANCZOS)
    bg = bg.filter(ImageFilter.GaussianBlur(42))
    bg = ImageEnhance.Color(bg).enhance(0.7)
    bg = ImageEnhance.Brightness(bg).enhance(0.48)
    result = Image.alpha_composite(bg.convert("RGBA"), Image.new("RGBA", SIZE, palette[1] + "7a"))
    draw = ImageDraw.Draw(result, "RGBA")
    draw.ellipse((-420, 120, 1350, 1760), fill=palette[0] + "36")
    draw.ellipse((800, 1080, 2460, 3160), fill=palette[2] + "46")
    draw.polygon(
        [(-200, 2500), (1850, 1860), (2250, 2820), (200, 3270)],
        fill=palette[0] + "28",
    )
    return result


def draw_board(faction: str, config: dict, prepared: list[dict]) -> Path:
    images = [Image.open(item["prepared_path"]) for item in prepared]
    canvas = background(images[0], config["palette"])
    for entry, layout, image in zip(prepared, LAYOUT, images, strict=True):
        x, y, width, height, angle = layout
        border = "#eee7d9" if entry["role"] == "approved_project_ladder" else "#d8c8ad"
        paste_card(canvas, image, x, y, width, height, angle, border)

    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.rounded_rectangle((56, 52, 1430, 138), radius=24, fill=(12, 17, 18, 205))
    draw.text((84, 70), config["title"], font=font(42), fill="#f4eee2")

    destination = OUTPUT / f"{faction}__visual-moodboard-v4.jpg"
    canvas.convert("RGB").save(destination, quality=95, subsampling=0, optimize=True)
    return destination


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    SOURCES.mkdir(parents=True, exist_ok=True)
    for stale in SOURCES.iterdir():
        if stale.is_file():
            stale.unlink()
    manifest = {
        "version": 4,
        "format": "2048x3072 portrait organic visual collage",
        "visible_text": "faction name only",
        "user_examples_policy": (
            "User-pasted images define useful image types only and are not board sources."
        ),
        "source_policy": (
            "Exactly two approved project ladder anchors plus six newly researched, "
            "visually reviewed sources locked to one faction-specific historical cluster."
        ),
        "factions": {},
    }

    for faction, config in FACTIONS.items():
        entries = [dict(entry) for entry in config["sources"]]
        if len(entries) != 8:
            raise ValueError(f"{faction}: expected eight sources")
        if sum(item["role"] == "approved_project_ladder" for item in entries) != 2:
            raise ValueError(f"{faction}: requires exactly two ladder anchors")
        if len({item["key"] for item in entries}) != len(entries):
            raise ValueError(f"{faction}: duplicate source key")

        prepared = []
        for entry in entries:
            validate_source(faction, config, entry)
            item = dict(entry)
            item["prepared_path"] = str(materialize(item))
            prepared.append(item)

        board_path = draw_board(faction, config, prepared)
        manifest["factions"][faction] = {
            "title": config["title"],
            "allowed_clusters": sorted(config["allowed_clusters"]),
            "board_path": str(board_path),
            "sources": prepared,
        }

    (OUTPUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Built {len(FACTIONS)} faction-locked moodboards in {OUTPUT}")
    for data in manifest["factions"].values():
        print(data["board_path"])


if __name__ == "__main__":
    main()
