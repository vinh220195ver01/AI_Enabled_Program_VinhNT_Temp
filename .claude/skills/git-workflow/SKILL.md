---
name: git-workflow
description: "Safely sync, branch, stage, and commit changes for any coding task — status check, pull, branch creation, conflict-safe merge, add, and commit. Use when: (1) starting new work and the working tree/branch state needs verifying before touching files, (2) creating a feature/fix/test branch off the correct base branch and committing a specific set of files without sweeping up unrelated changes, (3) a pull or merge reports conflicts and they need resolving without discarding anyone's work. General-purpose — not specific to QA automation."
---

# Git Workflow

Low-freedom by design: git history and a collaborator's uncommitted work are expensive to undo, so this skill favors exact, verified commands over improvisation. It handles the mechanics of getting a change onto a branch and committed — `github-pr` takes over from there to open the PR.

## Preconditions

- Before anything else, run `git status`. Never run a command that can discard uncommitted work (`checkout`/`restore`/`reset`/`clean`) without having seen current status first and confirmed what would be affected.
- Confirm the repo has a remote and, if the task will eventually push, that credentials/auth already work — do not attempt to fix git auth configuration as part of this skill.

## Decision framework

1. **Determine the base branch, don't assume `main`.** Check for `develop`, then `main`, then `master` on the remote, in that order, or read the remote's default branch (`git symbolic-ref --short refs/remotes/origin/HEAD`). Load `references/branching.md` for the branch-naming convention once the base is known.
2. **Never reuse an existing branch without confirming it's actually for this work.** If a branch with the intended name already exists, check whether it's the correct in-progress branch for this task (continue on it) or a stale/unrelated one (pick a different name) — do not silently overwrite it.
3. **Stage only what this task actually changed.** Before `git add`, review `git status` output against the expected file list for this task. An unexpected file in the diff is either a sign of a bug in the automation that produced it, or someone else's uncommitted work — investigate before adding it, never bulk `git add -A`/`git add .` on a shared branch.
4. **Write the commit message per `references/commit-convention.md`** — load it before composing the message, not after; the convention affects how the subject line should be phrased, not just formatted afterward.
5. **Before pushing, sync with the base again** (`git pull --no-edit origin <base>` or the task's actual target branch) to surface conflicts locally, where they're easier to resolve with full context, rather than as a failed CI check later.
6. **If a conflict appears**, load `references/conflict-resolution.md` — do not resolve by discarding either side's changes without understanding what each side was trying to do.

## NEVER

- **NEVER discard uncommitted changes to "clean up" before starting.** If `git status` shows unrelated pending work, stash it (`git stash push -u`) or ask — never `reset --hard`/`clean -f` over work that isn't yours to discard.
- **NEVER force-push** unless the user explicitly asked for it in this session, and never to a shared branch (`main`/`develop`) under any circumstance.
- **NEVER resolve a merge conflict by blindly taking "ours" or "theirs" for an entire file.** Each conflict hunk represents two people's intent — read both sides; a whole-file resolution usually silently drops one side's real change.
- **NEVER commit generated/build artifacts, credentials, or `.env` files** picked up by a broad `git add` — review the staged diff, not just the file list, before committing anything that looks unfamiliar.

## Running the branch/commit helper

```bash
node <skill-path>/scripts/sync-and-branch.mjs \
  --branch test/tc001-search-product \
  --base develop \
  --message "test: cover TC001 with Playwright" \
  --file tests/<aut-name>/e2e/tc001.spec.ts --file tests/<aut-name>/pages/product-page.ts
```

It resolves the base branch if `--base` is omitted, refuses to proceed if the branch name already exists or the working tree has changes outside `--file`, and stops before pushing (pushing is `github-pr`'s trigger, not this skill's) — the final step it prints is the exact push command to hand off.
