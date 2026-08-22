#!/usr/bin/env node
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePng, encodePng } from './png.mjs';
import { deriveImage, composeContactSheet } from './derive.mjs';
import { loadAndValidateJson, resolveSchemaRefs, validateAgainstSchema } from './validate.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = path.resolve(SCRIPT_DIR, '..', '..', 'schema');
const INTAKE_SCHEMA = path.join(SCHEMA_DIR, 'wizard.asset-intake.v1.schema.json');
const FRAMEPACK_SCHEMA_PATH = path.join(SCHEMA_DIR, 'wizard.framepack.v1.schema.json');

const DERIVATIVE_ROLES = new Set(['alpha', 'edge', 'height', 'depth', 'roughness-source']);
const STATE_NAMES = ['default', 'hover', 'focus', 'active', 'disabled'];

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function hasSoftAlpha(image) {
  for (let i = 3; i < image.pixels.length; i += 4) {
    if (image.pixels[i] !== 255) return true;
  }
  return false;
}

function checkNineSlice(component, width, height, failures, label) {
  const [top, right, bottom, left] = component.slice;
  if (left + right >= width) {
    failures.push(`${label}: slice left+right (${left}+${right}) must be less than source width ${width}`);
  }
  if (top + bottom >= height) {
    failures.push(`${label}: slice top+bottom (${top}+${bottom}) must be less than source height ${height}`);
  }
  const [ctop, cright, cbottom, cleft] = component.contentInsets;
  const centerWidth = width - left - right;
  const centerHeight = height - top - bottom;
  if (cleft + cright > centerWidth || ctop + cbottom > centerHeight) {
    failures.push(
      `${label}: contentInsets [${component.contentInsets}] exceed the center region ${centerWidth}x${centerHeight}`
    );
  }
}

function buildManifest(intake, sources) {
  return {
    schemaVersion: 1,
    id: intake.id,
    title: intake.title,
    assetRoot: 'assets/verdigris-ui/framepacks/',
    provenance: intake.provenance,
    components: intake.components.map((component, index) => {
      const manifestComponent = {
        id: component.id,
        slice: component.slice,
        contentInsets: component.contentInsets,
        edgeMode: component.edgeMode,
        states: {},
      };
      for (const state of STATE_NAMES) {
        if (component.states[state]) manifestComponent.states[state] = sources[index][state].manifestEntry;
      }
      const derivatives = [];
      for (const role of intake.derivatives || []) {
        for (const state of STATE_NAMES) {
          if (!component.states[state]) continue;
          derivatives.push({
            role,
            file: `maps/${component.id}-${state}.${role}.png`,
            sha256: sources[index][state].derivativeHashes[role],
          });
        }
      }
      if (derivatives.length) manifestComponent.derivatives = derivatives;
      return manifestComponent;
    }),
  };
}

