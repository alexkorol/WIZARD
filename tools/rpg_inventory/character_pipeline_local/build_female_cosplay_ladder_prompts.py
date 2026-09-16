"""Build private image-generation prompts for the 40 Verdigris ladder concepts.

The generated prompts are intentionally written outside the public repository.
They are single-image, text-to-image prompts for adult female cosplay-style
character concepts that can later support item extraction.
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


FACTIONS = {
    "faction_north": {
        "name": "Northern Bronze Houses",
        "body": "a northern adult woman with a strong, weather-capable athletic build; vary complexion, hair color, facial structure, and age within adulthood rather than repeating one model",
        "craft": (
            "clean northern Bronze Age craft: pale hemmed wool and linen, bright maintained tin bronze, "
            "pale ash or birch wood, polished horn, restrained russet hide, and spatially separate madder-crimson, "
            "spruce-green, and golden-ochre woven fields"
        ),
        "avoid": (
            "no medieval Viking shorthand, horned helmet, runes, chainmail, muddy bog palette, fur bikini, "
            "all-over amber, or dark survival-costume monotony"
        ),
    },
    "faction_stonewood": {
        "name": "Cedar-Obsidian Clans",
        "body": "an adult woman with a compact, powerful, agile build and warm copper-brown, red-ochre, or sun-weathered complexion; vary features and hair construction across the ladder",
        "craft": (
            "cedar grain, bark cloth, woven plant fiber, rawhide engineering, shell white, warm copper, "
            "greenstone used sparingly, mineral red, and neutral-black obsidian used only for true cutting edges or protected tool insets"
        ),
        "avoid": (
            "no copied sacred regalia, carnival feather overload, generic tribal costume, turquoise monoculture, "
            "stone tiles woven into clothing, or obsidian plates across flexible joints"
        ),
    },
    "faction_dustwind": {
        "name": "Silkroad Plateau Nomads",
        "body": "an adult woman with a lean, rangy, high-altitude athletic build and golden-olive, warm tan, or sun-browned complexion; vary features, hair, and stature across the ladder",
        "craft": (
            "luminous felt, wool, linen, cord-tension construction, flexible hide, portable bronze or brass, "
            "neutral-black lacquered wood, warm sand, saffron, deep mulberry, crimson, off-white wool, and restrained carnelian"
        ),
        "avoid": (
            "no orientalist palace costume, generic belly dancer, random turban, riding stereotype, blue-stone identity, "
            "tassel curtain, or soft felt object decorated with isolated brass rectangles"
        ),
    },
    "faction_riverspill": {
        "name": "Nile-Ziggurat Kingdoms",
        "body": "an adult woman with a statuesque, grounded build and deep bronze, dark copper, warm umber, or polished dark-brown complexion; vary features, hair, and stature across the ladder",
        "craft": (
            "brilliant white linen, healthy bright bronze and restrained brass, neutral-black structural hide, "
            "carnelian, malachite or green faience used sparingly, polished timber, and organized river-workshop construction; "
            "reed belongs only in separate woven objects, backing, or functional suspension"
        ),
        "avoid": (
            "no pharaoh costume, copied sacred imagery, readable hieroglyphs or cuneiform, universal blue-and-gold ceremony, "
            "reed decoration on bronze, solar disks, winged disks, or palace-regalia overload"
        ),
    },
}


ASSIGNMENTS = {
    ("STR", 1): (
        "a grounded close-fighting guard whose power comes from stance, leverage, and one compact impact or chopping weapon",
        "simple torso defense with honest coverage, a small non-round defense, soft continuous hand protection, and low ancient footwear",
    ),
    ("STR", 2): (
        "a trained line-breaker with one unusual short-handled axe-adze, mace-adze, war club, or heavy short blade",
        "professional structured armor with a coherent helmet or war cap, a load-bearing horizontal belt, and purposeful leg protection",
    ),
    ("STR", 3): (
        "a commanding champion with a masterfully balanced compact heavy weapon and a distinctive ancient shield silhouette",
        "the faction's finest mundane structured protection, clear side-and-back coverage, and authoritative but restrained workmanship",
    ),
    ("DEX", 1): (
        "a low-snag skirmisher using a compact throwing stick, hand axe, short club, or other simple quick-access weapon; no bow or sling",
        "light fitted layers, materially continuous soft mitts or wraps, unobstructed joints, and no dangling ornaments",
    ),
    ("DEX", 2): (
        "a trained mobile fighter using exactly one short blade, compact tool, hooked hand weapon, or small asymmetric defense",
        "articulated low-bulk protection, secure load placement, quiet construction, and a silhouette that stays clear around elbows and knees",
    ),
    ("DEX", 3): (
        "an elite duelist or infiltrator using exactly one rare compact weapon family such as a guarded claw, chakram-like hand weapon, ring-pommel blade, or short axe-adze",
        "refined close-fitted equipment with precise edge treatment and zero snag-prone costume clutter",
    ),
    ("INT", 1): (
        "a practical ritual technician or field scholar whose primary readable object is a lamp, mirror, handled vessel, rattle, spindle, or measured tool",
        "simple structured clothing, a materially continuous cap or wrap, soft hand protection, and a compact preparation case",
    ),
    ("INT", 2): (
        "a trained battle-ritual specialist using a compact double-ended pronged implement, hand bell, sistrum-like rattle, handled tablet, or framed focus",
        "organized layered protection, one clear functional implement, and no robe-caste or staff-and-orb silhouette",
    ),
    ("INT", 3): (
        "an authoritative master of controlled ritual craft using one substantial ancient instrument, reliquary vessel, balance, mirror frame, or compact ceremonial weapon",
        "precise high-value construction with bounded detail, visible function, and no magical glow or generic crystal centerpiece",
    ),
    ("MISC", None): (
        "a culturally specific expedition leader, craft specialist, signaler, porter, healer, quartermaster, or relic keeper chosen to expose an underrepresented equipment family",
        "one readable auxiliary object such as a compact war-call, worn quick rig, preparation roll, reliquary vessel, or raw-material carrier, plus a practical travel loadout",
    ),
}


TIER_RULES = {
    1: (
        "Tier 1 is inexpensive but desirable and functional: few components, simple seams, one clear tactical solution, "
        "almost no ornament, and active-service maintenance. Do not turn low tier into dirt, rags, decay, or helplessness."
    ),
    2: (
        "Tier 2 is the professional production baseline: coherent full loadout, better fit, purposeful reinforcement, "
        "several readable components, and restrained color. It is neither starter scrap nor elite parade gear."
    ),
    3: (
        "Tier 3 is the finest mundane starter-tier craft: commanding fit, coverage, balance, cleaner joins, and richer bounded dyes. "
        "Complexity comes from construction, not all-over engraving, jewels, filigree, or impossible material mixtures."
    ),
    None: (
        "This Misc concept is practical culture-bearing equipment rather than an automatic apex. Pick a believable investment level "
        "and make the auxiliary object unusually readable without turning the whole costume into regalia."
    ),
}


EXACT_LOADOUTS = {
    ("faction_north", "STR", 1): "pale linen tunic; continuous quilted wool corselet; plain russet hide waist belt; bare wrists with narrow wool wraps; one-piece wrapped-hide shoes; short spruce-green rectangular mantle; one compact ash-wood war club; no headgear",
    ("faction_north", "STR", 2): "pale linen tunic; one solid hammered bronze pectoral supported by broad russet hide shoulder straps; plain russet hide waist belt; continuous hide wrist wraps; simple thong sandals with thin hide soles; broad madder wool mantle; one short bronze axe-adze on an ash haft; one plain all-bronze bowl helmet",
    ("faction_north", "STR", 3): "pale linen underdress; metal-led articulated bronze torso plates with complete side and back coverage; true contiguous bronze half-gauntlets; solid bronze cheekpiece helmet; simple flat hide sandals; full spruce-green wool mantle; one compact bronze mace-adze; one pale-hide oval shield",
    ("faction_north", "DEX", 1): "pale linen short tunic and close wool leggings; continuous russet hide vest; bare hands with narrow linen wrist wraps; woven bast shoes; short golden-ochre shoulder cloth; one carved ash throwing club; no helmet",
    ("faction_north", "DEX", 2): "pale linen fitted tunic; continuous russet hide corselet with simple hand-cut edge; bare hands and short hide cuffs ending before the palm; one-piece wrapped-hide shoes; tailored madder half-mantle; one narrow bronze ring-pommel short blade; no shield",
    ("faction_north", "DEX", 3): "bone-white linen layers; a metal-led field of small bronze scales on hidden lining with clean side closure; bare hands with narrow wool wrist bands; simple thong sandals; short spruce wool cloak; one compact bronze guarded claw weapon; no helmet",
    ("faction_north", "INT", 1): "pale linen wrap dress; continuous thick felt vest; all-wool folded cap with corded seams; bare hands with linen wrist wraps; woven bast shoes; one handled polished-horn mirror in an ash frame; one small belt-mounted linen preparation roll",
    ("faction_north", "INT", 2): "bone-white linen tunic; structured wool over-vest; all-felt pointed cap with no hard parts; bare wrists; wrapped-hide shoes; rectangular madder mantle; one compact bronze hand bell with a clean horn grip",
    ("faction_north", "INT", 3): "pale linen and spruce wool formal layers; one solid bronze pectoral over the separate textile body; true bronze wrist cuffs ending before the hand; simple sandals; full golden-ochre mantle; one substantial framed bronze balance focus; no helmet",
    ("faction_north", "MISC", None): "pale linen travel tunic; continuous russet hide pack harness carrying a rolled wool blanket and horn signal instrument on the flank; bare hands; wrapped-hide shoes; broad spruce mantle; no weapon and no helmet",

    ("faction_stonewood", "STR", 1): "cedar-bark cloth tunic; continuous rawhide torso guard; woven-fiber waist belt; bare hands with fiber wrist wraps; woven bast sandals; short cedar-fiber mantle; one solid carved cedar war club; no metal and no helmet",
    ("faction_stonewood", "STR", 2): "mineral-red woven tunic; one broad solid hammered copper pectoral over a separate rawhide body; continuous hide wrist wraps; woven bast sandals; cedar-bark shoulder mantle; one cedar club with a single continuous obsidian cutting edge; one all-copper bowl helmet",
    ("faction_stonewood", "STR", 3): "shell-white woven underdress; metal-led articulated copper torso plates; true contiguous copper half-gauntlets; solid copper cheekpiece helmet; flat hide sandals; broad mineral-red mantle; one compact copper mace-adze; one carved cedar shield",
    ("faction_stonewood", "DEX", 1): "shell-white bark-cloth tunic; continuous woven-fiber vest; bare hands with corded wrist wraps; woven bast shoes; short mineral-red shoulder cloth; one compact carved cedar throwing stick; no metal and no helmet",
    ("faction_stonewood", "DEX", 2): "mineral-red woven tunic; continuous fitted rawhide corselet; bare hands with short hide cuffs; woven bast sandals; short cedar-fiber mantle; one compact obsidian-edged hand blade with the stone confined to its cutting edge; no shield",
    ("faction_stonewood", "DEX", 3): "shell-white woven layers; continuous hardened rawhide scale body with no stone plates; bare hands with woven wrist bands; flat hide sandals; short mineral-red mantle; one compact guarded claw carved from hardwood with a copper edge",
    ("faction_stonewood", "INT", 1): "shell-white bark-cloth wrap dress; continuous woven-fiber vest; all-woven corded cap; bare hands with wrist wraps; woven bast sandals; one clean handled obsidian mirror set inside a solid cedar frame; one flat side-mounted woven preparation roll",
    ("faction_stonewood", "INT", 2): "mineral-red woven tunic; continuous rawhide over-vest; all-woven fiber cap; bare wrists; woven bast shoes; cedar-fiber mantle; one compact shell rattle inside a carved cedar frame with no hanging pieces",
    ("faction_stonewood", "INT", 3): "shell-white woven underdress; one solid hammered copper pectoral separate from the textile body; short copper wrist cuffs ending before the palm; flat hide sandals; broad mineral-red mantle; one substantial copper-and-cedar balance focus with clean fixed parts",
    ("faction_stonewood", "MISC", None): "cedar-bark travel clothing; continuous woven pack board secured to the back carrying a closed tool roll; bare hands; woven bast shoes; broad mineral-red mantle; one compact carved-wood signal rattle fixed to the flank; no weapon",

    ("faction_dustwind", "STR", 1): "off-white wool tunic; continuous thick felt corselet; plain corded waist sash; bare hands with wool wrist wraps; one-piece felt foot bags; short saffron wool mantle; one compact hardwood knobbed club; no metal and no helmet",
    ("faction_dustwind", "STR", 2): "off-white linen tunic; one solid hammered bronze pectoral over a separate continuous felt body; continuous hide wrist wraps; simple thong sandals; broad mulberry mantle; one short bronze socketed axe-adze; one all-bronze pointed helmet",
    ("faction_dustwind", "STR", 3): "off-white wool underdress; metal-led articulated bronze torso plates; true contiguous bronze half-gauntlets; solid bronze neckguard helmet; wrapped-hide shoes; full crimson felt mantle; one compact bronze disc mace; one neutral-black lacquered oval shield",
    ("faction_dustwind", "DEX", 1): "warm-sand linen tunic and narrow wool trousers; continuous fitted felt vest; bare hands with corded wrist wraps; one-piece wrapped-hide shoes; short saffron shoulder cloth; one compact curved throwing stick; no metal and no helmet",
    ("faction_dustwind", "DEX", 2): "off-white linen layers; continuous fitted russet hide corselet with plain edges; bare hands with short wool cuffs; felt foot bags; tailored mulberry half-mantle; one compact curved bronze ring-pommel blade; no shield and no helmet",
    ("faction_dustwind", "DEX", 3): "warm-sand wool layers; a metal-led field of small bronze scales on hidden lining; bare hands with narrow felt wrist bands; wrapped-hide shoes; short crimson mantle; one compact bronze chakram-like hand weapon held through a practical grip",
    ("faction_dustwind", "INT", 1): "off-white wool wrap dress; continuous felt vest; all-felt folded cap; bare hands with wool wrist wraps; felt foot bags; one clean handled lacquered-wood mirror; one small side-mounted textile preparation roll",
    ("faction_dustwind", "INT", 2): "warm-sand linen tunic; structured continuous felt over-vest; all-felt pointed cap; bare wrists; wrapped-hide shoes; broad saffron mantle; one compact double-ended bronze pronged ritual implement with a clean central grip",
    ("faction_dustwind", "INT", 3): "off-white wool and mulberry linen formal layers; one solid bronze pectoral separate from the textile body; short bronze cuffs ending before the palm; simple sandals; full crimson felt mantle; one substantial bronze framed censer with fixed parts and no hanging chains",
    ("faction_dustwind", "MISC", None): "warm-sand travel clothing; continuous felt-and-wood pack frame secured to the back carrying a closed repair roll; bare hands; wrapped-hide shoes; broad saffron mantle; one compact horn signal instrument fixed at the flank; no weapon",

    ("faction_riverspill", "STR", 1): "bright white linen tunic; continuous densely quilted linen corselet; plain black-hide waist belt; bare hands with linen wrist wraps; simple papyrus-fiber sandals; short carnelian-red linen mantle; one compact polished hardwood mace; no metal and no helmet",
    ("faction_riverspill", "STR", 2): "bright white linen tunic; one solid hammered bronze pectoral over a separate linen body; continuous black-hide wrist wraps; simple thong sandals; broad carnelian-red mantle; one compact bronze pear-headed mace; one all-bronze bowl helmet",
    ("faction_riverspill", "STR", 3): "bright white linen underdress; metal-led articulated bronze torso plates with complete side and back coverage; true contiguous bronze half-gauntlets; solid bronze cheekpiece-and-neckguard helmet; simple flat hide sandals; broad white mantle; one compact bronze mace-adze; one tall black-hide-over-wood shield",
    ("faction_riverspill", "DEX", 1): "bright white linen short tunic; continuous fitted black-hide vest; bare hands with linen wrist wraps; papyrus-fiber sandals; short carnelian shoulder cloth; one compact polished-wood throwing club; no metal and no helmet",
    ("faction_riverspill", "DEX", 2): "bright white linen layers; continuous fitted black-hide corselet with plain edges; bare hands with short linen cuffs; simple thong sandals; tailored carnelian half-mantle; one compact bronze sickle-shaped hand blade; no shield",
    ("faction_riverspill", "DEX", 3): "bright white linen layers; metal-led small bronze scales on hidden backing; bare hands with narrow black-hide wrist bands; simple sandals; short carnelian mantle; one compact bronze crescent hand weapon with a clean grip; no helmet",
    ("faction_riverspill", "INT", 1): "bright white linen wrap dress; continuous quilted linen vest; all-linen folded cap; bare hands with linen wrist wraps; papyrus-fiber sandals; one handled polished-wood mirror with a dark bronze reflective face; one small side-mounted linen preparation roll",
    ("faction_riverspill", "INT", 2): "bright white linen tunic; structured continuous linen over-vest; all-linen wrapped cap; bare wrists; simple thong sandals; broad carnelian mantle; one compact bronze sistrum-like frame with fixed crossbars and a clean grip",
    ("faction_riverspill", "INT", 3): "bright white linen formal layers; one solid bronze pectoral separate from the textile body; short bronze cuffs ending before the palm; flat hide sandals; broad white mantle; one substantial lidded bronze reliquary vessel held by a rigid integral handle; no helmet",
    ("faction_riverspill", "MISC", None): "bright white linen travel clothing; continuous wood-and-linen pack frame secured to the back carrying a closed preparation roll; bare hands; papyrus-fiber sandals; broad carnelian mantle; one compact bronze signal bell fixed at the flank; no weapon",
}


IMAGE2_COMMON = """
FEMALE STYLING
female is a strikingly beautiful, physically alluring adult with a commanding regal presence — the minimalist warrior-queen aesthetic. Form-fitting, high-cut harnesses; low-slung belts riding the hips; exposed midriff, hips, thighs, or shoulders where the class and band allow; sculptural metal, leather, hide, fiber, and cloth pieces shaped to the body; long lines, dramatic confidence, athletic and desirable physique, flawless believable skin with real texture, sharp expressive eyes fixed on the viewer or the middle distance with total self-possession. Minimal coverage is a deliberate design language, but every single piece must still look defensive and genuinely wearable: straps, ties, knots, buckles, wraps, pins, backing, and lacing must visibly hold every item in place against movement. Bare feet, simple sandals, hide wraps, or low period footwear only — absolutely no high heels. She is powerful, dangerous, and self-possessed; never passive, never fragile, never coy. Her allure comes from confidence, physique, and craft, not from helplessness. The female Warrior uses a sleek, minimally clothed heroic fantasy trope similar to a regal minimalist warrior-queen aesthetic. Use form-fitting high-cut harnesses, low-slung belts, exposed hips and midriff, bare thighs, sculptural metal, leather, hide, fiber, or cloth pieces, and dramatic low-angle confidence. This is minimal armor coverage by design, but it must still look defensive and wearable: straps, ties, knots, buckles, wraps, pins, backing, or lacing must visibly hold every item in place. Bare feet, simple sandals, hide wraps, or low period footwear only. Absolutely no high heels, modern shoes, zippers, latex, plastic, modern fabric, or sci-fi tech. 35mm color film photography with harsh direct on-camera flash, specular highlights on skin and clothing, strong catchlights in eyes, high contrast flash illumination, authentic film grain and color shift, innocent editorial style, intimate first-person low-angle POV shot from below, early 20s sexy adult female idol with ultra-realistic delicate refined features, seductive eyes, flawless realistic porcelain skin with cool ivory undertone and visible flash specular highlights, fine delicate skin texture with subtle pores micro details and natural dewy glow under flash, fresh natural makeup with soft dewy glow, subtle natural flush on cheeks, natural pink lips slightly parted, subtle natural freckles across nose and cheeks, long dark brown hair with some loose strands framing the face and realistic loose strands, seductive natural arched pose, body angled sideways with naturally arched back and hips gently pushed back to accentuate perky round hips and sexy butt curve, one leg naturally extended forward toward the camera and the other leg slightly bent to emphasize long sexy legs, intensely seductive playful yet pitiable doe-eyed gaze straight at the viewer with soft vulnerable longing eyes and a gentle teasing smile full of quiet temptation and desire, harsh direct on-camera flash creating sharp specular highlights and strong catchlights, high contrast film color grading with natural flash look, extremely sharp yet soft skin rendering with authentic 35mm direct flash aesthetic, natural hair strands, no plastic skin, no digital over-sharpening, no airbrushing, no blemishes, no moles, no oily skin, no watermark, no text, authentic 35mm direct flash film look

