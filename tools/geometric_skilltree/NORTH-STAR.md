# NORTH STAR — The Geometric Passive Tree Overhaul (Verdigris)

**This document is the standing prompt for a goal-loop coding session.** Read it fully
before touching code. It defines the mission, the design law, the mechanics specs, the
implementation phases, and the working rules. When in doubt, re-read the Design Law
section and the Anti-Goals. This document outranks improvisation; if you believe a spec
is wrong, write your objection into `OVERHAUL-LOG.md` and make the smallest reasonable
decision — do not silently redesign.

---

## 0. Mission

Transform `tools/geometric_skilltree/` from a procedurally-populated geometric demo into
a **polished, balanced, fully authored passive skill tree** for **Verdigris** (the
flagship RPG; bronze-age, low-fantasy, PoE-grade itemization — see
`tools/rpg_inventory/DESIGN.md`). At the same time, **commit rpg_inventory to a real
offense/defense stat system** (layered mitigation, PoE-style) so the tree has something
real to modify, and build the **designer/annotation UI** needed to author and balance
the tree seat by seat.

Definition of done (the whole loop is finished when ALL of these hold):

1. The lattice has **ten rings** (331 main nodes) so every straight center-to-rim spoke
   has an exact midpoint node at ring 5.
2. **Zero hash-generated content remains.** Every node on the tree is authored data
   with a unique reason to exist. No repeating filler, no nonsense nodes.
3. The **pattern-bonus system** (loops, waves, flows, meridians, orbits, symmetry,
   circuits) is implemented per the spec in §5, tested, and visible in the UI.
4. **Jewel sockets** exist on the tree and at least five jewel families work end to end,
   including a seeded saga-stone (Timeless-style) transform.
