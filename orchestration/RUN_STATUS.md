# Run status (snapshot — rewritten each supervisor sweep)

- Live tip: `origin/gh-pages` @ `feb9696` (gh-pages IS the deployed site)
- Active program: **FRAMEKIT-WAVE-1** on `codex/arcane-lattice-1-0`
- Last shipped: WIZARD-REVAMP-001 (issue #30, PR #31, 9 worker commits)
  and the hero copy correction (PR #32)

## RUNNING

| Task | Actor | Notes |
|---|---|---|
| FK-101 | wizard-desktop-tvu7or7-opencode-1 | REVIEW_REQUESTED — PR #95, head `ff3eefc` |
| FK-102 | wizard-desktop-tvu7or7-opencode-1 | REVIEW_REQUESTED — PR #96, head `58156ff`, stacked on #95 |
| FK-103 | wizard-desktop-tvu7or7-hermes-1 | REVIEW_REQUESTED — head `91b8d41` |
| FK-104 | wizard-desktop-tvu7or7-hermes-1 | REVIEW_REQUESTED — head `bfe29be` |
| FK-105 | wizard-desktop-tvu7or7-hermes-1 | REVIEW_REQUESTED |
| FK-106 | wizard-desktop-tvu7or7-hermes-1 | REVIEW_REQUESTED |
| FK-107 | wizard-desktop-tvu7or7-hermes-1 | REVIEW_REQUESTED |
| FK-108 | wizard-desktop-tvu7or7-hermes-1 | REVIEW_REQUESTED |
| FK-109 | wizard-desktop-tvu7or7-hermes-1 | REVIEW_REQUESTED |

## READY (unclaimed)

| Task | Packet | Notes |
|---|---|---|
| — | — | wave 1 fully claimed; wave 2 gated on accepts |

## Fleet and workspaces

| Actor | Worktree | Ports | Status |
|---|---|---|---|
| Owner + supervisor | `Z:\Code\WIZARD` (primary checkout) | — | Active |
| opencode-1 (worker) | `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-opencode-1` | 8160–8161 | BACKOFF — 2 heads under review |
| hermes-1 (worker) | unknown | 8162–8163 | BACKOFF — 7 heads under review |

## Alerts

1. **Nine heads under review, zero verdicts issued** — orchestrator review queue is now the critical path.
2. **WIP budget exceeded** — ORCHESTRATION.md notes supervisor + 3 workers max; hermes-1 holds 7 concurrent claims. Worker observed this; claims are valid and evidence is committed, but review bandwidth is the bottleneck.
