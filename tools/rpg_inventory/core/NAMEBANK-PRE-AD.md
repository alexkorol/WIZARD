# Pre-AD Martial Equipment Namebank

Distilled from Alexei's 2026-07-08 research report. This is not the full
source report; it is the production-facing vocabulary for Verdigris item
planning and prompt filters.

## Core Rule

For ordinary base items, prefer prehistoric, Chalcolithic, Bronze Age, and
early pre-AD archaeological forms over familiar medieval fantasy arms. Prompt
with construction language, not generic fantasy labels.

Strong prompt pattern:

`item name + construction term + material + period/culture cue`

Examples:

- `flange-hilted bronze sword with rivet-holes and leaf-shaped blade`
- `Shang bronze ge dagger-axe with central ridge and beveled edge`
- `looped socketed bronze spearhead with peg holes`
- `beaten sheet-bronze shield with concentric ribs and central boss`

## Core Inventory Candidates

Use these as ordinary or ladder-ready inventory forms when the visual thesis is
strong enough:

- Stone and deep prehistory: Oldowan chopper/core tool, Acheulean handaxe,
  wooden thrusting spear, hafted stone point, hammerstone, sharp flake.
- Neolithic/Chalcolithic: polished stone axe/celt, stone mace-head, flint
  dagger, barbed-and-tanged arrowhead, hafted axe/adze, bannerstone as attached
  atlatl gear rather than standalone loot.
- Predynastic / early river cultures: fishtail flint knife, practical
  ripple-flaked knife variants, pear-shaped or disk mace-heads.
- Bronze Age Near East and Egypt: dagger, tanged spearhead, bronze battle-ax,
  bronze sword, sickle-sword, bronze spearhead, crescent axe.
- Bronze Age Cyprus and Aegean: bronze dagger blade, hooked tang dagger,
  riveted dagger, leaf-shaped spearhead, simple bronze sword.
- Bronze Age Atlantic/Europe: Bronze Age halberd, rapier, dirk, octagonal
  sword, flange-hilted sword, palstave axe, socketed axe, looped spearhead,
  sheet-bronze shield, bronze helmet.
- China and eastern pre-AD: `ge` dagger-axe, `mao` spearhead, Chinese
  bronze halberd/ge-family polearm, straight bronze sword, piece-mold cast
  bronze weapons.
- Indus / South Asian Bronze Age: copper or bronze axes, adzes, knives, spears,
  harpoons as carefully filtered candidates; many elite copper-hoard pieces are
  better treated as votive/rare.
- Armor and defense: bronze helmets, sheet-bronze shields, hide-over-wood
  shields, scale armor, simple cuirasses, layered textile/hide armor.

## Rare Or Ceremonial Bucket

Move these toward uniques, awakened relics, boss loot, shrine offerings,
princely grave goods, or faction prestige sets. They are usually wrong as
common shop/vendor bases:

- Oversized or blunt ceremonial dirks.
- Ripple-flaked display knives and prestige fishtail knives.
- Gold daggers, gold axes, precious-metal weapons.
- Jade ritual axes and jade dagger-axes.
- Greenstone atlatl grips and greenstone maces as funerary/elite forms.
- Copper-hoard antennae swords, soft copper harpoons, and low-wear votive
  pieces.
- Decorated prehistoric mace-heads framed as badges of power.
- Nested/hoarded bronze helmets.
- Decorated shield facings such as prestige river-offering shields, when the
  object is a facing rather than a field shield.

Production filter: if the source emphasizes blunt edges, oversized scale,
precious material, pristine lack of wear, wrapping, votive context, funerary
context, or display workmanship, do not treat it as a common base.

## Construction Lexicon

Useful positive prompt terms:

- `hafted`: head/blade mounted to a handle or shaft.
- `tang`, `tanged`, `hooked tang`: blade extension for grip/hafting.
- `rivet-holes`: attachment holes for organic hilt plates or hafts.
- `hilt plates`: wood/bone side panels attached to a metal core.
- `flange-hilted`, `side flanges`: raised metal sides framing an organic grip.
- `socketed`: hollow socket receives shaft.
- `looped`: side loop for lashing or securing a head to a haft.
- `stop-ridge`: raised brace on a palstave axe.
- `hafting plate`: broad base for riveted shaft mounting.
- `midrib`, `central ridge`, `raised spine`: blade reinforcement.
- `leaf-shaped`: period-correct blade profile for many swords, daggers, and
  spearheads.
- `ricasso`: can be Bronze Age when specified, not automatically medieval.
- `lenticular section`: lens-shaped blade cross-section.
- `bifacial`, `bifacial retouch`: flaked on both faces, good for flint.
- `ripple-flaked`: premium Predynastic/Egyptian prestige detail; do not use as
  a generic Stone Age texture.
- `barbed-and-tanged`: strong arrowhead/projectile term.
- `trilobate`: late pre-AD arrowhead form, not a Bronze Age default.
- `beaten sheet bronze`: shields and helmets, not solid cast blades.
- `cast`, `hammered`, `piece-mold casting`, `lost-wax casting`: craft terms.
- `scale armor`: ancient as well as medieval; use cautiously and specify the
  ancient/pre-AD context.

Avoid relying on `hiltless` as a formal name. If the visual goal is a blade
whose organic grip is gone or minimal, prefer `tanged blade with missing organic
grip`, `flange-hilted blade with rivet-holes`, or `organic hilt plates lost`.

## Medieval Defaults To Suppress

For Bronze Age and earlier default prompts, suppress:

- great helm, bascinet, camail, close helmet, visored helmet
- brigandine, gambeson, jupon, arming doublet
- developed pauldrons, pasguards, couters, sabatons, articulated plate harness
- cross-hilt sword, knightly arming sword, longsword defaults
- crossbow
- heater shield
- full plate armor
- hauberk/coif/chausses-style chainmail imagery unless the tech tier is
  explicitly reintroduced

## False Friends

Do not blanket-ban these, but always disambiguate:

- `halberd`: Bronze Age Iberian transverse/riveted hafting-plate weapon is valid;
  medieval Swiss/German halberd silhouette is not.
- `rapier`: Bronze Age thrusting blade is valid; Renaissance civilian rapier is
  not.
- `cuirass`: ancient bronze cuirasses are valid; later steel breast-and-back
  plate systems are not default.
- `mail`: ancient mail exists, but Verdigris mail/rivetmail is paused until
  explicitly reintroduced.
- `ricasso`: valid on some Bronze Age swords when described as Bronze Age.
- `celt`: use `axe celt` or `celt axehead` to avoid ethnic/style confusion.
- `Chinese halberd`: prefer `ge dagger-axe` or `Chinese ge/halberd` with
  Warring States/Shang context; avoid medieval European halberd silhouettes.

