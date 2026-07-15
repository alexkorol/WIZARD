import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js";

const TAU = Math.PI * 2;
const LOOP_SECONDS = 36;
const WATER_LEVEL = 0.285;
const ISLAND_RX = 5.9;
const ISLAND_RZ = 4.2;
const WORLD_RX = 8.35;
const WORLD_RZ = 5.85;
const WORLD_WATER_LEVEL = 0.14;

const EPIC_CONTINENTS = [
  { name: "The High March", x: -0.45, z: -0.15, rx: 3.15, rz: 1.75, rotation: -0.08, seed: 17, biome: "temperate", capital: [0.65, 0.72], ridge: [-2.25, 0.35, 2.35, -0.12, 0.48, 1.02], peaks: [[-1.55, 0.22, 0.64], [0.05, 0.02, 0.78], [1.45, -0.18, 0.62]] },
  { name: "The Shattered Choir", x: -4.25, z: 0.85, rx: 1.75, rz: 1.4, rotation: -0.2, seed: 41, biome: "lush", capital: [-0.55, 0.48], ridge: [-1.2, -0.45, 0.95, 0.35, 0.4, 0.78], peaks: [[-0.55, -0.1, 0.5], [0.45, 0.2, 0.46]] },
  { name: "Aster Vale", x: -0.85, z: 3.1, rx: 2.65, rz: 1.25, rotation: 0.08, seed: 73, biome: "verdant", capital: [0.2, 0.44], ridge: [-1.65, 0.32, 1.55, -0.18, 0.38, 0.6], peaks: [[-0.85, 0.2, 0.38], [0.8, -0.08, 0.34]] },
  { name: "The Copper Waste", x: 4.05, z: 1.05, rx: 2.35, rz: 1.55, rotation: 0.17, seed: 103, biome: "desert", capital: [0.1, 0.52], ridge: [-1.65, -0.25, 1.55, 0.18, 0.47, 0.82], peaks: [[-0.7, -0.2, 0.48], [0.9, 0.22, 0.54]] },
  { name: "Cairnreach", x: 1.7, z: -3.15, rx: 2.7, rz: 1.18, rotation: -0.03, seed: 137, biome: "alpine", capital: [0.6, 0.38], ridge: [-1.75, 0.18, 1.85, -0.12, 0.4, 0.78], peaks: [[-1.0, 0.12, 0.5], [0.65, -0.1, 0.56]] },
  { name: "The Lantern Isles", x: 5.35, z: -2.25, rx: 1.25, rz: 0.88, rotation: 0.34, seed: 181, biome: "verdant", capital: [-0.15, 0.18], ridge: [-0.72, -0.16, 0.7, 0.12, 0.3, 0.44], peaks: [[0.05, 0, 0.3]] },
  { name: "Morrow Keys", x: -5.75, z: -2.2, rx: 0.82, rz: 0.48, rotation: 0.24, seed: 211, biome: "lush", islet: true, ridge: [-0.42, 0.04, 0.38, -0.05, 0.25, 0.26], peaks: [[0.02, 0, 0.2]] },
  { name: "Sunken Stars", x: 2.25, z: 3.88, rx: 0.68, rz: 0.42, rotation: -0.38, seed: 239, biome: "desert", islet: true, ridge: [-0.34, -0.03, 0.32, 0.06, 0.22, 0.22], peaks: [[-0.02, 0, 0.16]] },
  { name: "Gale Teeth", x: 6.25, z: 2.85, rx: 0.58, rz: 0.38, rotation: 0.15, seed: 277, biome: "alpine", islet: true, ridge: [-0.3, 0.02, 0.28, -0.04, 0.2, 0.25], peaks: [[0.04, 0, 0.18]] },
];

const canvas = document.querySelector("#world");
const fallback = document.querySelector("#fallback");
const fpsEl = document.querySelector("#fps");
const qualitySelect = document.querySelector("#quality");
const qualityState = document.querySelector("#quality-state");
const menuStatus = document.querySelector("#menu-status");
const taglineEl = document.querySelector("#tagline");
const worldStateText = document.querySelector("#world-state-text");
const variantButtons = [...document.querySelectorAll("[data-view]")];

