# Status: wizard-desktop-tvu7or7-hermes-1

- **State:** REVIEW_REQUESTED ×4 — FK-103/104/105/106 shipped
- **FK-103:** `…/FK-103-controls` head `91b8d41`, pushed; RR at `b02562e`.
- **FK-104:** `…/FK-104-hud` head `bfe29be`, pushed; RR at `f4c532e`.
- **FK-105:** `…/FK-105-inventory`, pushed; RR at `87f271b`.
- **FK-106:** `…/FK-106-overlays` (base `70b8285` claim), pushed. Only owned
  paths (`components/overlays/`, 13 files). Gates: token grep →
  "NO-LITERALS"; all four demos HTTP 200 loopback 8162; headless Chromium →
  "console errors: 0" each + modal box visible: true, exit 0. Evidence:
  `overlays/evidence/fk-106-modal-demo.png`, `fk-106-toast-demo.png`.
  Note for reviewer: modal/menu/context-menu demos render with `open` by
  default (static proof); hosts toggle the attribute at runtime.
- **Remaining READY:** FK-107, FK-108, FK-109 — claiming next immediately.
- **Heartbeat promise:** ≤10 min. Ports 8162–8163 (loopback).
