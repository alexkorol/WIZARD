# Starter Four-Faction Prompt Blocks

Status: local-only, gitignored.
Blocks version: 7, 2026-07-09

These blocks are the SINGLE SOURCE OF TRUTH for the starter ladder calibration
prompts. The files in `prompts/STARTER-*` are BUILT ARTIFACTS: never hand-edit
them. Change the block here (or the cell in `BASE-FAMILIES.md`), bump the
version line above, and rebuild:

    python build_calibration_prompt.py --all

For the current production layout of four faction-specific prompts with nine
images each, use `build_faction_ladder_prompt.py --all`. This file provides the
shared faction blocks; `FACTION-LADDER-BLOCKS.md` provides the prompt-facing
Strength, Dexterity, and Intelligence axes plus the nine-image ladder
structure. The older named-class blocks below are legacy calibration support
and must not be imported into production character prompts.

Do not put element names, medicine-wheel language, or internal scaffold labels
into prompt bodies. The visual associations are private planning context only.

## Prompt-Facing Faction Names

Use these names in prompts:

- Northern Bronze Houses
- Cedar-Obsidian Clans
- Silkroad Plateau Nomads
- Nile-Ziggurat Kingdoms

Do not use these names in prompts:

- Ice
- Earth
- Air
- Fire
- Four-Corners
- medicine wheel
- red-skinned, yellow, black faction

## Assembly Order

A built ladder prompt concatenates blocks in this exact order. Lead-in labels
(e.g. "Shared render style:") are added by the builder.

1. Header line: "Generate exactly 4 separate images, no commentary."
2. Title line: "Photorealistic Stylized Tier {N} {Class} Male/Female Paired Calibration Set"
3. Output and Background Block
4. Tier {N} Block
5. Render Block
6. Dynamic Pose Block
7. Paired Base Block
8. Female Styling Block
9. Male Styling Block
10. {Class} Class Block
11. Construction Block
12. Slot Hygiene and Motif Restraint Block
13. Long Weapon Visibility Block
14. Extraction Anchor Block
15. Four faction paragraphs: Faction Block + the tier/class item-base family
    line from BASE-FAMILIES.md
16. Variation Block
17. Final Target Block

Never drop a block to shorten the prompt. Compressed prompts that rely on
context are a documented failure mode (WRAPUP-2026-07-07). ASCII only: no
em-dashes, no curly quotes.

## Failure-Mode Checklist

Mined from core/RUNBOOK.md, core/LOADOUT-EXTRACTION.md, core/STYLE-EXPERIMENTS.md,
WRAPUP-2026-07-07.md, AGENTS.md (2026-07-08 slot hygiene), and the
2026-07-08-character-items batch review. Before sending a built prompt, check
that the guard block is present; after the run, check the output against the
failure column.

