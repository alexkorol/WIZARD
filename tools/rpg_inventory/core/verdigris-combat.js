/* =============================================================================
   VERDIGRIS COMBAT — minimal autobattler resolution for Brands & Bonds
   -----------------------------------------------------------------------------
   Zero dependencies. UMD: browser global `VerdigrisCombat` or Node require().
   The engine (vesselforge.js) stays rules-only and pack-agnostic; this module
   is the pack-aware layer that makes bonds FIRE: it interprets Verdigris bond
   modIds (shieldwall, blood_price, ...) and awakened theme powers as concrete
   combat behavior. Seedable rng for reproducible tests.

   resolveBattle(forge, pack, opts) -> {
     survived, hp, maxHp, kills, rounds, spoilsMult,
     log: [{kind, text}], procs: n,
   }
   opts: { items, level, hp, charName, archetype, encounter, rng }
   ============================================================================= */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.VerdigrisCombat = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const FOE_POOLS = {
    slaughter: ['boar of the sounder', 'raider axe-hand', 'tusked alderbeast calf', 'barrow-wolf'],
    warding: ['raider shield-breaker', 'weir-troll', 'ash-storm revenant'],
    spiritwork: ['river-haunt', 'canal-wisp', 'barrow-shade'],
    wayfaring: ['toll-reeve bruiser', 'mudflat lurker', 'road-wight'],
  };

  function resolveBattle(forge, pack, opts) {
    const rng = opts.rng || Math.random;
    const rint = (a, b) => a + Math.floor(rng() * (b - a + 1));
    const roll = (p) => rng() < p;
    const level = Math.max(1, opts.level || 1);
    const items = (opts.items || []).filter(Boolean);
    const archetype = opts.archetype;
    const enc = opts.encounter || { text: 'wandered the hills', themes: {} };
    const log = [];
    const say = (kind, text) => log.push({ kind, text });

    const agg = forge.aggregate(items, { archetype, level });
    const maxHp = Math.max(1, agg.sheet.life || 1);
    let hp = Math.min(opts.hp != null ? opts.hp : maxHp, maxHp);

    /* live bond values by modId (summed across items, estrangement applied) */
    const bonds = {};
    items.forEach(it => (it.bonds || []).forEach(b => {
      const v = forge.bondValue(b, forge.isEstranged(b, archetype));
      bonds[b.modId] = (bonds[b.modId] || 0) + v;
    }));
    const bond = (id) => bonds[id] || 0;

    /* awakened theme powers */
    const powers = new Set(items.filter(it => it.awakened).map(it => it.awakened.themeId));
    let lastStandReady = powers.has('warding');
    let untraceableReady = powers.has('wayfaring');
    const echoingKill = powers.has('slaughter');

    /* player offense */
    const weaponized = agg.sheet.damage > 0;
    const baseDmg = weaponized ? agg.sheet.damage : 6 + level;
    const critBase = ((agg.sums.keen_eye || 0) + (agg.sums.crit || 0)) / 100;
    const bleeds = items.some(it => {
      const f = pack.forms[it.formId];
      return f && f.weapon && ((f.tags || []).includes('blood') ||
        (it.brands || []).some(b => b.modId === 'bloodgroove'));
    });

    /* player defense */
    const wardBase = agg.sheet.ward || 0;
    const blockChance = Math.min(0.6, ((agg.sums.block || 0) + bond('stand_ground')) / 100);
    const avoidChance = Math.min(0.5, bond('sidestep') / 100);

    /* foes scale with level and encounter weight */
    const heat = Object.values(enc.themes || {}).reduce((s, w) => s + w, 0);
    const danger = 0.85 + heat * 0.08;
    const foeCount = 1 + (roll(0.25 + level * 0.01) ? 1 : 0);
    const themeIds = Object.keys(enc.themes || {});
    const pool = FOE_POOLS[themeIds[0]] || FOE_POOLS.slaughter;

    let kills = 0, rounds = 0, procs = 0, spoilsMult = 1;
    let rhythmBoost = 0;   // battle_rhythm: % damage after a kill
    let grudgeWard = 0;    // old_grudge: bonus ward next round after being hit
    const heal = (v, why) => {
      const gained = Math.min(maxHp - hp, Math.max(0, Math.round(v)));
      if (gained > 0) { hp += gained; procs += 1; say('bond', `${why} — ${gained} Life regained.`); }
    };

    for (let f = 0; f < foeCount && hp > 0; f++) {
      const foeName = pool[Math.floor(rng() * pool.length)];
      let foeHp = Math.round((18 + level * 9) * danger * (0.85 + rng() * 0.3));
      const foeDmg = (3 + level * 1.8) * danger;
      let foeBleeding = false;
      say('sys', `A ${foeName} bars the way.`);

      let guard = 0;
      while (foeHp > 0 && hp > 0 && guard < 24) {
        guard += 1; rounds += 1;

        /* --- player strikes --- */
        let dmg = baseDmg * (0.8 + rng() * 0.4) * (1 + rhythmBoost / 100);
        let critChance = critBase + (foeBleeding ? bond('read_wound') / 100 : 0);
        const crit = roll(Math.min(0.75, critChance));
        if (crit) dmg *= 1.7;
        if (foeBleeding) dmg += level;
        foeHp -= Math.max(1, Math.round(dmg));
        if (bleeds && !foeBleeding && roll(0.35)) {
          foeBleeding = true;
          say('sys', `The ${foeName} bleeds.`);
        }
        if (crit && bond('read_wound') && foeBleeding) { procs += 1; say('bond', `Read the Wound — a killing angle opens.`); }

        if (foeHp <= 0) {
          kills += 1;
          say('deed', `The ${foeName} falls${crit ? ' to a brutal strike' : ''}.`);
          if (bond('blood_price')) heal(maxHp * bond('blood_price') / 100, 'The Blood Price');
          if (bond('battle_rhythm')) {
            rhythmBoost = bond('battle_rhythm'); procs += 1;
            say('bond', `Battle Rhythm — the pace quickens (+${rhythmBoost}% Attack Speed).`);
          }
          if (bond('ember_tithe')) { procs += 1; say('bond', `Harvest — spirit flows back from the kill.`); }
          if (bond('dead_sprint')) { procs += 1; say('bond', `Dead Sprint — nothing at the kill-site can catch you.`); }
          if (echoingKill && roll(0.15)) { spoilsMult += 1; say('awake', `Echoing Kill — the ${foeName} dies twice; its spoils double.`); }
          break;
        }

        /* --- foe strikes --- */
        if (untraceableReady) {
          untraceableReady = false; procs += 1;
          say('awake', `Untraceable — the first strike against you misses.`);
          continue;
        }
        if (roll(avoidChance)) { procs += 1; say('bond', `Sidestep — the blow finds only air.`); continue; }
        if (roll(blockChance)) {
          procs += 1;
          say('bond', bond('stand_ground')
            ? `Stand Your Ground — blocked without yielding a step.`
            : `Blocked.`);
          if (bond('shieldwall')) heal(bond('shieldwall'), 'The Shieldwall');
          continue;
        }
        const ward = wardBase * (1 + grudgeWard / 100);
        const reduction = Math.min(0.7, ward / (ward + 120));
        const taken = Math.max(1, Math.round(foeDmg * (0.8 + rng() * 0.4) * (1 - reduction)));
        hp -= taken;
        say('sys', `The ${foeName} strikes for ${taken}.`);
        if (bond('old_grudge')) {
          grudgeWard = bond('old_grudge');
          procs += 1; say('bond', `Old Grudge — ward hardens against the next blow (+${grudgeWard}% Ward).`);
        } else {
          grudgeWard = 0;
        }

        /* --- round end --- */
        if (bond('road_lore') && hp > 0 && hp < maxHp) heal(bond('road_lore'), 'Second Wind');

        if (hp <= 0 && lastStandReady) {
          lastStandReady = false; hp = 1; procs += 1;
          say('awake', `LAST STAND — a killing blow lands, and the relic refuses it. 1 Life remains.`);
        }
      }
      if (guard >= 24 && foeHp > 0) say('sys', `The ${foeName} limps away — neither of you could end it.`);
    }

    const survived = hp > 0;
    if (survived) {
      say('sys', `${opts.charName || 'The bearer'} walks away with ${hp}/${maxHp} Life.`);
    } else {
      say('death', `${opts.charName || 'The bearer'} falls. The chronicle records it.`);
    }
    return { survived, hp: Math.max(0, hp), maxHp, kills, rounds, spoilsMult, procs, log };
  }

  return { resolveBattle, version: '1.0.0' };
}));
