import * as THREE from "three";

const TAU = Math.PI * 2;

// mulberry32 — tiny seeded PRNG so the whole bank is deterministic.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRimCloudBank({
  texture,
  WORLD_RX = 7.4,
  WORLD_RZ = 7.4,
  count = 26,
  seed = 55013,
} = {}) {
  const rand = mulberry32(seed);
  const group = new THREE.Group();
  group.name = "Rim cloud bank";

  for (let i = 0; i < count; i++) {
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xe4eeea,
      transparent: true,
      depthWrite: false,
      fog: false,
      opacity: 0.14 + rand() * 0.16,
    });
    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 8;

    const baseAngle = (i / count) * TAU + (rand() - 0.5) * 0.22;
    const radiusFactor = 1.06 + rand() * 0.16;
    const baseY = -1.15 + Math.pow(rand(), 1.6) * 2.5;
    const width = 2.2 + rand() * 2.4;
    sprite.scale.set(width, width * (0.24 + rand() * 0.14), 1);

    sprite.userData = {
      baseAngle,
      radiusFactor,
      baseY,
      bobPhase: rand() * TAU,
      bobSpeed: 0.02 + rand() * 0.03,
      drift: 0.0025 + rand() * 0.0045,
    };

    sprite.position.set(
      Math.cos(baseAngle) * radiusFactor * WORLD_RX,
      baseY,
      Math.sin(baseAngle) * radiusFactor * WORLD_RZ,
    );
    group.add(sprite);
  }

  function update(time, reducedMotion) {
    if (reducedMotion) return;
    group.rotation.y = time * 0.006;
    for (const sprite of group.children) {
      const u = sprite.userData;
      const angle = u.baseAngle + time * u.drift;
      sprite.position.x = Math.cos(angle) * u.radiusFactor * WORLD_RX;
      sprite.position.z = Math.sin(angle) * u.radiusFactor * WORLD_RZ;
      sprite.position.y =
        u.baseY + Math.sin(time * u.bobSpeed * TAU + u.bobPhase) * 0.07;
    }
  }

  return { group, update };
}
