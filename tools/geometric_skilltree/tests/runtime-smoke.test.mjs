import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';

const INDEX_PATH = new URL('../index.html', import.meta.url);
const TREE_DATA_PATH = new URL('../assets/tree-data.js', import.meta.url);
const STATS_PATH = new URL('../../rpg_inventory/core/verdigris-stats.js', import.meta.url);
const PATTERNS_PATH = new URL('../assets/patterns.js', import.meta.url);

class FakeClassList {
  constructor(owner) {
    this.owner = owner;
    this.values = new Set();
  }

  add(...names) {
    names.forEach(name => this.values.add(name));
    this.sync();
  }

  remove(...names) {
    names.forEach(name => this.values.delete(name));
    this.sync();
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.values.has(name) : Boolean(force);
    if (shouldAdd) {
      this.values.add(name);
    } else {
      this.values.delete(name);
    }
    this.sync();
    return shouldAdd;
  }

  contains(name) {
    return this.values.has(name);
  }

  sync() {
    this.owner.className = Array.from(this.values).join(' ');
  }
}

class FakeStyle {
  setProperty(name, value) {
    this[name] = value;
  }
}

class FakeElement {
  constructor(tagName = 'div', ownerDocument = null) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.attributes = new Map();
    this.children = [];
    this.dataset = {};
    this.style = new FakeStyle();
    this.className = '';
    this.classList = new FakeClassList(this);
    this.listeners = new Map();
    this.textContent = '';
    this.innerHTML = '';
    this.value = '';
    this.disabled = false;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === 'id' && this.ownerDocument) this.ownerDocument.register(String(value), this);
    if (name === 'class') {
      this.className = String(value);
      this.classList.values = new Set(String(value).split(/\s+/).filter(Boolean));
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  querySelector(selector) {
    return this.ownerDocument.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.ownerDocument.querySelectorAll(selector);
  }

  closest() {
    return null;
  }

  setPointerCapture() {}

  releasePointerCapture() {}

  getBoundingClientRect() {
    return { width: 1280, height: 900, left: 0, top: 0, right: 1280, bottom: 900 };
  }
}

class FakeDocument {
  constructor() {
    this.elements = new Map();
    this.body = new FakeElement('body', this);
    this.listeners = new Map();
  }

  register(id, element) {
    this.elements.set(id, element);
  }

  getElementById(id) {
    if (!this.elements.has(id)) {
      const element = new FakeElement('div', this);
      element.setAttribute('id', id);
    }
    return this.elements.get(id);
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  createElementNS(_namespace, tagName) {
    return new FakeElement(tagName, this);
  }

  querySelector(selector) {
    if (selector.startsWith('#')) return this.getElementById(selector.slice(1));
    if (selector.startsWith('.')) {
      return this.querySelectorAll(selector)[0] || new FakeElement('div', this);
    }
    return new FakeElement('div', this);
  }

  querySelectorAll(selector) {
    if (!selector.startsWith('.')) return [];
    const className = selector.slice(1);
    return Array.from(this.elements.values()).filter(element => element.classList.contains(className));
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }
}

function extractMainScript(html) {
  const marker = '<script src="assets/tree-data.js"></script>';
  const dataScriptIndex = html.indexOf(marker);
  assert.ok(dataScriptIndex > 0, 'tree-data.js script tag should exist.');
  const scriptStart = html.indexOf('<script>', dataScriptIndex + marker.length);
  const bodyStart = html.indexOf('>', scriptStart) + 1;
  const scriptEnd = html.indexOf('</script>', bodyStart);
  assert.ok(scriptStart > dataScriptIndex, 'Main app script should follow tree-data.js.');
  return html.slice(bodyStart, scriptEnd);
}

function createRuntime() {
  const document = new FakeDocument();
  const window = {
    document,
    innerWidth: 1280,
    innerHeight: 900,
    addEventListener() {},
    matchMedia() {
      return {
        matches: false,
        addEventListener() {}
      };
    }
  };
  const context = {
    window,
    self: window,
    document,
    console,
    Math,
    Number,
    Array,
    Object,
    Set,
    Map,
    Boolean,
    String,
    JSON,
    RegExp,
    parseInt,
    setTimeout(callback) {
      callback();
      return 0;
    }
  };
  window.window = window;
  window.console = console;
  window.setTimeout = context.setTimeout;
  return createContext(context);
}

function runStandaloneApp() {
  const runtime = createRuntime();
  const statsSource = readFileSync(STATS_PATH, 'utf8');
  new Script(statsSource, { filename: STATS_PATH.pathname }).runInContext(runtime);

  const treeDataSource = readFileSync(TREE_DATA_PATH, 'utf8');
  new Script(treeDataSource, { filename: TREE_DATA_PATH.pathname }).runInContext(runtime);

  const patternsSource = readFileSync(PATTERNS_PATH, 'utf8');
  new Script(patternsSource, { filename: PATTERNS_PATH.pathname }).runInContext(runtime);

  const html = readFileSync(INDEX_PATH, 'utf8');
  const mainScript = extractMainScript(html);
  new Script(mainScript, { filename: INDEX_PATH.pathname }).runInContext(runtime);
  return runtime.window;
}

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

const tests = [
  ['Standalone classic scripts initialize the tree runtime', testRuntimeInitializes],
  ['Subtrees attach to the ring-10 gateways at runtime', testSubtreesAttachToRingTenGateways],
  ['Allocation updates headline deltas', testAllocationUpdatesHeadlineDeltas],
  ['Patterns render and boost runtime stats', testPatternsRenderAndBoostStats]
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
