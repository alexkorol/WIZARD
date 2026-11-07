#!/usr/bin/env node
// Applies owner-rules/rename-map.json to files (both repositories use the same map).
//   node owner-rules/apply-rename-map.mjs --root <repo> [--scope game,lattice] [--dry] [--list <file>] <file>...
// Exact-value entries replace a whole string value (a quoted literal whose content equals
// `before`); phrase entries replace word-bounded text, longest `before` first. In code files
// (.cs .js .mjs .cjs, and <script> in .html) only string literals and comments change, so
// identifiers, keys and enum members keep their names. Markdown, JSON, TSV and text change
// everywhere. Entries with a `scope` apply only when that scope is passed.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MAP = JSON.parse(readFileSync(join(HERE, 'rename-map.json'), 'utf8'));
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const esc = s => s.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

export function compile(scopes = [], keysSafe = false) {
  // keysSafe: skip entries that start lowercase, so data keys (class columns, ids) never change.
  const ok = e => (!e.scope || scopes.includes(e.scope)) && !(keysSafe && /^[a-z]/.test(e.before));
  const exact = new Map(MAP.entries.filter(e => e.match === 'exact-value' && ok(e)).map(e => [e.before, e.after]));
  const phrases = MAP.entries.filter(e => e.match !== 'exact-value' && ok(e))
    .sort((a, b) => b.before.length - a.before.length)
    .map(e => [new RegExp(`(?<![\\w-])${esc(e.before)}(?![\\w-])`, 'g'), e.after]);
  // One pass over all phrases so a replacement is never re-matched by a shorter entry.
  const all = phrases.length ? new RegExp(phrases.map(([re]) => re.source).join('|'), 'g') : null;
  const lookup = new Map(MAP.entries.filter(e => e.match !== 'exact-value' && ok(e)).map(e => [e.before, e.after]));
  const phrase = text => all ? text.replace(all, m => lookup.get(m) ?? m) : text;
  return { exact, phrase };
}

// Flavour entries map to null: the whole literal (and a trailing comma) is dropped from arrays.
function rewriteLiteral(body, quote, rules, counts) {
  // A bare lowercase token ('reliquary', 'rite', 'spoils') is a key or id: never renamed.
  if (/^[a-z][a-z0-9_-]*$/.test(body)) return body;
  if (rules.exact.has(body)) { counts.n++; const a = rules.exact.get(body); return a === null ? null : a; }
  const out = rules.phrase(body);
  if (out !== body) counts.n++;
  return out;
}

const LITERAL = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
function rewriteCode(code, rules, counts) {
  // Split into comment / literal / other tokens; rewrite comments with phrases, literals fully.
  const TOKEN = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let out = '', last = 0, m;
  while ((m = TOKEN.exec(code))) {
    out += code.slice(last, m.index);
    const tok = m[0];
    if (tok.startsWith('//') || tok.startsWith('/*')) {
      // "https://..." inside code is not a comment start when preceded by ':'.
      if (tok.startsWith('//') && /:$/.test(code.slice(Math.max(0, m.index - 1), m.index))) { out += tok; last = m.index + tok.length; continue; }
      const r = rules.phrase(tok); if (r !== tok) counts.n++; out += r;
    } else {
      const r = rewriteLiteral(m[2], m[1], rules, counts);
      out += r === null ? '\u0000DROP\u0000' : m[1] + r + m[1];
    }
    last = m.index + tok.length;
  }
  // Dropped array elements take one neighbouring comma with them.
  return (out + code.slice(last)).replace(/,\s*\u0000DROP\u0000|\u0000DROP\u0000\s*,?/g, '');
}

function rewriteJsonLike(text, rules, counts) {
  // JSON / TSV / Markdown: exact values are quoted JSON strings; phrases apply everywhere.
  text = text.replace(/"((?:\\.|[^"\\\n])*)"/g, (all, body) => {
    if (!rules.exact.has(body)) return all;
    counts.n++; const a = rules.exact.get(body); return a === null ? '\u0000DROP\u0000' : JSON.stringify(a);
  }).replace(/,\s*\u0000DROP\u0000|\u0000DROP\u0000\s*,?/g, '');
  const out = rules.phrase(text);
  if (out !== text) counts.n++;
  return out;
}

export function applyFile(path, scopes, keysSafe = /\.(py|csv)$/.test(path)) {
  const rules = compile(scopes, keysSafe);
  const ext = extname(path).toLowerCase();
  const before = readFileSync(path, 'utf8');
  const counts = { n: 0 };
  let after;
  if (['.cs', '.js', '.mjs', '.cjs', '.txt'].includes(ext) && !/\.(md|tsv)\.txt$/.test(path)) after = rewriteCode(before, rules, counts);
  else if (ext === '.html') {
    after = before.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/g, (_, a, body, c) => a + rewriteCode(body, rules, counts) + c);
    after = after.replace(/(<\/script>|^)([\s\S]*?)(?=<script|$)/g, (all, a, body) => a + body.replace(/>([^<]+)</g, (m, t) => { const r = rules.phrase(t); if (r !== t) counts.n++; return '>' + r + '<'; })
      .replace(/((?:title|alt|placeholder|aria-label)=")([^"]*)"/g, (m, k, v) => { const r = rules.phrase(v); if (r !== v) counts.n++; return k + r + '"'; }));
  } else if (ext === '.tsv') {
    // Per cell: a bare key cell ('reliquary', 'war_call') is never renamed; prose and display cells get every entry.
    const full = compile(scopes, false);
    after = before.split('\n').map(line => line.split('\t').map(cell => {
      if (/^[a-z0-9][a-z0-9_.\/-]*$/.test(cell)) return cell;
      if (full.exact.has(cell)) { counts.n++; return full.exact.get(cell) ?? cell; }
      const r = full.phrase(cell); if (r !== cell) counts.n++; return r;
    }).join('\t')).join('\n');
  } else after = rewriteJsonLike(before, rules, counts);
  return { changed: after !== before, after, count: counts.n };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = arg('--root') || process.cwd();
  const scopes = (arg('--scope') || '').split(',').filter(Boolean);
  const dry = process.argv.includes('--dry');
  const skip = new Set([arg('--root'), arg('--scope')].filter(Boolean));
  const list = arg('--list');
  if (list) skip.add(list);
  const files = [...process.argv.slice(2).filter(a => !a.startsWith('--') && !skip.has(a)),
    ...(list ? readFileSync(list, 'utf8').split('\n').filter(Boolean) : [])];
  let total = 0;
  for (const f of files) {
    const path = f.startsWith('/') ? f : join(root, f);
    const { changed, after, count } = applyFile(path, scopes);
    if (changed) { total += count; console.log(`${dry ? 'would change' : 'changed'} ${f} (${count})`); if (!dry) writeFileSync(path, after); }
  }
  console.log(`rename-map: ${total} replacement group(s) across ${files.length} file(s)`);
}
