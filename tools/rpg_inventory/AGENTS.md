# AGENTS.md — RPG Inventory (Verdigris) asset work

Standing instructions and hard-won preferences for any agent working on this
folder. **Read this first.** Alexei has repeated this guidance across sessions —
do not make him say it again. When he gives new feedback, ADD IT HERE.

## ⚑ Goal harness (2026-07-05) — the self-serve loop

- `core/GOAL.md` — mission, definition of done, budget math, priorities.
- `core/GENERATION-PLAN.md` — the durable 500-600 image target. Do not
  collapse the project back to the current ~90-row starter manifest.
- `core/REFERENCE-NOTES.md` — PoE/Diablo structure and visual notes that
  justify the larger base-item plan.
- `core/LOADOUT-EXTRACTION.md` — Alexei's 2026-07-07 breakthrough for using a
  full character/source image as a coherent equipment system, then extracting
  separate paperdoll-slot item icons with true alpha.
- `python3 core/status.py` — coverage vs `core/targets.tsv`, today's gen
  count, prioritized queue; `--prompt ART_ID` prints the full assembled
  generation prompt for any item.
- `core/RUNBOOK.md` — the mechanical per-item loop (gen recipe → qa_gate →
  matte → compose → log) + the failure-mode catalog.
- `python3 core/qa_gate.py assets_staging/X.png CANVAS` — numeric reject
  gate; then eyeball the checklist it prints.
- `core/PROMPT.txt` — THE style prompt, hand-tuned by Alexei. Agents must
  NEVER edit this file; status.py assembles canvas + PROMPT.txt + DESC.
- `python3 core/strike.py add|clear NAME [chat_path] [note]` — DURABLE
  failure ledger (STRIKES.tsv). Record EVERY failure through this, in the
  same run it happens; status.py surfaces strike-1 chats as HARVEST-first
  and hides 2-strike items entirely. This — not GEN-LOG prose — is the
  duplicate-prevention mechanism. Never re-send an item whose strike-1
  chat hasn't been harvest-checked.

Any session (Fable, Claude Code, Codex): start with `status.py`, work the
queue top-down, stay under budget, log to `GEN-LOG.md`, stop cleanly.

## How Alexei wants us to work (meta — this matters most)

1. **Move forward, don't loop.** Prioritize generating NEW items / filling
   coverage over re-rolling existing assets. Do NOT remake gens to chase
   perfection. Only regenerate an asset if it is genuinely broken/unusable
   (e.g. wrong subject, backless helmet, missing half the object). "Good and
   done" beats "perfect and slow."
2. **Do not waste ChatGPT image quota.** Gens are rate-limited and slow
   (~3–4 min each, throttles after a batch). Be deliberate: get the prompt
   right, generate once, accept if it clears QA. **NEVER re-roll the same
   concept on failure** (2026-07-06, cost ~6 wasted gens on one item): one
   attempt per item per run, NO same-run redos; a failed item goes back to
   the queue with a note, a second failure moves it to `core/BLOCKED.txt`
   for Alexei to rework the DESC. A "hung" gen usually completes later in
   its chat — HARVEST it next run instead of re-sending.
2b. **TRUE ALPHA when real; slate matte when not** (2026-07-06/07): real alpha
   PNGs are ideal and must bypass matte generation entirely. ChatGPT/image-2
   batch output is not reliable for true alpha, so source-image loadout
   extraction uses a flat olive-slate matte (`#737A68`) and local
   `core/chroma_key.py` cleanup. Reject painted checkerboards and hot magenta
   fringe. Never flatten RGBA to RGB when inspecting.
3. **QA every generation on the fly.** Before staging, look at the render and
   check it against what the item is supposed to be: complete solid object?
   correct 3/4 dynamic angle? fills the frame, not squished/tiny? a PAIR if it's
   footwear/handwear/greaves? reads as a cool game asset, not a museum photo?
   If it fails, that's the moment to catch it — don't stage duds and don't make
   the user find them later.
4. **We are not married to specific items.** If the AI can't render something
   reliably (atlatls/spear-throwers, bows, loose slings, fingerless hand-wraps),
   drop or reconceive it (e.g. grips → bracers) rather than burning tokens.
