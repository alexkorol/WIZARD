import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildMatrixJson,
  buildMatrixMarkdown,
  collectDashboardSurfaces,
  discoverChrome,
  runAudit
} from '../scripts/accessibility-layout-check.mjs';

const AUTOMATED_CHECKS = [
  'keyboard-reachability',
  'focus-visibility',
  'landmarks-names',
  'reduced-motion',
  'overflow-375',
  'layout-1280'
];
const MANUAL_CHECKS = [
  'screen-reader semantics (AT pass)',
  'color contrast ratios',
  'focus order sensibility beyond reachability'
];

const surfaces = collectDashboardSurfaces();
assert.ok(
  surfaces.length >= 10,
  'driver precondition: expected dashboard + 9 active modules, found ' + surfaces.length
);
console.log('ok registry preconditions: ' + surfaces.length + ' surfaces (' +
  surfaces.map((s) => s.slug).join(', ') + ')');

const chromePath = discoverChrome();
if (!chromePath) {
  console.error('FAIL driver precondition: no Chrome/Chromium runtime available');
  console.error('probe: CHROME_BIN=' + (process.env.CHROME_BIN || 'unset') +
    ', platform=' + process.platform);
  process.exit(1);
}

const fixtureDir = mkdtempSync(join(tmpdir(), 'wizard-a11y-negative-'));
writeFileSync(join(fixtureDir, 'index.html'), `<!doctype html>
<html>
<head><title></title></head>
<body style="margin:0">
  <div style="width:1600px;height:40px;background:#333">overflow-maker</div>
  <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
  <button></button>
  <a href="#section" tabindex="7">positive-tabindex link</a>
  <a href="#other">normal link</a>
</body>
</html>
`);

const negativeResults = await runAudit({
  chromePath,
  root: fixtureDir,
  surfaces: [{
    id: 'fixture.negative',
    slug: 'negative-fixture',
    title: 'Negative control',
    path: '/index.html',
    readiness: 'generic'
  }],
  log: (m) => console.log('  [negative] ' + m)
});
assert.equal(negativeResults.length, 1);
const neg = negativeResults[0];
const expectedStatuses = {
  'keyboard-reachability': 'fail',
  'focus-visibility': 'pass',
  'landmarks-names': 'fail',
  'reduced-motion': 'manual',
  'overflow-375': 'fail',
  'layout-1280': 'fail'
};
for (const [checkName, expected] of Object.entries(expectedStatuses)) {
  assert.equal(
    neg.checks[checkName].status,
    expected,
    'negative control ' + checkName + ': expected ' + expected +
      ', got ' + neg.checks[checkName].status + ' — findings: ' +
      JSON.stringify(neg.checks[checkName].findings)
  );
}
assert.ok(
  neg.checks['keyboard-reachability'].findings.some((f) => f.includes('positive tabindex')),
  'negative control must flag positive tabindex'
);
assert.ok(
  neg.checks['landmarks-names'].findings.some((f) => f.includes('missing lang attribute')) &&
    neg.checks['landmarks-names'].findings.some((f) => f.includes('img missing alt')) &&
    neg.checks['landmarks-names'].findings.some((f) => f.includes('without accessible name')),
  'negative control must flag missing lang, missing alt, and unnamed button'
);
assert.ok(
  neg.checks['overflow-375'].measured.scrollWidth > 375,
  'negative control must measure overflow at 375px, saw scrollWidth=' +
    neg.checks['overflow-375'].measured.scrollWidth
);
assert.ok(
  neg.checks['focus-visibility'].status === 'pass' &&
    neg.checks['focus-visibility'].measured.focusedSampled > 0,
  'detector must not blanket-fail: fixture links keep UA focus outline and must pass'
);
console.log('ok negative control: every injected defect flagged, clean dimension still passes');

const results = await runAudit({
  chromePath,
  surfaces,
  log: (m) => console.log('  ' + m)
});
assert.equal(results.length, surfaces.length, 'audit must return one result per surface');

for (const r of results) {
  assert.equal(r.reached, true, r.slug + ' was not reached');
  for (const name of [...AUTOMATED_CHECKS, ...MANUAL_CHECKS]) {
    const check = r.checks[name];
    assert.ok(check, r.slug + ' missing check row: ' + name);
    assert.ok(
      ['pass', 'fail', 'manual'].includes(check.status),
      r.slug + '/' + name + ' has unclassified status: ' + check.status
    );
  }
  assert.equal(
    r.checks['overflow-375'].measured.innerWidth,
    375,
    r.slug + ' narrow viewport proof failed'
  );
  assert.equal(
    r.checks['layout-1280'].measured.innerWidth,
    1280,
    r.slug + ' wide viewport proof failed'
  );
}

const dash = results.find((r) => r.slug === 'dashboard');
assert.ok(dash, 'dashboard surface must be present');
assert.equal(
  dash.checks['layout-1280'].measured.dashboardCards,
  9,
  'dashboard G0 precondition: 9 rendered cards required'
);

const totals = { pass: 0, fail: 0, manual: 0 };
for (const r of results) {
  for (const check of Object.values(r.checks)) totals[check.status]++;
}
console.log('ok full audit: ' + results.length + ' surfaces reached; PASS ' +
  totals.pass + ', FAIL ' + totals.fail + ', MANUAL ' + totals.manual);

const matrixJsonPath = join('evidence', 'accessibility', 'matrix.json');
const matrixDocPath = join('docs', 'visual', 'ACCESSIBILITY_RESPONSIVE_MATRIX.md');
assert.ok(existsSync(matrixJsonPath), matrixJsonPath + ' must be committed');
assert.ok(existsSync(matrixDocPath), matrixDocPath + ' must be committed');
const freshJson = buildMatrixJson(results);
const freshDoc = buildMatrixMarkdown(results);
const committedJson = readFileSync(matrixJsonPath, 'utf8');
const committedDoc = readFileSync(matrixDocPath, 'utf8');
assert.equal(
  freshJson,
  committedJson,
  matrixJsonPath + ' is stale; regenerate with node scripts/accessibility-layout-check.mjs --write'
);
assert.equal(
  freshDoc,
  committedDoc,
  matrixDocPath + ' is stale; regenerate with node scripts/accessibility-layout-check.mjs --write'
);
console.log('ok freshness: matrix.json and ACCESSIBILITY_RESPONSIVE_MATRIX.md match a live audit');

console.log('ok accessibility-layout audit gate: ' + surfaces.length +
  ' surfaces covered, detector sensitivity proven, artifacts fresh');