The attached style reference controls photographic energy, intimate low-angle
flash composition, sensual self-possession, skin response, and dark ancient
editorial atmosphere only. Do not copy the reference woman's identity, face,
exact costume, or accessories. Preserve the assigned faction phenotype,
materials, item families, axis, and tier.

The exact loadout controls item families and material roles, not conservative
coverage. Translate its garments and armor into the minimalist high-cut,
low-slung warrior-queen coverage above while keeping every component
mechanically supported and extraction-readable.

Follow the exact loadout literally. Keep every named item visually separate.
Do not add another weapon, extra bag, apron panel, loincloth strip, tassel,
fringe, charm, hanging cord, belt ornament, jewelry curtain, or backup item.
Torso garments and harnesses use ancient wrapped, tied, laced, pinned, or
backed construction. Their body-contouring shape must still show a believable
load path and period craft rather than modern molded or synthetic construction.

Every item uses one coherent dominant construction family. A textile, felt,
fiber, or hide item stays continuous and is reinforced only by its own seams,
layers, weave, quilting, or doubled wear zones. A metal item is solid or
contiguously articulated metal with organic material limited to functional
lining, ties, backing, or grip wrapping. Never put plant fiber, felt, or little
hard plaques on the visible face of a different construction family.

Everything is recently made and actively maintained: clear healthy material
color, light handling polish, and minor local use wear only. Use simple ancient
fastening and hand-made variation. No solar or radial emblem, spiral, readable
script, copied sacred symbol, magical glow, archaeological corrosion, or
shingled cloak.

