---
name: github-pr
description: "Push a committed branch and open a review-ready GitHub pull request, then watch CI checks to completion — never merge. Use when: (1) git-workflow has finished committing a branch and it's time to push and open a PR, (2) a PR's description needs to summarize source, changes, local test results, and risks per this repo's review conventions, (3) checking whether every GitHub check on an open PR has finished successfully before reporting the work done."
---

# GitHub PR

Owns the last leg of the workflow: push, open PR, watch checks, stop. This skill never merges and never requests specific reviewers unless explicitly asked — its job ends with a green, open PR waiting for a human.

## Preconditions

- The branch was already created and committed by `git-workflow`; this skill does not create branches or commit code.
- The GitHub CLI is authenticated (`gh auth status`) before attempting to create a PR — if not, stop and ask the user to run `gh auth login` rather than attempting to work around it.

## Decision framework

1. **Push the exact branch `git-workflow` produced** — `git push -u origin <branch>`. Do not rebase or rewrite history before pushing unless the user explicitly asked for a clean-up rebase.
2. **Compose the PR body from `references/pr-template.md`**, not free-form — it defines the required sections (source, changes, local results, risks). Load it before writing the description, not after drafting something and reshaping it to fit.
3. **Title format**: `<type>: <imperative summary>` — matching `git-workflow`'s commit-type vocabulary (`test:`, `fix:`, `feat:`, `chore:`), so the PR title reads consistently with the commit(s) inside it.
4. **Before opening, run through `references/review-checklist.md`** — it's what a human reviewer will actually check; catching an obvious gap (missing local test result, unexplained product-code change) before opening the PR saves a review round-trip.
5. **After opening, watch checks to completion** with `scripts/wait-pr-pipeline.mjs` — do not report the task done while checks are still pending, and do not treat a pending/cancelled/timed-out check as success.
6. **If a check fails**, investigate the actual job log (not just the pass/fail badge) before deciding whether the cause is related to this change — a red check on an unrelated flaky job in the same run doesn't mean this PR's change is broken, but that must be confirmed, not assumed.

## NEVER

- **NEVER merge the PR or request reviewers unless the user explicitly asked for either in this session.** The default success state is an open PR with green checks, waiting for a human — not a merged one.
- **NEVER force-push over an existing PR branch** to "fix" a mistake without the user's explicit go-ahead — a force-push can silently discard a reviewer's already-posted comments' context or someone else's pushed fixup.
- **NEVER report the PR as done while any check is `PENDING`, `CANCELLED`, `TIMED_OUT`, or `FAILED`.** Only `SUCCESS`, `SKIPPED`, or `NEUTRAL` on every check counts.
- **NEVER paper over a failing, unrelated-looking check without confirming it's actually unrelated** — document the finding explicitly if it truly is pre-existing/unrelated flake, rather than silently ignoring a red check.

## Running the helpers

```bash
node <skill-path>/scripts/create-pr.mjs \
  --branch test/tc001-search-product --base develop \
  --title "test: cover TC001 with Playwright" \
  --body-file /path/to/generated-pr-body.md

node <skill-path>/scripts/wait-pr-pipeline.mjs [pr-number-or-url]
```

`create-pr.mjs` only pushes and opens the PR — compose `--body-file`'s content from `references/pr-template.md` first. `wait-pr-pipeline.mjs` can be re-run independently any time to re-check an already-open PR's status.
