# Wave 05 preflight: `helmet_light_riverhide`

## Decision

**PASS for the source pack; no generation performed.**

The helmet earns an independent ARPG equipment base even though the cuirass
from the same outfit is already accepted. The British Museum catalogs the
headpiece as a helmet, gives it separate dimensions, and shows it as a
physically separate component. Its fitted scaled crown, broad side coverage,
and unusually long rear fall make a readable helmet silhouette that is not
supplied by the existing compact rawhide caps. This is a real slot distinction,
not an instruction to extract every component of the outfit.

The source does **not** prove ordinary battlefield use. The museum calls the
outfit parade armour and says it was possibly used for cultic activities.
`War Hood` is therefore a game-facing base name, not a historical-use claim.

## Official source

- British Museum object: EA5473 / 1846,0501.9, Roman, third-fourth century,
  found/acquired at Manfalut. The catalog description is an outfit consisting
  of a helmet and cuirass, both made from sewn crocodile skin. Technique:
  sewn. Helmet dimensions: 45 cm long, 27 cm wide, and 19 cm deep at the head
  opening.
- Object record:
  <https://www.britishmuseum.org/collection/object/Y_EA5473>
- Official front image:
  `references/british_museum_EA5473_00020721001_preview.jpg`
  (495x700 RGB; SHA-256
  `309b887b32ff71217a70e55a2dc7352e19064f8a1af354e5943c92b3d6e90aba`)
- Official rear image:
  `references/british_museum_EA5473_00020722001_rear.jpg`
  (495x700 RGB; SHA-256
  `371974ef34799f107f24540da885f44e76e7d01fee7869da82df9f952251e5b8`)
- BM Images records:
  <https://www.bmimages.com/preview.asp?image=00020721001> and
  <https://www.bmimages.com/preview.asp?image=00020722001>

## Observed helmet construction

The official front and rear views show the headpiece separately above the
cuirass. It is a continuous sewn crocodile-skin hood/helmet with:

- a fitted rounded crown rather than a flat cap or metal bowl;
- a broad arched brow opening;
- corresponding left and right side/ear coverage;
- a long central posterior hide fall extending well below the crown;
- large natural dorsal scutes along the crown and rear fall, transitioning to
  smaller natural scale fields toward the sides;
- cut hide edges and sewn assembly, with no metal frame, plaques, rivets,
  crest, animal head, or jewelry.

The rear photograph is essential. The front alone can make the long posterior
fall look like part of the cuirass; the rear view proves that it descends from
the helmet as its own component.

## Grid and framing

- Generator canvas: **S**, square.
- Runtime footprint: **2x2**.
- The three-quarter study must retain the complete long rear fall within the
  square. Occupancy should favor a slightly tall diagonal silhouette with
  enough side rotation to prove both the brow opening and the posterior
  extension. The dark empty interior is part of the helmet opening; no head or
  mannequin is required.

## Prior-art audit

Visual audit sheets:

- `audit/helmet_prior_art_contact_01.jpg`
- `audit/helmet_prior_art_contact_02.jpg`

The sheets include all helmet/headgear-named files in current assets and
staging, every helmet-classified post-calibration row, and all headgear outputs
found under the balanced download folders.

Closest usable neighbors:

- `helmet_open_rawhide` /
  `ChatGPT Image Jul 10, 2026, 11_25_30 PM (3).png` is a smooth stitched
  rawhide dome with two separate long cheek tabs. It lacks crocodile scutes and
  the source helmet's central rear fall.
- `helmet_neckguard_leather` /
  `ChatGPT Image Jul 13, 2026, 11_24_36 PM (3).png` is a compact plain-hide
  hood with a short lower edge. It lacks the long posterior silhouette and
  natural scute map.
- The rejected quilted cowl
  `ChatGPT Image Jul 13, 2026, 11_17_52 PM (3).png` has fuller neck coverage,
  but is textile-led, ornate, costume-like, and unavailable for reuse.
- Existing `helm_bronzescale.png` is a crested metal-scale helmet; it is
  materially and structurally distinct.
- The accepted river-hide corselet shares a documented outfit and material but
  occupies the body slot. It does not duplicate the helmet's macro-silhouette.

No usable existing asset or staged generation duplicates the combination of
natural crocodile scutes, fitted hood crown, paired side coverage, and long
central rear fall.

## Failure hazards

- Do not turn the source into a crocodile head, snout, jaw, teeth, eyes, horns,
  or a dragon/fantasy monster helmet.
- Do not convert natural scutes into individually pasted tiles, lamellae,
  metal scales, gemstones, or repeated industrial plates.
- Isolate the helmet only. No cuirass, shoulders, body, crocodile pelt, trophy,
  or combined armour set.
- Preserve a complete crown, both side fields, and the full central rear fall.
  A cropped or missing rear fall collapses it into an existing rawhide cap.
- Do not invent a modern aviator-cap seam map, chin strap, buckle, eyelets,
  dense regular stitching, molded foam, or leather fashion tailoring.
- Do not add metal brow bands, rivets, studs, regalia, symbols, or jewelry.
- Do not copy the museum object's desiccation, breaks, flattened mounting,
  dark rot, or missing areas. Active-service restoration may recover healthy
  hide color and flexibility, but may not redesign the observed cut or joins.
- The square view must show the dark empty opening without flesh, hair, ears,
  head, invisible mannequin, or face-like filler.