BATTLEFIELD DUST AND FRESH MUD
Show conspicuous, natural battlefield weathering from recent ancient-era
movement: a dry veil of earth dust on feet or sandals, lower legs, hems,
forearms, lower equipment, and selected exposed skin, plus a few irregular
fresh mud splashes on calves, knees, outer thighs, garment edges, shield rims,
or lower armor. The distribution follows gravity, footfall, kneeling, and
movement; it is asymmetrical and localized rather than an all-over brown
filter. Keep the face, eyes, silhouette, fastening, and central costume
readable. This is fresh surface dirt, never corrosion, burial staining, rotten
fiber, cracked leather, gore, material damage, or archaeological distress.

Hands follow the exact loadout. Bare hands are truly bare except for a wrist
wrap or cuff that ends before the palm. No fingerless gloves. Enclosed handwear
is either a continuous soft mitt or a true contiguous metal gauntlet.
Footwear follows the exact loadout and has a thin flat hand-cut sole: no modern
shoe toe box, machine-stitched upper, eyelets, welt, stacked sole, heel, or
standardized modern boot shape.

Exactly one complete main-hand object, plus a shield only when the exact
loadout names one. No polearm, bow, arrow, quiver, sling, scabbard, sheath, or
hand-carried luggage. Back and flank equipment must be visibly secured, never
carried like a purse, lunchbox, briefcase, or suitcase.

