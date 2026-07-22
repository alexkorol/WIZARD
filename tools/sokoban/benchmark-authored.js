'use strict';

// Benchmarks the browser solver against an external ASCII/HTML level pack.
// The authored levels are deliberately not vendored into WIZARD.

var fs = require('fs');
var Core = require('./core.js');

function extractSchemes(text) {
  var pre = text.match(/<pre[^>]*id=["']levels["'][^>]*>([\s\S]*?)<\/pre>/i);
  if (pre) text = pre[1];
  text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  var levels = [];
  var lines = text.replace(/\r/g, '').split('\n');
  var current = [];
  lines.forEach(function (line) {
    if (/^[ #@+$.*]+$/.test(line) && line.indexOf('#') !== -1) {
      current.push(line.replace(/\s+$/, ''));
    } else if (current.length) {
      levels.push(current);
      current = [];
    }
  });
  if (current.length) levels.push(current);
  return levels;
}

function parseScheme(lines) {
  var width = Math.max.apply(null, lines.map(function (line) { return line.length; }));
  var height = lines.length;
  var board = lines.map(function (line) { return line.padEnd(width, ' '); });
  var outside = new Set();
  var queue = [];
  function visit(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height || board[y][x] !== ' ') return;
    var cell = Core.indexOf(x, y, width);
    if (outside.has(cell)) return;
    outside.add(cell); queue.push(cell);
  }
  for (var x = 0; x < width; x += 1) { visit(x, 0); visit(x, height - 1); }
  for (var y = 0; y < height; y += 1) { visit(0, y); visit(width - 1, y); }
  for (var head = 0; head < queue.length; head += 1) {
    var point = Core.pointOf(queue[head], width);
    Core.DIRS.forEach(function (direction) { visit(point.x + direction.x, point.y + direction.y); });
  }
  var floor = new Set();
  var boxes = [];
  var goals = [];
  var player = -1;
  board.forEach(function (line, row) {
    for (var column = 0; column < width; column += 1) {
      var cell = Core.indexOf(column, row, width);
      var character = line[column];
      if (character !== '#' && !outside.has(cell)) floor.add(cell);
      if (character === '$' || character === '*') boxes.push(cell);
      if (character === '.' || character === '*' || character === '+') goals.push(cell);
      if (character === '@' || character === '+') player = cell;
    }
  });
  return { width: width, height: height, floor: floor, boxes: boxes, goals: goals, player: player };
}

async function main() {
  var source = process.argv[2];
  var count = Math.max(1, Number(process.argv[3]) || 12);
  var limit = Math.max(1000, Number(process.argv[4]) || 250000);
  var weight = Math.max(1, Number(process.argv[5]) || 1);
  var mode = process.argv[6] === 'reverse' ? 'reverse' : 'forward';
  if (!source) throw new Error('Usage: node benchmark-authored.js <file-or-url> [count] [state-limit] [heuristic-weight]');
  var text = /^https?:/i.test(source) ? await (await fetch(source)).text() : fs.readFileSync(source, 'utf8');
  var schemes = extractSchemes(text).slice(0, count);
  var solved = 0;
  schemes.forEach(function (scheme, index) {
    var level = parseScheme(scheme);
    var started = Date.now();
    var result = mode === 'reverse' ? Core.solveReverse(level, { limit: limit }) :
      Core.solve(level, { limit: limit, heuristicWeight: weight });
    var elapsed = Date.now() - started;
    if (result.solved && !Number.isFinite(Core.routeMoveCount(level, result.actions))) {
      throw new Error('Solver returned an invalid route for authored level ' + (index + 1));
    }
    if (result.solved) solved += 1;
    console.log([
      String(index + 1).padStart(2, '0'), result.solved ? 'SOLVED' : result.deadlocked ? 'DEAD' : 'LIMIT',
      'boxes=' + level.boxes.length, 'pushes=' + (result.pushes == null ? '-' : result.pushes),
      'states=' + result.states, 'ms=' + elapsed
    ].join(' '));
  });
  console.log('Solved ' + solved + '/' + schemes.length + ' at a ' + limit.toLocaleString() +
    '-state budget (' + mode + (mode === 'forward' ? ', heuristic weight ' + weight : '') + ').');
}

if (require.main === module) main().catch(function (error) {
  console.error(error.message);
  process.exitCode = 1;
});

module.exports = { extractSchemes: extractSchemes, parseScheme: parseScheme };
