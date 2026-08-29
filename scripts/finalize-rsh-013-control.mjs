import assert from "node:assert/strict";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

const BASE = "94524201dfe87f1f22f8d8bdd9d97aad507c0438";
const BASE_TREE = "53ec197fefc4c4f44b8992e04164d30d8d6a18f8";
const RSH12_HEAD = "32ad65d756013ac2ec13ff1b78940cd12061fb27";
const RSH13_DIGEST = "9f30d10a8be5d7388c23720a96ead370f9acaf38aa55aeac2f8166d8b8555230";
const GENERATED_AT = "2026-08-29T10:55:00+03:00";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function replaceRequired(text, search, replacement, label = String(search)) {
  assert.ok(text.includes(search), `missing expected text: ${label}`);
  return text.replace(search, replacement);
}

const state = readJson("CURRENT-STATE.json");
assert.equal(state.program_status.queue_head, "RSH-013");
assert.equal(state.program_status.accepted_units, 12);
state.schema_version = "2.9.0";
state.generated_at = GENERATED_AT;
state.state_semantics = {
  effective_event: "merge_of_pull_request_16",
  implementation_base_sha: BASE,
  self_reference_boundary:
    "A candidate cannot contain its own future merge SHA. PR #16 exact-head and merge evidence are read from live GitHub and reconciled in the RSH-014 preflight.",
};
state.verified_main = {
  head_sha: BASE,
  tree_sha: BASE_TREE,
  commit_authored_at: "2026-08-29T09:39:30+03:00",
  commit_message: "Merge PR #15: RSH-012 — Align metadata, licence, branding and PWA scope",
  commit_signature_verified: true,
  role: "RSH-013 implementation base",
};
state.program_status = {
  program_units_total: 67,
  accepted_units: 13,
  units_in_review: 0,
  eligible_units: 1,
  deferred_units: 53,
  remaining_units: 54,
  queue_head: "RSH-014",
  queue_head_state: "eligible_under_owner_next_2",
  queue_head_branch: null,
  queue_head_pull_request: null,
  automatic_execution: false,
  release_gates_green: 0,
  release_gates_total: 13,
};
state.accepted_units["RSH-012"] = {
  pr: 15,
  merge_sha: BASE,
  validated_head_sha: RSH12_HEAD,
  workflow_run: 33238573169,
  workflow_job: 99063868307,
  artifact_id: 9710694253,
  artifact_digest: "sha256:37aa46870012bb483e1a845abc46fa39fb15870708a05afcc985040e3cdd4c99",
  post_merge_workflow_run: 33238995506,
  post_merge_workflow_job: 99064943903,
  post_merge_artifact_id: 9710813024,
  post_merge_artifact_digest: "sha256:f8377306405db4c7470fe8f2c14693636aee445c670d10ecdd342cf8a3313259",
  public_distribution_authorized: false,
  unverified_asset_files: 66,
};
state.accepted_units["RSH-013"] = {
  pr: 16,
  state: "accepted_on_merge",
  validated_head_resolution: "the exact PR #16 head that passes required-ci / validate and Codex review",
  merge_sha_resolution: "the live main HEAD created by merging PR #16",
  exact_evidence_reconciliation: "RSH-014 preflight",
  track_count: 56,
  mvp_tracks: 8,
  deferred_tracks: 48,
  runtime_definition_digest: RSH13_DIGEST,
  runtime_data_changes: 0,
  runtime_order_changes: 0,
};
state.active_change = null;
state.last_transition = {
  unit: "RSH-013",
  title: "Define and validate the canonical track schema",
  branch: "agent/rsh-013-canonical-track-schema",
  pull_request: 16,
  base_sha: BASE,
  state: "accepted_on_merge",
  merge_authorized_by_owner_instruction: "next 2",
  acceptance_requires_exact_head_ci_success: true,
  game_runtime_data_changed: false,
  asset_binary_changes: 0,
  dependency_versions_changed: false,
};
state.batch_authorization.completed_units = 4;
state.batch_authorization.state = "active_final_unit_remaining";
state.batch_authorization.continuation_instruction = "next 2";
state.rsh_012_metadata.state = "accepted";
state.rsh_012_metadata.merge_sha = BASE;
state.rsh_012_metadata.validated_head_sha = RSH12_HEAD;
state.rsh_013_schema = {
  machine_authority: "TRACK-SCHEMA.json",
  human_authority: "TRACK-SCHEMA.md",
  compile_time_authority: "src/game/track-schema.ts",
  validator: "scripts/check-track-schema.mjs",
  state: "accepted_on_merge",
  definitions: 56,
  unique_track_ids: 56,
  mvp_tracks: 8,
  deferred_tracks: 48,
  runtime_definition_digest: RSH13_DIGEST,
  canonical_id_order_equals_runtime_order: false,
  runtime_data_changes: 0,
  runtime_order_changes: 0,
};
state.constraints = [
  "Do not claim the repository is private until GitHub metadata confirms it.",
  "Do not claim branch protection is applied until GitHub metadata confirms it.",
  "Do not claim legal clearance while 66 asset files remain unverified.",
  "RSH-014 may start only after PR #16 merges and live main is re-read.",
  "RSH-014 is the second unit authorized by the current next 2 instruction and the final unit in the RSH-010–RSH-014 batch.",
  "Do not pre-create or execute RSH-015.",
  "Release gates remain 0/13.",
];
state.validation = {
  ...state.validation,
  queue_units: 67,
  catalogue_entries: 56,
  mvp_entries: 8,
  deferred_entries: 48,
  track_schema_version: "1.0.1",
  track_schema_runtime_digest: RSH13_DIGEST,
  track_runtime_data_changes: 0,
  track_runtime_order_changes: 0,
  public_shipping_files: 134,
  public_asset_files: 131,
  unverified_public_asset_files: 66,
  game_source_changes: 0,
  asset_binary_changes: 0,
  dependency_version_changes: 0,
  RSH_014_precreated: false,
  RSH_015_authorized: false,
};
delete state.validation.RSH_013_precreated;
writeJson("CURRENT-STATE.json", state);