Vertical 2:3 full-body composition in a sparse dark ancient-stone interior
resembling the attached style reference. Show her from the top of hair or
headgear to the bottom of both feet and all equipment, uncropped, while keeping
the intimate low-angle direct-flash pose. Use harsh on-camera flash, crisp
catchlights, deep dark background falloff, authentic 35mm grain, believable
skin texture, and sharp material separation. No text, border, UI, watermark,
duplicate person, extra limbs, or cropped equipment.
""".strip()


COMMON = """
FEMALE STYLING
She is an unmistakably adult female warrior with commanding regal presence and
a minimalist warrior-queen design language. She is powerful, dangerous,
athletic, and completely self-possessed. Her presence comes from physical
capability, posture, disciplined expression, and craft.

Use a fitted but conventionally covered ancient garment and armor system with a
clear horizontal waist belt and sculptural metal, hide, fiber, felt, linen,
wool, or woven pieces shaped to a believable adult body. The costume is
fashion-forward while remaining defensive, secure, and wearable in motion.
Show the actual load path: broad straps, ties, knots, wraps, pins, backing,
lacing, overlaps, and suspension. Do not create floating armor, unsupported
chest plates, invisible straps, adhesive metal, costume-jewelry armor, or a
fantasy bikini assembled from random plates.

