#!/usr/bin/env node
/*
 * WIZARD-SURGE-039 gate: the guardian portrait must stay materially opaque,
 * naturally colored, and free of a horizontal liquid-fill boundary as the mana
 * field rises behind/in front of her inside the right orb.
 *
 * Deterministic protocol (fixed viewport, fixed frozen animation time, fixed
 * sim state): captures the built page at mana 0% / 50% / 100%, crops a labelled
 * close-up of the face, and asserts objective metrics over a justified ROI:
 *
 *   1. tint bound   — mean(B−R) inside the portrait core may shift only
 *                     slightly relative to the 0%-mana state (subtle reflected
 *                     blue light is allowed; submersion is not).
 *   2. fill-line    — horizontal-gradient energy at the exact expected surface
 *                     row must not spike versus neighboring rows inside the
 *                     portrait ROI.
 *   3. mana body    — an open-liquid reference patch must stay strongly
 *                     blue/saturated (guards against over-flattening).
 *
 * Usage:
 *   node tools/wizard_orbs/tests/face-occlusion.test.mjs                 # gate (after)
 *   node tools/wizard_orbs/tests/face-occlusion.test.mjs --label before --expect-fail
 *
 * Serves the REPO ROOT exactly as the acceptance registry prescribes:
 *   python3 -m http.server 8192 --bind 127.0.0.1 --directory .
 * Drives real Chrome over CDP (no npm dependencies; Node >= 22 global WebSocket).
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { inflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const argv = process.argv.slice(2);
const label = argv.includes('--label') ? argv[argv.indexOf('--label') + 1] : 'after';
const expectFail = argv.includes('--expect-fail');
const HTTP_PORT = 8192;
const CDP_PORT = 8193;
const FROZEN_TIME = 12.34;

/* ------------------------- deterministic constants ------------------------ */
const ART_W = 1672, ART_H = 941;
const ORB_VIEW = { x0: 270, y0: 210, x1: 1400, y1: 755 };
// Right orb center/radius in art pixels, y-up (baked into orb.frag).
const ORBR = { cx: 1128, cyUp: 483, r: 252 };
// Close crop around the mana guardian's cheek/hands/braid where they overlap
// the orb disc (verified against the aligned plates), art px, y-down.
const FACE_ROI = { x0: 1190, y0Top: 235, x1: 1350, y1Top: 505 };
// Portrait-only sub-box (marble material) used for tint/edge statistics.
const PORTRAIT_CORE = { x0: 1205, y0Top: 250, x1: 1335, y1Top: 405 };
// Open-liquid reference patch, far from any statue geometry.
const LIQUID_REF = { x0: 950, y0Top: 450, x1: 1100, y1Top: 600 };