window.clearTimeout(window.__verdigrisBootTimer);

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, value) => {
  const t = clamp((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hash2(x, z) {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function valueNoise(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const a = mix(hash2(ix, iz), hash2(ix + 1, iz), ux);
  const b = mix(hash2(ix, iz + 1), hash2(ix + 1, iz + 1), ux);
  return mix(a, b, uz) * 2 - 1;
}

function fbm(x, z) {
  let value = 0;
  let amplitude = 0.54;
  let frequency = 1;
  for (let octave = 0; octave < 5; octave += 1) {
    value += valueNoise(x * frequency, z * frequency) * amplitude;
    frequency *= 2.03;
    amplitude *= 0.48;
  }
  return value;
}

function distanceToSegment(x, z, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSq = dx * dx + dz * dz;
  const t = clamp(((x - ax) * dx + (z - az) * dz) / lengthSq);
  const px = ax + dx * t;
  const pz = az + dz * t;
  const sx = x - px;
  const sz = z - pz;
  return Math.sqrt(sx * sx + sz * sz);
}

function boundaryScale(angle) {
  return 1
    + Math.sin(angle * 3 + 0.35) * 0.075
    + Math.sin(angle * 5 - 1.15) * 0.038
    + Math.cos(angle * 8 + 0.7) * 0.022
    + Math.sin(angle * 13) * 0.012;
}

function islandMetric(x, z) {
  const nx = x / ISLAND_RX;
  const nz = z / ISLAND_RZ;
  const angle = Math.atan2(nz, nx);
  return Math.sqrt(nx * nx + nz * nz) / boundaryScale(angle);
}

function heightAt(x, z) {
  const metric = islandMetric(x, z);
  const coast = smooth(0, 0.075, 1 - metric);
  if (coast <= 0) return 0.145;

  const continental = 0.42 + fbm(x * 0.31 + 7.2, z * 0.31 - 3.7) * 0.23;
  const detail = fbm(x * 0.88 - 11.3, z * 0.88 + 5.1) * 0.14
    + fbm(x * 1.85 + 3.2, z * 1.85 - 8.1) * 0.055;

  const ridgeTextureA = 0.7 + Math.pow(1 - Math.abs(fbm(x * 0.82 + 4, z * 0.82 - 9)), 2) * 0.58;
  const ridgeTextureB = 0.72 + Math.pow(1 - Math.abs(fbm(x * 0.95 - 7, z * 0.95 + 11)), 2) * 0.48;

  const northRidgeDistance = distanceToSegment(x, z, -3.7, 1.35, 1.5, 1.18);
  const northRidge = Math.exp(-Math.pow(northRidgeDistance / 0.36, 2))
    * (1.08 + valueNoise(x * 1.1, z * 1.1) * 0.2) * ridgeTextureA;

  const northRidgeTwoDistance = distanceToSegment(x, z, -3.25, 0.72, 0.45, 0.66);
  const northRidgeTwo = Math.exp(-Math.pow(northRidgeTwoDistance / 0.27, 2))
    * (0.58 + valueNoise(x * 1.35 - 2, z * 1.35 + 5) * 0.12) * ridgeTextureB;

  const westernRidgeDistance = distanceToSegment(x, z, -3.35, -1.35, -0.75, 0.2);
  const westernRidge = Math.exp(-Math.pow(westernRidgeDistance / 0.4, 2))
    * (0.78 + valueNoise(x * 0.9 + 2, z * 1.2) * 0.17) * ridgeTextureB;

  const farRidgeDistance = distanceToSegment(x, z, -2.85, -1.6, 3.55, -1.28);
  const farRidge = Math.exp(-Math.pow(farRidgeDistance / 0.34, 2))
    * (0.64 + valueNoise(x * 1.22 + 9, z * 1.22 - 3) * 0.2) * ridgeTextureA;

  const heroDx = (x - 1.55) / 1.22;
  const heroDz = (z + 0.2) / 1.0;
  const heroMassif = Math.exp(-(heroDx * heroDx + heroDz * heroDz)) * 1.16;

  const eastShoulderDx = (x - 3.5) / 1.15;
  const eastShoulderDz = (z - 0.75) / 0.95;
  const eastShoulder = Math.exp(-(eastShoulderDx * eastShoulderDx + eastShoulderDz * eastShoulderDz)) * 0.72;

  const southShelfDx = (x + 1.65) / 1.55;
  const southShelfDz = (z + 2.15) / 0.82;
  const southShelf = Math.exp(-(southShelfDx * southShelfDx + southShelfDz * southShelfDz)) * 0.46;

  const riverDistance = Math.min(
    distanceToSegment(x, z, -0.35, -0.55, 1.4, 0.38),
    distanceToSegment(x, z, 1.4, 0.38, 2.75, 0.75),
    distanceToSegment(x, z, 2.75, 0.75, 5.45, 1.82),
  );
  const riverCut = Math.exp(-Math.pow(riverDistance / 0.2, 2)) * smooth(0.15, 0.92, metric) * 0.64;

  const basinADx = (x + 0.42) / 1.25;
  const basinADz = (z + 0.64) / 0.68;
  const basinA = Math.exp(-(basinADx * basinADx + basinADz * basinADz)) * 0.52;
  const basinBDx = (x - 2.75) / 0.64;
  const basinBDz = (z - 0.74) / 0.4;
  const basinB = Math.exp(-(basinBDx * basinBDx + basinBDz * basinBDz)) * 0.74;

  const centralValleyDx = (x + 0.2) / 1.45;
  const centralValleyDz = (z + 0.4) / 1.0;
  const centralValley = Math.exp(-(centralValleyDx * centralValleyDx + centralValleyDz * centralValleyDz)) * 0.25;
  const longValleyDistance = distanceToSegment(x, z, -3.2, -0.15, 0.5, 0.22);
  const longValley = Math.exp(-Math.pow(longValleyDistance / 0.48, 2)) * 0.24;

  const ridgeBreak = 0.72 + Math.pow(1 - Math.abs(fbm(x * 0.74 + 12, z * 0.74 - 6)), 2) * 0.5;
  const peakA = Math.exp(-(((x + 2.9) / 0.82) ** 2 + ((z - 1.25) / 0.62) ** 2)) * 0.42 * ridgeBreak;
  const peakB = Math.exp(-(((x + 1.45) / 0.94) ** 2 + ((z - 1.18) / 0.7) ** 2)) * 0.34 * ridgeBreak;
  const peakC = Math.exp(-(((x + 2.65) / 0.98) ** 2 + ((z + 1.0) / 0.78) ** 2)) * 0.38 * ridgeBreak;

  const form = continental + detail + northRidge + northRidgeTwo + westernRidge + farRidge + heroMassif + eastShoulder + southShelf
    + peakA + peakB + peakC - riverCut - basinA - basinB - centralValley - longValley;
  const edgeTerrace = smooth(0.7, 0.98, metric);
  const coastTerrace = Math.floor(coast * 5) / 5;
  const shapedCoast = mix(coast, coastTerrace, edgeTerrace * 0.58);
  return 0.145 + shapedCoast * Math.max(0.04, form);
}

function slopeAt(x, z) {
  const step = 0.045;
  const dx = (heightAt(x + step, z) - heightAt(x - step, z)) / (step * 2);
  const dz = (heightAt(x, z + step) - heightAt(x, z - step)) / (step * 2);
  return Math.sqrt(dx * dx + dz * dz);
}

function biomeColor(x, z, height, slope, target) {
  const variation = fbm(x * 1.7 + 4, z * 1.7 - 2) * 0.5 + 0.5;
  const shore = smooth(0.22, 0.39, height);
  const cliff = smooth(0.52, 1.18, slope);
  const highland = smooth(1.15, 2.15, height);

  const sand = [0.155 + variation * 0.055, 0.16 + variation * 0.045, 0.135 + variation * 0.035];
  const grass = [0.075 + variation * 0.04, 0.19 + variation * 0.06, 0.12 + variation * 0.035];
  const stone = [0.19 + variation * 0.075, 0.205 + variation * 0.065, 0.195 + variation * 0.055];
  const crown = [0.3 + variation * 0.055, 0.315 + variation * 0.05, 0.285 + variation * 0.045];

  let r = mix(sand[0], grass[0], shore);
  let g = mix(sand[1], grass[1], shore);
  let b = mix(sand[2], grass[2], shore);
  r = mix(r, stone[0], cliff);
  g = mix(g, stone[1], cliff);
  b = mix(b, stone[2], cliff);
  const cap = highland * (0.42 + cliff * 0.58);
  r = mix(r, crown[0], cap);
  g = mix(g, crown[1], cap);
  b = mix(b, crown[2], cap);
  target.setRGB(r, g, b);
}

function createTerrainGeometry() {
  const segments = 160;
  const rings = 46;
  const positions = [];
  const colors = [];
  const indices = [];
  const color = new THREE.Color();

  const centerHeight = heightAt(0, 0);
  biomeColor(0, 0, centerHeight, slopeAt(0, 0), color);
  positions.push(0, centerHeight, 0);
  colors.push(color.r, color.g, color.b);

  for (let ring = 1; ring <= rings; ring += 1) {
    const radial = ring / rings;
    const easedRadial = Math.pow(radial, 0.88);
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = segment / segments * TAU;
      const boundary = boundaryScale(angle);
      const x = Math.cos(angle) * ISLAND_RX * boundary * easedRadial;
      const z = Math.sin(angle) * ISLAND_RZ * boundary * easedRadial;
      const height = heightAt(x, z);
      const slope = slopeAt(x, z);
      biomeColor(x, z, height, slope, color);
      positions.push(x, height, z);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(0, 1 + (segment + 1) % segments, 1 + segment);
  }
  for (let ring = 1; ring < rings; ring += 1) {
    const inner = 1 + (ring - 1) * segments;
    const outer = 1 + ring * segments;
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(inner + segment, outer + next, outer + segment);
      indices.push(inner + segment, inner + next, outer + next);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createUndersideGeometry() {
  const segments = 160;
  const levels = 11;
  const positions = [];
  const colors = [];
  const indices = [];

  for (let level = 0; level < levels; level += 1) {
    const depth = level / (levels - 1);
    const taperProfile = [0.99, 0.96, 0.88, 0.82, 0.7, 0.61, 0.5, 0.4, 0.29, 0.19, 0.085];
    const taper = taperProfile[level];
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = segment / segments * TAU + Math.sin(level * 0.82) * 0.032;
      const boundary = boundaryScale(angle);
      const shelf = Math.floor(segment / 5);
      const cleft = 0.91 + hash2(shelf, level * 3 + 7) * 0.13
        + Math.sin(angle * 7 + depth * 5) * 0.025 * (1 - depth);
      const x = Math.cos(angle) * ISLAND_RX * boundary * taper * cleft;
      const z = Math.sin(angle) * ISLAND_RZ * boundary * taper * cleft;
      const depthProfile = [0, 0.62, 1.22, 1.62, 2.2, 2.66, 3.25, 3.72, 4.32, 4.92, 5.5];
      const hanging = depthProfile[level];
      const y = 0.11 - hanging + Math.sin(angle * 5 - depth * 3) * 0.11 * depth;
      const fleck = hash2(shelf, level) * 0.016;
      const stratum = (level % 3) * 0.009;
      positions.push(x, y, z);
      colors.push(0.042 + stratum + fleck, 0.052 + stratum + fleck * 0.7, 0.05 + stratum + fleck * 0.55);
    }
  }

  for (let level = 0; level < levels - 1; level += 1) {
    const upper = level * segments;
    const lower = (level + 1) * segments;
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(upper + segment, lower + segment, lower + next);
      indices.push(upper + segment, lower + next, upper + next);
    }
  }

  const bottom = positions.length / 3;
  positions.push(0, -5.9, 0);
  colors.push(0.08, 0.09, 0.085);
  const finalRing = (levels - 1) * segments;
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(finalRing + segment, bottom, finalRing + (segment + 1) % segments);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createWaterGeometry() {
  const positions = [];
  const edges = [];
  const indices = [];

  function addBasin(cx, cz, rx, rz, y, rotation, segments = 72, rings = 9) {
    const center = positions.length / 3;
    positions.push(cx, y, cz);
    edges.push(0);
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    for (let ring = 1; ring <= rings; ring += 1) {
      const radial = ring / rings;
      for (let segment = 0; segment < segments; segment += 1) {
        const angle = segment / segments * TAU;
        const localX = Math.cos(angle) * rx * radial * (1 + Math.sin(angle * 5) * 0.035);
        const localZ = Math.sin(angle) * rz * radial * (1 + Math.cos(angle * 4) * 0.025);
        positions.push(cx + localX * cosR - localZ * sinR, y, cz + localX * sinR + localZ * cosR);
        edges.push(radial);
      }
    }
    for (let segment = 0; segment < segments; segment += 1) {
      indices.push(center, center + 1 + segment, center + 1 + (segment + 1) % segments);
    }
    for (let ring = 1; ring < rings; ring += 1) {
      const inner = center + 1 + (ring - 1) * segments;
      const outer = center + 1 + ring * segments;
      for (let segment = 0; segment < segments; segment += 1) {
        const next = (segment + 1) % segments;
        indices.push(inner + segment, outer + segment, outer + next, inner + segment, outer + next, inner + next);
      }
    }
  }

  function addRiver(points) {
    const offset = positions.length / 3;
    points.forEach((point, index) => {
      const before = points[Math.max(0, index - 1)];
      const after = points[Math.min(points.length - 1, index + 1)];
      const dx = after.x - before.x;
      const dz = after.z - before.z;
      const length = Math.max(0.001, Math.sqrt(dx * dx + dz * dz));
      const tx = -dz / length;
      const tz = dx / length;
      positions.push(point.x + tx * point.width, point.y, point.z + tz * point.width);
      positions.push(point.x - tx * point.width, point.y, point.z - tz * point.width);
      edges.push(1, 1);
    });
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = offset + index * 2;
      indices.push(a, a + 2, a + 3, a, a + 3, a + 1);
    }
  }

  function addCurvedRiver(controlPoints, startWidth, endWidth, divisions = 28) {
    const curve = new THREE.CatmullRomCurve3(controlPoints.map((point) => new THREE.Vector3(point.x, point.y, point.z)));
    const sampled = curve.getPoints(divisions).map((point, index) => ({
      x: point.x,
      y: point.y,
      z: point.z,
      width: mix(startWidth, endWidth, index / divisions) * (1 + Math.sin(index * 1.7) * 0.04),
    }));
    addRiver(sampled);
  }

  addBasin(-0.42, -0.64, 1.18, 0.62, 0.355, -0.18);
  addBasin(2.75, 0.74, 0.62, 0.38, 0.49, 0.22, 56, 7);
  addCurvedRiver([
    { x: -0.35, y: 0.355, z: -0.58 },
    { x: 0.3, y: 0.39, z: -0.2 },
    { x: 1.35, y: 0.42, z: 0.35 },
    { x: 2.3, y: 0.46, z: 0.65 },
  ], 0.105, 0.085, 24);
  addCurvedRiver([
    { x: 2.25, y: 0.46, z: 0.65 },
    { x: 2.75, y: 0.49, z: 0.74 },
    { x: 3.35, y: 0.42, z: 0.94 },
    { x: 4.25, y: 0.32, z: 1.25 },
    { x: 5.45, y: 0.2, z: 1.82 },
  ], 0.085, 0.14, 36);

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aEdge", new THREE.Float32BufferAttribute(edges, 1));
  geometry.computeVertexNormals();
  return geometry;
}

function worldBoundaryScale(angle) {
  return 1
    + Math.sin(angle * 5 + 0.4) * 0.018
    + Math.sin(angle * 9 - 1.1) * 0.012
    + Math.cos(angle * 14) * 0.007;
}

function continentBoundaryScale(config, angle) {
  return 1
    + Math.sin(angle * 3 + config.seed) * 0.11
    + Math.sin(angle * 5 - config.seed * 0.37) * 0.055
    + Math.cos(angle * 9 + config.seed * 0.13) * 0.026;
}

function continentMetricLocal(config, x, z) {
  const angle = Math.atan2(z / config.rz, x / config.rx);
  const radial = Math.sqrt((x / config.rx) ** 2 + (z / config.rz) ** 2);
  return radial / continentBoundaryScale(config, angle);
}

function continentHeightLocal(config, x, z) {
  const metric = continentMetricLocal(config, x, z);
  const coast = smooth(0, 0.11, 1 - metric);
  if (coast <= 0) return WORLD_WATER_LEVEL + 0.075;
  const [ax, az, bx, bz, ridgeWidth, ridgeHeight] = config.ridge;
  const ridgeDistance = distanceToSegment(x, z, ax, az, bx, bz);
  const ridgeNoise = 0.68 + Math.pow(1 - Math.abs(fbm(x * 1.24 + config.seed, z * 1.24 - config.seed)), 2) * 0.42;
  const ridgeBreaks = 0.6 + Math.pow(Math.abs(Math.sin((x * 1.37 + z * 0.83) * 2.35 + config.seed)), 1.85) * 0.52;
  const ridge = Math.exp(-Math.pow(ridgeDistance / ridgeWidth, 2)) * ridgeHeight * ridgeNoise * ridgeBreaks * 0.88;
  let peaks = 0;
  for (let index = 0; index < config.peaks.length; index += 1) {
    const [px, pz, amplitude] = config.peaks[index];
    const dx = (x - px) / 0.68;
    const dz = (z - pz) / 0.56;
    peaks += Math.exp(-(dx * dx + dz * dz)) * amplitude * ridgeNoise * 0.74;
  }
  const shelf = 0.21 + fbm(x * 0.42 + config.seed * 0.17, z * 0.42 - config.seed * 0.11) * 0.075;
  const detail = fbm(x * 1.65 + config.seed * 0.07, z * 1.65 - config.seed * 0.05) * 0.038;
  const valleyDistance = distanceToSegment(x, z, -config.rx * 0.62, -config.rz * 0.45, config.rx * 0.65, config.rz * 0.52);
  const valley = Math.exp(-Math.pow(valleyDistance / 0.24, 2)) * 0.13;
  const edgeTerrace = smooth(0.72, 0.98, metric);
  const terracedCoast = Math.floor(coast * 4) / 4;
  const shapedCoast = mix(coast, terracedCoast, edgeTerrace * 0.42);
  return WORLD_WATER_LEVEL + 0.075 + shapedCoast * Math.max(0.035, shelf + detail + ridge + peaks - valley);
}

function continentSlopeLocal(config, x, z) {
  const step = 0.035;
  const dx = (continentHeightLocal(config, x + step, z) - continentHeightLocal(config, x - step, z)) / (step * 2);
  const dz = (continentHeightLocal(config, x, z + step) - continentHeightLocal(config, x, z - step)) / (step * 2);
  return Math.sqrt(dx * dx + dz * dz);
}

function continentToWorld(config, x, z, target) {
  const cos = Math.cos(config.rotation);
  const sin = Math.sin(config.rotation);
  target.x = config.x + x * cos - z * sin;
  target.z = config.z + x * sin + z * cos;
  return target;
}

function epicLandSample(x, z) {
  let best = null;
  for (let index = 0; index < EPIC_CONTINENTS.length; index += 1) {
    const config = EPIC_CONTINENTS[index];
    const dx = x - config.x;
    const dz = z - config.z;
    const cos = Math.cos(config.rotation);
    const sin = Math.sin(config.rotation);
    const localX = dx * cos + dz * sin;
    const localZ = -dx * sin + dz * cos;
    const metric = continentMetricLocal(config, localX, localZ);
    if (metric <= 1 && (!best || metric < best.metric)) {
      best = { config, localX, localZ, metric, height: continentHeightLocal(config, localX, localZ) };
    }
  }
  return best;
}

function epicBiomeColor(config, x, z, height, slope, target) {
  const variation = fbm(x * 1.8 + config.seed, z * 1.8 - config.seed) * 0.5 + 0.5;
  const palettes = {
    temperate: { low: [0.035, 0.16, 0.07], mid: [0.07, 0.23, 0.085], rock: [0.18, 0.17, 0.14], cap: [0.38, 0.4, 0.35] },
    lush: { low: [0.02, 0.13, 0.085], mid: [0.035, 0.205, 0.105], rock: [0.15, 0.18, 0.15], cap: [0.34, 0.39, 0.33] },
    verdant: { low: [0.04, 0.17, 0.065], mid: [0.08, 0.255, 0.075], rock: [0.19, 0.18, 0.13], cap: [0.4, 0.41, 0.32] },
    desert: { low: [0.3, 0.105, 0.025], mid: [0.43, 0.17, 0.035], rock: [0.25, 0.1, 0.045], cap: [0.47, 0.29, 0.13] },
    alpine: { low: [0.045, 0.14, 0.085], mid: [0.1, 0.2, 0.11], rock: [0.21, 0.23, 0.22], cap: [0.5, 0.53, 0.49] },
  };
  const palette = palettes[config.biome];
  const cliff = smooth(0.72, 1.42, slope);
  const highland = smooth(0.88, 1.48, height);
  const lowMix = smooth(WORLD_WATER_LEVEL + 0.16, WORLD_WATER_LEVEL + 0.42, height);
  let r = mix(palette.low[0], palette.mid[0], lowMix);
  let g = mix(palette.low[1], palette.mid[1], lowMix);
  let b = mix(palette.low[2], palette.mid[2], lowMix);
  r = mix(r, palette.rock[0], cliff);
  g = mix(g, palette.rock[1], cliff);
  b = mix(b, palette.rock[2], cliff);
  const cap = highland * (0.12 + cliff * 0.42);
  r = mix(r, palette.cap[0], cap);
  g = mix(g, palette.cap[1], cap);
  b = mix(b, palette.cap[2], cap);
  const tint = 0.82 + variation * 0.22;
  target.setRGB(r * tint, g * tint, b * tint);
}

function createContinentGeometry(config) {
  const segments = 96;
  const rings = 28;
  const positions = [];
  const colors = [];
  const indices = [];
  const color = new THREE.Color();
  const point = { x: 0, z: 0 };
  const centerHeight = continentHeightLocal(config, 0, 0);
  epicBiomeColor(config, 0, 0, centerHeight, continentSlopeLocal(config, 0, 0), color);
  positions.push(config.x, centerHeight, config.z);
  colors.push(color.r, color.g, color.b);
  for (let ring = 1; ring <= rings; ring += 1) {
    const radial = Math.pow(ring / rings, 0.9);
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = segment / segments * TAU;
      const boundary = continentBoundaryScale(config, angle);
      const localX = Math.cos(angle) * config.rx * boundary * radial;
      const localZ = Math.sin(angle) * config.rz * boundary * radial;
      const height = continentHeightLocal(config, localX, localZ);
      const slope = continentSlopeLocal(config, localX, localZ);
      continentToWorld(config, localX, localZ, point);
      epicBiomeColor(config, localX, localZ, height, slope, color);
      positions.push(point.x, height, point.z);
      colors.push(color.r, color.g, color.b);
    }
  }
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(0, 1 + (segment + 1) % segments, 1 + segment);
  }
  for (let ring = 1; ring < rings; ring += 1) {
    const inner = 1 + (ring - 1) * segments;
    const outer = 1 + ring * segments;
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(inner + segment, outer + next, outer + segment);
      indices.push(inner + segment, inner + next, outer + next);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createEpicCliffGeometry() {
  const segments = 96;
  const positions = [];
  const colors = [];
  const indices = [];
  const point = { x: 0, z: 0 };
  for (let continentIndex = 0; continentIndex < EPIC_CONTINENTS.length; continentIndex += 1) {
    const config = EPIC_CONTINENTS[continentIndex];
    const offset = positions.length / 3;
    for (let level = 0; level < 3; level += 1) {
      for (let segment = 0; segment < segments; segment += 1) {
        const angle = segment / segments * TAU + level * 0.008;
        const boundary = continentBoundaryScale(config, angle);
        const scale = level === 0 ? 0.997 : level === 1 ? 1.008 : 0.985;
        const localX = Math.cos(angle) * config.rx * boundary * scale;
        const localZ = Math.sin(angle) * config.rz * boundary * scale;
        continentToWorld(config, localX, localZ, point);
        const height = level === 0 ? continentHeightLocal(config, localX, localZ) : level === 1 ? WORLD_WATER_LEVEL + 0.035 : WORLD_WATER_LEVEL - 0.085;
        const band = level * 0.025 + hash2(segment, config.seed) * 0.025;
        positions.push(point.x, height, point.z);
        colors.push(0.13 + band, 0.12 + band * 0.8, 0.1 + band * 0.55);
      }
    }
    for (let level = 0; level < 2; level += 1) {
      const upper = offset + level * segments;
      const lower = offset + (level + 1) * segments;
      for (let segment = 0; segment < segments; segment += 1) {
        const next = (segment + 1) % segments;
        indices.push(upper + segment, lower + segment, lower + next, upper + segment, lower + next, upper + next);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createEpicOceanGeometry() {
  const segments = 192;
  const rings = 34;
  const positions = [0, WORLD_WATER_LEVEL, 0];
  const edges = [0];
  const indices = [];
  for (let ring = 1; ring <= rings; ring += 1) {
    const radial = ring / rings;
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = segment / segments * TAU;
      const boundary = worldBoundaryScale(angle);
      positions.push(Math.cos(angle) * WORLD_RX * boundary * radial, WORLD_WATER_LEVEL, Math.sin(angle) * WORLD_RZ * boundary * radial);
      edges.push(radial);
    }
  }
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(0, 1 + segment, 1 + (segment + 1) % segments);
  }
  for (let ring = 1; ring < rings; ring += 1) {
    const inner = 1 + (ring - 1) * segments;
    const outer = 1 + ring * segments;
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(inner + segment, outer + segment, outer + next, inner + segment, outer + next, inner + next);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aEdge", new THREE.Float32BufferAttribute(edges, 1));
  geometry.computeVertexNormals();
  return geometry;
}

function createEpicUndersideGeometry() {
  const segments = 192;
  const profiles = [1, 0.98, 0.91, 0.79, 0.65, 0.5, 0.34, 0.18, 0.07];
  const depths = [0.08, -0.42, -0.95, -1.55, -2.18, -2.85, -3.55, -4.2, -4.72];
  const positions = [];
  const colors = [];
  const indices = [];
  for (let level = 0; level < profiles.length; level += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = segment / segments * TAU + Math.sin(level * 0.74) * 0.018;
      const boundary = worldBoundaryScale(angle);
      const fracture = 0.93 + hash2(Math.floor(segment / 6), level + 51) * 0.11;
      const x = Math.cos(angle) * WORLD_RX * boundary * profiles[level] * fracture;
      const z = Math.sin(angle) * WORLD_RZ * boundary * profiles[level] * fracture;
      const y = depths[level] + Math.sin(angle * 7 + level) * 0.08 * (level / profiles.length);
      const band = (level % 3) * 0.01 + hash2(segment, level) * 0.014;
      positions.push(x, y, z);
      colors.push(0.034 + band, 0.045 + band * 0.8, 0.047 + band * 0.65);
    }
  }
  for (let level = 0; level < profiles.length - 1; level += 1) {
    const upper = level * segments;
    const lower = (level + 1) * segments;
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(upper + segment, lower + segment, lower + next, upper + segment, lower + next, upper + next);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createEpicCoastlines() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0x8bd0c1, transparent: true, opacity: 0.28, depthWrite: false });
  const point = { x: 0, z: 0 };
  EPIC_CONTINENTS.forEach((config) => {
    const positions = [];
    for (let segment = 0; segment < 96; segment += 1) {
      const angle = segment / 96 * TAU;
      const boundary = continentBoundaryScale(config, angle) * 1.014;
      const localX = Math.cos(angle) * config.rx * boundary;
      const localZ = Math.sin(angle) * config.rz * boundary;
      continentToWorld(config, localX, localZ, point);
      positions.push(new THREE.Vector3(point.x, WORLD_WATER_LEVEL + 0.035, point.z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(positions);
    group.add(new THREE.LineLoop(geometry, material));
  });
  return group;
}

function createEpicWaterfallGeometry() {
  const falls = [
    { angle: 0.18, width: 0.34, length: 3.8, seed: 0.4 },
    { angle: 0.92, width: 0.22, length: 3.25, seed: 1.3 },
    { angle: 1.76, width: 0.3, length: 3.65, seed: 2.1 },
    { angle: 2.73, width: 0.18, length: 2.9, seed: 3.7 },
    { angle: 3.62, width: 0.24, length: 3.5, seed: 4.4 },
    { angle: 4.78, width: 0.16, length: 3.0, seed: 5.6 },
    { angle: 5.55, width: 0.26, length: 3.75, seed: 6.2 },
  ];
  const acrossSegments = 5;
  const downSegments = 36;
  const positions = [];
  const uvs = [];
  const seeds = [];
  const indices = [];
  falls.forEach((fall) => {
    const offset = positions.length / 3;
    const boundary = worldBoundaryScale(fall.angle);
    const edgeX = Math.cos(fall.angle) * WORLD_RX * boundary;
    const edgeZ = Math.sin(fall.angle) * WORLD_RZ * boundary;
    const radialX = Math.cos(fall.angle);
    const radialZ = Math.sin(fall.angle);
    const tangentX = -radialZ;
    const tangentZ = radialX;
    for (let down = 0; down <= downSegments; down += 1) {
      const v = down / downSegments;
      const outward = v * 0.24;
      for (let across = 0; across <= acrossSegments; across += 1) {
        const u = across / acrossSegments;
        const width = (u - 0.5) * fall.width;
        positions.push(edgeX + tangentX * width + radialX * outward, WORLD_WATER_LEVEL - v * fall.length, edgeZ + tangentZ * width + radialZ * outward);
        uvs.push(u, v);
        seeds.push(fall.seed);
      }
    }
    const stride = acrossSegments + 1;
    for (let down = 0; down < downSegments; down += 1) {
      for (let across = 0; across < acrossSegments; across += 1) {
        const a = offset + down * stride + across;
        const b = a + stride;
        indices.push(a, b, b + 1, a, b + 1, a + 1);
      }
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return geometry;
}

function createEpicTrees() {
  const maxTrees = 920;
  const random = seeded(4201);
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.024, 0.18, 5), new THREE.MeshStandardMaterial({ color: 0x3b281c, roughness: 1 }), maxTrees);
  const crowns = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.98, flatShading: true, emissive: 0x12382a, emissiveIntensity: 0.5 }), maxTrees);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  let count = 0;
  let attempts = 0;
  while (count < maxTrees && attempts < 18000) {
    attempts += 1;
    const x = mix(-7.4, 7.4, random());
    const z = mix(-5.1, 5.1, random());
    const sample = epicLandSample(x, z);
    if (!sample || sample.metric > 0.88) continue;
    const slope = continentSlopeLocal(sample.config, sample.localX, sample.localZ);
    const forestMask = fbm(x * 0.72 + sample.config.seed, z * 0.72 - sample.config.seed);
    if (forestMask < -0.06 || slope > 0.88 || sample.height > 1.18 || sample.height < WORLD_WATER_LEVEL + 0.16) continue;
    if (sample.config.biome === "desert" && random() > 0.18) continue;
    if (sample.config.islet && random() > 0.25) continue;
    const size = mix(0.54, 1.04, random());
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, random() * TAU);
    position.set(x, sample.height + 0.09 * size, z);
    scale.set(size, size, size);
    matrix.compose(position, quaternion, scale);
    trunks.setMatrixAt(count, matrix);
    position.y = sample.height + 0.23 * size;
    scale.set(size * 0.84, size * 1.24, size * 0.84);
    matrix.compose(position, quaternion, scale);
    crowns.setMatrixAt(count, matrix);
    const hue = sample.config.biome === "desert" ? 0.19 : sample.config.biome === "alpine" ? 0.37 : 0.39;
    color.setHSL(hue + (random() - 0.5) * 0.03, 0.48, sample.config.biome === "desert" ? 0.29 : 0.28 + random() * 0.09);
    crowns.setColorAt(count, color);
    count += 1;
  }
  trunks.count = crowns.count = count;
  trunks.castShadow = crowns.castShadow = true;
  trunks.receiveShadow = crowns.receiveShadow = true;
  if (crowns.instanceColor) crowns.instanceColor.needsUpdate = true;
  return { trunks, crowns, maxCount: count };
}

function createEpicLandmarks(materials) {
  const random = seeded(9027);
  const sites = [];
  EPIC_CONTINENTS.forEach((config, continentIndex) => {
    if (config.islet) return;
    const count = config.biome === "desert" ? 4 : 3;
    for (let index = 0; index < count; index += 1) {
      const angle = random() * TAU;
      const radial = mix(0.22, 0.62, random());
      const localX = Math.cos(angle) * config.rx * radial;
      const localZ = Math.sin(angle) * config.rz * radial;
      const point = { x: 0, z: 0 };
      continentToWorld(config, localX, localZ, point);
      sites.push({ x: point.x, z: point.z, y: continentHeightLocal(config, localX, localZ), scale: (index === 0 ? mix(1.25, 1.65, random()) : mix(0.72, 1.12, random())), rotation: random() * TAU });
    }
  });
  const bases = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.16, 0.08, 8), materials.lightStone, sites.length);
  const towers = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.055, 0.08, 0.24, 7), materials.stone, sites.length);
  const caps = new THREE.InstancedMesh(new THREE.ConeGeometry(0.075, 0.13, 7), materials.copper, sites.length);
  const rings = new THREE.InstancedMesh(new THREE.TorusGeometry(0.1, 0.012, 5, 18), materials.rune, sites.length);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  sites.forEach((site, index) => {
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, site.rotation);
    scale.setScalar(site.scale);
    position.set(site.x, site.y + 0.04 * site.scale, site.z);
    matrix.compose(position, quaternion, scale);
    bases.setMatrixAt(index, matrix);
    position.y = site.y + 0.2 * site.scale;
    matrix.compose(position, quaternion, scale);
    towers.setMatrixAt(index, matrix);
    position.y = site.y + 0.38 * site.scale;
    matrix.compose(position, quaternion, scale);
    caps.setMatrixAt(index, matrix);
    position.y = site.y + 0.31 * site.scale;
    quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, site.rotation, 0));
    matrix.compose(position, quaternion, scale);
    rings.setMatrixAt(index, matrix);
  });
  bases.castShadow = towers.castShadow = caps.castShadow = true;
  const group = new THREE.Group();
  group.add(bases, towers, caps, rings);
  return group;
}

