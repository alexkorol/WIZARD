import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';

const INDEX_PATH = new URL('../index.html', import.meta.url);
const TREE_DATA_PATH = new URL('../assets/tree-data.js', import.meta.url);
const STATS_PATH = new URL('../../rpg_inventory/core/verdigris-stats.js', import.meta.url);
const PATTERNS_PATH = new URL('../assets/patterns.js', import.meta.url);
const JEWELS_PATH = new URL('../assets/jewels.js', import.meta.url);

class FakeClassList {
  constructor(owner) {
    this.owner = owner;
    this.values = new Set();
  }

  add(...names) {
    names.forEach(name => this.values.add(name));
    this.sync();
  }

  remove(...names) {
    names.forEach(name => this.values.delete(name));
    this.sync();
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.values.has(name) : Boolean(force);
    if (shouldAdd) {
      this.values.add(name);
    } else {
      this.values.delete(name);
    }
    this.sync();
    return shouldAdd;
  }

  contains(name) {
    return this.values.has(name);
  }

  sync() {
    this.owner.className = Array.from(this.values).join(' ');
  }
}

class FakeStyle {
  setProperty(name, value) {
    this[name] = value;
  }
}

class FakeElement {
  constructor(tagName = 'div', ownerDocument = null) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.attributes = new Map();
    this.children = [];
    this.dataset = {};
    this.style = new FakeStyle();
    this.className = '';
    this.classList = new FakeClassList(this);
    this.listeners = new Map();
    this.textContent = '';
    this.innerHTML = '';
    this.value = '';
    this.disabled = false;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === 'id' && this.ownerDocument) this.ownerDocument.register(String(value), this);
    if (name === 'class') {
      this.className = String(value);
      this.classList.values = new Set(String(value).split(/\s+/).filter(Boolean));
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  querySelector(selector) {
    return this.ownerDocument.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.ownerDocument.querySelectorAll(selector);
  }

  closest() {
    return null;
  }

  setPointerCapture() {}

  releasePointerCapture() {}

  getBoundingClientRect() {
    return { width: 1280, height: 900, left: 0, top: 0, right: 1280, bottom: 900 };
  }
}

class FakeDocument {
  constructor() {
    this.elements = new Map();
    this.body = new FakeElement('body', this);
    this.listeners = new Map();
  }

  register(id, element) {
    this.elements.set(id, element);
  }

  getElementById(id) {
    if (!this.elements.has(id)) {
      const element = new FakeElement('div', this);
      element.setAttribute('id', id);
    }
    return this.elements.get(id);
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  createElementNS(_namespace, tagName) {
    return new FakeElement(tagName, this);
  }

  querySelector(selector) {
    if (selector.startsWith('#')) return this.getElementById(selector.slice(1));
    if (selector.startsWith('.')) {
      return this.querySelectorAll(selector)[0] || new FakeElement('div', this);
    }
    return new FakeElement('div', this);
  }

  querySelectorAll(selector) {
    if (!selector.startsWith('.')) return [];
    const className = selector.slice(1);
    return Array.from(this.elements.values()).filter(element => element.classList.contains(className));
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }
}

export function extractMainScript(html) {
  const marker = '<script src="assets/tree-data.js?v=';
  const dataScriptIndex = html.indexOf(marker);
  assert.ok(dataScriptIndex > 0, 'tree-data.js script tag should exist.');
  const scriptStart = html.indexOf('<script>', dataScriptIndex + marker.length);
  const bodyStart = html.indexOf('>', scriptStart) + 1;
  const scriptEnd = html.indexOf('</script>', bodyStart);
  assert.ok(scriptStart > dataScriptIndex, 'Main app script should follow tree-data.js.');
  return html.slice(bodyStart, scriptEnd);
}

export function createRuntime() {
  const document = new FakeDocument();
  const window = {
    document,
    innerWidth: 1280,
    innerHeight: 900,
    addEventListener() {},
    matchMedia() {
      return {
        matches: false,
        addEventListener() {}
      };
    }
  };
  const context = {
    window,
    self: window,
    document,
    console,
    Math,
    Number,
    Array,
    Object,
    Set,
    Map,
    Boolean,
    String,
    JSON,
    RegExp,
    parseInt,
    setTimeout(callback) {
      callback();
      return 0;
    }
  };
  window.window = window;
  window.console = console;
  window.setTimeout = context.setTimeout;
  return createContext(context);
}

export function runStandaloneApp() {
  const runtime = createRuntime();
  const statsSource = readFileSync(STATS_PATH, 'utf8');
  new Script(statsSource, { filename: STATS_PATH.pathname }).runInContext(runtime);

  const treeDataSource = readFileSync(TREE_DATA_PATH, 'utf8');
  new Script(treeDataSource, { filename: TREE_DATA_PATH.pathname }).runInContext(runtime);

  const patternsSource = readFileSync(PATTERNS_PATH, 'utf8');
  new Script(patternsSource, { filename: PATTERNS_PATH.pathname }).runInContext(runtime);

  const jewelsSource = readFileSync(JEWELS_PATH, 'utf8');
  new Script(jewelsSource, { filename: JEWELS_PATH.pathname }).runInContext(runtime);

  const html = readFileSync(INDEX_PATH, 'utf8');
  const mainScript = extractMainScript(html);
  new Script(mainScript, { filename: INDEX_PATH.pathname }).runInContext(runtime);
  return runtime.window;
}

