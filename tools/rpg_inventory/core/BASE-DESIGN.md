# Verdigris Base-Item Design (the model, 2026-07-04)

## The failure mode we were in

We modelled items as **form × material**: pick a few oddly-specific "forms"
(macuahuitl = studded wooden sword, atlatl = dart-thrower) and then spray every
"material" across them. Two things break:

1. **Forced nonsense combos.** A material grid produces quilted sandals,
   obsidian gorgets, fingerless quilted gloves — combinations no one would
   design on purpose.
2. **No progression, weird baseline.** The player never meets a familiar
   "sword" or "club"; they meet a niche exotic shape at every tier. There's no
   crude-start → epic-endgame arc.

## The model ARPGs actually use (PoE / Diablo 2)

Each **equipment class** (one-hand axe, body armour, helmet, …) has a **ladder
of distinct, individually-named base items**, one per **tier**, escalating from
crude/early to powerful/endgame. Examples:

- D2 sword: **Short Sword → Gladius → Falcata** (normal / exceptional / elite).
- D2 helm: **Cap → War Hat → Shako**. Belt: **Sash → Demonhide Sash → Spiderweb Sash**.
- PoE body: **Plate Vest → … → Astral Plate**. Helm: **Iron Hat → … → Hubris Circlet**.
  Sword: **Rusted Sword → Sabre → … → Vaal Blade**.

Key properties to copy:
- **Material/theme is intrinsic to each named rung**, never an orthogonal axis.
  You don't make "obsidian gloves" — the glove class has its *own* themed ladder.
- **Every rung is a real, recognizable archetype with an evocative name.**
- **⚑ Every rung must differ in SILHOUETTE/STRUCTURE from every other rung in
  its class** (2026-07-06, learned after generating 3 near-identical
  warm-metal corinthian helms and 2 maroon leather vests). "Same noun,
  different metal" is the form×material trap one level down — Cap/War Hat/
  Shako are different SHAPES, not re-skins. Adjacent rungs also need palette
  separation (copper and bronze read identically at 48px). Before adding a
  rung, look at the class's existing arts; if the new one would read as a
  variation of an existing icon, design a different archetype instead.
  Redundant arts already generated (helm_copper, crest_copper,
  hideshield_bronze) stay on disk as a FREE ALIAS POOL for D2-style renamed
  tiers — never delete, never regenerate. `shield_wicker` is now retired as a
  weak/toy-like shield read and should not seed future prompts.
- **The exotic stuff is a high rung, not the whole class.** A macuahuitl is a
  cool *tier-4* two-hander, not the only club in the game.
- The ladder itself *is* the progression / power curve.

## Verdigris tier ladder (maps to our tech + material arc)

| Tier | Theme | Palette / materials | Naming flavor |
|---|---|---|---|
| **T1 Scavenged** | stone-age, found | flint, bone, driftwood, rawhide, sinew, hide | crude, blunt: *Flint, Bone, Driftwood, Notched, Ragged* |
| **T2 Copper-age** | first metal | copper, tin, woven linen, boiled leather, cord | plain-functional: *Copper, Tin, Boiled, Woven* |
| **T3 Bronze-age** | the civilised norm | bronze, lacquered wood, plain leather, bronze studs | soldierly: *Bronze, War-, Legion, Studded* |
| **T4 Ritual/Exotic** | ceremonial power | obsidian, jade, amber, carved stone, polished shell | refined but generic: *Obsidian, Jade, Amber, Ritual, Carved* |
| **T5 Otherworldly** | beyond the horizon | skymetal (raw dark meteoric iron) | severe/endgame: *Skymetal, Meteoric, Riven* |

Not every class needs all five rungs; 3–5 each is fine (like D2's three).

## Proposed class ladders (names are the deliverable; art follows)

### Weapons (kind: weapon; sub-class by tag)
- **Dagger** (blade/swift): Bone Shiv · Copper Knife · Bronze Dirk · Obsidian Fang · Skymetal Kris
- **Sword / one-hand blade** (blade): Flint Cleaver · Copper Falchion · Bronze Khopesh · Obsidian Shortblade · Skymetal Longsword
- **Axe** (blade/blunt): Flint Hatchet · Copper Adze · Bronze War-Axe · Obsidian Cleaver · Skymetal Bardiche
- **Mace / club** (blunt): Driftwood Cudgel · Copper Mace · Bronze War-Mace · Jade Hammer · Skymetal Maul
- **Two-hand great** (blade/blunt): Bone Maul · Copper Greatclub · Bronze Greataxe · Obsidian Macuahuitl · Skymetal Greatblade
- **Reach / polearm** (reach): Flint Spear · Bone Harpoon · Bronze Pike · Obsidian Warspear · Skymetal Warspear
- **Rite-focus** (spirit caster): Bone Idol-Cudgel · Copper Hand Bell · Bronze Pronged Sceptre · Jade Idol-Staff · Skymetal Rite Rod

### Armour
- **Body** (life/ward line): Hide Wrap · Boiled Vest · Bronze-Studded Jerkin · Bronze-Scale Vest · Sheet-Bronze Corslet
- **Helmet**: Hide Cap · Bone Crest · Bronze War-Helm · Jade Circlet · Skymetal Greathelm
- **Gloves/bracers**: Rawhide Wraps · Boiled Bracers · Bronze-Scale Bracers · Bronze Vambraces · Skymetal Gauntlets
- **Boots**: Bark Sandals · Hide Sandals · Bronze-Shod Sandals · Jade Greaves · Skymetal Greaves
- **Belt**: Sinew Cord · Woven Girdle · Bronze-Plated Belt · Bronze War-Girdle · Skymetal Warbelt
- **Shield**: Hide Roundshield · Hide Buckler · Bronze Roundshield · Bronze-Scale Warshield · Sheet-Bronze Tower

### Jewellery
- **Amulet / neckpiece**: Bone Pendant · Copper Torc · Jade Gorget · Amber Talisman · Skymetal Sigil
- **Ring**: Bone Ring · Copper Coil · Jade Band · Amber Ring · Skymetal Ring
- **Curio / relic** (spirit flavour): use substantial reliquary boxes,
  handled tablets, and trophy settings. Do not build a tier ladder out of tiny
  trinkets, shrine miniatures, or loose charms.

## How current art maps in (don't waste the good gens)

Most existing finals slot straight into a rung, just renamed:
`handaxe_bronze`→Bronze War-Axe, `khopesh_bronze`→Bronze Khopesh,
`macuahuitl_obsidian`→Obsidian Macuahuitl (T4),
`crest_bronze`→Bronze War-Helm, `gorget_jade`→Jade Gorget, new
`dagger_bronze`→Bronze Dirk, `helm_bronze`→Bronze War-Helm, etc. Retire the
combinatorial oddities (quilted sandals, obsidian gorget, atlatls).

## Naming principles

Evocative > descriptive. Two-word "[flavor/material] [archetype]" mostly, with
occasional single iconic names at T4/T5 (Bronze-Scale Warshield, Skymetal Kris).
Avoid IDs like `grips_quilted` in player-facing names.