const queue = readJson("QUEUE.json");
assert.equal(queue.queue_head.id, "RSH-013");
queue.schema_version = "2.9.0";
queue.generated_at = GENERATED_AT;
queue.verified_base_sha = BASE;
queue.state_effective_on = "merge_of_pull_request_16";
queue.policy.active_bounded_batch.completed = 4;
queue.policy.active_bounded_batch.continuation_instruction = "next 2";
queue.counts = {
  total: 67,
  accepted: 13,
  in_review: 0,
  eligible: 1,
  deferred: 53,
  remaining: 54,
};
queue.queue_head = {
  id: "RSH-014",
  title: "Split tracks.ts into one module per track",
  state: "eligible_under_owner_next_2",
  branch: null,
  pull_request: null,
  acceptance_condition:
    "Start one clean RSH-014 branch from the live RSH-013 merge; preserve the pinned runtime definition digest; pass exact-head required-ci / validate and review before merge.",
};
queue.next_after_acceptance = {
  id: "RSH-015",
  title: "Extract the world core from world.ts",
  state: "deferred_not_authorized",
};
queue.accepted["RSH-012"] = {
  pull_request: 15,
  merge_sha: BASE,
  validated_head_sha: RSH12_HEAD,
  workflow_run: 33238573169,
  workflow_job: 99063868307,
  artifact_id: 9710694253,
  artifact_digest: "sha256:37aa46870012bb483e1a845abc46fa39fb15870708a05afcc985040e3cdd4c99",
  post_merge_workflow_run: 33238995506,
  post_merge_workflow_job: 99064943903,
  post_merge_artifact_id: 9710813024,
  post_merge_artifact_digest: "sha256:f8377306405db4c7470fe8f2c14693636aee445c670d10ecdd342cf8a3313259",
};
queue.accepted["RSH-013"] = {
  pull_request: 16,
  state: "accepted_on_merge",
  validated_head_resolution: "exact PR #16 head accepted by required-ci / validate and Codex review",
  merge_sha_resolution: "live main HEAD created by merging PR #16",
  exact_evidence_reconciliation: "RSH-014 preflight",
  runtime_definition_digest: RSH13_DIGEST,
};
queue.state_rules = {
  "RSH-001–RSH-013": "accepted",
  "RSH-014": "eligible_under_owner_next_2",
  "RSH-015–RSH-067": "deferred_not_authorized",
};
queue.next_instruction_contract = {
  current_action:
    "After PR #16 merges, continue the current next 2 instruction by starting RSH-014 only from verified live main.",
  after_RSH_014: "The bounded batch closes; RSH-015 requires a new explicit owner instruction.",
  batch_authority_remaining: 1,
  RSH_014_precreated: false,
  RSH_015_authorized: false,
};
queue.self_reference_boundary = {
  RSH_013_merge_sha: "resolve from live main after PR #16 merges",
  RSH_013_validated_head: "resolve from the exact merged PR #16 head",
  reconcile_in: "RSH-014 preflight",
};
writeJson("QUEUE.json", queue);

