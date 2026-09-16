# Calibration Prompts - 2026-07-09 v2

These are local working prompts for manual image-2 calibration after Alexei's
quick-impression pass. They are intentionally kept under
`character_pipeline_local/` and are not production data.

Primary changes from v1:

- prefer separate-image sets for source-character calibration
- add faction body/silhouette archetypes, not only palettes
- add restrained virtue/vice gear pressure
- push Steppe-Sand Road clothing toward desert scarf, robe, sash, and travel cloak cues
- pull Red Mesa-Rainforest slightly more toward fantasy Aztec high-tier shapes with supporting Salish/Karui-like wood, shell, shield, and greenstone massing
- give Nile-Ziggurat higher-tier gear a greed/earthly-treasure pressure with bronze, brass, lapis, and limited gold highlights
- replace the muddy northern biome taxonomy with Northern Bronze Houses: clean pale textiles, patterned shawls, bright bronze, pale wood and horn, and restrained amber
- make belts, amulets, foci/offhands, handwear, footwear, and outer layers progress across tiers
- diversify Mage foci so every faction does not become a mirror-disk user
- do not write private elemental planning labels into final prompts

## Prompt 1 - Four Factions, Tier 2 Warrior Source Pairs, Separate Images v2

```text
Generate 4 separate images. No commentary.

TITLE / PURPOSE BLOCK
Photorealistic Bronze-Age ARPG Source Pair Calibration: Four Factions, Tier 2 Warriors, v2

Create four separate polished character-reference images. Each image contains exactly two full-body adult fantasy Warriors standing side by side: one female-presenting Warrior and one male-presenting Warrior from the same faction, same class, and same gear tier. These are source images for later extraction into ARPG inventory item icons. They are not UI screens, not paperdoll layouts, not labeled sheets, and not story scenes.

GLOBAL STYLE BLOCK
Use cinematic, ultrafine-detail photorealistic 3D game render quality with crisp AAA asset clarity. The characters and gear should have sharp hard edges, readable seams, physical material response, high local contrast, and no painterly brush texture. Use a strong upper-left studio key light, deep neutral shadows, and a cool rim light on armor, weapons, hair, cloth, and silhouettes. Keep color grading neutral-to-cold, with warm tones only where the material itself is warm: bronze, copper, brass, hide, wool, shell, amber, hardstone, or gold. No sepia haze, no yellow wash, no bloom fog, no vignette, no modern fashion lighting, no dark muddy sameness, and no loose concept-art softness.

CANVAS AND COMPOSITION BLOCK
Each image uses a stark white or very pale blue-gray studio background only. No scenery, props behind the characters, text, labels, borders, UI, frames, floor emphasis, or decorative symbols. Each pair must be full-body and uncropped. Leave clear spacing between the two characters. Major gear must be visible: helmet or headgear, pendant amulet, body armor, cloak or mantle, horizontal belt, hand protection, footwear, main hand weapon, and off hand shield or secondary weapon.

UNISEX EQUIPMENT BLOCK
All equipment bases are unisex. Do not create revealing female armor and covered male armor as separate categories. The female-presenting character may have armor fitted to her body, with a more shaped waist or feminine contour. The male-presenting character may be broader and heavier. But both use the same item-base language: same coverage level, same protection level, same construction logic, same material system, and same slot identity. A cuirass remains a cuirass, a mantle remains a mantle, a belt remains a horizontal belt, and a shield remains the same shield family across the pair.

CLASS AND TIER BLOCK
Both characters in every image are Tier 2 Warriors. Tier 2 means capable house-warrior gear: competent, desirable, well-made, and battlefield-ready, but not legendary, royal, supernatural, or boss-tier. Warrior gear should read as strength-focused and protective: broad silhouettes, structured torso armor, thick belts, bracers, greaves, heavy footwear, helmets or caps, shields, and forceful melee weapons. Do not make them rogues, mages, hunters, druids, performers, priests, dancers, or scouts.

SIDE-LAID ITEM REFERENCE BLOCK
In every image, include one major weapon or shield laid beside the pair as a clean reference object, fully visible and not embedded in the floor. This side-laid object must be complete, uncropped, and readable for later item extraction. Treat it as a real object next to the characters, not a UI icon. If it is a long weapon, show it tip-to-butt with shaft at least five times the length of the head. If it is a shield, show the clean front fighting face only.

FACTION 1: NORTHERN BRONZE HOUSES
Body and silhouette: broad-shouldered, sturdy, poised, formally layered, and shawl-forward. The faction should feel resilient and oath-bound, with disciplined craftsmanship shading into rigid ancestral pride.
Gear language: northern Bronze Age amber-trade culture with Baltic, Slavic, and Nordic archaeological adjacency, explicitly centuries before medieval Viking material culture. Use pale hemmed wool, white or natural linen, madder-red and indigo woven borders, bright polished bronze, raw copper used sparingly, pale birch or ash wood, polished horn, clean russet hide as structural backing, and golden amber restricted mainly to one pendant. The cloak or shawl slot should be visually important: a broad tailored shawl, clean rectangular shoulder mantle, or patterned woven wrap with finished edges. Use a leaf-bladed bronze short sword or heavy bronze knife, a pale-hide oval shield with clean bronze edging, a fitted bronze cap, a thick horizontal russet-and-bronze belt, bracers, greaves, and clean low boots. Keep the ensemble bright, dry-looking, crisp, and materially separated. Avoid medieval Vikings, horned helmets, chainmail, iron plate, oversized fur, readable runes, charcoal-dominant outfits, all-dark leather, or generic barbarian styling.

FACTION 2: RED MESA-RAINFOREST CONFEDERACY
Body and silhouette: compact, explosive, athletic, predatory, and shield-forward. The faction should feel fierce and kin-bound, but also status-conscious through trophies and hardstone craft.
Gear language: pre-AD clay mesa and rainforest warrior culture with red mineral pigment as material color, obsidian, shell, cotton armor, hardwood, copper, bone, turquoise or greenstone used sparingly, and layered woven protection. Pull the high-status shapes slightly toward fantasy Aztec: stepped hardstone geometry, obsidian-edged clubs, bold cotton armor, compact carved shields, and ceremonial but usable silhouettes. Use Salish/Karui-like massing only as supporting language in carved wood, shell, shield outline, and greenstone weight, not as copied ceremony or exact dress. Use an obsidian-edged club or heavy hardwood sword-club, compact hardwood shield, quilted cotton cuirass, shell-edged bracers, broad woven belt, pendant amulet, and woven leg guards. Avoid carnival feather clutter, giant headdresses, modern tribal costume, dangling charms everywhere, weak wicker items, and copied sacred symbols.

FACTION 3: STEPPE-SAND ROAD HOUSES
Body and silhouette: taller, leaner, mobile, travel-worn, and austere, with a long-cloak line and layered sash movement. The faction should feel disciplined and cosmopolitan, but also status-proud through fine textiles and trade objects.
Gear language: nomadic trade-road and highland desert culture with felt, leather, lamellar plates, bronze fittings, horsehair cord, dense woven belts, small lapis or glass accents, weathered cotton, desert head cloth, robe-like over-mantle, wrapped sash, travel cloak, and practical riding or caravan armor. Blend steppe, Tibetan, Caucasus, Persian, and desert-nomad clothing cues without making the faces default to one ethnic look and without making it medieval, Ottoman, sci-fi, or belly-dancer costume. Use a heavy bronze chopping blade or saber-like weapon, reinforced round shield, felt-lined helmet or wrapped headgear, layered leather lamellar, strong sash-belt, pendant amulet, bracers, and wrapped boots. Include more desert scarf, robe, sash, and cloak language than the earlier test.

FACTION 4: NILE-ZIGGURAT HORN PALACES
Body and silhouette: taller, monumental, treasure-weighted, and frontal, with heavy jewelry used as load-bearing status gear rather than loose decoration. The faction should feel ordered and palace-crafted, but also greedy and weighed down by earthly treasures.
Gear language: ancient river-palace and ziggurat city culture with darker warm skin tones, bronze, copper, brass, bitumen-black leather, lapis-blue cloth, ivory or bone inlay, linen, hammered chest plates, and geometric palace craft. Use bronze and brass mass as the main read; add a few bright gold highlights only on high-status edges, pendants, or bosses, never gold overload. Blend Egyptian, Babylonian, Coptic, and Ethiopian-adjacent cues without copying sacred symbols. Use a heavy bronze sickle blade or mace, tall bronze-faced shield, linen-backed armor, dense leather sandals, a clear pendant amulet, thick belt, bracers, and a structured cloak or shoulder cloth. Avoid sun disks, human-face centerpieces, eight-spoked wheel motifs, readable writing, pharaoh costume cliches, and all-over gold.

ANTI-CLUTTER AND NEGATIVE BLOCK
No high heels, no modern shoes, no zippers, no plastic, no guns, no sci-fi tech, no steel plate, no chainmail, no riveted mail, no medieval knight armor, no horned helmets, no glowing runes, no magical auras. Avoid dangling charms, bells, chimes, loose coins, delicate jewelry chains, and random hanging rings. Rings are compact finger jewelry only. Amulets are pendants on cords, not gorgets or collars. Belts are horizontal waist gear, not skirts or tassets. Shields show front fighting faces only, no front-side straps or dangling hardware.
```

