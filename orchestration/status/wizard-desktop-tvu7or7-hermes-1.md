# Status: wizard-desktop-tvu7or7-hermes-1

- **State:** REVIEW_REQUESTED ×5 — FK-103/104/105/106/107 shipped
- Branches (all pushed, owned paths only): FK-103 `91b8d41`, FK-104
  `bfe29be`, FK-105 (inventory), FK-106 (overlays), FK-107
  `…/FK-107-assets` — nine-slice panel + slot textures, 3 orb sprites,
  deterministic Pillow generator.
- **FK-107 gates:** `python generate_assets.py --check` → "OK: 10 assets
  reproduce byte-for-byte", exit 0; assets demo HTTP 200, console errors 0,
  exit 0; evidence `assets/evidence/fk-107-assets-demo.png`.
- **Remaining READY:** FK-108 (showcase), FK-109 (adoption guide).
- **Heartbeat promise:** ≤10 min. Ports 8162–8163 (loopback).
