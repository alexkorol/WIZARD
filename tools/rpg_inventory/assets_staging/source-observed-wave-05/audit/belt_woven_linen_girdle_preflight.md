# Wave 05 preflight: `belt_woven_linen_girdle`

## Decision

**REJECT as a new generation; no generation performed.**

British Museum EA72491 is a strong dated textile reference but not a belt
reference. The museum identifies the object as approximately half of a man's
Roman-style sleeveless tunic. Its photograph and catalog record support linen
plain weave, narrow wool clavi, self-stripes, selvedges, twinning, fringe, and
a waist tuck. They do not show a separate girdle, a belt-width cut, two
tapered ends, a hand tie, a buckle, a clasp, or any other belt closure.

The proposed 2x1 belt is therefore a reconstruction synthesized from textile
evidence rather than a transcription of an observed object. It fails the
current visual-source gate. It also fails strict prior-art dedupe: the exact
candidate was already generated in Pilot 02, including a correction with a
visible central hand tie, and the promoted post-calibration folded textile
sash already occupies the same shallow tied-cloth macro-silhouette.

EA72491 may remain a **secondary material/weave verification reference** for a
future belt that has a separate, direct primary source for its complete band,
ends, and closure. It cannot serve as the primary object-family anchor.

## Official source

- British Museum object: EA72491 / registration 1990,0612.110.
- Museum title/classification: `textile; garment; tunic`.
- Museum description: approximately half of a man's Roman-style sleeveless
  tunic, mainly linen, with two purple/blue wool weft-faced clavi approximately
  4 cm wide. The record also notes a plain selvedge hem, internal selvedges at
  the neck strengthened by double rows of linen twinning, short warp fringes
  preceded by empty-warp bands, self-stripes parallel to the clavi, side-seam
  sewing traces, and a waist tuck.
- Place and chronology: Egypt, Roman Period, fifth-sixth century. Radiocarbon
  date: 95.4% calibrated probability, AD 420-550.
- Technique/materials: plain weave; dyed; linen and wool.
- Recorded dimensions: textile 150 x 155 cm; reconstructed made-up tunic
  proportions 118 x 150 cm.
- Object record:
  <https://www.britishmuseum.org/collection/object/Y_EA72491>
- Exact official image URL:
  <https://media.britishmuseum.org/media/Repository/Documents/2014_9/29_20/33d12432_c651_47f4_9ec9_a3b501526513/max_00164873_001.jpg>
- Local official image:
  `tools/rpg_inventory/assets_staging/source-observed-wave-05/references/british_museum_EA72491_roman_linen_tunic.jpg`
  (2500x2280 RGB; 624,425 bytes; SHA-256
  `345a2a8e41743a3e649982af38cd8d74b4c7887b30a8ab93d7009824131a70bd`).

## What the photograph actually shows

The image shows a large, nearly rectangular, pale linen tunic section mounted
flat for documentation. Two very dark, narrow vertical clavi run through the
cloth. Fine plain weave, straight selvedged fields, a rectangular neck opening,
patching/loss, and fringed/raw side areas are visible.

It does **not** show:

- an independent waist belt or girdle;
- a broad band cut or woven to belt proportions;
- two ends, tapered or otherwise;
- a hand tie, knot, overlap, clasp, buckle, or fastening sequence;
- the object under gravity as an isolated wearable band.

The catalog's `waist tuck` is evidence about how the tunic was worn or altered,
not evidence for a separate textile belt.

## Source and roster gates

| Gate | Result | Reason |
| --- | --- | --- |
| Exact visual source | PASS | An exact official high-resolution image and record were inspected and saved. |
| Chronology | PASS | The museum dates the tunic to the fifth-sixth century and reports C14 AD 420-550. |
| Material/weave | PASS, limited | Linen plain weave, dark wool stripe fields, self-stripes, selvedges, twinning, and fringe are documented. |
| Object-family construction | FAIL | The source is a tunic fragment, not a separate belt; no belt body, ends, or closure are visible. |
| Game-roster value | HOLD in isolation | A broad low-tier textile belt can be a readable ARPG base, but incidental or inferred clothing is not automatically a game item. This candidate has no independently observed belt object. |
| 2x1 framing | PASS as a project requirement only | `INVENTORY-FOOTPRINTS.md` assigns belts/girdles/sashes to 2x1 landscape. The museum object does not itself establish this belt silhouette. |
| Strict prior-art dedupe | FAIL | Pilot 02 already generated the candidate, and a promoted post-calibration tied textile sash already owns the same macro-shape. |

## Strict prior-art audit

### Exact candidate staging

- `tools/rpg_inventory/assets_staging/pilot-02/raw/belt_woven_linen_girdle.png`
  (1536x1024; SHA-256
  `966827fcf1ba8a97f8c4b8401369347d9338dd1f363028996c2a0571230e7d0d`).
  This is a broad striped textile band rendered as an impossible seamless
  rigid hoop. It is a physical-construction reject.
- `tools/rpg_inventory/assets_staging/pilot-02/clean/belt_woven_linen_girdle_clean.png`
  (1324x566; SHA-256
  `0c3cf3363700c84de760aaa4f4338bd13f71a015d921c4763b771f96021d3f29`).
  This is the keyed derivative of the same seamless-hoop failure, not the
  corrected tied version.
