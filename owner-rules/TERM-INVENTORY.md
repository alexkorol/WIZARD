# Term inventory (2026-11-08)

Every distinct player-facing term in WIZARD (all tools, tree, inventory, data, docs) and the ARPG (game text, data, UI, tooltips, item and mod text, tree): capitalised words, every word of a Title Case label or stat name, and watched mechanic words in any case. Machine-readable: TERM-INVENTORY.json. Built by owner-rules/term-inventory.mjs; verdicts in owner-rules/term-verdicts.json.

Rule: Keep a term only if (a) the owner introduced it, (b) it is a plain English description of what it does, or (c) it is the standard PoE1/PoE2 term used in the same meaning. Everything else is purged (renamed plainly, or removed with its mechanic if that mechanic was invented and does nothing). 'Spirit' and 'blood' were named by the owner as made up (2026-11-08).

Terms: 5187. Verdicts: keep 4687, purge 452, gone 48. Origins: plain 3971, real-world or technical (doc only) 280, spellforge 209, poe 193, technical 153, side tool 137, agent-invented 105, real-world 83, owner 54, other-game 2.

Columns: Before and Now are counts (WIZARD/ARPG) before and after the purge. Purged names that were multiword phrases are listed in RENAME-MAP.md and purge-2026-11-08/*.tsv.

## Purged or changed

| Term | Origin | After | Before | Now | Where (files) | Example | Evidence / note | Mechanic flag |
|---|---|---|---|---|---|---|---|---|
| aberrant | plain | no longer appears | 1/0 |  | 1: wizard:tools/arcane_lattice/index.html (1) | Aberrant hybrid weave | removed with the renames above |  |
| abilities | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Abilities repeat once with -40% damage | removed with the renames above |  |
| abomination | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Abomination | renamed or removed by the Spell Effects Lab pass |  |
| abyssal | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 20/8 |  | 5: wizard:tools/spellforge/index.html (8); wizard:tools/spellforge/catalog.json (8) | Abyssal | renamed or removed by the Spell Effects Lab pass |  |
| accepts | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/character.js (1) | Accepts most things | renamed or removed in the side-tool pass |  |
| adept | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Spire Adept | removed with the renames above |  |
| aegis | side tool | see purge-2026-11-08/side-tools-renames.tsv | 3/0 |  | 3: wizard:tools/arcane_lattice/index.html (1); wizard:tools/gui_framekit/game/core.js (1) | Aegis | renamed or removed in the side-tool pass |  |
| aether | agent-invented |  | 3/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (3) | Aether | Coined keystone/class name in skilltree-content.json; not owner, not PoE, not a description. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| akashic | agent-invented | Source | 1/0 |  | 1: wizard:tools/arcane_lattice/index.html (1) | Akashic | arcane_lattice/index.html FLAVOR table: generated-spell name word for the Source node ("Akashic"). Theosophy term, invented flavour; name the spell by its node. |  |
| aldric | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Aldric Thane | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| alembic | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Alistair's Walking Alembic | renamed or removed by the Spell Effects Lab pass |  |
| alistair | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Alistair's Walking Alembic | renamed or removed by the Spell Effects Lab pass |  |
| already | plain | no longer appears | 1/0 |  | 1: wizard:tools/rpg_inventory/core/vesselforge.js (1) | Already bears this trophy | removed with the renames above |  |
| amazuk | agent-invented | Test Character 1 | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Runtime/ArpgPlaytestAccount.cs (1) | Amazuk | Invented name. Scripts/Runtime/ArpgPlaytestAccount.cs seeds the playtest/QA account with these invented house and character names. |  |
| ancestral | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Ancestral Arms | renamed or removed in the side-tool pass |  |
| angels | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (1) | Choir of Angels | renamed or removed by the Spell Effects Lab pass |  |
| apex | plain | no longer appears | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Hexafoil Apex Keystone | removed with the renames above |  |
| appendage | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Beastly Appendage | renamed or removed by the Spell Effects Lab pass |  |
| architect | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Celestial Architect | removed with the renames above |  |
| archivist | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/world.js (1) | Silent Archivist | renamed or removed in the side-tool pass |  |
| arithmetic | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/NORTH-STAR.md (1) | the existing register ("Oath of the Front Line", "Blue Arithmetic"). C | removed with the renames above |  |
| armourmaster | agent-invented | Armour Vendor | 2/0 |  | 2: wizard:tools/gui_framekit/game/index.html (1); wizard:tools/gui_framekit/game/world.js (1) | Harl · Armourmaster  Harl's stock     Your offer  Select a pack item t | tools/gui_framekit/game (UI demo) world.js/pane-content.js invented NPC names. "Armourmaster" is also a coined compound (rule 7). |  |
| arrive | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/world.js (1) | Arrive like a warning. | renamed or removed in the side-tool pass |  |
| artefact | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Artefact | renamed or removed by the Spell Effects Lab pass |  |
| arterial | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Arterial | renamed or removed by the Spell Effects Lab pass |  |
| arwa | agent-invented | Test House 1 | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Runtime/ArpgPlaytestAccount.cs (1) | House Arwa | Invented name. Scripts/Runtime/ArpgPlaytestAccount.cs seeds the playtest/QA account with these invented house and character names. |  |
| ashenzari | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Ashenzari | renamed or removed by the Spell Effects Lab pass |  |
| ashford | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Ashford | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| asked | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Asked the wrong question in the right place. | renamed or removed in the side-tool pass |  |
| aster | side tool | see purge-2026-11-08/side-tools-renames.tsv | 3/0 |  | 1: wizard:tools/verdigris_splash/app.js (3) | Aster Vale | renamed or removed in the side-tool pass |  |
| atelier | agent-invented | Crafting Bench | 6/0 |  | 2: wizard:tools/rpg_inventory/index.html (3); wizard:tools/rpg_inventory/README.md (3) | · craft at the Atelier | rpg_inventory/index.html "craft at the Atelier", "Close Atelier"; PoE term Crafting Bench. |  |
| attempts | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | (0.35 trunk) Attempts to soothe a hostile creature so it turns neutral | renamed or removed by the Spell Effects Lab pass |  |
| attune | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 2: wizard:tools/gui_framekit/components/overlays/menu/demo.html (1); wizard:tools/gui_framekit/demo/showcase.html (1) | Attune | renamed or removed in the side-tool pass |  |
| attunement | agent-invented | Bond XP | 10/0 |  | 6: wizard:tools/rpg_inventory/README.md (5); wizard:tools/gui_framekit/base/demo.html (1) | mana := circle.charge * focus.attunement | rpg_inventory/index.html label "Attunement"; README "attunement thresholds"; it is the item-local XP the owner described for bonds. |  |
| aurelius | agent-invented |  | 2/0 |  | 2: wizard:tools/gui_framekit/game/pane-content.js (1); wizard:tools/gui_framekit/game/world.js (1) | <img src="assets/med_cherub2.png" alt="Aurelius"><div><span>${equipped | pane-content.js companion name with "Ceremonial effects active". |  |
| awaken | agent-invented | upgrade to rare | 1/0 | 1/0 | 1: wizard:tools/rpg_inventory/README.md (1) | items through the deeds their bearer performs. Saturated items **Awake | See "awakened". |  |
| awakened | agent-invented | Rare / Upgraded | 22/2 | 16/0 | 7: wizard:tools/rpg_inventory/core/GENERATION-PLAN.md (4); wizard:tools/rpg_inventory/README.md (3) | awakened | PoE Awakened means awakened gems; here it named a rare (ARPG) or an upgraded item (WIZARD) | WIZARD: three tier-III bonds awaken an item into a named unique with a keystone power (vesselforge.js awakenItem). ARPG: awakened == rare (Itemization.cs:286 Ra |
| awakening | agent-invented |  | 5/0 | 5/0 | 3: wizard:tools/rpg_inventory/DESIGN.md (3); wizard:tools/rpg_inventory/README.md (1) | kinship/estrangement, tier I–III, awakening at 3×III), now engine-modu | README section "Awakening". | See "awakened" (WIZARD named-unique mechanic, agent addition). |
| azrael | agent-invented |  | 7/0 | 1/0 | 1: wizard:tools/rpg_inventory/core/README.md (1) | const c = forge.createCharacter({ name: 'Azrael', archetype: 'shieldbe | Example generated unique name "Azrael's Unbroken Vigil" (rpg_inventory/index.html, item.html, core/README.md). | Awakening: an item with three tier-III bonds takes a generated name from its bearer, a keystone power and flavour text (vesselforge.js awakenItem; README "Awake |
| balefire | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/3 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Balefire | renamed or removed by the Spell Effects Lab pass |  |
| barely | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Barely bent | renamed or removed by the Spell Effects Lab pass |  |
| barrelling | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/0 |  | 1: wizard:tools/spellforge/index.html (4) | Brom's Barrelling Boulder | renamed or removed by the Spell Effects Lab pass |  |
| bastion | plain | no longer appears | 3/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (3) | {focusTitle} Bastion | removed with the renames above |  |
| bazaar | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Bazaar | renamed or removed by the Spell Effects Lab pass |  |
| beastly | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Beastly Appendage | renamed or removed by the Spell Effects Lab pass |  |
| below | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | The Choir Below | renamed or removed in the side-tool pass |  |
| beogh | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Beogh | renamed or removed by the Spell Effects Lab pass |  |
| blackwell | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Blackwell | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| blazerip | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Blazerip | renamed or removed by the Spell Effects Lab pass |  |
| bloodbath | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Bloodbath | renamed or removed by the Spell Effects Lab pass |  |
| bloodbound | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Bloodbound | renamed or removed by the Spell Effects Lab pass |  |
| bloodfire | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Bloodfire | renamed or removed by the Spell Effects Lab pass |  |
| bloodflame | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Bloodflame | renamed or removed by the Spell Effects Lab pass |  |
| bloodless | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/3 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Bloodless | renamed or removed by the Spell Effects Lab pass |  |
| blooming | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Night-blooming | renamed or removed by the Spell Effects Lab pass |  |
| boiling | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Boiling Blood | renamed or removed by the Spell Effects Lab pass |  |
| borgnjor | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | One-time gift granting knowledge of Haunt, Borgnjor's Revivification,  | renamed or removed by the Spell Effects Lab pass |  |
| born | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/rp_account_creator/index.html (1); wizard:tools/spellforge/catalog.json (1) | Born under a hanged moon; the village midwife refused payment and left | renamed or removed by the Spell Effects Lab pass |  |
| bozo | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Bozo the Lost | renamed or removed in the side-tool pass |  |
| breach | agent-invented | Surrounded Kills | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Core/Vessels.cs (1) | Breach | ARPG Vessels.cs:21 bond family; credited for a kill with 3+ enemies within reach (ArpgModel.cs:669-670). Item shows "<name> of the Breach" (Vessels.cs:88). |  |
| breaker | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/0 |  | 1: wizard:tools/spellforge/index.html (3) | Breaker | renamed or removed by the Spell Effects Lab pass |  |
| bring | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/gui_framekit/game/character.js (2) | Bring a light. Bring two. | renamed or removed in the side-tool pass |  |
| brom | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 1: wizard:tools/spellforge/index.html (2) | Brom's Barrelling Boulder | renamed or removed by the Spell Effects Lab pass |  |
| brothers | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (1) | Brothers in Arms | renamed or removed by the Spell Effects Lab pass |  |
| bruise | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Bruise | renamed or removed by the Spell Effects Lab pass |  |
| bruised | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Bruised | renamed or removed by the Spell Effects Lab pass |  |
| buffoon | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Buffoon McStumble | renamed or removed in the side-tool pass |  |
| bullseye | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/1 |  | 3: wizard:tools/spellforge/index.html (5); wizard:tools/spellforge/catalog.json (1) | Dimensional Bullseye | renamed or removed by the Spell Effects Lab pass |  |
| burns | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/core.js (1) | A wave of noon. Burns what hides. | renamed or removed in the side-tool pass |  |
| butcher | agent-invented |  | 2/0 | 1/0 | 1: wizard:tools/rpg_inventory/README.md (1) | - **Kill Bonuses** (Butcher archetype) — Life on Kill, Attack Speed af | Archetype name (redhand/ashspeaker/farwalker ids). | verdigris-pack.js archetypes; archetype adds +1 weight to its theme on every deed and drives kinship (vesselforge.js). Owner never asked for archetypes; ARPG us |
| cairn | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/verdigris_splash/app.js (1) | Cairn Ridge | renamed or removed in the side-tool pass |  |
| calcification | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Mass Calcification | renamed or removed by the Spell Effects Lab pass |  |
| calder | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Calder | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| caller | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/0 |  | 1: wizard:tools/spellforge/index.html (3) | Tempest Caller | renamed or removed by the Spell Effects Lab pass |  |
| calloway | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Wren Calloway | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| can | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Can be evoked to cast Olgreb's Toxic Radiance, continuously poisoning  | renamed or removed by the Spell Effects Lab pass |  |
| carnival | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Carnival of Pain | renamed or removed by the Spell Effects Lab pass |  |
| carving | plain | no longer appears | 1/0 |  | 1: wizard:tools/rpg_inventory/core/vesselforge.js (1) | Carving needs 2 patience | removed with the renames above |  |
| cassia | agent-invented | Vendor | 3/0 |  | 1: wizard:tools/gui_framekit/game/world.js (3) | Cassia | world.js NPC name. |  |
| chamber | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 2: wizard:tools/sokoban/game.js (1); wizard:tools/sokoban/index.html (1) | Chamber reset. The proof still holds. | renamed or removed in the side-tool pass |  |
| chaotic | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Chaotic void house name | renamed or removed in the side-tool pass |  |
| charnel | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Charnel red | renamed or removed by the Spell Effects Lab pass |  |
| charter | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/character.js (1) | Charter: The Lower Vaults | renamed or removed in the side-tool pass |  |
| cheibriados | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Cheibriados | renamed or removed by the Spell Effects Lab pass |  |
| choir | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 7/1 |  | 5: wizard:tools/spellforge/index.html (4); wizard:tools/rp_account_creator/index.html (1) | The Choir Below | renamed or removed by the Spell Effects Lab pass |  |
| chord | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Chord | removed with the renames above |  |
| choristers | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Choristers | renamed or removed by the Spell Effects Lab pass |  |
| colossal | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Colossal | renamed or removed by the Spell Effects Lab pass |  |
| condensed | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Condensed moisture into a floating disc of ice that acted as a shield. | renamed or removed by the Spell Effects Lab pass |  |
| conductance | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Conductance | renamed or removed by the Spell Effects Lab pass |  |
| consulting | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Consulting Scribes... | renamed or removed in the side-tool pass |  |
| corveaux | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Lysa Corveaux | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| council | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/0 |  | 2: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Wu Jian Council | renamed or removed by the Spell Effects Lab pass |  |
| countermarch | side tool | see purge-2026-11-08/side-tools-renames.tsv | 4/0 |  | 2: wizard:tools/sokoban/levels.js (3); wizard:tools/sokoban/core.js (1) | Countermarch | renamed or removed in the side-tool pass |  |
| countermarches | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/sokoban/index.html (1) | Solver resistance  Countermarches  Box barriers  Storage straits | renamed or removed in the side-tool pass |  |
| court | side tool | see purge-2026-11-08/side-tools-renames.tsv | 4/0 |  | 3: wizard:tools/gui_framekit/demo/showcase.html (2); wizard:tools/gui_framekit/components/overlays/modal/demo.html (1) | Seal the pact with the Pale Court? | renamed or removed in the side-tool pass |  |
| crane | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Tobias Crane | renamed or removed in the side-tool pass |  |
| created | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Created a gravitational singularity that dragged in and crushed everyt | renamed or removed by the Spell Effects Lab pass |  |
| crownlands | agent-invented | Island | 6/0 |  | 2: wizard:tools/verdigris_splash/app.js (4); wizard:tools/verdigris_splash/index.html (2) | Crownlands island and observatory. | verdigris_splash/app.js "Crownlands island and observatory", "Crown of Tides citadel": invented region name in the world preview. |  |
| crucible | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/1 |  | 4: wizard:tools/gui_framekit/game/pane-content.js (2); wizard:tools/spellforge/index.html (1) | Sockets reforged at the Brass Crucible | renamed or removed by the Spell Effects Lab pass |  |
| curious | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/world.js (1) | Some relics hum when the boy walks past. Curious. | renamed or removed in the side-tool pass |  |
| custodian | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/world.js (1) | Custodian of the Ninth Circle | renamed or removed in the side-tool pass |  |
| cuts | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 1: wizard:tools/spellforge/index.html (2) | Twin Cuts | renamed or removed by the Spell Effects Lab pass |  |
| cutting | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Cutting through bramble | renamed or removed in the side-tool pass |  |
| damaris | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Rooke Damaris | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| damnation | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (1) | Damnation | renamed or removed by the Spell Effects Lab pass |  |
| dare | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/core.js (1) | Draw a line. Dare them. | renamed or removed in the side-tool pass |  |
| debt | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | Debt is a kind of love | renamed or removed in the side-tool pass |  |
| delver | agent-invented | Difficulty 2 | 3/0 |  | 3: wizard:tools/sokoban/core.js (1); wizard:tools/sokoban/game.js (1) | Delver | sokoban/core.js:1242-1247 difficulty titles by score; name by level. ("Warden"/"Guardian" in cartographer expedition rooms are plain room roles and stay.) |  |
| demonic | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Demonic rage | renamed or removed by the Spell Effects Lab pass |  |
| depart | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Depart the Abyss | renamed or removed by the Spell Effects Lab pass |  |
| dithmenos | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Dithmenos | renamed or removed by the Spell Effects Lab pass |  |
| doran | agent-invented | Vendor | 3/0 |  | 1: wizard:tools/gui_framekit/game/world.js (3) | Doran | tools/gui_framekit/game (UI demo) world.js/pane-content.js invented NPC names. "Armourmaster" is also a coined compound (rule 7). |  |
| doroklohe | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (1) | Tomb of Doroklohe | renamed or removed by the Spell Effects Lab pass |  |
| draught | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 2: wizard:tools/gui_framekit/game/character.js (1); wizard:tools/rpg_inventory/README.md (1) | Verdant Draught | renamed or removed in the side-tool pass |  |
| dray | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Kaelen Dray | Invented sample name or flavour word. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the pl |  |
| drowned | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/1 |  | 5: wizard:tools/rp_account_creator/index.html (1); wizard:tools/spellforge/index.html (1) | Drowned Soldier | renamed or removed by the Spell Effects Lab pass |  |
| druidic | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Druidic | renamed or removed by the Spell Effects Lab pass |  |
| dustwind | agent-invented | Steppe | 34/0 |  | 3: wizard:tools/rpg_inventory/core/expansion_ready/post-calib-wave2-approved.tsv (30); wizard:tools/rpg_inventory/AGENTS.md (2) | Nordic Bronze belong to North; Scythian/Saka belongs to Dustwind; | rpg_inventory/core/MIXED-REFERENCE-BOARD-POLICY.md:41 region "Dustwind: Scythian/Saka steppe equipment"; also AGENTS.md and post-calib wave-2 approvals. Coined  |  |
| dying | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Dying embers | renamed or removed by the Spell Effects Lab pass |  |
| ecliptic | agent-invented |  | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Ecliptic Archive Keystone | Invented keystone/class/cluster name in skilltree-content.json. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| edmun | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Edmun Hale | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| effaced | agent-invented | Removed | 2/0 | 1/0 | 1: wizard:tools/rpg_inventory/README.md (1) | / Removal / Effaced freely (slot is reusable) / Severed only by knife  | vesselforge.js tooltip "Effaced: ..." for a removed brand; "efface" is an agent verb for removal (README currency "Effacing Stone"). |  |
| eldritch | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Opens a temporary portal from which a huge eldritch tentacle emerges t | renamed or removed by the Spell Effects Lab pass |  |
| electric | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/0 |  | 1: wizard:tools/spellforge/index.html (4) | Vhi's Electric Charge | renamed or removed by the Spell Effects Lab pass |  |
| electrocution | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Orb of Electrocution | renamed or removed by the Spell Effects Lab pass |  |
| elyvilon | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Elyvilon | renamed or removed by the Spell Effects Lab pass |  |
| englaciation | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Metabolic Englaciation | renamed or removed by the Spell Effects Lab pass |  |
| enraged | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Enraged | renamed or removed by the Spell Effects Lab pass |  |
| enso | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Enso and scuffs | renamed or removed by the Spell Effects Lab pass |  |
| entrail | plain | no longer appears | 2/0 |  | 2: wizard:tools/rpg_inventory/core/verdigris-pack.js (1); wizard:tools/rpg_inventory/core/targets.tsv (1) | Entrail Omen | removed with the renames above |  |
| epitaph | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Epitaph | renamed or removed in the side-tool pass |  |
| eringya | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Eringya's Surprising Crocodile | renamed or removed by the Spell Effects Lab pass |  |
| eternal | side tool | see purge-2026-11-08/side-tools-renames.tsv | 3/0 |  | 1: wizard:tools/rp_account_creator/index.html (3) | Eternal Recurrence | renamed or removed in the side-tool pass |  |
| even | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Even Keel | renamed or removed in the side-tool pass |  |
| ever | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | You cannot be surprised. Ever. | renamed or removed in the side-tool pass |  |
| evocable | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 10/0 |  | 2: wizard:tools/spellforge/index.html (5); wizard:tools/spellforge/catalog.json (5) | Evocable | renamed or removed by the Spell Effects Lab pass |  |
| evoked | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Evoked to create a portal to a ziggurat. | renamed or removed by the Spell Effects Lab pass |  |
| evolution | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Evolution | renamed or removed by the Spell Effects Lab pass |  |
| expert | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Expert specialisations occupying the outer Flower petals. | removed with the renames above |  |
| fair | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Fair Wind | renamed or removed in the side-tool pass |  |
| familiar | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/components/overlays/toast/demo.html (1) | Familiar escaped! | renamed or removed in the side-tool pass |  |
| familiars | agent-invented | Companions | 1/0 |  | 1: wizard:tools/gui_framekit/components/controls/tabs/demo.html (1) | Familiars | gui_framekit tabs demo; PoE2 term is Companions. |  |
| fanatic | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/3 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | (Mark of the Fanatic) A damnation explosion surrounds the user, who tr | renamed or removed by the Spell Effects Lab pass |  |
| fate | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | You are branded a Fool. The scribes choose your fate. | renamed or removed in the side-tool pass |  |
| fedhas | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 10/2 |  | 3: wizard:tools/spellforge/index.html (5); wizard:tools/spellforge/catalog.json (5) | Fedhas Madash | renamed or removed by the Spell Effects Lab pass |  |
| fel | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 14/7 |  | 3: wizard:tools/spellforge/index.html (7); wizard:tools/spellforge/catalog.json (7) | Fel | renamed or removed by the Spell Effects Lab pass |  |
| fell | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/character.js (1) | Fell from a clear sky. Kept its temper. | renamed or removed in the side-tool pass |  |
| felled | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Felled a horror of ${zone.name} | renamed or removed in the side-tool pass |  |
| fenn | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Fenn Oswic | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| fetish | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/character.js (1) | Bone Fetish | renamed or removed in the side-tool pass |  |
| fey | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Fey sky | renamed or removed by the Spell Effects Lab pass |  |
| fiend | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Flesh Fiend | renamed or removed by the Spell Effects Lab pass |  |
| fiery | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Fiery Tormentor | renamed or removed by the Spell Effects Lab pass |  |
| finale | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Grand Finale | renamed or removed by the Spell Effects Lab pass |  |
| finesse | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/components/inventory/item-tooltip/demo.html (1) | +3 Finesse | renamed or removed in the side-tool pass |  |
| fired | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/3 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Fired a penetrating bolt of freezing cold that damaged every creature  | renamed or removed by the Spell Effects Lab pass |  |
| floors | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/sokoban/index.html (1) | Floors cleared | renamed or removed in the side-tool pass |  |
| flower | plain | no longer appears | 4/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (4) | Inner Flower | removed with the renames above |  |
| flowstep | agent-invented |  | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Flowstep | Coined keystone/class name in skilltree-content.json; not owner, not PoE, not a description. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| flurry | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 1: wizard:tools/spellforge/index.html (2) | Tempest Flurry | renamed or removed by the Spell Effects Lab pass |  |
| fly | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Let the caster fly over obstacles for a while (earlier called Fly). Re | renamed or removed by the Spell Effects Lab pass |  |
| foggy | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Last survivor of a caravan lost in the Foggy Swamp; speaks little of w | renamed or removed in the side-tool pass |  |
| following | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Following a hedgerow | renamed or removed in the side-tool pass |  |
| forgecraft | agent-invented | Constructs | 23/6 |  | 3: wizard:tools/spellforge/index.html (12); wizard:tools/spellforge/catalog.json (11) | Forgecraft reads as construction. Six forged stakes rise in a sweep, t | spellforge category key |  |
| forth | plain | no longer appears | 2/0 |  | 2: wizard:tools/rpg_inventory/core/playground.html (1); wizard:tools/rpg_inventory/README.md (1) | Venture Forth | removed with the renames above |  |
| foundational | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Foundational survival and resource nodes anchored at the Seed center. | removed with the renames above |  |
| fractal | agent-invented |  | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Fractal Bastion Keystone | Coined keystone/class name in skilltree-content.json; not owner, not PoE, not a description. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| fragmentation | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Orb of Fragmentation | renamed or removed by the Spell Effects Lab pass |  |
| frostfire | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Frostfire | renamed or removed by the Spell Effects Lab pass |  |
| fulcrum | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Fulcrum Throw | renamed or removed by the Spell Effects Lab pass |  |
| fulsome | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Fulsome Fusillade | renamed or removed by the Spell Effects Lab pass |  |
| fusillade | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Fulsome Fusillade | renamed or removed by the Spell Effects Lab pass |  |
| gavotte | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Gell's Gavotte | renamed or removed by the Spell Effects Lab pass |  |
| gaze | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Twilight Gaze | renamed or removed by the Spell Effects Lab pass |  |
| gell | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Gell's Gavotte | renamed or removed by the Spell Effects Lab pass |  |
| genesis | plain | no longer appears | 2/0 |  | 2: wizard:tools/arcane_lattice/index.html (1); wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Genesis | removed with the renames above |  |
| ghostfire | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Ghostfire | renamed or removed by the Spell Effects Lab pass |  |
| ghoul | agent-invented |  | 3/1 |  | 4: wizard:tools/rp_account_creator/index.html (1); wizard:tools/spellforge/index.html (1) | Ghoul | Invented enemy/killer name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player fills |  |
| giggles | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Giggles | Invented enemy/killer name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player fills |  |
| glaciate | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/1 |  | 3: wizard:tools/spellforge/index.html (5); wizard:tools/spellforge/catalog.json (1) | Glaciate | renamed or removed by the Spell Effects Lab pass |  |
| gleam | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/world.js (1) | Gilded Weapon Gleam | renamed or removed in the side-tool pass |  |
| glory | plain | no longer appears | 1/0 |  | 1: wizard:tools/arcane_lattice/index.html (1) | an illusory mantle of burning glory | removed with the renames above |  |
| glutton | plain | no longer appears | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Core/CreatureCatalog.cs (1) | Glutton Demon | removed with the renames above |  |
| goblin | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Goblin Skirmisher | renamed or removed in the side-tool pass |  |
| god | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Cathedral God Rays | renamed or removed by the Spell Effects Lab pass |  |
| golden | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Golden storm | renamed or removed by the Spell Effects Lab pass |  |
| gozag | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/0 |  | 2: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Gozag | renamed or removed by the Spell Effects Lab pass |  |
| grace | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/2 |  | 4: wizard:tools/gui_framekit/game/character.js (2); wizard:tools/spellforge/index.html (2) | +34 Grace | renamed or removed by the Spell Effects Lab pass |  |
| grayson | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Grayson | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| grimoire | agent-invented | Spells | 9/1 | 0/1 | 1: arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | WIZARD tools/spellforge/catalog.json (Spellforge Grimoire artifact, 20 | gui_framekit tabs demo tab "Grimoire" (and Spellforge Grimoire). A grimoire is a book: no books in a Bronze Age setting (rule 12). Name by function. |  |
| guiding | agent-invented | Mark Target | 1/0 |  | 1: wizard:tools/gui_framekit/game/core.js (1) | Guiding Star | gui_framekit/game/core.js:187 ability "Guiding Star" with flavour "Mark a foe. The web remembers." Name by effect. |  |
| guild | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Guild green | renamed or removed by the Spell Effects Lab pass |  |
| hale | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Edmun Hale | renamed or removed in the side-tool pass |  |
| hall | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | Bleeding badly. The Hall is not far — yet. | renamed or removed in the side-tool pass |  |
| hardened | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/1 |  | 4: wizard:tools/rp_account_creator/index.html (1); wizard:tools/spellforge/index.html (1) | Hardened Blood | renamed or removed by the Spell Effects Lab pass |  |
| harl | agent-invented | Armour Vendor | 13/0 |  | 2: wizard:tools/gui_framekit/game/world.js (10); wizard:tools/gui_framekit/game/index.html (3) | Harl · Armourmaster  Harl's stock     Your offer  Select a pack item t | tools/gui_framekit/game (UI demo) world.js/pane-content.js invented NPC names. "Armourmaster" is also a coined compound (rule 7). |  |
| haunt | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | One-time gift granting knowledge of Haunt, Borgnjor's Revivification,  | renamed or removed by the Spell Effects Lab pass |  |
| heavenly | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (1) | Heavenly Storm | renamed or removed by the Spell Effects Lab pass |  |
| helios | agent-invented |  | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Helios Anchor Keystone | Invented keystone/class/cluster name in skilltree-content.json. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| hell | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 7/3 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (3) | Hell zone atmosphere: embers lift out of glowing fissures and ride a t | renamed or removed by the Spell Effects Lab pass |  |
| hellfire | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 8/7 |  | 3: wizard:tools/spellforge/catalog.json (7); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (7) | Hellfire Mortar | renamed or removed by the Spell Effects Lab pass |  |
| hellforge | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Hellforge | renamed or removed by the Spell Effects Lab pass |  |
| hellstone | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Hellstone | renamed or removed by the Spell Effects Lab pass |  |
| hepliaklqana | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 8/2 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (4) | Hepliaklqana | renamed or removed by the Spell Effects Lab pass |  |
| heptagram | agent-invented |  | 0/1 | 0/1 | 1: arpg:the ARPG/Assets/ARPG/Resources/VFX/aura-lab.json (1) | Heptagram | aura-lab.json layers "Heptagram", "Blight heptagram": rule 13 bans pentagram/hexagram/heptagram decoration. |  |
| herd | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/NORTH-STAR.md (1) | Court, the Kilnfathers, the First Herd, the Quiet Survey, the Salt Oat | removed with the renames above |  |
| heresies | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Whispered Heresies | renamed or removed in the side-tool pass |  |
| hexafoil | agent-invented |  | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Hexafoil Apex Keystone | Invented keystone/class/cluster name in skilltree-content.json. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| holding | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Holding your breath lasts twice as long. | renamed or removed in the side-tool pass |  |
| hone | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/pane-content.js (1) | Hone Quality | renamed or removed in the side-tool pass |  |
| hour | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/core.js (1) | Still Hour | renamed or removed in the side-tool pass |  |
| hulk | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Hulk | renamed or removed by the Spell Effects Lab pass |  |
| hurled | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Hurled a large orb of lightning that exploded in a burst of electricit | renamed or removed by the Spell Effects Lab pass |  |
| idealise | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Idealise | renamed or removed by the Spell Effects Lab pass |  |
| ignis | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Ignis | renamed or removed by the Spell Effects Lab pass |  |
| ignoring | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Ignoring a voice that knows your name | Word occurs only in an agent-written flavour sentence (rule 10). tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-w |  |
| imagine | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Imagine | renamed or removed in the side-tool pass |  |
| immune | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Immune to panic. +12% crit against the calm. | renamed or removed in the side-tool pass |  |
| incantation | agent-invented | Spell name | 1/0 |  | 1: wizard:tools/gui_framekit/components/controls/input/demo.html (1) | Incantation | gui_framekit input demo label. |  |
| infernal | agent-invented | Volcanic | 8/4 | 0/1 | 1: arpg:the ARPG/Assets/ARPG/Resources/Cartographer/mapgen.js.txt (1) | Infernal | cartographer/core/mapgen.js:1560 map theme "Infernal" (a hell theme); rule 8 names maps by real terrain or architecture. |  |
| inferno | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Inferno | renamed or removed by the Spell Effects Lab pass |  |
| infestation | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | One-time gift granting knowledge of Haunt, Borgnjor's Revivification,  | renamed or removed by the Spell Effects Lab pass |  |
| infusion | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Infusion | removed with the renames above |  |
| initiate | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/sokoban/core.js (1) | Initiate | renamed or removed in the side-tool pass |  |
| inquisitor | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Inquisitor | renamed or removed by the Spell Effects Lab pass |  |
| inscription | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/pane-content.js (1) | Inscription sealed against reforging | renamed or removed in the side-tool pass |  |
| intellect | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Gain ward equal to 45% of Strength and Intellect | removed with the renames above |  |
| interred | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Interred with ${char.name}; returned to the world. | Word occurs only in an agent-written flavour sentence (rule 10). tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-w |  |
| ironize | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Ironize | renamed or removed by the Spell Effects Lab pass |  |
| ishra | agent-invented | Test Character 3 | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Runtime/ArpgPlaytestAccount.cs (1) | Ishra | Invented name. Scripts/Runtime/ArpgPlaytestAccount.cs seeds the playtest/QA account with these invented house and character names. |  |
| isles | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/verdigris_splash/app.js (1) | The Lantern Isles | renamed or removed in the side-tool pass |  |
| isolde | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Isolde Marr | Invented sample name or flavour word. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the pl |  |
| jaundiced | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Jaundiced | renamed or removed by the Spell Effects Lab pass |  |
| jester | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Jester of Ruin | renamed or removed in the side-tool pass |  |
| jian | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/0 |  | 2: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Wu Jian Council | renamed or removed by the Spell Effects Lab pass |  |
| kaelen | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Kaelen Dray | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| keen | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Keen Eye | renamed or removed in the side-tool pass |  |
| keys | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/verdigris_splash/app.js (1) | Morrow Keys | renamed or removed in the side-tool pass |  |
| kikubaaqudgha | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/0 |  | 2: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Kikubaaqudgha | renamed or removed by the Spell Effects Lab pass |  |
| kilnfathers | agent-invented |  | 1/0 |  | 1: wizard:tools/geometric_skilltree/NORTH-STAR.md (1) | Court, the Kilnfathers, the First Herd, the Quiet Survey, the Salt Oat | NORTH-STAR.md lists invented cultures "the Drowned Court, the Kilnfathers, the First Herd, the Quiet Survey, the Salt Oath"; jewels.js saga ids (drowned-court,  |  |
| kin | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Moonlit kin | renamed or removed by the Spell Effects Lab pass |  |
| king | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | The Hollow King | renamed or removed in the side-tool pass |  |
| kinship | agent-invented |  | 4/0 | 2/0 | 2: wizard:tools/rpg_inventory/DESIGN.md (1); wizard:tools/rpg_inventory/core/README.md (1) | equipped awakened items sharing a kinship resonate (2: minor, 3+: majo | README table row "Kinship". | Bonds carry the shaper's archetype and work at half strength for a different archetype (vesselforge.js:84 estrangedFactor 0.5, :117-122 isEstranged). Agent addi |
| knows | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Reads entrails and skies. Knows much, bleeds easily. | renamed or removed in the side-tool pass |  |
| kobold | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Kobold Scavenger | renamed or removed in the side-tool pass |  |
| lands | plain | no longer appears | 1/0 |  | 1: wizard:tools/rpg_inventory/index.html (1) | What was carried long enough to remember, survives. The rest is lost t | removed with the renames above |  |
| launched | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Launched a short-ranged tongue of flame at a nearby target. Removed in | renamed or removed by the Spell Effects Lab pass |  |
| leda | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Leda's Liquefaction | renamed or removed by the Spell Effects Lab pass |  |
| ledger | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/components/frames/window/demo.html (1) | Reagent Ledger | renamed or removed in the side-tool pass |  |
| lernaean | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Lernaean bronze | renamed or removed by the Spell Effects Lab pass |  |
| lich | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/3 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Lich mirror | renamed or removed by the Spell Effects Lab pass |  |
| lifedrain | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Lifedrain | renamed or removed by the Spell Effects Lab pass |  |
| lightless | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Lightless | renamed or removed by the Spell Effects Lab pass |  |
| lindwurm | agent-invented | Great Serpent | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Core/CreatureCatalog.cs (1) | Lindwurm | CreatureCatalog.cs:84 "Lindwurm" (Germanic medieval dragon word) for a "procedural great serpent, nine metres"; name by what it is. |  |
| lineage | agent-invented |  | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Lineage sigil and rime | index.html section "Lineage". | Inheritance: "When a bearer falls, awakened relics and the most-storied memento pass to the heir — estranged, unless the heir walks the same path" (rpg_inventor |
| linley | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 8/4 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (4) | Linley's Crawl earth spell that hurled an orb which burst into a blast | renamed or removed by the Spell Effects Lab pass |  |
| liquefaction | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Leda's Liquefaction | renamed or removed by the Spell Effects Lab pass |  |
| locks | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Locks respect you slightly more. | renamed or removed in the side-tool pass |  |
| losing | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Losing sight of the sun | renamed or removed in the side-tool pass |  |
| lugonu | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 9/1 |  | 3: wizard:tools/spellforge/index.html (5); wizard:tools/spellforge/catalog.json (4) | Lugonu | renamed or removed by the Spell Effects Lab pass |  |
| lumen | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Lumen | removed with the renames above |  |
| lysa | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Lysa Corveaux | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| madash | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/0 |  | 2: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Fedhas Madash | renamed or removed by the Spell Effects Lab pass |  |
| makhleb | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Makhleb | renamed or removed by the Spell Effects Lab pass |  |
| malign | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Malign Gateway | renamed or removed by the Spell Effects Lab pass |  |
| march | side tool | see purge-2026-11-08/side-tools-renames.tsv | 6/0 |  | 3: wizard:tools/verdigris_splash/app.js (3); wizard:tools/gui_framekit/game/core.js (2) | March Order | renamed or removed in the side-tool pass |  |
| marking | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Marking trunks with chalk | renamed or removed in the side-tool pass |  |
| marlowe | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Marlowe | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| marr | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Isolde Marr | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| memento | agent-invented | History | 1/0 |  | 1: wizard:tools/rpg_inventory/index.html (1) | Memento | rpg_inventory/index.html:1396 label "Memento" (bond history); bonds are described as "named memories". |  |
| menagerie | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Monstrous Menagerie | renamed or removed by the Spell Effects Lab pass |  |
| metabolic | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Metabolic Englaciation | renamed or removed by the Spell Effects Lab pass |  |
| midas | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Midas Touch | renamed or removed by the Spell Effects Lab pass |  |
| millbrook | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Millbrook Fields | Invented place name "Millbrook Fields". tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the  |  |
| mimic | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Mimic | renamed or removed in the side-tool pass |  |
| mirela | agent-invented | Vendor | 3/0 |  | 1: wizard:tools/gui_framekit/game/world.js (3) | Mirela | tools/gui_framekit/game (UI demo) world.js/pane-content.js invented NPC names. "Armourmaster" is also a coined compound (rule 7). |  |
| mirelle | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Mirelle of the Fen | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| monk | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/0 |  | 1: wizard:tools/spellforge/index.html (3) | Storm Monk | renamed or removed by the Spell Effects Lab pass |  |
| monstrous | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Monstrous Menagerie | renamed or removed by the Spell Effects Lab pass |  |
| moorland | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Moorland Ground Fog | renamed or removed by the Spell Effects Lab pass |  |
| morrow | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/verdigris_splash/app.js (1) | Morrow Keys | renamed or removed in the side-tool pass |  |
| mortality | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Suspend Mortality | renamed or removed by the Spell Effects Lab pass |  |
| motto | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | House Motto | renamed or removed in the side-tool pass |  |
| myriad | agent-invented |  | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Myriad Bloom Keystone | Invented keystone/class/cluster name in skilltree-content.json. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| mythic | agent-invented |  | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Mythic capstones placed on the outermost concentric construction ring. | Coined keystone/class name in skilltree-content.json; not owner, not PoE, not a description. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| nazja | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Nazja's Percussive Tempering | renamed or removed by the Spell Effects Lab pass |  |
| necrotic | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 8/4 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (4) | Necrotic light | renamed or removed by the Spell Effects Lab pass |  |
| nemelex | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/2 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Nemelex Xobeh | renamed or removed by the Spell Effects Lab pass |  |
| nexus | plain | no longer appears | 3/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (3) | Nexus | removed with the renames above |  |
| ninth | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/world.js (1) | Custodian of the Ninth Circle | renamed or removed in the side-tool pass |  |
| noctilux | agent-invented |  | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Noctilux Prism Keystone | Coined keystone/class name in skilltree-content.json; not owner, not PoE, not a description. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| oakley | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Oakley | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| okawaru | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Okawaru | renamed or removed by the Spell Effects Lab pass |  |
| olgreb | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Staff of Olgreb | renamed or removed by the Spell Effects Lab pass |  |
| olwa | agent-invented | Test House 2 | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Runtime/ArpgPlaytestAccount.cs (1) | House Olwa | Invented name. Scripts/Runtime/ArpgPlaytestAccount.cs seeds the playtest/QA account with these invented house and character names. |  |
| omen | agent-invented | Upgrade to Rare | 37/10 | 21/7 | 12: arpg:the ARPG/Assets/ARPG/Scripts/Core/Itemization.cs (6); wizard:tools/rpg_inventory/core/playground.html (5) | a clay liver-model omen piece incised with a divination grid in the Me | ARPG Itemization.cs:153: turns a magic item rare and adds one property (= PoE Regal Orb). PoE2 Omens modify the next currency use, a different meaning, so fails |  |
| omens | agent-invented | guaranteed-tag brands | 3/0 | 3/0 | 3: wizard:tools/rpg_inventory/DESIGN.md (1); wizard:tools/rpg_inventory/README.md (1) | / Source / tools, pigments, omens / deeds while equipped / fragments f | verdigris-pack.js omens table; see "omen". |  |
| opened | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Opened a magical portal that carried the caster to another level of th | renamed or removed by the Spell Effects Lab pass |  |
| oracle | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/index.html (1) | SELECTED ITEM  Oracle Lens  Legendary focus · Item level 47 | renamed or removed in the side-tool pass |  |
| oracular | agent-invented | Difficulty 6 | 10/0 |  | 2: wizard:tools/sokoban/levels.js (9); wizard:tools/sokoban/core.js (1) | Oracular | sokoban/core.js:1242-1247 difficulty titles by score; name by level. ("Warden"/"Guardian" in cartographer expedition rooms are plain room roles and stay.) |  |
| oral | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Oral Tradition | renamed or removed in the side-tool pass |  |
| orcish | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Recall Orcish Followers | renamed or removed by the Spell Effects Lab pass |  |
| orun | agent-invented | Character | 1/0 |  | 1: wizard:tools/rpg_inventory/core/playground.html (1) | Orun | Invented default character name in rpg_inventory/core/playground.html:122 (createCharacter name Orun) and "Orun's Stone Oath" (oath, rule 6). |  |
| oswic | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Fenn Oswic | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| overforged | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Overforged | renamed or removed by the Spell Effects Lab pass |  |
| overpower | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Overpower | renamed or removed by the Spell Effects Lab pass |  |
| pact | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Seal the Pact | renamed or removed in the side-tool pass |  |
| pakellas | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/0 |  | 2: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (1) | Shared Pakellas language: brass and ebony devices, hair-thin blue-whit | renamed or removed by the Spell Effects Lab pass |  |
| panoply | agent-invented | Set bonus | 7/0 |  | 5: wizard:tools/rpg_inventory/core/verdigris-pack.js (2); wizard:tools/rpg_inventory/DESIGN.md (2) | Panoply (2): +10% to the bond values of your awakened items | verdigris-pack.js panoply labels. | Player-authored sets: "Panoply (2): +10% to the bond values of your awakened items", "(3): awakened powers trigger 25% more often" (verdigris-pack.js panoply).  |
| paragon | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/3 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Platinum Paragon | renamed or removed by the Spell Effects Lab pass |  |
| pathfinder | side tool | see purge-2026-11-08/side-tools-renames.tsv | 6/0 |  | 2: wizard:tools/sokoban/levels.js (5); wizard:tools/sokoban/core.js (1) | Pathfinder | renamed or removed in the side-tool pass |  |
| patient | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Patient Hunter | renamed or removed in the side-tool pass |  |
| percussive | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Nazja's Percussive Tempering | renamed or removed by the Spell Effects Lab pass |  |
| permanence | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Permanence | renamed or removed by the Spell Effects Lab pass |  |
| petal | plain | no longer appears | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Petal Vanguard | removed with the renames above |  |
| petition | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Potion Petition | renamed or removed by the Spell Effects Lab pass |  |
| petra | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Petra Quill | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| phalanx | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Forge Phalanx Beetle | renamed or removed by the Spell Effects Lab pass |  |
| phoenix | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Phoenix fire | renamed or removed by the Spell Effects Lab pass |  |
| plague | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/3 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Plague tear | renamed or removed by the Spell Effects Lab pass |  |
| poking | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Poking a scarecrow that moved | renamed or removed in the side-tool pass |  |
| presence | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/demo/showcase.html (1) | Crown of the Pale Court  +9 Presence | renamed or removed in the side-tool pass |  |
| price | plain | no longer appears | 1/0 |  | 1: wizard:tools/rpg_inventory/core/verdigris-combat.js (1) | The Blood Price | removed with the renames above |  |
| pried | plain | no longer appears | 1/0 |  | 1: wizard:tools/rpg_inventory/core/vesselforge.js (1) | Pried out ${pack.trophies[removed.trophyId].name} — it crumbles. | removed with the renames above |  |
| prime | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Prime Seed Nexus | removed with the renames above |  |
| prism | plain | no longer appears | 3/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (3) | Prism | removed with the renames above |  |
| prismatic | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/pane-content.js (1) | Prismatic | renamed or removed in the side-tool pass |  |
| profane | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Profane violet | renamed or removed by the Spell Effects Lab pass |  |
| property | plain | no longer appears | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Core/Itemization.cs (1) | Property | removed with the renames above |  |
| psyche | plain | no longer appears | 1/0 |  | 1: wizard:tools/arcane_lattice/index.html (1) | Psyche | removed with the renames above |  |
| pyre | plain | no longer appears | 1/0 |  | 1: wizard:tools/arcane_lattice/index.html (1) | Pyre | removed with the renames above |  |
| pyromancer | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (1) | Pyromancer | renamed or removed by the Spell Effects Lab pass |  |
| qazlal | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/2 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (3) | Qazlal | renamed or removed by the Spell Effects Lab pass |  |
| questioning | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Questioning a nervous shepherd | renamed or removed in the side-tool pass |  |
| quill | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 2: wizard:tools/gui_framekit/components/inventory/item-tooltip/demo.html (1); wizard:tools/rp_account_creator/index.html (1) | Raven Quill | renamed or removed in the side-tool pass |  |
| raised | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Raised among the lime kilns of a dying quarry town, sworn to outlive i | renamed or removed in the side-tool pass |  |
| ramparts | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Frozen Ramparts | renamed or removed by the Spell Effects Lab pass |  |
| raven | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/components/inventory/item-tooltip/demo.html (1) | Raven Quill | renamed or removed in the side-tool pass |  |
| rays | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Cathedral God Rays | renamed or removed by the Spell Effects Lab pass |  |
| readied | agent-invented | Tool Slot | 1/0 |  | 1: wizard:tools/rpg_inventory/core/verdigris-pack.js (1) | Readied rig | verdigris-pack.js forms.quickrig kindLabel "Readied rig" (form name already "Tool Slot"). |  |
| reads | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Reads entrails and skies. Knows much, bleeds easily. | renamed or removed in the side-tool pass |  |
| recalled | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Recalled converted orc followers (pre-0.32 form of the recall). | renamed or removed by the Spell Effects Lab pass |  |
| receive | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/2 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Receive Forbidden Knowledge | renamed or removed by the Spell Effects Lab pass |  |
| reclaimed | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Reclaimed ${name} | renamed or removed in the side-tool pass |  |
| recurrence | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Eternal Recurrence | renamed or removed in the side-tool pass |  |
| reforge | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/pane-content.js (1) | Reforge Colors | renamed or removed in the side-tool pass |  |
| reforges | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/character.js (1) | Reforges an item's colors | renamed or removed in the side-tool pass |  |
| reigns | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | Chaos Reigns Eternal | renamed or removed in the side-tool pass |  |
| remembered | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Remembered | Invented sample name or flavour word. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the pl |  |
| resonant | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Resonant | removed with the renames above |  |
| restored | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Restored a large amount of the caster's health. Removed in 0.5. | renamed or removed by the Spell Effects Lab pass |  |
| resurrection | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (1) | Twisted Resurrection | renamed or removed by the Spell Effects Lab pass |  |
| revivification | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | One-time gift granting knowledge of Haunt, Borgnjor's Revivification,  | renamed or removed by the Spell Effects Lab pass |  |
| rimewall | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Rimewall | renamed or removed by the Spell Effects Lab pass |  |
| riverspill | agent-invented | Nile and Mesopotamia | 10/0 |  | 4: wizard:tools/rpg_inventory/core/expansion_ready/post-calib-wave2-approved.tsv (5); wizard:tools/rpg_inventory/AGENTS.md (2) | Riverspill. Never move a source merely because it looks generically an | MIXED-REFERENCE-BOARD-POLICY.md:42 region "Riverspill: Predynastic/ancient Egyptian and Sumerian/Akkadian". Coined compound (rule 7). |  |
| rivetmail | agent-invented |  | 2/0 | 2/0 | 1: wizard:tools/rpg_inventory/core/targets.tsv (2) | Rivetmail Hauberk | Coined compound for riveted mail (rule 7); targets.tsv "Rivetmail Hauberk", "Rivetmail Towershield"; retired material. |  |
| roadside | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Roadside Bandit | renamed or removed in the side-tool pass |  |
| rooke | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Rooke Damaris | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| rotting | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Rotting | renamed or removed by the Spell Effects Lab pass |  |
| ruin | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 6/2 |  | 4: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (2) | Jester of Ruin | renamed or removed by the Spell Effects Lab pass |  |
| ruinous | plain | no longer appears | 1/0 |  | 1: wizard:tools/arcane_lattice/index.html (1) | Ruinous | removed with the renames above |  |
| runestone | real-world | Carved standing stone | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Runestone | rule 13: no rune decoration |  |
| rw | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Dark/Enchantment · RW1 only | renamed or removed by the Spell Effects Lab pass |  |
| sagas | plain | no longer appears | 2/0 |  | 1: wizard:tools/geometric_skilltree/NORTH-STAR.md (2) | Verdigris is bronze-age, low-fantasy: wards and rites, not "energy shi | removed with the renames above |  |
| savant | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Lattice Savant | removed with the renames above |  |
| scavenged | agent-invented |  | 2/0 | 1/0 | 1: wizard:tools/rpg_inventory/core/BASE-DESIGN.md (1) | / **T1 Scavenged** / stone-age, found / flint, bone, driftwood, rawhid | Word occurs only in an agent-written flavour sentence (rule 10). tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-w |  |
| scavenger | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Kobold Scavenger | renamed or removed in the side-tool pass |  |
| schooled | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Schooled by hedge-clerics in letters and knife-work, in roughly equal  | renamed or removed in the side-tool pass |  |
| scion | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Scion name | renamed or removed in the side-tool pass |  |
| scout | agent-invented |  | 2/0 | 1/0 | 1: wizard:tools/rpg_inventory/README.md (1) | - **Movement** (Scout archetype) — Speed on Kill, Thrown Weapon Avoida | Archetype name (redhand/ashspeaker/farwalker ids). | verdigris-pack.js archetypes; archetype adds +1 weight to its theme on every deed and drives kinship (vesselforge.js). Owner never asked for archetypes; ARPG us |
| scraper | agent-invented | Remove Last Modifier | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Core/Itemization.cs (1) | Scraper | ARPG Itemization.cs:149 currency: removes the most recently added property (close to PoE Orb of Annulment, which removes a random one). |  |
| scribes | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Consulting Scribes... | renamed or removed in the side-tool pass |  |
| scribing | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/components/inventory/item-tooltip/demo.html (1) | +1 Scribing | renamed or removed in the side-tool pass |  |
| searing | plain | no longer appears | 1/1 |  | 2: wizard:tools/rpg_inventory/README.md (1); arpg:the ARPG/Assets/ARPG/Scripts/Core/Itemization.cs (1) | Searing Ash | removed with the renames above |  |
| season | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Season journey | renamed or removed by the Spell Effects Lab pass |  |
| seer | agent-invented |  | 2/0 | 1/0 | 1: wizard:tools/rpg_inventory/README.md (1) | - **Mana** (Seer archetype) — Spell Power at High Mana, Mana on Kill,  | Archetype name (redhand/ashspeaker/farwalker ids). | verdigris-pack.js archetypes; archetype adds +1 weight to its theme on every deed and drives kinship (vesselforge.js). Owner never asked for archetypes; ARPG us |
| sera | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Sera Voss | Invented sample name or flavour word. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the pl |  |
| seraph | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/1 |  | 4: wizard:tools/rp_account_creator/index.html (1); wizard:tools/spellforge/index.html (1) | Pale Seraph | renamed or removed by the Spell Effects Lab pass |  |
| setting | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Setting out | renamed or removed in the side-tool pass |  |
| shade | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (1) | Shade height | renamed or removed by the Spell Effects Lab pass |  |
| shallow | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Shallow curse | renamed or removed by the Spell Effects Lab pass |  |
| shamblers | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Kills all non-undead allies and raises them as Bone Shamblers that spl | renamed or removed by the Spell Effects Lab pass |  |
| sharp | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Sharp Edge | renamed or removed in the side-tool pass |  |
| shattered | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/verdigris_splash/app.js (1) | The Shattered Choir | renamed or removed in the side-tool pass |  |
| shieldwall | agent-invented | Life on Block | 2/0 | 1/0 | 1: wizard:tools/rpg_inventory/README.md (1) | / Form / **Flat, unconditional numbers** ( ) / **Named, conditional, t | verdigris-combat.js:138 heal label "The Shieldwall"; README bond example. Bond mod display name is already "Life on Block" (verdigris-pack.js themes.warding). |  |
| shining | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | The Shining One | renamed or removed by the Spell Effects Lab pass |  |
| shows | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/character.js (1) | Shows the room behind the room | renamed or removed in the side-tool pass |  |
| silence | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Silence keeps the keep | renamed or removed in the side-tool pass |  |
| sirocco | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Sirocco | removed with the renames above |  |
| skin | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | Stone Skin | renamed or removed in the side-tool pass |  |
| skirmisher | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Goblin Skirmisher | renamed or removed in the side-tool pass |  |
| slain | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 2: wizard:tools/rpg_inventory/core/verdigris-pack.js (1); wizard:tools/rp_account_creator/index.html (1) | Slain enemies have a 15% chance to drop double spoils. | renamed or removed in the side-tool pass |  |
| slaughter | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Vessel of Slaughter | renamed or removed by the Spell Effects Lab pass |  |
| slew | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Slew ${mob} (+${xpGain} xp, -${dmg} hp) | renamed or removed in the side-tool pass |  |
| snuffing | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Snuffing the lantern to listen | renamed or removed in the side-tool pass |  |
| soulfire | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/3 |  | 2: wizard:tools/spellforge/catalog.json (3); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (3) | Soulfire | renamed or removed by the Spell Effects Lab pass |  |
| speak | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/components/controls/input/demo.html (1) | Speak, friend… | renamed or removed in the side-tool pass |  |
| spectral | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Spectral fan | renamed or removed by the Spell Effects Lab pass |  |
| spellforge | agent-invented | Spell Effects Lab | 3/1 | 2/1 | 2: wizard:tools/spellforge/README.md (2); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | WIZARD tools/spellforge/catalog.json (Spellforge Grimoire artifact, 20 | X-forge compound (rule 7); the owner rule 8 example names the tool "Spell Effects Lab" |  |
| spire | plain | no longer appears | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Spire Adept | removed with the renames above |  |
| spirit | agent-invented | Mana | 168/87 | 41/13 | 10: wizard:tools/rpg_inventory/core/verdigris-pack.js (12); wizard:tools/geometric_skilltree/scripts/author-tree.mjs (10) | spirit | Decided 2026-11-08. Names the resource every action spends (verdigris-stats.js label Spirit; tree-data "+12 to Spirit"); PoE2 Spirit is a reservation budget, so |  |
| splinter | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Soul Splinter | renamed or removed by the Spell Effects Lab pass |  |
| splinterfrost | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Splinterfrost Shell | renamed or removed by the Spell Effects Lab pass |  |
| spur | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | {focusTitle} Spur | removed with the renames above |  |
| stalker | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Rift Stalker | renamed or removed in the side-tool pass |  |
| stepping | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Stepping over old bones | renamed or removed in the side-tool pass |  |
| stillman | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Stillman | Invented sample name or flavour word. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the pl |  |
| stoneskin | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 7/1 |  | 3: wizard:tools/spellforge/index.html (6); wizard:tools/spellforge/catalog.json (1) | Stoneskin | renamed or removed by the Spell Effects Lab pass |  |
| stonewood | plain | no longer appears | 42/0 |  | 3: wizard:tools/rpg_inventory/core/expansion_ready/post-calib-wave2-approved.tsv (40); wizard:tools/rpg_inventory/AGENTS.md (1) | Stonewood; Predynastic/ancient Egyptian plus Sumerian/Akkadian belongs | removed with the renames above |  |
| stood | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Stood among the ten-ranked | renamed or removed in the side-tool pass |  |
| storied | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Storied | renamed or removed in the side-tool pass |  |
| strait | side tool | see purge-2026-11-08/side-tools-renames.tsv | 15/0 |  | 2: wizard:tools/sokoban/levels.js (14); wizard:tools/sokoban/core.js (1) | Single Strait | renamed or removed in the side-tool pass |  |
| stride | side tool | see purge-2026-11-08/side-tools-renames.tsv | 3/0 |  | 2: wizard:tools/gui_framekit/game/character.js (2); wizard:tools/gui_framekit/game/tree.js (1) | +8% Stride | renamed or removed in the side-tool pass |  |
| sundering | plain | no longer appears | 1/0 |  | 1: wizard:tools/rpg_inventory/README.md (1) | / Sundering Knife / Sever the faintest Bond; the slot is scarred / | removed with the renames above |  |
| sunforged | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/2 |  | 2: wizard:tools/spellforge/catalog.json (2); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (2) | Sunforged | renamed or removed by the Spell Effects Lab pass |  |
| sunset | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Sunset grace | renamed or removed by the Spell Effects Lab pass |  |
| supercharge | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Supercharge | renamed or removed by the Spell Effects Lab pass |  |
| surprising | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Eringya's Surprising Crocodile | renamed or removed by the Spell Effects Lab pass |  |
| survey | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/NORTH-STAR.md (1) | Court, the Kilnfathers, the First Herd, the Quiet Survey, the Salt Oat | removed with the renames above |  |
| survived | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Survived to the fifth rank | Word occurs only in an agent-written flavour sentence (rule 10). tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-w |  |
| suspend | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Suspend Mortality | renamed or removed by the Spell Effects Lab pass |  |
| tales | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Tales of the fallen guide the young. Scions gain +15% experience. | renamed or removed in the side-tool pass |  |
| tame | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Tame farmland gone slightly wrong. | renamed or removed in the side-tool pass |  |
| taru | agent-invented | Test Character 2 | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Runtime/ArpgPlaytestAccount.cs (1) | Taru | Invented name. Scripts/Runtime/ArpgPlaytestAccount.cs seeds the playtest/QA account with these invented house and character names. |  |
| tax | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Soul Tax | renamed or removed by the Spell Effects Lab pass |  |
| tempered | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/pane-content.js (1) | Tempered | renamed or removed in the side-tool pass |  |
| tempering | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Nazja's Percussive Tempering | renamed or removed by the Spell Effects Lab pass |  |
| templar | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/0 |  | 1: wizard:tools/spellforge/index.html (3) | Dawn Templar | renamed or removed by the Spell Effects Lab pass |  |
| terror | plain | no longer appears | 0/1 |  | 1: arpg:the ARPG/Assets/ARPG/Scripts/Core/CreatureCatalog.cs (1) | Flying Terror | removed with the renames above |  |
| thane | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Aldric Thane | Invented field, title or flavour. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player |  |
| thesis | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/sokoban/index.html (1) | Thesis revealed ·  Packing Order | renamed or removed in the side-tool pass |  |
| thornton | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Thornton | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| thornwind | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/1 |  | 2: wizard:tools/spellforge/catalog.json (1); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (1) | Thornwind | renamed or removed by the Spell Effects Lab pass |  |
| throw | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 1/0 |  | 1: wizard:tools/spellforge/index.html (1) | Fulcrum Throw | renamed or removed by the Spell Effects Lab pass |  |
| thunderbolt | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Cast Thunderbolt, a cone-shaped lightning arc that could be sustained  | renamed or removed by the Spell Effects Lab pass |  |
| thunderhead | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Thunderhead | renamed or removed by the Spell Effects Lab pass |  |
| tides | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/verdigris_splash/app.js (2) | Crown of Tides | renamed or removed in the side-tool pass |  |
| tithe | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 1: wizard:tools/spellforge/index.html (2) | Tithe seal | renamed or removed by the Spell Effects Lab pass |  |
| tobias | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Tobias Crane | Invented sample name or flavour word. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the pl |  |
| towering | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Towering | renamed or removed by the Spell Effects Lab pass |  |
| tradition | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Oral Tradition | renamed or removed in the side-tool pass |  |
| transmute | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/components/overlays/menu/demo.html (1) | Transmute | renamed or removed in the side-tool pass |  |
| transports | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Transports the user out of the Abyss to where they entered it. | renamed or removed by the Spell Effects Lab pass |  |
| tremorstones | agent-invented | Rising stones | 3/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (1) | Tin of Tremorstones |  |  |
| triple | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Triple Draw | renamed or removed by the Spell Effects Lab pass |  |
| triumph | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/core.js (1) | Triumph | renamed or removed in the side-tool pass |  |
| trog | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (3); wizard:tools/spellforge/catalog.json (2) | Trog | renamed or removed by the Spell Effects Lab pass |  |
| turned | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Turned the worshipper into a swirling mass of shadow with damage resis | renamed or removed by the Spell Effects Lab pass |  |
| turning | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Turning a relic over in the light | renamed or removed in the side-tool pass |  |
| twisted | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 5/1 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (1) | Twisted Resurrection | renamed or removed by the Spell Effects Lab pass |  |
| unbroken | plain | no longer appears | 2/0 |  | 2: wizard:tools/rpg_inventory/index.html (1); wizard:tools/rpg_inventory/item.html (1) | Azrael's Unbroken Vigil | removed with the renames above |  |
| undeath | agent-invented | Undead tint | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Undeath | param label |  |
| undying | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Undying | renamed or removed in the side-tool pass |  |
| unearthed | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | Unearthed ${name} — once borne by ${relic.origin}. The House remembers | renamed or removed in the side-tool pass |  |
| unhallowed | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | The Unhallowed | renamed or removed in the side-tool pass |  |
| unworthy | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | The Unworthy | renamed or removed in the side-tool pass |  |
| uskayaw | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/1 |  | 3: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Uskayaw | renamed or removed by the Spell Effects Lab pass |  |
| usurer | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Usurer | renamed or removed by the Spell Effects Lab pass |  |
| vale | side tool | see purge-2026-11-08/side-tools-renames.tsv | 3/0 |  | 1: wizard:tools/verdigris_splash/app.js (3) | Aster Vale | renamed or removed in the side-tool pass |  |
| vanguard | plain | no longer appears | 1/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (1) | Petal Vanguard | removed with the renames above |  |
| vaults | side tool | see purge-2026-11-08/side-tools-renames.tsv | 4/0 |  | 3: wizard:tools/gui_framekit/game/world.js (2); wizard:tools/gui_framekit/game/character.js (1) | Charter: The Lower Vaults | renamed or removed in the side-tool pass |  |
| venture | plain | no longer appears | 2/0 |  | 2: wizard:tools/rpg_inventory/core/playground.html (1); wizard:tools/rpg_inventory/README.md (1) | Venture Forth | removed with the renames above |  |
| verdite | agent-invented | Green | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Verdite | variant name |  |
| vermilion | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Vermilion ink | renamed or removed by the Spell Effects Lab pass |  |
| vesselforge | agent-invented | Inventory and Item Crafting | 23/0 |  | 10: wizard:docs/MODULE_CAPABILITY_AUDIT.md (5); wizard:tools/rpg_inventory/DESIGN.md (5) | / Vesselforge RPG Inventory / dashboard / — / — / — / — / — / — / — /  | Owner: "cringey composite terms like 'emberguard' 'vesselforge'"; rule 8 example name "Inventory and Item Crafting". Module/library name in README, DESIGN.md, M |  |
| vhi | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 3/0 |  | 1: wizard:tools/spellforge/index.html (3) | Vhi's Electric Charge | renamed or removed by the Spell Effects Lab pass |  |
| vigil | agent-invented | Ward Blocks | 3/1 |  | 4: wizard:tools/rpg_inventory/index.html (1); wizard:tools/gui_framekit/game/tree.js (1) | Azrael's Unbroken Vigil | ARPG Vessels.cs:21 bond family; credited when Ward absorbs a blow (ArpgModel.cs:632). Display "of the Vigil"; WIZARD example "Unbroken Vigil". |  |
| vile | plain | no longer appears | 1/0 |  | 1: wizard:tools/arcane_lattice/index.html (1) | Vile | removed with the renames above |  |
| violent | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Violent tear | renamed or removed by the Spell Effects Lab pass |  |
| vit | agent-invented | Life | 1/0 |  | 1: wizard:tools/gui_framekit/index.html (1) | VIT      784 | gui_framekit/index.html stat "VIT 784"; the resource is Life (PoE). |  |
| vitae | agent-invented | LIFE | 1/0 |  | 1: wizard:tools/gui_framekit/tokens/demo.html (1) | --fk-font-mono  VITAE 042 / MANA 87% / 1,204g | gui_framekit/tokens/demo.html "VITAE 042 / MANA 87%": Latin flourish for Life. |  |
| voss | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Sera Voss | Invented sample character name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player f |  |
| vow | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | Take the Grey Vow — retire this scion to the crypt (permanent) | renamed or removed in the side-tool pass |  |
| vulnerable | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Vulnerable | renamed or removed by the Spell Effects Lab pass |  |
| wading | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Wading through black water | renamed or removed in the side-tool pass |  |
| warding | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/1 |  | 3: wizard:tools/geometric_skilltree/assets/patterns.js (1); wizard:tools/gui_framekit/game/tree.js (1) | Warding Circles | renamed or removed in the side-tool pass |  |
| waste | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/verdigris_splash/app.js (1) | The Copper Waste | renamed or removed in the side-tool pass |  |
| watcher | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Watcher Form | renamed or removed by the Spell Effects Lab pass |  |
| watching | side tool | see purge-2026-11-08/side-tools-renames.tsv | 2/0 |  | 1: wizard:tools/rp_account_creator/index.html (2) | Watching two moons where one should be | renamed or removed in the side-tool pass |  |
| weighing | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Weighing the take | renamed or removed in the side-tool pass |  |
| weighs | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/gui_framekit/game/tree.js (1) | +12 Armor. Weighs nothing. | renamed or removed in the side-tool pass |  |
| went | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Went further than the maps. | renamed or removed in the side-tool pass |  |
| whirling | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 1: wizard:tools/spellforge/index.html (2) | Whirling Axe | renamed or removed by the Spell Effects Lab pass |  |
| whispered | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Whispered Heresies | renamed or removed in the side-tool pass |  |
| whispers | side tool | see purge-2026-11-08/side-tools-renames.tsv | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Whispers of the Dead | renamed or removed in the side-tool pass |  |
| wight | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Wight | Invented enemy/killer name. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the player fills |  |
| will | side tool | see purge-2026-11-08/side-tools-renames.tsv | 6/0 |  | 2: wizard:tools/gui_framekit/game/character.js (3); wizard:tools/gui_framekit/game/tree.js (3) | +9 Will | renamed or removed in the side-tool pass |  |
| wine | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Wine dark | renamed or removed by the Spell Effects Lab pass |  |
| wiping | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Wiping the blade clean | Word occurs only in an agent-written flavour sentence (rule 10). tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-w |  |
| witchfire | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/2 |  | 2: wizard:tools/spellforge/catalog.json (2); arpg:the ARPG/Assets/ARPG/Resources/VFX/spellforge-catalog.json (2) | Witchfire | renamed or removed by the Spell Effects Lab pass |  |
| witchlight | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Witchlight | renamed or removed by the Spell Effects Lab pass |  |
| wraith | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Wraith | renamed or removed by the Spell Effects Lab pass |  |
| wren | agent-invented |  | 1/0 |  | 1: wizard:tools/rp_account_creator/index.html (1) | Wren Calloway | Invented sample name or flavour word. tools/rp_account_creator/index.html sample character/place names and flavour lines, all agent-written; a name field the pl |  |
| wu | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 4/0 |  | 2: wizard:tools/spellforge/index.html (2); wizard:tools/spellforge/catalog.json (2) | Wu Jian Council | renamed or removed by the Spell Effects Lab pass |  |
| xobeh | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Nemelex Xobeh | renamed or removed by the Spell Effects Lab pass |  |
| xom | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 7/2 |  | 3: wizard:tools/spellforge/index.html (4); wizard:tools/spellforge/catalog.json (3) | Shared Xom language: a thin-film iridescent sheen, a crooked grin sigi | renamed or removed by the Spell Effects Lab pass |  |
| yredelemnul | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/0 |  | 2: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Yredelemnul | renamed or removed by the Spell Effects Lab pass |  |
| zephyr | agent-invented |  | 2/0 |  | 1: wizard:tools/geometric_skilltree/assets/skilltree-content.json (2) | Zephyr Crown Keystone | Invented keystone/class/cluster name in skilltree-content.json. | Dead data: tools/geometric_skilltree/assets/skilltree-content.json is not loaded by any page or script in WIZARD or the ARPG (grep: no references); its keystone |
| zin | spellforge | see purge-2026-11-08/spellforge-renames.tsv | 2/1 |  | 3: wizard:tools/spellforge/index.html (1); wizard:tools/spellforge/catalog.json (1) | Zin | renamed or removed by the Spell Effects Lab pass |  |

## Kept

| Term | Origin | Now | Files | Note |
|---|---|---|---|---|
| aaa | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| abandoned | plain | 1/3 | 4 |  |
| ability | plain | 1/0 | 1 |  |
| about | plain | 6/0 | 1 |  |
| abraham | plain | 1/0 | 1 |  |
| absolute | plain | 1/0 | 1 |  |
| abstract | plain | 3/0 | 2 |  |
| abydos | real-world or technical (doc only) | 6/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| abyss | plain | 3/0 | 2 |  |
| accad | real-world | 0/9 | 9 | ACCAD (Ohio State motion-capture lab), source credit in imported-source.json. |
| acceleration | plain | 2/0 | 2 |  |
| accent | plain | 1/0 | 1 |  |
| accept | plain | 11/0 | 4 |  |
| acceptance | plain | 2/0 | 2 |  |
| accepted | plain | 9/0 | 1 |  |
| access | plain | 1/0 | 1 |  |
| account | plain | 2/6 | 4 |  |
| accretion | plain | 3/1 | 3 |  |
| accuracy | poe | 61/31 | 14 |  |
| ace | plain | 0/8 | 1 |  |
| achaemenid | plain | 36/0 | 6 |  |
| acheulean | plain | 1/0 | 1 |  |
| acid | plain | 2/2 | 2 |  |
| acrobatics | plain | 1/0 | 1 |  |
| across | plain | 7/0 | 3 |  |
| act | poe | 0/8 | 2 |  |
| action | plain | 4/3 | 5 |  |
| activate | plain | 0/1 | 1 |  |
| activated | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| active | plain | 6/5 | 11 |  |
| actor | plain | 0/1 | 1 |  |
| actors | plain | 0/1 | 1 |  |
| actual | plain | 0/12 | 11 |  |
| ad | plain | 50/0 | 15 |  |
| adapt | plain | 49/0 | 2 |  |
| adapter | plain | 2/0 | 2 |  |
| add | plain | 35/2 | 16 |  |
| added | poe | 24/10 | 14 |  |
| adder | plain | 1/0 | 1 |  |
| adding | plain | 4/0 | 4 |  |
| additional | plain | 4/2 | 4 |  |
| additively | plain | 1/0 | 1 |  |
| adds | poe | 24/14 | 10 |  |
| adjacency | plain | 2/1 | 3 |  |
| adjacent | plain | 10/2 | 11 |  |
| adjust | plain | 4/0 | 4 |  |
| advance | plain | 2/1 | 3 |  |
| advanced | plain | 2/0 | 2 |  |
| advancing | plain | 0/1 | 1 |  |
| adversarial | owner | 2/4 | 5 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| adze | plain | 4/0 | 4 |  |
| aegean | plain | 29/0 | 7 |  |
| af | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| affect | plain | 1/1 | 2 |  |
| affirmer | plain | 0/1 | 1 |  |
| affixes | poe | 1/0 | 1 |  |
| african | plain | 3/0 | 2 |  |
| after | plain | 16/7 | 13 |  |
| afterheat | plain | 2/1 | 3 | plain English |
| afterimage | plain | 0/1 | 1 |  |
| afterimages | plain | 6/2 | 3 |  |
| aftermath | plain | 4/2 | 3 |  |
| afterwards | plain | 6/3 | 3 |  |
| against | plain | 4/1 | 5 |  |
| agate | plain | 3/0 | 2 |  |
| age | plain | 243/6 | 32 |  |
| agent | plain | 5/0 | 5 |  |
| agents | plain | 8/0 | 4 |  |
| aggregation | plain | 1/0 | 1 |  |
| ahhotep | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| ai | plain | 29/0 | 15 |  |
| ailment | poe | 127/84 | 13 |  |
| ailments | poe | 2/1 | 3 |  |
| aim | plain | 2/2 | 3 |  |
| air | owner | 35/21 | 10 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| airstrike | plain | 9/1 | 3 | plain English |
| akhmim | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| akinakes | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| akrotiri | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| aksumite | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| alabaster | plain | 2/1 | 3 |  |
| alaca | real-world | 9/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| alchemy | plain | 8/3 | 4 |  |
| alex | plain | 220/0 | 22 |  |
| alexei | real-world | 51/0 | 12 | The owner (Alexei Korol). |
| algorithm | plain | 1/0 | 1 |  |
| alias | plain | 2/0 | 2 |  |
| aliasing | plain | 1/0 | 1 |  |
| alignment | plain | 4/1 | 4 |  |
| all | plain | 90/27 | 42 |  |
| allies | plain | 10/6 | 8 |  |
| allocatable | plain | 2/0 | 1 |  |
| allocate | plain | 7/7 | 5 |  |
| allocated | poe | 12/64 | 11 | PoE passive-tree verb in same meaning; owner: "allocating". |
| allocating | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| allocation | plain | 1/0 | 1 |  |
| allow | plain | 3/0 | 3 |  |
| allowed | plain | 2/0 | 2 |  |
| ally | plain | 4/4 | 4 |  |
| almost | plain | 5/2 | 4 |  |
| along | plain | 6/0 | 2 |  |
| alpha | plain | 7/1 | 6 |  |
| also | plain | 2/0 | 2 |  |
| alt | plain | 4/0 | 3 |  |
| altar | plain | 6/3 | 3 |  |
| alternate | plain | 1/1 | 2 |  |
| alternating | plain | 2/0 | 1 |  |
| alternative | plain | 2/0 | 1 |  |
| always | plain | 1/1 | 2 |  |
| am | plain | 29/0 | 8 |  |
| amara | plain | 4/0 | 2 |  |
| amarna | real-world or technical (doc only) | 4/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| amber | plain | 37/2 | 17 |  |
| ambience | plain | 0/4 | 4 |  |
| ambient | plain | 2/3 | 3 |  |
| ambiguous | plain | 4/0 | 3 |  |
| amesbury | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| amethyst | plain | 2/0 | 2 |  |
| amount | plain | 1/0 | 1 |  |
| ampoule | plain | 1/0 | 1 |  |
| ampulla | plain | 6/0 | 3 |  |
| amulet | poe | 26/1 | 12 |  |
| amulets | plain | 8/0 | 5 |  |
| an | plain | 20/6 | 21 |  |
| anatomical | plain | 0/1 | 1 |  |
| anatomy | plain | 4/0 | 2 |  |
| ancestor | plain | 11/2 | 8 |  |
| anchor | plain | 57/50 | 50 | plain English in its literal sense only (feet anchored to the ground; the node type is Pattern Node); never a name, them |
| anchors | plain | 10/1 | 6 |  |
| ancient | plain | 97/2 | 13 |  |
| and | plain | 37/5 | 20 |  |
| angle | plain | 2/0 | 2 |  |
| angular | plain | 3/0 | 2 |  |
| anim | technical | 0/8 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| animal | plain | 52/12 | 22 |  |
| animate | plain | 2/1 | 3 |  |
| animated | plain | 0/4 | 2 |  |
| animation | plain | 5/3 | 4 |  |
| ankle | plain | 24/2 | 3 |  |
| annotation | plain | 8/0 | 6 |  |
| annotations | plain | 3/0 | 3 |  |
| anoint | plain | 1/0 | 1 |  |
| anti | plain | 6/0 | 4 |  |
| anticipation | plain | 22/11 | 3 |  |
| antique | plain | 13/0 | 7 |  |
| antler | plain | 22/1 | 11 |  |
| any | plain | 8/0 | 7 |  |
| anyang | real-world | 12/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| ao | plain | 8/13 | 9 |  |
| api | technical | 18/0 | 12 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| apis | plain | 3/0 | 3 |  |
| appearance | plain | 1/1 | 2 |  |
| appendix | plain | 2/0 | 1 |  |
| application | plain | 4/0 | 1 |  |
| applied | plain | 3/0 | 3 |  |
| applies | plain | 0/1 | 1 |  |
| apply | plain | 8/2 | 9 |  |
| apprentice | plain | 1/0 | 1 |  |
| approach | plain | 2/3 | 3 |  |
| apulian | plain | 2/0 | 2 |  |
| aqua | plain | 2/1 | 3 |  |
| aquamarine | plain | 2/1 | 3 |  |
| arc | plain | 9/5 | 4 |  |
| arcade | plain | 2/2 | 2 |  |
| arcane | plain | 33/22 | 22 |  |
| arch | plain | 2/1 | 3 |  |
| archaeological | plain | 3/0 | 3 |  |
| archaic | plain | 6/0 | 3 |  |
| archer | plain | 6/0 | 2 |  |
| archetype | plain | 40/1 | 16 |  |
| archetypes | plain | 26/0 | 10 |  |
| archimedean | plain | 2/1 | 3 |  |
| architecture | plain | 2/0 | 2 |  |
| archive | plain | 13/3 | 12 |  |
| arcs | plain | 4/3 | 4 |  |
| arctic | plain | 5/2 | 4 |  |
| are | plain | 2/0 | 2 |  |
| area | poe | 16/11 | 11 |  |
| areni | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| arm | plain | 4/10 | 5 |  |
| armenia | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| arming | plain | 9/0 | 2 |  |
| armor | poe | 13/0 | 8 |  |
| armored | plain | 3/0 | 2 |  |
| armour | poe | 122/60 | 32 |  |
| arms | plain | 1/0 | 1 |  |
| around | plain | 1/0 | 1 |  |
| arpg | technical | 66/56 | 32 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| arpgs | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| arpgzc | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| arrange | plain | 1/0 | 1 |  |
| arrival | plain | 6/3 | 5 |  |
| arrivals | plain | 4/2 | 3 |  |
| arrow | plain | 3/5 | 5 |  |
| arrows | plain | 6/3 | 6 |  |
| arsenical | plain | 5/0 | 2 |  |
| arslantepe | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| art | plain | 68/1 | 21 |  |
| articulated | plain | 0/1 | 1 |  |
| artifact | plain | 2/0 | 2 |  |
| artist | plain | 1/0 | 1 |  |
| as | plain | 12/8 | 14 |  |
| ascend | plain | 0/2 | 2 |  |
| ascending | plain | 1/0 | 1 |  |
| ascension | owner | 2/0 | 1 | owner lattice canon |
| ascii | plain | 6/0 | 5 |  |
| aseprite | real-world or technical (doc only) | 6/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ash | plain | 168/70 | 26 |  |
| ashen | plain | 2/1 | 3 |  |
| ashurnasirpal | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| asian | plain | 6/0 | 4 |  |
| ask | plain | 4/0 | 3 |  |
| asking | plain | 2/0 | 2 |  |
| aspect | plain | 1/0 | 1 |  |
| assembling | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| assembly | plain | 2/37 | 21 |  |
| asset | plain | 16/0 | 11 |  |
| assign | plain | 1/0 | 1 |  |
| assignments | plain | 1/0 | 1 |  |
| assyrian | plain | 15/0 | 8 |  |
| astral | plain | 1/0 | 1 |  |
| asynchronous | plain | 1/0 | 1 |  |
| asyut | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| at | plain | 52/7 | 19 |  |
| atlas | plain | 1/4 | 4 |  |
| atlatls | plain | 1/0 | 1 |  |
| atmosphere | plain | 7/3 | 3 |  |
| atoll | plain | 1/0 | 1 |  |
| attach | plain | 6/1 | 6 |  |
| attached | plain | 1/0 | 1 |  |
| attack | poe | 152/96 | 22 |  |
| attackers | plain | 1/0 | 1 |  |
| attacks | poe | 0/2 | 2 |  |
| attic | plain | 9/0 | 5 |  |
| attribute | poe | 2/0 | 2 |  |
| attributes | poe | 29/18 | 10 |  |
| audio | plain | 1/0 | 1 |  |
| audit | plain | 4/0 | 3 |  |
| aug | technical | 630/0 | 5 | Date in file names (ChatGPT Image Aug 13 ...). |
| aura | poe | 52/13 | 6 |  |
| auras | poe | 1/10 | 2 |  |
| aurochs | plain | 4/0 | 4 |  |
| authentic | plain | 1/0 | 1 |  |
| author | plain | 2/2 | 4 |  |
| authored | plain | 2/17 | 12 |  |
| authoring | plain | 1/0 | 1 |  |
| authoritative | plain | 3/0 | 3 |  |
| authority | plain | 2/0 | 2 |  |
| authorization | plain | 0/1 | 1 |  |
| auto | plain | 5/0 | 4 |  |
| automap | plain | 4/0 | 3 | Standard ARPG map word. |
| autumn | plain | 4/5 | 6 |  |
| auxiliary | plain | 5/3 | 6 |  |
| available | plain | 1/1 | 2 |  |
| avatar | plain | 1/0 | 1 | plain English |
| avoid | plain | 26/0 | 10 |  |
| avoidance | plain | 4/0 | 2 |  |
| avoided | plain | 1/0 | 1 |  |
| away | plain | 4/0 | 2 |  |
| awning | plain | 4/2 | 3 |  |
| aws | plain | 2/0 | 1 |  |
| axe | poe | 54/2 | 14 |  |
| axes | poe | 3/0 | 3 |  |
| axis | plain | 2/1 | 3 |  |
| aztec | plain | 1/0 | 1 |  |
| azure | plain | 3/0 | 2 |  |
| ba | plain | 0/1 | 1 |  |
| babel | plain | 2/0 | 2 |  |
| babylon | plain | 3/0 | 2 |  |
| back | plain | 16/11 | 13 |  |
| backdrop | plain | 1/0 | 1 |  |
| background | plain | 5/0 | 4 |  |
| backpack | plain | 4/3 | 3 | Plain inventory label. |
| backup | plain | 0/1 | 1 |  |
| backward | plain | 1/0 | 1 |  |
| bad | plain | 10/0 | 3 |  |
| badari | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| badarian | plain | 10/0 | 2 |  |
| badlands | plain | 0/1 | 1 |  |
| bag | plain | 2/0 | 2 |  |
| bake | plain | 3/1 | 4 |  |
| baked | plain | 0/112 | 2 |  |
| balance | plain | 4/0 | 2 |  |
| balanced | plain | 1/0 | 1 |  |
| ball | plain | 3/1 | 3 |  |
| baltic | plain | 3/0 | 2 |  |
| ban | plain | 2/0 | 1 |  |
| banana | plain | 1/0 | 1 |  |
| band | plain | 20/1 | 10 |  |
| banded | plain | 31/3 | 7 |  |
| bandit | plain | 2/0 | 1 |  |
| bands | plain | 12/0 | 2 |  |
| banish | plain | 2/1 | 3 |  |
| banks | plain | 1/1 | 2 |  |
| banner | poe | 159/12 | 10 |  |
| bar | plain | 10/3 | 5 |  |
| barbed | plain | 13/2 | 10 |  |
| bard | plain | 1/0 | 1 |  |
| bardiche | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| bare | plain | 1/0 | 1 |  |
| bark | plain | 15/4 | 8 |  |
| barred | plain | 2/2 | 2 |  |
| barrel | plain | 2/0 | 2 |  |
| barricade | plain | 0/1 | 1 |  |
| barrow | plain | 12/0 | 2 |  |
| basalt | plain | 13/7 | 5 |  |
| base | plain | 32/3 | 17 |  |
| based | plain | 1/0 | 1 |  |
| bases | plain | 6/0 | 2 |  |
| basic | plain | 2/0 | 2 |  |
| basket | plain | 2/0 | 2 |  |
| basketry | plain | 3/0 | 2 |  |
| bast | plain | 11/0 | 5 |  |
| batch | plain | 21/1 | 7 |  |
| batters | plain | 2/1 | 3 |  |
| battersea | real-world or technical (doc only) | 4/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| battle | plain | 1/0 | 1 |  |
| bc | real-world | 375/0 | 10 | Date era marker. |
| bce | real-world or technical (doc only) | 7/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| bd | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| be | plain | 7/1 | 6 |  |
| bead | plain | 8/0 | 4 |  |
| beading | plain | 1/0 | 1 |  |
| beads | plain | 12/0 | 2 |  |
| beak | plain | 4/0 | 2 |  |
| beaker | plain | 6/0 | 2 |  |
| beakers | plain | 2/1 | 3 |  |
| beam | plain | 11/11 | 5 |  |
| bear | plain | 1/1 | 2 |  |
| bearer | plain | 5/1 | 4 |  |
| bearskin | plain | 30/0 | 2 |  |
| beast | plain | 5/5 | 7 |  |
| beasts | plain | 4/6 | 7 |  |
| because | plain | 2/0 | 1 |  |
| beetle | plain | 4/1 | 5 |  |
| before | plain | 17/3 | 16 |  |
| begin | plain | 2/1 | 3 |  |
| behaviour | plain | 0/1 | 1 | Debug panel label (SerpentBody.cs). |
| behind | plain | 4/3 | 4 |  |
| being | plain | 2/1 | 3 |  |
| bell | plain | 18/0 | 9 |  |
| belongings | plain | 0/3 | 3 |  |
| belt | poe | 40/1 | 14 |  |
| belts | plain | 6/0 | 5 |  |
| bench | plain | 23/0 | 9 |  |
| bend | plain | 1/0 | 1 |  |
| beni | plain | 4/0 | 2 |  |
| bent | plain | 3/0 | 3 |  |
| bentwood | plain | 5/0 | 4 |  |
| berlin | plain | 3/0 | 2 |  |
| bernburg | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| best | plain | 2/0 | 2 |  |
| between | plain | 4/0 | 4 |  |
| bezel | plain | 5/0 | 3 |  |
| bfffe | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| big | plain | 1/0 | 1 |  |
| bile | plain | 2/1 | 3 |  |
| binary | plain | 1/0 | 1 |  |
| bind | plain | 2/0 | 2 |  |
| binding | plain | 4/2 | 3 |  |
| bindings | plain | 3/0 | 2 |  |
| bird | plain | 5/1 | 5 |  |
| birth | plain | 1/0 | 1 |  |
| bite | plain | 5/0 | 1 |  |
| black | plain | 74/23 | 13 |  |
| blackened | plain | 7/2 | 5 |  |
| blackline | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| blackthorn | plain | 2/1 | 3 |  |
| blade | plain | 43/18 | 12 |  |
| blades | plain | 16/7 | 7 |  |
| blank | plain | 4/0 | 3 |  |
| blast | plain | 30/17 | 4 |  |
| blasted | plain | 2/1 | 3 |  |
| blasting | plain | 2/1 | 3 |  |
| blasts | plain | 9/4 | 3 |  |
| bleached | plain | 2/1 | 3 |  |
| bleed | poe | 15/5 | 12 |  |
| bleeding | poe | 45/13 | 12 |  |
| bleeds | poe | 8/4 | 3 |  |
| blend | plain | 2/1 | 3 |  |
| blender | plain | 5/5 | 6 |  |
| blessed | plain | 0/1 | 1 |  |
| blessing | plain | 0/6 | 3 |  |
| blight | plain | 0/2 | 1 |  |
| blind | poe | 0/1 | 1 |  |
| blinded | poe | 0/4 | 3 |  |
| blinding | plain | 6/2 | 6 |  |
| blink | plain | 9/0 | 4 |  |
| blisters | plain | 3/1 | 3 |  |
| blizzard | plain | 1/5 | 5 |  |
| blob | plain | 1/0 | 1 |  |
| block | poe | 53/13 | 21 |  |
| blocked | plain | 5/4 | 9 |  |
| blocks | plain | 2/2 | 4 |  |
| blood | plain | 133/69 | 12 | plain English in its literal sense only (blood spatter on a hit, a pool of blood); never a name, theme or tag of a mecha |
| bloodstone | plain | 2/1 | 3 |  |
| bloom | plain | 2/0 | 1 |  |
| blossom | plain | 2/1 | 3 |  |
| blossoms | plain | 2/1 | 3 |  |
| blow | plain | 4/1 | 5 |  |
| blown | plain | 2/1 | 3 |  |
| blows | plain | 0/1 | 1 |  |
| blue | plain | 74/32 | 9 |  |
| blueprint | plain | 2/1 | 3 |  |
| blunt | plain | 20/0 | 2 |  |
| bm | real-world or technical (doc only) | 6/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| boar | plain | 17/17 | 8 |  |
| board | plain | 3/0 | 3 |  |
| boat | plain | 2/0 | 2 |  |
| bodies | plain | 2/1 | 3 |  |
| body | owner | 80/29 | 33 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| bodyshield | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| boeotian | plain | 7/0 | 3 |  |
| bog | plain | 8/3 | 3 |  |
| boil | plain | 4/2 | 3 |  |
| boiled | plain | 5/0 | 3 |  |
| bolt | plain | 29/12 | 6 |  |
| bolts | plain | 10/4 | 3 |  |
| bond | owner | 54/8 | 14 | Owner: "bonds are gradually gained by using the item sort of like item-local xp". |
| bonds | owner | 25/0 | 9 | Owner idea (brands and bonds). |
| bone | plain | 107/104 | 28 |  |
| bonfire | plain | 2/1 | 3 |  |
| bonus | plain | 14/7 | 10 |  |
| bonuses | plain | 5/0 | 4 |  |
| book | plain | 3/1 | 3 |  |
| boolean | technical | 1/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| boom | plain | 0/1 | 1 |  |
| boots | poe | 51/0 | 12 |  |
| bootstrap | plain | 1/0 | 1 |  |
| border | plain | 23/0 | 6 |  |
| borders | plain | 15/0 | 2 |  |
| bore | plain | 5/2 | 3 |  |
| boring | plain | 2/0 | 2 |  |
| borne | plain | 1/0 | 1 |  |
| borrow | plain | 1/0 | 1 |  |
| borum | real-world | 15/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| boss | poe | 19/5 | 13 |  |
| botanical | plain | 1/0 | 1 |  |
| both | plain | 8/3 | 11 |  |
| bottom | plain | 3/1 | 3 |  |
| bought | plain | 2/0 | 2 |  |
| boulder | plain | 4/6 | 7 |  |
| bounce | plain | 1/0 | 1 |  |
| bound | plain | 7/1 | 7 |  |
| boundaries | plain | 2/0 | 2 |  |
| bounded | plain | 2/0 | 2 |  |
| bow | poe | 10/0 | 4 |  |
| bowl | plain | 15/0 | 5 |  |
| bows | poe | 3/0 | 3 |  |
| box | plain | 6/25 | 29 | Ordinary English word used in its normal meaning. |
| boxes | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| boxing | plain | 7/0 | 4 |  |
| bpm | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| br | real-world | 6/0 | 2 | Fragment of Brøns Mose (find site). |
| bracers | plain | 6/0 | 4 |  |
| brackish | plain | 4/3 | 4 |  |
| braided | plain | 6/0 | 2 |  |
| branch | plain | 4/1 | 4 |  |
| branches | plain | 4/3 | 4 |  |
| branching | plain | 2/1 | 3 |  |
| brand | owner | 47/6 | 13 | Owner: "brands are added through explicit enchantments and crafts". |
| branded | plain | 4/2 | 3 |  |
| branding | plain | 1/0 | 1 |  |
| brands | owner | 18/1 | 12 | Owner idea (brands and bonds). |
| brass | plain | 10/3 | 5 |  |
| brazier | plain | 9/4 | 6 |  |
| braziers | plain | 1/0 | 1 |  |
| brdf | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| break | plain | 11/3 | 10 |  |
| breakdown | plain | 1/0 | 1 |  |
| breaking | plain | 1/0 | 1 |  |
| breakthrough | plain | 1/0 | 1 |  |
| breath | plain | 80/42 | 10 |  |
| briar | plain | 2/1 | 3 |  |
| brick | plain | 0/1 | 1 |  |
| bricks | other-game | 0/3 | 2 | Arcomage resource name in TownCards.cs; owner asked for an "arcomage -like minigame" (rule (a) via owner request). |
| bridge | plain | 3/2 | 5 |  |
| brief | plain | 7/0 | 6 |  |
| briefly | plain | 0/2 | 1 |  |
| bright | plain | 2/1 | 3 |  |
| brim | plain | 6/0 | 2 |  |
| brimstone | plain | 4/2 | 3 |  |
| bristled | plain | 0/1 | 1 |  |
| british | plain | 130/0 | 9 |  |
| brittle | plain | 1/0 | 1 |  |
| broad | plain | 14/3 | 10 |  |
| broadblade | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| broadleaf | plain | 0/3 | 2 |  |
| broken | plain | 6/3 | 5 |  |
| bronze | plain | 523/24 | 45 |  |
| bronzed | plain | 3/0 | 2 |  |
| brooch | plain | 3/0 | 2 |  |
| brood | plain | 2/1 | 3 |  |
| brow | plain | 5/0 | 4 |  |
| browband | plain | 9/0 | 2 |  |
| brown | plain | 10/0 | 3 |  |
| browse | plain | 1/0 | 1 |  |
| browser | plain | 7/0 | 4 |  |
| bruiser | plain | 1/2 | 3 |  |
| brushed | plain | 2/1 | 3 |  |
| brute | plain | 1/0 | 1 |  |
| brutes | plain | 1/0 | 1 |  |
| bsdf | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| bu | plain | 11/0 | 1 |  |
| bubble | plain | 2/3 | 5 |  |
| bubbles | plain | 22/10 | 3 |  |
| bucket | plain | 2/0 | 2 |  |
| buckler | poe | 20/2 | 10 |  |
| bucklers | plain | 1/0 | 1 |  |
| budget | plain | 2/0 | 2 |  |
| budgeted | plain | 1/0 | 1 |  |
| buff | plain | 13/3 | 4 |  |
| buffs | plain | 2/6 | 2 |  |
| build | plain | 17/14 | 15 |  |
| building | plain | 0/1 | 1 |  |
| builds | plain | 15/4 | 3 |  |
| buildup | plain | 15/0 | 2 |  |
| built | plain | 11/3 | 11 |  |
| bulbous | plain | 3/0 | 2 |  |
| bulgaria | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| bulk | plain | 8/4 | 3 |  |
| bull | plain | 4/0 | 3 |  |
| bulla | plain | 8/0 | 2 |  |
| bulwark | plain | 2/1 | 3 |  |
| bundle | plain | 11/0 | 5 |  |
| burial | plain | 0/3 | 3 |  |
| buried | plain | 0/1 | 1 |  |
| burn | plain | 7/4 | 4 |  |
| burned | plain | 0/2 | 2 |  |
| burner | plain | 1/0 | 1 |  |
| burning | plain | 22/8 | 6 |  |
| burnt | plain | 2/1 | 3 |  |
| burrow | plain | 2/1 | 3 |  |
| burst | plain | 25/11 | 4 |  |
| bursts | plain | 1/0 | 1 |  |
| bush | plain | 12/0 | 2 |  |
| but | plain | 4/0 | 3 |  |
| butt | plain | 8/0 | 4 |  |
| button | plain | 1/0 | 1 |  |
| buy | plain | 2/0 | 2 |  |
| by | plain | 3/3 | 3 |  |
| bystanders | plain | 2/1 | 3 |  |
| byzantine | plain | 23/0 | 6 |  |
| cactus | plain | 5/2 | 3 |  |
| cadence | plain | 3/0 | 2 |  |
| cage | plain | 2/0 | 2 |  |
| caged | plain | 1/0 | 1 |  |
| cages | plain | 3/1 | 4 |  |
| cake | plain | 2/0 | 2 |  |
| calcifying | plain | 2/1 | 3 |  |
| calcite | plain | 2/0 | 2 |  |
| calf | plain | 0/4 | 1 |  |
| calfskin | plain | 5/0 | 2 |  |
| calib | technical | 2/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| calibrate | plain | 1/0 | 1 |  |
| calibrated | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| calibration | plain | 7/0 | 7 |  |
| caligae | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| call | plain | 1/0 | 1 |  |
| calling | plain | 4/0 | 2 |  |
| callings | plain | 1/0 | 1 |  |
| calls | plain | 6/3 | 3 |  |
| calm | plain | 6/2 | 3 |  |
| calms | plain | 2/1 | 3 |  |
| camera | plain | 0/1 | 1 |  |
| campaign | plain | 10/0 | 6 |  |
| campfire | plain | 2/1 | 3 |  |
| canaan | plain | 2/0 | 2 |  |
| canaanite | plain | 2/0 | 2 |  |
| cancel | plain | 5/2 | 5 |  |
| candidate | plain | 4/0 | 4 |  |
| candidates | plain | 1/0 | 1 |  |
| cane | plain | 4/1 | 5 |  |
| cannot | plain | 9/13 | 12 |  |
| canonical | plain | 8/0 | 8 |  |
| canopy | plain | 0/1 | 1 |  |
| canvas | plain | 15/0 | 9 |  |
| canyon | plain | 4/1 | 5 |  |
| cap | plain | 35/0 | 11 |  |
| cape | plain | 10/0 | 4 |  |
| caps | plain | 1/0 | 1 |  |
| capsule | plain | 2/0 | 2 |  |
| capture | plain | 1/0 | 1 |  |
| capuv | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| carapace | plain | 1/0 | 1 |  |
| card | owner | 10/32 | 9 | Owner: arcomage-like card game and "divinationcard-like items". |
| cards | plain | 7/2 | 6 |  |
| carnelian | plain | 5/0 | 2 |  |
| carousel | plain | 4/2 | 3 | plain English |
| carr | plain | 8/0 | 4 |  |
| carried | plain | 6/3 | 5 |  |
| carries | plain | 1/0 | 1 |  |
| carry | plain | 4/0 | 2 |  |
| cartographer | plain | 19/13 | 22 |  |
| carve | plain | 1/0 | 1 |  |
| carved | plain | 43/1 | 11 | Ordinary English word used in its normal meaning. |
| case | plain | 10/0 | 6 |  |
| cast | poe | 52/28 | 22 |  |
| caster | plain | 30/8 | 8 |  |
| casting | poe | 1/4 | 5 |  |
| casts | plain | 3/1 | 3 |  |
| catacombs | plain | 2/3 | 5 |  |
| catalog | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| catch | plain | 1/0 | 1 |  |
| cathedral | plain | 7/1 | 6 |  |
| cattle | plain | 2/0 | 2 |  |
| cauldron | plain | 2/0 | 2 | Real object (bronze cauldrons are attested); gui_framekit toast demo and offhand list. |
| cause | plain | 6/1 | 4 |  |
| causes | plain | 1/0 | 1 |  |
| cautery | plain | 2/0 | 2 |  |
| cave | plain | 13/6 | 10 |  |
| cavern | plain | 2/1 | 3 |  |
| caves | plain | 2/1 | 3 |  |
| cc | technical | 2/37 | 5 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| cd | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| cdn | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cdr | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cedar | plain | 4/0 | 4 |  |
| ceiling | plain | 5/2 | 4 |  |
| celestial | plain | 2/1 | 3 |  |
| cell | plain | 1/26 | 27 |  |
| cellar | plain | 0/1 | 1 |  |
| cells | plain | 1/1 | 2 |  |
| celt | plain | 2/0 | 2 |  |
| celtic | plain | 0/1 | 1 |  |
| cemetery | plain | 8/0 | 4 |  |
| censer | plain | 10/1 | 7 |  |
| center | plain | 2/0 | 1 |  |
| centered | plain | 0/1 | 1 |  |
| centers | plain | 1/0 | 1 |  |
| centipede | plain | 0/1 | 1 |  |
| central | plain | 13/1 | 10 |  |
| centre | plain | 5/2 | 3 | plain English |
| centred | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| ceremonial | plain | 1/0 | 1 |  |
| cesti | real-world or technical (doc only) | 6/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cfe | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| chain | plain | 11/12 | 9 |  |
| chained | plain | 1/1 | 2 |  |
| chaining | plain | 2/1 | 3 |  |
| chains | plain | 4/1 | 5 |  |
| chalcidian | plain | 8/0 | 4 |  |
| chalcolithic | plain | 13/0 | 7 |  |
| chalk | plain | 5/2 | 3 |  |
| chance | poe | 90/30 | 14 |  |
| change | plain | 3/1 | 3 |  |
| changed | plain | 1/1 | 2 |  |
| changes | plain | 2/1 | 3 |  |
| changing | plain | 2/0 | 2 |  |
| channel | plain | 9/3 | 7 |  |
| channeled | plain | 4/2 | 3 |  |
| channeling | plain | 0/1 | 1 |  |
| channelled | plain | 3/1 | 3 |  |
| chaos | poe | 99/66 | 22 |  |
| character | plain | 37/14 | 25 |  |
| characters | plain | 1/1 | 2 |  |
| charge | poe | 20/15 | 9 |  |
| charged | plain | 0/2 | 1 | Plain adjective (aura-lab layer "Charged"). The aura-lab layer "Charged runes" is purged separately (rule 13). |
| charges | poe | 6/12 | 5 |  |
| charm | poe | 6/0 | 1 |  |
| charms | poe | 2/0 | 2 |  |
| charred | plain | 12/7 | 4 |  |
| charring | plain | 0/1 | 1 |  |
| chase | plain | 2/0 | 1 |  |
| chasm | plain | 7/3 | 4 |  |
| chat | plain | 1/0 | 1 |  |
| cheap | plain | 1/0 | 1 |  |
| cheaper | plain | 1/1 | 2 | "Cheaper Repeated Spells" describes the effect. |
| check | plain | 7/0 | 6 |  |
| checked | plain | 1/0 | 1 |  |
| checking | plain | 2/0 | 2 |  |
| checkpoint | real-world or technical (doc only) | 3/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| checks | plain | 1/0 | 1 |  |
| cheek | plain | 11/0 | 4 |  |
| chertsey | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| chest | plain | 9/2 | 5 |  |
| chevron | plain | 3/0 | 2 |  |
| chief | plain | 1/0 | 1 |  |
| chill | poe | 16/9 | 9 |  |
| chilled | poe | 10/7 | 5 |  |
| chilling | plain | 2/1 | 3 |  |
| chills | plain | 2/1 | 3 |  |
| chin | plain | 3/0 | 2 |  |
| china | plain | 1/0 | 1 |  |
| chinese | plain | 1/0 | 1 |  |
| chisel | plain | 1/0 | 1 |  |
| chitin | plain | 4/2 | 3 |  |
| chlamys | plain | 2/0 | 2 |  |
| chlorine | plain | 2/1 | 3 |  |
| choice | plain | 1/0 | 1 |  |
| choose | plain | 23/12 | 17 |  |
| chosen | plain | 3/2 | 5 |  |
| chroma | plain | 1/0 | 1 |  |
| chromatic | plain | 2/0 | 2 |  |
| chrome | plain | 2/0 | 2 |  |
| chronicle | plain | 4/0 | 4 |  |
| chronicles | plain | 6/0 | 3 |  |
| chunk | plain | 1/0 | 1 |  |
| chunks | plain | 2/2 | 4 |  |
| ci | real-world or technical (doc only) | 4/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cinder | plain | 4/2 | 3 |  |
| cinematic | plain | 1/0 | 1 |  |
| cinzel | technical | 3/0 | 3 | Font. |
| circle | plain | 1/6 | 5 |  |
| circles | plain | 1/1 | 2 |  |
| circlet | plain | 3/0 | 2 |  |
| circuit | plain | 3/0 | 3 |  |
| circuits | plain | 2/2 | 4 |  |
| circular | plain | 2/0 | 1 |  |
| cista | plain | 2/0 | 2 |  |
| cistern | plain | 0/1 | 1 |  |
| cisterns | plain | 0/1 | 1 |  |
| citadel | plain | 1/0 | 1 |  |
| citrine | plain | 2/1 | 3 |  |
| city | plain | 2/31 | 7 |  |
| clang | plain | 0/1 | 1 |  |
| clappers | plain | 2/0 | 2 |  |
| clarity | plain | 2/1 | 3 |  |
| clash | plain | 0/1 | 1 |  |
| clasp | plain | 6/0 | 2 |  |
| class | plain | 48/35 | 13 |  |
| classic | plain | 4/1 | 5 |  |
| classical | plain | 20/0 | 5 |  |
| classification | plain | 1/0 | 1 |  |
| claude | plain | 8/0 | 7 |  |
| claw | poe | 7/11 | 12 |  |
| claws | poe | 14/2 | 6 |  |
| clay | plain | 15/3 | 6 | plain English in its literal sense only (the material, e.g. a clay liver model; the currency is Reroll Values); never a  |
| clayweight | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| clean | plain | 28/7 | 8 |  |
| clear | plain | 18/3 | 15 |  |
| clearest | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cleave | plain | 3/0 | 1 |  |
| cleaver | plain | 5/0 | 3 |  |
| cleavers | plain | 3/1 | 4 |  |
| click | plain | 18/7 | 9 |  |
| cliff | plain | 0/7 | 1 |  |
| climb | plain | 1/0 | 1 |  |
| climbing | plain | 1/0 | 1 |  |
| clip | plain | 1/5 | 6 |  |
| clipboard | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cloak | plain | 26/1 | 11 |  |
| cloaks | plain | 3/0 | 2 |  |
| clock | plain | 2/1 | 3 |  |
| cloister | plain | 1/1 | 2 |  |
| clonbrin | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| close | plain | 28/6 | 20 |  |
| closed | plain | 8/4 | 11 |  |
| closing | plain | 2/1 | 3 | plain English |
| closure | plain | 12/0 | 2 |  |
| closures | plain | 6/0 | 2 |  |
| cloth | plain | 6/0 | 5 |  |
| cloud | plain | 17/12 | 11 |  |
| clouds | plain | 2/1 | 3 |  |
| club | plain | 35/4 | 11 |  |
| clubs | plain | 2/0 | 2 |  |
| cluster | plain | 5/1 | 5 |  |
| clutter | plain | 1/0 | 1 |  |
| coal | plain | 2/1 | 3 |  |
| coarse | plain | 6/0 | 2 |  |
| coast | plain | 44/2 | 7 |  |
| coastal | plain | 0/2 | 1 |  |
| coats | plain | 2/1 | 3 |  |
| cobble | plain | 0/1 | 1 |  |
| code | plain | 5/0 | 4 |  |
| codes | plain | 1/0 | 1 |  |
| codex | plain | 6/15 | 4 |  |
| coffer | plain | 1/0 | 1 |  |
| coherent | plain | 5/0 | 3 |  |
| coil | plain | 8/2 | 5 |  |
| coiled | plain | 2/0 | 1 |  |
| coin | plain | 7/1 | 5 |  |
| coined | plain | 3/0 | 2 |  |
| coins | plain | 16/7 | 3 |  |
| cold | poe | 99/70 | 36 |  |
| collages | plain | 2/0 | 2 |  |
| collapse | plain | 4/0 | 2 |  |
| collapsed | plain | 3/2 | 5 | Ordinary English word used in its normal meaning. |
| collapsible | plain | 1/0 | 1 |  |
| collar | plain | 6/0 | 2 |  |
| collect | plain | 2/0 | 1 |  |
| collection | plain | 0/2 | 1 |  |
| collision | plain | 2/1 | 3 |  |
| colonnades | plain | 1/1 | 2 |  |
| color | plain | 13/3 | 9 |  |
| colors | plain | 1/0 | 1 |  |
| colour | plain | 6/3 | 3 | plain English |
| colours | plain | 1/0 | 1 | plain English (British spelling) |
| column | plain | 5/1 | 6 |  |
| columns | plain | 2/0 | 2 |  |
| combat | plain | 12/12 | 14 |  |
| combine | plain | 1/0 | 1 |  |
| combo | plain | 3/1 | 3 | Ordinary English word used in its normal meaning. |
| combos | plain | 1/0 | 1 | plain English |
| comet | plain | 2/1 | 3 |  |
| command | plain | 9/0 | 5 |  |
| commit | plain | 4/0 | 4 |  |
| committed | plain | 0/5 | 2 | Ordinary English word used in its normal meaning. |
| commons | plain | 0/1 | 1 |  |
| community | plain | 2/0 | 2 |  |
| compact | plain | 8/0 | 7 |  |
| companion | poe | 39/28 | 8 |  |
| companions | poe | 25/5 | 7 |  |
| compare | plain | 1/0 | 1 |  |
| comparison | plain | 1/0 | 1 |  |
| compass | plain | 1/0 | 1 |  |
| compiled | technical | 1/0 | 1 | graphics or tooling term in a WIZARD lab page |
| complete | plain | 34/3 | 14 |  |
| completed | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| completeness | plain | 1/0 | 1 |  |
| component | plain | 2/0 | 2 |  |
| components | plain | 3/0 | 3 |  |
| compose | plain | 2/0 | 2 |  |
| composed | plain | 2/0 | 2 |  |
| composite | plain | 6/0 | 3 |  |
| composites | plain | 1/0 | 1 |  |
| composition | plain | 0/2 | 1 |  |
| con | plain | 1/0 | 1 |  |
| concentric | plain | 4/2 | 6 |  |
| concrete | plain | 6/0 | 3 |  |
| condensation | plain | 5/2 | 3 |  |
| condenses | plain | 2/1 | 3 |  |
| condensing | plain | 3/0 | 1 | plain English |
| conditionals | plain | 2/0 | 1 |  |
| conduit | plain | 3/0 | 1 |  |
| conduits | plain | 2/0 | 1 |  |
| cone | plain | 2/2 | 4 |  |
| conf | real-world or technical (doc only) | 10/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| confetti | plain | 6/3 | 3 | plain English |
| confidence | plain | 1/0 | 1 |  |
| configurable | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| confirm | plain | 10/0 | 5 |  |
| conical | plain | 6/0 | 2 |  |
| conifer | plain | 0/3 | 3 |  |
| conjuration | plain | 1/0 | 1 |  |
| conjurations | plain | 1/0 | 1 |  |
| connect | plain | 1/1 | 2 |  |
| connected | plain | 2/3 | 4 |  |
| connecting | plain | 0/4 | 1 |  |
| connection | plain | 0/1 | 1 |  |
| conservative | plain | 2/0 | 2 |  |
| console | plain | 0/2 | 1 |  |
| consolidate | plain | 1/0 | 1 |  |
| constellation | plain | 3/1 | 3 |  |
| constitution | plain | 3/0 | 1 |  |
| constrain | plain | 1/0 | 1 |  |
| construct | plain | 14/1 | 4 |  |
| construction | plain | 2/1 | 3 |  |
| constructs | plain | 12/5 | 3 |  |
| consumable | plain | 5/0 | 1 |  |
| consume | plain | 0/2 | 2 |  |
| consumed | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| contact | plain | 8/1 | 3 |  |
| contained | plain | 2/0 | 2 |  |
| contains | plain | 0/1 | 1 |  |
| content | plain | 4/1 | 5 |  |
| contents | plain | 1/0 | 1 |  |
| context | plain | 1/0 | 1 |  |
| continents | plain | 2/0 | 2 |  |
| continuation | plain | 1/0 | 1 |  |
| continue | plain | 2/1 | 3 |  |
| continuing | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| continuous | plain | 6/5 | 9 |  |
| contraband | plain | 1/1 | 2 |  |
| contract | plain | 1/0 | 1 |  |
| contrail | plain | 1/0 | 1 |  |
| contrast | plain | 1/0 | 1 |  |
| contributing | real-world or technical (doc only) | 3/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| contributions | plain | 3/0 | 3 |  |
| control | plain | 4/1 | 5 |  |
| controls | plain | 11/0 | 9 |  |
| conversion | plain | 1/0 | 1 |  |
| conviction | poe | 0/4 | 2 |  |
| cooldown | poe | 18/18 | 15 |  |
| cooling | plain | 6/2 | 3 |  |
| coolus | real-world or technical (doc only) | 8/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cooper | plain | 1/0 | 1 | Real occupation word in rp_account_creator background list. |
| coordinated | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| copied | plain | 7/0 | 4 |  |
| copper | plain | 160/7 | 27 |  |
| coptic | plain | 2/0 | 2 |  |
| copy | plain | 30/2 | 19 |  |
| coral | plain | 3/0 | 3 |  |
| corbridge | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cord | plain | 47/1 | 8 |  |
| corded | plain | 11/0 | 4 |  |
| cords | plain | 4/0 | 3 |  |
| core | plain | 19/3 | 8 |  |
| corinthian | plain | 9/0 | 4 |  |
| cork | plain | 2/0 | 1 |  |
| corked | plain | 2/1 | 3 |  |
| corkscrew | plain | 1/0 | 1 |  |
| corner | plain | 1/5 | 3 |  |
| corners | plain | 3/0 | 1 |  |
| cornu | plain | 2/0 | 2 |  |
| corpse | plain | 17/10 | 8 |  |
| corpses | plain | 8/4 | 3 |  |
| correct | plain | 2/0 | 2 |  |
| correction | plain | 2/0 | 2 |  |
| corrections | plain | 1/0 | 1 |  |
| corridor | plain | 15/0 | 2 |  |
| corridors | plain | 1/0 | 1 |  |
| corrupt | plain | 2/0 | 1 |  |
| corselet | plain | 13/0 | 3 |  |
| corslet | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cosmetic | plain | 1/0 | 1 |  |
| cosmetics | plain | 7/2 | 4 |  |
| cost | plain | 6/7 | 8 |  |
| costs | plain | 1/0 | 1 |  |
| costume | plain | 3/0 | 2 |  |
| could | plain | 3/28 | 12 |  |
| count | plain | 5/6 | 6 |  |
| counting | plain | 1/0 | 1 |  |
| countryside | plain | 0/1 | 1 |  |
| counts | plain | 3/2 | 5 |  |
| courtenay | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| courtyard | plain | 0/1 | 1 |  |
| courtyards | plain | 1/1 | 2 |  |
| coverage | plain | 7/0 | 5 |  |
| covers | plain | 2/1 | 3 |  |
| cowhide | plain | 5/0 | 2 |  |
| cowl | plain | 2/0 | 2 |  |
| cowork | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cowrie | plain | 2/0 | 2 |  |
| cpu | technical | 2/2 | 4 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| crab | plain | 1/0 | 1 |  |
| crack | plain | 9/5 | 4 |  |
| crackle | plain | 0/1 | 1 |  |
| cracks | plain | 2/2 | 4 |  |
| cradle | plain | 5/0 | 4 |  |
| craft | owner | 12/0 | 7 | owner (ledger) |
| crafting | owner | 15/0 | 9 | owner: 'crafting should be more like PoE' (ledger) |
| crate | plain | 3/0 | 1 |  |
| crater | plain | 6/4 | 4 |  |
| craters | plain | 4/2 | 3 |  |
| crates | plain | 3/0 | 1 |  |
| crawl | plain | 202/100 | 3 |  |
| crawlers | plain | 1/0 | 1 |  |
| cream | plain | 3/0 | 2 |  |
| create | plain | 11/5 | 11 |  |
| creates | plain | 7/3 | 4 |  |
| creative | owner | 4/5 | 5 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| creator | plain | 12/0 | 8 |  |
| crescent | plain | 5/0 | 4 |  |
| crescents | plain | 2/1 | 3 |  |
| crest | plain | 10/0 | 6 | plain English in its literal sense only (a feather crest on a cap); never a name, theme or tag of a mechanic (the retire |
| crested | plain | 1/0 | 1 |  |
| crimson | plain | 7/0 | 3 |  |
| crisp | plain | 3/0 | 2 |  |
| crit | poe | 3/3 | 4 |  |
| critical | poe | 73/41 | 20 |  |
| criticals | plain | 2/1 | 3 |  |
| crocodile | plain | 5/2 | 6 |  |
| cross | plain | 13/2 | 7 |  |
| crossband | plain | 2/0 | 2 |  |
| crossbar | plain | 2/0 | 2 |  |
| crossroads | plain | 2/1 | 3 |  |
| crown | plain | 10/3 | 6 |  |
| crowned | plain | 2/0 | 2 |  |
| cruise | plain | 1/0 | 1 |  |
| crumble | plain | 1/0 | 1 |  |
| crumbling | plain | 1/0 | 1 | "Crumbling Ruins" (rp_account_creator) is a plain terrain description. |
| crusader | plain | 1/0 | 1 |  |
| crushed | plain | 2/1 | 3 |  |
| crust | plain | 6/3 | 3 |  |
| cry | plain | 6/0 | 2 |  |
| crypt | plain | 5/2 | 6 |  |
| crypts | plain | 1/0 | 1 |  |
| crystal | plain | 9/6 | 5 |  |
| crystals | plain | 2/1 | 3 |  |
| css | technical | 8/0 | 7 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| csv | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cudgel | plain | 9/1 | 7 |  |
| cueva | plain | 6/0 | 2 |  |
| cuff | plain | 3/0 | 3 |  |
| cuffs | plain | 6/0 | 2 |  |
| cuirass | plain | 18/0 | 5 |  |
| curated | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| curio | plain | 43/11 | 19 | Plain English object word (small curious object); not a PoE term in this meaning (PoE Heist curios are displays). |
| curios | plain | 6/0 | 3 |  |
| currencies | plain | 2/0 | 1 |  |
| currency | poe | 4/1 | 4 |  |
| current | plain | 22/1 | 16 |  |
| curse | poe | 20/2 | 7 |  |
| cursed | plain | 0/4 | 3 |  |
| curses | poe | 8/3 | 4 |  |
| curtain | plain | 2/1 | 3 |  |
| curved | plain | 7/1 | 4 |  |
| cushion | plain | 1/0 | 1 |  |
| custom | plain | 3/0 | 3 |  |
| customisation | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| customization | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| customize | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cut | plain | 2/2 | 4 |  |
| cycladic | plain | 12/0 | 4 |  |
| cycles | plain | 0/10 | 1 |  |
| cyclonic | plain | 1/0 | 1 |  |
| cypress | plain | 0/3 | 2 |  |
| cypriot | real-world or technical (doc only) | 12/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| cyprus | real-world or technical (doc only) | 3/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| daa | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| dag | plain | 12/0 | 1 |  |
| dagger | poe | 31/1 | 9 |  |
| daggers | poe | 1/0 | 1 |  |
| dais | plain | 1/0 | 1 |  |
| damage | poe | 382/207 | 33 |  |
| dancer | plain | 4/2 | 3 |  |
| danger | plain | 2/0 | 2 |  |
| danish | plain | 3/0 | 2 |  |
| dark | plain | 112/31 | 12 |  |
| darkness | plain | 2/1 | 3 |  |
| dart | plain | 4/0 | 4 |  |
| dash | plain | 4/1 | 4 |  |
| dashboard | plain | 2/0 | 2 |  |
| data | plain | 3/0 | 3 |  |
| date | plain | 0/1 | 1 |  |
| dawn | plain | 9/2 | 6 |  |
| daylight | plain | 0/1 | 1 |  |
| dazed | plain | 0/1 | 1 |  |
| db | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| dc | technical | 1/40 | 3 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| dead | plain | 9/1 | 9 |  |
| deadfall | plain | 2/0 | 2 |  |
| deal | plain | 0/6 | 2 |  |
| deals | plain | 15/7 | 4 |  |
| death | plain | 2/2 | 4 |  |
| debris | plain | 14/8 | 4 |  |
| debug | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| debugged | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| decals | plain | 1/0 | 1 |  |
| decay | plain | 0/1 | 1 |  |
| decayed | plain | 0/4 | 3 |  |
| decision | plain | 11/0 | 6 |  |
| decisions | plain | 1/0 | 1 |  |
| deck | owner | 4/2 | 3 | Owner: "build-a-deck menu". |
| decks | plain | 0/1 | 1 |  |
| declare | plain | 2/0 | 2 |  |
| declared | plain | 0/1 | 1 |  |
| decorated | plain | 5/0 | 3 |  |
| deed | plain | 7/1 | 6 |  |
| deeds | plain | 8/0 | 3 |  |
| deep | plain | 22/10 | 5 |  |
| deepen | plain | 1/0 | 1 |  |
| deeper | plain | 6/4 | 4 | "Deeper Wither/Chill/Poison" describe the effect. |
| deer | plain | 2/16 | 3 |  |
| def | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| default | plain | 44/0 | 16 |  |
| defaults | plain | 2/0 | 2 |  |
| defeated | plain | 0/1 | 1 |  |
| defence | plain | 0/1 | 1 |  |
| defense | plain | 2/1 | 3 |  |
| defenses | plain | 1/0 | 1 |  |
| define | plain | 1/0 | 1 |  |
| definition | plain | 2/0 | 2 |  |
| deflect | plain | 5/2 | 3 |  |
| deflection | plain | 2/1 | 3 |  |
| delaford | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| delete | plain | 2/0 | 2 |  |
| deleted | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| deleting | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| deliberately | plain | 0/25 | 25 |  |
| deliverables | plain | 1/0 | 1 |  |
| deluge | plain | 2/1 | 3 |  |
| demo | plain | 2/0 | 1 | Ordinary English word used in its normal meaning. |
| demon | plain | 0/5 | 1 |  |
| demonhide | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| dendra | real-world | 21/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| denmark | plain | 17/0 | 6 |  |
| dense | plain | 9/5 | 5 |  |
| density | plain | 17/8 | 4 |  |
| dependencies | plain | 7/0 | 3 |  |
| dependency | plain | 3/0 | 3 |  |
| deploy | plain | 2/0 | 2 |  |
| deposit | plain | 1/0 | 1 |  |
| depth | plain | 6/1 | 7 |  |
| derelict | plain | 2/1 | 3 |  |
| derivative | plain | 1/0 | 1 |  |
| derived | plain | 1/0 | 1 |  |
| desc | technical | 20/0 | 7 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| descend | plain | 0/2 | 2 |  |
| descent | plain | 4/1 | 4 |  |
| describe | plain | 4/0 | 3 |  |
| descriptions | plain | 1/0 | 1 |  |
| descs | real-world or technical (doc only) | 6/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| desert | plain | 2/6 | 7 |  |
| design | plain | 22/0 | 14 |  |
| designer | plain | 17/0 | 5 |  |
| desktop | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| destination | plain | 0/1 | 1 |  |
| destroy | plain | 2/0 | 2 |  |
| destroyed | plain | 1/0 | 1 |  |
| destroys | plain | 4/2 | 3 |  |
| destructive | owner | 4/5 | 5 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| details | plain | 7/1 | 8 |  |
| detection | plain | 1/0 | 1 |  |
| determinism | plain | 4/0 | 3 |  |
| deterministic | plain | 3/0 | 3 |  |
| deterministically | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| detonates | plain | 2/1 | 3 |  |
| deve | real-world or technical (doc only) | 10/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| developed | plain | 3/0 | 1 |  |
| developer | plain | 1/0 | 1 |  |
| development | plain | 1/0 | 1 |  |
| device | plain | 10/0 | 2 |  |
| devilution | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| devotion | plain | 2/0 | 1 |  |
| dex | owner | 543/86 | 40 | PoE attribute abbreviation; owner uses "dex". |
| dexterity | poe | 74/35 | 22 |  |
| diablo | real-world | 31/0 | 12 | Reference game named in docs. |
| diagonal | plain | 3/0 | 2 |  |
| diamond | plain | 4/1 | 3 |  |
| different | plain | 0/1 | 1 |  |
| difficulty | plain | 29/0 | 4 |  |
| digging | plain | 2/1 | 3 |  |
| digits | plain | 3/1 | 3 |  |
| dim | plain | 2/2 | 4 |  |
| dimension | plain | 1/1 | 2 |  |
| dimensional | owner | 1/0 | 1 | owner lattice canon |
| dimmed | plain | 0/1 | 1 |  |
| dipper | plain | 2/0 | 2 |  |
| diptych | plain | 2/0 | 2 |  |
| dipylon | plain | 5/0 | 5 |  |
| dire | plain | 1/0 | 1 |  |
| direct | plain | 29/2 | 9 |  |
| directed | plain | 1/0 | 1 |  |
| direction | plain | 11/0 | 6 |  |
| directional | plain | 1/1 | 2 |  |
| directly | plain | 4/0 | 3 |  |
| directory | plain | 2/0 | 1 |  |
| dirk | plain | 6/0 | 4 |  |
| dirt | plain | 1/0 | 1 |  |
| disabled | plain | 4/0 | 4 |  |
| disc | plain | 7/0 | 6 |  |
| discard | plain | 5/2 | 6 |  |
| discarded | plain | 1/1 | 2 |  |
| discarding | plain | 0/1 | 1 |  |
| discharge | plain | 1/0 | 1 |  |
| discipline | plain | 1/0 | 1 |  |
| disconnected | plain | 1/1 | 2 |  |
| disintegration | plain | 2/1 | 3 |  |
| disk | plain | 2/1 | 3 |  |
| dismantle | plain | 0/1 | 1 |  |
| disp | technical | 21/0 | 3 | Code token / file format (Disp = "disputed" confidence class in skill-zone-items.html). |
| dispatch | plain | 3/0 | 2 |  |
| dispersal | plain | 2/1 | 3 |  |
| dispersion | plain | 4/2 | 3 |  |
| displaced | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| display | plain | 1/4 | 3 |  |
| dispose | plain | 0/1 | 1 |  |
| disrupt | plain | 0/1 | 1 |  |
| dissimilar | plain | 1/0 | 1 |  |
| dissolve | plain | 2/1 | 3 |  |
| distance | plain | 1/0 | 1 |  |
| distant | plain | 2/1 | 3 |  |
| distilled | plain | 1/0 | 1 |  |
| distinct | plain | 1/7 | 3 |  |
| distortion | plain | 1/0 | 1 |  |
| distribution | plain | 1/0 | 1 |  |
| diversity | plain | 1/0 | 1 |  |
| divider | plain | 1/0 | 1 |  |
| dividing | plain | 1/1 | 2 |  |
| divinations | plain | 1/0 | 1 |  |
| divine | plain | 1/0 | 1 |  |
| diving | plain | 0/1 | 1 |  |
| dizzy | plain | 0/1 | 1 |  |
| dm | technical | 1/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| do | plain | 155/0 | 28 |  |
| dockable | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| docked | plain | 0/1 | 1 |  |
| docker | plain | 4/0 | 1 |  |
| docs | plain | 2/0 | 2 |  |
| document | plain | 2/0 | 2 |  |
| dodge | poe | 7/1 | 4 |  |
| dog | plain | 2/1 | 3 |  |
| doloneia | real-world | 6/0 | 2 | Iliad Book 10, literary source cited in item-types doc. |
| dom | plain | 3/0 | 3 |  |
| domcontentloaded | technical | 3/0 | 3 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| dome | plain | 3/0 | 2 |  |
| domed | plain | 8/0 | 4 |  |
| dont | plain | 2/0 | 2 |  |
| donut | plain | 0/5 | 4 | Plain shape word in a monster ability ("Donut Eruption", SpellRules.cs); describes the ring-shaped area. |
| door | plain | 3/8 | 6 |  |
| doorway | plain | 2/1 | 3 |  |
| double | plain | 7/3 | 7 |  |
| doubling | plain | 2/2 | 2 |  |
| down | plain | 2/1 | 3 |  |
| downed | plain | 1/0 | 1 |  |
| downhill | plain | 2/1 | 3 |  |
| download | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| downloads | technical | 209/0 | 18 | File path. |
| downward | plain | 0/1 | 1 |  |
| dpr | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| dps | owner | 8/1 | 6 | Owner: "damage per second". |
| draft | plain | 2/1 | 2 |  |
| drag | plain | 15/12 | 12 |  |
| dragging | plain | 0/1 | 1 |  |
| dragon | plain | 5/2 | 3 |  |
| drain | plain | 15/10 | 8 |  |
| drainage | plain | 0/4 | 3 |  |
| drained | plain | 0/1 | 1 |  |
| draining | plain | 0/1 | 1 |  |
| drains | plain | 2/1 | 3 |  |
| drake | plain | 8/2 | 3 |  |
| dramatic | plain | 1/0 | 1 |  |
| draped | plain | 3/0 | 2 | Ordinary English word used in its normal meaning. |
| draw | plain | 2/2 | 3 |  |
| drawing | plain | 2/0 | 1 |  |
| drawn | plain | 6/1 | 3 |  |
| draws | plain | 4/2 | 3 |  |
| drawstring | plain | 3/0 | 2 |  |
| dread | plain | 0/1 | 1 |  |
| dried | plain | 2/1 | 3 |  |
| drifting | plain | 2/1 | 3 |  |
| driftwood | plain | 2/0 | 1 |  |
| drill | plain | 1/0 | 1 |  |
| drilled | plain | 7/0 | 4 |  |
| drills | plain | 2/1 | 3 |  |
| drink | plain | 5/2 | 5 |  |
| drinking | plain | 1/1 | 2 |  |
| drip | plain | 4/2 | 3 |  |
| dripping | plain | 3/1 | 3 |  |
| drips | plain | 3/1 | 2 |  |
| drive | plain | 3/1 | 4 |  |
| drives | plain | 2/1 | 3 |  |
| drizzle | plain | 2/1 | 3 |  |
| drool | plain | 1/0 | 1 |  |
| drop | plain | 4/0 | 2 |  |
| droplets | plain | 3/1 | 3 |  |
| drops | plain | 2/1 | 3 |  |
| druid | plain | 1/0 | 1 |  |
| drum | plain | 5/0 | 4 |  |
| dry | plain | 14/12 | 8 |  |
| dsp | technical | 0/23 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| dto | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| dual | plain | 6/3 | 4 |  |
| dubitatus | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| duerrenberg | real-world | 9/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| dune | plain | 0/2 | 2 |  |
| dungeon | plain | 13/10 | 13 |  |
| duplicate | plain | 10/2 | 5 |  |
| durable | plain | 2/0 | 1 |  |
| duration | poe | 1/0 | 1 |  |
| during | plain | 2/1 | 3 |  |
| dusk | plain | 6/3 | 4 |  |
| dust | plain | 99/51 | 6 |  |
| dye | plain | 3/0 | 3 |  |
| dyed | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| dyes | plain | 2/0 | 2 |  |
| dynamic | plain | 7/3 | 4 |  |
| dynastic | real-world | 5/0 | 4 | Egyptian period name. |
| dynasty | plain | 8/0 | 4 |  |
| ea | plain | 22/0 | 4 |  |
| each | plain | 161/61 | 33 |  |
| ear | plain | 3/0 | 2 |  |
| earlier | plain | 6/0 | 4 | Ordinary English word used in its normal meaning. |
| early | plain | 65/0 | 10 |  |
| earn | plain | 1/0 | 1 |  |
| earth | owner | 27/15 | 10 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| earthenware | plain | 2/0 | 2 |  |
| east | plain | 9/0 | 4 |  |
| eastern | plain | 18/0 | 5 |  |
| echo | plain | 3/0 | 2 |  |
| echoing | plain | 1/0 | 1 |  |
| eclipse | plain | 1/0 | 1 |  |
| edge | plain | 16/3 | 7 |  |
| edged | plain | 8/0 | 3 |  |
| edges | plain | 3/0 | 1 |  |
| edit | plain | 6/0 | 5 |  |
| editing | plain | 0/1 | 1 |  |
| editor | plain | 1/0 | 1 |  |
| edits | plain | 2/0 | 2 |  |
| ee | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| efface | plain | 1/0 | 1 |  |
| effacing | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| effect | poe | 190/83 | 15 |  |
| effective | plain | 5/1 | 4 |  |
| effects | plain | 8/4 | 10 |  |
| efficient | plain | 2/3 | 5 |  |
| egg | plain | 6/3 | 3 |  |
| egtved | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| egypt | plain | 24/0 | 9 |  |
| egyptian | plain | 86/0 | 13 |  |
| ehp | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| eight | plain | 11/6 | 6 |  |
| eighteen | plain | 0/1 | 1 |  |
| eighteenth | plain | 4/0 | 3 |  |
| eighth | plain | 2/0 | 2 |  |
| either | plain | 1/0 | 1 |  |
| elder | plain | 1/0 | 1 |  |
| element | plain | 10/5 | 8 |  |
| elemental | poe | 6/0 | 2 |  |
| elementals | plain | 2/1 | 3 |  |
| elevation | plain | 1/0 | 1 |  |
| elite | plain | 9/3 | 5 |  |
| elixir | plain | 2/0 | 2 |  |
| embedding | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ember | plain | 71/45 | 19 | plain English in its literal sense only (embers in a fire (rule 11); never the Fire damage type (rule 5)); never a name, |
| embers | plain | 107/50 | 8 | plain English in its literal sense only (embers in a fire); never a name, theme or tag of a mechanic (the retired-name p |
| embossed | plain | 2/0 | 2 |  |
| embroidered | plain | 3/0 | 2 |  |
| emerald | plain | 2/1 | 3 |  |
| emerge | plain | 2/1 | 3 |  |
| emergence | plain | 1/0 | 1 |  |
| emission | plain | 2/1 | 3 |  |
| emissive | plain | 2/0 | 2 |  |
| emits | plain | 2/1 | 3 |  |
| emitter | plain | 2/1 | 3 |  |
| empire | plain | 3/0 | 2 |  |
| empowered | plain | 3/0 | 1 |  |
| empty | plain | 109/13 | 14 |  |
| enable | plain | 2/0 | 2 |  |
| enchant | plain | 2/1 | 3 |  |
| enchantment | owner | 4/1 | 4 | owner (ledger) |
| enclosed | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| enclosure | plain | 1/0 | 1 |  |
| enclosures | plain | 2/1 | 3 |  |
| encounter | plain | 4/1 | 2 |  |
| encumbrance | plain | 1/0 | 1 |  |
| end | plain | 1/0 | 1 |  |
| endgame | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| endless | plain | 1/0 | 1 |  |
| ends | plain | 3/0 | 2 |  |
| endurance | poe | 0/4 | 3 |  |
| enemies | plain | 24/12 | 6 |  |
| enemy | plain | 10/10 | 9 |  |
| energy | plain | 14/14 | 8 |  |
| enforced | plain | 1/0 | 1 |  |
| engage | plain | 2/0 | 1 |  |
| engine | plain | 2/0 | 2 |  |
| english | plain | 2/0 | 2 |  |
| engraving | plain | 2/1 | 3 |  |
| enhance | plain | 1/0 | 1 |  |
| enhanced | plain | 1/0 | 1 |  |
| enhancements | plain | 1/0 | 1 |  |
| enrage | plain | 0/3 | 3 |  |
| enter | plain | 19/3 | 16 |  |
| entered | plain | 2/0 | 1 |  |
| entire | plain | 1/0 | 1 |  |
| entirely | plain | 1/0 | 1 |  |
| entrance | plain | 0/2 | 1 |  |
| entries | plain | 1/0 | 1 |  |
| entropy | plain | 1/0 | 1 |  |
| entry | plain | 1/0 | 1 |  |
| environment | plain | 1/0 | 1 |  |
| epoch | plain | 5/0 | 4 |  |
| eqs | technical | 1/0 | 1 | graphics or tooling term in a WIZARD lab page |
| equip | plain | 8/0 | 7 |  |
| equipment | plain | 14/2 | 12 |  |
| equippable | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| equipped | plain | 7/3 | 9 | Ordinary English word used in its normal meaning. |
| era | plain | 28/0 | 2 |  |
| erase | plain | 1/0 | 1 |  |
| eroded | plain | 1/3 | 4 |  |
| eruption | plain | 19/9 | 7 |  |
| es | plain | 9/0 | 5 |  |
| esc | technical | 0/1 | 1 | Key name; owner: "'esc' needs to pause the game". |
| escape | plain | 12/0 | 10 |  |
| escarpment | plain | 2/2 | 2 |  |
| eshoej | real-world | 15/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| esparto | plain | 10/0 | 2 |  |
| essence | plain | 1/0 | 1 |  |
| ethnographic | plain | 1/0 | 1 |  |
| etruscan | plain | 16/0 | 6 |  |
| eurasia | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| europe | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| european | plain | 7/0 | 3 |  |
| ev | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| evaded | poe | 2/2 | 4 | PoE Evasion vocabulary in same meaning ("Hits Cannot Be Evaded"). |
| evading | poe | 2/1 | 3 | PoE Evasion vocabulary. |
| evasion | poe | 94/68 | 16 |  |
| event | plain | 3/1 | 4 |  |
| every | plain | 110/20 | 43 |  |
| everyday | plain | 3/0 | 2 |  |
| everyone | plain | 1/1 | 2 |  |
| everything | plain | 15/4 | 12 |  |
| evidence | plain | 10/0 | 6 |  |
| evocations | plain | 21/10 | 3 |  |
| evocative | plain | 1/0 | 1 |  |
| ewer | plain | 4/0 | 3 |  |
| exact | plain | 3/2 | 4 |  |
| exactly | plain | 3/0 | 3 |  |
| example | plain | 5/0 | 5 |  |
| examples | plain | 3/0 | 3 |  |
| excavated | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| exceptional | plain | 2/0 | 1 |  |
| exchange | plain | 1/0 | 1 |  |
| exclude | plain | 2/0 | 2 |  |
| excluding | plain | 3/0 | 3 |  |
| exclusive | plain | 1/1 | 2 |  |
| executable | plain | 13/0 | 1 |  |
| execute | poe | 2/8 | 8 |  |
| exercise | plain | 1/1 | 2 |  |
| exile | plain | 36/1 | 15 |  |
| existing | plain | 15/14 | 21 |  |
| exists | plain | 3/0 | 1 |  |
| exit | plain | 9/5 | 4 |  |
| exits | plain | 1/0 | 1 |  |
| exotic | plain | 2/0 | 2 |  |
| expand | plain | 5/0 | 4 |  |
| expansion | plain | 3/0 | 3 |  |
| expect | plain | 2/0 | 2 |  |
| expected | plain | 3/0 | 3 |  |
| expedition | plain | 5/1 | 3 |  |
| experience | plain | 3/11 | 5 |  |
| experiments | plain | 1/0 | 1 |  |
| explicit | poe | 3/0 | 3 |  |
| explicitly | plain | 2/0 | 1 |  |
| exploding | plain | 4/2 | 3 | plain English |
| exploration | plain | 1/20 | 5 |  |
| exploratory | plain | 1/0 | 1 |  |
| explore | plain | 5/1 | 5 |  |
| exploring | plain | 6/0 | 2 |  |
| explosion | plain | 7/14 | 9 |  |
| explosions | plain | 1/0 | 1 |  |
| exponential | plain | 2/1 | 3 |  |
| export | plain | 28/1 | 21 |  |
| exported | plain | 1/0 | 1 |  |
| exports | plain | 2/0 | 2 |  |
| expose | plain | 3/1 | 4 |  |
| exposed | plain | 1/1 | 2 |  |
| exposure | poe | 3/1 | 4 |  |
| exr | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ext | technical | 2/0 | 1 | graphics or tooling term in a WIZARD lab page |
| extension | plain | 0/1 | 1 |  |
| extent | plain | 1/0 | 1 |  |
| external | plain | 1/0 | 1 |  |
| extra | plain | 51/10 | 22 |  |
| extract | plain | 2/1 | 3 |  |
| extraction | plain | 6/0 | 5 |  |
| extreme | plain | 2/0 | 2 |  |
| extremely | plain | 1/0 | 1 |  |
| eye | plain | 22/8 | 6 |  |
| eyeball | plain | 4/2 | 3 |  |
| eyedropper | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| eyes | plain | 6/2 | 3 |  |
| fa | plain | 1/1 | 2 |  |
| fable | plain | 3/0 | 3 |  |
| face | plain | 4/0 | 3 |  |
| faced | plain | 2/0 | 1 |  |
| facet | plain | 3/1 | 3 |  |
| faction | plain | 14/2 | 7 |  |
| factory | plain | 2/0 | 1 |  |
| faience | plain | 10/0 | 2 |  |
| failed | plain | 2/0 | 2 |  |
| failure | plain | 5/0 | 4 |  |
| failures | plain | 1/0 | 1 |  |
| faint | plain | 3/1 | 3 |  |
| fake | plain | 1/0 | 1 |  |
| falcata | plain | 2/0 | 2 |  |
| falchion | plain | 2/0 | 2 |  |
| fall | plain | 3/1 | 3 |  |
| fallback | plain | 1/0 | 1 |  |
| fallen | plain | 2/3 | 5 |  |
| falling | plain | 9/1 | 4 |  |
| false | plain | 3/0 | 3 |  |
| family | plain | 28/0 | 1 |  |
| fan | plain | 3/1 | 3 |  |
| fanaticism | poe | 0/4 | 2 |  |
| fang | plain | 4/0 | 3 |  |
| fantasy | plain | 1/0 | 1 |  |
| faq | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| far | plain | 4/2 | 5 |  |
| farmland | plain | 1/0 | 1 | plain English |
| farwalker | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| fast | plain | 3/0 | 2 |  |
| faster | plain | 5/5 | 7 |  |
| fat | plain | 2/1 | 3 |  |
| favor | plain | 1/0 | 1 |  |
| fbx | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| fc | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| fcbf | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| fe | plain | 1/1 | 2 |  |
| fear | plain | 8/2 | 3 |  |
| feather | plain | 6/1 | 5 |  |
| feathered | plain | 4/1 | 4 |  |
| feathers | plain | 8/2 | 7 |  |
| feature | plain | 1/0 | 1 |  |
| features | plain | 7/0 | 5 |  |
| feed | plain | 3/1 | 3 |  |
| feedback | plain | 1/0 | 1 |  |
| feet | plain | 9/2 | 8 | Ordinary English word used in its normal meaning. |
| felt | plain | 14/0 | 4 |  |
| female | plain | 1/0 | 1 |  |
| femur | plain | 2/0 | 2 |  |
| fen | plain | 4/0 | 2 |  |
| feral | plain | 3/1 | 4 |  |
| fern | plain | 2/1 | 3 |  |
| few | plain | 1/0 | 1 |  |
| fewer | plain | 2/1 | 3 | plain English |
| ff | technical | 10/10 | 3 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ffa | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ffafa | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ffd | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ffe | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| fffd | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ffmpeg | technical | 0/27 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| fiber | plain | 14/0 | 2 |  |
| fibonacci | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| fibre | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| field | plain | 22/7 | 9 |  |
| fields | plain | 1/0 | 1 |  |
| fifteen | plain | 0/1 | 1 |  |
| fight | plain | 2/0 | 2 |  |
| fighter | plain | 0/2 | 1 |  |
| fighting | plain | 1/0 | 1 |  |
| figure | plain | 15/2 | 7 |  |
| figurine | plain | 2/1 | 3 |  |
| filament | plain | 4/2 | 3 |  |
| file | plain | 4/0 | 3 |  |
| files | plain | 7/0 | 7 |  |
| filesystem | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| filings | plain | 14/5 | 3 |  |
| fill | plain | 22/7 | 10 |  |
| filler | plain | 1/0 | 1 |  |
| fills | plain | 2/1 | 3 |  |
| filter | plain | 2/0 | 1 |  |
| final | plain | 12/2 | 12 |  |
| find | plain | 0/2 | 2 |  |
| finds | plain | 1/0 | 1 |  |
| finely | plain | 3/0 | 2 |  |
| finger | plain | 0/4 | 1 |  |
| fingerless | plain | 1/0 | 1 |  |
| finial | plain | 2/0 | 2 |  |
| finish | plain | 2/1 | 3 |  |
| finished | plain | 1/0 | 1 |  |
| finned | plain | 2/0 | 2 |  |
| fire | owner | 293/171 | 47 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| fireball | plain | 22/21 | 10 |  |
| firebolt | plain | 2/0 | 1 |  |
| fireflies | plain | 0/1 | 1 |  |
| firelight | plain | 0/1 | 1 |  |
| fires | plain | 10/5 | 3 |  |
| firewall | plain | 1/0 | 1 |  |
| firing | plain | 3/0 | 2 |  |
| first | plain | 21/5 | 19 |  |
| fissure | plain | 6/3 | 3 |  |
| fissures | plain | 6/3 | 3 |  |
| fist | plain | 2/0 | 2 |  |
| fit | plain | 4/0 | 3 |  |
| fitzwilliam | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| five | plain | 15/4 | 8 |  |
| fix | plain | 3/0 | 3 |  |
| fixed | plain | 1/3 | 4 |  |
| fixture | plain | 8/1 | 4 |  |
| fixtures | plain | 2/0 | 2 |  |
| fizzle | plain | 1/0 | 1 |  |
| fk | technical | 11/0 | 6 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| flagged | plain | 2/0 | 1 | Ordinary English word used in its normal meaning. |
| flags | plain | 7/0 | 1 |  |
| flagstones | plain | 4/2 | 3 |  |
| flake | plain | 2/0 | 2 |  |
| flakes | plain | 10/5 | 3 |  |
| flame | plain | 70/29 | 5 |  |
| flames | plain | 7/4 | 4 |  |
| flange | plain | 4/0 | 2 |  |
| flanked | plain | 1/0 | 1 |  |
| flap | plain | 2/1 | 3 |  |
| flaps | plain | 6/0 | 2 |  |
| flare | plain | 2/1 | 3 |  |
| flared | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| flash | plain | 3/8 | 5 |  |
| flashes | plain | 2/0 | 1 |  |
| flask | owner | 23/4 | 7 | Owner: "flask/remedy bar"; PoE. |
| flasks | poe | 2/1 | 3 |  |
| flat | plain | 9/0 | 7 |  |
| flatbow | real-world or technical (doc only) | 3/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| flavor | plain | 2/0 | 2 |  |
| flesh | plain | 7/3 | 3 |  |
| fletcher | plain | 1/0 | 1 | Real occupation word in rp_account_creator background list. |
| flicker | plain | 2/1 | 3 |  |
| flight | plain | 2/1 | 3 |  |
| flint | plain | 55/10 | 14 |  |
| floating | plain | 3/1 | 3 |  |
| flood | plain | 7/3 | 7 |  |
| flooded | plain | 3/5 | 7 |  |
| floods | plain | 2/1 | 3 |  |
| floor | plain | 92/43 | 5 |  |
| flourish | plain | 0/1 | 1 |  |
| flow | plain | 14/6 | 4 |  |
| flows | plain | 7/3 | 6 |  |
| fluted | plain | 5/0 | 4 |  |
| flying | plain | 2/2 | 4 |  |
| foam | plain | 2/1 | 3 |  |
| focus | poe | 12/9 | 12 |  |
| foes | plain | 8/4 | 3 |  |
| fog | plain | 8/4 | 3 |  |
| foil | plain | 4/2 | 3 |  |
| fold | plain | 1/0 | 1 |  |
| folded | plain | 9/0 | 5 |  |
| foley | plain | 0/8 | 1 | Real audio-production term. |
| foliage | plain | 0/1 | 1 |  |
| follow | plain | 5/3 | 8 |  |
| followers | plain | 1/0 | 1 |  |
| font | plain | 0/2 | 1 |  |
| fonts | plain | 4/0 | 2 |  |
| fool | plain | 3/0 | 1 |  |
| foot | plain | 6/28 | 6 |  |
| footbags | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| footed | plain | 2/0 | 2 |  |
| footfinger | technical | 0/2 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| footing | plain | 0/45 | 2 |  |
| footprint | plain | 1/0 | 1 |  |
| footprints | plain | 2/0 | 2 |  |
| footstep | plain | 1/0 | 1 |  |
| footwear | plain | 10/0 | 5 |  |
| for | plain | 51/7 | 20 |  |
| forbidden | plain | 1/0 | 1 |  |
| force | plain | 25/12 | 4 |  |
| forced | plain | 2/0 | 2 |  |
| forearm | plain | 4/8 | 3 |  |
| foreleg | plain | 0/1 | 1 |  |
| forest | plain | 6/6 | 12 |  |
| forfeit | plain | 0/1 | 1 |  |
| forge | plain | 19/6 | 6 |  |
| forging | plain | 2/0 | 1 |  |
| fork | plain | 5/0 | 3 |  |
| forked | plain | 2/0 | 2 |  |
| forks | plain | 3/1 | 3 |  |
| forksword | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| form | plain | 10/4 | 5 |  |
| forming | plain | 1/0 | 1 |  |
| formline | real-world | 3/0 | 2 | Real Northwest Coast design term in a garment description. |
| forms | plain | 3/0 | 3 |  |
| fortify | poe | 3/5 | 5 |  |
| fortress | plain | 2/1 | 3 |  |
| fortune | plain | 9/0 | 2 |  |
| forward | plain | 3/2 | 4 |  |
| fossil | plain | 5/0 | 2 |  |
| foulborn | real-world or technical (doc only) | 7/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| found | plain | 9/2 | 3 |  |
| fountain | plain | 1/0 | 1 |  |
| four | plain | 20/7 | 13 |  |
| fourteen | plain | 1/0 | 1 |  |
| fp | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| fps | technical | 6/0 | 4 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| fractured | plain | 3/1 | 4 | Ordinary English word used in its normal meaning. |
| frag | technical | 1/0 | 1 | graphics or tooling term in a WIZARD lab page |
| fragcolor | technical | 3/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| fragment | plain | 41/10 | 21 |  |
| fragments | plain | 38/7 | 20 |  |
| frame | plain | 27/4 | 12 |  |
| framepack | technical | 10/0 | 5 | WIZARD module / asset-format name (Framepack Gallery); a tool name, not game vocabulary. |
| frames | plain | 3/0 | 3 |  |
| free | plain | 6/3 | 9 |  |
| freeze | poe | 13/9 | 11 |  |
| freezing | plain | 5/1 | 3 |  |
| frenzy | poe | 0/4 | 3 |  |
| fresh | plain | 6/4 | 4 |  |
| fresnel | plain | 2/1 | 3 |  |
| fret | plain | 2/0 | 1 |  |
| friendly | plain | 2/1 | 3 |  |
| friends | plain | 1/0 | 1 |  |
| frightens | plain | 2/1 | 3 |  |
| fringe | plain | 3/0 | 2 |  |
| fringed | plain | 6/0 | 2 |  |
| from | plain | 6/3 | 6 |  |
| front | plain | 14/11 | 5 |  |
| frost | plain | 78/51 | 9 |  |
| frozen | poe | 27/21 | 15 |  |
| frugal | plain | 2/1 | 3 |  |
| fsb | technical | 3/0 | 1 | graphics or tooling term in a WIZARD lab page |
| fsf | technical | 1/0 | 1 | graphics or tooling term in a WIZARD lab page |
| fu | plain | 9/0 | 2 |  |
| fulgurite | plain | 2/1 | 3 |  |
| full | plain | 29/12 | 32 |  |
| fully | plain | 3/1 | 4 |  |
| fume | plain | 2/1 | 3 |  |
| fumes | plain | 5/2 | 3 |  |
| functional | plain | 1/0 | 1 |  |
| fungal | plain | 2/5 | 6 |  |
| fungus | plain | 2/0 | 2 |  |
| funnel | plain | 7/3 | 4 |  |
| fur | plain | 40/1 | 8 |  |
| fused | plain | 3/1 | 3 |  |
| fuses | plain | 2/1 | 3 |  |
| fusion | plain | 1/0 | 1 |  |
| future | plain | 5/0 | 4 |  |
| fx | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| gain | plain | 0/5 | 2 |  |
| gained | plain | 0/1 | 1 |  |
| gains | plain | 1/0 | 1 |  |
| gale | plain | 9/4 | 3 |  |
| gallery | plain | 12/0 | 6 |  |
| gallic | plain | 4/0 | 2 |  |
| gallo | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| game | plain | 18/5 | 15 |  |
| gameplay | plain | 2/0 | 2 | Ordinary English word used in its normal meaning. |
| gap | plain | 3/2 | 5 |  |
| gaps | plain | 1/0 | 1 |  |
| gas | plain | 6/2 | 4 |  |
| gash | plain | 5/2 | 3 |  |
| gate | plain | 79/21 | 14 |  |
| gates | plain | 1/0 | 1 |  |
| gateway | plain | 1/0 | 1 |  |
| gateways | plain | 1/0 | 1 |  |
| gather | plain | 8/2 | 3 |  |
| gathering | plain | 8/1 | 3 |  |
| gaunt | plain | 0/2 | 1 |  |
| gauntlet | plain | 1/0 | 1 |  |
| gauntlets | plain | 5/0 | 4 |  |
| gcp | technical | 2/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| gd | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| gdc | technical | 1/0 | 1 | graphics or tooling term in a WIZARD lab page |
| ge | plain | 2/0 | 2 |  |
| gear | plain | 3/0 | 2 |  |
| gearing | plain | 1/0 | 1 |  |
| gem | poe | 5/2 | 5 |  |
| gemini | plain | 2/0 | 2 |  |
| gems | other-game | 2/3 | 5 | Arcomage resource (TownCards.cs); owner-requested arcomage game. |
| gemstone | plain | 2/1 | 3 | plain English |
| gen | plain | 3/0 | 2 |  |
| gender | plain | 1/0 | 1 |  |
| general | plain | 2/0 | 2 |  |
| generate | plain | 29/0 | 19 |  |
| generated | plain | 9/2 | 10 | Ordinary English word used in its normal meaning. |
| generates | plain | 1/0 | 1 |  |
| generating | plain | 1/0 | 1 |  |
| generation | plain | 5/3 | 6 |  |
| generations | plain | 1/0 | 1 |  |
| generative | plain | 1/0 | 1 |  |
| generator | plain | 5/0 | 3 |  |
| generic | plain | 3/0 | 3 |  |
| gentle | plain | 4/2 | 3 |  |
| geo | plain | 2/1 | 3 |  |
| geode | plain | 2/1 | 3 |  |
| geography | plain | 0/3 | 3 |  |
| geometric | plain | 24/0 | 11 |  |
| geometry | plain | 3/4 | 7 |  |
| georgia | plain | 2/3 | 5 |  |
| germany | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| get | plain | 3/3 | 4 |  |
| getty | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| geyser | plain | 3/7 | 7 |  |
| ggg | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ghost | plain | 7/3 | 3 |  |
| giant | plain | 4/4 | 4 |  |
| giants | plain | 1/0 | 1 |  |
| gib | plain | 0/7 | 3 |  |
| gibs | plain | 0/3 | 1 |  |
| gif | plain | 1/0 | 1 |  |
| gilded | plain | 23/5 | 7 |  |
| gilding | plain | 4/2 | 3 |  |
| gilt | plain | 2/0 | 2 |  |
| girdle | plain | 20/0 | 6 |  |
| girth | plain | 2/1 | 3 |  |
| give | plain | 1/0 | 1 |  |
| gives | plain | 2/0 | 2 |  |
| glacial | plain | 7/5 | 6 |  |
| glacier | plain | 4/4 | 5 |  |
| gladius | plain | 2/0 | 2 |  |
| glass | plain | 24/10 | 4 |  |
| glint | plain | 2/1 | 3 |  |
| glints | plain | 6/2 | 3 |  |
| globe | plain | 13/1 | 9 |  |
| gloom | plain | 2/1 | 3 |  |
| gloves | poe | 8/0 | 3 |  |
| glow | plain | 7/7 | 5 |  |
| glowing | plain | 5/2 | 4 |  |
| glsl | technical | 15/4 | 6 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| gltfloader | technical | 1/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| glyph | plain | 15/5 | 5 |  |
| glyphs | plain | 1/0 | 1 |  |
| gnarled | plain | 3/0 | 2 |  |
| goal | plain | 4/0 | 4 |  |
| goals | plain | 1/0 | 1 |  |
| gobbets | plain | 4/2 | 3 |  |
| godot | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| gold | plain | 149/33 | 18 |  |
| golem | plain | 6/4 | 4 |  |
| gomadan | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| good | plain | 7/0 | 5 |  |
| goodmanham | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| goods | plain | 2/2 | 4 |  |
| google | real-world | 4/0 | 2 | Google Fonts credit. |
| gore | plain | 20/11 | 4 |  |
| gorge | plain | 1/1 | 2 |  |
| gorget | plain | 4/0 | 3 |  |
| gorse | plain | 2/0 | 2 |  |
| gorytos | real-world or technical (doc only) | 10/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| gothic | plain | 4/0 | 2 |  |
| gouge | plain | 2/2 | 4 |  |
| gpt | real-world or technical (doc only) | 11/0 | 6 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| gpu | technical | 11/7 | 5 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| gradient | plain | 1/0 | 1 |  |
| graeco | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| grain | plain | 3/1 | 4 |  |
| grains | plain | 2/1 | 3 |  |
| grand | plain | 3/1 | 3 |  |
| granite | plain | 10/4 | 5 |  |
| grant | plain | 1/0 | 1 |  |
| granted | plain | 1/0 | 1 |  |
| grants | plain | 2/1 | 3 |  |
| graph | plain | 6/6 | 9 |  |
| graphic | plain | 2/0 | 1 |  |
| graphics | plain | 2/0 | 1 |  |
| grapnel | plain | 2/1 | 3 |  |
| grasping | plain | 5/7 | 7 |  |
| grass | plain | 9/0 | 6 |  |
| grave | plain | 5/1 | 5 |  |
| gravel | plain | 0/1 | 1 |  |
| graves | plain | 6/0 | 2 |  |
| gravity | plain | 1/0 | 1 |  |
| great | plain | 9/2 | 9 |  |
| greatblade | real-world or technical (doc only) | 4/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| greatclub | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| greatclubs | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| greater | plain | 6/1 | 3 |  |
| greatsword | plain | 2/1 | 3 | plain English |
| greave | plain | 4/0 | 2 |  |
| greaves | plain | 9/0 | 5 |  |
| greek | plain | 40/1 | 11 |  |
| green | plain | 91/41 | 8 |  |
| greenstone | plain | 7/0 | 3 |  |
| grefuntor | technical | 0/1 | 1 | Third-party source asset name in CreatureCatalog.cs provenance string ("Original Grefuntor horned demon source"); not a  |
| grey | plain | 11/4 | 5 |  |
| grid | plain | 5/0 | 4 |  |
| griffith | plain | 6/0 | 2 |  |
| grim | plain | 5/0 | 3 |  |
| grime | plain | 0/1 | 1 |  |
| grin | plain | 1/0 | 1 |  |
| grinder | plain | 2/0 | 2 |  |
| grip | plain | 14/0 | 4 |  |
| grit | plain | 12/4 | 3 |  |
| groove | plain | 1/0 | 1 |  |
| grooved | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ground | plain | 49/34 | 21 |  |
| grounded | plain | 0/3 | 1 |  |
| groundstone | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| grown | plain | 1/0 | 1 |  |
| growth | plain | 12/6 | 3 |  |
| grudge | plain | 1/0 | 1 |  |
| guaranteed | plain | 9/0 | 3 | plain description |
| guard | plain | 434/24 | 32 | plain English in its literal sense only (a prison guard, an arm guard; the defence stat is Armour); never a name, theme  |
| guardian | plain | 9/4 | 6 |  |
| guardrail | plain | 1/0 | 1 |  |
| guards | plain | 13/0 | 4 |  |
| guide | plain | 3/0 | 3 |  |
| gunpowder | plain | 1/0 | 1 |  |
| gutter | plain | 1/0 | 1 |  |
| habu | plain | 12/0 | 2 |  |
| haft | plain | 18/0 | 2 |  |
| hafting | plain | 1/0 | 1 |  |
| hagia | plain | 3/0 | 2 |  |
| hail | plain | 2/1 | 3 |  |
| hailstone | plain | 2/1 | 3 |  |
| hailstones | plain | 4/2 | 3 |  |
| hailstorm | plain | 2/1 | 3 |  |
| hair | plain | 3/0 | 2 |  |
| halo | plain | 6/4 | 4 |  |
| halos | plain | 2/1 | 3 |  |
| hammer | plain | 13/4 | 6 |  |
| hammered | plain | 6/0 | 5 |  |
| hammers | plain | 2/1 | 3 |  |
| hand | plain | 94/5 | 18 |  |
| handaxe | plain | 2/1 | 3 | Real tool name (hand axe). |
| handed | plain | 4/1 | 5 |  |
| handle | plain | 18/0 | 2 |  |
| handled | plain | 3/0 | 3 |  |
| handlist | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| handmade | plain | 1/0 | 1 |  |
| hands | plain | 8/2 | 8 |  |
| handwear | plain | 7/0 | 5 |  |
| hanging | plain | 5/0 | 3 |  |
| hao | plain | 9/0 | 2 |  |
| harbor | plain | 2/1 | 3 |  |
| hard | plain | 5/0 | 5 |  |
| hardens | plain | 2/1 | 3 |  |
| hardware | plain | 2/0 | 2 |  |
| hardwood | plain | 5/0 | 4 |  |
| harness | plain | 2/0 | 2 |  |
| harpoon | plain | 5/0 | 4 |  |
| harvest | plain | 2/0 | 2 |  |
| hasan | plain | 4/0 | 2 |  |
| hash | plain | 1/0 | 1 |  |
| haste | poe | 5/6 | 9 |  |
| hat | plain | 4/0 | 2 |  |
| hatch | plain | 1/0 | 1 |  |
| hatchet | plain | 8/4 | 7 |  |
| hatchets | plain | 1/0 | 1 |  |
| hattusa | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| hauberk | plain | 1/0 | 1 |  |
| hazards | plain | 0/3 | 1 |  |
| haze | plain | 6/3 | 3 |  |
| hcl | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| head | plain | 37/4 | 15 |  |
| headed | plain | 2/0 | 1 |  |
| headgear | plain | 2/0 | 2 |  |
| headings | plain | 1/0 | 1 |  |
| headload | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| headpiece | plain | 2/0 | 2 |  |
| heads | plain | 2/1 | 3 |  |
| headwrap | plain | 6/0 | 2 | Ordinary English word used in its normal meaning. |
| heal | plain | 6/2 | 5 |  |
| healing | plain | 6/1 | 3 |  |
| health | owner | 28/7 | 13 | owner: 'health and mana orb' |
| heart | plain | 3/1 | 4 |  |
| heartbeat | plain | 0/1 | 1 |  |
| heat | plain | 35/21 | 4 |  |
| heath | plain | 0/2 | 2 |  |
| heaving | plain | 2/1 | 3 |  |
| heavy | plain | 16/15 | 12 |  |
| heel | plain | 3/0 | 3 |  |
| height | plain | 15/7 | 3 |  |
| heir | plain | 2/0 | 1 |  |
| held | plain | 4/1 | 5 | Ordinary English word used in its normal meaning. |
| helix | plain | 1/0 | 1 |  |
| helladic | plain | 2/0 | 2 |  |
| hellenistic | plain | 14/0 | 5 |  |
| hello | plain | 1/0 | 1 |  |
| helm | poe | 36/0 | 8 |  |
| helmet | poe | 27/0 | 8 |  |
| helmets | plain | 4/0 | 4 |  |
| helpers | plain | 1/0 | 1 |  |
| hem | plain | 3/0 | 2 |  |
| heqreshu | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| heraklion | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| herb | plain | 1/0 | 1 |  |
| here | plain | 2/0 | 2 |  |
| hero | plain | 5/1 | 5 |  |
| heroic | plain | 2/0 | 2 |  |
| heterogeneous | plain | 2/1 | 3 |  |
| hex | plain | 40/4 | 14 |  |
| hexagonal | plain | 2/0 | 2 |  |
| hexes | plain | 7/3 | 3 |  |
| hhmmss | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| hidden | plain | 3/2 | 5 |  |
| hide | plain | 165/5 | 21 |  |
| hiding | plain | 2/1 | 3 |  |
| hierarchy | plain | 1/0 | 1 |  |
| high | plain | 22/6 | 22 |  |
| highest | plain | 2/0 | 2 |  |
| highland | plain | 0/2 | 2 |  |
| highlight | plain | 2/1 | 3 |  |
| hilazon | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| hilt | plain | 10/0 | 4 |  |
| hiltless | plain | 1/0 | 1 |  |
| himalayan | plain | 1/0 | 1 |  |
| hint | plain | 1/0 | 1 |  |
| hip | plain | 0/2 | 1 |  |
| historical | plain | 11/0 | 8 |  |
| historically | plain | 1/0 | 1 |  |
| history | plain | 9/1 | 6 |  |
| hit | plain | 33/22 | 19 |  |
| hits | plain | 7/4 | 5 |  |
| hittite | plain | 3/0 | 2 |  |
| hlsl | technical | 4/1 | 4 | graphics or tooling term in a WIZARD lab page |
| hoard | plain | 8/0 | 4 |  |
| hoarfrost | plain | 6/3 | 3 |  |
| hobnail | plain | 2/0 | 2 |  |
| hoeyuek | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| hold | plain | 11/4 | 12 |  |
| hole | plain | 4/1 | 5 |  |
| hollow | plain | 1/0 | 1 |  |
| holmegaard | real-world or technical (doc only) | 7/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| holographic | plain | 2/1 | 3 |  |
| holy | plain | 12/26 | 6 |  |
| home | plain | 5/7 | 10 |  |
| honed | plain | 1/0 | 1 |  |
| honest | plain | 1/0 | 1 |  |
| honesty | plain | 11/0 | 2 |  |
| hood | plain | 11/0 | 4 |  |
| hooded | plain | 1/0 | 1 |  |
| hook | plain | 5/1 | 4 |  |
| horde | plain | 0/3 | 2 |  |
| horizontal | plain | 2/0 | 2 |  |
| horn | owner | 75/18 | 29 | Owner tile tiers: "wood, horn, ivory". |
| horned | plain | 5/2 | 6 |  |
| horns | plain | 8/4 | 3 |  |
| horse | plain | 0/16 | 1 |  |
| horsehair | plain | 3/0 | 2 |  |
| hot | plain | 6/2 | 3 |  |
| hound | plain | 1/0 | 1 |  |
| hounds | plain | 1/0 | 1 |  |
| hourglass | plain | 5/2 | 3 |  |
| hours | plain | 1/0 | 1 |  |
| house | owner | 10/45 | 16 | Owner: "House management should be accessible from the main menu". |
| houses | plain | 11/2 | 9 |  |
| hover | plain | 10/4 | 5 |  |
| how | plain | 7/1 | 8 |  |
| hp | plain | 12/4 | 7 | Gaming plain ("Effective HP"). |
| hsl | technical | 3/0 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| html | real-world or technical (doc only) | 8/0 | 6 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| http | technical | 6/0 | 5 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| hub | plain | 1/0 | 1 |  |
| hubris | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| hud | plain | 14/2 | 11 |  |
| huge | plain | 2/1 | 3 |  |
| hunch | plain | 2/1 | 3 |  |
| hung | plain | 3/0 | 1 |  |
| hunt | plain | 16/1 | 8 | plain English in its literal sense only (hunting animals; the bond family is Rare Kills); never a name, theme or tag of  |
| hunter | plain | 10/0 | 6 |  |
| hurls | plain | 8/4 | 3 |  |
| hurt | plain | 2/1 | 3 |  |
| husk | plain | 3/1 | 3 |  |
| husks | plain | 1/0 | 1 |  |
| huyuk | real-world or technical (doc only) | 10/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| hvidegaard | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| hyb | technical | 1/1 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| hybrid | plain | 4/23 | 3 |  |
| hydra | owner | 3/2 | 4 | Owner: "Hydra necks clip". |
| hygiene | plain | 1/0 | 1 |  |
| hyperdimensional | plain | 1/0 | 1 |  |
| hz | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| iberian | plain | 1/0 | 1 |  |
| ice | plain | 125/68 | 11 |  |
| iceball | plain | 4/2 | 3 | plain English |
| ichor | plain | 2/0 | 1 |  |
| icicle | plain | 6/1 | 3 |  |
| icon | plain | 2/1 | 3 |  |
| icons | plain | 1/0 | 1 |  |
| id | plain | 32/0 | 4 |  |
| idat | technical | 1/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| idea | plain | 1/0 | 1 |  |
| ideation | plain | 1/0 | 1 |  |
| identical | plain | 0/6 | 1 |  |
| identity | plain | 2/1 | 3 |  |
| idle | plain | 2/7 | 9 |  |
| idol | plain | 4/0 | 2 |  |
| ids | plain | 17/0 | 12 |  |
| iend | technical | 2/0 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| if | plain | 81/2 | 19 |  |
| ignite | poe | 15/5 | 7 |  |
| ignited | poe | 10/8 | 6 |  |
| ignites | poe | 16/8 | 3 |  |
| ignition | plain | 6/1 | 3 |  |
| ignored | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ihdr | technical | 3/0 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ii | technical | 33/2 | 19 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| iife | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| iii | technical | 17/2 | 13 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ik | technical | 6/5 | 4 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| illusion | plain | 1/0 | 1 |  |
| illyrian | plain | 10/0 | 4 |  |
| im | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| image | plain | 810/1 | 30 |  |
| images | plain | 5/0 | 4 |  |
| img | real-world or technical (doc only) | 4/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| immediate | plain | 1/0 | 1 |  |
| immunity | plain | 2/1 | 3 |  |
| immutability | plain | 1/0 | 1 |  |
| impact | plain | 106/49 | 7 |  |
| impacts | plain | 2/1 | 3 |  |
| imperial | plain | 8/0 | 3 |  |
| implement | plain | 11/0 | 4 |  |
| implementation | plain | 3/0 | 3 |  |
| implementations | plain | 1/0 | 1 |  |
| implemented | plain | 4/0 | 1 |  |
| implements | plain | 1/0 | 1 |  |
| implicit | poe | 6/0 | 1 |  |
| implosion | plain | 1/1 | 2 |  |
| import | plain | 6/6 | 9 |  |
| important | plain | 2/0 | 2 |  |
| imported | plain | 2/0 | 2 |  |
| imports | plain | 1/0 | 1 |  |
| improve | plain | 1/0 | 1 |  |
| improvements | plain | 2/0 | 2 |  |
| imps | plain | 1/0 | 1 |  |
| in | plain | 26/10 | 14 |  |
| inaccuracy | plain | 2/1 | 3 |  |
| inbound | plain | 7/1 | 4 |  |
| inc | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| incense | plain | 4/0 | 2 |  |
| inclined | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| include | plain | 12/0 | 6 |  |
| includes | plain | 2/0 | 2 |  |
| incompatible | plain | 1/0 | 1 |  |
| incomplete | plain | 2/4 | 3 |  |
| increase | plain | 1/3 | 2 |  |
| increases | plain | 2/0 | 1 |  |
| indigo | plain | 8/1 | 5 |  |
| individually | plain | 2/0 | 2 |  |
| indoor | plain | 0/15 | 3 |  |
| indus | plain | 1/0 | 1 |  |
| inefficient | plain | 1/0 | 1 |  |
| inert | plain | 2/0 | 1 |  |
| infall | plain | 1/0 | 1 |  |
| infer | plain | 1/0 | 1 |  |
| inflicts | plain | 0/2 | 1 |  |
| inflow | plain | 3/0 | 1 |  |
| influenced | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| inhale | plain | 1/0 | 1 |  |
| inhaled | plain | 1/0 | 1 | plain English |
| inherited | plain | 2/0 | 2 |  |
| initial | plain | 1/0 | 1 |  |
| initialize | plain | 2/0 | 2 |  |
| inject | plain | 1/0 | 1 |  |
| ink | plain | 7/3 | 3 |  |
| inlay | plain | 3/1 | 4 |  |
| inline | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| inner | owner | 17/67 | 16 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| input | plain | 11/0 | 7 |  |
| inset | plain | 6/0 | 5 |  |
| inspect | plain | 5/0 | 5 |  |
| inspected | plain | 2/14 | 16 |  |
| inspector | plain | 2/0 | 2 |  |
| instability | plain | 1/0 | 1 |  |
| instance | plain | 2/1 | 3 |  |
| instanced | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| instant | plain | 9/4 | 11 |  |
| instantiate | plain | 1/0 | 1 |  |
| instantly | plain | 2/1 | 3 |  |
| instead | plain | 3/0 | 3 |  |
| institute | plain | 2/0 | 2 |  |
| int | owner | 250/75 | 41 | PoE attribute abbreviation; owner: "not only int characters". |
| intake | plain | 6/0 | 4 |  |
| integral | plain | 2/0 | 2 |  |
| integrated | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| integration | plain | 8/0 | 8 |  |
| integrations | plain | 1/0 | 1 |  |
| intelligence | poe | 80/28 | 23 |  |
| intended | plain | 1/0 | 1 |  |
| intensity | plain | 14/7 | 3 |  |
| intent | plain | 0/1 | 1 |  |
| inter | plain | 1/0 | 1 |  |
| interaction | plain | 1/0 | 1 |  |
| interactive | plain | 5/0 | 5 |  |
| interface | plain | 1/0 | 1 |  |
| interior | plain | 3/5 | 7 |  |
| interleave | plain | 1/0 | 1 |  |
| intermediate | plain | 2/1 | 3 |  |
| internal | plain | 4/0 | 4 |  |
| interpolate | plain | 1/0 | 1 |  |
| interpolation | plain | 3/0 | 2 |  |
| intricacy | plain | 1/0 | 1 |  |
| intrinsic | plain | 0/2 | 2 |  |
| invalid | plain | 11/27 | 14 |  |
| invariants | plain | 2/0 | 2 |  |
| invasive | plain | 1/0 | 1 |  |
| inventory | plain | 39/2 | 21 |  |
| invisible | plain | 1/0 | 1 |  |
| invocations | plain | 61/30 | 3 |  |
| invulnerability | plain | 2/1 | 3 |  |
| inward | plain | 2/0 | 1 |  |
| ior | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| iran | plain | 2/0 | 2 |  |
| iranian | plain | 6/0 | 5 |  |
| iris | plain | 2/1 | 3 |  |
| irish | plain | 3/0 | 2 |  |
| iron | plain | 107/10 | 25 |  |
| is | plain | 15/2 | 9 |  |
| island | plain | 8/1 | 7 |  |
| islands | plain | 1/1 | 2 |  |
| isolated | plain | 2/4 | 6 |  |
| issue | plain | 1/0 | 1 |  |
| issues | plain | 1/0 | 1 |  |
| it | plain | 126/30 | 34 |  |
| italian | plain | 2/0 | 2 |  |
| italic | plain | 8/0 | 5 |  |
| item | plain | 65/14 | 34 |  |
| itemization | plain | 12/0 | 5 |  |
| items | plain | 19/5 | 10 |  |
| its | plain | 36/21 | 19 |  |
| iv | technical | 5/1 | 5 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ivory | owner | 11/1 | 6 | Owner tile tiers. |
| jacobian | plain | 0/1 | 1 |  |
| jade | plain | 59/2 | 18 |  |
| jaggedness | plain | 4/2 | 3 |  |
| jaguar | plain | 6/0 | 3 |  |
| japan | plain | 1/0 | 1 |  |
| java | plain | 2/0 | 1 |  |
| javanese | plain | 1/0 | 1 |  |
| javelin | plain | 8/0 | 6 |  |
| jaw | plain | 2/0 | 1 |  |
| jawbone | plain | 15/7 | 6 |  |
| jekyll | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| jerkin | plain | 2/0 | 2 |  |
| jet | plain | 1/0 | 1 |  |
| jewel | poe | 35/26 | 7 |  |
| jewellery | real-world or technical (doc only) | 3/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| jewelry | plain | 1/0 | 1 |  |
| jewels | poe | 10/1 | 4 |  |
| jitter | plain | 1/0 | 1 |  |
| join | plain | 0/3 | 2 |  |
| joined | plain | 2/5 | 2 |  |
| joinery | plain | 1/0 | 1 |  |
| joint | plain | 1/2 | 3 |  |
| joints | plain | 2/1 | 3 |  |
| jolt | plain | 1/0 | 1 |  |
| jonathan | plain | 1/0 | 1 |  |
| journal | plain | 3/0 | 2 |  |
| jpgs | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| js | plain | 15/3 | 6 |  |
| json | technical | 51/0 | 25 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| judge | plain | 2/0 | 2 |  |
| jul | real-world or technical (doc only) | 157/0 | 13 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| july | plain | 1/0 | 1 |  |
| junctions | plain | 1/0 | 1 |  |
| june | plain | 4/0 | 3 |  |
| jungle | plain | 3/0 | 2 |  |
| junius | plain | 2/0 | 2 |  |
| just | plain | 1/0 | 1 |  |
| kadesh | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| kahun | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| kakovatos | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| kallithea | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| karabitsu | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| kb | real-world or technical (doc only) | 7/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| keel | plain | 2/0 | 2 |  |
| keep | plain | 60/6 | 34 |  |
| keeper | plain | 2/0 | 2 |  |
| keepers | plain | 1/0 | 1 |  |
| keeping | plain | 1/0 | 1 |  |
| kenney | real-world | 0/30 | 1 | Asset author (kenney.nl), audio manifest credit. |
| kepler | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| keplerian | plain | 2/1 | 3 |  |
| kept | plain | 1/1 | 2 |  |
| keratin | plain | 2/1 | 3 |  |
| kew | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| key | plain | 8/3 | 9 |  |
| keyboard | plain | 1/0 | 1 |  |
| keystone | poe | 14/3 | 8 |  |
| keystones | poe | 7/1 | 5 |  |
| khopesh | real-world | 10/0 | 7 | Real Egyptian/Levantine sickle-sword, base name in verdigris-pack.js; real-world name in the same meaning. |
| kick | plain | 0/1 | 1 |  |
| kicked | plain | 3/2 | 4 |  |
| kill | plain | 26/4 | 12 |  |
| killed | plain | 3/0 | 1 |  |
| killers | plain | 2/2 | 4 |  |
| killing | plain | 1/1 | 2 |  |
| kills | plain | 7/5 | 8 |  |
| kiln | plain | 1/1 | 2 |  |
| kiltubbrid | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| kinetic | plain | 2/1 | 3 |  |
| kingdom | plain | 45/0 | 9 |  |
| kingdoms | plain | 3/0 | 2 |  |
| kit | plain | 2/1 | 3 |  |
| knapped | plain | 27/0 | 3 | Real flint-working term. |
| knee | plain | 2/1 | 3 |  |
| knife | plain | 22/1 | 9 |  |
| knight | plain | 2/1 | 3 |  |
| knives | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| knob | plain | 5/0 | 4 |  |
| knocked | plain | 1/0 | 1 |  |
| knossos | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| knot | plain | 2/0 | 1 |  |
| knots | plain | 2/1 | 3 |  |
| knotted | plain | 12/0 | 2 |  |
| knowledge | plain | 1/0 | 1 |  |
| known | plain | 2/0 | 2 |  |
| knucklebone | plain | 1/0 | 1 |  |
| knucklebones | plain | 1/0 | 1 |  |
| korol | real-world | 1/0 | 1 | The owner. |
| kraken | owner | 0/1 | 1 | Owner: "the tentacles, kraken". |
| kris | plain | 3/0 | 2 |  |
| kruger | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| kubernetes | technical | 3/0 | 1 | wordcloud demo data. |
| kushan | real-world or technical (doc only) | 3/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| la | plain | 2/0 | 1 |  |
| lab | plain | 18/2 | 5 |  |
| label | plain | 5/0 | 3 |  |
| laboratory | plain | 10/0 | 7 |  |
| labyrinth | plain | 1/0 | 1 |  |
| lace | plain | 3/0 | 2 |  |
| laced | plain | 42/0 | 2 |  |
| lachish | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| lacing | plain | 6/0 | 2 |  |
| lacquer | plain | 4/0 | 2 |  |
| lacquered | plain | 9/0 | 5 |  |
| ladder | plain | 9/0 | 8 |  |
| ladle | plain | 2/0 | 2 |  |
| laid | plain | 1/0 | 1 |  |
| lake | plain | 0/3 | 1 |  |
| lamellar | plain | 19/1 | 5 |  |
| laminar | plain | 2/0 | 2 |  |
| lamp | plain | 8/1 | 6 |  |
| lampstand | plain | 2/0 | 2 |  |
| lance | plain | 3/1 | 3 |  |
| lancet | plain | 3/0 | 3 |  |
| land | plain | 1/0 | 1 |  |
| landesmuseum | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| landing | plain | 10/2 | 3 |  |
| landmark | plain | 1/0 | 1 |  |
| landmarks | plain | 1/0 | 1 |  |
| landscape | plain | 1/4 | 5 |  |
| lane | plain | 2/0 | 2 |  |
| lanes | plain | 1/0 | 1 |  |
| language | plain | 1/0 | 1 |  |
| lantern | plain | 6/1 | 3 |  |
| large | plain | 22/7 | 13 |  |
| larger | plain | 3/1 | 3 | Ordinary English word used in its normal meaning. |
| lasers | plain | 2/0 | 2 |  |
| lash | plain | 2/0 | 2 |  |
| lashed | plain | 24/0 | 2 |  |
| lashing | plain | 6/0 | 2 |  |
| last | plain | 9/2 | 9 |  |
| lasting | plain | 7/4 | 5 |  |
| latch | plain | 2/1 | 3 |  |
| late | plain | 95/0 | 17 |  |
| lattice | owner | 27/7 | 13 | Owner: "WIZARD spell lattice system". |
| launch | plain | 4/1 | 4 |  |
| launches | plain | 10/5 | 3 |  |
| lava | plain | 18/12 | 13 |  |
| law | plain | 2/0 | 1 |  |
| lay | plain | 2/0 | 2 |  |
| layer | plain | 5/0 | 3 |  |
| layered | plain | 6/1 | 6 |  |
| layers | plain | 4/0 | 2 |  |
| layout | plain | 11/0 | 7 |  |
| layouts | plain | 1/0 | 1 |  |
| lbs | technical | 0/3 | 3 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| le | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| lead | plain | 2/0 | 2 |  |
| leader | plain | 2/1 | 3 |  |
| leaf | plain | 32/8 | 12 |  |
| leafblade | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| leak | plain | 1/0 | 1 |  |
| leaky | plain | 2/1 | 3 |  |
| lean | plain | 0/1 | 1 |  |
| leap | plain | 3/0 | 1 |  |
| leaps | plain | 3/0 | 2 |  |
| learn | plain | 2/0 | 2 |  |
| learned | plain | 2/0 | 1 |  |
| leather | plain | 204/0 | 9 |  |
| leave | plain | 4/4 | 6 |  |
| leaves | plain | 13/9 | 6 |  |
| left | plain | 5/13 | 10 |  |
| leg | plain | 1/26 | 2 |  |
| legacy | plain | 3/1 | 4 |  |
| legend | plain | 3/0 | 3 |  |
| legendary | plain | 10/0 | 6 |  |
| legion | plain | 5/0 | 4 |  |
| legs | plain | 2/1 | 3 |  |
| length | plain | 3/4 | 6 |  |
| lens | plain | 3/1 | 3 |  |
| lenses | plain | 1/1 | 2 |  |
| leopard | plain | 12/0 | 5 |  |
| less | poe | 2/1 | 3 |  |
| lesson | plain | 1/0 | 1 |  |
| let | plain | 2/0 | 2 |  |
| lets | plain | 3/1 | 4 |  |
| levantine | plain | 11/0 | 4 |  |
| level | plain | 28/15 | 21 |  |
| lexicon | plain | 1/0 | 1 |  |
| libation | plain | 6/0 | 3 |  |
| library | plain | 1/0 | 1 |  |
| license | plain | 3/1 | 2 |  |
| lichtenberg | technical | 18/9 | 3 | graphics or tooling term in a WIZARD lab page |
| lick | plain | 1/0 | 1 |  |
| licks | plain | 3/0 | 1 |  |
| life | poe | 227/70 | 46 |  |
| lift | plain | 2/1 | 3 |  |
| lifted | plain | 2/1 | 3 |  |
| liftoff | plain | 3/1 | 3 | plain English |
| light | plain | 71/32 | 8 |  |
| lightning | poe | 111/56 | 24 |  |
| lights | plain | 2/1 | 3 |  |
| likewise | plain | 1/0 | 1 |  |
| limbs | plain | 1/0 | 1 |  |
| limestone | plain | 3/5 | 8 |  |
| limit | plain | 2/1 | 3 |  |
| limits | plain | 1/0 | 1 |  |
| line | plain | 2/4 | 6 |  |
| lined | plain | 3/0 | 2 |  |
| linen | plain | 41/1 | 9 |  |
| lineup | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| lingering | plain | 3/2 | 5 |  |
| lingulate | plain | 2/0 | 2 |  |
| link | plain | 5/2 | 4 |  |
| linked | plain | 2/1 | 3 |  |
| links | plain | 7/3 | 6 |  |
| lint | plain | 4/0 | 2 |  |
| lion | plain | 12/2 | 6 |  |
| liquefies | plain | 2/1 | 3 |  |
| liquid | plain | 12/6 | 3 |  |
| list | plain | 1/0 | 1 |  |
| listed | plain | 1/0 | 1 |  |
| lists | plain | 1/0 | 1 |  |
| lit | plain | 9/2 | 4 |  |
| literal | plain | 1/0 | 1 |  |
| litter | plain | 0/1 | 1 |  |
| little | plain | 2/1 | 3 |  |
| live | plain | 15/0 | 12 |  |
| livery | plain | 1/0 | 1 |  |
| living | plain | 2/2 | 4 |  |
| lm | technical | 0/2 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| lmb | owner | 69/2 | 3 | Owner: "slots mapped to main keys: lmb, space, rmb". |
| load | plain | 7/0 | 6 |  |
| loaded | plain | 0/2 | 2 |  |
| loading | plain | 12/5 | 12 |  |
| loadout | plain | 6/0 | 5 | Plain UI word. |
| loads | plain | 1/0 | 1 |  |
| local | plain | 9/7 | 12 |  |
| localized | plain | 2/0 | 2 | Ordinary English word used in its normal meaning. |
| locally | plain | 1/0 | 1 |  |
| location | plain | 2/1 | 3 |  |
| lock | plain | 10/2 | 5 |  |
| locked | plain | 7/0 | 5 |  |
| locomotion | plain | 0/1 | 1 |  |
| lod | plain | 0/7 | 4 |  |
| lode | plain | 2/0 | 2 |  |
| lodestone | plain | 2/1 | 3 |  |
| lodgroup | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| log | plain | 9/3 | 8 |  |
| logic | plain | 1/0 | 1 |  |
| login | plain | 0/1 | 1 |  |
| logs | plain | 4/2 | 3 |  |
| long | plain | 39/4 | 27 |  |
| longblade | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| longer | plain | 2/1 | 3 |  |
| longsword | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| look | plain | 3/0 | 2 |  |
| loop | plain | 8/1 | 8 |  |
| loops | plain | 7/3 | 8 |  |
| loose | plain | 5/4 | 5 |  |
| loot | plain | 1/10 | 7 |  |
| looting | plain | 1/0 | 1 |  |
| lore | plain | 34/10 | 29 |  |
| lost | plain | 1/0 | 1 |  |
| louvre | plain | 3/0 | 2 |  |
| lovell | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| low | plain | 29/13 | 19 |  |
| lower | plain | 1/0 | 1 |  |
| lowest | plain | 1/0 | 1 | plain English |
| lp | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| lug | plain | 2/0 | 2 |  |
| luminous | plain | 0/4 | 2 |  |
| lunge | plain | 6/3 | 5 |  |
| lunula | plain | 1/0 | 1 |  |
| lurch | plain | 3/1 | 3 |  |
| luristan | real-world or technical (doc only) | 6/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| lv | technical | 1/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| mace | poe | 17/1 | 8 |  |
| machine | plain | 1/0 | 1 |  |
| macro | plain | 2/0 | 1 |  |
| macroscopic | plain | 1/0 | 1 |  |
| macuahuitl | real-world | 4/0 | 3 | Real Mesoamerican obsidian-edged club (verdigris-pack.js base). Name is real; note it is attested only from Postclassic  |
| made | plain | 1/0 | 1 |  |
| mage | plain | 5/1 | 4 |  |
| magenta | plain | 3/1 | 4 |  |
| mages | plain | 1/0 | 1 |  |
| magic | poe | 2/2 | 4 |  |
| magical | plain | 2/0 | 2 |  |
| magma | plain | 7/3 | 3 |  |
| magnet | plain | 1/0 | 1 |  |
| magnetize | plain | 2/1 | 3 |  |
| magnetized | plain | 2/1 | 3 | plain English |
| magnetizes | plain | 2/1 | 3 |  |
| mail | plain | 5/0 | 4 |  |
| main | plain | 11/2 | 9 |  |
| maintain | plain | 1/1 | 2 |  |
| mainz | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| make | plain | 2/4 | 4 |  |
| makes | plain | 7/2 | 5 |  |
| male | plain | 0/9 | 9 |  |
| malevolence | poe | 0/4 | 2 |  |
| mana | poe | 135/63 | 43 | PoE1 resource; owner: "health and mana orb". Replacement for Spirit. |
| manage | plain | 0/1 | 1 |  |
| management | plain | 3/0 | 2 |  |
| mandala | plain | 2/1 | 3 |  |
| mandatory | plain | 5/0 | 5 |  |
| mane | plain | 2/1 | 3 |  |
| manfalut | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mangrove | plain | 0/5 | 4 |  |
| manica | real-world or technical (doc only) | 6/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| manifest | plain | 6/0 | 4 |  |
| manifestation | owner | 8/6 | 4 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| manikyala | real-world or technical (doc only) | 3/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mannequin | plain | 2/1 | 3 |  |
| manning | plain | 2/0 | 2 |  |
| manticore | plain | 3/1 | 3 |  |
| mantle | plain | 12/0 | 6 |  |
| manual | plain | 2/0 | 2 |  |
| many | plain | 4/1 | 5 |  |
| map | poe | 17/6 | 13 |  |
| maps | poe | 4/0 | 2 |  |
| marble | plain | 4/2 | 3 |  |
| marching | plain | 4/0 | 3 |  |
| mari | plain | 12/0 | 2 |  |
| mark | poe | 27/9 | 16 |  |
| markdown | plain | 7/0 | 4 |  |
| marked | plain | 13/5 | 8 |  |
| market | plain | 4/2 | 6 |  |
| markings | plain | 2/1 | 3 |  |
| marks | poe | 15/6 | 8 |  |
| marsh | plain | 3/3 | 6 |  |
| martial | plain | 3/1 | 4 |  |
| mask | plain | 0/1 | 1 |  |
| mason | plain | 17/0 | 8 |  |
| masonry | plain | 4/2 | 3 |  |
| mass | plain | 6/3 | 3 |  |
| massive | plain | 2/0 | 2 |  |
| master | plain | 0/2 | 2 |  |
| masteries | poe | 1/0 | 1 |  |
| mastery | poe | 20/12 | 7 |  |
| match | plain | 1/4 | 4 |  |
| matches | plain | 4/2 | 3 |  |
| material | plain | 34/13 | 11 |  |
| materials | plain | 22/21 | 26 |  |
| matrix | plain | 1/0 | 1 |  |
| matte | plain | 2/0 | 2 |  |
| matter | plain | 1/0 | 1 |  |
| mattes | plain | 2/0 | 1 |  |
| mature | plain | 1/0 | 1 |  |
| maul | plain | 18/4 | 12 |  |
| maximal | plain | 1/0 | 1 |  |
| maximize | plain | 1/0 | 1 |  |
| maximum | poe | 51/9 | 8 |  |
| may | plain | 1/0 | 1 |  |
| mb | technical | 2/0 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| mch | technical | 0/2 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| meadow | plain | 0/1 | 1 |  |
| meander | plain | 6/0 | 2 |  |
| meaning | plain | 3/0 | 3 |  |
| measure | plain | 8/0 | 4 |  |
| measured | plain | 1/0 | 1 |  |
| mechanical | plain | 2/0 | 2 |  |
| mechanically | plain | 3/0 | 1 |  |
| mechanics | plain | 1/0 | 1 |  |
| medieval | plain | 1/0 | 1 |  |
| medinet | real-world | 12/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| meditate | plain | 2/0 | 2 |  |
| meditation | plain | 0/1 | 1 |  |
| medium | plain | 9/0 | 7 |  |
| meketre | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| melee | plain | 6/8 | 8 |  |
| meltwater | plain | 1/1 | 2 | Real terrain ("Meltwater tributary"). |
| member | plain | 4/0 | 1 |  |
| membrane | plain | 2/1 | 3 |  |
| memories | plain | 1/0 | 1 |  |
| memory | plain | 15/4 | 12 |  |
| menu | plain | 0/15 | 3 |  |
| merchant | plain | 2/1 | 3 |  |
| merged | plain | 0/2 | 1 | Ordinary English word used in its normal meaning. |
| merges | plain | 2/1 | 3 |  |
| meridian | plain | 2/1 | 3 |  |
| mesa | plain | 12/1 | 6 |  |
| mesehti | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| mesh | plain | 2/1 | 3 |  |
| meshes | plain | 0/18 | 18 |  |
| meshy | plain | 4/0 | 3 |  |
| meskalamdug | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| mesoamerica | real-world or technical (doc only) | 42/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mesoamerican | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mesolithic | plain | 12/0 | 7 |  |
| mesopotamia | plain | 11/0 | 4 |  |
| mesopotamian | plain | 7/0 | 3 |  |
| met | plain | 24/0 | 5 |  |
| metal | plain | 21/5 | 10 |  |
| metallic | plain | 3/1 | 3 |  |
| meteor | plain | 24/8 | 10 |  |
| meteoric | plain | 94/0 | 12 |  |
| meter | plain | 1/0 | 1 |  |
| methods | plain | 1/0 | 1 |  |
| metre | plain | 0/2 | 2 | Ordinary English word used in its normal meaning. |
| metropolitan | plain | 13/0 | 5 |  |
| miasma | plain | 0/1 | 1 |  |
| mid | plain | 8/0 | 3 |  |
| middle | plain | 28/0 | 9 |  |
| midrib | plain | 5/0 | 4 |  |
| midribs | plain | 3/0 | 2 |  |
| might | poe | 1/5 | 4 |  |
| migration | plain | 3/0 | 3 |  |
| mikk | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| mikkelsen | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| milestone | plain | 4/0 | 1 |  |
| min | plain | 6/0 | 1 |  |
| mind | owner | 7/6 | 6 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| mine | poe | 1/3 | 3 |  |
| mineral | plain | 2/2 | 4 |  |
| mines | poe | 5/1 | 5 |  |
| minimize | plain | 1/0 | 1 |  |
| minoan | plain | 6/0 | 2 |  |
| minutes | plain | 1/0 | 1 |  |
| mirror | plain | 18/5 | 14 |  |
| mis | plain | 1/0 | 1 |  |
| misc | real-world or technical (doc only) | 15/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mishmar | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| miss | plain | 1/0 | 1 |  |
| missed | plain | 2/1 | 3 |  |
| misses | plain | 2/3 | 5 |  |
| missile | plain | 2/0 | 2 |  |
| missiles | plain | 10/3 | 5 |  |
| missing | plain | 4/17 | 13 |  |
| mission | plain | 2/0 | 2 |  |
| mist | plain | 17/10 | 4 |  |
| mit | technical | 3/3 | 4 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| mitigation | plain | 1/0 | 1 |  |
| mittens | plain | 15/0 | 2 |  |
| mitts | plain | 13/0 | 5 |  |
| mixed | plain | 3/1 | 4 |  |
| mlx | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| mmorpg | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mobile | plain | 1/0 | 1 |  |
| mobility | plain | 2/0 | 2 |  |
| moccasin | plain | 18/0 | 2 |  |
| moccasins | plain | 6/0 | 2 |  |
| mod | plain | 7/0 | 3 |  |
| mode | plain | 2/0 | 2 |  |
| model | plain | 2/0 | 2 |  |
| modern | plain | 3/0 | 3 |  |
| modified | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| modifier | poe | 1/4 | 2 |  |
| modpool | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| modpools | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mods | plain | 3/0 | 2 |  |
| modular | plain | 2/1 | 3 |  |
| module | plain | 10/0 | 6 |  |
| modules | plain | 2/0 | 2 |  |
| moisture | plain | 2/1 | 3 |  |
| mold | plain | 3/0 | 2 |  |
| molten | plain | 10/4 | 3 |  |
| momentum | plain | 2/0 | 1 |  |
| mongolian | plain | 1/0 | 1 |  |
| monitor | plain | 1/0 | 1 |  |
| monoliths | plain | 1/0 | 1 |  |
| monsoon | plain | 4/2 | 3 |  |
| monster | plain | 1/9 | 3 |  |
| montefortino | real-world or technical (doc only) | 8/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| monument | plain | 2/0 | 1 |  |
| moodboard | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| moonlight | plain | 4/2 | 3 |  |
| moonlit | plain | 3/1 | 3 |  |
| moor | plain | 2/1 | 3 |  |
| more | poe | 1/0 | 1 |  |
| mortar | plain | 5/1 | 5 |  |
| mose | plain | 9/0 | 5 |  |
| moss | plain | 4/2 | 3 |  |
| mossy | plain | 2/1 | 3 |  |
| most | plain | 10/1 | 9 |  |
| motes | plain | 8/7 | 4 |  |
| motif | plain | 2/0 | 2 |  |
| motion | plain | 3/1 | 3 |  |
| mount | plain | 1/0 | 1 |  |
| mountain | plain | 3/1 | 4 |  |
| mounted | plain | 2/0 | 2 |  |
| mouse | plain | 3/0 | 2 |  |
| mouth | plain | 4/1 | 5 |  |
| mouthed | plain | 2/0 | 2 |  |
| move | plain | 12/4 | 12 |  |
| moved | plain | 0/1 | 1 | Plain word. The gui_framekit monster affix "Chains the Living · Cannot Be Moved" is flavour, purged separately. |
| movement | poe | 59/23 | 19 |  |
| moves | plain | 1/0 | 1 |  |
| moving | plain | 14/7 | 14 |  |
| mud | plain | 6/3 | 5 |  |
| mudeater | technical | 0/1 | 1 | Third-party source asset name in imported-source.json; not displayed. |
| muldbjerg | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| multi | real-world or technical (doc only) | 7/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| multiplayer | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| multiple | plain | 2/0 | 2 |  |
| multiplier | poe | 1/0 | 1 |  |
| murcielagos | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| murk | plain | 1/1 | 2 |  |
| muscular | plain | 0/1 | 1 |  |
| museum | plain | 158/0 | 12 |  |
| music | plain | 3/4 | 5 |  |
| must | plain | 8/0 | 3 |  |
| muted | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mv | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mvp | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| mycenae | real-world | 9/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| mycenaean | plain | 16/0 | 6 |  |
| mystic | plain | 3/0 | 2 |  |
| nahal | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| name | plain | 9/2 | 6 |  |
| namebank | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| named | plain | 6/0 | 6 |  |
| nameless | plain | 3/0 | 1 |  |
| names | plain | 1/0 | 1 |  |
| naming | plain | 5/0 | 4 |  |
| nano | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| naqada | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| narmer | real-world | 12/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| narrow | plain | 7/3 | 4 |  |
| national | plain | 13/0 | 6 |  |
| native | plain | 5/7 | 9 |  |
| natural | owner | 11/4 | 12 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| naturally | plain | 1/0 | 1 |  |
| nature | plain | 13/6 | 3 |  |
| naue | real-world | 7/0 | 3 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| ne | plain | 3/0 | 2 |  |
| near | plain | 25/1 | 12 |  |
| nearby | plain | 3/3 | 6 |  |
| nearest | plain | 1/0 | 1 |  |
| nebamun | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| nebra | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| nebula | plain | 2/1 | 3 |  |
| neck | plain | 9/5 | 10 |  |
| necklace | plain | 7/0 | 3 |  |
| neckpiece | plain | 1/0 | 1 |  |
| necromancy | plain | 19/5 | 3 |  |
| necropolis | plain | 1/1 | 2 |  |
| needle | plain | 5/1 | 6 |  |
| needs | plain | 5/0 | 4 |  |
| negations | plain | 1/0 | 1 |  |
| negative | plain | 3/0 | 2 |  |
| negau | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| neither | plain | 1/2 | 2 |  |
| neo | plain | 11/0 | 7 |  |
| neolithic | plain | 46/0 | 9 |  |
| neon | plain | 1/0 | 1 |  |
| net | plain | 4/0 | 3 |  |
| neutral | plain | 4/0 | 4 |  |
| never | plain | 58/0 | 17 |  |
| new | plain | 54/6 | 25 |  |
| newer | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| newly | plain | 1/0 | 1 |  |
| newstead | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| next | plain | 8/7 | 10 |  |
| niagara | plain | 331/162 | 3 |  |
| nice | plain | 1/0 | 1 |  |
| night | plain | 4/2 | 3 |  |
| nightglass | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| nile | plain | 11/0 | 6 |  |
| nimrud | real-world or technical (doc only) | 8/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| nine | plain | 7/1 | 8 |  |
| nla | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| no | plain | 161/51 | 87 |  |
| nock | plain | 1/0 | 1 |  |
| node | plain | 33/8 | 15 |  |
| nodes | plain | 10/2 | 7 |  |
| nodule | plain | 2/0 | 2 |  |
| nomenclature | plain | 1/0 | 1 |  |
| non | plain | 6/0 | 5 |  |
| none | plain | 5/0 | 5 |  |
| noon | plain | 2/1 | 3 |  |
| nordic | plain | 2/0 | 2 |  |
| normal | poe | 5/3 | 7 |  |
| normalgl | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| normalize | plain | 0/1 | 1 |  |
| normals | plain | 4/2 | 3 |  |
| north | plain | 132/0 | 9 |  |
| northeast | plain | 3/0 | 1 |  |
| northern | plain | 14/0 | 6 |  |
| northwest | plain | 42/0 | 3 |  |
| not | plain | 36/12 | 26 |  |
| notable | poe | 8/4 | 6 |  |
| notables | poe | 1/0 | 1 |  |
| notched | plain | 2/0 | 2 |  |
| note | plain | 13/2 | 3 |  |
| notes | plain | 15/0 | 9 |  |
| nothing | plain | 11/11 | 11 |  |
| notice | plain | 0/2 | 2 |  |
| notifications | plain | 0/1 | 1 |  |
| nova | plain | 14/13 | 12 |  |
| novelty | plain | 1/0 | 1 |  |
| november | plain | 1/0 | 1 |  |
| now | plain | 1/0 | 1 |  |
| nub | plain | 0/4 | 1 |  |
| nubia | plain | 2/0 | 2 |  |
| numb | plain | 1/0 | 1 |  |
| number | plain | 3/1 | 3 |  |
| numbers | plain | 2/0 | 2 |  |
| numeric | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| nw | technical | 3/0 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| oa | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| oasis | plain | 0/3 | 3 |  |
| oath | plain | 2/0 | 1 |  |
| object | plain | 2/3 | 3 |  |
| observed | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| obsidian | plain | 64/6 | 22 |  |
| ochre | plain | 12/0 | 6 | Real Bronze Age pigment (Red Ochre). "Marsh Ochre" is purged separately. |
| oct | technical | 0/18 | 15 | Date. |
| october | plain | 1/0 | 1 |  |
| oes | plain | 1/0 | 1 |  |
| oetzi | real-world | 76/0 | 7 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| of | plain | 35/16 | 7 |  |
| off | plain | 14/1 | 10 |  |
| offense | plain | 1/1 | 2 |  |
| offer | plain | 4/0 | 2 |  |
| offering | plain | 34/7 | 21 |  |
| offerings | plain | 8/1 | 8 |  |
| offers | plain | 2/1 | 3 |  |
| officer | plain | 2/0 | 2 |  |
| offline | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| offset | plain | 4/2 | 3 |  |
| ofl | technical | 1/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| oil | plain | 3/0 | 3 |  |
| ok | plain | 3/0 | 3 |  |
| old | plain | 4/0 | 3 |  |
| oldowan | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| on | plain | 39/6 | 14 |  |
| once | plain | 4/2 | 6 |  |
| one | plain | 107/33 | 39 |  |
| only | plain | 23/5 | 15 |  |
| onyx | plain | 1/0 | 1 |  |
| op | technical | 10/0 | 1 | graphics or tooling term in a WIZARD lab page |
| opacity | plain | 4/2 | 3 |  |
| opaque | plain | 1/0 | 1 |  |
| open | plain | 40/4 | 30 |  |
| openers | plain | 1/0 | 1 |  |
| opening | plain | 3/11 | 4 |  |
| openings | plain | 1/0 | 1 |  |
| opens | plain | 8/4 | 6 |  |
| openwork | plain | 3/0 | 2 |  |
| operating | plain | 1/0 | 1 |  |
| operational | plain | 1/0 | 1 |  |
| opponent | plain | 0/4 | 2 |  |
| optimized | plain | 2/0 | 1 | Ordinary English word used in its normal meaning. |
| option | plain | 1/1 | 2 |  |
| optional | plain | 6/0 | 6 |  |
| optionally | plain | 1/0 | 1 |  |
| options | plain | 2/0 | 2 |  |
| or | plain | 2/0 | 2 |  |
| orange | plain | 42/21 | 3 |  |
| orb | poe | 21/14 | 14 |  |
| orbit | plain | 10/2 | 7 |  |
| orbiting | plain | 5/2 | 3 |  |
| orbits | plain | 1/1 | 2 |  |
| orbl | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| orbr | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| orbs | poe | 15/0 | 8 |  |
| orcs | plain | 1/0 | 1 |  |
| order | plain | 7/0 | 5 |  |
| ordinary | plain | 5/0 | 4 |  |
| organic | plain | 1/0 | 1 |  |
| oriented | plain | 4/1 | 5 |  |
| origin | plain | 14/10 | 16 |  |
| original | plain | 4/83 | 27 |  |
| ornament | plain | 6/0 | 3 |  |
| ornamental | plain | 1/0 | 1 |  |
| ornate | plain | 7/1 | 5 |  |
| orphan | plain | 1/0 | 1 |  |
| orthographic | plain | 2/0 | 2 |  |
| ossuary | plain | 0/1 | 1 |  |
| other | plain | 3/0 | 3 |  |
| otherworldly | plain | 5/0 | 3 |  |
| our | plain | 16/0 | 5 |  |
| ouroboros | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ours | plain | 8/0 | 1 |  |
| out | plain | 7/2 | 5 |  |
| outdoor | plain | 2/0 | 2 |  |
| outer | owner | 39/14 | 24 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| outline | plain | 6/3 | 3 |  |
| output | plain | 6/0 | 5 |  |
| oval | plain | 23/0 | 8 |  |
| over | plain | 6/1 | 6 |  |
| overcast | plain | 2/1 | 3 |  |
| overcharged | plain | 10/5 | 3 | plain English |
| overflap | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| overflow | plain | 0/3 | 1 |  |
| overgrow | plain | 2/1 | 3 |  |
| overgrown | plain | 2/2 | 4 |  |
| overhaul | plain | 2/0 | 1 |  |
| overhead | plain | 1/2 | 3 |  |
| overlap | plain | 1/1 | 2 |  |
| overlapping | plain | 4/1 | 4 | Ordinary English word used in its normal meaning. |
| overlaps | plain | 5/0 | 1 |  |
| overlay | plain | 4/1 | 4 |  |
| overlays | plain | 1/0 | 1 |  |
| overload | plain | 8/4 | 3 |  |
| overpay | plain | 1/0 | 1 |  |
| overpressure | plain | 2/1 | 3 |  |
| overrides | plain | 1/0 | 1 |  |
| oversized | plain | 3/0 | 2 |  |
| overstuffed | plain | 2/1 | 3 |  |
| overt | plain | 2/0 | 2 |  |
| overview | plain | 0/1 | 1 |  |
| overwhelm | plain | 1/0 | 1 |  |
| own | plain | 1/0 | 1 |  |
| owned | plain | 4/0 | 3 |  |
| owner | plain | 20/0 | 12 |  |
| ownership | plain | 1/0 | 1 |  |
| oxhide | plain | 10/0 | 5 |  |
| oxus | real-world or technical (doc only) | 7/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ozone | plain | 1/0 | 1 |  |
| pace | plain | 1/0 | 1 |  |
| pacify | plain | 2/1 | 3 |  |
| pack | poe | 53/23 | 26 |  |
| packaged | plain | 0/2 | 2 | Ordinary English word used in its normal meaning. |
| packed | plain | 0/1 | 1 |  |
| packet | plain | 4/0 | 2 |  |
| packing | plain | 5/0 | 3 |  |
| packs | poe | 2/0 | 2 |  |
| padded | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| paddle | plain | 11/0 | 5 |  |
| page | plain | 0/3 | 3 |  |
| pages | plain | 6/0 | 4 |  |
| pain | plain | 3/1 | 3 |  |
| paint | plain | 3/0 | 2 |  |
| painted | plain | 14/0 | 7 |  |
| painterly | plain | 1/0 | 1 |  |
| painting | plain | 1/0 | 1 |  |
| pair | plain | 15/0 | 3 |  |
| paired | plain | 5/0 | 4 |  |
| pairs | plain | 1/0 | 1 |  |
| palace | plain | 0/3 | 2 |  |
| palaeolithic | plain | 2/0 | 2 |  |
| pale | plain | 59/29 | 3 |  |
| paleolithic | plain | 2/0 | 2 |  |
| palette | plain | 30/0 | 11 |  |
| pallor | plain | 4/3 | 4 |  |
| palm | plain | 3/0 | 3 |  |
| paludamentum | plain | 2/0 | 2 |  |
| pane | plain | 2/0 | 1 |  |
| panel | plain | 7/8 | 9 |  |
| panels | plain | 10/0 | 3 |  |
| pants | plain | 1/0 | 1 |  |
| paper | plain | 1/0 | 1 |  |
| paperdoll | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| paradigm | owner | 6/2 | 3 | owner lattice canon ('Paradigm Shift') |
| parameter | plain | 4/2 | 3 |  |
| parameters | plain | 1/0 | 1 |  |
| parma | plain | 2/0 | 2 |  |
| parry | poe | 0/2 | 2 |  |
| parrying | plain | 2/0 | 2 |  |
| part | plain | 7/1 | 7 |  |
| parthenon | plain | 2/0 | 2 |  |
| parthian | plain | 4/0 | 3 |  |
| particle | plain | 1/2 | 2 |  |
| particles | plain | 4/1 | 3 |  |
| parts | plain | 22/11 | 18 |  |
| party | plain | 5/0 | 2 |  |
| pass | plain | 19/2 | 11 |  |
| passes | plain | 1/1 | 2 |  |
| passive | poe | 23/15 | 21 |  |
| password | plain | 0/1 | 1 |  |
| paste | plain | 3/0 | 3 |  |
| pasture | plain | 0/2 | 2 |  |
| patch | plain | 2/0 | 2 |  |
| patchwork | plain | 3/0 | 2 |  |
| path | plain | 38/6 | 24 |  |
| paths | plain | 2/0 | 2 |  |
| patience | plain | 10/0 | 6 |  |
| patina | plain | 6/2 | 5 |  |
| pattern | plain | 20/8 | 9 |  |
| patterned | plain | 3/0 | 2 |  |
| patterns | plain | 3/0 | 1 |  |
| paul | plain | 0/1 | 1 |  |
| pauldrons | plain | 1/0 | 1 |  |
| pause | plain | 5/2 | 5 |  |
| paused | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| pauses | plain | 1/0 | 1 |  |
| paving | plain | 2/1 | 3 |  |
| paw | plain | 0/2 | 1 |  |
| payoff | plain | 2/0 | 1 |  |
| pays | plain | 4/2 | 3 |  |
| pbr | technical | 0/2 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| pcg | technical | 4/2 | 3 | graphics or tooling term in a WIZARD lab page |
| pcm | technical | 0/2 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| pear | plain | 5/0 | 2 |  |
| pearl | plain | 2/0 | 2 |  |
| pebble | plain | 2/1 | 3 |  |
| pebbles | plain | 12/6 | 3 |  |
| pectoral | plain | 2/0 | 2 |  |
| pedestal | plain | 1/0 | 1 |  |
| peeling | plain | 2/0 | 1 |  |
| pelt | plain | 4/0 | 4 |  |
| pelta | plain | 6/0 | 4 |  |
| penannular | plain | 3/0 | 2 |  |
| pendant | plain | 17/0 | 7 |  |
| pendular | plain | 2/0 | 2 |  |
| penetration | poe | 4/2 | 6 |  |
| people | plain | 1/0 | 1 |  |
| peoples | plain | 9/0 | 2 |  |
| per | plain | 7/4 | 11 |  |
| perfect | plain | 1/0 | 1 |  |
| performance | plain | 2/0 | 2 |  |
| period | plain | 23/0 | 7 |  |
| perishable | plain | 2/0 | 2 |  |
| perlin | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| permanently | plain | 6/3 | 3 |  |
| pernik | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| persepolis | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| persistence | plain | 3/0 | 3 |  |
| persistent | plain | 3/1 | 4 |  |
| perspective | plain | 1/0 | 1 |  |
| peschiera | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| petals | plain | 4/2 | 3 |  |
| pg | technical | 9/0 | 2 | Excavation grave number (Ur PG 789) in ITEM-TYPES-BY-SKILL-ZONE.md. |
| phase | plain | 21/2 | 9 |  |
| phaser | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| phial | plain | 5/2 | 3 |  |
| phrasing | plain | 1/0 | 1 |  |
| phrygian | plain | 4/0 | 2 |  |
| physical | poe | 57/50 | 25 |  |
| pi | plain | 4/0 | 1 |  |
| pick | plain | 12/1 | 9 |  |
| picked | plain | 1/1 | 2 |  |
| pickup | plain | 0/1 | 1 |  |
| piece | plain | 3/0 | 3 |  |
| pierce | plain | 3/1 | 4 |  |
| pierced | plain | 8/0 | 5 |  |
| pigment | real-world | 13/0 | 6 | Pigment material names (Red Ochre, Woad, Soot) are real Bronze Age pigments (rule 11). Purge only the flavour descriptio |
| pigments | plain | 1/0 | 1 |  |
| pike | plain | 2/1 | 3 |  |
| pillar | plain | 2/1 | 3 |  |
| pillow | plain | 1/0 | 1 |  |
| pilos | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| pin | plain | 3/0 | 2 |  |
| pinhole | plain | 4/2 | 3 |  |
| pinterest | real-world or technical (doc only) | 8/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| pipeline | plain | 2/0 | 1 |  |
| pit | plain | 7/3 | 3 |  |
| pixel | plain | 22/25 | 40 | Ordinary English word used in its normal meaning. |
| pixelorama | real-world or technical (doc only) | 3/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| place | plain | 4/0 | 2 |  |
| placeholder | plain | 2/0 | 2 |  |
| placement | plain | 1/0 | 1 |  |
| plain | plain | 42/0 | 11 |  |
| plaited | plain | 3/0 | 2 |  |
| plan | plain | 4/1 | 5 |  |
| plane | owner | 91/41 | 11 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| plank | plain | 2/0 | 2 |  |
| planned | plain | 2/0 | 1 | Ordinary English word used in its normal meaning. |
| plant | plain | 8/0 | 4 |  |
| plaque | plain | 7/0 | 4 |  |
| plaques | plain | 9/0 | 2 |  |
| plasma | plain | 3/1 | 4 |  |
| plaster | plain | 0/1 | 1 |  |
| plate | plain | 17/2 | 11 |  |
| plateau | plain | 2/3 | 5 |  |
| plated | plain | 2/0 | 2 |  |
| plates | plain | 7/0 | 3 |  |
| platinum | plain | 2/1 | 3 |  |
| plausible | plain | 3/0 | 3 |  |
| play | plain | 5/8 | 10 |  |
| playable | plain | 1/0 | 1 |  |
| playback | plain | 1/0 | 1 |  |
| player | plain | 6/3 | 8 |  |
| players | plain | 1/0 | 1 |  |
| playground | plain | 3/0 | 2 |  |
| playing | plain | 0/1 | 1 |  |
| please | plain | 3/0 | 3 |  |
| plumbata | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| plus | plain | 1/0 | 1 |  |
| pm | technical | 754/0 | 16 | Time in file names. |
| png | technical | 30/4 | 19 | File format. |
| pngs | real-world or technical (doc only) | 5/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| point | plain | 14/1 | 10 |  |
| pointcoord | technical | 2/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| pointed | plain | 6/0 | 2 |  |
| pointer | plain | 3/1 | 4 |  |
| pointing | plain | 2/1 | 3 |  |
| points | plain | 8/4 | 7 |  |
| poise | plain | 5/2 | 4 |  |
| poison | poe | 46/29 | 20 |  |
| poisoned | poe | 4/2 | 5 |  |
| poisonous | plain | 2/1 | 3 |  |
| poisons | plain | 4/2 | 6 |  |
| pole | plain | 2/0 | 2 |  |
| polearms | plain | 1/0 | 1 |  |
| policy | plain | 1/0 | 1 |  |
| polish | plain | 3/1 | 4 |  |
| polished | plain | 6/0 | 2 |  |
| poll | plain | 1/0 | 1 |  |
| pollen | plain | 4/1 | 3 |  |
| poludnica | real-world or technical (doc only) | 3/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| pommel | plain | 6/0 | 2 |  |
| pool | plain | 9/5 | 6 |  |
| pop | plain | 2/0 | 1 |  |
| populate | plain | 1/0 | 1 |  |
| port | plain | 1/0 | 1 |  |
| portable | plain | 2/0 | 2 |  |
| portal | poe | 7/2 | 4 |  |
| portals | plain | 7/3 | 3 |  |
| portfolio | plain | 2/0 | 2 |  |
| porting | plain | 1/0 | 1 |  |
| portrait | plain | 0/7 | 2 |  |
| position | plain | 6/2 | 4 |  |
| positive | plain | 1/0 | 1 |  |
| possible | plain | 1/0 | 1 |  |
| post | plain | 4/5 | 5 |  |
| potential | plain | 3/0 | 1 |  |
| potion | plain | 6/1 | 5 |  |
| pouch | plain | 14/0 | 7 |  |
| pour | plain | 3/1 | 3 |  |
| pouring | plain | 1/0 | 1 |  |
| poverty | plain | 1/0 | 1 |  |
| power | poe | 16/8 | 14 |  |
| pr | real-world or technical (doc only) | 27/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| praenestine | plain | 2/0 | 2 |  |
| pre | technical | 14/0 | 6 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| precedent | plain | 10/0 | 1 |  |
| predecessor | plain | 1/0 | 1 |  |
| predynastic | plain | 10/0 | 5 |  |
| prefer | plain | 17/0 | 8 |  |
| prefix | poe | 1/0 | 1 |  |
| prefixes | plain | 6/0 | 1 |  |
| prehistoric | plain | 11/0 | 5 |  |
| preparation | plain | 9/0 | 5 |  |
| prepared | plain | 1/1 | 2 |  |
| prepend | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| present | plain | 15/0 | 3 |  |
| presentation | plain | 8/1 | 6 |  |
| preserve | plain | 27/0 | 8 |  |
| preserved | plain | 1/1 | 2 | Plain word in node name "Preserved Supplies". |
| presets | plain | 1/0 | 1 |  |
| press | plain | 8/2 | 8 |  |
| pressure | plain | 4/1 | 3 |  |
| prestige | plain | 1/0 | 1 |  |
| prevention | plain | 1/1 | 2 |  |
| preview | plain | 17/1 | 9 |  |
| previous | plain | 1/7 | 6 |  |
| priest | plain | 0/1 | 1 |  |
| primary | plain | 8/0 | 8 |  |
| primitive | plain | 2/0 | 2 |  |
| principled | technical | 0/10 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| priorities | plain | 1/0 | 1 |  |
| priority | plain | 1/0 | 1 |  |
| prison | plain | 2/2 | 4 |  |
| pro | plain | 7/0 | 4 |  |
| probe | plain | 2/0 | 2 |  |
| proc | technical | 4/2 | 3 | graphics or tooling term in a WIZARD lab page |
| procedural | plain | 2/9 | 6 |  |
| processional | plain | 1/1 | 2 |  |
| production | plain | 8/1 | 7 |  |
| prof | plain | 2/2 | 2 |  |
| progress | plain | 14/6 | 10 |  |
| proj | technical | 1/0 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| project | plain | 1/0 | 1 |  |
| projectile | poe | 75/38 | 14 |  |
| projectiles | poe | 2/0 | 2 |  |
| promote | plain | 2/0 | 2 |  |
| promoted | real-world or technical (doc only) | 23/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| prompt | plain | 57/0 | 15 |  |
| prompts | plain | 5/0 | 3 |  |
| prong | plain | 3/0 | 3 |  |
| pronged | plain | 4/0 | 4 |  |
| prongs | plain | 1/0 | 1 |  |
| proof | plain | 3/0 | 1 |  |
| prop | plain | 1/0 | 1 |  |
| proper | plain | 2/0 | 2 |  |
| properties | plain | 2/0 | 1 |  |
| proportions | plain | 0/1 | 1 |  |
| proposal | plain | 6/0 | 4 |  |
| propose | plain | 1/0 | 1 |  |
| proposed | plain | 8/0 | 5 | Ordinary English word used in its normal meaning. |
| protect | plain | 2/0 | 2 |  |
| protected | plain | 2/1 | 3 |  |
| protection | plain | 3/2 | 5 |  |
| proves | plain | 1/0 | 1 |  |
| provide | plain | 1/0 | 1 |  |
| prs | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| pt | technical | 1/0 | 1 | graphics or tooling term in a WIZARD lab page |
| ptolemaic | plain | 2/0 | 2 |  |
| public | plain | 4/0 | 2 |  |
| publish | plain | 1/0 | 1 |  |
| puddle | plain | 2/1 | 3 |  |
| puddles | plain | 3/1 | 3 |  |
| pugio | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| pull | plain | 3/1 | 3 |  |
| pulling | plain | 2/0 | 1 |  |
| pulse | plain | 9/4 | 4 |  |
| punch | plain | 1/1 | 2 |  |
| punish | plain | 2/3 | 5 |  |
| pure | plain | 5/0 | 3 |  |
| purple | plain | 2/0 | 2 |  |
| purpose | plain | 1/0 | 1 |  |
| push | plain | 6/0 | 4 |  |
| put | plain | 0/1 | 1 |  |
| pylos | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| python | plain | 5/0 | 2 |  |
| pyxis | plain | 6/0 | 3 |  |
| qa | technical | 35/6 | 22 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| quadrant | plain | 1/0 | 1 |  |
| qualifiers | plain | 1/0 | 1 |  |
| quality | poe | 8/0 | 7 |  |
| quantum | plain | 1/0 | 1 |  |
| quarrels | plain | 1/0 | 1 |  |
| quarry | plain | 1/5 | 4 |  |
| quarter | plain | 2/1 | 3 |  |
| queen | plain | 6/1 | 5 |  |
| quest | poe | 7/1 | 7 |  |
| quick | plain | 4/1 | 5 |  |
| quickened | plain | 0/1 | 1 |  |
| quicksilver | plain | 2/1 | 3 |  |
| quickstart | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| quiet | plain | 6/3 | 3 |  |
| quilted | plain | 12/0 | 9 |  |
| quit | plain | 0/5 | 3 |  |
| quiver | poe | 25/0 | 8 |  |
| rack | plain | 2/0 | 2 |  |
| radar | plain | 1/0 | 1 |  |
| radial | plain | 4/3 | 4 |  |
| radiance | plain | 8/5 | 4 |  |
| radiant | plain | 0/1 | 1 |  |
| radius | plain | 14/6 | 7 |  |
| ragdoll | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| rage | plain | 4/6 | 4 |  |
| ragged | plain | 1/0 | 1 |  |
| raid | plain | 0/1 | 1 |  |
| raider | plain | 1/2 | 2 |  |
| rails | plain | 1/0 | 1 |  |
| rain | plain | 31/10 | 5 |  |
| rainforest | plain | 0/3 | 3 | Real terrain. |
| raises | plain | 2/4 | 5 |  |
| ram | plain | 4/1 | 5 |  |
| ramesseum | real-world | 12/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| ramps | plain | 1/0 | 1 |  |
| random | plain | 3/0 | 2 |  |
| randomize | plain | 2/0 | 2 |  |
| range | plain | 26/14 | 13 |  |
| rare | poe | 1/4 | 4 |  |
| rarity | plain | 11/8 | 8 |  |
| rasters | plain | 1/0 | 1 |  |
| rat | plain | 1/0 | 1 |  |
| rate | plain | 9/4 | 4 |  |
| rated | plain | 1/0 | 1 |  |
| rating | plain | 6/5 | 3 |  |
| ratings | plain | 4/0 | 2 |  |
| rattle | plain | 3/0 | 3 |  |
| ravines | plain | 1/1 | 2 |  |
| raw | plain | 10/7 | 10 |  |
| rawhide | plain | 45/0 | 11 |  |
| ray | plain | 2/0 | 2 |  |
| reach | plain | 37/6 | 17 | plain English in its literal sense only (to reach a node; the stat is Melee Strike Range); never a name, theme or tag of |
| reached | plain | 2/0 | 1 |  |
| reaching | plain | 0/1 | 1 |  |
| react | plain | 16/0 | 7 |  |
| reaction | plain | 2/1 | 3 |  |
| read | plain | 25/5 | 16 |  |
| readable | plain | 3/0 | 3 |  |
| reading | plain | 1/1 | 2 |  |
| readme | technical | 16/0 | 11 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| readmes | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ready | plain | 3/2 | 5 |  |
| reagent | plain | 6/1 | 5 |  |
| reagents | plain | 3/0 | 2 |  |
| real | plain | 6/0 | 4 |  |
| realize | plain | 2/0 | 1 |  |
| reapplying | plain | 2/1 | 3 |  |
| rear | plain | 1/0 | 1 |  |
| rebase | plain | 2/2 | 2 |  |
| recall | plain | 6/1 | 3 |  |
| recalls | plain | 2/1 | 3 |  |
| recent | plain | 1/0 | 1 |  |
| recharge | plain | 2/3 | 3 |  |
| recharges | plain | 1/0 | 1 |  |
| recipe | plain | 0/9 | 9 |  |
| recoil | plain | 2/2 | 4 |  |
| recoloured | plain | 1/0 | 1 | plain English (British spelling) |
| recommended | plain | 1/0 | 1 |  |
| recompute | plain | 1/0 | 1 |  |
| reconceived | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| reconnect | plain | 0/2 | 1 |  |
| reconnecting | plain | 0/1 | 1 |  |
| record | plain | 3/0 | 3 |  |
| recorded | plain | 1/0 | 1 |  |
| recover | plain | 2/0 | 1 |  |
| recovered | plain | 3/7 | 10 |  |
| recovering | plain | 0/2 | 2 |  |
| recovers | plain | 0/2 | 2 |  |
| recovery | poe | 26/10 | 13 |  |
| recruit | plain | 0/1 | 1 |  |
| rectangular | plain | 12/0 | 5 |  |
| recurring | plain | 1/0 | 1 |  |
| recurve | plain | 2/0 | 2 |  |
| red | plain | 133/48 | 17 |  |
| redeemer | plain | 1/0 | 1 |  |
| redesign | plain | 1/0 | 1 |  |
| redglass | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| redirect | plain | 3/0 | 1 |  |
| redirects | plain | 2/0 | 2 |  |
| redo | plain | 1/0 | 1 |  |
| redraw | plain | 1/0 | 1 |  |
| reduce | plain | 0/2 | 1 |  |
| redundant | plain | 21/3 | 10 |  |
| redux | plain | 2/0 | 1 |  |
| reed | plain | 33/5 | 12 |  |
| reel | plain | 5/0 | 1 |  |
| reference | plain | 26/7 | 11 |  |
| reflect | poe | 3/3 | 4 |  |
| reflecting | plain | 1/1 | 2 |  |
| reflections | plain | 2/1 | 3 |  |
| reflects | plain | 3/0 | 2 |  |
| reflex | plain | 2/0 | 2 |  |
| refraction | plain | 4/2 | 3 |  |
| refund | owner | 3/2 | 3 | Owner: "Refund points". |
| refunded | plain | 2/2 | 2 |  |
| refunding | plain | 0/2 | 1 |  |
| regain | plain | 3/0 | 2 |  |
| regen | plain | 2/0 | 2 | Plain gaming abbreviation. |
| regenerate | poe | 11/0 | 7 |  |
| regeneration | poe | 7/1 | 7 |  |
| region | plain | 1/0 | 1 |  |
| regional | plain | 2/0 | 2 |  |
| regions | plain | 6/0 | 2 |  |
| register | plain | 1/0 | 1 |  |
| registration | plain | 1/0 | 1 |  |
| registry | plain | 4/0 | 3 |  |
| regular | plain | 1/0 | 1 |  |
| reinforce | plain | 0/1 | 1 |  |
| reinterpret | plain | 1/0 | 1 |  |
| reject | plain | 14/0 | 8 |  |
| rejected | plain | 0/1 | 1 |  |
| release | plain | 19/4 | 5 |  |
| released | plain | 1/0 | 1 | plain English |
| releases | plain | 2/1 | 3 |  |
| relic | plain | 243/27 | 41 | Plain English (sacred object) in the same sense as the item; PoE2 Sanctum relics differ, so the keep rests on (b), not ( |
| relics | poe | 32/5 | 16 |  |
| reload | plain | 1/0 | 1 |  |
| relocate | plain | 1/0 | 1 |  |
| remaining | plain | 1/0 | 1 |  |
| remedy | owner | 0/4 | 2 | Owner: "flask/remedy bar". |
| remember | plain | 0/1 | 1 |  |
| remote | plain | 2/0 | 1 |  |
| removal | plain | 2/0 | 2 |  |
| remove | plain | 11/3 | 8 |  |
| removed | plain | 5/1 | 4 |  |
| removes | plain | 3/1 | 4 |  |
| renaissance | plain | 1/0 | 1 |  |
| rename | plain | 1/0 | 1 |  |
| render | plain | 11/4 | 10 |  |
| rendered | plain | 1/0 | 1 |  |
| rendering | plain | 1/0 | 1 |  |
| renders | plain | 1/0 | 1 |  |
| renewal | plain | 1/0 | 1 |  |
| renoise | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| renown | plain | 1/0 | 1 |  |
| reopen | plain | 0/1 | 1 |  |
| reorients | plain | 2/1 | 3 |  |
| repaint | plain | 1/0 | 1 |  |
| repair | plain | 0/1 | 1 |  |
| repeat | plain | 7/3 | 6 |  |
| repeated | plain | 9/3 | 10 |  |
| repel | plain | 4/2 | 3 |  |
| replace | plain | 1/0 | 1 |  |
| replay | plain | 2/1 | 3 |  |
| replaying | plain | 2/0 | 1 |  |
| replica | plain | 2/1 | 3 |  |
| repository | plain | 1/0 | 1 |  |
| reproduce | plain | 1/0 | 1 |  |
| reproduces | plain | 1/0 | 1 |  |
| reproducible | plain | 1/0 | 1 |  |
| required | plain | 6/3 | 7 | Ordinary English word used in its normal meaning. |
| requires | plain | 3/0 | 2 |  |
| reroll | plain | 4/3 | 5 |  |
| rerolling | plain | 1/0 | 1 |  |
| rerolls | plain | 1/0 | 1 |  |
| res | plain | 4/0 | 1 |  |
| rescaling | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| research | plain | 12/0 | 7 |  |
| reservation | poe | 1/0 | 1 |  |
| reserve | plain | 6/0 | 4 |  |
| reserved | plain | 0/5 | 4 |  |
| reset | plain | 21/1 | 18 |  |
| resident | plain | 0/1 | 1 |  |
| residue | plain | 110/55 | 3 |  |
| resin | plain | 1/0 | 1 |  |
| resist | plain | 0/1 | 1 |  |
| resistance | poe | 133/80 | 17 |  |
| resistances | poe | 16/9 | 12 |  |
| reskin | plain | 1/0 | 1 |  |
| resolution | plain | 2/0 | 2 |  |
| resolve | plain | 2/0 | 2 |  |
| resolved | plain | 1/0 | 1 |  |
| resonance | plain | 1/0 | 1 |  |
| resonate | plain | 1/0 | 1 |  |
| resource | plain | 5/1 | 4 |  |
| respec | plain | 3/0 | 2 | Standard ARPG word for refunding the passive tree. |
| respecter | plain | 0/25 | 25 |  |
| responsive | plain | 3/0 | 3 |  |
| rest | plain | 1/0 | 1 |  |
| restart | plain | 1/1 | 2 |  |
| rested | plain | 2/0 | 2 |  |
| resting | plain | 1/0 | 1 |  |
| restless | plain | 1/0 | 1 |  |
| restore | plain | 4/1 | 5 |  |
| restores | plain | 3/1 | 4 |  |
| restrained | plain | 2/0 | 2 |  |
| restraint | plain | 2/1 | 3 |  |
| results | plain | 1/0 | 1 |  |
| resume | plain | 0/3 | 2 |  |
| resupply | plain | 0/1 | 1 |  |
| retain | plain | 0/1 | 1 |  |
| retained | plain | 9/0 | 1 |  |
| retention | plain | 2/3 | 5 |  |
| reticle | plain | 5/2 | 3 |  |
| retire | plain | 8/0 | 5 |  |
| retired | plain | 3/0 | 3 |  |
| retracting | plain | 2/1 | 3 |  |
| retro | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| retry | plain | 0/1 | 1 |  |
| return | plain | 7/8 | 9 |  |
| returned | plain | 2/1 | 2 |  |
| returning | plain | 2/2 | 4 |  |
| reuse | plain | 4/0 | 4 |  |
| reused | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| reveal | plain | 4/1 | 3 |  |
| revel | plain | 2/1 | 3 |  |
| reversals | plain | 1/0 | 1 |  |
| revert | plain | 2/4 | 3 |  |
| review | plain | 16/0 | 9 |  |
| reviewed | plain | 0/1 | 1 |  |
| reviewers | plain | 1/0 | 1 |  |
| revise | plain | 2/0 | 1 |  |
| revision | plain | 0/1 | 1 |  |
| revive | plain | 2/0 | 1 |  |
| rewards | plain | 1/0 | 1 |  |
| rework | plain | 3/0 | 2 |  |
| reworked | plain | 1/0 | 1 |  |
| rewrites | plain | 1/1 | 2 |  |
| rewriting | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rf | real-world or technical (doc only) | 12/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rgb | technical | 4/10 | 6 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| rgba | technical | 11/1 | 8 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| rhomphaia | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rhyd | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rhys | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rhythm | plain | 1/0 | 1 |  |
| rhyton | plain | 2/0 | 2 |  |
| rib | plain | 7/0 | 5 |  |
| ribbed | plain | 2/0 | 2 |  |
| ribbon | plain | 4/0 | 1 |  |
| ribbons | plain | 4/2 | 3 |  |
| ridge | plain | 6/2 | 5 |  |
| ridged | plain | 2/0 | 2 |  |
| ridges | plain | 1/1 | 2 |  |
| riffling | plain | 3/1 | 3 | plain English |
| rift | plain | 107/53 | 4 |  |
| rifts | plain | 2/1 | 3 |  |
| rig | plain | 2/1 | 3 |  |
| right | plain | 6/29 | 14 |  |
| righteous | plain | 3/1 | 4 |  |
| rigid | plain | 2/1 | 3 |  |
| rim | plain | 30/9 | 11 |  |
| rime | plain | 28/16 | 4 |  |
| rimed | plain | 6/3 | 3 |  |
| ring | poe | 83/13 | 25 |  |
| ringblade | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ringing | plain | 1/0 | 1 |  |
| rings | poe | 18/3 | 11 |  |
| ripple | plain | 2/1 | 3 |  |
| ripples | plain | 2/1 | 3 |  |
| rise | plain | 2/1 | 3 |  |
| risen | plain | 1/0 | 1 |  |
| rising | plain | 13/4 | 4 |  |
| risk | plain | 6/0 | 2 |  |
| risks | plain | 1/0 | 1 |  |
| rite | plain | 46/0 | 16 |  |
| ritekeeper | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rites | plain | 15/0 | 4 |  |
| ritual | plain | 107/2 | 26 |  |
| riven | plain | 16/0 | 6 |  |
| river | plain | 32/6 | 17 | plain English in its literal sense only (a river pearl, a river; never the Cold damage type (rule 5)); never a name, the |
| rivet | plain | 2/0 | 2 |  |
| riveted | plain | 4/0 | 3 |  |
| rl | real-world or technical (doc only) | 25/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rmb | owner | 23/3 | 4 | Owner key list. |
| rms | technical | 0/4 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| rng | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| roach | plain | 0/1 | 1 |  |
| roadmap | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| roar | plain | 3/1 | 3 |  |
| robe | plain | 1/0 | 1 |  |
| robed | plain | 4/2 | 3 |  |
| robust | plain | 1/0 | 1 |  |
| rock | plain | 15/11 | 9 |  |
| rocks | plain | 2/1 | 3 |  |
| rocky | plain | 0/5 | 3 |  |
| rod | plain | 33/5 | 13 |  |
| rods | plain | 3/2 | 5 |  |
| rogers | plain | 1/0 | 1 |  |
| rogue | plain | 3/0 | 2 |  |
| role | plain | 2/0 | 2 |  |
| roles | plain | 1/0 | 1 |  |
| roll | poe | 16/2 | 14 |  |
| rolled | plain | 1/0 | 1 |  |
| rolling | plain | 9/2 | 3 |  |
| roman | plain | 111/0 | 13 |  |
| romano | real-world or technical (doc only) | 11/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| roof | plain | 0/43 | 2 |  |
| roomy | plain | 1/0 | 1 |  |
| root | plain | 20/10 | 19 |  |
| roots | plain | 1/0 | 1 |  |
| rope | plain | 3/0 | 2 |  |
| rose | plain | 6/3 | 3 |  |
| roster | plain | 3/0 | 3 |  |
| rot | plain | 2/1 | 3 |  |
| rotate | plain | 3/0 | 3 |  |
| rotten | plain | 3/0 | 2 |  |
| rough | plain | 2/0 | 2 |  |
| roughness | plain | 0/2 | 2 |  |
| round | plain | 4/1 | 4 |  |
| roundshield | real-world or technical (doc only) | 9/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| route | plain | 12/2 | 8 |  |
| routine | plain | 1/0 | 1 |  |
| rows | plain | 6/1 | 4 |  |
| royal | plain | 8/0 | 4 |  |
| rpg | technical | 23/0 | 13 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| rt | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rubble | plain | 28/14 | 3 |  |
| rubin | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ruined | plain | 0/1 | 1 |  |
| ruins | plain | 3/2 | 5 |  |
| rule | plain | 8/0 | 4 |  |
| rules | plain | 4/0 | 4 |  |
| rumble | plain | 1/1 | 2 |  |
| run | plain | 13/15 | 26 |  |
| runbook | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| rune | poe | 77/33 | 6 |  |
| runes | poe | 34/19 | 9 |  |
| rung | plain | 1/0 | 1 |  |
| running | plain | 1/0 | 1 |  |
| runnymede | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| runs | plain | 1/0 | 1 |  |
| runtime | plain | 4/26 | 30 | Ordinary English word used in its normal meaning. |
| rush | plain | 7/1 | 5 |  |
| rusted | plain | 1/0 | 1 |  |
| sabaean | plain | 6/0 | 2 |  |
| sabre | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| sacred | plain | 38/1 | 18 |  |
| safe | plain | 2/1 | 3 |  |
| saga | plain | 15/10 | 6 |  |
| sagaris | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| sagum | plain | 3/0 | 3 |  |
| salisbury | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| salt | plain | 0/4 | 3 |  |
| salted | plain | 1/0 | 1 |  |
| same | plain | 12/3 | 12 |  |
| sample | plain | 5/0 | 3 |  |
| samson | plain | 3/0 | 2 |  |
| san | plain | 3/0 | 2 |  |
| sanctified | plain | 2/1 | 3 |  |
| sanctuary | plain | 1/1 | 2 |  |
| sanctum | plain | 2/1 | 3 |  |
| sand | plain | 31/12 | 8 |  |
| sandals | plain | 19/0 | 8 |  |
| sandblast | plain | 5/1 | 3 |  |
| sandbox | plain | 4/0 | 3 |  |
| sandstone | plain | 14/8 | 4 |  |
| sandstorm | plain | 6/3 | 3 |  |
| sandy | plain | 2/1 | 3 |  |
| sans | plain | 3/0 | 3 |  |
| sap | plain | 6/3 | 3 |  |
| sapling | plain | 2/1 | 3 |  |
| sapphire | plain | 3/1 | 4 |  |
| sapping | plain | 0/1 | 1 |  |
| sarcina | plain | 2/0 | 2 |  |
| sasanian | real-world or technical (doc only) | 9/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| sash | plain | 5/0 | 3 |  |
| saturated | plain | 1/0 | 1 |  |
| saturation | plain | 0/10 | 1 |  |
| save | plain | 13/7 | 14 |  |
| saved | plain | 0/3 | 2 |  |
| saving | plain | 0/2 | 2 |  |
| saying | plain | 1/0 | 1 |  |
| sc | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| scabbards | plain | 1/0 | 1 |  |
| scaffolding | plain | 1/0 | 1 |  |
| scald | plain | 1/0 | 1 |  |
| scale | plain | 35/1 | 17 |  |
| scales | plain | 14/5 | 6 |  |
| scaling | plain | 1/0 | 1 |  |
| scandinavian | plain | 3/0 | 2 |  |
| scar | plain | 3/2 | 5 |  |
| scarab | plain | 5/0 | 2 |  |
| scarf | plain | 9/0 | 2 |  |
| scatter | plain | 1/0 | 1 |  |
| scenario | plain | 1/0 | 1 |  |
| scene | plain | 2/1 | 2 |  |
| scenery | plain | 0/1 | 1 |  |
| sceptre | poe | 6/0 | 4 |  |
| scheduled | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| schema | plain | 1/0 | 1 |  |
| schifferstadt | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| schism | owner | 28/16 | 5 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| schisms | plain | 0/1 | 1 |  |
| science | plain | 1/0 | 1 |  |
| scions | plain | 4/0 | 2 |  |
| sclera | plain | 2/1 | 3 |  |
| scope | plain | 4/0 | 4 |  |
| scorch | plain | 43/26 | 5 |  |
| scorched | plain | 3/3 | 4 |  |
| scorches | plain | 2/1 | 3 |  |
| score | plain | 6/0 | 3 |  |
| scorpion | plain | 0/1 | 1 |  |
| scour | plain | 2/1 | 3 |  |
| scoured | plain | 4/2 | 3 |  |
| scours | plain | 2/1 | 3 |  |
| scrap | plain | 2/1 | 3 |  |
| scrapes | plain | 2/1 | 3 |  |
| screen | plain | 1/0 | 1 |  |
| screens | plain | 0/1 | 1 |  |
| scroll | plain | 2/1 | 3 |  |
| scrub | plain | 1/0 | 1 |  |
| scute | plain | 4/1 | 5 |  |
| scutum | plain | 2/0 | 2 |  |
| scythian | plain | 10/0 | 6 |  |
| sdf | technical | 46/23 | 3 | graphics or tooling term in a WIZARD lab page |
| sdfs | technical | 4/1 | 4 | graphics or tooling term in a WIZARD lab page |
| se | plain | 3/0 | 2 |  |
| sea | plain | 11/1 | 5 |  |
| seal | plain | 8/0 | 5 |  |
| sealed | plain | 1/1 | 2 |  |
| sealing | plain | 1/0 | 1 |  |
| seals | plain | 2/1 | 3 |  |
| seam | plain | 16/5 | 5 |  |
| seamless | plain | 5/0 | 3 |  |
| seams | plain | 5/2 | 3 |  |
| sear | plain | 3/0 | 2 |  |
| search | plain | 9/1 | 7 |  |
| seared | plain | 1/0 | 1 |  |
| seasonal | plain | 0/1 | 1 |  |
| seat | plain | 6/2 | 4 |  |
| seats | plain | 1/0 | 1 |  |
| second | plain | 12/3 | 11 |  |
| secondary | plain | 1/0 | 1 |  |
| sector | plain | 1/0 | 1 |  |
| see | plain | 4/5 | 8 |  |
| seed | plain | 15/6 | 9 |  |
| seedable | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| seeded | plain | 1/0 | 1 |  |
| seeds | plain | 2/1 | 3 |  |
| seen | plain | 2/1 | 3 |  |
| segment | plain | 2/0 | 2 |  |
| segmented | plain | 1/0 | 1 |  |
| segoe | technical | 1/0 | 1 | Font. |
| select | plain | 25/7 | 20 |  |
| selected | plain | 6/5 | 9 |  |
| selection | plain | 4/3 | 6 |  |
| self | plain | 14/5 | 13 |  |
| send | plain | 2/0 | 2 |  |
| sending | plain | 0/1 | 1 |  |
| sends | plain | 2/1 | 3 |  |
| sentinel | plain | 0/1 | 1 |  |
| separate | plain | 2/3 | 5 |  |
| separation | plain | 1/0 | 1 |  |
| separator | plain | 2/0 | 2 |  |
| sequencer | plain | 8/4 | 3 |  |
| serious | plain | 1/0 | 1 |  |
| serpent | plain | 8/10 | 7 |  |
| serpentine | plain | 2/0 | 2 |  |
| serrated | plain | 3/0 | 2 |  |
| serve | plain | 4/0 | 3 |  |
| served | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| serves | plain | 10/0 | 1 |  |
| session | plain | 2/4 | 3 |  |
| set | plain | 19/9 | 17 |  |
| sets | plain | 3/0 | 3 |  |
| settings | plain | 4/1 | 2 |  |
| settlement | plain | 0/2 | 2 |  |
| settling | plain | 2/0 | 1 |  |
| seven | plain | 7/4 | 7 |  |
| seventy | plain | 4/2 | 3 |  |
| sever | plain | 2/0 | 2 |  |
| several | plain | 1/0 | 1 |  |
| severed | plain | 1/0 | 1 |  |
| sewer | plain | 2/1 | 3 |  |
| sewn | plain | 8/0 | 4 |  |
| sha | plain | 12/1 | 10 |  |
| shader | plain | 5/1 | 4 |  |
| shading | plain | 1/0 | 1 |  |
| shadow | plain | 77/23 | 18 |  |
| shadows | plain | 21/4 | 13 |  |
| shaft | plain | 30/2 | 9 |  |
| shafts | plain | 2/1 | 3 |  |
| shake | plain | 0/1 | 1 |  |
| shako | plain | 3/0 | 2 |  |
| shang | plain | 5/0 | 4 |  |
| shank | plain | 1/0 | 1 |  |
| shape | plain | 22/0 | 9 |  |
| shaped | plain | 3/0 | 2 |  |
| shaper | plain | 1/0 | 1 |  |
| shapes | plain | 1/0 | 1 |  |
| shard | plain | 40/22 | 6 |  |
| shards | plain | 128/65 | 8 |  |
| shared | plain | 23/7 | 21 | Ordinary English word used in its normal meaning. |
| shark | plain | 6/0 | 2 |  |
| shatter | plain | 5/8 | 4 |  |
| shattering | plain | 2/1 | 3 |  |
| she | plain | 1/0 | 1 |  |
| shear | plain | 2/1 | 3 |  |
| shechem | plain | 3/0 | 2 |  |
| shed | plain | 22/5 | 3 |  |
| sheen | plain | 2/1 | 3 |  |
| sheet | plain | 18/0 | 12 |  |
| sheets | plain | 2/1 | 3 |  |
| shell | plain | 25/5 | 12 |  |
| shells | plain | 11/3 | 7 |  |
| sheltered | plain | 1/1 | 2 |  |
| sherden | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| shield | poe | 68/12 | 21 |  |
| shields | poe | 13/0 | 8 |  |
| shift | plain | 9/4 | 6 |  |
| shifts | plain | 0/1 | 1 |  |
| shimmer | plain | 4/2 | 3 |  |
| shin | plain | 6/2 | 6 |  |
| shine | plain | 2/1 | 3 |  |
| shingled | plain | 2/0 | 1 |  |
| ship | plain | 2/0 | 2 |  |
| shiv | plain | 3/0 | 3 |  |
| shock | poe | 44/29 | 12 |  |
| shocked | poe | 4/3 | 4 |  |
| shocks | plain | 6/3 | 3 |  |
| shockwave | plain | 0/3 | 1 | Plain VFX layer name (aura-lab.json). |
| shod | plain | 1/0 | 1 |  |
| shoes | plain | 22/0 | 4 |  |
| shoot | plain | 1/0 | 1 |  |
| shooter | plain | 5/0 | 4 |  |
| shop | plain | 5/0 | 3 |  |
| shore | plain | 2/1 | 3 |  |
| short | plain | 15/5 | 11 |  |
| shortblade | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| shortlist | plain | 3/0 | 1 | plain English |
| shortsword | owner | 3/1 | 3 | Owner: "flint shortsword should be in the sword ladder". |
| shot | plain | 1/0 | 1 |  |
| shoulder | plain | 8/0 | 6 |  |
| shouldered | plain | 2/0 | 2 |  |
| shout | plain | 1/1 | 2 |  |
| shouts | plain | 1/1 | 2 |  |
| show | plain | 16/0 | 10 |  |
| shown | plain | 2/0 | 2 |  |
| shrapnel | plain | 5/2 | 3 |  |
| shrine | plain | 2/5 | 5 |  |
| shroud | plain | 4/2 | 3 |  |
| shut | plain | 2/0 | 1 |  |
| siberian | plain | 3/0 | 2 |  |
| sica | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| sickle | plain | 1/0 | 1 |  |
| sickly | plain | 0/1 | 1 |  |
| side | plain | 16/4 | 14 |  |
| sidestep | plain | 2/0 | 1 | plain English (a sideways dodge) |
| sideways | plain | 2/1 | 3 |  |
| siege | plain | 0/1 | 1 |  |
| sigil | plain | 29/12 | 5 |  |
| sign | plain | 36/22 | 10 | plain English in its literal sense only (a sign; the node type is Exclusive Keystone); never a name, theme or tag of a m |
| signal | plain | 4/0 | 4 |  |
| signet | plain | 5/0 | 3 |  |
| signing | plain | 0/3 | 1 |  |
| signs | plain | 11/0 | 2 |  |
| sil | plain | 1/0 | 1 |  |
| silent | plain | 2/1 | 3 |  |
| silhouette | plain | 11/0 | 2 |  |
| silk | plain | 6/3 | 3 |  |
| silkroad | real-world or technical (doc only) | 4/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| silver | plain | 8/4 | 3 |  |
| silvered | plain | 2/1 | 3 |  |
| simple | plain | 7/0 | 7 |  |
| simplicity | plain | 1/0 | 1 |  |
| simplify | plain | 1/0 | 1 |  |
| simulate | plain | 2/0 | 2 |  |
| simulation | plain | 1/0 | 1 |  |
| since | plain | 1/0 | 1 |  |
| sinew | plain | 6/0 | 4 |  |
| singe | plain | 2/1 | 3 |  |
| single | plain | 30/0 | 11 |  |
| singularity | plain | 5/1 | 3 |  |
| sinking | plain | 4/1 | 3 |  |
| sistrum | plain | 4/0 | 3 |  |
| six | plain | 14/1 | 10 |  |
| sixteen | plain | 0/1 | 1 |  |
| sixth | plain | 2/0 | 2 |  |
| size | plain | 5/1 | 6 |  |
| sizes | plain | 2/0 | 2 |  |
| sizzle | plain | 1/0 | 1 |  |
| skeletal | plain | 14/7 | 3 |  |
| skeleton | plain | 4/1 | 3 |  |
| skewers | plain | 2/1 | 3 |  |
| skid | plain | 1/0 | 1 |  |
| skill | poe | 12/4 | 12 |  |
| skills | poe | 5/0 | 4 |  |
| skilltree | real-world or technical (doc only) | 4/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| skinned | plain | 2/1 | 3 |  |
| skip | plain | 7/0 | 7 |  |
| skirted | plain | 2/0 | 2 |  |
| skull | plain | 5/0 | 2 |  |
| skullcap | plain | 3/0 | 2 |  |
| sky | plain | 2/2 | 3 |  |
| slabs | plain | 6/3 | 3 |  |
| slag | plain | 10/4 | 3 |  |
| slam | plain | 19/13 | 8 |  |
| slams | plain | 2/1 | 3 |  |
| slap | plain | 1/0 | 1 |  |
| slat | plain | 6/0 | 2 |  |
| slate | plain | 2/2 | 4 |  |
| sleet | plain | 2/1 | 3 |  |
| sleeved | plain | 2/0 | 1 |  |
| sleeveless | plain | 3/0 | 2 |  |
| slerp | technical | 9/0 | 5 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| sliders | plain | 1/0 | 1 |  |
| slim | plain | 3/0 | 2 |  |
| slime | plain | 2/0 | 2 |  |
| sling | plain | 8/0 | 5 |  |
| slits | plain | 1/0 | 1 |  |
| slosh | plain | 4/2 | 3 |  |
| slot | plain | 24/17 | 19 |  |
| slots | plain | 5/1 | 6 |  |
| slow | plain | 11/5 | 8 |  |
| slowing | plain | 2/1 | 3 |  |
| slows | plain | 2/1 | 3 |  |
| sludge | plain | 0/1 | 1 |  |
| small | plain | 33/7 | 22 |  |
| smaller | plain | 2/0 | 2 |  |
| smallest | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| smalls | plain | 1/0 | 1 |  |
| smart | plain | 1/0 | 1 |  |
| smears | plain | 2/1 | 3 |  |
| smoke | plain | 88/35 | 5 |  |
| smooth | plain | 2/0 | 2 |  |
| smoulder | plain | 4/2 | 3 | plain English |
| smyrna | plain | 2/0 | 2 |  |
| sn | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| snap | plain | 8/1 | 2 |  |
| snapshot | plain | 6/0 | 4 |  |
| snapshots | plain | 2/0 | 2 |  |
| snareline | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| snes | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| snow | plain | 4/5 | 7 |  |
| snowfall | plain | 0/1 | 1 |  |
| snowfield | plain | 0/2 | 2 | Real terrain. |
| snowmelt | plain | 0/1 | 1 | Real terrain ("Snowmelt passages"). |
| snowshill | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| snuffed | plain | 3/1 | 3 |  |
| soaked | plain | 2/1 | 3 |  |
| sobel | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| society | plain | 1/0 | 1 |  |
| socket | poe | 57/26 | 18 |  |
| socketed | plain | 11/1 | 5 |  |
| sockets | poe | 1/0 | 1 |  |
| soft | plain | 8/2 | 6 |  |
| software | plain | 1/1 | 2 |  |
| soil | plain | 2/1 | 3 |  |
| sokoban | real-world | 8/0 | 4 | Real puzzle genre; tool title "Sokoban". |
| solar | plain | 4/0 | 4 |  |
| sold | plain | 4/0 | 2 |  |
| soldier | plain | 3/0 | 3 |  |
| soles | plain | 3/0 | 2 |  |
| solid | plain | 2/11 | 13 |  |
| solo | plain | 3/0 | 1 |  |
| solution | plain | 4/0 | 3 |  |
| solve | plain | 1/0 | 1 |  |
| solved | plain | 2/0 | 1 | Ordinary English word used in its normal meaning. |
| solver | plain | 3/0 | 2 |  |
| some | plain | 2/0 | 2 |  |
| something | plain | 0/1 | 1 |  |
| song | plain | 3/1 | 3 |  |
| soot | plain | 14/6 | 6 |  |
| sooty | plain | 2/1 | 3 |  |
| sorcery | plain | 1/0 | 1 |  |
| sort | plain | 2/0 | 2 |  |
| sorted | plain | 1/0 | 1 |  |
| soul | poe | 3/1 | 3 |  |
| sound | plain | 1/1 | 2 |  |
| sounding | plain | 1/1 | 2 |  |
| source | owner | 38/84 | 81 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| sourced | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| sources | plain | 6/18 | 22 |  |
| south | plain | 8/0 | 5 |  |
| sp | real-world or technical (doc only) | 20/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| spa | plain | 2/0 | 2 |  |
| space | plain | 18/4 | 12 |  |
| spaces | plain | 2/0 | 1 |  |
| spacing | plain | 1/0 | 1 |  |
| spain | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| spangenhelm | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| spare | plain | 2/1 | 3 |  |
| spark | plain | 9/9 | 8 |  |
| sparkle | plain | 4/2 | 3 |  |
| sparkles | plain | 4/1 | 3 |  |
| sparks | plain | 22/11 | 5 |  |
| spatial | plain | 1/0 | 1 |  |
| spatter | plain | 4/1 | 3 |  |
| spawn | plain | 6/3 | 3 |  |
| spear | poe | 51/13 | 18 |  |
| spearhead | plain | 3/0 | 2 |  |
| spears | poe | 8/0 | 5 |  |
| special | plain | 1/0 | 1 |  |
| specialised | plain | 3/0 | 2 | Ordinary English word used in its normal meaning. |
| specialized | plain | 1/0 | 1 |  |
| specialty | plain | 1/0 | 1 |  |
| specify | plain | 0/1 | 1 |  |
| speed | poe | 170/91 | 28 |  |
| spell | poe | 104/71 | 29 |  |
| spellcraft | plain | 1/0 | 1 |  |
| spellcrafter | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| spells | poe | 29/30 | 16 |  |
| spend | plain | 1/1 | 2 |  |
| sphere | plain | 9/2 | 9 |  |
| spider | plain | 4/4 | 8 |  |
| spiderlings | plain | 2/1 | 3 |  |
| spiderweb | plain | 1/0 | 1 |  |
| spike | plain | 8/4 | 3 |  |
| spiked | plain | 6/1 | 5 |  |
| spikes | plain | 8/4 | 3 |  |
| spill | plain | 1/0 | 1 |  |
| spilt | plain | 2/1 | 3 |  |
| spin | plain | 11/4 | 4 |  |
| spindle | plain | 2/0 | 2 |  |
| spine | plain | 10/0 | 5 |  |
| spined | plain | 2/0 | 2 |  |
| spines | plain | 10/5 | 3 |  |
| spinning | plain | 5/1 | 4 |  |
| spiral | plain | 15/4 | 6 |  |
| spiralling | plain | 3/1 | 4 | plain English |
| spirals | plain | 1/0 | 1 |  |
| spirits | plain | 1/0 | 1 |  |
| spiritwork | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| spit | plain | 0/5 | 4 |  |
| spits | plain | 1/0 | 1 |  |
| splash | plain | 8/5 | 5 |  |
| splashed | plain | 0/1 | 1 |  |
| splat | plain | 2/1 | 3 |  |
| splatter | plain | 2/4 | 4 |  |
| spline | plain | 6/3 | 3 |  |
| splint | plain | 12/0 | 3 |  |
| splinters | plain | 1/0 | 1 |  |
| splints | plain | 2/0 | 2 |  |
| split | plain | 4/1 | 3 |  |
| splits | plain | 2/1 | 3 |  |
| spoil | plain | 17/1 | 7 |  |
| spoils | plain | 27/23 | 10 |  |
| spoke | plain | 2/0 | 1 |  |
| spoken | plain | 2/1 | 3 |  |
| spore | plain | 1/0 | 1 |  |
| spores | plain | 2/2 | 2 |  |
| spout | plain | 4/0 | 4 |  |
| spray | plain | 11/5 | 4 |  |
| spreading | plain | 4/2 | 3 |  |
| sprint | poe | 3/0 | 3 |  |
| sprinting | plain | 2/1 | 3 |  |
| sprite | plain | 2/0 | 1 |  |
| spurs | plain | 4/2 | 3 |  |
| spurt | plain | 0/1 | 1 |  |
| sputter | plain | 1/0 | 1 |  |
| squall | plain | 1/0 | 1 |  |
| square | plain | 5/1 | 5 |  |
| squirrel | plain | 0/1 | 1 |  |
| squished | plain | 1/0 | 1 |  |
| squishes | plain | 1/0 | 1 |  |
| stack | plain | 6/6 | 7 |  |
| stacked | plain | 0/1 | 1 |  |
| stacking | plain | 2/2 | 2 |  |
| stacks | plain | 5/3 | 8 |  |
| staff | poe | 19/2 | 10 |  |
| stag | plain | 0/1 | 1 |  |
| stage | plain | 7/0 | 4 |  |
| staged | plain | 0/5 | 5 |  |
| stages | plain | 1/0 | 1 |  |
| stain | plain | 2/1 | 3 |  |
| stall | plain | 2/1 | 3 |  |
| stamp | plain | 2/1 | 3 |  |
| stance | plain | 2/2 | 4 |  |
| stand | plain | 2/1 | 2 |  |
| standalone | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| standard | plain | 22/3 | 14 |  |
| standardization | plain | 1/0 | 1 |  |
| standing | plain | 5/1 | 5 |  |
| star | plain | 25/4 | 12 |  |
| starfield | plain | 2/1 | 3 | plain English |
| starlight | plain | 2/1 | 3 |  |
| starlit | plain | 2/1 | 3 |  |
| stars | plain | 2/1 | 3 |  |
| start | plain | 7/0 | 7 |  |
| starter | plain | 2/0 | 2 |  |
| starting | plain | 7/5 | 10 |  |
| startup | plain | 0/2 | 2 | Ordinary English word used in its normal meaning. |
| stash | owner | 2/3 | 3 | Owner: "the stash guy"; PoE. |
| stat | plain | 5/1 | 4 | Ordinary English word used in its normal meaning. |
| state | plain | 10/0 | 9 |  |
| stateful | plain | 1/0 | 1 |  |
| static | plain | 8/3 | 6 |  |
| stationary | plain | 2/0 | 2 |  |
| statistics | plain | 0/1 | 1 |  |
| stats | plain | 2/0 | 2 | Ordinary English word used in its normal meaning. |
| statue | plain | 3/2 | 5 |  |
| status | plain | 14/14 | 14 |  |
| steady | plain | 4/3 | 4 |  |
| steam | plain | 13/5 | 4 |  |
| steel | plain | 8/5 | 4 |  |
| steeled | plain | 0/1 | 1 |  |
| stele | plain | 6/0 | 2 |  |
| step | plain | 3/10 | 4 |  |
| steppe | plain | 117/2 | 11 |  |
| stepped | plain | 10/0 | 3 |  |
| steps | plain | 3/1 | 4 |  |
| stick | plain | 3/1 | 3 |  |
| sticks | plain | 1/0 | 1 |  |
| still | plain | 8/4 | 6 |  |
| stilled | plain | 1/0 | 1 |  |
| stitched | plain | 17/0 | 2 |  |
| stitching | plain | 2/1 | 3 |  |
| stock | plain | 2/0 | 2 |  |
| stolen | plain | 2/1 | 3 |  |
| stomp | plain | 2/1 | 3 |  |
| stone | plain | 142/38 | 27 |  |
| stones | plain | 2/1 | 3 |  |
| stony | plain | 0/1 | 1 |  |
| stop | plain | 3/2 | 4 |  |
| stops | plain | 1/0 | 1 |  |
| storage | plain | 1/4 | 3 |  |
| store | plain | 1/1 | 2 |  |
| stored | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| storm | plain | 30/13 | 4 | plain English in its literal sense only (weather; never the Lightning damage type (rule 5)); never a name, theme or tag  |
| stowed | plain | 1/1 | 2 |  |
| str | owner | 369/64 | 37 | PoE attribute abbreviation; owner: "dex and str need their own ways". |
| strafe | plain | 2/0 | 2 |  |
| straight | plain | 2/3 | 4 |  |
| strain | plain | 1/0 | 1 |  |
| strand | plain | 5/2 | 4 |  |
| strap | plain | 9/0 | 2 |  |
| strapped | plain | 3/0 | 2 |  |
| straps | plain | 3/0 | 2 |  |
| stratum | plain | 1/0 | 1 |  |
| streaks | plain | 2/1 | 3 |  |
| streamers | plain | 1/0 | 1 |  |
| strength | poe | 72/35 | 21 |  |
| stretch | plain | 2/1 | 3 |  |
| strict | plain | 2/0 | 1 |  |
| strictly | plain | 1/0 | 1 |  |
| strike | poe | 34/20 | 18 |  |
| strikes | plain | 13/4 | 5 |  |
| string | plain | 1/0 | 1 |  |
| striped | plain | 12/0 | 3 |  |
| stripes | plain | 12/0 | 2 |  |
| strong | plain | 8/1 | 7 |  |
| structural | plain | 5/1 | 6 |  |
| structure | plain | 4/0 | 3 |  |
| struggle | plain | 1/0 | 1 |  |
| studded | plain | 17/0 | 6 | Ordinary English word used in its normal meaning. |
| studios | plain | 1/0 | 1 |  |
| studs | plain | 2/1 | 3 |  |
| study | plain | 1/0 | 1 |  |
| stuffed | plain | 2/0 | 2 |  |
| stun | poe | 20/2 | 6 |  |
| stunned | poe | 1/2 | 3 |  |
| stuns | poe | 2/1 | 3 |  |
| stunted | plain | 2/1 | 3 |  |
| stupa | plain | 3/0 | 3 |  |
| style | plain | 8/0 | 4 |  |
| styles | plain | 1/0 | 1 |  |
| styling | plain | 1/0 | 1 |  |
| stylisation | plain | 2/1 | 3 | plain English |
| subeixi | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| subsequent | plain | 1/0 | 1 |  |
| substantial | plain | 4/0 | 4 |  |
| subsurface | plain | 2/1 | 3 |  |
| subtle | plain | 2/1 | 3 |  |
| subtree | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| subtrees | plain | 2/0 | 2 | Ordinary English word used in its normal meaning. |
| successive | plain | 1/0 | 1 |  |
| successor | plain | 1/0 | 1 |  |
| suction | plain | 1/0 | 1 |  |
| suede | plain | 6/0 | 2 |  |
| suffixes | plain | 6/0 | 1 |  |
| suggest | plain | 1/0 | 1 |  |
| suitable | plain | 1/0 | 1 |  |
| sulphur | plain | 2/1 | 3 |  |
| summit | plain | 6/3 | 7 |  |
| summon | plain | 18/6 | 4 |  |
| summoned | plain | 0/1 | 1 |  |
| summoning | plain | 4/5 | 7 |  |
| summonings | plain | 11/5 | 3 | plural of summoning (spellforge category key) |
| summons | plain | 32/15 | 3 |  |
| sun | plain | 5/2 | 3 |  |
| sundial | plain | 1/0 | 1 |  |
| sunken | plain | 1/1 | 2 |  |
| sunlight | plain | 4/2 | 3 |  |
| sunlit | plain | 0/1 | 1 |  |
| supersedes | plain | 1/0 | 1 |  |
| supplies | plain | 6/2 | 6 |  |
| supply | plain | 33/7 | 26 |  |
| support | poe | 3/0 | 3 |  |
| supports | plain | 0/1 | 1 |  |
| suppress | plain | 2/0 | 2 |  |
| sure | plain | 2/2 | 4 |  |
| surface | plain | 0/1 | 1 |  |
| surge | plain | 2/0 | 2 |  |
| surrender | plain | 1/0 | 1 |  |
| surrounded | plain | 0/1 | 1 |  |
| surrounds | plain | 8/4 | 3 |  |
| suspended | plain | 1/1 | 2 |  |
| suspension | plain | 2/0 | 2 |  |
| sustained | plain | 3/1 | 4 |  |
| sustaining | owner | 4/10 | 6 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| sutton | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| svg | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| sw | technical | 3/0 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| swamp | plain | 4/2 | 6 |  |
| swap | plain | 4/3 | 6 |  |
| swapping | plain | 1/1 | 2 |  |
| swd | real-world or technical (doc only) | 16/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| sweep | plain | 0/2 | 2 |  |
| swell | plain | 2/2 | 4 |  |
| swept | plain | 7/2 | 3 |  |
| swipe | plain | 0/7 | 4 |  |
| swirl | plain | 3/1 | 3 |  |
| swirls | plain | 1/0 | 1 |  |
| switch | plain | 2/1 | 3 |  |
| switching | plain | 2/0 | 2 |  |
| sword | poe | 24/6 | 14 |  |
| swords | poe | 4/1 | 5 |  |
| symmetry | plain | 7/4 | 6 |  |
| symptom | plain | 1/0 | 1 |  |
| sync | plain | 0/1 | 1 |  |
| synthesis | plain | 3/0 | 1 |  |
| synthesised | plain | 4/0 | 1 |  |
| syrian | plain | 2/0 | 2 |  |
| system | plain | 5/0 | 4 |  |
| systems | plain | 30/0 | 17 |  |
| sz | technical | 2/0 | 1 | graphics or tooling term in a WIZARD lab page |
| tab | plain | 1/1 | 2 |  |
| tablet | plain | 3/0 | 3 |  |
| tachtit | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| tags | plain | 2/0 | 2 |  |
| tail | plain | 0/1 | 1 |  |
| take | plain | 4/1 | 5 |  |
| taken | plain | 1/0 | 1 |  |
| takes | plain | 5/2 | 4 |  |
| talisman | poe | 3/0 | 3 |  |
| tall | plain | 12/5 | 7 |  |
| talons | plain | 2/1 | 3 |  |
| tan | plain | 3/0 | 2 |  |
| tar | plain | 2/1 | 3 |  |
| targes | plain | 1/0 | 1 |  |
| target | plain | 20/15 | 16 |  |
| targets | plain | 3/1 | 4 |  |
| task | plain | 2/0 | 2 |  |
| tau | plain | 1/0 | 1 |  |
| tavern | plain | 0/1 | 1 |  |
| taxonomy | plain | 12/0 | 5 |  |
| teaches | plain | 2/1 | 3 |  |
| teal | plain | 15/7 | 4 |  |
| tear | plain | 9/4 | 3 |  |
| tears | plain | 2/1 | 3 |  |
| technical | plain | 4/0 | 4 |  |
| technique | plain | 0/1 | 1 |  |
| teeth | plain | 15/0 | 2 |  |
| teleport | plain | 2/6 | 6 | Plain spell name (SpellRules.cs Teleport). |
| teleports | plain | 4/2 | 3 | plain English |
| tell | plain | 66/32 | 3 |  |
| temper | plain | 2/1 | 3 |  |
| temperate | plain | 0/2 | 2 |  |
| tempest | plain | 6/3 | 3 |  |
| template | plain | 2/0 | 2 |  |
| templates | plain | 1/0 | 1 |  |
| temple | plain | 6/7 | 8 |  |
| tempo | plain | 1/0 | 1 |  |
| temporarily | plain | 2/1 | 3 |  |
| temporary | plain | 1/0 | 1 |  |
| ten | plain | 7/1 | 8 |  |
| tene | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| tension | plain | 1/0 | 1 |  |
| tentacle | plain | 4/2 | 3 |  |
| terminal | plain | 4/0 | 3 |  |
| terminals | plain | 3/0 | 2 |  |
| terrain | plain | 15/4 | 15 |  |
| tesseract | owner | 4/4 | 5 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| test | plain | 22/7 | 13 |  |
| testbed | plain | 1/0 | 1 | plain English |
| tests | plain | 3/0 | 3 |  |
| tether | plain | 7/3 | 4 |  |
| tethers | plain | 4/2 | 3 |  |
| text | plain | 2/1 | 3 |  |
| textarea | technical | 5/0 | 3 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| textile | plain | 3/0 | 2 |  |
| texture | plain | 4/0 | 4 |  |
| textured | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| textures | plain | 0/18 | 18 |  |
| thames | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| that | plain | 32/34 | 24 |  |
| the | plain | 1595/581 | 106 |  |
| their | plain | 13/5 | 11 |  |
| theme | plain | 27/0 | 12 |  |
| themes | plain | 21/0 | 9 |  |
| then | plain | 4/0 | 3 |  |
| there | plain | 4/0 | 4 |  |
| these | plain | 28/0 | 17 |  |
| they | plain | 51/14 | 19 |  |
| thick | plain | 1/0 | 1 |  |
| thigh | plain | 0/8 | 1 |  |
| thin | plain | 18/10 | 4 |  |
| think | plain | 2/0 | 2 |  |
| third | plain | 4/1 | 5 |  |
| thirteen | plain | 0/1 | 1 |  |
| thirty | plain | 2/1 | 3 |  |
| this | plain | 133/25 | 69 |  |
| thong | plain | 15/0 | 2 |  |
| thongs | plain | 6/0 | 2 |  |
| thorn | plain | 11/6 | 4 |  |
| thorns | poe | 5/6 | 5 |  |
| those | plain | 5/1 | 6 |  |
| thracian | plain | 4/0 | 3 |  |
| three | plain | 52/16 | 16 |  |
| threshold | plain | 1/0 | 1 |  |
| throat | plain | 0/1 | 1 |  |
| throne | plain | 1/0 | 1 |  |
| throttle | plain | 1/0 | 1 |  |
| through | plain | 1/0 | 1 |  |
| throwing | plain | 4/2 | 5 |  |
| thrown | plain | 22/2 | 10 |  |
| throws | plain | 7/6 | 9 |  |
| throwstick | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| thump | plain | 0/1 | 1 |  |
| thunder | plain | 11/2 | 7 |  |
| thunderbolts | plain | 7/1 | 3 |  |
| tibia | plain | 0/2 | 1 |  |
| ticks | plain | 2/1 | 3 |  |
| tide | plain | 0/1 | 1 |  |
| tie | plain | 9/0 | 2 |  |
| tier | poe | 39/6 | 11 |  |
| tiers | poe | 5/0 | 3 |  |
| ties | plain | 18/0 | 2 |  |
| tight | plain | 4/2 | 3 |  |
| tile | plain | 0/4 | 1 |  |
| tiled | plain | 1/0 | 1 |  |
| tilemap | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| tiles | plain | 8/0 | 6 |  |
| timber | plain | 0/2 | 2 |  |
| time | plain | 10/3 | 6 |  |
| timeless | plain | 4/0 | 1 |  |
| timeline | plain | 4/0 | 3 | Ordinary English word used in its normal meaning. |
| timing | plain | 5/2 | 3 |  |
| tin | plain | 6/1 | 4 |  |
| tiny | plain | 1/0 | 1 |  |
| tip | plain | 8/0 | 4 |  |
| tipped | plain | 0/1 | 1 |  |
| titan | plain | 3/0 | 3 |  |
| title | plain | 1/4 | 3 |  |
| titlebar | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| tlingit | plain | 2/0 | 2 |  |
| tnt | technical | 1/0 | 1 | pixel_sandbox material. |
| to | plain | 23/9 | 21 |  |
| todo | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| todos | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| toe | plain | 3/6 | 3 |  |
| toebase | technical | 0/4 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| toes | plain | 0/2 | 1 |  |
| toggle | plain | 24/0 | 6 |  |
| toggleable | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| token | plain | 4/0 | 2 |  |
| tollense | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| tomb | plain | 6/1 | 6 |  |
| tombstone | plain | 1/0 | 1 |  |
| tome | plain | 1/0 | 1 |  |
| tongs | plain | 2/0 | 2 |  |
| tongue | plain | 7/5 | 5 |  |
| tongues | plain | 2/1 | 3 |  |
| took | plain | 0/1 | 1 |  |
| tool | plain | 39/13 | 24 |  |
| tooled | plain | 3/0 | 2 |  |
| tooling | plain | 1/0 | 1 |  |
| toolkit | technical | 8/4 | 3 | graphics or tooling term in a WIZARD lab page |
| tools | plain | 4/2 | 3 |  |
| tooltip | plain | 0/6 | 2 | Ordinary English word used in its normal meaning. |
| tooltips | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| top | plain | 4/2 | 4 |  |
| topaz | plain | 2/1 | 3 |  |
| topology | plain | 3/0 | 3 |  |
| torc | plain | 5/0 | 4 |  |
| torch | plain | 6/2 | 3 |  |
| tormentor | plain | 1/0 | 1 |  |
| torn | plain | 7/3 | 3 |  |
| tornado | plain | 8/8 | 7 |  |
| torrent | plain | 3/1 | 3 |  |
| total | plain | 3/0 | 2 |  |
| totals | plain | 0/1 | 1 |  |
| totem | poe | 17/0 | 7 |  |
| touch | plain | 3/0 | 3 |  |
| tower | plain | 7/2 | 6 |  |
| towershield | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| town | poe | 1/2 | 2 |  |
| toxic | plain | 1/1 | 2 |  |
| tq | real-world or technical (doc only) | 4/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| track | plain | 9/1 | 8 |  |
| trade | plain | 3/0 | 2 |  |
| tradeoff | real-world or technical (doc only) | 3/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| tradeoffs | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| trail | plain | 7/4 | 4 |  |
| trailhead | plain | 1/1 | 2 | Real terrain word (rule 8: maps by real terrain). |
| trails | plain | 4/1 | 4 |  |
| training | plain | 1/0 | 1 |  |
| trajan | real-world or technical (doc only) | 3/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| transcribe | plain | 1/0 | 1 |  |
| transfer | plain | 1/0 | 1 |  |
| transform | plain | 8/3 | 5 |  |
| transformed | plain | 2/1 | 3 |  |
| transforms | plain | 10/5 | 3 |  |
| translation | plain | 1/0 | 1 |  |
| translocation | plain | 1/0 | 1 |  |
| translocations | plain | 9/4 | 3 |  |
| translucency | plain | 2/1 | 3 |  |
| translucent | plain | 2/2 | 4 |  |
| transmutations | plain | 9/4 | 3 |  |
| transparent | plain | 0/1 | 1 |  |
| trap | poe | 20/1 | 7 |  |
| traps | poe | 8/1 | 5 |  |
| travel | plain | 7/3 | 8 |  |
| traveling | plain | 2/0 | 1 |  |
| tray | plain | 1/0 | 1 |  |
| treasure | plain | 4/0 | 2 |  |
| treat | plain | 7/0 | 6 |  |
| treating | plain | 1/0 | 1 |  |
| tree | poe | 23/11 | 16 |  |
| treesmall | technical | 0/3 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| trembling | plain | 1/0 | 1 |  |
| trench | plain | 1/0 | 1 |  |
| triada | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| trickling | plain | 1/0 | 1 |  |
| trident | plain | 2/0 | 2 |  |
| trigger | plain | 8/2 | 5 |  |
| trim | plain | 12/0 | 2 |  |
| trimmed | plain | 8/0 | 1 | Ordinary English word used in its normal meaning. |
| trindhoej | real-world | 9/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| trine | plain | 2/1 | 3 |  |
| tripod | plain | 6/0 | 3 |  |
| trophies | plain | 18/3 | 16 |  |
| trophy | plain | 35/8 | 18 |  |
| true | plain | 5/4 | 4 |  |
| trumpet | plain | 2/0 | 2 |  |
| trundholm | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| trunk | plain | 1/2 | 2 |  |
| try | plain | 2/1 | 3 |  |
| tsv | real-world or technical (doc only) | 5/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| tsvs | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| tube | plain | 4/1 | 5 |  |
| tumble | plain | 2/1 | 3 |  |
| tumulus | plain | 12/0 | 2 |  |
| tundra | plain | 2/1 | 3 |  |
| tune | plain | 1/0 | 1 |  |
| tunic | plain | 18/0 | 2 |  |
| tuning | plain | 1/0 | 1 |  |
| turbulence | plain | 6/3 | 3 |  |
| turn | plain | 2/2 | 3 |  |
| turns | plain | 6/3 | 3 |  |
| turquoise | plain | 4/0 | 3 |  |
| turtleshell | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| tusk | plain | 11/0 | 6 |  |
| tusks | plain | 2/1 | 3 |  |
| tutankhamun | real-world | 51/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| tutorial | plain | 7/0 | 4 |  |
| twelve | plain | 4/2 | 3 |  |
| twenty | plain | 3/1 | 4 |  |
| twice | plain | 1/1 | 2 |  |
| twilight | plain | 3/1 | 4 |  |
| twill | plain | 1/0 | 1 |  |
| twin | plain | 3/1 | 3 |  |
| two | plain | 74/24 | 33 |  |
| type | plain | 13/1 | 12 |  |
| types | plain | 7/0 | 4 |  |
| typing | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ue | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| uhlig | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| ui | technical | 87/14 | 30 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| ultra | plain | 4/0 | 3 |  |
| umber | plain | 1/0 | 1 |  |
| umbra | plain | 2/1 | 3 |  |
| umd | real-world or technical (doc only) | 7/0 | 4 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| umg | technical | 16/8 | 3 | graphics or tooling term in a WIZARD lab page |
| unable | plain | 1/0 | 1 |  |
| unallocated | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| unarmed | plain | 0/2 | 1 |  |
| unassigned | plain | 0/1 | 1 |  |
| unauthored | plain | 1/1 | 2 | Ordinary English word used in its normal meaning. |
| unavailable | plain | 0/1 | 1 |  |
| unblockable | plain | 2/1 | 3 | "Unblockable Against Bleeding" describes the effect. |
| unchanged | plain | 1/8 | 7 |  |
| undead | plain | 5/3 | 4 |  |
| undecided | plain | 1/0 | 1 |  |
| under | plain | 2/1 | 3 |  |
| underground | plain | 1/0 | 1 |  |
| underrepresented | plain | 1/0 | 1 |  |
| underside | plain | 1/0 | 1 |  |
| undo | plain | 7/0 | 5 |  |
| undone | plain | 0/1 | 1 |  |
| undyed | plain | 6/0 | 3 |  |
| unending | plain | 2/1 | 3 |  |
| unequip | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| unetice | real-world | 15/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| unexpected | plain | 0/4 | 1 |  |
| unhafted | plain | 1/0 | 1 |  |
| uniform | plain | 3/0 | 3 |  |
| uninterrupted | plain | 1/1 | 2 |  |
| uninterruptible | plain | 1/1 | 2 |  |
| unique | poe | 0/9 | 5 |  |
| uniques | poe | 4/0 | 1 |  |
| unisex | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| unit | plain | 1/1 | 2 |  |
| unity | plain | 6/65 | 46 |  |
| universal | plain | 0/4 | 2 |  |
| unknown | plain | 14/21 | 24 |  |
| unknowns | plain | 1/0 | 1 |  |
| unleashes | plain | 2/1 | 3 |  |
| unlike | plain | 2/1 | 3 |  |
| unlimited | plain | 1/0 | 1 |  |
| unlock | plain | 8/6 | 4 |  |
| unlocked | plain | 4/0 | 4 |  |
| unlocks | plain | 34/20 | 4 |  |
| unmapped | plain | 0/3 | 2 |  |
| unmodified | plain | 0/6 | 6 |  |
| unnamed | plain | 2/0 | 2 |  |
| unnoticed | plain | 2/1 | 3 |  |
| unrated | plain | 1/0 | 1 |  |
| unravelling | plain | 1/0 | 1 |  |
| unreachable | plain | 4/3 | 3 |  |
| unreadable | plain | 0/1 | 1 |  |
| unreal | plain | 66/27 | 3 |  |
| unresolved | plain | 1/0 | 1 |  |
| unreviewed | plain | 1/0 | 1 |  |
| unsafe | plain | 1/1 | 2 |  |
| unstoppable | plain | 2/1 | 3 |  |
| unsupported | plain | 2/9 | 9 |  |
| until | plain | 2/0 | 2 |  |
| untraceable | plain | 1/0 | 1 |  |
| unusual | plain | 1/0 | 1 |  |
| up | plain | 0/5 | 3 |  |
| update | plain | 2/0 | 2 |  |
| updraft | plain | 1/0 | 1 |  |
| upgrade | plain | 3/1 | 4 |  |
| upgraded | plain | 3/0 | 2 | plain description |
| upgrades | plain | 3/1 | 4 |  |
| upheaval | plain | 2/1 | 3 |  |
| upleg | plain | 0/4 | 1 |  |
| upperarm | technical | 0/6 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| upton | real-world | 6/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| ur | plain | 23/0 | 4 |  |
| urartian | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| url | technical | 24/0 | 12 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| urls | real-world or technical (doc only) | 14/0 | 5 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| urp | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ursidae | plain | 0/16 | 1 |  |
| us | plain | 2/0 | 1 |  |
| usable | plain | 1/0 | 1 |  |
| usage | plain | 6/0 | 6 |  |
| use | plain | 105/12 | 40 |  |
| useful | plain | 5/0 | 2 |  |
| username | plain | 0/1 | 1 | Ordinary English word used in its normal meaning. |
| users | plain | 200/0 | 14 |  |
| uses | plain | 0/1 | 1 |  |
| using | plain | 2/2 | 2 |  |
| utilities | plain | 1/0 | 1 |  |
| uuid | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| uv | technical | 4/20 | 13 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| uvs | technical | 6/4 | 4 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| vaal | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| vaccine | plain | 1/0 | 1 |  |
| vae | technical | 0/1 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| vague | plain | 2/0 | 2 |  |
| valid | plain | 5/0 | 3 |  |
| validate | plain | 1/0 | 1 |  |
| validating | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| validation | plain | 8/0 | 4 |  |
| valour | plain | 3/0 | 2 | Ordinary English word used in its normal meaning. |
| value | plain | 1/0 | 1 |  |
| values | plain | 3/1 | 4 |  |
| vambraces | plain | 2/0 | 2 |  |
| vanish | plain | 1/1 | 2 |  |
| vapour | plain | 19/8 | 3 | plain English |
| vapours | plain | 2/1 | 3 | plain English |
| variable | plain | 1/0 | 1 |  |
| variables | plain | 1/0 | 1 |  |
| variant | plain | 4/0 | 1 |  |
| variants | plain | 5/1 | 5 |  |
| vase | plain | 3/0 | 2 |  |
| vat | plain | 0/8 | 8 |  |
| vault | plain | 2/0 | 2 |  |
| vdb | technical | 4/2 | 3 | graphics or tooling term in a WIZARD lab page |
| vector | plain | 2/0 | 2 |  |
| veil | plain | 9/0 | 2 |  |
| vein | plain | 5/2 | 3 |  |
| veins | plain | 2/1 | 3 |  |
| veks | real-world | 12/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| veldmeijer | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| vendor | poe | 6/0 | 3 |  |
| venom | plain | 5/2 | 4 |  |
| venomous | plain | 1/0 | 1 |  |
| vent | plain | 1/0 | 1 |  |
| vented | plain | 1/0 | 1 |  |
| venturing | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| verb | plain | 1/0 | 1 |  |
| verbs | plain | 1/0 | 1 |  |
| verdant | plain | 1/0 | 1 |  |
| verdict | plain | 1/0 | 1 |  |
| verdicts | plain | 1/0 | 1 |  |
| verdigris | owner | 85/0 | 37 | Rule 47: the game name is dropped from player-facing text; lowercase "verdigris" (bronze patina) and internal ids (Verdi |
| verification | plain | 3/4 | 5 |  |
| verified | plain | 3/0 | 3 | Ordinary English word used in its normal meaning. |
| verify | plain | 7/0 | 6 |  |
| vermand | real-world or technical (doc only) | 6/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| versatile | plain | 3/0 | 2 |  |
| version | plain | 8/2 | 5 |  |
| vertex | plain | 4/3 | 5 |  |
| vertexid | technical | 2/0 | 1 | graphics or tooling term in a WIZARD lab page |
| vertical | plain | 1/0 | 1 |  |
| very | plain | 5/0 | 3 |  |
| vesica | real-world | 2/1 | 3 | Real geometry (vesica piscis): passive-tree pattern "Vesica Lenses" (patterns.js). |
| vessel | owner | 76/4 | 28 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. VesselForge's item-capacity "vessel" is a different, |
| vessels | plain | 24/1 | 17 |  |
| vest | plain | 38/1 | 7 |  |
| vexillum | plain | 2/0 | 2 |  |
| vfx | technical | 8/2 | 6 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| vi | technical | 1/0 | 1 | Roman numeral. The sokoban archive notes it numbers are flavour; see entry "sokoban archive notes". |
| victim | plain | 7/3 | 3 |  |
| victims | plain | 2/1 | 3 |  |
| video | plain | 1/0 | 1 |  |
| view | plain | 8/0 | 6 |  |
| viewport | plain | 1/0 | 1 | Ordinary English word used in its normal meaning. |
| vii | technical | 1/0 | 1 | Roman numeral; see "sokoban archive notes". |
| viii | technical | 1/0 | 1 | Roman numeral; see "sokoban archive notes". |
| viking | plain | 6/0 | 2 |  |
| vikso | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| vindolanda | real-world or technical (doc only) | 15/0 | 3 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| vine | plain | 0/2 | 1 |  |
| vines | plain | 9/9 | 7 |  |
| violence | plain | 2/1 | 3 |  |
| violet | plain | 77/40 | 4 |  |
| viper | plain | 0/1 | 1 |  |
| virus | plain | 1/0 | 1 |  |
| visibility | plain | 2/0 | 2 |  |
| visible | plain | 2/0 | 2 |  |
| vision | plain | 1/0 | 1 |  |
| visit | plain | 0/1 | 1 |  |
| visor | plain | 1/0 | 1 |  |
| vistulashort | technical | 0/5 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| visual | plain | 16/0 | 9 |  |
| visually | plain | 2/0 | 1 |  |
| visuals | plain | 1/0 | 1 |  |
| vitality | plain | 1/0 | 1 |  |
| vitals | plain | 0/1 | 1 |  |
| vite | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| void | plain | 31/9 | 16 |  |
| volcanic | plain | 7/4 | 8 |  |
| volley | plain | 5/13 | 9 |  |
| volume | plain | 5/2 | 7 |  |
| volumetric | plain | 6/3 | 3 |  |
| vorbis | technical | 0/29 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| voronoi | technical | 2/1 | 3 | graphics or tooling term in a WIZARD lab page |
| vortex | plain | 10/9 | 7 |  |
| vortices | plain | 4/2 | 3 |  |
| votive | plain | 16/6 | 13 |  |
| vs | plain | 4/1 | 3 |  |
| vue | technical | 6/0 | 2 | wordcloud demo data. |
| vultures | plain | 6/0 | 2 |  |
| wailing | plain | 1/0 | 1 |  |
| waist | plain | 14/0 | 8 |  |
| waistband | plain | 2/0 | 2 |  |
| waisted | plain | 2/0 | 2 |  |
| wait | plain | 1/0 | 1 |  |
| waiver | plain | 0/1 | 1 |  |
| wake | plain | 5/1 | 3 |  |
| wales | plain | 2/0 | 1 |  |
| walk | plain | 0/7 | 7 |  |
| walkable | plain | 1/0 | 1 |  |
| walking | plain | 2/2 | 4 |  |
| wall | plain | 26/38 | 12 |  |
| walls | plain | 3/2 | 5 |  |
| walternienburg | real-world | 3/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| wand | poe | 20/7 | 8 |  |
| wands | poe | 1/0 | 1 |  |
| war | plain | 99/18 | 35 |  |
| warbanner | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| warclub | plain | 0/1 | 1 | Real weapon name (war club). |
| warcrown | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| warcry | poe | 1/0 | 1 |  |
| ward | owner | 206/106 | 47 | Owner: "characters should start with one ward". |
| warden | plain | 1/1 | 2 |  |
| wards | plain | 2/0 | 1 |  |
| ware | plain | 9/0 | 2 |  |
| warlord | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| warm | plain | 2/0 | 2 |  |
| warp | plain | 7/3 | 3 |  |
| warping | plain | 1/0 | 1 |  |
| warring | real-world or technical (doc only) | 1/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| warrior | plain | 6/1 | 5 |  |
| wasd | technical | 5/1 | 5 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| watch | plain | 4/0 | 3 |  |
| water | owner | 26/26 | 18 | Arcane Lattice canon (owner spell-lattice system), kept per ruling. |
| waterfall | plain | 1/0 | 1 |  |
| wave | plain | 13/5 | 13 |  |
| waves | plain | 12/6 | 10 |  |
| waypoint | poe | 0/4 | 3 | PoE term in same meaning; owner: "Also need overmap/act map and waypoints". |
| wc | real-world or technical (doc only) | 26/0 | 6 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| we | plain | 4/0 | 4 |  |
| weak | plain | 4/1 | 4 |  |
| weaken | plain | 0/1 | 1 |  |
| weakened | plain | 0/4 | 3 |  |
| weapon | poe | 30/7 | 15 |  |
| weapons | poe | 5/0 | 5 |  |
| wearable | plain | 2/0 | 2 |  |
| wearables | plain | 1/0 | 1 |  |
| weathered | plain | 1/1 | 2 |  |
| weave | owner | 3/4 | 3 | Owner: "weave power into their active skills". |
| weaver | plain | 1/0 | 1 | Real occupation word in rp_account_creator background list. |
| weaving | plain | 10/2 | 3 |  |
| web | plain | 2/0 | 2 |  |
| webgl | technical | 2/0 | 2 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| wedge | plain | 1/0 | 1 |  |
| wedges | plain | 6/0 | 1 |  |
| weight | plain | 1/0 | 1 |  |
| weighted | plain | 4/0 | 3 |  |
| weighty | plain | 0/1 | 1 |  |
| welcome | plain | 0/1 | 1 |  |
| wessex | real-world | 12/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| west | plain | 6/0 | 3 |  |
| western | plain | 1/0 | 1 |  |
| wet | plain | 14/8 | 4 |  |
| wetland | plain | 1/2 | 3 | Real terrain. |
| wetness | plain | 2/1 | 3 |  |
| wg | real-world or technical (doc only) | 6/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| what | plain | 20/1 | 13 |  |
| whatever | plain | 2/1 | 3 |  |
| wheel | plain | 2/0 | 2 |  |
| when | plain | 30/6 | 16 |  |
| where | plain | 6/0 | 5 |  |
| whetstone | plain | 2/0 | 2 |  |
| while | plain | 13/10 | 12 |  |
| whip | plain | 6/1 | 5 |  |
| whipstitch | plain | 3/0 | 2 |  |
| whirlwind | plain | 2/1 | 3 |  |
| white | plain | 20/9 | 4 |  |
| whiteout | plain | 2/1 | 3 | plain English |
| who | plain | 6/0 | 1 |  |
| whorl | plain | 2/0 | 1 |  |
| why | plain | 4/0 | 4 |  |
| wick | plain | 1/0 | 1 |  |
| wicker | plain | 1/0 | 1 |  |
| wide | plain | 29/9 | 8 |  |
| width | plain | 7/3 | 4 |  |
| wien | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| wil | technical | 1/0 | 1 | abbreviation in a demo stat line |
| wild | plain | 0/1 | 1 |  |
| wildness | plain | 2/1 | 3 |  |
| wilds | plain | 2/1 | 3 |  |
| willpower | plain | 3/0 | 1 | plain English |
| wiltshire | plain | 3/0 | 2 |  |
| win | plain | 0/1 | 1 |  |
| wind | plain | 33/20 | 5 |  |
| window | plain | 7/11 | 9 |  |
| windup | plain | 3/1 | 2 |  |
| windy | plain | 0/1 | 1 |  |
| wing | plain | 4/3 | 4 |  |
| wingbeat | plain | 2/1 | 3 |  |
| winged | plain | 3/0 | 1 |  |
| wingless | plain | 2/1 | 3 |  |
| wings | plain | 10/5 | 3 |  |
| wingspan | plain | 2/1 | 3 | plain English |
| wingtip | plain | 1/0 | 1 | plain English |
| wire | plain | 5/0 | 4 |  |
| wireframe | plain | 6/0 | 4 | Ordinary English word used in its normal meaning. |
| wis | plain | 1/0 | 1 |  |
| wisdom | plain | 3/0 | 1 |  |
| wisp | plain | 9/3 | 4 |  |
| wisps | plain | 0/1 | 1 |  |
| with | plain | 108/0 | 1 |  |
| witham | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| wither | poe | 11/8 | 6 |  |
| withered | poe | 6/8 | 6 |  |
| withering | plain | 2/2 | 4 |  |
| withy | plain | 3/0 | 2 |  |
| wizard | owner | 172/80 | 66 | owner: project name WIZARD (identity copy, AGENTS rule 7) |
| woad | plain | 2/0 | 2 |  |
| wolf | plain | 8/3 | 8 |  |
| wood | plain | 56/7 | 10 |  |
| wooded | plain | 0/1 | 1 |  |
| wooden | plain | 66/2 | 9 |  |
| woodland | plain | 87/1 | 4 |  |
| woods | plain | 1/0 | 1 |  |
| wool | plain | 51/0 | 7 |  |
| word | plain | 5/0 | 5 |  |
| words | plain | 5/0 | 2 |  |
| work | plain | 2/1 | 3 |  |
| workbench | plain | 4/0 | 4 |  |
| workflow | real-world or technical (doc only) | 2/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| working | plain | 4/0 | 4 |  |
| works | plain | 2/0 | 2 |  |
| workspace | real-world or technical (doc only) | 2/0 | 1 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| world | plain | 29/4 | 16 |  |
| worley | technical | 4/2 | 3 | graphics or tooling term in a WIZARD lab page |
| worn | plain | 1/2 | 3 |  |
| wortmann | real-world | 0/1 | 1 | Audio credit (Paul Wortmann). |
| wound | plain | 3/0 | 2 |  |
| wounds | plain | 1/0 | 1 |  |
| woven | plain | 56/1 | 12 |  |
| wp | technical | 1/1 | 2 | graphics or tooling term in a WIZARD lab page |
| wpo | technical | 4/2 | 3 | graphics or tooling term in a WIZARD lab page |
| wrap | plain | 28/0 | 9 |  |
| wrapped | plain | 17/0 | 5 |  |
| wrapping | plain | 1/0 | 1 |  |
| wraps | plain | 20/0 | 6 |  |
| wrath | poe | 0/4 | 2 |  |
| wreath | plain | 1/0 | 1 |  |
| wrinkled | plain | 3/0 | 2 |  |
| wrist | plain | 9/0 | 2 |  |
| write | plain | 2/0 | 2 |  |
| writing | plain | 1/0 | 1 |  |
| written | plain | 1/1 | 2 |  |
| wrote | plain | 2/0 | 2 |  |
| xl | technical | 0/5 | 1 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| xp | owner | 9/3 | 6 | Owner: "item-local xp". |
| xz | technical | 0/7 | 5 | Code identifier, file format, hex colour, acronym, bone or asset name; not game vocabulary. |
| yank | plain | 3/1 | 3 |  |
| yellow | plain | 24/11 | 5 |  |
| yetholm | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| yew | plain | 5/0 | 2 |  |
| yoke | plain | 9/0 | 4 |  |
| you | plain | 59/36 | 16 |  |
| your | plain | 125/72 | 21 |  |
| zard | technical | 1/0 | 1 | Broken split of the WIZARD wordmark in cartographer/index.html. |
| zeal | plain | 0/1 | 1 |  |
| zealand | real-world | 9/0 | 2 | Real archaeological site, find, period, place, museum or scholar cited in item research (item-types-by-skill-zone.json / |
| zero | plain | 5/1 | 6 |  |
| zhou | real-world or technical (doc only) | 4/0 | 2 | doc-only proper noun or code identifier; docs are not player-facing (retired-name pass still applies) |
| ziggurat | plain | 3/1 | 3 |  |
| zombie | plain | 1/1 | 2 |  |
| zone | plain | 25/5 | 12 |  |
| zones | plain | 5/0 | 4 |  |
| zoom | plain | 6/0 | 3 |  |
