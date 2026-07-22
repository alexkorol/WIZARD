# Verdigris main-menu world

An original real-time Three.js menu for **Verdigris**: a complete floating disc-world before iron, with oceans, island chains, mountain systems, rim waterfalls, auroral curtains, nebulae, and an endless abyss. The default **World** view presents the optimized Celestial Island mesh; the selectable **Crownlands** view preserves the closer living-diorama composition around the Crown of Tides observatory. Menu actions provide prototype feedback rather than navigating into a game.

## Run locally

Serve this directory over HTTP because ES modules do not run reliably from `file://`:

```powershell
cd tools/verdigris_splash
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. Use the visible World/Crownlands control or link directly to the close view with `?view=crownlands`. Add `?moment=crown` to hold the 36-second loop at its activation/lightning beat; the parameters can be combined.

Run the lightweight static checks with:

```powershell
node validate.mjs
node --check app.js
```

## Rebuild the Celestial Island assets

The checked-in outputs under `assets/world/` are reproducible from the source STL. Install `tools/requirements.txt`, then run:

```powershell
python tools/build_world_assets.py "C:\path\to\Meshy_AI_Celestial Island_generate.stl" --output assets/world --heightmap-size 2048 --target-faces 120000
```

The build selects the largest connected body as the world, removes the separate moon and tiny detached debris, rasterizes only the topmost upward-facing surface, preserves the source model's circular horizontal proportions with one uniform X/Z scale, and reduces the runtime mesh from about 1.9 million to about 120,000 triangles. It writes:

- `celestial_world_heightmap_16bit.png` — terrain elevation data, with the underside excluded.
- `celestial_world_heightmap_preview.png` and `celestial_world_topographic_reference.png` — human/image-model references.
- `celestial_world_underside_depthmap_16bit.png` — underside relief, where white hangs farthest into the abyss and black stays nearest the rim plane.
- `celestial_world_underside_depthmap_preview.png` and `celestial_world_underside_topographic_reference.png` — readable bottom-geometry references, north-up and pixel-aligned with the top maps.
- `celestial_world_underside_texture.png` — the art-directed dark-stone underside surface used by the menu shell.
- `celestial_world_footprint.png` — the hard world boundary.
- `celestial_world_texture_prompt.txt` — paste-ready varied-territory texture prompt.
- `celestial_world_top_texture.png` — the shadeless varied-territory top-down base-color texture, projected only onto upward-facing terrain and ocean geometry so the 3D scene supplies all shading.
- `celestial_world_top_texture_4k_detail.png` — the 4096×4096 reference-quality master assembled from sixteen overlapping image-model detail repaints with feathered seams and an original-map structural guide.
- `celestial_world_top_texture_4k_detail.webp` — the visually matched, browser-efficient 4K runtime derivative used by the menu scene.
- `celestial_world_4k_tile_detail_prompt.txt` — the exact constrained detail-paint prompt template used for every overlapping tile.
- `celestial_world_optimized_no_moon.stl` — cleaned, decimated Z-up interchange mesh.
- `celestial_world_runtime.glb` — Y-up, vertex-colored game mesh used by the menu.
- `celestial_world_build_report.json` — component removal, height range, transform, and reduction audit.

## Architecture and assets

- `app.js` loads the local optimized GLB for World view and builds Crownlands plus a procedural World fallback deterministically. If the model fails to load, the existing procedural atlas remains visible.
- The imported world projects the feather-stitched 4K varied-territory atlas onto the complete upward-facing mesh, including its detailed sea. Water is shaded on that one surface with fine directional shimmer and lower roughness; the blob-prone translucent procedural ocean is hidden and used only as a fallback if the GLB fails. It retains seven perimeter waterfalls, restrained mist and abyss lighting, drifting cloud wisps, three shader aurora curtains, and a cyan/violet nebula field in the sky. Below the rim, the supplied dark-stone texture wraps a mostly shallow underside that narrows into a central spinning-top peak, with smaller hanging stone forms around it. A muted, irregular glacial wall replaces the luminous cyan torus and opens around each waterfall.
- World mode uses nine continuous indexed heightfields: six large named regions plus three outlying island groups. Each has an authored coastline, a primary and branching ridge system, peak groups, valley cuts, terraces, and a biome palette driven by height and slope.
- The procedural fallback retains an animated ocean, shallow-water shelves, and a closed underside shell. With the imported world active, its ocean and generated backfaces are suppressed in favor of the shaded atlas and the art-directed slate-and-stalactite shell. Seven soft-flowing waterfalls continue past the rim in both cases.
- World vegetation uses two instanced meshes with deterministic forest masks. Rivers meander from mountain sources toward the coast and subtle road lines connect capitals to their hinterlands. Settlements reuse instanced stone/copper components; six larger capitals add foundations, halls, keeps, roofs, warm window lights, rune beacons, and buttress rhythm. Islets and coastline loops supply ocean scale cues.
- Crownlands retains its denser continuous radial heightfield with authored ridges, valleys, plateaus, basins, and river masks. Its localized water covers two basins and their connecting river rather than blanketing the terrain.
- The Crown of Tides is original procedural geometry: stepped foundations, masonry rhythm, bridge rails, buttresses, open arches, copper bands, an armillary crown, emissive rune windows, and a timed activation beam.
- Repeated trees, settlements, waystones, motes, mist, and flock are instanced or batched. The soft cloud texture is generated at runtime on a small canvas and reused for drifting world-space cloud wisps.
- The loop's activation beat wakes every capital with a synchronized teal beacon while city windows brighten and the abyss answers below. It remains deterministic and can be held for review with `?moment=crown`.
- The 36-second loop is deterministic and now uses a restrained spherical pan/tilt path around each responsive hero composition. Dragging provides bounded yaw/pitch orbiting — the pitch range extends below the horizon so the veined underside can be inspected — and wheel, trackpad, and pinch input provide bounded zoom. Keyboard users can navigate with arrows, plus/minus, and Home. After a short inspection pause, all offsets spring smoothly back into the authored loop.
- `?camera=top|bottom|front|back|left|right` pins the camera to an authored orthographic-style still of the current view for review and screenshots, and `window.__VERDIGRIS_DEBUG__.capture(view)` returns the same framing as a JPEG data URL without needing the loop to run.
- Rendering stops while the tab is hidden, and `pagehide` disposes GPU resources.
- The Python conversion tool replaces a manual Blender cleanup/export step while producing standard STL and glTF outputs that can still be opened in Blender.

## Quality tiers

`Auto` starts from coarse-pointer, viewport, memory, and logical-core hints, then can step down after sustained low frame rate. Manual selection disables adaptive changes until `Auto` is selected again.

| Tier | DPR cap | Shadow map | Crown trees | World trees | City lights | Motes | Clouds |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| High | 1.65 | 2048 | 360 | 860 | 96 | 320 | 10 |
| Balanced | 1.20 | 1024 | 230 | 620 | 72 | 200 | 7 |
| Low | 1.00 | off | 120 | 340 | 42 | 90 | 4 |

Geometry is reused across tiers; controls change draw ranges, instance counts, shadows, and pixel ratio without rebuilding the scene. The renderer uses ACES tone mapping, explicit DPR caps, batched props, and no post-processing pass.

## Measured performance

Measurements were taken on 2026-07-14 in the Codex in-app Chromium browser, served from localhost. They are observed values, not universal claims; the test browser ran at a 60 Hz presentation ceiling.

| View / tier | Observed FPS | Frame time | Draw calls | Triangles |
| --- | ---: | ---: | ---: | ---: |
| World, 1280x720 Auto/Balanced | 60 | 16.7 ms | 54 | 125,818 |
| World, 390x844 fresh Auto/Balanced | 60 | 16.7 ms | 54 | 125,818 |
| World, 1728x720 Auto after settling to Balanced | 60 | 16.7 ms | 54 | 125,818 |
| World activation beat, 1280x720 Auto/Balanced | 60 | 16.7 ms | 56 | 126,010 |
| Crownlands, 1440x810 Auto/Balanced | 60 | 16.7 ms | 52 | about 54,000 |

At 1728x720, Auto initially selected High and measured 37.8 FPS in this test browser; after 5.2 seconds of sustained pressure it stepped down to Balanced and recovered to the 60 Hz ceiling. This is the intended adaptive path rather than a claim that High reaches 60 FPS on every GPU.

The imported shell and atmosphere stay close to the measured geometry totals; the local validation command reports exact current source and asset sizes.

`node validate.mjs` reports the exact local raw/gzip totals. A direct 2026-07-14 fetch of every referenced CDN response measured 338,908 bytes for Three.js, 1,332 bytes for the font CSS, and 1,114,220 bytes for all six font files. The menu loads the roughly 4 MB WebP derivative of the 4K top atlas rather than the 22 MB reference PNG; browser caching and loading only used font faces reduce repeat transfer further.

## Accessibility and fallback

- Menu items, World/Crownlands buttons, the scene canvas, and the quality selector support keyboard interaction with visible `:focus-visible` treatment and live-region feedback.
- `prefers-reduced-motion` fixes the cinematic phase, removes pointer/camera motion, and suppresses the flock/lightning beat.
- Text contrast is protected by a scene grade and local wordmark scrim at desktop, ultrawide, and portrait breakpoints.
- If the Three.js module cannot load, a seven-second watchdog reveals an authored CSS fallback. If WebGL construction fails, the fallback appears immediately.
- The demo intentionally ships without audio, so there is no inert sound toggle.

## Provenance and licenses

The Celestial Island source was supplied by the project owner as a Meshy generation based on their GPT Image mockup; this repository contains the cleaned, moon-free derivative and its documented build outputs. The scene composition, shaders, procedural atmosphere, UI art, and animation were created for this demo. No third-party game art, logos, characters, audio, or copied commercial-world geometry are used.

Third-party runtime dependencies:

- [Three.js 0.180.0](https://github.com/mrdoob/three.js), loaded from jsDelivr — MIT License.
- [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Inter](https://fonts.google.com/specimen/Inter), loaded from Google Fonts — SIL Open Font License 1.1.

## Known limitations

- The WebGL experience requires network access to the pinned Three.js CDN URL and Google Fonts; the static fallback covers module/WebGL failure but is intentionally non-interactive.
- There is no post-processing bloom or Draco requirement. The decimated local GLB is about 3.1 MB; emissive glows use small additive shaders.
- Integrated/mobile GPU results vary. Auto quality is conservative on a fresh narrow-viewport load, and users can force Low when browser/device hints are inaccurate.
- Menu destinations are outside this visual prototype.
