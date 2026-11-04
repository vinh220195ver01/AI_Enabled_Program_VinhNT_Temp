# PR description template

Loaded by `SKILL.md` step 2, before drafting the PR body.

```markdown
## Summary
- Source: <manual case ID(s) / story or ticket reference>
- Changes: <N automation specs, M business actions, page objects touched — one line each, not a raw file list>

## Local results
- Command: <exact command run, e.g. `npx playwright test tests/<aut-name>/e2e/tc001.spec.ts`>
- Result: <passed/failed, N/N>

## Product code changes
- <None, or: exact file + reason it was necessary — every product-code change must be called out here explicitly, never buried in the diff>

## Risks
- <Anything a reviewer should specifically double check — a flagged assumption from auto-testcase-designer, a locator flagged for a future data-testid, a known-flaky dependency>

## Review
- Do not merge until a reviewer approves.
```

## Rules

- "Changes" summarizes *what capability* was added/changed, not a restated `git diff --stat` — a reviewer can already see the file list; they need to know what each file is for.
- "Product code changes" must say "None" explicitly when there are none — an omitted section reads as "not checked," not as "nothing to report."
- "Risks" should name the actual thing to watch, not a generic disclaimer ("please review carefully") — a Vague Warning here is exactly as unhelpful as one in a skill file.
