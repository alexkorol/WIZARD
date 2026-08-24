# CLAUDE.md — Wizard Orbs showcase

ARPG life/mana orb demo: a single WebGL2 fragment shader compositing procedural
liquids into pre-rendered art plates. `index.html` is the only file Pages serves;
everything else is source.

## Layout

```
index.html          ← BUILD ARTIFACT. Never edit by hand; regenerate with build.py
build.py            ← inlines src/orb.frag + base64 assets into src/template.html
src/template.html   ← page markup, CSS, and all JS (sim, WebGL plumbing, uniforms)
src/orb.frag        ← the entire visual system (GLSL ES 3.00)
src/assets/         ← aligned plates: art.jpg, mask.png, normal_aligned.jpg,
                      empty_aligned.jpg, pack_aligned.jpg (r=depth, g=AO),
                      stone_aligned.jpg
screenshots/        ← README images
```

## Workflow

1. Edit `src/orb.frag` and/or `src/template.html`.
2. `python3 build.py` → regenerates `index.html`.
3. Verify shader compiles if glslang is available:
   `glslangValidator -S frag src/orb.frag`
   (template JS can be parse-checked with `node -e` + `new Function` on the last
   `<script>` block).
4. Open `index.html` in a browser to test (requires WebGL2).

## Invariants — do not break

- The placeholders `__FRAG__ __ART__ __MASK__ __NORM__ __EMPTY__ __PACK__ __STONE__`
  must remain in `src/template.html`; build.py substitutes them.
- Uniform names in orb.frag and the uniform list in template.html's JS must stay in
  sync (search for `getUniformLocation` array).
- Orb geometry constants are baked in the shader: ORBL=(541,484.5,252),
  ORBR=(1128,483,252) in art pixels (1672×941, y-up). New plates must be aligned to
  this frame (the originals were aligned by silhouette-IoU at scale 1.635).
- The full-resolution `art.jpg` is the sharp static stage background. WebGL is a
  transparent, cropped `ORB_VIEW` overlay around the two dynamic spheres. Keep
  the crop and `uViewOrigin`/`uViewSize` in sync. The shader must NOT discard
  mask-black pixels inside the crop — they carry the light spill and statue
  relighting (discarding them exposes the bare plate and kills the glow, the
  Aug-2026 "silver band over the dome" regression). Instead the overlay blends
  to the raw plate at the crop edges (`edgeFade` in `main()`), and the liquid
  noise stays gated by `aL`/`aR`, which is where the work budget lives.
- `levelFromFill()` in template.html must stay continuous and monotone — naive
  volume-true mapping makes the surface sprint at the top/bottom of the sphere
  (that's why it blends to linear near the poles). Any surface-attached glow must
  fade by surface *position* (dome shoulder), not by fill percentage.
- Mana condensation (`fold` in manaLiquid) is frozen above ~75% fill on purpose:
  it prevents texture slide during top-out. Anti-shimmer measures (band exponents,
  glitter at constant screen scale, drift slowdown) are keyed to the same `fold`.

## Deploy (GitHub Pages)

This folder is `tools/wizard_orbs/` inside the WIZARD repo, which serves directly
from the `gh-pages` branch (commit + push there publishes it). `.nojekyll` sits at
the repo root so Pages serves files untouched.
Live URL: https://alexkorol.github.io/WIZARD/tools/wizard_orbs/
