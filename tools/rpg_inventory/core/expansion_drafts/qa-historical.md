# Expansion drafts: Measure-2 historical and manufacturing audit

Status: independent pre-generation audit. This report does not authorize image
generation and does not modify any draft TSV.

Verdicts:

- **PASS**: prompt may advance through the remaining dedupe/roster gates.
- **REVISE**: viable base, but the row needs a bounded correction before use.
- **HOLD**: plausible idea, but its evidence, ladder placement, or model risk
  requires a deliberate decision or better anchor.
- **REJECT**: repeats a recorded hard failure, has no credible pre-AD/AD-600
  construction path, or is not suitable as an ordinary base.

This gate applies the authoritative T1-T5 material ladder, AD 600 ceiling,
active-service finish, material-role and join logic, structural-counterpart
rules, modern-manufacturing bans, motif allocation policy, and special
corrections for handwear, footwear, quivers, slings, outerwear, and auxiliary
gear. A historically valid object is not automatically a valid rung: a bronze
or Late Antique iron form assigned to T1 remains `tier_material_overbuild`.

## Final frozen-byte verdict (authoritative)

The six frozen 50-row TSVs were re-read after all owner correction waves.
This section supersedes every older finding below it.

Final tally: **298 PASS, 1 REVISE, 1 HOLD, 0 REJECT**.

Every current row in the six hashes below is **PASS** except the two rows named
in the exception table. “PASS” means the current prompt clears this historical
and manufacturing gate; it does not bypass roster dedupe, salvage review,
visual QA, or user approval.

| Portfolio | Rows | Frozen SHA-256 |
|---|---:|---|
| `weapons.tsv` | 50 | `0FF80E57FFF57A4839E32637DA9BDBE73BAF3B55C2C7946C4654FF5E66DE9676` |
| `offhands.tsv` | 50 | `96AC1A01708075857515EB2CF1C9EFB1C47F9EE76B14A580F7763F83F017C511` |
| `armor_helms.tsv` | 50 | `5412662B59D470E8C85E916E7B33878ED6DF95DD19990AA07C047EC204D1CB78` |
| `wearables.tsv` | 50 | `CBEBDFD7546C1051C0B93182F950943B57CA14878AD16A313E0BB71B14351285` |
| `auxiliary.tsv` | 50 | `3A696BB64B0A71C8718D4B10A8E15144251D43B3C9E8F3F2E2D268BAE24A6DB2` |
| `jewelry_relics.tsv` | 50 | `FE13570DB6329E95D05FE2B5C690C5C42DD340B614A3F4210A8A050330707420` |

| art_id | Verdict | Final reason |
|---|---|---|
| `shield_iron_band` | REVISE | The cited La Tène fighting-shield construction is excellent, but plain wood/rawhide with one iron band does not express the project's T4 ritual/exotic rung and sits beside two genuinely prestige T4 shields. Re-tier it to T3 or give the T4 slot a directly supported prestige/exotic fighting-shield form. |
| `reliquary_bronze_cist` | HOLD | The object is plausible, but the row still relies on a generic museum search page and invents corner straps, lift-off lid, and flush side loops without a direct cist/casket object-family anchor. Attach one dated primary object or reconstruction before generation. |

### Production-ready jewelry/relic re-audit

Separate audit target:
`expansion_ready/jewelry_relics.tsv` at SHA-256
`D255DE02A5B7C6A881E1D2B1CDBA2F38AF91204639500393F74028CA436B294D`.

Final result after correction and direct-source verification: **50 PASS**.

The five former non-PASS concepts are now a directly anchored bronze-case
amulet, a documented Roman/pre-Roman bronze cowrie amulet, an asymmetric
single-axe token rather than a restricted double axe, a tripod with visible
collar sockets and peened tenons, and a macro-distinct two-handled spouted
bowl. The Met object records directly confirm the Early Bronze Age axe pendant,
Late Bronze Age multipart rod tripod, and Late Cypriot two-handled spouted-bowl
forms; the British Museum record directly confirms the bronze cowrie pendant
and its suspension loop. All ten five-rung sequences remain distinct at 48 px,
and no modern/medieval manufacturing details remain.

The detailed tables below preserve Measure 1, Measure 2, and correction history
so rejected patterns are not rediscovered. They are intentionally not the
current verdict ledger.

## `weapons.tsv`

