---
name: testcase-analyzer
description: "Analyze structured manual test cases (from excel-testcase-reader or pasted directly) for automatability, ambiguity, and existing coverage before any automation design starts. Use when: (1) a manual test case or set of cases needs to be judged ready for automation before scripting begins, (2) a case's steps are ambiguous, missing test data, or mix UI actions with assertions in a way that needs untangling, (3) checking whether a new manual case duplicates or overlaps an already-automated one."
---

# Testcase Analyzer

Sits between raw manual test cases and automation design. Its only job is to answer: *is this case clear enough, and distinct enough, to design automation from?* It does not design Business Actions or write code — that is `auto-testcase-designer`'s and `business-action-designer`'s job. Handing an ambiguous case to those skills produces automation that "passes" without testing the real intent.

## Preconditions

- Input is either the structured JSON shape from `excel-testcase-reader` (`references/testcase-mapping.md` there), or a manual case pasted/typed directly — normalize the latter into the same `{id, title, precondition, steps[], testData, expectedResult}` shape before analyzing.
- If the input already carries `warnings` from excel-testcase-reader, treat every listed field as unresolved — do not re-derive a value it flagged as blank.

## Decision framework

For each case, work through these questions in order — stop and surface the case rather than pushing it forward once a question fails:

1. **Is every step an observable action or assertion?** A step like "verify the system works correctly" is not automatable as written — it names no observable UI state. Distinguish action steps (do something) from assertion steps (check something); a case needs at least one of each to be worth automating.
2. **Is test data concrete or symbolic?** "Enter a valid email" is symbolic; "Enter `user@example.com`" is concrete. Symbolic data forces automation to invent a value, which silently narrows what the test actually proves. Flag symbolic data rather than picking a value yourself.
3. **Does the case test one distinct behavior?** A case combining unrelated verifications (e.g. login *and* profile update *and* logout) inflates one test into three, and a failure in step 2 hides whether steps 1 and 3 would have passed. Recommend splitting only when the combined steps have no shared setup dependency — if they do, splitting would just duplicate the precondition three times for no benefit.
4. **Does this overlap an already-automated case?** Compare the case's steps and expected result against existing specs (grep the project's test directory for the same UI flow) before recommending automation — a near-duplicate case usually means the manual suite has drifted, not that two tests are needed.
5. **Is the precondition reachable without manual/external setup?** A precondition needing a specific database state, a third-party sandbox account, or a physical device is a signal to flag now, not after `automation-script-generator` gets stuck.

## NEVER

- **NEVER silently resolve an ambiguous step by picking the most likely interpretation.** The person who wrote the manual case may have meant something specific that isn't the "obvious" reading — state the ambiguity and the interpretation you'd default to, and let the case move forward only with that stated assumption attached, not silently baked in.
- **NEVER mark a case "ready" because its steps are grammatically clear.** Clear prose and automatable steps are different things — a clear sentence with no observable end-state is still not automatable.
- **NEVER expand a case's scope to "improve" coverage.** If the user supplied an explicit case list, adding scenarios they didn't ask for belongs to `auto-testcase-designer`'s derivation logic (for story-only input), not here — this skill judges the case as given.

## Output contract

For each case, return:

```json
{
  "id": "TC001",
  "readiness": "ready | needs-clarification | not-automatable",
  "issues": [{ "type": "ambiguous-step | symbolic-data | mixed-scope | unreachable-precondition | possible-duplicate", "detail": "..." }],
  "actionSteps": [1, 3],
  "assertionSteps": [4],
  "assumedInterpretations": []
}
```

A case with `readiness: "ready"` and an empty `issues` array is the signal `auto-testcase-designer` uses to start automation design. Anything else should stop at this skill for clarification rather than being forced through.

**`needs-clarification` example** — one resolvable issue, case still proceeds once the user confirms the assumption:
```json
{
  "id": "TC014",
  "readiness": "needs-clarification",
  "issues": [{ "type": "symbolic-data", "detail": "Step 2 says 'enter a valid email' with no concrete value" }],
  "actionSteps": [1, 2, 3],
  "assertionSteps": [4],
  "assumedInterpretations": ["Will use user@example.com as the concrete value unless told otherwise"]
}
```

**`not-automatable` example** — no observable end-state to assert on, so the case stops here rather than being handed to `auto-testcase-designer`:
```json
{
  "id": "TC022",
  "readiness": "not-automatable",
  "issues": [{ "type": "ambiguous-step", "detail": "Step 3 ('verify the system works correctly') names no observable UI state to check" }],
  "actionSteps": [1, 2],
  "assertionSteps": [],
  "assumedInterpretations": []
}
```
