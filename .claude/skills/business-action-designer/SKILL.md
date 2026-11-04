---
name: business-action-designer
description: "Decide whether a group of UI steps should become a new reusable Business Action, and if so, its name, parameters, return value, and abstraction level. Use when: (1) auto-testcase-designer flags a step group as a new-action candidate and its boundary/naming needs validating before code is generated, (2) two or more existing Business Actions look like they overlap or duplicate each other, (3) reviewing whether an action mixes multiple abstraction levels (e.g. low-level clicks alongside a high-level business intent) and needs splitting or merging."
---

# Business Action Designer

Decides the shape of the reusable action layer that sits between test cases and page objects. This is a judgment call, not a mechanical transform — the same set of steps can reasonably become one action or three depending on how the project's other tests will want to reuse them. Getting this wrong either forces every test to hand-roll the same five clicks (candidate wasn't abstracted) or forces unrelated tests to share a monolithic action they don't fully need (candidate was over-abstracted).

## Decision framework

For each new-action candidate from `auto-testcase-designer`, or when auditing an existing action:

1. **Would a second, unrelated test case plausibly call this with different data?** If yes, it earns reuse — parameterize it. If the steps only make sense in this one case's specific sequence, it may not deserve a standalone action at all; consider inlining it into the test instead of manufacturing false reusability.
2. **Is the grouping one user-recognizable intent, or several stitched together?** "Login" is one intent. "Login and navigate to settings" is two, even though they always happen together in this particular case — a future test that needs settings access via SSO instead of password login has no way to reuse only half of a merged action. Load `references/action-boundary.md` when a candidate spans more than one page or more than ~5 steps — that's the threshold where over-merging tends to hide.
3. **What does the action need to expose to its caller?** Return only what a caller might need to assert on or chain from (e.g. `login()` might return nothing, but `search(query)` should probably return the results locator or count if tests will assert on it). Do not return internal implementation details (a raw page object) that leaks the abstraction it exists to hide.
4. **Does an existing action already cover this, or most of this?** Grep the project's action/page-object directory for similar names and step sequences before approving a new one. Load `references/action-reuse-rules.md` when a near-match is found — it has the merge-vs-parameterize-vs-keep-separate decision rules.
5. **Name and parameter it per `references/action-naming.md`.** Do not approve a candidate whose name only reads clearly next to the test case that produced it (e.g. `doStep3()`); it must read clearly to someone who has never seen that case.

## NEVER

- **NEVER approve an action named after implementation instead of intent** (`clickButtonAndWait()` instead of `submitOrder()`). An implementation-named action can't survive the button being redesigned into a swipe gesture; an intent-named one can, because only its internals change.
- **NEVER let an action silently assert inside itself** unless the assertion is a true precondition for the action to have meaning (e.g. `login()` asserting the dashboard loaded, because "logged in" *means* that). A action that asserts business-specific expectations internally (e.g. `search()` asserting a specific result count) prevents every other test from using it with different expected outcomes.
- **NEVER create a new action when a one-line parameter addition to an existing one covers the same need.** `login(username, password)` extended with an optional `rememberMe` parameter is almost always better than a parallel `loginWithRememberMe()`.

## Output contract

```json
{
  "candidate": "searchProduct(query)",
  "decision": "approve | merge-into-existing | reject-inline-only",
  "finalSignature": "search(query: string): { resultCount: number }",
  "mergeTarget": null,
  "rationale": "..."
}
```

`automation-script-generator` implements exactly the `finalSignature` this skill approves — it does not re-litigate naming or boundaries during code generation.
