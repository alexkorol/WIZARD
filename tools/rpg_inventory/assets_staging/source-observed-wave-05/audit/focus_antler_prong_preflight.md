# Wave 05 preflight: `focus_antler_prong`

## Decision

**REJECT; do not generate or regenerate.**

British Museum St/D.86 does not support the queued object. The official
catalog identifies the artifact as an antler macehead, and the official image
shows one incomplete length of antler main beam with a large shaft
perforation near its broad end. It is not a complete double-ended rite
implement, does not have opposed terminal prongs, and does not have a thick
central grip.

The source-observed object also fails the game-roster gate as a standalone
rite focus. At 225 mm long and 297.8 g, the surviving head is a small
perforated component rather than a substantial P 1x3 handheld item. Making it
functional requires a separate shaft through the perforation, which moves the
concept into the club/mace family already represented by
`wpn_club_antler_shafthole`. The rite-focus proposal therefore combines a
source mismatch with an existing-roster collision.

Failure taxonomy:

- **source mismatch:** invented opposed ends and central grip;
- **unsupported reconstruction:** transforms broken tine/beam remnants into a
  complete symmetric object;
- **wrong equipment identity:** macehead construction relabeled as an offhand
  rite focus;
- **weak standalone prop:** the surviving 22.5 cm head cannot carry P 1x3
  presentation without invented extension;
- **duplicate/redundant silhouette:** both the antler mace role and the
  double-ended pronged focus role are already occupied;
- **existing rejected derivative:** a staged image already embodies the
  unsupported interpretation and must not be regenerated.

## Official source

- British Museum object: St/D.86, object type **macehead**, found at Kew in the
  River Thames, broadly dated Neolithic/Bronze Age.
- Catalog description: one antler macehead with a perforation on the main
  beam; a long portion of the main beam remains.
- Material: antler.
- Dimensions: length 225 mm, width 85 mm, weight 297.80 g.
- Object record:
  <https://www.britishmuseum.org/collection/object/H_St-D-86>
- Official image record:
  <https://www.britishmuseum.org/collection/image/1613844723>
- Downloaded official preview:
  `references/british_museum_St-D-86_asset_1613844723.jpg`
  (677x450 RGB; SHA-256
  `680d039b6a21b1851a9f9b8736b110605952ee4f2573e6273043d584c9d422e5`)

The museum record and image are primary sources for the surviving object's
classification, material, scale, broad chronology, and observable geometry.
They are not reconstruction evidence for a complete weapon, haft, ritual use,
or double-ended focus. The broad catalog date must not be narrowed.

## Observed construction

The official photograph shows:

- one roughly horizontal antler main-beam/burr segment;
- one large circular-to-oval perforation through the broad end, consistent
  with the catalog's macehead classification;
- a long, mostly straight beam portion ending at a flat broken/cut edge;
- several short broken tine or branch remnants around the broad end;
- irregular natural antler surface and asymmetric organic geometry;
- no central handgrip, bindings, haft, fittings, opposed forked terminals,
  face, inscription, or sacred symbol.

The macehead itself is one piece of antler. A complete usable mace would not
be a one-piece object: it would need a separate shaft passing through the
perforation. “One-piece antler construction” therefore cannot be used to
justify the queued double-ended focus.

## Grid and framing

- Queued generator canvas: **P**.
- Queued runtime footprint: **1x3**.
- Source compatibility: **fails**.

The surviving object is only 225 x 85 mm and reads as a compact horizontal
macehead/component. A tall P canvas and 1x3 footprint become plausible only
after adding a long haft or inventing a vertically elongated symmetric body.
The first changes the item into a mace; the second contradicts the source.

## Prior-art and roster audit

Visual audit sheets:

- `audit/focus_antler_prior_art_01.jpg`
- `audit/focus_antler_prior_art_02.jpg`

The sheets cover 48 relevant impact, ritual, mace, club, focus, prong, sceptre,
sistrum, and ladle images from current assets, staging, the post-calibration
roster, and balanced-output folders.

Direct collisions:

- `wpn_club_antler_shafthole` already cites the exact same St/D.86 source and
  occupies the antler shaft-hole mace/club concept. Its mapped reuse candidate
  is
  `C:\Users\Alex\Downloads\items_multi_context_balanced_v1\faction_north - DEX - tier 2\04__impact.png`.
  That art itself needs source-construction review because it adds collars,
  cord, and a haft not shown in the official image, but its existence makes a
  second item from the same artifact especially unjustified.
- `focus_bronze_prongs` already supplies the double-ended heavy pronged
  rite-focus silhouette through
  `C:\Users\Alex\Downloads\items_multi_context_balanced_v1\faction_dustwind - STR - tier 2\05__ritual.png`.
- `focus_skymetal_rod` occupies another high-tier double-ended pronged rod
  concept.
- `warbanner_forked_stave` also cites St/D.86, explicitly as a lore-archaic
  invention. It cannot be treated as further historical proof and shows that
  this one source is already overextended in the roster.

An existing staged derivative is present at:

- `assets_staging/focus_antler_prong.png`
  (1024x1536 RGB; SHA-256
  `3b5fefcd2955bfd18d7a22ee474cd4386af6d714374401316d944a10326e6d2e`)

Direct inspection shows a large symmetric double-ended antler implement with
mirrored forked terminals, a leather-wrapped central grip, and added cord. It
does not reproduce St/D.86's perforation, compact macehead form, broken beam,
or asymmetric surviving geometry. Treat it as a preserved rejected derivative,
not as precedent and not as a reason to regenerate.

## Locks and hazards

- Lock the museum classification to **perforated antler macehead**.
- Lock the observed object to one asymmetric antler beam/burr segment with a
  prominent shaft hole and broken/cut ends.
- Lock chronology to the catalog's broad **Neolithic/Bronze Age** range.
- Do not claim ritual, ceremonial, offhand, sceptre, wand, or focus use.
- Do not infer a complete haft, handle length, lashings, collars, or mounting
  method from the head alone.
- Do not mirror, duplicate, lengthen, or “restore” broken remnants into
  opposed prongs.
- Do not reinterpret the perforation as decoration or omit it.
- Do not add a central grip, leather wrap, cord, bronze fittings, face, sacred
  symbol, inscription, glow, gemstone, or fantasy ornament.
- Do not use P 1x3 framing for the unhafted source object.
- Do not generate a new item merely because the source object is visible,
  unusual, or can be assigned a taxonomy label.
- If St/D.86 remains in the roster at all, reserve it for a separately audited
  mace/club reconstruction and require evidence for every added component.

No prompt was prepared and no generation was performed in this audit.
