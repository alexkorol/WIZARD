# The Path of Exile 1 Passive Skill Tree: A Design Reference

*Compiled from poewiki.net (Cargo database + wiki pages), pathofexile.com official materials, GGG patch notes/manifestos, and designer interviews. All effect text is verbatim from current PoE1 (3.2x era) unless marked historical. PoE1's tree has been iterated on for 12+ years — version notes are flagged where the history is itself a design lesson.*

*(Research pass for the NORTH-STAR.md tree overhaul, 2026-07-11. This is source
material — never copy names or exact text into the Verdigris tree.)*

---

## 1. Taxonomy of Passive Node Types

The tree contains **1,325 skills** (official pathofexile.com figure). A character allocates at most **~123 points** (99 from levels 2–100, 23 from quests, +1 optional from the Bandit quest if all three bandits are killed), so a finished build touches under 10% of the tree. Ascendancy adds a separate 8-point mini-tree (Scion's grants +5 main-tree points instead). Every node type below exists in a strict power hierarchy, and the hierarchy is what makes pathing a game.

### 1a. Travel nodes (attribute smalls)
- **Effect:** exactly `+10 to Strength` / `+10 to Dexterity` / `+10 to Intelligence` (border regions have +5/+5 hybrids).
- **Frequency:** the connective tissue of the tree — several hundred of them. The wiki's own metaphor: clusters are "suburbs," attribute nodes are "roads."
- **Role:** deliberately near-worthless (attributes give only 0.5 life/str, 2 accuracy + 1% evasion/20 dex... small implicit bonuses), so every travel node is a *visible toll*. Distance between clusters is priced in these. They also feed item attribute requirements and attribute-stacking builds, and are the substrate later systems (Timeless Jewels, Tattoos, attribute-conversion jewels) transform — dead nodes turned out to be valuable *design real estate*.

### 1b. Small stat nodes (cluster filler)
- **Budget (verified samples from the tree database):**
  - Life: `5% increased maximum Life` or `6% increased maximum Life` (hybrids: 4% life + 10% evasion, 3% life + 5% ES, etc.)
  - Spell damage: `8–12% increased Spell Damage`; specific element: `12–16% increased Fire Damage`
  - Attack speed: `3–4% increased Attack Speed`; cast speed `3–5%`
  - Crit chance: `15–25% increased Critical Strike Chance` (crit chance numbers run big because base crit is ~5–7%)
  - Weapon smalls are usually two-line: `12% increased Physical Damage with Axes; 3% increased Attack Speed with Axes`
- **Frequency:** 2–4 of them gate every notable. The single largest node population after travel nodes.
- **Role:** the "entry fee" of a cluster. Roughly 40–60% of a notable's power per point, so a cluster's average value depends on how many smalls you must eat. GGG tunes cluster attractiveness by adding/removing one small as much as by changing the notable.

### 1c. Notables
- **Budget:** ~2–3× a small node, usually a **primary stat + one or two flavor/secondary lines**. Verified examples:
  - `Constitution`: *10% increased maximum Life; +20 to maximum Life* (the classic pure-life notable)
  - `Golem's Blood`: *Regenerate 1.6% of Life per second; 10% increased maximum Life*
  - `Heart of Thunder`: *30% increased Lightning Damage; Damage Penetrates 6% Lightning Resistance*
  - `Assassination`: *+25% to Critical Strike Multiplier; 25% increased Critical Strike Chance*
  - `Static Blows`: *30% increased Damage if you have Shocked an Enemy Recently; 30% increased Effect of Lightning Ailments; 50% increased Duration of Lightning Ailments*
  - `Whispers of Doom`: *You can apply an additional Curse* — a notable that grants a **rule change**, not a number; the strongest notables do this (`Corruption`: *20% increased Effect of Withered*).
- **Frequency:** a few hundred; typically 1 per cluster, 2–3 on big named "wheels" (e.g., a crit wheel).
- **Role:** the destination. Builds are planned notable-to-notable; everything else is cost. Since 3.8, notables are also the currency of **anointing** (amulet oils allocate one notable for free, no pathing) — an explicit release valve for "that one notable is 8 points away."

### 1d. Keystones
- **Budget:** not a stat budget at all — a **rule change with a cost**. See §3.
- **Frequency:** rare and positional — roughly two dozen on the tree itself, placed at region edges and deep corners so reaching one is itself a build commitment. More exist only via unique/Timeless/cluster jewels.
- **Role:** build identity. Players describe builds by their keystones ("CI Occultist," "RT slammer"). One allocation each; effects never stack.

### 1e. Masteries (3.16+)
- One selectable pick-one-of-~6 node per cluster, unlocked by allocating that cluster's notable. Costs 1 point. See §6.

### 1f. Jewel sockets
- **Effect:** empty node; grants whatever jewel you socket. **21 sockets** on the tree: 15 "basic" + 6 outer-rim **Large Jewel Sockets** that accept Cluster Jewels.
- **Role:** converts tree position into an **itemization slot** — the tree's bridge to the economy. A socket 3 points off your path competes with a notable on your path; jewels let the tree scale with wealth in a way fixed nodes can't. See §5.

### 1g. Ascendancy nodes
- Separate 8-point subtree per subclass (3 per class, 19 total), earned via Labyrinth trials, not tree points. Notables cost 2 points each and are **~4–10× a tree notable's power** (e.g., Necromancer's mistress-of-sacrifice-style effects, Juggernaut's "cannot be stunned"). Design role: class identity and the "you are allowed to build around this" enabler, deliberately outside the shared tree so all seven classes can share one tree without homogenizing.

**Pathing decision model this creates:** every build is a traveling-salesman problem over notables/keystones/sockets where travel nodes are the toll, small nodes are partial refunds, masteries are cluster bonuses, and the answer is never clean — that residue of inefficiency is where "my build" feeling lives.

---

## 2. Stat Vocabulary

### The grammar first (this is PoE's deepest tech)
- **`increased/reduced` = additive** within one big bucket. 50 sources of "increased damage" all sum.
- **`more/less` = multiplicative**, each its own multiplier. The tree hands out *increased* by the hundreds of percent; *more* is reserved almost exclusively for **keystones, masteries, and skill gems** — which is why keystones feel special. A keystone's `40% more` can outvalue 100% `increased` late game because the increased bucket is already at +300%.
- **Added flat damage** (`Adds X to Y Fire Damage`) is rare on the tree (jewels/items own it).
- **Conversion** (`50% of Physical Damage Converted to Fire`) and **gain-as-extra** (`Gain 15% of Physical as Extra Fire`) are the cross-element plumbing; the tree gives these via keystones/masteries (e.g., Fire Mastery: *40% of Physical Damage Converted to Fire Damage*).

### Categories, with representative verified numbers per tier

| Category | Small node | Notable | Keystone/Mastery-grade |
|---|---|---|---|
| Generic damage type (phys/fire/cold/lightning/chaos) | 10–16% increased | 24–40% increased + rider (`Heart of Thunder`: 30% + 6% penetration) | conversion rules, `Avatar of Fire` |
| Attack/spell damage | 8–12% | 20–30% + speed/acc riders | `Pain Attunement` 30% *more* |
| Weapon-conditional (axe/sword/mace/claw/dagger/staff/bow/wand + 1H/2H/dual/shield) | 8–12% dmg and/or 3–4% AS with that weapon | `Destroyer`: *25% increased Physical Damage with Two Handed Melee Weapons; 5% increased Attack Speed...; 25% increased Damage with Ailments...; 25% increased Stun Duration...* | weapon masteries grant rule-changers (Axe Mastery: *Gain 2 Rage on Hit with Axes*) |
| Crit chance | 15–25% increased | 25–100% increased (`King of the Hill`: *100% increased Critical Strike Chance with Bows*) | `RT`/`EO` delete crit entirely |
| Crit multiplier | +8–15% | +25–45% (`Throatseeker` +30%; `Titanic Impacts` +45% 2H) | `Perfect Agony` re-purposes it |
| Attack speed / cast speed | 3–4% / 3–5% | 6–12% | `Hollow Palm`: 40% *more* AS |
| Maximum life | 4–6% increased | 8–10% + flat/regen/res rider (`Discipline and Training`: *+30 to maximum Life; 10% increased maximum Life*) | Life Mastery: *10% more Maximum Life if you have at least 6 Life Masteries allocated* |
| Energy shield | 4–6% increased | 8–18% + rider (`Deep Wisdom`: +20 Int, +20 mana, +20 ES) | `CI`, `EB`, `Ghost Reaver` |
| Mana / regen | 5–10% max, 15–20% regen | `Primal Spirit`: +20 Str/Int, 20% max mana, mana-on-hit rider | `MoM` 40% of damage from mana |
| Regeneration | 0.3–0.5% life/sec | 1–1.6%/sec (`Golem's Blood`) | `Zealot's Oath` redirects it |
| Leech | 0.2–0.4% (jewel-tier) | leech notables 0.4% + "while leeching" riders (`Feed the Fury`: *0.4% of Attack Damage Leeched as Life; 30% increased Damage while Leeching; 15% increased Attack Speed while Leeching*) | `Vaal Pact`, `Ghost Reaver`, Leech Mastery: *5% of Leech is Instant* |
| Elemental resistance | +8–15% single, +5–8% all-res (always a rider, rarely the headline) | `Barbarism`: *8% increased maximum Life; +1% to maximum Fire Resistance; +8% to Fire Resistance* — note **+1% to maximum res** is notable/mastery-tier gold | `Divine Flesh`: +5% max chaos res |
| Armour/evasion | 10–16% increased | 24–40% + hybrid (`Bravery`: 24% Eva&Armour + 8% life) | `Iron Reflexes`, `Transcendence` |
| Block / spell block | +2–3% | +4–6% | `Glancing Blows` doubles it |
| Spell suppression (post-3.16 dex-side defense; replaces dodge) | +4–7% chance | +12% + rider (`Entrench`, `Instinct`) | `Magebane`, `Acrobatics` |
| Aura effect / reservation | 2–4% effect | `Sovereignty`: *12% increased Mana Reservation Efficiency of Skills; 10% increased effect of Non-Curse Auras...*; `Charisma`: 16% efficiency | `Supreme Ego`; Reservation Mastery: *8% increased Damage for each of your Aura or Herald Skills affecting you* |
| Curse effect | 2–5% | `Influence`: 14% effect of auras; curse notables ~10–20% curse effect | `Whispers of Doom` (+1 curse), `Hex Master` |
| Minion stats | Minions deal 8–12% increased | minion notables 20–30% + life/speed riders | `Ancestral Bond`, `Necromantic Aegis`, `Minion Instability` |
| Charges (endurance/frenzy/power) | +stat per charge (4–8%) | `+1 to Maximum X Charges` is the notable-tier prize; "chance to gain on hit/kill" riders | `Inner Conviction`: *3% more Spell Damage per Power Charge; Gain Power Charges instead of Frenzy Charges* |
| Accuracy | +10–15% / flat +100 | `Acuity`: *20% increased Global Accuracy Rating; 6% increased Attack Speed; +100 to Accuracy Rating* | `Precise Technique`: 40% *more* if accuracy > life |
| Area of effect / area damage | 4–8% AoE | `Amplify`: *10% increased Area of Effect; 20% increased Area Damage* | AoE masteries with tradeoffs |
| Projectile behavior | 6–8% proj speed | proj damage 20–30%; chain/pierce/fork live on masteries & clusters | `Point Blank`, `Kineticism` |
| Ailments — chance | 3–6% chance to ignite/freeze/shock | 15% chance + rider (`Cooked Alive`: *15% chance to Ignite; Enemies Ignited by you have -5% to Fire Resistance*) | `Elemental Equilibrium`, `Secrets of Suffering` |
| Ailments — effect/damage | 10–16% increased dmg with bleeding/poison; DoT multi +4–8% (jewel-tier) | +12–15% DoT multiplier (`Growth and Decay`: *Regenerate 1% of Life per second; +12% to Damage over Time Multiplier*), `Bloodletting`: aggravate rider | `Perfect Agony`, `Crimson Dance` |
| Flasks | 6–10% duration/charges | `Profane Chemistry`: *7% increased maximum Life; 30% increased Life Recovery from Flasks; Life Flasks gain 1 Charge every 3 seconds* | Flask Mastery rule-changers |
| Attributes as scaling stat | +10 travel; +20 on "attribute notables" (+30 versions exist) | `Fangs of the Viper`: *+20 to Dexterity; 5% increased Movement Speed; 20% increased Physical Damage; 20% increased Chaos Damage* | `Iron Will`/`Iron Grip` (str→spells/projectiles), Attributes Mastery: *1% increased Damage per 5 of your lowest Attribute* |

### Conditional bonuses — PoE's signature spice
The tree's most interesting numbers are gated on game-state, which converts stats into *playstyle instructions*:
- **"Recently"** (defined as: in the past 4 seconds): `Executioner`: *60% increased Damage with Hits against Enemies that are on Low Life; 15% increased Area of Effect if you've Killed Recently*; `Wind Dancer`'s whole design; `Enduring Composure` (cluster): *Gain 1 Endurance Charge every second if you've been Hit Recently*.
- **"while Leeching"** (`Feed the Fury`), **"on Low Life"** (below 50% — `Pain Attunement`), **"on Full Life"**, **"while stationary"** (`Nature's Patience`), **"per X"** stacking (per charge, per 10 dex, per Grasping Vine, per aura affecting you).
- Design note: conditionals let GGG print bigger numbers safely (60% vs 30%) because uptime <100%, and each conditional implies a rotation, positioning rule, or gear requirement. This is the cheapest depth-per-line tool in the whole system.

---

## 3. Keystone Design — the give and the take

Exact current effect text (verbatim from the passive skill database), with the tradeoff anatomy. The pattern to steal: **the take is absolute and unhedged ("Removes all," "Never," "Cannot") while the give is transformative, not merely large.** Absolute language makes builds legible: you know instantly whether a keystone is for you.

**1. Chaos Inoculation (CI)** — *Maximum Life becomes 1, Immune to Chaos Damage.*
Give: total immunity to one damage type. Take: your entire life pool. Works because it forcibly re-bases you onto Energy Shield — it's an archetype switch disguised as a node, and it makes every +life stat on gear worthless (itemization consequences ripple everywhere).

**2. Resolute Technique (RT)** — *Your hits can't be Evaded. Never deal Critical Strikes.*
Give: 100% hit consistency, ignore accuracy entirely. Take: the whole crit scaling axis. The archetypal "consistency vs. ceiling" fork; also a *budget* keystone — accuracy and crit are expensive, so RT is the poor build's friend. Note the elegance: one line closes an entire stat category on gear and tree.

**3. Elemental Overload (EO)** — *Skills that have dealt a Critical Strike in the past 8 seconds deal 40% more Elemental Damage with Hits and Ailments. Your Critical Strikes do not deal extra Damage. Ailments never count as being from Critical Strikes.*
Give: a huge flat *more* multiplier from token crit chance. Take: real crit scaling. The mid-point between RT and full crit — three keystones neatly partition "how do you feel about crit?" into ignore / fake / commit.

**4. Blood Magic** — *Removes all mana. 10% more maximum Life. Skills Cost Life instead of Mana. Skills Reserve Life instead of Mana.*
Give: never think about mana; one unified resource. Take: your life pool is now also your fuel tank and your aura budget. Deletes a whole UI/gearing concern at the price of safety margin.

**5. Mind Over Matter (MoM)** — *40% of Damage is taken from Mana before Life.*
Give: mana becomes bonus EHP (up to +~67% effective life at the right ratio). Take: none in the text — the cost is *systemic*: you must build unreserved mana and mana recovery, so it taxes auras and sustain. A keystone whose downside is an equation, not a sentence.

**6. Eldritch Battery (EB)** — *Spend Energy Shield before Mana for Skill Mana Costs. Energy Shield protects Mana instead of Life. 50% less Energy Shield Recharge Rate.*
Give: ES becomes a giant mana pool. Take: ES stops protecting life, recharge halved. Famous as a **combo piece** (EB+MoM+CI-adjacent math) — keystones as chemistry set.

**7. Avatar of Fire** — *50% of Physical, Cold and Lightning Damage Converted to Fire Damage. Deal no Non-Fire Damage.*
Give: mono-element purity (stack one resistance-penetration/scaling axis). Take: every non-fire damage source on your gear does nothing. Conversion keystone template.

**8. Point Blank** — *Projectile Attack Hits deal up to 30% more Damage to targets at the start of their movement, dealing less Damage to targets as the projectile travels farther.*
Give/take fused into one curve: range → damage slider. It rewrites a ranged archetype's positioning to melee-adjacent. The rare keystone whose tradeoff is *spatial* rather than statistical.

**9. Unwavering Stance** — *Cannot Evade enemy Attacks. Cannot be Stunned.*
Give: stun immunity (a keystone-tier QoL/defense). Take: evasion axis deleted. Two symmetric absolutes; reads like a proverb. Historically the anchor of the armour-side rim.

**10. Pain Attunement** — *30% more Spell Damage when on Low Life.*
Give: massive multiplier. Take: you must *stay* below 50% life on purpose — the downside is a self-imposed state, enabling a whole "low-life" archetype built from items that reserve life (Coward's Legacy, etc.). Keystone as archetype seed.

**11. Ghost Reaver** — *Leech Energy Shield instead of Life. Maximum total Energy Shield Recovery per second from Leech is doubled. Cannot Recharge Energy Shield.*
Give: ES gets leech (normally life-only). Take: loses its native recharge. Swaps one recovery paradigm for another — the "recovery identity" family.

**12. Vaal Pact** — *Life Leech from Melee Damage is Instant. Cannot Recover Life other than from Leech.*
Give: instant leech (the strongest recovery in the game while attacking). Take: flasks/regen do nothing — stop attacking and you die. The purest "power for fragility-when-passive" contract; nerfed repeatedly because instant recovery is the most dangerous thing you can print.

**13. Iron Reflexes** — *Converts all Evasion Rating to Armour. Dexterity provides no bonus to Evasion Rating.*
Give: hybrid gear becomes pure armour (smoothed mitigation). Take: the evasion layer and dex's implicit. Conversion-of-defense template; lets dex-side gear serve str-side philosophy.

**14. Acrobatics** *(post-3.16 text)* — *Modifiers to Chance to Suppress Spell Damage instead apply to Chance to Dodge Spell Hits at 50% of their value. Maximum Chance to Dodge Spell Hits is 75%.*
*(Historical pre-3.16 Acrobatics — the beloved version: ~30% Chance to Dodge Attack Hits, at the cost of 30% less Armour, Energy Shield, and Block — with its partner keystone Phase Acrobatics granting 30% Chance to Dodge Spell Hits. The pair was removed when dodge was folded into Spell Suppression in 3.16.)* Design value of the old pair: a *chained* keystone — the second only made sense after the first, creating a two-step commitment path down the dex rim.

**15. Ancestral Bond** — *You can't deal Damage with Skills yourself. +1 to maximum number of Summoned Totems.*
Give: +1 totem. Take: **you personally deal zero damage.** The most radical archetype gate in the game — it doesn't modify your build, it forbids every other build. Totem archetype exists because of this node.

**16. Elemental Equilibrium (EE)** — *Hits that deal Elemental Damage remove Exposure to those Elements and inflict Exposure to other Elements. Exposure inflicted this way applies -25% to Resistances.*
Give: -25% enemy res to elements you *don't* hit with. Take: none listed — the cost is choreography: you need a trigger skill of one element and a payoff skill of another. A keystone that creates two-skill combo gameplay from one line. Beloved by minion/trap builds (you proc it, minions profit).

**17. Perfect Agony** — *Damage over Time Multiplier for Ailments is equal to Critical Strike Multiplier. Critical Strikes do not deal extra Damage. Non-Critical Strikes cannot inflict Ailments.*
Give: your whole crit-multi investment now scales bleed/poison/ignite. Take: crits stop doing hit damage AND non-crits stop applying ailments (double bind). Stat-conversion keystone: makes one gear axis serve a different archetype.

**18. Crimson Dance** — *You can inflict Bleeding on an Enemy up to 8 times. Your Bleeding does not deal extra Damage while the Enemy is moving and cannot be Aggravated. 50% less Damage with Bleeding.*
Give: 8 stacks (4× throughput at full ramp, sustained-DPS style). Take: per-stack halved and the "moving target" burst mechanic deleted. Converts bleed from burst-on-movement to ramping stacks — same ailment, different rhythm. Keystone as *tempo* choice.

**19. Wind Dancer** — *20% less Attack Damage taken if you haven't been Hit by an Attack Recently. 10% more chance to Evade Attacks if you have been Hit by an Attack Recently. 20% more Attack Damage taken if you have been Hit by an Attack Recently.*
A three-line state machine: strong while clean, briefly evasive after a hit, punished if hits keep landing. Defense with narrative rhythm; evasion-flavored "don't get chain-hit."

**20. The Agnostic** — *Removes all Energy Shield. While not on Full Life, Sacrifice 20% of Mana per Second to Recover that much Life.*
Give: mana becomes a life-recovery engine. Take: ES gone. Pairs conceptually with MoM (mana as defense) — one flat pool conversion, one flow conversion.

**21. Supreme Ego** — *Auras from your Skills can only affect you. Aura Skills have 1% more Aura Effect per 2% of maximum Mana they Reserve. 40% more Mana Reservation of Aura Skills.*
Give: selfish aura power (huge effect scaling). Take: your party/minions get nothing and reservation costs balloon. Anti-support keystone — carves "aura-stacker" out of "aurabot."

**22. Wicked Ward** — *Energy Shield Recharge is not interrupted by Damage if Recharge began Recently. 40% less Energy Shield Recharge Rate.*
Give: recharge can't be interrupted (reliability). Take: recharge is slower (throughput). The purest "consistency vs. rate" micro-tradeoff.

**23. Zealot's Oath** — *Life Regeneration is applied to Energy Shield instead.*
One line, no explicit downside — the take is implicit: your life regen is gone. Redirection keystones (regen→ES) are the cheapest to author and enormously build-enabling.

**24. Glancing Blows** — *Chance to Block Attack Damage is doubled. Chance to Block Spell Damage is doubled. You take 65% of Damage from Blocked Hits.*
Give: cap block trivially. Take: block only prevents 35%. Converts block from binary (all-or-nothing) to smoothed mitigation — "twice as often, a third as good." Textbook variance-reduction keystone.

**25. Iron Will / Iron Grip** — *Strength's Damage bonus applies to all Spell Damage as well* / *...applies to Projectile Attack Damage as well as Melee Damage.*
Pure givers with a *positional* cost (deep in str territory, far from spell/bow clusters). Attribute-bridging keystones: they make the "wrong" third of the tree viable for your archetype — topology as the balancing cost.

Also notable as templates: **Minion Instability** (*Minions Explode when reduced to Low Life, dealing 33% of their Life as Fire Damage...* — turns a defensive stat pool into a weapon), **Necromantic Aegis** (*All bonuses from an Equipped Shield apply to your Minions instead of you* — item-slot redirection), **Runebinder**, **Precise Technique** (*40% more Attack Damage if Accuracy Rating is higher than Maximum Life; Never deal Critical Strikes* — a keystone keyed to a **gearing inequality**, brilliant), **Divine Flesh / Corrupted Soul / Strength of Blood / Transcendence / Inner Conviction** etc. from Timeless Jewels (§5), and cluster-jewel keystones like **Hollow Palm Technique** (*You count as Dual Wielding while you are Unencumbered; 40% more Attack Speed...; Adds 14 to 20 Attack Physical Damage to Melee Skills per 10 Dexterity while Unencumbered* — a keystone that *empties two item slots* and pays you in attribute scaling).

**Keystone placement is half the design:** keystones sit at the far edge of the region whose playstyle they serve, or provocatively *between* regions (MoM at the Witch/Templar border, Point Blank in bow country). Reaching one costs 3–8 travel points from the nearest highway — so a keystone is priced, not free, and rushing one at level 30 vs. 70 is a real leveling decision. GGG has also repeatedly *promoted* keystones between tiers (3.11: moved the five most popular Timeless-Jewel keystones — The Agnostic, Glancing Blows, Supreme Ego, Wind Dancer, Eternal Youth — onto the tree proper and minted five new jewel-exclusive ones; 3.17 removed Mortal Conviction). The keystone roster is a living balance surface.

---

## 4. Tree Topology

- **One shared tree, seven start locations.** The tree is a rough circle around a central wheel. Marauder starts due-southwest (pure Str), Witch due-north (pure Int), Ranger southeast (pure Dex); Duelist (Str/Dex), Templar (Str/Int), Shadow (Dex/Int) start on the borders; **Scion starts dead center** and can go anywhere (her flexibility *is* her class identity). Class = starting coordinates + ascendancy options, nothing more — any class can eventually path anywhere.
- **Three attribute thirds.** Blue/north = Int: spell damage, ES, minions, wands, crit-for-spells, mana, auras. Red/southwest = Str: melee physical, armour, life-adjacent bulk, maces/axes, endurance charges. Green/southeast = Dex: bows, evasion, speed, crit-for-attacks, projectiles, frenzy charges. Border zones hybridize (Shadow country = crit + chaos/DoT; Templar country = ele-attack + hybrid defense; Duelist country = versatile melee). This gives the featureless graph *geography* — players say "up by the Witch" or "down in Duelist" like place names.
- **Clusters ("suburbs"):** 2–4 smalls gating a notable + (post-3.16) a mastery, thematically named and iconographed. **Highways ("roads"):** chains of +10 attribute travel nodes connecting cluster neighborhoods; major highways ring the inner wheel and radiate outward.
- **The outer rim** holds the most extreme dedications: keystones, the 6 Large (cluster-jewel) sockets, and specialist wheels. Power density rises with distance from start — the rim is where builds go "all-in," and cluster jewels literally extend the map outward from it.
- **Numbers that create the tension:** 1,325 nodes, ~123 points, so **~9% coverage**. A typical build spends roughly 15–25% of points on pure travel; efficient routing is a skill. Distance-as-cost does three jobs at once: (1) balances strong nodes without nerfing them (move them further), (2) makes hybrid builds pay a "diagonal tax" for crossing thirds, (3) creates the respec economy (Orbs of Regret / quest refund points / gold respec) as a real resource.
- **Escape hatches (added over the years, each a lesson):** anoints (buy any one notable), Passage jewels (allocate disconnected nodes in a radius — Intuitive Leap, Thread of Hope, Impossible Escape), Tattoos (3.22+: overwrite a travel node's stat, up to 50 per character — directly monetizing the dead-node complaint), Forbidden Flame/Flesh jewel pair (steal an ascendancy notable from another class). Every one of these is GGG paying down the same debt: *distance is a great cost until it's a dead cost.*

---

## 5. Jewels

### 5a. Normal jewels
Three droppable bases — **Crimson** (str-region mod pool), **Viridian** (dex), **Cobalt** (int) — plus unique-only **Prismatic** (all pools). Socketed into the 15 basic tree sockets; freely removable. Special affix rules: **no item level requirement, no tiers, rare = max 4 affixes (2 prefix + 2 suffix)** — deliberately flat so jewels are a stable, craftable stat vocabulary. Representative ranges (verbatim from the mod tables):
- Prefixes: `(5–7)% increased maximum Life` (the chase mod), `(14–16)% increased <weapon/element> Damage`, `(6–8)% increased Attack Speed with <weapon>`, `(14–18)% increased Armour`/`Evasion`, `(6–8)% increased maximum Energy Shield`, `Minions deal (14–16)% increased Damage`, `(12–16)% increased Totem Damage`.
- Suffixes: `+(12–16)` single attribute / `+(6–8) to all Attributes`, `+(12–15)%` single res / `+(8–10)% to all Elemental Resistances`, `(3–5)% increased Attack Speed`, `(8–12)% increased Global Critical Strike Chance`, `+(9–12)% to Global Critical Strike Multiplier`, `(16–20)% increased Damage with Poison/Bleeding`, `+(6–8)% to <type> Damage over Time Multiplier`, `(0.2–0.4)% of Physical Attack Damage Leeched as Life`, `+(1–2)% to maximum Fire/Cold/Lightning Resistance` (rare weighting).
A 4-mod rare jewel ≈ a strong notable+small, i.e., **a jewel socket 1–2 points off-path is worth taking; 3+ is a debate** — exactly the tension you want.

### 5b. Radius (unique) jewels
Radius sizes are standardized: Small 800, Medium 1200, Large 1500, Very Large 2000, Massive 2400 (ring variants exist). These read *the nodes around their socket* — position becomes part of the item:
- **Attribute transformers** (all corrupted-only, Small radius): `Brute Force Solution` — *+(16–24) to Intelligence; Strength from Passives in Radius is Transformed to Intelligence.* Same template ×6: `Fertile Mind` (Dex→Int), `Careful Planning` (Int→Dex), `Fluid Motion` (Str→Dex), `Efficient Training` (Int→Str), `Inertia` (Dex→Str). These turn dead travel highways into stat-stacking fuel — the fix for dead nodes that *creates* builds.
- **Defense transformers:** `Energised Armour` — *(15–20)% increased Armour; Increases and Reductions to Energy Shield in Radius are Transformed to apply to Armour at 200% of their value*; `Energy From Within` (Life→ES); `Healthy Mind` (Life→Mana at 200%). Note the 200% multipliers: transformation jewels overpay to justify the contortion.
- **Counting jewels:** `Might in All Forms` — *Dexterity and Intelligence from passives in Radius count towards Strength Melee Damage bonus.* `Inspired Learning` — *With 4 Notables Allocated in Radius, when you Kill a Rare monster, you gain 1 of its Modifiers for 20 seconds.*
- **Rule-changers:** `Might of the Meek` — *50% increased Effect of non-Keystone Passive Skills in Radius; Notable Passive Skills in Radius grant nothing.* `Unnatural Instinct` — *Allocated Small Passive Skills in Radius grant nothing; Grants all bonuses of Unallocated Small Passive Skills in Radius.* `Split Personality` — *This Jewel's Socket has 25% increased effect per Allocated Passive Skill between it and your Class' starting location* (rewards **inefficient** pathing — a deliberate inversion). `Pure Talent` — grants a bonus per class start your tree touches. `Lioneye's Fall` — *Melee and Melee Weapon Type modifiers in Radius are Transformed to Bow Modifiers.*
- **Passage jewels:** `Intuitive Leap` (Small radius) — *Passive Skills in Radius can be Allocated without being connected to your tree*; `Thread of Hope` — same but in a **ring** (pay: *-(20–10)% to all Elemental Resistances*); `Impossible Escape` — *Passives in Radius of <specific Keystone> can be Allocated without being connected to your tree* (the keystone itself excluded). These sell *topology itself* as an item stat.

### 5c. Threshold jewels
Template: *"With at least 40 <Attribute> in Radius, <specific skill> gains <behavior change>"* (e.g., Glacial Hammer splash). Attributes in radius count **whether or not allocated** — so socket position, not build, is the requirement. Historically important, now mostly retired: 3.23 folded skill-modifying jewels into Transfigured Gems, GGG explicitly calling threshold jewels one of three systems "trying to subtly modify the behaviour of skills" that deserved one unified home. Survivors like `Combat Focus` ("With 40 total Dex and Int in Radius, Elemental Hit cannot choose Cold") and `Unending Hunger` remain. **Lesson: skill-behavior mods on tree-position items were a cool idea that lost to a cleaner delivery mechanism.**

### 5d. Cluster jewels (3.10+)
Socket into the 6 outer-rim Large sockets; they **append new subtrees to the tree**:
- **Large Cluster Jewel:** adds 8–12 passives, up to 3 notables (2 prefixes + 1 suffix), and always 2 **Medium sockets** (via enchant). Its enchant sets the small-passive stat (e.g., "Added Small Passive Skills grant: 12% increased Fire Damage").
- **Medium:** 4–6 passives, up to 2 notables, 1 **Small socket**. Themes are narrower (aura effect, DoT, curse, minion...).
- **Small:** 2–3 passives, 1 notable. Narrowest themes (e.g., life recovery, charge duration).
- Socket-in-socket nesting: Large → 2 Medium → each 1 Small; a fully nested rim socket can consume 20+ points. Optimal bases are 8-passive Large / 4–5 Medium / 2 Small (fewest filler smalls per notable — note that **the same "smalls gate notables" economy is preserved**, and item rolls determine how much filler you must buy).
- Unsocketing refunds all points spent inside (jewel respec is free by design).
- Notables are jewel-exclusive and craftable — examples: `Fettle` (*10% increased maximum Life; +20 to maximum Life* — deliberately ≈ tree's Constitution), `Widespread Destruction` (*20% increased Elemental Damage; 6% increased Area of Effect*), `Purposeful Harbinger` (*Auras from your Skills have 8% increased Effect on you for each Herald affecting you, up to a maximum of 40%* — the 3.10 balance disaster that taught GGG to cap stacking notables; duplicates share limits by rule). Some rolls add **keystones** (`Hollow Palm Technique`). `Voices` (unique Large) adds only empty sockets + blank smalls — pure meta-currency for jewel-stacking builds.
- **Design takeaway:** cluster jewels made the *tree itself* craftable loot — the tree's edge became an itemization surface with the full rare/unique/craft economy attached, at the cost of PoB-style optimization sprawl.

### 5e. Timeless Jewels (3.7+) — deterministic tree rewriting
Five unique jewels (Large radius, limit 1 "Historic"). Each carries a **seed** (a number) and a **name** (one of three historical figures). Mechanics:
- **Seed** deterministically transforms every small + notable in radius (same seed = identical result, always; Divine Orb rerolls seed+name). Seed ranges: Glorious Vanity 100–8000; Lethal Pride 10000–18000; Brutal Restraint 500–8000; Militant Faith 2000–10000; Elegant Hubris 2000–160000 (steps of 10).
- **Name** deterministically replaces any **keystone** in radius with a specific jewel-exclusive keystone.
- Transformed nodes are **"Conquered"** — immune to further modification by other radius jewels (a rules firewall that keeps the composition sane).

| Jewel (legion) | Keystone by name | Small/notable transformation |
|---|---|---|
| **Glorious Vanity** (Vaal) | Ahuana→`Immortal Ambition`, Doryani→`Corrupted Soul` (*50% of Non-Chaos Damage taken bypasses ES; Gain 15% of Maximum Life as Extra Maximum ES*), Xibaqua→`Divine Flesh` (*All Damage taken bypasses ES; 50% of Elemental Damage taken as Chaos Damage; +5% to maximum Chaos Resistance*) | **Full reroll** — the chaotic one. Smalls become random picks from a fixed pool (e.g., *(7–12)% increased Fire Damage*, *(2–4)% increased maximum Life*, *(3–4)% increased Attack Speed*, *3% chance to Avoid Elemental Ailments*); notables become "Might/Legacy of the Vaal" bundles of 3–4 random stats. Players brute-force seeds for god-rolls. |
| **Lethal Pride** (Karui) | Akoya→`Chainbreaker`, Kaom→`Strength of Blood` (*Life Recovery from Non-Instant Leech is not applied; 2% additional Physical Damage Reduction for every 3% Life Recovery per second from Leech*), Rakiata→`Tempered by War` (*50% of Cold and Lightning Damage taken as Fire; 50% less Cold and Lightning Resistances*) | **Additive** — travel smalls +2 Str, other smalls +4 Str; every notable keeps its effect and gains one seeded bonus from a pool: *+20 to Strength; 5% chance to deal Double Damage; 4% increased maximum Life; +1 to maximum Fortification; You take 10% reduced Extra Damage from Critical Strikes; 20% increased Melee Damage...* |
| **Brutal Restraint** (Maraketh) | Asenath→`Dance with Death`, Balbala→`The Traitor` (*Flasks Gain 4 Charges per empty Flask Slot every 5 seconds*), Nasima→`Second Sight` | Additive, Dex-flavored: +2/+4 Dex on smalls; notable bonus pool: *+20 to Dexterity; 5% increased Attack and Cast Speed; 5% increased Movement Speed; 20% increased Damage with Poison; 25% increased Critical Strike Chance...* |
| **Militant Faith** (Templar) | Avarius→`Power of Purpose` (*80% of Maximum Mana is Converted to twice that much Armour*), Dominus→`Inner Conviction`, Maxarius→`Transcendence` (*Armour applies to Fire/Cold/Lightning from Hits instead of Physical; -15% to all maximum Elemental Resistances*) | **Currency-izing**: travel nodes → *+10 to Devotion*, smalls +5 Devotion; notables either +5 Devotion or replaced by Templar notables gated on **150+ Devotion** (e.g., *+1% to all maximum Resistances*, *+1 to Minimum Endurance/Frenzy/Power Charges*, *15% of Physical Converted to Fire*). The jewel itself carries two seeded "per 10 Devotion" payoffs (e.g., *1% increased effect of Non-Curse Auras per 10 Devotion*, *4% increased Elemental Damage per 10 Devotion*). A bespoke stacking currency invented by one item. |
| **Elegant Hubris** (Eternal Empire) | Cadiro→`Supreme Decadence`, Caspiro→`Supreme Ostentation` (*Ignore Attribute Requirements; Gain no inherent bonuses from Attributes*), Victario→`Supreme Grandstanding` | **All-or-nothing**: smalls grant *nothing*; every notable replaced by an oversized Eternal notable — *80% increased Spell Damage / Melee Physical / Evasion; +40% to Critical Strike Multiplier; 10% increased maximum Life; +12% Chance to Block; 10% increased Damage per Endurance/Frenzy/Power Charge...* Fewer, fatter payoffs — you path through blanks to giant nodes. |

**Why Timeless Jewels matter as design:** deterministic seeds made a randomized item into a *searchable puzzle* (community seed-calculators are core tooling); each of the five expresses a different transformation philosophy (reroll / augment / currency / blank-and-boost); and keystone-by-name lets one item slot carry fifteen extra keystones without permanent tree bloat. The 3.11 promotion of the five most-loved jewel keystones onto the real tree shows the jewel pool doubling as a **keystone incubator**.

---

## 6. The Mastery System (3.16 "Scourge")

**Mechanics:** every cluster outside class start areas contains one Mastery node (icon-typed: Life, Fire, Two Hand...). It is allocatable only after you allocate **a notable in that cluster via real pathing** (anointed/Intuitive-Leap notables don't count). It costs 1 point and opens a menu of ~6 effects shared by all clusters of that type; **each effect can be chosen only once per character** even from different clusters of the same type. There are ~61 mastery groups today. Radius jewels ignore mastery nodes entirely.

Representative menus (verbatim):
- **Life Mastery:** *10% more Maximum Life if you have at least 6 Life Masteries allocated · 15% increased maximum Life if there are no Life Modifiers on Equipped Body Armour · +30 to maximum Life · You count as on Low Life while at 55% of maximum Life or below · You count as on Full Life while at 90% of maximum Life or above · Skills Cost Life instead of 15% of Mana Cost*
- **Fire Mastery:** *Fire Exposure you inflict applies an extra -5% to Fire Resistance · 40% of Physical Damage Converted to Fire Damage · Burning Enemies you kill have a 3% chance to Explode, dealing a tenth of their maximum Life as Fire Damage · +12% to Fire DoT Multiplier; 50% increased Ignite Duration on you · Regenerate 1 Life per second for each 1% Uncapped Fire Resistance · Critical Strikes do not inherently Ignite; 100% increased Damage with Hits against Ignited Enemies*
- **Leech Mastery:** *5% of Leech is Instant · 40% increased Armour and Evasion while Leeching · 25% more Damage with Hits against Enemies that cannot have Life Leeched from them · ...*

**What problems it solved:**
1. **Redundant clusters.** Before 3.16, three life clusters were interchangeable bags of "% life." Masteries make cluster *identity* matter less and cluster *count* matter more subtly (you can only take each option once — your third life cluster offers a different pick than your first), and they let two characters take the same clusters and exit with different builds.
2. **Niche stats without dead weight.** GGG's stated rationale: many niche passives existed for a few builds but were tree clutter for everyone else. Masteries moved niche/rule-change effects (*Corrupted Blood cannot be inflicted on you*, *You count as on Low Life at 55%*) into opt-in menus, so the physical tree could be pruned while total expressiveness grew.
3. **Dead travel relief.** Every cluster now carries a potential bonus payoff, so "pathing through" a mediocre cluster hurts less — the mastery is a rebate on cluster entry.
4. **A safe home for `more` multipliers and rule-changers** at 1-point cost but strict once-each/notable-gated access.

**What it cost (honest ledger):** masteries transferred power from *visible geography* to *hidden menus* — the tree got less legible at a glance (you can't screenshot a build's masteries), some picks became so mandatory they were "the real node" (3.19 and 3.21 rebalanced/reworked half of them, e.g., reservation-efficiency masteries nerfed), and pick-once-per-type is a rule players discover by bumping into it. Net: universally considered the best tree change GGG shipped, but it works *because* the underlying cluster/notable skeleton already existed — it's a payoff layer, not a foundation.

---

## 7. Design Lessons

### Why it's beloved
1. **Build identity through subtraction.** The best nodes remove options (`Ancestral Bond`, `CI`, `RT`). A build is defined by what it *can't* do; absolute keystone language ("Never," "Removes all") makes identity legible and bragging-rights-worthy.
2. **Distance is the master cost.** One mechanism — travel nodes — simultaneously prices power, differentiates classes (same tree, different distances), enables balance-by-relocation, and generates the routing puzzle. Cheap to author, infinitely deep.
3. **The tree is a *commitment device*, not a menu.** Respec scarcity (regrets/quest refunds/gold) means choices are sticky; planning matters; the ~123-of-1325 ratio guarantees no build is "complete," so there's always a next tradeoff.
4. **Stat grammar with reserved words.** increased vs. more is the load-bearing wall: the tree can shower players in "increased" without breaking the game because multipliers are rationed to keystones/masteries/gems. Any PoE-like needs its equivalent of a *protected multiplier tier*.
5. **Conditionals turn stats into playstyle.** "Recently"/"while leeching"/"on Low Life"/"per X" are the cheapest depth in the genre — bigger numbers, built-in gameplay instructions, natural archetype hooks.
6. **The tree is an itemization surface.** Jewel sockets, cluster jewels, Timeless seeds, anoints, tattoos, Passage jewels — position, topology, and even *dead nodes* were progressively converted into economy-facing content. The tree kept a 12-year-old game fresh because it was never finished, only re-monetized as design space.
7. **The first five minutes sell the game.** GGG (Chris Wilson, Josh Strife Hayes interview) knows the wall of 1,325 nodes is intimidating — and deliberately keeps it visible because the tree is *the promise of depth*, and hiding it would be "a bait-and-switch"; their data showed players quit when a game that looked simple turns complex later. The overwhelm is a feature at the marketing layer and a bug at the onboarding layer, and they consciously chose which layer wins.

### What it's criticized for (each with the mitigation GGG eventually shipped — a roadmap of predictable failure modes)
1. **The life tax.** For most of PoE1's life, every non-CI build spent ~20–25 points on the same 5–10% life nodes (targeting ~150–200% increased life) before "the build" began. Real choice budget was ~90 points, not 123. *Mitigations:* 3.16 defensive rework spread survivability across masteries/suppression; PoE2 later removed +life nodes entirely — GGG's own verdict on the tax. **Lesson: any stat that is mandatory for everyone isn't a choice; either bake it into levels or make defense archetypes genuinely divergent.**
2. **Dead travel nodes.** +10 attribute nodes are accepted as pure toll ~90% of the time. GGG spent a decade re-injecting value: attribute-transform jewels (2015), Timeless additive jewels (2019), Tattoos (2023), attribute-stacking archetypes. **Lesson: if you use dead nodes as pricing, plan from day one for systems that can re-activate them — they're your future expansion real estate.**
3. **Illusion of choice / solved tree.** With community tools (Path of Building), optimal routing per archetype is a lookup; most players paste a build. The tree's combinatorial space is astronomically larger than its *viable* space, and notables within a theme are often interchangeable stat bags (pre-mastery especially). **Mitigations: masteries (pick-once forces divergence), cluster jewels (economy-randomized notables resist solving), Timeless seeds (per-item solutions).** Lesson: raw node count doesn't create choice; *non-transitive tradeoffs and per-character randomness* do.
4. **Overwhelming for new players.** Acknowledged openly by Wilson; the team was internally split between simplifying the early view vs. keeping the iconic wall. Search/highlight tooling, default recommended paths, and the "suburbs and roads" mental model are the compromises. **Lesson: ship the mental model (three thirds, clusters vs. roads, keystones as landmarks) inside the UI, not just the nodes.**
5. **Balance whack-a-mole at the systems seam.** Every tree-modifying system multiplies against every other (Purposeful Harbinger aura-stacking 3.10; reservation masteries 3.19). GGG's standing fixes: stacking caps written into node text, "Conquered nodes can't be re-modified," limit-1 Historic jewels. **Lesson: when the tree becomes writable by items, ship composition firewalls in v1.**
6. **Power creep ratchets via QoL.** Anoints, masteries, tattoos each individually reasonable, collectively gave every character ~10+ points of free value, forcing content/monster rebalance. **Lesson: point-economy inflation is the tree's hidden currency — track it like you track drop rates.**

### The distilled recipe (if you're building one)
A PoE-like tree needs, in priority order: (1) a **protected multiplier tier** and strict additive grammar; (2) **~15–25 keystones** that each delete an option in absolute language and are placed far apart; (3) a **cluster economy** (cheap filler gating a named payoff) with a mastery-style rebate layer so no path is pure loss; (4) **distance pricing** via near-worthless connective nodes *plus a pre-planned system that later makes them matter*; (5) **jewel sockets from day one** — the tree's future content pipeline is worth more than its launch content; (6) a point budget that covers **under ~12%** of the graph so scarcity, not unlocking, is the emotion.

---

**Sources:** poewiki.net (Passive skill, Keystone, Mastery, Jewel, Cluster jewel, Timeless Jewel + individual jewel pages, Threshold jewel — node/item effect text pulled verbatim from the poewiki Cargo database) · pathofexile.com Passive Skill Tree ("a vast web of 1325 skills") · 3.16.0 Patch Notes · Chris Wilson × Josh Strife Hayes design interview (GGG news post) · Massively OP Scourge masteries coverage · Maxroll "Passive Skill Tree for Beginners".

*Reliability notes: effect text reflects ~3.25–3.28 balance as of July 2026. The pre-3.16 Acrobatics/Phase Acrobatics text is reconstructed from history and marked as such. Typical-life-tax percentages are community-consensus figures, not GGG-published numbers.*
