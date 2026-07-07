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
  readable cues. Verdigris equivalents should be hide/linen/scale/sheet-bronze/ritual
  families, not one repeated vest in different colors.
- Boots, gloves, and helmets need paired/symmetric presentation and large,
  clean silhouettes. Avoid tiny fasteners and explicit buckles; let the model
  improvise closures.
- Jewellery earns many base rows through implicit identity. Rings and amulets
  can be visually simple if the silhouette/material/function differ: corded
  charm, torc, collar, bead strand, signet, plain seal ring, socket ring,
  relic ring.
- Do not use PoE/Diablo currency/tool icon patterns as Verdigris prompt
  fodder for now. The current currency/crafting-material concepts are too
  generic; production ideation should stay on equipment, wearable gear, rite
  objects, trophies, relics, and UI only.
- PoE icon style favors centered, isolated objects on dark/transparent fields,
  strong rim lighting, and no scene. That agrees with Verdigris v2.

## Visual notes from crisp character style references

The 2026-07-07 character reference images are not item-subject references.
Their value is rendering calibration:

- The useful look is crisp product-render realism: white studio clarity, high
  local contrast, tight edge definition, hard-surface bevels, visible seams,
  fine scratches, hammered metal texture, leather grain, and material-specific
  specular response.
- Lighting reads as controlled studio lighting: strong upper-left key, deep
  neutral object shadows, and a cool rim on the far edge. This maps cleanly to
  inventory icons if the object remains isolated and fully visible.
- Metals read best when the prompt asks for physical surface response instead
  of lore decoration: polished high spots, worn edges, hammered irregularity,
  dark recesses, and clean neutral grading.
- The dangerous leakage is subject matter: character poses, bodies, class
  labels, faction costumes, sun/eagle/deity symbols, feather crowns, veils,
  coin-chain clutter, fixed turquoise/gold or red/green/gold palettes, and
  dense jewelry. Those belong to character concepts, not ordinary base items.
- For Verdigris item prompts, borrow the render stack only. Keep the base item
  generic, usable, transparent, centered, and silhouette-first.

## Copper / Bronze Age visual research notes

Sources checked:

- British Museum Early Bronze Age flat axe:
  https://www.britishmuseum.org/collection/object/H_WG-1529
- British Museum Early/Middle Bronze Age copper-alloy halberd:
  https://www.britishmuseum.org/collection/object/H_1889-0704-153
- Museum Wales Early Bronze Age bronze dagger:
  https://museum.wales/collections/online/object/78365f92-b262-3b8f-a7be-ef7ecaf682dd/Early-Bronze-Age-bronze-dagger/
- Met Cypriot Early/Middle Bronze Age copper-alloy dagger blade:
  https://www.metmuseum.org/art/collection/search/244172
- British Museum Late Bronze Age sheet-bronze shield:
  https://www.britishmuseum.org/collection/object/H_1873-0210-2
- Museum Wales Bronze Age axe identification guide:
  https://museum.wales/media/52118/7.FactSheet_BronzeAxes.ENG.pdf
- Prehistoric Society Early Bronze Age weapons factsheet:
  https://www.prehistoricsociety.org/sites/prehistoricsociety.org/files/resources/ps-intros-ba-3-eba-weapons.pdf
- Heraklion Archaeological Museum boar's-tusk helmet:
  https://heraklionmuseum.gr/en/exhibit/boars-tusk-helmet-with-cheek-guards/

Production takeaways:

- Use more hiltless and guardless weapons. Good bases: flat dagger blade with
  tang and rivet holes, leaf blade, triangular dagger blade, flanged axe head,
  palstave, socketed axe, socketed spearhead, halberd blade, awl, punch, knife.
- Hafting should read as construction, not medieval furniture: bare tang,
  rivet holes, simple rivets, wrapped grip, socket, forked haft, side-loop,
  rawhide binding, wooden shaft. Avoid crossguards and ornate pommels on bases.
