# WIZARD retained-module capability audit

Audit base: `65b65558a38b39cd5948e80213a19b9983bc3fb9` (deployed `gh-pages`, inspected 2026-08-21).

This document reconciles all 13 retained modules—nine dashboard, one legacy, and three internal—against executable launch code, state stores, exports, and tests. It does not grant new capabilities or change a manifest. The other five entries in the 18-manifest generated registry are `archive` modules (`pixel_sandbox`, `sokoban`, `space_shooter`, `wordcloud`, and `wordsphere`); capability work on them is intentionally outside this retained-module audit because issue #47 owns their retain/redirect decision and issue #63 owns approved redirects.

## How to read the matrix

- **T** — the retained manifest claim has an executable implementation and feature- or module-specific test evidence.
- **C** — the retained manifest claim has an executable implementation and the shared contract is tested, but there is no launch-specific end-to-end assertion for that exact composition.
- **—** — the manifest claim is `false`; no standard WIZARD capability is exposed at launch. A private class, download button, local storage value, debug hook, or loaded library does not change this grade.

The capability columns are `Ad` adapter, `Sc` scenarios, `X` state export, `I` state import, `Sn` snapshots, `An` annotations, `Pr` proposals, `Fx` fixtures, `Ev` events, `P/S` pause/step, and `AF` agent feedback. Each row's evidence key resolves every cell to executable code, tests, and the retained manifest below.

