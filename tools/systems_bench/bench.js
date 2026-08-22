(function (global) {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function invariant(condition, message) {
    if (!condition) throw new Error(message);
  }

  function validateEvent(event, expectedSequence, previousTimeMs) {
    const label = `event ${expectedSequence}`;
    invariant(isObject(event), `${label} must be an object`);
    invariant(event.schemaVersion === 1, `${label} schemaVersion must be 1`);
    invariant(Number.isInteger(event.sequence), `${label} sequence must be an integer`);
    invariant(event.sequence === expectedSequence, `${label} sequence must equal ${expectedSequence}`);
    invariant(Number.isFinite(event.timeMs) && event.timeMs >= 0, `${label} timeMs must be non-negative`);
    invariant(event.timeMs >= previousTimeMs, `${label} timeMs must not move backwards`);
    invariant(typeof event.type === 'string' && event.type.length > 0, `${label} type required`);
    invariant(typeof event.source === 'string' && event.source.length > 0, `${label} source required`);
    invariant(typeof event.target === 'string' && event.target.length > 0, `${label} target required`);
    invariant(isObject(event.data), `${label} data must be an object`);
    return event;
  }

  function validateFixture(fixture) {
    invariant(isObject(fixture), 'fixture must be an object');
    invariant(fixture.schemaVersion === 1, 'fixture schemaVersion must be 1');
    invariant(typeof fixture.id === 'string' && fixture.id.length > 0, 'fixture id required');
    invariant(typeof fixture.name === 'string' && fixture.name.length > 0, 'fixture name required');
    invariant(typeof fixture.targetModuleId === 'string' && fixture.targetModuleId.length > 0, 'fixture targetModuleId required');
    invariant(Array.isArray(fixture.events) && fixture.events.length > 0, 'fixture events must be a non-empty array');
    let previousTimeMs = 0;
    fixture.events.forEach(function (event, index) {
      validateEvent(event, index, previousTimeMs);
      previousTimeMs = event.timeMs;
    });
    return fixture;
  }

  function validateCatalog(catalog) {
    invariant(isObject(catalog), 'catalog must be an object');
    invariant(catalog.schemaVersion === 1, 'catalog schemaVersion must be 1');
    invariant(Array.isArray(catalog.fixtures) && catalog.fixtures.length > 0, 'catalog fixtures must be a non-empty array');
    const ids = new Set();
    catalog.fixtures.forEach(function (entry, index) {
      const label = `catalog fixture ${index}`;
      invariant(isObject(entry), `${label} must be an object`);
      invariant(typeof entry.id === 'string' && entry.id.length > 0, `${label} id required`);
      invariant(!ids.has(entry.id), `${label} id must be unique`);
      ids.add(entry.id);
      invariant(typeof entry.path === 'string' && /^fixtures\/[a-z0-9._-]+\.json$/.test(entry.path), `${label} path must be a local fixture JSON file`);
      invariant(typeof entry.targetModuleId === 'string' && entry.targetModuleId.length > 0, `${label} targetModuleId required`);
      invariant(entry.view === 'iframe' || entry.view === 'inventory-preview', `${label} view is invalid`);
      if (entry.view === 'iframe') {
        invariant(typeof entry.src === 'string' && entry.src.startsWith('../'), `${label} iframe src required`);
      }
    });
    return catalog;
  }

  function createBench(fixture) {
    validateFixture(fixture);
    const events = clone(fixture.events);
    const bench = {
      fixtureId: fixture.id,
      events,
      index: -1,
      timeMs: 0,
      playing: false,
      applied: [],
      lastPayload: null,
      reset() {
        bench.index = -1;
        bench.timeMs = 0;
        bench.playing = false;
        bench.applied = [];
        bench.lastPayload = null;
        return bench.snapshot();
      },
      play() {
        if (bench.index + 1 < events.length) bench.playing = true;
        return bench.snapshot();
      },
      pause() { bench.playing = false; return bench.snapshot(); },
      step() {
        if (bench.index + 1 >= events.length) {
          bench.playing = false;
          return null;
        }
        bench.index += 1;
        const event = events[bench.index];
        bench.timeMs = event.timeMs;
        bench.lastPayload = event;
        bench.applied.push(event);
        if (bench.index + 1 >= events.length) bench.playing = false;
        return clone(event);
      },
      tick(dtMs) {
        if (!bench.playing) return [];
        invariant(Number.isFinite(dtMs) && dtMs >= 0, 'tick dtMs must be non-negative');
        const targetTimeMs = bench.timeMs + dtMs;
        const due = [];
        while (bench.index + 1 < events.length && events[bench.index + 1].timeMs <= targetTimeMs) {
          bench.index += 1;
          const event = events[bench.index];
          bench.lastPayload = event;
          bench.applied.push(event);
          due.push(clone(event));
        }
        bench.timeMs = targetTimeMs;
        if (bench.index + 1 >= events.length) bench.playing = false;
        return due;
      },
      restore(state) {
        invariant(isObject(state), 'bench state must be an object');
        if (state.fixtureId) invariant(state.fixtureId === fixture.id, 'bench state fixtureId mismatch');
        invariant(Number.isInteger(state.index) && state.index >= -1 && state.index < events.length, 'bench state index is invalid');
        bench.reset();
        for (let index = 0; index <= state.index; index += 1) bench.step();
        if (Number.isFinite(state.timeMs) && state.timeMs >= bench.timeMs) bench.timeMs = state.timeMs;
        bench.playing = !!state.playing && bench.index + 1 < events.length;
        return bench.snapshot();
      },
      snapshot() {
        return {
          schemaVersion: 1,
          moduleId: 'wizard.systems-bench',
          fixtureId: fixture.id,
          targetModuleId: fixture.targetModuleId,
          index: bench.index,
          timeMs: bench.timeMs,
          playing: bench.playing,
          applied: clone(bench.applied),
          lastPayload: bench.lastPayload ? clone(bench.lastPayload) : null
        };
      }
    };
    return bench;
  }

  function createInventoryPreviewState() {
    return {
      schemaVersion: 1,
      gold: 0,
      inventory: [],
      equipment: {},
      note: 'No inventory event applied.'
    };
  }

  function applyInventoryStateEvent(state, event) {
    validateEvent(event, event.sequence, 0);
    invariant(event.type === 'inventory.state.changed', `unsupported inventory event type ${event.type}`);
    const data = event.data;
    invariant(data.stateVersion === 1, 'inventory stateVersion must be 1');
    invariant(Number.isFinite(data.gold) && data.gold >= 0, 'inventory gold must be non-negative');
    invariant(Array.isArray(data.inventory), 'inventory state inventory must be an array');
    invariant(isObject(data.equipment), 'inventory state equipment must be an object');
    const itemIds = new Set();
    data.inventory.forEach(function (item, index) {
      invariant(isObject(item), `inventory item ${index} must be an object`);
      invariant(typeof item.id === 'string' && item.id.length > 0, `inventory item ${index} id required`);
      invariant(typeof item.name === 'string' && item.name.length > 0, `inventory item ${index} name required`);
      invariant(!itemIds.has(item.id), `inventory item ${index} id must be unique`);
      itemIds.add(item.id);
    });
    Object.keys(data.equipment).forEach(function (slot) {
      const item = data.equipment[slot];
      invariant(item === null || (isObject(item) && typeof item.id === 'string' && typeof item.name === 'string'), `equipment slot ${slot} is invalid`);
    });
    return {
      schemaVersion: 1,
      gold: data.gold,
      inventory: clone(data.inventory),
      equipment: clone(data.equipment),
      note: typeof data.note === 'string' ? data.note : '',
      lastSequence: event.sequence
    };
  }

  function createSessionExport(fixture, benchState, targetState, exportedAt) {
    validateFixture(fixture);
    invariant(isObject(benchState) && benchState.fixtureId === fixture.id, 'export bench state fixtureId mismatch');
    return {
      schemaVersion: 1,
      moduleId: 'wizard.systems-bench',
      exportedAt: exportedAt || new Date().toISOString(),
      scenarioId: fixture.id,
      state: clone(benchState),
      targetState: clone(targetState || {}),
      events: clone(fixture.events)
    };
  }

  const api = {
    applyInventoryStateEvent,
    createBench,
    createInventoryPreviewState,
    createSessionExport,
    validateCatalog,
    validateEvent,
    validateFixture
  };

  global.WizardSystemsBench = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
