/*
 * Invariant tests for the Cartographer map generator.
 * Run: node tools/cartographer/core/test.js
 */
'use strict';

const MapGen = require('./mapgen.js');

const { TILE, WALKABLE, ZONES } = MapGen;
let failures = 0;
let checks = 0;

function assert(cond, msg) {
  checks++;
  if (!cond) {
    failures++;
    console.error('FAIL: ' + msg);
  }
}

// walk distance entrance -> exit over walkable tiles, or -1 if unreachable
function walkDistance(map, sx, sy, tx, ty) {
  const { width: w, height: h, tiles } = map;
  const dist = new Int32Array(w * h).fill(-1);
  const queue = new Int32Array(w * h);
  let head = 0, tail = 0;
  dist[sy * w + sx] = 0;
  queue[tail++] = sy * w + sx;
  while (head < tail) {
    const i = queue[head++];
    const x = i % w, y = (i / w) | 0;
    if (x === tx && y === ty) return dist[i];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (dist[ni] === -1 && WALKABLE.has(tiles[ni])) {
        dist[ni] = dist[i] + 1;
        queue[tail++] = ni;
      }
    }
  }
  return -1;
}

const sizes = [
  { width: 48, height: 36 },
  { width: 72, height: 54 },
  { width: 112, height: 84 }
];

