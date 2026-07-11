/*
 * Tests for the Mason bitmask logic (the canvas painters are exercised
 * by the demo; everything testable without a canvas is covered here).
 * Run: node tools/mason/core/test.js
 */
'use strict';

const Mason = require('./mason.js');

let checks = 0, failures = 0;
function assert(cond, msg) {
  checks++;
  if (!cond) { failures++; console.error('FAIL: ' + msg); }
}

// the blob set has exactly 47 canonical masks
assert(Mason.BLOB_MASKS.length === 47, `expected 47 blob masks, got ${Mason.BLOB_MASKS.length}`);

// every canonical mask is its own canonical form
for (const m of Mason.BLOB_MASKS) {
  assert(Mason.canonical(m) === m, `mask ${m} is not a fixed point of canonical()`);
}

// all 256 raw masks collapse onto the 47, and the lookup table agrees
const seen = new Set();
for (let m = 0; m < 256; m++) {
  const c = Mason.canonical(m);
  assert(Mason.BLOB_MASKS.includes(c), `canonical(${m}) = ${c} not in blob set`);
  const idx = Mason.BLOB_LOOKUP[m];
  assert(Mason.BLOB_MASKS[idx] === c, `lookup mismatch for mask ${m}`);
  seen.add(c);
}
assert(seen.size === 47, `raw masks collapse to ${seen.size} values, expected 47`);

// corner bits are ignored without both adjacent edges
assert(Mason.canonical(2) === 0, 'lone NE corner should cancel');   // NE only
assert(Mason.canonical(1 | 2) === 1, 'NE without E should cancel'); // N + NE
assert(Mason.canonical(1 | 2 | 4) === 7, 'N+NE+E should survive');

// neighbor tables have the right shapes
assert(Mason.SQUARE_NEIGHBORS.length === 8, 'square neighbor count');
assert(Mason.HEX_NEIGHBORS.length === 6, 'hex neighbor count');
// hex neighbors: each direction's opposite is 3 apart
for (let k = 0; k < 6; k++) {
  const a = Mason.HEX_NEIGHBORS[k], b = Mason.HEX_NEIGHBORS[(k + 3) % 6];
  assert(a[0] === -b[0] && a[1] === -b[1], `hex neighbor ${k} not opposite of ${(k + 3) % 6}`);
}

// set params: deterministic per seed, string seeds hash
const p1 = Mason.makeSetParams({ seed: 42, inner: 'grass', outer: 'sand' });
const p2 = Mason.makeSetParams({ seed: 42, inner: 'grass', outer: 'sand' });
assert(JSON.stringify(p1.edges) === JSON.stringify(p2.edges), 'edge params not deterministic');
const p3 = Mason.makeSetParams({ seed: 'old road', inner: 'water', outer: 'sand' });
const p4 = Mason.makeSetParams({ seed: 'old road', inner: 'water', outer: 'sand' });
assert(p3.seed === p4.seed, 'string seed not deterministic');

// wobble: envelope is zero at edge endpoints so tiles butt seamlessly
for (let e = 0; e < 6; e++) {
  assert(Math.abs(Mason.wobble(p1, e, 0, 0.5) - 1) < 1e-9, `wobble not 1 at t=0 for edge ${e}`);
  assert(Math.abs(Mason.wobble(p1, e, 1, 0.5) - 1) < 1e-9, `wobble not 1 at t=1 for edge ${e}`);
}

// sheet layout and metadata
const sq = Mason.sheetLayout('square');
assert(sq.tiles.length === 47, 'square sheet tile count');
const hx = Mason.sheetLayout('hex');
assert(hx.tiles.length === 64 && hx.cols === 8 && hx.rows === 8, 'hex sheet layout');
const meta = Mason.sheetMetadata(p1);
assert(meta.lookup256.length === 256, 'metadata lookup table size');
assert(meta.tiles.length === 47, 'metadata tile count');

// every terrain style has the fields the painters rely on
for (const id of Object.keys(Mason.TERRAINS)) {
  const t = Mason.TERRAINS[id];
  assert(Array.isArray(t.base) && t.base.length === 2, `${id}: base pair`);
  assert(typeof t.rim === 'string' && t.rim[0] === '#', `${id}: rim color`);
}

console.log(`${checks} checks, ${failures} failures`);
process.exit(failures ? 1 : 0);
