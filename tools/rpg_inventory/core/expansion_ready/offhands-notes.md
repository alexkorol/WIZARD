# Production-ready offhands portfolio

This release contains exactly 50 rows arranged as ten named five-rung ladders.
Five ladders contain 25 shields, bucklers, and one narrow defensive guard. Five
ladders contain 25 substantial held rite foci. Every ladder has one row at each
tier and every rung equals its tier.

## Release decisions

- Full shields use portrait art and 2x3 or 2x4 footprints. Bucklers use square
  art and 2x2 footprints. The single narrow parrying guard uses the documented
  1x2 defensive-offhand exception. Held rite foci use only 1x3 portrait or 2x2
  square footprints; no undocumented 1x2 focus remains.
- Adjacent ladder rungs change silhouette and mechanical thesis. Removed rows
  include the duplicate oval scutum, the T5 scutum material reskin, the
  unsupported laminated-shield repeat, and redundant shield-facing variants.
  T5 retains meteoritic iron as the ladder material, but changes macro form and
  load path rather than recoloring the adjacent rung.
- The final historical corrections are preserved: protected jade and amber
  insets, explicitly drilled shell plates, the direct Nimrud ivory wax-board
  construction, the documented ring-handled bell, the Vermand officer boss, and
  the Battersea-derived red-glass boss cells. No turtleshell shield, speciesless
  carapace, unsupported shell-bone laminate, invented seal case, merchant
  balance, solar motif, or material skin survives.
- All descriptions remain paleolithic-to-ancient in manufacturing language.
  They avoid machine tooling, modern fasteners, steel plate armor language,
  copied sacred figures, readable text, and medieval heraldry.

## Supply coverage

The supply map owns exactly the offhand-relevant source set:

- all four `post_calib` rows whose canonical `slot_guess` is `shield`;
- all twelve present calibrated `shield` outputs;
- all six present calibrated `ritual` outputs.

The post-calibration mortar-and-pestle promote is intentionally absent because
the auxiliary portfolio owns it as preparation supply. Each owned source appears
once. Four promoted downloaded shields, four calibrated shields, and three
calibrated ritual outputs are assigned to review-reuse rows. The remaining
eleven calibrated outputs are explicitly rejected for base reuse because they
duplicate an assigned silhouette, are motif-heavy, read as a small prop, or lack
a separate ladder role.

All reusable art remains `needs_user`: the image exists and has passed portfolio
comparison, but final visual approval belongs to the user's later sort. New
generation rows have accepted concepts and direct historical anchors, but no
image generation was performed here.

## Ladder summary

| Ladder | Rung progression |
|---|---|
| `offhand_roundwall` | hide round, oxhide tower, bronze parma, shell pelta, deep meteoritic buckler |
| `offhand_cutoutwall` | reed crescent, Dipylon cutouts, ribbed bronze disc, coral spine, black rib shield |
| `offhand_boardcraft` | plank round, framed cane oval, curved scutum, Vermand officer oval, three-plate tower |
| `offhand_waistedguard` | figure-eight body shield, hexagonal hide shield, spined oval, jade-boss buckler, meteoritic spine shield |
| `offhand_compactguard` | hide buckler, copper-boss full shield, stepped bronze buckler, red-glass boss shield, narrow parrying spine |
| `offhand_rite_resonance` | antler prong, ring bell, tripod censer, ivory wax boards, double-flanged rod |
| `offhand_rite_authority` | stone bowl, bar sistrum, pronged sceptre, ram rhyton, long incense arm |
| `offhand_rite_vessels` | hardwood clappers, copper ewer, tall hand seal, amber-terminal bell, double-nozzle lamp |
| `offhand_rite_libation` | shell rattle, side-spouted ladle, omphalos bowl, jade mace, tripod cauldron |
| `offhand_rite_procession` | hide barrel drum, incense tongs, socketed yoke standard, obsidian lug bowl, massive hand bell |

Pixel-art variants remain downstream of user approval and sorting.
