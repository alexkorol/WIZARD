# Starter derivatives — reproducibility trial

Open `demo/index.html` through a local HTTP server. From this directory:

```powershell
./launch-demo.ps1 -Python C:/Python312/python.exe
```

Then visit http://127.0.0.1:8789/art_studies/starter-derivatives-v01/demo/.
The server serves this art worktree on loopback only. This is a standalone
village art demo, not a change to the production game or its animation system.

## What is available

The demo begins with the new unarmed pair in the village. WASD moves, Shift
selects sprint while using the motion study, 1/2 changes the selected player.
The companion displays the other sex from the same requested study.
Select a study and facing, pause or step individual frames, and compare with
the exact original identity. World zoom is 1x/2x/3x with nearest-neighbor
rendering; the comparison panel shows actual recovered pixels. Pale and dark
ground expose alpha edges. Unsupported combinations explicitly show no frame.

| Study | Generated frames | Coverage |
| --- | ---: | --- |
| Unarmed idle | 8 | Male/female, S/E/N/W |
| Equipment | 8 | Male/female, front: empty, darts, unhafted flint biface, bowl |
| Diagonal idle | 8 | Male/female, requested SE/NE/NW/SW |
| Walk | 32 | Male/female, four requested phases × four cardinal directions |
| Sprint | 32 | Male/female, four requested phases × four cardinal directions |
| Focused walk retry | 8 | Male/female, four phases, east only |

96 new experimental frames, plus the original club reference. The equipment
sheet's extra empty-hand cells are archived in the manifest; the Unarmed menu
uses the consistent four-facing unarmed sheet. No mirroring, invented missing
frames, tweening, or mixing unrelated identities fills a gap.

## Visual verdict

This batch **does not establish reliable animation generation**. It is retained
as a reviewable experiment, not an approved game-ready sprite pack.

- The unarmed four-facing edit keeps the closest appearance and fits 48x96.
- Equipment stays recognizably related, but the implied pixel scale gets finer.
- Male walk east frame 4 faces west; frame 3 turns toward the back.
- Front/back walk phases and much of the female walk repeat the same leg lead.
- Sprint side views have more motion, but limb alternation remains incomplete.
  The female braid disappears in some front views.
- NW diagonal is nearly rear-facing; NE is insufficiently rotated.
- Restricting a retry to east-facing poses prevents the direction flip, but
  does not solve alternating limbs. It also introduces a second female braid.
- Only 16 of the 96 auto-recovered frames fit the intended 48x96 envelope.
  The others are intentionally shown at their actual recovered scale, with
  explicit size warnings. Arbitrarily shrinking them would conceal a failed
  generation constraint and break the agreed pixel workflow.

The demo and asset checks pass; that is not visual acceptance of the animation.
Do not import these trials as a replacement production movement set.

## Generation and transparency evidence

Built-in imagegen was used throughout. Its tool interface does not report a
verified backend model name, so this is a test of the available imagegen tool,
not independently certified imagegen 2.5 behavior.

Every initial request used the **same exact starter sheet**:
`../starter-slice-v02-identities/native-alpha/generated/players-original.png`.
This is the user's selected male/female club reference, previously derived
through the Blender → 48x96 pixelized guide → simulated-pixel-art workflow.
The derivative experiment changes that existing sheet directly as requested.

`prompts/` contains all eight generation prompts and the alpha-extraction
prompt. `generation-sources.json` and `alpha-sources.json` record the original
tool output paths; project-local copies make the demo independent of them.

The first seven requests returned one native RGBA sheet (unarmed) and six RGB
checkerboard failures. Those untouched failures remain in `first-pass/`.
Six targeted imagegen background-extraction edits subsequently returned native
RGBA; they are in `generated/`. This was a separate extraction experiment on
failed RGB outputs, not the preferred clean-RGBA preservation recipe. The
additional focused walk retry also returned RGBA directly. A returned RGBA
file does not by itself prove its edges or poses are acceptable.

`review/*-alpha.json` records raw PNG color types, modes, sizes and hashes.
Processing thresholds the **returned alpha** at 128 and clears hidden RGB.
There is no locally computed RGB key, checker removal, or segmentation mask on
any player sprite. The native-image preview can show colored low-alpha pixels;
the binary-alpha inputs and in-demo flat-ground checks expose what survives.

## Processing and provenance

`process.py` runs the existing Pixel Respecter checkout, without changing it.
Its automatic grid/mesh fit, candidate evidence, warnings and metrics are
preserved in `reconstructed/*-fit.json`; the selected automatic outputs are
preserved as `*-auto.png`. No arbitrary coarse grid or image resize is imposed.
The scripts accept a `--respecter` path for another checkout.

`assemble.py` finds transparent sheet gutters and registers whole recovered
pixels. It uses a shared floor and horizontal coordinate system within each
motion row. Equal grid cuts originally leaked sandal tips into adjacent cells;
gutter-based cuts fix that packaging issue without deleting artwork. Every
foreground pixel and RGBA color is checked before/after registration. Oversized
frames receive larger canvases rather than losing pixels to a forced 48x96 crop.

```powershell
python process.py --respecter Z:/Code/Python/pixel-perfecter
python assemble.py
node verify-demo.cjs
```

For the browser check, set `PLAYWRIGHT_PATH` to an installed Playwright package
if the bundled Codex runtime is elsewhere. Set `DEMO_URL` for a different port.
The check uses headless Edge. See `review/demo-verification.json` and screenshots.

Scenery copies come from the existing game checkout, unchanged on disk:

- `prototypes/founding-slice/assets/{dwelling,tree,shrine}.png`
- `docs/reference/25d-overhaul/assets/tile_grass.png`

Only these legacy scenery props decode their existing magenta matte at runtime.
Player sprites retain their PNG alpha. NPCs and wolves reuse the prior native
alpha prologue pack through relative paths. Ground texture and movement are
demo context; this experiment adds no combat, collision, or attack animations.
