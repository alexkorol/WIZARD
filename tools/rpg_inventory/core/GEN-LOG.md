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
2026-07-07 10:20 PDT  MANUAL INTAKE ACCEPTED 9/14: rattle_copper, wrap_quilted_candidate_b, bracers_bronzeplate_candidate_a, girdle_bronzeplate_candidate_a, dagger_bronze_hiltless, focus_black_disc, guard_rawhide_padded, sceptre_bronze_pronged, hideshield_bronze_candidate_b. Duplicate holds remain in assets_inbox.
2026-07-07 10:45 PDT  MANUAL INTAKE ACCEPTED 4/4: gorget_copper, crest_hide, warclub_jade, wrap_hide_lamellar. All four were true-alpha downloads and passed qa_gate. Made gorget_copper, crest_hide, and warclub_jade live runtime art; kept wrap_hide_lamellar as promoted art pending a body-form/material hook. Added STYLE-EXPERIMENTS.md for crisp AAA/PBR product-render prompt testing without changing PROMPT.txt. Reprocessed through direct RGBA compose at 12:30 after true-alpha pipeline fix.
2026-07-07 12:30 PDT  MANUAL INTAKE ACCEPTED 3/3: quiver_rawhide, bowl_bronze_offering, hideshield_rawhide_oval. All three were true-alpha downloads and passed qa_gate. Fixed compose_assets.py so true-alpha image-2 saves bypass matte generation and palette quantization; recomposed all accepted manual intake assets as direct RGBA. Kept existing hideshield_hide and added hideshield_rawhide_oval as a distinct shield silhouette.
2026-07-07 12:49 PDT  STYLE REFERENCE NOTE: inspected attached crisp character renders for item-pipeline calibration. Recorded render-stack transfer only: white-studio clarity, high local contrast, material-specific highlights, sharp bevels, readable seams, fine scratches, and cool rim lighting. Explicitly blocked character/faction/costume leakage: symbols, feather crowns, veils, coin-chain clutter, fixed costume palettes, and jewelry density stay out of ordinary base-item DESCs.
