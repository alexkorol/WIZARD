# RPG Inventory Expansion — Session Handoff

Date: 2026-07-24 PDT

## Current production state

- Active goal remains **300+ additional item arts**.
- Strict accepted additions this session: **18**.
- Canonical evidence: the 2026-07-24 entries in `GEN-LOG.md`.
- Pixel variants have not started and remain gated on user curation.
- No generation agents are running.

## Wave 05: ready but unrun

The next six calls are completely locked:

1. `helmet_light_riverhide` — S / 2×2
2. `body_cuirass_heroic` — P / 2×3
3. `amulet_copper_cowrie` — S / 1×1; display/material corrected to bronze
4. `wpn_axe_canaan_window` — P / 1×3; corrected to two windows plus central rib
5. `helmet_open_bronze_chalcidian` — S / 2×2
6. `amulet_shell_oval` — S / 1×1; pendant-only, no cord

Authoritative files:

- `core/SOURCE-OBSERVED-WAVE-05-PREFLIGHT.md`
- `core/build_source_observed_wave_05.py`
- `assets_staging/source-observed-wave-05/manifest.json`
- `assets_staging/source-observed-wave-05/prompts/`

All six manifest output files were checked and are absent. Five generation
agents were dispatched but interrupted before producing outputs; item 6 was
never dispatched. Do not harvest or assume hidden generations.

### Manual web handoff (2026-07-27, corrected)

The Codex-app automation path is paused. A paste-ready manual web variant of
the same six locked one-item prompts was prepared, but it is now superseded as
the routine roster workflow. Those prompts remain exceptional gap-item
experiments only.

- `assets_staging/manual-web-wave-01/README.md`
- `assets_staging/manual-web-wave-01/manifest.json`
- `assets_staging/manual-web-wave-01/prompts/`

The corrected default manual pack is:

- `assets_staging/manual-web-wildcard-wave-01/README.md`
- `assets_staging/manual-web-wildcard-wave-01/manifest.json`
- `assets_staging/manual-web-wildcard-wave-01/prompts/`

It contains six wildcard loadout requests: North/STR Tier 1-3 and
Riverspill/STR Tier 1-3. Each request uses two reviewed character/loadout
references and asks for up to ten separate paperdoll-slot item images. These
six ladder points currently have zero balanced-folder outputs, for a maximum
of 60 new coherent images.

Current supply classification and the next-family priority order are recorded
in `core/CURRENT-ASSET-COVERAGE-2026-07-27.md`. Important counting correction:
raw balanced-folder outputs and post-calibration `promote` candidates are not
accepted roster coverage. The 31 assigned post-calibration candidates remain
pending user approval and QA.

For manual web roster generation, use the six wildcard loadout prompts and
their reference paths verbatim. Preserve every separate output, including
partial batches, and do not same-pass reroll. The source-observed Wave 05
one-item calls should run only if Alexei explicitly asks to resume those
exceptional gap experiments.

## Accepted Wave 04 and salvage state

- Wave 04 report: `core/SOURCE-OBSERVED-WAVE-04-REPORT.md`
- Wave 04 strict result: 5 accepts / 1 hold.
- Wave 05 pre-generation salvage:
  `assets_staging/source-observed-wave-05/salvage/helmet_light_bronze_pilos_clean.png`
  passed true-alpha QA and is included in the strict total of 18.
- The ornate balanced-folder helmet at
  `items_multi_context_balanced_v1/faction_north - DEX - tier 1/02__headgear.png`
  is **not** a Chalcidian reuse: red soft-material prestige trim and fitted
  machine-like plates violate the material hierarchy. This cleared the
  source-accurate Chalcidian prompt for one future call.

## Important holds/rejects — do not rediscover

- `wpn_axe_abydos_adze`: hold; geometry is historically correct, but the raw
  copied burial-green corrosion into active-service art.
- `wpn_bow_beni_hasan_self`: hold; exact image unavailable, so string, grip,
  nocks, and completeness are unverified.
- `quiver_lacquered_reed`: reject/retire; cited BM object is only a small metal
  gorytos tip fitting, and the row contradicts the open-empty quiver rule.
- `quiver_new_kingdom_cartonnage`: hold; the only official view does not prove
  open mouth, rear harness, or joins.
- `trapkit_weighted_net`: reject; sinker plus separate net do not prove the
  board-backed kit.
- `mobility_headload_basket`: reject; mobility is bearer technique and the
  isolated object is a generic basket.
- `focus_antler_prong`: reject; source is a perforated macehead, not a
  double-ended focus; an unsupported staged generation already exists.
- `body_cuirass_bronze_bell`: reject as sourced; Met 256134 is the heroic
  cuirass. The correctly matched `body_cuirass_heroic` is in Wave 05.
- `shield_celtic_spine`: hold; Chertsey is an all-bronze ceremonial/display
  shield, not the row's wood-and-hide combat shield.
- `ring_copper_open`, `ring_copper_bezel`, `ring_stone_integral`,
  `ring_gold_massive_signet`: reject current pairings because of
  material/identity mismatch, incomplete source, inscriptions, or duplicates.
- `belt_woven_linen_girdle`: reject; source is a tunic fragment and the tied
  textile-belt macro already exists.
- `hands_stuffed_boxing_guards`: reject paired target; the two Vindolanda
  guards are explicitly unmatched open knuckle bands, not enclosed mitts.
- `feet_embossed_fur_shoes`: hold; one incomplete right shoe cannot authorize a
  mirrored pair.

## New mandatory operating rule

Do not repeat this session's quota failure. Six-to-eight-agent parallelism is
for locked image-generation calls. Research uses the main agent or at most two
bounded agents, and stops when one full wave is ready. Audit count is not item
art throughput.
