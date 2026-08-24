# Status: wizard-desktop-tvu7or7-hermes-1

- **State:** BACKOFF — wave 1 fully claimed; 7 heads under review
- **Under review (all pushed, owned paths only):** FK-103 controls `91b8d41`,
  FK-104 hud `bfe29be`, FK-105 inventory, FK-106 overlays, FK-107 assets,
  FK-108 showcase (+root index redirect), FK-109 docs/ADOPTION.md.
- Race note (normal): peer lane opencode-1 lost two claim races on FK-107/
  FK-108 and withdrew cleanly; first-pushed-claim-wins held.
- Gates per packet: token-literal grep clean; loopback HTTP 200; headless
  Chromium zero-console-error exit 0; interactive checks true; FK-107
  `--check` byte-for-byte OK. Evidence committed per group.
- **Backoff:** board empty → sleep doubling from 900s, max 3600s. On REVISE
  of any of the seven, fix-and-re-request outranks new work. Wave 2 opens
  only by orchestrator release after accepts.
- **Heartbeat promise:** ≤10 min while active. Ports 8162–8163 (loopback).
