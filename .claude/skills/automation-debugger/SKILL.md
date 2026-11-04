---
name: automation-debugger
description: "Triage a failing or flaky Playwright automation run: classify the failure, find the root cause, and propose or apply a fix. Use when: (1) a generated or existing test fails locally or in CI and the cause isn't an obvious typo, (2) a test passes in isolation but fails in the full suite, or fails intermittently across runs, (3) a failure needs to be classified as a locator problem, timing problem, test-data problem, environment problem, an application defect, or an automation defect before deciding who should fix it."
---

# Automation Debugger

Turns a red test into a classified, root-caused, and (where appropriate) fixed one. This skill does not decide test design (`auto-testcase-designer`'s job) or invent new coverage — it only explains why an existing test failed and what to do about it. Re-running a failing test repeatedly with small guesses instead of classifying it first wastes cycles and often masks the real cause.

## Preconditions

- Collect all available evidence before forming a hypothesis: the exact error/exception text, the stack trace, the Playwright trace/screenshot on failure (`test-results/` or the HTML report), and the test's source. Guessing from the error message alone without checking the trace/screenshot skips the fastest way to distinguish a locator problem from a timing problem.
- Reproduce locally first: `node <skill-path>/../automation-script-generator/scripts/run-local-playwright.mjs <spec-file>`. A failure that only reproduces in CI and not locally is itself a classification signal (see `references/common-failures.md`, environment category).

## Decision framework

1. **Classify before hypothesizing a fix.** Load `references/common-failures.md` — it maps observable symptoms (error text patterns, timing of the failure, whether it reproduces locally) to one of: locator failure, timeout, test-data issue, environment drift, application defect, automation defect, or flaky test. Skipping straight to "let me try changing this selector" without classifying first is how a timeout gets mis-treated as a locator problem.
2. **For a locator failure**, load `references/locator-debugging.md` — the fix depends on *why* the locator stopped matching (DOM changed vs. was always ambiguous vs. element not yet rendered), which changes what you check first.
3. **For a timeout**, load `references/timeout-debugging.md` before reaching for a longer timeout value — a longer timeout treats the symptom; the reference has the questions that find the actual blocking condition.
4. **For an intermittent/flaky result**, load `references/flaky-test.md` — flakiness has specific, non-obvious causes (shared state, animation timing, network race) that a single re-run won't reveal.
5. **For an application defect**, do not silently work around it in the test. Report it explicitly with the observed vs. expected behavior and ask how the team wants to proceed — weakening the assertion to pass hides a real bug from everyone downstream.
6. **After applying a fix**, re-run the same focused spec, then the full suite, before declaring it resolved — a fix that only re-passes the one spec in isolation may have just gotten lucky, especially for flaky-test causes.

## NEVER

- **NEVER add `waitForTimeout` as a fix.** It's the single most common wrong fix for both timeout and flaky-test failures — it hides the real condition instead of waiting on it, and just moves the flakiness to a different timing window.
- **NEVER weaken or delete a failing assertion to "fix" the test**, unless the assertion itself was proven wrong (e.g. it encoded a manual case's stale expectation) — and even then, that determination belongs back with `testcase-analyzer`/`auto-testcase-designer`, not a silent deletion here.
- **NEVER conclude "flaky, ignore it" after only one re-run.** A single re-run passing is not evidence of flakiness or of a fix — it's as consistent with "fixed" as with "50% flaky, got lucky." Use `references/flaky-test.md`'s repeated-run guidance before either conclusion.
- **NEVER assume a CI-only failure is an environment quirk without checking the CI job log for an actual different root cause.** "Works on my machine" is a symptom to investigate, not an explanation.

## Output contract

```json
{
  "spec": "tests/<aut-name>/e2e/tc001.spec.ts",
  "classification": "locator | timeout | test-data | environment | application-defect | automation-defect | flaky",
  "rootCause": "...",
  "fixApplied": true,
  "fixDescription": "...",
  "verifiedBy": "focused run + full suite, N/N passed",
  "escalation": null
}
```

Set `escalation` (not null) and stop instead of fixing when the classification is `application-defect` and no one has confirmed how to proceed, or when a required step needs manual/non-automatable input (CAPTCHA, physical device, inaccessible email).
