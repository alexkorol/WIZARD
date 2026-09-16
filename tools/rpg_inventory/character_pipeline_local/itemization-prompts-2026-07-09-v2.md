# Itemization Prompts - 2026-07-09 v2

These are local working prompts for manual image-2 itemization calibration.
They are intentionally kept under `character_pipeline_local/`.

Primary corrections from the previous itemizing prompts:

- hard separate-file output rule: no sheet, no collage, no contact sheet
- fallback rule: if separate files cannot be generated, generate slot 1 only
- motif budget: do not repeat the same central gem, blue stone, boss, medallion,
  face, sun, eye, wheel, or emblem across every slot
- coordinated set means shared construction/material logic, not matching
  centerpieces

## Prompt 1 - Full 10-Slot Extraction, Separate Files, Motif Budget

```text
Generate 10 images. No commentary.

Use the attached character image as the authoritative equipment source. Do not redesign the character. Do not make a paperdoll UI. Do not make a collage. Do not make a contact sheet. Extract the visible worn and carried gear into separate ARPG inventory item icons.

OUTPUT FILE RULE - VERY IMPORTANT
This request has 10 deliverables. Each deliverable must be its own separate independent image file. Do not put multiple items into the same image. Do not create a sheet, grid, contact sheet, lineup, paperdoll, inventory board, comparison image, or collage. If you cannot generate 10 separate independent image files, generate only deliverable 1, the main hand weapon, as a single isolated item image instead of making a sheet.

ANATOMY FIREWALL - FIRST PASS
Every item study is an object only. No toes, feet, heels, ankles, legs, thighs, hips, belly, tummy, abdomen, midriff, navel, waist flesh, torso flesh, arms, hands, fingers, neck, head, face, ears, scalp, hair, braids, locs, or skin. Do not copy anatomy with worn gear. Do not use a body part, invisible mannequin, flesh-colored filler, or hairstyle as an equipment stand. If an item cannot be separated without anatomy, omit it and choose another item.

Create exactly one separate image for each slot:

1. Main hand weapon
2. Off hand shield, focus, ritual tool, or secondary weapon
3. Helmet, cap, crown, hood, or headgear
4. Amulet or pendant
5. Body armor plus only clearly visible source lower-body components: skirt, kilt, robe hem, faulds, tassets, cuisses, greaves, or actual pants/leggings
6. Cloak, shawl, scarf, mantle, veil, hooded outer layer, or shoulder wrap
7. Belt, girdle, sash, or waist piece
8. One ring or compact finger ornament
9. Hands: gloves, bracers, vambraces, wrist wraps, or hand protection
10. Footwear: boots, sandals, shoes, or anklets; greaves stay with body armor

SOURCE AUTHORITY RULE
Use the source image's actual equipment language: material logic, construction methods, proportions, ornament density, color family, wear level, silhouette, and craftsmanship. If a slot is partly hidden, extrapolate only from the same coherent kit. Do not invent a different faction, different tier, different technology level, or unrelated fantasy style.

UNISEX EQUIPMENT RULE
All equipment bases are unisex. If the source image shows both male and female versions, infer the same item base for both: same coverage level, same protection level, same material system, same construction logic, same slot identity. Body fit may vary, but do not make one version revealing and the other covered.

MOTIF BUDGET RULE - VERY IMPORTANT
The extracted set should be coordinated, not overmatched. The items may share materials, craft quality, edge language, construction methods, and faction identity, but they must not all repeat the same centerpiece.

Do not put a central round blue stone, central gem, circular boss, eye, sun mark, wheel mark, face, medallion, disk, or emblem on every item. Strong focal motifs are allowed on at most one or two items total. The other items should coordinate through different features: silhouette, plate layout, edge profile, grip wrap, woven pattern, stitched seam, carved rim, scale arrangement, shell edge, hammered texture, material contrast, or strap geometry.

If the source character has one strong blue stone or central medallion, preserve it on the most appropriate single item, such as the amulet, focus, shield boss, or belt center. Do not copy it onto the weapon, helmet, armor, cloak, ring, gloves, and boots.

SIDE-LAID REFERENCE RULE
If the source image has a weapon or shield laid beside the character, treat that side-laid object as the authoritative reference for that slot. Preserve its full silhouette, length, proportions, head-to-shaft ratio, shield outline, material construction, and visible details. Do not shorten long weapons into clubs or wands. Do not crop tips or butts.

SLOT RULES
Rings are compact finger objects: band, signet, coil, socket ring, or seal ring. No dangling charms, chains, tassels, bells, chimes, or hanging ornaments.

Amulet is a pendant-first object on cord, twine, leather string, or simple chain. The pendant should take most of the image. Do not render a gorget, collar, choker plate, throat armor, or neck guard.

Body armor begins with the torso armor. Include only lower-body components clearly visible in the source: skirt, kilt, robe hem, faulds, tassets, cuisses, greaves, or actual pants/leggings. Most armor studies should not contain pants or leggings. Never invent an underlayer, undersuit, trousers, leggings, or bodysuit to connect pieces, cover empty space, or complete the silhouette. Render it ungirdled and beltless. Do not include a gorget, necklace, collar, belt, sash, scarf, mantle, or cloak.

Arrange only the observed armor components as one empty exploded gear composition with small clean gaps: torso armor above; a lower garment below only if clearly present; and empty paired greaves below or beside it only if clearly present. Do not fill absent gaps with invented pants. Do not put the assembly on a body or invisible mannequin. Body armor ends at the greaves/ankle and must not include boots, shoes, sandals, soles, toe boxes, feet, or skin. Greaves are empty shin shells with no boots or legs inside.

Belt is a genuine narrow horizontal waist item for a landscape slot. Do not turn it into a skirt, pants, leggings, apron, tassets, faulds, cuisses, greaves, robe hem, or hanging costume panel. Those belong in the body-armor image.

Belt geometry is mandatory for the shallow 2:1 game slot. Its visible silhouette must be at least twice as wide as it is tall, laid straight or in one shallow arc with the band dominant. Remove, tuck behind the band, or omit long tassels, fringe, sash tails, hanging cords, straps, chains, pouches, apron panels, tassets, streamers, and vertical rigging. If it cannot remain recognizable as a clean 2:1 band, omit it and select another item.

Shield shows the front fighting face only. No backside, clamshell opening, front straps, dangling front hardware, handle loops, or utility rigging.

Cloak, shawl, scarf, mantle, veil, or outer layer should be a wearable outer-layer item separated from the armor. It should be substantial, readable, and cutout-friendly. Avoid excessive shredded fringe, transparent gauze clouds, and rag chaos.

Hands and footwear must render as paired items in one icon. No arms, legs, hands, feet, toes, or mannequin body parts.

Anatomy is zero tolerance in every item image: no hands, fingers, arms, shoulders, legs, knees, ankles, feet, heels, toes, head, face, ears, ear shapes, hair, neck, skin, ghost limbs, flesh-colored filler, or mannequin fragments. Helmets and headgear are empty shells with deep neutral interior shadow instead of heads, faces, ears, or hair. Trousers, leggings, greaves, gloves, and footwear are visibly empty objects.

Repeat the affected slots explicitly. Body armor has no belly, tummy, abdomen, midriff, navel, waist flesh, hips, thighs, legs, shoulders, arms, neck, chest flesh, or skin; openings show only background or non-flesh charcoal lining. Hair is anatomy, not headgear: no scalp, ears, hair, braids, locs, ponytail, or bun; omit a head ornament that cannot stand alone without hair. Footwear has no toes, toenails, toe shapes, feet, heels, ankles, legs, or skin; omit sandals that cannot be rendered empty.

Closed-toe footwear is the default. Boots, shoes, slippers, moccasins, and armored shoes must have a complete enclosed toe box. Do not convert them into sandals, open-toe boots, peep-toe shoes, toe loops, or decorative toe cutouts. Use open-toe sandals only when the source unmistakably shows them. If the source footwear is obscured or ambiguous, infer a closed-toe boot or shoe from the same kit. Render every footwear image as an empty pair with no feet, toes, skin, or flesh-colored filler.

LONG WEAPON RULE
If the main hand or off hand is a spear, staff, polearm, long axe, long hammer, standard, banner-staff, or any reach weapon, show the complete object tip-to-butt on a steep diagonal. The shaft must be long and slender, at least five times the length of the head. Do not shorten it into a mace, wand, baton, or club.

RENDERING STYLE
Dark low-fantasy action-RPG inventory item icon. Complete solid three-dimensional object shown from a dynamic three-quarter hero angle with real depth and volume. Crisp AAA game asset product render, sharp hard edges, readable seams, bevels, scratches, cloth weave, leather grain, polished stone, shell, bone, bronze, copper, brass, wood, hardstone, or other source-appropriate material response.

Use strong directional key light from the upper left, deep neutral shadows on the object itself, and a crisp cool rim light catching the silhouette. Neutral-to-cold white balance: deep neutral blacks, slate-grey shadows, bone-white highlights. Warm tones only where the material itself is warm.

BACKGROUND
Do not generate transparency. Do not generate a checkerboard. Put every item on one perfectly flat uniform matte olive-slate background: #737A68. No shadows on the background, no gradient, no texture, no floor plane, no vignette, no reflection.
```

