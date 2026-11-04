# Structured test case output shape

Loaded by `SKILL.md` before emitting output. This is the contract every downstream skill (`testcase-analyzer`, `auto-testcase-designer`) reads — do not invent alternate field names or nesting.

```json
{
  "id": "TC001",
  "title": "Search product and verify price",
  "precondition": "User is logged in and on the home page",
  "steps": [
    { "index": 1, "action": "Open Product listing" },
    { "index": 2, "action": "Search product by name", "testData": "iPhone 15" },
    { "index": 3, "action": "Open the first product in results" },
    { "index": 4, "action": "Verify displayed price", "expectedResult": "Price matches catalog price" }
  ],
  "testData": { "productName": "iPhone 15" },
  "expectedResult": "Product price displayed matches the catalog",
  "warnings": []
}
```

## Field rules

- `id`: normalize to the case ID exactly as written (preserve prefix casing like `TC001` vs `tc_001`) — downstream skills use it verbatim for branch names and spec filenames, so do not reformat it.
- `steps`: always an array, even for a single-step case. Each step keeps its original 1-based `index` from the source (not a re-numbered index), so gaps in a partially-automated case stay traceable back to the workbook.
- Per-step `testData`/`expectedResult` are only set when the source workbook binds them to that specific step; case-level `testData`/`expectedResult` hold anything stated once for the whole case.
- `warnings`: array of `{ field, reason }` for anything not resolved with confidence — a blank required cell, an ambiguous header match, an undetected block boundary. An empty array is a claim that the case is complete; only emit it empty when every field actually resolved.
- Never add a field not in this shape without a warning noting it is an extension — testcase-analyzer's parser is written against exactly this shape.
