#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "d9c5faacbdf50ed0aaf967461ebd6296c1cb8351862b570a61d48652ea5422a8";
export const EXPECTED_DAYLIGHT_SHA256 = "362f8c59468b353d7e20accc58d7527baea800bed48e3968061af07780ef0a27";
export const EXPECTED_INDEX_SHA256 = "97d09b015750529f809b751e0026e7ba9d9e912466803b7ac70a0f6bb18db461";
export const EXPECTED_SKY_ASSETS_SHA256 = "7b3eaf34c76bb6ea0e7305e5a6ac8f151c4ed5497e2640e5ab95a103b6c288c4";
export const EXPECTED_POSTFX_SHA256 = "c847b0fdfe1eb5fd30322a3723900e8675b31791b0d5edb71c47d31ce630e761";
export const EXPECTED_ENVIRONMENT_SHA256 = "a4471989af161d1e9d195cf1b9972c3ba4b6a9e85d09a1d9c60a9beb309b69a2";
export const EXPECTED_COLOR_SHA256 = "4ce598ea500ee8ebce8bdc6b03bfa2d719dc31a9880bec9741758b9c67e9681c";
export const EXPECTED_WORLD_SHA256 = "b750d1ffc51a34a5b5d557e821577f6c679cef903c3b682514b03d52078b3fdc";
export const EXPECTED_ENGINE_SHA256 = "6a592288cd778922b32bc918f63fd865a4b41312ce07130a61214014fa533c8b";
export const EXPECTED_ADAPTER_SHA256 = "947ca69a89f12550a4ba5c631f2004598dec8849368a762b29ed9d681a2d7132";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_CHECKER_TEST_SHA256 = "0143d90da89b9bed102b1c4755748960d77e0f6a378cda1aeaedffefd33aaad2";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_DAYLIGHT_DIGEST_SHA256 = "bcb9d3a3026bcff45ddbf4122b2ef952f68f9e1098f0813cde1e5864775592f8";
export const EXPECTED_SKY_DIGEST_SHA256 = "740469181a62335330770e0eaf3cbf25358a1abca8a2ad9e69671ed605406cb6";
export const EXPECTED_IBL_DIGEST_SHA256 = "d3387b77aaf7e782f05b3a4480c0159d0d1bf92d2aff0166fc214b9bfbb232e0";
export const EXPECTED_SKY_DAY_PNG_SHA256 = "0385c7aa2320e36b3a7b07cadc713269d30ad6f5810d9ee071abd10c95c78133";

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

export function canonicalDaylightDigest() {
  return [
    "look=summer14",
    "exposure=0.56",
    "wetness=0.18",
    "night=0",
    "vis=1",
    "hemi=a8c8e8/4a5248/0.68",
    "dir=fff0d0/1.12",
    "fill=c4d8f0/0.28",
    "ambient=b0c4d8/0.32",
    "env_intensity_boot=0.7",
    "env_intensity_upgrade=0.88",
    "fog_city_day=0.00001/10000/6eb4dc",
    "background=2f8fd4",
    "color=srgb+aces",
    "hdri=false",
  ].join("\n") + "\n";
}

export function canonicalSkyDigest() {
  return [
    "asset=/game/sky-day.png",
    "size=1024x512",
    "mapping=EquirectangularReflectionMapping",
    "colorspace=SRGBColorSpace",
    "anisotropy=4",
    "hdri=false",
    "procedural_sky_visible=false",
    "noon_clock=0.5",
    "noon_elevation=64",
    "noon_turbidity=1.85",
    "noon_rayleigh=0.72",
    "noon_mie=0.0018",
    "noon_mie_g=0.55",
    "noon_exposure=0.94",
    "png=0385c7aa2320e36b3a7b07cadc713269d30ad6f5810d9ee071abd10c95c78133",
  ].join("\n") + "\n";
}

export function canonicalIblDigest() {
  return [
    "kind=tiny_pmrem",
    "hdri=false",
    "real_sky_ibl=false",
    "background=3a9ae0",
    "hemi=c8e8ff/b89868/1.2",
    "sun=ffe8c4/1.2",
    "sun_pos=6,14,4",
    "disc=fff6d8/2.4/10,16,7",
    "ground=3a4248/22",
    "sigma=0.04",
    "day_only=true",
  ].join("\n") + "\n";
}