5. **Class milestone nodes** exist and at least item-slot/item-type unlock hooks are
   wired (real integration with rpg_inventory's pack where feasible).
6. The shared **stat registry + combat resolution module** exists, is unit-tested, and
   both the tree UI and `verdigris-pack.js` consume it. The tree UI shows headline
   numbers (effective HP, DPS vs standard foe) and per-click deltas.
7. **Designer mode** (annotation, status tracking, lint, heatmaps, export) works and the
   authored tree data was produced through it.
8. A **balance pass** ran: budget lint clean, leveling-cadence simulation meets the
   milestone targets in §9, and the results are logged.
9. All tests green (`node tools/geometric_skilltree/tests/*.test.mjs`), README updated,
   `OVERHAUL-LOG.md` tells the story of what was done and why.

---

## 1. Where everything lives (read these first)

| Path | What it is |
|---|---|
| `tools/geometric_skilltree/index.html` | The entire tree app (~4k lines, single file): `GeometricSkillTree`, `SVGRenderer`, `UIController`, `ViewController`, plus all data constants |
| `tools/geometric_skilltree/README.md` | Current feature set + design rules; keep updated |
| `tools/geometric_skilltree/tests/progression.test.mjs` | Existing test harness (imports `assets/progression.mjs`) |
| `tools/rpg_inventory/DESIGN.md` | Vesselforge item system — the itemization the tree must marry |
| `tools/rpg_inventory/core/verdigris-pack.js` | Content pack: materials, forms, mods, `derive()` character sheet — the placeholder stat sheet you will replace |
| `tools/rpg_inventory/core/vesselforge.js` | Pure item-logic engine (UMD, no deps) — the model to follow for the new stats module |
| `tools/rpg_inventory/core/BASE-DESIGN.md` | Item class ladders (weapon/armour classes) — needed for class-node unlocks |

Load-bearing facts about the current implementation:

- `MAIN_RING_DEPTH = 9`; hex lattice in axial coords; `hexDistance` ring math;
  `axialToPixel` rotates so INT reads up, DEX bottom-left, STR bottom-right.
- Single point pool `START_POINTS = { skill: 123 }` (100 levels + 23 quests). **Nodes
  cost 1 and conduits cost 1** — travel distance is the build cost.
- Every adjacent node pair gets a `Conduit` with **two curved arc variants**
  (`makeOption`, sides -1/+1 = "inner"/"outer"), each with its own STR/DEX/INT mix.
  Conduits are the attribute layer; nodes are the effect layer. **This dual-arc choice
  is the signature mechanic — the wave/flow system in §5 is built on it.**
- Seat logic is `nodeTypeFor(q, r, ring)`: gateways at rim corners, keystones at rings
  6/8, masteries on primary half-axes at rings 3/5/7, notables at modular seats,
  everything else "small".
- **The redundancy you are killing is structural**: small-node effects are
  hash-assigned from `NODE_EFFECTS` (FOUR effect templates per axis), notables from
  `NOTABLES` (nine per axis), via `(q*17 + r*31 + ring*7) % pool.length`. 271 nodes
  drawing from ~16 small templates = the same "+9% melee damage" dozens of times. The
  fix is not editing pools — it is **replacing generation with authored data** (§7).
- Shape bonuses today (`computeShapeBonuses`): loop crowns (r1–3 rings around an
  allocated center, `detectCompletedLoop`), straight axis chains (only the three
  primary half-axes from origin, ≥4 segments), mirror symmetry (≥5 pairs across the
  vertical axis), redundant circuits (`hasAlternateActiveRoute`). Loop empowerment
  boosts the center node's own stat and adds attribute resonance (`getNodeBoost`).
- Six outer subtrees (`SUBTREES`) attach at rim-corner gateways — **gateway coords are
  hardcoded at ±9 and must move to ±10** when the ring is added.
- Base character sheet (`BASE_CHARACTER`) is a flat additive stat list — life, mana,
  armour, evasion, ES, four damage channels, speeds, crit, resists, block, CDR — with
  attribute-to-derived conversion hardcoded in `computeStats`. This whole layer gets
  replaced by the shared stat engine (§4).
- The app must keep working from `file://` (open `index.html` directly; gh-pages
  hosting). **No build step, no fetch() for data.** New data files must load as classic
  `<script src>` globals (e.g. `assets/tree-data.js` defining `window.TREE_DATA`) or
  stay inline. Test files may import `.mjs` modules (Node context).
- `tools/rpg_inventory/core/verdigris-pack.js` `derive()` currently returns only
  `life, spirit, ward, damage, move, goods, resEmber, resRiver` — this is the
  placeholder you are replacing with §4.

---

## 2. Design Law (the pillars — every decision passes through these)

1. **Every point is a promise.** A player levelling up should look forward to the next
   skill point. Every single allocation must visibly move a headline number (EHP, DPS,
   speed, a new capability) or complete/advance a visible pattern. If a node exists
   only to be walked through, it must at least be a conduit choice that feeds a
   pattern. Nothing on the tree is filler.
2. **Geometry is the language.** PoE gets emergence from 1,300 nodes; we get it from
   patterns on ~331. Loops, waves, flows, orbits, mirrors, meridians — the *shape* of
   an allocation is a build statement. Two builds with the same nodes but different
   shapes should play differently.
3. **Tension, not addition.** Every mechanic must compete for the same scarce points
   and the same conduits. Waves and flows are mutually exclusive on the same segments
   by definition. Loops want compact closed shapes; waves want long lines; symmetry
   wants global discipline. A "fivehead" build is one that resolves these tensions
   cleverly, not one that stacks everything.
4. **Tradeoffs make identity.** Keystones and Signs follow the PoE law: a
   build-defining gift AND a real price. No free ultimates. The price must be a rule
   change a player can build around, not a number tax.
5. **The tree serves the items and the items serve the tree.** Stat vocabulary is
   shared with rpg_inventory (one registry, §4). Jewels are *items* socketed into the
   tree. Class nodes unlock item slots/types. Neither system makes sense alone.
6. **Original voice.** Study PoE structure, never copy PoE names or exact numbers.
   Verdigris is bronze-age, low-fantasy: wards and rites, not "energy shield"; sagas
   and signs, not "ascendancies". Node names are evocative two-to-four word phrases in
   the existing register ("Oath of the Front Line", "Blue Arithmetic"). Class and
   archetype names are real, resonant words — Ritualist, Champion, Acrobat — never
   invented compound lore-shorthand ("Ritekeeper"-style coinages are banned, per
   Alexei). When in doubt, pick the word a player would actually say out loud.
7. **Simple to touch, deep to master.** One click allocates. Tooltips explain
   everything in plain language. Patterns are discoverable by playing (the UI hints at
   near-complete patterns). Depth lives in the combinatorics, never in the interface.

Anti-goals (reject work that produces these):

- ❌ Filler nodes ("+2% X" smalls that support no archetype in their region).
- ❌ Repeated notables or copy-paste clusters anywhere on the tree.
- ❌ A pattern system so rewarding it becomes mandatory for every build (target: pattern
  bonuses are ~20–30% of a specialized build's power, never 50%+).
- ❌ Keystones that are strictly-better numbers. ❌ Signs without prices.
- ❌ A designer mode that only designers can operate — it must be usable by Alexei
  mid-conversation with zero docs.
- ❌ Breaking `file://` operation or adding a build step.
- ❌ PoE names, PoE node text, or PoE tree layout copied verbatim.

---

## 3. What we take from Path of Exile (research digest)

Structure to imitate, numbers to calibrate against, mistakes to dodge. This digest is
distilled from a deep research pass over poewiki/poe2 sources; treat it as the design
textbook for the authoring phases. Names and exact text are NEVER copied into our tree.

**The full research reports live in `research/POE1-PASSIVES.md` and
`research/POE2-PASSIVES.md`** — read both before Phase 4 (authoring). They contain the
complete keystone catalogs with exact text, verified stat budgets per node tier, the
Timeless/Time-Lost jewel mechanics, and sourced player criticism. The digest below is
the operational summary.

### 3.1 The stat grammar — a protected multiplier tier is load-bearing

PoE's deepest tech is one grammatical rule: **`increased/reduced` is additive** (all
sources sum into one bucket) while **`more/less` is multiplicative** (each its own
factor). The tree hands out `increased` by the hundreds of percent; `more` is rationed
almost exclusively to keystones, masteries, and skill gems. That rationing is WHY
keystones feel special: a keystone's "40% more" outvalues another 100% `increased`
when the additive bucket already sits at +300%. Our stat engine (§4.3) enforces the
same law: small nodes and notables grant `increased`; only keystones, Signs, Waystones,
and pattern crests may grant `more` — and the lint flags any violation.

### 3.2 Node hierarchy and real budgets (PoE1 verified numbers)

PoE1: 1,325 nodes, ~123 points → a build touches under 10% of the tree; scarcity, not
unlocking, is the emotion. The hierarchy, with typical budgets:

| Tier | PoE1 reality | Our analog |
|---|---|---|
| Travel node | +10 to one attribute; near-worthless on purpose — the visible toll that prices distance | **Conduits** (we improved this: our travel layer has a real choice — chirality + attribute mix + pattern participation) |
| Small (cluster filler) | 5–6% inc. life; 8–12% inc. spell dmg; 12–16% single element; 3–4% attack speed; weapon smalls two-line (12% phys + 3% AS) | Authored cluster smalls, ~1 BU |
| Notable | 2–3× a small, primary stat + 1–2 riders: "30% inc. lightning + 6% penetration"; "10% inc. life + regen"; the best grant rule changes (+1 curse) | Named seats, 2.5–3 BU, best ones grant small rules |
| Keystone | No stat budget at all — a rule change with a cost (§3.3) | Keystones + Signs |
| Mastery (3.16+) | pick-one-of-6 menu per cluster, unlocked by the cluster's notable; once-per-type per character | Waystones + our mastery seats (menu idea worth stealing — see §3.6) |
| Jewel socket | empty node → itemization surface; a 4-mod rare jewel ≈ notable+small, so a socket 1–2 points off-path is worth it, 3+ is a debate | §6 sockets — same tension |

A typical PoE build spends 15–25% of points on pure travel. Distance-as-cost does three
jobs: balances strong nodes without nerfing (move them), taxes hybrid builds crossing
regions, and creates the respec economy. Our conduit-cost model already does this —
keep it honest when tuning (§9).

### 3.3 Keystone anatomy — the give and the take

The PoE pattern to steal: **the take is absolute and unhedged ("Removes all," "Never,"
"Cannot") while the give is transformative, not merely large.** Absolute language makes
builds legible — you know instantly whether a keystone is for you. Anatomy templates
observed (each is a mold for one of ours):

- **Archetype switch**: max life becomes 1 + chaos immunity (forces the ES archetype).
  Ours: a keystone that re-bases you fully onto Ward.
- **Close a stat category**: "hits can't be evaded / never crit" — one line deletes
  accuracy AND crit from your shopping list; the budget build's friend.
- **Fake the expensive thing**: "crit recently → 40% more damage, crits deal no extra
  damage" — three keystones partition "how do you feel about crit?" into
  ignore / fake / commit. Design our crit trio the same way.
- **Resource fusion**: skills cost life; 40% of damage taken from mana first; ES
  protects mana instead of life. Costs are systemic (an equation), not a sentence.
- **Conversion purity**: "all damage becomes Ember; deal no non-Ember damage."
- **Spatial tradeoff**: more damage at point-blank range, less at distance — a
  keystone that rewrites positioning rather than stats.
- **Self-imposed state**: 30% more rite damage while on low life — the downside is a
  state you engineer around (reserve-life items), seeding a whole archetype.
- **Tempo choice**: bleed can stack 8 times but each stack is halved and burst rules
  are deleted — same ailment, different rhythm.
- **Total gate**: "you can't deal damage yourself; +1 totem" — the most radical form:
  it forbids every other build. One of ours should be this brave (companion/rite-relay
  archetype).
- **Gearing inequality**: "40% more attack damage if accuracy > max life" — a keystone
  keyed to a comparison between two sheet stats. Extremely us: cheap to implement,
  deep to build around; pairs beautifully with attribute-transforming jewels.
- **State machine**: strong while un-hit, evasive right after a hit, punished if hits
  keep landing — defense with narrative rhythm.

Placement is half the design: PoE keystones sit at the far edge of the region whose
playstyle they serve, or provocatively BETWEEN regions, always 3–8 travel points off
the highway so reaching one is priced. Our ring-6 keystones and ring-8 Signs follow
the same law: never on the spoke itself, always a deliberate detour.

### 3.4 Conditionals are the cheapest depth in the genre

PoE's most interesting lines gate on game-state: "recently" (last 4s), "while
leeching", "on low life", "while stationary", "per X". Conditionals let the designer
print bigger numbers safely (uptime < 100%) and every conditional implies a rotation,
positioning rule, or gear requirement. Our stat engine must support a `conditional`
mod shape from day one (verdigris-pack already models `conditional`/`trigger` shapes —
reuse that vocabulary), and the authoring passes should spend conditionals liberally
on notables: they are how 331 nodes can feel like 1,300.

### 3.5 Jewels — what twelve years of PoE jewel design teaches

- **Flat, tierless affix pools** for basic jewels (PoE: max 4 mods, no ilvl) keep them
  a stable vocabulary rather than a second crafting treadmill. Whorl-stones copy this.
- **Radius jewels make position part of the item.** The attribute transformers
  (Str-in-radius→Int etc.) turned dead travel highways into build fuel — note they
  OVERPAY (200% conversion rates) to justify the contortion. Our Change-stones should
  also overpay slightly.
- **Rule-changer jewels** are the fivehead tier: "notables in radius grant nothing,
  smalls +50%"; "gain bonuses of UNallocated smalls in radius"; "this jewel's effect
  scales with how INEFFICIENT your pathing is" (a deliberate inversion — rewards long
  routes); "passives in radius can be allocated without being connected". Our
  Pattern-stones are this tier, aimed at geometry instead of graph connection.
