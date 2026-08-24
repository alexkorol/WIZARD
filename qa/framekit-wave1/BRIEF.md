# QA brief — FRAMEKIT wave-1 landed tree

- **Lane:** `wizard-desktop-tvu7or7-cursor-1` (harness `cursor`, model **Cursor Grok 4.6**)
- **Tree under test:** `origin/codex/arcane-lattice-1-0` `2fcbae7282f4e46a029605320aafd91a889bf951`. Tip later moved to `d000f64` (orchestration-only); `tools/gui_framekit/` unchanged.
- **Serve:** `python -m http.server 8162 --bind 127.0.0.1` from the lane worktree (capsule 8162–8163).
- **Verdict:** **FAIL** vs board acceptance on the landed program tree. Findings only; no product-code edits.

## Checklist

| # | Gate | Result |
| - | ---- | ------ |
| 1 | Owned-path packet diff | N/A (QA, no claim) |
| 2 | No build; vanilla HTML/CSS/ESM over loopback HTTP | **PASS** for files that exist. `index.html` and FK-102 frame demos **404**. |
| 3 | Component CSS uses `--fk-*` only (literals: `0`, `100%`, `var(--fk-x, #000)`) | **FAIL** (modal.css). Most other component CSS is token-driven. |
| 4 | `node --check` + every demo, **zero console errors** | `node --check` **PASS**. Console **FAIL** on every existing demo (CSS 404s). |
| 5 | Evidence | this brief, `qa/framekit-wave1/transcript.txt`, `qa/framekit-wave1/evidence/*.png` |

## Commands + output

```
python -m http.server 8162 --bind 127.0.0.1
```

```
$ node --check tools/gui_framekit/components/controls/tabs/tabs.js
exit=0
stdout=''
stderr=''
```

```
$ python tools/gui_framekit/tools/generate_assets.py --check
OK: 10 assets reproduce byte-for-byte
exit=0
```

HEAD `http://127.0.0.1:8162/…`:

- **200:** `/tools/gui_framekit/demo/showcase.html`, `/tools/gui_framekit/assets/demo.html`, all FK-103–106 `demo.html` pages, their `.css`, `tabs.js`, orb sprites.
- **404:** `/tools/gui_framekit/index.html`
- **404:** `/tools/gui_framekit/tokens/tokens.css`
- **404:** `/tokens/tokens.css` (wrong relative href from `assets/demo.html`)
- **404:** `/tools/gui_framekit/components/frames/{window,panel,dialog}/demo.html` and matching `.css`
- **404:** `/tools/gui_framekit/base/base.css`

Edge (Playwright `channel=msedge`) load of every listed URL: `console.error` `Failed to load resource: 404` on every existing demo (`tokens/tokens.css` missing). Showcase also 404s three FK-102 frame stylesheets. Full log: `qa/framekit-wave1/transcript.txt`. Screenshots: `qa/framekit-wave1/evidence/`.

Visual: demos without tokens render as unstyled UA HTML. Assets demo still shows nine-slice PNG + orb sprites (those URLs 200).

## Defects (proposed wave-1.5)

**A — integration hole (orchestrator already caveated; still fails this QA gate).**
PR #95 (FK-101 tokens/base) and PR #96 (FK-102 frames) are ACCEPTED but unmerged. Landed demos import `../../../tokens/tokens.css` (from components) / `../tokens/tokens.css` (showcase). Until merge, "zero console errors" cannot pass on the program branch. FK-108 `index.html` is also missing from the landed tree.

**B — `assets/demo.html` token href is one `../` too deep (survives #95 merge).**
`tools/gui_framekit/assets/demo.html` uses `href="../../../tokens/tokens.css"` → `/tokens/tokens.css` (404), not `/tools/gui_framekit/tokens/tokens.css`. After FK-101 merges this demo still 404s unless the href is `../tokens/tokens.css`. Same page `<style>` uses `border-image-slice: 12` and `border-image-width: 12px`.

**C — token-discipline misses in component CSS.**
`tools/gui_framekit/components/overlays/modal/modal.css`: `background: rgba(0, 0, 0, 0);` and `max-width: min(90vw, …)`. INTERFACES allows `0`, `100%`, and `var(--fk-x, #000)` fallbacks only.
Several `demo.html` files use inline `max-width: 420px` / `280px` / `320px` (page chrome).

No `pageerror` JS exceptions. Only JS file is `tabs.js`; `node --check` is clean.

## Out of scope

Wave 2 still queued / not claimable. No READY packets. This lane did not edit product files under `tools/gui_framekit/`.
