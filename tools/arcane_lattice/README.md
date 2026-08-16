# The Arcane Lattice — Hyperdimensional Spellcrafter

Self-contained Three.js (r128) spellcrafting interface. Players weave a connected
path through a diamond-shaped node lattice (strata 1-2-3-4-3-2-1, 16 nodes) to
compose spells, from Source down to Manifestation.

Open `index.html` directly or via the WIZARD dashboard. Three.js loads from CDN.

## The magic system (canonical)

| Stratum | Nodes |
|---|---|
| Origin | Source |
| Alignment | Adversarial, Natural |
| Focus | Destructive, Sustaining, Creative |
| Element | Fire, Air, Water, Earth |
| Sphere | Body, Spirit, Mind |
| Reach | Outer, Inner |
| Manifestation | Manifestation |

**Core rule:** at the base tier, energy descends only through directly adjacent
channels (`adjT`). Many combinations (e.g. Fire→Mind) are impossible by default —
that is the game working, not a bug. Exactly three sanctioned ways past it:

1. **Paradigm Shift** (3 uses, refundable) — swap two nodes within one stratum.
2. **Schism** (2 uses, refundable) — rotate the six satellites of one inner nexus
   clockwise, then a second nexus counter-clockwise. Moves nodes across strata.
3. **Dimensional Ascension** — tiers progressively hyperconnect the strata:
   - **Tier 0 — Plane (3D):** `adjT` only.
   - **Tier 1 — Vessel (4D):** adds the `WRAP` channels (the diamond's "cut
     edges" restored by folding strata into rings). Alignment→Focus and
     Sphere→Reach become complete; Focus→Element and Element→Sphere become rings.
   - **Tier 2 — Tesseract (5D):** complete bipartite adjacency between every
     pair of neighboring strata.

**The designed economy:** shifts/schisms are scarce but clean (no per-cast cost
beyond the flat shiftsUsed/schismsUsed instability). Ascension is fast but taxed:
every woven hop using a channel not in base `adjT` adds **+8% instability
("hyperchannel strain")** per cast, on top of the flat tier modifiers
(+4 power, +6% instability per tier).

**Displaced nodes** (outside their native stratum, tracked via `NATIVE`):
+2 power and +17% instability each, plus "aberrant hybrid weave" flavor.
Power-vs-control is the core loop.

## Load-bearing architecture (do not change without checking with the design)

- **Slot/assignment model.** 16 immutable slots (`r{row}s{idx}`) with fixed base
  coordinates; nodes live in an `assign: Map<slotId, nodeName>` bijection.
  Shifts/schisms mutate assignments, never geometry. All logic (adjacency,
  schism neighbor-finding) runs on `slot.base` regardless of visual tier.
  Visuals lerp slot.smooth → tierTarget and mesh → assigned slot.smooth.
- **`adjT` is canonical** and must stay exactly as-is. `WRAP` is slot-indexed
  (like `adjT`) so channels don't move when nodes do. `adjAt(tier, up, down)`
  is the only adjacency check weaving validation may use.
- **`validateDownstream` after every shift/schism/undo/tier-descent** prunes
  path segments that are no longer legal — prevents weaving first and mutating
  the lattice after to smuggle an illegal spell. Keep these calls when
  refactoring. Ascending never breaks a path; descending re-validates.
- **Undo semantics:** shift undo swaps the two node *names'* current slots
  (robust to later moves); schism undo applies reverse rotations in reverse
  order. Both refund the counter.
- **Per-node VFX identity is a requirement, not polish** (`PROFILES`: behavior,
  particle count, secondary color, vortex speed, spin direction). Never call
  the nodes "chakras" in anything user-facing.

## Public API (`window.ArcaneLattice`)

```js
ArcaneLattice.onCast = function (spell) { /* semantic spell record; see fields below */ };
ArcaneLattice.getState();        // serializable lattice state (assign, selected, tier, counters, history)
ArcaneLattice.setState(data);    // restore — re-validates the path
ArcaneLattice.setMaxTier(n);     // progression gate: 0 = Plane only, 1 = +Vessel, 2 = +Tesseract
ArcaneLattice.resolveCast(spell, resources, options); // deterministic economy/risk resolution
ArcaneLattice.getSpell();        // current spell data, or null if the weave is incomplete
```

`getSpell()` and `onCast` return the legacy display fields (`title`, `arch`, `body`,
`power`, `mana`, `inst`, `strain`) plus the semantic spell record used by downstream
systems: `path`, `channels`, `tags`, `shape`, `shapeName`, `shapeDescription`, `payload`, `domain`,
`targeting`, `school`, `rarity`, `risk`, and `cost`. Tags are intentionally the
integration contract for future skill-tree and equipment modifiers; consumers should
not key off generated spell names.

`getState()` includes `schemaVersion: 1`. `setState()` tolerates older or malformed
payloads by restoring a valid node bijection, filtering invalid selections/history,
and clamping tier/resource counters before re-validating the weave.

The standalone panel also provides explicit `Save Weave` and `Load Saved` controls
using browser storage. Storage errors are reported in-panel without blocking the
interactive lattice or the host API.

`resolveCast()` is the host combat-loop adapter. It checks mana, reservations, and
cooldowns, then returns a deterministic result with `outcome` (`stable`, `fizzle`,
`backlash`, `inversion`, or `aberration`), an effect payload, resource deltas, and
the next resource snapshot. Pass `options.roll` for deterministic tests; omit it
for a normal random instability roll.

Progression remains host-controlled through `setMaxTier`: the UI starts with
ascension sealed when the host grants Plane-only access, and the host can unlock
Vessel or Tesseract at the appropriate schism/initiation milestones.

Known rough edges: labels are canvas-sprite textures (regenerate if nodes are
renamed); schism undo after intervening mutations is approximate by design. The
canvas now supports pointer/touch orbiting and tapping, while the preview exposes
the spell grammar, channel gates, and risk bands. The host game still owns
progression milestones through `setMaxTier`.

## 1.0.0 readiness

Completed in the current release pass:

- [x] Canonical lattice topology, tier gates, shifts, schisms, undo, and pruning
- [x] Structured spell records with tags, schools, shapes, costs, and risk bands
- [x] Plane/Vessel school codex and locked-channel explanations
- [x] Pointer/touch orbiting and tapping
- [x] Keyboard-selectable node palette and canvas accessibility labeling
- [x] Sanitized state restore with schema versioning
- [x] Standalone Save Weave / Load Saved controls
- [x] Deterministic mana/reservation/cooldown/instability resolver via `resolveCast()`
- [x] Standalone training chamber with visible resource bars, recovery, and combat log

Still required before calling the game 1.0.0:

- [ ] Full host combat presentation that consumes `onCast`/`resolveCast()` results
  and applies damage, healing, buffs, and instability outcomes in a playable scene
- [x] Small-screen responsive visual smoke test at 390px
- [ ] Final accessibility audit across keyboard and screen-reader flows
- [ ] Cross-browser smoke test (CDN/WebGL fallback messaging is now implemented)
- [ ] Release verification for progression milestones and saved-state migration
