# Validation

Root command:

```bash
node scripts/wizard-lab.mjs verify
```

`package.json` maps `npm test` to that command.

## Default verify

- schema / manifest fields
- unique IDs and slugs
- allowed status and visibility
- launch and README existence
- preview existence when declared
- generated `modules.json` / `modules.generated.js` freshness
- dashboard identity, registry script, and absence of archive marketing
- active launch/doc paths

## Full verify

```bash
node scripts/wizard-lab.mjs verify --full
```

Also runs retained module-local tests (skill tree, VesselForge, cartographer, mason, splash validate, performance) and any adapter/annotation/bench tests under `tests/`.

CI runs the full command.