## Prompt 2 - Northern Bronze Houses Rogue Tier Progression, Separate Images v3

```text
Generate 3 separate images. No commentary.

TITLE / PURPOSE BLOCK
Photorealistic Bronze-Age ARPG Source Pair Calibration: Northern Bronze Houses Rogue Tiers 1-3, v3

Create three separate polished character-reference images. Each image contains exactly two full-body adult fantasy Rogues from the Northern Bronze Houses: one female-presenting Rogue and one male-presenting Rogue at the same tier. Image 1 is Tier 1, image 2 is Tier 2, image 3 is Tier 3. These are source images for later extracting ARPG inventory item icons.

GLOBAL STYLE BLOCK
Use ultrafine photorealistic 3D game render quality with crisp AAA asset clarity. Strong upper-left studio key light, deep neutral object shadows, cool rim light, sharp russet-leather grain, pale wool weave, bright bronze edges, polished horn, restrained amber, pale carved wood, and clean linen stitching. The finish should be clean, tactile, and product-render sharp, not painterly, smeary, cinematic foggy, sepia, or muddy dark grey. Use a deliberately bright value structure: bone-white and natural pale cloth, madder red and indigo woven borders, bright bronze, warm russet leather, horn cream, and pale wood.

FACTION DESIGN LANGUAGE BLOCK
All six characters belong to the same northern Bronze Age amber-trade house culture with Baltic, Slavic, and Nordic archaeological adjacency, explicitly centuries before medieval Viking material culture. Use pale hemmed wool, white or natural linen, madder and indigo woven borders, bright polished bronze, pale birch or ash wood, polished horn, clean russet leather, tailored shawls, and rectangular mantles. Amber appears only as one restrained jewelry accent per loadout, never across every slot. The faction body and silhouette language is broad, poised, grounded, formally layered, and shawl-forward, but Rogue versions are narrower and more agile than Warriors. Avoid medieval knights, horned helmets, chainmail, iron plate, runic spam, oversized fur, charcoal-dominant outfits, all-dark leather, generic barbarians, or fur-bikini tropes.

CLASS BLOCK
Every character is a Rogue. Rogue gear should read as dexterity-focused, agile, fitted, quiet, and clever. Use narrow silhouettes, asymmetry, short cloaks, compact blades, small shields or offhand tools, hide wraps, leather bracers, low footwear, pouches used sparingly, and flexible armor. Do not make them bulky Warriors, ornate Mages, Hunters with bows, Druids, Bards, priests, or dancers.

UNISEX EQUIPMENT BLOCK
All Rogue equipment bases are unisex. Female-presenting versions may be more fitted or waist-shaped, and male-presenting versions may be broader or more angular, but coverage, protection level, construction, material system, and slot identity stay the same at each tier. Do not make female Rogues revealing while male Rogues are covered. Vary body fit, not gear category.

TIER 1 IMAGE BLOCK
Tier 1 pair: wet-behind-the-ears scions with lowly scavenged but maintained gear. They wear mismatched natural linen and faded pale-wool pieces, one compact bronze knife, a basic pouch, simple russet-hide patches, sandals or low hide shoes, and a small patched but hemmed shoulder cloth. Belt: a plain linen cord or narrow russet-hide belt, horizontal and sparse. Amulet: one small horn sliver or amber chip on linen twine. Hands: simple linen wrist wraps. Footwear: plain hide shoes or tied sandals. Outer layer: a small pale-wool shawl with a faded madder edge, not a dramatic assassin cloak. They are under-equipped but not dirty joke characters.

TIER 2 IMAGE BLOCK
Tier 2 pair: competent house agents with coherent gear. They wear fitted russet leather over pale linen, a short hemmed wool mantle with madder and indigo borders, paired narrow bronze knives or one leaf-bladed short sword, a pale-hide buckler with a clean bronze rim, fitted bracers, better boots, and a deliberate stealth silhouette. Belt: a stitched horizontal russet-leather belt with one pouch, not a skirt. Amulet: one readable amber or polished-horn pendant on a linen cord. Hands: proper leather-and-bronze bracers or gloves. Footwear: clean low hide boots. Outer layer: short patterned wool mantle with a crisp edge.

TIER 3 IMAGE BLOCK
Tier 3 pair: elite but not supernatural house assassins. They wear refined russet-leather armor over pale linen, polished bronze-edged compact blades, a structured patterned mantle in bone white, madder red, and indigo, pale-wood or horn fittings, one restrained amber jewelry accent, complete belt and handwear, and highly readable stealth silhouettes. Belt: broad fitted russet belt with bright bronze plaques and one clean tool slot. Amulet: one polished amber pendant or horn-and-bronze pendant on a substantial linen cord, large enough to read. Hands: fitted bracers or gloves with bright bronze edges. Footwear: quiet low russet boots with pale-wool uppers. Outer layer: tailored rectangular half-mantle with clean hems and a clear cutout-friendly outline.

SIDE-LAID ITEM REFERENCE BLOCK
Place one compact Rogue weapon or offhand tool beside each tier pair as a visible source reference: Tier 1 rough knife, Tier 2 bronze seax-like blade or rawhide buckler, Tier 3 matched compact blades or carved offhand buckler. These side-laid items must be complete, cleanly visible, and not embedded in the floor.

ANTI-CLUTTER BLOCK
No dangling charms, chimes, bells, delicate jewelry chains, loose coins, random tassels, front-side shield straps, gorget amulets, belt-skirts, paperdoll UI, labels, or repeated sun/wheel/face motifs. Keep all objects physically attached and useful. No modern shoes, zippers, guns, sci-fi tech, steel, iron plate, chainmail, or medieval styling.
```

