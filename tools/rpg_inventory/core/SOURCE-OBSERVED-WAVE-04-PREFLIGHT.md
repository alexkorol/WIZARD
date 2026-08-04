# Source-Observed Wave 04 — Preflight

Status: **READY; generation has not started**

This is a six-call controlled wave. Every candidate passed both gates:

1. a reviewed local image of a specific historical object or credible reconstruction controls its construction; and
2. the object earns a distinct PoE1/D2-style inventory role and ladder rung.

Mock-character equipment is not an extraction checklist. Incidental clothing, costume clutter, weak props, novelties, and prior-art duplicates were excluded even when visible in a reference.

## Locked calls

| # | Art ID | Inventory role | Canvas / grid | Authoritative visual evidence | Construction locks | Principal reject conditions |
|---|---|---|---|---|---|---|
| 1 | `wpn_axe_abydos_adze` | one-hand adze/axe base | P / 1×2 | British Museum EA30079 blade; Met 568261 complete Egyptian assembly; reviewed Pinterest image only as secondary assembly support | BM blade geometry; bent wooden haft and leather binding from the complete reconstruction | modern axe head, straight machine haft, socketed metal head, polished prestige fittings, fused blade/wood |
| 2 | `wpn_bow_holmegaard_flat` | heavy primitive bow base | P / 2×4 | National Museum of Denmark Holmegaard IV bow; Musée de l’Archerie reproduction | deep narrow rigid grip, broad flat elm limbs, continuous taper, tiny shoulder nocks | generic narrow longbow, reflex fantasy bow, metal fittings, shortened/cropped limbs, duplicate of Bound Long Self Bow |
| 3 | `focus_copper_ladle` | handled ritual/offhand focus | S / 2×2 | British Museum N.120 Neo-Assyrian ladle | deep hemispherical bowl, short open trough spout, high returning flat strap handle, restrained moulded ribs | kitchen spoon, ewer, long-handled dipper, gold/brass finish, ornate palace prop, wrong 1×3 framing |
| 4 | `relic_stone_pyxis` | compact relic container | S / 1×1 | Getty 88.AA.83 Early Cycladic marble pyxis | squat thick stone cylinder, recessed lid seat, two compact pierced lugs; conservative plain fitted disc lid restoration | open bowl, feet, pedestal, knob, hinge, latch, large carry handles, spiral copy, ornate reliquary |
| 5 | `amulet_calcite_drop` | amulet base | S / 1×1 | British Museum EA32123 calcite vase amulet, rightmost pale object | small pale vessel/drop body, horizontal bore, complete thin bast/flax cord loop | cropped cord ends, metal collars, gemstone setting, chain, oversized neckpiece, floating anatomy-dependent cord |
| 6 | `shield_bronze_yetholm` | full bronze shield base | P / 2×3 | British Museum 1873,0210.2 Rhyd-y-Gorse Yetholm shield | front fighting face, about twenty concentric ribs alternating with fields of tiny punched bosses | large holes, lacing, front straps, few broad rings, sun emblem, fantasy boss, archaeological corrosion |

## Source precedence

- Museum/catalogue objects control silhouette, proportions, joins, and material.
- The Met complete adze controls only the missing haft-and-binding assembly; the British Museum blade remains primary.
- The reviewed Pinterest adze image is bounded secondary evidence. It cannot add ornament, material, or manufacturing detail.
- Archaeological damage, corrosion, burial stain, missing parts, captions, display hardware, and photography backgrounds are not copied.

## Shared art and process locks

- Use the verbatim prompt files produced by `build_source_observed_wave_04.py`; agents may not rewrite or embellish them.
- One built-in image-generation call per item, in six parallel agents.
- Flat project chroma background, complete object, correct aspect ratio and grid occupancy, ARPG inventory-icon presentation.
- Paleolithic-to-ancient workshop logic only. No medieval styling, modern machining, perfect industrial repetition, fantasy filigree, or unobserved prestige metal garnish.
- No same-wave rerolls. Raw outputs are preserved. Numeric QA and direct source comparison happen before any promotion.
- Only strict accepts are keyed to alpha and counted. Holds and rejects stay uncounted.
- Pixel-art variants remain deferred until user curation of the high-resolution roster.

## Explicit exclusions from this wave

- `outer_full_sagum`: exact prior art already exists; salvage/review only, no regeneration.
- `ring_bone_plain`: exact prior art already exists; source and baked-background review required, no regeneration.
- `focus_copper_bell`: duplicate/redundant.
- `wpn_club_cypriot_finned`: source identity unresolved.
- `focus_bronze_handseal`: source mismatch.
- `focus_copper_sistrum`: existing Wave 03 output is on hold for incorrect golden/brass material read.

