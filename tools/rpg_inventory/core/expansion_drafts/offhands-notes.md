# Offhands, shields, and rite tools expansion notes

## Portfolio summary

- Exactly 50 proposed bases: 23 shields, 6 bucklers, 1 narrow defensive offhand, and 20 substantial rite foci.
- Tier distribution is even: ten bases at each of T1 through T5. Shield/offhand coverage contributes six bases per tier; rite-focus coverage contributes four per tier.
- Grid footprints follow `INVENTORY-FOOTPRINTS.md`: every buckler and compact hand guard is 2x2, the one narrow elongated guard is 1x2, ordinary full shields are 2x3, body-covering shields are 2x4, compact handled rite tools are 1x2, long sceptres are 1x3, and substantial vessels are 2x2.
- Every row has an official museum or museum-publication anchor. The anchor controls geometry and construction, not excavated surface condition, copied sacred imagery, or modern display styling.
- The T5 material remains raw dark meteoritic iron. It never glows and does not introduce crystal, modern steelwork, machine tooling, or medieval plate language.
- The base-economy mix deliberately limits ordinary round shields. It prioritizes figure-eight, crescent, Dipylon, tall oval, tower, scutum, natural-shell, and parrying silhouettes.
- Rite tools are weighty readable equipment: sceptres, hand bells, rigid rattles, offering vessels, censers, a seal case, and a handled diptych. There are no mirrors, floating orbs, pencil-thin wands, shrine miniatures, or generic magic stones.

## Dedupe against `items_multi_context_balanced_v1`

The calibrated multi-context intake contains 400 manifest rows, including 40
shield assignments and 40 ritual assignments. Those assignments repeatedly use
five broad shield briefs and five broad ritual briefs across factions, axes, and
tiers. At audit time, 12 shield outputs and 6 ritual outputs existed on disk.
All 18 were visually reviewed before finalizing this draft.

Seven ladder bases consume those generated outputs instead of requesting duplicate
generation:

- Reed Pelta uses the clean crescent shield from Dustwind DEX T1.
- Waisted Oxhide Shield uses the plain figure-eight shield from Dustwind STR T1.
- Open-Side Body Shield uses the tall notched shield from North DEX T3.
- Bronze Parma uses the restrained oval bronze-and-wood shield from North DEX T1.
- Bronze Pronged Sceptre uses the complete double-ended implement from Dustwind STR T2.
- Bronze Tripod Censer uses the complete lidded vessel from Dustwind Misc.
- Ram-Head Rhyton uses the substantial handled animal-terminal vessel from North DEX T2.

Direct duplicate proposals were removed or changed: the second crescent shield
became a hexagonal hide shield; the second censer became a copper dipper ladle;
the T5 censer became a distinct long-handled incense arm; and the second T5 forked rod became a
double-nozzle oil lamp. Generated outputs with hard-fail solar/starburst faces,
excessive ornament, or redundant figure-eight/crescent silhouettes remain
unassigned.

## Historical QA corrections

Every offhands row marked REVISE, HOLD, or REJECT in `qa-historical.md` was
resolved before generation:

- Shell Buckler was replaced by Hide Oval Buckler, directly tied to the
  Salisbury Hoard hide-shaped shield model. Bone Parrying Guard was replaced by
  Laminated Hide Buckler, whose three wood layers, leather face, and copper
  fasteners are directly preserved in the Qasr Ibrim shield fragment.
- The unsupported lapis, mixed shell-and-bone, and carapace shields were
  replaced by the Battersea Facing Shield, Vermand Officer Shield, and Redglass
  Boss Shield. Their direct museum records document, respectively, riveted
  multi-sheet bronze facing over wood; a functional late Roman iron hand boss
  with precious facing and its riveted grip; and opaque red glass mechanically
  framed within the Battersea shield's functional boss and structural roundels.
- Copper-Hide Buckler now specifies one peened central facing plate on a complete
  organic buckler. Moon-Shell Pelta specifies drilled edge holes and sparse
  lashing or peening into continuous backing. Jade-Boss Buckler makes bronze the
  functional boss and limits jade to one thumbnail-sized protected inset.
- Copper Ring Bell now follows its documented integral top ring rather than an
  invented bone handle. Bronze Seal Case was replaced by a Bronze Age tall-handled
  stamp seal. Amber-Terminal Bell moves one inset to a recessed non-impact handle
  terminal. Ivory Wax Boards now follow the 720-710 BC hinged Nimrud writing
  tablets without an invented grip.
- Night Balance was replaced by Black-Iron Incense Arm, using the complete
  47.3 cm Late Period Egyptian handled burner as its geometry and translating
  only the ladder material.

The footprint audit also changed all five formerly 1x1 bucklers to 2x2, assigned
the replacement laminated buckler 2x2, and normalized all ordinary 2x2 full
shields to 2x3. Tall tower, figure-eight, Dipylon, long oval, and scutum forms
remain 2x4.

Residual QA removed the Etruscan Votive Shield because its own record identifies
it as too thin for combat, and removed the Laminated Nile Shield because it
repeated lower-tier organic laminate logic. Vermand Officer Shield now supplies
a combat-functional late Roman officer role with silver and glass confined to
the protective iron boss. The final frozen audit then replaced the historically
sound but materially plain Iron-Band Warshield with Redglass Boss Shield: five
small opaque red-glass studs sit in deep bronze cells on the functional boss and
short spine, leaving the rawhide fighting face plain and avoiding both a material
skin and any radial or solar motif.

## Intake triage: sorted indices 43 through 86

Indices are zero-based after case-insensitive filename sorting of `C:\Users\Alex\Downloads\items_post_calib_batch`.

