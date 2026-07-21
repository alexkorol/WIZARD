# Verdigris 500-600 Image Generation Plan

This is the durable scale target. The current `targets.tsv` set is only a
starter slice. Do not treat 90 items as "the plan"; the intended production
target is roughly 500-600 usable inventory images.

## Target counts

| Bucket | Count | Notes |
|---|---:|---|
| Equipment base items | 420 | Named base ladders across weapons, armour, off-hands, jewellery, rite gear, and relics. The former currency/crafting-art budget is redistributed here, mostly to non-weapon slots. |
| Uniques / awakened relics | 100 | 25 per theme: slaughter, warding, spiritwork, wayfaring. |
| Trophies / fragments / hunt relics | 40 | Monster parts, ancestor fragments, shrine offerings. |
| Sets / faction variants | 40 | Small 3-5 piece visual families, not full material grids. |
| UI / frame / support art | 20 | Frames, benches, sockets, dividers, vendor and inventory accents. |
| Rework / discard buffer | 20 | Expected failed concepts and replacement rows. |
| **Total** | **640 planned rows** | Gives room to discard down to 500-600 finals. |

The production manifest should intentionally over-plan by 5-10%, because
image-2 has known concept failures. A final committed set around 560 is ideal.

## Current state

- `targets.tsv`: 89 rows.
- Active after `core/asset-review.js` discards: 70 rows.
- Current complete active coverage: 70/70, with 5 review reworks queued.
- Current set is a vertical slice: it proves the pipeline, not the final item
  economy scale.

## Equipment base allocation

The 420 equipment bases should be generated before most uniques. Uniques need
base vocabulary to mutate.

| Slot / family | Count | Verdigris direction |
|---|---:|---|
| Daggers / knives | 18 | Shiv, knife, dirk, fang, kris, ritual puncture blades, sacrificer knives. |
| Short blades / sickle swords | 18 | Cleavers, falchions, khopeshes, sabres, hooked blades. |
| Axes / adzes | 18 | Hatchets, adzes, war-axes, cleavers, bardiches; vary head shape aggressively. |
| Clubs / maces | 18 | Femur clubs, cudgels, copper maces, star-maces, mauls. |
| Two-hand heavy weapons | 18 | Greatclubs, greataxes, macuahuitls, execution blades, temple mauls. |
| Spears / polearms | 18 | Spears, harpoons, pikes, glaives, warspears; keep full weapon visible. |
| Rite tools / sceptres | 18 | Off-hand ritual tools with real mass: heavy hand bells, pronged hand-sceptres, mace-like idol-staves, handled reliquaries, offering bowls, priest tools. Not main-hand weapon damage bases unless explicitly weaponized. |
| Caster rods / wands | 12 | Short heavy rods distinct from sceptres; thick grips, blunt finials, sockets, or capped heads. Avoid pencil-thin wands. |
| Throwing / sidearms | 12 | Throwing knives, heavy javelins, throwing clubs; avoid bows/slings, tiny darts, and hand stones. |
| Body armour | 24 | Hide wraps, linen, boiled leather, studded jerkins, scale vests, sheet-bronze corslets. |
| Helmets / crowns | 24 | Caps, crests, helms, masks, warcrowns, greathelms; distinct silhouettes. |
| Bracers / gloves | 18 | Bracers/vambraces/gauntlets; avoid ambiguous handwraps. |
| Boots / greaves | 18 | Sandals, boots, shin guards, greaves; pair shown as pair. |
| Belts / girdles | 18 | Cords, sashes, girdles, plated belts, warbelts; landscape canvas. |
| Shields / bucklers | 24 | Hide-over-wood, rawhide, round, tower, sheet-bronze, scale; strong front read, plain bosses on bases. |
| Amulets / pendants | 18 | Pendant-first neck loot: stones, beads, metal pieces, lunulae, small charms on cord/twine/leather/simple chain. Avoid gorgets/collars unless the slot is intentionally armor-like. |
| Rings / seals | 18 | Bone rings, coils, signets, bands, plain seal rings, socket rings. Compact finger jewelry only; no dangling charms, chains, tassels, bells, or chimes. |
| Charms / relic curios | 24 | Reliquary boxes, trophy settings, handled votive vessels, compact caskets; no loose tiny charms or shrine miniatures. |
| Off-hand foci | 12 | Targes, bossed ward bucklers, reliquary shields, heavy hand-guards; caster/ward variants. |
| War-call instruments | 12 | 2x2 animal horns, Bronze Age curved trumpets, straight salpinges/Etruscan trumpets, hooked litui, cornua, carnyx-like trumpets, drums, sistra, bells, clappers, and compact standards. Do not spend the lane on twelve horn variants. |
| Quick rigs | 12 | 2x2 back/flank-worn quivers, gorytoi, weighted-dart racks, sling-bullet side carriers, and framed knife/fletching/medicine/pigment/trap/fire kits; show the complete backboard and harness without a body, never a handheld purse, satchel, briefcase, or off-hand object. |
| Attendant foci | 12 | 2x2 hands-free magical reinterpretations of polycandelon lamp wheels, chained censers, suspended lamps, backed mirrors, bells, pyxides, seal-cylinder spindles, vessels, rings, and scale cages. Overt magic is allowed; cap bare-orb silhouettes. |
| Alias / reuse pool | 12 | D2-style renamed tiers using already-good art where acceptable. |
| Non-weapon expansion reserve | 24 | Extra armour, shields, wearable jewellery, belts, greaves/bracers, rite foci, auxiliary gear, relic gear, and trophies. Do not spend this reserve on weapons or abstract currency. |
| **Total** | **420** |  |

