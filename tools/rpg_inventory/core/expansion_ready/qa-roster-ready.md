# Final Measure-3 audit of `expansion_ready`

Verdict: **PASS**.

The exact frozen TSV bytes listed below satisfy the roster release conditions.
There are no residual row blockers. This is a manifest and supply-accounting
release, not art approval: the 69 existing-image candidates remain behind the
explicit user-review gate.

No portfolio TSV or supply map was edited and no image was generated during
this audit.

## Frozen bytes audited

| File | Rows | SHA-256 |
|---|---:|---|
| `armor_helms.tsv` | 50 | `71c97c81b85d24092cac3c4ab01c0c8ef475302cf9732f2568e62174cb207086` |
| `auxiliary.tsv` | 50 | `499d9302fe86fb9d94fd9ed4e9ead1539549a84c48cc95ed4c6c6957e9a75bf9` |
| `jewelry_relics.tsv` | 50 | `fcce1e7c78e71d3849b8fc225e292235a2ce1b8d08947057040557b89fa50cd2` |
| `offhands.tsv` | 50 | `3cca074fb0190703f30aae1244947b2365ca01bc64ff1854f9b382a88c28154a` |
| `weapons.tsv` | 50 | `e690ac53a0b8bef61fe682eb2091da3624f5137a53217cb31684af622cd8fe51` |
| `wearables.tsv` | 50 | `3c71f334b320939e49a2f2078f4f91c76dc01c0f4803c39defa81963d210914c` |
| `armor_helms-supply-map.tsv` | 63 | `d892cbc1b4813a95aeda8976630494b99678ac9b8e935565b31c5366f8eb7905` |
| `auxiliary-supply-map.tsv` | 16 | `dd462c7a595f7d1a19a9a9bbc6393611faeaa7d74ef145ec1a0ce49e7f2a68e3` |
| `jewelry_relics-supply-map.tsv` | 27 | `88a54c5c3e07f0862dc1d2a4bf373d521e42254ebcf2e5949b764735861c8aa4` |
| `offhands-supply-map.tsv` | 22 | `796effb3cdb4cb97932d12cc861ba4782d9265bd14d6aebc36f000200ec5fa02` |
| `weapons-supply-map.tsv` | 22 | `7696c3f42861a2106488fe3514b8cfe8a988b95755d758d5c32dd2f9e3397a33` |
| `wearables-supply-map.tsv` | 19 | `eba9cda1f3f6cb416d0c9ef251a332a8cd919b678476042d0ddc54c9a477e845` |

## Structural and roster gates

All pass:

- exactly 300 portfolio rows, split 50 rows per portfolio;
- exactly 60 rows at each tier;
- exactly 60 ladders;
- every ladder has five rows with tiers 1-5 and rungs 1-5;
- no duplicate art ID or display name;
- no art-ID or display-name collision with current `targets.tsv`;
- all 21 required production fields are populated;
- portfolio text is ASCII;
- canvas, grid width, and grid height agree;
- all runtime kinds use a footprint allowed by
  `INVENTORY-FOOTPRINTS.md`;
- the roster includes the required weapon, offhand, body, helm, handwear,
  footwear, belt, jewelry, relic, quiver, gorytos, war-call, warbanner,
  mobility, trap, attendant, reliquary, and preparation families.

The resulting action/state split is internally consistent:

| Action | Rows | Required QA state |
|---|---:|---|
| `generate_new` | 221 | `unreviewed` |
| `reference_only_generate` | 10 | `unreviewed` |
| `review_reuse` | 69 | `needs_user` |

No ungenerated row is marked `accepted`, and no reuse candidate can enter
automatic promotion.

## Supply and provenance gates

All pass:

- 169 unique source decisions;
- 86 calibrated balanced-batch outputs mapped exactly once;
- all 44 canonical post-calibration `promote` files mapped exactly once;
- all 169 mapped source paths resolve;
- every recorded non-`none` SHA-256 matches its current source file;
- 69 `assign_to_row` decisions map one-to-one to the 69 `review_reuse`
  portfolio rows, including source kind, filename, and hash;
- all ten `reference_only_generate` rows map by source hash to an explicit
  `reject_base_reuse` decision.

Decision totals:

| Decision | Rows |
|---|---:|
| `assign_to_row` | 69 |
| `reject_base_reuse` | 45 |
| `needs_user` | 33 |
| `alias_existing` | 22 |

The canonical 261-file post-calibration triage remains the exhaustive intake
record. The ready supply maps preserve every promoted candidate while keeping
ambiguous and rejected material out of automatic reuse.

## Previous blockers rechecked

All prior Measure-3 blockers are cleared:

1. **QA status semantics:** all new and negative-reference generations are
   `unreviewed`; only actual reuse decisions are `needs_user`.
2. **T5 weapon economy:** every weapon ladder now ends with raw dark skymetal
   in the load-bearing component while retaining an ancient silhouette and
   join thesis.
3. **Handwear construction:** soft-mitt rungs are materially continuous;
   rigid cesti are contiguous self-supporting shells over subordinate lining.
   The rejected pasted-plate sources are negative references only.
4. **Open-helmet silhouette:** the shallow broad-brim Attic rung and deep,
   leaf-cheeked, flared-nape Chalcidian rung now have a clear macro
   distinction.
5. **Full-cloak silhouette:** the symmetrical rectangular square-hem cloak
   and one-sided semicircular command drape now separate at 48 px.
6. **Prompt vocabulary:** generation descriptions contain no
   clasp/buckle/fastener/toggle construction prompts.
7. **Relic form:** the former flat chain-tablet concept is gone; the T5 relic
   is now a deep, riveted long-spout vessel with a three-dimensional
   silhouette.
8. **Mobility T5:** `mobility_riven_river_yoke` is a complete twin-hide-float
   load rig with an explicit ancient buoyancy anchor and a bounded skymetal
   structural extrapolation.

## Remaining user gate, not a blocker

The 69 `review_reuse` rows must remain excluded from automatic promotion until
the user reviews the actual source images. Any selected file must still pass
slot identity, period construction, alpha, framing, canvas, pair/completeness,
and 48 px readability QA.

The other 231 rows are structurally ready to enter the full-resolution
generation workflow under the runbook. Pixel-art variants remain downstream
of user approval and sorting of the full-resolution results.