| art_id | Verdict | Reason |
|---|---|---|
| `wpn_dag_flint_lancet` | PASS | Strong Neolithic form, one material, useful complete-object anchor. |
| `wpn_dag_fen_flake` | PASS | Credible asymmetrical flint knife; rawhide remains a functional grip. |
| `wpn_dag_copper_lingulate` | PASS | Simple copper tang and organic scales fit T2 construction. |
| `wpn_dag_cypriot_rivet` | PASS | Two shoulder rivets and short organic hilt are mechanically legible. |
| `wpn_dag_peschiera_flame` | REVISE | Replace “flame-shaped” with the anchor's actual Peschiera outline; current phrase invites fantasy undulation. |
| `wpn_dag_egypt_broad` | PASS | Dated bronze-and-bone assembly; bounded openwork is supported by the cited object. |
| `wpn_dag_meteor_ring` | HOLD | Ring-pommel form is plausible, but the source is a sword rather than a knife; find a knife anchor or mark as explicit extrapolation. |
| `wpn_swd_tooth_edge` | HOLD | Lore-archaic edge-set club is possible, but the cited handaxe does not support the composite sword; needs a specific edge-set club reference and explicit tooth/flake socketing. |
| `wpn_swd_copper_fork` | PASS | Strong Copper Hoard silhouette and one-piece cast logic. |
| `wpn_swd_bronze_rapier` | PASS | Dated Bronze Age thrusting form with restrained hilt. |
| `wpn_swd_leaf_flange` | PASS | Flanged grip and leaf blade are well supported and model-legible. |
| `wpn_swd_iron_xiphos` | PASS | Classical compact leaf sword, mechanically simple and within ceiling. |
| `wpn_swd_sica_recurve` | PASS | Iron Age recurved blade is distinct and pre-medieval. |
| `wpn_swd_meteor_ring` | PASS | Third-century ring-pommel geometry is a sound T5 silhouette anchor. |
| `wpn_axe_ground_celt` | PASS | Stone celt, antler sleeve, and bent haft have credible load paths. |
| `wpn_axe_stone_shafthole` | PASS | Drilled stone head and straight haft are clear A0-A1 construction. |
| `wpn_axe_copper_flat` | PASS | Split knee-haft is a credible early flat-axe solution. |
| `wpn_axe_aby_dos_adze` | PASS | Dated copper adze with unmistakable transverse mounting. |
| `wpn_axe_bronze_palstave` | PASS | Deep flanges and stop ridge accurately express the haft interface. |
| `wpn_axe_canaan_window` | PASS | Strong dated fenestrated silhouette; open window is structural, not ornament. |
| `wpn_axe_meteor_sagaris` | PASS | Ancient axe-pick geometry is explicit and avoids medieval hammer massing. |
| `wpn_club_rootknob` | PASS | One-piece natural burl club is ideal T1 simplicity. |
| `wpn_club_paddle` | PASS | One-piece hardwood construction and broad mass read cleanly. |
| `wpn_club_bone_jaw` | HOLD | Lore-archaic jaw club is possible but the cited object is not a weapon anchor; specify species/scale and confirm the teeth remain mechanically seated. |
| `wpn_club_beaked_wood` | PASS | One-piece beaked hardwood club avoids composite overbuilding. |
| `wpn_club_disc_mace` | PASS | Drilled disc and straight haft are ancient, simple, and legible. |
| `wpn_club_bossed_wood` | REVISE | The intake may be usable, but “scattered bosses” lacks join logic; require a few irregular peened studs through the wood and hide washers, or keep the club all wood. |
| `wpn_club_meteor_hammerpick` | PASS | Compact ancient hammer-pick geometry and thick haft remain pre-medieval. |
| `wpn_2h_paddle_greatclub` | PASS | Credible scale-up of a one-piece club with a true two-hand grip. |
| `wpn_2h_stone_maul` | PASS | Drilled boat-shaped stone head has explicit through-haft construction. |
| `wpn_2h_copper_stabhalberd` | REVISE | Historical halberd is valid, but “halberd” is a strong medieval model attractor; describe it as a Bronze Age side-point staff and keep the dated three-rivet plate geometry. |
| `wpn_2h_argar_halberd` | REVISE | Same model-risk issue: retain El Argar geometry but suppress generic medieval halberd completion. |
| `wpn_2h_ge_longaxe` | PASS | Dated ge construction, right-angle blade, socket, and butt cap are coherent. |
| `wpn_2h_rhomphaia` | HOLD | Form is in period, but the general Greek warfare essay is not a direct rhomphaia anchor; attach a dated typology/object source. |
| `wpn_2h_meteor_glaive` | PASS | The five-to-one shaft ratio and ge-based anchor strongly constrain medieval drift. |
| `wpn_spear_firewood` | PASS | Single fire-hardened shaft is an excellent T1 primitive base. |
| `wpn_spear_bone_harpoon` | HOLD | Construction is plausible, but the cited bone object does not establish a harpoon spear; use a complete barbed bone point reference. |
| `wpn_spear_copper_tanged` | PASS | Split-shaft binding gives the dissimilar-material interface explicitly. |
| `wpn_spear_barbed_hunter` | HOLD | The source is an iron Achaemenid point while the row invents a copper two-barb spear; either change material/date or supply a copper hunting-spear anchor. |
| `wpn_spear_broad_midrib` | PASS | Broad blade, midrib, socket, and peg form a credible Bronze Age head. |
| `wpn_spear_bronze_trident` | HOLD | Functional ancient form is plausible, but the general essay is weak evidence; attach a dated trident/fishing-spear object. |
| `wpn_spear_ge_hook` | PASS | The spear-plus-ge head is directly grounded and mechanically compact. |
| `wpn_spear_meteor_angon` | PASS | Fifth-sixth-century angon geometry is within the ceiling and shaft-dominant. |
| `wpn_throw_badarian_stick` | PASS | Direct dated object, one-piece wood, and strong primitive silhouette. |
| `wpn_throw_weighted_club` | PASS | One-piece aerodynamic club is materially and mechanically simple. |
| `wpn_throw_bronze_javelin` | PASS | Small socketed head and light shaft are credible. |
| `wpn_throw_dart_bundle` | PASS | A secured three-dart inventory bundle is plausible and avoids loose clutter. |
| `wpn_throw_iron_barbdart` | PASS | Dated barbed head and restrained single-dart form are sound. |
| `wpn_throw_bronze_discus` | REJECT | A sharpened “war discus” is not supported by the athletic-disc anchor and reads as fantasy weaponization; use a documented throwing ring/discus weapon or remove the sharpened edge. |
| `wpn_throw_meteor_francisca` | PASS | Late fifth-sixth-century form is precisely within the project ceiling. |

## `offhands.tsv`

