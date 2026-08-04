# Expansion manifest schema

This is the release schema for the additive 300-row Verdigris base roster.
Candidate drafts remain in `core/expansion_drafts/`; production-ready portfolio
files are written to `core/expansion_ready/`.

## Roster invariant

- Six portfolio files, exactly 50 rows each.
- Every portfolio contains exactly ten `ladder_id` values.
- Every ladder contains exactly five rows, with `rung` 1-5 and matching
  `tier` 1-5.
- Adjacent rungs must have a different 48 px silhouette or mechanical thesis.
  Material-only reskins are aliases or are replaced.
- The combined manifest therefore has 60 named five-rung ladders and exactly
  60 rows at each tier.

## Columns

The release columns, in order, are:

```text
art_id
class
tier
display_name
canvas
grid_w
grid_h
desc
historical_anchor
source_url
action
source_kind
source_path
source_sha256
source_verdict
overlap_key
qa_status
ladder_id
rung
runtime_kind
mechanical_identity
```

### Action and source fields

`action` is one of:

- `generate_new`
- `review_reuse`
- `alias_existing`
- `reference_only_generate`
- `hold_redesign`
- `retire`

`source_kind` is one of:

- `none`
- `post_calib`
- `balanced_output`
- `existing_target`

Rules:

- `source_path` is an exact filename or path, never a numeric index.
- `source_sha256` is mandatory for `post_calib`.
- `source_verdict` is `promote`, `review`, `reject`, or `not_audited`.
- A rejected source can only support `reference_only_generate`, never reuse.
- `overlap_key` names the existing art ID or calibrated manifest/output row;
  use `none` when there is no overlap.
- `qa_status` is `unreviewed`, `accepted`, `rejected`, or `needs_user`.
- `generate_new` is allowed only after the relevant existing and downloaded
  supply has been visually compared.

### Ladder and runtime fields

- `ladder_id` is stable lowercase ASCII snake case.
- `rung` is an integer 1-5 and equals `tier`.
- `runtime_kind` uses the inventory/runtime family, not a granular historical
  taxonomy label.
- `mechanical_identity` is a short ASCII phrase describing why this base is
  mechanically distinct from its adjacent rungs.

## Supply mapping

Each portfolio also writes a `*-supply-map.tsv` with:

```text
source_kind
source_path
source_sha256
source_class
decision
assigned_art_id
reason
```

`decision` is one of:

- `assign_to_row`
- `alias_existing`
- `reject_base_reuse`
- `needs_user`

Across all six maps:

- every one of the 44 `promote` rows in
  `expansion_drafts/post-calib-triage.tsv` appears exactly once;
- every one of the 86 present outputs from
  `items_multi_context_balanced_v1/balanced_item_manifest.tsv` appears exactly
  once;
- rejected or reference-only downloads are not promoted accidentally.

## Canonical grid/canvas reminders

- belts: `2x1`, landscape;
- body armor: `2x3`, portrait;
- heavy/two-hand weapons: `2x4`, portrait;
- full shields: `2x3` or `2x4`, portrait; compact shields/bucklers: `2x2`,
  square;
- helmets, gloves, boots, mobility rigs, trap kits: `2x2`, square;
- rings and amulets: `1x1`, square;
- long held foci: `1x3`; broad foci: `2x2`;
- warbanners: `2x4` or narrow `1x4`;
- preparation *contents*: `1x1`; complete preparation kits: `2x2`.

Use `INVENTORY-FOOTPRINTS.md` for the complete mapping.
