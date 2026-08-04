# Post-calibration intake triage

Canonical read-only audit of:

`C:\Users\Alex\Downloads\items_post_calib_batch`

No source file was moved, copied, renamed, deleted, matted, or generated.
`post-calib-triage.tsv` is the authoritative per-file record.

## Result

| Verdict | Count | Meaning |
|---|---:|---|
| `promote` | 44 | Strong direct-salvage candidate. It still needs the normal original-resolution QA, matte/chroma, grid crop, dedupe, and runtime review before any copy into the project. |
| `review` | 71 | Potentially useful, usually as a high-tier/unique or structural reference, but chronology, manufacturing, motif, join logic, or slot identity is not safe enough for automatic promotion. |
| `reject` | 146 | Do not use as production item art. |
| **Total** | **261** | Every source file has one verdict. |

The 44 direct-salvage candidates are distributed as follows:

| Slot guess | Count |
|---|---:|
| spear | 7 |
| ring | 6 |
| gloves / forearm defense | 5 |
| amulet | 4 |
| helmet | 4 |
| shield | 4 |
| body armor | 3 |
| boots | 2 |
| impact weapon | 2 |
| outer layer | 2 |
| belt | 1 |
| belt or sash | 1 |
| outer layer or cowl | 1 |
| ritual or preparation implement | 1 |
| war-call | 1 |

This batch does **not** provide a safe direct-promotion quiver, warbanner,
mobility rig, trap kit, Attendant focus, or full preparation case. Those remain
real generation gaps. The apparent quiver contains arrows and is rejected under
the current empty-container rule. The apparent case is modern luggage-like, and
the loose tool bundle lacks a complete secured kit body.

## Deterministic identity

Files were enumerated with Python:

```python
sorted(
    (p for p in source.iterdir() if p.is_file()),
    key=lambda p: p.name,
)
```

This is a case-sensitive lexical filename ordering. Indices are zero-based.
Every row also records the exact filename and SHA-256, which are the durable
identifiers. The audit contains 261 unique filenames, 261 unique SHA-256 values,
and 44 unique proposed art IDs.

Numeric indices in portfolio notes are not safe join keys by themselves. One
portfolio explicitly used case-insensitive sorting, and at least one other
portfolio's assigned range does not align with the canonical case-sensitive
sequence. Exact filename and SHA-256 therefore override all range-local index
references.

## Three-gate method

Each image was checked on the full 261-image labeled survey and direct-salvage
candidates were checked again on larger candidate sheets.

1. **Roster and slot gate:** one isolated object or required pair; clear
   inventory identity; useful ARPG silhouette; no contact sheet, anatomy, mixed
   outfit, or ambiguous weak prop.
2. **Historical and mechanical gate:** Paleolithic-to-ancient construction;
   coherent material hierarchy, join logic, backing, overlap, and structural
   continuity; no medieval silhouette or modern manufacturing completion.
3. **Project-risk gate:** no solar/radial fallback, shingled outerwear,
   overmatched costume clutter, modern footwear or five-finger glove pattern,
   visible quiver ammunition, broken sling grammar, or grid/canvas mismatch.

`promote` is intentionally conservative. Attractive images that are too ornate,
too regular, over-finished, or close to the AD 600 ceiling remain `review`.
Examples include the cataphract-like torso, metal-banded helmet, dense plaque
belts, cross-strapped tall shield, and decorated polearm.

## Portfolio-note reconciliation

- **Weapons:** the case-sensitive 0-42 pass was compared row by row. Its clean
  primitive club and several cross-slot wearables survive. Its wicker shield
  remains rejected because the project history already retired that toy-like
  read. The metal-banded helmet was downgraded to `review` after the larger
  candidate pass.
- **Offhands:** this note explicitly used case-insensitive sorting, so its
  numeric indices were not imported. Exact filenames and visual descriptions
  were reconciled instead. Ornate lapis shields remain `review`, not ordinary
  base promotions.
- **Armor and helms:** the short dark scale torso remains `review`, not direct
  promotion, because shoulder massing and regular plate density could read
  medieval. The long cataphract panoply remains reference-only `review`.
- **Wearables:** its useful belt/bracer/footwear observations were retained as
  concept evidence, but direct verdicts were reassessed against the stricter
  manufacturing library. Solar-roundel bracers and developed lasted footwear
  are rejected; standardized metal-buckle belts remain `review`.
- **Auxiliary:** its case-sensitive 217-260 observations were retained. No file
  in that slice becomes an auxiliary promotion. The clean spear at 217 is a
  cross-slot weapon promotion; the heavier shield and decorated polearm remain
  review candidates. Gothic lanterns, fantasy cage-rattles, and the contact
  sheet remain rejected.
- **Jewelry and relics:** all amulets, rings, collars, and relic-like props were
  independently classified in the canonical table. Radial/solar faces, gorgets,
  excessive danglers, and fantasy cabochon cages were rejected or held for
  review rather than accepted because they are isolated and attractive.

## Required next action

Do not copy all 44 candidates automatically. Present the `promote` group as a
review sheet, then process only approved files through the normal project QA and
matte/composition pipeline. The 71 `review` rows are a separate optional sheet;
they must not silently become roster coverage.
