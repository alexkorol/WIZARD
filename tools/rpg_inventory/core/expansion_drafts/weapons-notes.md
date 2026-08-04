# Weapons expansion draft notes

Phase 1 only. No images were generated, staged, moved, keyed, or added to any shared manifest.

## Scope and roster shape

`weapons.tsv` contains exactly 50 gap/ladder candidates:

| Class | Rows | Typical footprint |
|---|---:|---|
| dagger | 7 | 1x2 |
| sword | 7 | 1x3 |
| axe_adze | 7 | 1x2 to 1x3 |
| club_mace | 7 | 1x2 to 2x3 |
| two_hand | 7 | 2x4 |
| spear_polearm | 8 | 1x4 to 2x4 |
| throwing | 7 | 1x2 to 2x2, with a 1x3 javelin |

The footprints follow the current runtime economy (`dagger` 1x2, one-hand axe 1x2, club 1x3, sword/khopesh 1x3, spear 1x4), while standardizing every heavy two-hand base at 2x4 and giving exceptionally wide polearms the same 2x4 footprint. Every row has a full portrait canvas.

The set is deliberately not another material-skin grid. Adjacent rungs change the weapon's structure or silhouette. Tier escalation comes from more controlled casting, hafting, balance, or rarer material, while the object remains buildable with prehistoric through AD 600 methods. T5 uses raw dark meteoric iron in project style, with geometry anchored to an ancient or Late Antique source.

## Calibrated 400-row manifest check

Before drafting, I read:

`C:\Users\Alex\Downloads\items_multi_context_balanced_v1\balanced_item_manifest.tsv`

Its weapon lanes repeat six main briefs: Achaemenid akinakes, Naue-II/flanged-hilt long sword, Luristan socketed axe-adze, generic compact perforated-stone/antler/cast mace, short leaf-socket thrusting spear, and empty hand sling. This expansion therefore avoids:

- akinakes daggers;
- Naue-II swords;
- Luristan inclined socketed axe-adzes;
- generic compact perforated stone or antler maces;
- short leaf-socket thrusting spears;
- hand slings.

The 50 rows are still candidates, not final production rows. Before any generation pass, compare each candidate against the roughly 165 actual outputs in that calibrated folder, since generated silhouettes can drift away from their manifest briefs.

## Historical-source method

Each row has one coherent construction anchor and an official museum or museum-publication URL. Sources are used for geometry, attachment, proportions, and material roles, not archaeological surface condition. New art should show actively maintained material: healthy wood, stone, copper, bronze, or iron color; handling polish and shallow scratches only; no burial crust, powdery corrosion, or heavy verdigris.

The source mix is object-first:

- British Museum object records for excavated flint daggers, copper and bronze blades, palstaves, adzes, halberds, spears, throw-sticks, javelins, and the Late Antique francisca;
- Metropolitan Museum object/essay pages for the Canaanite fenestrated axe and Classical Greek panoply constraints.

No source's readable sacred imagery, inscriptions, archaeological damage, or exact decoration should be copied.

## Independent historical-audit correction pass

The 12 weapon rows marked REVISE, HOLD, or REJECT in `qa-historical.md` were corrected before generation:

| Prior ID | Corrected ID | Resolution |
|---|---|---|
| `wpn_dag_peschiera_flame` | `wpn_dag_peschiera_flange` | Removed fantasy flame language and matched the direct Peschiera outline, flanges, shoulders, and stepped thickness. |
| `wpn_dag_meteor_ring` | `wpn_dag_meteor_pugio` | Replaced the sword-derived ring knife with a direct AD 1-100 Mainz pugio form; meteoric iron remains the bounded T5 material translation. |
| `wpn_swd_tooth_edge` | `wpn_swd_flint_longblade` | Replaced the unsupported composite tooth edge with a direct Late Neolithic bifacial flint long-blade form. |
| `wpn_club_bone_jaw` | `wpn_club_pear_mace` | Replaced the non-weapon jaw source with a direct Naqada III/First Dynasty breccia macehead and explicit drilled-bore mounting. |
| `wpn_club_bossed_wood` | `wpn_club_bronze_ribbed_mace` | Replaced the unsupported bossed wood concept, then retired the interim stone correction because it did not advance the T3 material ladder. The final row is a direct Bronze Age cast eight-rib copper-alloy macehead with an explicit shaft-hole and crown-wedge join. |
| `wpn_2h_copper_stabhalberd` | `wpn_2h_copper_sidepoint` | Rephrased as the attested three-rivet side-point staff and made every riveted interface explicit. |
| `wpn_2h_argar_halberd` | `wpn_2h_argar_sidepoint` | Rephrased as the El Argar three-rivet ridge-point staff and retained its direct Grave 533 geometry. |
| `wpn_2h_rhomphaia` | unchanged | Replaced the general essay with a direct museum publication and specified the long tang, grip scales, and pins. |
| `wpn_spear_bone_harpoon` | `wpn_spear_antler_harpoon` | Corrected material to antler and anchored the biserial barbs to a direct Magdalenian object. |
| `wpn_spear_barbed_hunter` | `wpn_spear_achaemenid_barbed` | Corrected copper to iron, moved it to T3, and matched the direct Achaemenid barbed head and tang. |
| `wpn_spear_bronze_trident` | `wpn_spear_lachish_trident` | Replaced the general bronze concept with the direct excavated Lachish iron trident. |
| `wpn_throw_bronze_discus` | `wpn_throw_late_roman_plumbata` | Replaced the unsupported sharpened discus with a direct AD 201-500 lead-weighted throwing dart. |

