const assert = require('node:assert/strict');
const Stats = require('./verdigris-stats.js');
const Pack = require('./verdigris-pack.js');

function testRegistryHasFiveChannels() {
  assert.deepEqual(Stats.CHANNELS, ['physical', 'ember', 'river', 'storm', 'gloam']);
}

function testRegistryContainsCoreDefenseStats() {
  ['life_flat', 'spirit_flat', 'ward_flat', 'guard_flat', 'evasion_flat', 'block_chance_flat'].forEach(id => {
    assert.ok(Stats.STAT_REGISTRY[id], `${id} should be registered`);
  });
}

function testMoreIsProtected() {
  assert.equal(Stats.STAT_REGISTRY.attack_more.protected, true);
}

function testValidateRejectsUnprotectedMore() {
  assert.equal(Stats.validateModSource({ stat: 'attack_more', value: 20 }).ok, false);
}

function testValidateAcceptsProtectedMore() {
  assert.equal(Stats.validateModSource({ stat: 'attack_more', value: 20, protected: true }).ok, true);
}

function testLegacyAliasesNormalizePackStats() {
  const sums = Stats.normalizeSums({ hale: 12, spirited: 8, warded: 20, phys_pct: 15 });
  assert.equal(sums.life_flat, 12);
  assert.equal(sums.spirit_flat, 8);
  assert.equal(sums.ward_increased, 20);
  assert.equal(sums.physical_increased, 15);
}

function testLegacyAliasesNormalizeTreeStats() {
  const sums = Stats.normalizeSums({}, [
    { stat: 'energyShield', amount: 40 },
    { stat: 'attackDamage', amount: 9 },
    { stat: 'allResistances', amount: 3 }
  ]);
  assert.equal(sums.ward_flat, 40);
  assert.equal(sums.attack_increased, 9);
  assert.equal(sums.all_resistance, 3);
}

function testAttributesStartAtTen() {
  assert.deepEqual(Stats.deriveAttributes({}), { str: 10, dex: 10, int: 10 });
}

function testAllAttributesAddToEachAttribute() {
  assert.deepEqual(Stats.deriveAttributes({ all_attributes: 5 }), { str: 15, dex: 15, int: 15 });
}

function testExplicitAttributesStackWithSums() {
  assert.deepEqual(Stats.deriveAttributes({ str_flat: 2 }, { str: 8, dex: 3, int: 1 }), { str: 20, dex: 13, int: 11 });
}

function testLifeScalesWithLevel() {
  const low = Stats.computeDefense({ level: 1 }).life;
  const high = Stats.computeDefense({ level: 10 }).life;
  assert.equal(high - low, 108);
}

function testStrengthRaisesLifeAndGuard() {
  const base = Stats.computeDefense({ attributes: { str: 0 } });
  const strong = Stats.computeDefense({ attributes: { str: 20 } });
  assert.ok(strong.life > base.life);
  assert.ok(strong.guard > base.guard);
}

function testIntRaisesSpiritAndWard() {
  const base = Stats.computeDefense({ attributes: { int: 0 } });
  const smart = Stats.computeDefense({ attributes: { int: 20 } });
  assert.ok(smart.spirit > base.spirit);
  assert.ok(smart.ward > base.ward);
}

function testDexRaisesEvasionAndAccuracy() {
  const base = Stats.computeDefense({ attributes: { dex: 0 } });
  const quick = Stats.computeDefense({ attributes: { dex: 20 } });
  assert.ok(quick.evasion > base.evasion);
  assert.ok(quick.accuracy > base.accuracy);
}

function testResistanceCapsAtSeventyFive() {
  const defense = Stats.computeDefense({ sums: Stats.normalizeSums({ emberward: 90 }) });
  assert.equal(defense.resistances.ember, 75);
}

function testAllResistanceAppliesToEachChannel() {
  const defense = Stats.computeDefense({ sums: Stats.normalizeSums({ allResistances: 12 }) });
  assert.equal(defense.resistances.ember, 12);
  assert.equal(defense.resistances.river, 12);
  assert.equal(defense.resistances.storm, 12);
}

function testNegativeResistanceAllowedToPenaltyFloor() {
  const defense = Stats.computeDefense({ sums: { ember_resistance: -90 } });
  assert.equal(defense.resistances.ember, -60);
}

function testBlockCapsAtSeventyFive() {
  const defense = Stats.computeDefense({ sums: Stats.normalizeSums({ block: 90 }) });
  assert.equal(defense.blockChance, 75);
}

function testEvasionChanceIncreasesWithEvasion() {
  assert.ok(Stats.evasionChance(500, 250) > Stats.evasionChance(50, 250));
}

function testEvasionChanceIsBounded() {
  assert.equal(Stats.evasionChance(0, 250), 0.05);
  assert.equal(Stats.evasionChance(999999, 1), 0.95);
}

function testEntropyRollPreventsLongMissStreak() {
  let entropy = 0;
  const rolls = [];
  for (let i = 0; i < 4; i += 1) {
    const roll = Stats.entropyEvasionRoll(0.35, entropy);
    entropy = roll.entropy;
    rolls.push(roll.evaded);
  }
  assert.ok(rolls.includes(true));
}