| Observed failure | Where noted | Guard |
|---|---|---|
| Collage collapses bodies/values into near-copies | WRAPUP, STYLE-EXPERIMENTS | Output and Background Block (separate images, spacing) |
| Factions converge into same dark-grey figure | STYLE-EXPERIMENTS | Faction silhouette + value-anchor sentences in each Faction Block |
| Northern biome wording forces muddy dark clothing | 2026-07-09 taxonomy correction | Northern Bronze Houses Faction Block uses clean craft language and bright value anchors; no marsh/taiga/bog vocabulary in generated prompts |
| Slate-blue cast and subdued color across every faction and tier | 2026-07-09 production calibration | Pure neutral-white studio environment, neutral-white rim, no cool grading; blue removed from Northern/Cedar/Silkroad palette drivers and confined to one true-lapis Nile Intelligence field |
| Amulet slot drifts into gorget/collar/neck armor | AGENTS 07-08, batch (sun-collar, breast-collar, lapis-mask-collar...) | Slot Hygiene Block + pendant-first base families |
| Belt slot becomes skirt/faulds/tassets/apron | AGENTS 07-08, batch (chain-skirt girdle, scale-apron girdle) | Construction Block belt clause |
| Charm/chain/tassel clutter sprayed across slots | AGENTS 07-08, LOADOUT-EXTRACTION | Slot Hygiene Block |
| Sun/eight-spoke-wheel/face motifs repeated across a set | AGENTS 07-08, batch gilded-veil lane | Slot Hygiene Block + Paired Base Block (no one literal symbol) |
| "Matching head or neck motif" wording invites motif cloning | batch review | Paired Base Block says coordinated CONSTRUCTION, not motif |
| All mage foci converge into mirrors/discs | STYLE-EXPERIMENTS | Focus Family Assignments + per-faction base families |
| Belts/amulets/foci/footwear/outer layers stall while torso improves with tier | STYLE-EXPERIMENTS | Tier Blocks force per-slot progression; base families change per tier |
| Long weapons shortened into clubs/wands/props | RUNBOOK, WRAPUP, LOADOUT-EXTRACTION | Long Weapon Visibility Block |
| Extraction cannot tell which figure defines the base | unisex-vs-paired tension (STYLE-EXPERIMENTS vs paired trope) | Extraction Anchor Block |
| Female and male versions become different coverage categories | 2026-07-09 unisex correction | Paired Base, Female Styling, and Male Styling Blocks keep coverage/protection identical and vary only body fit |
| Shirtless-barbarian male default | FOUR-CORNERS scope | Male Styling Block |
| Heels/modern footwear on females | WRAPUP | Female Styling Block |
| Magic glow / VFX / supernatural drift | RUNBOOK (skymetal), tier grammar | Render Block + Tier Blocks (no supernatural) |
| Racial caricature or scaffold labels leak into prompts | FOUR-CORNERS scope | complexion language in Faction Blocks; prompt-facing names only |
| Spear/axe default sample set | WRAPUP weapon language | signature weapons in base families; class blocks ban polearm/axe spam |

## Output and Background Block

Create exactly four separate full-body fantasy character images. Each image
contains one matched adult male/female {CLASS} pair from one faction. The two
characters in each image stand together as a coherent pair, not touching, with
clear spacing between them. The four images are:
1. Northern Bronze Houses {CLASS} pair
2. Cedar-Obsidian Clans {CLASS} pair
3. Silkroad Plateau Nomads {CLASS} pair
4. Nile-Ziggurat Kingdoms {CLASS} pair

Each image must be its own independent output, never a collage, contact sheet,
or grid. Use one single flat pure neutral-white studio background in every
image, with no colored tint and no gradients, texture,
scenery, floor-plane emphasis, or vignette. The background must not cast color
onto the characters or equipment.
No text labels, no UI, no frames, no captions, no visible written symbols, no
magic background, and no watermark.

## Tier 1 Block

All eight characters are Tier 1 Scion {CLASS_PLURAL}. Tier 1 gear is
improvised, incomplete, and under-equipped, but still attractive and readable
as an ARPG starting loadout. They should look wet-behind-the-ears, hungry, and
scrappy, not pathetic peasants and not champions. Tier 1 must read in every
slot, not just the torso: one crude core weapon or focus, an improvised guard
or none, a plain cord or rawhide belt, one small pendant scrap on a cord, a
single wrap or mismatched hand guard, bare feet or simple wraps, and at most a
rough shoulder strip for an outer layer. Nothing polished, nothing matched,
no supernatural effects.

## Tier 2 Block

All eight characters are Tier 2 Adventurer {CLASS_PLURAL}. Tier 2 Adventurer
gear is the production baseline: coherent full loadout, real item bases, class
silhouette, faction materials, visible construction, controlled ornament, and
clear adventuring readiness. It is not starter scrap gear and not apex
legendary gear. Tier 2 must progress in every slot, not just the torso: a real
weapon or focus with a proper offhand, a constructed waist belt with fittings, a
readable pendant on a cord, a matched pair of bracers or wraps, real period
footwear, and a practical half-mantle or short outer layer where the faction
calls for it. It should feel aspirational and usable for item extraction
without becoming boss armor or unique-item overload. No supernatural effects.

