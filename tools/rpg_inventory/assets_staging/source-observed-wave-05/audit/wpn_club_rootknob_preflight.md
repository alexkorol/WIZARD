# Wave 05 source audit — `wpn_club_rootknob`

## Verdict

**REJECT — do not draft a prompt and do not generate.**

British Museum `EA59703` is not a root-knob club. The museum catalogues it as a
**throwing-stick** and describes it only as a wooden throw-stick. Its surviving
silhouette is a thin, flattened, sharply bent missile with two unequal arms,
not a straight hand club with a dense natural root burl at one end. The row's
club identity, dense-hardwood claim, root-burl striking head, narrow handgrip,
and source-supported smoothing are therefore all unsupported.

This is not a repairable wording error. Converting the exact source into the
requested club would erase its defining elbow, change the mass distribution and
weapon action, invent tree-root anatomy, and assign a grip/head distinction the
record does not document. The exact artifact has also already been used
successfully as `wpn_throw_badarian_stick`; reusing it as a club would duplicate
one source while falsifying its object family.

The root-knob concept may be reconsidered only under a different, directly
inspected artifact or reconstruction that actually shows a complete one-piece
root-burl impact club. `EA59703` must not remain its anchor.

## Exact source record

- British Museum object: `EA59703` (`1929,1106.85`)
- Official record:
  <https://www.britishmuseum.org/collection/object/Y_EA59703>
- Museum object type: **throwing-stick**
- Museum description: wooden throw-stick
- Culture/period: Badarian
- Findspot: Badari, el-, grave 5716, Egypt
- Material: wood
- Dimensions: 38 cm long, 14 cm wide, 2.20 cm thick
- Condition: fair
- Display: Room 64, Early Egypt, Display Case 2
- Official Badarian dating context: about 4400–4000 BC, stated by the British
  Museum for the Badari cemetery sequence:
  <https://www.britishmuseum.org/collection/object/Y_EA59648>
- Chronology gate: **PASS**
- Exact club identity gate: **FAIL**
- Complete functional root-burl club gate: **FAIL**

The museum record exposes one image slide, not a multi-view front/back/detail
set. The native museum media file could not be retrieved in this audit because
the collection image surface was unavailable. This does not create a hold:
the official catalogue identity and the two exact-object display reproductions
below independently disprove the proposed club construction.

## Local reference set and roles

1. `references/bm_EA59703_display_photo_don_hitchcock_2015_full.jpg`
   - **Primary exact-object visual authority for this audit.**
   - Full-resolution visitor photograph of `EA59703` on display at the British
     Museum, tied to the accession and museum label by the hosting page.
   - Shows the thin flattened body, unequal arms, sharp elbow, flared long-arm
     end, narrow broken-looking short-arm tip, incised surface pattern, and
     extensive archaeological fractures.
   - Source page:
     <https://www.donsmaps.com/egypt1.html>
   - SHA-256:
     `4E7F1C19FCA511937B9DC6E7E128F9B1FA7A927FE7F81544F89F71643BC4ABED`
2. `references/bm_EA59703_research_figure_pol_study.jpg`
   - **Independent exact-object identity and whole-silhouette check.**
   - Research figure explicitly captioned “Wooden throw stick from Badarian
     grave 5716 (Source: British Museum EA59703).”
   - Confirms that the object reads as the same flat bent missile in a
     horizontal presentation, not as a club or root-burl branch.
   - Source page:
     <https://pol-study.com/case-study-2-the-badarian/>
   - SHA-256:
     `7DA303E3A060A89E0C64EEC66BAC39227819B2E8B1B8379F90082ADC6207DC1F`
3. `audit/wpn_club_rootknob_prior_art_contact.jpg`
   - **Audit-only visual-dedupe sheet.**
   - Compares the exact artifact with the accepted EA59703 throwstick, the
     accepted River Paddle Cudgel, all seven current warclub assets, the two
     relevant promoted post-calibration impact images, and both balanced
     `04__impact.png` outputs.
   - SHA-256:
     `986DD486BC80940DAA59F0B48448BF881E06DDE34D47DCE53FE990C9E03BB376`

The images are evidence only. They are not generation inputs for this rejected
row, and the burial fractures, missing material, mounting hardware, background,
and colour cast must never be copied.

## Literal row check

| Row claim | Verdict | Evidence |
|---|---|---|
| single dense hardwood branch | **Unsupported** | The museum says only `wood`; neither species, density, hardwood, nor branch selection is documented. |
| retaining one broad root burl | **Rejected** | No burl or root anatomy is visible or described. The broad feature is one flat arm of a bent throwing-stick. |
| root burl as striking head | **Rejected** | The record does not identify a club head or impact face; the object's action is throwing-stick/missile. |
| smoothed narrow handgrip | **Unsupported / contradicted** | No grip is identified. The ends are unequal, flattened, and decorated/worn; assigning one as a smoothed club handle is conjecture. |
| no added fittings | **Supported only negatively** | No functional fittings are documented, but this does not turn the missile into a club. Visible museum mount wires are not part of the object. |
| complete functional one-piece club | **Rejected** | The source family and proportions are wrong, and the surviving object is fractured with an apparently damaged short-arm tip. |

The earlier draft row used British Museum `1972,0901.5`, a Palaeolithic hand
tool, as a loose scale/material analogy. The ready row and `targets-600.tsv`
then drifted to `EA59703`. Neither object directly documents a root-burl club.
The later anchor is especially misleading because it is already the exact
source for another active throwing-weapon row.

## Shape and proportion findings

- The exact artifact is 38 × 14 × 2.2 cm: compact, broad for its length, and
  very thin relative to its plan-view width.
- It has a long flattened arm, a tight elbow, and a shorter angled arm. The
  arms are not a cylindrical shaft plus a compact terminal head.
