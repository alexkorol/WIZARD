#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const BASE_SHA = '4c0e2c043602596dc193a68045f2c4f784b2c48c';
const COMMON_FORBIDDEN = [
  'orchestration/* and another worker\'s evidence',
  'branch gh-pages, force-pushes, merges, and GitHub settings',
  'tools/arcane_lattice/** and PR #29 unless this packet explicitly owns the adapter follow-up',
  'WIZARD identity copy, authored passive-tree data, VesselForge item rules, and Arcane Lattice mechanics',
  'generated UI text baked into raster assets'
];
const FULL = 'node scripts/wizard-lab.mjs verify --full';

const ready = [
  {
    id: 'WIZARD-SURGE-001', title: 'Research Verdigris UI framepack directions and prepare the correction round',
    route: 'ox-wizard-visual', topology: 'EXPLORATORY', packet: 'BOUNDED-DESIGN', ports: '8160-8169',
    outcome: 'Create a source-linked visual audit and contact-sheet evidence for coherent Verdigris UI frame materials, corners, edges, and ornament density; evaluate OWNER-INPUT-001 output when available and prepare one batched correction packet without choosing final art direction.',
    visible: 'The owner receives a concrete, comparable direction record and a ready-to-run correction round instead of prose-only taste discussion.',
    owned: ['docs/visual/FRAMEPACK_RESEARCH.md', 'docs/visual/OWNER_INPUT_CORRECTION_001.md', 'evidence/visual/framepack-research/**'],
    frozen: ['docs/UI_FRAMEPACK_INTERFACE.md v1', 'docs/OWNER_INPUT_PACKETS.md', 'OWNER-INPUT-001 is immutable; corrections go in the owned correction document'],
    commands: [FULL, 'node tests/framepack-contract.test.mjs'],
    captures: ['One labelled 1536x1024 comparison contact sheet in evidence/visual/framepack-research/; every tile cites its source or says generated-placeholder.', 'A 375px readable view of the research document rendered through GitHub Markdown or equivalent local preview.'],
    expected: ['At least three genuinely distinct directions; recommendation and tradeoffs are explicit.', 'No unlicensed source asset is copied into a runtime pack; no final art authority is asserted.'],
    review: ['Sources support the claims, tiles are not mislabeled, prompt round is exact and batched, interface constraints are respected.'],
    risk: 'LOW — documentation and evidence only; licensing and accidental art-direction authority are the primary risks.',
    stops: ['A source has unclear reuse rights and would need to ship in product.', 'Owner directions contradict the frozen no-text or swap-interface requirements.']
  },
  {
    id: 'WIZARD-SURGE-002', title: 'Build the framepack gallery and deterministic nine-slice validation bench',
    route: 'ox-wizard-visual', topology: 'INDEPENDENT', packet: 'BOUNDED-DESIGN', ports: '8160-8169',
    outcome: 'Build an internal static gallery that loads framepack v1 manifests, previews every state at multiple sizes, exposes slice guides, and reports deterministic dimension/slice/alpha/checksum failures.',
    visible: 'The owner can inspect whether a frame actually stretches cleanly before it is rolled into any module.',
    owned: ['tools/framepack_gallery/**', 'evidence/visual/framepack-gallery/**'],
    frozen: ['schema/wizard.framepack.v1.schema.json', 'docs/UI_FRAMEPACK_INTERFACE.md v1', 'The gallery stays internal until a successor adds its module manifest.'],
    commands: ['node tools/framepack_gallery/test.mjs', FULL, 'python3 -m http.server 8162 --bind 127.0.0.1 --directory .'],
    captures: ['1280x800 gallery with slice guides and at least three target sizes.', '375x900 gallery with no body-level horizontal scroll.', 'A deliberately invalid fixture visibly rejected with its exact reason.'],
    expected: ['Default placeholder fixture passes; negative fixtures fail for slice overflow, bad checksum, and missing alpha declaration.', 'No network dependency and no module registry changes.'],
    review: ['Open every capture; inspect negative control; verify gallery consumes the manifest instead of hard-coded filenames.'],
    risk: 'LOW — internal direct URL only.', stops: ['The frozen manifest cannot represent a required validation property; stop for an architecture ruling.']
  },
  {
    id: 'WIZARD-SURGE-003', title: 'Implement placeholder CSS and SVG frames behind the stable swap interface',
    route: 'ox-wizard-visual', topology: 'INDEPENDENT', packet: 'BOUNDED-DESIGN', ports: '8160-8169',
    outcome: 'Implement neutral CSS/SVG panel, card, button, and inset placeholders using the frozen selectors, attributes, states, and public custom properties; loading no raster assets must remain a complete usable baseline.',
    visible: 'A coherent Verdigris frame language becomes usable immediately while owner-generated raster art remains pending.',
    owned: ['shared/verdigris-frame.css', 'shared/verdigris-frame.js', 'assets/verdigris-ui/placeholders/**', 'tests/framepack-runtime.test.mjs', 'evidence/visual/framepack-placeholders/**'],
    frozen: ['docs/UI_FRAMEPACK_INTERFACE.md v1', 'schema/wizard.framepack.v1.schema.json', 'No module rollout in this packet.'],
    commands: ['node tests/framepack-contract.test.mjs', 'node tests/framepack-runtime.test.mjs', FULL],
    captures: ['One component sheet at 1280x800 showing every state.', 'One 375x900 component sheet; focus indicators and disabled contrast are visible.'],
    expected: ['Works with images blocked and JavaScript disabled.', 'Raster asset substitution changes decoration only, not DOM or module logic.'],
    review: ['Keyboard focus, reduced motion, image-failure fallback, and no baked text are personally inspected.'],
    risk: 'MEDIUM — shared CSS can create global leakage if selectors are not scoped.', stops: ['A required behavior needs a frozen selector change.', 'Any selector affects elements outside .wizard-frame.']
  },
  {
    id: 'WIZARD-SURGE-004', title: 'Audit cross-module typography and spacing and propose a token map',
    route: 'ox-wizard-visual', topology: 'INDEPENDENT', packet: 'BOUNDED-DESIGN', ports: '8160-8169',
    outcome: 'Measure the active dashboard and nine modules, document current font/spacing scales and conflicts, and propose semantic tokens without editing module CSS.',
    visible: 'The owner gets a contact sheet and a concrete token proposal showing where the laboratory feels unified and where module identity should remain distinct.',
    owned: ['docs/visual/TYPOGRAPHY_SPACING_AUDIT.md', 'evidence/visual/typography-spacing/**'],
    frozen: ['WIZARD identity copy remains intact', 'Module-authored data and layout logic are not normalized in this audit.'],
    commands: [FULL, 'python3 -m http.server 8164 --bind 127.0.0.1 --directory .'],
    captures: ['Labelled wide and narrow contact sheets for all nine active modules plus dashboard.'],
    expected: ['Token proposal names semantic roles, fallback fonts, scale values, exceptions, and adoption order.', 'Every recommendation distinguishes shared shell from preserved module identity.'],
    review: ['No hidden module or missing viewport; measurements are reproducible; no implementation edits.'],
    risk: 'LOW — audit only.', stops: ['A module cannot be loaded without changing its state or authored data.']
  },
  {
    id: 'WIZARD-SURGE-005', title: 'Add deterministic first-screen visual regression enforcement',
    route: 'ox-wizard-visual', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8160-8169',
    outcome: 'Add a headless first-screen harness that asserts dashboard identity copy is present, module groups begin within the 1280x800 first screen threshold, and reference captures are viewport-correct.',
    visible: 'Future dashboard changes cannot silently bury the laboratory grid or delete the owner-owned WIZARD identity.',
    owned: ['scripts/first-screen-check.mjs', 'tests/first-screen.test.mjs', 'evidence/visual/first-screen/**'],
    frozen: ['INC-W006 thresholds: 1280x800 and #module-groups begins above the fold', 'No dashboard redesign in this packet.'],
    commands: ['node tests/first-screen.test.mjs', FULL, 'python3 -m http.server 8165 --bind 127.0.0.1 --directory .'],
    captures: ['Fresh 1280x800 dashboard capture and 375x900 narrow capture produced by the harness.'],
    expected: ['Current dashboard passes; a fixture that pushes #module-groups below 800px fails.', 'Capture metadata proves viewport size.'],
    review: ['Inspect both images and the negative control; reject screenshot-only assertions with no DOM threshold.'],
    risk: 'MEDIUM — brittle browser harnesses can produce false greens.', stops: ['No supported bundled browser runtime is available; report exact probe output.']
  },
  {
    id: 'WIZARD-SURGE-006', title: 'Create accessibility and responsive-layout verification coverage',
    route: 'ox-wizard-visual', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8160-8169',
    outcome: 'Build a repeatable static-site audit for keyboard reachability, focus visibility, landmark/name basics, reduced-motion behavior, 375px body overflow, and 1280px layout across dashboard and active modules.',
    visible: 'The owner receives a module-by-module pass/fail matrix and captures for actual narrow and wide layouts.',
    owned: ['scripts/accessibility-layout-check.mjs', 'tests/accessibility-layout.test.mjs', 'docs/visual/ACCESSIBILITY_RESPONSIVE_MATRIX.md', 'evidence/accessibility/**'],
    frozen: ['Auditing only; module fixes become scoped successors.', 'Loopback-only serving.'],
    commands: ['node tests/accessibility-layout.test.mjs', FULL, 'python3 -m http.server 8166 --bind 127.0.0.1 --directory .'],
    captures: ['One labelled 375px failure/pass capture per active surface with findings; one representative 1280px contact sheet.'],
    expected: ['All nine active modules and dashboard are reached; unsupported automated checks are marked manual, never passed by omission.'],
    review: ['Driver preconditions proven, exact URLs recorded, no viewport mislabelling, findings prioritized.'],
    risk: 'LOW — audit tooling only.', stops: ['A test requires account-level assistive technology or changes canonical module state.']
  },
  {
    id: 'WIZARD-SURGE-007', title: 'Generalize Systems Bench fixtures and add an inventory-state session',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'BOUNDED-DESIGN', ports: '8170-8179',
    outcome: 'Replace the resource-specific fixture assumptions with a small fixture catalog and add a versioned inventory-state session that can play, pause, step, reset, inspect, and export without embedding authoritative gameplay simulation.',
    visible: 'The Systems Bench demonstrates a second real Verdigris seam beyond HUD resources.',
    owned: ['tools/systems_bench/**', 'tests/systems-bench-inventory.test.mjs', 'evidence/systems-bench-inventory/**'],
    forbidden: ['tools/rpg_inventory/**; drive a documented state envelope or inert preview adapter, do not rewrite VesselForge'],
    frozen: ['docs/INTEGRATION.md event envelope', 'resource-session.v1.json remains compatible', 'generic bench is not production netcode.'],
    commands: ['node tests/systems-bench.test.mjs', 'node tests/systems-bench-inventory.test.mjs', FULL, 'python3 -m http.server 8171 --bind 127.0.0.1 --directory .'],
    captures: ['1280x800 inventory session at a nonzero playhead with raw payload visible.', '375x900 catalog/session view with no body overflow.'],
    expected: ['Existing resource fixture still passes.', 'Inventory fixture identity, event ordering, reset, export/import, and negative malformed event are deterministic.'],
    review: ['Inspect exact target state, negative control, resource regression, and export content.'],
    risk: 'MEDIUM — overreaching into game simulation or breaking resource playback.', stops: ['A meaningful inventory proof requires changing VesselForge item rules or authored data.']
  },
  {
    id: 'WIZARD-SURGE-008', title: 'Enforce loopback-only launch configurations and documentation',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8170-8179',
    outcome: 'Add a deterministic scanner that rejects committed server commands or launch configurations binding 0.0.0.0 or omitting an explicit 127.0.0.1 bind, with allowlisted non-server prose only.',
    visible: 'Unattended WIZARD work no longer risks firewall prompts or accidentally exposed local servers.',
    owned: ['scripts/verify-loopback-launches.mjs', 'tests/loopback-launches.test.mjs', '.github/workflows/loopback-launches.yml'],
    frozen: ['INC-W008', 'Do not change firewall settings or start non-loopback servers.'],
    commands: ['node tests/loopback-launches.test.mjs', 'node scripts/verify-loopback-launches.mjs', FULL],
    captures: ['No PNG required; attach literal passing transcript and negative-fixture failure transcript.'],
    expected: ['Current unsafe examples are reported with path and line or deliberately corrected in a separately disclosed minimal doc edit.', '0.0.0.0 and missing-bind fixtures fail.'],
    review: ['No false positive on historical incident text; CI runs the same default command.'],
    risk: 'MEDIUM — a noisy scanner can block all work.', stops: ['Fixing a finding would touch another ready issue\'s owned path; report it without editing.']
  },
  {
    id: 'WIZARD-SURGE-009', title: 'Add a stale-base pull-request safeguard for deployment surfaces',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8170-8179',
    outcome: 'Add a PR check that compares the candidate base with current gh-pages and hard-fails stale candidates touching dashboard, registry, shared runtime, schema, workflow, or active-module launch surfaces.',
    visible: 'The owner gets an explicit unsafe-to-merge signal before production deployment.',
    owned: ['scripts/check-pr-base.mjs', 'tests/check-pr-base.test.mjs', '.github/workflows/stale-base.yml'],
    frozen: ['gh-pages is production', 'No automatic rebase or merge', 'Read-only GitHub token use.'],
    commands: ['node tests/check-pr-base.test.mjs', FULL],
    captures: ['No PNG required; transcript must show fresh, stale-sensitive, and stale-doc-only fixtures.'],
    expected: ['Sensitive stale fixture fails with both SHAs and touched surface; fresh fixture passes.', 'No write permissions requested.'],
    review: ['Inspect workflow permissions, event safety, merge-base math, and negative control.'],
    risk: 'HIGH — incorrect merge-base logic can block safe work or greenlight unsafe deploys.', stops: ['GitHub event data cannot prove the candidate head/base pair without elevated write permissions.']
  },
  {
    id: 'WIZARD-SURGE-010', title: 'Add post-deployment live-site verification and failure escalation',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8170-8179',
    outcome: 'Add a post-Pages-deployment smoke check for the deployed SHA, WIZARD identity, generated registry, active launch URLs, and cache-pinned shared assets; failures must be prominent and non-mutating.',
    visible: 'A successful merge is verified on the actual public site rather than assumed from build success.',
    owned: ['scripts/deploy-smoke.mjs', 'tests/deploy-smoke.test.mjs', '.github/workflows/deploy-smoke.yml'],
    frozen: ['Public URL https://alexkorol.github.io/WIZARD/', 'No rollback, retry storm, or external notification secret.'],
    commands: ['node tests/deploy-smoke.test.mjs', FULL],
    captures: ['No PNG required; transcript shows exact deployed SHA/header resolution and one forced stale-content failure.'],
    expected: ['Bounded retries with real backoff; all active launch URLs checked; failures name URL and expected SHA.', 'Workflow has minimal read permissions.'],
    review: ['Inspect event trigger, cache behavior, retry ceiling, negative control, and no recursive workflow loop.'],
    risk: 'HIGH — deployment checks can loop, race caches, or create false alarms.', stops: ['A reliable deployed-SHA proof needs repository or Pages settings changes.']
  },
  {
    id: 'WIZARD-SURGE-011', title: 'Inventory archive candidates and produce the redirect decision plan',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8170-8179',
    outcome: 'Audit inbound links, assets, history-sensitive URLs, dependencies, and replacement destinations for every archive candidate; propose keep, redirect, relocate, or tombstone decisions without moving files.',
    visible: 'The owner gets a safe URL-by-URL archive plan instead of a destructive cleanup guess.',
    owned: ['docs/ARCHIVE_REDIRECT_PLAN.md'],
    frozen: ['docs/ARCHIVE.md', 'No physical moves, deletions, redirects, or dashboard promotion.'],
    commands: ['node scripts/wizard-lab.mjs verify', 'rg -n "pixel_sandbox|wordcloud|wordsphere|space_shooter|sokoban" --glob "!*generated*" .'],
    captures: ['No PNG required; include a complete route table with current HTTP target and recommended successor.'],
    expected: ['All five candidates, direct URLs, root references, internal dependencies, and asset sizes classified.', 'Unknown external inbound links are explicitly unknown.'],
    review: ['No deletion; evidence supports every dependency claim; redirect collisions identified.'],
    risk: 'LOW — read-only audit.', stops: ['A route decision would overwrite an active or owner-authored destination.']
  },
  {
    id: 'WIZARD-SURGE-012', title: 'Audit retained module capabilities and limitations against actual code',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8170-8179',
    outcome: 'Reconcile every retained manifest capability and unsupported method against executable code, state stores, exports, tests, and launch behavior; produce a prioritized adapter matrix without changing claims.',
    visible: 'Dashboard capability promises and known limitations become trustworthy and sequenced for integration.',
    owned: ['docs/MODULE_CAPABILITY_AUDIT.md'],
    frozen: ['docs/MODULE_STANDARD.md honesty rule', 'No manifest or module changes.'],
    commands: ['node scripts/wizard-lab.mjs verify --full', 'node scripts/wizard-lab.mjs verify'],
    captures: ['No PNG required; matrix must link each claim to file/function/test evidence.'],
    expected: ['All 9 dashboard modules plus legacy/internal classifications covered.', 'Each gap has owner-visible value, risk, dependency, and recommended adapter order.'],
    review: ['Spot-check evidence for every true capability; reject capability-by-filename inference.'],
    risk: 'LOW — audit only.', stops: ['A claim requires running destructive or account-linked module behavior.']
  },
  {
    id: 'WIZARD-SURGE-013', title: 'Harden manifest validation and deterministic registry generation',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8170-8179',
    outcome: 'Add negative fixtures and deterministic checks for nested schema constraints, duplicate capabilities, unsafe launch paths, generated ordering, stale previews, and accidental archive re-entry.',
    visible: 'Broken or dishonest module cards are rejected before they reach production.',
    owned: ['scripts/wizard-lab.mjs', 'schema/wizard.module.v1.schema.json', 'tests/manifest-hardening.test.mjs', 'tests/fixtures/manifests/**'],
    frozen: ['Existing module ids/slugs and dashboard inventory', 'Generated files are outputs, not hand edits.'],
    commands: ['node tests/manifest-hardening.test.mjs', 'node scripts/wizard-lab.mjs generate', FULL],
    captures: ['No PNG required; transcript shows each negative fixture failing for its intended single reason.'],
    expected: ['Current 17 manifests and 9 dashboard entries pass.', 'Two generate runs are byte-identical.'],
    review: ['Modified schema and tests disclosed; assertions reject properties, not formatting trivia.'],
    risk: 'HIGH — validator changes affect every module and CI.', stops: ['A hardening rule would invalidate authored module identity without an explicit migration.']
  },
  {
    id: 'WIZARD-SURGE-014', title: 'Expand shared annotation and state-bridge round-trip coverage',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'MECHANICAL', ports: '8170-8179',
    outcome: 'Cover module mismatch, schema migration rejection, snapshot isolation, annotation anchor round-trips, deleted/resolved states, postMessage origin/envelope handling, and unsupported-method behavior.',
    visible: 'Owner notes and calibration state can move between benches without silent corruption or canonical-data mutation.',
    owned: ['shared/wizard-annotations.js', 'shared/wizard-lab.js', 'tests/state-bridge.test.mjs', 'tests/annotation-roundtrip.test.mjs'],
    frozen: ['wizard.annotation.v1 and wizard.calibration.v1 payload shapes', 'Annotations remain separate from canonical state.'],
    commands: ['node tests/calibration.test.mjs', 'node tests/annotations.test.mjs', 'node tests/state-bridge.test.mjs', 'node tests/annotation-roundtrip.test.mjs', FULL],
    captures: ['No PNG required; attach passing transcript plus malformed-envelope and cross-module negative controls.'],
    expected: ['Existing exports remain compatible; invalid imports fail without partial mutation.', 'No new production-network protocol.'],
    review: ['Review source-to-sink mutation boundaries and all modified assertions.'],
    risk: 'HIGH — shared state corruption can affect multiple modules.', stops: ['Compatibility requires changing an authored module state version without its own migration packet.']
  },
  {
    id: 'WIZARD-SURGE-015', title: 'Build deterministic asset ingestion and derivative-map tooling',
    route: 'ox-wizard-systems', topology: 'INDEPENDENT', packet: 'BOUNDED-DESIGN', ports: '8170-8179',
    outcome: 'Build a local CLI that validates a framepack intake, records provenance and checksums, derives alpha/edge/height/depth/roughness-source inputs deterministically, and emits a validated v1 manifest without pretending to synthesize final normal maps.',
    visible: 'Owner-generated UI art can enter WIZARD reproducibly with inspectable support maps and no manual filename surgery.',
    owned: ['scripts/verdigris-assets/**', 'schema/wizard.asset-intake.v1.schema.json', 'tests/asset-ingestion.test.mjs', 'tests/fixtures/assets/**', 'docs/ASSET_PIPELINE.md'],
    frozen: ['schema/wizard.framepack.v1.schema.json', 'docs/UI_FRAMEPACK_INTERFACE.md derivative roles', 'Source assets are never overwritten.'],
    commands: ['node tests/asset-ingestion.test.mjs', 'node tests/framepack-contract.test.mjs', FULL],
    captures: ['A generated derivative contact sheet from synthetic fixtures; exact CLI transcript and output tree.'],
    expected: ['Same input produces byte-identical maps and manifest.', 'Bad alpha, dimensions, names, slice bounds, and checksum fail before output promotion.'],
    review: ['Inspect originals preserved, deterministic output, map semantics, and no claim that model output is a final normal map.'],
    risk: 'HIGH — asset pipelines can overwrite expensive originals or bless invalid maps.', stops: ['The only available implementation would mutate source files in place or depend on nondeterministic cloud processing.']
  }
];

