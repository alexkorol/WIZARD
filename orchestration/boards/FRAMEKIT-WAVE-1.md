# FRAMEKIT WAVE 1 — board

**Goal:** build `tools/gui_framekit/` — a reusable, static, GitHub
Pages-compatible web GUI frame kit (dark arcane-lab aesthetic) that WIZARD
submodules can adopt, and that later ports to C++ for Verdigris.

**Program branch:** `codex/arcane-lattice-1-0`
**Base at wave open:** recorded by the first claim from `git rev-parse origin/codex/arcane-lattice-1-0`
**Wave coordination override (owner-approved, D-0001):** for this wave,
`orchestration/{fleet,claims,status}` writes by workers are allowed on the
program branch. Everything else in `orchestration/*` stays orchestrator-only.
GitHub-issue protocol is suspended for this wave; the bus replaces it.

## Coordination mechanics

- **Coordination push:** from a worktree based on
  `origin/codex/arcane-lattice-1-0`, commit your file, then
  `git push origin HEAD:codex/arcane-lattice-1-0`. Non-fast-forward →
  `git fetch origin && git rebase origin/codex/arcane-lattice-1-0`, re-decide,
  retry. Max 3 retries, then pick a different packet.
- **Claim SLA:** pushed claim within 10 min of session start. Heartbeat:
  rewrite `orchestration/status/<lane-id>.md` every ≤10 min.
- **Code:** worker branch `<lane>/<task>-<slug>`, PR to
  `codex/arcane-lattice-1-0`. Never `gh-pages`. Never merge your own PR.
- **Worktree:** `git worktree add Z:\Code\.worktrees\wizard-<lane> -b <lane>/coord origin/codex/arcane-lattice-1-0`
  (one worktree per lane; code branches check out inside it or a second
  worktree — your call, your capsule).
- **Ports:** two per lane from 8160–8179, lowest free; record in enrollment.
- **Review:** orchestrator (kimi-pc) reviews or routes; max 4 cycles, then
  `blocked`. REVISE outranks new work. After REVIEW_REQUESTED, claim the
  next READY packet immediately — never idle-poll.

## Acceptance (all packets)

1. Only owned paths changed (`git diff --name-only origin/codex/arcane-lattice-1-0...HEAD` proves it).
2. No build step; vanilla HTML/CSS/JS ES modules; works from
   `python -m http.server --bind 127.0.0.1 <port>` over HTTP.
3. All colors/spacing/typography via `--fk-*` tokens (INTERFACES.md), never
   hardcoded literals in component CSS.
4. JS passes `node --check`; demo page loads with zero console errors.
5. Evidence in status file: literal commands + output + a screenshot path
   (capture committed under your owned paths).

## Packets

| ID     | Packet                                                      | Owned paths                            | Depends |
| ------ | ----------------------------------------------------------- | -------------------------------------- | ------- |
| FK-101 | Design tokens + base reset                                  | `tools/gui_framekit/tokens/`, `base/`  | —       |
| FK-102 | Frame components: window, panel, dialog, nine-slice borders | `tools/gui_framekit/components/frames/`   | —       |
| FK-103 | Controls: button, input, slider, toggle, tabs               | `tools/gui_framekit/components/controls/` | —       |
| FK-104 | HUD: bars, globes, orbs, meters, buff icons                 | `tools/gui_framekit/components/hud/`      | —       |
| FK-105 | Inventory: grid, slots, item tooltip, drag ghost            | `tools/gui_framekit/components/inventory/` | —       |
| FK-106 | Overlays: modal, menu, toast, context menu                  | `tools/gui_framekit/components/overlays/` | —       |
| FK-107 | Procedural asset pipeline: nine-slice textures, sprites     | `tools/gui_framekit/assets/`, `tools/`    | —       |
| FK-108 | Showcase page importing every component per INTERFACES      | `tools/gui_framekit/demo/`, `index.html`  | —       |
| FK-109 | Adoption guide + audit of existing submodule UI patterns    | `tools/gui_framekit/docs/` (read-only elsewhere) | —       |

All packets are INDEPENDENT: `tools/gui_framekit/INTERFACES.md` freezes token
names, component layout, and demo paths, so nothing blocks on FK-101. FK-108
lights up as components land — build it against the frozen paths and stub
states. FK-109 reads other submodules but writes only inside its owned path.

## Wave 2 (queued, not claimable yet)

Normalize existing submodules onto the frame kit, one packet per submodule;
then the C++ port planning packet for Verdigris. Released by the orchestrator
once wave-1 packets reach `accepted`.

## Notes

- Design reference images (dark arcane-lab UI kit, owner-supplied):
  `orchestration/boards/framekit-ref/ref-01.png` … `ref-11.png` — FK-101 /
  FK-102 / FK-107 lanes should match this aesthetic at claim time.
