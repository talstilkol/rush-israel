import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readJson(name) {
  return JSON.parse(readFileSync(fromRoot(name), "utf8"));
}

test("canonical queue contains exactly RSH-001 through RSH-067", () => {
  const queue = readJson("QUEUE.json");
  const expected = Array.from({ length: 67 }, (_, index) => `RSH-${String(index + 1).padStart(3, "0")}`);
  assert.equal(queue.counts.total, 67);
  assert.deepEqual(queue.unit_order, expected);
  assert.equal(
    queue.counts.accepted + queue.counts.in_review + queue.counts.queued_blocked + queue.counts.deferred,
    67,
  );
  assert.equal(Object.keys(queue.accepted).length, queue.counts.accepted);
});

test("current state and queue agree on the active unit and counts", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  assert.equal(current.program_status.program_units_total, queue.counts.total);
  assert.equal(current.program_status.accepted_units, queue.counts.accepted);
  assert.equal(current.program_status.units_in_review, queue.counts.in_review);
  assert.equal(current.program_status.queued_blocked_units, queue.counts.queued_blocked);
  assert.equal(current.program_status.deferred_units, queue.counts.deferred);
  assert.equal(current.program_status.queue_head, queue.queue_head.id);
  assert.equal(current.active_change.unit, queue.queue_head.id);
  assert.equal(current.active_change.branch, queue.queue_head.branch);
});

test("the owner-authorised batch ends at RSH-006", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  assert.deepEqual(current.batch_authorization.authorized_units, [
    "RSH-002",
    "RSH-003",
    "RSH-004",
    "RSH-005",
    "RSH-006",
  ]);
  assert.equal(current.batch_authorization.ends_after, "RSH-006");
  assert.equal(current.batch_authorization.RSH-007_authorized, false);
  assert.equal(queue.policy.bounded_batch_authorization.ends_after, "RSH-006");
  assert.equal(queue.next_after_acceptance.id, "RSH-007");
  assert.equal(queue.next_after_acceptance.automatic_start, false);
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
