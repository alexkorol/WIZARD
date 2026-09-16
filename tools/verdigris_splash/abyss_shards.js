import * as THREE from "three";

const TAU = Math.PI * 2;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const range = (rng, min, max) => min + rng() * (max - min);

const EMBER_VERT = /* glsl */ `
attribute vec3 aData;
uniform float uTime;
varying float vAlpha;
varying float vHeat;
void main() {
  float life = fract(aData.x + uTime * aData.y * 0.16);
  vec3 p = position;
  p.y += life * 2.6;
  float sway = sin(cos(aData.z + uTime * 0.5)) * 0.18 * life;
  p.x += sway;
  p.z += sway;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (2.0 + aData.y * 160.0) * (95.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = (1.0 - life) * smoothstep(0.0, 0.12, life) * 0.85;
  vHeat = life;
}
`;

const EMBER_FRAG = /* glsl */ `
varying float vAlpha;
varying float vHeat;
void main() {
  float mask = smoothstep(0.5, 0.06, distance(gl_PointCoord, vec2(0.5)));
  vec3 heat = mix(vec3(1.0, 0.62, 0.26), vec3(1.0, 0.86, 0.55), vHeat);
  gl_FragColor = vec4(heat, mask * vAlpha);
}
`;

export function createAbyssShards({ glowTexture = null, count = 16, embers = 36, seed = 77701 } = {}) {
  const rng = mulberry32(seed);
  const group = new THREE.Group();
  group.name = "Abyss shards";

  const dummy = new THREE.Object3D();
  const euler = new THREE.Euler();

  const rocks = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(0.34, 0),
    new THREE.MeshStandardMaterial({ color: 0x33363b, roughness: 0.93, metalness: 0.02, flatShading: true }),
    count
  );

  const baseAngles = [];
  const baseRadii = [];
  const baseYs = [];
  const baseScales = [];
  const baseQuats = [];

  for (let i = 0; i < count; i++) {
    const angle = rng() * TAU;
    const radius = range(rng, 1.6, 6.8);
    const y = range(rng, -5.4, -2.4);
    const sx = range(rng, 0.5, 1.6);
    const sy = range(rng, 0.45, 1.3);
    const sz = range(rng, 0.5, 1.6);
    const quat = new THREE.Quaternion().setFromEuler(euler.set(rng() * TAU, rng() * TAU, rng() * TAU));
    dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    dummy.quaternion.copy(quat);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    rocks.setMatrixAt(i, dummy.matrix);
    baseAngles.push(angle);
    baseRadii.push(radius);
    baseYs.push(y);
    baseScales.push([sx, sy, sz]);
    baseQuats.push(quat.clone());
  }
  rocks.instanceMatrix.needsUpdate = true;
  group.add(rocks);

  const emberPos = new Float32Array(embers * 3);
  const emberData = new Float32Array(embers * 3);
  for (let i = 0; i < embers; i++) {
    const angle = rng() * TAU;
    const radius = range(rng, 1.6, 6.8);
    emberPos[i * 3] = Math.cos(angle) * radius;
    emberPos[i * 3 + 1] = range(rng, -5.2, -1.6);
    emberPos[i * 3 + 2] = Math.sin(angle) * radius;
    emberData[i * 3] = rng();
    emberData[i * 3 + 1] = range(rng, 0.010, 0.028);
    emberData[i * 3 + 2] = rng() * TAU;
  }
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
  emberGeo.setAttribute("aData", new THREE.BufferAttribute(emberData, 3));
  const emberMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: EMBER_VERT,
    fragmentShader: EMBER_FRAG,
  });
  const emberPoints = new THREE.Points(emberGeo, emberMat);
  emberPoints.frustumCulled = false;
  group.add(emberPoints);

  if (count > 0) {
    const crystalGeo = new THREE.OctahedronGeometry(0.07);
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0xff9a4d });
    const used = new Set();
    for (let i = 0; i < 6 && used.size < count; i++) {
      let pick = Math.floor(rng() * count);
      while (used.has(pick)) pick = (pick + 1) % count;
      used.add(pick);
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(
        Math.cos(baseAngles[pick]) * baseRadii[pick],
        baseYs[pick],
        Math.sin(baseAngles[pick]) * baseRadii[pick]
      );
      crystal.quaternion.copy(baseQuats[pick]);
      crystal.position.add(
        new THREE.Vector3(0, 0.34 * baseScales[pick][1], 0).applyQuaternion(baseQuats[pick])
      );
      group.add(crystal);
    }
  }

  function update(time, reducedMotion) {
    if (reducedMotion) return;
    group.rotation.y = -time * 0.01;
    group.position.y = Math.sin(time * 0.11) * 0.06;
    emberMat.uniforms.uTime.value = time;
  }

  return { group, update };
}
