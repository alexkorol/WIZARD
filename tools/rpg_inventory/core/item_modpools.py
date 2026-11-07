"""Modpools for the skill-zone item bases.

Imported by build_item_types_by_skill_zone.py. A base rolls the mods that
support the job its zone's skills do, plus a small shared pool of generic
defences and attributes.

Ground truth: the ARPG's live modifier table and combat stat consumers
  Assets/ARPG/Scripts/Core/Itemization.cs:115-128  (9 mods, tiers, weights,
      TierWeights 10/5/2, MaxModifiers 4, weapon/armour flags only)
  Assets/ARPG/Scripts/Core/WizardCombat.cs          (stat ids read in combat)
Status per mod:
  live      - in the game's roll pool today (values copied, do not change here)
  consumer  - combat already reads the stat id; the mod only needs adding to the pool
  proposed  - needs a new combat consumer (system not built yet); design only
"""
from __future__ import annotations

# ---------------------------------------------------------------------------
# Slot categories (what kind of object a base is, for mod eligibility)
# weapon | caster (wand/rod/staff in main hand) | shield | quiver | tool (held
# off-hand object: net, palette, drum, standard, horn) | offweapon (dagger)
# head | body | hands | feet | belt | amulet | ring
# ---------------------------------------------------------------------------

ARMOUR = ["head", "body", "hands", "feet"]
JEWEL = ["amulet", "ring"]
WEAPONS = ["weapon", "offweapon"]

