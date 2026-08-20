import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const WizardAnnotations = require('../shared/wizard-annotations.js');
const schema = JSON.parse(readFileSync(new URL('../schema/wizard.annotation.v1.schema.json', import.meta.url)));

assert.equal(schema.properties.type.enum.length, 7);
const note = WizardAnnotations.create({
  type: 'question',
  title: 'Cluster here?',
  anchor: { kind: 'region', region: { x: 1, y: 2, w: 30, h: 40 } },
  proposal: { kind: 'notable', name: 'Ash Veil', mechanicalText: 'small fire taken as chaos' }
});
assert.equal(note.schemaVersion, 1);
WizardAnnotations.saveAll('wizard.geometric-skilltree', [note]);
const bundle = WizardAnnotations.exportBundle('wizard.geometric-skilltree');
assert.equal(bundle.annotations[0].proposal.name, 'Ash Veil');
WizardAnnotations.importBundle('wizard.geometric-skilltree', bundle);
assert.equal(WizardAnnotations.loadAll('wizard.geometric-skilltree')[0].id, note.id);
assert.throws(() => WizardAnnotations.create({ type: 'nope', anchor: { kind: 'world' } }));

console.log('ok annotation fixtures');
