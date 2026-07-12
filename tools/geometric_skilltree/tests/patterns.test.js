const assert = require('node:assert/strict');
const Patterns = require('../assets/patterns.js');

const {
  HEX_DIRECTIONS,
  axialKey,
  edgeKey,
  hexDistance,
  detectPatterns
} = Patterns;

function parseId(id) {
  const [q, r] = id.split(',').map(Number);
  return { q, r };
}

function makeNode(id, active = false) {
  const { q, r } = parseId(id);
  return {
    id,
    q,
    r,
    ring: hexDistance(q, r),
    active,
    source: 'main'
  };
}

function lattice(depth, activeIds = []) {
  const active = new Set(activeIds);
  const nodes = [];
  for (let q = -depth; q <= depth; q += 1) {
    for (let r = -depth; r <= depth; r += 1) {
      if (hexDistance(q, r) <= depth) {
        const id = axialKey(q, r);
        nodes.push(makeNode(id, active.has(id)));
      }
    }
  }
  return nodes;
}

function conduit(a, b, side = 'inner') {
  return {
    id: edgeKey(a, b),
    fromId: a,
    toId: b,
    allocatedVariant: side
  };
}

function ringIds(centerId, radius) {
  const center = parseId(centerId);
  const ids = [];
  let q = center.q + HEX_DIRECTIONS[4].q * radius;
  let r = center.r + HEX_DIRECTIONS[4].r * radius;
  for (let side = 0; side < 6; side += 1) {
    const dir = HEX_DIRECTIONS[side];
    for (let step = 0; step < radius; step += 1) {
      ids.push(axialKey(q, r));
      q += dir.q;
      r += dir.r;
    }
  }
  return ids;
}

function perimeterConduits(ids, side = 'inner') {
  return ids.map((id, index) => conduit(id, ids[(index + 1) % ids.length], side));
}

function activeSet(...groups) {
  return Array.from(new Set(groups.flat()));
}

function report({ depth = 3, activeIds = [], conduits = [], tuning = {} }) {
  return detectPatterns({
    nodes: lattice(depth, activeIds),
    conduits,
    depth,
    tuning
  });
}

function conduitIntersections(left, right) {
  const leftIds = new Set(left.flatMap(path => path.conduitIds));
  return right.flatMap(path => path.conduitIds).filter(id => leftIds.has(id));
}

function testWavesAndAdditiveNodeBoosts() {
  const waveResult = report({
    activeIds: ['0,0', '1,0', '1,-1'],
    conduits: [
      conduit('0,0', '1,0', 'inner'),
      conduit('1,0', '1,-1', 'outer')
    ]
  });

  assert.equal(waveResult.waves.length, 1, 'Alternating conduits should form one maximal wave.');
  assert.equal(waveResult.waves[0].length, 2, 'The wave should count conduits, not nodes.');
  assert.ok(waveResult.nodeBoosts['1,0'].percent > waveResult.nodeBoosts['0,0'].percent, 'Interior wave nodes should receive stronger boosts than endpoints.');

  const result = report({
    activeIds: ['0,0', '1,0', '2,0', '3,0'],
    conduits: [
      conduit('0,0', '1,0', 'inner'),
      conduit('1,0', '2,0', 'outer'),
      conduit('2,0', '3,0', 'inner')
    ]
  });

  assert.equal(result.waves.length, 1, 'Alternating conduits should form one maximal wave.');
  assert.equal(result.waves[0].length, 3, 'The wave should count conduits, not nodes.');
  assert.equal(result.rods.length, 1, 'The same straight path should also count as a rod.');
  assert.ok(result.nodeBoosts['0,0'].reasons.some(reason => reason.includes('wave')), 'Node boost should include wave reason text.');
  assert.ok(result.nodeBoosts['0,0'].reasons.some(reason => reason.includes('rod endpoint')), 'Node boost should include rod reason text.');
  assert.equal(result.nodeBoosts['0,0'].percent, 15, 'Wave and rod boosts should stack additively in one node bucket.');
}

