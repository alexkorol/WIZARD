# Verdigris 500-600 Image Generation Plan

This is the durable scale target. The current `targets.tsv` set is only a
starter slice. Do not treat 90 items as "the plan"; the intended production
target is roughly 500-600 usable inventory images.

## Target counts

| Bucket | Count | Notes |
|---|---:|---|
| Equipment base items | 360 | Named base ladders across weapons, armour, off-hands, jewellery, and relics. |
| Uniques / awakened relics | 100 | 25 per theme: slaughter, warding, spiritwork, wayfaring. |
| Crafting currency / omens / pigments | 60 | Bench tools, sigils, stones, draughts, knives, pigments, omens. |
| Trophies / fragments / hunt relics | 40 | Monster parts, ancestor fragments, shrine offerings. |
| Sets / faction variants | 40 | Small 3-5 piece visual families, not full material grids. |
| UI / frame / support art | 20 | Frames, benches, sockets, dividers, vendor/crafting accents. |
| Rework / discard buffer | 20 | Expected failed concepts and replacement rows. |
| **Total** | **640 planned rows** | Gives room to discard down to 500-600 finals. |

The production manifest should intentionally over-plan by 5-10%, because
image-2 has known concept failures. A final committed set around 560 is ideal.

## Current state

- `targets.tsv`: 91 rows.
- Active after `core/asset-review.js` discards: 77 rows.
- Current complete active coverage: 77/77, with 6 review reworks queued.
- Current set is a vertical slice: it proves the pipeline, not the final item
  economy scale.

## Equipment base allocation

The 360 equipment bases should be generated before most uniques. Uniques need
base vocabulary to mutate.

| Slot / family | Count | Verdigris direction |
|---|---:|---|
| Daggers / knives | 18 | Shiv, knife, dirk, fang, kris, ritual puncture blades, sacrificer knives. |
| Short blades / sickle swords | 18 | Cleavers, falchions, khopeshes, sabres, hooked blades. |
| Axes / adzes | 18 | Hatchets, adzes, war-axes, cleavers, bardiches; vary head shape aggressively. |
| Clubs / maces | 18 | Femur clubs, cudgels, copper maces, star-maces, mauls. |
| Two-hand heavy weapons | 18 | Greatclubs, greataxes, macuahuitls, execution blades, temple mauls. |
| Spears / polearms | 18 | Spears, harpoons, pikes, glaives, warspears; keep full weapon visible. |
| Rite foci / sceptres | 18 | Fetishes, rattles, sceptres, idol-staves, starwands, priest tools. |
| Caster rods / wands | 12 | Small foci distinct from sceptres; reliable short objects. |
| Throwing / sidearms | 12 | Throwing knives, darts, hand stones; avoid bows/slings unless reconceived. |
| Body armour | 24 | Hide wraps, linen, boiled leather, studded jerkins, scale vests, hauberks. |
| Helmets / crowns | 24 | Caps, crests, helms, masks, warcrowns, greathelms; distinct silhouettes. |
| Bracers / gloves | 18 | Bracers/vambraces/gauntlets; avoid ambiguous handwraps. |
| Boots / greaves | 18 | Sandals, boots, shin guards, greaves; pair shown as pair. |
| Belts / girdles | 18 | Cords, sashes, girdles, plated belts, warbelts; landscape canvas. |
| Shields / bucklers | 24 | Wicker, hide, round, tower, scale, rivetmail; strong front read, plain bosses on bases. |
| Amulets / neckpieces | 18 | Pendants, torcs, collars, lunulae, gorgets, sigils. |
| Rings / seals | 18 | Bone rings, coils, signets, bands, plain seal rings, socket rings. |
| Charms / relic curios | 24 | Fetishes, carved animals, omen tokens, shrine miniatures, reliquaries. |
| Off-hand foci | 12 | Targes, tablets, hand-idols, rite boards; caster/ward variants. |
| Alias / reuse pool | 12 | D2-style renamed tiers using already-good art where acceptable. |
| **Total** | **360** |  |

## Uniques and awakened relics

Generate after the base vocabulary exists.

| Theme | Count | Visual notes |
|---|---:|---|
| Slaughter | 25 | Red ochre, chipped edges, tooth/tusk trophies, but not gore soup. |
| Warding | 25 | Shields, knots, blue-white mineral, heavy geometry, oath marks. |
| Spiritwork | 25 | Bone, soot, ash, smoke, carved masks, quiet ritual objects. |
| Wayfaring | 25 | Sandals, road charms, feather markers, reed maps, travel-worn gear. |

Uniques should alter silhouette, not just add glow. Example patterns: an
ordinary bronze war-axe becomes a notched execution axe with a tooth-count
edge; a ring becomes a seal with an inset omen bead; a shield becomes a
specific oath board.

## Currency, tools, trophies

The 100 non-equipment gameplay items should be split:

- 20 crafting currencies: sigils, stones, knives, chisels, resonance orbs,
  kiln tools, sealing waxes, memory shards.
- 16 pigments and washes: red ochre, woad, soot, marsh ochre, bone white,
  copper green, ash grey, river blue, etc.
- 16 omens: bird, smoke, blood, entrail, ash, river, hoofprint, eclipse,
  cracked tooth, storm reed.
- 24 trophies/fragments: tusks, claws, fangs, pearls, shells, feathers, scales,
  knucklebones, antlers, chitin, ember carapaces.
- 24 shrine/faction tokens: Redhand, Shieldbearer, Ashspeaker, Farwalker,
  settlement and wilderness variants.

## Generation order

1. Fix current 6 review reworks.
2. Expand equipment bases to 180 rows: weapons first, armour second.
3. Expand equipment bases to 360 rows: jewellery, foci, charms, off-hands.
4. Add 60 crafting/currency rows.
5. Add 40 trophies/fragments.
6. Add 100 uniques/awakened rows.
7. Add set/faction variants and UI/support art.

At 50-60 acceptable gens/day, the 500-600 target is roughly 10-12 production
days, plus review and rework time.

## Naming rules for the large manifest

- Player-facing names are base names, not material IDs.
- Avoid repeated `material noun` rows unless the silhouette changes.
- Every row needs a visual thesis: "what will read differently at 48px?"
- Low-tier rows are simple, one-material, and not over-decorated.
- High-tier base rows may be more refined, but the ornament must reinforce the
  silhouette and stay generic.
- Base rows do not get invented lore symbols, horned suns, deity marks,
  faction emblems, heavy patina, or grimy verdigris. Save that for uniques,
  awakened relics, and faction sets.
- At least 20% of equipment bases should have implicit/mechanical identity:
  socket, vessel, patience, trophy affinity, theme bias, block, speed, ward,
  spirit, reach, crit, or carry capacity.

## Forbidden / high-risk concepts

Retire these unless reconceived into a reliable icon:

- Atlatls / spear-throwers.
- Loose slings and long dangling cords.
- Fingerless handwraps or objects that read as feet/hands ambiguously.
- Tiny toggles, buckles, clasps, and explicit closures.
- Long thin objects without a strong diagonal/full-length framing instruction.
- Vague curios on stands. Use one strong object instead.

## Next file to create

The next production artifact should be `targets-600.tsv`, generated from this
plan. It should be additive and reviewable before replacing `targets.tsv`.