- The long arm ends in a modest flared foot. The short arm tapers toward a
  narrow damaged tip. Neither end is a rounded or irregular root mass.
- The display view reports a central dot pattern and carved chevrons at the
  handle. Light shaping and incised decoration are source-supported; a clean
  smooth club grip and polished root knob are not.
- Surface colour, severe cracking, separated segments, ragged edges, and
  display wires are archaeological/display state, not active-service finish.

## Framing and ordinary ARPG roster gate

- Requested footprint `P 1x3` for the proposed straight club:
  **FAIL against the exact source.**
- `EA59703` naturally occupies a compact bent-missile silhouette; Wave 03
  correctly assigned it `P 1x2` as `wpn_throw_badarian_stick`.
- Forcing it into a tall `1x3` club icon would require straightening the elbow,
  lengthening the grip axis, or shrinking the authentic object until it reads
  weakly. All three outcomes violate exact-source extraction.
- Ordinary ARPG weapon value for the exact source: **PASS as a throwing
  weapon**, already represented.
- Ordinary ARPG weapon value for the proposed root-knob club: potentially
  valid in isolation, but **not evidenced by this source** and redundant at
  the current T1 one-piece-wood level.

## Strict prior-art and overlap audit

Visual sheet:
`audit/wpn_club_rootknob_prior_art_contact.jpg`

Inspected:

- accepted Wave 03 `wpn_throw_badarian_stick_clean.png`;
- accepted Wave 03 `source_river_paddle_cudgel_clean.png`;
- current `warclub_bone`, `warclub_copper`, `warclub_bronze`,
  `warclub_stone`, `warclub_jade`, `warclub_obsidian`, and
  `warclub_skymetal`;
- promoted post-calibration impact images 021 and 071;
- balanced Dustwind INT T1 and North DEX T2 impact outputs;
- ready/draft weapon rows, supply map, post-calibration triage, historical QA,
  weapon notes, Wave 03 report/preflight, and the Cypriot finned-mace audit.

Findings:

- **Direct source duplication:** `EA59703` already supports the accepted
  Badarian Throwstick. A second row may not reinterpret the same elbow missile
  as a root club.
- **T1 roster overlap:** the accepted River Paddle Cudgel already supplies a
  clean, complete, one-piece hardwood impact silhouette with a narrow shaft
  and modest terminal swelling. A newly sourced root-burl club would need a
  visibly dominant natural burl and clearly different balance to earn another
  rung.
- The current bone club is a single femur and materially distinct. Copper,
  bronze, stone, jade, obsidian, and skymetal assets occupy composite or exotic
  later-tier silhouettes and are not exact duplicates.
- Post-calibration impacts 021 and 071 are long tapered wooden clubs covered
  with metal-looking studs. They cannot support the no-fitting root-burl row
  and remain `needs_user` alternatives in the supply map.
- Balanced Dustwind INT T1 is a wrapped composite mace; balanced North DEX T2
  is an antler-headed shaft weapon. Neither supplies a root-burl interface.
- No inspected art is an exact natural-root-burl club, but absence of a visual
  duplicate does not cure absent primary evidence. The row still fails before
  generation.

## Construction locks for any future replacement source

These locks apply only if the row is re-anchored to a genuine root-burl club:

- One continuous piece of documented wood from grip through head.
- A real terminal root burl or root crown visibly continuous with the shaft;
  no glued-on ball, carved fantasy knot, separate macehead, or false socket.
- A clearly heavier, asymmetric striking mass and a narrower hand-length grip.
- Preserve source-observed tool shaping only. Do not invent lathe turning,
  machine sanding, varnish, lacquer, mirror polish, or perfectly radial roots.
- No fittings, bindings, metal, stone, spikes, teeth, rivets, collars, caps,
  studs, leather wraps, or decorative hardware.
- No living tendrils, branch antlers, root claws, magical growth, faces,
  symbols, spiral carving, or gnarled fantasy-tree silhouette.
- Active-service finish may remove burial dirt and repair only documented
  incidental damage; it may not redesign the sourced wood anatomy.
- The future source must independently justify `P 1x3` with a true longitudinal
  club axis and full tip-to-butt visibility.

## Failure taxonomy / reject hazards

Reject any future result containing:

- the EA59703 elbow/boomerang silhouette relabelled as a club;
- a paddle, throwing stick, cane, crook, branch wand, or fantasy root staff;
- a smooth round mace ball masquerading as a natural burl;
- a separate head, socket, peg, wedge, glue seam, collar, ferrule, or hidden
  modern tang;
- bindings, grip wrap, metal, stone, spikes, studs, teeth, blades, or gems;
- many radiating roots, claw-like tendrils, antlers, foliage, bark horns, or a
  living-tree effect;
- polished furniture finish, lathe symmetry, machine-even sanding, or glossy
  varnish without exact evidence;
- copied burial cracks, separated segments, eroded tip, dark decay, display
  wires, black case backing, labels, or museum lighting;
- a head too small to distinguish the item from the accepted River Paddle
  Cudgel;
- a cropped head or grip, landscape framing, or a short 1x2 missile forced into
  the requested 1x3 club slot.

## Replacement requirement

Retire `EA59703` from this row. To preserve `wpn_club_rootknob`, supply a
specific inspected artifact photograph, excavation drawing with intact
profile, or credible reconstruction that documents:

1. club or impact-weapon identity;
2. a complete one-piece wood body;
3. genuine terminal root-burl construction;
4. head-to-grip proportions and overall dimensions;
5. any shaping, smoothing, or finish actually present; and
6. a silhouette distinct from the accepted River Paddle Cudgel.

Until such a source exists, the correct status is **REJECT**, not HOLD, because
the cited exact object positively belongs to another weapon family.
