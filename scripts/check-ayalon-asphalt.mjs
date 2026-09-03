#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "7066d4c294ddec3636089f02bbb80e9864e82ea48f91d1b3d4b7d3e3d2b40b06";
export const EXPECTED_ASPHALT_SHA256 = "56917840c78578561c37c41e78c3d57eccb4f3338d27758d525e0861b6b95dd0";
export const EXPECTED_INDEX_SHA256 = "ceea2c0c9e6274d42e1e0233a38d4147194510c9118d71f7737d616b249fc17b";
export const EXPECTED_TRACK_SHA256 = "8b8f149f8ae2eb43c4593e4916244f14012397cb0cf5b2b42481e1406317404d";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_CHECKER_TEST_SHA256 = "96a42abc2de06dd29380c909eafa01486384e6bfa54ba63e851b566f6002e63e";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_ASPHALT_DIGEST_SHA256 = "af8a4802f66a9b61c89da6805953262e40d565278b20856a86b12c5d27acc441";
export const EXPECTED_MARKING_DIGEST_SHA256 = "6fded4dfe0c71535028ba58c761c38b82fe846d0ba8245fd02c7dd19e1b3ca5a";
export const EXPECTED_SIGN_DIGEST_SHA256 = "46da35914d60995a1be73271f19d40af0201795e91bc76eb449eeeb1f1bb6343";

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

export function canonicalAsphaltDigest() {
  return [
    "lanes=8",
    "kit=8",
    "map=/game/asphalt-8.png",
    "rough=/game/asphalt-8-rough.png",
    "bump=/game/asphalt-8-bump.png",
    "road_bumpScale=0.36",
    "road_color=16777215",
    "road_roughness=0.48",
    "road_metalness=0",
    "road_env=0.85",
    "road_clearcoat=0.28",
    "road_clearcoatRoughness=0.4",
    "road_reflectivity=0.28",
    "ramp_bumpScale=0.18",
    "ramp_colorKit=16777215",
    "ramp_colorFallback=6053990",
    "ramp_roughness=0.45",
    "ramp_metalness=0",
    "ramp_env=0.85",
    "ramp_clearcoat=0.22",
    "ramp_clearcoatRoughness=0.4",
    "sidewalk_present=false",
    "sidewalk_asset=/game/sidewalk.png",
    "sidewalk_repeat=1x8",
    "sidewalk_roughness=0.88",
    "sidewalk_metalness=0.04",
    "sidewalk_env=0.3",
  ].join("\n") + "\n";
}

export function canonicalMarkingDigest() {
  return [
    "edge=0.16x0.46@16777215",
    "dash=0.2x0.045x4.4@16251124",
    "dash_skip=9",
    "dash_offs=0,46",
    "chevron_n=48",
    "chevron_scale=1.55",
    "chevron_geo=2.8x3.6",
    "arrow_asset=/game/lane-arrow.png",
    "arrow_lats=32.055,32.061,32.067,32.0735,32.083,32.092,32.101",
    "arrow_lons=34.795,34.7971",
    "arrow_per=8",
    "arrow_plane=3.2x4.6",
  ].join("\n") + "\n";
}

export function canonicalSignDigest() {
  return [
    "gantries=gantry-kibbutz-galuyot,gantry-hahagana,gantry-laguardia,gantry-hashalom,gantry-savidor-center,gantry-university",
    "stations=stn-galuyot,stn-hagana,stn-shalom,stn-savidor,stn-uni",
    "dest=dest-rail",
    "highway_kinds=speed90,speed80,none",
    "interchange_speed=speed90",
    "gantry_plane=18x4.2",
    "gantry_y=13.8",
    "speed90_off=width/2+4.2",
    "speed90_plate=1.6",
    "green=1731130",
  ].join("\n") + "\n";
}

