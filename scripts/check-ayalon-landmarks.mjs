#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "15582112ef686c05f5680f197dadafc8ea875c944f706bc692812b7c7bba51fe";
export const EXPECTED_LANDMARK_SHA256 = "d830e1440e6daaf302cca68409208dc2db440f8712dbfae8a32b722b9009209e";
export const EXPECTED_INDEX_SHA256 = "d51244ebc8e3b0793a9b17796ea7db044eab4432d6d9e0a54d7c19b21515e86b";
export const EXPECTED_TRACK_SHA256 = "8b8f149f8ae2eb43c4593e4916244f14012397cb0cf5b2b42481e1406317404d";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_CHECKER_TEST_SHA256 = "331222e90871571a327108666ee54dc4985904319828dc53ccb2ebbbad631a97";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_POI_SHA256 = "653400d559e6e34f7fb009d8620f7bc94fbb0bfca48537d3c7e2be98a0028063";
export const EXPECTED_PLACEMENT_SHA256 = "ca016b04811f2d6184ee36311d805bbd6f77083a1395d7d6a753b7f1963d77a8";

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

export const LIVE_POIS = [
  { lat: 32.0547, lon: 34.7848, r: 36, en: "HaHagana Station" },
  { lat: 32.0735, lon: 34.793, r: 40, en: "HaShalom Station" },
  { lat: 32.0837, lon: 34.7975, r: 40, en: "Savidor Center" },
  { lat: 32.1035, lon: 34.8042, r: 36, en: "University Station" },
  { lat: 32.0744, lon: 34.7922, r: 48, en: "Azrieli" },
  { lat: 32.0695, lon: 34.7894, r: 36, en: "ToHa Tower" },
  { lat: 32.0699, lon: 34.7918, r: 36, en: "Electra Tower" },
  { lat: 32.0832, lon: 34.8027, r: 44, en: "Moshe Aviv Tower" },
  { lat: 32.0806, lon: 34.7926, r: 36, en: "Midtown TLV" },
];

export function canonicalPoiDigest(pois = LIVE_POIS) {
  return pois.map((poi) => `${poi.en}|${poi.lat}|${poi.lon}|${poi.r}`).join("\n") + "\n";
}

export function canonicalPlacementDigest() {
  return [
    "placeAzrieli(1.42)",
    "placeToHa(1.28, 32.0695, 34.7894)",
    "placeCityGate(1)",
    "placeMidtown(1.15)",
    "placeElectra(1.2)",
    "placeSarona(1.32)",
    "placeHakirya(1.1)",
    "placeShalomMeir(1.15)",
    "ibm=parkOff(32.0856, 34.7987, 36, true)",
    "yovel=parkOff(32.0788, 34.7916, 30, false)",
    "platinum=parkOff(32.0842, 34.8036, 42, true)",
    "tau=parkOff(32.1124, 34.8046, 48, true)",
    "hashalom_tube=tlv(32.0735, 34.79605)",
    "ayalon_mall=tlv(32.1004, 34.7996)",
    "azrieli_hint=tlv(32.0744, 34.7932)",
  ].join("\n") + "\n";
}

