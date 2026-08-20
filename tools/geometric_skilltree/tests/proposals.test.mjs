import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runStandaloneApp } from './harness.mjs';

const ROOT = new URL('../../../', import.meta.url);

function loadScript(window, relative) {
  const source = readFileSync(new URL(relative, ROOT), 'utf8');
  const run = new Function('window', 'globalThis', 'self', 'document', 'module', source);
  run(window, window, window, window.document, undefined);
}

function authoredNames(window) {
  return Array.from(window.skillTree.nodes.values()).map(node => `${node.id}:${node.name}:${node.type}`).join('|');
}

function memoryStorage() {
  const data = {};
  return {
    getItem(key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
    setItem(key, value) { data[key] = String(value); },
    removeItem(key) { delete data[key]; }
  };
}

{
  const window = runStandaloneApp();
  window.localStorage = memoryStorage();
  window.location = { search: '?dev=1' };
  loadScript(window, 'shared/wizard-lab.js');
  loadScript(window, 'shared/wizard-annotations.js');
  loadScript(window, 'tools/geometric_skilltree/wizard-proposals.js');
  const proposals = window.WizardProposals;
  assert.ok(proposals, 'proposal controller should load');

  const beforeTree = JSON.stringify(window.TREE_DATA);
  const beforeNames = authoredNames(window);
  const beforeActive = Array.from(window.skillTree.nodes.values()).filter(node => node.active).length;

  const empty = proposals.createEmpty(120, -40, 'notable');
  assert.equal(empty.proposal.kind, 'notable');
  const onNode = proposals.attachNode('1,0');
  assert.equal(onNode.anchor.semantic.targetType, 'node');
  const firstConduit = Array.from(window.skillTree.conduits.keys())[0];
  const onConduit = proposals.attachConduit(firstConduit);
  assert.equal(onConduit.anchor.semantic.targetType, 'conduit');
  const region = proposals.placeRegion(10, 20, 80, 60);
  assert.equal(region.anchor.kind, 'region');
  proposals.update(empty.id, {
    proposal: { kind: 'keystone', name: 'Trial Gate', mechanicalText: '+10% to test values' }
  });
  proposals.move(empty.id, 200, 15);
  proposals.resolve(region.id);
  const exported = proposals.exportBundle();
  assert.ok(exported.annotations.length >= 4);

  const isolated = runStandaloneApp();
  isolated.localStorage = memoryStorage();
  isolated.location = { search: '?dev=1' };
  loadScript(isolated, 'shared/wizard-lab.js');
  loadScript(isolated, 'shared/wizard-annotations.js');
  loadScript(isolated, 'tools/geometric_skilltree/wizard-proposals.js');
  isolated.WizardProposals.importBundle(exported);
  assert.equal(isolated.WizardProposals.list().length, exported.annotations.length);

  assert.equal(JSON.stringify(window.TREE_DATA), beforeTree, 'proposals must not mutate TREE_DATA');
  assert.equal(authoredNames(window), beforeNames, 'proposals must not rename live authored seats');
  assert.equal(
    Array.from(window.skillTree.nodes.values()).filter(node => node.active).length,
    beforeActive,
    'proposals must not allocate nodes'
  );

  const markdown = proposals.toMarkdown();
  assert.match(markdown, /Trial Gate/);
  assert.match(markdown, /Agent feedback/);
}

console.log('ok proposals do not mutate canonical tree data');
