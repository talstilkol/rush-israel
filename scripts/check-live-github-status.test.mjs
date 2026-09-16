import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

const readJson = (name) => JSON.parse(readFileSync(fromRoot(name), "utf8"));

test("LIVE-GITHUB-STATUS is private, protected and names exact gate evidence", () => {
  const live = readJson("LIVE-GITHUB-STATUS.json");
  assert.equal(live.document_type, "rush-live-github-status");
  assert.equal(live.repository, "talstilkol/rush-israel");
  assert.equal(live.schema_version, "1.7.0");
  assert.equal(live.live.visibility, "private");
  assert.equal(live.live.private, true);
  assert.equal(live.live.main_protected, true);
  assert.equal(live.live.ruleset_id, 23177340);
  assert.equal(live.live.ruleset_enforcement, "active");
  assert.equal(live.live.pull_request_required, true);
  assert.deepEqual(live.live.bypass_actors, []);
  assert.deepEqual(live.live.required_status_checks, ["required-ci / validate"]);
  assert.equal(live.live.force_push_blocked, true);
  assert.equal(live.live.deletion_blocked, true);
  assert.equal(live.live.required_signatures, false);
  assert.equal(live.live.github_releases, 0);
  assert.equal(live.live.git_tags, 0);
  assert.equal(live.live.release_gates_green_live, 8);
  assert.equal(live.live.release_gates_total, 13);
  assert.equal(live.live.findings_open_live, 4);
  assert.equal(live.live.findings_mitigated_live, 8);
  assert.equal(live.live.findings_closed_live, 30);
  assert.equal(live.gate_2_evidence.state, "GREEN");
  assert.equal(live.gate_2_evidence.ruleset_id, 23177340);
  assert.equal(live.gate_2_evidence.pull_request_required, true);
  assert.deepEqual(live.gate_2_evidence.bypass_actors, []);
  assert.equal(live.gate_3_evidence.state, "GREEN");
  assert.equal(live.gate_4_evidence.state, "GREEN");
  assert.equal(live.gate_4_evidence.required_check, "required-ci / validate");
  assert.equal(live.gate_4_evidence.latest_success_conclusion, "success");
  assert.equal(typeof live.gate_4_evidence.latest_success_run_id, "number");
  assert.match(live.gate_4_evidence.latest_success_head_sha, /^[0-9a-f]{40}$/);
  assert.equal(live.gate_4_evidence.latest_success_run_id, 35095481235);
  assert.equal(live.gate_4_evidence.latest_success_head_sha, "a0850f9523224b8224d940b910c69e8986681578");
  assert.equal(live.gate_5_evidence.state, "GREEN");
  assert.equal(live.gate_5_evidence.public_text_files_scanned, 8);
  assert.equal(live.gate_6_evidence.state, "GREEN");
  assert.equal(live.gate_6_evidence.freeze_granted, true);
  assert.equal(live.gate_6_evidence.transitive_hashes, 36);
  assert.equal(live.gate_6_evidence.direct_import_pins, 6);
  assert.equal(live.gate_7_evidence.state, "GREEN");
  assert.equal(live.gate_7_evidence.qa_ci_raw_unchanged, true);
  assert.equal(live.gate_10_evidence.state, "GREEN");
  assert.equal(live.gate_10_evidence.enter_exit_cycles_in_npm_test, 20);
  assert.equal(live.gate_10_evidence.smoke_substitutes, false);
  assert.equal(live.gate_11_evidence.state, "GREEN");
});

test("RSH-067 CURRENT-STATE snapshot stays frozen public/unprotected", () => {
  const live = readJson("LIVE-GITHUB-STATUS.json");
  const current = readJson("CURRENT-STATE.json");
  assert.equal(live.frozen_rsh_067_snapshot.must_remain_unchanged, true);
  assert.equal(current.repository_snapshot.visibility_current, "public");
  assert.equal(current.repository_snapshot.main_protected, false);
  assert.equal(current.program_status.release_gates_green, 0);
});

test("live findings close stale vertical-slice items and keep checker-locked OPEN tokens", () => {
  const findings = readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8");
  assert.match(findings, /\*\*Status:\*\* 4 OPEN, 8 MITIGATED, 30 CLOSED/);
  assert.match(findings, /\| P0-10 \| P0 \| \*\*CLOSED\*\*/);
  assert.match(findings, /\| P1-16 \| P1 \| \*\*CLOSED\*\*/);
  assert.match(findings, /\| P2-04 \| P2 \| \*\*MITIGATED\*\*/);
  assert.match(findings, /\| P1-12 \| P1 \| \*\*OPEN\*\*/);
  assert.match(findings, /\| P1-13 \| P1 \| \*\*OPEN\*\*/);
  assert.match(findings, /\| P2-03 \| P2 \| \*\*OPEN\*\*/);
  assert.match(findings, /\| P2-09 \| P2 \| \*\*OPEN\*\*/);
  assert.match(findings, /\| P1-17 \| P1 \| \*\*MITIGATED\*\*/);
  assert.match(findings, /\| P1-01 \| P1 \| \*\*MITIGATED\*\*/);
});

test("PR #78 merge evidence and five remaining gates stay RED", () => {
  const live = readJson("LIVE-GITHUB-STATUS.json");
  assert.equal(live.pr_78.number, 78);
  assert.equal(live.pr_78.merge_sha, "a0850f9523224b8224d940b910c69e8986681578");
  assert.equal(live.pr_78.post_merge_workflow_run_id, 35095481235);
  assert.equal(live.pr_78.post_merge_conclusion, "success");
  assert.equal(live.latest_main.sha, live.pr_78.merge_sha);
  assert.equal(live.latest_main.merged_pull_request, 78);
  const red = live.remaining_red_gates;
  assert.equal(red.length, 5);
  assert.deepEqual(red.map((row) => row.id), [1, 8, 9, 12, 13]);
  for (const row of red) {
    assert.equal(row.state, "RED");
    assert.equal(typeof row.blocker, "string");
    assert.ok(row.blocker.length > 20);
  }
  const changelog = readFileSync(fromRoot("CHANGELOG.md"), "utf8");
  assert.match(changelog, /Live gate 10 — 2026-09-16/);
  assert.match(changelog, /35095481235/);
  const adr = readFileSync(fromRoot("ADR-REGISTER.md"), "utf8");
  assert.match(adr, /ADR-011/);
  const plan = readFileSync(fromRoot("MASTER-PLAN.md"), "utf8");
  assert.match(plan, /\*\*8\/13\*\* \(gates 2, 3, 4, 5, 6, 7, 10 and 11\)/);
});
