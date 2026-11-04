# Branch naming and base selection

Loaded by `SKILL.md` step 1 once the base branch is known.

## Base branch resolution order

1. `develop`, if it exists on the remote — most active repos in this workflow branch off `develop`, not `main`.
2. `main`, if `develop` doesn't exist.
3. `master`, for older repos.
4. Otherwise, the remote's actual default branch (`git symbolic-ref --short refs/remotes/origin/HEAD`).

Never guess the base from the current local branch alone — a stale local checkout can be tracking the wrong thing.

## Branch naming

`<type>/<short-slug>`, where `<type>` matches the change's actual purpose:

| Type | Use for |
|---|---|
| `test` | New or updated automated test coverage (specs, business actions, page objects) |
| `fix` | A bug fix |
| `feat` | New product functionality |
| `chore` | Tooling, config, dependency changes with no behavior change |

The slug is lowercase-hyphenated and specific enough to identify the change without opening it (`test/tc001-search-product`, not `test/update` or `test/fix2`). For a QA case, derive the slug from the case ID and a short description, not the case ID alone — a bare `test/tc001` gives a reviewer no context from the branch list.

## Reusing vs. creating

If `git show-ref --verify refs/heads/<branch>` succeeds, decide before doing anything else: is this the same in-progress task (continue on it — do not create a duplicate), or a leftover from earlier unrelated work (pick a new, more specific slug)? Silently deleting or resetting the existing branch is never the default — ask if it's unclear which case applies.

## Cleaning up after an interrupted run

`scripts/sync-and-branch.mjs` creates the local branch (`git switch -c`) *before* committing and re-syncing — if a run fails partway (e.g. the post-branch `git pull --no-edit` in step 5 of `SKILL.md` hits a conflict), a local branch with no meaningful commit on it is left behind. Before creating a new branch for a retried run, check for exactly this: a same-named or similarly-named local branch that is even with its base branch (`git log <base>..<branch>` empty) and has no uncommitted work — that one is safe to delete (`git branch -d <branch>`) without asking, since it never diverged from the base. A branch that *does* have commits or uncommitted changes is not orphaned — it's in-progress work, and falls back to the same-task-vs-unrelated judgment above.
