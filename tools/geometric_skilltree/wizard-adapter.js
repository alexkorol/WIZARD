(function (global) {
  const MODULE_ID = 'wizard.geometric-skilltree';

  function adapter() {
    return {
      id: MODULE_ID,
      unsupportedMethods: ['pause', 'resume', 'step'],
      reset() {
        if (global.skillTree && typeof global.skillTree.reset === 'function') global.skillTree.reset();
      },
      getState() {
        return {
          buildCode: global.skillTree && global.skillTree.exportBuildCode ? global.skillTree.exportBuildCode() : '',
          proposals: global.WizardProposals ? global.WizardProposals.list() : []
        };
      },
      setState(state) {
        if (state && state.buildCode && global.skillTree && global.skillTree.importBuildCode) {
          global.skillTree.importBuildCode(state.buildCode);
        }
        if (state && state.proposals && global.WizardProposals) {
          global.WizardProposals.importBundle({
            schemaVersion: 1,
            moduleId: MODULE_ID,
            annotations: state.proposals
          });
        }
      },
      listScenarios() { return ['empty-build']; },
      loadScenario() {
        if (global.skillTree && global.skillTree.reset) global.skillTree.reset();
      },
      getMetrics() {
        const tree = global.skillTree;
        if (!tree) return {};
        return {
          allocatedNodes: Array.from(tree.nodes.values()).filter(node => node.active).length,
          remainingPoints: tree.points ? tree.points.skill : null
        };
      },
      getAnnotations() {
        return global.WizardProposals ? global.WizardProposals.list() : [];
      },
      setAnnotations(data) {
        if (global.WizardProposals) {
          global.WizardProposals.importBundle({
            schemaVersion: 1,
            moduleId: MODULE_ID,
            annotations: data
          });
        }
      }
    };
  }

  if (global.WizardLab) global.WizardLab.register(adapter());
  if (typeof module !== 'undefined' && module.exports) module.exports = adapter;
})(typeof window !== 'undefined' ? window : globalThis);
