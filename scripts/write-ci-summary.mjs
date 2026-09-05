#!/usr/bin/env node
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

const exec = promisify(execFile);
const CAPTURE_ROOTS = ["artifacts", "screenshots", "dist", ".output", "test-results", "playwright-report"];

async function listFiles(path, output = []) {
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return output;
    throw error;
  }
  for (const entry of entries) {
    const full = fromRoot(relative(projectRoot, path), entry.name);
    if (entry.isDirectory()) await listFiles(full, output);
    else if (entry.isFile()) {
      const info = await stat(full);
      output.push({ path: relative(projectRoot, full).replaceAll("\\", "/"), bytes: info.size });
    }
  }
  return output;
}

/** Triggering PR merge SHAs are not checkout identities. Read the actual Git object. */
export async function sourceIdentity(env = process.env, cwd = projectRoot) {
  let expectedSha = env.CI_EXPECTED_SOURCE_SHA || null;
  if (!expectedSha && env.GITHUB_EVENT_NAME === "pull_request") {
    try { expectedSha = JSON.parse(await readFile(env.GITHUB_EVENT_PATH, "utf8")).pull_request?.head?.sha || null; }
    catch { /* Missing event evidence must not fall back to the synthetic merge SHA. */ }
  } else if (!expectedSha && env.GITHUB_EVENT_NAME && env.GITHUB_EVENT_NAME !== "local") {
    expectedSha = env.GITHUB_SHA || null;
  }
  try {
    const git = async (...args) => (await exec("git", args, { cwd, encoding: "utf8" })).stdout.trim();
    const checkedOutSha = await git("rev-parse", "HEAD");
    const checkedOutTree = await git("rev-parse", "HEAD^{tree}");
    const dirtyTracked = (await git("status", "--porcelain", "--untracked-files=no")).length > 0;
    const matchesExpected = expectedSha ? checkedOutSha === expectedSha : null;
    const status = dirtyTracked ? "dirty" : matchesExpected === false ? "mismatch"
      : matchesExpected === true ? "verified" : env.GITHUB_EVENT_NAME && env.GITHUB_EVENT_NAME !== "local" ? "unverified" : "local";
    return { status, checkedOutSha, checkedOutTree, expectedSha, matchesExpected, dirtyTracked };
  } catch (error) {
    return { status: "unavailable", checkedOutSha: null, checkedOutTree: null, expectedSha, matchesExpected: null, dirtyTracked: null, error: error.message };
  }
}

export function parseTestTotals(text) {
  const result = {};
  for (const key of ["tests", "pass", "fail", "cancelled", "skipped"]) {
    const matches = [...String(text).matchAll(new RegExp(`^# ${key} (\\d+)\\s*$`, "gm"))];
    if (!matches.length) return null;
    result[key] = Number(matches.at(-1)[1]);
  }
  return result;
}

export async function buildSummary(env = process.env) {
  const files = [];
  for (const root of CAPTURE_ROOTS) await listFiles(fromRoot(root), files);
  files.sort((a, b) => a.path.localeCompare(b.path));
  let unitTests = null;
  try { unitTests = parseTestTotals(await readFile(fromRoot("artifacts", "unit-tests.tap"), "utf8")); }
  catch (error) { if (error?.code !== "ENOENT") throw error; }
  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    repository: env.GITHUB_REPOSITORY || "talstilkol/rush-israel",
    workflow: env.GITHUB_WORKFLOW || "required-ci",
    job: env.GITHUB_JOB || "validate",
    jobStatusAtCollection: env.CI_JOB_STATUS || "unknown",
    event: env.GITHUB_EVENT_NAME || "local",
    ref: env.GITHUB_REF || null,
    sha: env.GITHUB_SHA || null, // Legacy alias, explicitly a trigger identity only.
    triggerSha: env.GITHUB_SHA || null,
    source: await sourceIdentity(env),
    headRef: env.GITHUB_HEAD_REF || null,
    runId: env.GITHUB_RUN_ID || null,
    runAttempt: env.GITHUB_RUN_ATTEMPT || null,
    unitTests,
    capturedFiles: files,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await mkdir(fromRoot("artifacts"), { recursive: true });
  const summary = await buildSummary();
  await writeFile(fromRoot("artifacts", "ci-summary.json"), JSON.stringify(summary, null, 2) + "\n");
  console.log(`ci-summary source=${summary.source.status} checkout=${summary.source.checkedOutSha} tree=${summary.source.checkedOutTree} tests=${JSON.stringify(summary.unitTests)} files=${summary.capturedFiles.length}`);
  if (summary.event !== "local" && summary.source.status !== "verified") process.exitCode = 1;
}
