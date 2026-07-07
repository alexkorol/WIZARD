# Brands & Bonds — ARPG Inventory System

A single-file ARPG inventory demo built around an original itemization system:
**Brands** are seared onto items at a crafting bench; **Bonds** grow on equipped
items through the deeds their bearer performs. Saturated items **Awaken** into
named uniques — the in-world explanation for why every legendary relic is named
after somebody.

Live demo: `tools/rpg_inventory/index.html` (no build step — React 18 + Babel standalone).

## The system

### Vessels

Every piece of gear is a *vessel* with 2–6 slots. Two kinds of power compete
for the same slots:

| | Brand ✦ | Bond ◈ |
|---|---|---|
| Origin | Seared on at the Atelier with currencies | Grown while equipped, through ventures |
| Speed | Instant | Slow (attunement thresholds) |
| Form | **Flat, unconditional numbers** (`+38 Life`) | **Named, conditional, triggered effects** ("The Shieldwall — Regain 12 Life when you Block") |
| Kinship | None — anyone's craft | Carries the shaper's archetype; **half strength in estranged hands** |
| Removal | Effaced freely (slot is reusable) | Severed only by knife — the slot is **scarred** (✕) forever |
| Ceiling | Fixed roll | Tiers I → II → III (values scale ×1 / ×1.6 / ×2.2) |

Because they share slots, a fully-branded item can never learn. That's the
core tension: instant crafted power vs. long-term earned power. The design is
deliberately disjoint: craft is arithmetic, memory is behavior. (PoE 1
influences: The Surrender's "recover Life when you Block", on-kill momentum
triggers, full/low-resource thresholds; the estranged-kinship rule is the lore
engine behind class-themed uniques.)

### Deeds, themes, archetypes

Venturing forth generates encounters, each weighted toward one or more themes.
The bearer's archetype adds +1 weight to its own theme on every deed:

- **Slaughter** (Reaver) — The Blood-Price (life on kill), Battle-Rhythm (attack speed after kill), Read-the-Wound (crit vs bleeding)
- **Warding** (Warden) — The Shieldwall (life on block), Stand-Your-Ground (block while stationary), Old Grudge (armour when hit)
- **Sorcery** (Magus) — Clear-Mind (spell damage above 75% mana), Ember-Tithe (mana on kill), Veil-Wise (avoid ailments)
- **Wayfaring** (Strider) — Dead-Sprint (move speed on kill), Sidestep (avoid projectiles while moving), Road-Lore (regen while moving)

Equipped items accumulate attunement and log the themes of the deeds performed
while worn. When an item crosses an attunement threshold it evolves: a new bond
forms (from the dominant theme in *that item's* history, kinship-stamped with
the current archetype), or an existing bond deepens a tier. Because bonds are
conditional they never contribute to the flat character sheet — only brands
and implicits do.

### Awakening

An item holding **three tier-III bonds** awakens: it takes a generated name from
its bearer (`Azrael's Unbroken Vigil`), a keystone power from its dominant theme,
and flavor text summarizing its history. This is the lore mechanism for
character-themed uniques à la Diablo/PoE — a unique is just an item somebody
carried long enough.

An awakened item's frame glows ember-orange. Before that, frames shift from
grey (plain) to gold (craft-heavy) to the **dominant bond theme's colour**
(memory-heavy) as bonds outgrow brands — and bonded items show a faint theme
sigil watermark behind their art, an homage to PoE's Shaper/Elder influence
backgrounds.

### Art pipeline

Item, currency, and UI art are AI-generated PNG finals in `assets/`.
The local pipeline keeps source generations in ignored `assets_staging/*.png`,
derives alpha mattes with `core/art_matte.py`, and composes cropped RGBA finals
with `core/compose_assets.py`. Inline SVG fallbacks are still present if an
asset fails to load.

### Currencies (the Atelier)

| Currency | Effect |
|---|---|
| Searing Sigil | Sear a random Brand into a free slot |
| Effacing Stone | Remove the newest Brand, freeing its slot |
| Chronicle Draught | Grant a full threshold of attunement at the bench |
| Orb of Resonance | Deepen the faintest Bond one tier |
| Sundering Knife | Sever the faintest Bond; the slot is scarred |
| Vessel Chisel | Carve an extra vessel slot (max 6) |

Currencies live in a satchel (counts, not grid clutter) and can be bought with
gold or found while venturing.

## Features

- Grid backpack (12×8) with pixel-accurate drag & drop, placement ghost, and
  collision checks — pointer events, works with touch
- Paperdoll with 10 slots, swap-on-equip, and a live character sheet computed
  from implicits + brands + bonds
- Atelier bench that expands above the backpack: drag an item into the socket
  (or tap one while the bench is open) and apply currencies
- Venture Forth loop: gold, XP, loot, currency finds, and a chronicle log
- PoE-style tooltips: base stats, implicit, vessel pips, brand/bond sections
  with tier chips, attunement progress, awakened power + flavor
- Vendor (drag to sell; price scales with inscriptions), Sort, Reset
- Full state persistence in localStorage; editable character name feeds
  future awakened item names

## Vesselforge — the modular core (`core/`)

The item system now also exists as a standalone, engine-agnostic library,
designed from a genre survey (PoE, Craft of Exile, Last Epoch, D2/D4, Titan
Quest, Grim Dawn — see [DESIGN.md](DESIGN.md)):

- **`core/vesselforge.js`** — zero-dependency UMD engine: seedable RNG,
  plain-JSON items, materials ladder, tag/weight brand pools with pigments
  (fossil-style reweighting) and omens (essence-style guarantees), Patience
  (crafting budget), kiln Firing (material-ascension gamble), bonds with
  kinship/estrangement/awakening, trophies (fragment → fetish → completion
  bonus), Panoply (player-authored sets), `explainOdds()` (Craft-of-Exile
  transparency as API), structured `tooltip()` lines for any renderer.
- **`core/verdigris-pack.js`** — the bronze-age content pack: flint→bone→
  copper→bronze→obsidian→jade→skymetal→riveted-mail material ladder,
  macuahuitl/atlatl/khopesh-flavored forms, Redhand/Shieldbearer/Ashspeaker/
  Farwalker archetypes.
- **`core/test.js`** — 22-test Node suite (`node core/test.js`).
- **`core/playground.html`** — framework-free harness exercising the whole
  loop (also the target for automated asset integration).
- **`core/ASSET-BRIEF.md`** — prompts and file list for the ChatGPT-Pro
  image-generation run.

The React demo (`index.html`) now runs **on the core**: it loads
`core/vesselforge.js` + `core/verdigris-pack.js` and keeps only UI concerns
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
(`next = 80 + 55 × evolutions`), tier multipliers in `TIER_MULT`, vessel size
rolls in `createItem`.