function createEpicCapitals(materials) {
  const sites = EPIC_CONTINENTS.filter((config) => config.capital).map((config, index) => {
    const [localX, localZ] = config.capital;
    const point = { x: 0, z: 0 };
    continentToWorld(config, localX, localZ, point);
    return {
      x: point.x,
      z: point.z,
      y: continentHeightLocal(config, localX, localZ),
      rotation: config.rotation + index * 0.41,
      scale: index === 0 ? 1.22 : 0.9 + (index % 3) * 0.08,
    };
  });
  const foundations = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.34, 0.42, 0.11, 10), materials.darkStone, sites.length);
  const halls = new THREE.InstancedMesh(new THREE.BoxGeometry(0.44, 0.16, 0.3), materials.lightStone, sites.length);
  const keeps = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.16, 0.48, 8), materials.stone, sites.length);
  const roofs = new THREE.InstancedMesh(new THREE.ConeGeometry(0.18, 0.21, 8), materials.copper, sites.length);
  const beacons = new THREE.InstancedMesh(new THREE.TorusGeometry(0.17, 0.018, 6, 20), materials.rune, sites.length);
  const buttresses = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.23, 0.16), materials.lightStone, sites.length * 4);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  sites.forEach((site, index) => {
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, site.rotation);
    scale.setScalar(site.scale);
    position.set(site.x, site.y + 0.055 * site.scale, site.z);
    matrix.compose(position, quaternion, scale);
    foundations.setMatrixAt(index, matrix);
    position.y = site.y + 0.18 * site.scale;
    matrix.compose(position, quaternion, scale);
    halls.setMatrixAt(index, matrix);
    position.y = site.y + 0.41 * site.scale;
    matrix.compose(position, quaternion, scale);
    keeps.setMatrixAt(index, matrix);
    position.y = site.y + 0.75 * site.scale;
    matrix.compose(position, quaternion, scale);
    roofs.setMatrixAt(index, matrix);
    position.y = site.y + 0.64 * site.scale;
    quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, site.rotation, 0));
    matrix.compose(position, quaternion, scale);
    beacons.setMatrixAt(index, matrix);
    for (let side = 0; side < 4; side += 1) {
      const angle = site.rotation + side * Math.PI / 2;
      position.set(site.x + Math.cos(angle) * 0.27 * site.scale, site.y + 0.18 * site.scale, site.z + Math.sin(angle) * 0.27 * site.scale);
      quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, angle);
      matrix.compose(position, quaternion, scale);
      buttresses.setMatrixAt(index * 4 + side, matrix);
    }
  });
  foundations.castShadow = halls.castShadow = keeps.castShadow = roofs.castShadow = buttresses.castShadow = true;
  const group = new THREE.Group();
  group.add(foundations, halls, keeps, roofs, beacons, buttresses);
  return group;
}