## Tier 3 Block

All eight characters are Tier 3 Champion {CLASS_PLURAL}. Tier 3 is the highest
starter tier: fully coherent, aspirational, near Gigachad/Gigastacy, and
clearly more refined than Tier 2, but still normal gear rather than legendary
unique or boss equipment. Tier 3 must refine every slot, not just the torso:
a polished signature weapon or focus with a matched refined offhand, a plated or fitted
waist belt with a real closure, a set stone pendant, matched structured
bracers, structured greaves or reinforced footwear, and a full mantle or cloak
in faction materials. Use complete loadouts, strong class silhouettes, refined
faction materials, controlled ornament, subtle battle wear, and no
supernatural effects.

## Render Block

Use cinematic ultrafine-detail photorealism, like sharply modeled high-end 3D game characters with crisp hard edges, precise surface detail, strong material separation, and believable construction. Use colorless high-contrast studio lighting: strong neutral-white upper-left key light, deep neutral shadows, and a crisp neutral-white rim light catching skin, armor edges, weapons, belts, bracers, foci, hair, and silhouettes. Keep a strictly neutral daylight/studio white balance. Use an 8k camera look with clean skin, sharp eyes, readable leather grain, visible cloth weave, polished metal response, carved wood texture, shell sheen, bone polish, obsidian facets where relevant, and controlled use-wear. Render dyes with clear saturation and every material in its own local color. No loose painterly style, watercolor, sketch, anime, cartoon, toy plastic, AI smudge, sepia wash, amber haze, global desaturation, global color cast, scenery, or magic glow.

## Dynamic Pose Block

Each pair should feel alive and mid-action, not like two static mannequins. Use dramatic low-angle stances, strong weight shifts, angled shoulders, bent knees, weapons drawn or foci presented, cloth or hair slightly in motion, and paired poses that complement each other without mirroring. The male and female should not stand in identical poses. Keep full bodies visible from head to feet, keep weapons, shields, foci, belts, bracers, footwear, and head or neck items uncropped, and leave enough spacing that all item bases remain readable for later extraction.

## Paired Base Block

The male and female in each image must clearly share the same canonical unisex item-base family: matching weapon type, matching armor coverage, matching protection level, matching belt construction, matching bracer or glove construction, matching footwear material, coordinated head or neck construction, matching material palette, and matching faction craft language. Adapt the same bases naturally to two bodies without turning them into identical costumes and without repeating one literal symbol across every slot. The female expression may be more waist-shaped, fitted, or feminine in tailoring; the male expression may be broader or more angular in fit. Neither receives more or less armor merely because of gender. Both versions must look equally intentional, equally protective, equally high quality, and equally useful for later item extraction.

## Female Styling Block

The female character wears the same unisex equipment bases and the same coverage level as the male character, tailored to her body with a fitted waist, shaped but practical torso construction, and a feminine silhouette where appropriate. Do not remove chest, shoulder, hip, thigh, hand, or leg protection merely to expose skin. Keep every item wearable and load-bearing, with visible backing and attachment logic. Use dynamic low-angle confidence without forcing either a dainty or hyper-masculine body type. Bare feet, simple sandals, hide wraps, or low period footwear only when the shared loadout calls for them. Absolutely no high heels, modern shoes, zippers, latex, plastic, modern fabric, or sci-fi tech.

## Male Styling Block

The male character wears the same unisex equipment bases and the same coverage level as the female character, tailored to his body with broader proportions or a more angular fit where appropriate. Do not add extra armor categories merely because he is male, and do not make him a default shirtless barbarian. Preserve the same torso, shoulder, belt, hand, leg, footwear, and outer-layer base family across the pair. Practical boots, sandals, or wraps must follow the shared loadout and faction construction.

