# Term purge proposals (WIZARD + ARPG), 2026-11-08

Rule: keep only (a) owner-introduced, (b) plain English description of what it does, (c) standard PoE1/PoE2 term in the same meaning. Machine-readable file: `term-proposals.json` (same folder), keyed by lowercase term or phrase; ambiguous bare words carry a qualifier in the key, e.g. `hunt (bond family)`, with the exact text in `surface`.

Code read: WIZARD worktree `wizard-item-zones/main` at HEAD 0bcb5fb (it also has uncommitted rename edits from another session; evidence cites committed text where they differ) and ARPG `Unity-vocab` at 507f48df.

## Counts

- Entries: 675. Keep 364, purge 311.
- Scope 1 (unreviewed game/label terms): 496 in inventory; 135 skipped as Spellforge-only (every listed file under tools/spellforge or the ARPG spellforge-catalog.json copy); 361 decided here: keep 307, purge 54. Most scope-1 keeps are hex colours, code tokens, real excavation sites and ordinary words.
- Scope 2-3 (dictionary words used as invented names; coined doc names) plus the decisions recorded as given: 314 entries, purge 257.
- By origin: agent-invented 307, technical 121, plain 104, real-world 82, owner 50, poe 6, other-game 5
- By origin and verdict: agent-invented/purge 307, other-game/keep 2, other-game/purge 3, owner/keep 50, plain/keep 104, poe/keep 5, poe/purge 1, real-world/keep 82, technical/keep 121

Not re-audited: the 189 inventory terms auto-tagged `poe`. Only Spirit, Guard, Energy Shield (shown as a Ward charge), Omen, Awakened and Waystone were checked for a different meaning.

## Purge list by category

### resource (2)

Patience → (remove); Spirit → Mana

### stat (8)

Goods → Item Rarity; Goods Found → Item Rarity; Guard → Armour; Presence → (remove); Reach → Melee Strike Range; VIT → Life; VITAE → LIFE; Vitality → Life

### mechanic (30)

archetype → class; Attunement → Bond XP; awaken → upgrade to rare; Awakened → Rare; Awakening → (remove); Breach → Surrounded Kills; deed → bond XP source; deepen → Upgrade; Efface → Remove Brand; Effaced → Removed; encounters → (remove); Energy Shield → Ward Charge; estranged → (remove); Fire the kiln → (remove); Firing → (remove); Holy Fire → Fire Damage Aura; Holy Freeze → Cold Damage Aura; Holy Shock → Lightning Damage Aura; Hunt → Rare Kills; Kinship → (remove); Lineage → (remove); memory → bond; Panoply → Set bonus; scar → locked slot; Sear → Add Brand; sever → Remove; Trophy → animal part; vessel slot → modifier slot; Vesselforge → Inventory and Item Crafting; Vigil → Ward Blocks

### theme (27)

Aegis → Sustaining; Akashic → Source; blood → Bleed; Butcher → (remove); Ember → Fire; Flesh → Body; fortune → item rarity; Gale → Air; Genesis → Creative; Gloam → Chaos; Granite → Earth; Guard → (remove); Kilnfathers → (remove); of the Self → Inner; of the World → Outer; Psyche → Mind; Pyre → Fire; River → Cold; Ruinous → Destructive; Scout → (remove); Seer → (remove); Soul → Self; Spirit → Mana; Storm → Lightning; Tide → Water; Verdant → Natural; Vile → Adversarial

### currency (18)

Bird Omen → Guaranteed Speed Brand; Blood Omen → Guaranteed Bleed Brand; Chisel → Add Modifier Slot; Chronicle Draught → (remove); Clay → Reroll Values; Effacing Stone → Remove Last Brand; Entrail Omen → Guaranteed Ward Brand; Marsh Ochre → Yellow Ochre; Omen → Upgrade to Rare; omens → guaranteed-tag brands; Orb of Resonance → Upgrade Bond; Scraper → Remove Last Modifier; Searing → Add; Searing Ash → Add Modifier; Searing Sigil → Add Brand; Smoke Omen → Guaranteed Mana Brand; Sundering Knife → Remove Bond; Vessel Chisel → Add Modifier Slot

### creature (21)

Bozo the Lost → (remove); Buffoon McStumble → (remove); Custodian of the Ninth Circle → Boss; Flying Terror → Flying Demon; Ghoul → (remove); Giggles → (remove); Gilded Adder → Snake; Glutton Demon → Heavy Demon; Goblin Skirmisher → (remove); Jester of Ruin → (remove); Kobold Scavenger → (remove); Lindwurm → Great Serpent; Night Demon → Gaunt Demon; Pale Seraph → (remove); Rift Stalker → (remove); The Hollow King → (remove); The Unhallowed → (remove); The Unworthy → (remove); Vault Husk → Skeleton; Warden of Chains → Chained Guard; Wight → (remove)

