import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const Stats = require('../../rpg_inventory/core/verdigris-stats.js');
const Pack = require('../../rpg_inventory/core/verdigris-pack.js');
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(read('../assets/tree-data.js'), context);
const tree = context.TREE_DATA;

assert.deepEqual(Stats.CHANNEL_LABELS, { physical: 'Physical', ember: 'Fire', river: 'Cold', storm: 'Lightning', gloam: 'Chaos' });
// Saved numeric keys keep their meaning; the correction only changes display vocabulary.
assert.deepEqual(Stats.CHANNELS, ['physical', 'ember', 'river', 'storm', 'gloam']);
for (const [id, label] of [['ember_resistance', 'Fire Resistance'], ['river_resistance', 'Cold Resistance'], ['storm_resistance', 'Lightning Resistance'], ['gloam_resistance', 'Chaos Resistance'], ['added_ember', 'added Fire Damage']]) {
  assert.equal(Stats.STAT_REGISTRY[id].label, label);
}
assert.equal(Pack.brandMods.emberkiss.label, 'Adds {v} Fire Damage');
assert.equal(Pack.brandMods.emberward.label, '+{v}% to Fire Resistance');
assert.equal(Pack.brandMods.riverblessed.label, '+{v}% to Cold Resistance');
// October 26: node titles are functional (see owner-rules/lint.mjs for the full lint).
for (const [id, name] of [['3,-2', 'Cold Resistance'], ['-2,-2', 'Projectile Damage'], ['-2,8', 'Added Fire Damage'], ['8,-4', 'Sign: Mark Chilled Enemies'], ['-4,-4', 'Sign: Double Shock Stacks']]) {
  assert.equal(tree.seats[id].name, name);
}
const effects = Object.values(tree.seats).flatMap(seat => seat.effects || []).join('\n');
assert.doesNotMatch(effects, /\b(?:Ember|River|Storm|Gloam)\b/);
assert.match(effects, /You deal no Physical, Cold, Lightning, or Chaos damage/);
// The September 21 exceptions (Storm Shelf, Storm of Handles, River Road North) were renamed
// to functional titles on October 26; none may return.
for (const title of ['Storm Shelf', 'Storm of Handles', 'River Road North']) {
  assert.ok(!Object.values(tree.seats).some(seat => seat.name === title), `Retired title returned: ${title}`);
}
for (const file of ['../scripts/author-tree.mjs', '../index.html', '../assets/jewels.js', '../../rpg_inventory/core/verdigris-pack.js']) {
  assert.doesNotMatch(read(file), /\b(?:Ember|River|Storm|Gloam) (?:[Dd]amage|[Rr]esistance|Res\b)/, file);
}
const inventory = read('../../rpg_inventory/index.html');
assert.match(inventory, /sheet\.resEmber\}<\/strong> Fire/);
assert.match(inventory, /sheet\.resRiver\}<\/strong> Cold/);
assert.match(inventory, /sheet\.resStorm\}<\/strong> Lightning/);
assert.match(inventory, /sheet\.resGloam\}<\/strong> Chaos/);
// Craft pigment descriptions are active modifier-tag explanations, not landscape prose.
const toolDescriptions = inventory.match(/const TOOL_DESC = (\{[\s\S]*?\n  \});/);
assert.ok(toolDescriptions, 'Inventory defines its crafting tooltips');
const tools = vm.runInNewContext('(' + toolDescriptions[1] + ')');
assert.equal(tools.soot, 'Pigment — searing leans toward spirit and Fire.');
assert.equal(tools.marsh_ochre, 'Pigment — searing leans toward fortune, swiftness and Cold.');
assert.doesNotMatch(Object.values(tools).join('\n'), /\b(?:ember|river|storm|gloam)\b/i);
console.log('Combat display terminology, legacy keys, node titles and preserved unrelated wording passed.');