export function readAyalonLandmarkInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AYALON-LANDMARK-MANIFEST.json"), "utf8"),
    landmarkSource: readFileSync(fromRoot("src", "game", "ayalon-landmarks", "landmarks.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-landmarks", "index.ts"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    builderSource: readFileSync(fromRoot("src", "game", "world-builders", "tracks", "ayalon.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-ayalon-landmarks.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAyalonLandmarks(overrides = {}) {
  const input = { ...readAyalonLandmarkInputs(), ...overrides };
  const errors = [];
  let manifest, lock, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-028 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("ayalon-landmark manifest differs from the reviewed RSH-028 authority");
  const identities = {
    landmark_source_sha256: [input.landmarkSource, EXPECTED_LANDMARK_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    track_source_sha256: [input.trackSource, EXPECTED_TRACK_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-028" || manifest.landmarks?.id !== "ayalon") errors.push("RSH-028 landmark identity changed");
  if (manifest.landmarks?.width !== 28 || manifest.landmarks?.open !== true || manifest.landmarks?.track_poi_count !== 9) errors.push("Ayalon POI identity changed");
  if (manifest.landmarks?.builder_place_calls !== 8 || manifest.landmarks?.builder_extra_landmarks !== 6) errors.push("Ayalon builder landmark counts changed");
  if (manifest.landmarks?.gis_claim !== false || manifest.landmarks?.owner_freeze !== false) errors.push("RSH-028 must not claim GIS accuracy or owner freeze");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-028");

  const poiDigest = canonicalPoiDigest();
  const placementDigest = canonicalPlacementDigest();
  if (LIVE_POIS.length !== 9) errors.push("live POI count drifted");
  if (sha256(poiDigest) !== EXPECTED_POI_SHA256 || manifest.landmarks?.poi_sha256 !== EXPECTED_POI_SHA256) errors.push("Ayalon POI digest changed");
  if (sha256(placementDigest) !== EXPECTED_PLACEMENT_SHA256 || manifest.landmarks?.placement_sha256 !== EXPECTED_PLACEMENT_SHA256) errors.push("Ayalon placement digest changed");
  if (manifest.identities?.poi_sha256 !== EXPECTED_POI_SHA256) errors.push("poi_sha256 identity changed");
  if (manifest.identities?.placement_sha256 !== EXPECTED_PLACEMENT_SHA256) errors.push("placement_sha256 identity changed");

  for (const token of [
    'id: "ayalon"',
    "width: 28",
    "open: true",
    '{ ...tlv(32.0547, 34.7848), r: 36, he: "תחנת ההגנה", en: "HaHagana Station" }',
    '{ ...tlv(32.0735, 34.793), r: 40, he: "תחנת השלום", en: "HaShalom Station" }',
    '{ ...tlv(32.0837, 34.7975), r: 40, he: "סבידור מרכז", en: "Savidor Center" }',
    '{ ...tlv(32.1035, 34.8042), r: 36, he: "תחנת האוניברסיטה", en: "University Station" }',
    '{ ...tlv(32.0744, 34.7922), r: 48, he: "עזריאלי", en: "Azrieli" }',
    '{ ...tlv(32.0695, 34.7894), r: 36, he: "מגדל תוהה", en: "ToHa Tower" }',
    '{ ...tlv(32.0699, 34.7918), r: 36, he: "מגדל אלקטרה", en: "Electra Tower" }',
    '{ ...tlv(32.0832, 34.8027), r: 44, he: "מגדל משה אביב", en: "Moshe Aviv Tower" }',
    '{ ...tlv(32.0806, 34.7926), r: 36, he: "מידטאון", en: "Midtown TLV" }',
    "Not GIS",
  ]) if (!input.trackSource.includes(token)) errors.push(`ayalon track lost required landmark token: ${token}`);

  for (const token of [
    "placeAzrieli(1.42);",
    "placeToHa(1.28, 32.0695, 34.7894);",
    "placeCityGate(1);",
    "placeMidtown(1.15);",
    "placeElectra(1.2);",
    "placeSarona(1.32);",
    "placeHakirya(1.1);",
    "placeShalomMeir(1.15);",
    "parkOff(32.0856, 34.7987, 36, true)",
    "parkOff(32.0788, 34.7916, 30, false)",
    "parkOff(32.0842, 34.8036, 42, true)",
    "parkOff(32.1124, 34.8046, 48, true)",
    "tlv(32.0735, 34.79605)",
    "tlv(32.1004, 34.7996)",
    "tlv(32.0744, 34.7932)",
  ]) if (!input.builderSource.includes(token)) errors.push(`ayalon builder lost required landmark token: ${token}`);

  for (const token of [
    "export const AYALON_TRACK_POI_COUNT = 9",
    "export const AYALON_BUILDER_PLACE_CALLS = 8",
    "export const AYALON_BUILDER_EXTRA_LANDMARKS = 6",
    "export const AYALON_GIS_CLAIM = false",
    "export const AYALON_OWNER_FREEZE = false",
  ]) if (!input.landmarkSource.includes(token)) errors.push(`ayalon-landmarks lock lost required token: ${token}`);

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.track_source_changes !== 0 || manifest.preservation?.world_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-028 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-035 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-035" || manifest.deferred_boundary?.rsh_030_authorized !== true || manifest.deferred_boundary?.rsh_030_started !== true || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== false) errors.push("RSH-035 deferred boundary changed");

  return {
    errors,
    trackId: manifest.landmarks?.id,
    poiCount: LIVE_POIS.length,
    placeCalls: manifest.landmarks?.builder_place_calls,
    extraLandmarks: manifest.landmarks?.builder_extra_landmarks,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateAyalonLandmarks();
  if (result.errors.length) {
    console.error(`ayalon-landmarks fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`ayalon-landmarks ok: ${result.trackId}; ${result.poiCount} POIs; ${result.placeCalls} place calls; ${result.extraLandmarks} extra landmarks; RSH-031 deferred`);
}
