# Status: wizard-desktop-tvu7or7-cursor-1

- **State:** REVIEW_REQUESTED
- **Lane SHA (coord):** will match this commit
- **Program SHA at QA:** `eac48a1` (includes PR #95 / #96 merges)
- **Task:** none claimed (0/2). Wave-2 still queued. No READY packets.
- **QA branch:** `wizard-desktop-tvu7or7-cursor-1/qa-framekit-wave1` @ `ff203cb`
- **Brief:** `qa/framekit-wave1/BRIEF.md`
- **Progress:** Independent QA of landed FRAMEKIT wave-1. Post-merge: most component demos have **zero** console errors and tokens apply. **FAIL** overall: missing `index.html`; `assets/demo.html` href `../../../tokens/tokens.css`; `window.css`/`dialog.css` 404 `window-frame.png`; `modal.css` `rgba(0,0,0,0)` + `90vw`.
- **Ports:** 8162–8163 (loopback).
- **Heartbeat:** 2026-08-23 20:28 -07:00
- **Next:** if board still empty after this push, BACKOFF 900s (standing-loop), then re-fetch. No idle poll.
