# Wave 05 preflight: `shield_celtic_spine`

## Decision

**HOLD; do not generate from the current row.**

The official Chertsey source is strong and the 2x4 front-facing inventory
treatment is appropriate, but the target description materially contradicts
the object. British Museum 1986,0901.1 is a complete shield made from thin
copper-alloy sheet. It is not a bronze facing or spine mounted on a
wood-and-hide body. The only organic component reported by the museum is the
ash-wood hand-hold on the reverse, itself covered with copper-alloy sheet.

This candidate may proceed only after the row is rewritten as an all-bronze
ceremonial/display shield and its roster role is protected by the exact
Chertsey spindle-boss silhouette. If the intended item must remain a
wood-and-hide combat shield, reject this source match and choose an object such
as the Witham or Battersea shield whose surviving metalwork was mounted over
an organic body.

No prompt or generated asset was created.

## Source gate

- Official object record:
  <https://www.britishmuseum.org/collection/object/H_1986-0901-1>
- Object: Chertsey shield, British Museum 1986,0901.1.
- Date: 400-250 BC.
- Dimensions: 836 mm high, 468 mm wide; weight 2,750 g.
- Construction: the museum describes a complete copper-alloy shield made from
  nine sheet sections, 1-1.25 mm thick, with broad copper-alloy edge binding.
  A long raised spine expands around an elongated spindle-shaped boss and
  terminates in small roundels.
- Reverse construction: a solid ash-wood transverse hand-hold, covered with
  copper-alloy sheet, crosses the hollow behind the boss. Its omega-shaped
  returns resemble stylized birds' heads. Thin copper-alloy strips border the
  reverse opening of the spine.
- Use caveat: the museum identifies it as the only Iron Age British/European
  shield made completely from bronze and notes that, without wooden backing,
  it was readily penetrated or damaged. It was probably for display or ritual
  rather than battle.

### Saved official evidence

- `references/british_museum_1986_0901_1_chertsey_shield_primary.jpg`
  - official full front/object image;
  - 929x1300;
  - SHA-256
    `04f4522e3f0d08f4e4db64927f05dd9063414933e956c0f4334d31983378d6ae`;
  - direct media URL:
    <https://media.britishmuseum.org/media/Repository/Documents/2014_9/30_15/b0faf5c7_0033_4d47_945b_a3b60103f582/large_00020043_001.jpg>.
- `references/british_museum_1986_0901_1_chertsey_shield_reverse_handle.jpg`
  - official reverse/handle image used only to lock concealed construction;
  - 1300x956;
  - SHA-256
    `cd8943a7522951bfcf798abec2906daa90c6de2bc0bb434a7c0ce6e2b31a9e46`;
  - direct media URL:
    <https://media.britishmuseum.org/media/Repository/Documents/2014_9/30_16/57579677_5e2f_4041_96ac_a3b601150949/large_00024941_001.jpg>.

The front image is the visual-authority reference. The reverse image is
construction evidence only and must not cause rear fittings to appear as
front ornament.

## Failure taxonomy

| Gate | Result | Reason |
| --- | --- | --- |
| Exact official source | PASS | The museum record and official front/reverse photographs identify the complete object and construction. |
| Source-to-target construction | FAIL | Current row says “wood-and-hide shield”; the exact object is a complete copper-alloy sheet shield with wood only in the rear grip. |
| Slot/readability | PASS | One isolated shield, front face only, with a strong long-oval read. |
| P 2x4 footprint | PASS | The object's 836:468 ratio is about 1.79:1 and fits a tall 2x4 inventory footprint. |
| Conservative reconstruction | FAIL in current wording | Adding an organic body invents a structure specifically contradicted by the museum. |
| Roster uniqueness | CONDITIONAL | The spindle boss is distinct, but generic tall-oval/all-metal treatment collides with existing shield families. |
| Overall | HOLD | Rewrite construction and lock the spindle silhouette before generation. |

## Required construction locks if released

- One regular long oval with smoothly rounded ends; no waist, notches, point,
  clipped corners, crescent cutout, kite outline, or rectangular body.
- Complete body of thin hammered copper-alloy sheet assembled from nine
  sections; no visible timber planks, hide field, wicker field, padding, or
  organic backing.
- Broad but restrained copper-alloy edge binding.
- One continuous raised longitudinal spine running nearly end to end.
- The spine expands into a narrow elongated spindle/leaf-shaped central boss,
  not a circular hemispherical boss.
