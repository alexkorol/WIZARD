# Verdigris main-menu world

An original real-time Three.js menu for **Verdigris**: a complete floating disc-world before iron, with oceans, six named continental regions, island chains, mountain systems, forests, copper-roofed capitals, rim waterfalls, and an endless abyss. The default **World** view presents the full atlas; the selectable **Crownlands** view preserves the closer living-diorama composition around the Crown of Tides observatory. Menu actions provide prototype feedback rather than navigating into a game.

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

## Architecture and assets

- `app.js` builds both views deterministically from seed values. There are no downloaded models or image textures.
- World mode uses nine continuous indexed heightfields: six large named regions plus three outlying island groups. Each has an authored coastline, a primary and branching ridge system, peak groups, valley cuts, terraces, and a biome palette driven by height and slope.
- A separate elliptical ocean surface uses animated swell, long-wave variation, restrained current highlights, Fresnel response, and a luminous outer rim. Batched shallow-water shelves transition each coast into the ocean. The whole-world underside is a closed, fractured stone bowl that deepens toward the world's core: an emissive vein shader radiates branching blue energy across the lower shells, converging on a white-hot core with a halo and concentric ripple rings embedded at the apex. Seven soft-flowing waterfalls pour off the rim past the veined rock. The model reads correctly from every side — map from above, energy web from below, glowing fissures in profile.
- World vegetation uses two instanced meshes with deterministic forest masks. Rivers meander from mountain sources toward the coast and subtle road lines connect capitals to their hinterlands. Settlements reuse instanced stone/copper components; six larger capitals add foundations, halls, keeps, roofs, warm window lights, rune beacons, and buttress rhythm. Islets and coastline loops supply ocean scale cues.
- Crownlands retains its denser continuous radial heightfield with authored ridges, valleys, plateaus, basins, and river masks. Its localized water covers two basins and their connecting river rather than blanketing the terrain.
- The Crown of Tides is original procedural geometry: stepped foundations, masonry rhythm, bridge rails, buttresses, open arches, copper bands, an armillary crown, emissive rune windows, and a timed activation beam.
- Repeated trees, settlements, waystones, motes, mist, and flock are instanced or batched. The soft cloud texture is generated at runtime on a small canvas and reused for drifting world-space cloud wisps.
- The loop's activation beat wakes every capital with a synchronized teal beacon while city windows brighten and the abyss answers below. It remains deterministic and can be held for review with `?moment=crown`.
- The 36-second loop is deterministic and now uses a restrained spherical pan/tilt path around each responsive hero composition. Dragging provides bounded yaw/pitch orbiting — the pitch range extends below the horizon so the veined underside can be inspected — and wheel, trackpad, and pinch input provide bounded zoom. Keyboard users can navigate with arrows, plus/minus, and Home. After a short inspection pause, all offsets spring smoothly back into the authored loop.
- `?camera=top|bottom|front|back|left|right|core` pins the camera to an authored orthographic-style still of the current view for review and screenshots, and `window.__VERDIGRIS_DEBUG__.capture(view)` returns the same framing as a JPEG data URL without needing the loop to run.
- Rendering stops while the tab is hidden, and `pagehide` disposes GPU resources.
- No Blender or glTF export step is used; this keeps the source reproducible and the transfer small.

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

The later underside rework (closed veined bowl, embedded core, halo, and ripple rings in place of the detached abyss vortex) changes the totals by under a thousand triangles and one draw call net, so the table above remains representative.

`node validate.mjs` reports the exact local raw/gzip totals. A direct 2026-07-14 fetch of every referenced CDN response measured 338,908 bytes for Three.js, 1,332 bytes for the font CSS, and 1,114,220 bytes for all six font files. This deliberately conservative all-assets total stays below 1.6 MB raw. Browser compression, caching, and loading only used font faces can reduce transfer further, so the experience remains far below the 12 MB target.

## Accessibility and fallback

- Menu items, World/Crownlands buttons, the scene canvas, and the quality selector support keyboard interaction with visible `:focus-visible` treatment and live-region feedback.
- `prefers-reduced-motion` fixes the cinematic phase, removes pointer/camera motion, and suppresses the flock/lightning beat.
- Text contrast is protected by a scene grade and local wordmark scrim at desktop, ultrawide, and portrait breakpoints.
- If the Three.js module cannot load, a seven-second watchdog reveals an authored CSS fallback. If WebGL construction fails, the fallback appears immediately.
- The demo intentionally ships without audio, so there is no inert sound toggle.

## Provenance and licenses

All scene composition, geometry, shaders, procedural textures, UI art, and animation in this directory were created for this demo. No proprietary game art, logos, characters, compositions, models, or audio are used.

Third-party runtime dependencies:

- [Three.js 0.180.0](https://github.com/mrdoob/three.js), loaded from jsDelivr — MIT License.
- [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Inter](https://fonts.google.com/specimen/Inter), loaded from Google Fonts — SIL Open Font License 1.1.

## Known limitations

- The WebGL experience requires network access to the pinned Three.js CDN URL and Google Fonts; the static fallback covers module/WebGL failure but is intentionally non-interactive.
- There is no post-processing bloom or compressed model pipeline because the scene uses no external meshes or textures. Emissive glows use small additive shaders instead.
- Integrated/mobile GPU results vary. Auto quality is conservative on a fresh narrow-viewport load, and users can force Low when browser/device hints are inaccurate.
- Menu destinations are outside this visual prototype.
