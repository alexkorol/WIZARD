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

Retire merged worktrees: `git worktree remove` then `git worktree prune`.
