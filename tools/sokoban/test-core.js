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

for (var floor = 1; floor <= 16; floor += 1) {
  var level = Core.generate('TEST42', floor);
  var solved = Core.solve(level, { limit: 90000 });
  assert.strictEqual(solved.solved, true, 'floor ' + floor + ' must be solvable');
  assert.strictEqual(solved.pushes, level.solution.pushes, 'floor ' + floor + ' proof must be reproducible');
  assert.strictEqual(level.boxes.length, level.goals.length, 'floor ' + floor + ' must pair boxes and goals');
  assert.strictEqual(signatures.has(level.signature), false, 'floor ' + floor + ' must be unique in the run');
  signatures.add(level.signature);
  assert.ok(level.rating.score >= level.config.minScore, 'floor ' + floor + ' must reach its measured difficulty band');
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
replayPushes(abyss, abyss.solution.actions);

console.log('Verified 16 progressive floors plus a mazelike, replayable floor 800.');