## Prompt 2 - Four-Slot Motif Stress Test, Separate Files

```text
Generate 4 images. No commentary.

Use the attached character image as the authoritative equipment source. This is a motif-control stress test for itemization. Do not redesign the character. Do not make a paperdoll UI. Do not make a contact sheet, grid, lineup, or collage.

OUTPUT FILE RULE - VERY IMPORTANT
This request has 4 deliverables. Each deliverable must be its own separate independent image file. Do not put multiple items into one image. If you cannot generate 4 separate independent image files, generate only deliverable 1 as a single isolated item image instead of making a sheet.

Create exactly one separate image for each slot:

1. Off hand shield, focus, ritual tool, or secondary weapon
2. Amulet or pendant
3. Belt, girdle, sash, or waist piece
4. Body armor plus only clearly visible source lower-body components; pants/leggings only when unmistakably present

SOURCE AUTHORITY RULE
Use the source image's visible gear as the design authority. Preserve material logic, construction, palette, ornament density, silhouette, and wear level. If a slot is hidden, extrapolate from the same coherent kit only.

MOTIF BUDGET RULE - THE MAIN TEST
The four items must look like they belong to the same kit, but they must not share the same central ornament. Do not place a matching blue stone, matching round gem, matching circular boss, matching medallion, matching eye, matching sun, matching wheel, matching face, or matching emblem at the center of every item.

Use at most one strong central focal ornament across all four images. For the other three items, coordinate through material and construction instead: hammered metal surface, woven cloth border, leather wrap, hardstone edge, shell rim, carved plate geometry, stitched seams, plate overlap, or grip construction.

If the source has a blue stone centerpiece, choose one slot where it belongs best. Good choices are amulet, focus, or belt center. Do not replicate that blue stone onto the armor, shield, and every accessory.

SLOT RULES
Off hand shield or focus: if shield, show the clean front fighting face only, no straps or dangling front hardware. If focus or ritual tool, make it a compact offhand object, not a weapon and not a vague glowing idol.

Amulet: pendant-first object on cord, twine, leather string, or simple chain. Pendant fills most of the image. No gorget, collar, choker plate, or neck armor.

Belt: genuine narrow horizontal waist item. Belt, sash, girdle, cord, or waist harness only. No skirt, pants, leggings, apron, tassets, faulds, cuisses, greaves, robe hem, or hanging costume panel. Those belong in the body-armor image.

Compose the belt for a 2:1 horizontal slot, at least twice as wide as tall. Remove or tuck long tassels, fringe, tails, cords, straps, pouches, panels, and vertical rigging. Omit the belt if it cannot read as a shallow horizontal band.

Body armor: torso armor plus only clearly visible source lower pieces. Most studies should not contain pants or leggings; never invent them as filler. Render it ungirdled and beltless. No attached cloak, belt, gorget, necklace, collar, scarf, or mantle.

Arrange that body armor as one empty exploded gear composition with small gaps between torso, lower garment, and greaves. End at the greaves/ankle. No boots, shoes, sandals, soles, toe boxes, feet, legs, or skin inside the body-armor image.

RENDERING STYLE
Dark low-fantasy action-RPG inventory item icon. Complete solid three-dimensional object shown from a dynamic three-quarter hero angle. Crisp AAA game asset product render with sharp material detail, hard edges, readable construction, and source-accurate materials.

Use strong upper-left key light, deep neutral object shadows, cool rim light, and neutral-to-cold white balance.

BACKGROUND
Use one perfectly flat uniform matte olive-slate background: #737A68. No transparency, no checkerboard, no white background, no grey gradient, no floor plane, no cast shadow, no text, no label, no UI frame, no watermark.

FINAL ANATOMY AUDIT
Before output, reject or replace any item containing toes or feet; belly, tummy, abdomen, midriff, thighs, or skin; head, ears, hair, braids, or locs; hands, fingers, or arms. Do not output anatomy. If anatomy cannot be removed, omit that study and substitute another item. Repeat: no toes, no tummy or abdomen, and no hair in any separated item.
```

