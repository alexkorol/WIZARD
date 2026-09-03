# FrameKit

FrameKit is WIZARD's reusable interface language for Verdigris, built from
the generated marble-and-brass sheet art. It is static, dependency-free, and
GitHub Pages-compatible.

## Game demo (flagship)

Open `game/index.html` for the playable game-shell demo. Every visible
surface is real cropped sheet art — nothing is redrawn in CSS:

- **Main menu, town, and combat scenes** — NPCs with winged nameplates open
  the vendor and the shop, a portal descends to the vaults, and monsters of
  four rarities (with a top-center boss bar) fight back while you're down
  there. Kills drop gold and loot straight into the pack.
- **Independent utility panes** — Stats, Stash, Trade, Codex, Crafting, and
  Reliquary share the left position while Inventory and Cosmetics share the
  right. Either side can remain open, switch, or close without disturbing the
  other. The authored character spread is mounted as exact left/right crops,
  with typed equipment, a 13x8 drag-and-drop pack, charms, belt, inspection,
  two-way stash transfer, crafting, and cosmetic loadouts.
- **Skill web** — a generated geometric tree (canvas brass connectors,
  framekit ring/medallion/keystone nodes) with adjacency and refund rules —
  the concept poster is retired.
- **HUD** — the wizard_orbs statue orbs as live health/mana globes (chrome
  masked from the orb plates, dynamic fill), a slim ability rack with
  cooldowns and keybinds, role-marked party frames with downed/revive states,
  buffs, and an XP rail.
- **Trade, Reliquary, chat** — NPCs contextually open the appropriate left
  pane, purchases land in the independently open Inventory, unlocks synchronize
  with Cosmetics, and tabbed chat (Local / Party / Log) logs combat and trade.
- **Settings** — a winged modal with art-swapped toggles, dropdown, and
  button states.

Pane shortcuts are `C` Stats, `K` Stash, `T` Trade, `L` Codex, `F` Crafting,
`I` Inventory, and `O` Cosmetics. `V` opens the full-screen Skill Web. Escape
closes Settings first, then the Skill Web, then the most recently used pane.

`docs/ASSET-REQUESTS.md` lists the next ten concept sheets to generate.

## Asset pipeline

`tools/crop_game_assets.py` cuts `game/assets/` from the source sheets in
`assets/concepts/`. It auto-detects sprite bounds on each sheet (bright
components over the dark ground), slot wells inside composed panels (dark
rectangles), and skill-web node positions (two-pass ring/disc detection),
writing pixel geometry to `game/assets/layout.json`. Re-run it after
replacing any concept sheet; the demo reads all coordinates from the
generated layout.

## Workbench

`index.html` is the older owner-facing component workbench (tokens, density
and accent controls, copyable patterns). `INTERFACES.md` remains the wave-one
compatibility contract, individual standalone demos live beside each
component, and `docs/ADOPTION.md` describes how existing WIZARD modules adopt
the kit. Only the generated annotations on the source sheets are
noncanonical: their labels and implied mechanics do not define the game's
interface model.
