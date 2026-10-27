# Naming rules and the October 26, 2026 rename record

Owner corrections: September 21, 2026 (combat channels are Fire, Cold, Lightning and Chaos)
and October 26, 2026: "stop inventing ai-trope lore", and "same applies to cringey
composite terms like 'emberguard' 'vesselforge' etc." The rules are in `AGENTS.md`.
`scripts/invented-terms.test.mjs` (in `scripts/wizard-lab.mjs verify`) enforces them on every
tool page, data script and manifest and prints a table of anything it flags. Folder names,
file names and code identifiers (for example `tools/spellforge`, `vesselforge.js`,
`skymetal`, `warcall`, `nightwork`) are kept where renaming them would break saves, links or
imports.

Passive tree renames (325 seats) are listed in
[tools/geometric_skilltree/NAMING.md](tools/geometric_skilltree/NAMING.md).

## Tool and module titles

| Where | Old | New |
|---|---|---|
| rpg_inventory page title, module title | Brands & Bonds — Vesselforge; Vesselforge & Inventory | Inventory and Item Crafting |
| rpg_inventory item card | Relic Card — Brands & Bonds | Item Card — Inventory and Item Crafting |
| rpg_inventory playground | Vesselforge Playground | Item Crafting Playground |
| spellforge page and module | Spellforge Grimoire; Spellforge VFX Lab | Spell Effects Lab |
| rp_account_creator | Chronicles | House Creator |

## Invented compounds and setting words

| Where | Old | New |
|---|---|---|
| Inventory material (tier 5); account creator; framekit demo item | Skymetal (Skymetal Khopesh) | Hammered Iron (owner, October 2: plain physical terms) |
| Inventory slot, tree socket board, class unlock | Warcall, War-call, "the War-call window — an extra horn slot" | War Horn, "the War Horn slot" |
| Inventory jewel item | Whorl-stone (Carved stone) | Jewel |
| Inventory bond theme | Spiritwork | Spirit |
| Passive tree class, its Waystone and gate | Nightblade | Assassin |
| Item art review factions (lane ids unchanged) | Dustwind, Riverspill, Stonewood | Steppe, River, Woodland |
| Framekit demo game | Ember Line, Ember Ward, Ember Shell, Ember Portal, Stonebound | Fire Line, Fire Ward, Beetle Shell, Fire Portal, Cannot Be Moved |
| World preview splash | Cairnreach | Cairn Ridge |
| Account creator house names | Vaelmont, Druskane, Morvayne, Thornholt, Caldrest, Veyrane, Oakhart, Greyford, Stillbrook | Thornton, Calder, Oakley, Grayson, Stillman, Fletcher, Mason, Weaver, Cooper (real surnames; Ashford, Blackwell, Marlowe kept) |
| Spell lattice descriptions | "a radiant ward of dancing embers", "a regenerating lifestream within the veins", "a creeping curse of numbness" | "a ring of fire that shields you", "life regeneration", "a slowing curse" |

## Item lore in the inventory (verdigris-pack.js, vesselforge.js)

| Old | New |
|---|---|
| Random rare names from Grim/Sable/Ashen/Reed/Ember/Frost/Dusk/Copper/Thorn/Vesper + Whisper/Ward/Bite/Song/Pledge/Shard/Gloam/Tithe (e.g. "Ember Ward") | Removed: items are named by material and form |
| Awakened names "<Name>'s <Dawnlit/Nine-Veiled/...> <Vigil/Riddle/...>" | "<Name>'s <material> <form>" |
| "Bound to X through N trials. It has learned to hunger." | "Awakened by X after N uses." |
| Bond mods: The Blood Price, Battle Rhythm, Read the Wound, The Shieldwall, Stand Your Ground, Old Grudge, Clear Mind, Harvest, Superstition, Dead Sprint, Sidestep, Second Wind | Life on Kill, Attack Speed after Kill, Critical Chance against Bleeding, Life on Block, Block while Stationary, Ward when Hit, Rite Power at High Spirit, Spirit on Kill, Curse Avoidance, Speed on Kill, Thrown Weapon Avoidance, Life Regeneration while Moving |
| Powers: Echoing Kill, Last Stand, Twinned Voice ("rites ... speak twice"), Untraceable | Plain effect text, no names |
| Trophy bonuses: Charge, Pack Sense, Undertow, Cinder Skin, Grandmother's Rite | Plain effect text ("Attackers take Fire damage", "Your rites Chill their targets") |
| Panoply: "your awakened relics hum together", "a saga made solid" | "+10% to the bond values of your awakened items", "awakened powers trigger 25% more often" |
| Encounters: Delaford weir, toll-reeves of Verdigris, river-haunt, barrow-wolves, canal-witch, drowned stair by rushlight, tusked alderbeast | "held a shield line", "outran pursuers", "drove off a water spirit", "killed a wolf pack", "bargained with a witch", "explored a flooded stairway", "killed a large tusked beast" |
| Firing: "The kiln favors it — the X runs and sets as Y", "The kiln bites", "The kiln keeps it", "The kiln is silent" | "Firing succeeded: X became Y", "Firing failed: one slot is scarred", "Firing failed: the X breaks", "Firing had no effect" |
| "The vault opens on the Green Lands. Sear Brands, grow Bonds, bind Trophies — the vessel remembers all three." | "Add brands, grow bonds and bind trophies on your items." |

## Kept on purpose

- Literal objects and places: ember particles and the owner's ember-in-a-bowl concept,
  River Pearl, river gorges, lime kilns, Kiln circle (a circle of kilns).
- Real English words and Path of Exile terms: Waystone, Keystone, windward, stonework.
- The protected inventory image-generation prompt still says "War-call" (`AGENTS.md`
  protects that prompt); it is not shown to players.
- Lore pools that are a design question rather than a naming fix: the House Creator's
  mottos, origins, epitaphs and zones (The Pale Rift, The Hollow King), the splash's region
  names, and the framekit demo game's flavour lines. Owner rule of September 16: "do not
  invent lore and 'branding', generic only"; awaiting a decision on removing them.
