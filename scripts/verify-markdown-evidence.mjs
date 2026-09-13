#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
const SCAN_SUBDIRS = ['docs', 'evidence'];

const IMAGE_OR_LINK_START = /!?\[[^\]\n]*\]\(/g;

function findDestinationEnd(line, startIndex) {
  let depthParen = 0;
  for (let i = startIndex; i < line.length; i++) {
    const ch = line[i];
    if (ch === '\\' && i + 1 < line.length) {
      i++;
      continue;
    }
    if (!depthParen && ch === ')') return i;
    if (ch === '(') depthParen++;
    else if (ch === ')') depthParen--;
  }
  return -1;
}

function extractLinks(line) {
  const links = [];
  IMAGE_OR_LINK_START.lastIndex = 0;
  let opener;
  while ((opener = IMAGE_OR_LINK_START.exec(line)) !== null) {
    const destStart = opener.index + opener[0].length;
    const destEnd = findDestinationEnd(line, destStart);
    if (destEnd === -1) continue;
    const rawInner = line.slice(destStart, destEnd);
    const isImage = opener[0].startsWith('!');
    links.push({ isImage, rawInner, columnIndex: destStart });
    IMAGE_OR_LINK_START.lastIndex = destEnd;
  }
  return links;
}

function unwrapDestination(rawInner) {
  const trimmed = rawInner.trim();
  let destination;
  let remainder = '';
  let hadAngle = false;
  if (trimmed.startsWith('<')) {
    const close = trimmed.indexOf('>');
    if (close === -1) return { kind: 'FAIL_UNTERMINATED_ANGLE', detail: rawInner };
    hadAngle = true;
    destination = trimmed.slice(1, close);
    remainder = trimmed.slice(close + 1).trim();
  } else {
    const spaceMatch = trimmed.match(/^(\S+)(?:\s+(.*))?$/);
    destination = spaceMatch[1];
    remainder = spaceMatch[2] || '';
  }
  if (remainder && !/^(["'])(?:\\.|(?!\1).)*\1$/.test(remainder)) {
    return { kind: 'FAIL_MALFORMED_TITLE', detail: rawInner };
  }
  const unescaped = destination.replaceAll(/\\([()])/g, '$1');
  return { kind: 'RAW_OK', destination: unescaped, hadAngle };
}

function assertValidPercentSequences(destination) {
  let index = destination.indexOf('%');
  while (index !== -1) {
    const pair = destination.slice(index + 1, index + 3);
    if (!/^[0-9a-fA-F]{2}$/.test(pair)) {
      return { ok: false, detail: destination.slice(index) };
    }
    index = destination.indexOf('%', index + 3);
  }
  return { ok: true };
}

function classifyDestination(rawDestination) {
  let destination = rawDestination.trim();
  if (!destination) return { kind: 'SKIP_EMPTY' };
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(destination)) return { kind: 'SKIP_EXTERNAL', detail: destination };
  if (destination.startsWith('#')) return { kind: 'SKIP_FRAGMENT', detail: destination };

  if (destination.startsWith('<') && destination.endsWith('>')) {
    destination = destination.slice(1, -1);
  }
  let queryStripped = false;
  const queryIndex = destination.indexOf('?');
  if (queryIndex !== -1) {
    destination = destination.slice(0, queryIndex);
    queryStripped = true;
  }

  let percentDecoded = false;
  const percentCheck = assertValidPercentSequences(destination);
  if (!percentCheck.ok) {
    return { kind: 'FAIL_MALFORMED_PERCENT', detail: percentCheck.detail };
  }
  if (/%[0-9a-fA-F]{2}/.test(destination)) {
    try {
      destination = decodeURIComponent(destination);
      percentDecoded = true;
    } catch {
      return { kind: 'FAIL_MALFORMED_PERCENT', detail: rawDestination };
    }
  }

  const anchorMatch = destination.match(/^(.*?)#(.*)$/);
  let anchor = null;
  if (anchorMatch) {
    destination = anchorMatch[1];
    anchor = anchorMatch[2];
  }

  return {
    kind: 'VALIDATE',
    target: destination,
    anchor,
    flags: {
      queryStripped,
      percentDecoded,
    },
  };
}

function countLines(text) {
  if (!text.length) return 0;
  const withoutTrailingNewline = text.replace(/(\r\n|\r|\n)$/, '');
  if (!withoutTrailingNewline.length) return 1;
  return withoutTrailingNewline.split(/\r\n|\r|\n/).length;
}

function validateAnchor(anchor, lineCount, failures, label) {
  const single = anchor.match(/^L(\d+)$/);
  const range = anchor.match(/^L(\d+)-L(\d+)$/);
  if (single) {
    const line = Number(single[1]);
    if (line < 1 || line > lineCount) {
      failures.push({ code: 'ANCHOR_OUT_OF_RANGE', label, detail: `#L${line} beyond ${lineCount} lines` });
    }
    return;
  }
  if (range) {
    const start = Number(range[1]);
    const end = Number(range[2]);
    if (start < 1 || end < 1) {
      failures.push({ code: 'ANCHOR_INVALID', label, detail: anchor });
    } else if (start > end) {
      failures.push({ code: 'ANCHOR_REVERSED', label, detail: `#${anchor} (${start} > ${end})` });
    } else if (end > lineCount) {
      failures.push({ code: 'ANCHOR_OUT_OF_RANGE', label, detail: `#${anchor} beyond ${lineCount} lines` });
    }
    return;
  }
}

export function auditRoot(root) {
  const repoReal = fs.realpathSync(root);
  const sourceFiles = [];
  for (const sub of SCAN_SUBDIRS) {
    const dir = path.join(root, sub);
    if (!fs.existsSync(dir)) continue;
    collectMarkdown(fs.realpathSync(dir), sub, sourceFiles);
  }
  sourceFiles.sort();

  const stats = {
    filesScanned: sourceFiles.length,
    linksTotal: 0,
    skippedExternal: 0,
    skippedFragment: 0,
    skippedEmpty: 0,
    queriesStripped: 0,
    percentDecoded: 0,
    imagesValidated: 0,
    validated: 0,
    failures: [],
  };

  for (const relFile of sourceFiles) {
    const absFile = path.join(root, relFile);
    let content;
    try {
      content = fs.readFileSync(absFile, 'utf8');
    } catch (error) {
      stats.failures.push({
        code: 'SOURCE_UNREADABLE',
        label: `${relFile}`,
        detail: error.message,
      });
      continue;
    }
    const lines = content.split(/\r?\n/);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      for (const link of extractLinks(line)) {
        stats.linksTotal += 1;
        const label = `${relFile}:${lineIndex + 1}`;
        const unwrapped = unwrapDestination(link.rawInner);
        if (unwrapped.kind === 'FAIL_MALFORMED_TITLE') {
          stats.failures.push({ code: 'MALFORMED_TITLE', label, detail: unwrapped.detail });
          continue;
        }
        if (unwrapped.kind === 'FAIL_UNTERMINATED_ANGLE') {
          stats.failures.push({ code: 'UNTERMINATED_ANGLE', label, detail: unwrapped.detail });
          continue;
        }
        const classification = classifyDestination(unwrapped.destination);
        if (classification.kind === 'SKIP_EXTERNAL') {
          stats.skippedExternal += 1;
          continue;
        }
        if (classification.kind === 'SKIP_FRAGMENT') {
          stats.skippedFragment += 1;
          continue;
        }
        if (classification.kind === 'SKIP_EMPTY') {
          stats.skippedEmpty += 1;
          continue;
        }
        if (classification.kind === 'FAIL_MALFORMED_PERCENT') {
          stats.failures.push({ code: 'MALFORMED_PERCENT', label, detail: classification.detail });
          continue;
        }
        if (classification.flags.queryStripped) stats.queriesStripped += 1;
        if (classification.flags.percentDecoded) stats.percentDecoded += 1;
        if (link.isImage) stats.imagesValidated += 1;

        const target = classification.target;
        const resolvedAbsolute = path.resolve(path.dirname(absFile), target);
        const relativeToRoot = path.relative(repoReal, resolvedAbsolute);
        if (!relativeToRoot || relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
          stats.failures.push({ code: 'PATH_ESCAPE', label, detail: target });
          continue;
        }
        let realResolved = resolvedAbsolute;
        try {
          realResolved = fs.realpathSync(resolvedAbsolute);
        } catch {
          stats.failures.push({ code: 'MISSING_TARGET', label, detail: target });
          continue;
        }
        const realRelative = path.relative(repoReal, realResolved);
        if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) {
          stats.failures.push({ code: 'SYMLINK_ESCAPE', label, detail: `${target} -> ${realResolved}` });
          continue;
        }
        let stat;
        try {
          stat = fs.statSync(realResolved);
        } catch (error) {
          stats.failures.push({ code: 'TARGET_UNREADABLE', label, detail: `${target}: ${error.message}` });
          continue;
        }
        if (!stat.isFile()) {
          stats.failures.push({ code: 'TARGET_NOT_A_FILE', label, detail: target });
          continue;
        }
        stats.validated += 1;
        if (classification.anchor) {
          const lineCount = countLines(fs.readFileSync(realResolved, 'utf8'));
          validateAnchor(classification.anchor, lineCount, stats.failures, label);
        }
      }
    }
  }

  stats.failures.sort((a, b) =>
    a.label === b.label
      ? a.code === b.code
        ? a.detail < b.detail ? -1 : 1
        : a.code < b.code ? -1 : 1
      : a.label < b.label ? -1 : 1
  );
  return stats;
}

function collectMarkdown(dir, prefix, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries.sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      collectMarkdown(path.join(dir, entry.name), rel, out);
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      out.push(rel);
    }
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('-h') || argv.includes('--help')) {
    console.log('usage: node scripts/verify-markdown-evidence.mjs [root]');
    console.log('Read-only auditor for repository-relative Markdown file targets and #L anchors');
    console.log('under docs/** and evidence/**. Exit 0 all valid; 1 validation failures;');
    console.log('2 invocation/read errors.');
    process.exit(0);
  }
  if (argv.length > 1) {
    console.error('FAIL too many arguments');
    process.exit(2);
  }
  const root = argv.length ? path.resolve(argv[0]) : DEFAULT_ROOT;
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error(`FAIL scan root not found: ${root}`);
    process.exit(2);
  }

  let stats;
  try {
    stats = auditRoot(root);
  } catch (error) {
    console.error(`FAIL markdown-evidence could not complete: ${error.message}`);
    process.exit(2);
  }

  console.log(`AUDIT root=${path.relative(process.cwd(), root) || '.'}`);
  console.log(
    `links=${stats.linksTotal} validated=${stats.validated} skipped-external=${stats.skippedExternal}` +
      ` skipped-fragment=${stats.skippedFragment} skipped-empty=${stats.skippedEmpty}` +
      ` queries-stripped=${stats.queriesStripped} percent-decoded=${stats.percentDecoded}` +
      ` images=${stats.imagesValidated}`
  );

  if (stats.filesScanned === 0) {
    console.error('FAIL markdown-evidence found no Markdown sources under docs/** or evidence/**');
    process.exit(2);
  }

  if (stats.failures.length) {
    for (const failure of stats.failures) {
      console.log(`${failure.code} ${failure.label} :: ${failure.detail}`);
    }
    console.error(`FAIL markdown-evidence (${stats.failures.length} problem${stats.failures.length === 1 ? '' : 's'} in ${stats.filesScanned} files)`);
    process.exit(1);
  }
  console.log(`PASS markdown-evidence (${stats.filesScanned} md files scanned)`);
  process.exit(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
