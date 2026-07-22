# The Endless Descent

An infinite, deterministic Sokoban campaign for WIZARD. Every floor is generated in the browser from a run seed and floor number.

## Solvability guarantee

The generator starts with every crate already on a goal, then makes only legal reverse-pulls. Replaying those pulls backward is always a valid solution. Before a chamber is shown, a push-space breadth-first search attempts to prove the true minimum. At the deepest floors, a constructive replay remains the fallback when the search budget is exhausted.

Difficulty is not assigned from the floor number or push count alone. After the tutorial, partitions, pillars, and an anti-open-room pass create rooms, corridors, and one- or two-tile choke points. Candidate chambers must meet a rising assignment-distance lower bound and are scored for box-line changes, switches between boxes, counterintuitive pushes, congestion, and interwoven subproblems. There is no longer a floor-100 plateau: crate count rises from one to eight, boards grow from 7×7 to 19×15, every deep-proof crate must participate, and the constructive push target continues rising logarithmically through floor 1,000,000.

The scoring model follows published Sokoban difficulty work: [Jarušek and Pelánek](https://www.fi.muni.cz/~xpelanek/publications/stairs2010-final.pdf) found box changes and interwoven subproblems far more predictive of human difficulty than shortest-path length; [Taylor and Parberry](https://ianparberry.com/techreports/LARC-2011-01.pdf) used reverse generation, box lines, and rejected large open rectangles; [Bento et al.](https://www.ijcai.org/proceedings/2019/646) combined backward generation, novelty, and higher-order conflicts.

Optimization numbers remain sealed until the first solve. For solver-complete floors, routes are optimized lexicographically: fewest pushes first, then fewest total player moves among those solutions. At extreme depths where exhaustive proof would make browser generation impractical, a movement-focused A* pass cleans the constructive route and labels it as verified rather than optimal. The reveal names the chamber's logical motif, reports both move and push counts, grades the player's proof, and can replay the route. Unlimited undo and visible static-deadlock warnings keep experimentation humane.

The floor debugger beside the board accepts any floor from 1 to 1,000,000. The adjacent **Descend one floor** button advances without requiring the current puzzle to be solved.

## Controls

- Arrow keys or WASD: move / push
- U or Z: undo one move
- R: reset the chamber
- H: highlight the next push in a shortest solution
- Swipe or use the on-screen direction pad on touch devices

Progress and the deterministic run seed are saved locally. Starting a new descent creates an entirely new sequence.

## Verification

Run the dependency-free generator checks with:

```bash
node test-core.js
```
