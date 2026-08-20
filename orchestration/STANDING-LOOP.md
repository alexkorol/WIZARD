# Standing loop — canonical worker contract (v1, 2026-08-19)

Single source of truth for every WIZARD worker's continuous-mode goal.
Substitute NAME (e.g. `cursor-grok`), WORKTREE path, and PORTS. Goal
texts in briefs must reference this file and must not drift from it.

Adapted from the Verdigris `STANDING-LOOP.md`, plus the WIZARD owner
directive that no agent may stop or idle-poll (INC-W001).

## The loop

Repeat forever:

1. In WORKTREE: `git fetch origin` and rebase/merge `origin/gh-pages`.
   Read `orchestration/RUN_STATUS.md`, `ORCHESTRATION.md`,
   `ACCEPTANCE.md`.
2. Check your open PRs for a new supervisor verdict. **A `REVISE` on
   your work outranks everything** — fix it and re-request review first.
3. Otherwise claim the highest-priority unclaimed `cursor-ready` issue
   (apply `cursor-running`, post a `CLAIMED` status comment naming your
   actor id, branch, and base SHA).
4. Implement per the packet: owned paths only, exact acceptance commands
   from `ACCEPTANCE.md`, literal transcripts, real captures, your PORTS
   only, loopback binds.
5. Post `REVIEW_REQUESTED` with the head SHA and evidence — then **loop
   to step 1 immediately without waiting for the review.**

## Never idle, never stop (INC-W001)

While a head of yours is under review:

- Do NOT poll for a verdict, and do NOT end your run. Both are failures:
  polling burns tokens producing nothing, and stopping requires a human
  to restart you.
- Do NOT push to the branch under review. A new head invalidates the
  review in flight and wastes the supervisor's completed work.
- DO open a **stacked follow-up branch** (`<name>/<task>-002-<slug>`,
  based on the head under review) and work the next item: deferred
  scope from the packet, the backlog in `RUN_STATUS.md`, or hardening
  and test coverage for what you just shipped.
- When the reviewed head merges, rebase the stack onto `gh-pages` and
  open the follow-up PR.

## Empty-board backoff

If no `cursor-ready` issue exists after a fetch: post one line to your
own notes (never into a task's status thread), then run a real sleep
(`powershell -Command "Start-Sleep 900"`), re-check, and DOUBLE the
sleep up to 3600s while the board stays empty. Never spin instant-fetch
cycles. An empty board is a BACKOFF, not a stop.

## Claim semantics

- A claim IS: the `cursor-running` label plus a committed `CLAIMED`
  structured comment with actor id, branch, and base SHA. First claim
  wins; back off if another actor holds one.
- Nothing else is a claim. A stale comment, a question, or an
  abandoned branch is not a claim.
- Board-level notes go in your own notes file or your own PR — never
  into another actor's thread.

## Evidence discipline

- Every claimed check ships its literal command and output. "PASS"
  without a transcript is not evidence (INC-W004).
- Captures must show the state they claim to show: a "narrow" capture is
  taken at a narrow viewport; a "dev mode" capture is taken with the
  flag on. The supervisor inspects captures personally and a mislabeled
  one is a false green.
- **Any test or assertion you modified must be listed explicitly** in
  your status comment with the reason. A test the implementer can
  rewrite is not an oracle.

## Stop conditions

Quota nearly exhausted (say so in your notes), a genuine blocker the
packet did not settle (post `BLOCKED` with the reason), or the owner /
supervisor says stop. Nothing else.

## Always forbidden

Merging to `gh-pages`; force-pushing; editing peer branches, peer
evidence, or `orchestration/*`; touching another harness's worktree,
ports, processes, or credentials; weakening an assertion to make a gate
pass; claiming work you have not actually run.
