# Owner-selected logical art grid

Owner direction, 2026-09-12:

- **32x32 pixels:** one inventory grid cell and one small monster's logical canvas.
- **32x64 pixels:** typical humanoid, one cell wide by two cells high.

These are logical canvas conventions, not a requirement to fill every pixel with the visible body, stretch images, or flatten runtime perspective. Keep transparent padding, a consistent foot anchor, and the selected camera. Other larger assets need their own appropriate cell extents.

Current male/female unarmed studies using this convention: `player-unarmed-v10-mpfb/` (rigged MakeHuman anatomical bases and first normalized imagegen candidates). The latest owner image informs the female's broad vest/tunic/shoulder silhouette; earlier photos are general inspiration. Figures, poses and final style remain under owner review. The logical dimensions are selected; runtime displayed size at the player plane and final camera calibration have not yet been verified.

Owner-requested experiment, 2026-09-13: `player-unarmed-v11-48x96/` tests 48x96 humanoid canvases and a grittier, realistic Diablo II pre-rendered finish. It preserves the same models, poses and camera at 1.5x logical pixel density. The 32x64 baseline above remains preserved; no runtime inventory/cell migration is implied by this art trial.

Owner workflow correction: `player-unarmed-v12-simulated-pixels/` supersedes v11's imagegen/processing approach. Imagegen must produce simulated pixel art at the same implied48x96 frame scale before Pixel Respecter reconstructs the grid. Full-detail generation followed by BOX downsampling is not the assignment. See `AGENTS.md` and the v12 source/reconstruction comparisons.
