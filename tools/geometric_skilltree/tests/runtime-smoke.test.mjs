import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runStandaloneApp } from './harness.mjs';

const INDEX_PATH = new URL('../index.html', import.meta.url);

function testRuntimeInitializes() {
  const window = runStandaloneApp();
  assert.ok(window.skillTree, 'GeometricSkillTree should initialize.');
  assert.ok(window.renderer, 'SVGRenderer should initialize.');
  assert.ok(window.ui, 'UIController should initialize.');
  assert.ok(window.viewController, 'ViewController should initialize.');

  const mainNodes = Array.from(window.skillTree.nodes.values()).filter(node => node.source === 'main');
  const gateways = mainNodes.filter(node => node.type === 'gateway').map(node => node.id).sort();
  assert.equal(mainNodes.length, 331, 'Runtime should build 331 main lattice nodes.');
  assert.equal(window.skillTree.points.skill, 140, 'Runtime should start with 140 skill points.');
  assert.deepEqual(gateways, ['-10,0', '-10,10', '0,-10', '0,10', '10,-10', '10,0']);
}

function testSubtreesAttachToRingTenGateways() {
  const window = runStandaloneApp();
  const expectedLinks = [
    ['10,0', 'genius-core'],
    ['0,-10', 'ranger-core'],
    ['-10,10', 'vanguard-core'],
    ['10,-10', 'spellblade-core'],
    ['-10,0', 'skirmish-core'],
    ['0,10', 'seer-core']
  ];

  expectedLinks.forEach(([gatewayId, subtreeRootId]) => {
    const gateway = window.skillTree.nodes.get(gatewayId);
    const subtreeRoot = window.skillTree.nodes.get(subtreeRootId);
    assert.ok(gateway, `${gatewayId} gateway should exist.`);
    assert.ok(subtreeRoot, `${subtreeRootId} subtree root should exist.`);
    assert.ok(gateway.connections.includes(subtreeRootId), `${gatewayId} should connect to ${subtreeRootId}.`);
    assert.ok(subtreeRoot.connections.includes(gatewayId), `${subtreeRootId} should connect back to ${gatewayId}.`);
  });
}

function testAllocationUpdatesHeadlineDeltas() {
  const window = runStandaloneApp();
  const beforePoints = window.skillTree.points.skill;
  window.skillTree.tryAllocateNode('1,0');
  const allocated = window.skillTree.nodes.get('1,0');
  const deltaList = window.document.getElementById('delta-list');
  assert.equal(allocated.active, true, 'Adjacent node should allocate.');
  assert.equal(window.skillTree.points.skill, beforePoints - 2, 'Node plus conduit should cost two points.');
  assert.ok(window.skillTree.lastDeltas.length > 0, 'Allocation should produce per-click deltas.');
  assert.ok(deltaList.children.length > 0, 'UI delta list should render per-click deltas.');
  assert.ok(
    window.skillTree.lastDeltas.some(delta => delta.includes('Effective HP') || delta.includes('DPS')),
    'Headline EHP/DPS delta should be visible after allocation.'
  );
}

function setTinyPath(window, ids, sides) {
  const tree = window.skillTree;
  tree.nodes.forEach(node => {
    node.active = ids.includes(node.id);
  });
  tree.conduits.forEach(conduit => {
    conduit.allocatedVariant = null;
  });
  sides.forEach(([a, b, side]) => {
    const conduit = tree.conduits.get([a, b].sort().join(':'));
    assert.ok(conduit, `${a} -> ${b} conduit should exist.`);
    conduit.allocatedVariant = side;
  });
  tree.recalculate();
}

