# Post-calibration intake triage — Wave 2

Date: 2026-08-15

Canonical read-only audit of the **205 files added to
`C:\Users\Alex\Downloads\items_post_calib_batch` after the 2026-07 audit**
(everything not present in `post-calib-triage.tsv`, matched by exact filename).
No source file was moved, renamed, or deleted. `post-calib-triage-wave2.tsv`
is the authoritative per-file record (filename + SHA-256 + verdict + slot +
tier + stat axis + faction + confidence + description + reason).

Classification was performed by 14 parallel vision agents applying the wave-1
three-gate method plus the tier/stat/faction axes Alex requested. Verdicts are
agent proposals, **not** roster coverage; every promote still needs Alex's
approval on the review sheet plus normal QA.

## Result

| Verdict | Count | Meaning |
|---|---:|---|
| `promote` | 128 | Direct-salvage candidate; chroma-keyed copy staged. |
| `review` | 55 | Useful but gated: ornate/unique-tier, ceiling-adjacent, slot-ambiguous, or motif-borderline. |
| `reject` | 22 | Gate failure (solar/radial or spiral motif, wicker shield, modern gloves, medieval flail, full outfits, arrows in quiver). |
| **Total** | **205** | Every new file has one verdict. |

Note: this wave's promote rate (62%) is far above wave 1's (17%). The wave-1
pass predates calibration; this batch was generated post-calibration and it
shows — silhouettes, matte discipline, and material coherence are much
stronger. The verdicts remain proposals; the sheet makes overturning easy.

## Slot distribution (all 205)

| Slot | Total | Promote | Review | Reject |
|---|---:|---:|---:|---:|
| helmet | 36 | 16 | 17 | 3 |
| body armor | 26 | 16 | 8 | 2 |
| outer layer | 20 | 10 | 8 | 2 |
| shield | 20 | 8 | 3 | 9 |
| boots/footwear | 20 | 19 | 1 | 0 |
| impact | 13 | 9 | 3 | 1 |
| gloves/hands | 13 | 8 | 2 | 3 |
| belt | 10 | 2 | 8 | 0 |
| amulet | 10 | 8 | 1 | 1 |
| dagger | 10 | 10 | 0 | 0 |
| spear | 8 | 8 | 0 | 0 |
| axe | 6 | 5 | 1 | 0 |
| quiver | 6 | 3 | 2 | 1 |
| sword | 4 | 4 | 0 | 0 |
| sling | 1 | 1 | 0 | 0 |
| container/pack | 1 | 1 | 0 | 0 |
| other | 1 | 0 | 1 | 0 |

## Promote-pool skew (128 promotes)

- Faction: unclear 34, North 32, Stonewood 31, Dustwind 27, **Riverspill 4**.
- Tier: T1 34, T2 44, T3 32, T4 15, T5 3.
- Axis: DEX 78, STR 28, STR+DEX 12, INT 7, DEX+INT 2, INT+STR 1.

Implications for the next generation wave:

- **Riverspill is starved** (4 promotes) — the batch barely touched
  Egyptian/Sumerian language.
- **INT gear is starved** (10 promotes across all INT-containing axes) —
  consistent with the standing rite-focus/relic/attendant-focus zero-coverage
  gaps.
- Still zero supply in this wave for: ring, rite focus, relic, warbanner,
  caster rod, attendant focus, spoils, trap kit, mobility rig, gorytos,
  reliquary, preparation case, two-hand weapon, compact defensive off-hand,
  gorget replacement lanes. Belts remain effectively starved (2 promotes).
- Shields had the worst reject rate (9/20) — nearly all Gate 3 solar/radial or
  spiral hard failures. Future shield prompts must keep the motif ban loud.

## Reject reasons (22)

Solar/radial motif 7, spiral motif 4, wicker shield weak-prop 3, modern
five-finger gloves 3, full worn outfit / multi-item 2, medieval flail 1,
gambeson-with-eyelets 1, serpent-helmet spiral + black background 1.

## Artifacts produced

- `core/expansion_drafts/post-calib-triage-wave2.tsv` — authoritative record.
- `core/expansion_drafts/post-calib-wave2-files.tsv` — filename + SHA-256
  manifest of the 205 new files.
- `post-calib-wave2-review.html` — review sheet (approve / hold / discard per
  card, filters, JSON export). Thumbnails in
  `review_assets/post-calib-wave2/`.
- `assets_staging/post-calib-wave2-cleaned/` — chroma-keyed RGBA copies of all
  128 promote candidates (source files untouched). One decontamination
  speckle case (`ChatGPT Image Aug 14, 2026, 09_06_28 PM`) was rerun with
  `--no-decontaminate`; the speckled derivative is preserved beside it with a
  `_speckled` suffix. All 128 passed an automated magenta-speckle scan and
  spot visual composite checks.

## Required next action

Alex reviews `post-calib-wave2-review.html` (approve/hold/discard) and pastes
the JSON export back. Only approved rows then get expansion-manifest
assignment (`*-supply-map.tsv` rows with `source_kind=post_calib`,
SHA-256-keyed), compose, and runtime wiring. The 55 `review` rows are a
separate optional sheet pass; several look like deliberate unique/set pieces
(leopard-fur/gold set, iron spangenhelm, ornate lamellar) rather than base
rungs.
