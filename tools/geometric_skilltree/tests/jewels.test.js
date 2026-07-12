const assert = require('node:assert/strict');
const Jewels = require('../assets/jewels.js');
const Stats = require('../../rpg_inventory/core/verdigris-stats.js');

const { STASH, SAGAS, sagaTransform, sagaHash, describe } = Jewels;

function resolves(stat) {
  return Boolean(Stats.STAT_REGISTRY[stat] || Stats.STAT_REGISTRY[Stats.ALIASES[stat]]);
}

function fakeNode(id, type, stat = 'attackDamage', amount = 10) {
  return { id, type, stat, amount };
}

function testStashStatsResolve() {
  STASH.forEach(jewel => {
    (jewel.mods || []).forEach(mod => {
      assert.ok(resolves(mod.stat), `${jewel.id} mod stat "${mod.stat}" must resolve in the registry.`);
    });
    if (jewel.grant) {
      assert.ok(resolves(jewel.grant.stat), `${jewel.id} grant stat "${jewel.grant.stat}" must resolve.`);
    }
    assert.ok(describe(jewel).length > 0 || jewel.family === 'whorl', `${jewel.id} should describe itself.`);
  });
  const families = new Set(STASH.map(jewel => jewel.family));
  assert.deepEqual(Array.from(families).sort(), ['change', 'eye', 'pattern', 'saga', 'whorl'],
    'The curated stash must demonstrate all five families.');
}

function testSagaSeedDeterminism() {
  const jewel = STASH.find(entry => entry.id === 'saga-drowned-773');
  const node = fakeNode('3,-1', 'small');
  const first = sagaTransform(jewel, node);
  const again = sagaTransform(jewel, node);
  assert.deepEqual(first, again, 'The same seed must always tell the same story.');

  const otherYear = { ...jewel, saga: { culture: 'drowned-court', seed: 774 } };
  const differsSomewhere = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].some(id =>
    JSON.stringify(sagaTransform(jewel, fakeNode(id, 'small'))) !==
    JSON.stringify(sagaTransform(otherYear, fakeNode(id, 'small')))
  );
  assert.ok(differsSomewhere, 'A different year should tell a different story somewhere.');
  assert.notEqual(sagaHash(773, 'x'), sagaHash(774, 'x'), 'Seed must feed the hash.');

  Object.values(SAGAS).forEach(saga => {
    (saga.smallPool || []).forEach(pick => assert.ok(resolves(pick.stat), `${saga.name} pool stat resolves.`));
    (saga.notablePool || []).forEach(pick => assert.ok(resolves(pick.stat), `${saga.name} pool stat resolves.`));
  });
}

function testSagaPhilosophies() {
  const salt = STASH.find(entry => entry.id === 'saga-salt-608');
  const saltSmall = sagaTransform(salt, fakeNode('1,1', 'small'));
  assert.equal(saltSmall.blank, true, 'Salt Oath smalls grant nothing.');
  const saltNotable = sagaTransform(salt, fakeNode('1,1', 'notable', 'attackDamage', 20));
  assert.equal(saltNotable.amount, 40, 'Salt Oath notables are doubled.');

  const herd = STASH.find(entry => entry.id === 'saga-herd-950');
  const herdSmall = sagaTransform(herd, fakeNode('2,0', 'small', 'spellDamage', 9));
  assert.equal(herdSmall.stat, 'str', 'First Herd rebases smalls onto Strength.');
  assert.ok(herdSmall.amount >= 4 && herdSmall.amount <= 7, 'First Herd amounts stay in range.');

  const survey = STASH.find(entry => entry.id === 'saga-survey-431');
  const surveySmall = sagaTransform(survey, fakeNode('0,2', 'small'));
  assert.equal(surveySmall.testimony, 1, 'Quiet Survey smalls grant Testimony.');
  const surveyNotable = sagaTransform(survey, fakeNode('0,3', 'notable'));
  assert.equal(surveyNotable.scalesWithTestimony, true, 'Quiet Survey notables scale per Testimony.');

  const kiln = STASH.find(entry => entry.id === 'saga-kiln-112');
  const kilnNotable = sagaTransform(kiln, fakeNode('4,0', 'notable', 'attackDamage', 24));
  assert.equal(kilnNotable.amount, 24, 'Kilnfathers keep the original effect.');
  assert.equal(kilnNotable.extraMods.length, 1, 'Kilnfathers add an ember rider.');

  [salt, herd, survey, kiln].forEach(jewel => {
    const keystone = sagaTransform(jewel, fakeNode('9,9', 'keystone'));
    assert.equal(keystone, null, 'Keystones and other named seats are untouched for now.');
  });

  const conquered = sagaTransform(salt, fakeNode('1,1', 'small'));
  assert.equal(conquered.conquered, true, 'Transformed nodes are marked conquered (firewall).');
}

const tests = [
  ['stash stats resolve and cover all five families', testStashStatsResolve],
  ['saga seeds are deterministic', testSagaSeedDeterminism],
  ['saga philosophies transform as designed', testSagaPhilosophies]
];

let passed = 0;
let failed = 0;
for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`✔ ${name}`);
    passed += 1;
  } catch (error) {
    failed += 1;
    console.error(`✘ ${name}`);
    console.error(error.stack || error.message);
  }
}
if (failed > 0) {
  console.error(`\n${failed} jewel test(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${passed} jewel test(s) passed.`);
