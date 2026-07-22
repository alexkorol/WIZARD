# The Endless Descent

An infinite, deterministic Sokoban campaign for WIZARD. Every floor is generated in the browser from a run seed and floor number.

## Solvability and difficulty

The generator starts with every crate on a goal, then makes only legal reverse pulls. Replaying those pulls backward is always a valid solution. A push-space A* solver independently challenges each candidate using wall-aware reverse-push distances, minimum-cost box-goal matching, canonical keeper regions, static taboo cells, transposition pruning, and frozen 2x2 deadlocks.

Solvability is not difficulty. Starting at floor 100, the generator builds irregular rooms, alcoves, and one-cell corridors in exterior void. A dedicated goal chamber connects to staging rooms through a storage strait, and deep starts place at least half their crates outside it. More importantly, deep candidates now face a rising adversarial search gate. A chamber that looks intricate but collapses in a few hundred solver states is rejected. The deepest band must survive at least 8,000 expanded states from the same solver that proves Thinking Rabbit Original #1 in 97 pushes and 15,415 states.

Difficulty therefore grows through search resistance, interaction density, box-line changes, counterintuitive pushes, box-controlled barriers, storage order, and interwoven subproblems. Crate count deliberately tops out at six and the expert board stays dense: tests against authored levels showed that more crates and more empty acreage can make the logical decomposition easier, not harder.

The research basis includes [Jarusek and Pelanek](https://www.fi.muni.cz/~xpelanek/publications/stairs2010-final.pdf), [Taylor and Parberry](https://ianparberry.com/techreports/LARC-2011-01.pdf), [Bento et al.](https://www.ijcai.org/proceedings/2019/646), and [Junghanns and Schaeffer](https://www.sciencedirect.com/science/article/pii/S0004370201001096). The authored-level benchmark uses the external Thinking Rabbit and Microban collections without vendoring either pack. See [RESEARCH.md](RESEARCH.md).

Optimization numbers remain sealed until the first solve. Solver-complete floors are push-optimal; smaller floors are then optimized for the fewest player moves among those push-optimal routes. When a deep candidate exceeds the browser search budget, its reverse-forged route is labeled verified rather than optimal. Unlimited undo and static-deadlock warnings keep experimentation humane.

The floor debugger accepts any floor from 1 to 1,000,000. **Descend one floor** advances without requiring the current puzzle to be solved.

## Controls

- Arrow keys or WASD: move / push
- U or Z: undo one move
- R: reset the chamber
- H: highlight the next verified push
- Swipe or use the on-screen direction pad on touch devices

Progress and the deterministic run seed are saved locally. Starting a new descent creates an entirely new sequence.

## Verification

```bash
node test-core.js
node benchmark-authored.js https://sokoboko.garoof.no/ 1 250000
```
