#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "06b3b59fa0db394fa3566dbb06dce1fbab424ab9e70a05a91e7ac61ed77e124b";
export const EXPECTED_RECOVERY_SHA256 = "0833fee5f8c0e324290ac8daffc6becee692ee435e9a92df7915701408dfc18f";
export const EXPECTED_UI_SHA256 = "21ff2aab6db8581da4a6b53f6b5938b0006a7cd00da5b14816cf5309a4529a26";
export const EXPECTED_SAVE_FACADE_SHA256 = "3b454e60fe1cc635a0b3051dc9a75191f7098df0b6989b1bea9ca845784b7df2";
export const EXPECTED_TEST_SHA256 = "6306077ad7368bfb8d213de7283d262db980d219cb11aa640a8c8a02e1b9f5c1";
export const EXPECTED_SCHEMA_SHA256 = "59fad6a40fcfb372222e211394e02c1fe1d7993fc0695a58e8a3289e832a7358";
export const EXPECTED_RECORDS_SHA256 = "1394102cc0c744a3000a0ad191bca61efc79880b874a7ded3794b51bf0d3a502";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_PACKAGE_LOCK_SHA256 = "55afd975f03b12867aada083c375e2fadc402b654ddaf0f0934807966fa9f1ed";
export const EXPECTED_TIMED_BLOCK_SHA256 = "b1fc74ba1ea85e830f8afaf058d3fca710508147c7bc537211a9b2039a8b88b9";
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
  if (manifest.backup_policy?.generations !== 1 || manifest.backup_policy?.seed_before_first_current_write !== true || manifest.backup_policy?.rotate_exact_previous_current_before_overwrite !== true || manifest.backup_policy?.verify_every_backup_write !== true || manifest.backup_policy?.unsafe_current_overwrite_on_backup_failure !== false || manifest.backup_policy?.prefer_valid_backup_when_current_missing !== true || manifest.backup_policy?.pending_first_save_retry_requires_matching_backup !== true) errors.push("backup rotation/fail-closed policy changed");
  if (manifest.recovery_policy?.automatic_restore !== false || manifest.recovery_policy?.explicit_restore !== true || manifest.recovery_policy?.rejected_current_quarantine_slots !== 2 || manifest.recovery_policy?.fresh_start_confirmation_steps !== 2 || manifest.recovery_policy?.fail_closed_when_quarantine_full !== true || manifest.recovery_policy?.valid_legacy_does_not_block_explicit_backup_restore !== true || manifest.recovery_policy?.pending_write_retained_in_memory !== true || manifest.recovery_policy?.pending_write_retry_before_reload !== true || manifest.recovery_policy?.failed_current_write_action !== "retry" || manifest.recovery_policy?.pending_retry_requires_explicit_context !== true || manifest.recovery_policy?.pending_retry_completes_seeded_first_save !== true || manifest.recovery_policy?.canonicalization_write_failure_action !== "retry" || manifest.recovery_policy?.canonicalization_pending_data_retained !== true || manifest.recovery_policy?.pending_retry_applies_follow_up_mutations !== true || manifest.recovery_policy?.pending_retry_overwrites_untrusted_current !== true) errors.push("explicit recovery/quarantine/pending-write policy changed");
  if (manifest.failure_ui?.event !== "rush-save-status" || manifest.failure_ui?.failure_role !== "alertdialog" || manifest.failure_ui?.failure_live_region !== "assertive" || manifest.failure_ui?.html_injection_used !== false || manifest.failure_ui?.focus_enters_dialog !== true || manifest.failure_ui?.focus_restored_on_close !== true || manifest.failure_ui?.success_to_failure_focus_capture !== true || manifest.failure_ui?.write_failure_action !== "retry") errors.push("user-visible failure contract changed");

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
    "export function retryPendingSaveWithBackup",
    "function writeSaveWithBackupMode",
    "const matchesSeededFirstSave = source === \"none\" && backup.canonical === nextRaw",
    "let currentUntrusted = false",
    "export function restoreSaveFromBackup",
    "export function startFreshSaveAfterRejection",
    "function quarantineCurrent",
    "function quarantineBackup",
    "function writeVerified",
    'if (source === "legacy" && backup.state === "valid")',
    'if (currentRead.raw === null && backup.state === "valid")',
    'return writeFailure(source, data, priorParsed, write.error, "recovery-write-failed", true);',
  ]) if (!input.recoverySource.includes(token)) errors.push(`recovery source lost required token: ${token}`);
  for (const token of [
    'export const SAVE_STATUS_EVENT = "rush-save-status"',
    'setAttribute("role", status.notice === "success" ? "status" : "alertdialog")',
    'setAttribute("aria-live", status.notice === "success" ? "polite" : "assertive")',
    "textContent",
    "Press again to confirm",
    "rememberFocus(existing)",
    'existing?.getAttribute("role") === "alertdialog"',
    "nodeContainedBy(existing, active)",
    "documentContains(focusReturnTarget)",
    "restorePreviousFocus()",
    "(primaryAction ?? notice).focus()",
  ]) if (!input.uiSource.includes(token)) errors.push(`failure UI lost required token: ${token}`);
  for (const token of [
    "loadSaveWithRecovery(storage)",
    "writeSaveWithBackup(storage, data)",
    "export function restoreSaveBackup",
    "export function startFreshSaveAfterFailure",
    'lastSaveStatus.state === "rejected" || lastSaveStatus.state === "recovery-available"',
    "let pendingSaveData: SaveData | null = null",
    "function cloneSaveData(data: SaveData): SaveData",
    "if (pendingSaveData !== null)",
    "pendingSaveData = cloneSaveData(result.data)",
    'if (result.status.state === "write-failed" && result.status.recoveryAction === "retry")',
    "retryPendingSaveWithBackup(storage, data)",
    "const pending = pendingSaveData",
    "write(cloneSaveData(pending), true)",
    "const retryFromPending = pendingRetry || pendingSaveData !== null",
  ]) if (!input.saveFacadeSource.includes(token)) errors.push(`save facade lost RSH-022 integration token: ${token}`);

  const destructive = input.recoverySource + input.saveFacadeSource + input.uiSource;
  if (/\.removeItem\s*\(|localStorage\.clear\s*\(|\.clear\s*\(\s*\)/.test(destructive)) errors.push("RSH-022 recovery may not delete or clear storage");
  if (/\binnerHTML\b/.test(input.uiSource)) errors.push("RSH-022 failure UI may not use innerHTML");
  if (/^\s*\/\/\s*@ts-nocheck/m.test(destructive)) errors.push("RSH-022 sources may not use @ts-nocheck");

  const timed = sourceBlock(input.saveFacadeSource, "async function persistTimed", "export function getMuted");
  const ghost = sourceBlock(input.saveFacadeSource, "type GhostBlob", "export function isDailyDone");
  if (timed === null || sha256(timed) !== EXPECTED_TIMED_BLOCK_SHA256 || manifest.identities?.timed_record_block_sha256 !== EXPECTED_TIMED_BLOCK_SHA256) errors.push("timed-record block identity changed");
  if (ghost === null || sha256(ghost) !== EXPECTED_GHOST_BLOCK_SHA256 || manifest.identities?.ghost_block_sha256 !== EXPECTED_GHOST_BLOCK_SHA256) errors.push("ghost block changed in RSH-023");

  if (manifest.preservation?.timed_record_changes !== 1 || manifest.preservation?.ghost_schema_changes !== 0 || manifest.preservation?.track_data_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.rendering_changes !== 0 || manifest.preservation?.asset_changes !== 0 || manifest.preservation?.dependency_changes !== 0) errors.push("RSH-023 preservation counts changed");
  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0 || asset.truth_boundaries?.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");
  if (tracks.modules?.length !== 56 || tracks.counts?.mvp !== 8 || tracks.counts?.deferred !== 48) errors.push("track boundary changed");

  const recoveryFiles = input.repositoryFiles.filter((path) => /^src\/game\/save-recovery(?:-ui)?\.ts$/.test(path));
  if (JSON.stringify(recoveryFiles) !== JSON.stringify(["src/game/save-recovery-ui.ts", "src/game/save-recovery.ts"])) errors.push(`RSH-022 recovery source set changed: ${recoveryFiles.join(", ")}`);
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-024 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-024" || manifest.deferred_boundary?.rsh_023_authorized !== true || manifest.deferred_boundary?.rsh_023_started !== true || manifest.deferred_boundary?.rsh_024_started !== false) errors.push("RSH-024 deferred boundary changed");

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
  console.log(`save-recovery ok: schema v${result.schemaVersion}; ${result.backupKeys} bounded keys; ${result.quarantineSlots} rejected-save slots; RSH-023 accepted; RSH-024 deferred`);
}
