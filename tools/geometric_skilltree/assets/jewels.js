/* =============================================================================
   VERDIGRIS CARVED STONES (jewels) — Phase 5
   -----------------------------------------------------------------------------
   Pure jewel logic for the passive tree. UMD: browser global `VerdigrisJewels`
   or Node require(). Five families (player-facing name: carved stones):

     whorl   — 1-3 plain registry mods; the bread-and-butter socket filler
     eye     — radius: allocated smalls/notables in radius also grant a mod
     change  — radius: rewrites conduit attributes (overpays, per PoE lesson)
     saga    — seeded deterministic transform of nodes in radius; same seed =
               same result forever; transformed nodes are "conquered" (immune
               to other radius stones); limit one socketed saga-stone
     pattern — geometry benders resolved inside the pattern detector

   The tree passes arbitrary jewel JSON from the inventory side; the stash
   below is the curated demo set.
   ============================================================================= */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.VerdigrisJewels = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const hexDistance = (aq, ar, bq, br) => {
    const dq = aq - bq;
    const dr = ar - br;
    return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(-dq - dr));
  };

  // Deterministic 32-bit hash of (seed, text) — the saga law: same seed, same result.
  function sagaHash(seed, text) {
    let h = (seed >>> 0) || 1;
    const s = String(text);
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  /* ---- the five sagas: one transformation philosophy each ------------------ */
  const SAGAS = {
    'drowned-court': {
      name: 'The Drowned Court',
      philosophy: 'full reroll',
      smallPool: [
        { stat: 'spellDamage', amount: 9, line: '+9% increased Rite Damage (Drowned Court)' },
        { stat: 'ward', amount: 22, line: '+22 to Ward (Drowned Court)' },
        { stat: 'river_resistance', amount: 10, line: '+10% to River Resistance (Drowned Court)' },
        { stat: 'ailmentEffect', amount: 8, line: '+8% increased Ailment Effect (Drowned Court)' },
        { stat: 'castSpeed', amount: 4, line: '+4% increased Rite Speed (Drowned Court)' }
      ],
      notablePool: [
        { stat: 'spellDamage', amount: 24, line: 'Might of the Drowned Court: +24% increased Rite Damage' },
        { stat: 'ward', amount: 45, line: 'Might of the Drowned Court: +45 to Ward' },
        { stat: 'ailmentEffect', amount: 20, line: 'Might of the Drowned Court: +20% increased Ailment Effect' }
      ]
    },
    kilnfathers: {
      name: 'The Kilnfathers',
      philosophy: 'additive augment: nodes keep their effect and gain an ember rider',
      smallRider: { stat: 'emberkiss', amount: 2, line: 'Kilnfathers: adds 2 Ember Damage to hits' },
      notableRider: { stat: 'emberkiss', amount: 5, line: 'Kilnfathers: adds 5 Ember Damage to hits' }
    },
    'first-herd': {
      name: 'The First Herd',
      philosophy: 'attribute rebasing: smalls become raw Strength',
      smallStat: { stat: 'str', min: 4, max: 7 }
    },
    'quiet-survey': {
      name: 'The Quiet Survey',
      philosophy: 'stacking currency: smalls grant Testimony, notables scale per Testimony',
      perTestimonyPercent: 6
    },
    'salt-oath': {
      name: 'The Salt Oath',
      philosophy: 'blank-and-boost: smalls grant nothing, notables are oversized',
      notableMultiplier: 2
    }
  };

  /* ---- deterministic per-node saga transform -------------------------------
     Returns null when the node is untouched, otherwise:
     { blank, stat, amount, extraMods:[{stat,amount}], lines:[..], conquered:true }
  --------------------------------------------------------------------------- */
  function sagaTransform(jewel, node) {
    const saga = SAGAS[jewel.saga?.culture];
    if (!saga) return null;
    const seed = jewel.saga.seed;
    const h = sagaHash(seed, node.id);
    const isSmall = node.type === 'small';
    const isNotable = ['notable', 'mastery'].includes(node.type);
    if (!isSmall && !isNotable) return null;

    if (jewel.saga.culture === 'drowned-court') {
      const pool = isSmall ? saga.smallPool : saga.notablePool;
      const pick = pool[h % pool.length];
      return { blank: false, stat: pick.stat, amount: pick.amount, extraMods: [], lines: [pick.line], conquered: true };
    }
    if (jewel.saga.culture === 'kilnfathers') {
      const rider = isSmall ? saga.smallRider : saga.notableRider;
      return { blank: false, stat: node.stat, amount: node.amount, extraMods: [{ stat: rider.stat, amount: rider.amount }], lines: [rider.line], conquered: true };
    }
    if (jewel.saga.culture === 'first-herd') {
      if (!isSmall) return { blank: false, stat: node.stat, amount: node.amount, extraMods: [], lines: ['The First Herd passes by.'], conquered: true };
      const amount = saga.smallStat.min + (h % (saga.smallStat.max - saga.smallStat.min + 1));
      return { blank: false, stat: 'str', amount, extraMods: [], lines: [`First Herd: +${amount} to Strength (replaces this passive)`], conquered: true };
    }
    if (jewel.saga.culture === 'quiet-survey') {
      if (isSmall) {
        return { blank: true, stat: null, amount: 0, extraMods: [], lines: ['Quiet Survey: grants 1 Testimony instead of its effect'], testimony: 1, conquered: true };
      }
      return { blank: false, stat: node.stat, amount: node.amount, extraMods: [], lines: [`Quiet Survey: +${saga.perTestimonyPercent}% effect per Testimony in radius`], scalesWithTestimony: true, conquered: true };
    }
    if (jewel.saga.culture === 'salt-oath') {
      if (isSmall) {
        return { blank: true, stat: null, amount: 0, extraMods: [], lines: ['Salt Oath: this passive grants nothing'], conquered: true };
      }
      return { blank: false, stat: node.stat, amount: node.amount * saga.notableMultiplier, extraMods: [], lines: ['Salt Oath: this notable is doubled'], conquered: true };
    }
    return null;
  }

  /* ---- curated demo stash --------------------------------------------------- */
  const STASH = [
    { id: 'whorl-red', family: 'whorl', name: 'Red Whorl-stone', mods: [{ stat: 'attackDamage', amount: 12 }, { stat: 'life', amount: 20 }] },
    { id: 'whorl-blue', family: 'whorl', name: 'Blue Whorl-stone', mods: [{ stat: 'spellDamage', amount: 12 }, { stat: 'ward', amount: 25 }] },
    { id: 'whorl-green', family: 'whorl', name: 'Green Whorl-stone', mods: [{ stat: 'projectileDamage', amount: 12 }, { stat: 'evasion', amount: 30 }, { stat: 'accuracy_flat', amount: 30 }] },
    { id: 'eye-guard', family: 'eye', name: 'Eye of Bronze', radius: 2, grant: { scope: 'small', stat: 'guard', amount: 8 }, note: 'Allocated small passives in radius also grant +8 Guard' },
    { id: 'eye-keen', family: 'eye', name: 'Eye of the Falcon', radius: 2, grant: { scope: 'notable', stat: 'attackDamage', amount: 6 }, note: 'Allocated notables in radius also grant +6% Attack Damage' },
    { id: 'change-bull', family: 'change', name: 'Bull Change-stone', radius: 2, change: { from: 'str', to: 'int', rate: 2 }, note: 'STR from conduits in radius counts as INT, twice over' },
    { id: 'change-heron', family: 'change', name: 'Heron Change-stone', radius: 2, change: { from: 'int', to: 'dex', rate: 2 }, note: 'INT from conduits in radius counts as DEX, twice over' },
    { id: 'saga-drowned-773', family: 'saga', name: 'Saga of the Drowned Court, Year 773', radius: 2, saga: { culture: 'drowned-court', seed: 773 } },
    { id: 'saga-kiln-112', family: 'saga', name: 'Saga of the Kilnfathers, Year 112', radius: 2, saga: { culture: 'kilnfathers', seed: 112 } },
    { id: 'saga-herd-950', family: 'saga', name: 'Saga of the First Herd, Year 950', radius: 2, saga: { culture: 'first-herd', seed: 950 } },
    { id: 'saga-survey-431', family: 'saga', name: 'Saga of the Quiet Survey, Year 431', radius: 2, saga: { culture: 'quiet-survey', seed: 431 } },
    { id: 'saga-salt-608', family: 'saga', name: 'Saga of the Salt Oath, Year 608', radius: 2, saga: { culture: 'salt-oath', seed: 608 } },
    { id: 'pattern-crest', family: 'pattern', name: 'Crest Pattern-stone', radius: 2, pattern: { effect: 'wave-length', value: 1 }, note: 'Waves touching this radius count +1 length' },
    { id: 'pattern-broken-ring', family: 'pattern', name: 'Broken Ring Pattern-stone', radius: 2, pattern: { effect: 'loop-gap', value: 1 }, note: 'A loop centered in radius may be missing one conduit and still count' }
  ];

  function describe(jewel) {
    const lines = [];
    if (jewel.family === 'whorl') {
      jewel.mods.forEach(mod => lines.push(`${mod.stat} +${mod.amount}`));
    }
    if (jewel.note) lines.push(jewel.note);
    if (jewel.family === 'saga') {
      const saga = SAGAS[jewel.saga.culture];
      lines.push(`Rewrites passives in radius ${jewel.radius}: ${saga.philosophy}.`);
      lines.push(`Year ${jewel.saga.seed} — the same year always tells the same story.`);
      lines.push('Conquered passives ignore all other carved stones. Limit one saga-stone.');
    }
    return lines;
  }

  return {
    SAGAS,
    STASH,
    hexDistance,
    sagaHash,
    sagaTransform,
    describe
  };
}));