- Axes progress by hafting tech and silhouette: flat axe -> developed flat axe
  with low flanges -> palstave with stop -> looped palstave -> socketed axe.
- Armour should stay pre-mail for now: hide, leather, quilted/layered linen,
  bronze sheet, bronze scale, sheet-bronze shield, bronze greaves, simple
  corslet/breastplate panels, boar-tusk/leather helmets. Retire mail, chain,
  ring mail, mail aventails, and riveted iron strip armour until later.
- Sheet-bronze shields are strong icon candidates: single disc, shallow dome,
  central conical boss, concentric ribs, punched boss rows, rolled rim. Keep
  decoration geometric and structural, not symbolic.
- Boar-tusk helmets are historically real, but risky for AI and easily become
  ugly/costume-like. Use as a later reviewed helm concept, not a default base.

## Ritual / relic implement references

Sources checked:

- British Museum brass vajra/dorje, part of a Gomadan altar:
  https://www.britishmuseum.org/collection/object/A_As1892-0523-6-29-e
- British Museum vajra/ghanta note:
  https://www.britishmuseum.org/collection/object/A_1948-0716-11-b
- Met Museum Javanese vajra:
  https://www.metmuseum.org/art/collection/search/39090
- Met Museum ritual bell / dril-bu:
  https://www.metmuseum.org/art/collection/search/500698
- Rubin / Project Himalayan Art vajra and bell overview:
  https://rubinmuseum.org/projecthimalayanart/exhibition/living-practices/ritual/vajra-and-bell/

Production takeaways:

- Vajra/dorje-type implements are useful because they are compact, symmetric,
  hand-held, and instantly legible: central grip, mirrored pronged ends,
  strong axis, no limp cords or vague magic smoke.
- Use these as structural references for Verdigris relic gear, not as direct
  religious copies. Prefer names like thunderbolt sceptre, pronged hand-sceptre,
  heavy rite rod, or forked rite focus over literal religious naming unless a
  row is explicitly intended as historical reference.
- 2026-07-07 prompt roast correction: "rite baton" reads weak and prop-like.
  Do not use baton/stick language as the item thesis. The object should read
  as a substantial sceptre, mace-like hand focus, bell, reliquary box, offering
  bowl, forked standard, or cudgel with real mass.
- Paired bell/sceptre logic is also strong: bell body, handle, finial, and
  clapper silhouette. Generate as one object unless a pair is explicitly
  required and composition remains readable.
- Good relic gear should look held, worn, struck, rung, sealed, opened, or
  carried. Bad relic gear is a floating crystal, glowing orb, symbol plaque,
  flat tablet, generic "ancient artifact," tiny charm cluster, or object on a
  decorative stand.

## Base-worthiness / weak-prop scan

Source scan after the rite-baton / wicker-shield roast found the broader
failure class: prompt ideas that satisfy slot diversity but do not read as
credible loot. Retire these as positive examples:

- Wicker shields, reed shields, reed maps, reed baskets, road charms, loose
  feather markers, shrine miniatures, hand stones, tiny darts, pencil-thin
  wands, rite batons, and generic small foci.
- Wicker/reed can appear as hidden backing under hide or leather when needed,
  but it should not be the named material thesis for a defensive base.
- Shields must look able to block: hide over a thick wood frame, rawhide,
  bronze roundshields, bronze-scale shields, sheet-bronze towers, or similar
  credible structures.
- Rite and relic gear must look held, rung, struck, opened, sealed, carried,
  or equipped. If the object reads like a prop, souvenir, charm pile, classroom
  craft, or gag item at 48px, replace it with a heavier base.

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
- Do not translate Diablo/PoE currency systems into Verdigris art prompts
  unless the currency/crafting-material lane is explicitly reopened. The
  durable art plan should allocate those rows to equipment and concrete relics
  instead.
- Preserve image-2 reliability lessons: discard atlatls, slings, handwraps,
  tiny closures, over-thin loose cords, and other concepts that have already
  failed generation.
