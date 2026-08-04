# Measure-3 roster audit

Status: **HOLD GENERATION**. The six frozen portfolio TSVs are structurally
sound candidate pools, but they are not yet a generation manifest.

This audit used:

- `AGENTS.md`, `GENERATION-PLAN.md`, `character_pipeline_local/BASE-FAMILIES.md`,
  and `INVENTORY-FOOTPRINTS.md`;
- the 103-row `targets.tsv`;
- all 400 rows and all 86 currently present outputs in
  `items_multi_context_balanced_v1`;
- all 261 rows in `post-calib-triage.tsv` and the corresponding source files in
  `items_post_calib_batch`.

No images were generated and no portfolio TSV was edited by this audit.

## Frozen portfolio

| File | Rows | SHA-256 |
|---|---:|---|
| `weapons.tsv` | 50 | `0ff80e57fff57a4839e32637da9bdbe73baf3b55c2c7946c4654ff5e66de9676` |
| `offhands.tsv` | 50 | `96ac1a01708075857515eb2cf1c9efb1c47f9ee76b14a580f7763f83f017c511` |
| `armor_helms.tsv` | 50 | `5412662b59d470e8c85e916e7b33878ed6df95dd19990aa07c047ec204d1cb78` |
| `wearables.tsv` | 50 | `cbebdfd7546c1051c0b93182f950943b57ca14878ad16a313e0bb71b14351285` |
| `jewelry_relics.tsv` | 50 | `fe13570db6329e95d05fe2b5c690c5c42dd340b614a3f4210a8a050330707420` |
| `auxiliary.tsv` | 50 | `3a696bb64b0a71c8718d4b10a8e15144251d43b3c9e8f3f2e2d268bae24a6db2` |

Mechanical passes:

- exactly 300 portfolio rows;
- all six files use the same expected 11-column schema;
- no blank required fields;
- 300 unique `art_id` values and 300 unique display names;
- no exact ID or display-name collision with `targets.tsv`;
- all source URLs are populated;
- all seven explicitly linked calibrated outputs exist;
- all twelve filename-addressed post-calibration files exist;
- `post-calib-triage.tsv` has exactly 261 rows, and every filename and SHA-256
  matches the source directory;
- canonical salvage totals are 44 `promote`, 71 `review`, and 146 `reject`.

## Blocker 1: `intake_source` is not an action field

The column currently mixes at least five meanings:

- `new_generation`;
- `new_gap_deduped_balanced_v1`;
- a calibrated output path intended for reuse;
- a post-calibration image intended for reuse or review;
- a rejected image used only as a structural reference.

That ambiguity can cause a rejected/reference-only image to be promoted, or an
existing usable image to be regenerated. Split it before queue construction:

| New field | Allowed values / purpose |
|---|---|
| `action` | `generate_new`, `review_reuse`, `alias_existing`, `reference_only_generate`, `hold_redesign`, `retire` |
| `source_kind` | `none`, `post_calib`, `balanced_output`, `existing_target` |
| `source_path` | Exact filename/path; never an array index alone |
| `source_sha256` | Required for `post_calib` |
| `source_verdict` | `promote`, `review`, `reject`, or `not_audited` |
| `overlap_key` | Existing art ID or calibrated manifest/output row |
| `qa_status` | `unreviewed`, `accepted`, `rejected`, `needs_user` |

### Direct calibrated-output rows

All seven paths exist. Tag these `review_reuse`, not `generate_new`:

- `shield_reed_pelta`
- `shield_hide_figure_eight`
- `shield_hide_dipylon`
- `shield_bronze_parma`
- `focus_bronze_prongs`
- `focus_bronze_censer`
- `focus_ram_rhyton`

They still need visual QA; file existence is not acceptance.

### Filename-addressed post-calibration rows

The bracketed/index numbers in the portfolio TSVs are not canonical. Different
agents sorted the directory differently. The exact filename is usable; the
number is not. Normalize these from `post-calib-triage.tsv`:

| Row | Canonical result | Proposed action |
|---|---|---|
| `shield_hide_round` | filename is canonical index 81, `promote` shield | `review_reuse`; replace `index84` with filename + SHA |
| `shield_oxhide_tower` | filename is canonical index 50, `review` shield | `review_reuse`; replace `index53` |
| `body_lamellar_bronze` | index 93, `review` body armor | `review_reuse` |
| `hands_sinew_forearm_wraps` | filename is index 154, `promote` gloves | `review_reuse`; replace `[158]` |
| `hands_rawhide_wrist_cuffs` | filename is index 163, `promote` gloves | `review_reuse`; replace `[167]` |
| `hands_hide_splint_bracers` | filename is index 144, `reject` gloves | `reference_only_generate` or remove source; never promote |
| `hands_bronze_vambraces` | filename is index 134, `review` gloves | `review_reuse`; replace `[138]` |
| `feet_classical_riding_boots` | filename is index 164, `reject` boots | `reference_only_generate` or remove source; never promote |
| `belt_folded_wool_sash` | filename is index 169, `promote` belt/sash | `review_reuse`; replace `[173]` |
| `belt_plain_leather_belt` | filename is index 151, `review` belt | `review_reuse`; replace `[155]` |
| `belt_bronze_plaque_belt` | filename is index 142, `review` belt | `review_reuse`; replace `[146]` |
| `belt_bronze_sword_girdle` | filename is index 161, `review` belt | `review_reuse`; replace `[165]` |

These three jewelry locators are unresolved because they contain only a
noncanonical index and no filename or hash:

- `ring_bronze_v` (`intake_178_...`)
- `amulet_tusk_tip` (`intake_183_...`)
- `amulet_bronze_tooth` (`intake_183_...`)

Canonical index 178 is a reviewed shield and canonical index 183 is a promoted
belt, so neither locator proves the stated jewelry source. Tag all three
`hold_source_resolution` until the intended filename is recovered; otherwise
drop the intake link and treat the row as a new generation.

## Blocker 2: salvage and calibrated supply are not fully mapped

The calibrated manifest has 400 planned rows and 86 existing outputs. Only
seven of those outputs are explicitly assigned above. Existing supply includes:

| Existing output class | Count |
|---|---:|
| body armor | 17 |
| shields | 12 |
| headgear | 7 |
| carry | 7 |
| outer layers | 7 |
| ritual | 6 |
| hands/arms | 5 |
| legs/footwear | 5 |
| signal | 5 |
| all weapon classes combined | 13 |

The canonical post-calibration audit adds 44 promote candidates, including
seven spears, six rings, five gloves, four shields, four amulets, four helmets,
three body armors, three outer-layer/cowl candidates, two boots, two impact
weapons, one belt/sash, and one war-call.

This matters at row level:

- all eight new `spear_polearm` rows are marked `new_generation` even though
  seven promoted spear images are waiting to be mapped;
- all fifteen ring rows are treated as new gaps despite six promoted rings;
- the handwear pool has five promoted intake candidates in addition to five
  existing calibrated hand outputs;
- the draft has no outer-layer rows even though seven calibrated outputs and
  three promoted intake candidates can seed that missing family.

Before any image call, build an overlap table from every one of the 300 rows to:

1. an existing `targets.tsv` asset;
2. an accepted/promoted post-calibration image;
3. one of the 86 calibrated outputs;
4. `none`.

`generate_new` is valid only for case 4 after visual comparison. The 314 missing
rows in the calibrated manifest are not an automatic generation queue; they are
faction/set plans and may be superseded by the curated base roster.

## Blocker 3: footprint and canvas mismatches

The following rows contradict `INVENTORY-FOOTPRINTS.md`:

| Row | Current | Required action |
|---|---|---|
| `shield_hide_round` | `S`, 2x3 | change canvas to `P`, or make it a true 2x2 compact shield |
| `shield_wood_round` | `S`, 2x3 | change canvas to `P`, or make it 2x2 |
| `shield_bronze_yetholm` | `S`, 2x3 | change canvas to `P`, or make it 2x2 |
| `warcall_cattle_horn` | `P`, 2x2 | change canvas to `S` |
| `warcall_bronze_sistrum` | `P`, 2x2 | change canvas to `S` |
| `wpn_club_meteor_hammerpick` | 2x3 | choose 1x3 as a one-hand hammer-pick, or reclass and redesign as a 2x4 two-hand weapon |

Seven rite tools use 1x2 even though the canonical held-focus footprint is 1x3
(or 2x2 for broad vessels):

- `focus_wood_clappers`
- `focus_shell_rattle`
- `focus_copper_bell`
- `focus_copper_ladle`
- `focus_bronze_handseal`
- `focus_amber_bell`
- `focus_skymetal_bell`

Either move them to 1x3 or explicitly revise the authoritative footprint table
to admit compact 1x2 held implements. Do not silently ship an undocumented
exception.

The five `preparation_kit` rows are 1x1. Their descriptions read as individual
Preparation Case contents, not equipped kits. Rename the class to
`preparation_content`/runtime `preparation`, or make the objects complete 2x2
kits. This is a class/footprint ambiguity, not merely naming.

Three historical-anchor strings contain non-ASCII `O-diaeresis` in `Otzi`.
The repo's prompt/manifests require ASCII, so use `Oetzi` in:

- `feet_grass_net_shoes`
- `quickrig_bentwood_frame`
- `prepkit_tinder_wrap`

## Blocker 4: the schema cannot prove ladder correctness

`class` plus `tier` is insufficient when a file contains several parallel
ladders. The manifest needs:

- `ladder_id`
- `rung`
- `runtime_kind`
- `mechanical_identity`

Without those fields, adjacency is inferred from naming and row order. That is
not safe enough for the user's "all with the ladder systems" requirement.

Examples:

- weapons have 14/12/11/6/7 rows across T1-T5, and `club_mace` has no T4;
- wearables have multiple bases at each tier but no declared adjacency;
- jewelry contains three rings and three amulets per tier but no mapping from
  one named base family to its next rung;
- granular classes such as `body_corselet`, `helmet_segmented`, `war_call`,
  and `quick_rig` do not match the existing runtime class vocabulary.

The inferred ladders also retain several material-reskin pairs that should be
aliased or re-silhouetted:

- `helmet_neckguard_copper_montefortino` /
  `helmet_neckguard_bronze_montefortino`;
- `helmet_light_copper_bowl` / `helmet_light_skymetal_bowl`;
- `body_corselet_bronze_scale` / `body_corselet_skymetal_scale`;
- `shield_scutum_rect` / `shield_skymetal_scutum`;
- `hands_bronze_vambraces` / `hands_meteoric_vambraces`;
- `amulet_copper_sheet` / `amulet_bronze_sheet` /
  `amulet_skymetal_sheet`;
- `relic_copper_ewer` / `relic_skymetal_ewer`;
- `relic_stone_pyxis` / `relic_jade_pyxis`;
- `relic_bronze_bell` / `relic_skymetal_bell`;
- `relic_bronze_censer` / `relic_skymetal_censer`.

Adjacent bases may share an archaeological family, but each needs a different
48px thesis, not the same macro object in the next material.

## Blocker 5: the 300-row roster is broad but not yet a full ARPG roster

Current allocation:

| Portfolio | Rows |
|---|---:|
| weapons | 50 |
| shields, bucklers, defensive offhand, rite foci | 50 |
| body armor and helmets | 50 |
| handwear, footwear, belts | 50 |
| rings, amulets, relics | 50 |
| quivers, gorytoi, war-calls, standards, rigs, kits, attendants, pack contents | 50 |

