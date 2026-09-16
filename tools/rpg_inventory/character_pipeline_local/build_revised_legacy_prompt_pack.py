"""Create a private revised prompt pack from user-supplied legacy prompts."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


FAILURE_OVERRIDE = """
KNOWN FAILURE OVERRIDES - THESE RULES TAKE PRECEDENCE

Use one dominant construction family per individual item. A woven, felted,
bark-fiber, quilted, rawhide, or corded-fiber helmet is materially continuous
soft construction with no bronze/brass ornament or reinforcing plates. A metal
helmet is metal-led and may show only narrow functional lining, ties, or
suspension at an edge. Never decorate valuable metal with reed, straw, bast,
wicker, coarse fiber, felt panels, plant-stem stripes, or rod-like crest
filler.

Soft mitts are continuous woven, felted, quilted, or hide handwear reinforced
only by denser weave, quilting, doubled palms, corded seams, or hide wear
patches. Never paste isolated metal, horn, shell, stone, ceramic, glass, or
obsidian rectangles onto a comfortable soft mitten. A true metal gauntlet is a
different family: contiguous articulated metal backhand, knuckle, and hand
construction over a subordinate hidden lining.

Lower-cost organic material may support a valuable hard material mechanically
as hidden lining, padding, suspension, edge binding, grip wrapping, or a
separate garment. It may not serve as exposed prestige decoration, ornamental
stripe, inlay, or crest filler on high-value metal. Brittle mineral belongs
only at a true cutting edge or a tiny protected tool inset, never across
flexible clothing or a joint. Every dissimilar-material interface shows
credible overlap, backing, holes, lacing, rivets, socketing, wrapping, or edge
binding.

Equipment is recently made or actively maintained. Use healthy local material
color, light handling polish, shallow scratches, small repairs, and mild
localized tarnish only. Never copy archaeological corrosion, heavy verdigris,
black crust, burial staining, pitting, encrustation, rotten fiber, missing
material, or all-over distress from a historical reference.

Perspective never excuses a missing structural half. Paired cheek guards, neck
guards, shoulder defenses, straps, mitts, greaves, hinges, and suspension
points require a corresponding hidden side unless purposeful asymmetry is
explicit. A helmet neckguard visibly continues across the back.

Use continuous outer-layer cloth: broad fields, simple folds, sparse pleats,
gores, or at most two large overlapping panels. No shingled cloaks, scale-like
textile tabs, feather rows, lamellar imitation, or repeated dangling panels.

No solar fallback: no sun disks, rayed disks, starbursts, radial spokes,
eight-spoked wheels, halo bosses, winged disks, crescent-stars, or sun-like
rosettes. No spiral motifs. Most surfaces remain plain. Ornament is limited to
one or two small bounded edge, hem, rim, grip, socket, or terminal fields.

Footwear uses one-piece wrapped hide, woven bast/fiber, felt foot bags, simple
thong sandals, or another demonstrably ancient construction with thin flat
hand-cut soles. No welt, molded toe box, sneaker paneling, stacked/rubber-like
sole, modern eyelet, dense machine stitching, or standardized modern last.

