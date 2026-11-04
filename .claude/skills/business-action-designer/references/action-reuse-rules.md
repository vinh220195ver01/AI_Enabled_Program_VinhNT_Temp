# Duplicate and near-duplicate action resolution

Loaded by `SKILL.md` step 4 when a candidate resembles an existing action.

## Classifying the overlap

| Overlap pattern | Resolution |
|---|---|
| Identical steps, different data only | Reuse the existing action as-is; the candidate isn't new, it's a call with new arguments. |
| Same steps plus one extra step at the end (e.g. existing `login()`, candidate does login + dismiss a first-time-user modal) | Parameterize the existing action (`login(username, password, { dismissWelcomeModal: false })`) rather than creating a near-clone — a near-clone means a future fix to login has to remember to also fix the clone. |
| Same intent, different entry point (existing `login()` via the login page, candidate logs in via an SSO redirect) | Keep separate — they are genuinely different flows that happen to reach the same end state. Name to reflect the distinction: `login`, `loginViaSso`. |
| Existing action is broader than needed (existing `completeCheckout()` does address + payment + confirm; candidate only needs address) | This is a signal the existing action may be over-merged — flag it for a split rather than building a workaround that skips steps of the existing one. |

## When in doubt

If the overlap doesn't cleanly match a row above, prefer **parameterizing the existing action** over adding a new one — a codebase with fewer, well-parameterized actions is easier for the next case designer to search and reuse than one with many near-identical actions differing in subtle ways. Only keep two actions separate when a future caller would have a genuine reason to need exactly one behavior and not the other.
