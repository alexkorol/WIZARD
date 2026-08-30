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
  'wizard.mason',
  'wizard.verdigris-splash',
  'wizard.chronicles',
  'wizard.systems-bench'
];

const CAPABILITY_KEYS = [
  'adapter', 'scenarios', 'stateExport', 'stateImport', 'snapshots',
  'annotations', 'proposals', 'fixtures', 'events', 'pauseStep', 'agentFeedback'
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
  if (Array.isArray(expected)) {
    if (expected.includes('null') && value === null) return true;
    return expected.filter(t => t !== 'null').some(t => typeOk(value, t));
  }
  return typeof value === expected;
}

function validateAgainstSchema(manifest, schema, failures, source) {
  const props = schema.properties;
  for (const key of schema.required) {
    if (!(key in manifest)) fail(failures, `${source}: missing required field "${key}"`);
  }
  for (const key of Object.keys(manifest)) {
    if (!props[key]) fail(failures, `${source}: unknown field "${key}"`);
  }
  for (const [key, spec] of Object.entries(props)) {
    if (!(key in manifest)) continue;
    const value = manifest[key];
    if (spec.const !== undefined && value !== spec.const) {
      fail(failures, `${source}: ${key} must be ${JSON.stringify(spec.const)}`);
    }
    if (spec.type && !typeOk(value, spec.type)) {
      fail(failures, `${source}: ${key} has wrong type`);
    }
    if (spec.enum && !spec.enum.includes(value)) {
      fail(failures, `${source}: ${key}="${value}" is not an allowed value`);
    }
    if (spec.pattern && typeof value === 'string' && !new RegExp(spec.pattern).test(value)) {
      fail(failures, `${source}: ${key}="${value}" fails pattern ${spec.pattern}`);
    }
    if (typeof spec.minLength === 'number' && typeof value === 'string' && value.length < spec.minLength) {
      fail(failures, `${source}: ${key} is too short`);
    }
    if (typeof spec.maxLength === 'number' && typeof value === 'string' && value.length > spec.maxLength) {
      fail(failures, `${source}: ${key} is too long`);
    }
    if (spec.type === 'array') {
      if (typeof spec.minItems === 'number' && value.length < spec.minItems) {
        fail(failures, `${source}: ${key} needs at least ${spec.minItems} items`);
      }
      if (spec.uniqueItems && new Set(value).size !== value.length) {
        fail(failures, `${source}: ${key} contains duplicates`);
      }
      if (spec.items?.enum) {
        for (const item of value) {
          if (!spec.items.enum.includes(item)) fail(failures, `${source}: ${key} has invalid item "${item}"`);
        }
      }
    }
    if (key === 'capabilities') {
      if (!value || typeof value !== 'object') continue;
      for (const cap of CAPABILITY_KEYS) {
        if (typeof value[cap] !== 'boolean') fail(failures, `${source}: capabilities.${cap} must be boolean`);
      }
      for (const cap of Object.keys(value)) {
        if (!CAPABILITY_KEYS.includes(cap)) fail(failures, `${source}: unknown capability "${cap}"`);
      }
    }
  }
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
    let manifest;
    try {
      manifest = readJson(file);
    } catch (error) {
      fail(failures, `${source}: invalid JSON (${error.message})`);
      continue;
    }
    validateAgainstSchema(manifest, schema, failures, source);
    const parentSlug = path.basename(path.dirname(file));
    if (manifest.slug && manifest.slug !== parentSlug) {
      fail(failures, `${source}: slug "${manifest.slug}" does not match directory "${parentSlug}"`);
    }
    if (manifest.id) {
      if (ids.has(manifest.id)) fail(failures, `duplicate id "${manifest.id}" (${source} and ${ids.get(manifest.id)})`);
      else ids.set(manifest.id, source);
    }
    if (manifest.slug) {
      if (slugs.has(manifest.slug)) fail(failures, `duplicate slug "${manifest.slug}"`);
      else slugs.set(manifest.slug, source);
    }
    if (manifest.launch) {
      const launchPath = path.join(ROOT, manifest.launch);
      if (!fs.existsSync(launchPath)) fail(failures, `${source}: launch entry missing at ${manifest.launch}`);
    }
    if (manifest.readme) {
      const readmePath = path.join(ROOT, manifest.readme);
      if (!fs.existsSync(readmePath)) fail(failures, `${source}: README missing at ${manifest.readme}`);
    }
    if (manifest.preview) {
      const previewPath = path.join(ROOT, manifest.preview);
      if (!fs.existsSync(previewPath)) fail(failures, `${source}: preview missing at ${manifest.preview}`);
    }
    if (manifest.visibility === 'dashboard' && ['archive', 'legacy', 'internal'].includes(manifest.status)) {
      fail(failures, `${source}: dashboard visibility is incompatible with status "${manifest.status}"`);
    }
    if (manifest.visibility === 'dashboard' && ARCHIVE_SLUGS.includes(manifest.slug)) {
      fail(failures, `${source}: archive candidate cannot be dashboard-visible`);
    }
    modules.push(manifest);
  }

  return { modules, failures };
}

function buildRegistry(modules) {
  const dashboard = modules
    .filter(mod => mod.visibility === 'dashboard')
    .sort((a, b) => a.title.localeCompare(b.title));
  return {
    generatedBy: 'scripts/wizard-lab.mjs',
    schemaVersion: 1,
    doNotEdit: true,
    modules: modules.slice().sort((a, b) => a.id.localeCompare(b.id)),
    dashboard
  };
}

function renderRegistryJs(registry) {
  return `/* generated by scripts/wizard-lab.mjs; do not edit */\nwindow.WIZARD_REGISTRY = ${JSON.stringify(registry, null, 2)};\n`;
}

function registryPayload(registry) {
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
    'tools/verdigris_splash/validate.mjs',
    'tests/wizard-orbs-invariants.test.mjs'
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

const command = process.argv[2] || 'verify';
if (command === 'generate') generate();
else if (command === 'verify') verify();
else {
  console.error(`unknown command ${command}`);
  process.exitCode = 2;
}
