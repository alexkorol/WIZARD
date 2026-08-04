# Armor, helms, and outer layers: release-ready portfolio

This portfolio contains exactly 50 art bases in ten five-rung ladders:

- Four body ladders: `body_corselet`, `body_cuirass`, `body_lamellar`, and `body_splint`.
- Four protective-helm ladders: `helmet_light`, `helmet_open`, `helmet_ridged`, and `helmet_neckguard`.
- Two continuous outer-layer ladders: `outer_full` and `outer_short`.

The prior `body_banded` and `helmet_segmented` draft ladders were removed to make room for ten outer layers. This also removes the early-medieval-feeling segmented-helm naming and silhouette, including `Gilded Field Spangenhelm`.

## Ladder and footprint rules

Every ladder has one row at each tier:

1. organic or simple construction;
2. copper or early worked-metal construction;
3. mature bronze martial construction;
4. exotic, ritual, or command-grade construction;
5. raw dark skymetal translated through an ancient load path.

All body art uses portrait `2x3`; all helmet art uses square `2x2`. Outer layers use portrait `2x3` for short or knee-length forms and `2x4` only for long command cloaks. Body descriptions exclude belts, skirts, pteruges, lower garments, mannequins, and detached fantasy shoulders. Helmet descriptions exclude heads, mail, modern fasteners, and later nasal or articulated forms.

## Outer-layer correction

The outer portfolio is deliberately built around uninterrupted cloth, hide, or pelt fields. It rejects:

- shingled scale imitation;
- repeated dangling tabs or separate panels;
- harness-like closures;
- costume chains, heavy tassels, and modern tailored seams;
- hoods whose silhouette reads later than the ancient target.

The seven present calibrated outer outputs were all accounted for. Two broad continuous outputs are assigned to release rows; the five shingled outputs are explicitly rejected for base reuse. The useful post-calibration mantle, pelt, cowl, and wrap candidates are assigned or aliased. Border, tassel, and chain-adjacent candidates remain `needs_user` or are rejected as recorded in the supply map.

## Adjacent-rung separation

Two material-only helmet adjacencies were corrected:

- `Copper Crest-Track Cap` is a tall one-ridge cap without cheek guards, clearly distinct from the T3 twin-ridge Illyrian helm.
- `Copper Flared Cap` is a low shallow bowl with a broad rear lip and no cheek guards, clearly distinct from the deeper knobbed T3 Montefortino helm.

`Copper Point Helm` reuses the calibrated ancient pointed-sheet candidate and remains distinct from the hemispherical T5 skymetal bowl. `Hide Point Cap` gives the ridged ladder an organic two-half construction rather than another woven dome.

## Supply accounting

`armor_helms-supply-map.tsv` records each relevant source exactly once:

- all 17 present calibrated body outputs;
- all 7 present calibrated head outputs;
- all 7 present calibrated outer outputs;
- all 32 body, helmet, and outer candidates marked `promote` or `review` in the post-calibration triage.

Assignments are intentionally conservative. Compact backed scale or lamellar bodies, four promoted helmet bases, two continuous calibrated mantles, and the strongest post-calibration outer fields are routed to rows. Redundant usable images are aliases. Skirted bodies, harness contamination, overbuilt segmented helms, pasted ornament, and shingled cloaks are rejected rather than allowed to distort the ladder.

All reused art remains `needs_user`: a roster assignment is not final visual approval. No generation, staging, shared-manifest edit, runtime wiring, or pixel conversion was performed. Pixel variants remain downstream of user approval and sorting.
