# Brands & Bonds — ARPG Inventory System

A single-file ARPG inventory demo. Crafting is **provisional**: it follows
[`docs/CRAFTING-PROVISIONAL.md`](../../docs/CRAFTING-PROVISIONAL.md) (owner rule 52),
the PoE crafting blueprint adapted, and the owner tunes the numbers in playtest.
**Brands** take the place of PoE prefixes and are added at the Crafting Bench;
**Bonds** take the place of suffixes and grow on equipped items through the
character's deeds.

Live demo: `tools/rpg_inventory/index.html` (no build step — React 18 + Babel standalone).

## The system

### Item and rarity

An item is a base (form × material) with the base's implicit, plus modifiers.
Rarity sets how many modifiers it holds:

| Rarity | Holds |
|---|---|
| Normal | no modifiers |
| Magic | one or two modifiers |
| Rare | up to two brands, four modifiers in all |

Nothing else limits crafting: no per-item crafting budget, no material-upgrade
gamble, no locked slots, no class penalty on bonds. Animal parts ✧ attached to
an item also take a modifier place.

| | Brand ✦ | Bond ◈ |
|---|---|---|
| Origin | Added at the Crafting Bench with currencies | Grown while equipped, through simulated fights |
| Form | **Fixed stat lines** (`+38 Life`), tiered by item level and material | **Named, conditional, triggered effects** ("Life on Block — Regain 12 Life when you Block") |
| Growth | Fixed roll | Bond I → II → III (values scale ×1 / ×1.6 / ×2.2) |

### Deeds and themes

Simulated fights generate encounters, each weighted toward one or more themes.
The character's class adds +1 weight to its own theme on every deed:

- **Kill Bonuses** — Life on Kill, Attack Speed after Kill, Critical Chance against Bleeding
- **Block and Ward** — Life on Block, Block while Stationary, Ward when Hit
- **Mana** — Spell Power at High Mana, Mana on Kill, Curse Avoidance
- **Movement** — Speed on Kill, Thrown Weapon Avoidance, Life Regeneration while Moving

(Display names follow `core/verdigris-pack.js`; older theme and mod names are listed in `owner-rules/rename-map.json`.)

