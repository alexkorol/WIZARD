# ARPG Item Reference Notes

These notes record the research direction Alexei asked for: use Path of Exile
and Diablo as structure/scale references, but keep Verdigris visually original.
Do not copy icons, names, or exact item lists. Extract the production logic.

## Sources checked

- Path of Exile equipment category model:
  https://www.poewiki.net/wiki/Equipment
- Path of Exile item database overview:
  https://poedb.tw/us/Items
- Path of Exile 2 item category overview and scale note:
  https://poe2db.tw/us/Items
- Path of Exile axe base list:
  https://www.poewiki.net/wiki/Axe
- Path of Exile body armour base list:
  https://www.poewiki.net/wiki/Body_armour
- Path of Exile amulet base list:
  https://www.poewiki.net/wiki/Amulet
- Path of Exile belt base list:
  https://www.poewiki.net/wiki/Belt
- Path of Exile influenced item mechanics and symbols:
  https://www.poewiki.net/wiki/Influenced_item
- Path of Exile synthesised item mechanics:
  https://www.poewiki.net/wiki/Synthesised_item
- Path of Exile Synthesis FAQ, especially Fractured/Synthesised item notes:
  https://de.pathofexile.com/forum/view-thread/2478470
- Path of Exile Foulborn unique mechanics and example:
  https://www.poewiki.net/wiki/Foulborn_unique_item
- Path of Exile Keepers of the Flame FAQ / patch notes for Foulborn scope:
  https://www.pathofexile.com/forum/view-thread/3870059
  https://www.pathofexile.com/forum/view-thread/3869068
- Diablo II elite item tier note:
  https://diablo.fandom.com/wiki/Elite_Items
- Diablo II base item database:
  https://diablo2.io/base/
- Diablo II armor normal/exceptional/elite visual list:
  https://www.d2tomb.com/armor.shtml
- Diablo II cube upgrade/crafting reference:
  https://www.windowscentral.com/diablo-2-resurrected-horadric-cube-recipes

## Scale takeaways

- A 500-600 art target is correct for a loot ARPG, not inflated. PoE2DB
  records the PoE2 direction as roughly 700 equipment base types, with unique
  items tied to bases. That is the right order of magnitude.
- PoE1 also uses deep per-class base ladders. Example: its axe page lists
  27 one-handed axe bases and 24 two-handed axe bases. That is more than our
  entire current weapon roster in only one weapon family.
- Jewellery is not just "ring/amulet/belt in five materials." PoE uses many
  implicit-driven base identities: attribute amulets, socket amulets, rarity
  amulets, endgame special amulets; belts likewise vary by defensive/offensive
  implicit and special sockets.
- Diablo II gets volume from a Normal -> Exceptional -> Elite progression and
  many slot subtypes. Some D2 tiers reuse the same inventory icon with new
  names/stats. Verdigris can reuse or alias some art, but should not rely on
  that for the main 500-600-image target.

## Visual notes from PoE item icons

- Inventory icons are not material swatches. A good base is a distinct object:
  different head shape, blade posture, body cut, collar, silhouette, stance,
  mass, or ornament layout.
- Weapons usually read by silhouette first. One-handed axes vary by blade
  count, cheek shape, handle length, crescent/chopper/tomahawk profiles,
  ceremonial engraving, and late-game exaggeration. Damage tier follows shape
  and name as much as material.
- Two-handed weapons deserve their own silhouettes. A long axe, cleaver,
  polearm, maul, and staff should not be made by scaling a one-handed icon.
- Body armour uses defense-family visual language: plate is rigid and blocky;
  leather is slim and flexible; robes are hanging cloth; hybrids combine
  readable cues. Verdigris equivalents should be hide/linen/scale/mail/ritual
  families, not one repeated vest in different colors.
- Boots, gloves, and helmets need paired/symmetric presentation and large,
  clean silhouettes. Avoid tiny fasteners and explicit buckles; let the model
  improvise closures.
- Jewellery earns many base rows through implicit identity. Rings and amulets
  can be visually simple if the silhouette/material/function differ: corded
  charm, torc, collar, bead strand, signet, plain seal ring, socket ring,
  relic ring.
- Currency/tool icons are allowed to be very close-up. The object is often a
  small orb, shard, vial, seal, or fossil-like piece with one strong read at
  48px. Save explicit emblems for faction/set/unique art.
- PoE icon style favors centered, isolated objects on dark/transparent fields,
  strong rim lighting, and no scene. That agrees with Verdigris v2.

## PoE special-state item dissection

PoE uses special item states as UI/effect overlays, not as wholesale changes
to the base icon. That is the core lesson for Verdigris: a state should be
legible as a layer on top of a known object.

### Influenced items

- Mechanically, influenced items are base items with exclusive modifier pools.
  The item remains the same base, but the item panel gains an influence marker
  and the item has access to extra affixes.
- Visual read: side icons on the name plate plus a themed background/effect.
  PoE's six classic influence marks are tiny and symbolic: Crusader red,
  Hunter green, Redeemer pale/silver-blue, Warlord gold, Shaper cosmic red,
  Elder dark purple/void.
