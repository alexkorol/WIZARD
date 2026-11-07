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
// - retired: every display name retired by owner-rules/rename-map.json (wedges, class
//   epithets, pack and slot names, coined skill names ...), in game text, data files and the
//   current docs (dated records, logs, handoffs and the rename map itself are history);
// - vocabulary: every word of a Title Case label (node, pack, item, slot and button names)
//   must be in the closed plain vocabulary, terms.json nameWords. A new word is added there
//   only after review, as with art-name-lint's plain words.
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
// Dropped project names, as proper names only (lowercase "verdigris" is the bronze patina).
const RETIRED = new RegExp(`^(?:${(T.retiredNames || []).join('|')})$`);
const CHANNEL = new RegExp(`\\b(?:${T.channelWords.join('|')})\\s+(?:${T.channelNouns.join('|')})\\b`, 'gi');
const TREE = new RegExp(`(?<![\\w-])(?:${[...T.treeBanned, ...T.treeEra].map(esc).join('|')})(?![\\w-])`, 'i');
const MAP = existsSync(join(HERE, 'rename-map.json')) ? JSON.parse(readFileSync(join(HERE, 'rename-map.json'), 'utf8')) : { entries: [] };
// Ordinary English words that a rename replaced in one place only stay legal elsewhere.
const NOT_RETIRED = new Set(T.retiredExceptions || []);
const retiredList = scopes => [...new Set([...(T.retiredPhrases || []),
  ...MAP.entries.filter(e => e.lint !== false && (!e.scope || scopes.includes(e.scope))).map(e => e.before)])]
  .filter(b => !NOT_RETIRED.has(b)).sort((a, b) => b.length - a.length);
const phraseRe = list => list.length ? new RegExp(`(?<![\\w-])(?:${list.map(esc).join('|')})(?![\\w-])`, 'g') : null;
const RETIRED_GAME = phraseRe(retiredList(['game']));
const RETIRED_DOCS = phraseRe(retiredList([]));
const VOCAB = new Set([...(T.nameWords || []), ...(T.nameConnectors || [])].map(w => w.toLowerCase()));
const CONNECTORS = new Set((T.nameConnectors || []).map(w => w.toLowerCase()));
const NAME_EXCEPTIONS = new Set(Object.entries(T.nameExceptions || {}).filter(([k]) => !k.startsWith('_')).flatMap(([, v]) => v));
const PROPER = new Set((T.nameProper || []).map(w => w.toLowerCase()));
const ROMAN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/;
const IDENT = [/\$\{[^}]*\}/g, /\S*\/\S*/g, /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/g, /\b_\w+/g, /\b[a-z][a-z0-9]*(?:[_-][a-z0-9]+)+\b/g, /\b[a-z]+[A-Z][A-Za-z0-9]*\b/g, /\b[A-Z][a-z]+[A-Z][A-Za-z0-9]*\b/g];
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
    else if (RETIRED.test(token)) hits.push([token, 'retired name']);
  }
  return hits;
}
export function flagTree(text) {
  if (typeof text !== 'string' || isKey(text)) return [];
  const m = prose(text).match(TREE);
  return m ? [[m[0], 'tree vocabulary or era']] : [];
}

