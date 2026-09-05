#!/usr/bin/env node
import { historicalRsh036Inputs } from "./rsh036-runtime-evolution.mjs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "83b06b322fbd9c4d317613234e298ed3ad963469bef0fe04d45298793b1f028b";
export const EXPECTED_RECORDS_SHA256 = "1394102cc0c744a3000a0ad191bca61efc79880b874a7ded3794b51bf0d3a502";
export const EXPECTED_SAVE_FACADE_SHA256 = "3b454e60fe1cc635a0b3051dc9a75191f7098df0b6989b1bea9ca845784b7df2";
export const EXPECTED_RECORDS_TEST_SHA256 = "78152e01ab5e44436b87e41311aeaaabc602983106bf123192a3b441d8d2e8b5";
export const EXPECTED_CHECKER_TEST_SHA256 = "c873b4b9e32f4532d9fa202c95a80bb0253ca21bff3549e64aad790d6593049c";
export const EXPECTED_SCHEMA_SHA256 = "59fad6a40fcfb372222e211394e02c1fe1d7993fc0695a58e8a3289e832a7358";
export const EXPECTED_RECOVERY_SHA256 = "0833fee5f8c0e324290ac8daffc6becee692ee435e9a92df7915701408dfc18f";
export const EXPECTED_UI_SHA256 = "21ff2aab6db8581da4a6b53f6b5938b0006a7cd00da5b14816cf5309a4529a26";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_TIMED_BLOCK_SHA256 = "b1fc74ba1ea85e830f8afaf058d3fca710508147c7bc537211a9b2039a8b88b9";
export const EXPECTED_GHOST_BLOCK_SHA256 = "59948dace66f2683d4f7cfc480f270579727dd94be257f5ea6637bd18e217674";

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

