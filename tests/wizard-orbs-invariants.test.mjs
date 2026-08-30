// Guards for tools/wizard_orbs — the two invariants that were broken by the
// Aug-2026 "unifying pass" and survived four fix PRs (#97, #98, #103, #104).
// If this test fails, read tools/wizard_orbs/CLAUDE.md before touching
// anything: the correct fix is almost never to relax this test.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const orbs = new URL('../tools/wizard_orbs/', import.meta.url);
const read = p => readFileSync(new URL(p, orbs));

// 1. mask.png must be byte-identical to the pristine June baseline. Every
//    attempt to "recarve" it blackened orb-interior pixels → pale band over
//    the empty dome + blown-out hotspot on the statue chest/hand.
const mask = read('src/assets/mask.png');
const baseline = read('src/assets/mask_baseline.png');
assert.ok(mask.equals(baseline),
  'mask.png differs from mask_baseline.png — never recarve the mask (see tools/wizard_orbs/CLAUDE.md)');

// 2. The WebGL overlay must cover the full art frame. The orb light spill and
//    statue relighting reach ~200px past the rims; any tighter ORB_VIEW crop
//    cuts the glow off in a hard vertical seam across the statues.
const template = read('src/template.html').toString();
const view = template.match(/const ORB_VIEW = \{ x0: (\d+), y0: (\d+), x1: (\d+), y1: (\d+) \}/);
assert.ok(view, 'ORB_VIEW constant not found in src/template.html');
assert.deepEqual(view.slice(1, 5).map(Number), [0, 0, 1672, 941],
  `ORB_VIEW is cropped (${view[0]}) — the overlay must cover the full 1672x941 frame`);

// 3. The shader must not discard mask-black pixels — they carry the light
//    spill and statue relighting ("silver band over the dome" regression).
const frag = read('src/orb.frag').toString();
assert.ok(!/^\s*(if\s*\(.*\)\s*)?discard\s*;/m.test(frag),
  'orb.frag contains a discard statement — mask-black pixels must still render spill/relight');

// 4. index.html is a build artifact of src/ (python3 build.py). A stale build
//    means fixes to src never reach the served page. The build is a pure
//    substitution, so the built file must embed the current shader text and
//    the current mask verbatim.
const built = read('index.html').toString().replace(/\r\n/g, '\n');
assert.ok(built.includes(frag.replace(/\r\n/g, '\n')),
  'index.html does not embed the current src/orb.frag — rerun python3 build.py');
assert.ok(built.includes(mask.toString('base64')),
  'index.html does not embed the current src/assets/mask.png — rerun python3 build.py');
assert.ok(built.includes('const ORB_VIEW = { x0: 0, y0: 0, x1: 1672, y1: 941 }'),
  'built index.html has a cropped ORB_VIEW — rerun python3 build.py');

console.log('ok wizard_orbs invariants (mask baseline, full-frame overlay, no discard, fresh build)');
