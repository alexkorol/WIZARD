# Wave 05 source audit — `wpn_dag_egypt_broad`

## Verdict

**HOLD — do not draft a prompt and do not generate.**

The exact British Museum record supports a real 32.5 cm Egyptian bronze dagger
with a broad tapering blade, an openwork bone grip that was originally inlaid,
and a bone pommel. The museum photograph and technical drawing make the
blade/grip/pommel macro-construction unusually legible and give this object a
strong, distinctive 1x2 inventory silhouette.

The current ready row nevertheless fails the exact-source and active-service
completion gates:

- `solid polished ivory butt` is not supported. The museum identifies the
  pommel as **bone**, not ivory, and the visible rounded pommel is integrated
  with large openings around the central grip structure rather than reading as
  a simple solid ivory cap.
- `openwork bone grip` is literally supported, but the museum condition field
  says the object is **incomplete — lacks grip inlays**. The present open
  channels cannot be copied uncritically as a finished active-service grip.
- The museum gives no material, colour, pattern, or fastening description for
  the missing inlays. The technical drawing shows small holes and the
  blade-to-grip-to-pommel geometry, but the record does not identify those
  holes as a particular count of rivets, pins, or pegs. Completing the handle
  now would require guessing.

The hold clears only with an inspected authoritative reconstruction, catalogue
drawing/text, or tightly compatible complete dagger that identifies the
original grip-inlay material, placement, and attachment. If that cannot be
found, replace the row with a T4 dagger whose complete active-service hilt is
documented.

## Exact source record

- British Museum object: `EA65451` (`1951,0714.9`)
- URL: <https://www.britishmuseum.org/collection/object/Y_EA65451>
- Museum object type: dagger.
- Museum description: bronze dagger with a broad tapering blade, an openwork
  bone grip originally inlaid, and a bone pommel.
- Culture/period: Egyptian Second Intermediate Period.
- Official British Museum period range: about 1795–1550 BC. This is the
  museum's range for the period, not a more precise object-specific date:
  <https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/timeline-ancient-egypt>
- Findspot: Egypt; no more precise archaeological provenance appears in the
  object record.
- Materials: bronze and bone.
- Technique: inlaid.
- Length: 32.50 cm.
- Condition: fair; incomplete because grip inlays are missing.
- Chronology gate: **PASS.**
- Weapon identity gate: **PASS.** The museum classifies it as a dagger, and the
  broad double-sided tapering blade and compact hilt read as a close-combat
  weapon rather than an incidental tool. The record does not flag it as a
  ceremonial miniature, dummy, or dedicatory form.
- Complete active-service assembly gate: **FAIL pending evidence for the lost
  inlays and their attachment.**

## Local reference set and source roles

The British Museum page exposes two official source assets, not a separate
three-photo front/back/detail set. Together they supply a colour photograph
plus a technical sheet showing both faces and a blade cross-section. The local
detail crops listed below are audit viewing aids derived from those untouched
official files.

1. `references/bm_EA65451_img_368044001_max.jpg`
   - **Primary exact object/material/interface authority.**
   - Full colour photograph showing the broad blade, shoulder, open grip
     structure, central pommel engagement, pale rounded bone pommel, corrosion,
     cracks, and missing inlay spaces.
   - SHA-256:
     `A393BBE6B6DBB838B71910D1F191F85ACBEA85C5D187F0758D547A103D545F97`
2. `references/bm_EA65451_img_837067001_max.jpg`
   - **Exact front/back geometry and section authority.**
   - Technical sheet showing both faces, the hilt openings, central grip/pommel
     structure, small attachment holes, and the lenticular/lozengic blade
     section.
   - It documents surviving geometry, not a reconstruction of the missing
     inlays.
   - SHA-256:
     `C1082C785AFB93BC1C33FAAB935362F376C6E90FA616ECD3B8852179D9CBD7E0`
3. `audit/bm_EA65451_hilt_photo_detail_crop.jpg`
   - **Audit-only hilt close view**, cropped from official image `368044001`.
4. `audit/bm_EA65451_hilt_drawing_detail_crop.jpg`
   - **Audit-only two-face hilt close view**, cropped from official image
     `837067001`.

## Literal row check

| Row claim | Verdict | Evidence |
|---|---|---|
| broad tapering bronze dagger | **Supported** | Exact object description and both views. |
| compact openwork bone grip | **Supported but incomplete** | The phrase is in the museum description, but the original inlays are missing. |
| solid polished ivory butt | **Rejected** | Museum says bone pommel; the visible geometry is a broad rounded open/perforated hilt end, not a simple solid ivory cap. |
| most blade surface plain | **Supported for active-service translation** | No bounded engraved ornament is documented; archaeological corrosion must not be copied. |
| complete blade-to-grip-to-butt assembly | **Not yet supported** | Surviving macro interfaces are visible, but the grip inlays and their attachment are undocumented/missing. |

The draft manifest previously said `solid polished bone pommel`, which at least
used the correct material. The ready manifest and `targets-600.tsv` drifted to
`solid polished ivory butt` while retaining a historical anchor that still says
bone grip and pommel. The display name `Ivory-Butt Broadblade` therefore also
fails the exact-material gate.

## Construction locks if the hold is cleared

- Keep a broad, straight, symmetrical bronze blade tapering steadily to a
  rounded point; do not turn it into a narrow rapier or oversized fantasy leaf.
- Preserve the low, restrained blade section shown in the technical sheet. Do
  not add deep fullers, a giant fantasy midrib, serrations, or scalloped edges.
- Preserve the compact openwork hilt geometry and the direct shoulder
  transition; add no crossguard, ricasso, quillons, ferrule, or modern bolster.
