import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { unactivatedFiles, validateProgramExecution } from "./program-execution.mjs";

const readJson = (name) => JSON.parse(readFileSync(fromRoot(name), "utf8"));
function repositoryFiles(directory = fromRoot(), prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules", "dist", ".output", ".nitro", ".vercel"].includes(entry.name)) return [];
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? repositoryFiles(`${directory}/${entry.name}`, path) : [path];
  });
}
function inputs() {
  return { current: readJson("CURRENT-STATE.json"), queue: readJson("QUEUE.json"), files: repositoryFiles() };
}
function mutate(change) {
  const input = inputs();
  change(input);
  return validateProgramExecution(input).join("\n");
}

test("live execution state has one active unit and no premature acceptance", () => {
  assert.deepEqual(validateProgramExecution(inputs()), []);
});
test("a standing grant cannot skip the unaccepted predecessor", () => {
  assert.match(mutate(({ queue }) => { queue.queue_head.id = "RSH-037"; }), /predecessor acceptance/);
});
test("incrementing acceptance without an accepted record fails", () => {
  assert.match(mutate(({ queue }) => { queue.counts.accepted = 36; queue.counts.remaining = 31; }), /premature/);
});
test("counting a prepared candidate as accepted fails", () => {
  assert.match(mutate(({ queue }) => { queue.accepted["RSH-036"] = { state: "in_review" }; }), /active unit counted as accepted/);
});
test("negative and fractional counts fail", () => {
  for (const value of [-1, 0.5, NaN, Infinity]) assert.match(mutate(({ queue }) => { queue.counts.deferred = value; }), /invalid count/);
});
test("state and queue cannot silently disagree", () => {
  assert.match(mutate(({ current }) => { current.program_status.accepted_units = 36; }), /state\/queue disagreement/);
});
test("duplicate or swapped queue identifiers fail", () => {
  assert.match(mutate(({ queue }) => { queue.unit_order[36] = "RSH-036"; }), /unit order changed/);
});
test("a standing grant cannot enable force pushes", () => {
  assert.match(mutate(({ queue }) => { queue.policy.force_push = true; }), /safety policy weakened/);
});
test("unverified assets cannot be called legally cleared", () => {
  assert.match(mutate(({ current }) => { current.product_snapshot.legal_clearance_complete = true; }), /unverified assets/);
});
test("green release gates require evidence", () => {
  assert.match(mutate(({ current }) => { current.program_status.release_gates_green = 13; }), /release gates lack evidence/);
});
for (let number = 37; number <= 67; number++) {
  const id = `RSH-${String(number).padStart(3, "0")}`;
  test(`${id} cannot be precreated while RSH-036 is active`, () => {
    assert.deepEqual(unactivatedFiles([`${id}-PREFLIGHT.json`], 36), [`${id}-PREFLIGHT.json`]);
  });
}
test("runtime activation checks cover performance and quality directories", () => {
  assert.equal(unactivatedFiles(["src/game/perf-instrument/metrics.ts", "src/game/quality-profiles/index.ts"], 36).length, 2);
  assert.deepEqual(unactivatedFiles(["src/game/ayalon-freeze/freeze.ts"], 36), []);
  assert.equal(unactivatedFiles(["src/game/quality-profiles/index.ts"], 37).length, 1);
});
test("noncanonical repository paths fail closed", () => {
  assert.equal(unactivatedFiles(["../RSH-037-PREFLIGHT.json", "/tmp/escape"], 36).length, 2);
});

function plannedInputs() {
  const input = inputs();
  input.plan = readJson("MASTER-PLAN-r6.json");
  input.originalUnits = [...readFileSync(fromRoot("docs/history/master-plan-before-r6.1.md"), "utf8").matchAll(/^\| (RSH-\d{3}) \| (.*?) \|$/gm)].map(([, id, title]) => ({ id, title }));
  input.trackIds = readJson("TRACK-CATALOGUE-CLASSIFICATION.json").mvp_mapping.map(({ id }) => id);
  return input;
}
test("r6.1 retains every original unit identity and all eight V1 track IDs", () => {
  assert.deepEqual(validateProgramExecution(plannedInputs()), []);
});
test("renaming a future unit is not accepted as a plan improvement", () => {
  const input = plannedInputs(); input.plan.units[48].title = "Wrong track geometry";
  assert.match(validateProgramExecution(input).join("\n"), /renumbered or renamed/);
});
test("deferred Eilat cannot silently replace a frozen V1 track", () => {
  const input = plannedInputs(); input.plan.v1_track_ids[7] = "eilat";
  assert.match(validateProgramExecution(input).join("\n"), /V1 track mapping/);
});
test("audit items cannot invent nonexistent program IDs", () => {
  const input = plannedInputs(); input.plan.audit_items[0].units.push("RSH-068");
  assert.match(validateProgramExecution(input).join("\n"), /unknown unit/);
});
test("all 42 original legacy findings retain their exact identity and status", () => {
  const plan = readJson("MASTER-PLAN-r6.json");
  const rows = readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8").split("\n").filter((line) => /^\| P[012]-\d\d \|/.test(line)).map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim().replaceAll("*", "")));
  assert.equal(rows.length, 42);
  assert.deepEqual(plan.legacy_findings.map(({ id, severity, status, finding }) => [id, severity, status, finding]), rows.map((row) => row.slice(0, 4)));
  const ids = new Set(rows.map(([id]) => id));
  assert.ok(plan.audit_items.every((item) => item.legacy_findings.every((id) => ids.has(id))));
});

test("empty or duplicate evidence cannot make release gates green", () => {
  for (const evidence of [[], [{ state: "green", id: "G1" }]]) {
    assert.match(mutate(({ current }) => { current.program_status.release_gates_green = 1; current.release_gate_evidence = evidence; }), /release gates lack evidence/);
  }
  const proof = { state: "green", id: "G1", verified_head: "a".repeat(40), sources: ["verified-run.json"] };
  assert.match(mutate(({ current }) => { current.program_status.release_gates_green = 2; current.release_gate_evidence = [proof, proof]; }), /release gates lack evidence/);
});
