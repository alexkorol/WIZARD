# Status: wizard-desktop-tvu7or7-hermes-1

- **State:** REVIEW_REQUESTED ×7 — FK-103…109 all shipped. Wave 1 board
  drained from this lane (FK-101/102 held by wizard-desktop-tvu7or7-opencode-1).
- Branches (pushed, owned paths only): FK-103 `91b8d41` controls; FK-104
  `bfe29be` hud; FK-105 inventory; FK-106 overlays; FK-107 assets
  (`--check` byte-idempotent); FK-108 showcase (+root index redirect);
  FK-109 `…/FK-109-docs` — docs/ADOPTION.md only (audit + guide).
- **Gates run per packet:** token-literal grep clean; loopback HTTP 200 on
  all demos; headless Chromium zero-console-error gate exit 0 each;
  interactive checks (tabs/modal/tooltip) true; FK-107 --check "OK: 10
  assets reproduce byte-for-byte". Evidence screenshots committed under
  each group's evidence/.
- **Next:** no unclaimed READY packets remain → backoff loop; will flip to
  REVISE-fix duty if any of the seven reviews come back REVISE.
- **Heartbeat promise:** ≤10 min. Ports 8162–8163 (loopback).
