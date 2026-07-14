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
- World mode uses nine continuous indexed heightfields: six large named regions plus three outlying island groups. Each has an authored coastline, ridge axis, peak system, valley cut, terraces, and biome palette driven by height and slope.
- A separate elliptical ocean surface uses animated swell, long-wave variation, Fresnel response, and a luminous outer rim. The whole-world underside is an asymmetric terraced ring mesh with fractured shelves and dark strata; seven soft-flowing waterfalls descend into a scaled abyssal vortex.
- World vegetation uses two instanced meshes with deterministic forest masks. Settlements reuse instanced stone/copper components; six larger capitals add foundations, halls, keeps, roofs, rune beacons, and buttress rhythm. Islets and coastline loops supply ocean scale cues.
- Crownlands retains its denser continuous radial heightfield with authored ridges, valleys, plateaus, basins, and river masks. Its localized water covers two basins and their connecting river rather than blanketing the terrain.
- The Crown of Tides is original procedural geometry: stepped foundations, masonry rhythm, bridge rails, buttresses, open arches, copper bands, an armillary crown, emissive rune windows, and a timed activation beam.
- Repeated trees, settlements, waystones, motes, mist, and flock are instanced or batched. The soft cloud texture is generated at runtime on a small canvas.
- The 36-second loop is deterministic. Camera drift and pointer parallax stay narrow and decay back to the hero composition. Rendering stops while the tab is hidden, and `pagehide` disposes GPU resources.
- No Blender or glTF export step is used; this keeps the source reproducible and the transfer small.

## Quality tiers

`Auto` starts from coarse-pointer, viewport, memory, and logical-core hints, then can step down after sustained low frame rate. Manual selection disables adaptive changes until `Auto` is selected again.

| Tier | DPR cap | Shadow map | Crown trees | World trees | Motes | Clouds |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| High | 1.65 | 2048 | 360 | 860 | 320 | 10 |
| Balanced | 1.20 | 1024 | 230 | 620 | 200 | 7 |
| Low | 1.00 | off | 120 | 340 | 90 | 4 |

Geometry is reused across tiers; controls change draw ranges, instance counts, shadows, and pixel ratio without rebuilding the scene. The renderer uses ACES tone mapping, explicit DPR caps, batched props, and no post-processing pass.

## Measured performance

Measurements were taken on 2026-07-14 in the Codex in-app Chromium browser, served from localhost. They are observed values, not universal claims; the test browser ran at a 60 Hz presentation ceiling.

| View / tier | Observed FPS | Frame time | Draw calls | Triangles |
| --- | ---: | ---: | ---: | ---: |
| World, 1440×810 High | 60 | 16.7 ms | 51 | 135,808 |
| World, 1440×810 Auto/Balanced | 60 | 16.7 ms | 48 | 122,362 |
| World, 390×844 fresh Auto/Balanced | 60 | 16.7 ms | 48 | 122,362 |
| Crownlands, 1440×810 Auto/Balanced | 60 | 16.7 ms | 52 | about 54,000 |

`node validate.mjs` reports the exact local raw/gzip totals; local source is about 121 KB before compression. A direct 2026-07-14 fetch of every referenced CDN response measured 338,908 bytes for Three.js, 1,332 bytes for the font CSS, and 1,114,220 bytes for all six font files. This deliberately conservative all-assets total stays below 1.6 MB raw. Browser compression, caching, and loading only used font faces can reduce transfer further, so the experience remains far below the 12 MB target.

## Accessibility and fallback

- Menu items, World/Crownlands buttons, and the quality selector are native keyboard controls with visible `:focus-visible` treatment and live-region feedback.
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
