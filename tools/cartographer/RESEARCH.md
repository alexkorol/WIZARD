# Cartographer: generation and map reading

Research checked 2026-09-07. These are design references, not claims to reproduce either proprietary engine. No game assets or engine code are copied.

## Evidence

- [GGG level design interview, 2016](https://www.pathofexile.com/forum/view-thread/1654235): designers describe interchangeable encounter spaces, controlled set pieces, rotation/reflection, and restrictions on bad combinations. They evaluate monster/chest density across thousands of generated levels. Labyrinth combines a larger daily layout with local variation. **Application:** separate route graph, room recipe, terrain art, and encounter placement; validate populations across seeds.
- [Rhys Abraham's ExileCon procedural generation presentation, official announcement](https://www.pathofexile.com/forum/view-thread/2753965), [original presentation](https://www.youtube.com/watch?v=EXnoHTqO7TE). The official announcement confirms the talk covers PoE area generation and forthcoming PoE2 improvements. Video retrieval was unavailable in this environment; detailed implementation decisions below rely on the accessible developer interview and our own design, not an invented transcript.
- [OpenDiablo2 map engine source](https://github.com/OpenDiablo2/OpenDiablo2/blob/master/d2core/d2map/d2mapengine/engine.go): this independent reimplementation exposes a seeded map engine and tile selection by style, sequence and tile type. It is evidence about the reimplementation, not Blizzard source. **Application:** logical collision and tile identity stay separate from the visual variants selected for them.
- [D2 map investigation, author repository](https://github.com/squeek502/d2-map-investigation): investigates correlations between generated areas and identifiable tiles. [D2 seed finder, author repository](https://github.com/emmericp/diablo2-maps) demonstrates repeatable maps tied to seeds. **Application:** reproducible seed + generator version + recipe, with visible orientation landmarks.
- [Community map-reading field observations](https://diablo2.io/forums/map-reading-t3490.html): useful player observations about entrance-tile orientation and area-specific exit relationships. These are not a universal rule that every next turn is left. **Application:** teach the difference between an oriented landmark and a guaranteed route. Our compass and graph show exactly which rule a generated map obeys.

## Design contract

1. Generate an expedition graph first: a forward route, optional treasure branches, and bounded loops. A terminal guardian chamber anchors the destination.
2. Realize graph nodes as authored room recipes with compatible cardinal sockets. Clear every socket through collision geometry. Keep the central combat lane clear and place architectural obstacles outside it.
3. Keep four independent seeded streams: topology, room variants, encounters, and decoration. Art changes cannot change collision or encounter positions.
4. Publish the graph, socket orientation, landmarks, walkable navigation, shortest route, safe entry and encounter tiers. Map reading learns topology and landmark vocabulary; it does not reveal unexplored monsters.
5. Render floor materials, wall relief, water, props, light and an automap from that same logical map. The presentation never decides collision.
6. Export a versioned, validated map packet. Native Verdigris must consume real generated collision, spawn positions and route landmarks, not merely resolve a seed into a plan whose guarantees are booleans.
7. Measure connectivity, socket agreement, reachability, safe spawn, encounter overlap, reproducibility and round trips across recipes and seeds. Play the real game and inspect its pixels before claiming integration complete.

## Scope and checkpoint evidence

The existing terrain generator remains available for the eight established zone families. The new expedition pipeline adds authored structure and production inspection. “AAA-inspired” describes design and presentation direction, not equivalence to the content volume or production maturity of those games.

Checkpoint 1: executable expedition generator, seed-batch tests, research and asset provenance.
Checkpoint 2: rebuilt authoring UI, textured world/automap/exploration, verified browser interactions and exports.
Checkpoint 3: native Verdigris collision, encounters, navigation and presentation integration with native test/scenario and live-capture evidence.

## Visual study and implementation — 2026-09-09

The following images were opened in the browser and inspected visually, rather
than inferred from search snippets. These are observations of particular examples,
not an exhaustive reconstruction of all seeds or versions. Original game images
are reference links only; the shipped geometry is independently authored.

| Reference inspected | What the pixels show | Design consequence |
|---|---|---|
| Diablo I [Cathedral automap](https://www.boristhebrave.com/wp-content/uploads/2019/07/diablo_cathedral-1024x523.png) | A broad, column-lined axis joins large spaces. Smaller rectangular compartments attach around it, with narrow thresholds and useful negative space. | Use a legible nave, paired columns, short chapel connections and identifiable doors. |
| Diablo I [Cave automap](https://www.boristhebrave.com/wp-content/uploads/2019/07/diablo_caves-1024x462.png) | Broad irregular lobes, broken edges and winding boundaries replace the cathedral's strong straight walls. | Keep the existing continuous terrain option; architecture and natural ground need different rules. |
| Diablo II [map-reading diagrams and Tower automaps](https://pf-mail.wixsite.com/d2maps/rules) | In the ordinary example, compact rooms connect through visible thresholds. In the reverse example, the annotated route bends around the right side while the terminal tile retains its orientation. | Constrain the final physical doorway; rotate the entire map, ports and gates together. A direction hint is not a shortest-path oracle. |
| PoE [Twilight Strand player overlay](https://www.reddit.com/r/pathofexile/comments/h91ob1/layout_explained_the_twilight_strand/), [image](https://imgur.com/G6KvdtW) | The revealed coast is a narrow, bending ribbon; route arrows follow its long axis despite local boundary irregularity. | Terrain boundaries can guide travel without a chain of identical rooms. Do not mistake this introductory zone for every endgame map. |

Diablo I source cross-check: the reconstructed [Devilution Cathedral generator](https://github.com/diasurgical/devilution/blob/master/Source/drlg_l1.cpp)
contains `L5firstRoom`, `L5roomGen`, `L5makeDmt`, and wall-placement routines.
The inspected first-room routine establishes a major axis before additional
room growth. This supports a staged layout pipeline; it does not imply Diablo I
assembled its whole dungeon from the same prefabs as Diablo II. The image
publisher's [original investigation](https://www.boristhebrave.com/2019/07/14/dungeon-generation-in-diablo-1/)
provides context and identifies the two automaps.

PoE's developers explicitly separate minimap readability from terrain art. Their
[2017 minimap explanation](https://www.pathofexile.com/forum/view-thread/1897990)
describes a walkability layer and an exploration boundary. We now draw bright
frontier segments only where discovered floor meets undiscovered walkable floor.
They reveal where exploration can continue without revealing distant contours.
The [2016 level-design interview](https://www.pathofexile.com/forum/view-thread/1654235)
explains controlled variation, compatible rotations/reflections, and population
measurements over thousands of maps. This motivates seed batches and physical
route checks, not claims about the exact proprietary algorithm.

### Working taxonomy

- **Spine with chambers:** a recognizable central route, architectural rhythm,
  attached optional rooms. Implemented as `cathedral`.
- **Oriented terminal tiles:** an entry bearing plus an area-specific relative
  destination bearing. Implemented as `crypt`, with a left-relative approach
  in four seeded orientations. This is an original teaching grammar, not a
  complete Diablo II tile catalogue or a reproduction of reverse Tower seeds.
- **Circuit:** two traversable arms around a reserved void, reunited before the
  destination. Implemented as `circuit`; one intrinsic loop plus the requested
  extra loop budget. This is our design synthesis, not a claimed copy of Atoll.
- **Organic field / coast / cavern:** continuous terrain and broad landmarks;
  incidental route connections are possible. Existing `terrain` is preserved.
- **Hub and spokes, figure-eight, interlocking courts, quest set pieces:** useful
  further families; not implemented or claimed as completed in this pass.

### The generation process we can actually defend

1. Pick a spatial grammar separately from biome material. Fix entry and terminal
   conditions first. Reserve structural negative space, especially circuit islands.
2. Construct the route graph and attach bounded optional destinations. Reserve
   the entry and boss from arbitrary extra links; reward leaf destinations.
3. Realize geometry within a separation budget. Jitter centers and vary room
   sizes, but leave enough space for a corridor bend outside each physical port.
   Cathedral columns remain outside the central lane and portal clearances.
4. Rotate all geometry and metadata together. Recompute walk distances on the
   final collision grid before assigning encounter depth and the shortest route.
5. Validate what a player can traverse: seal the crypt's terminal port and require
   the boss to become unreachable; seal each circuit arm separately and require
   another route to remain. This caught a real widened-door bypass during development.
6. Render and inspect the actual walkability contour before judging textures.
   Door tint, exploration frontiers and field notes make the rule observable.
   Natural terrain's graph is explicitly an intended pacing scaffold; its planned
   loop count is not a measured count of all terrain loops.

### Version and integration boundary

Natural terrain retains generator version 3.0.0 and its original seed geometry.
New grammars export version 4.0.0, with `expedition.layout`, orientation notes and
`intrinsicLoops`. The browser imports versions 2, 3 and 4. Native Verdigris's prior
parity evidence applies to the earlier terrain generator; **the new layout
grammars have not been ported or verified in the separate native repository**.
Use the browser's full map packets for inspection; do not expect a native v3
seed-only consumer to recreate a v4 layout.

No new bitmap assets were needed. Existing terrain textures remain in use;
new layout shapes, collision, doorways and automap lines are generated in code.
