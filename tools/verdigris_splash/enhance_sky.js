import * as THREE from "three";

const TAU = Math.PI * 2;

export const GALAXY_NORMAL = new THREE.Vector3(0.52, 0.78, -0.35).normalize();

const STAR_LAYERS = [
  { count: 2400, size: 0.05, opacity: 0.8 },
  { count: 700, size: 0.09, opacity: 0.9 },
  { count: 140, size: 0.17, opacity: 1.0, additive: true },
];

const SKY_VERTEX_SHADER = `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uStorm;
  varying vec3 vDirection;

  const vec3 GALAXY_N = vec3(0.519662, 0.779493, -0.349773);
  const vec3 SUN_DIR = vec3(-0.740734, 0.308639, -0.596703);
  const vec3 MOON_DIR = vec3(-0.643890, 0.527989, -0.553745);

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 cell = floor(p);
    vec2 fade = fract(p);
    vec2 ease = fade * fade * (3.0 - 2.0 * fade);
    float cornerA = hash21(cell);
    float cornerB = hash21(cell + vec2(1.0, 0.0));
    float cornerC = hash21(cell + vec2(0.0, 1.0));
    float cornerD = hash21(cell + vec2(1.0, 1.0));
    return mix(mix(cornerA, cornerB, ease.x), mix(cornerC, cornerD, ease.x), ease.y) * 2.0 - 1.0;
  }

  float fbm2(vec2 p) {
    return valueNoise(p) * 0.62 + valueNoise(p * 2.3 + vec2(19.19, -7.71)) * 0.38;
  }

  void main() {
    vec3 d = normalize(vDirection);
    float horizon = pow(1.0 - abs(d.y), 3.5);
    float up = clamp(d.y, 0.0, 1.0);
    vec3 color = mix(vec3(0.030, 0.075, 0.150), vec3(0.010, 0.020, 0.048), pow(up, 0.65));
    color += horizon * vec3(0.03, 0.09, 0.10);

    vec3 galaxyTangentU = normalize(cross(GALAXY_N, vec3(0.0, 1.0, 0.0)));
    vec3 galaxyTangentV = cross(GALAXY_N, galaxyTangentU);
    vec2 galaxyUv = vec2(dot(d, galaxyTangentU), dot(d, galaxyTangentV));
    float bandDistance = dot(d, GALAXY_N);
    float drift = uTime * 0.004;
    float dust = fbm2(galaxyUv * 5.0 + vec2(drift, drift * 0.6));
    float lane = 0.35 + clamp(dust * 0.5 + 0.5, 0.0, 1.0) * 0.95;
    float warmNoise = clamp(fbm2(galaxyUv * 3.1 + vec2(41.37, 13.71)) * 0.5 + 0.5, 0.0, 1.0);
    float core = exp(-bandDistance * bandDistance / 0.0196) * lane;
    float envelope = exp(-bandDistance * bandDistance / 0.1156) * 0.45;
    float galaxyFade = smoothstep(-0.15, 0.06, d.y);
    vec3 coreColor = mix(vec3(0.55, 0.62, 0.85), vec3(0.80, 0.66, 0.50), warmNoise);
    color += (coreColor * core * 0.55 + vec3(0.10, 0.06, 0.22) * envelope) * galaxyFade;

    float sunCos = dot(d, SUN_DIR);
    vec3 sunTangentU = normalize(cross(SUN_DIR, vec3(0.0, 1.0, 0.0)));
    vec3 sunTangentV = cross(SUN_DIR, sunTangentU);
    float sunAzimuth = atan(dot(d, sunTangentV), dot(d, sunTangentU) + 0.000001);
    float rayShape = pow(max(sin(sunAzimuth * 7.0 + sin(sunAzimuth * 3.0) * 1.4) * 0.5 + 0.5, 0.0), 7.0);
    float rayFalloff = exp((sunCos - 1.0) * 240.0);
    color += vec3(1.0, 0.62, 0.30) * rayShape * rayFalloff * 0.055;
    color += pow(max(sunCos, 0.0), 180.0) * vec3(0.55, 0.28, 0.12);
    color += pow(max(sunCos, 0.0), 24.0) * vec3(0.16, 0.08, 0.04);

    float moonCos = dot(d, MOON_DIR);
    float moonDiscMask = smoothstep(0.999763, 0.999902, moonCos);
    vec3 moonOffset = d - MOON_DIR * moonCos;
    vec3 moonLimbDir = moonOffset / max(length(moonOffset), 0.0001);
    float moonLitRaw = dot(moonLimbDir, SUN_DIR);
    float moonShade = clamp(moonLitRaw * 0.5 + 0.5, 0.0, 1.0);
    float terminator = 1.0 - smoothstep(-0.12, 0.18, moonLitRaw);
    vec3 moonBody = vec3(0.30, 0.16, 0.11) * (0.55 + moonShade * 0.8) * mix(1.0, 0.58, terminator);
    color += pow(max(moonCos, 0.0), 420.0) * vec3(0.20, 0.10, 0.06);
    color = mix(color, moonBody, moonDiscMask);

    float eclipseDisc = smoothstep(0.99854, 0.99905, sunCos);
    color *= 1.0 - eclipseDisc;
    float coronaRing = smoothstep(0.99732, 0.99820, sunCos) * (1.0 - smoothstep(0.99872, 0.99905, sunCos));
    color += vec3(1.0, 0.72, 0.38) * coronaRing * 2.2;

    color += vec3(0.10, 0.30, 0.30) * uStorm * horizon * 0.3;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const STAR_VERTEX_SHADER = `
  uniform float uSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (1200.0 / max(-viewPosition.z, 1.0));
    vColor = aColor;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const STAR_FRAGMENT_SHADER = `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = (1.0 - smoothstep(0.16, 0.5, dist)) * uOpacity;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function createSky() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(46, 48, 28),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uStorm: { value: 0 },
      },
      vertexShader: SKY_VERTEX_SHADER,
      fragmentShader: SKY_FRAGMENT_SHADER,
    }),
  );
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleStarPosition(random, normal) {
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const height = random() * 2 - 1;
    const angle = random() * TAU;
    const radial = Math.sqrt(Math.max(0, 1 - height * height));
    const radius = 40 + random() * 4;
    let x = radial * Math.cos(angle) * radius;
    let y = height * radius;
    let z = radial * Math.sin(angle) * radius;
    if (y <= -3) continue;
    if (random() < 0.38) {
      const pull = 0.85 + random() * 0.12;
      const along = (x * normal.x + y * normal.y + z * normal.z) * pull;
      x -= normal.x * along;
      y -= normal.y * along;
      z -= normal.z * along;
      const scale = (40 + random() * 4) / (Math.hypot(x, y, z) || 1);
      x *= scale;
      y *= scale;
      z *= scale;
      if (y <= -3) continue;
    }
    return [x, y, z];
  }
  return [0, 42, 0];
}

export function createStars(galaxyNormal) {
  const random = mulberry32(90417);
  const normal = (galaxyNormal || GALAXY_NORMAL).clone().normalize();
  const group = new THREE.Group();
  group.name = "Enhanced starfield";
  STAR_LAYERS.forEach((layer) => {
    const positions = new Float32Array(layer.count * 3);
    const colors = new Float32Array(layer.count * 3);
    for (let index = 0; index < layer.count; index += 1) {
      const [x, y, z] = sampleStarPosition(random, normal);
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
      const roll = random();
      const tint = roll < 0.55 ? [1, 1, 1] : roll < 0.85 ? [0.72, 0.83, 1] : [1, 0.87, 0.72];
      const brightness = 0.7 + random() * 0.3;
      colors[index * 3] = tint[0] * brightness;
      colors[index * 3 + 1] = tint[1] * brightness;
      colors[index * 3 + 2] = tint[2] * brightness;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(geometry, new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: layer.size },
        uOpacity: { value: layer.opacity },
      },
      vertexShader: STAR_VERTEX_SHADER,
      fragmentShader: STAR_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      fog: false,
      blending: layer.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    points.renderOrder = 1;
    group.add(points);
  });
  return group;
}