- One small terminal roundel at the top and one at the bottom.
- Only restrained source-observed joining/fitting heads; no invented rows of
  studs, straps, braces, or heavy structural hardware.
- The hidden transverse ash grip and its omega/bird-head returns remain on the
  reverse. They are not front-facing decoration.
- Front-only inventory presentation, nearly orthographic with at most a slight
  three-quarter angle to read boss depth.
- Healthy game-item bronze/copper with mild local tarnish. Do not reproduce
  the museum object's black corrosion islands, pitting map, scratches, dents,
  losses, or exact patina.
- Treat the object as ceremonial/display equipment unless the game explicitly
  chooses to fictionalize its combat role.

## Ornament and invention exclusions

- No generic “Celtic” knots, spirals, triskeles, scroll fields, animal
  interlace, faces, runes, or faux script.
- No sun, star, solar, radial-target, or spoke motif.
- No gemstones, lapis, enamel, gold inlay, feathers, tassels, trophies, or
  magical glow.
- No additional terminal discs, copied rear omega fittings, secondary bosses,
  side grips, front handles, or fantasy thick frame.

## Strict visual dedupe

Reviewed the current named shield assets, inbox/staging shield candidates,
source-observed manifests and raw outputs, all shield outputs in
`items_multi_context_balanced_v1`, and every shield-classified row in
`post-calib-triage.tsv`.

### Highest overlap risks

1. `assets_inbox/intake_012_sheet_bronze_tall_shield_a.png`,
   `assets_inbox/intake_013_sheet_bronze_tall_shield_b.png`, and
   `assets/hideshield_bronze_candidate_b.png` form an existing tall all-metal
   shield family with a full vertical reinforcing rib and central boss. Their
   pointed/tapered outlines and round bosses differ from Chertsey, but a
   generic bronze oval with a circular boss would become the same equipment
   thesis.
2. `C:\Users\Alex\Downloads\items_post_calib_batch\ChatGPT Image Jul 10,
   2026, 11_24_03 PM (2).png` is another tall metal-faced body shield with a
   dominant long central fitting and multiple bosses. It is already marked
   review and is an especially strong hardware-layout collision.
3. The promoted `shield_cane_oval` source
   (`ChatGPT Image Jul 13, 2026, 11_51_10 PM (2).png`) already owns the plain
   tall oval silhouette, but uses reed panels, a timber frame, and a round
   boss. Chertsey remains distinct only through its complete sheet-metal body
   and spindle boss.
4. The assigned `shield_bronze_parma` balanced source
   (`faction_north - DEX - tier 1/03__shield.png`) already owns the
   bronze-and-wood oval with a large round center plate. Do not hybridize it
   with Chertsey.
5. `source_north_oval_shield` is an existing hide-faced oval with a large
   round boss and terminal fittings. It is macro-adjacent but materially and
   mechanically distinct.
6. The same ladder assigns the Chertsey source again to
   `shield_skymetal_oval` at T5. That is an internal source/macro duplicate:
   a mere metal recolor cannot justify two rows. Retain only one Chertsey
   geometry or give the T5 row a different construction and silhouette.

### Distinct neighbors

- `shield_bronze_yetholm` is round and concentric.
- `source_dustwind_clipped_body_shield` is clipped/rectilinear hide.
- `source_dustwind_woven_lobed_buckler`, the accepted figure-eight shields,
  and accepted crescent shields are silhouette-distinct.
- Promoted round hide, wood, and copper-boss shields are materially and
  geometrically distinct.

### Known hazard references

Several rejected/current shield images contain sunbursts, radial targets,
spirals, faces, feathers, dense fantasy engraving, faux writing, gems, and
heavy medieval cross-strapping. None of those motifs is evidence for
Chertsey. The broad dark corrosion pattern in the official photograph is also
an archaeological condition, not decoration.

## Release condition

Rewrite the target to something equivalent to:

> A complete long oval shield of thin hammered bronze sheet, assembled in
> fitted sections beneath a bound bronze edge, with one continuous raised
> spine expanding into a narrow spindle-shaped boss and ending in tiny
> terminal roundels; plain front face only, no wood or hide visible, no
> ornament.

Then resolve the duplicated T5 Chertsey geometry and keep the existing
round-boss tall bronze candidates out of this item's prompt/reference pack.
