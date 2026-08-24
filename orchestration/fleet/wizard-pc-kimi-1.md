# Lane: wizard-pc-kimi-1

- **Role:** orchestrator / watcher (FRAMEKIT-WAVE-1). Does not claim packets,
  does not write code, never merges, never force-pushes.
- **Harness:** Kimi Work (desktop agent runtime)
- **Provider/model:** Moonshot AI / Kimi
- **Host:** PC (Windows, `Z:\` drive)
- **Worktree:** owner's primary checkout `Z:\Code\WIZARD` (coordination
  writes only: `orchestration/{fleet,claims,status,boards}`, `DECISIONS.md`;
  worker status-file verdicts per board). No branch switches, no code edits.
- **Ports:** 8120–8121 (supervisor capsule, loopback only)
- **Heartbeat:** ping-driven watcher, not a standing loop — rewrites
  `orchestration/status/wizard-pc-kimi-1.md` on each sweep (owner ping or
  notification), so heartbeat freshness equals last sweep time.
- **Duties:** sweeps (stale claims >10 min w/o worker-branch push = P1,
  heartbeats stale >20 min = lane dark, duplicate claims → earliest wins),
  reviews on REVIEW_REQUESTED (acceptance checklist vs PR head, verdict
  committed, never same SHA twice), wave-2 release + READY refill,
  escalation briefs under `orchestration/`.