Equipped items accumulate bond XP and log the themes of the deeds performed
while worn. At each bond XP threshold a new bond forms (from the dominant theme
in that item's history) while the rarity has room, or an existing bond goes up
one Bond level. Bonds work the same for every class. Because bonds are
conditional they never contribute to the flat character sheet — only brands,
animal parts and implicits do.

### Upgraded items

No pre-made unique or set items exist. When an item's **three bonds reach
Bond III** it becomes an upgraded item named after the character who raised it
(`Test Character's Bronze Shield`) with one power from its dominant bond theme.
There are no set bonuses. On a Rare item three bonds leave room for one brand.

### Item Rarity and drops

Simulated fights may drop an item. Its rarity is rolled Normal 70 / Magic 25 /
Rare 5 (provisional weights). **Item Rarity** (PoE "increased Rarity of Items
found", summed on the character sheet from brands and animal parts) multiplies
the Magic and Rare weights by `1 + Item Rarity / 100`, so it raises the share of
Magic and Rare drops (`forge.rarityOdds()`).

### Death and house recoveries

Items belong to the house. When a character dies in a simulated fight
(permadeath), everything they carried stays at the death site as a **house
recovery**. The next character starts with two plain items; any later
character of the house can take the recovery back from the Character Record
(items that do not fit stay in the recovery). There is no automatic inheritance.

### Art pipeline

Item, currency, and UI art are AI-generated PNG finals in `assets/`.
The local pipeline keeps source generations in ignored `assets_staging/*.png`,
derives alpha mattes with `core/art_matte.py`, and composes cropped RGBA finals
with `core/compose_assets.py`. Inline SVG fallbacks are still present if an
asset fails to load.

Review dashboards (open from a local static server at the repo root):

- `review.html` — starter-pack asset review (flag / rework / discard).
- `taxonomy-review.html` — 2026-07-08 character-item batch taxonomy labels.
- `intake-review.html` — manual download intake corrections.
- `post-calib-wave2-review.html` — 2026-08-15 wave-2 triage of the 205-image
  post-calibration batch (approve / hold / discard, JSON export). Built by
  `core/build_wave2_review.py`.

Current generation queue and paste-ready prompts:
`core/IMAGE-GEN-SHOPPING-LIST-2026-08-15.md`.

### Currencies (the Crafting Bench)

| Currency | PoE analogue | Effect |
|---|---|---|
| Add Modifier | Augmentation / Exalted Orb | Adds one brand while the rarity has room |
| Upgrade to Rare | Regal Orb | Makes a Magic item Rare and adds one brand |
| Reroll Values | Divine Orb | Rerolls brand values within their tiers and bond values within their ranges |
| Remove Last Modifier | Annulment Orb (adapted: last, not random) | Removes the most recently added brand, bond or animal part |
| Pigments, Guaranteed X Brand | PoE2 Omens, Essences | Steer or guarantee which brand the next craft adds |

Pigments and guaranteed-brand items live in a satchel (counts, not grid
clutter) and are bought with gold. Bench currencies cost gold in this demo.

## Features

- Grid backpack (12×8) with pixel-accurate drag & drop, placement ghost, and
  collision checks — pointer events, works with touch
- Paperdoll with 10 slots, swap-on-equip, and a live character sheet computed
  from implicits + brands + bonds through the shared Verdigris stat engine
- Crafting Bench bench that expands above the backpack: drag an item into the socket
  (or tap one while the bench is open) and apply currencies
- Simulate fight loop: gold, XP, loot, currency finds, and a chronicle log
- PoE-style tooltips: rarity and modifier count, base stats, implicit,
  brand/bond sections with tiers, bond XP progress, upgraded power
- Vendor (drag to sell; price scales with inscriptions), Sort, Reset
- Full state persistence in localStorage (older saves load; removed fields
  are stripped); the character name names upgraded items

## item crafting system — the modular core (`core/`)

The item system now also exists as a standalone, engine-agnostic library,
designed from a genre survey (PoE, Craft of Exile, Last Epoch, D2/D4, Titan
Quest, Grim Dawn — see [DESIGN.md](DESIGN.md)):

- **`core/vesselforge.js`** — zero-dependency UMD engine: seedable RNG,
  plain-JSON items, Normal/Magic/Rare rarity, tag/weight brand pools with pigments
  (fossil-style reweighting) and guaranteed-brand items (essence-style guarantees),
  the four bench currencies, bonds with bond XP and the upgraded item, animal parts
  (fragments → completion bonus), Item Rarity drop odds, `normalizeItem()` for old
  saves, `explainOdds()` (Craft-of-Exile transparency as API), structured
  `tooltip()` lines for any renderer.
- **`core/verdigris-pack.js`** — the bronze-age content pack: flint→bone→
  copper→bronze→obsidian→jade→skymetal→riveted-mail material ladder,
  macuahuitl/atlatl/khopesh-flavored forms, Redhand/Shieldbearer/Ashspeaker/
  Farwalker archetypes.
- **`core/verdigris-stats.js`** — zero-dependency UMD stat registry and combat
  sheet: five damage channels, attributes, layered mitigation, EHP profiles,
  and additive `increased` vs protected multiplicative `more` math. The passive
  tree consumes the same module.
- **`core/test.js`** — item crafting system Node suite (`node core/test.js`).
- **`core/verdigris-stats.test.js`** — stat-engine Node suite (`node core/verdigris-stats.test.js`).
- **`core/playground.html`** — framework-free harness exercising the whole
  loop (also the target for automated asset integration).
- **`core/ASSET-BRIEF.md`** — prompts and file list for the ChatGPT-Pro
  image-generation run.

The React demo (`index.html`) now runs **on the core**: it loads
`core/vesselforge.js` + `core/verdigris-stats.js` + `core/verdigris-pack.js` and keeps only UI concerns
(grid placement, drag engine, rendering, gold economy for craft ops).
Item art resolves to `assets/{form}_{material}.png` per ASSET-BRIEF naming
and falls back to inline SVG icons until the ChatGPT-Pro art run fills the
files in.

## Reuse notes (Verdigris / Delaford)

The mechanics are isolated from the rendering:

- `BRAND_POOL`, `THEMES`, `ARCHETYPES`, `ENCOUNTERS`, `BASES`, `CURRENCIES` — pure data tables
- `gainAttunement`, `evolveItem`, `awakenItem`, `applyCurrency`, `computeStats`,
  `canPlaceItem` / `findFreeSpot` — pure(ish) functions over plain item objects

Port the data + logic layer as-is; only the React layer is demo-specific.
Balance knobs: threshold formula in `gainAttunement`
(`next = 80 + 55 × evolutions`), tier multipliers in `TIER_MULT`, rarity room,
drop rarity weights and brand counts in the engine settings (`rarityLimits`,
`dropRarityWeights`, `dropBrands`).

## Combat terminology (owner correction, 2026-09-21)

Item modifiers and resistance readouts use Fire, Cold, Lightning, and Chaos.
The existing stat IDs remain unchanged so saves retain their meanings. These
labels do not approve unrelated historical names or add new damage mechanics.
