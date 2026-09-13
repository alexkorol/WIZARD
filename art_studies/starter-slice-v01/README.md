# Village-defense prologue: first cast study

Owner scope: **Village-defense prologue only**. These are review candidates for the opening village, two attacking pack waves, and the square/well boss encounter. No Crossroads merchant assets, game checkout changes, runtime integration, or approved-canon claim.

Open `review/prologue-cast-2x.png` for the cast overview. `review/*-native-alpha.png` shows every facing at actual native resolution on light and dark backgrounds.

## Deliverables

32 transparent PNG frames, four nominal idle facings per actor, front/right/back/left. Each sheet uses **2 rows Ã— 4 columns**.

| Sheet | Top row | Bottom row | Frame canvas |
| --- | --- | --- | --- |
| `final/players-sheet.png` | Male player | Female player |48Ã—96|
| `final/villagers-sheet.png` | Field hand with staff | Scribe with clay tablet |48Ã—96|
| `final/defense-sheet.png` | Scout with flint-point hunting spear | Villager with wooden club |48Ã—96|
| `final/beasts-sheet.png` | Pack wolf | Larger well-alpha candidate |96Ã—96|

Individual PNGs are in `frames/`. Players reuse v14 unchanged; their editable source and generation provenance remain in `../player-unarmed-v14-sandals-alpha/`. Six new editable scenes are in `sources/`. The standing poses are directional studies, not walk/attack/hit/death animations. Bone rigs are retained, but kit/prop animation binding has not been implemented or validated. Nominal directions inherit the established slightly turned pose; they are not yet mapped to engine cardinal direction indices.

## Scope evidence and proposed designs

Read-only evidence from the native game: `native/client/village_defense.hpp` defines FieldHand/Scout/Scribe occupations, a civilian `wooden_club`, two pack waves, and the square/well boss; `native/content/seeds/owner_demo_zones.json` gives the prologue the `wilds` template and forest theme. The occupation names inform these generic village NPC candidates; they are not assertions that three named service NPCs already exist. The four civilians' exact looks and the wolf/alpha encounter visuals are proposals. No Thornward or Crossroads characters were included.

## Actual production path

1. `build_cast.py` ran in the live Blender MCP connection after a scene query. It opens the preserved v14 MakeHuman player source for each new scene; adult human meshes are reused, not assembled from primitives. Garment colors and simple editable role props distinguish villagers. Open sandals and the removed female shoulder drape remain. Wolves use an imported established CC0 mesh and its idle armature, normalized to proposed overall lengths1.25m and1.85m. The animal camera keeps the human lens and rotation, with vertical lens shift reduced by0.09 to accommodate the quadruped ground footprint; framing is provisional world-scale calibration.
2. Blender renders actual48Ã—96 human and96Ã—96 beast PNGs. `prepare_guides.py` explicitly thresholds alpha128, translates every frame by(0,2), checks no opaque pixels are lost, packs sheets, and verifies exact NEAREST8Ã— human /4Ã— beast enlargement. All sheet directions were inspected before generation.
3. Three built-in imagegen calls, one per sheet. `prompts/` preserves exact requests, explicitly asking for SIMULATED PIXEL ART at the same implied frame density and repeating true alpha in five prompt sections. The local Diablo II Amazon crop supplied shading style only; it is not redistributed in this pack. Structural input is always the pixelized Blender sheet. No full-detail-render-to-downsample path or generation reroll was used.
4. `process_sheets.py` preserves untouched outputs, audits real PNG mode/color type, derives explicitly local cutouts, and runs the existing Pixel Respecter engine at `Z:/Code/Python/pixel-perfecter`. Its checkout was used without modification. `reconstructed/*-fit.json` retains actual automatic diagnostics and candidate tables; `inspect_grids.py` reconstructs and displays detector-proposed alternatives. Following visual comparison, the human sheets use rigid6px candidates and beasts5px, with detector-proposed offsets. The automatic choices and alternative6/7/8-human,4/5/6-beast reconstructions remain available. Selected grids are review choices under uncertain generated grid evidence, not proof of exact imagegen pixel locking.
5. `finish_pack.py` extracts regular sheet cells and applies a single integer translation shared across every frame within each sheet. Only empty margins change; assertions verify every recovered foreground pixel and color survives exactly. No BOX/Lanczos or sprite resizing. `pack-verification.json` records offsets, frame boxes, counts and hashes.

## Alpha outcome and visual limits

**All three untouched imagegen outputs are RGB PNG color type2. Generated true alpha FAILED.** The delivered RGBA is locally derived, not evidence that the prompt succeeded. Raw originals remain in `generated/`; per-sheet `*-alpha-audit.json` records the distinction. The local mask removes only edge-connected neutral pixels (channel spreadâ‰¤20, minimum channelâ‰¥160); visible retained RGB is unchanged. A darker threshold initially erased grey spear-tip pixels; the final threshold preserves the visible tip and the final cutouts were inspected again. All32 final PNGs have binary0/255 alpha and zero RGB under transparent pixels. The reused v14 players also have explicitly local alpha.

Native and enlarged light/dark reviews show readable clothing/role distinctions, natural adult proportions and separate feet. The style is a gritty pre-rendered pixel candidate. Generated size/camera drift remains: new human body occupancy is roughly79â€“85px, versus some taller v14 player facings, and pose/prop grip consistency still needs animation-stage work. No frames were stretched to conceal that drift. Beast96Ã—96 is a padded experimental canvas accommodating long bodies/tails; it does not migrate the original32Ã—32 small-monster convention or production grid. Boss design is currently a larger, heavier wolf, not an authored unique boss species.

## Source licences

Human anatomical source: established MakeHuman CC0 meshes; full acquisition/MPFB provenance remains in `../player-unarmed-v10-mpfb/` and prior player studies. No new external human model acquisition.

Wolf: Quaternius, *Animated animales low poly*, CC0, author upload: https://opengameart.org/content/animated-animales-low-poly . Download: https://opengameart.org/sites/default/files/Animal%20Pack%20Vol.2%20by%20%40Quaternius.zip . Original selected `Wolf.blend` is retained byte-for-byte as `imports/quaternius-wolf.blend`; unused downloaded animals/archive remain local under ignored `external/`. The retained Blender scenes contain the wolf and its existing idle action. No optional Poly Pizza API key was used.

Style-only reference: Diablo II Amazon sprite crop from The Spriters Resource, held in the preexisting ignored local references directory. Not included in the distributable frames archive.