### item/base (11)

Azrael's Unbroken Vigil → (remove); Crest → Cap; Hunt Trophy → Animal Part; of the Breach / of the Vigil / of the Hunt → (remove); Raven Quill → (remove); Readied rig → Tool Slot; Riveted Mail → (remove); Rivetmail → (remove); saga → seeded; skymetal → Meteoric iron; Spoil → Animal Part

### mod (20)

Dusk Gloam → (remove); Ember Tithe → Added Fire Damage; Ember Ward → (remove); Flint Lopper → Two-handed Flint Axe; Once a day, reroll one omen → (remove); Property → Modifier; River Stone → Cold Resistance; Second Wind → Life Regeneration while Moving; Sidestep → Avoided; Sign of the River → Mark Chilled Enemies; Sign of the Storm → Double Shock Stacks; Slain enemies have a 15% chance to drop double spoils. → (remove); Spell Power → Spell Damage; Spell Power at High Spirit → Spell Damage at High Mana; Spirit on Kill → Mana on Kill; Storm Line → Projectile Damage; Strikes keep foes at reach → (remove); The Blood Price → Life on Kill; The Shieldwall → Life on Block; You cannot be surprised → (remove)

### node (47)

Aether Spindle Keystone → (remove); Anchor → Pattern Node; Bulwark → (remove); Celestial Edge Keystone → (remove); Chord → (remove); DEX Anchor → DEX Pattern Node; DEX/STR Anchor → DEX/STR Pattern Node; Ecliptic Archive Keystone → (remove); evocative two-to-four word phrases → names that state the effect; Flowstep → (remove); Fractal Bastion Keystone → (remove); Genesis Ward → (remove); Helios Anchor Keystone → (remove); Hexafoil Apex Keystone → (remove); Infusion → (remove); INT Anchor → INT Pattern Node; INT/DEX Anchor → INT/DEX Pattern Node; Lattice Savant → (remove); Lumen → (remove); Myriad Bloom Keystone → (remove); Mythic capstones → (remove); Noctilux Prism Keystone → (remove); Oath of the Front Line → Ally Protection; Petal Vanguard → (remove); Petal Vanguard → (remove); Prime Seed Nexus → (remove); Prism → (remove); Resonant → (remove); Seed Core → (remove); Sign → Keystone; Sign: Double Shock Stacks → Double Shock Stacks; Sign: Mark Chilled Enemies → Mark Chilled Enemies; Sign: Spreading Poison → Spreading Poison; Sign: Unending Ignites → Unending Ignites; Sign: Unstoppable → Unstoppable; Sign: Ward Under Fire → Ward Under Fire; Sirocco → (remove); Solar → (remove); Spell Damage at High Spirit → Spell Damage at High Mana; Spire Adept → (remove); Spire Adept → (remove); Spirit → Self; STR Anchor → STR Pattern Node; STR/INT Anchor → STR/INT Pattern Node; veil → tier; waystone → pattern node; Zephyr Crown Keystone → (remove)

### place (15)

Aster Vale → (remove); Choir → (remove); Crown of the Pale Court → (remove); Crown of Tides → (remove); Crownlands → Island; Dustwind → Steppe; Infernal → Volcanic; Millbrook Fields → (remove); Morrow Keys → (remove); Riverspill → Nile and Mesopotamia; Storm Shelf → (remove); The First House → House; The Lantern Isles → (remove); The Lower Vaults → Dungeon Level 2; The Sunken Archive → Dungeon Level 1

### UI (112)

