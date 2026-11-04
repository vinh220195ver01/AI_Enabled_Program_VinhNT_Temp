#!/usr/bin/env node
/**
 * Parse a manual test-case workbook into the structured shape defined in
 * references/testcase-mapping.md. See SKILL.md for the header/merge detection rules
 * this implements.
 *
 * Usage: node read-excel.mjs <path-to-workbook> [--sheet "Sheet Name"]
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const filePath = args.find((arg) => !arg.startsWith("--"));
const sheetOption = (() => {
  const index = args.indexOf("--sheet");
  return index >= 0 ? args[index + 1] : undefined;
})();

if (!filePath) {
  console.error("Usage: node read-excel.mjs <path-to-workbook> [--sheet \"Sheet Name\"]");
  process.exit(1);
}

const resolvedPath = resolve(process.cwd(), filePath);
if (!existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

let XLSX;
try {
  XLSX = (await import("xlsx")).default ?? (await import("xlsx"));
} catch {
  console.error(
    "The 'xlsx' package is not resolvable from this project. Ask before running `npm install xlsx --no-save` — see SKILL.md preconditions.",
  );
  process.exit(1);
}

const ALIASES = {
  id: ["test case id", "tc id", "case id", "id", "no.", "no", "stt", "so tt", "ma test case"],
  title: ["test case", "title", "test case name", "scenario", "ten test case", "kich ban"],
  precondition: ["precondition", "pre-condition", "prerequisite", "dieu kien tien quyet", "tien dieu kien"],
  steps: ["steps", "test steps", "test step", "action", "buoc thuc hien", "cac buoc"],
  testData: ["test data", "data", "input", "du lieu kiem thu", "du lieu dau vao"],
  expectedResult: ["expected result", "expected", "expected output", "ket qua mong doi"],
  actualResult: ["actual result", "actual", "ket qua thuc te"],
  status: ["status", "result", "trang thai", "ket qua"],
  priority: ["priority", "severity", "do uu tien"],
};

const NON_CASE_SHEETS = new Set(["cover", "summary", "readme", "changelog", "instructions", "template"]);

const normalize = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

const resolveField = (header) => {
  const normalized = normalize(header);
  for (const [field, aliases] of Object.entries(ALIASES)) {
    if (aliases.includes(normalized)) return field;
  }
  return null;
};

const workbook = XLSX.readFile(resolvedPath, { cellDates: true });
const sheetNames = sheetOption
  ? [sheetOption]
  : workbook.SheetNames.filter((name) => !NON_CASE_SHEETS.has(normalize(name)));

if (sheetNames.length === 0) {
  console.error("No candidate test-case sheet found. Pass --sheet explicitly.");
  process.exit(1);
}
if (sheetNames.length > 1 && !sheetOption) {
  console.error(
    `Multiple candidate sheets found (${sheetNames.join(", ")}). Re-run with --sheet "<name>" to pick one.`,
  );
  process.exit(1);
}

const sheet = workbook.Sheets[sheetNames[0]];
if (!sheet) {
  console.error(`Sheet not found: ${sheetNames[0]}`);
  process.exit(1);
}

// raw: false reads each cell's formatted display text (cell.w), not its raw value (cell.v) —
// required so IDs like "007" and date-like test data survive without Excel's numeric/date coercion.
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, blankrows: true, raw: false });

const findHeaderRowIndex = () => {
  let bestIndex = -1;
  let bestScore = -1;
  for (let i = 0; i < Math.min(rows.length, 10); i += 1) {
    const row = rows[i] ?? [];
    const resolved = row.map(resolveField).filter(Boolean);
    const hasIdOrStep = resolved.includes("id") || resolved.includes("steps");
    const score = resolved.length + (hasIdOrStep ? 10 : 0);
    if (hasIdOrStep && score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return bestIndex;
};

const headerRowIndex = findHeaderRowIndex();
if (headerRowIndex === -1) {
  console.error("Could not locate a header row with an ID or Steps column in the first 10 rows.");
  process.exit(1);
}

const headerRow = rows[headerRowIndex];
const columnFields = headerRow.map(resolveField);

const dataRows = rows.slice(headerRowIndex + 1).filter((row) => row.some((cell) => cell !== null && cell !== ""));

const cases = [];
let current = null;
const warnings = [];

const pushWarning = (id, field, reason) => warnings.push({ id, field, reason });

for (const row of dataRows) {
  const record = {};
  columnFields.forEach((field, columnIndex) => {
    if (!field) return;
    record[field] = row[columnIndex] ?? null;
  });

  const isNewCase = record.id !== null && record.id !== undefined && String(record.id).trim() !== "";

  if (isNewCase) {
    if (current) cases.push(current);
    current = {
      id: String(record.id).trim(),
      title: record.title ?? null,
      precondition: record.precondition ?? null,
      steps: [],
      testData: {},
      expectedResult: record.expectedResult ?? null,
      warnings: [],
    };
  }

  if (!current) continue;

  if (record.steps !== null && record.steps !== undefined && String(record.steps).trim() !== "") {
    current.steps.push({
      index: current.steps.length + 1,
      action: String(record.steps).trim(),
      ...(record.testData ? { testData: record.testData } : {}),
      ...(record.expectedResult && current.steps.length > 0 ? { expectedResult: record.expectedResult } : {}),
    });
  }

  if (record.testData !== null && record.testData !== undefined && String(record.testData).trim() !== "") {
    const key = `field${Object.keys(current.testData).length + 1}`;
    current.testData[key] = record.testData;
  }
}
if (current) cases.push(current);

for (const testCase of cases) {
  if (!testCase.title) pushWarning(testCase.id, "title", "Blank title cell");
  if (!testCase.expectedResult && !testCase.steps.some((step) => step.expectedResult)) {
    pushWarning(testCase.id, "expectedResult", "No expected result found at case or step level");
  }
  if (testCase.steps.length === 0) pushWarning(testCase.id, "steps", "No steps parsed for this case");
  testCase.warnings = warnings.filter((warning) => warning.id === testCase.id).map(({ field, reason }) => ({ field, reason }));
}

console.log(JSON.stringify({ sheet: sheetNames[0], cases }, null, 2));
