# Verdigris Asset Brief (for the Cowork / ChatGPT-Pro image run)

Goal: item art for the Verdigris pack, generated on the ChatGPT web app
(Pro plan credits) instead of the API ($0.37/img). Same pipeline as before:
art on pure black → alpha matte → composite → autocrop (script pattern:
`gen_assets.py` from the July 2026 session; only the generation step changes).

## Style prompt (prefix every item prompt with this)

Written to counteract GPT-image's habitual yellow/sepia wash: the palette is
anchored cold and neutral, warmth is confined to the material itself, and the
cast is banned explicitly.

> Dark low-fantasy bronze-age inventory item icon: {DESC}. Painterly digital
> oil style with neutral white balance and cold, desaturated grading — deep
> neutral blacks, slate-grey shadows, bone-white highlights, muted
> copper-green accents. Warm tones appear only where the material itself is
> warm (ochre pigment, bronze metal), never as an overall wash. Lit by cool
> diffuse overcast light with one restrained warm rim light from the side.
> No sepia tone, no yellow color cast, no amber haze, no vignette. Materials
> look hand-made: knapped stone, lashed cord, hammered metal, stitched hide.
> No polished steel, no gems unless stated. Single object, centered, filling
> most of the frame. Isolated on a pure solid #000000 black background.
> No text, no watermark, no frame.

If a result still trends warm, regenerate once with "make the white balance
noticeably cooler" appended; the local composer also has a `--wb` rescue flag.

## Canvas orientation (start every prompt with this)

GPT-image defaults to square; match the canvas to the item's grid footprint
instead. Prepend ONE of these to the style prompt, per the table's `canvas`
column:

- **P** → `Vertical portrait canvas (2:3 aspect ratio).`
- **L** → `Horizontal landscape canvas (3:2 aspect ratio).`
- **S** → (nothing — square default is correct)

Rule of thumb: weapons/armor/shields portrait, belt landscape, small wearables
(rings, amulets, helms, gloves, boots), trophies and tools square. The matte
must be requested at the same canvas ("same canvas size and framing").

## Mattes: Gemini web app (free), API as sweeper — never ChatGPT

Primary route: the Gemini web app (Nano Banana) on the Pro plan — free.
Attach the downloaded art image with this prompt and save the result as
`{file}_mask.png` next to the art in `assets_staging/`:

> Create a precise binary alpha matte for the attached image: render the
> subject as a solid pure white silhouette on a solid pure black background.
> Preserve the exact outline, including thin cords, straps and points; any
> region showing the black background inside or around the subject must be
> black. Only ~1px of soft antialiasing at edges. Same canvas size and
> framing as the original. Output only the matte image, no text.

Fallback/sweeper: `python gen_masks.py` (Nano Banana Pro via OpenRouter,
~$0.14 each). It only generates masks that are missing, so run it once at
the end to fill any gaps — the two routes never conflict. Do not spend
ChatGPT credits on mattes.

Key lookup is cross-platform: `OPENROUTER_API_KEY` env var, then
`~/.openrouter_key` file, then (Windows only) the user registry. On macOS,
drop the key into `~/.openrouter_key` once. Scripts need Python 3 with
`pip install pillow requests`; use `python3` on macOS.

## Forms × signature materials (one image per row, ~30 items)

