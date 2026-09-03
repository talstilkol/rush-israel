#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";
import { stripRsh033Overlay } from "./rsh033-overlay.mjs";

export const EXPECTED_MANIFEST_SHA256 = "d2822b3a668f15b26cdfa9b92bdd50fbc296019980d7f129b3e8229cd15fec01";
export const EXPECTED_NIGHT_SHA256 = "9538e17393b21728628fb2d55b2ea697a02f425d17cec8804380d3d8cf335914";
export const EXPECTED_INDEX_SHA256 = "27a9aec7e8fa3259fcbc44ae876712206510e651830ba35bb9738665d78728c8";
export const EXPECTED_SKY_ASSETS_SHA256 = "7b3eaf34c76bb6ea0e7305e5a6ac8f151c4ed5497e2640e5ab95a103b6c288c4";
export const EXPECTED_POSTFX_SHA256 = "c847b0fdfe1eb5fd30322a3723900e8675b31791b0d5edb71c47d31ce630e761";
export const EXPECTED_ENVIRONMENT_SHA256 = "a4471989af161d1e9d195cf1b9972c3ba4b6a9e85d09a1d9c60a9beb309b69a2";
export const EXPECTED_COLOR_SHA256 = "4ce598ea500ee8ebce8bdc6b03bfa2d719dc31a9880bec9741758b9c67e9681c";
export const EXPECTED_WORLD_SHA256 = "b750d1ffc51a34a5b5d557e821577f6c679cef903c3b682514b03d52078b3fdc";
export const EXPECTED_ENGINE_SHA256 = "6a592288cd778922b32bc918f63fd865a4b41312ce07130a61214014fa533c8b";
export const EXPECTED_ADAPTER_SHA256 = "947ca69a89f12550a4ba5c631f2004598dec8849368a762b29ed9d681a2d7132";
export const EXPECTED_MESH_SHA256 = "b89ec24ddb76a8ab362b036aa6d97a02484d5f305fbdc8f7b1452eea0e92aca3";
export const EXPECTED_PHYSICS_SHA256 = "cbff35aa2e2e4b509decf38e9f1ca3d262667675af81e0352ba02f460f5723c1";
export const EXPECTED_DAYLIGHT_SHA256 = "362f8c59468b353d7e20accc58d7527baea800bed48e3968061af07780ef0a27";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_CHECKER_TEST_SHA256 = "3458a96386587ab797d0778b464aab245bfe7acd9eccdf2dd6efd3c2f283f2f4";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_NIGHT_DIGEST_SHA256 = "31238c98dbb76f00c1419264e66a6eefbd91d5b732765fe92311d4345b794808";
export const EXPECTED_HEADLIGHT_DIGEST_SHA256 = "a843a8133ce4585a054203d132a257356ba30492604240c53281349265c4e790";
export const EXPECTED_WEATHER_DIGEST_SHA256 = "d93853cd0b8b050175139c84c11f87af9f158d6c5028a5f2f246301ee4366001";
export const EXPECTED_SKY_NIGHT_PNG_SHA256 = "3868cec9a4c9027f2acbc7bd9da2b59d518bf2e7e3617630d7ab5e56049ccdb9";

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

export function canonicalNightDigest() {
  return [
    "look=night",
    "exposure=1.22",
    "wetness=0.22",
    "night=1",
    "vis=0.9",
    "nightrain=1.18/0.7/1/0.76",
    "rain_look=0.58/1/0.08/0.55",
    "hemi=6a88b0/2a241c/0.52",
    "dir=c8d4e8/0.38",
    "fill=ffc070/0.48",
    "ambient=4a6080/0.28",
    "env_intensity_boot=0.42",
    "env_intensity_upgrade=0.52",
    "fog_city_night=0.000045/10000/2a4058",
    "background=182436",
    "clock=0.92",
    "hdri=false",
    "default_boot=day",
  ].join("\n") + "\n";
}

