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