export function readAyalonAsphaltInputs() {
  return {
    manifestSource: readFileSync(fromRoot("AYALON-ASPHALT-MANIFEST.json"), "utf8"),
    asphaltSource: readFileSync(fromRoot("src", "game", "ayalon-asphalt", "asphalt.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-asphalt", "index.ts"), "utf8"),
    trackSource: readFileSync(fromRoot("src", "game", "tracks", "ayalon.ts"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    builderSource: readFileSync(fromRoot("src", "game", "world-builders", "tracks", "ayalon.ts"), "utf8"),
    roadAssetSource: readFileSync(fromRoot("src", "game", "road-assets.ts"), "utf8"),
    signAssetSource: readFileSync(fromRoot("src", "game", "sign-assets.ts"), "utf8"),
    walkAssetSource: readFileSync(fromRoot("src", "game", "walk-assets.ts"), "utf8"),
    arrowAssetSource: readFileSync(fromRoot("src", "game", "arrow-assets.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-ayalon-asphalt.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateAyalonAsphalt(overrides = {}) {
  const input = { ...readAyalonAsphaltInputs(), ...overrides };
  const errors = [];
  let manifest, lock, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-029 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("ayalon-asphalt manifest differs from the reviewed RSH-029 authority");
  const identities = {
    asphalt_source_sha256: [input.asphaltSource, EXPECTED_ASPHALT_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    track_source_sha256: [input.trackSource, EXPECTED_TRACK_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-029" || manifest.asphalt?.id !== "ayalon") errors.push("RSH-029 asphalt identity changed");
  if (manifest.asphalt?.width !== 28 || manifest.asphalt?.open !== true || manifest.asphalt?.lanes !== 8) errors.push("Ayalon asphalt identity changed");
  if (manifest.asphalt?.sidewalk_present !== false || manifest.asphalt?.gantry_count !== 6 || manifest.asphalt?.station_gantry_count !== 5) errors.push("Ayalon sidewalk/sign counts changed");
  if (manifest.asphalt?.gis_claim !== false || manifest.asphalt?.owner_freeze !== false) errors.push("RSH-029 must not claim GIS accuracy or owner freeze");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-029");

  const asphaltDigest = canonicalAsphaltDigest();
  const markingDigest = canonicalMarkingDigest();
  const signDigest = canonicalSignDigest();
  if (sha256(asphaltDigest) !== EXPECTED_ASPHALT_DIGEST_SHA256 || manifest.asphalt?.asphalt_sha256 !== EXPECTED_ASPHALT_DIGEST_SHA256) errors.push("Ayalon asphalt digest changed");
  if (sha256(markingDigest) !== EXPECTED_MARKING_DIGEST_SHA256 || manifest.asphalt?.marking_sha256 !== EXPECTED_MARKING_DIGEST_SHA256) errors.push("Ayalon marking digest changed");
  if (sha256(signDigest) !== EXPECTED_SIGN_DIGEST_SHA256 || manifest.asphalt?.sign_sha256 !== EXPECTED_SIGN_DIGEST_SHA256) errors.push("Ayalon sign digest changed");
  if (manifest.identities?.asphalt_sha256 !== EXPECTED_ASPHALT_DIGEST_SHA256) errors.push("asphalt_sha256 identity changed");
  if (manifest.identities?.marking_sha256 !== EXPECTED_MARKING_DIGEST_SHA256) errors.push("marking_sha256 identity changed");
  if (manifest.identities?.sign_sha256 !== EXPECTED_SIGN_DIGEST_SHA256) errors.push("sign_sha256 identity changed");

  for (const token of [
    'id: "ayalon"',
    "width: 28",
    "open: true",
    "theme: \"highway\"",
    "Not GIS",
  ]) if (!input.trackSource.includes(token)) errors.push(`ayalon track lost required asphalt token: ${token}`);

  for (const token of [
    'if (def.id === "ayalon") return 8;',
    "bumpScale: 0.36",
    "roughness: 0.48",
    "clearcoat: 0.28",
    'const offs = def.id === "ayalon" ? [0, built.width + 18] : [0];',
    "new THREE.BoxGeometry(0.2, 0.045, 4.4)",
    "color: 0xf7f8f4",
    'const chevN = Math.min(def.id === "ayalon" ? 48 : 28',
    'const chevS = def.id === "ayalon" ? 1.55',
    'if (def.theme !== "highway" && def.id !== "ayalon"',
    'const highway = def.theme === "highway" || def.id === "ayalon"',
    'const kinds = highway ? ["speed90", "speed80", "none"]',
    "walkTex.repeat.set(1, 8)",
  ]) if (!input.worldSource.includes(token)) errors.push(`world lost required Ayalon asphalt/marking/sign token: ${token}`);

  for (const token of [
    "const kit = getAyalonRoad();",
    "bumpScale: kit ? 0.18 : 0",
    "color: kit ? 0xffffff : 6053990",
    "roughness: 0.45",
    "clearcoat: 0.22",
    "color: 1731130",
    '"gantry-kibbutz-galuyot"',
    '"gantry-hahagana"',
    '"gantry-laguardia"',
    '"gantry-hashalom"',
    '"gantry-savidor-center"',
    '"gantry-university"',
    'getSign("speed90")',
    "new THREE.PlaneGeometry(18, 4.2)",
    "sign.position.set(c.x, 13.8, c.z)",
    "new THREE.PlaneGeometry(1.6, 1.6)",
    'gantryMat("stn-" + st.kind)',
    "getLaneArrow()",
    "for (const lat of [32.055, 32.061, 32.067, 32.0735, 32.083, 32.092, 32.101])",
    "for (const lon of [34.795, 34.7971])",
    "new THREE.PlaneGeometry(3.2, 4.6)",
  ]) if (!input.builderSource.includes(token)) errors.push(`ayalon builder lost required asphalt/marking/sign token: ${token}`);

  for (const token of [
    "export function getAyalonRoad()",
    "return kits.get(8);",
    'if (trackId === "ayalon") return loadLane(8);',
    "L.loadAsync(`/game/asphalt-${n}.png`)",
  ]) if (!input.roadAssetSource.includes(token)) errors.push(`road-assets lost required Ayalon asphalt token: ${token}`);

  for (const token of [
    '"gantry-kibbutz-galuyot"',
    '"stn-galuyot"',
    '"dest-rail"',
    '"speed90"',
    "L.loadAsync(`/game/sign-${k}.png`)",
  ]) if (!input.signAssetSource.includes(token)) errors.push(`sign-assets lost required Ayalon sign token: ${token}`);

  if (!input.walkAssetSource.includes('loadAsync("/game/sidewalk.png")')) errors.push("walk-assets lost sidewalk texture token");
  if (!input.arrowAssetSource.includes('loadAsync("/game/lane-arrow.png")')) errors.push("arrow-assets lost lane-arrow texture token");

  for (const token of [
    "export const AYALON_LANES = 8",
    "export const AYALON_SIDEWALK_PRESENT = false",
    "export const AYALON_CHEVRON_COUNT = 48",
    "export const AYALON_INTERCHANGE_SPEED_SIGN = \"speed90\"",
    "export const AYALON_GIS_CLAIM = false",
    "export const AYALON_OWNER_FREEZE = false",
  ]) if (!input.asphaltSource.includes(token)) errors.push(`ayalon-asphalt lock lost required token: ${token}`);

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.track_source_changes !== 0 || manifest.preservation?.world_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-029 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-032 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-032" || manifest.deferred_boundary?.rsh_030_authorized !== true || manifest.deferred_boundary?.rsh_030_started !== true || manifest.deferred_boundary?.rsh_031_authorized !== true || manifest.deferred_boundary?.rsh_031_started !== true) errors.push("RSH-032 deferred boundary changed");

  return {
    errors,
    trackId: manifest.asphalt?.id,
    lanes: manifest.asphalt?.lanes,
    sidewalkPresent: manifest.asphalt?.sidewalk_present,
    gantryCount: manifest.asphalt?.gantry_count,
    stationGantryCount: manifest.asphalt?.station_gantry_count,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateAyalonAsphalt();
  if (result.errors.length) {
    console.error(`ayalon-asphalt fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`ayalon-asphalt ok: ${result.trackId}; ${result.lanes} lanes; sidewalks ${result.sidewalkPresent}; ${result.gantryCount} gantries; ${result.stationGantryCount} station gantries; RSH-031 deferred`);
}
