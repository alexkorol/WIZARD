# RUNBOOK — the asset-generation loop (any agent: Fable, Claude Code, Codex)

Read `AGENTS.md` (one level up) and `core/GOAL.md` first. This file is the
mechanical loop. Filesystem is the only state; no memory required.

## Session start

1. `python3 core/status.py` — coverage, today's budget usage, prioritized
   queue. If 40 gens already logged today: do non-gen work (matte/compose/
   QA/pack wiring) or stop.
2. Check `core/.gen-lock` by CONTENT (not mtime — this mount can't delete
   files and truncation refreshes mtime): the file holds a unix timestamp;
   younger than 40 min = another run is live, do non-gen work only. `0` or
   empty or old = free; take it with `date +%s > core/.gen-lock`, release
   with `echo 0 > core/.gen-lock` on EVERY exit path.
3. Browser check: `list_connected_browsers` → select the entry with
   `isLocal: true` (the MacBook's Chrome — the machine this task runs on).
   NEVER drive an `isLocal: false` browser: that's Alexei's desktop, and
   two machines sharing the ChatGPT session cause logouts/MFA challenges.
   Then confirm chatgpt.com is logged in. If either fails, STOP and tell
   Alexei — do not thrash.

## Per item (gen → QA → matte → compose → log)

1. `python3 core/status.py --prompt ART_ID` → the full assembled prompt.
2. Send it in the ChatGPT web app. Debugged recipe (coordinates drift; trust
   selectors + screenshots over pixels):
   - navigate to chatgpt.com (plain chat is fine; project chat is a
     nice-to-have), wait ~3s
   - inject via JS: `const ed=document.querySelector('div.ProseMirror[contenteditable="true"]');
     ed.focus(); document.execCommand('selectAll'); document.execCommand('delete');
     document.execCommand('insertText', false, PROMPT); ed.innerText.length`
     (typed keystrokes get swallowed; ASCII only — no em-dashes/curly quotes;
     verify returned length ≈ prompt length, retry once if 0)
   - send via JS: `document.querySelector('[data-testid="send-button"]').click()`
     (Enter is unreliable)
   - record `location.pathname` (the chat URL)
3. Poll ~60-240s for the `<img>` (JS query for a blob/oaiusercontent img in
   the last message). Download via JS anchor from the img src, or the image
   lightbox download button. Verify a new file actually landed in Downloads
   before proceeding (`got=[]` → Escape, reopen, retry).
4. Stage: `cp` newest download to `assets_staging/ART_ID.png`, `rm` from
   Downloads (keep Downloads clean; one file at a time).
5. `python3 core/qa_gate.py assets_staging/ART_ID.png CANVAS` — numeric gate.
   Then LOOK at the image (Read tool) and run the eyeball checklist. Reject =
   fix the DESC (targets.tsv) before any retry; one retry max, then move on
   and note it in GEN-LOG.
6. Matte + compose (local, free):
   - `python3 core/art_matte.py assets_staging ART_ID`
   - `cd core && python3 compose_assets.py` (or per-item if supported)
7. Look at the composed final on a checkerboard if in doubt (holes, halos,
   eaten dark edges).
8. Log to `core/GEN-LOG.md`: `YYYY-MM-DD HH:MM TZ  ART_ID DONE|REDONE|SKIP (why)`.
9. If it was a REGEN item, remove its line from `core/REGEN.txt`.
10. Wait 5-6 min before the next gen (do matte/compose/QA work in the gap).
    Every 10 gens: 15-min break.

## Failure-mode catalog (catch these BEFORE staging)

| Symptom | Cause | Fix |
|---|---|---|
| squished/square long item | canvas prefix missing/ignored | regen with P/L prefix |
| backless helmet / facade | flat front view | 3/4 hero angle is in the style; if it still fails, add "showing the full dome and back of the helm" |
| single boot/glove | pair not stated | DESC must say "a pair of, shown as a pair" |
| stubby dagger/spear, short cords | model over-focuses on the head/pendant | state proportions: "long shaft, the entire weapon visible", "cord forming a full wearable neck-loop" |
| glowing/magical skymetal | fantasy prior | describe material only: "raw dark meteoric iron"; NEVER stack "not magical" negations (desaturates) |
| composite primitive item | over-composed DESC | primitive = ONE material + minimal parts |
| museum-photo stiffness | flat lighting/view | v2 style handles it; if not, "dynamic three-quarter view" reminder |
| spiral ornaments | old vocabulary | banned; sunbursts/chevrons/friezes/meander instead |
| item cropped by frame | fills frame too aggressively | qa_gate catches; regen |
| textured/vignetted bg | style drift | qa_gate catches; regen |

## Matte rules (LOCAL, never generative)

`core/art_matte.py` keys the flat background color automatically (black,
mid-grey #7F7F7F, or blue-grey #6E7B8B for skymetal/rivetmail/flint items).
Interior holes fill opaque by default; only rings/slings/gorgets/curios keep
genuine see-through holes. Helmet eyes must be OPAQUE.

## Session end

- `python3 core/status.py` again; append a one-line session summary to
  GEN-LOG.md.
- Do NOT git commit/push from a sandbox that can't delete/rename files —
  `commit_assets.sh` runs on the Mac. From Claude Code on the Mac directly,
  committing is fine: only assets/ + assets_staging/ + core scripts/docs.
- New Alexei feedback → bake it into AGENTS.md / ASSET-BRIEF.md / this table
  immediately.
