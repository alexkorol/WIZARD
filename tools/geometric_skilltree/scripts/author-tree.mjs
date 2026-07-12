/* =============================================================================
   PHASE 4 AUTHORING SCRIPT — writes assets/tree-data.js from hand-authored
   wedge/spoke tables. Every seat below is deliberate data; nothing is
   hash-generated. Re-run after editing tables:

     node tools/geometric_skilltree/scripts/author-tree.mjs

   Geometry: ten rings, axial hex. Corner spokes (walk order starts at STR):
     c0 (R,0)  INT / Archmage          c1 (R,-R) Nightwork / Nightblade
     c2 (0,-R) DEX / Acrobat           c3 (-R,0) Skirmisher / Reaver
     c4 (-R,R) STR / Champion          c5 (0,R)  Ritualist / Ritualist
   Ring side s runs corner (4+s)%6 -> next corner; side index = wedge index.
   ============================================================================= */
import { readFileSync, writeFileSync } from 'node:fs';

const TREE_DATA_PATH = new URL('../assets/tree-data.js', import.meta.url);

const HEX_DIRECTIONS = [
  { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
  { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
];
const DEPTH = 10;
const AXIS_VECTORS = {
  int: { x: 0, y: -1 },
  dex: { x: -Math.sqrt(3) / 2, y: 0.5 },
  str: { x: Math.sqrt(3) / 2, y: 0.5 }
};

function axialToPixel(q, r, spacing = 72) {
  const rawX = spacing * (q + r / 2);
  const rawY = spacing * (r * Math.sqrt(3) / 2);
  return { x: rawY, y: -rawX };
}

function axisFor(q, r) {
  const pos = axialToPixel(q, r);
  const length = Math.hypot(pos.x, pos.y);
  if (length < 0.001) return 'hybrid';
  const unit = { x: pos.x / length, y: pos.y / length };
  const raw = Object.fromEntries(Object.entries(AXIS_VECTORS).map(([axis, vec]) =>
    [axis, Math.max(0, unit.x * vec.x + unit.y * vec.y)]
  ));
  const ordered = Object.entries(raw).sort((a, b) => b[1] - a[1]);
  return ordered[0][1] - ordered[1][1] < 0.18 * (raw.str + raw.dex + raw.int) ? 'hybrid' : ordered[0][0];
}

/* ---- stat line formatter (single mechanical mod per seat) ------------------ */
const STAT_LINES = {
  attackDamage: a => `+${a}% increased Attack Damage`,
  spellDamage: a => `+${a}% increased Rite Damage`,
  projectileDamage: a => `+${a}% increased Projectile Damage`,
  minionDamage: a => `+${a}% increased Companion Damage`,
  attackSpeed: a => `+${a}% increased Attack Speed`,
  castSpeed: a => `+${a}% increased Rite Speed`,
  ailmentEffect: a => `+${a}% increased Ailment Effect`,
  cooldownRecovery: a => `+${a}% increased Cooldown Recovery`,
  physical_increased: a => `+${a}% increased Physical Damage`,
  ward_pct: a => `+${a}% increased Ward`,
  guard_increased: a => `+${a}% increased Guard`,
  evasion_increased: a => `+${a}% increased Evasion`,
  reach_increased: a => `+${a}% increased Reach`,
  move: a => `+${a}% increased Movement Speed`,
  life: a => `+${a} to Life`,
  spirit: a => `+${a} to Spirit`,
  ward: a => `+${a} to Ward`,
  guard: a => `+${a} to Guard`,
  evasion: a => `+${a} to Evasion`,
  accuracy_flat: a => `+${a} to Accuracy`,
  heavy: a => `Adds ${a} Physical Damage to hits`,
  emberkiss: a => `Adds ${a} Ember Damage to hits`,
  critChance: a => `+${a}% to Critical Chance`,
  crit_bonus_flat: a => `+${a}% to Advantage Bonus`,
  blockChance: a => `+${a}% to Block Chance`,
  allResistances: a => `+${a}% to all Resistances`,
  ember_res: a => `+${a}% to Ember Resistance`,
  river_resistance: a => `+${a}% to River Resistance`,
  storm_res: a => `+${a}% to Storm Resistance`,
  gloam_res: a => `+${a}% to Gloam Resistance`,
  str: a => `+${a} to Strength`,
  dex: a => `+${a} to Dexterity`,
  int: a => `+${a} to Intelligence`,
  attrs: a => `+${a} to all Attributes`
};

function lineFor(stat, amount) {
  const make = STAT_LINES[stat];
  if (!make) throw new Error(`No line formatter for stat "${stat}"`);
  return make(amount);
}

/* =============================================================================
   SPOKES — corner seats per ring. Each spoke owns rings:
   1 doorway small, 2 small, 3 mastery, 4 small, 5 Waystone, 6 notable,
   7 class milestone, 8 notable, 9 notable, 10 gateway.
   ============================================================================= */
const SPOKES = {
  int: {
    title: 'Archmage Road', cluster: 'int-spoke',
    doorway: { n: 'First Lesson', s: 'spellDamage', a: 10, x: ['A clean opening: rites hit harder from the first day.'] },
    r2small: { n: 'Copied Notes', s: 'spirit', a: 12 },
    mastery: {
      n: 'Blue Arithmetic', s: 'spellDamage', a: 14,
      fx: ['+20 to Ward', 'Your Ward recharge begins 20% sooner', 'The school of counting what cannot be touched.']
    },
    r4small: { n: 'Steady Hand of the Scribe', s: 'castSpeed', a: 5 },
    waystone: {
      n: 'The Blue Milestone', s: 'ward', a: 30,
      fx: ['Waves passing through this Waystone count +1 length', 'Ward recharge is 10% slower', 'Half the journey up the blue road, marked in lapis.']
    },
    r6notable: { n: 'Third Reading', s: 'spellDamage', a: 26, fx: ['+15 to Spirit', 'Rites you repeat within four seconds gain +10% effect (design text)'] },
    classNode: {
      n: 'Archmage', s: 'spellDamage', a: 15,
      fx: ['Unlocks: a second curio slot', 'Unlocks: rite-foci gain +1 socket', 'One of six callings; the first calling you take marks your class.']
    },
    r8notable: { n: 'Unwritten Chapter', s: 'ward_pct', a: 18, fx: ['+12% increased Rite Damage', 'You keep 10% of Ward when a hit would empty it (design text)'] },
    r9notable: { n: 'Deep Shelf', s: 'spellDamage', a: 30, fx: ['+30 to Ward', 'Rites cost 5% less Spirit (design text)'] },
    gateway: { n: 'Genius Circle Gate', title: 'Genius Circle' }
  },
  nightwork: {
    title: 'Nightwork Road', cluster: 'nightwork-spoke',
    doorway: { n: 'First Cut', s: 'ailmentEffect', a: 10, x: ['Small wounds, patiently kept open.'] },
    r2small: { n: 'Dark Lantern', s: 'gloam_res', a: 8 },
    mastery: {
      n: 'Second Shadow', s: 'ailmentEffect', a: 16,
      fx: ['+1% to Critical Chance', 'Your marks last 20% longer (design text)', 'The trade taught after dark, to those who already know a trade.']
    },
    r4small: { n: 'Soft Boots', s: 'evasion', a: 25 },
    waystone: {
      n: 'The Unlit Milestone', s: 'ailmentEffect', a: 12,
      fx: ['Flows passing through this Waystone count +1 length', 'You show your position when you strike: +5% damage taken for two seconds (design text)', 'A marker stone with the lamp long stolen.']
    },
    r6notable: { n: 'Collector of Debts', s: 'gloam_res', a: 12, fx: ['+18% increased Ailment Effect', 'Wither you inflict stacks one deeper (design text)'] },
    classNode: {
      n: 'Nightblade', s: 'ailmentEffect', a: 12,
      fx: ['Unlocks: trap and mark tools become equippable', 'Unlocks: venom vial slot', 'One of six callings; the first calling you take marks your class.']
    },
    r8notable: { n: 'Ledger of Grudges', s: 'ailmentEffect', a: 20, fx: ['+1.5% to Critical Chance', 'Poisons you inflict on marked enemies deal 15% more (design text)'] },
    r9notable: { n: 'The Long Memory', s: 'gloam_res', a: 15, fx: ['+22% increased Ailment Effect', 'Enemies that kill your allies are marked for you (design text)'] },
    gateway: { n: 'Spellblade Annex Gate', title: 'Spellblade Annex' }
  },
  dex: {
    title: 'Acrobat Road', cluster: 'dex-spoke',
    doorway: { n: 'Light Step', s: 'evasion', a: 24, x: ['Begin by not being where the blow lands.'] },
    r2small: { n: 'Practiced Fall', s: 'evasion_increased', a: 8 },
    mastery: {
      n: 'Fieldcraft', s: 'evasion_increased', a: 14,
      fx: ['+40 to Accuracy', '+4% increased Movement Speed', 'Ground read well is worth more than armour.']
    },
    r4small: { n: 'Quick Breath', s: 'attackSpeed', a: 5 },
    waystone: {
      n: 'The Swift Milestone', s: 'evasion', a: 45,
      fx: ['Rods ending on this Waystone empower both endpoints twice', 'You cannot Block while you keep this pace (design text)', 'Runners touch the stone and do not stop.']
    },
    r6notable: { n: 'Read the Wind', s: 'accuracy_flat', a: 60, fx: ['+12% increased Attack Speed', 'Your first hit on an unhurt enemy always lands (design text)'] },
    classNode: {
      n: 'Acrobat', s: 'evasion_increased', a: 12,
      fx: ['Unlocks: a second weapon set for swapping', 'Unlocks: dual-wielding one-handers', 'One of six callings; the first calling you take marks your class.']
    },
    r8notable: { n: 'Between Raindrops', s: 'evasion_increased', a: 22, fx: ['+5% increased Movement Speed', 'Evading a hit hastens your next action by 10% (design text)'] },
    r9notable: { n: 'No Second Chance', s: 'crit_bonus_flat', a: 25, fx: ['+50 to Accuracy', 'Hits against enemies that just missed you gain +1% Critical Chance (design text)'] },
    gateway: { n: "Ranger's Writ Gate", title: "Ranger's Writ" }
  },
  skirmisher: {
    title: 'Skirmisher Road', cluster: 'skirmisher-spoke',
    doorway: { n: 'First Throw', s: 'projectileDamage', a: 10, x: ['Everything in camp can be thrown once.'] },
    r2small: { n: 'Belt of Knives', s: 'projectileDamage', a: 8 },
    mastery: {
      n: 'War Dance', s: 'projectileDamage', a: 12,
      fx: ['+6% increased Attack Speed', 'Moving between attacks adds +8% damage to the next one (design text)', 'The steps are taught to drummers first.']
    },
    r4small: { n: 'Loose Shoulders', s: 'attackSpeed', a: 5 },
    waystone: {
      n: 'The Thrown Milestone', s: 'projectileDamage', a: 16,
      fx: ['Waves and flows may both claim conduits touching this Waystone (design text)', '-10% increased Reach', 'Soldiers bet knives against the stone. The stone keeps them.']
    },
    r6notable: { n: 'Running Volley', s: 'projectileDamage', a: 24, fx: ['+5% increased Movement Speed', 'Thrown hits while moving gain +10% damage (design text)'] },
    classNode: {
      n: 'Reaver', s: 'projectileDamage', a: 12,
      fx: ['Unlocks: thrown weapons count as melee AND projectile', 'Unlocks: belt fetish slot', 'One of six callings; the first calling you take marks your class.']
    },
    r8notable: { n: 'Storm of Handles', s: 'attackSpeed', a: 12, fx: ['+15% increased Projectile Damage', 'Your throws return to hand on kill (design text)'] },
    r9notable: { n: 'Nothing Wasted', s: 'projectileDamage', a: 28, fx: ['+40 to Accuracy', 'Missed throws can be recovered where they landed (design text)'] },
    gateway: { n: 'Skirmish Annex Gate', title: 'Skirmish Annex' }
  },
  str: {
    title: 'Champion Road', cluster: 'str-spoke',
    doorway: { n: 'Firm Grip', s: 'attackDamage', a: 9, x: ['Hold the haft like it owes you money.'] },
    r2small: { n: 'Broad Back', s: 'life', a: 18 },
    mastery: {
      n: 'Iron Doctrine', s: 'attackDamage', a: 14,
      fx: ['+25 to Guard', 'You cannot be pushed back while attacking (design text)', 'The doctrine is short: advance.']
    },
    r4small: { n: 'Scarred Knuckles', s: 'physical_increased', a: 8 },
    waystone: {
      n: 'The Iron Milestone', s: 'guard', a: 30,
      fx: ['Loops closed around this Waystone empower their center +25% further', 'Your Evasion is 10% lower while you hold the line (design text)', 'Half the column rests here; half never needed to.']
    },
    r6notable: { n: 'Oath of the Front Line', s: 'attackDamage', a: 24, fx: ['+20 to Life', 'Allies behind you take 10% less damage (design text)'] },
    classNode: {
      n: 'Champion', s: 'attackDamage', a: 12,
      fx: ['Unlocks: tower shields become usable', 'Unlocks: war-horn curio slot', 'One of six callings; the first calling you take marks your class.']
    },
    r8notable: { n: 'The Standing Order', s: 'guard_increased', a: 20, fx: ['+15% increased Attack Damage', 'While you have not moved recently, +15% Poise (design text)'] },
    r9notable: { n: 'Last Out of the Breach', s: 'life', a: 40, fx: ['+18% increased Attack Damage', 'Second Breath begins 25% sooner (design text)'] },
    gateway: { n: 'Vanguard Oath Gate', title: 'Vanguard Oath' }
  },
  ritualist: {
    title: 'Ritualist Road', cluster: 'ritualist-spoke',
    doorway: { n: 'First Rite', s: 'spirit', a: 12, x: ['Every service starts with a lit taper and a steady voice.'] },
    r2small: { n: 'Votive Candle', s: 'spellDamage', a: 8 },
    mastery: {
      n: 'Order of Service', s: 'minionDamage', a: 14,
      fx: ['+15 to Spirit', 'Your banners and standing rites reach 15% further (design text)', 'The order is old; the war is older.']
    },
    r4small: { n: 'Ash Blessing', s: 'ember_res', a: 10 },
    waystone: {
      n: 'The Votive Milestone', s: 'spirit', a: 20,
      fx: ['Enclosures you close around this Waystone guard 50% more', 'Your rites cost 5% more Spirit (design text)', 'Offerings pile at its foot. Take nothing.']
    },
    r6notable: { n: 'Battle Liturgy', s: 'minionDamage', a: 24, fx: ['+12% increased Rite Damage', 'Companions within your banner strike 10% faster (design text)'] },
    classNode: {
      n: 'Ritualist', s: 'minionDamage', a: 12,
      fx: ['Unlocks: banners become usable', 'Unlocks: one martial companion-of-war', 'One of six callings; the first calling you take marks your class.']
    },
    r8notable: { n: 'Keeper of the Column', s: 'minionDamage', a: 20, fx: ['+20 to Ward', 'Your companion shares your resistances (design text)'] },
    r9notable: { n: 'The Long Procession', s: 'spellDamage', a: 26, fx: ['+20 to Spirit', 'Rites you maintain persist 3 seconds after you fall (design text)'] },
    gateway: { n: "Seer's Annex Gate", title: "Seer's Annex" }
  }
};

/* =============================================================================
   WEDGES — side seats. Wedge s spans spoke (4+s)%6 toward the next spoke.
   Roles by ring/step: r2 s1 first notable; r4 s2 belt notable; r5 s2 socket;
   r6 s3 keystone; r7 s3 notable; r8 s2 notable + s4 Sign; r9 s2 notable +
   s5 socket; r10 s3 + s6 rim notables. Everything else: authored smalls.
   Smalls per ring: r3 2, r4 2, r5 3, r6 4, r7 5, r8 5, r9 6, r10 7.
   ============================================================================= */
const WEDGES = [
  { /* 0: STR -> Ritualist — The Kiln Line (Ember, Scald, banked defense) */
    id: 'kiln-line', title: 'The Kiln Line',
    firstNotable: { n: 'Stoked Coals', s: 'ailmentEffect', a: 14, fx: ['Adds 3 Ember Damage to hits', 'The kiln teaches: keep them burning.'] },
    beltNotable: { n: 'Banked Fire', s: 'guard', a: 35, fx: ['+10% to Ember Resistance', 'When a Scald on an enemy expires, gain 15 Guard for four seconds (design text)'] },
    keystone: {
      n: 'Oath of Ash',
      fx: ['All of your damage is dealt as Ember', 'You deal no Physical, River, Storm, or Gloam damage', 'Scalds you inflict burn 30% hotter (design text)', 'What the kiln takes, the kiln keeps.']
    },
    r7notable: { n: 'Long Firing', s: 'ailmentEffect', a: 20, fx: ['Adds 5 Ember Damage to hits', 'Scalds you inflict last twice as long (design text)'] },
    r8notable: { n: 'Patience of the Kiln', s: 'ember_res', a: 15, fx: ['+18% increased Ailment Effect', 'Enemies that survive your Scald take +20% Ember from you (design text)'] },
    sign: {
      n: 'Sign of the Kiln',
      fx: ['Born under the Kiln: your Scalds never expire on enemies below half Life', 'You take 20% increased River damage', 'Only one Sign may mark a life.']
    },
    r9notable: { n: 'White Heat', s: 'emberkiss', a: 10, fx: ['+15% increased Attack Speed while any enemy is Scalded (design text)', 'The hottest fire makes no smoke.'] },
    rimNotables: [
      { n: 'The Last Firing', s: 'ailmentEffect', a: 26, fx: ['Enemies you kill while Scalded ignite their nearest ally (design text)'] },
      { n: 'Ash Garden', s: 'guard_increased', a: 22, fx: ['+12% to Ember Resistance', 'Ground you stand on cannot burn you (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Dry Tinder', s: 'emberkiss', a: 3, c: 'kiln-approach' },
        { n: 'Warm Bronze', s: 'attackDamage', a: 8, c: 'kiln-approach', x: ['+4% increased Attack Damage against Scalded enemies (design text)'] }
      ],
      4: [
        { n: 'Charcoal Burner', s: 'guard', a: 20, c: 'kiln-approach' },
        { n: 'First Spark', s: 'ailmentEffect', a: 8, c: 'kiln-approach' }
      ],
      5: [
        { n: 'Kiln Watch', s: 'ember_res', a: 10, c: 'kiln-waist' },
        { n: 'Bellows Rhythm', s: 'attackSpeed', a: 4, c: 'kiln-waist', x: ['Your attack rhythm feeds the fire: +3% Ailment Effect (design text)'] },
        { n: 'Cinder Bed', s: 'emberkiss', a: 5, c: 'kiln-waist' }
      ],
      6: [
        { n: 'Fired Clay', s: 'guard', a: 25, c: 'kiln-oath' },
        { n: 'Glaze Line', s: 'ward', a: 20, c: 'kiln-oath' },
        { n: 'Coal Tally', s: 'ailmentEffect', a: 9, c: 'kiln-oath' },
        { n: 'Second Stoke', s: 'attackDamage', a: 9, c: 'kiln-oath', x: ['Hits against Scalded enemies gain +6% damage (design text)'] }
      ],
      7: [
        { n: 'Kiln Door', s: 'guard_increased', a: 9, c: 'kiln-high' },
        { n: 'Furnace Shift', s: 'attackSpeed', a: 4, c: 'kiln-high' },
        { n: 'Slag Heap', s: 'life', a: 20, c: 'kiln-high' },
        { n: 'Red Glow', s: 'emberkiss', a: 6, c: 'kiln-high', x: ['Your hits shed light; the unlit cannot hide from you (design text)'] },
        { n: 'Quench Trough', s: 'ember_res', a: 12, c: 'kiln-high' }
      ],
      8: [
        { n: 'Overfire', s: 'ailmentEffect', a: 11, c: 'kiln-sign' },
        { n: 'Kilnstone Rings', s: 'guard', a: 30, c: 'kiln-sign' },
        { n: 'Ash Ink', s: 'spellDamage', a: 10, c: 'kiln-sign', x: ['Your rites char what they touch: +4% Ailment Effect (design text)'] },
        { n: 'Ember Tithe', s: 'emberkiss', a: 7, c: 'kiln-sign' },
        { n: 'Firing Order', s: 'attackDamage', a: 10, c: 'kiln-sign' }
      ],
      9: [
        { n: 'Deep Kiln', s: 'guard_increased', a: 11, c: 'kiln-deep' },
        { n: 'Salted Flame', s: 'ailmentEffect', a: 12, c: 'kiln-deep' },
        { n: 'Old Burn Scars', s: 'ember_res', a: 14, c: 'kiln-deep', x: ['You cannot be Scalded while at full Life (design text)'] },
        { n: 'Clay Sweat', s: 'life', a: 25, c: 'kiln-deep' },
        { n: 'Charmaster Habit', s: 'emberkiss', a: 8, c: 'kiln-deep' },
        { n: 'Roaring Draft', s: 'attackSpeed', a: 5, c: 'kiln-deep' }
      ],
      10: [
        { n: 'Kiln Road East', s: 'str', a: 5, c: 'kiln-frontier' },
        { n: 'Kiln Road West', s: 'int', a: 5, c: 'kiln-frontier' },
        { n: 'Cartload of Coal', s: 'str', a: 5, c: 'kiln-frontier' },
        { n: 'Warm Hearthstone', s: 'life', a: 22, c: 'kiln-frontier', x: ['Rest here: Second Breath is 10% faster (design text)'] },
        { n: 'Potter Marks', s: 'int', a: 5, c: 'kiln-frontier' },
        { n: 'Cracked Amphora', s: 'attrs', a: 3, c: 'kiln-frontier' },
        { n: 'Fired Brick Path', s: 'str', a: 5, c: 'kiln-frontier' }
      ]
    }
  },
  { /* 1: Ritualist -> INT — The Procession (rites, wards, companions) */
    id: 'procession', title: 'The Procession',
    firstNotable: { n: 'Called to Serve', s: 'minionDamage', a: 16, fx: ['+10 to Spirit', 'Your first companion costs no upkeep (design text)'] },
    beltNotable: { n: 'Warded Vestments', s: 'ward', a: 35, fx: ['+8% increased Rite Damage', 'Your Ward also shelters companions at half value (design text)'] },
    keystone: {
      n: 'The Tithe',
      fx: ['Your rites cost Life instead of Spirit', 'Your Spirit is reserved in full to your banners and standing rites', 'Blood is the older currency.']
    },
    r7notable: { n: 'Processional Guard', s: 'minionDamage', a: 22, fx: ['+20 to Ward', 'Companions within your banner cannot be Withered (design text)'] },
    r8notable: { n: 'Vigil Unbroken', s: 'ward_pct', a: 20, fx: ['+10 to Spirit', 'Your Ward does not break from Gloam while a rite is maintained (design text)'] },
    sign: {
      n: 'Sign of the Lantern',
      fx: ['Born under the Lantern: your Ward recharges even while you take damage', 'Your Ward is 30% smaller', 'Only one Sign may mark a life.']
    },
    r9notable: { n: 'Second Congregation', s: 'minionDamage', a: 28, fx: ['You may keep one additional companion-of-war (design text)', 'The line behind you is also the line beside you.'] },
    rimNotables: [
      { n: 'The Empty Reliquary', s: 'ward', a: 50, fx: ['Ward gained from this passive counts as a rite for your keystones (design text)'] },
      { n: 'Feast After Service', s: 'spirit', a: 30, fx: ['+12% increased Companion Damage', 'Kills during your rites feed 5 Spirit back (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Censer Smoke', s: 'spellDamage', a: 8, c: 'procession-approach' },
        { n: 'Standard Pole', s: 'minionDamage', a: 8, c: 'procession-approach', x: ['Companions near your banner gain +5% speed (design text)'] }
      ],
      4: [
        { n: 'Anointed Brow', s: 'ward', a: 18, c: 'procession-approach' },
        { n: 'Hymn Cadence', s: 'castSpeed', a: 4, c: 'procession-approach' }
      ],
      5: [
        { n: 'Waymarker Ribbon', s: 'spirit', a: 10, c: 'procession-waist' },
        { n: 'Shared Bread', s: 'life', a: 18, c: 'procession-waist', x: ['Companions heal when you do, at half value (design text)'] },
        { n: 'Chant Rhythm', s: 'castSpeed', a: 4, c: 'procession-waist' }
      ],
      6: [
        { n: 'Oath Beads', s: 'ward', a: 22, c: 'procession-oath' },
        { n: 'Litany Page', s: 'spellDamage', a: 9, c: 'procession-oath' },
        { n: 'Bearer Training', s: 'minionDamage', a: 9, c: 'procession-oath' },
        { n: 'Salt Circle', s: 'gloam_res', a: 10, c: 'procession-oath', x: ['Wither cannot cross the circle while you stand still (design text)'] }
      ],
      7: [
        { n: 'Long Watch', s: 'ward_pct', a: 8, c: 'procession-high' },
        { n: 'Drummer Boy', s: 'minionDamage', a: 10, c: 'procession-high' },
        { n: 'Relay of Torches', s: 'castSpeed', a: 4, c: 'procession-high' },
        { n: 'Sacred Ash', s: 'ember_res', a: 10, c: 'procession-high' },
        { n: 'Column Discipline', s: 'spirit', a: 12, c: 'procession-high', x: ['Your rites are not interrupted by light hits (design text)'] }
      ],
      8: [
        { n: 'Night Office', s: 'spellDamage', a: 10, c: 'procession-sign' },
        { n: 'Lantern Oil', s: 'ward', a: 25, c: 'procession-sign' },
        { n: 'Keeper Keys', s: 'spirit', a: 12, c: 'procession-sign' },
        { n: 'Vested Authority', s: 'minionDamage', a: 10, c: 'procession-sign', x: ['Your companion taunts when you raise a banner (design text)'] },
        { n: 'Incense Coils', s: 'gloam_res', a: 10, c: 'procession-sign' }
      ],
      9: [
        { n: 'Deep Sanctum', s: 'ward_pct', a: 10, c: 'procession-deep' },
        { n: 'Old Devotions', s: 'spellDamage', a: 11, c: 'procession-deep' },
        { n: 'Ossuary Quiet', s: 'gloam_res', a: 12, c: 'procession-deep' },
        { n: 'Warden of Relics', s: 'minionDamage', a: 11, c: 'procession-deep', x: ['Your companion picks up what you leave behind (design text)'] },
        { n: 'Undercroft Lamp', s: 'ward', a: 28, c: 'procession-deep' },
        { n: 'Breviary Margin', s: 'spirit', a: 14, c: 'procession-deep' }
      ],
      10: [
        { n: 'Pilgrim Steps', s: 'int', a: 5, c: 'procession-frontier' },
        { n: 'Roadside Shrine', s: 'attrs', a: 3, c: 'procession-frontier', x: ['Pause here: your next rite costs nothing (design text)'] },
        { n: 'Prayer Flags', s: 'int', a: 5, c: 'procession-frontier' },
        { n: 'Alms Bowl', s: 'spirit', a: 12, c: 'procession-frontier' },
        { n: 'Stone Lantern Row', s: 'str', a: 5, c: 'procession-frontier' },
        { n: 'Vigil Bench', s: 'ward', a: 20, c: 'procession-frontier' },
        { n: 'The Quiet Mile', s: 'int', a: 5, c: 'procession-frontier' }
      ]
    }
  },
  { /* 2: INT -> Nightwork — The Drowned Study (River, Numb, marks, curses) */
    id: 'drowned-study', title: 'The Drowned Study',
    firstNotable: { n: 'Cold Reading', s: 'spellDamage', a: 16, fx: ['+6% to River Resistance', 'Numbed enemies take +8% from your rites (design text)'] },
    beltNotable: { n: 'Undertow', s: 'ailmentEffect', a: 16, fx: ['+10% increased Rite Damage', 'Numb you inflict slows 10% deeper (design text)'] },
    keystone: {
      n: 'Cold Arithmetic',
      fx: ['Your hits never deal critical strikes', 'You deal 35% more damage to Numbed enemies', 'Advantage is for gamblers. The river always collects.']
    },
    r7notable: { n: 'Drowned Archive', s: 'spellDamage', a: 24, fx: ['+15% increased Ailment Effect', 'Your marks persist on enemies that leave your sight (design text)'] },
    r8notable: { n: 'Silt and Silver', s: 'river_resistance', a: 12, fx: ['+18% increased Rite Damage', 'Frozen enemies shatter for River damage around them (design text)'] },
    sign: {
      n: 'Sign of the River',
      fx: ['Born under the River: enemies you Numb are also Marked', 'Your Scalds expire twice as fast', 'Only one Sign may mark a life.']
    },
    r9notable: { n: 'Patient Current', s: 'ailmentEffect', a: 24, fx: ['+15 to Ward', 'Numb builds to Freeze 20% sooner (design text)'] },
    rimNotables: [
      { n: 'The Sunken Bell', s: 'spellDamage', a: 30, fx: ['Once rung, your next rite Numbs everything it touches (design text)'] },
      { n: 'Court of Reeds', s: 'ward', a: 45, fx: ['+10% increased Ailment Effect', 'Marked enemies cannot see past the reeds (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Wet Ink', s: 'spellDamage', a: 8, c: 'drowned-approach' },
        { n: 'River Stone', s: 'river_resistance', a: 8, c: 'drowned-approach', x: ['+6 to Ward while near water in spirit (design text)'] }
      ],
      4: [
        { n: 'Shiver Script', s: 'ailmentEffect', a: 8, c: 'drowned-approach' },
        { n: 'Cold Margin', s: 'ward', a: 18, c: 'drowned-approach' }
      ],
      5: [
        { n: 'Ford Knowledge', s: 'castSpeed', a: 4, c: 'drowned-waist' },
        { n: 'Numb Fingers', s: 'ailmentEffect', a: 9, c: 'drowned-waist', x: ['Your Numb spreads to enemies touching its victim (design text)'] },
        { n: 'Drift Nets', s: 'spellDamage', a: 9, c: 'drowned-waist' }
      ],
      6: [
        { n: 'Sounding Line', s: 'accuracy_flat', a: 40, c: 'drowned-oath' },
        { n: 'Undercurrent', s: 'spellDamage', a: 10, c: 'drowned-oath' },
        { n: 'Blue Lips', s: 'river_resistance', a: 10, c: 'drowned-oath' },
        { n: 'Reed Pen', s: 'ailmentEffect', a: 10, c: 'drowned-oath', x: ['Marks you write cost no Spirit (design text)'] }
      ],
      7: [
        { n: 'Flooded Stacks', s: 'ward', a: 24, c: 'drowned-high' },
        { n: 'Cold Catalogue', s: 'spellDamage', a: 10, c: 'drowned-high' },
        { n: 'Ice Lens', s: 'critChance', a: 1, c: 'drowned-high', x: ['Advantage against Numbed enemies is doubled (design text)'] },
        { n: 'Slow Water', s: 'ailmentEffect', a: 10, c: 'drowned-high' },
        { n: 'Depth Marks', s: 'river_resistance', a: 12, c: 'drowned-high' }
      ],
      8: [
        { n: 'Silt Ledger', s: 'spellDamage', a: 11, c: 'drowned-sign' },
        { n: 'Frozen Margin', s: 'ailmentEffect', a: 11, c: 'drowned-sign' },
        { n: 'The Weir', s: 'ward', a: 26, c: 'drowned-sign', x: ['Enemies that cross toward you are slowed (design text)'] },
        { n: 'Pale Reflection', s: 'castSpeed', a: 5, c: 'drowned-sign' },
        { n: 'Winter Ledgers', s: 'river_resistance', a: 12, c: 'drowned-sign' }
      ],
      9: [
        { n: 'Deep Shelf Reading', s: 'spellDamage', a: 12, c: 'drowned-deep' },
        { n: 'Black Water', s: 'gloam_res', a: 10, c: 'drowned-deep' },
        { n: 'The Undertaker Current', s: 'ailmentEffect', a: 12, c: 'drowned-deep', x: ['Enemies Frozen by you thaw 50% slower (design text)'] },
        { n: 'Silver Silt', s: 'ward', a: 30, c: 'drowned-deep' },
        { n: 'Cold Authority', s: 'castSpeed', a: 5, c: 'drowned-deep' },
        { n: 'Drowned Notes', s: 'spirit', a: 14, c: 'drowned-deep' }
      ],
      10: [
        { n: 'River Road North', s: 'int', a: 5, c: 'drowned-frontier' },
        { n: 'Ferry Toll', s: 'attrs', a: 3, c: 'drowned-frontier' },
        { n: 'Mist Bank', s: 'dex', a: 5, c: 'drowned-frontier', x: ['You are hard to mark in the mist (design text)'] },
        { n: 'Cold Jetty', s: 'int', a: 5, c: 'drowned-frontier' },
        { n: 'Waterline Steps', s: 'ward', a: 20, c: 'drowned-frontier' },
        { n: 'Heron Watch', s: 'dex', a: 5, c: 'drowned-frontier' },
        { n: 'The Far Shore', s: 'int', a: 5, c: 'drowned-frontier' }
      ]
    }
  },
  { /* 3: Nightwork -> DEX — The Unlit Road (Gloam, venom, traps, unseen work) */
    id: 'unlit-road', title: 'The Unlit Road',
    firstNotable: { n: 'Dirty Fighting', s: 'ailmentEffect', a: 14, fx: ['+30 to Evasion', 'Your poisons ignore half of Gloam resistance (design text)'] },
    beltNotable: { n: 'Venom Ledger', s: 'ailmentEffect', a: 18, fx: ['+1% to Critical Chance', 'Poison you inflict stacks one deeper (design text)'] },
    keystone: {
      n: 'Quiet Work',
      fx: ['You deal 40% more damage to enemies that have not hurt you recently', 'Enemies that have hurt you recently take 15% less from you', 'The best work is never witnessed twice.']
    },
    r7notable: { n: 'Tools of the Trade', s: 'ailmentEffect', a: 22, fx: ['+8% increased Attack Speed', 'Your traps arm instantly (design text)'] },
    r8notable: { n: 'The Second Knife', s: 'critChance', a: 2, fx: ['+15% increased Ailment Effect', 'Your first strike from hiding always poisons (design text)'] },
    sign: {
      n: 'Sign of the Adder',
      fx: ['Born under the Adder: your poisons spread on kill', 'You cannot Block', 'Only one Sign may mark a life.']
    },
    r9notable: { n: 'Widow Work', s: 'gloam_res', a: 14, fx: ['+20% increased Ailment Effect', 'Wither you inflict cannot be cleansed (design text)'] },
    rimNotables: [
      { n: 'The Unlit Door', s: 'evasion', a: 60, fx: ['You may pass one enemy without being noticed, once per fight (design text)'] },
      { n: 'Nightsoil Trade', s: 'ailmentEffect', a: 24, fx: ['Poison on Withered enemies deals Gloam instead (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Muffled Steps', s: 'evasion', a: 22, c: 'unlit-approach' },
        { n: 'Thin Blade', s: 'critChance', a: 1, c: 'unlit-approach', x: ['+8% Ailment Effect against unhurt enemies (design text)'] }
      ],
      4: [
        { n: 'Bitter Paste', s: 'ailmentEffect', a: 8, c: 'unlit-approach' },
        { n: 'Gutter Wisdom', s: 'gloam_res', a: 8, c: 'unlit-approach' }
      ],
      5: [
        { n: 'Wire and Bell', s: 'evasion_increased', a: 8, c: 'unlit-waist' },
        { n: 'Milked Fangs', s: 'ailmentEffect', a: 9, c: 'unlit-waist', x: ['Your vials refill on kill (design text)'] },
        { n: 'Dark Adapted', s: 'accuracy_flat', a: 35, c: 'unlit-waist' }
      ],
      6: [
        { n: 'Cellar Route', s: 'evasion', a: 28, c: 'unlit-oath' },
        { n: 'Rasp and File', s: 'attackSpeed', a: 4, c: 'unlit-oath' },
        { n: 'Black Dose', s: 'ailmentEffect', a: 10, c: 'unlit-oath', x: ['Poison from this dose slows (design text)'] },
        { n: 'Shrouded Lantern', s: 'gloam_res', a: 10, c: 'unlit-oath' }
      ],
      7: [
        { n: 'Rooftop Line', s: 'evasion_increased', a: 9, c: 'unlit-high' },
        { n: 'Grave Dust', s: 'gloam_res', a: 12, c: 'unlit-high' },
        { n: 'Twice-Dipped', s: 'ailmentEffect', a: 10, c: 'unlit-high', x: ['Your second poison on a target is 25% stronger (design text)'] },
        { n: 'Silent Count', s: 'critChance', a: 1, c: 'unlit-high' },
        { n: 'Pick and Tension', s: 'attackSpeed', a: 5, c: 'unlit-high' }
      ],
      8: [
        { n: 'Adder Pit', s: 'ailmentEffect', a: 11, c: 'unlit-sign' },
        { n: 'False Papers', s: 'evasion', a: 32, c: 'unlit-sign' },
        { n: 'Cold Trail', s: 'gloam_res', a: 12, c: 'unlit-sign' },
        { n: 'The Fence', s: 'attrs', a: 4, c: 'unlit-sign', x: ['Goods you find are worth 10% more (design text)'] },
        { n: 'Knife Oath', s: 'critChance', a: 1, c: 'unlit-sign' }
      ],
      9: [
        { n: 'Deep Cellars', s: 'evasion_increased', a: 10, c: 'unlit-deep' },
        { n: 'Old Poisoner Notes', s: 'ailmentEffect', a: 12, c: 'unlit-deep' },
        { n: 'Wither Root', s: 'gloam_res', a: 14, c: 'unlit-deep', x: ['Wither you suffer drains 30% slower (design text)'] },
        { n: 'Last Candle', s: 'critChance', a: 1, c: 'unlit-deep' },
        { n: 'Smuggler Hollow', s: 'evasion', a: 35, c: 'unlit-deep' },
        { n: 'Night Ledger', s: 'dex', a: 6, c: 'unlit-deep' }
      ],
      10: [
        { n: 'Unlit Mile One', s: 'dex', a: 5, c: 'unlit-frontier' },
        { n: 'Hooded Marker', s: 'dex', a: 5, c: 'unlit-frontier' },
        { n: 'Thieves Cant', s: 'int', a: 5, c: 'unlit-frontier', x: ['Road signs mean more to you than most (design text)'] },
        { n: 'Ditch Shadow', s: 'evasion', a: 24, c: 'unlit-frontier' },
        { n: 'Owl Hours', s: 'dex', a: 5, c: 'unlit-frontier' },
        { n: 'Buried Cache', s: 'attrs', a: 3, c: 'unlit-frontier' },
        { n: 'The Cold Stile', s: 'dex', a: 5, c: 'unlit-frontier' }
      ]
    }
  },
  { /* 4: DEX -> Skirmisher — The High Paths (Storm, projectiles, speed) */
    id: 'high-paths', title: 'The High Paths',
    firstNotable: { n: 'Head for Heights', s: 'projectileDamage', a: 14, fx: ['+30 to Accuracy', 'Your shots from higher ground Jolt (design text)'] },
    beltNotable: { n: 'Storm Line', s: 'projectileDamage', a: 16, fx: ['+8% to Storm Resistance', 'Jolted enemies take +10% from your projectiles (design text)'] },
    keystone: {
      n: 'The Long Arc',
      fx: ['Your hits deal up to 40% more damage to distant enemies', 'Your hits deal 25% less damage to enemies within reach', 'The mountain teaches patience; the valley pays for it.']
    },
    r7notable: { n: 'Ridge Runner', s: 'move', a: 8, fx: ['+18% increased Projectile Damage', 'Moving downhill, your shots pierce (design text)'] },
    r8notable: { n: 'Thunder Counting', s: 'storm_res', a: 12, fx: ['+18% increased Projectile Damage', 'Your Jolts chain once to the nearest enemy (design text)'] },
    sign: {
      n: 'Sign of the Storm',
      fx: ['Born under the Storm: your Jolts stack twice as high', 'You are always the tallest thing on the field: +15% damage taken from Storm', 'Only one Sign may mark a life.']
    },
    r9notable: { n: 'Eye of the Slinger', s: 'accuracy_flat', a: 70, fx: ['+15% increased Projectile Damage', 'Your misses at long range are rerolled once (design text)'] },
    rimNotables: [
      { n: 'The Watching Peak', s: 'projectileDamage', a: 30, fx: ['You can see marks at any distance (design text)'] },
      { n: 'Gale Shelter', s: 'evasion_increased', a: 22, fx: ['+12% to Storm Resistance', 'Projectiles aimed at you drift in the wind (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Sling Practice', s: 'projectileDamage', a: 8, c: 'high-approach' },
        { n: 'Sure Footing', s: 'evasion', a: 22, c: 'high-approach', x: ['+4% Movement Speed on rough ground (design text)'] }
      ],
      4: [
        { n: 'Dry Bowstring', s: 'attackSpeed', a: 4, c: 'high-approach' },
        { n: 'Wind Reading', s: 'accuracy_flat', a: 35, c: 'high-approach' }
      ],
      5: [
        { n: 'Goat Track', s: 'move', a: 4, c: 'high-waist' },
        { n: 'Static Prickle', s: 'ailmentEffect', a: 9, c: 'high-waist', x: ['Your Jolts last one second longer (design text)'] },
        { n: 'Long Shot Tables', s: 'projectileDamage', a: 9, c: 'high-waist' }
      ],
      6: [
        { n: 'Cliff Nest', s: 'evasion', a: 28, c: 'high-oath' },
        { n: 'Copper Vane', s: 'storm_res', a: 10, c: 'high-oath' },
        { n: 'Second Quiver', s: 'projectileDamage', a: 10, c: 'high-oath', x: ['Your shots recover on kill (design text)'] },
        { n: 'Downdraft Timing', s: 'attackSpeed', a: 4, c: 'high-oath' }
      ],
      7: [
        { n: 'Pass Warden', s: 'projectileDamage', a: 10, c: 'high-high' },
        { n: 'Hail Shrug', s: 'storm_res', a: 12, c: 'high-high' },
        { n: 'Skyline Sprint', s: 'move', a: 5, c: 'high-high', x: ['Sprinting charges your next shot with Storm (design text)'] },
        { n: 'Far Eye', s: 'accuracy_flat', a: 45, c: 'high-high' },
        { n: 'Light Pack', s: 'evasion_increased', a: 9, c: 'high-high' }
      ],
      8: [
        { n: 'Storm Shelf', s: 'projectileDamage', a: 11, c: 'high-sign' },
        { n: 'Lightning Bottle', s: 'ailmentEffect', a: 11, c: 'high-sign', x: ['Once per fight, your Jolt becomes a strike (design text)'] },
        { n: 'Anemometer Habit', s: 'accuracy_flat', a: 50, c: 'high-sign' },
        { n: 'High Camp', s: 'evasion', a: 32, c: 'high-sign' },
        { n: 'Peak Silence', s: 'storm_res', a: 12, c: 'high-sign' }
      ],
      9: [
        { n: 'Deep Ravine Line', s: 'projectileDamage', a: 12, c: 'high-deep' },
        { n: 'Thin Air Lungs', s: 'move', a: 5, c: 'high-deep' },
        { n: 'Thunder Bones', s: 'storm_res', a: 14, c: 'high-deep', x: ['You cannot be Jolted while moving (design text)'] },
        { n: 'Eagle Feathers', s: 'evasion_increased', a: 10, c: 'high-deep' },
        { n: 'Summit Ledger', s: 'dex', a: 6, c: 'high-deep' },
        { n: 'Anchor Cairn', s: 'accuracy_flat', a: 50, c: 'high-deep' }
      ],
      10: [
        { n: 'High Path One', s: 'dex', a: 5, c: 'high-frontier' },
        { n: 'Rope Bridge', s: 'attrs', a: 3, c: 'high-frontier' },
        { n: 'Scree Slope', s: 'dex', a: 5, c: 'high-frontier', x: ['Enemies chase you uphill at their peril (design text)'] },
        { n: 'Kestrel Post', s: 'dex', a: 5, c: 'high-frontier' },
        { n: 'Windbreak Wall', s: 'evasion', a: 24, c: 'high-frontier' },
        { n: 'Old Signal Fire', s: 'str', a: 5, c: 'high-frontier' },
        { n: 'The Last Ridge', s: 'dex', a: 5, c: 'high-frontier' }
      ]
    }
  },
  { /* 5: Skirmisher -> STR — The Red Field (physical, bleed, stun, momentum) */
    id: 'red-field', title: 'The Red Field',
    firstNotable: { n: 'Drawn Blood', s: 'attackDamage', a: 16, fx: ['+8% increased Ailment Effect', 'Your hits against Bleeding enemies cannot be Blocked (design text)'] },
    beltNotable: { n: 'Shield Splitter', s: 'physical_increased', a: 18, fx: ['+15 to Life', 'Your heavy hits break Guard 20% harder (design text)'] },
    keystone: {
      n: 'No Flourish',
      fx: ['Your hits cannot be evaded', 'You never deal critical strikes', 'A straight line, swung hard, wins wars.']
    },
    r7notable: { n: 'Red Harvest', s: 'attackDamage', a: 24, fx: ['+10% increased Ailment Effect', 'Kills against Bleeding enemies heal you 15 Life (design text)'] },
    r8notable: { n: 'The Weight Behind It', s: 'heavy', a: 8, fx: ['+15% increased Attack Damage', 'Your stuns last 25% longer (design text)'] },
    sign: {
      n: 'Sign of the Bull',
      fx: ['Born under the Bull: your actions cannot be interrupted while your Poise holds', 'You cannot dodge or give ground', 'Only one Sign may mark a life.']
    },
    r9notable: { n: 'Wading In', s: 'life', a: 45, fx: ['+16% increased Attack Damage', 'Each enemy in reach adds +4% to your damage (design text)'] },
    rimNotables: [
      { n: 'The Red Standard', s: 'attackDamage', a: 30, fx: ['Enemies that see your standard Bleed easier (design text)'] },
      { n: 'Field Surgeon Scorn', s: 'life', a: 55, fx: ['+10% increased Ailment Effect', 'Your Bleeds close only when their victim falls (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Nicked Bronze', s: 'attackDamage', a: 8, c: 'red-approach' },
        { n: 'Open Vein', s: 'ailmentEffect', a: 8, c: 'red-approach', x: ['Bleeds you inflict on moving enemies worsen (design text)'] }
      ],
      4: [
        { n: 'Braced Stance', s: 'guard', a: 20, c: 'red-approach' },
        { n: 'Follow Through', s: 'attackDamage', a: 8, c: 'red-approach' }
      ],
      5: [
        { n: 'Whetstone Habit', s: 'physical_increased', a: 8, c: 'red-waist' },
        { n: 'Corded Forearms', s: 'attackSpeed', a: 4, c: 'red-waist' },
        { n: 'Taste of Iron', s: 'life', a: 20, c: 'red-waist', x: ['Bleeding enemies feed your Second Breath (design text)'] }
      ],
      6: [
        { n: 'Broken Teeth', s: 'attackDamage', a: 9, c: 'red-oath' },
        { n: 'Shield Wall Scars', s: 'guard', a: 25, c: 'red-oath' },
        { n: 'Red Work', s: 'ailmentEffect', a: 10, c: 'red-oath', x: ['Your Bleeds stack on Bleeding enemies (design text)'] },
        { n: 'Heavy Footfall', s: 'heavy', a: 4, c: 'red-oath' }
      ],
      7: [
        { n: 'Drummed Advance', s: 'attackSpeed', a: 5, c: 'red-high' },
        { n: 'Pike Discipline', s: 'reach_increased', a: 8, c: 'red-high' },
        { n: 'Muddy Ground', s: 'guard_increased', a: 9, c: 'red-high' },
        { n: 'Crimson Tally', s: 'attackDamage', a: 10, c: 'red-high', x: ['Each Bleeding enemy adds +2% Attack Damage (design text)'] },
        { n: 'Butcher Economy', s: 'ailmentEffect', a: 10, c: 'red-high' }
      ],
      8: [
        { n: 'Bull Pens', s: 'life', a: 28, c: 'red-sign' },
        { n: 'Gore Furrow', s: 'ailmentEffect', a: 11, c: 'red-sign' },
        { n: 'Trampled Line', s: 'attackDamage', a: 10, c: 'red-sign', x: ['Enemies you stun are trampled for extra Physical (design text)'] },
        { n: 'Horn Scar', s: 'guard', a: 30, c: 'red-sign' },
        { n: 'Red Clay Underfoot', s: 'physical_increased', a: 10, c: 'red-sign' }
      ],
      9: [
        { n: 'Deep Field Ruts', s: 'attackDamage', a: 11, c: 'red-deep' },
        { n: 'Old Standard Pole', s: 'life', a: 30, c: 'red-deep' },
        { n: 'Marrow Memory', s: 'ailmentEffect', a: 12, c: 'red-deep', x: ['Your Bleeds remember: reapplying restores full duration (design text)'] },
        { n: 'Sheaf of Spears', s: 'reach_increased', a: 10, c: 'red-deep' },
        { n: 'Threshing Rhythm', s: 'attackSpeed', a: 5, c: 'red-deep' },
        { n: 'Salted Earth', s: 'guard', a: 32, c: 'red-deep' }
      ],
      10: [
        { n: 'Red Field Gate Road', s: 'str', a: 5, c: 'red-frontier' },
        { n: 'Broken Cart Axle', s: 'str', a: 5, c: 'red-frontier' },
        { n: 'Crow Fence', s: 'attrs', a: 3, c: 'red-frontier', x: ['The crows remember who fed them (design text)'] },
        { n: 'Boot Churn', s: 'str', a: 5, c: 'red-frontier' },
        { n: 'Rust Bloom', s: 'life', a: 22, c: 'red-frontier' },
        { n: 'Old Rampart Line', s: 'guard', a: 22, c: 'red-frontier' },
        { n: 'The Long Furrow', s: 'str', a: 5, c: 'red-frontier' }
      ]
    }
  }
];

const CORNER_SPOKES = ['int', 'nightwork', 'dex', 'skirmisher', 'str', 'ritualist'];
const CORNER_ROLE = { 1: 'doorway', 2: 'r2small', 3: 'mastery', 4: 'r4small', 5: 'waystone', 6: 'r6notable', 7: 'classNode', 8: 'r8notable', 9: 'r9notable', 10: 'gateway' };
const SIDE_ROLE = {
  2: { 1: 'firstNotable' },
  4: { 2: 'beltNotable' },
  5: { 2: 'socket' },
  6: { 3: 'keystone' },
  7: { 3: 'r7notable' },
  8: { 2: 'r8notable', 4: 'sign' },
  9: { 2: 'r9notable', 5: 'socket' },
  10: { 3: 'rim0', 6: 'rim1' }
};
const TYPE_FOR_ROLE = {
  doorway: 'small', r2small: 'small', r4small: 'small', mastery: 'mastery',
  waystone: 'waystone', r6notable: 'notable', classNode: 'class', r8notable: 'notable',
  r9notable: 'notable', gateway: 'gateway', firstNotable: 'notable', beltNotable: 'notable',
  keystone: 'keystone', sign: 'sign', r7notable: 'notable', rim0: 'notable', rim1: 'notable',
  socket: 'socket', small: 'small'
};

function seatFromEntry(entry, { id, q, r, ring, type, cluster, status = 'review' }) {
  const effects = [];
  if (entry.s) effects.push(lineFor(entry.s, entry.a));
  (entry.fx || entry.x || []).forEach(line => effects.push(line));
  return {
    id, q, r, ring, type,
    axis: axisFor(q, r),
    effects,
    stat: entry.s || null,
    amount: typeof entry.a === 'number' ? entry.a : 0,
    tags: entry.tags || [],
    clusterId: entry.c || cluster,
    status,
    notes: '',
    name: entry.n
  };
}

function buildSeats() {
  const seats = {};
  seats['0,0'] = {
    id: '0,0', q: 0, r: 0, ring: 0, type: 'origin', axis: 'hybrid',
    effects: ['Starting point. No passive bonus.'],
    stat: null, amount: 0, tags: [], clusterId: 'origin', status: 'final', notes: '', name: 'Origin'
  };

  const smallCursors = WEDGES.map(() => ({}));

  for (let ring = 1; ring <= DEPTH; ring += 1) {
    let q = HEX_DIRECTIONS[4].q * ring;
    let r = HEX_DIRECTIONS[4].r * ring;
    for (let side = 0; side < 6; side += 1) {
      for (let step = 0; step < ring; step += 1) {
        const id = `${q},${r}`;
        if (step === 0) {
          const cornerIndex = (4 + side) % 6;
          const spoke = SPOKES[CORNER_SPOKES[cornerIndex]];
          const role = CORNER_ROLE[ring];
          const entry = spoke[role];
          if (!entry) throw new Error(`Missing spoke entry ${CORNER_SPOKES[cornerIndex]}.${role}`);
          if (role === 'gateway') {
            seats[id] = {
              id, q, r, ring, type: 'gateway', axis: axisFor(q, r),
              effects: [
                `Shared gate for the ${entry.title} outer circle.`,
                'Unlock condition: allocate this gate and complete any inner six-node circle.'
              ],
              stat: null, amount: 0, tags: ['gateway', entry.title],
              clusterId: spoke.cluster, status: 'review', notes: '', name: entry.n
            };
          } else {
            seats[id] = seatFromEntry(entry, {
              id, q, r, ring, type: TYPE_FOR_ROLE[role], cluster: spoke.cluster
            });
          }
        } else {
          const wedge = WEDGES[side];
          const role = SIDE_ROLE[ring]?.[step] || 'small';
          if (role === 'small') {
            const cursor = smallCursors[side];
            cursor[ring] = cursor[ring] || 0;
            const entry = wedge.smallsByRing[ring]?.[cursor[ring]];
            if (!entry) throw new Error(`Out of authored smalls: wedge ${wedge.id} ring ${ring} index ${cursor[ring]}`);
            cursor[ring] += 1;
            seats[id] = seatFromEntry(entry, { id, q, r, ring, type: 'small', cluster: entry.c });
          } else if (role === 'socket') {
            const depthName = ring === 5 ? 'Socket' : 'Deep Socket';
            seats[id] = {
              id, q, r, ring, type: 'socket', axis: axisFor(q, r),
              effects: [
                'An empty seat carved for a whorl-stone.',
                'Does nothing while empty; carved stones arrive with the stone-carver.'
              ],
              stat: null, amount: 0, tags: ['socket'],
              clusterId: `${wedge.id}-sockets`, status: 'review', notes: '',
              name: `${wedge.title} ${depthName}`
            };
          } else {
            const entry = role === 'rim0' ? wedge.rimNotables[0]
              : role === 'rim1' ? wedge.rimNotables[1]
                : wedge[role];
            if (!entry) throw new Error(`Missing wedge entry ${wedge.id}.${role}`);
            seats[id] = seatFromEntry(entry, {
              id, q, r, ring, type: TYPE_FOR_ROLE[role], cluster: `${wedge.id}-named`
            });
          }
        }
        q += HEX_DIRECTIONS[side].q;
        r += HEX_DIRECTIONS[side].r;
      }
    }
  }
  return seats;
}

function main() {
  const source = readFileSync(TREE_DATA_PATH, 'utf8');
  const marker = 'global.TREE_DATA = ';
  const jsonStart = source.indexOf(marker) + marker.length;
  const jsonEnd = source.lastIndexOf('};');
  const existing = JSON.parse(source.slice(jsonStart, jsonEnd + 1));

  const seats = buildSeats();
  const count = Object.keys(seats).length;
  if (count !== 331) throw new Error(`Expected 331 seats, built ${count}`);

  const names = new Map();
  Object.values(seats).forEach(seat => {
    if (['small', 'origin', 'socket'].includes(seat.type)) return;
    if (names.has(seat.name)) throw new Error(`Duplicate named seat "${seat.name}" (${names.get(seat.name)} and ${seat.id})`);
    names.set(seat.name, seat.id);
  });

  const data = {
    ...existing,
    phase: 4,
    metadata: {
      generatedFrom: 'tools/geometric_skilltree/scripts/author-tree.mjs (hand-authored tables)',
      generatedAt: new Date().toISOString().slice(0, 10),
      intent: 'Phase 4 authored tree: every seat is deliberate data. Zero hash-generated content.'
    },
    seats
  };

  const body = `(function(global) {\n  global.TREE_DATA = ${JSON.stringify(data, null, 2)};\n})(typeof window !== "undefined" ? window : globalThis);\n`;
  writeFileSync(TREE_DATA_PATH, body);
  console.log(`Wrote ${count} authored seats (${names.size} unique named seats).`);
}

main();
