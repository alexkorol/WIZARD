# Verdigris Asset Brief (for the Cowork / ChatGPT-Pro image run)

Goal: item art for the Verdigris pack, generated on the ChatGPT web app
(Pro plan credits) instead of the API ($0.37/img). Same pipeline as before:
art on pure black → alpha matte → composite → autocrop (script pattern:
`gen_assets.py` from the July 2026 session; only the generation step changes).

## ⚑ AUTHORITATIVE STYLE (v2, 2026-07-04 pm) — USE THIS, supersedes the v1 blockquote below

Hard lessons from review (do NOT relitigate these — they cost real quota):

1. **Dynamic 3/4 hero angle, never flat.** ARPG icons (Path of Exile, Diablo 2,
   Last Epoch) show the item tilted in a three-quarter view — partly from the
   side and slightly above — so it reads as a solid object with volume. Dead-on
   front or pure side views look like stiff museum archival photos. This also
   fixes "backless" reads: a helmet at 3/4 shows its full domed shell and the
   back of the head, not just a face-plate.
2. **Complete, solid, wearable object seen in the round.** It must look like a
   real thing that fully does its job (a helm protects the whole head; a vest
   wraps the torso). Never a fragment or facade.
3. **Fill the frame + right aspect ratio.** GPT-image defaults to square and
   SQUISHES anything long or wide. Always set the canvas (portrait for
   weapons/tall armour, landscape for belts) AND say the item fills the frame
   edge-to-edge; long weapons sit on a bold diagonal spanning corner to corner.
4. **Pairs render as a pair.** Boots, sandals, greaves, bracers, gloves, grips
   → show BOTH pieces together, overlapping at a dynamic angle (our slots draw
   one icon, so the pair must be in that one image).
5. **Dramatic game lighting.** Strong directional key light (upper-left), deep
   shadow, a crisp cool rim light on the silhouette. High contrast, moody, not
   flatly lit.
6. **Flat uniform MID-GREY background (blue-grey for grey-metal/flint items),
   NO cast shadow / ground plane** — one solid colour the adaptive local matte
   keys out (2026-07-05 pivot; older art on #000000 still mattes fine). Cold
   neutral grading, no yellow/sepia wash.
7. **QA every render before accepting.** Look at it: complete object? 3/4 and
   dynamic? fills frame, not squished/tiny? pair if applicable? deadly/cool for
   a game, not a diagram? If any "no", re-roll — do not stage a dud.

### The prompt text lives in ONE place: `core/PROMPT.txt` (hand-tuned by Alexei)

`core/PROMPT.txt` is the style prompt — Alexei tunes it BY HAND; agents never
edit it. status.py reads it ('#' lines stripped, whitespace collapsed) and
assembles canvas prefix + PROMPT + DESC; `python3 core/status.py --prompt
ART_ID` emits the exact final prompt. Canvas prefixes + the blue-grey
fallback swap live in status.py. Rules below apply when Alexei tunes it
(agents: rules 1-6 still govern DESC writing):

1. POSITIVE PHRASING ONLY for style/render qualities. Never name the thing
   you don't want — "NOT painterly", "not magical", "no museum view" all
   INJECT those tokens and the model drifts toward them. Describe only the
   wanted look. (Negations are OK for concrete artifacts: no text, no
   watermark, no drop shadow, no vignette — those work.)
2. Ask for TRUE-ALPHA output first (real transparent PNG), flat grey fill as
   fallback (blue-grey for grey metals — the swap is automated in status.py).
   qa_gate detects both; compose_assets uses source alpha directly for true
   alpha, and art_matte is only for flat fallback backgrounds. Painted
   checkerboard = reject.
3. Do not prompt tiny closure hardware as decoration (toggles, buckles,
   clasps). But wearable/carryable gear must still have credible structural
   attachment: broad straps, lacing, side ties, leather backing, shoulder
   straps, or front/back plates joined at the shoulder and sides.
4. DESCs (targets.tsv) hold ONLY item content — materials, construction,
   proportions ("a pair of, shown as a pair", "entire weapon visible") —
   never render-style words.
5. ONE MATERIAL PER ITEM (2026-07-06, Alexei). A base item is its material
   plus at most an obvious functional secondary (leather grip, wooden haft,
   cord). NO decorative accent materials — no gold bands/inlays/collars/
   caps/rivets sprinkled onto iron or jade items. Enchantment prefixes/
   suffixes carry the uniqueness in-game; base art stays clean. Composites
   are allowed ONLY when the composite IS the rung's identity (bronze scales
   over a plain leather backing, sheet-bronze plates over leather) and
   then the construction must dominate the read instead of becoming a
   hair-thin detail.
