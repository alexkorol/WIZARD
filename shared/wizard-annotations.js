(function (global) {
  const TYPES = ['idea', 'placement', 'bug', 'balance', 'visual', 'question', 'preserve'];
  const ANCHOR_KINDS = ['semantic', 'world', 'screen', 'region'];
  const PROPOSAL_KINDS = ['small_passive', 'notable', 'mastery', 'keystone', 'gateway', 'socket', 'pattern', 'visual_feature'];

  function uid(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function validate(note) {
    if (!note || note.schemaVersion !== 1) throw new Error('annotation schemaVersion must be 1');
    if (!note.id) throw new Error('annotation id required');
    if (!TYPES.includes(note.type)) throw new Error(`invalid annotation type ${note.type}`);
    if (!['open', 'resolved', 'deleted'].includes(note.status)) throw new Error('invalid annotation status');
    if (!note.anchor || !ANCHOR_KINDS.includes(note.anchor.kind)) throw new Error('invalid annotation anchor');
    if (note.proposal && !PROPOSAL_KINDS.includes(note.proposal.kind)) {
      throw new Error(`invalid proposal kind ${note.proposal.kind}`);
    }
    return note;
  }

  function create(partial) {
    const note = {
      schemaVersion: 1,
      id: partial.id || uid('ann'),
      type: partial.type || 'idea',
      status: partial.status || 'open',
      title: partial.title || '',
      body: partial.body || '',
      createdAt: partial.createdAt || nowIso(),
      updatedAt: partial.updatedAt || nowIso(),
      anchor: clone(partial.anchor || { kind: 'semantic', semantic: { targetType: 'unknown', targetId: '' } })
    };
    if (partial.proposal) note.proposal = clone(partial.proposal);
    return validate(note);
  }

  function storeKey(moduleId) {
    return `wizard.annotations.${moduleId}.v1`;
  }

  function storage() {
    if (global.WizardLab && global.WizardLab.storage) return global.WizardLab.storage();
    try {
      if (global.localStorage) return global.localStorage;
    } catch (_) {}
    global.__wizardAnnMem = global.__wizardAnnMem || {};
    const mem = global.__wizardAnnMem;
    return {
      getItem(key) { return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null; },
      setItem(key, value) { mem[key] = String(value); },
      removeItem(key) { delete mem[key]; }
    };
  }

  function loadAll(moduleId) {
    const raw = storage().getItem(storeKey(moduleId));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(validate) : [];
    } catch (_) {
      return [];
    }
  }

  function saveAll(moduleId, notes) {
    const clean = notes.map(validate);
    storage().setItem(storeKey(moduleId), JSON.stringify(clean));
    return clean;
  }

  function upsert(moduleId, note) {
    const next = create({ ...note, updatedAt: nowIso() });
    const list = loadAll(moduleId).filter(item => item.id !== next.id);
    list.push(next);
    return saveAll(moduleId, list);
  }

  function remove(moduleId, id) {
    const list = loadAll(moduleId).map(item => (
      item.id === id ? { ...item, status: 'deleted', updatedAt: nowIso() } : item
    ));
    return saveAll(moduleId, list);
  }

  function exportBundle(moduleId) {
    return {
      schemaVersion: 1,
      moduleId,
      exportedAt: nowIso(),
      annotations: loadAll(moduleId)
    };
  }

  function importBundle(moduleId, bundle) {
    if (!bundle || bundle.schemaVersion !== 1) throw new Error('annotation bundle schemaVersion must be 1');
    if (bundle.moduleId && bundle.moduleId !== moduleId) throw new Error('annotation bundle moduleId mismatch');
    const incoming = (bundle.annotations || []).map(validate);
    return saveAll(moduleId, incoming);
  }

  const WizardAnnotations = {
    TYPES,
    ANCHOR_KINDS,
    PROPOSAL_KINDS,
    create,
    validate,
    loadAll,
    saveAll,
    upsert,
    remove,
    exportBundle,
    importBundle
  };

  global.WizardAnnotations = WizardAnnotations;
  if (typeof module !== 'undefined' && module.exports) module.exports = WizardAnnotations;
})(typeof window !== 'undefined' ? window : globalThis);
