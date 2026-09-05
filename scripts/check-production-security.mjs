#!/usr/bin/env node
import { historicalRsh036Inputs } from "./rsh036-runtime-evolution.mjs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";
import { SCAN_ROOTS, SECRET_PATTERN_SPECS } from "./secrets-check.mjs";

export const EXPECTED_MANIFEST_SHA256 = "d86282d2720cebefcfdc48f843b75e39c30c12c5b481321367ffad3f756eb794";
export const EXPECTED_POLICY_SHA256 = "90516317124c1ad86e1a059959a498e2e2d32b9b23834feb8cfc2026a1b0bb88";
export const EXPECTED_SECRETS_CHECK_SHA256 = "9a2b1ffceaae9602c4134b47cbca9209f7d6a684d335b0ac4b9cc2914b8fc322";
export const EXPECTED_SECRETS_TEST_SHA256 = "eb436ab5108a6679d52f22684c3cc0a330729a3106d0ed1d6c044fea8fd5db73";
export const EXPECTED_CHECKER_TEST_SHA256 = "3b744e88d270528fed714f07ce926027e44be8b85c1b806d62d5eb67d05ece4f";
export const EXPECTED_QA_HOOK_SHA256 = "14db672bdc1311b3fcd14a2230a8f4240ff88cf9a279659d9559e2959b694460";
export const EXPECTED_QA_ADAPTER_SHA256 = "973b8606f5e417e9477bf4b07a2bf8fba49b500003833a9e0d76396ad903730c";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_RECORDS_SHA256 = "1394102cc0c744a3000a0ad191bca61efc79880b874a7ded3794b51bf0d3a502";
export const EXPECTED_SAVE_FACADE_SHA256 = "3b454e60fe1cc635a0b3051dc9a75191f7098df0b6989b1bea9ca845784b7df2";
export const EXPECTED_SCHEMA_SHA256 = "59fad6a40fcfb372222e211394e02c1fe1d7993fc0695a58e8a3289e832a7358";
export const EXPECTED_RECOVERY_SHA256 = "0833fee5f8c0e324290ac8daffc6becee692ee435e9a92df7915701408dfc18f";
export const EXPECTED_PACKAGE_LOCK_SHA256 = "55afd975f03b12867aada083c375e2fadc402b654ddaf0f0934807966fa9f1ed";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function walk(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "coverage", ".vercel", ".output", ".nitro", "dist"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const path = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walk(absolute, path));
    else out.push(path);
  }
  return out;
}

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" })
      .split("\0")
      .filter(Boolean)
      .sort();
  } catch {
    return walk(fromRoot());
  }
}

