# AGENTS.md — RPG Inventory (Verdigris) asset work

Standing instructions and hard-won preferences for any agent working on this
folder. **Read this first.** Alexei has repeated this guidance across sessions —
do not make him say it again. When he gives new feedback, ADD IT HERE.

## ⚑ Goal harness (2026-07-05) — the self-serve loop

- `core/GOAL.md` — mission, definition of done, budget math, priorities.
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
2b. **Request TRUE ALPHA output** (2026-07-06): the prompt asks for a fully
   transparent background (real alpha PNG, not a painted checkerboard) with
   a flat grey fill only as fallback. Real alpha = no matte step at all;
   qa_gate.py and art_matte.py detect and use the alpha channel
   automatically. Never flatten RGBA to RGB when inspecting.
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
**No spiral motifs anywhere** (overused) — use sunbursts, concentric rings,
chevrons, friezes, dots/studs, meander bands, feather fringes, animal motifs.
**Don't prompt closures/fastenings** (2026-07-07): toggles, buckles, clasps
are shapes image-2 struggles with — never call them out in a DESC; let the
model render fastening its own way. (When it improvises, it does fine — the
antler toggles on the early belts came out well UNPROMPTED-level quality,
but explicitly demanding them invites mangled hardware.) Describe the body
of the item and its materials; leave closures unstated.

## Pipeline facts (so you don't rediscover them)

- **Masks are generated LOCALLY** from the art's black background via
  `core/art_matte.py` — NOT a generative matte. Gemini/GPT mattes leave holes;
  don't use them. `art_matte.py` params: low FLOOD threshold keeps dark subject
  detail; a pure-black-fraction test re-opens only genuine see-through holes
  (ring centres, sling gaps) while keeping dark concave surfaces solid.
- **Compose:** `cd core && python3 compose_assets.py` → autocropped finals in
  `assets/{formId}_{materialId}.png` (tools as `assets/{toolId}.png`).
- **ChatGPT web gen recipe (works, screenshot-free):** new tab → navigate
  `https://chatgpt.com/` → JS inject prompt into `div.ProseMirror` via
  `execCommand('insertText')` + dispatch input → click `[data-testid=send-button]`
  → poll for an `<img>` ≥512px (60–120s+) → JS `<a download>` from `img.src` →
  it lands in `~/Downloads` (mounted) as a UUID .png → `cp` newest to
  `assets_staging/{name}.png`. Prompt must start with `Generate an image, no
  commentary. ` and ASCII only (no em-dashes). Plain chat works (no project
  needed).
- **Downloads must be a connected folder** for the sandbox to read gen output.
- **Commit/push:** run `commit_assets.sh` ON THE MAC — the Cowork sandbox mount
  forbids file delete/rename, so git can't finish there (it leaves stale
  `.git/*.lock` files). Nothing has been pushed by an agent.

## Base-item model (READ `core/BASE-DESIGN.md` — this is fundamental)

Do NOT model items as `form × material` grids — that forces nonsense combos
(quilted sandals, obsidian gorget) and quirky exotic-only "forms" (atlatl,
macuahuitl-as-the-only-club). Instead, like Path of Exile / Diablo 2, each
equipment **class** gets a **ladder of distinct, individually-named bases**, one
per **tier**, escalating crude→endgame. Material/theme is intrinsic to each named
rung, not an axis sprayed across everything. Our tech arc IS the tier ladder:
T1 scavenged (flint/bone/hide) → T2 copper → T3 bronze → T4 ritual/exotic
(obsidian/jade/amber/gilded) → T5 otherworldly (skymetal/rivetmail). Exotic
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
- Review dashboard: open `review.html` in a browser to flag items + rework
  prompts; its Export button emits JSON of flagged items.
