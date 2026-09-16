# Base Family Matrix (class x tier x faction)

Status: local-only, gitignored. Parsed by `build_calibration_prompt.py`.
Format is strict: `## <class>` / `### tier <n>` / `- <faction-key>: <text>`.
Faction keys: northern, cedar, silkroad, nile.

Authoring rules (from the failure-mode notes):

- Amulets are PENDANTS on cord/thong/twine, never collars, gorgets, or neck
  armor (AGENTS 2026-07-08; the 07-08 batch drifted almost every amulet into a
  collar).
- Belts are horizontal waist items; say "waist belt" or "waist cord".
- Every tier changes every slot, not just the weapon and torso
  (STYLE-EXPERIMENTS slot-progression rule).
- Mage foci follow the per-faction focus families in PROMPT-BLOCKS (no
  mirror/disc convergence).
- Signature weapons per faction; no spear/axe defaults (WRAPUP weapon
  language).
- ASCII only.

## warrior

### tier 1

- northern: simple bright-bronze heavy knife, pale rawhide round shield, plain russet-hide waist belt, small horn or amber pendant on a linen cord, single russet-hide wrist guard, natural pale-wool leg wraps with a narrow madder edge, and at most a rough natural-linen shoulder strip
- cedar: crude carved war club or short obsidian-edged club, plain rawhide or carved wood guard, woven fiber waist belt, small shell pendant on a fiber cord, single copper wrist band, fiber leg wraps, bare feet or simple hide sandals
- silkroad: simple curved bronze knife or hooked chopping blade, compact rawhide or lacquer-scrap shield, knotted cord waist belt, dark stone bead pendant on a silk cord, wrapped forearms, felt-and-leather foot wraps
- nile: simple bronze mace or short sickle-knife, reed-backed or bronze-rimmed guard, plain black leather waist belt, single carnelian or faience pendant on a linen cord, linen arm wraps, flat leather sandals

### tier 2

- northern: leaf-bladed bronze short sword, pale-hide oval shield with clean bronze edging, copper-plated russet-leather waist belt, amber pendant on a linen cord, matched materially continuous russet-hide combat mitts with doubled palms and corded seams, pale-wool leg wraps with russet boots, and a hemmed natural-wool half-mantle with separate madder-crimson and spruce-green border bands
- cedar: obsidian-edged club-sword or carved war club, hide or carved wood shield, shell-inlaid leather waist belt, greenstone pendant on a fiber cord, matched materially continuous woven-fiber and hide mitts with doubled palms, woven greaves with hide sandals
- silkroad: curved bronze sword or heavy hooked blade, compact neutral-black lacquered shield, silk-cord-and-leather waist belt, carnelian pendant on a silk cord, matched padded felt-and-hide mitts with dense quilting and short soft wrist cuffs, felt-and-leather leg protection with wrapped boots
- nile: bronze mace or short sickle-sword, tall or compact bronze shield, black leather waist belt with bronze fittings, carnelian pendant on a linen cord, matched closed-finger linen-and-leather gloves with short bronze wrist plates, structured leather sandals or low greaves

### tier 3

- northern: polished broad leaf-bladed bronze sword, reinforced pale-hide oval shield with bright bronze facing details, horizontal bronze-plaque waist belt over russet backing, one set amber pendant on a substantial linen cord, matched true segmented bronze half-gauntlets with contiguous articulated backhand and knuckle construction over subordinate russet lining, pale-wool and bronze greaves with clean russet boots, and a full patterned rectangular mantle in bone white with spatially separate madder-crimson, spruce-green, and golden-ochre bands
- cedar: refined obsidian-edged club-sword or carved war club, shell-inlaid wood shield, shell-and-copper plated waist belt, set greenstone pendant on a fiber cord, matched articulated copper half-gauntlets with complete hide hand cages on cedar-fiber backing, woven greaves with hardened hide sandals, cedar-fiber rain mantle
- silkroad: refined curved bronze sword or heavy hooked blade, compact reinforced neutral-black lacquered shield, plaqued silk-cord waist belt, set carnelian pendant on a silk cord, matched brass-and-leather half-gauntlets with articulated backhand and knuckle plates, felt-and-leather greaves with wrapped boots, felt travel mantle with separate saffron, crimson, and deep-mulberry borders
- nile: polished bronze mace or short sickle-sword, refined bronze-faced shield, black leather waist belt with bronze plates, set carnelian pendant on a linen cord, matched bronze half-gauntlets with articulated backhand plates over complete white-linen hand cages, structured greaves, white linen mantle with brass pins

## rogue

### tier 1

- northern: single compact bronze knife, small pale-hide wrist guard as offhand, low russet-leather waist belt, bone or amber sliver pendant on a linen cord, single pale-linen forearm wrap, natural-wool leg wraps with simple hide soles, and a narrow hemmed shoulder strip
- cedar: crude obsidian knife or compact carved club, rawhide arm guard as offhand, low woven fiber waist belt, small shell pendant on a fiber cord, single fiber wrist wrap, fiber leg wraps with bare feet
- silkroad: simple curved dagger or hooked knife, compact felt-wrapped guard, low knotted cord waist belt, dark stone bead pendant on a silk cord, wrapped forearms, soft foot wraps
- nile: simple bronze dagger or short sickle-knife, reed or leather arm guard, low black-leather waist belt, small faience bead pendant on a linen cord, linen wraps, flat leather sandals

### tier 2

