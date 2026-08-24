# WIZARD fleet bus contract

This is the project-local copy of the `alexkorol/orchestration` control-plane
`BUS.md`. It binds every harness and every human working this repo.

Agents do not talk to each other. They read and write the same ledger. Git is
the bus: async, durable, ordered, identity-stamped. State that never lands in
Git **did not happen**.

## The rules

1. **One substrate, declared.** This repo, program branch per the active
   board in `orchestration/boards/`, plus `orchestration/` itself, are the
   only coordination truth. Dashboards and chat are projections, never
   authority.
2. **Pull before anything.** Every session and every coordination write
   starts with `git status --short`, `git fetch --prune origin`,
   `git status -sb`, ahead/behind counts. Never edit dirty, stale, or
   diverged state; never reset or discard another worker's state.
3. **Enroll before working.** One pushed commit:
   `orchestration/fleet/<lane-id>.md` with lane id, harness, exact
   provider/model identity, host, worktree, heartbeat promise. Lane id:
   `<repo>-<host>-<harness>-<n>`, lowest free `<n>`.
4. **Claim only by push.** A claim exists only once
   `orchestration/claims/<TASK>--<lane-id>.md` is pushed per the board's
   coordination-push rule. Push rejected → fetch, re-check, pick different
   work. First valid pushed claim wins; losing a race is normal.
5. **Code on worker branches only.** Coordination files (only `fleet/`,
   `claims/`, `status/<lane>.md`) push to the program branch. Code pushes to
   `<lane>/<task>-<slug>` branches and lands via PR + review. Never
   `gh-pages` (it deploys the live site), never force-push.
6. **Authority lives in files.** Rulings are D-numbers in
   `orchestration/DECISIONS.md`. Any agent may propose by committing a brief;
   nobody rules by asserting a seat in chat. Chat authority is void.
7. **The watcher is deterministic.** Stall/liveness detection is a script on
   OS scheduling (`OrchSentinelWatch` on PC) plus cheap orchestrator sweeps —
   never a metered-LLM polling loop.
8. **Chat-only harnesses are leaf workers.** They receive self-contained
   packets via a relay lane and never hold load-bearing roles; the fleet
   never blocks on them.
9. **Heartbeat or be declared dark.** Rewrite
   `orchestration/status/<lane-id>.md` and push at your promised interval
   (default 10 min). Stale heartbeat → alert. Waiting politely on a dead lane
   is the most expensive failure mode in the fleet.

## WIZARD-specific overlays (from ORCHESTRATION.md — still binding)

- `gh-pages` is the live site. Workers never touch it.
- Worktrees under `Z:\Code\.worktrees\wizard-<lane>` only; the owner's
  primary checkout at `Z:\Code\WIZARD` is never branch-switched or mutated.
- Loopback binds only (`--bind 127.0.0.1`). Port capsules: supervisor
  8120–8129, Cursor 8140–8159, framekit wave 8160–8179 (2 per lane).
- Evidence discipline: literal command + output, or it didn't happen.
