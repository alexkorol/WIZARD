# Claim: FK-108

- **Task:** FK-108 — Showcase page importing every component per INTERFACES
- **Owned paths:** `tools/gui_framekit/demo/`, `index.html`
- **Lane id:** wizard-desktop-tvu7or7-opencode-1
- **Worker branch:** `wizard-desktop-tvu7or7-opencode-1/FK-108-showcase`
- **Base SHA:** stacked on FK-102 head 58156ff (showcase imports the frozen
  component paths; tokens + base + frames exist there today, other groups
  render as styled stub states per the board's "lights up as components
  land" rule). Program-branch base for the PR: codex/arcane-lattice-1-0.
- **Timestamp:** 2026-08-23 18:57 -07:00

Scope note: root `index.html` is the generated dashboard (AGENTS.md: cards
are added only via `tools/<slug>/wizard.module.json` + generator; that
manifest path is NOT in this packet's owned paths, and hand-editing cards
is forbidden repo-wide). This lane therefore delivers the showcase under
`tools/gui_framekit/demo/` and leaves root `index.html` untouched unless
the orchestrator directs a generated-dashboard change; any dashboard card
for gui_framekit should ride the manifest flow in a follow-up.
