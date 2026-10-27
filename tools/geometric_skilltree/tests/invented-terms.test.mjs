// Fails when invented setting vocabulary or lore reaches player-facing text in the passive
// tree. Owner corrections: September 21 (Fire/Cold/Lightning/Chaos, no Ember/River/Storm/
// Gloam) and October 26 ("stop inventing ai-trope lore"); see the root AGENTS.md.
//
// Scanned: every seat name, effect and tag in assets/tree-data.js; jewel names, notes,
// descriptions and every transform line; stat labels in the shared registry; and every
// string literal and HTML text in index.html (the page UI and its inline socket boards).
// Internal keys stay allowed as compatibility aliases: snake_case, kebab-case and camelCase
// identifiers (ember_res, drowned-court, resEmber) and bare key literals ("saga", "whorl").
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

export const BANNED = [
  'ember', 'embers', 'river', 'storm', 'gloam', 'rover', 'scald', 'scalds', 'scalded', 'numb', 'numbs', 'numbed', 'jolt',
  'jolts', 'jolted', 'testimony', 'saga', 'sagas', 'kiln', 'kilns', 'kilnfathers', 'drowned court', 'salt oath',
  'first herd', 'quiet survey', 'whorl', 'whorl-stone', 'stone-carver', 'born under', 'second breath', 'advantage',
  'calling milestone', 'companion-of-war', 'unlit road', 'drowned study', 'red field', 'high paths', 'the procession',
  'oath of', 'conquered', 'carved stone', 'carved stones', 'calling', 'armoury'
];
const BANNED_RE = new RegExp(`(?<![\\w-])(?:${BANNED.map(w => w.replace(/[-]/g, '\\-')).join('|')})(?![\\w-])`, 'i');
const KEY_LITERALS = new Set(['saga', 'whorl', 'ember', 'river', 'storm', 'gloam', 'conquered', 'testimony', 'kilnfathers']);
// Identifiers are internal keys, not prose: strip them before matching.
const stripKeys = text => text
  .replace(/\$\{[^}]*\}/g, ' ')
  .replace(/\b[a-z][a-z0-9]*(?:[_-][a-z0-9]+)+\b/g, ' ')
  .replace(/\b[a-z]+[A-Z][A-Za-z0-9]*\b/g, ' ');

const offenders = [];
function check(where, text) {
  if (typeof text !== 'string' || KEY_LITERALS.has(text.trim().toLowerCase())) return;
  const match = stripKeys(text).match(BANNED_RE);
  if (match) offenders.push(`${where}: "${match[0]}" in ${JSON.stringify(text.slice(0, 120))}`);
}

// Tree data
const context = vm.createContext({});
vm.runInContext(read('../assets/tree-data.js'), context);
for (const seat of Object.values(context.TREE_DATA.seats)) {
  check(`seat ${seat.id} name`, seat.name);
  (seat.effects || []).forEach(line => check(`seat ${seat.id} effect`, line));
  (seat.tags || []).forEach(tag => check(`seat ${seat.id} tag`, tag));
}

// Jewels: names, notes, descriptions, and the lines every transform can print.
const Jewels = require('../assets/jewels.js');
for (const jewel of Jewels.STASH) {
  check(`jewel ${jewel.id} name`, jewel.name);
  check(`jewel ${jewel.id} note`, jewel.note);
  Jewels.describe(jewel).forEach(line => check(`jewel ${jewel.id} description`, line));
  for (const type of ['small', 'notable']) {
    for (const id of ['0,1', '1,0', '2,-1', '-1,2']) {
      const result = jewel.saga ? Jewels.sagaTransform(jewel, { id, type, stat: 'life', amount: 10 }) : null;
      (result?.lines || []).forEach(line => check(`jewel ${jewel.id} transform`, line));
    }
  }
}
for (const [key, saga] of Object.entries(Jewels.SAGAS)) {
  check(`transform ${key} name`, saga.name);
  check(`transform ${key} philosophy`, saga.philosophy);
}

// Shared stat registry labels (the tree's character sheet reads them).
const Stats = require('../../rpg_inventory/core/verdigris-stats.js');
for (const [id, entry] of Object.entries(Stats.STAT_REGISTRY)) check(`stat ${id} label`, entry.label);

// Page UI: HTML text outside scripts and styles, and every string literal inside scripts.
const html = read('../index.html');
const body = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
body.replace(/<[^>]+>/g, '\n').split('\n').forEach(line => check('index.html text', line));
for (const script of html.match(/<script>[\s\S]*?<\/script>/g) || []) {
  const code = script.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
  for (const m of code.matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) check('index.html string', m[2]);
}

assert.deepEqual(offenders, [], `Invented terms in player-facing text:\n${offenders.join('\n')}`);
console.log('No invented setting vocabulary in player-facing passive tree text.');
