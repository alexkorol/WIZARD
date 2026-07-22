import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

const TAU = Math.PI * 2;
const LOOP_SECONDS = 36;
const WATER_LEVEL = 0.285;
const ISLAND_RX = 5.9;
const ISLAND_RZ = 4.2;
const WORLD_RX = 7.4;
const WORLD_RZ = 7.4;
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

const EPIC_WATERFALLS = [
  { angle: 0.14, width: 0.46, length: 4.05, seed: 0.4 },
  { angle: 0.88, width: 0.31, length: 3.45, seed: 1.3 },
  { angle: 1.76, width: 0.42, length: 3.9, seed: 2.1 },
  { angle: 2.62, width: 0.27, length: 3.15, seed: 3.7 },
  { angle: 3.46, width: 0.36, length: 3.75, seed: 4.4 },
  { angle: 4.55, width: 0.25, length: 3.3, seed: 5.6 },
  { angle: 5.55, width: 0.4, length: 4.0, seed: 6.2 },
];

const EPIC_UNDERSIDE_PROFILES = [1, 0.985, 0.955, 0.92, 0.86, 0.78, 0.69, 0.6, 0.51, 0.42, 0.34, 0.27, 0.2, 0.14, 0.09, 0.05];
const EPIC_UNDERSIDE_DEPTHS = [0.04, -0.32, -0.46, -0.56, -0.65, -0.74, -0.83, -0.93, -1.05, -1.2, -1.42, -1.72, -2.12, -2.65, -3.28, -3.92];

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
  const ridgeDx = bx - ax;
  const ridgeDz = bz - az;
  const ridgeLength = Math.max(0.001, Math.hypot(ridgeDx, ridgeDz));
  const branchSign = config.seed % 2 === 0 ? 1 : -1;
  const branchStartX = mix(ax, bx, 0.48);
  const branchStartZ = mix(az, bz, 0.48);
  const branchEndX = branchStartX - ridgeDz / ridgeLength * config.rz * 0.68 * branchSign + ridgeDx / ridgeLength * config.rx * 0.12;
  const branchEndZ = branchStartZ + ridgeDx / ridgeLength * config.rz * 0.68 * branchSign + ridgeDz / ridgeLength * config.rz * 0.12;
  const branchDistance = distanceToSegment(x, z, branchStartX, branchStartZ, branchEndX, branchEndZ);
  const branch = config.islet ? 0 : Math.exp(-Math.pow(branchDistance / (ridgeWidth * 0.82), 2))
    * ridgeHeight * ridgeNoise * (0.22 + ridgeBreaks * 0.14);
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
  return WORLD_WATER_LEVEL + 0.075 + shapedCoast * Math.max(0.035, shelf + detail + ridge + branch + peaks - valley);
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
    temperate: { low: [0.035, 0.16, 0.07], mid: [0.07, 0.23, 0.085], rock: [0.15, 0.16, 0.125], cap: [0.27, 0.31, 0.255] },
    lush: { low: [0.02, 0.13, 0.085], mid: [0.035, 0.205, 0.105], rock: [0.12, 0.17, 0.135], cap: [0.23, 0.31, 0.25] },
    verdant: { low: [0.04, 0.17, 0.065], mid: [0.08, 0.255, 0.075], rock: [0.16, 0.17, 0.115], cap: [0.29, 0.32, 0.22] },
    desert: { low: [0.3, 0.105, 0.025], mid: [0.43, 0.17, 0.035], rock: [0.22, 0.085, 0.035], cap: [0.42, 0.24, 0.1] },
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
  const profiles = EPIC_UNDERSIDE_PROFILES;
  const depths = EPIC_UNDERSIDE_DEPTHS;
  const positions = [];
  const colors = [];
  const uvs = [];
  const indices = [];
  for (let level = 0; level < profiles.length; level += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = segment / segments * TAU + Math.sin(level * 0.74) * 0.018;
      const boundary = worldBoundaryScale(angle);
      const fracture = 0.93 + hash2(Math.floor(segment / 6), level + 51) * 0.11;
      const levelRatio = level / (profiles.length - 1);
      const x = Math.cos(angle) * WORLD_RX * boundary * profiles[level] * fracture;
      const z = Math.sin(angle) * WORLD_RZ * boundary * profiles[level] * fracture;
      const y = depths[level]
        + Math.sin(angle * 7 + level) * 0.045 * (0.35 + levelRatio)
        - hash2(Math.floor(segment / 9) + 17, level * 3) * 0.085 * (0.2 + levelRatio);
      const band = (level % 3) * 0.018 + hash2(segment, level) * 0.026;
      const stone = 0.22 - levelRatio * 0.085 + band;
      positions.push(x, y, z);
      colors.push(stone * 0.72, stone * 0.9, stone);
      uvs.push((x / WORLD_RX + 1) * 0.5, (z / WORLD_RZ + 1) * 0.5);
    }
  }
  for (let level = 0; level < profiles.length - 1; level += 1) {
    const upper = level * segments;
    const lower = (level + 1) * segments;
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(upper + segment, lower + next, lower + segment, upper + segment, upper + next, lower + next);
    }
  }
  const apexIndex = positions.length / 3;
  positions.push(0, -4.42, 0);
  colors.push(0.085, 0.115, 0.14);
  uvs.push(0.5, 0.5);
  const lastRing = (profiles.length - 1) * segments;
  for (let segment = 0; segment < segments; segment += 1) {
    const next = (segment + 1) % segments;
    indices.push(apexIndex, lastRing + segment, lastRing + next);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function epicUndersideDepthAt(radial) {
  if (radial >= EPIC_UNDERSIDE_PROFILES[0]) return EPIC_UNDERSIDE_DEPTHS[0];
  const last = EPIC_UNDERSIDE_PROFILES.length - 1;
  if (radial <= EPIC_UNDERSIDE_PROFILES[last]) return EPIC_UNDERSIDE_DEPTHS[last];
  for (let index = 0; index < last; index += 1) {
    const outer = EPIC_UNDERSIDE_PROFILES[index];
    const inner = EPIC_UNDERSIDE_PROFILES[index + 1];
    if (radial <= outer && radial >= inner) {
      const t = (outer - radial) / (outer - inner);
      return mix(EPIC_UNDERSIDE_DEPTHS[index], EPIC_UNDERSIDE_DEPTHS[index + 1], t);
    }
  }
  return -3.92;
}

function createEpicStalactites() {
  const count = 96;
  const random = seeded(77123);
  const geometry = new THREE.ConeGeometry(1, 1, 7, 2);
  geometry.rotateX(Math.PI);
  const material = new THREE.MeshStandardMaterial({
    color: 0x536168,
    vertexColors: true,
    roughness: 1,
    metalness: 0,
    flatShading: true,
    emissive: 0x02070a,
    emissiveIntensity: 0.08,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.name = "Underside hanging stone";
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  for (let index = 0; index < count; index += 1) {
    const angle = random() * TAU;
    const radial = 0.16 + Math.pow(random(), 0.7) * 0.72;
    const boundary = worldBoundaryScale(angle);
    const length = (0.22 + Math.pow(random(), 2.15) * 0.76) * (1.05 - radial * 0.25);
    const radius = 0.045 + random() * 0.085 + length * 0.025;
    const baseY = epicUndersideDepthAt(radial) - 0.015;
    position.set(
      Math.cos(angle) * WORLD_RX * boundary * radial,
      baseY - length * 0.5,
      Math.sin(angle) * WORLD_RZ * boundary * radial,
    );
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), random() * TAU);
    scale.set(radius * (0.78 + random() * 0.36), length, radius);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
    color.setRGB(0.14 + random() * 0.055, 0.17 + random() * 0.055, 0.19 + random() * 0.06);
    mesh.setColorAt(index, color);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function waterfallBreakAt(angle) {
  return EPIC_WATERFALLS.some((fall) => {
    const distance = Math.abs(Math.atan2(Math.sin(angle - fall.angle), Math.cos(angle - fall.angle)));
    return distance < fall.width / WORLD_RX * 0.62 + 0.018;
  });
}

function createEpicIceWallGeometry() {
  const segments = 192;
  const positions = [];
  const colors = [];
  const indices = [];
  for (let segment = 0; segment <= segments; segment += 1) {
    const wrapped = segment % segments;
    const angle = wrapped / segments * TAU;
    const boundary = worldBoundaryScale(angle);
    const topNoise = hash2(Math.floor(wrapped / 3) + 101, 431) - 0.5;
    const tooth = Math.pow(hash2(Math.floor(wrapped / 4) + 37, 619), 2.1);
    const wallRadius = boundary * (1.003 + topNoise * 0.0015);
    const topY = WORLD_WATER_LEVEL + 0.01 + topNoise * 0.055;
    const bottomY = -0.22 - tooth * 0.32 - Math.sin(angle * 11) * 0.028;
    positions.push(
      Math.cos(angle) * WORLD_RX * wallRadius, topY, Math.sin(angle) * WORLD_RZ * wallRadius,
      Math.cos(angle) * WORLD_RX * wallRadius, bottomY, Math.sin(angle) * WORLD_RZ * wallRadius,
    );
    const frost = tooth * 0.035;
    colors.push(0.16 + frost, 0.22 + frost, 0.24 + frost, 0.07 + frost, 0.105 + frost, 0.12 + frost);
  }
  for (let segment = 0; segment < segments; segment += 1) {
    const angle = (segment + 0.5) / segments * TAU;
    if (waterfallBreakAt(angle)) continue;
    const current = segment * 2;
    const next = current + 2;
    indices.push(current, current + 1, next + 1, current, next + 1, next);
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

function createEpicShallowsGeometry() {
  const segments = 96;
  const positions = [];
  const colors = [];
  const indices = [];
  const point = { x: 0, z: 0 };
  EPIC_CONTINENTS.forEach((config) => {
    const offset = positions.length / 3;
    for (let ring = 0; ring < 2; ring += 1) {
      for (let segment = 0; segment < segments; segment += 1) {
        const angle = segment / segments * TAU;
        const boundary = continentBoundaryScale(config, angle) * (ring === 0 ? 1.008 : 1.075);
        const localX = Math.cos(angle) * config.rx * boundary;
        const localZ = Math.sin(angle) * config.rz * boundary;
        continentToWorld(config, localX, localZ, point);
        positions.push(point.x, WORLD_WATER_LEVEL + 0.027, point.z);
        if (ring === 0) colors.push(0.16, 0.58, 0.53);
        else colors.push(0.018, 0.17, 0.22);
      }
    }
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(offset + segment, offset + segments + segment, offset + segments + next);
      indices.push(offset + segment, offset + segments + next, offset + next);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function createEpicRoutes() {
  const riverPositions = [];
  const roadPositions = [];
  const point = { x: 0, z: 0 };

  function appendPath(config, start, end, segments, wiggle, lift, target) {
    const directX = end[0] - start[0];
    const directZ = end[1] - start[1];
    const length = Math.max(0.001, Math.hypot(directX, directZ));
    const normalX = -directZ / length;
    const normalZ = directX / length;
    const bend = Math.sin(config.seed * 0.73) * wiggle * 1.8;
    const controlX = (start[0] + end[0]) * 0.5 + normalX * bend;
    const controlZ = (start[1] + end[1]) * 0.5 + normalZ * bend;
    let previousX = 0;
    let previousY = 0;
    let previousZ = 0;
    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const inverse = 1 - t;
      const meanderEnvelope = Math.sin(t * Math.PI);
      const meander = (
        Math.sin(t * Math.PI * 4 + config.seed) * wiggle
        + Math.sin(t * Math.PI * 7 - config.seed * 0.31) * wiggle * 0.34
      ) * meanderEnvelope;
      const localX = inverse * inverse * start[0] + 2 * inverse * t * controlX + t * t * end[0] + normalX * meander;
      const localZ = inverse * inverse * start[1] + 2 * inverse * t * controlZ + t * t * end[1] + normalZ * meander;
      continentToWorld(config, localX, localZ, point);
      const y = continentHeightLocal(config, localX, localZ) + lift;
      if (index > 0) target.push(previousX, previousY, previousZ, point.x, y, point.z);
      previousX = point.x;
      previousY = y;
      previousZ = point.z;
    }
  }

  EPIC_CONTINENTS.forEach((config) => {
    if (config.islet) return;
    const source = config.peaks[0] || [0, 0];
    const riverAngle = (config.seed * 0.137) % TAU;
    const riverBoundary = continentBoundaryScale(config, riverAngle) * 0.9;
    appendPath(
      config,
      [source[0] * 0.84, source[1] * 0.84],
      [Math.cos(riverAngle) * config.rx * riverBoundary, Math.sin(riverAngle) * config.rz * riverBoundary],
      24,
      0.088,
      0.025,
      riverPositions,
    );
    if (config.capital) {
      for (let branchIndex = 0; branchIndex < 2; branchIndex += 1) {
        const roadAngle = (config.seed * 0.071 + branchIndex * 2.15) % TAU;
        const roadBoundary = continentBoundaryScale(config, roadAngle) * 0.58;
        appendPath(
          config,
          config.capital,
          [Math.cos(roadAngle) * config.rx * roadBoundary, Math.sin(roadAngle) * config.rz * roadBoundary],
          15,
          0.025,
          0.031,
          roadPositions,
        );
      }
    }
  });

  const rivers = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(riverPositions, 3)),
    new THREE.LineBasicMaterial({ color: 0x4ca7a6, transparent: true, opacity: 0.43, depthWrite: false }),
  );
  const roads = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(roadPositions, 3)),
    new THREE.LineBasicMaterial({ color: 0xb88955, transparent: true, opacity: 0.38, depthWrite: false }),
  );
  const group = new THREE.Group();
  group.renderOrder = 4;
  group.add(rivers, roads);
  return group;
}

function createEpicWaterfallGeometry() {
  const falls = EPIC_WATERFALLS;
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

function createEpicWaterMist() {
  const random = seeded(88021);
  const count = 280;
  const positions = new Float32Array(count * 3);
  const data = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const fall = EPIC_WATERFALLS[index % EPIC_WATERFALLS.length];
    const boundary = worldBoundaryScale(fall.angle);
    positions[index * 3] = Math.cos(fall.angle) * WORLD_RX * boundary;
    positions[index * 3 + 1] = WORLD_WATER_LEVEL - fall.length;
    positions[index * 3 + 2] = Math.sin(fall.angle) * WORLD_RZ * boundary;
    data[index * 3] = random();
    data[index * 3 + 1] = (random() - 0.5) * fall.width * 1.9;
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
        float life=mod(aData.x+uTime*(0.026+aData.z*0.025),1.0);
        p.x+=aData.y*(0.32+life)+sin(aData.z*24.0+uTime*0.8)*life*0.2;
        p.z+=cos(aData.x*37.0+uTime*0.55)*life*0.24;
        p.y+=life*(0.48+aData.z*0.4);
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_PointSize=(2.0+aData.z*4.0)*(100.0/-mv.z);
        vAlpha=(1.0-life)*smoothstep(0.0,0.2,life)*0.18;
        gl_Position=projectionMatrix*mv;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main(){
        float d=length(gl_PointCoord-0.5);
        float a=smoothstep(0.5,0.04,d)*vAlpha;
        gl_FragColor=vec4(0.52,0.9,1.0,a);
      }
    `,
  });
  return new THREE.Points(geometry, material);
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
  return { group, sites };
}

function createEpicCityLights(capitalSites) {
  const random = seeded(12041);
  const positions = [];
  const phases = [];
  const sizes = [];
  capitalSites.forEach((site) => {
    for (let index = 0; index < 16; index += 1) {
      const angle = random() * TAU;
      const radius = mix(0.12, 0.58, Math.pow(random(), 1.35)) * site.scale;
      const x = site.x + Math.cos(angle) * radius;
      const z = site.z + Math.sin(angle) * radius * 0.68;
      const sample = epicLandSample(x, z);
      if (!sample || sample.metric > 0.9) continue;
      positions.push(x, sample.height + 0.055 + random() * 0.025, z);
      phases.push(random());
      sizes.push(mix(0.15, 0.28, random()));
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPulse: { value: 0 } },
    vertexShader: `
      attribute float aPhase;
      attribute float aSize;
      varying float vPhase;
      void main(){
        vPhase=aPhase;
        vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
        gl_PointSize=aSize*(275.0/max(5.0,-mvPosition.z));
        gl_Position=projectionMatrix*mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uPulse;
      varying float vPhase;
      void main(){
        vec2 centered=gl_PointCoord-0.5;
        float disc=smoothstep(0.5,0.08,length(centered));
        float twinkle=0.62+sin(uTime*1.45+vPhase*6.28318)*0.22;
        vec3 color=mix(vec3(0.92,0.38,0.12),vec3(1.0,0.82,0.46),vPhase);
        gl_FragColor=vec4(color,disc*(twinkle+uPulse*0.55));
      }
    `,
  });
  const points = new THREE.Points(geometry, material);
  points.renderOrder = 5;
  return { points, material, maxCount: positions.length / 3 };
}

function createEpicBeaconMesh(capitalSites) {
  const material = new THREE.MeshBasicMaterial({
    color: 0x70e6d4,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018, 0.13, 2.6, 8, 1, true), material, capitalSites.length);
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  capitalSites.forEach((site, index) => {
    position.set(site.x, site.y + 2.02 * site.scale, site.z);
    scale.set(site.scale, site.scale, site.scale);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  });
  mesh.visible = false;
  mesh.frustumCulled = false;
  mesh.renderOrder = 6;
  return { mesh, material };
}

function createEpicCloudWisps(texture) {
  const positions = [
    -5.2, 2.6, -1.1,
    -2.1, 3.15, 2.4,
    1.3, 2.75, -2.8,
    4.4, 3.35, 0.8,
    6.0, 2.6, -1.7,
    0.2, 3.8, 1.1,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x92b9b6,
    map: texture,
    size: 4.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.12,
    alphaTest: 0.012,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.renderOrder = 7;
  return points;
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
  for (let index = 0; index < 16; index += 1) {
    const x = mix(38, 218, random());
    const y = mix(90, 168, random());
    const radius = mix(22, 58, random());
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(214,228,222,${mix(0.06, 0.15, random())})`);
    gradient.addColorStop(0.38, "rgba(151,181,178,.055)");
    gradient.addColorStop(0.72, "rgba(116,150,151,.018)");
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
    opacity: 0.13,
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

function createRegionalWeather(texture) {
  const group = new THREE.Group();
  group.name = "Regional weather systems";
  const random = seeded(91731);
  const textureRandom = seeded(12811);
  const weatherCanvas = document.createElement("canvas");
  weatherCanvas.width = weatherCanvas.height = 256;
  const weatherContext = weatherCanvas.getContext("2d");
  weatherContext.clearRect(0, 0, 256, 256);
  for (let index = 0; index < 14; index += 1) {
    const x = mix(28, 228, textureRandom());
    const y = mix(74, 182, textureRandom());
    const radius = mix(18, 46, textureRandom());
    const gradient = weatherContext.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(235,244,241,${mix(0.16, 0.38, textureRandom())})`);
    gradient.addColorStop(0.34, `rgba(185,207,205,${mix(0.06, 0.14, textureRandom())})`);
    gradient.addColorStop(0.7, "rgba(130,158,161,.025)");
    gradient.addColorStop(1, "rgba(88,116,124,0)");
    weatherContext.fillStyle = gradient;
    weatherContext.fillRect(0, 0, 256, 256);
  }
  const weatherTexture = new THREE.CanvasTexture(weatherCanvas);
  weatherTexture.colorSpace = THREE.SRGBColorSpace;
  const sprites = [];
  const regions = [
    { name: "Gale Teeth storm", center: [5.35, 2.0, 1.8], spread: [2.45, 1.45, 1.6], count: 17, color: 0x647584, opacity: 0.3, scale: [2.6, 5.2], speed: 0.055 },
    { name: "High March rain", center: [-2.2, 1.25, -1.7], spread: [2.5, 0.55, 1.35], count: 10, color: 0x91a4a6, opacity: 0.21, scale: [1.8, 3.5], speed: 0.035 },
    { name: "Aster Vale sunlight", center: [-2.7, 1.8, 3.55], spread: [2.05, 0.65, 1.0], count: 8, color: 0xffe4b0, opacity: 0.12, scale: [1.7, 3.15], speed: 0.026 },
    { name: "Lantern mist", center: [4.65, 0.62, -3.2], spread: [2.0, 0.28, 1.2], count: 10, color: 0xb2cfcc, opacity: 0.18, scale: [1.6, 3.2], speed: 0.022 },
  ];
  const materials = regions.map((region) => new THREE.SpriteMaterial({
    map: weatherTexture,
    color: region.color,
    transparent: true,
    opacity: region.opacity,
    alphaTest: 0.018,
    depthWrite: false,
    fog: true,
  }));

  regions.forEach((region, regionIndex) => {
    for (let index = 0; index < region.count; index += 1) {
      const sprite = new THREE.Sprite(materials[regionIndex]);
      const angle = random() * TAU;
      const radius = Math.sqrt(random());
      const x = region.center[0] + Math.cos(angle) * region.spread[0] * radius;
      const z = region.center[2] + Math.sin(angle) * region.spread[2] * radius;
      const y = region.center[1] + (random() - 0.5) * region.spread[1];
      const width = mix(region.scale[0], region.scale[1], random());
      sprite.position.set(x, y, z);
      sprite.scale.set(width, width * mix(0.22, 0.36, random()), 1);
      sprite.renderOrder = regionIndex === 3 ? 9 : 8;
      sprite.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: random() * TAU,
        speed: region.speed * mix(0.72, 1.28, random()),
        region: regionIndex,
      };
      group.add(sprite);
      sprites.push(sprite);
    }
  });

  const rimMistMaterial = new THREE.SpriteMaterial({
    map: weatherTexture,
    color: 0x9bc4c7,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    fog: true,
  });
  for (let index = 0; index < 18; index += 1) {
    if (index % 5 === 2) continue;
    const angle = index / 18 * TAU + (random() - 0.5) * 0.18;
    const boundary = worldBoundaryScale(angle);
    const sprite = new THREE.Sprite(rimMistMaterial);
    const x = Math.cos(angle) * WORLD_RX * boundary * 0.96;
    const z = Math.sin(angle) * WORLD_RZ * boundary * 0.96;
    sprite.position.set(x, mix(0.28, 0.72, random()), z);
    const width = mix(1.5, 2.8, random());
    sprite.scale.set(width, width * mix(0.2, 0.32, random()), 1);
    sprite.renderOrder = 9;
    sprite.userData = { baseX: x, baseY: sprite.position.y, baseZ: z, phase: random() * TAU, speed: mix(0.012, 0.026, random()), region: 4 };
    group.add(sprite);
    sprites.push(sprite);
  }

  return { group, sprites, materials, rimMistMaterial, texture: weatherTexture };
}

function createVolumetricWeather() {
  const group = new THREE.Group();
  group.name = "Ray-marched regional atmosphere";
  const volumes = [];
  const geometry = new THREE.SphereGeometry(1, 40, 24);
  const configurations = [
    { name: "Gale Teeth thunderhead", position: [5.15, 2.35, 1.8], scale: [3.35, 1.18, 2.2], seed: 1.7, density: 1.65, threshold: 0.36, opacity: 0.92, shadow: 0x314b5d, light: 0xc8dde0, drift: [0.022, 0.008] },
    { name: "High March rain shelf", position: [-2.35, 1.65, -1.75], scale: [3.15, 0.76, 1.92], seed: 4.1, density: 1.4, threshold: 0.39, opacity: 0.78, shadow: 0x536970, light: 0xd0ddda, drift: [0.014, -0.007] },
    { name: "Aster Vale sunbreak", position: [-2.85, 2.7, 3.45], scale: [2.7, 1.04, 1.72], seed: 7.6, density: 1.25, threshold: 0.41, opacity: 0.68, shadow: 0x807970, light: 0xffedc5, drift: [0.01, 0.006] },
    { name: "Lantern coast sea fog", position: [4.55, 0.72, -3.12], scale: [2.75, 0.42, 1.55], seed: 10.4, density: 1.45, threshold: 0.37, opacity: 0.72, shadow: 0x5d767a, light: 0xc8e4df, drift: [0.007, -0.01] },
    { name: "North rim mist bank", position: [-0.8, 0.54, -5.65], scale: [2.6, 0.34, 0.92], seed: 13.8, density: 1.3, threshold: 0.4, opacity: 0.66, shadow: 0x56737b, light: 0xbde1e0, drift: [0.006, 0.004] },
    { name: "Western waterfall fog", position: [-5.65, 0.38, 0.65], scale: [1.75, 0.5, 1.18], seed: 16.2, density: 1.5, threshold: 0.36, opacity: 0.76, shadow: 0x507984, light: 0xc9efec, drift: [0.004, -0.006] },
    { name: "High wandering cloud deck", position: [0.1, 4.45, -0.5], scale: [5.2, 0.82, 2.25], seed: 20.1, density: 1.12, threshold: 0.42, opacity: 0.5, shadow: 0x64747a, light: 0xe0e7e3, drift: [0.017, 0.003] },
  ];

  configurations.forEach((config, index) => {
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      fog: false,
      uniforms: {
        uTime: { value: 0 },
        uSeed: { value: config.seed },
        uDensity: { value: config.density },
        uThreshold: { value: config.threshold },
        uOpacity: { value: config.opacity },
        uSteps: { value: 18 },
        uCameraLocal: { value: new THREE.Vector3() },
        uShadowColor: { value: new THREE.Color(config.shadow) },
        uLightColor: { value: new THREE.Color(config.light) },
        uWind: { value: new THREE.Vector2(config.drift[0], config.drift[1]) },
      },
      vertexShader: `
        varying vec3 vLocalPosition;
        void main(){
          vLocalPosition=position;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uSeed;
        uniform float uDensity;
        uniform float uThreshold;
        uniform float uOpacity;
        uniform float uSteps;
        uniform vec3 uCameraLocal;
        uniform vec3 uShadowColor;
        uniform vec3 uLightColor;
        uniform vec2 uWind;
        varying vec3 vLocalPosition;
        float hash31(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
        float noise3(vec3 p){
          vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
          return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);
        }
        float fbm(vec3 p){
          float value=0.0,amplitude=0.52;
          for(int octave=0;octave<4;octave++){value+=noise3(p)*amplitude;p=p*2.03+vec3(1.7,9.2,2.8);amplitude*=0.5;}
          return value;
        }
        float densityAt(vec3 p){
          vec3 wind=vec3(uWind.x*uTime,0.0,uWind.y*uTime);
          float body=1.0-smoothstep(0.48,1.0,length(p));
          float floorFade=smoothstep(-0.96,-0.48,p.y);
          float ceilingFade=1.0-smoothstep(0.24,0.98,p.y);
          float broad=fbm(p*2.15+wind+uSeed*0.73);
          float detail=fbm(p*5.1-wind*1.7+uSeed*1.91);
          return smoothstep(uThreshold,0.88,broad*0.78+detail*0.22)*body*floorFade*ceilingFade;
        }
        void main(){
          vec3 rayOrigin=uCameraLocal;
          vec3 rayDirection=normalize(vLocalPosition-rayOrigin);
          float b=dot(rayOrigin,rayDirection);
          float c=dot(rayOrigin,rayOrigin)-1.0;
          float h=b*b-c;
          if(h<0.0)discard;
          h=sqrt(h);
          float nearT=max(0.0,-b-h);
          float farT=-b+h;
          float span=max(0.001,farT-nearT);
          float jitter=hash31(vec3(gl_FragCoord.xy,uSeed));
          vec3 accumulated=vec3(0.0);
          float alpha=0.0;
          for(int stepIndex=0;stepIndex<24;stepIndex++){
            if(float(stepIndex)>=uSteps)break;
            float t=nearT+(float(stepIndex)+jitter)*span/uSteps;
            vec3 p=rayOrigin+rayDirection*t;
            float density=densityAt(p);
            if(density>0.001){
              float lightPhase=clamp(p.y*0.46+0.58+noise3(p*3.4+uSeed)*0.22,0.0,1.0);
              vec3 sampleColor=mix(uShadowColor,uLightColor,lightPhase);
              float sampleAlpha=(1.0-exp(-density*uDensity*span/uSteps*2.35))*uOpacity;
              accumulated+=(1.0-alpha)*sampleColor*sampleAlpha;
              alpha+=(1.0-alpha)*sampleAlpha;
              if(alpha>0.96)break;
            }
          }
          float shellFade=smoothstep(0.02,0.56,span);
          accumulated*=shellFade;
          alpha*=shellFade;
          if(alpha<0.01)discard;
          gl_FragColor=vec4(accumulated/max(alpha,0.001),alpha);
        }
      `,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = config.name;
    mesh.position.set(...config.position);
    mesh.scale.set(...config.scale);
    mesh.rotation.y = config.seed * 0.37;
    mesh.renderOrder = 8 + index * 0.01;
    mesh.userData.basePosition = mesh.position.clone();
    mesh.userData.phase = config.seed;
    group.add(mesh);
    volumes.push({ mesh, material });
  });
  return { group, volumes, geometry };
}

function createRegionalLightning() {
  const group = new THREE.Group();
  group.name = "Moving rim lightning";
  const random = seeded(33219);
  const bolts = [];
  const origins = [
    [5.65, 3.25, 1.45],
    [4.55, 2.95, 2.55],
    [-2.6, 2.6, -2.35],
  ];
  origins.forEach((origin, boltIndex) => {
    const points = [];
    let x = origin[0];
    let y = origin[1];
    let z = origin[2];
    for (let index = 0; index < 13; index += 1) {
      points.push(new THREE.Vector3(x, y, z));
      x += (random() - 0.5) * 0.2;
      z += (random() - 0.5) * 0.13;
      y -= mix(0.14, 0.24, random());
    }
    const material = new THREE.LineBasicMaterial({
      color: boltIndex === 2 ? 0x9ce9ff : 0xc4f4ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    line.frustumCulled = false;
    line.renderOrder = 12;
    line.userData.phase = [0.18, 0.45, 0.665][boltIndex];
    line.userData.energy = 1;
    line.userData.storm = boltIndex;
    group.add(line);
    bolts.push(line);

    for (let branchIndex = 0; branchIndex < 2; branchIndex += 1) {
      const anchorIndex = 4 + branchIndex * 3;
      const anchor = points[anchorIndex];
      const branchPoints = [anchor.clone()];
      let branchX = anchor.x;
      let branchY = anchor.y;
      let branchZ = anchor.z;
      const direction = branchIndex === 0 ? -1 : 1;
      for (let index = 0; index < 5; index += 1) {
        branchX += direction * mix(0.09, 0.2, random()) + (random() - 0.5) * 0.08;
        branchY -= mix(0.08, 0.15, random());
        branchZ += (random() - 0.5) * 0.18;
        branchPoints.push(new THREE.Vector3(branchX, branchY, branchZ));
      }
      const branchMaterial = material.clone();
      const branch = new THREE.Line(new THREE.BufferGeometry().setFromPoints(branchPoints), branchMaterial);
      branch.frustumCulled = false;
      branch.renderOrder = 12;
      branch.userData.phase = line.userData.phase;
      branch.userData.energy = 0.58;
      branch.userData.storm = boltIndex;
      group.add(branch);
      bolts.push(branch);
    }
  });
  return { group, bolts };
}

function createRegionalSunshafts() {
  const group = new THREE.Group();
  group.name = "Local sunlight shafts";
  const material = new THREE.MeshBasicMaterial({
    color: 0xffd9a0,
    transparent: true,
    opacity: 0.02,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: true,
  });
  const shafts = [
    { x: -3.3, z: 3.4, y: 3.6, radius: 0.9, height: 5.8, tilt: 0.08 },
    { x: -1.9, z: 3.9, y: 3.2, radius: 0.62, height: 5.1, tilt: -0.12 },
    { x: 0.2, z: -3.55, y: 3.45, radius: 0.5, height: 5.35, tilt: 0.16 },
  ];
  shafts.forEach((shaft, index) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(shaft.radius * 0.18, shaft.radius, shaft.height, 20, 1, true), material);
    mesh.position.set(shaft.x, shaft.y, shaft.z);
    mesh.rotation.z = shaft.tilt;
    mesh.rotation.x = index === 2 ? -0.12 : 0.04;
    mesh.renderOrder = 7;
    group.add(mesh);
  });
  return { group, material };
}

function createSpectacleHalos() {
  const group = new THREE.Group();
  group.name = "Cinematic weather halos";
  const texture = createRadialGlowTexture();
  const makeSprite = (color, opacity, position, scale, blending = THREE.AdditiveBlending) => {
    const material = new THREE.SpriteMaterial({
      map: texture,
      color,
      transparent: true,
      opacity,
      blending,
      depthWrite: false,
      fog: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(...position);
    sprite.scale.set(...scale, 1);
    sprite.renderOrder = 11;
    group.add(sprite);
    return { sprite, material };
  };
  const sun = makeSprite(0xffb85f, 0.72, [-4.35, 4.75, 4.5], [4.4, 4.4]);
  const sunBreak = makeSprite(0xffdca0, 0.14, [-3.15, 2.55, 3.7], [5.5, 7.4]);
  const storm = makeSprite(0x63bde8, 0.13, [5.2, 2.1, 1.8], [7.8, 5.6]);
  const abyss = makeSprite(0x54d7e3, 0.32, [0, -3.9, 0], [5.2, 5.2]);
  return { group, texture, sun, sunBreak, storm, abyss };
}

function createStormCrown() {
  const group = new THREE.Group();
  group.name = "Cyclonic storm crown";
  group.position.set(5.15, 2.25, 1.8);
  const rings = [];
  for (let index = 0; index < 4; index += 1) {
    const material = new THREE.MeshBasicMaterial({
      color: index % 2 ? 0x70c6de : 0x8ed8e9,
      transparent: true,
      opacity: 0.055 - index * 0.007,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: true,
    });
    const radius = 1.25 + index * 0.48;
    const ring = new THREE.Mesh(new THREE.RingGeometry(radius, radius + 0.045 + index * 0.018, 96), material);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = index * 0.06;
    ring.scale.y = 0.72 + index * 0.04;
    ring.renderOrder = 7;
    group.add(ring);
    rings.push(ring);
  }
  return { group, rings };
}

function createWaterfallHalos() {
  const group = new THREE.Group();
  group.name = "Waterfall radiance";
  const texture = createRadialGlowTexture();
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: 0x6ee8f0,
    transparent: true,
    opacity: 0.44,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: true,
  });
  const sprites = [];
  EPIC_WATERFALLS.forEach((fall) => {
    const boundary = worldBoundaryScale(fall.angle);
    const sprite = new THREE.Sprite(material);
    sprite.position.set(
      Math.cos(fall.angle) * WORLD_RX * boundary * 1.015,
      WORLD_WATER_LEVEL - 0.32,
      Math.sin(fall.angle) * WORLD_RZ * boundary * 1.015,
    );
    const size = 1.4 + fall.width * 2.4;
    sprite.scale.set(size, size * 2.6, 1);
    sprite.renderOrder = 10;
    group.add(sprite);
    sprites.push(sprite);
  });
  return { group, texture, material, sprites };
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

function createAuroraCurtains() {
  const group = new THREE.Group();
  group.name = "Depth-stacked volumetric auroras";
  const materials = [];
  const meshes = [];
  const configurations = [
    { center: -0.72, arc: 1.05, radius: 8.25, base: 0.7, height: 3.65, seed: 0.7, cyan: [0.16, 1.0, 0.84], violet: [0.42, 0.28, 1.0] },
    { center: 2.45, arc: 0.78, radius: 8.65, base: 0.95, height: 3.15, seed: 2.3, cyan: [0.12, 0.72, 1.0], violet: [0.72, 0.26, 1.0] },
    { center: 0.82, arc: 0.64, radius: 9.1, base: 1.15, height: 2.75, seed: 4.9, cyan: [0.2, 1.0, 0.76], violet: [0.3, 0.44, 1.0] },
  ];
  configurations.forEach((config, configurationIndex) => {
    for (let layer = 0; layer < 3; layer += 1) {
      const alongSegments = 96;
      const verticalSegments = 18;
      const positions = [];
      const uvs = [];
      const indices = [];
      const layerSeed = config.seed + layer * 1.731;
      for (let vertical = 0; vertical <= verticalSegments; vertical += 1) {
        const v = vertical / verticalSegments;
        for (let along = 0; along <= alongSegments; along += 1) {
          const u = along / alongSegments;
          const angle = config.center + (u - 0.5) * config.arc + (layer - 1) * 0.018;
          const fold = Math.sin(u * Math.PI * (4.5 + layer * 0.7) + layerSeed) * 0.38
            + Math.sin(u * Math.PI * (10.0 + layer) - layerSeed) * 0.14
            + Math.sin((u + v * 0.24) * Math.PI * 19 + layerSeed * 0.4) * 0.055;
          const radius = config.radius + (layer - 1) * 0.22 + fold * (0.16 + v * 0.28);
          positions.push(
            Math.cos(angle) * radius,
            config.base + layer * 0.07 + v * config.height * (0.94 + layer * 0.035) + fold * (0.18 + v * 0.5),
            Math.sin(angle) * radius,
          );
          uvs.push(u, v);
        }
      }
      const stride = alongSegments + 1;
      for (let vertical = 0; vertical < verticalSegments; vertical += 1) {
        for (let along = 0; along < alongSegments; along += 1) {
          const a = vertical * stride + along;
          const b = a + stride;
          indices.push(a, b, b + 1, a, b + 1, a + 1);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        fog: false,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 1 },
          uSeed: { value: layerSeed },
          uLayer: { value: layer },
          uCyan: { value: new THREE.Color(...config.cyan) },
          uViolet: { value: new THREE.Color(...config.violet) },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uSeed;
          uniform float uLayer;
          varying vec2 vUv;
          varying float vFold;
          void main(){
            vUv=uv;
            vec3 p=position;
            float slow=sin(uv.x*17.0+uSeed+uTime*(0.07+uLayer*0.012));
            float fine=sin(uv.x*43.0-uv.y*7.0-uTime*0.11+uSeed*2.0);
            float fold=slow+fine*0.42;
            p.y+=fold*(0.035+uv.y*0.075);
            p.xz*=1.0+sin(uv.x*13.0+uv.y*4.0-uTime*0.055+uSeed)*0.0045*uv.y;
            vFold=fold;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uIntensity;
          uniform float uSeed;
          uniform float uLayer;
          uniform vec3 uCyan;
          uniform vec3 uViolet;
          varying vec2 vUv;
          varying float vFold;
          float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
          float fbm2(vec2 p){float v=0.0,a=0.55;for(int i=0;i<4;i++){v+=noise2(p)*a;p=p*2.04+vec2(5.2,1.3);a*=0.48;}return v;}
          void main(){
            vec2 flow=vec2(vUv.x*7.0+uTime*0.012,vUv.y*2.8-uTime*0.021);
            float warp=fbm2(flow+uSeed)-0.5;
            float filaments=pow(0.5+0.5*sin((vUv.x+warp*0.075)*92.0+uTime*0.18+uSeed*3.0),5.5);
            float secondary=pow(0.5+0.5*sin((vUv.x-warp*0.045)*157.0-uTime*0.12+uSeed),7.0);
            float veil=fbm2(vec2(vUv.x*13.0+warp*1.8,vUv.y*5.0-uTime*0.018)+uSeed*2.0);
            float breakup=smoothstep(0.3,0.74,fbm2(vec2(vUv.x*18.0-uTime*0.009,vUv.y*7.0)+uSeed*4.0));
            float vertical=smoothstep(0.0,0.1+veil*0.05,vUv.y)*smoothstep(1.0,0.46+veil*0.28,vUv.y);
            float ends=smoothstep(0.0,0.08+warp*0.025,vUv.x)*smoothstep(1.0,0.9+warp*0.035,vUv.x);
            float depthFade=0.52+uLayer*0.18;
            float alpha=vertical*ends*breakup*(0.018+filaments*0.16+secondary*0.08+veil*0.035+abs(vFold)*0.008)*depthFade*uIntensity;
            vec3 color=mix(uCyan,uViolet,clamp(vUv.y*0.3+vUv.x*0.42+veil*0.34+uLayer*0.12,0.0,1.0));
            color*=0.62+filaments*0.72+secondary*0.42+veil*0.24;
            gl_FragColor=vec4(color,alpha);
          }
        `,
      });
      materials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 4 + configurationIndex * 0.1 + layer * 0.01;
      mesh.userData.layer = layer;
      mesh.userData.phase = layerSeed;
      meshes.push(mesh);
      group.add(mesh);
    }
  });
  return { group, materials, meshes };
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
          float nebulaA = sin(d.x * 9.0 + d.z * 13.0 + sin(d.y * 7.0) * 2.4 + uTime * 0.018);
          float nebulaB = sin(d.x * 21.0 - d.z * 8.0 + d.y * 15.0 - uTime * 0.011);
          float nebula = smoothstep(0.44, 0.94, nebulaA * 0.68 + nebulaB * 0.32)
            * smoothstep(-0.18, 0.36, d.y) * smoothstep(0.88, 0.24, d.y);
          vec3 nebulaColor = mix(vec3(0.05, 0.38, 0.55), vec3(0.32, 0.08, 0.48), d.x * 0.5 + 0.5);
          color += nebulaColor * nebula * (0.3 + horizon * 0.34);
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

function createVeinedUndersideMaterial(undersideTexture) {
  const material = new THREE.MeshStandardMaterial({
    map: undersideTexture,
    color: 0xb4c2c5,
    roughness: 0.92,
    metalness: 0.015,
    emissive: 0x081016,
    emissiveIntensity: 0.3,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uVeinTime = { value: 0 };
    shader.uniforms.uVeinPulse = { value: 0 };
    shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `
      vec4 sampledDiffuseColor = texture2D(map, vMapUv);
      float undersideInk = smoothstep(0.018, 0.13, max(max(sampledDiffuseColor.r, sampledDiffuseColor.g), sampledDiffuseColor.b));
      vec3 rimStone = vec3(0.3, 0.39, 0.42);
      sampledDiffuseColor.rgb = mix(rimStone, sampledDiffuseColor.rgb * 1.18, undersideInk);
      diffuseColor *= sampledDiffuseColor;
    `);
    material.userData.shader = shader;
  };
  return material;
}

function createRadialGlowTexture() {
  const size = 128;
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = size;
  glowCanvas.height = size;
  const context = glowCanvas.getContext("2d");
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.22, "rgba(190,220,255,0.85)");
  gradient.addColorStop(0.55, "rgba(110,160,255,0.3)");
  gradient.addColorStop(1, "rgba(60,110,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(glowCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
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
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x061116);
  scene.fog = new THREE.FogExp2(0x08171a, 0.018);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 150);
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
      uWorldTopMap: { value: null },
      uWorldReliefMap: { value: null },
    },
    vertexShader: `
      uniform float uTime;
      attribute float aEdge;
      varying float vEdge;
      varying vec3 vWorld;
      varying float vWave;
      varying vec3 vWaveNormal;
      varying vec2 vMapUv;
      void main() {
        vec3 p = position;
        float waveA = p.x * 1.45 + p.z * 0.38 + uTime * 0.34;
        float waveB = p.z * 1.72 - p.x * 0.24 - uTime * 0.29;
        float wave = sin(waveA) * 0.021 + cos(waveB) * 0.017;
        p.y += wave;
        vEdge = aEdge;
        vWave = wave;
        float slopeX = cos(waveA) * 0.021 * 1.45 + sin(waveB) * 0.017 * 0.24;
        float slopeZ = cos(waveA) * 0.021 * 0.38 + sin(waveB) * 0.017 * 1.72;
        vWaveNormal = normalize(mat3(modelMatrix) * vec3(-slopeX, 1.0, -slopeZ));
        vMapUv = vec2((p.x + ${WORLD_RX.toFixed(2)}) / ${(WORLD_RX * 2).toFixed(2)}, (p.z + ${WORLD_RZ.toFixed(2)}) / ${(WORLD_RZ * 2).toFixed(2)});
        vWorld = (modelMatrix * vec4(p, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uPulse;
      uniform sampler2D uWorldTopMap;
      uniform sampler2D uWorldReliefMap;
      varying float vEdge;
      varying vec3 vWorld;
      varying float vWave;
      varying vec3 vWaveNormal;
      varying vec2 vMapUv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0)),f.x),f.y);
      }
      void main() {
        vec3 atlasColor = texture2D(uWorldTopMap, vMapUv).rgb;
        float relief = texture2D(uWorldReliefMap, vMapUv).r;
        vec2 reliefTexel = vec2(0.00048828125);
        float reliefLeft = texture2D(uWorldReliefMap, vMapUv - vec2(reliefTexel.x, 0.0)).r;
        float reliefRight = texture2D(uWorldReliefMap, vMapUv + vec2(reliefTexel.x, 0.0)).r;
        float reliefDown = texture2D(uWorldReliefMap, vMapUv - vec2(0.0, reliefTexel.y)).r;
        float reliefUp = texture2D(uWorldReliefMap, vMapUv + vec2(0.0, reliefTexel.y)).r;
        vec2 topographyGradient = vec2(reliefRight - reliefLeft, reliefUp - reliefDown);
        float topographySlope = length(topographyGradient);
        vec2 shoreDirection = topographyGradient / max(topographySlope, 0.00008);
        vec2 prevailingCurrent = normalize(vec2(0.82, 0.31));
        float topographyWeight = smoothstep(0.00035, 0.009, topographySlope);
        vec2 flowDirection = normalize(mix(prevailingCurrent, shoreDirection, topographyWeight * 0.9));
        float atlasInk = smoothstep(0.018, 0.08, max(max(atlasColor.r, atlasColor.g), atlasColor.b));
        float waterBlue = atlasColor.b - max(atlasColor.r * 0.86, atlasColor.g * 0.72);
        float seaMask = atlasInk * (1.0 - smoothstep(0.17, 0.31, relief)) * smoothstep(0.012, 0.105, waterBlue);
        if (seaMask < 0.055) discard;
        vec3 viewDir = normalize(cameraPosition - vWorld);
        vec3 normal = normalize(vWaveNormal);
        float fresnel = pow(1.0 - clamp(dot(viewDir, normal), 0.0, 1.0), 1.55);
        vec3 sunDirection = normalize(vec3(-0.46, 0.82, 0.34));
        float sunGlint = pow(max(dot(reflect(-sunDirection, normal), viewDir), 0.0), 18.0);
        float rippleA = sin(vWorld.x * 4.8 + vWorld.z * 1.35 + uTime * 1.08);
        float rippleB = sin(vWorld.z * 6.2 - vWorld.x * 0.75 - uTime * 0.86);
        float rippleC = sin((vWorld.x + vWorld.z) * 10.5 + uTime * 1.34);
        float crest = smoothstep(0.62, 0.94, rippleA * 0.46 + rippleB * 0.38 + rippleC * 0.16);
        float broadWarp = noise(vWorld.xz * 0.42 + vec2(uTime * 0.035, -uTime * 0.024)) * 2.0 - 1.0;
        float fineWarp = noise(vWorld.xz * 1.26 + vec2(-uTime * 0.075, uTime * 0.046)) * 2.0 - 1.0;
        float waveLineA = pow(0.5 + 0.5 * sin(dot(vWorld.xz, vec2(5.7, 1.8)) + broadWarp * 4.2 + uTime * 1.26), 22.0);
        float waveLineB = pow(0.5 + 0.5 * sin(dot(vWorld.xz, vec2(-1.15, 7.1)) + fineWarp * 2.7 - uTime * 0.92), 28.0);
        float breakup = smoothstep(0.28, 0.74, noise(vWorld.xz * 1.14 + vec2(uTime * 0.065, -uTime * 0.052)));
        float reflectionStreak = waveLineA * (0.22 + breakup * 0.78) + waveLineB * (0.2 - breakup * 0.11);
        float shimmerLines = reflectionStreak * smoothstep(0.7, 0.97, noise(vWorld.xz * 4.6 + vec2(uTime * 0.38, -uTime * 0.29)));
        vec2 foamUv = vWorld.xz - flowDirection * uTime * 0.24;
        float foamWarp = noise(foamUv * 0.68 + flowDirection.yx * 3.1) * 2.0 - 1.0;
        float foamPhase = dot(foamUv, flowDirection) * 8.4 + foamWarp * 3.6;
        float foamFront = pow(0.5 + 0.5 * sin(foamPhase), 10.0);
        float foamBreakup = smoothstep(0.15, 0.65, noise(foamUv * 3.25 + vec2(uTime * 0.08, -uTime * 0.055)));
        float shallowZone = smoothstep(0.151, 0.17, relief) * (1.0 - smoothstep(0.205, 0.28, relief));
        float slopeZone = smoothstep(0.00018, 0.0065, topographySlope);
        float foamZone = clamp(shallowZone * 0.9 + slopeZone * 1.15, 0.0, 1.0) * smoothstep(0.055, 0.3, seaMask);
        float foamFlecks = smoothstep(0.83, 0.975, noise(foamUv * 7.4 - flowDirection * uTime * 0.13));
        float topographicFoam = clamp(foamFront * (0.38 + foamBreakup * 0.62) + foamFlecks * 0.12, 0.0, 1.0) * foamZone;
        float sparkleNoise = noise(vWorld.xz * 14.0 + vec2(uTime * 0.7, -uTime * 0.48));
        float sparkle = smoothstep(0.89, 0.985, sparkleNoise) * (0.35 + sunGlint * 1.8);
        float rim = smoothstep(0.89, 1.0, vEdge);
        vec3 deep = atlasColor * vec3(0.68, 0.8, 0.92);
        vec3 skyReflection = mix(vec3(0.075, 0.34, 0.44), vec3(0.34, 0.68, 0.72), fresnel);
        vec3 color = mix(deep, skyReflection, 0.23 + fresnel * 0.65);
        color += vec3(0.18, 0.62, 0.72) * crest * (0.085 + fresnel * 0.18);
        color += vec3(0.42, 0.8, 0.9) * shimmerLines * (0.22 + fresnel * 0.44);
        color += vec3(0.48, 0.86, 0.96) * reflectionStreak * (0.34 + fresnel * 0.4);
        color += vec3(0.82, 0.98, 0.95) * topographicFoam * (0.88 + fresnel * 0.32);
        color += vec3(1.0, 0.82, 0.5) * sunGlint * 1.7;
        color += vec3(0.72, 0.95, 1.0) * sparkle * 0.88;
        color += vec3(0.1, 0.48, 0.52) * rim * (0.08 + uPulse * 0.08);
        color += vec3(0.12, 0.32, 0.34) * max(vWave, 0.0) * 1.25;
        float shoreline = smoothstep(0.055, 0.42, seaMask);
        float alpha = (0.24 + fresnel * 0.5 + shimmerLines * 0.2 + reflectionStreak * 0.23 + topographicFoam * 0.62 + sunGlint * 0.25 + sparkle * 0.12 + rim * 0.025) * shoreline;
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.82));
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
        gl_FragColor=vec4(color,edge*sheet*fade*(0.92+uPulse*0.18));
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
  const epicUndersideTexture = new THREE.TextureLoader().load("assets/world/celestial_world_underside_texture.png?v=3");
  epicUndersideTexture.colorSpace = THREE.SRGBColorSpace;
  epicUndersideTexture.wrapS = THREE.ClampToEdgeWrapping;
  epicUndersideTexture.wrapT = THREE.ClampToEdgeWrapping;
  epicUndersideTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const epicUndersideMaterial = createVeinedUndersideMaterial(epicUndersideTexture);
  const epicUnderside = shadow(new THREE.Mesh(createEpicUndersideGeometry(), epicUndersideMaterial));
  const epicStalactites = createEpicStalactites();
  const epicIceWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xa2bcc1,
    vertexColors: true,
    roughness: 0.68,
    metalness: 0.035,
    emissive: 0x0a2830,
    emissiveIntensity: 0.34,
    side: THREE.DoubleSide,
  });
  const epicIceWall = shadow(new THREE.Mesh(createEpicIceWallGeometry(), epicIceWallMaterial));
  epicIceWall.name = "Broken glacial rim";
  const epicTerrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0.01,
    emissive: 0x06100d,
    emissiveIntensity: 0.12,
  });
  const epicOcean = new THREE.Mesh(createEpicOceanGeometry(), epicOceanMaterial);
  epicOcean.renderOrder = 2;
  epicOcean.position.y = 0.018;
  const epicShallowsMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const epicShallows = new THREE.Mesh(createEpicShallowsGeometry(), epicShallowsMaterial);
  epicShallows.renderOrder = 3;
  const epicContinents = new THREE.Group();
  EPIC_CONTINENTS.forEach((config) => {
    const continent = shadow(new THREE.Mesh(createContinentGeometry(config), epicTerrainMaterial));
    continent.name = config.name;
    epicContinents.add(continent);
  });
  const epicCliffs = shadow(new THREE.Mesh(createEpicCliffGeometry(), undersideMaterial));
  const epicCoastlines = createEpicCoastlines();
  epicCoastlines.renderOrder = 3;
  const epicRoutes = createEpicRoutes();
  const epicWaterfalls = new THREE.Mesh(createEpicWaterfallGeometry(), waterfallMaterial);
  epicWaterfalls.renderOrder = 4;
  const epicWaterMist = createEpicWaterMist();
  epicWaterMist.renderOrder = 5;
  const epicTrees = createEpicTrees();
  const epicLandmarks = createEpicLandmarks(materials);
  const epicCapitals = createEpicCapitals(materials);
  const epicCityLights = createEpicCityLights(epicCapitals.sites);
  const epicBeacons = createEpicBeaconMesh(epicCapitals.sites);
  const meshyWorld = new THREE.Group();
  meshyWorld.name = "Optimized Meshy world (moon removed)";
  let meshyTextureLoaded = false;
  const meshyTopTexture = new THREE.TextureLoader().load(
    "assets/world/celestial_world_top_texture_4k_detail.webp?v=1",
    () => {
      meshyTextureLoaded = true;
      canvas.dataset.meshyTexture = "loaded";
    },
    undefined,
    () => { canvas.dataset.meshyTexture = "vertex-color-fallback"; },
  );
  meshyTopTexture.colorSpace = THREE.SRGBColorSpace;
  meshyTopTexture.flipY = false;
  meshyTopTexture.wrapS = THREE.ClampToEdgeWrapping;
  meshyTopTexture.wrapT = THREE.ClampToEdgeWrapping;
  meshyTopTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const meshyReliefTexture = new THREE.TextureLoader().load("assets/world/celestial_world_heightmap_16bit.png?v=2");
  meshyReliefTexture.flipY = false;
  meshyReliefTexture.wrapS = THREE.ClampToEdgeWrapping;
  meshyReliefTexture.wrapT = THREE.ClampToEdgeWrapping;
  meshyReliefTexture.minFilter = THREE.LinearFilter;
  meshyReliefTexture.magFilter = THREE.LinearFilter;
  epicOceanMaterial.uniforms.uWorldTopMap.value = meshyTopTexture;
  epicOceanMaterial.uniforms.uWorldReliefMap.value = meshyReliefTexture;
  const meshyWorldMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0c7aa,
    vertexColors: true,
    roughness: 0.72,
    metalness: 0.025,
    emissive: 0x02090d,
    emissiveIntensity: 0.055,
  });
  let meshyWorldShader = null;
  meshyWorldMaterial.onBeforeCompile = (shader) => {
    meshyWorldShader = shader;
    shader.uniforms.uWorldTopMap = { value: meshyTopTexture };
    shader.uniforms.uWorldReliefMap = { value: meshyReliefTexture };
    shader.uniforms.uWorldUndersideMap = { value: epicUndersideTexture };
    shader.uniforms.uWaterTime = { value: 0 };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D uWorldReliefMap;\nvarying vec2 vWorldTopUv;\nvarying float vWorldTopMask;\nvarying float vWorldRelief;\nvarying vec3 vUndersidePosition;")
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        vWorldTopUv = vec2(
          (position.x + ${WORLD_RX.toFixed(2)}) / ${(WORLD_RX * 2).toFixed(2)},
          (position.z + ${WORLD_RZ.toFixed(2)}) / ${(WORLD_RZ * 2).toFixed(2)}
        );
        vWorldRelief = texture2D(uWorldReliefMap, vWorldTopUv).r;
        vWorldTopMask = smoothstep(-0.04, 0.28, normal.y)
          * smoothstep(${(WORLD_WATER_LEVEL - 0.14).toFixed(2)}, ${(WORLD_WATER_LEVEL + 0.03).toFixed(2)}, position.y);
        float topFacing = smoothstep(0.12, 0.82, normal.y);
        float landRelief = smoothstep(${(WORLD_WATER_LEVEL + 0.015).toFixed(3)}, ${(WORLD_WATER_LEVEL + 0.28).toFixed(3)}, position.y);
        transformed.y += max(0.0, position.y - ${WORLD_WATER_LEVEL.toFixed(2)}) * 0.46 * topFacing;
        transformed.y += pow(max(vWorldRelief - 0.16, 0.0), 1.32) * 0.44 * topFacing * landRelief;
        vUndersidePosition = position;
      `);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D uWorldTopMap;\nuniform sampler2D uWorldReliefMap;\nuniform sampler2D uWorldUndersideMap;\nuniform float uWaterTime;\nvarying vec2 vWorldTopUv;\nvarying float vWorldTopMask;\nvarying float vWorldRelief;\nvarying vec3 vUndersidePosition;")
      .replace("#include <color_fragment>", `#include <color_fragment>
        vec3 worldTopColor = texture2D(uWorldTopMap, vWorldTopUv).rgb;
        vec3 worldUndersideColor = texture2D(uWorldUndersideMap, vWorldTopUv).rgb;
        float worldTopInk = smoothstep(0.018, 0.08, max(max(worldTopColor.r, worldTopColor.g), worldTopColor.b));
        float worldUndersideInk = smoothstep(0.012, 0.095, max(max(worldUndersideColor.r, worldUndersideColor.g), worldUndersideColor.b));
        float undersideMask = 1.0 - smoothstep(-0.08, 0.08, vUndersidePosition.y);
        float waterBlue = worldTopColor.b - max(worldTopColor.r * 0.86, worldTopColor.g * 0.72);
        float worldSeaMask = vWorldTopMask * worldTopInk
          * (1.0 - smoothstep(0.17, 0.31, vWorldRelief))
          * smoothstep(0.012, 0.11, waterBlue);
        diffuseColor.rgb = mix(diffuseColor.rgb, worldTopColor, vWorldTopMask * worldTopInk * 0.98);
        vec3 undersideStone = worldUndersideColor * vec3(0.56, 0.68, 0.78);
        diffuseColor.rgb = mix(diffuseColor.rgb, undersideStone, undersideMask * worldUndersideInk * 0.88);
        vec2 reliefTexel = vec2(0.00065104);
        float reliefLeft = texture2D(uWorldReliefMap, vWorldTopUv - vec2(reliefTexel.x, 0.0)).r;
        float reliefRight = texture2D(uWorldReliefMap, vWorldTopUv + vec2(reliefTexel.x, 0.0)).r;
        float reliefDown = texture2D(uWorldReliefMap, vWorldTopUv - vec2(0.0, reliefTexel.y)).r;
        float reliefUp = texture2D(uWorldReliefMap, vWorldTopUv + vec2(0.0, reliefTexel.y)).r;
        vec3 reliefNormal = normalize(vec3((reliefLeft - reliefRight) * 5.8, 0.42, (reliefDown - reliefUp) * 5.8));
        float reliefLight = clamp(dot(reliefNormal, normalize(vec3(-0.58, 0.72, 0.38))), 0.0, 1.0);
        float reliefShade = mix(0.66, 1.3, smoothstep(0.08, 0.92, reliefLight));
        float reliefStrength = vWorldTopMask * worldTopInk * smoothstep(0.1, 0.82, vWorldRelief) * (1.0 - worldSeaMask * 0.96);
        diffuseColor.rgb *= mix(1.0, reliefShade, reliefStrength * 0.72);
        vec2 waterUv = vWorldTopUv * 128.0;
        float rippleA = sin(dot(waterUv, vec2(0.96, 0.28)) + uWaterTime * 0.58);
        float rippleB = sin(dot(waterUv, vec2(-0.24, 1.08)) - uWaterTime * 0.74 + 1.7);
        float rippleC = sin(dot(waterUv, vec2(0.62, -0.78)) + uWaterTime * 0.43 + 4.1);
        float rippleCrest = smoothstep(1.18, 1.78, rippleA * 0.82 + rippleB * 0.62 + rippleC * 0.34);
        diffuseColor.rgb = mix(diffuseColor.rgb, worldTopColor * vec3(0.96, 0.99, 1.02), worldSeaMask * 0.18);
        diffuseColor.rgb += vec3(0.24, 0.48, 0.62) * rippleCrest * worldSeaMask * 0.045;
      `)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.22, worldSeaMask);
        roughnessFactor = mix(roughnessFactor, 0.8, undersideMask);
      `)
      .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 0.03, worldSeaMask);
        metalnessFactor = mix(metalnessFactor, 0.015, undersideMask);
      `);
  };
  epicWorld.add(
    epicUnderside,
    epicStalactites,
    epicIceWall,
    epicOcean,
    epicShallows,
    epicCliffs,
    epicContinents,
    epicCoastlines,
    epicRoutes,
    epicWaterfalls,
    epicWaterMist,
    epicTrees.trunks,
    epicTrees.crowns,
    epicLandmarks,
    epicCapitals.group,
    epicCityLights.points,
    epicBeacons.mesh,
    meshyWorld,
  );

  const aurora = createAuroraCurtains();
  epicWorld.add(aurora.group);
  const proceduralEpicGeography = [
    epicUnderside,
    epicStalactites,
    epicIceWall,
    epicShallows,
    epicCliffs,
    epicContinents,
    epicCoastlines,
    epicRoutes,
    epicTrees.trunks,
    epicTrees.crowns,
    epicLandmarks,
    epicCapitals.group,
    epicCityLights.points,
    epicBeacons.mesh,
  ];
  let meshyWorldLoaded = false;
  let meshyWorldLoadError = "";
  new GLTFLoader().load(
    "assets/world/celestial_world_runtime_tapered.glb?v=1",
    (gltf) => {
      gltf.scene.name = "Celestial world runtime mesh";
      gltf.scene.traverse((object) => {
        if (!object.isMesh) return;
        object.material = meshyWorldMaterial;
        object.castShadow = true;
        object.receiveShadow = true;
      });
      meshyWorld.add(gltf.scene);
      proceduralEpicGeography.forEach((object) => { object.visible = false; });
      meshyWorldLoaded = true;
      canvas.dataset.meshyWorld = "loaded";
    },
    undefined,
    (error) => {
      meshyWorldLoadError = String(error?.message || error || "unknown load error");
      canvas.dataset.meshyWorld = "procedural-fallback";
      console.warn("Optimized Verdigris world could not load; keeping procedural fallback.", error);
    },
  );

  const clouds = createCloudLayer();
  scene.add(clouds.group);
  const epicCloudWisps = createEpicCloudWisps(clouds.texture);
  const regionalWeather = createRegionalWeather(clouds.texture);
  const volumetricWeather = createVolumetricWeather();
  const regionalLightning = createRegionalLightning();
  const regionalSunshafts = createRegionalSunshafts();
  const spectacleHalos = createSpectacleHalos();
  const stormCrown = createStormCrown();
  const waterfallHalos = createWaterfallHalos();
  epicWorld.add(
    volumetricWeather.group,
    regionalLightning.group,
    regionalSunshafts.group,
    spectacleHalos.group,
    waterfallHalos.group,
  );
  const flock = createFlock();
  const lightning = createLightning();
  scene.add(flock, lightning);

  const hemisphere = new THREE.HemisphereLight(0x89b9bb, 0x161111, 0.92);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(0xffc27a, 4.5);
  sun.position.set(-9, 10.5, 7.5);
  sun.castShadow = true;
  sun.shadow.camera.left = -11;
  sun.shadow.camera.right = 11;
  sun.shadow.camera.top = 11;
  sun.shadow.camera.bottom = -11;
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 30;
  sun.shadow.bias = -0.00035;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x4a9fa4, 0.72);
  fill.position.set(-7, 5, -7);
  scene.add(fill);
  const spectacleRim = new THREE.DirectionalLight(0x75dfff, 2.15);
  spectacleRim.position.set(10, 2.8, -7);
  scene.add(spectacleRim);
  const regionalSunTarget = new THREE.Object3D();
  regionalSunTarget.position.set(-2.8, WORLD_WATER_LEVEL, 3.45);
  const regionalSun = new THREE.SpotLight(0xffd494, 6.4, 18, 0.42, 0.82, 1.15);
  regionalSun.position.set(-5.8, 9.2, 5.6);
  regionalSun.target = regionalSunTarget;
  epicWorld.add(regionalSun, regionalSunTarget);
  const regionalStormLights = [
    new THREE.PointLight(0xa6e8ff, 0, 7.5, 1.7),
    new THREE.PointLight(0x7cc8ff, 0, 6.5, 1.8),
  ];
  regionalStormLights[0].position.set(5.3, 2.25, 1.8);
  regionalStormLights[1].position.set(-2.55, 2.0, -2.1);
  epicWorld.add(...regionalStormLights);
  const abyssLight = new THREE.PointLight(0x49d6c8, 11, 13, 2);
  abyssLight.position.set(0, -4.4, 1.5);
  world.add(abyssLight);
  const crownLight = new THREE.PointLight(0x6fe0cc, 3.8, 6, 2);
  crownLight.position.copy(citadel.group.position).add(new THREE.Vector3(0, 2.5, 0));
  world.add(crownLight);
  const epicAbyssLight = new THREE.PointLight(0x5f9dff, 12, 19, 1.8);
  epicAbyssLight.position.set(0, -5.5, 0);
  const epicUnderfill = new THREE.DirectionalLight(0x5790a0, 1.75);
  epicUnderfill.position.set(-5, -11, 4);
  const epicUnderfillViolet = new THREE.DirectionalLight(0x6d5a8b, 0.65);
  epicUnderfillViolet.position.set(6, -8, -5);
  const epicFrontGlow = new THREE.PointLight(0x70dbe5, 5.8, 15, 1.75);
  epicFrontGlow.position.set(0, -1.8, 7.5);
  epicWorld.add(epicAbyssLight, epicUnderfill, epicUnderfillViolet, epicFrontGlow);
  const stormLight = new THREE.PointLight(0x74ded4, 0, 28, 1.4);
  stormLight.position.set(8, 6, -7);
  scene.add(stormLight);

  const profiles = {
    high: { dpr: 1.65, shadows: true, shadowSize: 2048, trees: 360, epicTrees: 860, epicLights: 96, motes: 320, clouds: 10, regionalWeather: 59, volumeSteps: 24, volumes: 7, auroraLayers: 3 },
    balanced: { dpr: 1.2, shadows: true, shadowSize: 1024, trees: 230, epicTrees: 620, epicLights: 72, motes: 200, clouds: 7, regionalWeather: 59, volumeSteps: 18, volumes: 6, auroraLayers: 2 },
    low: { dpr: 1, shadows: false, shadowSize: 512, trees: 120, epicTrees: 340, epicLights: 42, motes: 90, clouds: 4, regionalWeather: 30, volumeSteps: 11, volumes: 3, auroraLayers: 1 },
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
  const FIXED_VIEWS = {
    top: { offset: [0.02, 30, 0.02], fov: 33 },
    bottom: { offset: [0.02, -30, 0.02], fov: 33 },
    front: { offset: [0, -1.35, 29], fov: 33 },
    back: { offset: [0, -1.35, -29], fov: 33 },
    left: { offset: [-29, -1.35, 0], fov: 33 },
    right: { offset: [29, -1.35, 0], fov: 33 },
  };
  const cameraParam = new URLSearchParams(location.search).get("camera");
  let fixedViewName = Object.prototype.hasOwnProperty.call(FIXED_VIEWS, cameraParam || "") ? cameraParam : null;

  function poseFixedCamera(name) {
    const view = FIXED_VIEWS[name];
    if (!view) return false;
    const anchor = activeVariant === "epic" ? epicWorld : world;
    const anchorScale = anchor.scale.x;
    camera.position.set(
      anchor.position.x + view.offset[0] * anchorScale,
      anchor.position.y + view.offset[1] * anchorScale,
      anchor.position.z + view.offset[2] * anchorScale,
    );
    camera.fov = view.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(anchor.position.x, anchor.position.y - 1.3 * anchorScale, anchor.position.z);
    return true;
  }
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
    epicCityLights.points.geometry.setDrawRange(0, Math.min(profile.epicLights, epicCityLights.maxCount));
    volumetricWeather.volumes.forEach(({ mesh, material }, index) => {
      mesh.visible = index < profile.volumes;
      material.uniforms.uSteps.value = profile.volumeSteps;
    });
    aurora.materials.forEach((material) => {
      material.uniforms.uIntensity.value = activeQuality === "low" ? 0.78 : activeQuality === "balanced" ? 1.16 : 1.38;
    });
    aurora.meshes.forEach((mesh) => { mesh.visible = mesh.userData.layer < profile.auroraLayers; });
    motes.geometry.setDrawRange(0, profile.motes);
    for (let index = 0; index < clouds.sprites.length; index += 1) {
      clouds.sprites[index].visible = index < profile.clouds;
    }
    for (let index = 0; index < regionalWeather.sprites.length; index += 1) {
      regionalWeather.sprites[index].visible = index < profile.regionalWeather;
    }
    regionalSunshafts.group.visible = activeQuality === "high";
    regionalLightning.bolts.forEach((bolt, index) => { bolt.visible = activeQuality !== "low" || index === 0; });
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
        baseCamera.x = 10.8;
        baseCamera.y = 12.0;
        baseCamera.z = 18.5;
        baseCamera.tx = 0.25;
        baseCamera.ty = 1.05;
        baseCamera.tz = 0;
        baseCamera.fov = 48;
        epicWorld.position.set(0, 1.65, 0);
        epicWorld.scale.setScalar(0.96);
      } else if (aspect > 2) {
        baseCamera.x = 13.6;
        baseCamera.y = 11.5;
        baseCamera.z = 17.2;
        baseCamera.tx = 4.7;
        baseCamera.ty = 0.08;
        baseCamera.tz = -0.1;
        baseCamera.fov = 34;
        epicWorld.position.set(4.55, -0.2, 0);
        epicWorld.scale.setScalar(1.15);
      } else {
        baseCamera.x = 11.8;
        baseCamera.y = 9.25;
        baseCamera.z = 16.2;
        baseCamera.tx = 2.55;
        baseCamera.ty = 0.08;
        baseCamera.tz = -0.12;
        baseCamera.fov = 37;
        epicWorld.position.set(3.35, 0.18, 0);
        epicWorld.scale.setScalar(1.1);
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
    clouds.group.visible = !epicActive;
    volumetricWeather.group.visible = epicActive;
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
        cameraControl.pitchTarget = clamp(cameraControl.pitchTarget - dy * 0.00185, -0.78, 0.14);
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
    if (event.key === "ArrowUp") cameraControl.pitchTarget = clamp(cameraControl.pitchTarget + 0.035, -0.78, 0.14);
    if (event.key === "ArrowDown") cameraControl.pitchTarget = clamp(cameraControl.pitchTarget - 0.035, -0.78, 0.14);
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
    version: "verdigris-menu-2.6",
    quality: activeQuality,
    fps: 0,
    frameMs: 0,
    drawCalls: 0,
    triangles: 0,
    loopSeconds: LOOP_SECONDS,
    transferableBytes: 0,
    meshyWorldLoaded: false,
    meshyTextureLoaded: false,
    meshyWorldLoadError: "",
  };
  window.__VERDIGRIS_DEBUG__ = debug;
  debug.capture = (view = null, type = "image/jpeg", quality = 0.62) => {
    const previous = fixedViewName;
    if (view && FIXED_VIEWS[view]) fixedViewName = view;
    if (fixedViewName) {
      poseFixedCamera(fixedViewName);
    } else {
      camera.position.set(baseCamera.x, baseCamera.y, baseCamera.z);
      camera.fov = baseCamera.fov;
      camera.updateProjectionMatrix();
      camera.lookAt(baseCamera.tx, baseCamera.ty, baseCamera.tz);
    }
    renderer.render(scene, camera);
    const data = canvas.toDataURL(type, quality);
    fixedViewName = previous;
    return data;
  };

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
    const cameraPitch = clamp(basePitch + loopPitch + cameraControl.pitch - pointer.y * 0.004, -0.26, 1.18);
    const cameraDistance = baseDistance * clamp(1 + cameraControl.zoom, 0.78, 1.35);
    const cameraHorizontal = Math.cos(cameraPitch) * cameraDistance;
    camera.position.set(
      cameraTarget.x + Math.sin(cameraYaw) * cameraHorizontal,
      cameraTarget.y + Math.sin(cameraPitch) * cameraDistance,
      cameraTarget.z + Math.cos(cameraYaw) * cameraHorizontal,
    );
    camera.lookAt(cameraTarget);
    if (fixedViewName) poseFixedCamera(fixedViewName);

    world.rotation.y = -0.24 + (reducedMotion ? 0 : Math.sin(phase * TAU - 0.4) * 0.026);
    epicWorld.rotation.y = -0.105 + (reducedMotion ? 0 : Math.sin(phase * TAU - 0.25) * 0.018);
    waterMaterial.uniforms.uTime.value = time;
    waterMaterial.uniforms.uPulse.value = crownPulse;
    epicOceanMaterial.uniforms.uTime.value = time;
    epicOceanMaterial.uniforms.uPulse.value = crownPulse;
    if (meshyWorldShader) meshyWorldShader.uniforms.uWaterTime.value = time;
    epicCityLights.material.uniforms.uTime.value = time;
    epicCityLights.material.uniforms.uPulse.value = crownPulse;
    waterfallMaterial.uniforms.uTime.value = time;
    waterfallMaterial.uniforms.uPulse.value = crownPulse;
    waterMist.material.uniforms.uTime.value = time;
    epicWaterMist.material.uniforms.uTime.value = time;
    sky.material.uniforms.uTime.value = time;
    sky.material.uniforms.uStorm.value = Math.max(crownPulse, lightningPulse);
    aurora.materials.forEach((material) => { material.uniforms.uTime.value = time; });
    aurora.meshes.forEach((mesh) => {
      mesh.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.012 + mesh.userData.phase) * (0.012 + mesh.userData.layer * 0.006);
      mesh.position.y = reducedMotion ? 0 : Math.sin(time * 0.021 + mesh.userData.phase * 1.7) * 0.045;
    });
    volumetricWeather.volumes.forEach(({ mesh, material }, index) => {
      const base = mesh.userData.basePosition;
      const phaseOffset = mesh.userData.phase;
      mesh.position.x = base.x + (reducedMotion ? 0 : Math.sin(time * 0.018 + phaseOffset) * (index === 6 ? 0.32 : 0.12));
      mesh.position.z = base.z + (reducedMotion ? 0 : Math.cos(time * 0.014 + phaseOffset * 1.3) * (index === 6 ? 0.16 : 0.08));
      material.uniforms.uTime.value = reducedMotion ? 7.0 : time;
      mesh.updateWorldMatrix(true, false);
      mesh.worldToLocal(material.uniforms.uCameraLocal.value.copy(camera.position));
    });
    motes.material.uniforms.uTime.value = time;

    for (let index = 0; index < clouds.sprites.length; index += 1) {
      const sprite = clouds.sprites[index];
      const drift = (time * sprite.userData.speed) % 30;
      sprite.position.x = sprite.userData.baseX + drift;
      if (sprite.position.x > 17) sprite.position.x -= 30;
    }

    for (let index = 0; index < regionalWeather.sprites.length; index += 1) {
      const sprite = regionalWeather.sprites[index];
      const localTime = time * sprite.userData.speed + sprite.userData.phase;
      const stormDrift = sprite.userData.region === 0 ? 0.48 : sprite.userData.region === 4 ? 0.14 : 0.28;
      sprite.position.x = sprite.userData.baseX + Math.sin(localTime) * stormDrift;
      sprite.position.z = sprite.userData.baseZ + Math.cos(localTime * 0.78) * stormDrift * 0.56;
      sprite.position.y = sprite.userData.baseY + Math.sin(localTime * 1.34) * (sprite.userData.region === 4 ? 0.055 : 0.11);
    }
    regionalWeather.materials[0].opacity = 0.28 + Math.sin(time * 0.11) * 0.025;
    regionalWeather.materials[2].opacity = 0.12 + Math.sin(time * 0.075 + 1.2) * 0.015;
    regionalWeather.rimMistMaterial.opacity = 0.17 + Math.sin(time * 0.09) * 0.018;
    regionalSunshafts.material.opacity = 0.017 + Math.sin(time * 0.12 + 0.8) * 0.005;
    regionalWeather.group.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.026) * 0.045;
    regionalLightning.group.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.037 - 0.7) * 0.11;
    aurora.group.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.018) * 0.035;

    let localStormPulseA = 0;
    let localStormPulseB = 0;
    regionalLightning.bolts.forEach((bolt) => {
      const fastStormPhase = (phase * 3 + bolt.userData.storm * 0.17) % 1;
      const previewFlash = previewMoment && bolt.userData.storm === 2 ? 0.92 : 0;
      const firstFlash = reducedMotion ? 0 : pulseAt(fastStormPhase, bolt.userData.phase, 0.008);
      const echoFlash = reducedMotion ? 0 : pulseAt(fastStormPhase, (bolt.userData.phase + 0.025) % 1, 0.005) * 0.72;
      const boltPulse = clamp(firstFlash + echoFlash + previewFlash);
      bolt.material.opacity = boltPulse * 0.98 * bolt.userData.energy;
      if (bolt.userData.storm < 2) localStormPulseA = Math.max(localStormPulseA, boltPulse);
      else localStormPulseB = Math.max(localStormPulseB, boltPulse);
    });
    regionalStormLights[0].intensity = localStormPulseA * 18;
    regionalStormLights[1].intensity = localStormPulseB * 15;
    regionalSun.intensity = 7.4 + Math.sin(time * 0.095) * 1.25;
    spectacleHalos.sun.material.opacity = 0.62 + Math.sin(time * 0.13) * 0.1;
    spectacleHalos.sunBreak.material.opacity = 0.11 + Math.sin(time * 0.095 + 0.8) * 0.035;
    spectacleHalos.storm.material.opacity = 0.12 + Math.max(localStormPulseA, localStormPulseB) * 0.46;
    spectacleHalos.abyss.material.opacity = 0.3 + crownPulse * 0.22 + Math.sin(time * 0.2) * 0.035;
    waterfallHalos.material.opacity = 0.38 + Math.sin(time * 0.24) * 0.09 + crownPulse * 0.12;
    stormCrown.group.rotation.y = reducedMotion ? 0 : time * 0.04;
    stormCrown.rings.forEach((ring, index) => {
      ring.rotation.z = (index % 2 ? -1 : 1) * time * (0.018 + index * 0.006);
      ring.material.opacity = 0.04 + Math.sin(time * 0.12 + index) * 0.012 + localStormPulseA * 0.08;
    });
    renderer.toneMappingExposure = 1.04 + localStormPulseA * 0.12 + localStormPulseB * 0.09 + crownPulse * 0.025;

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
    const veinShader = epicUndersideMaterial.userData.shader;
    if (veinShader) {
      veinShader.uniforms.uVeinTime.value = time;
      veinShader.uniforms.uVeinPulse.value = crownPulse;
    }
    epicAbyssLight.intensity = 5.4 + crownPulse * 5.2;
    epicShallowsMaterial.opacity = 0.3 + crownPulse * 0.1;
    epicBeacons.mesh.visible = !meshyWorldLoaded && crownPulse > 0.11 && !reducedMotion;
    epicBeacons.material.opacity = crownPulse * 0.155;
    epicCloudWisps.position.x = reducedMotion ? 0 : Math.sin(time * 0.042) * 0.22;
    epicCloudWisps.position.z = reducedMotion ? 0 : Math.cos(time * 0.034) * 0.12;
    sun.intensity = 4.4 + crownPulse * 0.55;

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
      debug.meshyWorldLoaded = meshyWorldLoaded;
      debug.meshyWorldLoadError = meshyWorldLoadError;
      debug.meshyTextureLoaded = meshyTextureLoaded;
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
    regionalWeather.texture.dispose();
    spectacleHalos.texture.dispose();
    waterfallHalos.texture.dispose();
    meshyTopTexture.dispose();
    meshyReliefTexture.dispose();
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
