# 300-item expansion corrections — mandatory preflight

This is the durable correction ledger for the 2026-07-24 expansion session.
Read it before selecting sources, writing prompts, dispatching agents, or
approving outputs. These rules override tempting shortcuts and generic model
defaults.

## Operating contract

- The task is to produce a broad Path of Exile 1 / Diablo 2 style ARPG base
  roster, not to spend the session mainly rewriting plans. After preflight,
  generate and QA real assets.
- Use 6–8 parallel agents when the user authorizes a generation wave. One agent
  handles one locked prompt and makes exactly one generation call. Preserve
  every untouched raw output and do not same-run reroll failures.
- The account has previously sustained more than 60 images/day with six
  agents. The old 60/day figure is a planning estimate, not a reason to
  under-dispatch; still stop on actual rate-limit signals and preserve the
  strike/harvest workflow.
- Before a full wave, deliver a pilot report with sources, prompts, aspect
  ratios, grid footprints, numeric QA, visual failure taxonomy, and explicit
  accept/hold/reject decisions. Do not inflate the acceptable count.
- Pixel-art variants come only after the user approves and sorts the source
  generations. Never pixel-variant a rejected or unreviewed item.
- Include salvage review of
  `C:\Users\Alex\Downloads\items_post_calib_batch`; do not regenerate a usable
  silhouette already present there.

## Source-first rule

- Before selecting a generation source, perform a prior-art pass across:
  - current composed assets and staging;
  - `items_post_calib_batch`;
  - `expansion_drafts/post-calib-triage.tsv`;
  - `expansion_ready/*-supply-map.tsv`; and
  - every `review_reuse` / `promote` row in `targets-600.tsv`.
- Dedupe visually by slot, silhouette, construction family, material, and
  macro-shape—not by filename or proposed item name. A renamed near-duplicate
  is still a duplicate.
- If existing usable art already fills the rung, map/reuse it and do not
  generate. Generate a neighboring rung only when it has a deliberately
  different source-observed macro-silhouette and construction role.
- Never invent an item in prose and then search for references that vaguely
  justify it.
- Visibility does not create an obligation to extract. After the source and
  prior-art gates, apply a game-roster gate: the object must be a compelling,
  mechanically meaningful ARPG base with a strong inventory silhouette, a
  legitimate equipment/auxiliary slot, and room for ladder progression.
- Do not turn every object worn, carried, or held by a mock character into an
  item. Leave incidental tools, costume clutter, scene/storytelling props,
  awkward one-off novelties, redundant accessories, and weak joke-loot
  silhouettes in the source image.
- A taxonomy label is not automatic approval. A visible object proposed as an
  offhand, mobility rig, trap kit, war-call, preparation, relic, or other
  auxiliary still has to earn its roster slot against PoE/D2-style base-item
  usefulness and readability.
- First inspect an actual visible object:
  - equipped or laid out in a reviewed ladder/loadout image; or
  - a clear artifact photograph or credible reconstruction; or
  - a reviewed Pinterest discovery paired with museum/catalogue verification.
- Then transcribe only the observed silhouette, materials, joins, closure,
  proportions, and bounded ornament. If the construction is not visible enough
  to transcribe, choose another source.
- Faction references may control finish and coherent visual language only where
  the material/construction is actually present. They may not add prestige
  materials.
- Use actual PoE equipment subcategory pages and inspect the item images and
  tier progressions. PoE controls grid economy, occupancy, silhouette
  readability, and progression—not historical construction.
- The 300-row roster is planning coverage, not a generation-ready queue.
  Unsupported rows stay blocked until they receive an inspected primary object
  image.

## Grid and framing

- Follow `INVENTORY-FOOTPRINTS.md`: belts 2x1, body armour normally 2x3,
  heavy two-handed weapons 2x4, and other classes sized by bulk.
- Generator canvas and runtime grid are related but not identical. Use the
  established portrait/square/landscape prompt blocks.
