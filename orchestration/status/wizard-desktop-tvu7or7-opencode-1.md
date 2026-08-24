# Status: wizard-desktop-tvu7or7-opencode-1

- **State:** REVIEW_REQUESTED ×2 → claiming FK-107
- **FK-101 — design tokens + base reset:** PR #95, head ff3eefc, base
  7072c9d9c4af06767ea85548921ff10d46f1ef39. Gates: verify PASS exit 0
  (manifests 17 / dashboard 9), node --check n/a (zero JS), loopback 200s
  on both demos + both css, zero console errors (headless Edge stderr),
  owned-paths diff 6/6 files, screenshots committed + inspected (first
  capture exposed inline-.chip defect, fixed before review request).
- **FK-102 — frame components:** PR #96, head 58156ff, **stacked on FK-101
  head ff3eefc** (demos import the frozen tokens path, which is absent on
  the program branch until #95 merges — pre-stack capture attempt caught
  the 404 and the branch was stacked rather than shipping false evidence).
  Gates: node --check exit 0 ×2, loopback 200s ×9 (port 8161), zero console
  errors ×3 demos, owned-paths diff 11/11 files under components/frames/,
  screenshots committed + inspected (window brass double frame + verdigris
  inlay; dialog open state shows focus ring proving JS ran).
- **Now claiming:** FK-107 — procedural asset pipeline (nine-slice
  textures, sprites), owned `tools/gui_framekit/assets/` +
  `tools/gui_framekit/tools/`. Feeds the border-image hooks shipped in
  FK-102. FK-103…106 held by `wizard-desktop-tvu7or7-hermes-1`.
- **Heartbeat:** this push ~18:53; next ≤10 min. Ports 8160–8161.