| art_id | Verdict | Reason |
|---|---|---|
| `shield_hide_round` | PASS | Plain hide face, bent frame, and bound rim are coherent. |
| `shield_bark_oval` | PASS | Direct Enderby construction gives exceptional material and stiffener logic. |
| `shield_reed_pelta` | PASS | Cane is fully hidden beneath a continuous fighting face, avoiding basket/toy read. |
| `shield_wood_round` | PASS | Joined boards, rawhide edge, and center-grip family are plausible. |
| `shield_hide_figure_eight` | PASS | Strong Bronze Age silhouette and simple oxhide/frame construction. |
| `buckler_shell` | REJECT | Repeats the known turtleshell-shield failure, lacks a direct ancient shield anchor, and risks toy/natural-object rather than equipment read. |
| `shield_oxhide_tower` | PASS | Existing intake has coherent hide, wood, spine, and rim construction. |
| `buckler_copper_hide` | REVISE | Clarify that the copper is one peened central facing plate on a complete organic buckler; “face plate” can become a floating decorative plaque. |
| `shield_cane_oval` | PASS | Continuous skin, rib, and rim prevent a basket-like result. |
| `shield_hide_dipylon` | PASS | Dated open-side silhouette and continuous frame are credible. |
| `shield_wood_hexagonal` | PASS | The cited binding supports the uncommon polygonal organic shield. |
| `guard_bone_parrying` | HOLD | Plausible lore-archaic guard, but the cited antler object does not support this wood-and-bone defensive assembly; add a direct parrying-stick anchor and lashing path. |
| `shield_bronze_yetholm` | PASS | Direct sheet-bronze object with structural ribs and boss. |
| `shield_bronze_parma` | PASS | Organic oval body with bounded metal facing is mechanically conservative. |
| `shield_celtic_spine` | PASS | Direct Chertsey anchor supports spine, boss, and terminal geometry. |
| `shield_scutum_rect` | PASS | Roman laminated body and surviving fittings are firmly within scope. |
| `shield_scutum_oval` | PASS | Late Roman oval center-grip construction is directly supported. |
| `buckler_bronze` | PASS | Small beaten face, boss, and rolled rim are coherent. |
| `shield_lapis_spine` | HOLD | Historically possible prestige inlay, but the intake is already judged close to gem-regalia; require a visual keep/reject decision rather than generating around it. |
| `shield_shell_pelta` | REVISE | Broad shell plates on backing are possible, but specify drilled edge holes and sparse lashing/peening; “mother-of-pearl facing” otherwise risks decorative tile armor. |
| `buckler_jade_boss` | HOLD | A large jade hand boss is mechanically vulnerable and unsupported by the boss sources; use a small protected inset in a functional bronze boss or drop. |
| `shield_coral_spine` | PASS | The Witham shield itself supports bounded coral terminal settings. |
| `shield_shell_bone` | HOLD | Interlocking shell-and-bone facing is a high-risk construction hybrid without a direct anchor; define a sparse single material plate family or move to unique gear. |
| `shield_carapace` | HOLD | Natural-shell defense is possible, but “massive carapace” is speciesless fantasy extrapolation; require a source-supported animal and credible size/backing. |
| `shield_skymetal_tower` | PASS | T5 fiction preserves a plausible organic body and three broad backed plates. |
| `shield_skymetal_oval` | PASS | Ancient long-oval load path remains clear under the material translation. |
| `buckler_skymetal` | PASS | Simple deep-domed metal hand shield is structurally coherent. |
| `guard_skymetal_spine` | PASS | One-piece bar and protected grip avoid a medieval blade/gauntlet hybrid. |
| `shield_skymetal_round` | PASS | Yetholm rib logic translates cleanly to the T5 material. |
| `shield_skymetal_scutum` | PASS | Roman wood body remains dominant; rare metal is confined to fittings. |
| `focus_antler_prong` | PASS | One-piece antler body and central grip are strong low-tier rite construction. |
| `focus_stone_bowl` | PASS | Substantial one-piece vessel, plain and directly object-like. |
| `focus_wood_clappers` | PASS | Rigid joined sounding implement avoids dangling-instrument failure. |
| `focus_shell_rattle` | PASS | A stout frame and crossbar give shell plates a credible sounding role. |
| `focus_copper_bell` | REVISE | The anchor has ring suspension, not the prompted bone handle; specify a socketed/peened handle interface or use the documented ring form. |
| `focus_copper_sistrum` | PASS | Dated rigid bar-frame logic and explicit sacred-image suppression. |
| `focus_copper_ewer` | PASS | Hammered vessel, handle, and spout are ordinary ancient metalwork. |
| `focus_copper_ladle` | PASS | Direct Nimrud object and clear strap-handle construction. |
| `focus_bronze_prongs` | PASS | Existing output and thick symmetrical casting make a substantial offhand. |
| `focus_bronze_phiale` | PASS | Direct dated vessel; omphalos is structural and the one band is bounded. |
| `focus_bronze_censer` | PASS | Direct Late Antique family, fitted lid, and functional soot placement. |
| `focus_bronze_sealcase` | HOLD | The seal is dated, but the axle-bearing “case” assembly is not; attach a direct seal-holder example or simplify to a substantial handled seal. |
| `focus_jade_mace` | PASS | Jade is correctly limited to a blunt perforated/socketed head. |
| `focus_ram_rhyton` | PASS | One bounded animal terminal is historically grounded and not repeated ornament. |
| `focus_amber_bell` | HOLD | Amber pieces around a struck bell are vulnerable prestige decoration with no source support; relocate one protected inset to a non-impact handle terminal or drop it. |
| `focus_ivory_diptych` | REVISE | Replace “ivory-like” with a real allowed material and remove the invented “broad hand grip”; use documented hinge/leaf construction from a direct object record. |
| `focus_skymetal_rod` | PASS | Severe cast/forged rod preserves ancient pronged-sceptre geometry. |
| `focus_skymetal_bell` | PASS | Straight material translation of a documented ancient bell. |
| `focus_skymetal_balance` | HOLD | Historically valid balance, but short three-point suspensions are model-fragile and it risks ordinary merchant prop rather than authoritative rite equipment; require a visual-thesis decision. |
| `focus_skymetal_lamp` | PASS | Roman double-nozzle reservoir and handle provide sound construction. |

## `armor_helms.tsv`

The historically named metal helmets are often good forms, but their assigned
tier must still follow the project economy. Rows marked `REVISE` for tier may
retain the silhouette after the ladder is rebuilt.

