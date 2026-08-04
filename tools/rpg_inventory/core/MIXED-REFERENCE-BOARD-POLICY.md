# Visual Faction Moodboard Policy

This is the durable contract for Image C in the manual web-app wildcard
paperdoll workflow.

## Non-negotiable correction

The moodboard is a visual-direction collage, not an archive page, evidence
catalog, or labeled design document. It must communicate a vivid, coherent
ancient equipment culture at a glance.

Ordinary generated item studies in `assets_staging/` are ineligible. A staged
asset is not an approved visual-direction asset. The builder must reject it
unless Alex explicitly approved that exact image for moodboard use.

Allowed inputs are:

1. approved faction ladder/loadout images;
2. newly researched Pinterest-like references with strong whole-object, complete-kit,
   reconstruction, typology, or ancient-fantasy visual value; and
3. selected complete replicas/reconstructions that strengthen silhouette,
   scale, assembly, or equipment relationships.

Alex-supplied examples normally define the **type and energy of reference to
find**. They are not a ready-made source library and must not simply be copied
into every board. Include an exact pasted example only when Alex explicitly
requests that exact image.

Museum fragments, archival records, and provenance pages remain useful for
verification. They are not the board's default visual language.

## Faction locks

Every curated source must declare one faction lock and one approved historical
cluster. The builder rejects a source stored under another faction, even when
it looks generically "ancient."

- **North:** Nordic Bronze Age and Mycenaean/Aegean Bronze Age.
- **Stonewood:** Mesoamerican obsidian/cotton equipment plus
  Tlingit/Haida cedar-and-hide construction as material-language support.
- **Dustwind:** Scythian/Saka steppe equipment only.
- **Riverspill:** Predynastic/ancient Egyptian and Sumerian/Akkadian equipment.

Concrete exclusions from the failed boards: Mycenaean material never goes into
Dustwind; Persian/steppe cavalry never goes into North; Tibetan/Himalayan
dorje, vajra, ritual axes, and related forms never go into Riverspill.

## Visual composition

- Canvas: `2048x3072`, 2:3 portrait.
- Use an organic collage: irregular scale, overlap, rotation, and edge
  cropping. Do not arrange equal tiles in rows or columns.
- Use two approved ladder/loadout anchors plus six curated visual-direction
  images.
- The bright visual-direction material must occupy at least half the visible
  board area. Ladder anchors ground the faction but must not become two large
  horizontal bands.
- Fill the canvas. Do not reserve empty header, footer, caption, or legend
  areas.
- Visible added text is limited to the faction name.
- Keep provenance, transfer limits, and warnings in the sidecar manifest and
  generation prompt, not on top of the artwork.
- Favor complete characters, equipped kits, comparative families, bright
  reconstructions, readable weapons, and ambitious ARPG-scale silhouettes.

## Authority by scope

1. Prompt-specific Images A and B are the only authority for faction, axis,
   tier, material balance, item membership, construction, ornament density,
   and coherent loadout design.
2. Image C supplies overall faction mood, silhouette breadth,
   equipment-family variety, color separation, heroic ARPG readability, and
   the feeling of a complete equipment culture.
3. Image C is not a parts catalog, material recipe, or source of extra
   paperdoll items.
4. Never average, hybridize, or literally copy objects from Image C.
5. Never import a board-only material, motif, ornament, prestige level,
   manufacturing detail, or unsupported slot.
6. Skip weak slots instead of inventing filler.

The sidecar manifest records every source's narrow `transfer` and
`do_not_transfer` scope. Those rules are for audit and prompt construction;
they are intentionally not rendered as tile labels.

## Source exclusions

Reject:

- unapproved staged item studies, including the previously used bone armor,
  cudgel, mirror, paddle/rod, mitts, and other failed or merely staged assets;
- medieval or later manufacture;
- modern fasteners, machining, molding, polish, or seamless blended joins;
- culture-specific sacred imagery used as generic ornament;
- corrosion, burial damage, or museum lighting treated as faction style;
- unsupported prestige metal on cheap organic items; and
- any source selected merely because it has provenance rather than because it
  contributes strong visual direction.

A reference may contain arrows as historical/equipped context, but generated
game quivers remain open and empty. Arrows are separate inventory items.

## Web-app attachment order

In a fresh image conversation:

1. attach prompt-specific ladder reference A;
2. attach prompt-specific ladder reference B;
3. attach the matching portrait visual moodboard as Image C;
4. paste the wildcard paperdoll prompt verbatim.

The active boards live in `assets_staging/faction-moodboards-v4/`. V1 through
V3 are audit-only and must not be attached to generation requests.