## Construction Block

All gear must be physically plausible. Chest harnesses must connect around ribs or back. Belts must read as horizontal waist items, not skirts, faulds, or tassets. Bracers must wrap around forearms. Greaves or shin wraps must strap to legs. Shields or bucklers must have grips, but their visible front face should stay clean and functional. Held foci and ritual tools are off-hand objects with handles, cords, cases, grips, or settings, not main-hand damage weapons unless explicitly weaponized. Hands-free semi-floating or orbiting magical foci occupy the separate Attendant seat and may use overt levitation, glow, orbiting parts, or impossible suspension. Strength loadouts include a complete War-call instrument, Dexterity loadouts a complete Quick Rig, and Intelligence loadouts a distinct hovering Attendant focus so these auxiliary categories can be extracted later. Bone, shell, jade, copper, bronze, leather, fiber, and wood pieces must be tied, pinned, backed, wrapped, laced, or set into a real construction system. No floating armor plates, impossible molded bone armor, perfect one-piece shell armor, hollow broken helmets, random jewelry density, or mundane item parts ignoring gravity.

## Slot Hygiene and Motif Restraint Block

Design the character so later item extraction can isolate clean paperdoll slots. Finger rings should be compact bands, signets, coils, socket rings, or seal rings, never dangling charm rings with chains, tassels, bells, or chimes. Amulets should be pendant-first objects on cord, twine, leather thong, or simple chain, with the pendant as the main read; do not make the amulet slot a gorget, collar, or throat armor by default. Body armor should keep an open neck/chest read and should not include a built-in gorget, turtleneck, belt, skirt, faulds, tassets, or cloak. Cloaks and mantles should use opaque fabric, leather, wool, hide, bark cloth, felt, or woven fiber more often than gauze; avoid excessive shredded ragged fringe. Do not scatter invasive charms, tiny hanging rings, chimes, delicate chains, tassels, or dangling costume hardware across helmets, weapons, shields, armor, cloaks, belts, and rings. Avoid solar symbols, eight-spoked wheel symbols, and human-face centerpieces unless explicitly requested; if one appears, keep it to one major item rather than repeating it across the whole set.

## Long Weapon Visibility Block

If any figure carries a spear, pike, staff, glaive, polearm, standard, long axe, long hammer, or any other reach or two-handed weapon, the entire weapon must be visible from tip to butt inside the frame. The shaft must remain long, slender, and visibly dominant, at least five times the length of the head or striking element. Do not crop the ends, do not shrink the weapon into a wand, club, or mace-length prop, and do not enlarge the head until the shaft disappears. If the pose cannot show the full weapon cleanly, lay the complete weapon beside the figure at full length instead.

## Extraction Anchor Block

Every equipment slot must appear complete, readable, and unobstructed on at least one of the two figures: weapon, offhand or focus, head, neck pendant, body, outer layer, belt, hands, ring if visible at this scale, and footwear. The two presentations share one canonical unisex item base per slot with the same coverage and protection. Use complementary poses and viewing angles so one figure can clarify construction hidden on the other; neither figure is a reduced styling fragment. Large shields and long weapons may additionally be laid beside a figure at full size as a clean side reference; a side-laid object must keep its true proportions and complete silhouette.

## Focus Family Assignments

