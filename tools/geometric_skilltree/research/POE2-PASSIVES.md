# Path of Exile 2 Passive Skill Tree — Design Reference

*Researched July 2026. PoE2 is still in Early Access (patches 0.1.0 "EA launch" Dec 2024 → 0.2.0 "Dawn of the Hunt" → 0.3.0 "The Third Edict" → 0.4.0 "The Last of the Druids" Dec 2025 → 0.5.x "Return of the Ancients" mid-2026). Facts below are current-patch unless flagged; the tree has been iterated heavily, which is itself a design lesson.*

*(Research pass for the NORTH-STAR.md tree overhaul, 2026-07-11. This is source
material — never copy names or exact text into the Verdigris tree.)*

---

## 1. What Changed From PoE1

### 1.1 Attribute travel nodes → attribute *choice* nodes
- PoE1 filled its "highways" with fixed **+10 Strength / +10 Dexterity / +10 Intelligence** travel nodes whose flavor was dictated by tree region.
- PoE2 replaces these with **Attribute Nodes (travel nodes): "Adds +5 to any attribute selected"** — you pick Str, Dex, or Int per node, and can re-pick later **for half the gold cost of a normal refund** (poe2wiki). This decouples "where you path" from "what attributes you get," which matters because PoE2 gems and gear have steep attribute requirements and classes no longer get attributes from leveling in the same way.
- Attributes have deliberately thin inherent bonuses (no damage): **Str = +2 max Life per point; Int = +2 max Mana per point; Dex = +6 Accuracy per point** (buffed from +5 in 0.3.0; in-game tooltip now shows +8). Each tooltip explicitly ends "…does not grant damage to Skills or any other benefits except where specifically stated."
- One ascendancy (Pathfinder's *Traveller's Wisdom*) expands the menu of stats selectable on attribute nodes — a nice example of ascendancy-modifies-tree design.

### 1.2 Tree size
- EA launched with **~1,500 nodes** (community counts; a player feedback thread: "With over 1,500 nodes staring you down… told to pick 122").
- It has grown every patch: 0.2.0 added a dozen+ themed cluster families (Parry, Companion, Thorns, Banner…); **0.3.0 alone added ~105 new clusters** (8 Warrior↔Witch, 15 Warrior, 23 Mercenary, 17 Ranger/Huntress, 17 Monk, 25 Witch/Sorceress). Current estimates: **~1,800+ small passives, 500+ notables/keystones** (game8); poe2db's database lists **1,193 notable passives** plus **161 Timeless-Jewel-only notables**.
- Points: **1 per level (99 max) + 24 from quests = 123** (a few conditional extras: a league one-off point, Pathfinder can mint up to +6, Oracle +2). This is nearly identical to PoE1's budget — the tree got bigger, the wallet didn't.

### 1.3 No life on the tree
- **There are zero "% increased maximum Life" / "+X to maximum Life" nodes on the PoE2 tree.** Life comes from: **base 28 + 12 per level + 2 per Strength**, plus flat life on gear. (% max life exists only on outliers: the *Grand Spectrum* Ruby jewel "2% increased Maximum Life per socketed Grand Spectrum," a rare Time-Lost Ruby radius mod, gear.)
- The tree still has life-*adjacent* nodes: regeneration rate, recoup, leech, flask recovery, stun/ailment threshold — recovery and mitigation, not pool size.
- **Design intent, verbatim from game director Jonathan Rogers (Dec 2025 interview, Sportskeeda):** "the reason we didn't want to do life on the passive skill tree is that in PoE 1, it just ended up being a mandatory stat that you just effectively had to allocate. And it was a bit of a noob trap as well… if life is so mandatory, what's the reason to make people allocate that? Because, effectively, what they're doing is just wasting 20 passives or 30 passives… when they could be allocating something more interesting. And so what we prefer in PoE 2 is… if you're looking to go defensive, then you've got defensive nodes that you're doing." And: "We'd prefer not to add life if we don't need to," while admitting "there are some balance implications of doing that that might lead to some potential downsides in terms of some aspects of survivability."