| Index | File | Decision | Reason |
|---:|---|---|---|
| 43 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (10).png | out of portfolio | Ornate open-toe boots. |
| 44 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (2).png | reject after historical QA | Strong tall-oval silhouette, but the gold-and-lapis surface reads as gem regalia and lacks a defensible functional shield treatment. It is not assigned to the corrected draft. |
| 45 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (3).png | out of portfolio | Circlet or narrow belt, not an offhand. |
| 46 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (4).png | out of portfolio | Large lapis pendant. |
| 47 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (5).png | out of portfolio | Body armor. |
| 48 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (6).png | out of portfolio | Mantle. |
| 49 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (7).png | out of portfolio | Belt. |
| 50 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (8).png | out of portfolio | Ring. |
| 51 | ChatGPT Image Jul 10, 2026, 11_23_37 PM (9).png | out of portfolio | Paired bracers. |
| 52 | ChatGPT Image Jul 10, 2026, 11_24_03 PM (1).png | out of portfolio | Long spear. |
| 53 | ChatGPT Image Jul 10, 2026, 11_24_03 PM (2).png | reuse | Strong tall rounded-rectangle shield with coherent hide, wood, central rib, bosses, and active-service finish. Assigned to T2 Oxhide Tower Shield. |
| 54 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (10).png | out of portfolio | Boots. |
| 55 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (3).png | out of portfolio | Helmet. |
| 56 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (4).png | reject for this portfolio | Jade pendant with long danglers; too jewelry-like and too small to become a rite offhand. |
| 57 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (5).png | out of portfolio | Body armor. |
| 58 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (6).png | out of portfolio | Fur mantle. |
| 59 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (7).png | out of portfolio | Belt. |
| 60 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (8).png | out of portfolio | Ring. |
| 61 | ChatGPT Image Jul 10, 2026, 11_24_04 PM (9).png | out of portfolio | Paired bracers. |
| 62 | ChatGPT Image Jul 10, 2026, 11_24_34 PM (1).png | out of portfolio | Curved sword. |
| 63 | ChatGPT Image Jul 10, 2026, 11_24_34 PM (2).png | out of portfolio | Curved sword. |
| 64 | ChatGPT Image Jul 10, 2026, 11_24_34 PM (3).png | out of portfolio | Belt. |
| 65 | ChatGPT Image Jul 10, 2026, 11_24_35 PM (10).png | out of portfolio | Boots. |
| 66 | ChatGPT Image Jul 10, 2026, 11_24_35 PM (4).png | out of portfolio | Pendant. |
| 67 | ChatGPT Image Jul 10, 2026, 11_24_35 PM (5).png | out of portfolio | Body armor. |
| 68 | ChatGPT Image Jul 10, 2026, 11_24_35 PM (6).png | out of portfolio | Cloak. |
| 69 | ChatGPT Image Jul 10, 2026, 11_24_35 PM (7).png | out of portfolio | Belt. |
| 70 | ChatGPT Image Jul 10, 2026, 11_24_35 PM (8).png | out of portfolio | Ring. |
| 71 | ChatGPT Image Jul 10, 2026, 11_24_35 PM (9).png | out of portfolio | Paired bracers. |
| 72 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (1).png | out of portfolio | Bundle of darts. |
| 73 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (10).png | out of portfolio | Wrapped boots. |
| 74 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (2).png | reject for this portfolio | Studded wooden club is readable as a weapon, not a defensive or rite offhand; converting it would create the banned rite-baton/toy-prop problem. |
| 75 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (3).png | out of portfolio | Soft hood. |
| 76 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (4).png | reject for this portfolio | Shield-like pendant, but neck cord, scale, and radial face make it jewelry rather than equipment. |
| 77 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (5).png | out of portfolio | Body armor. |
| 78 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (6).png | out of portfolio | Mantle. |
| 79 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (7).png | out of portfolio | Pouch belt. |
| 80 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (8).png | out of portfolio | Ring. |
| 81 | ChatGPT Image Jul 10, 2026, 11_25_02 PM (9).png | out of portfolio | Paired bracers. |
| 82 | ChatGPT Image Jul 10, 2026, 11_25_30 PM (1).png | out of portfolio | Long spear. |
| 83 | ChatGPT Image Jul 10, 2026, 11_25_30 PM (10).png | out of portfolio | Boots. |
| 84 | ChatGPT Image Jul 10, 2026, 11_25_30 PM (2).png | reuse | Clean, plain hide roundshield with convincing hide, edge binding, stitching, and small boss. Assigned to T1 Hide Roundshield. |
| 85 | ChatGPT Image Jul 10, 2026, 11_25_30 PM (3).png | out of portfolio | Hide helmet. |
| 86 | ChatGPT Image Jul 10, 2026, 11_25_30 PM (4).png | out of portfolio | Tooth or bone pendant. |

## Generation and reuse cautions

- Reuse rows are catalog decisions only. No intake file was moved, copied, matted, or promoted in this phase.
- Index 44 is explicitly unassigned after historical QA and must not become a visual baseline for the shield class.
- Shield art always shows the front fighting face only. No visible front straps, arms, hands, utility pouches, dangling hardware, emblems, solar devices, radial spokes, spiral motifs, or copied sacred imagery.
- Historical references teach silhouette and assembly. All generated surfaces should look recently made or actively maintained, with healthy material color, handling polish, shallow scratches, and only mild localized tarnish.
- T1 items use few parts and one dominant construction family. T2 adds credible copper-age reinforcement. T3 represents mature bronze and early professional panoply. T4 uses restrained exotic material in mechanically protected roles. T5 uses severe, plain meteoritic iron without glow.
