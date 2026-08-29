#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";

export const REQUIRED_CONTEXT = "required-ci / validate";

export function validateDesiredRuleset(value) {
  const errors = [];
  if (!value || typeof value !== "object") return ["desired ruleset is not an object"];
  if (value.repository !== "talstilkol/rush-israel") errors.push("repository mismatch");
  if (value.target_branch !== "refs/heads/main") errors.push("target branch must be main");
  if (value.desired_enforcement !== "active") errors.push("desired enforcement must be active");
  if (!Array.isArray(value.bypass_actors) || value.bypass_actors.length !== 0) {
    errors.push("bypass actors must be empty");
  }
  const rules = value.rules ?? {};
  if (rules.deletion !== false) errors.push("branch deletion must be blocked");
  if (rules.non_fast_forward !== false) errors.push("non-fast-forward updates must be blocked");
  if (rules.pull_request?.required !== true) errors.push("pull requests must be required");
  if (rules.pull_request?.required_review_thread_resolution !== true) {
    errors.push("review-thread resolution must be required");
  }
  const methods = rules.pull_request?.allowed_merge_methods;
  if (!Array.isArray(methods) || methods.length !== 1 || methods[0] !== "merge") {
    errors.push("merge must be the only allowed program method");
  }
  const checks = rules.required_status_checks?.required_checks;
  if (!Array.isArray(checks) || checks.length !== 1 || checks[0]?.context !== REQUIRED_CONTEXT) {
    errors.push(`required status check must be exactly ${REQUIRED_CONTEXT}`);
  }
  if (rules.required_status_checks?.strict_required_status_checks_policy !== true) {
    errors.push("required checks must be strict with the current main");
  }
  if (value.administrative_intent?.allow_force_pushes !== false) {
    errors.push("force pushes must be blocked");
  }
  if (value.administrative_intent?.allow_deletions !== false) {
    errors.push("deletions must be blocked in administrative intent");
  }
  if (value.application?.state !== "owner_action_required") {
    errors.push("unapplied administrative setting must remain owner_action_required");
  }
  return errors;
}

export function validateLiveStatus(value) {
  const errors = [];
  if (!value || typeof value !== "object") return ["live settings status is not an object"];
  if (value.repository !== "talstilkol/rush-israel") errors.push("live repository mismatch");
  if (value.branch !== "main") errors.push("live branch must be main");
  if (value.application_state !== "owner_action_required") {
    errors.push("live application state must remain owner_action_required until verified");
  }
  const claims = value.claims ?? {};
  for (const key of [
    "branch_protection_applied",
    "required_check_enforced_by_repository_setting",
    "force_push_blocked_by_repository_setting",
    "deletion_blocked_by_repository_setting",
  ]) {
    if (claims[key] !== false) errors.push(`${key} must remain false without live verification`);
  }
  if (claims.diagnostic_artifacts_enforced_by_workflow !== true) {
    errors.push("diagnostic artifact workflow claim must be true");
  }
  return errors;
}

export function validateWorkflow(text) {
  const errors = [];
  const mustMatch = [
    [/name:\s*required-ci\b/, "workflow name"],
    [/name:\s*required-ci \/ validate\b/, "required job context"],
    [/node scripts\/check-governance-contract\.mjs/, "governance gate"],
    [/uses:\s*actions\/upload-artifact@v4/, "artifact upload action"],
    [/if:\s*always\(\)/, "always-run artifact condition"],
    [/retention-days:\s*14/, "14-day retention"],
    [/if-no-files-found:\s*warn/, "non-empty diagnostic policy"],
  ];
  for (const [pattern, label] of mustMatch) {
    if (!pattern.test(text)) errors.push(`workflow missing ${label}`);
  }
  if (/continue-on-error:\s*true/.test(text)) {
    errors.push("workflow may not suppress validation failures");
  }
  return errors;
}

export function runGovernanceCheck({ desired, live, workflow }) {
  return [
    ...validateDesiredRuleset(desired),
    ...validateLiveStatus(live),
    ...validateWorkflow(workflow),
  ];
}

function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

if (isMainModule(import.meta.url)) {
  const desired = JSON.parse(readFileSync(fromRoot("REPOSITORY-RULESET-DESIRED.json"), "utf8"));
  const live = JSON.parse(readFileSync(fromRoot("REPOSITORY-SETTINGS-STATUS.json"), "utf8"));
  const workflow = readFileSync(fromRoot(".github", "workflows", "required-ci.yml"), "utf8");
  const errors = runGovernanceCheck({ desired, live, workflow });
  if (errors.length) {
    console.error("governance-contract fail\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`governance-contract ok: ${REQUIRED_CONTEXT}; live protection remains owner action`);
}