## Uniques and awakened relics

Generate after the base vocabulary exists.

| Theme | Count | Visual notes |
|---|---:|---|
| Slaughter | 25 | Red ochre, chipped edges, tooth/tusk trophies, but not gore soup. |
| Warding | 25 | Shields, knots, blue-white mineral, heavy geometry, oath marks. |
| Spiritwork | 25 | Bone, soot, ash, smoke, carved masks, quiet ritual objects. |
| Wayfaring | 25 | Sandals, boots, travel belts, map cases, staff heads, travel-worn gear. |

Uniques should alter silhouette, not just add glow. Example patterns: an
ordinary bronze war-axe becomes a notched execution axe with a tooth-count
edge; a ring becomes a seal with an inset omen bead; a shield becomes a
specific oath board.

## Non-Equipment Art

The non-equipment art budget fills the three hybrid-axis specialty packs plus a
small UI reserve. Concrete reagents and preparations are now an intentional
item lane; abstract crafting currency remains closed.

- 30 Spoils Roll contents (STR+DEX): raw tusks tied in plain pairs, rough horn,
  trimmed antler, dry jaw sections, hide-wrapped fang or claw bundles, shell
  pieces, carapace chunks, natural scale patches, minimally cured pelt rolls,
  scraped hide sheets, plain-tied feathers, wrapped spine or stinger sections,
  hooves, talon sheaths, and sinew bundles. These are saleable and consumable
  crafting stock. Allow only washing, scraping, drying, salting, trimming,
  plain tying, or rough wrapping; no polish, jewels, metal caps, display mounts,
  impossible horns, finished weapons, or armor.
- 30 Preparation Case contents (DEX+INT): identifiable herbs, roots, resins,
  venoms, oils, powders, pigments, measured salts, ampoules, ointment palettes,
  cosmetic grinders, pyxides, medicinal salve-stick cases, medical rolls,
  fletching kits, fire packets, and prepared trap components. Every item needs
  a concrete gathered, measured, mixed, packed, or tool-bearing identity.
- 30 Reliquary contents (INT+STR): deep relic boxes, votive coffers, pyxides,
  neutral-geometry Late Antique ampullae, offering bowls, libation vessels,
  censers, lamps, codices, scroll cases, diptychs, wrapped fragments, textile
  bundles, seal sets, bells, staff heads, ladles, and shrine keys.
- 10 UI/support pieces: frames, slots, sockets, dividers, and inventory accents.

Do not generate abstract currencies, sigils-as-currency, interchangeable glowing
stones, ingots, molds, seal weights, or omen abstractions. This does not prohibit
magical orbs as Attendant equipment, or concrete reagents/pigments prepared as
recognizable loot objects for the Preparation Case.

## Generation order

1. Fix current 5 review reworks.
2. Expand equipment bases to 180 rows with slot balance: weapons may lead
   discovery, but they cannot dominate prompt batches.
3. Expand equipment bases to 360 rows: armour, shields, jewellery, foci,
   charms, belts, bracers, boots, and off-hands.
4. Add the 60-row non-weapon expansion reserve.
5. Add 40 trophies/fragments and 40 shrine/faction tokens.
6. Add 100 uniques/awakened rows.
7. Add UI/support art only where the app actually needs it.

At 50-60 acceptable gens/day, the 500-600 target is roughly 10-12 production
days, plus review and rework time.

## Source-image loadout extraction lane

Use `LOADOUT-EXTRACTION.md` as a parallel production lane when isolated item
DESCs start producing forced or weak results. This was Alexei's 2026-07-07
breakthrough: give image-2 a full character/loadout source image first, then
ask it to extract separate transparent paperdoll-slot item icons from the gear
the character wears.

