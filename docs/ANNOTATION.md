# Annotation standard

Shared schema: `schema/wizard.annotation.v1.schema.json`. Runtime: `shared/wizard-annotations.js`.

## Types

`idea`, `placement`, `bug`, `balance`, `visual`, `question`, `preserve`.

## Anchors

- **semantic** — module target id (node, conduit, event, item, …)
- **world** — world/tree coordinates
- **screen** — normalized `[0,1]` viewport point
- **region** — approximate axis-aligned area in the module's coordinate space

## Persistence

Annotations are serializable, stored in `localStorage` under a module-scoped key, exportable/importable, and included in agent-feedback Markdown. They are **not** canonical game or module state.

## Passive tree layers (strict)

| Layer | Store | May change authored tree-data.js? |
|---|---|---|
| Canonical authored tree | `assets/tree-data.js` | only via an explicit future promotion action |
| Playable allocation | build code / runtime `active` flags | no |
| Player notes | build-code `a` payload | no |
| Owner design proposals | `wizard.proposals.geometric-skilltree.v1` | **no** |

Designer mode (`?design=1`) can still apply *local seat overrides* for live inspection. That is not proposal promotion.
