#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VIEWPORT_NARROW = { width: 375, height: 900 };
const VIEWPORT_WIDE = { width: 1280, height: 800 };
const CAPSULE_PORTS = [8167, 8168, 8169];
const NAV_TIMEOUT_MS = 20000;
const SETTLE_MS = 700;
const AUTOMATED_CHECKS = [
  'keyboard-reachability',
  'focus-visibility',
  'landmarks-names',
  'reduced-motion',
  'overflow-375',
  'layout-1280'
];
const MANUAL_CHECKS = [
  {
    name: 'screen-reader semantics (AT pass)',
    note: 'requires account-level assistive technology; not automatable here'
  },
  {
    name: 'color contrast ratios',
    note: 'computed-style pair sampling is false-positive prone on canvas/shader art; kept manual'
  },
  {
    name: 'focus order sensibility beyond reachability',
    note: 'reachability is automated; whether tab order matches visual logic needs human judgment'
  }
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

export function discoverChrome() {
  const candidates = [];
  if (process.env.CHROME_BIN) candidates.push(process.env.CHROME_BIN);
  const macApps = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
  ];
  for (const p of process.platform === 'darwin' ? macApps : []) candidates.push(p);
  if (process.platform !== 'darwin') {
    for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
      for (const dir of (process.env.PATH || '').split(':')) {
        if (dir) candidates.push(join(dir, bin));
      }
    }
  }
  return candidates.find((p) => {
    try { return !!p && statSync(p).isFile(); } catch { return false; }
  }) || null;
}

export function collectDashboardSurfaces() {
  const surfaces = [{
    id: 'wizard.dashboard',
    slug: 'dashboard',
    title: 'WIZARD dashboard',
    path: '/index.html',
    readiness: 'dashboard-cards'
  }];
  const toolsDir = join(REPO_ROOT, 'tools');
  for (const entry of readdirSync(toolsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifestPath = join(toolsDir, entry.name, 'wizard.module.json');
    if (!existsSync(manifestPath)) continue;
    let manifest;
    try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch { continue; }
    if (manifest.visibility !== 'dashboard') continue;
    surfaces.push({
      id: manifest.id || 'wizard.' + entry.name,
      slug: manifest.slug || entry.name,
      title: manifest.title || entry.name,
      path: '/' + String(manifest.launch || ('tools/' + entry.name + '/index.html')).replace(/^\//, ''),
      readiness: 'generic'
    });
  }
  return surfaces;
}

export function startStaticServer({ root = REPO_ROOT } = {}) {
  return new Promise((resolveFn) => {
    const server = createServer((req, res) => {
      let pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const filePath = normalize(join(root, pathname));
      if (!filePath.startsWith(normalize(root))) {
        res.writeHead(403);
        res.end('forbidden');
        return;
      }
      try {
        const body = readFileSync(filePath);
        res.writeHead(200, {
          'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream'
        });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end('not found: ' + pathname);
      }
    });
    const tryListen = (ports, idx) => {
      if (idx >= ports.length) {
        server.listen(0, '127.0.0.1', () =>
          resolveFn({ server, port: server.address().port, portSource: 'ephemeral-fallback' }));
        return;
      }
      server.once('error', () => {
        server.removeAllListeners('error');
        tryListen(ports, idx + 1);
      });
      server.listen(ports[idx], '127.0.0.1', () =>
        resolveFn({ server, port: ports[idx], portSource: 'capsule' }));
    };
    tryListen(CAPSULE_PORTS, 0);
  });
}

async function getJson(url, method = 'GET') {
  const res = await fetch(url, { method });
  if (!res.ok) throw new Error(method + ' ' + url + ' -> HTTP ' + res.status);
  return res.json();
}

async function newTarget(cdpPort, url) {
  try {
    return await getJson('http://127.0.0.1:' + cdpPort + '/json/new?' + url, 'PUT');
  } catch (err) {
    void err;
    return getJson('http://127.0.0.1:' + cdpPort + '/json/new?' + url);
  }
}

const evalPageFn = (page, fnSource, arg) =>
  page.evaluate('(' + fnSource + ')(' + JSON.stringify(arg) + ')');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function freePort() {
  return import('node:net').then(({ createServer }) => new Promise((resolveFn) => {
    const srv = createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolveFn(port));
    });
  }));
}

