# Conflict resolution

Loaded by `SKILL.md` step 6 when a pull or merge reports conflicts.

## Before touching any conflicted file

Read `git status` to get the full list of conflicted paths, and for each one, `git log --oneline <base>..HEAD -- <path>` and the equivalent for the incoming side, to understand what each side was actually trying to accomplish — not just what the conflict markers show. A conflict marker shows *where* two changes collide, not *why* either change was made.

## Resolving a hunk

For each `<<<<<<<` / `=======` / `>>>>>>>` block:
1. Identify what each side changed and why (from the commit context above).
2. If the two changes are additive and don't logically conflict (e.g. both sides added a different new test case to the same file), keep both, adjusting only what's needed for the file to remain syntactically valid — this is the common case for test-file conflicts, since new specs are usually additive.
3. If the two changes genuinely contradict (e.g. both sides modified the same business action's signature differently), this is not a mechanical resolution — surface it and ask which behavior should win, especially if the automated side (this workflow) is one of the two authors.
4. Never resolve by taking one side wholesale for the entire file (`git checkout --ours`/`--theirs` on a whole file) unless you've confirmed the whole file's other side has no changes worth keeping — check the diff, not just the conflict count.

## After resolving

- Re-run the local test suite before committing the merge/resolution — a syntactically resolved conflict can still be behaviorally wrong (e.g. both a locator change and a test-data change merged in a way that no longer matches either original intent).
- Commit the resolution with a message that says what was merged and how conflicts were resolved, not just "merge conflict fix" — a future reader needs to know which side's logic won and why.
- If a conflict can't be confidently resolved within reasonable investigation time, stop and ask rather than guessing — a wrong guess here can silently reintroduce a bug the other side had just fixed.
