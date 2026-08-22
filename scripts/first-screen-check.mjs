import { spawn } from 'node:child_process';
import { accessSync, constants, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);

export function probeBrowserRuntime() {
  const probe = CHROME_CANDIDATES.map((path) => {
    let usable = false;
    try {
      accessSync(path, constants.X_OK);
      usable = true;
    } catch {
      usable = false;
    }
    return { path, usable };
  });
  return {
    candidates: probe,
    found: probe.find((p) => p.usable) ?? null
  };
}

const DEFAULT_IDENTITY_TOKENS = [
  'Verdigris Systems Laboratory',
  'Workbench for Integration, Zones, Annotation & Resource Design'
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDebugTarget(port, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await res.json();
      const page = tabs.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error(`no Chrome debug target appeared on 127.0.0.1:${port} within ${timeoutMs}ms`);
}

class CdpSession {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(`${msg.error.message}`));
        else resolve(msg.result);
        return;
      }
      if (msg.method) this.events.push(msg);
    });
  }

  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', () => reject(new Error('websocket error')), { once: true });
    });
    return new CdpSession(ws);
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.nextId;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async waitEvent(method, timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs;
    let idx = this.events.findIndex((e) => e.method === method);
    while (idx === -1 && Date.now() < deadline) {
      await sleep(50);
      idx = this.events.findIndex((e) => e.method === method);
    }
    if (idx === -1) throw new Error(`timed out waiting for CDP event ${method}`);
    return this.events.splice(idx, 1)[0];
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

function readPngSize(bytes) {
  if (bytes.length < 24 || bytes[0] !== 0x89 || bytes[1] !== 0x50) {
    throw new Error('capture is not a PNG');
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

export async function runFirstScreenCheck(options) {
  const opts = {
    url: 'http://127.0.0.1:8165/',
    width: 1280,
    height: 800,
    maxTop: 800,
    cdpPort: 8166,
    screenshotPath: null,
    metadataPath: null,
    identityTokens: DEFAULT_IDENTITY_TOKENS,
    settleMs: 900,
    userDataDir: `/tmp/wizard-first-screen-${process.pid}`,
    ...options
  };

  const runtime = probeBrowserRuntime();
  if (!runtime.found) {
    return {
      verdict: 'FAIL',
      reasons: ['BROWSER_RUNTIME_MISSING'],
      detail: `probe output: ${JSON.stringify(runtime.candidates)}`,
      browser: null,
      metadata: null
    };
  }

  const chrome = spawn(runtime.found.path, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    `--remote-debugging-port=${opts.cdpPort}`,
    '--user-data-dir=' + opts.userDataDir,
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  try {
    const wsUrl = await waitForDebugTarget(opts.cdpPort);
    const session = await CdpSession.connect(wsUrl);

    await session.send('Page.enable');
    const browserInfo = await session.send('Browser.getVersion');
    await session.send('Emulation.setDeviceMetricsOverride', {
      width: opts.width,
      height: opts.height,
      deviceScaleFactor: 1,
      mobile: false
    });

    const loaded = session.waitEvent('Page.loadEventFired').catch(() => null);
    await session.send('Page.navigate', { url: opts.url });
    await loaded;
    await sleep(opts.settleMs);
    await session.send('Runtime.evaluate', {
      expression: 'new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))',
      awaitPromise: true
    });

    const metricsResult = await session.send('Runtime.evaluate', {
      expression: `
        (() => {
          const groups = document.querySelector('#module-groups');
          return JSON.stringify({
            url: location.href,
            title: document.title,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            bodyScrollWidth: document.body ? document.body.scrollWidth : null,
            groupsFound: Boolean(groups),
            groupsTop: groups ? Math.round(groups.getBoundingClientRect().top) : null
          });
        })()
      `,
      returnByValue: true
    });
    const dom = JSON.parse(metricsResult.result.value);

    const bodyTextResult = await session.send('Runtime.evaluate', {
      expression: 'document.body.innerText',
      returnByValue: true
    });
    const bodyText = bodyTextResult.result.value ?? '';
    const identity = opts.identityTokens.map((token) => ({ token, found: bodyText.includes(token) }));

    const reasons = [];
    if (!dom.groupsFound) reasons.push('MODULE_GROUPS_NOT_FOUND');
    else if (dom.groupsTop > opts.maxTop || dom.groupsTop > dom.innerHeight) reasons.push('GROUPS_BELOW_FOLD');
    if (!identity.every((i) => i.found)) reasons.push('IDENTITY_MISSING');

    let pngSize = null;
    if (opts.screenshotPath) {
      const shot = await session.send('Page.captureScreenshot', { format: 'png' });
      const bytes = Buffer.from(shot.data, 'base64');
      pngSize = readPngSize(bytes);
      writeFileSync(opts.screenshotPath, bytes);
    }

    const metadata = {
      url: dom.url,
      requestedViewport: { width: opts.width, height: opts.height },
      effectiveViewport: { width: dom.innerWidth, height: dom.innerHeight },
      deviceScaleFactor: 1,
      thresholds: { maxTop: opts.maxTop },
      measured: {
        groupsTop: dom.groupsTop,
        groupsFound: dom.groupsFound,
        bodyScrollWidth: dom.bodyScrollWidth,
        identity
      },
      capture: opts.screenshotPath
        ? { path: opts.screenshotPath, width: pngSize.width, height: pngSize.height }
        : null,
      browser: { description: browserInfo.product, revision: browserInfo.revision },
      verdict: reasons.length === 0 ? 'PASS' : 'FAIL',
      reasons
    };

    if (opts.metadataPath) {
      writeFileSync(opts.metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
    }

    session.close();

    return {
      verdict: metadata.verdict,
      reasons,
      detail: `groupsTop=${dom.groupsTop} innerHeight=${dom.innerHeight} identity=${identity.map((i) => i.found).join(',')}`,
      browser: metadata.browser,
      metadata
    };
  } finally {
    chrome.kill();
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  function argValue(name, fallback) {
    const idx = process.argv.indexOf(name);
    return idx !== -1 ? process.argv[idx + 1] : fallback;
  }
  const result = await runFirstScreenCheck({
    url: argValue('--url', 'http://127.0.0.1:8165/'),
    width: Number(argValue('--width', 1280)),
    height: Number(argValue('--height', 800)),
    maxTop: Number(argValue('--max-top', 800)),
    cdpPort: Number(argValue('--cdp-port', 8166)),
    userDataDir: argValue('--user-data-dir', `/tmp/wizard-first-screen-${process.pid}`),
    screenshotPath: argValue('--screenshot', null),
    metadataPath: argValue('--metadata', null)
  });
  console.log(JSON.stringify(result.metadata ?? result, null, 2));
  process.exit(result.verdict === 'PASS' ? 0 : 1);
}
