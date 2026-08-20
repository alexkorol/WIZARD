# Acceptance registry (stable; versioned changes only)

Exact gates, their preconditions, and invalidation rules. Evidence is
bound to task + commit SHA + base + command + timestamp. Adapted from
the Verdigris registry.

## Gates

| Gate | Command | Expected |
|---|---|---|
| Lab verify (root) | `node scripts/wizard-lab.mjs verify --full` (= `npm test`) | `PASS`, with manifest and dashboard counts stated |
| Registry freshness | included in `verify --full` | generated `modules.json` / `modules.generated.js` match manifests; stale output fails |
| Renderer performance | `node tools/performance.test.mjs` | passes; work-reduction ratios hold |
| Passive-tree suites | `node tools/geometric_skilltree/tests/proposals.test.mjs` (plus progression / patterns / jewels / tree-data / runtime-smoke / balance) | all pass, including the non-mutation and `?dev=1` gating assertions |
| Shared-layer suites | `node tests/calibration.test.mjs`, `tests/annotations.test.mjs`, `tests/systems-bench.test.mjs`, `tests/adapter-handshake.test.mjs` | all pass |
| Module suites | `node tools/rpg_inventory/core/test.js`, `tools/cartographer/core/test.js`, `tools/mason/core/test.js` | all pass, counts stated |
| Browser evidence | static server on your port range, bound `127.0.0.1`, plus DOM assertions | assertions hold; real PNGs committed under `evidence/` |
| First-screen (dashboard changes) | measure `#module-groups` top offset at 1280×800 | module grid begins above the fold; no filler block pushes it down (INC-W006) |
| Responsive | 375px viewport | single-column grid, no horizontal body scroll |

Serve with an explicit loopback bind, e.g.:

```bash
python -m http.server 8123 --bind 127.0.0.1 --directory .
```

## Validation ladder (acceptance = every rung that applies)

- **G0** — driver preconditions proven: the harness actually reached the
  state it claims to test (e.g. the bench actually advanced the fixture,
  a hidden browser tab is not starving `requestAnimationFrame`).
- **G1** — targeted deterministic check with raw output and exit code.
- **G2** — negative control where practical: break the property, show
  the gate fail, restore.
- **G3** — integration on a base merged with the CURRENT `gh-pages` tip.
- **G4** — default owner path plus an owner-visible artifact. For
  dashboard work this means what a visitor sees first, not only what the
  registry contains.
- **G5** — the supervisor reruns the exact gate personally, and opens
  every capture. Implementer testimony is never sufficient.
- **G6** — post-merge revalidation of affected checks (the live site is
  `gh-pages`).

## Invalidation

- Greens are revision- and environment-bound. A green goes stale after a
  base advance touching the surface, an evaluator change, a harness
  change, or an environment change.
- PARTIAL is failure unless the packet defined a partial deliverable.
- Default path only: no flags beyond what the owner actually runs,
  unless the packet says otherwise AND the default path is also proven.
- Modified tests must be listed and reviewed. A test the implementer can
  rewrite is not an oracle — but a test that only encoded incidental
  formatting (e.g. a literal-whitespace regex) is legitimately fixed by
  loosening it, provided the change is disclosed and reviewed.
