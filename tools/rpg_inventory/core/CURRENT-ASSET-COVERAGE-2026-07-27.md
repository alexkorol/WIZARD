# Current Asset Coverage and Manual Prompt Queue

Date: 2026-07-27 PDT

## Counting rules

This report does not treat every image file as roster coverage.

- The active starter pack has **79 of 103** target finals according to
  `core/status.py`.
- The current expansion has **18 strict accepted additions** recorded in
  `GEN-LOG.md`.
- `items_post_calib_batch` contains **261 images**: 44 conservative `promote`
  candidates, 71 `review`, and 146 `reject`. Only **31** of the promote
  candidates have been assigned to expansion rows, and all 31 still require
  user approval plus normal QA. They are counted below as `salvage pending`,
  never as accepted.
- `items_multi_context_balanced_v1` has **86 generated item outputs** present:
  17 body armor, 12 shields, 7 carry items, 7 outer layers, 7 headgear,
  6 ritual items, 5 signal items, 5 footwear, 5 hands/arms, and 15 assorted
  weapons. These are a raw source pool, not 86 roster additions. Only strict
  salvages already named in `GEN-LOG.md` count among the 18 accepted additions.
- Wave 05 contributes **six source-audited prompts**, not six completed assets.
- Holds, rejects, duplicates, source fragments, and incidental character props
  count as zero.

## Supply diagnosis

There are two different kinds of overrepresentation:

1. **Raw-image overrepresentation:** the balanced and post-calibration pools
   contain many body armors, shields, spears, rings, amulets, and forearm
   defenses. Most are not approved bases, and many repeat the same silhouette.
2. **Roster-relative overrepresentation:** assuming every assigned salvage
   candidate is approved, spears would reach 4/5, bows 3/5, light helmets 3/5,
   short outer layers 3/5, short blades 2/5, and open helmets 2/5. Do not spend
   the next research wave on those families.

Shields are common in the raw folders but are **not** actually saturated:
even the best-case count is 6/20. Gloves are similar: five pending candidates
look like supply, but the roster target is 20 and none is accepted yet.

## Highest-volume gaps

These are the largest best-case deficits after the 18 accepts, all 31 assigned
salvage candidates, and all six ready prompts:

| Family | Target | Accepted | Salvage pending | Ready prompts | Best-case remaining |
|---|---:|---:|---:|---:|---:|
| Rite focus | 25 | 1 | 0 | 0 | 24 |
| Relic | 20 | 1 | 0 | 0 | 19 |
| Gloves / handwear | 20 | 0 | 5 | 0 | 15 |
| Shield | 20 | 2 | 4 | 0 | 14 |
| Belt | 15 | 0 | 2 | 0 | 13 |
| Boots / footwear | 15 | 1 | 2 | 0 | 12 |
| Ring | 15 | 0 | 3 | 0 | 12 |
| Amulet | 15 | 2 | 1 | 2 | 10 |

## Zero-coverage expansion families

Even under the same optimistic best-case count, these remain at zero:

- attendant focus
- body lamellar
- body splint
- caster rod
- compact defensive off-hand
- gorytos
- mobility rig
- full outer layer
- open empty quiver
- reliquary
- spoils
- sword
- trap kit
- two-hand weapon
- warbanner

Each standard family above needs five rungs; compact defensive off-hand needs
one. Quivers and gorytoi remain separate five-rung ladders. Visible arrows
never count because arrows are separate items and every quiver must be open,
empty, and construction-complete.

## Current prompt decision

The default roster-generation unit is a coherent character loadout, not an
individually predesigned artifact. Coverage analysis chooses which faction,
attribute axis, and tier ladder points need extraction; it does not write
isolated material-and-form recipes for each missing row.

`assets_staging/manual-web-wildcard-wave-01/` contains six wildcard requests:
North/STR Tier 1-3 and Riverspill/STR Tier 1-3. Each uses two reviewed ladder
references and asks the web app for up to ten separate paperdoll-slot images.
All six ladder points currently have zero balanced-folder outputs, so the wave
can add up to 60 coherent images without repeating existing generated sets.

The former `assets_staging/manual-web-wave-01/` one-item pack is superseded as
the routine roster workflow. Its six source-observed prompts remain exceptional
gap-item experiments only. Use an isolated source-audited prompt after loadout
extraction and curation prove that a valuable roster gap cannot be filled by a
coherent character-derived item.
