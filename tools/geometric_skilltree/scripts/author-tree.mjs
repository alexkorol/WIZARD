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
  emberkiss: a => `Adds ${a} Fire Damage to hits`,
  critChance: a => `+${a}% to Critical Chance`,
  crit_bonus_flat: a => `+${a}% to Critical Damage Bonus`,
  blockChance: a => `+${a}% to Block Chance`,
  allResistances: a => `+${a}% to all Resistances`,
  ember_res: a => `+${a}% to Fire Resistance`,
  river_resistance: a => `+${a}% to Cold Resistance`,
  storm_res: a => `+${a}% to Lightning Resistance`,
  gloam_res: a => `+${a}% to Chaos Resistance`,
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
    title: 'Archmage', cluster: 'int-spoke',
    doorway: { n: 'Rite Damage', s: 'spellDamage', a: 10, x: ['A clean opening: rites hit harder from the first day.'] },
    r2small: { n: 'Spirit', s: 'spirit', a: 12 },
    mastery: {
      n: 'Ward Mastery', s: 'spellDamage', a: 14,
      fx: ['+20 to Ward', 'Your Ward recharge begins 20% sooner']
    },
    r4small: { n: 'Rite Speed', s: 'castSpeed', a: 5 },
    waystone: {
      n: 'Archmage Waystone', s: 'ward', a: 30,
      hook: { effect: 'wave-length', value: 1 },
      fx: ['Waves passing through this Waystone count +1 length', 'Ward recharge is 10% slower']
    },
    r6notable: { n: 'Repeated Rites', s: 'spellDamage', a: 26, fx: ['+15 to Spirit', 'Rites you repeat within four seconds gain +10% effect (design text)'] },
    classNode: {
      n: 'Archmage', s: 'spellDamage', a: 15,
      fx: ['Unlocks: a second curio slot', 'Unlocks: rite-foci gain +1 socket', 'Unlocks: 2x2 Attendant focus seat', 'Your first class passive sets your class; each class passive grants its unlock.']
    },
    r8notable: { n: 'Ward Retention', s: 'ward_pct', a: 18, fx: ['+12% increased Rite Damage', 'You keep 10% of Ward when a hit would empty it (design text)'] },
    r9notable: { n: 'Efficient Rites', s: 'spellDamage', a: 30, fx: ['+30 to Ward', 'Rites cost 5% less Spirit (design text)'] },
    gateway: { n: 'Archmage Gate', title: 'Archmage' }
  },
  nightwork: {
    title: 'Assassin', cluster: 'nightwork-spoke',
    doorway: { n: 'Ailment Effect', s: 'ailmentEffect', a: 10, x: ['Small wounds, patiently kept open.'] },
    r2small: { n: 'Chaos Resistance', s: 'gloam_res', a: 8 },
    mastery: {
      n: 'Ailment Mastery', s: 'ailmentEffect', a: 16,
      fx: ['+1% to Critical Chance', 'Your marks last 20% longer (design text)']
    },
    r4small: { n: 'Evasion', s: 'evasion', a: 25 },
    waystone: {
      n: 'Assassin Waystone', s: 'ailmentEffect', a: 12,
      hook: { effect: 'flow-length', value: 1 },
      fx: ['Flows passing through this Waystone count +1 length', 'You show your position when you strike: +5% damage taken for two seconds (design text)']
    },
    r6notable: { n: 'Deeper Wither', s: 'gloam_res', a: 12, fx: ['+18% increased Ailment Effect', 'Wither you inflict stacks one deeper (design text)'] },
    classNode: {
      n: 'Assassin', s: 'ailmentEffect', a: 12,
      fx: ['Unlocks: trap and mark tools become equippable', 'Unlocks: venom vial slot', 'Unlocks: 4x4 Preparation Case', 'Your first class passive sets your class; each class passive grants its unlock.']
    },
    r8notable: { n: 'Poison Marked Enemies', s: 'ailmentEffect', a: 20, fx: ['+1.5% to Critical Chance', 'Poisons you inflict on marked enemies deal 15% more (design text)'] },
    r9notable: { n: 'Mark Ally Killers', s: 'gloam_res', a: 15, fx: ['+22% increased Ailment Effect', 'Enemies that kill your allies are marked for you (design text)'] },
    gateway: { n: 'Assassin Gate', title: 'Assassin' }
  },
  dex: {
    title: 'Acrobat', cluster: 'dex-spoke',
    doorway: { n: 'Evasion', s: 'evasion', a: 24, x: ['Begin by not being where the blow lands.'] },
    r2small: { n: 'Evasion', s: 'evasion_increased', a: 8 },
    mastery: {
      n: 'Evasion Mastery', s: 'evasion_increased', a: 14,
      fx: ['+40 to Accuracy', '+4% increased Movement Speed']
    },
    r4small: { n: 'Attack Speed', s: 'attackSpeed', a: 5 },
    waystone: {
      n: 'Acrobat Waystone', s: 'evasion', a: 45,
      hook: { effect: 'rod-double' },
      fx: ['Rods ending on this Waystone empower both endpoints twice', 'You cannot Block while you keep this pace (design text)']
    },
    r6notable: { n: 'Sure First Hit', s: 'accuracy_flat', a: 60, fx: ['+12% increased Attack Speed', 'Your first hit on an unhurt enemy always lands (design text)'] },
    classNode: {
      n: 'Acrobat', s: 'evasion_increased', a: 12,
      fx: ['Unlocks: a second weapon set for swapping', 'Unlocks: dual-wielding one-handers', 'Unlocks: 2x2 Quick Rig seat', 'Your first class passive sets your class; each class passive grants its unlock.']
    },
    r8notable: { n: 'Evasion Haste', s: 'evasion_increased', a: 22, fx: ['+5% increased Movement Speed', 'Evading a hit hastens your next action by 10% (design text)'] },
    r9notable: { n: 'Punish Misses', s: 'crit_bonus_flat', a: 25, fx: ['+50 to Accuracy', 'Hits against enemies that just missed you gain +1% Critical Chance (design text)'] },
    gateway: { n: 'Acrobat Gate', title: 'Acrobat' }
  },
  skirmisher: {
    title: 'Reaver', cluster: 'skirmisher-spoke',
    doorway: { n: 'Projectile Damage', s: 'projectileDamage', a: 10, x: ['Everything in camp can be thrown once.'] },
    r2small: { n: 'Projectile Damage', s: 'projectileDamage', a: 8 },
    mastery: {
      n: 'Projectile Mastery', s: 'projectileDamage', a: 12,
      fx: ['+6% increased Attack Speed', 'Moving between attacks adds +8% damage to the next one (design text)']
    },
    r4small: { n: 'Attack Speed', s: 'attackSpeed', a: 5 },
    waystone: {
      n: 'Reaver Waystone', s: 'projectileDamage', a: 16,
      hook: { effect: 'shared-claim' },
      fx: ['Waves and flows may both claim conduits touching this Waystone', '-10% increased Reach']
    },
    r6notable: { n: 'Throwing While Moving', s: 'projectileDamage', a: 24, fx: ['+5% increased Movement Speed', 'Thrown hits while moving gain +10% damage (design text)'] },
    classNode: {
      n: 'Reaver', s: 'projectileDamage', a: 12,
      fx: ['Unlocks: thrown weapons count as melee AND projectile', 'Unlocks: belt fetish slot', 'Unlocks: 4x4 Spoils Roll', 'Your first class passive sets your class; each class passive grants its unlock.']
    },
    r8notable: { n: 'Returning Throws', s: 'attackSpeed', a: 12, fx: ['+15% increased Projectile Damage', 'Your throws return to hand on kill (design text)'] },
    r9notable: { n: 'Recovered Throws', s: 'projectileDamage', a: 28, fx: ['+40 to Accuracy', 'Missed throws can be recovered where they landed (design text)'] },
    gateway: { n: 'Reaver Gate', title: 'Reaver' }
  },
  str: {
    title: 'Champion', cluster: 'str-spoke',
    doorway: { n: 'Attack Damage', s: 'attackDamage', a: 9, x: ['Hold the haft like it owes you money.'] },
    r2small: { n: 'Life', s: 'life', a: 18 },
    mastery: {
      n: 'Attack Mastery', s: 'attackDamage', a: 14,
      fx: ['+25 to Guard', 'You cannot be pushed back while attacking (design text)']
    },
    r4small: { n: 'Physical Damage', s: 'physical_increased', a: 8 },
    waystone: {
      n: 'Champion Waystone', s: 'guard', a: 30,
      hook: { effect: 'loop-boost', value: 0.25 },
      fx: ['Loops closed around this Waystone empower their center +25% further', 'Your Evasion is 10% lower while you hold the line (design text)']
    },
    r6notable: { n: 'Ally Protection', s: 'attackDamage', a: 24, fx: ['+20 to Life', 'Allies behind you take 10% less damage (design text)'] },
    classNode: {
      n: 'Champion', s: 'attackDamage', a: 12,
      fx: ['Unlocks: tower shields become usable', 'Unlocks: 2x2 War Horn seat', 'Your first class passive sets your class; each class passive grants its unlock.']
    },
    r8notable: { n: 'Steady Stance', s: 'guard_increased', a: 20, fx: ['+15% increased Attack Damage', 'While you have not moved recently, +15% Poise (design text)'] },
    r9notable: { n: 'Faster Recovery', s: 'life', a: 40, fx: ['+18% increased Attack Damage', 'Out-of-combat Life regeneration starts 25% sooner (design text)'] },
    gateway: { n: 'Champion Gate', title: 'Champion' }
  },
  ritualist: {
    title: 'Ritualist', cluster: 'ritualist-spoke',
    doorway: { n: 'Spirit', s: 'spirit', a: 12, x: ['Every service starts with a lit taper and a steady voice.'] },
    r2small: { n: 'Rite Damage', s: 'spellDamage', a: 8 },
    mastery: {
      n: 'Companion Mastery', s: 'minionDamage', a: 14,
      fx: ['+15 to Spirit', 'Your banners and standing rites reach 15% further (design text)']
    },
    r4small: { n: 'Fire Resistance', s: 'ember_res', a: 10 },
    waystone: {
      n: 'Ritualist Waystone', s: 'spirit', a: 20,
      hook: { effect: 'enclosure-boost', value: 0.5 },
      fx: ['Enclosures you close around this Waystone guard 50% more', 'Your rites cost 5% more Spirit (design text)']
    },
    r6notable: { n: 'Banner Attack Speed', s: 'minionDamage', a: 24, fx: ['+12% increased Rite Damage', 'Companions within your banner strike 10% faster (design text)'] },
    classNode: {
      n: 'Ritualist', s: 'minionDamage', a: 12,
      fx: ['Unlocks: banners become usable', 'Unlocks: one martial companion', 'Unlocks: 4x4 Reliquary', 'Your first class passive sets your class; each class passive grants its unlock.']
    },
    r8notable: { n: 'Shared Resistances', s: 'minionDamage', a: 20, fx: ['+20 to Ward', 'Your companion shares your resistances (design text)'] },
    r9notable: { n: 'Lingering Rites', s: 'spellDamage', a: 26, fx: ['+20 to Spirit', 'Rites you maintain persist 3 seconds after you fall (design text)'] },
    gateway: { n: 'Ritualist Gate', title: 'Ritualist' }
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
  { /* 0: STR -> Ritualist — The Kiln Line (Fire, Scald, banked defense) */
    id: 'kiln-line', title: 'Fire',
    firstNotable: { n: 'Fire Ailments', s: 'ailmentEffect', a: 14, fx: ['Adds 3 Fire Damage to hits'] },
    beltNotable: { n: 'Guard from Ignites', s: 'guard', a: 35, fx: ['+10% to Fire Resistance', 'When a Ignite on an enemy expires, gain 15 Guard for four seconds (design text)'] },
    keystone: {
      n: 'All Damage as Fire',
      fx: ['All of your damage is dealt as Fire', 'You deal no Physical, Cold, Lightning, or Chaos damage', 'Ignites you inflict burn 30% hotter (design text)']
    },
    r7notable: { n: 'Lasting Ignites', s: 'ailmentEffect', a: 20, fx: ['Adds 5 Fire Damage to hits', 'Ignites you inflict last twice as long (design text)'] },
    r8notable: { n: 'Ignite Exposure', s: 'ember_res', a: 15, fx: ['+18% increased Ailment Effect', 'Enemies that survive your Ignite take +20% Fire damage from you (design text)'] },
    sign: {
      n: 'Sign: Unending Ignites',
      fx: ['Your Ignites never expire on enemies below half Life', 'You take 20% increased Cold damage', 'You can have only one Sign.']
    },
    r9notable: { n: 'Ignite Attack Speed', s: 'emberkiss', a: 10, fx: ['+15% increased Attack Speed while any enemy is Ignited (design text)'] },
    rimNotables: [
      { n: 'Spreading Ignites', s: 'ailmentEffect', a: 26, fx: ['Enemies you kill while Ignited ignite their nearest ally (design text)'] },
      { n: 'Burning Ground Immunity', s: 'guard_increased', a: 22, fx: ['+12% to Fire Resistance', 'Ground you stand on cannot burn you (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Added Fire Damage', s: 'emberkiss', a: 3, c: 'kiln-approach' },
        { n: 'Attack Damage', s: 'attackDamage', a: 8, c: 'kiln-approach', x: ['+4% increased Attack Damage against Ignited enemies (design text)'] }
      ],
      4: [
        { n: 'Guard', s: 'guard', a: 20, c: 'kiln-approach' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 8, c: 'kiln-approach' }
      ],
      5: [
        { n: 'Fire Resistance', s: 'ember_res', a: 10, c: 'kiln-waist' },
        { n: 'Attack Speed', s: 'attackSpeed', a: 4, c: 'kiln-waist', x: ['+3% increased Ailment Effect (design text)'] },
        { n: 'Added Fire Damage', s: 'emberkiss', a: 5, c: 'kiln-waist' }
      ],
      6: [
        { n: 'Guard', s: 'guard', a: 25, c: 'kiln-oath' },
        { n: 'Ward', s: 'ward', a: 20, c: 'kiln-oath' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 9, c: 'kiln-oath' },
        { n: 'Attack Damage', s: 'attackDamage', a: 9, c: 'kiln-oath', x: ['Hits against Ignited enemies gain +6% damage (design text)'] }
      ],
      7: [
        { n: 'Guard', s: 'guard_increased', a: 9, c: 'kiln-high' },
        { n: 'Attack Speed', s: 'attackSpeed', a: 4, c: 'kiln-high' },
        { n: 'Life', s: 'life', a: 20, c: 'kiln-high' },
        { n: 'Added Fire Damage', s: 'emberkiss', a: 6, c: 'kiln-high', x: ['Your hits shed light; the unlit cannot hide from you (design text)'] },
        { n: 'Fire Resistance', s: 'ember_res', a: 12, c: 'kiln-high' }
      ],
      8: [
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 11, c: 'kiln-sign' },
        { n: 'Guard', s: 'guard', a: 30, c: 'kiln-sign' },
        { n: 'Rite Damage', s: 'spellDamage', a: 10, c: 'kiln-sign', x: ['+4% increased Ailment Effect (design text)'] },
        { n: 'Added Fire Damage', s: 'emberkiss', a: 6, c: 'kiln-sign' },
        { n: 'Attack Damage', s: 'attackDamage', a: 10, c: 'kiln-sign' }
      ],
      9: [
        { n: 'Guard', s: 'guard_increased', a: 11, c: 'kiln-deep' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 12, c: 'kiln-deep' },
        { n: 'Fire Resistance', s: 'ember_res', a: 14, c: 'kiln-deep', x: ['You cannot be Ignited while at full Life (design text)'] },
        { n: 'Life', s: 'life', a: 25, c: 'kiln-deep' },
        { n: 'Added Fire Damage', s: 'emberkiss', a: 6, c: 'kiln-deep' },
        { n: 'Attack Speed', s: 'attackSpeed', a: 5, c: 'kiln-deep' }
      ],
      10: [
        { n: 'Strength', s: 'str', a: 5, c: 'kiln-frontier' },
        { n: 'Intelligence', s: 'int', a: 5, c: 'kiln-frontier' },
        { n: 'Strength', s: 'str', a: 5, c: 'kiln-frontier' },
        { n: 'Life', s: 'life', a: 22, c: 'kiln-frontier', x: ['Out-of-combat Life regeneration starts 10% sooner (design text)'] },
        { n: 'Intelligence', s: 'int', a: 5, c: 'kiln-frontier' },
        { n: 'All Attributes', s: 'attrs', a: 3, c: 'kiln-frontier' },
        { n: 'Strength', s: 'str', a: 5, c: 'kiln-frontier' }
      ]
    }
  },
  { /* 1: Ritualist -> INT — The Procession (rites, wards, companions) */
    id: 'procession', title: 'Companions and Rites',
    firstNotable: { n: 'Free Companion', s: 'minionDamage', a: 16, fx: ['+10 to Spirit', 'Your first companion costs no upkeep (design text)'] },
    beltNotable: { n: 'Shared Ward', s: 'ward', a: 35, fx: ['+8% increased Rite Damage', 'Your Ward also shelters companions at half value (design text)'] },
    keystone: {
      n: 'Rites Cost Life',
      fx: ['Your rites cost Life instead of Spirit', 'Your Spirit is reserved in full to your banners and standing rites']
    },
    r7notable: { n: 'Protected Companions', s: 'minionDamage', a: 22, fx: ['+20 to Ward', 'Companions within your banner cannot be Withered (design text)'] },
    r8notable: { n: 'Steady Ward', s: 'ward_pct', a: 20, fx: ['+10 to Spirit', 'Your Ward does not break from Chaos damage while a rite is maintained (design text)'] },
    sign: {
      n: 'Sign: Ward Under Fire',
      fx: ['Your Ward recharges even while you take damage', 'Your Ward is 30% smaller', 'You can have only one Sign.']
    },
    r9notable: { n: 'Extra Companion', s: 'minionDamage', a: 28, fx: ['You may keep one additional companion (design text)'] },
    rimNotables: [
      { n: 'Ward Counts as Rite', s: 'ward', a: 50, fx: ['Ward gained from this passive counts as a rite for your keystones (design text)'] },
      { n: 'Spirit on Kill', s: 'spirit', a: 30, fx: ['+12% increased Companion Damage', 'Kills during your rites feed 5 Spirit back (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Rite Damage', s: 'spellDamage', a: 8, c: 'procession-approach' },
        { n: 'Companion Damage', s: 'minionDamage', a: 8, c: 'procession-approach', x: ['Companions near your banner gain +5% speed (design text)'] }
      ],
      4: [
        { n: 'Ward', s: 'ward', a: 18, c: 'procession-approach' },
        { n: 'Rite Speed', s: 'castSpeed', a: 4, c: 'procession-approach' }
      ],
      5: [
        { n: 'Spirit', s: 'spirit', a: 10, c: 'procession-waist' },
        { n: 'Life', s: 'life', a: 18, c: 'procession-waist', x: ['Companions heal when you do, at half value (design text)'] },
        { n: 'Rite Speed', s: 'castSpeed', a: 4, c: 'procession-waist' }
      ],
      6: [
        { n: 'Ward', s: 'ward', a: 22, c: 'procession-oath' },
        { n: 'Rite Damage', s: 'spellDamage', a: 9, c: 'procession-oath' },
        { n: 'Companion Damage', s: 'minionDamage', a: 9, c: 'procession-oath' },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 10, c: 'procession-oath', x: ['Wither cannot cross the circle while you stand still (design text)'] }
      ],
      7: [
        { n: 'Ward', s: 'ward_pct', a: 8, c: 'procession-high' },
        { n: 'Companion Damage', s: 'minionDamage', a: 10, c: 'procession-high' },
        { n: 'Rite Speed', s: 'castSpeed', a: 4, c: 'procession-high' },
        { n: 'Fire Resistance', s: 'ember_res', a: 10, c: 'procession-high' },
        { n: 'Spirit', s: 'spirit', a: 12, c: 'procession-high', x: ['Your rites are not interrupted by light hits (design text)'] }
      ],
      8: [
        { n: 'Rite Damage', s: 'spellDamage', a: 10, c: 'procession-sign' },
        { n: 'Ward', s: 'ward', a: 25, c: 'procession-sign' },
        { n: 'Spirit', s: 'spirit', a: 12, c: 'procession-sign' },
        { n: 'Companion Damage', s: 'minionDamage', a: 10, c: 'procession-sign', x: ['Your companion taunts when you raise a banner (design text)'] },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 10, c: 'procession-sign' }
      ],
      9: [
        { n: 'Ward', s: 'ward_pct', a: 10, c: 'procession-deep' },
        { n: 'Rite Damage', s: 'spellDamage', a: 11, c: 'procession-deep' },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 12, c: 'procession-deep' },
        { n: 'Companion Damage', s: 'minionDamage', a: 11, c: 'procession-deep', x: ['Your companion picks up what you leave behind (design text)'] },
        { n: 'Ward', s: 'ward', a: 28, c: 'procession-deep' },
        { n: 'Spirit', s: 'spirit', a: 14, c: 'procession-deep' }
      ],
      10: [
        { n: 'Intelligence', s: 'int', a: 5, c: 'procession-frontier' },
        { n: 'All Attributes', s: 'attrs', a: 3, c: 'procession-frontier', x: ['Your next rite costs no Spirit (design text)'] },
        { n: 'Intelligence', s: 'int', a: 5, c: 'procession-frontier' },
        { n: 'Spirit', s: 'spirit', a: 12, c: 'procession-frontier' },
        { n: 'Strength', s: 'str', a: 5, c: 'procession-frontier' },
        { n: 'Ward', s: 'ward', a: 20, c: 'procession-frontier' },
        { n: 'Intelligence', s: 'int', a: 5, c: 'procession-frontier' }
      ]
    }
  },
  { /* 2: INT -> Nightwork — The Drowned Study (Cold, Numb, marks, curses) */
    id: 'drowned-study', title: 'Cold',
    firstNotable: { n: 'Chilled Targets', s: 'spellDamage', a: 16, fx: ['+6% to Cold Resistance', 'Chilled enemies take +8% from your rites (design text)'] },
    beltNotable: { n: 'Deeper Chill', s: 'ailmentEffect', a: 16, fx: ['+10% increased Rite Damage', 'Chill you inflict slows 10% deeper (design text)'] },
    keystone: {
      n: 'Chill Over Criticals',
      fx: ['Your hits never deal critical strikes', 'You deal 35% more damage to Chilled enemies']
    },
    r7notable: { n: 'Persistent Marks', s: 'spellDamage', a: 24, fx: ['+15% increased Ailment Effect', 'Your marks persist on enemies that leave your sight (design text)'] },
    r8notable: { n: 'Shattering Freeze', s: 'river_resistance', a: 12, fx: ['+18% increased Rite Damage', 'Frozen enemies shatter for Cold damage around them (design text)'] },
    sign: {
      n: 'Sign: Mark Chilled Enemies',
      fx: ['Enemies you Chill are also Marked', 'Your Ignites expire twice as fast', 'You can have only one Sign.']
    },
    r9notable: { n: 'Faster Freeze', s: 'ailmentEffect', a: 24, fx: ['+15 to Ward', 'Chill builds to Freeze 20% sooner (design text)'] },
    rimNotables: [
      { n: 'Chilling Rite', s: 'spellDamage', a: 30, fx: ['Once rung, your next rite Chills everything it touches (design text)'] },
      { n: 'Blinding Marks', s: 'ward', a: 45, fx: ['+10% increased Ailment Effect', 'Marked enemies cannot see you beyond short range (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Rite Damage', s: 'spellDamage', a: 8, c: 'drowned-approach' },
        { n: 'Cold Resistance', s: 'river_resistance', a: 8, c: 'drowned-approach', x: ['+6 to Ward (design text)'] }
      ],
      4: [
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 8, c: 'drowned-approach' },
        { n: 'Ward', s: 'ward', a: 18, c: 'drowned-approach' }
      ],
      5: [
        { n: 'Rite Speed', s: 'castSpeed', a: 4, c: 'drowned-waist' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 9, c: 'drowned-waist', x: ['Your Chill spreads to enemies touching its victim (design text)'] },
        { n: 'Rite Damage', s: 'spellDamage', a: 9, c: 'drowned-waist' }
      ],
      6: [
        { n: 'Accuracy', s: 'accuracy_flat', a: 40, c: 'drowned-oath' },
        { n: 'Rite Damage', s: 'spellDamage', a: 10, c: 'drowned-oath' },
        { n: 'Cold Resistance', s: 'river_resistance', a: 10, c: 'drowned-oath' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 10, c: 'drowned-oath', x: ['Marks you write cost no Spirit (design text)'] }
      ],
      7: [
        { n: 'Ward', s: 'ward', a: 24, c: 'drowned-high' },
        { n: 'Rite Damage', s: 'spellDamage', a: 10, c: 'drowned-high' },
        { n: 'Critical Chance', s: 'critChance', a: 1, c: 'drowned-high', x: ['Critical Damage Bonus against Chilled enemies is doubled (design text)'] },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 10, c: 'drowned-high' },
        { n: 'Cold Resistance', s: 'river_resistance', a: 12, c: 'drowned-high' }
      ],
      8: [
        { n: 'Rite Damage', s: 'spellDamage', a: 11, c: 'drowned-sign' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 11, c: 'drowned-sign' },
        { n: 'Ward', s: 'ward', a: 26, c: 'drowned-sign', x: ['Enemies that cross toward you are slowed (design text)'] },
        { n: 'Rite Speed', s: 'castSpeed', a: 5, c: 'drowned-sign' },
        { n: 'Cold Resistance', s: 'river_resistance', a: 12, c: 'drowned-sign' }
      ],
      9: [
        { n: 'Rite Damage', s: 'spellDamage', a: 12, c: 'drowned-deep' },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 10, c: 'drowned-deep' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 12, c: 'drowned-deep', x: ['Enemies Frozen by you thaw 50% slower (design text)'] },
        { n: 'Ward', s: 'ward', a: 30, c: 'drowned-deep' },
        { n: 'Rite Speed', s: 'castSpeed', a: 5, c: 'drowned-deep' },
        { n: 'Spirit', s: 'spirit', a: 14, c: 'drowned-deep' }
      ],
      10: [
        { n: 'Intelligence', s: 'int', a: 5, c: 'drowned-frontier' },
        { n: 'All Attributes', s: 'attrs', a: 3, c: 'drowned-frontier' },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'drowned-frontier', x: ['You are hard to mark in the mist (design text)'] },
        { n: 'Intelligence', s: 'int', a: 5, c: 'drowned-frontier' },
        { n: 'Ward', s: 'ward', a: 20, c: 'drowned-frontier' },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'drowned-frontier' },
        { n: 'Intelligence', s: 'int', a: 5, c: 'drowned-frontier' }
      ]
    }
  },
  { /* 3: Nightwork -> DEX — The Unlit Road (Chaos, venom, traps, unseen work) */
    id: 'unlit-road', title: 'Poison and Chaos',
    firstNotable: { n: 'Poison Penetration', s: 'ailmentEffect', a: 14, fx: ['+30 to Evasion', 'Your poisons ignore half of Chaos resistance (design text)'] },
    beltNotable: { n: 'Deeper Poison', s: 'ailmentEffect', a: 18, fx: ['+1% to Critical Chance', 'Poison you inflict stacks one deeper (design text)'] },
    keystone: {
      n: 'Strike the Unhurt',
      fx: ['You deal 40% more damage to enemies that have not hurt you recently', 'Enemies that have hurt you recently take 15% less from you']
    },
    r7notable: { n: 'Instant Traps', s: 'ailmentEffect', a: 22, fx: ['+8% increased Attack Speed', 'Your traps arm instantly (design text)'] },
    r8notable: { n: 'Poison from Hiding', s: 'critChance', a: 2, fx: ['+15% increased Ailment Effect', 'Your first strike from hiding always poisons (design text)'] },
    sign: {
      n: 'Sign: Spreading Poison',
      fx: ['Your poisons spread on kill', 'You cannot Block', 'You can have only one Sign.']
    },
    r9notable: { n: 'Lasting Wither', s: 'gloam_res', a: 14, fx: ['+20% increased Ailment Effect', 'Wither you inflict cannot be cleansed (design text)'] },
    rimNotables: [
      { n: 'Unseen Passage', s: 'evasion', a: 60, fx: ['You may pass one enemy without being noticed, once per fight (design text)'] },
      { n: 'Chaos Poison', s: 'ailmentEffect', a: 24, fx: ['Poison on Withered enemies deals Chaos damage instead (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Evasion', s: 'evasion', a: 22, c: 'unlit-approach' },
        { n: 'Critical Chance', s: 'critChance', a: 1, c: 'unlit-approach', x: ['+8% Ailment Effect against unhurt enemies (design text)'] }
      ],
      4: [
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 8, c: 'unlit-approach' },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 8, c: 'unlit-approach' }
      ],
      5: [
        { n: 'Evasion', s: 'evasion_increased', a: 8, c: 'unlit-waist' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 9, c: 'unlit-waist', x: ['Your vials refill on kill (design text)'] },
        { n: 'Accuracy', s: 'accuracy_flat', a: 35, c: 'unlit-waist' }
      ],
      6: [
        { n: 'Evasion', s: 'evasion', a: 28, c: 'unlit-oath' },
        { n: 'Attack Speed', s: 'attackSpeed', a: 4, c: 'unlit-oath' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 10, c: 'unlit-oath', x: ['Poison from this dose slows (design text)'] },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 10, c: 'unlit-oath' }
      ],
      7: [
        { n: 'Evasion', s: 'evasion_increased', a: 9, c: 'unlit-high' },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 12, c: 'unlit-high' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 10, c: 'unlit-high', x: ['Your second poison on a target is 25% stronger (design text)'] },
        { n: 'Critical Chance', s: 'critChance', a: 1, c: 'unlit-high' },
        { n: 'Attack Speed', s: 'attackSpeed', a: 5, c: 'unlit-high' }
      ],
      8: [
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 11, c: 'unlit-sign' },
        { n: 'Evasion', s: 'evasion', a: 32, c: 'unlit-sign' },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 12, c: 'unlit-sign' },
        { n: 'All Attributes', s: 'attrs', a: 4, c: 'unlit-sign', x: ['Goods you find are worth 10% more (design text)'] },
        { n: 'Critical Chance', s: 'critChance', a: 1, c: 'unlit-sign' }
      ],
      9: [
        { n: 'Evasion', s: 'evasion_increased', a: 10, c: 'unlit-deep' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 12, c: 'unlit-deep' },
        { n: 'Chaos Resistance', s: 'gloam_res', a: 14, c: 'unlit-deep', x: ['Wither you suffer drains 30% slower (design text)'] },
        { n: 'Critical Chance', s: 'critChance', a: 1, c: 'unlit-deep' },
        { n: 'Evasion', s: 'evasion', a: 35, c: 'unlit-deep' },
        { n: 'Dexterity', s: 'dex', a: 6, c: 'unlit-deep' }
      ],
      10: [
        { n: 'Dexterity', s: 'dex', a: 5, c: 'unlit-frontier' },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'unlit-frontier' },
        { n: 'Intelligence', s: 'int', a: 5, c: 'unlit-frontier', x: ['Road signs mean more to you than most (design text)'] },
        { n: 'Evasion', s: 'evasion', a: 24, c: 'unlit-frontier' },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'unlit-frontier' },
        { n: 'All Attributes', s: 'attrs', a: 3, c: 'unlit-frontier' },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'unlit-frontier' }
      ]
    }
  },
  { /* 4: DEX -> Skirmisher — The High Paths (Lightning, projectiles, speed) */
    id: 'high-paths', title: 'Projectiles and Lightning',
    firstNotable: { n: 'High Ground Shock', s: 'projectileDamage', a: 14, fx: ['+30 to Accuracy', 'Your shots from higher ground Shock (design text)'] },
    beltNotable: { n: 'Projectile Damage', s: 'projectileDamage', a: 16, fx: ['+8% to Lightning Resistance', 'Shocked enemies take +10% from your projectiles (design text)'] },
    keystone: {
      n: 'Damage at Range',
      fx: ['Your hits deal up to 40% more damage to distant enemies', 'Your hits deal 25% less damage to enemies within reach']
    },
    r7notable: { n: 'Downhill Pierce', s: 'move', a: 8, fx: ['+18% increased Projectile Damage', 'Moving downhill, your shots pierce (design text)'] },
    r8notable: { n: 'Chaining Shock', s: 'storm_res', a: 12, fx: ['+18% increased Projectile Damage', 'Your Shocks chain once to the nearest enemy (design text)'] },
    sign: {
      n: 'Sign: Double Shock Stacks',
      fx: ['Your Shocks stack twice as high', '+15% increased Lightning damage taken', 'You can have only one Sign.']
    },
    r9notable: { n: 'Long-Range Accuracy', s: 'accuracy_flat', a: 70, fx: ['+15% increased Projectile Damage', 'Your misses at long range are rerolled once (design text)'] },
    rimNotables: [
      { n: 'Distant Marks', s: 'projectileDamage', a: 30, fx: ['You can see marks at any distance (design text)'] },
      { n: 'Projectile Deflection', s: 'evasion_increased', a: 22, fx: ['+12% to Lightning Resistance', 'Projectiles aimed at you drift in the wind (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Projectile Damage', s: 'projectileDamage', a: 8, c: 'high-approach' },
        { n: 'Evasion', s: 'evasion', a: 22, c: 'high-approach', x: ['+4% Movement Speed on rough ground (design text)'] }
      ],
      4: [
        { n: 'Attack Speed', s: 'attackSpeed', a: 4, c: 'high-approach' },
        { n: 'Accuracy', s: 'accuracy_flat', a: 35, c: 'high-approach' }
      ],
      5: [
        { n: 'Movement Speed', s: 'move', a: 4, c: 'high-waist' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 9, c: 'high-waist', x: ['Your Shocks last one second longer (design text)'] },
        { n: 'Projectile Damage', s: 'projectileDamage', a: 9, c: 'high-waist' }
      ],
      6: [
        { n: 'Evasion', s: 'evasion', a: 28, c: 'high-oath' },
        { n: 'Lightning Resistance', s: 'storm_res', a: 10, c: 'high-oath' },
        { n: 'Projectile Damage', s: 'projectileDamage', a: 10, c: 'high-oath', x: ['Your shots recover on kill (design text)'] },
        { n: 'Attack Speed', s: 'attackSpeed', a: 4, c: 'high-oath' }
      ],
      7: [
        { n: 'Projectile Damage', s: 'projectileDamage', a: 10, c: 'high-high' },
        { n: 'Lightning Resistance', s: 'storm_res', a: 12, c: 'high-high' },
        { n: 'Movement Speed', s: 'move', a: 5, c: 'high-high', x: ['Sprinting charges your next shot with Lightning damage (design text)'] },
        { n: 'Accuracy', s: 'accuracy_flat', a: 45, c: 'high-high' },
        { n: 'Evasion', s: 'evasion_increased', a: 9, c: 'high-high' }
      ],
      8: [
        { n: 'Projectile Damage', s: 'projectileDamage', a: 11, c: 'high-sign' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 11, c: 'high-sign', x: ['Once per fight, your Shock becomes a strike (design text)'] },
        { n: 'Accuracy', s: 'accuracy_flat', a: 50, c: 'high-sign' },
        { n: 'Evasion', s: 'evasion', a: 32, c: 'high-sign' },
        { n: 'Lightning Resistance', s: 'storm_res', a: 12, c: 'high-sign' }
      ],
      9: [
        { n: 'Projectile Damage', s: 'projectileDamage', a: 12, c: 'high-deep' },
        { n: 'Movement Speed', s: 'move', a: 5, c: 'high-deep' },
        { n: 'Lightning Resistance', s: 'storm_res', a: 14, c: 'high-deep', x: ['You cannot be Shocked while moving (design text)'] },
        { n: 'Evasion', s: 'evasion_increased', a: 10, c: 'high-deep' },
        { n: 'Dexterity', s: 'dex', a: 6, c: 'high-deep' },
        { n: 'Accuracy', s: 'accuracy_flat', a: 50, c: 'high-deep' }
      ],
      10: [
        { n: 'Dexterity', s: 'dex', a: 5, c: 'high-frontier' },
        { n: 'All Attributes', s: 'attrs', a: 3, c: 'high-frontier' },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'high-frontier', x: ['Enemies chase you uphill at their peril (design text)'] },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'high-frontier' },
        { n: 'Evasion', s: 'evasion', a: 24, c: 'high-frontier' },
        { n: 'Strength', s: 'str', a: 5, c: 'high-frontier' },
        { n: 'Dexterity', s: 'dex', a: 5, c: 'high-frontier' }
      ]
    }
  },
  { /* 5: Skirmisher -> STR — The Red Field (physical, bleed, stun, momentum) */
    id: 'red-field', title: 'Physical and Bleed',
    firstNotable: { n: 'Unblockable Against Bleeding', s: 'attackDamage', a: 16, fx: ['+8% increased Ailment Effect', 'Your hits against Bleeding enemies cannot be Blocked (design text)'] },
    beltNotable: { n: 'Guard Break', s: 'physical_increased', a: 18, fx: ['+15 to Life', 'Your heavy hits break Guard 20% harder (design text)'] },
    keystone: {
      n: 'Hits Cannot Be Evaded',
      fx: ['Your hits cannot be evaded', 'You never deal critical strikes']
    },
    r7notable: { n: 'Life on Bleeding Kill', s: 'attackDamage', a: 24, fx: ['+10% increased Ailment Effect', 'Kills against Bleeding enemies heal you 15 Life (design text)'] },
    r8notable: { n: 'Longer Stuns', s: 'heavy', a: 8, fx: ['+15% increased Attack Damage', 'Your stuns last 25% longer (design text)'] },
    sign: {
      n: 'Sign: Unstoppable',
      fx: ['Your actions cannot be interrupted while your Poise holds', 'You cannot dodge or give ground', 'You can have only one Sign.']
    },
    r9notable: { n: 'Damage per Nearby Enemy', s: 'life', a: 45, fx: ['+16% increased Attack Damage', 'Each enemy in reach adds +4% to your damage (design text)'] },
    rimNotables: [
      { n: 'Banner Bleed', s: 'attackDamage', a: 30, fx: ['Enemies that see your standard Bleed easier (design text)'] },
      { n: 'Lasting Bleeds', s: 'life', a: 55, fx: ['+10% increased Ailment Effect', 'Your Bleeds close only when their victim falls (design text)'] }
    ],
    smallsByRing: {
      3: [
        { n: 'Attack Damage', s: 'attackDamage', a: 8, c: 'red-approach' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 8, c: 'red-approach', x: ['Bleeds you inflict on moving enemies worsen (design text)'] }
      ],
      4: [
        { n: 'Guard', s: 'guard', a: 20, c: 'red-approach' },
        { n: 'Attack Damage', s: 'attackDamage', a: 8, c: 'red-approach' }
      ],
      5: [
        { n: 'Physical Damage', s: 'physical_increased', a: 8, c: 'red-waist' },
        { n: 'Attack Speed', s: 'attackSpeed', a: 4, c: 'red-waist' },
        { n: 'Life', s: 'life', a: 20, c: 'red-waist', x: ['Bleeding enemies speed up your out-of-combat Life regeneration (design text)'] }
      ],
      6: [
        { n: 'Attack Damage', s: 'attackDamage', a: 9, c: 'red-oath' },
        { n: 'Guard', s: 'guard', a: 25, c: 'red-oath' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 10, c: 'red-oath', x: ['Your Bleeds stack on Bleeding enemies (design text)'] },
        { n: 'Added Physical Damage', s: 'heavy', a: 4, c: 'red-oath' }
      ],
      7: [
        { n: 'Attack Speed', s: 'attackSpeed', a: 5, c: 'red-high' },
        { n: 'Reach', s: 'reach_increased', a: 8, c: 'red-high' },
        { n: 'Guard', s: 'guard_increased', a: 9, c: 'red-high' },
        { n: 'Attack Damage', s: 'attackDamage', a: 10, c: 'red-high', x: ['Each Bleeding enemy adds +2% Attack Damage (design text)'] },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 10, c: 'red-high' }
      ],
      8: [
        { n: 'Life', s: 'life', a: 28, c: 'red-sign' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 11, c: 'red-sign' },
        { n: 'Attack Damage', s: 'attackDamage', a: 10, c: 'red-sign', x: ['Enemies you stun are trampled for extra Physical (design text)'] },
        { n: 'Guard', s: 'guard', a: 30, c: 'red-sign' },
        { n: 'Physical Damage', s: 'physical_increased', a: 10, c: 'red-sign' }
      ],
      9: [
        { n: 'Attack Damage', s: 'attackDamage', a: 11, c: 'red-deep' },
        { n: 'Life', s: 'life', a: 30, c: 'red-deep' },
        { n: 'Ailment Effect', s: 'ailmentEffect', a: 12, c: 'red-deep', x: ['Your Bleeds remember: reapplying restores full duration (design text)'] },
        { n: 'Reach', s: 'reach_increased', a: 10, c: 'red-deep' },
        { n: 'Attack Speed', s: 'attackSpeed', a: 5, c: 'red-deep' },
        { n: 'Guard', s: 'guard', a: 32, c: 'red-deep' }
      ],
      10: [
        { n: 'Strength', s: 'str', a: 5, c: 'red-frontier' },
        { n: 'Strength', s: 'str', a: 5, c: 'red-frontier' },
        { n: 'All Attributes', s: 'attrs', a: 3, c: 'red-frontier', x: ['The crows remember who fed them (design text)'] },
        { n: 'Strength', s: 'str', a: 5, c: 'red-frontier' },
        { n: 'Life', s: 'life', a: 22, c: 'red-frontier' },
        { n: 'Guard', s: 'guard', a: 22, c: 'red-frontier' },
        { n: 'Strength', s: 'str', a: 5, c: 'red-frontier' }
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
    name: entry.n,
    ...(entry.hook ? { patternHook: entry.hook } : {})
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
                `Gate to the ${entry.title} outer circle.`,
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
            const socketTheme = { 'kiln-line': 'Fire', procession: 'Companion', 'drowned-study': 'Cold', 'unlit-road': 'Poison', 'high-paths': 'Projectile', 'red-field': 'Physical' }[wedge.id];
            seats[id] = {
              id, q, r, ring, type: 'socket', axis: axisFor(q, r),
              effects: [
                'Empty jewel socket.',
                'Socket a jewel to gain its effect.'
              ],
              stat: null, amount: 0, tags: ['socket'],
              clusterId: `${wedge.id}-sockets`, status: 'review', notes: '',
              name: ring === 5 ? `${socketTheme} Jewel Socket` : `Outer ${socketTheme} Jewel Socket`
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