function testPatternsRenderAndBoostStats() {
  const window = runStandaloneApp();
  setTinyPath(window, ['0,0', '1,0', '2,0', '3,0'], [
    ['0,0', '1,0', 'inner'],
    ['1,0', '2,0', 'outer'],
    ['2,0', '3,0', 'inner']
  ]);

  assert.equal(window.skillTree.patternReport.waves.length, 1, 'Runtime should detect a wave after recalculation.');
  assert.equal(window.skillTree.patternReport.rods.length, 1, 'Runtime should detect a straight rod after recalculation.');
  assert.ok(window.skillTree.formatNodeBoostLines(window.skillTree.nodes.get('1,0')).some(line => line.includes('wave')), 'Wave boost text should be visible on path nodes.');
  assert.ok(
    window.document.getElementById('effects-layer').children.some(child => child.className.includes('pattern-wave')),
    'SVG effects layer should render wave paths.'
  );
  assert.ok(
    window.document.getElementById('bonus-list').children.length >= 10,
    'Pattern panel should render the detector bonus rows.'
  );

  setTinyPath(window, ['0,0', '1,0', '2,0', '3,0'], [
    ['0,0', '1,0', 'outer'],
    ['1,0', '2,0', 'outer'],
    ['2,0', '3,0', 'outer']
  ]);
  assert.equal(window.skillTree.patternReport.flows.length, 1, 'Runtime should detect a same-chirality flow.');
  assert.equal(window.skillTree.patternConduitBoosts.size, 3, 'Each conduit in the flow should receive a flow boost.');
  assert.ok(
    window.document.getElementById('effects-layer').children.some(child => child.className.includes('pattern-flow')),
    'SVG effects layer should render flow paths.'
  );
}

function testDesignerMode() {
  const window = runStandaloneApp();
  const designer = window.designer;
  assert.ok(designer, 'DesignerController should initialize.');
  assert.equal(designer.enabled, false, 'Designer starts disabled — player mode carries no designer chrome.');

  designer.setEnabled(true);
  assert.ok(window.document.body.classList.contains('designer-on'), 'Enabling designer mode should mark the body.');

  const beforePoints = window.skillTree.points.skill;
  window.skillTree.handleNodeClick('1,0');
  assert.equal(window.skillTree.points.skill, beforePoints, 'Design-mode clicks should inspect, not allocate.');
  assert.equal(window.skillTree.selectedNodeId, '1,0', 'Design-mode clicks should select the seat.');

  window.document.getElementById('designer-name').value = 'Oath of the Front Line';
  window.document.getElementById('designer-status').value = 'review';
  window.document.getElementById('designer-notes').value = 'first authored seat';
  designer.applyForm();
  const edited = window.skillTree.nodes.get('1,0');
  assert.equal(edited.name, 'Oath of the Front Line', 'Applying the form should rename the live node.');
  assert.equal(edited.status, 'review', 'Applying the form should update seat status.');
  assert.equal(edited.notes, 'first authored seat', 'Applying the form should store the note.');
  assert.ok(designer.seatOverrides['1,0'], 'Edits should be tracked as local overrides.');

  const body = designer.buildTreeDataFileBody();
  assert.ok(body.startsWith('(function(global)'), 'Export should emit a classic-script file body.');
  assert.ok(body.includes('"Oath of the Front Line"'), 'Export should carry the edited seat data.');

  window.document.getElementById('designer-stat').value = 'bogusStat';
  designer.applyForm();
  assert.notEqual(window.skillTree.nodes.get('1,0').stat, 'bogusStat', 'Unknown stat ids should be rejected by registry validation.');

  const issues = designer.runLint();
  assert.ok(Array.isArray(issues), 'Lint should return an issue list.');

  window.skillTree.handleNodeClick('1,0', { shiftKey: true });
  assert.ok(window.skillTree.nodes.get('1,0').active, 'Shift+click should keep normal allocation in design mode.');

  designer.setEnabled(false);
  assert.equal(window.document.body.classList.contains('designer-on'), false, 'Disabling designer mode should clean the body class.');
}

function testSignExclusivity() {
  const window = runStandaloneApp();
  const tree = window.skillTree;
  const signs = Array.from(tree.nodes.values()).filter(node => node.type === 'sign');
  assert.equal(signs.length, 6, 'The authored tree should place six Signs.');
  signs[0].active = true;
  tree.tryAllocateNode(signs[1].id);
  assert.equal(tree.nodes.get(signs[1].id).active, false, 'A second Sign allocation must be refused.');
}

