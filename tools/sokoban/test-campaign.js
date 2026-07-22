'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var Core = require('./core.js');
require('./levels.js');
require('./runtime.js');

var campaign = global.SokobanCampaign;
var Runtime = global.SokobanRuntime;
assert.ok(campaign && Runtime, 'campaign and runtime must load without a browser');
assert.strictEqual(campaign.levels.length, 24, 'Vault I must contain 24 frozen stages');

var previousDifficulty = -Infinity;
campaign.levels.forEach(function (raw, index) {
  assert.strictEqual(raw.stage, index + 1, 'stage numbers must be contiguous');
  assert.ok(raw.difficultyKey >= previousDifficulty, 'offline difficulty order must never decrease');
  previousDifficulty = raw.difficultyKey;
  var level = Runtime.hydrate(raw);
  assert.ok(level.floor instanceof Set && level.walls instanceof Set, 'runtime must hydrate compact arrays');
  assert.strictEqual(level.boxes.length, level.goals.length, 'every relic needs one seal');
  assert.strictEqual(Core.routeMoveCount(level, level.solution.actions), level.solution.moves,
    'stored proof route must replay exactly at stage ' + (index + 1));
  assert.deepStrictEqual(Array.from(level.deadSquares).sort(function (a, b) { return a - b; }),
    Array.from(Core.staticDeadSquares(level)).sort(function (a, b) { return a - b; }),
    'stored taboo cells must match the offline solver');
});

var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
var game = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
assert.strictEqual(/<script src="core\.js"><\/script>/.test(html), false, 'offline solver must not ship in the page');
assert.ok(/<script src="levels\.js"><\/script>/.test(html), 'page must load the frozen pack');
assert.strictEqual(/Core\.(solve|generate)\s*\(/.test(game), false, 'browser runtime must never solve or generate');

console.log('Verified 24 frozen Verdigris stages, proof routes, taboo cells, and a solver-free browser bundle.');
