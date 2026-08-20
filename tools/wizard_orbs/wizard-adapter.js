(function (global) {
  const MODULE_ID = 'wizard.orbs';
  const HP_MAX = 1000;
  const MP_MAX = 800;

  function bridge() {
    return global.__WizardOrbs || null;
  }

  function readRuntime() {
    const api = bridge();
    if (!api || !api.S) {
      return {
        hp: 1, mp: 1, resL: 0, resR: 0, poison: 0, bleedStacks: 0, hpRegen: false, mpRegen: true
      };
    }
    const S = api.S;
    return {
      hp: S.hp,
      mp: S.mp,
      resL: S.resL,
      resR: S.resR,
      poison: S.poison,
      bleedStacks: Array.isArray(S.bleedT) ? S.bleedT.length : 0,
      hpRegen: !!S.hpRegen,
      mpRegen: !!S.mpRegen
    };
  }

  function applyState(state) {
    const api = bridge();
    if (!api) return readRuntime();
    const S = api.S;
    if (state.resL != null) S.resL = state.resL;
    if (state.resR != null) S.resR = state.resR;
    if (state.poison != null) S.poison = state.poison;
    if (state.hpRegen != null) S.hpRegen = state.hpRegen;
    if (state.mpRegen != null) S.mpRegen = state.mpRegen;
    if (typeof api.setHP === 'function') api.setHP(state.hp != null ? state.hp : S.hp, false);
    if (typeof api.setMP === 'function') api.setMP(state.mp != null ? state.mp : S.mp, false);
    return readRuntime();
  }

  const SCENARIOS = {
    full: { id: 'full', state: { hp: 1, mp: 1, resL: 0, resR: 0, poison: 0, hpRegen: false, mpRegen: true } },
    'low-life': { id: 'low-life', state: { hp: 0.18, mp: 0.4, resL: 0, resR: 0, poison: 0 } },
    reserved: { id: 'reserved', state: { hp: 0.72, mp: 0.55, resL: 0.25, resR: 0.4, poison: 0 } },
    poisoned: { id: 'poisoned', state: { hp: 0.62, mp: 0.8, resL: 0, resR: 0, poison: 1 } }
  };

  function applyEvent(event) {
    if (!event || event.type !== 'resource.changed') return readRuntime();
    const data = event.data || {};
    const current = readRuntime();
    const maximum = Number(data.maximum) || (data.resource === 'mana' ? MP_MAX : HP_MAX);
    const ratio = maximum ? Number(data.current) / maximum : 0;
    if (data.resource === 'mana') applyState({ ...current, mp: ratio });
    else applyState({ ...current, hp: ratio });
    return readRuntime();
  }

  const adapter = {
    id: MODULE_ID,
    unsupportedMethods: ['pause', 'resume', 'step', 'getAnnotations', 'setAnnotations'],
    reset() { return applyState(SCENARIOS.full.state); },
    getState() { return readRuntime(); },
    setState(state) { return applyState(state || {}); },
    listScenarios() { return Object.keys(SCENARIOS); },
    loadScenario(id) {
      const scenario = SCENARIOS[id];
      if (!scenario) throw new Error(`Unknown scenario ${id}`);
      adapter._scenarioId = id;
      return applyState(scenario.state);
    },
    getMetrics() {
      const state = readRuntime();
      return {
        life: Math.round(state.hp * HP_MAX),
        lifeMax: HP_MAX,
        mana: Math.round(state.mp * MP_MAX),
        manaMax: MP_MAX
      };
    },
    applyEvent
  };

  if (global.WizardLab) {
    adapter._scenarioId = 'full';
    global.WizardLab.register(adapter);
  }

  if (typeof global.addEventListener === 'function') {
    global.addEventListener('message', event => {
      const payload = event.data || {};
      if (payload.wizardEvent && global.WizardModule && typeof global.WizardModule.applyEvent === 'function') {
        global.WizardModule.applyEvent(payload.wizardEvent);
      }
      if (payload.wizardCommand === 'importCalibration' && payload.data && global.WizardModule) {
        global.WizardModule.importCalibration(payload.data);
      }
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applyEvent: (event, state) => {
    const HP_MAX = 1000, MP_MAX = 800;
    const next = Object.assign({ hp: 1, mp: 1 }, state);
    if (!event || event.type !== 'resource.changed') return next;
    const data = event.data || {};
    const maximum = Number(data.maximum) || (data.resource === 'mana' ? MP_MAX : HP_MAX);
    const ratio = maximum ? Number(data.current) / maximum : 0;
    if (data.resource === 'mana') next.mp = ratio;
    else next.hp = ratio;
    return next;
  } };
}
