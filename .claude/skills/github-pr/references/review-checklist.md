# Pre-open review checklist

Loaded by `SKILL.md` step 4, before running `create-pr.mjs`. Answer every line — do not open the PR if any answer is "no" without a documented reason in the PR body.

- [ ] Local test command was actually run for this exact branch state (not an earlier commit) and passed.
- [ ] Every file staged in the commit(s) is accounted for in the PR summary — no unexplained file made it in via a broad `git add`.
- [ ] Any product-code change is called out explicitly with its reason, not left implicit in the diff.
- [ ] No `waitForTimeout` was introduced (grep the diff for it — it should never appear in new or modified test code).
- [ ] No assertion was weakened or removed to make a previously-failing test pass, unless the case's design explicitly justified the change.
- [ ] The branch is synced with the base branch (no pending conflicts) before push.
- [ ] The PR title and commit message type prefixes match (`test:`/`fix:`/`feat:`/`chore:`).
- [ ] No credentials, `.env` values, or other secrets appear in the diff.

If any box can't be checked, resolve it before opening — an "opened, then had to be fixed and re-pushed" PR costs more reviewer attention than one extra minute of pre-check would have.