This is especially useful for shields, belts, footwear, armor, offhands,
War-calls, Quick Rigs, Attendants, specialty-pack contents, relic gear, and
coherent faction/set families. Bracers/vambraces are the hand/glove slot, not a
separate paperdoll slot. Held foci and ritual tools belong to the off-hand slot;
hands-free floating/orbiting foci belong to the Attendant seat. It solves a
different problem than
prompt wording: the source image carries the whole equipment system, including
material palette, construction logic, ornament density, straps/attachments, and
slot relationships.

Guardrail: details are allowed when grounded in the source kit. Feathers,
tassels, shell plates, scratches, cords, chains, coins, veils, stones, and
symbols can be valid item details if they are physically integrated and improve
the object. Reject ungrounded decoration, slot drift, body-part crops,
paperdoll UI, contact sheets, baked checkerboards, and any extracted item that
does not read as usable loot.

## Naming rules for the large manifest

Use `NAMEBANK-PRE-AD.md` when selecting base names, construction terms, rare
prestige buckets, and medieval false-friend filters. The short version: ordinary
base gear should come from pre-AD archaeological forms and construction
language, while spectacular votive/display/precious pieces move to uniques,
awakened relics, shrine loot, or faction prestige sets.

- Player-facing names are base names, not material IDs.
- Avoid repeated `material noun` rows unless the silhouette changes.
- Every row needs a visual thesis: "what will read differently at 48px?"
- Low-tier rows are simple, one-material, and not over-decorated.
- High-tier base rows may be more refined, but the ornament must reinforce the
  silhouette and stay generic.
- Base rows do not get invented lore symbols, horned suns, deity marks,
  faction emblems, heavy patina, or grimy verdigris. Save that for uniques,
  awakened relics, and faction sets.
- Base-worthy gear rule: every ordinary base must look worth equipping before
  the tooltip explains it. It should have enough mass, construction, and
  silhouette authority to block, strike, ward, carry, bind, or focus power.
  Retire concepts that read as camp props, toys, school projects, tiny ritual
  souvenirs, or joke loot.
- Wearable and carried items must show plausible construction. Armour needs
  wearable front/back, overlap, backing, lacing, side ties, or broad straps;
  quivers need a visible shoulder strap; shields need a grip, arm loop, or
  clear hand/arm use; greaves/bracers need backing or side straps. Avoid
  one-piece magic shells that cannot be donned.
- Slot identity is part of the prompt, not cleanup after the fact. Rings are
  compact finger rings with no dangling charms, chains, tassels, bells, or
  chimes. Amulets are pendant-first objects on a long-ish cord, twine, leather
  string, or simple chain, with the pendant filling most of the 1x1 image;
  avoid gorgets/collars for the amulet slot. Body armor should isolate the
  chest/body piece with an open neck/chest read and no attached gorget, collar,
  turtleneck, belt, skirt, faulds, tassets, or cloak. Belts are horizontal 1x2
  waist items, not skirts/faulds/tassets. Shields show the front fighting face
  only, with no front-side straps, dangling hardware, random rings, handle
  loops, utility rigging, or clamshell construction.
- Motif restraint: solar symbols, eight-spoked wheel symbols, and human-face
  centerpieces are overrepresented. Avoid them by default on base items. If a
  source set clearly contains one, use it on at most one extracted item; the
  set should read coordinated, not matchy.
- Use gauze, translucent cloth, shredded cloth, and ragged fringe sparingly.
  Prefer opaque linen, wool, hide, leather, bark cloth, felt, woven fiber, or
  thicker silk-like panels. Cloak edges can be worn but should not become alpha
  cleanup noise or shredded costume trash.
- Bone armour must be assembled from smaller bone plates, splints, or sections
  on hide/leather backing. Do not prompt a perfect solid shin-guard-shaped
  bone plate; no animal grows a clean greave-shaped bone.
- Jade is not a blade/reach weapon material. Do not generate jade sabres,
  daggers, axes, spearheads, glaives, or polearms. Jade weapons are allowed
  only when the silhouette is blunt or mace-like: club, mace, maul, hammer,
  idol-head cudgel, or heavy ritual striking object.
- Mail and riveted-iron armour are paused for now. Prefer Copper/Bronze Age
  structures: hide/leather, quilted or layered linen, bronze sheet, bronze
  scale, sheet-bronze shields, greaves, collars, and simple corslet panels.
  Functional rivet holes on tanged dagger blades, halberds, or shield handles
  are fine; do not make mail/rivetmail/riveted iron strips a class.
- Prompt-candidate batches must be slot-diverse. In a 12-candidate roast batch:
  max 2 weapons, min 2 armour/helmets, min 2 shields/off-hands, min 2 limb or
  waist wearables, min 2 jewellery/neck/ring items, and min 2 rite foci,
  relics, curios, or trophies. For smaller batches, weapons stay below 25%.
  Never let axes/daggers become the default sample set.
