#!/usr/bin/env node
// Owner-rule text lint for the ARPG and WIZARD (OWNER-RULES.md rules 5-8 and 12).
// One implementation, one term list (terms.json), run by both repositories:
//   node owner-rules/lint.mjs wizard [--root <WIZARD checkout>] [--report]
//   node owner-rules/lint.mjs arpg   [--root <ARPG checkout>]   [--report]
// Exit code 1 and a table of every flagged string on failure; --report prints the table
// even on success. Canonical copy: WIZARD owner-rules/. Never edit the ARPG copy.
//
// Two passes over player-facing text only (comments, identifiers and bare lowercase key
// literals are internal and skipped):
// - text: invented compound coinages (one head word plus one tail word, reviewed English
//   words allowed), invented terms, capitalised invented ailments and channel misuse
//   ("Ember Resistance"), in every page, data script, manifest and game C# string;
// - tree: the stricter passive-tree list (lore themes, synonyms) plus era words (no iron,
//   books, lanterns ...) in tree data, jewels, stat labels and the tree UI.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(readFileSync(join(HERE, 'terms.json'), 'utf8'));
const esc = s => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
const ALLOW = new Set(T.allowEnglish);
const KEYS = new Set(T.keyLiterals.map(k => k.toLowerCase()));
const COMPOUND = new RegExp(`^(?:${T.compoundHeads.join('|')})-?(?:${T.compoundTails.join('|')})(?:s|es)?$`, 'i');
const INVENTED = new RegExp(`^(?:${T.invented.join('|')})$`, 'i');
const AILMENT = new RegExp(`^(?:${T.inventedAilments.join('|')})$`);
const CHANNEL = new RegExp(`\\b(?:${T.channelWords.join('|')})\\s+(?:${T.channelNouns.join('|')})\\b`, 'gi');
const TREE = new RegExp(`(?<![\\w-])(?:${[...T.treeBanned, ...T.treeEra].map(esc).join('|')})(?![\\w-])`, 'i');
const IDENT = [/\$\{[^}]*\}/g, /\S*\/\S*/g, /\b_\w+/g, /\b[a-z][a-z0-9]*(?:[_-][a-z0-9]+)+\b/g, /\b[a-z]+[A-Z][A-Za-z0-9]*\b/g, /\b[A-Z][a-z]+[A-Z][A-Za-z0-9]*\b/g];
const prose = text => IDENT.reduce((t, re) => t.replace(re, ' '), text);
const isKey = text => /^\s*[a-z][a-z0-9]*\s*$/.test(text) || KEYS.has(text.trim().toLowerCase());

export function flagText(text) {
  if (typeof text !== 'string' || isKey(text)) return [];
  const hits = [...text.matchAll(CHANNEL)].map(m => [m[0], 'channel term']);
  for (const token of prose(text).match(/[A-Za-z][A-Za-z'-]*[A-Za-z]/g) || []) {
    const word = token.toLowerCase().replace(/'s$/, '');
    if (ALLOW.has(word)) continue;
    if (COMPOUND.test(word)) hits.push([token, 'invented compound']);
    else if (INVENTED.test(word) || AILMENT.test(token)) hits.push([token, 'invented term']);
  }
  return hits;
}
export function flagTree(text) {
  if (typeof text !== 'string' || isKey(text)) return [];
  const m = prose(text).match(TREE);
  return m ? [[m[0], 'tree vocabulary or era']] : [];
}

const LITERAL = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
function codeStrings(code, base = 0) {
  code = code.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:\\])\/\/.*$/gm, '$1');
  return [...code.matchAll(LITERAL)].map(m => [base + code.slice(0, m.index).split('\n').length, m[2]]);
}
function htmlStrings(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) out.push(...codeStrings(m[1], html.slice(0, m.index).split('\n').length - 1));
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
  body.split('\n').forEach((line, i) => {
    let text = line.replace(/<[^>]+>/g, ' ');
    for (const a of line.matchAll(/(?:title|alt|placeholder|aria-label)="([^"]*)"/g)) text += ' ' + a[1];
    if (text.trim()) out.push([i + 1, text]);
  });
  return out;
}
function parts(path) {
  const text = readFileSync(path, 'utf8');
  if (path.endsWith('.html')) return htmlStrings(text);
  if (path.endsWith('wizard.module.json')) {
    const data = JSON.parse(text);
    return ['name', 'title', 'description', 'summary'].map(key => [0, String(data[key] ?? '')]);
  }
  return codeStrings(text);
}
function* walk(dir, skipDirs) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (skipDirs.includes(name)) continue;
    if (statSync(path).isDirectory()) yield* walk(path, skipDirs);
    else yield path;
  }
}

