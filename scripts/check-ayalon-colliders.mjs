#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "79b968aa24280c95cde224a5d544cf5ca46bd7e8258bc95c8a2a4564870a55d1";
export const EXPECTED_COLLIDER_SHA256 = "da611c2867879fa55f6b3db84c76f93725a8b786e0b7dea94079fe6f5ae6708f";
export const EXPECTED_INDEX_SHA256 = "0da73a7edfc99d806ae884f482175b88644f66cd58709362b9235c7e9de80daa";
export const EXPECTED_TRACK_SHA256 = "8b8f149f8ae2eb43c4593e4916244f14012397cb0cf5b2b42481e1406317404d";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_CHECKER_TEST_SHA256 = "9c08350a11beb65e503d51722e8d00f2341e252331b47ef62714a8a2cc7c2ac0";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_CHECKPOINT_SHA256 = "f53946f17dd4a7a77198057729813d5e5760a325b1f76d7a15a818d4d0c9d22d";
export const EXPECTED_RAMP_RECIPE_SHA256 = "f0b14d4ca14f17cfd9ec258538ef6f68c079de9fb4fb5c9f390354e404369be5";

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

export function liveCheckpoints() {
  const checkpoints = [];
  for (let i = 0; i < 8; i++) checkpoints.push((i + 1) / 8.15);
  return checkpoints;
}

export function canonicalCheckpointDigest(checkpoints = liveCheckpoints()) {
  return checkpoints.map((value) => value.toFixed(12)).join("\n") + "\n";
}

export function canonicalRampRecipeDigest() {
  return [
    "interchanges=6",
    "per=7",
    "galuyot_extra=4",
    "laguardia_extra=2",
    "flyover_extra=2",
    "total=50",
    "deck_y=9.4",
    "z_len=68",
    "approach=34",
    "half=10.2",
    "inner=32x12.5",
    "along=36",
    "flyover=46x6.4@0.4-8.6",
    "names=Kibbutz Galuyot,HaHagana,LaGuardia,HaShalom,Savidor Center,University",
  ].join("\n") + "\n";
}

