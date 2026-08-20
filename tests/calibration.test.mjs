import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const WizardLab = require('../shared/wizard-lab.js');
const WizardAnnotations = require('../shared/wizard-annotations.js');

assert.equal(WizardLab.isDevMode(), false);
globalThis.WIZARD_DEV = true;
assert.equal(WizardLab.isDevMode(), true);

const adapter = WizardLab.register({
  id: 'wizard.orbs',
  unsupportedMethods: ['pause'],
  _state: { hp: 1, mp: 1 },
  reset() { this._state = { hp: 1, mp: 1 }; return this._state; },
  getState() { return { ...this._state }; },
  setState(state) { this._state = { ...this._state, ...state }; return this._state; },
  listScenarios() { return ['full']; },
  loadScenario() { return this.reset(); },
  getMetrics() { return { life: Math.round(this._state.hp * 1000) }; }
});

adapter.reset();
adapter.setState({ hp: 0.38, mp: 0.4 });
const exported = adapter.exportCalibration();
assert.equal(exported.schemaVersion, 1);
assert.equal(exported.state.hp, 0.38);
adapter.reset();
adapter.importCalibration(exported);
assert.equal(adapter.getState().hp, 0.38);

WizardLab.captureSnapshot('A');
adapter.setState({ hp: 0.9 });
WizardLab.captureSnapshot('B');
const compared = WizardLab.compareSnapshots();
assert.equal(compared.A.state.hp, 0.38);
assert.equal(compared.B.state.hp, 0.9);
WizardLab.loadSnapshot('A');
assert.equal(adapter.getState().hp, 0.38);

assert.throws(() => adapter.pause(), /does not support pause/);

const notes = WizardAnnotations.saveAll('wizard.orbs', [
  WizardAnnotations.create({
    type: 'balance',
    title: 'Life reads low',
    body: '38/110 feels too red.',
    anchor: { kind: 'semantic', semantic: { targetType: 'resource', targetId: 'life' } }
  })
]);
exported.annotations = notes;
const md = WizardLab.toAgentMarkdown(exported);
assert.match(md, /Life reads low/);
assert.match(md, /semantic/);

const orbAdapter = require('../tools/wizard_orbs/wizard-adapter.js');
const next = orbAdapter.applyEvent({
  schemaVersion: 1,
  sequence: 2,
  timeMs: 1200,
  type: 'resource.changed',
  source: 'fixture',
  target: 'actor:player',
  data: { resource: 'life', current: 38, maximum: 110 }
}, { hp: 1, mp: 1 });
assert.ok(Math.abs(next.hp - 38 / 110) < 1e-9);

console.log('ok calibration + annotations + orb event mapping');
