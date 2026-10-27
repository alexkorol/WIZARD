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

## Copy and presentation

- Owner correction, 2026-10-16: no pentagrams, hexagrams, heptagrams or rune glyphs as
  decoration in effect, HUD or item art across WIZARD tools; they read as medieval fantasy.
  Rings, ticks, dots, light and material instead. Spellforge (`tools/spellforge`) keeps its
  rune and star layers as reference only; do not port them into Verdigris art.

- Owner correction, 2026-09-21: combat channels and resistances use plain names
  Fire, Cold, Lightning, and Chaos. Do not revive Ember/River/Storm/Gloam as
  display synonyms from historical specs, sources, snapshots, or generators.
  Legacy internal IDs may remain for save compatibility. Keep literal rivers,
  weather, objects and unrelated existing titles separate from combat terminology.
  Reuse of a subsystem does not approve its old creative wording; current owner
  corrections override historical documents that call themselves authoritative.

- Owner correction, 2026-10-26 ("the ai cringe terms are sneaking back into the project …
  stop inventing ai-trope lore"): player-facing text names mechanics plainly, as Path of
  Exile does. Damage and ailments are Physical, Fire, Cold, Lightning, Chaos, Bleed,
  Poison, Ignite, Chill, Freeze, Shock and Wither; never Ember, River, Storm, Gloam, Scald,
  Numb or Jolt. No invented cultures, sagas, oaths, years or flavour sentences (no
  Kilnfathers, Drowned Court, Salt Oath, Testimony, "born under", "Second Breath"). Small
  passives are named by their stat; other passives by what they do; jewels by their
  effect. Do not fill creative gaps with new lore. Old identifiers stay only as hidden
  compatibility keys. `tools/geometric_skilltree/tests/invented-terms.test.mjs` (run by
  `wizard-lab.mjs verify`) fails on banned terms in tree, jewel, stat and page text; extend
  its list when a new invented term is caught, never allowlist prose.

The owner rejects unrequested flourish across this repository. Use functional
names, direct labels, and concise descriptions of what a tool does.

- Do not invent decorative adjectives, fantasy epithets, slogans, lore, fake
  archive/chapter numbers, or branded synonyms for ordinary actions.
- Use the owner's terminology. Preserve established project identity and authored
  game concepts; a UI cleanup does not authorize rewriting game rules or content.
- Do not interpret "polish" as a request for a new visual style, extra ornament,
  animations, or marketing copy. Add presentation only when it serves the task.
- Prefer removing redundant copy to replacing it with another flourish. Make
  unavailable features and prototype limits explicit instead of disguising them
  with fictional explanations.

## Recurring module work

- **RPG inventory asset generation (Verdigris)** — read `tools/rpg_inventory/AGENTS.md`, then run `python3 tools/rpg_inventory/core/status.py`. Goal: `tools/rpg_inventory/core/GOAL.md`. Loop: `tools/rpg_inventory/core/RUNBOOK.md`.
- `tools/wizard_orbs/` has binding invariants in `tools/wizard_orbs/AGENTS.md` + `CLAUDE.md` — read them **before** any edit there, including repo-wide passes. Never recarve `mask.png`, never crop the `ORB_VIEW` overlay, never hand-edit `index.html` (rebuild with `python3 build.py`). Enforced by `tests/wizard-orbs-invariants.test.mjs`; do not weaken that test to get a change through.

## Shared laboratory layer

- Manifest schema: `schema/wizard.module.v1.schema.json`
- Registry generator / verifier: `scripts/wizard-lab.mjs`
- Runtime adapter: `shared/wizard-lab.js` (`?dev=1`)
- Annotations: `shared/wizard-annotations.js`

Do not touch subprojects unrelated to the task you were given.
