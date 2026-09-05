#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";
import { stripRsh033Overlay } from "./rsh033-overlay.mjs";

export const EXPECTED_MANIFEST_SHA256 = "07be652a0d8d82d2a7e07984b19ace91627252a93f1e9fc16f52d1e021dd37bb";
export const EXPECTED_LOCK_SHA256 = "477c9c75d707945f4c9c7463675db9099a419b7ca21911fff065d8cf287a98d0";
export const EXPECTED_INDEX_SHA256 = "e9489dbe34cee8d9768fa75fbe5ea0ce5276f686fdfcdad1c2a95e908988504e";
export const EXPECTED_CARS_SHA256 = "bbdf2b01bc8ae5a9169b2706fd522d34ec3584e17255fc284740c93942236542";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_PHYSICS_STRIP_SHA256 = "cbff35aa2e2e4b509decf38e9f1ca3d262667675af81e0352ba02f460f5723c1";
export const EXPECTED_ACCEL_STRIP_SHA256 = "3dd2499741a581b13c97f3f6f51f0861228c9b26c1964c0970f267c4aff4fb50";
export const EXPECTED_CHECKER_TEST_SHA256 = "2c0585c1e926f68ec51f37fe5f3797516dfa23ab84b7e5cb7c60a9fcce99a253";
export const EXPECTED_GOLDEN_SHA256 = "3bd812e9f60184a846fbd1ffe6392b3a9d42a6a1f25c6df83bfb9a3e966fa224";
export const CLAIMS = [8.4, 6.6, 4.9, 5.8, 3.5];
export const CARS = ["sabra", "carmel", "kfir", "negev", "yam"];

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

