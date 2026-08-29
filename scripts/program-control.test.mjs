import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readJson(name) {
  return JSON.parse(readFileSync(fromRoot(name), "utf8"));
}

function expectedUnitOrder() {
  return Array.from(
    { length: 67 },
    (_, index) => `RSH-${String(index + 1).padStart(3, "0")}`,
  );
}

test("canonical queue contains exactly RSH-001 through RSH-067", () => {
  const queue = readJson("QUEUE.json");
  assert.equal(queue.counts.total, 67);
  assert.deepEqual(queue.unit_order, expectedUnitOrder());
  assert.equal(
    queue.counts.accepted
      + queue.counts.in_review
      + queue.counts.eligible
      + queue.counts.deferred,
    queue.counts.total,
  );
  assert.equal(queue.counts.remaining, queue.counts.total - queue.counts.accepted);
  assert.equal(Object.keys(queue.accepted).length, queue.counts.accepted);
});

test("current state and queue agree on every live program count", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  assert.equal(current.program_status.program_units_total, queue.counts.total);
  assert.equal(current.program_status.accepted_units, queue.counts.accepted);
  assert.equal(current.program_status.units_in_review, queue.counts.in_review);
  assert.equal(current.program_status.eligible_units, queue.counts.eligible);
  assert.equal(current.program_status.deferred_units, queue.counts.deferred);
  assert.equal(current.program_status.remaining_units, queue.counts.remaining);
  assert.equal(current.program_status.queue_head, queue.queue_head.id);
  assert.equal(current.program_status.queue_head_state, queue.queue_head.state);
  assert.equal(current.program_status.queue_head_branch, queue.queue_head.branch);
  assert.equal(current.program_status.queue_head_pull_request, queue.queue_head.pull_request);
});

test("the owner-bounded batch has exactly one accepted unit", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const currentBatch = current.batch_authorization;
  const queueBatch = queue.policy.active_bounded_batch;

  assert.deepEqual(currentBatch.authorized_units, queueBatch.authorized_units);
  assert.deepEqual(currentBatch.authorized_units, [
    "RSH-007",
    "RSH-008",
    "RSH-009",
    "RSH-010",
    "RSH-011",
  ]);
  assert.equal(currentBatch.completed_units, 1);
  assert.equal(queueBatch.completed, 1);
  assert.equal(currentBatch.total_units, 5);
  assert.equal(queueBatch.total, 5);
  assert.equal(currentBatch.closed_after, "RSH-011");
  assert.equal(currentBatch["RSH-012_authorized"], false);
});

test("RSH-007 is reconciled to its exact merged and validated evidence", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const mergeSha = "88c7754b62c66cfdf59f8bfce847db2113eb09de";
  const validatedHead = "3cb2ca2ac6d34b25f77f313b70590bcc36190f76";

  assert.equal(current.accepted_units["RSH-007"].merge_sha, mergeSha);
  assert.equal(current.accepted_units["RSH-007"].validated_head_sha, validatedHead);
  assert.equal(current.accepted_units["RSH-007"].workflow_conclusion, "success");
  assert.equal(queue.accepted["RSH-007"].merge_sha, mergeSha);
  assert.equal(queue.accepted["RSH-007"].validated_head_sha, validatedHead);
  const entry = baseline.baselines.find((item) => item.id === "B007-rsh-007-accepted");
  assert.ok(entry);
  assert.equal(entry.commit_sha, mergeSha);
  assert.equal(entry.validated_head_sha, validatedHead);
  assert.equal(entry.pull_request, 9);
});

test("RSH-008 is the sole in-review unit and RSH-009 is not pre-created", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  assert.equal(queue.counts.accepted, 7);
  assert.equal(queue.counts.in_review, 1);
  assert.equal(queue.counts.remaining, 60);
  assert.equal(queue.queue_head.id, "RSH-008");
  assert.equal(queue.queue_head.state, "pr_open");
  assert.equal(queue.queue_head.branch, "agent/rsh-008-required-checks-artifacts");
  assert.equal(queue.queue_head.pull_request, 10);
  assert.equal(current.active_change.unit, queue.queue_head.id);
  assert.equal(current.active_change.branch, queue.queue_head.branch);
  assert.equal(current.active_change.pull_request, queue.queue_head.pull_request);
  assert.equal(baseline.working_state.pull_request, 10);
  assert.equal(current.validation["RSH-009_precreated"], false);
  assert.equal(queue.next_after_acceptance.id, "RSH-009");
});

test("live settings claims fail closed while protection is unapplied", () => {
  const current = readJson("CURRENT-STATE.json");
  const status = readJson("REPOSITORY-SETTINGS-STATUS.json");
  assert.equal(current.repository_snapshot.main_protected, false);
  assert.equal(current.repository_snapshot.rulesets, 0);
  assert.equal(status.application_state, "owner_action_required");
  assert.equal(status.claims.branch_protection_applied, false);
  assert.equal(status.claims.required_check_enforced_by_repository_setting, false);
  assert.equal(current.rsh_008_enforcement.branch_protection_claimed_applied, false);
});

test("the required CI workflow checks out exact heads, validates governance and retains diagnostics", () => {
  const workflow = readFileSync(fromRoot(".github", "workflows", "required-ci.yml"), "utf8");
  assert.match(workflow, /name:\s*required-ci/);
  assert.match(workflow, /name:\s*required-ci \/ validate/);
  assert.match(workflow, /github\.event\.pull_request\.head\.sha/);
  assert.match(workflow, /node scripts\/check-governance-contract\.mjs/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run qa:ci/);
  assert.match(workflow, /npm run build:dev/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /retention-days:\s*14/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});

test("public QA commands own the server lifecycle", () => {
  const pkg = readJson("package.json");
  assert.match(pkg.scripts.qa, /run-with-server\.mjs/);
  assert.match(pkg.scripts["qa:ci"], /run-with-server\.mjs/);
  assert.match(pkg.scripts["qa:drive"], /run-with-server\.mjs/);
  assert.match(pkg.scripts["qa:soak-smoke"], /run-with-server\.mjs/);
  assert.doesNotMatch(pkg.scripts["qa:drive:raw"], /run-with-server\.mjs/);
  assert.doesNotMatch(pkg.scripts["qa:ktx2"], /run-with-server\.mjs/);
});
