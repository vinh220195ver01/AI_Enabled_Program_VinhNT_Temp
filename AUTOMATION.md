# AI Enabled Program

Playwright automation for multiple AUTs (Applications Under Test). Keep each AUT's manual cases and automation assets in its own domain folder so a domain-specific URL, locator, or test data never becomes shared infrastructure.

Current AUTs:

| AUT | Manual cases | Automation |
|---|---|---|
| Playwright Docs | `manual-test-cases/playwright-docs/` | `tests/playwright-docs/` |
| ACTP1 Clothes Shop | `manual-test-cases/actp1/` | `tests/actp1/` (automation not started) |

Add a new AUT by creating matching `manual-test-cases/<aut-name>/` and `tests/<aut-name>/` directories. Put specs under `e2e/`, page objects under `pages/`, and business actions under `actions/`. The root Playwright config discovers specs across AUTs and contains only shared browser/runtime settings.

## QA skills

See [`.claude/agent.md`](.claude/agent.md) for the full lifecycle map (phase order, handoffs, and stop conditions) — read that first when running the whole Excel-to-PR flow. It's a plain guide any model can follow, not a triggered skill.

The workflow is split across 8 skills in `.claude/skills/`, each owning one step so it can be reused or replaced independently:

| Skill | Responsibility |
|---|---|
| `excel-testcase-reader` | Parse manual test-case workbooks into structured test cases |
| `testcase-analyzer` | Judge a case ready/ambiguous/not-automatable before design starts |
| `auto-testcase-designer` | Convert a ready case (or a story) into an Auto Test Case design |
| `business-action-designer` | Decide reusable Business Action boundaries, names, and signatures |
| `automation-script-generator` | Implement the design as Playwright specs, actions, and page objects |
| `autotest-get-uat-context` | Explore a screen's live UI and record locators in `uat-context/` before its page object is written |
| `automation-debugger` | Triage and fix a failing or flaky run |
| `git-workflow` | Sync, branch, and commit the change |
| `github-pr` | Push, open the PR, and watch checks — never merges |

Lifecycle gates:

```bash
npm run qa:preflight  # prerequisites and installed Playwright
npm run qa:full       # preflight plus all existing automated tests
npm run qa:coverage   # verify every manual case has an automated spec
```

The full suite uses Playwright's pass-with-no-tests mode so the lifecycle remains runnable when an AUT has no specs. `qa:coverage` checks that each manual case has a matching spec under the same AUT.

Run a focused or complete local suite with `automation-script-generator`'s `run-local-playwright.mjs` script (also used by `automation-debugger` to reproduce/verify a fix):

```bash
node .claude/skills/automation-script-generator/scripts/run-local-playwright.mjs tests/playwright-docs/e2e/tc02.spec.ts
```

Once local tests pass, `git-workflow` branches and commits, then `github-pr` pushes, opens the PR, and watches checks:

```bash
npm run qa:branch -- --branch test/tc02-<slug> --message "test: cover TC02 with Playwright" --file tests/playwright-docs/e2e/tc02.spec.ts
git push -u origin test/tc02-<slug>
npm run qa:pr -- --branch test/tc02-<slug> --base develop --title "test: cover TC02 with Playwright" --body-file pr-body.md
npm run qa:pr:watch
```

Copy the whole `.claude/skills/` directory into another project's `.claude/skills/` directory to reuse the same workflow there. `git-workflow` and `github-pr` are general-purpose and work for any coding task, not just QA.
