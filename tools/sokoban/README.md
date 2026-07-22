# The Verdigris Vault

A finite, pre-forged Sokoban campaign for integration into Verdigris. The shipped page contains 24 frozen stages, their verified proof routes, and a compact movement engine. It performs no level generation or solver search in the browser.

## Runtime architecture

- `levels.js` is the generated campaign artifact: geometry, initial state, proof route, taboo cells, difficulty evidence, and post-solve analysis.
- `runtime.js` contains only grid coordinates, directions, hydration, and access to precomputed taboo cells.
- `game.js` handles play, undo, reset, stored-route hints, replay, progression, and local campaign records.
- `index.html` loads `levels.js`, `runtime.js`, and `game.js`. It deliberately does not load `core.js`.

Stages load immediately and behave identically on GitHub Pages or inside Verdigris. If the player leaves the stored proof branch, hints ask them to undo or reset instead of launching an expensive search.

## Offline forge

`core.js` is the offline generator and solver laboratory. `forge-campaign.js` uses it to create candidates, run a second solver pass, validate routes, sort the survivors by measured difficulty, and write `levels.js`.

The current pack uses a fixed forge seed and source-depth schedule. Later candidates receive an additional 50,000- or 100,000-state search after generation. If that search proves a shorter push route, the pack stores it. If the candidate survives the complete budget, the constructive route remains explicitly labeled as verified rather than optimal.

Rebuild the frozen campaign intentionally with:

```bash
node forge-campaign.js
node test-campaign.js
```

Do not run the forge during page load or ordinary deployment.

## Difficulty ordering

The tutorials remain first. The remaining candidates are sorted offline using solver effort, pushes, box interdependence, counterintuitive progress, goal evictions, storage transfers, and box-controlled barriers. The shipped order is frozen, so it can also be playtested and manually rearranged without changing the runtime architecture.

## Controls

- Arrow keys or WASD: move / push
- U or Z: undo one move
- R: reset the chamber
- H: show the next push while still on the stored proof branch
- Swipe or use the on-screen direction pad on touch devices

Progress is stored locally under the Vault I campaign version.

## Verification

```bash
node test-campaign.js
node test-core.js
node benchmark-authored.js https://sokoboko.garoof.no/ 1 250000
```

`test-campaign.js` replays every frozen proof, checks precomputed taboo cells, verifies monotonic campaign ordering, and asserts that the browser bundle neither loads nor calls the offline solver.