- northern: paired narrow bright-bronze knives, small pale-hide buckler with a clean bronze rim, low fitted russet-leather waist belt with one pouch, amber pendant on a linen cord, fitted closed-finger russet-leather gloves, pale-wool wraps with soft leather boots, and a short hemmed half-shawl with a madder border
- cedar: paired obsidian knives, compact carved club or small hide buckler, low shell-inlaid leather waist belt, greenstone pendant on a fiber cord, fitted closed-finger woven-fiber gloves with hide palms, woven fiber leg wraps with soft hide footwear
- silkroad: paired curved daggers or hooked knives, compact wrist buckler, low silk-cord-and-leather waist belt, carnelian bead pendant on a silk cord, short neutral-black lacquered wrist cuffs, soft wrapped boots
- nile: paired short sickle-knives or bronze daggers, compact bronze buckler or offhand hook tool, low black-leather waist belt with pouches, carnelian pendant on a linen cord, linen hand wraps ending in short black-leather wrist cuffs, soft leather sandals

### tier 3

- northern: slender polished bronze short sword with a compact matching offhand knife, small reinforced pale-hide buckler with bright bronze edging, low horizontal bronze-plaque belt over russet leather, one set amber pendant on a substantial linen cord, matched materially continuous russet-hide mitts with reinforced seams and doubled knuckle zones, pale-wool leg wraps with reinforced soft boots, and a tailored short mantle with separate clean madder-crimson and golden-ochre woven borders
- cedar: paired refined obsidian knives, shell-inlaid compact club or reinforced hide buckler, low shell-and-copper waist belt, set greenstone pendant on a fiber cord, matched materially continuous hide and woven-fiber mitts with doubled palms, woven wraps with hardened hide footwear, short cedar-fiber shoulder cloak
- silkroad: paired refined curved daggers or hooked knives, compact neutral-black lacquered wrist buckler, low plaqued silk-cord waist belt, set carnelian pendant on a silk cord, matched fitted closed-finger gloves with small neutral-black lacquered backhand plates, reinforced soft wrapped boots, short felt travel cloak with a bounded saffron lining and crimson edge
- nile: paired refined short sickle-knives or bronze daggers, compact polished bronze buckler or hook tool, low black-leather waist belt with bronze fittings, set carnelian pendant on a linen cord, matched fitted linen-and-hide mitts with dense wrapped wrist bands and no hard plaques, structured soft sandals, short black leather half-cloak

## mage

### tier 1

- northern: small irregular raw amber nodule in a simple open bronze hand cradle as the sole amber focal object, small polished horn pendant on a linen cord, narrow russet-hide waist cord, single copper wrist band, rough natural-wool shoulder strip, and pale linen foot wraps
- cedar: crude woven spirit-hoop with a shell rattle as hand focus, greenstone chip pendant on a fiber cord, narrow woven waist cord, single cedar-fiber wrist wrap, bark-cloth shoulder strip, bare feet or hide soles
- silkroad: short rough-cast double-ended pronged bronze implement as hand focus, dark stone bead pendant on a silk cord, narrow knotted cord waist belt, single brass wrist ring, felt shoulder strip, soft foot wraps
- nile: small hardstone scepter with an unpolished finial as hand focus, faience bead pendant on a linen cord, narrow black leather waist cord, linen hand wraps, white linen shoulder strip, flat leather sandals

### tier 2

- northern: substantial irregular polished amber hand focus in an open bright-bronze cradle as the sole amber focal object, small chased bronze lozenge pendant on a linen cord, narrow russet-leather waist belt, matched copper wrist bands, structured pale-wool half-mantle with a madder border, and hide-soled linen foot wraps
- cedar: woven spirit-hoop with shell and greenstone as hand focus, greenstone pendant on a fiber cord, narrow woven waist belt, fiber-and-copper wrist wraps, bark-cloth half-mantle, hide sandals
- silkroad: double-ended pronged bronze implement as hand focus, carnelian or dark-stone pendant on a silk cord, narrow silk-cord waist belt with a few neutral-black lacquered plaques, brass wrist rings, felt half-mantle, soft wrapped boots
- nile: hardstone scepter with a lapis or carnelian finial as hand focus, carnelian pendant on a linen cord, narrow black leather waist belt with clay-seal fittings, linen-and-leather hand wraps, white linen half-mantle, structured sandals

### tier 3

- northern: refined irregular amber hand focus in a polished handled bronze setting as the sole amber focal object, polished horn-and-bronze pendant on a substantial linen cord, narrow horizontal bronze-fitted russet belt, matched short chased-bronze wrist cuffs, full structured rectangular wool mantle with separate spruce-green, madder-crimson, and golden-ochre woven borders, and clean russet boots with pale-wool uppers
- cedar: polished obsidian mirror disk in a carved wood ring as the high-tier focus, set greenstone pendant on a fiber cord, narrow shell-and-copper waist belt, matched fiber-and-copper wrist wraps, full cedar-bark rain mantle, hardened hide sandals
- silkroad: refined double-ended pronged bronze implement with a silk-cord grip as hand focus, set carnelian pendant on a silk cord, narrow plaqued silk-cord waist belt, matched brass wrist rings, full felt-and-wool mantle with separated saffron, deep-mulberry, and crimson woven fields, reinforced wrapped boots
- nile: polished hardstone scepter with a lapis finial as hand focus, set lapis-and-carnelian pendant on a linen cord, narrow black leather waist belt with bronze seal fittings, matched linen-and-leather hand wraps, full white linen mantle with brass pins, structured leather sandals