const successors = [
  ['016', 'Implement shared typography and spacing tokens', 'WIZARD-SURGE-004 accepted', 'shared/verdigris-tokens.css, tests/token-contract.test.mjs', 'BOUNDED-DESIGN'],
  ['017', 'Register the framepack gallery as an honest internal laboratory module', 'WIZARD-SURGE-002 and 003 accepted', 'tools/framepack_gallery/wizard.module.json, modules.json, modules.generated.js', 'MECHANICAL'],
  ['018', 'Integrate Cartographer with the shared calibration adapter', 'WIZARD-SURGE-012 and 014 accepted', 'tools/cartographer/wizard-adapter.js, tools/cartographer/index.html, tools/cartographer/wizard.module.json plus generated registry', 'BOUNDED-DESIGN'],
  ['019', 'Integrate Mason Terrain Forge with the shared calibration adapter', 'WIZARD-SURGE-012 and 014 accepted', 'tools/mason/wizard-adapter.js, tools/mason/index.html, tools/mason/wizard.module.json plus generated registry', 'BOUNDED-DESIGN'],
  ['020', 'Integrate Vesselforge inventory with the shared calibration adapter', 'WIZARD-SURGE-007, 012, and 014 accepted', 'tools/rpg_inventory/wizard-adapter.js, integration hooks, manifest plus generated registry; item rules forbidden', 'ARCHITECTURE-SENSITIVE'],
  ['021', 'Integrate Verdigris World Presentation with a read-mostly adapter', 'WIZARD-SURGE-012 and 014 accepted', 'tools/verdigris_splash/wizard-adapter.js, launch hook, manifest plus generated registry', 'BOUNDED-DESIGN'],
  ['022', 'Integrate Chronicles Houses and Scions with the shared adapter', 'WIZARD-SURGE-012 and 014 accepted', 'tools/rp_account_creator/wizard-adapter.js, launch hook, manifest plus generated registry', 'BOUNDED-DESIGN'],
  ['023', 'Integrate Arcane Lattice with the shared adapter without mechanic changes', 'PR #29 merged and WIZARD-SURGE-012/014 accepted', 'tools/arcane_lattice/wizard-adapter.js, launch hook, manifest plus generated registry; adjacency/path/instability/undo forbidden', 'BOUNDED-DESIGN'],
  ['024', 'Add zone-generation and annotation fixtures to Systems Bench', 'WIZARD-SURGE-007 and 014 accepted', 'tools/systems_bench fixtures and tests only', 'BOUNDED-DESIGN'],
  ['025', 'Roll placeholder frames into dashboard, Systems Bench, and Cartographer', 'WIZARD-SURGE-003 and 016 accepted', 'index.html, tools/systems_bench/index.html, tools/cartographer presentation shell', 'BOUNDED-DESIGN'],
  ['026', 'Ingest the owner-selected framepack and publish support maps', 'OWNER-INPUT-001 resolved and WIZARD-SURGE-015 accepted', 'assets/verdigris-ui/framepacks/<selected-pack>/** only', 'MECHANICAL'],
  ['027', 'Implement approved archive redirects without deleting history', 'WIZARD-SURGE-011 accepted plus owner route decisions', 'approved redirect stubs and archive docs only', 'MECHANICAL'],
  ['028', 'Consolidate surge checks into the canonical acceptance and CI path', 'WIZARD-SURGE-005/006/008/009/010/013 accepted', '.github/workflows/verify.yml, package.json, orchestration/ACCEPTANCE.md', 'ARCHITECTURE']
].map(([n, title, dependency, scope, packet]) => ({
  id: `WIZARD-SURGE-${n}`, title, route: 'unassigned-successor', topology: 'PIPELINED', packet,
  outcome: `${title}. Release only after: ${dependency}.`,
  visible: 'This is a concrete sequenced successor in the whole-laboratory dependency graph; owner-visible acceptance is defined when its prerequisite evidence is current.',
  owned: [scope], frozen: ['All accepted prerequisite interfaces and their exact inspected SHAs'],
  commands: [FULL], captures: ['Wide and narrow owner-path captures when presentation changes; otherwise literal targeted transcripts and one negative control.'],
  expected: [`Dependency gate: ${dependency}.`, 'Fresh-base implementation with honest manifest claims and no unrelated changes.'],
  review: ['Packet must be refreshed with exact prerequisite SHAs before cursor-ready.', 'Full acceptance, modified-test disclosure, and live-deploy safety remain mandatory.'],
  risk: packet.includes('ARCHITECTURE') ? 'HIGH — cross-cutting successor; supervisor must freeze or implement the seam.' : 'MEDIUM — pipelined integration work.',
  stops: ['Any prerequisite is unaccepted, changed after acceptance, or conflicts with current gh-pages.']
}));

