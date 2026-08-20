# Run status (snapshot — rewritten each supervisor sweep)

- Live tip: `origin/gh-pages` @ `feb9696` (gh-pages IS the deployed site)
- Last shipped: WIZARD-REVAMP-001 (issue #30, PR #31, 9 worker commits)
  and the hero copy correction (PR #32)
- Owner-visible today: WIZARD relaunched as the Verdigris Systems
  Laboratory — manifest-driven 9-module dashboard, shared calibration
  adapter, passive-tree owner proposals, Systems Bench fixture playback,
  root verification command and CI
- Last supervisor review: PR #31 @ `eb155bd` ACCEPTED (cycle 2 of 4)

## RUNNING

| Task | Actor | Notes |
|---|---|---|
| — | — | board empty |

## READY (unclaimed)

| Task | Packet | Notes |
|---|---|---|
| — | — | none dispatched |

## Backlog (candidates for WIZARD-REVAMP-002)

Deferred out of REVAMP-001 by agreement, not by omission:

- Adapters for the remaining retained modules (cartographer, mason,
  rpg_inventory, verdigris_splash, rp_account_creator, arcane_lattice)
- Physical archive relocation plus redirect decisions for
  `pixel_sandbox`, `wordcloud`, `wordsphere`, `space_shooter`, `sokoban`
- Additional Systems Bench fixtures beyond `resource-session.v1`
- Proposal promotion: owner design proposals → authored tree data
- Enforcement backlog from `ORCHESTRATION.md` (branch protection,
  stale-base CI check, first-screen capture script)
- Arcane Lattice → shared adapter: the 1.0 build (PR #29) already exposes
  `getState`/`setState` with `schemaVersion: 1` plus `resolveCast`, so
  registering it with `WizardLab` is cheap. Only after #29 merges, and
  without touching adjacency, path legality, instability, or undo.

## Fleet and workspaces

| Actor | Worktree | Ports |
|---|---|---|
| Owner + supervisor | `Z:\Code\WIZARD` (primary checkout) | — |
| Fable supervisor | `Z:\Code\.worktrees\wizard-fable-supervisor` | 8120–8129 |
| Cursor Grok 4.6 | none currently — create as `Z:\Code\.worktrees\wizard-cursor-<task>` on next claim | 8140–8159 |
| Qwen 3.8 (MacBook, LM Studio via Tailscale) | EXPERIMENTAL — not dispatchable; see MODEL_SCORECARD | endpoint `http://alexs-macbook-pro.tail4e0d34.ts.net:1234/v1`, model id `qwen3.8` |

Retire merged worktrees: `git worktree remove` then `git worktree prune`.

Qwen 3.8 etiquette (owner rule): it holds ~27.5 GB of the Mac's RAM.
When a work session with it ends, the owner stops it via Raycast
("Stop Qwen 3.8") — agents cannot stop it remotely, so say so when done.
Dispatch is gated on fixing the unterminated-thinking defect recorded in
`MODEL_SCORECARD.md` (2026-08-20 probes).
