import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import {
  REQUIRED_CONTEXT,
  runGovernanceCheck,
  validateDesiredRuleset,
  validateLiveStatus,
  validateWorkflow,
} from "./check-governance-contract.mjs";

const readJson = (name) => JSON.parse(readFileSync(fromRoot(name), "utf8"));
const workflow = () => readFileSync(fromRoot(".github", "workflows", "required-ci.yml"), "utf8");

test("committed governance contract is internally valid", () => {
  assert.deepEqual(
    runGovernanceCheck({
      desired: readJson("REPOSITORY-RULESET-DESIRED.json"),
      live: readJson("REPOSITORY-SETTINGS-STATUS.json"),
      workflow: workflow(),
    }),
    [],
  );
});

test("desired ruleset requires the stable CI context and blocks destructive updates", () => {
  const desired = readJson("REPOSITORY-RULESET-DESIRED.json");
  assert.equal(desired.rules.required_status_checks.required_checks[0].context, REQUIRED_CONTEXT);
  assert.equal(desired.rules.deletion, false);
  assert.equal(desired.rules.non_fast_forward, false);
  assert.equal(desired.rules.pull_request.required, true);
  assert.equal(desired.administrative_intent.allow_force_pushes, false);
  assert.deepEqual(validateDesiredRuleset(desired), []);
});

test("live claims fail closed while the administrative setting is unapplied", () => {
  const live = readJson("REPOSITORY-SETTINGS-STATUS.json");
  assert.equal(live.application_state, "owner_action_required");
  assert.equal(live.claims.branch_protection_applied, false);
  assert.equal(live.claims.required_check_enforced_by_repository_setting, false);
  assert.deepEqual(validateLiveStatus(live), []);

  const falseClaim = structuredClone(live);
  falseClaim.claims.branch_protection_applied = true;
  assert.match(validateLiveStatus(falseClaim).join("\n"), /branch_protection_applied/);
});

test("workflow keeps diagnostics on success and failure", () => {
  const text = workflow();
  assert.deepEqual(validateWorkflow(text), []);
  assert.match(text, /uses:\s*actions\/upload-artifact@v4/);
  assert.match(text, /if:\s*always\(\)/);
  assert.match(text, /retention-days:\s*14/);
});

test("governance validator rejects a missing required check", () => {
  const desired = readJson("REPOSITORY-RULESET-DESIRED.json");
  const broken = structuredClone(desired);
  broken.rules.required_status_checks.required_checks = [];
  assert.match(validateDesiredRuleset(broken).join("\n"), /required status check/);
});

test("workflow validator rejects failure suppression", () => {
  assert.match(
    validateWorkflow(workflow() + "\ncontinue-on-error: true\n").join("\n"),
    /suppress validation failures/,
  );
});
