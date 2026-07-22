const fs = require("node:fs/promises");
const path = require("node:path");

const sharp = require(process.env.CODEX_SHARP_PATH || "sharp");

const GRID = 4;
const SOURCE_SIZE = 1536;
const SOURCE_CORE = SOURCE_SIZE / GRID;
const SOURCE_OVERLAP = 48;
const SOURCE_TILE = SOURCE_CORE + SOURCE_OVERLAP * 2;
const DETAIL_TILE = 1024;
const OUTPUT_SIZE = 4096;

function tileName(prefix, row, column) {
  return `${prefix}_r${row}_c${column}.png`;
}

async function cropTiles(sourcePath, outputDirectory) {
  await fs.mkdir(outputDirectory, { recursive: true });
  const metadata = await sharp(sourcePath).metadata();
  const padded = await sharp(sourcePath)
    .resize(SOURCE_SIZE, SOURCE_SIZE, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .extend({
      top: SOURCE_OVERLAP,
      bottom: SOURCE_OVERLAP,
      left: SOURCE_OVERLAP,
      right: SOURCE_OVERLAP,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .png()
    .toBuffer();

  const manifest = [];
  for (let row = 0; row < GRID; row += 1) {
    for (let column = 0; column < GRID; column += 1) {
      const outputPath = path.join(outputDirectory, tileName("source", row, column));
      await sharp(padded)
        .extract({
          left: column * SOURCE_CORE,
          top: row * SOURCE_CORE,
          width: SOURCE_TILE,
          height: SOURCE_TILE,
        })
        .resize(DETAIL_TILE, DETAIL_TILE, { kernel: sharp.kernel.lanczos3 })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outputPath);
      manifest.push({ row, column, outputPath, sourceCore: SOURCE_CORE, sourceOverlap: SOURCE_OVERLAP });
    }
  }

  await fs.writeFile(
    path.join(outputDirectory, "manifest.json"),
    `${JSON.stringify({ grid: GRID, sourceSize: SOURCE_SIZE, sourceTile: SOURCE_TILE, detailTile: DETAIL_TILE, tiles: manifest }, null, 2)}\n`,
  );
  console.log(JSON.stringify({ ok: true, mode: "crop", outputDirectory, tiles: manifest.length }, null, 2));
}

function smoothstep(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function edgeWeight(pixel, tileIndex, positions) {
  let weight = 1;
  if (tileIndex > 0) {
    const overlap = DETAIL_TILE - (positions[tileIndex] - positions[tileIndex - 1]);
    if (pixel < overlap) weight *= smoothstep(pixel / Math.max(1, overlap - 1));
  }
  if (tileIndex < GRID - 1) {
    const overlap = DETAIL_TILE - (positions[tileIndex + 1] - positions[tileIndex]);
    if (pixel >= DETAIL_TILE - overlap) {
      weight *= smoothstep((DETAIL_TILE - 1 - pixel) / Math.max(1, overlap - 1));
    }
  }
  return Math.max(weight, 0.0001);
}

async function stitchTiles(tileDirectory, sourcePath, outputPath) {
  const sourceStepAtDetail = SOURCE_CORE / SOURCE_TILE * DETAIL_TILE;
  const positions = Array.from({ length: GRID }, (_, index) => Math.round(index * sourceStepAtDetail));
  const canvasSize = positions[GRID - 1] + DETAIL_TILE;
  const pixelCount = canvasSize * canvasSize;
  const sumRed = new Float32Array(pixelCount);
  const sumGreen = new Float32Array(pixelCount);
  const sumBlue = new Float32Array(pixelCount);
  const sumWeight = new Float32Array(pixelCount);

  for (let row = 0; row < GRID; row += 1) {
    for (let column = 0; column < GRID; column += 1) {
      const tilePath = path.join(tileDirectory, tileName("detail", row, column));
      const { data, info } = await sharp(tilePath)
        .resize(DETAIL_TILE, DETAIL_TILE, { fit: "fill", kernel: sharp.kernel.lanczos3 })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      if (info.channels !== 3) throw new Error(`Unexpected channels in ${tilePath}: ${info.channels}`);
      const offsetX = positions[column];
      const offsetY = positions[row];
      for (let y = 0; y < DETAIL_TILE; y += 1) {
        const weightY = edgeWeight(y, row, positions);
        const canvasRow = (offsetY + y) * canvasSize;
        const tileRow = y * DETAIL_TILE;
        for (let x = 0; x < DETAIL_TILE; x += 1) {
          const weight = weightY * edgeWeight(x, column, positions);
          const canvasIndex = canvasRow + offsetX + x;
          const tileIndex = (tileRow + x) * 3;
          sumRed[canvasIndex] += data[tileIndex] * weight;
          sumGreen[canvasIndex] += data[tileIndex + 1] * weight;
          sumBlue[canvasIndex] += data[tileIndex + 2] * weight;
          sumWeight[canvasIndex] += weight;
        }
      }
    }
  }

  const mosaic = Buffer.allocUnsafe(pixelCount * 3);
  for (let index = 0; index < pixelCount; index += 1) {
    const weight = Math.max(0.0001, sumWeight[index]);
    mosaic[index * 3] = Math.round(sumRed[index] / weight);
    mosaic[index * 3 + 1] = Math.round(sumGreen[index] / weight);
    mosaic[index * 3 + 2] = Math.round(sumBlue[index] / weight);
  }

  const paddingAtDetail = Math.round(SOURCE_OVERLAP / SOURCE_TILE * DETAIL_TILE);
  const croppedSize = canvasSize - paddingAtDetail * 2;
  const detailedMaster = await sharp(mosaic, { raw: { width: canvasSize, height: canvasSize, channels: 3 } })
    .extract({ left: paddingAtDetail, top: paddingAtDetail, width: croppedSize, height: croppedSize })
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  const structuralGuide = await sharp(sourcePath)
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { kernel: sharp.kernel.lanczos3 })
    .ensureAlpha(0.12)
    .png()
    .toBuffer();

  await sharp(detailedMaster)
    .composite([{ input: structuralGuide, blend: "over" }])
    .removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  console.log(JSON.stringify({ ok: true, mode: "stitch", outputPath, width: metadata.width, height: metadata.height, positions }, null, 2));
}

async function main() {
  const [mode, first, second, third] = process.argv.slice(2);
  if (mode === "crop" && first && second) return cropTiles(first, second);
  if (mode === "stitch" && first && second && third) return stitchTiles(first, second, third);
  throw new Error("Usage: texture_tile_pipeline.cjs crop <source.png> <tile-dir> | stitch <tile-dir> <source.png> <output.png>");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
