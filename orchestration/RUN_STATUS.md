# Run status (snapshot — rewritten each supervisor sweep)

- Supervisor identity: MacBook Codex app, independent WIZARD supervisor clone;
  it does not direct the PC Verdigris harness or standalone orchestration repo.
- Live tip: `origin/gh-pages` @ `4c0e2c0` (`gh-pages` IS the deployed site)
- Live status: Pages deployment `5996942263` built successfully; root verify run
  `32338960668` succeeded for the exact live SHA.
- Local preflight at the live SHA: `node scripts/wizard-lab.mjs verify --full`
  → 17 manifests, 9 dashboard modules, PASS.
- Open PR: draft #29, Arcane Lattice 1.0, head `049da81`; CI green and GitHub
  reports CLEAN, but it remains draft and its adapter successor is gated on
  merge plus a current-base review.
- Surge authority: owner directive received 2026-08-21. Issue #37 through #65
  form the initial executable board; see `orchestration/SURGE_BOARD.md`.

## RUNNING

| Task | Actor | Notes |
|---|---|---|
| `WIZARD-SURGE-001` [#37](https://github.com/alexkorol/WIZARD/issues/37) | `OX_WIZARD_VISUAL` | isolated branch `codex/ox-wizard-visual-surge-001`; framepack research |
| `WIZARD-SURGE-013` [#49](https://github.com/alexkorol/WIZARD/issues/49) | `OX_WIZARD_SYSTEMS` | isolated branch `codex/ox-wizard-systems-surge-013`; manifest hardening |

## READY (unclaimed)

| Task | Packet | Notes |
|---|---|---|
| `WIZARD-SURGE-002`–`006` [#38–#42](https://github.com/alexkorol/WIZARD/issues?q=is%3Aissue+is%3Aopen+label%3Acursor-ready+WIZARD-SURGE) | visual | gallery, placeholders, type/space audit, first-screen, accessibility |
| `WIZARD-SURGE-007`–`012` [#43–#48](https://github.com/alexkorol/WIZARD/issues?q=is%3Aissue+is%3Aopen+label%3Acursor-ready+WIZARD-SURGE) | systems | fixtures, loopback, stale-base, deploy, archive, capabilities |
| `WIZARD-SURGE-014`–`015` [#50–#51](https://github.com/alexkorol/WIZARD/issues?q=is%3Aissue+is%3Aopen+label%3Acursor-ready+WIZARD-SURGE) | systems | annotations/state bridge and asset ingestion |

## Sequenced successors

- 13 concrete PIPELINED packets are open as #52–#64.
- They cover shared tokens, gallery registration, six retained-module
  adapters, additional Bench fixtures, frame rollout, selected asset intake,
  archive redirects, and canonical CI consolidation.
- `OWNER-INPUT-001` is #65. It blocks only final raster selection; placeholders
  and stable interfaces continue.
- Proposal promotion into authored tree data remains deliberately outside this
  surge board because it requires an owner product decision and must not be
  inferred from the integration directive.

## Fleet and workspaces

| Actor | Worktree | Ports |
|---|---|---|
| MacBook supervisor | `/Users/alexkorol/Documents/ChatGPT/Wizard` | 8120–8129 |
| `OX_WIZARD_VISUAL` | `/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-visual` | 8160–8169 |
| `OX_WIZARD_SYSTEMS` | `/Users/alexkorol/Documents/ChatGPT/.worktrees/wizard-ox-systems` | 8170–8179 |
| Qwen 3.8 (MacBook, LM Studio via Tailscale) | EXPERIMENTAL — not dispatchable; see MODEL_SCORECARD | endpoint `http://alexs-macbook-pro.tail4e0d34.ts.net:1234/v1`, model id `qwen3.8` |

The Windows topology documented in `ORCHESTRATION.md` is not active in this
independent MacBook run. Retire merged Mac worktrees with `git worktree remove`, then
`git worktree prune`; never mutate the separate PC checkout.

Qwen 3.8 etiquette (owner rule): it holds ~27.5 GB of the Mac's RAM.
When a work session with it ends, the owner stops it via Raycast
("Stop Qwen 3.8") — agents cannot stop it remotely, so say so when done.
Dispatch is gated on fixing the unterminated-thinking defect recorded in
`MODEL_SCORECARD.md` (2026-08-20 probes).
