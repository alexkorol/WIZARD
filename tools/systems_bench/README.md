# Verdigris Systems Bench

Fixture playback bench for retained Verdigris integration seams. Select a
versioned session, play / pause / step / reset it, inspect the raw event, and
export the playhead plus target state.

This is not the production Verdigris network protocol and does not run
authoritative gameplay simulation.

## Run

Open `tools/systems_bench/index.html` from the static site (HTTP recommended so
the resource iframe and fixture catalog can load).

## Fixture catalog

`fixtures/catalog.v1.json` lists the available sessions and their inert target
views.

- `fixtures/resource-session.v1.json` — the original life/mana session. It
  remains compatible with the Vessels adapter through `postMessage`.
- `fixtures/inventory-state.v1.json` — explicit inventory-state snapshots
  rendered by a preview adapter inside the Bench. It does not load or modify
  VesselForge.

The inventory session uses the shared event envelope with type
`inventory.state.changed`. Each event carries a complete `stateVersion: 1`
snapshot containing `gold`, `inventory`, and `equipment`. The preview copies
that recorded state; it does not calculate item legality, stats, prices,
equipment rules, or any other gameplay outcome.

`fixtures/inventory-state.invalid.v1.json` is a negative test fixture and is not
listed in the catalog.

## Export

`Export session` writes calibration JSON including the fixture identity,
playhead, applied events, raw fixture events, and the inert target state.