const baseline = readJson("BASELINE-REGISTER.json");
assert.equal(baseline.working_state.unit, "RSH-012");
baseline.schema_version = "1.9.0";
baseline.generated_at = GENERATED_AT;
baseline.baselines = baseline.baselines.filter(
  (entry) => entry.id !== "B012-rsh-012-accepted" && entry.id !== "B013-rsh-013-accepted",
);
baseline.baselines.push({
  id: "B012-rsh-012-accepted",
  kind: "accepted-unit",
  unit: "RSH-012",
  pull_request: 15,
  commit_sha: BASE,
  tree_sha: BASE_TREE,
  validated_head_sha: RSH12_HEAD,
  workflow_run: 33238573169,
  workflow_job: 99063868307,
  artifact_id: 9710694253,
  artifact_digest: "sha256:37aa46870012bb483e1a845abc46fa39fb15870708a05afcc985040e3cdd4c99",
  recorded_at: "2026-08-29T09:39:30+03:00",
  description:
    "Canonical RUSH Israel metadata, proprietary licence, package/lock identity, root head and Vite/Nitro PWA alignment accepted after exact-head CI and Codex review.",
});
baseline.baselines.push({
  id: "B013-rsh-013-accepted",
  kind: "accepted-unit-on-merge",
  unit: "RSH-013",
  pull_request: 16,
  validated_head_resolution: "exact PR #16 head accepted by required-ci / validate and Codex review",
  commit_sha_resolution: "live main HEAD created by merging PR #16",
  tree_sha_resolution: "tree of the live PR #16 merge commit",
  exact_evidence_reconciliation: "RSH-014 preflight",
  runtime_definition_digest: RSH13_DIGEST,
  recorded_at: GENERATED_AT,
  description:
    "Canonical track schema, TypeScript-AST validation and exact ordered runtime-definition digest accepted on PR #16 merge without changing runtime data or order.",
});
baseline.working_state = {
  unit: "RSH-013",
  state: "accepted_on_merge_of_PR_16",
  base_commit_sha: BASE,
  branch: "agent/rsh-013-canonical-track-schema",
  pull_request: 16,
  head_sha_resolution: "the exact PR #16 head accepted by required-ci / validate and Codex review",
  merge_sha_resolution: "the live main HEAD created by merging PR #16",
  exact_evidence_reconciliation: "RSH-014 preflight",
  runtime_definition_digest: RSH13_DIGEST,
  is_release: false,
  tag_created: false,
  release_created: false,
  live_branch_protection: false,
  settings_application_state: "owner_action_required",
  runtime_evidence:
    "Exactly 56 definitions, 8 MVP and 48 deferred IDs; the ordered source digest is pinned and runtime data/order changes are zero.",
};
baseline.post_merge_queue = {
  queue_head: "RSH-014",
  state: "eligible_under_owner_next_2",
  branch: null,
  pull_request: null,
  requires_new_next: false,
  RSH_015_authorized: false,
};
writeJson("BASELINE-REGISTER.json", baseline);

