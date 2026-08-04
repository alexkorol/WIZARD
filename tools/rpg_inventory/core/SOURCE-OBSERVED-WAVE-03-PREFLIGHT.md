# Source-Observed Wave 03 — preflight report

Date: 2026-07-24 PDT

Status at publication: **PROMPTS LOCKED; FULL WAVE NOT YET STARTED**

This is the required report before the seven-agent generation wave. Every row
below passed the source, game-roster, prior-art, construction, footprint, and
failure-taxonomy gates. Each agent will receive one locked prompt, the listed
references, one output path, and permission for exactly one image-generation
call. There will be no same-wave rerolls.

## Locked generation set

| # | Art ID | Slot / grid | Canvas | Primary evidence | Why it earns a roster slot | Highest-risk failures |
|---:|---|---|---|---|---|---|
| 1 | `source_river_bast_rib_corselet` | body / 2x3 | P 2:3 | Riverspill DEX T2 equipped-character board `206__p4__...05_06_31 PM.png` | Distinct low-metal B-01 torso defense: continuous backing with narrow vertical bast/fiber ribs; not lamellar, scale, splint, or a costume vest | belt/apron contamination, turning ribs into metal plates or loose reeds, anatomy, turquoise trim |
| 2 | `source_river_faience_barrel_pendant` | amulet / 1x1 | S 1:1 | Riverspill INT T1 board `...09_29_10 PM (7).png`; same pendant repeated on both figures | Compact three-part barrel-bead silhouette absent from existing torcs, discs, bullae, teeth, shells, drops, and the Wave-02 lozenge | cropped cord, gold/bronze setting, broad collar, extra beads, medallion or radial symbol |
| 3 | `wpn_dag_flint_lancet` | dagger / 1x2 | P 2:3 | British Museum 1869,0724.95, Late Neolithic Type-I flint lancet | Monolithic extremely narrow thrusting form; distinct from the broad asymmetric flint cutter and all handled metal daggers | separate/fused handle, spearhead, broad leaf blade, glossy obsidian, chunky knapping, museum damage |
| 4 | `wpn_throw_badarian_stick` | throwing / 1x2 | P 2:3 | British Museum EA59703 Badarian hardwood throwing stick | First non-sling throwing silhouette in the roster; compact one-piece unequal shallow-elbow missile | symmetric boomerang, straight club, paddle, metal fittings, paired sticks, copied cracks/broken tip |
| 5 | `feet_woven_fibre_sandals` | footwear / 2x2 | S 1:1 | British Museum EA4418 + EA4419 true pair; footwear-history sheet only as secondary typology guard | Entirely woven-fibre soles and sparse cord thongs; materially and structurally distinct from hide, quilted, cage, and calf-wrap footwear | floating ankle loops, invisible feet, modern flip-flop symmetry, rigid sole/heel, mirrored identical pair |
| 6 | `wpn_short_loop_knife` | short blade / 1x2 | P 2:3 | British Museum 1919,1119.47, Greek Iron Age one-piece loop-ended knife | Integral single-edge blade and strap handle ending in a small open terminal loop; no overlap with guarded akinakes forms | ring grip/D-guard, sword elongation, added scales/rivets/wrap, corrosion, closed or missing loop |
| 7 | `focus_copper_sistrum` | rite focus / 1x3 | P 2:3 | Walters Art Museum 54.1207, Egyptian bronze bar sistrum, ca. 380–250 BCE | Open three-bar arch is mechanically and visually distinct from existing hand bells and the one-bar shell rattle | copied sacred face, fixed/missing bars, floating jingles, bell/cage-mace drift, thin handle, regalia ornament |

Locked prompt builder:
`tools/rpg_inventory/core/build_source_observed_wave_03.py`

Manifest:
`tools/rpg_inventory/assets_staging/source-observed-wave-03/manifest.json`

## Reference discipline

- Rows 1–2 use actual equipped-character sources from the ladder folders.
- Rows 3–7 use exact museum objects as primary construction authorities.
- The sandals use the already-reviewed footwear history sheet only to reinforce
  exclusions; the museum pair remains authoritative.
- The locally promoted Pinterest discoveries were rechecked. None was attached
  to these seven prompts because each was either less exact than the primary
  object or introduced a contaminating neighboring construction. The earlier
  accepted bow wave already used the promoted Assyrian archery reference where
  it was genuinely relevant.
- Museum burial damage, corrosion, missing parts, scale rulers, duplicate views,
  and sacred imagery are explicitly excluded.

## Objects deliberately not advanced

- Tall capped canister backpack: **REJECT** — speculative/high-tech field-rig
  read; small ancient reed tube bundles do not justify that backpack assembly.
- Riverspill knobbed bronze ball mace: **REJECT** — medieval/fantasy ball-mace
  geometry without a matching ancient load path.
- Post-calibration bone-toggle amulet: **HOLD** — clean isolation, but copper
  collars and incised marks still need stricter material/meaning review.
- Cypriot “finned mace” row: **HOLD** — the actual Met object is a bifurcated
  transverse-socket rosette/authority object, not the assumed axial flanged mace.
- Copper ring bell: **REJECT DUPLICATE** — both `rattle_copper.png` and the
  Pilot-02 bronze bell already occupy this silhouette.
- Plain bone ring: **NO REGEN** — exact art already exists at
  `assets_staging/ring_bone_plain.png`; its baked checkerboard needs salvage
  cleanup, while the cited chronology source is currently invalid.
- Copper lingulate dagger: **DEFER** — the museum blade is sound, but the
  surviving object does not visually prove the complete wood-grip attachment.
  It will not be risked in this wave after the prior fused-handle failures.

## Acceptance protocol after generation

1. Preserve every raw result.
2. Run `qa_gate.py` with the locked P/S canvas.
3. Inspect the raw image against the primary source and the exact failure list
   above.
4. Alpha-extract only results whose physical construction passes. Use
   `--no-decontaminate` when ordinary chroma decontamination causes red/magenta
   speckling in brown, olive, copper, or fibre.
5. Record **ACCEPT**, **HOLD**, or **REJECT** with a concrete reason. Numeric
   pass alone is never acceptance.
