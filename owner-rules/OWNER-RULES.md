# Owner rules — the ARPG and WIZARD

**Mandatory reading before any work in either repository.** This is the one source of truth
for the owner's standing rules and corrections. Current direct owner instructions override
everything here; this file overrides older documents, specs, handoffs and generators,
including ones that call themselves canonical. Each rule gives its date and one line of
rationale. Domain detail stays in the documents linked under "Domain rule sets"; those
documents must not restate or contradict these rules.

- **Canonical copy:** WIZARD `owner-rules/` (gh-pages). The ARPG carries a synced copy;
  never edit that copy. To add or change a rule, see "Changing a rule" at the end.
- **Enforced by:** `owner-rules/lint.mjs` with `owner-rules/terms.json`, run by WIZARD
  `scripts/wizard-lab.mjs verify` (and CI) and by the ARPG build gate.

## North star

1. **PoE 1's play in PoE 2's visual style, in a more ancient setting** (2026-10-26). Reach
   parity with Path of Exile 1's gameplay, rendered like Path of Exile 2, before building
   differentiating systems. *Why:* the owner wants the proven baseline first.
2. **D2/PoE-style flow with somewhat more active decisions** (2026-09-16). Ordinary packs are
   quick; bosses get committed, telegraphed slams. *Why:* no slow duels, no standing around
   waiting to be hit.
3. **Animation and movement must not feel sped up** (2026-10-26). No comically fast moves or
   attacks and no skipped frames; benchmark timing against PoE 1/2, not snappiness. *Why:*
   the owner's counter-example is PoE 1's soul eaters; earlier work sped animations up.
4. **Unity is the production engine** (2026-09-16). Older C++-only and browser-migration
   plans are history; WIZARD tools remain reference implementations and sources. *Why:* the
   owner moved production to Unity.

## Language and naming

5. **Plain combat terms** (2026-09-21). Physical, Fire, Cold, Lightning, Chaos; ailments
   Bleed, Poison, Ignite, Chill, Freeze, Shock, Wither. Never Ember, River, Storm, Gloam,
   Scald, Numb or Jolt as game terms. Old IDs may stay as hidden compatibility keys.
   *Why:* the owner rejected invented resistance names; players know the PoE vocabulary.
6. **No invented setting vocabulary or lore** (2026-09-10, 2026-09-16, 2026-10-26). No
   invented cultures, sagas, oaths, gods, years, flavour sentences, epithets, branded
   synonyms or "Weathering"-style cosmology; generic only. *Why:* "I hate this naming
   scheme that ai forces … trying to invent lore"; "do not invent lore and 'branding'".
7. **No invented compound coinages** (2026-10-26). No two nouns mashed into a fantasy name
   (Emberguard, Vesselforge, Skymetal, Nightblade, Warcall; X-guard, X-forge, X-ward,
   X-bound, X-born, X-kiss, X-tithe, -weave, -shard, -sworn, -kin, -fall, -mark, -call,
   -blade). *Why:* "same applies to cringey composite terms like 'emberguard'".
8. **Name things by what they are or do** (2026-10-26). Small passives by their stat; other
   passives, jewels and items by their effect or material and form; tools by their function
   ("Inventory and Item Crafting", "Spell Effects Lab"); maps by real terrain or
   architecture ("Temple", "Cold River", "Canyon"). *Why:* names must not obscure the
   mechanic or dress up a tool.
9. **Do not fill creative gaps** (2026-09-16). No new lore, gameplay rules, aesthetic
   changes or user flows to fill a gap; disclose assumptions and ask only when sources and
   instructions do not resolve a necessary choice. *Why:* generated "canon" crept in and had
   to be removed.
10. **No unrequested flourish in UI copy** (2026-09-10). Functional names, direct labels,
    concise descriptions; make prototype limits explicit instead of fictional. *Why:* the
    owner rejects decorative copy across the projects.
11. **Literal objects are fine** (2026-09-21). Real rivers, weather, embers in a fire, the
    owner's ember-in-a-bowl concept, kilns and river pearls stay; the rule targets invented
    terms, not plain words. *Why:* a terminology fix must not rename the world.

## Setting and era

12. **Bronze Age and earlier** (2026-09-16, 2026-10-26). Stone, flint, obsidian, bone, horn,
    wood, copper and bronze, hide, linen, wool, clay, faience, reed; writing is clay tablets
    and seals. No iron or steel, books, scrolls, paper, glass, lanterns, candles, coins, plate
    armour, closed or crested helmets, longswords, crossbows or later objects in tree text
    and icons. *Why:* "pre-iron age. No 'iron taste' skill, no books and high tech".
    Open owner questions: item art may still use meteorite-sourced "Hammered Iron"
    (2026-10-02 ruling), and the Ritualist's "Reliquary" pack (an inventory item name used
    by the protected item prompt) is unrenamed, until the owner settles them.