function testJewelSockets() {
  const window = runStandaloneApp();
  const tree = window.skillTree;
  const sockets = Array.from(tree.nodes.values()).filter(node => node.type === 'socket');
  assert.equal(sockets.length, 12, 'Twelve socket seats should exist.');

  const socket = sockets[0];
  socket.active = true;
  tree.recalculate();
  const beforeAttack = tree.stats.derived.attackDamage;

  tree.socketJewel(socket.id, 'whorl-red');
  assert.equal(tree.jewelAt(socket.id)?.id, 'whorl-red', 'Whorl-stone should socket.');
  assert.ok(tree.stats.derived.attackDamage > beforeAttack, 'A whorl-stone should move the sheet.');

  // Saga limit: a second saga-stone is refused.
  const second = sockets[1];
  second.active = true;
  tree.socketJewel(socket.id, 'saga-salt-608');
  tree.socketJewel(second.id, 'saga-drowned-773');
  const sagas = Array.from(tree.socketedJewels.values()).filter(jewel => jewel.family === 'saga');
  assert.equal(sagas.length, 1, 'Only one saga-stone may be socketed.');

  // Saga transform is live and conquered nodes are firewalled from eye-stones.
  const neighborId = Array.from(tree.nodes.values())
    .find(node => node.source === 'main' && node.type === 'small' && node.id !== socket.id
      && window.VerdigrisJewels.hexDistance(node.q, node.r, socket.q, socket.r) <= 2)?.id;
  assert.ok(neighborId, 'A small seat should sit within saga radius.');
  tree.nodes.get(neighborId).active = true;
  tree.recalculate();
  assert.ok(tree.sagaState.has(neighborId), 'The saga should conquer nodes in radius.');

  tree.unsocketJewel(socket.id);
  assert.equal(tree.jewelAt(socket.id), null, 'Stones remove cleanly.');
  assert.equal(tree.sagaState.size, 0, 'Removing the saga-stone lifts the transform.');

  // Pattern-stones flow into the detector.
  tree.socketJewel(socket.id, 'pattern-crest');
  tree.recalculate();
  assert.ok(Array.isArray(tree.patternStones()) && tree.patternStones().length === 1,
    'Pattern-stones should be handed to the detector.');
}

function testClassCallingAndBridge() {
  const window = runStandaloneApp();
  const tree = window.skillTree;
  const classes = Array.from(tree.nodes.values()).filter(node => node.type === 'class');
  assert.equal(classes.length, 6, 'Six class milestones should exist.');

  const champion = classes.find(node => node.name === 'Champion');
  const acrobat = classes.find(node => node.name === 'Acrobat');
  assert.ok(champion && acrobat, 'Champion and Acrobat milestones should exist.');

  champion.active = true;
  tree.classOrder.push(champion.id);
  tree.recalculate();
  assert.equal(tree.stats.characterClass, 'Champion', 'The first class allocated marks the calling.');
  assert.ok(tree.stats.unlocks.includes('war_horn_curio'), 'Champion unlocks the war-horn curio slot.');
  assert.equal(window.VerdigrisBridge.class, 'Champion', 'The bridge payload publishes the calling.');
  assert.ok(window.VerdigrisBridge.unlocks.includes('tower_shield'), 'The bridge payload carries unlock flags.');

  acrobat.active = true;
  tree.classOrder.push(acrobat.id);
  tree.recalculate();
  assert.equal(tree.stats.characterClass, 'Champion', 'A second class node gives stats only; the calling stays first.');
  assert.equal(tree.stats.unlocks.includes('second_weapon_set'), false, 'Only the first calling grants unlocks.');

  champion.active = false;
  tree.classOrder = tree.classOrder.filter(id => id !== champion.id);
  tree.recalculate();
  assert.equal(tree.stats.characterClass, 'Acrobat', 'Refunding the calling promotes the next allocated class.');
}