# Mod tuple: id, label, kind (P/S), stat, status, categories, tags (any-of; [] = shared), tiers [(ilvl,min,max)], weight, note
MODS = [
    # --- live (Itemization.cs) -------------------------------------------------
    ("keen", "+{v}% increased Physical Damage", "P", "physical_increased", "live", WEAPONS, ["physical"], [(1, 8, 14), (20, 15, 22), (50, 23, 32)], 12, ""),
    ("heavy", "Adds {v} Physical Damage", "P", "added_physical", "live", WEAPONS, ["physical"], [(1, 2, 4), (25, 5, 8), (55, 9, 14)], 12, ""),
    ("added-fire", "Adds {v} Fire Damage", "P", "added_fire", "live", WEAPONS, ["fire"], [(1, 3, 7), (30, 8, 14), (60, 15, 22)], 6, "attack fire; game rolls it on every weapon today"),
    ("swift_haft", "+{v}% Attack Speed", "S", "attack_speed_increased", "live", WEAPONS + ["hands"], ["fast"], [(1, 5, 8), (25, 9, 13), (55, 14, 18)], 9, "hands is an extension (game: weapons only)"),
    ("long_reach", "+{v}% increased Reach", "S", "reach_increased", "live", ["weapon"], ["reach"], [(1, 6, 10), (30, 11, 16)], 7, ""),
    ("hale", "+{v} Maximum Life", "P", "life_flat", "live", ARMOUR + ["belt", "shield", "amulet", "ring", "weapon"], [], [(1, 10, 20), (25, 21, 35), (55, 36, 55)], 12, "shared; game rolls it on weapons too"),
    ("spirited", "+{v} Maximum Spirit", "P", "spirit_flat", "live", ["caster", "tool", "weapon", "amulet", "ring", "head"], ["spell", "channel", "aura", "warcry", "companion"], [(1, 8, 15), (25, 16, 26), (55, 27, 40)], 10, "Spirit pays for every action; kept to bases that spend heavily"),
    ("warded", "{v}% faster Ward recharge", "S", "ward_increased", "live", ARMOUR + ["shield", "tool", "amulet"], ["ward"], [(1, 10, 18), (20, 19, 28), (50, 29, 40)], 12, ""),
    ("fire-resistance", "+{v}% Fire Resistance", "S", "fire_resistance", "live", ARMOUR + ["belt", "shield", "amulet", "ring"], [], [(1, 8, 15), (25, 16, 25)], 8, "shared"),
    # --- consumer exists in WizardCombat.cs, not yet in the pool -------------
    ("cold-resistance", "+{v}% Cold Resistance", "S", "cold_resistance", "consumer", ARMOUR + ["belt", "shield", "amulet", "ring"], [], [(1, 8, 15), (25, 16, 25)], 8, "shared"),
    ("lightning-resistance", "+{v}% Lightning Resistance", "S", "lightning_resistance", "consumer", ARMOUR + ["belt", "shield", "amulet", "ring"], [], [(1, 8, 15), (25, 16, 25)], 8, "shared"),
    ("chaos-resistance", "+{v}% Chaos Resistance", "S", "chaos_resistance", "consumer", ARMOUR + ["belt", "amulet", "ring"], [], [(15, 5, 10), (45, 11, 17)], 4, "shared, rarer"),
    ("all-resistance", "+{v}% to all Resistances", "S", "all_resistance", "consumer", JEWEL, [], [(20, 4, 7), (50, 8, 12)], 3, "shared, jewellery only"),
    ("max-resistance", "+{v}% to maximum Resistances", "S", "max_resistance", "consumer", ["body", "shield"], ["endurance"], [(55, 1, 2)], 2, "outer bases only"),
    ("guard-flat", "+{v} Guard", "P", "guard_flat", "consumer", ARMOUR + ["shield", "belt"], ["guard"], [(1, 8, 16), (25, 17, 32), (55, 33, 55)], 12, "STR defence"),
    ("guard-increased", "+{v}% increased Guard", "P", "guard_increased", "consumer", ARMOUR + ["shield"], ["guard"], [(1, 10, 18), (25, 19, 30), (55, 31, 45)], 10, ""),
    ("evasion-flat", "+{v} Evasion", "P", "evasion_flat", "consumer", ARMOUR + ["belt"], ["evasion"], [(1, 10, 20), (25, 21, 40), (55, 41, 65)], 12, "DEX defence"),
    ("evasion-increased", "+{v}% increased Evasion", "P", "evasion_increased", "consumer", ARMOUR, ["evasion"], [(1, 10, 18), (25, 19, 30), (55, 31, 45)], 10, ""),
    ("block", "+{v}% Chance to Block", "S", "block_chance_flat", "consumer", ["shield", "offweapon"], ["block"], [(1, 2, 4), (30, 5, 7), (55, 8, 10)], 8, ""),
    ("accuracy", "+{v} Accuracy", "S", "accuracy_flat", "consumer", WEAPONS + ["quiver", "hands", "head", "ring", "amulet"], ["precision", "projectile"], [(1, 20, 50), (25, 51, 110), (55, 111, 180)], 10, ""),
    ("crit-chance", "+{v}% Critical Chance", "S", "crit_chance_flat", "consumer", WEAPONS + ["caster", "amulet", "ring"], ["precision"], [(1, 1, 2), (30, 3, 4), (55, 5, 6)], 8, "flat percent points"),
    ("crit-bonus", "+{v}% Critical Bonus", "S", "crit_bonus_flat", "consumer", WEAPONS + ["amulet"], ["precision"], [(15, 8, 14), (45, 15, 25)], 6, ""),
    ("projectile-damage", "+{v}% increased Projectile Damage", "P", "projectile_increased", "consumer", ["weapon", "quiver", "amulet", "belt"], ["projectile"], [(1, 8, 14), (25, 15, 24), (55, 25, 35)], 12, ""),
    ("attack-damage", "+{v}% increased Attack Damage", "P", "attack_increased", "consumer", WEAPONS + ["ring", "amulet", "hands"], ["attack"], [(1, 6, 10), (25, 11, 17), (55, 18, 25)], 8, ""),
    ("rite-damage", "+{v}% increased Spell Damage", "P", "rite_increased", "consumer", ["caster", "tool", "amulet", "ring", "head"], ["spell"], [(1, 10, 16), (25, 17, 28), (55, 29, 40)], 12, ""),
    ("rite-speed", "+{v}% Cast Speed", "S", "rite_speed_increased", "consumer", ["caster", "tool", "ring", "hands"], ["spell"], [(1, 4, 7), (25, 8, 12), (55, 13, 17)], 9, ""),
    ("elemental-damage", "+{v}% increased Elemental Damage", "P", "elemental_increased", "consumer", ["caster", "tool", "weapon", "amulet", "ring"], ["cold", "fire", "lightning", "elemental"], [(1, 8, 14), (25, 15, 24), (55, 25, 34)], 8, ""),
    ("ailment-effect", "+{v}% increased Ailment Effect", "S", "ailment_effect", "consumer", WEAPONS + ["caster", "tool", "amulet", "hands"], ["ailment", "poison", "bleed", "curse", "cold"], [(1, 8, 14), (30, 15, 24), (55, 25, 32)], 9, "covers bleed, poison, chill, ignite"),
    ("cooldown", "+{v}% Cooldown Recovery", "S", "cooldown_recovery", "consumer", ["belt", "amulet", "head", "tool"], ["warcry", "cooldown", "movement"], [(15, 5, 9), (45, 10, 15)], 6, ""),
    ("move-speed", "+{v}% Movement Speed", "S", "move_speed", "consumer", ["feet"], ["movement"], [(1, 5, 9), (25, 10, 15), (55, 16, 22)], 12, "feet only; values are caps against rule 3 (no sped-up feel)"),
    ("life-regen", "Regenerate {v} Life per second", "S", "life_regen_flat", "consumer", ARMOUR + ["belt", "amulet", "ring"], ["endurance", "healing"], [(1, 1, 3), (25, 4, 7), (55, 8, 12)], 8, ""),
    ("life-regen-percent", "Regenerate {v}% of Life per second", "S", "life_regen_percent", "consumer", ["body", "belt"], ["endurance"], [(30, 0.4, 0.8), (55, 0.9, 1.5)], 4, "outer bases"),
    ("flask-recovery", "+{v}% increased Flask Recovery", "S", "flask_recovery_increased", "consumer", ["belt"], ["healing", "flask"], [(1, 8, 14), (30, 15, 25)], 8, "belt is the flask slot (PoE convention)"),
    ("flask-charges", "+{v}% increased Flask Charges gained", "S", "flask_charges_gained_increased", "consumer", ["belt"], ["healing", "flask"], [(1, 10, 18), (30, 19, 30)], 6, ""),
    ("flask-capacity", "+{v}% increased Flask Charge capacity", "S", "flask_charges_max_increased", "consumer", ["belt"], ["healing", "flask"], [(15, 10, 20), (45, 21, 35)], 4, ""),
    # --- proposed: needs a new combat consumer ---------------------------------
    ("strength", "+{v} to Strength", "S", "strength_flat", "proposed", ARMOUR + JEWEL + ["belt", "weapon", "shield"], ["str"], [(1, 3, 6), (25, 7, 12), (55, 13, 18)], 8, "shared; attributes only on the zone's own axes. Equipment attributes are not read today."),
    ("dexterity", "+{v} to Dexterity", "S", "dexterity_flat", "proposed", ARMOUR + JEWEL + ["belt", "weapon", "quiver"], ["dex"], [(1, 3, 6), (25, 7, 12), (55, 13, 18)], 8, "shared"),
    ("intelligence", "+{v} to Intelligence", "S", "intelligence_flat", "proposed", ARMOUR + JEWEL + ["belt", "caster", "tool"], ["int"], [(1, 3, 6), (25, 7, 12), (55, 13, 18)], 8, "shared"),
    ("curse-effect", "+{v}% increased Curse Effect", "P", "curse_effect", "proposed", ["caster", "tool", "head", "amulet"], ["curse"], [(1, 5, 9), (30, 10, 15), (55, 16, 20)], 10, ""),
    ("mark-effect", "+{v}% increased Mark Effect", "P", "mark_effect", "proposed", ["tool", "caster", "amulet", "hands"], ["mark"], [(1, 8, 14), (30, 15, 24)], 10, "marks exist only as a tree theme"),
    ("trap-damage", "+{v}% increased Trap Damage", "P", "trap_increased", "proposed", ["tool", "belt", "offweapon"], ["trap"], [(1, 10, 16), (25, 17, 26), (55, 27, 38)], 12, "no trap skill in the game yet"),
    ("trap-arming", "+{v}% Trap Arming Speed", "S", "trap_speed_increased", "proposed", ["tool", "belt", "hands", "feet"], ["trap"], [(1, 6, 10), (30, 11, 18)], 10, ""),
    ("trap-count", "+{v} to maximum Traps", "S", "trap_max_flat", "proposed", ["tool", "belt"], ["trap"], [(45, 1, 1)], 3, "outer bases only"),
    ("poison-chance", "+{v}% chance to Poison on Hit", "S", "poison_chance", "proposed", WEAPONS + ["tool", "hands"], ["poison"], [(1, 8, 14), (30, 15, 25)], 10, "game has Poisoned status but no chance stat"),
    ("bleed-chance", "+{v}% chance to cause Bleeding", "S", "bleed_chance", "proposed", WEAPONS + ["hands"], ["bleed"], [(1, 8, 14), (30, 15, 25)], 10, ""),
    ("ignite-chance", "+{v}% chance to Ignite", "S", "ignite_chance", "proposed", ["weapon", "caster", "tool"], ["fire"], [(1, 6, 10), (30, 11, 18)], 8, "fire and ignite wedge"),
    ("chill-effect", "+{v}% increased Chill Effect", "S", "chill_effect", "proposed", ["caster", "tool", "amulet"], ["cold"], [(1, 8, 14), (30, 15, 24)], 8, "cold and marks wedge"),
    ("stun", "+{v}% increased Stun Buildup", "S", "stun_increased", "proposed", ["weapon", "shield"], ["stun"], [(1, 10, 18), (30, 19, 30), (55, 31, 40)], 10, "Ground slam staggers today; no stat scales it"),
    ("area", "+{v}% increased Area of Effect", "S", "area_increased", "proposed", ["weapon", "caster", "tool", "amulet"], ["area"], [(1, 6, 10), (30, 11, 16), (55, 17, 22)], 9, "slams, sweeps, novas"),
    ("warcry-effect", "+{v}% increased War Cry Effect", "P", "warcry_effect", "proposed", ["tool", "head", "body", "amulet"], ["warcry"], [(1, 8, 14), (30, 15, 24)], 10, "War cry bonus is a constant today (ActionRules.WarCryDamageBonus)"),
    ("aura-effect", "+{v}% increased Aura Effect", "P", "aura_effect", "proposed", ["tool", "caster", "head", "body", "amulet"], ["aura", "banner"], [(1, 5, 8), (30, 9, 13), (55, 14, 18)], 10, ""),
    ("companion-damage", "Companions deal {v}% increased Damage", "P", "companion_increased", "proposed", ["tool", "caster", "head", "amulet", "ring"], ["companion"], [(1, 10, 16), (25, 17, 26), (55, 27, 38)], 12, "STR/INT class war companion; summoning-circle"),
    ("companion-life", "Companions have {v}% increased Life", "S", "companion_life_increased", "proposed", ["tool", "body", "amulet", "belt"], ["companion"], [(1, 10, 16), (30, 17, 26)], 10, ""),
    ("channel-cost", "{v}% reduced Spirit cost of channelled spells", "S", "channel_cost_reduced", "proposed", ["caster", "tool", "body"], ["channel"], [(1, 4, 7), (30, 8, 12)], 8, ""),
    ("thrown-damage", "+{v}% increased Thrown Weapon Damage", "P", "thrown_increased", "proposed", ["weapon", "quiver", "belt"], ["thrown"], [(1, 10, 16), (25, 17, 26), (55, 27, 38)], 10, "the DEX/STR class unlock makes thrown weapons melee and projectile"),
    ("dodge-roll", "+{v}% Dodge Roll distance", "S", "dodge_distance_increased", "proposed", ["feet", "body"], ["evasion"], [(15, 5, 8), (45, 9, 12)], 6, "rule 36: dodge stays an active roll"),
    ("thorns", "Reflects {v} Physical Damage to attackers", "S", "thorns_flat", "proposed", ["body", "shield"], ["thorns"], [(1, 4, 8), (30, 9, 18)], 5, "thorns aura exists"),
    ("life-leech", "{v}% of Physical Attack Damage leeched as Life", "S", "life_leech", "proposed", ["weapon", "ring"], ["melee_sustain"], [(30, 0.3, 0.6), (55, 0.7, 1.0)], 4, "melee sustain only; never on trap, spell or ranged bases"),
]

