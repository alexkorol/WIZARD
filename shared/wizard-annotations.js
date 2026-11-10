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
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function validateModuleId(moduleId) {
    if (typeof moduleId !== 'string' || !moduleId) throw new Error('annotation moduleId required');
    return moduleId;
  }

  function validateAnchor(anchor) {
    if (!isObject(anchor) || !ANCHOR_KINDS.includes(anchor.kind)) throw new Error('invalid annotation anchor');
    const value = anchor[anchor.kind];
    if (value !== undefined && !isObject(value)) throw new Error(`invalid ${anchor.kind} annotation anchor`);
    if (anchor.kind === 'semantic' && value) {
      if (value.targetType !== undefined && typeof value.targetType !== 'string') throw new Error('invalid semantic annotation targetType');
      if (value.targetId !== undefined && typeof value.targetId !== 'string') throw new Error('invalid semantic annotation targetId');
    }
    const numericFields = {
      world: ['x', 'y', 'z'],
      screen: ['nx', 'ny'],
      region: ['x', 'y', 'w', 'h']
    };
    for (const field of numericFields[anchor.kind] || []) {
      if (value && value[field] !== undefined && value[field] !== null && typeof value[field] !== 'number') {
        throw new Error(`invalid ${anchor.kind} annotation ${field}`);
      }
    }
    return anchor;
  }

  function validate(note) {
    if (!isObject(note) || note.schemaVersion !== 1) throw new Error('annotation schemaVersion must be 1');
    if (typeof note.id !== 'string' || !note.id) throw new Error('annotation id required');
    if (!TYPES.includes(note.type)) throw new Error(`invalid annotation type ${note.type}`);
    if (!['open', 'resolved', 'deleted'].includes(note.status)) throw new Error('invalid annotation status');
    if (typeof note.title !== 'string' || typeof note.body !== 'string') throw new Error('annotation title and body must be strings');
    if (typeof note.createdAt !== 'string' || typeof note.updatedAt !== 'string') throw new Error('annotation timestamps must be strings');
    validateAnchor(note.anchor);
    if (note.proposal !== undefined && !isObject(note.proposal)) throw new Error('invalid annotation proposal');
    if (note.proposal && !PROPOSAL_KINDS.includes(note.proposal.kind)) {
      throw new Error(`invalid proposal kind ${note.proposal.kind}`);
    }
    if (note.proposal && note.proposal.name !== undefined && typeof note.proposal.name !== 'string') {
      throw new Error('invalid proposal name');
    }
    if (note.proposal && note.proposal.mechanicalText !== undefined && typeof note.proposal.mechanicalText !== 'string') {
      throw new Error('invalid proposal mechanicalText');
    }
    return note;
  }

  function create(partial = {}) {
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
    return `wizard.annotations.${validateModuleId(moduleId)}.v1`;
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
      return Array.isArray(parsed) ? parsed.map(note => clone(validate(note))) : [];
    } catch (_) {
      return [];
    }
  }

  function saveAll(moduleId, notes) {
    validateModuleId(moduleId);
    if (!Array.isArray(notes)) throw new Error('annotations must be an array');
    const clean = notes.map(note => clone(validate(clone(note))));
    storage().setItem(storeKey(moduleId), JSON.stringify(clean));
    return clone(clean);
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
    validateModuleId(moduleId);
    return {
      schemaVersion: 1,
      moduleId,
      exportedAt: nowIso(),
      annotations: loadAll(moduleId)
    };
  }

  function importBundle(moduleId, bundle) {
    validateModuleId(moduleId);
    if (!isObject(bundle) || bundle.schemaVersion !== 1) throw new Error('annotation bundle schemaVersion must be 1');
    if (bundle.moduleId && bundle.moduleId !== moduleId) throw new Error('annotation bundle moduleId mismatch');
    if (!Array.isArray(bundle.annotations)) throw new Error('annotation bundle annotations must be an array');
    const incoming = bundle.annotations.map(note => clone(validate(clone(note))));
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
