# WIZARD surge board

Snapshot for the MacBook supervisor lane. GitHub issues are the canonical,
immutable task packets; this file is only a dependency and capacity view.

Base used for initial packets: `4c0e2c043602596dc193a68045f2c4f784b2c48c`.
All candidates must still rebase or merge current `gh-pages` and pass current
acceptance before review or merge.

## Running

| Issue | Actor | Branch | Scope |
|---|---|---|---|
| [#37](https://github.com/alexkorol/WIZARD/issues/37) `WIZARD-SURGE-001` | `OX_WIZARD_VISUAL` | `codex/ox-wizard-visual-surge-001` | framepack research and correction packet |

## Accepted and shipped

| Issue | Inspected head | Production merge | Result |
|---|---|---|---|
| [#49](https://github.com/alexkorol/WIZARD/issues/49) `WIZARD-SURGE-013` | `a648411` | `b9f7f35` | recursive manifest validation, safe paths, deterministic registry, negative fixtures |

## Ready, unclaimed

| Issues | Lane |
|---|---|
| [#38](https://github.com/alexkorol/WIZARD/issues/38)–[#42](https://github.com/alexkorol/WIZARD/issues/42) | framepack gallery, placeholders, visual tokens audit, first-screen, accessibility/responsive |
| [#43](https://github.com/alexkorol/WIZARD/issues/43)–[#48](https://github.com/alexkorol/WIZARD/issues/48) | Systems Bench, loopback, stale-base, deploy smoke, archive plan, capability audit |
| [#50](https://github.com/alexkorol/WIZARD/issues/50)–[#51](https://github.com/alexkorol/WIZARD/issues/51) | annotation/state bridge and asset ingestion |

Count: **13** valid `cursor-ready`, unclaimed packets after the two active
claims. Lifecycle labels deliberately keep the established `cursor-*`
semantics even though actual actor IDs are Ox lanes.

## Sequenced successors

```text
#40 typography audit ───────────────> #52 shared tokens ───────┐
#39 placeholder frames ────────────────────────────────────────┼─> #61 rollout
#38 gallery + #39 placeholders ─────> #53 gallery registration│
                                                                │
#48 capability audit + #50 bridge ──> #54 Cartographer adapter │
                                    ├> #55 Mason adapter       │
                                    ├> #57 Splash adapter      │
                                    └> #58 Chronicles adapter  │
#43 Bench + #48 + #50 ──────────────> #56 Inventory adapter    │
#43 Bench + #50 ────────────────────> #60 zone/annotation bench│
PR #29 merged + #48 + #50 ─────────> #59 Arcane adapter       │
OWNER-INPUT-001 + #51 ingestion ───> #62 selected asset pack  │
#47 archive plan + owner ruling ────> #63 redirects            │
#41/#42/#44/#45/#46/#49 ───────────> #64 canonical CI         │
```

Successor issues are [#52](https://github.com/alexkorol/WIZARD/issues/52)
through [#64](https://github.com/alexkorol/WIZARD/issues/64). They remain
without `cursor-ready` until prerequisites are accepted and their exact base
and frozen prerequisite SHAs are refreshed.

## Owner input

[#65](https://github.com/alexkorol/WIZARD/issues/65), `OWNER-INPUT-001`, is
the first durable batched packet. It recommends a restrained forged-bronze and
verdigris direction and includes alternatives, a complete GPT Image-2 prompt,
dimensions, negative instructions, filenames, target folder, acceptance
rubric, derivative roles, deterministic post-processing, and the placeholder
continuation plan. It blocks final raster selection only.

## Coverage map

- Visual language: #37–#42, #52–#53, #61–#62.
- Shared adapters: #54–#59.
- Systems Bench beyond resource session: #43 and #60.
- First-screen, responsive, accessibility: #41–#42.
- Loopback, stale base, live deploy: #44–#46 and #64.
- Archive and redirects: #47 and #63.
- Capabilities, manifests, state, annotations: #48–#50 and #64.
- Asset ingestion and derivative maps: #51 and #62.

No successor is filler: each has a named prerequisite, owned surface, owner
value, acceptance shape, and release gate in its GitHub packet.
