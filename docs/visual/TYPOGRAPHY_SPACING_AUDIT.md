# WIZARD typography and spacing audit

Status: measured proposal, not an art-direction ruling. This audit changes no module CSS, authored data, layout logic, or WIZARD identity copy.

Inspected production base: `9f95a05037878cbe1f95b69336a4c1fa5dbe63a4`.

## Outcome

The dashboard and all nine active modules share a recognizable laboratory grammar: restrained serif display faces, neutral sans-serif utility copy, compact uppercase labels, dark panels, and repeated 4/8/12/16/20/24/32 px spacing intervals. They do not share one uniform type system, and they should not. The useful integration boundary is a semantic shell vocabulary for navigation, headings, body copy, controls, panels, and gutters. Module-authored display faces, HUD density, canvases, lore lockups, and simulation layouts remain identity-owned exceptions.

The strongest existing convergence is the dashboard, Cartographer, Mason, Chronicles, the Passive Tree, Inventory, and Systems Bench using some combination of Cinzel/Georgia for display and Source Sans 3 for utility copy. The strongest deliberate exceptions are Arcane Lattice's Georgia-only spellbook panel, Orbs' Iowan/Palatino plus monospace instrument readouts, and Verdigris Splash's Inter/Cinzel cinematic composition.

Evidence:

- [Wide contact sheet](../../evidence/visual/typography-spacing/contact-sheet-wide-1440x2520.png) — ten labelled default-state captures, each sourced at 1280×800, DPR 1.
- [Narrow contact sheet](../../evidence/visual/typography-spacing/contact-sheet-narrow-1320x1340.png) — the same ten surfaces at 375×900, DPR 1.
- [Wide measurements](../../evidence/visual/typography-spacing/measurements-wide.json) and [narrow measurements](../../evidence/visual/typography-spacing/measurements-narrow.json) — computed-style evidence, one record per surface.
- [Capture manifest](../../evidence/visual/typography-spacing/capture-manifest.json) — true-PNG signatures, exact encoded dimensions, and SHA-256 for both sheets and all 20 source captures.
- [Measurement probe](../../evidence/visual/typography-spacing/measurement-probe.js) — the read-only computed-style probe used for repeatability.

## Reproducible method

1. From the repository root, serve the exact inspected revision with:

   ```sh
   python3 -m http.server 8164 --bind 127.0.0.1 --directory .
   ```

2. Load the dashboard and the nine `visibility: dashboard` launch paths from `modules.json`. Use DPR 1, first at 1280×800 and then at 375×900. Wait for `load`, then 700 ms for default rendering. Do not activate controls or modify persisted state.
3. Evaluate `window.__wizardTypographySpacingProbe()` from `measurement-probe.js`. It records visible representative semantics (`body`, `header`, `main`, `h1`, `h2`, body copy, labels, controls, and panels), tallies computed typography on visible leaf text, tallies positive computed margins/paddings/gaps up to 160 px, and records root/body overflow.
4. Capture an exact viewport clip. The connected browser emits JFIF screenshot bytes even when the screenshot API is labelled PNG, so each exact clip is decoded and re-encoded to PNG without resizing. The manifest proves every `wide/*.png` is 1280×800, every `narrow/*.png` is 375×900, and each begins with the PNG signature `89504e470d0a1a0a`.
5. Verify evidence with `file`, encoded dimension checks, and `shasum -a 256`; compare against `capture-manifest.json`.

The contact sheets use scaled copies only for review convenience. Measurements come from the full-resolution source captures and computed DOM state.

## Measured inventory

