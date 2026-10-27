// Repo-wide lint: invented compound coinages and setting vocabulary in player-facing text.
// Owner corrections: September 21 (Fire/Cold/Lightning/Chaos), October 26 ("stop inventing
// ai-trope lore"; "same applies to cringey composite terms like 'emberguard' 'vesselforge'
// etc."). See AGENTS.md. The passive tree has a stricter list in
// tools/geometric_skilltree/tests/invented-terms.test.mjs.
//
// Scans every tool page (HTML text, title/alt/placeholder attributes and script string
// literals), tool data scripts and module manifests. Comments and identifiers (snake_case,
// kebab-case, camelCase, PascalCase, paths) are internal and skipped, as is any bare
// lowercase literal (a key). On failure it prints a readable report of every flagged string.
//
//   node scripts/invented-terms.test.mjs [--report]   (--report prints the table even on pass)
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

// Fantasy compound halves. A word made of one HEAD and one TAIL (optionally hyphenated or
// pluralised) is an invented coinage unless it is a reviewed English word in ALLOW.
export const HEADS = ['ember', 'storm', 'river', 'gloam', 'ash', 'blood', 'bone', 'iron', 'star', 'moon', 'sun', 'shadow', 'soul',
  'spirit', 'rune', 'frost', 'flame', 'fire', 'thorn', 'oath', 'wind', 'stone', 'kiln', 'salt', 'sky', 'night', 'dusk', 'dawn',
  'void', 'doom', 'dread', 'grim', 'war', 'rite', 'spell', 'vessel', 'brand', 'bond', 'glass', 'hearth', 'dream', 'mind', 'wolf',
  'raven', 'crow', 'serpent', 'wyrm', 'hex', 'sigil', 'glyph', 'whorl', 'saga', 'dust', 'gale', 'cinder', 'smoke', 'mist', 'rift',
  'veil', 'vesper', 'sable', 'wild', 'gold', 'grave', 'bright'];
export const TAILS = ['guard', 'forge', 'ward', 'bound', 'born', 'kiss', 'kissed', 'tithe', 'fathers', 'father', 'mother', 'weave',
  'weaver', 'shard', 'sworn', 'kin', 'fall', 'mark', 'smith', 'wright', 'caller', 'call', 'binder', 'walker', 'blade', 'fang',
  'heart', 'song', 'wake', 'warden', 'keep', 'crest', 'brand', 'shade', 'veil', 'lore', 'craft', 'spire', 'bane', 'bringer',
  'breaker', 'seeker', 'singer', 'speaker', 'sight', 'touched', 'blessed', 'cursed', 'forged', 'wrought', 'shaper', 'tide',
  'glow', 'lit', 'metal', 'spill', 'work', 'stride', 'reach', 'light', 'fire', 'flame', 'storm', 'wind', 'stone', 'wood'];
// Reviewed English words that happen to match; extend only with real words, never coinages.
export const ALLOW = new Set(['stonework', 'ironwork', 'ironworks', 'firework', 'fireworks', 'firestorm', 'windfall', 'wildfire',
  'firebrand', 'spellbound', 'moonstone', 'bloodstone', 'sunlit', 'moonlit', 'starlit', 'firelit', 'nightfall', 'sunlight',
  'moonlight', 'starlight', 'firelight', 'hearthstone', 'sunstone', 'windward', 'skyward', 'firewall', 'firewood', 'driftwood',
  'ashwood', 'grimwood', 'wildwood', 'goldsmith', 'goldwork', 'stonecraft', 'witchcraft', 'firestone', 'starfire', 'bloodlust',
  'firemark', 'sunfire', 'brightwork', 'goldcrest', 'stoneware', 'ashfall', 'runestone', 'runestones']);
