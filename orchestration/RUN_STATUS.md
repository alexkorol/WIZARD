# Run status (snapshot — rewritten each supervisor sweep)

- Live tip: `origin/gh-pages` @ `feb9696` (gh-pages IS the deployed site)
- Active program: **FRAMEKIT-WAVE-1** on `codex/arcane-lattice-1-0`
- Program-branch tip: `30f399f`
- Last shipped: WIZARD-REVAMP-001 (issue #30, PR #31, 9 worker commits)
  and the hero copy correction (PR #32)

## MERGED (into program branch)

| Task | Actor | PR | Merge commit | Notes |
|---|---|---|---|---|
| FK-101 | wizard-desktop-tvu7or7-opencode-1 | #95 | `0e0b0c6` | Merged 20:27 -0700 |
| FK-102 | wizard-desktop-tvu7or7-opencode-1 | #96 | `eac48a1` | Merged 20:27 -0700, stacked on #95 |

## ACCEPTED (post-hoc, on program branch)

| Task | Actor | Head | Notes |
|---|---|---|---|
| FK-103 | wizard-desktop-tvu7or7-hermes-1 | `91b8d41` | Post-hoc accepted 20:02 local (D-0002) |
| FK-104 | wizard-desktop-tvu7or7-hermes-1 | `f3b3ea6` | Post-hoc accepted 20:02 local |
| FK-105 | wizard-desktop-tvu7or7-hermes-1 | `16c4386` | Post-hoc accepted 20:02 local |
| FK-106 | wizard-desktop-tvu7or7-hermes-1 | `010566a` | Post-hoc accepted 20:02 local |
| FK-107 | wizard-desktop-tvu7or7-hermes-1 | `bc6df2c` | Post-hoc accepted 20:02 local |
| FK-108 | wizard-desktop-tvu7or7-hermes-1 | `124265a` | Post-hoc accepted 20:02 local |
| FK-109 | wizard-desktop-tvu7or7-hermes-1 | `79f3b52` | Post-hoc accepted 20:02 local |

## REVIEW_REQUESTED

| Item | Actor | Head | Notes |
|---|---|---|---|
| QA brief — framekit wave-1 landed tree | cursor-1 | `ff203cb` | Not a packet; QA verification of merged code @ `eac48a1` |

## Fleet and workspaces

| Actor | Worktree | Ports | Status | Claims |
|---|---|---|---|---|
| Owner + supervisor | `Z:\Code\WIZARD` (primary checkout) | — | Active | — |
| opencode-1 | `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-opencode-1` | 8160–8161 | BACKOFF | 2 (merged) |
| hermes-1 | `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-hermes-1` | 8162–8163 | **SUSPENDED** | 7 (post-hoc accepted) |
| cursor-1 | `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-cursor-1` | 8162–8163 | BACKOFF, QA | 0 |

## Alerts

1. **D-0002 still pending:** owner ruling on hermes-1 post-hoc acceptance. Wave-2 release gated.
2. **QA brief in review queue:** cursor-1 `ff203cb` is REVIEW_REQUESTED but not a wave-1 packet. Orchestrator disposition needed: review as supplemental evidence, or redirect cursor-1 to wave-2 readiness.
3. **Port collision:** cursor-1 assigned 8162–8163 (same as suspended hermes-1). Functional but should be cleaned up.