Aberrant hybrid weave → Mixed-node spell; Abyssal → Difficulty 5; Aldric Thane → (remove); Aldric Thane → (remove); Amazuk → Test Character 1; Ancestral Arms → (remove); Ashford → (remove); Astral Plate → (remove); Atelier → Crafting Bench; Attune → (remove); Aurelius → (remove); Binding Sigil → (remove); Blackwell → (remove); Blight heptagram → (remove); Blood runes → (remove); Bone Fetish → Bone Charm; Bright Lantern → (remove); Calder → (remove); Cassia → Vendor; Chains the Living · Cannot Be Moved → Cannot Be Knocked Back; Charged runes → (remove); Chronicle → Log; Close Atelier → Close Crafting Bench; Codex → Journal; Coil → Poison Bite; Cold Blood → (remove); Deep Archive → (remove); Delver → Difficulty 2; Doran → Vendor; Edmun Hale → (remove); Epitaph → (remove); Eternal Recurrence → (remove); Familiars → Companions; Fenn Oswic → (remove); Fenn Oswic → (remove); Grayson → (remove); Grimoire → Spells; Guiding Star → Mark Target; Harl → Armour Vendor; Harl · Armourmaster → Armour Vendor; Heptagram → (remove); House Arwa → Test House 1; House Motto → (remove); House Olwa → Test House 2; Ichor of the Void → (remove); Ignoring a voice that knows your name → (remove); Incantation → Spell name; Initiate → Difficulty 1; Interred with ${char.name}; returned to the world. → (remove); Ishra → Test Character 3; Isolde Marr → (remove); Isolde Marr → (remove); It hungers as it works, corrupting whatever it touches. → (remove); Kaelen Dray → (remove); Kaelen Dray → (remove); Lysa Corveaux → (remove); Lysa Corveaux → (remove); Mark a foe. The web remembers. → (remove); Marlowe → (remove); Memento → History; Mirela → Vendor; Mirelle of the Fen → (remove); Mirelle of the Fen → (remove); Nameless → (remove); Noon Vigil → (remove); Oakley → (remove); Old Knowledge → (remove); Oracle Lens → (remove); Oracular → Difficulty 6; Oral Tradition → (remove); Orun → Character; Pathfinder → Difficulty 3; Petra Quill → (remove); Radiance → Fire Nova; Rage runes → (remove); Reagent Ledger → Reagents; Remembered → (remove); Rooke Damaris → (remove); Rooke Damaris → (remove); Scavenged ${art} ... and ${copper} copper — anyone's tools → (remove); Seal the circle → Confirm; Seal the Pact → (remove); Sealed Oath → (remove); Sera Voss → (remove); Sera Voss → (remove); Silent Archivist → Vendor; Silent Hourglass → (remove); Still Hour → Stop Time; Stillman → (remove); Storied → (remove); Storm Call → Lightning Strike; Stun stars → (remove); Survived to the fifth rank → (remove); Taru → Test Character 2; The archive opens after the first proof. → (remove); The Choir Below → (remove); the mold drinks it → (remove); Thornton → (remove); Tobias Crane → (remove); Triumph → Damage Buff; Trophy Fragments → (remove); Undying → (remove); Venture → Simulate Fight; Venture Forth → Simulate Fight; Verdant Draught → Life Flask; Warden → Difficulty 4; Warden of the Verdant Seal → Boss; Whispered Heresies → (remove); Whispers of the Dead → (remove); Wiping the blade clean → (remove); Wren Calloway → (remove); Wren Calloway → (remove)

## Invented mechanics flagged

What each does in code, or that it does nothing. Names are kept or purged separately above.