// Retired display names (rename-map.json). `game` adds the game-only entries (rite -> spell).
export function flagRetired(text, game = true) {
  const re = game ? RETIRED_GAME : RETIRED_DOCS;
  if (typeof text !== 'string' || !re || isKey(text)) return [];
  return [...text.matchAll(re)].map(m => [m[0], 'retired name (rename-map.json)']);
}
// A label: 1-8 words, every content word capitalised, no sentence punctuation.
export function isLabel(text) {
  if (typeof text !== 'string') return false;
  const t = text.trim();
  if (!/^[A-Z]/.test(t) || t.length > 64 || /[.!?;,"{}<>=$\\]|\s{2}|\n/.test(t) || /^[A-Z0-9_]+$/.test(t)) return false;
  // Paths and asset keys ('VFX/spellforge-catalog', 'World-v2/...') are not labels; 'INT/DEX Class' is.
  if (/[a-z0-9]\/|\/[a-z]/.test(t) || /_/.test(t)) return false;
  const words = t.split(/[\s:]+/).filter(Boolean);
  if (words.length > 8) return false;
  return words.every(w => /^[A-Z0-9(+%]/.test(w) || CONNECTORS.has(w.toLowerCase().replace(/[()]/g, '')));
}
export function flagLabel(text) {
  if (!VOCAB.size || !isLabel(text) || NAME_EXCEPTIONS.has(text.trim())) return [];
  const hits = [];
  for (const token of text.match(/[A-Za-z][A-Za-z'’-]*/g) || []) {
    for (const part of token.split('-')) {
      const word = part.toLowerCase().replace(/['’]s$/, '').replace(/['’]/g, '');
      if (!word || word.length < 2 || ROMAN.test(word) || /^[a-z]$/.test(word)) continue;
      if (!VOCAB.has(word) && !PROPER.has(word)) hits.push([part, 'outside plain vocabulary (terms.json nameWords)']);
    }
  }
  return hits;
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
function jsonStrings(value, out = []) {
  if (typeof value === 'string') out.push([0, value]);
  else if (Array.isArray(value)) value.forEach(v => jsonStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(v => jsonStrings(v, out));
  return out;
}
function parts(path) {
  const text = readFileSync(path, 'utf8');
  if (path.endsWith('.html')) return htmlStrings(text);
  if (path.endsWith('.md')) return text.split('\n').map((line, i) => [i + 1, line]);
  // TSV cells: key cells (bare lowercase tokens) are skipped by isKey().
  if (path.endsWith('.tsv')) return text.split('\n').flatMap((line, i) => line.split('\t').map(cell => [i + 1, cell]));
  if (path.endsWith('.json') && !path.endsWith('wizard.module.json')) return jsonStrings(JSON.parse(text));
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
    // Game data and pages players see: retired names include the game-only entries.
    const game = [...tree, 'tools/geometric_skilltree/assets/patterns.js', 'tools/geometric_skilltree/scripts/author-tree.mjs',
      'tools/rpg_inventory/core/verdigris-pack.js', 'tools/rpg_inventory/index.html'].map(p => join(root, p));
    // Current docs and data: dated records, logs, handoffs and reports are history and keep old names.
    const history = /(?:^|\/)(?:NAMING|CHANGELOG|OVERHAUL-LOG|ISSUES)\.md$|LOG|HANDOFF|REPORT|PREFLIGHT|20\d\d-\d\d-\d\d|\/(?:fixtures|assets_staging|assets_inbox|review_assets|expansion_drafts|research)\//;
    const docs = [];
    for (const base of ['docs', 'tools']) for (const p of walk(join(root, base), ['node_modules', 'dist', '.git', 'sokoban', 'rp_account_creator', 'gui_framekit', 'verdigris_splash', 'wordcloud']))
      if (/\.(?:md|tsv)$/.test(p) && !history.test(relative(root, p))) docs.push(p);
    for (const p of ['README.md', 'AGENTS.md']) docs.push(join(root, p));
    // Design data (real-world rites and rituals are literal here, so the game-only entries do not apply).
    docs.push(join(root, 'tools/rpg_inventory/core/item-types-by-skill-zone.json'), join(root, 'tools/rpg_inventory/skill-zone-items.html'));
    const labels = [...tree, 'tools/rpg_inventory/core/verdigris-pack.js', 'tools/rpg_inventory/core/item-types-by-skill-zone.json'].map(p => join(root, p));
    return { text, tree, game, docs, labels };
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
    // Every player-facing string in the game is game text: retired names and the closed vocabulary apply.
    return { text, tree, game: text, docs: [], labels: text };
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
  const p = PROFILES[profile](root);
  const gameSet = new Set(p.game || []);
  // The spell effects lab names each effect after the other game it recreates (Crawl, PoE).
  const quotes = /(?:^|\/)tools\/spellforge\//;
  for (const path of new Set([...(p.game || []), ...text, ...(p.docs || [])])) {
    if (!existsSync(path) || quotes.test(relative(root, path))) continue;
    for (const [line, value] of parts(path)) for (const [term, why] of flagRetired(value, gameSet.has(path))) add(path, line, term, why, value);
  }
  for (const path of p.labels || []) {
    if (!existsSync(path)) continue;
    for (const [line, value] of parts(path)) for (const [term, why] of flagLabel(value)) add(path, line, term, why, value);
  }
  return { report, files: new Set([...text, ...tree, ...(p.docs || [])]).size };
}

function selfTest() {
  const bad = ['Emberguard Helm', 'Vesselforge engine', '+8% Ember Resistance', 'Your Jolts chain', 'Verdigris Passive Tree'];
  const good = ['Firestorm and windward stonework', 'emberkiss', 'the ember cup', 'a heavy jolt', 'verdigris pooling in the grooves', 'VerdigrisStats'];
  for (const s of bad) if (!flagText(s).length) throw new Error(`owner-rules lint self-test missed: ${s}`);
  for (const s of good) if (flagText(s).length) throw new Error(`owner-rules lint self-test flagged: ${s}`);
  if (!flagTree('Iron Doctrine').length || !flagTree('Sign of the Kiln').length || flagTree('Fire Resistance').length) throw new Error('owner-rules lint self-test: tree pass');
  if (MAP.entries.length && (!flagRetired('the Archmage class').length || !flagRetired('Quick Rig').length || flagRetired('Fire Resistance').length || flagRetired('a funerary rite', false).length))
    throw new Error('owner-rules lint self-test: retired pass');
  if (VOCAB.size && (!flagLabel('Drowned Study').length || flagLabel('Fire Resistance').length || flagLabel('Gate to the INT outer circle.').length))
    throw new Error('owner-rules lint self-test: vocabulary pass');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const profile = process.argv[2];
  if (!PROFILES[profile]) { console.error('usage: node owner-rules/lint.mjs <wizard|arpg> [--root <path>] [--report]'); process.exit(2); }
  const at = process.argv.indexOf('--root');
  const root = at > 0 ? process.argv[at + 1] : join(HERE, '..');
  if (process.argv.includes('--collect-label-words')) {
    // Seeding aid: every word used in Title Case labels, with a sample label.
    const words = new Map();
    for (const path of PROFILES[profile](root).labels || []) if (existsSync(path)) for (const [, value] of parts(path)) if (isLabel(value))
      for (const tok of value.match(/[A-Za-z][A-Za-z'’-]*/g) || []) for (const part of tok.split('-')) {
        const w = part.toLowerCase().replace(/['’]s$/, '').replace(/['’]/g, '');
        if (w.length > 1 && !ROMAN.test(w)) { const e = words.get(w) || [0, value]; e[0]++; words.set(w, e); }
      }
    for (const [w, [n, sample]] of [...words].sort()) console.log(`${w}\t${n}\t${sample}`);
    process.exit(0);
  }
  if (!MAP.entries.length) { console.error('owner-rules lint: rename-map.json is missing; sync it with lint.mjs and terms.json'); process.exit(2); }
  selfTest();
  const { report, files } = lint(profile, root);
  if (report.length || process.argv.includes('--report')) {
    console.log(`# Owner-rule text lint: ${profile} (${report.length} flagged)\n\n| Where | Term | Why | Text |\n|---|---|---|---|`);
    for (const r of report) console.log(`| ${r.where} | ${r.term} | ${r.why} | ${r.text.replace(/\|/g, '/')} |`);
  }
  if (report.length) { console.error(`\n${report.length} owner-rule violation(s); see OWNER-RULES.md rules 5-8, 12 and 47.`); process.exit(1); }
  console.log(`owner-rules lint (${profile}): ${files} player-facing files clean.`);
}