| Surface | Launch path | Dominant computed stacks | Wide title / representative display | Narrow result | Shared-shell opportunity | Preserved identity |
|---|---|---|---|---|---|---|
| Dashboard | `/index.html` | Source Sans 3 / Cinzel | WIZARD 67.2/73.92 px, 17.472 px tracking | 38.4/42.24 px, no root overflow | Canonical shell fonts, gutters, labels, cards, controls | WIZARD lockup and wide tracking are owner-owned |
| Arcane Lattice | `tools/arcane_lattice/index.html` | Georgia | 24 px title, 0.96 px tracking; 12–19 px supporting scale | Fixed panel dominates 375 px; no root overflow | Back link and neutral control metrics only | Lattice canvas, 360 px spell panel, Georgia spellbook voice |
| Cartographer | `tools/cartographer/index.html` | Source Sans 3 / Cinzel | 21.6 px title; 12.8 px body; 14.4 px controls | Stable, no root overflow | Near-direct candidate for shell type/space aliases | Map canvas and generator-specific density |
| Chronicles | `tools/rp_account_creator/index.html` | Source Sans 3 / Cinzel | 36/40 px title, 6.48 px tracking; 16/24 px body | Cards stack; no root overflow | Navigation, labels, standard controls | Central CHRONICLES lockup and ritual presentation |
| Geometric Passive Tree | `tools/geometric_skilltree/index.html` | Source Sans 3 / JetBrains Mono / Cinzel | 15/18.75 px title; dense 10–16 px UI | Root stays 375 px, but body content measures 390 px and is clipped internally | Outer navigation and generic control roles | Dense editor scale, canvas, authored tree, theme variants |
| Mason | `tools/mason/index.html` | Source Sans 3 / Cinzel | Same 21.6 px title and 12.8/14.4 px body/control family as Cartographer | Stable, no root overflow | Near-direct candidate; share aliases with Cartographer | Terrain preview and forge workflow |
| Vessels of Life & Mana | `tools/wizard_orbs/index.html` | Iowan/Palatino / UI monospace | 8–11.5 px controls/readouts; resource value reaches 26 px | Stable single-column instrument stack | External shell navigation only | Orb plaque, resource readouts, compact instrument typography |
| Vesselforge & Inventory | `tools/rpg_inventory/index.html` | Source Sans 3 / JetBrains Mono / Cinzel | Dense 7–16 px working scale; 12 px controls | Stable, no root overflow | Navigation, labels, neutral buttons, panel rhythm | Item rules, equipment geometry, rarity/lore typography |
| Systems Bench | `tools/systems_bench/index.html` | Source Sans 3 / Georgia; embedded fixture adds Arial/mono | 30/45 px title; 15/22.5 px body | Stacks cleanly; no root overflow | Strong shell candidate for type and panel tokens | Fixture payloads and embedded target-module presentation |
| Verdigris World Presentation | `tools/verdigris_splash/index.html` | Inter / Cinzel | 78.08/70.272 px title; 6–18 px supporting scale | Title becomes 53.25/47.925 px; no root overflow | Utility chrome and accessible control sizing | Cinematic title, micro-label cadence, world-map composition |

No active module or viewport is omitted. The JSON evidence retains more detail than the table, including representative margins, padding, gaps, line height, weight, text transform, and frequency-ranked scales.

## Conflicts and risks

- **Fallback drift:** the shared family is often written as `Source Sans 3, Segoe UI, system-ui, sans-serif`, but Inventory omits the system intermediates; Splash uses Inter; Arcane uses Georgia for everything; Orbs uses Iowan/Palatino. A semantic alias can make intent explicit without forcing one rendered face.
- **Nominally similar values are not byte-identical:** current `rem`, `%`, and inherited values resolve to 10.56, 10.88, 11.2, 11.52, 11.84, 12.48, 12.8, 13.6, 14.4, 14.72, and 15.2 px on the dashboard and related modules. That is useful fluidity in places, but accidental when two controls are meant to be peers.
- **Microtype floor:** Inventory, Orbs, and Splash deliberately reach 6–9 px. Keep cinematic or HUD microtype as an exception, but do not reuse it for shell navigation, interactive controls, or required instructions.
- **Tracking range:** uppercase labels commonly use `.12em`–`.22em`; the dashboard lockup reaches `.26em` wide, Chronicles about `.18em`, and Splash is fluid. Shared shell labels need a narrower role; identity lockups keep their authored tracking.
- **Narrow composition:** all roots remain at or under the 375 px viewport. Passive Tree body content measures 390 px behind root clipping, and Arcane Lattice leaves its canvas compressed behind a fixed control panel. Those are retained editor/simulation compositions, not proof that a generic shell layout will fit internally.
- **Spacing granularity:** 4, 8, 12, 16, 20, 24, 32, and 40 px recur, while fluid `rem` values create intermediate results. A 4 px foundation covers the stable pattern; modules may retain 3/5/6/7/9/10/11/13/14/18 px optical and dense-UI exceptions.

## Proposed semantic token map

These are integration aliases, not mandatory replacements for module-authored values.

### Font roles and fallbacks