| art_id | Verdict | Reason |
|---|---|---|
| `body_fiber_bast_guard` | PASS | Broad bast ribs over a woven body are coherent T1 organic defense. |
| `body_fiber_corded_vest` | HOLD | Plausible, but the cited scale armor does not support crossed cord armor; needs a textile/corded-defense reconstruction anchor. |
| `body_fiber_quilted_corlet` | PASS | Large irregular quilt fields avoid gambeson and factory-panel drift. |
| `body_fiber_linen_panoply` | REVISE | The wide lower strips are effectively pteruges despite the negation; call them a few broad integral linen flaps and avoid contradictory “no pteruges” wording. |
| `body_fiber_warded_robe` | HOLD | An armored ankle-long textile robe is not established by a generic collection term; supply a specific Late Antique garment/armor reconstruction. |
| `body_hide_hide_wrap` | PASS | One-hide body and separate supporting yoke fit primitive simplicity. |
| `body_hide_rawhide_corselet` | PASS | Broad overlapping panels and full front/back volume are credible. |
| `body_hide_boiled_cuirass` | PASS | Hardened hide shell with corresponding back and edge binding is plausible. |
| `body_hide_scale_vest` | PASS | Intake has a continuous backing and credible sparse scale overlap. |
| `body_hide_crocodile_coat` | REVISE | The BM armor supports crocodile hide, but not invented rectangular coat panels; follow the surviving hide's actual cut and seams. |
| `body_pectoral_hide_harness` | HOLD | The full harness/pectoral assembly is speculative and risks costume straps; needs a direct pectoral-defense source. |
| `body_pectoral_copper_disc` | PASS | Front/back disc logic and broad organic support are credible early metal defense. |
| `body_pectoral_triple_disc` | PASS | Historically attested Italic family with explicit anti-solar restraint. |
| `body_pectoral_bronze_harness` | HOLD | Crescent shoulder plates and articulated back are not established by the cited object and risk fantasy pauldrons. |
| `body_pectoral_iron_panoply` | REJECT | Unsupported kite-like disc-and-wing panoply reads as invented fantasy armor; generic collection term is not evidence. |
| `body_longcoat_hide_apron` | REJECT | Invented torso-plus-loin-panel armor has no direct anchor and risks exactly the belt/skirt/costume-slot contamination the project excludes. |
| `body_longcoat_sidecoat` | HOLD | Conservative construction is possible, but a generic collection term does not support an armored side-opening coat. |
| `body_longcoat_strip_panoply` | REVISE | Remove factory-like “exactly twelve” strips and use a hand-varied small set of broad integral flaps. |
| `body_longcoat_splint_warcoat` | HOLD | Long iron-splint felt coat is weakly anchored and has brigandine drift risk; needs a dated reconstruction showing its load paths. |
| `body_longcoat_cataphract` | REVISE | Scale coat is plausible, but use the cited scale attachment and replace “shoulder caps” with continuous backed shoulder courses to avoid medieval pauldrons. |
| `body_plate_copper_shell` | REJECT | A complete two-plate copper torso shell at T1 is unsupported and grossly overbuilt for the tier. |
| `body_plate_bell_cuirass` | REVISE | Valid Bronze Age form, but bronze bell cuirass cannot be T2 in the authoritative material ladder; move to T3 or later. |
| `body_plate_sheet_corslet` | PASS | Direct sheet-bronze front/back plate logic and T3 placement are sound. |
| `body_plate_muscle_cuirass` | PASS | Dated Classical prestige form with restrained ordinary-base surfaces. |
| `body_plate_banded_panoply` | REVISE | Roman articulated armor is valid, but ordinary iron is A4/T3-T4 rather than skymetal T5; re-tier or explicitly translate the bands to T5 material. |
| `helmet_soft_quilted_cap` | PASS | Continuous padded textile family with no pasted plates. |
| `helmet_soft_wrapped_cap` | PASS | Low-tech wrapped cap and hidden padding are mechanically credible. |
| `helmet_soft_rawhide_skullcap` | PASS | Materially continuous rawhide shell and paired tabs are coherent. |
| `helmet_soft_disc_brow` | HOLD | Intake may be usable, but three copper brow discs on a fur-lined hide cap risk pasted-plate hybrid and radial repetition; visually confirm the discs are functional reinforcement. |
| `helmet_soft_river_hide_hood` | REVISE | Crocodile helmet is historical, but T5 requires an endgame-material decision; rare hide alone does not match the authoritative T5 rung. |
| `helmet_composite_cane_dome` | PASS | Fully woven construction with no metal ornament follows the material-family rule. |
| `helmet_composite_bone_cap` | HOLD | Bone plates on backing are possible lore craft, but the scale-armor source is not helmet evidence; add a reconstruction or explicit lacing layout. |
| `helmet_composite_bark_panel` | HOLD | Steam-shaped bark helmet is plausible but unsupported by the cited armor; needs a complete bark/wood head-defense anchor. |
| `helmet_composite_shell_lamellar` | HOLD | Shell lamellae need explicit drilled lacing and evidence that the material can survive crown/neck articulation; current row is model-risk extrapolation. |
| `helmet_composite_bronze_ridge` | REJECT | Hide half-shells cosmetically framed by a deep bronze brow/ridge are an incoherent hybrid of organic and metal ridge-helmet families. |
| `helmet_open_negau` | REVISE | Negau form is valid, but a finished bronze helmet is `tier_material_overbuild` at T1. |
| `helmet_open_attic` | REVISE | Attic bronze form is valid; T2 placement conflicts with the first-metal copper rung. |
| `helmet_open_chalcidian` | PASS | Mature bronze military helmet fits T3 and is well defined. |
| `helmet_open_boeotian` | REVISE | Valid form, but plain bronze alone does not establish T4 exotic progression; re-tier or add a bounded supported prestige distinction. |
| `helmet_open_phrygian` | REVISE | Valid A3 silhouette, but ordinary bronze cannot occupy the project's T5 skymetal rung. |
| `helmet_closed_bronze_bowl` | REVISE | Simple form is valid, but a bronze bowl helmet at T1 overbuilds the tier. |
| `helmet_closed_pilos` | REVISE | Valid A3 bronze form, but not T2 copper-age progression. |
| `helmet_closed_montefortino` | PASS | Dated mature bronze military helmet fits T3. |
| `helmet_closed_coolus` | REVISE | Valid A4 form, but T4 needs a deliberate prestige/exotic distinction rather than another bronze bowl. |
| `helmet_closed_imperial` | REVISE | Valid Roman iron form, but ordinary iron is not the raw meteoric T5 material. |
| `helmet_segmented_browband` | REJECT | Late Antique iron crown plates at T1 are severe tier overbuild; this cannot serve as the low rung of the ladder. |
| `helmet_segmented_steppe_cone` | REJECT | Six iron panels and bands at T2 overbuild the tier and invite later nasal-helm completion. |
| `helmet_segmented_ridge` | PASS | Late Roman iron ridge form is within ceiling and credible at T3. |
| `helmet_segmented_crossband` | PASS | Direct fifth-century Sasanian anchor and complete structural counterparts. |
| `helmet_segmented_spangenhelm` | REVISE | Direct AD 500-600 form is valid, but ordinary iron at T5 conflicts with the skymetal rung; translate material or re-tier. |

