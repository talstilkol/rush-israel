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
    queue.counts.accepted + queue.counts.in_review + queue.counts.eligible + queue.counts.deferred,
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

test("the owner-bounded next-five batch has exactly one accepted unit", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const expected = ["RSH-010", "RSH-011", "RSH-012", "RSH-013", "RSH-014"];
  assert.deepEqual(current.batch_authorization.authorized_units, expected);
  assert.deepEqual(queue.policy.active_bounded_batch.authorized_units, expected);
  assert.equal(current.batch_authorization.completed_units, 1);
  assert.equal(queue.policy.active_bounded_batch.completed, 1);
  assert.equal(current.batch_authorization.total_units, 5);
  assert.equal(queue.policy.active_bounded_batch.total, 5);
  assert.equal(current.batch_authorization.closed_after, "RSH-014");
  assert.equal(current.batch_authorization["RSH-015_authorized"], false);
});

test("RSH-007 through RSH-010 are reconciled to exact accepted evidence", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const evidence = {
    "RSH-007": ["88c7754b62c66cfdf59f8bfce847db2113eb09de", "3cb2ca2ac6d34b25f77f313b70590bcc36190f76", 9, "B007-rsh-007-accepted"],
    "RSH-008": ["c7628b1da3d149f1881961148e11564039de4b8d", "bf1add01626e72db660cdd1e195f233c24399d0a", 10, "B008-rsh-008-accepted"],
    "RSH-009": ["69765febef85d732d9ba79fe260fec78ee76b2df", "f71d56ba9d095f4850d95be45f255b1463fb0a92", 11, "B009-rsh-009-accepted"],
    "RSH-010": ["d8259877740a2feab6533f1723fd21be8fb2f6c2", "920cad7837d08808fce441e4b8e25f89adedbfd4", 13, "B010-rsh-010-accepted"],
  };
  for (const [unit, [merge, head, pr, baselineId]] of Object.entries(evidence)) {
    assert.equal(current.accepted_units[unit].merge_sha, merge);
    assert.equal(current.accepted_units[unit].validated_head_sha, head);
    assert.equal(queue.accepted[unit].merge_sha, merge);
    assert.equal(queue.accepted[unit].validated_head_sha, head);
    const entry = baseline.baselines.find((item) => item.id === baselineId);
    assert.ok(entry);
    assert.equal(entry.commit_sha, merge);
    assert.equal(entry.validated_head_sha, head);
    assert.equal(entry.pull_request, pr);
  }
  assert.equal(current.accepted_units["RSH-010"].catalogue_total, 56);
  assert.equal(current.accepted_units["RSH-010"].catalogue_mvp, 8);
  assert.equal(current.accepted_units["RSH-010"].catalogue_deferred, 48);
  assert.equal(current.accepted_units["RSH-010"].deleted_tracks, 0);
});

test("RSH-011 is the sole in-review unit and RSH-012 is not pre-created", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  assert.equal(queue.counts.accepted, 10);
  assert.equal(queue.counts.in_review, 1);
  assert.equal(queue.counts.remaining, 57);
  assert.equal(queue.queue_head.id, "RSH-011");
  assert.equal(queue.queue_head.branch, "agent/rsh-011-asset-provenance");
  assert.equal(queue.queue_head.pull_request, 14);
  assert.equal(current.active_change.unit, "RSH-011");
  assert.equal(current.active_change.pull_request, 14);
  assert.equal(baseline.working_state.unit, "RSH-011");
  assert.equal(baseline.working_state.pull_request, 14);
  assert.equal(current.validation["RSH-012_precreated"], false);
  assert.equal(queue.next_after_acceptance.id, "RSH-012");
});

test("asset provenance inventory is complete without claiming legal clearance", () => {
  const current = readJson("CURRENT-STATE.json");
  const manifest = readJson("ASSET-PROVENANCE.json");
  assert.equal(manifest.scope.shipping_files_total, 134);
  assert.equal(manifest.scope.asset_files_total, 131);
  assert.equal(manifest.scope.unverified_shipping_files, 67);
  assert.equal(manifest.scope.unverified_asset_files, 66);
  assert.equal(manifest.scope.public_distribution_authorized, false);
  assert.equal(manifest.scope.legal_clearance_complete, false);
  assert.equal(manifest.truth_boundaries.inventory_coverage_complete, true);
  assert.equal(manifest.truth_boundaries.provenance_evidence_complete, false);
  assert.equal(manifest.truth_boundaries.licence_clearance_complete, false);
  assert.equal(manifest.truth_boundaries.public_release_allowed, false);
  assert.equal(current.rsh_011_provenance.unverified_asset_files, 66);
  assert.equal(current.rsh_011_provenance.licence_clearance_complete, false);
});

test("findings counts remain 42 and provenance is mitigated, not closed", () => {
  const current = readJson("CURRENT-STATE.json");
  assert.deepEqual(current.findings, {
    total: 42,
    p0: 12,
    p1: 18,
    p2: 12,
    open: 25,
    mitigated: 9,
    closed: 8,
    register: "FINDINGS-REGISTER.md",
  });
  const findings = readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8");
  assert.match(findings, /\| P0-12 \| P0 \| \*\*MITIGATED\*\*/);
  assert.doesNotMatch(findings, /\| P0-12 \| P0 \| \*\*CLOSED\*\*/);
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
});

test("required CI checks exact heads and retains diagnostics", () => {
  const workflow = readFileSync(fromRoot(".github", "workflows", "required-ci.yml"), "utf8");
  assert.match(workflow, /name:\s*required-ci \/ validate/);
  assert.match(workflow, /github\.event\.pull_request\.head\.sha/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run qa:ci/);
  assert.match(workflow, /npm run build:dev/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /retention-days:\s*14/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});

test("product, catalogue and provenance tests are in the complete suite", () => {
  const pkg = readJson("package.json");
  assert.match(pkg.scripts.test, /scripts\/\*\*\/\*\.test\.mjs/);
  assert.equal(readJson("PRODUCT-DEFINITION.json").product.definition_state, "frozen");
  assert.equal(readJson("TRACK-CATALOGUE-CLASSIFICATION.json").counts.total, 56);
  assert.equal(readJson("ASSET-PROVENANCE.json").scope.shipping_files_total, 134);
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
