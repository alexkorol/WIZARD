# Verdigris art batch — handoff (v2, 2026-07-05)

> v1 of this file described the original Gemini-matte / black-background /
> painterly pipeline. That is ALL SUPERSEDED. Do not follow old recipes from
> chat history or summaries — the docs below are the only truth.

## Read these, in order

1. `core/ASSET-BRIEF.md` — ⚑ AUTHORITATIVE STYLE v2 (crisp rendered game-icon
   look, 3/4 hero angle, flat mid-grey background — blue-grey for iron/flint,
   no spirals anywhere, primitive = one material + minimal parts, describe
   materials instead of stacking negations). Also rate discipline for ChatGPT.
2. `core/BASE-DESIGN.md` — base/ladder roadmap for new item types.
3. `core/verdigris-manifest.tsv` — authoritative name/canvas/DESC per item.
4. `core/GEN-LOG.md` — what the autonomous scheduler already did.
5. `core/REGEN.txt` — force-regen queue (one name per line; scheduler eats it
   before the normal queue).

## Pipeline (current)

- ART: ChatGPT web app only (Pro), JS-inject prompt into ProseMirror +
  JS-click send. Pace ≤1 gen/5-6 min, <50/day (throttle hit at ~70/13h once).
- MATTE: `core/art_matte.py` — LOCAL, deterministic, background-adaptive
  (keys whatever flat bg color the art has: black, grey, blue-grey). Gemini
  matting is retired. Interior holes fill opaque by default; only
  ring/sling/gorget/curio forms keep genuine see-through holes.
- COMPOSE: `core/compose_assets.py` → `assets/{form}_{material}.png`.
- An autonomous scheduled task runs gen+matte+compose every 45 min while the
  Claude app is open with Chrome connected + ChatGPT logged in. Lock file:
  `core/.gen-lock` (delete if stale — it has caused skipped runs).

## Known open items

- Chats are created as plain top-level ChatGPT chats, not inside the "Pixel
  Art and Game Dev" project (reliability trade-off; wiring into the project
  is a pending nice-to-have).
- Review dashboard: `tools/rpg_inventory/review.html` (flags export JSON).
- Commit: run `bash tools/rpg_inventory/commit_assets.sh` ON THE MAC (the
  sandbox mount can't delete/rename, git leaves stale locks). Commits only
  assets + staging + scripts to gh-pages.
- gen_masks.py OpenRouter sweeper: retired along with Gemini matting.