# Zone tags: every base in the zone gets these as secondary tags (weight x0.7)
ZONE_TAGS = {
    "int": ["spell", "ward", "cold", "curse", "int"],
    "int_dex": ["poison", "ailment", "curse", "mark", "trap", "int", "dex"],
    "dex": ["projectile", "evasion", "precision", "dex"],
    "dex_str": ["attack", "physical", "bleed", "fast", "dex", "str"],
    "str": ["attack", "physical", "guard", "thorns", "str"],
    "str_int": ["fire", "aura", "companion", "ward", "str", "int"],
}

# Skill phrase -> primary tags (job tags, full weight)
SKILL_TAGS = [
    ("spell bolt", ["spell"]), ("spells", ["spell"]), ("fire spells", ["spell", "fire"]),
    ("lightning", ["spell", "lightning"]), ("chaos", ["spell", "poison"]), ("channel", ["channel", "spell"]),
    ("curse", ["curse"]), ("prophecy", ["curse"]), ("ward", ["ward"]), ("nova", ["spell", "area"]),
    ("summon", ["companion"]), ("companion", ["companion"]), ("aura", ["aura"]), ("conviction", ["aura"]),
    ("mark", ["mark", "precision"]), ("poison", ["poison", "ailment"]), ("venom", ["poison"]),
    ("trap", ["trap"]), ("mine", ["trap", "area"]), ("preparations", ["trap", "flask"]), ("precision", ["precision"]),
    ("stealth", ["evasion"]), ("blink", ["evasion", "movement"]), ("phase", ["evasion"]),
    ("shadow clone", ["evasion"]), ("fire", ["fire"]), ("evasion", ["evasion"]), ("dash", ["movement", "evasion"]),
    ("leaps", ["movement", "evasion"]), ("agility", ["movement", "evasion"]), ("movement", ["movement"]),
    ("bow shot", ["projectile", "precision", "attack"]), ("arrow-volley", ["projectile", "attack"]),
    ("ranged precision", ["projectile", "precision", "attack"]), ("archer", ["projectile", "precision"]),
    ("hunting", ["projectile", "evasion"]), ("thrown", ["thrown", "projectile", "attack"]),
    ("javelin", ["thrown", "projectile", "attack"]), ("lobbed", ["projectile", "area"]),
    ("fast attacks", ["attack", "fast"]), ("fast strikes", ["attack", "fast", "precision"]),
    ("combos", ["attack", "fast"]), ("strikes", ["attack", "physical"]), ("thrust", ["attack", "precision", "reach"]),
    ("lunge", ["attack", "reach"]), ("sweep", ["attack", "area", "bleed", "melee_sustain"]),
    ("reaping sweep", ["attack", "area", "bleed"]), ("bleed", ["bleed"]), ("parries", ["block"]),
    ("heavy attacks", ["attack", "physical", "stun", "melee_sustain"]), ("slam", ["attack", "area", "stun", "physical"]),
    ("ground impact", ["area", "stun"]), ("stun", ["stun"]), ("guard", ["guard"]), ("shield line", ["guard", "block"]),
    ("endurance", ["endurance", "guard"]), ("charge", ["movement", "stun"]), ("war cry", ["warcry"]),
    ("warcry", ["warcry"]), ("banner", ["banner", "aura"]), ("totem", ["banner", "aura"]), ("barrier", ["block", "ward"]),
    ("elemental slam", ["attack", "elemental", "area"]), ("magic impact", ["attack", "elemental"]),
    ("insignia", ["aura"]), ("duelist", ["attack", "precision"]), ("combat merit", ["attack"]),
    ("healer kit", ["healing", "flask"]), ("repair", ["healing"]), ("relic pack", ["ward", "aura"]),
    ("belt charm", ["attack", "thrown"]), ("second blade", ["attack", "fast"]), ("desert archer", ["projectile"]),
    ("chariot archer", ["projectile", "guard"]), ("composite bow", ["projectile"]),
]

