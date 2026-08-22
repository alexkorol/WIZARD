import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = JSON.parse(readFileSync(new URL('../schema/wizard.framepack.v1.schema.json', import.meta.url)));
const contract = readFileSync(new URL('../docs/UI_FRAMEPACK_INTERFACE.md', import.meta.url), 'utf8');

assert.equal(schema.properties.schemaVersion.const, 1);
assert.deepEqual(schema.required, ['schemaVersion', 'id', 'title', 'assetRoot', 'components']);
assert.deepEqual(schema.$defs.component.required, ['id', 'slice', 'contentInsets', 'edgeMode', 'states']);
assert.deepEqual(schema.$defs.component.properties.edgeMode.enum, ['stretch', 'repeat', 'round']);
assert.deepEqual(schema.$defs.derivative.properties.role.enum, [
  'alpha', 'edge', 'material', 'height', 'depth', 'emissive', 'roughness-source', 'normal-source'
]);

for (const token of [
  '.wizard-frame',
  '.wizard-frame__content',
  'data-wizard-frame-pack',
  'data-wizard-frame-component',
  'data-wizard-frame-state',
  '--wizard-frame-image'
]) {
  assert.ok(contract.includes(token), `missing frozen contract token ${token}`);
}

assert.match(contract, /No visible text, glyph labels, module names, or lore copy may be baked/);
assert.match(contract, /Normal maps and nine-slice coordinates\s+must be produced or verified deterministically/);

console.log('ok framepack v1 contract');
