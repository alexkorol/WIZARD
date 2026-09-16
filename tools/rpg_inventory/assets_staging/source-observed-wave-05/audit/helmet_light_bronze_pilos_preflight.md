# Wave 05 preflight: `helmet_light_bronze_pilos`

## Decision

**REJECT new generation as an exact duplicate; reuse the existing Pilot-02
asset. No generation performed.**

The roster concept itself passes the historical-object and ARPG equipment
gates. Two dated museum objects directly establish a wearable bronze pilos
helmet rather than merely discussing Greek warfare. However,
`assets_staging/pilot-02/raw/helmet_light_bronze_pilos.png` already represents
this same art ID, material, conical cap-shaped bowl, blunt apex, open lower
edge, lack of cheek/neck elements, S canvas, and 2x2 footprint. The Pilot-02
report gave it **PROVISIONAL ACCEPT**. A second generated pilos would add no
slot or macro-silhouette value.

The existing cleaned extraction is not the preferred reusable source without
another local cleanup pass: its right edge retains hot red/magenta fringe.
That is a matte-extraction issue, not grounds for another generative attempt.
Reuse the intact raw square and re-run or repair local chroma cleanup before
promotion.

This decision also applies the loadout roster gate: the fact that a mock
character wears or holds something is not sufficient reason to make another
game item. Here the item is independently documented and equipment-valid, but
the inventory need has already been filled.

## Exact museum authorities

### Primary construction lock: Metropolitan Museum of Art 08.2.4

- Object: **Bronze pilos (helmet of conical shape)**.
- Culture and period: Greek, Classical.
- Date: **5th century BCE or later**.
- Medium: bronze.
- Height: 20.5 cm.
- Object record:
  <https://www.metmuseum.org/art/collection/search/248012>
- Official Open Access image:
  <https://images.metmuseum.org/CRDImages/gr/original/DP147256.jpg>
- Local reference:
  `references/met_248012_DP147256_greek_bronze_pilos.jpg`
  (4000x4000 RGB; SHA-256
  `aa8bddd99aa4c9904dcb6d4be6f9b6ec28726025ba26b217d6e1940e32689e22`)

The Met explicitly identifies this object as a pilos helmet and explains that
the form derives from the similarly shaped felt cap. This object controls the
target: a single continuous steep conical bronze shell with a softened/blunt
apex, a small high perforation, slight lower flare, narrow integral rim, and a
restrained double horizontal groove immediately above the lower edge.

### Corroborating complete-depth/brim evidence: Getty 83.AC.8.1

- Object: **Helmet**, alternate title **Conical Helmet**.
- Culture: South Italian.
- Date: **late 6th century BCE**.
- Medium: bronze.
- Height: 21.5 cm.
- Getty description: a conical helmet in the shape of a pilos (felt hat).
- Object record:
  <https://www.getty.edu/art/collection/object/103XZ5>
- Official IIIF image:
  <https://media.getty.edu/iiif/image/7cdeecf6-6859-4fab-b464-c39230872f2e/full/max/0/default.jpg>
- Local reference:
  `references/getty_83.AC.8.1_103XZ5_bronze_pilos.jpg`
  (7673x8254 RGB; SHA-256
  `9f450b21a8505075ff0fe95c674c0905f963a5aacccac640bbd7c54f9dd85385`)

The Getty photograph is useful secondary evidence that the family is a
complete deep shell with a continuous circumference and lower edge. Its
broader shallow brim must not be averaged into the Met object's narrower
rim-and-groove geometry. If the Getty object is ever selected as the sole
primary instead, its own brim must be followed consistently.

## Observed construction locks

For the Met-controlled target:

- one materially continuous, metal-led, beaten bronze conical shell;
- complete dome and mechanically present rear bowl, not a front facade;
- gently rounded/blunt apex rather than a needle point or top knob;
- slight lower flare with one continuous circumferential edge;
- narrow integral lower rim and restrained paired groove/band above it;
- open face and open lower circumference with dark empty interior;
- no separate cheek pieces, neck guard, nasal, ear flaps, brow peak, crest
  track, plume, hinged fittings, or mail;
- no head, hair, ears, face, skin, mannequin, display mount, or other anatomy;
- active-service bronze: healthy warm metal, hand-hammering, shallow scratches,
  light handling polish, edge wear, and mild localized tarnish only.

The small high perforation visible on the Met object may be retained as an
observed feature, but it must remain a single small functional-looking hole.
Do not multiply it into ventilation, lacing, or decorative perforation rows.