- Grip and pommel remain **bone** unless new exact evidence identifies another
  material. Do not substitute ivory merely to make the T4 rung feel richer.
- Restore the missing grip inlays only from the future authority. Do not guess
  gemstones, gold, faience, coloured resin, wood, leather, textile, or another
  filler.
- Do not interpret every visible small hole as a surviving rivet. Add no pins,
  rivets, pegs, screws, or decorative studs without explicit source support for
  their material, count, and placement.
- Keep bone, bronze, and any future supported inlay visibly separate at every
  interface. No material may melt into the blade or cross the shoulder without
  a legible joint.
- Preserve the broad rounded bone pommel/hilt-end silhouette and central
  engagement shown in the exact views. Do not invent a guard, knob pommel,
  stone cap, or detached ivory butt.

## Active-service finish

A future source-complete result should show a maintained bronze blade, clean
bone surfaces, and the documented inlays fitted in place. It must not copy:

- green/black burial corrosion, pitting, mineral crust, or orange museum
  background;
- cracked and flaking bone, chipped blade margins, missing inlay voids, or
  broken edge noise;
- catalog markings or a technical-drawing presentation.

Cleaning the object is not permission to modernize it. Avoid machine-perfect
mirror symmetry, laser-cut openwork, glossy piano-key ivory, razor-thin modern
bevels, precision screws, or jewel-like replacement inlays.

## Framing and ordinary ARPG roster gate

- Requested footprint `P 1x2`: **PASS.**
- At 32.5 cm overall with a broad blade and unusually wide rounded hilt end, the
  dagger has enough mass to remain readable in a portrait 1x2 / 48 px slot.
- Weapon-slot legitimacy: **PASS.** It has a clear dagger identity and strong
  loot silhouette.
- T4 ladder distinction: **conditionally PASS.** Its broad tapering blade plus
  compact openwork/inlaid bone hilt and rounded bone end is visibly different
  from the T1 flint lancet, T2 copper lingulate, and T3 Peschiera flanged-hilt
  concepts.
- Progression risk: once the invented ivory is removed, both the T3 Peschiera
  row and this T4 row are bronze-and-bone assemblies. The T4 rung must earn its
  progression through the source-backed broad blade and complete inlaid
  openwork construction, not through unsupported precious material or added
  ornament. Until the inlay construction is sourced, that escalation is not
  secure.

## Strict prior-art audit

Visual audit sheet:
`audit/wpn_dag_egypt_broad_prior_art_contact.jpg`

Inspected:

- all dagger/knife/copper/bronze-name matches in current `assets`;
- all relevant dagger and short-blade raw/clean results in all staging,
  including the rejected Pilot 02 Cypriot knife and the Wave 03 loop knife;
- ready/draft manifests, target tables, historical QA, source-observed reports,
  correction memo, supply/reuse mappings, and post-calibration triage;
- all six balanced `short_blade` manifest rows and all three present
  `04__short_blade.png` outputs under
  `C:\Users\Alex\Downloads\items_multi_context_balanced_v1`;
- the relevant weapon range in
  `C:\Users\Alex\Downloads\items_post_calib_batch`, including sorted index 29,
  `ChatGPT Image Jul 10, 2026, 11_04_16 PM (1).png`.

Findings:

- No inspected existing or staged image duplicates EA65451's broad blade plus
  large rounded openwork bone hilt end.
- `assets/dagger_copper.png`, `dagger_bronze.png`, and
  `dagger_bronze_hiltless.png` overlap the broad metal-blade slot but use
  conventional wrapped grips, crossguards, and compact pommels. They are not
  macro duplicates.
- The Pilot 02 Cypriot knife is the main material-interface warning: its
  generated wood grip fuses into the bronze blade and reads machine-even. It
  cannot supply missing handle logic for EA65451.
- The balanced short blades are guarded akinakes-like forms with T-pommels and
  do not duplicate the open bone hilt.
- The post-calibration blade is an ornate medieval-fantasy crossguard form and
  remains rejected.
- The older draft historical QA marked this row PASS because the openwork
  assembly is visually bounded. That finding missed the museum's explicit
  incomplete-inlay condition and the ready manifest's later bone-to-ivory
  material drift. Current exact-source rules supersede it.

## Failure taxonomy / reject hazards

Reject any future result containing:

- ivory anywhere unless a new exact authority supports it;
- empty archaeological inlay channels presented as a finished ergonomic grip;
- invented gems, faience, gold, glass, coloured paste, leather, wood, or resin
  in the missing inlay fields;
- guessed rivets, pins, pegs, studs, screws, or a modern hidden full-tang/scales
  construction;
- bone or inlay visually fused into bronze, an unreadable shoulder transition,
  or floating hilt pieces;
- a crossguard, quillons, ricasso, ferrule, metal collar, wrapped handle, knob
  pommel, or separate cap absent from the exact source;
- machine-even rails, laser-cut openings, mirror-polished modern ivory, or
  jewellery-first ornament;
- a narrow Peschiera/rapier blade, broad copper-leaf duplicate, or Cypriot
  two-rivet knife silhouette;
- copied corrosion, cracks, missing inlays, chipped margins, catalog marks,
  orange museum backdrop, or technical-drawing labels;
- cropped point or pommel, landscape framing, or loss of the rounded openwork
  hilt read at 48 px.

## Hold-clearing evidence

The minimum acceptable additional authority must show or explicitly document:

1. what filled the grip openings;
2. the inlay material and healthy active-service appearance;
3. how the inlays, bone grip, blade shoulder, and bone pommel were attached;
4. which visible holes held fasteners, with their count and material; and
5. the correct complete pommel profile.

Until then, keep the row on **HOLD**, remove the unsupported ivory language from
planning documents when authorized, and do not generate.
