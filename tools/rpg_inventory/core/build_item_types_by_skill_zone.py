#!/usr/bin/env python3
"""Build the skill-zone item-type mapping.

Source of truth for item briefs: which skills live in each INT/DEX/STR zone of
the passive tree, and the period tools a person doing those skills would carry.

Outputs (run from repo root or anywhere):
  tools/rpg_inventory/core/item-types-by-skill-zone.json   (pipeline input)
  docs/ITEM-TYPES-BY-SKILL-ZONE.md                          (human doc)

Edit the data in this file, then run:
  python3 tools/rpg_inventory/core/build_item_types_by_skill_zone.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import item_modpools  # noqa: E402

ROOT = Path(__file__).resolve().parents[3]
JSON_OUT = ROOT / "tools/rpg_inventory/core/item-types-by-skill-zone.json"
MD_OUT = ROOT / "docs/ITEM-TYPES-BY-SKILL-ZONE.md"

VERSION = "2026-11-07.3"

SLOTS = [
    ("main", "Main hand"),
    ("off", "Off hand"),
    ("head", "Head"),
    ("body", "Body"),
    ("hands", "Hands"),
    ("belt", "Belt"),
    ("feet", "Feet"),
    ("amulet", "Amulet"),
    ("ring", "Ring"),
    ("warhorn", "War Horn slot"),
]

BANDS = {
    "core": {"rings": [1, 2], "meaning": "Shared mechanics near the Origin. Everyday kit any build can wear; cheapest materials (flint, bone, hide, wool, linen). Period: leans Neolithic and Chalcolithic common kit.", "period": "Neolithic / Chalcolithic common kit"},
    "mid": {"rings": [3, 6], "meaning": "Versatile and hybrid archetypes. The working tools of the trade (copper, early bronze, specialist organic kit). Period: Early and Middle Bronze Age.", "period": "Early / Middle Bronze Age"},
    "outer": {"rings": [7, 10], "meaning": "Specialised archetypes past the ring-7 class node. Full professional or high-status kit (bronze, gold, ivory, inlay); matches the class unlocks. Period: Late Bronze Age elite pieces.", "period": "Late Bronze Age elite pieces"},
}

CONFIDENCE = {
    "A": "attested: real find of this form in the period",
    "Art": "attested in period art or texts only; construction inferred",
    "Adapt": "attested elsewhere or for another use; adapted here (disclose)",
    "Disp": "object attested, but the function used here is disputed (disclose)",
    "U": "unconfirmed: do not generate without owner sign-off",
}

GLOBAL_AVOID = [
    "iron or steel look (grey sheen, fullers, crossguards); no chainmail, rivet-mail or plate armour",
    "stitched modern soles, welts, heels, toe caps on any footwear",
    "aprons, kilts, loincloths or hanging panels presented as body armour; belts drawn as faulds or tassets",
    "forked or gnarled sticks as staffs or weapons; crystal-topped staffs",
    "stone ball set in a metal cup as a 'stone mace' (real maceheads are drilled through and sit on a wooden haft)",
    "invented-name items, lore epithets or compound coinages (owner rules 6-8)",
    "medieval silhouettes: closed, crested, visored or nasal helmets; heater or kite shields; longswords; buckles with tongues",
    "glass vials, potion bottles, lanterns, candles, coins, books, scrolls",
    "glowing gems, energy veins, glow halos, floating crystals",
    "pentagrams, rune bands, sigils, pseudo-text or pseudo-cuneiform",
    "single boot or glove where a pair is the item; cropped cords or shafts; arrows shown in quivers (pipeline rule)",
]

# Item tuple: (slot, band, name, skills, why, materials, silhouette, precedent, conf, avoid)
ZONES = [
    {
        "id": "int",
        "label": "INT",
        "angle": 90,
        "mix": "INT 100",
        "treeClass": "ring-7 INT node: sets the INT class",
        "classUnlocks": "a second curio, a spell focus socket and an extra focus slot",
        "wedges": "cold and marks wedge (INT toward INT/DEX): cold, chill, freeze, marks; INT spoke: Ward, spell damage",
        "latticeRow": "damage type row (opened by the INT class)",
        "gameSkills": [
            "frost-nova", "blizzard", "Slow Cold Orb", "geyser", "Cold Damage Aura", "Long Ward Charge",
            "Ward Charge", "teleport", "cursed (curse)", "weakened (curse)", "power-charges (inferred)",
        ],
        "archetypes": "spell bolt 95/4/1, nova, curse 90/8/2, channelled spells, teleport 73/27/0, ward",
        "role": "Ritual specialist who is also healer and diviner, not a battle-mage. Evidence: shaman burials (Hilazon Tachtit c. 10,000 BC; Bad Duerrenberg c. 7000 BC; Upton Lovell G2a c. 1800 BC), Mari liver models (18th c. BC), the Ramesseum magician's box (c. 1700 BC).",
        "items": [
            ("main", "mid", "Bronze serpent wand", "spell bolt, channelling", "rigid directional rod held toward the target", "cast copper alloy", "straight or slightly wavy snake, about 28 cm; reads as a thin dark rod with a head", "Ramesseum magician's box, Fitzwilliam E.63.1896, c. 1700 BC", "A", "coiled caduceus; gem eyes; glow"),
            ("main", "outer", "Ivory curved wand", "curses, ward, nova", "drawn on the ground to mark a protective circle", "hippopotamus ivory, incised animals", "flat pale crescent blade shape; shallow carving", "Middle Kingdom apotropaic wands, four in the Ramesseum box, c. 1900-1700 BC", "A", "straight 'magic wand' stick; glowing glyphs"),
            ("main", "core", "Wooden staff", "channelling, ward", "walking and ritual staff; the everyday caster's long tool", "straight hardwood, hide grip wrap", "plain straight pole, slight taper", "staffs common in Egyptian and Near Eastern art; Wood Staff already a game base", "Art", "forked or gnarled stick; crystal top"),
            ("off", "mid", "Clay liver model", "curses, marks, prophecy", "the diviner's reading tool; marks and curses read as foresight", "fired clay with peg holes and ruled zones", "flat lobed plaque, holes and grid only", "Mari palace liver models (Louvre AO 19829), Hattusa, Babylon", "A", "pseudo-cuneiform text lines"),
            ("off", "outer", "Bronze sistrum", "channelled auras", "shaken rattle for sustained rites", "bronze loop frame, loose rods with discs, wood or bronze handle", "loop on a handle with crossbars", "New Kingdom Egypt; Tutankhamun's tomb (check record)", "A", "hand-bell shape"),
            ("off", "core", "Clay drum", "channelling, nova", "steady beat for channelled rites", "fired clay body with lugs, laced hide head", "goblet or drum body with lugs", "Bernburg and Walternienburg cultures, Germany, c. 3200 BC", "A", "painted Siberian frame drum (ethnographic, 18th c.+)"),
            ("head", "outer", "Antler headdress", "summoning beasts, curses", "wearing the animal to stand for it", "roe or red deer antlers on a cut skull plate, hide ties", "two short antlers on a skull cap", "Bad Duerrenberg c. 7000 BC; Star Carr frontlets c. 9000 BC", "A", "fantasy horned helmet; antler crown"),
            ("head", "outer", "Sheet gold cone hat", "ward, auras", "high-status ritual dress for the outer INT build", "hammered sheet gold, rows of punched circles", "tall narrow cone with a brim", "Schifferstadt hat c. 1400-1300 BC; Berlin gold hat c. 1000-800 BC", "A", "floppy wizard hat; stars and moons"),
            ("head", "core", "Felt cap", "any", "plain head cover for the everyday healer", "felted wool", "rounded cap", "Borum Eshoej and Trindhoej caps, Denmark, c. 1370 BC", "A", "hood with a skull; cowl"),
            ("body", "outer", "Hide garment with bone point fringe", "channelling, summoning", "the fringe rattles as the wearer moves", "hide, perforated bone points, boar tusks", "garment with a dense fringe at hem and chest", "Upton Lovell G2a c. 1850-1700 BC; Bad Duerrenberg", "A", "bone armour plates; skull ornaments"),
            ("body", "outer", "Leopard skin over linen robe", "auras, ward", "the funerary priest's costume", "leopard pelt, pleated linen", "robe with a pelt over one shoulder", "sem-priest in Old to New Kingdom reliefs", "Art", "robe with sigils; hooded cowl"),
            ("body", "core", "Oval wool cloak", "any", "everyday warmth; does not hinder casting", "woven wool", "semicircle cloak folded at the shoulder", "Muldbjerg and Trindhoej, Denmark, c. 1350 BC", "A", "trimmed fantasy robe"),
            ("hands", "outer", "Linen gloves", "channelling", "ritual handling", "woven linen", "pair of plain gloves with cuffs", "Tutankhamun's tomb, c. 1325 BC (check record)", "A", "gauntlets; glowing palms"),
            ("hands", "core", "Spiral arm rings", "any", "bare hands free for rites; status on the arm", "gold or bronze wire", "pair of coils", "Central and Northern European Bronze Age hoards", "A", "fingerless gloves"),
            ("belt", "core", "Calfskin belt with pouch", "healer kit, ward", "carries tinder fungus, birch polypore (medicine) and a bone awl", "calf leather, sewn pouch", "narrow belt with a flat pouch", "Oetzi's belt, c. 3300 BC", "A", "rectangular buckle; potion bottles"),
            ("belt", "mid", "Leather charm bag on a belt", "curses, summoning", "holds animal parts and small objects used in rites", "leather bag; amber, shell, claw, jaw inside", "belt with a drawstring bag", "Hvidegaard burial, Zealand, c. 1300 BC (contents list unverified)", "Adapt", "glass vials; dangling chimes"),
            ("feet", "core", "Bearskin-soled shoes", "any", "quiet, warm, no hard sole", "bearskin sole, deer hide upper, grass net liner", "rounded bag-like shoe gathered by a thong", "Oetzi, c. 3300 BC", "A", "stitched modern sole; heel"),
            ("feet", "mid", "Rush sandals", "any", "light footwear for temple and dry ground", "rush or papyrus", "flat woven sole, toe thong", "Egyptian finds incl. Tutankhamun's tomb", "A", "chunky modern sandal; separate sole edge"),
            ("amulet", "mid", "Faience eye amulet", "curses, ward", "protective eye", "blue-green faience on a cord", "small eye shape on a cord", "Egyptian udjat amulets, common", "A", "glowing pendant"),
            ("amulet", "outer", "Stone cylinder seal on a cord", "marks, curses", "the owner's mark, rolled onto clay", "lapis or other stone", "small cylinder on a cord", "Mesopotamian seals, common", "A", "carved runes"),
            ("amulet", "core", "Drilled tooth pendant", "summoning", "part of the animal worn by the caster", "drilled animal tooth or talon", "single tooth on a cord", "Mesolithic to Bronze Age, common; eagle remains at Hilazon Tachtit", "A", "gem-set claw"),
            ("ring", "core", "Gold wire spiral ring", "any", "plain status ring", "gold wire", "small coil", "European Early and Middle Bronze Age", "A", "faceted solitaire"),
            ("ring", "outer", "Scarab seal ring", "ward, marks", "seal of the owner", "steatite or faience scarab on a swivel", "oval bezel on a wire hoop", "Egypt, Middle Kingdom onward", "A", "glowing gem"),
        ],
        "avoid": ["gem-tipped or glowing staffs", "robes with sigils, star patterns or trim", "floppy hats", "books, scrolls, candles"],
        "open": [
            "No wand-like object is attested outside Egypt; INT wands follow Egyptian finds only.",
            "No wooden frame drum survives; the clay drum stands in. Is a hide frame drum acceptable as adapted?",
            "Hvidegaard bag contents need checking against the primary publication before a brief uses them.",
            "Default, owner may veto (2026-11-07): period weighting by band: core leans Neolithic/Chalcolithic common kit, mid Early/Middle Bronze Age, outer Late Bronze Age elite pieces. Regions stay mixed.",
        ],
    },
    {
        "id": "int_dex",
        "label": "INT/DEX",
        "angle": 150,
        "mix": "INT ~55 / DEX ~45",
        "treeClass": "ring-7 INT/DEX node: sets the INT/DEX class",
        "classUnlocks": "trap and mark tools, poison vials and a supply pack",
        "wedges": "poison and traps wedge (DEX toward INT/DEX): poison, wither, traps, stealth; cold and marks wedge: marks",
        "latticeRow": "effect row (opened by the INT/DEX class, a wand or a knife)",
        "gameSkills": [
            "poison-cloud", "grasping-vines", "drain-life", "Spell Damage and Chaos Aura", "withered (curse)",
            "blinded (curse)", "chain-lightning, spark, shock-nova, tornado (placement weakest)",
        ],
        "archetypes": "blink 64/34/2, mark 53/45/2, shadow clone 49/49/2, mine 45/52/3, trap 36/61/3, poison, stealth",
        "role": "Hunter-trapper and poisoner, and the night scout. Evidence: Oetzi's bast net and kit (c. 3300 BC); Egyptian clap-net fowling scenes; Border Cave and Kruger Cave poison applicators; boar's-tusk helmet of the scout. Blink, phase and shadow clone have no physical analogue; the nearest real kit is disguise (animal skins) and pigment for marks.",
        "items": [
            ("main", "core", "Flint dagger with bast sheath", "poison strikes, precision", "small blade for the finishing cut and for applying poison", "flint blade, ash handle, woven bast sheath", "short leaf blade, plain handle, sheath beside it", "Oetzi's dagger, c. 3300 BC; Danish fishtail daggers c. 1900 BC", "A", "curved 'assassin' knife; steel look"),
            ("main", "mid", "Bone knife", "poison, marks", "matches the game's Bone Knife base and the effect row", "split long bone, ground edge", "narrow tapered bone blade", "bone knives and daggers, Neolithic, common", "A", "serrated monster-bone blade"),
            ("main", "mid", "Bronze serpent wand", "lightning and chaos spells, marks", "shared with INT; the effect row opens on wands", "cast copper alloy", "thin rod with a head", "Ramesseum box, c. 1700 BC", "A", "glowing tip"),
            ("off", "mid", "Bast fowling net", "traps", "the attested portable trap", "knotted lime bast cord", "folded net bundle with cords", "Oetzi's net; Egyptian clap-net scenes", "A", "metal bear trap; caltrops (post-Bronze Age)"),
            ("off", "outer", "Horn poison container with applicator", "poison, venom vials (class unlock)", "holds arrow or blade poison; the stick applies it", "horn or bone tube, wooden plug, stick", "short stoppered horn with a stick", "Border Cave applicator; San ethnography", "Adapt", "glowing green vials; glass flasks"),
            ("off", "mid", "Pigment palette with kohl tube", "marks", "the marking kit: ground mineral pigment", "slate palette, horn or reed tube, grinding pebble", "flat palette with a tube", "Predynastic and Dynastic Egyptian palettes", "A", "palette with pseudo-glyphs"),
            ("head", "outer", "Animal skin hood with head", "stealth, blink, phase", "disguise: the wearer becomes the animal", "wolf or deer skin with head left on", "pelt hood with ears and snout over the brow", "Star Carr frontlets; Doloneia (literary); Kahun mask", "Adapt", "ninja hood; medieval cowl with shadowed face"),
            ("head", "core", "Bearskin cap with chin strap", "any", "everyday hunter cap", "bearskin", "rounded fur dome, two straps", "Oetzi, c. 3300 BC", "A", "assassin hood"),
            ("body", "core", "Hide strip coat", "stealth, evasion", "quiet, flexible, mottled colour", "sheep and goat hide in vertical strips", "knee-length coat of alternating strips", "Oetzi, c. 3300 BC", "A", "black stealth suit; strapped leather armour"),
            ("body", "mid", "Grass cape", "traps, stealth", "rain cover and ground blind for the trapper", "plaited grass", "shaggy cape over shoulders", "Oetzi's grass mat or cape (use debated)", "Disp", "ghillie suit"),
            ("body", "outer", "Wolf skin cloak", "stealth, shadow clone", "disguise cloak", "wolf pelt", "pelt over shoulders and back", "Doloneia (literary); pelts generic", "Adapt", "glowing shadow cloak"),
            ("hands", "mid", "Stone wrist guard", "precision", "marks the archer; protection disputed", "polished stone plate, leather strap", "small flat bar with end holes on a strap", "Beaker wristguards, Amesbury Archer, c. 2300 BC", "Disp", "metal vambrace"),
            ("belt", "core", "Belt pouch with fire kit", "traps, fire", "carries flint, tinder and awl for setting traps and fire", "calf leather pouch", "belt with flat pouch", "Oetzi, c. 3300 BC", "A", "bandolier of vials"),
            ("belt", "mid", "Esparto grass bag", "traps, preparations", "woven bag for snares, cord and plant material", "plaited esparto grass", "small woven bag on a cord", "Cueva de los Murcielagos, Spain, c. 7500-4200 BC", "A", "poppy symbolism (not confirmed)"),
            ("feet", "core", "Bearskin-soled shoes", "stealth", "quiet fur sole", "bearskin, deer hide, grass liner", "rounded gathered shoe", "Oetzi", "A", "stitched modern sole"),
            ("feet", "mid", "Esparto grass sandals", "stealth, movement", "light woven sandal", "plaited esparto", "flat woven sole with ties", "Cueva de los Murcielagos", "A", "modern flip-flop"),
            ("amulet", "mid", "Ochre crayon on a thong", "marks", "the pigment used to mark, carried at the neck", "shaped ochre or haematite, hide thong", "small worn stone on a thong", "worn ochre pieces common; pendant form adapted", "Adapt", "glowing stone"),
            ("amulet", "core", "Pierced tooth pendant", "any", "hunter's token", "drilled tooth or claw", "single tooth on a cord", "common, Mesolithic onward", "A", "gem-set fang"),
            ("ring", "core", "Plain copper wire ring", "any", "everyday ring", "copper wire", "plain band", "common", "A", "engraved rune band"),
            ("off", "mid", "Bundle of sharpened stakes", "mines, traps", "stakes set in a covered pit: the buried trap used for mines", "split hardwood stakes, fire-hardened points, bast tie", "tied bundle of short pointed stakes", "pit traps attested (Scandinavian elk pit rows; Near Eastern desert kites); stake-lined pits need a specific find", "U", "metal spikes; caltrops"),
            ("belt", "mid", "Pouch of clay sling shot", "mines, traps", "shot laid on the ground as a mine charge (game use); carried in a pouch", "hide pouch, baked clay shot", "small pouch with egg-shaped shot showing", "Mari baked clay sling bullets; Levantine slingstones; laying them as mines is adapted", "Adapt", "bombs; fire pots; lead shot"),
        ],
        "avoid": ["clay fire pots or bombs as mines (no pre-Iron-Age evidence)", "caltrops", "black hoods with shadowed faces", "glowing poison vials"],
        "open": [
            "Default, owner may veto (2026-11-07): mines are buried stake traps and laid sling shot. Clay fire pots stay out (not attested before the Iron Age). The stake bundle stays unconfirmed (not briefable) until a stake-lined pit find is cited; pit traps themselves are attested.",
            "Default, owner may veto (2026-11-07): blink, phase and shadow clone use the disguise kit (animal skin hood, wolf skin cloak) as their visual answer.",
            "Bronze Age arrow poison in Eurasia is not proven archaeologically; the poison container rests on southern African evidence.",
            "Lightning spells sit here only by inference (shock support is DEX, scaling is INT). Confirm the zone before briefing their foci.",
        ],
    },
    {
        "id": "dex",
        "label": "DEX",
        "angle": 210,
        "mix": "DEX 100",
        "treeClass": "ring-7 DEX node: sets the DEX class",
        "classUnlocks": "a second weapon set, dual-wielding one-handed weapons and an extra tool slot",
        "wedges": "projectile and shock wedge (DEX toward DEX/STR): projectiles, shock, accuracy; poison and traps wedge: poison, traps, evasion",
        "latticeRow": "range row (opened by the DEX class or a spear)",
        "gameSkills": [
            "Lunge (spear technique)", "Dodge roll", "Claw combo, Moving slash, Channelled spin (claws)",
            "arrow-volley", "haste", "frenzy-charges (inferred)",
        ],
        "archetypes": "bow shot 3/94/3, dash 5/80/15, thrust 2/77/21, grenade 10/59/31, trap 36/61/3, evasive movement",
        "role": "Hunter-archer and light missile troop: Oetzi's bow and quiver (c. 3300 BC), Beaker archer burials (Amesbury Archer c. 2300 BC), Egyptian archers and slingers (Tutankhamun's bows, slings and throw-sticks c. 1325 BC; Mesehti archer models c. 2000 BC). Dash and evasion fit a skirmisher in clothing, not plates.",
        "items": [
            ("main", "mid", "Yew self bow", "bow shot, arrow-volley, fast attacks", "simple long stave, quick to draw", "yew, sinew or plant fibre string", "tall thin stave, plain nocks, long diagonal", "Oetzi's yew stave c. 3300 BC; Rotten Bottom bow c. 4000 BC", "A", "recurve elf tips; carved gem grip"),
            ("main", "outer", "Composite bow", "ranged precision", "short bow with high power for the specialist", "wood core, horn, sinew, birch bark cover", "short, deep double curve, sometimes gold banded", "Tutankhamun's composite bows, c. 1325 BC", "A", "compound bow cams; metal limbs"),
            ("main", "mid", "Linen sling with clay shot", "thrown and lobbed skills (grenade family)", "the attested way to lob missiles; replaces fire pots", "plaited linen cord, woven pouch, baked clay or stone shot", "coiled cord with a diamond pouch and 2-3 egg-shaped shot", "Tutankhamun slings (Griffith 585y); Mari clay bullets; Levantine slingstones", "A", "lead bullets with inscriptions (Iron Age); Y slingshot"),
            ("main", "mid", "Wooden throwing stick", "thrown weapons, fast attacks", "fowling stick thrown at birds", "curved hardwood, optional faience caps", "flat gently curved bar", "Tutankhamun's throw-sticks; Nebamun fowling scene", "A", "returning boomerang with tribal paint"),
            ("main", "mid", "Flint spear", "Lunge, thrust", "the game's Flint Spear base; opens the range row", "ash shaft, pressure-flaked flint head, sinew binding", "long shaft with a leaf head", "Neolithic flint spearheads, common", "A", "stubby short shaft"),
            ("main", "outer", "Bronze-headed javelin", "javelin, thrown", "light thrown spear", "hardwood shaft, small socketed bronze head", "thin 1.5-2 m shaft, small leaf head", "socketed spearheads, Aegean and Tumulus Europe", "Adapt", "fletched javelin; barbed harpoon head"),
            ("off", "mid", "Hide quiver with stiffening rod", "bow shot", "carries arrows; the extra tool slot holds it", "goat hide, hazel rod, hide flap", "long narrow tube", "Oetzi's quiver, c. 3300 BC", "A", "arrows drawn inside (pipeline rule); magic arrows"),
            ("off", "outer", "Leather bow case", "composite bow", "protects the composite bow", "rawhide or leather", "tapered case", "Tutankhamun chariot cases; New Kingdom reliefs", "A", "Scythian gorytos (Iron Age)"),
            ("head", "core", "Wool pile cap", "any", "generic DEX head", "wool with knotted pile", "hemispherical shaggy cap", "Borum Eshoej and Trindhoej, c. 1370 BC", "A", "feathered ranger hat"),
            ("head", "mid", "Bearskin cap with chin strap", "hunting", "outdoor hunter cap", "bearskin", "rounded fur dome, two straps", "Oetzi", "A", "assassin hood"),
            ("head", "outer", "Linen headcloth", "desert archer", "sun and dust cover for the professional archer", "linen", "cloth falling behind the head", "New Kingdom soldier reliefs", "Art", "metal helmet on the core archer"),
            ("body", "core", "Wool tunic", "any", "unrestricted movement", "woven wool", "simple tunic", "Borum Eshoej, c. 1370 BC", "A", "studded leather jerkin"),
            ("body", "mid", "Hide strip coat", "dash, evasion", "light and flexible", "sheep and goat hide strips", "knee-length striped coat", "Oetzi", "A", "corset; chainmail"),
            ("body", "outer", "Leather scale cuirass on linen", "chariot archer", "the professional archer's light armour", "rawhide scales on linen backing", "short cuirass of small overlapping scales", "Tutankhamun's cuirass (Veldmeijer et al.)", "A", "kilt or apron as armour"),
            ("hands", "mid", "Leather archery glove", "bow shot", "protects the draw hand", "leather", "single glove for the draw hand", "Tutankhamun Handlist archery gloves", "A", "fingerless thief gloves"),
            ("hands", "outer", "Linen bow arm pad", "bow shot", "protects the bow arm from the string", "padded linen", "forearm pad with ties", "Tutankhamun Handlist (identification tentative)", "Disp", "spiked metal vambrace"),
            ("belt", "core", "Leather belt with pouch", "traps, repair", "carries the flint kit", "calf leather", "belt with flat pouch", "Oetzi", "A", "buckled belt with potion vials"),
            ("belt", "outer", "Bronze belt box", "any", "personal kit of tools and spare arrowheads", "cast bronze box on a leather belt", "small round lidded box on a belt", "Tollense personal kit, c. 1250 BC (Uhlig et al. 2019)", "A", "knife bandolier"),
            ("feet", "core", "One-piece hide shoe", "dash", "soft, laced, no hard sole", "single piece of cowhide, thong", "moccasin gathered by a thong", "Areni-1 shoe, Armenia, c. 3500 BC", "A", "stitched separate sole; heel"),
            ("feet", "mid", "Bearskin-soled shoes", "dash, evasion", "quiet grip on rough ground", "bearskin, deer hide, grass liner", "rounded gathered shoe", "Oetzi", "A", "laced ranger boot with toe cap"),
            ("amulet", "core", "Stone bead on hide tassel", "any", "plain token", "marble disc bead, hide strips", "disc bead with a tassel", "Oetzi's marble bead", "A", "claw necklace with gems"),
            ("amulet", "outer", "Faience eye amulet", "precision", "protective eye; plain motif meaning", "faience", "eye shape on a cord", "New Kingdom udjat amulets", "A", "glowing pendant"),
            ("ring", "outer", "Jade archer's thumb ring", "bow shot, precision", "protects the thumb on the draw", "jade", "thick ring with a string groove", "Fu Hao's tomb, Anyang, c. 1250 BC", "A", "faceted gem ring"),
            ("ring", "core", "Bronze spiral ring", "any", "plain ring", "bronze wire", "small coil", "Unetice and Tumulus finds", "A", "rune band"),
        ],
        "avoid": ["fire pots or grenades (use sling and clay shot)", "studded leather 'rogue' armour", "ranger boots", "hooded archers with shadowed faces"],
        "open": [
            "Default, owner may veto (2026-11-07): claws keep the existing Bone Claws game base, but no new claw items are briefed (no period precedent found).",
            "Javelin versus thrusting spear: no clear Bronze Age find-type split; lighter heads are an assumption.",
            "Stone wristguard function is disputed (possibly ornamental). Label it as an archer's status item?",
            "Traps as equipment: only nets, snares and throw-sticks are attested; no portable trap device.",
        ],
    },
    {
        "id": "dex_str",
        "label": "DEX/STR",
        "angle": 270,
        "mix": "DEX ~55 / STR ~45",
        "treeClass": "ring-7 DEX/STR node: sets the DEX/STR class",
        "classUnlocks": "thrown weapons count as melee and projectile, a belt charm and an animal parts pack",
        "wedges": "projectile and shock wedge: projectiles, accuracy; physical and bleed wedge (STR toward DEX/STR): physical, bleed, stun",
        "latticeRow": "intent row (opened by the DEX/STR class, a rod or an axe)",
        "gameSkills": [
            "Bleeding sweep (axe or Two-handed Flint Axe technique, bleed)", "Spinning Blades (bleed)", "thrown weapons as melee and projectile",
        ],
        "archetypes": "whirlwind 3/51/46, thrust 2/77/21, charge 2/25/73 (edge), strikes, parries, leaps, sweeps, combos",
        "role": "Fast close-combat fighter: the Aegean warrior with rapier and dagger (Mycenae Shaft Graves c. 1650-1500 BC), the Egyptian and Levantine sickle-sword soldier, the Sherden with round shield (Kadesh and Medinet Habu reliefs), Naue II sword users (c. 1300-1100 BC). Leaps: bull-leaping frescoes (Knossos, ritual not combat). Dual wielding as a technique is unconfirmed; sword and dagger were carried together.",
        "items": [
            ("main", "outer", "Bronze rapier", "thrust, fast strikes", "very long narrow blade made for thrusting", "bronze with midrib; wood or ivory hilt, gold rivets", "long narrow blade over 90 cm, small rounded shoulder", "Mycenaean Type A and B swords, Shaft Graves, c. 1600 BC", "A", "crossguard or cup hilt (16th c. rapier)"),
            ("main", "mid", "Bronze sickle sword", "sweeps, Bleeding sweep, hooking parries", "the outer curve cuts in a sweeping arc", "cast bronze, inlaid grip", "straight handle into a crescent blade sharp on the outside", "Tutankhamun's two khopeshes, c. 1325 BC; Shechem c. 1800 BC", "A", "scimitar; sharpened inner hook"),
            ("main", "mid", "Bronze leaf sword", "combos, strikes", "cut-and-thrust blade for mixed attacks", "bronze, flanged hilt clad in horn or wood", "leaf blade 60-70 cm, flanged grip", "Naue II swords, c. 1300-1000 BC", "A", "crossguard; longsword length; fullers"),
            ("main", "core", "Flint hatchet", "Bleeding sweep, thrown", "the game's Flint Hatchet; light axe that can be thrown", "flint blade in a wooden haft", "short haft, small blade", "Neolithic flint axes in wooden hafts (e.g. Oetzi's copper axe as the hafting model)", "Adapt", "double-bitted axe"),
            ("main", "mid", "Copper axe", "Bleeding sweep, bleed", "opens the intent row; chopping sweep", "cast copper blade, yew haft, leather binding", "short haft, flat trapezoid blade", "Oetzi's copper axe, c. 3300 BC", "A", "broad crescent axe; steel sheen"),
            ("off", "mid", "Long bronze dagger", "combos, second blade", "carried with the sword; companion blade", "bronze, riveted hilt plate", "broad triangular or leaf blade", "Lion Hunt dagger c. 1600 BC; Unetice daggers c. 2000-1600 BC", "Adapt", "matched pair of fantasy blades"),
            ("off", "mid", "Small round leather shield", "parries", "light shield for fast blocks", "hardened leather or wood, central grip", "disc with central boss or grip", "Sherden shields at Kadesh and Medinet Habu; Clonbrin shield (date unverified)", "A", "domed medieval buckler; heater shape"),
            ("head", "outer", "Boar's tusk helmet", "duelist", "the Aegean warrior's helmet", "split boar tusk plates on felt or leather cap, cheek pieces", "conical dome with banded tiers", "Dendra, Knossos, Mycenae, 17th-12th c. BC", "A", "crest; nasal bar"),
            ("head", "outer", "Reed headband", "any", "Sea Peoples headdress", "reed, feather or leather (disputed) on a band", "band with a row of upright reeds", "Medinet Habu reliefs, c. 1175 BC", "Art", "fantasy horned or crested helmet"),
            ("head", "core", "Leather cap", "any", "plain cap", "leather", "close cap", "leather helmets inferred from Aegean art; no find", "U", "visored helmet"),
            ("body", "outer", "Leather scale cuirass on linen", "any", "light armour that keeps the arms free", "rawhide scales on linen", "short scale cuirass", "Tutankhamun's cuirass", "A", "Dendra panoply (STR zone)"),
            ("body", "core", "Wool tunic", "any", "free movement", "wool", "simple tunic", "Borum Eshoej", "A", "kilt or loincloth as armour"),
            ("body", "mid", "Banded corselet", "any", "torso cover in horizontal bands", "construction unconfirmed (linen or leather bands)", "torso with horizontal bands", "Sea Peoples corselets at Medinet Habu", "Art", "riveted studded leather"),
            ("hands", "mid", "Boxing wrap", "strikes, fast attacks", "padded wrap for striking with the hand", "leather or cloth wrap", "single wrapped glove", "Akrotiri boxing fresco c. 1600 BC; Hagia Triada boxer rhyton", "Art", "cestus with metal; knuckle-dusters"),
            ("hands", "outer", "Woven linen gauntlets", "any", "forearm cover", "tapestry-woven linen", "pair of long cuffs", "Tutankhamun, Griffith 50u (use uncertain)", "A", "clawed gauntlets"),
            ("belt", "mid", "Wide cinched leather belt", "leaps, agility", "tight belt bracing the waist", "leather, possibly metal clad", "broad belt, narrow waist", "Minoan bull-leaping and procession frescoes", "Art", "belt drawn as faulds"),
            ("belt", "outer", "Leather belt with bronze disc", "belt charm (class unlock)", "the disc holds the belt charm", "leather, cast bronze disc with spike", "belt with a round disc at the front", "Egtved belt disc, c. 1370 BC (woman's grave; adapted)", "Adapt", "modern buckle"),
            ("feet", "core", "Leather sandals", "movement attacks", "light footwear", "leather sole, thongs", "flat sole with toe thong", "Egyptian leather sandals", "A", "chunky modern sandal"),
            ("feet", "mid", "Soft leather ankle boots", "leaps, dash", "ankle support without a hard sole", "soft leather", "low boot wrapped at the ankle", "Aegean frescoes (construction inferred)", "Art", "stitched separate sole; greaves in feet slot"),
            ("amulet", "mid", "Amber bead necklace", "any", "status necklace", "Baltic amber beads", "string of rounded beads", "Kakovatos and other Mycenaean tombs; Wessex spacers", "A", "glowing amber"),
            ("amulet", "outer", "Gold fly pendant", "combat merit", "gold fly; the 'award for valour' reading is contested", "sheet gold", "three stylised flies on a chain", "Queen Ahhotep's gold flies, c. 1550 BC", "Disp", "insect monster charm"),
            ("ring", "outer", "Gold signet ring with combat scene", "duelist", "Aegean signet with a figurative fight", "gold, oval bezel", "oval bezel larger than the hoop", "Shaft Grave IV ring c. 1550 BC; Pylos Combat Agate", "A", "sigils, crests or pseudo-text on the bezel"),
            ("ring", "core", "Bronze spiral ring", "any", "plain ring", "bronze wire", "small coil", "Tollense and Tumulus finds", "A", "faceted gem"),
        ],
        "avoid": ["matched pairs of identical blades sold as one item", "crescent fantasy axes", "rogue studded leather", "greaves in the feet slot"],
        "open": [
            "Dual wielding is unconfirmed as a period technique. The off-hand dagger is presented as a companion blade; disclose to the owner.",
            "Bull-leaping is ritual or sport. Is it acceptable as the precedent for leap and agility gear?",
            "Thrown weapons as melee (DEX/STR class unlock): flint hatchet and javelin both qualify; no dedicated throwing axe is attested.",
            "Clonbrin shield date and Sea Peoples corselet construction need primary-source checks.",
        ],
    },
    {
        "id": "str",
        "label": "STR",
        "angle": 330,
        "mix": "STR 100",
        "treeClass": "ring-7 STR node: sets the STR class",
        "classUnlocks": "tower shields and the War Horn slot",
        "wedges": "physical and bleed wedge: physical, bleed, stun, Life; fire and ignite wedge (STR toward STR/INT): fire and ignite on hits",
        "latticeRow": "target row (opened by the STR class, a staff or any two-handed weapon)",
        "gameSkills": [
            "Attack (strike)", "Ground slam (maul technique)", "Heavy sweep", "Wide sweep", "War cry",
            "Jawbone Weapon Combo", "ground-slam", "charge-line (enemy)", "execute (enemy)",
            "Damage Aura, Attack Speed Aura, Reflect Damage Aura, Fortify (auras and buffs)", "endurance-charges",
        ],
        "archetypes": "slam 3/11/86, warcry 18/6/76, charge 2/25/73, guard 24/7/69, heavy attacks, endurance",
        "role": "Close-order shield and spear line (Stele of the Vultures c. 2450 BC; Standard of Ur and the PG 789 guards c. 2600 BC), the shock fighter with mace or battle-axe (Narmer Palette c. 3100 BC; Corded Ware battle-axes c. 2900-2350 BC), and the Aegean heavy warrior with tower shield (Lion Hunt dagger c. 1600 BC; Dendra panoply c. 1400 BC).",
        "items": [
            ("main", "core", "Stone shaft-hole battle axe", "heavy attacks, slams", "weight at the end of a short haft; the haft passes through a drilled hole", "polished stone, wooden haft", "short haft with an asymmetric drooping head", "Corded Ware graves, c. 2900-2350 BC", "A", "double-bitted axe; head lashed on with straps"),
            ("main", "mid", "Pear-shaped stone macehead on a haft", "slams, ground impact, stun", "crushing head drilled through and set on a straight haft", "limestone, breccia or diorite, wooden haft", "slim haft, smooth pear head, no collar", "Naqada II maceheads c. 3500-3100 BC; Narmer Palette", "A", "stone ball in a bronze cup; spikes; flanges"),
            ("main", "mid", "Banded stone maul", "Ground slam", "the game's Banded Stone Maul; two-handed slam", "large drilled stone head, wooden haft, rawhide bands", "long haft, heavy drilled head", "drilled stone hammers and mauls, Neolithic and mining sites (check a specific find)", "Adapt", "rock lashed to a stick; forked haft"),
            ("main", "outer", "Copper shaft-hole axe", "heavy attacks, sweeps", "deep narrow cleaving head on a long haft", "cast arsenical copper or bronze, wooden haft", "narrow deep head with socket tube", "Royal Cemetery of Ur c. 2600 BC; Hittite axes c. 1600-1200 BC", "A", "bardiche crescent; steel grey"),
            ("main", "outer", "Arsenical copper sword", "strikes", "early long copper blade", "arsenical copper, some silver inlay", "blade 45-60 cm, no crossguard", "Arslantepe palace, c. 3300-3000 BC", "A", "anything over 65 cm; crossguard"),
            ("off", "outer", "Oxhide tower shield", "guard, endurance, charge", "body-length cover; the STR class's tower shield unlock", "layered oxhide on a wicker or wood frame", "tall rectangle with curved top, hide pattern", "Lion Hunt dagger c. 1600 BC; Akrotiri ship fresco", "Art", "kite or heater shape; steel boss"),
            ("off", "mid", "Rectangular hide shield", "guard, shield line", "the close-order line shield", "hide over wood or wicker", "large rectangle, possible studs", "Stele of the Vultures, c. 2450 BC", "Art", "Roman scutum curve"),
            ("off", "core", "Cowhide shield with rounded top", "guard", "everyday infantry shield", "piebald cowhide on a wooden frame", "tall shield with round top, hair left on", "Mesehti soldier models, Asyut, c. 2000 BC", "A", "metal-rimmed round shield"),
            ("warhorn", "outer", "Animal horn", "War cry (War Horn slot)", "signal horn for the war cry; goes in the War Horn slot the STR class node unlocks", "cattle horn, mouthpiece hole", "curved horn", "animal horns common; lurs c. 1000 BC are late", "Adapt", "a horn in the off hand; metal trumpet on the core band"),
            ("head", "mid", "Copper cap helmet", "guard", "plain dome over a padded cap", "hammered copper, padded leather or wool liner", "round dome with slight back flare", "PG 789 guards, Ur, c. 2600 BC", "A", "visor; nasal bar; crest"),
            ("head", "outer", "Cast bronze animal-face helmet", "guard, warcry", "Shang infantry helmet", "cast bronze", "rounded helmet with a face in relief at the front", "Anyang M1004, c. 1300-1050 BC", "A", "great helm; fantasy horned helmet"),
            ("head", "core", "Rawhide cap", "any", "hardened cap", "rawhide", "close round cap", "rawhide skullcap (taxonomy H-03); check a specific find", "U", "closed helmet"),
            ("body", "outer", "Bronze plate cuirass", "endurance, guard", "full bronze defence for the heaviest build", "bronze plates, leather ties", "bell-shaped torso with stacked curved bands, high neck", "Dendra panoply, c. 1400 BC (single near-complete find)", "A", "moulded muscle cuirass; rivets"),
            ("body", "mid", "Studded cloak", "guard", "thick cloak covered in round studs", "wool or felt (unconfirmed), round studs", "cloak fastened at the shoulder, dotted surface", "Standard of Ur soldiers, c. 2600 BC", "Art", "brigandine; chainmail"),
            ("body", "core", "Hide wrap", "any", "plain hide body cover", "tanned hide", "wrap over one shoulder", "generic hide garments (taxonomy B-02)", "Adapt", "apron or kilt as armour"),
            ("hands", "outer", "Bronze arm guards", "guard", "forearm defence from the panoply", "bronze sheet", "pair of tubes", "Dendra panoply arm pieces", "Adapt", "fingered plate gauntlets"),
            ("hands", "mid", "Bronze arm spirals", "any", "status coils on the forearm; protection unconfirmed", "bronze wire", "pair of long coils", "Unetice and Tumulus arm spirals, c. 2000-1300 BC", "Disp", "riveted cuffs"),
            ("belt", "mid", "Leather belt with sheathed copper dagger", "strikes", "sidearm on the belt", "leather, copper dagger, leather sheath", "belt with dagger in sheath", "Oetzi's belt; PG 580 gold-sheathed dagger, Ur", "A", "tongue buckle; flap pouches"),
            ("belt", "core", "Broad leather belt", "any", "plain broad belt", "leather, toggle closure", "wide band", "Warrior Vase, Mycenae, c. 1200 BC", "Art", "plate segments"),
            ("feet", "outer", "Bronze greaves over hide shoes", "charge, guard", "shin defence (greaves stay with the body set in the pipeline)", "bronze sheet, hide shoes", "pair of shin plates over shoes", "Dendra and Kallithea greaves, c. 1400-1200 BC", "A", "plate sabatons"),
            ("feet", "core", "Rawhide sandals", "any", "plain sandals", "rawhide sole, thongs", "flat sole, thongs", "Egyptian sandals, many examples", "A", "stitched welt sole"),
            ("feet", "mid", "Bearskin-soled shoes", "any", "warm, quiet shoe", "bearskin, deer hide", "rounded gathered shoe", "Oetzi", "A", "heels"),
            ("amulet", "outer", "Gold crescent collar", "endurance, guard", "high-status neck ornament", "sheet gold", "flat crescent", "Irish gold lunulae, c. 2400-2000 BC", "A", "gorget presented as amulet"),
            ("amulet", "core", "Boar tusk pendant", "any", "hunter's and fighter's token", "boar tusk, cord", "curved tusk on a cord", "tusk pendants, Neolithic and Corded Ware graves", "A", "gem-set fang"),
            ("ring", "core", "Plain copper band", "any", "plain ring", "cast copper", "plain band", "common", "A", "knuckle-duster ring"),
            ("ring", "mid", "Bronze spiral ring", "any", "plain ring", "bronze wire", "small coil", "Unetice, Wessex", "A", "faceted gem"),
        ],
        "avoid": ["double-bitted 'dwarf' axes", "spiked morning stars", "great helms and fantasy (Viking-style) horned helmets; the attested Veksø-type horned helmet stays STR/INT outer only", "muscle cuirasses", "rivets everywhere"],
        "open": [
            "Default, owner may veto (2026-11-07): the war horn goes in the War Horn slot, not the off hand (horns and trumpets are attested: Tutankhamun's trumpets, lurs, animal horns).",
            "Default, owner may veto (2026-11-07): the Jawbone weapon is retired from new briefs (no period find; the Samson story is a later text). The existing game base and its Jawbone combo action are untouched.",
            "Dendra cuirass is one near-complete find; using it as a common base overstates it. Keep to the outer band.",
            "Banded stone maul needs a specific drilled-stone hammer find as its shape reference before briefing.",
        ],
    },
    {
        "id": "str_int",
        "label": "STR/INT",
        "angle": 30,
        "mix": "STR ~50 / INT ~50",
        "treeClass": "ring-7 STR/INT node: sets the STR/INT class",
        "classUnlocks": "banners, a war companion and a relic pack",
        "wedges": "companion and Ward wedge (INT toward STR/INT): companions, Ward, Mana; fire and ignite wedge (STR toward STR/INT): fire, ignite",
        "latticeRow": "damage type row (opened by the STR/INT class, a shield or a buckler)",
        "gameSkills": [
            "fireball", "fireball-volley", "meteor", "fire-wall", "Fire Damage Aura", "Armour Break Aura",
            "summoning-circle (companion)", "Resistance Bonus",
        ],
        "archetypes": "totem 51/6/43, banner 27/15/58, aura 34/33/33, barrier, elemental slam, summoning (game puts companions here, not in INT)",
        "role": "War-leader with insignia and the ritual standard-bearer: Narmer Palette standard-bearers (c. 3100 BC), Nahal Mishmar copper standards and maceheads (c. 4000 BC), Alaca Hoeyuek bronze standards (c. 2500-2000 BC), Fu Hao's bronze yue axes (c. 1200 BC), Bush Barrow mace and gold lozenge (c. 1900 BC).",
        "items": [
            ("main", "mid", "Copper sceptre mace", "fire spells, elemental slam", "insignia mace; authority and impact in one object", "cast copper head on a wooden or copper shaft", "long shaft, knobbed cast head", "Nahal Mishmar hoard, c. 4000 BC", "A", "glowing gem in the head"),
            ("main", "mid", "Fossil stone mace with bone mounts", "elemental slam, aura", "polished stone head; zigzag bone rings on the haft", "fossil stone, wooden haft, carved bone rings", "slim haft with banded rings and a smooth head", "Bush Barrow, c. 1900 BC (Wiltshire Museum)", "A", "stone ball in a cup"),
            ("main", "outer", "Bronze broad axe", "banner, conviction", "heavy ceremonial axe of military authority", "cast bronze, wooden haft", "wide flat blade with cast face motif", "Fu Hao's yue, Anyang, c. 1200 BC", "A", "pseudo-glyph inscriptions"),
            ("main", "core", "Wood rod", "fire spells", "the game's Wood Rod base (intent row); plain ritual rod", "straight hardwood", "short straight rod", "game base; rods common in Egyptian art", "Art", "forked stick"),
            ("off", "outer", "Bronze openwork disc standard", "banner, totem, aura", "pole-mounted emblem; the STR/INT class's banner unlock", "cast bronze disc with lattice, stag or bull figures, pole", "disc of lattice on a pole with animal figures", "Alaca Hoeyuek standards, c. 2500-2000 BC (mounting debated)", "A", "cloth banner with heraldry"),
            ("off", "core", "Carved emblem on a pole", "banner, totem", "plain standard", "wood, carved animal emblem", "pole with a small carved figure on top", "Narmer Palette standards, c. 3100 BC", "Art", "tabard; heraldic crest"),
            ("off", "mid", "Figure-of-eight shield", "barrier, ward", "large shield that is also a cult emblem", "oxhide on a wooden frame", "body-height shape pinched at the waist, dappled hide", "Minoan and Mycenaean, c. 1600-1400 BC", "Art", "heater shape"),
            ("off", "core", "Reed buckler", "barrier", "the game's Reed Buckler base (damage type row)", "woven reed on a frame", "small round shield", "game base; reed shields in taxonomy S-18 (check a find)", "U", "toy-like wicker look"),
            ("head", "outer", "Gold helmet shaped as hair", "auras, conviction", "leader's helmet", "hammered gold", "dome shaped as hair with a bun and ears", "Meskalamdug helmet, Ur, c. 2600 BC", "A", "crown with points"),
            ("head", "mid", "Bronze helmet with plume tube", "warcry with magic, ward", "helmet with a socket for a plume", "cast bronze", "rounded helmet with a small tube on top", "Anyang M1004", "A", "crest ridge"),
            ("head", "outer", "Bronze horned helmet", "banner, aura", "ceremonial horned helmet, Late Bronze Age; kept because the find is cited", "sheet bronze, bull horns, bird-of-prey face", "dome with two curved bull horns and a beaked face at the front", "Veksø helmets: two bronze helmets found 1942 in Brøns Mose bog near Veksø, Zealand; c. 900 BC (birch tar on a horn dated 2019); bog offerings, National Museum of Denmark (https://en.natmus.dk/historical-knowledge/denmark/prehistoric-period-until-1050-ad/the-bronze-age/the-viksoe-helmets/; https://en.wikipedia.org/wiki/Veks%C3%B8_Helmets)", "A", "fantasy horned helmet; any horned helmet outside STR/INT outer"),
            ("body", "outer", "Gold shoulder cape", "ward, auras", "ceremonial cape, not armour", "hammered sheet gold", "short cape over the shoulders with ribbed bands", "Mold cape, c. 1900-1600 BC", "A", "presenting it as armour"),
            ("body", "mid", "Leather scale corselet", "any", "protective body for the field leader", "rawhide scales on linen", "short scale cuirass", "Tutankhamun's cuirass", "Adapt", "chainmail"),
            ("body", "core", "Wool tunic with mantle", "any", "plain garment", "wool", "tunic with rectangular mantle", "Borum Eshoej, Muldbjerg", "A", "robe with sigils"),
            ("hands", "mid", "Gold armlets", "any", "status ornament; no protective form attested", "gold", "pair of plain cuffs", "Wessex-type gold armlets", "A", "gauntlets"),
            ("belt", "mid", "Leather belt with bronze disc", "relic pack, ward", "disc at the front holds the belt items", "leather, cast bronze disc", "belt with a round disc", "Egtved belt disc, c. 1370 BC", "Adapt", "plaque belt with sigils"),
            ("belt", "outer", "Leather belt with gold hook", "insignia", "hook for dagger and mace", "leather, gold belt hook", "belt with a small gold hook", "Bush Barrow belt hook", "A", "buckle"),
            ("feet", "outer", "Gilded sandals", "auras", "ceremonial footwear", "sheet gold over leather", "flat sandal with thongs", "Tutankhamun's gold sandals, c. 1325 BC", "A", "chunky modern sandal"),
            ("feet", "core", "Rawhide sandals", "any", "plain sandals", "rawhide", "flat sole, thongs", "Egyptian sandals", "A", "stitched welt sole"),
            ("amulet", "outer", "Gold lozenge", "auras, ward", "chest ornament of the leader", "sheet gold, incised lines", "flat lozenge", "Bush Barrow, c. 1900 BC", "A", "sun disc pendant (Nebra, Trundholm are cult objects)"),
            ("amulet", "mid", "Carnelian and lapis bead collar", "any", "status collar", "carnelian, lapis, gold spacers", "strung beads in rows", "Royal Cemetery of Ur", "A", "gorget presented as amulet"),
            ("ring", "outer", "Gold signet ring", "insignia, banner", "leader's seal", "gold, oval bezel with figures", "oval bezel larger than the hoop", "Mycenaean signet rings, c. 1500 BC", "A", "sigils on the bezel"),
            ("ring", "core", "Gold spiral ring", "any", "plain ring", "gold wire", "small coil", "Wessex, Unetice", "A", "glowing ring"),
        ],
        "avoid": ["Nebra disc or Trundholm sun shrunk into amulets", "cloth heraldic banners", "glowing gems on maces", "crowns with points"],
        "open": [
            "Totem as a planted pole: no evidence for planting a standard in battle; the Alaca standards may be cart fittings. The skill stays, the visual is an assumption.",
            "The pipeline's pack names are now plain (relic pack, supply pack, animal parts pack); see owner-rules/rename-map.json.",
            "Summoning: the game puts companions in the companion and Ward wedge (INT toward STR/INT), while the shared chat put summoning in pure INT. This doc follows the game.",
            "Reed buckler is a game base with no confirmed find; check before briefing new reed shields.",
        ],
    },
]

EXISTING_BASES = [
    ("Wooden Stick", "all (starter)", "core"),
    ("Flint Spear", "DEX (range row)", "mid"),
    ("Flint Shortsword", "DEX/STR", "core"),
    ("Bone Knife", "INT/DEX (effect row)", "mid"),
    ("Flint Hatchet", "DEX/STR (intent row)", "core"),
    ("Two-handed Flint Axe", "DEX/STR (Bleeding sweep)", "mid"),
    ("Wooden Cudgel", "STR", "core"),
    ("Root Club", "STR (two-handed maul)", "core"),
    ("Bone Claws (claw)", "DEX (kept as is; no new claw briefs)", "mid"),
    ("Jawbone", "STR (retired from new briefs: no period find)", "core"),
    ("Wood Wand", "INT/DEX (effect row)", "core"),
    ("Wood Rod", "STR/INT (intent row)", "core"),
    ("Wood Staff", "INT / STR (target row)", "core"),
    ("Reed Buckler", "STR/INT (damage type row)", "core"),
    ("Copper Leaf Dagger", "DEX/STR", "mid"),
    ("Bronze Leaf Sword", "DEX/STR", "mid"),
    ("Bronze Spiked Club", "STR (check 'spiked' against finds)", "mid"),
    ("Banded Stone Maul", "STR", "mid"),
    ("Copper / Bronze Leaf / Obsidian / Barbed Spears", "DEX", "mid-outer"),
]

OWNER_DEFAULTS = [
    "Horned helmet: kept only as the STR/INT outer 'Bronze horned helmet', with its cited find: the Veksø helmets, Brøns Mose, Zealand, c. 900 BC, National Museum of Denmark. STR and other zones ban fantasy (Viking-style) horned helmets.",
    "Prefix/suffix: adopted. 2 prefixes + 2 suffixes inside the game's 4-mod limit, plus one implicit on weapon, off-hand and jewellery bases (none on body, head, hands, feet, belt). Needs a code change in Itemization.cs to take effect.",
    "Added Fire: limited to fire-themed bases (STR/INT and the fire and ignite wedge), as mapped. This changes live drops once implemented; today the game rolls it on every weapon.",
    "Mines: buried stake traps and laid sling shot are the period answer (Bundle of sharpened stakes, Pouch of clay sling shot). No fire pots.",
    "Blink, phase and shadow: the disguise kit (animal skin hood, wolf skin cloak) is the visual answer.",
    "Claws: keep the existing Bone Claws base; brief no new claw items.",
    "Jawbone weapon: retired from new briefs (no period find). The game base and action stay as they are.",
    "Period weighting: core leans Neolithic/Chalcolithic common kit; mid is Early/Middle Bronze Age; outer is Late Bronze Age elite pieces. Regions stay mixed.",
    "War Horn: goes in the War Horn slot (unlocked by the STR class node), not the off hand.",
    "Proposed mod numbers: first-pass values kept, marked provisional (status 'proposed', provisional: true).",
]

GLOBAL_OPEN = [
    "No skill or item carries an attribute tag in the game code, and the owner ruled against a forced STR/DEX/INT class split (DESIGN-DIRECTION.md:432). Zone membership here is inferred from the tree's wedge themes, class nodes and the Weaving rows.",
    "The shared chat's 303-archetype source files could not be retrieved (sandbox links). Only its published sample placements are used; the game's own skills take precedence.",
    "Outer layer (cloak) slot exists in the game and pipeline but is not broken out per zone here; reuse the zone's body notes for mantles.",
    "Coined pipeline names were renamed on 2026-11-07; the before and after list is owner-rules/rename-map.json.",
    "Items marked U (unconfirmed) or with unverified precedents must not be briefed until checked; Disp items must disclose the dispute.",
]


def build_json() -> dict:
    zones = []
    for z in ZONES:
        items = []
        for slot, band, name, skills, why, mats, sil, prec, conf, avoid in z["items"]:
            items.append({
                "id": f"{z['id']}.{slot}.{name.lower().replace(' ', '-').replace("'", '')}",
                "slot": slot,
                "band": band,
                "name": name,
                "skills": [s.strip() for s in skills.split(",")],
                "why": why,
                "materials": mats,
                "silhouette": sil,
                "precedent": prec,
                "confidence": conf,
                "avoid": avoid,
                "briefable": conf in ("A", "Art", "Adapt", "Disp"),
            })
        zones.append({k: v for k, v in z.items() if k != "items"} | {"items": items})
    return {
        "schema": "wizard.item-types-by-skill-zone.v1",
        "version": VERSION,
        "doc": "docs/ITEM-TYPES-BY-SKILL-ZONE.md",
        "builder": "tools/rpg_inventory/core/build_item_types_by_skill_zone.py",
        "rule": "Item briefs and modpools come from this mapping (zone -> skills -> tools for the job -> mods for the job), never from 'stat combo + slot'.",
        "axes": {"INT": 90, "DEX": 210, "STR": 330},
        "bands": BANDS,
        "slots": [{"id": s, "label": l} for s, l in SLOTS],
        "confidence": CONFIDENCE,
        "globalAvoid": GLOBAL_AVOID,
        "existingBases": [{"name": n, "zone": z, "band": b} for n, z, b in EXISTING_BASES],
        "zones": zones,
        "ownerDefaults": {"note": "Default, owner may veto (2026-11-07, via Dispatch review)", "items": OWNER_DEFAULTS},
        "openQuestions": GLOBAL_OPEN,
    }


def md_escape(s: str) -> str:
    return s.replace("|", "/")


def build_md(data: dict) -> str:
    L = []
    a = L.append
    a("# Item types by skill zone")
    a("")
    a(f"Version {VERSION}. Generated by `tools/rpg_inventory/core/build_item_types_by_skill_zone.py`; edit the data there, not this file.")
    a("Machine-readable copy: `tools/rpg_inventory/core/item-types-by-skill-zone.json`. Visual: `tools/rpg_inventory/skill-zone-items.html` (PNG: `docs/visual/item-types-by-skill-zone.png`).")
    a("")
    a("## Why")
    a("")
    a("A brief like \"DEX/INT helmet\" asks the image model to invent a look for a stat pair, and it fills the gap with fantasy defaults. Instead, each zone of the passive tree is defined by the skills that live there; the item types are the tools a Bronze Age person doing those skills would carry and wear, each tied to a real find, depiction or text. If no evidence exists, the item is marked unconfirmed and not briefed (owner rule 51).")
    a("")
    a("## Owner defaults (default, owner may veto)")
    a("")
    a("Set 2026-11-07 from the Dispatch review. Each is a default the owner may veto; briefs and modpools follow them until then.")
    a("")
    for d in OWNER_DEFAULTS:
        a(f"- {d}")
    a("")
    a("## Ground truth used")
    a("")
    a("- Passive tree: `the ARPG/Assets/ARPG/Resources/Wizard/tree-data.js.txt` (generator `tools/geometric_skilltree/scripts/author-tree.mjs`). Ten rings, one Origin, six spokes at 60 degree steps: INT 90, INT/DEX 150, DEX 210, DEX/STR 270, STR 330, STR/INT 30. Class node at ring 7 of each spoke; six themed wedges between spokes.")
    a("- Skills: fixed actions in `Core/ActionPresentation.cs`, 49 spells in `Core/SpellRules.cs`. No skill or item carries an attribute tag; zone membership is inferred from wedge themes, class nodes and the stated Weaving rows (`Core/Weaving.cs:115-142`: wand or knife -> Focus, rod or axe -> Alignment, staff or two-hander -> Sphere, spear -> Reach, shield or buckler -> Element).")
    a("- Shared chat \"Compare PoE Skill Types\": 303 archetypes with INT/DEX/STR weights. Its files were not retrievable; its published sample placements are used as a secondary guide. Where the chat and the game disagree (summoning: chat INT, game: the companion and Ward wedge toward STR/INT), the game wins.")
    a("- Item pipeline: `tools/rpg_inventory/core/ANCIENT-EQUIPMENT-TAXONOMY.md` (A0-A2 rows only), `GENERATION-PLAN.md` and `EXPANSION-CORRECTIONS-2026-07-24.md` slop lists, owner rules 6-12 and 51.")
    a("")
    a("## Ring bands")
    a("")
    a("| Band | Rings | Meaning |")
    a("|---|---|---|")
    for k, v in BANDS.items():
        a(f"| {k} | {v['rings'][0]}-{v['rings'][1]} | {v['meaning']} |")
    a("")
    a("Confidence codes: " + "; ".join(f"**{k}** {v}" for k, v in CONFIDENCE.items()) + ".")
    a("")
    a("## Zones")
    for z in data["zones"]:
        a("")
        a(f"### {z['label']} ({z['angle']} degrees)")
        a("")
        a(f"- **Tree:** {z['treeClass']}; unlocks {z['classUnlocks']}. Wedges: {z['wedges']}. Weaving: {z['latticeRow']}.")
        a(f"- **Game skills here (inferred zone):** {', '.join(z['gameSkills'])}.")
        a(f"- **Archetypes (chat INT/DEX/STR):** {z['archetypes']}.")
        a(f"- **Who does this in the period:** {z['role']}")
        by_band = {b: [i['name'] for i in z['items'] if i['band'] == b] for b in BANDS}
        for b, names in by_band.items():
            a(f"- **{b.capitalize()} kit:** {', '.join(names)}.")
        a(f"- **Do not make in this zone:** {'; '.join(z['avoid'])}.")
        a("- **Open questions:**")
        for q in z["open"]:
            a(f"  - {q}")
    a("")
    a("## Item types by slot")
    a("")
    a("Columns: item (plain name), zone and band, skills served and why, materials, silhouette and reading at icon size, precedent and confidence, do not make.")
    for sid, label in SLOTS:
        a("")
        a(f"### {label}")
        a("")
        a("| Item | Zone / band | Serves | Materials | Silhouette | Precedent | Conf | Do not make |")
        a("|---|---|---|---|---|---|---|---|")
        for z in data["zones"]:
            for i in z["items"]:
                if i["slot"] != sid:
                    continue
                serves = f"{', '.join(i['skills'])}: {i['why']}"
                a("| " + " | ".join(md_escape(x) for x in [
                    i["name"], f"{z['label']} / {i['band']}", serves, i["materials"], i["silhouette"],
                    i["precedent"], i["confidence"], i["avoid"]]) + " |")
    a("")
    L.extend(item_modpools.md(data, md_escape))
    a("")
    a("## Do not make (all zones)")
    a("")
    for s in GLOBAL_AVOID:
        a(f"- {s}")
    a("")
    a("## Existing game bases placed by zone")
    a("")
    a("| Base (`Core/Itemization.cs`) | Zone | Band |")
    a("|---|---|---|")
    for n, z, b in EXISTING_BASES:
        a(f"| {n} | {z} | {b} |")
    a("")
    a("## How the pipeline uses this")
    a("")
    a("1. Pick a zone and band (not a stat pair). The zone's skills say what the character does.")
    a("2. Take the slot items for that zone and band from the JSON; skip any with `briefable: false`.")
    a("3. The brief names the item, its construction, silhouette and precedent, and quotes the item's `avoid` plus `globalAvoid`. Supply a shape reference (artefact image) where the noun's usual picture is wrong (rule 51).")
    a("4. A coherent loadout call (RUNBOOK addendum) uses one faction + zone + band in place of faction + axis + tier.")
    a("5. Mods for a base come from its `modpool`; never add a mod to a base whose skills it does not serve.")
    a("")
    a("## Open questions (global)")
    a("")
    for q in GLOBAL_OPEN:
        a(f"- {q}")
    a("")
    a("Defaults chosen without asking (task ran autonomously): zone membership inferred as above; the game's placement wins over the chat; bands are rings 1-2 / 3-6 / 7-10; disputed items are kept but flagged; unconfirmed items are listed but not briefable.")
    a("")
    return "\n".join(L)


def main() -> None:
    data = item_modpools.attach(build_json())
    JSON_OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    MD_OUT.write_text(build_md(data))
    n = sum(len(z["items"]) for z in data["zones"])
    print(f"wrote {JSON_OUT.relative_to(ROOT)} and {MD_OUT.relative_to(ROOT)}: {len(data['zones'])} zones, {n} item types")


if __name__ == "__main__":
    main()
