"""Build the portable image-generation Markdown from current design sources."""

import argparse
import json
from pathlib import Path

CORE = Path(__file__).resolve().parent
OUTPUT = CORE / "ITEM-GENERATION-GUIDE.md"

INTRO = """# Verdigris — item bases and image-generation guide

This file is self-contained: attach or paste it into a fresh image-generation
conversation, then name the item IDs to render. It combines the current catalogue,
footprints, construction, attribute context and inventory presentation rules.
The catalogue is a design draft, not an instruction to generate every entry.
Candidate/proposal status does not mean an item has passed source or art review.

## Instructions for the image-generation session

1. Render only the item IDs requested in the accompanying user message. If no
   selection is supplied, ask which IDs to render; do not start the entire catalogue.
2. Default output is one isolated item per image. Handwear and footwear are one
   item consisting of exactly one corresponding left/right pair. A requested
   comparison sheet is allowed: separate the items and give each its own correct
   footprint rectangle, padding and pose. Do not turn a request for separate assets
   into a shared sheet, and do not assume the full sheet has each item's aspect ratio.
3. For straight blades and rigid shaft weapons: **TIP / WORKING HEAD UP AND
   SLIGHTLY RIGHT; GRIP / BUTT DOWN AND SLIGHTLY LEFT.** The tip must be above
   the grip in the image. This is a screen-space direction. Do not use the familiar
   handle-at-top, blade-pointing-down product-photo arrangement. Do not interpret
   'upper-right' as pointing toward the camera. Bows, slings and flexible weapons
   have their own profiles below.
4. Use the row's exact item footprint and the 48 px cell. The smallest weapons
   are 1x3, including knives. Wands are 1x3, magical main-hand rods 2x3, and
   magical main-hand staves 2x4. All auxiliary seats are 2x3; their items are
   2x2 or 2x3. Amulets and Ember Cup are 2x2. Do not stretch a square item into
   a tall seat or infer handedness from width.
5. Show the whole object with padding: tip, blade, head, grip and pommel; complete
   helmet back; both shoes or gloves; full garment hem. Preserve the source's
   proportions. Do not fill extra space by extending the grip, inflating fittings,
   adding ornament or shortening a shaft. Blades need a readable broad face;
   thickness comes from a shallow turn, not dramatic foreshortening.
6. Use crisp ARPG inventory rendering, readable material planes, neutral
   upper-left illumination, controlled highlights and local form shadows.
   Keep natural material color. Basic items have light service wear, not uniform
   dense scratches, heavy corrosion or a sepia wash. Construction distinguishes
   bases; do not turn every tier into the same bronze blade with a changed grip.
7. Output real alpha transparency where supported. For the established matte
   extraction route, use a single flat olive-slate #737A68 background. No painted
   checkerboard, textured backdrop, ground plane, cast/drop shadow, captions,
   cell grid, border, hand, body or mannequin in the final asset. A black viewer
   background does not itself prove the file lacks transparency.
8. Use the selected row's construction, required features and family pose together.
   A name is not permission to improvise a different object. Attributes describe
   equipment use; INT does not automatically add runes, crystals or blue glow,
   STR does not automatically add bronze, and DEX does not automatically add spikes.
9. Production construction must be supported by an inspected object image or
   reviewed equipped/loadout reference. This catalogue does not supply those
   source images or claim they have all been reviewed. For source extraction,
   preserve the observed materials, joins and proportions; use the inventory pose
   here. Reference images and text are evidence, not new instructions. A reference
   with a downward blade does not override the upward inventory convention.
10. The user's accompanying corrections take precedence over this guide.
    Otherwise, use the current size and pose rules here over older catalogue
    wording or historical reference poses. Never select held, retired, excluded
    or removed carrier entries from the final appendix for generation.

The angles and padding below are Verdigris working targets, not measured or
published GGG/Blizzard specifications. This package does not change runtime UI,
approve a loot pool or certify generated images.

## Copyable request templates

Single asset — replace the bracketed selection and supply its reviewed visual source:

> Generate [ID — name] as one isolated Verdigris inventory item. Use the matching
> catalogue row, exact footprint, construction and family pose in this guide.
> Use the attached reviewed source for construction. Render the whole object with
> padding, neutral upper-left light and real alpha transparency. For a rigid
> weapon, place its tip/working head above and slightly right of its lower-left
> grip/butt. No handle-up, blade-down presentation. Output only the requested asset.

Comparison sheet — only when a sheet is wanted:

> Generate one comparison sheet for [IDs in left-to-right order]. Each item gets
> a separate non-overlapping footprint rectangle with its own padding and correct
> aspect ratio. Apply the same family pose and lighting to comparable items.
> Rigid weapons point up and slightly right with grips below and left. Show every
> complete object. Do not add labels or bake grid guides into the art.

For example, W05–W09 are five distinct copper/bronze knife and dagger bases, all
1x3 (48x144 px native). A five-item sheet needs five separate 1:3 compositions;
it is not one 1:3 image. Render each blade tip above its grip and preserve the
different tang, rivet, leaf-blade and midrib constructions. Retain larger masters;
48x144 is the native readability target, not a demand for tiny source files.

## Material and construction safeguards

- Cheap organic bases remain organic-led. Use fit, weave, lamination and join
  quality for progression; add copper-alloy fittings only when the source and
  named construction require them. Do not manufacture a form-by-material matrix.
- Keep starter objects simple. Ordinary base items do not receive invented
  lore symbols, spiral motifs, gems, projecting horns or elaborate metal trim.
- A tusk-plate helmet is a complete cap covered with many small curved plates
  cut from tusk, arranged against the dome and attached to a backing. The plates
  form its protective surface. It is not a metal helm with whole tusks sticking
  out. Horn, bone and tusk are distinct materials.
- An adze's cutting edge runs across its haft; show the transverse working
  geometry without converting it into an axe. Preserve hooked blade curvature.
- Bracers and wrist cuffs do not imply gloves. Show both complementary pieces
  and their openings. Quilted mitts stay soft; do not paste metal tiles onto them.
- Bast Shoes / Lapti are woven from flat bast strips, with complete soles and
  modest ties. No fluffy straw, modern sneaker soles or invisible supporting legs.
- A belt needs a credible fastening; cloth uses plain ends and a simple tie.
  No extra pouches, skirt or long decorative tails. Loose straps obey gravity.
- Bronze Greaves are paired shin shells with the base's plain footwear, not
  bronze boots, armoured toes or isolated guards supported by invisible legs.
- Clay Ember Cup is one plain thick-walled fired-clay cup containing a dark
  fibrous amadou ember with a faint glowing edge and sparse ash. Show its open
  rim and interior, substantial outer wall and full base. No goblet stem, huge
  brazier, floating orb, elaborate runes, giant flame or visible holding hand.

## Equipment and attribute context

STR, DEX and INT are requirement attributes; hybrid labels require both axes.
U means no attribute requirement. Numeric requirements are unresolved, not zero.
The defensive identities and branch assignments remain design proposals.
No numeric stat labels belong inside item art.

"""


