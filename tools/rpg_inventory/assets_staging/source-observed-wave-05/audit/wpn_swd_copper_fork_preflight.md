# Wave 05 source audit — `wpn_swd_copper_fork`

## Verdict

**REJECT as an ordinary T2 active-service sword base. Do not draft a prompt and
do not generate.**

The exact British Museum object is visually clear, apparently materially
complete, and strongly distinctive. It is one continuous copper form: pointed
paddle-like blade, rounded longitudinal rib on both faces, narrow integral
metal grip, and an outward-diverging bifurcated pommel. It does not need an
invented handle, guard, grip plates, binding, or separate terminal.

The failure is function and roster placement, not visibility. The exact
British Museum record calls it a sword but supplies no use-wear analysis or
find context proving combat use. The Metropolitan Museum's directly comparable
Indian Copper Hoard antennae-sword record says this class was made from
unalloyed copper and is likely to have been **largely dedicatory** because pure
copper is soft and most examples show little or no wear; the hoard findspots
also suggest ritual deposition in rivers or marshes. The repo's current
`NAMEBANK-PRE-AD.md` independently places Copper Hoard antennae swords in the
rare/ceremonial bucket and says they are usually wrong as common shop/vendor
bases.

Accordingly, the object is best read as a **complete sword-shaped Copper Hoard
object of probably dedicatory/ritual function**, not an incomplete weapon
mount, but also not a secure source for an ordinary active-service rung.

It may be reconsidered only through a separately authorized unique, prestige,
offering, relic, or faction-trophy lane. That would require a fresh roster
check against existing pronged rite objects; this audit does not authorize that
conversion.

## Exact source record

- British Museum object: `1915,0216.1`
- URL: <https://www.britishmuseum.org/collection/object/A_1915-0216-1>
- Museum object type: sword.
- Description: Indian copper sword in one piece, forked pommel, rounded rib
  down both faces, green patina.
- Culture/period: Copper Hoard phase.
- Production date: `2ky BC - 1ky BC`.
- Findspot: India; the record has no more precise archaeological provenance.
- Material: copper.
- Dimensions: 76 cm long and 11.70 cm at the widest point.
- Chronology gate: **PASS.** The museum's broad second-to-first-millennium BC
  date is securely inside the project ceiling.
- Completeness/construction gate: **PASS for the visible metal object.** The
  solo view shows a coherent tip-to-terminal form; the museum explicitly says
  it is in one piece. The page does not list a missing organic grip or separate
  hilt component.
- Combat-function gate: **FAIL for a common weapon base.** The record's label
  "sword" describes the form, but the page does not establish fighting use.

## Function authority

- Metropolitan Museum object `2001.433.50`, Indian copper antennae sword,
  1500–1000 BCE:
  <https://www.metmuseum.org/art/collection/search/50610>
- The Met describes the Copper Hoard group as cast and hammered from unalloyed
  copper, notes the softness of pure copper and little or no wear on most
  examples, and concludes that their function was likely largely dedicatory.
  It also notes likely ritual deposition in rivers or marshes, while recording
  some related swords in burials at Sanauli.
- This is a class-level functional comparator, not a claim that the Met object
  is the British Museum object or that every antennae sword had an identical
  biography.

## Local reference set and source roles

1. `references/bm_1915_0216_1_img_326033001_max.jpg`
   - **Primary and exact geometry authority.**
   - Full isolated plan view; establishes the complete one-piece outline,
     paddle-like blade, long rounded rib, integral narrowed grip, and bifurcated
     terminal.
   - SHA-256:
     `EB5708743F6484FEA19593E927DCB89FE9AF8CAAEE637494CBF29D2482039EC3`
2. `references/bm_1915_0216_1_gallery_group_max.jpg`
   - **Official Copper Hoard class/context view.**
   - The image linked as the second slide on the exact BM page shows antennae
     swords among multiple copper implements. It is not a substitute for the
     isolated exact-object view and the other objects must not be imported.
   - SHA-256:
     `C4111146C4D7E7BEBD5D297A76021647342E1E4F4A23ECA40987DED53EA07B76`
3. `references/met_50610_antennae_sword_dedicatory_parallel.jpg`
   - **Direct class comparator and function-source companion.**
   - Confirms the long one-piece copper antennae-sword family; geometry differs
     in blade narrowness and curled terminal ends, so it may not overwrite the
     BM object's proportions.
   - SHA-256:
     `6BC972E3FB469CFB159600E0829BC986745F32E65F34FC14E60E7AAB32568B0D`

## Construction locks for any separately authorized unique/relic reconsideration

- Keep blade, grip, and terminal as one materially continuous all-copper form.
- Preserve the broad, mostly parallel paddle-like blade and its gradual
  narrowing toward the point.
- Preserve one restrained rounded longitudinal rib down each face. Do not turn
  it into a deep fantasy fuller, razor spine, or multiple ornamental channels.
- Preserve the broad shoulder-to-narrow-waist transition without adding a
  crossguard or ricasso.
- The narrow waist is the integral metal grip. Add no wood, horn, leather,
  plates, rivets, pins, cord, wire, grip wrap, bands, ferrule, or pommel cap.
