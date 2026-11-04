# Commit message convention

Loaded by `SKILL.md` step 4, before composing the commit message.

## Format

`<type>: <imperative summary, no trailing period>`

Same `<type>` vocabulary as branch naming (`test`, `fix`, `feat`, `chore`) — keep the branch type and commit type consistent for a given change. Example: `test: cover TC001 search-and-verify-price with Playwright`.

- Imperative mood ("cover", "fix", "add"), not past tense ("covered", "fixed") — matches how git itself describes commits ("this commit will...").
- State *why* in the body only when it isn't obvious from the summary and the diff — do not restate what the diff already shows file-by-file; that's what `git show` is for.
- Reference the source (manual case ID, story/ticket ID) in the body when one exists — it's the fastest way for a future reader to find the originating requirement.

## What NOT to do

- Do not bundle unrelated changes into one commit because they happened to be worked on together — each commit should represent one coherent, revertible unit of change. If `git-workflow`'s file-review step (SKILL.md step 3) found unrelated files staged, that's a signal to split into separate commits, not to write a commit message that papers over the mix.
- Do not write a commit message describing the current session or task framing ("continuing from last conversation", "as requested") — a commit message should stand on its own to someone with zero conversational context, months later.