Important gaps:

- **0 cloaks/mantles/outer layers** in the new roster;
- **0 bows** despite ten quiver/gorytos bases and four bow families in the
  ancient taxonomy;
- **0 distinct caster-rod/wand ladder** despite a 12-base allocation in
  `GENERATION-PLAN.md`;
- no clearly mobility-focused Quick Rig ladder; the five rigs are load/tool,
  medicine, fletching, and trap carriers;
- the handwear pool is dominated by forearm defenses.

The handwear problem is concrete: among 17 rows there is one true mitt
(`hands_fur_combat_mitts`), no full glove ladder, and roughly a dozen archer
guards, wraps, cuffs, bracers, vambraces, scaleguards, or manicae. That conflicts
with the revised hand-slot rule and does not provide a Diablo/PoE-like glove
economy. `hands_stone_archer_guard` is also a rigid T1 item even though the
current rule makes T1 handwear a soft family.

Recommended rebalance without increasing the 300-row total:

1. retire or alias 5-8 of the 30 shield/defensive rows after mapping the 12
   existing calibrated shields and four promoted intake shields;
2. retire or re-silhouette 5-8 material-reskin jewelry/relic rows;
3. replace 5-7 forearm-defense rows with closed mitt, enclosed
   mitten-gauntlet, complete glove, hand-pouch, and coherent hand-cage bases;
4. spend the freed rows on 5-10 outer layers, 5 caster rods, and 5
   mobility-specific Quick Rigs;
5. add a five-rung source-driven bow ladder, or record an explicit project
   decision that bows remain deferred because of model risk.

The bow decision must be explicit. Bows are fragile, but a full ancient ARPG
roster with quivers and no ranged main-hand base is visibly incomplete.

## Blocker 6: residual prompt-risk cleanup

These are not schema errors, but should be resolved before queue release:

- `Gilded Field Spangenhelm` and `Meteoric Francisca` are inside or near the
  AD-600 ceiling but strongly evoke early-medieval equipment. Because the user
  explicitly asked for no medieval feeling, tag them `needs_user` or replace
  their player-facing name/silhouette with an earlier ancient anchor.
- Twelve belt descriptions still mention `fastening` or `closure`, usually to
  say it is unseen. The standing rule is not to prompt closures at all. Remove
  the entire closure phrase from `belt_bast_rope_girdle`,
  `belt_hide_thong_belt`, `belt_rawhide_girdle`,
  `belt_copper_terminal_band`, `belt_plain_leather_belt`,
  `belt_segmented_soldier_belt`, `belt_bronze_sword_girdle`,
  `belt_etruscan_sheet_girdle`, `belt_lacquered_scale_girdle`,
  `belt_gilt_bronze_warbelt`, and `belt_meteor_plate_warbelt` /
  `belt_meteoric_segmented_girdle`.
- `hands_hide_splint_bracers` and `feet_classical_riding_boots` point to
  canonical intake rejects. The ideas may survive, but only as new generation
  rows with the rejected art used, at most, as a negative/reference lesson.

## Release gate

Generation may begin only after all of the following are true:

1. every row has explicit `action`, `ladder_id`, `rung`, and `runtime_kind`;
2. all 44 canonical promote candidates and all 86 calibrated outputs have been
   visually mapped or explicitly rejected for base reuse;
3. index-only source locators are replaced by exact filename + SHA-256;
4. the five canvas mismatches, the 2x3 hammer-pick, and compact-focus footprint
   exceptions are resolved;
5. roster gaps and overrepresented shields/forearm guards/material reskins are
   rebalanced;
6. the resulting additive artifact is written as reviewable `targets-600.tsv`,
   not substituted directly into `targets.tsv`;
7. the first generation wave is a small mixed-category verification wave,
   followed by normal six-agent production only after its QA confirms the
   merged manifest and grid wiring.

Pixel variants remain downstream of user approval and sorting, as requested.