# Material keyword -> defence / flavour tags (armour defence follows material)
MATERIAL_TAGS = [
    ("bronze", ["guard"]), ("copper", ["guard"]), ("gold", ["ward"]), ("tusk", ["guard"]), ("scale", ["guard", "evasion"]),
    ("hide", ["evasion"]), ("leather", ["evasion"]), ("bearskin", ["evasion"]), ("fur", ["evasion"]), ("pelt", ["evasion"]),
    ("wolf", ["evasion"]), ("grass", ["evasion"]), ("esparto", ["evasion"]), ("rush", ["evasion"]),
    ("linen", ["ward"]), ("wool", ["ward"]), ("felt", ["ward"]), ("faience", ["ward"]), ("ivory", ["ward"]),
    ("bone point", ["ward"]), ("oxhide", ["guard", "block"]), ("cowhide", ["guard", "block"]),
]

# Implicits by item name keyword (first match wins). Implicits use the same mod ids; values are fixed per base.
IMPLICITS = [
    ("tower shield", [("block", 6), ("guard-flat", 20)]), ("shield", [("block", 4)]), ("buckler", [("block", 3)]),
    ("rapier", [("crit-chance", 2)]), ("sickle sword", [("bleed-chance", 10)]), ("leaf sword", [("attack-damage", 6)]),
    ("dagger", [("crit-chance", 2)]), ("knife", [("crit-chance", 2)]), ("spear", [("long_reach", 8)]),
    ("javelin", [("thrown-damage", 10)]), ("hatchet", [("thrown-damage", 8)]), ("throwing stick", [("thrown-damage", 10)]),
    ("sling", [("stun", 10)]), ("self bow", [("accuracy", 40)]), ("composite bow", [("projectile-damage", 10)]),
    ("battle axe", [("stun", 12)]), ("macehead", [("stun", 15)]), ("maul", [("area", 8)]), ("sceptre mace", [("elemental-damage", 8)]),
    ("fossil stone mace", [("aura-effect", 5)]), ("broad axe", [("aura-effect", 5)]), ("shaft-hole axe", [("bleed-chance", 8)]),
    ("copper axe", [("bleed-chance", 8)]), ("copper sword", [("keen", 8)]),
    ("serpent wand", [("rite-damage", 10)]), ("curved wand", [("curse-effect", 6)]), ("staff", [("spirited", 12)]), ("wood rod", [("ignite-chance", 6)]),
    ("liver model", [("curse-effect", 6)]), ("sistrum", [("aura-effect", 6)]), ("drum", [("channel-cost", 5)]),
    ("fowling net", [("trap-arming", 8)]), ("poison container", [("poison-chance", 10)]), ("palette", [("mark-effect", 8)]),
    ("disc standard", [("aura-effect", 8)]), ("emblem on a pole", [("aura-effect", 5)]), ("animal horn", [("warcry-effect", 10)]),
    ("quiver", [("projectile-damage", 6)]), ("bow case", [("accuracy", 30)]),
    ("thumb ring", [("accuracy", 40)]), ("signet", [("aura-effect", 4)]), ("seal", [("warded", 8)]),
    ("eye amulet", [("accuracy", 25)]), ("tooth pendant", [("hale", 10)]), ("tusk pendant", [("hale", 10)]),
    ("crescent collar", [("guard-increased", 8)]), ("lozenge", [("aura-effect", 6)]), ("ochre crayon", [("mark-effect", 6)]),
    ("cylinder seal", [("curse-effect", 4)]), ("fly pendant", [("attack-damage", 6)]), ("bead", [("fire-resistance", 6)]),
    ("spiral ring", [("hale", 8)]), ("wire ring", [("hale", 8)]), ("copper band", [("hale", 8)]),
    ("charm bag", [("curse-effect", 4)]), ("belt pouch", [("trap-arming", 6)]), ("with pouch", [("flask-recovery", 8)]),
    ("esparto grass bag", [("trap-damage", 8)]), ("belt box", [("flask-charges", 10)]), ("bronze disc", [("companion-life", 8)]),
    ("dagger ", []),
]