function testGuardMitigationHandlesSmallHitsBetter() {
  assert.ok(Stats.guardMitigation(300, 60) > Stats.guardMitigation(300, 300));
}

function testGuardMitigationIsCapped() {
  assert.equal(Stats.guardMitigation(999999, 1), 0.85);
}

function testPhysicalHitUsesGuard() {
  const guarded = Stats.applyMitigation({ guard: 300, resistances: {} }, { channel: 'physical', damage: 100 });
  assert.ok(guarded < 100);
}

function testElementalHitUsesResistance() {
  const taken = Stats.applyMitigation({ guard: 0, resistances: { ember: 50 } }, { channel: 'ember', damage: 100 });
  assert.equal(taken, 50);
}

function testWardAbsorbsBeforeLife() {
  const defense = { life: 100, ward: 40, guard: 0, evasion: 0, blockChance: 0, resistances: {} };
  const hit = Stats.resolveHit(defense, { channel: 'physical', damage: 70, attack: false });
  assert.equal(hit.wardDamage, 40);
  assert.equal(hit.lifeDamage, 30);
}

function testGloamBypassesWard() {
  const defense = { life: 100, ward: 40, guard: 0, evasion: 0, blockChance: 0, resistances: { gloam: 0 } };
  const hit = Stats.resolveHit(defense, { channel: 'gloam', damage: 30, attack: false });
  assert.equal(hit.wardDamage, 0);
  assert.equal(hit.lifeDamage, 30);
}

function testForcedBlockNegatesHit() {
  const defense = { life: 100, ward: 40, guard: 0, evasion: 0, blockChance: 40, resistances: {} };
  const hit = Stats.resolveHit(defense, { channel: 'physical', damage: 80 }, { forceBlock: true });
  assert.equal(hit.blocked, true);
  assert.equal(hit.lifeDamage, 0);
}

function testWardRechargeWaitsForDelay() {
  const ward = Stats.wardAfterRecharge({ ward: 10, maxWard: 100, secondsSinceDamage: 1 });
  assert.equal(ward, 10);
}

function testWardRechargeRestoresAfterDelay() {
  const ward = Stats.wardAfterRecharge({ ward: 10, maxWard: 100, secondsSinceDamage: 4, delay: 2, rechargePerSecond: 0.25 });
  assert.equal(ward, 60);
}

function testEffectiveHpImprovesWithGuard() {
  const soft = Stats.computeDefense({ level: 5, sums: { guard_flat: 0 } });
  const hard = Stats.computeDefense({ level: 5, sums: { guard_flat: 300 } });
  assert.ok(Stats.effectiveHp(hard, Stats.STANDARD_FOES.bruiser) > Stats.effectiveHp(soft, Stats.STANDARD_FOES.bruiser));
}

function testEffectiveHpImprovesWithResistance() {
  const plain = Stats.computeDefense({ level: 5 });
  const ember = Stats.computeDefense({ level: 5, sums: { ember_resistance: 50 } });
  assert.ok(Stats.effectiveHp(ember, Stats.STANDARD_FOES.emberCaster) > Stats.effectiveHp(plain, Stats.STANDARD_FOES.emberCaster));
}

function testIncreasedIsAdditive() {
  assert.equal(Stats.increasedMultiplier(200), 3);
}

function testMoreIsMultiplicative() {
  assert.equal(Stats.moreMultiplier([50, 50]), 2.25);
}

function testMoreOutvaluesLateIncreased() {
  const base = Stats.computeOffense({ sums: { attack_increased: 300 }, itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 1 } });
  const more = Stats.computeOffense({ sums: { attack_increased: 300 }, itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 1 }, more: [40] });
  assert.ok(more.dps > base.dps);
}

function testWeaponSpeedAffectsDps() {
  const slow = Stats.computeOffense({ itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 1 } });
  const fast = Stats.computeOffense({ itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 2 } });
  assert.ok(fast.dps > slow.dps);
}

function testAddedEmberAffectsDps() {
  const base = Stats.computeOffense({ itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 1 } });
  const ember = Stats.computeOffense({ sums: { added_ember: 10 }, itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 1 } });
  assert.ok(ember.dps > base.dps);
}

function testCritAffectsDps() {
  const base = Stats.computeOffense({ itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 1 } });
  const crit = Stats.computeOffense({ sums: { crit_chance_flat: 40 }, itemBases: { hasWeapon: true, weaponAverage: 10, weaponSpeed: 1 } });
  assert.ok(crit.dps > base.dps);
}

function testDefaultWeaponCanBeEnabledForTree() {
  const sheet = Stats.deriveSheet({ level: 10, useDefaultWeapon: true });
  assert.ok(sheet.dps > 0);
}

function testNoWeaponInventoryCanShowZeroDamage() {
  const sheet = Stats.deriveSheet({ level: 10 });
  assert.equal(sheet.dps, 0);
}

