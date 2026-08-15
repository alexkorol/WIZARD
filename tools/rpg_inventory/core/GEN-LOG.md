Sun Jul  5 15:22:06 PDT 2026  dagger_bone  DONE (gen+QA+matte+compose)
Sun Jul  5 15:22:06 PDT 2026  dagger_skymetal  DONE (gen+QA+matte+compose)
Sun Jul  5 15:22:06 PDT 2026  warclub_copper  DONE (gen+QA+matte+compose)
Sun Jul  5 15:22:06 PDT 2026  warclub_bone  DONE (gen+QA+matte+compose)
2026-07-05 18:42 PDT  helm_copper DONE
2026-07-05 18:42 PDT  helm_bronzescale DONE
2026-07-05 18:42 PDT  helm_rivetmail DONE
2026-07-05 18:42 PDT  greaves_bronzescale REDONE (first attempt hung past 6min, redo succeeded)
skipped (locked) Sun Jul  5 18:54:41 PDT 2026
skipped(locked) Sun Jul  5 19:31:39 PDT 2026
skipped(no browser) Sun Jul  5 19:51:55 PDT 2026
skipped(no browser) Sun Jul  5 20:06:35 PDT 2026
skipped(locked) Sun Jul  5 20:13:52 PDT 2026
2026-07-05 20:52 PDT  skipped(no login - ChatGPT MFA challenge)
skipped(locked) Sun Jul  5 21:06:19 PDT 2026
2026-07-05 21:53 PDT  skipped(no browser)
skipped(locked) Sun Jul  5 22:06:11 PDT 2026
skipped(no browser) 2026-07-05 22:51 PDT
skipped(no local browser) 2026-07-05 23:15 PDT
skipped(no local browser) 2026-07-05 23:22 PDT
skipped(no local browser) 2026-07-05 23:23 PDT
2026-07-06 00:01 PDT  greataxe_skymetal DONE
2026-07-06 00:01 PDT  handaxe_skymetal DONE
2026-07-06 00:01 PDT  spear_skymetal SKIP(qa-reject + full-res render hang past 6min, twice) - left in REGEN
2026-07-06 00:18 PDT  spear_skymetal DONE
2026-07-06 00:18 PDT  khopesh_skymetal DONE
2026-07-06 00:18 PDT  warclub_bone DONE
2026-07-06 10:40 PDT  buckler_hide DONE
2026-07-06 10:40 PDT  gorget_jade DONE (1 redo - first gen bg-gradient reject)
2026-07-06 10:40 PDT  shield_wicker HUNG (redo stalled past cap; first gen was edge-crop reject) - left in queue
2026-07-06 10:40 PDT  NOTE: REGEN entries hideshield_bronze + crest_copper are not valid art_ids in targets.tsv - unbuildable, need Alexei to fix/remove
2026-07-06 17:20 PDT  girdle_gilded DONE
2026-07-06 17:20 PDT  girdle_skymetal DONE
2026-07-06 17:20 PDT  wrap_studded HUNG (Pro Extended thinking mode, no image past 8min cap) - left in queue
2026-07-06 17:20 PDT  NOTE: REGEN hideshield_bronze + crest_copper still invalid art_ids - need Alexei; shield_wicker skipped (hung last run)
2026-07-06 17:56 PDT  bracers_gilded DONE
2026-07-06 17:56 PDT  greaves_jade DONE (jade panels have subtle scroll relief - accepted, not gratuitous spirals)
2026-07-06 17:56 PDT  bracers_skymetal HUNG (preview tiles never resolved to full-res past 8min cap, even after switching Pro Extended -> Instant) - left in queue
2026-07-06 17:56 PDT  NOTE: switched chat model Pro Extended -> Instant mid-run (Pro Extended was hanging renders); greaves_jade still completed right at cap. REGEN hideshield_bronze + crest_copper still invalid art_ids - need Alexei; shield_wicker + wrap_studded skipped (hung prior runs)
skipped(locked) 2026-07-06 18:07 PDT
2026-07-06 18:33 PDT  greaves_rivetmail REJECT (gradient bg corner-std 13.9 + portrait output for square canvas + 36% edge-crop) - left in queue
2026-07-06 18:33 PDT  sword_flint REJECT (gradient/vignette studio bg corner-std 19.3 + 58% edge-crop, item bleeds off corners) - left in queue
2026-07-06 18:33 PDT  greataxe_bone REJECT (gradient bg corner-std 27.1 + 32% edge-crop) - left in queue
2026-07-06 18:33 PDT  NOTE: 3/3 wave-1 gens failed IDENTICALLY on flat-bg + edge-crop. Systemic: ChatGPT image model now renders photographic gradient/vignette backgrounds and full-bleed crops, ignoring the flat-uniform-bg + inside-frame prompt. NEEDS ALEXEI: check ChatGPT default image model/settings (likely changed) - flat-bg matte gate cannot pass until fixed. Halted before wave 2 to avoid burning gen budget on duds.
2026-07-06 18:33 PDT  lock released
2026-07-06 18:48 PDT  greataxe_bone DONE
2026-07-06 18:48 PDT  sword_flint REJECT(border-crop 24.8% + bg not flat) then redo HUNG past cap - left in queue
2026-07-06 18:48 PDT  greaves_rivetmail REJECT(ChatGPT rendered PORTRAIT 1024x1536 for a SQUARE S-canvas item + cropped) then redo HUNG - left in queue
2026-07-06 18:48 PDT  NOTE: S-canvas prompts (no aspect prefix) keep coming out portrait from ChatGPT -> auto aspect-FAIL. Harness may need an explicit 'Square canvas (1:1)' prefix for canvas=S. Flagging for Alexei.
2026-07-06 18:48 PDT  NOTE: renders very slow this run (~420-450s); several redos never resolved full-res past 8-min cap. REGEN hideshield_bronze + crest_copper still invalid art_ids - need Alexei.
2026-07-06 19:20 PDT  sword_jade DONE
2026-07-06 19:20 PDT  warclub_obsidian DONE
2026-07-06 19:20 PDT  warclub_skymetal DONE
2026-07-06 19:20 PDT  idolstaff_jade DONE
2026-07-06 19:20 PDT  spear_jade DONE
2026-07-06 19:20 PDT  hideshield_bronze HUNG in /c/6a4c5f2b-3484-83ea-b12b-4ddb3720c450 - harvest next run (strike 1; R art_id now VALID - Alexei fixed targets.tsv)
2026-07-06 19:20 PDT  NOTE: sandbox was missing scipy -> art_matte failed first pass; pip-installed scipy 1.15.3, matte+compose succeeded. Coverage 79->84/93.
2026-07-06 19:20 PDT  NOTE: R items (hideshield_bronze, crest_copper) now emit valid prompts (previously invalid art_ids - Alexei fixed). crest_copper is S-canvas; S-canvas prompts still lack a 'Square (1:1)' prefix and reliably come out portrait->aspect-FAIL, so all S-canvas items skipped this run. Still needs Alexei's square-prefix fix. shield_wicker/wrap_studded (chronic P hangers) also skipped in favor of fresh reliable items.
2026-07-06 19:20 PDT  lock released
2026-07-06 19:59 PDT  hideshield_bronze DONE (harvested)
2026-07-06 20:36 PDT  crest_copper DONE
2026-07-06 20:36 PDT  shield_wicker DONE
2026-07-06 20:36 PDT  wrap_studded DONE
2026-07-06 20:36 PDT  bracers_skymetal DONE
2026-07-06 20:36 PDT  gorget_skymetal DONE
2026-07-06 20:36 PDT  ring_skymetal DONE
2026-07-06 20:36 PDT  NOTE: wave-1 renders slow (~15-17min, no assistant msg visible until late) - extended harvest window past 8-min cap paid off, 3/3 landed; wave-2 fast (~5min) 3/3. Square-prefix fix confirmed working (crest_copper + 3 skymetal S-canvas all 1024x1024). Full-res imgs need eager-load+decode() kick to fetch on reload.
2026-07-06 20:51 PDT  fetish_bone DONE
2026-07-06 20:51 PDT  rattle_copper DONE
2026-07-06 20:51 PDT  sceptre_bronze DONE
2026-07-06 20:51 PDT  starwand_skymetal DONE
2026-07-06 20:59 PDT  lunula_bronze DONE
2026-07-06 20:59 PDT  signet_bronze DONE
2026-07-06 20:59 PDT  NOTE: queue hit 89/89 mid-run -> extended ladders per BASE-DESIGN: added lunula_bronze (amulet T3, Bronze Lunula - crescent neck collar, silhouette-distinct from torc/gorget) and signet_bronze (ring T3, Bronze Signet - flat horned-sun seal face, distinct from coil/band). Both were the only tier gaps (T2->T4 jumps); helmet T2 skipped per redundancy warning + alias pool. All 6 gens this run passed gate first try (TRUE-ALPHA, square-prefix holding).
2026-07-06 21:11 PDT  skipped(locked)
2026-07-06 22:28 PDT  hideshield_oxhide DONE
2026-07-06 22:28 PDT  boots_fur DONE
2026-07-06 22:28 PDT  warclub_stone DONE
2026-07-06 22:28 PDT  mirror_obsidian DONE
2026-07-06 22:28 PDT  river_pearl DONE
2026-07-06 22:28 PDT  dagger_tusk DONE
2026-07-06 22:28 PDT  NOTE: COVERAGE COMPLETE 97/97 - queue empty. All 6 gens this run passed gate first try (TRUE-ALPHA, 0 strikes). Wave-1 renders ~10min (imgs invisible until eager-load+decode() kick - now standard in harvest JS); wave-2 ~4min. Run stopped at 2-wave cap (36/60 budget). Next run: queue will be empty -> extend ladders per BASE-DESIGN ⚑ rules, or Alexei curates new targets first.
2026-07-06 23:21 PDT  skipped(rate-limit)
2026-07-06 23:21 PDT  NOTE: queue was empty (97/97) -> extended ladders per BASE-DESIGN +6 rows: necklace_claw (amulet T1 strung-claw loop), wand_antler (ritefocus T1 forked tine), shield_turtleshell (shield T1 domed shell), mantle_feather (body T4 feather mantle), girdle_shell (belt T1 shell-disc row), curio_turquoise (turquoise beetle). Wave-1 (turtleshell/girdle_shell/mantle) SENT ok ~40s apart, then ChatGPT 'Too many requests' dialog blocked conversation polling ~12min in - imgs never visible. All 3 struck w/ chat paths for HARVEST FIRST next run (do NOT re-send). Wave-2 items (necklace_claw, wand_antler, curio_turquoise) never sent - clean in queue. Next run: max 2 new items per rate-limit rule; harvest the 3 pending first. Polling cadence may need slowing (reloads every ~60-90s tripped limiter).
2026-07-07 10:20 PDT  MANUAL INTAKE ACCEPTED 9/14: rattle_copper, wrap_quilted_candidate_b, bracers_bronzeplate_candidate_a, girdle_bronzeplate_candidate_a, dagger_bronze_hiltless, focus_black_disc, guard_rawhide_padded, sceptre_bronze_pronged, hideshield_bronze_candidate_b. Duplicate holds remain in assets_inbox.
2026-07-07 10:45 PDT  MANUAL INTAKE ACCEPTED 4/4: gorget_copper, crest_hide, warclub_jade, wrap_hide_lamellar. All four were true-alpha downloads and passed qa_gate. Made gorget_copper, crest_hide, and warclub_jade live runtime art; kept wrap_hide_lamellar as promoted art pending a body-form/material hook. Added STYLE-EXPERIMENTS.md for crisp AAA/PBR product-render prompt testing without changing PROMPT.txt. Reprocessed through direct RGBA compose at 12:30 after true-alpha pipeline fix.
2026-07-07 12:30 PDT  MANUAL INTAKE ACCEPTED 3/3: quiver_rawhide, bowl_bronze_offering, hideshield_rawhide_oval. All three were true-alpha downloads and passed qa_gate. Fixed compose_assets.py so true-alpha image-2 saves bypass matte generation and palette quantization; recomposed all accepted manual intake assets as direct RGBA. Kept existing hideshield_hide and added hideshield_rawhide_oval as a distinct shield silhouette.
2026-07-07 12:49 PDT  STYLE REFERENCE NOTE (SUPERSEDED): initial read was too defensive and treated attached character renders as render-stack evidence only.
2026-07-07 13:32 PDT  LOADOUT EXTRACTION BREAKTHROUGH: Alexei's test used a full character/source image as the equipment source and asked image-2 for separate paperdoll-slot item icons. This works better than isolated item DESCs because the source image carries a coherent equipment system: silhouette family, materials, attachment logic, ornament density, and slot relationships. Details like feathers, tassels, shell plates, cords, chains, veils, stones, scratches, and symbols are valid when integrated into the item. The failure mode is ungrounded decoration pasted onto a prompt in a vacuum. Added LOADOUT-EXTRACTION.md and corrected the style guardrails.
2026-07-24 20:47 PDT  source_plateau_recurve_bow DONE (rare complete coherent bow; square matte salvaged by local alpha/reframing)
2026-07-24 20:47 PDT  source_plateau_woven_quiver HOLD (organic construction good, but arrows visible; quiver must be empty)
2026-07-24 20:47 PDT  source_plateau_felt_helm REDUNDANT (prior art already promoted as helmet_ridged_hide_point; duplicate prompt retired)
2026-07-24 20:47 PDT  source_plateau_riding_coat HOLD (felt/wool source drifted to smooth leather and excess panels)
2026-07-24 20:47 PDT  source_north_leaf_sword SKIP (ornament/workshop drift)
2026-07-24 20:47 PDT  source_north_oval_shield SKIP (unsupported repeated copper-alloy hardware)
2026-07-24 20:47 PDT  source_north_banded_corselet SKIP (machine-regular plates/rivets; later-period drift)
2026-07-24 20:47 PDT  source_north_bronze_cap SKIP (medieval spangenhelm construction drift)
2026-07-24 20:47 PDT  NOTE: eight-agent source-observed pilot generated exactly once per item. Strict result 1 accept, 2 hold, 4 reject, 1 duplicate/reuse. Added mandatory prior-art visual gate before Wave 02.
2026-07-24 21:25 PDT  source_dustwind_clipped_body_shield DONE
2026-07-24 21:25 PDT  source_dustwind_woven_lobed_buckler DONE
2026-07-24 21:25 PDT  source_stonewood_bound_longbow DONE (rare complete bow; square matte fixed through alpha autocrop/reframing)
2026-07-24 21:25 PDT  source_north_socketed_hook_sickle DONE (complete source-grounded weapon; square matte fixed through alpha autocrop/reframing)
2026-07-24 21:25 PDT  source_dustwind_bronze_lozenge_amulet HOLD (cord cropped; incomplete wearable loop)
2026-07-24 21:25 PDT  source_river_calf_wrap_sandals SKIP (loose calf ties float around invisible legs)
2026-07-24 21:25 PDT  source_river_shell_scale_corselet DONE (direct crop/alpha salvage from existing isolated board; no generation)
2026-07-24 21:25 PDT  NOTE: Wave 02 strict result 4 generated accepts, 1 direct-salvage accept, 1 hold, 1 reject. Chroma decontamination caused false red speckles; accepted outputs re-keyed with --no-decontaminate.
2026-07-24 22:03 PDT  source_river_paddle_cudgel DONE (direct crop/alpha salvage from existing isolated board; complete plain wood club, no generation)
2026-07-24 22:20 PDT  source_river_faience_barrel_pendant DONE (complete cord loop; simple faience-and-fiber construction; alpha salvage passed)
2026-07-24 22:20 PDT  wpn_dag_flint_lancet DONE (monolithic Type-I flint body; no invented handle or metal)
2026-07-24 22:20 PDT  wpn_throw_badarian_stick DONE (source-faithful unequal shallow-elbow hardwood missile)
2026-07-24 22:20 PDT  feet_woven_fibre_sandals DONE (true pair; cords rest naturally with no invisible-leg support)
2026-07-24 22:20 PDT  wpn_short_loop_knife DONE (integral one-piece iron blade, strap handle, and open terminal loop)
2026-07-24 22:20 PDT  source_river_bast_rib_corselet HOLD (square canvas plus over-regular rigid reed/stem interpretation; source intended bast ribs on continuous backing)
2026-07-24 22:20 PDT  focus_copper_sistrum HOLD (mechanics pass, but the render reads polished golden bronze/brass rather than the restrained copper rung)
2026-07-24 22:20 PDT  NOTE: Wave 03 generated 7 items in parallel, one locked call each, no rerolls. Strict result 5 generated accepts and 2 holds; accepted cutouts keyed with --no-decontaminate and passed true-alpha QA.
2026-07-24 23:05 PDT  wpn_bow_holmegaard_flat DONE (source-faithful broad flat elm limbs, deep narrow grip, complete string and tips; numeric 5% thin-bow coverage reject overridden after direct visual/source comparison)
2026-07-24 23:05 PDT  focus_copper_ladle DONE (BM N.120 bowl, open trough spout, and high returning strap handle preserved; restrained localized tarnish only)
2026-07-24 23:05 PDT  relic_stone_pyxis DONE (Getty 88.AA.83 body tooling, compact pierced lugs, recessed lid seat, and conservative plain fitted disc lid)
2026-07-24 23:05 PDT  amulet_calcite_drop DONE (small pale calcite vessel/drop on one complete bast/flax cord loop; no metal setting or cropped cord)
2026-07-24 23:05 PDT  shield_bronze_yetholm DONE (one-piece front fighting face with dense concentric structural ribs and alternating tiny punched-boss fields)
2026-07-24 23:05 PDT  wpn_axe_abydos_adze HOLD (assembly and long blade proportions match the BM/Met sources, but burial-green corrosion was copied into an active-service item)
2026-07-24 23:05 PDT  NOTE: Wave 04 generated 6 items in parallel, one locked call each, no rerolls. Strict result 5 accepts and 1 hold. All accepted cutouts keyed with --no-decontaminate; four passed true-alpha QA directly and the complete source-faithful flatbow retains a documented thin-silhouette metric exception. Strict expansion total today: 17 accepted.
2026-07-24 23:16 PDT  helmet_light_bronze_pilos DONE (exact Pilot-02 prior generation reused; official Met/Getty pilos source and strict dedupe pass; locally re-keyed with --no-decontaminate instead of regenerating)
2026-07-24 23:16 PDT  NOTE: helmet_light_bronze_pilos salvage true-alpha QA PASS at 859x971, 65% coverage, 0% edge. Strict expansion total today: 18 accepted.
2026-07-24 23:45 PDT  NOTE: SESSION WRAP. Strict expansion total remains 18 accepted. Wave 05 has six locked source-audited prompts and a preflight report, but 0/6 raw outputs; five dispatched generation agents were interrupted and the sixth was never started after the user flagged excessive Codex weekly-quota use. Future sessions must reserve 6-8 agents for ready image calls, keep research serial/2-agent maximum, and stop auditing once a wave is ready.
2026-08-15 16:58 PDT  NOTE: Post-calibration Wave 2 user-approved promotion release integrated 126 true-alpha finals into the live taxonomy; 2 amulets remain on hold for cropped neck cords, while all 55 review and 22 reject rows remain flagged for Alex's later review. No new generation calls.
