# WIZARD

**W**eb-**I**ntegrated **Z**ero-lag **A**daptive **R**esource **D**ashboard — a toolbox of
AI-built interactive web experiments for game UI and visualization, served as a static
site from this branch.

**Live site:** [alexkorol.github.io/WIZARD](https://alexkorol.github.io/WIZARD/)

## Featured: Vessels of Life & Mana

![Vessels of Life & Mana](tools/wizard_orbs/screenshots/shot_hero.png)

A real-time ARPG health/mana orb system: one WebGL2 fragment shader compositing live
procedural liquids, statue relighting, and a status-effect simulation (poison, bleed,
reservation) into AI-generated art plates. Built with Claude Fable from a multi-model
asset pipeline — base render, orb mask, normal map, empty-glass plate, packed depth+AO,
and a petrified-stone plate, all aligned by silhouette-IoU.

[Live demo](https://alexkorol.github.io/WIZARD/tools/wizard_orbs/) ·
[Module README](tools/wizard_orbs/README.md) ·
[Predecessor (fully procedural v1)](https://alexkorol.github.io/WIZARD/tools/health_globe/)

## Tools

| Tool | Description |
|---|---|
| [Verdigris World Splash](tools/verdigris_splash/index.html) | Real-time Three.js menu world with atmospheric rim fog, shader waterfalls, and GPU droplets |
| [Vessels of Life & Mana](tools/wizard_orbs/index.html) | WebGL2 orb engine over AI-rendered plates; poison/bleed/reservation sim |
| [Health Globe v1](tools/health_globe/index.html) | The orb's predecessor — 100% procedural canvas, kept as a before/after comparison |
| [Geometric Skill Tree](tools/geometric_skilltree/index.html) | Hexagonal passive tree inspired by Path of Exile, with dual point system |
| [RPG Inventory](tools/rpg_inventory/index.html) | Drag-and-drop grid inventory with equipment slots and persistence |
| [Pixel Alchemy Sandbox](tools/pixel_sandbox/index.html) | Noita-style falling-sand playground with wands, hazards, and explosions |
| [Pixel Art Creator](tools/pixelart/index.html) | Grid-based pixel art editor with PNG export |
| [SLerp](tools/slerp/index.html) | Smooth color interpolation and palette generation for pixel art |
| [Interactive Word Cloud](tools/wordcloud/dist/index.html) | Force-directed concept cloud with animated relationships |
| [WordSphere](tools/wordsphere/index.html) | 3D spherical word visualization with momentum rotation |
| [Chronicles — RP Account Creator](tools/rp_account_creator/index.html) | Found a House, send scions to die, inherit their relics — permadeath meta-progression with scribe-judged names |
| [Wireframe Space Shooter](tools/space_shooter/index.html) | 3D wireframe space combat with radar and enemy variety |
| [The Endless Descent](tools/sokoban/index.html) | Infinite seeded Sokoban with solver-verified levels and measured difficulty progression |

## How these are built

Every tool here is AI-assisted, and the workflow has evolved with the models. Early
tools were single-prompt procedural generations; the current process is a multi-model
pipeline — concept art and asset plates from image models (GPT Image, Gemini /
Nano Banana), interactive engineering in Claude (Fable / Claude Code), with Codex
used for earlier iterations. The orbs module's [README](tools/wizard_orbs/README.md)
documents the most developed version of this process.

## Running locally

```bash
git clone https://github.com/alexkorol/WIZARD.git
cd WIZARD
python -m http.server   # then open http://localhost:8000
```

Most tools are single self-contained HTML files and also work opened directly.

## Structure

```
index.html        # landing page
tools/<name>/     # one folder per tool, each with its own index.html
                  # (larger tools carry their own README, src/, assets)
```

## License

MIT — see [LICENSE](LICENSE).