Torso protection uses an ancient corselet, wrapped cuirass, broad pectoral,
textile defense, scale body, plate assembly, or simple harness supported around
the ribs and shoulders. Never use a modern corset, corset waist, bust cup seam,
princess seam, bra-like molded panel, Victorian bodice, zipper, grommet row,
modern vest pattern, or convention-costume leather tailoring.

Use bare feet only when culturally and tactically sensible. Otherwise use
simple ancient sandals, one-piece wrapped hide, woven-fiber shoes, felt foot
bags, or other low period footwear. No high heels, elevated soles, modern
stitched shoes, molded toe boxes, sneaker panels, metal eyelets, rubber-like
soles, or standardized modern lasts.

MATERIAL HIERARCHY - HARD FAILURE GATE
Every individual item uses one dominant construction family. A woven, felted,
bark-fiber, quilted, or hide helmet is materially continuous soft construction
and has no bronze/brass ornament or reinforcing plates. A metal helmet is
metal-led and may reveal only narrow functional lining, ties, or suspension at
its edges. Never decorate valuable metal with reed, straw, bast, wicker,
coarse fiber, felt panels, plant-stem stripes, or rod-like crest filler.

Soft mitts are materially continuous woven, felted, quilted, or hide handwear,
reinforced only by denser weave, quilting, doubled palms, corded seams, or hide
wear patches. No isolated metal, horn, shell, stone, ceramic, glass, or
obsidian plates on soft mitts. True metal gauntlets are a separate family with
contiguous articulated metal backhand and knuckle construction over a
subordinate hidden lining. Never make a comfortable war mitten decorated with
little hard rectangles. No fingerless gloves and no modern five-finger glove
pattern. If the hand itself is covered, use an enclosed mitt or a true ancient
gauntlet. If the hand remains bare, use a simple flexible wrist wrap or short
cuff that clearly ends before the palm rather than a cut-off glove.

