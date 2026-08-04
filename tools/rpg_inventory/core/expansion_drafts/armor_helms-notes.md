# Armor + helms expansion draft

Phase 1 only. This file records the corrected ladder architecture, historical
QA resolution, intake triage, and dedupe status. It does not authorize image
generation, staging, shared-manifest edits, runtime wiring, or asset promotion.

## Corrected portfolio shape

`armor_helms.tsv` contains exactly 50 bases:

- 25 body-armour bases in five five-rung ladders.
- 25 headgear bases in five five-rung ladders.
- Runtime kind `body`: `body_corselet`, `body_cuirass`, `body_lamellar`,
  `body_splint`, and `body_banded`.
- Runtime kind `helmet`: `helmet_light`, `helmet_open`, `helmet_ridged`,
  `helmet_segmented`, and `helmet_neckguard`.
- Every body base is 2x3. The rejected 2x4 coat, robe, skirt, apron, and
  pteruges concepts were removed rather than treated as body-slot inventory.
- Every helmet is 2x2.

Each class now follows the authoritative ARPG material economy:

| Tier | Required read | Portfolio implementation |
|---:|---|---|
| 1 | organic/simple | bast, rawhide, bark, bone/tusk, cane, quilted textile, or layered leather |
| 2 | copper/early worked | bounded copper discs, copper scales/lamellae/splints/bands, or copper translations of ancient helmet bowls |
| 3 | bronze martial | mature bronze scale, bell cuirass, lamellar, splint, band, pilos, Chalcidian, Illyrian, segmented, or Montefortino construction |
| 4 | exotic/ritual | direct crocodile-hide armor, prestige muscle cuirass, horn/lacquer systems, one bounded amber field, direct Sasanian prestige construction, or a documented gilded Byzantine protective helm |
| 5 | raw dark skymetal | ancient construction translated into healthy raw dark meteoric iron with no glow, gilding, crystal, or modern/medieval completion |

Historical chronology controls silhouette plausibility but no longer assigns
the gameplay tier. A Late Antique form can provide T2 copper or T3 bronze
geometry only when the material translation remains mechanically buildable and
the row says so explicitly.

## Historical-QA correction ledger

All non-PASS rows from `qa-historical.md` were revised or removed:

### Body armor

- `body_fiber_corded_vest` (HOLD): removed. Replaced with a copper-disc
  corselet whose four peened discs have broad doubled-textile load patches.
- `body_fiber_linen_panoply` (REVISE): removed. No lower flaps remain in this
  portfolio.
- `body_fiber_warded_robe` (HOLD): removed; the unsupported ankle-long robe
  and its 2x4 body-slot footprint are gone.
- `body_hide_crocodile_coat` (REVISE): replaced by `River-Hide Corselet`,
  following the surviving BM armor's actual fitted hide cut and seam map rather
  than invented rectangular coat panels.
- `body_pectoral_hide_harness` (HOLD): removed. The speculative strap harness
  is not retained.
- `body_pectoral_bronze_harness` (HOLD): removed. No crescent shoulder plates
  or invented articulated back remain.
- `body_pectoral_iron_panoply` (REJECT): removed completely.
- All five `body_longcoat` rows (REJECT/HOLD/REVISE): removed as a family.
  There are no loin panels, skirts, coats, tassets, pteruges, or belt-like
  lower components in the rebuilt body portfolio.
- `body_plate_copper_shell` (REJECT): removed. T2 copper is expressed through
  plausible bounded reinforcement or thin scale/lamellar/splint/band systems,
  never a full two-plate copper torso shell.
- `body_plate_bell_cuirass` (REVISE): moved to T3 as `Bronze Bell Cuirass`.
- `body_plate_banded_panoply` (REVISE): the ordinary-iron T5 row was replaced
  by an explicit raw dark meteoric-iron material translation.

The new `body_lamellar`, `body_splint`, and `body_banded` ladders use complete
backings, drilled or peened interfaces, continuous load-bearing rows, and
hand-varied spacing. No hard plate is described as decoration pasted onto a
soft vest.

### Helmets

- `helmet_soft_disc_brow` (HOLD): removed. Intake index 102 is no longer
  accepted because the three brow discs cannot be confidently distinguished
  from pasted decoration.
- `helmet_soft_river_hide_hood` (REVISE): moved from T5 to T4 and rewritten
  around the BM Roman-Egyptian helmet's actual fitted hide construction.
- `helmet_composite_bone_cap` (HOLD): replaced by the directly documented
  Mycenaean tusk-plate cap construction: pierced tusk plates in alternating
  rows over a full rawhide/felt backing.
- `helmet_composite_bark_panel` (HOLD): removed.
- `helmet_composite_shell_lamellar` (HOLD): removed.
- `helmet_composite_bronze_ridge` (REJECT): removed. No bronze frame is pasted
  over cosmetic hide half-shells.
- Negau/Attic/Chalcidian/Boeotian/Phrygian and
  bowl/pilos/Montefortino/Coolus/Imperial forms were rebuilt as actual
  T1-T5 material ladders rather than numbered by chronology.
