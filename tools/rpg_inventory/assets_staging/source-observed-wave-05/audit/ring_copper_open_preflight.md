# Wave 05 source audit — `ring_copper_open`

Generation status: **DO NOT GENERATE**

Verdict: **REJECT**

The cited object is a valid Iron Age ring source, but it does not support the
proposed row. British Museum 2018,8003.1 is a closed, continuous gold-alloy
loop bent into a V form. It is neither copper nor an open-terminal finger
band. Translating it into the proposed object would change the material and
the topology, while the existing `ring_copper` already occupies the open
copper-ring macro.

## Exact source

- British Museum object record:
  <https://www.britishmuseum.org/collection/object/H_2018-8003-1>
- Museum number: `2018,8003.1`
- British Museum image asset: `1613645881`
- PAS identifier: `KENT-5235BB`; Treasure number `2016T537`
- Exact-object PAS image, reproduced under PAS CC BY 2.0 and inspected
  locally:
  `../references/pas_KENT-5235BB_BM_2018-8003-1_gold_v_ring.jpg`
- Local image: 500 × 353 px; 22,225 bytes; SHA-256
  `89a067acbbdd66681032fe1934eddd6a6085c591e07339743e4110218598d7f2`.
- Image provenance page:
  <https://bigbookoftorcs.com/2024/04/16/nicked-and-nicked-the-knaresborough-gold-ring-and-a-possible-viking-redeposited-iron-age-hoard-from-eastern-england/>

The image shows six orthographic/profile views of one ring, not six objects.

## Verified date and material

- British Museum culture/period: Iron Age.
- Production date: 400–200 BC.
- Museum material: **gold alloy**.
- British Museum XRF surface result: approximately 88–89% gold, 7–8% silver,
  and at least 3% copper.

Calling this object “copper” is unsupported. Calling it “copper alloy” would
also misrepresent the dominant material and the museum classification. The
minor copper fraction in a ternary gold alloy does not make the artifact a
copper-ring source.

## Correct geometry and construction locks

The source supports:

- one complete continuous loop with no break and no terminals;
- round wire, approximately 2.8 mm in circular cross-section;
- overall diameter approximately 19.9–20.4 mm;
- the loop bent upward at two sides so the ring zig-zags around the finger
  and presents a V-shaped crown/profile;
- smooth polish with a few hammer marks and limited flattened areas on the
  inner surfaces;
- no bezel, stone, inscription, terminal heads, coil, or decoration.

The source does **not** support:

- two opposing blunt terminals;
- a narrow open gap;
- a C-shaped/open hoop;
- copper as the principal material;
- a double coil, animal-head ends, bezel, or separate crown component.

The two upward arms visible in profile are bends in the same closed loop.
Treating them as open ends is a topology error.

## Strict visual dedupe

Reviewed current composed rings, staged ring work, the post-calibration ring
pool in Downloads, supply maps, `targets-600.tsv`, and available source-wave
manifests.

Focused comparison:

- `ring_copper_open_dedupe_icon_contact.jpg`

Existing overlap:

1. `assets/ring_copper.png` already provides the open copper-ring macro:
   circular open hoop, opposed terminals, copper surface, and a large central
   hole. It is more ornate and double-coiled, but a second plain open copper
   hoop would collapse into the same identity at 1×1 icon scale.
2. `ring_bronze_v` cites this exact British Museum object and is already
   assigned to promoted post-calibration ring 175. The promoted image is
   actually a closed chevron-tooled bronze band rather than the source's
   bent-V wire form, so that mapping needs its own later audit; it still means
   this source is already roster-claimed and must not seed a second row.
3. Current signets, stone-set rings, bone hoops, jade/amber bands, and dark
   metal bands are different construction families and are not the reason for
   rejection.

No Wave 05 or other available manifest contains a completed
`ring_copper_open` generation. The collision is conceptual and roster-level,
not a duplicate filename.

## Roster worthiness and 1×1 legibility

The exact closed gold V-ring can remain legible as a distinct ARPG ring only
if its V deformation is made the primary silhouette. A three-quarter view
must show the complete closed hoop, central finger opening, and both upward
bends together. At 64 px the V can still read as a crown/chevron, but only
with a substantial round section and a controlled angle.

The proposed **open copper** version is not worth a second roster slot:

- its open gap and blunt terminals repeat `ring_copper`;
- a plain thin gap is likely to disappear at icon scale;
- enlarging the gap/terminals enough to read turns it into a torc, cuff, or
  miniature neck ring;
- flattening the source to emphasize an opening destroys the authentic V
  construction.

If the exact V-ring is retained elsewhere, use S / 1×1 square framing with
one complete isolated ring in a dynamic three-quarter product view, roughly
10–12% safe margin, full interior opening visible, and the V crown tilted
toward the viewer. Never use a flat side-only horseshoe view or a sheet of
multiple views.

## Failure taxonomy and hazards

- **material substitution:** gold alloy silently rendered as copper/bronze;
- **topology substitution:** continuous closed loop changed into open ends;
- **view confusion:** profile arms misread as opposing terminals;
- **duplicate macro:** plain open copper hoop repeats `ring_copper`;
- **slot confusion:** oversized gap or thick ends read as torc, cuff, earring,
  or bracelet rather than a finger ring;
- **icon collapse:** narrow wire and subtle V disappear at 64 px;
- **modernization:** contemporary wishbone wedding band, flawless machine
  symmetry, mirror polish, or retail-jewelry presentation;
- **fantasy completion:** bezel, gem, symbol, terminal heads, coil, or
  decorative crown added to improve readability;
- **source-sheet copying:** multiple rings/views, ruler, caption, or white
  museum background reproduced in the inventory image;
- **bad framing:** flat front elevation, cropped hoop, hidden interior opening,
  finger/hand anatomy, stand, or box.

## Release condition

Do not generate `ring_copper_open` from BM 2018,8003.1. Either:

1. retire the row because `ring_copper` already fills the open copper-ring
   macro; or
2. find a different exact ancient copper/copper-alloy finger ring that
   visibly has a genuine open gap and terminal construction, then rerun the
   source and dedupe gates.

Reserve BM 2018,8003.1 only for a closed V-shaped gold-alloy ring concept,
subject to resolving the existing `ring_bronze_v` source/mapping conflict.