class CdpPage {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.eventWaiters = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id !== undefined && this.pending.has(msg.id)) {
        const { resolveFn, rejectFn } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rejectFn(new Error('cdp error on ' + msg.id + ': ' + JSON.stringify(msg.error)));
        else resolveFn(msg.result);
        return;
      }
      if (msg.method) {
        this.eventWaiters = this.eventWaiters.filter((w) => {
          if (w.method !== msg.method) return true;
          clearTimeout(w.timer);
          w.resolveFn(msg.params);
          return false;
        });
      }
    });
  }

  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolveFn, rejectFn) => {
      ws.addEventListener('open', resolveFn, { once: true });
      ws.addEventListener('error', () => rejectFn(new Error('websocket connect failed: ' + url)), { once: true });
    });
    return new CdpPage(ws);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolveFn, rejectFn) => {
      const timer = setTimeout(() => {
        if (this.pending.delete(id)) rejectFn(new Error('cdp timeout: ' + method));
      }, NAV_TIMEOUT_MS * 2);
      this.pending.set(id, {
        resolveFn: (v) => { clearTimeout(timer); resolveFn(v); },
        rejectFn: (e) => { clearTimeout(timer); rejectFn(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  waitEvent(method, timeoutMs = NAV_TIMEOUT_MS) {
    return new Promise((resolveFn, rejectFn) => {
      const timer = setTimeout(() => {
        this.eventWaiters = this.eventWaiters.filter((w) => w.resolveFn !== resolveFn);
        rejectFn(new Error('timeout waiting for event ' + method));
      }, timeoutMs);
      this.eventWaiters.push({ method, resolveFn, timer });
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (result.exceptionDetails) {
      throw new Error('page eval failed: ' +
        JSON.stringify(result.exceptionDetails).slice(0, 500));
    }
    return result.result.value;
  }

  async closeTarget(cdpPort) {
    try { this.ws.close(); } catch {}
    if (this.targetId) {
      await fetch('http://127.0.0.1:' + cdpPort + '/json/close/' + this.targetId).catch(() => {});
    }
  }
}

export async function bootChrome(chromePath) {
  const port = await freePort();
  const profile = join(tmpdir(), 'wizard-a11y-' + Date.now() + '-' +
    Math.random().toString(36).slice(2));
  const child = spawn(chromePath, [
    '--headless',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + profile,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1400,920',
    '--enable-unsafe-swiftshader',
    '--autoplay-policy=no-user-gesture-required',
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  child.stderr.resume();
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const version = await getJson('http://127.0.0.1:' + port + '/json/version');
      return { child, port, browser: version.Browser || 'unknown', profile };
    } catch {
      await sleep(150);
    }
  }
  child.kill('SIGKILL');
  throw new Error('chrome did not expose a loopback CDP endpoint on port ' + port +
    '; probe: chromePath=' + chromePath);
}

async function settle(page, readiness) {
  const deadline = Date.now() + NAV_TIMEOUT_MS;
  if (readiness === 'dashboard-cards') {
    while (Date.now() < deadline) {
      const count = await page.evaluate(
        "document.readyState === 'complete' ? document.querySelectorAll('#module-groups .card').length : -1"
      ).catch(() => -1);
      if (count >= 9) break;
      await sleep(150);
    }
  }
  while (Date.now() < deadline) {
    const ready = await page.evaluate("document.readyState === 'complete'").catch(() => false);
    if (ready) break;
    await sleep(100);
  }
  await sleep(SETTLE_MS);
  await page.evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
}

export async function openSurface(cdpPort, surface, baseUrl) {
  const target = await newTarget(cdpPort, 'about:blank');
  const page = await CdpPage.connect(target.webSocketDebuggerUrl);
  page.targetId = target.id;
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Emulation.setDeviceMetricsOverride', {
    width: VIEWPORT_WIDE.width,
    height: VIEWPORT_WIDE.height,
    deviceScaleFactor: 1,
    mobile: false
  });
  const loadPromise = page.waitEvent('Page.loadEventFired').catch(() => null);
  await page.send('Page.navigate', { url: baseUrl + surface.path });
  await loadPromise;
  await settle(page, surface.readiness);
  return page;
}

const COLLECT_CANDIDATES = `(() => {
  const selector = 'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]';
  const nodes = Array.from(document.querySelectorAll(selector)).filter((el) => {
    if (el.getAttribute('tabindex') === '-1') return false;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  });
  window.__a11yCandidates = nodes;
  window.__a11yBaseline = nodes.map((el) => {
    const cs = getComputedStyle(el);
    const host = el.closest('[data-module], article.card, section.collection, form, fieldset');
    const hcs = host && host !== el ? getComputedStyle(host) : null;
    return {
      outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth,
      boxShadow: cs.boxShadow, borderColor: cs.borderColor,
      backgroundColor: cs.backgroundColor, color: cs.color,
      hostBoxShadow: hcs ? hcs.boxShadow : null,
      hostBorderColor: hcs ? hcs.borderColor : null,
      hostBackgroundColor: hcs ? hcs.backgroundColor : null
    };
  });
  return nodes.map((el) => ({
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    href: el.getAttribute('href'),
    tabindex: el.getAttribute('tabindex')
  }));
})()`;

const FOCUS_STATE = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  el.setAttribute('data-a11y-focus-hit', '1');
  const idx = window.__a11yCandidates.indexOf(el);
  const base = idx >= 0 ? window.__a11yBaseline[idx] : null;
  const cs = getComputedStyle(el);
  const host = el.closest('[data-module], article.card, section.collection, form, fieldset');
  const hcs = host && host !== el ? getComputedStyle(host) : null;
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 48),
    focusVisible: (() => { try { return el.matches(':focus-visible'); } catch { return false; } })(),
    ownOutline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
    boxShadow: cs.boxShadow !== 'none',
    borderColorChanged: base ? cs.borderColor !== base.borderColor : null,
    colorChanged: base ? cs.color !== base.color : null,
    backgroundColorChanged: base ? cs.backgroundColor !== base.backgroundColor : null,
    hostIndicator: (base && hcs) ? (
      hcs.boxShadow !== base.hostBoxShadow ||
      hcs.borderColor !== base.hostBorderColor ||
      hcs.backgroundColor !== base.hostBackgroundColor
    ) : null
  };
})()`;

const UNREACHABLE_CANDIDATES = `(() => {
  const describe = (el) => el.tagName.toLowerCase() +
    (el.id ? '#' + el.id : '') +
    (el.getAttribute('href') ? '[' + el.getAttribute('href') + ']' : '') +
    ((el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '');
  return window.__a11yCandidates
    .filter((el) => !el.hasAttribute('data-a11y-focus-hit'))
    .map(describe);
})()`;

const LANDMARK_CHECKS = `(() => {
  const q = (s) => Array.from(document.querySelectorAll(s));
  const nameOf = (el) => {
    const labelledby = el.getAttribute('aria-labelledby');
    if (labelledby) {
      const joined = labelledby.split(/\\s+/).map((id) => document.getElementById(id))
        .filter(Boolean).map((n) => n.textContent.trim()).join(' ').trim();
      if (joined) return joined;
    }
    const label = el.getAttribute('aria-label');
    if (label && label.trim()) return label.trim();
    const tag = el.tagName;
    if (tag === 'A' || tag === 'BUTTON' || tag === 'SUMMARY') {
      const innerImg = el.querySelector('img[alt]');
      const text = (el.textContent || '').trim() || (innerImg ? innerImg.alt : '');
      if (text) return text.slice(0, 80);
    }
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
      const byFor = el.id ? document.querySelector('label[for="' + CSS.escape(el.id) + '"]') : null;
      const owner = byFor || el.closest('label');
      const text = owner ? owner.textContent.trim() : '';
      if (text) return text.slice(0, 80);
    }
    const title = el.getAttribute('title');
    if (title && title.trim()) return title.trim();
    return '';
  };
  const interactive = q('a[href], button:not([disabled]), input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([disabled]), select:not([disabled]), textarea:not([disabled])');
  const imgs = q('img');
  const unlabeledControls = q('input:not([type="hidden"]), select, textarea').filter((el) => {
    if (el.type === 'submit' || el.type === 'button') return false;
    return !(el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]')) &&
      !el.closest('label') &&
      !(el.getAttribute('aria-label') || '').trim() &&
      !el.getAttribute('aria-labelledby') &&
      !(el.getAttribute('title') || '').trim();
  });
  const idCounts = new Map();
  q('[id]').forEach((el) => idCounts.set(el.id, (idCounts.get(el.id) || 0) + 1));
  const headings = q('h1, h2, h3, h4, h5, h6').map((h) => Number(h.tagName[1]));
  let monotonic = true;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) { monotonic = false; break; }
  }
  return {
    lang: document.documentElement.getAttribute('lang'),
    title: document.title || '',
    mainCount: q('main,[role="main"]').length,
    headerCount: q('header,[role="banner"]').length,
    footerCount: q('footer,[role="contentinfo"]').length,
    navCount: q('nav,[role="navigation"]').length,
    skipLinkPresent: !!q('a[href^="#"]').find((a) =>
      /skip/i.test(a.textContent || '') || /skip/i.test(a.className || '')),
    h1Count: q('h1').length,
    headingSkips: !monotonic,
    imgCount: imgs.length,
    imgsMissingAlt: imgs.filter((img) => img.getAttribute('alt') === null)
      .map((img) => (img.src || '').split('/').pop().slice(0, 60)),
    interactiveCount: interactive.length,
    unnamedInteractive: interactive.filter((el) => !nameOf(el)).slice(0, 8)
      .map((el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
        ((el.className && typeof el.className === 'string')
          ? ' "' + el.className.slice(0, 30) + '"'
          : '')),
    unlabeledControls: unlabeledControls.slice(0, 8)
      .map((el) => el.tagName.toLowerCase() + '[type=' + (el.type || '?') + ']' + (el.id ? '#' + el.id : '')),
    iframeCount: q('iframe').length,
    iframesMissingTitle: q('iframe').filter((f) => !f.getAttribute('title')).length,
    canvases: q('canvas').length,
    canvasesUnlabelled: q('canvas').filter((c) =>
      !(c.getAttribute('role') && (c.getAttribute('aria-label') || c.getAttribute('aria-labelledby')))).length,
    duplicateIds: Array.from(idCounts.entries()).filter(([, n]) => n > 1)
      .map(([id, n]) => id + ' x' + n).slice(0, 4),
    positiveTabIndex: q('[tabindex]').filter((el) => Number(el.getAttribute('tabindex')) > 0)
      .map((el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
        ' tabindex=' + el.getAttribute('tabindex'))
  };
})()`;

const MOTION_SAMPLE = `(() => {
  const nodes = Array.from(document.querySelectorAll('body *')).slice(0, 1200);
  const animated = [];
  for (const el of nodes) {
    const cs = getComputedStyle(el);
    const ad = cs.animationName !== 'none' && cs.animationDuration !== '0s';
    const td = parseFloat(cs.transitionDuration) > 0 || parseFloat(cs.transitionDelay) > 0;
    if (ad || td) animated.push(el);
  }
  const maxDuration = animated.reduce((max, el) => {
    const cs = getComputedStyle(el);
    return Math.max(max, parseFloat(cs.animationDuration) || 0, parseFloat(cs.transitionDuration) || 0);
  }, 0);
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  return {
    matchMediaReduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
    animatedCount: animated.length,
    animationCount: animated.filter((el) => getComputedStyle(el).animationName !== 'none').length,
    maxDurationSeconds: maxDuration,
    revealElements: revealEls.length,
    revealAllVisible: revealEls.every((el) => parseFloat(getComputedStyle(el).opacity) > 0.99)
  };
})()`;

const OVERFLOW_CHECK = `(expectedWidth) => {
  const doc = document.documentElement;
  const scroller = document.scrollingElement || doc;
  const offenders = [];
  const nodes = Array.from(document.querySelectorAll('body *')).slice(0, 1500);
  for (const el of nodes) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.right > expectedWidth + 1 && rect.width < expectedWidth * 4) {
      offenders.push(el.tagName.toLowerCase() +
        (el.id ? '#' + el.id : '') +
        ' right=' + Math.round(rect.right) + ' w=' + Math.round(rect.width) +
        ((el.className && typeof el.className === 'string')
          ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.')
          : ''));
      if (offenders.length >= 5) break;
    }
  }
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    scrollWidthDoc: doc.scrollWidth,
    scrollWidthScroller: scroller.scrollWidth,
    scrollWidthBody: document.body ? document.body.scrollWidth : null,
    offenders
  };
}`;

const LAYOUT_1280_CHECK = `(isDashboard) => {
  const grid = document.querySelector('#module-groups .grid');
  const gridStyles = grid ? getComputedStyle(grid) : null;
  const firstSection = document.querySelector('#module-groups section');
  return {
    cardCount: document.querySelectorAll('#module-groups .card').length,
    gridColumns: gridStyles ? (gridStyles.gridTemplateColumns || '').split(' ').filter(Boolean).length : 0,
    moduleGroupsTop: firstSection
      ? Math.round(firstSection.getBoundingClientRect().top + window.scrollY)
      : null,
    contentHeight: Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement.scrollHeight
    ),
    bodyRendered: Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement.scrollHeight
    ) > 200
  };
}`;

async function setViewport(page, viewport) {
  await page.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false
  });
  await page.evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
}

async function walkKeyboard(page) {
  const candidateList = await page.evaluate(COLLECT_CANDIDATES);
  await page.evaluate("document.querySelectorAll('[data-a11y-focus-hit]').forEach((el) => el.removeAttribute('data-a11y-focus-hit'))");
  const focusStates = [];
  const maxTabs = Math.min(candidateList.length + 6, 70);
  let previousKey = '';
  let nullStreak = 0;
  for (let tab = 0; tab < maxTabs; tab++) {
    await page.send('Input.dispatchKeyEvent', {
      type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9
    });
    await page.send('Input.dispatchKeyEvent', {
      type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9
    });
    await page.evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
    const state = await page.evaluate(FOCUS_STATE);
    if (!state) {
      if (++nullStreak >= 3) break;
      continue;
    }
    nullStreak = 0;
    const key = state.tag + '|' + (state.id || '') + '|' + state.text;
    focusStates.push(state);
    if (key === previousKey) break;
    previousKey = key;
  }
  const unreachable = await page.evaluate(UNREACHABLE_CANDIDATES);
  await page.evaluate("window.__a11yCandidates && window.__a11yCandidates.forEach((el) => el.removeAttribute('data-a11y-focus-hit'))");
  return { candidateCount: candidateList.length, unreachable, focusStates, tabsPressed: focusStates.length };
}

async function screenshot(page) {
  await sleep(250);
  const shot = await page.send('Page.captureScreenshot', { format: 'png' });
  return Buffer.from(shot.data, 'base64');
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const attempt = current ? current + ' ' + word : word;
    if (ctx.measureText(attempt).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = attempt;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function withComposerPage(cdpPort, fn) {
  const target = await newTarget(cdpPort, 'about:blank#composer');
  const page = await CdpPage.connect(target.webSocketDebuggerUrl);
  page.targetId = target.id;
  try {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 1440, height: 2600, deviceScaleFactor: 1, mobile: false
    });
    return await fn(page);
  } finally {
    await page.closeTarget(cdpPort);
  }
}

async function composeLabelledCapture(cdpPort, pngBuffer, result, viewport) {
  const dataUrl = 'data:image/png;base64,' + pngBuffer.toString('base64');
  const bannerLines = [];
  for (const name of AUTOMATED_CHECKS) {
    const check = result.checks[name];
    if (check.status === 'manual') continue;
    bannerLines.push(check.status.toUpperCase() + ' ' + name +
      (check.findings.length ? ' — ' + check.findings.join('; ') : ''));
  }
  for (const name of MANUAL_CHECKS.map((m) => m.name)) {
    bannerLines.push('MANUAL ' + name);
  }
  const counts = summarizeOne(result);
  const verdictLine = result.slug + ' @ ' + viewport.width + 'x' + viewport.height +
    ' — PASS ' + counts.pass + ' / FAIL ' + counts.fail + ' / MANUAL ' + counts.manual +
    ' (banner drawn over capture region; raw region below header)';
  const payload = JSON.stringify(JSON.stringify({
    dataUrl, bannerLines, verdictLine, width: viewport.width, height: viewport.height
  }));
  return withComposerPage(cdpPort, async (page) => {
    const v = await page.evaluate(`(async () => {
    const cfg = JSON.parse(${payload});
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '12px Menlo, monospace';
    const wrapped = [];
    for (const raw of cfg.bannerLines) wrapped.push(...wrapLines(ctx, raw, cfg.width - 20));
    const lineH = 15;
    const bannerH = 30 + wrapped.length * lineH + 14;
    const img = new Image();
    await new Promise((resolveFn, rejectFn) => {
      img.onload = resolveFn;
      img.onerror = rejectFn;
      img.src = cfg.dataUrl;
    });
    canvas.width = cfg.width;
    canvas.height = cfg.height + bannerH;
    ctx.fillStyle = '#101418';
    ctx.fillRect(0, 0, canvas.width, bannerH);
    ctx.fillStyle = '#e8e3d5';
    ctx.font = 'bold 12px Menlo, monospace';
    ctx.fillText(cfg.verdictLine, 10, 20);
    ctx.font = '12px Menlo, monospace';
    ctx.fillStyle = '#b8b2a4';
    wrapped.forEach((line, i) => ctx.fillText(line, 10, 38 + i * lineH));
    ctx.drawImage(img, 0, bannerH);
    return { dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
    function wrapLines(context, text, maxWidth) {
      const out = [];
      let cur = '';
      for (const word of String(text).split(' ')) {
        const attempt = cur ? cur + ' ' + word : word;
        if (context.measureText(attempt).width > maxWidth && cur) { out.push(cur); cur = word; }
        else cur = attempt;
      }
      if (cur) out.push(cur);
      return out;
    }
  })()`);
    return {
      buffer: Buffer.from(v.dataUrl.split(',')[1], 'base64'),
      width: v.width,
      height: v.height
    };
  });
}

async function buildContactSheet(cdpPort, results) {
  const tiles = results.map((r, i) => ({
    label: String(i + 1).padStart(2, '0') + ' ' + r.slug + ' — PASS ' +
      summarizeOne(r).pass + ' / FAIL ' + summarizeOne(r).fail + ' / MANUAL ' + summarizeOne(r).manual,
    dataUrl: 'data:image/png;base64,' + r._widePng.toString('base64')
  }));
  const payload = JSON.stringify(JSON.stringify({ tiles }));
  const meta = await withComposerPage(cdpPort, async (page) => {
    const v = await page.evaluate(`(async () => {
    const cfg = JSON.parse(${payload});
    const thumbW = 622;
    const thumbH = 389;
    const pad = 8;
    const gapX = 12;
    const gapY = 10;
    const labelH = 26;
    const cols = 2;
    const rows = Math.ceil(cfg.tiles.length / cols);
    const sheetW = pad * 3 + thumbW * cols + gapX;
    const sheetH = pad * 2 + rows * (thumbH + labelH + gapY);
    const canvas = document.createElement('canvas');
    canvas.width = sheetW;
    canvas.height = sheetH;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#171b20';
    ctx.fillRect(0, 0, sheetW, sheetH);
    ctx.font = '12px Menlo, monospace';
    for (let i = 0; i < cfg.tiles.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = pad + col * (thumbW + gapX);
      const y = pad + row * (thumbH + labelH + gapY);
      ctx.fillStyle = '#101418';
      ctx.fillRect(x, y, thumbW, labelH);
      ctx.fillStyle = '#e8e3d5';
      ctx.fillText(truncate(ctx, cfg.tiles[i].label, thumbW - 16), x + 8, y + 17);
      const img = new Image();
      await new Promise((resolveFn, rejectFn) => {
        img.onload = resolveFn;
        img.onerror = rejectFn;
        img.src = cfg.tiles[i].dataUrl;
      });
      ctx.drawImage(img, x, y + labelH, thumbW, thumbH);
      ctx.strokeStyle = '#2c333b';
      ctx.strokeRect(x + 0.5, y + labelH + 0.5, thumbW - 1, thumbH - 1);
    }
    return { dataUrl: canvas.toDataURL('image/png'), width: sheetW, height: sheetH };
    function truncate(context, text, maxWidth) {
      let out = String(text);
      while (out.length > 4 && context.measureText(out).width > maxWidth) out = out.slice(0, -5) + '…';
      return out;
    }
  })()`);
    return {
      buffer: Buffer.from(v.dataUrl.split(',')[1], 'base64'),
      width: v.width,
      height: v.height
    };
  });
  return meta;
}

function summarizeOne(result) {
  const counts = { pass: 0, fail: 0, manual: 0 };
  for (const check of Object.values(result.checks)) counts[check.status]++;
  return counts;
}

async function auditSurface(page, surface, { cdpPort, captureDir, log }) {
  await setViewport(page, VIEWPORT_WIDE);

  const land = await page.evaluate(LANDMARK_CHECKS);
  const layoutWide = await evalPageFn(page, LAYOUT_1280_CHECK, surface.id === 'wizard.dashboard');
  const walk = await walkKeyboard(page);

  const keyboardFindings = [];
  for (const u of walk.unreachable) keyboardFindings.push('not reachable via Tab: ' + u);
  for (const p of land.positiveTabIndex) keyboardFindings.push('positive tabindex: ' + p);
  if (surface.id === 'wizard.dashboard' && !land.skipLinkPresent) {
    keyboardFindings.push('no skip link detected on dashboard');
  }

  const noIndicator = walk.focusStates.filter((s) =>
    !s.ownOutline && !s.boxShadow &&
    s.borderColorChanged !== true && s.colorChanged !== true &&
    s.backgroundColorChanged !== true && s.hostIndicator !== true);
  const focusFindings = noIndicator.slice(0, 6).map((s) =>
    'no visible focus indicator: ' + s.tag + (s.id ? '#' + s.id : '') + ' "' + s.text.slice(0, 32) + '"');

  const landmarkFindings = [];
  if (!land.lang) landmarkFindings.push('<html> missing lang attribute');
  if (!land.title.trim()) landmarkFindings.push('empty <title>');
  if (land.mainCount === 0) landmarkFindings.push('no <main> or [role=main] landmark');
  if (land.h1Count === 0) landmarkFindings.push('no <h1> heading');
  if (land.headingSkips) landmarkFindings.push('heading levels skip');
  for (const m of land.imgsMissingAlt) landmarkFindings.push('img missing alt attribute: ' + m);
  for (const u of land.unnamedInteractive) landmarkFindings.push('interactive element without accessible name: ' + u);
  for (const u of land.unlabeledControls) landmarkFindings.push('form control without label association: ' + u);
  if (land.iframesMissingTitle > 0) landmarkFindings.push(land.iframesMissingTitle + ' iframe(s) missing title');
  for (const d of land.duplicateIds) landmarkFindings.push('duplicate id: ' + d);

  const motionBaseline = await page.evaluate(MOTION_SAMPLE);
  await page.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  const motionReduced = await page.evaluate(MOTION_SAMPLE);
  await page.send('Emulation.setEmulatedMedia', { features: [] });

  const motionNotes = [];
  let motionStatus = 'manual';
  if (!motionReduced.matchMediaReduce) {
    motionStatus = 'manual';
    motionNotes.push('emulation sanity failed: prefers-reduced-motion did not report reduce under emulation');
  } else if (motionBaseline.animatedCount === 0) {
    motionStatus = 'manual';
    motionNotes.push('no DOM-animated elements detected at sample time; canvas/WebGL loops are out of scope for an automated pass');
  } else if (motionReduced.maxDurationSeconds <= 0.05) {
    motionStatus = 'pass';
    motionNotes.push('every sampled animated element reports <= 0.05s duration under reduce');
    if (motionBaseline.revealElements > 0) {
      motionNotes.push('.reveal elements fully visible under reduce');
    }
  } else {
    motionStatus = 'fail';
    motionNotes.push('sampled animated elements declare durations exceeding 0.05s under reduce');
  }

  await setViewport(page, VIEWPORT_NARROW);
  const narrowOverflow = await evalPageFn(page, OVERFLOW_CHECK, VIEWPORT_NARROW.width);
  const overflowFindings = [];
  if (Math.abs(narrowOverflow.innerWidth - VIEWPORT_NARROW.width) > 1) {
    overflowFindings.push('viewport proof failed: innerWidth=' + narrowOverflow.innerWidth);
  }
  const narrowMaxScroll = Math.max(
    narrowOverflow.scrollWidthDoc,
    narrowOverflow.scrollWidthScroller,
    narrowOverflow.scrollWidthBody || 0
  );
  if (narrowMaxScroll > VIEWPORT_NARROW.width) {
    for (const o of narrowOverflow.offenders) overflowFindings.push('horizontal overflow at 375px: ' + o);
    if (!narrowOverflow.offenders.length) {
      overflowFindings.push('horizontal overflow at 375px: scrollWidth=' + narrowMaxScroll);
    }
  }

  await setViewport(page, VIEWPORT_WIDE);
  const wideOverflow = await evalPageFn(page, OVERFLOW_CHECK, VIEWPORT_WIDE.width);
  const layoutFindings = [];
  if (wideOverflow.scrollWidthDoc > VIEWPORT_WIDE.width) {
    layoutFindings.push('horizontal overflow at 1280px: scrollWidth=' + wideOverflow.scrollWidthDoc);
  }
  if (!layoutWide.bodyRendered) {
    layoutFindings.push('rendered content height suspiciously small: ' + layoutWide.contentHeight + 'px');
  }
  if (surface.id === 'wizard.dashboard' && layoutWide.cardCount !== 9) {
    layoutFindings.push('expected 9 dashboard cards, saw ' + layoutWide.cardCount);
  }

  const result = {
    id: surface.id,
    slug: surface.slug,
    title: surface.title,
    path: surface.path,
    reached: true,
    checks: {}
  };

  result.checks['keyboard-reachability'] = {
    status: keyboardFindings.length ? 'fail' : 'pass',
    findings: keyboardFindings,
    notes: [],
    measured: {
      candidates: walk.candidateCount,
      tabsPressed: walk.tabsPressed,
      focusedDistinct: walk.focusStates.length
    }
  };
  result.checks['focus-visibility'] = {
    status: focusFindings.length ? 'fail' : 'pass',
    findings: focusFindings,
    notes: ['heuristic: own outline/box-shadow, or computed style delta on the element or its card/collection host'],
    measured: { focusedSampled: walk.focusStates.length, withoutIndicator: noIndicator.length }
  };
  result.checks['landmarks-names'] = {
    status: landmarkFindings.length ? 'fail' : 'pass',
    findings: landmarkFindings,
    notes: [],
    measured: {
      lang: land.lang || null,
      titleChars: land.title.length,
      main: land.mainCount,
      header: land.headerCount,
      footer: land.footerCount,
      nav: land.navCount,
      h1: land.h1Count,
      images: land.imgCount,
      imgsMissingAlt: land.imgsMissingAlt.length,
      interactive: land.interactiveCount,
      unnamedInteractive: land.unnamedInteractive.length,
      canvases: land.canvases,
      canvasesUnlabelled: land.canvasesUnlabelled
    }
  };
  result.checks['reduced-motion'] = {
    status: motionStatus,
    findings: motionStatus === 'fail'
      ? ['motion persists under reduce; sampled elements declare durations > 0.05s']
      : [],
    notes: motionNotes,
    measured: {
      domAnimatedSampled: motionBaseline.animatedCount > 0 ? 'nonzero' : 'none-at-sample-time',
      reducedMaxDurationBucket: motionReduced.maxDurationSeconds <= 0.05 ? '<=0.05s' : '>0.05s'
    }
  };
  result.checks['overflow-375'] = {
    status: overflowFindings.length ? 'fail' : 'pass',
    findings: overflowFindings,
    notes: [],
    measured: {
      innerWidth: narrowOverflow.innerWidth,
      innerHeight: narrowOverflow.innerHeight,
      scrollWidth: narrowMaxScroll
    }
  };
  result.checks['layout-1280'] = {
    status: layoutFindings.length ? 'fail' : 'pass',
    findings: layoutFindings,
    notes: [],
    measured: {
      innerWidth: wideOverflow.innerWidth,
      scrollWidth: wideOverflow.scrollWidthDoc,
      gridColumns: layoutWide.gridColumns,
      dashboardCards: surface.id === 'wizard.dashboard' ? layoutWide.cardCount : null,
      contentHeight: layoutWide.contentHeight
    }
  };
  for (const manual of MANUAL_CHECKS) {
    result.checks[manual.name] = { status: 'manual', findings: [], notes: [manual.note] };
  }

  if (captureDir) {
    const narrowPng = await screenshot(page);
    await setViewport(page, VIEWPORT_WIDE);
    const widePng = await screenshot(page);
    const composite = await composeLabelledCapture(cdpPort, narrowPng, result, VIEWPORT_NARROW);
    const file = join(captureDir, surface.slug + '-375-labelled.png');
    writeFileSync(file, composite.buffer);
    result._widePng = widePng;
    log(surface.slug + ': labelled 375 composite written (' + composite.width + 'x' + composite.height + ')');
  }

  return result;
}

export async function runAudit({ chromePath, surfaces, root, captureDir = null, log = () => {} } = {}) {
  if (!chromePath) throw new Error('chromePath required');
  const { server, port, portSource } = await startStaticServer({ root });
  let chrome = null;
  try {
    chrome = await bootChrome(chromePath);
    log('chrome ' + chrome.browser + ' | cdp 127.0.0.1:' + chrome.port +
      ' | static server 127.0.0.1:' + port + ' (' + portSource + ')');
    const results = [];
    for (const surface of surfaces) {
      const page = await openSurface(chrome.port, surface, 'http://127.0.0.1:' + port);
      try {
        const result = await auditSurface(page, surface, {
          cdpPort: chrome.port, captureDir, log
        });
        results.push(result);
        log(surface.slug + ': ' +
          Object.entries(result.checks).map(([k, v]) => k + '=' + v.status).join(', '));
      } finally {
        await page.closeTarget(chrome.port);
      }
    }
    if (captureDir) {
      const sheet = await buildContactSheet(chrome.port, results);
      writeFileSync(join(captureDir, 'contact-sheet-1280.png'), sheet.buffer);
      log('contact sheet written (' + sheet.width + 'x' + sheet.height + ')');
    }
    return results;
  } finally {
    if (chrome) chrome.child.kill('SIGKILL');
    server.close();
  }
}

export function summarize(results) {
  const totals = { pass: 0, fail: 0, manual: 0 };
  for (const r of results) {
    for (const check of Object.values(r.checks)) totals[check.status]++;
  }
  return totals;
}

const CHECK_ORDER = [
  ...AUTOMATED_CHECKS,
  ...MANUAL_CHECKS.map((m) => m.name)
];

export function buildMatrixJson(results) {
  const clean = results.map((r) => {
    const { _widePng, ...rest } = r;
    void _widePng;
    return rest;
  });
  return JSON.stringify({
    schema: 'wizard.accessibility-matrix.v1',
    generatedBy: 'scripts/accessibility-layout-check.mjs',
    viewports: { narrow: VIEWPORT_NARROW, wide: VIEWPORT_WIDE },
    surfaces: clean,
    summary: summarize(results)
  }, null, 2) + '\n';
}

function shortName(name) {
  switch (name) {
    case 'keyboard-reachability': return 'keyboard';
    case 'focus-visibility': return 'focus';
    case 'landmarks-names': return 'landmarks/names';
    case 'reduced-motion': return 'reduced-motion';
    case 'overflow-375': return 'overflow@375';
    case 'layout-1280': return 'layout@1280';
    case 'screen-reader semantics (AT pass)': return 'AT pass';
    case 'color contrast ratios': return 'contrast';
    case 'focus order sensibility beyond reachability': return 'focus order';
    default: return name;
  }
}

function badge(status) {
  return status === 'pass' ? 'PASS' : status === 'fail' ? 'FAIL' : 'MANUAL';
}

export function buildMatrixMarkdown(results) {
  const lines = [];
  lines.push('# Accessibility and responsive-layout matrix');
  lines.push('');
  lines.push('Generated by `scripts/accessibility-layout-check.mjs` against live pages served over loopback.');
  lines.push('Regenerate with `node scripts/accessibility-layout-check.mjs --write`.');
  lines.push('Viewports: ' + VIEWPORT_NARROW.width + 'x' + VIEWPORT_NARROW.height + ' (narrow), ' +
    VIEWPORT_WIDE.width + 'x' + VIEWPORT_WIDE.height + ' (wide).');
  lines.push('');
  const totals = summarize(results);
  lines.push('Totals across ' + results.length + ' surfaces: **' + totals.pass + ' PASS**, **' +
    totals.fail + ' FAIL**, **' + totals.manual + ' MANUAL**. Automated checks that cannot run here stay MANUAL; nothing passes by omission.');
  lines.push('');
  lines.push('| Surface | ' + CHECK_ORDER.map(shortName).join(' | ') + ' |');
  lines.push('|---|' + CHECK_ORDER.map(() => ':---:').join('|') + '|');
  for (const r of results) {
    const cells = CHECK_ORDER.map((name) => {
      const check = r.checks[name];
      return check ? badge(check.status) : 'n/a';
    });
    lines.push('| ' + r.title.replace(/\|/g, '\\|') + ' (`' + r.slug + '`) | ' + cells.join(' | ') + ' |');
  }
  lines.push('');
  for (const r of results) {
    lines.push('## ' + r.title + ' — `' + r.path + '`');
    lines.push('');
    for (const name of CHECK_ORDER) {
      const check = r.checks[name];
      if (!check) continue;
      lines.push('- **' + shortName(name) + '**: ' + badge(check.status) +
        (check.measured ? ' · `' + JSON.stringify(check.measured) + '`' : ''));
      for (const f of check.findings) lines.push('  - finding: ' + f.replace(/\|/g, '\\|'));
      for (const n of check.notes || []) lines.push('  - note: ' + n.replace(/\|/g, '\\|'));
    }
    lines.push('- capture: `evidence/accessibility/' + r.slug + '-375-labelled.png` (raw region ' +
      VIEWPORT_NARROW.width + 'x' + VIEWPORT_NARROW.height + ' beneath a findings banner; viewport proof in the overflow@375 measurement above)');
    lines.push('');  }
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = { mode: 'check' };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--write') args.mode = 'write';
    else if (argv[i] === '--help' || argv[i] === '-h') args.mode = 'help';
  }
  return args;
}

export async function main(argv = process.argv) {
  const args = parseArgs(argv);
  if (args.mode === 'help') {
    console.log('usage: node scripts/accessibility-layout-check.mjs [--write]');
    return 0;
  }
  const chromePath = discoverChrome();
  if (!chromePath) {
    console.error('FAIL driver precondition: no Chrome/Chromium runtime available');
    console.error('probe: CHROME_BIN=' + (process.env.CHROME_BIN || 'unset') +
      ', platform=' + process.platform);
    return 1;
  }
  const surfaces = collectDashboardSurfaces();
  console.log('surfaces: ' + surfaces.length + ' (' + surfaces.map((s) => s.slug).join(', ') + ')');
  const captureDir = args.mode === 'write'
    ? join(REPO_ROOT, 'evidence', 'accessibility')
    : null;
  if (captureDir) mkdirSync(captureDir, { recursive: true });
  const started = Date.now();
  const results = await runAudit({
    chromePath,
    surfaces,
    captureDir,
    log: (m) => console.log('  ' + m)
  });
  const totals = summarize(results);
  console.log('summary in ' + ((Date.now() - started) / 1000).toFixed(1) + 's: PASS ' +
    totals.pass + ', FAIL ' + totals.fail + ', MANUAL ' + totals.manual);
  if (args.mode === 'write') {
    writeFileSync(join(captureDir, 'matrix.json'), buildMatrixJson(results));
    writeFileSync(
      join(REPO_ROOT, 'docs', 'visual', 'ACCESSIBILITY_RESPONSIVE_MATRIX.md'),
      buildMatrixMarkdown(results)
    );
    console.log('wrote evidence/accessibility/matrix.json and docs/visual/ACCESSIBILITY_RESPONSIVE_MATRIX.md');
  }
  for (const r of results) {
    for (const [name, check] of Object.entries(r.checks)) {
      if (check.status !== 'fail') continue;
      console.log('FINDING ' + r.slug + ' / ' + name + ':');
      for (const f of check.findings) console.log('  - ' + f);
    }
  }
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const code = await main();
  process.exit(code);
}
