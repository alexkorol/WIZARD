# OWNER-INPUT-001 correction round

Status: `PENDING_OUTPUT`

Authority: owner selects direction; this document does not

Source packet: [OWNER-INPUT-001 / issue #65](https://github.com/alexkorol/WIZARD/issues/65)

## Why this is pending

Issue #65 has a complete direction prompt but, as of this document's creation,
no generated contact sheet, owner selection, or comment. A correction round is
valid only for observed rubric failures. Do not run any prompt below until the
raw output is attached, hashed, and scored in the intake record.

The working recommendation remains quadrant 1, restrained forged bronze,
because it best preserves the current WIZARD shell while keeping content
dominant. That recommendation is provisional and does not replace the owner's
choice.

## Decision required

After the owner supplies the direction sheet, choose at most two quadrants to
advance and identify only their failed rubric items. The correction round must
preserve successful material and construction decisions. It blocks corrected
direction evidence only; CSS/SVG placeholders, the gallery, contracts,
adapters, tests, and ingestion tooling continue.

## Intake record

Complete these factual fields before generation:

| Field | Required value |
|---|---|
| Issue/comment URL | URL containing the owner's raw attachment |
| Raw filename | Exact downloaded filename |
| Raw dimensions | Width x height in pixels |
| SHA-256 | Hash of the untouched download |
| Quadrant(s) advanced | Owner-selected number(s), maximum two |
| Failure codes | Codes from the rubric below |

Failure codes:

- `F1 SCALE`: component scale differs between compared directions.
- `F2 PERSPECTIVE`: specimens are not straight-on/orthographic.
- `F3 CENTER`: decoration, shadow, or content obstructs the empty center.
- `F4 SLICE`: corners and edges do not separate into plausible nine-slice
  regions.
- `F5 DENSITY`: filigree, symbols, or surface noise dominates content.
- `F6 MATERIAL`: selected material is unclear or drifts between components.
- `F7 FORBIDDEN`: text, glyphs, logos, figurative carving, fake alpha,
  checkerboard, glow, or scene dressing appears.

If no code applies, do not generate a correction. Advance to the component
sheet instead.

## Exact batched correction prompt

Model: **GPT Image-2**

Variants: **4 separate images in one request; no contact sheet**

Canvas: **1536x1024 each, 3:2 landscape**

Background: **opaque uniform neutral charcoal; no transparency in this round**

Input: attach the untouched `OWNER-INPUT-001` direction sheet as Image A

This exact prompt is prepared for the recommended quadrant 1. Run it only if
the owner advances quadrant 1 and at least one of `F1`-`F7` is recorded. If the
owner advances another quadrant, issue a new immutable packet rather than
silently substituting material words here.

```text
Generate 4 separate correction images. No commentary. Use Image A only as the visual source for quadrant 1, the restrained dark forged-bronze direction. Preserve that direction's successful material identity: dark forged bronze, controlled sparse verdigris oxidation, shallow hammered facets, narrow geometric edge bands, and sparse asymmetric tool marks. Do not redesign or hybridize it with another quadrant.

Each output is one 1536x1024 landscape direction specimen on one flat uniform neutral-charcoal background. Each output contains the same three empty UI components at exactly the same physical scale and camera: one wide rectangular panel frame, one compact card frame, and one small button frame. Show every component straight-on, orthographic, centered, fully visible, and separated with generous clear space. Keep every center empty and uninterrupted. Make corners compact and separable from straight edges; make each straight edge visually continuous and repeatable at a stable material scale so the result can later be rebuilt as deterministic nine-slice assets. Keep ornament subordinate to content.

Variant 1 corrects geometry only: clearest modular corners and straight repeatable edges, with all successful material detail preserved. Variant 2 corrects content safety only: largest clean center regions and shallowest decoration intrusion. Variant 3 corrects density only: quietest hammered surface and sparsest irregular rivet/tool-mark accents. Variant 4 is the closest faithful correction to Image A while satisfying all geometry, center, and density constraints.

No text, letters, numbers, runes, logos, icons, heraldry, figurative carving, spirals, gems, skulls, weapons, vines, parchment, wax seals, excessive filigree, bright green corrosion noise, glowing magic, perspective scene, cast shadows crossing specimens, or content inside the frames. No fake transparency, checkerboard, alpha matte, normal map, height map, depth map, roughness map, or nine-slice guide. Do not add wood, stone, gold filigree, or cold skymetal. This is a bounded correction of the selected direction, not final production art and not a broad reroll.
```

## Deterministic filenames and target

Preserve raw files exactly as returned:

- `owner-input-001__q1-correction__v01.png`
- `owner-input-001__q1-correction__v02.png`
- `owner-input-001__q1-correction__v03.png`
- `owner-input-001__q1-correction__v04.png`

Target folder:
`assets_inbox/verdigris-ui/owner-input-001/correction-001/raw/`

Never overwrite the direction sheet or a prior correction. Record dimensions,
file size, SHA-256, model, generation date, and source issue/comment URL.

## Correction acceptance rubric

- The four outputs retain quadrant 1's material identity; they do not become
  four new directions.
- Panel, card, and button scale and camera match across all outputs.
- Components are straight-on, fully visible, and isolated on uniform charcoal.
- Centers are empty and safe; corners and edges plausibly separate for
  deterministic slicing.
- Ornament remains subordinate at small card/button scale.
- No forbidden content appears.
- No output is treated as alpha, a technical support map, final normal data,
  or validated nine-slice art.

Reject only the failed file; do not reroll successful variants. After one
correction passes, the owner may approve it as the reference for a separate
component-sheet packet.

## Follow-on derivative roles

The later component/support-map rounds may request `alpha`, `edge`, `material`,
`height`, `depth`, `roughness-source`, and `normal-source` as allowed by the
frozen interface. `emissive` remains omitted unless the owner explicitly
selects illumination. Final normals, checksums, and slice coordinates are
created or verified deterministically; image-model output is never technical
proof.

## Continuation while pending

Continue the shared interface, CSS/SVG placeholder, gallery, responsive and
accessibility checks, adapters, fixtures, and deterministic ingestion work.
No critical-path task waits for this packet.
