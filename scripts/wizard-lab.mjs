#!/usr/bin/env node
/**
 * Discover, validate, and generate WIZARD module registry artifacts.
 * Usage:
 *   node scripts/wizard-lab.mjs generate
 *   node scripts/wizard-lab.mjs verify
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_PATH = path.join(ROOT, 'schema', 'wizard.module.v1.schema.json');
const REGISTRY_JSON = path.join(ROOT, 'modules.json');
const REGISTRY_JS = path.join(ROOT, 'modules.generated.js');
const DASHBOARD = path.join(ROOT, 'index.html');
const ARCHIVE_SLUGS = ['pixel_sandbox', 'wordcloud', 'wordsphere', 'space_shooter', 'sokoban'];
const REQUIRED_DASHBOARD_IDS = [
  'wizard.orbs',
  'wizard.geometric-skilltree',
  'wizard.rpg-inventory',
  'wizard.arcane-lattice',
  'wizard.cartographer',
  'wizard.verdigris-splash',
  'wizard.chronicles',
  'wizard.systems-bench'
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function walkManifests(dir = path.join(ROOT, 'tools')) {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walkManifests(full));
    else if (entry.name === 'wizard.module.json') found.push(full);
  }
  return found;
}

function fail(failures, message) {
  failures.push(message);
}

function typeOk(value, expected) {
  if (expected === 'integer') return Number.isInteger(value);
  if (expected === 'array') return Array.isArray(value);
  if (expected === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (expected === 'null') return value === null;
  if (Array.isArray(expected)) {
    return expected.some(type => typeOk(value, type));
  }
  return typeof value === expected;
}

function valueKey(value) {
  return JSON.stringify(value);
}

function validateAgainstSchema(value, schema, failures, source, field = '') {
  const label = field ? `${source}: ${field}` : source;
  if (schema.type && !typeOk(value, schema.type)) {
    const expected = Array.isArray(schema.type) ? schema.type.join(' or ') : schema.type;
    fail(failures, `${label} has wrong type (expected ${expected})`);
    return;
  }

  if (schema.const !== undefined && value !== schema.const) {
    fail(failures, `${label} must be ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    fail(failures, `${label}=${JSON.stringify(value)} is not an allowed value`);
  }
  if (schema.pattern && typeof value === 'string' && !new RegExp(schema.pattern).test(value)) {
    fail(failures, `${label}=${JSON.stringify(value)} fails pattern ${schema.pattern}`);
  }
  if (typeof schema.minLength === 'number' && typeof value === 'string' && value.length < schema.minLength) {
    fail(failures, `${label} is too short`);
  }
  if (typeof schema.maxLength === 'number' && typeof value === 'string' && value.length > schema.maxLength) {
    fail(failures, `${label} is too long`);
  }
  if (typeof schema.minimum === 'number' && typeof value === 'number' && value < schema.minimum) {
    fail(failures, `${label} must be at least ${schema.minimum}`);
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
      fail(failures, `${label} needs at least ${schema.minItems} items`);
    }
    if (schema.uniqueItems) {
      const keys = value.map(valueKey);
      if (new Set(keys).size !== keys.length) fail(failures, `${label} contains duplicates`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        const itemField = field ? `${field}[${index}]` : `[${index}]`;
        validateAgainstSchema(item, schema.items, failures, source, itemField);
      });
    }
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const properties = schema.properties || {};
    for (const key of schema.required || []) {
      if (!(key in value)) {
        const missing = field ? `${field}.${key}` : key;
        fail(failures, `${source}: missing required field "${missing}"`);
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) {
          const unknown = field ? `${field}.${key}` : key;
          fail(failures, `${source}: unknown field "${unknown}"`);
        }
      }
    }
    for (const [key, spec] of Object.entries(properties)) {
      if (!(key in value)) continue;
      const childField = field ? `${field}.${key}` : key;
      validateAgainstSchema(value[key], spec, failures, source, childField);
    }
  }
}

function findDuplicateJsonKeys(text) {
  let index = 0;
  const duplicates = [];

  function skipWhitespace() {
    while (/\s/.test(text[index] || '')) index += 1;
  }

  function readString() {
    const start = index;
    index += 1;
    while (index < text.length) {
      if (text[index] === '\\') {
        index += 2;
        continue;
      }
      if (text[index] === '"') {
        index += 1;
        return JSON.parse(text.slice(start, index));
      }
      index += 1;
    }
    throw new Error('unterminated string');
  }

  function readValue(field) {
    skipWhitespace();
    if (text[index] === '{') return readObject(field);
    if (text[index] === '[') return readArray(field);
    if (text[index] === '"') {
      readString();
      return;
    }
    while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1;
  }

  function readObject(field) {
    index += 1;
    const keys = new Set();
    skipWhitespace();
    while (index < text.length && text[index] !== '}') {
      const key = readString();
      const childField = field ? `${field}.${key}` : key;
      if (keys.has(key)) duplicates.push(childField);
      keys.add(key);
      skipWhitespace();
      if (text[index] !== ':') throw new Error('expected colon');
      index += 1;
      readValue(childField);
      skipWhitespace();
      if (text[index] === ',') {
        index += 1;
        skipWhitespace();
      } else if (text[index] !== '}') {
        throw new Error('expected comma or closing brace');
      }
    }
    if (text[index] !== '}') throw new Error('unterminated object');
    index += 1;
  }

  function readArray(field) {
    index += 1;
    let itemIndex = 0;
    skipWhitespace();
    while (index < text.length && text[index] !== ']') {
      readValue(`${field}[${itemIndex}]`);
      itemIndex += 1;
      skipWhitespace();
      if (text[index] === ',') {
        index += 1;
        skipWhitespace();
      } else if (text[index] !== ']') {
        throw new Error('expected comma or closing bracket');
      }
    }
    if (text[index] !== ']') throw new Error('unterminated array');
    index += 1;
  }

  readValue('');
  return duplicates;
}

function safeRepoPath(value, kind) {
  if (typeof value !== 'string' || !value || value.includes('\\') || /[?#]/.test(value)) return false;
  if (path.posix.isAbsolute(value)) return false;
  const segments = value.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) return false;
  if (path.posix.normalize(value) !== value) return false;
  if (kind === 'launch') return value.startsWith('tools/') && value.endsWith('.html');
  if (kind === 'readme') return (value.startsWith('tools/') || value.startsWith('docs/')) && value.endsWith('.md');
  if (kind === 'preview') return /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(value);
  return false;
}

function validateFileReference(manifest, field, root, failures, source) {
  const value = manifest[field];
  if (value == null && field === 'preview') return;
  if (typeof value !== 'string') return;
  if (!safeRepoPath(value, field)) {
    fail(failures, `${source}: unsafe ${field} path "${value}"`);
    return;
  }
  const target = path.resolve(root, value);
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    fail(failures, `${source}: unsafe ${field} path "${value}"`);
    return;
  }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    const label = field === 'readme' ? 'README' : `${field} entry`;
    fail(failures, `${source}: ${label} missing at ${value}`);
  }
}

export function validateManifestText(text, options = {}) {
  const root = path.resolve(options.root || ROOT);
  const source = options.source || 'wizard.module.json';
  const schema = options.schema || readJson(options.schemaPath || SCHEMA_PATH);
  const failures = [];
  let manifest;
  try {
    manifest = JSON.parse(text);
  } catch (error) {
    fail(failures, `${source}: invalid JSON (${error.message})`);
    return { manifest: null, failures };
  }
  try {
    for (const key of findDuplicateJsonKeys(text)) {
      fail(failures, `${source}: duplicate JSON key "${key}"`);
    }
  } catch (_) {
    // JSON.parse above remains the canonical syntax error reporter.
  }

  validateAgainstSchema(manifest, schema, failures, source);
  const parentSlug = path.posix.basename(path.posix.dirname(source));
  if (manifest.slug && manifest.slug !== parentSlug) {
    fail(failures, `${source}: slug "${manifest.slug}" does not match directory "${parentSlug}"`);
  }
  validateFileReference(manifest, 'launch', root, failures, source);
  validateFileReference(manifest, 'readme', root, failures, source);
  validateFileReference(manifest, 'preview', root, failures, source);
  if (manifest.visibility === 'dashboard' && ['archive', 'legacy', 'internal'].includes(manifest.status)) {
    fail(failures, `${source}: dashboard visibility is incompatible with status "${manifest.status}"`);
  }
  if (manifest.visibility === 'dashboard' && ARCHIVE_SLUGS.includes(manifest.slug)) {
    fail(failures, `${source}: archive candidate cannot be dashboard-visible`);
  }
  return { manifest, failures };
}

function collectModules() {
  const schema = readJson(SCHEMA_PATH);
  const failures = [];
  const manifests = walkManifests().sort();
  const modules = [];
  const ids = new Map();
  const slugs = new Map();

  if (!manifests.length) fail(failures, 'no wizard.module.json files found under tools/');

  for (const file of manifests) {
    const source = rel(file);
    const result = validateManifestText(fs.readFileSync(file, 'utf8'), { source, root: ROOT, schema });
    failures.push(...result.failures);
    const manifest = result.manifest;
    if (!manifest) {
      continue;
    }
    if (manifest.id) {
      if (ids.has(manifest.id)) fail(failures, `duplicate id "${manifest.id}" (${source} and ${ids.get(manifest.id)})`);
      else ids.set(manifest.id, source);
    }
    if (manifest.slug) {
      if (slugs.has(manifest.slug)) fail(failures, `duplicate slug "${manifest.slug}"`);
      else slugs.set(manifest.slug, source);
    }
    modules.push(manifest);
  }

  return { modules, failures };
}

function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildRegistry(modules) {
  const dashboard = modules
    .filter(mod => mod.visibility === 'dashboard')
    .sort((a, b) => compareText(a.title, b.title) || compareText(a.id, b.id));
  return {
    generatedBy: 'scripts/wizard-lab.mjs',
    schemaVersion: 1,
    doNotEdit: true,
    modules: modules.slice().sort((a, b) => compareText(a.id, b.id)),
    dashboard
  };
}

function renderRegistryJs(registry) {
  return `/* generated by scripts/wizard-lab.mjs; do not edit */\nwindow.WIZARD_REGISTRY = ${JSON.stringify(registry, null, 2)};\n`;
}

export function registryPayload(registry) {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

function writeGenerated(registry) {
  fs.writeFileSync(REGISTRY_JSON, registryPayload(registry));
  fs.writeFileSync(REGISTRY_JS, renderRegistryJs(registry));
}

function normalizeNewlines(text) {
  return String(text).replace(/\r\n/g, '\n');
}

function checkFreshness(registry, failures) {
  const expectedJson = registryPayload(registry);
  const expectedJs = renderRegistryJs(registry);
  if (!fs.existsSync(REGISTRY_JSON)) fail(failures, 'modules.json is missing; run node scripts/wizard-lab.mjs generate');
  else if (normalizeNewlines(fs.readFileSync(REGISTRY_JSON, 'utf8')) !== normalizeNewlines(expectedJson)) {
    fail(failures, 'modules.json is stale; run node scripts/wizard-lab.mjs generate');
  }
  if (!fs.existsSync(REGISTRY_JS)) fail(failures, 'modules.generated.js is missing; run node scripts/wizard-lab.mjs generate');
  else if (normalizeNewlines(fs.readFileSync(REGISTRY_JS, 'utf8')) !== normalizeNewlines(expectedJs)) {
    fail(failures, 'modules.generated.js is stale; run node scripts/wizard-lab.mjs generate');
  }
}

function checkDashboard(registry, failures) {
  if (!fs.existsSync(DASHBOARD)) {
    fail(failures, 'index.html is missing');
    return;
  }
  const html = fs.readFileSync(DASHBOARD, 'utf8');
  if (!html.includes('Verdigris Systems Laboratory')) {
    fail(failures, 'index.html must identify WIZARD as the Verdigris Systems Laboratory');
  }
  if (!html.includes('modules.generated.js')) {
    fail(failures, 'index.html must load modules.generated.js (no second manual card inventory)');
  }
  const bannedPhrases = [
    'Pixel Alchemy Sandbox',
    'Interactive Word Cloud',
    'WordSphere',
    'Wireframe Space Shooter',
    'Endless Descent',
    'falling-sand',
    'AI-built interactive web experiments'
  ];
  for (const phrase of bannedPhrases) {
    if (html.includes(phrase)) fail(failures, `index.html still advertises archived/marketing copy: "${phrase}"`);
  }
  for (const slug of ARCHIVE_SLUGS) {
    if (html.includes(`tools/${slug}/`)) fail(failures, `index.html still links archive candidate ${slug}`);
  }
  if (html.includes('tools/health_globe/')) {
    fail(failures, 'index.html still has a primary health_globe card/link');
  }
  if (html.includes('tools/pixelart/') || html.includes('tools/slerp/')) {
    fail(failures, 'index.html still promotes internal utilities as public cards');
  }
  const dashboardIds = new Set(registry.dashboard.map(mod => mod.id));
  for (const id of REQUIRED_DASHBOARD_IDS) {
    if (!dashboardIds.has(id)) fail(failures, `dashboard registry missing required active module ${id}`);
  }
  if (registry.dashboard.some(mod => ARCHIVE_SLUGS.includes(mod.slug))) {
    fail(failures, 'generated dashboard registry contains an archive candidate');
  }
}

function checkRootCopy(failures) {
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const agents = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');
  const banned = ['Pixel Alchemy Sandbox', 'Interactive Word Cloud', 'WordSphere', 'Wireframe Space Shooter', 'Endless Descent', 'falling-sand sandboxes'];
  for (const phrase of banned) {
    if (readme.includes(phrase) || agents.includes(phrase)) {
      fail(failures, `root docs still promote archived marketing copy: "${phrase}"`);
    }
  }
}

function smokeLaunchFiles(registry, failures) {
  for (const mod of registry.dashboard) {
    const html = fs.readFileSync(path.join(ROOT, mod.launch), 'utf8');
    if (!/<html[\s>]/i.test(html)) fail(failures, `${mod.launch} does not look like an HTML document`);
    if (mod.capabilities.adapter) {
      const dir = path.join(ROOT, 'tools', mod.slug);
      const adapter = path.join(dir, 'wizard-adapter.js');
      const bench = path.join(dir, 'bench.js');
      if (!fs.existsSync(adapter) && !fs.existsSync(bench)) {
        fail(failures, `${mod.id} claims adapter but has no wizard-adapter.js`);
      }
    }
  }
}

function checkActiveLinks(registry, failures) {
  for (const mod of registry.dashboard) {
    const launch = path.join(ROOT, mod.launch);
    const readme = path.join(ROOT, mod.readme);
    if (!fs.existsSync(launch)) fail(failures, `active launch missing: ${mod.launch}`);
    if (!fs.existsSync(readme)) fail(failures, `active README missing: ${mod.readme}`);
  }
}

function runNode(script, extraEnv = {}) {
  const result = spawnSync(process.execPath, [script], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv }
  });
  return {
    script: rel(path.join(ROOT, script)),
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

function checkModuleTests(failures, results) {
  const scripts = [
    'tests/manifest-hardening.test.mjs',
    'tools/performance.test.mjs',
    'tools/geometric_skilltree/tests/progression.test.mjs',
    'tools/geometric_skilltree/tests/patterns.test.js',
    'tools/geometric_skilltree/tests/jewels.test.js',
    'tools/geometric_skilltree/tests/tree-data.test.mjs',
    'tools/geometric_skilltree/tests/runtime-smoke.test.mjs',
    'tools/geometric_skilltree/tests/balance.test.mjs',
    'tools/rpg_inventory/core/verdigris-stats.test.js',
    'tools/rpg_inventory/core/test.js',
    'tools/cartographer/core/test.js',
    'tools/mason/core/test.js',
    'tools/verdigris_splash/validate.mjs'
  ];
  const optional = [
    'tools/geometric_skilltree/tests/proposals.test.mjs',
    'tests/wizard-lab.test.mjs',
    'tests/calibration.test.mjs',
    'tests/annotations.test.mjs',
    'tests/systems-bench.test.mjs'
  ];
  for (const script of scripts.concat(optional)) {
    const full = path.join(ROOT, script);
    if (!fs.existsSync(full)) {
      if (optional.includes(script)) continue;
      fail(failures, `required test missing: ${script}`);
      continue;
    }
    const result = runNode(script);
    results.push(result);
    if (result.status !== 0) {
      fail(failures, `${script} failed (${result.status}): ${(result.stderr || result.stdout).trim().slice(0, 800)}`);
    }
  }
}

function smokeAdapters(failures, results) {
  const script = path.join(ROOT, 'tests', 'adapter-handshake.test.mjs');
  if (!fs.existsSync(script)) return;
  const result = runNode('tests/adapter-handshake.test.mjs');
  results.push(result);
  if (result.status !== 0) {
    fail(failures, `adapter handshake failed: ${(result.stderr || result.stdout).trim().slice(0, 800)}`);
  }
}

function printReport(title, failures, extras = []) {
  console.log(title);
  if (extras.length) extras.forEach(line => console.log(line));
  if (failures.length) {
    console.error(`FAIL ${failures.length}`);
    for (const failure of failures) console.error(` - ${failure}`);
    process.exitCode = 1;
    return false;
  }
  console.log('PASS');
  return true;
}

function generate() {
  const { modules, failures } = collectModules();
  if (failures.length) return printReport('generate', failures);
  const registry = buildRegistry(modules);
  writeGenerated(registry);
  console.log(`generated ${rel(REGISTRY_JSON)} (${registry.dashboard.length} dashboard / ${registry.modules.length} total)`);
  console.log(`generated ${rel(REGISTRY_JS)}`);
  return true;
}

function verify() {
  const { modules, failures } = collectModules();
  const results = [];
  if (!failures.length) {
    const registry = buildRegistry(modules);
    checkFreshness(registry, failures);
    if (fs.existsSync(DASHBOARD) && fs.readFileSync(DASHBOARD, 'utf8').includes('modules.generated.js')) {
      checkDashboard(registry, failures);
    }
    checkActiveLinks(registry, failures);
    smokeLaunchFiles(registry, failures);
    checkRootCopy(failures);
    const full = process.argv.includes('--full') || process.env.WIZARD_VERIFY_FULL === '1';
    if (full) {
      checkModuleTests(failures, results);
      smokeAdapters(failures, results);
    }
  }
  const extras = [
    `manifests: ${modules.length}`,
    `dashboard: ${modules.filter(mod => mod.visibility === 'dashboard').length}`
  ];
  return printReport('verify', failures, extras);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const command = process.argv[2] || 'verify';
  if (command === 'generate') generate();
  else if (command === 'verify') verify();
  else {
    console.error(`unknown command ${command}`);
    process.exitCode = 2;
  }
}