function testIronMilestoneLoopBoost() {
  const window = runStandaloneApp();
  const tree = window.skillTree;
  const iron = Array.from(tree.nodes.values()).find(node => node.name === 'The Iron Milestone');
  assert.ok(iron?.seat?.patternHook, 'The Iron Milestone should carry its pattern hook.');

  // Close a radius-1 loop around a center adjacent to the milestone so the
  // milestone sits on the loop's perimeter.
  const HEX = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const center = tree.nodes.get(`${iron.q + 1},${iron.r - 1}`);
  assert.ok(center, 'A center adjacent to the milestone should exist.');
  const ring = HEX.map(([dq, dr]) => `${center.q + dq},${center.r + dr}`);
  tree.nodes.forEach(node => { node.active = node.id === '0,0'; });
  [center.id, ...ring].forEach(id => { tree.nodes.get(id).active = true; });
  tree.conduits.forEach(conduit => { conduit.allocatedVariant = null; });
  ring.forEach((id, index) => {
    const conduit = tree.conduits.get([id, ring[(index + 1) % ring.length]].sort().join(':'));
    if (conduit) conduit.allocatedVariant = 'inner';
  });
  tree.recalculate();
  assert.ok(ring.includes(iron.id), 'The milestone should sit on the loop perimeter.');
  const boosted = tree.getNodeBoost(center).multiplier;

  delete iron.seat.patternHook;
  tree.recalculate();
  const plain = tree.getNodeBoost(center).multiplier;
  assert.ok(boosted > plain, `The Iron Milestone should empower the crowned center further (${boosted} vs ${plain}).`);
}

function testWaveFirstAutoPathing() {
  const window = runStandaloneApp();
  const tree = window.skillTree;
  ['1,0', '2,0', '3,0', '4,0'].forEach(id => tree.tryAllocateNode(id));
  const variants = ['0,0:1,0', '1,0:2,0', '2,0:3,0', '3,0:4,0']
    .map(id => tree.conduits.get(id).allocatedVariant);
  assert.ok(variants.every(Boolean), 'Every step should allocate a conduit.');
  for (let i = 1; i < variants.length; i += 1) {
    assert.notEqual(variants[i], variants[i - 1],
      `Auto-pathing should alternate chirality by default (step ${i}: ${variants[i - 1]} then ${variants[i]}).`);
  }
  assert.ok(tree.patternReport.waves.some(wave => wave.length >= 3),
    'Default pathing should read as a wave.');
}

function testPanelCollapse() {
  const window = runStandaloneApp();
  const ui = window.ui;
  const body = window.document.body;
  assert.equal(body.classList.contains('left-collapsed'), false, 'Panels start open.');

  ui.setPanelCollapsed('left', true);
  assert.equal(body.classList.contains('left-collapsed'), true, 'The stats panel collapses.');
  assert.equal(body.classList.contains('right-collapsed'), false, 'Sides collapse independently.');

  ui.toggleFocusMode();
  assert.equal(body.classList.contains('left-collapsed'), true, 'Focus mode collapses both panels.');
  assert.equal(body.classList.contains('right-collapsed'), true, 'Focus mode collapses both panels.');

  ui.toggleFocusMode();
  assert.equal(body.classList.contains('left-collapsed'), false, 'Focus mode toggles back to both open.');
  assert.equal(body.classList.contains('right-collapsed'), false, 'Focus mode toggles back to both open.');
}

