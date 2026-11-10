# item crafting system

An engine-agnostic, seedable, **zero-dependency** ARPG itemization engine.
Items are plain JSON; all game content lives in a swappable *pack*; the engine
is only rules. Runs in Node and the browser (UMD).

Built from a genre survey of Path of Exile, Craft of Exile, Last Epoch,
Diablo 2/4, Titan Quest, and Grim Dawn — then pointed somewhere those games
don't go: **items that remember their bearer**.

- Live demo (React inventory): [Brands & Bonds](https://alexkorol.github.io/WIZARD/tools/rpg_inventory/)
- Live odds playground (framework-free): [playground.html](https://alexkorol.github.io/WIZARD/tools/rpg_inventory/core/playground.html)

## The power model (provisional)

The rules follow [`docs/CRAFTING-PROVISIONAL.md`](../../../docs/CRAFTING-PROVISIONAL.md):
the PoE crafting blueprint, adapted; the owner tunes the numbers in playtest.
Rarity sets the room: **Normal** holds no modifiers, **Magic** one or two,
**Rare** up to four (at most two brands, up to three bonds).

| Power | Origin | Shape |
|---|---|---|
| **Brand** ✦ (prefix) | added at the bench with currencies | fixed stat lines, tiered |
| **Bond** ◈ (suffix) | grown while equipped, through play (Bond I → III) | named, conditional, triggered effects |
| **Animal part** ✧ | collected fragments, attached | hybrid |

Crafting currencies: `addModifier` (Transmutation + Augmentation / Exalted; a Normal item becomes Magic), `upgradeToRare`
(Regal), `rerollValues` (Divine), `removeLastModifier` (Annulment, adapted).
Nothing else limits crafting. Bonds work the same for every class. When an
item's three bonds reach Bond III it becomes an upgraded item named after the
character who raised it, with one theme power; there are no pre-made uniques
and no set bonuses. Item Rarity raises the Magic/Rare share of drops
(`rarityOdds()`).

## Quickstart

```js
const item crafting system = require('vesselforge');
const pack = require('vesselforge/verdigris-pack.js'); // bronze-age content pack

const forge = item crafting system.createForge(pack, { seed: 42 }); // reproducible

// loot
const item = forge.generateItem({ ilvl: 40 });

// craft — every op returns { item, event } or { error }, never mutates input
const crafted = forge.addModifier(item, { pigmentId: 'red_ochre' });
const rare = forge.upgradeToRare(crafted.item); // Magic -> Rare, adds one brand

// craft transparency, Craft-of-Exile style, as an API
forge.explainOdds(item, { omenId: 'blood_omen' });
// -> [{ modId: 'keen', label: '+#% increased Physical Damage', p: 0.31 }, ...]

// play — bonds form from what the bearer actually does
const c = forge.createCharacter({ name: 'Test Character', archetype: 'shieldbearer' });
const r = forge.venture(c, { mainHand: item });

// read — structured, renderer-agnostic
forge.tooltip(item); // [{ section, text, tone }, ...]
forge.aggregate([item], { archetype: c.archetype }); // { sums, sheet, conditionals }
forge.rarityOdds(50); // drop rarity odds with 50% increased Item Rarity

// persist
const save = forge.serialize({ items: [item] });
const loaded = forge.normalizeItem(oldItem); // older saves: removed fields stripped
```

TypeScript types ship in `vesselforge.d.ts`.

## Writing your own pack

A pack is pure data plus one optional `derive()` for the character sheet:
materials (a tier ladder), forms (bases), brand pools with
tag weights, bond themes, archetypes, trophies, pigments/guaranteed-brand items (craft
steering), encounters, and name tables. `item crafting system.validatePack(pack)`
returns a list of problems, empty when clean. See `verdigris-pack.js` for a
complete worked example and `verdigris-combat.js` for a pack-aware autobattler
layer that makes bonds fire in combat.

## Design notes

- **Determinism**: mulberry32 RNG, seedable per forge, `reseed()` anytime.
- **Immutability**: craft ops clone; your state management stays boring.
- **No engine lock-in**: nothing here knows about DOM, canvas, or React. The
  demo's grid inventory, drag engine, and rendering live entirely outside.
- **Tests**: `npm test` (engine invariants, full item life-cycle to upgrade,
  serialization, combat resolution).

MIT. Part of [WIZARD](https://github.com/alexkorol/WIZARD).