function testFlowsAndExclusiveSegments() {
  const ids = ['0,0', '1,0', '2,0', '3,0'];
  const result = report({
    activeIds: ids,
    conduits: [
      conduit('0,0', '1,0', 'outer'),
      conduit('1,0', '2,0', 'outer'),
      conduit('2,0', '3,0', 'outer')
    ]
  });

  assert.equal(result.flows.length, 1, 'Same-chirality path should form a flow.');
  assert.equal(result.flows[0].length, 3);
  result.flows[0].conduitIds.forEach(id => {
    assert.equal(result.conduitBoosts[id].percent, 25, 'Length-3 flow should grant the minimum conduit boost.');
  });
  assert.deepEqual(conduitIntersections(result.waves, result.flows), [], 'A conduit should never be assigned to both a wave and a flow.');
}

function testTieBreakingChoosesCloserWave() {
  const result = report({
    activeIds: ['0,0', '1,0', '2,0', '1,-1'],
    conduits: [
      conduit('0,0', '1,0', 'inner'),
      conduit('1,0', '2,0', 'outer'),
      conduit('1,0', '1,-1', 'outer')
    ]
  });
  const sharedWave = result.waves.find(wave => wave.conduitIds.includes(edgeKey('0,0', '1,0')));

  assert.ok(sharedWave, 'The shared conduit should belong to one selected wave.');
  assert.ok(sharedWave.nodeIds.includes('1,-1'), 'Equal-length wave ties should prefer the path closer to origin.');
  assert.equal(sharedWave.nodeIds.includes('2,0'), false, 'The farther tied branch should lose the shared conduit.');
}

function testMeridian() {
  const ids = ['-2,0', '-1,0', '0,0', '1,0', '2,0'];
  const result = report({
    depth: 2,
    activeIds: ids,
    conduits: [
      conduit('-2,0', '-1,0', 'inner'),
      conduit('-1,0', '0,0', 'outer'),
      conduit('0,0', '1,0', 'inner'),
      conduit('1,0', '2,0', 'outer')
    ]
  });

  assert.equal(result.meridians.length, 1, 'A rim-to-rim alternating wave through origin should be a meridian.');
  assert.ok(result.nodeBoosts['-2,0'].reasons.includes('great wave endpoint'));
  assert.ok(result.nodeBoosts['2,0'].reasons.includes('great wave endpoint'));
}

function testLoopsConcentricVesicaGrandOrbitAndEnclosure() {
  const r1 = ringIds('0,0', 1);
  const r2 = ringIds('0,0', 2);
  const secondCenterRing = ringIds('2,-1', 1);
  const result = report({
    depth: 3,
    activeIds: activeSet(['0,0', '2,-1'], r1, r2, secondCenterRing),
    conduits: [
      ...perimeterConduits(r1),
      ...perimeterConduits(r2),
      ...perimeterConduits(secondCenterRing)
    ]
  });

  assert.ok(result.loops.some(loop => loop.centerId === '0,0' && loop.radius === 1), 'Radius-1 loop crown should be detected.');
  assert.ok(result.loops.some(loop => loop.centerId === '0,0' && loop.radius === 2), 'Radius-2 loop crown should be detected.');
  assert.ok(result.concentric.some(item => item.centerId === '0,0'), 'Radius-1 plus radius-2 loops should form a concentric crown.');
  assert.ok(result.vesicas.some(item => item.centers.includes('0,0') && item.centers.includes('2,-1')), 'Radius-1 loops sharing one edge should form a vesica.');
  assert.ok(result.grandOrbits.some(orbit => orbit.ring === 1), 'A complete ring around origin should form a grand orbit.');

  const enclosure = report({
    depth: 2,
    activeIds: r1,
    conduits: perimeterConduits(r1)
  });
  assert.equal(enclosure.enclosures.length, 1, 'A completed loop around an inactive center should be a warding enclosure.');
  assert.equal(enclosure.enclosures[0].centerId, '0,0');
}

