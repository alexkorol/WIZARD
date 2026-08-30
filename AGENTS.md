# WIZARD repo — agent pointers

Multi-subproject **Verdigris Systems Laboratory** served from `gh-pages`.

> **Working here as part of a multi-agent run?** Read
> `orchestration/ORCHESTRATION.md` (constitution, authority, workspace
> and port rules) and `orchestration/STANDING-LOOP.md` (the worker
> contract — never idle-poll, never stop) **before** claiming anything.
> Gates live in `orchestration/ACCEPTANCE.md`; current truth in
> `orchestration/RUN_STATUS.md`.

## Before you edit

1. Read this file and `docs/MODULE_STANDARD.md`.
2. Run `node scripts/wizard-lab.mjs verify` after changing manifests, dashboard, or shared lab code.
3. Do not add public dashboard cards by editing `index.html` by hand. Add or edit `tools/<slug>/wizard.module.json` and run `node scripts/wizard-lab.mjs generate`.
4. Do not delete archive candidates unless a task packet says so.
5. Do not modify `codex/arcane-lattice-1-0` from unrelated workstreams.
6. Do not rewrite VesselForge item rules, authored passive-tree data, or Arcane Lattice adjacency merely for standardization.
7. Identity copy is owner-owned. Do not delete or replace the WIZARD name, backronym, or laboratory framing without an owner ruling, and do not push the module grid below the fold with new hero copy (INC-W006).
8. Serve local previews on loopback only: `python -m http.server <your port> --bind 127.0.0.1` (INC-W008).

## Recurring module work

- **RPG inventory asset generation (Verdigris)** — read `tools/rpg_inventory/AGENTS.md`, then run `python3 tools/rpg_inventory/core/status.py`. Goal: `tools/rpg_inventory/core/GOAL.md`. Loop: `tools/rpg_inventory/core/RUNBOOK.md`.
- `tools/wizard_orbs/` has binding invariants in `tools/wizard_orbs/AGENTS.md` + `CLAUDE.md` — read them **before** any edit there, including repo-wide passes. Never recarve `mask.png`, never crop the `ORB_VIEW` overlay, never hand-edit `index.html` (rebuild with `python3 build.py`). Enforced by `tests/wizard-orbs-invariants.test.mjs`; do not weaken that test to get a change through.

## Shared laboratory layer

- Manifest schema: `schema/wizard.module.v1.schema.json`
- Registry generator / verifier: `scripts/wizard-lab.mjs`
- Runtime adapter: `shared/wizard-lab.js` (`?dev=1`)
- Annotations: `shared/wizard-annotations.js`

Do not touch subprojects unrelated to the task you were given.
