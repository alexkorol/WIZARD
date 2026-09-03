# FrameKit — next image-2 batch (10 sheets)

What the current nine sheets could not give the running demo, ranked by how
often I had to fake something in CSS while building it. Every sheet: same
charcoal background (#1c1b19), same marble/bronze/gold/verdigris palette,
single top-left light, objects separated by at least 20 px of clear background
(the auto-cropper segments by gaps), no text baked into components (small
caption labels beneath rows are fine — they get cropped away).

## Sheet 1 — Bar housings and fills, separated

The single biggest gap. Every bar in the current sheets ships pre-filled at a
fixed level, so dynamic bars need hacks. For each bar type show TWO copies
stacked: the empty housing (dark well, no liquid) directly above the same bar
100% filled.

- Standard health bar (winged, red) — empty + full
- Standard resource bar (winged, blue and a purple variant) — empty + full
- Thin XP/progress strip with round end caps — empty + full (gold fill)
- Extra-wide boss bar with center crest — empty + full + a segmented variant
  (4 segment notches)
- Cast bar (short, plain) — empty + full (pale ivory fill)
- Shield/ward overlay strip: a thin translucent silver-teal fill strip alone
  on dark background (meant to layer over a health fill)
- Stagger/poise bar (bronze fill) — empty + full
- Segmented charge bar with 5 pips — empty + full
- Delayed-damage layer: a pale red translucent strip alone (layers behind fill)

## Sheet 2 — Skill-tree node and connector atlas

For the geometric passive tree. Nodes on dark ground, generous spacing:

- Small passive node ring (empty socket), ~64 px: unlit + lit (gold glow) versions
- Notable node ring, ~96 px, with laurel edge: unlit + lit
- Keystone node ring, ~128 px, winged: unlit + lit
- Socketable jewel node (empty circular socket with inner recess)
- Locked node (chain or seal across it)
- Connector pieces designed to tile end-to-end: straight brass path segment
  (~128 px long) unlit + lit; 30° and 60° curved arc segments unlit + lit;
  three-way junction disc; small rivet/joint disc
- A start-of-class anchor plate (larger medallion housing)

## Sheet 3 — World-space labels and prompts

Compact frames that must read at small sizes over bright and dark scenes:

- Loot nameplate pills in five rarities: plain bronze, silver, blue-inlay,
  gold, orange/ember — each empty, short and long variants
- NPC nameplate (marble strip with tiny crest socket)
- Hostile nameplate (darker, red keyline)
- Portal/waypoint label plate (arched)
- Interaction prompt pill with an empty square keycap socket on the left
- Ground-target ring (thin gold ellipse, perspective)
- Offscreen objective arrow chevron (4 directions)
- Elite star marker, boss skull marker, quest ! and ? markers (tiny, slot-corner scale)
- Small "chest", "shrine", "door" icon plates

## Sheet 4 — Notifications, toasts, and ceremonial moments

- Small toast strip (one-line, thin bronze)
- Medium toast with icon socket on the left
- Warning toast (amber keyline) and error toast (red keyline)
- Level-up presentation: large laurel crest with empty center + radiant back-glow
- Quest-complete banner (wide, winged, empty title area)
- Boss-introduction plate (long ceremonial nameplate, O3 ornament)
- Legendary-reveal card (tall, gold ceremonial frame with empty item window)
- Death frame: large desaturated/ashen version of the standard panel, cracked
  corners + a wide respawn button housing in the same ashen treatment
- Area-discovered title scroll (wide, low-contrast, for center-screen text)

## Sheet 5 — Minimap, compass, and map kit

- Circular minimap frame ~360 px with compass ring (N/E/S/W tick marks as
  geometry, no letters) — plus a version without the ring
- Square minimap frame with clipped corners
- Zoom + / − round buttons (match existing small controls)
- Region title plate that sits above/below the minimap
- Full-screen map frame: wide O1 panel with a thin inner keyline and empty interior
- Map pins: waypoint obelisk, quest marker, player arrow housing, party dot
  ring, event burst marker — small, on clear ground
- Floor/level selector: small vertical stack of three tabs
- Legend panel: small floating pane with rows

## Sheet 6 — Status-effect micro-kit

Simpler than skill slots, readable at 40 px:

- Plain buff square (thin gold keyline) and plain debuff square (thin red) —
  deliberately quieter than the current ornate buff frames
- Aura square (teal keyline)
- Crowd-control warning frame (larger, heavy red, for stun/freeze)
- Thin duration ring (empty circle that can sit around any icon) at 3 sweep
  stages: full, half, sliver
- Small stack-count plate (tiny bronze tag for a corner number)
- Immunity shield mini-marker, cleanse sparkle mini-marker
- Silenced (crossed scroll) and rooted (vines) overlay glyphs on clear ground

## Sheet 7 — Input prompt housings

Frames only — the glyphs stay a separate layer:

- Single keycap frame (square marble/bronze), wide keycap (2.5:1), spacebar-wide
- Mouse body with LMB highlighted, RMB highlighted, wheel highlighted (3 tiles)
- Controller face-button round frame, bumper pill, trigger wedge, d-pad cross
  frame, analog-stick ring
- Hold-to-confirm ring (empty circular progress track around a keycap socket)
- Chorded prompt connector (small "+" joiner piece)
- Disabled/rebind-conflict keycap variant (cracked/dimmed)

## Sheet 8 — Dialogue, vendor, and trade extras

- Dialogue box: wide bottom panel with a speaker nameplate tab on the upper
  left and an empty circular portrait medallion socket
- Dialogue choice rows: normal, hovered (gold), selected (double keyline) —
  three separate row strips
- Cinematic subtitle strip (very low-profile smoked black)
- Price tag plate (tiny bronze tag with coin socket)
- Quantity stepper: [-] plate, count well, [+] plate as separable pieces
- Buy/sell tab pair
- Trade: offer-locked overlay (padlock band), offer-changed warning band
  (amber), confirmed band (green), for laying across a grid
- Insufficient-funds red coin marker

## Sheet 9 — Settings and scroll/slider mechanics

The current sliders bake the knob into the rail. Needed as separate pieces:

- Slider rail EMPTY (no knob), slider rail with teal fill portion, and three
  DETACHED knobs (round sun knob, diamond knob, plain knob) on clear ground
- Scrollbar: vertical track, horizontal track, thumb (short + long), top and
  bottom arrow buttons — all separate
- Keybinding table row: empty row strip with a keycap socket on the right,
  in normal + hovered + conflict (red) variants
- Dropdown OPEN state: the list panel that hangs below the field, with three
  row heights visible
- Checkbox checked/unchecked at larger 48 px scale (current ones are tiny)
- Section header strip for options panes (thin, with small medallion)

## Sheet 10 — Decal, rarity, and badge library

Standalone decals with clear separation, each in small (~48 px) and medium
(~96 px):

- Winged sun, winged face, laurel branch (left AND right facing), rosette,
  meander strip end-cap (left/right) and corner piece
- Beast set at matched proportions: eagle, bull, lion, serpent, ram, stag,
  phoenix — bronze finish
- Rarity crests: plain ring (normal), silver diamond (magic), gold laurel
  (rare), ember crown (unique) — designed to sit at a nameplate's left end
- Slot-corner badges at ~20 px readable scale: favorite star, junk X, quest !,
  new-item dot, lock, socket pip, upgrade arrow, broken chain
- Faction seal blanks: three empty circular seals with different edge motifs

## Generation notes

- Keep every element whole — no overlapping elements, no cropping at sheet edges.
- Repeat the SAME component geometry between its empty and filled/lit variants;
  the pair is only useful if the frames align pixel-for-pixel-ish.
- Matte finish over glossy; no lens flares; glows tight and controlled.
- 1672×941 or larger, as before.
