import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = 'scripts/deploy-smoke.mjs';

function git(dir, ...args) {
  const result = spawnSync('git', args, { cwd: dir, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stderr}`);
  return (result.stdout || '').trim();
}

function runSmoke(repo, ref, baseUrl, extra = []) {
  return new Promise(resolve => {
    const child = spawn(
      process.execPath,
      [SCRIPT, '--repo', repo, '--ref', ref, '--base-url', baseUrl, '--backoff-ms', '5', '--backoff-cap-ms', '20', ...extra],
      { cwd: REPO_ROOT }
    );
    let out = '';
    let err = '';
    child.stdout.on('data', chunk => {
      out += chunk;
    });
    child.stderr.on('data', chunk => {
      err += chunk;
    });
    child.on('close', status => {
      resolve({
        status,
        stdout: out.replaceAll('\r\n', '\n'),
        stderr: err.replaceAll('\r\n', '\n'),
      });
    });
  });
}

function materializeTree(repo, sha, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  const archive = spawnSync('git', ['-C', repo, 'archive', '--format=tar', sha], { encoding: null });
  assert.equal(archive.status, 0, 'git archive failed');
  const tar = spawnSync('tar', ['-xf', '-', '-C', targetDir], {
    input: archive.stdout,
    encoding: 'buffer',
  });
  assert.equal(tar.status, 0, `tar extract failed: ${tar.stderr && tar.stderr.toString()}`);
}

const V1_TITLE = '<title>WIZARD — Verdigris Systems Laboratory v1</title>';
const V2_TITLE = '<title>WIZARD — Verdigris Systems Laboratory v2</title>';
const SHARED_JS = 'export const sharedMarker = "v7";\n';
const MODULE_HTML = '<!doctype html><title>Demo A</title>\n';

const scratchRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-smoke-repo-'));
git(scratchRepo, 'init', '-b', 'gh-pages');
git(scratchRepo, 'config', 'user.email', 'fixture@example.invalid');
git(scratchRepo, 'config', 'user.name', 'Fixture');

function commitAll(message) {
  git(scratchRepo, 'add', '-A');
  git(scratchRepo, 'commit', '-m', message);
  return git(scratchRepo, 'rev-parse', 'HEAD');
}

function write(rel, content) {
  const full = path.join(scratchRepo, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

write('index.html', `${V1_TITLE}\n<script src="shared/wizard-lab.js?v=7"></script>\n`);
write('shared/wizard-lab.js', SHARED_JS);
write('tools/demo_a/index.html', MODULE_HTML);
write('tools/demo_b/index.html', '<!doctype html><title>Demo B</title>\n');
write('tools/internal/index.html', '<!doctype html><title>Hidden</title>\n');
write(
  'modules.json',
  JSON.stringify(
    {
      modules: [
        { slug: 'demo_a', visibility: 'dashboard', launch: 'tools/demo_a/index.html' },
        { slug: 'demo_b', visibility: 'dashboard', launch: 'tools/demo_b/index.html' },
        { slug: 'hidden', visibility: 'internal', launch: 'tools/internal/index.html' },
      ],
    },
    null,
    2
  ) + '\n'
);
const shaV1 = commitAll('site v1');

write('index.html', `${V2_TITLE}\n<script src="shared/wizard-lab.js?v=7"></script>\n`);
const shaV2 = commitAll('identity copy advanced to v2');

assert.notEqual(shaV1, shaV2);

let server;
let requestCounts;
let faultsRemaining;

function startServer(rootDir) {
  requestCounts = new Map();
  faultsRemaining = 0;
  server = http.createServer((request, response) => {
    const incoming = new URL(request.url, 'http://127.0.0.1');
    const urlPath = `${decodeURIComponent(incoming.pathname)}${incoming.search}`;
    requestCounts.set(urlPath, (requestCounts.get(urlPath) || 0) + 1);
    if (/\/WIZARD\/tools\/demo_b\//.test(urlPath) && faultsRemaining > 0) {
      faultsRemaining -= 1;
      response.writeHead(503);
      response.end('injected outage');
      return;
    }
    const relative = decodeURIComponent(incoming.pathname).replace(/^\/WIZARD\//, '');
    const file = path.join(rootDir, relative);
    if (!file.startsWith(rootDir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404);
      response.end('not found');
      return;
    }
    response.writeHead(200);
    response.end(fs.readFileSync(file));
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
}

const serveDirV2 = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-smoke-serve-')), 'WIZARD');
materializeTree(scratchRepo, shaV2, serveDirV2);
const port = await startServer(path.dirname(serveDirV2 + '/x'));
const baseUrl = `http://127.0.0.1:${port}/WIZARD/`;

{
  const label = 'fresh deployment passes and checks exactly the active launch URLs';
  const result = await runSmoke(scratchRepo, shaV2, baseUrl);
  assert.equal(result.status, 0, `expected pass:\n${result.stdout}\n${result.stderr}`);
  assert.ok(result.stdout.includes(`expected=gh-pages@${shaV2}`), result.stdout);
  assert.match(result.stdout, new RegExp(`PASS deploy-smoke deployed content matches gh-pages @ ${shaV2}`));
  assert.match(result.stdout, /OK\s+.*\/WIZARD\/index\.html/m);
  assert.match(result.stdout, /OK\s+.*\/tools\/demo_a\/index\.html/m);
  assert.match(result.stdout, /OK\s+.*\/shared\/wizard-lab\.js\?v=7/m);
  assert.ok(requestCounts.get('/WIZARD/tools/demo_a/index.html') >= 1, 'active launch URL must be requested');
  assert.ok(requestCounts.get('/WIZARD/shared/wizard-lab.js?v=7') >= 1, 'pinned asset must be requested');
  assert.ok(!requestCounts.has('/WIZARD/tools/internal/index.html'), 'internal module must not be requested');
  console.log(`PASS ${label}`);
}

{
  const label = 'forced stale content fails naming the URL and expected SHA';
  const serveDirV1Root = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-smoke-stale-'));
  materializeTree(scratchRepo, shaV1, path.join(serveDirV1Root, 'WIZARD'));
  const staleServer = http.createServer((request, response) => {
    const urlPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const file = path.join(serveDirV1Root, urlPath.replace(/^\//, ''));
    if (!fs.existsSync(file)) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    response.end(fs.readFileSync(file));
  });
  await new Promise(resolve => staleServer.listen(0, '127.0.0.1', resolve));
  const stalePort = staleServer.address().port;
  try {
    const result = await runSmoke(scratchRepo, shaV2, `http://127.0.0.1:${stalePort}/WIZARD/`);
    assert.equal(result.status, 1, `expected fail:\n${result.stdout}\n${result.stderr}`);
    assert.match(result.stderr, /FAIL deploy-smoke/);
    assert.ok(result.stderr.includes(shaV2), `must name expected SHA:\n${result.stderr}`);
    assert.match(result.stderr, /served bytes differ from gh-pages/);
    console.log(`PASS ${label}`);
  } finally {
    staleServer.close();
    fs.rmSync(serveDirV1Root, { recursive: true, force: true });
  }
}

{
  const label = 'transient outage is retried with bounded real backoff';
  const before = requestCounts.get('/WIZARD/tools/demo_b/index.html') || 0;
  faultsRemaining = 2;
  const result = await runSmoke(scratchRepo, shaV2, baseUrl);
  assert.equal(result.status, 0, `expected pass after retries:\n${result.stdout}\n${result.stderr}`);
  const demoBRequests = (requestCounts.get('/WIZARD/tools/demo_b/index.html') || 0) - before;
  assert.equal(demoBRequests, 3, `expected exactly 3 attempts for the faulted URL, got ${demoBRequests}`);
  assert.match(result.stdout, /3 attempts/);
  console.log(`PASS ${label} (${demoBRequests} attempts)`);
}

server.close();
fs.rmSync(scratchRepo, { recursive: true, force: true });
console.log('PASS deploy-smoke.test.mjs');
process.exit(0);
