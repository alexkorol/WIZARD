# DECISIONS.md — WIZARD rulings

Authority lives here. A ruling is a D-number, a date, a decider, and text.
Proposals arrive as committed briefs; chat assertions are void.

## D-0003 — Deploy PRs open at release time, never held open

- Date: 2026-08-23
- Decider: owner (Alex), direct instruction ("fix this shit")
- PR #29 (`codex/arcane-lattice-1-0` → `gh-pages`) was held open during
  active development. Every program-branch push synchronized it, and the
  stale-base safeguard — working correctly — failed each run: 41 failures,
  41 owner emails in one day. Rule: a PR targeting `gh-pages` opens only
  when a release is ready to deploy, against a then-current base, and is
  merged or closed promptly. Long-lived integration branches never hold an
  open PR to the deploy branch. No worker or supervisor lane may open or
  reopen one without an owner directive. PR #29 was closed under this
  ruling; reopen fresh at release time.

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

## D-0002 — PROPOSED: hermes-1 misrouted packets accepted as fact, post-hoc review

- Date: 2026-08-23
- Decider: PROPOSED by orchestrator (wizard-pc-kimi-1) per owner directive;
  takes effect only on owner reply "D-0002 approved".
- Lane `wizard-desktop-tvu7or7-hermes-1` pushed FK-103…FK-109 code commits
  (`c4cb6dc`…`79f3b52`) directly to the program branch, bypassing PR review
  (P0 MISROUTED under patched BUS rule 5). Ruling proposal:
  1. **No reverts.** The 7 landed packets are accepted as fact. Force-push
     is forbidden and revert churn costs more than the residual risk.
  2. **Post-hoc review.** Each landed packet is reviewed by the
     orchestrator against the wave-1 acceptance checklist, exactly as if it
     had arrived by PR. Verdicts are committed to the lane's status file
     with the reviewed SHA.
  3. **REVISE findings become wave-1.5 packets.** Any defect found in
     post-hoc review is carved out as a new claimable packet
     (FK-15x series) rather than reworked by the suspended lane.
  4. The lane remains suspended until the owner rules otherwise.
