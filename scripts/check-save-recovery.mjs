#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "3ca31bac992720c8b32a381e7f1a4b215f962c9431f958fbbd344ed075e002e2";
export const EXPECTED_RECOVERY_SHA256 = "e86c5ebacf6208602d7f4ddcaee1ca8f378df533936a365a3dc2bb2d706c9028";
export const EXPECTED_UI_SHA256 = "ba6f397ec90d4b71ce0b93fa188932c977d3be8ad6c31ddb2fd008ad8072145c";
export const EXPECTED_SAVE_FACADE_SHA256 = "0a90fcca530c76ed9581a9fbb984b29f7c2fd751d76c54c524b5114dbc17ac67";
export const EXPECTED_TEST_SHA256 = "1bfc04953ba1453292192178ca9bff5f5ed207b5df4adc36f313dca4f71430cb";
export const EXPECTED_SCHEMA_SHA256 = "59fad6a40fcfb372222e211394e02c1fe1d7993fc0695a58e8a3289e832a7358";
export const EXPECTED_RECORDS_SHA256 = "5bfea6496befb107f0ae6f60810692b3612c98f15dc39274596903bcaed1aad6";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_PACKAGE_LOCK_SHA256 = "55afd975f03b12867aada083c375e2fadc402b654ddaf0f0934807966fa9f1ed";
export const EXPECTED_TIMED_BLOCK_SHA256 = "cc6e8965d45653f1a1f3f4f506589b8729ec54a8c9c0b7667d9a4cf0e3d717e7";
export const EXPECTED_GHOST_BLOCK_SHA256 = "59948dace66f2683d4f7cfc480f270579727dd94be257f5ea6637bd18e217674";
export const EXPECTED_WORKFLOW_SHA256 = "678cd0da7572f6f0debc9531594fedad25b6db886c41a7bb5291767edda9d17e";
export const EXPECTED_CI_SUMMARY_SHA256 = "41e158628e2a58f6cb77d34d26c357a9c89ce51f5cadf1739a2350fb198d0feb";

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

function sourceBlock(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  if (from < 0 || to < 0 || to <= from) return null;
  return source.slice(from, to);
}