5. **Style/tone:** concise and direct; do the work; don't over-ask or over-
   explain; don't grovel.

## Inventory UI direction (2026-07-12)

- Secondary storage and equipment are six independent collapsible side windows,
  never one combined drawer. Each available window has its own small `<<` tab
  beside the main-hand/hands edge; unavailable tabs stay absent because their
  skill-tree unlock has not been allocated.
- The three hybrid axes each unlock one 4x4 specialty pack: STR+DEX, DEX+INT,
  and INT+STR. The three pure axes each unlock one 2x2 auxiliary equipment seat.
- Canonical mapping: Champion/STR = War-call; Acrobat/DEX = Quick Rig;
  Archmage/INT = Attendant focus; Reaver/STR+DEX = Spoils Roll;
  Nightblade/DEX+INT = Preparation Case; Ritualist/INT+STR = Reliquary.
- Attendant foci may be overtly magical, including semi-floating or orbiting
  orbs, glow, levitation, and impossible suspension. Currency/reagent prompt
  cautions do not restrict this equipment category.
- Keep the core paperdoll and 12x6 backpack visible. Do not restore the redundant
  Inventory banner, stacked specialty packs, or a desktop top action bar.

## Art direction

The authoritative prompt spec lives in `core/ASSET-BRIEF.md` under
**"⚑ AUTHORITATIVE STYLE (v2)"**. Key rules, in one breath: dynamic 3/4 hero
angle (never flat front/side — this also gives helmets a visible back/dome);
complete solid object seen in the round; fill the frame with the right canvas
aspect (portrait for weapons/tall armour, landscape for belts — GPT defaults to
square and squishes long/wide items); pairs rendered as a pair; dramatic
high-contrast directional lighting; flat uniform MID-GREY background
(BLUE-GREY for grey-metal/flint items) with **no cast shadow / no ground
plane** — the local matte keys it adaptively (older black-bg art still works);
cold neutral grading, no yellow/sepia wash;
inspiration = Path of Exile / Diablo 2 item icons.

Known open nits: GPT sometimes still bakes a faint drop-shadow into the render
despite "no cast shadow" — the local matte then keeps it. If it's bad, trim in
post rather than regenerating.