6. GENERIC COLOR LANGUAGE FOR BASES (2026-07-07). Do not encode lore/fashion
   specificity into base rows: no oxblood, burgundy, glossy black-dyed trim,
   lapis, turquoise chips, gold wire, feather tassels, cowrie rows, tusk
   fetishes, deity/frieze motifs, or named symbolic decoration. Use "plain
   leather", "dark leather", "plain cord", "simple stitched seams", "clean
   bronze", "raw dark iron", etc. Save strong color accents and ceremonial
   trim for uniques, awakened relics, faction sets, or reviewed exceptions.
7. COMMIT FULLY TO EXOTIC MATERIALS (2026-07-06, Alexei — "full permission
   to step away from AI tropes and cliche fantasy constructs"). "X-inlaid
   Y" is a trope hedge: not jade-inlaid bronze greaves but greaves carved
   ENTIRELY of jade. A full-jade / full-amber / full-bone item is bolder
   and reads better than a timid accent. When a rung is named for an
   exotic material, the whole item is that material.
8. JADE WEAPON RULE (2026-07-07). Jade is bad for blades and reach weapons:
   no jade sabres, daggers, axes, spearheads, glaives, polearms, or other
   cutting/piercing weapons. If jade is used as a weapon material, it must be
   blunt or mace-like: club, mace, maul, hammer, idol-head cudgel, or heavy
   ritual striking object. Jade remains fine for armour, jewellery, foci,
   curios, and other non-bladed bases.
9. PROMPT BATCH DIVERSITY (2026-07-07). Candidate batches must cover the
   inventory, not only reliable weapons. Default roast batches cap weapons at
   two and include armour/helmets, shields/off-hands, limb/waist wearables,
   jewellery, and rite/relic/curio/trophy objects.
10. NO CURRENCY/CRAFTING-MATERIAL IDEATION (2026-07-07). Do not propose new
   crafting currencies, pigments, omens, ingots, molds, generic orbs, seal
   weights, draughts, reagent stones, or abstract bench-tool tokens unless
   Alexei explicitly reopens that lane.
11. RELIC GEAR MUST BE CONCRETE IMPLEMENTS (2026-07-07). Avoid weak AI-trope
   mystic trinkets. Use strong ritual-object construction: double-ended
   pronged sceptres, heavy hand bells, handled tablets, forked standards,
   idol-head cudgels, offering bowls, reliquary boxes. Borrow
   silhouette logic from real implements like vajra/dorje forms, but do not
   copy living sacred iconography one-to-one or use exact religious names as
   ordinary base names.
12. BASES MUST READ AS EQUIPPABLE GEAR (2026-07-07). Prompt candidates must
   look worth looting before tooltip context: enough mass, construction, and
   silhouette authority to block, strike, ward, carry, bind, or focus power.
   Retire weak/toy-like prompt ideas as positive examples: wicker shields,
   rite batons, pencil-thin wands, hand stones, tiny darts, shrine miniatures,
   reed baskets or maps, road charms, loose feather markers, and other one-off
   props. If reed or wicker appears, it is hidden backing under hide/leather,
   not the named shield face or item thesis.
13. TEST PROMPTS ARE NOVELTY-CHECKED NEW ITEMS (2026-07-07). When Alexei asks
   for "test prompts" or "prompts to roast", never repeat or restyle items
   already made. First check current `assets/`, accepted manual intake in
   `download-intake.js`, duplicate/exclusion notes in `DOWNLOAD-INTAKE.md`,
   and discard/rework state in `asset-review.js`. Style-calibration prompts
   follow the same no-repeat rule unless Alexei explicitly names an existing
   item and asks to restyle that exact item.
14. WEARABLE/CARRIED CONSTRUCTION MUST BE PLAUSIBLE (2026-07-07). Armour,
   quivers, belts, greaves, bracers, sandals, and shields must visibly explain
   how they stay on the body or in the hand. Use broad straps, lacing, backing,
   arm loops, shoulder straps, front/back plates, overlap, or wrap geometry.
   For hard armour, avoid one-piece magic shells unless the real object can be
   made and donned that way. Bone armour is assembled from smaller bone plates,
   splints, or sections on hide/leather backing; never a perfect solid
   shin-guard-shaped bone plate.
15. NO BORING FORCED RELIC BASES (2026-07-07). Flat tablets, ward plates,
   symbol plaques, carved slabs, and generic hand-held boards are not exciting
   ARPG loot bases. Relic gear needs a strong held/worn/handled implement with
   mass and purpose: bowls, bells, pronged sceptres, standards, reliquary boxes,
   idol-head cudgels, trophy settings, or small shield-like foci.
16. SOURCE-IMAGE LOADOUT EXTRACTION (2026-07-07, Alexei). A full character or
   loadout image can be used as a coherent equipment source, not merely as a
   render-style reference. This is often better than prompting isolated items
   in a vacuum because the source image supplies material logic, ornament
   density, attachment points, proportions, and slot relationships. Details
   such as feathers, tassels, scratches, shell plates, cords, chains, veils,
   stones, coins, and symbols are allowed when they are visibly integrated into
   the item and belong to the source kit. The failure to avoid is ungrounded
   decoration: random lore marks, loose clutter, costume fragments, or detail
   that breaks readability/utility. Use `core/LOADOUT-EXTRACTION.md` for this
   mode.
17. SELF-CONTAINED CHARACTER/SOURCE PROMPTS (2026-07-07). Do not shorten final
   image-generation prompts by naming a faction, class, or tier and assuming
   the model has project context. Every final prompt must restate the full
   faction design language, class/stat gear grammar, tier progression or tier
   target, rendering style, spacing/composition rules, and weapon constraints.
   Composite assembly is fine: build prompts from reusable blocks or scripts if
   needed, but the final prompt pasted into ChatGPT/image-2 must be complete.
   Completeness is not a checklist of terse labels: do not optimize for
   brevity, do not assume lore familiarity with Verdigris faction names,
   and do not compress faction/class descriptions into title-case shorthand.
   Prefer long, explicit, redundant prompt blocks that can stand alone in a
   fresh image model session.
   Do not save Alexei's proprietary legacy character prompts in this public repo;
   save only distilled process rules and generic prompt structure.
18. SLOT HYGIENE AND ANTI-COSTUME CLUTTER (2026-07-08). Item extraction prompts
   must actively block invasive charms, dangles, chimes, tiny hanging rings,
   delicate chains, and harness clutter unless those details are structural and
   useful. Rings for fingers are compact bands, signets, coils, socket rings, or
   seal rings; no dangling charms, tassels, chains, bells, or loose ornaments.
   Amulets are pendants on a cord, twine, leather thong, or simple chain, with
   the pendant filling most of the 1x1 image and the string curled behind or
   around it; do not turn the amulet slot into a gorget, collar, or armor
   throat-piece unless explicitly requested. Body armor must be the chest/body
   piece only: open neck/chest read preferred, no attached collar/gorget, no
   turtleneck, no built-in belt/skirt/faulds as the item thesis. Belts are
   horizontal waist items for a 1x2 slot, not faulds, tassets, or skirts.
   Shields show the front fighting face only: no clamshell opens, front-side
   straps, dangling hardware, handle loops, or utility rigging on the visible
   shield face. Helmets avoid vision-hazard dangles. Cloaks and armor avoid
   stealth-hazard chimes, dangling charms, and excessive shredded gauze. Solar
   symbols, eight-spoked wheel symbols, and human-face centerpieces are
   high-risk overused motifs; avoid them by default, use them only as reviewed
   exceptions, and never propagate the same motif across every slot in a set.

### Prompt changelog

- 2026-07-04 v2: 3/4 hero angle, fill frame, PoE/D2 framing, dramatic
  lighting; replaced painterly-oil v1.
- 2026-07-05: crisp game-icon look; grey bg replaces black; skymetal = plain
  raw dark iron (negation stacking removed); no spirals.
- 2026-07-06: TRUE-ALPHA background requested first, grey fill fallback.
- 2026-07-07: closures/fastenings never prompted. Render-style sentence
  rewritten positive-only ("sharply modeled high-detail 3D game asset, crisp
  hard edges, photoreal material textures") — the old sentence contained
  "stylized"/"painterly" as negations and the style was leaking back in.
- 2026-07-07: prompt extracted to PROMPT.txt for Alexei's hand-tuning;
  one-material rule; commit-fully-to-exotic-materials rule (full jade
  greaves, not jade-inlaid); agents no longer touch the style text.
- 2026-07-07: jade retired from bladed/reach weapon bases. Jade weapons are
  allowed only for blunt, mace-like silhouettes.
- 2026-07-07: prompt-candidate batches require slot diversity; currency and
  crafting-material image ideation paused.
- 2026-07-07: relic gear guidance added: concrete ritual implements over vague
  AI mystic trinkets.
- 2026-07-07: weak-prop scan added: no wicker shields, rite batons, tiny
  darts/hand stones, shrine miniatures, reed props, or other joke-loot bases.
- 2026-07-07: no-repeat test-prompt rule added and extended to style
  calibration. Test prompts now mean novel item concepts unless Alexei
  explicitly names an existing item for restyling.
- 2026-07-07: true-alpha manual accepts bypass mask generation and palette
  quantization; compose directly from source alpha. Wearable construction and
  boring tablet/plaque relic failures added as hard prompt rules.
- 2026-07-07: corrected style-reference guidance after Alexei's loadout
  extraction test. Full character/source images are useful because they encode
  coherent equipment systems, not just crisp rendering. Integrated feathers,
  tassels, shell, cords, chains, veils, stones, scratches, and ornaments are
  valid when they belong to the item; the banned failure is ungrounded detail
  pasted onto isolated prompt nouns.
- 2026-07-07: ChatGPT batch true-alpha proved unreliable for source-image
  loadout extraction. The working fallback is flat olive-slate matte
  `#737A68` plus local `core/chroma_key.py`; magenta backgrounds are rejected
  because their edge fringe is too visible.
- 2026-07-07: source-image loadout extraction needs an explicit long-weapon
  framing rule. Spears, pikes, staffs, standards, and polearms must be
  full-length tip-to-butt, shaft-dominant, and set on a steep corner-to-corner
  diagonal; shortened club/wand/mace-length versions are rejects.
- 2026-07-07: character/source prompt construction must stay self-contained.
  Do not truncate faction/class/tier descriptions into shorthand labels; use
  composite prompt blocks if needed, but paste a complete prompt into image-2.
  Prompt length is not the thing to optimize; visual specificity is.
- 2026-07-08: slot-hygiene rule added from batch review. Future prompts must
  suppress dangling ring jewelry, loose charms/chimes, excess harness rings,
  motif spam, amulet-as-gorget drift, body-armor collars/belts, belt-as-skirt
  drift, shield front hardware, gauze/ragged-cloth overuse, and delicate
  costume-chain bias.

### Material-specific corrections (2026-07-05 review — do not relitigate)

- **Skymetal / meteoric iron = raw dark iron.** Describe the MATERIAL only: raw,
  dark, cold, dense, unpolished grey-black iron on a plain leather-bound grip.
  Avoid the high-fantasy elements — NO glow, NO star-flecks, NO crystalline/gemlike
  blades, NO teal/blue energy veins, NO ornate gilded hilts. BUT do NOT stack
  negations like "mundane, not magical, primitive iron unknown to a bronze-age
  world" into the prompt — that desaturates the render, kills the cool rim-light,
  and breaks continuity with the rest of the set. Just name the material and let
  the standard v2 lighting/grading light it exactly like every other item.
- **Base items stay generic and clean (2026-07-07).** Do NOT put invented lore
  symbols, horned suns, deity marks, faction emblems, seal faces, friezes, or
  heavy patina into ordinary base-item DESCs. Think thrice before adding any
  symbol at all. Use shape, silhouette, construction, and material as the base
  identity. Extreme wear, verdigris, grime, and overt symbolic flair are for
  uniques/awakened relics only, or for an explicit reviewed exception.
- **No spiral motifs.** Spirals are overused. If a base needs ornament, prefer
  generic geometry: plain raised rims, concentric ridges, chevrons, punched
  dots/studs, or simple bands.
- **Primitive / low-tier items = ONE material, minimal parts.** This is the real
  rule (a bone club failed not because bone is bad, but because it was prompted as
  a wood-shaft + jawbone + lashings composite — illogical for a crude weapon, and
  the gen can't picture it). Bone BLADES are great: a sharpened bone/femur dagger
  reads perfectly. A bone club is just ONE massive bone — a heavy femur, the
  knobbed joint-end as the striking head, at most a leather strap for a grip,
  nothing else. Do not reinvent the wheel with unnecessary composites on low-tier
  items; simplicity IS the primitive read.
- Obsidian keeps its glassy black facets, but keep it clearly *stone*, not
  glowing crystal or gem-inlaid ceremony.

(v1 style below is retained for reference only; v2 above wins on any conflict.)

## Style prompt (prefix every item prompt with this)

Written to counteract GPT-image's habitual yellow/sepia wash: the palette is
anchored cold and neutral, warmth is confined to the material itself, and the
cast is banned explicitly.

> Dark low-fantasy bronze-age inventory item icon: {DESC}. Painterly digital
> oil style with neutral white balance and cold, desaturated grading — deep
> neutral blacks, slate-grey shadows, bone-white highlights. Warm tones appear
> only where the material itself is warm, never as an overall wash. Lit by
> cool diffuse overcast light with one restrained warm rim light from the
> side. No sepia tone, no yellow color cast, no amber haze, no vignette.
> Hand-made, period-appropriate craftsmanship. The item is made only of the
> materials named above — do not add extra fittings, bindings, metal parts,
> patina or gems beyond those named. No polished steel. Single
> object, centered, filling most of the frame while remaining entirely
> inside it — no part of the item cropped by the frame edges; long weapons
> may sit on a slight diagonal to fit their full length. Isolated on a pure
> solid #000000 black background. No text, no watermark, no frame.

(2026-07-03 batch note: the original prompt enumerated example materials —
"knapped stone, lashed cord, hammered metal, stitched hide" — and asked for
"muted copper-green accents" globally. GPT-image treated both as content
directives and grafted bronze fittings / patina / stray materials onto items
that never asked for them. Material mentions now live only in each DESC.)

## Historical ornamentation ladder (superseded for base items)

The notes below are retained as history. They overfit early concept art and
caused base generations to drift into fake lore symbols, heavy patina, and
grimy "Verdigris means every item is green" leakage. For base items, follow
the 2026-07-07 rule above instead: generic, clean, silhouette-first. Use this
ornament vocabulary only for uniques, awakened relics, faction sets, or rows
explicitly reviewed as lore-heavy.

The old wealth ladder is no longer valid for ordinary bases. Do not use the
old concept-sheet details as prompt content for base rows. The failure class
was broader than individual words: tiny accent materials, named dye colors,
ceremonial trims, symbolic motifs, and invented lore marks all make base items
look like uniques and poison later generation batches.

For base rows, tier should read through silhouette and construction:

- tier 1: crude, simple, functional.
- tier 2-3: cleaner construction, stronger shape, broader mass.
- tier 4: refined/exotic main material, but still generic.
- tier 5-6: rare material or advanced construction, still plain enough to be
  a base item.

Use gold, lapis, feathers, deity marks, patina, dyed leather, and elaborate
ceremonial trim only for uniques, awakened relics, faction sets, or an
explicitly reviewed exception.

If a result still trends warm, regenerate once with "make the white balance
noticeably cooler" appended; the local composer also has a `--wb` rescue flag.

## Rate discipline (2026-07-04 — we hit "too many requests")

Observed on ChatGPT Pro web image gen: ~24 images over the evening (peak
burst 20.5/hr), then 38 more the next morning at 20.4/hr sustained with a
33.6/hr peak stretch (28 images in 50 min). The throttle tripped at ~70
images in ~13h, mid-batch. Cooldown duration unknown (hours-scale).

Future sessions: pace generations at ONE EVERY 5-6 MINUTES (≤12/hr), take a
~15 min break every 10 images, keep a day's total under ~50, and interleave
local QA/matte/compose work between generations instead of batching gens back-to-back.
Front-load the highest-priority items in case the ceiling arrives early.

## Canvas orientation (start every prompt with this)

GPT-image defaults to square; match the canvas to the item's grid footprint
instead. Prepend ONE of these to the style prompt, per the table's `canvas`
column:

- **P** → `Vertical portrait canvas (2:3 aspect ratio).`
- **L** → `Horizontal landscape canvas (3:2 aspect ratio).`
- **S** → (nothing — square default is correct)

Rule of thumb: weapons/armor/shields portrait, belt landscape, small wearables
(rings, amulets, helms, gloves, boots), trophies and tools square. The matte
must be requested at the same canvas ("same canvas size and framing").

## Mattes: local scripts, never generative

Primary route: ask ChatGPT for true transparent PNG output. If it returns real
alpha, do not run matte generation. `core/compose_assets.py` crops directly
from the source alpha, preserves RGBA output, and skips palette quantization.
This is the safe path for accepted manual image-2 downloads.

Source-image loadout extraction route: if ChatGPT will not provide real alpha,
generate on a flat olive-slate matte (`#737A68`) and run
`python3 core/chroma_key.py SOURCE_DIR --out CLEAN_DIR`. This removes the
sampled background color everywhere, including ring holes, chain gaps, and
other interior openings. It also decontaminates antialiased edges. Promote the
cleaned RGBA file under the chosen asset id and let `compose_assets.py` use the
true-alpha path. A small neutral edge residue is acceptable if it reads as
cloth fuzz or dirt; hot magenta fringe is not acceptable.

`core/art_matte.py` is for flat-background fallback art. If it is accidentally
run on a true-alpha PNG, it now writes the source alpha silhouette directly
without hole filling, component pruning, or other reinterpretation.

Fallback route: if the image has a flat mid-grey, blue-grey, or old black
background, run `python3 core/art_matte.py assets_staging ART_ID`. The script
samples the background from the corners, flood-fills reachable background, keeps
the largest subject component, and fills interior holes unless the form is a
ring, sling, gorget, or curio.

`gen_masks.py`, `cleanup_masks.py`, and `fix_masks.py` are retained only for
old-mask archaeology. Do not use Gemini or other generative matte services for
new assets.

## Historical seed list (superseded)

This section is the old starter list. It is useful as archaeology, but the
actual production scale is now `core/GENERATION-PLAN.md`: 500-600 usable
inventory images, with a planned overshoot manifest of about 640 rows.

## Forms × signature materials (one image per row, ~30 items)

| file | canvas | prompt DESC |
|---|---|---|
| handaxe_flint | P | a knapped flint handaxe lashed to a short wooden haft with sinew, held vertical |
| handaxe_bronze | P | a cast bronze handaxe with a leather-wrapped haft, held vertical |
| spear_flint | P | a flint-tipped hunting spear on a long ash shaft, sinew lashing, vertical, filling the full height |
| spear_bronze | P | a leaf-bladed bronze spear, vertical, filling the full height |
| spear_skymetal | P | a spear with a raw dark meteoric-iron head, vertical, filling the full height |
| macuahuitl_obsidian | P | a macuahuitl: flat hardwood club edged with rows of black obsidian blades, held vertical |
| atlatl_bone | P | a carved bone atlatl dart-thrower with a plain dart, vertical |
| khopesh_copper | P | a copper sickle-sword khopesh with a clean broad hooked blade, held vertical |
| khopesh_bronze | P | a bronze khopesh with a notch-worn blade, held vertical |
| sling_hide | P | a braided hide sling with a smooth river stone in the pouch, straps hanging vertical |
| shield_hide | P | a tall oval shield of stretched hide over a wooden frame, plain front |
| shield_bronze | P | a tall shield faced with hammered bronze, central boss |
| shield_bronzesheet | P | a tall shield faced with clean sheet bronze over a hide backing |
| wrap_hide | P | a wrapped hide tunic with a simple garment shape |
| wrap_quilted | P | a quilted linen armor vest of layered stitched cloth, undyed off-white, cord tie at the shoulder |
| wrap_bronzescale | P | a vest of overlapping bronze scales sewn onto leather backing |
| wrap_bronzesheet | P | a simple sheet-bronze corslet with front and back plates |
| crest_bone | S | a simple bone headpiece with a raised crest |
| crest_bronze | S | a hammered bronze cap with cheek guards |
| crest_jade | S | a jade circlet-diadem with a clean curved profile |
| grips_hide | S | a pair of hide handwraps with knuckle cords |
| sandals_hide | S | a pair of strapped hide sandals, clean and lightly used |
| girdle_hide | L | a wide woven-hide girdle belt laid out horizontally |
| gorget_jade | S | a carved jade gorget pendant on a knotted cord |
| gorget_amber | S | a raw amber pendant on sinew cord |
| ring_bone | S | a ring carved from a single piece of bone |
| ring_copper | S | a simple coiled copper ring with clean hammered metal |
| curio_bone | S | a small carved bone bird curio with a clean simple shape |

## Trophies (5)

boar_tusk (large tusk trophy setting), wolf_fang (large fang trophy setting),
river_pearl (large baroque pearl in a carved shell setting), ember_shell
(glowing red-veined beetle carapace), knucklebone (polished ancestor
knucklebone with plain carved marks).

## Legacy craft tools (frozen)

These rows exist as early gameplay/UI archaeology only. Do not expand,
regenerate, or use them as examples for future prompt candidates unless Alexei
explicitly reopens the currency/crafting-material lane.

Pigments: red_ochre, woad, soot, marsh_ochre. Omens: entrail_omen,
bird_omen, smoke_omen, blood_omen.

## UI (reuse existing)

Keep `frame_ornate`, `divider`, `slot_texture` from the current asset set —
they already read bronze-age enough. Optionally regenerate the frame later
as hammered bronze rather than gold filigree.

## Workflow (Cowork / ChatGPT web app + local scripts)

1. For each row: generate the art in ChatGPT (canvas prefix + style prompt +
   DESC), judge it against the reject checklist, download as
   `<repo>/tools/rpg_inventory/assets_staging/{file}.png`.
2. Run `python3 core/qa_gate.py assets_staging/{file}.png CANVAS`, then eyeball
   the render against the checklist.
3. If the staged PNG has true alpha, skip `art_matte.py`.
4. If it is a source-image loadout batch on slate matte, preserve the original
   and run `python3 core/chroma_key.py SOURCE_DIR --out CLEAN_DIR`; promote the
   cleaned RGBA under the chosen `ART_ID`.
5. If the staged PNG has a flat fallback background for an ordinary single
   item, run
   `python3 core/art_matte.py assets_staging {file}`.
6. Every ~6 items run `python compose_assets.py` from
   `tools\rpg_inventory\core\` (add `--wb` if the chunk trends yellow). This
   directly crops true-alpha RGBA inputs, or composites flat-background inputs
   with masks into `assets/`.
7. Verify in the browser (`tools/rpg_inventory/index.html`): item art
   replaces the SVG fallback automatically.

## Reject-and-redo checklist per image

- Background is true alpha, or a flat uniform mid-grey/blue-grey/black field;
  single object, no text/watermark/frame.
- **No yellow/sepia wash** — whites read bone-white, shadows read grey-black.
- Silhouette reads clearly at 48px (squint test).
- Spears, pikes, staffs, standards, and polearms are full length tip-to-butt;
  the shaft remains the dominant element and is not collapsed into a short prop.
- Matte matches framing; holes (shield grips, cord loops) are black.
- Wearable/carryable objects explain how they are worn, held, slung, or
  attached through visible structure.
- Relic gear is a substantial implement, not a flat tablet, plaque, board, or
  slab.

## 2026-07-04 review priors (from full manual review)

Mattes are now generated locally from the art's black background
(`core/art_matte.py`) — no generative matte. The remaining failures are ART
failures. Bake these into every prompt:

1. **Correct real-world proportions; never zoom the "interesting" part.**
   GPT-image enlarges the ornate bit and shrinks the rest. Polearms/spears
   must show a SMALL head on a VERY LONG thin shaft (shaft >= 5x head length,
   shaft is the dominant element), the whole weapon a thin diagonal line
   corner to corner. Necklaces/gorgets must hang on a cord long enough to form
   a full wearable neck-loop (cord several times longer than the pendant).
2. **Simple, legible single objects.** Avoid multi-part composites and loose
   props (spare darts, "resting on a feather", paired tools). One object.
3. **Avoid AI-fragile shapes entirely.** Atlatls/spear-throwers, bows, and
   loose slings render as malformed blobs — retire them rather than burn
   tokens. Prefer weapons/armour with a bold, unambiguous silhouette.
4. **Weapons should look deadly and balanced** — bold blade mass, sensible
   hilt/haft proportion; a weapon that looks flimsy or awkward is a reject.
5. Hand armour: render as upright **forearm bracers/vambraces** (reliable),
   not laid-flat fingerless wraps (read as foot-shaped garbage).
6. Prompt-candidate batches must be slot-diverse. Do not sample only weapons,
   and especially do not let axes/daggers dominate a batch. Currency/crafting
   materials are frozen, not a source of new prompt ideas.

Retired this pass: `atlatl_*` (kept old art as placeholder, flagged for
removal). Reworked: `spear_*`, `khopesh_*`, `gorget_*`, `grips_*` (-> bracers),
`sling_*` (one attempt then cut if still unusable), `curio_jade` (simplified).
