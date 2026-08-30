import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { runStandaloneApp } from './geometric_skilltree/tests/harness.mjs';

const root = new URL('./', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

// Skill tree: a presentation-only update used to take the same full detector,
// stat, persistence, and 2,641-element renderer path as a model change.
const runtime = runStandaloneApp();
runtime.skillTree.selectedNodeId = '1,0';
runtime.renderer.update();
const fullRendererUnits = Number(runtime.document.getElementById('main-svg').dataset.rendererWorkUnits);
runtime.renderer.update();
const idleRendererUnits = Number(runtime.document.getElementById('main-svg').dataset.rendererWorkUnits);
for (let i = 0; i < 20; i += 1) runtime.skillTree.recalculate();
for (let i = 0; i < 100; i += 1) runtime.skillTree.recalculate({ modelChanged: false });
const presentationRevision = runtime.skillTree.modelRevision;
const fullStart = performance.now();
for (let i = 0; i < 100; i += 1) runtime.skillTree.recalculate();
const fullMs = performance.now() - fullStart;
const fastStart = performance.now();
for (let i = 0; i < 1000; i += 1) runtime.skillTree.recalculate({ modelChanged: false });
const fastMs = performance.now() - fastStart;
assert.equal(runtime.skillTree.modelRevision, presentationRevision + 100,
  'Presentation updates must not recompute the model.');
assert.ok(fullRendererUnits / Math.max(1, idleRendererUnits) >= 50,
  `Skill-tree renderer work reduction is below 50× (${fullRendererUnits}/${idleRendererUnits}).`);
const skillTreeWallRatio = (fullMs / 100) / (fastMs / 1000);

// Orbs: conservative fragment/noise work model for the Performance quality
// preset vs the ultra baseline (oct 5, scale 1.0, 60fps). The overlay crop is
// NOT a permitted lever here: cropping ORB_VIEW cuts the orb light spill off
// in a vertical seam across the statues (Aug-2026 regression), so the full
// frame is asserted as a correctness floor instead of counted as savings —
// see tests/wizard-orbs-invariants.test.mjs and tools/wizard_orbs/CLAUDE.md.
const orb = read('wizard_orbs/src/template.html');
const artMatch = orb.match(/const ART_SIZE = \{ w: ([\d.]+), h: ([\d.]+) \}/);
const viewMatch = orb.match(/const ORB_VIEW = \{ x0: ([\d.]+), y0: ([\d.]+), x1: ([\d.]+), y1: ([\d.]+) \}/);
const perfMatch = orb.match(/perf:\s*\[([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\]/);
assert.ok(artMatch && viewMatch && perfMatch, 'Orb performance constants must remain machine-readable.');
const [, artW, artH] = artMatch.map(Number);
const [, x0, y0, x1, y1] = viewMatch.map(Number);
const [, perfOctaves, perfScale, , perfFps] = perfMatch.map(Number);
assert.deepEqual([x0, y0, x1, y1], [0, 0, artW, artH],
  'ORB_VIEW must cover the full art frame; the crop is a visual regression, not a perf lever.');
const orbReduction = (5 * 60) / (perfScale ** 2 * perfOctaves * perfFps);
assert.ok(orbReduction >= 20, `Orb performance-preset work reduction is ${orbReduction.toFixed(1)}×, below 20×.`);

// Cartographer: only the transparent effects layer is animated. Static map art
// stays full-resolution and is redrawn only as a display blit.
const cart = read('cartographer/index.html');
const scaleMatch = cart.match(/var ANIM_SCALE = ([\d.]+)/);
const fpsMatch = cart.match(/1000 \/ 8 : 1000 \/ ([\d.]+)/);
assert.ok(scaleMatch && fpsMatch, 'Cartographer performance constants must remain machine-readable.');
const animationScale = Number(scaleMatch[1]);
const animationFps = Number(fpsMatch[1]);
const cartReduction = 60 / (animationScale ** 2 * animationFps);
assert.ok(cartReduction >= 50, `Cartographer effects work reduction is ${cartReduction.toFixed(1)}×, below 50×.`);

// Inventory: no pointer listener exists in the idle state, making its previous
// one-React-update-per-pointer-event path zero-work until a drag/tooltip starts.
const inventory = read('rpg_inventory/index.html');
assert.match(inventory, /const trackingPointer = Boolean\(dragState \|\| tooltip\);\s*useEffect\(\(\) => \{\s*if \(!trackingPointer\) return undefined;/,
  'Inventory must not install pointer tracking while idle.');

console.log(JSON.stringify({
  skillTree: {
    fullRendererUnits,
    idleRendererUnits,
    presentationUpdates: 1000,
    presentationMs: Number(fastMs.toFixed(2)),
    modelRecomputesDuringPresentation: 0,
    measuredFullVsPresentationRatio: Number(skillTreeWallRatio.toFixed(1))
  },
  inventory: { idlePointerRenderUpdates: 0 },
  orbs: { conservativeWorkReduction: Number(orbReduction.toFixed(1)) },
  cartographer: { effectsWorkReduction: Number(cartReduction.toFixed(1)) }
}, null, 2));