### 1.4 Other structural removals vs PoE1
- **No Masteries** (PoE1's 3.16 pick-one-bonus system inside clusters) — the anoint system (see §5) and richer notables carry that load.
- **No Cluster Jewels** (PoE1's tree-expanding jewels); radius jewels instead *modify* existing nodes (§6).
- **No Scion / no central hub class**; 12 classes (6 at EA) start on a **central ring**, two classes per attribute pairing, and share the same outer tree.

### 1.5 Weapon Set Skill Points (dual specialization) — genuinely new
- You can earn up to **24 Weapon Set Passive Skill Points** across the campaign (from *Book of Specialisation* quest items etc.; +1 more from the ultra-rare *Olroth's Boon*).
- Each such point can be allocated **differently per weapon set** (Weapon Set I vs II), and the tree re-resolves automatically when you swap weapons — including mid-combo, since skills can be flagged "always use Weapon Set I/II." **Keystones and jewel sockets cannot be weapon-set-specific.** You may also just spend them as normal points.
- Example use (Mobalytics): AoE-spec'd tree on Set 1 for clearing, single-target damage tree on Set 2 for bosses.
- Ascendancy hook: Witchhunter's *Weapon Master* converts **up to 100 regular points into weapon-set points** — the "full dual-spec" fantasy as an opt-in ascendancy identity.

### 1.6 Ascendancies
- Each class has (eventually) **3 ascendancy subclasses** — 36 planned; ~20–22 live in 0.5 (plus one "alternate" ascendancy, **Abyssal Lich**, unlocked by beating an endgame boss as a Lich — a new idea: prestige variants of an ascendancy).
- Chosen at the first **Trial of Ascendancy**; **8 ascendancy points total, granted 2 at a time across 4 difficulty tiers** (first trial in Act 2, second ~Act 3, tiers 3–4 in endgame-level trials). Two interchangeable trial types — **Trial of the Sekhemas** (Sanctum-style honour gauntlet, key item: Djinn Barya) and **Trial of Chaos** (Ultimatum-style, Inscribed Ultimatum) — either can grant all 8 (0.5 added a third, Trial of Madness).
- The ascendancy tree is a small sub-tree accessed from the center of the main tree; nodes are build-defining (grant skills, rewrite mechanics). Ascendancy can be **respecced** by re-running a trial (must refund its points first) — PoE1 never allowed a clean subclass swap.
- Unusual cross-system design: the Druid ascendancy **Oracle** unlocks *exclusive nodes on the main tree* ("The Unseen Path") no other class can see — ascendancy as a lens on the shared tree.

### 1.7 Respec economy
- PoE1's refund points/regret orbs → **gold cost per point, scaling with level** (15 gold at lvl 1 → ~1,089 at 50 → 10,129 at 100). Universally praised as far more experiment-friendly; attribute re-picks cost half.

---

## 2. Node Taxonomy in PoE2

| Node type | Typical budget | Verified examples (exact text) |
|---|---|---|
| **Attribute / travel node** | +5 one attribute (player's choice) | "Adds +5 to any attribute selected" |
| **Small passive** | one stat line, ~10–15% increased, or small flat | "10% increased Fire Damage" · "15% increased Evasion Rating" · "+8 to Dexterity" · "6% increased Accuracy Rating" · "3% increased Attack Speed with One Handed Weapons" |
| **Notable** | 1–4 stat lines; ~25–40% increased of the theme stat, often + a mechanic or hybrid line; sometimes a drawback | *Beef*: "+25 to Strength" · *Martial Artistry*: "25% increased Accuracy Rating with Quarterstaves / 25% increased Critical Damage Bonus with Quarterstaves / +25 to Dexterity" · *Vigilance*: "12% increased Block chance / 10 Life gained when you Block / +2% to maximum Block chance" · *Sniper*: "Arrows gain Critical Hit Chance as they travel farther, up to 40% increased Critical Hit Chance after 7 metres" · *Wide Barrier* (drawback style): "20% reduced Armour / 30% increased Block chance" · *Heavy Contact*: "Hits that Heavy Stun Enemies have Culling Strike" · *Jack of all Trades*: "2% increased Damage per 5 of your lowest Attribute" |
| **Keystone** | build-warping rule change, benefit + cost | full list in §3 |
| **Jewel socket** | empty; socket a jewel (freely swappable, no respec cost) | §6 |

- Cluster anatomy: **2–4 smalls gate a notable**, often with multiple entry paths; clusters hang off attribute-node highways. Wiki: "The type of bonuses from each cluster tend to be more generalized near the center and more powerful or specialized the further they are."
- Keystone count: ~16 at EA launch → **~32 on-tree keystones now**, plus 8 that exist only via Timeless Jewels (§6).

---

## 3. Keystones (complete current list, exact text)

From poe2wiki (current as of Dec 2025 edit; includes 0.4.0 additions):

| Keystone | Exact effect |
|---|---|
| **Ancestral Bond** | Your Totem Limit is doubled / No Charge requirement for placing Totems / Totems reserve 75 Spirit each |
| **Avatar of Fire** | 75% of Damage Converted to Fire Damage / Deal no Non-Fire Damage |
| **Blackflame Covenant** | Fire Spells Convert 100% of Fire Damage to Chaos Damage / Chaos Damage from Fire Spells Contributes to Flammability and Ignite Magnitudes / Ignite inflicted with Fire Spells deals Chaos Damage instead of Fire Damage |
| **Blood Magic** | You have no Mana / Skill Mana Costs Converted to Life Costs |
| **Bulwark** | Dodge Roll cannot Avoid Damage / Take 30% less Damage from Hits while Dodge Rolling |
| **Chaos Inoculation** | Maximum Life is 1 / Immune to Chaos Damage and Bleeding |
| **Conduit** | If you would gain a Charge, Allies in your Presence gain that Charge instead |
| **Crimson Assault** | Bleeding you inflict is Aggravated / Base Bleeding Duration is 1 second / 50% more Magnitude of Bleeding you inflict |
| **Dance with Death** | 25% more Skill Speed while Off Hand is empty and you have a One-Handed Martial Weapon equipped in your Main Hand |
| **Eldritch Battery** | Convert 100% of maximum Energy Shield to maximum Mana / Mana Costs are Doubled |
| **Elemental Equilibrium** | Create Lightning Infusion Remnants instead of Fire / Create Cold Infusion Remnants instead of Lightning / Create Fire Infusion Remnants instead of Cold |
| **Eternal Youth** | Life Recharges instead of Energy Shield / 50% less Life Recovery from Flasks |
| **Giant's Blood** | You can wield Two-Handed Axes, Maces and Swords in one hand / Triple Attribute requirements of Martial Weapons / Inherent Life granted by Strength is halved |
| **Glancing Blows** | Chance to Evade is Unlucky / Chance to Deflect is Lucky |
| **Heartstopper** | Take 50% less Damage over Time if you've started taking Damage over Time in the past second / Take 50% more Damage over Time if you haven't started taking Damage over Time in the past second |
| **Hollow Palm Technique** | Can Attack as though using a Quarterstaff while both hand slots are empty / unarmed attacks get: base damage from Skill Level; 1% more Attack Speed per 75 Item Evasion on equipped armour; +0.1% Crit Chance per 10 Item Energy Shield on equipped armour |
| **Iron Reflexes** | Converts all Evasion Rating to Armour |
| **Lord of the Wilds** | You can equip a non-Unique Sceptre while wielding a Talisman / 50% less Spirit / Non-Minion Skills have 50% less Reservation Efficiency |
| **Mind Over Matter** | All Damage is taken from Mana before Life / 50% less Mana Recovery Rate |
| **Necromantic Talisman** | All bonuses from Equipped Amulet apply to your Minions instead of you |
| **Oasis** | Cannot use Charms / 30% more Recovery from Flasks |
| **Pain Attunement** | 30% less Critical Damage Bonus when on Full Life / 30% more Critical Damage Bonus when on Low Life |
| **Primal Hunger** | 100% more Maximum Rage / Regenerate 1 Rage per second per 4 Rage spent Recently / No Rage effect |
| **Resolute Technique** | Accuracy Rating is Doubled / Never deal Critical Hits |
| **Resonance** | Gain Power Charges instead of Frenzy Charges / Frenzy instead of Endurance / Endurance instead of Power |
| **Ritual Cadence** | Invocation Skills instead Trigger Spells every 2 seconds / cannot gain Energy while Triggering / Invoked Spells consume 50% less Energy |
| **Scarred Faith** | 5% of Physical Damage prevented Recouped as Energy Shield per enemy Power / ES does not Recharge / cannot Recover ES from Regeneration / cannot Recover ES above Armour |
| **Trusted Kinship** | You can have two Companions of different types / 30% more Reservation Efficiency of Companion Skills / 20% less for non-Companion Skills |
| **Unwavering Stance** | Cannot be Light Stunned / Cannot Dodge Roll or Sprint |
| **Vaal Pact** | 50% more amount of Life Leeched / Leech Life 67% less quickly / Cannot Recover Life other than from Leech / Leech effects not removed when Life is filled |
| **Whispers of Doom** | You can apply an additional Curse / Double Activation Delay of Curses |
| **Wildsurge Incantation** | Storm and Plant Spells: deal 50% more damage / cost 50% less / have 75% less duration |
| **Zealot's Oath** | Excess Life Recovery from Regeneration is applied to Energy Shield / Energy Shield does not Recharge |

**Jewel-only keystones** (granted by Timeless Jewels replacing keystones in radius, §6): *Black Scythe Training* ("Gain no inherent bonus from Strength / 1% increased Energy Shield per 2 Strength"), *Circular Teachings* (Dex → 1% Armour per 2 Dex), *Knightly Tenets* (Int → 1% Evasion per 2 Int); and the five *Sacrifice* keystones (of Blood / Flesh / Loyalty / Mind / Sight — e.g. **Sacrifice of Sight**: "Projectiles do one of the following at random: Fork an additional time / Chain an additional time / Chain from Terrain an additional time / Cannot collide with targets").

### Redesigns vs PoE1 worth studying
- **Resolute Technique**: PoE1 "Your hits can't be Evaded" → PoE2 "Accuracy Rating is Doubled" (softened from absolute to scalar because PoE2 accuracy falls off with distance).
- **Mind Over Matter**: PoE1 "30% of damage taken from Mana before Life" (a splitter) → PoE2 "**All** damage taken from Mana before Life / 50% less Mana Recovery" (a full second health bar with a recovery tax).
- **Eldritch Battery**: PoE1 "ES protects Mana instead of Life" → PoE2 "Convert 100% of max ES to max Mana / Mana Costs Doubled."
- **Vaal Pact**: PoE1 "leech is instant, no regeneration" → PoE2 "50% more leech, 67% slower, *only* leech can recover life."
- **Elemental Equilibrium**: PoE1's resistance seesaw (hit with one element → −50% to others) became a totally different Infusion-rotation mechanic.
- **Avatar of Fire**: 50% conversion in PoE1 → 75% in PoE2, now including chaos.
- **Ancestral Bond**: PoE1 "+1 totem, you deal no damage yourself" → PoE2 doubles totem limit and moves the cost into Spirit reservation (drawback expressed through the new resource, not a damage ban).
- **Unwavering Stance**: PoE1 traded evasion for stun immunity → PoE2 trades the *dodge roll and sprint* (new universal movement verbs) for light-stun immunity only. Heavy stuns still land — GGG kept a failure state.
- **Pain Attunement**: PoE1 "30% more Spell Damage on Low Life" → PoE2 symmetric crit-damage swap (full life penalty / low life bonus), and it's also printed on a level-1 unique (*Crown of Thorns*).
- **Whispers of Doom** was a PoE1 notable (+1 curse, no downside); PoE2 promotes it to a keystone with a real cost (doubled curse activation delay).
- **Glancing Blows**: PoE1 block-doubling → PoE2 a lucky/unlucky RNG-shaping trade between Evasion and the new Deflect stat.
- **Necromantic Aegis** (PoE1: shield applies to minions) reappears as **Necromantic Talisman** (amulet applies to minions).
- **Hollow Palm**: PoE1 cluster-jewel keystone (unarmed attack speed/flat damage from Dex) → PoE2 "your fists are a virtual Quarterstaff" that scales off *armour-item defenses* (attack speed per evasion, crit per ES).
- **Iron Grip / Iron Will** no longer exist on the tree — they survive only as stats on a unique (*Irongrasp*). Several PoE1 keystones (Elemental Overload, Point Blank, Ghost Reaver, Arrow Dancing, etc.) have no tree presence; their roles moved to support gems, ascendancies, or were cut.
- **Acrobatics** shipped in EA as "Can Evade all Hits [including AoE] / 75% less Evasion Rating" and was **removed entirely in 0.3.0** — a rare case of GGG deleting a keystone that proved to be either a trap or a degenerate must-have.
- Note the newer keystones (Heartstopper, Bulwark, Dance with Death, Giant's Blood, Oasis, Resonance) are built around PoE2-native verbs: dodge roll, DoT windows, dual-wield slots, charms, charge types — keystones as levers on the *action layer*, not just the stat sheet.

---

## 4. Defense Design in PoE2

**Layers** (a character is expected to stack several):

1. **Life** — pool comes from level (28 + 12/level), Strength (+2/pt), and flat life on gear. The tree contributes only *recovery* (regen rate, recoup, leech, "Life gained when you Block") and *thresholds*. This makes gear the life budget and the tree the defense-flavor budget — exactly Rogers' stated goal.
2. **Armour** — mitigates physical hits (less effective vs big hits); tree support: % armour clusters plus mechanic notables like *Projectile Bulwark* ("30% increased Armour / Defend with 120% of Armour against Projectile Attacks"), *Blade Catcher* ("Defend with 200% of Armour against Critical Hits"), *Heavy Armour* ("Gain Armour equal to 150% of total Strength Requirements of Equipped Boots, Gloves and Helmet"), plus Armour-Break resistance. Notables that *extend what armour applies to* ("+30% of Armour also applies to Fire Damage" — *Heatproof*) are the PoE2 signature.
3. **Evasion** — chance to avoid attack hits; supported by % evasion smalls/notables, Blind clusters, **Deflect** (new 0.2 stat: partial avoidance for deflected hits, Dex-side "block-alike").
4. **Energy Shield** — Int-side over-life buffer with recharge; tree is generous here (% ES, recharge rate/delay, faster-start), plus keystones CI / EB / Zealot's Oath / Eternal Youth / Scarred Faith forming a whole ES sub-economy. (ES was the dominant EA defense — community consensus and a criticism.)
5. **Block** — shield implicit ~25%; tree: block chance, "maximum Block chance" (*Defensive Stance*: "+4% to maximum Block chance"), on-block recovery, raise-shield notables (*Dazing Blocks*: "100% chance to Daze Enemies whose Hits you Block with a raised Shield").
6. **Resistances** — cap 75%, hard cap 90% with +max res. **Penalties are staged: Act 2 −10%, Act 3 −20%, Act 4 −30%, then by area level: −40% (lvl 54–59), −50% (60–64), −60% (65+/endgame)** — same −60% total as PoE1 but smoothed into more steps. Resists live almost entirely on gear; the tree offers little raw res (deliberate scarcity → gearing pressure).
7. **Stun & Ailment Thresholds** — new defensive stats (buildup meters against Heavy Stun / Freeze etc.), fed by Str/life and dedicated tree nodes ("Gain additional Stun Threshold equal to 30% of Item Armour on Equipped Armour Items" — *Polished Iron*).
8. **Spirit** — not a defense per se but the reservation resource gating persistent buffs/minions/heralds: **base 0; +100 total from three campaign quest skulls (30/30/40); rest from gear** (sceptre implicits, body-armour/amulet prefixes up to "+57–61 to Spirit"). Tree grants Spirit-reservation *efficiency*, rarely flat Spirit.
9. **Flasks & Charms** — one life + one mana flask with charge economy (charges from kills, refill at wells/checkpoints). PoE1's utility flasks became **Charms**: belt-socketed trinkets (1–3 slots by belt ilvl, cap 3) that **trigger automatically** when their condition is met ("when Frozen…") and consume charges — removing PoE1's flask-piano APM. Tree/keystone hooks exist (*Oasis*: "Cannot use Charms / 30% more Recovery from Flasks").
10. **Dodge roll** — universal active avoidance verb; note how many keystones price it (Unwavering Stance, Bulwark).

**How the tree supports archetypes:** each defense has its own regional cluster ecosystem (armour/block SW, evasion/deflect SE, ES north), hybrid defenses between regions, conversion keystones (Iron Reflexes, EB, CI) at the borders. Since the tree has no life, "tanky" is expressed as *pick your mitigation stack*, not *pay the life tax*.

---

## 5. Notable / Cluster Design

- **Cluster grammar:** 2–4 smalls → 1 notable; smalls are usually plain single-stat lines of the cluster theme; the notable pays off with a hybrid or a mechanic. Multiple path entries let clusters be grabbed from different directions.
- **Highways** are chains of +5 attribute-choice nodes — the "travel tax" is real (community complaint) but at least always pays attributes you chose.
- **Center vs edge:** generic near the class ring ("increased Damage," basic defenses), specialized/spicier at the rim. Class starting wedges have **class-specific starting notables** (Witch and Sorceress share a wedge but see different starting notables — these can't be anointed).
- **Regions** (poe2wiki): **SW = Strength**: fire, armour, melee, endurance charges, block, warcries, life leech. **SE = Dexterity**: lightning, evasion, ranged/projectiles, frenzy charges, deflection, accuracy, flask recovery. **North = Intelligence**: cold, chaos, ES, spells, minions, power charges, mana, curses. Between-region bands are hybridized (crit between Dex/Int, elemental attack between Str/Dex).
- **Class starts (ring):** Warrior/Marauder (Str), Mercenary/Duelist (Str-Dex), Ranger/Huntress (Dex), Monk/Shadow (Dex-Int), Witch/Sorceress (Int), Templar/Druid (Int-Str).
- **Notable flavors observed** (all real, §2 examples): pure stat blocks; hybrid stat+mechanic; conditional gameplay rules (*Focused Thrust*: "75% increased Melee Damage with Spears while Surrounded / 40% increased Projectile Damage with Spears while there are no Enemies within 3m" — range-dependent identity); drawback notables (*Singular Purpose*: "5% reduced Attack Speed / 20% increased Stun Buildup / 40% increased Damage with Two Handed Weapons"); scaling-off-gear notables (*Greatest Defence*: "4% increased Attack Damage per 75 Item Armour and Evasion on Equipped Shield"); attribute-stack enablers (*Brute Strength*: "10% reduced maximum Mana / 1% increased Damage per 15 Strength").
- **Anointing (Instilling):** every non-start notable has a recipe of three **Liquid Emotions** (Delirium drops) that can be enchanted onto an amulet to allocate it point-free — PoE2's replacement for both PoE1 oils and, partially, masteries. (QoL: since 0.4.0d, recipes are visible by hovering any notable with ALT.)
- **Ecosystem hooks:** notables are a currency other systems spend — *Megalomaniac* (grants 2–3 random notables), amulet anoints, Time-Lost jewels ("Notable Passive Skills in Radius also grant…"), Titan's *Hulking Form* ("50% increased effect of Small Passive Skills" — making trash nodes an ascendancy scaling vector).

---

## 6. Jewels in PoE2

**Socket rules:** jewel sockets are tree nodes; once allocated you can socket/swap jewels freely at no cost. Jewels have **max 4 affixes** (5 if corrupted), no level/stat requirements, craftable with normal currency. 0.2.0 **removed 12 jewel sockets** from the tree (power concentration concern).

**Base types (color = theme):**
- **Ruby** — Strength/martial/armour/fire-aligned mods; **Emerald** — Dex/evasion/projectile/range; **Sapphire** — Int/ES/caster; **Diamond** — special: doesn't drop, only crafted by reforging three jewels, and is the base of most build-warping uniques.
- **Regular jewels** = pure stat sticks ("grant you the listed stats"), no radius.
- **Time-Lost jewels** (Ruby/Emerald/Sapphire/Diamond variants) = **radius jewels**: "do not inherently provide any stats, but will instead modify other passive skills in its radius." Affixes read like: "Small Passive Skills in Radius also grant (1–2)% increased Global Physical Damage" (Ruby prefix) or "Notable Passive Skills in Radius also grant (5–10)% increased Critical Spell Damage Bonus" (Sapphire suffix). Default radius Small; can roll Medium/Large. **Exclusive drops from Trial of the Sekhemas** (Time-Lost Caches after Zarokh). Disciple of Varashta ascendancy: "Non-Unique Time-Lost Jewels have 40% increased radius."
- **Timeless Jewels** (PoE2 equivalent of PoE1's, "Historic," limit 1 per character): **Heroic Tragedy** — "Remembering (100–8000) songworthy deeds by the line of (Vorana/Medved/Olroth) / Passives in radius are Conquered by the Kalguur" — seed-transforms all passives in a Very Large radius and **replaces keystones in radius** with Black Scythe Training / Circular Teachings / Knightly Tenets depending on the name rolled; **Undying Hate** — Abyssal version (Amanamu/Ulaman/Kurgal/Tecrod/Kulemak) replacing keystones with the five Sacrifice keystones, and it can be "Desecrated" up to 4 times for extra mods at the cost of item instability. 161 Timeless-Jewel-only notables exist in the data.
- **Unique jewels** (selection): *Megalomaniac* (allocates 2–3 random notables), *Voices* (allocates 2–4 extra jewel sockets), *Split Personality* ("Can Allocate Passive Skills from the <Random class> starting point"), *Controlled Metamorphosis* / *From Nothing* (allocate passives in a ring/radius without tree connection), *Flesh Crucible* (random keystone + random "(20–10)% less X" penalty), *Prism of Belief* (+1–3 to a random skill's gem level), *The Adorned* (amplifies corrupted magic jewels), *Grand Spectrum* set (Ruby 2% life / Emerald 2% Spirit / Sapphire +6% all res, per socketed Spectrum, limit 3), *Against the Darkness* (Time-Lost Diamond, 2 random radius mods).
- **Soul Cores are NOT tree items** — they're socketables (like runes) for gear sockets on martial weapons/armour; only tangentially tree-relevant via uniques like *Mahuxotl's Machination*.

---

## 7. Design Lessons & Reception

### What GGG says (design intent)
- **Life-tax removal is deliberate and defended** (full Rogers quotes in §1.3): mandatory stats waste player agency; defense should be a *choice among flavors*, not a tithe. He concedes survivability balance got "complicated" as a result.
- The tree deliberately keeps attributes damage-free and gear-gating, so attribute-choice travel nodes are meaningful decisions, not filler flavor.
- Iteration cadence shows a "ship thin, densify later" strategy: every major patch added dozens of clusters for new mechanics (Parry, Companions, Thorns, Banners…), rebalanced node families globally ("Sources of increased Area of Effect have been lowered by approximately 25%" — 0.3.0), and even deleted a keystone (Acrobatics) and 12 jewel sockets rather than leave traps/outliers in place.

### What players praise
- **Gold respec** and the half-cost attribute re-pick — experimentation is dramatically cheaper than PoE1.
- **Attribute-choice travel nodes** — solving PoE1's "wrong-attribute highway" problem.
- **Weapon Set points** — widely called the most innovative tree feature (context-sensitive builds), though also widely under-used by casual players.
- The **anoint/Instill visibility** and tree search tooling; defenders of the tree argue its depth is in "far-pathing, unique jewels, anoints" combos (player quote, official forums).

### What players criticize (recurring, with sourced player language)
- **Small nodes feel weak / tree feels like a % spreadsheet:** "It was intentionally designed to 'increase/decrease %' which was pretty lazy. They need more interesting nodes like +1 to crit or chaos innoc." Comparisons to PoE1 notables that bundled 3–4 transformative lines: "One goddamn talent. [PoE1's] passive tree all feels bonkers and exciting."
- **Notables skew to conditional damage:** "Passives ranging from 10% increased crit chance… or +25% damage under full moon, while bleeding, but minus 20% hp. Conditional affixes. Pain management."
- **Defensive point-sinks feel bad:** "Spending 5–10–20 points on stun/ailment threshold? Utterly trashy and non-appealing way for character progression."
- **Bloat + travel tax:** "With over 1,500 nodes… it's like being handed a phonebook and told to pick 122 pages… It's demoralizing to spend hard-earned points on a +5 Strength node just to inch toward something actually impactful." / "travel nodes taking too much of points and too long travel distance… is the main issue of limiting build choices."
- **Sparse midgame decision space / weak midpoints:** "Notable clusters are also so far apart, while the starting area is so cluttered… you look around 'ok where do I go next' and all the options are 'meh'." (GGG's 100+ new clusters in 0.3 were a direct response.)
- **Class-locked starting wedges** cut both ways: they guarantee early relevance but broke PoE1's "any class, any build" purity — "You wanna play witch infernalist? You actually don't have fire nodes at the beginning, these are reserved for sorceress."
- **No life on tree remains contested**: ES-based builds had a structural advantage in EA (ES scales on tree, life can't), a point players raise against the philosophy even while GGG holds the line.

### Distilled takeaways
1. **Kill mandatory stats, but budget for the consequence** — if the tree can't buy HP, gear and level curves must carry survivability, and every non-pool defense (thresholds, recharge, block) needs to feel worth points or players will call it a trap.
2. **Make travel nodes choices** (+5 pick-an-attribute) instead of fixed filler; even better, let subclasses expand the choice menu.
3. **Attach keystones to your action verbs** (dodge roll, weapon swap, charm autouse), not just stat math — PoE2's best-received keystones price a *behavior*.
4. **Small = one clean line, Notable = hybrid + mechanic, Keystone = rule change with a cost** is a legible budget hierarchy — but if smalls are pure %-increases, players will feel it; PoE2's harshest feedback targets exactly this.
5. **Dual-spec via context (weapon sets) beats a second full spec** — cheap to learn, deep to master, and it doubles as a skill-loadout system.
6. **Radius jewels that modify neighbors** (Time-Lost) are a cheaper, more tunable version of tree-extension jewels — and seed-based Timeless jewels remain the best "infinite chase" design in the genre.
7. **Ship the tree as a live system**: PoE2 added ~150+ clusters, removed a keystone, deleted jewel sockets, and globally rebalanced node families across five patches — with forced refunds and free respecs as the social contract for doing so.

---

### Sources
- poe2wiki.net: Keystone · Passive Skill Tree · Ascendancy class · Jewel · Attribute · Life · Resistance · Spirit · Charm
- poe2db.tw: Notable passives (1,193 listed) · Small Passives keyword
- Maxroll: Passive Tree & Dual Specialization · Trials of Ascendancy · 0.2.0 patch notes — Mobalytics: Weapon Set mechanics
- Game8: Keystone list · Passive tree guide — Fextralife: Passive Skills
- Sportskeeda: Jonathan Rogers interview, Dec 2025 ("We'd prefer not to add Life if we don't need to")
- Official forums (player reception): "Passive Tree is Underwhelming and Bad" · "Why the PoE2 Passive Tree Needs a Major Overhaul"
- ConquestCapped: 8 ascendancy points guide — U4GM: Time-Lost jewels