- **Timeless jewels** (our Saga-stones): five jewels, each with a numeric seed and a
  name; the seed deterministically transforms every small/notable in radius, the name
  replaces keystones with jewel-exclusive ones. Same seed = same result forever →
  the community built seed-search tooling; a randomized item became a searchable
  puzzle. Each of the five expresses a different transformation philosophy — full
  reroll / additive augment (+attr on smalls, notables keep effect and gain a rider) /
  bespoke stacking currency (nodes grant "Devotion", notables scale per-Devotion) /
  blank-and-boost (smalls grant NOTHING, notables become oversized). **Design our five
  sagas to span the same philosophy spectrum, not five flavors of the same trick.**
  Also steal the composition firewall: transformed nodes are marked "conquered" and
  immune to further modification by other radius jewels; limit 1 Saga-stone socketed.
- **Cluster jewels** made the tree's edge craftable loot (socket-in-socket subtrees).
  Our six rim gateways + subtrees are the analog surface — a future phase could make
  subtree content jewel-driven; leave API room, don't build it now.
- **Threshold jewels died**: skill-behavior mods delivered via tree-position items
  lost to a cleaner delivery mechanism. Lesson: don't put skill-behavior modification
  into jewels; keep jewels about the tree and the sheet.

### 3.6 The Mastery lesson — how PoE killed ITS redundancy problem

Pre-3.16, three life clusters were interchangeable bags of "% life". The mastery
system (pick-one-of-6 menu per cluster, unlocked by the cluster's notable, each option
once per character) solved: redundant clusters (same clusters, divergent picks), niche
stats cluttering the tree (moved into opt-in menus), and dead pathing (every cluster
carries a rebate). Cost: power moved from visible geography into hidden menus — less
legible at a glance. **Our translation**: we keep power visible (geometry IS our
legibility), but the pick-once-per-character idea belongs in our mastery seats: the
six ring-3 masteries and six Waystones should offer a small choice (pick 1 of 3
authored options) so two builds through the same wedge still diverge. Implement as
data-driven choice nodes; the designer UI must support authoring the options.

### 3.7 What PoE2 changed and why

PoE2 (~1,800 smalls / 1,193 notables / ~32 keystones, still ~123 points) is GGG
re-answering PoE1's criticisms. What matters for us:

- **No life on the tree — deliberate.** Game director Jonathan Rogers: life "ended up
  being a mandatory stat… effectively wasting 20 or 30 passives… when they could be
  allocating something more interesting." Life comes from level + Strength + gear; the
  tree buys recovery, thresholds, and mitigation *flavor*. This validates our §4/§3.8
  stance — but note his concession that survivability balance got "complicated," and
  the live criticism that Ward-analog (ES) builds dominated because ES could still be
  scaled on tree while life couldn't. **Vaccine: our tree scales NO defense pool
  directly (no %Ward nodes either) — pools come from gear/attributes; the tree buys
  conversions, recharge behavior, caps, and rules, symmetrically across all layers.**
