# The Endless Descent

An infinite, deterministic Sokoban campaign for WIZARD. Every floor is generated in the browser from a run seed and floor number.

## Solvability guarantee

The generator starts with every crate already on a goal, then makes only legal reverse-pulls. Replaying those pulls backward is always a valid solution. Before a chamber is shown, an independent push-space breadth-first search solves it again and records the true minimum number of pushes.

Difficulty is not assigned from the floor number alone. After the tutorial, full-width wall partitions create rooms, corridors, and one- or two-tile choke points. Candidate chambers must also meet a rising assignment-distance lower bound: even before considering walls or crate interference, no solution can use fewer than that many pushes. Crate count rises from one to four, boards grow from 7×7 to 13×11, and measured solver effort contributes to the visible rating. The curve settles into an open-ended abyss band so generation remains responsive.

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
