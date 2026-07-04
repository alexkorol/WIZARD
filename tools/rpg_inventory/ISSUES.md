# Brands & Bonds / Vesselforge — Known Limitations & Ideas

## Vesselforge core (2026-07)

- [x] Engine/content split shipped (`core/`), 22 tests green
- [x] `index.html` rewired onto the core (save key `wizard_vesselforge_v3`;
      old saves reseed). Art paths follow ASSET-BRIEF naming with SVG
      fallbacks until the ChatGPT-Pro image run lands — expect benign 404s
      for `assets/{form}_{material}.png` until then
- [ ] Ward-knot metamods ("brands cannot be effaced") — PoE metacraft analog
- [ ] Trophy rites as usable skills with cooldowns (Grim Dawn components)
- [ ] Estrangement healing / kinship re-stamping over time
- [ ] Panoply bonuses are display-only labels; make them structured mods

Rewritten 2026-07 alongside the full module rebuild. The old grid-inventory
wishlist is obsolete; this tracks the new system.

## Known limitations

- [ ] Bond formation picks from the item's dominant deed theme but ignores
      item kind (a shield can learn Slaughter if you only ever fight)  —
      arguably a feature; revisit for balance
- [ ] No stacking (currencies deliberately live in the satchel; potions/curios
      are single items)
- [ ] Single character — bonds never "fade for strangers" since there is no
      second bearer to hand items to
- [ ] Awakened keystone powers are descriptive only (no combat sim to apply them)
- [ ] `window.confirm` for Reset (fine for a demo, replace with a modal in a game)

## Ideas for the Verdigris / Delaford port

- [x] ~~Bond decay when equipped by a different character~~ → shipped as
      **kinship/estrangement**: bonds carry their shaper's archetype and give
      half strength to other archetypes
- [ ] Estrangement could deepen over time, or heal — an estranged bond slowly
      re-attunes to its new bearer (and re-stamps its kinship)
- [ ] Named NPC relics generated from the same pipeline (give NPCs deed logs)
- [ ] Scar removal as an endgame sink ("the item forgives, at a price")
- [ ] Two-handed weapons occupying both hand slots
- [ ] Theme-gated encounters (choose your venture, aim your bonds)
- [ ] Shared stash tabs; loadouts

## Verified in the asset + kinship pass (2026-07)

- [x] All 24 AI-generated assets (15 bases, 6 currencies, 3 UI) wired in with
      SVG fallbacks; ~1.1 MB total after palette quantization
- [x] Conditional named bonds form via ventures and draughts; estrangement
      halves values and flips live when the archetype changes
- [x] Filigree border-image on panels/tooltips, ornament dividers, stone slot
      texture — no console errors, no mobile overflow, drag engine unaffected

## Verified in this rebuild

- [x] Drag & drop: grid ↔ paperdoll ↔ atelier socket ↔ vendor, with swap,
      ghost preview, and no item loss on failed drops
- [x] All six currencies incl. error paths (full vessel, no brand/bond, max slots)
- [x] Bond growth + tiering through Venture Forth; awakening path
- [x] Persistence across reloads (versioned localStorage key, corrupt-save fallback)
- [x] Mobile layout (375px): no horizontal overflow, grid scrolls, bench stacks
- [x] Live character sheet aggregation from implicits + brands + bonds
