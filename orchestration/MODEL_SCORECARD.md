# Model scorecard (empirical; the unit is model × harness × task family)

Tiny samples — every row is calibration-in-progress, not identity.
Recalibrate after model, harness, prompt, or acceptance changes.
Companion to the Verdigris scorecard; WIZARD rows only.

| Model+harness | Task family | N | First-pass accept | False greens | Notes / best packet |
|---|---|---|---|---|---|
| Cursor Grok 4.6 High (cloud agent) | WIZARD-wide standardization (manifests, registry, dashboard, shared layer, bench) | 1 | 0% (accepted cycle 2) | 1 (mislabeled narrow capture, INC-W004) | Large BOUNDED-DESIGN packet delivered coherently in 9 milestone commits: honest capability flags, honest "known limitations", correct non-mutation boundary, working adapter bridge. Cycle-2 fix was minimal, correctly scoped, and repaired the brittle oracle instead of mutating the artifact. Evidence discipline is the weak axis, not design. |
| Fable (supervisor) | packets, reviews, integration, merges | 1 | — | 0 | Caught both P1s by rerunning gates and opening captures personally (G5). Missed the owner-visible first-screen regression (INC-W006) because the contract it wrote had no such gate. |
| Qwen 3.8 ~27B (LM Studio 0.4.21, MLX 1.11.0, MacBook via Tailscale) | connectivity + micro-task probes | 5 | 0% | 0 (honest empties) | EXPERIMENTAL — DO NOT DISPATCH. Endpoint reachable, ~15 tok/s. Defect: thinking phase does not terminate on real tasks — 2,499/2,499 tokens reasoning, empty content, 165 s, on a one-line bash ask at temp 0. `/no_think` ignored. `chat_template_kwargs: {"enable_thinking": false}` worked on a trivial echo (4.4 s, real content) but NOT on the same bash ask (399/399 reasoning, empty). Engine/template issue with the new `qwen3_5` arch, fixable only on the Mac (newer MLX engine, different quant, or LM Studio reasoning settings). Re-probe after any change there. If it lands, lane is MECHANICAL, evaluation/offline tasks; latency rules it out of interactive loops. |

## Calibration notes

- Grok 4.6 High handled a wide, cross-cutting packet without inventing
  scope and without faking capabilities — it declared unsupported
  adapter methods rather than stubbing them. Treat it as viable for
  BOUNDED-DESIGN at repo scale, not merely MECHANICAL.
- Its one recurring risk is **evidence**, not implementation: a capture
  labelled as something it was not, and a first instinct to reflow a
  document rather than fix a brittle test. Both are cheap to gate; keep
  G5 (supervisor opens every capture) and the modified-tests disclosure
  rule in force for this lane.
- Supervisor lesson: an exhaustive machine-checkable contract can still
  be owner-blind. Contract quality is now measured by whether the owner
  agreed with the result on sight, not only by gate count.
