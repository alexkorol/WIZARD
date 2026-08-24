# Run status (snapshot — rewritten each supervisor sweep)

- Live tip: `origin/gh-pages` @ `feb9696` (gh-pages IS the deployed site)
- Active program: **FRAMEKIT-WAVE-1** on `codex/arcane-lattice-1-0`
- Program-branch tip: `2fcbae7`
- Last shipped: WIZARD-REVAMP-001 (issue #30, PR #31, 9 worker commits)
  and the hero copy correction (PR #32)

## ACCEPTED (awaiting merge)

| Task | Actor | PR/Head | Notes |
|---|---|---|---|
| FK-101 | wizard-desktop-tvu7or7-opencode-1 | PR #95, `ff3eefc` | Accepted 19:52 local |
| FK-102 | wizard-desktop-tvu7or7-opencode-1 | PR #96, `58156ff` | Accepted 19:56 local, stacked on #95 |
| FK-103 | wizard-desktop-tvu7or7-hermes-1 | `91b8d41` | Post-hoc accepted 20:02 local (D-0002) |
| FK-104 | wizard-desktop-tvu7or7-hermes-1 | `f3b3ea6` | Post-hoc accepted 20:02 local |
| FK-105 | wizard-desktop-tvu7or7-hermes-1 | `16c4386` | Post-hoc accepted 20:02 local |
| FK-106 | wizard-desktop-tvu7or7-hermes-1 | `010566a` | Post-hoc accepted 20:02 local |
| FK-107 | wizard-desktop-tvu7or7-hermes-1 | `bc6df2c` | Post-hoc accepted 20:02 local |
| FK-108 | wizard-desktop-tvu7or7-hermes-1 | `124265a` | Post-hoc accepted 20:02 local |
| FK-109 | wizard-desktop-tvu7or7-hermes-1 | `79f3b52` | Post-hoc accepted 20:02 local |

## Fleet and workspaces

| Actor | Worktree | Ports | Status | Claims |
|---|---|---|---|---|
| Owner + supervisor | `Z:\Code\WIZARD` (primary checkout) | — | Active | — |
| opencode-1 | `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-opencode-1` | 8160–8161 | BACKOFF | 2 (at cap) |
| hermes-1 | `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-hermes-1` | 8162–8163 | **SUSPENDED** | 7 (post-hoc accepted) |
| cursor-1 | `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-cursor-1` | 8162–8163 | ACTIVE, enrolled | 0 |

## Alerts

1. **Merge gate:** PRs #95/#96 (opencode-1) await owner merge. Orchestrator never merges.
2. **D-0002 pending:** owner ruling on hermes-1 post-hoc acceptance. Wave-2 release gated.
3. **Port collision:** cursor-1 assigned 8162–8163, same range as hermes-1 (suspended, ports released). Not an active conflict but should be cleaned up in fleet file.