export function readSaveRecoveryInputs() {
  return {
    manifestSource: readFileSync(fromRoot("SAVE-RECOVERY-MANIFEST.json"), "utf8"),
    recoverySource: readFileSync(fromRoot("src", "game", "save-recovery.ts"), "utf8"),
    uiSource: readFileSync(fromRoot("src", "game", "save-recovery-ui.ts"), "utf8"),
    saveFacadeSource: readFileSync(fromRoot("src", "game", "save.ts"), "utf8"),
    testSource: readFileSync(fromRoot("scripts", "check-save-recovery.test.mjs"), "utf8"),
    schemaSource: readFileSync(fromRoot("src", "game", "save-schema.ts"), "utf8"),
    recordsSource: readFileSync(fromRoot("src", "game", "records.ts"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    packageLockSource: readFileSync(fromRoot("package-lock.json"), "utf8"),
    workflowSource: readFileSync(fromRoot(".github", "workflows", "required-ci.yml"), "utf8"),
    ciSummarySource: readFileSync(fromRoot("scripts", "write-ci-summary.mjs"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    trackSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateSaveRecovery(overrides = {}) {
  const input = { ...readSaveRecoveryInputs(), ...overrides };
  const errors = [];
  let manifest, asset, tracks;
  try {
    manifest = JSON.parse(input.manifestSource);
    asset = JSON.parse(input.assetSource);
    tracks = JSON.parse(input.trackSource);
  } catch (error) {
    return { errors: [`RSH-022 authority JSON invalid: ${error.message}`] };
  }

  const identities = {
    recovery_source_sha256: [input.recoverySource, EXPECTED_RECOVERY_SHA256],
    ui_source_sha256: [input.uiSource, EXPECTED_UI_SHA256],
    save_facade_sha256: [input.saveFacadeSource, EXPECTED_SAVE_FACADE_SHA256],
    test_source_sha256: [input.testSource, EXPECTED_TEST_SHA256],
    schema_source_sha256: [input.schemaSource, EXPECTED_SCHEMA_SHA256],
    records_source_sha256: [input.recordsSource, EXPECTED_RECORDS_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    package_lock_sha256: [input.packageLockSource, EXPECTED_PACKAGE_LOCK_SHA256],
  };
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("save-recovery manifest differs from the reviewed RSH-022 authority");
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(input.workflowSource) !== EXPECTED_WORKFLOW_SHA256) errors.push("required CI workflow changed outside RSH-022 authority");
  if (sha256(input.ciSummarySource) !== EXPECTED_CI_SUMMARY_SHA256) errors.push("temporary source-snapshot transport remains in CI summary writer");

  if (manifest.unit !== "RSH-022" || manifest.schema_authority?.version !== 3) errors.push("RSH-022 unit or save-schema version changed");
  if (JSON.stringify(manifest.schema_authority?.migration_edges) !== JSON.stringify(["0→1", "1→2", "2→3"]) || manifest.schema_authority?.changed !== false) errors.push("accepted RSH-021 migration authority changed");
  if (manifest.backup_policy?.generations !== 1 || manifest.backup_policy?.seed_before_first_current_write !== true || manifest.backup_policy?.rotate_exact_previous_current_before_overwrite !== true || manifest.backup_policy?.verify_every_backup_write !== true || manifest.backup_policy?.unsafe_current_overwrite_on_backup_failure !== false || manifest.backup_policy?.prefer_valid_backup_when_current_missing !== true) errors.push("backup rotation/fail-closed policy changed");
  if (manifest.recovery_policy?.automatic_restore !== false || manifest.recovery_policy?.explicit_restore !== true || manifest.recovery_policy?.rejected_current_quarantine_slots !== 2 || manifest.recovery_policy?.fresh_start_confirmation_steps !== 2 || manifest.recovery_policy?.fail_closed_when_quarantine_full !== true || manifest.recovery_policy?.valid_legacy_does_not_block_explicit_backup_restore !== true) errors.push("explicit recovery/quarantine policy changed");
  if (manifest.failure_ui?.event !== "rush-save-status" || manifest.failure_ui?.failure_role !== "alertdialog" || manifest.failure_ui?.failure_live_region !== "assertive" || manifest.failure_ui?.html_injection_used !== false || manifest.failure_ui?.focus_enters_dialog !== true || manifest.failure_ui?.focus_restored_on_close !== true) errors.push("user-visible failure contract changed");

  const expectedKeys = {
    current_key: "rush-v1",
    legacy_key: "tlv-rush-v1",
    backup_key: "rush-v1-backup",
    rejected_backup_key: "rush-v1-backup-rejected",
  };
  for (const [name, value] of Object.entries(expectedKeys)) if (manifest.storage?.[name] !== value) errors.push(`storage key changed: ${name}`);
  if (JSON.stringify(manifest.storage?.rejected_current_keys) !== JSON.stringify(["rush-v1-rejected", "rush-v1-rejected-previous"])) errors.push("rejected-current quarantine keys changed");
  if (manifest.storage?.legacy_bytes_removed_or_rewritten !== false || manifest.storage?.remove_item_used !== false || manifest.storage?.clear_used !== false) errors.push("destructive storage behavior enabled");

  for (const token of [
    'export const SAVE_BACKUP_KEY = "rush-v1-backup"',
    "export function loadSaveWithRecovery",
    "export function writeSaveWithBackup",
    "export function restoreSaveFromBackup",
    "export function startFreshSaveAfterRejection",
    "function quarantineCurrent",
    "function quarantineBackup",
    "function writeVerified",
    'if (source === "legacy" && backup.state === "valid")',
    'if (currentRead.raw === null && backup.state === "valid")',
  ]) if (!input.recoverySource.includes(token)) errors.push(`recovery source lost required token: ${token}`);
  for (const token of [
    'export const SAVE_STATUS_EVENT = "rush-save-status"',
    'setAttribute("role", status.notice === "success" ? "status" : "alertdialog")',
    'setAttribute("aria-live", status.notice === "success" ? "polite" : "assertive")',
    "textContent",
    "Press again to confirm",
    "rememberFocus(existing)",
    "restorePreviousFocus()",
    "(primaryAction ?? notice).focus()",
  ]) if (!input.uiSource.includes(token)) errors.push(`failure UI lost required token: ${token}`);
  for (const token of [
    "loadSaveWithRecovery(storage)",
    "writeSaveWithBackup(storage, data)",
    "export function restoreSaveBackup",
    "export function startFreshSaveAfterFailure",
    'lastSaveStatus.state === "rejected" || lastSaveStatus.state === "recovery-available"',
  ]) if (!input.saveFacadeSource.includes(token)) errors.push(`save facade lost RSH-022 integration token: ${token}`);

  const destructive = input.recoverySource + input.saveFacadeSource + input.uiSource;
  if (/\.removeItem\s*\(|localStorage\.clear\s*\(|\.clear\s*\(\s*\)/.test(destructive)) errors.push("RSH-022 recovery may not delete or clear storage");
  if (/\binnerHTML\b/.test(input.uiSource)) errors.push("RSH-022 failure UI may not use innerHTML");
  if (/^\s*\/\/\s*@ts-nocheck/m.test(destructive)) errors.push("RSH-022 sources may not use @ts-nocheck");

  const timed = sourceBlock(input.saveFacadeSource, "async function persistTimed", "export function getMuted");
  const ghost = sourceBlock(input.saveFacadeSource, "type GhostBlob", "export function isDailyDone");
  if (timed === null || sha256(timed) !== EXPECTED_TIMED_BLOCK_SHA256 || manifest.identities?.timed_record_block_sha256 !== EXPECTED_TIMED_BLOCK_SHA256) errors.push("timed-record block changed in RSH-022");
  if (ghost === null || sha256(ghost) !== EXPECTED_GHOST_BLOCK_SHA256 || manifest.identities?.ghost_block_sha256 !== EXPECTED_GHOST_BLOCK_SHA256) errors.push("ghost block changed in RSH-022");

  if (manifest.preservation?.timed_record_changes !== 0 || manifest.preservation?.ghost_schema_changes !== 0 || manifest.preservation?.track_data_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.rendering_changes !== 0 || manifest.preservation?.asset_changes !== 0 || manifest.preservation?.dependency_changes !== 0) errors.push("RSH-022 preservation counts changed");
  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0 || asset.truth_boundaries?.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");
  if (tracks.modules?.length !== 56 || tracks.counts?.mvp !== 8 || tracks.counts?.deferred !== 48) errors.push("track boundary changed");

  const recoveryFiles = input.repositoryFiles.filter((path) => /^src\/game\/save-recovery(?:-ui)?\.ts$/.test(path));
  if (JSON.stringify(recoveryFiles) !== JSON.stringify(["src/game/save-recovery-ui.ts", "src/game/save-recovery.ts"])) errors.push(`RSH-022 recovery source set changed: ${recoveryFiles.join(", ")}`);
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-023 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-023" || manifest.deferred_boundary?.rsh_023_authorized !== false || manifest.deferred_boundary?.rsh_023_started !== false) errors.push("RSH-023 deferred boundary changed");

  return {
    errors,
    schemaVersion: manifest.schema_authority?.version,
    backupKeys: 4,
    quarantineSlots: manifest.recovery_policy?.rejected_current_quarantine_slots,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateSaveRecovery();
  if (result.errors.length) {
    console.error(`save-recovery fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`save-recovery ok: schema v${result.schemaVersion}; ${result.backupKeys} bounded keys; ${result.quarantineSlots} rejected-save slots; RSH-023 deferred`);
}