function testSymmetryFamilies() {
  const mandalaIds = ringIds('0,0', 1);
  const result = report({
    depth: 1,
    activeIds: activeSet(mandalaIds, ['0,0']),
    conduits: perimeterConduits(mandalaIds)
  });

  assert.ok(result.symmetry.mirrorPairs.length >= 2, 'Mirror pairs should be counted smoothly.');
  assert.ok(result.symmetry.trines.length >= 1, '120-degree rotational triples should be detected.');
  assert.ok(result.symmetry.mandalas.length >= 1, 'Sixfold mandala sets should be detected.');
  assert.ok(result.symmetry.mirroredConduits >= 1, 'Mirrored conduits should contribute to mirror symmetry.');
}

function testCircuitsRodsAndCrossroads() {
  const result = report({
    depth: 2,
    activeIds: ['0,0', '1,0', '0,1', '1,-1', '-1,0'],
    conduits: [
      conduit('0,0', '1,0', 'inner'),
      conduit('1,0', '0,1', 'outer'),
      conduit('0,1', '0,0', 'inner'),
      conduit('0,0', '1,-1', 'inner'),
      conduit('0,0', '-1,0', 'outer')
    ]
  });

  assert.ok(result.circuits.redundant.length >= 3, 'Triangle cycle should mark redundant conduits.');
  assert.ok(result.crossroads.some(hub => hub.nodeId === '0,0' && hub.degree === 4), 'A node with four allocated conduits should be a crossroad.');

  const rodResult = report({
    activeIds: ['-1,0', '0,0', '1,0', '2,0'],
    conduits: [
      conduit('-1,0', '0,0', 'inner'),
      conduit('0,0', '1,0', 'outer'),
      conduit('1,0', '2,0', 'inner')
    ]
  });
  assert.equal(rodResult.rods.length, 1, 'Straight three-conduit runs should be rods.');
  assert.ok(rodResult.nodeBoosts['-1,0'].reasons.some(reason => reason.includes('rod endpoint')));
  assert.ok(rodResult.nodeBoosts['2,0'].reasons.some(reason => reason.includes('rod endpoint')));
}

function testPatternBonusesExposeEveryFamily() {
  const result = report({
    activeIds: ['0,0', '1,0', '2,0', '3,0'],
    conduits: [
      conduit('0,0', '1,0', 'inner'),
      conduit('1,0', '2,0', 'outer'),
      conduit('2,0', '3,0', 'inner')
    ]
  });
  const bonusIds = result.bonuses.map(bonus => bonus.id).sort();
  assert.deepEqual(
    bonusIds,
    ['circle', 'circuit', 'crossroad', 'enclosure', 'flow', 'mandala', 'meridian', 'mirror', 'orbit', 'rod', 'trine', 'vesica', 'wave'].sort(),
    'The pattern panel should receive one bonus row for every §5 family.'
  );
}

const tests = [
  ['waves and additive node boost stacking', testWavesAndAdditiveNodeBoosts],
  ['flows and wave/flow segment exclusivity', testFlowsAndExclusiveSegments],
  ['deterministic tie-breaking chooses the closer wave', testTieBreakingChoosesCloserWave],
  ['great wave meridian detection', testMeridian],
  ['loops, concentric crowns, vesicas, grand orbits, and enclosures', testLoopsConcentricVesicaGrandOrbitAndEnclosure],
  ['mirror, trine, and mandala symmetry', testSymmetryFamilies],
  ['circuits, rods, and crossroads', testCircuitsRodsAndCrossroads],
  ['pattern bonuses expose every family', testPatternBonusesExposeEveryFamily]
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
  console.error(`\n${failed} pattern detector test(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${passed} pattern detector test(s) passed.`);
