(function (global) {
  function WizardUnsupportedError(method, moduleId) {
    const error = new Error(`${moduleId || 'module'} does not support ${method}`);
    error.name = 'WizardUnsupportedError';
    error.method = method;
    error.moduleId = moduleId;
    return error;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function storage() {
    try {
      if (global.localStorage) return global.localStorage;
    } catch (_) {}
    if (!global.__wizardMemoryStorage) global.__wizardMemoryStorage = {};
    const mem = global.__wizardMemoryStorage;
    return {
      getItem(key) { return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null; },
      setItem(key, value) { mem[key] = String(value); },
      removeItem(key) { delete mem[key]; }
    };
  }

  function isDevMode() {
    if (global.WIZARD_DEV === true) return true;
    try {
      const params = new URLSearchParams(global.location && global.location.search || '');
      return params.get('dev') === '1';
    } catch (_) {
      return false;
    }
  }

  function snapshotKey(moduleId, slot) {
    return `wizard.snapshot.${moduleId}.${slot}.v1`;
  }

  function toAgentMarkdown(calibration) {
    const lines = [
      `# Agent feedback — ${calibration.moduleId}`,
      '',
      `- Exported: ${calibration.exportedAt}`,
      `- Scenario: ${calibration.scenarioId || 'none'}`,
      `- State version payload: JSON follows`,
      '',
      '## State',
      '',
      '```json',
      JSON.stringify(calibration.state || {}, null, 2),
      '```',
      ''
    ];
    if (calibration.snapshotA || calibration.snapshotB) {
      lines.push('## Snapshots', '');
      if (calibration.snapshotA) {
        lines.push('### A', '', '```json', JSON.stringify(calibration.snapshotA, null, 2), '```', '');
      }
      if (calibration.snapshotB) {
        lines.push('### B', '', '```json', JSON.stringify(calibration.snapshotB, null, 2), '```', '');
      }
    }
    const notes = calibration.annotations || [];
    lines.push(`## Annotations (${notes.length})`, '');
    if (!notes.length) lines.push('_None._', '');
    notes.forEach((note, index) => {
      lines.push(`### ${index + 1}. ${note.title || note.id} (${note.type}, ${note.status})`);
      const anchor = note.anchor || {};
      lines.push(`- Anchor: \`${anchor.kind}\` ${JSON.stringify(anchor[anchor.kind] || anchor)}`);
      if (note.proposal) {
        lines.push(`- Proposal: ${note.proposal.kind} — ${note.proposal.name || '(unnamed)'}`);
        if (note.proposal.mechanicalText) lines.push(`- Mechanical: ${note.proposal.mechanicalText}`);
      }
      if (note.body) lines.push('', note.body, '');
      else lines.push('');
    });
    return lines.join('\n');
  }

  const registry = new Map();

  function wrapUnsupported(adapter, method) {
    const listed = adapter.unsupportedMethods || [];
    if (typeof adapter[method] === 'function') return adapter[method].bind(adapter);
    if (listed.includes(method)) {
      return function () { throw WizardUnsupportedError(method, adapter.id); };
    }
    return function () { throw WizardUnsupportedError(method, adapter.id); };
  }

  function register(adapter) {
    if (!adapter || !adapter.id) throw new Error('WizardLab.register requires id');
    const methods = [
      'reset', 'getState', 'setState', 'listScenarios', 'loadScenario',
      'pause', 'resume', 'step', 'getMetrics', 'getAnnotations', 'setAnnotations',
      'exportCalibration', 'importCalibration'
    ];
    const bound = { id: adapter.id, unsupportedMethods: adapter.unsupportedMethods || [] };
    methods.forEach(method => { bound[method] = wrapUnsupported(adapter, method); });
    if (typeof adapter.applyEvent === 'function') bound.applyEvent = adapter.applyEvent.bind(adapter);
    if (typeof adapter.exportCalibration !== 'function') {
      bound.exportCalibration = function () {
        return {
          schemaVersion: 1,
          moduleId: adapter.id,
          exportedAt: nowIso(),
          scenarioId: bound._scenarioId || 'default',
          state: typeof adapter.getState === 'function' ? adapter.getState() : {},
          snapshotA: readSnapshot(adapter.id, 'A'),
          snapshotB: readSnapshot(adapter.id, 'B'),
          annotations: (function () {
            try {
              return typeof adapter.getAnnotations === 'function' ? adapter.getAnnotations() : [];
            } catch (error) {
              if (error && error.name === 'WizardUnsupportedError') return [];
              throw error;
            }
          })(),
          metrics: (function () {
            try {
              return typeof adapter.getMetrics === 'function' ? adapter.getMetrics() : {};
            } catch (error) {
              if (error && error.name === 'WizardUnsupportedError') return {};
              throw error;
            }
          })()
        };
      };
    }
    if (typeof adapter.importCalibration !== 'function') {
      bound.importCalibration = function (data) {
        if (!data || data.moduleId && data.moduleId !== adapter.id) {
          throw new Error('Calibration payload moduleId mismatch');
        }
        if (typeof adapter.setState === 'function' && data.state) adapter.setState(data.state);
        if (typeof adapter.setAnnotations === 'function' && data.annotations) adapter.setAnnotations(data.annotations);
        return bound.getState();
      };
    }
    registry.set(adapter.id, bound);
    global.WizardModule = bound;
    return bound;
  }

  function get(id) {
    if (id) return registry.get(id) || null;
    return global.WizardModule || null;
  }

  function readSnapshot(moduleId, slot) {
    const raw = storage().getItem(snapshotKey(moduleId, slot));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (_) { return null; }
  }

  function writeSnapshot(moduleId, slot, payload) {
    storage().setItem(snapshotKey(moduleId, slot), JSON.stringify(payload));
    return payload;
  }

  function optionalCall(mod, method, fallback) {
    try {
      if (typeof mod[method] !== 'function') return fallback;
      return mod[method]();
    } catch (error) {
      if (error && error.name === 'WizardUnsupportedError') return fallback;
      throw error;
    }
  }

  function captureSnapshot(slot) {
    const mod = get();
    if (!mod) throw new Error('No WizardModule registered');
    const payload = {
      capturedAt: nowIso(),
      slot,
      state: mod.getState(),
      metrics: optionalCall(mod, 'getMetrics', {}),
      annotations: optionalCall(mod, 'getAnnotations', [])
    };
    return writeSnapshot(mod.id, slot, payload);
  }

  function loadSnapshot(slot) {
    const mod = get();
    if (!mod) throw new Error('No WizardModule registered');
    const payload = readSnapshot(mod.id, slot);
    if (!payload) throw new Error(`Snapshot ${slot} is empty`);
    if (typeof mod.setState === 'function' && payload.state) mod.setState(payload.state);
    try {
      if (typeof mod.setAnnotations === 'function' && payload.annotations) mod.setAnnotations(payload.annotations);
    } catch (error) {
      if (!error || error.name !== 'WizardUnsupportedError') throw error;
    }
    return payload;
  }

  function compareSnapshots() {
    const mod = get();
    if (!mod) throw new Error('No WizardModule registered');
    return { A: readSnapshot(mod.id, 'A'), B: readSnapshot(mod.id, 'B') };
  }

  const WizardLab = {
    WizardUnsupportedError,
    isDevMode,
    register,
    get,
    clone,
    nowIso,
    storage,
    captureSnapshot,
    loadSnapshot,
    compareSnapshots,
    toAgentMarkdown,
    copyAgentMarkdown(calibration) {
      const text = toAgentMarkdown(calibration);
      if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
        return global.navigator.clipboard.writeText(text).then(() => text);
      }
      return Promise.resolve(text);
    }
  };

  global.WizardLab = WizardLab;
  if (typeof module !== 'undefined' && module.exports) module.exports = WizardLab;
})(typeof window !== 'undefined' ? window : globalThis);