All corrected rows now use direct pre-AD or AD 600-and-earlier object/publication anchors. Terms likely to pull image models toward medieval silhouettes were removed from prompts, names, and anchor summaries.

## Intake triage method

The requested intake range is the first 43 files under:

`C:\Users\Alex\Downloads\items_post_calib_batch`

Indices below use case-sensitive lexical filename order (the same order produced by Python `sorted(path.iterdir(), key=lambda p: p.name)`). Contact sheets were inspected, and weapon-relevant borderline files were reopened at original resolution.

Verdicts:

- **usable**: a coherent single-item ARPG icon that can plausibly survive slot and construction review;
- **hold**: potentially valuable, but only for a special/unique lane or after a focused review;
- **reject**: violates current slot, construction, motif, chronology, or readability rules.

| Index | File | Verdict | Visual read and reason |
|---:|---|---|---|
| 0 | `930f69ac-5473-4b26-a09f-a116da65949d.png` | reject | Overbuilt fantasy mace with brittle tile-like shell, dense straps/studs, and implausible material interfaces. |
| 1 | `ChatGPT Image Jul 10, 2026, 10_52_35 PM (1).png` | reject | Spiked jeweled orb mace; dense fantasy ornament and late/medieval game-prop read. |
| 2 | `ChatGPT Image Jul 10, 2026, 10_52_35 PM (2).png` | hold | Complete tall shield silhouette, but the blue-gold facade is too ornate for an ordinary base; review only as an elite unique. |
| 3 | `ChatGPT Image Jul 10, 2026, 10_52_35 PM (3).png` | reject | Belt/neck-ring ambiguity, delicate chain body, dangling terminals, and central gemstone. |
| 4 | `ChatGPT Image Jul 10, 2026, 10_52_35 PM (4).png` | reject | Hard solar-wheel motif failure plus excessive pendant drops. |
| 5 | `ChatGPT Image Jul 10, 2026, 10_52_35 PM (5).png` | usable | Single sleeveless linen-and-leather torso defense with coherent front/back volume; ornate trim should limit it to a higher tier. |
| 6 | `ChatGPT Image Jul 10, 2026, 10_52_35 PM (6).png` | usable | Continuous asymmetric cloth mantle, full fall visible, no shingled construction. |
| 7 | `ChatGPT Image Jul 10, 2026, 10_52_36 PM (10).png` | reject | Pair is complete, but developed buckled boots and built sole read medieval/modern. |
| 8 | `ChatGPT Image Jul 10, 2026, 10_52_36 PM (7).png` | reject | Modern buckle, segmented leatherwork, and loose hanging straps. |
| 9 | `ChatGPT Image Jul 10, 2026, 10_52_36 PM (8).png` | reject | Ring face is a hard solar/starburst motif failure. |
| 10 | `ChatGPT Image Jul 10, 2026, 10_52_36 PM (9).png` | usable | Complete paired metal-led forearm defenses; dense decoration makes them T4/unique rather than a common base. |
| 11 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (1).png` | reject | Not a valid sling: no central cradle, and weighted ends read as two flails or bolas. |
| 12 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (2).png` | reject | Dreamcatcher-like web, many danglies, turquoise focus, and unclear slot. |
| 13 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (3).png` | hold | Clean single neck/waist band silhouette, but the tiny center fitting gives weak ARPG readability and uncertain slot identity. |
| 14 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (4).png` | usable | Full wearable cord with one compact tooth-and-stone pendant; clear amulet slot and no solar motif. |
| 15 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (5).png` | usable | Coherent primitive hide torso assembly with readable shoulders and no anatomy. |
| 16 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (6).png` | reject | Shingled/fringed outer layer, directly violating the continuous-cloth correction. |
| 17 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (7).png` | hold | Broad wrapped-hide belt body is useful, but long loose tails exceed the clean 2:1 belt silhouette. |
| 18 | `ChatGPT Image Jul 10, 2026, 10_53_50 PM (8).png` | usable | Compact shell-set ring, readable at icon scale; reserve for a bounded exotic rung. |
| 19 | `ChatGPT Image Jul 10, 2026, 10_53_51 PM (10).png` | usable | Complete pair of simple wrapped-hide ankle shoes with flat thin soles and non-modern construction. |
| 20 | `ChatGPT Image Jul 10, 2026, 10_53_51 PM (9).png` | usable | Paired materially continuous leather forearm wraps; clean primitive hand/arm base. |
| 21 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (1).png` | usable | Strong isolated long wooden warclub with broad bossed striking body, retained as an intake reference candidate but not assigned to a row after the historical correction pass. |
| 22 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (2).png` | usable | Full segmented helmet dome with corresponding cheek guards and active-service finish. |
| 23 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (3).png` | reject | Another shingled outer layer with repeated dangling panels. |
| 24 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (4).png` | usable | Complete paired leather bracers with bounded bronze bosses; clear forearm-defense family. |
| 25 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (5).png` | reject | Modern buckle and carabiner-like hanging hardware. |
| 26 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (6).png` | usable | Compact plain-faced bronze signet with restrained line geometry. |
| 27 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (7).png` | reject | Wicker shield is an explicitly retired weak/toy-like read. |
| 28 | `ChatGPT Image Jul 10, 2026, 11_03_56 PM (8).png` | reject | Developed stitched/buckled sandal-boots with thick standardized soles. |
| 29 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (1).png` | reject | Medieval-fantasy crossguard dagger with machine-like ornamental fittings. |
| 30 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (10).png` | reject | Plate greave-boots drift into medieval sabaton and modern shoe construction. |
| 31 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (2).png` | reject | Scabbard/case with dangling coin-charms and no suitable weapon, quiver, or Quick-Rig harness identity. |
| 32 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (3).png` | reject | Braided belt with developed buckle, tassels, and dangling terminals. |
| 33 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (4).png` | reject | Amber-centered solar/starburst amulet with excessive crystal drops. |
| 34 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (5).png` | reject | Fantasy brassiere/corset anatomy shaping, chains, and late high-fantasy construction. |
| 35 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (6).png` | usable | One continuous dark pelt mantle with full vertical fall and no shingled tabs. |
| 36 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (7).png` | reject | Gem-centered solar belt, dangling plates, and invasive ornament. |
| 37 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (8).png` | usable | Compact geometric bronze ring with plain majority surface and no celestial motif. |
| 38 | `ChatGPT Image Jul 10, 2026, 11_04_16 PM (9).png` | usable | Complete paired leather bracers with one bounded metal plate per arm and credible overlap. |
| 39 | `ChatGPT Image Jul 10, 2026, 11_23_37 PM (1).png` | hold | Excellent full-length spear framing, but all-over engraved blade, metal collars, and tassel make it unique-only, not a clean base. |
| 40 | `ChatGPT Image Jul 10, 2026, 11_23_37 PM (10).png` | reject | Developed decorated boots with thick soles and modernized construction. |
| 41 | `ChatGPT Image Jul 10, 2026, 11_23_37 PM (2).png` | reject | Oval shield dominated by radial/concentric solar-target geometry. |
| 42 | `ChatGPT Image Jul 10, 2026, 11_23_37 PM (3).png` | reject | Gem diadem/circlet with machine-like filigree and jewelry-first rather than protective read. |

Triage totals: 15 usable, 4 hold, 24 reject. Of the weapon-relevant files, index 21 remains a usable reference candidate but is not directly assigned after the historical correction pass, index 39 is unique-only hold, and indices 0, 1, and 29 are rejects.

## Generation handoff constraints

When generation is authorized:

1. Run the calibrated-output dedupe first and retire any row whose actual silhouette is already represented.
2. Generate one independent portrait icon per remaining row; never a contact sheet.
3. Long weapons must show the complete object tip-to-butt on a steep controlled diagonal; shafts remain dominant for polearms.
4. Keep most surfaces plain and motif-free. No solar disks, starbursts, radial wheels, spirals, readable sacred marks, gemstone centers, or all-over engraving.
5. Keep all construction pre-AD/AD-600 plausible: cast, hammered, ground, flaked, drilled, riveted, socketed, wrapped, bound, or carved. No modern fasteners, machine stitching, standardized molded parts, medieval crossguards, halberd heads, flanged medieval maces, or plate-harness styling.
6. Use the repo's olive-slate matte and local chroma-key workflow if built-in output lacks true alpha.
7. Pixel variants remain a later image-to-image pass after Alex approves and sorts the full-resolution icons.
