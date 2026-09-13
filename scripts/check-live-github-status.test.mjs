import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

const readJson = (name) => JSON.parse(readFileSync(fromRoot(name), "utf8"));

test("LIVE-GITHUB-STATUS is private, protected and names exact gate evidence", () => {
  const live = readJson("LIVE-GITHUB-STATUS.json");
  assert.equal(live.document_type, "rush-live-github-status");
  assert.equal(live.repository, "talstilkol/rush-israel");
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
  assert.equal(live.live.release_gates_green_live, 2);
  assert.equal(live.live.release_gates_total, 13);
  assert.equal(live.gate_2_evidence.state, "GREEN");
  assert.equal(live.gate_2_evidence.ruleset_id, 23177340);
  assert.equal(live.gate_2_evidence.pull_request_required, true);
  assert.deepEqual(live.gate_2_evidence.bypass_actors, []);
  assert.equal(live.gate_4_evidence.state, "GREEN");
  assert.equal(live.gate_4_evidence.required_check, "required-ci / validate");
  assert.equal(live.gate_4_evidence.latest_success_conclusion, "success");
  assert.equal(typeof live.gate_4_evidence.latest_success_run_id, "number");
  assert.match(live.gate_4_evidence.latest_success_head_sha, /^[0-9a-f]{40}$/);
});

test("RSH-067 CURRENT-STATE snapshot stays frozen public/unprotected", () => {
  const live = readJson("LIVE-GITHUB-STATUS.json");
  const current = readJson("CURRENT-STATE.json");
  assert.equal(live.frozen_rsh_067_snapshot.must_remain_unchanged, true);
  assert.equal(current.repository_snapshot.visibility_current, "public");
  assert.equal(current.repository_snapshot.main_protected, false);
  assert.equal(current.program_status.release_gates_green, 0);
});
