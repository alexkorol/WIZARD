# Owner-input packets

Owner decisions are batched, exact, and durable. Use a GitHub issue labelled
`owner-input`; never ask for ad-hoc prompt invention in chat. Development
continues against the framepack interface and neutral placeholders while a
packet is open.

## Required packet shape

Every packet records:

1. decision required and recommended choice;
2. alternatives and why the decision matters;
3. whether any critical path is blocked;
4. exact copy-paste prompt(s);
5. model: GPT Image-2 or Nano Banana 2 Pro;
6. variant count, canvas dimensions, aspect ratio, and transparency;
7. negative instructions, deterministic filenames, and target folders;
8. acceptance rubric;
9. derivative roles needed from `docs/UI_FRAMEPACK_INTERFACE.md`;
10. deterministic post-processing and validation;
11. continuation plan while the owner generates or reviews assets.

## Batch rounds

Use these rounds instead of micro-decisions:

- **Direction selection:** one contact sheet comparing coherent material and
  ornament languages. No implementation assets.
- **Component sheet:** the selected language applied to the complete bounded
  component set at consistent scale.
- **Support maps:** alpha and source maps for deterministic local processing.
- **Correction round:** only failed rubric items, with exact corrections; no
  broad reroll.

Each round is a separate immutable packet or a new structured comment. Do not
silently edit an issued prompt after the owner starts generation.

## Acceptance

Generated UI art is never accepted solely because it looks attractive. It must
also preserve readable center regions, clean alpha where required, coherent
corners and edges, repeatable material scale, no baked text, and enough source
information for deterministic nine-slice and derivative generation.
