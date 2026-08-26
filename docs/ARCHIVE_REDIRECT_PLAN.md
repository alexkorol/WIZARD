# Archive redirect decision plan

WIZARD-SURGE-011 deliverable. Read-only audit of the five archive
candidates listed in `docs/ARCHIVE.md`; this plan proposes per-URL
decisions without moving, deleting, or redirecting anything. Physical
work belongs to a later packet.

Evidence base: `rg -n "pixel_sandbox|wordcloud|wordsphere|space_shooter|sokoban" --glob "!*generated*" .`
at base `65b6555` (origin/gh-pages tip), plus per-tree inspection below.

## Registry position

`modules.json` classifies all five as `visibility: "archive"`,
`status: "archive"` with manifests on disk. Registry totals: 9
dashboard, 5 archive, 3 internal, 1 legacy. None is reachable from the
active dashboard grid; the only in-repo references are the generated
registry itself, `scripts/wizard-lab.mjs` (`ARCHIVE_SLUGS`),
`scripts/wizard-surge-board.mjs`, manifest-hardening tests, and
documentation (`docs/ARCHIVE.md`, `docs/WIZARD_STANDARDIZATION_STATUS.md`).

No active module imports any candidate file. The only cross-references
inside candidate HTML are back-links to `/WIZARD/index.html`.

## Route table

Current HTTP targets are given against the live site root
`https://alexkorol.github.io/WIZARD/`. Sizes are on-disk tree sizes at
the audited commit.

### 1. `tools/pixel_sandbox`

- Current URL: `/tools/pixel_sandbox/` (manifest launch:
  `tools/pixel_sandbox/index.html`)
- Tree size: ~48 KB, single-page app, no build artifacts.
- Dependencies: Google Fonts (CDN). No local assets outside its own
  directory.
- History-sensitive URLs: none observed (single stable file).
- Inbound references: registry + docs only.
- Decision: **TOMBSTONE after one release** — keep direct URL working
  through the current cycle, then serve a tombstone page linking to
  `/`. Successor: none; falling-sand exploration has no active Verdigris
  consumer.
- Risk: LOW. Smallest tree, zero coupling.

### 2. `tools/wordcloud`

- Current URLs — three live variants, which is the main hazard:
  - `/tools/wordcloud/dist/` — canonical manifest launch target;
    bundled Vite SPA (`index-c26bb3c4.js`, `index-a211ff09.css`;
    content-hashed filenames).
  - `/tools/wordcloud/` — plain hand-written `index.html` also served.
  - `/tools/wordcloud/simple/` — legacy single-file variant.
- Tree size: ~412 KB total (~268 KB `dist/`, ~12 KB `simple/`, balance
  source + lockfile).
- Dependencies: none external detected in `dist/` output.
- History-sensitive URLs: HIGH. Content-hashed bundle names mean any
  rebuild changes asset URLs; deep links to today's hashed assets die on
  the next build. The unhashed variant pages are stable but duplicate
  content.
- Inbound references: `docs/WIZARD_STANDARDIZATION_STATUS.md` notes the
  `dist/` special case; registry launch points at `dist/`.
- Decision: **KEEP + CONSOLIDATE REDIRECTS** — keep
  `/tools/wordcloud/dist/` as the canonical survivor URL; redirect
  `/tools/wordcloud/` → `dist/` and `/tools/wordcloud/simple/` →
  `dist/`. Do not rebuild while archived; if a rebuild ever happens,
  old hashed asset links are accepted losses (documented here).
- Risk: MEDIUM — the multi-variant surface is the likeliest place for a
  redirect collision; the plan above keeps each source URL distinct and
  maps into the same canonical target without loops.

### 3. `tools/wordsphere`

- Current URL: `/tools/wordsphere/`
- Tree size: ~76 KB including experimental variants
  (`alt-sphere.js`, `new-sphere.js`) that are not linked from its own
  page.
- Dependencies: Google Fonts (CDN).
- History-sensitive URLs: none observed.
- Inbound references: registry + docs only.
- Decision: **REDIRECT to `/`** (laboratory home). The word-cloud
  presentation idea survives conceptually inside owner framepack work;
  no functional successor exists to inherit the URL. Keep files on disk
  per archive policy.
- Risk: LOW.

### 4. `tools/space_shooter`

- Current URL: `/tools/space_shooter/`
- Tree size: ~60 KB, two files (`index.html`, `game.js`) plus README.
- Dependencies: none external detected (wireframe renderer is
  self-contained; Three.js `Quaternion.slerp` mention in docs refers to
  library internals, not an import).
- History-sensitive URLs: none observed.
- Inbound references: registry + docs only.
- Decision: **REDIRECT to `/`**. No successor gameplay surface exists in
  the laboratory scope.
- Risk: LOW.

### 5. `tools/sokoban`

- Current URL: `/tools/sokoban/`
- Tree size: ~680 KB — the largest candidate; includes dev tests
  (`test-core.js`, `test-campaign.js`) that are NOT wired into any CI
  gate.
- Dependencies: Google Fonts (CDN).
- History-sensitive URLs: none observed.
- Inbound references: registry + docs only.
- Decision: **RELOCATE CANDIDATE (priority 1)** — largest byte payoff
  for archive relocation; if relocation happens, leave a tombstone page
  at `/tools/sokoban/` so the direct URL degrades gracefully instead of
  404ing.
- Risk: LOW functionally; the only caution is its unwired test files,
  which should move with it intact.

## Cross-cutting notes

- Redirect mechanism (meta-refresh stubs vs Jekyll redirects) is
  deliberately out of scope here; nothing in this plan requires GitHub
  settings changes.
- Every recommended destination is either the site root `/` or an
  existing canonical URL under the same slug — no route overwrites an
  active or owner-authored page.
- Unknowns: inbound links from outside this repository (search engines,
  bookmarks, other sites) are explicitly UNKNOWN and cannot be proven
  from repo evidence. All decisions above keep direct URLs working
  (redirect/tombstone), so unknown external links degrade gracefully
  rather than breaking.

## Recommended execution order (for the follow-up implementation packet)

1. sokoban relocate (+tombstone) — biggest payload win.
2. wordcloud consolidation redirects — kills duplicate-content hazard.
3. wordsphere + space_shooter redirects to `/`.
4. pixel_sandbox tombstone-after-grace-window.
