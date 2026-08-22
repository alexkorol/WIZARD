import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runFirstScreenCheck } from '../scripts/first-screen-check.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVIDENCE = path.join(ROOT, 'evidence', 'visual', 'first-screen');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.txt': 'text/plain'
};

function startServer(rootDir) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let filePath = path.normalize(path.join(rootDir, urlPath));
      if (!filePath.startsWith(path.normalize(rootDir))) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
      try {
        const body = readFileSync(filePath);
        res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end('not found');
      }
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

function writeFixture(dir, name, html) {
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, name);
  writeFileSync(file, html);
  return file;
}

const BELOW_FOLD_FIXTURE = `<!doctype html>
<html><head><meta charset="utf-8"><title>below-fold fixture</title></head>
<body style="margin:0">
<p>Verdigris Systems Laboratory</p>
<p>Workbench for Integration, Zones, Annotation &amp; Resource Design</p>
<div style="height:1400px"></div>
<section id="module-groups"><p>late grid</p></section>
</body></html>`;

const NO_IDENTITY_FIXTURE = `<!doctype html>
<html><head><meta charset="utf-8"><title>no-identity fixture</title></head>
<body style="margin:0">
<section id="module-groups"><p>early grid</p></section>
</body></html>`;

mkdirSync(EVIDENCE, { recursive: true });
const scratch = path.join(tmpdir(), `wizard-first-screen-test-${process.pid}`);
mkdirSync(scratch, { recursive: true });
writeFixture(scratch, 'below-fold.html', BELOW_FOLD_FIXTURE);
writeFixture(scratch, 'no-identity.html', NO_IDENTITY_FIXTURE);

const repoServer = await startServer(ROOT);
const fixServer = await startServer(scratch);
const failures = [];

try {
  console.log('== first-screen: real dashboard at 1280x800 ==');
  const wideShot = path.join(EVIDENCE, 'dashboard-1280x800.png');
  const wideMeta = path.join(EVIDENCE, 'dashboard-1280x800.json');
  const wide = await runFirstScreenCheck({
    url: `http://127.0.0.1:${repoServer.port}/`,
    width: 1280,
    height: 800,
    maxTop: 800,
    cdpPort: 8166,
    screenshotPath: wideShot,
    metadataPath: wideMeta
  });
  console.log(`verdict=${wide.verdict} detail: ${wide.detail} browser=${wide.browser?.description ?? 'none'}`);
  if (wide.verdict !== 'PASS') {
    failures.push(`wide check failed: ${wide.reasons?.join(',')} ${wide.detail ?? ''}`);
  } else {
    const meta = JSON.parse(readFileSync(wideMeta, 'utf8'));
    assert.equal(meta.effectiveViewport.width, 1280);
    assert.equal(meta.effectiveViewport.height, 800);
    assert.equal(meta.capture.width, 1280);
    assert.equal(meta.capture.height, 800);
    assert.ok(meta.measured.groupsTop <= meta.thresholds.maxTop, 'module groups must begin above the fold');
    assert.ok(meta.measured.identity.every((i) => i.found), 'identity tokens present');
    console.log(`ok: groupsTop=${meta.measured.groupsTop}px <= ${meta.thresholds.maxTop}; capture is genuinely ${meta.capture.width}x${meta.capture.height}`);
  }

  console.log('== first-screen: real dashboard at 375x900 ==');
  const narrowShot = path.join(EVIDENCE, 'dashboard-narrow-375x900.png');
  const narrowMeta = path.join(EVIDENCE, 'dashboard-narrow-375x900.json');
  const narrow = await runFirstScreenCheck({
    url: `http://127.0.0.1:${repoServer.port}/`,
    width: 375,
    height: 900,
    maxTop: 900,
    cdpPort: 8167,
    screenshotPath: narrowShot,
    metadataPath: narrowMeta
  });
  console.log(`verdict=${narrow.verdict} detail: ${narrow.detail}`);
  if (narrow.verdict !== 'PASS') {
    failures.push(`narrow check failed: ${narrow.reasons?.join(',')} ${narrow.detail ?? ''}`);
  } else {
    const meta = JSON.parse(readFileSync(narrowMeta, 'utf8'));
    assert.equal(meta.capture.width, 375);
    assert.equal(meta.capture.height, 900);
    assert.ok(typeof meta.measured.bodyScrollWidth === 'number');
    console.log(`ok: narrow capture ${meta.capture.width}x${meta.capture.height}, bodyScrollWidth=${meta.measured.bodyScrollWidth} (informational; responsive gate owned by SURGE-006)`);
  }

  console.log('== first-screen: negative control - module groups pushed below the fold ==');
  const belowFold = await runFirstScreenCheck({
    url: `http://127.0.0.1:${fixServer.port}/below-fold.html`,
    width: 1280,
    height: 800,
    maxTop: 800,
    cdpPort: 8168
  });
  console.log(`verdict=${belowFold.verdict} reasons=${JSON.stringify(belowFold.reasons)}`);
  assert.equal(belowFold.verdict, 'FAIL', 'pushed-down fixture must fail');
  assert.deepEqual(belowFold.reasons, ['GROUPS_BELOW_FOLD']);

  console.log('== first-screen: negative control - identity copy removed ==');
  const noIdentity = await runFirstScreenCheck({
    url: `http://127.0.0.1:${fixServer.port}/no-identity.html`,
    width: 1280,
    height: 800,
    maxTop: 800,
    cdpPort: 8169
  });
  console.log(`verdict=${noIdentity.verdict} reasons=${JSON.stringify(noIdentity.reasons)}`);
  assert.equal(noIdentity.verdict, 'FAIL', 'identity-less fixture must fail');
  assert.deepEqual(noIdentity.reasons, ['IDENTITY_MISSING']);
} catch (err) {
  failures.push(err.message);
} finally {
  repoServer.server.close();
  fixServer.server.close();
  rmSync(scratch, { recursive: true, force: true });
}

if (failures.length > 0 || !existsSync(path.join(EVIDENCE, 'dashboard-1280x800.png'))) {
  console.error('FAIL first-screen harness:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`PASS first-screen harness: wide+narrow captures with viewport-proof metadata, 2 negative controls rejected`);
