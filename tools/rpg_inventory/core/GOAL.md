# GOAL — Verdigris asset harness

**Mission:** a full game's worth of item art by **2026-07-31**, generated on
the regular from Alexei's ChatGPT Pro plan (web app only, no image APIs),
runnable by ANY agent (Fable, Claude Code, Codex) without handholding.

## Definition of done

1. Every row in `core/targets.tsv` with `want=yes` has a composed final in
   `assets/` that passes `core/qa_gate.py` AND the eyeball checklist.
2. `core/verdigris-pack.js` has a form entry for every rung that has art
   (ladders per `core/BASE-DESIGN.md`; evocative names, never id-names).
3. Everything committed to gh-pages via `commit_assets.sh` (run ON THE MAC).

## Budget math (2026-07-06: throughput mode — Alexei wants 50+/day)

- Throttle empirically trips at ~20/hr SUSTAINED for 2h+ (~70 in 13h).
  Cruise plan: waves of 3 parallel chats, 2 waves/run, hourly runs =
  **~6/hr average, cap 60/day** — well under the observed 20/hr trip rate
  while hitting 50-60 assets/day.
- Auto-backoff: a `skipped(rate-limit)` log line halves the next run.
- Never burn quota re-rolling for taste (AGENTS.md rule 1); QA rejects get
  ONE redo; hangs get none (item stays queued).

## Priorities (work top-down)

1. `core/REGEN.txt` queue (genuinely broken items only).
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
