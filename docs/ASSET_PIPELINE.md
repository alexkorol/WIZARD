# Asset pipeline

Verdigris asset intake: how owner-provided UI framepack art becomes a
validated, checksummed `wizard.framepack.v1` pack without manual filename
surgery. Owned by the systems lane; the framepack contract itself is frozen
in `docs/UI_FRAMEPACK_INTERFACE.md` and
`schema/wizard.framepack.v1.schema.json`.

## Layout

- Intake (input, never modified): a directory containing `intake.json`
  validating against `schema/wizard.asset-intake.v1.schema.json`, plus the
  source PNG files it references.
- Output pack:
  `<out>/assets/verdigris-ui/framepacks/<pack-id>/framepack.json` with state
  rasters beside it and deterministic derivative maps under `maps/`.
- Tooling: `scripts/verdigris-assets/ingest.mjs` (`ingest`, `verify`),
  supported by `png.mjs` (minimal 8-bit PNG codec), `derive.mjs`
  (deterministic map derivation + contact sheet), and `validate.mjs`
  (JSON-Schema subset validator).

## Usage

```bash
node scripts/verdigris-assets/ingest.mjs ingest <intake-dir> --out <out-dir> [--contact-sheet]
node scripts/verdigris-assets/ingest.mjs verify <pack-dir>
```

## What ingest guarantees

1. Intake validates against its schema before any work: kebab-case ids,
   known states, allowed derivative roles, PNG-only file references.
2. Every referenced source PNG is decoded; dimensions are measured, not
   declared. Nine-slice math is checked against measured dimensions per the
   frozen interface (left+right < width, top+bottom < height, contentInsets
   within the center region).
3. `expectAlpha` per state is enforced against actual pixel data.
4. Everything is staged in a temp directory and re-validated — including the
   emitted manifest against the framepack v1 schema — BEFORE promotion to the
   output tree. Any failure exits nonzero and leaves no output directory.
5. Source intake files are read-only inputs; they are never overwritten.

## Determinism

Same input produces byte-identical output: fixed deflate level, integer-only
map math, stable manifest ordering (intake component order; states in
frozen-interface order), 2-space JSON with trailing newline. The test suite
proves byte-identical reruns and pins the generated contact sheet against a
committed artifact.

## Derived maps are source material, not final assets

Roles available from this tool: `alpha` (alpha channel as gray),
`edge` (Sobel magnitude of luminance), `height` (luminance), `depth`
(inverted luminance), `roughness-source` (alpha-weighted luminance).
These are inputs for downstream material tools. This tool deliberately
does NOT offer `normal-source`: it will not pretend to synthesize final
normal maps. Normal/roughness finishing stays with the owner-selected
generation process per the frozen derivative-role contract.

## Verify mode

`verify <pack-dir>` re-checks an existing pack: manifest schema validity,
file presence, sha256 checksums for every state raster and derivative map,
measured dimensions, and alpha presence against `hasAlpha`. Exits nonzero
naming each mismatch — use it after any manual touch of a pack.
