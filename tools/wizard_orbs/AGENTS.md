# wizard_orbs — agent pointers

Read `CLAUDE.md` in this folder before editing anything. Its **Invariants**
section is binding for all agents and all repo-wide passes (unification,
standardization, perf, cleanup — no exception).

Hard rules, enforced by `tests/wizard-orbs-invariants.test.mjs` (runs in
`node scripts/wizard-lab.mjs verify` and CI):

1. `src/assets/mask.png` stays byte-identical to `src/assets/mask_baseline.png`.
   Never "recarve" or regenerate the mask. The statue cutouts are already in it.
2. `ORB_VIEW` in `src/template.html` stays the full art frame
   `{ x0: 0, y0: 0, x1: 1672, y1: 941 }`. Never crop the overlay for perf —
   the orb glow reaches the plate edges; perf belongs to the quality presets.
3. The fragment shader never uses `discard` — mask-black pixels carry the
   light spill and statue relighting.
4. `index.html` is a build artifact. Never edit it by hand; edit `src/` and
   run `python3 build.py`, and commit the rebuilt `index.html` with the change.

History: the Aug-2026 unifying pass violated 1–3 and the breakage survived
four follow-up fix PRs (#97, #98, #103, #104) because each patched symptoms.
If the demo looks wrong, diff `src/` against the June original archived in
`tmp/orbs-original/wizard-orbs/` before writing any fix. If the invariants
test blocks your change, the answer is to change your approach, not the test.
