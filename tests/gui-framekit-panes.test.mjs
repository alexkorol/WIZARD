// Regression guards for the FrameKit game's independent side-pane architecture.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const game = new URL('../tools/gui_framekit/game/', import.meta.url);
const read = name => readFileSync(new URL(name, game), 'utf8');
const html = read('index.html');
const core = read('core.js');
const character = read('character.js');
const panes = read('panes.js');
const tree = read('tree.js');
const world = read('world.js');

function attrs(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) {
    result[match[1]] = match[2] ?? '';
  }
  return result;
}

function tags(name, source = html) {
  return Array.from(source.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g')), match => ({
    tag: match[0],
    attrs: attrs(match[0]),
  }));
}

/* ----------------------------------------------------------- markup contract */
assert.match(html, /<section id="paneLayer"(?:\s|>)/, 'the independent pane layer is missing');
assert.doesNotMatch(html, /\bid="tabs"(?:\s|>)/, 'legacy top tabs must not return');
assert.doesNotMatch(html, /\bdata-panel=/, 'legacy data-panel routing must not return');
for (const id of ['charScreen', 'tradeScreen', 'shopScreen']) {
  assert.doesNotMatch(html, new RegExp(`\\bid="${id}"(?:\\s|>)`), `${id} legacy overlay must not return`);
  assert.doesNotMatch(core, new RegExp(`#${id}\\b`), `${id} legacy route must not return`);
}
assert.doesNotMatch(core, /const\s+panels\s*=/, 'the legacy single-panel registry must not return');
assert.doesNotMatch(world, /\bopen:\s*["']shop["']/, 'NPCs must route to the reliquary pane, not the removed shop overlay');
for (const id of ['inventoryActions', 'inventoryPrimary', 'inventoryUse', 'tradeAddOffer', 'tradeAccept', 'tradeCancel', 'toast']) {
  assert.match(html, new RegExp(`\\bid="${id}"`), `${id} interaction surface is missing`);
}
assert.match(character, /aria-pressed/, 'inventory selection must expose its selected state');
assert.match(character, /movePrimary/, 'inventory must expose keyboard and button equip actions');
assert.match(tree, /setAttribute\("role", "button"\)/, 'Skill Web nodes must expose button semantics');
assert.match(world, /Return to the Sunken Archive/, 'combat return portal must retain its accessible route');
assert.match(world, /tradeAccept\.addEventListener/, 'Trade must retain the accept-offer workflow');

const expected = {
  left: {
    stats: 'C', stash: 'K', trade: 'T', codex: 'L', crafting: 'F', reliquary: 'B',
  },
  right: { inventory: 'I', cosmetics: 'O' },
};
const launchers = tags('button').filter(({ attrs: a }) => a.class?.split(/\s+/).includes('pane-launch'));
assert.equal(launchers.length, 8, 'expected six left and two right pane launchers');

for (const [side, paneMap] of Object.entries(expected)) {
  const shell = tags('aside').find(({ attrs: a }) => a.id === `${side}Pane`);
  assert.ok(shell, `${side} pane shell is missing`);
  assert.ok(shell.attrs.class.split(/\s+/).includes('closed'), `${side} pane must start closed`);
  assert.equal(shell.attrs['data-side'], side);
  assert.equal(shell.attrs['aria-hidden'], 'true');
  assert.equal(shell.attrs['aria-labelledby'], `${side}PaneTitle`);

  const title = tags('h2').find(({ attrs: a }) => a.id === `${side}PaneTitle`);
  assert.ok(title, `${side} pane accessible title is missing`);
  assert.equal(title.attrs.tabindex, '-1', `${side} pane title must accept programmatic focus`);

  const close = tags('button').find(({ attrs: a }) =>
    a.class?.split(/\s+/).includes('pane-close') && a['data-side'] === side);
  assert.ok(close, `${side} pane close control is missing`);
  assert.ok(close.attrs['aria-label'], `${side} pane close control needs an accessible name`);

  const sideLaunchers = launchers.filter(({ attrs: a }) => a['data-side'] === side);
  assert.deepEqual(sideLaunchers.map(({ attrs: a }) => a['data-pane']), Object.keys(paneMap));
  for (const { attrs: launcher } of sideLaunchers) {
    assert.equal(launcher['aria-controls'], `${side}Pane`);
    assert.equal(launcher['aria-expanded'], 'false');
    const shortcut = paneMap[launcher['data-pane']];
    if (shortcut) assert.equal(launcher['aria-keyshortcuts'], shortcut);
  }

  const shellMarkup = html.match(new RegExp(`<aside id="${side}Pane"[\\s\\S]*?<\\/aside>`))?.[0] || '';
  const views = tags('section', shellMarkup)
    .filter(({ attrs: a }) => a.class?.split(/\s+/).includes('pane-view'))
    .map(({ attrs: a }) => a['data-pane']);
  assert.deepEqual(views, Object.keys(paneMap), `${side} pane views and launchers must stay aligned`);
}

/* --------------------------------------------------------- cache-bust contract */
const scripts = tags('script').map(({ attrs: a }) => a.src).filter(Boolean);
assert.deepEqual(scripts.map(src => src.replace(/\?v=\d+$/, '')), [
  'core.js', 'character.js', 'tree.js', 'panes.js', 'world.js', 'pane-content.js',
]);
for (const src of scripts) {
  assert.match(src, /^[\w-]+\.js\?v=[1-9]\d*$/, `${src} must carry a numeric cache-busting version`);
  assert.ok(existsSync(new URL(src.split('?')[0], game)), `${src} points to a missing script`);
}
const styles = tags('link')
  .map(({ attrs: a }) => a)
  .filter(a => a.rel === 'stylesheet' && !/^https?:/.test(a.href || ''));
assert.deepEqual(styles.map(a => a.href.replace(/\?v=\d+$/, '')), ['game.css', 'panes.css']);
for (const style of styles) {
  assert.match(style.href, /^[\w-]+\.css\?v=[1-9]\d*$/, `${style.href} must be cache-busted`);
  assert.ok(existsSync(new URL(style.href.split('?')[0], game)), `${style.href} points to a missing stylesheet`);
}

/* ----------------------------------------------- controller state/accessibility */
assert.match(panes, /FK\.paneState\s*=\s*\{\s*left:\s*null,\s*right:\s*null\s*\}/);
for (const method of ['openPane', 'closePane', 'togglePane']) {
  assert.match(panes, new RegExp(`FK\\.${method}\\s*=`), `FK.${method} must remain public`);
}
assert.match(panes, /new CustomEvent\("fk-pane"/, 'pane state changes need an observable event');
assert.match(panes, /shell\.inert\s*=\s*!isOpen/, 'closed panes must leave the focus order');
assert.match(panes, /setAttribute\("aria-hidden"/, 'shells and inactive views must be hidden from assistive tech');
assert.match(panes, /setAttribute\("aria-pressed"/, 'active launcher state must be exposed');
assert.match(panes, /setAttribute\("aria-expanded"/, 'launcher expansion state must be exposed');
assert.match(panes, /addEventListener\("keydown",[\s\S]*\},\s*true\);/, 'pane Escape routing must run in capture');

// Execute the real controller against a minimal DOM. This catches behavior that
// source-presence assertions cannot: side independence, recency, focus, and events.
class FakeClassList {
  constructor(names = '') { this.names = new Set(names.split(/\s+/).filter(Boolean)); }
  contains(name) { return this.names.has(name); }
  toggle(name, force) {
    const enabled = force === undefined ? !this.names.has(name) : Boolean(force);
    if (enabled) this.names.add(name);
    else this.names.delete(name);
    return enabled;
  }
}

class FakeElement {
  constructor(doc, { id = '', tag = 'DIV', classes = '', dataset = {}, text = '', attributes = {} } = {}) {
    this.ownerDocument = doc;
    this.id = id;
    this.tagName = tag;
    this.classList = new FakeClassList(classes);
    this.dataset = { ...dataset };
    this.textContent = text;
    this.attributes = new Map(Object.entries(attributes));
    this.isContentEditable = false;
    this.views = [];
    this.closeButton = null;
    this.titleElement = null;
    this.inert = false;
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  querySelectorAll(selector) {
    if (selector === '.pane-view[data-pane]') return this.views;
    if (selector === '.pane-close[data-side]') return this.closeButton ? [this.closeButton] : [];
    return [];
  }
  querySelector(selector) {
    if (selector.includes('[data-pane-title]') || selector.includes('.pane-title')) return this.titleElement;
    return null;
  }
  matches(selector) { return selector.includes('[tabindex]') && this.attributes.has('tabindex'); }
  closest() { return null; }
  focus() { this.ownerDocument.activeElement = this; }
}

class FakeDocument {
  constructor() {
    this.readyState = 'complete';
    this.listeners = new Map();
    this.elements = new Map();
    this.activeElement = null;
  }
  add(element) { if (element.id) this.elements.set(element.id, element); return element; }
  getElementById(id) { return this.elements.get(id) || null; }
  querySelectorAll(selector) { return selector === '.pane-launch[data-side][data-pane]' ? this.launchers : []; }
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(callback);
  }
  dispatchEvent(event) {
    for (const callback of this.listeners.get(event.type) || []) callback(event);
    return true;
  }
}

class FakeCustomEvent {
  constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
}

const document = new FakeDocument();
const make = options => new FakeElement(document, options);
const layer = document.add(make({ id: 'paneLayer' }));
document.body = make({ id: 'body', tag: 'BODY' });
document.activeElement = document.body;

function makeSide(side, names) {
  const title = document.add(make({
    id: `${side}PaneTitle`, tag: 'H2', classes: 'pane-title', text: side,
    attributes: { tabindex: '-1' },
  }));
  const close = make({ tag: 'BUTTON', classes: 'pane-close', dataset: { side } });
  const shell = document.add(make({ id: `${side}Pane`, classes: 'pane-shell closed' }));
  shell.titleElement = title;
  shell.closeButton = close;
  shell.views = names.map(name => make({ tag: 'SECTION', classes: 'pane-view', dataset: { pane: name } }));
  return shell;
}

const left = makeSide('left', Object.keys(expected.left));
const right = makeSide('right', Object.keys(expected.right));
document.launchers = Object.entries(expected).flatMap(([side, paneMap]) =>
  Object.keys(paneMap).map(name => make({
    id: `${side}-${name}`, tag: 'BUTTON', classes: 'pane-launch',
    dataset: { side, pane: name }, text: name,
  })));

const windowListeners = new Map();
const context = {
  window: { FK: { scene: 'town', panel: null } },
  document,
  Element: FakeElement,
  CustomEvent: FakeCustomEvent,
  addEventListener(type, callback, capture) {
    if (!windowListeners.has(type)) windowListeners.set(type, []);
    windowListeners.get(type).push({ callback, capture });
  },
};
const paneEvents = [];
document.addEventListener('fk-pane', event => paneEvents.push(event.detail));
vm.runInNewContext(panes, context, { filename: 'panes.js' });
const FK = context.window.FK;

assert.deepEqual({ ...FK.paneState }, { left: null, right: null });
assert.equal(left.inert, true);
assert.equal(right.inert, true);
assert.ok(document.launchers.every(button => button.getAttribute('aria-pressed') === 'false'));

assert.equal(FK.openPane('left', 'stats'), true);
assert.equal(FK.openPane('right', 'inventory'), true);
assert.deepEqual({ ...FK.paneState }, { left: 'stats', right: 'inventory' });
assert.equal(left.getAttribute('aria-hidden'), 'false');
assert.equal(right.getAttribute('aria-hidden'), 'false');
assert.equal(left.inert, false);
assert.equal(right.inert, false);

assert.equal(FK.openPane('left', 'stash'), true);
assert.deepEqual({ ...FK.paneState }, { left: 'stash', right: 'inventory' }, 'switching left must not close right');
assert.equal(FK.openPane('right', 'cosmetics'), true);
assert.deepEqual({ ...FK.paneState }, { left: 'stash', right: 'cosmetics' }, 'switching right must not close left');
assert.equal(FK.openPane('left', 'missing'), false, 'unknown pane names must fail safely');

function keydown(key, target = document.body) {
  const event = {
    type: 'keydown', key, target, defaultPrevented: false,
    ctrlKey: false, metaKey: false, altKey: false, repeat: false,
    preventDefault() { this.defaultPrevented = true; },
    stopImmediatePropagation() { this.immediateStopped = true; },
  };
  for (const { callback } of windowListeners.get('keydown') || []) callback(event);
  return event;
}

const escape = keydown('Escape');
assert.equal(escape.defaultPrevented, true);
assert.equal(escape.immediateStopped, true);
assert.deepEqual({ ...FK.paneState }, { left: 'stash', right: null }, 'Escape closes only the most-recent side');
assert.equal(document.activeElement.id, 'right-cosmetics', 'closing restores focus to its launcher');

const inventoryKey = keydown('i');
assert.equal(inventoryKey.defaultPrevented, true);
assert.deepEqual({ ...FK.paneState }, { left: 'stash', right: 'inventory' });
assert.equal(document.activeElement.id, 'rightPaneTitle', 'keyboard opening focuses the pane title');

const input = make({ tag: 'INPUT' });
keydown('k', input);
assert.equal(FK.paneState.left, 'stash', 'pane shortcuts must not fire while typing');
const vKey = keydown('v');
assert.equal(vKey.defaultPrevented, false, 'V must fall through to the existing skills workspace route');

assert.ok(paneEvents.length >= 5, 'pane changes must emit fk-pane events');
assert.deepEqual({ ...paneEvents.at(-1).state }, { left: 'stash', right: 'inventory' });
assert.equal(layer.classList.contains('active'), true);

console.log('ok gui_framekit independent panes');
