import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = 'scripts/verify-markdown-evidence.mjs';
const FIXTURES = path.join(REPO_ROOT, 'tests', 'fixtures', 'markdown-evidence');

function runCli(root) {
  const result = spawnSync(process.execPath, [SCRIPT, root], { cwd: REPO_ROOT, encoding: 'utf8' });
  return {
    status: result.status,
    stdout: (result.stdout || '').replaceAll('\r\n', '\n'),
    stderr: (result.stderr || '').replaceAll('\r\n', '\n'),
  };
}

function hashTree(root, subdirs) {
  const hashes = [];
  for (const sub of subdirs) {
    const base = path.join(root, sub);
    if (!fs.existsSync(base)) continue;
    for (const file of fs.readdirSync(base, { recursive: true })) {
      const full = path.join(base, file.toString());
      if (fs.statSync(full).isFile()) {
        hashes.push(`${sub}/${file}=${createHash('sha256').update(fs.readFileSync(full)).digest('hex')}`);
      }
    }
  }
  return hashes.sort().join('\n');
}

{
  const label = 'fixture audit reports exactly the seeded failures, sorted by source then line';
  const result = runCli(FIXTURES);
  assert.equal(result.status, 1, `expected exit 1 on fixtures:\n${result.stdout}\n${result.stderr}`);
  const codes = result.stdout.split('\n').filter(line => /^[A-Z_]+ \S+ :: /.test(line)).map(line => line.split(' ')[0]);
  assert.deepEqual(
    codes,
    [
      'MISSING_TARGET',
      'ANCHOR_OUT_OF_RANGE',
      'ANCHOR_OUT_OF_RANGE',
      'ANCHOR_REVERSED',
      'PATH_ESCAPE',
      'PATH_ESCAPE',
      'ANCHOR_OUT_OF_RANGE',
      'MALFORMED_PERCENT',
      'TARGET_NOT_A_FILE',
    ],
    `unexpected diagnostics:\n${result.stdout}`
  );
  assert.match(result.stdout, /ANCHOR_OUT_OF_RANGE docs\/broken\.md:2 :: #L99 beyond 4 lines/);
  assert.match(result.stdout, /PATH_ESCAPE docs\/broken\.md:6 :: \.\.\/\.\.\/outside\.md/);
  assert.ok(!result.stdout.includes('docs/ok.md:') && !result.stdout.includes('evidence/note.md:'), 'valid files must produce zero diagnostics');
  console.log(`PASS ${label}`);
}

{
  const label = 'valid categories all classified explicitly in fixture stats';
  const result = runCli(FIXTURES);
  assert.match(result.stdout, /links=21 validated=13 skipped-external=2 skipped-fragment=1 skipped-empty=0 queries-stripped=1 percent-decoded=2 images=1/);
  console.log(`PASS ${label}`);
}

{
  const label = 'output is deterministic across runs (sorted multi-file diagnostics)';
  const first = runCli(FIXTURES);
  const second = runCli(FIXTURES);
  assert.equal(first.stdout, second.stdout);
  assert.equal(first.status, second.status);
  const evidenceFirst = first.stdout.indexOf('evidence/');
  const docsBroken = first.stdout.indexOf('docs/broken.md');
  assert.ok(docsBroken !== -1 && evidenceFirst === -1 || docsBroken < evidenceFirst, 'diagnostics must be sorted by source path');
  console.log(`PASS ${label}`);
}

{
  const label = 'repository default scan passes with stable counts';
  const result = spawnSync(process.execPath, [SCRIPT], { cwd: REPO_ROOT, encoding: 'utf8' });
  const stdout = (result.stdout || '').replaceAll('\r\n', '\n');
  assert.equal(result.status, 0, `expected clean repo scan:\n${stdout}\n${result.stderr}`);
  assert.match(stdout, /AUDIT root=\./);
  assert.match(stdout, /links=(\d+)/);
  assert.match(stdout, /PASS markdown-evidence \(\d+ md files scanned\)/);
  const countsMatch = stdout.match(/links=(\d+) validated=(\d+) skipped-external=(\d+) skipped-fragment=(\d+)/);
  assert.ok(countsMatch, 'counts line must state stable source/link numbers');
  console.log(`PASS ${label} (${stdout.match(/links=\d+/)[0]}, files ${stdout.match(/files scanned/)?.input.match(/\((\d+) md files/)?.[1] ?? '?'})`);
}

{
  const label = 'auditor performs no writes to audited sources';
  const before = hashTree(REPO_ROOT, ['docs', 'evidence']);
  spawnSync(process.execPath, [SCRIPT], { cwd: REPO_ROOT, encoding: 'utf8' });
  const after = hashTree(REPO_ROOT, ['docs', 'evidence']);
  assert.equal(before, after, 'audited trees must be byte-identical after a scan');
  const source = fs.readFileSync(path.join(REPO_ROOT, SCRIPT), 'utf8');
  for (const writeApi of ['writeFile', 'appendFile', 'mkdir', 'unlink', 'rmSync', 'rmdir', 'rename', 'chmod']) {
    assert.ok(!source.includes(writeApi), `auditor source must not use ${writeApi}`);
  }
  console.log(`PASS ${label}`);
}

console.log('PASS verify-markdown-evidence.test.mjs');
process.exit(0);
