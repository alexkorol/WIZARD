# GOAL — Verdigris asset harness

**Mission:** a full game's worth of item art by **2026-07-31**, generated on
the regular from Alexei's ChatGPT Pro plan (web app only, no image APIs),
runnable by ANY agent (Fable, Claude Code, Codex) without handholding.

Scale target: **500-600 usable inventory images**, not the current 90-row
starter slice. The concrete expansion plan lives in `GENERATION-PLAN.md`;
research notes from PoE/Diablo live in `REFERENCE-NOTES.md`.

## Definition of done

1. Every active row in the final 500-600 row manifest has a composed final in
   `assets/` that passes `core/qa_gate.py` AND the eyeball checklist. Rows
   marked `discard` in `core/asset-review.js` are retired from the target set.
2. `core/verdigris-pack.js` has a form entry for every rung that has art
   (ladders per `core/BASE-DESIGN.md`; evocative names, never id-names).
3. Composed finals and reusable scripts/docs are committed to gh-pages; local
   source generations in `assets_staging/*.png` are not.

## Budget math (2026-07-06: throughput mode — Alexei wants 50+/day)

- Throttle empirically trips at ~20/hr SUSTAINED for 2h+ (~70 in 13h).
  Cruise plan: waves of 3 parallel chats, 2 waves/run, hourly runs =
  **~6/hr average, cap 60/day** — well under the observed 20/hr trip rate
  while hitting 50-60 assets/day.
- Auto-backoff: a `skipped(rate-limit)` log line halves the next run.
- Never burn quota re-rolling for taste (AGENTS.md rule 1); QA rejects get
  ONE redo; hangs get none (item stays queued).

## Priorities (work top-down)

1. `core/asset-review.js` rework items, then `core/REGEN.txt` queue
   (genuinely broken items only).
2. Missing rungs in targets.tsv, weapons+armour before jewellery/flavour.
3. Material variants for new bases (dagger/warclub/greataxe/buckler/helm/
   greaves ladders).
4. Nice-to-haves: UI frame regen (hammered bronze), chat-into-project wiring.

## Cadence

- Scheduled task runs the loop every 45 min while the Claude app + Chrome +
  ChatGPT login are up. Lock: `core/.gen-lock` — content-based (holds a unix
  timestamp; `0`/empty/older than 40 min = free). Release = `echo 0 >` it.
  Never judge it by mtime.
- Any interactive session: run `python3 core/status.py`, do the top of the
  queue for as long as budget allows, log to `core/GEN-LOG.md`, stop cleanly.

## Non-negotiables (see AGENTS.md for the full list)

Web apps only · pace the quota · QA on the fly (qa_gate + eyeball) · move
forward not sideways · when Alexei gives feedback, bake it into AGENTS.md /
ASSET-BRIEF.md immediately so no session relearns it.

## Codex weekly-quota correction (2026-07-24)

The image-generation allowance and Codex weekly agent quota are separate
constraints. A six-to-eight-agent research tree can consume substantial weekly
quota while producing zero images. Reserve broad parallelism for locked
one-call image generation. Use the main agent or at most two bounded agents for
source/dedupe audits, stop when one full wave is ready, and report strict
accepted art per generation call.

## Default manual-web production unit (2026-07-27 correction)

Routine roster expansion uses one coherent faction + attribute axis + tier
loadout as the generation unit. Attach two reviewed character/loadout
references and request up to ten separate paperdoll-slot item images. The
character references control item family, materials, construction, palette,
and context. Historical moodboards are optional plausibility boundaries, not
object shopping lists. Individually predesigned prompts are exceptional tools
for stubborn high-value gaps after loadout extraction and curation, not the
default 300-item production method.