function testCollectItemBasesReadsPackWeapon() {
  const item = { formId: 'dagger', materialId: 'bronze' };
  const bases = Stats.collectItemBases([item], Pack.forms, Pack.materials);
  assert.equal(bases.hasWeapon, true);
  assert.ok(bases.weaponAverage > 0);
}

function testCollectItemBasesReadsPackArmor() {
  const item = { formId: 'wrap', materialId: 'hide' };
  const bases = Stats.collectItemBases([item], Pack.forms, Pack.materials);
  assert.ok(bases.ward > 0);
}

function testDeriveSheetReturnsLegacyFields() {
  const item = { formId: 'dagger', materialId: 'bronze' };
  const sheet = Stats.deriveSheet({
    level: 12,
    sums: Stats.normalizeSums({ hale: 10, emberward: 20, riverblessed: 15 }),
    items: [item],
    forms: Pack.forms,
    materials: Pack.materials
  });
  assert.ok(sheet.life > 0);
  assert.ok(sheet.spirit > 0);
  assert.ok(sheet.damage > 0);
  assert.equal(sheet.resEmber, 20);
  assert.equal(sheet.resRiver, 15);
}

function testStandardFoesIncludeThreeProfiles() {
  assert.deepEqual(Object.keys(Stats.STANDARD_FOES).sort(), ['bruiser', 'emberCaster', 'mixedPack']);
}

const tests = [
  ['registry has five damage channels', testRegistryHasFiveChannels],
  ['registry contains core defense stats', testRegistryContainsCoreDefenseStats],
  ['more multiplier stat is protected', testMoreIsProtected],
  ['validate rejects unprotected more', testValidateRejectsUnprotectedMore],
  ['validate accepts protected more', testValidateAcceptsProtectedMore],
  ['legacy aliases normalize pack stats', testLegacyAliasesNormalizePackStats],
  ['legacy aliases normalize tree stats', testLegacyAliasesNormalizeTreeStats],
  ['attributes start at ten', testAttributesStartAtTen],
  ['all attributes add to each attribute', testAllAttributesAddToEachAttribute],
  ['explicit attributes stack with sums', testExplicitAttributesStackWithSums],
  ['life scales with level', testLifeScalesWithLevel],
  ['strength raises life and guard', testStrengthRaisesLifeAndGuard],
  ['int raises spirit and ward', testIntRaisesSpiritAndWard],
  ['dex raises evasion and accuracy', testDexRaisesEvasionAndAccuracy],
  ['resistance caps at 75', testResistanceCapsAtSeventyFive],
  ['all resistance applies to each channel', testAllResistanceAppliesToEachChannel],
  ['negative resistance floors at penalty cap', testNegativeResistanceAllowedToPenaltyFloor],
  ['block caps at 75', testBlockCapsAtSeventyFive],
  ['evasion chance increases with evasion', testEvasionChanceIncreasesWithEvasion],
  ['evasion chance is bounded', testEvasionChanceIsBounded],
  ['entropy roll prevents long miss streak', testEntropyRollPreventsLongMissStreak],
  ['guard handles small hits better', testGuardMitigationHandlesSmallHitsBetter],
  ['guard mitigation is capped', testGuardMitigationIsCapped],
  ['physical hit uses guard', testPhysicalHitUsesGuard],
  ['elemental hit uses resistance', testElementalHitUsesResistance],
  ['ward absorbs before life', testWardAbsorbsBeforeLife],
  ['gloam bypasses ward', testGloamBypassesWard],
  ['forced block negates hit', testForcedBlockNegatesHit],
  ['ward recharge waits for delay', testWardRechargeWaitsForDelay],
  ['ward recharge restores after delay', testWardRechargeRestoresAfterDelay],
  ['effective HP improves with guard', testEffectiveHpImprovesWithGuard],
  ['effective HP improves with resistance', testEffectiveHpImprovesWithResistance],
  ['increased is additive', testIncreasedIsAdditive],
  ['more is multiplicative', testMoreIsMultiplicative],
  ['more outvalues late increased', testMoreOutvaluesLateIncreased],
  ['weapon speed affects DPS', testWeaponSpeedAffectsDps],
  ['added ember affects DPS', testAddedEmberAffectsDps],
  ['crit affects DPS', testCritAffectsDps],
  ['default weapon can be enabled for tree', testDefaultWeaponCanBeEnabledForTree],
  ['no-weapon inventory can show zero damage', testNoWeaponInventoryCanShowZeroDamage],
  ['collect item bases reads pack weapon', testCollectItemBasesReadsPackWeapon],
  ['collect item bases reads pack armor', testCollectItemBasesReadsPackArmor],
  ['derive sheet returns legacy fields', testDeriveSheetReturnsLegacyFields],
  ['standard foes include three profiles', testStandardFoesIncludeThreeProfiles]
];

let passed = 0;
let failed = 0;

for (const [name, testFn] of tests) {
  try {
    testFn();
    console.log(`✔ ${name}`);
    passed += 1;
  } catch (error) {
    failed += 1;
    console.error(`✘ ${name}`);
    console.error(error.stack || error.message);
  }
}

if (failed > 0) {
  console.error(`\n${failed} stat test(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${passed} stat test(s) passed.`);
