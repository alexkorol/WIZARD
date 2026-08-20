import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const WizardLab = require('../shared/wizard-lab.js');

const handshake = WizardLab.register({
  id: 'wizard.orbs',
  getState() { return { hp: 1 }; },
  setState(state) { this._state = state; return state; },
  exportCalibration() {
    return { schemaVersion: 1, moduleId: 'wizard.orbs', exportedAt: 't', scenarioId: 'full', state: { hp: 1 } };
  },
  importCalibration(data) { return data.state; }
});

assert.equal(handshake.id, 'wizard.orbs');
assert.equal(typeof handshake.getState, 'function');
assert.equal(typeof handshake.exportCalibration, 'function');
assert.equal(WizardLab.get('wizard.orbs'), handshake);
assert.equal(WizardLab.get(), handshake);

console.log('ok adapter handshake');