function createCliffFragments(material) {
  const random = seeded(7103);
  const count = 18;
  const mesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.5, 0), material, count);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  for (let index = 0; index < count; index += 1) {
    const angle = random() * TAU;
    const boundary = boundaryScale(angle);
    const depthBands = [0.58, 1.18, 1.62, 2.2, 2.68, 3.25, 3.72, 4.3];
    const depth = depthBands[Math.floor(random() * depthBands.length)] + (random() - 0.5) * 0.12;
    const radial = mix(0.97, 0.5, depth / 3.7);
    position.set(
      Math.cos(angle) * ISLAND_RX * boundary * radial,
      -depth,
      Math.sin(angle) * ISLAND_RZ * boundary * radial,
    );
    euler.set(random() * 0.7, angle + random() * 0.5, random() * 0.5);
    quaternion.setFromEuler(euler);
    const size = 0.28 + random() * 0.42;
    scale.set(size * (1.7 + random() * 1.2), size * (0.28 + random() * 0.3), size * (0.7 + random() * 0.5));
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  }
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

function edgePoint(angle) {
  const boundary = boundaryScale(angle) * 1.005;
  return {
    x: Math.cos(angle) * ISLAND_RX * boundary,
    z: Math.sin(angle) * ISLAND_RZ * boundary,
  };
}