Quivers and gorytoi are standalone empty containers: no bow and no arrows.
Slings, when explicitly assigned, show exactly one empty historical hand sling
with one cradle and two cords: no stones, bullets, ammunition pouch, bag, case,
hand, staff, or surrounding kit. Bare swords and daggers have no scabbard or
sheath. Weapons and armor are portrait or square, never landscape; only a true
belt/girdle uses a horizontal canvas.
""".strip()


FEMALE_REPLACEMENT = """
FEMALE STYLING
female is a strikingly beautiful, physically alluring adult with a commanding regal presence — the minimalist warrior-queen aesthetic. Form-fitting, high-cut harnesses; low-slung belts riding the hips; exposed midriff, hips, thighs, or shoulders where the class and band allow; sculptural metal, leather, hide, fiber, and cloth pieces shaped to the body; long lines, dramatic confidence, athletic and desirable physique, flawless believable skin with real texture, sharp expressive eyes fixed on the viewer or the middle distance with total self-possession. Minimal coverage is a deliberate design language, but every single piece must still look defensive and genuinely wearable: straps, ties, knots, buckles, wraps, pins, backing, and lacing must visibly hold every item in place against movement. Bare feet, simple sandals, hide wraps, or low period footwear only — absolutely no high heels. She is powerful, dangerous, and self-possessed; never passive, never fragile, never coy. Her allure comes from confidence, physique, and craft, not from helplessness. The female Warrior uses a sleek, minimally clothed heroic fantasy trope similar to a regal minimalist warrior-queen aesthetic. Use form-fitting high-cut harnesses, low-slung belts, exposed hips and midriff, bare thighs, sculptural metal, leather, hide, fiber, or cloth pieces, and dramatic low-angle confidence. This is minimal armor coverage by design, but it must still look defensive and wearable: straps, ties, knots, buckles, wraps, pins, backing, or lacing must visibly hold every item in place. Bare feet, simple sandals, hide wraps, or low period footwear only. Absolutely no high heels, modern shoes, zippers, latex, plastic, modern fabric, or sci-fi tech. 35mm color film photography with harsh direct on-camera flash, specular highlights on skin and clothing, strong catchlights in eyes, high contrast flash illumination, authentic film grain and color shift, innocent editorial style, intimate first-person low-angle POV shot from below, early 20s sexy adult female idol with ultra-realistic delicate refined features, seductive eyes, flawless realistic porcelain skin with cool ivory undertone and visible flash specular highlights, fine delicate skin texture with subtle pores micro details and natural dewy glow under flash, fresh natural makeup with soft dewy glow, subtle natural flush on cheeks, natural pink lips slightly parted, subtle natural freckles across nose and cheeks, long dark brown hair with some loose strands framing the face and realistic loose strands, seductive natural arched pose, body angled sideways with naturally arched back and hips gently pushed back to accentuate perky round hips and sexy butt curve, one leg naturally extended forward toward the camera and the other leg slightly bent to emphasize long sexy legs, intensely seductive playful yet pitiable doe-eyed gaze straight at the viewer with soft vulnerable longing eyes and a gentle teasing smile full of quiet temptation and desire, harsh direct on-camera flash creating sharp specular highlights and strong catchlights, high contrast film color grading with natural flash look, extremely sharp yet soft skin rendering with authentic 35mm direct flash aesthetic, natural hair strands, no plastic skin, no digital over-sharpening, no airbrushing, no blemishes, no moles, no oily skin, no watermark, no text, authentic 35mm direct flash film look
""".strip()

PIXEL_PROMPT = """Create exactly 10 separate images. No commentary.

Use the attached source image only as visual reference for the ten already
identified inventory items. Produce one independent item file per source item;
never a sheet, grid, collage, contact sheet, or multi-object tile. If ten
separate files cannot be produced, generate only item 1.

For each output, reinterpret the assigned item as an extremely low-resolution
RPG ground-loot sprite whose final readable design fits within 12 x 12 pixels
or less. Use deliberate pixel clusters, a crisp silhouette, one-pixel edge
decisions, a restrained material-local palette, and no antialiased or
high-resolution painted detail. Show the complete item lying naturally on its
side or at a shallow diagonal as dropped loot. Do not shorten handles, crop
tips, add anatomy, or fuse neighboring source objects into it.

Keep one perfectly flat solid matte background shared by every file. No ground,
floor, cast shadow, contact shadow, gradient, texture, scenery, glow, particles,
text, UI, border, rarity frame, or watermark. No repeated sun, starburst,
spiral, emblem, or invented decoration. Preserve the source item's coherent
material family; do not add reeds or felt as decoration on metal and do not
paste hard plates onto soft mitts.
"""


SEPARATOR_PROMPT = """Create exactly 4 separate images. No commentary.

Use the attached four-character source image. Separate the four clearly
observed characters in left-to-right order into four independent full-body
character files. Never create a collage, grid, contact sheet, split frame, or
lineup. If four independent files cannot be produced, generate only the
leftmost character.

Preserve each character's complete silhouette, anatomy, face, equipment,
materials, colors, garment cut, weapon proportions, and construction. Do not
redesign, beautify, upgrade, hybridize, or transfer items between characters.
Reconstruct only portions genuinely hidden by a neighbor, using the visible
character's own bilateral construction and material logic. Do not retain
fragments of adjacent characters. Do not crop hair, headgear, weapons, hems,
hands, or feet.