- **skilltree-content.json names**: Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone and class names are invented.
- **Animal Parts Pack**: Class-gated extra pack; also unlocks a lattice row (Weaving.cs:137 spoils_pack). Agent design, plain name.
- **archetype**: verdigris-pack.js archetypes; archetype adds +1 weight to its theme on every deed and drives kinship (vesselforge.js). Owner never asked for archetypes; ARPG uses STR/DEX/INT classes.
- **Awakened**: WIZARD: three tier-III bonds awaken an item into a named unique with a keystone power (vesselforge.js awakenItem). ARPG: awakened == rare (Itemization.cs:286 RarityOf). PoE "Awakened" means awakened support gems; different meaning.
- **Azrael's Unbroken Vigil**: Awakening: an item with three tier-III bonds takes a generated name from its bearer, a keystone power and flavour text (vesselforge.js awakenItem; README "Awakening"). Owner never asked for it.
- **Chronicle Draught**: Currency granting a full attunement threshold at the bench (README Currencies). Agent addition; owner: "definetely no potions like d2".
- **Curio**: Item kind with no implicit and no modifier slots (verdigris-pack.js forms.curio noVessel); ARPG seats it in the War Horn seat and grants a "second curio" unlock. No owner request found.
- **encounters**: verdigris-pack.js encounters: flavour lines ("drove off a water spirit", "bargained with a witch", "crossed a mountain pass in an ash storm") that assign bond themes. Remove the flavour; bond XP should come from real play (ARPG uses kills/blocks).
- **Extra Focus**: Auxiliary INT slot (attendant): unlocks a second focus seat; no owner request found (InventoryAuxiliary.cs:19).
- **Fire the kiln**: Material-ascension gamble: 2 patience, outcomes ascend 40 / scar 30 / silent 20 / shatter 10 (verdigris-pack.js settings.fireOutcomes; vesselforge.js:284 fire). Owner never asked for it.
- **Goods Found**: Does nothing: goods_find is summed into the sheet (verdigris-stats.js:365) but no loot code reads it in WIZARD or the ARPG (grep goods_find / fortune: ARPG 0 files).
- **Hunt Trophy**: Trophies: fragments collected from fights complete into a socketable item with a completion bonus (vesselforge.js addFragment; README "fragment → fetish → completion bonus", TQ/GD homage). Agent addition.
- **Kinship**: Bonds carry the shaper's archetype and work at half strength for a different archetype (vesselforge.js:84 estrangedFactor 0.5, :117-122 isEstranged). Agent addition.
- **Lineage**: Inheritance: "When a bearer falls, awakened relics and the most-storied memento pass to the heir — estranged, unless the heir walks the same path" (rpg_inventory/index.html:2398). Agent addition.
- **Nameless**: Default bearer name used when awakening names an item (vesselforge.js).
- **Once a day, reroll one omen**: Knucklebone completion bonus refers to omens and a daily timer that no code implements (shape "grant").
- **Panoply**: Player-authored sets: "Panoply (2): +10% to the bond values of your awakened items", "(3): awakened powers trigger 25% more often" (verdigris-pack.js panoply). Agent addition; depends on awakening.
- **Patience**: Invented crafting budget: each item rolls patience from its material (verdigris-pack.js materials.*.patience) and every sear/efface/chisel/fire spends it (vesselforge.js:244 spendPatience). ARPG Itemization.cs:317: "Patience [is] not implemented". Owner asked for PoE-like rarity steps, not a per-item budget.
- **Pigment**: Pigments reweight which brand tags a sear rolls (vesselforge.js:213, PoE Fossil-like). Agent addition; the pigment names are real materials so they pass as names, but the mechanic was never requested.
- **scar**: Scarred slots are permanently unusable after a bond is removed (vesselforge.js usedSlots + item.scars); fire() outcome "scar". Agent addition.
- **Sign**: Signs are "birthsign keystones, exactly one per life" (geometric_skilltree README:15,163); the one-only limit is enforced in index.html:3142-3193 ("You can have only one Sign: refund it first"). Elder-Scrolls idea, never asked for by the owner; PoE keystones have no such limit.
- **Slain enemies have a 15% chance to drop double spoils.**: Awakened theme power text; only meaningful with awakening.
- **Strikes keep foes at reach**: Spear implicit with stat null: does nothing (verdigris-pack.js forms.spear).
- **Sundering Knife**: Severing a bond leaves the slot permanently "scarred" (README table; vesselforge.js usedSlots counts item.scars). Scarring is an agent addition.
- **Tool Slot**: Auxiliary DEX seat (quickRig); only layout code reads it (InventoryAuxiliary.cs:18, InventoryLayout.cs:33).
- **Venture Forth**: Demo loop: a button rolls a random text encounter, gold, XP, loot and bond themes (rpg_inventory/index.html:2112 ventureForth; verdigris-pack.js encounters). Agent addition with flavour text.
- **Vessel Chisel**: Currency that carves an extra slot (max 6) for 2 patience (vesselforge.js:274 chisel). Agent addition.
- **War Horn**: Auxiliary STR seat (warcall) for horns/curios; no owner request found (InventoryAuxiliary.cs:17).
- **You cannot be surprised**: Wolf Fang completion bonus; "surprised" is not a mechanic anywhere in WIZARD or the ARPG (does nothing).

## Notes

- Replacements follow the ARPG's existing plain style ("Refund Currency"), so crafting currencies get function names ("Add Modifier", "Reroll Values", "Remove Last Modifier", "Upgrade to Rare"). Their PoE equivalents are given in `evidence` if the owner prefers PoE names.
- Dead data: `tools/geometric_skilltree/assets/skilltree-content.json` is not loaded by anything. Its keystone and class names are listed as purges with `after: null` (delete the file).
- Docs that still teach the banned style: geometric_skilltree/NORTH-STAR.md:121-122 ("Node names are evocative two-to-four word phrases", "Oath of the Front Line"), and the culture list (Kilnfathers and others) in NORTH-STAR.md and the jewels.js saga ids.
- Owner names kept despite the screen: Root Ball (owner said "root ball and the looper"; ARPG shows "Root Club"), Hammered Iron and Reliquary (open owner questions, rule 12).
- Assumption: invented content in the side tools (rp_account_creator, gui_framekit/game demo, verdigris_splash, sokoban) is in scope because the inventory lists it. Their presets and flavour lines get `after: null`. Placeholders are only proposed where a label is needed.
- Pigment names (Red Ochre, Woad, Soot) and trophy parts (Boar Tusk, Wolf Fang, River Pearl) are real materials and stay as names. Their mechanics (tag reweighting, fragment completion) are flagged above.