Lower-cost organic material may support a valuable hard material as hidden
lining, padding, suspension, edge binding, grip wrapping, or a separate
garment. It may not serve as prestige decoration, exposed inlay, crest filler,
or ornamental strip on high-value metal. Brittle stone, obsidian, ceramic, or
glass belongs only at a true cutting edge or a tiny protected tool inset, never
across a flexible joint. Every material interface must show credible overlap,
backing, holes, lacing, rivets, socketing, wrapping, or edge binding.

PRE-ANCIENT CONSTRUCTION AND FAILURE TAXONOMY
Keep the technology adjacent to Neolithic, Chalcolithic, Bronze Age, or early
Iron Age workshops. Use cast, hammered, sewn, laced, woven, carved, riveted,
wrapped, pegged, or hand-shaped construction. No mail, medieval plate harness,
brigandine, modern corsetry, modern tactical harness, zippers, elastic,
synthetic fabric, plastic, rubber, machine stitching, snaps, D-rings,
carabiners, industrial buckles, screws, or factory-perfect repeated parts.

Reject any one-sided structural mistake. Paired cheek guards, neck guards,
shoulder pieces, straps, handwear, greaves, and suspension points need a
mechanically corresponding hidden side unless asymmetry is purposeful and
functional. A rear helmet neckguard visibly continues across the back.

Reject archaeological decay. Everything is recently made or actively
maintained: healthy local material color, light handling polish, shallow
scratches, small repairs, and mild localized tarnish only. No heavy verdigris,
black corrosion crust, burial staining, deep pitting, encrustation, rotten
fiber, missing material, or all-over distress.

Show fresh ancient-battlefield dust and mud as surface weathering: dry earth
dust on feet or sandals, lower legs, hems, forearms, lower equipment, and
selected exposed skin, with a few irregular fresh mud splashes on calves,
knees, outer thighs, garment edges, shield rims, or lower armor. Make the
distribution asymmetrical and physically caused by footfall, kneeling,
gravity, and movement. Keep the face, eyes, silhouette, fastening, and central
costume readable. Do not turn this into an all-over brown filter, corrosion,
burial staining, rotten fiber, cracked leather, gore, damage, or decay.

Reject shingled cloaks, scale-like textile tabs, feather rows, lamellar
imitation, or many repeated dangling panels. Outer layers use broad continuous
cloth fields, simple folds, sparse pleats, gores, or at most two large
overlapping panels. Reject loose charms, tassel curtains, bells, chimes,
dangling rings, random cords, and tiny costume clutter.
No long vertical apron panel, decorative loincloth strip, tasset-like textile
banner, fringe strip, tassel hem, or stack of layered costume panels hanging
from the belt. Lower-body clothing may be a coherent skirt, kilt, wrapped
cloth, trousers, or separate mantle, but it must not masquerade as belt clutter.