export function readAyalonColliderInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AYALON-COLLIDER-MANIFEST.json"), "utf8"),
    colliderSource: readFileSync(fromRoot("src", "game", "ayalon-colliders", "colliders.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-colliders", "index.ts"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    builderSource: readFileSync(fromRoot("src", "game", "world-builders", "tracks", "ayalon.ts"), "utf8"),
    splineSource: readFileSync(fromRoot("src", "game", "spline.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-ayalon-colliders.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAyalonColliders(overrides = {}) {
  const input = { ...readAyalonColliderInputs(), ...overrides };
  const errors = [];
  let manifest, lock, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-027 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("ayalon-collider manifest differs from the reviewed RSH-027 authority");
  const identities = {
    collider_source_sha256: [input.colliderSource, EXPECTED_COLLIDER_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    track_source_sha256: [input.trackSource, EXPECTED_TRACK_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-027" || manifest.colliders?.id !== "ayalon") errors.push("RSH-027 collider identity changed");
  if (manifest.colliders?.width !== 28 || manifest.colliders?.open !== true || manifest.colliders?.checkpoint_count !== 8) errors.push("Ayalon checkpoint identity changed");
  if (manifest.colliders?.interchange_count !== 6 || manifest.colliders?.ramps_per_interchange !== 7 || manifest.colliders?.ramp_count !== 50) errors.push("Ayalon ramp count changed");
  if (manifest.colliders?.deck_y !== 9.4 || manifest.colliders?.ramp_z_len !== 68 || manifest.colliders?.ramp_half !== 10.2) errors.push("Ayalon ramp dimensions changed");
  if (manifest.colliders?.barrier_wall_d_extra !== 1.55 || manifest.colliders?.barrier_positive_radius !== 0.62 || manifest.colliders?.barrier_negative_radius !== 1.05) errors.push("Ayalon barrier lock changed");
  if (manifest.colliders?.gis_claim !== false || manifest.colliders?.owner_freeze !== false) errors.push("RSH-027 must not claim GIS accuracy or owner freeze");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-027");

  const checkpoints = liveCheckpoints();
  const digest = canonicalCheckpointDigest(checkpoints);
  if (checkpoints.length !== 8) errors.push("live checkpoint count drifted");
  if (sha256(digest) !== EXPECTED_CHECKPOINT_SHA256 || manifest.colliders?.checkpoint_sha256 !== EXPECTED_CHECKPOINT_SHA256) errors.push("Ayalon checkpoint digest changed");
  if (sha256(canonicalRampRecipeDigest()) !== EXPECTED_RAMP_RECIPE_SHA256 || manifest.colliders?.ramp_recipe_sha256 !== EXPECTED_RAMP_RECIPE_SHA256) errors.push("Ayalon ramp-recipe digest changed");
  if (manifest.identities?.checkpoint_sha256 !== EXPECTED_CHECKPOINT_SHA256) errors.push("checkpoint_sha256 identity changed");
  if (manifest.identities?.ramp_recipe_sha256 !== EXPECTED_RAMP_RECIPE_SHA256) errors.push("ramp_recipe_sha256 identity changed");

  for (const token of [
    'id: "ayalon"',
    "checkpointCount: 8",
    "width: 28",
    "open: true",
    "Not GIS",
  ]) if (!input.trackSource.includes(token)) errors.push(`ayalon track lost required collider token: ${token}`);

  for (const token of [
    "checkpoints.push(closed ? i / def.checkpointCount : (i + 1) / (def.checkpointCount + 0.15))",
  ]) if (!input.splineSource.includes(token)) errors.push(`spline lost required checkpoint token: ${token}`);

  for (const token of [
    "const edgeStep = Math.max(3, Math.floor(built.samples.length / 360))",
    "const wallD = built.width / 2 + 1.55",
    'kind: "barrier"',
    "r: 0.62",
    "r: 1.05",
  ]) if (!input.worldSource.includes(token)) errors.push(`world lost required Ayalon barrier token: ${token}`);

  for (const token of [
    "const deckY = 9.4",
    "const zLen = 68",
    "const a = 34",
    "zLen, 10.2, 0.5, deckY",
    'if (ic.en === "Kibbutz Galuyot")',
    'if (ic.en === "LaGuardia")',
    'en: "HaShalom"',
    'en: "Savidor Center"',
    "hitRoad(px, pz, 1.4, 0.95, 0.95)",
    "if (colNear.dist > built.width / 2 + 2.5)",
  ]) if (!input.builderSource.includes(token)) errors.push(`ayalon builder lost required ramp/collider token: ${token}`);

  for (const token of [
    "export const AYALON_CHECKPOINT_COUNT = 8",
    "export const AYALON_RAMP_COUNT =",
    "export const AYALON_DECK_Y = 9.4",
    "export const AYALON_BARRIER_WALL_D_EXTRA = 1.55",
    "export const AYALON_GIS_CLAIM = false",
    "export const AYALON_OWNER_FREEZE = false",
  ]) if (!input.colliderSource.includes(token)) errors.push(`ayalon-colliders lock lost required token: ${token}`);

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.track_source_changes !== 0 || manifest.preservation?.world_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-027 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-035 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-035" || manifest.deferred_boundary?.rsh_028_authorized !== true || manifest.deferred_boundary?.rsh_028_started !== true || manifest.deferred_boundary?.rsh_029_authorized !== true || manifest.deferred_boundary?.rsh_029_started !== true || manifest.deferred_boundary?.rsh_030_authorized !== true || manifest.deferred_boundary?.rsh_030_started !== true || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== false) errors.push("RSH-035 deferred boundary changed");

  return {
    errors,
    trackId: manifest.colliders?.id,
    rampCount: manifest.colliders?.ramp_count,
    checkpointCount: checkpoints.length,
    interchangeCount: manifest.colliders?.interchange_count,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateAyalonColliders();
  if (result.errors.length) {
    console.error(`ayalon-colliders fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`ayalon-colliders ok: ${result.trackId}; ${result.rampCount} ramps; ${result.checkpointCount} checkpoints; ${result.interchangeCount} interchanges; RSH-029 overlay accepted; RSH-031 deferred`);
}