## Prompt 3 - Four Factions, Tier 2 Mage Focus Diversity, Separate Images v2

```text
Generate 4 separate images. No commentary.

TITLE / PURPOSE BLOCK
Photorealistic Bronze-Age ARPG Source Pair Calibration: Four Factions, Tier 2 Mages With Distinct Offhand Foci

Create four separate polished character-reference images. Each image contains exactly two full-body adult fantasy Mages standing side by side: one female-presenting Mage and one male-presenting Mage from the same faction, same Tier 2 gear level. These are source images for later extraction into ARPG inventory item icons.

GLOBAL STYLE BLOCK
Use ultrafine photorealistic 3D game character-render quality with crisp AAA asset clarity. Studio lighting with strong upper-left key light, deep neutral object shadows, and cool rim light. Materials must be readable at inventory-reference scale: bronze, copper, brass, stone, cloth weave, leather, shell, bone, amber, wood, hardstone, and polished ritual tools. Avoid painterly softness, sepia haze, fog, bloom, dark muddy sameness, and blurred backgrounds.

CLASS BLOCK
All eight characters are Mages. The shared Mage grammar is ritual precision, warding, intellect, and controlled material craft: structured robe armor, compact offhand foci, pendant amulets, headpieces, light hand protection, belts, sandals or wraps, and layered cloth with clear construction. Do not make them warriors, rogues, hunters, druids, performers, or priests. No giant shields, no massive axes, no bows, no instruments, no supernatural aura.

UNISEX EQUIPMENT BLOCK
All equipment bases are unisex. Female-presenting and male-presenting versions can fit different bodies, but they must share coverage, protection level, construction, material logic, and slot identity. Do not make female Mages revealing and male Mages covered. Use fit variation, not different gear categories.

TIER BLOCK
Every pair is Tier 2: trained, competent, and visually desirable, but not apex royal, legendary, or supernatural. Gear should be coherent and well-made: fitted cloth layers, structured leather or bronze support, good belts, clear pendant amulets, readable foci, headgear, hand protection, and footwear. Belts are horizontal waist items. Amulets are pendant-first objects on cord or simple chain. Foci belong to the off-hand slot.

PAIR 1: NORTHERN BRONZE HOUSES
Body and silhouette: broad, poised, formally layered, and shawl-forward, but made narrower and quieter for Mage gear. The faction feels resilient and oath-bound, with disciplined craft shading into rigid ancestral pride.
Gear language: pale hemmed wool, natural linen, madder and indigo woven borders, bright bronze, pale birch or ash wood, polished horn, clean russet leather, tailored shawls, and rectangular mantles. Offhand/focus family: one irregular amber hand focus in an open bronze cradle or short handled setting, compact and substantial, not a mirror. Amber is reserved to this focus and must not repeat on the amulet, belt, bracers, or footwear. Side-laid reference object: the complete amber-and-bronze focus placed beside the pair, fully visible. Avoid horned helmets, medieval cloaks, chainmail, readable runes, oversized fur, charcoal-dominant outfits, all-dark leather, or dull survivalist styling.

PAIR 2: RED MESA-RAINFOREST CONFEDERACY
Body and silhouette: compact, athletic, predatory, with bold cotton and hardstone shapes. The faction feels fierce and kin-bound, with trophy/status pressure but not costume clutter.
Gear language: quilted cotton, woven fiber, obsidian, shell, turquoise or greenstone accents, red clay material color, hardwood, compact shoulder cloth, carved shield-like outlines, and a slight fantasy Aztec high-tier pull. Offhand/focus family: spirit-net focus, a small hardwood hoop or oval frame with woven cord crossings and shell or greenstone nodes, not a literal modern dreamcatcher copy and not a mirror. Side-laid reference object: one complete spirit-net focus beside the pair, clean and readable. Avoid carnival feathers, giant headdresses, dangling charm curtains, wicker props, or copied sacred ceremony.

PAIR 3: STEPPE-SAND ROAD HOUSES
Body and silhouette: taller, lean, austere, travel-worn, with long robe edge, sash, scarf, and cloak movement. The faction feels disciplined and trade-road cosmopolitan, with status shown through textiles and small hard accents.
Gear language: felt, leather, lamellar fragments, bronze fittings, dense woven belts, horsehair cord, weathered cotton, small lapis or glass accents, desert head cloth, robe-like over-mantle, wrapped sash, and practical travel cloak. Offhand/focus family: double-ended pronged bronze ritual implement inspired by vajra/dorje structural symmetry, but not copied sacred iconography and not named as a literal religious object in the image. It should be hand-held, heavy, compact, and plausible as an offhand focus, not a weapon. Side-laid reference object: the pronged bronze focus placed beside the pair, fully visible. Avoid belly-dancer costume, Ottoman medieval styling, excessive veils, delicate chain jewelry, and sci-fi ornament.

PAIR 4: NILE-ZIGGURAT HORN PALACES
Body and silhouette: tall, monumental, treasure-weighted, and formal. The faction feels ordered and palace-crafted, with a vice of being weighed down by earthly treasures.
Gear language: bronze, copper, brass, bitumen-black leather, lapis-blue cloth, linen, ivory or bone inlay, hardstone pendants, geometric palace craft, and a few bright gold highlights only on high-status edges or pendants. Offhand/focus family: hardstone scepter or compact polished bronze mirror disk; only this faction may use a mirror in this prompt. Side-laid reference object: one hardstone scepter or mirror focus beside the pair, complete and readable. Avoid sun disks, human-face motifs, eight-spoked wheels, readable writing, pharaoh costume cliches, and gold overload.

ANTI-CLUTTER BLOCK
No text, labels, UI, watermarks, frames, scenery, magical glow, dangling chimes, bells, fragile chains, loose coin curtains, repeated sun/wheel/human-face motifs, gorget amulets, belt-skirts, modern shoes, zippers, guns, sci-fi tech, steel, iron plate, chainmail, or medieval wizard costume. Every focus must be a distinct offhand object family; do not give all four factions mirrors.
```

