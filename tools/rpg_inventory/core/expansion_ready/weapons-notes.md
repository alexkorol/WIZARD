# Production-ready weapons portfolio

No images were generated. This portfolio contains exactly 50 rows arranged as ten five-rung ladders: dagger, short blade, sword, axe/adze, club/mace, two-hand, spear/polearm, throwing, bow, and caster rod.

## Ladder and footprint decisions

- Every ladder has exactly one row at each tier and rung 1-5.
- Adjacent rows change their 48 px silhouette and mechanical thesis; repeated calibrated concepts are mapped as alternatives instead of becoming material-only rungs.
- All five heavy two-hand bases are portrait `2x4`.
- Long self bows are portrait `2x4`; the genuinely compact Achaemenid and Parthian composite bows are portrait `2x3`.
- Thick caster rods use the canonical portrait `1x3` held-focus footprint.
- The former fifth- to sixth-century francisca and angon names were removed. No ready row depends on an AD 600 boundary case or a player-facing medieval silhouette.

## Existing-supply comparison

The relevant supply was visually compared before assigning `generate_new`:

- all seven promoted post-calibration spears;
- both promoted post-calibration impact weapons;
- all 13 present calibrated weapon outputs: three short blades, two long swords, two axe/adzes, two impact weapons, two slings, and two spears.

The supply map records every one of those 22 sources exactly once. Near-duplicate calibrated outputs map to one structural base as `needs_user`; they do not create extra material rungs. The two studded wooden-club promotes remain user decisions because their silhouettes are strong but their visible metal-to-wood construction lacks a sufficiently direct ancient anchor.

Ten rows carry a primary `review_reuse` candidate in the ready manifest. `needs_user` means the file exists and has been visually triaged, not that it has passed final slot, alpha, historical-detail, or 48 px QA.

## Bow source decision

The bow ladder is source-driven and progresses structurally:

1. broad parallel-limbed Mesolithic Holmegaard flatbow;
2. long narrow Egyptian continuous-curve self bow;
3. tall Assyrian angular bow;
4. compact Achaemenid recurved bow with hooked nocks;
5. compact high-reflex Parthian horn-wood-sinew composite bow.

The two present `bow_gorytos` calibrated outputs were opened at full contact-sheet scale. Both are empty rigid quivers or arrow cases: neither has bow limbs, a bowstring, or a grip. They are therefore not weapon supply and must be mapped exactly once by the auxiliary portfolio:

- `C:\Users\Alex\Downloads\items_multi_context_balanced_v1\faction_dustwind - INT - tier 2\04__bow_gorytos.png`
- `C:\Users\Alex\Downloads\items_multi_context_balanced_v1\faction_north - DEX - tier 3\04__bow_gorytos.png`

## Caster-rod decision

The caster ladder uses thick, readable ancient hand implements rather than thin modern wand silhouettes:

1. natural forked hardwood rod;
2. broad curved hippopotamus-ivory ward;
3. broad plain paddle-head rod based only on Middle Kingdom wood geometry;
4. horn-crowned wood-and-bronze rod using only the source object's component geometry;
5. gold-sleeved Achaemenid iron rod.

The historical objects establish form and construction only. Sacred and regalia identities are excluded from player-facing IDs, names, and prompts. The game treatment should keep surfaces mostly plain and omit readable sacred inscriptions, copied divine imagery, burial damage, and modern precision hardware.

## T5 material consistency

Every T5 weapon ladder now uses raw dark skymetal for its load-bearing endgame element while retaining the ancient source silhouette and join logic:

- the Steppe dagger uses a skymetal blade and integral openwork hilt;
- the sagaris and hammer-pick use compact socketed skymetal heads on hardwood hafts;
- the ge staff uses skymetal side blade, forward point, and common mounting on a hardwood shaft;
- the trident and barbed dart use skymetal heads on bounded organic shafts;
- the reflex bow uses skymetal compression laths bound to a sinew-backed hardwood core with horn ears;
- the Oxus rod uses a furrowed skymetal core with only a bounded horn grip inset.

Ordinary iron, bronze, and gold remain historical geometry references only and are not the dominant T5 material thesis.

## Production gate

Before any generation:

1. Alex resolves every `needs_user` source choice.
2. Reused files pass full-resolution construction, framing, alpha, and 48 px tests.
3. Newly generated long weapons show the complete object tip-to-butt.
4. Bows remain one complete bow only, with no arrows, quiver, hands, or figure.
5. Caster rods remain thick single held objects, not staffs, scepters copied with inscriptions, or bundles.
6. Pixel-art variants remain downstream of approval and sorting of full-resolution art.
