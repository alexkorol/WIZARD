# Auxiliary expansion draft notes

## Portfolio shape

Exactly 50 bases are drafted as ten complete five-rung ladders:

- 5 standalone quivers
- 5 empty standalone gorytoi
- 5 war-calls
- 5 full-length warbanners/standards
- 5 Quick Rigs
- 5 trap kits
- 5 preparation kits
- 5 Attendant foci
- 5 reliquaries
- 5 Spoils

This is intended as a real PoE1/D2-style base economy. Every adjacent rung changes its macro silhouette or construction, not only its material. Grid footprints follow `INVENTORY-FOOTPRINTS.md`: quivers/gorytoi are 2x3; compact war-calls are 2x2; the straight Etruscan trumpet is 1x3; all full-length warbanners are 2x4 except genuinely narrow finial poles at 1x4; Quick Rigs, trap rigs, and Attendants are 2x2; compact pack contents are 1x1; and the long red-deer antler stock is 2x1. No 3x3 auxiliary footprint remains.

Quiver and gorytos art is isolation-safe: every description requires an empty standalone container and explicitly excludes bows, bow limbs, bowstrings, arrows, and loose missiles. Warbanners stay compact and non-weapon-length. Quick Rigs always preserve the backboard/frame, shoulder harness, and flank straps; none may read as a handbag, satchel, briefcase, suitcase, or handled box.

## Intake triage: sorted indices 217-260

The range was reviewed visually using case-sensitive filename sorting, matching the assigned indices.

- `217`, `227`, `237`: long spears/polearms; attractive but outside this portfolio and not reusable as quiver/standard art.
- `218`, `248`: shields; outside this portfolio.
- `219`, `223`, `233`, `242`, `243`, `253`, `257`, `258`: belts. Several are strong isolated icons, but most use medieval plate language, solar/radial bosses, dangling clutter, or costume-sash proportions. Route any survivors to belt review, not auxiliary.
- `220`, `230`, `240`: amulets; isolated and potentially salvageable for jewellery review, but the radial/solar center treatment conflicts with the current motif ban.
- `221`, `231`, `241`, `251`, `252`: body/shoulder armor; mostly late-medieval/fantasy plate or costume silhouettes and outside this portfolio.
- `222`: broad collar/gorget; outside this portfolio and too costume-like for a compact amulet.
- `224`, `235`, `245`, `254`: rings; isolated but all repeat large radial or gem-centered fantasy bezels. Route to jewellery review only after motif screening.
- `225`, `236`, `246`, `255`, `260`: handwear; mostly plate gauntlets with medieval/fantasy articulation. Outside this portfolio.
- `226`, `234`, `244`, `256`: footwear; outside this portfolio and several use modern/medieval stitched boot construction.
- `232`: fur mantle; potentially useful for outer-layer review, but not auxiliary.
- `238`: dagger; outside this portfolio.
- `239`, `249`: helmets; `249` is an explicit castle-turret/medieval fantasy failure.
- `247`: spiked black club; medieval/fantasy failure and outside this portfolio.
- `228`: oversized jeweled cage-mace/rattle. Rejected for auxiliary use: dangling charm clutter, repeated amber cabochons, overbuilt medieval-fantasy metalwork, and no clean ancient instrument silhouette.
- `250`: Gothic cage pendant/lantern. Rejected as Attendant source: pointed Gothic tracery, modern-fantasy cage construction, and long loose neck cord. The replacement Attendant uses an asymmetric rectangular three-cup lamp rack anchored to Byzantine polycandelon construction, with no radial wheel silhouette.
- `259`: contact-sheet collage rather than one isolated deliverable; reject for direct staging.

Result: no image in 217-260 is directly promoted into this auxiliary draft. This is not a claim that the whole intake batch is unusable; many images in the slice belong to other paperdoll classes, and those should be evaluated by their owning portfolios.

## Calibrated 400-row manifest dedupe

The draft was also compared with `items_multi_context_balanced_v1/balanced_item_manifest.tsv` and its existing output paths. That calibrated manifest already plans 44 `carry`, 40 `ritual`, 40 `signal`, and 5 `bow_gorytos` rows. Its repeated prompt families cover:

- 9 rigid gorytos-derived quiver/arrow cases
- 9 Urartian-style bronze-sheet cylindrical quivers
- 5 additional `bow_gorytos` cases
- 9 pyxis/scroll/divided preparation cases
- 9 pannier/basket/tool-roll carriers
- 9 fire/fletching/medical rolls
- 9 compact trumpets or curved horns
- 9 hand bells or rattles
- 7 handled bell/sistrum/standard-head prompts
- 8 Luristan-style finial/yoke prompts
- 7 spindle/whorl/mirror prompts
- 7 censer/lamp/offering-vessel/pyxis prompts

Accordingly, this TSV is a **base-ladder gap and alias pool**, not an instruction to generate all 50 blindly.

Generation/mapping order:

1. **Map before generating:** all ten quiver/gorytos rows, the generic horn/drum/sistrum calls, the pigment/medical-roll preparations, and the pyxis/censer reliquaries. Existing calibrated outputs should be visually reviewed and renamed into these bases when their silhouette and tier fit. Do not regenerate merely to match the draft name.
2. **High-confidence gaps:** all five complete wearable Quick Rigs (the calibrated carry prompts do not require a backboard plus shoulder harness), all five trap kits, all five species- or material-specific raw Spoils, all five overtly magical Attendants, and all five complete full-length warbanners. These are structurally absent from the repeated calibrated prompt families.
3. **Conditional gaps after visual review:** the straight Etruscan war trumpet, full braced cornu, and any reliquary or preparation rung whose exact assembly is not present among usable calibrated outputs.

The existing output paths establish possible supply, not automatic acceptance. Each candidate still needs normal visual QA for one isolated object, pre-ancient construction, no modern hardware, no medieval silhouette, no solar fallback, and the correct no-bow/no-arrow isolation rule. This dedupe must happen before any generation call.

## Historical-source policy

The `source_url` values prioritize museum object records and museum archaeological publications. A few perishable systems (back frames, snares, and deadfall triggers) do not survive as complete ancient objects. Those rows are labeled as conservative reconstructions or lore extrapolations and use archaeological component evidence; the modern ethnographic snare record is cited only for mechanical silhouette and is explicitly not back-dated.

Attendants are the sole overtly magical lane. Their magic changes suspension and motion, while the underlying vessel, bell, spindle, cage, mirror, or asymmetric lamp-rack construction remains historically legible. Spoils remain raw crafting stock; each organic Spoil now names a source species, and the T5 rung is raw iron meteorite rather than T4 obsidian.

## Historical QA correction pass

All auxiliary `REVISE` and `HOLD` findings in `qa-historical.md` were resolved without changing the 50-row count:

- Renamed the material-confused `Shell War Horn` to `Cattle War Horn` and kept its carry loop tight and secondary.
- Replaced the hooked lituus row with a directly anchored straight Etruscan trumpet at 1x3.
- Reduced the braced cornu from the invalid 3x3 footprint to the canonical compact 2x2.
- Rebuilt every warbanner footprint to 2x4 or narrow 1x4. The T1 antler-fork pole is explicitly labeled a lore-archaic faction invention with a perforated-antler load-path anchor; the T2 hide crossbar standard now specifies the seated-and-lashed crossbar and pierced panel, anchored to the documented Roman vexillum depiction.
- Replaced speculative sling-bullet trap weights and bronze trigger tongues with pierced fired-clay weights and notched hardwood components.
- Removed the celestial `Moon-Groove` name from the documented two-piece cosmetic grinder.
- Replaced the hard-fail radial lamp wheel with an asymmetric rectangular three-cup lamp rack.
- Changed the full greenstone ampulla to a direct clay ampulla body with one protected non-structural jade inset and corrected it to a 1x1 relic footprint.
- Replaced generic Spoils with an aurochs bone blank, wild-boar tusk packet, Nile-crocodile scute patch, and red-deer antler stock. The antler row is directly anchored to Late Bronze Age red-deer working waste from Runnymede Bridge. The former T5 obsidian nodule is now a raw iron-meteorite nodule with a Natural History Museum specimen anchor.
