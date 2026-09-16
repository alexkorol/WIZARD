# Wave 05 preflight: `body_cuirass_bronze_bell`

Date: 2026-07-24 PDT  
Generation status: **not generated**

## Decision

**REJECT the current candidate and its cited source claim. Do not generate.**

Met object **256134** is not a mature Bronze Age bell cuirass. It is accession
1992.180.3a, b, a Greek Apulian anatomical cuirass dated to the fourth century
BCE. The Met explicitly describes its front and back plates as modeled
renderings of the male torso, with the two shells hinged at the sides and tied
at the shoulders. That is the separate heroic/muscle-cuirass family already
reserved by adjacent roster row `body_cuirass_heroic`.

The actual Met Late Bronze Age bell-shaped cuirass is object **248133**,
accession 09.41, Hallstatt, twelfth-tenth century BCE. Its official front and
back images were downloaded for comparison. They verify a complete two-shell
bell cuirass, but they also show dense embossed knobs and dotted lines used to
stylize male anatomy. The current brief's "plain" and "no anatomy" claims
therefore do not faithfully transcribe that object either.

A future replacement may be authored around Met 248133, but it is a different
source decision and must be re-audited. It may not inherit the current prompt
or Met 256134 citation.

## Official record check

| Met object | Verified identity | Date / culture | Construction evidence | Result for this row |
|---|---|---|---|---|
| [256134](https://www.metmuseum.org/art/collection/search/256134) | Bronze cuirass, accession 1992.180.3a, b | 4th century BCE; Greek, Apulian | Separate front and back anatomical shells; side hinges; shoulder rings formerly laced with leather; deeply modeled chest, abdomen, and back | **Wrong source.** This is the heroic row, not the Bronze Age bell row. |
| [248133](https://www.metmuseum.org/art/collection/search/248133) | Bell-shaped bronze cuirass, accession 09.41 | 12th-10th century BCE; Hallstatt | Distinct front and back sheet-bronze shells hinged together; deep waist and continuous flared lower rim; embossed knobs and dotted rows create stylized male anatomy | **Correct object family, incompatible with the current plain/no-anatomy transcription.** |

The Met lists object 256134 at 49.8 cm high in front and 51 cm high in back.
Object 248133 is 51 x 39.4 cm overall. Both are true torso-scale armor and fit
a portrait inventory treatment; their identities and surface programs are not
interchangeable.

## Local official references

All four files are exact Met Open Access originals.

| Local file | Role | Dimensions | SHA-256 |
|---|---|---:|---|
| `references/met_256134_DP102285_apulian_muscle_cuirass_primary.jpg` | **Mismatch evidence:** primary view of the cited Apulian muscle cuirass | 1779x1779 | `C1A682DE1D7891570AD5F64562F73D3832D821FABE2B5F443981A50D9DEFA17A` |
| `references/met_256134_DP-44280-001_apulian_muscle_cuirass_reverse.jpg` | **Mismatch evidence:** second shell/view; modeled back anatomy and side joins | 2953x4000 | `E5E4FF3C76F48C1263890BC8DC7702F7B2150D548E403824D0AABD85C30FA52A` |
| `references/met_248133_DP251338_hallstatt_bell_cuirass_front.jpg` | **Correct-family comparison:** one Hallstatt shell, neck/shoulder overlap and side join visible | 3082x4000 | `55186780E46E9FE8A25F20A55EB6460873E60841BDF96A105FF86C8600272C46` |
| `references/met_248133_DP251327_hallstatt_bell_cuirass_back.jpg` | **Correct-family comparison:** opposed Hallstatt shell and corresponding join geometry | 3097x4000 | `20910172CF9A5244DC78B0996C7E6C4315EE71CF9A97DD667CC7981A486BB9AB` |

No faction image is needed to decide this audit. Museum burial surfaces are
not finish references.

## Source gate

### Met 256134

**FAIL.** The record and both local images contradict the candidate's claimed
period and family:

- Classical, not mature Bronze Age;
- naturalistically modeled muscle cuirass, not the knob-and-dot Hallstatt bell
  cuirass;
- strongly anatomical chest, abdomen, navel, and back;
- already the exact evidence assigned to `body_cuirass_heroic`.

The source does verify complete front/back shell construction and side joins,
but for the wrong row.

### Met 248133

**Conditional source-family pass only.** It visibly supports:

- two complete opposed sheet-bronze torso shells;
- corresponding side hinge elements;
- broad shoulder/neck overlap;
- deep waist;
- continuous outward-flared lower rim;
- a compact bell-like torso mass suitable for an isolated icon.

It does **not** support a mostly plain, anatomy-free shell. Large repeated
embossed knobs and dotted lines cover both plates and form stylized anatomical
fields. Suppressing all of that would be a new design abstraction rather than
a direct transcription of the inspected artifact.

## Game-roster gate

The underlying bell-cuirass family **passes in principle**:

- mechanically meaningful body armor;
- strong, compact ARPG torso silhouette;
- clear T3 bronze progression between organic/copper shells and the separate
  T4 heroic prestige cuirass;
- credible `P` canvas and `2x3` runtime footprint.

The current row still fails release because its identity is attached to the
wrong object and duplicates the heroic row's exact source. Roster utility
cannot override source identity.

## Prior-art and visual dedupe

The audit visually reviewed:

- current composed `wrap_*` body assets;
- body/corselet/cuirass staging and prior Wave outputs;
- every post-calibration image classified as body armor or body outfit;
- every `01__body_armor.png` in the multi-context download corpus;
- body-family `review_reuse` and `promote` mappings in `targets-600.tsv`;
- the armor/helmet supply and triage rows.

Saved contact sheets:

- `audit/body_cuirass_bronze_bell_prior_art_01.jpg`
- `audit/body_cuirass_bronze_bell_prior_art_02.jpg`
- `audit/body_cuirass_bronze_bell_postcalib_contact.jpg`

Findings:

- No accepted or promotable existing image supplies a complete joined
  front-and-back Bronze Age bell shell.
- Existing bronze body art is scale, studded hide, lamellar, sparse pectoral,
  or later/fantasy anatomical plate; those are different construction
  families.
- Several downloaded outputs converge on anatomical bronze breastplates,
  faulds, shoulder plates, corsets, or medieval/fantasy torso shaping. They are
  hazards, not reusable bell-cuirass art.
- The hard duplicate is in the roster itself:
  `body_cuirass_heroic` already cites Met 256134 and correctly describes its
  separate modeled front/back shells. Generating `body_cuirass_bronze_bell`
  from the same object would create a renamed near-duplicate and collapse T3
  into T4.
- A direct SHA-256 scan of the project, post-calibration batch, and balanced
  item-output corpus found the four downloaded Met files only at the Wave 05
  reference paths. There is no hidden byte-identical prior art to promote.

## Construction locks for any future corrected row

If a new candidate is built around Met 248133, lock all of the following:

1. One complete empty cuirass, not a single breastplate facade.
2. Two distinct thin hammered bronze shells, front and back, visibly
   corresponding in depth and edge profile.
3. Side hinges/rolled hinge elements must remain legible; do not replace them
   with medieval buckles, straps, modern rivet rows, or a seamless molded tube.
4. Broad shoulder/neck overlap must prove the rear shell exists in the
   three-quarter view.
5. Deep waist and one continuous outward-flared hip rim; no fauld, skirt,
   pteruges, tassets, belt, or lower garment.
6. Portrait `P` generation framing and `2x3` runtime grid, complete and
   uncropped with the lower flare visible.
7. Healthy active-service bronze with restrained hammer variation and
   localized handling wear only; do not copy green burial patina, cracks,
   holes, edge loss, museum numbers, stand, or cast shadow.
8. No body, mannequin, flesh, undershirt, legs, or anatomy filling the
   openings.
9. No medieval waist pinch, peascod projection, separate gorget, pauldron,
   breastplate waist tabs, or backplate articulation.
10. Decide explicitly whether the Hallstatt knob-and-dot anatomical program is
    retained in a bounded, source-faithful reduction or the row is replaced by
    a plainer documented bell cuirass. Do not silently call Met 248133 plain.

## Failure taxonomy and hazards

- **Wrong-object failure:** Met 256134 produces the heroic Apulian muscle
  cuirass, not the intended Bronze Age bell family.
- **Roster collision:** same museum object, same front/back shell mechanism,
  and same bronze torso slot as `body_cuirass_heroic`.
- **Facade failure:** front breastplate only, with no visible rear shell,
  overlap, or side join.
- **Anatomy failure:** copied abdominal, pectoral, nipple, navel, spine, or
  buttock modeling; mannequin/flesh inside the shell.
- **Lower-garment contamination:** belt, skirt, fauld, pteruges, tassets,
  trousers, or apron.
- **Medieval drift:** narrow corseted waist, peascod belly, gorget, pauldrons,
  articulated plate harness, modern straps, buckles, or machine rivets.
- **Shell-collapse failure:** seamless one-piece tank top or thick cast vest
  instead of two thin opposed plates.
- **Join failure:** invisible hinges, mismatched front/back depth, one-sided
  shoulder attachment, floating shell, or implausible lacing.
- **Rim failure:** missing/cropped hip flare, separate applied skirt band, foot
  ring, or exaggerated razor-like lip.
- **Ornament failure:** all-over identical bosses/dots reproduced as fantasy
  studs, solar/radial layouts, jewels, scenes, or copied museum damage.
- **Finish failure:** archaeological green crust, burial staining, pitting,
  cracks, missing edges, conservation stand, or museum inventory number.
- **Framing failure:** square crop, tiny torso, cropped shoulders/lower flare,
  flat front-only view, cast shadow, floor, or nonuniform background.

## Release condition

Do not repair this row merely by changing the URL. Either:

1. retire it as a duplicate of `body_cuirass_heroic`; or
2. replace the citation with Met 248133 (or another exact mature Bronze Age
   bell cuirass), rewrite the brief around the visible surface program and
   joins, and repeat source/dedupe review before prompt lock.

Until then: **REJECT / DO NOT GENERATE**.
