#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://alexkorol.github.io/WIZARD/';

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.DEPLOY_SMOKE_BASE_URL || DEFAULT_BASE_URL,
    repo: process.env.GITHUB_WORKSPACE || process.cwd(),
    ref: null,
    maxAttempts: 5,
    backoffMs: 2000,
    backoffCapMs: 30000,
    timeoutMs: 10000,
  };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === '--base-url') args.baseUrl = argv[++i];
    else if (flag === '--repo') args.repo = path.resolve(argv[++i]);
    else if (flag === '--ref') args.ref = argv[++i];
    else if (flag === '--max-attempts') args.maxAttempts = Number(argv[++i]);
    else if (flag === '--backoff-ms') args.backoffMs = Number(argv[++i]);
    else if (flag === '--backoff-cap-ms') args.backoffCapMs = Number(argv[++i]);
    else if (flag === '--timeout-ms') args.timeoutMs = Number(argv[++i]);
    else if (flag === '-h' || flag === '--help') args.help = true;
  }
  return args;
}

function git(repo, ...args) {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'buffer' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed (${result.status}): ${(result.stderr || '').toString().trim()}`);
  }
  return result.stdout;
}

function gitText(repo, ...args) {
  return git(repo, ...args).toString('utf8');
}

async function fetchWithRetries(url, { maxAttempts, backoffMs, backoffCapMs, timeoutMs }) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.ok) {
        return { bytes: new Uint8Array(await response.arrayBuffer()), attempts: attempt };
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error && error.name === 'TimeoutError' ? `timeout after ${timeoutMs}ms` : String(error);
    }
    if (attempt < maxAttempts) {
      const delay = Math.min(backoffMs * 2 ** (attempt - 1), backoffCapMs);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(lastError || 'unknown fetch failure');
}

function joinUrl(base, relPath) {
  return `${base.replace(/\/+$/, '')}/${relPath.replace(/^\/+/, '')}`;
}

function collectAssetRefs(html, pageRepoPath) {
  const refs = [];
  const pattern = /(?:src|href)="([^"]+\.(?:js|css))(\?[^"]*)?"/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const raw = match[1];
    const query = match[2] || '';
    if (/^(?:https?:)?\/\//.test(raw)) continue;
    const baseDir = path.posix.dirname(pageRepoPath);
    let resolved;
    if (raw.startsWith('/')) {
      resolved = raw.slice(1);
    } else {
      resolved = path.posix.normalize(path.posix.join(baseDir, raw));
    }
    refs.push({ repoPath: resolved, urlSuffix: `${resolved}${query}`, sourcePage: pageRepoPath });
  }
  return refs;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('usage: node scripts/deploy-smoke.mjs [--base-url URL] [--ref GIT_REF]');
    console.log('  [--max-attempts N] [--backoff-ms MS] [--backoff-cap-ms MS] [--timeout-ms MS]');
    console.log('Verifies the deployed Pages site matches a gh-pages commit: root identity page,');
    console.log('generated registry, active launch URLs, and referenced js/css assets are all');
    console.log('fetched and byte-compared against the commit. Read-only; bounded retries with');
    console.log('real exponential backoff; exits nonzero naming URL and expected SHA on failure.');
    process.exit(0);
  }

  let expectedSha;
  if (args.ref) {
    try {
      expectedSha = gitText(args.repo, 'rev-parse', '--verify', `${args.ref}^{commit}`).trim();
    } catch (error) {
      console.error(`FAIL deploy-smoke cannot resolve --ref ${args.ref}: ${error.message}`);
      process.exit(2);
    }
  } else {
    for (const candidate of ['refs/remotes/origin/gh-pages', 'refs/heads/gh-pages', 'HEAD^{commit}']) {
      const probe = spawnSync('git', ['rev-parse', '--verify', candidate], { cwd: args.repo, encoding: 'buffer' });
      if (probe.status === 0) {
        expectedSha = probe.stdout.toString().trim();
        break;
      }
    }
    if (!expectedSha) {
      console.error('FAIL deploy-smoke found no gh-pages ref or HEAD to compare against');
      process.exit(2);
    }
  }

  function show(relPath) {
    return git(args.repo, 'show', `${expectedSha}:${relPath}`);
  }

  let registry;
  try {
    registry = JSON.parse(show('modules.json').toString('utf8'));
  } catch (error) {
    console.error(`FAIL deploy-smoke cannot read modules.json @ ${expectedSha}: ${error.message}`);
    process.exit(2);
  }

  const launchPaths = (registry.modules || [])
    .filter(module => module.visibility === 'dashboard')
    .map(module => module.launch)
    .filter(Boolean);

  const targets = [{ repoPath: 'index.html', role: 'identity' }];
  for (const launch of launchPaths) targets.push({ repoPath: launch, role: 'launch' });

  const failures = [];
  const fetchedPages = [];
  const assetSet = new Map();

  console.log(`SMOKE base-url=${args.baseUrl} expected=gh-pages@${expectedSha}`);

  for (const target of targets) {
    const url = joinUrl(args.baseUrl, target.repoPath);
    let expectedBytes;
    try {
      expectedBytes = show(target.repoPath);
    } catch (error) {
      failures.push({ url, reason: `no committed file at ${expectedSha}: ${error.message}` });
      continue;
    }
    try {
      const { bytes, attempts } = await fetchWithRetries(url, args);
      const ok = Buffer.compare(Buffer.from(bytes), expectedBytes) === 0;
      console.log(`${ok ? 'OK  ' : 'FAIL'} ${url} (${attempts} attempt${attempts === 1 ? '' : 's'}, ${bytes.length}B)`);
      if (!ok) failures.push({ url, reason: `served bytes differ from gh-pages @ ${expectedSha}` });
      if (target.repoPath.endsWith('.html')) fetchedPages.push({ repoPath: target.repoPath, html: expectedBytes.toString('utf8') });
    } catch (error) {
      console.log(`FAIL ${url}`);
      failures.push({ url, reason: `${error.message} (expected gh-pages @ ${expectedSha})` });
    }
  }

  for (const page of fetchedPages) {
    for (const ref of collectAssetRefs(page.html, page.repoPath)) {
      if (!assetSet.has(ref.repoPath)) assetSet.set(ref.repoPath, ref);
    }
  }
  for (const [assetPath, ref] of assetSet) {
    if (targets.some(target => target.repoPath === assetPath)) continue;
    const url = joinUrl(args.baseUrl, ref.urlSuffix);
    let expectedBytes;
    try {
      expectedBytes = show(assetPath);
    } catch {
      console.log(`SKIP ${url} (not tracked at ${expectedSha})`);
      continue;
    }
    try {
      const { bytes, attempts } = await fetchWithRetries(url, args);
      const ok = Buffer.compare(Buffer.from(bytes), expectedBytes) === 0;
      console.log(`${ok ? 'OK  ' : 'FAIL'} ${url} (${attempts} attempt${attempts === 1 ? '' : 's'}, ${bytes.length}B)`);
      if (!ok) failures.push({ url, reason: `cache-pinned asset differs from gh-pages @ ${expectedSha}` });
    } catch (error) {
      console.log(`FAIL ${url}`);
      failures.push({ url, reason: `${error.message} (expected gh-pages @ ${expectedSha})` });
    }
  }

  if (failures.length) {
    console.error(`FAIL deploy-smoke (${failures.length} failure${failures.length === 1 ? '' : 's'}) expected gh-pages @ ${expectedSha}:`);
    for (const failure of failures) {
      console.error(`  - ${failure.url}: ${failure.reason}`);
    }
    process.exit(1);
  }
  console.log(`PASS deploy-smoke deployed content matches gh-pages @ ${expectedSha} (${targets.length} pages, ${assetSet.size} assets)`);
  process.exit(0);
}

main();