export function readDaylightSkyInputs() {
  return {
    manifestSource: readFileSync(fromRoot("DAYLIGHT-SKY-MANIFEST.json"), "utf8"),
    daylightSource: readFileSync(fromRoot("src", "game", "ayalon-light", "daylight.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "ayalon-light", "index.ts"), "utf8"),
    skyAssetsSource: readFileSync(fromRoot("src", "game", "sky-assets.ts"), "utf8"),
    postfxSource: readFileSync(fromRoot("src", "game", "postfx.ts"), "utf8"),
    environmentSource: readFileSync(fromRoot("src", "rendering", "EnvironmentState.ts"), "utf8"),
    colorSource: readFileSync(fromRoot("src", "rendering", "ColorPipeline.ts"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    engineSource: readFileSync(fromRoot("src", "game", "engine.ts"), "utf8"),
    adapterSource: readFileSync(fromRoot("src", "game", "engine", "rendering-adapter.ts"), "utf8"),
    tracksSource: readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8"),
    lockSource: readFileSync(fromRoot("golden-baseline", "ayalon.lock"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-daylight-sky.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    skyDayPng: readFileSync(fromRoot("public", "game", "sky-day.png")),
    repositoryFiles: trackedFiles(),
  };
}

export function validateDaylightSky(overrides = {}) {
  const input = { ...readDaylightSkyInputs(), ...overrides };
  const errors = [];
  let manifest, lock, asset;
  try {
    manifest = JSON.parse(input.manifestSource);
    lock = JSON.parse(input.lockSource);
    asset = JSON.parse(input.assetSource);
  } catch (error) {
    return { errors: [`RSH-031 authority JSON invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("daylight-sky manifest differs from the reviewed RSH-031 authority");
  const identities = {
    daylight_source_sha256: [input.daylightSource, EXPECTED_DAYLIGHT_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    sky_assets_source_sha256: [input.skyAssetsSource, EXPECTED_SKY_ASSETS_SHA256],
    postfx_source_sha256: [input.postfxSource, EXPECTED_POSTFX_SHA256],
    environment_source_sha256: [input.environmentSource, EXPECTED_ENVIRONMENT_SHA256],
    color_source_sha256: [input.colorSource, EXPECTED_COLOR_SHA256],
    world_source_sha256: [input.worldSource, EXPECTED_WORLD_SHA256],
    engine_source_sha256: [input.engineSource, EXPECTED_ENGINE_SHA256],
    adapter_source_sha256: [input.adapterSource, EXPECTED_ADAPTER_SHA256],
    ayalon_lock_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }

  if (manifest.unit !== "RSH-031" || manifest.daylight?.look !== "summer14") errors.push("RSH-031 daylight identity changed");
  if (manifest.daylight?.hdri !== false || manifest.ibl?.hdri !== false || manifest.ibl?.real_sky_ibl !== false) errors.push("Version 1 daylight must stay non-HDRI tiny-PMREM");
  if (manifest.daylight?.gis_claim !== false || manifest.daylight?.owner_freeze !== false) errors.push("RSH-031 must not claim GIS accuracy or owner freeze");
  if (lock.lock !== 11) errors.push("ayalon.lock generation changed in RSH-031");

  const daylightDigest = canonicalDaylightDigest();
  const skyDigest = canonicalSkyDigest();
  const iblDigest = canonicalIblDigest();
  if (sha256(daylightDigest) !== EXPECTED_DAYLIGHT_DIGEST_SHA256 || manifest.daylight?.daylight_sha256 !== EXPECTED_DAYLIGHT_DIGEST_SHA256) errors.push("daylight digest changed");
  if (sha256(skyDigest) !== EXPECTED_SKY_DIGEST_SHA256 || manifest.sky?.sky_sha256 !== EXPECTED_SKY_DIGEST_SHA256) errors.push("sky digest changed");
  if (sha256(iblDigest) !== EXPECTED_IBL_DIGEST_SHA256 || manifest.ibl?.ibl_sha256 !== EXPECTED_IBL_DIGEST_SHA256) errors.push("IBL digest changed");

  if (sha256(input.skyDayPng) !== EXPECTED_SKY_DAY_PNG_SHA256 || manifest.sky?.png_sha256 !== EXPECTED_SKY_DAY_PNG_SHA256) errors.push("sky-day.png hash changed");

  for (const token of [
    "tex.mapping = THREE.EquirectangularReflectionMapping",
    "tex.colorSpace = THREE.SRGBColorSpace",
    "tex.anisotropy = 4",
    'L.loadAsync("/game/sky-day.png")',
    "Baked gradient skies. Not HDRI.",
  ]) if (!input.skyAssetsSource.includes(token)) errors.push(`sky-assets lost required daylight token: ${token}`);

  for (const token of [
    "Tiny PMREM from a 3-object scene. Not an HDRI. Not IBL from a real sky.",
    "night ? 0x182436 : 0x3a9ae0",
    "night ? 0x4a6080 : 0xc8e8ff, night ? 0x1a1410 : 0xb89868, night ? 0.55 : 1.2",
    "night ? 0xa8c0e0 : 0xffe8c4, night ? 0.32 : 1.2",
    "sun.position.set(6, 14, 4)",
    "color: 0xfff6d8",
    "disc.position.set(10, 16, 7)",
    "color: 0x3a4248",
    "pmrem.fromScene(tmp, 0.04)",
  ]) if (!input.postfxSource.includes(token)) errors.push(`postfx lost required IBL token: ${token}`);

  for (const token of [
    'summer14: { look: "summer14", exposure: 0.56, wetness: 0.18, night: 0, vis: 1 }',
    "city: { day: 0.00001, night: 0.000045, far: 10000, dayCol: 0x6eb4dc, nightCol: 0x2a4058 }",
  ]) if (!input.environmentSource.includes(token)) errors.push(`EnvironmentState lost required daylight token: ${token}`);

  for (const token of [
    "gl.outputColorSpace = THREE.SRGBColorSpace",
    "gl.toneMapping = THREE.ACESFilmicToneMapping",
  ]) if (!input.colorSource.includes(token)) errors.push(`ColorPipeline lost required token: ${token}`);

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
    "sky.visible = false",
  ]) if (!input.worldSource.includes(token)) errors.push(`world lost required daylight token: ${token}`);

  for (const token of [
    "this.scene.environmentIntensity = this.world.night ? 0.42 : 0.7",
    "0x2f8fd4",
    "LOOKS.summer14.exposure",
  ]) if (!input.engineSource.includes(token)) errors.push(`engine lost required daylight token: ${token}`);

  if (!input.adapterSource.includes("this.scene.environmentIntensity = this.world.night ? 0.52 : 0.88")) {
    errors.push("rendering-adapter lost required daylight env-intensity token");
  }

  for (const token of [
    "elevation: 64, azimuth: az, turbidity: 1.85, rayleigh: 0.72, mieCoefficient: 0.0018, mieDirectionalG: 0.55, exposure: 0.94",
    "return skyAt(def, night ? 0.92 : 0.5, weather)",
  ]) if (!input.tracksSource.includes(token)) errors.push(`tracks lost required noon-sky token: ${token}`);

  for (const token of [
    "export const DAYLIGHT_HDRI = false",
    "export const DAYLIGHT_REAL_SKY_IBL = false",
    "export const DAYLIGHT_LOOK_ID = \"summer14\"",
    "export const DAYLIGHT_GIS_CLAIM = false",
    "export const DAYLIGHT_OWNER_FREEZE = false",
    "export const SKY_PROCEDURAL_VISIBLE = false",
    "export const IBL_KIND = \"tiny_pmrem\"",
  ]) if (!input.daylightSource.includes(token)) errors.push(`ayalon-light lock lost required token: ${token}`);

  if (asset.scope?.unverified_asset_files !== 66 || asset.scope?.public_distribution_authorized !== false || asset.truth_boundaries?.release_gates_green !== 0) errors.push("asset/distribution/release boundary changed");
  if (manifest.preservation?.sky_assets_changes !== 0 || manifest.preservation?.postfx_changes !== 0 || manifest.preservation?.world_changes !== 0 || manifest.preservation?.physics_changes !== 0 || manifest.preservation?.ayalon_lock_changes !== 0) errors.push("RSH-031 preservation counts changed");

  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-034 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-034" || manifest.deferred_boundary?.rsh_032_authorized !== true || manifest.deferred_boundary?.rsh_032_started !== true || manifest.deferred_boundary?.rsh_033_authorized !== true || manifest.deferred_boundary?.rsh_033_started !== true || manifest.deferred_boundary?.rsh_034_authorized !== false || manifest.deferred_boundary?.rsh_034_started !== false) errors.push("RSH-034 deferred boundary changed");

  return {
    errors,
    look: manifest.daylight?.look,
    hdri: manifest.daylight?.hdri,
    iblKind: manifest.ibl?.kind,
    skyWidth: manifest.sky?.width,
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}

if (isMainModule(import.meta.url)) {
  const result = validateDaylightSky();
  if (result.errors.length) {
    console.error(`daylight-sky fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`daylight-sky ok: look ${result.look}; HDRI ${result.hdri}; IBL ${result.iblKind}; RSH-034 deferred`);
}