Material rules (2026-07-05, see ASSET-BRIEF §Material-specific corrections):
**Skymetal = raw dark iron** — no glow / star-flecks / crystal blades / teal
energy / gilded hilts; but describe the MATERIAL only — do NOT add "mundane / not
magical / primitive iron" negations (they desaturate the render and kill the
rim-light continuity). Let the standard v2 lighting apply. **Primitive/low-tier items = ONE
material, minimal parts** — bone daggers (sharpened bone blade) are great; a bone
club is just a femur (+ maybe a leather strap), NOT a wood+jawbone composite.
Simplicity is the primitive read; don't over-compose low-tier items.
**Base items stay generic and clean** (2026-07-07): do not put invented lore
symbols, horned suns, deity marks, faction emblems, seal faces, friezes, or
heavy patina into ordinary base-item DESCs. Think thrice before adding any
symbol at all. Use shape, silhouette, construction, and material as the base
identity. Extreme wear, verdigris, grime, and overt symbolic flair are for
uniques/awakened relics only, or for an explicit reviewed exception.
**No spiral motifs anywhere** (overused). If a base needs ornament, prefer
generic geometry: plain raised rims, concentric ridges, chevrons, punched
dots/studs, or simple bands.
**Don't prompt closures/fastenings** (2026-07-07): toggles, buckles, clasps
are shapes image-2 struggles with — never call them out in a DESC; let the
model render fastening its own way. (When it improvises, it does fine — the
antler toggles on the early belts came out well UNPROMPTED-level quality,
but explicitly demanding them invites mangled hardware.) Describe the body
of the item and its materials; leave closures unstated.
**Source-image loadout extraction** (2026-07-07, Alexei): a strong full
character/loadout image can be a better item source than isolated DESCs. It
gives image-2 a coherent equipment system, so feathers, tassels, shell plates,
scratches, cords, chains, veils, stones, coins, and symbols can work when they
are physically integrated into the object. The bad pattern is not "detail"; it
is ungrounded detail pasted onto an item prompt in a vacuum. Use
`core/LOADOUT-EXTRACTION.md` for that workflow. For current ChatGPT batches,
use the slate matte prompt and `core/chroma_key.py`; magenta backgrounds leave
unacceptable halos. Long weapons in this mode need explicit full-length
framing: tip-to-butt, shaft-dominant, steep diagonal corner-to-corner. Reject
polearms shortened into clubs, wands, or mace-length props.
**Character/source prompts must be self-contained** (2026-07-07): never rely on
chat history or faction names as shorthand. The image model does not know what
"Jungle Empire" or "Seven Kingdoms" means in Verdigris. Every final prompt must
expand the faction design language, class/stat gear grammar, tier language,
rendering style, spacing/composition rules, and weapon constraints inline. Do
not optimize final prompts for brevity, and do not assume lore familiarity
with our internal factions. Use scratchpads or script-built blocks if needed;
the final prompt should be long, explicit, and redundant enough that it works
when pasted into a fresh image model session with no prior context.
**Do not save Alexei's proprietary legacy character prompts in the public repo.**
Only save distilled, generic process rules and non-proprietary prompt structure.
**Slot hygiene / anti-costume clutter** (2026-07-08): rings are compact finger
objects, not dangling charm jewelry. Amulets are pendant-first objects on
cord/twine/leather/simple chain, not gorgets or collars. Body armor should not
include attached collars, turtlenecks, belts, skirts, faulds, or tassets. Belts
are horizontal waist items. Shields show the front fighting face only, with no
front straps, clamshells, dangling hardware, or utility rigging. Avoid invasive
charms, chimes, tassels, tiny hanging rings, delicate costume chains, solar
symbols, eight-spoked wheels, and repeated human-face motifs unless explicitly
reviewed. Sets should be coordinated, not motif-cloned across every slot.
In source-image itemization, also block "overmatched" sets: do not let every
item repeat the same central round stone, blue gem, boss, eye, sun mark,
medallion, or emblem. A set may share materials and construction language, but
only one or two items should carry a strong focal motif; the rest should vary by
shape, edge treatment, construction, weave, grip, plate layout, or fasteners.
If ChatGPT collapses a multi-slot extraction into a single contact sheet, reject
it. The first line of a multi-image prompt must state the exact count, e.g.
`Generate 10 images. No commentary.` Do not write vague openers such as
an image request with no number. The prompt must say separate independent image
files, never a sheet; if the model cannot produce separate files, it should
generate only slot 1 instead of putting multiple items into one image.
**Character calibration feedback** (2026-07-09): separate-image sets usually
beat dense collages for source-character calibration. Collages are acceptable
for quick lineup sheets, but item-source prompts should default to separate
images when possible. Faction blocks must describe body/silhouette archetype,
not just palette: one faction may be taller and treasure-burdened, another
compact and athletic, another lean and austere, another broad and shawled.
Include a restrained virtue/vice tension when it helps the gear read. Do not
write elemental labels such as air/fire/earth/ice into final prompts; those are
private planning associations and poison the output. Steppe-sand prompts should
include desert scarf, robe, sash, and travel-cloak clothing cues so they do not
collapse into only Mongolian lamellar. Red mesa/rainforest prompts can lean more
fantasy Aztec at higher tier, with Salish/Karui-like massing used carefully as
supporting wood, shell, shield, and greenstone language rather than copied
ceremony. Nile-ziggurat Intelligence-axis high tiers can show greed and earthly
weight through bronze/brass mass, one bounded true-lapis textile field, and a
few bright gold highlights; its Strength and Dexterity ladders use different
accent families. The northern
starter faction is the **Northern Bronze Houses**, not a marsh/taiga biome.
Marsh, taiga, bog, peat, wet-weather, dark-wool, and bog-iron language made its
characters muddy, grey-brown, and low-value, so none of those cues belong in
new northern prompt blocks. Use clean northern Bronze Age craft instead: pale
hemmed wool and linen, spatially separate madder-crimson, spruce-green, and
golden-ochre woven borders, bright polished bronze, pale birch or ash wood,
polished horn, restrained russet hide, tailored
shawls, and rectangular mantles. Amber is a restrained jewelry or single-focus
material, not a centerpiece repeated across every slot. Tier tests must make
belts, amulets, foci, hands, feet, and cloaks progress too; do not only upgrade
body armor. Mage/focus tests must assign distinct offhand object families and
avoid every faction getting a mirror.
**Starter faction ladder production unit** (2026-07-09): use four prompts,
one per faction. Each prompt begins `Generate 9 images. No commentary.` and
produces nine separate files in a 3-attribute-axis by 3-tier matrix: Strength
T1-T3, Dexterity T1-T3, Intelligence T1-T3. Final character prompts must refer
to these attribute axes, never name fixed fantasy classes. An axis describes
how equipment solves problems; it does not choose the character's profession.
Every file contains one male/female pair sharing the same unisex bases and
coverage. Use the same recognizable pair through one axis's three tiers, then a
different pair for the next axis. Do not invent a tenth image, and never
collapse the request into a collage or contact sheet. The private builder is
`character_pipeline_local/build_faction_ladder_prompt.py`.
**Tier contrast correction** (2026-07-09): character ladders must not preserve
one outfit and merely polish or recolor it. Between adjacent tiers, change at
least five macro decisions among torso construction, headgear, weapon/offhand,
outer-layer cut, belt structure, hands, and footwear. Tier 3 must add visibly
more sophisticated segmentation, layering, edge work, woven patterning, and
integrated construction detail. It also uses a richer faction-specific palette
and brighter material highlights than Tier 2. More detail means workmanship,
not dangling clutter, repeated gems, medallions, or symbols.
**Material-local color, not faction livery** (2026-07-09): a faction palette
must not become one dominant dye across every character or every slot. Bronze,
copper, leather, wood, shell, obsidian, linen, and stone retain their own local
colors. Excluding skin and background, no dyed hue should cover more than
roughly one-third of a loadout. Use at least four separated color-material zones
and assign different color hierarchies to Strength, Dexterity, and Intelligence
within each faction. Do not match helmet, chest, mantle, belt, gloves, boots,
shield, and weapon to the same hue.
**Neutral source-character color environment** (2026-07-09): character ladder
and source-character prompts use a flat pure neutral-white background, a
neutral-white key, a neutral-white rim, and strictly neutral studio/daylight
white balance. Do not use a blue-gray backdrop, cool rim, neutral-to-cool
grading, or global desaturation for source characters; those cues contaminate
every material with the same slate cast. Tier 1 communicates low cost through
fewer components, simple seams, cheap materials, repairs, and incomplete
matching, not faded color. Tier 2 adds larger clear dyed fields. Tier 3 adds the
most vivid bounded dyes, brightest polish, and strongest pale/dark separation.
Blue is not a shared faction signal: Northern, Cedar, and Silkroad production
palettes avoid blue-family palette drivers. Only Nile Intelligence may use one
bounded, saturated true-lapis ultramarine field. This exception applies to
source-character generation; isolated item matte and extraction rules remain
as specified by their own prompt blocks.