## `wearables.tsv`

| art_id | Verdict | Reason |
|---|---|---|
| `hands_bark_archer_guard` | HOLD | Bark translation is plausible but not directly evidenced; specify a stiff layered plate and avoid presenting the stone wrist-guard as proof of bark survival. |
| `hands_sinew_wraps` | REVISE | “Hand shapes” made from strips repeat the ambiguous hand-wrap failure; turn them into materially continuous enclosed hide mitts with a thumb volume, or true forearm wraps. |
| `hands_fur_combat_mitts` | PASS | Continuous hide mitten body, thumb, doubled palm, and soft reinforcement follow the handwear correction. |
| `hands_rawhide_wrist_cuffs` | PASS | Short materially continuous cuffs are a valid non-bracer family. |
| `hands_copper_armlets` | REJECT | Enlarging jewelry into invented upper-arm armor has no direct defensive anchor and does not fill the hands slot. |
| `hands_boiled_hide_gloves` | REJECT | Modern fitted closed-finger glove panels are explicitly high risk and the scale-armor source does not evidence ancient gloves. |
| `hands_copper_backhand_gloves` | REJECT | Exact hard failure: isolated copper plates pasted onto soft hide gloves. |
| `hands_hide_splint_bracers` | PASS | Hard-organic splints on soft backing form a coherent true bracer. |
| `hands_bronze_scale_cuffs` | HOLD | Scale cuff may be coherent armor, but it needs a continuous rigid/armored cuff family rather than decorative scales on a soft wrist band. |
| `hands_bronze_vambraces` | PASS | Hammered sheet forearm shells with lining/straps are a coherent metal family. |
| `hands_weighted_cesti` | PASS | Historically grounded complete hand cage with one bounded blunt ridge. |
| `hands_soldier_half_gauntlets` | HOLD | Articulated bronze backhand/knuckle plates have strong medieval drift and the cited greave is not hand-armor evidence; require a direct pre-AD/AD-600 hand-defense anchor. |
| `hands_lacquer_scale_gloves` | REJECT | Exact hard failure: small hard scales pasted over soft closed-finger gloves. |
| `hands_jade_wrist_cuffs` | REJECT | Carefully cut brittle stone plaques bound across a flexible cuff are explicitly forbidden. |
| `hands_obsidian_archer_guard` | REJECT | Obsidian is too brittle/sharp for a lashed wrist plate and repeats the brittle-mineral joint failure. |
| `hands_skymetal_half_gauntlets` | HOLD | Separate knuckle lames over leather risk medieval gauntlet completion; require a direct Late Antique hand-defense construction or simplify to a contiguous backhand cage. |
| `hands_meteoric_vambraces` | PASS | Straight T5 material translation of coherent sheet-metal forearm shells. |
| `feet_grass_net_shoes` | PASS | Direct Ötzi construction and complete empty pair. |
| `feet_bark_sandals` | PASS | Thin fiber sole and simple thong are strongly pre-modern. |
| `feet_rawhide_gathered_shoes` | PASS | One-piece gathered carbatina construction avoids modern lasts and welts. |
| `feet_fur_ankle_wraps` | PASS | Soft foot bags and broad wraps are plausible and materially continuous. |
| `feet_copper_lace_sandals` | REVISE | Do not prompt the tiny closure that the model routinely mangles; remove the copper hook and let the structural rawhide lacing carry the T2 read. |
| `feet_copper_age_carbatinae` | PASS | Complete one-piece shoes with flat soft soles and raw holes. |
| `feet_linen_sole_wraps` | PASS | Folded cloth over separate thin rawhide soles is conservative and non-modern. |
| `feet_laced_hide_boots` | PASS | Soft hand-laced ankle boots, flat sole, and no welt are within scope. |
| `feet_marching_caligae` | PASS | Roman military sandal and hobnail technology are firmly pre-AD/AD-600. |
| `feet_bronze_shod_sandals` | HOLD | Bronze plates beneath a layered sole lack evidence and may read as modern sole hardware; provide a direct shod-footwear anchor or remove. |
| `feet_hide_splint_greaves` | REVISE | Legs/footwear deliverables must include a complete footwear read; attach the greaves to plausible simple shoes/sandals. |
| `feet_bronze_shin_greaves` | REVISE | Same slot-continuity issue: integrate visible ancient sole/footwear structure rather than isolated shin shells. |
| `feet_scythian_riding_boots` | HOLD | Form is plausible, but the cited armor does not verify the boot construction; add a dated preserved/reconstructed steppe footwear source. |
| `feet_shell_edge_buskins` | REJECT | Shell tabs on a flexible boot edge are exposed prestige decoration with no mechanical role and high costume risk. |
| `feet_blackglass_ankle_guards` | REJECT | Explicit hard failure: obsidian plaques attached across flexible padded cuffs. |
| `feet_skymetal_greaves` | REVISE | Coherent metal shells, but integrate complete footwear as required for this slot. |
| `feet_meteoric_armored_shoes` | REJECT | Toe caps plus instep plates invite medieval sabaton/modern safety-shoe construction and lack a pre-AD anchor. |
| `belt_sinew_waist_cord` | PASS | One shallow tied cord with tucked end is ideal T1 construction. |
| `belt_bast_rope_girdle` | REVISE | Remove the explicitly prompted toggle/loop; closures are a known model failure and are not needed for the visual thesis. |
| `belt_hide_thong_belt` | REVISE | Remove the bone toggle prompt and retain a simple overlapped/tucked rawhide band. |
| `belt_rawhide_girdle` | PASS | Broad plain supportive band and hidden ties fit the slot. |
| `belt_woven_linen_girdle` | PASS | Continuous woven band with tucked ends and bounded pattern. |
| `belt_folded_wool_sash` | PASS | Shallow folded sash with no long tail or fringe. |
| `belt_copper_hook_belt` | REVISE | Tiny hook/slotted closure is a known generation trap; describe the copper as one broad functional terminal plate and leave closure unstated. |
| `belt_plain_leather_belt` | REVISE | Directly prompting buckle/keeper/tucked-end hardware conflicts with project prompt rules; retain the plain leather band and leave fastening unstated. |
| `belt_bronze_plaque_belt` | REVISE | “Seven evenly spaced” parts invites factory repetition; use a small hand-varied set of broad peened plates with visible backing. |
| `belt_segmented_soldier_belt` | REVISE | Remove explicit buckle and repeated-perfect stiffeners; require a few irregular functional plates on backing. |
| `belt_bronze_sword_belt` | HOLD | Historical suspension is valid, but the isolated paired rings risk dangling hardware and weak belt-only read; confirm the intake stays flush and shallow. |
| `belt_double_suspension_girdle` | HOLD | Complex double straps, bridges, and rings are weakly anchored and can become modern harness hardware; needs a direct ancient reconstruction. |
| `belt_lacquered_scale_girdle` | PASS | Hard leather scales reinforce a broad hide body with credible lacing and no flexible-joint conflict. |
| `belt_jade_clasp_warbelt` | REVISE | Invented jade clasp/pegs are fragile closure detail; use one protected flat inset or terminal field and leave fastening unstated. |
| `belt_skymetal_warbelt` | PASS | Broad backed plaque construction is coherent for the T5 fiction. |
| `belt_meteoric_segmented_girdle` | PASS | Short backed iron segments remain shallow and mechanically legible. |