export function canonicalHeadlightDigest() {
  return [
    "spot=fff1c8/28/48/0.5/0.68/1.05",
    "shadow=256/-0.00025/0.6/42",
    "emissive_night=5.2",
    "emissive_day=0.85",
    "glow_night=0.78",
    "glow_day=0.16",
    "pool=5.4/0.88",
    "env_night=1.15",
    "env_day=1.4",
    "lamps=10/ffc070/200/44/0.9/0.65/1.2",
    "neon=42/16/2",
  ].join("\n") + "\n";
}

export function canonicalWeatherDigest() {
  return [
    "ids=clear,rain,storm,hamsin",
    "default=clear",
    "clear=1/1/1/0/1",
    "rain=0.78/0.72/1.42/0.22/0.82",
    "storm=0.62/0.55/1.7/0.4/0.62",
    "hamsin=0.9/0.84/1.12/0/0.7",
    "precip=560/900/640/720/280",
    "sky_night=/game/sky-night.png",
    "sky_size=1024x512",
    "stars=80",
    "png=3868cec9a4c9027f2acbc7bd9da2b59d518bf2e7e3617630d7ab5e56049ccdb9",
    "ibl_night=tiny_pmrem",
    "ibl_bg=182436",
    "ibl_hemi=4a6080/1a1410/0.55",
    "ibl_sun=a8c0e0/0.32",
    "ibl_disc=false",
    "sigma=0.04",
  ].join("\n") + "\n";
}

