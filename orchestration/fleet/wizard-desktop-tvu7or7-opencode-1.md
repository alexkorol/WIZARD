# Lane: wizard-desktop-tvu7or7-opencode-1

- **Lane id:** wizard-desktop-tvu7or7-opencode-1
- **Harness:** opencode (CLI)
- **Provider/model:** opencode / x-preview-f-free (exact model id as the
  harness reports it)
- **Host:** desktop-tvu7or7 (Windows, `Z:\` drive)
- **Role:** worker (FRAMEKIT-WAVE-1). Claims packets, writes code on worker
  branches, never merges, never touches `gh-pages`, never force-pushes.
- **Coordination worktree:** `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-opencode-1`
  (branch `wizard-desktop-tvu7or7-opencode-1/coord`; writes only to
  `orchestration/{fleet,claims,status}` per D-0001).
- **Code worktrees:** one per claimed packet under
  `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-opencode-1-fk<task>`,
  branch `<lane>/<task>-<slug>`.
- **Ports:** 8160–8161 (framekit wave capsule, loopback only).
- **Heartbeat interval:** every ≤10 minutes — rewrite
  `orchestration/status/wizard-desktop-tvu7or7-opencode-1.md` (state, task,
  head SHA, one-line progress) and push.
