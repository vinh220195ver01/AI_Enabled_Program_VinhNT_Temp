# Flaky test debugging

Loaded by `SKILL.md` step 4 when a test fails intermittently with no related code change.

## Confirm flakiness before treating it as such

A single failed-then-passed cycle does not confirm flakiness — it's equally consistent with a fix. Run the specific test at least 5-10 times in a row (`npx playwright test <spec> --repeat-each=10`, or the project's equivalent) before concluding it's flaky, and note the actual failure rate observed. A test that fails 1 in 20 runs is still worth root-causing, not shrugging off as "it's fine most of the time."

## Common non-obvious causes

| Cause | How to confirm |
|---|---|
| Shared/leftover state from a previous test (database row, localStorage, cookie) | Run the flaky test in isolation, then run it after the specific test that ran before it in the failing suite order — if isolation fixes it, this is the cause. |
| Animation/transition timing race | Slow down or disable animations in the test config (if the project supports it) and see if the failure rate drops to zero. |
| Network race between two async responses arriving in a different order under load | Check whether the test waits on a specific response vs. a generic "loaded" state; a generic wait can proceed before the response the assertion actually needs. |
| Test-level parallelism sharing a resource (same test account, same seeded record) two tests both mutate | Check the project's parallelism config and whether this test's fixture data is uniquely generated per run or shared/hardcoded. |
| Viewport/OS/browser-specific timing difference between local and CI runners | Reproduce with the same browser/OS combination CI uses, not just "any green run locally." |

## Fixing vs. quarantining

Fix the actual cause using the table above whenever it's identifiable within reasonable investigation time. Only mark a test as quarantined/retried (if the project has that mechanism) when the cause is external and not fixable from the test side (e.g. a genuinely unreliable third-party sandbox) — and say so explicitly rather than silently adding a retry that hides the instability from anyone watching the suite's health.

**NEVER** treat "add a retry" as equivalent to "fixed." A retried flaky test still fails at its underlying rate; it just costs more CI time to eventually pass, and a real regression can hide behind an already-flaky test's noise.
