(function (global) {
  const MODULE_ID = 'wizard.geometric-skilltree';
  const STORE_KEY = 'wizard.proposals.geometric-skilltree.v1';
  const KINDS = ['small_passive', 'notable', 'mastery', 'keystone', 'gateway', 'socket', 'pattern', 'visual_feature'];

  function annotations() {
    return global.WizardAnnotations;
  }

  function lab() {
    return global.WizardLab;
  }

  function storage() {
    if (lab()) return lab().storage();
    try { return global.localStorage; } catch (_) {
      global.__wizardPropMem = global.__wizardPropMem || {};
      const mem = global.__wizardPropMem;
      return {
        getItem(key) { return mem[key] || null; },
        setItem(key, value) { mem[key] = String(value); }
      };
    }
  }

  function canonicalFingerprint() {
    const tree = global.TREE_DATA || {};
    const nodes = global.skillTree && global.skillTree.nodes;
    const authored = JSON.stringify(tree.nodes || tree);
    const liveNames = nodes ? Array.from(nodes.values()).map(node => `${node.id}:${node.name}:${node.type}`).join('|') : '';
    return `${authored.length}:${liveNames.length}:${liveNames.slice(0, 200)}`;
  }

  function load() {
    const raw = storage().getItem(STORE_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch (_) { return []; }
  }

  function persist(list) {
    storage().setItem(STORE_KEY, JSON.stringify(list));
    if (annotations()) annotations().saveAll(MODULE_ID, list);
    render();
    return list;
  }

  function fingerprintGuard(fn) {
    const before = canonicalFingerprint();
    const result = fn();
    const after = canonicalFingerprint();
    if (before !== after) {
      throw new Error('Proposal workflow mutated canonical tree data');
    }
    return result;
  }

  function upsert(note) {
    return fingerprintGuard(() => {
      const created = annotations() ? annotations().create(note) : note;
      const list = load().filter(item => item.id !== created.id);
      list.push(created);
      persist(list);
      return created;
    });
  }

  function createEmpty(x, y, kind) {
    return upsert({
      type: 'placement',
      title: 'Proposed node',
      body: '',
      anchor: { kind: 'world', world: { x, y, z: null } },
      proposal: { kind: kind || 'small_passive', name: '', mechanicalText: '' }
    });
  }

  function attachNode(nodeId) {
    return upsert({
      type: 'placement',
      title: `Proposal on node ${nodeId}`,
      anchor: { kind: 'semantic', semantic: { targetType: 'node', targetId: String(nodeId) } },
      proposal: { kind: 'small_passive', name: '', mechanicalText: '' }
    });
  }

  function attachConduit(conduitId) {
    return upsert({
      type: 'placement',
      title: `Proposal on conduit ${conduitId}`,
      anchor: { kind: 'semantic', semantic: { targetType: 'conduit', targetId: String(conduitId) } },
      proposal: { kind: 'pattern', name: '', mechanicalText: '' }
    });
  }

  function placeRegion(x, y, w, h) {
    return upsert({
      type: 'idea',
      title: 'Proposed cluster / subtree region',
      anchor: { kind: 'region', region: { x, y, w, h } },
      proposal: { kind: 'pattern', name: '', mechanicalText: '' }
    });
  }

  function update(id, fields) {
    return fingerprintGuard(() => {
      const current = load().find(item => item.id === id);
      if (!current) throw new Error(`Unknown proposal ${id}`);
      const next = { ...current, ...fields, id, updatedAt: new Date().toISOString() };
      if (fields.proposal) next.proposal = { ...current.proposal, ...fields.proposal };
      if (next.proposal && !KINDS.includes(next.proposal.kind)) {
        throw new Error(`invalid proposal kind ${next.proposal.kind}`);
      }
      const list = load().filter(item => item.id !== id);
      list.push(next);
      persist(list);
      return next;
    });
  }

  function move(id, x, y) {
    const current = load().find(item => item.id === id);
    if (!current) throw new Error(`Unknown proposal ${id}`);
    const anchor = { ...current.anchor };
    if (anchor.kind === 'world') anchor.world = { ...(anchor.world || {}), x, y };
    else if (anchor.kind === 'region') anchor.region = { ...(anchor.region || {}), x, y };
    else if (anchor.kind === 'semantic') {
      anchor.kind = 'world';
      anchor.world = { x, y, z: null };
    }
    return update(id, { anchor });
  }

  function resolve(id) {
    return update(id, { status: 'resolved' });
  }

  function remove(id) {
    return fingerprintGuard(() => {
      const list = load().map(item => item.id === id ? { ...item, status: 'deleted', updatedAt: new Date().toISOString() } : item);
      persist(list);
      return list;
    });
  }

  function exportBundle() {
    return {
      schemaVersion: 1,
      moduleId: MODULE_ID,
      exportedAt: new Date().toISOString(),
      annotations: load()
    };
  }

  function importBundle(bundle) {
    return fingerprintGuard(() => {
      if (!bundle || bundle.schemaVersion !== 1) throw new Error('proposal bundle schemaVersion must be 1');
      if (bundle.moduleId && bundle.moduleId !== MODULE_ID) throw new Error('proposal bundle moduleId mismatch');
      persist(bundle.annotations || []);
      return load();
    });
  }

  function screenToWorld(event) {
    const view = global.viewController;
    const svg = global.document && global.document.getElementById('main-svg');
    const rect = svg && svg.getBoundingClientRect ? svg.getBoundingClientRect() : { left: 0, top: 0 };
    const x = (event.clientX - rect.left - (view ? view.x : 0)) / (view && view.scale ? view.scale : 1);
    const y = (event.clientY - rect.top - (view ? view.y : 0)) / (view && view.scale ? view.scale : 1);
    return { x, y };
  }

  function render() {
    const layer = global.document && global.document.getElementById('proposal-layer');
    if (!layer || !layer.replaceChildren) return;
    layer.replaceChildren();
    const svgNS = 'http://www.w3.org/2000/svg';
    load().filter(item => item.status !== 'deleted').forEach(item => {
      const g = global.document.createElementNS(svgNS, 'g');
      g.setAttribute('class', `proposal-mark status-${item.status}`);
      g.dataset.proposalId = item.id;
      if (item.anchor.kind === 'region' && item.anchor.region) {
        const r = item.anchor.region;
        const rect = global.document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', r.x);
        rect.setAttribute('y', r.y);
        rect.setAttribute('width', r.w);
        rect.setAttribute('height', r.h);
        rect.setAttribute('class', 'proposal-region');
        g.appendChild(rect);
      } else {
        let x = 0;
        let y = 0;
        if (item.anchor.kind === 'world' && item.anchor.world) {
          x = item.anchor.world.x;
          y = item.anchor.world.y;
        } else if (item.anchor.semantic && global.skillTree) {
          if (item.anchor.semantic.targetType === 'node') {
            const node = global.skillTree.nodes.get(item.anchor.semantic.targetId);
            if (node && node.pos) { x = node.pos.x + 18; y = node.pos.y - 18; }
          }
        }
        const circle = global.document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 10);
        circle.setAttribute('class', 'proposal-pin');
        g.appendChild(circle);
      }
      layer.appendChild(g);
    });
  }

  const controller = {
    mode: 'off',
    selectedId: null,
    KINDS,
    list: load,
    createEmpty,
    attachNode,
    attachConduit,
    placeRegion,
    update,
    move,
    resolve,
    remove,
    exportBundle,
    importBundle,
    render,
    canonicalFingerprint,
    setMode(mode) { this.mode = mode; },
    toMarkdown() {
      const calibration = {
        schemaVersion: 1,
        moduleId: MODULE_ID,
        exportedAt: new Date().toISOString(),
        scenarioId: 'proposals',
        state: global.skillTree && typeof global.skillTree.exportBuildCode === 'function'
          ? { buildCode: global.skillTree.exportBuildCode() }
          : {},
        annotations: load().filter(item => item.status !== 'deleted')
      };
      return lab() ? lab().toAgentMarkdown(calibration) : JSON.stringify(calibration, null, 2);
    }
  };

  function bindUi() {
    const container = global.document && global.document.getElementById('canvas-container');
    if (!container || typeof container.addEventListener !== 'function') return;
    container.addEventListener('click', event => {
      if (controller.mode === 'off') return;
      if (global.viewController && global.viewController.wasDrag) return;
      event.preventDefault();
      event.stopPropagation();
      const target = event.target;
      const nodeGroup = target && target.closest ? target.closest('.node-group') : null;
      const world = screenToWorld(event);
      if (controller.mode === 'region') {
        controller.selectedId = placeRegion(world.x - 80, world.y - 80, 160, 160).id;
        return;
      }
      if (nodeGroup && nodeGroup.dataset && nodeGroup.dataset.nodeId) {
        controller.selectedId = attachNode(nodeGroup.dataset.nodeId).id;
        return;
      }
      if (global.renderer && global.renderer.conduitEls) {
        for (const [id, els] of global.renderer.conduitEls.entries()) {
          if (els.group === target || (els.group && els.group.contains && els.group.contains(target))) {
            controller.selectedId = attachConduit(id).id;
            return;
          }
        }
      }
      controller.selectedId = createEmpty(world.x, world.y, 'small_passive').id;
    }, true);

    if (lab() && lab().isDevMode()) controller.mode = 'place';
    render();
  }

  if (global.document) {
    if (global.document.body) bindUi();
    else global.addEventListener('DOMContentLoaded', bindUi);
  }

  global.WizardProposals = controller;
  if (typeof module !== 'undefined' && module.exports) module.exports = controller;
})(typeof window !== 'undefined' ? window : globalThis);
