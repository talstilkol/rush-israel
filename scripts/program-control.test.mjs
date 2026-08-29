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

test("the owner-bounded next-five batch is exactly RSH-010 through RSH-014", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const expected = ["RSH-010", "RSH-011", "RSH-012", "RSH-013", "RSH-014"];
  assert.deepEqual(current.batch_authorization.authorized_units, expected);
  assert.deepEqual(queue.policy.active_bounded_batch.authorized_units, expected);
  assert.equal(current.batch_authorization.completed_units, 0);
  assert.equal(queue.policy.active_bounded_batch.completed, 0);
  assert.equal(current.batch_authorization.total_units, 5);
  assert.equal(queue.policy.active_bounded_batch.total, 5);
  assert.equal(current.batch_authorization.closed_after, "RSH-014");
  assert.equal(current.batch_authorization.RSH_015_authorized, false);
});

test("RSH-007 through RSH-009 are reconciled to exact accepted evidence", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");

  const evidence = {
    "RSH-007": {
      merge: "88c7754b62c66cfdf59f8bfce847db2113eb09de",
      head: "3cb2ca2ac6d34b25f77f313b70590bcc36190f76",
      pr: 9,
      baseline: "B007-rsh-007-accepted",
    },
    "RSH-008": {
      merge: "c7628b1da3d149f1881961148e11564039de4b8d",
      head: "bf1add01626e72db660cdd1e195f233c24399d0a",
      pr: 10,
      baseline: "B008-rsh-008-accepted",
    },
    "RSH-009": {
      merge: "69765febef85d732d9ba79fe260fec78ee76b2df",
      head: "f71d56ba9d095f4850d95be45f255b1463fb0a92",
      pr: 11,
      baseline: "B009-rsh-009-accepted",
    },
  };

  for (const [unit, expected] of Object.entries(evidence)) {
    assert.equal(current.accepted_units[unit].merge_sha, expected.merge);
    assert.equal(current.accepted_units[unit].validated_head_sha, expected.head);
    assert.equal(queue.accepted[unit].merge_sha, expected.merge);
    assert.equal(queue.accepted[unit].validated_head_sha, expected.head);
    const entry = baseline.baselines.find((item) => item.id === expected.baseline);
    assert.ok(entry);
    assert.equal(entry.commit_sha, expected.merge);
    assert.equal(entry.validated_head_sha, expected.head);
    assert.equal(entry.pull_request, expected.pr);
  }

  assert.equal(current.accepted_units["RSH-008"].branch_protection_applied, false);
  assert.equal(
    current.accepted_units["RSH-009"].product_definition_sha256,
    "a9e481e9c262b51ddb09bee75a129f7886b6161f234abfd24ccea20d3de6f715",
  );
});

test("RSH-010 is the sole in-review unit and RSH-011 is not pre-created", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");

  assert.equal(queue.counts.accepted, 9);
  assert.equal(queue.counts.in_review, 1);
  assert.equal(queue.counts.remaining, 58);
  assert.equal(queue.queue_head.id, "RSH-010");
  assert.equal(queue.queue_head.state, "pr_open");
  assert.equal(queue.queue_head.branch, "agent/rsh-010-track-catalogue-classification");
  assert.equal(queue.queue_head.pull_request, 12);
  assert.equal(current.active_change.unit, queue.queue_head.id);
  assert.equal(current.active_change.branch, queue.queue_head.branch);
  assert.equal(current.active_change.pull_request, queue.queue_head.pull_request);
  assert.equal(baseline.working_state.unit, "RSH-010");
  assert.equal(baseline.working_state.pull_request, 12);
  assert.equal(current.validation.RSH_011_precreated, false);
  assert.equal(queue.next_after_acceptance.id, "RSH-011");
});

test("track catalogue authority is complete and remains non-release evidence", () => {
  const current = readJson("CURRENT-STATE.json");
  const catalogue = readJson("TRACK-CATALOGUE-CLASSIFICATION.json");
  assert.deepEqual(catalogue.counts, { total: 56, mvp: 8, deferred: 48 });
  assert.equal(catalogue.entries.length, 56);
  assert.equal(catalogue.entries.filter((entry) => entry.status === "mvp").length, 8);
  assert.equal(catalogue.entries.filter((entry) => entry.status === "deferred").length, 48);
  assert.equal(current.rsh_010_classification.deleted_entries, 0);
  assert.equal(catalogue.rules.release_gates_green, 0);
  assert.equal(catalogue.rules.release_gates_total, 13);
});

test("live settings claims fail closed while protection is unapplied", () => {
  const current = readJson("CURRENT-STATE.json");
  const status = readJson("REPOSITORY-SETTINGS-STATUS.json");
  assert.equal(current.repository_snapshot.visibility_current, "public");
  assert.equal(current.repository_snapshot.main_protected, false);
  assert.equal(current.repository_snapshot.required_status_checks, 0);
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

test("product and catalogue validators are integrated into the complete test suite", () => {
  const pkg = readJson("package.json");
  const definition = readJson("PRODUCT-DEFINITION.json");
  const catalogue = readJson("TRACK-CATALOGUE-CLASSIFICATION.json");
  assert.equal(definition.product.definition_state, "frozen");
  assert.equal(definition.change_control.definition_frozen_by, "RSH-009");
  assert.equal(catalogue.document_type, "rush-track-catalogue-classification");
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