- T4 Boeotian and Coolus rows use only one small protected amber allocation,
  leave at least ninety percent plain bronze, and avoid radial repetition.
- `helmet_segmented_browband` and `helmet_segmented_steppe_cone` (REJECT):
  removed. Their places are a documented organic tusk cap and a buildable
  four-plate copper translation.
- The residual `Ritual Horn Helm` was removed. Its replacement, `Gilded Field
  Spangenhelm`, follows the Met's sixth-century protective helmet: rounded iron
  crown plates, external gilt-copper structural bands, cheek guards, and nape
  defense. Copied figures, animals, and sacred imagery are explicitly omitted.
- The adjacent T5 rung is now a pointed `Skymetal Steppe Cone`, preserving a
  macro-silhouette change from the rounded T4 spangenhelm while translating
  ancient composite-panel load paths into raw dark meteoric iron.
- Ordinary Late Roman ridge construction is used as a T5 skymetal translation;
  direct Sasanian cross-band construction occupies the T4 prestige rung.

## Body-slot contamination audit

Every body description was checked for slot leakage:

- no belt, girdle, sash, buckle, hanging waist rig, skirt, pteruges, tasset,
  apron, loin panel, trousers, leggings, greaves, boots, or cloak;
- all armor ends at a compact waist or hip edge;
- no body or mannequin anatomy is present;
- no mail is used;
- shoulder protection is integrated as a continuous course, shell edge, yoke,
  or band rather than a pasted fantasy pauldron.

## Mechanical-interface audit

The rebuilt hybrid constructions are functional, not cosmetic:

- copper discs are peened through broad doubled textile patches;
- scale rows overlap on a complete backing;
- lamellae have edge holes and joined rows;
- splints sit in full channels or on reinforced continuous backing;
- articulated bands wrap the complete front and back;
- amber appears only as a few protected recessed T4 fittings;
- hard organic T4 systems use thick horn plates/splints with drilled joins and
  complete backing;
- skymetal replaces the load-bearing hard material, never floats as trim on a
  cheap body.

## Dedupe against the calibrated 400-row batch

Compared against:

`C:\Users\Alex\Downloads\items_multi_context_balanced_v1\balanced_item_manifest.tsv`

That manifest plans 36 `body_armor` and 40 `headgear` rows. At correction time,
17 body and 7 head outputs existed. The generated body pool is heavily
concentrated in short quilted, disc/splint, scale, and lamellar vests. The
generated head pool covers Urartian cones, one tusk/horn cap, several felt/bast
caps, and one Illyrian/Corinthian-like bowl.

The TSV therefore treats these as economy/gap candidates, not an unconditional
generation queue. Before generation:

1. alias any exact silhouette already accepted from the calibrated pool;
2. preserve the complete five-rung base ladder even when one rung aliases
   existing art;
3. generate only silhouette/material combinations not already represented;
4. never reroll an accepted alias merely to make the ladder visually uniform.

## `items_post_calib_batch` triage, sorted indices 87-129

Indexing is zero-based after PowerShell `Get-ChildItem -File | Sort-Object Name`.

- Index 93, dark short lamellar armor: retained as the T3 `Dark Bronze
  Lamellar` intake candidate. It has a continuous backing and credible overlap.
- Index 102, fur-lined disc-brow cap: withdrawn after historical QA because the
  discs may be pasted decoration.
- Index 113, long lamellar strip-skirt armor: withdrawn even as a reference;
  its lower-body and shoulder treatment would propagate slot contamination.
- Indices 91, 104, 111, 114, and 128 remain rejected for fantasy/medieval
  ornament, repeated bosses, pasted regalia, or non-protective crown treatment.
- All other indices in 87-129 belong to other portfolios and were not
  reclassified here.

## Historical anchors

Direct or museum-published anchors now carry the high-risk forms:

- BM EA5473 for the actual Roman-Egyptian crocodile-hide cuirass and helmet.
- Met 1992.180.3a,b for the fourth-century-BCE Apulian muscle cuirass.
- Met 49.104 for the fifth-century Sasanian cross-band helmet.
- Met 35692 / Met arms-and-armor bulletin for sixth-century segmented helmet
  construction.
- Met `Assyria to Iberia` for pierced, alternating Mycenaean boar-tusk helmet
  plates over leather and felt.
- Met 257808 for Illyrian twin-ridge geometry.
- BM H_1950-0706-1 for Coolus/neck-guard geometry.
- BM H_1982-0103-9 for articulated-band load-path evidence.
- Met 42.50.1 for a genuine sixth-century Byzantine protective prestige
  spangenhelm with structural gilt-copper bands.
- Met 326389 and 26565 for ancient scale/lamellar attachment and backing.

Where a material is a Verdigris translation rather than the exact artifact
material, `historical_anchor` says so explicitly. No general collection-term
page is used as proof of an unsupported coat, robe, pectoral wing, or lower-body
assembly.

## Generation hold

No generation calls were made. Pixel-art variants remain downstream of user
approval and sorting.