function clamp01(x){ return Math.min(1, Math.max(0, x)); }
function smoothstep(a, b, x){ const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
// Mirror of levelFromFill() in tools/wizard_orbs/src/template.html.
function levelFromFill(f){
  f = clamp01(f);
  const fc = Math.min(0.9995, Math.max(0.0005, f));
  let h = 2 * fc - 1;
  for (let i = 0; i < 6; i++){
    const V = (2 + 3 * h - h * h * h) / 4;
    const dV = Math.max((3 - 3 * h * h) / 4, 1e-3);
    h -= (V - fc) / dV;
    h = Math.min(1, Math.max(-1, h));
  }
  const vol = h * 0.94;
  const lin = (2 * f - 1) * 1.045;
  const w = smoothstep(0.70, 0.95, f) + smoothstep(0.30, 0.05, f);
  return vol * (1 - w) + lin * w;
}
// Expected liquid surface as a y-down art-pixel row for a given mana fraction.
function surfaceRow(fill){
  const lvl = levelFromFill(fill);
  const yUp = ORBR.cyUp + lvl * ORBR.r;
  return Math.round(ART_H - yUp);
}

/* ------------------------------- PNG decode ------------------------------- */
function decodePNG(buf){
  assert.equal(buf.readUInt32BE(0), 0x89504e47, 'PNG signature');
  let off = 8, w = 0, h = 0, bitDepth = 0, colorType = 0, idat = [];
  while (off < buf.length){
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR'){
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
      assert.equal(bitDepth, 8, '8-bit PNG expected');
      assert.ok(colorType === 6 || colorType === 2, `color type ${colorType} supported (2/6)`);
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  const ch = colorType === 6 ? 4 : 3;
  const stride = w * ch;
  const raw = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(w * h * ch);
  let pos = 0;
  for (let y = 0; y < h; y++){
    const filter = raw[pos++];
    const row = raw.subarray(pos, pos + stride); pos += stride;
    const dst = y * stride;
    for (let x = 0; x < stride; x++){
      const a = x >= ch ? out[dst + x - ch] : 0;
      const b = y > 0 ? out[dst - stride + x] : 0;
      const c = x >= ch && y > 0 ? out[dst - stride + x - ch] : 0;
      let v = row[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4){
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[dst + x] = v & 0xff;
    }
  }
  return { w, h, ch, data: out };
}

/* --------------------------------- metrics -------------------------------- */
function crop(img, x0, y0, x1, y1){
  const w = x1 - x0, h = y1 - y0, out = new Float64Array(w * h * img.ch);
  for (let y = 0; y < h; y++){
    const src = ((y0 + y) * img.w + x0) * img.ch;
    out.set(img.data.subarray(src, src + w * img.ch), y * w * img.ch);
  }
  return { w, h, ch: img.ch, data: out };
}
const meanBR = c => {
  let s = 0, n = 0;
  for (let i = 0; i < c.data.length; i += c.ch){ s += c.data[i + 2] - c.data[i]; n++; }
  return s / (n * 255);
};
const meanSat = c => {
  let s = 0, n = 0;
  for (let i = 0; i < c.data.length; i += c.ch){
    const r = c.data[i], g = c.data[i + 1], b = c.data[i + 2];
    s += (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(Math.max(r, g, b), 1);
    n++;
  }
  return s / n;
};
// Row-mean (B−R) profile over [xa,xb) columns; a fill-level boundary shows up
// as a sharp jump in this profile even where statue texture is busy.
function rowBRProfile(img, yTop, xa, xb){
  let s = 0, n = 0;
  for (let x = xa; x < xb; x++){
    const i = (yTop * img.w + x) * img.ch;
    s += img.data[i + 2] - img.data[i];
    n++;
  }
  return s / (n * 255);
}

/* ------------------------------ infrastructure ---------------------------- */
async function waitFor(fn, ms, what){
  const t0 = Date.now();
  while (true){
    try { if (await fn()) return; } catch {}
    if (Date.now() - t0 > ms) throw new Error(`timeout waiting for ${what}`);
    await new Promise(r => setTimeout(r, 150));
  }
}

class Cdp {
  constructor(ws){ this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map();
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)){
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method && this.handlers.has(msg.method)){
        this.handlers.get(msg.method)(msg.params);
      }
    });
  }
  send(method, params = {}){
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(method, handler){ this.handlers.set(method, handler); }
  async evaluate(expression){
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('page eval: ' + JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
}

async function findPageTarget(){
  const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const page = list.find(t => t.type === 'page');
  if (!page) throw new Error('no page target');
  return page.webSocketDebuggerUrl;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------------------------------- main ---------------------------------- */
const evidenceDir = path.join(ROOT, 'evidence/visual/wizard-orbs-face', label);
mkdirSync(evidenceDir, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1', '--directory', '.'],
  { cwd: ROOT, stdio: 'ignore' });
let chrome, cdp;
const transcript = { label, frozenTime: FROZEN_TIME, viewport: { width: 1280, height: 800 },
  url: `http://127.0.0.1:${HTTP_PORT}/tools/wizard_orbs/index.html`, states: {}, thresholds: {},
  roi: { FACE_ROI, PORTRAIT_CORE, LIQUID_REF }, webgl: {} };

try {
  await waitFor(async () => (await fetch(`http://127.0.0.1:${HTTP_PORT}/tools/wizard_orbs/index.html`)).ok, 8000, 'http server');

  chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new', '--use-angle=swiftshader', '--disable-gpu', '--enable-unsafe-swiftshader',
    '--no-first-run', '--hide-scrollbars', '--mute-audio',
    `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=/tmp/wizard-orbs-face-${process.pid}`,
    'about:blank'
  ], { stdio: 'ignore' });

  let wsUrl;
  await waitFor(async () => { wsUrl = await findPageTarget(); return !!wsUrl; }, 15000, 'cdp target');
  const WebSocket = globalThis.WebSocket;
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',
    { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: transcript.url });

  // The template throws (before defining __WizardOrbs) unless the GLSL program
  // compiled AND linked — reaching here is the WebGL2 compile/link assertion.
  // S.time > 0 additionally proves texture upload finished and the render loop
  // is actually producing frames.
  await waitFor(async () => cdp.evaluate(`typeof window.__WizardOrbs === 'object' &&
    window.__WizardOrbs.S.time > 0.05`), 30000, 'program link + first frame');
  transcript.webgl.compileLinkAssertedVia = '__WizardOrbs present + S.time advancing (template throws on COMPILE/LINK_STATUS failure)';
  transcript.webgl.contextAttributes = 'webgl2 { antialias:false, alpha:true, premultipliedAlpha:true }';

  const rects = await cdp.evaluate(`(() => {
    const c = document.getElementById('gl').getBoundingClientRect();
    return { left: c.left, top: c.top, width: c.width, height: c.height };
  })()`);
  const scale = rects.width / (ORB_VIEW.x1 - ORB_VIEW.x0);
  const toImg = ({ x0, x1, y0Top, y1Top }) => ({
    x0: Math.round(rects.left + (x0 - ORB_VIEW.x0) * scale),
    x1: Math.round(rects.left + (x1 - ORB_VIEW.x0) * scale),
    y0: Math.round(rects.top + (y0Top - ORB_VIEW.y0) * scale),
    y1: Math.round(rects.top + (y1Top - ORB_VIEW.y0) * scale),
  });
  const imgFace = toImg(FACE_ROI), imgCore = toImg(PORTRAIT_CORE), imgLiq = toImg(LIQUID_REF);
  transcript.roi.imageRect = { face: imgFace, core: imgCore, liquid: imgLiq, canvasCss: rects };

  // Deterministic state: prefer the built-in freeze() hook. Pages built before
  // that hook existed get external pinning of time/beat/impulses immediately
  // before each screenshot instead (sub-frame time jitter, disclosed below).
  const hasFreeze = await cdp.evaluate(`typeof window.__WizardOrbs.freeze === 'function'`);
  transcript.determinismHook = hasFreeze ? 'freeze()' : 'legacy S.time pinning';
  await cdp.evaluate(`(() => {
    const W = window.__WizardOrbs, S = W.S;
    if (W.freeze) W.freeze(${FROZEN_TIME});
    S.hpRegen = false; S.mpRegen = false; S.channeling = false; S.boss = false;
    S.poison = 0; S.bleedT.length = 0;
    S.sloshL.a = 0; S.sloshL.v = 0; S.sloshR.a = 0; S.sloshR.v = 0;
    S.flashL = 0; S.flashR = 0; S.fullL = 0; S.fullR = 0;
    S.prevHpD = 1; S.prevMpD = 1;
    W.setHP(1, false); W.setMP(1, false);
    S.hpD = S.hp; S.mpD = S.mp;
    return { hp: S.hp, mp: S.mp, time: S.time };
  })()`);
  await sleep(250);

  async function captureMana(fill, name){
    await cdp.evaluate(`(() => {
      const W = window.__WizardOrbs, S = W.S;
      if (W.freeze) W.freeze(null);
      W.setHP(1, false); W.setMP(${fill}, false);
      S.hpD = S.hp; S.mpD = S.mp;
      if (W.freeze) { W.freeze(${FROZEN_TIME}); }
      else {
        S.time = ${FROZEN_TIME}; S.beat = 0.42;
        S.sloshL.a = 0; S.sloshR.a = 0; S.flashL = 0; S.flashR = 0;
        S.fullL = 0; S.fullR = 0; S.prevMpD = 1;
      }
      return { mp: S.mp, mpD: S.mpD };
    })()`);
    await sleep(hasFreeze ? 220 : 60);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const png = Buffer.from(shot.data, 'base64');
    writeFileSync(path.join(evidenceDir, `mana-${name}.png`), png);
    return png;
  }

  const pngEmpty = await captureMana(0, '0pct');
  const pngMidA = await captureMana(0.5, '50pct');
  const pngMidB = await captureMana(0.5, '50pct-repeat');           // determinism control
  const pngFull = await captureMana(1, '100pct');
  {
    // Determinism control compares the frozen CANVAS ROI (face crop), not the
    // whole viewport: DOM readouts (FPS counter) legitimately differ between
    // wall-clock moments.
    const a = decodePNG(pngMidA), b = decodePNG(pngMidB);
    let maxDelta = 0;
    for (let y = imgFace.y0; y < imgFace.y1; y++)
      for (let x = imgFace.x0; x < imgFace.x1; x++){
        const i = (y * a.w + x) * a.ch;
        for (let c = 0; c < 3; c++) maxDelta = Math.max(maxDelta, Math.abs(a.data[i + c] - b.data[i + c]));
      }
    transcript.repeatCaptureMaxChannelDelta = maxDelta;
    if (hasFreeze) assert.equal(maxDelta, 0, 'deterministic capture: frozen face ROI must be byte-identical');
    else assert.ok(maxDelta <= 12, `deterministic capture: face ROI drifted ${maxDelta}/255`);
  }

  // Labelled close crop of the face ROI at the 50% state (DOM label overlay,
  // clipped screenshot — deterministic because the frame itself is frozen).
  await cdp.evaluate(`(() => {
    const d = document.createElement('div');
    d.id = 'face-roi-label';
    d.textContent = 'FACE ROI - mana 50% (frozen t=${FROZEN_TIME})';
    d.style.cssText = 'position:fixed;z-index:99;left:${imgFace.x0}px;top:${imgFace.y0}px;'
      + 'font:12px monospace;color:#fff;background:rgba(0,0,0,.72);padding:3px 7px;border:1px solid #c9a96a';
    document.body.appendChild(d);
    return d.getBoundingClientRect().height;
  })()`);
  const cropShot = await cdp.send('Page.captureScreenshot', { format: 'png',
    clip: { x: imgFace.x0, y: imgFace.y0, width: imgFace.x1 - imgFace.x0, height: imgFace.y1 - imgFace.y0, scale: 1 } });
  writeFileSync(path.join(evidenceDir, 'close-crop-face-roi-50pct.png'), Buffer.from(cropShot.data, 'base64'));
  await cdp.evaluate(`document.getElementById('face-roi-label').remove()`);

  function analyze(png, fill, name){
    const img = decodePNG(png);
    const core = crop(img, imgCore.x0, imgCore.y0, imgCore.x1, imgCore.y1);
    const liq = crop(img, imgLiq.x0, imgLiq.y0, imgLiq.x1, imgLiq.y1);
    const m = {
      portraitTintBR: Number(meanBR(core).toFixed(4)),
      portraitSaturation: Number(meanSat(core).toFixed(4)),
      liquidTintBR: Number(meanBR(liq).toFixed(4)),
    };
    if (fill > 0){
      const row = surfaceRow(fill);
      const rowImg = Math.round(rects.top + (row - ORB_VIEW.y0) * scale);
      const prof = y => (y >= 0 && y < img.h) ? rowBRProfile(img, y, imgCore.x0, imgCore.x1) : null;
      const win = [], baseRows = [];
      for (let dy = -8; dy <= 8; dy++){
        const a = prof(rowImg + dy), b = prof(rowImg + dy + 1);
        if (a !== null && b !== null) win.push(Math.abs(b - a));
      }
      for (let dy = -60; dy <= 60; dy++){
        if (Math.abs(dy) < 20) continue;
        const a = prof(rowImg + dy), b = prof(rowImg + dy + 1);
        if (a !== null && b !== null) baseRows.push(Math.abs(b - a));
      }
      assert.ok(baseRows.length >= 12, `fill-line baseline window out of bounds at ${name}`);
      baseRows.sort((a, b) => a - b);
      const baseMedian = baseRows[(baseRows.length >> 1)];
      m.expectedSurfaceRowArt = row;
      m.fillLineMaxOverBaseline = Number((Math.max(...win) / Math.max(baseMedian, 1e-6)).toFixed(2));
    }
    transcript.states[name] = m;
    return m;
  }

  const mEmpty = analyze(pngEmpty, 0, '0pct');
  const mMid = analyze(pngMidA, 0.5, '50pct');
  const mFull = analyze(pngFull, 1, '100pct');

  const TINT_BOUND = 0.09, LINE_BOUND = 1.6, LIQUID_MIN = 0.18;
  transcript.thresholds = { tintBoundBR: TINT_BOUND, fillLineRatioBound: LINE_BOUND, liquidMinBR: LIQUID_MIN };

  const checks = [
    ['tint@50%', Math.abs(mMid.portraitTintBR - mEmpty.portraitTintBR) <= TINT_BOUND],
    ['tint@100%', Math.abs(mFull.portraitTintBR - mEmpty.portraitTintBR) <= TINT_BOUND],
    ['fillline@50%', mMid.fillLineMaxOverBaseline <= LINE_BOUND],
    ['liquid-body@50%', mMid.liquidTintBR >= LIQUID_MIN],
    ['liquid-body@100%', mFull.liquidTintBR >= LIQUID_MIN],
  ];
  transcript.checks = Object.fromEntries(checks.map(([k, v]) => [k, v ? 'PASS' : 'FAIL']));
  transcript.metricsDelta = {
    tintDelta50: Number((mMid.portraitTintBR - mEmpty.portraitTintBR).toFixed(4)),
    tintDelta100: Number((mFull.portraitTintBR - mEmpty.portraitTintBR).toFixed(4)),
    fillLineRatio50: mMid.fillLineMaxOverBaseline,
  };

  console.log(JSON.stringify(transcript, null, 2));
  writeFileSync(path.join(evidenceDir, 'metrics.json'), JSON.stringify(transcript, null, 2));

  const failed = checks.filter(([, ok]) => !ok);
  if (expectFail){
    assert.ok(failed.length > 0, '--expect-fail requested but all checks passed; nothing proven');
    console.error(`EXPECTED-FAIL confirmed (${failed.map(([k]) => k).join(',')} failed) — pre-fix behavior reproduced`);
    process.exitCode = 0;
  } else {
    assert.deepEqual(failed, [], 'face occlusion checks failed');
    console.error(`FACE-OCCLUSION GATE PASS (${label})`);
  }
} finally {
  try { if (cdp) await cdp.send('Browser.close'); } catch {}
  if (chrome) chrome.kill();
  server.kill();
}