BAND_ILVL = {"core": 1, "mid": 15, "outer": 45}
MOD_INDEX = {m[0]: m for m in MODS}


def category(item: dict) -> str:
    n, s = item["name"].lower(), item["slot"]
    if s == "warhorn":
        return "tool"
    if s == "main":
        if any(k in n for k in ("wand", "staff", "rod")):
            return "caster"
        return "weapon"
    if s == "off":
        if "shield" in n or "buckler" in n:
            return "shield"
        if "quiver" in n or "bow case" in n:
            return "quiver"
        if "dagger" in n:
            return "offweapon"
        return "tool"
    return s


def tags_for(item: dict, zone_id: str) -> tuple[set, set, set]:
    text = (" ".join(item["skills"]) + " " + item["name"]).lower()
    job = set()
    for phrase, tags in SKILL_TAGS:
        if phrase in text:
            job.update(tags)
    # Main material only: the earliest keyword in the name, else in the materials list
    # ("bronze plates, leather ties" -> bronze, not leather).
    mat = set()
    for src in (item["name"].lower(), item["materials"].lower()):
        hits = sorted((src.find(kw), kw, tags) for kw, tags in MATERIAL_TAGS if kw in src)
        if hits:
            mat.update(hits[0][2])
            break
    zone = set(ZONE_TAGS[zone_id])
    return job, mat - job, zone - job - mat