let master = readFileSync("MASTER-PLAN.md", "utf8");
master = replaceRequired(master, "**Schema:** 2.8.0", "**Schema:** 2.9.0");
master = replaceRequired(master, "**RSH-012 implementation base:** `aab3b725f256ff5a0a145c5cd3ac749860bdaeb9`", `**RSH-013 implementation base:** \`${BASE}\``);
master = replaceRequired(master, "**State effective on:** merge of PR #15", "**State effective on:** merge of PR #16");
master = replaceRequired(master, "**Next eligible unit:** RSH-013", "**Next eligible unit:** RSH-014");
master = replaceRequired(master, "`PRODUCT-METADATA.json` and `REPOSITORY-GOVERNANCE.md` control program state.", "`PRODUCT-METADATA.json`, `TRACK-SCHEMA.json` and `REPOSITORY-GOVERNANCE.md` control program state.");
master = replaceRequired(master, "9. RSH-013 requires a new `next`; RSH-015 is not authorised.", "9. The current `next 2` continues with RSH-014 after PR #16 merges; RSH-015 is not authorised.");
master = replaceRequired(master, "## 5. Post-RSH-012 program state", "## 5. Post-RSH-013 program state");
for (const [before, after] of [
  ["| Accepted | 12 |", "| Accepted | 13 |"],
  ["| Deferred | 54 |", "| Deferred | 53 |"],
  ["| Remaining | 55 |", "| Remaining | 54 |"],
  ["| Queue head | RSH-013 |", "| Queue head | RSH-014 |"],
  ["| Current batch completed | 3/5 |", "| Current batch completed | 4/5 |"],
  ["| G2 | RSH-009–012 | 4 | Scope, licensing and assets | ACCEPTED ON PR #15 MERGE |", "| G2 | RSH-009–012 | 4 | Scope, licensing and assets | ACCEPTED |"],
  ["| G3 | RSH-013–020 | 8 | Architecture decomposition | ACTIVE — RSH-013 eligible; RSH-014 authorised |", "| G3 | RSH-013–020 | 8 | Architecture decomposition | ACTIVE — RSH-013 accepted on PR #16 merge; RSH-014 eligible |"],
]) master = replaceRequired(master, before, after);
const currentBoundary = master.indexOf("## 9. Current execution boundary");
assert.ok(currentBoundary >= 0);
master = `${master.slice(0, currentBoundary)}## 9. Current execution boundary\n\nPR #16 is the sole RSH-013 delivery vehicle. It establishes one machine-readable\ntrack schema, compile-time helpers, TypeScript-AST validation and the pinned ordered\nruntime-definition digest \`${RSH13_DIGEST}\` without changing runtime data or order.\n\nAfter exact-head CI and review pass and PR #16 merges, RSH-014 becomes eligible as\nthe second unit authorised by the current \`next 2\` instruction and the final unit\nin the RSH-010–RSH-014 batch. RSH-015 must not be created or executed automatically.\n`;
writeFileSync("MASTER-PLAN.md", master);

let milestone = readFileSync("MILESTONE-REGISTER.md", "utf8");
milestone = replaceRequired(milestone, "**Version:** 1.8.0", "**Version:** 1.9.0");
milestone = replaceRequired(milestone, "**RSH-012 implementation base:** `aab3b725f256ff5a0a145c5cd3ac749860bdaeb9`", `**RSH-013 implementation base:** \`${BASE}\``);
milestone = replaceRequired(milestone, "**State effective on:** merge of PR #15", "**State effective on:** merge of PR #16");
milestone = replaceRequired(milestone, "**Next eligible unit:** RSH-013", "**Next eligible unit:** RSH-014");
for (const [before, after] of [
  ["| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACCEPTED ON PR #15 MERGE |", "| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACCEPTED |"],
  ["| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | ACTIVE — RSH-013 eligible; RSH-014 authorised-deferred |", "| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | ACTIVE — RSH-013 accepted on PR #16 merge; RSH-014 eligible |"],
  ["| Accepted units | 12 |", "| Accepted units | 13 |"],
  ["| Queue head | RSH-013 |", "| Queue head | RSH-014 |"],
  ["| Remaining units | 55 |", "| Remaining units | 54 |"],
  ["| Batch completed | 3/5 |", "| Batch completed | 4/5 |"],
  ["| RSH-012 — README, metadata, branding, root licence and PWA alignment | ACCEPTED ON MERGE — PR #15 |", "| RSH-012 — README, metadata, branding, root licence and PWA alignment | ACCEPTED — PR #15 |"],
  ["| RSH-013 — canonical track schema | ELIGIBLE AFTER PR #15; requires new `next` |", "| RSH-013 — canonical track schema | ACCEPTED ON MERGE — PR #16 |"],
  ["| RSH-014 — one module per track | AUTHORISED, BLOCKED BY RSH-013, FINAL BATCH UNIT |", "| RSH-014 — one module per track | ELIGIBLE UNDER `next 2`; FINAL BATCH UNIT |"],
]) milestone = replaceRequired(milestone, before, after);
writeFileSync("MILESTONE-REGISTER.md", milestone);

