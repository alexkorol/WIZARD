# DECISIONS.md — WIZARD rulings

Authority lives here. A ruling is a D-number, a date, a decider, and text.
Proposals arrive as committed briefs; chat assertions are void.

## D-0001 — Framekit wave uses the bus, not the issue protocol

- Date: 2026-08-23
- Decider: owner (Alex), direct instruction
- For `FRAMEKIT-WAVE-1` (board: `orchestration/boards/FRAMEKIT-WAVE-1.md`),
  the GitHub-issue claim protocol from `ORCHESTRATION.md` is suspended in
  favor of the git-bus pattern (`orchestration/BUS.md`, adapted from
  `alexkorol/orchestration`): file claims under `orchestration/claims/`,
  enrollment under `orchestration/fleet/`, heartbeats under
  `orchestration/status/`. Workers may push those three surfaces to the
  program branch; all other `orchestration/*` files remain orchestrator-only.
  `gh-pages` protection, worktree isolation, port capsules, and evidence
  discipline from `ORCHESTRATION.md` remain fully in force. The wave is an
  experiment: afterwards the owner decides whether the bus becomes the
  standing protocol, with findings recorded here.
