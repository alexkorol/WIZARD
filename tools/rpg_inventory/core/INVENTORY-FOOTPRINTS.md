# Verdigris Inventory Footprints

Status: authoritative for new base-item ladders and runtime form wiring.

The inventory uses a Diablo 2 / Path of Exile style rectangular grid. Physical
bulk must be visible in both the icon silhouette and its cell footprint. A
larger or heavier base may occupy more cells than a lighter base in the same
equipment family when the silhouette materially changes. The Amulet slot is a
deliberate 2x2 tiling exception: pendants and larger protective neckwear share
that footprint. These design rules must be applied during runtime migration;
changing this document alone does not change existing forms.

## Base cell and pixel dimensions

Verdigris uses a **48x48 px logical base cell** at native display scale.
The baseline human character sprite frame is **48x96 px** (one cell wide,
two tall). This is an art/layout baseline, not a collision-box definition or
a requirement that every animation, weapon or effect fit inside that frame.

| Cells (width x height) | Native pixel rectangle | Examples |
|---|---|---|
| 1x1 | 48x48 | Ring, compact storage content |
| 1x2 | 48x96 | Baseline human sprite frame (not a weapon footprint) |
| 1x3 | 48x144 | Smallest weapon size; knives, daggers, wands |
| 1x4 | 48x192 | Narrow reach weapon |
| 2x1 | 96x48 | Belt |
| 2x2 | 96x96 | Amulet, Ember Cup, compact auxiliary item |
| 2x3 | 96x144 | Body armour, substantial one-hand weapon, auxiliary seat |
| 2x4 | 96x192 | Broad two-hand weapon, long robe |

These are complete logical rectangles: draw grid lines within the 48 px pitch;
do not add gutters to the footprint calculation. UI zoom scales the grid and
its contents together. High-resolution source art may be retained, but native
readability is judged at these dimensions. Existing adaptive runtime cell sizes
have not been migrated by this design update.

## Unlockable equipment seats

Every unlockable auxiliary equipment seat is **2x3 (96x144 px)**. Items for
Warcall, Quiver/Quickrig and Attendant/Apparatus use **2x2 or 2x3** in the
current catalogue. A 2x2 item keeps its square art inside the 2x3 seat; do not
stretch it or change its backpack footprint to fill the seat. No new seat,
subclass mechanic or tiny/oversized auxiliary exception is introduced here.

Preparation, Trophy and Relic expansions remain backpack storage areas, not
2x3 equipment items. Their contents retain their own inventory footprints.

## Canonical footprints

| Item family | Default | Allowed variants | Art canvas |
|---|---:|---:|---|
| One-hand knife, dagger, sword, axe, mace, club, throwing sidearm or sceptre | 1x3 | 2x3 for broad/heavy one-hand bases | portrait |
| Magical main-hand wand | 1x3 | - | portrait |
| Magical main-hand rod | 2x3 | - | portrait |
| Magical main-hand staff | 2x4 | - | tall portrait |
| Spear, polearm, greatclub, greataxe, other two-hand weapon | 2x4 | 1x4 for exceptionally narrow light reach weapons | tall portrait |
| Bow | 2x4 | 2x3 for a genuinely compact short or composite bow | tall portrait |
| Buckler, hand guard, compact defensive off-hand | 2x2 | 1x2 for a very narrow guard | square or portrait |
| Full shield | 2x3 | 2x4 for tower, standing or body-length shields | portrait |
| Held rite focus or substantial ritual implement | 1x3 | 2x2 for cups, bowls, drums or handled vessels; 2x3 for heavy one-hand sceptres or implements | portrait or square |
| Clay Ember Cup (offhand) | 2x2 | - | square |
| Body armour | 2x3 | 2x4 only for a visibly long integrated coat or robe assembly | portrait |
| Cloak or mantle | 2x3 | 2x4 for a full-length heavy outer layer | tall portrait |
| Helm, crown, mask | 2x2 | - | square |
| Gloves, mitts, bracers, vambraces | 2x2 | - | square; always show the pair |
| Boots, sandals, greaves | 2x2 | - | square; always show the pair |
| Belt, girdle, sash | 2x1 | - | landscape |
| Amulet, pendant, gorget, protective neck piece | 2x2 | - | square |
| Ring, loose compact seal | 1x1 | a seal worn as an amulet uses 2x2 | square |
| Substantial curio, coffer, vessel, relic | 1x1 | 2x2 when the object is visibly bulky | square |
| Standalone quiver, gorytos, arrow case | 2x3 | 2x2 only for a compact flank case | portrait |
| War-call instrument | 2x2 | 2x3 for a taller assembly | square or portrait |
| Auxiliary warbanner or standard | 2x3 | 2x2 for a compact assembly | portrait or square; complete object |
| Quick Rig, mobility kit, trap rig, Attendant / Apparatus | 2x2 | 2x3 | square or portrait |
| Spoil, prepared reagent, reliquary-pack content | 1x1 | 2x1 for a long bundle or roll | square or landscape |

## Ladder rules

- Footprint is a property of the named base, not its material.
- The smallest weapon footprint is 1x3. No weapon base may occupy 1x1 or
  1x2; compact knives, daggers and tool weapons use 1x3. No offhand base may
  occupy 1x1. Clay Ember Cup remains a 2x2 offhand.
- Magical main-hand families have explicit sizes: wands 1x3, rods 2x3,
  staves 2x4. Auxiliary items with similar names retain auxiliary sizing.
  Ordinary martial fighting sticks are not automatically magical staves.
- Handedness is independent of footprint: a heavy sword or sceptre may occupy
  2x3 while using one hand. Never infer two-handed use from grid width.
- The Amulet slot includes gorgets and protective neck pieces with STR
  requirements, as well as ordinary pendants. All use 2x2 for slot tiling.
- Adjacent rungs need a different readable silhouette or construction, not a
  recolour of the same object.
- Do not shrink a two-hand weapon to fit a one-hand footprint. Show the whole
  object and use the larger grid size.
- Amulets use the prescribed 2x2 footprint even when physically small. Do not
  invent bulk or ornament to fill it, or enlarge rings and small pack contents
  merely to make their icons more impressive.
- The canvas aspect follows the footprint: tall items use portrait art, belts
  and long rolls use landscape, and compact 1x1 or 2x2 items use square art.
- Runtime `w` and `h`, target-manifest metadata, QA canvas, composed art, and
  review labels must agree before a base is considered complete.