const nextContract = `# RUSH Israel — NEXT Contract

**Version:** 2.9.0  
**Repository:** \`talstilkol/rush-israel\`  
**Canonical branch:** \`main\`  
**RSH-013 implementation base:** \`${BASE}\`  
**State effective on:** merge of PR #16  
**Next eligible unit after merge:** \`RSH-014\`  
**RSH-015 authorised:** no

## 1. Authority

GitHub and the canonical control documents govern the program. Live GitHub evidence
supersedes chat summaries and recorded SHAs whenever they differ.

The owner instruction \`next 2\` authorises exactly the serial sequence RSH-013 then
RSH-014. It does not authorise RSH-015. RSH-014 starts only after RSH-013 is validated,
reviewed, merged and live \`main\` is re-read.

## 2. RSH-013 acceptance boundary

PR #16 may merge only when its exact final head proves:

- one machine-readable schema agrees with \`TrackId\`, \`CityId\` and \`TrackDef\`;
- all 56 definitions are present exactly once;
- the frozen classification remains 8 MVP and 48 deferred;
- canonical ID order and runtime definition order are treated as distinct authorities;
- the committed Ayalon point-builder IIFE is accepted only by the narrow reviewed form;
- the ordered runtime-definition digest is exactly \`${RSH13_DIGEST}\`;
- valid-looking runtime-data mutations fail the digest check;
- runtime data and runtime ordering changed by this unit are both zero;
- release gates remain 0/13;
- exact-head \`required-ci / validate\` and Codex review pass with no unresolved blocking thread.

## 3. Transition to RSH-014

After PR #16 merges, RSH-014 is the sole eligible queue head and the second unit of
the current \`next 2\` instruction. It must use a new branch and PR from verified live
\`main\`. It may relocate definitions into one module per track only if the exact
ordered runtime digest remains unchanged.

## 4. Truth boundaries

- Repository visibility remains public against the private owner policy.
- \`main\` remains unprotected with zero required checks and zero rulesets.
- Exactly 66 public asset files remain unverified.
- Legal clearance and public distribution remain blocked.
- A candidate cannot encode its own future merge SHA; PR #16 evidence is reconciled in RSH-014 preflight.
- Release gates remain 0/13.

## 5. Prohibited actions

- starting RSH-014 before PR #16 merges;
- starting or pre-creating RSH-015;
- changing track runtime data, runtime order, IDs or MVP membership in RSH-014;
- claiming repository privacy, branch protection or legal clearance without live evidence;
- direct \`main\` writes, force-push or history rewrite.

## 6. Post-merge metrics

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted units | 13 |
| In review | 0 |
| Eligible | 1 |
| Deferred | 53 |
| Remaining units | 54 |
| Queue head | RSH-014 |
| Active PR | none |
| Batch units completed | 4/5 |
| Batch authority remaining | 1 |
| Unverified asset files | 66 |
| Legal clearance complete | No |
| Release gates | 0/13 |
`;
writeFileSync("NEXT-CONTRACT.md", nextContract);

let findings = readFileSync("FINDINGS-REGISTER.md", "utf8");
findings = replaceRequired(findings, "**Version:** 1.5.0", "**Version:** 1.6.0");
findings = replaceRequired(findings, "**RSH-012 implementation base:** `aab3b725f256ff5a0a145c5cd3ac749860bdaeb9`", `**RSH-013 implementation base:** \`${BASE}\``);
findings = replaceRequired(findings, "**State effective on:** merge of PR #15", "**State effective on:** merge of PR #16");
findings = replaceRequired(findings, "RSH-001–RSH-012 use isolated branches and PRs", "RSH-001–RSH-013 use isolated branches and PRs");
findings = replaceRequired(
  findings,
  "| P1-15 | P1 | **OPEN** | Content, rendering, physics, UI and QA are tightly coupled | Large modules mix world construction, gameplay, rendering and test hooks. | RSH-013 through RSH-020 |",
  "| P1-15 | P1 | **OPEN** | Content, rendering, physics, UI and QA are tightly coupled | RSH-013 adds a canonical track schema and runtime-data pin; module decomposition remains pending from RSH-014 onward. | RSH-013 through RSH-020 |",
);
writeFileSync("FINDINGS-REGISTER.md", findings);

