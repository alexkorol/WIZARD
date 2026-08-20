# WIZARD-REVAMP-001 supervisor state

Actor: FABLE_SUPERVISOR
Issue: https://github.com/alexkorol/WIZARD/issues/30
Worker: Cursor Cloud Agent (Grok 4.6 High), actor id CURSOR_GROK_4_6
Base branch: gh-pages (live site — merge = deploy)
Supervisor branch: fable/wizard-revamp-supervisor
Comment marker: `<!-- wizard-orchestration:v1 -->`

## Current state

- STATUS: COMPLETE (2026-08-20). PR #31 ACCEPTED at cycle 2 and merged into gh-pages via merge commit 2634320245095a7383f420829e0110a8ce0c5682. Issue #30 closed. Supervisor routine for this task ended.
- IMPLEMENTATION_PR: #31 (cursor/wizard-revamp-001) — MERGED
- LAST_REVIEWED_HEAD_SHA: eb155bd9d3ac662ce1f5bc69d3fa04525b91c93b (ACCEPTED)
- REVIEW_CYCLE: 2 of 4 used
- LAST_VERDICT: ACCEPTED. Cycle-1 REVISE findings (dev-gating, narrow capture, AGENTS.md reflow) all resolved at eb155bd; independently re-verified: verify --full PASS, proposals boundary + dev-gating PASS, performance PASS, rpg_inventory 41/41, CI green, delta scoped to findings only.
- PROTOCOL AMENDMENT (2026-08-20, owner-directed): workers never idle-poll or stop while awaiting a verdict — they continue on a stacked follow-up branch with deferred-scope work, never pushing to the head under review. Continuous unsupervised operation; no human-in-the-loop restarts.
- DEFERRED BACKLOG (candidates for WIZARD-REVAMP-002): adapters for remaining retained modules; physical archive relocation + redirects; more Systems Bench fixtures; proposal promotion tooling.

## Checkpoint record (Part A)

- codex/arcane-lattice-1-0 committed and pushed at b0eaa5b; draft PR #29 open against gh-pages; do not merge.
- node tools/performance.test.mjs passed at checkpoint time.
- Untracked local rpg_inventory staging/review assets (~850MB) intentionally left uncommitted in the primary checkout; do not clean or commit them.

## Review procedure (per cycle)

1. Read issue #30 + implementation PR structured comments; find latest REVIEW_REQUESTED.
2. Confirm PR head SHA differs from LAST_REVIEWED_HEAD_SHA; if unchanged and no check state change, exit with no comment.
3. Wait for required checks; fetch the PR branch read-only into this worktree (never push to it).
4. Verify scope against non-goals (no arcane_lattice semantics changes, no authored tree data rewrites, archive candidates preserved on disk).
5. Run: registry/verification command from the PR, plus `node tools/performance.test.mjs`.
6. Test passive-tree annotation boundary (proposals must not mutate canonical tree data) and Systems Bench proof.
7. Inspect provided captures against actual state/test evidence.
8. Post exactly one structured verdict (REVISE mentions @cursor); update this file; increment cycle on REVISE.
9. On ACCEPTED with current head + green checks: apply `accepted` + `ready-to-merge`, remove `revise`, merge with a merge commit (no squash), comment final result, close issue #30, disable the routine.
10. After 4 unsuccessful cycles: post BLOCKED, apply `blocked`, stop.
