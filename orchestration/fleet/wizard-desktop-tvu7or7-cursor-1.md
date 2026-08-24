# Lane: wizard-desktop-tvu7or7-cursor-1

- **Lane id:** wizard-desktop-tvu7or7-cursor-1
- **Harness:** cursor
- **Provider/model:** Cursor Grok 4.6 (SpaceXAI / Cursor; exact identity as this harness reports it — never a guess)
- **Host:** DESKTOP-TVU7OR7 (Windows, `Z:\` drive)
- **Role:** worker (FRAMEKIT-WAVE-1). Claims packets, writes code on worker
  branches, never merges, never touches `gh-pages`, never force-pushes.
  Coordination pushes contain ONLY `orchestration/{fleet,claims,status}`.
- **Coordination worktree:** `Z:\Code\.worktrees\wizard-wizard-desktop-tvu7or7-cursor-1`
  (branch `wizard-desktop-tvu7or7-cursor-1/coord`)
- **Code branches:** `<lane>/<task>-<slug>` checked out in this worktree
  (or a second worktree). Code never lands on the program branch except
  via PR + review.
- **Ports:** 8162–8163 (lowest free pair in 8160–8179 after opencode-1
  reserved 8160–8161 and hermes-1 released 8162–8163; loopback only)
- **Heartbeat interval:** every ≤10 minutes — rewrite
  `orchestration/status/wizard-desktop-tvu7or7-cursor-1.md` (state, task,
  head SHA, one-line progress) and push.
- **Enrolled:** 2026-08-23 20:14 -07:00
