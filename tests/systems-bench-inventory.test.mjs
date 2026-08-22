import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  applyInventoryStateEvent,
  createBench,
  createInventoryPreviewState,
  createSessionExport,
  validateCatalog,
  validateFixture
} = require('../tools/systems_bench/bench.js');

function readJson(relativePath) {
  return JSON.parse(readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
}

const catalog = readJson('../tools/systems_bench/fixtures/catalog.v1.json');
const fixture = readJson('../tools/systems_bench/fixtures/inventory-state.v1.json');
const malformed = readJson('../tools/systems_bench/fixtures/inventory-state.invalid.v1.json');

validateCatalog(catalog);
validateFixture(fixture);
validateFixture(malformed);

assert.equal(catalog.fixtures.length, 2, 'catalog retains resources and adds inventory');
assert.deepEqual(
  catalog.fixtures.map(entry => entry.id),
  ['resource-session.v1', 'inventory-state.v1'],
  'catalog identity and order are frozen'
);
assert.equal(fixture.id, 'inventory-state.v1');
assert.equal(fixture.targetModuleId, 'wizard.rpg-inventory');
assert.deepEqual(fixture.events.map(event => event.sequence), [0, 1, 2, 3, 4]);
assert.deepEqual(fixture.events.map(event => event.timeMs), [0, 700, 1400, 2100, 2800]);

const bench = createBench(fixture);
let targetState = createInventoryPreviewState();
assert.equal(bench.snapshot().index, -1, 'new bench starts before the fixture');

const initialEvent = bench.step();
targetState = applyInventoryStateEvent(targetState, initialEvent);
assert.equal(bench.snapshot().index, 0, 'step advances exactly one event');
assert.equal(targetState.inventory.length, 3, 'initial snapshot contains three inventory items');

bench.play();
const due = bench.tick(1400);
assert.deepEqual(due.map(event => event.sequence), [1, 2], 'playback drains every event due at the current playhead');
for (const event of due) targetState = applyInventoryStateEvent(targetState, event);
bench.pause();
assert.equal(bench.snapshot().playing, false, 'pause stops playback');
assert.equal(bench.snapshot().index, 2, 'nonzero playhead is inspectable');
assert.equal(targetState.equipment.mainHand.id, 'training-blade');
assert.equal(targetState.equipment.charm.id, 'copper-ward');
assert.equal(targetState.inventory[0].id, 'travel-flask');

const exported = createSessionExport(
  fixture,
  bench.snapshot(),
  targetState,
  '2026-08-22T00:00:00.000Z'
);
assert.equal(exported.schemaVersion, 1);
assert.equal(exported.scenarioId, 'inventory-state.v1');
assert.equal(exported.state.index, 2);
assert.equal(exported.targetState.lastSequence, 2);
assert.equal(exported.events.length, 5);

const importedBench = createBench(fixture);
const importedSnapshot = importedBench.restore(exported.state);
let importedTarget = createInventoryPreviewState();
for (const event of importedSnapshot.applied) {
  importedTarget = applyInventoryStateEvent(importedTarget, event);
}
assert.deepEqual(importedSnapshot, exported.state, 'bench state export/import round-trips exactly');
assert.deepEqual(importedTarget, exported.targetState, 'target preview state export/import round-trips exactly');

const reset = importedBench.reset();
assert.equal(reset.index, -1);
assert.equal(reset.applied.length, 0);
assert.equal(reset.lastPayload, null);

assert.throws(
  () => applyInventoryStateEvent(createInventoryPreviewState(), malformed.events[0]),
  /inventory state inventory must be an array/,
  'malformed inventory event fails for its missing inventory array'
);

console.log('negative inventory-state.invalid.v1: inventory state inventory must be an array');
console.log('ok systems bench inventory: catalog, order, play/pause/step/reset, export/import, exact target state');
