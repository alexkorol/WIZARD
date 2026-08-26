# WIZARD — Verdigris Systems Laboratory

WIZARD is a static GitHub Pages dashboard of **Verdigris** calibration, authoring, presentation, and integration tools. It is not a game client.

**Live site:** [alexkorol.github.io/WIZARD](https://alexkorol.github.io/WIZARD/)

A retained module should help the owner:

1. load a reproducible scenario;
2. tune important values;
3. save calibration state;
4. compare Snapshot A / Snapshot B;
5. place semantic or spatial feedback;
6. export agent-ready Markdown;
7. later, interoperate through fixtures and events.

## Active laboratory

Cards on the dashboard come from the generated registry (`modules.json` / `modules.generated.js`). Do not maintain a second hand-edited card list.

| Module | Path | Role |
|---|---|---|
| Vessels of Life & Mana | `tools/wizard_orbs` | HUD resource calibration |
| Geometric Passive Tree | `tools/geometric_skilltree` | Passive-tree authoring |
| Vesselforge & Inventory | `tools/rpg_inventory` | Itemization calibration |
| Arcane Lattice | `tools/arcane_lattice` | Spellcraft constraints |
| Cartographer | `tools/cartographer` | Zone generation |
| Mason Terrain Forge | `tools/mason` | Terrain autotile |
| Verdigris World Presentation | `tools/verdigris_splash` | World presentation |
| Chronicles: Houses & Scions | `tools/rp_account_creator` | Chronicle meta |

Health Globe is a legacy predecessor and is not a primary dashboard card. Archive experiments remain on disk and off the public surface; see [docs/ARCHIVE.md](docs/ARCHIVE.md).

## Running locally

```bash
git clone https://github.com/alexkorol/WIZARD.git
cd WIZARD
python -m http.server --bind 127.0.0.1   # then open http://localhost:8000
```

Most tools are self-contained HTML. `tools/verdigris_splash` prefers HTTP because it uses ES modules.

## Verification

```bash
npm test
# or
node scripts/wizard-lab.mjs verify
node scripts/wizard-lab.mjs verify --full
```

`npm test` validates manifests, unique IDs, generated-registry freshness, and dashboard copy. `--full` also runs retained module-local tests.

Regenerate the registry after editing any `wizard.module.json`:

```bash
node scripts/wizard-lab.mjs generate
```

## Operating docs

- [Vision](docs/VISION.md)
- [Module standard](docs/MODULE_STANDARD.md)
- [Calibration workflow](docs/CALIBRATION.md)
- [Annotation standard](docs/ANNOTATION.md)
- [Integration contract](docs/INTEGRATION.md)
- [Archive policy](docs/ARCHIVE.md)
- [Adding a module](docs/ADDING_A_MODULE.md)
- [Generated files](docs/GENERATED_FILES.md)
- [Validation](docs/VALIDATION.md)
- [Standardization status](docs/WIZARD_STANDARDIZATION_STATUS.md)

Specialized module READMEs stay authoritative for that tool. Root docs do not replace them.

## License

MIT — see [LICENSE](LICENSE).