## `auxiliary.tsv`

| art_id | Verdict | Reason |
|---|---|---|
| `quiver_bark_tube` | PASS | Complete empty container, broad strap, and explicit no-bow/no-arrow isolation. |
| `quiver_rawhide_cap` | PASS | Tapered organic body, cap, base, and suspension are coherent. |
| `quiver_copper_mouth` | PASS | Metal remains bounded to functional mouth/base fittings. |
| `quiver_lacquered_reed` | PASS | Reed remains the dominant body with functional backing/rim. |
| `quiver_riven_mouth` | PASS | T5 ribs stiffen a complete hide container without becoming ornament. |
| `gorytos_sewn_hide` | PASS | Characteristic container geometry is retained while all contents are excluded. |
| `gorytos_copper_beak` | PASS | Direct stitched beak-fitting evidence supports the material interface. |
| `gorytos_steppe` | PASS | Organic core, edge plates, flaps, and suspension are well defined. |
| `gorytos_nightglass` | PASS | Obsidian is correctly limited to small protected non-flexing insets. |
| `gorytos_black_beak` | PASS | Direct metal-beak interface translates cleanly to T5. |
| `warcall_shell_horn` | REVISE | It is a cattle-horn instrument, not shell; rename to avoid wrong material semantics and keep any carry loop tight/secondary. |
| `warcall_hide_drum` | PASS | Ancient hide-over-wood drum with one secured beater is mechanically clear. |
| `warcall_bronze_sistrum` | PASS | Direct rigid ancient frame-rattle construction with motif restraint. |
| `warcall_lituus` | PASS | Dated tube family, full framing, and explicit joined-sheet construction. |
| `warcall_thunder_cornu` | PASS | Roman braced cornu geometry supports the T5 material translation. |
| `warbanner_forked_stave` | HOLD | Lore-archaic form is plausible, but the cited finial does not evidence cloth-between-prongs construction; add a reconstruction anchor or mark as explicit faction invention. |
| `warbanner_hide_tab` | HOLD | Conservative standard is possible, but horn crosspiece plus hide panel is unsupported by the cited hardware; clarify socketing and evidence. |
| `warbanner_bronze_finial` | PASS | Direct Luristan finial anchor, bounded geometry, and no weapon point. |
| `warbanner_vexillum` | PASS | Roman bounded crossbar standard is within scope and motif-free. |
| `warbanner_black_fork` | PASS | T5 fiction keeps a compact, taut, non-polearm standard. |
| `quickrig_bentwood_frame` | PASS | Reconstructed Ötzi carrying frame supplies credible wearable load paths. |
| `quickrig_dart_board` | PASS | Backboard, broad harness, and capped tubes avoid quiver/briefcase drift. |
| `quickrig_medicine_frame` | PASS | Auxiliary extrapolation is allowed; every vessel is secured to a complete back frame. |
| `quickrig_fletchers_rack` | PASS | Low-snag flank carrier, secured tools, and no bow/arrows are explicit. |
| `quickrig_riven_trapframe` | PASS | Complete harness and secured compact components preserve the Quick Rig identity. |
| `trapkit_snare_packet` | PASS | Explicit component mechanics and no modern wire/spring hardware. |
| `trapkit_deadfall_board` | PASS | Trigger sticks, prop, cord, and weight have understandable mechanical roles. |
| `trapkit_weighted_net` | PASS | Dated clay sinkers and a secured folded net make a concrete kit. |
| `trapkit_bullet_trigger` | HOLD | Reusing sling bullets as trap weights and inventing bronze trigger tongues is unsupported; replace with ordinary stones/clay weights or provide a real mechanism anchor. |
| `trapkit_blackline_case` | PASS | T5 backing supports a compact ancient-component case without modern hinges. |
| `prepkit_tinder_wrap` | PASS | Direct Chalcolithic fire kit and concrete gathered materials. |
| `prepkit_root_grinder` | PASS | Ancient stone preparation tools form a concrete compact set. |
| `prepkit_pigment_case` | PASS | Palette, spatula, cakes, and pyxis are historically legible and bounded. |
| `prepkit_cosmetic_grinder` | REVISE | Rename “Moon-Groove” to a non-celestial construction name; the negation may not suppress the crescent/solar prior. |
| `prepkit_surgeons_roll` | PASS | Roman medical forms and fitted ancient roll avoid modern bag language. |
| `attendant_bound_pebble` | PASS | Overt suspension is allowed in this lane; underlying antler/cord/stone construction remains primitive. |
| `attendant_copper_spindle` | PASS | Magical counter-rotation is allowed and the physical spindle family is clear. |
| `attendant_bell_yoke` | PASS | Rigid yoke and self-supporting arms avoid chains and charm clutter. |
| `attendant_jade_pyxis` | PASS | Solid vessel remains legible beneath the allowed magical movement. |
| `attendant_black_lampwheel` | REVISE | Wheel, hub, and five radial light cups can still produce the hard-fail solar silhouette despite negation; use an asymmetric lamp rack or non-radial polycandelon segment. |
| `reliquary_bone_wrap` | PASS | Nonhuman dry fragment is cleanly wrapped and not a finished trophy. |
| `reliquary_wood_pyxis` | PASS | Direct ancient container proportions and plain bounded rim detail. |
| `reliquary_bronze_coffer` | PASS | Deep substantial coffer with sparse functional edge plates. |
| `reliquary_jade_ampulla` | HOLD | Late Antique ampulla silhouette is valid, but a full carved greenstone vessel is an unsupported material translation; confirm as deliberate exotic fiction or use ceramic/metal with one inset. |
| `reliquary_black_censer` | PASS | Bowl/lid/suspension are anchored; rigid short crown avoids chain failure. |
| `spoils_raw_horn` | PASS | Raw, dry, minimally processed stock follows the Spoils rules. |
| `spoils_fang_packet` | PASS | Dry mismatched tooth stock, not jewelry or a mounted trophy. |
| `spoils_carapace_plate` | HOLD | “Monster carapace” is generic and not source-supported; assign a specific creature/material source before generation. |
| `spoils_salted_pelt` | HOLD | Same source problem: speciesless nonhuman pelt should be tied to a specific source beast or coherent faction ecology. |
| `spoils_nightglass_nodule` | REVISE | Raw nodule construction is good, but obsidian is the T4 exotic material; re-tier it or replace T5 with raw meteoritic stock in matrix. |

