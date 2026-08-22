#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SENSITIVE_SURFACES = [
  { name: 'DASHBOARD', match: rel => rel === 'index.html' || rel === 'dashboard.js' },
  {
    name: 'REGISTRY',
    match: rel =>
      rel === 'modules.json' ||
      rel === 'modules.generated.js' ||
      /^tools\/[^/]+\/wizard\.module\.json$/.test(rel),
  },
  { name: 'SHARED_RUNTIME', match: rel => rel.startsWith('shared/') },
  { name: 'SCHEMA', match: rel => rel.startsWith('schema/') },
  { name: 'WORKFLOW', match: rel => rel.startsWith('.github/workflows/') || rel === 'package.json' },
];

function git(repo, ...args) {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed (${result.status}): ${(result.stderr || result.stdout).trim()}`);
  }
  return (result.stdout || '').trim();
}

function activeModuleSlugs(repo, head) {
  const show = spawnSync('git', ['show', `${head}:modules.json`], { cwd: repo, encoding: 'utf8' });
  if (show.status !== 0) return [];
  try {
    const parsed = JSON.parse(show.stdout);
    return (parsed.modules || []).map(module => module.slug).filter(Boolean);
  } catch {
    return [];
  }
}

function surfacesFor(changedFiles, slugs) {
  const hits = [];
  for (const rel of changedFiles) {
    const normalized = rel.replaceAll('\\', '/');
    for (const surface of SENSITIVE_SURFACES) {
      if (surface.match(normalized)) {
        hits.push({ surface: surface.name, file: normalized });
        continue;
      }
    }
    for (const slug of slugs) {
      if (normalized === `tools/${slug}/` || normalized.startsWith(`tools/${slug}/`)) {
        hits.push({ surface: `ACTIVE_MODULE(${slug})`, file: normalized });
        break;
      }
    }
  }
  return hits;
}

function parseArgs(argv) {
  const args = { repo: process.env.GITHUB_WORKSPACE || process.cwd() };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--repo') args.repo = path.resolve(argv[++i]);
    else if (argv[i] === '--head') args.head = argv[++i];
    else if (argv[i] === '--base-ref') args.baseRef = argv[++i];
    else if (argv[i] === '--base-tip') args.baseTip = argv[++i];
    else if (argv[i] === '-h' || argv[i] === '--help') args.help = true;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('usage: node scripts/check-pr-base.mjs [--repo <dir>] [--head <sha>] [--base-ref <ref>] [--base-tip <sha>]');
    console.log('Hard-fails PR candidates whose merge base is behind the current gh-pages tip while');
    console.log('touching dashboard, registry, shared runtime, schema, workflow, or active-module');
    console.log('launch surfaces. Read-only: runs only rev-parse/merge-base/diff-tree/show.');
    process.exit(0);
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  let eventHead = null;
  let eventBaseRef = null;
  if (!args.head && eventPath && fs.existsSync(eventPath)) {
    try {
      const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
      eventHead = event.pull_request && event.pull_request.head && event.pull_request.head.sha;
      eventBaseRef = event.pull_request && event.pull_request.base && event.pull_request.base.ref;
    } catch {
      eventHead = null;
    }
  }

  const repo = args.repo;
  const head = args.head || eventHead;
  const baseRef = args.baseRef || eventBaseRef || 'gh-pages';

  if (!head) {
    console.error('FAIL no candidate head resolved (pass --head or run inside a pull_request event)');
    process.exit(2);
  }

  let baseTip;
  if (args.baseTip) {
    baseTip = git(repo, 'rev-parse', '--verify', `${args.baseTip}^{commit}`);
  } else {
    for (const candidate of [`refs/remotes/origin/${baseRef}`, `refs/heads/${baseRef}`]) {
      const probe = spawnSync('git', ['rev-parse', '--verify', `${candidate}^{commit}`], { cwd: repo, encoding: 'utf8' });
      if (probe.status === 0) {
        baseTip = probe.stdout.trim();
        break;
      }
    }
    if (!baseTip) {
      console.error(`FAIL base ref not found: ${baseRef}`);
      process.exit(2);
    }
  }

  const headCommit = git(repo, 'rev-parse', '--verify', `${head}^{commit}`);
  const mergeBase = git(repo, 'merge-base', headCommit, baseTip);

  console.log(`CHECK candidate=${headCommit} base-tip=${baseTip} merge-base=${mergeBase}`);

  if (mergeBase === baseTip) {
    console.log(`PASS pr-base candidate base is current with ${baseRef} @ ${baseTip}`);
    process.exit(0);
  }

  const changedFiles = git(
    repo,
    'diff-tree',
    '-r',
    '--name-only',
    '--no-commit-id',
    `${mergeBase}..${headCommit}`
  )
    .split('\n')
    .filter(Boolean);

  const slugs = activeModuleSlugs(repo, headCommit);
  const hits = surfacesFor(changedFiles, slugs);

  if (!hits.length) {
    console.log(`PASS pr-base stale but insensitive: ${changedFiles.length} changed file(s), none on protected surfaces`);
    process.exit(0);
  }

  const grouped = new Map();
  for (const hit of hits) {
    if (!grouped.has(hit.surface)) grouped.set(hit.surface, []);
    grouped.get(hit.surface).push(hit.file);
  }
  console.error(`FAIL pr-base STALE candidate touches protected deployment surfaces:`);
  console.error(`  candidate base (merge-base): ${mergeBase}`);
  console.error(`  current gh-pages tip:        ${baseTip}`);
  console.error(`  rebase onto ${baseRef} before merging; no automatic rebase will be performed.`);
  for (const [surface, files] of grouped) {
    console.error(`  - ${surface}: ${[...new Set(files)].join(', ')}`);
  }
  process.exit(1);
}

main();
