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
| Origin | Seared on at the Crafting Bench with currencies | Grown while equipped, through ventures |
| Speed | Instant | Slow (bond XP thresholds) |
| Form | **Flat, unconditional numbers** (`+38 Life`) | **Named, conditional, triggered effects** ("The Life on Block — Regain 12 Life when you Block") |
| Class bond | None — anyone's craft | Carries the shaper's archetype; **half strength in held by another class hands** |
| Removal | Removed freely (slot is reusable) | Severed only by knife — the slot is **scarred** (✕) forever |
| Ceiling | Fixed roll | Tiers I → II → III (values scale ×1 / ×1.6 / ×2.2) |

Because they share slots, a fully-branded item can never learn. That's the
core tension: instant crafted power vs. long-term earned power. The design is
deliberately disjoint: craft is arithmetic, memory is behavior. (PoE 1
influences: The Surrender's "recover Life when you Block", on-kill momentum
triggers, full/low-resource thresholds; the held by another class-class bond rule is the lore
engine behind class-themed uniques.)

### Deeds, themes, archetypes

Venturing forth generates encounters, each weighted toward one or more themes.
The bearer's archetype adds +1 weight to its own theme on every deed:

- **Kill Bonuses** (Kill Bonuses class) — Life on Kill, Attack Speed after Kill, Critical Chance against Bleeding
- **Block and Ward** (Armour archetype) — Life on Block, Block while Stationary, Ward when Hit
- **Mana** (Mana class) — Spell Power at High Mana, Mana on Kill, Curse Avoidance
- **Movement** (Movement class) — Speed on Kill, Thrown Weapon Avoidance, Life Regeneration while Moving

(Display names follow `core/verdigris-pack.js`; older theme and mod names are listed in `owner-rules/rename-map.json`.)

Equipped items accumulate bond XP and log the themes of the deeds performed
while worn. When an item crosses an bond XP threshold it evolves: a new bond
forms (from the dominant theme in *that item's* history, class bond-stamped with
the current archetype), or an existing bond deepens a tier. Because bonds are
conditional they never contribute to the flat character sheet — only brands
and implicits do.

### Upgrade

An item holding **three tier-III bonds** awakens: it takes a generated name from
its bearer (`Azrael's Unbroken Vigil`), a keystone power from its dominant theme,
and flavor text summarizing its history. This is the lore mechanism for
character-themed uniques à la Diablo/PoE — a unique is just an item somebody
carried long enough.

An upgraded item's frame glows ember-orange. Before that, frames shift from
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

| Currency | Effect |
|---|---|
| Add Brand | Sear a random Brand into a free slot |
| Remove Last Brand | Remove the newest Brand, freeing its slot |
| (removed: never implemented) | Grant a full threshold of bond XP at the bench |
| Upgrade Bond | Deepen the faintest Bond one tier |
| Remove Bond | Sever the faintest Bond; the slot is scarred |
| Add Modifier Slot | Carve an extra vessel slot (max 6) |

Currencies live in a satchel (counts, not grid clutter) and can be bought with
gold or found while venturing.

## Features

- Grid backpack (12×8) with pixel-accurate drag & drop, placement ghost, and
  collision checks — pointer events, works with touch
- Paperdoll with 10 slots, swap-on-equip, and a live character sheet computed
  from implicits + brands + bonds through the shared Verdigris stat engine
- Crafting Bench bench that expands above the backpack: drag an item into the socket
  (or tap one while the bench is open) and apply currencies
- Simulate fight loop: gold, XP, loot, currency finds, and a chronicle log
- PoE-style tooltips: base stats, implicit, vessel pips, brand/bond sections
  with tier chips, bond XP progress, upgraded power + flavor
- Vendor (drag to sell; price scales with inscriptions), Sort, Reset
- Full state persistence in localStorage; editable character name feeds
  future upgraded item names

## item crafting system — the modular core (`core/`)

The item system now also exists as a standalone, engine-agnostic library,
designed from a genre survey (PoE, Craft of Exile, Last Epoch, D2/D4, Titan
Quest, Grim Dawn — see [DESIGN.md](DESIGN.md)):

- **`core/vesselforge.js`** — zero-dependency UMD engine: seedable RNG,
  plain-JSON items, materials ladder, tag/weight brand pools with pigments
  (fossil-style reweighting) and guaranteed-brand items (essence-style guarantees), Patience
  (crafting budget), kiln Firing (material-ascension gamble), bonds with
  class bonds (half strength for another class)/upgrade, trophies (fragment → fetish → completion
  bonus), Set bonus (player-authored sets), `explainOdds()` (Craft-of-Exile
  transparency as API), structured `tooltip()` lines for any renderer.
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
(`next = 80 + 55 × evolutions`), tier multipliers in `TIER_MULT`, vessel size
rolls in `createItem`.

## Combat terminology (owner correction, 2026-09-21)

Item modifiers and resistance readouts use Fire, Cold, Lightning, and Chaos.
The existing stat IDs remain unchanged so saves retain their meanings. These
labels do not approve unrelated historical names or add new damage mechanics.
