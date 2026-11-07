# Rename map (2026-11-07)

Generated from `rename-map.json` (the source; edit that, then rerun `node owner-rules/apply-rename-map.mjs`).
Display strings change; ids, keys, unlock flags, stat ids, seat ids and saved-data values keep their old spelling. The lint (`lint.mjs`) fails on any `before` in game text, data and current docs.

| Category | Before | After | Note |
|---|---|---|---|
| class node | Archmage Waystone | INT Anchor |  |
| class node | Archmage Gate | INT Gate |  |
| class node | Archmage milestone | INT class node |  |
| class node | the Archmage class | the INT class |  |
| class node | Archmage class | INT class |  |
| class node | Archmage | INT Class | tree node name, class display, test literal; CLASS_UNLOCKS keys follow (exact value) |
| class node | Assassin Waystone | INT/DEX Anchor |  |
| class node | Assassin Gate | INT/DEX Gate |  |
| class node | Assassin milestone | INT/DEX class node |  |
| class node | the Assassin class | the INT/DEX class |  |
| class node | Assassin class | INT/DEX class |  |
| class node | Assassin | INT/DEX Class | tree node name, class display, test literal; CLASS_UNLOCKS keys follow (exact value) |
| class node | Nightblade Waystone | INT/DEX Anchor |  |
| class node | Nightblade Gate | INT/DEX Gate |  |
| class node | Nightblade milestone | INT/DEX class node |  |
| class node | the Nightblade class | the INT/DEX class |  |
| class node | Nightblade class | INT/DEX class |  |
| class node | Nightblade | INT/DEX Class | tree node name, class display, test literal; CLASS_UNLOCKS keys follow (exact value) |
| class node | Acrobat Waystone | DEX Anchor |  |
| class node | Acrobat Gate | DEX Gate |  |
| class node | Acrobat milestone | DEX class node |  |
| class node | the Acrobat class | the DEX class |  |
| class node | Acrobat class | DEX class |  |
| class node | Acrobat | DEX Class | tree node name, class display, test literal; CLASS_UNLOCKS keys follow (exact value) |
| class node | Reaver Waystone | DEX/STR Anchor |  |
| class node | Reaver Gate | DEX/STR Gate |  |
| class node | Reaver milestone | DEX/STR class node |  |
| class node | the Reaver class | the DEX/STR class |  |
| class node | Reaver class | DEX/STR class |  |
| class node | Reaver | DEX/STR Class | tree node name, class display, test literal; CLASS_UNLOCKS keys follow (exact value) |
| class node | Champion Waystone | STR Anchor |  |
| class node | Champion Gate | STR Gate |  |
| class node | Champion milestone | STR class node |  |
| class node | the Champion class | the STR class |  |
| class node | Champion class | STR class |  |
| class node | Champion | STR Class | tree node name, class display, test literal; CLASS_UNLOCKS keys follow (exact value) |
| class node | Ritualist Waystone | STR/INT Anchor |  |
| class node | Ritualist Gate | STR/INT Gate |  |
| class node | Ritualist milestone | STR/INT class node |  |
| class node | the Ritualist class | the STR/INT class |  |
| class node | Ritualist class | STR/INT class |  |
| class node | Ritualist | STR/INT Class | tree node name, class display, test literal; CLASS_UNLOCKS keys follow (exact value) |
| class node | Archmage/Ritualist | INT or STR/INT |  |
| class node | Archmage or Ritualist | INT or STR/INT |  |
| wedge or spoke | The Kiln Line | the fire and ignite wedge (STR toward STR/INT) |  |
| wedge or spoke | Kiln Line | fire and ignite wedge (STR toward STR/INT) |  |
| wedge or spoke | The Procession | the companion and Ward wedge (INT toward STR/INT) |  |
| wedge or spoke | Procession | companion and Ward wedge (INT toward STR/INT) |  |
| wedge or spoke | The Drowned Study | the cold and marks wedge (INT toward INT/DEX) |  |
| wedge or spoke | Drowned Study | cold and marks wedge (INT toward INT/DEX) |  |
| wedge or spoke | The Unlit Road | the poison and traps wedge (DEX toward INT/DEX) |  |
| wedge or spoke | Unlit Road | poison and traps wedge (DEX toward INT/DEX) |  |
| wedge or spoke | The High Paths | the projectile and shock wedge (DEX toward DEX/STR) |  |
| wedge or spoke | High Paths | projectile and shock wedge (DEX toward DEX/STR) |  |
| wedge or spoke | The Red Field | the physical and bleed wedge (STR toward DEX/STR) |  |
| wedge or spoke | Red Field | physical and bleed wedge (STR toward DEX/STR) |  |
| wedge or spoke | Nightwork | INT/DEX spoke |  |
| wedge or spoke | Skirmisher | DEX/STR spoke |  |
| pack or slot | the Quick Rig window — an extra tool slot | the extra tool slot |  |
| pack or slot | the Attendant window — an extra focus slot | an extra focus slot |  |
| pack or slot | the Preparation Case — a 4×4 pack | the supply pack (4×4) |  |
| pack or slot | the Spoils Roll — a 4×4 pack | the animal parts pack (4×4) |  |
| pack or slot | the Reliquary — a 4×4 pack | the relic pack (4×4) |  |
| pack or slot | Quick Rig window | tool slot |  |
| pack or slot | Quick Rigs | Tool-slot items |  |
| pack or slot | Quick Rig | Tool slot |  |
| pack or slot | quick rig | tool slot |  |
| pack or slot | Attendant focus | extra focus |  |
| pack or slot | Attendant Orb | Extra Focus |  |
| pack or slot | Attendant seat | extra focus slot |  |
| pack or slot | Attendant window | extra focus slot |  |
| pack or slot | attendant focus | extra focus |  |
| pack or slot | attendant window | extra focus slot |  |
| pack or slot | Attendants | Extra foci |  |
| pack or slot | Attendant | Extra focus |  |
| pack or slot | War-calls | war horns |  |
| pack or slot | War-call | War Horn |  |
| pack or slot | war-call | war horn |  |
| pack or slot | Warcall | War Horn |  |
| pack or slot | Spoils Roll | Animal Parts Pack |  |
| pack or slot | spoils roll | animal parts pack |  |
| pack or slot | Spoils on Kill | Animal Parts on Kill |  |
| pack or slot | Extra Beast Spoils | Extra Animal Parts |  |
| pack or slot | Spoils cannot be sold | Animal parts cannot be sold |  |
| pack or slot | leave a spoil | leave an animal part |  |
| pack or slot | one extra spoil | one extra animal part |  |
| pack or slot | Trophy Attributes | Animal Part Attributes |  |
| pack or slot | Trophy Mastery | Animal Parts Mastery |  |
| pack or slot | Every trophy in your | Every animal part in your |  |
| pack or slot | Preparation Case | Supply Pack |  |
| pack or slot | preparation case | supply pack |  |
| pack or slot | Preserved Preparations | Preserved Supplies |  |
| pack or slot | Reliquary Object | Relic |  |
| pack or slot | Lasting Relic Blessings | Lasting Relic Effects |  |
| pack or slot | keep their blessings | keep their effects |  |
| pack or slot | Reliquary | Relic pack |  |
| pack or slot | reliquary | relic pack |  |
| pack or slot | Reliquaries | relic packs |  |
| pack or slot | Trophies | Animal Parts Pack | gate passive name (exact value) |
| pack or slot | Preparations | Supply Pack | gate passive name (exact value) |
| pack or slot | Relics | Relic Pack | gate passive name (exact value) |
| spell term | Rite Focus socket | spell focus socket |  |
| spell term | Rite Focus | Spell Focus |  |
| spell term | Rite foci | Spell foci |  |
| spell term | Rite Damage | Spell Damage |  |
| spell term | Rite damage | Spell damage |  |
| spell term | Rite Speed | Cast Speed |  |
| spell term | Rite speed | Cast speed |  |
| spell term | Rite Power | Spell Power |  |
| spell term | Rite Reroll | Spell Reroll |  |
| spell term | Rites Cost Life | Spells Cost Life |  |
| spell term | Efficient Rites | Efficient Spells |  |
| spell term | Lingering Rites | Lingering Spells |  |
| spell term | Cheaper Repeated Rites | Cheaper Repeated Spells |  |
| spell term | Repeated Rites | Repeated Spells |  |
| spell term | Chilling Rite | Chilling Spells |  |
| spell term | Ward Counts as Rite | Ward Counts as a Spell |  |
| spell term | standing rites | maintained spells | (scope: game) |
| spell term | Rites | Spells | (scope: game) |
| spell term | Rite | Spell | (scope: game) |
| spell term | rites | spells | (scope: game) |
| spell term | rite | spell | (scope: game) |
| unique item | Clear Mind | Spell Damage at High Spirit |  |
| skill or base | Claw chain | Claw combo |  |
| skill or base | Jawbone chain | Jawbone combo |  |
| skill or base | Traveling cut | Moving slash |  |
| skill or base | Held spin | Channelled spin |  |
| skill or base | Reaping sweep | Bleeding sweep |  |
| skill or base | Flint Lopper | Two-handed Flint Axe |  |
| skill or base | Root Ball | Root Club |  |
| skill or base | Bone Spikes | Bone Claws |  |
| tree label | Unseen Passage | Pass Unnoticed |  |
| tree label | Strike the Unhurt | Damage Before Being Hurt |  |
| tree label | Loop Crowns | Closed Loops |  |
| tree label | Unchosen Arc | No Option Chosen |  |
| tree label | Redundant Circuit | Redundant Links |  |
| tree label | Straight Axis Chain | Straight Axis Path |  |
| tree label | Bronze Route | STR path |  |
| tree label | Quickstep Trace | DEX path |  |
| tree label | Memory Thread | INT path |  |
| tree label | Braided Span | Hybrid path |  |
| tree label | Waystones | Anchors |  |
| tree label | Waystone | Anchor |  |
| tree label | ember cup | off-hand focus |  |
| weaving row | Element row | Damage type row |  |
| weaving row | Focus row | Effect row |  |
| weaving row | Alignment row | Intent row |  |
| weaving row | Sphere row | Target row |  |
| weaving row | Reach row | Range row |  |
| weaving row | Element | Damage type | lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename (exact value) (scope: lattice) |
| weaving row | Focus | Effect | lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename (exact value) (scope: lattice) |
| weaving row | Alignment | Intent | lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename (exact value) (scope: lattice) |
| weaving row | Sphere | Target | lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename (exact value) (scope: lattice) |
| weaving row | Reach | Range | lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename (exact value) (scope: lattice) |
| item pipeline | Skymetal | Meteoric iron |  |
| item pipeline | Nightglass | Obsidian |  |
| item pipeline | War-Helm | Helmet |  |
| item pipeline | Warbelt | War belt |  |
| item pipeline | Warshield | Shield |  |
| item pipeline | Warspear | Spear |  |
| item pipeline | Greathelm | Large helmet |  |
| flavour sentence | Road signs mean more to you than most (design text) | (dropped) | dropped: no mechanic stated (exact value) |
| flavour sentence | The crows remember who fed them (design text) | (dropped) | dropped: no mechanic stated (exact value) |
| flavour sentence | Enemies chase you uphill at their peril (design text) | (dropped) | dropped: no mechanic stated (exact value) |
| flavour sentence | You are hard to mark in the mist (design text) | (dropped) | dropped: no mechanic stated (exact value) |
| flavour sentence | Poison from this dose slows (design text) | Poison you inflict also slows (design text) | plain restatement (exact value) |
| flavour sentence | Projectiles aimed at you drift in the wind (design text) | Enemy projectiles are less accurate against you (design text) | plain restatement (exact value) |
| flavour sentence | Wither cannot cross the circle while you stand still (design text) | You cannot be Withered while standing still (design text) | plain restatement (exact value) |
| flavour sentence | Your Bleeds close only when their victim falls (design text) | Your Bleeds last until the enemy dies (design text) | plain restatement (exact value) |
| flavour sentence | Your Bleeds remember: reapplying restores full duration (design text) | Reapplying a Bleed restores its full duration (design text) | plain restatement (exact value) |
| flavour sentence | Your hits shed light; the unlit cannot hide from you (design text) | Your hits reveal hidden enemies (design text) | plain restatement (exact value) |
| flavour sentence | Once rung, your next rite Chills everything it touches (design text) | After you sound your horn, your next spell Chills everything it hits (design text) | plain restatement (exact value) |
| flavour sentence | Marks you write cost no Spirit (design text) | Marks cost no Spirit (design text) | plain restatement (exact value) |
| flavour sentence | Your Evasion is 10% lower while you hold the line (design text) | Your Evasion is 10% lower while standing still (design text) | plain restatement (exact value) |
| flavour sentence | You cannot Block while you keep this pace (design text) | You cannot Block while moving (design text) | plain restatement (exact value) |
| pack or slot | Attendant | Extra Focus Slot | gate passive and window label (exact value) |
| pack or slot | Quick Rig | Tool Slot | gate passive and window label (exact value) |
| pack or slot | Reliquary | Relic Pack | window label (exact value) |
| pack or slot | Spoils Roll | Animal Parts Pack | window label (exact value) |
| pack or slot | Preparation Case | Supply Pack | window label (exact value) |
| pack or slot | Spoils | Animal parts |  |
| pack or slot | Preparations | Supplies |  |
| pack or slot | Trophies | Animal parts |  |
| item pipeline | Slaughter | Kill Bonuses | VesselForge bond theme name (exact value) |
| item pipeline | Wayfaring | Movement | VesselForge bond theme name (exact value) |
| item pipeline | Warding | Block and Ward | VesselForge bond theme name (exact value) |
| item pipeline | Greataxe | Two-handed Axe | item base name |
| item pipeline | Copper Reliquary | Copper Relic Box | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | Jade Reliquary | Jade Relic Box | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | Bone Reliquary | Bone Relic Box | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | Amber Reliquary | Amber Relic Box | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | reliquary box | relic box | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | reliquary casket | relic casket | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | reliquary coffer | relic coffer | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | copper-alloy reliquary | copper-alloy relic box | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | copper reliquary | copper relic box | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | war-call instrument | war horn | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | war-call item | war horn item | object noun: a reliquary is a medieval container; the period object is a relic box |
| item pipeline | war-call readability | war horn readability | object noun: a reliquary is a medieval container; the period object is a relic box |
| class node | Champion | STR class | prose form (exact string values use the entry above) |
| class node | Acrobat | DEX class | prose form (exact string values use the entry above) |
| class node | Archmage | INT class | prose form (exact string values use the entry above) |
| class node | Reaver | DEX/STR class | prose form (exact string values use the entry above) |
| class node | Nightblade | INT/DEX class | prose form (exact string values use the entry above) |
| class node | Assassin | INT/DEX class | prose form (exact string values use the entry above) |
| class node | Ritualist | STR/INT class | prose form (exact string values use the entry above) |
| item pipeline | Slaughter | Kill Bonuses | prose form (exact string values use the entry above) |
| item pipeline | Warding | Block and Ward | prose form (exact string values use the entry above) |
| item pipeline | Wayfaring | Movement | prose form (exact string values use the entry above) |

