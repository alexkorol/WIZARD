# Verdigris Pixel-Art Prompt Pack (image-2 test batch, 2026-07-10)

Purpose: a pixel-art asset lane for Verdigris that doubles as a fresh
pixel-perfecter test corpus. Every output goes through the reconstructor
(`python -m pixel_perfecter.cli <file> --transparent-bg` in
`Z:\Code\Python\pixel-perfecter`) to recover the true 1x sprite; the
1024px generations get ingested into `benchmarks/wild_corpus` afterwards.

This file follows ASSET-BRIEF.md v2 rules (numeric openers, positive
phrasing, one material per item, slot diversity, no-repeat novelty for
text-only items). It does NOT touch PROMPT.txt.

---

## image-2 pixel-art technique notes (researched 2026-07-10)

The unintuitive parts, distilled:

1. **Declare the logical sprite resolution AND that the canvas is a
   blown-up view.** Bare "pixel art" gives mixed pixel sizes (the exact
   failure class our bench flags as mixed-scale). Saying "drawn on a
   48x48 pixel grid, shown magnified so each logical pixel is one large
   crisp square, all squares on one single uniform grid" is the single
   biggest lever.
2. **Write the palette as a hard rule with a count.** image-2 treats
   "strict palette of at most 16 colors" as a constraint, not a vibe.
   Vague "retro colors" drifts back to thousands of shades.
3. **Era anchors beat style adjectives.** "16-bit era, SNES-style
   action-RPG inventory sprite" outperforms "pixel art style" alone.
   Combine nostalgia specificity with the technical constraints.
4. **"No anti-aliasing, no dithering noise, no blur, no glow" works** —
   these are concrete-artifact negations (same class as "no watermark"),
   which are the one kind of negation that does not backfire.
   Never negate styles ("not painterly") — that injects them.
5. **Glow/bloom is the reconstruction killer.** Our bench's only
   human-confirmed soft failures were bloom-heavy sources. Ask for
   "hand-placed single-pixel highlights" instead of any glow language,
   and keep magical effects as flat-color shapes.
6. **Reroll, don't correct.** Asking image-2 to fix a bad render
   underperforms re-running the same prompt. Expect 2-3 rolls on hard
   items; QA each against the checklist before staging.
7. **Reference-image mode transfers structure better than words.**
   For pixelization, attach the render and describe what to PRESERVE
   (silhouette, proportions, materials, 3/4 angle) plus the target
   sprite spec. Full sheets in one image collapse; ask for separate
   images with a numeric opener (house rule 20 already covers this).
8. **Background: flat matte ONLY — never mention transparency.**
   (2026-07-10 batch result: every prompt that requested true alpha came
   back with a PAINTED white-grey checker. Naming transparency or the
   checker artifact injects it — same mechanism as style negations.)
   Ask for one solid flat uniform background in a stated hex that is
   outside the sprite's palette: olive-slate `#737A68` by default,
   slate-blue `#6B7686` when the item's materials include green or olive
   tones (jade, serpentine, verdigris). Key it locally afterwards
   (`core/chroma_key.py`, or the reconstructor's `--transparent-bg` on
   the 1x output — flat pixel fills key trivially). If a checker still
   appears, reroll; it cannot be keyed.

