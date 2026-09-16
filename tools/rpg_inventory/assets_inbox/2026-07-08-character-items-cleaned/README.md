# 2026-07-08 Character Item Cleaned Batch

Cleaned outputs from `../2026-07-08-character-items-source/`.

Command used:

```sh
python tools/rpg_inventory/core/chroma_key.py \
  tools/rpg_inventory/assets_inbox/2026-07-08-character-items-source \
  --out tools/rpg_inventory/assets_inbox/2026-07-08-character-items-cleaned \
  --replace
```

Review files:

- `review.html`: source-vs-cleaned gallery for all 206 images.
- `review-seed.csv`: blank keep/discard/duplicate/replacement review sheet.
- `contact_sheet_cleaned_01.png` through `contact_sheet_cleaned_04.png`.
- `contact_sheet_compare_01.png` through `contact_sheet_compare_04.png`.

Status: cleaned candidates only. Do not promote directly into `assets/` until
the images are labeled for keep/discard/duplicate/replacement.
