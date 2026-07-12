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
  assert.equal(result.nodeBoosts['0,0'].percent, 13, 'Wave and rod boosts should stack additively in one node bucket.');
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
  const vesica = result.vesicas.find(item => item.centers.includes('0,0') && item.centers.includes('2,-1'));
  assert.ok(vesica, 'Radius-1 loops sharing one edge should form a vesica.');
  assert.equal(vesica.lensNodeIds.length, 2, 'A vesica should expose its two lens nodes.');
  vesica.lensNodeIds.forEach(id => {
    assert.ok(vesica.centers.every(center => hexDistance(parseId(id).q - parseId(center).q, parseId(id).r - parseId(center).r) === 1), 'Lens nodes should sit adjacent to both centers.');
  });
  assert.equal(result.tuning.vesica.lensShare, 0.5, 'Vesica tuning should carry the lens share for the app layer.');
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

function testPatternStones() {
  // wave-length: a stone in radius lengthens the wave for payoff purposes.
  const base = {
    activeIds: ['0,0', '1,0', '1,-1'],
    conduits: [
      conduit('0,0', '1,0', 'inner'),
      conduit('1,0', '1,-1', 'outer')
    ]
  };
  const without = report(base);
  const withStone = detectPatterns({
    nodes: lattice(3, base.activeIds),
    conduits: base.conduits,
    depth: 3,
    stones: [{ q: 1, r: 0, radius: 2, effect: 'wave-length', value: 1 }]
  });
  assert.equal(without.waves[0].effectiveLength, undefined, 'No stone, no bonus length.');
  assert.equal(withStone.waves[0].effectiveLength, 3, 'A wave-length stone should count the wave one longer.');
  assert.ok(
    withStone.nodeBoosts['1,0'].percent > without.nodeBoosts['1,0'].percent,
    'The longer effective wave should pay its nodes more.'
  );

  // loop-gap: a stone lets a loop miss one perimeter conduit and still crown.
  const r1 = ringIds('0,0', 1);
  const loopConduits = perimeterConduits(r1).slice(0, 5); // one edge missing
  const gapless = report({ depth: 2, activeIds: activeSet(['0,0'], r1), conduits: loopConduits });
  assert.equal(gapless.loops.length, 0, 'A broken ring is not a loop without help.');
  const bridged = detectPatterns({
    nodes: lattice(2, activeSet(['0,0'], r1)),
    conduits: loopConduits,
    depth: 2,
    stones: [{ q: 0, r: 0, radius: 2, effect: 'loop-gap', value: 1 }]
  });
  assert.ok(bridged.loops.some(loop => loop.centerId === '0,0' && loop.radius === 1),
    'A loop-gap stone should crown the broken ring.');
}

function testWaystoneHooks() {
  // Blue Milestone: waves through the seat count +1 length.
  const waveBase = {
    activeIds: ['0,0', '1,0', '1,-1'],
    conduits: [conduit('0,0', '1,0', 'inner'), conduit('1,0', '1,-1', 'outer')]
  };
  const blue = detectPatterns({
    nodes: lattice(3, waveBase.activeIds),
    conduits: waveBase.conduits,
    depth: 3,
    waystones: [{ q: 1, r: 0, id: '1,0', effect: 'wave-length', value: 1 }]
  });
  assert.equal(blue.waves[0].effectiveLength, 3, 'A wave through the Blue Milestone counts +1 length.');

  // Unlit Milestone: flows through the seat count +1 length (pays a longer flow rate).
  const flowIds = ['0,0', '1,0', '2,0', '3,0'];
  const flowConduits = [conduit('0,0', '1,0', 'outer'), conduit('1,0', '2,0', 'outer'), conduit('2,0', '3,0', 'outer')];
  const plainFlow = report({ activeIds: flowIds, conduits: flowConduits });
  const unlit = detectPatterns({
    nodes: lattice(3, flowIds),
    conduits: flowConduits,
    depth: 3,
    waystones: [{ q: 2, r: 0, id: '2,0', effect: 'flow-length', value: 1 }]
  });
  assert.equal(unlit.flows[0].effectiveLength, 4, 'A flow through the Unlit Milestone counts +1 length.');
  assert.ok(
    unlit.conduitBoosts[edgeKey('0,0', '1,0')].percent > plainFlow.conduitBoosts[edgeKey('0,0', '1,0')].percent,
    'The longer effective flow should pay its conduits more.'
  );

  // Swift Milestone: rods ending on it empower both endpoints twice.
  const rodIds = ['-1,0', '0,0', '1,0', '2,0'];
  const rodConduits = [conduit('-1,0', '0,0', 'inner'), conduit('0,0', '1,0', 'outer'), conduit('1,0', '2,0', 'inner')];
  const plainRod = report({ activeIds: rodIds, conduits: rodConduits });
  const swift = detectPatterns({
    nodes: lattice(3, rodIds),
    conduits: rodConduits,
    depth: 3,
    waystones: [{ q: 2, r: 0, id: '2,0', effect: 'rod-double' }]
  });
  const rodShare = boosts => boosts['-1,0'].reasons.filter(reason => reason.includes('rod')).length;
  assert.ok(rodShare(swift.nodeBoosts) === rodShare(plainRod.nodeBoosts), 'Same rod count either way.');
  assert.ok(
    swift.nodeBoosts['-1,0'].percent > plainRod.nodeBoosts['-1,0'].percent,
    'A rod ending on the Swift Milestone should pay both endpoints double.'
  );

  // Thrown Milestone: a wave and a flow may both claim conduits touching it.
  const sharedIds = ['0,0', '1,0', '2,0', '3,0', '1,-1'];
  const sharedConduits = [
    conduit('0,0', '1,0', 'outer'),
    conduit('1,0', '2,0', 'outer'),
    conduit('2,0', '3,0', 'outer'),
    conduit('1,0', '1,-1', 'inner')
  ];
  const noShare = report({ activeIds: sharedIds, conduits: sharedConduits });
  const shared = detectPatterns({
    nodes: lattice(3, sharedIds),
    conduits: sharedConduits,
    depth: 3,
    waystones: [{ q: 1, r: 0, id: '1,0', effect: 'shared-claim' }]
  });
  assert.ok(
    shared.waves.length + shared.flows.length > noShare.waves.length + noShare.flows.length,
    'Sharing conduits at the Thrown Milestone should let a wave and a flow coexist.'
  );

  // Votive Milestone: enclosures carrying it guard more.
  const r1 = ringIds('0,0', 1);
  const votiveId = r1[0];
  const [vq, vr] = votiveId.split(',').map(Number);
  const plainEnclosure = report({ depth: 2, activeIds: r1, conduits: perimeterConduits(r1) });
  const votive = detectPatterns({
    nodes: lattice(2, r1),
    conduits: perimeterConduits(r1),
    depth: 2,
    waystones: [{ q: vq, r: vr, id: votiveId, effect: 'enclosure-boost', value: 0.5 }]
  });
  const guardOf = result => result.bonuses.find(bonus => bonus.id === 'enclosure').derived.guard;
  assert.equal(guardOf(votive), Math.round(guardOf(plainEnclosure) * 1.5),
    'An enclosure carrying the Votive Milestone should guard 50% more.');
}

const tests = [
  ['waves and additive node boost stacking', testWavesAndAdditiveNodeBoosts],
  ['pattern-stones bend wave length and loop gaps', testPatternStones],
  ['waystone hooks keep their authored promises', testWaystoneHooks],
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
