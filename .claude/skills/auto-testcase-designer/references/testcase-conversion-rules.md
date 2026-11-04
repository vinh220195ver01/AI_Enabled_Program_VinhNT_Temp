# Manual case → design conversion rules

Loaded by `SKILL.md` step 1 when converting an already-structured manual case (not a story) into a design.

## Step-type classification

Classify every manual step before grouping it into an action:

- **Action step**: changes application state (click, type, navigate, select). Becomes part of a Business Action.
- **Assertion step**: observes state without changing it ("verify", "confirm", "check that"). Becomes a design-level assertion attached to the action that produced the state, not its own action.
- **Setup step**: establishes precondition but isn't part of the scenario being tested (e.g. "log in" at the start of a case whose actual subject is checkout). Still becomes an action reference (likely to an existing one), but should not be the case's *primary* action for naming/reporting purposes.

A step can look like both (e.g. "click submit and verify the confirmation message appears") — split it into its action and assertion halves rather than forcing it into one bucket; conflating them means a script generated from it can't independently tell you whether the click failed or the verification failed.

## Preserving case identity

- Keep the manual case's `id` as the design's `caseId` verbatim — `automation-script-generator` and `git-workflow` use it for filenames and branch names downstream.
- Do not rename or reorder manual steps for "clarity" — if a step's wording is genuinely ambiguous, that ambiguity should have been caught by `testcase-analyzer`; if it reached this skill, treat the literal wording as authoritative and note any interpretation made, rather than silently rewriting it.

## When the manual case conflicts with the current UI

If a step references a UI element, label, or flow that no longer matches the current application (e.g. the manual case predates a UI redesign), do not silently adapt the case to the new UI without noting it — record the mismatch as an assumption in the design output. The manual case may be stale, or the app may have an undocumented regression; that judgment belongs to a human, not to silent design-time correction.
