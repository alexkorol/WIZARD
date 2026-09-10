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


## Endgame place identities — 2026-09-09 follow-up

The first map-reading pass was too small in scope: a graph of several rooms with
a terrain skin does not express the difference between a temple complex, an
escarpment and a glacial river. The next stage chooses the kind of place first,
then makes its large features control traversal. A shared seed randomizer is not
a substitute for these separate spatial rules.

### Additional reference observations

The [Maps of Exile author's original survey](https://www.reddit.com/r/pathofexile/comments/13c37gj/so_i_went_through_every_map_on_atlas/)
and [maintained map data](https://github.com/deathbeam/maps-of-exile/blob/main/site/src/data/maps.json)
provide a practical contrast: Canyon is classified as linear outdoor terrain with
few obstacles; Mesa's boss access is described as a rush toward the center;
Temple is classified as nonlinear indoor terrain. These are player observations
of the cited dataset, not documentation of GGG's generation code.

Two additional firsthand screenshots were opened and inspected in the browser:

- [Mesa automap screenshot](https://i.imgur.com/q4lIOId_d.webp?maxwidth=760&fidelity=grand),
  from a [player's 2018 Mesa report](https://ru.pathofexile.com/forum/view-thread/2234987).
  The visible overlay follows layered, irregular cliff edges and folds around an
  interior formation. The underlying scene has rock faces and changes of level.
  This particular partial overlay supports nested terrain boundaries; it does
  not establish all possible Mesa layouts. Our interpretation adds a central
  plateau, broken outer terraces and explicit ramps.
- [Cold River crossing screenshot](https://i.imgur.com/OPA6pFy.png), from a
  [player's crossing report](https://www.pathofexile.com/forum/view-thread/3327010).
  The inspected portion shows a constructed, narrow bridge between stone banks,
  with pillars, snow and water beneath. It supports treating a crossing as an
  authored landmark with a protected collision span, rather than arbitrary
  walkable pixels across blue terrain. It is not a full-map automap study.

The wiki's Mesa image endpoint was blocked by a site challenge during this pass;
it is not counted as an inspected reference. No game screenshots are shipped as
assets. The six implemented types are independent interpretations, not replicas
of the six named PoE maps or a claim to have reconstructed their proprietary code.

### Implemented place construction

1. **Reserve large features.** Build temple precincts, mesa escarpments, river
   banks, canyon ribbons, cell blocks or mountain ridges on a larger collision
   field (default 208 × 156 tiles).
2. **Resolve human-scale structure.** Add pool arcades, stepped corners, shrines,
   terraces, gullies, tributaries, ravines, cell partitions and guard galleries.
   Seed variation affects boundaries, dimensions, passages or internal divisions
   according to the map type.
3. **Protect crossings.** Ramps and bridges are traversable spans. River islands
   and tributaries are placed before bridges; rock scatter cannot overwrite the
   crossings or their clearance. Mountain saddles interrupt entire contour ridges.
4. **Check actual geometry.** The guardian must already be reachable; no emergency
   straight tunnel is carved through the defining cliff, river or building.
   Unreachable incidental ground is pruned, and landmarks snap to reachable cells.
5. **Populate the whole ground.** Measure walking distances, reserve safe entry
   space and guardian clearance, then distribute encounter groups with spacing
   and local walkable clearance. Optional landmarks are separate from pack count.
6. **Expose the evidence.** The automap shows collision boundaries, the route is
   measured on collision, and topology edges follow real walking paths. Full map
   view allows inspection at useful scale; labels avoid overlapping one another.

The automated identity suite covers six types × three extents × twenty seeds.
It closes all bridges or passes in Mesa, Cold River and Summit and requires the
boss route to disappear. It also checks cell/pool/column structure, continuous
landmark paths, encounter placement and complete deterministic JSON round trips.
Browser inspection covered all six types, both material and automap presentation,
and the mountain's alternating-pass route. A comparison of 60 earlier biome,
layout and seed combinations also reproduced the published v4 packets exactly.

Version 5 packets add landscape features and elevation, and retain versioned
imports for earlier maps. The separate native repository has not been modified
or claimed to reproduce these new generators.
