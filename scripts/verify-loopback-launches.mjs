#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

const PROSE_EXTENSIONS = new Set(['.md', '.markdown', '.mdx', '.txt']);

const SERVER_PATTERNS = [
  /\bpython\d?(?:\.\d+)?\s+-m\s+http\.server\b/,
  /\bpy\s+-m\s+http\.server\b/,
  /\bpython\d?\s+-m\s+SimpleHTTPServer\b/,
  /\bnpx\s+(?:-y\s+)?(?:serve|http-server)\b/,
  /\bnpm\s+(?:x|exec)\s+(?:-y\s+)?(?:--\s+)?(?:serve|http-server)\b/,
  /\bphp\s+-S\b/i,
  /(^|\s)live-server(\s|$)/,
];

const LOOPBACK_BIND_PATTERNS = [
  /(?:^|\s)--bind(?:=|\s+)["']?127\.0\.0\.1["']?(?=\s|$)/,
  /(?:^|\s)-b(?:=|\s+)["']?127\.0\.0\.1["']?(?=\s|$)/,
  /(?:^|\s)-b["']127\.0\.0\.1["']/,
  /(?:^|\s)--listen(?:=|\s+)["']?127\.0\.0\.1[:"]/,
  /(?:^|\s)-l(?:=|\s+)["']?127\.0\.0\.1[:"]/,
  /(?:^|\s)-S\s+["']?127\.0\.0\.1:/i,
];

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.avif', '.bmp',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.zip', '.gz', '.tar', '.br', '.7z', '.rar',
  '.mp3', '.mp4', '.wav', '.ogg', '.webm', '.mov',
  '.pdf', '.glb', '.gltf', '.wasm', '.exe', '.dll', '.dylib', '.so',
]);

const EXEMPT_PATHS = [
  {
    prefix: 'tests/fixtures/loopback-launches/',
    reason: 'negative-control fixtures that intentionally contain violations',
  },
  {
    prefix: 'tests/loopback-launches.test.mjs',
    reason: 'asserts against those fixtures and embeds their literal text',
  },
];

function isExempt(relPath) {
  return EXEMPT_PATHS.some(entry => relPath.startsWith(entry.prefix));
}

function listFiles(root) {
  const files = [];
  const SKIP_DIRS = new Set(['.git', 'node_modules']);
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full);
      } else if (entry.isFile()) {
        files.push(path.relative(root, full).replaceAll('\\', '/'));
      }
    }
  }
  walk(root);
  return files.sort();
}

export function classifyLines(lines, isProseFile) {
  const flagged = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isProseFile && /^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (isProseFile && !inFence) continue;
    if (!SERVER_PATTERNS.some(pattern => pattern.test(line))) continue;
    if (/0\.0\.0\.0/.test(line)) {
      flagged.push({ line: i + 1, reason: 'server command binds 0.0.0.0', text: line.trim() });
      continue;
    }
    if (!LOOPBACK_BIND_PATTERNS.some(pattern => pattern.test(line))) {
      flagged.push({ line: i + 1, reason: 'server command lacks an explicit 127.0.0.1 bind', text: line.trim() });
    }
  }
  return flagged;
}

export function scanRoot(root) {
  const findings = [];
  let scanned = 0;
  for (const rel of listFiles(root)) {
    if (isExempt(rel)) continue;
    const ext = path.extname(rel).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) continue;
    let content;
    try {
      content = fs.readFileSync(path.join(root, rel), 'utf8');
    } catch {
      continue;
    }
    scanned += 1;
    const flagged = classifyLines(content.split(/\r?\n/), PROSE_EXTENSIONS.has(ext));
    for (const item of flagged) {
      findings.push({ file: rel, ...item });
    }
  }
  findings.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
  return { findings, scanned };
}

function main() {
  const args = process.argv.slice(2);
  let root = REPO_ROOT;
  if (args.length) {
    if (args[0] === '-h' || args[0] === '--help') {
      console.log('usage: node scripts/verify-loopback-launches.mjs [root]');
      console.log('Scans committed launch surfaces for server commands binding 0.0.0.0');
      console.log('or omitting an explicit 127.0.0.1 bind (INC-W008). In prose files');
      console.log('(markdown/text) only fenced code blocks count as launch configs.');
      console.log('Exits nonzero when any violation is found.');
      process.exit(0);
    }
    root = path.resolve(args[0]);
  }
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error(`FAIL scan root not found: ${root}`);
    process.exit(2);
  }
  const { findings, scanned } = scanRoot(root);
  console.log(`SCAN ${path.relative(process.cwd(), root) || '.'}`);
  for (const finding of findings) {
    console.log(`${finding.file}:${finding.line}: ${finding.reason} :: ${finding.text}`);
  }
  if (findings.length) {
    console.error(`FAIL loopback-launches (${findings.length} violation${findings.length === 1 ? '' : 's'}, ${scanned} files scanned)`);
    process.exit(1);
  }
  console.log(`PASS loopback-launches (${scanned} files scanned)`);
  process.exit(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
