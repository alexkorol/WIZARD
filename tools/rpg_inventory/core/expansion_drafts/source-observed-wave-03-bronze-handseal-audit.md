# Wave 03 preflight — `focus_bronze_handseal`

Date: 2026-07-24  
Generation status: **not generated**

## Decision

**HOLD the current target row and reject its present source claim.** The cited
British Museum URL does not expose a collection record, and the nearest
verifiable British Museum object with the same 2200–1800 BC date is neither
western Iranian nor a tall solid-handled seal. Do not dispatch the current
prompt until a direct museum object with the intended complete profile is
attached or the row is rewritten around the documented compact form.

## Source audit

- Cited target URL, currently unresolved:
  <https://www.britishmuseum.org/collection/object/W_1975-0301-6>
- Closest verifiable official record: British Museum, *compartmented
  stamp-seal*, museum number 1991,1217.1:
  <https://www.britishmuseum.org/collection/object/W_1991-1217-1>
- The official record describes a cast copper-alloy seal with an openwork
  floral design and a loop handle on the back, made in Bactria, with a
  possible east-Iran findspot, dated 2200–1800 BC. It is 3.9 cm in diameter,
  1.4 cm thick, and weighs 15.5 g.
- That record does **not** support “western Iran,” “broad solid circular
  face,” or “tall solid perforated handle.”
- The official record does not publish an image in its indexed collection
  result. No substitute image was saved to the Wave 03 reference directory:
  a related seal photograph would silently change the source geometry.

An auction catalogue search confirms that tall stalk-handled and sharply
rising pierced-handle bronze seals existed in west-central Asia around
2300–1800 BC, generally at only about 18–27 mm overall. That is useful
comparative evidence for the object family, but it is not a primary museum
record and cannot repair the target's present citation.

## Exact supported silhouette and handle geometry

For British Museum 1991,1217.1:

- almost circular, openwork floral stamp body;
- broad diameter with very shallow total depth;
- low loop handle mounted on the back rather than a long hand grip;
- no documented tall stalk, solid upright grip, or palm-length shaft;
- complete macro-profile is disc-like and nearly square, not a 1:3 portrait
  implement.

For the intended tall-handled comparative family only:

- flat round or oval stamp face;
- back rises into a short central stalk;
- terminal is a closed transverse suspension loop or pierced egg-shaped knob;
- published examples are approximately 18–27 mm overall, so the “handle” is
  a finger/suspension lug, not a substantial hand grip.

## Prior-art and supply-map audit

- `assets_staging/focus_black_disc.png` is the closest current macro
  collision: a large round face with a short handle, already reading as an
  ornate hand mirror. A generated “broad circular face plus handle” will
  converge on this silhouette unless the stamp body is shown edge-on and its
  compact loop construction remains unmistakable.
- `assets_staging/sceptre_bronze_pronged.png` is safely distinct but already
  owns the substantial bronze portrait-implement lane.
- Post-calibration row 12,
  `ChatGPT Image Jul 10, 2026, 10_53_50 PM (2).png`, is a rejected handled
  circular ritual prop with shell/turquoise clutter. It confirms the
  disc-plus-handle fallback is weak and motif-prone.
- `expansion_ready/offhands-supply-map.tsv` already rejects the Dustwind INT
  T2 ritual output because a small seal/mirror-like prop does not meet
  substantial held-focus scale. No current balanced, post-calibration, or
  Wave 03 staging source supplies a better hand-seal base.
- Ring and amulet rows contain compact seal faces, so a source-faithful tiny
  seal also risks class duplication rather than establishing a rite-focus
  silhouette.

## Grid, canvas, and framing

- Current release row: **1 × 3 portrait**, implying a 1024 × 1536 generation
  canvas and a substantial held rite implement.
- Source-faithful museum object: **1 × 1 square**, with a 1024 × 1024
  generation canvas, because the 3.9 cm disc and low back loop are compact.
- The expansion draft formerly used 1 × 2, but that still overstates the
  documented object's verticality and conflicts with the canonical
  substantial-held-focus footprint.

The row therefore needs an explicit design choice: either retain a compact
historical seal and move it to a 1 × 1 jewelry/relic role, or attach a direct
source for a genuinely enlarged, hand-gripped rite seal before keeping
1 × 3.

## Failure and dedupe risks

- hand mirror, black-disc focus, frying pan, shield, medallion, signet ring,
  pendant, or modern desk stamp;
- invented long turned-wood handle or mace shaft;
- openwork floral source silently rendered as a solid plate;
- readable glyph, sacred emblem, sunburst, face, or copied stamp design;
- archaeological green crust replacing active-service bronze;
- cropping the stamp rim or perforated terminal;
- exaggerating a suspension loop into an unsupported palm grip;
- shrinking a 1 × 3 canvas object until it is unreadable at 48 px.

## Release condition

Provide a direct museum record and primary image that visibly support a
complete broad stamp face, central stalk, and tall perforated terminal, then
re-audit its real overall proportions against the 1 × 3 rite-focus footprint.
Otherwise rewrite and reclassify around the documented compact openwork disc
with a low back loop. Until one of those changes is accepted, the verdict is
**HOLD / DO NOT GENERATE**.
