# Wave 05 source audit — `ring_copper_bezel`

Generation status: **DO NOT GENERATE**

## Verdict

**REJECT as authored.**

Met 550835 is a securely dated ancient **bronze** signet ring, but it cannot
serve as an exact visual source for the proposed copper blank-bezel ring. The
current Met object page explicitly says **“No image available,”** and the
official Open Access API supplies neither a primary image nor additional
images. The catalogue confirms that a bezel exists and gives its length, but
does not publish its shape, decoration, shoulders, hoop, underside, or join
construction.

The row therefore asserts four visually decisive facts that cannot be inspected
in the cited source: copper material, an oval face, an integral bezel, and a
blank/tool-mark-only surface. It also duplicates the already-promoted blank
signet macro and a separate planned `ring_bronze_signet` row that cites the same
Met object.

This is an audit-only rejection. No prompt was authored and no image was
generated.

## Exact official source and available evidence

- Metropolitan Museum of Art object:
  <https://www.metmuseum.org/art/collection/search/550835>
- Title: **Signet Ring**
- Met object name in the API: **Ring, Akhenaten**
- Object number: `58.106.2`
- Period: New Kingdom, Amarna Period; Dynasty 18
- Reign: Akhenaten to Haremhab
- Date: **ca. 1353–1295 B.C.**
- Geography: Egypt
- Museum medium: **Bronze**
- Published dimension: **bezel length 2.4 cm**
- Credit line: Rogers Fund, 1958
- Current gallery: 122
- Official Open Access API:
  <https://collectionapi.metmuseum.org/public/collection/v1/objects/550835>
- Local official metadata snapshot:
  `references/met_550835_api.json`
  (1,438 bytes; SHA-256
  `578cdc992ccafdcdd757573d0a07e5472e2a6b8f7a9e3b60dd177aea49e0bfe1`)

No official object view was downloadable:

- the object page states **“No image available”**;
- API `primaryImage` and `primaryImageSmall` are empty strings;
- API `additionalImages` is an empty array;
- the record supplies no textual description of bezel geometry or decoration.

Accordingly, there is no local official photograph for this object. The JSON
snapshot is retained as the exact official evidence of both the catalogue facts
and the image absence. A search by object number, accession number, title, and
Met publication domain did not locate a second official Met view.

## Date and material gate

- **Ancient date: PASS.** The New Kingdom date is well inside the project
  ceiling.
- **Bronze source material: PASS for a bronze concept.**
- **Copper material claim: FAIL.** The Met classifies the object as bronze.
  Bronze is a copper alloy, but that does not make the artifact evidence for a
  pure or intentionally low-alloy copper T2 ring. The roster treats copper and
  mature bronze as separate progression materials.
- Rendering this source in bright active-service copper would be an explicit
  material translation, not an exact-source reconstruction. The row and source
  note do not acknowledge that translation.

If a copper bezel rung remains necessary, it needs a complete photographed
ancient object catalogued as copper or an explicitly characterized
copper-dominant alloy compatible with the T2 material rule.

## What the exact record does and does not lock

Directly supported:

- one ancient Egyptian object catalogued as a signet ring;
- bronze as its material;
- a bezel exists;
- bezel length is 2.4 cm;
- the object is associated in Met metadata with Akhenaten.

Not supported by any accessible official view or description:

- complete versus fragmentary condition;
- closed hoop and full finger opening;
- hoop section, diameter, thickness, or symmetry;
- shoulder width and transition into the bezel;
- one-piece/integral casting versus separate bezel and shank;
- oval, round, rectangular, octagonal, lozenge, or scarab-shaped bezel;
- flat, domed, recessed, pierced, rotating, or socketed face;
- blankness, tool marks, inscription, relief, seal device, or other decoration;
- absence of a stone, faience, glass, scarab, or rotating seal element;
- underside hollowing or wearability.

The `Ring, Akhenaten` API label makes it especially unsafe to assume the face is
blank. It may indicate a named or inscribed association, but without a view or
description the audit cannot determine whether any decoration exists, whether
it is incidental, or whether omitting it would erase the object's identity.
The correct finding is **unknown**, not “blank.”

## Complete hoop / shoulders / bezel test

**Fail for exact-source generation.**

The 2.4 cm bezel measurement proves only the measured element. It cannot prove a
complete hoop, bilateral shoulders, an integral transition, or an unobstructed
finger opening. A plausible generic reconstruction would still be invented
geometry. This is the same exact-source failure avoided elsewhere in Wave 05:
object-type plausibility does not replace visible construction evidence.

Before reconsideration, an exact official or museum-authorized view set must
show:

1. the entire closed hoop and opening;
2. both shoulders and their attachment/continuity with the bezel;
3. the complete bezel face and profile;
4. the underside or a sufficiently rotated view to establish the assembly;
5. any inscription, seal design, setting, or rotating element.

## Strict visual and roster dedupe

Prior-art sheets inspected:

- `assets_staging/source-observed-wave-03/audit/ring_existing_staged_contact.jpg`
- `assets_staging/source-observed-wave-03/audit/ring_postcalib_contact.jpg`
- `assets_staging/source-observed-wave-05/audit/ring_stone_integral_prior_art_contact.jpg`

They cover every current/staged ring-name hit and the full post-calibration ring
pool. The current target roster and supply assignments were checked separately.