| Module | Visibility | Ad | Sc | X | I | Sn | An | Pr | Fx | Ev | P/S | AF | Evidence |
| --- | --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| Arcane Lattice | dashboard | — | — | — | — | — | — | — | — | — | — | — | [A1](#a1-arcane-lattice) |
| Cartographer | dashboard | — | — | — | — | — | — | — | — | — | — | — | [A2](#a2-cartographer) |
| Geometric Skilltree | dashboard | C | C | T | T | C | T | T | — | — | — | T | [A3](#a3-geometric-skilltree) |
| Mason Terrain Forge | dashboard | — | — | — | — | — | — | — | — | — | — | — | [A4](#a4-mason-terrain-forge) |
| Chronicles: Houses and Scions | dashboard | — | — | — | — | — | — | — | — | — | — | — | [A5](#a5-chronicles-houses-and-scions) |
| Vesselforge RPG Inventory | dashboard | — | — | — | — | — | — | — | — | — | — | — | [A6](#a6-vesselforge-rpg-inventory) |
| Systems Bench | dashboard | C | C | T | T | C | — | — | T | T | T | C | [A7](#a7-systems-bench) |
| Verdigris World Presentation | dashboard | — | — | — | — | — | — | — | — | — | — | — | [A8](#a8-verdigris-world-presentation) |
| Wizard Orbs | dashboard | C | C | C | C | C | — | — | — | T | — | C | [A9](#a9-wizard-orbs) |
| Health Globe | legacy | — | — | — | — | — | — | — | — | — | — | — | [A10](#a10-health-globe) |
| Framepack Validation Gallery | internal | — | — | — | — | — | — | — | T | — | — | — | [A13](#a13-framepack-validation-gallery) |
| Pixel Art Creator | internal | — | — | — | — | — | — | — | — | — | — | — | [A11](#a11-pixel-art-creator) |
| SLerp Palette Generator | internal | — | — | — | — | — | — | — | — | — | — | — | [A12](#a12-slerp-palette-generator) |

The shared composition behind the `C` grades is explicit: [`WizardLab.register`](../shared/wizard-lab.js#L97) installs unsupported-method guards and default calibration export/import, while [`captureSnapshot`, `loadSnapshot`, and `compareSnapshots`](../shared/wizard-lab.js#L177) compose over registered state and annotations. [`tests/calibration.test.mjs`](../tests/calibration.test.mjs#L13) exercises those defaults, snapshot restoration/comparison, unsupported calls, agent Markdown, and an actual Wizard Orbs resource event. [`tests/adapter-handshake.test.mjs`](../tests/adapter-handshake.test.mjs#L7) verifies registration and lookup. A shared test is supporting evidence, not a substitute for a module-local launch test; that distinction is why some true claims remain `C`.

Negative grades were checked against each launch's actual script loads and registration calls as well as its manifest. In particular, the nine `—`-only launches below contain no `WizardLab.register` call. Raw seams are recorded only when a named function or state store can be cited; they are never promoted from a filename, README statement, or manifest description.

## Module evidence

### A1. Arcane Lattice

- **Retained claim:** every capability is false in [`wizard.module.json`](../tools/arcane_lattice/wizard.module.json); scenarios, annotations, and time-control methods remain explicitly unsupported.
- **Executable seam:** the launch publishes a private host API, [`window.ArcaneLattice`](../tools/arcane_lattice/index.html#L1117), with state read/restore, tier control, spell inspection, and a cast callback. Its state restore calls [`validateDownstream`](../tools/arcane_lattice/index.html#L1149), so it is not a neutral JSON assignment.
- **Launch/test result:** the launch does not load `shared/wizard-lab.js` or register an adapter, and there is no module adapter test. The raw host API therefore does not prove any standard matrix capability.
- **Honesty verdict:** all `—` cells are correct. Wrapping this seam must preserve authored adjacency, path legality, instability, undo, and resolver behavior; none is inferred from the host API.

### A2. Cartographer

- **Retained claim:** every capability is false in [`wizard.module.json`](../tools/cartographer/wizard.module.json); scenarios, annotations, and time control remain explicitly unsupported.
- **Executable seam:** [`MapGen.generate`](../tools/cartographer/core/mapgen.js#L1662), [`toJSON`](../tools/cartographer/core/mapgen.js#L1707), and [`fromJSON`](../tools/cartographer/core/mapgen.js#L1735) provide deterministic generation and a raw map serialization format. The launch's [`Export JSON` handler](../tools/cartographer/index.html#L1522) calls that core API, but does not register WIZARD state methods.
- **Test result:** [`core/test.js`](../tools/cartographer/core/test.js#L60) checks same-seed tile/entity determinism and [`JSON round-trip`](../tools/cartographer/core/test.js#L153). It does not test adapter registration, calibration envelopes, scenarios, or snapshots.
- **Honesty verdict:** all `—` cells are correct. A working JSON download is not `stateExport` until it is connected to the shared adapter contract.

### A3. Geometric Skilltree

- **Retained claim:** adapter, scenarios, state export/import, snapshots, annotations, proposals, and agent feedback are true; fixtures, events, and pause/step are false in [`wizard.module.json`](../tools/geometric_skilltree/wizard.module.json). Pause, resume, and step remain explicitly unsupported.
- **Executable adapter:** the launch loads the shared lab, shared annotations, proposal controller, and adapter in order ([`index.html`](../tools/geometric_skilltree/index.html#L5578)). [`wizard-adapter.js`](../tools/geometric_skilltree/wizard-adapter.js#L4) registers reset, build/proposal state read/restore, the `empty-build` scenario, metrics, and proposal-backed annotation methods.
- **State tests:** the tree's [`exportBuildCode`/`importBuildCode`](../tools/geometric_skilltree/index.html#L2619) path is exercised for valid and malformed codes by [`runtime-smoke.test.mjs`](../tools/geometric_skilltree/tests/runtime-smoke.test.mjs#L453). Proposal creation, semantic anchors, bundle export/import, canonical-data non-mutation, and agent Markdown are exercised by [`proposals.test.mjs`](../tools/geometric_skilltree/tests/proposals.test.mjs#L40).
- **Proof boundary:** state and annotation/proposal behavior have module-specific tests (`T`). Registration, the named scenario, and snapshot composition are executable but only covered by the shared contract (`C`). There is no fixture/event handler and no time-control method; their false/unsupported declarations are correct.

### A4. Mason Terrain Forge

- **Retained claim:** every capability is false in [`wizard.module.json`](../tools/mason/wizard.module.json); scenarios, annotations, and time control remain explicitly unsupported.
- **Executable seam:** [`makeSetParams`](../tools/mason/core/mason.js#L144) deterministically derives terrain parameters. The launch's [`exportSheet`](../tools/mason/index.html#L490) and [`Export JSON` handler](../tools/mason/index.html#L672) produce PNG/JSON artifacts, but expose no WIZARD state getter, setter, or registration.
- **Test result:** [`core/test.js`](../tools/mason/core/test.js#L49) verifies seed determinism and [`metadata/layout`](../tools/mason/core/test.js#L63). It does not exercise calibration import/export or snapshots.
- **Honesty verdict:** all `—` cells are correct. Artifact export is not a restorable adapter state.

### A5. Chronicles: Houses and Scions

- **Retained claim:** every capability is false in [`wizard.module.json`](../tools/rp_account_creator/wizard.module.json); scenarios, annotations, and time control remain explicitly unsupported.
- **Executable seam:** [`loadHouses`](../tools/rp_account_creator/index.html#L373) reads the versioned `wizard_rp_v3` store and migrates older local data. React initializes from that function and persists houses back to local storage ([`useState` and effect](../tools/rp_account_creator/index.html#L1306)). The launch-local [`stepSim`](../tools/rp_account_creator/index.html#L464) is not exposed as a deterministic adapter scenario.
- **Safety/test result:** there is no adapter or module test. An empty `apiKey` keeps the optional Gemini path offline by default ([`apiKey` and fallback](../tools/rp_account_creator/index.html#L113)), so this audit did not invoke account-linked or network behavior.
- **Honesty verdict:** all `—` cells are correct. Persistence is application storage, not a versioned calibration import/export contract.

### A6. Vesselforge RPG Inventory

- **Retained claim:** every capability is false in [`wizard.module.json`](../tools/rpg_inventory/wizard.module.json); scenarios, annotations, and time control remain explicitly unsupported.
- **Executable seam:** the core provides pack-bound [`serialize`/`deserialize`](../tools/rpg_inventory/core/vesselforge.js#L601). The launch restores through that core, initializes React state with `loadState`, and persists it through `forge.serialize` ([`index.html`](../tools/rpg_inventory/index.html#L1223), [`state/effect`](../tools/rpg_inventory/index.html#L1427)). It also reads the separate `verdigris-bridge` passive-state store ([`index.html`](../tools/rpg_inventory/index.html#L826)).
- **Test result:** [`core/test.js`](../tools/rpg_inventory/core/test.js#L766) proves round-trip and rejects foreign packs. The Systems Bench inventory fixture targets this module identifier, but [`systems_bench/index.html`](../tools/systems_bench/index.html#L128) applies it to an inert preview rather than this launch; it cannot be credited as a Vesselforge fixture or event adapter.
- **Honesty verdict:** all `—` cells are correct. The existing serializer is a strong future seam, but it does not register with WizardLab and must not be used to rewrite item rules.

### A7. Systems Bench

- **Retained claim:** adapter, scenarios, state export/import, snapshots, fixtures, events, pause/step, and agent feedback are true; annotations and proposals are false in [`wizard.module.json`](../tools/systems_bench/wizard.module.json). Annotation getter/setter remain explicitly unsupported.
- **Executable adapter:** the launch registers reset/state/scenario/time-control/metrics/export methods ([`index.html`](../tools/systems_bench/index.html#L248)). [`bench.js`](../tools/systems_bench/bench.js#L18) validates fixtures and events; [`createBench`](../tools/systems_bench/bench.js#L65) implements deterministic reset/play/pause/step/tick/restore/snapshot; [`createSessionExport`](../tools/systems_bench/bench.js#L185) emits calibration state. Agent feedback calls the shared Markdown formatter ([`index.html`](../tools/systems_bench/index.html#L279)).
- **Test result:** [`systems-bench.test.mjs`](../tests/systems-bench.test.mjs#L7) exercises resource fixture playback, pause, reset, and full stepping. [`systems-bench-inventory.test.mjs`](../tests/systems-bench-inventory.test.mjs#L19) exercises catalog identity, ordered inventory events, play/pause/step, exact export/restore, reset, and a malformed fixture negative.
- **Proof boundary:** fixtures/events, time control, and the exported/restored bench state are module-tested (`T`). Launch registration/scenario selection, generic snapshots, and agent Markdown are executable but have only shared-contract or adjacent core coverage (`C`). No annotation or proposal bridge exists, so those false claims and unsupported methods are correct.

### A8. Verdigris World Presentation

- **Retained claim:** every capability is false in [`wizard.module.json`](../tools/verdigris_splash/wizard.module.json); state, scenarios, annotations, and time control remain explicitly unsupported.
- **Executable seam:** query-selected camera/view behavior and [`window.__VERDIGRIS_DEBUG__.capture`](../tools/verdigris_splash/app.js#L3737) support visual review. The animation has a private visibility-driven `paused` flag ([`handleVisibility`](../tools/verdigris_splash/app.js#L3990)); that is lifecycle management, not public pause/resume/step.
- **Test result:** [`validate.mjs`](../tools/verdigris_splash/validate.mjs) checks source/assets and presentation invariants. It does not register or exercise a shared adapter, state round-trip, named WIZARD scenario, or snapshot.
- **Honesty verdict:** all `—` cells are correct. A debug capture and URL preset are not standardized snapshots/scenarios, and the loaded WebGL presentation exposes no state setter.

### A9. Wizard Orbs

- **Retained claim:** adapter, scenarios, state export/import, snapshots, events, and agent feedback are true; annotations, proposals, fixtures, and pause/step are false in [`wizard.module.json`](../tools/wizard_orbs/wizard.module.json). Annotation and time-control methods remain explicitly unsupported.
- **Executable adapter:** the launch loads the shared lab, annotations library, and adapter ([`index.html`](../tools/wizard_orbs/index.html#L1173)). [`wizard-adapter.js`](../tools/wizard_orbs/wizard-adapter.js#L4) bridges runtime state, defines four scenarios, registers reset/state/metrics, and maps `resource.changed` through [`applyEvent`](../tools/wizard_orbs/wizard-adapter.js#L51). It also accepts event/import messages.
- **Test result:** [`calibration.test.mjs`](../tests/calibration.test.mjs#L59) directly verifies the Orbs event ratio mapping. The shared calibration/snapshot/feedback contract and registration handshake are tested, but there is no browser test that round-trips the actual `__WizardOrbs` runtime or loads each scenario.
- **Proof boundary:** events are module-tested (`T`); the other true claims are executable shared composition (`C`). Loading `wizard-annotations.js` does not expose annotation methods: the adapter explicitly rejects them, so annotations/proposals remain correctly false.

### A10. Health Globe

- **Classification/claim:** `legacy` and every capability false in [`wizard.module.json`](../tools/health_globe/wizard.module.json); all standard adapter methods remain explicitly unsupported.
- **Executable seam:** the launch-local [`HealthGlobe`](../tools/health_globe/index.html#L341) owns health and animation state; [`setHealth`/`modifyHealth`](../tools/health_globe/index.html#L452) drive the demo controls. The instance is not published as a WIZARD adapter and the requestAnimationFrame loop has no public time control.
- **Launch/test result:** the page does not load the shared lab, persist/export state, or provide module tests. Its raw class methods therefore prove no matrix capability.
- **Honesty verdict:** the `legacy` classification and all `—` cells are correct. It should remain a compatibility launch unless an owner decision gives it distinct value beyond Wizard Orbs.

### A11. Pixel Art Creator

- **Classification/claim:** `internal` and every capability false in [`wizard.module.json`](../tools/pixelart/wizard.module.json); all standard adapter methods remain explicitly unsupported.
- **Executable seam:** launch-local [`state`](../tools/pixelart/index.html#L203) holds the pixel grid and undo/redo stacks. [`restoreFromSnapshot`](../tools/pixelart/index.html#L280) restores internal history and [`exportData`](../tools/pixelart/index.html#L351) downloads JSON; neither is registered with WizardLab.
- **Launch/test result:** there is no state import path, shared-lab load, adapter registration, or executable module test. Internal undo snapshots and downloaded JSON do not prove WIZARD `snapshots` or `stateExport`.
- **Honesty verdict:** the `internal` classification and all `—` cells are correct.

### A12. SLerp Palette Generator

- **Classification/claim:** `internal` and every capability false in [`wizard.module.json`](../tools/slerp/wizard.module.json); all standard adapter methods remain explicitly unsupported.
- **Executable seam:** [`updatePalettePreview`](../tools/slerp/index.html#L418) derives palette colors from controls. Save/load stores only the current color list under `savedPalette` ([`index.html`](../tools/slerp/index.html#L451)); it does not preserve interpolation inputs or expose a versioned state envelope.
- **Launch/test result:** there is no shared-lab load, adapter registration, calibration export/import, or executable module test. Clipboard and local-storage actions prove no standard capability.
- **Honesty verdict:** the `internal` classification and all `—` cells are correct.

### A13. Framepack Validation Gallery

- **Classification/claim:** `internal`; only fixtures are true in [`wizard.module.json`](../tools/framepack_gallery/wizard.module.json). Every standard adapter method remains explicitly unsupported, and all adapter/state/scenario/snapshot/annotation/proposal/event/time-control/feedback claims are false.
- **Executable fixture surface:** [`gallery.js`](../tools/framepack_gallery/gallery.js#L3) declares one valid and three invalid local fixtures. [`loadManifest`](../tools/framepack_gallery/gallery.js#L34) fetches the selected manifest and assets and passes their bytes to [`validateFramepack`](../tools/framepack_gallery/validator.mjs#L129), which checks schema shape, state assets, dimensions, alpha, slice/content bounds, path containment, and SHA-256 before the gallery renders a passing pack.
- **Test result:** [`test.mjs`](../tools/framepack_gallery/test.mjs#L18) proves generated fixture bytes are current, validates five states in the valid fixture, asserts exact slice-overflow/checksum/missing-alpha negatives, and verifies the gallery consumes manifest paths rather than a hard-coded production image ([`test.mjs`](../tools/framepack_gallery/test.mjs#L52)).
- **Honesty verdict:** fixtures are module-tested (`T`). The direct launch loads only `gallery.js` ([`index.html`](../tools/framepack_gallery/index.html#L41)) and does not load or register WizardLab, so its fixture selector is not a scenario adapter and every `—` cell remains correct.

## Gaps, dependencies, and adapter order

The order below follows the executable successor packets already opened as issues #54–#60. Here, a **gap** means a missing contract with a concrete owner workflow; a false capability with no useful module semantics is an honest non-goal and stays unsupported. “Hold” means preserve the unsupported declaration; it is not a recommendation to manufacture a method with no useful semantics.

| Order | Module and honest gap | Owner-visible value | Primary risk | Dependency / release condition |
| --- | --- | --- | --- | --- |
| 0 | **Geometric Skilltree:** add launch-specific adapter/scenario/snapshot contract coverage; keep fixtures/events/time control unsupported until designed. | Makes every existing true claim independently reviewable and prepares a deterministic tree fixture without changing authored nodes. | A fixture/import test could accidentally normalize or mutate canonical tree data. | Shared annotation/state round-trip acceptance (#50); retain the proposal non-mutation assertions. |
| 0 | **Wizard Orbs:** add actual runtime state/scenario round-trip coverage; keep annotation and time control unsupported. | Proves the visible orbs restore exactly rather than only proving the shared wrapper and pure event mapper. | Renderer/runtime state may drift from the exported bridge; meaningless pause semantics would overpromise. | Shared annotation/state bridge coverage (#50); only add annotations if anchored resource-state notes have an owner workflow. |
| 0 | **Systems Bench:** direct-test shared snapshot composition; add annotations/zone fixtures only through the fixture successor. | Lets the owner replay and annotate a deterministic zone session in the same bench. | Annotation anchors can become invalid after fixture restore; catalog expansion can break deterministic ordering. | General fixture work (#43) and shared annotation/state bridge (#50), then zone/annotation fixture #60. |
| 1 | **Cartographer:** adapter/scenarios/state round-trip/snapshots/feedback (#54). | Reset a known seed, compare options, and restore an exact generated map with a visible checksum. | UI controls, generated tiles, and imported JSON can diverge if the adapter restores only part of the map. | This audit and #50 accepted; preserve `MapGen` determinism and test malformed/unsupported input. |
| 2 | **Mason Terrain Forge:** adapter/state round-trip/snapshots/feedback (#55). | Capture and restore deterministic terrain parameters and exported metadata. | Canvas/image inputs are not equivalent to restorable generation parameters; autotile rules must remain untouched. | This audit and #50 accepted; wrap `makeSetParams` and metadata, not generated pixels alone. |
| 3 | **Vesselforge RPG Inventory:** adapter/scenarios/state round-trip/snapshots/feedback (#56). | Load a known inventory, compare snapshots, and export agent-ready calibration. | Highest state-integrity risk: foreign packs, equipment validity, passive bridge state, or a wrapper could alter item behavior. | Systems Bench generalization #43, this audit, and #50 accepted; reuse the pack-bound serializer and leave item rules byte-unchanged. |
| 4 | **Verdigris World Presentation:** read-mostly state/scenario adapter (#57). | Reproduce named view, moment, and quality settings for comparable reviews. | Asynchronous WebGL readiness and GPU lifecycle can make restore/capture nondeterministic; mutation could alter authored presentation. | This audit and #50 accepted; require an explicit ready signal and reject canonical-world mutation. |
| 5 | **Chronicles:** versioned state/scenario round-trip (#58). | Save, restore, and compare a Houses and Scions setup while preserving existing local data. | Migration loss, nondeterministic simulation state, lore changes, or accidental external/API behavior. | This audit and #50 accepted; module-local migration negative control, offline deterministic fixture, and no identity-copy changes. |
| 6 | **Arcane Lattice:** state/scenario adapter only after mechanics are frozen (#59). | Reset, load, export, and restore a weave and inspect resolved casts through the lab shell. | `setState` revalidates downstream structure; a wrapper can change adjacency, legality, instability, undo, or resolver outcomes. | PR #29 merged at an inspected SHA plus this audit and #50 accepted; adapter tests must prove malformed-state rejection and mechanics equivalence. |
| 7 | **Pixel Art Creator (internal):** optional versioned pixel-state import/export; keep scenarios/events/time control unsupported. | Makes small authored pixel assets portable between sessions. | Current JSON is export-only and internal history is not a stable external schema. | Owner confirms the internal utility remains retained; add schema validation and import negative tests before any manifest change. |
| 8 | **SLerp (internal):** optional palette-state adapter; keep snapshots/time control unsupported unless a comparison workflow is requested. | Reproduces palette inputs, interpolation mode, steps, and outputs instead of a color-list-only save. | Existing storage omits authoring inputs, so naïve import cannot reproduce provenance. | Define a versioned palette state and module tests; owner confirms cross-tool palette handoff value. |
| Hold | **Framepack Validation Gallery (internal):** keep the tested fixture capability; no adapter/state/scenario expansion is recommended. | Gives the owner a direct, deterministic pass/reject bench for framepack states and multi-size nine-slice previews. | Treating fixture selection as scenarios or exposing partially validated state would overpromise integration and could render invalid assets as accepted. | No new dependency for the retained fixture surface; require a concrete Systems Bench or annotation workflow before any additional capability claim. |
| Hold | **Health Globe (legacy):** no adapter recommended. | Keeping the compatibility launch avoids breaking old links while Wizard Orbs remains the retained resource calibration surface. | A second resource adapter would duplicate semantics and create conflicting fixture targets. | Owner retention/redirect decision; otherwise preserve all unsupported methods. |

## Decision summary

No retained manifest currently overclaims an implementation. The meaningful distinction is proof depth: Systems Bench has the strongest adapter-oriented module coverage; Geometric Skilltree has strong state/proposal tests but incomplete adapter-composition coverage; Wizard Orbs directly tests its event mapper but relies on shared tests for state/scenario/snapshot composition; and Framepack Validation Gallery directly tests its sole true capability with positive and negative fixtures. The remaining launches contain useful raw seams, but their false capability claims are honest and must stay false until the corresponding successor adds an adapter plus module-local positive and negative tests.

The recommended sequence is therefore: harden existing adapters without broadening claims, then #54 Cartographer, #55 Mason, #56 Vesselforge, #57 Verdigris Presentation, #58 Chronicles, #59 Arcane Lattice, and #60 Systems Bench zone/annotation fixtures. Framepack Validation Gallery remains a fixture-only internal bench; additional internal-utility adapters follow only on owner demand; Health Globe remains legacy. No unsupported method should be removed merely because a similarly named private function exists.
