#!/usr/bin/env node
/**
 * Wait until GitHub PR checks complete. Exit 0 only if every check succeeded.
 * Usage: node wait-pr-pipeline.mjs [pr-number-or-url]
 */
import { spawnSync } from "node:child_process";

const pr = process.argv[2];
const shell = process.platform === "win32";

function gh(args, inherit) {
  return spawnSync("gh", args, {
    encoding: "utf8",
    shell,
    stdio: inherit ? "inherit" : "pipe",
  });
}

const watchArgs = ["pr", "checks", "--watch"];
if (pr) watchArgs.splice(2, 0, pr);

const watch = gh(watchArgs, true);
if (watch.error) {
  console.error("Failed to run gh. Install GitHub CLI and authenticate (`gh auth login`).");
  process.exit(1);
}
if (watch.status !== 0) {
  process.exit(watch.status ?? 1);
}

const jsonArgs = ["pr", "view", "--json", "url,state,statusCheckRollup"];
if (pr) jsonArgs.splice(2, 0, pr);

const view = gh(jsonArgs, false);
if (view.status !== 0) {
  process.stderr.write(view.stderr || "gh pr view failed\n");
  process.exit(view.status ?? 1);
}

const payload = JSON.parse(view.stdout || "{}");
const checks = payload.statusCheckRollup || [];

if (checks.length === 0) {
  console.error(`No GitHub checks found for ${payload.url || "this PR"}.`);
  process.exit(1);
}

const failed = checks.filter((check) => {
  const conclusion = (check.conclusion || "").toUpperCase();
  const status = (check.status || "").toUpperCase();
  if (status && status !== "COMPLETED") return true;
  return conclusion !== "SUCCESS" && conclusion !== "SKIPPED" && conclusion !== "NEUTRAL";
});

if (failed.length > 0) {
  console.error("Checks completed but not all succeeded:");
  for (const check of failed) {
    console.error(`- ${check.name}: status=${check.status} conclusion=${check.conclusion}`);
  }
  process.exit(1);
}

console.log(`Pipeline complete: ${payload.url}`);
console.log(`${checks.length} check(s) finished successfully. Leave the PR open for reviewer approval.`);
