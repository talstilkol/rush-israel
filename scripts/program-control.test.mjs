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

test("current state and queue agree on every post-merge program count", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  assert.equal(current.state_semantics.effective_event, "merge_of_RSH_015_pull_request");
  assert.equal(queue.state_effective_on, "merge_of_RSH_015_pull_request");
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

test("the historical owner batch is closed and the RSH-015 authority is consumed", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const expected = ["RSH-010", "RSH-011", "RSH-012", "RSH-013", "RSH-014"];
  assert.deepEqual(current.batch_authorization.authorized_units, expected);
  assert.deepEqual(queue.policy.active_bounded_batch.authorized_units, expected);
  assert.equal(current.batch_authorization.completed_units, 5);
  assert.equal(queue.policy.active_bounded_batch.completed, 5);
  assert.equal(current.batch_authorization.total_units, 5);
  assert.equal(queue.policy.active_bounded_batch.total, 5);
  assert.equal(current.batch_authorization.closed_after, "RSH-014");
  assert.equal(current.batch_authorization["RSH-015_was_separately_authorized"], true);
  assert.equal(current.batch_authorization["RSH-015_authorization_consumed"], true);
  assert.equal(current.batch_authorization["RSH-016_authorized"], false);
  assert.deepEqual(current.single_unit_authorization.authorized_units, ["RSH-015"]);
  assert.equal(current.single_unit_authorization.completed_units, 1);
  assert.equal(current.single_unit_authorization.total_units, 1);
  assert.equal(current.single_unit_authorization.state, "consumed_on_RSH-015_merge");
  assert.equal(queue.next_instruction_contract.authorization_remaining, 0);
  assert.equal(queue.next_instruction_contract.authorization_closed, true);
  assert.equal(queue.state_rules["RSH-001–RSH-015"], "accepted");
  assert.equal(queue.state_rules["RSH-015"], undefined);
  assert.deepEqual(queue.state_rules.eligible, []);
  assert.equal(
    queue.next_instruction_contract.current_action,
    "No unit is authorized; RSH-016 remains deferred until a new explicit owner instruction.",
  );
  assert.equal(queue.next_instruction_contract["RSH-015_completed"], true);
  assert.equal(queue.next_instruction_contract["RSH-015_authorization_consumed"], true);
  assert.equal(queue.next_instruction_contract["RSH-016_authorized"], false);
  assert.equal(queue.policy.latest_single_unit_authorization.completed, 1);
  assert.equal(queue.policy.latest_single_unit_authorization.total, 1);
  assert.equal(queue.policy.latest_single_unit_authorization["RSH-016_authorized"], false);
  assert.equal(current.batch_authorization.next_instruction_required, true);
});

test("RSH-007 through RSH-012 are reconciled to exact accepted evidence", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const evidence = {
    "RSH-007": ["88c7754b62c66cfdf59f8bfce847db2113eb09de", "3cb2ca2ac6d34b25f77f313b70590bcc36190f76", 9, "B007-rsh-007-accepted"],
    "RSH-008": ["c7628b1da3d149f1881961148e11564039de4b8d", "bf1add01626e72db660cdd1e195f233c24399d0a", 10, "B008-rsh-008-accepted"],
    "RSH-009": ["69765febef85d732d9ba79fe260fec78ee76b2df", "f71d56ba9d095f4850d95be45f255b1463fb0a92", 11, "B009-rsh-009-accepted"],
    "RSH-010": ["d8259877740a2feab6533f1723fd21be8fb2f6c2", "920cad7837d08808fce441e4b8e25f89adedbfd4", 13, "B010-rsh-010-accepted"],
    "RSH-011": ["aab3b725f256ff5a0a145c5cd3ac749860bdaeb9", "0d88fe23cfb6581c8490962dc316a6cf83cd3c2c", 14, "B011-rsh-011-accepted"],
    "RSH-012": ["94524201dfe87f1f22f8d8bdd9d97aad507c0438", "32ad65d756013ac2ec13ff1b78940cd12061fb27", 15, "B012-rsh-012-accepted"],
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
  assert.equal(current.accepted_units["RSH-011"].shipping_files_total, 134);
  assert.equal(current.accepted_units["RSH-011"].asset_files_total, 131);
  assert.equal(current.accepted_units["RSH-011"].unverified_asset_files, 66);
  assert.equal(
    current.accepted_units["RSH-011"].public_game_tree_sha1,
    "332fe666fd91590787856c32cf2040b8f6adb7d0",
  );
});

test("RSH-014 evidence is fully reconciled before RSH-015 acceptance", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const accepted = current.accepted_units["RSH-014"];
  assert.equal(accepted.state, "accepted");
  assert.equal(accepted.pull_request, 17);
  assert.equal(accepted.validated_head_sha, "87c621305e57c2c2dbc4b38f952c3d3bcf335c04");
  assert.equal(accepted.merge_sha, "076dabb754dba1676c6685a4a8d6f6d3c0b153ea");
  assert.equal(accepted.tree_sha, "1fee6773325f4b01bf08a670d9db9e1f930c122a");
  assert.equal(accepted.workflow_run, 33271431815);
  assert.equal(accepted.workflow_job, 99150485806);
  assert.equal(accepted.artifact_id, 9720254205);
  assert.equal(accepted.post_merge_workflow_run, 33271755489);
  assert.equal(accepted.post_merge_workflow_job, 99151332118);
  assert.equal(accepted.post_merge_artifact_id, 9720347564);
  assert.equal(accepted.unresolved_review_threads, 0);
  assert.equal(queue.accepted["RSH-014"].merge_sha, accepted.merge_sha);
  const entry = baseline.baselines.find((item) => item.id === "B014-rsh-014-accepted");
  assert.equal(entry.commit_sha, accepted.merge_sha);
  assert.equal(entry.validated_head_sha, accepted.validated_head_sha);
});

