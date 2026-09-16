# Wave 05 preflight: `trapkit_weighted_net`

## Decision

**REJECT as queued; do not generate.**

British Museum EA87195 proves one small perforated clay net-sinker, not a
complete net and not a portable trap kit. A separate British Museum object,
EA36886, proves a gathered ancient Egyptian flax net, while a reviewed
Stonewood DEX T1 character shows a weighted net draped over the shoulder and
held loose. Taken together, these sources can support the broad existence and
carried silhouette of a weighted net. They do not support the queued stiff
leather backing, two setting pegs, separate retrieval-cord coil, tidy folded
presentation, or a row of EA87195-shaped sinkers secured by a known attachment
method.

The observed complete-net references read as fishing or general catching nets,
not prepared trap kits. The strongest reviewed character also carries an
oversized fish hook. Adding a carrier board and trap-setting components solely
to force the object into the `trap_kit` taxonomy would be speculative item
invention. Visibility in a character image and a taxonomy label do not make
the composite roster-worthy.

Failure taxonomy:

- **partial-source substitution:** one sinker is treated as evidence for a
  complete multi-component kit;
- **unsupported composite:** leather backing, pegs, separate cord coil, folds,
  attachment pattern, and component organization are invented;
- **unsupported load path:** no source shows how EA87195 is tied to a net hem;
- **wrong roster identity:** available evidence supports fishing/catching gear,
  not a prepared land-trap kit;
- **incidental/recurrent character prop:** loose nets and weighted cords recur
  across reviewed DEX loadouts without establishing a distinct kit;
- **grid-driven invention:** the board appears necessary to make the loose net
  read as a bounded S 2x2 icon, rather than following observed construction.

## Exact source: British Museum EA87195

- Object type: **net-sinker**.
- Museum number: EA87195; registration number 2016,1001.1091.
- Description: handmade cylindrical clay net-sinker with a regular
  perforation; the perforation edge is irregular; smooth, lightly burnt,
  dark-brown surface.
- Culture/period: New Kingdom.
- Findspot: Amara West, Nubia.
- Material: fired clay.
- Dimensions: maximum diameter 1.80 cm; perforation diameter 0.30 cm; maximum
  length 3.20 cm; weight 9.10 g.
- Object record:
  <https://www.britishmuseum.org/collection/object/Y_EA87195>
- Official image record for the first view:
  <https://www.britishmuseum.org/collection/image/1613352896>
- Local official views:
  - `references/british_museum_EA87195_view_b.jpg`
    (1000x907 RGB; SHA-256
    `5d42462a616f7084ab7bbff2d494833922d95d882b8f036915f9f6d751d14ff1`)
  - `references/british_museum_EA87195_view_a.jpg`
    (1000x907 RGB; SHA-256
    `9f853836810f18db0e2bae02f35f2e1ed5945a57b8f3c1257cd48c8cd9832d75`)

The end and side views show one short, irregular, roughly cylindrical clay
object. One view exposes the central bore; the other proves the thick,
slightly tapered side profile. There is no cord, knot, net, group of sinkers,
carrier, peg, backing, or retrieval line.

**Source role:** primary evidence for one sinker's material, scale, period,
surface, bore, and asymmetric handmade geometry. It does not prove a sinker
row, attachment direction, knot, spacing, net structure, or kit.

## Corroborating complete-net source

British Museum EA36886 is cataloged as a bird-net (?) or fishing-net (?): a
flax-cord net, presumably used for fishing or bird catching, found/acquired at
Thebes. Its catalog period is only “Ancient Egypt.” Its gathered dimensions
are 44 cm long, 51.5 cm wide, and 9.5 cm high.

- Object record:
  <https://www.britishmuseum.org/collection/object/Y_EA36886>
- Local official views:
  - `references/british_museum_EA36886_view_1.jpg`
    (1000x750 RGB; SHA-256
    `05abc5d5f5166cee124235a564d0ed224f5566501968049b222d71d97b5f9e27`)
  - `references/british_museum_EA36886_view_2.jpg`
    (1000x750 RGB; SHA-256
    `74f7dae1ad400227f569c96cee1a19498544f4168022fd5054cff39da9871fdf`)
  - `references/british_museum_EA36886_view_3.jpg`
    (1000x743 RGB; SHA-256
    `e61569863a8280f93431874e32e989a126e233f046143007bc1c4c5269f350d3`)

The official views show a soft gathered mass of fine flax mesh. One comparison
view includes bundled netting and a short loose cord. No sinkers, weights,
pegs, stiff backing, or organized kit are visible.

**Source role:** primary evidence for ancient Egyptian flax-net material,
mesh, soft-body behavior, and gathered volume. It is not securely New Kingdom
in the catalog and does not prove EA87195 attachment or a trap-kit assembly.

## Reviewed project reference

The current ladder contains:

`C:\Users\Alex\Downloads\ladders\faction_stonewood - DEX - tier 1\022__p2__9ec785e6-052f-48ea-b0c8-8f83004f032c.png`

Durable local copies:

- `references/reviewed_stonewood_dex_t1_weighted_net_crop.png`
  (438x1055 RGB; SHA-256
  `b4f0f87aec2f3323d66ccdc1f043cbfaac05d2ac90ae206628f6fd3abfb892d4`)