function testEdgeVesicaAndGhostArc() {
  const window = runStandaloneApp();
  const tree = window.skillTree;
  const HEX = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const ringIds = (cq, cr) => {
    const out = [];
    let q = cq + HEX[4][0];
    let r = cr + HEX[4][1];
    for (let side = 0; side < 6; side += 1) {
      out.push(`${q},${r}`);
      q += HEX[side][0];
      r += HEX[side][1];
    }
    return out;
  };
  const centers = [[2, -1], [4, -2]];
  const ids = new Set(centers.map(([q, r]) => `${q},${r}`));
  const edges = new Set();
  centers.forEach(([cq, cr]) => {
    const ring = ringIds(cq, cr);
    ring.forEach(id => ids.add(id));
    ring.forEach((id, i) => edges.add([id, ring[(i + 1) % ring.length]].sort().join(':')));
  });
  tree.nodes.forEach(node => { node.active = node.id === '0,0' || ids.has(node.id); });
  tree.conduits.forEach(conduit => { conduit.allocatedVariant = null; });
  edges.forEach(id => { const conduit = tree.conduits.get(id); if (conduit) conduit.allocatedVariant = 'inner'; });
  tree.recalculate();

  // One allocated arc serves both perimeters: 11 conduits, two crowns, a lens.
  assert.equal(edges.size, 11, 'The edge vesica costs 6+6-1 perimeter conduits.');
  const vesica = tree.patternReport.vesicas.find(entry => entry.form === 'edge');
  assert.ok(vesica, 'The edge-form vesica is obtainable with single-variant conduits.');
  assert.equal(tree.patternReport.loops.length, 2, 'Both centers crown off the shared edge.');

  // The shared conduit's alternate arc ghosts in so both circles read whole.
  const conduit = tree.conduits.get(vesica.sharedEdge);
  const alternate = conduit.options.find(option => option.id !== conduit.allocatedVariant);
  const variantEl = window.renderer.conduitEls.get(conduit.id).variants.get(alternate.id);
  assert.ok(variantEl.line.classList.contains('ghost-loop'), 'The alternate arc of the shared edge should render as a ghost.');
}

function testBuildCodeRoundTrip() {
  const window = runStandaloneApp();
  const tree = window.skillTree;
  ['1,0', '2,0', '3,0'].forEach(id => tree.tryAllocateNode(id));
  const socket = Array.from(tree.nodes.values()).find(node => node.type === 'socket');
  socket.active = true;
  tree.recalculate();
  tree.socketJewel(socket.id, 'whorl-red');

  const activeBefore = Array.from(tree.nodes.values()).filter(n => n.active).map(n => n.id).sort();
  const variantsBefore = Array.from(tree.conduits.values()).filter(c => c.allocated).map(c => [c.id, c.allocatedVariant]).sort();
  const code = tree.exportBuildCode();
  assert.ok(typeof code === 'string' && code.length > 0, 'Export should produce a code.');

  tree.reset();
  assert.equal(Array.from(tree.nodes.values()).filter(n => n.active).length, 1, 'Reset should clear the build.');

  assert.equal(tree.importBuildCode(code), true, 'A valid code should import.');
  const activeAfter = Array.from(tree.nodes.values()).filter(n => n.active).map(n => n.id).sort();
  const variantsAfter = Array.from(tree.conduits.values()).filter(c => c.allocated).map(c => [c.id, c.allocatedVariant]).sort();
  assert.deepEqual(activeAfter, activeBefore, 'Import should restore the allocated nodes.');
  assert.deepEqual(variantsAfter, variantsBefore, 'Import should restore conduit variants.');
  assert.equal(tree.jewelAt(socket.id)?.id, 'whorl-red', 'Import should restore socketed stones.');

  assert.equal(tree.importBuildCode('not a build code'), false, 'Garbage codes should be rejected.');
}

const tests = [
  ['Standalone classic scripts initialize the tree runtime', testRuntimeInitializes],
  ['Class calling publishes unlock flags over the bridge', testClassCallingAndBridge],
  ['The Iron Milestone empowers loops that carry it', testIronMilestoneLoopBoost],
  ['Build codes round-trip a whole allocation', testBuildCodeRoundTrip],
  ['Auto-pathing extends waves by default', testWaveFirstAutoPathing],
  ['Side panels collapse into focus mode', testPanelCollapse],
  ['Edge vesicas build with one arc and ghost the other', testEdgeVesicaAndGhostArc],
  ['Subtrees attach to the ring-10 gateways at runtime', testSubtreesAttachToRingTenGateways],
  ['Allocation updates headline deltas', testAllocationUpdatesHeadlineDeltas],
  ['Patterns render and boost runtime stats', testPatternsRenderAndBoostStats],
  ['Designer mode edits seats live and exports tree data', testDesignerMode],
  ['Only one Sign may be allocated', testSignExclusivity],
  ['Carved stones socket, transform, and firewall', testJewelSockets]
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
  console.error(`\n${failed} runtime smoke test(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${passed} runtime smoke test(s) passed.`);
