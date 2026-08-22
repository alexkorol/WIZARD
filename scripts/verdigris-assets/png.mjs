import zlib from 'node:zlib';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const COLOR_TYPE_GRAY = 0;
const COLOR_TYPE_RGB = 2;
const COLOR_TYPE_RGBA = 6;

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let crc = -1;
  for (let i = 0; i < buffer.length; i++) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

function readChunk(buffer, offset) {
  const length = buffer.readUInt32BE(offset);
  const type = buffer.toString('ascii', offset + 4, offset + 8);
  const data = buffer.subarray(offset + 8, offset + 8 + length);
  const expectedCrc = buffer.readUInt32BE(offset + 8 + length);
  if (crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])) !== expectedCrc) {
    throw new Error(`PNG chunk ${type} has a bad checksum`);
  }
  return { type, data, next: offset + 12 + length };
}

export function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('not a PNG file (bad signature)');
  }
  let offset = 8;
  let ihdr = null;
  let palette = null;
  const idat = [];
  while (offset < buffer.length) {
    const chunk = readChunk(buffer, offset);
    if (chunk.type === 'IHDR') {
      ihdr = {
        width: chunk.data.readUInt32BE(0),
        height: chunk.data.readUInt32BE(4),
        bitDepth: chunk.data[8],
        colorType: chunk.data[9],
        interlace: chunk.data[12],
      };
    } else if (chunk.type === 'PLTE') {
      palette = chunk.data;
    } else if (chunk.type === 'IDAT') {
      idat.push(chunk.data);
    } else if (chunk.type === 'IEND') {
      break;
    }
    offset = chunk.next;
  }
  if (!ihdr) throw new Error('PNG is missing IHDR');
  if (ihdr.bitDepth !== 8) throw new Error(`unsupported PNG bit depth ${ihdr.bitDepth} (only 8 supported)`);
  if (ihdr.interlace !== 0) throw new Error('interlaced PNG is not supported');
  if (![COLOR_TYPE_GRAY, COLOR_TYPE_RGB, COLOR_TYPE_RGBA].includes(ihdr.colorType)) {
    throw new Error(`unsupported PNG color type ${ihdr.colorType}`);
  }
  if (!palette === undefined && ihdr.colorType === 3) throw new Error('palettized PNG is not supported');

  const channels = ihdr.colorType === COLOR_TYPE_RGBA ? 4 : ihdr.colorType === COLOR_TYPE_RGB ? 3 : 1;
  const stride = ihdr.width * channels;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const expectedSize = (stride + 1) * ihdr.height;
  if (raw.length !== expectedSize) {
    throw new Error(`PNG decompressed size ${raw.length} does not match ${expectedSize}`);
  }

  const pixels = Buffer.alloc(ihdr.width * ihdr.height * 4);
  let previous = Buffer.alloc(stride);
  for (let y = 0; y < ihdr.height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const current = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? current[x - channels] : 0;
      const up = previous[x];
      const upLeft = x >= channels ? previous[x - channels] : 0;
      switch (filter) {
        case 0: current[x] = line[x]; break;
        case 1: current[x] = (line[x] + left) & 0xff; break;
        case 2: current[x] = (line[x] + up) & 0xff; break;
        case 3: current[x] = (line[x] + ((left + up) >> 1)) & 0xff; break;
        case 4: {
          const p = left + up - upLeft;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - upLeft);
          const predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
          current[x] = (line[x] + predictor) & 0xff;
          break;
        }
        default: throw new Error(`unknown PNG filter ${filter}`);
      }
    }
    for (let x = 0; x < ihdr.width; x++) {
      const target = (y * ihdr.width + x) * 4;
      const source = x * channels;
      if (channels === 4) {
        pixels[target] = current[source];
        pixels[target + 1] = current[source + 1];
        pixels[target + 2] = current[source + 2];
        pixels[target + 3] = current[source + 3];
      } else if (channels === 3) {
        pixels[target] = current[source];
        pixels[target + 1] = current[source + 1];
        pixels[target + 2] = current[source + 2];
        pixels[target + 3] = 255;
      } else {
        pixels[target] = current[source];
        pixels[target + 1] = current[source];
        pixels[target + 2] = current[source];
        pixels[target + 3] = 255;
      }
    }
    previous = current;
  }
  return { width: ihdr.width, height: ihdr.height, pixels };
}

function chunk(type, data) {
  const buffer = Buffer.alloc(12 + data.length);
  buffer.writeUInt32BE(data.length, 0);
  buffer.write(type, 4, 'ascii');
  data.copy(buffer, 8);
  buffer.writeUInt32BE(crc32(buffer.subarray(4, 8 + data.length)), 8 + data.length);
  return buffer;
}

export function encodePng(width, height, rgbaPixels) {
  const expected = width * height * 4;
  if (rgbaPixels.length !== expected) {
    throw new Error(`pixel buffer is ${rgbaPixels.length} bytes, expected ${expected}`);
  }
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgbaPixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = COLOR_TYPE_RGBA;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    PNG_SIGNATURE,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
