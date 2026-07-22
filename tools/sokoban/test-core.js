'use strict';

var assert = require('assert');
var Core = require('./core.js');
var signatures = new Set();
var previousTarget = 0;

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

console.log('Verified 16 deterministic, unique, solver-proven floors.');
