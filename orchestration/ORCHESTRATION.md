# WIZARD orchestration constitution

Short, curated, architect-owned. Adapted 2026-08-19 from the Verdigris
setup (`Z:\Code\Games\delaford\delaford_game\orchestration`), which is
the source of these rules; everything here is either carried over
verbatim in spirit or re-derived from a WIZARD incident. Local verified
evidence outranks external advice.

Companion files: `STANDING-LOOP.md` (worker contract), `ACCEPTANCE.md`
(gate registry), `INCIDENTS.md` (append-only ledger), `RUN_STATUS.md`
(current truth, rewritten each sweep), `MODEL_SCORECARD.md`
(calibration).

## Prime directive

Optimize owner-visible, accepted progress per unit of wall time and
cost — not agent utilization, tokens, commits, or coordination volume.

WIZARD's standing objective: remain the Verdigris Systems Laboratory —
a static, GitHub Pages-compatible set of calibration, authoring,
presentation, and integration benches that feed Verdigris.

## Deploy hazard (WIZARD-specific, read first)

`gh-pages` is the default branch **and** the live site. Merging a PR
deploys it. Therefore:

- Never merge to `gh-pages` without the full acceptance contract green.
- Never merge on a stale base; confirm `MERGEABLE` and re-check the
  head SHA immediately before merging.
- Asset pins (`?v=`) get bumped when cached assets change.
- Only the supervisor merges. Workers never merge, never push to
  `gh-pages`, never force-push anything.

## Roles and authority (authority is narrower than capability)

- **Supervisor / architect (Claude Fable):** architecture, task packets,
  reviews, verdicts, integration, merges, and every file in
  `orchestration/`. May write scaffolding (interfaces, risky logic,
  failing tests) *before* a wave. Any supervisor implementation beyond
  scaffolding or a trivial copy fix becomes its own tracked, reviewed
  change.
- **Workers (Cursor/Grok, other harnesses):** implement on their OWN
  branch in their OWN worktree/clone. They write their own structured
  status comments and their own evidence. They never edit peer branches,
  peer evidence, `orchestration/*`, or the task packet itself.
- **Owner (Alex) only:** product naming, lore, art direction, balance,
  GitHub settings/branch protection, irreversible or account-level
  actions, and any call the packet did not already settle.

Contradictory directives, or an unexpected competing write to a surface
you own, means STOP, preserve state, and escalate in the issue. Never
defeat a peer's work to win a race.

## Workspace isolation (mandatory — INC-W003)

- `Z:\Code\WIZARD` is the OWNER's + supervisor's primary checkout.
  Other harnesses must not switch branches or mutate git state there.
- Every additional harness gets its own worktree under **one** parent:
  `Z:\Code\.worktrees\wizard-<role>` (e.g. `wizard-fable-supervisor`,
  `wizard-cursor-revamp`). Never create sibling folders next to the repo
  in `Z:\Code` — that is what turned the drive root into a junk drawer.
- Retire a worktree when its branch merges: `git worktree remove` (or
  `move` it out), then `git worktree prune`. A worktree whose session is
  still running will refuse to move; that is a lock, not an error —
  close the session first.
- Exchange work only through `origin` pushes. A branch switch inside
  someone else's checkout silently diverts their in-progress commits.

## Local servers and ports (imported from Verdigris INC-009)

Any new process binding a non-loopback socket pops a Windows Firewall
consent dialog that sits unanswered while the owner is away, silently
stalling unattended agents.

- **Always bind loopback explicitly.** `python -m http.server` defaults
  to `0.0.0.0` — always pass `--bind 127.0.0.1`.
- Port capsules: supervisor `8120–8129` · Cursor `8140–8159` ·
  additional harnesses get their own range on assignment.
- Never change firewall settings from an agent; that is an owner action.

## Topology-first dispatch

Label every task before routing: INDEPENDENT / PIPELINED / COUPLED /
EXPLORATORY.

- COUPLED or sequential shared-state work stays with ONE strong agent.
- INDEPENDENT bounded work may fan out, but only on disjoint owned
  paths.
- PIPELINED work releases only when its prerequisite is ACCEPTED.
- EXPLORATORY fan-out must assign deliberately different hypotheses;
  identical prompts are correlated, not independent.

Spawn gate — all YES before a packet goes `cursor-ready`: discrete
deliverable? owned + forbidden scope explicit? interfaces frozen (or
exactly one task owns freezing them)? base commit recorded? ports
isolated? exact acceptance commands stated on the default path? review
capacity exists? parallelism actually shortens the critical path?

WIP budget: supervisor + 3 workers at current review bandwidth.

## Packet types (typed by JOB, not by model ego)

- **MECHANICAL** — exact steps, exact paths, scaffolding pre-written by
  the supervisor, mechanical self-check per step.
- **BOUNDED-DESIGN** — interfaces and invariants pinned; local design
  freedom inside them; evidence format specified.
- **ARCHITECTURE** — supervisor only.

Never leave cross-cutting design (schema shapes, adapter seams,
persistence, protocol) to a worker packet.

## GitHub-native protocol

WIZARD coordinates through GitHub itself, not through task folders.

- The **issue** is the canonical task packet: `WIZARD-REVAMP-NNN` in the
  title, full contract in the body. After it goes `cursor-ready` the
  packet is immutable; corrections arrive only as review verdicts.
- The **claim** is the `cursor-running` label plus a `CLAIMED` status
  comment naming the actor and branch. First claim wins.
- Status lives in structured comments marked `<!-- wizard-orchestration:v1 -->`
  in the worker and supervisor formats defined in the packet.
- Lifecycle: `cursor-ready` → `cursor-running` → `review-requested` →
  (`revise` → `cursor-running` …) → `accepted` + `ready-to-merge` →
  merged → issue closed. Dead ends: `blocked`.
- Max **four** review cycles, then `blocked` with a concise reason.
- Never review the same head SHA twice unless a check changed state;
  never issue a verdict against a SHA you did not inspect; never accept
  a SHA that is no longer the PR head. A new head invalidates prior
  acceptance evidence.
- The owner is never a message relay.

## Continuous operation (INC-W001 — owner directive)

No agent stops or idle-polls while waiting on a peer. An agent that
stops needs a human to restart it, which defeats hands-free operation;
an agent that polls burns paid tokens producing nothing.

- Workers follow `STANDING-LOOP.md`: after requesting review they move
  immediately to the next work item on a **stacked follow-up branch**,
  never pushing to the head under review (a new head invalidates the
  review in flight).
- The supervisor reviews a new head as soon as it appears rather than
  waiting for the next scheduled sweep; no-change sweeps must be cheap
  and must post nothing.
- An empty board is a BACKOFF (real sleep, doubling), not a stop.

## Rule lifecycle

Learnings carry status: OBSERVATION → HYPOTHESIS → EXPERIMENT → RULE →
RETIRED. A RULE must name its enforcement (gate, script, CI, label,
permission); prose-only rules are hypotheses. Incidents append to
`INCIDENTS.md`; calibration lives in `MODEL_SCORECARD.md`; current truth
in `RUN_STATUS.md` (rewritten, not appended).

## Enforcement backlog (deterministic controls to add)

1. Branch protection on `gh-pages` (OWNER action — GitHub settings).
2. CI stale-base check: PR diff vs current tip on dashboard/registry
   surfaces.
3. A first-screen capture script for dashboard changes (hard-fail if the
   module grid starts below a threshold) — closes INC-W006 mechanically.
4. `--bind 127.0.0.1` asserted in any committed launch config.