## `jewelry_relics.tsv`

Re-audited against corrected bytes at the parent-reported `6B779E...` SHA.
Several rows changed display names and descriptions without changing stale
material-bearing `art_id` values. Those mismatches are generation blockers,
because the ID, ladder material, prompt, runtime mapping, and final art must
describe the same base.

| art_id | Verdict | Reason |
|---|---|---|
| `ring_bone_hoop` | REJECT | Current row is a bronze hoop under a bone ID and at T1; both ID/material consistency and tier economy fail. |
| `ring_antler_notch` | REJECT | Current row is an unspecified metal wire ring under an antler ID at T1; restore organic T1 construction or re-tier/rename. |
| `ring_shell_band` | REJECT | Display name says Iron-Age Band under a shell ID and T1; material is unstated in the prompt and the rung is not auditable. |
| `ring_copper_open` | PASS | Simple hammered open ring with no weak setting or modern join. |
| `ring_copper_bezel` | PASS | Integral low blank bezel is directly grounded and motif-free. |
| `ring_copper_ridge` | PASS | One structural ridge and rolled edges remain material-led. |
| `ring_bronze_signet` | PASS | Compact blank/abstract seal face avoids script and solar fallback. |
| `ring_bronze_glass` | PASS | Direct Iron Age bounded-glass setting with a protected bezel. |
| `ring_bronze_v` | PASS | Direct V-shaped ring geometry, stripped of intake chevrons. |
| `ring_jade_saddle` | REVISE | Direct gold signet is historically sound at T4, but the jade ID is stale and would poison material/runtime mapping. |
| `ring_amber_socket` | PASS | Amber is a single protected inset using directly supported bezel logic. |
| `ring_obsidian_seal` | PASS | Brittle stone is confined to a deep protected non-articulating bezel. |
| `ring_skymetal_plain` | PASS | Simple T5 material translation with no ornamental fallback. |
| `ring_skymetal_signet` | PASS | Hollowed signet geometry is directly supported and material-led. |
| `ring_skymetal_socket` | PASS | One irregular stone in a protected low socket remains restrained. |
| `amulet_bone_drop` | REVISE | Direct calcite amulet is plausible at T1, but the bone ID is stale and duplicates the calcite family. |
| `amulet_tusk_tip` | PASS | Direct drilled-tusk tradition and minimal organic suspension. |
| `amulet_shell_capsule` | REVISE | Solid calcite correction is historically sound, but the shell ID is stale and the result is near-duplicate of the other calcite amulets. |
| `amulet_copper_lunula` | REVISE | Flat copper sheet amulet is plausible and non-celestial, but the lunula ID is now false; rename before use. |
| `amulet_copper_bulla` | PASS | Direct beaten-sheet bulla construction and restrained edge treatment. |
| `amulet_calcite_vial` | PASS | Direct carved vessel-shaped amulet with no potion-shop additions. |
| `amulet_bronze_capsule` | PASS | Direct ancient hollow bulla/capsule family and simple suspension. |
| `amulet_bronze_seal` | REVISE | Direct bulla correction is sound, but the seal ID is stale and duplicates the adjacent capsule silhouette. |
| `amulet_bronze_tooth` | PASS | Direct mounted boar-tusk object and bounded metal support. |
| `amulet_jade_vessel` | REVISE | Direct gold bulla is valid T4 prestige jewelry, but the jade ID is stale. |
| `amulet_amber_bulla` | REVISE | Direct gold keel bulla is valid, but the amber ID is stale and “false suspension tube” is confusing model-risk phrasing; describe the actual rolled tube. |
| `amulet_obsidian_case` | PASS | Obsidian is a protected face plate on a coherent deep metal case. |
| `amulet_skymetal_drop` | PASS | Simple non-cutting sheet pendant translates cleanly to T5. |
| `amulet_skymetal_bulla` | HOLD | Forked terminal is invented and unsupported by the cited flat pendant; use the directly attested sheet silhouette or a real forked pendant anchor. |
| `amulet_skymetal_seal` | REJECT | Generic cage-around-stone is a fantasy crystal-setting trope, and the ampulla source does not support it. |
| `relic_bone_knucklebones` | REVISE | Drilled tusk relic is directly anchored, but the old knucklebone ID is stale and the “handled relic” role needs a clear grip/use thesis. |
| `relic_bone_pyxis` | REVISE | Direct stone pyxis is sound, but the bone ID is stale. |
| `relic_clay_lamp` | REVISE | Direct sixth-century ampulla is sound, but the lamp ID is stale. |
| `relic_wrapped_fragment` | PASS | Substantial nonhuman fragment and broad cloth wrap are concrete, non-gory relic gear. |
| `relic_copper_casket` | REVISE | Direct Classical mirror is historically strong, but the casket ID is stale and bronze mirror density is better placed at T3 than T2. |
| `relic_copper_offering_bowl` | REJECT | Enlarging a gold jewelry bulla into a “substantial relic” is tier overbuild and weak ARPG base identity; it remains jewelry, not rite equipment. |
| `relic_stone_pyxis` | REVISE | Footed stone bowl is plausible, but the pyxis ID is stale and the cited lidded pyxis does not directly show a footed bowl. |
| `relic_copper_ampulla` | PASS | Pierced-shoulder Late Antique silhouette is directly grounded; copper is a conservative material translation. |
| `relic_bronze_censer` | PASS | Direct Late Antique chained censer; short taut chains and rigid crown control model risk. |
| `relic_bronze_votive_coffer` | REVISE | Direct bronze ampulla is valid, but the coffer ID is stale and duplicates the T2 ampulla family. |
| `relic_bronze_lampwheel` | REVISE | Radial failure is removed, but the lampwheel ID is stale and the new row duplicates `relic_bronze_censer`. |
| `relic_bronze_seal_set` | HOLD | A single ring relabeled as an authority relic is not a substantial relic-base silhouette and duplicates the ring class. |
| `relic_jade_libation` | REVISE | Direct bronze mirror is plausible prestige gear, but the jade/libation ID is stale. |
| `relic_amber_casket` | HOLD | Small protected amber insets are mechanically safe, but the gold bulla source does not verify amber or casket construction; attach a direct amber-setting/casket anchor. |
| `relic_obsidian_brazier` | PASS | Obsidian remains small, protected, and non-structural on a coherent bronze vessel. |
| `relic_jade_staffhead` | REVISE | Direct calcite vessel relic is plausible, but the jade staff-head ID is stale and it substantially duplicates calcite amulets. |
| `relic_skymetal_coffer` | HOLD | Ewer is a sound T5 concept, but the cited mirror is not a pouring-vessel anchor and the coffer ID is stale. |
| `relic_skymetal_censer` | HOLD | Bell is a sound T5 concept, but a censer record is not a bell anchor and the censer ID is stale. |
| `relic_skymetal_lampwheel` | HOLD | Diptych concept avoids radial failure, but the ampulla source does not evidence leaves/hinges and the lampwheel ID is stale. |
| `relic_skymetal_ampulla` | HOLD | Late Antique key is plausible, but a generic collection-term page is not a primary key anchor and the ampulla ID is stale. |

