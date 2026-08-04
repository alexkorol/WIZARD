# Expansion-ready historical/manufacturing final-freeze audit

Status: **PASS**. This is the authoritative hash-locked verdict for the current
six production manifests. It supersedes the earlier ready-freeze audit. No TSV
was edited, no reuse image was approved, and no image generation occurred.

## Scope and rules

The audit re-read all 300 rows and their 60 complete five-rung ladder contexts,
including the eight prior historical blockers and the final Measure-3 relic
replacement. It applies:

- the AD 600 ceiling and evidence rules in
  `ANCIENT-EQUIPMENT-TAXONOMY.md`;
- the T1-T5 progression in `BASE-DESIGN.md`;
- the source and sacred-object rules in `GENERATION-PLAN.md` and
  `external_reference_policy.json`;
- `historical_motif_library.json`,
  `manufacturing_anachronism_library.json`, and
  `item_failure_taxonomy.json`;
- every correction and failure pattern recorded in the earlier Measure-2
  audit.

Verdicts:

- **PASS**: clears this historical/manufacturing gate only.
- **REVISE**: viable row needing a bounded wording/construction correction.
- **HOLD**: historically plausible, but its ladder placement, evidence, or
  item-art prompt needs a deliberate decision.
- **REJECT**: repeats a hard failure or lacks a credible ancient construction
  path.

## Frozen hashes and tally

| Portfolio | Rows | SHA-256 |
|---|---:|---|
| `weapons.tsv` | 50 | `E690AC53A0B8BEF61FE682EB2091DA3624F5137A53217CB31684AF622CD8FE51` |
| `offhands.tsv` | 50 | `3CCA074FB0190703F30AAE1244947B2365CA01BC64FF1854F9B382A88C28154A` |
| `armor_helms.tsv` | 50 | `71C97C81B85D24092CAC3C4AB01C0C8EF475302CF9732F2568E62174CB207086` |
| `wearables.tsv` | 50 | `3C71F334B320939E49A2F2078F4F91C76DC01C0F4803C39DEFA81963D210914C` |
| `auxiliary.tsv` | 50 | `499D9302FE86FB9D94FD9ED4E9EAD1539549A84C48CC95ED4C6C6957E9A75BF9` |
| `jewelry_relics.tsv` | 50 | `FCCE1E7C78E71D3849B8FC225E292235A2CE1B8D08947057040557B89FA50CD2` |

Final tally: **300 PASS, 0 REVISE, 0 HOLD, 0 REJECT**.

The root structural validator passes independently:

- 300 ready rows;
- 60 ladders;
- exactly 60 rows at each tier;
- 44 promoted post-calibration sources;
- 86 mapped balanced outputs.

The semantic audit also passes.

## Final mobility replacement

`mobility_riven_river_yoke` is **PASS**. The Neo-Assyrian relief directly
anchors inflated whole-hide river floats. The row clearly labels its paired
float and load-yoke assembly as a T5 extrapolation rather than claiming that
the complete composite survives archaeologically.

Its construction is physically legible: two independently sealed organic
bladders supply buoyancy; a shallow, widely spaced raw-skymetal yoke spreads a
compact shelf load across them; broad fiber lashings secure the rigid
superstructure without piercing the buoyant bodies. Skymetal is confined to
the load-bearing upper frame, giving the rung a visible T5 progression without
asking the rare metal to float or form a flexible joint. The prompt contains no
body, hands, forearms, worn anatomy, modern valve, hinge, gear, or boat-hull
completion.

## Closed prior blockers

The previous eight exceptions are resolved:

- `wpn_rod_paddle_head` and `wpn_rod_horn_crowned` retain only generic
  construction geometry; exact sacred/regalia names and identities are omitted.
- `shield_shell_pelta` is now the non-celestial **Shell-Plate Pelta**.
- the unsupported T2-T5 mobility inventions were replaced with directly
  anchored head-loading, pendular-yoke, sarcina, and inflated-skin families.
  The final T5 composite now has an explicit, physically legible skymetal
  load-spreading frame and no anatomy instruction.
- `feet_meteor_cuff_footbags` keeps all rigid metal above the foot flex zone and
  uses complete Ötzi-derived soft-footwear construction, closing the armored
  instep failure.

## Final Measure-3 relic

`relic_skymetal_longspout` is **PASS** and macro-distinct from its T4 neighbor.
The T4 object is a shallow two-handled bowl with a short tubular spout and
protected amber grips. The T5 object is a deep globular vessel with one broad
basket handle and a long rising S-curved spout.

Metropolitan Museum object 47.32.1 directly documents the 9th-8th-century BCE
Iranian bronze form: hammered globular body, cylindrical neck, long S-spout,
basket handle attached by two rivets, and spout attached by a row of rivets.
The prompt preserves those visible joins, removes the source's figure plaque,
and translates the material to the project's T5 meteoric iron.

## Source/reuse distinction

Historical PASS does not promote mapped artwork. Rows marked `reject`,
`review`, `not_audited`, or `needs_user` retain those visual/source states.
They still require salvage review, roster dedupe, silhouette inspection, and
user approval. In particular, a rejected reference image may support a valid
new-generation concept without becoming reusable art.

## Freeze decision

These hashes clear the historical/manufacturing gate. This PASS does not bypass
roster dedupe, reuse-image review, silhouette QA, failure-taxonomy inspection
of generated outputs, or explicit user approval. No current row needs a
historical/manufacturing correction.
