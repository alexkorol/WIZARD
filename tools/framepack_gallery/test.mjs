import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateFramepack } from './validator.mjs';
import { checkFixtures } from './generate-fixtures.mjs';

async function loadFixture(name) {
  const manifestUrl = new URL(`./fixtures/${name}/framepack.json`, import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const report = await validateFramepack(manifest, {
    manifestUrl,
    async loadAsset(assetUrl) {
      return new Uint8Array(await readFile(assetUrl));
    }
  });
  return { manifest, report };
}

const fixtureProblems = await checkFixtures();
assert.deepEqual(fixtureProblems, [], `generated fixtures are stale:\n${fixtureProblems.join('\n')}`);
console.log('ok deterministic fixture bytes');

const valid = await loadFixture('valid');
assert.equal(valid.report.ok, true, valid.report.errors.map((error) => error.reason).join('\n'));
assert.equal(valid.report.assets.length, 5);
assert.deepEqual(Object.keys(valid.manifest.components[0].states), ['default', 'hover', 'focus', 'active', 'disabled']);
console.log('ok valid placeholder: 5 states x 3 target sizes');

const sliceOverflow = await loadFixture('slice-overflow');
assert.equal(sliceOverflow.report.ok, false);
assert.deepEqual(sliceOverflow.report.errors.map((error) => error.code), ['slice-overflow']);
assert.equal(
  sliceOverflow.report.errors[0].reason,
  '[slice-overflow] component "panel" state "default": horizontal slice overflow: left 70 + right 70 must be less than width 128'
);
console.log(`ok negative slice overflow: ${sliceOverflow.report.errors[0].reason}`);

const badChecksum = await loadFixture('bad-checksum');
assert.equal(badChecksum.report.ok, false);
assert.deepEqual(badChecksum.report.errors.map((error) => error.code), ['checksum']);
assert.match(badChecksum.report.errors[0].reason, /^\[checksum\].*expected 0{64}, received [a-f0-9]{64}$/);
console.log(`ok negative checksum: ${badChecksum.report.errors[0].reason}`);

const missingAlpha = await loadFixture('missing-alpha');
assert.equal(missingAlpha.report.ok, false);
assert.deepEqual(missingAlpha.report.errors.map((error) => error.code), ['alpha-declaration']);
assert.equal(
  missingAlpha.report.errors[0].reason,
  '[alpha-declaration] component "panel" state "default": missing alpha declaration "hasAlpha"'
);
console.log(`ok negative alpha declaration: ${missingAlpha.report.errors[0].reason}`);

const gallerySource = await readFile(new URL('./gallery.js', import.meta.url), 'utf8');
const validatorSource = await readFile(new URL('./validator.mjs', import.meta.url), 'utf8');
assert.match(validatorSource, /manifest\.assetRoot/);
assert.match(gallerySource, /assetRecord\.asset\.file/);
assert.doesNotMatch(gallerySource, /panel-default\.png/);
assert.match(gallerySource, /240, height: 120/);
assert.match(gallerySource, /360, height: 180/);
assert.match(gallerySource, /640, height: 240/);
console.log('ok gallery consumes manifest assetRoot/state files at 3 target sizes');

console.log('PASS framepack gallery: 1 valid + 3 deterministic negative fixtures');