def implicit_for(item: dict) -> list:
    n = item["name"].lower()
    for kw, imps in IMPLICITS:
        if kw in n:
            out = []
            for mid, v in imps:
                m = MOD_INDEX[mid]
                out.append({"mod": mid, "value": v, "label": m[1].replace("{v}", str(v)), "status": m[4]})
            return out
    return []


def build_pool(item: dict, zone_id: str) -> dict:
    cat = category(item)
    primary, material, secondary = tags_for(item, zone_id)
    attrs = {t for t in ZONE_TAGS[zone_id] if t in ("str", "dex", "int")}
    ilvl = BAND_ILVL[item["band"]]
    pool, excluded = [], []
    for mid, label, kind, stat, status, cats, mtags, tiers, weight, note in MODS:
        if cat not in cats:
            continue
        mt = set(mtags)
        if mt & {"str", "dex", "int"}:
            hit = "shared" if mt & attrs else None
        elif not mt:
            hit = "shared"
        elif mt & primary:
            hit = "job"
        elif mt & material:
            hit = "material"
        elif cat == "belt" and mt & {"flask"}:
            hit = "shared"
        elif mt & secondary:
            hit = "zone"
        else:
            hit = None
        if hit is None:
            excluded.append({"mod": mid, "needs": sorted(mt)})
            continue
        w = weight if hit in ("job", "material") else round(weight * 0.6) if hit == "zone" else round(weight * 0.5)
        pool.append({
            "mod": mid, "kind": kind, "role": hit, "weight": max(1, w), "status": status,
            "tiersFromIlvl": [t[0] for t in tiers if t[0] >= 0],
        })
    job = [p for p in pool if p["role"] in ("job", "zone")]
    mat_mods = [p for p in pool if p["role"] == "material"]
    live_job = [p for p in job + (mat_mods if cat in ARMOUR + JEWEL + ["belt"] else []) if p["status"] in ("live", "consumer")]
    flags = []
    if cat in ARMOUR + JEWEL + ["belt"]:
        # Armour's job includes defence: material defences count, but at least one skill or zone mod is required.
        if len(job) + len(mat_mods) < 3 or not job:
            flags.append("thin: needs a skill-linked mod (only shared and material defences)" if not job else "thin: fewer than 3 job, zone or material mods")
    elif len(job) < 3:
        flags.append("thin: fewer than 3 job mods")
    if not live_job:
        flags.append("no live job mod: every job mod needs a new combat consumer")
    pre = sum(1 for p in pool if p["kind"] == "P")
    suf = len(pool) - pre
    if pre == 0 or suf == 0:
        flags.append(f"one-sided pool ({pre} prefixes, {suf} suffixes)")
    return {
        "category": cat,
        "tags": {"job": sorted(primary), "material": sorted(material), "zone": sorted(secondary)},
        "implicit": implicit_for(item),
        "minItemLevel": ilvl,
        "pool": pool,
        "excluded": excluded,
        "flags": flags,
    }


