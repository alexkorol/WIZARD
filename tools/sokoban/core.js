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
      tutorials[n - 1].minScore = [4, 5, 10, 14][n - 1];
      tutorials[n - 1].maxScore = [10, 12, 17, 22][n - 1];
      return tutorials[n - 1];
    }
    var depthBand = Math.floor(Math.log2(n));
    var boxes = n < 10 ? 2 : n < 40 ? 3 : n < 2000 ? 4 : n < 50000 ? 5 : n < 200000 ? 6 : n < 500000 ? 7 : n < 800000 ? 7 : 8;
    var minPushes = Math.max(8 + depthBand * 2, boxes * 4);
    var minScore = n < 10 ? 18 : n < 20 ? 26 : n < 40 ? 36 : n < 100 ? 45 :
      n < 2000 ? 60 : n < 10000 ? 72 : n < 50000 ? 82 : n < 200000 ? 92 : n < 500000 ? 104 : 116;
    return {
      width: n < 10 ? 9 : n < 20 ? 10 : n < 40 ? 11 : n < 200 ? 12 : n < 2000 ? 13 :
        n < 10000 ? 14 : n < 50000 ? 15 : n < 200000 ? 16 : n < 500000 ? 17 : n < 800000 ? 18 : 19,
      height: n < 20 ? 9 : n < 40 ? 10 : n < 200 ? 10 : n < 2000 ? 11 : n < 50000 ? 12 :
        n < 200000 ? 13 : n < 800000 ? 14 : 15,
      boxes: boxes,
      minPushes: minPushes,
      maxPushes: minPushes + 10,
      minScore: minScore,
      maxScore: minScore + 28,
      pulls: minPushes + 24 + boxes * 4,
      partitions: n < 10 ? 1 : n < 20 ? 2 : n < 40 ? 3 : Math.min(8, 4 + Math.floor((boxes - 4) / 2)),
      pillars: n < 20 ? 2 : n < 100 ? 3 : Math.min(9, boxes + 1),
      solverLimit: boxes <= 3 ? 55000 : boxes === 4 ? 15000 : 2500
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

    // Large rectangles produce walking, not reasoning. Break every 4x3 / 3x4
    // open patch, the same anti-room heuristic used by classic PCG research.
    var rectangleShapes = [[4, 3], [3, 4]];
    for (var pass = 0; pass < 64; pass += 1) {
      var patches = [];
      rectangleShapes.forEach(function (shape) {
        for (var top = 1; top <= height - shape[1] - 1; top += 1) {
          for (var left = 1; left <= width - shape[0] - 1; left += 1) {
            var cells = [];
            for (var py = 0; py < shape[1]; py += 1) {
              for (var px = 0; px < shape[0]; px += 1) cells.push(indexOf(left + px, top + py, width));
            }
            if (cells.every(function (candidate) { return floor.has(candidate); })) patches.push(cells);
          }
        }
      });
      if (!patches.length) break;
      var removedPatch = false;
      shuffle(rng, patches);
      for (var patchIndex = 0; patchIndex < patches.length && !removedPatch; patchIndex += 1) {
        var inner = shuffle(rng, patches[patchIndex].filter(function (candidate) {
          var p = pointOf(candidate, width);
          return p.x > 1 && p.x < width - 2 && p.y > 1 && p.y < height - 2;
        }));
        for (var innerIndex = 0; innerIndex < inner.length && !removedPatch; innerIndex += 1) {
          removedPatch = tryRemove(floor, [inner[innerIndex]], width, minimum);
        }
      }
      if (!removedPatch) break;
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

  function walkDistances(floor, width, start, boxSet) {
    var distances = new Map();
    if (!floor.has(start) || boxSet.has(start)) return distances;
    var queue = [start];
    distances.set(start, 0);
    for (var head = 0; head < queue.length; head += 1) {
      var cell = queue[head];
      var p = pointOf(cell, width);
      for (var d = 0; d < DIRS.length; d += 1) {
        var next = indexOf(p.x + DIRS[d].x, p.y + DIRS[d].y, width);
        if (floor.has(next) && !boxSet.has(next) && !distances.has(next)) {
          distances.set(next, distances.get(cell) + 1);
          queue.push(next);
        }
      }
    }
    return distances;
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
    var pool = goalCandidates(floor, width).map(function (cell) {
      var p = pointOf(cell, width);
      var walls = DIRS.filter(function (d) { return !floor.has(indexOf(p.x + d.x, p.y + d.y, width)); }).length;
      return { cell: cell, wallScore: walls * 4, noise: rng() * 2 };
    });
    var goals = [];
    while (pool.length && goals.length < count) {
      pool.sort(function (a, b) {
        function score(candidate) {
          var p = pointOf(candidate.cell, width);
          var adjacency = goals.filter(function (goal) {
            var g = pointOf(goal, width);
            return Math.abs(p.x - g.x) + Math.abs(p.y - g.y) === 1;
          }).length;
          var near = goals.some(function (goal) {
            var g = pointOf(goal, width);
            return Math.abs(p.x - g.x) + Math.abs(p.y - g.y) === 2;
          });
          return candidate.wallScore + adjacency * (count >= 6 ? 5 : count >= 3 ? 9 : 4) + (near ? 2 : 0) + candidate.noise;
        }
        return score(b) - score(a);
      });
      goals.push(pool.shift().cell);
    }
    return goals.length === count ? goals : null;
  }

  function assignmentDistance(boxes, goals, width) {
    var size = 1 << goals.length;
    var costs = new Array(size).fill(Infinity);
    costs[0] = 0;
    for (var boxIndex = 0; boxIndex < boxes.length; boxIndex += 1) {
      var nextCosts = new Array(size).fill(Infinity);
      var box = pointOf(boxes[boxIndex], width);
      for (var mask = 0; mask < size; mask += 1) {
        if (!Number.isFinite(costs[mask])) continue;
        for (var goalIndex = 0; goalIndex < goals.length; goalIndex += 1) {
          var bit = 1 << goalIndex;
          if (mask & bit) continue;
          var goal = pointOf(goals[goalIndex], width);
          var nextMask = mask | bit;
          var distance = costs[mask] + Math.abs(box.x - goal.x) + Math.abs(box.y - goal.y);
          if (distance < nextCosts[nextMask]) nextCosts[nextMask] = distance;
        }
      }
      costs = nextCosts;
    }
    return costs[size - 1];
  }

  function staticDeadSquares(level) {
    var floor = level.floor instanceof Set ? level.floor : new Set(level.floor);
    var goals = new Set(level.goals);
    var dead = new Set();
    floor.forEach(function (cell) {
      if (goals.has(cell)) return;
      var p = pointOf(cell, level.width);
      var verticalWall = !floor.has(indexOf(p.x, p.y - 1, level.width)) || !floor.has(indexOf(p.x, p.y + 1, level.width));
      var horizontalWall = !floor.has(indexOf(p.x - 1, p.y, level.width)) || !floor.has(indexOf(p.x + 1, p.y, level.width));
      if (verticalWall && horizontalWall) dead.add(cell);
    });
    return dead;
  }

  function articulationPoints(floor, width) {
    var discovery = new Map();
    var low = new Map();
    var parent = new Map();
    var result = new Set();
    var time = 0;

    function visit(cell) {
      discovery.set(cell, ++time);
      low.set(cell, discovery.get(cell));
      var children = 0;
      var p = pointOf(cell, width);
      DIRS.forEach(function (d) {
        var next = indexOf(p.x + d.x, p.y + d.y, width);
        if (!floor.has(next)) return;
        if (!discovery.has(next)) {
          parent.set(next, cell);
          children += 1;
          visit(next);
          low.set(cell, Math.min(low.get(cell), low.get(next)));
          if (!parent.has(cell) && children > 1) result.add(cell);
          if (parent.has(cell) && low.get(next) >= discovery.get(cell)) result.add(cell);
        } else if (parent.get(cell) !== next) {
          low.set(cell, Math.min(low.get(cell), discovery.get(next)));
        }
      });
    }

    if (floor.size) visit(floor.values().next().value);
    return result;
  }

  function analyzeSolution(level, actions) {
    var boxes = level.boxes.slice();
    var identities = new Map();
    boxes.forEach(function (box, id) { identities.set(box, id); });
    var goals = level.goals.slice();
    var goalSet = new Set(goals);
    var chokePoints = articulationPoints(level.floor, level.width);
    var interiorStructure = Math.max(0, (level.width - 2) * (level.height - 2) - level.floor.size);
    var seenIds = new Set();
    var leftAndReturned = new Set();
    var lastId = null;
    var lastDirection = null;
    var boxLines = 0;
    var switches = 0;
    var counterintuitive = 0;
    var goalEvictions = 0;
    var congestion = 0;

    actions.forEach(function (action) {
      var boxIndex = boxes.indexOf(action.box);
      if (boxIndex === -1) return;
      var id = identities.get(action.box);
      if (lastId !== id || lastDirection !== action.direction) boxLines += 1;
      if (lastId !== null && lastId !== id) {
        switches += 1;
        if (seenIds.has(id)) leftAndReturned.add(id);
      }
      var before = assignmentDistance(boxes, goals, level.width);
      identities.delete(action.box);
      identities.set(action.destination, id);
      boxes[boxIndex] = action.destination;
      var after = assignmentDistance(boxes, goals, level.width);
      if (after > before) counterintuitive += 1;
      if (goalSet.has(action.box) && !goalSet.has(action.destination)) goalEvictions += 1;
      var destination = pointOf(action.destination, level.width);
      var degree = DIRS.filter(function (d) {
        return level.floor.has(indexOf(destination.x + d.x, destination.y + d.y, level.width));
      }).length;
      if (degree <= 2 || chokePoints.has(action.box) || chokePoints.has(action.destination)) congestion += 1;
      seenIds.add(id);
      lastId = id;
      lastDirection = action.direction;
    });

    var interdependence = switches + leftAndReturned.size * 2 + Math.max(0, seenIds.size - 1);
    var interest = boxLines * 0.45 + switches * 0.9 + counterintuitive * 2.5 +
      goalEvictions * 4 + interdependence * 0.65 + Math.min(5, congestion * 0.2) +
      Math.min(8, interiorStructure * 0.25) + Math.min(6, chokePoints.size * 0.6);
    var motif = 'Packing Order';
    var thesis = 'The destinations are simple; the order in which you occupy them is not.';
    if (goalEvictions > 0) {
      motif = 'False Finish';
      thesis = 'A sealed reliquary must move again before the chamber can close.';
    } else if (counterintuitive > 0) {
      motif = 'Countermarch';
      thesis = 'Progress begins by pushing at least one reliquary farther from every seal.';
    } else if (interdependence >= 6) {
      motif = 'Braided Proof';
      thesis = 'The reliquaries share a route; solving one means making room for another.';
    } else if (congestion >= Math.max(3, Math.floor(actions.length / 3))) {
      motif = 'Shared Lane';
      thesis = 'A narrow lane is both transport route and scarce working space.';
    } else if (boxLines >= Math.max(5, seenIds.size * 2)) {
      motif = 'Broken Vector';
      thesis = 'The shortest proof changes direction more often than distance suggests.';
    }
    return {
      boxLines: boxLines,
      switches: switches,
      counterintuitive: counterintuitive,
      goalEvictions: goalEvictions,
      congestion: congestion,
      interdependence: interdependence,
      boxesUsed: seenIds.size,
      chokepoints: chokePoints.size,
      structure: interiorStructure,
      interest: Math.round(interest),
      motif: motif,
      thesis: thesis
    };
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
      var walking = walkDistances(floor, width, player, boxSet);
      var walkable = new Set(walking.keys());
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
            distance: assignmentDistance(positions, goals, width), walk: walking.get(near) || 0
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
        var aScore = -a.distance * 5 + used[a.id] * 2 + a.walk * 0.75 + rng();
        var bScore = -b.distance * 5 + used[b.id] * 2 + b.walk * 0.75 + rng();
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
    var deadSquares = staticDeadSquares(level);

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
    return {
      solved: true,
      pushes: solvedNode.depth,
      states: visited.size,
      actions: actions,
      firstPush: actions[0] || null
    };
  }

  function optimizeRoute(level, options) {
    options = options || {};
    var moveObjective = options.objective === 'moves';
    var heuristicWeight = options.heuristicWeight || 1;
    var floor = level.floor instanceof Set ? level.floor : new Set(level.floor);
    var goals = level.goals.slice();
    var goalSet = new Set(goals);
    var width = level.width;
    var pushLimit = options.pushLimit == null ? Infinity : options.pushLimit;
    var stateLimit = options.limit || 180000;
    var deadSquares = staticDeadSquares(level);
    var startBoxes = level.boxes.slice().sort(function (a, b) { return a - b; });
    function exactKey(boxes, player, pushes) {
      return boxes.join(',') + '|' + player + (moveObjective ? '|' + pushes : '');
    }
    var startKey = exactKey(startBoxes, level.player, 0);
    var best = new Map();
    var parents = new Map();
    var heap = [];
    var expanded = 0;

    function less(a, b) {
      if (moveObjective) {
        return a.estimate < b.estimate || (a.estimate === b.estimate &&
          (a.moves < b.moves || (a.moves === b.moves && a.pushes < b.pushes)));
      }
      return a.pushes < b.pushes || (a.pushes === b.pushes && a.moves < b.moves);
    }

    function heapPush(node) {
      heap.push(node);
      var index = heap.length - 1;
      while (index > 0) {
        var parent = Math.floor((index - 1) / 2);
        if (!less(heap[index], heap[parent])) break;
        var hold = heap[index]; heap[index] = heap[parent]; heap[parent] = hold;
        index = parent;
      }
    }

    function heapPop() {
      var first = heap[0];
      var tail = heap.pop();
      if (heap.length) {
        heap[0] = tail;
        var index = 0;
        while (true) {
          var left = index * 2 + 1;
          var right = left + 1;
          var smallest = index;
          if (left < heap.length && less(heap[left], heap[smallest])) smallest = left;
          if (right < heap.length && less(heap[right], heap[smallest])) smallest = right;
          if (smallest === index) break;
          var hold = heap[index]; heap[index] = heap[smallest]; heap[smallest] = hold;
          index = smallest;
        }
      }
      return first;
    }

    function solved(boxes) {
      return boxes.every(function (box) { return goalSet.has(box); });
    }

    best.set(startKey, { pushes: 0, moves: 0 });
    heapPush({
      boxes: startBoxes, player: level.player, key: startKey, pushes: 0, moves: 0,
      estimate: assignmentDistance(startBoxes, goals, width) * heuristicWeight
    });
    var solvedNode = solved(startBoxes) ? heap[0] : null;

    while (!solvedNode && heap.length && expanded < stateLimit) {
      var node = heapPop();
      var record = best.get(node.key);
      if (!record || record.pushes !== node.pushes || record.moves !== node.moves) continue;
      if (solved(node.boxes)) { solvedNode = node; break; }
      if (node.pushes + assignmentDistance(node.boxes, goals, width) > pushLimit) continue;
      expanded += 1;
      var boxSet = new Set(node.boxes);
      var distances = walkDistances(floor, width, node.player, boxSet);
      for (var b = 0; b < node.boxes.length; b += 1) {
        var box = node.boxes[b];
        var p = pointOf(box, width);
        for (var d = 0; d < DIRS.length; d += 1) {
          var direction = DIRS[d];
          var stand = indexOf(p.x - direction.x, p.y - direction.y, width);
          var destination = indexOf(p.x + direction.x, p.y + direction.y, width);
          if (!distances.has(stand) || !floor.has(destination) || boxSet.has(destination) || deadSquares.has(destination)) continue;
          var nextPushes = node.pushes + 1;
          if (nextPushes > pushLimit) continue;
          var nextBoxes = node.boxes.slice();
          nextBoxes[b] = destination;
          nextBoxes.sort(function (a, c) { return a - c; });
          if (nextPushes + assignmentDistance(nextBoxes, goals, width) > pushLimit) continue;
          var nextMoves = node.moves + distances.get(stand) + 1;
          var key = exactKey(nextBoxes, box, nextPushes);
          var previousBest = best.get(key);
          if (previousBest && (moveObjective ? previousBest.moves <= nextMoves :
              (previousBest.pushes < nextPushes ||
              (previousBest.pushes === nextPushes && previousBest.moves <= nextMoves)))) continue;
          best.set(key, { pushes: nextPushes, moves: nextMoves });
          parents.set(key, { previous: node.key, action: { box: box, destination: destination, direction: d } });
          heapPush({
            boxes: nextBoxes, player: box, key: key, pushes: nextPushes, moves: nextMoves,
            estimate: moveObjective ? nextMoves + assignmentDistance(nextBoxes, goals, width) * heuristicWeight : 0
          });
        }
      }
    }

    if (!solvedNode) return { solved: false, limited: expanded >= stateLimit, states: expanded };
    var actions = [];
    var cursor = solvedNode.key;
    while (cursor !== startKey) {
      var link = parents.get(cursor);
      if (!link) break;
      actions.push(link.action);
      cursor = link.previous;
    }
    actions.reverse();
    return {
      solved: true,
      optimal: !moveObjective,
      moveOptimal: !moveObjective,
      objective: moveObjective ? 'moves' : 'pushes-then-moves',
      pushes: solvedNode.pushes,
      moves: solvedNode.moves,
      states: expanded,
      actions: actions,
      firstPush: actions[0] || null
    };
  }

  function routeMoveCount(level, actions) {
    var boxes = level.boxes.slice();
    var player = level.player;
    var moves = 0;
    for (var i = 0; i < actions.length; i += 1) {
      var action = actions[i];
      var boxIndex = boxes.indexOf(action.box);
      if (boxIndex === -1) return Infinity;
      var direction = DIRS[action.direction];
      var source = pointOf(action.box, level.width);
      var stand = indexOf(source.x - direction.x, source.y - direction.y, level.width);
      var distances = walkDistances(level.floor, level.width, player, new Set(boxes));
      if (!distances.has(stand)) return Infinity;
      moves += distances.get(stand) + 1;
      boxes[boxIndex] = action.destination;
      player = action.box;
    }
    return moves;
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
    if (scrambled.pulls < config.minPushes || scrambled.lowerBound < config.minPushes ||
        scrambled.touched < Math.min(config.boxes, config.boxes >= 5 ? config.boxes : 2)) return null;
    if (config.boxes >= 5 && scrambled.boxes.filter(function (box) { return goals.indexOf(box) !== -1; }).length > 1) return null;
    var level = {
      width: config.width,
      height: config.height,
      floor: floor,
      goals: goals.slice(),
      boxes: scrambled.boxes,
      player: scrambled.player
    };
    var solution = config.boxes > 4 ? { solved: false, limited: true, states: 0 } :
      solve(level, { limit: config.solverLimit || 55000 });
    if (!solution.solved && !solution.limited) return null;
    if (!solution.solved) {
      var boundsMeet = scrambled.knownSolution.length === scrambled.lowerBound;
      solution = {
        solved: true,
        optimal: boundsMeet,
        proof: boundsMeet ? 'bounds' : 'constructive',
        limited: true,
        pushes: scrambled.knownSolution.length,
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
    solution.analysis = analyzeSolution(level, solution.actions);
    solution.switches = solution.analysis.switches;
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
    var analysis = solution.analysis || { interest: 0 };
    // Human difficulty is driven much more by changes of box, direction, and
    // misleading progress than by raw solution length or search-space size.
    var score = solution.pushes * 0.32 + analysis.interest + Math.log2(solution.states + 1) * 0.45;
    var title = 'Initiate';
    if (score >= 20) title = 'Delver';
    if (score >= 34) title = 'Pathfinder';
    if (score >= 50) title = 'Warden';
    if (score >= 68) title = 'Abyssal';
    if (score >= 88) title = 'Oracular';
    return { score: Math.round(score), title: levelNumber <= 4 ? 'Tutorial' : title };
  }

  function refineRoute(level, limit) {
    var pushProof = level.solution;
    var optimized = optimizeRoute(level, {
      pushLimit: pushProof.routePushes || pushProof.pushes,
      limit: limit,
      objective: 'moves',
      heuristicWeight: pushProof.optimal ? 1 : 4
    });
    if (optimized.solved) {
      optimized.optimal = Boolean(pushProof.optimal && optimized.pushes === pushProof.pushes);
      optimized.moveOptimal = optimized.optimal;
      optimized.proof = optimized.optimal ? 'lexicographic' : 'move-search';
      optimized.lowerBound = pushProof.lowerBound;
      optimized.routePushes = optimized.pushes;
      optimized.pushStates = pushProof.states;
      optimized.moveStates = optimized.states;
      optimized.states += pushProof.states;
      optimized.analysis = analyzeSolution(level, optimized.actions);
      optimized.switches = optimized.analysis.switches;
      level.solution = optimized;
    } else {
      pushProof.moves = routeMoveCount(level, pushProof.actions);
      pushProof.moveOptimal = false;
      pushProof.moveStates = optimized.states;
      pushProof.analysis = analyzeSolution(level, pushProof.actions);
      pushProof.switches = pushProof.analysis.switches;
    }
    return level;
  }

  function generate(campaignSeed, levelNumber) {
    var config = configFor(levelNumber);
    var best = null;
    var bestDistance = Infinity;
    var attemptLimit = config.boxes > 4 ? 64 : config.boxes >= 4 ? (levelNumber >= 400 ? 48 : 24) : config.boxes === 3 ? 36 : 24;
    for (var attempt = 0; attempt < attemptLimit; attempt += 1) {
      var candidate = buildCandidate(campaignSeed, levelNumber, attempt, config);
      if (!candidate) continue;
      if (candidate.boxes.length <= 4) {
        refineRoute(candidate, candidate.boxes.length >= 4 ? 70000 : candidate.boxes.length === 3 ? 160000 : 90000);
      } else {
        candidate.solution.moves = routeMoveCount(candidate, candidate.solution.actions);
        candidate.solution.moveOptimal = false;
        candidate.solution.analysis = analyzeSolution(candidate, candidate.solution.actions);
        candidate.solution.switches = candidate.solution.analysis.switches;
      }
      var pushes = candidate.solution.pushes;
      var candidateScore = ratingFor(levelNumber, candidate.solution).score;
      var pushFloor = Math.max(2, config.minPushes);
      var averageWalk = candidate.solution.moves / Math.max(1, candidate.solution.actions.length);
      var distance = pushes < pushFloor ? (pushFloor - pushes) * 5 : 0;
      if (candidateScore < config.minScore) distance += (config.minScore - candidateScore) * 4;
      if (candidateScore > config.maxScore) distance += (candidateScore - config.maxScore);
      if (averageWalk > 7) distance += (averageWalk - 7) * 18;
      if (candidate.boxes.length >= 4 && candidate.solution.proof === 'constructive') distance += 30;
      if (levelNumber >= 20 && candidate.solution.analysis.boxesUsed < config.boxes) distance += 18;
      if (levelNumber >= 40 && candidate.solution.analysis.interdependence < Math.max(4, config.boxes * 2)) distance += 14;
      if (distance < bestDistance || (distance === bestDistance && best && candidate.solution.states > best.solution.states)) {
        best = candidate; bestDistance = distance;
      }
      if (pushes >= config.minPushes && candidateScore >= config.minScore && candidateScore <= config.maxScore &&
          averageWalk <= 7 &&
          (levelNumber < 20 || candidate.solution.analysis.boxesUsed === config.boxes) &&
          (levelNumber < 40 || candidate.solution.analysis.interdependence >= Math.max(4, config.boxes * 2))) break;
    }
    if (!best) {
      var fallback = Object.assign({}, config, {
        minPushes: Math.max(config.boxes * 5, Math.floor(config.minPushes * 0.8)),
        pulls: config.pulls + 10
      });
      var fallbackDistance = Infinity;
      for (var retry = attemptLimit; retry < attemptLimit + 48; retry += 1) {
        var fallbackCandidate = buildCandidate(campaignSeed, levelNumber, retry, fallback);
        if (!fallbackCandidate) continue;
        if (fallbackCandidate.boxes.length <= 4) {
          refineRoute(fallbackCandidate, fallbackCandidate.boxes.length >= 4 ? 70000 : 90000);
        } else {
          fallbackCandidate.solution.moves = routeMoveCount(fallbackCandidate, fallbackCandidate.solution.actions);
          fallbackCandidate.solution.moveOptimal = false;
          fallbackCandidate.solution.analysis = analyzeSolution(fallbackCandidate, fallbackCandidate.solution.actions);
          fallbackCandidate.solution.switches = fallbackCandidate.solution.analysis.switches;
        }
        var fallbackScore = ratingFor(levelNumber, fallbackCandidate.solution).score;
        var fallbackWalk = fallbackCandidate.solution.moves / Math.max(1, fallbackCandidate.solution.actions.length);
        var fallbackRank = Math.max(0, config.minScore - fallbackScore) * 4 +
          Math.max(0, fallbackScore - config.maxScore) + Math.max(0, fallbackWalk - 7) * 18;
        if (fallbackRank < fallbackDistance) {
          best = fallbackCandidate;
          fallbackDistance = fallbackRank;
        }
        if (fallbackScore >= config.minScore && fallbackScore <= config.maxScore && fallbackWalk <= 7) break;
      }
    }
    if (!best) throw new Error('The dungeon refused this seed. Try another descent.');
    if (best.boxes.length <= 4 && (best.solution.moves == null || best.solution.proof === 'constructive')) {
      refineRoute(best, best.boxes.length >= 4 ? 220000 : 160000);
    } else if (best.solution.moves == null) {
      best.solution.moves = routeMoveCount(best, best.solution.actions);
      best.solution.moveOptimal = false;
      best.solution.analysis = analyzeSolution(best, best.solution.actions);
      best.solution.switches = best.solution.analysis.switches;
    }
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
    analyzeSolution: analyzeSolution,
    optimizeRoute: optimizeRoute,
    routeMoveCount: routeMoveCount,
    signature: signature,
    solve: solve,
    staticDeadSquares: staticDeadSquares
  };
});
