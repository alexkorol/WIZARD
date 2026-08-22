import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const cssUrl = new URL('../shared/verdigris-frame.css', import.meta.url);
const jsUrl = new URL('../shared/verdigris-frame.js', import.meta.url);
const assetRoot = new URL('../assets/verdigris-ui/placeholders/', import.meta.url);
const css = await readFile(cssUrl, 'utf8');
const runtimeSource = await readFile(jsUrl, 'utf8');

const publicProperties = [
  '--wizard-frame-image',
  '--wizard-frame-slice-top',
  '--wizard-frame-slice-right',
  '--wizard-frame-slice-bottom',
  '--wizard-frame-slice-left',
  '--wizard-frame-content-top',
  '--wizard-frame-content-right',
  '--wizard-frame-content-bottom',
  '--wizard-frame-content-left',
  '--wizard-frame-edge-repeat',
  '--wizard-frame-fill'
];

for (const property of publicProperties) assert.ok(css.includes(property), `missing public CSS property ${property}`);

const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
const selectorLists = [];
let preludeStart = 0;
for (let index = 0; index < cssWithoutComments.length; index += 1) {
  if (cssWithoutComments[index] === '{') {
    const prelude = cssWithoutComments.slice(preludeStart, index).trim();
    if (prelude && !prelude.startsWith('@')) selectorLists.push(prelude);
    preludeStart = index + 1;
  } else if (cssWithoutComments[index] === '}') {
    preludeStart = index + 1;
  }
}
for (const selectorList of selectorLists) {
  for (const selector of selectorList.split(',')) {
    assert.match(selector.trim(), /^\.wizard-frame(?:\b|[:\[])/, `unscoped selector: ${selector.trim()}`);
  }
}
console.log('ok every runtime selector is scoped under .wizard-frame');

for (const component of ['panel', 'card', 'button', 'inset']) {
  assert.match(css, new RegExp(`data-wizard-frame-component=["']${component}["']`));
}
for (const state of ['default', 'hover', 'focus', 'active', 'disabled']) {
  if (state === 'default') assert.match(css, /--wizard-frame-fill:\s*#171714/);
  else assert.match(css, new RegExp(`data-wizard-frame-state=["']${state}["']`));
}
assert.match(css, /\.wizard-frame:focus-visible/);
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
assert.match(css, /transition:\s*none/);
assert.match(css, /\.wizard-frame::before[\s\S]*position:\s*absolute/);
assert.match(css, /border-image-source:\s*var\(--wizard-frame-image\)/);
assert.match(css, /pointer-events:\s*none/);
assert.match(css, /\.wizard-frame\s*\{[\s\S]*background:\s*var\(--wizard-frame-fill\)/);
assert.doesNotMatch(css, /\.wizard-frame-image\b/);
console.log('ok CSS baseline, focus, reduced motion, and decoration-only image overlay');

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
  const channels = hex.match(/[a-f0-9]{2}/gi).map((part) => channel(parseInt(part, 16)));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrast(a, b) {
  const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (bright + 0.05) / (dark + 0.05);
}
assert.ok(contrast('#b9b5ab', '#151514') >= 4.5, 'disabled text contrast must meet WCAG AA');
assert.match(css, /data-wizard-frame-state="disabled"[\s\S]*opacity:\s*1/);
console.log(`ok disabled fallback contrast ${contrast('#b9b5ab', '#151514').toFixed(2)}:1`);

const assetFiles = (await readdir(assetRoot)).sort();
assert.deepEqual(assetFiles, ['button.svg', 'card.svg', 'inset.svg', 'panel.svg']);
for (const file of assetFiles) {
  const svg = await readFile(new URL(file, assetRoot), 'utf8');
  assert.match(svg, /^<svg\b/);
  assert.doesNotMatch(svg, /<text\b|<foreignObject\b|data:image\//i, `${file} contains baked or embedded content`);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /focusable="false"/);
}
console.log('ok four SVG placeholders contain geometry only and no baked text');

delete globalThis.VerdigrisFrames;
await import(`${jsUrl.href}?test=${Date.now()}`);
const runtime = globalThis.VerdigrisFrames;
assert.deepEqual([...runtime.STATES], ['default', 'hover', 'focus', 'active', 'disabled']);
assert.deepEqual(Object.values(runtime.PUBLIC_PROPERTIES).sort(), [...publicProperties].sort());

const attributes = new Map([['data-wizard-frame-state', 'default']]);
const styles = new Map();
const fakeFrame = {
  disabled: false,
  matches(selector) { return selector === '.wizard-frame'; },
  getAttribute(name) { return attributes.get(name) ?? null; },
  setAttribute(name, value) { attributes.set(name, value); },
  style: {
    setProperty(name, value) { styles.set(name, value); },
    removeProperty(name) { styles.delete(name); }
  }
};
assert.equal(runtime.setState(fakeFrame, 'focus'), 'focus');
assert.equal(attributes.get('data-wizard-frame-state'), 'focus');
assert.throws(() => runtime.setState(fakeFrame, 'bogus'), /invalid wizard frame state/);
runtime.setRasterDecoration(fakeFrame, { image: 'url("frame.png")', sliceTop: 24, fill: '#111' });
assert.deepEqual([...styles], [
  ['--wizard-frame-image', 'url("frame.png")'],
  ['--wizard-frame-slice-top', '24'],
  ['--wizard-frame-fill', '#111']
]);
assert.equal(attributes.get('data-wizard-frame-state'), 'focus', 'raster decoration must not alter state');
runtime.clearRasterDecoration(fakeFrame);
assert.equal(styles.size, 0);
assert.doesNotMatch(runtimeSource, /innerHTML|outerHTML|insertAdjacentHTML|createElement|appendChild|replaceChildren/);
console.log('ok optional JS preserves DOM/state logic and writes only public decoration properties');

console.log('PASS framepack runtime: scoped CSS/SVG baseline + optional state and raster decoration');