function body(task, state) {
  const forbidden = [...COMMON_FORBIDDEN, ...(task.forbidden || [])];
  const lines = (label, values) => `## ${label}\n\n${values.map(v => `- ${v}`).join('\n')}`;
  return `<!-- wizard-orchestration:v1 -->

This issue is the canonical immutable task packet for **${task.id}**.

## Exact outcome

${task.outcome}

## Owner-visible contribution

${task.visible}

## Dispatch

- Route: \`${task.route}\`
- Topology: **${task.topology}**
- Packet type: **${task.packet}**
- Lifecycle: **${state === 'ready' ? 'READY; first valid structured claim wins' : 'SUCCESSOR; do not claim until prerequisites are accepted and the supervisor applies cursor-ready'}**
- Base SHA: \`${BASE_SHA}\`
- Port capsule: \`${task.ports || 'assigned when released'}\`; loopback bind only

${lines('Owned paths', task.owned)}

${lines('Forbidden paths and actions', forbidden)}

${lines('Frozen interfaces', task.frozen)}

${lines('Exact acceptance commands', task.commands)}

${lines('Required captures and evidence', task.captures)}

${lines('Expected results', task.expected)}

## Modified-test disclosure

The REVIEW_REQUESTED comment must list every modified test or assertion and why. If none changed, state \`MODIFIED_TESTS: none\`. Literal commands, output, exit codes, environment, base SHA, and head SHA are required; “PASS” alone is not evidence.

${lines('Review criteria', task.review)}

## Deployment risk

${task.risk} \`gh-pages\` is production. The worker never merges. Acceptance binds only to the exact inspected head SHA, current base, commands, captures, and CI state.

${lines('Stop conditions', task.stops)}

## Structured worker status

\`\`\`text
<!-- wizard-orchestration:v1 -->
TASK: ${task.id}
ACTOR: <actual actor id>
STATE: <CLAIMED|IMPLEMENTING|REVIEW_REQUESTED|BLOCKED>
BASE_SHA: <actual claim base>
HEAD_SHA: <sha>
BRANCH: <branch>
CYCLE: <0-4>
MODIFIED_TESTS: <paths and reasons|none>
CHECKS:
- <literal command>: <result and exit code>
ARTIFACTS:
- <path or URL>
SUMMARY:
<concise summary>
\`\`\`
`;
}