// What each repository shows players or the owner.
const PROFILES = {
  wizard(root) {
    const skip = /(?:^|\/)(?:test\.js|download-intake\.js)$|\.test\.m?js$|\.min\.js$|vendor|three/;
    const text = [join(root, 'index.html'), join(root, 'dashboard.js')];
    for (const p of walk(join(root, 'tools'), ['node_modules', 'tests', 'dist', 'scripts', '.git'])) {
      if (skip.test(p) || statSync(p).size > 8_000_000) continue;
      if (/\.(?:html|js|mjs)$/.test(p) || p.endsWith('wizard.module.json')) text.push(p);
    }
    for (const p of walk(join(root, 'shared'), [])) if (p.endsWith('.js')) text.push(p);
    const tree = ['tools/geometric_skilltree/assets/tree-data.js', 'tools/geometric_skilltree/assets/jewels.js',
      'tools/rpg_inventory/core/verdigris-stats.js', 'tools/geometric_skilltree/index.html'].map(p => join(root, p));
    return { text, tree };
  },
  arpg(root) {
    const a = join(root, 'the ARPG/Assets/ARPG');
    const text = [];
    // Editor code, verification and capture harnesses are not player text; CombatTerminology
    // is the legacy-label translator, the one place old words are allowed.
    for (const p of walk(join(a, 'Scripts'), [])) {
      if (p.endsWith('.cs') && !/Verification|Capture|Lab|Debug|CombatTerminology/.test(p.split('/').pop())) text.push(p);
    }
    const wizard = ['tree-data', 'jewels', 'stats', 'model'].map(n => join(a, `Resources/Wizard/${n}.js.txt`));
    text.push(...wizard);
    const tree = [...wizard, join(a, 'Scripts/Runtime/ArpgSkillTreePane.cs')];
    return { text, tree };
  }
};

export function lint(profile, root) {
  const { text, tree } = PROFILES[profile](root);
  const report = [];
  const add = (path, line, term, why, value) => report.push({ where: `${relative(root, path)}:${line}`, term, why, text: value.trim().slice(0, 100) });
  for (const path of text) if (existsSync(path)) for (const [line, value] of parts(path)) for (const [term, why] of flagText(value)) add(path, line, term, why, value);
  for (const path of tree) {
    if (!existsSync(path)) throw new Error(`owner-rules lint: missing tree source ${path}`);
    for (const [line, value] of parts(path)) for (const [term, why] of flagTree(value)) add(path, line, term, why, value);
  }
  return { report, files: text.length + tree.length };
}

function selfTest() {
  const bad = ['Emberguard Helm', 'Vesselforge engine', '+8% Ember Resistance', 'Your Jolts chain'];
  const good = ['Firestorm and windward stonework', 'emberkiss', 'the ember cup', 'a heavy jolt'];
  for (const s of bad) if (!flagText(s).length) throw new Error(`owner-rules lint self-test missed: ${s}`);
  for (const s of good) if (flagText(s).length) throw new Error(`owner-rules lint self-test flagged: ${s}`);
  if (!flagTree('Iron Doctrine').length || !flagTree('Sign of the Kiln').length || flagTree('Fire Resistance').length) throw new Error('owner-rules lint self-test: tree pass');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const profile = process.argv[2];
  if (!PROFILES[profile]) { console.error('usage: node owner-rules/lint.mjs <wizard|arpg> [--root <path>] [--report]'); process.exit(2); }
  const at = process.argv.indexOf('--root');
  const root = at > 0 ? process.argv[at + 1] : join(HERE, '..');
  selfTest();
  const { report, files } = lint(profile, root);
  if (report.length || process.argv.includes('--report')) {
    console.log(`# Owner-rule text lint: ${profile} (${report.length} flagged)\n\n| Where | Term | Why | Text |\n|---|---|---|---|`);
    for (const r of report) console.log(`| ${r.where} | ${r.term} | ${r.why} | ${r.text.replace(/\|/g, '/')} |`);
  }
  if (report.length) { console.error(`\n${report.length} owner-rule violation(s); see OWNER-RULES.md rules 5-8 and 12.`); process.exit(1); }
  console.log(`owner-rules lint (${profile}): ${files} player-facing files clean.`);
}
