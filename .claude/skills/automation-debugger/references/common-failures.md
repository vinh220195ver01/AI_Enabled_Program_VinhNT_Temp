# Failure classification

Loaded by `SKILL.md` step 1, before forming any fix hypothesis.

| Symptom pattern | Classification | First check |
|---|---|---|
| `strict mode violation`, `locator resolved to N elements`, `element not found` | Locator failure | Did the DOM structure change, or was the locator always ambiguous? → `locator-debugging.md` |
| `Timeout Xms exceeded waiting for...` on an action or assertion | Timeout | What condition was it actually waiting for, and did that condition ever become true? → `timeout-debugging.md` |
| Assertion fails on a *value* (wrong price, wrong text) but the element was found fine | Test-data issue | Is the expected value hardcoded and stale, or does it depend on seed/fixture data that changed? Check the design's bound test data, not the locator. |
| Fails in CI but passes locally, or vice versa | Environment drift | Compare Node/Playwright/browser versions, base URL, and env vars between the two. Check whether a fixture or seed step that runs locally is skipped in CI. |
| Test failed for a reason unrelated to what it's testing (e.g. app crashed, 500 error, console error unrelated to the scenario) | Application defect | Confirm by reproducing the same action manually/via curl outside the test. Report — do not silently route around it. |
| Test logic itself is wrong (e.g. asserting on the wrong locator, off-by-one in a loop, race in the test's own setup) | Automation defect | Re-read the test against the Auto Test Case design it was generated from — does the implementation actually match the approved design? |
| Passes most of the time, fails occasionally with no code change | Flaky | → `flaky-test.md`. Do not fix ad hoc without following that reference's repeated-run protocol. |

## Fast disambiguation between locator failure and timeout

Both often surface as "couldn't find element," but the Playwright error text distinguishes them: a strict-mode or "resolved to N elements" error is a locator failure (the element(s) exist, the query is wrong); a timeout waiting for the element to become visible/attached is a timeout (the query might be fine, but the app never reached the expected state in time). Read the exact error text before picking a reference — this single distinction changes the entire investigation path.