## Prompt 4 - Nile-Ziggurat Mage Tier Progression, Separate Images v2

```text
Generate 3 separate images. No commentary.

TITLE / PURPOSE BLOCK
Photorealistic Bronze-Age ARPG Source Pair Calibration: Nile-Ziggurat Mage Tiers 1-3, v2

Create three separate polished character-reference images. Each image contains exactly two full-body adult fantasy Mages from the same Nile-Ziggurat Horn Palace faction: one female-presenting Mage and one male-presenting Mage at the same tier. Image 1 is Tier 1, image 2 is Tier 2, image 3 is Tier 3. These images are source references for later extracting inventory item icons.

GLOBAL STYLE BLOCK
Use crisp ultrafine photorealistic 3D game render quality with physically believable materials and clean studio clarity. Strong upper-left key light, deep neutral shadows, cool rim light, sharp bronze and copper highlights, brass glints, bitumen-black leather absorption, lapis-blue cloth, linen weave, bone or ivory inlay, polished hardstone depth, and no painterly brush texture. Stark white or pale blue-gray studio background only. No labels, no UI, no scenery, no frames.

FACTION DESIGN LANGUAGE BLOCK
The faction is an ancient river-palace and ziggurat city culture with darker warm skin tones, bronze, copper, brass, lapis-blue cloth, linen, bitumen-black leather, ivory or bone inlay, hammered geometric plates, reed-woven details, and palace-craft austerity. It draws loosely from Egyptian, Babylonian, Coptic, and Ethiopian-adjacent ancient visual grammar without copying sacred symbols. The body and silhouette language is tall, formal, monumental, treasure-weighted, and increasingly burdened by earthly wealth as tiers rise. Avoid sun disks, winged sun motifs, eight-spoked wheels, human-face centerpieces, readable writing, pharaoh costume cliches, all-over gold, sci-fi glow, or medieval robes.

CLASS BLOCK
Every character is a Mage. Mage gear should read as intelligence-focused, ritual, precise, and protective through warding rather than heavy plate. Use layered linen, structured robe armor, bronze or copper chest pieces, hardstone pendant amulets, offhand ritual foci, compact scepters, mirror disks only when assigned, headwraps or bronze brow pieces, light hand protection, horizontal belts, and light protective sandals. Do not make them Warriors with massive shields, Rogues with stealth knives, Hunters with bows, Druids with organic animal skins, or Bards with instruments.

UNISEX EQUIPMENT BLOCK
All Mage equipment bases are unisex. Female-presenting versions may be fitted and body-shaped; male-presenting versions may be broader or more rectangular. But both use the same coverage, protection level, construction, materials, and slots. Do not split the set into revealing female robes and covered male robes.

TIER 1 IMAGE BLOCK
Tier 1: apprentice canal-rite gear, lowly and scavenged but serious. Plain linen, simple copper wire, bitumen-black leather cord belt, small stone pendant on twine, basic reed or wood focus, plain wrist wraps, and modest sandals. Belt progression: rough horizontal leather cord. Amulet progression: small unpolished stone pendant. Focus progression: simple handled reed/wood object, not a mirror. Outer layer: plain short linen shoulder cloth. Hands and feet: minimal wraps and sandals.

TIER 2 IMAGE BLOCK
Tier 2: trained palace rite-worker gear. Better linen layers, bronze or copper structured chest harness over robe armor, lapis cloth trim, polished hardstone pendant, compact scepter or small mirror focus, reinforced horizontal belt, bracers, and clear sandals. Belt progression: fitted leather-and-bronze belt with one pouch or plate. Amulet progression: polished hardstone pendant large enough to read. Focus progression: bronze scepter or mirror disk, complete and hand-held. Outer layer: structured linen mantle. Hands and feet: leather bracers and reinforced sandals.

TIER 3 IMAGE BLOCK
Tier 3: elite court Mage gear, dazzling but not supernatural. Refined bronze, copper, and brass fittings, deep lapis cloth, black leather structure, carved hardstone focus, clean geometric inlay, authoritative headpiece, complete robe armor, and a few bright gold highlights on pendant, belt center, or focus edges only. Belt progression: broad palace belt with bronze/brass geometry, still horizontal and not a skirt. Amulet progression: large polished lapis, carnelian, or hardstone pendant on cord or simple chain. Focus progression: substantial hardstone scepter or palace mirror focus with visible grip. Outer layer: formal lapis-and-linen shoulder mantle. Hands and feet: finished bracers and ornate but usable sandals.

SIDE-LAID ITEM REFERENCE BLOCK
Each image must include one side-laid offhand focus or ritual tool next to the pair as an authoritative object reference. It can be a reed focus at Tier 1, bronze scepter or small mirror at Tier 2, and hardstone scepter or palace focus at Tier 3. It must be complete, uncropped, and visibly usable as an inventory item. Do not turn it into a vague glowing idol or boring flat tablet.

ANTI-CLUTTER BLOCK
No dangling chains everywhere, no bells, no chimes, no fragile coin curtains, no repeated sun or human-face motifs, no gorget amulets, no belt-skirts, no readable writing, no modern jewelry density. Amulets are pendants on cord or simple chain. Belts are horizontal. Foci belong to the off-hand slot. No modern shoes, zippers, guns, sci-fi tech, steel, chainmail, or medieval wizard robes.
```