export function readPhysicsCalibrationInputs() {
  return {
    manifestSource: readFileSync(fromRoot("PHYSICS-CALIBRATION-MANIFEST.json"), "utf8"),
    lockSource: readFileSync(fromRoot("src", "game", "physics-lock", "physics.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "physics-lock", "index.ts"), "utf8"),
    carsSource: readFileSync(fromRoot("src", "game", "cars.ts"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    physicsSource: readFileSync(fromRoot("src", "game", "physics.ts"), "utf8"),
    vehicleSource: readFileSync(fromRoot("src", "game", "vehicle.ts"), "utf8"),
    accelSource: readFileSync(fromRoot("scripts", "accel-smoke.mjs"), "utf8"),
    goldenSource: readFileSync(fromRoot("golden-baseline", "accel.json"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-physics-calibration.test.mjs"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validatePhysicsCalibration(overrides = {}) {
  const input = { ...readPhysicsCalibrationInputs(), ...overrides };
  const errors = [];
  let manifest, golden, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    golden = JSON.parse(input.goldenSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-033 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) {
    errors.push("physics-calibration manifest differs from the reviewed RSH-033 authority");
  }

  const identities = {
    lock_source_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    cars_source_sha256: [input.carsSource, EXPECTED_CARS_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    golden_accel_sha256: [input.goldenSource, EXPECTED_GOLDEN_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  let strippedPhysics;
  let strippedAccel;
  try {
    strippedPhysics = stripRsh033Overlay("src/game/physics.ts", input.physicsSource);
    strippedAccel = stripRsh033Overlay("scripts/accel-smoke.mjs", input.accelSource);
    stripRsh033Overlay("src/game/vehicle.ts", input.vehicleSource);
  } catch (error) {
    errors.push(String(error.message || error));
    strippedPhysics = input.physicsSource;
    strippedAccel = input.accelSource;
  }
  if (sha256(strippedPhysics) !== EXPECTED_PHYSICS_STRIP_SHA256) errors.push("stripped physics.ts identity changed");
  if (sha256(strippedAccel) !== EXPECTED_ACCEL_STRIP_SHA256) errors.push("stripped accel-smoke identity changed");

  if (manifest.unit !== "RSH-033") errors.push("RSH-033 unit identity changed");
  if (manifest.calibration?.physics_version !== 7) errors.push("PHYSICS_VERSION is not 7");
  if (manifest.calibration?.physics_hz !== 120) errors.push("physics rate is not 120 Hz");
  if (manifest.calibration?.v100_mps !== 27.778) errors.push("V100_MPS changed");
  if (manifest.calibration?.claim_tolerance !== 0.15) errors.push("claim tolerance changed");
  if (JSON.stringify(manifest.calibration?.claims) !== JSON.stringify(CLAIMS)) errors.push("claim table changed");
  if (JSON.stringify(manifest.calibration?.cars) !== JSON.stringify(CARS)) errors.push("car table changed");
  if (manifest.calibration?.cars_rewritten !== false) errors.push("cars.ts rewrite is forbidden");
  if (manifest.calibration?.package_json_changed !== false) errors.push("package.json mutation is forbidden");
  if (manifest.calibration?.gear_dump_below_v100 !== false) errors.push("gear dump below V100 is forbidden");
  if (manifest.calibration?.launch_drag_compensate !== true) errors.push("launch drag compensation is required");
  if (manifest.calibration?.gis_claim !== false || manifest.calibration?.owner_freeze !== false || manifest.calibration?.public_distribution !== false) {
    errors.push("RSH-033 must not claim GIS accuracy, owner freeze or public distribution");
  }

  if (!/export const PHYSICS_VERSION = 7;/.test(input.physicsSource)) errors.push("PHYSICS_VERSION is not 7");
  if (!/export function launchAccel\(/.test(input.physicsSource)) errors.push("launchAccel is missing from physics.ts");
  if (!/launchAccel\(/.test(input.vehicleSource)) errors.push("vehicle launch law does not use launchAccel");
  if (!/Math\.abs\(this\.speed\) > V100_MPS/.test(input.vehicleSource) && !/Math\.abs\(this\.speed\) > 27\.778/.test(input.vehicleSource)) {
    errors.push("gear dump is not gated above V100_MPS");
  }
  if (!/throw new Error\("qa:accel claim fail/.test(input.accelSource)) errors.push("qa:accel does not fail closed on claimGaps");

  const claimPattern = [
    /zeroTo100:\s*8\.4/,
    /zeroTo100:\s*6\.6/,
    /zeroTo100:\s*4\.9/,
    /zeroTo100:\s*5\.8/,
    /zeroTo100:\s*3\.5/,
  ];
  for (const pattern of claimPattern) {
    if (!pattern.test(input.carsSource)) errors.push(`cars.ts lost required claim token: ${pattern}`);
  }

  if (golden.physicsVersion !== 7) errors.push("golden baseline physicsVersion is not 7");
  if (golden.claimTolerance !== 0.15) errors.push("golden baseline claimTolerance changed");
  if (!Array.isArray(golden.runs) || golden.runs.length !== 5) errors.push("golden baseline run table changed");
  for (const [index, car] of CARS.entries()) {
    const run = golden.runs?.[index];
    if (!run || run.carId !== car || run.claim !== CLAIMS[index] || run.claimOk !== true) {
      errors.push(`golden baseline ${car} claim row changed`);
    }
  }

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) {
    errors.push("asset/distribution/release boundary changed");
  }
  if (manifest.preservation?.cars_source_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) {
    errors.push("RSH-033 preservation counts changed");
  }

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-037 was precreated: ${later.join(", ")}`);
  if (
    manifest.deferred_boundary?.queue_head !== "RSH-037"
    || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== true || manifest.deferred_boundary?.rsh_036_authorized !== true || manifest.deferred_boundary?.rsh_037_authorized !== false
    || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== true || manifest.deferred_boundary?.rsh_036_started !== true || manifest.deferred_boundary?.rsh_037_started !== false
  ) {
    errors.push("RSH-037 deferred boundary changed");
  }

  return {
    errors,
    physicsVersion: manifest.calibration?.physics_version,
    claims: manifest.calibration?.claims,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validatePhysicsCalibration();
  if (result.errors.length) {
    console.error(`physics-calibration fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`physics-calibration ok: PHYSICS_VERSION ${result.physicsVersion}; claims ${result.claims.join("/")}; RSH-037 deferred`);
}