## Pipeline facts (so you don't rediscover them)

- **Masks/alpha are generated LOCALLY** from flat backgrounds via
  `core/art_matte.py` — NOT a generative matte. Gemini/GPT mattes leave holes;
  don't use them. `art_matte.py` params: low FLOOD threshold keeps dark subject
  detail; a pure-black-fraction test re-opens only genuine see-through holes
  (ring centres, sling gaps) while keeping dark concave surfaces solid.
- **Source-image loadout extraction uses `core/chroma_key.py`** for flat
  olive-slate (`#737A68`) batch output. It removes the matte color everywhere,
  including interior jewelry/chain holes, and decontaminates antialiased edges.
  This is intentionally separate from `art_matte.py`, which fills most holes
  for ordinary item icons.
- **Compose:** `cd core && python3 compose_assets.py [NAME ...]` -> autocropped
  finals in `assets/{formId}_{materialId}.png` (tools as `assets/{toolId}.png`).
- **ChatGPT web gen recipe (works, screenshot-free):** new tab → navigate
  `https://chatgpt.com/` → JS inject prompt into `div.ProseMirror` via
  `execCommand('insertText')` + dispatch input → click `[data-testid=send-button]`
  → poll for an `<img>` ≥512px (60–120s+) → JS `<a download>` from `img.src` →
  it lands in `~/Downloads` (mounted) as a UUID .png → `cp` newest to
  `assets_staging/{name}.png`. Prompt must start with `Generate an image, no
  commentary. ` and ASCII only (no em-dashes). Plain chat works (no project
  needed).
