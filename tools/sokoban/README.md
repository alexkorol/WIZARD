# The Endless Descent

An infinite, deterministic Sokoban campaign for WIZARD. Every floor is generated in the browser from a run seed and floor number.

## Solvability guarantee

The generator starts with every crate already on a goal, then makes only legal reverse-pulls. Replaying those pulls backward is always a valid solution. Before a chamber is shown, an independent push-space breadth-first search solves it again and records the true minimum number of pushes.

Difficulty is not assigned from the floor number alone. Candidate chambers are accepted against a rising minimum-push band, while crate count, required crate-switches, and the number of solver states contribute to the visible rating. The curve rises through the campaign and settles into an open-ended high-difficulty band so generation remains responsive on phones. This is an infinite supply of levels, not a claim of infinitely increasing computational difficulty.

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
