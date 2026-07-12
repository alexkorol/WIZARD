# Vesselforge

An engine-agnostic, seedable, **zero-dependency** ARPG itemization engine.
Items are plain JSON; all game content lives in a swappable *pack*; the engine
is only rules. Runs in Node and the browser (UMD).

Built from a genre survey of Path of Exile, Craft of Exile, Last Epoch,
Diablo 2/4, Titan Quest, and Grim Dawn — then pointed somewhere those games
don't go: **items that remember their bearer**.

- Live demo (React inventory): [Brands & Bonds](https://alexkorol.github.io/WIZARD/tools/rpg_inventory/)
- Live odds playground (framework-free): [playground.html](https://alexkorol.github.io/WIZARD/tools/rpg_inventory/core/playground.html)

## The power model

Every item is a **vessel** with N slots. Slots hold power with *provenance*:

| Power | Origin | Shape |
|---|---|---|
| **Brand** ✦ | crafted at a bench, instantly | flat, unconditional numbers |
| **Bond** ◈ | grown while equipped, through play | named, conditional, triggered effects |
| **Trophy** ✧ | hunted fragments, socketed | hybrid |
| **Scar** ✕ | the price of severing | a dead slot, forever |

Brands and bonds compete for the same slots, so a fully-crafted item can never
learn. Bonds carry their shaper's archetype (**kinship**) and give half
strength in estranged hands. An item holding three tier-III bonds **awakens**
into a named unique — a unique is just an item somebody carried long enough.

## Quickstart

```js
const VesselForge = require('vesselforge');
const pack = require('vesselforge/verdigris-pack.js'); // bronze-age content pack

const forge = VesselForge.createForge(pack, { seed: 42 }); // reproducible

// loot
const item = forge.generateItem({ ilvl: 40 });

// craft — every op returns { item, event } or { error }, never mutates input
const seared = forge.sear(item, { pigmentId: 'red_ochre' });

// craft transparency, Craft-of-Exile style, as an API
forge.explainOdds(item, { omenId: 'blood_omen' });
// -> [{ modId: 'keen', label: '+#% increased Physical Damage', p: 0.31 }, ...]

// play — bonds form from what the bearer actually does
const c = forge.createCharacter({ name: 'Azrael', archetype: 'shieldbearer' });
const r = forge.venture(c, { mainHand: item });

// read — structured, renderer-agnostic
forge.tooltip(item, { archetype: c.archetype }); // [{ section, text, tone }, ...]
forge.aggregate([item], { archetype: c.archetype }); // { sums, sheet, conditionals, panoplies }

// persist
const save = forge.serialize({ items: [item] });
```

TypeScript types ship in `vesselforge.d.ts`.

## Writing your own pack

A pack is pure data plus one optional `derive()` for the character sheet:
materials (a tech/tier ladder with ascension), forms (bases), brand pools with
tag weights, bond themes, archetypes, trophies, pigments/omens (craft
steering), encounters, and name tables. `VesselForge.validatePack(pack)`
returns a list of problems, empty when clean. See `verdigris-pack.js` for a
complete worked example and `verdigris-combat.js` for a pack-aware autobattler
layer that makes bonds fire in combat.

## Design notes

- **Determinism**: mulberry32 RNG, seedable per forge, `reseed()` anytime.
- **Immutability**: craft ops clone; your state management stays boring.
- **No engine lock-in**: nothing here knows about DOM, canvas, or React. The
  demo's grid inventory, drag engine, and rendering live entirely outside.
- **Tests**: `npm test` (engine invariants, full item life-cycle to awakening,
  serialization, combat resolution).

MIT. Part of [WIZARD](https://github.com/alexkorol/WIZARD).