export function readProductionSecurityInputs() {
  return {
    manifestSource: readFileSync(fromRoot("PRODUCTION-SECURITY-MANIFEST.json"), "utf8"),
    policySource: readFileSync(fromRoot("src", "game", "security", "production-policy.ts"), "utf8"),
    secretsCheckSource: readFileSync(fromRoot("scripts", "secrets-check.mjs"), "utf8"),
    secretsTestSource: readFileSync(fromRoot("scripts", "secrets-check.test.mjs"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-production-security.test.mjs"), "utf8"),
    qaHookSource: readFileSync(fromRoot("scripts", "check-qa-hook.mjs"), "utf8"),
    qaAdapterSource: readFileSync(fromRoot("src", "game", "engine", "qa-adapter.ts"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    recordsSource: readFileSync(fromRoot("src", "game", "records.ts"), "utf8"),
    saveFacadeSource: readFileSync(fromRoot("src", "game", "save.ts"), "utf8"),
    schemaSource: readFileSync(fromRoot("src", "game", "save-schema.ts"), "utf8"),
    recoverySource: readFileSync(fromRoot("src", "game", "save-recovery.ts"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    trackSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateProductionSecurity(overrides = {}) {
  const input = historicalRsh036Inputs({ ...readProductionSecurityInputs(), ...overrides });
  const errors = [];
  let manifest, asset, tracks, pkg;
  try {
    manifest = JSON.parse(input.manifestSource);
    asset = JSON.parse(input.assetSource);
    tracks = JSON.parse(input.trackSource);
    pkg = JSON.parse(input.packageSource);
  } catch (error) {
    return { errors: [`RSH-024 authority JSON invalid: ${error.message}`] };
  }

  const identities = {
    policy_source_sha256: [input.policySource, EXPECTED_POLICY_SHA256],
    secrets_check_sha256: [input.secretsCheckSource, EXPECTED_SECRETS_CHECK_SHA256],
    secrets_test_sha256: [input.secretsTestSource, EXPECTED_SECRETS_TEST_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    qa_hook_sha256: [input.qaHookSource, EXPECTED_QA_HOOK_SHA256],
    qa_adapter_sha256: [input.qaAdapterSource, EXPECTED_QA_ADAPTER_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    records_source_sha256: [input.recordsSource, EXPECTED_RECORDS_SHA256],
    save_facade_sha256: [input.saveFacadeSource, EXPECTED_SAVE_FACADE_SHA256],
    schema_source_sha256: [input.schemaSource, EXPECTED_SCHEMA_SHA256],
    recovery_source_sha256: [input.recoverySource, EXPECTED_RECOVERY_SHA256],
  };
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("production-security manifest differs from the reviewed RSH-024 authority");
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-024" || manifest.build_policy?.command !== "vite build") errors.push("RSH-024 unit or build command changed");
  if (manifest.build_policy?.db_migrate_script !== false || manifest.build_policy?.auth_check_script !== false) errors.push("build/migration separation changed");
  if (JSON.stringify(manifest.secret_scan?.roots) !== JSON.stringify(["src", "scripts", "server", ".github"])) errors.push("secret-scan roots changed");
  if (manifest.secret_scan?.pattern_count !== 8 || manifest.secret_scan?.src_game_only !== false) errors.push("secret-scan expansion changed");
  if (JSON.stringify(manifest.production_qa?.needles) !== JSON.stringify(["finishNow", "__controlsTest"])) errors.push("production QA needles changed");
  if (manifest.production_qa?.github_required_check !== false) errors.push("RSH-024 must not claim GitHub required-check enforcement");
  if (manifest.schema_authority?.version !== 3 || manifest.schema_authority?.changed !== false) errors.push("accepted save-schema authority changed");

  if (pkg.scripts?.build !== "vite build") errors.push("production build is not exactly vite build");
  if (pkg.scripts?.["db:migrate"] || pkg.scripts?.["check:auth"] || /with-app-env|migrate\.mjs/.test(JSON.stringify(pkg.scripts ?? {}))) errors.push("removed migration/auth scripts returned");
  if (!pkg.scripts?.["qa:ci:raw"]?.includes("npm run check:qa") || !pkg.scripts?.["qa:ci:raw"]?.includes("npm run check:secrets")) errors.push("QA/secrets checks are not in the required QA gate");
  if (JSON.stringify(SCAN_ROOTS) !== JSON.stringify(["src", "scripts", "server", ".github"])) errors.push("live secret-scan roots drifted");
  if (SECRET_PATTERN_SPECS.length !== 8) errors.push("live secret-scan pattern count drifted");

  for (const token of [
    "export const BUILD_COMMAND = \"vite build\" as const",
    "export const PRODUCTION_QA_NEEDLES = [\"finishNow\", \"__controlsTest\"] as const",
    "export const SECRET_SCAN_ROOTS = [\"src\", \"scripts\", \"server\", \".github\"] as const",
    "export const QA_ADAPTER_PRODUCTION_GUARD",
  ]) if (!input.policySource.includes(token)) errors.push(`production policy lost required token: ${token}`);

  for (const token of [
    "export const SECRET_PATTERN_SPECS",
    "export async function scanTrackedSecrets",
    "src",
    "scripts",
    "server",
    ".github",
    "openai-sk",
    "github-token",
    "pem-private-key",
  ]) if (!input.secretsCheckSource.includes(token)) errors.push(`secrets-check lost required token: ${token}`);

  for (const token of [
    'const needles = ["finishNow", "__controlsTest"]',
    'execSync("npm run build"',
  ]) if (!input.qaHookSource.includes(token)) errors.push(`QA-hook checker lost required token: ${token}`);

  for (const token of [
    'if (import.meta.env.PROD && import.meta.env.VITE_QA !== "1") return;',
    "export function qaHookAllowed",
    "finishNow:",
    "window.__controlsTest =",
  ]) if (!input.qaAdapterSource.includes(token)) errors.push(`QA adapter lost required production-guard token: ${token}`);

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0 || asset.truth_boundaries?.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");
  if (tracks.modules?.length !== 56 || tracks.counts?.mvp !== 8 || tracks.counts?.deferred !== 48) errors.push("track boundary changed");
  if (manifest.preservation?.schema_version_changes !== 0 || manifest.preservation?.timed_record_changes !== 0 || manifest.preservation?.recovery_code_changes !== 0 || manifest.preservation?.track_data_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.rendering_changes !== 0 || manifest.preservation?.asset_changes !== 0 || manifest.preservation?.dependency_changes !== 0) errors.push("RSH-024 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-037 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-037" || manifest.deferred_boundary?.rsh_027_authorized !== true || manifest.deferred_boundary?.rsh_027_started !== true || manifest.deferred_boundary?.rsh_028_authorized !== true || manifest.deferred_boundary?.rsh_028_started !== true || manifest.deferred_boundary?.rsh_029_authorized !== true || manifest.deferred_boundary?.rsh_029_started !== true || manifest.deferred_boundary?.rsh_030_authorized !== true || manifest.deferred_boundary?.rsh_030_started !== true || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== true || manifest.deferred_boundary?.rsh_036_authorized !== true || manifest.deferred_boundary?.rsh_037_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== true || manifest.deferred_boundary?.rsh_036_started !== true || manifest.deferred_boundary?.rsh_037_started !== false) errors.push("RSH-037 deferred boundary changed");

  return {
    errors,
    patternCount: SECRET_PATTERN_SPECS.length,
    buildCommand: pkg.scripts?.build,
    schemaVersion: manifest.schema_authority?.version,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateProductionSecurity();
  if (result.errors.length) {
    console.error(`production-security fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`production-security ok: build ${result.buildCommand}; ${result.patternCount} secret patterns; schema v${result.schemaVersion}; RSH-029 overlay accepted; RSH-031 deferred`);
}
