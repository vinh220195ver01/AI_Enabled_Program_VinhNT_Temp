#!/usr/bin/env node
/**
 * Run Playwright from the current working directory (project root).
 * Extra argv are forwarded to `npx playwright test`.
 * Reused by automation-debugger to re-run a failing spec after a fix.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const cwd = process.cwd();
const configNames = [
  "playwright.config.ts",
  "playwright.config.js",
  "playwright.config.mts",
  "playwright.config.mjs",
];

if (!configNames.some((name) => existsSync(resolve(cwd, name)))) {
  console.error(
    "No playwright.config.* in this directory. Run from the project root that contains Playwright.",
  );
  process.exit(1);
}

const extra = process.argv.slice(2);
const result = spawnSync("npx", ["playwright", "test", ...extra], {
  cwd,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