function createWaterfallGeometry() {
  const falls = [
    { angle: 0.34, width: 0.78, length: 4.75, start: 0.21, seed: 0.2 },
    { angle: 1.18, width: 0.22, length: 3.45, start: 0.16, seed: 1.7 },
    { angle: 2.25, width: 0.14, length: 2.85, start: 0.15, seed: 3.1 },
  ];
  const acrossSegments = 8;
  const downSegments = 48;
  const positions = [];
  const uvs = [];
  const seeds = [];
  const indices = [];

  falls.forEach((fall) => {
    const offset = positions.length / 3;
    const edge = edgePoint(fall.angle);
    const radialX = Math.cos(fall.angle);
    const radialZ = Math.sin(fall.angle);
    const tangentX = -radialZ;
    const tangentZ = radialX;

    for (let down = 0; down <= downSegments; down += 1) {
      const v = down / downSegments;
      const outward = v * 0.28 + Math.sin(v * Math.PI) * 0.08;
      for (let across = 0; across <= acrossSegments; across += 1) {
        const u = across / acrossSegments;
        const widthOffset = (u - 0.5) * fall.width * (1 - v * 0.1);
        positions.push(
          edge.x + tangentX * widthOffset + radialX * outward,
          fall.start - v * fall.length,
          edge.z + tangentZ * widthOffset + radialZ * outward,
        );
        uvs.push(u, v);
        seeds.push(fall.seed);
      }
    }

    const stride = acrossSegments + 1;
    for (let down = 0; down < downSegments; down += 1) {
      for (let across = 0; across < acrossSegments; across += 1) {
        const a = offset + down * stride + across;
        const b = a + stride;
        indices.push(a, b, b + 1, a, b + 1, a + 1);
      }
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return geometry;
}

function createWaterMist() {
  const random = seeded(9921);
  const fallData = [
    { angle: 0.34, length: 4.75, start: 0.21, spread: 0.82 },
    { angle: 1.18, length: 3.45, start: 0.16, spread: 0.38 },
    { angle: 2.25, length: 2.85, start: 0.15, spread: 0.28 },
  ];
  const count = 180;
  const positions = new Float32Array(count * 3);
  const data = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const fall = fallData[index % fallData.length];
    const edge = edgePoint(fall.angle);
    positions[index * 3] = edge.x;
    positions[index * 3 + 1] = fall.start - fall.length;
    positions[index * 3 + 2] = edge.z;
    data[index * 3] = random();
    data[index * 3 + 1] = (random() - 0.5) * fall.spread;
    data[index * 3 + 2] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aData", new THREE.BufferAttribute(data, 3));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      uniform float uTime;
      attribute vec3 aData;
      varying float vAlpha;
      void main(){
        vec3 p=position;
        float life=mod(aData.x+uTime*(0.035+aData.z*0.03),1.0);
        p.x+=aData.y*(0.3+life)+sin(aData.z*20.0+uTime)*life*0.16;
        p.z+=cos(aData.x*31.0+uTime*0.7)*life*0.22;
        p.y+=life*(0.42+aData.z*0.35);
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_PointSize=(3.0+aData.z*7.0)*(95.0/-mv.z);
        vAlpha=(1.0-life)*smoothstep(0.0,0.18,life)*0.14;
        gl_Position=projectionMatrix*mv;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main(){
        float d=length(gl_PointCoord-0.5);
        float a=smoothstep(0.5,0.05,d)*vAlpha;
        gl_FragColor=vec4(0.48,0.83,0.8,a);
      }
    `,
  });
  return new THREE.Points(geometry, material);
}

function createTrees() {
  const maxTrees = 420;
  const random = seeded(1847);
  const trunkGeometry = new THREE.CylinderGeometry(0.025, 0.045, 0.3, 5);
  const crownGeometry = new THREE.DodecahedronGeometry(0.17, 0);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x493426, roughness: 1, flatShading: true });
  const crownMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    flatShading: true,
    emissive: 0x15392a,
    emissiveIntensity: 0.48,
  });
  const trunks = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, maxTrees);
  const crowns = new THREE.InstancedMesh(crownGeometry, crownMaterial, maxTrees);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  let count = 0;
  let attempts = 0;

  while (count < maxTrees && attempts < 9000) {
    attempts += 1;
    const x = mix(-5.25, 5.25, random());
    const z = mix(-3.65, 3.65, random());
    if (islandMetric(x, z) > 0.86) continue;
    const height = heightAt(x, z);
    const slope = slopeAt(x, z);
    const heroDistance = Math.hypot(x - 1.55, z + 0.2);
    const basinA = Math.hypot((x + 0.42) / 1.35, (z + 0.64) / 0.76);
    const basinB = Math.hypot((x - 2.75) / 0.72, (z - 0.74) / 0.48);
    if (height < 0.37 || slope > 1.05 || heroDistance < 1.55 || basinA < 1 || basinB < 1) continue;

    const size = mix(0.7, 1.35, random()) * (height > 1.35 ? 0.78 : 1);
    const leanX = (random() - 0.5) * 0.12;
    const leanZ = 0.08 + random() * 0.12;
    euler.set(leanX, random() * TAU, leanZ);
    quaternion.setFromEuler(euler);

    position.set(x, height + 0.15 * size, z);
    scale.set(size, size, size);
    matrix.compose(position, quaternion, scale);
    trunks.setMatrixAt(count, matrix);

    position.set(x + leanZ * 0.1, height + 0.37 * size, z - leanX * 0.1);
    scale.set(size * 0.82, size * 1.38, size * 0.84);
    matrix.compose(position, quaternion, scale);
    crowns.setMatrixAt(count, matrix);
    color.setHSL(0.39 + (random() - 0.5) * 0.035, 0.4 + random() * 0.12, 0.25 + random() * 0.09);
    crowns.setColorAt(count, color);
    count += 1;
  }

  trunks.count = crowns.count = count;
  trunks.castShadow = crowns.castShadow = true;
  trunks.receiveShadow = crowns.receiveShadow = true;
  trunks.instanceMatrix.needsUpdate = crowns.instanceMatrix.needsUpdate = true;
  if (crowns.instanceColor) crowns.instanceColor.needsUpdate = true;
  return { trunks, crowns, maxCount: count };
}

function createWaystones(materials) {
  const sites = [
    [-3.65, -0.45, 0.2],
    [-2.1, 2.0, -0.45],
    [3.7, 1.35, 0.65],
    [2.55, -2.35, -0.7],
    [-0.55, 2.45, 0.4],
  ];
  const group = new THREE.Group();
  const pillars = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.5, 0.11), materials.darkStone, sites.length * 2);
  const lintels = new THREE.InstancedMesh(new THREE.BoxGeometry(0.48, 0.11, 0.12), materials.lightStone, sites.length);
  const runes = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.055, 0), materials.core, sites.length);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3(1, 1, 1);

  sites.forEach(([x, z, rotation], index) => {
    const height = heightAt(x, z);
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, rotation);
    for (let side = -1; side <= 1; side += 2) {
      position.set(x + cos * side * 0.17, height + 0.25, z - sin * side * 0.17);
      matrix.compose(position, quaternion, scale);
      pillars.setMatrixAt(index * 2 + (side === 1 ? 1 : 0), matrix);
    }
    position.set(x, height + 0.49, z);
    matrix.compose(position, quaternion, scale);
    lintels.setMatrixAt(index, matrix);
    position.set(x, height + 0.31, z - 0.065);
    matrix.compose(position, quaternion, scale);
    runes.setMatrixAt(index, matrix);
  });
  pillars.castShadow = lintels.castShadow = true;
  pillars.receiveShadow = lintels.receiveShadow = true;
  group.add(pillars, lintels, runes);
  return group;
}

function createCloudLayer() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = textureCanvas.height = 256;
  const context = textureCanvas.getContext("2d");
  context.clearRect(0, 0, 256, 256);
  const random = seeded(744);
  for (let index = 0; index < 22; index += 1) {
    const x = mix(38, 218, random());
    const y = mix(90, 168, random());
    const radius = mix(34, 82, random());
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(198,220,211,${mix(0.12, 0.3, random())})`);
    gradient.addColorStop(0.48, "rgba(132,169,164,.11)");
    gradient.addColorStop(1, "rgba(80,116,119,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: 0x9bb6b0,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
    fog: true,
  });
  const group = new THREE.Group();
  const sprites = [];
  for (let index = 0; index < 10; index += 1) {
    const sprite = new THREE.Sprite(material);
    const near = index > 7;
    const x = mix(-13, 15, random());
    sprite.position.set(x, near ? mix(0.4, 2.4, random()) : mix(3.0, 7.5, random()), near ? mix(4, 7, random()) : mix(-13, -7, random()));
    const width = near ? mix(5, 7, random()) : mix(7, 12, random());
    sprite.scale.set(width, width * mix(0.22, 0.34, random()), 1);
    sprite.userData.baseX = x;
    sprite.userData.speed = mix(0.06, 0.14, random());
    group.add(sprite);
    sprites.push(sprite);
  }
  return { group, sprites, texture };
}

function createAmbientMotes() {
  const maxCount = 440;
  const random = seeded(557);
  const positions = new Float32Array(maxCount * 3);
  const data = new Float32Array(maxCount * 3);
  let index = 0;
  while (index < maxCount) {
    const x = mix(-5.4, 5.4, random());
    const z = mix(-3.8, 3.8, random());
    if (islandMetric(x, z) > 0.94) continue;
    positions[index * 3] = x;
    positions[index * 3 + 1] = heightAt(x, z) + mix(0.18, 1.8, random());
    positions[index * 3 + 2] = z;
    data[index * 3] = random();
    data[index * 3 + 1] = random();
    data[index * 3 + 2] = random();
    index += 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aData", new THREE.BufferAttribute(data, 3));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      uniform float uTime;attribute vec3 aData;varying vec3 vColor;varying float vAlpha;
      void main(){
        vec3 p=position;
        p.x+=sin(uTime*(0.12+aData.x*0.12)+aData.z*18.0)*0.08;
        p.y+=sin(uTime*(0.18+aData.y*0.1)+aData.x*23.0)*0.1;
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_PointSize=(0.9+aData.y*1.35)*(110.0/-mv.z);
        vColor=mix(vec3(0.78,0.47,0.2),vec3(0.2,0.72,0.62),aData.z);
        vAlpha=0.08+aData.x*0.12;
        gl_Position=projectionMatrix*mv;
      }
    `,
    fragmentShader: `varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-0.5);gl_FragColor=vec4(vColor,smoothstep(0.5,0.04,d)*vAlpha);}`,
  });
  return new THREE.Points(geometry, material);
}

function createFlock() {
  const birdCount = 9;
  const positions = new Float32Array(birdCount * 4 * 3);
  const random = seeded(882);
  for (let index = 0; index < birdCount; index += 1) {
    const x = index * 0.52 + (random() - 0.5) * 0.3;
    const y = (random() - 0.5) * 0.72 - Math.abs(index - 4) * 0.05;
    const offset = index * 12;
    positions.set([x - 0.13, y + 0.06, 0, x, y, 0, x, y, 0, x + 0.13, y + 0.06, 0], offset);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: 0xb9d6ce, transparent: true, opacity: 0, depthWrite: false });
  const flock = new THREE.LineSegments(geometry, material);
  flock.frustumCulled = false;
  return flock;
}

function createLightning() {
  const points = [];
  const random = seeded(331);
  let x = 9.6;
  let y = 11;
  for (let index = 0; index < 15; index += 1) {
    points.push(new THREE.Vector3(x, y, -10));
    x += (random() - 0.5) * 0.7;
    y -= 0.52 + random() * 0.25;
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x8fe8dc, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const line = new THREE.Line(geometry, material);
  line.frustumCulled = false;
  return line;
}

function shadow(mesh, cast = true, receive = true) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

function createCitadel(materials) {
  const group = new THREE.Group();
  group.name = "Crown of Tides";
  group.position.set(1.55, heightAt(1.55, -0.2) + 0.02, -0.2);
  group.rotation.y = -0.18;

  const add = (geometry, material, x, y, z, scale = 1) => {
    const mesh = shadow(new THREE.Mesh(geometry, material));
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(scale);
    group.add(mesh);
    return mesh;
  };

  add(new THREE.CylinderGeometry(1.38, 1.52, 0.24, 12), materials.darkStone, 0, 0.12, 0);
  add(new THREE.CylinderGeometry(1.2, 1.34, 0.28, 12), materials.stone, 0, 0.35, 0);
  add(new THREE.CylinderGeometry(0.92, 1.1, 0.28, 10), materials.lightStone, 0, 0.61, 0);
  add(new THREE.TorusGeometry(1.15, 0.045, 7, 72), materials.copperDark, 0, 0.53, 0).rotation.x = Math.PI / 2;

  const buttressGeometry = new THREE.BoxGeometry(0.17, 0.72, 0.26);
  const buttresses = new THREE.InstancedMesh(buttressGeometry, materials.darkStone, 8);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  for (let index = 0; index < 8; index += 1) {
    const angle = index / 8 * TAU;
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -angle);
    position.set(Math.cos(angle) * 0.83, 0.76, Math.sin(angle) * 0.83);
    scale.set(1, 1, 1);
    matrix.compose(position, quaternion, scale);
    buttresses.setMatrixAt(index, matrix);
  }
  buttresses.castShadow = buttresses.receiveShadow = true;
  group.add(buttresses);

  add(new THREE.CylinderGeometry(0.52, 0.72, 1.38, 8, 3), materials.stone, 0, 1.28, 0);
  add(new THREE.CylinderGeometry(0.62, 0.56, 0.15, 8), materials.copper, 0, 1.98, 0);
  add(new THREE.TorusGeometry(0.585, 0.032, 7, 56), materials.copperDark, 0, 1.08, 0).rotation.x = Math.PI / 2;
  add(new THREE.TorusGeometry(0.545, 0.028, 7, 56), materials.verdigrisMetal, 0, 1.68, 0).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(0.34, 0.46, 0.62, 8, 2), materials.lightStone, 0, 2.35, 0);
  add(new THREE.CylinderGeometry(0.48, 0.38, 0.12, 8), materials.verdigrisMetal, 0, 2.65, 0);

  const towerGeometry = new THREE.CylinderGeometry(0.18, 0.26, 1.08, 7, 2);
  const towers = new THREE.InstancedMesh(towerGeometry, materials.stone, 4);
  const caps = new THREE.InstancedMesh(new THREE.ConeGeometry(0.22, 0.48, 7), materials.copper, 4);
  const towerAngles = [0.15, Math.PI * 0.5 + 0.15, Math.PI + 0.15, Math.PI * 1.5 + 0.15];
  towerAngles.forEach((angle, index) => {
    position.set(Math.cos(angle) * 0.88, 1.08, Math.sin(angle) * 0.88);
    quaternion.identity();
    matrix.compose(position, quaternion, scale.set(1, 1, 1));
    towers.setMatrixAt(index, matrix);
    position.y = 1.79;
    matrix.compose(position, quaternion, scale);
    caps.setMatrixAt(index, matrix);
  });
  towers.castShadow = towers.receiveShadow = caps.castShadow = caps.receiveShadow = true;
  group.add(towers, caps);

  const masonry = new THREE.InstancedMesh(new THREE.BoxGeometry(0.24, 0.13, 0.11), materials.lightStone, 24);
  for (let index = 0; index < 24; index += 1) {
    const tier = Math.floor(index / 8);
    const angle = index % 8 / 8 * TAU + (tier % 2) * Math.PI / 8;
    position.set(Math.cos(angle) * (0.61 - tier * 0.025), 0.88 + tier * 0.39, Math.sin(angle) * (0.61 - tier * 0.025));
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -angle);
    matrix.compose(position, quaternion, scale.set(0.82 + (index % 3) * 0.09, 0.8, 1));
    masonry.setMatrixAt(index, matrix);
  }
  masonry.castShadow = masonry.receiveShadow = true;
  group.add(masonry);

  const stairGeometry = new THREE.BoxGeometry(0.58, 0.1, 0.2);
  const stairs = new THREE.InstancedMesh(stairGeometry, materials.lightStone, 7);
  for (let index = 0; index < 7; index += 1) {
    position.set(0.56 + index * 0.12, 0.13 + index * 0.075, 0.38 + index * 0.07);
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -0.52);
    matrix.compose(position, quaternion, scale.set(1 - index * 0.04, 1, 1));
    stairs.setMatrixAt(index, matrix);
  }
  stairs.castShadow = stairs.receiveShadow = true;
  group.add(stairs);

  const bridge = add(new THREE.BoxGeometry(0.5, 0.13, 1.62), materials.lightStone, 0.78, 0.44, 0.82);
  bridge.rotation.set(0.1, -0.58, 0);
  const bridgeRailGeometry = new THREE.BoxGeometry(0.045, 0.17, 1.5);
  const bridgeRailA = add(bridgeRailGeometry, materials.copperDark, 0.58, 0.57, 0.69);
  bridgeRailA.rotation.set(0.1, -0.58, 0);
  const bridgeRailB = add(bridgeRailGeometry, materials.copperDark, 0.98, 0.57, 0.94);
  bridgeRailB.rotation.set(0.1, -0.58, 0);

  const archA = add(new THREE.TorusGeometry(1.28, 0.065, 8, 72, Math.PI), materials.copper, 0, 1.42, 0);
  archA.rotation.z = 0;
  const archB = add(new THREE.TorusGeometry(1.17, 0.052, 8, 72, Math.PI), materials.verdigrisMetal, 0, 1.42, 0);
  archB.rotation.y = Math.PI / 2;

  const lanternColumns = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.045, 0.5, 6), materials.copper, 8);
  for (let index = 0; index < 8; index += 1) {
    const angle = index / 8 * TAU;
    position.set(Math.cos(angle) * 0.42, 2.84, Math.sin(angle) * 0.42);
    quaternion.identity();
    matrix.compose(position, quaternion, scale.set(1, 1, 1));
    lanternColumns.setMatrixAt(index, matrix);
  }
  lanternColumns.castShadow = true;
  group.add(lanternColumns);
  add(new THREE.TorusGeometry(0.44, 0.035, 7, 56), materials.copper, 0, 3.08, 0).rotation.x = Math.PI / 2;

  const ringGroup = new THREE.Group();
  ringGroup.position.y = 2.86;
  group.add(ringGroup);
  const ringA = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.03, 8, 64), materials.rune), false, false);
  const ringB = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.022, 8, 64), materials.rune), false, false);
  const ringC = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.022, 8, 64), materials.rune), false, false);
  ringA.rotation.set(0.2, 0.2, 0.15);
  ringB.rotation.set(Math.PI / 2, 0.1, 0.55);
  ringC.rotation.set(0.8, Math.PI / 2, 0.1);
  ringGroup.add(ringA, ringB, ringC);

  const core = add(new THREE.OctahedronGeometry(0.19, 1), materials.core, 0, 2.86, 0);
  const glowGeometry = new THREE.BufferGeometry();
  glowGeometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 2.86, 0], 3));
  const glowMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uPulse: { value: 0 } },
    vertexShader: `uniform float uPulse;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=(22.0+uPulse*70.0)*(85.0/-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uPulse;void main(){float d=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.02,d)*(0.12+uPulse*0.38);gl_FragColor=vec4(0.34,0.92,0.82,a);}`,
  });
  const coreGlow = new THREE.Points(glowGeometry, glowMaterial);
  coreGlow.frustumCulled = false;
  group.add(coreGlow);
  const beam = add(new THREE.CylinderGeometry(0.028, 0.12, 5.2, 10, 1, true), materials.beam, 0, 5.43, 0);
  beam.scale.y = 0.001;
  beam.visible = false;

  const prongs = new THREE.InstancedMesh(new THREE.ConeGeometry(0.075, 0.82, 6), materials.copperDark, 4);
  for (let index = 0; index < 4; index += 1) {
    const angle = index / 4 * TAU + Math.PI / 4;
    position.set(Math.cos(angle) * 0.35, 2.87, Math.sin(angle) * 0.35);
    quaternion.setFromEuler(new THREE.Euler(Math.sin(angle) * 0.24, -angle, Math.cos(angle) * 0.24));
    matrix.compose(position, quaternion, scale.set(1, 1, 1));
    prongs.setMatrixAt(index, matrix);
  }
  prongs.castShadow = true;
  group.add(prongs);

  const windows = new THREE.InstancedMesh(new THREE.BoxGeometry(0.095, 0.26, 0.035), materials.windows, 16);
  for (let index = 0; index < 16; index += 1) {
    const angle = index / 16 * TAU;
    const tier = index % 2;
    position.set(Math.cos(angle) * (tier ? 0.38 : 0.565), tier ? 2.36 : 1.32, Math.sin(angle) * (tier ? 0.38 : 0.565));
    quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -angle);
    matrix.compose(position, quaternion, scale.set(1, 1, 1));
    windows.setMatrixAt(index, matrix);
  }
  group.add(windows);

  return { group, ringGroup, ringA, ringB, ringC, core, coreGlow, beam };
}

function createSky() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(46, 48, 28),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uStorm: { value: 0 },
      },
      vertexShader: `
        varying vec3 vDirection;
        void main() {
          vDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStorm;
        varying vec3 vDirection;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec3 d = normalize(vDirection);
          float horizon = pow(1.0 - abs(d.y), 3.5);
          float lower = smoothstep(-0.25, 0.18, d.y);
          vec3 night = vec3(0.012, 0.035, 0.05);
          vec3 high = vec3(0.018, 0.072, 0.09);
          vec3 color = mix(night, high, lower);
          color += vec3(0.055, 0.14, 0.14) * horizon;
          vec3 sunDir = normalize(vec3(-0.72, 0.3, -0.58));
          float sun = pow(max(dot(d, sunDir), 0.0), 80.0);
          float sunHalo = pow(max(dot(d, sunDir), 0.0), 8.0);
          color += vec3(0.95, 0.47, 0.2) * sun * 1.8 + vec3(0.2, 0.12, 0.08) * sunHalo;
          float band = sin(d.x * 12.0 + d.z * 9.0 + sin(d.z * 5.0) * 2.0 + uTime * 0.025);
          float cloud = smoothstep(0.48, 0.82, band) * smoothstep(-0.02, 0.16, d.y) * smoothstep(0.34, 0.12, d.y);
          color = mix(color, vec3(0.12, 0.2, 0.21), cloud * 0.18);
          color += vec3(0.18, 0.48, 0.49) * uStorm * horizon * 0.3;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
  );
}

function createStars() {
  const random = seeded(401);
  const count = 850;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = random() * TAU;
    const y = mix(4, 30, Math.pow(random(), 0.7));
    const radius = Math.sqrt(36 * 36 - Math.min(y * y, 35 * 35));
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    color: 0xb9d8d2,
    size: 0.045,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    fog: false,
  }));
}

