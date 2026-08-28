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

test("the active owner-bounded batch is identical in both control documents", () => {
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
  assert.equal(currentBatch.completed_units, queueBatch.completed);
  assert.equal(currentBatch.total_units, queueBatch.total);
  assert.equal(currentBatch.closed_after, queueBatch.closed_after);
  assert.equal(currentBatch.total_units, currentBatch.authorized_units.length);
  assert.ok(currentBatch.completed_units >= 0);
  assert.ok(currentBatch.completed_units <= currentBatch.total_units);
  assert.equal(currentBatch.RSH-012_authorized, false);
});

test("RSH-006 is reconciled to the live merged main baseline", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const mergeSha = "7ea076d377225d5db3561faf81fe1cedce091a28";

  assert.equal(current.accepted_units["RSH-006"].merge_sha, mergeSha);
  assert.equal(queue.accepted["RSH-006"].merge_sha, mergeSha);
  const entry = baseline.baselines.find((item) => item.id === "B006-rsh-006-accepted");
  assert.ok(entry);
  assert.equal(entry.commit_sha, mergeSha);
  assert.equal(entry.pull_request, 7);
});

test("RSH-007 is the sole in-review unit and RSH-008 is not pre-created", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  assert.equal(queue.counts.in_review, 1);
  assert.equal(queue.queue_head.id, "RSH-007");
  assert.equal(queue.queue_head.branch, "agent/rsh-007-github-actions-ci");
  assert.equal(queue.queue_head.pull_request, 8);
  assert.equal(current.active_change.unit, queue.queue_head.id);
  assert.equal(current.active_change.branch, queue.queue_head.branch);
  assert.equal(current.active_change.pull_request, queue.queue_head.pull_request);
  assert.equal(current.validation.RSH-008_precreated, false);
  assert.equal(queue.next_after_acceptance.id, "RSH-008");
});

test("the required CI workflow checks out the exact PR head and runs all gates", () => {
  const workflow = readFileSync(fromRoot(".github", "workflows", "required-ci.yml"), "utf8");
  assert.match(workflow, /name:\s*required-ci/);
  assert.match(workflow, /name:\s*required-ci \/ validate/);
  assert.match(workflow, /github\.event\.pull_request\.head\.sha/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run qa:ci/);
  assert.match(workflow, /npm run build:dev/);
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
