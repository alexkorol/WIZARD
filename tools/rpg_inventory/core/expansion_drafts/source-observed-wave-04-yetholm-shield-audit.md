# Wave 04 preflight - `shield_bronze_yetholm`

Date: 2026-07-24  
Generation status: **not generated in Wave 04 preflight**

## Decision

**PASS the source pack for a new generation. REJECT the Pilot 02 output as
reuse.**

The Rhyd-y-Gorse object directly supports a distinctive one-piece
sheet-bronze shield. No current asset, promoted post-calibration shield, or
balanced-output assignment duplicates its dense rib-and-punched-boss face.

## Authoritative source

- British Museum object 1873,0210.2, found in 1804 in a peat bog at
  Rhyd-y-Gorse, Late Bronze Age, 12th-10th century BC:
  <https://www.britishmuseum.org/collection/object/H_1873-0210-2>
- British Museum image asset 1613747544:
  <https://www.britishmuseum.org/collection/image/1613747544>
- Downloaded front image, 1000 x 833:
  `tools/rpg_inventory/assets_staging/source-observed-wave-04/references/british_museum_1873_0210_2_rhyd_y_gorse_yetholm_front.jpg`

Image credit: © The Trustees of the British Museum, shared under CC
BY-NC-SA 4.0.

## Exact construction

- One disc of beaten copper alloy, 667 mm diameter, 0.70 mm metal thickness,
  1,929 g, described as quite flat.
- Pronounced conical central boss with stepped edge, 110 mm diameter and
  49 mm high.
- **Twenty** concentric ribs, each 5-6 mm wide.
- Each rib alternates with a row of small, singly punched bosses, each about
  5 mm diameter; the museum counts more than 3,700 bosses.
- Continuous rim turned to the front. There are no perimeter lacing holes,
  edge thongs, separate rim segments, rawhide binding, or wood backing.
- Reverse: a 144 mm tubular sheet-bronze handgrip riveted to the back; two
  riveted strap tabs, one surviving, with a small strap hole; conical rivet
  heads. Hammer marks survive on boss and handle.

For a front-face inventory icon, the rear grip and tabs remain occluded facts,
not front ornament. Do not move their rivets into a decorative perimeter
pattern.

## Pilot 02 audit

`assets_staging/pilot-02/raw/shield_bronze_yetholm.png` has a strong complete
round silhouette and readable stepped boss, but it is not the Rhyd-y-Gorse
construction:

- broad smooth concentric rings instead of twenty narrow ribs alternating with
  dense rows of tiny punched bosses;
- regularly spaced holes through the perimeter;
- external lashings wrapped around the rim;
- segmented/reinforced edge treatment instead of one continuous
  forward-turned bronze rim.

Verdict: **construction reject; preserve raw for audit, do not map, promote,
clean, or locally repair as `shield_bronze_yetholm`.**

## Dedupe

- Current `hideshield_bronze.png` is an elongated fantasy face shield with
  broad rings, a human-face solar boss, tassels, and an organic/segmented edge.
- `hideshield_bronze_candidate_b.png` is a tall curved center-boss shield;
  `hideshield_bronzescale.png` is an oval scale-faced shield. Neither is a
  one-piece round rib-and-boss disc.
- Current hide, oxhide, rawhide, and tower shields are different material and
  macro-silhouette families.
- Promoted post-calibration shields 081, 136, 146, and 168 are respectively
  hide round, plank round, rawhide/copper-boss round, and cane oval families.
- Other post-calibration shield rows are held or rejected for ornate,
  radial-symbol, medieval, or unclear construction; none reproduces the
  twenty-rib/3,700-boss Yetholm face.
- The offhands supply map assigns organic, plank, copper-boss, cane, pelta,
  figure-eight, parma, and Dipylon bases only. It contains no Yetholm reuse.

## Framing

- Runtime footprint: **2 x 3**.
- Generator canvas: **P, 1024 x 1536 portrait**.
- Show one complete round shield, front face only, on a restrained
  near-frontal three-quarter angle. Preserve the circular silhouette; do not
  stretch it into an oval to fill the portrait canvas. Use clean safe margin
  above and below.
- Keep the stepped conical boss and dense alternating rib/bead structure
  readable. The tiny bosses may compress at icon scale, but they must remain
  visibly discrete punched relief rather than turn into engraving, rope,
  jewels, holes, or smooth rings.

## Prompt hazards

- Perimeter holes, leather lacing, rawhide edging, separate metal rim pieces,
  wood backing, or external bindings.
- Replacing the dense punched-boss rows with a few broad fantasy rings.
- Turning the concentric construction into a sun emblem, rays, spiral, maze,
  engraved motif, gems, studs, or blue/gold regalia.
- Doming the entire shield deeply; the museum describes the disc as quite flat
  outside the boss.
- Copying dark museum patina or burial wear instead of maintained bronze.
- Showing the rear tubular handgrip on the front, adding front straps, or
  inventing visible handle rivets beyond what the selected view supports.
- Industrial perfection: the pattern is highly regular, but each small boss
  was singly punched and the boss/handle retain hammer marks.

## Release condition

Use the downloaded British Museum front image as the authoritative reference
and lock the exact twenty-rib, alternating punched-boss, stepped-boss, and
continuous turned-rim construction into the prompt. Under those constraints,
the item is **PASS / GENERATE NEW ONCE**.
