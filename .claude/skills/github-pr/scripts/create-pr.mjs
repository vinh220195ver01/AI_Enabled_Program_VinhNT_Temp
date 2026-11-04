#!/usr/bin/env node
/**
 * Push the current branch and open a PR — the github-pr skill's PR-creation helper.
 * See SKILL.md.
 *
 * Usage:
 *   node create-pr.mjs --branch <name> --base <branch> --title <title> --body-file <path>
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};

const branch = option("branch");
const base = option("base");
const title = option("title");
const bodyFile = option("body-file");

if (!branch || !base || !title || !bodyFile) {
  console.error("Usage: node create-pr.mjs --branch <name> --base <branch> --title <title> --body-file <path>");
  process.exit(1);
}
if (!existsSync(bodyFile)) {
  console.error(`Body file not found: ${bodyFile}. Compose it from references/pr-template.md first.`);
  process.exit(1);
}

const ghCommand = process.platform === "win32" ? "gh.exe" : "gh";
const shell = process.platform === "win32";

const run = (command, cmdArgs, opts = {}) => {
  const result = spawnSync(command, cmdArgs, { cwd: process.cwd(), shell, stdio: "inherit", ...opts });
  if (result.status !== 0) {
    throw new Error(`${command} ${cmdArgs.join(" ")} failed with exit code ${result.status ?? 1}`);
  }
  return result;
};

try {
  const authCheck = spawnSync(ghCommand, ["auth", "status"], { encoding: "utf8", shell });
  if (authCheck.status !== 0) {
    throw new Error("GitHub CLI is not authenticated. Run 'gh auth login' first.");
  }

  run("git", ["push", "-u", "origin", branch]);
  // --body-file (not --body) so gh reads the file directly — avoids shell-escaping
  // failures for multi-line/quote-heavy bodies, especially under shell:true on Windows.
  run(ghCommand, ["pr", "create", "--base", base, "--head", branch, "--title", title, "--body-file", bodyFile]);

  console.log(`\nPR opened for ${branch} against ${base}. Next: node wait-pr-pipeline.mjs to watch checks.`);
} catch (error) {
  console.error(`\ncreate-pr failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
