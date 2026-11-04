---
name: excel-testcase-reader
description: "Parse manual test-case workbooks (.xlsx/.xls/.csv) into structured test-case objects (ID, precondition, steps, test data, expected result). Use when: (1) a task points at an Excel/spreadsheet file of manual test cases and the content needs to become structured data before any QA automation design happens, (2) column headers, sheet layout, or ID formats are inconsistent across test-case files and need reconciling before parsing, (3) checking whether every manual case in a workbook was actually extracted before handing off to testcase-analyzer or auto-testcase-designer."
---

# Excel Testcase Reader

Turns a manual test-case workbook into the structured JSON shape every downstream QA skill (testcase-analyzer, auto-testcase-designer) expects. This skill only extracts and normalizes — it does not judge test quality or design automation. That is testcase-analyzer's job.

## Preconditions

- Confirm the workbook path exists and is `.xlsx`, `.xls`, or `.csv`. Password-protected or binary-corrupted files are out of scope — report and stop.
- Confirm the `xlsx` (SheetJS) package is resolvable (`node -e "require('xlsx')"` from the project root). It is **not** a dependency the rest of this repo already needs — if missing, ask before running `npm install xlsx --no-save`; do not add it to `package.json` unless the user wants Excel parsing to be a permanent project capability.

## Decision framework

Before parsing, reason through the sheet structure — do not assume a fixed layout:

1. **Locate the header row.** It is rarely row 1. Scan the first ~10 rows for the row with the highest ratio of non-empty, text-only cells, then confirm it contains at least one of: a case-ID-like column, a "step"/"expected" column. Everything above it is title/metadata noise — ignore it.
2. **Resolve column meaning by header text, never by position.** Column order varies between files even inside the same project. Match header text against `references/excel-schema.md`'s alias table before falling back to fuzzy matching.
3. **Detect one-case-per-row vs. one-case-per-block.** Some workbooks put every step of a case in its own row with the case ID only on the first row (merged cell or blank-fill-down); others put all steps of a case in one cell separated by newlines. Detect by checking whether the ID column repeats blank rows immediately below a filled one — if so, forward-fill the ID and precondition columns for that block.
4. **Multiple sheets:** if the workbook has more than one sheet, ask which sheet(s) to read unless the sheet names themselves make it obvious (e.g. only one sheet, or a sheet literally named "Test Cases"/"TC").

## NEVER

- **NEVER invent a test-data value for a blank cell.** A blank test-data cell is a real gap in the manual case — surface it as `null` in the structured output and flag it, rather than guessing a plausible value. A silently-invented value produces an automated test that verifies nothing real.
- **NEVER assume the expected-result column is the last column.** Workbooks frequently place a "Notes"/"Actual Result"/"Status" column after it. Match by header text.
- **NEVER merge two manual cases because their IDs look sequential.** Missing an ID in a sequence usually means a deleted or moved case, not a numbering gap to paper over.
- **NEVER trust a numeric-looking cell's raw value for an ID or test-data field.** Excel silently coerces `007` to `7` and reformats date-like strings through its own date system — the parser reads the cell's *formatted display text*, not its raw value, specifically to avoid this; if you ever bypass `scripts/read-excel.mjs` and read a workbook another way, reproduce that distinction or IDs and test data will be silently corrupted.

## Reference loading

- Load `references/excel-schema.md` **before** resolving column headers — it has the alias table (e.g. "Steps"/"Test Steps"/"Bước thực hiện" → `steps`) and the merged-cell/fill-down handling rules referenced in step 3 above.
- Load `references/testcase-mapping.md` **before** emitting output — it defines the exact structured JSON shape downstream skills expect. Do not invent your own field names.
- Do not load either file for a workbook that is already in the exact structured JSON shape (e.g. re-processing a previous export) — there is nothing to resolve.

## Running the parser

```bash
node <skill-path>/scripts/read-excel.mjs <path-to-workbook> [--sheet "Sheet Name"]
```

Prints structured JSON (array of test cases, per `references/testcase-mapping.md`) to stdout. It performs header-row detection and alias resolution automatically but does **not** guess blank cells — check its `warnings` array in the output for every case with a gap before handing the result to testcase-analyzer.

## Output contract

Return one structured test case object per manual case (not per row), with an explicit `warnings` list for anything the parser could not resolve with confidence (ambiguous header, blank required field, unmerged block boundary). Never pass a case downstream silently missing a field — surface the gap so testcase-analyzer or the user can decide how to handle it.