const ownerInput = {
  title: 'OWNER-INPUT-001: Verdigris UI framepack direction contact sheet',
  body: `# Decision required

Choose the material and ornament direction for WIZARD's shared panel/card/button framepack. **Recommended:** restrained dark forged bronze with controlled verdigris oxidation, shallow hammered facets, narrow geometric edge bands, and sparse asymmetric tool marks. It fits the existing dark/gold laboratory shell while leaving module content dominant.

Alternatives: (A) carved dark basalt with bronze pins — heavier and more architectural; (B) smoked hardwood with bronze edge straps — warmer and less arcane; (C) dark skymetal with cold blue-grey wear — cleaner and more technical. The choice matters because corners, edge scale, contrast, and derivative-map expectations propagate across every module shell. It blocks final raster art only; CSS/SVG placeholders, gallery, adapters, tests, and ingestion tooling continue.

# Exact copy-paste prompt

Model: **GPT Image-2**. Generate **4 variants** in one labelled-by-position contact sheet (do not render written labels): 1536×1024 canvas, 3:2 landscape, opaque neutral charcoal background, no transparency in this direction round.

\`\`\`text
Create a professional visual-direction contact sheet for a dark fantasy systems-laboratory UI framepack. Show four clearly separated material directions as four equal quadrants, each containing the same three empty interface specimens: one wide rectangular panel frame, one compact card frame, and one small button frame. Every specimen is seen straight-on, orthographic, centered, with an empty uninterrupted center and consistent physical scale. Direction 1: restrained dark forged bronze with controlled green verdigris oxidation, shallow hammered facets, narrow geometric edge bands, sparse asymmetric tool marks. Direction 2: carved near-black basalt with small structural bronze pins and crisp shallow bevels. Direction 3: smoked dark hardwood with narrow aged-bronze edge straps, practical joinery, no rustic clutter. Direction 4: raw dark skymetal with cold blue-grey wear, subtle machined scoring, no glow. High material readability, cool neutral grade, restrained contrast, modular corners and edges that could become nine-slice assets. No text, letters, numbers, runes, logos, icons, heraldry, figurative carving, spirals, gems, skulls, weapons, vines, parchment, wax seals, excessive filigree, glowing magic, scene perspective, cast shadows crossing the specimens, or content inside the frames. Do not fake transparency or checkerboards. This is a direction board, not final production slices or normal maps.
\`\`\`

Negative instructions are already included; do not shorten them. Filenames: \`owner-input-001__framepack-directions__v01.png\` through \`v04.png\` if the model returns separate images, otherwise \`owner-input-001__framepack-directions__contact-sheet.png\`. Target folder: \`assets_inbox/verdigris-ui/owner-input-001/\` (keep raw originals there; never overwrite).

# Acceptance rubric

- Four materially distinct directions using the identical component set and scale.
- Straight-on modular corners/edges; large clean centers; no baked text or symbols.
- Material remains readable at card scale; ornament stays subordinate to content.
- No fake alpha, checkerboard, perspective scene, glow, spiral, or ornate fantasy-default clutter.
- At least one direction can plausibly yield panel, card, inset, button, tab, and divider components.

# Follow-on derivatives

After one direction is selected, the component-sheet round will require true alpha plus source roles: alpha, edge, material, height, depth, emissive only if explicitly selected, roughness-source, and normal-source. The image model is not trusted to produce final normal maps or exact nine-slice coordinates.

# Deterministic post-processing

Preserve raw files and hashes; crop quadrants without resampling; record source dimensions; derive contact thumbnails locally; compute alpha/edge/height/depth/roughness-source deterministically; calculate and validate nine-slice coordinates in the gallery; generate normals locally from the approved height/normal source; reject seams and slice overflow.

# Continuation while pending

Workers continue with \`docs/UI_FRAMEPACK_INTERFACE.md\`, CSS/SVG placeholders, the gallery, visual regression, adapters, fixtures, and ingestion tooling. No task on the critical path waits for this choice. Reply with the chosen quadrant (1-4), or attach the generated result and say which two should advance to a correction round.`
};

