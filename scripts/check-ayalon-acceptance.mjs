#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "01c1403a4b3fb7ff2f42c0d99b4f0a03ef6e6b74f23be22b5b08e6bce0d396b6";
export const EXPECTED_TRACK_SHA256 = "8b8f149f8ae2eb43c4593e4916244f14012397cb0cf5b2b42481e1406317404d";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_HASHALOM_INDEX_SHA256 = "5f63d02f48f85d47916917c5dd6eb29c1c6b559bce6359e1e4f985cad339dc10";
export const EXPECTED_PIXEL_GOLDEN_SHA256 = "a8d05fcda8af97d67689f866a03dda052afb5b09c1181797875ccf7ce67fc621";
export const EXPECTED_AYALON_HASH_SHA256 = "961470f70d518c6db9a2cbc81c4c2d08217f64e70fc24a34921692ee5d9425ca";
export const EXPECTED_CHECKER_TEST_SHA256 = "31ed00b385449306aa4bc9c9ae6a0db10ac8d8305128290374716f38ab498357";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const DUPLICATE_PLACEHOLDER_HASH = "38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sha256File(path) {
  return sha256(readFileSync(path));
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

export function readAyalonAcceptanceInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AYALON-ACCEPTANCE-MANIFEST.json"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    hashalomIndexSource: readFileSync(fromRoot("golden-baseline", "hashalom-photo.json"), "utf8"),
    pixelGoldenSource: readFileSync(fromRoot("scripts", "pixel-golden.mjs"), "utf8"),
    ayalonHashSource: readFileSync(fromRoot("scripts", "ayalon-hash.mjs"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-ayalon-acceptance.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAyalonAcceptance(overrides = {}) {
  const input = { ...readAyalonAcceptanceInputs(), ...overrides };
  const errors = [];
  let manifest, lock, hashalom, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    hashalom = JSON.parse(input.hashalomIndexSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-025 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("ayalon-acceptance manifest differs from the reviewed RSH-025 authority");
  const identities = {
    track_source_sha256: [input.trackSource, EXPECTED_TRACK_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    hashalom_index_sha256: [input.hashalomIndexSource, EXPECTED_HASHALOM_INDEX_SHA256],
    pixel_golden_sha256: [input.pixelGoldenSource, EXPECTED_PIXEL_GOLDEN_SHA256],
    ayalon_hash_script_sha256: [input.ayalonHashSource, EXPECTED_AYALON_HASH_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-025" || manifest.track_identity?.id !== "ayalon") errors.push("RSH-025 track identity changed");
  if (manifest.track_identity?.width !== 28 || manifest.track_identity?.open !== true || manifest.track_identity?.theme !== "highway") errors.push("Ayalon V1 identity (width/open/theme) changed");
  if (manifest.track_identity?.gis_claim !== false || manifest.track_identity?.owner_freeze !== false) errors.push("RSH-025 must not claim GIS accuracy or owner freeze");
  if (manifest.track_identity?.street_segment_count !== 6 || manifest.track_identity?.poi_count !== 9 || manifest.track_identity?.checkpoint_count !== 8) errors.push("Ayalon segment/POI/checkpoint counts changed");
  if (manifest.pixel_golden?.threshold !== 0.12 || manifest.pixel_golden?.fail_percent !== 8) errors.push("pixel-golden gate changed");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-025");
  if (!Array.isArray(hashalom.shots) || hashalom.shots.length !== 18) errors.push("HaShalom shot inventory changed");

  for (const token of [
    'id: "ayalon"',
    'nameHe: "נתיבי איילון"',
    'nameEn: "Ayalon Highway"',
    "width: 28",
    'theme: "highway"',
    "open: true",
    "checkpointCount: 8",
  ]) if (!input.trackSource.includes(token)) errors.push(`ayalon track lost required token: ${token}`);

  for (const token of [
    'const files = ["ayalon-day-g01.png", "ayalon-day-g05.png", "ayalon-day-g07.png", "ayalon-night-g08.png"]',
    "threshold 0.12",
    "fail >8%",
  ]) if (!input.pixelGoldenSource.includes(token)) errors.push(`pixel-golden lost required token: ${token}`);

  const files = manifest.reference_pack?.files ?? {};
  const duplicates = manifest.reference_pack?.duplicate_placeholder_shots ?? [];
  if (duplicates.length !== 4) errors.push("duplicate placeholder inventory changed");
  for (const name of Object.keys(files)) {
    const actual = sha256File(fromRoot("golden-baseline", name));
    if (actual !== files[name]) errors.push(`reference pack hash drift: ${name}`);
  }
  for (const name of duplicates) {
    if (files[name] !== DUPLICATE_PLACEHOLDER_HASH) errors.push(`placeholder ${name} is no longer the recorded duplicate hash`);
  }

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.track_source_changes !== 0 || manifest.preservation?.world_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-025 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-037 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-037" || manifest.deferred_boundary?.rsh_028_authorized !== true || manifest.deferred_boundary?.rsh_028_started !== true || manifest.deferred_boundary?.rsh_029_authorized !== true || manifest.deferred_boundary?.rsh_029_started !== true || manifest.deferred_boundary?.rsh_030_authorized !== true || manifest.deferred_boundary?.rsh_030_started !== true || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== true || manifest.deferred_boundary?.rsh_036_authorized !== true || manifest.deferred_boundary?.rsh_037_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== true || manifest.deferred_boundary?.rsh_036_started !== true || manifest.deferred_boundary?.rsh_037_started !== false) errors.push("RSH-037 deferred boundary changed");

  return {
    errors,
    trackId: manifest.track_identity?.id,
    packFiles: Object.keys(files).length,
    duplicatePlaceholders: duplicates.length,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateAyalonAcceptance();
  if (result.errors.length) {
    console.error(`ayalon-acceptance fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`ayalon-acceptance ok: ${result.trackId}; ${result.packFiles} pack files; ${result.duplicatePlaceholders} duplicate placeholders; RSH-029 overlay accepted; RSH-031 deferred`);
}