function ingest(intakeDir, outDir, options = {}) {
  const failures = [];
  let intakeText;
  try {
    intakeText = fs.readFileSync(path.join(intakeDir, 'intake.json'), 'utf8');
  } catch {
    console.error(`FAIL ingest: ${intakeDir} does not contain intake.json`);
    process.exit(2);
  }
  let intake;
  try {
    intake = JSON.parse(intakeText);
  } catch (error) {
    console.error(`FAIL ingest: intake.json is not valid JSON: ${error.message}`);
    process.exit(2);
  }

  const rawIntakeSchema = JSON.parse(fs.readFileSync(INTAKE_SCHEMA, 'utf8'));
  const intakeSchema = resolveSchemaRefs(rawIntakeSchema);
  validateAgainstSchema(intake, intakeSchema, failures, 'intake.json');
  reportAndExit(failures);

  const requestedDerivatives = (intake.derivatives || []).filter(role => {
    if (DERIVATIVE_ROLES.has(role)) return true;
    failures.push(`intake.json: derivative role "${role}" is not available from this tool (no synthetic normal maps)`);
    return false;
  });
  reportAndExit(failures);

  const stagedSources = [];
  for (const component of intake.components) {
    const perState = {};
    for (const state of STATE_NAMES) {
      const stateSpec = component.states[state];
      if (!stateSpec) continue;
      const filePath = path.join(intakeDir, stateSpec.file);
      let bytes;
      try {
        bytes = fs.readFileSync(filePath);
      } catch {
        failures.push(`${component.id}/${state}: cannot read source PNG ${stateSpec.file}`);
        continue;
      }
      let image;
      try {
        image = decodePng(bytes);
      } catch (error) {
        failures.push(`${component.id}/${state}: ${stateSpec.file}: ${error.message}`);
        continue;
      }
      checkNineSlice(component, image.width, image.height, failures, `${component.id}/${state} (${stateSpec.file})`);
      const alpha = hasSoftAlpha(image);
      if (stateSpec.expectAlpha === true && !alpha) {
        failures.push(`${component.id}/${state}: expectAlpha=true but ${stateSpec.file} is fully opaque`);
      }
      if (stateSpec.expectAlpha === false && alpha) {
        failures.push(`${component.id}/${state}: expectAlpha=false but ${stateSpec.file} has soft alpha pixels`);
      }
      const derivativeHashes = {};
      const derivatives = {};
      for (const role of requestedDerivatives) {
        const derived = deriveImage(role, image);
        const png = encodePng(derived.width, derived.height, derived.pixels);
        derivatives[role] = png;
        derivativeHashes[role] = sha256(png);
      }
      perState[state] = {
        sourceBytes: bytes,
        image,
        manifestEntry: {
          file: `${component.id}-${state}.png`,
          width: image.width,
          height: image.height,
          sha256: sha256(bytes),
          hasAlpha: alpha,
        },
        derivatives,
        derivativeHashes,
      };
    }
    stagedSources.push(perState);
  }
  reportAndExit(failures);

  const manifest = buildManifest(intake, stagedSources);

  const framepackRaw = JSON.parse(fs.readFileSync(FRAMEPACK_SCHEMA_PATH, 'utf8'));
  const framepackSchema = resolveSchemaRefs(framepackRaw);
  validateAgainstSchema(manifest, framepackSchema, failures, 'framepack.json');
  reportAndExit(failures, 'emitted manifest failed framepack v1 validation');

  const stagingRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'verdigris-assets-stage-'));
  const packDir = path.join(stagingRoot, 'assets', 'verdigris-ui', 'framepacks', intake.id);
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(path.join(packDir, 'maps'), { recursive: true });

  intake.components.forEach((component, index) => {
    for (const state of STATE_NAMES) {
      const staged = stagedSources[index][state];
      if (!staged) continue;
      fs.writeFileSync(path.join(packDir, staged.manifestEntry.file), staged.sourceBytes);
      for (const role of requestedDerivatives) {
        fs.writeFileSync(path.join(packDir, 'maps', `${component.id}-${state}.${role}.png`), staged.derivatives[role]);
      }
    }
  });
  fs.writeFileSync(path.join(packDir, 'framepack.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  if (options.contactSheet && requestedDerivatives.length) {
    const sheetImages = [];
    for (const perState of stagedSources) {
      for (const role of requestedDerivatives) {
        if (!perState.default.derivatives[role]) continue;
        sheetImages.push(decodePng(perState.default.derivatives[role]));
      }
    }
    const sheet = composeContactSheet(sheetImages, Math.min(4, Math.max(1, sheetImages.length)));
    fs.writeFileSync(
      path.join(packDir, 'contact-sheet.png'),
      encodePng(sheet.width, sheet.height, sheet.pixels)
    );
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.renameSync(path.join(stagingRoot, 'assets'), path.join(outDir, 'assets'));
  fs.rmSync(stagingRoot, { recursive: true, force: true });
  return { manifest, contactSheetEmitted: options.contactSheet && requestedDerivatives.length > 0 };
}

export function verifyPack(packPath) {
  const failures = [];
  const manifestPath = path.join(packPath, 'framepack.json');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    throw new Error(`cannot read framepack.json: ${error.message}`);
  }
  const framepackRaw = JSON.parse(fs.readFileSync(FRAMEPACK_SCHEMA_PATH, 'utf8'));
  validateAgainstSchema(manifest, resolveSchemaRefs(framepackRaw), failures, 'framepack.json');

  for (const component of manifest.components || []) {
    for (const [state, asset] of Object.entries(component.states || {})) {
      const file = path.join(packPath, asset.file);
      if (!fs.existsSync(file)) {
        failures.push(`${component.id}/${state}: missing asset file ${asset.file}`);
        continue;
      }
      const bytes = fs.readFileSync(file);
      if (sha256(bytes) !== asset.sha256) {
        failures.push(`${component.id}/${state}: checksum mismatch for ${asset.file}`);
        continue;
      }
      try {
        const image = decodePng(bytes);
        if (image.width !== asset.width || image.height !== asset.height) {
          failures.push(
            `${component.id}/${state}: dimensions ${image.width}x${image.height} do not match manifest ${asset.width}x${asset.height}`
          );
        }
        if (hasSoftAlpha(image) !== asset.hasAlpha) {
          failures.push(`${component.id}/${state}: alpha presence does not match manifest hasAlpha=${asset.hasAlpha}`);
        }
      } catch (error) {
        failures.push(`${component.id}/${state}: ${asset.file}: ${error.message}`);
      }
    }
    for (const derivative of component.derivatives || []) {
      const file = path.join(packPath, derivative.file);
      if (!fs.existsSync(file)) {
        failures.push(`${component.id}: missing derivative map ${derivative.file}`);
        continue;
      }
      if (sha256(fs.readFileSync(file)) !== derivative.sha256) {
        failures.push(`${component.id}: checksum mismatch for derivative ${derivative.file}`);
      }
    }
  }
  return failures;
}