const COMPOUND = new RegExp(`^(?:${HEADS.join('|')})-?(?:${TAILS.join('|')})(?:s|es)?$`, 'i');
// Invented setting words and channel misuse (literal embers, rivers and kilns are fine).
const INVENTED = /^(?:gloam|testimony|saga|sagas|whorl|whorls|kilnfathers|vesselforge|spellforge|skymetal)$/i;
// Invented ailment names, capitalised as in game text (lowercase "a heavy jolt" is English).
const AILMENT = /^(?:Scald|Scalds|Scalded|Numb|Numbs|Numbed|Jolt|Jolts|Jolted)$/;
const CHANNEL = /\b(?:Ember|River|Storm|Gloam)\s+(?:Damage|Resistance|Res)\b/gi;

const IDENT = [/\$\{[^}]*\}/g, /\S*\/\S*/g, /\b_\w+/g, /\b[a-z][a-z0-9]*(?:[_-][a-z0-9]+)+\b/g, /\b[a-z]+[A-Z][A-Za-z0-9]*\b/g, /\b[A-Z][a-z]+[A-Z][A-Za-z0-9]*\b/g];
export function flag(text) {
  if (typeof text !== 'string' || /^\s*[a-z][a-z0-9]*\s*$/.test(text)) return [];
  const hits = [...text.matchAll(CHANNEL)].map(m => [m[0], 'channel term']);
  let prose = text;
  for (const re of IDENT) prose = prose.replace(re, ' ');
  for (const token of prose.match(/[A-Za-z][A-Za-z'-]*[A-Za-z]/g) || []) {
    const word = token.toLowerCase().replace(/'s$/, '');
    if (ALLOW.has(word)) continue;
    if (COMPOUND.test(word)) hits.push([token, 'invented compound']);
    else if (INVENTED.test(word) || AILMENT.test(token)) hits.push([token, 'invented term']);
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
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (['node_modules', 'tests', 'dist', 'scripts', '.git'].includes(name)) continue;
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}
const SKIP = /(?:^|\/)(?:test\.js|download-intake\.js)$|\.test\.m?js$|\.min\.js$|vendor|three/;
function files() {
  const list = [join(ROOT, 'index.html'), join(ROOT, 'dashboard.js')];
  for (const path of walk(join(ROOT, 'tools'))) {
    if (SKIP.test(path) || statSync(path).size > 8_000_000) continue;
    if (/\.(?:html|js|mjs)$/.test(path) || path.endsWith('wizard.module.json')) list.push(path);
  }
  for (const path of walk(join(ROOT, 'shared'))) if (path.endsWith('.js')) list.push(path);
  return list;
}

const report = [];
for (const path of files()) {
  const text = readFileSync(path, 'utf8');
  let parts;
  if (path.endsWith('.html')) parts = htmlStrings(text);
  else if (path.endsWith('wizard.module.json')) {
    const data = JSON.parse(text);
    parts = ['name', 'title', 'description', 'summary'].map(key => [0, String(data[key] ?? '')]);
  } else parts = codeStrings(text);
  for (const [line, value] of parts) for (const [term, why] of flag(value)) report.push({ file: relative(ROOT, path), line, term, why, text: value.trim().slice(0, 100) });
}

const table = report.map(r => `| ${r.file}:${r.line} | ${r.term} | ${r.why} | ${r.text.replace(/\|/g, '/')} |`).join('\n');
if (process.argv.includes('--report') || report.length) {
  console.log(`# Invented terms in player-facing text (${report.length})\n\n| Where | Term | Why | Text |\n|---|---|---|---|\n${table}\n`);
}
assert.equal(report.length, 0, `${report.length} invented term(s) in player-facing text; see the table above.`);
// Self-test: catches coinages and channel misuse, allows English words and keys.
assert.ok(flag('Emberguard Helm').length && flag('Vesselforge engine').length && flag('+8% Ember Resistance').length);
assert.ok(!flag('Firestorm and windward stonework').length && !flag('emberkiss').length && !flag('the ember cup').length);
console.log(`No invented compounds or setting terms in ${files().length} player-facing files.`);
