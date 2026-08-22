# Framepack Gallery

Internal direct-URL bench for framepack v1. It loads each selected manifest,
resolves state files through `assetRoot`, verifies PNG dimensions and alpha,
recomputes SHA-256, checks slice/content bounds, and only renders a pack after
all checks pass.

Fixtures are deterministic and local:

- `valid` — five declared states, each with a generated RGBA frame.
- `slice-overflow` — left + right slice values exceed source width.
- `bad-checksum` — the declared checksum is intentionally false.
- `missing-alpha` — `hasAlpha` is intentionally absent.

Regenerate fixtures:

```text
node tools/framepack_gallery/generate-fixtures.mjs
```

Verify the gallery and fixture bytes:

```text
node tools/framepack_gallery/test.mjs
```

Serve only on an assigned loopback port. The gallery has no module manifest and
is absent from the generated WIZARD registry until its successor packet lands.
