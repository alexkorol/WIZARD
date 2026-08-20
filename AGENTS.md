# WIZARD repo — agent pointers

Multi-subproject **Verdigris Systems Laboratory** served from `gh-pages`.

## Before you edit

1. Read this file and `docs/MODULE_STANDARD.md`.
2. Run `node scripts/wizard-lab.mjs verify` after changing manifests, dashboard, or shared lab code.
3. Do not add public dashboard cards by editing `index.html` by hand. Add or edit `tools/<slug>/wizard.module.json` and run `node scripts/wizard-lab.mjs generate`.
4. Do not delete archive candidates unless a task packet says so.
5. Do not modify `codex/arcane-lattice-1-0` from unrelated workstreams.
6. Do not rewrite VesselForge item rules, authored passive-tree data, or Arcane Lattice adjacency merely for standardization.

## Recurring module work

- **RPG inventory asset generation (Verdigris)** — read `tools/rpg_inventory/AGENTS.md`, then run `python3 tools/rpg_inventory/core/status.py`. Goal: `tools/rpg_inventory/core/GOAL.md`. Loop: `tools/rpg_inventory/core/RUNBOOK.md`.
- `tools/wizard_orbs/` has `CLAUDE.md`. Rebuild `index.html` with `python3 build.py` after shader/template edits; keep adapter hooks in `src/template.html` **and** the built `index.html`.

## Shared laboratory layer

- Manifest schema: `schema/wizard.module.v1.schema.json`
- Registry generator / verifier: `scripts/wizard-lab.mjs`
- Runtime adapter: `shared/wizard-lab.js` (`?dev=1`)
- Annotations: `shared/wizard-annotations.js`

Do not touch subprojects unrelated to the task you were given.
