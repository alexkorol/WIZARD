/* =============================================================================
   VERDIGRIS STATS - shared offense/defense rules
   -----------------------------------------------------------------------------
   Zero dependencies. UMD: browser global `VerdigrisStats` or Node require().
   This module is the common stat vocabulary for Vesselforge and the geometric
   passive tree.
   ============================================================================= */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.VerdigrisStats = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CHANNELS = ['physical', 'ember', 'river', 'storm', 'gloam'];

  const STANDARD_FOES = {
    bruiser: {
      name: 'Standard Bruiser',
      hits: [{ channel: 'physical', damage: 180, attack: true, accuracy: 260, weight: 1 }]
    },
    emberCaster: {
      name: 'Ember Caster',
      hits: [{ channel: 'ember', damage: 160, attack: false, weight: 1 }]
    },
    mixedPack: {
      name: 'Mixed Pack',
      hits: [
        { channel: 'physical', damage: 110, attack: true, accuracy: 240, weight: 0.55 },
        { channel: 'ember', damage: 80, attack: false, weight: 0.25 },
        { channel: 'river', damage: 70, attack: false, weight: 0.2 }
      ]
    }
  };

  const STAT_REGISTRY = {
    life_flat: { label: 'Life', shape: 'flat', category: 'defense' },
    spirit_flat: { label: 'Spirit', shape: 'flat', category: 'resource' },
    ward_flat: { label: 'Ward', shape: 'flat', category: 'defense' },
    ward_increased: { label: 'increased Ward', shape: 'increased', category: 'defense' },
    guard_flat: { label: 'Guard', shape: 'flat', category: 'defense' },
    guard_increased: { label: 'increased Guard', shape: 'increased', category: 'defense' },
    evasion_flat: { label: 'Evasion', shape: 'flat', category: 'defense' },
    evasion_increased: { label: 'increased Evasion', shape: 'increased', category: 'defense' },
    accuracy_flat: { label: 'Accuracy', shape: 'flat', category: 'offense' },
    block_chance_flat: { label: 'Block Chance', shape: 'flat', category: 'defense', cap: 75 },
    ember_resistance: { label: 'Ember Resistance', shape: 'resistance', category: 'defense', cap: 75 },
    river_resistance: { label: 'River Resistance', shape: 'resistance', category: 'defense', cap: 75 },
    storm_resistance: { label: 'Storm Resistance', shape: 'resistance', category: 'defense', cap: 75 },
    gloam_resistance: { label: 'Gloam Resistance', shape: 'resistance', category: 'defense', cap: 75 },
    all_resistance: { label: 'All Resistances', shape: 'resistance', category: 'defense', cap: 75 },
    max_resistance: { label: 'Maximum Resistance', shape: 'cap', category: 'defense' },
    all_attributes: { label: 'All Attributes', shape: 'flat', category: 'attribute' },
    str_flat: { label: 'Strength', shape: 'flat', category: 'attribute' },
    dex_flat: { label: 'Dexterity', shape: 'flat', category: 'attribute' },
    int_flat: { label: 'Intelligence', shape: 'flat', category: 'attribute' },
    added_physical: { label: 'added Physical Damage', shape: 'flat', category: 'offense' },
    added_ember: { label: 'added Ember Damage', shape: 'flat', category: 'offense' },
    physical_increased: { label: 'increased Physical Damage', shape: 'increased', category: 'offense' },
    attack_increased: { label: 'increased Attack Damage', shape: 'increased', category: 'offense' },
    rite_increased: { label: 'increased Rite Damage', shape: 'increased', category: 'offense' },
    projectile_increased: { label: 'increased Projectile Damage', shape: 'increased', category: 'offense' },
    companion_increased: { label: 'increased Companion Damage', shape: 'increased', category: 'offense' },
    attack_speed_increased: { label: 'increased Attack Speed', shape: 'increased', category: 'offense' },
    rite_speed_increased: { label: 'increased Rite Speed', shape: 'increased', category: 'offense' },
    crit_chance_flat: { label: 'Critical Chance', shape: 'flat', category: 'offense', cap: 95 },
    crit_bonus_flat: { label: 'Advantage Bonus', shape: 'flat', category: 'offense' },
    ailment_effect: { label: 'Ailment Effect', shape: 'increased', category: 'ailment' },
    cooldown_recovery: { label: 'Cooldown Recovery', shape: 'increased', category: 'utility' },
    move_speed: { label: 'Movement Speed', shape: 'increased', category: 'utility' },
    goods_find: { label: 'Goods Found', shape: 'increased', category: 'utility' },
    beast_damage_increased: { label: 'increased Damage against Beasts', shape: 'increased', category: 'offense' },
    reach_increased: { label: 'increased Reach', shape: 'increased', category: 'utility' },
    attack_more: { label: 'more Attack Damage', shape: 'more', category: 'offense', protected: true },
    defense_more: { label: 'more Defense', shape: 'more', category: 'defense', protected: true }
  };

  const ALIASES = {
    life: 'life_flat',
    hale: 'life_flat',
    mana: 'spirit_flat',
    spirit: 'spirit_flat',
    spirited: 'spirit_flat',
    energyShield: 'ward_flat',
    ward: 'ward_flat',
    warded: 'ward_increased',
    ward_pct: 'ward_increased',
    armour: 'guard_flat',
    armor: 'guard_flat',
    guard: 'guard_flat',
    evasion: 'evasion_flat',
    block: 'block_chance_flat',
    blockChance: 'block_chance_flat',
    allResistances: 'all_resistance',
    emberward: 'ember_resistance',
    ember_res: 'ember_resistance',
    riverblessed: 'river_resistance',
    storm_res: 'storm_resistance',
    gloam_res: 'gloam_resistance',
    attrs: 'all_attributes',
    strongback: 'all_attributes',
    str: 'str_flat',
    dex: 'dex_flat',
    int: 'int_flat',
    heavy: 'added_physical',
    emberkiss: 'added_ember',
    phys_pct: 'physical_increased',
    keen: 'physical_increased',
    attackDamage: 'attack_increased',
    spellDamage: 'rite_increased',
    projectileDamage: 'projectile_increased',
    minionDamage: 'companion_increased',
    atk_speed: 'attack_speed_increased',
    attackSpeed: 'attack_speed_increased',
    castSpeed: 'rite_speed_increased',
    crit: 'crit_chance_flat',
    critChance: 'crit_chance_flat',
    ailmentEffect: 'ailment_effect',
    cooldownRecovery: 'cooldown_recovery',
    surefoot: 'move_speed',
    move: 'move_speed',
    wealthy: 'goods_find',
    fortune: 'goods_find',
    beastbane: 'beast_damage_increased',
    long_reach: 'reach_increased'
  };

  const DEFAULT_ATTRIBUTES = { str: 10, dex: 10, int: 10 };
  const DEFAULT_LEVEL = 1;
  const GUARD_K = 6;

  const round = (value) => Math.round(value * 100) / 100;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function normalizeSums(sums = {}, legacyMods = []) {
    const out = {};
    const add = (id, value) => {
      if (!id || !Number.isFinite(Number(value))) return;
      const key = ALIASES[id] || id;
      out[key] = (out[key] || 0) + Number(value);
    };
    Object.entries(sums || {}).forEach(([id, value]) => add(id, value));
    (legacyMods || []).forEach(mod => add(mod.stat || mod.id, mod.amount != null ? mod.amount : mod.value));
    return out;
  }

  function valueOf(sums, id) {
    return sums[id] || 0;
  }

  function increasedMultiplier(percent) {
    return 1 + (percent || 0) / 100;
  }

  function moreMultiplier(values = []) {
    return values.reduce((product, percent) => product * (1 + (percent || 0) / 100), 1);
  }

  function deriveAttributes(sums = {}, explicit = {}) {
    const all = valueOf(sums, 'all_attributes');
    return {
      str: round((explicit.str || 0) + DEFAULT_ATTRIBUTES.str + all + valueOf(sums, 'str_flat')),
      dex: round((explicit.dex || 0) + DEFAULT_ATTRIBUTES.dex + all + valueOf(sums, 'dex_flat')),
      int: round((explicit.int || 0) + DEFAULT_ATTRIBUTES.int + all + valueOf(sums, 'int_flat'))
    };
  }

  function collectItemBases(items = [], forms = {}, materials = {}) {
    const bases = {
      ward: 0,
      guard: 0,
      evasion: 0,
      block: 0,
      weaponAverage: 0,
      weaponSpeed: 1,
      hasWeapon: false
    };
    items.filter(Boolean).forEach(item => {
      const form = forms[item.formId] || {};
      const material = materials[item.materialId] || { statMult: 1 };
      const mult = material.statMult || 1;
      if (form.armor) {
        const armor = form.armor * mult;
        bases.ward += armor;
        bases.guard += armor * (form.kind === 'shield' || form.kind === 'body' ? 0.75 : 0.45);
        bases.evasion += armor * ((form.tags || []).includes('swift') ? 0.65 : 0.25);
      }
      if (!bases.hasWeapon && form.weapon) {
        bases.hasWeapon = true;
        bases.weaponAverage = ((form.weapon.dmg[0] + form.weapon.dmg[1]) / 2) * mult;
        bases.weaponSpeed = form.weapon.aps || 1;
      }
    });
    return bases;
  }

  function resistanceFor(sums, channel, capBonus = 0) {
    const cap = 75 + capBonus + valueOf(sums, 'max_resistance');
    return clamp(valueOf(sums, `${channel}_resistance`) + valueOf(sums, 'all_resistance'), -60, cap);
  }

  function computeDefense({ level = DEFAULT_LEVEL, sums = {}, attributes = {}, itemBases = {} } = {}) {
    const attrs = deriveAttributes(sums, attributes);
    const life = Math.round(90 + 12 * (level - 1) + attrs.str * 2 + valueOf(sums, 'life_flat'));
    const spirit = Math.round(50 + attrs.int * 2 + valueOf(sums, 'spirit_flat'));
    const guardBase = (itemBases.guard || 0) + attrs.str * 1.5 + valueOf(sums, 'guard_flat');
    const evasionBase = (itemBases.evasion || 0) + attrs.dex * 2.5 + valueOf(sums, 'evasion_flat');
    const wardBase = (itemBases.ward || 0) + attrs.int * 2 + valueOf(sums, 'ward_flat');
    const guard = Math.round(guardBase * increasedMultiplier(valueOf(sums, 'guard_increased')));
    const evasion = Math.round(evasionBase * increasedMultiplier(valueOf(sums, 'evasion_increased')));
    const ward = Math.round(wardBase * increasedMultiplier(valueOf(sums, 'ward_increased')));
    const accuracy = Math.round(100 + attrs.dex * 6 + valueOf(sums, 'accuracy_flat'));
    const blockChance = round(clamp((itemBases.block || 0) + valueOf(sums, 'block_chance_flat'), 0, 75));
    const resistances = {
      ember: resistanceFor(sums, 'ember'),
      river: resistanceFor(sums, 'river'),
      storm: resistanceFor(sums, 'storm'),
      gloam: resistanceFor(sums, 'gloam')
    };
    return { attrs, life, spirit, guard, evasion, ward, accuracy, blockChance, resistances };
  }

  function evasionChance(evasion, accuracy) {
    if (evasion <= 0) return 0.05;
    const chance = evasion / (evasion + Math.max(1, accuracy) * 1.65);
    return round(clamp(chance, 0.05, 0.95));
  }

  function entropyEvasionRoll(chance, entropy = 0) {
    const next = entropy + clamp(chance, 0, 1);
    if (next >= 1) {
      return { evaded: true, entropy: round(next - 1) };
    }
    return { evaded: false, entropy: round(next) };
  }

  function guardMitigation(guard, hitDamage, k = GUARD_K) {
    if (guard <= 0 || hitDamage <= 0) return 0;
    return round(clamp(guard / (guard + k * hitDamage), 0, 0.85));
  }

  function applyMitigation(defense, hit) {
    const channel = hit.channel || 'physical';
    let damage = hit.damage || 0;
    if (channel === 'physical') {
      damage *= 1 - guardMitigation(defense.guard, damage);
    } else {
      const resistance = defense.resistances[channel] || 0;
      damage *= 1 - resistance / 100;
    }
    return Math.max(0, damage);
  }

  function resolveHit(defense, hit = {}, options = {}) {
    const attack = hit.attack !== false;
    const evadeChance = attack ? evasionChance(defense.evasion, hit.accuracy || 250) : 0;
    if (options.forceEvade || (options.entropy != null && entropyEvasionRoll(evadeChance, options.entropy).evaded)) {
      return { evaded: true, blocked: false, wardDamage: 0, lifeDamage: 0, finalDamage: 0, evadeChance };
    }
    if (options.forceBlock) {
      return { evaded: false, blocked: true, wardDamage: 0, lifeDamage: 0, finalDamage: 0, evadeChance };
    }
    const afterMitigation = applyMitigation(defense, hit);
    const bypassWard = hit.channel === 'gloam';
    const wardDamage = bypassWard ? 0 : Math.min(defense.ward, afterMitigation);
    const lifeDamage = Math.max(0, afterMitigation - wardDamage);
    return {
      evaded: false,
      blocked: false,
      bypassWard,
      wardDamage: round(wardDamage),
      lifeDamage: round(lifeDamage),
      finalDamage: round(afterMitigation),
      evadeChance
    };
  }

  function wardAfterRecharge({ ward, maxWard, secondsSinceDamage, delay = 2, rechargePerSecond = 0.33 }) {
    if (secondsSinceDamage < delay) return ward;
    return Math.round(clamp(ward + maxWard * rechargePerSecond * (secondsSinceDamage - delay), 0, maxWard));
  }

  function expectedDamageRatio(defense, hit) {
    const raw = Math.max(1, hit.damage || 1);
    const mitigated = applyMitigation(defense, hit);
    const evade = hit.attack === false ? 0 : evasionChance(defense.evasion, hit.accuracy || 250);
    const block = defense.blockChance / 100;
    return (mitigated / raw) * (1 - evade) * (1 - block);
  }

  function effectiveHp(defense, profile = STANDARD_FOES.bruiser) {
    const hits = profile.hits || [profile];
    let totalWeight = 0;
    let total = 0;
    hits.forEach(hit => {
      const weight = hit.weight == null ? 1 : hit.weight;
      const buffer = defense.life + (hit.channel === 'gloam' ? 0 : defense.ward);
      const ratio = Math.max(0.05, expectedDamageRatio(defense, hit));
      total += (buffer / ratio) * weight;
      totalWeight += weight;
    });
    return Math.round(total / Math.max(1e-6, totalWeight));
  }

  function computeOffense({ sums = {}, attributes = {}, itemBases = {}, useDefaultWeapon = false, more = [] } = {}) {
    const attrs = deriveAttributes(sums, attributes);
    const hasWeapon = itemBases.hasWeapon || useDefaultWeapon;
    const weaponAverage = hasWeapon ? (itemBases.weaponAverage || 12) : 0;
    const weaponSpeed = hasWeapon ? (itemBases.weaponSpeed || 1) : 0;
    const physicalBase = weaponAverage + valueOf(sums, 'added_physical') + attrs.str * 0.15;
    const emberBase = valueOf(sums, 'added_ember');
    const increased = valueOf(sums, 'attack_increased') + valueOf(sums, 'physical_increased');
    const speed = weaponSpeed * increasedMultiplier(valueOf(sums, 'attack_speed_increased') + attrs.dex * 0.08);
    const critChance = clamp(5 + valueOf(sums, 'crit_chance_flat') + attrs.dex * 0.02, 0, 95);
    const advantageBonus = 50 + valueOf(sums, 'crit_bonus_flat');
    const critMultiplier = 1 + (critChance / 100) * (advantageBonus / 100);
    const moreValues = more.concat(valueOf(sums, 'attack_more') ? [valueOf(sums, 'attack_more')] : []);
    const hit = (physicalBase + emberBase) * increasedMultiplier(increased) * moreMultiplier(moreValues);
    const dps = Math.round(hit * speed * critMultiplier);
    return {
      hasWeapon,
      baseHit: round(physicalBase + emberBase),
      increased: round(increased),
      more: round(moreMultiplier(moreValues)),
      speed: round(speed),
      critChance: round(critChance),
      advantageBonus: round(advantageBonus),
      dps
    };
  }

  function deriveSheet(options = {}) {
    const sums = normalizeSums(options.sums, options.legacyMods);
    const itemBases = collectItemBases(options.items || [], options.forms || {}, options.materials || {});
    const defense = computeDefense({
      level: options.level || DEFAULT_LEVEL,
      sums,
      attributes: options.attributes || {},
      itemBases
    });
    const offense = computeOffense({
      sums,
      attributes: options.attributes || {},
      itemBases,
      useDefaultWeapon: Boolean(options.useDefaultWeapon),
      more: options.more || []
    });
    const ehp = effectiveHp(defense, options.profile || STANDARD_FOES.mixedPack);
    return {
      attrs: defense.attrs,
      life: defense.life,
      spirit: defense.spirit,
      ward: defense.ward,
      guard: defense.guard,
      evasion: defense.evasion,
      accuracy: defense.accuracy,
      block: defense.blockChance,
      blockChance: defense.blockChance,
      damage: offense.dps,
      dps: offense.dps,
      effectiveHp: ehp,
      ehp,
      move: Math.round(valueOf(sums, 'move_speed')),
      goods: Math.round(valueOf(sums, 'goods_find')),
      resEmber: defense.resistances.ember,
      resRiver: defense.resistances.river,
      resStorm: defense.resistances.storm,
      resGloam: defense.resistances.gloam,
      offense,
      defense,
      sums
    };
  }

  function validateModSource(mod = {}) {
    const stat = ALIASES[mod.stat] || mod.stat;
    const def = STAT_REGISTRY[stat];
    if (!def) return { ok: false, issue: `Unknown stat ${mod.stat}` };
    if (def.shape === 'more' && !mod.protected) {
      return { ok: false, issue: `${stat} is a protected multiplier stat` };
    }
    return { ok: true, stat };
  }

  return {
    version: '0.1.0',
    CHANNELS,
    STANDARD_FOES,
    STAT_REGISTRY,
    ALIASES,
    normalizeSums,
    deriveAttributes,
    collectItemBases,
    computeDefense,
    computeOffense,
    deriveSheet,
    increasedMultiplier,
    moreMultiplier,
    evasionChance,
    entropyEvasionRoll,
    guardMitigation,
    applyMitigation,
    resolveHit,
    wardAfterRecharge,
    effectiveHp,
    validateModSource,
    clamp,
    round
  };
}));
