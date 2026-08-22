import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('./fixtures/', import.meta.url));
const WIDTH = 128;
const HEIGHT = 128;
const SLICE = [24, 24, 24, 24];
const CONTENT = [30, 30, 30, 30];

const STATE_COLORS = {
  default: [127, 111, 73],
  hover: [169, 142, 75],
  focus: [70, 151, 137],
  active: [173, 103, 56],
  disabled: [83, 81, 75]
};

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const size = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([size, typeBytes, data, checksum]);
}

function makeFramePng(stateName) {
  const [baseR, baseG, baseB] = STATE_COLORS[stateName];
  const raw = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    const row = y * (WIDTH * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < WIDTH; x += 1) {
      const pixel = row + 1 + x * 4;
      const edge = Math.min(x, y, WIDTH - 1 - x, HEIGHT - 1 - y);
      const clippedCorner = (x + y < 11)
        || (WIDTH - 1 - x + y < 11)
        || (x + HEIGHT - 1 - y < 11)
        || (WIDTH - 1 - x + HEIGHT - 1 - y < 11);
      if (edge >= 24 || clippedCorner) {
        raw[pixel + 3] = 0;
        continue;
      }
      const bevel = edge < 3 ? 0.55 : edge > 20 ? 1.22 : 0.82 + ((x * 13 + y * 7) % 11) / 42;
      const rivet = ((x - 15) ** 2 + (y - 15) ** 2 < 12)
        || ((x - 112) ** 2 + (y - 15) ** 2 < 12)
        || ((x - 15) ** 2 + (y - 112) ** 2 < 12)
        || ((x - 112) ** 2 + (y - 112) ** 2 < 12);
      raw[pixel] = Math.min(255, Math.round((rivet ? 190 : baseR) * bevel));
      raw[pixel + 1] = Math.min(255, Math.round((rivet ? 171 : baseG) * bevel));
      raw[pixel + 2] = Math.min(255, Math.round((rivet ? 102 : baseB) * bevel));
      raw[pixel + 3] = stateName === 'disabled' ? 166 : 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function hash(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function asset(bytes, stateName, overrides = {}) {
  return {
    file: `panel-${stateName}.png`,
    width: WIDTH,
    height: HEIGHT,
    sha256: hash(bytes),
    hasAlpha: true,
    ...overrides
  };
}

function manifestFor(fixtureName, images) {
  const states = Object.fromEntries(Object.entries(images).map(([stateName, bytes]) => [stateName, asset(bytes, stateName)]));
  const manifest = {
    schemaVersion: 1,
    id: `gallery-${fixtureName}`,
    title: `Gallery ${fixtureName.replaceAll('-', ' ')}`,
    assetRoot: `assets/verdigris-ui/framepacks/gallery-${fixtureName}`,
    provenance: 'Deterministic local framepack-gallery fixture; no generated art.',
    components: [{ id: 'panel', slice: SLICE, contentInsets: CONTENT, edgeMode: 'stretch', states }]
  };
  if (fixtureName === 'slice-overflow') manifest.components[0].slice = [24, 70, 24, 70];
  if (fixtureName === 'bad-checksum') manifest.components[0].states.default.sha256 = '0'.repeat(64);
  if (fixtureName === 'missing-alpha') delete manifest.components[0].states.default.hasAlpha;
  return manifest;
}

export function buildFixtureFiles() {
  const allImages = Object.fromEntries(Object.keys(STATE_COLORS).map((stateName) => [stateName, makeFramePng(stateName)]));
  const fixtures = {
    valid: allImages,
    'slice-overflow': { default: allImages.default },
    'bad-checksum': { default: allImages.default },
    'missing-alpha': { default: allImages.default }
  };
  const files = new Map();
  for (const [fixtureName, images] of Object.entries(fixtures)) {
    const manifest = manifestFor(fixtureName, images);
    files.set(path.join(fixtureName, 'framepack.json'), Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`));
    for (const [stateName, bytes] of Object.entries(images)) {
      files.set(path.join(
        fixtureName,
        'assets',
        'verdigris-ui',
        'framepacks',
        `gallery-${fixtureName}`,
        `panel-${stateName}.png`
      ), bytes);
    }
  }
  return files;
}

export async function checkFixtures() {
  const problems = [];
  for (const [relativePath, expected] of buildFixtureFiles()) {
    try {
      const actual = await readFile(path.join(ROOT, relativePath));
      if (!actual.equals(expected)) problems.push(`${relativePath}: generated bytes differ`);
    } catch (error) {
      problems.push(`${relativePath}: ${error.code === 'ENOENT' ? 'missing' : error.message}`);
    }
  }
  return problems;
}

export async function writeFixtures() {
  for (const [relativePath, bytes] of buildFixtureFiles()) {
    const target = path.join(ROOT, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--check')) {
    const problems = await checkFixtures();
    if (problems.length) {
      console.error(problems.join('\n'));
      process.exitCode = 1;
    } else {
      console.log(`ok deterministic fixtures (${buildFixtureFiles().size} files)`);
    }
  } else {
    await writeFixtures();
    console.log(`wrote deterministic fixtures (${buildFixtureFiles().size} files)`);
  }
}
