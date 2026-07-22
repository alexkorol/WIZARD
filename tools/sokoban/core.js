(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SokobanCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DIRS = [
    { x: 0, y: -1, name: 'north' },
    { x: 1, y: 0, name: 'east' },
    { x: 0, y: 1, name: 'south' },
    { x: -1, y: 0, name: 'west' }
  ];

  function hash32(value) {
    var h = 2166136261 >>> 0;
    var text = String(value);
    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h += h << 13; h ^= h >>> 7;
    h += h << 3; h ^= h >>> 17;
    h += h << 5;
    return h >>> 0;
  }

  function randomFrom(seed) {
    var state = hash32(seed) || 0x6d2b79f5;
    return function () {
      state += 0x6d2b79f5;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, list) {
    return list[Math.floor(rng() * list.length)];
  }

  function shuffle(rng, list) {
    for (var i = list.length - 1; i > 0; i -= 1) {
      var j = Math.floor(rng() * (i + 1));
      var hold = list[i]; list[i] = list[j]; list[j] = hold;
    }
    return list;
  }

  function indexOf(x, y, width) { return y * width + x; }
  function pointOf(index, width) { return { x: index % width, y: Math.floor(index / width) }; }

  function configFor(level) {
    var n = Math.max(1, Math.floor(level));
    var tutorials = [
      { width: 7, height: 7, boxes: 1, minPushes: 2, maxPushes: 5, pulls: 6, partitions: 0, pillars: 1 },
      { width: 8, height: 7, boxes: 1, minPushes: 4, maxPushes: 7, pulls: 9, partitions: 0, pillars: 2 },
      { width: 8, height: 8, boxes: 2, minPushes: 5, maxPushes: 9, pulls: 12, partitions: 0, pillars: 3 },
      { width: 9, height: 8, boxes: 2, minPushes: 7, maxPushes: 11, pulls: 15, partitions: 1, pillars: 1 }
    ];
    if (n <= tutorials.length) {
      tutorials[n - 1].minScore = [4, 8, 13, 16][n - 1];
      tutorials[n - 1].maxScore = [8, 13, 18, 22][n - 1];
      return tutorials[n - 1];
    }
    var depthBand = Math.floor(Math.log2(n));
    var minPushes = Math.min(22, 5 + depthBand * 2);
    var minScore = n < 10 ? 18 : n < 20 ? 26 : n < 40 ? 31 : n < 100 ? 36 : 40;
    return {
      width: n < 10 ? 9 : n < 20 ? 10 : n < 40 ? 11 : n < 100 ? 12 : 13,
      height: n < 20 ? 9 : n < 40 ? 10 : n < 100 ? 10 : 11,
      boxes: n < 10 ? 2 : n < 40 ? 3 : 4,
      minPushes: minPushes,
      maxPushes: minPushes + 4,
      minScore: minScore,
      maxScore: minScore + 10,
      pulls: minPushes + 12,
      partitions: n < 10 ? 1 : n < 20 ? 2 : n < 40 ? 3 : 4,
      pillars: n < 20 ? 2 : n < 100 ? 3 : 4,
      solverLimit: n < 40 ? 55000 : 15000
    };
  }

  function isConnected(floor, width) {
    if (!floor.size) return false;
    var first = floor.values().next().value;
    var seen = new Set([first]);
    var queue = [first];
    for (var head = 0; head < queue.length; head += 1) {
      var p = pointOf(queue[head], width);
      for (var d = 0; d < DIRS.length; d += 1) {
        var next = indexOf(p.x + DIRS[d].x, p.y + DIRS[d].y, width);
        if (floor.has(next) && !seen.has(next)) { seen.add(next); queue.push(next); }
      }
    }
    return seen.size === floor.size;
  }

  function tryRemove(floor, cells, width, minimum) {
    var removed = [];
    cells.forEach(function (cell) {
      if (floor.has(cell)) { floor.delete(cell); removed.push(cell); }
    });
    if (floor.size >= minimum && isConnected(floor, width)) return true;
    removed.forEach(function (cell) { floor.add(cell); });
    return false;
  }

  function carveFloor(config, rng) {
    var width = config.width;
    var height = config.height;
    var floor = new Set();
    for (var y = 1; y < height - 1; y += 1) {
      for (var x = 1; x < width - 1; x += 1) floor.add(indexOf(x, y, width));
    }
    var minimum = config.boxes * 7 + 12;
    var usedColumns = [];
    var usedRows = [];
    var partitions = config.partitions || 0;

    for (var segment = 0; segment < partitions; segment += 1) {
      var vertical = segment % 2 === 0;
      var choices = [];
      var position;
      if (vertical) {
        for (position = 2; position <= width - 3; position += 1) {
          if (usedColumns.every(function (used) { return Math.abs(used - position) > 1; })) choices.push(position);
        }
      } else {
        for (position = 2; position <= height - 3; position += 1) {
          if (usedRows.every(function (used) { return Math.abs(used - position) > 1; })) choices.push(position);
        }
      }
      if (!choices.length) continue;
      position = pick(rng, choices);
      if (vertical) usedColumns.push(position); else usedRows.push(position);

      var longSide = vertical ? height : width;
      var doorway = 2 + Math.floor(rng() * Math.max(1, longSide - 4));
      var doorwayWidth = config.boxes >= 4 && rng() < 0.4 ? 2 : 1;
      var wallCells = [];
      for (var along = 1; along < longSide - 1; along += 1) {
        if (along >= doorway && along < doorway + doorwayWidth) continue;
        var wx = vertical ? position : along;
        var wy = vertical ? along : position;
        wallCells.push(indexOf(wx, wy, width));
      }
      tryRemove(floor, wallCells, width, minimum);
    }

    var candidates = shuffle(rng, Array.from(floor));
    var placed = 0;
    for (var i = 0; i < candidates.length && placed < (config.pillars || 0); i += 1) {
      var cell = candidates[i];
      var p = pointOf(cell, width);
      if (p.x <= 1 || p.x >= width - 2 || p.y <= 1 || p.y >= height - 2) continue;
      if (tryRemove(floor, [cell], width, minimum)) placed += 1;
    }
    return floor;
  }

  function reachable(floor, width, start, boxSet) {
    var seen = new Set();
    if (!floor.has(start) || boxSet.has(start)) return seen;
    var queue = [start];
    seen.add(start);
    for (var head = 0; head < queue.length; head += 1) {
      var p = pointOf(queue[head], width);
      for (var d = 0; d < DIRS.length; d += 1) {
        var next = indexOf(p.x + DIRS[d].x, p.y + DIRS[d].y, width);
        if (floor.has(next) && !boxSet.has(next) && !seen.has(next)) {
          seen.add(next); queue.push(next);
        }
      }
    }
    return seen;
  }

  function goalCandidates(floor, width) {
    return Array.from(floor).filter(function (cell) {
      var p = pointOf(cell, width);
      return DIRS.some(function (d) {
        return floor.has(indexOf(p.x - d.x, p.y - d.y, width)) &&
          floor.has(indexOf(p.x - d.x * 2, p.y - d.y * 2, width));
      });
    });
  }

  function chooseGoals(floor, width, count, rng) {
    var pool = shuffle(rng, goalCandidates(floor, width));
    var goals = [];
    for (var i = 0; i < pool.length && goals.length < count; i += 1) {
      var p = pointOf(pool[i], width);
      var separated = goals.every(function (goal) {
        var g = pointOf(goal, width);
        return Math.abs(p.x - g.x) + Math.abs(p.y - g.y) > 1;
      });
      if (separated) goals.push(pool[i]);
    }
    return goals.length === count ? goals : null;
  }

  function assignmentDistance(boxes, goals, width) {
    var best = Infinity;
    var used = new Array(goals.length).fill(false);
    function visit(boxIndex, total) {
      if (total >= best) return;
      if (boxIndex === boxes.length) { best = total; return; }
      var box = pointOf(boxes[boxIndex], width);
      for (var goalIndex = 0; goalIndex < goals.length; goalIndex += 1) {
        if (used[goalIndex]) continue;
        var goal = pointOf(goals[goalIndex], width);
        used[goalIndex] = true;
        visit(boxIndex + 1, total + Math.abs(box.x - goal.x) + Math.abs(box.y - goal.y));
        used[goalIndex] = false;
      }
    }
    visit(0, 0);
    return best;
  }

  function reverseScramble(floor, width, goals, player, pullCount, targetDistance, rng) {
    var boxes = goals.map(function (position, id) { return { id: id, position: position }; });
    var previous = null;
    var used = new Array(boxes.length).fill(0);
    var moves = [];
    var visited = new Set([goals.slice().sort(function (a, b) { return a - b; }).join(',')]);

    for (var step = 0; step < pullCount; step += 1) {
      var boxSet = new Set(boxes.map(function (box) { return box.position; }));
      var currentDistance = assignmentDistance(Array.from(boxSet), goals, width);
      var walkable = reachable(floor, width, player, boxSet);
      var legal = [];
      boxes.forEach(function (box) {
        var p = pointOf(box.position, width);
        DIRS.forEach(function (d, direction) {
          var near = indexOf(p.x - d.x, p.y - d.y, width);
          var far = indexOf(p.x - d.x * 2, p.y - d.y * 2, width);
          if (!floor.has(near) || !floor.has(far) || boxSet.has(near) || boxSet.has(far) || !walkable.has(near)) return;
          var isUndo = previous && previous.id === box.id && previous.from === near && previous.to === box.position;
          var positions = boxes.map(function (candidate) { return candidate.id === box.id ? near : candidate.position; });
          var key = positions.slice().sort(function (a, b) { return a - b; }).join(',');
          legal.push({
            box: box, id: box.id, direction: direction, from: box.position, to: near, player: far,
            isUndo: isUndo, visited: visited.has(key), key: key,
            distance: assignmentDistance(positions, goals, width)
          });
        });
      });
      var novel = legal.filter(function (move) { return !move.visited; });
      if (novel.length) legal = novel;
      var preferred = legal.filter(function (move) { return !move.isUndo; });
      if (preferred.length) legal = preferred;
      if (currentDistance < targetDistance) {
        var outward = legal.filter(function (move) { return move.distance > currentDistance; });
        if (outward.length) legal = outward;
        else {
          var lateral = legal.filter(function (move) { return move.distance === currentDistance; });
          if (lateral.length) legal = lateral;
        }
      } else {
        var staysDeep = legal.filter(function (move) { return move.distance >= targetDistance; });
        if (staysDeep.length) legal = staysDeep;
      }
      if (!legal.length) break;
      legal.sort(function (a, b) {
        var aScore = -a.distance * 5 + used[a.id] * 2 + rng();
        var bScore = -b.distance * 5 + used[b.id] * 2 + rng();
        return aScore - bScore;
      });
      var choicePool = legal.slice(0, Math.min(3, legal.length));
      var move = pick(rng, choicePool);
      move.box.position = move.to;
      player = move.player;
      used[move.id] += 1;
      visited.add(move.key);
      moves.push({ box: move.from, destination: move.to, direction: move.direction, id: move.id });
      previous = move;
    }

    return {
      boxes: boxes.map(function (box) { return box.position; }),
      player: player,
      pulls: moves.length,
      touched: used.filter(function (count) { return count > 0; }).length,
      lowerBound: assignmentDistance(boxes.map(function (box) { return box.position; }), goals, width),
      knownSolution: moves.slice().reverse().map(function (move) {
        return { box: move.destination, destination: move.box, direction: move.direction, id: move.id };
      })
    };
  }

  function stateKey(boxes, reachableCells) {
    var sorted = boxes.slice().sort(function (a, b) { return a - b; });
    var anchor = Infinity;
    reachableCells.forEach(function (cell) { if (cell < anchor) anchor = cell; });
    return sorted.join(',') + '|' + anchor;
  }

  function solve(level, options) {
    options = options || {};
    var limit = options.limit || 70000;
    var floor = level.floor instanceof Set ? level.floor : new Set(level.floor);
    var goalSet = new Set(level.goals);
    var width = level.width;
    var startBoxes = level.boxes.slice().sort(function (a, b) { return a - b; });
    var startReach = reachable(floor, width, level.player, new Set(startBoxes));
    var startKey = stateKey(startBoxes, startReach);
    var queue = [{ boxes: startBoxes, player: level.player, key: startKey, depth: 0, access: startReach }];
    var visited = new Set([startKey]);
    var parents = new Map();
    var solvedNode = null;
    var deadSquares = new Set();
    floor.forEach(function (cell) {
      if (goalSet.has(cell)) return;
      var p = pointOf(cell, width);
      var verticalWall = !floor.has(indexOf(p.x, p.y - 1, width)) || !floor.has(indexOf(p.x, p.y + 1, width));
      var horizontalWall = !floor.has(indexOf(p.x - 1, p.y, width)) || !floor.has(indexOf(p.x + 1, p.y, width));
      if (verticalWall && horizontalWall) deadSquares.add(cell);
    });

    function isSolved(boxes) {
      return boxes.every(function (box) { return goalSet.has(box); });
    }

    if (isSolved(startBoxes)) solvedNode = queue[0];
    for (var head = 0; !solvedNode && head < queue.length && visited.size < limit; head += 1) {
      var node = queue[head];
      var boxSet = new Set(node.boxes);
      var access = node.access;
      for (var b = 0; b < node.boxes.length && !solvedNode; b += 1) {
        var box = node.boxes[b];
        var p = pointOf(box, width);
        for (var d = 0; d < DIRS.length; d += 1) {
          var direction = DIRS[d];
          var stand = indexOf(p.x - direction.x, p.y - direction.y, width);
          var destination = indexOf(p.x + direction.x, p.y + direction.y, width);
          if (!access.has(stand) || !floor.has(destination) || boxSet.has(destination) || deadSquares.has(destination)) continue;
          var nextBoxes = node.boxes.slice();
          nextBoxes[b] = destination;
          nextBoxes.sort(function (a, c) { return a - c; });
          var nextReach = reachable(floor, width, box, new Set(nextBoxes));
          var key = stateKey(nextBoxes, nextReach);
          if (visited.has(key)) continue;
          visited.add(key);
          var child = { boxes: nextBoxes, player: box, key: key, depth: node.depth + 1, access: nextReach };
          parents.set(key, { previous: node.key, action: { box: box, destination: destination, direction: d } });
          queue.push(child);
          if (isSolved(nextBoxes)) { solvedNode = child; break; }
        }
      }
    }

    if (!solvedNode) return { solved: false, states: visited.size, limited: visited.size >= limit };
    var actions = [];
    var cursor = solvedNode.key;
    while (cursor !== startKey) {
      var link = parents.get(cursor);
      if (!link) break;
      actions.push(link.action);
      cursor = link.previous;
    }
    actions.reverse();
    var switches = 0;
    for (var i = 1; i < actions.length; i += 1) {
      if (actions[i - 1].destination !== actions[i].box) switches += 1;
    }
    return {
      solved: true,
      pushes: solvedNode.depth,
      states: visited.size,
      switches: switches,
      actions: actions,
      firstPush: actions[0] || null
    };
  }

  function buildCandidate(campaignSeed, levelNumber, attempt, config) {
    var seed = campaignSeed + ':' + levelNumber + ':' + attempt;
    var rng = randomFrom(seed);
    var floor = carveFloor(config, rng);
    var goals = chooseGoals(floor, config.width, config.boxes, rng);
    if (!goals) return null;
    var open = Array.from(floor).filter(function (cell) { return goals.indexOf(cell) === -1; });
    if (!open.length) return null;
    var player = pick(rng, open);
    var extraPulls = Math.floor(rng() * 5);
    var scrambled = reverseScramble(floor, config.width, goals, player, config.pulls + extraPulls, config.minPushes, rng);
    if (scrambled.pulls < config.minPushes || scrambled.lowerBound < config.minPushes || scrambled.touched < Math.min(config.boxes, 2)) return null;
    var level = {
      width: config.width,
      height: config.height,
      floor: floor,
      goals: goals.slice(),
      boxes: scrambled.boxes,
      player: scrambled.player
    };
    var solution = solve(level, { limit: config.solverLimit || 55000 });
    if (!solution.solved && !solution.limited) return null;
    if (!solution.solved) {
      var boundsMeet = scrambled.knownSolution.length === scrambled.lowerBound;
      solution = {
        solved: true,
        optimal: boundsMeet,
        proof: boundsMeet ? 'bounds' : 'constructive',
        limited: true,
        pushes: scrambled.lowerBound,
        lowerBound: scrambled.lowerBound,
        routePushes: scrambled.knownSolution.length,
        states: solution.states,
        switches: Math.max(1, scrambled.touched - 1),
        actions: scrambled.knownSolution,
        firstPush: scrambled.knownSolution[0] || null
      };
    } else {
      solution.optimal = true;
      solution.proof = 'search';
      solution.lowerBound = solution.pushes;
      solution.routePushes = solution.pushes;
    }
    level.solution = solution;
    level.reversePulls = scrambled.pulls;
    level.distanceLowerBound = scrambled.lowerBound;
    level.seed = seed;
    return level;
  }

  function signature(level) {
    return [
      level.width + 'x' + level.height,
      Array.from(level.floor).sort(function (a, b) { return a - b; }).join('.'),
      level.goals.slice().sort(function (a, b) { return a - b; }).join('.'),
      level.boxes.slice().sort(function (a, b) { return a - b; }).join('.'),
      level.player
    ].join('|');
  }

  function ratingFor(levelNumber, solution) {
    var score = solution.pushes + solution.switches * 1.5 + Math.log2(solution.states + 1);
    var title = 'Initiate';
    if (score >= 18) title = 'Delver';
    if (score >= 28) title = 'Pathfinder';
    if (score >= 40) title = 'Warden';
    if (score >= 54) title = 'Abyssal';
    return { score: Math.round(score), title: levelNumber <= 4 ? 'Tutorial' : title };
  }

  function generate(campaignSeed, levelNumber) {
    var config = configFor(levelNumber);
    var best = null;
    var bestDistance = Infinity;
    var attemptLimit = config.boxes >= 4 ? 14 : 20;
    for (var attempt = 0; attempt < attemptLimit; attempt += 1) {
      var candidate = buildCandidate(campaignSeed, levelNumber, attempt, config);
      if (!candidate) continue;
      var pushes = candidate.solution.pushes;
      var candidateScore = ratingFor(levelNumber, candidate.solution).score;
      var pushFloor = Math.max(2, config.minPushes);
      var distance = pushes < pushFloor ? (pushFloor - pushes) * 5 : 0;
      if (candidateScore < config.minScore) distance += (config.minScore - candidateScore) * 4;
      else if (candidateScore > config.maxScore) distance += (candidateScore - config.maxScore) * 0.25;
      if (distance < bestDistance || (distance === bestDistance && best && candidate.solution.states > best.solution.states)) {
        best = candidate; bestDistance = distance;
      }
      if (pushes >= config.minPushes && candidateScore >= config.minScore) break;
    }
    if (!best) {
      var fallback = Object.assign({}, config, { minPushes: 1, boxes: Math.min(2, config.boxes), pulls: 8, walls: 1 });
      for (var retry = attemptLimit; retry < attemptLimit + 24 && !best; retry += 1) best = buildCandidate(campaignSeed, levelNumber, retry, fallback);
    }
    if (!best) throw new Error('The dungeon refused this seed. Try another descent.');
    best.number = levelNumber;
    best.campaignSeed = campaignSeed;
    best.config = config;
    best.rating = ratingFor(levelNumber, best.solution);
    best.signature = signature(best);
    return best;
  }

  function directionName(direction) { return DIRS[direction] ? DIRS[direction].name : ''; }

  return {
    DIRS: DIRS,
    configFor: configFor,
    directionName: directionName,
    generate: generate,
    hash32: hash32,
    indexOf: indexOf,
    pointOf: pointOf,
    reachable: reachable,
    signature: signature,
    solve: solve
  };
});
