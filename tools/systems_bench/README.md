# Verdigris Systems Bench

Minimal fixture playback bench. Load a versioned event envelope, play / pause / step / reset, inspect raw payloads, and drive **Vessels of Life & Mana** through the shared adapter (`postMessage` + `WizardModule.applyEvent`).

This is not the production Verdigris network protocol.

## Run

Open `tools/systems_bench/index.html` from the static site (HTTP recommended so the orb iframe can load).

## Fixture

`fixtures/resource-session.v1.json` — a short life/mana resource session.

## Export

`Export session` writes calibration JSON including the fixture, playhead, and last applied events.
