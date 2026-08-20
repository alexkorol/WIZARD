# Calibration workflow

Developer mode activates with `?dev=1` on modules that load `shared/wizard-lab.js`.

## Shared adapter

Modules may register:

```js
window.WizardLab.register({
  id: 'wizard.orbs',
  reset() {},
  getState() {},
  setState(state) {},
  listScenarios() {},
  loadScenario(id) {},
  pause() {},
  resume() {},
  step() {},
  getMetrics() {},
  getAnnotations() {},
  setAnnotations(data) {},
  exportCalibration() {},
  importCalibration(data) {}
});
```

Unsupported methods should throw a named `WizardUnsupportedError` or be listed in the manifest `unsupportedMethods` array.

## Snapshots

Snapshot A and Snapshot B store calibration payloads locally, keyed by module id. Switching compares the two payloads; it does not mutate canonical authored data.

## Export

`exportCalibration()` returns versioned JSON. Agent feedback Markdown is produced from that payload plus annotations (`shared/wizard-lab.js` `toAgentMarkdown`).
