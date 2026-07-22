'use strict';

var assert = require('assert');
var Core = require('./core.js');
var signatures = new Set();
var previousTarget = 0;

function replayPushes(level, actions) {
  var boxes = level.boxes.slice();
  var player = level.player;
  actions.forEach(function (action, step) {
    var boxIndex = boxes.indexOf(action.box);
    assert.notStrictEqual(boxIndex, -1, 'route step ' + step + ' must address a box');
    var direction = Core.DIRS[action.direction];
    var source = Core.pointOf(action.box, level.width);
    var stand = Core.indexOf(source.x - direction.x, source.y - direction.y, level.width);
    var access = Core.reachable(level.floor, level.width, player, new Set(boxes));
    assert.strictEqual(access.has(stand), true, 'route step ' + step + ' must be reachable');
    assert.strictEqual(boxes.indexOf(action.destination), -1, 'route step ' + step + ' destination must be open');
    boxes[boxIndex] = action.destination;
    player = action.box;
  });
  var goals = new Set(level.goals);
  assert.strictEqual(boxes.every(function (box) { return goals.has(box); }), true, 'route must finish on every goal');
}

function hasLargeOpenRectangle(level) {
  return [[4, 3], [3, 4]].some(function (shape) {
    for (var y = 1; y <= level.height - shape[1] - 1; y += 1) {
      for (var x = 1; x <= level.width - shape[0] - 1; x += 1) {
        var open = true;
        for (var py = 0; py < shape[1]; py += 1) {
          for (var px = 0; px < shape[0]; px += 1) {
            if (!level.floor.has(Core.indexOf(x + px, y + py, level.width))) open = false;
          }
        }
        if (open) return true;
      }
    }
    return false;
  });
}

for (var floor = 1; floor <= 16; floor += 1) {
  var level = Core.generate('TEST42', floor);
  var solved = Core.solve(level, { limit: 90000 });
  assert.strictEqual(solved.solved, true, 'floor ' + floor + ' must be solvable');
  assert.strictEqual(solved.pushes, level.solution.pushes, 'floor ' + floor + ' proof must be reproducible');
  assert.strictEqual(level.boxes.length, level.goals.length, 'floor ' + floor + ' must pair boxes and goals');
  assert.strictEqual(signatures.has(level.signature), false, 'floor ' + floor + ' must be unique in the run');
  signatures.add(level.signature);
  assert.ok(level.rating.score >= level.config.minScore, 'floor ' + floor + ' must reach its measured difficulty band');
  assert.strictEqual(hasLargeOpenRectangle(level), false, 'floor ' + floor + ' must avoid large empty rooms');
  assert.ok(level.solution.analysis && level.solution.analysis.motif, 'floor ' + floor + ' must expose a logical motif');
  assert.strictEqual(level.solution.moveOptimal, true, 'floor ' + floor + ' must prove least moves among least pushes');
  assert.strictEqual(Core.routeMoveCount(level, level.solution.actions), level.solution.moves, 'floor ' + floor + ' must report exact route movement');
  assert.ok(level.config.minPushes >= previousTarget, 'difficulty target must never decrease');
  previousTarget = level.config.minPushes;
  var replay = Core.generate('TEST42', floor);
  assert.strictEqual(replay.signature, level.signature, 'floor ' + floor + ' must be deterministic');
}

var abyss = Core.generate('TEST42', 800);
assert.ok(abyss.width >= 13 && abyss.height >= 11, 'floor 800 must use the abyss board size');
assert.strictEqual(abyss.boxes.length, 4, 'floor 800 must use four boxes');
assert.ok(abyss.distanceLowerBound >= abyss.config.minPushes, 'floor 800 must meet its geometric push lower bound');
assert.ok((abyss.width - 2) * (abyss.height - 2) - abyss.floor.size >= 15, 'floor 800 must contain substantial interior structure');
assert.strictEqual(hasLargeOpenRectangle(abyss), false, 'floor 800 must avoid large empty rooms');
assert.ok(abyss.solution.analysis.interdependence >= 4, 'floor 800 must interweave box subproblems');
assert.ok(abyss.rating.score >= 60, 'floor 800 must reach the abyss difficulty band');
replayPushes(abyss, abyss.solution.actions);
assert.strictEqual(Core.routeMoveCount(abyss, abyss.solution.actions), abyss.solution.moves, 'floor 800 route movement must be exact');

var terminal = Core.generate('TEST42', 999999);
assert.ok(terminal.width >= 19 && terminal.height >= 15, 'floor 999999 must use the terminal warehouse size');
assert.strictEqual(terminal.boxes.length, 8, 'floor 999999 must use eight boxes');
assert.ok(terminal.solution.actions.length >= 40, 'floor 999999 must require a substantial constructive proof');
assert.strictEqual(terminal.solution.analysis.boxesUsed, 8, 'floor 999999 proof must involve every box');
assert.ok(terminal.solution.analysis.interdependence >= 16, 'floor 999999 must strongly interweave box subproblems');
assert.ok(terminal.solution.analysis.structure >= 40, 'floor 999999 must contain warehouse-scale interior structure');
assert.ok(terminal.solution.moves / terminal.solution.actions.length <= 7, 'floor 999999 proof must avoid excessive walking between pushes');
assert.strictEqual(hasLargeOpenRectangle(terminal), false, 'floor 999999 must avoid large empty rooms');
replayPushes(terminal, terminal.solution.actions);
assert.strictEqual(Core.routeMoveCount(terminal, terminal.solution.actions), terminal.solution.moves, 'floor 999999 route movement must be exact');
assert.strictEqual(Core.generate('TEST42', 999999).signature, terminal.signature, 'floor 999999 must remain deterministic');

var depthSamples = [1, 12, 40, 800, 2000, 10000, 100000, 999999].map(Core.configFor);
for (var depth = 1; depth < depthSamples.length; depth += 1) {
  assert.ok(depthSamples[depth].width >= depthSamples[depth - 1].width, 'warehouse width must not shrink with depth');
  assert.ok(depthSamples[depth].height >= depthSamples[depth - 1].height, 'warehouse height must not shrink with depth');
  assert.ok(depthSamples[depth].boxes >= depthSamples[depth - 1].boxes, 'active box count must not shrink with depth');
  assert.ok(depthSamples[depth].minPushes >= depthSamples[depth - 1].minPushes, 'push target must not shrink with depth');
}

console.log('Verified 16 progressive floors plus replayable floors 800 and 999999 with no deep-floor plateau.');