function createAbyss() {
  const group = new THREE.Group();
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x52d4ca,
    transparent: true,
    opacity: 0.09,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const rings = new THREE.InstancedMesh(new THREE.TorusGeometry(1, 0.025, 6, 80), ringMaterial, 6);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  for (let index = 0; index < 6; index += 1) {
    const radius = 1.0 + index * 0.62;
    position.set(0, -5.05 - index * 0.16, 0);
    scale.set(radius, radius * 0.72, radius);
    matrix.compose(position, quaternion, scale);
    rings.setMatrixAt(index, matrix);
  }
  group.add(rings);
  const glowMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uPulse: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform float uPulse;varying vec2 vUv;void main(){float radial=1.0-length(vUv-0.5)*2.0;float a=smoothstep(0.0,0.7,radial)*(0.16+uPulse*0.34);gl_FragColor=vec4(0.18,0.78,0.72,a);}`,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 8.5), glowMaterial);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -5.14;
  group.add(glow);
  return { group, rings, ringMaterial, glowMaterial };
}

function detectAutoQuality() {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const mobile = matchMedia("(pointer: coarse)").matches || Math.min(innerWidth, innerHeight) < 520;
  if (mobile || memory <= 3 || cores <= 4) return "balanced";
  return "high";
}

function boot() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch (error) {
    fallback.hidden = false;
    return;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x061116);
  scene.fog = new THREE.FogExp2(0x08171a, 0.018);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 75);
  const cameraTarget = new THREE.Vector3();
  const world = new THREE.Group();
  scene.add(world);

  const sky = createSky();
  scene.add(sky, createStars());

  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.015,
  });
  const undersideMaterial = new THREE.MeshStandardMaterial({
    color: 0x52645f,
    vertexColors: true,
    roughness: 0.98,
    metalness: 0.02,
    flatShading: true,
  });
  const waterMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      attribute float aEdge;
      varying float vEdge;
      varying vec3 vWorld;
      varying float vWave;
      void main() {
        vec3 p = position;
        float wave = sin(p.x * 2.2 + uTime * 0.42) * 0.012 + cos(p.z * 2.8 - uTime * 0.36) * 0.01;
        p.y += wave;
        vEdge = aEdge;
        vWave = wave;
        vWorld = (modelMatrix * vec4(p, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uPulse;
      varying float vEdge;
      varying vec3 vWorld;
      varying float vWave;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float fresnel = pow(1.0 - abs(dot(viewDir, vec3(0.0, 1.0, 0.0))), 3.0);
        float crossing = sin(vWorld.x * 5.1 + uTime * 0.8) * sin(vWorld.z * 4.7 - uTime * 0.61);
        float glint = smoothstep(0.82, 0.98, crossing) * 0.18;
        float rim = smoothstep(0.91, 1.0, vEdge);
        vec3 deep = vec3(0.012, 0.11, 0.13);
        vec3 surface = vec3(0.035, 0.27, 0.27);
        vec3 color = mix(deep, surface, 0.32 + fresnel * 0.56 + glint);
        color += vec3(0.16, 0.56, 0.52) * rim * (0.14 + uPulse * 0.16);
        float alpha = 0.58 + fresnel * 0.18 + rim * 0.12;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
  const epicOceanMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      attribute float aEdge;
      varying float vEdge;
      varying vec3 vWorld;
      varying float vWave;
      void main() {
        vec3 p = position;
        float wave = sin(p.x * 1.45 + uTime * 0.34) * 0.014 + cos(p.z * 1.72 - uTime * 0.29) * 0.012;
        p.y += wave;
        vEdge = aEdge;
        vWave = wave;
        vWorld = (modelMatrix * vec4(p, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uPulse;
      varying float vEdge;
      varying vec3 vWorld;
      varying float vWave;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0)),f.x),f.y);
      }
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float fresnel = pow(1.0 - abs(dot(viewDir, vec3(0.0, 1.0, 0.0))), 2.35);
        float longWave = noise(vWorld.xz * 0.52 + vec2(uTime * 0.035, -uTime * 0.028));
        float glint = smoothstep(0.76, 0.96, noise(vWorld.xz * 2.1 + vec2(uTime * 0.12, 0.0))) * 0.13;
        float rim = smoothstep(0.89, 1.0, vEdge);
        vec3 deep = vec3(0.012, 0.135, 0.205);
        vec3 surface = vec3(0.025, 0.36, 0.43);
        vec3 color = mix(deep, surface, 0.32 + fresnel * 0.46 + longWave * 0.12 + glint);
        color += vec3(0.12, 0.62, 0.58) * rim * (0.22 + uPulse * 0.15);
        color += vec3(0.16, 0.42, 0.38) * max(vWave, 0.0) * 1.8;
        float alpha = 0.82 + fresnel * 0.1 + rim * 0.06;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const terrain = shadow(new THREE.Mesh(createTerrainGeometry(), terrainMaterial));
  terrain.name = "Continuous authored terrain";
  const underside = shadow(new THREE.Mesh(createUndersideGeometry(), undersideMaterial));
  const water = new THREE.Mesh(createWaterGeometry(), waterMaterial);
  water.renderOrder = 2;
  world.add(underside, terrain, water);

  const waterfallMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPulse: { value: 0 } },
    vertexShader: `
      uniform float uTime;
      attribute float aSeed;
      varying vec2 vUv;
      varying float vSeed;
      void main(){
        vUv=uv;vSeed=aSeed;
        vec3 p=position;
        p.x += sin(uv.y*13.0-uTime*1.7+aSeed)*0.012*sin(uv.y*3.14159);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uPulse;
      varying vec2 vUv;
      varying float vSeed;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0)),f.x),f.y);
      }
      void main(){
        float edge=smoothstep(0.0,0.18,vUv.x)*smoothstep(1.0,0.82,vUv.x);
        float channels=noise(vec2(vUv.x*18.0+vSeed*5.0,uTime*0.08));
        float flow=noise(vec2(vUv.x*12.0+vSeed*3.0,vUv.y*34.0-uTime*4.2));
        float fine=noise(vec2(vUv.x*31.0+vSeed,vUv.y*60.0-uTime*6.1));
        float bright=smoothstep(0.48,0.9,channels)*0.42+flow*0.32+fine*0.12;
        float sheet=0.32+bright;
        float fade=smoothstep(1.0,0.82,vUv.y)*smoothstep(0.0,0.025,vUv.y);
        vec3 color=mix(vec3(0.055,0.34,0.42),vec3(0.64,0.94,0.88),clamp(bright,0.0,1.0));
        gl_FragColor=vec4(color,edge*sheet*fade*(0.62+uPulse*0.12));
      }
    `,
  });
  const waterfalls = new THREE.Mesh(createWaterfallGeometry(), waterfallMaterial);
  waterfalls.renderOrder = 3;
  const waterMist = createWaterMist();
  waterMist.renderOrder = 4;
  world.add(waterfalls, waterMist);

  const materials = {
    stone: new THREE.MeshStandardMaterial({ color: 0x55564e, roughness: 0.88, metalness: 0.02, flatShading: true }),
    lightStone: new THREE.MeshStandardMaterial({ color: 0x858276, roughness: 0.83, metalness: 0.025, flatShading: true }),
    darkStone: new THREE.MeshStandardMaterial({ color: 0x303431, roughness: 0.94, metalness: 0.01, flatShading: true }),
    copper: new THREE.MeshStandardMaterial({ color: 0xb47740, roughness: 0.38, metalness: 0.76 }),
    copperDark: new THREE.MeshStandardMaterial({ color: 0x513522, roughness: 0.46, metalness: 0.7 }),
    verdigrisMetal: new THREE.MeshStandardMaterial({ color: 0x3d8176, roughness: 0.52, metalness: 0.58 }),
    rune: new THREE.MeshStandardMaterial({ color: 0xc38448, emissive: 0x3e9a8d, emissiveIntensity: 1.1, roughness: 0.3, metalness: 0.75 }),
    core: new THREE.MeshStandardMaterial({ color: 0xb8f0df, emissive: 0x48d9c4, emissiveIntensity: 2.8, roughness: 0.18, metalness: 0.12 }),
    windows: new THREE.MeshBasicMaterial({ color: 0xffbd6b }),
    beam: new THREE.MeshBasicMaterial({ color: 0x80ead9, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  };
  const citadel = createCitadel(materials);
  world.add(citadel.group);

  const trees = createTrees();
  world.add(trees.trunks, trees.crowns);
  const waystones = createWaystones(materials);
  world.add(waystones);
  const motes = createAmbientMotes();
  world.add(motes);

  const abyss = createAbyss();
  world.add(abyss.group);

  const epicWorld = new THREE.Group();
  epicWorld.name = "Verdigris world atlas";
  scene.add(epicWorld);
  const epicUnderside = shadow(new THREE.Mesh(createEpicUndersideGeometry(), undersideMaterial));
  const epicTerrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0.01,
    emissive: 0x06100d,
    emissiveIntensity: 0.12,
  });
  const epicOcean = new THREE.Mesh(createEpicOceanGeometry(), epicOceanMaterial);
  epicOcean.renderOrder = 2;
  const epicContinents = new THREE.Group();
  EPIC_CONTINENTS.forEach((config) => {
    const continent = shadow(new THREE.Mesh(createContinentGeometry(config), epicTerrainMaterial));
    continent.name = config.name;
    epicContinents.add(continent);
  });
  const epicCliffs = shadow(new THREE.Mesh(createEpicCliffGeometry(), undersideMaterial));
  const epicCoastlines = createEpicCoastlines();
  epicCoastlines.renderOrder = 3;
  const epicWaterfalls = new THREE.Mesh(createEpicWaterfallGeometry(), waterfallMaterial);
  epicWaterfalls.renderOrder = 4;
  const epicTrees = createEpicTrees();
  const epicLandmarks = createEpicLandmarks(materials);
  const epicCapitals = createEpicCapitals(materials);
  const epicAbyss = createAbyss();
  epicAbyss.group.scale.set(1.58, 1, 1.38);
  const epicRimMaterial = new THREE.MeshBasicMaterial({ color: 0x49c8bd, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false });
  const epicRim = new THREE.Mesh(new THREE.TorusGeometry(WORLD_RX, 0.045, 7, 192), epicRimMaterial);
  epicRim.rotation.x = Math.PI / 2;
  epicRim.scale.y = WORLD_RZ / WORLD_RX;
  epicRim.position.y = WORLD_WATER_LEVEL - 0.018;
  epicWorld.add(
    epicUnderside,
    epicOcean,
    epicCliffs,
    epicContinents,
    epicCoastlines,
    epicWaterfalls,
    epicTrees.trunks,
    epicTrees.crowns,
    epicLandmarks,
    epicCapitals,
    epicAbyss.group,
    epicRim,
  );

  const clouds = createCloudLayer();
  scene.add(clouds.group);
  const flock = createFlock();
  const lightning = createLightning();
  scene.add(flock, lightning);

  const hemisphere = new THREE.HemisphereLight(0x82b6b3, 0x1b1310, 1.72);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(0xffc58a, 3.55);
  sun.position.set(2, 12, 8);
  sun.castShadow = true;
  sun.shadow.camera.left = -11;
  sun.shadow.camera.right = 11;
  sun.shadow.camera.top = 11;
  sun.shadow.camera.bottom = -11;
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 30;
  sun.shadow.bias = -0.00035;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x4a9fa4, 1.35);
  fill.position.set(-7, 5, -7);
  scene.add(fill);
  const abyssLight = new THREE.PointLight(0x49d6c8, 11, 13, 2);
  abyssLight.position.set(0, -4.4, 1.5);
  world.add(abyssLight);
  const crownLight = new THREE.PointLight(0x6fe0cc, 3.8, 6, 2);
  crownLight.position.copy(citadel.group.position).add(new THREE.Vector3(0, 2.5, 0));
  world.add(crownLight);
  const epicAbyssLight = new THREE.PointLight(0x3bcfc5, 12, 19, 1.8);
  epicAbyssLight.position.set(0, -4.25, 0.8);
  epicWorld.add(epicAbyssLight);
  const stormLight = new THREE.PointLight(0x74ded4, 0, 28, 1.4);
  stormLight.position.set(8, 6, -7);
  scene.add(stormLight);

  const profiles = {
    high: { dpr: 1.65, shadows: true, shadowSize: 2048, trees: 360, epicTrees: 860, motes: 320, clouds: 10 },
    balanced: { dpr: 1.2, shadows: true, shadowSize: 1024, trees: 230, epicTrees: 620, motes: 200, clouds: 7 },
    low: { dpr: 1, shadows: false, shadowSize: 512, trees: 120, epicTrees: 340, motes: 90, clouds: 4 },
  };
  let requestedQuality = "auto";
  let autoQuality = detectAutoQuality();
  let activeQuality = autoQuality;
  let adaptiveCooldown = 0;
  let activeVariant = new URLSearchParams(location.search).get("view") === "crownlands" ? "crownlands" : "epic";

  const baseCamera = { x: 10.5, y: 10.35, z: 14.2, tx: 3.0, ty: 0.35, tz: -0.18, fov: 39 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const previewMoment = new URLSearchParams(location.search).get("moment") === "crown";
  const cameraControl = {
    dragging: false,
    pointers: new Map(),
    lastX: 0,
    lastY: 0,
    pinchDistance: 0,
    yaw: 0,
    pitch: 0,
    zoom: 0,
    yawTarget: 0,
    pitchTarget: 0,
    zoomTarget: 0,
    lastInput: 0,
  };

  function resetCameraControl(immediate = false) {
    cameraControl.yawTarget = 0;
    cameraControl.pitchTarget = 0;
    cameraControl.zoomTarget = 0;
    cameraControl.lastInput = 0;
    if (immediate) {
      cameraControl.yaw = 0;
      cameraControl.pitch = 0;
      cameraControl.zoom = 0;
    }
  }

  function markCameraInput() {
    cameraControl.lastInput = performance.now();
  }

  function pinchDistance() {
    const points = [...cameraControl.pointers.values()];
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }

  function applyQuality(nextQuality) {
    activeQuality = nextQuality;
    const profile = profiles[activeQuality];
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, profile.dpr));
    renderer.shadowMap.enabled = profile.shadows;
    sun.castShadow = profile.shadows;
    sun.shadow.mapSize.set(profile.shadowSize, profile.shadowSize);
    trees.trunks.count = trees.crowns.count = Math.min(profile.trees, trees.maxCount);
    epicTrees.trunks.count = epicTrees.crowns.count = Math.min(profile.epicTrees, epicTrees.maxCount);
    motes.geometry.setDrawRange(0, profile.motes);
    for (let index = 0; index < clouds.sprites.length; index += 1) {
      clouds.sprites[index].visible = index < profile.clouds;
    }
    qualityState.textContent = requestedQuality === "auto" ? `AUTO · ${activeQuality.toUpperCase()}` : activeQuality.toUpperCase();
    resize();
  }

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const aspect = width / height;
    renderer.setSize(width, height, false);
    camera.aspect = aspect;

    if (activeVariant === "epic") {
      if (aspect < 0.82) {
        baseCamera.x = 11.5;
        baseCamera.y = 13.1;
        baseCamera.z = 20.2;
        baseCamera.tx = 0.25;
        baseCamera.ty = 1.05;
        baseCamera.tz = 0;
        baseCamera.fov = 48;
        epicWorld.position.set(0, 1.65, 0);
        epicWorld.scale.setScalar(0.88);
      } else if (aspect > 2) {
        baseCamera.x = 15.1;
        baseCamera.y = 12.7;
        baseCamera.z = 18.7;
        baseCamera.tx = 4.7;
        baseCamera.ty = 0.08;
        baseCamera.tz = -0.1;
        baseCamera.fov = 34;
        epicWorld.position.set(4.55, -0.2, 0);
        epicWorld.scale.setScalar(1.06);
      } else {
        baseCamera.x = 13.4;
        baseCamera.y = 12.4;
        baseCamera.z = 18.8;
        baseCamera.tx = 3.15;
        baseCamera.ty = 0.2;
        baseCamera.tz = -0.12;
        baseCamera.fov = 38;
        epicWorld.position.set(3.05, -0.12, 0);
        epicWorld.scale.setScalar(1);
      }
    } else {
      if (aspect < 0.82) {
        baseCamera.x = 9.5;
        baseCamera.y = 8.8;
        baseCamera.z = 14.8;
        baseCamera.tx = 0.45;
        baseCamera.ty = 0.92;
        baseCamera.tz = 0;
        baseCamera.fov = 46;
        world.position.set(0, 1.5, 0);
        world.scale.setScalar(0.84);
      } else if (aspect > 2) {
        baseCamera.x = 11.8;
        baseCamera.y = 9.7;
        baseCamera.z = 14.5;
        baseCamera.tx = 3.5;
        baseCamera.ty = 0.18;
        baseCamera.tz = -0.25;
        baseCamera.fov = 36;
        world.position.set(3.5, -0.18, 0);
        world.scale.setScalar(1.02);
      } else {
        baseCamera.x = 10.8;
        baseCamera.y = 10.35;
        baseCamera.z = 14.2;
        baseCamera.tx = 3.0;
        baseCamera.ty = 0.3;
        baseCamera.tz = -0.25;
        baseCamera.fov = 39;
        world.position.set(2.9, -0.18, 0);
        world.scale.setScalar(1);
      }
    }
    camera.fov = baseCamera.fov;
    camera.updateProjectionMatrix();
  }

  function setVariant(nextVariant, announce = true) {
    activeVariant = nextVariant === "crownlands" ? "crownlands" : "epic";
    const epicActive = activeVariant === "epic";
    epicWorld.visible = epicActive;
    world.visible = !epicActive;
    document.documentElement.dataset.view = activeVariant;
    variantButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.view === activeVariant));
    });
    taglineEl.textContent = epicActive
      ? "Continents adrift. Oceans without a shore below."
      : "Above an endless fall, the old craft stirs.";
    worldStateText.textContent = epicActive
      ? "THE WORLD TURNS ABOVE THE ABYSS"
      : "THE CROWN IS WAKING";
    canvas.setAttribute("aria-label", epicActive
      ? "The whole floating world of Verdigris. Drag to orbit; scroll or pinch to zoom"
      : "The Crownlands island and the ancient Crown of Tides citadel. Drag to orbit; scroll or pinch to zoom");
    if (announce) {
      menuStatus.textContent = epicActive ? "World view: the whole of Verdigris." : "Crownlands view: the observatory province.";
      menuStatus.classList.add("is-visible");
    }
    resetCameraControl(true);
    resize();
  }

  variantButtons.forEach((button) => {
    button.addEventListener("click", () => setVariant(button.dataset.view));
  });

  qualitySelect.addEventListener("change", () => {
    requestedQuality = qualitySelect.value;
    autoQuality = detectAutoQuality();
    applyQuality(requestedQuality === "auto" ? autoQuality : requestedQuality);
    adaptiveCooldown = performance.now() + 12000;
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    cameraControl.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    cameraControl.dragging = true;
    cameraControl.lastX = event.clientX;
    cameraControl.lastY = event.clientY;
    cameraControl.pinchDistance = pinchDistance();
    canvas.classList.add("is-dragging");
    markCameraInput();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (cameraControl.pointers.has(event.pointerId)) {
      cameraControl.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (cameraControl.pointers.size > 1) {
        const distance = pinchDistance();
        if (cameraControl.pinchDistance > 0) {
          const pinchScale = Math.max(260, Math.min(innerWidth, innerHeight));
          cameraControl.zoomTarget = clamp(
            cameraControl.zoomTarget - (distance - cameraControl.pinchDistance) / pinchScale * 0.88,
            -0.22,
            0.35,
          );
        }
        cameraControl.pinchDistance = distance;
      } else {
        const dx = event.clientX - cameraControl.lastX;
        const dy = event.clientY - cameraControl.lastY;
        cameraControl.yawTarget = clamp(cameraControl.yawTarget - dx * 0.00215, -0.25, 0.25);
        cameraControl.pitchTarget = clamp(cameraControl.pitchTarget - dy * 0.00185, -0.16, 0.14);
        cameraControl.lastX = event.clientX;
        cameraControl.lastY = event.clientY;
      }
      markCameraInput();
      return;
    }
    if (reducedMotion) return;
    pointer.tx = clamp(event.clientX / innerWidth * 2 - 1, -1, 1);
    pointer.ty = clamp(event.clientY / innerHeight * 2 - 1, -1, 1);
  }, { passive: true });

  function endCameraPointer(event) {
    cameraControl.pointers.delete(event.pointerId);
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (cameraControl.pointers.size === 0) {
      cameraControl.dragging = false;
      cameraControl.pinchDistance = 0;
      canvas.classList.remove("is-dragging");
    } else {
      const remaining = cameraControl.pointers.values().next().value;
      cameraControl.lastX = remaining.x;
      cameraControl.lastY = remaining.y;
      cameraControl.pinchDistance = 0;
    }
    markCameraInput();
  }

  canvas.addEventListener("pointerup", endCameraPointer);
  canvas.addEventListener("pointercancel", endCameraPointer);

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    cameraControl.zoomTarget = clamp(cameraControl.zoomTarget + event.deltaY * unit * 0.00065, -0.22, 0.35);
    markCameraInput();
  }, { passive: false });

  canvas.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const handled = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "Home"].includes(event.key);
    if (!handled) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") cameraControl.yawTarget = clamp(cameraControl.yawTarget + 0.045, -0.25, 0.25);
    if (event.key === "ArrowRight") cameraControl.yawTarget = clamp(cameraControl.yawTarget - 0.045, -0.25, 0.25);
    if (event.key === "ArrowUp") cameraControl.pitchTarget = clamp(cameraControl.pitchTarget + 0.035, -0.16, 0.14);
    if (event.key === "ArrowDown") cameraControl.pitchTarget = clamp(cameraControl.pitchTarget - 0.035, -0.16, 0.14);
    if (event.key === "+" || event.key === "=") cameraControl.zoomTarget = clamp(cameraControl.zoomTarget - 0.07, -0.22, 0.35);
    if (event.key === "-" || event.key === "_") cameraControl.zoomTarget = clamp(cameraControl.zoomTarget + 0.07, -0.22, 0.35);
    if (event.key === "Home") resetCameraControl();
    else markCameraInput();
  });

  canvas.addEventListener("pointerleave", () => {
    if (!cameraControl.dragging) {
      pointer.tx = 0;
      pointer.ty = 0;
    }
  }, { passive: true });

  document.querySelectorAll("[data-menu-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const messages = {
        continue: "The gate opens beyond this visual prototype.",
        hero: "The wanderer forge belongs to the next chapter.",
        chronicle: "The chronicle is still being translated from the old copper plates.",
      };
      menuStatus.textContent = messages[button.dataset.menuAction];
      menuStatus.classList.add("is-visible");
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        button.click();
      }
    });
  });

  let startTime = performance.now();
  let previousTime = startTime;
  let sampleStart = startTime;
  let frames = 0;
  let raf = 0;
  let paused = false;
  let averageFps = 60;

  const debug = {
    version: "verdigris-menu-2.1",
    quality: activeQuality,
    fps: 0,
    frameMs: 0,
    drawCalls: 0,
    triangles: 0,
    loopSeconds: LOOP_SECONDS,
    transferableBytes: 0,
  };
  window.__VERDIGRIS_DEBUG__ = debug;

  function pulseAt(phase, center, width) {
    let distance = Math.abs(phase - center);
    distance = Math.min(distance, 1 - distance);
    return Math.exp(-(distance * distance) / (width * width));
  }

  function animate(now) {
    if (paused) return;
    const delta = Math.min(0.05, (now - previousTime) / 1000);
    previousTime = now;
    const elapsed = (now - startTime) / 1000;
    const phase = reducedMotion ? 0.18 : previewMoment ? 0.665 : (elapsed % LOOP_SECONDS) / LOOP_SECONDS;
    const time = reducedMotion ? 6.5 : previewMoment ? 23.94 : elapsed;
    const crownPulse = reducedMotion ? 0.18 : pulseAt(phase, 0.68, 0.045);
    const lightningPulse = reducedMotion ? 0 : clamp(
      pulseAt(phase, 0.655, 0.006) * 0.8 + pulseAt(phase, 0.672, 0.004),
    );

    pointer.x += (pointer.tx - pointer.x) * Math.min(1, delta * 2.8);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, delta * 2.8);
    const pointerReturn = Math.pow(0.045, delta);
    pointer.tx *= pointerReturn;
    pointer.ty *= pointerReturn;

    if (!cameraControl.dragging && now - cameraControl.lastInput > 5200) {
      const returnSpring = Math.exp(-delta * 0.72);
      cameraControl.yawTarget *= returnSpring;
      cameraControl.pitchTarget *= returnSpring;
      cameraControl.zoomTarget *= returnSpring;
    }
    const cameraSpring = 1 - Math.exp(-delta * (cameraControl.dragging ? 12 : 6.5));
    cameraControl.yaw += (cameraControl.yawTarget - cameraControl.yaw) * cameraSpring;
    cameraControl.pitch += (cameraControl.pitchTarget - cameraControl.pitch) * cameraSpring;
    cameraControl.zoom += (cameraControl.zoomTarget - cameraControl.zoom) * cameraSpring;

    const loopAngle = phase * TAU;
    const loopYaw = reducedMotion ? 0 : Math.sin(loopAngle) * 0.044 + Math.sin(loopAngle * 2 - 0.45) * 0.008;
    const loopPitch = reducedMotion ? 0 : Math.sin(loopAngle - 0.82) * 0.021;
    const loopPan = reducedMotion ? 0 : Math.sin(loopAngle + 0.4) * 0.13;
    const loopLift = reducedMotion ? 0 : Math.sin(loopAngle * 2 - 0.62) * 0.055;
    cameraTarget.set(
      baseCamera.tx + loopPan + pointer.x * 0.065,
      baseCamera.ty + loopLift - pointer.y * 0.04,
      baseCamera.tz + Math.cos(loopAngle - 0.3) * (reducedMotion ? 0 : 0.045),
    );
    const baseDx = baseCamera.x - baseCamera.tx;
    const baseDy = baseCamera.y - baseCamera.ty;
    const baseDz = baseCamera.z - baseCamera.tz;
    const baseDistance = Math.sqrt(baseDx * baseDx + baseDy * baseDy + baseDz * baseDz);
    const baseYaw = Math.atan2(baseDx, baseDz);
    const basePitch = Math.asin(baseDy / baseDistance);
    const cameraYaw = baseYaw + loopYaw + cameraControl.yaw + pointer.x * 0.007;
    const cameraPitch = clamp(basePitch + loopPitch + cameraControl.pitch - pointer.y * 0.004, 0.24, 1.18);
    const cameraDistance = baseDistance * clamp(1 + cameraControl.zoom, 0.78, 1.35);
    const cameraHorizontal = Math.cos(cameraPitch) * cameraDistance;
    camera.position.set(
      cameraTarget.x + Math.sin(cameraYaw) * cameraHorizontal,
      cameraTarget.y + Math.sin(cameraPitch) * cameraDistance,
      cameraTarget.z + Math.cos(cameraYaw) * cameraHorizontal,
    );
    camera.lookAt(cameraTarget);

    world.rotation.y = -0.24 + (reducedMotion ? 0 : Math.sin(phase * TAU - 0.4) * 0.026);
    epicWorld.rotation.y = -0.105 + (reducedMotion ? 0 : Math.sin(phase * TAU - 0.25) * 0.018);
    waterMaterial.uniforms.uTime.value = time;
    waterMaterial.uniforms.uPulse.value = crownPulse;
    epicOceanMaterial.uniforms.uTime.value = time;
    epicOceanMaterial.uniforms.uPulse.value = crownPulse;
    waterfallMaterial.uniforms.uTime.value = time;
    waterfallMaterial.uniforms.uPulse.value = crownPulse;
    waterMist.material.uniforms.uTime.value = time;
    sky.material.uniforms.uTime.value = time;
    sky.material.uniforms.uStorm.value = Math.max(crownPulse, lightningPulse);
    motes.material.uniforms.uTime.value = time;

    for (let index = 0; index < clouds.sprites.length; index += 1) {
      const sprite = clouds.sprites[index];
      const drift = (time * sprite.userData.speed) % 30;
      sprite.position.x = sprite.userData.baseX + drift;
      if (sprite.position.x > 17) sprite.position.x -= 30;
    }

    const flockVisible = !reducedMotion && phase > 0.34 && phase < 0.59;
    const flockProgress = clamp((phase - 0.34) / 0.25);
    flock.material.opacity = flockVisible ? Math.sin(flockProgress * Math.PI) * 0.42 : 0;
    flock.position.set(mix(-11, 8.5, flockProgress), 5.8 + Math.sin(flockProgress * Math.PI) * 0.7, -5.5);
    flock.rotation.z = -0.06 + flockProgress * 0.12;
    lightning.material.opacity = lightningPulse * 0.72;
    stormLight.intensity = lightningPulse * 11;

    citadel.ringGroup.rotation.y = time * 0.085;
    citadel.ringA.rotation.z = 0.15 + Math.sin(time * 0.17) * 0.16;
    citadel.ringB.rotation.z = 0.55 - time * 0.045;
    citadel.ringC.rotation.x = 0.8 + time * 0.035;
    materials.rune.emissiveIntensity = 1.0 + crownPulse * 3.2;
    materials.core.emissiveIntensity = 2.4 + crownPulse * 6.4;
    citadel.coreGlow.material.uniforms.uPulse.value = crownPulse;
    citadel.core.scale.setScalar(1 + crownPulse * 0.42);
    citadel.beam.visible = crownPulse > 0.08 && !reducedMotion;
    citadel.beam.scale.y = Math.max(0.001, crownPulse);
    materials.beam.opacity = crownPulse * 0.22;

    abyss.group.rotation.y = time * 0.035;
    abyss.ringMaterial.opacity = 0.07 + crownPulse * 0.14;
    abyss.glowMaterial.uniforms.uPulse.value = crownPulse;
    abyssLight.intensity = 9 + crownPulse * 12;
    crownLight.intensity = 3.3 + crownPulse * 7;
    epicAbyss.group.rotation.y = time * 0.022;
    epicAbyss.ringMaterial.opacity = 0.055 + crownPulse * 0.1;
    epicAbyss.glowMaterial.uniforms.uPulse.value = crownPulse * 0.75;
    epicAbyssLight.intensity = 10 + crownPulse * 10;
    epicRimMaterial.opacity = 0.12 + crownPulse * 0.09;
    sun.intensity = 4.1 + crownPulse * 0.5;

    renderer.render(scene, camera);
    frames += 1;

    if (now - sampleStart >= 1000) {
      const duration = now - sampleStart;
      averageFps = frames * 1000 / duration;
      fpsEl.textContent = String(Math.round(averageFps));
      debug.quality = activeQuality;
      debug.variant = activeVariant;
      debug.requestedQuality = requestedQuality;
      debug.fps = Math.round(averageFps * 10) / 10;
      debug.frameMs = Math.round(10000 / Math.max(1, averageFps)) / 10;
      debug.drawCalls = renderer.info.render.calls;
      debug.triangles = renderer.info.render.triangles;
      debug.points = renderer.info.render.points;
      debug.textureCount = renderer.info.memory.textures;
      debug.geometryCount = renderer.info.memory.geometries;
      debug.viewport = { width: canvas.clientWidth, height: canvas.clientHeight, dpr: renderer.getPixelRatio() };
      debug.loopPhase = Math.round(phase * 1000) / 1000;
      debug.cameraYaw = Math.round(cameraControl.yaw * 1000) / 1000;
      debug.cameraPitch = Math.round(cameraControl.pitch * 1000) / 1000;
      debug.cameraZoom = Math.round(cameraControl.zoom * 1000) / 1000;
      canvas.dataset.fps = String(debug.fps);
      canvas.dataset.frameMs = String(debug.frameMs);
      canvas.dataset.drawCalls = String(debug.drawCalls);
      canvas.dataset.triangles = String(debug.triangles);
      canvas.dataset.quality = activeQuality;
      canvas.dataset.variant = activeVariant;
      canvas.dataset.cameraYaw = String(debug.cameraYaw);
      canvas.dataset.cameraPitch = String(debug.cameraPitch);
      canvas.dataset.cameraZoom = String(debug.cameraZoom);
      canvas.dataset.cameraDragging = String(cameraControl.dragging);
      frames = 0;
      sampleStart = now;

      if (requestedQuality === "auto" && now > adaptiveCooldown) {
        if (activeQuality === "high" && averageFps < 48) {
          applyQuality("balanced");
          adaptiveCooldown = now + 15000;
        } else if (activeQuality === "balanced" && averageFps < 29) {
          applyQuality("low");
          adaptiveCooldown = now + 15000;
        }
      }
    }
    raf = requestAnimationFrame(animate);
  }

  function handleVisibility() {
    paused = document.hidden;
    if (paused) {
      cancelAnimationFrame(raf);
    } else {
      previousTime = performance.now();
      sampleStart = previousTime;
      frames = 0;
      raf = requestAnimationFrame(animate);
    }
  }

  function dispose() {
    cancelAnimationFrame(raf);
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      const objectMaterials = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
      objectMaterials.forEach((material) => material.dispose());
    });
    renderer.renderLists.dispose();
    clouds.texture.dispose();
    renderer.dispose();
  }

  addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  addEventListener("pagehide", dispose, { once: true });
  qualitySelect.value = "auto";
  setVariant(activeVariant, false);
  applyQuality(autoQuality);
  fallback.hidden = true;
  raf = requestAnimationFrame(animate);
}

boot();
