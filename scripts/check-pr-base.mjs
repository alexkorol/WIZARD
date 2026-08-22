#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STATIC_SURFACES = [
  ['dashboard', (path) => path === 'index.html' || path === 'dashboard.js'],
  ['registry', (path) =>
    path === 'modules.json' ||
    path === 'modules.generated.js' ||
    path === 'scripts/wizard-lab.mjs' ||
    /^tools\/[^/]+\/wizard\.module\.json$/.test(path)],
  ['shared-runtime', (path) => path.startsWith('shared/')],
  ['schema', (path) => path.startsWith('schema/')],
  ['workflow', (path) => path.startsWith('.github/workflows/')],
];

function git(args, { cwd = process.cwd(), encoding = 'utf8' } = {}) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    throw new Error(`git ${args.join(' ')} failed: ${detail}`);
  }
}

function normalizeRepoPath(path) {
  return path.replaceAll('\\', '/').replace(/^\.\//, '');
}

export function classifySensitivePath(path, activeLaunches = new Set()) {
  const normalized = normalizeRepoPath(path);
  const surfaces = [];

  for (const [surface, matches] of STATIC_SURFACES) {
    if (matches(normalized)) surfaces.push(surface);
  }
  if (activeLaunches.has(normalized)) surfaces.push('active-module-launch');

  return surfaces;
}

function resolveCommit(ref, cwd) {
  return git(['rev-parse', '--verify', `${ref}^{commit}`], { cwd }).trim();
}

function loadActiveLaunches(currentSha, cwd) {
  let registry;
  try {
    registry = JSON.parse(git(['show', `${currentSha}:modules.json`], { cwd }));
  } catch (error) {
    throw new Error(`cannot read the current gh-pages module registry: ${error.message}`);
  }

  if (!Array.isArray(registry.modules)) {
    throw new Error('current gh-pages modules.json does not contain a modules array');
  }

  return new Set(
    registry.modules
      .filter((module) => module?.visibility === 'dashboard' && typeof module.launch === 'string')
      .map((module) => normalizeRepoPath(module.launch)),
  );
}

function changedPaths(candidateBase, candidateHead, cwd) {
  const output = git(
    ['-c', 'core.quotepath=false', 'diff', '--no-renames', '--name-only', '--diff-filter=ACMRD', '-z', `${candidateBase}..${candidateHead}`, '--'],
    { cwd, encoding: null },
  );
  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map(normalizeRepoPath);
}

export function inspectPrBase({ headRef = 'HEAD', currentRef = 'origin/gh-pages', cwd = process.cwd() } = {}) {
  const candidateHead = resolveCommit(headRef, cwd);
  const currentGhPages = resolveCommit(currentRef, cwd);
  const candidateBase = git(['merge-base', candidateHead, currentGhPages], { cwd }).trim();
  if (!candidateBase) throw new Error('candidate head and current gh-pages have no merge base');

  const activeLaunches = loadActiveLaunches(currentGhPages, cwd);
  const paths = changedPaths(candidateBase, candidateHead, cwd);
  const sensitivePaths = paths.flatMap((path) => {
    const surfaces = classifySensitivePath(path, activeLaunches);
    return surfaces.length ? [{ path, surfaces }] : [];
  });

  return {
    candidateHead,
    candidateBase,
    currentGhPages,
    fresh: candidateBase === currentGhPages,
    paths,
    sensitivePaths,
    blocked: candidateBase !== currentGhPages && sensitivePaths.length > 0,
  };
}

export function formatResult(result) {
  const lines = [
    'stale-base safeguard',
    `candidate_head: ${result.candidateHead}`,
    `candidate_base: ${result.candidateBase}`,
    `current_gh_pages: ${result.currentGhPages}`,
    `fresh: ${result.fresh}`,
    `changed_paths: ${result.paths.length}`,
  ];

  for (const entry of result.sensitivePaths) {
    lines.push(`sensitive_surface: ${entry.path} [${entry.surfaces.join(', ')}]`);
  }

  if (result.blocked) {
    lines.push('FAIL: stale candidate touches deployment-sensitive surfaces; rebase onto current gh-pages and rerun checks.');
  } else if (result.fresh) {
    lines.push('PASS: candidate contains the current gh-pages tip.');
  } else {
    lines.push('PASS: stale candidate changes only non-sensitive paths.');
  }

  return lines.join('\n');
}

function parseArgs(argv) {
  const options = {
    headRef: process.env.PR_HEAD_SHA || 'HEAD',
    currentRef: process.env.GH_PAGES_REF || 'origin/gh-pages',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--head' && argv[index + 1]) options.headRef = argv[++index];
    else if (argument === '--current-ref' && argv[index + 1]) options.currentRef = argv[++index];
    else if (argument === '--help') options.help = true;
    else throw new Error(`unknown or incomplete argument: ${argument}`);
  }

  return options;
}

function usage() {
  return [
    'Usage: node scripts/check-pr-base.mjs [--head <sha>] [--current-ref <ref>]',
    '',
    'Defaults: --head $PR_HEAD_SHA or HEAD; --current-ref $GH_PAGES_REF or origin/gh-pages.',
    'The command is read-only and never fetches, rebases, merges, or writes GitHub state.',
  ].join('\n');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(usage());
    } else {
      const result = inspectPrBase(options);
      console.log(formatResult(result));
      if (result.blocked) process.exitCode = 1;
    }
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}
