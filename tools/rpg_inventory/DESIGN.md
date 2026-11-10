# item crafting system — Design Document

A modular, engine-agnostic ARPG item system for Verdigris/Delaford-type games.
Bronze-age, low-power, low-fantasy: **copper is wealth, bronze is power,
riveted mail is a rumor.**

This document has two halves: (1) what the genre already does, distilled from
research; (2) the item crafting system system built on top of it.

---

## Part 1 — The genre, structurally

### Path of Exile 1 (the deepest mod system)

- Mods partition into **prefixes/suffixes** — not flavor, but a *constraint
  economy* that stops items from stacking six damage mods.
- Every mod has **tags** (life, fire, attack, caster…) and **weights**; pools
  are filtered by base type and **item level gates tiers** (T1 best).
- **Local vs global** mods (flat phys on a weapon multiplies differently than
  on a ring).
- Mod **shapes** are wildly varied and this is the real addiction engine:
  flat, increased%, more%, hybrid, conditional (*while* leeching / low life),
  trigger (*when you* block/kill), per-stat scaling (*per 10 str*),
  conversion (phys→fire), penetration, skill/aura granting, threshold
  keystones.
- Crafting is a **determinism spectrum**: chaos-spam (pure RNG) → essences
  (guarantee one mod) → fossils (reweight tag pools) → harvest (targeted
  add/remove by tag) → bench + **metamods** ("prefixes cannot be changed" —
  player-installed *constraints on the RNG itself*).
- Quality, corruption (risk gamble, can brick), fractured (locked mods),
  influence pools (special mods + a visible watermark on the item art).
- Community tooling (Craft of Exile) exists because odds are *inspectable* —
  a system worth copying: the engine should be able to explain its own
  probabilities.

### Last Epoch (the best crafting closure)

- Affixes come as **shards**, tiers T1–T5 craftable; **T6–7 are drop-only**
  ("exalted") — the chase item is a *crafting ingredient*.
- **Forging Potential**: every item has a finite craft budget. Every
  operation spends some. This single number creates tension, closure, and
  grief-proofing (no infinite reroll).
- **Glyphs modify the operation** (chance to not consume FP / chaos-swap the
  affix / seal an affix into a bonus 5th slot).
- **Legendary Potential**: fuse exalted affixes into uniques at endgame.

### Diablo 2 / 4

- D2: rigid prefix/suffix caps per rarity; affix *families* prevent
  stacking; **sockets + runewords** = a knowledge economy (recipes you learn
  from outside the game); ethereal (power now, death later); charms.
- D4: **tempering** (recipe-targeted affix addition), **masterworking**
  (rank everything up, random crits), **greater affixes** (perfect-roll
  celebration marker), **aspects** (extract a legendary power, re-apply it).

### Titan Quest / Grim Dawn (the monster-part economy)

- TQ: **charm/relic fragments** drop from monster *families* (boar hide from
  boars); completing a stack (3/5 pieces) grants a **completion bonus**;
  attach to gear.
- GD: **double-rarity** affix naming (both prefix and suffix carry rarity),
  **components** (craftable socketables that can grant *skills*),
  faction **augments**, **monster infrequents** (special bases with their own
  mod pools from specific enemies).

### The structural axes

Every system above is a position on these axes:

1. **Slot economy** — what limits how much power fits on one item
2. **Determinism spectrum** — from chaos-spam to harvest-surgery
3. **Craft closure** — what stops crafting (FP, cost, bricking)
4. **Chase ceiling** — T1s, greater affixes, LP, double-rare
5. **Risk mechanics** — corruption, ethereal, firing
6. **Knowledge economy** — runewords, hidden completion bonuses, recipes
7. **Identity** — named uniques, MIs, influence marks
8. **Item growth through play** — almost *unoccupied* in the genre. This is
   item crafting system's home turf.

---

## Part 2 — item crafting system

> **Superseded in part (2026-11-09).** Crafting now follows the provisional
> spec [`docs/CRAFTING-PROVISIONAL.md`](../../docs/CRAFTING-PROVISIONAL.md)
> (owner rule 52): Normal/Magic/Rare rarity sets the modifier room; the bench
> currencies are Add Modifier, Upgrade to Rare, Reroll Values and Remove Last
> Modifier. Crafting uses (Patience), the material-upgrade gamble (kiln
> firing), locked slots (scars), half-strength bonds for another class
> (kinship), the set bonus for upgraded items and automatic inheritance were
> removed. The sections below are updated to match; older rationale for the
> removed mechanics is history only.

### The one-sentence pitch

Every item has a rarity that sets how many modifiers it holds, and every
modifier has **provenance**: power is either **crafted** (Brands ✦, the
prefixes), **lived** (Bonds ◈, the suffixes), or **taken** (Animal parts ✧).

### Materials — the tech-fantasy ladder

Instead of PoE's hundreds of bases, a small set of base *forms* (spear, axe,
wrap, shield…) crossed with a **material ladder**:

| Tier | Materials | Fantasy |
|---|---|---|
| 1 | flint, bone, hide | anyone's tools |
| 2 | copper, quilted cloth | a village's wealth |
| 3 | bronze, obsidian | a chief's arm |
| 4 | jade, amber | temple things |
| 5 | skymetal (meteoric iron) | fell from heaven, one per saga |
| 6 | wrought iron, riveted mail | *technology from beyond the horizon* |

Material sets base stats and *reweights the brand pool* (obsidian loves
bleed/crit, jade loves ward/spirit) — fossils built into the metallurgy.
Material never changes after the item drops.

### Base items — class ladders, not a raw form×material grid (2026-07-04 revision — Alexei's vision)

