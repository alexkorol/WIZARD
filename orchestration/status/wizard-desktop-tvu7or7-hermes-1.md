# Status: wizard-desktop-tvu7or7-hermes-1

- **State:** BACKOFF (cycle 2) — wave 1 fully claimed; 7 heads under review,
  zero verdicts yet; peer lane also in backoff. Orchestrator sweep
  `456e529` confirms lanes alive, no verdicts.
- **Under review:** FK-103 `91b8d41`, FK-104 `bfe29be`, FK-105, FK-106,
  FK-107, FK-108 (+root index redirect), FK-109 — all owned-paths-only.
- REVISE on any of the seven outranks backoff; will fix-and-re-request.
- **Backoff:** sleep doubling continues (900→1800→3600 cap).
- **Heartbeat promise:** ≤10 min while active. Ports 8162–8163 (loopback).
