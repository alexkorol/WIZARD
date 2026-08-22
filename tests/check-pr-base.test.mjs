import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { classifySensitivePath } from '../scripts/check-pr-base.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const checker = join(repoRoot, 'scripts/check-pr-base.mjs');
const fixtureRepo = mkdtempSync(join(tmpdir(), 'wizard-stale-base-'));

function git(...args) {
  return execFileSync('git', args, { cwd: fixtureRepo, encoding: 'utf8' }).trim();
}

function write(path, content) {
  const destination = join(fixtureRepo, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content);
}

function commit(message) {
  git('add', '.');
  git('commit', '-m', message);
  return git('rev-parse', 'HEAD');
}

function runFixture(name, head, current) {
  const result = spawnSync(process.execPath, [checker, '--head', head, '--current-ref', current], {
    cwd: fixtureRepo,
    encoding: 'utf8',
  });
  console.log(`fixture ${name} (exit ${result.status})`);
  console.log(result.stdout.trim());
  if (result.stderr.trim()) console.log(result.stderr.trim());
  return result;
}

try {
  git('init', '--initial-branch=production');
  git('config', 'user.name', 'WIZARD fixture');
  git('config', 'user.email', 'fixture@example.invalid');

  write('modules.json', JSON.stringify({
    modules: [
      { visibility: 'dashboard', launch: 'tools/demo/index.html' },
      { visibility: 'archive', launch: 'tools/archive/index.html' },
    ],
  }, null, 2));
  write('tools/demo/index.html', '<h1>demo v1</h1>\n');
  write('shared/wizard-lab.js', 'export const version = 1;\n');
  write('README.md', '# fixture\n');
  const common = commit('common base');

  git('switch', '-c', 'stale-doc', common);
  write('docs/notes.md', '# documentation only\n');
  const staleDocHead = commit('stale docs');

  git('switch', '-c', 'stale-sensitive', common);
  write('tools/demo/index.html', '<h1>stale launch change</h1>\n');
  const staleSensitiveHead = commit('stale active launch');

  git('switch', '-c', 'current', common);
  write('README.md', '# fixture current production\n');
  const current = commit('advance production');

  git('switch', '-c', 'fresh', current);
  write('schema/new-state.schema.json', '{}\n');
  const freshHead = commit('fresh schema change');

  const activeLaunches = new Set(['tools/demo/index.html']);
  assert.deepEqual(classifySensitivePath('index.html', activeLaunches), ['dashboard']);
  assert.deepEqual(classifySensitivePath('dashboard.js', activeLaunches), ['dashboard']);
  assert.deepEqual(classifySensitivePath('modules.json', activeLaunches), ['registry']);
  assert.deepEqual(classifySensitivePath('tools/demo/wizard.module.json', activeLaunches), ['registry']);
  assert.deepEqual(classifySensitivePath('shared/wizard-lab.js', activeLaunches), ['shared-runtime']);
  assert.deepEqual(classifySensitivePath('schema/state.json', activeLaunches), ['schema']);
  assert.deepEqual(classifySensitivePath('.github/workflows/verify.yml', activeLaunches), ['workflow']);
  assert.deepEqual(classifySensitivePath('tools/demo/index.html', activeLaunches), ['active-module-launch']);
  assert.deepEqual(classifySensitivePath('tools/archive/index.html', activeLaunches), []);
  assert.deepEqual(classifySensitivePath('docs/notes.md', activeLaunches), []);

  const fresh = runFixture('fresh', freshHead, current);
  assert.equal(fresh.status, 0);
  assert.match(fresh.stdout, new RegExp(`candidate_base: ${current}`));
  assert.match(fresh.stdout, new RegExp(`current_gh_pages: ${current}`));
  assert.match(fresh.stdout, /fresh: true/);
  assert.match(fresh.stdout, /PASS: candidate contains the current gh-pages tip/);

  const staleSensitive = runFixture('stale-sensitive', staleSensitiveHead, current);
  assert.equal(staleSensitive.status, 1);
  assert.match(staleSensitive.stdout, new RegExp(`candidate_base: ${common}`));
  assert.match(staleSensitive.stdout, new RegExp(`current_gh_pages: ${current}`));
  assert.match(staleSensitive.stdout, /sensitive_surface: tools\/demo\/index\.html \[active-module-launch\]/);
  assert.match(staleSensitive.stdout, /FAIL: stale candidate touches deployment-sensitive surfaces/);

  const staleDocOnly = runFixture('stale-doc-only', staleDocHead, current);
  assert.equal(staleDocOnly.status, 0);
  assert.match(staleDocOnly.stdout, new RegExp(`candidate_base: ${common}`));
  assert.match(staleDocOnly.stdout, new RegExp(`current_gh_pages: ${current}`));
  assert.match(staleDocOnly.stdout, /fresh: false/);
  assert.match(staleDocOnly.stdout, /PASS: stale candidate changes only non-sensitive paths/);

  const workflow = readFileSync(join(repoRoot, '.github/workflows/stale-base.yml'), 'utf8');
  assert.match(workflow, /^on:\n  pull_request:/m);
  assert.doesNotMatch(workflow, /pull_request_target/);
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.doesNotMatch(workflow, /^\s+[a-z-]+: write$/m);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /github\.event\.pull_request\.head\.sha/);
  assert.match(workflow, /refs\/heads\/gh-pages:refs\/remotes\/origin\/gh-pages/);

  console.log('ok stale-base safeguard: fresh pass, stale-sensitive fail, stale-doc-only pass, read-only pull_request workflow');
} finally {
  rmSync(fixtureRepo, { recursive: true, force: true });
}
