# Image-gen shopping list — 2026-08-15

Everything below is paste-ready for manual ChatGPT image-2 work. Budget rules
apply: ~60 gens/day cap, waves of up to 3 parallel chats, ONE attempt per
concept, no same-run rerolls; a failed item goes back to the queue with a note.
Ordered by priority.

## 0. Harvest first (no new gens)

Three strike-1 chats may already hold completed images. Check each chat for a
finished image BEFORE any re-send (`python3 core/status.py` prints them):

1. `shield_turtleshell` — /c/6a4c983a-a574-83ea-8306-f85f708101f6
2. `girdle_shell` — /c/6a4c9861-a57c-83ea-a217-a975381d2978
3. `mantle_feather` — /c/6a4c9888-a494-83ea-ae3a-41ae74364cc0

## 1. Live-404 fixes (3 single-item gens) — highest priority

The Brands & Bonds page requests these three art files and gets 404s on the
live site, so the auxiliary unlock seats render without icons:

- `07__warhorn_bone.txt` — Aurochs War Horn (S canvas)
- `08__quickrig_hide.txt` — Hunter's Quick Rig (S canvas)
- `12__attendant_copper.txt` — Copper Orbit (S canvas)

Prompts: `assets_staging/manual-shopping-2026-08-15/prompts/`. Paste verbatim,
one chat each. After QA: `qa_gate.py`, then `compose_assets.py NAME`.

## 2. Wave-01 wildcard loadouts (6 prompts, up to 60 images) — ready, unrun

`assets_staging/manual-web-wildcard-wave-01/README.md` lists prompts,
reference attachments, and moodboards. North STR T1-T3 + Riverspill STR T1-T3.
Each batch: fresh conversation, attach REFERENCE A, REFERENCE B, then the
faction moodboard as Image C, paste prompt verbatim, keep every output
including partial batches.

## 3. Wave-02 wildcard loadouts (6 prompts, up to 60 images) — NEW

Built 2026-08-15 to attack what the wave-2 triage showed starved: only 4 of
128 new promote candidates are Riverspill and only 10 carry any INT axis.

`assets_staging/manual-web-wildcard-wave-02/README.md` lists everything:

1. Riverspill DEX T1
2. Riverspill DEX T2
3. Riverspill DEX T3
4. Riverspill INT T2
5. Riverspill INT T3
6. Stonewood INT T2

Same attach-and-paste procedure as wave 01. Reference pairs were visually
selected from your reviewed ladder folders on 2026-08-15.

## 4. Remaining missing starter targets (21 single-item gens)

Prompts 01-24 in `assets_staging/manual-shopping-2026-08-15/prompts/` (minus
the three in section 1). These complete the 103-item starter pack ladders:
war-calls, quick rigs, attendants, relics, trophies/spoils, preparation items,
plus `shield_turtleshell` / `girdle_shell` / `mantle_feather` /
`necklace_claw` / `wand_antler` / `curio_turquoise` if the harvest in
section 0 comes back empty.

## 5. Regen queue (5 single-item gens, lowest priority)

Prompts 25-29 in the same folder: `wrap_hide`, `sandals_hide`,
`sandals_quilted`, `girdle_quilted`, `curio_amber`. These have broken/flagged
finals; regenerate only after everything above.

## Notes

- Single-item prompts use the canonical PROMPT.txt style (transparent
  background with mid-grey fallback). Wildcard loadout prompts use the
  olive-slate matte; run their outputs through `core/chroma_key.py`.
- Wave-2 triage of your 205 new batch images is complete:
  128 promote candidates await your approval in
  `post-calib-wave2-review.html` (serve the repo root and open it, decisions
  export as JSON). Nothing from that batch needs re-generation, so none of it
  is on this list.
- Families still at zero supply after ALL of the above and the full wave-2
  batch: warbanner, trap kit, mobility rig, gorytos, caster rod, sword ladder
  above T2, two-hand weapons, compact defensive off-hand, reliquary. Those
  need either a future wildcard wave or source-observed one-item prompts;
  do not improvise them from prose (visual-source gate).