Sources: [OpenAI cookbook image-gen prompting guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide),
[gpt-image-2 sprite-sheet community thread](https://community.openai.com/t/developing-sprite-sheets-with-gpt-image-2/1379831),
[GPT-Image2-Skill pixel-art gallery](https://github.com/wuyoscar/GPT-Image2-Skill/blob/main/skills/gpt-image/references/gallery-pixel-art.md),
[Renoise AI pixel art guide](https://renoise.ai/guides/ai-pixel-art).

---

## A. Shared pixel style block (assemble like PROMPT.txt: opener + block with {DESC})

> Generate an image, no commentary. Square canvas (1:1 aspect ratio).
> 16-bit era action-RPG inventory item sprite in the tradition of SNES-era
> Diablo-like dungeon crawlers: {DESC}. Authentic hand-placed pixel art,
> as if drawn pixel by pixel in Aseprite. The sprite is drawn on a 48x48
> pixel grid and shown magnified to fill the canvas, so each logical
> pixel is one large, perfectly square, crisp block, and every block sits
> on one single uniform grid. Strict limited palette of at most 16
> colors. Flat color fills with two-step shading (base tone, one shadow
> tone, one highlight tone) lit from the upper left, plus hand-placed
> single-pixel highlights on hard edges. A clean one-pixel dark outline
> around the silhouette. The item is a complete, solid object at a
> dynamic three-quarter hero angle, large, filling the frame; long items
> lie on a bold diagonal. Made only of the materials named. Crisp hard
> pixel edges everywhere: no anti-aliasing, no dithering noise, no blur,
> no glow, no soft gradients, no outline halo. The sprite is isolated on
> one solid flat uniform olive-slate `#737A68` background: a single
> unbroken color field filling everything outside the sprite, and a
> color that appears nowhere in the sprite's own palette. No background
> pattern, no background texture, no gradient, no cast shadow, no ground
> plane, no text, no watermark, no frame.

(Background swap: use slate-blue `#6B7686` instead of olive-slate when
the item's materials include green or olive tones — jade, serpentine,
verdigris. Never mention transparency, alpha, or checker patterns in
any pixel prompt; see technique note 8.)

Variants to A/B on the first few rolls:

- **Grid size:** swap `48x48` for `32x32` (chunkier, more iconic) or
  `64x64` (more material detail). Keep one size per batch so the set
  reads coherent.
- **Palette anchor:** append `The palette leans cold and desaturated -
  slate greys, bone whites, deep neutral shadows - with warmth only
  where the material itself is warm.` (carries the Verdigris grading
  into pixel land).
- **Tall weapons:** swap the opener for
  `Generate an image, no commentary. Vertical portrait canvas (2:3
  aspect ratio).` and `48x48` for `a 32x64 pixel grid`.

## B. Image-to-image: pixelizing existing rpg_inventory renders

Attach ONE asset PNG from `tools/rpg_inventory/assets/` per prompt.
Good first inputs (bold, unambiguous silhouettes across materials):
`steel_longsword`, `idolstaff_jade`, `tower_shield`, `khopesh_skymetal`,
`macuahuitl_obsidian`, `war_axe`, `crest_bronze`, `ember_shell`,
`onyx_amulet`, `wayfarer_boots` (pair), `astral_plate`, `cur_orb`.

**B1 — faithful pixelization (structure preserving):**

> Generate an image, no commentary. Square canvas (1:1 aspect ratio).
> Redraw the object in the attached image as an authentic 16-bit era
> action-RPG inventory sprite, hand-placed pixel by pixel. Preserve the
> object's exact silhouette, proportions, viewing angle, materials, and
> color identity. The sprite is drawn on a 48x48 pixel grid and shown
> magnified to fill the canvas, each logical pixel one large crisp
> square block on one single uniform grid. Strict limited palette of at
> most 16 colors sampled from the attached image. Flat color fills with
> two-step shading lit from the upper left and a clean one-pixel dark
> outline. Crisp hard pixel edges: no anti-aliasing, no dithering noise,
> no blur, no glow, no soft gradients. The sprite is isolated on one
> solid flat uniform olive-slate `#737A68` background: a single unbroken
> color field, a color that appears nowhere in the sprite's own palette.
> No background pattern, no gradient, no cast shadow, no text, no
> watermark, no frame.

**B2 — chunky icon read (when B1 keeps too much realism):**

Same as B1 but: `32x32 pixel grid`, `at most 12 colors`, and append
`Simplify aggressively: keep only the shapes that survive at icon size;
drop fine texture in favor of bold readable color masses.`

**B3 — loadout extraction, pixel mode (the 07-07 breakthrough, pixelized):**

Attach a full character/loadout image, then:

> Generate 6 images. No commentary. From the equipment worn by the
> character in the attached image, extract six separate action-RPG
> inventory item sprites, one image per item: head, body armor, main
> hand, offhand, belt, footwear. Each image is an authentic 16-bit era
> sprite of that single complete item alone, drawn on a 48x48 pixel grid
> shown magnified so each logical pixel is one large crisp square on one
> single uniform grid, at a dynamic three-quarter angle, strict palette
> of at most 16 colors per sprite taken from that item's materials in
> the source, flat fills with two-step shading lit from the upper left,
> one-pixel dark outline, crisp hard pixel edges, no anti-aliasing, no
> dithering noise, no glow. Preserve each item's construction,
> attachment points, and proportions exactly as worn in the source.
> Each sprite is isolated on one solid flat uniform olive-slate
> `#737A68` background: a single unbroken color field, a color that
> appears nowhere in that sprite's palette. No background pattern, no
> gradient, no cast shadow, no text, no watermark.

## C. Text-only sprite prompts (novel items, slot-diverse per rules 9/13)

Use style block A with these DESCs (one material each, novelty-checked
against `assets/` on 2026-07-10; weapons capped at two):

| slot | DESC |
|---|---|
| weapon | a two-handed bronze maul with a heavy cast cylindrical head on a thick dark hardwood haft |
| weapon | a flanged bronze mace with four plain flanges and a leather-wrapped grip |
| body | a cuirass of overlapping polished horn plates laced together with rawhide, front and back plates joined at the shoulders |
| head | a helmet hammered from a single sheet of dark copper with broad cheek guards, seen at a three-quarter angle showing its full domed shell |
| offhand | a crescent-notched round shield carved from one thick slab of dense dark wood, plain raised rim, front fighting face only |
| waist | a wide belt of thick layered hide with a plain cast bronze hook clasp, laid out horizontally *(use landscape opener, 64x32 grid)* |
| hands | a pair of forearm bracers of quilted undyed linen with simple stitched seams, shown upright as a pair |
| feet | a pair of hide boots with wrapped shin lacing, shown together at a dynamic angle |
| neck | a torc of two twisted bronze rods with plain flattened ends |
| focus | a heavy bronze hand-bell with a carved bone clapper and a short bone handle |
| relic | an offering bowl carved from one piece of polished dark serpentine stone, wide and heavy |
| trophy | a single massive aurochs horn, polished, with a plain drilled hanging hole |

## D. Batch discipline + pipeline

- Pace per ASSET-BRIEF: <=12/hr, break every ~10 images, <=50/day.
  Interleave reconstruction QA between rolls.
- QA each render (squint test at 48px, complete object, uniform pixel
  grid, no glow, palette actually limited) before staging.
- Stage to `assets_staging/`, then reconstruct:
  `python -m pixel_perfecter.cli assets_staging\file.png -o pixel_out --transparent-bg`
  The 1x output is the real asset; the detected pitch should be near
  1024/48 = 21px (or 32px for 32x32-grid rolls). A wildly different
  pitch = the render broke the uniform grid; reroll.
- Copy the raw 1024px generations into the pixel-perfecter staging dir
  and ingest with `python benchmarks/ingest_wild.py <dir> --source image2-verdigris`
  so the bench gets a fresh image-2 slice.