- **Travel nodes became choices**: "+5 to any attribute selected", re-pickable for
  half cost. Their fix is our starting point — conduits already offer a two-variant
  choice with pattern participation on top. Keep conduit re-choice cheap (current
  in-place variant switching is good; keep it).
- **Keystones price ACTION VERBS now**, not just sheet math: dodge-roll keystones
  ("dodge can't avoid damage / 30% less damage while rolling"), weapon-slot keystones
  ("wield two-handers in one hand / tripled attribute requirements"), DoT-window state
  machines ("50% less DoT taken if it started recently / 50% more if not"). Their
  best-received new keystones are levers on behavior. Ours should price OUR verbs:
  conduit choice, pattern completion, jewel swapping, wedge crossing, item slots.
- **Redesign discipline**: PoE2 softened absolutes where the absolute was a trap
  (RT's "can't be evaded" → "accuracy doubled") and hardened free notables into priced
  keystones (+1 curse now costs doubled activation delay). When we author, every
  give-only node needs either a price or a position cost.
- **They deleted things**: a degenerate keystone (Acrobatics) and 12 jewel sockets
  were removed outright in patches. Deleting shipped content is a legitimate balance
  move; our designer mode's `cut` status exists for exactly this.
- **Weapon-set points** (24 points allocatable differently per weapon set, tree
  re-resolves on swap) is their most innovative feature — dual-spec via context. Not
  in our scope, but the loadout hook goes in the backlog (Appendix A) and nothing in
  our data model should preclude context-dependent allocation later.
- **What players still hate** (steer hard away from all three): smalls that are a
  pure %-spreadsheet ("one goddamn talent" vs PoE1's bundled notables); defensive
  point-sinks that don't visibly pay ("spending 5–20 points on stun threshold?
  utterly trashy"); long travel with weak midpoints ("all the options are 'meh'").
  Our answers: clusters must bundle texture into smalls (§7.3), every defensive node
  must move the EHP headline visibly (§4/§9), and the ring-5 Waist exists precisely
  so the middle of every journey has a destination.
- **Time-Lost radius jewels** ("smalls in radius also grant X" / "notables in radius
  also grant Y" as rollable affixes) are the cheaper, more tunable cousin of cluster
  jewels — direct template for our Eye-stones' affix pools.

### 3.8 Failure modes to design against (PoE's criticisms, our vaccines)

1. **The life tax**: for most of PoE1's life every build spent ~20–25 points on the
   same life nodes before "the build" began — mandatory stats aren't choices. PoE2's
   answer was removing +life from the tree entirely. **Ours**: life/ward/evasion
   foundations come from levels, gear, and conduit attributes; tree nodes buy
   *conversion, specialization, and rules* for defense, not the baseline. The cadence
   sim (§9) must verify no archetype needs a fixed defensive shopping list.
2. **Dead travel**: PoE spent a decade re-injecting value into +10 attribute nodes
   (transform jewels, Timeless, tattoos). **Ours**: conduits are born meaningful
   (attributes + chirality + patterns), and Change-stones/Saga-stones keep them
   re-activatable. Never ship a conduit that can't participate in any pattern.
3. **Illusion of choice / solved tree**: raw node count doesn't create choice —
   non-transitive tradeoffs and per-character randomness do. **Ours**: pattern
   tensions (§5.7), pick-one mastery menus (§3.6), seeded Saga-stones.
4. **Overwhelm**: ship the mental model inside the UI — three thirds, clusters vs
   roads, keystones as landmarks. **Ours**: wedge coloring, pattern hints, the
   headline EHP/DPS numbers, search. The tree should look inviting at level 1: the
   first ring is six clean doorways, not sixty options.
5. **Systems-seam blowups**: when the tree became writable by items, PoE shipped
   stacking exploits (aura-stacking notables) before learning to write caps into node
   text and composition firewalls into jewels. **Ours**: caps in data from day one;
   "conquered" rule for Saga-stones; pattern-stone effects bounded; the two fivehead
   fixtures in §9 exist precisely to test the seams.
6. **Point-economy inflation**: every QoL system (anoints, masteries, tattoos)
   quietly handed players free points and forced content rebalance. **Ours**: the
   budget lint tracks total BU per reference build across phases — if a new system
   raises it, something else pays.

---

## 4. The stat engine — commit rpg_inventory to real offense & defense

**This comes first in implementation order** (Phase 1) because every node, jewel, and
pattern bonus needs a real vocabulary to speak. Build it as a standalone module in the
vesselforge mold: pure logic, zero dependencies, UMD, unit-testable in Node.

New file: `tools/rpg_inventory/core/verdigris-stats.js` (UMD global
`VerdigrisStats`). Consumed by: `verdigris-pack.js` `derive()`, the tree's
`computeStats`, and tests on both sides.

### 4.1 Damage channels

Five channels, Verdigris-flavored (never "fire/cold/lightning/chaos"):

| Channel | Flavor | Ailment it drives |
|---|---|---|
| **Physical** | bronze, stone, muscle | **Bleed** (phys DoT, aggravated by moving) |
| **Ember** | fire, ash, the kiln | **Scald** (burning DoT) |
| **River** | cold, water, the drowned | **Numb** (slow, then Freeze at threshold) |
| **Storm** | lightning, sky, the high paths | **Jolt** (take increased damage, stutter) |
| **Gloam** | shadow, the unlit, spirit-rot | **Wither** (stacking damage amplification, bypasses Ward) |

Plus **Poison** (phys/gloam weapons + venoms; stacking DoT). Ailment magnitude scales
from the hit; chance/effect/duration are the tunable stats.

### 4.2 Defense — layers of mitigation, resolved in order

An incoming hit walks this pipeline (each layer is a separate testable function):

1. **Evasion** (attacks only): accuracy vs evasion → chance to avoid entirely.
   Entropy-based rolling (no streaks), like PoE. DEX-flavored.
2. **Block** (shield or brace weapons): flat % chance to negate the hit, hard cap 75%,
   sourced mainly from shields; "when you block" is a trigger vocabulary.
3. **Ward**: a recharging barrier pool that absorbs damage before Life. Recharges after
   N seconds without taking damage. Sourced from armour pieces (`armor` field ×
   material), jade/amber materials, INT. **Gloam damage bypasses Ward** — its identity.
4. **Mitigation %**:
   - **Guard (armour value)** vs Physical: diminishing vs large hits
     (`mitigation = guard / (guard + K * hitDamage)` — pick K, test at level-relevant
     hit sizes; big slams must punch through guard stacking).
   - **Resistances** vs Ember/River/Storm/Gloam: additive %, cap 75 base (raisable a
     few points by rare affixes/nodes), with zone/act penalties as the progression
     screw. Gloam res is the rarest (PoE chaos-res analog).
5. **Life**: the final pool. STR-flavored. Recovery: slow natural regen, **Second
   Breath** (fast out-of-combat recovery), healing rites, **blood-drinking** (leech,
   small numbers, capped).
6. **Poise** (secondary): heavy armour grants stagger resistance — being hit doesn't
   interrupt actions. Cheap to model as a threshold stat; feeds the Bull-sign fantasy.

**Effective HP** = the composite the tree UI surfaces: expected hits-to-die vs a
standard attack profile (define 2–3 reference foes: a phys bruiser, an ember caster, a
mixed pack — data in the stats module, used by tests and the UI).

### 4.3 Offense

- Hit = weapon/rite base × (1 + Σ increased%) × Π(1 + more%) × speed × crit.
  **`increased` (additive bucket) vs `more` (multiplicative) is law**, exactly like
  PoE — the tree hands out `increased`; keystones, waves, and Signs are the main
  `more` sources, which is what makes them feel special.
- Skill tags the tree can condition on: `melee`, `projectile`, `rite` (spell),
  `companion` (minion/ally), `trap-mark` (indirect), plus channel tags.
- Crit: chance × multiplier (rename multiplier "**advantage bonus**" to match the
  existing "advantage" language in tree text — pick one term and use it everywhere).
- Accuracy exists and matters for attacks (evasion's mirror).

### 4.4 Attributes (the conduit currency)

- **STR** → +Life per point, +Guard per point, small melee damage scaling.
- **DEX** → +Evasion per point, +Accuracy per point, small speed scaling.
- **INT** → +Ward per point, +Spirit (mana) per point, small rite damage scaling.
- Keep conversions in ONE place in the stats module (kill the hardcoded lines in
  `computeStats`). Attribute thresholds gate items (BASE-DESIGN ladders) — jewels that
  transform attributes (§6) get their power from this.

### 4.5 Resource

**Spirit** (already in verdigris-pack) is the cast/skill resource. Reservation
(banners, standing rites) is a later concern but leave API room.

Deliverables for this section: the module, ~30+ unit tests (pipeline order, guard
formula behavior at hit extremes, res caps, ward recharge, EHP math, increased-vs-more
math), `verdigris-pack.js` `derive()` rewritten onto it, tree `computeStats` rewritten
onto it, and an EHP/DPS headline panel in the tree UI with per-allocation deltas.

---

## 5. The pattern system v2 — geometry as buildcraft

Nomenclature: a conduit's two arc variants are its **chirality** (inner = L, outer = R).
Patterns are detected on the *allocated* subgraph after every change (extend
`recalculate`). Each pattern must have: detection function, stat payoff via the stat
engine, tooltip text, a debug overlay, and tests.

### 5.1 Waves (NEW — the flagship mechanic Alexei asked for)

A **wave** is a simple path of ≥2 allocated conduits whose chiralities strictly
alternate (L,R,L,R…). Waves **empower the nodes on the wave** (not the conduits):

- Wave of length k grants each node on it `+wave(k, position)%` increased effect of
  that node's own stats (same "empower" mechanism as loop crowns, reuse
  `getNodeBoost`-style math).
- Scaling: longer waves give more per node; nodes deeper into the wave (more wave
  conduits touching their position) get more than endpoints. A 2-conduit wave's middle
  node gets the minimum meaningful bonus (~+10%); a full center-to-rim wave (10
  conduits with the new ring) empowers its midpoint (~ring 5) most (~+60% at the crest,
  tapering toward the ends). Exact curve is a balance knob — put it in one tunable
  table, not scattered constants.
- **Meridian (Great Wave)**: a wave running rim-to-rim THROUGH the origin (the origin
  is chirality-neutral, it joins the two half-waves). This is the crown jewel: the two
  endpoint rim nodes are BOTH empowered at crest level, and the build gains a unique
  bonus (design one: e.g. "your two furthest-apart allocated notables count as
  linked — both gain each other's tags"). A meridian costs ~20 conduits + 20 nodes —
  nearly a third of a build. It must be worth it, barely.
- Maximal-wave decomposition: a conduit belongs to the longest alternating chain
  containing it; ties broken toward the chain closer to origin. Keep the algorithm
  deterministic and unit-test the tie cases (junction nodes with 3+ wave-eligible
  continuations).

### 5.2 Flows (NEW — the wave's rival)

A **flow** is a simple path of ≥3 allocated conduits with the SAME chirality. Flows
**empower the conduits** (the attribute layer): +25% conduit attributes at length 3,
scaling to +100% for a length-8+ flow. Flows are the attribute-stacker's tool and the
natural rival of waves — the same segments can serve either, never both. This turns
every conduit click into a macro decision.

### 5.3 Loops & crowns (EXISTS — keep, rebalance, extend)

- Keep radius 1–3 loop detection empowering the center (`detectLoopEmpowerments`).
- **Concentric Crown**: radius-1 AND radius-2 loops around the same center compound
  (multiplicative, not additive — this is the "empower the center twice" fantasy the
  Closed Circuit keystone already gestures at).
- **Vesica (twin loops)**: two radius-1 loops sharing exactly one edge — the two shared
  nodes become **lens nodes**: each also receives 50% of the OTHER center's empowerment.
  Rewards honeycomb builds.
- **Grand Orbit**: allocate an entire lattice ring around the origin. Payoff scales
  with ring number; a ring-5 Grand Orbit (30 nodes — the midpoint ring) is a
  build-defining commitment and should read like one (e.g. +1 jewel socket radius
  tree-wide, or "your waves crossing ring 5 count +2 length"). Ring-1 or 2 orbits are
  cheap and modest.

### 5.4 Symmetry (EXISTS as mirror — generalize)

- Mirror pairs across the vertical axis: keep, but make the payoff scale smoothly
  (per-pair) instead of a ≥5 cliff, and count mirrored *conduits* too.
- **Trine**: allocation invariant under 120° rotation (score = matched triples).
  Payoff: equalizing (pushes toward Scales-style balanced-attribute builds).
- **Mandala**: invariance under 60° rotation — very expensive, mostly a prestige/
  cosmetic-plus-modest-bonus pattern. Cap its power low; it exists to be beautiful.

### 5.5 Circuits & enclosures (EXISTS as redundant circuit — extend)

- Redundant circuits: keep (cycles = resilience flavor, ES/evasion payoff).
- **Warding Circle (enclosure)**: a closed circuit that encloses ≥1 UNALLOCATED node:
  each enclosed node grants a small defensive bonus ("what the circle keeps out").
  This makes deliberately routing AROUND a hole a real strategy and pairs wickedly
  with jewels/keystones that later fill or transform enclosed nodes.

### 5.6 Junctions, spokes, and the midpoint (NEW seats, light rules)

- **Straight chains** generalized: any straight run of ≥3 conduits in a lattice
  direction (not just the 3 primary half-axes from origin) counts as a **rod**; rods
  grant their endpoints a small bonus. The primary-axis chains keep their stronger
  existing bonus.
- **Crossroads**: a node with 4+ allocated conduits gets a small bonus per conduit
  beyond 3 (hub builds).
- **Waystones**: the six ring-5 spoke midpoints are named seats (see §7) that interact
  with patterns (e.g. "waves passing through this Waystone count +1 length").

### 5.7 Pattern stacking law

One conduit may count toward: at most one wave OR one flow (exclusive by definition),
plus any loops/orbits/circuits it closes, plus symmetry. Node empowerments from
different pattern families STACK ADDITIVELY into one `increased effect` bucket (never
multiplicative across families, or loops×waves explodes). The pattern panel in the UI
lists every active pattern with its contribution; the debug overlay draws them
(waves as sine-strokes, flows as thick smooth strokes, loops as crowns — extend the
existing loop-crown rendering language).

### 5.8 Balance stance for patterns

Target: a pattern-focused build gets 20–30% of its power from patterns; a
pattern-ignoring build loses nothing it was promised (nodes still work). Patterns must
never make travel-optimal pathing wrong — they make *deliberate* pathing better.
Tuning table for every pattern payoff lives in ONE data block (`PATTERN_TUNING`) with
comments, so balancing is data-editing, not code surgery.

---

## 6. Jewels — items that live in the tree

Jewels are **rpg_inventory items** (a new `kind: 'jewel'` family in the pack; they are
vessels — they can carry Brands within their small budget, they drop, they're crafted).
The tree gets **socket seats** (§7); a socket UI lets you place/remove jewels. For the
demo, a jewel picker panel with a curated stash + "craft random" via vesselforge is
enough; the API must accept arbitrary jewel JSON from the inventory side.

Five families (Verdigris naming — carved stones, not "jewels", in player-facing text):

1. **Whorl-stones** (basic): 1–3 authored mods from the shared stat registry. The
   bread-and-butter socket filler; rollable/craftable like any vessel.
2. **Eye-stones** (radius): affect allocated nodes within lattice radius R of the
   socket ("small passives in radius also grant +8 Guard"; "notables in radius gain
   +5% effect"). Radius shown on hover, exactly like PoE radius jewels.
3. **Change-stones** (transmuting, radius): rewrite the attribute layer in radius —
   "STR granted by conduits in radius counts as INT", "conduit attributes in radius
   are doubled but nodes there grant no effects", "attributes in radius also count for
   item requirements twice". These create the attribute-transform tricks Alexei wants
   (PoE analog: Brute Force Solution / Might in All Forms — study, don't copy).
4. **Saga-stones** (the Timeless analog, radius, seeded): each carries a **saga**
   (one of ~5 legendary Verdigris cultures/heroes — invent them; e.g. the Drowned
   Court, the Kilnfathers, the First Herd, the Quiet Survey, the Salt Oath) and a
   **numeric seed** (the "year of the saga"). Deterministically rewrites every node in
   radius: smalls get the saga's stat vocabulary, notables are replaced from the
   saga's notable table keyed by `hash(seed, nodeId)`, and any keystone in radius
   becomes the saga's keystone. Same seed = same result forever (theorycraftable,
   tradeable, chase-worthy). This is the single biggest replayability lever on the
   tree — implement it last but design the data shape early.
5. **Pattern-stones** (geometry-bending): "waves through this socket's radius count +1
   length", "a loop around this socket may be missing one conduit and still count",
   "this socket counts as an allocated center for loop detection", "flows may pass
   through one unallocated node in radius". These are the fivehead enablers; each one
   must be tested against the pattern detector.

Socket rules: sockets are normal 1-point allocations that do nothing empty. Jewel
swap is free out of combat (respec-friendly planning tool). Socket seats sit at
pattern-relevant positions (§7) so jewel choice and pattern play interlock.

---

## 7. The authored tree — seats, sectors, and the content plan

### 7.1 Ring change

`MAIN_RING_DEPTH` 9 → **10**. 331 main nodes. Move the six subtree gateways to the new
rim corners (±10 coords in `SUBTREES`). Check every hardcoded 9/`MAIN_RING_DEPTH`
assumption (`nodeTypeFor` seat rules, `progressionTier`, axis-chain max length,
`ringIntensity` scaling, subtree `base` offset). Point pool: raise to **140**
(recheck in Phase 7 against the cadence sim; a center-to-rim spoke now costs 20).

### 7.2 Sector identity (six spokes, six wedges)

Three pure spokes: **STR** (bottom-right), **DEX** (bottom-left), **INT** (up). Three
seam spokes between them, each a named hybrid school:

- **STR+DEX seam** — the *Skirmisher* wedge (war-dancing, thrown weapons, momentum).
- **DEX+INT seam** — the *Nightwork* wedge (marks, traps, venoms, unseen action).
- **INT+STR seam** — the *Ritualist* wedge (battle-rites, banners, wards, companions-of-war).

Every wedge (the 60° region between two spokes) gets a themed stat palette drawn from
§4 so that WHERE you build says WHAT you are. Damage channels map naturally (Ember
lives near STR/Ritualist, River near INT/Nightwork, Storm near DEX/Skirmisher, Gloam
threads the Nightwork deep wedge, Physical is universal but concentrated on pure STR).

### 7.3 Seat plan by ring (authoring skeleton — final counts may flex ±)

| Ring | Seats |
|---|---|
| 0 | Origin (no bonus) |
| 1 (6) | Six **doorway smalls** — one per spoke direction, each a clean archetype opener |
| 2 (12) | Six **first notables** (one per wedge) + six smalls |
| 3 (18) | Spoke **masteries I** (6) + themed smalls |
| 4 (24) | Notable belt (6–8 notables) + smalls; first defensive-layer notables |
| 5 (30) | **THE WAIST**: six spoke **Waystones** (midpoint mini-keystones with small tradeoffs, pattern-interactive) + six **jewel sockets** (mid-wedge) + smalls |
| 6 (36) | **Keystone ring I**: six keystones (one per wedge) + notables + smalls |
| 7 (42) | **Class milestones** (6 — see §8) on the spokes + strong notables |
| 8 (48) | **The Signs** (birthsign keystones; exactly one allocatable — you are born under one sign; enforce mutual exclusivity) + notables |
| 9 (54) | Deep notables, second jewel-socket set (6), pre-rim smalls |
| 10 (60) | Rim: six **gateways** (corners) to subtrees + rim notables ("frontier" powers) + travel smalls |

Smalls between named seats are authored in **clusters of 2–4 with a local theme**
(PoE-cluster style: "the bleed cluster on the STR spoke approach"), not individually
unique but never identical to a neighboring cluster, and every cluster must feed at
least one archetype that lives in its wedge. **Every notable, mastery, keystone,
Waystone, Sign, and class node is globally unique.** Anti-spreadsheet rule (PoE2's
harshest feedback was smalls that read as a % ledger): a cluster's smalls may be
plain single-line stats, but at least one small per cluster carries texture — a
conditional, a flat+percent hybrid, or a micro-mechanic — and the cluster's notable
always bundles a mechanic, never just bigger numbers.

### 7.4 Data model (the redundancy kill)

New file `tools/geometric_skilltree/assets/tree-data.js` (classic script, sets
`window.TREE_DATA`), containing: per-seat authored entries keyed by `"q,r"` — name,
type, effect lines, stat mods (registry ids + amounts), tags, cluster id, notes/status
(designer metadata rides along), plus the SIGNS/KEYSTONES/WAYSTONES/CLASSES tables and
`PATTERN_TUNING`. `buildMainTree` consumes TREE_DATA; the hash-pool path
(`effectTemplate`/`notableTemplate`/`keystoneTemplate` + `NODE_EFFECTS`/`NOTABLES`
pools) is DELETED once coverage is total. Designer mode (§10) reads and writes this
data (via export). Add a lint test: every lattice seat has an entry; no duplicate
names among named seats; every mod id resolves in the stat registry.

Migration path: Phase 0 generates a bootstrap TREE_DATA by dumping the current
procedural output (so the app keeps working), then authoring passes rewrite it wedge
by wedge and the dump script is retired.

---

## 8. Class milestones & unlock nodes

Six class nodes at ring 7 spoke seats, one per spoke identity:

| Spoke | Class node | Unlock direction (wire what's feasible) |
|---|---|---|
| STR | **Champion** | tower shields; 2x2 War-call auxiliary seat |
| DEX | **Acrobat** | second weapon set; 2x2 Quick Rig auxiliary seat |
| INT | **Archmage** | rite-focus socketing; 2x2 Attendant focus seat |
| STR+DEX | **Reaver** | thrown melee/projectile rules; 4x4 Spoils Roll |
| DEX+INT | **Nightblade** | trap/mark tools and venom; 4x4 Preparation Case |
| INT+STR | **Ritualist** | banners and companions; 4x4 Reliquary |

Mechanics: the first allocated class node sets `character.class`; later class
milestones do not replace that Calling, but every active class milestone grants
its own armoury flags. This lets hybrid paths accumulate a few of the six side
windows without exposing all six by default. Slot/type unlocks are delivered as
**flags in the stat sheet** (`unlocks: ['war_call_slot', 'spoils_pack', …]`)
that `rpg_inventory/index.html` and `verdigris-pack.js` consume. The inventory
renders one independent `<<` tab for each unlocked auxiliary seat or specialty
pack and omits unavailable tabs; a minimal
`window.VerdigrisBridge` object or localStorage handshake between the two pages is
acceptable for now; document it).

---

## 9. Balance framework & the anticipation curve

- **Budget units**: define 1 BU = the power of a standard small (≈ "+10% increased
  damage" equivalent — the stats module provides an EHP/DPS-normalizing helper to
  compare defensive vs offensive grants). Targets: small ≈ 1 BU, notable ≈ 2.5–3 BU,
  mastery ≈ 3.5 BU, Waystone ≈ 3 BU + a rule, keystone = rule-change (net BU ≈ 0–1),
  Sign = big rule + real price, class node ≈ 2 BU + unlock. Lint flags any node >±30%
  off its type target.
- **Cadence targets** (verified by a headless simulation test that greedy-paths
  archetype builds level 1→100): a first notable by ~5 points; wedge identity clear by
  ~12; first keystone reachable by ~20–25; Waystone/waist reached by ~30; Sign by
  ~45–55; a completed signature pattern (first loop crown or 4+ wave) by ~15–20. No
  stretch of >3 points with zero milestone for any of the six reference archetypes.
- **Respec**: keep one-by-one refund; patterns recompute live. Jewel swaps free.
- **Six reference builds** (one per spoke identity) maintained as JSON fixtures +
  test assertions on their final EHP/DPS windows — these are the balance canaries. Add
  two "fivehead" fixtures that abuse patterns (meridian build, vesica-honeycomb build)
  and assert they land inside the 20–30% pattern-power envelope.

---

## 10. Designer mode — the annotation & balancing UI

A toggle in the top bar (`Design` button + `D` hotkey + `?design=1`). All designer
state persists to localStorage AND exports/imports as JSON; "Export tree-data" emits a
complete `tree-data.js` file body for committing back to the repo.

Panels & features (all in the existing single-file UI style):

1. **Seat inspector**: click any node/conduit in design mode → editable fields: name,
   type, effect lines, stat mods (id+amount rows validated against the registry),
   tags, cluster id, **status** (`empty / draft / review / final / cut`), free-text
   **notes** (Alexei's jotting space — this is a hard requirement). Changes apply live
   to the running tree so you can feel a node immediately.
2. **Status heatmap overlay**: color every seat by status — the authoring progress map.
3. **Coverage overlays**: color by stat category (where does bleed live? where is
   Guard?), by node type, by BU budget deviation, by cluster.
4. **Pattern debug overlay**: live-draw detected waves/flows/loops/orbits/symmetry
   with their contributions (also the player-facing "pattern panel" in lite form).
5. **Lint panel**: duplicate names, empty seats, unresolved stat ids, budget outliers,
   clusters violating wedge palette, unreachable seats, orphan annotations. One click
   jumps to the offending seat.
6. **Annotation pins**: seats with notes render a small marker; hover shows the note.
7. **Diff/export**: export annotations alone (JSON) or full tree-data; import merges
   by seat with a conflict report in the log panel.

Keep player mode completely clean — zero designer chrome unless toggled.

---

## 11. Implementation phases (the goal loop)

Work in phases; each phase ends with: tests green, README + `OVERHAUL-LOG.md` updated,
a commit with message `tree-overhaul(N): <summary>`, and (from Phase 3 on) a designer-
mode export committed. Do not start phase N+1 with phase N's acceptance criteria
unmet. If blocked, log the blocker in OVERHAUL-LOG.md and pick the next unblocked item.

- **Phase 0 — Scaffolding & the tenth ring.** Bootstrap TREE_DATA from current
  procedural output; ring 10; gateway/coord fixes; point pool 140; all existing
  behavior preserved; add the seat-coverage lint test. *(Accept: app runs from file://,
  331 nodes, subtrees attached at ring 10, tests green.)*
- **Phase 1 — Stat engine.** `verdigris-stats.js` per §4 + tests; rewire
  `verdigris-pack.derive()` and tree `computeStats`; EHP/DPS headline panel with
  per-click deltas. *(Accept: both apps consume the registry; 30+ stat tests; deltas
  visible on every allocation.)*
- **Phase 2 — Pattern system v2.** Waves, flows, meridian, rods, crossroads,
  concentric crowns, vesica, grand orbits, enclosures, smooth mirror + trine/mandala;
  PATTERN_TUNING table; pattern panel + debug overlay; exhaustive detector tests
  (including tie-breaking and stacking-law tests). *(Accept: every §5 pattern
  detectable, rendered, tested; stacking law enforced.)*
- **Phase 3 — Designer mode.** Everything in §10. *(Accept: Alexei can click any seat,
  rename it, change its mods, jot a note, see status heatmap, export tree-data.js.)*
- **Phase 4 — Authoring passes.** Wedge by wedge (six passes), author all named seats
  and clusters per §7 using designer mode; delete the hash-pool generator when
  coverage is total; write the six Signs' final texts; keystones; Waystones.
  *(Accept: lint clean — zero `empty`/`draft` seats, zero duplicate named seats,
  every cluster themed; generator code deleted.)*
- **Phase 5 — Jewels.** Socket seats live; jewel picker; five families incl. seeded
  saga-stones; `kind:'jewel'` in verdigris-pack (jewels are vessels); pattern-stone ×
  detector integration tests. *(Accept: all five families demonstrably work; same-seed
  saga-stone reproducibility test.)*
- **Phase 6 — Class milestones & unlocks.** §8 nodes, flags, and the cross-page bridge
  with six independently gated armoury windows. *(Accept: each class milestone adds
  exactly its own `<<` tab in the rpg_inventory demo.)*
- **Phase 7 — Balance & polish.** Cadence sim + six reference builds + two fivehead
  fixtures; tune PATTERN_TUNING and node budgets until §9 targets pass; tooltip/UX
  polish (near-complete-pattern hints, "what this point does" hover preview); final
  README rewrite. *(Accept: all §9 assertions green; Alexei-facing changelog written.)*

---

## 12. Working rules for the loop session

- **Verify in the browser, not just in tests** — open the page, click through an
  allocation of every new mechanic before calling it done. The tests are the floor.
- Keep `index.html` organized: constants → data (or data in `assets/*.js`) → engine →
  renderer → UI. If the file grows unwieldy, extracting classic-script assets is
  allowed; a bundler is not.
- Never edit `tools/rpg_inventory/core/PROMPT.txt` (standing rule from AGENTS.md).
  Don't touch asset-pipeline files; your rpg_inventory surface is `verdigris-stats.js`
  (new), `verdigris-pack.js` (derive + jewel kind + unlock flags), and light
  index.html wiring.
- Original names only. If a name collides with a well-known PoE node, rename ours.
- Numbers live in data blocks with comments, never inline magic constants.
- Log every meaningful decision, tradeoff, and TODO in `OVERHAUL-LOG.md` (newest
  first, dated). That file is the session's memory across loop iterations.
- Commit at every phase boundary at minimum; smaller commits welcome.

---

## Appendix A — Idea backlog (not commitments; pull from here when a wedge feels thin)

- Spiral detection ("Helix"): a path that gains a ring each step while winding — 
  movement/cooldown flavor.
- "Ouroboros": a circuit passing through the origin — recovery flavor.
- Compass: touching the rim at k distinct gateways — small global bonus per gateway.
- Enclosure keystone: "The Empty Throne" — warded (enclosed unallocated) nodes count
  as allocated at 35% effect; you cannot allocate them while it's active.
- A Sign that inverts wave/flow rules ("born under the Restless Water: your flows
  count as waves").
- Jewel that converts a loop crown's empowerment into flat Ward ("the circle holds").
- Subtree rework to themed "schools" with their own mini-pattern rules (post-overhaul).
- Seasonal/quest-granted unique jewels as rewards (hooks only).
- **Loadout points** (PoE2 weapon-set analog): a handful of late-game points that can
  be allocated differently per weapon set / stance, tree re-resolving on swap. Keep
  the data model open to context-dependent allocation; do not build now.
- **Anoint analog**: a rare consumable ("votive oil"?) that allocates one distant
  notable point-free — the release valve for "that notable is 8 points away." Wire
  only after balance settles.
- **Respec economy**: currently free one-by-one refunds. For the real game, PoE2's
  scaling-gold model is the reference; the demo keeps refunds free for planning.