- **Downloads must be a connected folder** for the sandbox to read gen output.
- **Commit hygiene:** source generations in `assets_staging/*.png` are local
  working files and ignored. Commit the composed finals in `assets/` plus the
  reusable docs/scripts only. Do not commit `.DS_Store`, `__pycache__`,
  `.gen-lock`, or one-off handoff/commit helper debris.

## Base-item model (READ `core/BASE-DESIGN.md` — this is fundamental)

Do NOT model items as `form × material` grids — that forces nonsense combos
(quilted sandals, obsidian gorget) and quirky exotic-only "forms" (atlatl,
macuahuitl-as-the-only-club). Instead, like Path of Exile / Diablo 2, each
equipment **class** gets a **ladder of distinct, individually-named bases**, one
per **tier**, escalating crude→endgame. Material/theme is intrinsic to each named
rung, not an axis sprayed across everything. Our tech arc IS the tier ladder:
T1 scavenged (flint/bone/hide) → T2 copper → T3 bronze → T4 ritual/exotic
(obsidian/jade/amber) → T5 otherworldly (skymetal; mail paused). Exotic
items are high rungs, not whole classes. Give evocative names (Bronze Khopesh,
Obsidian Macuahuitl, Skymetal Greathelm), never IDs like `grips_quilted`. Full
proposed ladders live in `core/BASE-DESIGN.md`.

## Item roster decisions

- Forms live in `core/verdigris-pack.js` (`forms:` block); art spec in
  `core/verdigris-manifest.tsv` (name / canvas P·L·S / DESC).
- Retired: `atlatl_*` (AI-hard). Reconceived: `grips_*` = forearm bracers.
- New bases added 2026-07-04: `dagger`, `warclub`, `greataxe`, `buckler`,
  `helm`, `greaves` — flagship **bronze** art done; other material variants
  still needed.
- Review dashboard: open `review.html` in a browser to flag items, rework
  prompts, or mark bad ideas as discard. Durable feedback lives in
  `core/asset-review.js`; `core/status.py` hides discarded items and queues
  rework items. Discard means retire/drop the idea, not "try again later."
  If a discarded idea is a runtime item, also add its form to
  `retiredForms` or its exact `form_material` id to `retiredArtIds` in
  `core/verdigris-pack.js` so the game cannot roll it again.

## Prompt ideation guardrails

When asked for roastable prompt candidates, apply the pipeline rules in
`core/GENERATION-PLAN.md`, not just chat memory:

- Check `core/DOWNLOAD-INTAKE.md` before proposing candidates. Do not re-prompt
  silhouettes from a recent manual download burst until those images are
  reviewed, staged, or discarded.
- The DEX+INT Preparation Case reopens concrete reagent art: identifiable
  herbs, roots, resins, venoms, pigments, measured powders, ampoules, tools,
  charts, and trap components are valid. Still avoid abstract crafting
  currencies, omen symbols, ingots, molds, seal weights, interchangeable
  glowing reagent stones, and abstract bench tokens. Magical orbiting orbs are
  valid Attendant equipment, not currency.
- Default 12-candidate batches cap weapons at two and must include armour or
  helmets, shields/off-hands, limb or waist wearables, jewellery, and
  rite/relic/curio/trophy objects. Smaller batches keep weapons below 25%.
- Do not let axes/daggers become the default sample set. If weapons appear,
  vary class and construction, then move back to non-weapon slots.
- Relic gear candidates should be concrete ritual implements, not vague magic
  trinkets: double-ended pronged sceptres, heavy hand bells, handled tablets,
  forked standards, offering bowls, idol-head cudgels, reliquary boxes. Use
  vajra/dorje-like forms as structural inspiration, not direct sacred-symbol
  copies or literal default names.
- Screen prompt candidates for weak/toy-like base reads. Avoid wicker shields,
  rite batons, pencil-thin wands, hand stones, tiny darts, shrine miniatures,
  reed baskets or maps, road charms, loose feather markers, and generic small
  foci. If the item would read as a prop or joke loot before the tooltip
  explains it, replace it with a heavier credible base.
