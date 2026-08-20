# AGENTS.md — RPG Inventory (Verdigris) asset work

Standing instructions and hard-won preferences for any agent working on this
folder. **Read this first.** Alexei has repeated this guidance across sessions —
do not make him say it again. When he gives new feedback, ADD IT HERE.

## ⚑ Goal harness (2026-07-05) — the self-serve loop

- `core/GOAL.md` — mission, definition of done, budget math, priorities.
- `core/EXPANSION-CORRECTIONS-2026-07-24.md` — mandatory preflight for the
  current 300-item expansion. It consolidates the user corrections that must
  not be rediscovered through failed generations.
- `core/SESSION-HANDOFF-2026-07-24.md` - current strict count, ready-but-unrun
  Wave 05 manifest, and holds/rejects that must not be researched again.
- `core/CURRENT-ASSET-COVERAGE-2026-07-27.md` - conservative classification of
  current raw, salvage-pending, accepted, and prompt-ready supply. Use it before
  choosing another prompt family; raw image counts are not roster coverage.
- `core/GENERATION-PLAN.md` — the durable 500-600 image target. Do not
  collapse the project back to the current ~90-row starter manifest.
- `core/REFERENCE-NOTES.md` — PoE/Diablo structure and visual notes that
  justify the larger base-item plan.
- `core/LOADOUT-EXTRACTION.md` — Alexei's 2026-07-07 breakthrough for using a
  full character/source image as a coherent equipment system, then extracting
  separate paperdoll-slot item icons with true alpha.
- `core/MIXED-REFERENCE-BOARD-POLICY.md` - mandatory composition and authority
  contract for faction boards used as Image C beside the two ladder references.
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

For the 300-item expansion requested 2026-07-24, six parallel agents are an
empirically proven generation setup and may exceed the older 60/day planning
estimate when the account remains healthy. Keep one attempt per concept,
preserve the strike ledger, and back off immediately on rate-limit signals.
This parallelism is for locked image-generation calls only. Source research is
serial or uses at most two bounded agents, and stops as soon as a complete wave
is ready; do not burn Codex weekly quota on recursive multi-agent audit trees.

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
   drop or reconceive it rather than burning tokens. For the hands slot, try
   closed mitts, mitten-gauntlets, hand pouches, or short cuffs before falling
   back to another bracer.
5. **Style/tone:** concise and direct; do the work; don't over-ask or over-
   explain; don't grovel.
6. **Finish routine repo work yourself.** When an in-scope change requires a
   builder, formatter, test, QA command, or generated-artifact refresh, run it
   before handing off. Report the completed result; do not give Alexei a command
   as a next step when the agent can safely execute it. Include commands only as
   optional reference or when execution is genuinely blocked. Whenever the final
   response includes a build or verification command, explicitly label whether
   the agent already ran it and report its success or failure; never present an
   already-run command as an unlabeled instruction for Alexei to execute.
7. **Default roster generation unit = coherent loadout extraction**
   (2026-07-27 correction). For manual ChatGPT web production, start from two
   reviewed character/loadout references at one faction + attribute axis + tier
   and request up to ten separate paperdoll-slot item images. The references
   decide item families, silhouettes, materials, joins, ornament density, and
   what belongs together. Coverage analysis chooses which ladder points to run;
   it does not authorize predesigning isolated items from prose. Attach exactly
   one matching 2:3 portrait visual faction moodboard as Image C under
   `core/MIXED-REFERENCE-BOARD-POLICY.md`. It must be an organic, visual-first
   collage of approved ladder anchors and bright curated equipped/loadout,
   family-range, reconstruction, and ARPG-readable references. Ordinary staged
   item studies are banned unless Alex explicitly approves the exact asset.
   Alex's pasted examples normally define the **kind** of vivid Pinterest-like
   reference to research; they are not a preapproved image library to recycle.
   Curated sources are faction-locked before layout: Mycenaean/Aegean and
   Nordic Bronze belong to North; Scythian/Saka belongs to Dustwind;
   Mesoamerican plus cedar/hide Tlingit/Haida construction belongs to
   Stonewood; Predynastic/ancient Egyptian plus Sumerian/Akkadian belongs to
   Riverspill. Never move a source merely because it looks generically ancient.
   In particular, no Mycenaean source in Dustwind and no Tibetan/Himalayan
   dorje, vajra, or ritual-axe form in Riverspill.
   It is never a material shopping list and never outranks Images A/B.
   Skip weak or unsupported slots rather than inventing filler.
   Individually source-audited prompts are
   exceptional gap-item tools after loadout extraction and curation, not the
   default way to fill the roster. Current manual pack:
   `assets_staging/manual-web-wildcard-wave-01/`.

