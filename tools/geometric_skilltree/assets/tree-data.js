(function(global) {
  global.TREE_DATA = {
  "schemaVersion": 1,
  "phase": 4,
  "mainRingDepth": 10,
  "startPoints": {
    "skill": 140
  },
  "metadata": {
    "generatedFrom": "tools/geometric_skilltree/scripts/author-tree.mjs (hand-authored tables)",
    "generatedAt": "2026-10-27",
    "intent": "Phase 4 authored tree: every seat is deliberate data. Zero hash-generated content."
  },
  "patternTuning": {
    "wave": {
      "minLength": 2,
      "minPercent": 10,
      "crestPercent": 20,
      "meridianEndpointPercent": 28,
      "amplitudePercentPerUnit": 12,
      "amplitudeMax": 3
    },
    "flow": {
      "minLength": 3,
      "minPercent": 25,
      "maxPercent": 100,
      "maxLength": 8
    },
    "loops": {
      "maxRadius": 3
    },
    "vesica": {
      "lensShare": 0.5,
      "piscisLensShare": 0.75
    },
    "rods": {
      "minLength": 3,
      "endpointBonus": 4,
      "endpointPercent": 8
    },
    "crossroads": {
      "minDegree": 4,
      "perExtra": 3
    },
    "symmetry": {
      "mirrorAttrsPerPair": 0.8,
      "trineAttrsPerTriple": 2,
      "mandalaAttrsPerSet": 3
    },
    "grandOrbit": {
      "attrsPerRing": 2
    },
    "enclosure": {
      "guardPerNode": 12
    }
  },
  "seats": {
    "0,0": {
      "id": "0,0",
      "q": 0,
      "r": 0,
      "ring": 0,
      "type": "origin",
      "axis": "hybrid",
      "effects": [
        "Starting point. No passive bonus."
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "origin",
      "status": "final",
      "notes": "",
      "name": "Origin"
    },
    "-1,1": {
      "id": "-1,1",
      "q": -1,
      "r": 1,
      "ring": 1,
      "type": "small",
      "axis": "str",
      "effects": [
        "+9% increased Attack Damage",
        "Hold the haft like it owes you money."
      ],
      "stat": "attackDamage",
      "amount": 9,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "0,1": {
      "id": "0,1",
      "q": 0,
      "r": 1,
      "ring": 1,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+12 to Spirit",
        "Every service starts with a lit taper and a steady voice."
      ],
      "stat": "spirit",
      "amount": 12,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "1,0": {
      "id": "1,0",
      "q": 1,
      "r": 0,
      "ring": 1,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Rite Damage",
        "A clean opening: rites hit harder from the first day."
      ],
      "stat": "spellDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "1,-1": {
      "id": "1,-1",
      "q": 1,
      "r": -1,
      "ring": 1,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+10% increased Ailment Effect",
        "Small wounds, patiently kept open."
      ],
      "stat": "ailmentEffect",
      "amount": 10,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "0,-1": {
      "id": "0,-1",
      "q": 0,
      "r": -1,
      "ring": 1,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+24 to Evasion",
        "Begin by not being where the blow lands."
      ],
      "stat": "evasion",
      "amount": 24,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-1,0": {
      "id": "-1,0",
      "q": -1,
      "r": 0,
      "ring": 1,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+10% increased Projectile Damage",
        "Everything in camp can be thrown once."
      ],
      "stat": "projectileDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-2,2": {
      "id": "-2,2",
      "q": -2,
      "r": 2,
      "ring": 2,
      "type": "small",
      "axis": "str",
      "effects": [
        "+18 to Life"
      ],
      "stat": "life",
      "amount": 18,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-1,2": {
      "id": "-1,2",
      "q": -1,
      "r": 2,
      "ring": 2,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+14% increased Ailment Effect",
        "Adds 3 Fire Damage to hits"
      ],
      "stat": "ailmentEffect",
      "amount": 14,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Fire Ailments"
    },
    "0,2": {
      "id": "0,2",
      "q": 0,
      "r": 2,
      "ring": 2,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+8% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "1,1": {
      "id": "1,1",
      "q": 1,
      "r": 1,
      "ring": 2,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+16% increased Companion Damage",
        "+10 to Spirit",
        "Your first companion costs no upkeep (design text)"
      ],
      "stat": "minionDamage",
      "amount": 16,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Free Companion"
    },
    "2,0": {
      "id": "2,0",
      "q": 2,
      "r": 0,
      "ring": 2,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12 to Spirit"
      ],
      "stat": "spirit",
      "amount": 12,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "2,-1": {
      "id": "2,-1",
      "q": 2,
      "r": -1,
      "ring": 2,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+16% increased Rite Damage",
        "+6% to Cold Resistance",
        "Chilled enemies take +8% from your rites (design text)"
      ],
      "stat": "spellDamage",
      "amount": 16,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Chilled Targets"
    },
    "2,-2": {
      "id": "2,-2",
      "q": 2,
      "r": -2,
      "ring": 2,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+8% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 8,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "1,-2": {
      "id": "1,-2",
      "q": 1,
      "r": -2,
      "ring": 2,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+14% increased Ailment Effect",
        "+30 to Evasion",
        "Your poisons ignore half of Chaos resistance (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 14,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Poison Penetration"
    },
    "0,-2": {
      "id": "0,-2",
      "q": 0,
      "r": -2,
      "ring": 2,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+8% increased Evasion"
      ],
      "stat": "evasion_increased",
      "amount": 8,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-1,-1": {
      "id": "-1,-1",
      "q": -1,
      "r": -1,
      "ring": 2,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+14% increased Projectile Damage",
        "+30 to Accuracy",
        "Your shots from higher ground Shock (design text)"
      ],
      "stat": "projectileDamage",
      "amount": 14,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "High Ground Shock"
    },
    "-2,0": {
      "id": "-2,0",
      "q": -2,
      "r": 0,
      "ring": 2,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+8% increased Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-2,1": {
      "id": "-2,1",
      "q": -2,
      "r": 1,
      "ring": 2,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+16% increased Attack Damage",
        "+8% increased Ailment Effect",
        "Your hits against Bleeding enemies cannot be Blocked (design text)"
      ],
      "stat": "attackDamage",
      "amount": 16,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Unblockable Against Bleeding"
    },
    "-3,3": {
      "id": "-3,3",
      "q": -3,
      "r": 3,
      "ring": 3,
      "type": "mastery",
      "axis": "str",
      "effects": [
        "+14% increased Attack Damage",
        "+25 to Guard",
        "You cannot be pushed back while attacking (design text)"
      ],
      "stat": "attackDamage",
      "amount": 14,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Attack Mastery"
    },
    "-2,3": {
      "id": "-2,3",
      "q": -2,
      "r": 3,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "effects": [
        "Adds 3 Fire Damage to hits"
      ],
      "stat": "emberkiss",
      "amount": 3,
      "tags": [],
      "clusterId": "kiln-approach",
      "status": "review",
      "notes": "",
      "name": "Added Fire Damage"
    },
    "-1,3": {
      "id": "-1,3",
      "q": -1,
      "r": 3,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Attack Damage",
        "+4% increased Attack Damage against Ignited enemies (design text)"
      ],
      "stat": "attackDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "kiln-approach",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "0,3": {
      "id": "0,3",
      "q": 0,
      "r": 3,
      "ring": 3,
      "type": "mastery",
      "axis": "hybrid",
      "effects": [
        "+14% increased Companion Damage",
        "+15 to Spirit",
        "Your banners and standing rites reach 15% further (design text)"
      ],
      "stat": "minionDamage",
      "amount": 14,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Companion Mastery"
    },
    "1,2": {
      "id": "1,2",
      "q": 1,
      "r": 2,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "effects": [
        "+8% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "procession-approach",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "2,1": {
      "id": "2,1",
      "q": 2,
      "r": 1,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "effects": [
        "+8% increased Companion Damage",
        "Companions near your banner gain +5% speed (design text)"
      ],
      "stat": "minionDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "procession-approach",
      "status": "review",
      "notes": "",
      "name": "Companion Damage"
    },
    "3,0": {
      "id": "3,0",
      "q": 3,
      "r": 0,
      "ring": 3,
      "type": "mastery",
      "axis": "int",
      "effects": [
        "+14% increased Rite Damage",
        "+20 to Ward",
        "Your Ward recharge begins 20% sooner"
      ],
      "stat": "spellDamage",
      "amount": 14,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Ward Mastery"
    },
    "3,-1": {
      "id": "3,-1",
      "q": 3,
      "r": -1,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "effects": [
        "+8% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "drowned-approach",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "3,-2": {
      "id": "3,-2",
      "q": 3,
      "r": -2,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "effects": [
        "+8% to Cold Resistance",
        "+6 to Ward (design text)"
      ],
      "stat": "river_resistance",
      "amount": 8,
      "tags": [],
      "clusterId": "drowned-approach",
      "status": "review",
      "notes": "",
      "name": "Cold Resistance"
    },
    "3,-3": {
      "id": "3,-3",
      "q": 3,
      "r": -3,
      "ring": 3,
      "type": "mastery",
      "axis": "hybrid",
      "effects": [
        "+16% increased Ailment Effect",
        "+1% to Critical Chance",
        "Your marks last 20% longer (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 16,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Ailment Mastery"
    },
    "2,-3": {
      "id": "2,-3",
      "q": 2,
      "r": -3,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+22 to Evasion"
      ],
      "stat": "evasion",
      "amount": 22,
      "tags": [],
      "clusterId": "unlit-approach",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "1,-3": {
      "id": "1,-3",
      "q": 1,
      "r": -3,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+1% to Critical Chance",
        "+8% Ailment Effect against unhurt enemies (design text)"
      ],
      "stat": "critChance",
      "amount": 1,
      "tags": [],
      "clusterId": "unlit-approach",
      "status": "review",
      "notes": "",
      "name": "Critical Chance"
    },
    "0,-3": {
      "id": "0,-3",
      "q": 0,
      "r": -3,
      "ring": 3,
      "type": "mastery",
      "axis": "dex",
      "effects": [
        "+14% increased Evasion",
        "+40 to Accuracy",
        "+4% increased Movement Speed"
      ],
      "stat": "evasion_increased",
      "amount": 14,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Evasion Mastery"
    },
    "-1,-2": {
      "id": "-1,-2",
      "q": -1,
      "r": -2,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+8% increased Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "high-approach",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-2,-1": {
      "id": "-2,-1",
      "q": -2,
      "r": -1,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+22 to Evasion",
        "+4% Movement Speed on rough ground (design text)"
      ],
      "stat": "evasion",
      "amount": 22,
      "tags": [],
      "clusterId": "high-approach",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-3,0": {
      "id": "-3,0",
      "q": -3,
      "r": 0,
      "ring": 3,
      "type": "mastery",
      "axis": "hybrid",
      "effects": [
        "+12% increased Projectile Damage",
        "+6% increased Attack Speed",
        "Moving between attacks adds +8% damage to the next one (design text)"
      ],
      "stat": "projectileDamage",
      "amount": 12,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Projectile Mastery"
    },
    "-3,1": {
      "id": "-3,1",
      "q": -3,
      "r": 1,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Attack Damage"
      ],
      "stat": "attackDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "red-approach",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "-3,2": {
      "id": "-3,2",
      "q": -3,
      "r": 2,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Ailment Effect",
        "Bleeds you inflict on moving enemies worsen (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 8,
      "tags": [],
      "clusterId": "red-approach",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-4,4": {
      "id": "-4,4",
      "q": -4,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Physical Damage"
      ],
      "stat": "physical_increased",
      "amount": 8,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Physical Damage"
    },
    "-3,4": {
      "id": "-3,4",
      "q": -3,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "effects": [
        "+20 to Guard"
      ],
      "stat": "guard",
      "amount": 20,
      "tags": [],
      "clusterId": "kiln-approach",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-2,4": {
      "id": "-2,4",
      "q": -2,
      "r": 4,
      "ring": 4,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+35 to Guard",
        "+10% to Fire Resistance",
        "When a Ignite on an enemy expires, gain 15 Guard for four seconds (design text)"
      ],
      "stat": "guard",
      "amount": 35,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Guard from Ignites"
    },
    "-1,4": {
      "id": "-1,4",
      "q": -1,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 8,
      "tags": [],
      "clusterId": "kiln-approach",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "0,4": {
      "id": "0,4",
      "q": 0,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+10% to Fire Resistance"
      ],
      "stat": "ember_res",
      "amount": 10,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Fire Resistance"
    },
    "1,3": {
      "id": "1,3",
      "q": 1,
      "r": 3,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "effects": [
        "+18 to Ward"
      ],
      "stat": "ward",
      "amount": 18,
      "tags": [],
      "clusterId": "procession-approach",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "2,2": {
      "id": "2,2",
      "q": 2,
      "r": 2,
      "ring": 4,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+35 to Ward",
        "+8% increased Rite Damage",
        "Your Ward also shelters companions at half value (design text)"
      ],
      "stat": "ward",
      "amount": 35,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Shared Ward"
    },
    "3,1": {
      "id": "3,1",
      "q": 3,
      "r": 1,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "effects": [
        "+4% increased Rite Speed"
      ],
      "stat": "castSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "procession-approach",
      "status": "review",
      "notes": "",
      "name": "Rite Speed"
    },
    "4,0": {
      "id": "4,0",
      "q": 4,
      "r": 0,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5% increased Rite Speed"
      ],
      "stat": "castSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Rite Speed"
    },
    "4,-1": {
      "id": "4,-1",
      "q": 4,
      "r": -1,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "effects": [
        "+8% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 8,
      "tags": [],
      "clusterId": "drowned-approach",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "4,-2": {
      "id": "4,-2",
      "q": 4,
      "r": -2,
      "ring": 4,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+16% increased Ailment Effect",
        "+10% increased Rite Damage",
        "Chill you inflict slows 10% deeper (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 16,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Deeper Chill"
    },
    "4,-3": {
      "id": "4,-3",
      "q": 4,
      "r": -3,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "effects": [
        "+18 to Ward"
      ],
      "stat": "ward",
      "amount": 18,
      "tags": [],
      "clusterId": "drowned-approach",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "4,-4": {
      "id": "4,-4",
      "q": 4,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+25 to Evasion"
      ],
      "stat": "evasion",
      "amount": 25,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "3,-4": {
      "id": "3,-4",
      "q": 3,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+8% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 8,
      "tags": [],
      "clusterId": "unlit-approach",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "2,-4": {
      "id": "2,-4",
      "q": 2,
      "r": -4,
      "ring": 4,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+18% increased Ailment Effect",
        "+1% to Critical Chance",
        "Poison you inflict stacks one deeper (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 18,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Deeper Poison"
    },
    "1,-4": {
      "id": "1,-4",
      "q": 1,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+8% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 8,
      "tags": [],
      "clusterId": "unlit-approach",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "0,-4": {
      "id": "0,-4",
      "q": 0,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-1,-3": {
      "id": "-1,-3",
      "q": -1,
      "r": -3,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+4% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "high-approach",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-2,-2": {
      "id": "-2,-2",
      "q": -2,
      "r": -2,
      "ring": 4,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+16% increased Projectile Damage",
        "+8% to Lightning Resistance",
        "Shocked enemies take +10% from your projectiles (design text)"
      ],
      "stat": "projectileDamage",
      "amount": 16,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-3,-1": {
      "id": "-3,-1",
      "q": -3,
      "r": -1,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+35 to Accuracy"
      ],
      "stat": "accuracy_flat",
      "amount": 35,
      "tags": [],
      "clusterId": "high-approach",
      "status": "review",
      "notes": "",
      "name": "Accuracy"
    },
    "-4,0": {
      "id": "-4,0",
      "q": -4,
      "r": 0,
      "ring": 4,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-4,1": {
      "id": "-4,1",
      "q": -4,
      "r": 1,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "effects": [
        "+20 to Guard"
      ],
      "stat": "guard",
      "amount": 20,
      "tags": [],
      "clusterId": "red-approach",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-4,2": {
      "id": "-4,2",
      "q": -4,
      "r": 2,
      "ring": 4,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+18% increased Physical Damage",
        "+15 to Life",
        "Your heavy hits break Guard 20% harder (design text)"
      ],
      "stat": "physical_increased",
      "amount": 18,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Guard Break"
    },
    "-4,3": {
      "id": "-4,3",
      "q": -4,
      "r": 3,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Attack Damage"
      ],
      "stat": "attackDamage",
      "amount": 8,
      "tags": [],
      "clusterId": "red-approach",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "-5,5": {
      "id": "-5,5",
      "q": -5,
      "r": 5,
      "ring": 5,
      "type": "waystone",
      "axis": "str",
      "effects": [
        "+30 to Guard",
        "Loops closed around this Waystone empower their center +25% further",
        "Your Evasion is 10% lower while you hold the line (design text)"
      ],
      "stat": "guard",
      "amount": 30,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Champion Waystone",
      "patternHook": {
        "effect": "loop-boost",
        "value": 0.25
      }
    },
    "-4,5": {
      "id": "-4,5",
      "q": -4,
      "r": 5,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% to Fire Resistance"
      ],
      "stat": "ember_res",
      "amount": 10,
      "tags": [],
      "clusterId": "kiln-waist",
      "status": "review",
      "notes": "",
      "name": "Fire Resistance"
    },
    "-3,5": {
      "id": "-3,5",
      "q": -3,
      "r": 5,
      "ring": 5,
      "type": "socket",
      "axis": "str",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "kiln-line-sockets",
      "status": "review",
      "notes": "",
      "name": "Fire Jewel Socket"
    },
    "-2,5": {
      "id": "-2,5",
      "q": -2,
      "r": 5,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "effects": [
        "+4% increased Attack Speed",
        "+3% increased Ailment Effect (design text)"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "kiln-waist",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-1,5": {
      "id": "-1,5",
      "q": -1,
      "r": 5,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "effects": [
        "Adds 5 Fire Damage to hits"
      ],
      "stat": "emberkiss",
      "amount": 5,
      "tags": [],
      "clusterId": "kiln-waist",
      "status": "review",
      "notes": "",
      "name": "Added Fire Damage"
    },
    "0,5": {
      "id": "0,5",
      "q": 0,
      "r": 5,
      "ring": 5,
      "type": "waystone",
      "axis": "hybrid",
      "effects": [
        "+20 to Spirit",
        "Enclosures you close around this Waystone guard 50% more",
        "Your rites cost 5% more Spirit (design text)"
      ],
      "stat": "spirit",
      "amount": 20,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Ritualist Waystone",
      "patternHook": {
        "effect": "enclosure-boost",
        "value": 0.5
      }
    },
    "1,4": {
      "id": "1,4",
      "q": 1,
      "r": 4,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10 to Spirit"
      ],
      "stat": "spirit",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-waist",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "2,3": {
      "id": "2,3",
      "q": 2,
      "r": 3,
      "ring": 5,
      "type": "socket",
      "axis": "int",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "procession-sockets",
      "status": "review",
      "notes": "",
      "name": "Companion Jewel Socket"
    },
    "3,2": {
      "id": "3,2",
      "q": 3,
      "r": 2,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "effects": [
        "+18 to Life",
        "Companions heal when you do, at half value (design text)"
      ],
      "stat": "life",
      "amount": 18,
      "tags": [],
      "clusterId": "procession-waist",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "4,1": {
      "id": "4,1",
      "q": 4,
      "r": 1,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "effects": [
        "+4% increased Rite Speed"
      ],
      "stat": "castSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "procession-waist",
      "status": "review",
      "notes": "",
      "name": "Rite Speed"
    },
    "5,0": {
      "id": "5,0",
      "q": 5,
      "r": 0,
      "ring": 5,
      "type": "waystone",
      "axis": "int",
      "effects": [
        "+30 to Ward",
        "Waves passing through this Waystone count +1 length",
        "Ward recharge is 10% slower"
      ],
      "stat": "ward",
      "amount": 30,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Archmage Waystone",
      "patternHook": {
        "effect": "wave-length",
        "value": 1
      }
    },
    "5,-1": {
      "id": "5,-1",
      "q": 5,
      "r": -1,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "effects": [
        "+4% increased Rite Speed"
      ],
      "stat": "castSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "drowned-waist",
      "status": "review",
      "notes": "",
      "name": "Rite Speed"
    },
    "5,-2": {
      "id": "5,-2",
      "q": 5,
      "r": -2,
      "ring": 5,
      "type": "socket",
      "axis": "int",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "drowned-study-sockets",
      "status": "review",
      "notes": "",
      "name": "Cold Jewel Socket"
    },
    "5,-3": {
      "id": "5,-3",
      "q": 5,
      "r": -3,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "effects": [
        "+9% increased Ailment Effect",
        "Your Chill spreads to enemies touching its victim (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 9,
      "tags": [],
      "clusterId": "drowned-waist",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "5,-4": {
      "id": "5,-4",
      "q": 5,
      "r": -4,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "effects": [
        "+9% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 9,
      "tags": [],
      "clusterId": "drowned-waist",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "5,-5": {
      "id": "5,-5",
      "q": 5,
      "r": -5,
      "ring": 5,
      "type": "waystone",
      "axis": "hybrid",
      "effects": [
        "+12% increased Ailment Effect",
        "Flows passing through this Waystone count +1 length",
        "You show your position when you strike: +5% damage taken for two seconds (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 12,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Assassin Waystone",
      "patternHook": {
        "effect": "flow-length",
        "value": 1
      }
    },
    "4,-5": {
      "id": "4,-5",
      "q": 4,
      "r": -5,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+8% increased Evasion"
      ],
      "stat": "evasion_increased",
      "amount": 8,
      "tags": [],
      "clusterId": "unlit-waist",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "3,-5": {
      "id": "3,-5",
      "q": 3,
      "r": -5,
      "ring": 5,
      "type": "socket",
      "axis": "dex",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "unlit-road-sockets",
      "status": "review",
      "notes": "",
      "name": "Poison Jewel Socket"
    },
    "2,-5": {
      "id": "2,-5",
      "q": 2,
      "r": -5,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+9% increased Ailment Effect",
        "Your vials refill on kill (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 9,
      "tags": [],
      "clusterId": "unlit-waist",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "1,-5": {
      "id": "1,-5",
      "q": 1,
      "r": -5,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+35 to Accuracy"
      ],
      "stat": "accuracy_flat",
      "amount": 35,
      "tags": [],
      "clusterId": "unlit-waist",
      "status": "review",
      "notes": "",
      "name": "Accuracy"
    },
    "0,-5": {
      "id": "0,-5",
      "q": 0,
      "r": -5,
      "ring": 5,
      "type": "waystone",
      "axis": "dex",
      "effects": [
        "+45 to Evasion",
        "Rods ending on this Waystone empower both endpoints twice",
        "You cannot Block while you keep this pace (design text)"
      ],
      "stat": "evasion",
      "amount": 45,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Acrobat Waystone",
      "patternHook": {
        "effect": "rod-double"
      }
    },
    "-1,-4": {
      "id": "-1,-4",
      "q": -1,
      "r": -4,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+4% increased Movement Speed"
      ],
      "stat": "move",
      "amount": 4,
      "tags": [],
      "clusterId": "high-waist",
      "status": "review",
      "notes": "",
      "name": "Movement Speed"
    },
    "-2,-3": {
      "id": "-2,-3",
      "q": -2,
      "r": -3,
      "ring": 5,
      "type": "socket",
      "axis": "dex",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "high-paths-sockets",
      "status": "review",
      "notes": "",
      "name": "Projectile Jewel Socket"
    },
    "-3,-2": {
      "id": "-3,-2",
      "q": -3,
      "r": -2,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+9% increased Ailment Effect",
        "Your Shocks last one second longer (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 9,
      "tags": [],
      "clusterId": "high-waist",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-4,-1": {
      "id": "-4,-1",
      "q": -4,
      "r": -1,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+9% increased Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "tags": [],
      "clusterId": "high-waist",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-5,0": {
      "id": "-5,0",
      "q": -5,
      "r": 0,
      "ring": 5,
      "type": "waystone",
      "axis": "hybrid",
      "effects": [
        "+16% increased Projectile Damage",
        "Waves and flows may both claim conduits touching this Waystone",
        "-10% increased Reach"
      ],
      "stat": "projectileDamage",
      "amount": 16,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Reaver Waystone",
      "patternHook": {
        "effect": "shared-claim"
      }
    },
    "-5,1": {
      "id": "-5,1",
      "q": -5,
      "r": 1,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Physical Damage"
      ],
      "stat": "physical_increased",
      "amount": 8,
      "tags": [],
      "clusterId": "red-waist",
      "status": "review",
      "notes": "",
      "name": "Physical Damage"
    },
    "-5,2": {
      "id": "-5,2",
      "q": -5,
      "r": 2,
      "ring": 5,
      "type": "socket",
      "axis": "str",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "red-field-sockets",
      "status": "review",
      "notes": "",
      "name": "Physical Jewel Socket"
    },
    "-5,3": {
      "id": "-5,3",
      "q": -5,
      "r": 3,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "effects": [
        "+4% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "red-waist",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-5,4": {
      "id": "-5,4",
      "q": -5,
      "r": 4,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "effects": [
        "+20 to Life",
        "Bleeding enemies speed up your out-of-combat Life regeneration (design text)"
      ],
      "stat": "life",
      "amount": 20,
      "tags": [],
      "clusterId": "red-waist",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-6,6": {
      "id": "-6,6",
      "q": -6,
      "r": 6,
      "ring": 6,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+24% increased Attack Damage",
        "+20 to Life",
        "Allies behind you take 10% less damage (design text)"
      ],
      "stat": "attackDamage",
      "amount": 24,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Ally Protection"
    },
    "-5,6": {
      "id": "-5,6",
      "q": -5,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "+25 to Guard"
      ],
      "stat": "guard",
      "amount": 25,
      "tags": [],
      "clusterId": "kiln-oath",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-4,6": {
      "id": "-4,6",
      "q": -4,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "+20 to Ward"
      ],
      "stat": "ward",
      "amount": 20,
      "tags": [],
      "clusterId": "kiln-oath",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "-3,6": {
      "id": "-3,6",
      "q": -3,
      "r": 6,
      "ring": 6,
      "type": "keystone",
      "axis": "str",
      "effects": [
        "All of your damage is dealt as Fire",
        "You deal no Physical, Cold, Lightning, or Chaos damage",
        "Ignites you inflict burn 30% hotter (design text)"
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "All Damage as Fire"
    },
    "-2,6": {
      "id": "-2,6",
      "q": -2,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "+9% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 9,
      "tags": [],
      "clusterId": "kiln-oath",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-1,6": {
      "id": "-1,6",
      "q": -1,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "+9% increased Attack Damage",
        "Hits against Ignited enemies gain +6% damage (design text)"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "tags": [],
      "clusterId": "kiln-oath",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "0,6": {
      "id": "0,6",
      "q": 0,
      "r": 6,
      "ring": 6,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+24% increased Companion Damage",
        "+12% increased Rite Damage",
        "Companions within your banner strike 10% faster (design text)"
      ],
      "stat": "minionDamage",
      "amount": 24,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Banner Attack Speed"
    },
    "1,5": {
      "id": "1,5",
      "q": 1,
      "r": 5,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+22 to Ward"
      ],
      "stat": "ward",
      "amount": 22,
      "tags": [],
      "clusterId": "procession-oath",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "2,4": {
      "id": "2,4",
      "q": 2,
      "r": 4,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+9% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 9,
      "tags": [],
      "clusterId": "procession-oath",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "3,3": {
      "id": "3,3",
      "q": 3,
      "r": 3,
      "ring": 6,
      "type": "keystone",
      "axis": "int",
      "effects": [
        "Your rites cost Life instead of Spirit",
        "Your Spirit is reserved in full to your banners and standing rites"
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Rites Cost Life"
    },
    "4,2": {
      "id": "4,2",
      "q": 4,
      "r": 2,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+9% increased Companion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "tags": [],
      "clusterId": "procession-oath",
      "status": "review",
      "notes": "",
      "name": "Companion Damage"
    },
    "5,1": {
      "id": "5,1",
      "q": 5,
      "r": 1,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% to Chaos Resistance",
        "Wither cannot cross the circle while you stand still (design text)"
      ],
      "stat": "gloam_res",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-oath",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "6,0": {
      "id": "6,0",
      "q": 6,
      "r": 0,
      "ring": 6,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+26% increased Rite Damage",
        "+15 to Spirit",
        "Rites you repeat within four seconds gain +10% effect (design text)"
      ],
      "stat": "spellDamage",
      "amount": 26,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Repeated Rites"
    },
    "6,-1": {
      "id": "6,-1",
      "q": 6,
      "r": -1,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+40 to Accuracy"
      ],
      "stat": "accuracy_flat",
      "amount": 40,
      "tags": [],
      "clusterId": "drowned-oath",
      "status": "review",
      "notes": "",
      "name": "Accuracy"
    },
    "6,-2": {
      "id": "6,-2",
      "q": 6,
      "r": -2,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "drowned-oath",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "6,-3": {
      "id": "6,-3",
      "q": 6,
      "r": -3,
      "ring": 6,
      "type": "keystone",
      "axis": "int",
      "effects": [
        "Your hits never deal critical strikes",
        "You deal 35% more damage to Chilled enemies"
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Chill Over Criticals"
    },
    "6,-4": {
      "id": "6,-4",
      "q": 6,
      "r": -4,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% to Cold Resistance"
      ],
      "stat": "river_resistance",
      "amount": 10,
      "tags": [],
      "clusterId": "drowned-oath",
      "status": "review",
      "notes": "",
      "name": "Cold Resistance"
    },
    "6,-5": {
      "id": "6,-5",
      "q": 6,
      "r": -5,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Ailment Effect",
        "Marks you write cost no Spirit (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 10,
      "tags": [],
      "clusterId": "drowned-oath",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "6,-6": {
      "id": "6,-6",
      "q": 6,
      "r": -6,
      "ring": 6,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+12% to Chaos Resistance",
        "+18% increased Ailment Effect",
        "Wither you inflict stacks one deeper (design text)"
      ],
      "stat": "gloam_res",
      "amount": 12,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Deeper Wither"
    },
    "5,-6": {
      "id": "5,-6",
      "q": 5,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+28 to Evasion"
      ],
      "stat": "evasion",
      "amount": 28,
      "tags": [],
      "clusterId": "unlit-oath",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "4,-6": {
      "id": "4,-6",
      "q": 4,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+4% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "unlit-oath",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "3,-6": {
      "id": "3,-6",
      "q": 3,
      "r": -6,
      "ring": 6,
      "type": "keystone",
      "axis": "dex",
      "effects": [
        "You deal 40% more damage to enemies that have not hurt you recently",
        "Enemies that have hurt you recently take 15% less from you"
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Strike the Unhurt"
    },
    "2,-6": {
      "id": "2,-6",
      "q": 2,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+10% increased Ailment Effect",
        "Poison from this dose slows (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 10,
      "tags": [],
      "clusterId": "unlit-oath",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "1,-6": {
      "id": "1,-6",
      "q": 1,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+10% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 10,
      "tags": [],
      "clusterId": "unlit-oath",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "0,-6": {
      "id": "0,-6",
      "q": 0,
      "r": -6,
      "ring": 6,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+60 to Accuracy",
        "+12% increased Attack Speed",
        "Your first hit on an unhurt enemy always lands (design text)"
      ],
      "stat": "accuracy_flat",
      "amount": 60,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Sure First Hit"
    },
    "-1,-5": {
      "id": "-1,-5",
      "q": -1,
      "r": -5,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+28 to Evasion"
      ],
      "stat": "evasion",
      "amount": 28,
      "tags": [],
      "clusterId": "high-oath",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-2,-4": {
      "id": "-2,-4",
      "q": -2,
      "r": -4,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+10% to Lightning Resistance"
      ],
      "stat": "storm_res",
      "amount": 10,
      "tags": [],
      "clusterId": "high-oath",
      "status": "review",
      "notes": "",
      "name": "Lightning Resistance"
    },
    "-3,-3": {
      "id": "-3,-3",
      "q": -3,
      "r": -3,
      "ring": 6,
      "type": "keystone",
      "axis": "dex",
      "effects": [
        "Your hits deal up to 40% more damage to distant enemies",
        "Your hits deal 25% less damage to enemies within reach"
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Damage at Range"
    },
    "-4,-2": {
      "id": "-4,-2",
      "q": -4,
      "r": -2,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+10% increased Projectile Damage",
        "Your shots recover on kill (design text)"
      ],
      "stat": "projectileDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "high-oath",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-5,-1": {
      "id": "-5,-1",
      "q": -5,
      "r": -1,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+4% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "high-oath",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-6,0": {
      "id": "-6,0",
      "q": -6,
      "r": 0,
      "ring": 6,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+24% increased Projectile Damage",
        "+5% increased Movement Speed",
        "Thrown hits while moving gain +10% damage (design text)"
      ],
      "stat": "projectileDamage",
      "amount": 24,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Throwing While Moving"
    },
    "-6,1": {
      "id": "-6,1",
      "q": -6,
      "r": 1,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "+9% increased Attack Damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "tags": [],
      "clusterId": "red-oath",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "-6,2": {
      "id": "-6,2",
      "q": -6,
      "r": 2,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "+25 to Guard"
      ],
      "stat": "guard",
      "amount": 25,
      "tags": [],
      "clusterId": "red-oath",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-6,3": {
      "id": "-6,3",
      "q": -6,
      "r": 3,
      "ring": 6,
      "type": "keystone",
      "axis": "str",
      "effects": [
        "Your hits cannot be evaded",
        "You never deal critical strikes"
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Hits Cannot Be Evaded"
    },
    "-6,4": {
      "id": "-6,4",
      "q": -6,
      "r": 4,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Ailment Effect",
        "Your Bleeds stack on Bleeding enemies (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 10,
      "tags": [],
      "clusterId": "red-oath",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-6,5": {
      "id": "-6,5",
      "q": -6,
      "r": 5,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "effects": [
        "Adds 4 Physical Damage to hits"
      ],
      "stat": "heavy",
      "amount": 4,
      "tags": [],
      "clusterId": "red-oath",
      "status": "review",
      "notes": "",
      "name": "Added Physical Damage"
    },
    "-7,7": {
      "id": "-7,7",
      "q": -7,
      "r": 7,
      "ring": 7,
      "type": "class",
      "axis": "str",
      "effects": [
        "+12% increased Attack Damage",
        "Unlocks: tower shields become usable",
        "Unlocks: 2x2 War Horn seat",
        "Your first class passive sets your class; each class passive grants its unlock."
      ],
      "stat": "attackDamage",
      "amount": 12,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Champion"
    },
    "-6,7": {
      "id": "-6,7",
      "q": -6,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+9% increased Guard"
      ],
      "stat": "guard_increased",
      "amount": 9,
      "tags": [],
      "clusterId": "kiln-high",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-5,7": {
      "id": "-5,7",
      "q": -5,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+4% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "kiln-high",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-4,7": {
      "id": "-4,7",
      "q": -4,
      "r": 7,
      "ring": 7,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+20% increased Ailment Effect",
        "Adds 5 Fire Damage to hits",
        "Ignites you inflict last twice as long (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 20,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Lasting Ignites"
    },
    "-3,7": {
      "id": "-3,7",
      "q": -3,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+20 to Life"
      ],
      "stat": "life",
      "amount": 20,
      "tags": [],
      "clusterId": "kiln-high",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-2,7": {
      "id": "-2,7",
      "q": -2,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "Adds 6 Fire Damage to hits",
        "Your hits shed light; the unlit cannot hide from you (design text)"
      ],
      "stat": "emberkiss",
      "amount": 6,
      "tags": [],
      "clusterId": "kiln-high",
      "status": "review",
      "notes": "",
      "name": "Added Fire Damage"
    },
    "-1,7": {
      "id": "-1,7",
      "q": -1,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+12% to Fire Resistance"
      ],
      "stat": "ember_res",
      "amount": 12,
      "tags": [],
      "clusterId": "kiln-high",
      "status": "review",
      "notes": "",
      "name": "Fire Resistance"
    },
    "0,7": {
      "id": "0,7",
      "q": 0,
      "r": 7,
      "ring": 7,
      "type": "class",
      "axis": "hybrid",
      "effects": [
        "+12% increased Companion Damage",
        "Unlocks: banners become usable",
        "Unlocks: one martial companion",
        "Unlocks: 4x4 Reliquary",
        "Your first class passive sets your class; each class passive grants its unlock."
      ],
      "stat": "minionDamage",
      "amount": 12,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Ritualist"
    },
    "1,6": {
      "id": "1,6",
      "q": 1,
      "r": 6,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+8% increased Ward"
      ],
      "stat": "ward_pct",
      "amount": 8,
      "tags": [],
      "clusterId": "procession-high",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "2,5": {
      "id": "2,5",
      "q": 2,
      "r": 5,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Companion Damage"
      ],
      "stat": "minionDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-high",
      "status": "review",
      "notes": "",
      "name": "Companion Damage"
    },
    "3,4": {
      "id": "3,4",
      "q": 3,
      "r": 4,
      "ring": 7,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+22% increased Companion Damage",
        "+20 to Ward",
        "Companions within your banner cannot be Withered (design text)"
      ],
      "stat": "minionDamage",
      "amount": 22,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Protected Companions"
    },
    "4,3": {
      "id": "4,3",
      "q": 4,
      "r": 3,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+4% increased Rite Speed"
      ],
      "stat": "castSpeed",
      "amount": 4,
      "tags": [],
      "clusterId": "procession-high",
      "status": "review",
      "notes": "",
      "name": "Rite Speed"
    },
    "5,2": {
      "id": "5,2",
      "q": 5,
      "r": 2,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% to Fire Resistance"
      ],
      "stat": "ember_res",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-high",
      "status": "review",
      "notes": "",
      "name": "Fire Resistance"
    },
    "6,1": {
      "id": "6,1",
      "q": 6,
      "r": 1,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12 to Spirit",
        "Your rites are not interrupted by light hits (design text)"
      ],
      "stat": "spirit",
      "amount": 12,
      "tags": [],
      "clusterId": "procession-high",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "7,0": {
      "id": "7,0",
      "q": 7,
      "r": 0,
      "ring": 7,
      "type": "class",
      "axis": "int",
      "effects": [
        "+15% increased Rite Damage",
        "Unlocks: a second curio slot",
        "Unlocks: rite-foci gain +1 socket",
        "Unlocks: 2x2 Attendant focus seat",
        "Your first class passive sets your class; each class passive grants its unlock."
      ],
      "stat": "spellDamage",
      "amount": 15,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Archmage"
    },
    "7,-1": {
      "id": "7,-1",
      "q": 7,
      "r": -1,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+24 to Ward"
      ],
      "stat": "ward",
      "amount": 24,
      "tags": [],
      "clusterId": "drowned-high",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "7,-2": {
      "id": "7,-2",
      "q": 7,
      "r": -2,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "drowned-high",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "7,-3": {
      "id": "7,-3",
      "q": 7,
      "r": -3,
      "ring": 7,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+24% increased Rite Damage",
        "+15% increased Ailment Effect",
        "Your marks persist on enemies that leave your sight (design text)"
      ],
      "stat": "spellDamage",
      "amount": 24,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Persistent Marks"
    },
    "7,-4": {
      "id": "7,-4",
      "q": 7,
      "r": -4,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+1% to Critical Chance",
        "Critical Damage Bonus against Chilled enemies is doubled (design text)"
      ],
      "stat": "critChance",
      "amount": 1,
      "tags": [],
      "clusterId": "drowned-high",
      "status": "review",
      "notes": "",
      "name": "Critical Chance"
    },
    "7,-5": {
      "id": "7,-5",
      "q": 7,
      "r": -5,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 10,
      "tags": [],
      "clusterId": "drowned-high",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "7,-6": {
      "id": "7,-6",
      "q": 7,
      "r": -6,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12% to Cold Resistance"
      ],
      "stat": "river_resistance",
      "amount": 12,
      "tags": [],
      "clusterId": "drowned-high",
      "status": "review",
      "notes": "",
      "name": "Cold Resistance"
    },
    "7,-7": {
      "id": "7,-7",
      "q": 7,
      "r": -7,
      "ring": 7,
      "type": "class",
      "axis": "hybrid",
      "effects": [
        "+12% increased Ailment Effect",
        "Unlocks: trap and mark tools become equippable",
        "Unlocks: venom vial slot",
        "Unlocks: 4x4 Preparation Case",
        "Your first class passive sets your class; each class passive grants its unlock."
      ],
      "stat": "ailmentEffect",
      "amount": 12,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Assassin"
    },
    "6,-7": {
      "id": "6,-7",
      "q": 6,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+9% increased Evasion"
      ],
      "stat": "evasion_increased",
      "amount": 9,
      "tags": [],
      "clusterId": "unlit-high",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "5,-7": {
      "id": "5,-7",
      "q": 5,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+12% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 12,
      "tags": [],
      "clusterId": "unlit-high",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "4,-7": {
      "id": "4,-7",
      "q": 4,
      "r": -7,
      "ring": 7,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+22% increased Ailment Effect",
        "+8% increased Attack Speed",
        "Your traps arm instantly (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 22,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Instant Traps"
    },
    "3,-7": {
      "id": "3,-7",
      "q": 3,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+10% increased Ailment Effect",
        "Your second poison on a target is 25% stronger (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 10,
      "tags": [],
      "clusterId": "unlit-high",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "2,-7": {
      "id": "2,-7",
      "q": 2,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+1% to Critical Chance"
      ],
      "stat": "critChance",
      "amount": 1,
      "tags": [],
      "clusterId": "unlit-high",
      "status": "review",
      "notes": "",
      "name": "Critical Chance"
    },
    "1,-7": {
      "id": "1,-7",
      "q": 1,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "unlit-high",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "0,-7": {
      "id": "0,-7",
      "q": 0,
      "r": -7,
      "ring": 7,
      "type": "class",
      "axis": "dex",
      "effects": [
        "+12% increased Evasion",
        "Unlocks: a second weapon set for swapping",
        "Unlocks: dual-wielding one-handers",
        "Unlocks: 2x2 Quick Rig seat",
        "Your first class passive sets your class; each class passive grants its unlock."
      ],
      "stat": "evasion_increased",
      "amount": 12,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Acrobat"
    },
    "-1,-6": {
      "id": "-1,-6",
      "q": -1,
      "r": -6,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+10% increased Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "high-high",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-2,-5": {
      "id": "-2,-5",
      "q": -2,
      "r": -5,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+12% to Lightning Resistance"
      ],
      "stat": "storm_res",
      "amount": 12,
      "tags": [],
      "clusterId": "high-high",
      "status": "review",
      "notes": "",
      "name": "Lightning Resistance"
    },
    "-3,-4": {
      "id": "-3,-4",
      "q": -3,
      "r": -4,
      "ring": 7,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+8% increased Movement Speed",
        "+18% increased Projectile Damage",
        "Moving downhill, your shots pierce (design text)"
      ],
      "stat": "move",
      "amount": 8,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Downhill Pierce"
    },
    "-4,-3": {
      "id": "-4,-3",
      "q": -4,
      "r": -3,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5% increased Movement Speed",
        "Sprinting charges your next shot with Lightning damage (design text)"
      ],
      "stat": "move",
      "amount": 5,
      "tags": [],
      "clusterId": "high-high",
      "status": "review",
      "notes": "",
      "name": "Movement Speed"
    },
    "-5,-2": {
      "id": "-5,-2",
      "q": -5,
      "r": -2,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+45 to Accuracy"
      ],
      "stat": "accuracy_flat",
      "amount": 45,
      "tags": [],
      "clusterId": "high-high",
      "status": "review",
      "notes": "",
      "name": "Accuracy"
    },
    "-6,-1": {
      "id": "-6,-1",
      "q": -6,
      "r": -1,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+9% increased Evasion"
      ],
      "stat": "evasion_increased",
      "amount": 9,
      "tags": [],
      "clusterId": "high-high",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-7,0": {
      "id": "-7,0",
      "q": -7,
      "r": 0,
      "ring": 7,
      "type": "class",
      "axis": "hybrid",
      "effects": [
        "+12% increased Projectile Damage",
        "Unlocks: thrown weapons count as melee AND projectile",
        "Unlocks: belt fetish slot",
        "Unlocks: 4x4 Spoils Roll",
        "Your first class passive sets your class; each class passive grants its unlock."
      ],
      "stat": "projectileDamage",
      "amount": 12,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Reaver"
    },
    "-7,1": {
      "id": "-7,1",
      "q": -7,
      "r": 1,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "red-high",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-7,2": {
      "id": "-7,2",
      "q": -7,
      "r": 2,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+8% increased Reach"
      ],
      "stat": "reach_increased",
      "amount": 8,
      "tags": [],
      "clusterId": "red-high",
      "status": "review",
      "notes": "",
      "name": "Reach"
    },
    "-7,3": {
      "id": "-7,3",
      "q": -7,
      "r": 3,
      "ring": 7,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+24% increased Attack Damage",
        "+10% increased Ailment Effect",
        "Kills against Bleeding enemies heal you 15 Life (design text)"
      ],
      "stat": "attackDamage",
      "amount": 24,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Life on Bleeding Kill"
    },
    "-7,4": {
      "id": "-7,4",
      "q": -7,
      "r": 4,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+9% increased Guard"
      ],
      "stat": "guard_increased",
      "amount": 9,
      "tags": [],
      "clusterId": "red-high",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-7,5": {
      "id": "-7,5",
      "q": -7,
      "r": 5,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Attack Damage",
        "Each Bleeding enemy adds +2% Attack Damage (design text)"
      ],
      "stat": "attackDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "red-high",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "-7,6": {
      "id": "-7,6",
      "q": -7,
      "r": 6,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 10,
      "tags": [],
      "clusterId": "red-high",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-8,8": {
      "id": "-8,8",
      "q": -8,
      "r": 8,
      "ring": 8,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+20% increased Guard",
        "+15% increased Attack Damage",
        "While you have not moved recently, +15% Poise (design text)"
      ],
      "stat": "guard_increased",
      "amount": 20,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Steady Stance"
    },
    "-7,8": {
      "id": "-7,8",
      "q": -7,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+11% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 11,
      "tags": [],
      "clusterId": "kiln-sign",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-6,8": {
      "id": "-6,8",
      "q": -6,
      "r": 8,
      "ring": 8,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+15% to Fire Resistance",
        "+18% increased Ailment Effect",
        "Enemies that survive your Ignite take +20% Fire damage from you (design text)"
      ],
      "stat": "ember_res",
      "amount": 15,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Ignite Exposure"
    },
    "-5,8": {
      "id": "-5,8",
      "q": -5,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+30 to Guard"
      ],
      "stat": "guard",
      "amount": 30,
      "tags": [],
      "clusterId": "kiln-sign",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-4,8": {
      "id": "-4,8",
      "q": -4,
      "r": 8,
      "ring": 8,
      "type": "sign",
      "axis": "str",
      "effects": [
        "Your Ignites never expire on enemies below half Life",
        "You take 20% increased Cold damage",
        "You can have only one Sign."
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Sign: Unending Ignites"
    },
    "-3,8": {
      "id": "-3,8",
      "q": -3,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Rite Damage",
        "+4% increased Ailment Effect (design text)"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "kiln-sign",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "-2,8": {
      "id": "-2,8",
      "q": -2,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "Adds 6 Fire Damage to hits"
      ],
      "stat": "emberkiss",
      "amount": 6,
      "tags": [],
      "clusterId": "kiln-sign",
      "status": "review",
      "notes": "",
      "name": "Added Fire Damage"
    },
    "-1,8": {
      "id": "-1,8",
      "q": -1,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Attack Damage"
      ],
      "stat": "attackDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "kiln-sign",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "0,8": {
      "id": "0,8",
      "q": 0,
      "r": 8,
      "ring": 8,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+20% increased Companion Damage",
        "+20 to Ward",
        "Your companion shares your resistances (design text)"
      ],
      "stat": "minionDamage",
      "amount": 20,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Shared Resistances"
    },
    "1,7": {
      "id": "1,7",
      "q": 1,
      "r": 7,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-sign",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "2,6": {
      "id": "2,6",
      "q": 2,
      "r": 6,
      "ring": 8,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+20% increased Ward",
        "+10 to Spirit",
        "Your Ward does not break from Chaos damage while a rite is maintained (design text)"
      ],
      "stat": "ward_pct",
      "amount": 20,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Steady Ward"
    },
    "3,5": {
      "id": "3,5",
      "q": 3,
      "r": 5,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+25 to Ward"
      ],
      "stat": "ward",
      "amount": 25,
      "tags": [],
      "clusterId": "procession-sign",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "4,4": {
      "id": "4,4",
      "q": 4,
      "r": 4,
      "ring": 8,
      "type": "sign",
      "axis": "int",
      "effects": [
        "Your Ward recharges even while you take damage",
        "Your Ward is 30% smaller",
        "You can have only one Sign."
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Sign: Ward Under Fire"
    },
    "5,3": {
      "id": "5,3",
      "q": 5,
      "r": 3,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12 to Spirit"
      ],
      "stat": "spirit",
      "amount": 12,
      "tags": [],
      "clusterId": "procession-sign",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "6,2": {
      "id": "6,2",
      "q": 6,
      "r": 2,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% increased Companion Damage",
        "Your companion taunts when you raise a banner (design text)"
      ],
      "stat": "minionDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-sign",
      "status": "review",
      "notes": "",
      "name": "Companion Damage"
    },
    "7,1": {
      "id": "7,1",
      "q": 7,
      "r": 1,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-sign",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "8,0": {
      "id": "8,0",
      "q": 8,
      "r": 0,
      "ring": 8,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+18% increased Ward",
        "+12% increased Rite Damage",
        "You keep 10% of Ward when a hit would empty it (design text)"
      ],
      "stat": "ward_pct",
      "amount": 18,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Ward Retention"
    },
    "8,-1": {
      "id": "8,-1",
      "q": 8,
      "r": -1,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+11% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 11,
      "tags": [],
      "clusterId": "drowned-sign",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "8,-2": {
      "id": "8,-2",
      "q": 8,
      "r": -2,
      "ring": 8,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+12% to Cold Resistance",
        "+18% increased Rite Damage",
        "Frozen enemies shatter for Cold damage around them (design text)"
      ],
      "stat": "river_resistance",
      "amount": 12,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Shattering Freeze"
    },
    "8,-3": {
      "id": "8,-3",
      "q": 8,
      "r": -3,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+11% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 11,
      "tags": [],
      "clusterId": "drowned-sign",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "8,-4": {
      "id": "8,-4",
      "q": 8,
      "r": -4,
      "ring": 8,
      "type": "sign",
      "axis": "int",
      "effects": [
        "Enemies you Chill are also Marked",
        "Your Ignites expire twice as fast",
        "You can have only one Sign."
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Sign: Mark Chilled Enemies"
    },
    "8,-5": {
      "id": "8,-5",
      "q": 8,
      "r": -5,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+26 to Ward",
        "Enemies that cross toward you are slowed (design text)"
      ],
      "stat": "ward",
      "amount": 26,
      "tags": [],
      "clusterId": "drowned-sign",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "8,-6": {
      "id": "8,-6",
      "q": 8,
      "r": -6,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5% increased Rite Speed"
      ],
      "stat": "castSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "drowned-sign",
      "status": "review",
      "notes": "",
      "name": "Rite Speed"
    },
    "8,-7": {
      "id": "8,-7",
      "q": 8,
      "r": -7,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12% to Cold Resistance"
      ],
      "stat": "river_resistance",
      "amount": 12,
      "tags": [],
      "clusterId": "drowned-sign",
      "status": "review",
      "notes": "",
      "name": "Cold Resistance"
    },
    "8,-8": {
      "id": "8,-8",
      "q": 8,
      "r": -8,
      "ring": 8,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+20% increased Ailment Effect",
        "+1.5% to Critical Chance",
        "Poisons you inflict on marked enemies deal 15% more (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 20,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Poison Marked Enemies"
    },
    "7,-8": {
      "id": "7,-8",
      "q": 7,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+11% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 11,
      "tags": [],
      "clusterId": "unlit-sign",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "6,-8": {
      "id": "6,-8",
      "q": 6,
      "r": -8,
      "ring": 8,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+2% to Critical Chance",
        "+15% increased Ailment Effect",
        "Your first strike from hiding always poisons (design text)"
      ],
      "stat": "critChance",
      "amount": 2,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Poison from Hiding"
    },
    "5,-8": {
      "id": "5,-8",
      "q": 5,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+32 to Evasion"
      ],
      "stat": "evasion",
      "amount": 32,
      "tags": [],
      "clusterId": "unlit-sign",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "4,-8": {
      "id": "4,-8",
      "q": 4,
      "r": -8,
      "ring": 8,
      "type": "sign",
      "axis": "dex",
      "effects": [
        "Your poisons spread on kill",
        "You cannot Block",
        "You can have only one Sign."
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Sign: Spreading Poison"
    },
    "3,-8": {
      "id": "3,-8",
      "q": 3,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+12% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 12,
      "tags": [],
      "clusterId": "unlit-sign",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "2,-8": {
      "id": "2,-8",
      "q": 2,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+4 to all Attributes",
        "Goods you find are worth 10% more (design text)"
      ],
      "stat": "attrs",
      "amount": 4,
      "tags": [],
      "clusterId": "unlit-sign",
      "status": "review",
      "notes": "",
      "name": "All Attributes"
    },
    "1,-8": {
      "id": "1,-8",
      "q": 1,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+1% to Critical Chance"
      ],
      "stat": "critChance",
      "amount": 1,
      "tags": [],
      "clusterId": "unlit-sign",
      "status": "review",
      "notes": "",
      "name": "Critical Chance"
    },
    "0,-8": {
      "id": "0,-8",
      "q": 0,
      "r": -8,
      "ring": 8,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+22% increased Evasion",
        "+5% increased Movement Speed",
        "Evading a hit hastens your next action by 10% (design text)"
      ],
      "stat": "evasion_increased",
      "amount": 22,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Evasion Haste"
    },
    "-1,-7": {
      "id": "-1,-7",
      "q": -1,
      "r": -7,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+11% increased Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 11,
      "tags": [],
      "clusterId": "high-sign",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-2,-6": {
      "id": "-2,-6",
      "q": -2,
      "r": -6,
      "ring": 8,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+12% to Lightning Resistance",
        "+18% increased Projectile Damage",
        "Your Shocks chain once to the nearest enemy (design text)"
      ],
      "stat": "storm_res",
      "amount": 12,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Chaining Shock"
    },
    "-3,-5": {
      "id": "-3,-5",
      "q": -3,
      "r": -5,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+11% increased Ailment Effect",
        "Once per fight, your Shock becomes a strike (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 11,
      "tags": [],
      "clusterId": "high-sign",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-4,-4": {
      "id": "-4,-4",
      "q": -4,
      "r": -4,
      "ring": 8,
      "type": "sign",
      "axis": "dex",
      "effects": [
        "Your Shocks stack twice as high",
        "+15% increased Lightning damage taken",
        "You can have only one Sign."
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Sign: Double Shock Stacks"
    },
    "-5,-3": {
      "id": "-5,-3",
      "q": -5,
      "r": -3,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+50 to Accuracy"
      ],
      "stat": "accuracy_flat",
      "amount": 50,
      "tags": [],
      "clusterId": "high-sign",
      "status": "review",
      "notes": "",
      "name": "Accuracy"
    },
    "-6,-2": {
      "id": "-6,-2",
      "q": -6,
      "r": -2,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+32 to Evasion"
      ],
      "stat": "evasion",
      "amount": 32,
      "tags": [],
      "clusterId": "high-sign",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-7,-1": {
      "id": "-7,-1",
      "q": -7,
      "r": -1,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+12% to Lightning Resistance"
      ],
      "stat": "storm_res",
      "amount": 12,
      "tags": [],
      "clusterId": "high-sign",
      "status": "review",
      "notes": "",
      "name": "Lightning Resistance"
    },
    "-8,0": {
      "id": "-8,0",
      "q": -8,
      "r": 0,
      "ring": 8,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+12% increased Attack Speed",
        "+15% increased Projectile Damage",
        "Your throws return to hand on kill (design text)"
      ],
      "stat": "attackSpeed",
      "amount": 12,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Returning Throws"
    },
    "-8,1": {
      "id": "-8,1",
      "q": -8,
      "r": 1,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+28 to Life"
      ],
      "stat": "life",
      "amount": 28,
      "tags": [],
      "clusterId": "red-sign",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-8,2": {
      "id": "-8,2",
      "q": -8,
      "r": 2,
      "ring": 8,
      "type": "notable",
      "axis": "str",
      "effects": [
        "Adds 8 Physical Damage to hits",
        "+15% increased Attack Damage",
        "Your stuns last 25% longer (design text)"
      ],
      "stat": "heavy",
      "amount": 8,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Longer Stuns"
    },
    "-8,3": {
      "id": "-8,3",
      "q": -8,
      "r": 3,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+11% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 11,
      "tags": [],
      "clusterId": "red-sign",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-8,4": {
      "id": "-8,4",
      "q": -8,
      "r": 4,
      "ring": 8,
      "type": "sign",
      "axis": "str",
      "effects": [
        "Your actions cannot be interrupted while your Poise holds",
        "You cannot dodge or give ground",
        "You can have only one Sign."
      ],
      "stat": null,
      "amount": 0,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Sign: Unstoppable"
    },
    "-8,5": {
      "id": "-8,5",
      "q": -8,
      "r": 5,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Attack Damage",
        "Enemies you stun are trampled for extra Physical (design text)"
      ],
      "stat": "attackDamage",
      "amount": 10,
      "tags": [],
      "clusterId": "red-sign",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "-8,6": {
      "id": "-8,6",
      "q": -8,
      "r": 6,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+30 to Guard"
      ],
      "stat": "guard",
      "amount": 30,
      "tags": [],
      "clusterId": "red-sign",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-8,7": {
      "id": "-8,7",
      "q": -8,
      "r": 7,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Physical Damage"
      ],
      "stat": "physical_increased",
      "amount": 10,
      "tags": [],
      "clusterId": "red-sign",
      "status": "review",
      "notes": "",
      "name": "Physical Damage"
    },
    "-9,9": {
      "id": "-9,9",
      "q": -9,
      "r": 9,
      "ring": 9,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+40 to Life",
        "+18% increased Attack Damage",
        "Out-of-combat Life regeneration starts 25% sooner (design text)"
      ],
      "stat": "life",
      "amount": 40,
      "tags": [],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Faster Recovery"
    },
    "-8,9": {
      "id": "-8,9",
      "q": -8,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+11% increased Guard"
      ],
      "stat": "guard_increased",
      "amount": 11,
      "tags": [],
      "clusterId": "kiln-deep",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-7,9": {
      "id": "-7,9",
      "q": -7,
      "r": 9,
      "ring": 9,
      "type": "notable",
      "axis": "str",
      "effects": [
        "Adds 10 Fire Damage to hits",
        "+15% increased Attack Speed while any enemy is Ignited (design text)"
      ],
      "stat": "emberkiss",
      "amount": 10,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Ignite Attack Speed"
    },
    "-6,9": {
      "id": "-6,9",
      "q": -6,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+12% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 12,
      "tags": [],
      "clusterId": "kiln-deep",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-5,9": {
      "id": "-5,9",
      "q": -5,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+14% to Fire Resistance",
        "You cannot be Ignited while at full Life (design text)"
      ],
      "stat": "ember_res",
      "amount": 14,
      "tags": [],
      "clusterId": "kiln-deep",
      "status": "review",
      "notes": "",
      "name": "Fire Resistance"
    },
    "-4,9": {
      "id": "-4,9",
      "q": -4,
      "r": 9,
      "ring": 9,
      "type": "socket",
      "axis": "str",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "kiln-line-sockets",
      "status": "review",
      "notes": "",
      "name": "Outer Fire Jewel Socket"
    },
    "-3,9": {
      "id": "-3,9",
      "q": -3,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+25 to Life"
      ],
      "stat": "life",
      "amount": 25,
      "tags": [],
      "clusterId": "kiln-deep",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-2,9": {
      "id": "-2,9",
      "q": -2,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "Adds 6 Fire Damage to hits"
      ],
      "stat": "emberkiss",
      "amount": 6,
      "tags": [],
      "clusterId": "kiln-deep",
      "status": "review",
      "notes": "",
      "name": "Added Fire Damage"
    },
    "-1,9": {
      "id": "-1,9",
      "q": -1,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "kiln-deep",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "0,9": {
      "id": "0,9",
      "q": 0,
      "r": 9,
      "ring": 9,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+26% increased Rite Damage",
        "+20 to Spirit",
        "Rites you maintain persist 3 seconds after you fall (design text)"
      ],
      "stat": "spellDamage",
      "amount": 26,
      "tags": [],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Lingering Rites"
    },
    "1,8": {
      "id": "1,8",
      "q": 1,
      "r": 8,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+10% increased Ward"
      ],
      "stat": "ward_pct",
      "amount": 10,
      "tags": [],
      "clusterId": "procession-deep",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "2,7": {
      "id": "2,7",
      "q": 2,
      "r": 7,
      "ring": 9,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+28% increased Companion Damage",
        "You may keep one additional companion (design text)"
      ],
      "stat": "minionDamage",
      "amount": 28,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Extra Companion"
    },
    "3,6": {
      "id": "3,6",
      "q": 3,
      "r": 6,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+11% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 11,
      "tags": [],
      "clusterId": "procession-deep",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "4,5": {
      "id": "4,5",
      "q": 4,
      "r": 5,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 12,
      "tags": [],
      "clusterId": "procession-deep",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "5,4": {
      "id": "5,4",
      "q": 5,
      "r": 4,
      "ring": 9,
      "type": "socket",
      "axis": "int",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "procession-sockets",
      "status": "review",
      "notes": "",
      "name": "Outer Companion Jewel Socket"
    },
    "6,3": {
      "id": "6,3",
      "q": 6,
      "r": 3,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+11% increased Companion Damage",
        "Your companion picks up what you leave behind (design text)"
      ],
      "stat": "minionDamage",
      "amount": 11,
      "tags": [],
      "clusterId": "procession-deep",
      "status": "review",
      "notes": "",
      "name": "Companion Damage"
    },
    "7,2": {
      "id": "7,2",
      "q": 7,
      "r": 2,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+28 to Ward"
      ],
      "stat": "ward",
      "amount": 28,
      "tags": [],
      "clusterId": "procession-deep",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "8,1": {
      "id": "8,1",
      "q": 8,
      "r": 1,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+14 to Spirit"
      ],
      "stat": "spirit",
      "amount": 14,
      "tags": [],
      "clusterId": "procession-deep",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "9,0": {
      "id": "9,0",
      "q": 9,
      "r": 0,
      "ring": 9,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+30% increased Rite Damage",
        "+30 to Ward",
        "Rites cost 5% less Spirit (design text)"
      ],
      "stat": "spellDamage",
      "amount": 30,
      "tags": [],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Efficient Rites"
    },
    "9,-1": {
      "id": "9,-1",
      "q": 9,
      "r": -1,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12% increased Rite Damage"
      ],
      "stat": "spellDamage",
      "amount": 12,
      "tags": [],
      "clusterId": "drowned-deep",
      "status": "review",
      "notes": "",
      "name": "Rite Damage"
    },
    "9,-2": {
      "id": "9,-2",
      "q": 9,
      "r": -2,
      "ring": 9,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+24% increased Ailment Effect",
        "+15 to Ward",
        "Chill builds to Freeze 20% sooner (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 24,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Faster Freeze"
    },
    "9,-3": {
      "id": "9,-3",
      "q": 9,
      "r": -3,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+10% to Chaos Resistance"
      ],
      "stat": "gloam_res",
      "amount": 10,
      "tags": [],
      "clusterId": "drowned-deep",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "9,-4": {
      "id": "9,-4",
      "q": 9,
      "r": -4,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12% increased Ailment Effect",
        "Enemies Frozen by you thaw 50% slower (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 12,
      "tags": [],
      "clusterId": "drowned-deep",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "9,-5": {
      "id": "9,-5",
      "q": 9,
      "r": -5,
      "ring": 9,
      "type": "socket",
      "axis": "int",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "drowned-study-sockets",
      "status": "review",
      "notes": "",
      "name": "Outer Cold Jewel Socket"
    },
    "9,-6": {
      "id": "9,-6",
      "q": 9,
      "r": -6,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+30 to Ward"
      ],
      "stat": "ward",
      "amount": 30,
      "tags": [],
      "clusterId": "drowned-deep",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "9,-7": {
      "id": "9,-7",
      "q": 9,
      "r": -7,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5% increased Rite Speed"
      ],
      "stat": "castSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "drowned-deep",
      "status": "review",
      "notes": "",
      "name": "Rite Speed"
    },
    "9,-8": {
      "id": "9,-8",
      "q": 9,
      "r": -8,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+14 to Spirit"
      ],
      "stat": "spirit",
      "amount": 14,
      "tags": [],
      "clusterId": "drowned-deep",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "9,-9": {
      "id": "9,-9",
      "q": 9,
      "r": -9,
      "ring": 9,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+15% to Chaos Resistance",
        "+22% increased Ailment Effect",
        "Enemies that kill your allies are marked for you (design text)"
      ],
      "stat": "gloam_res",
      "amount": 15,
      "tags": [],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Mark Ally Killers"
    },
    "8,-9": {
      "id": "8,-9",
      "q": 8,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+10% increased Evasion"
      ],
      "stat": "evasion_increased",
      "amount": 10,
      "tags": [],
      "clusterId": "unlit-deep",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "7,-9": {
      "id": "7,-9",
      "q": 7,
      "r": -9,
      "ring": 9,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+14% to Chaos Resistance",
        "+20% increased Ailment Effect",
        "Wither you inflict cannot be cleansed (design text)"
      ],
      "stat": "gloam_res",
      "amount": 14,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Lasting Wither"
    },
    "6,-9": {
      "id": "6,-9",
      "q": 6,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+12% increased Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 12,
      "tags": [],
      "clusterId": "unlit-deep",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "5,-9": {
      "id": "5,-9",
      "q": 5,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+14% to Chaos Resistance",
        "Wither you suffer drains 30% slower (design text)"
      ],
      "stat": "gloam_res",
      "amount": 14,
      "tags": [],
      "clusterId": "unlit-deep",
      "status": "review",
      "notes": "",
      "name": "Chaos Resistance"
    },
    "4,-9": {
      "id": "4,-9",
      "q": 4,
      "r": -9,
      "ring": 9,
      "type": "socket",
      "axis": "dex",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "unlit-road-sockets",
      "status": "review",
      "notes": "",
      "name": "Outer Poison Jewel Socket"
    },
    "3,-9": {
      "id": "3,-9",
      "q": 3,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+1% to Critical Chance"
      ],
      "stat": "critChance",
      "amount": 1,
      "tags": [],
      "clusterId": "unlit-deep",
      "status": "review",
      "notes": "",
      "name": "Critical Chance"
    },
    "2,-9": {
      "id": "2,-9",
      "q": 2,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+35 to Evasion"
      ],
      "stat": "evasion",
      "amount": 35,
      "tags": [],
      "clusterId": "unlit-deep",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "1,-9": {
      "id": "1,-9",
      "q": 1,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+6 to Dexterity"
      ],
      "stat": "dex",
      "amount": 6,
      "tags": [],
      "clusterId": "unlit-deep",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "0,-9": {
      "id": "0,-9",
      "q": 0,
      "r": -9,
      "ring": 9,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+25% to Critical Damage Bonus",
        "+50 to Accuracy",
        "Hits against enemies that just missed you gain +1% Critical Chance (design text)"
      ],
      "stat": "crit_bonus_flat",
      "amount": 25,
      "tags": [],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Punish Misses"
    },
    "-1,-8": {
      "id": "-1,-8",
      "q": -1,
      "r": -8,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+12% increased Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 12,
      "tags": [],
      "clusterId": "high-deep",
      "status": "review",
      "notes": "",
      "name": "Projectile Damage"
    },
    "-2,-7": {
      "id": "-2,-7",
      "q": -2,
      "r": -7,
      "ring": 9,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+70 to Accuracy",
        "+15% increased Projectile Damage",
        "Your misses at long range are rerolled once (design text)"
      ],
      "stat": "accuracy_flat",
      "amount": 70,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Long-Range Accuracy"
    },
    "-3,-6": {
      "id": "-3,-6",
      "q": -3,
      "r": -6,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5% increased Movement Speed"
      ],
      "stat": "move",
      "amount": 5,
      "tags": [],
      "clusterId": "high-deep",
      "status": "review",
      "notes": "",
      "name": "Movement Speed"
    },
    "-4,-5": {
      "id": "-4,-5",
      "q": -4,
      "r": -5,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+14% to Lightning Resistance",
        "You cannot be Shocked while moving (design text)"
      ],
      "stat": "storm_res",
      "amount": 14,
      "tags": [],
      "clusterId": "high-deep",
      "status": "review",
      "notes": "",
      "name": "Lightning Resistance"
    },
    "-5,-4": {
      "id": "-5,-4",
      "q": -5,
      "r": -4,
      "ring": 9,
      "type": "socket",
      "axis": "dex",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "high-paths-sockets",
      "status": "review",
      "notes": "",
      "name": "Outer Projectile Jewel Socket"
    },
    "-6,-3": {
      "id": "-6,-3",
      "q": -6,
      "r": -3,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+10% increased Evasion"
      ],
      "stat": "evasion_increased",
      "amount": 10,
      "tags": [],
      "clusterId": "high-deep",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-7,-2": {
      "id": "-7,-2",
      "q": -7,
      "r": -2,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+6 to Dexterity"
      ],
      "stat": "dex",
      "amount": 6,
      "tags": [],
      "clusterId": "high-deep",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "-8,-1": {
      "id": "-8,-1",
      "q": -8,
      "r": -1,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+50 to Accuracy"
      ],
      "stat": "accuracy_flat",
      "amount": 50,
      "tags": [],
      "clusterId": "high-deep",
      "status": "review",
      "notes": "",
      "name": "Accuracy"
    },
    "-9,0": {
      "id": "-9,0",
      "q": -9,
      "r": 0,
      "ring": 9,
      "type": "notable",
      "axis": "hybrid",
      "effects": [
        "+28% increased Projectile Damage",
        "+40 to Accuracy",
        "Missed throws can be recovered where they landed (design text)"
      ],
      "stat": "projectileDamage",
      "amount": 28,
      "tags": [],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Recovered Throws"
    },
    "-9,1": {
      "id": "-9,1",
      "q": -9,
      "r": 1,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+11% increased Attack Damage"
      ],
      "stat": "attackDamage",
      "amount": 11,
      "tags": [],
      "clusterId": "red-deep",
      "status": "review",
      "notes": "",
      "name": "Attack Damage"
    },
    "-9,2": {
      "id": "-9,2",
      "q": -9,
      "r": 2,
      "ring": 9,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+45 to Life",
        "+16% increased Attack Damage",
        "Each enemy in reach adds +4% to your damage (design text)"
      ],
      "stat": "life",
      "amount": 45,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Damage per Nearby Enemy"
    },
    "-9,3": {
      "id": "-9,3",
      "q": -9,
      "r": 3,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+30 to Life"
      ],
      "stat": "life",
      "amount": 30,
      "tags": [],
      "clusterId": "red-deep",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-9,4": {
      "id": "-9,4",
      "q": -9,
      "r": 4,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+12% increased Ailment Effect",
        "Your Bleeds remember: reapplying restores full duration (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 12,
      "tags": [],
      "clusterId": "red-deep",
      "status": "review",
      "notes": "",
      "name": "Ailment Effect"
    },
    "-9,5": {
      "id": "-9,5",
      "q": -9,
      "r": 5,
      "ring": 9,
      "type": "socket",
      "axis": "str",
      "effects": [
        "Empty jewel socket.",
        "Socket a jewel to gain its effect."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "socket"
      ],
      "clusterId": "red-field-sockets",
      "status": "review",
      "notes": "",
      "name": "Outer Physical Jewel Socket"
    },
    "-9,6": {
      "id": "-9,6",
      "q": -9,
      "r": 6,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+10% increased Reach"
      ],
      "stat": "reach_increased",
      "amount": 10,
      "tags": [],
      "clusterId": "red-deep",
      "status": "review",
      "notes": "",
      "name": "Reach"
    },
    "-9,7": {
      "id": "-9,7",
      "q": -9,
      "r": 7,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5% increased Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 5,
      "tags": [],
      "clusterId": "red-deep",
      "status": "review",
      "notes": "",
      "name": "Attack Speed"
    },
    "-9,8": {
      "id": "-9,8",
      "q": -9,
      "r": 8,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "effects": [
        "+32 to Guard"
      ],
      "stat": "guard",
      "amount": 32,
      "tags": [],
      "clusterId": "red-deep",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-10,10": {
      "id": "-10,10",
      "q": -10,
      "r": 10,
      "ring": 10,
      "type": "gateway",
      "axis": "str",
      "effects": [
        "Gate to the Champion outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "gateway",
        "Champion"
      ],
      "clusterId": "str-spoke",
      "status": "review",
      "notes": "",
      "name": "Champion Gate"
    },
    "-9,10": {
      "id": "-9,10",
      "q": -9,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "kiln-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "-8,10": {
      "id": "-8,10",
      "q": -8,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "kiln-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "-7,10": {
      "id": "-7,10",
      "q": -7,
      "r": 10,
      "ring": 10,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+26% increased Ailment Effect",
        "Enemies you kill while Ignited ignite their nearest ally (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 26,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Spreading Ignites"
    },
    "-6,10": {
      "id": "-6,10",
      "q": -6,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "kiln-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "-5,10": {
      "id": "-5,10",
      "q": -5,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+22 to Life",
        "Out-of-combat Life regeneration starts 10% sooner (design text)"
      ],
      "stat": "life",
      "amount": 22,
      "tags": [],
      "clusterId": "kiln-frontier",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-4,10": {
      "id": "-4,10",
      "q": -4,
      "r": 10,
      "ring": 10,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+22% increased Guard",
        "+12% to Fire Resistance",
        "Ground you stand on cannot burn you (design text)"
      ],
      "stat": "guard_increased",
      "amount": 22,
      "tags": [],
      "clusterId": "kiln-line-named",
      "status": "review",
      "notes": "",
      "name": "Burning Ground Immunity"
    },
    "-3,10": {
      "id": "-3,10",
      "q": -3,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "kiln-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "-2,10": {
      "id": "-2,10",
      "q": -2,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+3 to all Attributes"
      ],
      "stat": "attrs",
      "amount": 3,
      "tags": [],
      "clusterId": "kiln-frontier",
      "status": "review",
      "notes": "",
      "name": "All Attributes"
    },
    "-1,10": {
      "id": "-1,10",
      "q": -1,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "kiln-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "0,10": {
      "id": "0,10",
      "q": 0,
      "r": 10,
      "ring": 10,
      "type": "gateway",
      "axis": "hybrid",
      "effects": [
        "Gate to the Ritualist outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "gateway",
        "Ritualist"
      ],
      "clusterId": "ritualist-spoke",
      "status": "review",
      "notes": "",
      "name": "Ritualist Gate"
    },
    "1,9": {
      "id": "1,9",
      "q": 1,
      "r": 9,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "procession-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "2,8": {
      "id": "2,8",
      "q": 2,
      "r": 8,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+3 to all Attributes",
        "Your next rite costs no Spirit (design text)"
      ],
      "stat": "attrs",
      "amount": 3,
      "tags": [],
      "clusterId": "procession-frontier",
      "status": "review",
      "notes": "",
      "name": "All Attributes"
    },
    "3,7": {
      "id": "3,7",
      "q": 3,
      "r": 7,
      "ring": 10,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+50 to Ward",
        "Ward gained from this passive counts as a rite for your keystones (design text)"
      ],
      "stat": "ward",
      "amount": 50,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Ward Counts as Rite"
    },
    "4,6": {
      "id": "4,6",
      "q": 4,
      "r": 6,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "procession-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "5,5": {
      "id": "5,5",
      "q": 5,
      "r": 5,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+12 to Spirit"
      ],
      "stat": "spirit",
      "amount": 12,
      "tags": [],
      "clusterId": "procession-frontier",
      "status": "review",
      "notes": "",
      "name": "Spirit"
    },
    "6,4": {
      "id": "6,4",
      "q": 6,
      "r": 4,
      "ring": 10,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+30 to Spirit",
        "+12% increased Companion Damage",
        "Kills during your rites feed 5 Spirit back (design text)"
      ],
      "stat": "spirit",
      "amount": 30,
      "tags": [],
      "clusterId": "procession-named",
      "status": "review",
      "notes": "",
      "name": "Spirit on Kill"
    },
    "7,3": {
      "id": "7,3",
      "q": 7,
      "r": 3,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "procession-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "8,2": {
      "id": "8,2",
      "q": 8,
      "r": 2,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+20 to Ward"
      ],
      "stat": "ward",
      "amount": 20,
      "tags": [],
      "clusterId": "procession-frontier",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "9,1": {
      "id": "9,1",
      "q": 9,
      "r": 1,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "procession-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "10,0": {
      "id": "10,0",
      "q": 10,
      "r": 0,
      "ring": 10,
      "type": "gateway",
      "axis": "int",
      "effects": [
        "Gate to the Archmage outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "gateway",
        "Archmage"
      ],
      "clusterId": "int-spoke",
      "status": "review",
      "notes": "",
      "name": "Archmage Gate"
    },
    "10,-1": {
      "id": "10,-1",
      "q": 10,
      "r": -1,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "drowned-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "10,-2": {
      "id": "10,-2",
      "q": 10,
      "r": -2,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+3 to all Attributes"
      ],
      "stat": "attrs",
      "amount": 3,
      "tags": [],
      "clusterId": "drowned-frontier",
      "status": "review",
      "notes": "",
      "name": "All Attributes"
    },
    "10,-3": {
      "id": "10,-3",
      "q": 10,
      "r": -3,
      "ring": 10,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+30% increased Rite Damage",
        "Once rung, your next rite Chills everything it touches (design text)"
      ],
      "stat": "spellDamage",
      "amount": 30,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Chilling Rite"
    },
    "10,-4": {
      "id": "10,-4",
      "q": 10,
      "r": -4,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5 to Dexterity",
        "You are hard to mark in the mist (design text)"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "drowned-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "10,-5": {
      "id": "10,-5",
      "q": 10,
      "r": -5,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "drowned-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "10,-6": {
      "id": "10,-6",
      "q": 10,
      "r": -6,
      "ring": 10,
      "type": "notable",
      "axis": "int",
      "effects": [
        "+45 to Ward",
        "+10% increased Ailment Effect",
        "Marked enemies cannot see you beyond short range (design text)"
      ],
      "stat": "ward",
      "amount": 45,
      "tags": [],
      "clusterId": "drowned-study-named",
      "status": "review",
      "notes": "",
      "name": "Blinding Marks"
    },
    "10,-7": {
      "id": "10,-7",
      "q": 10,
      "r": -7,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+20 to Ward"
      ],
      "stat": "ward",
      "amount": 20,
      "tags": [],
      "clusterId": "drowned-frontier",
      "status": "review",
      "notes": "",
      "name": "Ward"
    },
    "10,-8": {
      "id": "10,-8",
      "q": 10,
      "r": -8,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "drowned-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "10,-9": {
      "id": "10,-9",
      "q": 10,
      "r": -9,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5 to Intelligence"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "drowned-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "10,-10": {
      "id": "10,-10",
      "q": 10,
      "r": -10,
      "ring": 10,
      "type": "gateway",
      "axis": "hybrid",
      "effects": [
        "Gate to the Assassin outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "gateway",
        "Assassin"
      ],
      "clusterId": "nightwork-spoke",
      "status": "review",
      "notes": "",
      "name": "Assassin Gate"
    },
    "9,-10": {
      "id": "9,-10",
      "q": 9,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "unlit-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "8,-10": {
      "id": "8,-10",
      "q": 8,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "unlit-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "7,-10": {
      "id": "7,-10",
      "q": 7,
      "r": -10,
      "ring": 10,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+60 to Evasion",
        "You may pass one enemy without being noticed, once per fight (design text)"
      ],
      "stat": "evasion",
      "amount": 60,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Unseen Passage"
    },
    "6,-10": {
      "id": "6,-10",
      "q": 6,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Intelligence",
        "Road signs mean more to you than most (design text)"
      ],
      "stat": "int",
      "amount": 5,
      "tags": [],
      "clusterId": "unlit-frontier",
      "status": "review",
      "notes": "",
      "name": "Intelligence"
    },
    "5,-10": {
      "id": "5,-10",
      "q": 5,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+24 to Evasion"
      ],
      "stat": "evasion",
      "amount": 24,
      "tags": [],
      "clusterId": "unlit-frontier",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "4,-10": {
      "id": "4,-10",
      "q": 4,
      "r": -10,
      "ring": 10,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+24% increased Ailment Effect",
        "Poison on Withered enemies deals Chaos damage instead (design text)"
      ],
      "stat": "ailmentEffect",
      "amount": 24,
      "tags": [],
      "clusterId": "unlit-road-named",
      "status": "review",
      "notes": "",
      "name": "Chaos Poison"
    },
    "3,-10": {
      "id": "3,-10",
      "q": 3,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "unlit-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "2,-10": {
      "id": "2,-10",
      "q": 2,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+3 to all Attributes"
      ],
      "stat": "attrs",
      "amount": 3,
      "tags": [],
      "clusterId": "unlit-frontier",
      "status": "review",
      "notes": "",
      "name": "All Attributes"
    },
    "1,-10": {
      "id": "1,-10",
      "q": 1,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "unlit-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "0,-10": {
      "id": "0,-10",
      "q": 0,
      "r": -10,
      "ring": 10,
      "type": "gateway",
      "axis": "dex",
      "effects": [
        "Gate to the Acrobat outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "gateway",
        "Acrobat"
      ],
      "clusterId": "dex-spoke",
      "status": "review",
      "notes": "",
      "name": "Acrobat Gate"
    },
    "-1,-9": {
      "id": "-1,-9",
      "q": -1,
      "r": -9,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "high-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "-2,-8": {
      "id": "-2,-8",
      "q": -2,
      "r": -8,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+3 to all Attributes"
      ],
      "stat": "attrs",
      "amount": 3,
      "tags": [],
      "clusterId": "high-frontier",
      "status": "review",
      "notes": "",
      "name": "All Attributes"
    },
    "-3,-7": {
      "id": "-3,-7",
      "q": -3,
      "r": -7,
      "ring": 10,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+30% increased Projectile Damage",
        "You can see marks at any distance (design text)"
      ],
      "stat": "projectileDamage",
      "amount": 30,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Distant Marks"
    },
    "-4,-6": {
      "id": "-4,-6",
      "q": -4,
      "r": -6,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Dexterity",
        "Enemies chase you uphill at their peril (design text)"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "high-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "-5,-5": {
      "id": "-5,-5",
      "q": -5,
      "r": -5,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "high-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "-6,-4": {
      "id": "-6,-4",
      "q": -6,
      "r": -4,
      "ring": 10,
      "type": "notable",
      "axis": "dex",
      "effects": [
        "+22% increased Evasion",
        "+12% to Lightning Resistance",
        "Projectiles aimed at you drift in the wind (design text)"
      ],
      "stat": "evasion_increased",
      "amount": 22,
      "tags": [],
      "clusterId": "high-paths-named",
      "status": "review",
      "notes": "",
      "name": "Projectile Deflection"
    },
    "-7,-3": {
      "id": "-7,-3",
      "q": -7,
      "r": -3,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+24 to Evasion"
      ],
      "stat": "evasion",
      "amount": 24,
      "tags": [],
      "clusterId": "high-frontier",
      "status": "review",
      "notes": "",
      "name": "Evasion"
    },
    "-8,-2": {
      "id": "-8,-2",
      "q": -8,
      "r": -2,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "high-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "-9,-1": {
      "id": "-9,-1",
      "q": -9,
      "r": -1,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5 to Dexterity"
      ],
      "stat": "dex",
      "amount": 5,
      "tags": [],
      "clusterId": "high-frontier",
      "status": "review",
      "notes": "",
      "name": "Dexterity"
    },
    "-10,0": {
      "id": "-10,0",
      "q": -10,
      "r": 0,
      "ring": 10,
      "type": "gateway",
      "axis": "hybrid",
      "effects": [
        "Gate to the Reaver outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "tags": [
        "gateway",
        "Reaver"
      ],
      "clusterId": "skirmisher-spoke",
      "status": "review",
      "notes": "",
      "name": "Reaver Gate"
    },
    "-10,1": {
      "id": "-10,1",
      "q": -10,
      "r": 1,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "red-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "-10,2": {
      "id": "-10,2",
      "q": -10,
      "r": 2,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "red-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "-10,3": {
      "id": "-10,3",
      "q": -10,
      "r": 3,
      "ring": 10,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+30% increased Attack Damage",
        "Enemies that see your standard Bleed easier (design text)"
      ],
      "stat": "attackDamage",
      "amount": 30,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Banner Bleed"
    },
    "-10,4": {
      "id": "-10,4",
      "q": -10,
      "r": 4,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+3 to all Attributes",
        "The crows remember who fed them (design text)"
      ],
      "stat": "attrs",
      "amount": 3,
      "tags": [],
      "clusterId": "red-frontier",
      "status": "review",
      "notes": "",
      "name": "All Attributes"
    },
    "-10,5": {
      "id": "-10,5",
      "q": -10,
      "r": 5,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "red-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    },
    "-10,6": {
      "id": "-10,6",
      "q": -10,
      "r": 6,
      "ring": 10,
      "type": "notable",
      "axis": "str",
      "effects": [
        "+55 to Life",
        "+10% increased Ailment Effect",
        "Your Bleeds close only when their victim falls (design text)"
      ],
      "stat": "life",
      "amount": 55,
      "tags": [],
      "clusterId": "red-field-named",
      "status": "review",
      "notes": "",
      "name": "Lasting Bleeds"
    },
    "-10,7": {
      "id": "-10,7",
      "q": -10,
      "r": 7,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+22 to Life"
      ],
      "stat": "life",
      "amount": 22,
      "tags": [],
      "clusterId": "red-frontier",
      "status": "review",
      "notes": "",
      "name": "Life"
    },
    "-10,8": {
      "id": "-10,8",
      "q": -10,
      "r": 8,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+22 to Guard"
      ],
      "stat": "guard",
      "amount": 22,
      "tags": [],
      "clusterId": "red-frontier",
      "status": "review",
      "notes": "",
      "name": "Guard"
    },
    "-10,9": {
      "id": "-10,9",
      "q": -10,
      "r": 9,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "effects": [
        "+5 to Strength"
      ],
      "stat": "str",
      "amount": 5,
      "tags": [],
      "clusterId": "red-frontier",
      "status": "review",
      "notes": "",
      "name": "Strength"
    }
  }
};
})(typeof window !== "undefined" ? window : globalThis);
