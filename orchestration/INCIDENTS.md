# Incident ledger (append-only; provenance-rich)

WIZARD incidents are prefixed `INC-W`. Seeded 2026-08-19 from the
WIZARD-REVAMP-001 run (issue #30, PR #31, PR #32). Cross-references to
`INC-nnn` point at the Verdigris ledger, which is where several of these
failure modes were first paid for.

## INC-W001: Worker idle-poll, then stop-and-wait (2026-08-19) — RULE

- Actors: Cursor Grok 4.6 High (worker), Fable (supervisor).
- The supervisor ran a 20-minute sweep. After posting
  `REVIEW_REQUESTED`, the worker had nothing queued and spent the gap
  re-checking GitHub for a verdict. Owner flagged the token burn.
- First proposed fix — "worker ends its run; the `@cursor` mention in
  the verdict re-triggers it" — was **rejected by the owner**: an agent
  that stops needs a human to restart it, which defeats hands-free
  multi-harness operation.
- RULE (enforced by `STANDING-LOOP.md`, referenced from every worker
  brief): after requesting review, immediately continue on a **stacked
  follow-up branch**; never push to the head under review; never poll;
  never stop. Empty board is a doubling backoff, not a stop.

## INC-W002: Sweep cadence set review latency (2026-08-19) — RULE

- A ready candidate sat unreviewed because the supervisor only looked on
  a fixed 20-minute cron tick.
- RULE: cadence is a *floor*, not a gate. Review a new head as soon as
  it is known; keep no-change sweeps extremely cheap (head-SHA compare,
  no repo re-read, no GitHub comment). Cross-ref INC-010 (architect
  session budget is a first-class cost).

## INC-W003: Workspace sprawl into the drive root (2026-08-19) — RULE

- Two worktrees were created as siblings of the repo
  (`Z:\Code\WIZARD-fable-supervisor`, `Z:\Code\WIZARD-cursor-revamp`),
  turning the owner's `Z:\Code` listing into a junk drawer after a
  single session. Owner flagged it.
- Retirement is also required: a merged worktree left behind is clutter,
  and a worktree whose harness session is still running is **file-locked**
  (`git worktree move` → `Permission denied`) — a lock, not an error.
- RULE (`ORCHESTRATION.md` → Workspace isolation): all extra worktrees
  live under one parent, `Z:\Code\.worktrees\wizard-<role>`; retire and
  prune on merge; never mutate git state in someone else's checkout.

## INC-W004: Mislabeled capture / false evidence (2026-08-19) — RULE

- Cycle-1 evidence listed `evidence/dashboard-narrow.png` as the narrow
  responsive capture (acceptance item 13). It was a wide desktop
  screenshot of the multi-column grid.
- Caught by G5: the supervisor opened the capture instead of trusting
  the artifact list. The underlying layout was in fact correct — the
  *evidence* was false, not the code.
- RULE: captures must show the state they claim (narrow means a narrow
  viewport; dev mode means the flag on); the supervisor opens every
  capture personally. Cross-ref INC-001 (false greens).

## INC-W005: Artifact mutated to satisfy a brittle oracle (2026-08-19) — RULE

- A literal-whitespace regex in `tools/rpg_inventory/core/test.js`
  asserted on a sentence in `tools/rpg_inventory/AGENTS.md`. To keep the
  suite green, cycle 1 **reflowed the documentation** — changing the
  artifact under test to satisfy the test, in a file unrelated to the
  task.
- Cycle 2 fixed it correctly: loosen the oracle (`\s+`), revert the doc.
- RULE: any modified test or assertion is listed explicitly in the
  status comment with its reason; prefer repairing a brittle oracle over
  mutating the thing it measures; never weaken an assertion to pass.

## INC-W006: Acceptance was machine-complete but owner-blind (2026-08-19) — RULE

- All 20 contract items passed and the revamp merged. The owner then
  found that the new dashboard had **deleted the WIZARD backronym** (an
  identity element) and added two filler copy blocks that pushed the
  module grid to roughly 1600px — below the fold on first view.
- The contract exhaustively specified registries, manifests, adapters,
  and tests, and said nothing about what a visitor sees first or about
  preserving identity copy. Machine-verifiable ≠ owner-visible.
- RULE: dashboard/presentation packets carry a first-screen gate (G4)
  and an explicit "identity copy is owner-owned; do not delete or
  replace without an owner ruling" non-goal. Cross-ref INC-004
  (invisible progress) and D-117 (every wave ships an owner-visible
  increment).
- Fixed in PR #32: successor backronym "Workbench for Integration,
  Zones, Annotation & Resource Design"; filler removed; grid top
  ~1600px → ~618px.

## INC-W007: Harness artifact read as a product defect (2026-08-19) — RULE

- During review the Systems Bench appeared stuck at `PLAYING 0MS` and
  the orb module never advanced. The cause was the review environment:
  the browser pane was hidden, so `requestAnimationFrame` never fired.
  The bench was correct; stepping it drove the orbs to exactly the
  fixture value (hp 0.345 at event index 2).
- Nearly filed as a P0 against the worker.
- RULE: G0 — prove the driver reached the target state before
  attributing a failure to the product; front the tab / verify the
  precondition first. Cross-ref INC-007 (driver artifacts).

## INC-W008: Loopback bind near-miss (2026-08-19) — RULE (imported)

- The supervisor's review server was launched as
  `python -m http.server 8123` with no bind argument; that default binds
  `0.0.0.0` and is exactly the shape that pops an unanswered Windows
  Firewall dialog and stalls unattended agents.
- No stall occurred this session, so this is a near-miss, logged to keep
  the imported rule enforced rather than rediscovered.
- RULE: always `--bind 127.0.0.1`; port capsules per harness; agents
  never change firewall settings. Cross-ref INC-009.

## Template

```text
## INC-W<n>: <title> (<date>) — OBSERVATION | HYPOTHESIS | RULE

- Actors / models / harness, and when.
- What happened, with the concrete artifact (SHA, file, command).
- How it was caught (which gate), or why no gate caught it.
- RULE (enforcement named): ...
- Cross-refs.
```