## Found but not renamed

- **Arcane Lattice node and tier labels (Source, Adversarial, Natural, Destructive, Sustaining, Creative, Air, Water, Earth, Body, Spirit, Mind, Outer, Inner, Manifestation; Plane, Vessel, Tesseract; Schism; Paradigm Shift)**: Saved-weave values, and the lattice is protected by WIZARD AGENTS.md rules 5-6; needs a display layer and its own pass. Proposed: Air/Water/Earth -> Lightning/Cold/Chaos (rule 5); Plane/Vessel/Tesseract -> Tier 1/2/3; Schism -> Swap; Paradigm Shift -> Swap rows.
- **Creature names (Lindwurm, Kraken, Hydra, Bone/Beetle/Lava Golem, Night/Glutton/Chained/Horned Demon, Flying Terror)**: Mythic or fantasy names in CreatureCatalog; a creature pass should name them by what they are (rule 8, e.g. 'Great serpent').
- **Currency 'Searing Ash'**: Crafting currency named by flourish; propose 'Add Property' style naming in a currency pass.
- **Era items: Hammered Iron, Riveted Mail, Crest, Macuahuitl, Gorytos**: Rule 12 questions (iron, mail, crested helmets, Mesoamerican and Scythian forms), not naming; awaiting owner ruling.
- **VesselForge awakening (generated names and flavour text on awakened items, rpg_inventory README)**: A design rule, not a label; protected by WIZARD AGENTS.md rule 6. Conflicts with rules 6 and 10; owner ruling needed.
- **rpg_inventory faction names (riverspill, dustwind ...)**: Internal lane keys today; any player-facing use needs plain names in a separate pass.
- **Playtest player names (House Arwa, House Olwa, Amazuk, Taru, Ishra)**: Player-chosen names in fixtures, kept as proper names (terms.json nameProper).

## Labels kept pending review (`terms.json` nameExceptions)

- era: Hammered Iron, Riveted Mail, Crest, Macuahuitl
- creature: Beetle Golem, Bone Golem, Chained Demon, Flying Terror, Glutton Demon, Horned Demon, Hydra, Kraken, Lava Golem, Lindwurm, Night Demon
- lattice: Paradigm Shift, Schism, Schism:, Tesseract
- currency: Searing Ash
- literal: Ember
