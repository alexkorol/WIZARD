// Checks owner-rules/rename-map.json and the lint passes it feeds; registered in scripts/wizard-lab.mjs verify.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { flagLabel, flagRetired, isLabel } from './lint.mjs';
import { applyFile } from './apply-rename-map.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const map = JSON.parse(readFileSync(new URL('./rename-map.json', import.meta.url), 'utf8'));
assert.equal(map.schema, 'owner-rules.rename-map.v1');
const seen = new Set();
for (const e of map.entries) {
  assert.ok(e.before && typeof e.before === 'string', 'every entry has a before');
  assert.ok(e.after === null || typeof e.after === 'string', `${e.before}: after is a string or null (dropped)`);
  const key = `${e.match || 'phrase'}|${e.scope || ''}|${e.before}`;
  assert.ok(!seen.has(key), `duplicate entry ${key}`);
  seen.add(key);
  if (e.after) assert.deepEqual(flagRetired(e.after), [], `${e.before} -> ${e.after}: the new name is itself retired`);
  if (e.after && isLabel(e.after)) assert.deepEqual(flagLabel(e.after), [], `${e.after}: new label outside the plain vocabulary`);
}
// The renamed sources are already clean: applying the map again changes nothing.
for (const [file, scopes] of [['tools/geometric_skilltree/assets/tree-data.js', ['game']], ['tools/geometric_skilltree/index.html', ['game']],
  ['tools/rpg_inventory/index.html', ['game']], ['tools/rpg_inventory/core/verdigris-pack.js', ['game']]]) {
  const { changed } = applyFile(root + file, scopes);
  assert.equal(changed, false, `${file} still contains names the rename map retires`);
}
// Keys survive: bare lowercase literals are ids, never renamed.
assert.ok(readFileSync(root + 'tools/rpg_inventory/index.html', 'utf8').includes("id: 'reliquary'"), 'pack id reliquary kept');
console.log(`rename-map: ${map.entries.length} entries valid; renamed sources clean`);
