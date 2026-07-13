/* =============================================================================
   VERDIGRIS GEOMETRIC PATTERNS
   -----------------------------------------------------------------------------
   Pure pattern detection for the passive tree. UMD: browser global
   `VerdigrisPatterns` or Node require().
   ============================================================================= */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.VerdigrisPatterns = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const HEX_DIRECTIONS = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 }
  ];

  const DEFAULT_TUNING = {
    // amplitudePercentPerUnit: extra node empowerment per lattice unit of wave
    // amplitude (peak deviation from the endpoint chord), capped at amplitudeMax.
    // High-amplitude waves sweep across rings instead of zigzagging tightly —
    // they cost far more travel, so they pay more.
    wave: { minLength: 2, minPercent: 10, crestPercent: 20, meridianEndpointPercent: 28, amplitudePercentPerUnit: 12, amplitudeMax: 3 },
    flow: { minLength: 3, minPercent: 25, maxPercent: 100, maxLength: 8 },
    loops: { maxRadius: 3 },
    // Two vesica forms: 'edge' (centers 2 apart, rings share one conduit) and
    // 'piscis' (centers adjacent, each center on the other's ring — the true
    // vesica piscis). The deeper overlap pays its lens nodes more.
    vesica: { lensShare: 0.5, piscisLensShare: 0.75 },
    rods: { minLength: 3, endpointBonus: 4, endpointPercent: 8 },
    // Wave/flow selection extracts one best path at a time; perPath caps DFS
    // edge expansions for a single extraction and budget caps the whole
    // selection pass. Dense cyclic builds have exponentially many simple
    // paths; past a cap the detector keeps the best paths found so far
    // instead of exhausting memory. Realistic builds finish well under both.
    search: { budget: 120000, perPath: 12000 },
    crossroads: { minDegree: 4, perExtra: 3 },
    symmetry: { mirrorAttrsPerPair: 0.8, trineAttrsPerTriple: 2, mandalaAttrsPerSet: 3 },
    grandOrbit: { attrsPerRing: 2 },
    enclosure: { guardPerNode: 12 }
  };

  const axialKey = (q, r) => `${q},${r}`;
  const edgeKey = (a, b) => [a, b].sort().join(':');
  const sideOf = (conduit) => conduit.allocatedVariant === 'inner' ? 'L'
    : conduit.allocatedVariant === 'outer' ? 'R'
      : null;
  const hexDistance = (q, r) => {
    const s = -q - r;
    return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
  };
  const cloneTuning = (tuning = {}) => ({
    wave: { ...DEFAULT_TUNING.wave, ...(tuning.wave || {}) },
    flow: { ...DEFAULT_TUNING.flow, ...(tuning.flow || {}) },
    loops: { ...DEFAULT_TUNING.loops, ...(tuning.loops || {}) },
    vesica: { ...DEFAULT_TUNING.vesica, ...(tuning.vesica || {}) },
    rods: { ...DEFAULT_TUNING.rods, ...(tuning.rods || {}) },
    search: { ...DEFAULT_TUNING.search, ...(tuning.search || {}) },
    crossroads: { ...DEFAULT_TUNING.crossroads, ...(tuning.crossroads || {}) },
    symmetry: { ...DEFAULT_TUNING.symmetry, ...(tuning.symmetry || {}) },
    grandOrbit: { ...DEFAULT_TUNING.grandOrbit, ...(tuning.grandOrbit || {}) },
    enclosure: { ...DEFAULT_TUNING.enclosure, ...(tuning.enclosure || {}) }
  });

  // Pattern-stones (Phase 5): geometry-bending jewels resolved inside the
  // detector. Each stone: { q, r, radius, effect: 'wave-length'|'loop-gap', value }.
  function stonesFor(input, effect) {
    return (input.stones || []).filter(stone => stone.effect === effect);
  }

  function withinStoneRadius(stone, q, r) {
    const radius = stone.radius == null ? 2 : stone.radius;
    return hexDistance(q - stone.q, r - stone.r) <= radius;
  }

  // Waystone pattern hooks: authored ring-5 seats whose promises the detector
  // keeps. Each hook: { q, r, id, effect, value } for an ACTIVE waystone.
  function hooksFor(input, effect) {
    return (input.waystones || []).filter(hook => hook.effect === effect);
  }

  function normalize(input = {}) {
    const nodes = Array.from(input.nodes || []);
    const conduits = Array.from(input.conduits || []);
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const mainNodes = nodes.filter(node => node.source !== 'subtree' && node.q != null && node.r != null);
    const activeNodes = mainNodes.filter(node => node.active);
    const activeSet = new Set(activeNodes.map(node => node.id));
    const allocatedConduits = conduits
      .filter(conduit => conduit.allocatedVariant && activeSet.has(conduit.fromId) && activeSet.has(conduit.toId))
      .filter(conduit => {
        const a = nodeMap.get(conduit.fromId);
        const b = nodeMap.get(conduit.toId);
        return a && b && a.source !== 'subtree' && b.source !== 'subtree';
      })
      .map(conduit => ({ ...conduit, side: sideOf(conduit) }))
      .filter(conduit => conduit.side);
    const conduitMap = new Map(allocatedConduits.map(conduit => [conduit.id, conduit]));
    const adjacency = new Map(mainNodes.map(node => [node.id, []]));
    allocatedConduits.forEach(conduit => {
      adjacency.get(conduit.fromId)?.push({ nodeId: conduit.toId, conduit });
      adjacency.get(conduit.toId)?.push({ nodeId: conduit.fromId, conduit });
    });
    return { nodes, mainNodes, activeNodes, activeSet, nodeMap, allocatedConduits, conduitMap, adjacency };
  }

  function pathScore(path, nodeMap) {
    const rings = path.nodeIds.map(id => nodeMap.get(id)?.ring || 0);
    return rings.reduce((sum, ring) => sum + ring, 0) / Math.max(1, rings.length);
  }

  function comparePath(a, b, nodeMap) {
    if (b.length !== a.length) return b.length - a.length;
    const score = pathScore(a, nodeMap) - pathScore(b, nodeMap);
    if (Math.abs(score) > 0.001) return score;
    return a.nodeIds.join('|').localeCompare(b.nodeIds.join('|'));
  }

  // Depth-first search for the single best path (longest, then closest to
  // origin, then lexicographically first — comparePath order) through the
  // not-yet-claimed conduits. Exhaustively enumerating every simple path and
  // sorting afterwards is exponential on cyclic builds, so instead the best
  // path is extracted, its conduits claimed, and the search repeated on what
  // remains — the same greedy result, without materializing the path set.
  function findBestPath(ctx, mode, minLength, isBlocked, budget) {
    let best = null;
    const path = { nodeIds: [], conduitIds: [], sides: [], length: 0 };
    const seenNodes = new Set();
    const seenConduits = new Set();

    const consider = () => {
      if (path.length < minLength) return;
      if (best && path.length < best.length) return;
      if (!best || comparePath(path, best, ctx.nodeMap) < 0) {
        best = {
          type: mode,
          nodeIds: path.nodeIds.slice(),
          conduitIds: path.conduitIds.slice(),
          sides: path.sides.slice(),
          length: path.length
        };
      }
    };

    const extend = () => {
      if (budget.spent >= budget.limit) return;
      const at = path.nodeIds[path.nodeIds.length - 1];
      const lastSide = path.sides[path.sides.length - 1];
      const candidates = (ctx.adjacency.get(at) || [])
        .filter(edge => !seenNodes.has(edge.nodeId) && !seenConduits.has(edge.conduit.id) && !isBlocked(edge.conduit.id))
        .filter(edge => mode === 'wave' ? edge.conduit.side !== lastSide : edge.conduit.side === lastSide)
        .sort((a, b) => {
          const ar = ctx.nodeMap.get(a.nodeId)?.ring || 0;
          const br = ctx.nodeMap.get(b.nodeId)?.ring || 0;
          if (ar !== br) return ar - br;
          return a.nodeId.localeCompare(b.nodeId);
        });
      for (const edge of candidates) {
        if (budget.spent >= budget.limit) return;
        budget.spent += 1;
        seenNodes.add(edge.nodeId);
        seenConduits.add(edge.conduit.id);
        path.nodeIds.push(edge.nodeId);
        path.conduitIds.push(edge.conduit.id);
        path.sides.push(edge.conduit.side);
        path.length += 1;
        consider();
        extend();
        path.length -= 1;
        path.sides.pop();
        path.conduitIds.pop();
        path.nodeIds.pop();
        seenConduits.delete(edge.conduit.id);
        seenNodes.delete(edge.nodeId);
      }
    };

    for (const startConduit of ctx.allocatedConduits) {
      if (budget.spent >= budget.limit) break;
      if (isBlocked(startConduit.id)) continue;
      for (const [fromId, toId] of [
        [startConduit.fromId, startConduit.toId],
        [startConduit.toId, startConduit.fromId]
      ]) {
        seenNodes.add(fromId);
        seenNodes.add(toId);
        seenConduits.add(startConduit.id);
        path.nodeIds.push(fromId, toId);
        path.conduitIds.push(startConduit.id);
        path.sides.push(startConduit.side);
        path.length = 1;
        consider();
        extend();
        seenNodes.clear();
        seenConduits.clear();
        path.nodeIds.length = 0;
        path.conduitIds.length = 0;
        path.sides.length = 0;
        path.length = 0;
        if (budget.spent >= budget.limit) break;
      }
    }
    return best;
  }

  function selectExclusivePaths(ctx, tuning, sharedClaimIds = new Set()) {
    // Conduits touching a shared-claim Waystone may serve one wave AND one
    // flow (never two of the same family); everything else is exclusive.
    const claims = new Map();
    const blockedFor = type => id => {
      const takers = claims.get(id);
      if (!takers || !takers.size) return false;
      if (!sharedClaimIds.has(id)) return true;
      return takers.has(type);
    };
    const global = { spent: 0, limit: tuning.search.budget };
    let exhausted = false;
    const minLengths = { wave: tuning.wave.minLength, flow: tuning.flow.minLength };
    const waves = [];
    const flows = [];
    // Claims only grow, so a still-unblocked candidate stays the best of its
    // family; only invalidated candidates need a fresh search.
    const candidates = { wave: undefined, flow: undefined };
    while (true) {
      for (const type of ['wave', 'flow']) {
        if (candidates[type] === undefined) {
          const budget = { spent: 0, limit: Math.min(tuning.search.perPath, global.limit - global.spent) };
          candidates[type] = findBestPath(ctx, type, minLengths[type], blockedFor(type), budget);
          global.spent += budget.spent;
          if (budget.spent >= budget.limit) exhausted = true;
        }
      }
      const wave = candidates.wave;
      const flow = candidates.flow;
      const chosen = wave && flow
        ? (comparePath(wave, flow, ctx.nodeMap) <= 0 ? wave : flow)
        : (wave || flow);
      if (!chosen) break;
      chosen.conduitIds.forEach(id => {
        if (!claims.has(id)) claims.set(id, new Set());
        claims.get(id).add(chosen.type);
      });
      (chosen.type === 'wave' ? waves : flows).push(chosen);
      candidates[chosen.type] = undefined;
      const other = chosen.type === 'wave' ? 'flow' : 'wave';
      if (candidates[other] && candidates[other].conduitIds.some(id => blockedFor(other)(id))) {
        candidates[other] = undefined;
      }
    }
    return {
      waves,
      flows,
      used: new Set(claims.keys()),
      searchExhausted: exhausted
    };
  }

  function hexRingNodes(ctx, center, radius) {
    if (!center || center.q == null || center.r == null || radius < 1) return null;
    const nodes = [];
    let q = center.q + HEX_DIRECTIONS[4].q * radius;
    let r = center.r + HEX_DIRECTIONS[4].r * radius;
    for (let side = 0; side < 6; side += 1) {
      const dir = HEX_DIRECTIONS[side];
      for (let step = 0; step < radius; step += 1) {
        const node = ctx.nodeMap.get(axialKey(q, r));
        if (!node) return null;
        nodes.push(node);
        q += dir.q;
        r += dir.r;
      }
    }
    return nodes;
  }

  function perimeterEdges(nodes) {
    return nodes.map((node, index) => edgeKey(node.id, nodes[(index + 1) % nodes.length].id));
  }

  function isCompletedPerimeter(ctx, ringNodes, allowedGaps = 0) {
    if (!ringNodes.every(node => ctx.activeSet.has(node.id))) return false;
    const missing = perimeterEdges(ringNodes).filter(id => !ctx.conduitMap.has(id)).length;
    return missing <= allowedGaps;
  }

  function detectLoops(ctx, tuning, gapStones = []) {
    const loops = [];
    const enclosures = [];
    ctx.mainNodes.forEach(center => {
      const allowedGaps = gapStones.reduce((max, stone) =>
        withinStoneRadius(stone, center.q, center.r) ? Math.max(max, stone.value || 1) : max, 0);
      for (let radius = 1; radius <= tuning.loops.maxRadius; radius += 1) {
        const ringNodes = hexRingNodes(ctx, center, radius);
        if (!ringNodes || !isCompletedPerimeter(ctx, ringNodes, allowedGaps)) continue;
        const loop = {
          centerId: center.id,
          radius,
          nodeIds: ringNodes.map(node => node.id),
          conduitIds: perimeterEdges(ringNodes)
        };
        if (ctx.activeSet.has(center.id)) loops.push(loop);
        else enclosures.push({ ...loop, enclosedNodeIds: [center.id] });
      }
    });
    const byCenter = new Map();
    loops.forEach(loop => {
      if (!byCenter.has(loop.centerId)) byCenter.set(loop.centerId, []);
      byCenter.get(loop.centerId).push(loop);
    });
    const concentric = Array.from(byCenter.entries())
      .filter(([, centerLoops]) => centerLoops.some(loop => loop.radius === 1) && centerLoops.some(loop => loop.radius === 2))
      .map(([centerId, centerLoops]) => ({ centerId, loopIds: centerLoops.map(loop => `${loop.centerId}:r${loop.radius}`) }));
    const radiusOne = loops.filter(loop => loop.radius === 1);
    const vesicas = [];
    for (let i = 0; i < radiusOne.length; i += 1) {
      for (let j = i + 1; j < radiusOne.length; j += 1) {
        const a = radiusOne[i];
        const b = radiusOne[j];
        const [aq, ar] = a.centerId.split(',').map(Number);
        const [bq, br] = b.centerId.split(',').map(Number);
        const centerDistance = hexDistance(aq - bq, ar - br);
        if (centerDistance === 1) {
          // True vesica piscis: each center lies on the other's ring; the two
          // common neighbors are the lens.
          const lens = a.nodeIds.filter(id => b.nodeIds.includes(id) && id !== a.centerId && id !== b.centerId);
          if (lens.length === 2) {
            vesicas.push({ centers: [a.centerId, b.centerId], form: 'piscis', lensNodeIds: lens });
          }
        } else {
          const shared = a.conduitIds.filter(id => b.conduitIds.includes(id));
          if (shared.length === 1) {
            const lens = shared[0].split(':');
            vesicas.push({ centers: [a.centerId, b.centerId], form: 'edge', sharedEdge: shared[0], lensNodeIds: lens });
          }
        }
      }
    }
    return { loops, concentric, vesicas, enclosures };
  }

  function detectGrandOrbits(ctx) {
    const maxRing = Math.max(0, ...ctx.mainNodes.map(node => node.ring || 0));
    const orbits = [];
    for (let ring = 1; ring <= maxRing; ring += 1) {
      const nodes = ctx.mainNodes.filter(node => node.ring === ring);
      if (!nodes.length || nodes.some(node => !ctx.activeSet.has(node.id))) continue;
      const ordered = orderRing(nodes, ring);
      if (ordered.length && perimeterEdges(ordered).every(id => ctx.conduitMap.has(id))) {
        orbits.push({ ring, nodeIds: ordered.map(node => node.id), conduitIds: perimeterEdges(ordered) });
      }
    }
    return orbits;
  }

  function orderRing(nodes, ring) {
    const byId = new Map(nodes.map(node => [node.id, node]));
    const ordered = [];
    let q = HEX_DIRECTIONS[4].q * ring;
    let r = HEX_DIRECTIONS[4].r * ring;
    for (let side = 0; side < 6; side += 1) {
      const dir = HEX_DIRECTIONS[side];
      for (let step = 0; step < ring; step += 1) {
        const node = byId.get(axialKey(q, r));
        if (node) ordered.push(node);
        q += dir.q;
        r += dir.r;
      }
    }
    return ordered.length === nodes.length ? ordered : [];
  }

  function mirrorKey(node) {
    return axialKey(-node.q - node.r, node.r);
  }

  function rotate60Key(node) {
    return axialKey(-node.r, node.q + node.r);
  }

  function rotateKey(id, turns) {
    let [q, r] = id.split(',').map(Number);
    for (let i = 0; i < turns; i += 1) {
      const nextQ = -r;
      const nextR = q + r;
      q = nextQ; r = nextR;
    }
    return axialKey(q, r);
  }

  function sortedSetKey(ids) {
    return ids.slice().sort().join('|');
  }

  function detectSymmetry(ctx) {
    const mirrorPairs = [];
    ctx.activeNodes.forEach(node => {
      if (node.q > 0 || (node.q === 0 && node.r >= 0)) return;
      const mirror = ctx.nodeMap.get(mirrorKey(node));
      if (mirror && ctx.activeSet.has(mirror.id) && mirror.id !== node.id) {
        mirrorPairs.push([node.id, mirror.id]);
      }
    });
    let mirroredConduits = 0;
    const mirroredConduitIds = [];
    ctx.allocatedConduits.forEach(conduit => {
      const a = ctx.nodeMap.get(conduit.fromId);
      const b = ctx.nodeMap.get(conduit.toId);
      if (!a || !b || a.id > b.id) return;
      const ma = mirrorKey(a);
      const mb = mirrorKey(b);
      if (ctx.conduitMap.has(edgeKey(ma, mb))) {
        mirroredConduits += 1;
        mirroredConduitIds.push(conduit.id, edgeKey(ma, mb));
      }
    });
    const trineSeen = new Set();
    const trines = [];
    const mandalaSeen = new Set();
    const mandalas = [];
    ctx.activeNodes.forEach(node => {
      if (node.id === '0,0') return;
      const triple = [node.id, rotateKey(node.id, 2), rotateKey(node.id, 4)];
      if (triple.every(id => ctx.activeSet.has(id))) {
        const key = sortedSetKey(triple);
        if (!trineSeen.has(key)) {
          trineSeen.add(key);
          trines.push(triple.sort());
        }
      }
      const sextet = [0, 1, 2, 3, 4, 5].map(turn => rotateKey(node.id, turn));
      if (sextet.every(id => ctx.activeSet.has(id))) {
        const key = sortedSetKey(sextet);
        if (!mandalaSeen.has(key)) {
          mandalaSeen.add(key);
          mandalas.push(sextet.sort());
        }
      }
    });
    return { mirrorPairs, mirroredConduits, mirroredConduitIds, trines, mandalas };
  }

  function detectRods(ctx, tuning) {
    const rods = [];
    const seen = new Set();
    ctx.activeNodes.forEach(node => {
      HEX_DIRECTIONS.forEach(dir => {
        const prev = ctx.nodeMap.get(axialKey(node.q - dir.q, node.r - dir.r));
        if (prev && ctx.activeSet.has(prev.id) && ctx.conduitMap.has(edgeKey(prev.id, node.id))) return;
        const nodeIds = [node.id];
        const conduitIds = [];
        let current = node;
        while (true) {
          const next = ctx.nodeMap.get(axialKey(current.q + dir.q, current.r + dir.r));
          if (!next || !ctx.activeSet.has(next.id)) break;
          const conduitId = edgeKey(current.id, next.id);
          if (!ctx.conduitMap.has(conduitId)) break;
          conduitIds.push(conduitId);
          nodeIds.push(next.id);
          current = next;
        }
        if (conduitIds.length >= tuning.rods.minLength) {
          const key = conduitIds.slice().sort().join('|');
          if (!seen.has(key)) {
            seen.add(key);
            rods.push({ nodeIds, conduitIds, length: conduitIds.length, direction: { ...dir } });
          }
        }
      });
    });
    return rods;
  }

  function detectCrossroads(ctx, tuning) {
    return ctx.activeNodes
      .map(node => ({ nodeId: node.id, degree: (ctx.adjacency.get(node.id) || []).length }))
      .filter(item => item.degree >= tuning.crossroads.minDegree);
  }

  function hasAlternateActiveRoute(ctx, blockedConduit) {
    const start = blockedConduit.fromId;
    const target = blockedConduit.toId;
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const id = queue.shift();
      for (const edge of ctx.adjacency.get(id) || []) {
        if (edge.conduit.id === blockedConduit.id || visited.has(edge.nodeId)) continue;
        if (edge.nodeId === target) return true;
        visited.add(edge.nodeId);
        queue.push(edge.nodeId);
      }
    }
    return false;
  }

  function detectCircuits(ctx) {
    const redundant = ctx.allocatedConduits.filter(conduit => hasAlternateActiveRoute(ctx, conduit));
    return { redundant };
  }

  function detectMeridians(ctx, waves, depth) {
    return waves.filter(wave => {
      if (!wave.nodeIds.includes('0,0')) return false;
      const first = ctx.nodeMap.get(wave.nodeIds[0]);
      const last = ctx.nodeMap.get(wave.nodeIds[wave.nodeIds.length - 1]);
      return first && last && first.ring === depth && last.ring === depth;
    });
  }

  function addNodeBoost(nodeBoosts, nodeId, percent, reason) {
    if (!nodeBoosts[nodeId]) nodeBoosts[nodeId] = { percent: 0, reasons: [] };
    nodeBoosts[nodeId].percent += percent;
    nodeBoosts[nodeId].reasons.push(reason);
  }

  function addConduitBoost(conduitBoosts, conduitId, percent, reason) {
    if (!conduitBoosts[conduitId]) conduitBoosts[conduitId] = { percent: 0, reasons: [] };
    conduitBoosts[conduitId].percent += percent;
    conduitBoosts[conduitId].reasons.push(reason);
  }

  // Amplitude: how far a wave's crest swings from the straight line between
  // its endpoints, in lattice units. A straight wave (or the meridian) is 0;
  // the wide S-curves that sweep across rings score 2-4.
  function waveAmplitude(ctx, wave) {
    const flat = id => {
      const node = ctx.nodeMap.get(id);
      if (!node || node.q == null) return null;
      return { x: node.q + node.r / 2, y: node.r * Math.sqrt(3) / 2 };
    };
    const points = wave.nodeIds.map(flat).filter(Boolean);
    if (points.length < 3) return 0;
    const first = points[0];
    const last = points[points.length - 1];
    const chord = { x: last.x - first.x, y: last.y - first.y };
    const chordLength = Math.hypot(chord.x, chord.y);
    if (chordLength < 0.001) {
      return Math.max(...points.map(p => Math.hypot(p.x - first.x, p.y - first.y)));
    }
    return Math.max(...points.slice(1, -1).map(p => {
      const cross = (p.x - first.x) * chord.y - (p.y - first.y) * chord.x;
      return Math.abs(cross) / chordLength;
    }));
  }

  function amplitudeScale(tuning, wave) {
    const amp = Math.min(wave.amplitude || 0, tuning.wave.amplitudeMax);
    return 1 + amp * tuning.wave.amplitudePercentPerUnit / 100;
  }

  function wavePercent(tuning, wave, index) {
    const max = Math.max(tuning.wave.minLength, 10);
    const length = wave.effectiveLength || wave.length;
    const lengthScale = Math.min(1, (length - tuning.wave.minLength) / (max - tuning.wave.minLength));
    const endpointDistance = Math.min(index, wave.nodeIds.length - 1 - index);
    const centerScale = wave.nodeIds.length <= 2 ? 0 : endpointDistance / Math.floor(wave.nodeIds.length / 2);
    const base = tuning.wave.minPercent + (tuning.wave.crestPercent - tuning.wave.minPercent) * lengthScale;
    return Math.round(base * (0.45 + centerScale * 0.55) * amplitudeScale(tuning, wave));
  }

  function flowPercent(tuning, flow) {
    const minLength = tuning.flow.minLength;
    const maxLength = Math.max(minLength, tuning.flow.maxLength);
    const length = flow.effectiveLength || flow.length;
    const lengthScale = maxLength === minLength ? 1 : Math.min(1, (length - minLength) / (maxLength - minLength));
    return Math.round(tuning.flow.minPercent + (tuning.flow.maxPercent - tuning.flow.minPercent) * lengthScale);
  }

  function buildBonuses(patterns, tuning) {
    const bonuses = [];
    const wavePower = patterns.waves.reduce((sum, wave) => sum + wave.length, 0);
    bonuses.push({
      id: 'wave',
      name: 'Waves',
      active: patterns.waves.length > 0,
      progress: `${patterns.waves.length} wave${patterns.waves.length === 1 ? '' : 's'}; longest ${patterns.waves[0]?.length || 0}; peak amplitude ${Math.max(0, ...patterns.waves.map(wave => wave.amplitude || 0))}`,
      description: 'Alternate inner and outer conduits. Waves empower the nodes along their path; wide swings (amplitude) pay more.',
      attrs: {},
      derived: { attackDamage: wavePower, spellDamage: wavePower }
    });
    const flowPower = patterns.flows.reduce((sum, flow) => sum + flowPercent(tuning, flow), 0);
    bonuses.push({
      id: 'flow',
      name: 'Flows',
      active: patterns.flows.length > 0,
      progress: `${patterns.flows.length} flow${patterns.flows.length === 1 ? '' : 's'}; longest ${patterns.flows[0]?.length || 0}; +${flowPower}% total conduit effect`,
      description: 'Keep conduit chirality the same for long runs. Flows empower the attribute layer.',
      attrs: {},
      derived: {}
    });
    bonuses.push({
      id: 'meridian',
      name: 'Great Wave Meridian',
      active: patterns.meridians.length > 0,
      progress: `${patterns.meridians.length} rim-to-rim wave${patterns.meridians.length === 1 ? '' : 's'}`,
      description: 'Run an alternating wave from rim to rim through the origin.',
      attrs: patterns.meridians.length ? { str: 10, dex: 10, int: 10 } : {},
      derived: patterns.meridians.length ? { cooldownRecovery: 10, attackDamage: 12, spellDamage: 12 } : {}
    });
    const loopPower = patterns.loops.reduce((sum, loop) => sum + loop.radius, 0);
    bonuses.push({
      id: 'circle',
      name: 'Loop Crowns',
      active: patterns.loops.length > 0,
      progress: `${patterns.loops.length} loop crown${patterns.loops.length === 1 ? '' : 's'}; ${patterns.concentric.length} concentric`,
      description: 'Close radius 1-3 loops around allocated centers. Concentric crowns compound the center fantasy.',
      attrs: { int: loopPower * 2, dex: loopPower * 2, str: loopPower * 2 },
      derived: { spellDamage: loopPower * 6, guard: loopPower * 18, ward: loopPower * 18 }
    });
    const piscisCount = patterns.vesicas.filter(vesica => vesica.form === 'piscis').length;
    const vesicaWeight = patterns.vesicas.length + piscisCount; // piscis counts double
    bonuses.push({
      id: 'vesica',
      name: 'Vesica Lenses',
      active: patterns.vesicas.length > 0,
      progress: `${patterns.vesicas.length} twin-loop lens${patterns.vesicas.length === 1 ? '' : 'es'}${piscisCount ? ` (${piscisCount} vesica piscis)` : ''}`,
      description: 'Overlap two loop crowns: rings sharing an edge, or the true vesica piscis with each center on the other’s ring.',
      attrs: {},
      derived: patterns.vesicas.length ? { critChance: vesicaWeight, ailmentEffect: vesicaWeight * 3 } : {}
    });
    bonuses.push({
      id: 'orbit',
      name: 'Grand Orbits',
      active: patterns.grandOrbits.length > 0,
      progress: `${patterns.grandOrbits.map(orbit => `r${orbit.ring}`).join(', ') || 'none'}`,
      description: 'Allocate a complete ring around the origin.',
      attrs: patterns.grandOrbits.reduce((out, orbit) => {
        out.str += orbit.ring * tuning.grandOrbit.attrsPerRing;
        out.dex += orbit.ring * tuning.grandOrbit.attrsPerRing;
        out.int += orbit.ring * tuning.grandOrbit.attrsPerRing;
        return out;
      }, { str: 0, dex: 0, int: 0 }),
      derived: {}
    });
    bonuses.push({
      id: 'mirror',
      name: 'Mirror Symmetry',
      active: patterns.symmetry.mirrorPairs.length + patterns.symmetry.mirroredConduits > 0,
      progress: `${patterns.symmetry.mirrorPairs.length} node pairs; ${patterns.symmetry.mirroredConduits} conduit pairs`,
      description: 'Match allocation across the vertical INT axis.',
      attrs: {
        int: Math.round(patterns.symmetry.mirrorPairs.length * tuning.symmetry.mirrorAttrsPerPair),
        dex: Math.round(patterns.symmetry.mirrorPairs.length * tuning.symmetry.mirrorAttrsPerPair),
        str: Math.round(patterns.symmetry.mirrorPairs.length * tuning.symmetry.mirrorAttrsPerPair)
      },
      derived: patterns.symmetry.mirrorPairs.length ? { allResistances: Math.round(patterns.symmetry.mirrorPairs.length / 2) } : {}
    });
    bonuses.push({
      id: 'trine',
      name: 'Trine Symmetry',
      active: patterns.symmetry.trines.length > 0,
      progress: `${patterns.symmetry.trines.length} matched triple${patterns.symmetry.trines.length === 1 ? '' : 's'}`,
      description: 'Repeat allocation under 120-degree rotation.',
      attrs: {
        str: patterns.symmetry.trines.length * tuning.symmetry.trineAttrsPerTriple,
        dex: patterns.symmetry.trines.length * tuning.symmetry.trineAttrsPerTriple,
        int: patterns.symmetry.trines.length * tuning.symmetry.trineAttrsPerTriple
      },
      derived: {}
    });
    bonuses.push({
      id: 'mandala',
      name: 'Mandala Symmetry',
      active: patterns.symmetry.mandalas.length > 0,
      progress: `${patterns.symmetry.mandalas.length} sixfold set${patterns.symmetry.mandalas.length === 1 ? '' : 's'}`,
      description: 'Repeat allocation under every 60-degree rotation.',
      attrs: {
        str: patterns.symmetry.mandalas.length * tuning.symmetry.mandalaAttrsPerSet,
        dex: patterns.symmetry.mandalas.length * tuning.symmetry.mandalaAttrsPerSet,
        int: patterns.symmetry.mandalas.length * tuning.symmetry.mandalaAttrsPerSet
      },
      derived: {}
    });
    bonuses.push({
      id: 'circuit',
      name: 'Redundant Circuits',
      active: patterns.circuits.redundant.length > 0,
      progress: `${patterns.circuits.redundant.length} redundant conduit${patterns.circuits.redundant.length === 1 ? '' : 's'}`,
      description: 'Maintain an alternate active route around allocated conduits.',
      attrs: patterns.circuits.redundant.length ? { dex: patterns.circuits.redundant.length, int: patterns.circuits.redundant.length } : {},
      derived: patterns.circuits.redundant.length ? { ward: patterns.circuits.redundant.length * 9, evasion: patterns.circuits.redundant.length * 9 } : {}
    });
    bonuses.push({
      id: 'enclosure',
      name: 'Warding Circles',
      active: patterns.enclosures.length > 0,
      progress: `${patterns.enclosures.length} enclosure${patterns.enclosures.length === 1 ? '' : 's'}`,
      description: 'Close a circuit around one or more unallocated seats.',
      attrs: {},
      derived: patterns.enclosures.length
        ? {
          guard: patterns.enclosures.reduce(
            (sum, enclosure) => sum + Math.round(tuning.enclosure.guardPerNode * (enclosure.guardMultiplier || 1)),
            0
          )
        }
        : {}
    });
    bonuses.push({
      id: 'rod',
      name: 'Rods',
      active: patterns.rods.length > 0,
      progress: `${patterns.rods.length} straight run${patterns.rods.length === 1 ? '' : 's'}; longest ${patterns.rods[0]?.length || 0}`,
      description: 'Allocate straight runs of at least three conduits in any lattice direction.',
      attrs: {},
      derived: patterns.rods.length ? { attackDamage: patterns.rods.length * tuning.rods.endpointBonus } : {}
    });
    bonuses.push({
      id: 'crossroad',
      name: 'Crossroads',
      active: patterns.crossroads.length > 0,
      progress: `${patterns.crossroads.length} hub node${patterns.crossroads.length === 1 ? '' : 's'}`,
      description: 'Allocate four or more conduits from a single node.',
      attrs: patterns.crossroads.reduce((out, hub) => {
        const bonus = Math.max(0, hub.degree - 3) * tuning.crossroads.perExtra;
        out.str += bonus; out.dex += bonus; out.int += bonus;
        return out;
      }, { str: 0, dex: 0, int: 0 }),
      derived: {}
    });
    return bonuses;
  }

  function detectPatterns(input = {}) {
    const tuning = cloneTuning(input.tuning);
    const ctx = normalize(input);
    const depth = input.depth || Math.max(0, ...ctx.mainNodes.map(node => node.ring || 0));

    // Shared-claim Waystones exempt their touching conduits from wave/flow
    // exclusivity (one wave and one flow may both count them).
    const sharedClaimIds = new Set();
    hooksFor(input, 'shared-claim').forEach(hook => {
      const nodeId = axialKey(hook.q, hook.r);
      ctx.allocatedConduits.forEach(conduit => {
        if (conduit.fromId === nodeId || conduit.toId === nodeId) sharedClaimIds.add(conduit.id);
      });
    });
    const exclusive = selectExclusivePaths(ctx, tuning, sharedClaimIds);

    // Wave-length: pattern-stones (radius) and Blue-Milestone-style hooks
    // (exact seat) count touching waves longer for payoff purposes.
    const waveStones = stonesFor(input, 'wave-length')
      .concat(hooksFor(input, 'wave-length').map(hook => ({ ...hook, radius: 0 })));
    exclusive.waves.forEach(wave => {
      const bonus = waveStones.reduce((sum, stone) => {
        const touches = wave.nodeIds.some(id => {
          const node = ctx.nodeMap.get(id);
          return node && node.q != null && withinStoneRadius(stone, node.q, node.r);
        });
        return sum + (touches ? (stone.value || 1) : 0);
      }, 0);
      if (bonus > 0) wave.effectiveLength = wave.length + bonus;
      wave.amplitude = Math.round(waveAmplitude(ctx, wave) * 10) / 10;
    });

    // Flow-length: Unlit-Milestone-style hooks count flows through them longer.
    const flowHooks = hooksFor(input, 'flow-length');
    exclusive.flows.forEach(flow => {
      const bonus = flowHooks.reduce((sum, hook) =>
        sum + (flow.nodeIds.includes(axialKey(hook.q, hook.r)) ? (hook.value || 1) : 0), 0);
      if (bonus > 0) flow.effectiveLength = flow.length + bonus;
    });

    const loopData = detectLoops(ctx, tuning, stonesFor(input, 'loop-gap'));

    // Enclosure-boost: Votive-Milestone-style hooks strengthen warding circles
    // whose perimeter carries the Waystone.
    const enclosureHooks = hooksFor(input, 'enclosure-boost');
    loopData.enclosures.forEach(enclosure => {
      const bonus = enclosureHooks.reduce((sum, hook) =>
        sum + (enclosure.nodeIds.includes(axialKey(hook.q, hook.r)) ? (hook.value || 0.5) : 0), 0);
      enclosure.guardMultiplier = 1 + bonus;
    });
    const grandOrbits = detectGrandOrbits(ctx);
    const symmetry = detectSymmetry(ctx);
    const rods = detectRods(ctx, tuning).sort((a, b) => b.length - a.length);
    const crossroads = detectCrossroads(ctx, tuning);
    const circuits = detectCircuits(ctx);
    const meridians = detectMeridians(ctx, exclusive.waves, depth);
    const nodeBoosts = {};
    const conduitBoosts = {};
    exclusive.waves.forEach(wave => {
      wave.nodeIds.forEach((nodeId, index) => {
        addNodeBoost(nodeBoosts, nodeId, wavePercent(tuning, wave, index), `wave length ${wave.length}`);
      });
    });
    exclusive.flows.forEach(flow => {
      const percent = flowPercent(tuning, flow);
      flow.conduitIds.forEach(conduitId => {
        addConduitBoost(conduitBoosts, conduitId, percent, `flow length ${flow.length}`);
      });
    });
    meridians.forEach(wave => {
      [wave.nodeIds[0], wave.nodeIds[wave.nodeIds.length - 1]].forEach(nodeId => {
        addNodeBoost(nodeBoosts, nodeId, tuning.wave.meridianEndpointPercent, 'great wave endpoint');
      });
    });
    const rodHookIds = new Set(hooksFor(input, 'rod-double').map(hook => axialKey(hook.q, hook.r)));
    rods.forEach(rod => {
      const endpoints = [rod.nodeIds[0], rod.nodeIds[rod.nodeIds.length - 1]];
      const doubled = endpoints.some(nodeId => rodHookIds.has(nodeId));
      endpoints.forEach(nodeId => {
        addNodeBoost(
          nodeBoosts,
          nodeId,
          tuning.rods.endpointPercent * (doubled ? 2 : 1),
          `rod endpoint length ${rod.length}${doubled ? ' (Waystone doubled)' : ''}`
        );
      });
    });
    const patterns = {
      waves: exclusive.waves,
      flows: exclusive.flows,
      meridians,
      loops: loopData.loops,
      concentric: loopData.concentric,
      vesicas: loopData.vesicas,
      grandOrbits,
      symmetry,
      circuits,
      enclosures: loopData.enclosures,
      rods,
      crossroads,
      nodeBoosts,
      conduitBoosts,
      searchExhausted: exclusive.searchExhausted,
      tuning
    };
    patterns.bonuses = buildBonuses(patterns, tuning);
    return patterns;
  }

  return {
    DEFAULT_TUNING,
    HEX_DIRECTIONS,
    axialKey,
    edgeKey,
    hexDistance,
    rotate60Key,
    detectPatterns
  };
}));