## Prompt 3 - One-Slot Fallback For Contact-Sheet Collapse

```text
Generate 1 image. No commentary.

Use the attached character image as the authoritative equipment source. Generate only the main hand weapon as one isolated ARPG inventory item icon. Do not generate any other slots. Do not make a sheet, grid, lineup, paperdoll, collage, or UI.

Extract the main hand weapon from the source image. Preserve the source kit's material logic, construction, color family, wear level, silhouette, and ornament density. If a side-laid weapon is visible in the source image, use that side-laid weapon as the authoritative reference and preserve its full length, proportions, head-to-shaft ratio, edge shape, grip, and material construction.

Do not add a matching central blue stone, gem, medallion, sun, face, eye, or emblem unless it is visibly part of the weapon in the source image. If the source kit has a blue stone elsewhere, do not copy it onto the weapon.

If the weapon is long, show the complete object tip-to-butt on a steep diagonal. The shaft must be long and slender, at least five times the length of the head. Do not shorten it into a mace, wand, baton, or club. The entire item must be fully visible and uncropped.

Render a dark low-fantasy action-RPG inventory item icon: complete solid three-dimensional object, dynamic three-quarter hero angle, crisp AAA game asset product render, sharp edges, readable seams, material-specific highlights, strong upper-left key light, deep neutral object shadows, cool rim light, neutral-to-cold white balance.

Use one perfectly flat uniform matte olive-slate background: #737A68. No transparency, no checkerboard, no white background, no grey gradient, no floor plane, no cast shadow, no text, no label, no UI frame, no watermark.
```