> **The important correction.** A naive `form × material` cross is a *failure
> mode*: it forces nonsense combos (quilted sandals, obsidian gorgets,
> fingerless quilted gloves) and pins the game on quirky exotic-only "forms"
> (atlatl, macuahuitl) with no familiar baseline and no crude→endgame arc.

What PoE and Diablo 2 actually ship: **each equipment class is a curated
*ladder* of distinct, individually-named base items — one per tier — escalating
from crude/early to endgame** (D2: Short Sword → Gladius → Falcata; Cap → War
Hat → Shako. PoE: Iron Hat → … → Hubris Circlet). Material/theme is **intrinsic
to each named rung**, not an axis sprayed across every class. The exotic stuff
(obsidian macuahuitl, skymetal greathelm) is a **high rung, not a whole class.**

Our material tiers above already *are* the ladder — we just need to (a) curate
each class's rungs so only sensible materials appear, (b) give every rung an
evocative name (Bronze Khopesh, Obsidian Cleaver, Meteoric iron Large helmet) instead of
`{material} {form}`, and (c) use familiar archetype classes (dagger, sword, axe,
mace, two-hander, spear, focus; body, helm, gloves, boots, belt, shield; amulet,
ring) with the odd combinatorial items retired.

**Full proposed class ladders + naming live in `core/BASE-DESIGN.md`.** Future
coding sessions building the item roster / `verdigris-pack.js` `forms` block
should follow that ladder model, not the old grid. (This is also recorded in
`AGENTS.md`.)

### The three powers

| | Brand ✦ | Bond ◈ | Trophy ✧ |
|---|---|---|---|
| Verb | craft | live | hunt |
| Shape | flat / scalar only | named conditional & trigger mods | fixed themed mods + completion bonus |
| Source | tools, pigments, guaranteed-brand items | deeds while equipped | fragments from monster families |
| Removal | Remove Last Modifier | Remove Last Modifier | Remove Last Modifier (the part is destroyed) |
| Chase | tier gated by ilvl + material | Bond III via play | completion bonus at full stack |

- **Brands** are the deterministic end: `addModifier` / `upgradeToRare` with
  optional **pigment** (reweight tags, fossil-style) or **guaranteed brand**
  (guarantee a tag, essence-style). Only the rarity's room limits crafting.
- **Bonds**: named conditional effects, themes from deeds, Bond I–III, the
  same value for every class; three bonds at Bond III upgrade the item.
- **Animal parts**: TQ-style fragments (boar tusk 0/5) that complete into a
  socketable fetish with a completion bonus. The Grim Dawn homage: top-tier
  trophies may **grant a rite** (usable skill) — the only "skill granting"
  in a low-magic world comes from dead things, which fits.

### Upgraded items

Three bonds at Bond III → an upgraded item named after the character who
raised it, with one power from its dominant bond theme. No pre-made uniques or
sets exist, and there are no set bonuses.

### Loot and houses

Item Rarity raises the Magic/Rare share of drops (`rarityOdds()`, provisional
weights). When a character dies in a simulated fight, everything they carried
stays as a house recovery that a later character of the house can take back;
there is no automatic inheritance.

### Determinism spectrum, mapped

| PoE/LE original | item crafting system | Flavor |
|---|---|---|
| augmentation / exalted | **Add Modifier** | |
| regal | **Upgrade to Rare** | |
| divine | **Reroll Values** | |
| annulment | **Remove Last Modifier** (last, not random) | |
| essence | **Guaranteed X Brand** (guarantee tag) | |
| fossil | **Pigment** (reweight tags) | |

### Engine / content split (the "pluggable" requirement)

- **`core/vesselforge.js`** — pure logic, zero dependencies, UMD (browser
  global or Node require). Seedable RNG. Items are plain JSON. No DOM, no
  rendering: `tooltip(item)` returns *structured lines* (section/kind/text/
  tone) for any UI to draw. `explainOdds()` exposes the weight table for the
  next brand — Craft of Exile transparency as a first-class API.
- **`core/verdigris-pack.js`** — all content: materials, forms, mods (with
  shape/tags/tiers/ilvl gates), themes, archetypes, trophies, tools,
  encounters, name tables. Register any pack: `createForge(pack, {seed})`.
  `validatePack()` catches dangling ids and empty pools at load time.
- Mod **shape** is data (`flat | scalar | conditional | trigger | grant`),
  so a host game's combat sim can interpret conditions; the demo UI only
  displays them. Aggregation returns `{sheet, conditionals[]}` — flat truth
  vs. a list the game engine hooks into.

### What stays out (for now)

Metamods, trophy rite cooldowns, economy/trade. Listed in ISSUES.md.

---

Sources: [PoE modifiers](https://pathofexile.fandom.com/wiki/Modifiers),
[PoE metacrafting](https://maxroll.gg/poe/crafting/metacrafting),
[Craft of Exile](https://www.craftofexile.com/changelog),
[Last Epoch crafting](https://maxroll.gg/last-epoch/resources/beginner-crafting-guide),
[LE glyphs/runes](https://www.icy-veins.com/last-epoch/crafting-guide),
[Grim Dawn items](https://grimdawn.fandom.com/wiki/Items),
[GD loot guide](https://www.grimdawn.com/guide/items/the-hunt-for-loot/),
[TQ relics/charms](https://lparchive.org/Titan-Quest/Mechanics%203/),
[TQ2 charms](https://soren.com/en/news/titan-quest-ii/2025-11-26-titan-quest-ii-loot-evolved-charms-and-relics),
[D2 affixes](https://www.diablowiki.net/Affix),
[D4 itemization](https://www.purediablo.com/season-4-itemization-changes-are-big).