- Preserve the two widely diverging terminal arms as the pommel. They are not
  a second attack head, trident, animal horns, antlers, hooks, or sharpened
  fork tines.
- Do not invent sharpened cutting bevels, serrations, edge notches, or a
  needle-like point. The source shows a pointed outline and rounded rib but no
  clearly documented fighting bevel.
- Use the exact BM object's shorter broad proportions, not the Met comparator's
  much narrower, longer blade and curled terminal ends.

## Active-service finish gate

The source cannot support "battle-ready" as a functional claim. If Alexei later
authorizes a unique/relic treatment, archaeological green corrosion, crust,
catalog numbers, white museum background, and broken edge noise should still be
removed. The healthy rendering would be restrained warm copper with hand-cast
or hammered irregularity and an uncorroded surface, while retaining the
source-observed blunt/dedicatory edge character. Do not solve the grip problem
by wrapping it and do not make the object look combat-proven with invented
nicks, sharpened bevels, blood, or impact damage.

## Framing

- Requested footprint `P 1x3`: **PASS.**
- At 76 cm long and only 11.70 cm at maximum width, this is a tall narrow
  object suited to a portrait 1x3 slot.
- Any later authorized rendering must show the full point and both fork arms,
  preferably near-vertical or on a steep controlled diagonal. The fork terminal
  must remain large enough to read at 48 px; do not crop it or turn the canvas
  landscape.

## Strict prior-art and roster audit

Visual audit sheet:
`audit/wpn_swd_copper_fork_prior_art_contact.jpg`

Inspected:

- all sword/blade/fork/rod/copper-name matches in current `assets`;
- all relevant staged sword, forked-stave, paddle-rod, ritual, and weapon
  results under `assets_staging`;
- ready/draft weapon manifests, target tables, supply/reuse mappings,
  post-calibration triage, historical QA, correction memo, and the pre-AD
  namebank;
- all five balanced `long_sword` manifest rows and both present generated
  `04__long_sword.png` files under
  `C:\Users\Alex\Downloads\items_multi_context_balanced_v1`;
- the mapped balanced pronged rite object
  `faction_dustwind - STR - tier 2\05__ritual.png`;
- the weapon-range audit for
  `C:\Users\Alex\Downloads\items_post_calib_batch`, including its only
  dagger/long-blade-like candidate at sorted index 29,
  `ChatGPT Image Jul 10, 2026, 11_04_16 PM (1).png`.

Findings:

- There is no exact visual duplicate of the BM Copper Hoard sword.
- `assets/steel_longsword.png` is a medieval crossguard sword and
  `assets/sword_flint.png` is a broad composite stone cutter; neither duplicates
  the one-piece paddle blade/fork terminal.
- The two balanced long swords are conventional point/grip/pommel silhouettes.
  They are not duplicates, although the DEX T2 result already supplies the
  adjacent T3 straight bronze/copper-toned long-sword rung.
- Existing copper dagger, axe, and spear art overlaps material only, not macro
  shape.
- `assets_staging/warbanner_forked_stave.png` and the proposed
  `wpn_rod_forked_wood` overlap only the terminal/fork motif; their wooden shaft
  bodies are mechanically different.
- The balanced `05__ritual.png` already supplies an ornate double-ended pronged
  bronze rite object. It does not visually duplicate the full sword, but it
  means a relic-lane reassignment would not be free of roster overlap.
- Post-calibration index 29 is an ornate medieval-fantasy crossguard blade and
  remains rejected; it is not reusable supply.
- The row has strong silhouette distinction and `P 1x3` readability, but those
  strengths do not override the common-base function failure.
- The older draft historical QA marked this row PASS based on silhouette and
  one-piece logic. That judgment is superseded by the current source/roster
  rules and the repo's explicit classification of Copper Hoard antennae swords
  as rare/ceremonial rather than common bases.

## Failure taxonomy / reject hazards

Reject any later interpretation that introduces:

- an ordinary shop/vendor or combat-progression identity without new
  object-specific use evidence;
- wood or horn grip plates, leather/cord/wire binding, rivets, grip bands, a
  crossguard, ferrule, separate pommel, or any visible seam in the one-piece
  copper body;
- sharpened fork tips, hook blades, antlers, trident logic, or a second attack
  head at the pommel;
- invented razor bevels, serrations, a fantasy needle point, multiple fullers,
  engraved symbols, sacred marks, gems, or dense ornament;
- a narrow European antenna-sword silhouette copied from the Met comparator
  instead of the BM object's broad paddle proportions;
- replacement of the integral narrow grip with a comfortable cylindrical
  wrapped sword handle;
- copied green burial patina, corrosion, crust, white studio background,
  catalog marks, or a multi-object Copper Hoard layout;
- a pronged sceptre/rite-focus read that duplicates the balanced ritual object
  while losing the blade identity;
- cropped point or terminal, landscape framing, or an object too thin for the
  fork silhouette to survive at 48 px.

## Disposition

Retire `wpn_swd_copper_fork` from the ordinary T2 sword ladder and select a
source-observed copper sword with credible active-use construction. Preserve
these references for a future explicitly authorized rare/dedicatory review;
they do not authorize generation in the current wave.
