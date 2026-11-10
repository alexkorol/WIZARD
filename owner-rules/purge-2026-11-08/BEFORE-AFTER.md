# Vocabulary purge: before → after (2026-11-08)

Owner, verbatim: "I'm noticing a lot of remaining made up stuff. 'Spirit' and 'blood' in wizards. I need a thorough purge".

Rule: a term stays only if (a) the owner introduced it, (b) it is plain English for what it does, or (c) it is the standard PoE1/PoE2 term in the same meaning. Everything else is renamed plainly or removed; flavour text is removed unless the owner wrote it. Every line below is vetoable.

Sources: owner-rules/rename-map.json (the map both repositories apply), purge-2026-11-08/spellforge-renames.tsv and side-tools-renames.tsv (full per-tool lists), TERM-INVENTORY.md (every term with origin and verdict), GLOSSARY.md (the closed list the lint enforces).

## Resources and stats

- Spirit → Mana  (owner 2026-11-08: 'Spirit' is made up; PoE1 Mana is the resource every skill spends (owner: 'the health and mana orb'). Stat id spirit_flat stays.)
- Maximum Spirit → Maximum Mana
- spirit → mana  (lowercase game text)
- Guard → Armour  (Guard named the STR defence; PoE's term is Armour (PoE2 Guard is a temporary buff, a different meaning). Stat ids guard_flat/guard_increased stay.)
- Guard Break Aura → Armour Break Aura
- Guard break → Armour break

## Spells, auras and skills

- Rite Focus socket → spell focus socket
- Rite Focus → Spell Focus
- Rite foci → Spell foci
- Rite Damage → Spell Damage
- Rite damage → Spell damage
- Rite Speed → Cast Speed
- Rite speed → Cast speed
- Rite Power → Spell Power
- Rite Reroll → Spell Reroll
- Rites Cost Life → Spells Cost Life
- Efficient Rites → Efficient Spells
- Lingering Rites → Lingering Spells
- Cheaper Repeated Rites → Cheaper Repeated Spells
- Repeated Rites → Repeated Spells
- Chilling Rite → Chilling Spells
- Ward Counts as Rite → Ward Counts as a Spell
- standing rites → maintained spells
- Rites → Spells
- Rite → Spell
- rites → spells
- rite → spell
- Clear Mind → Spell Damage at High Mana
- Claw chain → Claw combo
- Jawbone chain → Jawbone combo
- Traveling cut → Moving slash
- Held spin → Channelled spin
- Reaping sweep → Bleeding sweep
- Flint Lopper → Two-handed Flint Axe
- Root Ball → Root Club
- Bone Spikes → Bone Claws
- Might → Damage Aura
- Fanaticism → Attack Speed Aura  (+20% attack speed. Display only (SpellRules.DisplayName / ActionPresentation); the preset and id keep the old spelling as keys for VFX, aura gameplay and saves)
- Conviction → Armour Break Aura
- Holy Fire → Fire Damage Aura
- Holy Freeze → Cold Damage Aura
- Holy Shock → Lightning Damage Aura
- Wrath → Spell Damage and Lightning Aura
- Malevolence → Spell Damage and Chaos Aura
- Thorns → Reflect Damage Aura
- Shrine Blessing → Resistance Bonus
- Blade Vortex → Spinning Blades
- Frozen Orb → Slow Cold Orb
- Energy Shield → Ward Charge  (+1 Ward charge. Display only (SpellRules.DisplayName / ActionPresentation); the preset and id keep the old spelling as keys for VFX, aura gameplay and saves)
- Arcane Ward → Long Ward Charge
- Jawbone combo → Jawbone Weapon Combo
- Spell Damage at High Spirit → Spell Damage at High Mana

## Classes, wedges and tree labels

- Archmage Waystone → INT Anchor
- Archmage Gate → INT Gate
- Archmage milestone → INT class node
- the Archmage class → the INT class
- Archmage class → INT class
- Archmage → INT Class  (tree node name, class display, test literal; CLASS_UNLOCKS keys follow)
- Assassin Waystone → INT/DEX Anchor
- Assassin Gate → INT/DEX Gate
- Assassin milestone → INT/DEX class node
- the Assassin class → the INT/DEX class
- Assassin class → INT/DEX class
- Assassin → INT/DEX Class  (tree node name, class display, test literal; CLASS_UNLOCKS keys follow)
- Nightblade Waystone → INT/DEX Anchor
- Nightblade Gate → INT/DEX Gate
- Nightblade milestone → INT/DEX class node
- the Nightblade class → the INT/DEX class
- Nightblade class → INT/DEX class
- Nightblade → INT/DEX Class  (tree node name, class display, test literal; CLASS_UNLOCKS keys follow)
- Acrobat Waystone → DEX Anchor
- Acrobat Gate → DEX Gate
- Acrobat milestone → DEX class node
- the Acrobat class → the DEX class
- Acrobat class → DEX class
- Acrobat → DEX Class  (tree node name, class display, test literal; CLASS_UNLOCKS keys follow)
- Reaver Waystone → DEX/STR Anchor
- Reaver Gate → DEX/STR Gate
- Reaver milestone → DEX/STR class node
- the Reaver class → the DEX/STR class
- Reaver class → DEX/STR class
- Reaver → DEX/STR Class  (tree node name, class display, test literal; CLASS_UNLOCKS keys follow)
- Champion Waystone → STR Anchor
- Champion Gate → STR Gate
- Champion milestone → STR class node
- the Champion class → the STR class
- Champion class → STR class
- Champion → STR Class  (tree node name, class display, test literal; CLASS_UNLOCKS keys follow)
- Ritualist Waystone → STR/INT Anchor
- Ritualist Gate → STR/INT Gate
- Ritualist milestone → STR/INT class node
- the Ritualist class → the STR/INT class
- Ritualist class → STR/INT class
- Ritualist → STR/INT Class  (tree node name, class display, test literal; CLASS_UNLOCKS keys follow)
- Archmage/Ritualist → INT or STR/INT
- Archmage or Ritualist → INT or STR/INT
- The Kiln Line → the fire and ignite wedge (STR toward STR/INT)
- Kiln Line → fire and ignite wedge (STR toward STR/INT)
- The Procession → the companion and Ward wedge (INT toward STR/INT)
- Procession → companion and Ward wedge (INT toward STR/INT)
- The Drowned Study → the cold and marks wedge (INT toward INT/DEX)
- Drowned Study → cold and marks wedge (INT toward INT/DEX)
- The Unlit Road → the poison and traps wedge (DEX toward INT/DEX)
- Unlit Road → poison and traps wedge (DEX toward INT/DEX)
- The High Paths → the projectile and shock wedge (DEX toward DEX/STR)
- High Paths → projectile and shock wedge (DEX toward DEX/STR)
- The Red Field → the physical and bleed wedge (STR toward DEX/STR)
- Red Field → physical and bleed wedge (STR toward DEX/STR)
- Nightwork → INT/DEX spoke
- Skirmisher → DEX/STR spoke
- Unseen Passage → Pass Unnoticed
- Strike the Unhurt → Damage Before Being Hurt
- Loop Crowns → Closed Loops
- Unchosen Arc → No Option Chosen
- Redundant Circuit → Redundant Links
- Straight Axis Chain → Straight Axis Path
- Bronze Route → STR path
- Quickstep Trace → DEX path
- Memory Thread → INT path
- Braided Span → Hybrid path
- Waystones → Anchors
- Waystone → Anchor
- ember cup → off-hand focus
- Element row → Damage type row
- Focus row → Effect row
- Alignment row → Intent row
- Sphere row → Target row
- Reach row → Range row
- Element → Damage type  (lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename)
- Focus → Effect  (lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename)
- Alignment → Intent  (lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename)
- Sphere → Target  (lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename)
- Reach → Range  (lattice row label only (ArpgLatticePane LatticeRows and missing-row list); not a global rename)
- Champion → STR class  (prose form (exact string values use the entry above))
- Acrobat → DEX class  (prose form (exact string values use the entry above))
- Archmage → INT class  (prose form (exact string values use the entry above))
- Reaver → DEX/STR class  (prose form (exact string values use the entry above))
- Nightblade → INT/DEX class  (prose form (exact string values use the entry above))
- Assassin → INT/DEX class  (prose form (exact string values use the entry above))
- Ritualist → STR/INT class  (prose form (exact string values use the entry above))
- Kilnfathers → (removed)

## Packs, slots and crafting

- the Quick Rig window — an extra tool slot → the extra tool slot
- the Attendant window — an extra focus slot → an extra focus slot
- the Preparation Case — a 4×4 pack → the supply pack (4×4)
- the Spoils Roll — a 4×4 pack → the animal parts pack (4×4)
- the Reliquary — a 4×4 pack → the relic pack (4×4)
- Quick Rig window → tool slot
- Quick Rigs → Tool-slot items
- Quick Rig → Tool slot
- quick rig → tool slot
- Attendant focus → extra focus
- Attendant Orb → Extra Focus
- Attendant seat → extra focus slot
- Attendant window → extra focus slot
- attendant focus → extra focus
- attendant window → extra focus slot
- Attendants → Extra foci
- Attendant → Extra focus
- War-calls → war horns
- War-call → War Horn
- war-call → war horn
- Warcall → War Horn
- Spoils Roll → Animal Parts Pack
- spoils roll → animal parts pack
- Spoils on Kill → Animal Parts on Kill
- Extra Beast Spoils → Extra Animal Parts
- Spoils cannot be sold → Animal parts cannot be sold
- leave a spoil → leave an animal part
- one extra spoil → one extra animal part
- Trophy Attributes → Animal Part Attributes
- Trophy Mastery → Animal Parts Mastery
- Every trophy in your → Every animal part in your
- Preparation Case → Supply Pack
- preparation case → supply pack
- Preserved Preparations → Preserved Supplies
- Reliquary Object → Relic
- Lasting Relic Blessings → Lasting Relic Effects
- keep their blessings → keep their effects
- Reliquary → Relic pack
- reliquary → relic pack
- Reliquaries → relic packs
- Trophies → Animal Parts Pack  (gate passive name)
- Preparations → Supply Pack  (gate passive name)
- Relics → Relic Pack  (gate passive name)
- Attendant → Extra Focus Slot  (gate passive and window label)
- Quick Rig → Tool Slot  (gate passive and window label)
- Reliquary → Relic Pack  (window label)
- Spoils Roll → Animal Parts Pack  (window label)
- Preparation Case → Supply Pack  (window label)
- Spoils → Animal parts
- Preparations → Supplies
- Trophies → Animal parts
- Vesselforge & Inventory → Inventory and Item Crafting
- VesselForge → item crafting system
- Vesselforge → item crafting system
- Searing Sigil → Add Brand
- Effacing Stone → Remove Last Brand
- Orb of Resonance → Upgrade Bond
- Sundering Knife → Remove Bond
- Vessel Chisel → Add Modifier Slot
- Chronicle Draught → (removed: never implemented)
- Entrail Omen → Guaranteed Ward Brand
- Bird Omen → Guaranteed Speed Brand
- Smoke Omen → Guaranteed Mana Brand
- Blood Omen → Guaranteed Bleed Brand
- Searing Ash → Add Modifier
- Scraper → Remove Last Modifier
- Atelier → Crafting Bench
- Attunement → Bond XP
- attunement → bond XP
- Panoply → Set bonus
- Kinship → Class bond
- Hunt Trophy → Animal Part
- Marsh Ochre → Yellow Ochre
- Goods Found → Item Rarity
- Venture Forth → Simulate fight
- of the Breach → 
- of the Vigil → 
- of the Hunt → 

## Items and the art pipeline

- Skymetal → Meteoric iron
- Nightglass → Obsidian
- War-Helm → Helmet
- Warbelt → War belt
- Warshield → Shield
- Warspear → Spear
- Greathelm → Large helmet
- Slaughter → Kill Bonuses  (VesselForge bond theme name)
- Wayfaring → Movement  (VesselForge bond theme name)
- Warding → Block and Ward  (VesselForge bond theme name)
- Greataxe → Two-handed Axe  (item base name)
- Copper Reliquary → Copper Relic Box  (object noun: a reliquary is a medieval container; the period object is a relic box)
- Jade Reliquary → Jade Relic Box  (object noun: a reliquary is a medieval container; the period object is a relic box)
- Bone Reliquary → Bone Relic Box  (object noun: a reliquary is a medieval container; the period object is a relic box)
- Amber Reliquary → Amber Relic Box  (object noun: a reliquary is a medieval container; the period object is a relic box)
- reliquary box → relic box  (object noun: a reliquary is a medieval container; the period object is a relic box)
- reliquary casket → relic casket  (object noun: a reliquary is a medieval container; the period object is a relic box)
- reliquary coffer → relic coffer  (object noun: a reliquary is a medieval container; the period object is a relic box)
- copper-alloy reliquary → copper-alloy relic box  (object noun: a reliquary is a medieval container; the period object is a relic box)
- copper reliquary → copper relic box  (object noun: a reliquary is a medieval container; the period object is a relic box)
- war-call instrument → war horn  (object noun: a reliquary is a medieval container; the period object is a relic box)
- war-call item → war horn item  (object noun: a reliquary is a medieval container; the period object is a relic box)
- war-call readability → war horn readability  (object noun: a reliquary is a medieval container; the period object is a relic box)
- Slaughter → Kill Bonuses  (prose form (exact string values use the entry above))
- Warding → Block and Ward  (prose form (exact string values use the entry above))
- Wayfaring → Movement  (prose form (exact string values use the entry above))
- Horn Lamellar Panoply → Horn Lamellar Armour Set
- Orun → Test Character

## Creatures

- Lindwurm → Great Serpent
- Night Demon → Gaunt Demon
- Glutton Demon → Heavy Demon
- Flying Terror → Flying Demon

## Places and factions

- Dustwind → Steppe
- Riverspill → Egypt and Mesopotamia
- Stonewood → Mesoamerica and Northwest Coast
- Nile and Delta → Egypt and Mesopotamia
- Infernal → Volcanic

## Flavour sentences in the tree

- Road signs mean more to you than most (design text) → (removed)  (dropped: no mechanic stated)
- The crows remember who fed them (design text) → (removed)  (dropped: no mechanic stated)
- Enemies chase you uphill at their peril (design text) → (removed)  (dropped: no mechanic stated)
- You are hard to mark in the mist (design text) → (removed)  (dropped: no mechanic stated)
- Poison from this dose slows (design text) → Poison you inflict also slows (design text)  (plain restatement)
- Projectiles aimed at you drift in the wind (design text) → Enemy projectiles are less accurate against you (design text)  (plain restatement)
- Wither cannot cross the circle while you stand still (design text) → You cannot be Withered while standing still (design text)  (plain restatement)
- Your Bleeds close only when their victim falls (design text) → Your Bleeds last until the enemy dies (design text)  (plain restatement)
- Your Bleeds remember: reapplying restores full duration (design text) → Reapplying a Bleed restores its full duration (design text)  (plain restatement)
- Your hits shed light; the unlit cannot hide from you (design text) → Your hits reveal hidden enemies (design text)  (plain restatement)
- Once rung, your next rite Chills everything it touches (design text) → After you sound your horn, your next spell Chills everything it hits (design text)  (plain restatement)
- Marks you write cost no Spirit (design text) → Marks cost no Mana (design text)  (plain restatement)
- Your Evasion is 10% lower while you hold the line (design text) → Your Evasion is 10% lower while standing still (design text)  (plain restatement)
- You cannot Block while you keep this pace (design text) → You cannot Block while moving (design text)  (plain restatement)

## Spell Effects Lab (formerly Spellforge)

117 names renamed (full list: spellforge-renames.tsv); god and school names, lore source lines and flourish subtitles replaced by plain gameplay statements; ids and shaders unchanged. Examples:

- Inner Flame → Fire inside a body
- Hellfire Mortar → Lava trench with a magma mortar
- Frozen Ramparts → Ice-coated walls
- Metabolic Englaciation → Slowing cold wave
- Splinterfrost Shell → Ice barricade
- Condensation Shield → Floating ice shield
- Absolute Zero → Instant ice block
- Glaciate → Ice cone
- Vhi's Electric Charge → Lightning dash
- Orb of Electrocution → Ball lightning
- Brom's Barrelling Boulder → Rolling boulder
- Leda's Liquefaction → Ground turns to mud

## Side tools

433 edits (full list: side-tools-renames.tsv): gui_framekit 187, rp_account_creator 128, sokoban 79, verdigris_splash 35, cartographer 4. Sample character, house, NPC and place names removed or replaced with neutral placeholders; monsters, zones, items and abilities named plainly; all flavour lines removed.

## Flavour removed (examples)

- Item crafting: generated "<character>'s <item>" names and "Awakened by … after N uses"; death screen ("has fallen", "lost to the Green Lands", "the heir starts from bare hands"); encounter lines ("bargained with a witch", "drove off a water spirit"); log lines ("Sidestep — the blow finds only air", "Harvest — spirit flows back from the kill").
- Arcane Lattice tool: generated spell epithets (Akashic, Vile, Pyre, Psyche …) and moral asides ("It hungers as it works …"); titles now say what the spell does.
- Passive tree: four effect lines with no mechanic ("Road signs mean more to you than most", "The crows remember who fed them" …).

## Owner rulings of 2026-11-09, applied

Owner: crafting follows "the blueprint that PoE and PoE 2 laid out", adapted, with brands and bonds instead of prefixes and suffixes, as a temporary system tuned in playtest; "no pre-made set or unique items"; items tied to houses and found when a character permadies; "no runes and no hexagons and other stuff for auras"; "Just no iron for now"; riveted mail does not fit. Recorded as owner rules 12, 13 and 52. Spec: docs/CRAFTING-PROVISIONAL.md.

**Crafting and loot (WIZARD item crafting and the ARPG):**
- Crafting uses (was Patience) → removed
- Material upgrade gamble (was the kiln) → removed
- Locked slots (was scars) → removed
- Half-strength bonds for another class (was kinship) → removed
- Set bonus for upgraded items (was Panoply) → removed
- Automatic inheritance on death (was Lineage) → house recovery: everything a fallen character carried stays at the death site for later characters of the house (the ARPG already did this; WIZARD now matches)
- Pre-made Mana set (wand, buckler) and unique rod (ARPG) → no longer drop; saved pieces load as ordinary magic or rare items
- Upgraded item (three bonds at Bond III) → kept: the one way an item becomes special, named after the character who raised it
- Rarity → Normal / Magic / Rare as in PoE: Rare holds up to four modifiers, at most two brands and up to three bonds
- Currencies → Add Modifier (turns a Normal item Magic, or adds one modifier), Upgrade to Rare, Reroll Values, Remove Last Modifier; pigments and Guaranteed X Brand steer the brand
- Item Rarity (did nothing) → raises the share of Magic and Rare drops in WIZARD, and of magic drops in the ARPG

**Iron (rule 12):**
- Hammered Iron (skymetal) → retired with Riveted Mail; no drops, no upgrades into either; old saves still load
- Account creator → Hammered Iron and its tier-5 roll removed; Macuahuitl → Obsidian-edged Club, Crest → Cap
- Art pipeline → 72 iron, steel or glass targets set to `hold_owner_rule`; the validator rejects any such row under a generate action
- Spell Effects Lab and the ARPG effect catalog → iron and steel in effect names, tags and descriptions become metal (112 strings in WIZARD, 60 in the ARPG; ids and shaders unchanged)

**Auras (rule 13, ARPG aura-lab.json):**
- Blood runes → Ring; Charged runes → Charged rings; Heptagram → Ring; Blight heptagram → Blight ring; Hex ward → Ward ring; Frost lattice (hexagon grid) → Frost ring; Rage runes → Rage rings
- Rune, heptagram and hexagon-grid drawings → plain rings; the stun stars layer → removed

**Art-pipeline coinages (rule 7):**
- Ivory-Butt Broadblade → Ivory-Butt Bronze Dagger; Copper Forksword → Forked Copper Sword; Flange-Hilt Leafblade → Flange-Hilt Leaf Sword
- Clayweight Trigger Case → Clay Weight Trigger Case; Snareline Packet → Snare Packet; Blackline Trap Case → Dark Hide Trap Case
- Oxhide Bodyshield → Oxhide Body Shield; Turtleshell Shield → Turtle Shell Shield; Roundshield → Round Shield; Redglass Boss Shield → Red-Stud Boss Shield
- Feathered Warcrown → Feathered Crown; Nightglass-Inset Mirror → Obsidian-Inset Mirror; Meteoric Ringblade → Ring-Pommel Sword; Rhomphaia Greatblade → Rhomphaia
- Meteor-Cuff Footbags → Cuffed Foot Bags; Copper Greatclub → Copper Two-handed Club; Obsidian Shortblade → Obsidian Short Blade; Warbanner → War banner; Silkroad → Silk Road
- Arcane Lattice "Hyperdimensional Spellcrafter" → Spell Builder

**Other fixes:**
- Bondwright's Primer drawer quote (invented flavour) → removed; "Brands are seared…" → "Brands are crafted. Bonds grow from use."
- WIZARD checks that were failing → fixed: the dashboard module grid is back above the fold at 1280×800; identity checks look for "Systems Laboratory" (rule 47); a stale evidence anchor fixed

Still open as an owner choice (no rule settles it): which rarity, if any, earns a loot beam in the ARPG (beams only ever marked the removed set and unique drops).

## Kept because the owner introduced it

Ward, Mana ("health and mana orb"), brands and bonds, crafting and enchantments, flask/remedy, refund points, the spell lattice and its canon (Source, Manifestation, Body, Mind, Plane, Vessel, Tesseract, Schism, Paradigm Shift), weave, House, WIZARD. Evidence per term: GLOSSARY.md.

## Judgement calls to check

- The lattice node the owner's canon called "Spirit" is now "Self" (the owner named Spirit as made up). Saved weaves and states migrate.
- "Blood", "ember", "clay", "crest", "river", "storm", "guard" stay only as literal objects (hit spatter, embers in a fire, a clay liver model, a river pearl, a prison guard). The lint bans them as names of mechanics in game text.
- Root Club stays (the owner once wrote "root ball", but did not introduce it).
- Currencies follow the ARPG's plain style (Add Modifier …); the PoE names (Regal Orb, Divine Orb …) are noted in term-proposals.json if preferred.
- Era ruling applied 2026-11-09: Hammered Iron and Riveted Mail retired; Macuahuitl renamed Obsidian-edged Club.


## Where the check runs (2026-11-09)

- WIZARD: `node scripts/wizard-lab.mjs verify` runs `owner-rules/lint.mjs wizard` on every run (quick and full). The test wrapper `owner-rules/wizard.test.mjs` is removed.
- ARPG: the build script runs it. `SliceBuild.OwnerRules` runs `tools/sync-owner-rules.mjs --check` and `owner-rules/lint.mjs arpg` before every build (Build, BuildWindows, BuildBoth, BuildPreview) and refuses to build on any player-facing word outside GLOSSARY.md. This replaces Editor/OwnerRulesVerification.cs, which the deslop pass deletes with the test harness. On ARPG main since 0f140f74.