| Token | Proposed value | Use | Exception rule |
|---|---|---|---|
| `--wizard-font-display` | `"Cinzel", Georgia, "Times New Roman", serif` | Shared shell titles and section headings | A module may bind `--module-font-display` to Georgia, Iowan/Palatino, or its cinematic stack |
| `--wizard-font-body` | `"Source Sans 3", "Segoe UI", Roboto, Helvetica, Arial, system-ui, sans-serif` | Shared explanatory copy, labels, and controls | Splash may preserve Inter; Arcane may preserve Georgia internally |
| `--wizard-font-mono` | `"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace` | IDs, metrics, debug readouts, seeds, payloads | Orbs keeps its existing UI-monospace ordering where it affects instrument width |
| `--module-font-display` | `var(--wizard-font-display)` | Per-module display alias | Override locally; never rewrite WIZARD identity or authored lore lockups through a global selector |
| `--module-font-body` | `var(--wizard-font-body)` | Per-module body alias | Override locally for presentation identity |

### Type roles

| Token | Size / line height | Intended shared-shell role |
|---|---|---|
| `--wizard-type-meta` | `0.6875rem / 1.4` (11 px) | nonessential metadata and compact badges |
| `--wizard-type-control` | `0.75rem / 1.25` (12 px) | labels and compact controls; interactive targets still require adequate box size |
| `--wizard-type-body-sm` | `0.875rem / 1.5` (14 px) | secondary descriptions and dense shell copy |
| `--wizard-type-body` | `1rem / 1.6` (16 px) | default shell reading copy |
| `--wizard-type-section` | `1.25rem / 1.3` (20 px) | section headings |
| `--wizard-type-title` | `clamp(1.5rem, 3vw, 2rem) / 1.2` (24–32 px) | module shell page title |
| `--wizard-type-display` | `clamp(2.4rem, 8vw, 4.2rem) / 1.1` | dashboard/display contexts only |
| `--wizard-tracking-label` | `.12em` | shared uppercase label |
| `--wizard-tracking-kicker` | `.18em` | shell kicker/status line |

Values below 11 px, above the shared display clamp, or tracking above `.18em` require a named module exception rather than becoming general shell tokens.

### Spacing roles

Use a 4 px base scale: `--wizard-space-1: 4px`, `-2: 8px`, `-3: 12px`, `-4: 16px`, `-5: 20px`, `-6: 24px`, `-8: 32px`, `-10: 40px`, `-12: 48px`, and `-16: 64px`.

Semantic aliases should carry intent:

- `--wizard-gutter-inline: clamp(1rem, 4vw, 2.5rem)` — outer shell gutter.
- `--wizard-section-block: clamp(1.5rem, 4vh, 2.5rem)` — shell section separation.
- `--wizard-panel-padding: var(--wizard-space-4)` with `--wizard-panel-padding-roomy: var(--wizard-space-6)`.
- `--wizard-control-gap: var(--wizard-space-2)` and `--wizard-grid-gap: var(--wizard-space-4)`.
- `--wizard-prose-measure: 68ch` — shell documentation/description width only.

Do not apply the prose measure, panel padding, or grid gap to canvases, passive-tree geometry, inventory slots, map tiles, or the Orbs instrument layout.

## Shared shell versus module identity

Shared shell candidates are the WIZARD back link, module title/subtitle frame, neutral section labels, explanatory prose, standard form labels and controls, status badges, generic panels/cards, page gutters, and keyboard-focus affordances. Those roles can adopt the proposed aliases while keeping module-local colors and content.

Preserved identity includes WIZARD's name/backronym/laboratory framing; cinematic and lore lockups; Arcane Lattice's spell panel and lattice canvas; Cartographer and Mason previews; Chronicles' ritual landing composition; Passive Tree themes, authored graph, and dense editor geometry; Orbs' plaques and resource instrumentation; Inventory item rules, slots, rarity, and authored data; Bench fixture content; and Splash's world map and title choreography.

## Adoption order

1. **Define aliases in the shared frame without rollout.** Establish names, fallbacks, and exception hooks; confirm no unscoped selector changes module internals.
2. **Adopt on the dashboard, Cartographer, Mason, and Systems Bench shell.** Their current Source Sans/serif and 4 px-derived spacing already align, so this is the lowest-risk proof.
3. **Adopt only outer shell roles in Chronicles, Inventory, and Passive Tree.** Preserve central lockups, authored item/tree data, dense editors, and theme-specific values.
4. **Bridge, do not normalize, Arcane Lattice, Orbs, and Splash.** Map shared navigation and accessibility-facing controls to aliases while retaining each presentation stack and geometry.
5. **Review exceptions with the owner before any global cleanup.** In particular, decide whether 6–9 px cinematic/HUD text and the Passive Tree's clipped 390 px narrow body are intentional product constraints or later accessibility/responsive work.

This order deliberately keeps visual identity decisions owner-visible and reversible.