Reject solar fallback: no sun disks, rayed disks, starbursts, radial spokes,
eight-spoked wheels, halo bosses, winged disks, crescent-stars, or sun-like
rosettes. No spirals, copied sacred symbols, readable script, faction logos,
watermarks, or text. Most surfaces remain plain material. At most one or two
small bounded geometric edge or hem fields may carry ornament.

WEAPON AND SLOT CONTROL
No polearms, spears, pikes, glaives, lances, long weapon staffs, bows, arrows,
quivers, slings, ammunition pouches, scabbards, or sheaths in this concept run.
Use exactly one complete compact main-hand weapon or one functional ritual
implement; no paired weapons, backup weapon, or second blade. A shield or
defensive offhand is allowed only when the assignment explicitly calls for it. Keep belts
as shallow horizontal waist objects without apron panels or tassel curtains.
Keep amulets compact and pendant-first. Keep outer layers, belts, necklaces,
body armor, handwear, and footwear visually separable for later extraction.
Preparation cases, reliquaries, quick rigs, and tool arrays are secured to the
back or flank by a visible ancient harness. They are never carried in a hand
and never resemble a purse, handbag, satchel, lunchbox, briefcase, suitcase,
doctor bag, handled chest, or modern luggage. A held ritual tool has one clean
grip and no dangling charms, tassels, beads, cords, or pendants.

PHOTOGRAPHIC COSPLAY PRESENTATION
Create one full-body live-action museum-quality experimental-archaeology
costume photograph with the charisma and polish of a premium fantasy cosplay
editorial, in a vertical 2:3 composition. The clothing and equipment are made
like functional replicas by skilled ancient-craft specialists, never like a
modern convention costume. One adult woman only, fully visible from the highest
point of her hair or headgear to the lowest point of her feet and equipment.
Three-quarter standing pose with controlled dramatic confidence, clear
silhouette, and equipment exposed for later study. No extreme foreshortening,
rear-first pose, crossed limbs hiding gear, cropped weapon, cropped feet,
duplicate person, extra limbs, or mannequin.

Use authentic 35mm color-film character photography with assertive direct
on-camera flash, crisp catchlights, strong but controlled specular response on
skin and materials, fine film grain, subtle analog color shift, and very sharp
surface readability. Skin remains believable with pores and natural variation,
not plastic, airbrushed, oily, or doll-like. The camera is around waist-to-chest
height with only a mildly low heroic angle, not an intimate fetish POV.

Use a seamless flat neutral-white studio background, neutral daylight white
balance, minimal soft contact shadow, and no scenery, architecture, props,
smoke, aura, magic effects, floor-plane emphasis, border, UI, caption, or
watermark. Faction color comes from the actual costume materials, never a
global color cast.
""".strip()


def prompt_for(faction_id: str, axis: str, tier: int | None) -> str:
    faction = FACTIONS[faction_id]
    tier_label = "Misc" if tier is None else f"Tier {tier}"
    return f"""Create exactly 1 image. No commentary.

This is a pure text-to-image request. Create the image entirely from scratch.
Do not ask for an upload and do not create a collage, sheet, alternate view, or
multiple-character lineup.

LADDER IDENTITY
{faction_id} - {axis} - {tier_label}
Create one new adult female cosplay-style source character for the
{faction['name']}. The identity above is metadata only; do not print it.

BODY AND CULTURAL READ
{faction['body']}.

EXACT LOADOUT - DO NOT ADD OR HYBRIDIZE
{EXACT_LOADOUTS[(faction_id, axis, tier)]}.

TIER
{TIER_RULES[tier]}

{IMAGE2_COMMON}

FINAL AUDIT
Before rendering, verify: exactly one clearly adult woman; full body and all
equipment uncropped; one coherent faction; one clear axis; the assigned tier;
ancient buildable construction; no hard-soft decorative hybrids; no reeds or
felt decorating metal; no little plates pasted onto soft mitts; no one-sided
helmet part; no archaeological decay; no modern footwear; no shingled cloak;
no modern corset or bust seams; no belt apron panel; exactly one main-hand
object; no solar symbol; no bow, arrow, quiver, sling, polearm, scabbard, or
dangling clutter. If any failure is present, redesign before rendering.
"""


def contact_sheet_prompt(axis: str, tier: int | None) -> str:
    tier_label = "Misc" if tier is None else f"Tier {tier}"
    styling = IMAGE2_COMMON.split("\n\nThe attached style reference", 1)[0]
    panels = []
    for index, (faction_id, faction) in enumerate(FACTIONS.items(), 1):
        panels.append(
            f"""PANEL {index} — {faction['name']}