## Prompt 5 - Four Factions Body And Gear Silhouette Sheet, Single Collage v2

```text
Generate one single image, no commentary.

TITLE / PURPOSE BLOCK
Photorealistic Bronze-Age ARPG Silhouette Calibration Sheet: Four Factions, Tier 2 Source Pairs

Create one polished character-exploration collage containing exactly eight full-body adult fantasy characters: one female-presenting and one male-presenting Tier 2 character from each of four factions. This is a silhouette and faction-read sheet, not an item extraction batch. Arrange the eight characters as four clearly separated pairs inside one image. No text labels, no UI, no frames, no captions, no borders, no scenery, and no props behind them.

GLOBAL STYLE BLOCK
Use ultrafine photorealistic 3D game character-render quality with crisp AAA asset clarity. Studio lighting with strong upper-left key light, deep neutral object shadows, and cool rim light. Use a stark white or pale blue-gray studio background. Keep every full body readable and separated. Do not collapse everyone into the same pose, same dark value, same cloak shape, or same armor silhouette.

UNISEX EQUIPMENT BLOCK
All equipment bases are unisex. Female-presenting and male-presenting versions can fit different bodies, but they must share coverage, protection level, construction, material logic, and slot identity. Use fit variation, not different gear categories.

PAIR 1: NORTHERN BRONZE HOUSES
Character class: Warrior.
Body/silhouette target: broad, sturdy, poised, grounded, formally layered, shawled, and mantle-forward.
Gear target: pale hemmed wool and linen, madder-red and indigo woven borders, bright polished bronze, pale wood, polished horn, clean russet leather, one restrained amber pendant, a tailored rectangular mantle, clean low boots, pale-hide oval shield, and a leaf-bladed bronze short sword or heavy knife. The cloak/shawl slot must be visually important. Keep the ensemble crisp and high-value; avoid Viking, medieval, all-dark, or survivalist signals.

PAIR 2: RED MESA-RAINFOREST CONFEDERACY
Character class: Rogue.
Body/silhouette target: compact, athletic, predatory, fast, angular, shield-compact.
Gear target: red clay cotton, obsidian, shell, hardwood, greenstone/turquoise accents, stepped fantasy-Aztec hardstone shapes, compact carved offhand, short obsidian blades, low footwear, fitted bracers. Use Salish/Karui-like massing only in wood, shell, shield outline, and greenstone weight. Avoid carnival feathers and copied ceremony.

PAIR 3: STEPPE-SAND ROAD HOUSES
Character class: Mage.
Body/silhouette target: taller, lean, austere, travel-worn, robe-edged, sash-forward, scarfed, mobile.
Gear target: felt, leather, lamellar fragments, bronze fittings, horsehair cord, desert head cloth, robe-like over-mantle, wrapped sash, travel cloak, compact pronged bronze focus inspired by double-ended ritual implement structure, not literal copied sacred iconography. Add Arabian desert clothing cues in scarf, robe, sash, and cloak while keeping the broader trade-road blend.

PAIR 4: NILE-ZIGGURAT HORN PALACES
Character class: Mage.
Body/silhouette target: tall, monumental, formal, treasure-weighted, frontal, slower and heavier than the others.
Gear target: bronze, brass, copper, bitumen-black leather, lapis-blue linen, ivory or bone inlay, hardstone pendant, palace belt, a few bright gold highlights, compact scepter or mirror focus. This pair should feel ordered and palace-crafted, with a vice of being weighed down by earthly treasures. Avoid sun disks, human faces, eight-spoked wheels, readable writing, and pharaoh costume cliches.

VARIATION REQUIREMENT
The four pairs must be distinguishable from silhouette alone before color is considered. Vary height impression, stance, body mass, cloak shape, shoulder line, belt shape, footwear weight, weapon/offhand family, and headgear. Do not solve the factions only by changing accent colors. Do not give everyone mirrors, spears, axes, identical robes, identical helmets, or identical dark leather outfits.

ANTI-CLUTTER BLOCK
No text, labels, UI, watermarks, frames, scenery, magical glow, dangling chimes, bells, fragile chains, loose coin curtains, repeated sun/wheel/human-face motifs, gorget amulets, belt-skirts, modern shoes, zippers, guns, sci-fi tech, steel, iron plate, chainmail, or medieval costume.
```
