import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import { createRequire } from 'node:module';

const TREE_DATA_PATH = new URL('../assets/tree-data.js', import.meta.url);
const INDEX_PATH = new URL('../index.html', import.meta.url);

function loadTreeData() {
  const source = readFileSync(TREE_DATA_PATH, 'utf8');
  const context = { window: {} };
  new Script(source, { filename: TREE_DATA_PATH.pathname }).runInNewContext(context);
  return context.window.TREE_DATA;
}

function hexDistance(q, r) {
  const s = -q - r;
  return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
}

function expectedSeatKeys(depth) {
  const keys = [];
  for (let q = -depth; q <= depth; q += 1) {
    for (let r = -depth; r <= depth; r += 1) {
      if (hexDistance(q, r) <= depth) {
        keys.push(`${q},${r}`);
      }
    }
  }
  return keys;
}

function isHexCorner(q, r, ring) {
  const s = -q - r;
  return [Math.abs(q), Math.abs(r), Math.abs(s)].filter(value => value === ring).length >= 2;
}

function testMainSeatCoverage() {
  const data = loadTreeData();
  assert.equal(data.mainRingDepth, 10, 'Main lattice must have ten rings.');
  assert.equal(data.startPoints?.skill, 140, 'Phase 0 point pool should be 140 skill points.');

  const seats = data.seats || {};
  const expected = expectedSeatKeys(data.mainRingDepth);
  assert.equal(Object.keys(seats).length, 331, 'Ten-ring hex lattice should contain 331 main seats.');
  assert.equal(expected.length, 331, 'Coverage test expectation should match the ten-ring lattice size.');

  const missing = expected.filter(key => !seats[key]);
  const extra = Object.keys(seats).filter(key => !expected.includes(key));
  assert.deepEqual(missing, [], 'Every ten-ring lattice coordinate must have a TREE_DATA seat.');
  assert.deepEqual(extra, [], 'TREE_DATA must not contain seats outside the ten-ring lattice.');
}

function testSeatShape() {
  const data = loadTreeData();
  Object.entries(data.seats).forEach(([key, seat]) => {
    assert.equal(seat.id, key, `${key} should carry its coordinate id.`);
    assert.equal(typeof seat.name, 'string', `${key} should have a name.`);
    assert.ok(seat.name.length > 0, `${key} should not have an empty name.`);
    assert.ok(Array.isArray(seat.effects), `${key} should have effect lines.`);
    assert.ok(seat.effects.length > 0, `${key} should have at least one effect line.`);
    assert.ok(Array.isArray(seat.tags), `${key} should have tags.`);
    assert.equal(seat.ring, hexDistance(seat.q, seat.r), `${key} ring should match axial distance.`);
    assert.ok(['empty', 'draft', 'review', 'final', 'cut'].includes(seat.status), `${key} should have a designer status.`);
  });
}

function testRimGateways() {
  const data = loadTreeData();
  const gateways = Object.values(data.seats)
    .filter(seat => seat.type === 'gateway')
    .map(seat => seat.id)
    .sort();
  const expected = Object.values(data.seats)
    .filter(seat => seat.ring === data.mainRingDepth && isHexCorner(seat.q, seat.r, data.mainRingDepth))
    .map(seat => seat.id)
    .sort();

  assert.deepEqual(gateways, expected, 'The six subtree gateways should sit on ring-10 hex corners.');
  assert.deepEqual(gateways, ['-10,0', '-10,10', '0,-10', '0,10', '10,-10', '10,0']);
}

