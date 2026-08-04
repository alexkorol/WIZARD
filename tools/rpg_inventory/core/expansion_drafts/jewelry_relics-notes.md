# Jewelry / relic expansion notes

## Portfolio shape

- 50 gap candidates: 15 compact finger rings, 15 pendant-first amulets, and 20 relic curios.
- Exactly 10 candidates per tier. Rings and amulets are always `1x1`; compact relics are `1x1`; substantial bowls, coffers, books, lamps, bells, and vessels are `2x2`.
- This is an ARPG base economy, not a material-swap grid. Adjacent rungs change silhouette and construction. The relic pool deliberately rotates tusk tokens, pyxides, ampullae, bowls, ewers, censers, mirrors, bells, cistae, braziers, and keys.
- The 400-row `items_multi_context_balanced_v1` manifest was searched before drafting. Its broad repeated `ritual` prompts were treated as occupied generic territory; these rows target named, structurally explicit gaps.
- Historical sources control form and construction only. All descriptions require active-service surfaces and suppress copied script, sacred imagery, solar/radial motifs, shrine miniatures, generic crystals, and archaeological corrosion.

## Intake triage: sorted indices 174..216

Sorted by case-sensitive filename under `C:\Users\Alex\Downloads\items_post_calib_batch`.

### Direct-use jewelry candidates

- `178`: broad bronze chevron band. Strong compact ring read and clean silhouette; usable after normal QA. Portfolio adapts it as `ring_bronze_v` but removes motif dependence.
- `199`: broad bronze band with a raised interlaced panel. Strong high-tier ring icon; usable if the dense surface detail still reads at final inventory scale.
- `208`: broad bronze geometric band. Strong compact ring silhouette; usable, with its ornament treated as one bounded field rather than a ladder-wide motif.
- `215`: bronze signet with rectangular blue inset. Strong high-tier signet read; usable if the blue inset is retained as material-local glass/stone rather than glow.

### Structural salvage only

- `183`: mounted tusk pendant has an excellent full neck loop and tooth scale, but the attached radial disc is a hard solar failure. Do not use directly; salvage only the mounted-tusk construction.
- `195`: central tusk necklace has good pendant-first mass, but the two shell danglies and extra costume beads violate the anti-charm rule. Re-prompt as one central tusk or keep out of the direct-use pool.

### Jewelry rejects

- `188`: signet face is a radial snowflake/starburst; hard solar-symbol failure.
- `203`: large ring pendant with a second dangling ball charm; exactly the forbidden dangling-ring-charm silhouette.
- `213`: round blue-and-bronze medallion is dominated by radial spokes and a sun-like central boss; hard solar failure.

### Outside this portfolio

- `174` tunic/body; `175` harness; `176` sandals; `177` belt; `179` gloves; `180` spear; `181` shield; `182` hood; `184` coat/body.
- `185` crossing harness; `186` belt; `187` boots; `189` slippers; `190` forearm/hand protection; `191` slingshot; `192` boots; `193` slingshot; `194` belt; `196` woven body armor; `197` shoulder/body armor; `198` utility belt; `200` gloves.
- `201` shield; `202` belt; `204` body armor; `205` hood/outer layer; `206` belt; `207` sandals; `209` gloves; `210` spear; `211` shield; `212` helmet; `214` body armor; `216` belt.

No substantial relic vessel, casket, lamp, bowl, book, or reliquary in indices `174..216` passed the portfolio silhouette gate. The intake contributes four direct-use ring candidates and two amulet construction leads, but no direct-use relic curio.

## Generation handoff

- No images were generated in this phase.
- Generate only after roster and historical QA, then user sorting/approval.
- Pixel-art variants remain a later pass from approved full-resolution finals, not parallel first-pass generations.
