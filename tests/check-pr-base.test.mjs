import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = 'scripts/check-pr-base.mjs';

function git(dir, ...args) {
  const result = spawnSync('git', args, { cwd: dir, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stderr}`);
  return (result.stdout || '').trim();
}

function runChecker(repo, extraArgs = []) {
  const result = spawnSync(process.execPath, [SCRIPT, '--repo', repo, ...extraArgs], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return {
    status: result.status,
    stdout: (result.stdout || '').replaceAll('\r\n', '\n'),
    stderr: (result.stderr || '').replaceAll('\r\n', '\n'),
  };
}

function writeCommit(dir, message, files) {
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(dir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  git(dir, 'add', '-A');
  git(dir, 'commit', '-m', message);
  return git(dir, 'rev-parse', 'HEAD');
}

function makeScratchRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-base-fixture-'));
  git(dir, 'init', '-b', 'gh-pages');
  git(dir, 'config', 'user.email', 'fixture@example.invalid');
  git(dir, 'config', 'user.name', 'Fixture');
  return dir;
}

const repo = makeScratchRepo();

const baseTip = writeCommit(repo, 'base', {
  'index.html': '<title>WIZARD</title>\n',
  'modules.json': JSON.stringify({ modules: [{ slug: 'wizard_orbs' }] }, null, 2) + '\n',
  'shared/wizard-lab.js': 'export {};\n',
  'docs/note.md': 'narrative only\n',
});

git(repo, 'checkout', '-b', 'stale-sensitive', baseTip);
const sensitiveHead = writeCommit(repo, 'touch dashboard and registry', {
  'index.html': '<title>WIZARD v2</title>\n',
  'modules.generated.js': '// generated\n',
});
git(repo, 'checkout', '-b', 'stale-doc-only', baseTip);
const docHead = writeCommit(repo, 'docs only', {
  'docs/note.md': 'revised narrative\n',
});
git(repo, 'checkout', 'gh-pages');
writeCommit(repo, 'advance gh-pages', {
  'README.md': 'tip advanced without the candidates\n',
});
const newBaseTip = git(repo, 'rev-parse', 'gh-pages');

assert.notEqual(baseTip, newBaseTip);

{
  const label = 'fresh candidate passes';
  git(repo, 'checkout', '-b', 'fresh-candidate', newBaseTip);
  const freshHead = writeCommit(repo, 'touch shared runtime on current tip', {
    'shared/wizard-lab.js': 'export const fresh = true;\n',
  });
  const result = runChecker(repo, ['--head', freshHead]);
  assert.equal(result.status, 0, `expected pass:\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS pr-base candidate base is current/);
  console.log(`PASS ${label}`);
}

{
  const label = 'stale doc-only candidate passes with explicit note';
  const result = runChecker(repo, ['--head', docHead]);
  assert.equal(result.status, 0, `expected pass:\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS pr-base stale but insensitive/);
  assert.match(result.stdout, /merge-base=/);
  console.log(`PASS ${label}`);
}

{
  const label = 'stale candidate touching protected surfaces hard-fails with both SHAs and touched surfaces';
  const result = runChecker(repo, ['--head', sensitiveHead]);
  assert.equal(result.status, 1, `expected fail:\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stderr, /FAIL pr-base STALE candidate touches protected deployment surfaces/);
  assert.ok(result.stderr.includes(baseTip), `must name the stale merge-base SHA:\n${result.stderr}`);
  assert.ok(result.stderr.includes(newBaseTip), `must name the current gh-pages tip SHA:\n${result.stderr}`);
  assert.match(result.stderr, /DASHBOARD: index\.html/);
  assert.match(result.stderr, /REGISTRY: modules\.generated\.js/);
  console.log(`PASS ${label}`);
}

{
  const label = 'active-module surface derived from modules.json at candidate head';
  git(repo, 'checkout', '-b', 'stale-active-module', baseTip);
  const activeHead = writeCommit(repo, 'touch active module launch page', {
    'tools/wizard_orbs/index.html': '<!doctype html>\n',
  });
  const result = runChecker(repo, ['--head', activeHead]);
  assert.equal(result.status, 1, `expected fail:\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stderr, /ACTIVE_MODULE\(wizard_orbs\): tools\/wizard_orbs\/index\.html/);
  console.log(`PASS ${label}`);
}

{
  const label = 'missing head is a usage failure, not a false green';
  const result = runChecker(repo);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /FAIL no candidate head resolved/);
  console.log(`PASS ${label}`);
}

fs.rmSync(repo, { recursive: true, force: true });
console.log('PASS check-pr-base.test.mjs');
