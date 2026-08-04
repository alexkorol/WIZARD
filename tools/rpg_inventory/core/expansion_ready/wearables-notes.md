# Wearables production notes

## Roster

This portfolio contains exactly 50 rows in ten five-rung ladders:

- handwear: `enclosed_mitts`, `enclosed_hand_cages`, `wrap_guards`, `laminar_armguards`;
- footwear: `soft_shoes`, `ancient_sandals`, `greave_footwear`;
- belts: `textile_girdles`, `hide_warbelts`, `plaque_belts`.

The hand slot is intentionally balanced. Two ladders are true enclosed mitt or
hand-cage families and two are forearm-defense families. The old rigid Tier 1
stone wristguard was removed. Every Tier 1 hand base is soft hide, textile, or
sinew.

All handwear and footwear rows use square `2x2` metadata. Every belt uses
landscape `2x1` metadata. Adjacent rungs change macro silhouette or mechanical
construction rather than applying a material-only reskin.

## Supply reconciliation

The supply map records each relevant source exactly once:

- five present calibrated `hands_arms` outputs are rejected for base reuse
  because each pastes a rigid plate or rib field onto a soft mitt; they remain
  mapped exactly once as negative references for redesigned rows;
- five present calibrated `legs_footwear` outputs are rejected for base reuse
  because their developed soles, paneling, or metal boot facades drift beyond
  the ancient manufacturing ceiling; they appear only as rejected references
  on new-generation rows;
- all five promoted post-calibration glove candidates are assigned across the
  two forearm-defense ladders;
- both promoted post-calibration boot candidates are assigned to complete
  ancient footwear bases;
- both promoted post-calibration belt candidates are assigned to shallow
  horizontal belt bases.

Every source path is filename-addressed or an exact absolute calibrated-output
path. Every source row includes the verified SHA-256. No rejected
post-calibration image is reused.

## Prompt hygiene

Descriptions omit closure and fastening instructions. Belt bodies are described
only through silhouette, material, plate layout, weave, and bounded decoration.
Footwear remains empty, paired, flat-soled, and visibly hand-built. Enclosed
handwear has no individual finger articulation, while forearm defenses contain
no generated hands or anatomy.

The final footwear audit removed the rigid instep-scale concept. Its replacement,
`Meteor-Cuff Footbags`, keeps the complete foot as flexible Oetzi-family
deerskin, bast net, grass fill, and flat leather sole; one narrow skymetal band
is isolated on a short padded ankle cuff above the foot flex zone.

The final handwear audit also removed five hard-on-soft concepts. The
`enclosed_mitts` ladder now remains materially continuous through fur-lined
hide, quilted linen, cord-welted hide, shaped lacquered hide, and deeply molded
black hide. Where metal appears in `enclosed_hand_cages`, it forms the
self-supporting contiguous hand shell; leather or felt appears only as
subordinate lining at the rims.

No image generation was performed during this release-manifest pass.