let tests = readFileSync("scripts/program-control.test.mjs", "utf8");
tests = tests.replaceAll("merge_of_pull_request_15", "merge_of_pull_request_16");
tests = replaceRequired(tests, "the owner-bounded next-five batch has exactly three accepted units on merge", "the owner-bounded batch has exactly four accepted units on RSH-013 merge");
tests = replaceRequired(tests, "assert.equal(current.batch_authorization.completed_units, 3);", "assert.equal(current.batch_authorization.completed_units, 4);");
tests = replaceRequired(tests, "assert.equal(queue.policy.active_bounded_batch.completed, 3);", "assert.equal(queue.policy.active_bounded_batch.completed, 4);");
tests = replaceRequired(tests, "assert.equal(queue.next_instruction_contract.batch_authority_remaining, 2);", "assert.equal(queue.next_instruction_contract.batch_authority_remaining, 1);");
tests = replaceRequired(tests, "RSH-007 through RSH-011 are reconciled to exact accepted evidence", "RSH-007 through RSH-012 are reconciled to exact accepted evidence");
tests = replaceRequired(
  tests,
  '    "RSH-011": ["aab3b725f256ff5a0a145c5cd3ac749860bdaeb9", "0d88fe23cfb6581c8490962dc316a6cf83cd3c2c", 14, "B011-rsh-011-accepted"],',
  '    "RSH-011": ["aab3b725f256ff5a0a145c5cd3ac749860bdaeb9", "0d88fe23cfb6581c8490962dc316a6cf83cd3c2c", 14, "B011-rsh-011-accepted"],\n    "RSH-012": ["94524201dfe87f1f22f8d8bdd9d97aad507c0438", "32ad65d756013ac2ec13ff1b78940cd12061fb27", 15, "B012-rsh-012-accepted"],',
);
const transitionStart = tests.indexOf('test("RSH-012 becomes accepted on merge and RSH-013 is eligible but not pre-created"');
const transitionEnd = tests.indexOf('test("asset provenance remains accepted', transitionStart);
assert.ok(transitionStart >= 0 && transitionEnd > transitionStart);
const transitionTest = `test("RSH-013 becomes accepted on merge and RSH-014 is the sole eligible final batch unit", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const schema = readJson("TRACK-SCHEMA.json");
  assert.equal(queue.counts.accepted, 13);
  assert.equal(queue.counts.in_review, 0);
  assert.equal(queue.counts.eligible, 1);
  assert.equal(queue.counts.deferred, 53);
  assert.equal(queue.counts.remaining, 54);
  assert.equal(queue.queue_head.id, "RSH-014");
  assert.equal(queue.queue_head.state, "eligible_under_owner_next_2");
  assert.equal(queue.queue_head.branch, null);
  assert.equal(queue.queue_head.pull_request, null);
  assert.equal(current.active_change, null);
  assert.equal(current.last_transition.unit, "RSH-013");
  assert.equal(current.last_transition.pull_request, 16);
  assert.equal(current.last_transition.state, "accepted_on_merge");
  assert.equal(current.accepted_units["RSH-013"].state, "accepted_on_merge");
  assert.equal(current.accepted_units["RSH-013"].runtime_definition_digest, "${RSH13_DIGEST}");
  assert.equal(schema.runtime_definition_integrity.expected_digest, "${RSH13_DIGEST}");
  assert.equal(schema.runtime_definition_integrity.capture_state, "pinned");
  assert.equal(baseline.working_state.unit, "RSH-013");
  assert.equal(baseline.working_state.state, "accepted_on_merge_of_PR_16");
  assert.equal(current.validation["RSH_014_precreated"], false);
  assert.equal(queue.next_instruction_contract["RSH_014_precreated"], false);
  assert.equal(queue.next_after_acceptance.id, "RSH-015");
  assert.equal(queue.next_after_acceptance.state, "deferred_not_authorized");
});

`;
tests = `${tests.slice(0, transitionStart)}${transitionTest}${tests.slice(transitionEnd)}`;
tests = replaceRequired(tests, 'assert.equal(current.rsh_012_metadata.state, "accepted_on_merge");', 'assert.equal(current.rsh_012_metadata.state, "accepted");');
tests = replaceRequired(
  tests,
  '  assert.equal(readJson("PRODUCT-METADATA.json").product.name, "RUSH Israel");',
  '  assert.equal(readJson("PRODUCT-METADATA.json").product.name, "RUSH Israel");\n  assert.equal(readJson("TRACK-SCHEMA.json").schema_version, "1.0.1");',
);
writeFileSync("scripts/program-control.test.mjs", tests);

for (const path of [
  "scripts/finalize-rsh-013-control.mjs",
  ".github/workflows/rsh-013-control-finalize.yml",
]) {
  if (existsSync(path)) unlinkSync(path);
}

console.log("RSH-013 canonical transition finalized for merge of PR #16");
