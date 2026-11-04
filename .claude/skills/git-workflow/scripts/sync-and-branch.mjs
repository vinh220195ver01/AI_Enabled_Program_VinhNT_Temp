#!/usr/bin/env node
/**
 * Generalized branch/commit helper for any coding task (not QA-specific) —
 * the git-workflow skill's sync/branch/commit helper. See SKILL.md.
 *
 * Usage:
 *   node sync-and-branch.mjs --branch <name> --message <msg> --file <path> [--file <path> ...]
 *     [--base <branch>] [--dry-run]
 */
import { spawnSync } from "node:child_process";
import process from "node:process";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const collect = (name) => {
  const values = [];
  args.forEach((arg, index) => {
    if (arg === `--${name}`) values.push(args[index + 1]);
  });
  return values;
};
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};

const branchName = option("branch");
const message = option("message");
const files = collect("file");

if (!branchName || !message || files.length === 0) {
  console.error(
    "Usage: node sync-and-branch.mjs --branch <name> --message <msg> --file <path> [--file <path> ...] [--base <branch>] [--dry-run]",
  );
  process.exit(1);
}

const run = (command, cmdArgs, allowFailure = false) => {
  const result = spawnSync(command, cmdArgs, {
    cwd: process.cwd(),
    shell: process.platform === "win32",
    stdio: ["inherit", "pipe", "pipe"],
    encoding: "utf8",
  });
  if (result.status !== 0 && !allowFailure) {
    throw new Error(`${command} ${cmdArgs.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result;
};

const detectBaseBranch = () => {
  for (const branch of ["develop", "main", "master"]) {
    const check = spawnSync("git", ["show-ref", "--verify", `refs/remotes/origin/${branch}`], { encoding: "utf8" });
    if (check.status === 0) return branch;
  }
  const head = run("git", ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], true);
  return head.status === 0 ? head.stdout.trim().replace(/^origin\//, "") : "main";
};

const baseBranch = option("base") || detectBaseBranch();

try {
  const status = run("git", ["status", "--porcelain", "--untracked-files=all"]).stdout;
  const changed = (status ?? "").split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).replace(/\\/g, "/"));
  const unexpected = changed.filter((path) => !files.includes(path));
  if (unexpected.length > 0) {
    throw new Error(
      `Unexpected working-tree changes outside --file list: ${unexpected.join(", ")}. Review and stage explicitly, or add them with another --file.`,
    );
  }

  const branchExists = run("git", ["show-ref", "--verify", `refs/heads/${branchName}`], true).status === 0;
  if (branchExists) {
    throw new Error(
      `Branch already exists: ${branchName}. Confirm whether to continue on it (switch manually) or pick a new name — see references/branching.md.`,
    );
  }

  console.log(`Base branch: ${baseBranch}`);
  console.log(`New branch: ${branchName}`);
  console.log(`Files: ${files.join(", ")}`);
  console.log(`Commit message: ${message}`);

  if (dryRun) {
    console.log("Dry run: no git state changed.");
    process.exit(0);
  }

  run("git", ["switch", baseBranch]);
  run("git", ["pull", "--ff-only", "origin", baseBranch]);
  run("git", ["switch", "-c", branchName]);
  run("git", ["add", ...files]);
  run("git", ["commit", "-m", message]);
  run("git", ["pull", "--no-edit", "origin", baseBranch]);

  console.log(`\nBranch ${branchName} is committed and synced with ${baseBranch}.`);
  console.log(`Next: git push -u origin ${branchName}, then hand off to github-pr.`);
} catch (error) {
  console.error(`\ngit-workflow failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