- Numeric QA is a gate, not an oracle. Preserve a rare visually successful
  hard-family result such as a complete coherent bow when the only defect is a
  removable matte/canvas mismatch; extract alpha and reframe locally instead
  of wasting it or rerolling. Physical construction failures remain rejects
  even when numeric QA passes.

## Material and construction economy

- Pre-ancient bronze/brass is expensive elite material, never generic accent
  trim. Cheap reed, bast, ordinary cloth, common wood, and plain hide stay
  organic-led.
- Raise organic tiers through weave, fit, lamination, lacquer, join quality,
  specialized silhouette, and labor—not polished metal collars, caps, plates,
  rivets, or faction-color hardware.
- A cloth belt cannot be a seamless woven hoop. It needs two visible ends and a
  credible low-profile textile tie/knot; no bronze/brass clasp on cheap cloth.
- Handles must expose a believable interface. Wood scales cannot visually melt
  into a blade. Show a legible tang or blade shoulder, separately fitted
  slightly irregular hand-worked scales, and only mechanically necessary
  rivets. Reject machine-even grips and invisible material transitions.
- Reject dense repeated rivets, identical plates, perfect compound panels,
  precision rims, seamless symmetry, and regular fittings that imply modern,
  industrial, or medieval manufacture.

## Slot isolation

- Quivers, arrow-cases, and gorytoi are standalone empty containers. Show a
  capped mouth or a visibly open dark empty mouth. No arrows, shafts, fletching,
  bow limbs, bowstrings, grips, or combined archery set. Arrows are separate
  inventory items.
- A source image showing arrows inside a quiver does not override this
  inventory separation rule.
- Keep belts horizontal and shallow; body armour excludes belts, mantles,
  detachable neckwear, and invented connecting garments. Paired handwear and
  footwear must be generated as pairs.
- Empty footwear cannot preserve the shape of an invisible leg. Long calf
  thongs, wrap cords, and loose ties must lie naturally, be loosely coiled, or
  be bundled beside/around the sandal pair. Reject straps that float upward in
  rigid spirals as though wrapped around absent anatomy.
- Amulets are complete wearable objects. Show either the full neck cord/loop or
  a clearly intentional pendant-only base with no cropped cord fragments.
  Reject two cord ends cut by the frame.

## Failure lessons from the pilot

- The corrected Cypriot dagger is rejected: the wood appears fused into the
  blade and the grip is too evenly cut. Do not promote or pixel-variant it.
- The speculative lacquered reed quiver is retired: it was prose-invented and
  acquired unjustified polished copper-alloy hardware.
- The source-observed woven quiver has good organic construction but is held
  because arrows are visible.
- The source-observed recurve bow is a keeper despite its square source matte;
  it is a rare complete coherent bow and should be reframed locally.
- The source-observed tan pointed riding helm is redundant. Existing art
  `ChatGPT Image Jul 14, 2026, 01_03_23 AM (3).png` is already promoted as
  `helmet_ridged_hide_point` / `helmet_hide_point`; reuse it and never generate
  this rung again.
- Character references can establish loadout identity but may be too distant
  for metal joinery. Close artifact/reconstruction references are required for
  sword hilts, shield rims/boss layouts, corselet assembly, and helmet panels.

## Approval discipline

- Every output gets both numeric QA and direct visual inspection against the
  source and failure taxonomy.
- Record accept, hold, or reject with the concrete reason. A good silhouette
  does not excuse unsupported hardware; a passed aspect gate does not excuse
  medieval drift.
- Only accepted cleaned cutouts belong in the approved directory. Move held
  derivatives to a hold directory; preserve raw generations for audit.

## Quota-efficiency correction (2026-07-24 session wrap)

- Six to eight parallel agents are authorized for locked image-generation
  calls, not for an open-ended research tree. Parallel research consumes Codex
  weekly quota even when it produces no images.
- Do source selection serially or with at most two bounded audit agents. Stop
  research as soon as one full generation wave is ready, issue that wave, and
  QA it before opening more candidate branches.
