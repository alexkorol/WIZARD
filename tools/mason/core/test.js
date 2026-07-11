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

// sheet layout and metadata; both sheets must be square because image
// models output fixed (square or 3:2) sizes and stretch anything else.
// Each layout carries the 100% tiles: full-inner lives among the masks
// (fully-surrounded mask), and a dedicated pure-outer slot follows them.
const sq = Mason.sheetLayout('square');
assert(sq.tiles.filter(t => t.role === 'mask').length === 47, 'square sheet mask tile count');
assert(sq.tiles.filter(t => t.role === 'outer').length === 1, 'square sheet needs one pure-outer slot');
assert(sq.tiles.some(t => t.mask === 255), 'square sheet needs the pure-inner mask tile');
assert(sq.cols === sq.rows, `square sheet not square (${sq.cols}x${sq.rows})`);
const hx = Mason.sheetLayout('hex');
assert(hx.tiles.filter(t => t.role === 'mask').length === 64, 'hex sheet mask tile count');
assert(hx.tiles.filter(t => t.role === 'outer').length === 1, 'hex sheet needs one pure-outer slot');
assert(hx.tiles.some(t => t.mask === 63), 'hex sheet needs the pure-inner mask tile');
assert(hx.cols === hx.rows, 'hex sheet not square');
// every slot fits inside the grid
for (const layout of [sq, hx]) {
  for (const t of layout.tiles) {
    assert(t.col < layout.cols && t.row < layout.rows, `tile ${t.index} outside ${layout.cols}x${layout.rows} grid`);
  }
}
const meta = Mason.sheetMetadata(p1);
assert(meta.lookup256.length === 256, 'metadata lookup table size');
assert(meta.tiles.length === 48, 'metadata tile count (47 masks + outer)');
assert(meta.tiles.some(t => t.role === 'outer'), 'metadata must mark the outer slot');

// outerAsInner: recasts the outer terrain and its texture as the tile's own
const swapped = Mason.outerAsInner(Object.assign({}, p1, { textures: { inner: 'A', outer: 'B' } }));
assert(swapped.inner === p1.outer, 'outerAsInner terrain swap');
assert(swapped.textures.inner === 'B', 'outerAsInner texture swap');

// scrubGuides: heals guide-red from surrounding art, leaves clean art alone
{
  const w = 12, h = 12;
  const img = { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
  for (let i = 0; i < w * h; i++) {
    img.data[i * 4] = 50; img.data[i * 4 + 1] = 150; img.data[i * 4 + 2] = 60; img.data[i * 4 + 3] = 255;
  }
  for (let y = 0; y < h; y++) { // a red guide column like a kept boundary line
    const o = (y * w + 5) * 4;
    img.data[o] = 225; img.data[o + 1] = 45; img.data[o + 2] = 45;
  }
  assert(Mason.scrubGuides(img) === true, 'scrubGuides should report red found');
  let reds = 0;
  for (let i = 0; i < w * h; i++) {
    const r = img.data[i * 4], g = img.data[i * 4 + 1];
    if (r > 130 && r > g * 1.7 + 20) reds++;
  }
  assert(reds === 0, `scrubGuides left ${reds} guide pixels`);
  const healed = (5 + 5 * w) * 4;
  assert(img.data[healed + 1] > 100, 'healed pixel should take neighbor green');

  const clean = { width: 4, height: 4, data: new Uint8ClampedArray(64) };
  for (let i = 0; i < 16; i++) { clean.data[i * 4] = 80; clean.data[i * 4 + 1] = 120; clean.data[i * 4 + 2] = 200; clean.data[i * 4 + 3] = 255; }
  const before = clean.data.slice();
  assert(Mason.scrubGuides(clean) === false, 'clean art should report no guides');
  assert(Buffer.from(clean.data).equals(Buffer.from(before)), 'clean art must be untouched');
}

// detectLetterbox: finds the content rect inside padded 3:2 output
{
  function noisy(img, x, y) { // textured content pixel
    const o = (y * img.width + x) * 4;
    const n = (x * 31 + y * 17) % 90;
    img.data[o] = 40 + n; img.data[o + 1] = 100 + ((x * 7 + y * 13) % 80); img.data[o + 2] = 50; img.data[o + 3] = 255;
  }
  // 1536x1024-style padding: square content centered with flat black bands
  const w = 192, h = 128, pad = 32; // content 128x128 with 32px pillarbox bands
  const img = { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const o = (y * w + x) * 4;
    if (x < pad || x >= w - pad) { img.data[o] = 8; img.data[o + 1] = 8; img.data[o + 2] = 8; img.data[o + 3] = 255; }
    else noisy(img, x, y);
  }
  const crop = Mason.detectLetterbox(img);
  assert(Math.abs(crop.x - pad) <= 2 && Math.abs(crop.w - (w - 2 * pad)) <= 4,
    `letterbox crop x/w wrong (${crop.x}, ${crop.w})`);
  assert(crop.y === 0 && crop.h === h, `letterbox crop y/h should be full (${crop.y}, ${crop.h})`);

  // no padding: full rect returned untouched
  const clean = { width: 64, height: 64, data: new Uint8ClampedArray(64 * 64 * 4) };
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) noisy(clean, x, y);
  const full = Mason.detectLetterbox(clean);
  assert(full.x === 0 && full.y === 0 && full.w === 64 && full.h === 64, 'clean image should not be cropped');
}

// every terrain style has the fields the painters rely on
for (const id of Object.keys(Mason.TERRAINS)) {
  const t = Mason.TERRAINS[id];
  assert(Array.isArray(t.base) && t.base.length === 2, `${id}: base pair`);
  assert(typeof t.rim === 'string' && t.rim[0] === '#', `${id}: rim color`);
}

console.log(`${checks} checks, ${failures} failures`);
process.exit(failures ? 1 : 0);
