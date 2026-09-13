import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCANNER = 'scripts/verify-loopback-launches.mjs';
const FIXTURES = path.join(REPO_ROOT, 'tests', 'fixtures', 'loopback-launches');

function runScanner(root) {
  const result = spawnSync(process.execPath, [SCANNER, root], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return {
    status: result.status,
    stdout: (result.stdout || '').replaceAll('\r\n', '\n'),
    stderr: (result.stderr || '').replaceAll('\r\n', '\n'),
  };
}

function findingPaths(output) {
  return output
    .split('\n')
    .filter(line => /:\d+: server command/.test(line))
    .map(line => line.slice(0, line.indexOf(':')));
}

{
  const label = 'default repo scan is clean after INC-W008 corrections';
  const result = runScanner(REPO_ROOT);
  assert.equal(result.status, 0, `expected exit 0, got ${result.status}:\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /^PASS loopback-launches \(\d+ files scanned\)$/m, result.stdout);
  assert.ok(!result.stdout.includes('orchestration/'), 'historical narrative must never be reported');
  console.log(`PASS ${label}`);
}

{
  const label = 'fixture violations are each detected with file and line';
  const result = runScanner(FIXTURES);
  assert.equal(result.status, 1, `expected exit 1 on fixtures, got ${result.status}:\n${result.stdout}`);
  const flagged = new Set(findingPaths(result.stdout));
  for (const expected of [
    'unsafe-binds-all-interfaces.sh',
    'unsafe-missing-bind.sh',
    'prose-fenced-command.md',
  ]) {
    assert.ok(flagged.has(expected), `expected ${expected} to be flagged; got:\n${result.stdout}`);
  }
  assert.match(result.stdout, /unsafe-binds-all-interfaces\.sh:2: server command binds 0\.0\.0\.0/);
  assert.match(result.stdout, /unsafe-missing-bind\.sh:2: server command lacks an explicit 127\.0\.0\.1 bind/);
  assert.match(result.stdout, /prose-fenced-command\.md:4: server command lacks an explicit 127\.0\.0\.1 bind/);
  console.log(`PASS ${label} (${flagged.size} findings)`);
}

{
  const label = 'explicit loopback bind and inline prose mention are not flagged';
  const result = runScanner(FIXTURES);
  const flagged = findingPaths(result.stdout);
  assert.ok(!flagged.includes('safe-loopback.sh'), `safe fixture must pass:\n${result.stdout}`);
  assert.ok(!flagged.includes('prose-inline-mention.md'), `inline narrative must not be a launch config:\n${result.stdout}`);
  assert.equal(flagged.length, 3, `exactly the three violating fixtures should be flagged:\n${result.stdout}`);
  console.log(`PASS ${label}`);
}

{
  const label = 'scanner output is deterministic across runs';
  const first = runScanner(FIXTURES);
  const second = runScanner(FIXTURES);
  assert.equal(first.stdout, second.stdout);
  assert.equal(first.status, second.status);
  console.log(`PASS ${label}`);
}

console.log('PASS loopback-launches.test.mjs');