### Existing and promoted collisions

- Post-calibration row 26 /
  `ChatGPT Image Jul 10, 2026, 11_03_56 PM (6).png`
  is already promoted as `salvage_ring_026` and assigned to
  `ring_bronze_signet`. It is a compact bronze signet with broad shoulders, a
  blank octagonal face, and three restrained parallel cuts. This is already the
  strongest source-safe blank authority-bezel icon.
- Post-calibration row 162 /
  `ChatGPT Image Jul 13, 2026, 11_28_53 PM (8).png`
  is promoted as `salvage_ring_162`. It is a compact dark signet with a low
  circular bounded face and complete readable hoop.
- Current `assets/signet_bronze.png` already owns the large bronze signet macro,
  although its solar face is prohibited for new base designs.
- Current `assets/ring_copper.png` owns the copper-material ring read. Its open
  double-coil topology differs from a signet, so it is not an exact silhouette
  duplicate, but it reduces the value of adding another copper ring whose only
  verified distinction is material.

### Planned collisions

- `ring_bronze_signet` cites **the same Met 550835 object** and is already
  mapped to promoted row 26. The source cannot support both a T2 copper oval
  bezel and a T3 bronze octagonal authority bezel.
- `ring_bone_shouldered` already plans a low empty bezel with thick shoulders.
- `ring_stone_integral` proposed the same low blank shouldered-signette macro
  and was rejected because the complete hoop was not observed and blanking the
  defining face destroyed its source identity.
- `ring_gold_massive_signet`, `ring_obsidian_seal`,
  `ring_skymetal_signet`, `ring_amber_socket`, and
  `ring_skymetal_socket` already reserve the massive, rectangular, lozenge,
  oval-set, and socketed signet variants.
- `ring_bronze_geometric_panel`, plus promoted rows 37, 175, 195, and 205,
  cover bounded panels and decorated metal bands.

At `1x1`, a low blank oval copper bezel would collapse into material/color
variation on rows 26 and 162. Making the face larger, more oval, more polished,
gem-set, or decorated to force distinction would invent evidence or collide
with another planned signet/socket rung.

The earlier broad historical QA marked `ring_copper_bezel` PASS, but that
finding depended on the unverified phrase “integral low blank bezel.” The exact
record and API do not publish those facts, so the current source-observed audit
supersedes that assumption.

## `S` / `1x1` legibility

A generic substantial signet can read well in **S / 1x1** if shown in a
three-quarter top view with the complete hoop opening, both shoulders, and the
face visible. The promoted rows prove that this composition works.

This candidate nevertheless fails the roster gate:

- the only verified physical measure is a 2.4 cm bezel length;
- no view establishes the ratio between face, shoulders, and hoop;
- a low blank face is visually generic at inventory scale;
- shallow tool marks would vanish at 64 px;
- an exaggerated face or shoulder would become invented geometry;
- color alone is insufficient to distinguish a new base from the existing
  blank signets.

## Active-service material rules

If a replacement exact copper object is found, show:

- healthy warm copper color rather than mature golden bronze;
- hand-worked variation and shallow tool marks;
- light handling polish and edge wear;
- mild localized brown tarnish only;
- a complete mechanically credible hoop/shoulder/bezel assembly.

Do not reproduce excavation patina, green verdigris coverage, black corrosion,
powdery oxidation, mineral crust, deep pitting, cracks, missing metal, or
museum mounting. Do not modernize the ring into flawless retail polish,
machine-perfect symmetry, razor-sharp CAD edges, a wedding ring, or a cast
costume prop.

## Failure hazards

- **Material substitution:** Met bronze silently relabelled/rendered as copper.
- **Unsupported geometry:** “oval,” “integral,” low-profile, shoulders, hoop,
  and underside invented from the word “signet.”
- **Defining-detail erasure:** unknown Akhenaten-related seal or inscription
  removed and presented as source-observed blankness.
- **Duplicate source claim:** Met 550835 used for both copper and bronze rows
  with mutually invented bezel shapes.
- **Duplicate macro:** blank low signet repeats promoted rows 26 and 162.
- **Gem invention:** cabochon, glass, faience, scarab, stone, or colored inset
  added despite no accessible evidence.
- **Symbol invention:** seal text, pseudo-hieroglyphs, sun disk, Aten rays,
  starburst, rosette, radial spokes, or modern logo.
- **Modern finish:** mirror polish, factory symmetry, sharp machined chamfers,
  precision pavé, or retail-jewelry presentation.
- **Icon failure:** face shown flat-on while the hoop disappears, cropped band,
  hidden finger opening, excessively thin shoulders, or unreadable tiny marks.
- **Anatomy/prop contamination:** finger, hand, jewelry box, stand, ruler,
  multi-view sheet, caption, or museum background.

## Release condition

Do not generate `ring_copper_bezel` from Met 550835. The row can only return to
review if:

1. a complete photographed ancient copper/copper-dominant bezel ring replaces
   the source;
2. its complete hoop, paired shoulders, bezel profile, face, and joins are
   visible;
3. any decoration can be omitted without deleting the object's construction or
   identity;
4. its 1x1 macro remains distinct from promoted rows 26 and 162 and the planned
   signet/socket families.

Otherwise retire the row and let `ring_bronze_signet` / promoted row 26 occupy
the blank authority-bezel slot.