## Inventory UI direction (2026-07-12)

- New base ladders follow `core/INVENTORY-FOOTPRINTS.md`. This is a true
  Diablo 2 / Path of Exile style grid economy: belts are 2x1, body armour is
  normally 2x3, and heavy two-hand weapons are 2x4. Larger/heavier silhouettes
  occupy more cells; target metadata, runtime forms, art canvas, and QA must
  agree.

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
- The six-lane research vocabulary is authoritative in
  `core/ANCIENT-EQUIPMENT-TAXONOMY.md`: WC (War-call), Q (Quick Rig), AT
  (Attendant), SP (Spoils), PR (Preparation), and RL (Reliquary). Rotate these
  family IDs across batches. Do not collapse War-call to horns, Quick Rig to
  quivers, Attendant to bare orbs, Preparation to potion bottles, or Reliquary
  to boxes/crystals. Spoils are the exception to the finished-item look: they
  are raw or minimally field-processed monster materials sold or consumed in
  crafting. Show practical washing, scraping, drying, salting, trimming, plain
  tying, or rough wrapping, but no polishing, gilding, gems, engraving, metal
  caps, display mounts, impossible horns, or finished trophy objects. Prefer
  the raw precursor of a conspicuous material in the source gear; rough uncut
  stone in natural matrix is valid when that stone is visibly used. For a beast
  source, use one dry, detached, species-specific horn, tooth, claw sheath,
  scale patch, carapace, quill, hide/pelt, or stinger supported by its body.
  Never use whole heads/limbs, gore, sticks, twigs, firewood, or generic stick
  bundles as Spoils. The
  six-image auxiliary pass
  may extrapolate same-culture objects from a source character's craft language;
  that permission does not extend to inventing missing core paperdoll gear.
- Quick Rigs are worn load-bearing gear on the back or flank. Their complete
  backboard/pack frame, shoulder harness, side straps, and secured contents stay
  readable in character art and isolated studies. They never occupy a hand or
  off-hand slot and never resemble purses, handbags, satchels, messenger bags,
  briefcases, suitcases, doctor bags, lunchboxes, clutches, handled boxes, or
  modern luggage.
- Build the targeted paste-ready six-image prompt with
  `character_pipeline_local/build_auxiliary_extraction_prompt.py --write`.
  Its six lane flags accept WC, Q, AT, SP, PR, and RL family IDs, allowing a
  batch to fill known taxonomy gaps rather than leaving all choices to the
  image model. The source prompt remains `core/LOADOUT-EXTRACTION.md`.
- The separator builder has two modes. Standard `--write` remains strictly
  source-observed. `--combined-auxiliary --write` builds a second prompt that
  mixes one auxiliary or unlockable study into a limited number of boards while
  retaining at least three observed equipment studies per combined board. Keep
  the combined prompt compact: its builder omits standard-only duplicate
  taxonomy/auxiliary/motif blocks and enforces a 23,500-character prompt ceiling.
  Add combined-mode rules to its compact block instead of repeating whole
  standard blocks.
