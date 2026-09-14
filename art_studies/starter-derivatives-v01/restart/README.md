# Clean restart

The owner discarded the previous generated sheets on 2026-09-14. No painted
animation from those trials belongs to the active set, including the partial
96×96 padding sample and the isolated single-frame calibration.

The removed web experiments are recoverable from Git commit
`a55dbf574cb22d84ddd85e964fa1cffacebb3589`. The active review no longer loads
their images, manifests, coverage claims or processing scripts.

The starting material is `../manifest-blender.json`: 128 native RGBA frames,
male/female × walk/sprint × front/right/back/left × eight phases. Each frame is
96×96 with the same [48,80] ground anchor. The player-plane scale is 48 pixels
per metre. Editable Blender sources and the calibrated village are preserved.
These are structure references, not approved final character art.

The painted set starts empty. Rebuild from these references, using simulated
pixel painting at the same implied pixel scale and native generated alpha.
Reject incomplete cycles, incorrect facing, pose/identity changes, clipped
foreground, scale drift and uneven sampling before adding a sheet to playback.
Do not revive old candidates or count merely fitting a 96×96 canvas as parity.

Older local study notes and source experiments outside the removed web trials
are historical material. The active village preview uses only Blender assets.