- Prompt-candidate batches must be no-repeat by default. When Alexei asks for
  "test prompts" or "prompts to roast", do not repeat, regenerate, or restyle
  already-made items. Exclude current `assets/`, accepted manual intake,
  duplicate/exclusion notes, discarded rows, and queued reworks. Style
  calibration follows the same rule unless Alexei explicitly names an existing
  item and asks to restyle that exact item.
- Abstract currency candidates remain out of scope. Do not propose crafting
  currencies, omen symbols, ingots, molds, seal weights, interchangeable
  glowing reagent stones, or abstract bench tokens. Concrete Preparation Case
  reagents/pigments and magical Attendant orbs are explicitly in scope.
- Relic gear should be built from concrete ritual implement silhouettes, not
  weak AI-trope "mystic trinkets." Good structural references include
  vajra/dorje-like double-ended pronged sceptres, heavy paired hand bells,
  forked standards, offering bowls, idol-head cudgels, and reliquary boxes.
  Use the object logic: central grip, mirrored prongs, bell body plus handle,
  socketed finial, lid/base/handle. Do not copy living sacred iconography
  one-to-one, use exact religious names as ordinary base names, or add fake
  symbols/lore marks.
- At least 20% of equipment bases should have implicit/mechanical identity:
  socket, vessel, patience, trophy affinity, theme bias, block, speed, ward,
  spirit, reach, crit, or carry capacity.

## Auxiliary slot and specialty-pack system

The inventory implements six independent skill-tree windows:

- Pure STR: 2x2 War-call seat.
- Pure DEX: 2x2 Quick Rig seat.
- Pure INT: 2x2 Attendant focus seat.
- STR+DEX: 4x4 Spoils Roll.
- DEX+INT: 4x4 Preparation Case.
- INT+STR: 4x4 Reliquary.

Each category needs both isolated base-item prompts and representation in the
second-pass source-character extraction prompt. Do not collapse them back into
one utility drawer or treat their art as generic curios.

## Forbidden / high-risk concepts

Retire these unless reconceived into a reliable icon:

- Atlatls / spear-throwers.
- Loose slings and long dangling cords.
- Invasive dangling charms, chimes, tassels, tiny hanging rings, and delicate
  costume chains on rings, helmets, armor, cloaks, shields, or weapons.
- Solar symbols, eight-spoked wheels, and human-face centerpieces on ordinary
  base items, especially repeated across every slot in one set.
- Amulets rendered as gorgets, collars, chokers, or throat armor unless
  intentionally reviewed as armor-like neck gear.
- Body armor that includes attached collars/gorgets/turtlenecks/belts/skirts,
  or belts rendered as faulds, tassets, aprons, and hanging costume panels.
- Shields with front-side straps, dangling rings, utility hardware, clamshell
  openings, or visible back-side handle construction on the front-facing icon.
- Fingerless handwraps or objects that read as feet/hands ambiguously.
- Tiny toggles, buckles, clasps, and explicit closures as decoration. Broad
  straps, lacing, backing, shoulder straps, and arm loops are required when
  they explain how gear is worn or carried.
- Long thin objects without a strong diagonal/full-length framing instruction.
- Vague curios on stands. Use one strong object instead.
- Jade blades, jade spearheads, jade glaives, and other jade cutting/piercing
  weapons. Keep jade weapons blunt/mace-like only.
- Mail, rivetmail hauberks, mail aventails, chain/ring mail, and riveted iron
  strip armour until the tech tier is explicitly reintroduced.
- Abstract currency art: crafting-currency sigils, omen symbols, ingots, molds,
  seal weights, interchangeable glowing reagent stones, and abstract bench
  tokens. Concrete preparations and Attendant orbs are exempt.
- Weak relic tropes: floating crystals, vague glowing idols, generic magic
  orbs used as Reliquary filler, symbol-covered plaques, flat tablets, ward plates, carved slabs,
  generic hand-held boards, smoky amulets, tiny charm clusters, and decorative
  stands. Relic gear needs one strong held/worn/handled object.
- Weak base-item concepts: wicker shields, rite batons, pencil-thin wands,
  hand stones, tiny darts, shrine miniatures, reed baskets, reed maps, road
  charms, loose feather markers, and other one-off props that do not read as
  credible loot. Wicker/reed can be hidden construction under hide or leather,
  not the named face of a shield or the item thesis.

## Next file to create

The next production artifact should be `targets-600.tsv`, generated from this
plan. It should be additive and reviewable before replacing `targets.tsv`.