- Important production lesson: the influence signal is outside the object
  silhouette. The sword/helmet/ring art can stay readable and generic while
  the UI says "this item belongs to a higher system."
- For Verdigris: use frame accents, tooltip side glyphs, and subtle aura
  washes for Brands/Bonds/Trophies or future factions. Do not bake faction
  symbols into ordinary base prompts.
- Multi-influence is valuable as a UI grammar: two small side marks can mean a
  hybrid state without needing a new full item render.

### Synthesised items

- Mechanically, Synthesis created new bases with special implicit modifiers.
  The current core mechanic can also make an item Synthesised and give random
  Synthesis implicits; Synthesised items cannot also be influenced or
  fractured in the normal rules.
- Fractured source items had special art effects and fixed light-brown mods
  that could not be altered. Synthesised outcomes inherit the idea of a
  machine/memory-made base with unusual implicits.
- Visual read: blue/cyan memory energy, ornate machine frame language, and a
  clean "this has hidden structure" feeling rather than dirt, gore, or heavy
  decoration. The effect is cold, prismatic, and arcane.
- For Verdigris: this maps well to "vessel" and "memory" states. Use cool
  rim-light, faint inner lattice, ghosted duplicate edge, or small crystalline
  motes around the tile. Keep it as a postprocess layer; do not ask image-2 to
  invent complex memory machinery on every base item.
- Design guardrail: synthesised-style visuals should mean "rewritten
  structure/implicit identity", not just "rarer item." Reserve it for base
  mutation, awakened relics, or high-order craft outcomes.

### Foulborn uniques

- Mechanically, Foulborn uniques are mutated versions of existing uniques. One
  or more original modifiers are replaced with purple Foulborn modifiers. The
  original unique remains recognizable.
- Visual read: the item gets "Foulborn" before the name, a purple name-plate
  symbol, purple modifier text, and a purple effect on the 2D artwork. It is a
  mutation layer, not a new base family.
- The PoE example reads well because the changed line is visually isolated in
  purple. The player can compare "normal unique" vs "mutated unique" without
  rereading the whole card.
- For Verdigris: this is a strong model for cursed/estranged/failed-awakened
  relics. Keep the original item art, then add a violet-black edge glow,
  bruised underlight, or one corrupt modifier line. Avoid making the whole
  item purple soup.
- Good UI grammar: prefix/sigil/color-line all agree. If Verdigris adds a
  Foulborn-like state, it should have one word in the item name, one small
  glyph in the frame, and one modifier text color.

## Verdigris special-state rules from PoE research

- Base art remains base art. Special states are overlays, frame treatments,
  side glyphs, tooltip text colors, and controlled particle/rim effects.
- Keep state palettes sparse:
  - Brand: warm gold/ochre.
  - Bond: theme color, quiet glow.
  - Trophy: bone/green-white accent.
  - Synth/memory/vessel rewrite: cold cyan/blue-white lattice.
  - Foulborn/corrupt mutation: violet-black or magenta-purple.
- Never encode ordinary bases with invented faction marks. Use symbols only
  for explicit mechanics: influence, set, unique, awakened, mutation.
- Effects should frame the silhouette, not cover it. At 48px, a readable
  outline beats a beautiful internal texture.
- Use nameplate/frame language heavily. PoE gets a lot of state readability
  from tiny side icons and text color before the player even looks at the art.
- For image generation prompts, do not ask for "influenced/synthesised/
  foulborn" base items directly. Generate clean transparent item art first,
  then apply deterministic CSS/canvas effects in the app.

## Visual notes from Diablo item structure

- Diablo II's useful lesson is taxonomy, not icon reuse. Normal, Exceptional,
  and Elite tiers give the same mechanical slot a long-lived identity across
  difficulty tiers.
- D2 armor naming gives a strong vocabulary ladder: quilted, leather, hard
  leather, studded, ring mail, scale mail, breast plate, chain mail, splint,
  light plate, field plate, plate mail, gothic plate, full plate, ancient
  armor, then exceptional/elite renames.
- Socket count and crafting compatibility make otherwise plain bases valuable.
  Verdigris equivalents: vessel slots, patience, trophy compatibility, omen
  affinity, and theme bias can make base icons matter beyond raw tier.
- D2 item icons are often simple, readable, and inventory-first. Do not over-
  compose low-tier items. A crude base should be one clear thing.

## Verdigris translation rules

- Do not go back to a pure form x material grid. The plan is named bases with
  intrinsic material/theme.
- Ordinary bases should be generic and clean. Avoid invented lore symbols,
  horned suns, deity marks, seal faces, heavy patina, and grimy verdigris.
- Five-tier ladders are only the starting spine. For 500-600 images, each
  class needs parallel subfamilies and variant bases, not only T1-T5.
- Use PoE's depth: many base identities per slot, implicit/mechanical
  differences, and several endgame special bases.
- Use Diablo's difficulty ladder: crude -> worked -> martial -> ritual ->
  otherworldly, with occasional alias/reuse where a D2-style rename is useful.
- Preserve image-2 reliability lessons: discard atlatls, slings, handwraps,
  tiny closures, over-thin loose cords, and other concepts that have already
  failed generation.