- `tools/rpg_inventory/assets_staging/pilot-02/raw/belt_woven_linen_girdle_correction.png`
  (1536x1024; SHA-256
  `f6763f8e50cdb468d110b63140030ac5c16181d569ac1b69b97bba073e1008cc`).
  This already depicts the requested broad striped linen band, two short
  tapered ends, and one simple central textile tie. A new call would repeat the
  exact concept even though this output still inherits unsupported belt
  assembly from the brief rather than EA72491.

### Post-calibration batch

- `tools/rpg_inventory/assets_staging/pilot-02/references/calibrated_icon/post_calib_belt_silhouette.png`
  is byte-identical to
  `C:\Users\Alex\Downloads\items_post_calib_batch\ChatGPT Image Jul 13, 2026, 11_51_11 PM (3).png`
  (1254x1254; SHA-256
  `c4805ab976cb4499a26eb655795095a2962a18660ec65ae061e5442eb23f4497`).
  It is already promoted as `belt_folded_wool_sash` / `salvage_belt_169`.
  Its shallow folded textile loop and single tucked side knot occupy the same
  tied-cloth belt/sash family. Its square source canvas would require local
  2x1 reframing, not a duplicate generation.

### Current composed belt staging

- `tools/rpg_inventory/assets/girdle_quilted.png` is another broad pale textile waist band with
  horizontal stitched rows and a central organic toggle. It is not an exact
  duplicate, but it further crowds the broad padded/textile belt lane.
- `tools/rpg_inventory/assets/girdle_hide.png` is a very shallow dark woven-hide band with an
  organic toggle. Its material is distinct, but its horizontal band role is
  already established.
- `tools/rpg_inventory/assets/girded_sash.png` is a dark leather/metal buckle belt and does not
  duplicate the simple textile construction.
- The bronzeplate, copper, and skymetal girdles are metal-led and materially
  distinct; they do not rescue the linen candidate from the exact Pilot 02 and
  promoted-sash collisions.

## Conditional construction locks

These are **not a generation prompt**. They define what would be required if a
different, direct belt source later reopens the slot.

- Primary source must visibly show an independent broad textile band, both
  short ends, and a credible closing action or surviving closure evidence.
- EA72491 may support a healthy undyed/pale linen ground, plain weave, subtle
  self-stripes, and at most one or two narrow bounded dark wool stripe fields.
  Its clavi are purple/blue wool, not orange-brown decorative stripes.
- Preserve a simple organic textile hierarchy. No metal clasp, buckle, plates,
  rivets, keeper, ornaments, beads, charms, or prestige hardware.
- Use a complete openable band with two credible textile ends and one
  low-profile hand tie. Do not infer these features from EA72491; they require
  the separate primary belt source.
- Tapered ends are permissible only if the new primary source visibly supports
  tapering or a documented reconstruction establishes it.
- Active-service cloth should be intact and flexible. Do not copy the museum
  object's holes, patch losses, flattened conservation mounting, faded color,
  or archaeological fray.

## 2x1 framing and gravity locks

- Runtime footprint: **2x1**; generator canvas: **L**, landscape.
- Keep the visible silhouette at least twice as wide as tall, laid straight or
  in a shallow arc. The belt should read as a broad flexible band, not a scarf,
  skirt, waist wrap, or circular collar.
- A belt removed from the body must settle under gravity. Show slight
  asymmetrical sag, overlap, and compression around the tie. Short ends may
  angle gently downward or rest against the band; they must not float stiffly
  around an invisible waist.
- The tie should sit within the shallow horizontal envelope. No long dangling
  tails, tassels, fringe, cords, pouches, apron panels, or vertical rigging.
- Never render a perfect ellipse, rigid cylindrical wall, inflated tube,
  seamless hoop, torc, crown, or Mobius-like interpenetration.

## Failure taxonomy

- **Source laundering:** presenting a tunic fragment as direct evidence for a
  separate girdle, tapered terminals, or knot.
- **Exact duplicate:** regenerating the Pilot 02 tied correction.
- **Near duplicate:** another pale folded/tied textile sash matching promoted
  `salvage_belt_169`.
- **Seamless wearable ring:** no visible ends or closure, as in the Pilot 02
  original and its clean derivative.
- **Rigid/anatomy-dependent form:** a perfect waist cylinder or floating band
  that preserves an absent torso.
- **Wrong object family:** scarf, cummerbund, martial-arts belt, skirt, folded
  tunic, collar, circlet, torc, rope coil, or luggage strap.
- **Unsupported closure:** metal buckle/clasp, bone or horn toggle, modern
  keeper, eyelets, hook-and-loop, or hidden seam claimed as historical fact.
- **Vertical clutter:** long sash tails, fringe, tassels, cords, pouches,
  charms, apron panels, or tassets.
- **Surface drift:** orange/rust fantasy stripes substituted for the observed
  dark purple/blue wool clavi; ornate embroidery; machine-perfect repeated
  pattern; heavy distressing; burial stains; holes; rotten or shredded cloth.
- **Composition failure:** square or portrait output, tall bow-like knot,
  low occupancy, cropped ends, or silhouette less than twice as wide as tall.

## Reopen condition

Do not generate this row again from EA72491. Reopen only if:

1. a direct artifact photograph or credible reconstruction visibly establishes
   a complete broad linen belt, two short ends, and its simple tie;
2. its macro-silhouette is deliberately differentiated from both the Pilot 02
   tied correction and promoted `belt_folded_wool_sash`; and
3. the proposed rung still earns a distinct game-roster role after the new
   visual source and prior-art pass.