function testFileCompatibleScriptLoading() {
  const html = readFileSync(INDEX_PATH, 'utf8');
  const statsScriptIndex = html.indexOf('<script src="../rpg_inventory/core/verdigris-stats.js"></script>');
  const dataScriptIndex = html.indexOf('<script src="assets/tree-data.js"></script>');
  const patternsScriptIndex = html.indexOf('<script src="assets/patterns.js"></script>');
  const appScriptIndex = html.indexOf('<script>', dataScriptIndex);
  assert.ok(statsScriptIndex > 0, 'index.html should load verdigris-stats.js as a classic script.');
  assert.ok(dataScriptIndex > 0, 'index.html should load tree-data.js as a classic script.');
  assert.ok(patternsScriptIndex > 0, 'index.html should load patterns.js as a classic script.');
  assert.ok(statsScriptIndex < dataScriptIndex, 'verdigris-stats.js should load before tree-data.js.');
  assert.ok(dataScriptIndex < patternsScriptIndex, 'tree-data.js should load before patterns.js.');
  assert.ok(patternsScriptIndex < appScriptIndex, 'patterns.js should load before the main app script.');
  assert.equal(/<script\s+type=["']module["']/i.test(html), false, 'The standalone app should not require module scripts.');
  assert.equal(/\bfetch\s*\(/.test(html), false, 'The standalone app should not fetch data at runtime.');
}

function testPhase4AuthoredContent() {
  const require = createRequire(import.meta.url);
  const stats = require('../../rpg_inventory/core/verdigris-stats.js');
  const data = loadTreeData();
  const seats = Object.values(data.seats);

  const unauthored = seats.filter(seat => ['empty', 'draft'].includes(seat.status));
  assert.deepEqual(unauthored.map(seat => seat.id), [], 'Phase 4: zero empty or draft seats remain.');

  const named = seats.filter(seat => !['small', 'origin', 'socket'].includes(seat.type));
  const seen = new Map();
  named.forEach(seat => {
    assert.equal(seen.has(seat.name), false, `Duplicate named seat "${seat.name}" (${seen.get(seat.name)} and ${seat.id}).`);
    seen.set(seat.name, seat.id);
  });

  seats.forEach(seat => {
    if (!seat.stat) return;
    const resolved = stats.STAT_REGISTRY[seat.stat] || stats.STAT_REGISTRY[stats.ALIASES[seat.stat]];
    assert.ok(resolved, `${seat.id} stat "${seat.stat}" must resolve in the shared registry.`);
  });

  seats.forEach(seat => {
    if (seat.type === 'small') {
      assert.ok(seat.clusterId, `Small seat ${seat.id} must belong to a cluster.`);
    }
  });

  const roleCounts = seats.reduce((out, seat) => {
    out[seat.type] = (out[seat.type] || 0) + 1;
    return out;
  }, {});
  assert.equal(roleCounts.waystone, 6, 'Six ring-5 Waystones.');
  assert.equal(roleCounts.keystone, 6, 'Six ring-6 keystones.');
  assert.equal(roleCounts.sign, 6, 'Six ring-8 Signs.');
  assert.equal(roleCounts.class, 6, 'Six ring-7 class milestones.');
  assert.equal(roleCounts.socket, 12, 'Twelve jewel socket seats.');
  assert.equal(roleCounts.mastery, 6, 'Six ring-3 masteries.');
  assert.equal(roleCounts.gateway, 6, 'Six ring-10 gateways.');

  const html = readFileSync(INDEX_PATH, 'utf8');
  assert.equal(html.includes('NODE_EFFECTS'), false, 'The hash-pool generator must be deleted.');
  assert.equal(html.includes('effectTemplate'), false, 'Procedural effect templates must be deleted.');
}

const tests = [
  ['TREE_DATA covers the ten-ring lattice', testMainSeatCoverage],
  ['TREE_DATA seats carry Phase 0 authoring metadata', testSeatShape],
  ['Subtree gateways moved to the ring-10 corners', testRimGateways],
  ['index.html keeps file-compatible classic script loading', testFileCompatibleScriptLoading],
  ['Phase 4: fully authored tree with unique named seats', testPhase4AuthoredContent]
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

console.log(`\nAll ${passed} tree-data test(s) passed.`);
