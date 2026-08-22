# Verdigris UI framepack interface

Version 1 freezes the asset-swap seam for WIZARD UI frames. It does not
choose final art direction. CSS/SVG placeholders and generated raster packs
must use the same contract so final assets can land without module rewrites.

## Runtime contract

A framed surface uses:

```html
<section
  class="wizard-frame"
  data-wizard-frame-pack="verdigris-placeholder"
  data-wizard-frame-component="panel"
  data-wizard-frame-state="default">
  <div class="wizard-frame__content">...</div>
</section>
```

Frozen selectors and attributes:

- `.wizard-frame` is the outer decoration box.
- `.wizard-frame__content` is the safe content box.
- `data-wizard-frame-pack` selects one manifest `id`.
- `data-wizard-frame-component` selects one component `id`.
- `data-wizard-frame-state` is one of `default`, `hover`, `focus`,
  `active`, or `disabled`.
- The component must remain usable if JavaScript, images, or the selected pack
  fail to load. The CSS/SVG fallback is the product baseline, not a loading
  error.

Implementations may set these public custom properties on `.wizard-frame`:

```css
--wizard-frame-image
--wizard-frame-slice-top
--wizard-frame-slice-right
--wizard-frame-slice-bottom
--wizard-frame-slice-left
--wizard-frame-content-top
--wizard-frame-content-right
--wizard-frame-content-bottom
--wizard-frame-content-left
--wizard-frame-edge-repeat
--wizard-frame-fill
```

Do not expose generated file names or model-specific metadata to module logic.

## Manifest contract

Each pack validates against `schema/wizard.framepack.v1.schema.json`. Packs
live under `assets/verdigris-ui/framepacks/<pack-id>/`; their manifest is
`framepack.json`. Components use deterministic lowercase kebab-case IDs.

Nine-slice values and content insets are integer source-image pixels ordered
`top`, `right`, `bottom`, `left`. For every raster state:

- left + right must be less than source width;
- top + bottom must be less than source height;
- content insets must not place content outside the center region;
- source dimensions, alpha presence, and checksum must match the manifest;
- edge mode is `stretch`, `repeat`, or `round` and is explicit.

No visible text, glyph labels, module names, or lore copy may be baked into a
frame asset. Pack metadata may describe provenance but never becomes runtime
copy.

## Derivative maps

Optional derivative roles are `alpha`, `edge`, `material`, `height`, `depth`,
`emissive`, `roughness-source`, and `normal-source`. They are source material,
not proof of technical correctness. Normal maps and nine-slice coordinates
must be produced or verified deterministically after generation.

## Ownership boundaries

- Architecture owners: this document and the schema.
- Visual worker: research, gallery, placeholders, and asset packs that conform.
- Systems worker: validators, ingestion, checksums, and registry tooling.
- Module workers: consume the public selectors/attributes only.
- Owner: final material language, ornament density, and selected generated art.

Changing a frozen selector, attribute, state, derivative role, or slice order
requires a versioned interface proposal and migration test. Adding a new
component or pack under the existing shape does not.