| file | canvas | prompt DESC |
|---|---|---|
| handaxe_flint | P | a knapped flint handaxe lashed to a short wooden haft with sinew, held vertical |
| handaxe_bronze | P | a cast bronze handaxe with a leather-wrapped haft, held vertical |
| spear_flint | P | a flint-tipped hunting spear on a long ash shaft, sinew lashing, vertical, filling the full height |
| spear_bronze | P | a leaf-bladed bronze spear with incised socket, vertical, filling the full height |
| spear_skymetal | P | a spear with a dark iridescent meteoric-iron head, star-flecked, vertical, filling the full height |
| macuahuitl_obsidian | P | a macuahuitl: flat hardwood club edged with rows of black obsidian blades, held vertical |
| atlatl_bone | P | a carved bone atlatl dart-thrower with a feathered dart, vertical |
| khopesh_copper | P | a copper sickle-sword khopesh, its blade blooming with green patina, held vertical |
| khopesh_bronze | P | a bronze khopesh with a notch-worn blade, held vertical |
| sling_hide | P | a braided hide sling with a smooth river stone in the pouch, straps hanging vertical |
| shield_hide | P | a tall oval shield of stretched hide over a wooden frame, painted with a red ochre spiral |
| shield_bronze | P | a tall shield faced with hammered bronze, central boss, green patina creeping at the edges |
| shield_rivetmail | P | a tall shield reinforced with riveted iron strips — impossibly advanced, gleaming dully |
| wrap_hide | P | a wrapped hide tunic with bone toggles and cord belt loops |
| wrap_quilted | P | a quilted linen armor vest of layered stitched cloth, undyed off-white, cord tie at the shoulder |
| wrap_bronzescale | P | a vest of overlapping bronze scales sewn onto leather backing |
| wrap_rivetmail | P | a riveted mail hauberk on a wooden stand — technology from beyond the horizon |
| crest_bone | S | a headpiece of carved bone and boar tusks with a horsehair crest |
| crest_bronze | S | a hammered bronze cap with cheek guards, weathered with green patina |
| crest_jade | S | a jade circlet-diadem carved with river motifs, faint cool inner glow |
| grips_hide | S | a pair of hide handwraps with knuckle cords |
| sandals_hide | S | a pair of strapped hide sandals, mud-flecked, worn |
| girdle_hide | L | a wide woven-hide girdle belt laid out horizontally, with a carved antler toggle |
| gorget_jade | S | a carved jade gorget pendant on a knotted cord |
| gorget_amber | S | a raw amber pendant with a trapped insect, on sinew cord |
| ring_bone | S | a ring carved from a single knucklebone, incised marks |
| ring_copper | S | a coiled copper ring with blooms of blue-green patina on hammered metal |
| curio_bone | S | a strange small curio: a tiny carved bone bird with jade-chip eyes |

## Trophies (5)

boar_tusk (lashed tusk fetish), wolf_fang (fang on a cord with feathers),
river_pearl (large baroque pearl in a woven reed cage), ember_shell (glowing
red-veined beetle carapace), knucklebone (polished ancestor knucklebone with
ochre marks).

## Craft tools (8)

Pigments: red_ochre (lump + stained grinding stone), woad (blue paste in a
shell), soot (black powder in a bone tube), marsh_ochre (yellow ochre in a
reed basket). Omens: entrail_omen (clay liver-model with marks),
bird_omen (bundle of feathers and knotted string), smoke_omen (smoldering
herb bundle), blood_omen (dark-stained shallow clay bowl).

## UI (reuse existing)

Keep `frame_ornate`, `divider`, `slot_texture` from the current asset set —
they already read bronze-age enough. Optionally regenerate the frame later
as hammered bronze rather than gold filigree.

## Workflow (Cowork / ChatGPT web app + local scripts)

1. For each row: generate the art in ChatGPT (canvas prefix + style prompt +
   DESC), judge it against the reject checklist, download as
   `<repo>/tools/rpg_inventory/assets_staging/{file}.png`.
2. Matte it in the Gemini web app (matte prompt above), save as
   `{file}_mask.png` in the same folder.
3. Every ~6 items run `python compose_assets.py` from
   `tools\rpg_inventory\core\` (add `--wb` if the chunk trends yellow) —
   composites, autocrops, quantizes into `assets/`.
4. At the end, run `python gen_masks.py` once to sweep any items whose web
   matte was skipped or failed, then `compose_assets.py` again.
5. Verify in the browser (`tools/rpg_inventory/index.html`): item art
   replaces the SVG fallback automatically.

## Reject-and-redo checklist per image

- Background is pure black, single object, no text/watermark/frame.
- **No yellow/sepia wash** — whites read bone-white, shadows read grey-black.
- Silhouette reads clearly at 48px (squint test).
- Matte matches framing; holes (shield grips, cord loops) are black.
