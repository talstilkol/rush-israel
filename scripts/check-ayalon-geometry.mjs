#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "9dd4041701b3852ab0308952a5d33bc6340e2c6bafcb8008d5de289a77a2d0be";
export const EXPECTED_GEOMETRY_SHA256 = "b5be3e5838fb99449fb7d5a5684177e8626a7a283c54275461fd45faf42a94f7";
export const EXPECTED_INDEX_SHA256 = "878d7834dfac9c7756b0929eea515f03ff23b2f8500a63fd49f1fb369c4e3ae6";
export const EXPECTED_TRACK_SHA256 = "8b8f149f8ae2eb43c4593e4916244f14012397cb0cf5b2b42481e1406317404d";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_CHECKER_TEST_SHA256 = "ee4e3fae2ae0aad25cc468d5f6f13e72cb23d5a7870a37bb2341d269cea1c807";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_CONTROL_POINT_SHA256 = "c89477d17556a212d5e793cce74ebc483c36333348e31d5b66a16f7851b7bf6d";

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

function tlvProject(lat, lon) {
  return {
    x: (lon - 34.77) * 94350 * 0.45,
    z: (lat - 32.075) * 111320 * 0.45,
  };
}

export function liveControlPoints() {
  const pts = [];
  for (let lat = 32.052; lat <= 32.106; lat += 0.002) {
    pts.push(tlvProject(Number(lat.toFixed(4)), 34.795));
  }
  return pts;
}

export function canonicalControlPointDigest(points = liveControlPoints()) {
  return points.map((point) => `${point.x.toFixed(12)},${point.z.toFixed(12)}`).join("\n") + "\n";
}

export function readAyalonGeometryInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AYALON-GEOMETRY-MANIFEST.json"), "utf8"),
    geometrySource: readFileSync(fromRoot("src", "game", "ayalon-lock", "geometry.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-lock", "index.ts"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-ayalon-geometry.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAyalonGeometry(overrides = {}) {
  const input = { ...readAyalonGeometryInputs(), ...overrides };
  const errors = [];
  let manifest, lock, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-026 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("ayalon-geometry manifest differs from the reviewed RSH-026 authority");
  const identities = {
    geometry_source_sha256: [input.geometrySource, EXPECTED_GEOMETRY_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    track_source_sha256: [input.trackSource, EXPECTED_TRACK_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-026" || manifest.geometry?.id !== "ayalon") errors.push("RSH-026 geometry identity changed");
  if (manifest.geometry?.width !== 28 || manifest.geometry?.lanes !== 8 || manifest.geometry?.lane_width !== 3.5) errors.push("Ayalon width/lanes changed");
  if (manifest.geometry?.open !== true || manifest.geometry?.theme !== "highway" || manifest.geometry?.seed !== 2020) errors.push("Ayalon V1 identity (open/theme/seed) changed");
  if (manifest.geometry?.point_count !== 27 || manifest.geometry?.lat_last_sample !== 32.104) errors.push("Ayalon spline sample count/last latitude changed");
  if (manifest.geometry?.opposite_carriageway_offset !== 46 || manifest.geometry?.opposite_driveable !== false) errors.push("Ayalon opposite-carriageway lock changed");
  if (manifest.geometry?.gis_claim !== false || manifest.geometry?.owner_freeze !== false) errors.push("RSH-026 must not claim GIS accuracy or owner freeze");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-026");

  const points = liveControlPoints();
  const digest = canonicalControlPointDigest(points);
  if (points.length !== 27) errors.push("live control-point count drifted");
  if (sha256(digest) !== EXPECTED_CONTROL_POINT_SHA256 || manifest.geometry?.control_point_sha256 !== EXPECTED_CONTROL_POINT_SHA256) errors.push("Ayalon control-point digest changed");
  if (manifest.identities?.control_point_sha256 !== EXPECTED_CONTROL_POINT_SHA256) errors.push("control_point_sha256 identity changed");

  for (const token of [
    'id: "ayalon"',
    'nameHe: "נתיבי איילון"',
    'nameEn: "Ayalon Highway"',
    "width: 28",
    "seed: 2020",
    'theme: "highway"',
    "open: true",
    "const west = 34.795",
    "for (let lat = 32.052; lat <= 32.106; lat += 0.002)",
    "elevation: (t) => 0.5 + 1.7 * Math.sin(t * Math.PI) + 0.85 * Math.sin(t * Math.PI * 5)",
    "Not GIS",
  ]) if (!input.trackSource.includes(token)) errors.push(`ayalon track lost required geometry token: ${token}`);

  for (const token of [
    'if (def.id === "ayalon") return 8;',
    "built.width + 18",
  ]) if (!input.worldSource.includes(token)) errors.push(`world lost required Ayalon geometry token: ${token}`);

  for (const token of [
    "export const AYALON_WIDTH = 28",
    "export const AYALON_LANES = 8",
    "export const AYALON_POINT_COUNT = 27",
    "export const AYALON_LAT_LAST_SAMPLE = 32.104",
    "export const AYALON_OPPOSITE_CARRIAGEWAY_OFFSET = AYALON_WIDTH + 18",
    "export const AYALON_GIS_CLAIM = false",
    "export const AYALON_OWNER_FREEZE = false",
    "for (let lat = AYALON_LAT_START; lat <= AYALON_LAT_LOOP_END; lat += AYALON_LAT_STEP)",
  ]) if (!input.geometrySource.includes(token)) errors.push(`ayalon-lock geometry lost required token: ${token}`);

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.track_source_changes !== 0 || manifest.preservation?.world_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-026 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-034 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-034" || manifest.deferred_boundary?.rsh_028_authorized !== true || manifest.deferred_boundary?.rsh_028_started !== true || manifest.deferred_boundary?.rsh_029_authorized !== true || manifest.deferred_boundary?.rsh_029_started !== true || manifest.deferred_boundary?.rsh_030_authorized !== true || manifest.deferred_boundary?.rsh_030_started !== true || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== false) errors.push("RSH-034 deferred boundary changed");

  return {
    errors,
    trackId: manifest.geometry?.id,
    width: manifest.geometry?.width,
    lanes: manifest.geometry?.lanes,
    pointCount: points.length,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateAyalonGeometry();
  if (result.errors.length) {
    console.error(`ayalon-geometry fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`ayalon-geometry ok: ${result.trackId}; width ${result.width}; ${result.lanes} lanes; ${result.pointCount} points; RSH-029 overlay accepted; RSH-031 deferred`);
}