def attach(data: dict) -> dict:
    rolled = {}
    for z in data["zones"]:
        for it in z["items"]:
            it["modpool"] = build_pool(it, z["id"])
            for p in it["modpool"]["pool"]:
                rolled.setdefault(p["mod"], []).append(it["id"])
            for imp in it["modpool"]["implicit"]:
                rolled.setdefault(imp["mod"] + " (implicit only)", [])
    data["mods"] = [{
        "id": m[0], "label": m[1], "kind": m[2], "stat": m[3], "status": m[4], "categories": m[5], "tags": m[6],
        "tiers": [{"tier": i + 1, "ilvl": t[0], "min": t[1], "max": t[2]} for i, t in enumerate(m[7])],
        "weight": m[8], "note": m[9], "rolledBy": len(rolled.get(m[0], [])), "provisional": m[4] == "proposed",
    } for m in MODS]
    implicit_mods = {imp["mod"] for z in data["zones"] for it in z["items"] for imp in it["modpool"]["implicit"]}
    data["modpoolReport"] = {
        "unrollable": [m[0] for m in MODS if not rolled.get(m[0])],
        "implicitOnly": sorted(m for m in implicit_mods if not rolled.get(m)),
        "thinBases": [{"id": it["id"], "name": it["name"], "zone": z["label"], "flags": it["modpool"]["flags"]}
                      for z in data["zones"] for it in z["items"] if it["modpool"]["flags"]],
    }
    data["modpoolRules"] = MODPOOL_RULES
    return data


MODPOOL_RULES = {
    "source": "Assets/ARPG/Scripts/Core/Itemization.cs:115-128 (live pool) and WizardCombat.cs (stat consumers). Live values are copied, never changed here.",
    "jobRule": "A base rolls mods whose tags match the skills it serves (job, full weight), defence mods its material implies (material, full weight: metal and tusk -> Guard; hide, leather, fur, grass -> Evasion; linen, wool, felt, gold, ivory, faience -> Ward, after the PoE cloth convention), and its zone's themes (zone, 0.6 weight), plus a small shared pool (life, resistances, the zone's own attributes, and flask mods on belts; 0.5 weight). Everything else is excluded with a reason.",
    "affixCap": "Default, owner may veto: 2 prefixes + 2 suffixes, inside the game's MaxModifiers 4. The game has no prefix/suffix split yet (code change needed).",
    "tiers": "Tiers unlock by item level as in the game (typically ilvl 1 / 20-30 / 50-60); tier pick weights 10/5/2 (Itemization.TierWeights). A base's band sets its minimum item level: core 1, mid 15, outer 45.",
    "excluded": "Each base lists the slot-eligible mods it does not roll and the tags they need; the base's skills (item.skills) carry none of those tags.",
    "weights": "Mod weight = catalogue weight x role factor (job 1.0, zone 0.6, shared 0.5), so job mods dominate.",
    "implicits": "Default, owner may veto: one fixed implicit per weapon, off-hand and jewellery base, taken from the base's form (spear: reach; tower shield: block and Guard). Body armour, helmets, gloves and boots carry no implicit; their base defence is the material.",
    "status": {"live": "in the roll pool today", "consumer": "combat already reads the stat; add the mod to the pool", "proposed": "needs a new combat consumer before it can roll; values are provisional first-pass numbers"},
    "addedFire": "Default, owner may veto: added-fire rolls only on fire-tagged bases (STR/INT and the fire and ignite wedge); the live game rolls it on every weapon until Itemization.cs changes.",
}