- Do not recursively replace every rejected audit in the same session.
- Report strict usable additions, image-generation calls, and holds/rejects.
  Audit count is not production throughput and must never substitute for item
  art.

## Evidence-sufficiency taxonomy

Classify every proposed source before prompt writing. Record the class in the
audit or preflight.

- **E1 — complete direct object:** inspected imagery proves the whole item and
  every identity-bearing join. Generation-ready after roster and dedupe gates.
- **E2 — bounded completion:** a primary artifact proves the defining part and
  one named same-family reconstruction or complete object proves only the
  missing assembly/load path. State which source controls which part and never
  average them.
- **E3 — fragment/component only:** blade, fitting, bezel, sinker, finial,
  mortar half, or other incomplete part. It cannot authorize a complete item
  unless an E2 source proves the missing assembly.
- **E4 — ensemble/depiction only:** necklace, model bearer, relief, full
  character, or laid-out kit. It may prove carrying mode and relationships but
  does not automatically authorize extracting a component, assigning the
  ensemble's chain/strap to it, or generating every visible object.
- **E5 — metadata only / image unavailable:** catalogue text without an
  inspected exact image. Hold. Dimensions and names do not prove hidden joins,
  open mouths, backs, paired counterparts, or icon readability.
- **E6 — source conflict:** material, date, technique, object identity, or
  geometry contradicts the row. Correct and recheck, or reject. Never quietly
  translate gold to bronze, bronze to copper, clay to metal, or a throwing
  stick to a club.
- **E7 — roster/source duplicate:** the same source or macro construction is
  already assigned or rendered. Reuse/reassign existing art or resolve the
  ladder collision before generation. Material swaps and renamed rows do not
  create a new base.

## Evidence traps discovered in Wave 05

- Do not invent dagger grip plates from traces of wood, a ring hoop from a
  bezel fragment, a pestle for a lone mortar, or a matched shoe/glove pair from
  one damaged survivor or two explicitly unmatched objects.
- A small fitting is not a container or standard. A gorytos tip does not prove
  a quiver body, mouth, base, or harness; a socketed finial does not prove a
  pole, grip wrap, banner panel, or warbanner role.
- Grid readability cannot justify inventing a kit. A clay sinker plus a
  separate net does not prove a board-backed trap kit with pegs and retrieval
  coil.
- If the mechanical benefit belongs to bearer technique rather than a visible
  object, it may not deserve an equipment slot. A generic basket balanced on a
  model's head is not automatically a mobility rig.
- Source-defining sacred, solar, royal, or inscribed fields cannot be erased to
  manufacture a blank base, copied when motifs are forbidden, or replaced with
  pseudo-script. Re-source or reject.
- Dedicatory, display, parade, or likely ritual objects need a separately
  approved relic/unique role; completeness alone does not make them ordinary
  vendor weapons or armour.
- Preserve catalogue uncertainty. `Roman (?)`, unknown species, unstated
  casting, and undocumented materials remain uncertain.
- One view is insufficient when identity depends on the reverse, harness,
  open/empty mouth, underside, hidden foot count, back shell, or paired
  counterpart.

## Family-specific source minimums

- **Daggers/swords/axes:** complete blade-to-hilt/haft interface, or E2 bounded
  completion with explicit source roles.
- **Rings:** complete hoop, shoulders, bezel face, profile, and underside.
- **Quivers/gorytoi:** complete body, visibly open empty mouth, base, rear
  strap/harness, and attachment joins. A lid contradicts the current open
  quiver rule.
- **Warbanners/standards:** complete pole/crossbar/panel load path in an object,
  reconstruction, or clear period depiction. A finial alone is insufficient.
- **Paired footwear/handwear:** a matched pair, exact reconstruction with
  defensible left/right pattern evidence, or source character clearly proving
  both counterparts. Never mirror damage or combine unlike objects.
- **Containers/kits:** the complete carried assembly must be visible. Separate
  ingredients or fittings do not become a tidy kit because the grid has room.