function validate() {
  if (ready.length < 12) throw new Error(`need at least 12 READY packets, found ${ready.length}`);
  if (successors.length < 8) throw new Error(`need at least 8 successors, found ${successors.length}`);
  const ids = [...ready, ...successors].map(t => t.id);
  if (new Set(ids).size !== ids.length) throw new Error('duplicate task id');
  for (const task of [...ready, ...successors]) {
    for (const key of ['id', 'title', 'route', 'topology', 'packet', 'outcome', 'visible', 'owned', 'frozen', 'commands', 'captures', 'expected', 'review', 'risk', 'stops']) {
      if (!task[key] || (Array.isArray(task[key]) && task[key].length === 0)) throw new Error(`${task.id}: missing ${key}`);
    }
    const rendered = body(task, ready.includes(task) ? 'ready' : 'successor');
    for (const section of ['Exact outcome', 'Owner-visible contribution', 'Owned paths', 'Forbidden paths and actions', 'Frozen interfaces', 'Exact acceptance commands', 'Required captures and evidence', 'Expected results', 'Modified-test disclosure', 'Review criteria', 'Deployment risk', 'Stop conditions']) {
      if (!rendered.includes(`## ${section}`)) throw new Error(`${task.id}: missing rendered section ${section}`);
    }
  }
}

