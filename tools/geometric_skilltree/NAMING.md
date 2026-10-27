# Passive tree naming

Owner corrections: September 21, 2026 (combat channels are Fire, Cold, Lightning and Chaos;
never Ember, River, Storm or Gloam) and October 26, 2026 ("the ai cringe terms are sneaking
back into the project … stop inventing ai-trope lore"). Rules, mirrored in the root
`AGENTS.md`:

- Name mechanics plainly, as Path of Exile does: Physical, Fire, Cold, Lightning, Chaos;
  Bleed, Poison, Ignite, Chill, Freeze, Shock, Wither.
- Small passives are named by their stat. Notables, keystones, masteries, Signs, Waystones,
  gates and sockets are named by what they do. Jewels are named by their effect.
- No invented cultures, sagas, oaths, years, flavour sentences or synonyms for existing
  things (no "carved stone" for jewel, "calling" for class, "Advantage" for critical damage).
- Old identifiers (`ember_res`, `river_resistance`, `saga`, `whorl`, cluster ids such as
  `kiln-line`) stay only as hidden compatibility keys.
- `tests/invented-terms.test.mjs` (run by `scripts/wizard-lab.mjs verify`) fails on banned
  terms in tree, jewel, stat and page text. Extend its list when a new invented term is
  caught; never allowlist prose.

Renamed in that pass, compared with the tree on gh-pages before October 26 (324
seats; ids, stats and mechanics unchanged; 49 of these also went through an earlier era
rename the same day, which this table supersedes):

| Seat | Type | Old name | New name |
|---|---|---|---|
| -3,6 | keystone | Oath of Ash | All Damage as Fire |
| 6,-3 | keystone | Cold Arithmetic | Chill Over Criticals |
| -3,-3 | keystone | The Long Arc | Damage at Range |
| -6,3 | keystone | No Flourish | Hits Cannot Be Evaded |
| 3,3 | keystone | The Tithe | Rites Cost Life |
| 3,-6 | keystone | Quiet Work | Strike the Unhurt |
| -6,6 | notable | Oath of the Front Line | Ally Protection |
| 0,6 | notable | Battle Liturgy | Banner Attack Speed |
| -10,3 | notable | The Red Standard | Banner Bleed |
| 10,-6 | notable | Court of Reeds | Blinding Marks |
| -4,10 | notable | Ash Garden | Burning Ground Immunity |
| -2,-6 | notable | Thunder Counting | Chaining Shock |
| 4,-10 | notable | Nightsoil Trade | Chaos Poison |
| 2,-1 | notable | Cold Reading | Chilled Targets |
| 10,-3 | notable | The Sunken Bell | Chilling Rite |
| -9,2 | notable | Wading In | Damage per Nearby Enemy |
| 4,-2 | notable | Undertow | Deeper Chill |
| 2,-4 | notable | Venom Ledger | Deeper Poison |
| 6,-6 | notable | Collector of Debts | Deeper Wither |
| -3,-7 | notable | The Watching Peak | Distant Marks |
| -3,-4 | notable | Ridge Runner | Downhill Pierce |
| 9,0 | notable | Deep Shelf | Efficient Rites |
| 0,-8 | notable | Between Raindrops | Evasion Haste |
| 2,7 | notable | Second Congregation | Extra Companion |
| 9,-2 | notable | Patient Current | Faster Freeze |
| -9,9 | notable | Last Out of the Breach | Faster Recovery |
| -1,2 | notable | Stoked Coals | Fire Ailments |
| 1,1 | notable | Called to Serve | Free Companion |
| -4,2 | notable | Shield Splitter | Guard Break |
| -2,4 | notable | Banked Fire | Guard from Ignites |
| -1,-1 | notable | Head for Heights | High Ground Shock |
| -7,9 | notable | White Heat | Ignite Attack Speed |
| -6,8 | notable | Patience of the Kiln | Ignite Exposure |
| 4,-7 | notable | Tools of the Trade | Instant Traps |
| -10,6 | notable | Field Surgeon Scorn | Lasting Bleeds |
| -4,7 | notable | Long Firing | Lasting Ignites |
| 7,-9 | notable | Widow Work | Lasting Wither |
| -7,3 | notable | Red Harvest | Life on Bleeding Kill |
| 0,9 | notable | The Long Procession | Lingering Rites |
| -2,-7 | notable | Eye of the Slinger | Long-Range Accuracy |
| -8,2 | notable | The Weight Behind It | Longer Stuns |
| 9,-9 | notable | The Long Memory | Mark Ally Killers |
| 7,-3 | notable | Drowned Archive | Persistent Marks |
| 6,-8 | notable | The Second Knife | Poison from Hiding |
| 8,-8 | notable | Ledger of Grudges | Poison Marked Enemies |
| 1,-2 | notable | Dirty Fighting | Poison Penetration |
| -2,-2 | notable | Storm Line | Projectile Damage |
| -6,-4 | notable | Gale Shelter | Projectile Deflection |
| 3,4 | notable | Processional Guard | Protected Companions |
| 0,-9 | notable | No Second Chance | Punish Misses |
| -9,0 | notable | Nothing Wasted | Recovered Throws |
| 6,0 | notable | Third Reading | Repeated Rites |
| -8,0 | notable | Storm of Handles | Returning Throws |
| 0,8 | notable | Keeper of the Column | Shared Resistances |
| 2,2 | notable | Warded Vestments | Shared Ward |
| 8,-2 | notable | Silt and Silver | Shattering Freeze |
| 6,4 | notable | Feast After Service | Spirit on Kill |
| -7,10 | notable | The Last Firing | Spreading Ignites |
| -8,8 | notable | The Standing Order | Steady Stance |
| 2,6 | notable | Vigil Unbroken | Steady Ward |
| 0,-6 | notable | Read the Wind | Sure First Hit |
| -6,0 | notable | Running Volley | Throwing While Moving |
| -2,1 | notable | Drawn Blood | Unblockable Against Bleeding |
| 7,-10 | notable | The Unlit Door | Unseen Passage |
| 3,7 | notable | The Empty Reliquary | Ward Counts as Rite |
| 8,0 | notable | Unwritten Chapter | Ward Retention |
| 3,-3 | mastery | Second Shadow | Ailment Mastery |
| -3,3 | mastery | Iron Doctrine | Attack Mastery |
| 0,3 | mastery | Order of Service | Companion Mastery |
| 0,-3 | mastery | Fieldcraft | Evasion Mastery |
| -3,0 | mastery | War Dance | Projectile Mastery |
| 3,0 | mastery | Blue Arithmetic | Ward Mastery |
| -4,-4 | sign | Sign of the Storm | Sign: Double Shock Stacks |
| 8,-4 | sign | Sign of the River | Sign: Mark Chilled Enemies |
| 4,-8 | sign | Sign of the Adder | Sign: Spreading Poison |
| -4,8 | sign | Sign of the Kiln | Sign: Unending Ignites |
| -8,4 | sign | Sign of the Bull | Sign: Unstoppable |
| 4,4 | sign | Sign of the Lantern | Sign: Ward Under Fire |
| 0,-5 | waystone | The Swift Milestone | Acrobat Waystone |
| 5,0 | waystone | The Blue Milestone | Archmage Waystone |
| -5,5 | waystone | The Iron Milestone | Champion Waystone |
| 5,-5 | waystone | The Unlit Milestone | Nightblade Waystone |
| -5,0 | waystone | The Thrown Milestone | Reaver Waystone |
| 0,5 | waystone | The Votive Milestone | Ritualist Waystone |
| 0,-10 | gateway | Ranger's Writ Gate | Acrobat Gate |
| 10,0 | gateway | Genius Circle Gate | Archmage Gate |
| -10,10 | gateway | Vanguard Oath Gate | Champion Gate |
| 10,-10 | gateway | Spellblade Annex Gate | Nightblade Gate |
| -10,0 | gateway | Skirmish Annex Gate | Reaver Gate |
| 0,10 | gateway | Seer's Annex Gate | Ritualist Gate |
| 5,-2 | socket | The Drowned Study Socket | Cold Jewel Socket |
| 2,3 | socket | The Procession Socket | Companion Jewel Socket |
| -3,5 | socket | The Kiln Line Socket | Fire Jewel Socket |
| 9,-5 | socket | The Drowned Study Deep Socket | Outer Cold Jewel Socket |
| 5,4 | socket | The Procession Deep Socket | Outer Companion Jewel Socket |
| -4,9 | socket | The Kiln Line Deep Socket | Outer Fire Jewel Socket |
| -9,5 | socket | The Red Field Deep Socket | Outer Physical Jewel Socket |
| 4,-9 | socket | The Unlit Road Deep Socket | Outer Poison Jewel Socket |
| -5,-4 | socket | The High Paths Deep Socket | Outer Projectile Jewel Socket |
| -5,2 | socket | The Red Field Socket | Physical Jewel Socket |
| 3,-5 | socket | The Unlit Road Socket | Poison Jewel Socket |
| -2,-3 | socket | The High Paths Socket | Projectile Jewel Socket |
| -3,-1 | small | Wind Reading | Accuracy |
| 1,-5 | small | Dark Adapted | Accuracy |
| 6,-1 | small | Sounding Line | Accuracy |
| -5,-2 | small | Far Eye | Accuracy |
| -5,-3 | small | Anemometer Habit | Accuracy |
| -8,-1 | small | Anchor Cairn | Accuracy |
| -2,3 | small | Dry Tinder | Added Fire Damage |
| -1,5 | small | Cinder Bed | Added Fire Damage |
| -2,7 | small | Red Glow | Added Fire Damage |
| -2,8 | small | Ember Tithe | Added Fire Damage |
| -2,9 | small | Charmaster Habit | Added Fire Damage |
| -6,5 | small | Heavy Footfall | Added Physical Damage |
| 1,-1 | small | First Cut | Ailment Effect |
| -3,2 | small | Open Vein | Ailment Effect |
| -1,4 | small | First Spark | Ailment Effect |
| 4,-1 | small | Shiver Script | Ailment Effect |
| 3,-4 | small | Bitter Paste | Ailment Effect |
| 5,-3 | small | Numb Fingers | Ailment Effect |
| 2,-5 | small | Milked Fangs | Ailment Effect |
| -3,-2 | small | Static Prickle | Ailment Effect |
| -2,6 | small | Coal Tally | Ailment Effect |
| 6,-5 | small | Reed Pen | Ailment Effect |
| 2,-6 | small | Black Dose | Ailment Effect |
| -6,4 | small | Red Work | Ailment Effect |
| 7,-5 | small | Slow Water | Ailment Effect |
| 3,-7 | small | Twice-Dipped | Ailment Effect |
| -7,6 | small | Butcher Economy | Ailment Effect |
| -7,8 | small | Overfire | Ailment Effect |
| 8,-3 | small | Frozen Margin | Ailment Effect |
| 7,-8 | small | Adder Pit | Ailment Effect |
| -3,-5 | small | Lightning Bottle | Ailment Effect |
| -8,3 | small | Gore Furrow | Ailment Effect |
| -6,9 | small | Salted Flame | Ailment Effect |
| 9,-4 | small | The Undertaker Current | Ailment Effect |
| 6,-9 | small | Old Poisoner Notes | Ailment Effect |
| -9,4 | small | Marrow Memory | Ailment Effect |
| 2,-8 | small | The Fence | All Attributes |
| -2,10 | small | Cracked Amphora | All Attributes |
| 2,8 | small | Roadside Shrine | All Attributes |
| 10,-2 | small | Ferry Toll | All Attributes |
| 2,-10 | small | Buried Cache | All Attributes |
| -2,-8 | small | Rope Bridge | All Attributes |
| -10,4 | small | Crow Fence | All Attributes |
| -1,1 | small | Firm Grip | Attack Damage |
| -1,3 | small | Warm Bronze | Attack Damage |
| -3,1 | small | Nicked Bronze | Attack Damage |
| -4,3 | small | Follow Through | Attack Damage |
| -1,6 | small | Second Stoke | Attack Damage |
| -6,1 | small | Broken Teeth | Attack Damage |
| -7,5 | small | Crimson Tally | Attack Damage |
| -1,8 | small | Firing Order | Attack Damage |
| -8,5 | small | Trampled Line | Attack Damage |
| -9,1 | small | Deep Field Ruts | Attack Damage |
| 0,-4 | small | Quick Breath | Attack Speed |
| -1,-3 | small | Dry Bowstring | Attack Speed |
| -4,0 | small | Loose Shoulders | Attack Speed |
| -2,5 | small | Bellows Rhythm | Attack Speed |
| -5,3 | small | Corded Forearms | Attack Speed |
| 4,-6 | small | Rasp and File | Attack Speed |
| -5,-1 | small | Downdraft Timing | Attack Speed |
| -5,7 | small | Furnace Shift | Attack Speed |
| 1,-7 | small | Pick and Tension | Attack Speed |
| -7,1 | small | Drummed Advance | Attack Speed |
| -1,9 | small | Roaring Draft | Attack Speed |
| -9,7 | small | Threshing Rhythm | Attack Speed |
| 2,-2 | small | Dark Lantern | Chaos Resistance |
| 1,-4 | small | Gutter Wisdom | Chaos Resistance |
| 5,1 | small | Salt Circle | Chaos Resistance |
| 1,-6 | small | Shrouded Lantern | Chaos Resistance |
| 5,-7 | small | Grave Dust | Chaos Resistance |
| 7,1 | small | Incense Coils | Chaos Resistance |
| 3,-8 | small | Cold Trail | Chaos Resistance |
| 4,5 | small | Ossuary Quiet | Chaos Resistance |
| 9,-3 | small | Black Water | Chaos Resistance |
| 5,-9 | small | Wither Root | Chaos Resistance |
| 3,-2 | small | River Stone | Cold Resistance |
| 6,-4 | small | Blue Lips | Cold Resistance |
| 7,-6 | small | Depth Marks | Cold Resistance |
| 8,-7 | small | Winter Ledgers | Cold Resistance |
| 2,1 | small | Standard Pole | Companion Damage |
| 4,2 | small | Bearer Training | Companion Damage |
| 2,5 | small | Drummer Boy | Companion Damage |
| 6,2 | small | Vested Authority | Companion Damage |
| 6,3 | small | Warden of Relics | Companion Damage |
| 1,-3 | small | Thin Blade | Critical Chance |
| 7,-4 | small | Ice Lens | Critical Chance |
| 2,-7 | small | Silent Count | Critical Chance |
| 1,-8 | small | Knife Oath | Critical Chance |
| 3,-9 | small | Last Candle | Critical Chance |
| 1,-9 | small | Night Ledger | Dexterity |
| -7,-2 | small | Summit Ledger | Dexterity |
| 10,-4 | small | Mist Bank | Dexterity |
| 10,-8 | small | Heron Watch | Dexterity |
| 9,-10 | small | Unlit Mile One | Dexterity |
| 8,-10 | small | Hooded Marker | Dexterity |
| 3,-10 | small | Owl Hours | Dexterity |
| 1,-10 | small | The Cold Stile | Dexterity |
| -1,-9 | small | High Path One | Dexterity |
| -4,-6 | small | Scree Slope | Dexterity |
| -5,-5 | small | Kestrel Post | Dexterity |
| -9,-1 | small | The Last Ridge | Dexterity |
| 0,-1 | small | Light Step | Evasion |
| 0,-2 | small | Practiced Fall | Evasion |
| 2,-3 | small | Muffled Steps | Evasion |
| -2,-1 | small | Sure Footing | Evasion |
| 4,-4 | small | Soft Boots | Evasion |
| 4,-5 | small | Wire and Bell | Evasion |
| 5,-6 | small | Cellar Route | Evasion |
| -1,-5 | small | Cliff Nest | Evasion |
| 6,-7 | small | Rooftop Line | Evasion |
| -6,-1 | small | Light Pack | Evasion |
| 5,-8 | small | False Papers | Evasion |
| -6,-2 | small | High Camp | Evasion |
| 8,-9 | small | Deep Cellars | Evasion |
| 2,-9 | small | Smuggler Hollow | Evasion |
| -6,-3 | small | Eagle Feathers | Evasion |
| 5,-10 | small | Ditch Shadow | Evasion |
| -7,-3 | small | Windbreak Wall | Evasion |
| 0,4 | small | Ash Blessing | Fire Resistance |
| -4,5 | small | Kiln Watch | Fire Resistance |
| -1,7 | small | Quench Trough | Fire Resistance |
| 5,2 | small | Sacred Ash | Fire Resistance |
| -5,9 | small | Old Burn Scars | Fire Resistance |
| -3,4 | small | Charcoal Burner | Guard |
| -4,1 | small | Braced Stance | Guard |
| -5,6 | small | Fired Clay | Guard |
| -6,2 | small | Shield Wall Scars | Guard |
| -6,7 | small | Kiln Door | Guard |
| -7,4 | small | Muddy Ground | Guard |
| -5,8 | small | Kilnstone Rings | Guard |
| -8,6 | small | Horn Scar | Guard |
| -8,9 | small | Deep Kiln | Guard |
| -9,8 | small | Salted Earth | Guard |
| -10,8 | small | Old Rampart Line | Guard |
| -8,10 | small | Kiln Road West | Intelligence |
| -3,10 | small | Potter Marks | Intelligence |
| 1,9 | small | Pilgrim Steps | Intelligence |
| 4,6 | small | Prayer Flags | Intelligence |
| 9,1 | small | The Quiet Mile | Intelligence |
| 10,-1 | small | River Road North | Intelligence |
| 10,-5 | small | Cold Jetty | Intelligence |
| 10,-9 | small | The Far Shore | Intelligence |
| 6,-10 | small | Thieves Cant | Intelligence |
| -2,2 | small | Broad Back | Life |
| 3,2 | small | Shared Bread | Life |
| -5,4 | small | Taste of Iron | Life |
| -3,7 | small | Slag Heap | Life |
| -8,1 | small | Bull Pens | Life |
| -3,9 | small | Clay Sweat | Life |
| -9,3 | small | Old Standard Pole | Life |
| -5,10 | small | Warm Hearthstone | Life |
| -10,7 | small | Rust Bloom | Life |
| -2,-4 | small | Copper Vane | Lightning Resistance |
| -2,-5 | small | Hail Shrug | Lightning Resistance |
| -7,-1 | small | Peak Silence | Lightning Resistance |
| -4,-5 | small | Thunder Bones | Lightning Resistance |
| -1,-4 | small | Goat Track | Movement Speed |
| -4,-3 | small | Skyline Sprint | Movement Speed |
| -3,-6 | small | Thin Air Lungs | Movement Speed |
| -4,4 | small | Scarred Knuckles | Physical Damage |
| -5,1 | small | Whetstone Habit | Physical Damage |
| -8,7 | small | Red Clay Underfoot | Physical Damage |
| -1,0 | small | First Throw | Projectile Damage |
| -2,0 | small | Belt of Knives | Projectile Damage |
| -1,-2 | small | Sling Practice | Projectile Damage |
| -4,-1 | small | Long Shot Tables | Projectile Damage |
| -4,-2 | small | Second Quiver | Projectile Damage |
| -1,-6 | small | Pass Warden | Projectile Damage |
| -1,-7 | small | Storm Shelf | Projectile Damage |
| -1,-8 | small | Deep Ravine Line | Projectile Damage |
| -7,2 | small | Pike Discipline | Reach |
| -9,6 | small | Sheaf of Spears | Reach |
| 1,0 | small | First Lesson | Rite Damage |
| 0,2 | small | Votive Candle | Rite Damage |
| 1,2 | small | Censer Smoke | Rite Damage |
| 3,-1 | small | Wet Ink | Rite Damage |
| 5,-4 | small | Drift Nets | Rite Damage |
| 2,4 | small | Litany Page | Rite Damage |
| 6,-2 | small | Undercurrent | Rite Damage |
| 7,-2 | small | Cold Catalogue | Rite Damage |
| -3,8 | small | Ash Ink | Rite Damage |
| 1,7 | small | Night Office | Rite Damage |
| 8,-1 | small | Silt Ledger | Rite Damage |
| 3,6 | small | Old Devotions | Rite Damage |
| 9,-1 | small | Deep Shelf Reading | Rite Damage |
| 3,1 | small | Hymn Cadence | Rite Speed |
| 4,0 | small | Steady Hand of the Scribe | Rite Speed |
| 4,1 | small | Chant Rhythm | Rite Speed |
| 5,-1 | small | Ford Knowledge | Rite Speed |
| 4,3 | small | Relay of Torches | Rite Speed |
| 8,-6 | small | Pale Reflection | Rite Speed |
| 9,-7 | small | Cold Authority | Rite Speed |
| 0,1 | small | First Rite | Spirit |
| 2,0 | small | Copied Notes | Spirit |
| 1,4 | small | Waymarker Ribbon | Spirit |
| 6,1 | small | Column Discipline | Spirit |
| 5,3 | small | Keeper Keys | Spirit |
| 8,1 | small | Breviary Margin | Spirit |
| 9,-8 | small | Drowned Notes | Spirit |
| 5,5 | small | Alms Bowl | Spirit |
| -9,10 | small | Kiln Road East | Strength |
| -6,10 | small | Cartload of Coal | Strength |
| -1,10 | small | Fired Brick Path | Strength |
| 7,3 | small | Stone Lantern Row | Strength |
| -8,-2 | small | Old Signal Fire | Strength |
| -10,1 | small | Red Field Gate Road | Strength |
| -10,2 | small | Broken Cart Axle | Strength |
| -10,5 | small | Boot Churn | Strength |
| -10,9 | small | The Long Furrow | Strength |
| 1,3 | small | Anointed Brow | Ward |
| 4,-3 | small | Cold Margin | Ward |
| -4,6 | small | Glaze Line | Ward |
| 1,5 | small | Oath Beads | Ward |
| 1,6 | small | Long Watch | Ward |
| 7,-1 | small | Flooded Stacks | Ward |
| 3,5 | small | Lantern Oil | Ward |
| 8,-5 | small | The Weir | Ward |
| 1,8 | small | Deep Sanctum | Ward |
| 7,2 | small | Undercroft Lamp | Ward |
| 9,-6 | small | Silver Silt | Ward |
| 8,2 | small | Vigil Bench | Ward |
| 10,-7 | small | Waterline Steps | Ward |
