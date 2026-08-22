#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const PUBLIC_URL = 'https://alexkorol.github.io/WIZARD/';
const MAX_ATTEMPTS = 5;
const MAX_BACKOFF_MS = 5_000;
const MAX_DELAY_MS = 8_000;
const MAX_TOTAL_BACKOFF_MS = 30_000;
const MAX_TIMEOUT_MS = 15_000;
const MAX_RESOURCES = 200;
const MAX_RESOURCE_BYTES = 32 * 1024 * 1024;

class SmokeFailure extends Error {
  constructor(message, { url = null } = {}) {
    super(message);
    this.name = 'SmokeFailure';
    this.url = url;
  }
}

function git(args, { cwd = process.cwd(), encoding = 'utf8' } = {}) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding,
      maxBuffer: MAX_RESOURCE_BYTES,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    throw new Error(`git ${args.join(' ')} failed: ${detail}`);
  }
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sleep(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

function expectedFile(expectedSha, repoPath, repoRoot) {
  try {
    return git(['show', `${expectedSha}:${repoPath}`], { cwd: repoRoot, encoding: null });
  } catch (error) {
    throw new SmokeFailure(`expected commit does not contain ${repoPath}: ${error.message}`);
  }
}

function resolveSiteUrl(reference, parentUrl, baseUrl) {
  let url;
  try {
    url = new URL(reference, parentUrl);
  } catch {
    return null;
  }
  if (url.origin !== baseUrl.origin || !url.pathname.startsWith(baseUrl.pathname)) return null;
  url.hash = '';
  return url;
}

function repoPathForUrl(url, baseUrl) {
  if (url.origin !== baseUrl.origin || !url.pathname.startsWith(baseUrl.pathname)) {
    throw new SmokeFailure(`URL is outside the deployment root: ${url.href}`, { url: url.href });
  }
  const relative = decodeURIComponent(url.pathname.slice(baseUrl.pathname.length));
  return relative || 'index.html';
}

function extractReferencedAssets(text, parentUrl, baseUrl) {
  const references = new Map();
  const quotedUrl = /["']([^"'\s<>]+)["']/g;
  for (const match of text.matchAll(quotedUrl)) {
    const reference = match[1].replaceAll('&amp;', '&');
    const isPinned = /(?:\?|&)v=[^&#]+/.test(reference);
    const isShared = /(?:^|\/)shared\//.test(reference);
    if (!isPinned && !isShared) continue;
    const url = resolveSiteUrl(reference, parentUrl, baseUrl);
    if (!url) continue;
    const key = url.href;
    const prior = references.get(key) || { url, pinned: false, shared: false };
    prior.pinned ||= isPinned;
    prior.shared ||= isShared;
    references.set(key, prior);
  }
  return [...references.values()];
}

function retryDelays(attempts, backoffMs) {
  const delays = [];
  for (let index = 0; index < attempts - 1; index += 1) {
    delays.push(Math.min(backoffMs * (2 ** index), MAX_DELAY_MS));
  }
  return delays;
}

export function validateOptions(options) {
  if (!/^[0-9a-f]{40}$/i.test(options.expectedSha || '')) {
    throw new Error('expected SHA must be a full 40-character Git commit SHA');
  }
  if (!Number.isInteger(options.attempts) || options.attempts < 1 || options.attempts > MAX_ATTEMPTS) {
    throw new Error(`attempts must be an integer from 1 through ${MAX_ATTEMPTS}`);
  }
  if (!Number.isInteger(options.backoffMs) || options.backoffMs < 1 || options.backoffMs > MAX_BACKOFF_MS) {
    throw new Error(`backoff must be an integer from 1 through ${MAX_BACKOFF_MS}ms`);
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 100 || options.timeoutMs > MAX_TIMEOUT_MS) {
    throw new Error(`timeout must be an integer from 100 through ${MAX_TIMEOUT_MS}ms`);
  }

  const baseUrl = new URL(options.baseUrl);
  if (baseUrl.protocol !== 'https:' && !(baseUrl.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(baseUrl.hostname))) {
    throw new Error('base URL must use HTTPS, except for loopback-only HTTP fixtures');
  }
  if (!baseUrl.pathname.endsWith('/')) baseUrl.pathname += '/';

  const delays = retryDelays(options.attempts, options.backoffMs);
  const totalBackoffMs = delays.reduce((sum, delay) => sum + delay, 0);
  if (totalBackoffMs > MAX_TOTAL_BACKOFF_MS) {
    throw new Error(`retry schedule exceeds the ${MAX_TOTAL_BACKOFF_MS}ms total backoff ceiling`);
  }

  return { ...options, expectedSha: options.expectedSha.toLowerCase(), baseUrl, delays, totalBackoffMs };
}

async function fetchExpectedResource({ url, expectedSha, repoRoot, baseUrl, attempt, timeoutMs }) {
  const repoPath = repoPathForUrl(url, baseUrl);
  const expected = expectedFile(expectedSha, repoPath, repoRoot);
  const requestUrl = new URL(url);
  requestUrl.searchParams.set('deploy-smoke', `${expectedSha.slice(0, 12)}-${attempt}`);

  let response;
  try {
    response = await fetch(requestUrl, {
      cache: 'no-store',
      redirect: 'error',
      headers: {
        accept: '*/*',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'user-agent': 'WIZARD-deploy-smoke/1',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new SmokeFailure(`request failed: ${error.message}`, { url: url.href });
  }

  if (!response.ok) {
    throw new SmokeFailure(`HTTP ${response.status} ${response.statusText}`, { url: url.href });
  }
  const actual = Buffer.from(await response.arrayBuffer());
  if (actual.length > MAX_RESOURCE_BYTES) {
    throw new SmokeFailure(`response exceeds the ${MAX_RESOURCE_BYTES}-byte resource ceiling`, { url: url.href });
  }
  if (!actual.equals(expected)) {
    throw new SmokeFailure(
      `content mismatch expected_digest=${sha256(expected)} actual_digest=${sha256(actual)}`,
      { url: url.href },
    );
  }

  return {
    url,
    repoPath,
    body: actual,
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
  };
}

async function inspectDeployment(options, attempt, log) {
  const queue = [];
  const queued = new Map();
  const checked = new Map();
  let expectedActiveLaunches = null;

  function enqueue(reference, parentUrl, kind) {
    const url = resolveSiteUrl(reference, parentUrl, options.baseUrl);
    if (!url) throw new SmokeFailure(`invalid or off-site ${kind} URL: ${reference}`, { url: reference });
    const key = url.href;
    const entry = queued.get(key) || { url, kinds: new Set() };
    entry.kinds.add(kind);
    if (!queued.has(key)) {
      queued.set(key, entry);
      queue.push(entry);
    }
  }

  enqueue(options.baseUrl.href, options.baseUrl, 'dashboard');
  enqueue('modules.json', options.baseUrl, 'generated-registry');
  enqueue('modules.generated.js', options.baseUrl, 'generated-registry');

  while (queue.length) {
    if (checked.size >= MAX_RESOURCES) {
      throw new SmokeFailure(`resource ceiling exceeded (${MAX_RESOURCES})`);
    }
    const entry = queue.shift();
    const resource = await fetchExpectedResource({
      ...options,
      url: entry.url,
      attempt,
    });
    resource.kinds = entry.kinds;
    checked.set(entry.url.href, resource);

    if (/\.(?:html?|js|json|css)$/i.test(resource.repoPath)) {
      const text = resource.body.toString('utf8');
      for (const asset of extractReferencedAssets(text, entry.url, options.baseUrl)) {
        enqueue(asset.url.href, entry.url, asset.pinned ? 'cache-pinned-asset' : 'shared-asset');
        if (asset.shared) enqueue(asset.url.href, entry.url, 'shared-asset');
      }
    }

    if (resource.repoPath === 'index.html') {
      const html = resource.body.toString('utf8');
      if (!/<h1>WIZARD<\/h1>/.test(html) || !html.includes('Verdigris Systems Laboratory')) {
        throw new SmokeFailure('WIZARD identity is missing from the deployed dashboard', { url: entry.url.href });
      }
      if (!resource.etag || !resource.lastModified || Number.isNaN(Date.parse(resource.lastModified))) {
        throw new SmokeFailure('dashboard response lacks a resolvable ETag or Last-Modified header', { url: entry.url.href });
      }
      log(`header_resolution url=${entry.url.href} etag=${resource.etag} last_modified=${resource.lastModified}`);
      log('identity: WIZARD — Verdigris Systems Laboratory');
    }

    if (resource.repoPath === 'modules.json') {
      let registry;
      try {
        registry = JSON.parse(resource.body.toString('utf8'));
      } catch (error) {
        throw new SmokeFailure(`generated registry is invalid JSON: ${error.message}`, { url: entry.url.href });
      }
      if (registry.generatedBy !== 'scripts/wizard-lab.mjs' || registry.schemaVersion !== 1 || registry.doNotEdit !== true || !Array.isArray(registry.modules)) {
        throw new SmokeFailure('generated registry metadata or modules array is invalid', { url: entry.url.href });
      }
      const active = registry.modules.filter((module) => module?.visibility === 'dashboard');
      if (!active.length) throw new SmokeFailure('generated registry has no active dashboard modules', { url: entry.url.href });
      expectedActiveLaunches = active.length;
      for (const module of active) {
        if (typeof module.launch !== 'string' || !module.launch) {
          throw new SmokeFailure(`active module ${module?.id || '<unknown>'} lacks a launch URL`, { url: entry.url.href });
        }
        enqueue(module.launch, options.baseUrl, 'active-launch');
      }
      log(`generated_registry modules=${registry.modules.length} active_launches=${active.length}`);
    }

    if (resource.repoPath === 'modules.generated.js') {
      const generated = resource.body.toString('utf8');
      if (!generated.includes('generated by scripts/wizard-lab.mjs') || !generated.includes('window.WIZARD_REGISTRY =')) {
        throw new SmokeFailure('generated JavaScript registry marker or global is invalid', { url: entry.url.href });
      }
    }
  }

  const countKind = (kind) => [...checked.values()].filter((resource) => resource.kinds.has(kind)).length;
  const activeLaunchCount = countKind('active-launch');
  const sharedAssetCount = countKind('shared-asset');
  const pinnedAssetCount = countKind('cache-pinned-asset');
  if (expectedActiveLaunches === null || activeLaunchCount !== expectedActiveLaunches) {
    throw new SmokeFailure(`active launch coverage mismatch expected=${expectedActiveLaunches} checked=${activeLaunchCount}`, { url: options.baseUrl.href });
  }
  if (!sharedAssetCount) throw new SmokeFailure('no shared assets were discovered from active surfaces', { url: options.baseUrl.href });
  if (!pinnedAssetCount) throw new SmokeFailure('no cache-pinned assets were discovered from active surfaces', { url: options.baseUrl.href });
  log(`checked_resources total=${checked.size} active_launches=${activeLaunchCount} shared_assets=${sharedAssetCount} cache_pinned_assets=${pinnedAssetCount}`);
  return { checked };
}

export async function runDeploySmoke(rawOptions, { log = console.log } = {}) {
  const options = validateOptions(rawOptions);
  const localHead = git(['rev-parse', '--verify', 'HEAD^{commit}'], { cwd: options.repoRoot }).trim().toLowerCase();
  if (localHead !== options.expectedSha) {
    throw new SmokeFailure(`checked-out HEAD ${localHead} does not match expected deployed SHA ${options.expectedSha}`);
  }

  log(`deployment_target url=${options.baseUrl.href} expected_sha=${options.expectedSha} local_head=${localHead}`);
  log(`retry_policy attempts=${options.attempts} backoff_ms=${options.backoffMs} total_backoff_ceiling_ms=${options.totalBackoffMs} timeout_ms=${options.timeoutMs}`);

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    log(`attempt ${attempt}/${options.attempts}`);
    try {
      const result = await inspectDeployment(options, attempt, log);
      log(`PASS deploy-smoke expected_sha=${options.expectedSha} resources=${result.checked.size}`);
      return result;
    } catch (error) {
      if (!(error instanceof SmokeFailure)) throw error;
      if (attempt === options.attempts) {
        throw new SmokeFailure(
          `FAIL deploy-smoke url=${error.url || options.baseUrl.href} expected_sha=${options.expectedSha} attempts=${options.attempts} reason=${error.message}`,
          { url: error.url },
        );
      }
      const delay = options.delays[attempt - 1];
      log(`RETRY attempt=${attempt}/${options.attempts} delay_ms=${delay} url=${error.url || options.baseUrl.href} expected_sha=${options.expectedSha} reason=${error.message}`);
      await sleep(delay);
    }
  }
}

function parseInteger(value, name) {
  if (!/^\d+$/.test(value || '')) throw new Error(`${name} must be an integer`);
  return Number(value);
}

function parseArgs(argv) {
  const options = {
    baseUrl: process.env.DEPLOY_BASE_URL || PUBLIC_URL,
    expectedSha: process.env.DEPLOYED_SHA,
    repoRoot: process.cwd(),
    attempts: 4,
    backoffMs: 2_000,
    timeoutMs: 10_000,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === '--base-url' && value) options.baseUrl = argv[++index];
    else if (argument === '--expected-sha' && value) options.expectedSha = argv[++index];
    else if (argument === '--repo-root' && value) options.repoRoot = resolve(argv[++index]);
    else if (argument === '--attempts' && value) options.attempts = parseInteger(argv[++index], 'attempts');
    else if (argument === '--backoff-ms' && value) options.backoffMs = parseInteger(argv[++index], 'backoff');
    else if (argument === '--timeout-ms' && value) options.timeoutMs = parseInteger(argv[++index], 'timeout');
    else if (argument === '--help') options.help = true;
    else throw new Error(`unknown or incomplete argument: ${argument}`);
  }
  return options;
}

function usage() {
  return [
    'Usage: node scripts/deploy-smoke.mjs --expected-sha <40-char-sha> [options]',
    '',
    `Default deployment URL: ${PUBLIC_URL}`,
    `Retry ceilings: attempts<=${MAX_ATTEMPTS}, backoff<=${MAX_BACKOFF_MS}ms, total<=${MAX_TOTAL_BACKOFF_MS}ms, request timeout<=${MAX_TIMEOUT_MS}ms.`,
  ].join('\n');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) console.log(usage());
    else await runDeploySmoke(options);
  } catch (error) {
    console.error(error.message.startsWith('FAIL ') ? error.message : `ERROR: ${error.message}`);
    process.exitCode = error instanceof SmokeFailure ? 1 : 2;
  }
}