Render richly detailed realistic dark ancient-fantasy character concepts with
crisp material separation and neutral studio lighting on one flat
neutral-white background. No text, label, UI, border, scenery, floor emphasis,
watermark, or extra person. Reject one-sided helmet parts, hard plates pasted
onto soft mitts, reeds or felt decorating metal, shingled cloaks, modern shoes,
archaeological decay, solar symbols, and invented dangling clutter.
"""


def insert_override(text: str) -> str:
    markers = (
        "\nFINAL AUDIT",
        "\nFINAL VALIDATION",
        "\nBefore rendering, silently audit",
        "\nGenerate exactly seven separate images",
    )
    for marker in markers:
        index = text.find(marker)
        if index != -1:
            return text[:index] + "\n\n" + FAILURE_OVERRIDE + "\n\n" + text[index:]
    return text.rstrip() + "\n\n" + FAILURE_OVERRIDE + "\n"


def revise_human_lineup(text: str) -> str:
    old = (
        "NORTHERN BRONZE HOUSES: ancient cold-region household cultures shaped by severe seasons, woodland, wetland, and coast. "
        "Use insulation, weather resistance, compact joinery, rationed copper/bronze, dark timber, treated hide, layered wool/linen/fiber, "
        "bone fasteners, and rotating natural accents. Avoid medieval northern-warrior shorthand, copied symbols, horned helmets, "
        "and one fixed amber/crystal identity."
    )
    new = (
        "NORTHERN BRONZE HOUSES: clean northern Bronze Age household craft using pale hemmed wool and linen, bright maintained tin bronze, "
        "pale ash or birch wood, polished horn, restrained russet structural hide, and spatially separate madder-crimson, spruce-green, "
        "and golden-ochre woven fields. Avoid medieval northern-warrior shorthand, horned helmets, runes, chainmail, muddy bog palettes, "
        "fur-bikini barbarian costume, and one fixed amber/crystal identity."
    )
    text = text.replace(old, new)
    return insert_override(text)


def revise_pair_prompt(text: str) -> str:
    text = re.sub(
        r"Female styling rule:\r?\n.*?\r?\nMale styling rule:",
        FEMALE_REPLACEMENT + "\n\nMale styling rule:",
        text,
        flags=re.DOTALL,
    )
    return insert_override(text)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(r"C:\Users\Alex\Downloads\last_good_prompts_revised_v2"),
    )
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    sources = {
        "01_item_extraction_dustwind_dex_t1.md": Path(
            r"Z:\Code\WIZARD\tools\rpg_inventory\character_pipeline_local\prompts\FACTION-DUSTWIND-DEX-T1-TWO-REFERENCE-ITEM-EXTRACTION.md"
        ),
        "02_seven_tier_human_lineup.txt": Path(
            r"C:\Users\Alex\.codex\attachments\9a2e0ef0-91d7-4026-8572-1771697231e8\pasted-text.txt"
        ),
        "03_seven_tier_mixed_roster.txt": Path(
            r"C:\Users\Alex\.codex\attachments\cc1724f6-ca60-41e5-9779-b9df6cc06cb8\pasted-text.txt"
        ),
        "04_tier2_paired_calibration.txt": Path(
            r"C:\Users\Alex\.codex\attachments\fc03baf7-c141-44d3-8014-d48fb16d2e20\pasted-text.txt"
        ),
    }

    extraction = sources["01_item_extraction_dustwind_dex_t1.md"].read_text(encoding="utf-8")
    (args.output / "01_item_extraction_dustwind_dex_t1.md").write_text(extraction, encoding="utf-8")

    human = sources["02_seven_tier_human_lineup.txt"].read_text(encoding="utf-8")
    (args.output / "02_seven_tier_human_lineup.txt").write_text(revise_human_lineup(human), encoding="utf-8")

    mixed = sources["03_seven_tier_mixed_roster.txt"].read_text(encoding="utf-8")
    (args.output / "03_seven_tier_mixed_roster.txt").write_text(insert_override(mixed), encoding="utf-8")

    paired = sources["04_tier2_paired_calibration.txt"].read_text(encoding="utf-8")
    (args.output / "04_tier2_paired_calibration.txt").write_text(revise_pair_prompt(paired), encoding="utf-8")

    (args.output / "05_pixel_loot_conversion.txt").write_text(PIXEL_PROMPT, encoding="utf-8")
    (args.output / "06_four_character_separator.txt").write_text(SEPARATOR_PROMPT, encoding="utf-8")
    (args.output / "00_failure_override_block.txt").write_text(FAILURE_OVERRIDE, encoding="utf-8")

    readme = """# Revised last-good prompt pack

This private pack preserves the supplied prompt structures while adding the
current failure taxonomy as a precedence block.

Important review findings:

- The long human-only seven-tier prompt remains the strongest unattended roster
  prompt. Its planning ledger and anti-default budgets are worth retaining.
- The mixed-roster prompt is useful when beasts/nonhumans are wanted, but its
  exclusion ledger and variation key must be edited per run.
- The paired Tier-2 prompt had mutually contradictory camera and character
  direction. The replacement keeps adult warrior-queen allure and direct-flash
  cosplay presentation while removing coy/helpless language, one fixed
  phenotype, and rear-first fetish framing.
- The two short prompts are now explicit about independent files and preserve
  the current material hierarchy.
"""
    (args.output / "README.md").write_text(readme, encoding="utf-8")
    print(f"Wrote revised prompt pack to {args.output}")


if __name__ == "__main__":
    main()
