#!/usr/bin/env node
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { relative } from "node:path";
import { fromRoot, projectRoot } from "./project-root.mjs";

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
      output.push({
        path: relative(projectRoot, full).replaceAll("\\", "/"),
        bytes: info.size,
      });
    }
  }
  return output;
}

export async function buildSummary(env = process.env) {
  const files = [];
  for (const root of CAPTURE_ROOTS) {
    await listFiles(fromRoot(root), files);
  }
  files.sort((a, b) => a.path.localeCompare(b.path));
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    repository: env.GITHUB_REPOSITORY || "talstilkol/rush-israel",
    workflow: env.GITHUB_WORKFLOW || "required-ci",
    job: env.GITHUB_JOB || "validate",
    jobStatusAtCollection: env.CI_JOB_STATUS || "unknown",
    event: env.GITHUB_EVENT_NAME || "local",
    ref: env.GITHUB_REF || null,
    sha: env.GITHUB_SHA || null,
    headRef: env.GITHUB_HEAD_REF || null,
    runId: env.GITHUB_RUN_ID || null,
    runAttempt: env.GITHUB_RUN_ATTEMPT || null,
    capturedFiles: files,
  };
}

const outDir = fromRoot("artifacts");
await mkdir(outDir, { recursive: true });
const summary = await buildSummary();
await writeFile(fromRoot("artifacts", "ci-summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(
  `ci-summary wrote artifacts/ci-summary.json with ${summary.capturedFiles.length} captured file(s)`,
);
