#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "477a894fea47c3b69fd3da261379b2a0a87b0e8f9a6621bcf62e5fd0d2a66d09";
export const EXPECTED_SCHEMA_SHA256 = "59fad6a40fcfb372222e211394e02c1fe1d7993fc0695a58e8a3289e832a7358";
export const EXPECTED_RSH021_SAVE_FACADE_SHA256 = "700d264ef071be635d76d8b02da5eda3b7c966bdf3a4756ac1bdeb7e83f56b24";
export const EXPECTED_RSH021_TEST_SHA256 = "8ac32e38ac4b11cf63319faec0a49e95498a041a3703d06d85c3f4a8b0eb84a3";
export const EXPECTED_RSH022_SAVE_FACADE_SHA256 = "8e36a852cb116212f84d9953adb0d184b061bf108d54bd5362873216836b4c91";
export const EXPECTED_RSH022_RECOVERY_SHA256 = "dc55d7ae3411cf748500b35010fca82280fcdb872513e1b7a625efbee2edd25b";
export const EXPECTED_RSH022_UI_SHA256 = "82fd7900ea252f3793ba6a54859083223a36cd052cea0745145cbc4a2f0875d5";
export const EXPECTED_RSH022_SCHEMA_GUARD_TEST_SHA256 = "2df753b00041a1a03061af10243bdb81c3efd10b04af7a8a8d5bfb6bb928cbb8";
export const EXPECTED_RECORDS_SHA256 = "5bfea6496befb107f0ae6f60810692b3612c98f15dc39274596903bcaed1aad6";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function walk(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory).sort()) {
    if ([".git", "node_modules", "coverage", ".vercel", ".output", ".nitro", "dist"].includes(name)) continue;
    const absolute = directory + "/" + name;
    const path = prefix ? prefix + "/" + name : name;
    if (statSync(absolute).isDirectory()) out.push(...walk(absolute, path)); else out.push(path);
  }
  return out;
}
function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" }).split("\0").filter(Boolean).sort();
  } catch {
    return walk(fromRoot());
  }
}
export function readSaveSchemaInputs() {
  return {
    manifestSource: readFileSync(fromRoot("SAVE-SCHEMA-MANIFEST.json"), "utf8"),
    schemaSource: readFileSync(fromRoot("src", "game", "save-schema.ts"), "utf8"),
    saveFacadeSource: readFileSync(fromRoot("src", "game", "save.ts"), "utf8"),
    recoverySource: readFileSync(fromRoot("src", "game", "save-recovery.ts"), "utf8"),
    recoveryUiSource: readFileSync(fromRoot("src", "game", "save-recovery-ui.ts"), "utf8"),
    testSource: readFileSync(fromRoot("scripts", "check-save-schema.test.mjs"), "utf8"),
    recordsSource: readFileSync(fromRoot("src", "game", "records.ts"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    trackSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}
export function validateSaveSchema(overrides = {}) {
  const input = { ...readSaveSchemaInputs(), ...overrides };
  const errors = [];
  let manifest, asset, tracks;
  try { manifest = JSON.parse(input.manifestSource); asset = JSON.parse(input.assetSource); tracks = JSON.parse(input.trackSource); }
  catch (error) { return { errors: ["save-schema authority JSON invalid: " + error.message] }; }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("save-schema manifest differs from the accepted RSH-021 authority plus RSH-022 overlay");
  if (sha256(input.schemaSource) !== EXPECTED_SCHEMA_SHA256 || manifest.identities.schema_source_sha256 !== EXPECTED_SCHEMA_SHA256) errors.push("RSH-021 save-schema source identity changed");
  if (manifest.identities.save_facade_source_sha256 !== EXPECTED_RSH021_SAVE_FACADE_SHA256) errors.push("RSH-021 historical save-facade identity changed");
  if (manifest.identities.test_source_sha256 !== EXPECTED_RSH021_TEST_SHA256) errors.push("RSH-021 historical save-schema test identity changed");
  if (sha256(input.saveFacadeSource) !== EXPECTED_RSH022_SAVE_FACADE_SHA256 || manifest.rsh_022_overlay.save_facade_sha256 !== EXPECTED_RSH022_SAVE_FACADE_SHA256) errors.push("RSH-022 save-facade overlay identity changed");
  if (sha256(input.recoverySource) !== EXPECTED_RSH022_RECOVERY_SHA256 || manifest.rsh_022_overlay.recovery_source_sha256 !== EXPECTED_RSH022_RECOVERY_SHA256) errors.push("RSH-022 recovery source identity changed");
  if (sha256(input.recoveryUiSource) !== EXPECTED_RSH022_UI_SHA256 || manifest.rsh_022_overlay.ui_source_sha256 !== EXPECTED_RSH022_UI_SHA256) errors.push("RSH-022 recovery UI identity changed");
  if (sha256(input.testSource) !== EXPECTED_RSH022_SCHEMA_GUARD_TEST_SHA256 || manifest.rsh_022_overlay.schema_guard_test_sha256 !== EXPECTED_RSH022_SCHEMA_GUARD_TEST_SHA256) errors.push("RSH-022 schema-guard test identity changed");
  if (sha256(input.recordsSource) !== EXPECTED_RECORDS_SHA256 || manifest.identities.records_source_sha256 !== EXPECTED_RECORDS_SHA256) errors.push("RSH-023 records source changed early");
  if (sha256(input.packageSource) !== EXPECTED_PACKAGE_SHA256 || manifest.identities.package_source_sha256 !== EXPECTED_PACKAGE_SHA256) errors.push("dependency/package boundary changed");

  if (manifest.unit !== "RSH-021" || manifest.current_schema.version !== 3 || manifest.migration_graph.length !== 3) errors.push("save-schema identity/count changed");
  if (manifest.failure_policy.read_failure !== "reject_without_overwrite_with_structured_status") errors.push("storage read failure policy changed");
  const graph = manifest.migration_graph.map(({ id, from, to }) => ({ id, from, to }));
  if (JSON.stringify(graph) !== JSON.stringify([
    { id: "v0-to-v1", from: 0, to: 1 },
    { id: "v1-to-v2", from: 1, to: 2 },
    { id: "v2-to-v3", from: 2, to: 3 },
  ])) errors.push("deterministic migration graph changed");
  for (const token of [
    "export const SAVE_SCHEMA_VERSION = 3 as const",
    "export const SAVE_MIGRATIONS",
    "export function migrateSave",
    "export function canonicalSaveString",
    "export function loadSaveFromStorage",
    "function migrate0To1",
    "function migrate1To2",
    "function migrate2To3",
  ]) if (!input.schemaSource.includes(token)) errors.push("save-schema source lost required contract token: " + token);

  for (const token of [
    "export function getSaveStatus",
    "function rejectedStorageStatus(error: unknown)",
    'errorCode: "read-failed"',
    "const result = loadSaveWithRecovery(storage);",
    'if (lastSaveStatus.state === "rejected" || lastSaveStatus.state === "recovery-available")',
    "retryPendingSaveWithBackup(storage, data)",
    "export function restoreSaveBackup()",
    "export function startFreshSaveAfterFailure()",
    "export function retrySavePersistence()",
    "let pendingSaveData: SaveData | null = null",
    "pendingSaveData = cloneSaveData(result.data)",
    'if (result.status.state === "write-failed" && result.status.recoveryAction === "retry")',
    "write(cloneSaveData(pending), true)",
  ]) if (!input.saveFacadeSource.includes(token)) errors.push("save facade lost RSH-022 recovery contract token: " + token);

  if (manifest.recovery.backups_created !== true || manifest.recovery.backup_restore !== true || manifest.recovery.user_visible_failure_ui !== true || manifest.recovery.state !== "accepted_on_merge") errors.push("RSH-022 recovery state is not accepted-on-merge");
  if (manifest.rsh_022_overlay.backup_generations !== 1 || manifest.rsh_022_overlay.rejected_current_quarantine_slots !== 2 || manifest.rsh_022_overlay.automatic_restore !== false || manifest.rsh_022_overlay.explicit_restore !== true || manifest.rsh_022_overlay.pending_write_retained_in_memory !== true || manifest.rsh_022_overlay.pending_write_retry_before_reload !== true || manifest.rsh_022_overlay.failed_current_write_action !== "retry" || manifest.rsh_022_overlay.pending_retry_requires_explicit_context !== true || manifest.rsh_022_overlay.pending_retry_completes_seeded_first_save !== true || manifest.rsh_022_overlay.canonicalization_write_failure_action !== "retry" || manifest.rsh_022_overlay.canonicalization_pending_data_retained !== true) errors.push("RSH-022 recovery/pending-write boundary changed");
  if (manifest.deferred_boundary.queue_head !== "RSH-023" || manifest.deferred_boundary.rsh_022_started !== true || manifest.deferred_boundary.rsh_022_authorized !== true || manifest.deferred_boundary.rsh_022_state !== "accepted_on_merge" || manifest.deferred_boundary.rsh_023_started !== false || manifest.deferred_boundary.rsh_023_authorized !== false) errors.push("RSH-023 deferred boundary changed");

  const storageSources = input.schemaSource + input.saveFacadeSource + input.recoverySource;
  if (/^\s*\/\/\s*@ts-nocheck/m.test(storageSources + input.recoveryUiSource)) errors.push("save and recovery sources must not use @ts-nocheck");
  if (/\.removeItem\s*\(|\.clear\s*\(/.test(storageSources)) errors.push("save/recovery implementation may not destroy source bytes through removeItem or clear");
  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0 || asset.truth_boundaries?.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");
  if (tracks.modules?.length !== 56 || tracks.counts?.mvp !== 8 || tracks.counts?.deferred !== 48) errors.push("track boundary changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary.forbidden_prefixes.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push("RSH-023 was precreated: " + later.join(", "));
  const temp = input.repositoryFiles.filter((path) => path.startsWith(".rsh021") || path.startsWith(".rsh022") || path.startsWith(".github/workflows/rsh-021-") || path.startsWith(".github/workflows/rsh-022-") || path.startsWith("scripts/rsh021-") || path.startsWith("scripts/rsh022-"));
  if (temp.length) errors.push("temporary RSH-021/RSH-022 transport remains: " + temp.join(", "));

  return {
    errors,
    currentVersion: manifest.current_schema.version,
    migrationCount: manifest.migration_graph.length,
    issuePolicy: manifest.normalization.issue_order,
    backupGenerations: manifest.rsh_022_overlay.backup_generations,
    quarantineSlots: manifest.rsh_022_overlay.rejected_current_quarantine_slots,
  };
}
function isMainModule(url) { const entry = process.argv[1]; if (!entry) return false; try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; } }
if (isMainModule(import.meta.url)) {
  const result = validateSaveSchema();
  if (result.errors.length) { console.error("save-schema fail\n" + result.errors.map((error) => "- " + error).join("\n")); process.exit(1); }
  console.log("save-schema ok: v" + result.currentVersion + "; " + result.migrationCount + " deterministic migrations; RSH-022 recovery overlay accepted; RSH-023 deferred");
}
