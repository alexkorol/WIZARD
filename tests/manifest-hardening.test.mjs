import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildRegistry,
  registryPayload,
  validateManifestText
} from '../scripts/wizard-lab.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(HERE, 'fixtures', 'manifests');
const FIXTURE_ROOT = path.join(FIXTURES, 'root');
const SCHEMA = JSON.parse(readFileSync(new URL('../schema/wizard.module.v1.schema.json', import.meta.url), 'utf8'));

const negativeCases = [
  {
    file: 'nested-capability-type.json',
    source: 'tools/example/wizard.module.json',
    expected: 'tools/example/wizard.module.json: capabilities.adapter has wrong type (expected boolean)'
  },
  {
    file: 'duplicate-capability-key.json',
    source: 'tools/example/wizard.module.json',
    expected: 'tools/example/wizard.module.json: duplicate JSON key "capabilities.adapter"'
  },
  {
    file: 'unsafe-launch.json',
    source: 'tools/example/wizard.module.json',
    expected: 'tools/example/wizard.module.json: unsafe launch path "../outside.html"'
  },
  {
    file: 'stale-preview.json',
    source: 'tools/example/wizard.module.json',
    expected: 'tools/example/wizard.module.json: preview entry missing at tools/example/missing-preview.png'
  },
  {
    file: 'archive-reentry.json',
    source: 'tools/sokoban/wizard.module.json',
    expected: 'tools/sokoban/wizard.module.json: archive candidate cannot be dashboard-visible'
  }
];

for (const fixture of negativeCases) {
  const text = readFileSync(path.join(FIXTURES, fixture.file), 'utf8');
  const result = validateManifestText(text, {
    root: FIXTURE_ROOT,
    source: fixture.source,
    schema: SCHEMA
  });
  assert.deepEqual(
    result.failures,
    [fixture.expected],
    `${fixture.file} must fail for exactly its intended property`
  );
  console.log(`negative ${fixture.file}: ${result.failures[0]}`);
}

assert.equal(SCHEMA.properties.stateVersion.minimum, 1, 'stateVersion keeps its nested minimum');
assert.equal(SCHEMA.properties.unsupportedMethods.uniqueItems, true, 'unsupportedMethods rejects duplicates');
assert.equal(SCHEMA.properties.tags.uniqueItems, true, 'tags reject duplicates');

const modules = [
  { id: 'wizard.zeta', title: 'Same title', visibility: 'dashboard' },
  { id: 'wizard.archive', title: 'Archived', visibility: 'archive' },
  { id: 'wizard.middle', title: 'Alpha title', visibility: 'dashboard' },
  { id: 'wizard.alpha', title: 'Same title', visibility: 'dashboard' }
];
const originalOrder = modules.map(module => module.id);
const registry = buildRegistry(modules);

assert.deepEqual(
  registry.modules.map(module => module.id),
  ['wizard.alpha', 'wizard.archive', 'wizard.middle', 'wizard.zeta'],
  'full registry ordering is stable by module id'
);
assert.deepEqual(
  registry.dashboard.map(module => module.id),
  ['wizard.middle', 'wizard.alpha', 'wizard.zeta'],
  'dashboard ordering is title then stable id tie-breaker'
);
assert.deepEqual(modules.map(module => module.id), originalOrder, 'registry generation does not mutate discovery order');
assert.equal(
  registryPayload(buildRegistry(modules)),
  registryPayload(buildRegistry(modules.slice().reverse())),
  'registry bytes are independent of manifest discovery order'
);

console.log('ok manifest hardening: 5 negative fixtures; deterministic registry ordering');
