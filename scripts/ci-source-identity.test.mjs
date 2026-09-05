import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseTestTotals, sourceIdentity } from "./write-ci-summary.mjs";
function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), "rush-ci-identity-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "-q"); writeFileSync(join(cwd, "source.txt"), "source\n"); git("add", ".");
  git("-c", "user.name=CI identity test", "-c", "user.email=test@localhost", "commit", "-qm", "fixture");
  return { cwd, sha: git("rev-parse", "HEAD"), tree: git("rev-parse", "HEAD^{tree}") };
}
test("PR checkout identity is the head, not its synthetic triggering merge", async t => {
  const f = fixture(t);
  const result = await sourceIdentity({ GITHUB_EVENT_NAME: "pull_request", GITHUB_SHA: "a".repeat(40), CI_EXPECTED_SOURCE_SHA: f.sha }, f.cwd);
  assert.equal(result.status, "verified"); assert.equal(result.checkedOutSha, f.sha);
  assert.equal(result.checkedOutTree, f.tree); assert.equal(result.matchesExpected, true);
});
test("PR event payload provides the head when an explicit expected head is absent", async t => {
  const f = fixture(t);
  const path = join(f.cwd, "event.json");
  writeFileSync(path, JSON.stringify({ pull_request: { head: { sha: f.sha } } }));
  const result = await sourceIdentity({ GITHUB_EVENT_NAME: "pull_request", GITHUB_SHA: "a".repeat(40), GITHUB_EVENT_PATH: path }, f.cwd);
  assert.equal(result.status, "verified"); assert.equal(result.expectedSha, f.sha);
});
test("missing PR evidence never substitutes the synthetic merge as the source head", async t => {
  const f = fixture(t);
  const result = await sourceIdentity({ GITHUB_EVENT_NAME: "pull_request", GITHUB_SHA: f.sha }, f.cwd);
  assert.equal(result.status, "unverified"); assert.equal(result.expectedSha, null);
});
test("push and dispatch validate the checked-out commit against the trigger", async t => {
  const f = fixture(t);
  for (const event of ["push", "workflow_dispatch"]) {
    const result = await sourceIdentity({ GITHUB_EVENT_NAME: event, GITHUB_SHA: f.sha }, f.cwd);
    assert.equal(result.status, "verified"); assert.equal(result.expectedSha, f.sha);
  }
});
test("incorrect head is reported as a mismatch", async t => {
  const f = fixture(t);
  const result = await sourceIdentity({ GITHUB_EVENT_NAME: "push", GITHUB_SHA: "b".repeat(40) }, f.cwd);
  assert.equal(result.status, "mismatch"); assert.equal(result.matchesExpected, false);
});
test("modified tracked source cannot be described as exact-head validation", async t => {
  const f = fixture(t);
  writeFileSync(join(f.cwd, "source.txt"), "tampered\n");
  const result = await sourceIdentity({ GITHUB_EVENT_NAME: "push", GITHUB_SHA: f.sha }, f.cwd);
  assert.equal(result.status, "dirty"); assert.equal(result.dirtyTracked, true);
});
test("missing Git checkout remains unavailable rather than fabricated", async t => {
  const cwd = mkdtempSync(join(tmpdir(), "rush-no-git-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const result = await sourceIdentity({ GITHUB_EVENT_NAME: "push", GITHUB_SHA: "a".repeat(40) }, cwd);
  assert.equal(result.status, "unavailable"); assert.equal(result.checkedOutSha, null);
});
test("local runs are explicitly local with no invented expected commit", async t => {
  const f = fixture(t); const result = await sourceIdentity({}, f.cwd);
  assert.equal(result.status, "local"); assert.equal(result.expectedSha, null);
});
test("TAP totals retain exact failures, cancellations and skips", () => {
  assert.deepEqual(parseTestTotals("# tests 12\n# pass 8\n# fail 2\n# cancelled 1\n# skipped 1\n"), { tests: 12, pass: 8, fail: 2, cancelled: 1, skipped: 1 });
});
test("missing or interrupted totals are unknown, never a fabricated passing count", () => {
  for (const text of ["", "# tests 2\n# pass 2\n", "error before testing"]) assert.equal(parseTestTotals(text), null);
});