for (const zoneId of Object.keys(ZONES)) {
  for (const themeId of ZONES[zoneId].themes) {
    for (let s = 0; s < 4; s++) {
      const seed = 1000 + s * 7919;
      const size = sizes[s % sizes.length];
      const label = `${zoneId}/${themeId} seed=${seed} ${size.width}x${size.height}`;
      const map = MapGen.generate({ zone: zoneId, theme: themeId, seed, ...size });

      // determinism
      const map2 = MapGen.generate({ zone: zoneId, theme: themeId, seed, ...size });
      assert(Buffer.from(map.tiles).equals(Buffer.from(map2.tiles)), `${label}: tiles not deterministic`);
      assert(JSON.stringify(map.entities) === JSON.stringify(map2.entities), `${label}: entities not deterministic`);

      // metadata
      assert(map.zone === zoneId && map.theme === themeId, `${label}: zone/theme echo`);
      assert(map.tiles.length === size.width * size.height, `${label}: tile buffer size`);

      // tile ids in range
      let badTile = false;
      const maxTile = Math.max(...Object.values(TILE));
      for (const t of map.tiles) if (t > maxTile) badTile = true;
      assert(!badTile, `${label}: tile id out of range`);

      // gates exist, are walkable, and are mutually reachable
      assert(map.entrance && map.exit, `${label}: missing gates`);
      const ent = map.tiles[map.entrance.y * map.width + map.entrance.x];
      const ext = map.tiles[map.exit.y * map.width + map.exit.x];
      assert(WALKABLE.has(ent), `${label}: entrance on non-walkable tile (${ent})`);
      assert(WALKABLE.has(ext), `${label}: exit on non-walkable tile (${ext})`);
      const dist = Math.abs(map.entrance.x - map.exit.x) + Math.abs(map.entrance.y - map.exit.y);
      assert(dist >= 8, `${label}: gates too close (${dist})`);
      const walk = walkDistance(map, map.entrance.x, map.entrance.y, map.exit.x, map.exit.y);
      assert(walk >= 0, `${label}: exit unreachable from entrance`);
      // clear-speed invariant: the run to the exit must stay near-direct;
      // a labyrinthine layout blows past this bound
      const bound = (size.width + size.height) * 2.2;
      assert(walk <= bound, `${label}: entrance->exit walk too long (${walk} > ${bound.toFixed(0)})`);

      // directionality: the boss lives deep along the flow axis
      assert(map.boss && WALKABLE.has(map.tiles[map.boss.y * map.width + map.boss.x]),
        `${label}: boss missing or on non-walkable tile`);
      assert(Array.isArray(map.axis) && (Math.abs(map.axis[0]) + Math.abs(map.axis[1]) === 1),
        `${label}: bad flow axis`);
      {
        const proj = (p) => p.x * map.axis[0] + p.y * map.axis[1];
        let lo = Infinity, hi = -Infinity;
        for (let yy = 0; yy < map.height; yy++)
          for (let xx = 0; xx < map.width; xx++)
            if (WALKABLE.has(map.tiles[yy * map.width + xx])) {
              const pp = xx * map.axis[0] + yy * map.axis[1];
              if (pp < lo) lo = pp;
              if (pp > hi) hi = pp;
            }
        const span = hi - lo || 1;
        const depth = (proj(map.boss) - proj(map.entrance)) / span;
        assert(depth >= 0.5, `${label}: boss not deep along axis (depth ${depth.toFixed(2)})`);
      }

      // main path: contiguous walkable spine from portal to boss
      assert(map.mainPath.length >= 2, `${label}: main path missing`);
      const mp = map.mainPath;
      assert(mp[0][0] === map.entrance.x && mp[0][1] === map.entrance.y, `${label}: main path start`);
      assert(mp[mp.length - 1][0] === map.boss.x && mp[mp.length - 1][1] === map.boss.y, `${label}: main path end`);
      let contiguous = true, pathWalkable = true;
      for (let k = 0; k < mp.length; k++) {
        if (!WALKABLE.has(map.tiles[mp[k][1] * map.width + mp[k][0]])) pathWalkable = false;
        if (k && Math.abs(mp[k][0] - mp[k - 1][0]) + Math.abs(mp[k][1] - mp[k - 1][1]) !== 1) contiguous = false;
      }
      assert(contiguous, `${label}: main path not contiguous`);
      assert(pathWalkable, `${label}: main path crosses non-walkable tile`);

      // spawns: a boss, and packs pacing the run
      const bosses = map.spawns.filter(s => s.type === 'boss');
      assert(bosses.length === 1, `${label}: expected 1 boss spawn, got ${bosses.length}`);
      const packs = map.spawns.filter(s => s.type !== 'boss');
      assert(packs.length >= 4, `${label}: too few packs (${packs.length})`);
      for (const s of map.spawns) {
        assert(WALKABLE.has(map.tiles[s.y * map.width + s.x]), `${label}: ${s.type} spawn on non-walkable tile`);
      }

      // entities in bounds; torches on walls, everything else walkable
      for (const e of map.entities) {
        assert(e.x >= 0 && e.y >= 0 && e.x < map.width && e.y < map.height, `${label}: entity ${e.type} out of bounds`);
        const t = map.tiles[e.y * map.width + e.x];
        if (e.type === 'torch') {
          assert(t === TILE.WALL, `${label}: torch not on wall (${t})`);
        } else {
          assert(WALKABLE.has(t), `${label}: ${e.type} on non-walkable tile (${t}) at ${e.x},${e.y}`);
        }
      }

      // no two entities share a tile
      const spots = new Set();
      let overlap = false;
      for (const e of map.entities) {
        const k = e.x + ',' + e.y;
        if (spots.has(k)) overlap = true;
        spots.add(k);
      }
      assert(!overlap, `${label}: overlapping entities`);

      // JSON round trip
      const json = MapGen.toJSON(map);
      const back = MapGen.fromJSON(JSON.parse(JSON.stringify(json)));
      assert(Buffer.from(back.tiles).equals(Buffer.from(map.tiles)), `${label}: JSON round trip mismatch`);
    }
  }
}

// string seeds hash deterministically
const a = MapGen.generate({ zone: 'caves', seed: 'the dark below', width: 48, height: 36 });
const b = MapGen.generate({ zone: 'caves', seed: 'the dark below', width: 48, height: 36 });
assert(Buffer.from(a.tiles).equals(Buffer.from(b.tiles)), 'string seed not deterministic');

// different seeds actually differ
const d1 = MapGen.generate({ zone: 'dungeon', theme: 'crypt', seed: 1, width: 72, height: 54 });
const d2 = MapGen.generate({ zone: 'dungeon', theme: 'crypt', seed: 2, width: 72, height: 54 });
assert(!Buffer.from(d1.tiles).equals(Buffer.from(d2.tiles)), 'different seeds produced identical maps');

console.log(`${checks} checks, ${failures} failures`);
process.exit(failures ? 1 : 0);
