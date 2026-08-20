# WIZARD-REVAMP-001 supervisor state

Actor: FABLE_SUPERVISOR
Issue: https://github.com/alexkorol/WIZARD/issues/30
Worker: Cursor Cloud Agent (Grok 4.6 High), actor id CURSOR_GROK_4_6
Base branch: gh-pages (live site — merge = deploy)
Supervisor branch: fable/wizard-revamp-supervisor
Comment marker: `<!-- wizard-orchestration:v1 -->`

## Current state

- STATUS: revise (cycle 1 verdict posted 2026-08-19, awaiting new head from Cursor)
- IMPLEMENTATION_PR: #31 (cursor/wizard-revamp-001)
- LAST_REVIEWED_HEAD_SHA: e0da0e4e2793f296562f438b94e8c8ca66f6262c
- REVIEW_CYCLE: 1 of 4 max
- LAST_VERDICT: REVISE (P1 proposal toolbar not dev-gated; P1 narrow capture not narrow; P2 AGENTS.md reflow). Verified good: verify --full PASS, all module tests PASS, proposal non-mutation boundary, Systems Bench orb bridge (hp 0.345 at event 2), honest capabilities, 9-card dashboard, metadata clean, mobile single-column, archive candidates off surfaces, arcane_lattice untouched.

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
