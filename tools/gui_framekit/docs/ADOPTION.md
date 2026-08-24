# Adopting gui_framekit — guide for WIZARD submodules (FK-109)

This guide tells a submodule owner how to move their UI onto the frame kit,
and records the audit of current submodule styling that motivated the token
set. Contract of record: `tools/gui_framekit/INTERFACES.md` (frozen).

## Why

Today every submodule hand-rolls its own dark palette. The audit below found
the same near-black surfaces and brass/verdigris accents re-implemented with
different literals in at least five modules — drift that makes one module's
"panel" look subtly wrong inside another's page. The kit freezes those
shared values once, as `--fk-*` custom properties.

## Audit snapshot (2026-08-24, wave 1)

| Module | Styling today | Observed surface literals | Kit fit |
| --- | --- | --- | --- |
| `tools/rpg_inventory` | inline `<style>` blocks in `index.html` (~51 style hits), hex backgrounds + gradient panels | `#0b0a08`, `#0d0c0a`, rgba(22,20,17,…)/rgba(9,8,7,…) | Direct: surfaces already match `--fk-bg-0/1/2`. Grid/slot/tooltip map 1:1 onto FK-105 components. |
| `tools/health_globe` | small scoped CSS w/ local `--panel`/`--panel-dark` vars | `#0d0c12`, `#16121b` | Direct: is essentially an fk-globe; adopt `.fk-globe` and drop local globe CSS. |
| `tools/geometric_skilltree` | heavy inline styles (68 style hits), uses `color-mix` over its own vars | `#14110d` + node-active accents | Partial: adopt tokens for surfaces/borders; keep graph-specific vars, but source them from `--fk-*` where they are colors. |
| `tools/arcane_lattice` | inline styles, purple-leaning palette | `#05060f`, `#2a3550`, `#6a5acd` | Partial: furthest from the kit palette; either accept `--fk-accent` brass or register a documented accent override — do not fork the token file. |
| `tools/mason` | already var-driven (`--bg`, `--panel`) | `#171613` | Easiest win: alias its three locals to `--fk-bg-*`/`--fk-bg-1` and delete the hexes. |
| `tools/verdigris_splash` | separate `styles.css`, many unique hex literals (10+ near-black variants) | `#010405` … `#061014` | Later (wave 2): splash has bespoke art direction; normalize only its chrome, not the scene rendering. |

Pattern conclusions: (1) surfaces cluster tightly around `#0d0c0a`–
`#171613`, validating the frozen `--fk-bg-0..2`; (2) accents split between
brass (`#c9a227` family) and verdigris teal, both frozen as `--fk-accent`
and `--fk-accent-2`; (3) the main debt is *inline* `<style>` in HTML files —
adoption should extract component usage first, then dedupe literals.

## How to adopt (per submodule)

1. **Link tokens** in your page head:
   `<link rel="stylesheet" href="<rel>/gui_framekit/tokens/tokens.css">`.
2. **Replace surface/border/type literals** with the frozen tokens
   (`--fk-bg-*`, `--fk-border*`, `--fk-font*`, `--fk-space-*`). Allowed to
   keep: layout-only values (widths of bespoke widgets) and art-directed
   scene colors.
3. **Swap components where they exist**: buttons → `.fk-button`, inputs →
   `.fk-input`, range inputs → `.fk-slider`, checkboxes → `.fk-toggle`,
   resource bars/globes → `.fk-bar`/`.fk-globe`, inventory cells →
   `.fk-slot` inside `.fk-grid`, notifications → `.fk-toast`. Component
   links live in `INTERFACES.md` (frozen paths); each ships a standalone
   `demo.html` to copy from.
4. **Delete superseded local CSS** — the point is one visual language.
   Keep a short "we alias X to Y" note if you must bridge.
5. **Verify**: load your page via `python -m http.server --bind 127.0.0.1`;
   zero console errors; screenshot into your own evidence dir.

## Rules recap (binding)

- No build step; ES modules only.
- Component CSS never hardcodes color/length literals (exceptions per
  INTERFACES.md).
- Never edit `tokens/tokens.css` or `INTERFACES.md` outside an orchestrator
  D-numbered change.
- Never deploy or branch-switch `gh-pages`.

## Wave 2 preview

Per-submodule normalization packets will be cut from this audit's table;
modules are ordered by fit (mason → health_globe → rpg_inventory →
geometric_skilltree → arcane_lattice → verdigris_splash). A C++ port
planning packet for Verdigris follows once wave 1 is accepted.