13. **No pentagram, hexagram, heptagram, pentacle or rune-glyph decoration** (2026-10-16) in
    effects, HUD, items or props; use rings, ticks, dots, light and material. Real runes come
    later through the spell lattice as a system. *Why:* they read as medieval fantasy.
14. **New places are proposals until approved** (2026-10-01). Test-slice stand-ins (pasture,
    slate village, rock-cut cellars) are not canon. *Why:* the owner invited new location
    ideas, not extension of placeholders.

## Visual direction

15. **Full 3D with the owner-ruled camera** (2026-09-30). Pitch about 62°, moderate
    perspective, axis-aligned (not diamond isometric); characters, creatures and world are
    real 3D from the existing Blender sources. *Why:* "more top down … like Diablo and Path
    of Exile … go full 3D now".
16. **Pixel-art presentation is retired** (2026-09-28). Native resolution, filtered and
    mipmapped surfaces, a post stack; no mixels or resampled sprites. *Why:* the
    "frankenstein" look; the owner prioritises the game looking and feeling good.
17. **Lighting is material-driven, like PoE** (2026-10-02). Real normals, roughness and
    specular, contact shadows, restrained fill; emission only for real light sources; crisp,
    detailed ground (wetness, texture, pebbles) (2026-10-26). *Why:* "everything looks …
    100% self-illumination"; the ground looked "muddy, blurry, cartoony".
18. **Generic, calm, reusable assets** (2026-10-02). Ordinary base assets with natural
    variation, not noisy landmarks or stamped repeats. *Why:* "more generic assets that can
    be repeated a lot without looking stamped".
19. **Generated art must not look generated** (2026-10-26). Smooth matte painting, large
    calm shapes, no fractal noise, particle storms, pseudo-text or glow halos; check the
    noise gate. *Why:* the image model's noise texture is a visible AI giveaway.
20. **Placeholders are first-pass only** (2026-09-25). When revisiting an area, fix obvious
    placeholder geometry, materials, UI and effects in it, or name the dependency that
    blocks it. *Why:* placeholders survived repeated passes beside polished elements.
21. **"Quick slice" limits scope, not quality** (2026-09-16). Fewer complete elements at the
    agreed standard; "plain starter" means equipment, not crude art. *Why:* scope cuts were
    used to lower fidelity.
22. **Scenery rules** (2026-09-20). Luminous crystals belong in caves, not built dungeons
    (use clay lamps); jugs, timbers and rocks are separate assets placed by recipe, never
    fused installations. *Why:* location fit and reusable, independently grounded pieces.

## Assets, sourcing and generation

23. **Read the sources before building or generating** (2026-09-16). Follow references into
    the actual documents, prompts, models and implementations; record what was inspected
    and reused. A historical artifact's existence is not approval. *Why:* work was justified
    after the fact from summaries and filenames.
24. **Reuse before paid generation** (2026-10-03). Use suitable existing and free assets
    (graphics, sound, music, scripts) before Meshy or image credits; check licenses and fit.
    *Why:* "before we use up all meshy credits".
25. **Item art comes from WIZARD's inventory pipeline** (2026-09-30). Use its protected
    prompt, process and accepted finals; in-repo test items (round Stone Maul, bronze-scale
    vest image) were never meant to ship. *Why:* stray test art reached the game.
26. **Unapproved generated art is not a source** (2026-09-17). Do not extend rejected or
    unreviewed weapon images or sprites; a passing test or import is not approval. *Why:*
    "looks bad and wastes generation credits".
27. **Generate once, then judge** (2026-07-06). One attempt per item per run; never re-roll
    the same concept on failure; QA every result before staging; drop items the model cannot
    render. *Why:* image quota is scarce and re-rolls wasted it.
28. **Prompt realism, not "pixel art"** (2026-09-20). Lead prompts with rendered form,
    believable proportions and real materials. *Why:* "pixel art" pushed output toward
    chibi.
29. **Pipelines fit the asset** (2026-09-17). Blender guides are for characters and world
    assets that need pose consistency, not UI icons. *Why:* the owner challenged bespoke
    Blender scripts for one icon.
30. **Preserve originals and provenance** (2026-09-16). Keep originals, licenses, submitted
    prompts and settings; keep candidate, rejected, imported and verified states distinct.
    *Why:* rejected assets reached the game without disclosure.