function reportAndExit(failures, headline = 'intake failed validation') {
  if (failures.length) {
    console.error(`FAIL ingest: ${headline} (${failures.length} problem${failures.length === 1 ? '' : 's'}):`);
    for (const failure of [...new Set(failures)]) {
      console.error(`  - ${failure}`);
    }
    process.exit(1);
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (!argv.length || argv[0] === '-h' || argv[0] === '--help') {
    console.log('usage: node scripts/verdigris-assets/ingest.mjs ingest <intake-dir> --out <out-dir> [--contact-sheet]');
    console.log('       node scripts/verdigris-assets/ingest.mjs verify <pack-dir>');
    console.log('Validates an owner framepack intake, derives deterministic support maps, and emits a');
    console.log('validated wizard.framepack.v1 pack. Source assets are never overwritten; outputs are');
    console.log('staged and validated before promotion. Deterministic: identical input yields');
    console.log('byte-identical output. This tool never claims to synthesize final normal maps.');
    process.exit(argv.length ? 0 : 2);
  }
  const mode = argv[0];
  if (mode === 'verify') {
    const packPath = path.resolve(argv[1]);
    const failures = verifyPack(packPath);
    if (failures.length) {
      console.error(`FAIL verify (${failures.length} problem${failures.length === 1 ? '' : 's'}):`);
      failures.forEach(failure => console.error(`  - ${failure}`));
      process.exit(1);
    }
    console.log(`PASS verify ${path.basename(packPath)} (all files match framepack.json checksums)`);
    process.exit(0);
  }
  if (mode === 'ingest') {
    const positional = [];
    let outDir = null;
    let contactSheet = false;
    for (let i = 1; i < argv.length; i++) {
      if (argv[i] === '--out') outDir = path.resolve(argv[++i]);
      else if (argv[i] === '--contact-sheet') contactSheet = true;
      else positional.push(argv[i]);
    }
    if (!positional.length || !outDir) {
      console.error('FAIL ingest requires <intake-dir> and --out <out-dir>');
      process.exit(2);
    }
    const { manifest, contactSheetEmitted } = ingest(path.resolve(positional[0]), outDir, { contactSheet });
    const packPrefix = `assets/verdigris-ui/framepacks/${manifest.id}`;
    const emitted = [
      `${packPrefix}/framepack.json`,
      ...manifest.components.flatMap(component => [
        ...Object.values(component.states).map(asset => `${packPrefix}/${asset.file}`),
        ...(component.derivatives || []).map(d => `${packPrefix}/${d.file}`),
      ]),
    ];
    if (contactSheetEmitted) {
      emitted.push(`${packPrefix}/contact-sheet.png`);
    }
    console.log('EMITTED');
    emitted.forEach(entry => console.log(entry));
    console.log(`PASS ingest ${manifest.id} (${manifest.components.length} components validated and promoted)`);
    process.exit(0);
  }
  console.error(`FAIL unknown mode "${mode}"`);
  process.exit(2);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