## Second pass on corrected non-jewelry portfolios

The five corrected TSVs were re-read after their owner correction passes.
Every current row not listed below is **PASS** at this historical/manufacturing
gate. These seven residual findings supersede any owner's statement that all
first-pass findings were resolved:

| art_id | Verdict | Reason |
|---|---|---|
| `wpn_club_bossed_stone` | REVISE | Direct Predynastic object and join logic are strong, but a limestone mace at T3 conflicts with the mature-bronze rung; place it as T1/T4 or state a deliberate non-material tier rule. |
| `shield_etruscan_votive` | HOLD | Source explicitly identifies a 90 cm sheet too thin for combat; move it to a ritual/unique offhand or replace it with a fighting shield. |
| `shield_laminated_nile` | REVISE | Direct laminate construction is excellent, but plain wood/leather/copper-nail construction does not establish T4 progression and closely repeats the T2 laminated buckler. |
| `helmet_segmented_vikso` | HOLD | Direct ritual helmet is historically excellent, but the prompt says “no combat pretense”; decide whether a non-protective ceremonial object belongs in the ordinary helmet base class. |
| `hands_copper_wrist_bands` | HOLD | Direct bracelet source is strong, but ordinary wrist jewelry enlarged as “personal equipment” does not yet read as protective hands-slot gear. |
| `feet_gilded_leather_shoes` | HOLD | The object is dated fourth-to-seventh century, which crosses the AD 600 ceiling; use a narrower pre-600 attribution or another directly dated shoe. |
| `spoils_reddeer_pelt` | HOLD | Species choice is declared as faction ecology, but the cited worked bone/hide-working record does not directly support a red-deer pelt; attach a species/material source before treating it as measured. |

## Cross-portfolio blockers found before generation

1. **Rebuild material ladders for metal-helmet families.** Historically valid
   Negau, Attic, Pilos, Coolus, Imperial, ridge, cross-band, and spangenhelm
   forms cannot simply be numbered T1-T5. The rung economy must progress from
   organic/simple through copper/bronze to the project's explicit T5 material.
2. **Remove hard-fail handwear concepts.** Copper-backed gloves,
   lacquer-scale gloves, jade cuffs, obsidian guards, and armored shoes repeat
   the exact incompatible-assembly failures already in the taxonomy.
3. **Do not prompt closures.** Several belt and footwear rows explicitly demand
   toggles, buckles, hooks, keepers, and slotted plates despite the recorded
   model-failure rule. Preserve the item body and let fastening remain implicit.
4. **Strengthen direct evidence for extrapolations.** General museum essays,
   collection-term pages, and unrelated material objects are not sufficient
   primary anchors for rhomphaia, tridents, armored robes/coats, speculative
   pectorals, shell/carpace defenses, and some rite cases.
5. **Do not rely on negative wording to defeat a strong shape prior.** “Moon”
   grinders and radial lamp wheels remain likely to generate banned celestial
   motifs even when the row says “no sun.” This affects both auxiliary and
   jewelry/relic drafts.
6. **Replace placeholder-quality primary anchors.** The jewelry/relic draft
   contains several plausible forms whose URLs demonstrate only an analogous
   object in another material, or a different object entirely. Bone/shell
   rings, bone drops, bone pyxides, clay lamps, votive coffers, offering bowls,
   seal sets, hardstone vessels, and staff heads need direct object-family
   evidence before their prompts are treated as measured.