## Game decisions that stand

Details and implementation notes live in ARPG `the ARPG/Documentation/DESIGN-DIRECTION.md`.

31. **Same effects never stack; the strongest applies** (2026-10-14). *Why:* PoE's rule.
32. **Server-authoritative loot in connected play** (2026-10-14). *Why:* clients must never
    decide drops or rolls.
33. **Ground telegraphs only for big slams, deadly spells and boss abilities** (2026-10-14).
    *Why:* basic attacks read from the body's wind-up.
34. **PoE 1-style life recovery: flask, slow regen, out-of-combat regen; no D2 potions**
    (2026-10-14). *Why:* the game had no recovery loop.
35. **No damage numbers over characters or monsters** (2026-09-17). *Why:* owner HUD
    direction.
36. **Dodge is an active roll on Space; passive evasion stays separate** (2026-09-17).
    *Why:* direct owner decision.
37. **Reuse the WIZARD inventory and passive tree as the interface references**
    (2026-09-16). Do not replace them with lists, blank panes or a new design. *Why:* they
    are the established, owner-reviewed systems.

## How to work

38. **Finish routine work yourself** (2026-07-06). Run builders, tests and refreshes before
    handing off; label any command already run and its result. *Why:* the owner should not
    receive commands the agent could run.
39. **Smallest meaningful check, once** (2026-10-03). Reuse passing results for unchanged
    inputs; prefer one short playthrough of the real loop over staged fixture suites
    (2026-10-14). *Why:* verification overhead slowed delivery; 407 GB of evidence still
    missed that the game had no life recovery.
40. **Evidence stays disposable** (2026-10-14). QA captures and builds go in ignored
    `output/`; no baselines or capture packets in `Documentation/` or `ArtSource/`; run
    `tools/hygiene.sh` (ARPG) before shipping. *Why:* the 407 GB evidence pile.
41. **Commit and push what you ship** (2026-10-26). Never leave an owner-requested
    correction as uncommitted edits; a fix exists only once it is committed in the source of
    record (and, for WIZARD, pushed to gh-pages). *Why:* the September 21 terminology fix sat
    uncommitted for five weeks while the live site kept the old words.
42. **Fix causes at the source and apply corrections everywhere** (2026-09-16). Generators,
    prompts, exports, docs and runtime together; validate at the level of the request (native
    size, in motion, in game). *Why:* symptom patches let rejected wording and art return.
43. **One current handoff** (2026-09-21). The top of ARPG `the ARPG/Documentation/TODAY.md`
    holds task, branch, local versus published state and next action. *Why:* competing
    summaries drifted.
44. **Delegate bounded side work; keep uncertainty local** (2026-09-17). Use subagents for
    long independent work with the relevant rules in the brief; do not stop unrelated work
    over one open question. *Why:* explicit owner requests.
45. **Be concise and direct** (2026-07-06). Do the work; don't over-ask, over-explain or
    grovel. *Why:* owner preference.
46. **Release media stays current** (2026-09-19). 4–7 feature screenshots and short GIFs in
    the ARPG README, refreshed when updates ship; never promotional art for unbuilt features.
    *Why:* visible, honest progress.

## Domain rule sets

These hold detailed, domain-specific requirements and must open by pointing here:

- ARPG `the ARPG/Documentation/DESIGN-DIRECTION.md`: game design decisions and their history.
- ARPG `.claude/skills/passive-icon-art/`: passive icon art (variety, noise gate, era props).
- WIZARD `tools/rpg_inventory/AGENTS.md`: item-art pipeline, factions, prompt and QA rules.
- WIZARD `tools/wizard_orbs/AGENTS.md` and `CLAUDE.md`: orb shader and mask invariants.
- WIZARD `tools/geometric_skilltree/NAMING.md` and root `NAMING.md`: rename records.

## Changing a rule

1. Edit `owner-rules/OWNER-RULES.md` (and `terms.json` if the lint should enforce it) in
   WIZARD only. Give the date, the owner's words where available and one line of why.
2. Run `node owner-rules/lint.mjs wizard` and `node scripts/wizard-lab.mjs verify`, commit,
   and push to gh-pages.
3. In the ARPG, run `node tools/sync-owner-rules.mjs` and commit the updated copy. The ARPG
   gate fails while its copy differs from the published one or has been edited locally.
4. Remove any older wording of the same rule from AGENTS.md, CLAUDE.md, skills or docs;
   those files point here instead of repeating rules.