function gh(args, input) {
  return execFileSync('gh', args, { encoding: 'utf8', input }).trim();
}

function createIssue(title, issueBody, labels) {
  const args = ['issue', 'create', '--title', title, '--body-file', '-', ...labels.flatMap(label => ['--label', label])];
  return gh(args, issueBody);
}

validate();

if (process.argv.includes('--create')) {
  const existing = JSON.parse(gh(['issue', 'list', '--state', 'all', '--limit', '200', '--json', 'title,url']));
  const titles = new Map(existing.map(issue => [issue.title, issue.url]));
  for (const task of ready) {
    const title = `${task.id}: ${task.title}`;
    const url = titles.get(title) || createIssue(title, body(task, 'ready'), ['orchestrated', 'cursor-ready', 'enhancement']);
    console.log(`${task.id}\tREADY\t${url}`);
  }
  for (const task of successors) {
    const title = `${task.id}: ${task.title}`;
    const url = titles.get(title) || createIssue(title, body(task, 'successor'), ['orchestrated', 'enhancement']);
    console.log(`${task.id}\tSUCCESSOR\t${url}`);
  }
  const ownerUrl = titles.get(ownerInput.title) || createIssue(ownerInput.title, ownerInput.body, ['owner-input', 'question']);
  console.log(`OWNER-INPUT-001\tOWNER\t${ownerUrl}`);
} else {
  console.log(`PASS: ${ready.length} READY packets, ${successors.length} successors, base ${BASE_SHA}`);
  console.log('Run with --create to create missing GitHub issues idempotently.');
}