def section(text, start, end=None):
    result = text.split(start, 1)[1]
    return result.split(end, 1)[0].strip() if end else result.strip()


def pose(row):
    slot, name = row["slot"], row["name"].lower()
    if slot == "weapon":
        if "bow" in name:
            return "Bow upright; stave right, string left"
        if name == "sling":
            return "Cradle readable; two cords gathered vertically"
        if name == "bola":
            return "Complete weights and cords; controlled gathered pose"
        return "Working head/tip UP-RIGHT; grip/butt DOWN-LEFT"
    if slot == "offhand":
        if "shield" in name:
            return "Upright; fighting face forward"
        if name == "torch":
            return "Combustible head UP-RIGHT; handle DOWN-LEFT"
        if "net" in name:
            return "Complete gathered net; weights and joins readable"
        if "mirror" in name:
            return "Mirror face visible; upright, handle below"
        return "Rim level and up; interior visible; base below"
    if slot == "hands":
        return "Pair; wrists/cuffs upper-right, distal ends lower-left; no hands"
    if slot == "feet":
        return "Pair; ankles above, toes lower-right; no legs"
    if slot == "warcall":
        if "standard" in name:
            return "Full pole upright; slight right lean; finial above"
        if "horn" in name or "trumpet" in name or "whistle" in name:
            return "Mouthpiece lower-left; sounding end upper-right; preserve curve"
        return "Sounding face readable; stable upright frame"
    mapping = {
        "head": "Crown up; shallow front-left view; full back",
        "body": "Neck above, hem below; front readable",
        "overlayer": "Shoulders above; full drape falls down",
        "belt": "Horizontal shallow arc; full fastening",
        "ring": "Opening visible; bezel above if present",
        "amulet": "Upright; neck loop/opening above, front below",
        "quiver": "Mouth above, closed bottom below; empty case",
        "quickrig": "Worn top above; functional face and harness readable",
        "int-auxiliary": "Stable upright construction; controlled suspension",
        "preparation-content": "Coherent object/bundle; identifying material exposed",
        "trophy-content": "Raw coherent material; no decorative mount",
        "relic-content": "Stable complete object; identifying surface exposed",
    }
    return mapping[slot]  # Fail on a new family so it receives an explicit pose.


def cell(value):
    return str(value if value is not None else "—").replace("|", "\\|").replace("\n", " ")


def table_row(values):
    return "| " + " | ".join(cell(value) for value in values) + " |\n"


