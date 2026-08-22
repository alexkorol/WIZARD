# Framepack research evidence

Task: WIZARD-SURGE-001

Base: `0283e5876961c3dddb74ecef0f06f1c1df568d7a`

## Artifacts

- `framepack-directions-contact-sheet.png` — labelled 1536x1024 comparison
  sheet. SHA-256:
  `207d1cff62daa5d71906f8ea48363159f0848881851a3507c335edf37a4ebe4e`.
- `framepack-research-375.png` — 375x1024 GitHub-GFM document rendering.
  SHA-256:
  `9fc17321a2be9b560f8604eba7c37b62fbf89dc3195e2a74daaa730de66049fa`.
- `contact-sheet.html` — deterministic HTML/CSS source for the comparison
  sheet.
- `research-preview-shell.html` — narrow capture shell. The Markdown body was
  rendered through GitHub's `/markdown` API in `gfm` mode.
- `SOURCES.json` and `sources/` — source URLs, public-domain flags, dimensions,
  and hashes for all photographic evidence tiles.

## Capture environment

The local server ran from the repository root with:

```text
python3 -m http.server 8160 --bind 127.0.0.1 --directory .
```

The contact sheet was captured with Google Chrome Headless at device scale 1.
The output was inspected and measured as exactly 1536x1024.

For the narrow capture, GitHub rendered
`docs/visual/FRAMEPACK_RESEARCH.md` through the Markdown API. Chrome DevTools
reported:

```json
{"innerWidth":500,"bodyWidth":375,"articleWidth":375,"scrollWidth":375}
```

The browser's minimum headless window width was 500 CSS pixels, so the preview
shell fixes the rendered document body and article to 375 CSS pixels. DevTools
captured the exact `x=0, y=0, width=375, height=1024` document clip. The
resulting PNG is therefore a real 375px layout, not a scaled desktop capture.

All contact-sheet labels identify either a Met Open Access object ID or an
original `generated-placeholder`. The source photographs are research evidence
only and are not approved runtime assets.
