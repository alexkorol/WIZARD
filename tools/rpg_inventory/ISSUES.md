# Brands & Bonds / item crafting system — Known Limitations & Ideas

## item crafting system core (2026-07)

- [x] Engine/content split shipped (`core/`), 22 tests green
- [x] `index.html` rewired onto the core (save key `wizard_vesselforge_v3`;
      old saves reseed). Art paths follow ASSET-BRIEF naming with SVG
      fallbacks until the ChatGPT-Pro image run lands — expect benign 404s
      for `assets/{form}_{material}.png` until then
- [ ] Metamods (lock brands from removal) — PoE metacraft analog
- [ ] Trophy rites as usable skills with cooldowns (Grim Dawn components)
- [x] 2026-11-09: provisional crafting (docs/CRAFTING-PROVISIONAL.md): rarity,
      four bench currencies, Item Rarity drop odds, house recoveries on death.
      Removed: crafting uses, material-upgrade gamble, locked slots, class
      penalty on bonds, set bonus, automatic inheritance

Rewritten 2026-07 alongside the full module rebuild. The old grid-inventory
wishlist is obsolete; this tracks the new system.

## Known limitations

- [ ] Bond formation picks from the item's dominant deed theme but ignores
      item kind (a shield can learn Kill Bonuses if you only ever fight)  —
      arguably a feature; revisit for balance
- [ ] No stacking (currencies deliberately live in the satchel; potions/curios
      are single items)
- [ ] House recoveries are taken back with a button in the Character Record;
      there is no world map to find the death site in
- [ ] Awakened keystone powers are descriptive only (no combat sim to apply them)
- [ ] `window.confirm` for Reset (fine for a demo, replace with a modal in a game)

## Ideas for the Verdigris / Delaford port

- [x] ~~Bond decay when equipped by a different character~~ — removed
      2026-11-09 (no class penalty on bonds)
- [ ] Named NPC relics generated from the same pipeline (give NPCs deed logs)
- [ ] Two-handed weapons occupying both hand slots
- [ ] Theme-gated encounters (choose your venture, aim your bonds)
- [ ] Shared stash tabs; loadouts

## Verified in the asset + kinship pass (2026-07)

- [x] All 24 AI-generated assets (15 bases, 6 currencies, 3 UI) wired in with
      SVG fallbacks; ~1.1 MB total after palette quantization
- [x] Conditional named bonds form via ventures and draughts
- [x] Filigree border-image on panels/tooltips, ornament dividers, stone slot
      texture — no console errors, no mobile overflow, drag engine unaffected

## Verified in this rebuild

- [x] Drag & drop: grid ↔ paperdoll ↔ atelier socket ↔ vendor, with swap,
      ghost preview, and no item loss on failed drops
- [x] Bench currencies incl. error paths (rarity full, no brand room, nothing to remove)
- [x] Bond growth + tiering through Simulate fight; awakening path
- [x] Persistence across reloads (versioned localStorage key, corrupt-save fallback)
- [x] Mobile layout (375px): no horizontal overflow, grid scrolls, bench stacks
- [x] Live character sheet aggregation from implicits + brands + bonds
