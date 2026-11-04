# Excel column schema and alias resolution

Loaded by `SKILL.md` before resolving column headers. Match a workbook's header text against these aliases (case-insensitive, trim whitespace, ignore surrounding punctuation) before falling back to fuzzy matching on token overlap.

## Column aliases

| Structured field | Header aliases (English) | Header aliases (Vietnamese) |
|---|---|---|
| `id` | Test Case ID, TC ID, Case ID, ID, No. | Mã Test Case, STT, Số TT |
| `title` | Test Case, Title, Test Case Name, Scenario | Tên Test Case, Kịch bản |
| `precondition` | Precondition, Pre-condition, Prerequisite | Điều kiện tiên quyết, Tiền điều kiện |
| `steps` | Steps, Test Steps, Test Step, Action | Bước thực hiện, Các bước |
| `testData` | Test Data, Data, Input | Dữ liệu kiểm thử, Dữ liệu đầu vào |
| `expectedResult` | Expected Result, Expected, Expected Output | Kết quả mong đợi |
| `actualResult` | Actual Result, Actual | Kết quả thực tế |
| `status` | Status, Result | Trạng thái, Kết quả |
| `priority` | Priority, Severity | Độ ưu tiên |

If a header matches no alias and no fuzzy candidate scores above ~60% token overlap, treat the column as unmapped metadata — carry it through under its literal header text rather than dropping it, but do not let it collide with a mapped field name.

## Merged-cell / fill-down detection

A workbook uses **one-case-per-row-per-step** layout when:
- The `id` column is filled only on the first row of a case, then blank for subsequent step rows, OR
- The cell is a genuine merged cell spanning the case's row block (SheetJS reports this via the sheet's `!merges` array — check it before assuming a blank means "no data").

When detected, forward-fill `id`, `title`, and `precondition` from the last non-blank value down through the blank rows, and concatenate the `steps` / `expectedResult` columns across the block in row order — do not treat each row as a separate case.

A workbook uses **one-case-per-row** layout (steps bundled into a single cell, usually newline- or number-separated: `1. ...\n2. ...`) when the `steps` cell contains multiple line breaks or a numbered-list pattern. Split on that pattern to produce the step array; do not split on every newline blindly, since a single step's expected result sometimes wraps onto a second visual line without being a new step.

## Multi-sheet workbooks

Skip sheets whose name matches common non-case sheets unless explicitly asked to include them: `Cover`, `Summary`, `README`, `Changelog`, `Instructions`, `Template`. When more than one plausible case sheet remains, ask which to read rather than guessing — silently picking the first sheet risks missing an entire module's test cases.
