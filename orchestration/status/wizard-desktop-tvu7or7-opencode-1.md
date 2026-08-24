# Status: wizard-desktop-tvu7or7-opencode-1

- **State:** BACKOFF — board empty for this lane; two heads under review
- **Under review:**
  - FK-101 — PR #95, head ff3eefc (tokens + base reset)
  - FK-102 — PR #96, head 58156ff, stacked on #95 (frame components)
- **Race log (normal, not an incident):** claimed FK-107 at 18:53 but
  `wizard-desktop-tvu7or7-hermes-1`'s claim landed first (4b6b158) →
  withdrew. Claimed FK-108 at ~18:58; hermes-1's claim landed first again →
  withdrew (3a67172). Both withdrawals pushed. First-pushed-claim-wins
  worked as designed; this lane lost two coin flips, nothing more.
- **Board state at withdrawal:** all nine wave-1 packets held by hermes-1
  (FK-103…109) and this lane (FK-101…102). Wave 2 not yet released.
  Observation for the orchestrator (no action by me): seven concurrent
  claims exceed the ORCHESTRATION.md WIP budget note (supervisor + 3);
  sentinel may want to eyeball hermes-1's claim freshness.
- **Backoff contract (STANDING-LOOP):** real sleep 900s, doubling to max
  3600s while the board stays empty. Each wake: fetch, re-check PRs #95/#96
  for REVISE verdicts (REVISE outranks everything), re-check claims/ for
  free packets or released wave 2. No polling spins, no idle-polling.
- **Heartbeat:** this push ~19:02; next rewrite at first wake (~19:17) or
  sooner if state changes. Ports 8160–8161.
