# Authored-level design pass

This pass studied level *structure*, not just solver cost. No authored puzzle is shipped in the game.

## Corpora and references

- [Thinking Rabbit's Original 50 schemes](https://sokoboko.garoof.no/), with author context from [Sokoban.dk](https://sokoban.dk/authors/thinking-rabbit-2/)
- [David W. Skinner's Microban collection](https://omerkel.github.io/Sokoban/)
- Tom Schaul, [Evolving a Compact Sokoban Solver](https://www.whatisthought.com/schaulthesis.pdf)
- Jarusek and Pelanek, [Difficulty Rating of Sokoban Puzzle](https://www.fi.muni.cz/~xpelanek/publications/stairs2010-final.pdf)
- Taylor and Parberry, [Procedural Generation of Sokoban Levels](https://ianparberry.com/techreports/LARC-2011-01.pdf)
- Bento et al., [Procedural Generation of Sokoban Levels Using Monte Carlo Tree Search](https://www.ijcai.org/proceedings/2019/646)

## What the schemes revealed

The old deep generator was maze-like only in the superficial sense. It filled a rectangular envelope and removed many interior cells. Against 50 Original levels, its occupied silhouette coverage was 1.00 versus 0.80, it had 17.9 static articulation points versus 5.4, and its 3x3 room rate was 0.019 versus 0.101. It produced wall clutter and walking, not Sokoban causality.

Human-authored boards usually have irregular outer silhouettes: offset chambers, lobes, alcoves, and corridors surrounded by void. Their topology alternates working rooms with narrow passages. More importantly, boxes themselves often become barriers between zones. A doorway can be crossed freely now and become sealed later, so packing order changes future reachability.

The solver confirmed the gap. It solved the first 25 Microban tutorial/concept levels within its search budget, but none of the first 12 Thinking Rabbit originals within 25,000 expanded states. Small dimensions therefore do not imply easy play. The hard authored boards concentrate decisions around storage order, one-way passages, temporary storage, and nonlocal deadlocks.

## Generator consequences

- Deep boards are carved as connected unions of rooms and corridors in exterior void, not as rectangular floors with wall noise.
- Goals occupy a recognizable storage chamber reached through a narrow strait.
- At least half the deep crates begin outside that chamber, forcing meaningful transfers and packing order.
- Rooms remain large enough for manipulation; limited loops prevent every bottleneck from being a fixed wall articulation.
- Candidate scoring rewards crate-controlled barriers and storage entries, while excess walking is penalized.
- The constructive route remains a solvability certificate, but it is movement-cleaned and never presented as a shortest proof unless exhaustive search established that claim.

The practical target is not "more walls." It is a smaller number of consequential boundaries whose state changes when a crate moves.

## Solver-first correction

The irregular-layout pass was necessary but insufficient. With a stronger forward solver, a previous floor 100000 collapsed in 153 expanded states and floor 999999 in 159, while Thinking Rabbit Original #1 required 97 pushes and 15,415 states. The visual difficulty score had therefore been rewarding complexity that did not survive search.

The solver now uses empty-board reverse-push distance maps instead of Manhattan distance, minimum-cost box-goal matching, canonical keeper-reachability regions, static taboo squares, a transposition table, and frozen 2x2 deadlock rejection. It proves Original #1 within its browser-safe budget. Original #2 still exceeds the current practical budget, reinforcing Junghanns and Schaeffer's conclusion that Sokoban needs layers of domain knowledge rather than generic search alone.

Generation now treats that solver as an adversary. The solver-state requirement rises with depth to 8,000 states, and candidates below the band are rejected even when they have long routes or impressive-looking geometry. Six interacting crates on a dense board replaced the former eight-crate warehouse escalation because the latter encouraged independent subproblems and walking.
