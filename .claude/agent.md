# QA Automation Lifecycle — Agent Guide

This is a model-agnostic map of the full "manual test case → merged-ready PR" lifecycle in this project. It is not a skill itself and is not gated by any trigger-matching mechanism — any model working in this repo (Claude, GPT, or otherwise) should read this file directly when the task is to take a manual test case (or story) through to an open, green-checked pull request. Each phase below is implemented by one skill in `.cursor/skills/<name>/SKILL.md`; this file only orders them and defines the handoffs. Read the phase's own `SKILL.md` for how to actually do that phase — do not reimplement a phase's logic from this file's summary alone.

## The pipeline

```
Excel workbook (optional)
        │  excel-testcase-reader
        ▼
Structured manual test case(s)
        │  testcase-analyzer
        ▼
readiness: ready ──────────────────────────► (needs-clarification / not-automatable → STOP, ask human)
        │  auto-testcase-designer
        ▼
Auto Test Case design (actions + assertions + data) ── newActionCandidates ──► business-action-designer ─┐
        │                                                                                                  │
        │◄─────────────────────────── approved Business Action signatures ───────────────────────────────┘
        │  automation-script-generator
        ▼
Generated spec + actions + page objects, run locally
        │
        ├── fails, cause unclear ──► automation-debugger ──► fix ──► back to "run locally"
        │
        ▼ passes
        │  git-workflow
        ▼
Committed branch, synced with base
        │  github-pr
        ▼
Open PR, checks green ──► STOP here. Never merge.
```

## Phase-by-phase entry/exit contract

| Phase | Skill | Input | Output | Stop condition |
|---|---|---|---|---|
| 1. Parse | `excel-testcase-reader` | `.xlsx`/`.xls`/`.csv` workbook path | Structured test case JSON (`references/testcase-mapping.md` shape) with `warnings[]` | Skip entirely if the manual case is already provided as structured data or plain text — this phase only exists for workbook input. |
| 2. Analyze | `testcase-analyzer` | Structured case (from phase 1, or normalized by hand from a pasted case) | `readiness` verdict + `issues[]` | `readiness !== "ready"` → **stop and surface to the user**. Do not push an ambiguous or not-automatable case into design; see that skill's NEVER list for why. |
| 3. Design | `auto-testcase-designer` | A `ready` case, or a story with no manual case | Scenario list: actions (existing vs. new) + assertions + bound test data | A design step blocked on a genuine product defect or missing test hook → stop and ask, per that skill's Implementation-blocker guidance. |
| 4. Business actions | `business-action-designer` | `newActionCandidates` from phase 3 | Approved signature per candidate (`approve` / `merge-into-existing` / `reject-inline-only`) | None of this phase's decisions should be deferred to phase 5 — code generation must receive final signatures, not open questions. |
| 5. Implement | `automation-script-generator` (+ `autotest-get-uat-context` for each screen without a `uat-context/` page file) | Approved design (phase 3) + approved signatures (phase 4) | Spec/action/page-object files, run locally via its `scripts/run-local-playwright.mjs` | A local failure with an unclear cause → go to phase 5a (debugger), not repeated blind edits. |
| 5a. Debug (as needed) | `automation-debugger` | Failing/flaky run: error, trace, screenshot, spec, source | Classification + root cause + fix, re-verified locally | `application-defect` with no confirmed direction, or a non-automatable manual step (CAPTCHA, physical device, inaccessible email) → stop and ask. |
| 6. Commit | `git-workflow` | Passing local files, ready to branch | Committed branch, synced with base, `scripts/sync-and-branch.mjs` | A conflict that isn't a clean, confidently-understood resolution → stop and ask, per `references/conflict-resolution.md`. |
| 7. Publish | `github-pr` | Committed branch from phase 6 | Open PR, all checks `SUCCESS`/`SKIPPED`/`NEUTRAL` | A check stays `PENDING`/`FAILED`/`CANCELLED`/`TIMED_OUT` → do not report done; investigate per that skill's decision framework. **Never merge, regardless of how green the PR is.** |

## Cross-cutting rules that apply at every phase

- **A phase's own `SKILL.md` NEVER list always wins** over anything implied here — this file is a map, not a rulebook. If this guide and a skill's own file ever seem to disagree, the skill file is authoritative for its phase.
- **Don't skip a phase to save time.** Going straight from a manual case to `automation-script-generator` without analysis/design produces one-off scripts with no reusable Business Actions — the exact monolithic-script failure mode this multi-skill split exists to avoid.
- **A stop condition means stop, not "make a reasonable guess and continue."** Every phase above has at least one documented case where the correct action is to surface the situation to a human rather than proceed. Silently resolving one of these to keep the pipeline moving is the most common way this workflow produces a technically-passing PR that doesn't actually verify what it claims to.
- **Carry `id`/case identity through unchanged** from phase 1 or the original manual case all the way to the branch name and PR title — it's how a human traces a PR back to the requirement it covers.
- **Re-entry is normal.** A debugger fix (phase 5a) goes back to "run locally," not forward to commit — always re-verify locally after any change before advancing to the next phase.

## Definition of done

The lifecycle is complete only when **all** of:
- [ ] The case's `readiness` was `ready` before design began (or the story-derived scenarios were justified per `auto-testcase-designer`'s categories).
- [ ] Every new Business Action was approved by `business-action-designer` before implementation.
- [ ] The generated suite passes locally (focused spec, then full suite).
- [ ] The branch is committed and synced with its base with no unresolved conflicts.
- [ ] The PR is open, its checks are all successful, and it has **not** been merged.

## Scope note

This guide currently covers the 8 authored skills (`excel-testcase-reader`, `testcase-analyzer`, `auto-testcase-designer`, `business-action-designer`, `automation-script-generator`, `automation-debugger`, `git-workflow`, `github-pr`) plus the UI-exploration skill `autotest-get-uat-context`. A dedicated `test-executor` skill and a formal `qa-automation-workflow` orchestrator skill were intentionally deferred — this file is the interim substitute for the latter. If those are added later, update the table above rather than maintaining two competing descriptions of the pipeline.