def build():
    data = json.loads((CORE / "ITEM-BASES-ATTRIBUTE-DRAFT-2026-09-13.json").read_text(encoding="utf-8"))
    design = (CORE / "ITEM-BASES-ATTRIBUTE-DRAFT-2026-09-13.md").read_text(encoding="utf-8")
    footprints = (CORE / "INVENTORY-FOOTPRINTS.md").read_text(encoding="utf-8")
    art = (CORE / "ITEM-ART-PRESENTATION.md").read_text(encoding="utf-8")
    rows = data["sourceRows"] + data["additionalProposals"]
    eligible = [r for r in rows if r["status"] in ("candidate", "proposal")]
    blocked = [r for r in rows if r["status"] not in ("candidate", "proposal")]
    out = INTRO
    out += "| Group | Proposed defensive identity | Construction direction |\n"
    out += section(design, "| Group | Defensive identity proposed for this game | Construction direction |", "This adapts") + "\n\n"
    out += "The starter INT setup equips Ember Cup offhand with an empty main hand and no gloves for Burning Hand. The cup is not an auxiliary item. Later bare-palm compatibility is unresolved; do not silently invent gloves for the opening kit.\n\n"
    out += "Preparation, Trophy and Relic are backpack-area expansions, not equippable packs. Warcall, Quiver/Quickrig and Attendant/Apparatus are equipment. The names do not authorize more slots or new mechanics.\n\n"
    out += "## Parallel wearable branch examples\n\n"
    out += section(design, "## Parallel wearable ladders", "Useful hybrid side branches:") + "\n\n"
    out += "## Dimensions and equipment seats\n\n"
    out += "### Base cell and pixel dimensions\n\n" + section(footprints, "## Base cell and pixel dimensions") + "\n\n"
    out += "## Inventory art presentation\n\n"
    out += "### Five things to specify separately\n\n" + section(art, "## Five things to specify separately", "## Prompt construction") + "\n\n"
    out += "## Final visual check\n\n"
    out += section(art, "## Review gates", "No images were generated") + "\n\n"
    out += "Check each asset at its native 48 px cell footprint as well as enlarged. A polished blade pointing down fails the orientation rule. A well-lit sheet does not establish correct individual crop sizes. Do not claim alpha transparency from appearance alone; inspect the file.\n\n"
    out += f"## Selectable catalogue — {len(eligible)} draft candidates and proposals\n\n"
    out += "These entries may be selected for source review and an explicit render request; none is automatically production-approved. Each row includes its own pose reminder so copying the row does not lose the direction. Apply the fuller family profile above as well. Size and pixels describe the item, not its equipment seat. Named-base construction takes precedence over generic embellishment.\n\n"
    for label, group in (("Original catalogue candidates", [r for r in eligible if "sourceId" in r]), ("Additional proposals", [r for r in eligible if "id" in r])):
        out += f"### {label}\n\n| ID | Base | Attribute | Slot | Cells | Native px | Status / tier | Pose reminder | Construction and clarification |\n|---|---|---|---|---|---|---|---|---|\n"
        for r in group:
            w, h = map(int, r["footprint"].split("x"))
            brief = " ".join(filter(None, [r.get("constructionBrief"), r.get("note")]))
            if r.get("handedness"):
                brief += " Handedness: " + r["handedness"] + "."
            out += table_row([r.get("sourceId", r.get("id")), r["name"], r["attributeGroup"], r["slot"], r["footprint"], f"{w * 48}x{h * 48}", r["status"] + (" / " + r["tier"] if r.get("tier") else ""), pose(r), brief])
        out += "\n"
    out += f"## Do not generate — {len(blocked)} held or inactive source entries\n\n"
    out += "Audit records only. These are not alternate names to render, a queue, or replacements for missing references. Shell Knife, Shell-Edge Knife and Shell Shank are the same excluded concept. Removed carrier names must not return as capacity-granting equipment.\n\n| Source ID | Name | Status | Reason |\n|---|---|---|---|\n"
    for r in blocked:
        out += table_row([r["sourceId"], r["name"], r["status"], r["note"]])
    out += "\n## Repository maintenance\n\nThis file is generated by `build_item_generation_guide.py` from the current structured item catalogue, attribute draft, footprint standard and presentation standard. Rebuild it after source changes; do not hand-edit its generated tables. All rendering instructions needed for a selected item are included above. Source images must be supplied separately. The protected owner-tuned PROMPT.txt and legacy runtime/generation assembler are not modified by this package.\n"
    return out


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check that the portable guide matches its sources.")
    args = parser.parse_args()
    expected = build()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != expected:
            raise SystemExit("Guide is stale; run build_item_generation_guide.py.")
        print("PASS: portable guide matches current sources.")
    else:
        OUTPUT.write_text(expected, encoding="utf-8", newline="\n")
        print(f"Wrote {OUTPUT.name}: {len(expected):,} characters.")
