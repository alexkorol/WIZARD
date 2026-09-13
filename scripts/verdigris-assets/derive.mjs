export function luminanceMap(image) {
  const { width, height, pixels } = image;
  const out = new Float64Array(width * height);
  for (let i = 0; i < width * height; i++) {
    out[i] = 0.2126 * pixels[i * 4] + 0.7152 * pixels[i * 4 + 1] + 0.0722 * pixels[i * 4 + 2];
  }
  return out;
}

function clamp255(value) {
  return value < 0 ? 0 : value > 255 ? 255 : Math.round(value);
}

function grayscaleImage(width, height, values) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const v = clamp255(values[i]);
    pixels[i * 4] = v;
    pixels[i * 4 + 1] = v;
    pixels[i * 4 + 2] = v;
    pixels[i * 4 + 3] = 255;
  }
  return { width, height, pixels };
}

function sobelMagnitude(values, width, height) {
  const out = new Float64Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const at = (yy, xx) => values[Math.min(height - 1, Math.max(0, yy)) * width + Math.min(width - 1, Math.max(0, xx))];
      const gx =
        -at(y - 1, x - 1) - 2 * at(y, x - 1) - at(y + 1, x - 1) +
        at(y - 1, x + 1) + 2 * at(y, x + 1) + at(y + 1, x + 1);
      const gy =
        -at(y - 1, x - 1) - 2 * at(y - 1, x) - at(y - 1, x + 1) +
        at(y + 1, x - 1) + 2 * at(y + 1, x) + at(y + 1, x + 1);
      out[y * width + x] = Math.sqrt(gx * gx + gy * gy) / 4;
    }
  }
  return out;
}

const DERIVERS = {
  alpha: image => {
    const { width, height, pixels } = image;
    return grayscaleImage(width, height, Array.from({ length: width * height }, (_, i) => pixels[i * 4 + 3]));
  },
  edge: image => {
    const { width, height } = image;
    return grayscaleImage(width, height, sobelMagnitude(luminanceMap(image), width, height));
  },
  height: image => {
    const luma = luminanceMap(image);
    return grayscaleImage(image.width, image.height, luma);
  },
  depth: image => {
    const luma = luminanceMap(image);
    return grayscaleImage(image.width, image.height, Array.from(luma, v => 255 - v));
  },
  'roughness-source': image => {
    const { width, height, pixels } = image;
    const luma = luminanceMap(image);
    return grayscaleImage(
      width,
      height,
      Array.from({ length: width * height }, (_, i) => (luma[i] * pixels[i * 4 + 3]) / 255)
    );
  },
};

export function deriveImage(role, image) {
  const deriver = DERIVERS[role];
  if (!deriver) throw new Error(`no deterministic deriver for role "${role}"`);
  return deriver(image);
}

export function composeContactSheet(images, columns) {
  const cellWidth = Math.max(...images.map(image => image.width));
  const cellHeight = Math.max(...images.map(image => image.height));
  const rows = Math.ceil(images.length / columns);
  const sheet = Buffer.alloc(cellWidth * columns * cellHeight * rows * 4, 0xff);
  images.forEach((image, index) => {
    const ox = (index % columns) * cellWidth;
    const oy = Math.floor(index / columns) * cellHeight;
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const source = (y * image.width + x) * 4;
        const target = ((oy + y) * cellWidth * columns + ox + x) * 4;
        sheet[target] = image.pixels[source];
        sheet[target + 1] = image.pixels[source + 1];
        sheet[target + 2] = image.pixels[source + 2];
        sheet[target + 3] = image.pixels[source + 3];
      }
    }
  });
  return { width: cellWidth * columns, height: cellHeight * rows, pixels: sheet };
}