- `references/reviewed_group_9ec785e6_weighted_net_context.png`
  (1491x1055 RGB; SHA-256
  `b81579efc0f60854e5f4b402c4cdab3a36ae892a325bea34cda7ee061430eb31`)

The character wears a coarse open net across one shoulder and torso, holds a
long loose portion at the side, and has several rounded heavy weights tied
along the lower hem. This is a strong observed weighted-net silhouette and
carry mode. It shows no fold, backing, pegs, separate retrieval coil, case, or
bounded kit. The large hand hook and the net together read as fishing gear.
The rounded weights do not match EA87195's short cylindrical profile.

**Source role:** reviewed game-art evidence for a loose equipped weighted net
and its gravity behavior. It is not archaeological evidence and cannot prove
the weights' clay material, chronology, knots, or use as a land trap.

## Roster and grid gate

- Queued generator canvas: **S**.
- Queued runtime footprint: **2x2**.
- Source compatibility: **fails as written**.

A compact net can occupy a square, but the official flax net reads as a soft,
irregular tangle when gathered. The reviewed equipped net reads as a tall
draped mesh. Neither produces the queued bounded square kit. The stiff backing
and arranged components are doing the visual work required for S 2x2, yet
those are exactly the unsupported elements.

The full net is mechanically legible as fishing/catching equipment. It is not
automatically a PoE/D2-style trap-kit base. The source set does not establish
setting pegs, a trigger, anchoring logic, a deployment board, or any other
feature that distinguishes a prepared trap from a generic net. Repeated
appearance on mock characters does not create an obligation to extract it.

If the game explicitly needs a throwable entangling-net mechanic, a new
`weighted_net` candidate could be audited separately using only:

- a soft flax net;
- its observed gathered or draped behavior;
- a small number of securely attached handmade weights;
- one integrated handling/retrieval line only if a source actually shows it.

That would be a new roster decision, not permission to generate the current
board-backed trap kit.

## Strict visual dedupe

Focused comparison:

- `audit/trapkit_weighted_net_focused_sources.jpg`

Broad audit sheets:

- `audit/trapkit_ladder_clip_top_01.jpg`
- `audit/trapkit_ladder_clip_top_02.jpg`
- `audit/trapkit_4group_01.jpg` through
  `audit/trapkit_4group_08.jpg`
- `audit/trapkit_chars_01.jpg` through `audit/trapkit_chars_03.jpg`
- `audit/trapkit_character_review_01.jpg` through
  `audit/trapkit_character_review_06.jpg`

The audit covered:

- 1,056 active ladder character crops with a local CLIP similarity sweep,
  followed by direct inspection of the top 72 net/kit matches;
- all 267 four-character/loadout images;
- all 57 project character/group images;
- all 206 reviewed character-item images;
- the five
  `items_multi_context_balanced_v1/external_references_unused_user_examples`
  images;
- relevant current asset/staging filenames and trap-kit roster rows.

Findings:

- Weighted nets, net bundles, and weighted hanging cords recur across DEX
  character ladders. The Stonewood DEX T1 crop above is the clearest complete
  example.
- No reviewed image shows a folded weighted net secured to a rigid backing
  with pegs and a separate cord coil.
- No current approved or staged file named for a weighted-net trap kit exists.
- The nearest existing item-art candidate is
  `C:\Users\Alex\Downloads\items_post_calib_batch\ChatGPT Image Jul 13, 2026, 11_24_37 PM (6).png`.
  It is already marked for review as `trap_or_mobility_kit`; visually it is a
  loose ring of straps, tubular tools, and a red cord bundle. It contains no
  net, no backing, and no secured trap assembly, so it is not reusable.
- The other queued trap-kit rows already depend on speculative boards, cases,
  pegs, and triggers. Their presence does not validate this row.

## Construction locks and hazards

- Lock EA87195 to **one** handmade fired-clay net-sinker, 3.2 cm long and
  1.8 cm maximum diameter.
- Lock its surface to irregular, smooth, lightly burnt dark-brown clay.
- Lock the bore as a real structural perforation; do not convert it into a
  painted dot, metal eyelet, or decorative bead hole.
- Lock EA36886 to soft flax cord and gravity-governed gathered mesh.
- Do not assert that EA36886 is New Kingdom; its catalog gives only Ancient
  Egypt.
- Do not claim that EA87195 and EA36886 belonged to one surviving assembly.
- Do not invent a leather or bark backing, carrier board, setting pegs,
  trigger, fitted recesses, case, fastening straps, or separate retrieval
  coil.
- Do not arrange sinkers in a neat row unless an exact assembly source proves
  the spacing and attachment.
- Do not copy the reviewed character's giant hook; it reinforces fishing
  context and is not part of this candidate.
- Do not use modern monofilament, nylon mesh, rubberized netting, factory-even
  knots, steel chain, lead weights, swivels, snap hooks, grommets, carabiners,
  cable, reel, modern net bag, or plastic fittings.
- Do not make the sinkers into grenades, sling bullets, beads, bells, charms,
  ammunition, or magical tokens.
- Do not force S 2x2 readability by adding a rigid rectangular support absent
  from the references.
- Do not extract the net merely because several mock characters carry one.

No prompt was prepared and no image generation was performed in this audit.
