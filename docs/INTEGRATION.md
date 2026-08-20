# Integration contract

Systems Bench (`tools/systems_bench`) plays a versioned fixture of generic events. It is not the production Verdigris network protocol.

## Event envelope

```json
{
  "schemaVersion": 1,
  "sequence": 42,
  "timeMs": 1560,
  "type": "resource.changed",
  "source": "actor:player",
  "target": "actor:player",
  "data": {
    "resource": "life",
    "current": 38,
    "maximum": 110
  }
}
```

## Boundaries

- Do not embed authoritative combat simulation in the dashboard.
- Drive one retained module at a time through the shared adapter or `postMessage` bridge.
- Prefer resource events → Vessels of Life & Mana.
- Do not change Arcane Lattice adjacency, path revalidation, instability, or undo in order to integrate.
