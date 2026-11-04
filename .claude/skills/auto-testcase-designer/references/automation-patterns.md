# Scenario derivation and action-grouping patterns

Loaded by `SKILL.md` step 2 (deriving scenarios from a story) and step 4 (segmenting steps into candidate actions).

## Scenario categories for story-derived cases

When only a story/acceptance-criteria is available, consider each category below and include only the ones that apply to a real, distinct failure mode — this is a checklist of *candidates to evaluate*, not a mandatory list to fill out:

| Category | Include when… | Skip when… |
|---|---|---|
| Happy path | Always | Never |
| Alternate path | The story states more than one valid route to the outcome | Only one route exists |
| Validation | User input is involved and has stated or implied rules (required, format, length) | The flow has no user input |
| Boundary / empty state | A list, count, or range is involved (first item, last item, zero results, max length) | Fixed single-item flows |
| Persistence | The change should survive a reload/navigation-away | The state is intentionally transient (e.g. a draft) |
| Permission | Different roles see different behavior | Single-role feature |
| Destructive confirmation | The action is irreversible (delete, cancel order) | The action is reversible |
| Regression | The story explicitly fixes a past bug | No bug reference exists |
| Keyboard/focus | The story or existing UI convention calls out accessibility | Not stated and not an existing project convention |

A scenario is justified only if removing it would leave a real user-facing behavior unverified. "More coverage" is not sufficient justification on its own — see D1 in the skill-evaluator rubric's Knowledge Payoff principle: every category here should map to a concrete failure a reviewer would actually care about.

## Action-grouping heuristic

Group consecutive steps into one candidate action when **all** of:
- They act on the same page/component context (no navigation between them).
- Together they represent one user-recognizable intent ("log in", not "click field, type, click field, type, click button").
- No assertion step sits between them (an assertion boundary usually marks the end of one action and the start of verifying its effect).

Do **not** group across a navigation boundary even if the intent feels continuous (e.g. "search" then "open product detail" are two actions, not one) — the second action needs to be independently reusable from a context where the first didn't just run (e.g. arriving at product detail via a direct link).

A single click that itself has a well-known name in the domain (e.g. "Add to Cart") can be its own one-step action — grouping is about intent, not step count.
