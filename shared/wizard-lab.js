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
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function hasOwn(value, key) {
    return Object.prototype.hasOwnProperty.call(value, key);
  }

  function validateCalibrationPayload(data, moduleId) {
    if (!isObject(data)) throw new Error('Calibration payload must be an object');
    if (data.schemaVersion !== 1) throw new Error('Calibration payload schemaVersion must be 1');
    if (typeof data.moduleId !== 'string' || data.moduleId !== moduleId) {
      throw new Error('Calibration payload moduleId mismatch');
    }
    if (typeof data.exportedAt !== 'string') throw new Error('Calibration payload exportedAt must be a string');
    if (typeof data.scenarioId !== 'string') throw new Error('Calibration payload scenarioId must be a string');
    if (!isObject(data.state)) throw new Error('Calibration payload state must be an object');
    if (hasOwn(data, 'annotations') && !Array.isArray(data.annotations)) {
      throw new Error('Calibration payload annotations must be an array');
    }
    if (hasOwn(data, 'metrics') && !isObject(data.metrics)) throw new Error('Calibration payload metrics must be an object');
    if (hasOwn(data, 'events') && !Array.isArray(data.events)) throw new Error('Calibration payload events must be an array');
    for (const key of ['snapshotA', 'snapshotB']) {
      if (hasOwn(data, key) && data[key] !== null && !isObject(data[key])) {
        throw new Error(`Calibration payload ${key} must be an object or null`);
      }
    }
    return clone(data);
  }

  function captureChannel(target, getter, setter, enabled) {
    if (!enabled || typeof target[getter] !== 'function' || typeof target[setter] !== 'function') {
      return { available: false, value: undefined };
    }
    try {
      return { available: true, value: clone(target[getter]()) };
    } catch (error) {
      if (error && error.name === 'WizardUnsupportedError') return { available: false, value: undefined };
      throw error;
    }
  }

  function runMutationTransaction(target, channels, operation) {
    const before = {
      state: captureChannel(target, 'getState', 'setState', channels.state),
      annotations: captureChannel(target, 'getAnnotations', 'setAnnotations', channels.annotations)
    };
    try {
      return operation();
    } catch (error) {
      const rollbackErrors = [];
      if (before.annotations.available) {
        try { target.setAnnotations(clone(before.annotations.value)); } catch (rollbackError) { rollbackErrors.push(rollbackError); }
      }
      if (before.state.available) {
        try { target.setState(clone(before.state.value)); } catch (rollbackError) { rollbackErrors.push(rollbackError); }
      }
      if (rollbackErrors.length) {
        const rollbackFailure = new Error(`Mutation failed and rollback failed: ${rollbackErrors.map(item => item.message).join('; ')}`);
        rollbackFailure.name = 'WizardRollbackError';
        rollbackFailure.cause = error;
        rollbackFailure.rollbackErrors = rollbackErrors;
        throw rollbackFailure;
      }
      throw error;
    }
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
    const bound = { id: adapter.id, unsupportedMethods: clone(adapter.unsupportedMethods || []) };
    methods.forEach(method => { bound[method] = wrapUnsupported(adapter, method); });
    if (typeof adapter.applyEvent === 'function') bound.applyEvent = adapter.applyEvent.bind(adapter);
    if (typeof adapter.exportCalibration !== 'function' && !bound.unsupportedMethods.includes('exportCalibration')) {
      bound.exportCalibration = function () {
        return {
          schemaVersion: 1,
          moduleId: adapter.id,
          exportedAt: nowIso(),
          scenarioId: bound._scenarioId || 'default',
          state: typeof adapter.getState === 'function' ? clone(adapter.getState()) : {},
          snapshotA: readSnapshot(adapter.id, 'A'),
          snapshotB: readSnapshot(adapter.id, 'B'),
          annotations: (function () {
            try {
              return typeof adapter.getAnnotations === 'function' ? clone(adapter.getAnnotations()) : [];
            } catch (error) {
              if (error && error.name === 'WizardUnsupportedError') return [];
              throw error;
            }
          })(),
          metrics: (function () {
            try {
              return typeof adapter.getMetrics === 'function' ? clone(adapter.getMetrics()) : {};
            } catch (error) {
              if (error && error.name === 'WizardUnsupportedError') return {};
              throw error;
            }
          })()
        };
      };
    }
    if (typeof adapter.importCalibration === 'function' || !bound.unsupportedMethods.includes('importCalibration')) {
      const customImport = typeof adapter.importCalibration === 'function' ? adapter.importCalibration.bind(adapter) : null;
      bound.importCalibration = function (data) {
        const payload = validateCalibrationPayload(data, adapter.id);
        const importsAnnotations = hasOwn(payload, 'annotations') && typeof adapter.setAnnotations === 'function';
        return runMutationTransaction(adapter, {
          state: customImport ? true : typeof adapter.setState === 'function',
          annotations: customImport ? true : importsAnnotations
        }, function () {
          if (customImport) return customImport(clone(payload));
          if (typeof adapter.setState !== 'function') throw WizardUnsupportedError('setState', adapter.id);
          adapter.setState(clone(payload.state));
          if (importsAnnotations) adapter.setAnnotations(clone(payload.annotations));
          return typeof adapter.getState === 'function' ? clone(adapter.getState()) : clone(payload.state);
        });
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
    const clean = clone(payload);
    storage().setItem(snapshotKey(moduleId, slot), JSON.stringify(clean));
    return clone(clean);
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
      state: clone(mod.getState()),
      metrics: clone(optionalCall(mod, 'getMetrics', {})),
      annotations: clone(optionalCall(mod, 'getAnnotations', []))
    };
    if (!isObject(payload.state)) throw new Error('Snapshot state must be an object');
    if (!Array.isArray(payload.annotations)) throw new Error('Snapshot annotations must be an array');
    return writeSnapshot(mod.id, slot, payload);
  }

  function loadSnapshot(slot) {
    const mod = get();
    if (!mod) throw new Error('No WizardModule registered');
    const payload = readSnapshot(mod.id, slot);
    if (!payload) throw new Error(`Snapshot ${slot} is empty`);
    if (!isObject(payload) || !isObject(payload.state)) throw new Error(`Snapshot ${slot} state must be an object`);
    if (hasOwn(payload, 'annotations') && !Array.isArray(payload.annotations)) {
      throw new Error(`Snapshot ${slot} annotations must be an array`);
    }
    return runMutationTransaction(mod, { state: true, annotations: hasOwn(payload, 'annotations') }, function () {
      mod.setState(clone(payload.state));
      try {
        if (hasOwn(payload, 'annotations')) mod.setAnnotations(clone(payload.annotations));
      } catch (error) {
        if (!error || error.name !== 'WizardUnsupportedError') throw error;
      }
      return clone(payload);
    });
  }

  function compareSnapshots() {
    const mod = get();
    if (!mod) throw new Error('No WizardModule registered');
    return { A: readSnapshot(mod.id, 'A'), B: readSnapshot(mod.id, 'B') };
  }

  function messageOriginAllowed(origin, options) {
    const configured = options && options.allowedOrigins;
    if (typeof configured === 'function') return configured(origin) === true;
    if (typeof configured === 'string') return origin === configured;
    if (Array.isArray(configured)) return configured.includes(origin);
    try {
      const ownOrigin = global.location && global.location.origin;
      return typeof ownOrigin === 'string' && ownOrigin !== 'null' && origin === ownOrigin;
    } catch (_) {
      return false;
    }
  }

  function validateWizardEvent(event) {
    if (!isObject(event) || event.schemaVersion !== 1) throw new Error('wizardEvent schemaVersion must be 1');
    if (!Number.isInteger(event.sequence)) throw new Error('wizardEvent sequence must be an integer');
    if (!Number.isFinite(event.timeMs) || event.timeMs < 0) throw new Error('wizardEvent timeMs must be non-negative');
    if (typeof event.type !== 'string' || !event.type) throw new Error('wizardEvent type required');
    if (typeof event.source !== 'string' || !event.source) throw new Error('wizardEvent source required');
    if (typeof event.target !== 'string' || !event.target) throw new Error('wizardEvent target required');
    if (!isObject(event.data)) throw new Error('wizardEvent data must be an object');
    return clone(event);
  }

  function handleMessageEvent(event, options = {}) {
    if (!event || !messageOriginAllowed(event.origin, options)) {
      return { handled: false, reason: 'origin-rejected' };
    }
    const envelope = event.data;
    if (!isObject(envelope)) return { handled: false, reason: 'invalid-envelope' };
    const hasEvent = hasOwn(envelope, 'wizardEvent');
    const hasCommand = hasOwn(envelope, 'wizardCommand');
    if (!hasEvent && !hasCommand) return { handled: false, reason: 'unsupported-envelope' };
    if (hasEvent && hasCommand) throw new Error('WIZARD message envelope must contain exactly one action');
    const mod = options.module || get();
    if (!mod) throw new Error('No WizardModule registered');
    if (hasEvent) {
      const wizardEvent = validateWizardEvent(envelope.wizardEvent);
      if (typeof mod.applyEvent !== 'function') throw WizardUnsupportedError('applyEvent', mod.id);
      return { handled: true, action: 'wizardEvent', result: clone(mod.applyEvent(wizardEvent)) };
    }
    if (envelope.wizardCommand !== 'importCalibration') {
      return { handled: false, reason: 'unsupported-command' };
    }
    if (!hasOwn(envelope, 'data')) throw new Error('importCalibration message data required');
    return {
      handled: true,
      action: 'importCalibration',
      result: clone(mod.importCalibration(envelope.data))
    };
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
    handleMessageEvent,
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