export function readNightWeatherInputs() {
  return {
    manifestSource: readFileSync(fromRoot("NIGHT-WEATHER-MANIFEST.json"), "utf8"),
    nightSource: readFileSync(fromRoot("src", "game", "ayalon-night", "night.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-night", "index.ts"), "utf8"),
    skyAssetsSource: readFileSync(fromRoot("src", "game", "sky-assets.ts"), "utf8"),
    postfxSource: readFileSync(fromRoot("src", "game", "postfx.ts"), "utf8"),
    environmentSource: readFileSync(fromRoot("src", "rendering", "EnvironmentState.ts"), "utf8"),
    colorSource: readFileSync(fromRoot("src", "rendering", "ColorPipeline.ts"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    engineSource: readFileSync(fromRoot("src", "game", "engine.ts"), "utf8"),
    adapterSource: readFileSync(fromRoot("src", "game", "engine", "rendering-adapter.ts"), "utf8"),
    meshSource: readFileSync(fromRoot("src", "game", "car-mesh.ts"), "utf8"),
    physicsSource: readFileSync(fromRoot("src", "game", "physics.ts"), "utf8"),
    daylightSource: readFileSync(fromRoot("src", "game", "ayalon-light", "daylight.ts"), "utf8"),
    tracksSource: readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-night-weather.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    skyNightPng: readFileSync(fromRoot("public", "game", "sky-night.png")),
    repositoryFiles: trackedFiles(),
  };
}

export function validateNightWeather(overrides = {}) {
  const input = { ...readNightWeatherInputs(), ...overrides };
  const errors = [];
  let manifest, lock, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-032 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("night-weather manifest differs from the reviewed RSH-032 authority");
  const identities = {
    night_source_sha256: [input.nightSource, EXPECTED_NIGHT_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    sky_assets_source_sha256: [input.skyAssetsSource, EXPECTED_SKY_ASSETS_SHA256],
    postfx_source_sha256: [input.postfxSource, EXPECTED_POSTFX_SHA256],
    environment_source_sha256: [input.environmentSource, EXPECTED_ENVIRONMENT_SHA256],
    color_source_sha256: [input.colorSource, EXPECTED_COLOR_SHA256],
    world_source_sha256: [input.worldSource, EXPECTED_WORLD_SHA256],
    engine_source_sha256: [input.engineSource, EXPECTED_ENGINE_SHA256],
    adapter_source_sha256: [input.adapterSource, EXPECTED_ADAPTER_SHA256],
    mesh_source_sha256: [input.meshSource, EXPECTED_MESH_SHA256],
    physics_source_sha256: [stripRsh033Overlay("src/game/physics.ts", input.physicsSource), EXPECTED_PHYSICS_SHA256],
    daylight_source_sha256: [input.daylightSource, EXPECTED_DAYLIGHT_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-032" || manifest.night?.look !== "night") errors.push("RSH-032 night identity changed");
  if (manifest.night?.hdri !== false || manifest.ibl?.hdri !== false || manifest.ibl?.real_sky_ibl !== false) errors.push("Version 1 night must stay non-HDRI tiny-PMREM");
  if (manifest.night?.gis_claim !== false || manifest.night?.owner_freeze !== false) errors.push("RSH-032 must not claim GIS accuracy or owner freeze");
  if (manifest.night?.default_boot !== false || manifest.weather?.default !== "clear") errors.push("Version 1 default boot must stay day/clear");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-032");

  const nightDigest = canonicalNightDigest();
  const headlightDigest = canonicalHeadlightDigest();
  const weatherDigest = canonicalWeatherDigest();
  if (sha256(nightDigest) !== EXPECTED_NIGHT_DIGEST_SHA256 || manifest.night?.night_sha256 !== EXPECTED_NIGHT_DIGEST_SHA256) errors.push("night digest changed");
  if (sha256(headlightDigest) !== EXPECTED_HEADLIGHT_DIGEST_SHA256 || manifest.headlights?.headlight_sha256 !== EXPECTED_HEADLIGHT_DIGEST_SHA256) errors.push("headlight digest changed");
  if (sha256(weatherDigest) !== EXPECTED_WEATHER_DIGEST_SHA256 || manifest.weather?.weather_sha256 !== EXPECTED_WEATHER_DIGEST_SHA256) errors.push("weather digest changed");

  if (sha256(input.skyNightPng) !== EXPECTED_SKY_NIGHT_PNG_SHA256 || manifest.sky?.png_sha256 !== EXPECTED_SKY_NIGHT_PNG_SHA256) errors.push("sky-night.png hash changed");

  for (const token of [
    'night: { look: "night", exposure: 1.22, wetness: 0.22, night: 1, vis: 0.9 }',
    'nightrain: { look: "nightrain", exposure: 1.18, wetness: 0.7, night: 1, vis: 0.76 }',
    'rain: { look: "rain", exposure: 0.58, wetness: 1, night: 0.08, vis: 0.55 }',
    "city: { day: 0.00001, night: 0.000045, far: 10000, dayCol: 0x6eb4dc, nightCol: 0x2a4058 }",
  ]) if (!input.environmentSource.includes(token)) errors.push(`EnvironmentState lost required night token: ${token}`);

  for (const token of [
    "night ? 0x182436 : 0x3a9ae0",
    "night ? 0x4a6080 : 0xc8e8ff, night ? 0x1a1410 : 0xb89868, night ? 0.55 : 1.2",
    "night ? 0xa8c0e0 : 0xffe8c4, night ? 0.32 : 1.2",
    "if (!night)",
    "pmrem.fromScene(tmp, 0.04)",
  ]) if (!input.postfxSource.includes(token)) errors.push(`postfx lost required night IBL token: ${token}`);

  for (const token of [
    "hemi.color.setHex(isNight ? 0x6a88b0 : 0xa8c8e8)",
    "hemi.groundColor.setHex(isNight ? 0x2a241c : 0x4a5248)",
    "hemi.intensity = isNight ? 0.52 : 0.68",
    "dir.color.setHex(isNight ? 0xc8d4e8 : 0xfff0d0)",
    "dir.intensity = isNight ? 0.38 : 1.12",
    "fill.color.setHex(isNight ? 0xffc070 : 0xc4d8f0)",
    "fill.intensity = isNight ? 0.48 : 0.28",
    "ambient.color.setHex(isNight ? 0x4a6080 : 0xb0c4d8)",
    "ambient.intensity = isNight ? 0.28 : 0.32",
    "const spot = new THREE.SpotLight(0xffc070, isNight ? 200 : 0, 44, 0.9, 0.65, 1.2)",
  ]) if (!input.worldSource.includes(token)) errors.push(`world lost required night token: ${token}`);

  for (const token of [
    "const skyNight = 0x182436",
    "this.scene.environmentIntensity = this.world.night ? 0.42 : 0.7",
    "const n = this.lite ? 280 : snow ? 720 : dust ? 640 : this.weather === \"storm\" ? 900 : 560",
  ]) if (!input.engineSource.includes(token)) errors.push(`engine lost required night/weather token: ${token}`);

  if (!input.adapterSource.includes("this.scene.environmentIntensity = this.world.night ? 0.52 : 0.88")) {
    errors.push("rendering-adapter lost required night env-intensity token");
  }

  for (const token of [
    "const spot = new THREE.SpotLight(0xfff1c8, 0, 48, 0.5, 0.68, 1.05)",
    "s.intensity = on ? 28 : 0",
    "vis.bodyMat.envMapIntensity = night ? 1.15 : 1.4",
    "(h.material as THREE.MeshPhysicalMaterial).emissiveIntensity = night ? 5.2 : 0.85",
    "(g.material as THREE.MeshBasicMaterial).opacity = night ? 0.78 : 0.16",
    "m.opacity = night ? 0.88 : 0",
  ]) if (!input.meshSource.includes(token)) errors.push(`car-mesh lost required headlight token: ${token}`);

  for (const token of [
    "clear: { long: 1, lat: 1, roll: 1, hydro: 0, vis: 1 }",
    "rain: { long: 0.78, lat: 0.72, roll: 1.42, hydro: 0.22, vis: 0.82 }",
    "storm: { long: 0.62, lat: 0.55, roll: 1.7, hydro: 0.4, vis: 0.62 }",
    "hamsin: { long: 0.9, lat: 0.84, roll: 1.12, hydro: 0, vis: 0.7 }",
  ]) if (!input.physicsSource.includes(token)) errors.push(`physics lost required weather token: ${token}`);

  for (const token of [
    "return skyAt(def, night ? 0.92 : 0.5, weather)",
    'if (weather === "rain")',
    'else if (weather === "storm")',
    'else if (weather === "hamsin")',
  ]) if (!input.tracksSource.includes(token)) errors.push(`tracks lost required night/weather sky token: ${token}`);

  for (const token of [
    'L.loadAsync("/game/sky-night.png")',
    "Baked gradient skies. Not HDRI.",
  ]) if (!input.skyAssetsSource.includes(token)) errors.push(`sky-assets lost required night token: ${token}`);

  for (const token of [
    "export const NIGHT_HDRI = false",
    "export const NIGHT_REAL_SKY_IBL = false",
    "export const NIGHT_LOOK_ID = \"night\"",
    "export const NIGHT_GIS_CLAIM = false",
    "export const NIGHT_OWNER_FREEZE = false",
    "export const NIGHT_DEFAULT_BOOT = false",
    "export const WEATHER_DEFAULT_BOOT = \"clear\"",
    "export const IBL_NIGHT_KIND = \"tiny_pmrem\"",
    "export const IBL_NIGHT_DISC = false",
  ]) if (!input.nightSource.includes(token)) errors.push(`ayalon-night lock lost required token: ${token}`);

  if (!input.daylightSource.includes("export const DAYLIGHT_LOOK_ID = \"summer14\"")) errors.push("RSH-031 daylight lock changed");

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.sky_assets_changes !== 0 || manifest.preservation?.postfx_changes !== 0 || manifest.preservation?.world_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.mesh_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-032 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-035 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-035" || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== true || manifest.deferred_boundary?.rsh_035_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== true || manifest.deferred_boundary?.rsh_035_started !== false) errors.push("RSH-035 deferred boundary changed");

  return {
    errors,
    look: manifest.night?.look,
    hdri: manifest.night?.hdri,
    weatherDefault: manifest.weather?.default,
    skyWidth: manifest.sky?.width,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateNightWeather();
  if (result.errors.length) {
    console.error(`night-weather fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`night-weather ok: look ${result.look}; HDRI ${result.hdri}; weather ${result.weatherDefault}; RSH-035 deferred`);
}
