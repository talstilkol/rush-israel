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

test("the owner-bounded batch has exactly two accepted units", () => {
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
  assert.equal(currentBatch.completed_units, 2);
  assert.equal(queueBatch.completed, 2);
  assert.equal(currentBatch.total_units, 5);
  assert.equal(queueBatch.total, 5);
  assert.equal(currentBatch.closed_after, "RSH-011");
  assert.equal(currentBatch["RSH-012_authorized"], false);
});

test("RSH-007 and RSH-008 are reconciled to exact accepted evidence", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");

  const rsh007Merge = "88c7754b62c66cfdf59f8bfce847db2113eb09de";
  const rsh007Head = "3cb2ca2ac6d34b25f77f313b70590bcc36190f76";
  assert.equal(current.accepted_units["RSH-007"].merge_sha, rsh007Merge);
  assert.equal(current.accepted_units["RSH-007"].validated_head_sha, rsh007Head);
  assert.equal(queue.accepted["RSH-007"].merge_sha, rsh007Merge);
  assert.equal(queue.accepted["RSH-007"].validated_head_sha, rsh007Head);

  const rsh008Merge = "c7628b1da3d149f1881961148e11564039de4b8d";
  const rsh008Head = "bf1add01626e72db660cdd1e195f233c24399d0a";
  assert.equal(current.accepted_units["RSH-008"].merge_sha, rsh008Merge);
  assert.equal(current.accepted_units["RSH-008"].validated_head_sha, rsh008Head);
  assert.equal(queue.accepted["RSH-008"].merge_sha, rsh008Merge);
  assert.equal(queue.accepted["RSH-008"].validated_head_sha, rsh008Head);
  assert.equal(current.accepted_units["RSH-008"].branch_protection_applied, false);

  const entry = baseline.baselines.find((item) => item.id === "B008-rsh-008-accepted");
  assert.ok(entry);
  assert.equal(entry.commit_sha, rsh008Merge);
  assert.equal(entry.validated_head_sha, rsh008Head);
  assert.equal(entry.pull_request, 10);
});

test("RSH-009 is the sole in-review unit and RSH-010 is not pre-created", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");

  assert.equal(queue.counts.accepted, 8);
  assert.equal(queue.counts.in_review, 1);
  assert.equal(queue.counts.remaining, 59);
  assert.equal(queue.queue_head.id, "RSH-009");
  assert.equal(queue.queue_head.state, "pr_open");
  assert.equal(queue.queue_head.branch, "agent/rsh-009-freeze-v1-product-definition");
  assert.equal(queue.queue_head.pull_request, 11);
  assert.equal(current.active_change.unit, queue.queue_head.id);
  assert.equal(current.active_change.branch, queue.queue_head.branch);
  assert.equal(current.active_change.pull_request, queue.queue_head.pull_request);
  assert.equal(baseline.working_state.unit, "RSH-009");
  assert.equal(baseline.working_state.pull_request, 11);
  assert.equal(current.validation["RSH-010_precreated"], false);
  assert.equal(queue.next_after_acceptance.id, "RSH-010");
});

test("live settings claims fail closed while protection is unapplied", () => {
  const current = readJson("CURRENT-STATE.json");
  const status = readJson("REPOSITORY-SETTINGS-STATUS.json");
  assert.equal(current.repository_snapshot.main_protected, false);
  assert.equal(current.repository_snapshot.rulesets, 0);
  assert.equal(status.application_state, "owner_action_required");
  assert.equal(status.claims.branch_protection_applied, false);
  assert.equal(status.claims.required_check_enforced_by_repository_setting, false);
});

test("the required CI workflow checks out exact heads, validates governance and retains diagnostics", () => {
  const workflow = readFileSync(
    fromRoot(".github", "workflows", "required-ci.yml"),
    "utf8",
  );
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

test("the frozen product definition is integrated into the complete test suite", () => {
  const pkg = readJson("package.json");
  const definition = readJson("PRODUCT-DEFINITION.json");
  assert.equal(definition.product.definition_state, "frozen");
  assert.equal(definition.change_control.definition_frozen_by, "RSH-009");
  assert.match(pkg.scripts.test, /scripts\/\*\*\/\*\.test\.mjs/);
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
