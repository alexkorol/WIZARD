# Open sandals, shoulder-cloth removal, repeated true-alpha test

The owner rejected clog-like full-foot shoes and the female shoulder cloth, and requested repeated true-alpha instructions throughout the imagegen prompt. This study revises the editable models and the2x4 directional sheet. Only one imagegen call was made.

## Outcome

- Both characters now have open sandals with exposed toes/instep, thin hide soles and two narrow straps.
- The female shoulder cloth is removed; her sleeveless tunic and fitted vest remain.
- Native generated transparency **failed**. The actual tool output is RGB PNG color type2 with no alpha channel, despite repeated true-alpha requests in five prompt sections. Its checkerboard is painted RGB. `raw-alpha-audit.json` records the file-level evidence.
- `final/2x4-local-alpha-sheet.png` has actual transparent alpha derived **locally**, not generated alpha. This distinction is printed on the review boards. It is not evidence that the repeated-alpha prompt succeeded.

## Files

`sources/players-open-sandals.blend` is the editable result. `generated/2x4-original.png` is the unmodified output including its failed background. `imagegen-prompt.json` preserves the exact repeated instructions. `imagegen-execution.json` identifies the tool original. `locally-derived/2x4-local-cutout.png` is explicitly the separately derived cutout. `frames/` contains all eight48x96 local-alpha frame PNGs. `review/kit-revision-native.png` and `review/kit-revision-2x.png` show actual native/2x pixels on light and dark backgrounds.

## Blender changes

`revise_kit.py` ran through actual Blender MCP using the existing scene-query-first runner. It opens the saved v13 source, preserves the closed shoes and drape as hidden objects, and constructs sandals around the evaluated MakeHuman feet. The sole is7mm thick, straps14mm wide and2mm thick, with their surfaces fitted to the actual feet. The existing connected anatomy and poses remain intact. It renders all four directions per character at actual48x96 and also192x384 inspection resolution. The fixed camera matrix is verified unchanged. Main/side/back inspection views show exposed toes and the removed drape. Source and licence provenance for the MakeHuman assets remain in v10.

`build_sheets.py` pixelizes the actual logical renders (alpha128), applies the shared(0,2) registration and packs exact8x guide sheets. The2x4 sheet was inspected and supplied as the structural input, with the previously inspected D2 Amazon crop as style-only reference. The other guide layouts are preserved but were not generated again. No smooth inspection render was supplied to imagegen.

## Alpha evidence and Pixel Respecter

The raw PNG was inspected before processing:1254x1254 RGB, bandsR/G/B, PNG color type2, no alpha extrema because no alpha channel exists. No alpha success was inferred from the displayed background.

After recording and reporting that failure, `local_cutout.py` creates a separate RGBA source using boundary-connected neutral-background pixels (channel spread<=20, minimum>=100). All visible RGB remains unchanged. The local audit records hashes and pixel counts. This is a derived mask that can contain extraction errors; it is not native generation transparency.

The existing Pixel Respecter CLI processes that whole RGBA sheet without `--transparent-bg`, preserving its alpha rather than keying an RGB color again. It recovered a nominal6px mesh,217x221 result, and emitted an8.1% core-alignment warning. The engine checkout was not edited. `finish_sheet.py` splits regular sheet cells and uses shared translation(-4,-14) into48x96 frames. All recovered foreground pixels/colors are verified preserved; none are resized to force the canvas. The final192x192 sheet has only alpha0/255, and its exact3x enlargement is verified.

## Visual limits

The footwear and shoulder revisions read correctly in the generated and processed sheets. Generation added heavier dark contours than intended and shifted some garment/face details. Its denser implied grid makes final margins tight; the female back-view hair touches the top row but no foreground pixels were clipped. Both native and enlarged local-alpha outputs were inspected on light and dark backgrounds. These are review candidates, not approved production sheets or successful native-alpha outputs. No gameplay or production assets changed.