export function readTimedRecordsInputs() {
  return {
    manifestSource: readFileSync(fromRoot("TIMED-RECORDS-MANIFEST.json"), "utf8"),
    recordsSource: readFileSync(fromRoot("src", "game", "records.ts"), "utf8"),
    saveFacadeSource: readFileSync(fromRoot("src", "game", "save.ts"), "utf8"),
    recordsTestSource: readFileSync(fromRoot("scripts", "records.test.mjs"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-timed-records.test.mjs"), "utf8"),
    schemaSource: readFileSync(fromRoot("src", "game", "save-schema.ts"), "utf8"),
    recoverySource: readFileSync(fromRoot("src", "game", "save-recovery.ts"), "utf8"),
    uiSource: readFileSync(fromRoot("src", "game", "save-recovery-ui.ts"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    trackSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateTimedRecords(overrides = {}) {
  const input = historicalRsh036Inputs({ ...readTimedRecordsInputs(), ...overrides });
  const errors = [];
  let manifest, asset, tracks;
  try {
    manifest = JSON.parse(input.manifestSource);
    asset = JSON.parse(input.assetSource);
    tracks = JSON.parse(input.trackSource);
  } catch (error) {
    return { errors: [`RSH-023 authority JSON invalid: ${error.message}`] };
  }

  const identities = {
    records_source_sha256: [input.recordsSource, EXPECTED_RECORDS_SHA256],
    save_facade_sha256: [input.saveFacadeSource, EXPECTED_SAVE_FACADE_SHA256],
    records_test_sha256: [input.recordsTestSource, EXPECTED_RECORDS_TEST_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    schema_source_sha256: [input.schemaSource, EXPECTED_SCHEMA_SHA256],
    recovery_source_sha256: [input.recoverySource, EXPECTED_RECOVERY_SHA256],
    ui_source_sha256: [input.uiSource, EXPECTED_UI_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("timed-records manifest differs from the reviewed RSH-023 authority");
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-023" || manifest.schema_authority?.version !== 3) errors.push("RSH-023 unit or save-schema version changed");
  if (JSON.stringify(manifest.schema_authority?.migration_edges) !== JSON.stringify(["0→1", "1→2", "2→3"]) || manifest.schema_authority?.changed !== false) errors.push("accepted RSH-021 migration authority changed");
  if (manifest.storage?.current_key !== "rush.records.v3" || manifest.storage?.remove_item_used !== false || manifest.storage?.clear_used !== false) errors.push("timed-record storage key or destructive behavior changed");
  if (manifest.integrity?.hash_algorithm !== "sha-256" || manifest.integrity?.hash_verified_on_read !== true || manifest.integrity?.synchronous_hash !== true) errors.push("timed-record hash-verification contract changed");
  if (manifest.limits?.total !== 200 || manifest.limits?.per_track_car_physics !== 24) errors.push("timed-record storage limits changed");
  if (manifest.write_policy?.serialised !== true || manifest.write_policy?.canonical_replace !== true || manifest.write_policy?.verify_after_write !== true || manifest.write_policy?.duplicate_is_noop !== true) errors.push("timed-record write-ordering policy changed");

  for (const token of [
    "export function sha256hexSync",
    "export function hashTimedRecord",
    "export function recordHashMatches",
    "export function sanitizeTimedRecords",
    "export function loadTimedRecords",
    "export function persistTimedRecord",
    "export function canonicalTimedRecordsString",
    "let persistChain: Promise<unknown> = Promise.resolve()",
    "export const RECORD_LIMIT = 200",
    "export const RECORD_LIMIT_PER_TRACK_CAR = 24",
    'export const REC_KEY = "rush.records.v3"',
    "if (storage.getItem(key) !== raw) throw new Error(\"records mismatch\")",
  ]) if (!input.recordsSource.includes(token)) errors.push(`records source lost required token: ${token}`);

  for (const token of [
    "persistTimedRecord(rec, localStorage, PHYSICS_VERSION)",
    "loadTimedRecords(localStorage, PHYSICS_VERSION)",
    "hashTimedRecord({ t: time, trackId: id, carId, physicsVersion: PHYSICS_VERSION })",
  ]) if (!input.saveFacadeSource.includes(token)) errors.push(`save facade lost RSH-023 timed-record token: ${token}`);

  if (/\.removeItem\s*\(|localStorage\.clear\s*\(/.test(input.recordsSource + input.saveFacadeSource)) errors.push("RSH-023 timed records may not delete or clear storage");
  if (/^\s*\/\/\s*@ts-nocheck/m.test(input.recordsSource + input.saveFacadeSource)) errors.push("RSH-023 sources may not use @ts-nocheck");

  const timed = sourceBlock(input.saveFacadeSource, "async function persistTimed", "export function getMuted");
  const ghost = sourceBlock(input.saveFacadeSource, "type GhostBlob", "export function isDailyDone");
  if (timed === null || sha256(timed) !== EXPECTED_TIMED_BLOCK_SHA256 || manifest.identities?.timed_record_block_sha256 !== EXPECTED_TIMED_BLOCK_SHA256) errors.push("timed-record block identity changed");
  if (ghost === null || sha256(ghost) !== EXPECTED_GHOST_BLOCK_SHA256 || manifest.identities?.ghost_block_sha256 !== EXPECTED_GHOST_BLOCK_SHA256) errors.push("ghost block changed outside RSH-023 authority");

  if (manifest.preservation?.ghost_schema_changes !== 0 || manifest.preservation?.track_data_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.rendering_changes !== 0 || manifest.preservation?.asset_changes !== 0 || manifest.preservation?.dependency_changes !== 0 || manifest.preservation?.schema_version_changes !== 0) errors.push("RSH-023 preservation counts changed");
  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0 || asset.truth_boundaries?.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");
  if (tracks.modules?.length !== 56 || tracks.counts?.mvp !== 8 || tracks.counts?.deferred !== 48) errors.push("track boundary changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-037 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-037" || manifest.deferred_boundary?.rsh_027_authorized !== true || manifest.deferred_boundary?.rsh_027_started !== true || manifest.deferred_boundary?.rsh_028_authorized !== true || manifest.deferred_boundary?.rsh_028_started !== true || manifest.deferred_boundary?.rsh_029_authorized !== true || manifest.deferred_boundary?.rsh_029_started !== true || manifest.deferred_boundary?.rsh_030_authorized !== true || manifest.deferred_boundary?.rsh_030_started !== true || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== true || manifest.deferred_boundary?.rsh_036_authorized !== true || manifest.deferred_boundary?.rsh_037_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== true || manifest.deferred_boundary?.rsh_036_started !== true || manifest.deferred_boundary?.rsh_037_started !== false) errors.push("RSH-037 deferred boundary changed");

  return {
    errors,
    schemaVersion: manifest.schema_authority?.version,
    recordLimit: manifest.limits?.total,
    perTrackCarLimit: manifest.limits?.per_track_car_physics,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateTimedRecords();
  if (result.errors.length) {
    console.error(`timed-records fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`timed-records ok: schema v${result.schemaVersion}; limit ${result.recordLimit}; per-car ${result.perTrackCarLimit}; RSH-029 overlay accepted; RSH-031 deferred`);
}
