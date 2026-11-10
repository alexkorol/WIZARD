# Spell Effects Lab

Single-file WebGL2 laboratory for spell, aura, fire, atmosphere, item and HUD effects. Added 16 October 2026 from a Claude artifact made for the owner. `index.html` is that page with its display text renamed plainly (8 November 2026): effect names, categories, variants and notes say what is drawn, and lore and other games' proper names are removed. Ids, shader code and parameters are unchanged.

## What it holds

- 181 layered effects in sets: Spell set A (94), Spell set B (42), ARPG (14) and the Lab set (31: props, UI, items, portals, atmosphere and materials), plus 17 Combat reels that are not in `catalog.json`.
- Spell sets A and B recreate spell visuals from two roguelike games, named by what they show. Their data keys stay `Crawl` and `Rift Wizard` (in `set` here and in both catalogs); the page maps them, and old category keys such as `Invocations`, to plain display labels (`SET_LABEL`, `CAT_LABEL`).
- Each effect declares parameters (colour, radius, density and similar), variants, a breakdown of how it is built, and a `port` note describing how to rebuild it in a game engine.
- Layers are instanced meshes, particles, raymarched volumes or screen passes; every layer snippet runs inside a shared template with the library below.
- Ratings: stars or keys 1 to 5 on any effect; the Ratings button produces a text list to paste back to an agent for shortlisting.
- GLSL tab: edit any layer's snippet live; Copy full shader gives the assembled program for porting.

## Exports in this folder

- `catalog.json`: every effect's id, set, category, stage, tags, notes, port note, parameters, variants and layer list, extracted from `index.html`.
- `lib.glsl`: the shared GLSL library (hashes, shaping, noise, voronoi, hex-tiling, simplex, colour ramps, SDFs, sprite masks, lighting, ice material) as one file for porting.

## Verdigris use

The ARPG (Unity) ships `Resources/VFX/spellforge-catalog.json` built from `catalog.json`, maps its spells to Spell Effects Lab effect ids, and carries an HLSL port of `lib.glsl` as `Shaders/Spellforge.hlsl`. The ARPG set (Spark, Shock Nova, Frost Nova, Frozen Orb, Arctic Armour, Geyser, Spiralling hammers, Righteous Fire, Fireball Volley, Meteor, Grasping Vines, Tornado, Blade Vortex, Corpse Explosion) is the shortlist for the skills system.

## Limits

- No laboratory adapter, scenarios or state export; ratings live in the browser's local storage only.
- The page needs WebGL2 and is heavy (about 2.5 MB of source, 600 instanced meshes in some effects). Use the Resolution control on slower machines.
- Effects are references for rebuilding in Unity, not runtime assets; the GLSL cannot run in URP as is.