test("RSH-015 becomes accepted on merge and consumes exactly one authorization", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const modules = readJson("TRACK-MODULE-MANIFEST.json");
  const worldCore = readJson("WORLD-CORE-MANIFEST.json");
  assert.equal(queue.counts.accepted, 15);
  assert.equal(queue.counts.in_review, 0);
  assert.equal(queue.counts.eligible, 0);
  assert.equal(queue.counts.deferred, 52);
  assert.equal(queue.counts.remaining, 52);
  assert.equal(queue.queue_head.id, "RSH-016");
  assert.equal(queue.queue_head.state, "deferred_not_authorized");
  assert.equal(queue.queue_head.branch, null);
  assert.equal(queue.queue_head.pull_request, null);
  assert.equal(current.active_change, null);
  assert.equal(current.last_transition.unit, "RSH-015");
  assert.equal(current.last_transition.state, "accepted_on_merge");
  assert.equal(current.accepted_units["RSH-015"].state, "accepted_on_merge");
  assert.equal(current.accepted_units["RSH-015"].world_lines_before, 9034);
  assert.equal(current.accepted_units["RSH-015"].world_lines_after, 9006);
  assert.equal(current.accepted_units["RSH-015"].core_lines, 116);
  assert.equal(current.accepted_units["RSH-015"].runtime_behavior_changes, 0);
  assert.equal(modules.modules.length, 56);
  assert.equal(modules.semantic_integrity.runtime_data_changes, 0);
  assert.equal(modules.semantic_integrity.runtime_order_changes, 0);
  assert.equal(worldCore.extraction.return_key_order.length, 22);
  assert.equal(worldCore.boundaries.rsh016_created, false);
  assert.equal(worldCore.boundaries.rsh016_authorized, false);
  assert.equal(baseline.working_state.unit, "RSH-015");
  assert.equal(baseline.working_state.state, "accepted_on_merge");
  assert.equal(queue.next_instruction_contract.authorization_remaining, 0);
  assert.equal(queue.next_instruction_contract["RSH-016_authorized"], false);
  assert.equal(queue.next_after_acceptance.id, "RSH-016");
  assert.equal(queue.next_after_acceptance.state, "deferred_not_authorized");
});
test("asset provenance remains accepted without claiming legal clearance", () => {
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
  assert.equal(current.rsh_011_provenance.state, "accepted");
  assert.equal(current.rsh_011_provenance.unverified_asset_files, 66);
});

test("RSH-012 metadata is explicit while public release remains blocked", () => {
  const current = readJson("CURRENT-STATE.json");
  const metadata = readJson("PRODUCT-METADATA.json");
  assert.equal(metadata.product.name, "RUSH Israel");
  assert.equal(metadata.product.version, "0.0.0-private");
  assert.equal(metadata.package.license, "UNLICENSED");
  assert.equal(metadata.pwa.manifest_delivery, "dynamic_via_vite_and_server_middleware");
  assert.equal(metadata.licensing.unverified_asset_files, 66);
  assert.equal(metadata.licensing.public_distribution_authorized, false);
  assert.equal(metadata.readiness.release_gates_green, 0);
  assert.equal(metadata.readiness.release_gates_total, 13);
  assert.equal(current.rsh_012_metadata.state, "accepted");
});

test("findings close only the three RSH-012 definition and documentation gaps", () => {
  const current = readJson("CURRENT-STATE.json");
  assert.deepEqual(current.findings, {
    total: 42,
    p0: 12,
    p1: 18,
    p2: 12,
    open: 24,
    mitigated: 7,
    closed: 11,
    register: "FINDINGS-REGISTER.md",
  });
  const findings = readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8");
  assert.match(findings, /\| P0-12 \| P0 \| \*\*MITIGATED\*\*/);
  assert.match(findings, /\| P1-08 \| P1 \| \*\*CLOSED\*\*/);
  assert.match(findings, /\| P2-01 \| P2 \| \*\*CLOSED\*\*/);
  assert.match(findings, /\| P2-08 \| P2 \| \*\*CLOSED\*\*/);
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

test("product, catalogue, provenance and metadata tests are in the complete suite", () => {
  const pkg = readJson("package.json");
  assert.match(pkg.scripts.test, /scripts\/\*\*\/\*\.test\.mjs/);
  assert.equal(readJson("PRODUCT-DEFINITION.json").product.definition_state, "frozen");
  assert.equal(readJson("TRACK-CATALOGUE-CLASSIFICATION.json").counts.total, 56);
  assert.equal(readJson("ASSET-PROVENANCE.json").scope.shipping_files_total, 134);
  assert.equal(readJson("PRODUCT-METADATA.json").product.name, "RUSH Israel");
  assert.equal(readJson("TRACK-SCHEMA.json").schema_version, "1.0.2");
  assert.equal(readJson("TRACK-MODULE-MANIFEST.json").modules.length, 56);
  assert.equal(readJson("WORLD-CORE-MANIFEST.json").extraction.return_key_order.length, 22);
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
