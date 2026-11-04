---
name: auto-testcase-designer
description: "Convert a manual test case (already analyzed by testcase-analyzer) or a user story into an Auto Test Case design: an ordered list of Business Actions, assertions, and test-data bindings — before any code is written. Use when: (1) a manual case is marked ready and needs to become an automation design rather than going straight to code, (2) only a story/acceptance-criteria is available and cases must be derived from it, (3) a designed case needs to identify which steps are new Business Actions versus reuses of existing ones."
---

# Auto Testcase Designer

The bridge between "what a human would do" and "what code should exist." Output is a design document, not a script — `automation-script-generator` implements the design this skill produces, and `business-action-designer` decides the boundaries of any new reusable actions this skill identifies. Skipping this step and going straight from manual case to code is how projects end up with one giant script per test case instead of composable actions.

## Preconditions

- The manual case has been through `testcase-analyzer` and is `readiness: "ready"`, OR the input is a story/acceptance-criteria with no manual case at all.
- Know the project's existing Business Action inventory before designing — grep the automation repo's action/page-object directory for existing action names. Designing `LoginAsUser()` when `login(username, password)` already exists creates silent duplication that `business-action-designer` then has to untangle.

## Decision framework

Work in this order — each step constrains the next:

1. **Start from the actual evidence.** For a manual case, its steps are the evidence. For a story, its acceptance criteria and the existing UI contract are the evidence. Do not infer requirements neither states. See `references/testcase-conversion-rules.md` for how a manual case's step list maps to actions vs. assertions.
2. **For a story with no manual case, derive the minimum meaningful scenarios** — happy path plus the smallest set of alternate/validation/boundary cases that can fail for a real business reason. A derived case is justified only if it tests a distinct user decision, state transition, validation rule, or regression risk. Load `references/automation-patterns.md` for the standard scenario categories (validation, boundary, permission, persistence, destructive-confirmation, etc.) before enumerating — do not invent categories ad hoc.
3. **Preserve an explicit case list.** If the user or the manual case already enumerates cases, do not broaden scope by inventing more unless a missing failure mode is clearly required to validate the *same* stated behavior.
4. **Segment steps into candidate Business Actions.** Group consecutive action steps that represent one coherent user intent (e.g. "enter username" + "enter password" + "click login" → one `login` intent) — see `references/automation-patterns.md` for the grouping heuristic. Do not hand this segmentation to `business-action-designer` unresolved; propose the grouping here, since that skill's job is to validate/refine boundaries and naming, not discover them from scratch.
5. **Bind test data to each action**, using concrete values from the case; if `testcase-analyzer` flagged symbolic data, resolve it to a concrete value now and note the assumption — do not pass symbolic data into code generation.
6. **Assign a locator strategy hint per UI element touched**, not a literal selector — `automation-script-generator` picks the exact selector API. Load `references/locator-strategy.md` when the case touches dynamic lists, modals, or elements without a stable identifier; skip it for straightforward static-page forms.

## NEVER

- **NEVER design one Business Action per test case.** A `bA_TC001()` action can never be reused, which defeats the entire point of separating design from scripting — if a segment of steps genuinely appears nowhere else, it may still be its own action, but name and design it around the user intent (`searchProduct`), not the case ID.
- **NEVER decide code-level implementation details** (exact selector strings, wait strategy, assertion library calls) — that is `automation-script-generator`'s freedom, not this skill's. Fixing those here creates a design the generator can't adapt when the actual DOM differs from assumption.
- **NEVER change product/application behavior to make a case fit the design.** If a step cannot be represented because the app doesn't expose a needed state or hook, surface that as a blocker for a human decision rather than quietly reshaping the case.

## Output contract

```json
{
  "caseId": "TC001",
  "scenarios": [
    {
      "id": "TC001",
      "actions": [
        { "step": "login", "isNewAction": false, "existingAction": "login(username, password)", "testData": { "username": "user1", "password": "Passw0rd!" } },
        { "step": "searchProduct", "isNewAction": true, "proposedName": "searchProduct(query)", "testData": { "query": "iPhone 15" } }
      ],
      "assertions": [
        { "after": "searchProduct", "expected": "Search results contain at least one item matching the query" }
      ]
    }
  ],
  "newActionCandidates": ["searchProduct(query)"],
  "assumptions": []
}
```

Hand `newActionCandidates` to `business-action-designer` before implementation — do not let `automation-script-generator` invent action boundaries on the fly from this list alone.
