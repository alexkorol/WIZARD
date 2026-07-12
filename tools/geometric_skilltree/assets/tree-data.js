(function(global) {
  global.TREE_DATA = {
  "schemaVersion": 1,
  "phase": 0,
  "mainRingDepth": 10,
  "startPoints": {
    "skill": 140
  },
  "metadata": {
    "generatedFrom": "tools/geometric_skilltree/index.html procedural templates",
    "generatedAt": "2026-07-11",
    "intent": "Phase 0 bootstrap coverage data; every main lattice seat has an explicit entry."
  },
  "patternTuning": {},
  "seats": {
    "-10,0": {
      "id": "-10,0",
      "q": -10,
      "r": 0,
      "ring": 10,
      "type": "gateway",
      "axis": "hybrid",
      "effects": [
        "Shared gate for the Skirmish Annex outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "HYB",
        "gateway",
        "elemental",
        "outer",
        "Skirmish Annex"
      ],
      "clusterId": "bootstrap-r10-gateway-skirmish-annex",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring.",
      "name": "Skirmish Annex Gate"
    },
    "-10,1": {
      "id": "-10,1",
      "q": -10,
      "r": 1,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "name": "Deep Pockets",
      "effects": [
        "+3% Cooldown Recovery Rate"
      ],
      "stat": "cooldownRecovery",
      "amount": 3,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "recovery",
        "outer"
      ],
      "clusterId": "bootstrap-r10-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,2": {
      "id": "-10,2",
      "q": -10,
      "r": 2,
      "ring": 10,
      "type": "notable",
      "axis": "str",
      "name": "Berserker",
      "effects": [
        "+26% Melee Damage",
        "+10% Attack Speed while below half Life"
      ],
      "stat": "attackDamage",
      "amount": 26,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 26
        }
      ],
      "tags": [
        "STR",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,3": {
      "id": "-10,3",
      "q": -10,
      "r": 3,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Line Holder",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,4": {
      "id": "-10,4",
      "q": -10,
      "r": 4,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Follow Through",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,5": {
      "id": "-10,5",
      "q": -10,
      "r": 5,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Shield Hook",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,6": {
      "id": "-10,6",
      "q": -10,
      "r": 6,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Blood Reserve",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,7": {
      "id": "-10,7",
      "q": -10,
      "r": 7,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Thick Skin",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,8": {
      "id": "-10,8",
      "q": -10,
      "r": 8,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Hammer Cant",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,9": {
      "id": "-10,9",
      "q": -10,
      "r": 9,
      "ring": 10,
      "type": "notable",
      "axis": "str",
      "name": "Breaker's Posture",
      "effects": [
        "+25% damage against armoured enemies",
        "Armour Break lasts 20% longer"
      ],
      "stat": "attackDamage",
      "amount": 25,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 25
        }
      ],
      "tags": [
        "STR",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-10,10": {
      "id": "-10,10",
      "q": -10,
      "r": 10,
      "ring": 10,
      "type": "gateway",
      "axis": "str",
      "effects": [
        "Shared gate for the Vanguard Oath outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "STR",
        "gateway",
        "life",
        "outer",
        "Vanguard Oath"
      ],
      "clusterId": "bootstrap-r10-gateway-vanguard-oath",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring.",
      "name": "Vanguard Oath Gate"
    },
    "-9,-1": {
      "id": "-9,-1",
      "q": -9,
      "r": -1,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "name": "Fault Line",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment",
        "outer"
      ],
      "clusterId": "bootstrap-r10-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,0": {
      "id": "-9,0",
      "q": -9,
      "r": 0,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Weighted Hex",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,1": {
      "id": "-9,1",
      "q": -9,
      "r": 1,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Fourfold Ward",
      "effects": [
        "+3% to all Elemental Resistances"
      ],
      "stat": "allResistances",
      "amount": 3,
      "mods": [
        {
          "stat": "allResistances",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "resistance"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,2": {
      "id": "-9,2",
      "q": -9,
      "r": 2,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Heft",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,3": {
      "id": "-9,3",
      "q": -9,
      "r": 3,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Doorframe Stance",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,4": {
      "id": "-9,4",
      "q": -9,
      "r": 4,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Second Breath",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,5": {
      "id": "-9,5",
      "q": -9,
      "r": 5,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Tidewall",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,6": {
      "id": "-9,6",
      "q": -9,
      "r": 6,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Follow Through",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,7": {
      "id": "-9,7",
      "q": -9,
      "r": 7,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Shield Hook",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,8": {
      "id": "-9,8",
      "q": -9,
      "r": 8,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Unbroken Core",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,9": {
      "id": "-9,9",
      "q": -9,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Stone Vein",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-9,10": {
      "id": "-9,10",
      "q": -9,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Iron Angle",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,-2": {
      "id": "-8,-2",
      "q": -8,
      "r": -2,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Twin Feint",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,-1": {
      "id": "-8,-1",
      "q": -8,
      "r": -1,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Split Study",
      "effects": [
        "+6% Elemental and Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 6,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 6
        }
      ],
      "tags": [
        "HYB",
        "small",
        "elemental"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,0": {
      "id": "-8,0",
      "q": -8,
      "r": 0,
      "ring": 8,
      "type": "notable",
      "axis": "hybrid",
      "name": "Field Alchemy",
      "effects": [
        "+12% Cooldown Recovery Rate",
        "Recovery effects improve your weakest attribute"
      ],
      "stat": "cooldownRecovery",
      "amount": 12,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 12
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r8-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,1": {
      "id": "-8,1",
      "q": -8,
      "r": 1,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Padded Guard",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,2": {
      "id": "-8,2",
      "q": -8,
      "r": 2,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Field Surgeon",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,3": {
      "id": "-8,3",
      "q": -8,
      "r": 3,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Close Guard",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,4": {
      "id": "-8,4",
      "q": -8,
      "r": 4,
      "ring": 8,
      "type": "keystone",
      "axis": "str",
      "name": "The Lantern",
      "effects": [
        "Allies and companions near you gain +15% damage",
        "You are always revealed to enemies"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "STR",
        "keystone"
      ],
      "clusterId": "bootstrap-r8-str-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,5": {
      "id": "-8,5",
      "q": -8,
      "r": 5,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Doorframe Stance",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,6": {
      "id": "-8,6",
      "q": -8,
      "r": 6,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Second Breath",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,7": {
      "id": "-8,7",
      "q": -8,
      "r": 7,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Close Guard",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,8": {
      "id": "-8,8",
      "q": -8,
      "r": 8,
      "ring": 8,
      "type": "notable",
      "axis": "str",
      "name": "Gladiator",
      "effects": [
        "+4% Block Chance",
        "Blocking grants +8% melee damage for 3 seconds"
      ],
      "stat": "blockChance",
      "amount": 4,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 4
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r8-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,9": {
      "id": "-8,9",
      "q": -8,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Second Breath",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-8,10": {
      "id": "-8,10",
      "q": -8,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Headsplitter",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,-3": {
      "id": "-7,-3",
      "q": -7,
      "r": -3,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "High Arc",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,-2": {
      "id": "-7,-2",
      "q": -7,
      "r": -2,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Green Angle",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,-1": {
      "id": "-7,-1",
      "q": -7,
      "r": -1,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Far Hand",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,0": {
      "id": "-7,0",
      "q": -7,
      "r": 0,
      "ring": 7,
      "type": "small",
      "axis": "hybrid",
      "name": "Marking Rule",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r7-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,1": {
      "id": "-7,1",
      "q": -7,
      "r": 1,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Locking Elbow",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,2": {
      "id": "-7,2",
      "q": -7,
      "r": 2,
      "ring": 7,
      "type": "notable",
      "axis": "str",
      "name": "Berserker",
      "effects": [
        "+26% Melee Damage",
        "+10% Attack Speed while below half Life"
      ],
      "stat": "attackDamage",
      "amount": 26,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 26
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r7-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,3": {
      "id": "-7,3",
      "q": -7,
      "r": 3,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Braced Wrist",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,4": {
      "id": "-7,4",
      "q": -7,
      "r": 4,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Field Surgeon",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,5": {
      "id": "-7,5",
      "q": -7,
      "r": 5,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Close Guard",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,6": {
      "id": "-7,6",
      "q": -7,
      "r": 6,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Break Rhythm",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,7": {
      "id": "-7,7",
      "q": -7,
      "r": 7,
      "ring": 7,
      "type": "mastery",
      "axis": "str",
      "name": "Champion",
      "effects": [
        "+12% Melee Damage and +120 Armour",
        "War banners and shouts affect a wider area."
      ],
      "mods": [],
      "tags": [
        "STR",
        "mastery"
      ],
      "clusterId": "bootstrap-r7-str-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,8": {
      "id": "-7,8",
      "q": -7,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Shield Memory",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,9": {
      "id": "-7,9",
      "q": -7,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Locking Elbow",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-7,10": {
      "id": "-7,10",
      "q": -7,
      "r": 10,
      "ring": 10,
      "type": "notable",
      "axis": "str",
      "name": "Anvil Reading",
      "effects": [
        "+22% Melee Damage",
        "Stuns you inflict count as one rank stronger"
      ],
      "stat": "attackDamage",
      "amount": 22,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 22
        }
      ],
      "tags": [
        "STR",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,-4": {
      "id": "-6,-4",
      "q": -6,
      "r": -4,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Clean Draw",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,-3": {
      "id": "-6,-3",
      "q": -6,
      "r": -3,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Edge Step",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,-2": {
      "id": "-6,-2",
      "q": -6,
      "r": -2,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Knife Tempo",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,-1": {
      "id": "-6,-1",
      "q": -6,
      "r": -1,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "Short Grip",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,0": {
      "id": "-6,0",
      "q": -6,
      "r": 0,
      "ring": 6,
      "type": "notable",
      "axis": "hybrid",
      "name": "Spellblade Interval",
      "effects": [
        "+21% mixed Attack and Spell Damage",
        "Attack after casting grants +8 INT and +8 STR for 4 seconds"
      ],
      "stat": "spellDamage",
      "amount": 21,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 21
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r6-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,1": {
      "id": "-6,1",
      "q": -6,
      "r": 1,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Thick Skin",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,2": {
      "id": "-6,2",
      "q": -6,
      "r": 2,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Red Marrow",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,3": {
      "id": "-6,3",
      "q": -6,
      "r": 3,
      "ring": 6,
      "type": "keystone",
      "axis": "str",
      "name": "No Backward Step",
      "effects": [
        "You cannot evade while standing still",
        "Standing still grants +70% guard and +30% heavy damage"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "STR",
        "keystone"
      ],
      "clusterId": "bootstrap-r6-str-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,4": {
      "id": "-6,4",
      "q": -6,
      "r": 4,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Warhand",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,5": {
      "id": "-6,5",
      "q": -6,
      "r": 5,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Shield Hook",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,6": {
      "id": "-6,6",
      "q": -6,
      "r": 6,
      "ring": 6,
      "type": "notable",
      "axis": "str",
      "name": "Hoplite",
      "effects": [
        "+200 Armour",
        "+14% damage with spears and long weapons"
      ],
      "stat": "armour",
      "amount": 200,
      "mods": [
        {
          "stat": "armour",
          "amount": 200
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r6-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,7": {
      "id": "-6,7",
      "q": -6,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Hammer Cant",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,8": {
      "id": "-6,8",
      "q": -6,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Field Surgeon",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,9": {
      "id": "-6,9",
      "q": -6,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Break Rhythm",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-6,10": {
      "id": "-6,10",
      "q": -6,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Blood Reserve",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,-5": {
      "id": "-5,-5",
      "q": -5,
      "r": -5,
      "ring": 10,
      "type": "notable",
      "axis": "dex",
      "name": "Far Hand Geometry",
      "effects": [
        "+22% Projectile Damage",
        "Projectiles gain +1 rebound after travelling through a conduit loop"
      ],
      "stat": "projectileDamage",
      "amount": 22,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 22
        }
      ],
      "tags": [
        "DEX",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,-4": {
      "id": "-5,-4",
      "q": -5,
      "r": -4,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "String Theory",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,-3": {
      "id": "-5,-3",
      "q": -5,
      "r": -3,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Steady Loose",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,-2": {
      "id": "-5,-2",
      "q": -5,
      "r": -2,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "Ricochet Habit",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,-1": {
      "id": "-5,-1",
      "q": -5,
      "r": -1,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "Fletched Line",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,0": {
      "id": "-5,0",
      "q": -5,
      "r": 0,
      "ring": 5,
      "type": "small",
      "axis": "hybrid",
      "name": "Slow Poison",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r5-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,1": {
      "id": "-5,1",
      "q": -5,
      "r": 1,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "name": "Shield Hook",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r5-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,2": {
      "id": "-5,2",
      "q": -5,
      "r": 2,
      "ring": 5,
      "type": "notable",
      "axis": "str",
      "name": "Executioner",
      "effects": [
        "+20% Melee Damage",
        "Enemies below a fifth of their life take +25% damage from you"
      ],
      "stat": "attackDamage",
      "amount": 20,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 20
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r5-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,3": {
      "id": "-5,3",
      "q": -5,
      "r": 3,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "name": "Raised Rim",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r5-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,4": {
      "id": "-5,4",
      "q": -5,
      "r": 4,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "name": "Red Marrow",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r5-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,5": {
      "id": "-5,5",
      "q": -5,
      "r": 5,
      "ring": 5,
      "type": "mastery",
      "axis": "str",
      "name": "Mastery of Force",
      "effects": [
        "Choose this region for weapons, armour, and direct confrontation."
      ],
      "mods": [],
      "tags": [
        "STR",
        "mastery"
      ],
      "clusterId": "bootstrap-r5-str-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,6": {
      "id": "-5,6",
      "q": -5,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Braced Wrist",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,7": {
      "id": "-5,7",
      "q": -5,
      "r": 7,
      "ring": 7,
      "type": "notable",
      "axis": "str",
      "name": "Gladiator",
      "effects": [
        "+4% Block Chance",
        "Blocking grants +8% melee damage for 3 seconds"
      ],
      "stat": "blockChance",
      "amount": 4,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 4
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r7-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,8": {
      "id": "-5,8",
      "q": -5,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Shield Hook",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,9": {
      "id": "-5,9",
      "q": -5,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Stone Vein",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-5,10": {
      "id": "-5,10",
      "q": -5,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Iron Angle",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,-6": {
      "id": "-4,-6",
      "q": -4,
      "r": -6,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Knife Tempo",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,-5": {
      "id": "-4,-5",
      "q": -4,
      "r": -5,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Short Grip",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,-4": {
      "id": "-4,-4",
      "q": -4,
      "r": -4,
      "ring": 8,
      "type": "keystone",
      "axis": "dex",
      "name": "The Shadow",
      "effects": [
        "After 2 seconds unseen, your next action has advantage",
        "Your maximum Life is 15% lower"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "DEX",
        "keystone"
      ],
      "clusterId": "bootstrap-r8-dex-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,-3": {
      "id": "-4,-3",
      "q": -4,
      "r": -3,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "Twin Feint",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,-2": {
      "id": "-4,-2",
      "q": -4,
      "r": -2,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "Off Hand",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,-1": {
      "id": "-4,-1",
      "q": -4,
      "r": -1,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "name": "Clean Draw",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r5-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,0": {
      "id": "-4,0",
      "q": -4,
      "r": 0,
      "ring": 4,
      "type": "small",
      "axis": "hybrid",
      "name": "Two-Hand Thesis",
      "effects": [
        "+6% Elemental and Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 6,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 6
        }
      ],
      "tags": [
        "HYB",
        "small",
        "elemental"
      ],
      "clusterId": "bootstrap-r4-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,1": {
      "id": "-4,1",
      "q": -4,
      "r": 1,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "name": "Tidewall",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r4-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,2": {
      "id": "-4,2",
      "q": -4,
      "r": 2,
      "ring": 4,
      "type": "notable",
      "axis": "str",
      "name": "Gladiator",
      "effects": [
        "+4% Block Chance",
        "Blocking grants +8% melee damage for 3 seconds"
      ],
      "stat": "blockChance",
      "amount": 4,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 4
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r4-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,3": {
      "id": "-4,3",
      "q": -4,
      "r": 3,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "name": "Shield Memory",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r4-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,4": {
      "id": "-4,4",
      "q": -4,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "name": "Warhand",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r4-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,5": {
      "id": "-4,5",
      "q": -4,
      "r": 5,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "name": "Old Scars",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r5-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,6": {
      "id": "-4,6",
      "q": -4,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Follow Through",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,7": {
      "id": "-4,7",
      "q": -4,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Red Marrow",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,8": {
      "id": "-4,8",
      "q": -4,
      "r": 8,
      "ring": 8,
      "type": "keystone",
      "axis": "str",
      "name": "The Bull",
      "effects": [
        "You cannot be slowed, knocked back, or interrupted",
        "-15% Movement Speed"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "STR",
        "keystone"
      ],
      "clusterId": "bootstrap-r8-str-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,9": {
      "id": "-4,9",
      "q": -4,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Second Breath",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-4,10": {
      "id": "-4,10",
      "q": -4,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Headsplitter",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,-7": {
      "id": "-3,-7",
      "q": -3,
      "r": -7,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Steady Loose",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,-6": {
      "id": "-3,-6",
      "q": -3,
      "r": -6,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Ricochet Habit",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,-5": {
      "id": "-3,-5",
      "q": -3,
      "r": -5,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Fletched Line",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,-4": {
      "id": "-3,-4",
      "q": -3,
      "r": -4,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "High Arc",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,-3": {
      "id": "-3,-3",
      "q": -3,
      "r": -3,
      "ring": 6,
      "type": "keystone",
      "axis": "dex",
      "name": "The Hand Arrives First",
      "effects": [
        "Your first strike against each enemy always has advantage",
        "You lose 20% guard while not moving"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "DEX",
        "keystone"
      ],
      "clusterId": "bootstrap-r6-dex-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,-2": {
      "id": "-3,-2",
      "q": -3,
      "r": -2,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "name": "Far Hand",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r5-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,-1": {
      "id": "-3,-1",
      "q": -3,
      "r": -1,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "name": "String Theory",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r4-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,0": {
      "id": "-3,0",
      "q": -3,
      "r": 0,
      "ring": 3,
      "type": "small",
      "axis": "hybrid",
      "name": "Salted Wound",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r3-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,1": {
      "id": "-3,1",
      "q": -3,
      "r": 1,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "name": "Braced Plate",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r3-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,2": {
      "id": "-3,2",
      "q": -3,
      "r": 2,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "name": "Break Rhythm",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r3-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,3": {
      "id": "-3,3",
      "q": -3,
      "r": 3,
      "ring": 3,
      "type": "mastery",
      "axis": "str",
      "name": "Mastery of Force",
      "effects": [
        "Choose this region for weapons, armour, and direct confrontation."
      ],
      "mods": [],
      "tags": [
        "STR",
        "mastery"
      ],
      "clusterId": "bootstrap-r3-str-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,4": {
      "id": "-3,4",
      "q": -3,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "name": "Tidewall",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r4-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,5": {
      "id": "-3,5",
      "q": -3,
      "r": 5,
      "ring": 5,
      "type": "notable",
      "axis": "str",
      "name": "Hoplite",
      "effects": [
        "+200 Armour",
        "+14% damage with spears and long weapons"
      ],
      "stat": "armour",
      "amount": 200,
      "mods": [
        {
          "stat": "armour",
          "amount": 200
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r5-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,6": {
      "id": "-3,6",
      "q": -3,
      "r": 6,
      "ring": 6,
      "type": "keystone",
      "axis": "str",
      "name": "No Backward Step",
      "effects": [
        "You cannot evade while standing still",
        "Standing still grants +70% guard and +30% heavy damage"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "STR",
        "keystone"
      ],
      "clusterId": "bootstrap-r6-str-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,7": {
      "id": "-3,7",
      "q": -3,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Doorframe Stance",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,8": {
      "id": "-3,8",
      "q": -3,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Shield Memory",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,9": {
      "id": "-3,9",
      "q": -3,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Locking Elbow",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-3,10": {
      "id": "-3,10",
      "q": -3,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Close Guard",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-8": {
      "id": "-2,-8",
      "q": -2,
      "r": -8,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Whisper Cut",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-7": {
      "id": "-2,-7",
      "q": -2,
      "r": -7,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Twin Feint",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-6": {
      "id": "-2,-6",
      "q": -2,
      "r": -6,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Off Hand",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-5": {
      "id": "-2,-5",
      "q": -2,
      "r": -5,
      "ring": 7,
      "type": "notable",
      "axis": "dex",
      "name": "Far Hand Geometry",
      "effects": [
        "+22% Projectile Damage",
        "Projectiles gain +1 rebound after travelling through a conduit loop"
      ],
      "stat": "projectileDamage",
      "amount": 22,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 22
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r7-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-4": {
      "id": "-2,-4",
      "q": -2,
      "r": -4,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "Edge Step",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-3": {
      "id": "-2,-3",
      "q": -2,
      "r": -3,
      "ring": 5,
      "type": "notable",
      "axis": "dex",
      "name": "Needlework Footing",
      "effects": [
        "+260 Evasion Rating",
        "First dodge after moving grants +8% Attack Speed"
      ],
      "stat": "evasion",
      "amount": 260,
      "mods": [
        {
          "stat": "evasion",
          "amount": 260
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r5-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-2": {
      "id": "-2,-2",
      "q": -2,
      "r": -2,
      "ring": 4,
      "type": "notable",
      "axis": "dex",
      "name": "Duelist",
      "effects": [
        "+2.5% Critical Strike Chance",
        "After you dodge, your next strike cannot miss"
      ],
      "stat": "critChance",
      "amount": 2.5,
      "mods": [
        {
          "stat": "critChance",
          "amount": 2.5
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r4-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,-1": {
      "id": "-2,-1",
      "q": -2,
      "r": -1,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "name": "Whisper Cut",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r3-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,0": {
      "id": "-2,0",
      "q": -2,
      "r": 0,
      "ring": 2,
      "type": "notable",
      "axis": "hybrid",
      "name": "Field Alchemy",
      "effects": [
        "+12% Cooldown Recovery Rate",
        "Recovery effects improve your weakest attribute"
      ],
      "stat": "cooldownRecovery",
      "amount": 12,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 12
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r2-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,1": {
      "id": "-2,1",
      "q": -2,
      "r": 1,
      "ring": 2,
      "type": "small",
      "axis": "str",
      "name": "Iron Angle",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r2-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,2": {
      "id": "-2,2",
      "q": -2,
      "r": 2,
      "ring": 2,
      "type": "notable",
      "axis": "str",
      "name": "Executioner",
      "effects": [
        "+20% Melee Damage",
        "Enemies below a fifth of their life take +25% damage from you"
      ],
      "stat": "attackDamage",
      "amount": 20,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 20
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r2-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,3": {
      "id": "-2,3",
      "q": -2,
      "r": 3,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "name": "Headsplitter",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r3-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,4": {
      "id": "-2,4",
      "q": -2,
      "r": 4,
      "ring": 4,
      "type": "notable",
      "axis": "str",
      "name": "Red Standard",
      "effects": [
        "+180 maximum Life",
        "War skills recover 3% Life on first target hit"
      ],
      "stat": "life",
      "amount": 180,
      "mods": [
        {
          "stat": "life",
          "amount": 180
        }
      ],
      "tags": [
        "STR",
        "notable"
      ],
      "clusterId": "bootstrap-r4-str-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,5": {
      "id": "-2,5",
      "q": -2,
      "r": 5,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "name": "Heft",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r5-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,6": {
      "id": "-2,6",
      "q": -2,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Deep Lungs",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,7": {
      "id": "-2,7",
      "q": -2,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Hammer Cant",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,8": {
      "id": "-2,8",
      "q": -2,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Field Surgeon",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,9": {
      "id": "-2,9",
      "q": -2,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "str",
      "name": "Break Rhythm",
      "effects": [
        "+9% melee and heavy weapon damage"
      ],
      "stat": "attackDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "attackDamage",
          "amount": 9
        }
      ],
      "tags": [
        "STR",
        "small",
        "weapon"
      ],
      "clusterId": "bootstrap-r9-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-2,10": {
      "id": "-2,10",
      "q": -2,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "str",
      "name": "Blood Reserve",
      "effects": [
        "+55 maximum Life"
      ],
      "stat": "life",
      "amount": 55,
      "mods": [
        {
          "stat": "life",
          "amount": 55
        }
      ],
      "tags": [
        "STR",
        "small",
        "life",
        "outer"
      ],
      "clusterId": "bootstrap-r10-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-9": {
      "id": "-1,-9",
      "q": -1,
      "r": -9,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Fletched Line",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-8": {
      "id": "-1,-8",
      "q": -1,
      "r": -8,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "High Arc",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-7": {
      "id": "-1,-7",
      "q": -1,
      "r": -7,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Green Angle",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-6": {
      "id": "-1,-6",
      "q": -1,
      "r": -6,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "Far Hand",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-5": {
      "id": "-1,-5",
      "q": -1,
      "r": -5,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "String Theory",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-4": {
      "id": "-1,-4",
      "q": -1,
      "r": -4,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "name": "Steady Loose",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r5-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-3": {
      "id": "-1,-3",
      "q": -1,
      "r": -3,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "name": "Ricochet Habit",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r4-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-2": {
      "id": "-1,-2",
      "q": -1,
      "r": -2,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "name": "Fletched Line",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r3-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,-1": {
      "id": "-1,-1",
      "q": -1,
      "r": -1,
      "ring": 2,
      "type": "small",
      "axis": "dex",
      "name": "High Arc",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r2-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,0": {
      "id": "-1,0",
      "q": -1,
      "r": 0,
      "ring": 1,
      "type": "small",
      "axis": "hybrid",
      "name": "Soft Lock",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r1-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,1": {
      "id": "-1,1",
      "q": -1,
      "r": 1,
      "ring": 1,
      "type": "small",
      "axis": "str",
      "name": "Shield Memory",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r1-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,2": {
      "id": "-1,2",
      "q": -1,
      "r": 2,
      "ring": 2,
      "type": "small",
      "axis": "str",
      "name": "Locking Elbow",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r2-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,3": {
      "id": "-1,3",
      "q": -1,
      "r": 3,
      "ring": 3,
      "type": "small",
      "axis": "str",
      "name": "Close Guard",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r3-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,4": {
      "id": "-1,4",
      "q": -1,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "str",
      "name": "Line Holder",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r4-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,5": {
      "id": "-1,5",
      "q": -1,
      "r": 5,
      "ring": 5,
      "type": "small",
      "axis": "str",
      "name": "Thick Skin",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r5-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,6": {
      "id": "-1,6",
      "q": -1,
      "r": 6,
      "ring": 6,
      "type": "small",
      "axis": "str",
      "name": "Braced Wrist",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r6-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,7": {
      "id": "-1,7",
      "q": -1,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "str",
      "name": "Braced Plate",
      "effects": [
        "+85 Armour"
      ],
      "stat": "armour",
      "amount": 85,
      "mods": [
        {
          "stat": "armour",
          "amount": 85
        }
      ],
      "tags": [
        "STR",
        "small",
        "armour"
      ],
      "clusterId": "bootstrap-r7-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,8": {
      "id": "-1,8",
      "q": -1,
      "r": 8,
      "ring": 8,
      "type": "small",
      "axis": "str",
      "name": "Shield Hook",
      "effects": [
        "+2% Block Chance"
      ],
      "stat": "blockChance",
      "amount": 2,
      "mods": [
        {
          "stat": "blockChance",
          "amount": 2
        }
      ],
      "tags": [
        "STR",
        "small",
        "block"
      ],
      "clusterId": "bootstrap-r8-str-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,9": {
      "id": "-1,9",
      "q": -1,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Field Cache",
      "effects": [
        "+3% Cooldown Recovery Rate"
      ],
      "stat": "cooldownRecovery",
      "amount": 3,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "recovery"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "-1,10": {
      "id": "-1,10",
      "q": -1,
      "r": 10,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "name": "Fourfold Ward",
      "effects": [
        "+3% to all Elemental Resistances"
      ],
      "stat": "allResistances",
      "amount": 3,
      "mods": [
        {
          "stat": "allResistances",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "resistance",
        "outer"
      ],
      "clusterId": "bootstrap-r10-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-10": {
      "id": "0,-10",
      "q": 0,
      "r": -10,
      "ring": 10,
      "type": "gateway",
      "axis": "dex",
      "effects": [
        "Shared gate for the Ranger's Writ outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "DEX",
        "gateway",
        "blade",
        "outer",
        "Ranger's Writ"
      ],
      "clusterId": "bootstrap-r10-gateway-ranger-s-writ",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring.",
      "name": "Ranger's Writ Gate"
    },
    "0,-9": {
      "id": "0,-9",
      "q": 0,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Clean Draw",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-8": {
      "id": "0,-8",
      "q": 0,
      "r": -8,
      "ring": 8,
      "type": "notable",
      "axis": "dex",
      "name": "Duelist",
      "effects": [
        "+2.5% Critical Strike Chance",
        "After you dodge, your next strike cannot miss"
      ],
      "stat": "critChance",
      "amount": 2.5,
      "mods": [
        {
          "stat": "critChance",
          "amount": 2.5
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r8-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-7": {
      "id": "0,-7",
      "q": 0,
      "r": -7,
      "ring": 7,
      "type": "mastery",
      "axis": "dex",
      "name": "Acrobat",
      "effects": [
        "+8% Attack Speed and +140 Evasion Rating",
        "Dodging costs no stamina inside completed loops."
      ],
      "mods": [],
      "tags": [
        "DEX",
        "mastery"
      ],
      "clusterId": "bootstrap-r7-dex-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-6": {
      "id": "0,-6",
      "q": 0,
      "r": -6,
      "ring": 6,
      "type": "notable",
      "axis": "dex",
      "name": "Poison Ledger",
      "effects": [
        "+21% Ailment Effect",
        "Poisons tick 12% faster on marked targets"
      ],
      "stat": "ailmentEffect",
      "amount": 21,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 21
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r6-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-5": {
      "id": "0,-5",
      "q": 0,
      "r": -5,
      "ring": 5,
      "type": "mastery",
      "axis": "dex",
      "name": "Mastery of Motion",
      "effects": [
        "Choose this region for speed, precision, projectiles, and evasive play."
      ],
      "mods": [],
      "tags": [
        "DEX",
        "mastery"
      ],
      "clusterId": "bootstrap-r5-dex-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-4": {
      "id": "0,-4",
      "q": 0,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "name": "Twin Feint",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r4-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-3": {
      "id": "0,-3",
      "q": 0,
      "r": -3,
      "ring": 3,
      "type": "mastery",
      "axis": "dex",
      "name": "Mastery of Motion",
      "effects": [
        "Choose this region for speed, precision, projectiles, and evasive play."
      ],
      "mods": [],
      "tags": [
        "DEX",
        "mastery"
      ],
      "clusterId": "bootstrap-r3-dex-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-2": {
      "id": "0,-2",
      "q": 0,
      "r": -2,
      "ring": 2,
      "type": "notable",
      "axis": "dex",
      "name": "Far Hand Geometry",
      "effects": [
        "+22% Projectile Damage",
        "Projectiles gain +1 rebound after travelling through a conduit loop"
      ],
      "stat": "projectileDamage",
      "amount": 22,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 22
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r2-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,-1": {
      "id": "0,-1",
      "q": 0,
      "r": -1,
      "ring": 1,
      "type": "small",
      "axis": "dex",
      "name": "Edge Step",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r1-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,0": {
      "id": "0,0",
      "q": 0,
      "r": 0,
      "ring": 0,
      "type": "origin",
      "axis": "hybrid",
      "name": "Origin",
      "effects": [
        "Starting point. No passive bonus."
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "HYB",
        "origin",
        "elemental"
      ],
      "clusterId": "bootstrap-r0-hybrid-origin",
      "status": "final",
      "notes": ""
    },
    "0,1": {
      "id": "0,1",
      "q": 0,
      "r": 1,
      "ring": 1,
      "type": "small",
      "axis": "hybrid",
      "name": "Weighted Hex",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r1-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,2": {
      "id": "0,2",
      "q": 0,
      "r": 2,
      "ring": 2,
      "type": "notable",
      "axis": "hybrid",
      "name": "Field Alchemy",
      "effects": [
        "+12% Cooldown Recovery Rate",
        "Recovery effects improve your weakest attribute"
      ],
      "stat": "cooldownRecovery",
      "amount": 12,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 12
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r2-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,3": {
      "id": "0,3",
      "q": 0,
      "r": 3,
      "ring": 3,
      "type": "small",
      "axis": "hybrid",
      "name": "Fault Line",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r3-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,4": {
      "id": "0,4",
      "q": 0,
      "r": 4,
      "ring": 4,
      "type": "small",
      "axis": "hybrid",
      "name": "Measured Risk",
      "effects": [
        "+6% Elemental and Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 6,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 6
        }
      ],
      "tags": [
        "HYB",
        "small",
        "elemental"
      ],
      "clusterId": "bootstrap-r4-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,5": {
      "id": "0,5",
      "q": 0,
      "r": 5,
      "ring": 5,
      "type": "small",
      "axis": "hybrid",
      "name": "Salted Wound",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r5-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,6": {
      "id": "0,6",
      "q": 0,
      "r": 6,
      "ring": 6,
      "type": "notable",
      "axis": "hybrid",
      "name": "Spellblade Interval",
      "effects": [
        "+21% mixed Attack and Spell Damage",
        "Attack after casting grants +8 INT and +8 STR for 4 seconds"
      ],
      "stat": "spellDamage",
      "amount": 21,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 21
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r6-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,7": {
      "id": "0,7",
      "q": 0,
      "r": 7,
      "ring": 7,
      "type": "small",
      "axis": "hybrid",
      "name": "Marking Rule",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r7-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,8": {
      "id": "0,8",
      "q": 0,
      "r": 8,
      "ring": 8,
      "type": "notable",
      "axis": "hybrid",
      "name": "Field Alchemy",
      "effects": [
        "+12% Cooldown Recovery Rate",
        "Recovery effects improve your weakest attribute"
      ],
      "stat": "cooldownRecovery",
      "amount": 12,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 12
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r8-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,9": {
      "id": "0,9",
      "q": 0,
      "r": 9,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Hex Vector",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "0,10": {
      "id": "0,10",
      "q": 0,
      "r": 10,
      "ring": 10,
      "type": "gateway",
      "axis": "hybrid",
      "effects": [
        "Shared gate for the Seer's Annex outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "HYB",
        "gateway",
        "elemental",
        "outer",
        "Seer's Annex"
      ],
      "clusterId": "bootstrap-r10-gateway-seer-s-annex",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring.",
      "name": "Seer's Annex Gate"
    },
    "1,-10": {
      "id": "1,-10",
      "q": 1,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Cold Eye",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-9": {
      "id": "1,-9",
      "q": 1,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Open Guard",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-8": {
      "id": "1,-8",
      "q": 1,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Needle Line",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-7": {
      "id": "1,-7",
      "q": 1,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "Clean Read",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-6": {
      "id": "1,-6",
      "q": 1,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "Gap Finder",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-5": {
      "id": "1,-5",
      "q": 1,
      "r": -5,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "name": "Second Look",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r5-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-4": {
      "id": "1,-4",
      "q": 1,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "name": "Soft Target",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r4-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-3": {
      "id": "1,-3",
      "q": 1,
      "r": -3,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "name": "Soft Target",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r3-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-2": {
      "id": "1,-2",
      "q": 1,
      "r": -2,
      "ring": 2,
      "type": "small",
      "axis": "dex",
      "name": "Second Look",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r2-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,-1": {
      "id": "1,-1",
      "q": 1,
      "r": -1,
      "ring": 1,
      "type": "small",
      "axis": "hybrid",
      "name": "Oiled Cloak",
      "effects": [
        "+3% to all Elemental Resistances"
      ],
      "stat": "allResistances",
      "amount": 3,
      "mods": [
        {
          "stat": "allResistances",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "resistance"
      ],
      "clusterId": "bootstrap-r1-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,0": {
      "id": "1,0",
      "q": 1,
      "r": 0,
      "ring": 1,
      "type": "small",
      "axis": "int",
      "name": "Thoughtspark",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r1-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,1": {
      "id": "1,1",
      "q": 1,
      "r": 1,
      "ring": 2,
      "type": "small",
      "axis": "int",
      "name": "Lantern Host",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r2-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,2": {
      "id": "1,2",
      "q": 1,
      "r": 2,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "name": "Chalk Line",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r3-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,3": {
      "id": "1,3",
      "q": 1,
      "r": 3,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "name": "Long Leash",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r4-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,4": {
      "id": "1,4",
      "q": 1,
      "r": 4,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "name": "Runic Memory",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r5-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,5": {
      "id": "1,5",
      "q": 1,
      "r": 5,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Servant Rule",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,6": {
      "id": "1,6",
      "q": 1,
      "r": 6,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Amber Formula",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,7": {
      "id": "1,7",
      "q": 1,
      "r": 7,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Living Ink",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,8": {
      "id": "1,8",
      "q": 1,
      "r": 8,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Measured Risk",
      "effects": [
        "+6% Elemental and Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 6,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 6
        }
      ],
      "tags": [
        "HYB",
        "small",
        "elemental"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "1,9": {
      "id": "1,9",
      "q": 1,
      "r": 9,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "name": "Salted Wound",
      "effects": [
        "+7% Ailment Effect"
      ],
      "stat": "ailmentEffect",
      "amount": 7,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 7
        }
      ],
      "tags": [
        "HYB",
        "small",
        "ailment",
        "outer"
      ],
      "clusterId": "bootstrap-r10-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-10": {
      "id": "2,-10",
      "q": 2,
      "r": -10,
      "ring": 10,
      "type": "notable",
      "axis": "dex",
      "name": "Far Hand Geometry",
      "effects": [
        "+22% Projectile Damage",
        "Projectiles gain +1 rebound after travelling through a conduit loop"
      ],
      "stat": "projectileDamage",
      "amount": 22,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 22
        }
      ],
      "tags": [
        "DEX",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-9": {
      "id": "2,-9",
      "q": 2,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Green Angle",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-8": {
      "id": "2,-8",
      "q": 2,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Far Hand",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-7": {
      "id": "2,-7",
      "q": 2,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "String Theory",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-6": {
      "id": "2,-6",
      "q": 2,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "Far Hand",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-5": {
      "id": "2,-5",
      "q": 2,
      "r": -5,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "name": "Green Angle",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r5-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-4": {
      "id": "2,-4",
      "q": 2,
      "r": -4,
      "ring": 4,
      "type": "notable",
      "axis": "dex",
      "name": "Corsair",
      "effects": [
        "+220 Evasion Rating",
        "+10% Movement Speed for 4 seconds after a kill"
      ],
      "stat": "evasion",
      "amount": 220,
      "mods": [
        {
          "stat": "evasion",
          "amount": 220
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r4-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-3": {
      "id": "2,-3",
      "q": 2,
      "r": -3,
      "ring": 3,
      "type": "small",
      "axis": "dex",
      "name": "Fletched Line",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r3-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-2": {
      "id": "2,-2",
      "q": 2,
      "r": -2,
      "ring": 2,
      "type": "notable",
      "axis": "hybrid",
      "name": "Trickster",
      "effects": [
        "+180 Evasion Rating",
        "Traps arm 30% faster"
      ],
      "stat": "evasion",
      "amount": 180,
      "mods": [
        {
          "stat": "evasion",
          "amount": 180
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r2-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,-1": {
      "id": "2,-1",
      "q": 2,
      "r": -1,
      "ring": 2,
      "type": "small",
      "axis": "int",
      "name": "Blue Aegis",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r2-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,0": {
      "id": "2,0",
      "q": 2,
      "r": 0,
      "ring": 2,
      "type": "notable",
      "axis": "int",
      "name": "Summoner",
      "effects": [
        "+25% Minion Damage",
        "+1 maximum companion while a loop conduit is complete"
      ],
      "stat": "minionDamage",
      "amount": 25,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 25
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r2-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,1": {
      "id": "2,1",
      "q": 2,
      "r": 1,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "name": "Familiar Line",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r3-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,2": {
      "id": "2,2",
      "q": 2,
      "r": 2,
      "ring": 4,
      "type": "notable",
      "axis": "int",
      "name": "Hierophant",
      "effects": [
        "+180 Energy Shield",
        "Auras you cast gain +12% effect"
      ],
      "stat": "energyShield",
      "amount": 180,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 180
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r4-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,3": {
      "id": "2,3",
      "q": 2,
      "r": 3,
      "ring": 5,
      "type": "notable",
      "axis": "int",
      "name": "Summoner",
      "effects": [
        "+25% Minion Damage",
        "+1 maximum companion while a loop conduit is complete"
      ],
      "stat": "minionDamage",
      "amount": 25,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 25
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r5-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,4": {
      "id": "2,4",
      "q": 2,
      "r": 4,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Thoughtspark",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,5": {
      "id": "2,5",
      "q": 2,
      "r": 5,
      "ring": 7,
      "type": "notable",
      "axis": "int",
      "name": "Hierophant",
      "effects": [
        "+180 Energy Shield",
        "Auras you cast gain +12% effect"
      ],
      "stat": "energyShield",
      "amount": 180,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 180
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r7-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,6": {
      "id": "2,6",
      "q": 2,
      "r": 6,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Chalk Line",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,7": {
      "id": "2,7",
      "q": 2,
      "r": 7,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Long Leash",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "2,8": {
      "id": "2,8",
      "q": 2,
      "r": 8,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Runic Memory",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-10": {
      "id": "3,-10",
      "q": 3,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Wind Pocket",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-9": {
      "id": "3,-9",
      "q": 3,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Narrow Escape",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-8": {
      "id": "3,-8",
      "q": 3,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Light Step",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-7": {
      "id": "3,-7",
      "q": 3,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "Loose Footing",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-6": {
      "id": "3,-6",
      "q": 3,
      "r": -6,
      "ring": 6,
      "type": "keystone",
      "axis": "dex",
      "name": "The Hand Arrives First",
      "effects": [
        "Your first strike against each enemy always has advantage",
        "You lose 20% guard while not moving"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "DEX",
        "keystone"
      ],
      "clusterId": "bootstrap-r6-dex-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-5": {
      "id": "3,-5",
      "q": 3,
      "r": -5,
      "ring": 5,
      "type": "notable",
      "axis": "dex",
      "name": "Far Hand Geometry",
      "effects": [
        "+22% Projectile Damage",
        "Projectiles gain +1 rebound after travelling through a conduit loop"
      ],
      "stat": "projectileDamage",
      "amount": 22,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 22
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r5-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-4": {
      "id": "3,-4",
      "q": 3,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "dex",
      "name": "Read the Room",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion"
      ],
      "clusterId": "bootstrap-r4-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-3": {
      "id": "3,-3",
      "q": 3,
      "r": -3,
      "ring": 3,
      "type": "small",
      "axis": "hybrid",
      "name": "Reservoir Knot",
      "effects": [
        "+3% Cooldown Recovery Rate"
      ],
      "stat": "cooldownRecovery",
      "amount": 3,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "recovery"
      ],
      "clusterId": "bootstrap-r3-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-2": {
      "id": "3,-2",
      "q": 3,
      "r": -2,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "name": "Long Leash",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r3-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,-1": {
      "id": "3,-1",
      "q": 3,
      "r": -1,
      "ring": 3,
      "type": "small",
      "axis": "int",
      "name": "Second Sigil",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r3-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,0": {
      "id": "3,0",
      "q": 3,
      "r": 0,
      "ring": 3,
      "type": "mastery",
      "axis": "int",
      "name": "Mastery of Thought",
      "effects": [
        "Choose this region for spells, wards, companions, and resource engines."
      ],
      "mods": [],
      "tags": [
        "INT",
        "mastery"
      ],
      "clusterId": "bootstrap-r3-int-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,1": {
      "id": "3,1",
      "q": 3,
      "r": 1,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "name": "Living Ink",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r4-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,2": {
      "id": "3,2",
      "q": 3,
      "r": 2,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "name": "Held Word",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r5-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,3": {
      "id": "3,3",
      "q": 3,
      "r": 3,
      "ring": 6,
      "type": "keystone",
      "axis": "int",
      "name": "The Book Reads Back",
      "effects": [
        "Spells repeat once at 45% effect",
        "Repeated spells cost life instead of mana"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "INT",
        "keystone"
      ],
      "clusterId": "bootstrap-r6-int-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,4": {
      "id": "3,4",
      "q": 3,
      "r": 4,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Third Reading",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,5": {
      "id": "3,5",
      "q": 3,
      "r": 5,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Familiar Line",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,6": {
      "id": "3,6",
      "q": 3,
      "r": 6,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Cold Diagram",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "3,7": {
      "id": "3,7",
      "q": 3,
      "r": 7,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Bound Chorus",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-10": {
      "id": "4,-10",
      "q": 4,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Twin Feint",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-9": {
      "id": "4,-9",
      "q": 4,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Whisper Cut",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-8": {
      "id": "4,-8",
      "q": 4,
      "r": -8,
      "ring": 8,
      "type": "keystone",
      "axis": "dex",
      "name": "The Steed",
      "effects": [
        "+20% Movement Speed and skills can be used while moving",
        "You cannot stand and fight: -20% damage while stationary"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "DEX",
        "keystone"
      ],
      "clusterId": "bootstrap-r8-dex-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-7": {
      "id": "4,-7",
      "q": 4,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "Knife Tempo",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-6": {
      "id": "4,-6",
      "q": 4,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "Edge Step",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-5": {
      "id": "4,-5",
      "q": 4,
      "r": -5,
      "ring": 5,
      "type": "small",
      "axis": "dex",
      "name": "Clean Draw",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade"
      ],
      "clusterId": "bootstrap-r5-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-4": {
      "id": "4,-4",
      "q": 4,
      "r": -4,
      "ring": 4,
      "type": "small",
      "axis": "hybrid",
      "name": "Split Study",
      "effects": [
        "+6% Elemental and Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 6,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 6
        }
      ],
      "tags": [
        "HYB",
        "small",
        "elemental"
      ],
      "clusterId": "bootstrap-r4-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-3": {
      "id": "4,-3",
      "q": 4,
      "r": -3,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "name": "Quiet Font",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana"
      ],
      "clusterId": "bootstrap-r4-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-2": {
      "id": "4,-2",
      "q": 4,
      "r": -2,
      "ring": 4,
      "type": "notable",
      "axis": "int",
      "name": "Hierophant",
      "effects": [
        "+180 Energy Shield",
        "Auras you cast gain +12% effect"
      ],
      "stat": "energyShield",
      "amount": 180,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 180
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r4-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,-1": {
      "id": "4,-1",
      "q": 4,
      "r": -1,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "name": "Mirror Ward",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r4-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,0": {
      "id": "4,0",
      "q": 4,
      "r": 0,
      "ring": 4,
      "type": "small",
      "axis": "int",
      "name": "Chalk Line",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r4-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,1": {
      "id": "4,1",
      "q": 4,
      "r": 1,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "name": "Long Leash",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r5-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,2": {
      "id": "4,2",
      "q": 4,
      "r": 2,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Runic Memory",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,3": {
      "id": "4,3",
      "q": 4,
      "r": 3,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Servant Rule",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,4": {
      "id": "4,4",
      "q": 4,
      "r": 4,
      "ring": 8,
      "type": "keystone",
      "axis": "int",
      "name": "The Serpent",
      "effects": [
        "Your critical strikes always poison, and poisons stack once more",
        "You take 20% more damage from ailments"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "INT",
        "keystone"
      ],
      "clusterId": "bootstrap-r8-int-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,5": {
      "id": "4,5",
      "q": 4,
      "r": 5,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Living Ink",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "4,6": {
      "id": "4,6",
      "q": 4,
      "r": 6,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Held Word",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-10": {
      "id": "5,-10",
      "q": 5,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Soft Target",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-9": {
      "id": "5,-9",
      "q": 5,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Second Look",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-8": {
      "id": "5,-8",
      "q": 5,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Gap Finder",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-7": {
      "id": "5,-7",
      "q": 5,
      "r": -7,
      "ring": 7,
      "type": "notable",
      "axis": "dex",
      "name": "Corsair",
      "effects": [
        "+220 Evasion Rating",
        "+10% Movement Speed for 4 seconds after a kill"
      ],
      "stat": "evasion",
      "amount": 220,
      "mods": [
        {
          "stat": "evasion",
          "amount": 220
        }
      ],
      "tags": [
        "DEX",
        "notable"
      ],
      "clusterId": "bootstrap-r7-dex-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-6": {
      "id": "5,-6",
      "q": 5,
      "r": -6,
      "ring": 6,
      "type": "small",
      "axis": "dex",
      "name": "Needle Line",
      "effects": [
        "+0.8% Critical Strike Chance"
      ],
      "stat": "critChance",
      "amount": 0.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 0.8
        }
      ],
      "tags": [
        "DEX",
        "small",
        "critical"
      ],
      "clusterId": "bootstrap-r6-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-5": {
      "id": "5,-5",
      "q": 5,
      "r": -5,
      "ring": 5,
      "type": "small",
      "axis": "hybrid",
      "name": "Ash Measure",
      "effects": [
        "+3% to all Elemental Resistances"
      ],
      "stat": "allResistances",
      "amount": 3,
      "mods": [
        {
          "stat": "allResistances",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "resistance"
      ],
      "clusterId": "bootstrap-r5-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-4": {
      "id": "5,-4",
      "q": 5,
      "r": -4,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "name": "Amber Formula",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r5-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-3": {
      "id": "5,-3",
      "q": 5,
      "r": -3,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "name": "Deep Vessel",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana"
      ],
      "clusterId": "bootstrap-r5-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-2": {
      "id": "5,-2",
      "q": 5,
      "r": -2,
      "ring": 5,
      "type": "notable",
      "axis": "int",
      "name": "Occultist",
      "effects": [
        "+20% Hex and Curse Effect",
        "Cursed enemies deal 8% less damage to you"
      ],
      "stat": "ailmentEffect",
      "amount": 20,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 20
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r5-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,-1": {
      "id": "5,-1",
      "q": 5,
      "r": -1,
      "ring": 5,
      "type": "small",
      "axis": "int",
      "name": "Glyph Skin",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r5-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,0": {
      "id": "5,0",
      "q": 5,
      "r": 0,
      "ring": 5,
      "type": "mastery",
      "axis": "int",
      "name": "Mastery of Thought",
      "effects": [
        "Choose this region for spells, wards, companions, and resource engines."
      ],
      "mods": [],
      "tags": [
        "INT",
        "mastery"
      ],
      "clusterId": "bootstrap-r5-int-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,1": {
      "id": "5,1",
      "q": 5,
      "r": 1,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Bound Chorus",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,2": {
      "id": "5,2",
      "q": 5,
      "r": 2,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Thoughtspark",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,3": {
      "id": "5,3",
      "q": 5,
      "r": 3,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Lantern Host",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,4": {
      "id": "5,4",
      "q": 5,
      "r": 4,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Chalk Line",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "5,5": {
      "id": "5,5",
      "q": 5,
      "r": 5,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Long Leash",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-10": {
      "id": "6,-10",
      "q": 6,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Fletched Line",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-9": {
      "id": "6,-9",
      "q": 6,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Ricochet Habit",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-8": {
      "id": "6,-8",
      "q": 6,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Steady Loose",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-7": {
      "id": "6,-7",
      "q": 6,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "dex",
      "name": "String Theory",
      "effects": [
        "+9% Projectile Damage"
      ],
      "stat": "projectileDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "projectileDamage",
          "amount": 9
        }
      ],
      "tags": [
        "DEX",
        "small",
        "projectile"
      ],
      "clusterId": "bootstrap-r7-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-6": {
      "id": "6,-6",
      "q": 6,
      "r": -6,
      "ring": 6,
      "type": "notable",
      "axis": "hybrid",
      "name": "Spellblade Interval",
      "effects": [
        "+21% mixed Attack and Spell Damage",
        "Attack after casting grants +8 INT and +8 STR for 4 seconds"
      ],
      "stat": "spellDamage",
      "amount": 21,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 21
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r6-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-5": {
      "id": "6,-5",
      "q": 6,
      "r": -5,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Deep Vessel",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-4": {
      "id": "6,-4",
      "q": 6,
      "r": -4,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Chalk Line",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-3": {
      "id": "6,-3",
      "q": 6,
      "r": -3,
      "ring": 6,
      "type": "keystone",
      "axis": "int",
      "name": "The Book Reads Back",
      "effects": [
        "Spells repeat once at 45% effect",
        "Repeated spells cost life instead of mana"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "INT",
        "keystone"
      ],
      "clusterId": "bootstrap-r6-int-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-2": {
      "id": "6,-2",
      "q": 6,
      "r": -2,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Servant Rule",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,-1": {
      "id": "6,-1",
      "q": 6,
      "r": -1,
      "ring": 6,
      "type": "small",
      "axis": "int",
      "name": "Glass Calm",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r6-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,0": {
      "id": "6,0",
      "q": 6,
      "r": 0,
      "ring": 6,
      "type": "notable",
      "axis": "int",
      "name": "Occultist",
      "effects": [
        "+20% Hex and Curse Effect",
        "Cursed enemies deal 8% less damage to you"
      ],
      "stat": "ailmentEffect",
      "amount": 20,
      "mods": [
        {
          "stat": "ailmentEffect",
          "amount": 20
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r6-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,1": {
      "id": "6,1",
      "q": 6,
      "r": 1,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Roll Call",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,2": {
      "id": "6,2",
      "q": 6,
      "r": 2,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Third Reading",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,3": {
      "id": "6,3",
      "q": 6,
      "r": 3,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Familiar Line",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "6,4": {
      "id": "6,4",
      "q": 6,
      "r": 4,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Cold Diagram",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-10": {
      "id": "7,-10",
      "q": 7,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Wind Pocket",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-9": {
      "id": "7,-9",
      "q": 7,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "dex",
      "name": "Narrow Escape",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion"
      ],
      "clusterId": "bootstrap-r9-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-8": {
      "id": "7,-8",
      "q": 7,
      "r": -8,
      "ring": 8,
      "type": "small",
      "axis": "dex",
      "name": "Light Step",
      "effects": [
        "+90 Evasion Rating"
      ],
      "stat": "evasion",
      "amount": 90,
      "mods": [
        {
          "stat": "evasion",
          "amount": 90
        }
      ],
      "tags": [
        "DEX",
        "small",
        "evasion"
      ],
      "clusterId": "bootstrap-r8-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-7": {
      "id": "7,-7",
      "q": 7,
      "r": -7,
      "ring": 7,
      "type": "small",
      "axis": "hybrid",
      "name": "Deep Pockets",
      "effects": [
        "+3% Cooldown Recovery Rate"
      ],
      "stat": "cooldownRecovery",
      "amount": 3,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "recovery"
      ],
      "clusterId": "bootstrap-r7-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-6": {
      "id": "7,-6",
      "q": 7,
      "r": -6,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Roll Call",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-5": {
      "id": "7,-5",
      "q": 7,
      "r": -5,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Glyph Skin",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-4": {
      "id": "7,-4",
      "q": 7,
      "r": -4,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Cold Diagram",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-3": {
      "id": "7,-3",
      "q": 7,
      "r": -3,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Spare Ink",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-2": {
      "id": "7,-2",
      "q": 7,
      "r": -2,
      "ring": 7,
      "type": "notable",
      "axis": "int",
      "name": "Lanterns Answer",
      "effects": [
        "+23% Minion Damage",
        "Summoned allies inherit 10% of your path attributes"
      ],
      "stat": "minionDamage",
      "amount": 23,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 23
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r7-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,-1": {
      "id": "7,-1",
      "q": 7,
      "r": -1,
      "ring": 7,
      "type": "small",
      "axis": "int",
      "name": "Quiet Barrier",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r7-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,0": {
      "id": "7,0",
      "q": 7,
      "r": 0,
      "ring": 7,
      "type": "mastery",
      "axis": "int",
      "name": "Archmage",
      "effects": [
        "+12% Spell Damage and +80 maximum Mana",
        "Your highest-cost spell gains +1 echo."
      ],
      "mods": [],
      "tags": [
        "INT",
        "mastery"
      ],
      "clusterId": "bootstrap-r7-int-mastery",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,1": {
      "id": "7,1",
      "q": 7,
      "r": 1,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Servant Rule",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,2": {
      "id": "7,2",
      "q": 7,
      "r": 2,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Amber Formula",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "7,3": {
      "id": "7,3",
      "q": 7,
      "r": 3,
      "ring": 10,
      "type": "notable",
      "axis": "int",
      "name": "Alchemist",
      "effects": [
        "+10% Cooldown Recovery Rate",
        "Flasks and preparations last 20% longer"
      ],
      "stat": "cooldownRecovery",
      "amount": 10,
      "mods": [
        {
          "stat": "cooldownRecovery",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-10": {
      "id": "8,-10",
      "q": 8,
      "r": -10,
      "ring": 10,
      "type": "small",
      "axis": "dex",
      "name": "Twin Feint",
      "effects": [
        "+4% Attack Speed"
      ],
      "stat": "attackSpeed",
      "amount": 4,
      "mods": [
        {
          "stat": "attackSpeed",
          "amount": 4
        }
      ],
      "tags": [
        "DEX",
        "small",
        "blade",
        "outer"
      ],
      "clusterId": "bootstrap-r10-dex-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-9": {
      "id": "8,-9",
      "q": 8,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Practical Lore",
      "effects": [
        "+6% Elemental and Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 6,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 6
        }
      ],
      "tags": [
        "HYB",
        "small",
        "elemental"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-8": {
      "id": "8,-8",
      "q": 8,
      "r": -8,
      "ring": 8,
      "type": "notable",
      "axis": "hybrid",
      "name": "Trickster",
      "effects": [
        "+180 Evasion Rating",
        "Traps arm 30% faster"
      ],
      "stat": "evasion",
      "amount": 180,
      "mods": [
        {
          "stat": "evasion",
          "amount": 180
        }
      ],
      "tags": [
        "HYB",
        "notable"
      ],
      "clusterId": "bootstrap-r8-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-7": {
      "id": "8,-7",
      "q": 8,
      "r": -7,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Glyph Skin",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-6": {
      "id": "8,-6",
      "q": 8,
      "r": -6,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Servant Rule",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-5": {
      "id": "8,-5",
      "q": 8,
      "r": -5,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Glass Calm",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-4": {
      "id": "8,-4",
      "q": 8,
      "r": -4,
      "ring": 8,
      "type": "keystone",
      "axis": "int",
      "name": "The Tower",
      "effects": [
        "+30% Block Chance while stationary",
        "You cannot dodge"
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "INT",
        "keystone"
      ],
      "clusterId": "bootstrap-r8-int-keystone",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-3": {
      "id": "8,-3",
      "q": 8,
      "r": -3,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Stored Word",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-2": {
      "id": "8,-2",
      "q": 8,
      "r": -2,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Familiar Line",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,-1": {
      "id": "8,-1",
      "q": 8,
      "r": -1,
      "ring": 8,
      "type": "small",
      "axis": "int",
      "name": "Layered Thought",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r8-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,0": {
      "id": "8,0",
      "q": 8,
      "r": 0,
      "ring": 8,
      "type": "notable",
      "axis": "int",
      "name": "Lanterns Answer",
      "effects": [
        "+23% Minion Damage",
        "Summoned allies inherit 10% of your path attributes"
      ],
      "stat": "minionDamage",
      "amount": 23,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 23
        }
      ],
      "tags": [
        "INT",
        "notable"
      ],
      "clusterId": "bootstrap-r8-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,1": {
      "id": "8,1",
      "q": 8,
      "r": 1,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Lantern Host",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "8,2": {
      "id": "8,2",
      "q": 8,
      "r": 2,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Chalk Line",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-10": {
      "id": "9,-10",
      "q": 9,
      "r": -10,
      "ring": 10,
      "type": "notable",
      "axis": "hybrid",
      "name": "Inquisitor",
      "effects": [
        "+1.8% Critical Strike Chance",
        "Criticals against hexed enemies recover 2% Mana"
      ],
      "stat": "critChance",
      "amount": 1.8,
      "mods": [
        {
          "stat": "critChance",
          "amount": 1.8
        }
      ],
      "tags": [
        "HYB",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-hybrid-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-9": {
      "id": "9,-9",
      "q": 9,
      "r": -9,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Fourfold Ward",
      "effects": [
        "+3% to all Elemental Resistances"
      ],
      "stat": "allResistances",
      "amount": 3,
      "mods": [
        {
          "stat": "allResistances",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "resistance"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-8": {
      "id": "9,-8",
      "q": 9,
      "r": -8,
      "ring": 9,
      "type": "small",
      "axis": "hybrid",
      "name": "Joined Method",
      "effects": [
        "+6% Elemental and Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 6,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 6
        }
      ],
      "tags": [
        "HYB",
        "small",
        "elemental"
      ],
      "clusterId": "bootstrap-r9-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-7": {
      "id": "9,-7",
      "q": 9,
      "r": -7,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Glass Calm",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-6": {
      "id": "9,-6",
      "q": 9,
      "r": -6,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Lantern Host",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-5": {
      "id": "9,-5",
      "q": 9,
      "r": -5,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Quiet Barrier",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-4": {
      "id": "9,-4",
      "q": 9,
      "r": -4,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Runic Memory",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-3": {
      "id": "9,-3",
      "q": 9,
      "r": -3,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Still Water",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-2": {
      "id": "9,-2",
      "q": 9,
      "r": -2,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Living Ink",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,-1": {
      "id": "9,-1",
      "q": 9,
      "r": -1,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Blue Aegis",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,0": {
      "id": "9,0",
      "q": 9,
      "r": 0,
      "ring": 9,
      "type": "small",
      "axis": "int",
      "name": "Third Reading",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell"
      ],
      "clusterId": "bootstrap-r9-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "9,1": {
      "id": "9,1",
      "q": 9,
      "r": 1,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Familiar Line",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-10": {
      "id": "10,-10",
      "q": 10,
      "r": -10,
      "ring": 10,
      "type": "gateway",
      "axis": "hybrid",
      "effects": [
        "Shared gate for the Spellblade Annex outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "HYB",
        "gateway",
        "ailment",
        "outer",
        "Spellblade Annex"
      ],
      "clusterId": "bootstrap-r10-gateway-spellblade-annex",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring.",
      "name": "Spellblade Annex Gate"
    },
    "10,-9": {
      "id": "10,-9",
      "q": 10,
      "r": -9,
      "ring": 10,
      "type": "small",
      "axis": "hybrid",
      "name": "Hearth Charm",
      "effects": [
        "+3% to all Elemental Resistances"
      ],
      "stat": "allResistances",
      "amount": 3,
      "mods": [
        {
          "stat": "allResistances",
          "amount": 3
        }
      ],
      "tags": [
        "HYB",
        "small",
        "resistance",
        "outer"
      ],
      "clusterId": "bootstrap-r10-hybrid-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-8": {
      "id": "10,-8",
      "q": 10,
      "r": -8,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Held Word",
      "effects": [
        "+10% Spell Damage"
      ],
      "stat": "spellDamage",
      "amount": 10,
      "mods": [
        {
          "stat": "spellDamage",
          "amount": 10
        }
      ],
      "tags": [
        "INT",
        "small",
        "spell",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-7": {
      "id": "10,-7",
      "q": 10,
      "r": -7,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Stored Word",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-6": {
      "id": "10,-6",
      "q": 10,
      "r": -6,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Familiar Line",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-5": {
      "id": "10,-5",
      "q": 10,
      "r": -5,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Layered Thought",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-4": {
      "id": "10,-4",
      "q": 10,
      "r": -4,
      "ring": 10,
      "type": "notable",
      "axis": "int",
      "name": "Blue Arithmetic",
      "effects": [
        "+120 maximum Mana",
        "Mana spent recently improves spell critical chance"
      ],
      "stat": "mana",
      "amount": 120,
      "mods": [
        {
          "stat": "mana",
          "amount": 120
        }
      ],
      "tags": [
        "INT",
        "notable",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-notable",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-3": {
      "id": "10,-3",
      "q": 10,
      "r": -3,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Blue Reserve",
      "effects": [
        "+35 maximum Mana"
      ],
      "stat": "mana",
      "amount": 35,
      "mods": [
        {
          "stat": "mana",
          "amount": 35
        }
      ],
      "tags": [
        "INT",
        "small",
        "mana",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-2": {
      "id": "10,-2",
      "q": 10,
      "r": -2,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Long Leash",
      "effects": [
        "+9% Minion Damage"
      ],
      "stat": "minionDamage",
      "amount": 9,
      "mods": [
        {
          "stat": "minionDamage",
          "amount": 9
        }
      ],
      "tags": [
        "INT",
        "small",
        "minion",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,-1": {
      "id": "10,-1",
      "q": 10,
      "r": -1,
      "ring": 10,
      "type": "small",
      "axis": "int",
      "name": "Second Sigil",
      "effects": [
        "+48 Energy Shield"
      ],
      "stat": "energyShield",
      "amount": 48,
      "mods": [
        {
          "stat": "energyShield",
          "amount": 48
        }
      ],
      "tags": [
        "INT",
        "small",
        "energy-shield",
        "outer"
      ],
      "clusterId": "bootstrap-r10-int-small",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring."
    },
    "10,0": {
      "id": "10,0",
      "q": 10,
      "r": 0,
      "ring": 10,
      "type": "gateway",
      "axis": "int",
      "effects": [
        "Shared gate for the Genius Circle outer circle.",
        "Unlock condition: allocate this gate and complete any inner six-node circle."
      ],
      "stat": null,
      "amount": 0,
      "mods": [],
      "tags": [
        "INT",
        "gateway",
        "spell",
        "outer",
        "Genius Circle"
      ],
      "clusterId": "bootstrap-r10-gateway-genius-circle",
      "status": "draft",
      "notes": "Phase 0 bootstrap from the old procedural generator; replace during authoring.",
      "name": "Genius Circle Gate"
    }
  }
};
})(typeof window !== "undefined" ? window : globalThis);
