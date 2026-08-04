# Verdigris Inventory Footprints

Status: authoritative for new base-item ladders and runtime form wiring.

The inventory uses a Diablo 2 / Path of Exile style rectangular grid. Physical
bulk must be visible in both the icon silhouette and its cell footprint. A
larger or heavier base may occupy more cells than a lighter base in the same
equipment family when the silhouette materially changes.

## Canonical footprints

| Item family | Default | Allowed variants | Art canvas |
|---|---:|---:|---|
| Compact dagger, hand axe, throwing sidearm | 1x2 | 1x3 for long/heavy one-hand bases | portrait |
| One-hand sword, axe, mace, club, caster rod | 1x3 | 1x2 only for genuinely compact bases | portrait |
| Spear, polearm, greatclub, greataxe, other two-hand weapon | 2x4 | 1x4 for exceptionally narrow light reach weapons | tall portrait |
| Bow | 2x4 | 2x3 for a genuinely compact short or composite bow | tall portrait |
| Buckler, hand guard, compact defensive off-hand | 2x2 | 1x2 for a very narrow guard | square or portrait |
| Full shield | 2x3 | 2x4 for tower or body-length shields | portrait |
| Held rite focus or substantial ritual implement | 1x3 | 2x2 for broad bowls, drums, or handled vessels | portrait or square |
| Body armour | 2x3 | 2x4 only for a visibly long integrated coat or robe assembly | portrait |
| Cloak or mantle | 2x3 | 2x4 for a full-length heavy outer layer | tall portrait |
| Helm, crown, mask | 2x2 | - | square |
| Gloves, mitts, bracers, vambraces | 2x2 | - | square; always show the pair |
| Boots, sandals, greaves | 2x2 | - | square; always show the pair |
| Belt, girdle, sash | 2x1 | - | landscape |
| Amulet, pendant, ring, compact seal | 1x1 | - | square |
| Substantial curio, coffer, vessel, relic | 1x1 | 2x2 when the object is visibly bulky | square |
| Standalone quiver, gorytos, arrow case | 2x3 | 2x2 only for a compact flank case | portrait |
| War-call instrument | 2x2 | 1x3 for a straight trumpet; 2x3 for a large drum | square or portrait |
| Warbanner or weapon-length standard | 2x4 | 1x4 for a narrow pole with a compact finial | tall portrait |
| Quick Rig, mobility kit, trap rig, Attendant focus | 2x2 | - | square |
| Spoil, prepared reagent, reliquary-pack content | 1x1 | 2x1 for a long bundle or roll | square or landscape |

## Ladder rules

- Footprint is a property of the named base, not its material.
- Adjacent rungs need a different readable silhouette or construction, not a
  recolour of the same object.
- Do not shrink a two-hand weapon to fit a one-hand footprint. Show the whole
  object and use the larger grid size.
- Do not inflate jewellery or small pack contents merely to make the icon more
  impressive.
- The canvas aspect follows the footprint: tall items use portrait art, belts
  and long rolls use landscape, and compact 1x1 or 2x2 items use square art.
- Runtime `w` and `h`, target-manifest metadata, QA canvas, composed art, and
  review labels must agree before a base is considered complete.
