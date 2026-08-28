import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

const RSH_006_IMPLEMENTATION_HEAD = "5c15dc41eaebd1bc7f56758c046391a28bedbd8b";

function readJson(name) {
  return JSON.parse(readFileSync(fromRoot(name), "utf8"));
}

test("canonical queue contains exactly RSH-001 through RSH-067", () => {
  const queue = readJson("QUEUE.json");
  const expected = Array.from(
    { length: 67 },
    (_, index) => `RSH-${String(index + 1).padStart(3, "0")}`,
  );
  assert.equal(queue.counts.total, 67);
  assert.deepEqual(queue.unit_order, expected);
  assert.equal(
    queue.counts.accepted
      + queue.counts.in_review
      + queue.counts.eligible
      + queue.counts.deferred,
    67,
  );
  assert.equal(queue.counts.remaining, 61);
  assert.equal(Object.keys(queue.accepted).length, queue.counts.accepted);
});

test("post-merge current state and queue agree exactly", () => {
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
  assert.equal(current.next_eligible_change.unit, queue.queue_head.id);
  assert.equal(current.next_eligible_change.branch, null);
  assert.equal(current.next_eligible_change.pull_request, null);
  assert.equal(queue.queue_head.automatic_start, false);
});

test("the owner-authorised batch is complete and ends at RSH-006", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const units = ["RSH-002", "RSH-003", "RSH-004", "RSH-005", "RSH-006"];

  assert.deepEqual(current.batch_authorization.authorized_units, units);
  assert.equal(current.batch_authorization.closed_after, "RSH-006");
  assert.equal(current.batch_authorization.completed_units, 5);
  assert.equal(current.batch_authorization.total_units, 5);
  assert.equal(current.batch_authorization.state, "completed");
  assert.equal(current.batch_authorization["RSH-007_authorized"], false);

  assert.deepEqual(queue.policy.completed_bounded_batch.authorized_units, units);
  assert.equal(queue.policy.completed_bounded_batch.closed_after, "RSH-006");
  assert.equal(queue.policy.completed_bounded_batch.completed, 5);
  assert.equal(queue.policy.completed_bounded_batch.total, 5);
  assert.equal(queue.next_instruction_contract.batch_authority_remaining, 0);
});

test("RSH-006 acceptance transition is explicit and RSH-007 is not pre-created", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");

  assert.equal(current.transition_basis.pull_request, 7);
  assert.equal(current.transition_basis.reviewed_implementation_head_sha, RSH_006_IMPLEMENTATION_HEAD);
  assert.equal(queue.transition_basis.effective_on_merge_of_pull_request, 7);
  assert.equal(queue.transition_basis.reviewed_implementation_head_sha, RSH_006_IMPLEMENTATION_HEAD);

  assert.equal(current.accepted_units["RSH-006"].pr, 7);
  assert.equal(current.accepted_units["RSH-006"].implementation_head_sha, RSH_006_IMPLEMENTATION_HEAD);
  assert.equal(current.accepted_units["RSH-006"].merge_sha, null);
  assert.equal(queue.accepted["RSH-006"].pull_request, 7);
  assert.equal(queue.accepted["RSH-006"].implementation_head_sha, RSH_006_IMPLEMENTATION_HEAD);
  assert.equal(queue.accepted["RSH-006"].merge_sha, null);

  const b006 = baseline.baselines.find((entry) => entry.id === "B006-rsh-006-accepted-on-pr-merge");
  assert.ok(b006);
  assert.equal(b006.pull_request, 7);
  assert.equal(b006.reviewed_implementation_head_sha, RSH_006_IMPLEMENTATION_HEAD);
  assert.equal(b006.merge_sha, null);

  assert.equal(queue.queue_head.id, "RSH-007");
  assert.equal(queue.queue_head.branch, null);
  assert.equal(queue.queue_head.pull_request, null);
  assert.equal(queue.next_after_acceptance.id, "RSH-008");
  assert.equal(current.validation["RSH-007_precreated"], false);
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