Adult body and cultural read: {faction['body']}.
Exact loadout: {EXACT_LOADOUTS[(faction_id, axis, tier)]}.
Tier rule: {TIER_RULES[tier]}"""
        )
    return f"""Create exactly 1 image. No commentary.

Create one four-panel character contact sheet for the {axis} {tier_label}
ladder calibration. The sheet contains exactly four distinct vertical panels,
one adult female character per panel, in this fixed left-to-right order:
Northern Bronze Houses; Cedar-Obsidian Clans; Silkroad Plateau Nomads;
Nile-Ziggurat Kingdoms. No extra people, no shared group scene, no interaction,
and no overlapping between panels.

{styling}

Apply that female styling faithfully to all four adult women. Each panel uses
the same harsh direct-flash 35mm color-film energy, intimate low-angle
confidence, alluring adult warrior-queen presentation, dark ancient-stone
background, and realistic skin response. Do not standardize their faces,
complexions, hair, builds, or faction equipment.

{chr(10).join(panels)}

MATERIAL AND CONSTRUCTION OVERRIDE
The exact loadout controls material roles and item families, not conservative
coverage. Translate each loadout into the high-cut, low-slung minimalist
warrior-queen coverage above while keeping every component visibly supported
and usable. Each item commits to one construction family. Fiber/felt/hide items
remain continuous soft construction. Metal items remain solid or contiguously
articulated metal with organic material only as functional lining, backing,
ties, or grip wrap. Never decorate metal with reeds, felt, or plant fiber.
Never paste small hard plates onto a soft mitten. No one-sided helmet parts.

Everything is actively maintained with healthy material color and slight use
wear, not archaeological decay. No modern footwear, modern corsetry, solar or
radial symbols, spirals, shingled cloaks, long belt-apron panels, tassel
curtains, loose charms, bows, arrows, quivers, slings, polearms, scabbards, or
hand-carried luggage.

BATTLEFIELD WEATHERING
Across all four panels, show fresh ancient-battlefield dust and a few irregular
mud splashes. Concentrate dry dust on feet or sandals, lower legs, hems,
forearms, lower equipment, and selected exposed skin; place localized wet or
dried splashes on calves, knees, outer thighs, garment edges, shield rims, and
lower armor according to gravity and movement. Vary the pattern per woman.
Keep faces, eyes, silhouettes, fastening, and central costume readable. No
all-over brown filter, corrosion, burial staining, rotten fiber, cracked
leather, gore, damage, or archaeological decay.

COMPOSITION
One coherent 4:3 landscape contact sheet with four equally sized portrait
panels. Every adult woman is fully visible from hair/headgear through both feet
and all equipment, uncropped. Each panel has its own dark ancient-stone
background and direct-flash falloff. No text, labels, numbers, borders,
captions, UI, watermark, duplicate anatomy, extra limbs, or cropped equipment.
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(r"C:\Users\Alex\Downloads\female_cosplay_ladders_v1"),
    )
    args = parser.parse_args()
    prompt_dir = args.output / "prompts"
    sheet_prompt_dir = args.output / "contact_sheet_prompts"
    image_dir = args.output / "images"
    prompt_dir.mkdir(parents=True, exist_ok=True)
    sheet_prompt_dir.mkdir(parents=True, exist_ok=True)
    image_dir.mkdir(parents=True, exist_ok=True)

    rows: list[dict[str, str]] = []
    for faction_id in FACTIONS:
        combinations = [
            ("STR", 1), ("STR", 2), ("STR", 3),
            ("DEX", 1), ("DEX", 2), ("DEX", 3),
            ("INT", 1), ("INT", 2), ("INT", 3),
            ("MISC", None),
        ]
        for axis, tier in combinations:
            tier_slug = "misc" if tier is None else f"tier_{tier}"
            stem = f"{faction_id}__{axis.lower()}__{tier_slug}"
            prompt_path = prompt_dir / f"{stem}.txt"
            output_path = image_dir / f"{stem}.png"
            prompt_path.write_text(prompt_for(faction_id, axis, tier), encoding="utf-8")
            rows.append(
                {
                    "faction": faction_id,
                    "axis": axis,
                    "tier": "" if tier is None else str(tier),
                    "prompt_path": str(prompt_path),
                    "output_path": str(output_path),
                    "status": "pending",
                }
            )

    with (args.output / "manifest.tsv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys(), delimiter="\t")
        writer.writeheader()
        writer.writerows(rows)
    for axis, tier in [
        ("STR", 1), ("STR", 2), ("STR", 3),
        ("DEX", 1), ("DEX", 2), ("DEX", 3),
        ("INT", 1), ("INT", 2), ("INT", 3),
        ("MISC", None),
    ]:
        tier_slug = "misc" if tier is None else f"tier_{tier}"
        (sheet_prompt_dir / f"{axis.lower()}__{tier_slug}.txt").write_text(
            contact_sheet_prompt(axis, tier),
            encoding="utf-8",
        )
    print(f"Wrote {len(rows)} prompts to {prompt_dir}")


if __name__ == "__main__":
    main()