Museum burial state is not a finish reference. Do not reproduce corrosion,
green patina, pale mineral crust, deep pitting, dirt, dents that compromise
readability, cracks, missing metal, or conservation/display hardware.

## Grid and framing

- Generator canvas classification: **S**, square.
- Runtime footprint: **2x2**.
- The existing raw output is 1254x1254 and already uses the intended compact
  square silhouette.
- A future local presentation pass must keep the apex, complete lower edge,
  rear-depth cue, and all side margins uncropped.
- A three-quarter view is preferred when re-presenting the asset because it
  proves the full dome/back. The existing near-frontal raw remains structurally
  complete enough for reuse; do not regenerate merely to change the camera.

## Strict prior-art audit

Existing visual audit sheets:

- `audit/helmet_prior_art_contact_01.jpg`
- `audit/helmet_prior_art_contact_02.jpg`

The first sheet includes all current/staged helmet-name hits, helmet-classified
post-calibration rows, balanced headgear outputs, and the Pilot-02 pilos in
both raw and cleaned form.

Exact duplicate:

- `assets_staging/pilot-02/raw/helmet_light_bronze_pilos.png`
  (1254x1254 RGB; SHA-256
  `445d0b1ba660b89cfa30b9706b8913a89d608fbb0c51f37c3ec658467b8d54dc`).
  It is a complete empty bronze cone with softened apex, continuous deep bowl,
  dark opening, lower flare, and no cheek or neck elements. Its robust raised
  lower band is somewhat stronger than the Met object's fine groove, but the
  macro-silhouette and roster identity are exact.
- `assets_staging/pilot-02/clean/helmet_light_bronze_pilos_clean.png`
  (859x971 RGBA; SHA-256
  `a8df0b87a01999b77e029339408d670b14d74b7c64e4c7866139d7383976f59a`).
  The isolated shape is usable in principle, but the visible hot edge fringe
  should be repaired locally from the raw source before promotion.
- `core/PILOT-02-REPORT.md` records the output as **PROVISIONAL ACCEPT**:
  complete, plain, non-medieval, and structurally present despite a more
  frontal view than ideal.

Distinct neighboring families:

- `helm_bronzescale.png` is a crested, scale-faced enclosed helmet with cheek
  protection; it does not duplicate a plain pilos.
- The existing simple pointed hide/felt caps are organic panelled helmets with
  cheek/ear extensions, not a one-piece bronze shell.
- H-09 hemispherical bowls are low rounded domes, not steep conical caps.
- H-10 pointed conical caps risk a sharper apex and may include cheek
  protection; the pilos is specifically the clean cap-derived H-17 form.
- H-12 through H-16 Corinthian, Chalcidian, Illyrian, Attic, and
  Phrygian/Thracian families use face structures, cheekpieces, crest ridges,
  hinged elements, or forward-curving crowns absent here.
- H-20 Montefortino and later bowl families use a top knob and rear neck guard.
- H-26/H-28/H-29 segmented cones expose plates, bands, or brow-frame
  construction absent from a one-piece pilos.

These distinctions establish that the pilos deserves its own family in the
taxonomy, but the exact family is already occupied by the Pilot-02 asset.

## Failure hazards

- Do not generate another item for this row; reuse and locally clean the
  existing Pilot-02 raw.
- Do not make a backless helmet facade or crop the apex/lower circumference.
- Do not sharpen the crown into an Assyrian spike, witch hat, medieval nasal
  helm, or fantasy cone.
- Do not bend the apex forward into a Phrygian/Thracian cap.
- Do not turn the apex into a Montefortino knob or crest socket.
- Do not flatten the shell into a hemispherical bowl, skullcap, or felt cap.
- Do not broaden the edge into a Boeotian or medieval kettle-hat brim.
- Do not add Corinthian eye/nose openings, nasal bar, cheekpieces, ear cutouts,
  rear neck guard, mail, plume, crest, or separate brow hardware.
- Do not turn the narrow Met groove into a thick separate brow ring, segmented
  band frame, decorative cable, or repeated rivet row.
- Do not introduce one-sided cheek/neck elements or imply missing counterparts.
- Do not copy archaeological patina, mineral encrustation, corrosion, cracks,
  dirt, display stand, or museum lighting.
- Do not include anatomy or flesh-colored filler inside the opening.
- Do not accept hot red/magenta chroma fringe on the promoted cleanup.

