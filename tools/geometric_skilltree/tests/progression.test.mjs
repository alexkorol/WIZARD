import assert from 'node:assert/strict';
import { SkillTreeProgression } from '../assets/progression.mjs';

function createSampleTree() {
  const nodes = [
    { id: 'root', tier: 0, tierName: 'Seed', tierDescription: 'Origin', primaryStat: 'STR' },
    { id: 'childA', tier: 1, tierName: 'Inner', tierDescription: 'First branch', primaryStat: 'STR' },
    { id: 'childB', tier: 1, tierName: 'Inner', tierDescription: 'Second branch', primaryStat: 'DEX' },
    { id: 'outer', tier: 2, tierName: 'Outer', tierDescription: 'Outer growth', primaryStat: 'INT' },
    { id: 'keystone', tier: 2, tierName: 'Outer', tierDescription: 'Keystone focus', primaryStat: 'WIS' }
  ];

  const arcs = [
    { id: 'a0', from: 'root', to: 'childA' },
    { id: 'a1', from: 'root', to: 'childB' },
    { id: 'a2', from: 'childA', to: 'outer' },
    { id: 'a3', from: 'childB', to: 'outer' },
    { id: 'a4', from: 'childA', to: 'keystone' },
    { id: 'a5', from: 'childB', to: 'keystone' }
  ];

  const tierGateRequirements = new Map([
    [1, 1],
    [2, 2]
  ]);

  const keystoneConfig = {
    keystone: {
      modifier: 'Celestial Edge Keystone',
      prerequisites: {
        nodes: ['childA', 'childB', 'outer'],
        minTierTotals: [{ tier: 1, count: 2 }]
      }
    }
  };

  return { nodes, arcs, tierGateRequirements, keystoneConfig };
}

function testUnlockFlow() {
  const { nodes, arcs, tierGateRequirements, keystoneConfig } = createSampleTree();
  const progression = new SkillTreeProgression({
    nodes,
    arcs,
    rootNodeId: 'root',
    tierGateRequirements,
    keystoneConfig,
    pointsPerLevel: 2,
    baseRespecCost: 2,
    respecCostGrowth: 1.5
  });

  progression.grantLevel(2);

  let errorTriggered = false;
  try {
    progression.unlockNode('outer');
  } catch (error) {
    errorTriggered = true;
    assert.match(error.message, /Requires/);
  }
  assert.ok(errorTriggered, 'Should not unlock outer node before meeting prerequisites');

  progression.unlockNode('childA');
  progression.unlockNode('childB');

  const statusAfterParents = progression.getNodeStatus('outer');
  assert.strictEqual(statusAfterParents.available, true, 'Outer node should become available after parents unlock');

  progression.unlockNode('outer');
  assert.ok(progression.isUnlocked('outer'), 'Outer node should unlock successfully');
  assert.strictEqual(progression.getAvailablePoints(), 1, 'Points should deduct on unlock');
}

function testKeystonePrerequisites() {
  const { nodes, arcs, tierGateRequirements, keystoneConfig } = createSampleTree();
  const progression = new SkillTreeProgression({
    nodes,
    arcs,
    rootNodeId: 'root',
    tierGateRequirements,
    keystoneConfig,
    pointsPerLevel: 2,
    baseRespecCost: 2,
    respecCostGrowth: 1.5
  });

  progression.grantLevel(3);
  progression.unlockNode('childA');
  progression.unlockNode('childB');

  let keystoneError = null;
  try {
    progression.unlockNode('keystone');
  } catch (error) {
    keystoneError = error;
  }
  assert.ok(keystoneError, 'Keystone should require prerequisites');
  assert.match(keystoneError.message, /Keystone prerequisite/);

  progression.unlockNode('outer');

  const keystoneStatus = progression.getNodeStatus('keystone');
  assert.ok(keystoneStatus.available, 'Keystone should become available after meeting prerequisites');

  const result = progression.unlockNode('keystone');
  assert.ok(result.modifier.includes('Celestial Edge'), 'Keystone unlock should return modifier text');
}

function testRespecFlow() {
  const { nodes, arcs, tierGateRequirements, keystoneConfig } = createSampleTree();
  const progression = new SkillTreeProgression({
    nodes,
    arcs,
    rootNodeId: 'root',
    tierGateRequirements,
    keystoneConfig,
    pointsPerLevel: 2,
    baseRespecCost: 2,
    respecCostGrowth: 1.5
  });

  progression.grantLevel(3);
  progression.unlockNode('childA');
  progression.unlockNode('childB');

  assert.ok(progression.canRespec(), 'Should allow respec when nodes allocated');
  const preRespecPoints = progression.getAvailablePoints();

  const respecResult = progression.respec();
  assert.strictEqual(respecResult.refunded, 2, 'Refund should equal allocated nodes');
  assert.strictEqual(respecResult.cost, 2, 'Cost should match base respec cost on first reset');
  assert.strictEqual(progression.getAvailablePoints(), preRespecPoints + respecResult.refunded - respecResult.cost);
  assert.strictEqual(progression.getAllocatedNodes().length, 1, 'Only root should remain allocated after respec');
  assert.strictEqual(progression.canRespec(), false, 'Cannot respec when only root remains');
  assert.strictEqual(progression.getRespecCost(), 3, 'Respec cost should scale after first reset');

  let secondRespecError = null;
  try {
    progression.respec();
  } catch (error) {
    secondRespecError = error;
  }
  assert.ok(secondRespecError, 'Second respec should fail without additional allocations');
}

const tests = [
  ['Unlock flow enforces gating', testUnlockFlow],
  ['Keystone prerequisites enforced', testKeystonePrerequisites],
  ['Respec refunds and scales cost', testRespecFlow]
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
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${passed} test(s) passed.`);