Planning note, realized through the base families; keeps mage offhands from
converging into one object type (STYLE-EXPERIMENTS: "do not let all foci
become mirrors").

- Northern Bronze Houses: an irregular amber hand focus held in an open bronze
  cradle or short handled setting. Amber is reserved to this focal object and
  must not be repeated across the belt, amulet, bracers, and footwear.
- Cedar-Obsidian Clans: woven spirit-hoop with shell/greenstone at low tier,
  rising to a polished obsidian mirror disk in a carved wood ring at Tier 3.
- Silkroad Plateau Nomads: double-ended pronged bronze implement
  (vajra/dorje-like as structural inspiration only, no sacred copies).
- Nile-Ziggurat Kingdoms: hardstone scepter with lapis or carnelian finial,
  or a handled clay-seal cylinder tool.

## Warrior Class Block

Warrior is STR gear: broad, grounded, protective, structured, armor-forward, and physically strong. Use shields, heavy one-handed weapons, short brutal blades, thick belts, bracers, greaves, helmets or head protection, shoulder protection, layered plates, reinforced harnesses, and visible construction. Both characters use the same unisex protective base family and coverage level, adapted only in body fit. Avoid rogue stealth silhouettes, mage foci as the main read, hunter quivers, bard signal tools, priest robes, dancer costumes, polearm spam, and generic axe spam.

## Rogue Class Block

Rogue is DEX gear: narrow, predatory, asymmetrical, compact, low-slung, fitted, and mobile. Use compact weapons, paired knives, hooked blades, garrotes, short clubs, small bucklers, stealth footwear, low belts, pouches, short cloaks, fitted leather, hide, fiber, and flexible layered protection. Both characters use the same unisex agile base family and coverage level, adapted only in body fit. Avoid bulky warrior armor, ornate mage collars as the main read, hunter bows, druid ritual tools, bard signal tools, long polearms, heavy axes, giant shields, and stage costumes.

## Mage Class Block

Mage is INT gear: vertical, warded, intricate, focus-bearing, and less physically armored than Warrior. Use pendant amulets, compact rings, off-hand foci, mantle structure, bead counters used sparingly, narrow belts, substantial cords, hand wraps or bracers, and small ritual focus objects. Both characters use the same unisex layered base family and coverage level, adapted only in body fit. Avoid visible spell effects, glowing projectiles, magic circles, floating crystals, giant wizard staffs, priest robes, heavy shields, hunter quivers, rogue dagger spam, druid leafy gear, bard instruments, tablets, plaques, bowls, weak wands, gorget-as-amulet drift, and dangling charm clutter.

## Northern Bronze Houses Faction Block

Fair, pale, rosy, or light olive complexion with Bronze Age Baltic amber-trade, Slavic, and Nordic archaeological adjacency, explicitly centuries before medieval Viking material culture. Body and silhouette archetype: broad, poised, physically grounded, and shawl-forward, reading as oath-bound mutual duty shading into rigid ancestral pride; the gear looks formally assembled and carefully maintained rather than weather-beaten. Use pale hemmed wool, white or natural linen, vivid madder-red, deep spruce-green and golden-ochre woven borders, bright polished tin bronze, raw copper used sparingly, golden amber restricted mainly to jewelry or one Intelligence-axis focus, pale birch or ash wood, polished horn, and clean russet hide as structural backing. Give the cloak slot a broad tailored shawl, a clean rectangular shoulder mantle, or a patterned woven wrap with finished edges. Palette: bone white, natural flax, madder crimson, spruce green, golden ochre, bright bronze, warm russet leather, pale wood, horn cream, and restrained golden amber. Anchor the values on pale textiles and bright bronze with spatially separate crimson, green, and ochre patterning so the pair remains crisp, colorful, and high-value. Keep the clothing clean, dry-looking, hemmed, and materially separated. Use only the listed textile and hardstone colors. Avoid horned helmets, medieval mail, readable runes, longship costume, oversized fur, generic rough survival-costume styling, charcoal-dominant outfits, all-dark leather, and subdued survivalist gear.

## Cedar-Obsidian Clans Faction Block

Warm copper-brown or red-ochre complexion with North and South American indigenous craft-language adjacency, grounded in cedar raincoast materials and rising toward obsidian, shell, polished copper, jade or greenstone, and imperial jungle intensity at higher tiers. Body and silhouette archetype: compact, explosive, athletic, and predatory, reading as craft mastery shading into trophy pride; the gear looks hand-carved and hunt-proven. Use cedar bark textile, hide, rawhide, woven fiber, shell, carved wood, copper, jade or greenstone accents, glossy black obsidian accents, and bone used sparingly. Palette: saturated mineral red, cedar brown, luminous shell white, deep jade green, neutral-black obsidian, polished raw copper, and warm hide tan. Anchor the values on one bounded mineral-red textile field and shell white set against neutral-black obsidian, with greenstone confined to hard components, so the pair keeps strong light-dark and hue separation. Use only the listed textile and hardstone colors. Avoid carnival feather overload, copied sacred symbols, eagle or sun-face logos, readable glyphs, skull clutter, and joke tribal props.

## Silkroad Plateau Nomads Faction Block

Golden-olive, warm tan, or sun-browned complexion with sand nomad, steppe, high plateau, silk road, mountain court, Tibetan, Mongolian, Caucasus, Arabic, Persian, and Central Asian adjacency as a broad fantasy synthesis, not a literal single culture. Body and silhouette archetype: lean, austere, agile, and travel-worn, reading as self-sufficient mobility shading into restlessness and hoarded portable wealth; the gear looks packable and ridden-in. Use luminous felt, wool, linen, silk cord, leather, bronze, mirror-bright brass, neutral-black lacquered leather, carnelian, dark stone, horse or steppe gear cues, and high-plateau textile logic. Palette: clean warm sand, saturated saffron, deep mulberry, vivid crimson, bright brass, neutral black, russet leather, carnelian, and luminous off-white wool. Anchor the values on off-white felt and warm sand set against separate crimson, saffron, mulberry, and black fields so the pair reads as richly colored rather than monochrome. Use only the listed textile and hardstone colors. Avoid belly-dancer defaults, orientalist palace costume, random turbans everywhere, modern desert tactical gear, copied religious symbols, and readable scripts.

## Nile-Ziggurat Kingdoms Faction Block

Deep bronze, dark copper, warm umber, or polished dark brown complexion with Egyptian, Babylonian, Coptic, Ethiopian, Nile, Horn, Levant, and Mesopotamian adjacency. Body and silhouette archetype: taller, upright, monumental, and formally composed, reading as civic order and status shading into gilded weight; the gear looks issued by a river-city armory rather than improvised. Use bronze, brass, gold used carefully, brilliant linen, neutral-black leather, carnelian, malachite or green faience, true lapis used only in the Intelligence-axis loadout, reed, clay seal shapes, beadwork, polished wood, and structured river-city craft. Palette range: brilliant white linen, neutral-black leather, saturated carnelian red, malachite green, true-lapis ultramarine, gold or brass, clean clay tan, and warm copper. Do not use the whole range in one outfit: Strength uses carnelian and gold, Dexterity uses carnelian and green faience, and Intelligence alone receives exactly one bounded saturated true-lapis ultramarine field. Anchor every loadout on white linen and bright metal against black leather while its selected accent remains spatially bounded. Avoid unassigned textile or hardstone colors, all-over lapis-and-gold uniforms, pharaoh costume, copied sacred Egyptian icons, readable cuneiform, readable hieroglyphs, over-gilded dancer costume, and generic fantasy desert-costume shorthand.

## Variation Block

All four pairs must be recognizably Tier {TIER} {CLASS_PLURAL}, but faction identity must be obvious through material logic, silhouette, palette, weapon shape, belt construction, footwear, coordinated head or neck construction, and item-base family. Do not solve faction identity with logos, symbols, text, or stereotypes. Solve it through believable craft language.

## Final Target Block

Four separate paired male/female Tier {TIER} {CLASS} images for a dark low-fantasy ARPG: crisp, faction-distinct, class-readable, construction-plausible, with shared unisex item-base families, clean extractable slots, identical protection and coverage across the pair, and natural body-fit variation.