def md(data: dict, md_escape) -> list:
    L = []
    a = L.append
    r = data["modpoolRules"]
    a("## Modpools")
    a("")
    a("Each base rolls the mods that support the job its zone's skills do, plus a small shared pool. Same zone and skill keys as the item tables above; data in `item_modpools.py`, output under each item's `modpool` in the JSON.")
    a("")
    for k in ("source", "jobRule", "affixCap", "tiers", "weights", "implicits", "addedFire"):
        a(f"- **{k}:** {r[k]}")
    a("- **status:** " + "; ".join(f"`{k}` {v}" for k, v in r["status"].items()) + ".")
    a("")
    ex = next(it for z in data["zones"] for it in z["items"] if it["name"] == "Bast fowling net")
    rolls = ", ".join(p["mod"] for p in ex["modpool"]["pool"])
    a(f"Example: the Bast fowling net (INT/DEX off-hand tool; serves traps) rolls {rolls}. It cannot roll {', '.join(e['mod'] for e in ex['modpool']['excluded'])}: none of its skills are attacks, spells or auras.")
    a("")
    a("### Mod catalogue")
    a("")
    a("Status `proposed` values are provisional first-pass numbers (default, owner may veto).")
    a("")
    a("| Mod | Label | P/S | Stat | Status | Slots | Tags | Tiers (ilvl: min-max) | Weight | Bases |")
    a("|---|---|---|---|---|---|---|---|---|---|")
    for m in data["mods"]:
        tiers = "; ".join(f"T{t['tier']} {t['ilvl']}: {t['min']}-{t['max']}" for t in m["tiers"])
        a("| " + " | ".join(md_escape(str(x)) for x in [
            m["id"], m["label"], m["kind"], m["stat"], m["status"], ", ".join(m["categories"]),
            ", ".join(m["tags"]) or "shared", tiers, m["weight"], m["rolledBy"]]) + " |")
    for z in data["zones"]:
        a("")
        a(f"### {z['label']} bases")
        a("")
        a("| Base | Slot | Implicit | Prefixes (weight) | Suffixes (weight) | Not rolled (examples) | Min ilvl | Flags |")
        a("|---|---|---|---|---|---|---|---|")
        for it in z["items"]:
            mp = it["modpool"]
            def fmt(p):
                mark = "" if p["status"] == "live" else ("*" if p["status"] == "consumer" else "+")
                return f"{p['mod']}{mark} ({p['weight']})"
            pre = ", ".join(fmt(p) for p in mp["pool"] if p["kind"] == "P" and p["role"] != "shared")
            suf = ", ".join(fmt(p) for p in mp["pool"] if p["kind"] == "S" and p["role"] != "shared")
            shared = [p["mod"] for p in mp["pool"] if p["role"] == "shared"]
            if shared:
                suf = (suf + "; " if suf else "") + "shared: " + ", ".join(shared)
            imp = ", ".join(i["label"] for i in mp["implicit"]) or "none"
            excl = ", ".join(e["mod"] for e in mp["excluded"][:6]) + (" ..." if len(mp["excluded"]) > 6 else "")
            a("| " + " | ".join(md_escape(x) for x in [
                it["name"], f"{it['slot']} ({mp['category']})", imp, pre or "-", suf or "-", excl or "-",
                str(mp["minItemLevel"]), "; ".join(mp["flags"]) or "-"]) + " |")
    a("")
    a("Marks: no mark = live in the game pool; `*` = consumer exists, add to the pool; `+` = proposed, needs a new combat consumer.")
    rep = data["modpoolReport"]
    a("")
    a("### Mods no base can roll")
    a("")
    if rep["unrollable"]:
        for mid in rep["unrollable"]:
            m = MOD_INDEX[mid]
            a(f"- `{mid}` ({m[1]}): needs tags {', '.join(m[6]) or 'shared'} on a {'/'.join(m[5])} base." + (" Appears only as an implicit." if mid in rep["implicitOnly"] else ""))
    else:
        a("- None: every catalogue mod is rollable by at least one base.")
    a("")
    a(f"### Bases with thin or one-sided pools ({len(rep['thinBases'])})")
    a("")
    a("Weapons and off-hands are thin with fewer than 3 job or zone mods. Armour, belts and jewellery count their material defences too, but need at least one skill-linked mod. Either is also flagged when every job mod still needs a combat consumer. Most thin bases serve only \"any\": they are generic kit and either need a job (a skill they help) or should stay low-value core bases.")
    a("")
    a("Causes, in order of frequency: (1) generic kit whose only listed job is \"any\" (plain belts, rings, caps, tunics); give it a skill it helps or keep it as a low-value core base. (2) Slot types with few catalogue mods: quivers and bow cases have only projectile, accuracy, thrown and Dexterity, because arrow count, pierce and similar mods have no combat consumer; shields have only block, Guard and stun. (3) Off-zone materials: a leather belt in a STR zone gets Evasion from its material but nothing from the zone.")
    a("")
    a("| Base | Zone | Flags |")
    a("|---|---|---|")
    for t in rep["thinBases"]:
        a(f"| {md_escape(t['name'])} | {t['zone']} | {md_escape('; '.join(t['flags']))} |")
    a("")
    a("### Modpool open questions")
    a("")
    a("- Equipment attributes (Strength/Dexterity/Intelligence) are not read by combat today; the shared attribute mods need that consumer.")
    a("- Resolved as defaults (owner may veto): prefix/suffix 2+2 with implicits; added-fire limited to fire bases; proposed values kept as provisional. See Owner defaults above.")
    a("- Trap, mark, companion, banner and war cry mods depend on skills that do not exist yet as player actions.")
    return L