- The unattended phone lineup prompt is block-built from
  `character_pipeline_local/SEVEN-TIER-LINEUP-PROMPT-BLOCKS.md` by
  `build_seven_tier_lineup_prompt.py --write`. It produces seven independent
  four-faction tier images with adult human-form units only. Preserve its silent
  28-unit coverage ledger: exactly one of the six unlockable lanes per unit,
  every lane used four or five times across low/mid/high tiers, four different
  lanes per image, and deliberate coverage of underrepresented core and wearable
  families. Examples are open construction banks, not fixed assignments; keep
  the self-generated wildcard seed and default-family budget so unattended runs
  do not converge on either fantasy defaults or one prompt-suggested novelty.
  Polearms are hard-forbidden in this phone lineup: no spear, pike, glaive,
  halberd, lance, trident, poleaxe, weapon staff, long-shafted axe/hammer,
  weapon-length standard, or near-substitute.
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
**Don't prompt tiny hard closures/fastenings** (2026-07-07; revised
2026-07-24): toggles, buckles, and clasps are shapes image models struggle
with, so do not add them as decorative detail. This does not permit impossible
seamless wearable rings. A cloth belt must visibly open and close with two
credible textile ends and one simple low-profile hand tie or knot. Do not give
a cheap cloth belt a bronze/brass clasp or buckle. Describe closures only at
this broad structural level; never demand tiny closure hardware.
**Material value must remain historically legible** (2026-07-24): in
pre-ancient economies, copper alloy is expensive status material, not generic
tier garnish. Reed, bast, common wood, plain hide, and ordinary cloth items
stay organic-led. Do not add bronze/brass collars, caps, plates, rivets,
fittings, or polished trim merely to signal a higher tier or faction palette.
Increase organic tiers through fit, weave, lacquer, lamination, join quality,
labor, and specialized silhouette. Use copper alloy only when the named
historical construction requires a small load-bearing fitting or when metal is
the explicit item thesis.
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
**Visual-source gate for expansion bases** (2026-07-24, Alexei): choose and
inspect the actual object image before writing the item brief. A generation
base must be either (a) visibly equipped or laid out in a reviewed character
or loadout reference, to be extracted faithfully, or (b) visibly documented
in a specific real artifact photograph, credible reconstruction, or reviewed
Pinterest lead paired with museum/catalogue evidence. The brief transcribes
the observed silhouette, materials, joins, closure, and proportions; it does
not synthesize a new object from faction palette plus prose. A URL, object
name, or historical plausibility claim without an inspected local image is
not enough. Pinterest research happens before gap-item design, not after a
speculative item has already been named. Faction and PoE references may control
finish, icon occupancy, and tier progression, but may not add materials or
construction absent from the primary object source. If the source does not
show enough construction to extract a credible item, choose another source.
The earlier permission to extrapolate same-culture auxiliary objects is paused
for the current 300-item expansion unless Alexei explicitly approves an
exception.
**Game-roster gate after source selection (2026-07-24, Alexei):** mock
characters are reference systems, not mandatory extraction checklists. Do not
generate every visible worn, held, or carried object. A source-observed object
must still deserve a game slot: strong ARPG inventory silhouette, clear
mechanical equipment/auxiliary identity, useful ladder progression, and
PoE/D2-like loot value. Leave incidental tools, costume clutter, narrative
props, weak one-off novelties, and redundant accessories in the character
image. Taxonomy coverage never overrides this quality gate.
**Invisible-support correction (2026-07-24):** when worn soft gear is isolated,
do not preserve anatomy-dependent shapes after removing the body. Long sandal
thongs, calf wraps, loose ties, belt ends, necklaces, and similar flexible
parts must hang, lie, coil, or bundle under gravity. Reject empty footwear whose
ties float upward in rigid spirals around invisible legs. Amulets show a full
wearable neck loop, or intentionally omit the cord entirely; never crop two
cord ends at the frame.
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
cord/twine/leather/simple chain, not gorgets or collars. In source-image
separation and extraction, body armor excludes detachable collars, gorgets,
neckwear, belts, sashes, and outer layers but includes the complete lower-body
assembly only to the extent it is clearly visible in the source: skirts, kilts,
robe hems, trousers/pants, leggings, faulds, tassets, cuisses, and greaves.
Most body-armor studies should not contain pants or leggings. Never invent an
underlayer, undersuit, trousers, or leggings to connect components, cover bare
space, or make armor look complete. Belts are true horizontal waist items only; never classify
lower garments or leg armor as belts. Source-separator and extraction belt
studies target a shallow 2:1 slot: visible silhouette at least twice as wide as
tall, laid straight or in a shallow arc. Remove, tuck, or omit long tassels,
fringe, sash tails, hanging cords, straps, pouches, apron panels, tassets, and
other vertical rigging. If a waist item cannot retain its identity as a clean
horizontal band, omit it; body armor stays ungirdled. Shields show the front fighting face only, with no
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
**Four-character separator pass** (2026-07-12): when a source generation
contains four characters in one composite, split it into exactly four separate
3:2 landscape reference boards before final slot extraction. Preserve source
order and character identity; never merge, average, duplicate, or exchange gear
between characters. Each board contains one full-body character plus exactly
four or five enlarged, non-overlapping, equippable item studies from that
character only. Preserve long cloak/robe/body-piece length and integral shoulder
armor. Keep separable belts, amulets, necklaces, gorgets, and outer layers out
of the body-armor study. The separated body armor must be explicitly ungirdled
and beltless, with all detachable waist, neck, and outer-layer gear removed even
when the full-body character wears it. If a plain belt, gorget, necklace, or
similar accessory is not worth one of the four or five studies, omit it; never
leave an unselected accessory overlaid on the armor. The body-armor study must
still include every source-visible skirt/pants/leggings, fauld, tasset,
cuisse, and greave as one empty assembly; absent or ambiguous pieces stay
absent. Pants and leggings are exceptional, never completeness filler. Those pieces are neither belt nor
footwear studies in this lane and must never become separate surrounding item
studies. Use a small-gap exploded gear arrangement, not an
invisible mannequin: torso above, lower garment below, and empty paired greaves
below/beside it. Body armor ends at the greaves/ankle and must never include
boots, shoes, sandals, soles, toe boxes, feet, or skin. Source-image footwear defaults to closed toe:
boots and shoes need a complete enclosed toe box, and open-toe sandals are valid
only when unmistakably present in the source. Ambiguous or obscured footwear
must not be reinvented as sandals. All footwear studies are empty pairs with no
feet, toes, skin, or flesh-colored filler. Claw weapons are main/off-hand weapons with grips or
fastening structures, never gloves or grafted anatomy. All surrounding item
studies use anatomy zero tolerance: no hands, fingers, arms, legs, knees,
ankles, feet, heels, toes, heads, faces, ears, hair, necks, skin, ghost limbs,
flesh-colored filler, or mannequin fragments. Helmet interiors use neutral dark
shadow rather than heads, ears, faces, or hair. Repeat the anatomy prohibition
near the start, inside body-armor/headgear/footwear rules, and in a final audit;
generic "no body parts" wording is insufficient. Explicitly repeat no toes,
feet, tummy/belly/abdomen/midriff, thighs, skin, ears, scalp, hair, braids, or
locs. Never extract a hairstyle as headgear. If anatomy cannot be removed from a
study, omit that study and choose another item. Source-separator boards use the same pure
neutral-white color environment as source characters; the later isolated-item
pass still uses the olive-slate matte. The local prompt source is
`character_pipeline_local/SEPARATOR-PROMPT-BLOCKS.md` and its builder.
**Separator-download sorting correction (2026-07-21):** a downloaded set of
four separated boards does NOT establish shared faction or attribute axis, and
its numbered output position does not identify a faction. The boards may share
only a rough power tier. Treat every separated board as an independent labeling
decision. Never propagate faction, STR/DEX/INT axis, or tier from one board to
its download siblings, and never auto-file from `(1)` through `(4)` filename
position. Preserve output position only as feedback metadata.
**Non-character separator output (2026-07-21):** some separator downloads are
constructs, apparatus studies, multi-character composites, or other unusable
non-character boards. The ladder review UI must provide an explicit persistent
ignore action. Ignored boards are removed from active faction/axis/tier folders,
kept recoverably under sorter state, and logged as feedback; never force them
into a character ladder merely to exhaust the intake queue.
**Ladder-review ergonomics (2026-07-21):** on desktop, keep the complete board
image and the faction/axis/tier plus Confirm/Ignore controls visible in the same
viewport. Use a left image canvas and a right decision rail, with independent
queue/control scrolling when needed; do not force repeated page scrolling
between visual evidence and the action buttons.
**Completed sorter feedback (2026-07-21):** the first 162-board review retained
126 character boards (92 exact assistant destinations, 34 corrected) and
ignored 36 non-character/unusable/duplicate boards. Before any faction/axis/tier
labeling, gate out beasts and harness systems, apparatus/constructs, spirits or
wraiths, empty animated armor, composites, mounted systems, and duplicate
boards. The dominant retained-character error was overcalling STR: 12 labels
moved STR -> DEX. Judge the whole equipment solution; axes, shields, spears,
sickles, packs, and other substantial gear can still be DEX when mobility,
precision, reach control, light layering, or carried utility dominates. Read
`character_pipeline_local/ladder_sorter/REVIEW-LEARNINGS.md` before classifying
the next intake batch.
**Four-character batch finalization (2026-07-21):** after Alex tagged the
creatures and bad crops, do not leave hundreds of ambiguous human characters
for manual review. For `4group_chars` specifically, the stated left-to-right
faction prior was correct on 31/32 reviewed characters; this does not override
the independent-label rule for ordinary separator downloads. Calibrate axis
from user-reviewed records only: an equal blend of equipment-semantic CLIP and
reviewed-image centroids matched 26/32 reviewed axes versus 18/32 for the old
proposal. The old board-level tier was stronger (28/32), so retain it unless
clear evidence says otherwise. Visually audit every proposed axis change,
especially bows/precision gear (DEX), heavy shield/impact kits (STR), and
staffs, lanterns, scales, censers, ritual tools, or study bundles (INT). The
final feedback-trained pass assigned the remaining 319 human characters and
reduced the manual queue to zero without changing prior user decisions.
**Hand-slot diversity** (2026-07-12, revised 2026-07-22): bracers are not the hands-slot default, and fingerless gloves read too modern for the pre-ancient
equipment library. Character ladders rotate source-visible mitts, enclosed
mitten-gauntlets, hand pouches, short wrist cuffs or bands, flexible wraps,
archer guards, bracers, and vambraces; across a nine-image faction ladder, at
most two images use true forearm bracers or vambraces, with at least one mitt or
mitten-gauntlet, short cuff/band, and wrap family. The separator preserves the
observed family: mitts and mitten-gauntlets retain their closed hand body,
cuffs stop near the wrist, wraps remain flexible, and only true bracers extend
substantially along the forearm. Never convert all handwear into bracers merely
because the model renders them easily. Empty extracted handwear is a complete
pair unless the source unmistakably uses one asymmetric item. Protection
crossing the wrist onto the backhand or palm should read as an enclosed mitt,
mitten-gauntlet, or hand cage; avoid visible individual finger stalls unless
the source explicitly requires them.
**Multi-reference item extraction corrections (2026-07-22):** greave/shin
deliverables must include the complete footwear read when they are the
legs/footwear slot: paired greaves attached to closed shoes, boots, sandals, or
visible sole structures, all empty and anatomy-free. Do not output greave shells
with no shoes/soles for this slot. Sword deliverables are bare weapons only; do
not include scabbards, sheaths, display cases, or paired sword-and-scabbard sets
unless the slot explicitly asks for a carry case. Cloaks and mantles need tall
vertical framing, ideally 2:3, so the full fall of cloth remains visible. Hands
and arms deliverables should default to mitts, enclosed mitten-gauntlets, hand
pouches, or backhand/palm cages; fingerless gloves, modern glove shapes, and
standalone forearm bracers/vambraces are overrepresented and should be rare.
DEX and stealth-leaning items should be cleaner, lower-snag construction: avoid
random danglies, charms, tassels, chimes, and loose cords unless the source item
visibly requires them.
Multi-reference item extraction canvas correction (2026-07-22): weapons should
be tall portrait inventory images, usually 2:3 and sometimes closer to 2:4 for
long weapons, with the full object on a steep controlled diagonal or vertical
three-quarter angle so handles, grips, shafts, bow cases, and cords are not
distorted. Never use horizontal/landscape weapon images. Only compact claw,
knuckle, or chakrum-style weapons may be square. Swords, daggers, axes, maces,
clubs, bows, slings, spears, ritual weapons, vajra/dorje-like forms, and
lajatang-like forms should be portrait. Armor should be square or portrait,
never horizontal; cloaks and mantles should be tall portrait, ideally 2:3. The
only normal horizontal item slot is a true girdle/belt. Wide weapon and armor
canvases should be rejected or regenerated.
**Quiver isolation correction (2026-07-22):** quiver, arrow-case, and gorytos
images must never include a bow. Bows are a major image-model failure mode and
combined bow/quiver prompts produce distorted limbs, strings, and handles.
Render the complete standalone container only with a capped mouth or empty dark
opening; no arrows, bow limb, bowstring, grip, combined archery set, or
bow-shaped accessory anywhere in the image. Arrows are separate inventory
items that occupy the quiver's extra storage, never part of the quiver art.
**Ancient footwear construction correction (2026-07-22):** integrated footwear
must not be completed as a modern stitched shoe. Prefer one-piece wrapped hide,
woven bast/fiber, felt, or simple thong-fastened sandal construction with a
thin flat hand-cut hide, fiber, or wood sole. Ban welted construction, molded
toe boxes, sneaker-like panel seams, stacked or rubber-like soles, dense regular
machine stitching, modern eyelets, and standardized modern left/right lasts.
The user-supplied footwear history sheet is a construction reference, not a
single-period authority. Treat its Stone Age wrapped hide, Bronze Age woven
yucca-fiber sandal, and basic palm-leaf slipper as positive silhouette evidence.
Explicitly exclude the Roman clog-sandal, Byzantine farmer shoe, and medieval
leather shoe from pre-ancient generations.
**Sling isolation correction (2026-07-22):** slings are a severe image-model
failure mode and require at least one dedicated real historical or ethnographic
object photograph as an image reference. Generate exactly one empty hand sling:
one woven/braided cradle and exactly two long cords, one ending in a simple
finger loop and the other in a plain release knot or short tab. Never include
stones, clay/lead sling bullets, projectiles, ammunition pouches, bags, cases,
hands, figures, staff slings, slingshots, or surrounding kit. Archive and replace
any sling art that includes ammunition or an accessory pouch, even if otherwise
attractive.
**Outer-layer continuity correction (2026-07-22):** shingled cloaks are an
unwanted image-model pattern, not a faction motif. Never describe or accept
cloak shoulders as scale-like textile tabs, feather rows, lamellar imitation,
or many repeated dangling panels. Cloaks and mantles should use broad continuous
cloth fields, simple folds, sparse pleats, gores, a folded shoulder cape, or at
most two large overlapping rectangular panels. Archive shingled outer layers
when the review UI is available; do not propagate their silhouette into prompts.
**Handwear construction-family correction (2026-07-22):** stop making soft,
comfortable-looking war mitts with isolated hard plates pasted onto them.
Woven, felted, quilted, bark-fiber, or hide mitts are materially continuous
soft handwear: reinforce them with denser weave, quilting, doubled palms,
corded seams, or hide wear patches, never bronze/brass/horn/stone plaques.
Metal gauntlets are a different family: contiguous articulated metal
backhand/knuckle/finger or mitten-shell construction over a subordinate hidden
lining, not a textile mitten decorated with metal rectangles. Tier-1 handwear
uses the soft family only. Never give mitts armored cuffs, obsidian/stone rows,
overlapping decorative plate bands, or repeated riveted panels.
**Material-role compatibility correction (2026-07-22):** plausible materials
do not automatically make a plausible combination. Every material needs a
mechanical role and credible interface. Hard shell materials carry impact;
textile/felt/hide/plant fiber work as backing, lining, edge binding, suspension,
or a broad flexible body. Never splice a thin woven reed, plant-stem, basketry,
or cloth stripe through the middle of a continuous bronze shell. Never weave
carefully cut rectangular stone, obsidian, ceramic, or glass tiles into mitts,
cuffs, flexible armor, or articulated joints. Brittle mineral belongs only as
a tiny protected inset or true cutting/tool edge. Dissimilar materials must
show believable overlap, backing, holes, lacing, rivets, socketing, wrapping,
or edge binding.
**Material-hierarchy correction (2026-07-22):** a lower-cost soft or plant
material may support a high-value hard material mechanically, but must not be
used as prestige decoration on it. Reed, straw, bast, wicker, coarse fiber, and
felt may be hidden lining, suspension, padding, edge binding, or a separate
garment; never a decorative stripe, crest filler, ornamental panel, or exposed
inlay on a bronze/brass helmet, cuirass, gauntlet, shield, or weapon. Choose one
dominant construction family per object. A woven helmet is entirely woven,
felted, bark-fiber, rawhide, or corded construction with no brass/bronze
ornament or reinforcing plates. A metal helmet is metal-led and may reveal
only a narrow functional lining or tie at an edge. Do not create high-tech
metal objects cosmetically decorated with lower-tech plant matter.
**Structural-counterpart correction (2026-07-22):** perspective can hide a
component but cannot excuse a missing structural half. Paired cheek guards,
ear flaps, neck guards, shoulder defenses, mitts, greaves, straps, hinges, and
suspension points need a mechanically corresponding opposite side unless the
brief explicitly requests purposeful asymmetry. Rear neck protection must span
the back of the helmet, with an edge, hinge, overlap, or silhouette cue proving
the hidden side exists. Handmade variation is fine; one-sided construction
mistakes are not.
**Active-service finish correction (2026-07-22):** historical references teach
geometry and construction, never archaeological surface condition. Inventory
items are recently made or actively maintained. Preserve healthy material
color with light handling polish, shallow scratches, small repairs, soot only
where functional, and mild localized tarnish. Ban heavy green verdigris, black
corrosion crust, powdery oxidation, burial staining, deep pitting,
encrustation, flaking metal, rotten fiber, extensive cracks, missing material,
faded museum-object color, and all-over distressing. Do not antique every
surface just because the reference was excavated.
**Female warrior-queen cosplay series weathering (2026-07-22):** this rule
applies only to the dedicated 40-image series generated by
`build_female_cosplay_ladder_prompts.py`, including its contact-sheet batching
prompts. It does not apply to inventory item generation, general ladder
characters, extraction prompts, or any other character series. In this one
series, use conspicuous but fresh battlefield dust and mud from active
ancient-era use: dry earth dust on feet or sandals, lower legs, hems, forearms,
lower equipment, and selected exposed skin, plus a few irregular fresh mud
splashes on calves, knees, outer thighs, garment edges, shield rims, or lower
armor. Distribution follows footfall, kneeling, gravity, and movement and stays
localized, asymmetrical, and varied by character. Preserve readable faces,
eyes, silhouettes, fastening, and central costume. Never convert this into an
all-over brown filter, archaeological patina, corrosion, burial staining,
rotten fiber, cracked leather, gore, material damage, or decay.
**External-reference taste correction (2026-07-22):** authority alone does not
make an image a useful generation input. Separate visual inspiration from
historical verification. Prefer full reconstructions, equipment boards,
typology plates, and clear complete-object imagery that materially improves
silhouette, assembly, coverage, material placement, or faction language. Keep
corroded fragments, isolated bosses, tiny partial weapons, textile scraps,
duplicate museum crops, and generic catalog shots as verification records only;
do not automatically attach them to generation calls. The current
`pinterest_discovery_unverified` and `pinterest_promoted` folders are better
visual-input pools, but still use one coherent historical anchor and never copy
watermarks, captions, sacred imagery, or an illustrator's overall style.
**Visual-board correction (2026-07-27):** do not default faction moodboards to
archival documents, isolated museum records, equal tile grids, visible
provenance labels, or ordinary staged item studies. Use a 2:3 portrait organic
collage with two approved ladder anchors and six bright, curated Pinterest-like
visual-direction sources researched for that faction. Alex's pasted examples
normally define the image type and visual energy to seek, not a source library;
include an exact pasted example only when Alex explicitly requests it. Added
text is limited to the faction name; provenance and transfer rules belong in
the sidecar manifest and prompt.
The builder must reject any ordinary `assets_staging` input unless Alex
explicitly approved that exact image for moodboard use. Follow
`core/MIXED-REFERENCE-BOARD-POLICY.md`. A user example can establish the useful
type of image without making its exact object, motif, culture, or technology
canonical.
Multi-reference item extraction authenticity correction (2026-07-22): include
external historical reference images as image inputs alongside ladder-character
references when generating item sets. Character references control faction
identity and material language; historical references control object
proportions, construction logic, helmet/shield/weapon families, club/mace
silhouettes, ritual implement geometry, and ornament restraint. Do not copy
captions, watermarks, modern bodies, or exact compositions from historical
reference sheets.
**Pre-ancient tech-level restraint (2026-07-22):** do not let external museum
references or high-tier character art push ordinary generated items into ornate
fantasy regalia. Bronze Age / early Iron Age equipment should look buildable by
pre-ancient workshops: cast, hammered, sewn, laced, woven, carved, riveted,
wrapped, or hand-shaped. Tier contrast comes from fit, overlap, balance,
material quality, and cleaner construction, not from all-over engraving,
filigree, dense studs, repeated bosses, gemstone centers, machine-perfect
symmetry, seamless compound curves, modern leatherwork, or palace-masterpiece
polish. Most surfaces should stay plain material with at most one or two bounded
decorated bands/rims/bosses/edge fields. A believable archaeological object
with strong game readability is better than a spectacular ornate prop.
**Solar-symbol saturation correction (2026-07-22):** solar fallback is now a
hard failure, not merely a soft motif warning. Ordinary item prompts must ban
sun disks, rayed disks, starbursts, rosettes that read as suns, radial spokes,
eight-spoked wheels, concentric sun rings, sun-like bosses, halo emblems,
winged disks, crescent-stars, and near-identical radial flowers even when a
character or historical reference contains them. Do not solve the problem by
swapping one celestial circle for another. Use the controlled research index
`character_pipeline_local/historical_motif_library.json`: target roughly 72%
motif-free items overall and roughly 88% at Tier 1; when a motif is allocated,
use at most one small bounded edge/hem/rim/grip/socket/terminal field and leave
at least 80% of the visible surface plain. Entries marked restricted or
forbidden are research context only and never automated. Pinterest is useful
as a visual-discovery graph, but trace strong pins to museum records, books,
reconstruction makers, or artists when possible; keep unverified pin images in
a separate discovery queue rather than silently treating them as artifacts.
Research is **faction-led and object-first, never artist-first**. First resolve
the faction's visual language to a small cluster of historically relevant
peoples/regions and periods. Then search those cultures' clothing, armor,
weapons, tools, and construction; use materials and symbols only as secondary
support. Search by object family + culture/region + material + construction +
date, not by a Pinterest creator's name. A pin or typology chart is a vocabulary
lead, not proof. Promote it only for a named practical clue such as blade/haft
ratio, socket or tang geometry, lashing, scale overlap, textile cut, closure,
coverage, or load-bearing placement, and pair that clue with a dated museum,
excavation, catalogue, or credible reconstruction source. Creator identity and
overall illustration style are not generation inputs. Choose one coherent
historical anchor cluster per item rather than averaging unrelated cultures.
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
- Brown wood, hide, tarnished bronze, and other olive-adjacent textures can
  trigger false red/magenta speckling when semitransparent pixels are
  decontaminated. Visually inspect every cleaned output against its raw. If the
  raw is clean but the keyed result gains colored speckles, preserve the failed
  derivative and rerun `chroma_key.py --no-decontaminate`; never promote the
  speckled cleanup.
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
- **Commit hygiene (revised 2026-08-15, per Alex: ship, don't wait):** source
  and cleaned generation PNGs anywhere under `assets_staging/` are local
  working files and gitignored (they are pre-approval intermediates and too
  heavy for the pages repo). Everything else that makes work reproducible or
  reviewable IS committed as it is produced: prompt packs, manifests, wave
  READMEs, triage TSVs, review pages, review-derivative thumbnails in
  `review_assets/`, and the final faction moodboard JPGs (their `sources/`
  research folder stays local). Composed finals still land in `assets/`.
  Do not commit `.DS_Store`, `__pycache__`, `.gen-lock`, or one-off
  handoff/commit helper debris. Agents commit and push their session's
  deliverables themselves; on this repo pushing gh-pages is the deploy.

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

The authoritative deep-prehistory-through-AD-600 family list is
`core/ANCIENT-EQUIPMENT-TAXONOMY.md`. Use its family IDs, construction
definitions, priorities, and model-risk notes when planning character lineups,
separator selections, item extraction, and auxiliary batches. Track coverage
at family level, not only at slot level. Prefer underrepresented P2/P3 families
when source evidence permits, but never fabricate a taxonomy target into a
source character. Keep individual kits culturally and technologically coherent;
the broad chronology is a project library, not one mixed panoply. Mail is
historically inside the research ceiling but remains production-locked until an
explicit project decision reopens it.

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
