#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "15791aebd6c059901ccd00ede5379f5d9db65d98ad77c73a4f4838995fde12a5";
export const EXPECTED_BUDGETS_SHA256 = "c51a8040c9179ff6a5290ed39249eb7c38d1cd14dc0143982cc594801c421990";
export const EXPECTED_INDEX_SHA256 = "e42d3d332658d406a3f24c929bbdfd02fd0ab04223b3b755bb04073a832e9609";
export const EXPECTED_CONTRACT_SHA256 = "e348077a921754f5c49b55c8a7937db6f0824bb6d6ecd85d64227fe28adc5548";
export const EXPECTED_LIVE_CACHE_SHA256 = "6aa9afd836425125fe724db169c5d584647cd4c8ec75c7ed89f8f7c95ca39b6f";
export const EXPECTED_CACHE_SMOKE_SHA256 = "ae0d6489306108d47a3c26d08c4e62257b34751f09212c3e0ff6e5442a0dbd89";
export const EXPECTED_CHECKER_TEST_SHA256 = "ee50c9ec8295d41f3e2c2b5f96132c76cfe6ed4c9cd6b7be4f0923b57991a6b6";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_BUDGET_DIGEST_SHA256 = "1044f257c7a8154be8cccf55929ab4367b85d733ee74e98c875751f9718d3cd7";
export const EXPECTED_FREEZE_DIGEST_SHA256 = "9b7a9ffa0ed5835294f11c3f941d40abf015d85c76c03f2e9e94403bd08b5098";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";
export const EXPECTED_QUALITY_PROFILES_SHA256 = "566b1b15cbe67e4a9d6c8c4d671b8f5b29f036f38e0d3815616b59c3b3706a0a";
export const EXPECTED_STREAM_FLAG_SHA256 = "725fa71482e7d45fbe92bbe3dcd6d90feed05bd58f2b4f7fa45e815f4bad3f7f";

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function sha256File(path) { return sha256(readFileSync(path)); }
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
    return execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" }).split("\0").filter(Boolean).sort();
  } catch { return walk(fromRoot()); }
}

export function canonicalBudgetDigest() {
  return [
    "cache_paths=/game/,/basis/",
    "cache_control=public, max-age=31536000, immutable",
    "html_cache_control=no-cache",
    "asset_streaming_gltf=false",
    "mesh_streaming=false",
    "streaming_music=false",
    "draw_call_target=80",
    "production_finishnow_forbidden=true",
    "leak_cycles_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}

export function readPerfBudgetInputs() {
  return {
    manifestSource: readFileSync(fromRoot("PERF-BUDGETS-MANIFEST.json"), "utf8"),
    budgetsSource: readFileSync(fromRoot("src", "game", "perf-budgets", "budgets.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "perf-budgets", "index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-039-PERF-BUDGETS-CONTRACT.md"), "utf8"),
    liveCacheSource: readFileSync(fromRoot("server", "middleware", "game-cache.ts"), "utf8"),
    cacheSmokeSource: readFileSync(fromRoot("scripts", "cache-headers-smoke.mjs"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-perf-budgets.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    freezeSource: readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"),
    findingsSource: readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8"),
    hudSource: readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8"),
    qualitySource: readFileSync(fromRoot("src", "game", "quality-profiles", "profiles.ts"), "utf8"),
    streamFlagSource: readFileSync(fromRoot("src", "game", "stream-flag.ts"), "utf8"),
    audioManifestSource: readFileSync(fromRoot("AUDIO-HUD-INPUT-MANIFEST.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validatePerfBudgets(overrides = {}) {
  const input = { ...readPerfBudgetInputs(), ...overrides };
  const errors = [];
  let manifest, freeze, audio;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
    audio = JSON.parse(input.audioManifestSource);
  } catch (error) {
    return { errors: [`RSH-039 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("perf-budgets manifest differs from the reviewed RSH-039 authority");
  const identities = {
    budgets_source_sha256: [input.budgetsSource, EXPECTED_BUDGETS_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    live_cache_source_sha256: [input.liveCacheSource, EXPECTED_LIVE_CACHE_SHA256],
    cache_smoke_source_sha256: [input.cacheSmokeSource, EXPECTED_CACHE_SMOKE_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    stream_flag_source_sha256: [input.streamFlagSource, EXPECTED_STREAM_FLAG_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalBudgetDigest()) !== EXPECTED_BUDGET_DIGEST_SHA256 || manifest.identities?.budget_digest_sha256 !== EXPECTED_BUDGET_DIGEST_SHA256) errors.push("budget digest identity changed");
  if (manifest.unit !== "RSH-039") errors.push("RSH-039 unit identity changed");
  if (JSON.stringify(manifest.lock?.cache_paths) !== '["/game/","/basis/"]') errors.push("cache paths changed");
  if (manifest.lock?.cache_max_age_s !== 31536000) errors.push("cache max-age changed");
  if (manifest.lock?.html_cache_control !== "no-cache") errors.push("html cache changed");
  if (manifest.lock?.asset_streaming_gltf !== false || manifest.lock?.mesh_streaming !== false || manifest.lock?.streaming_music !== false) errors.push("streaming budget changed");
  if (manifest.lock?.draw_call_target !== 80) errors.push("draw-call target changed");
  if (manifest.lock?.production_finishnow_forbidden !== true) errors.push("production finishNow budget changed");
  if (manifest.lock?.leak_cycles_enforced !== false) errors.push("RSH-039 must not enforce leak cycles");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-039 must not claim a real-device baseline");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-039 must not claim GIS accuracy, owner freeze or public distribution");
  if (!/export const BUDGETS_DEFINED = true/.test(input.budgetsSource)) errors.push("budgets defined token missing");
  if (!/export const LEAK_CYCLES_ENFORCED = false/.test(input.budgetsSource)) errors.push("leak-cycle token missing");
  if (!/from "\.\/budgets"/.test(input.indexSource)) errors.push("perf-budgets index no longer re-exports budgets");
  if (!/path\.startsWith\("\/game\/"\)/.test(input.liveCacheSource) || !/path\.startsWith\("\/basis\/"\)/.test(input.liveCacheSource)) errors.push("live cache paths changed");
  if (!/max-age=31536000/.test(input.liveCacheSource) || !/immutable/.test(input.liveCacheSource)) errors.push("live cache-control changed");
  if (!/max-age=31536000/.test(input.cacheSmokeSource) || !/no-cache/.test(input.cacheSmokeSource)) errors.push("cache smoke contract changed");
  if (audio.lock?.streaming_music !== false) errors.push("streaming music budget changed");
  if (!/export const MESH_STREAMING = false/.test(input.streamFlagSource)) errors.push("live stream-flag MESH_STREAMING is not false");
  if (sha256(input.hudSource) !== EXPECTED_HUD_SHA256) errors.push("HUD source drifted");
  if (sha256(input.qualitySource) !== EXPECTED_QUALITY_PROFILES_SHA256) errors.push("quality-profile lock drifted");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN until a real-device baseline exists");
  if (!/\| P2-09 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-09 must stay OPEN until a production JS/asset byte-size check exists");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-039 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-043 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-043" || manifest.deferred_boundary?.rsh_040_authorized !== true || manifest.deferred_boundary?.rsh_041_authorized !== true || manifest.deferred_boundary?.rsh_042_authorized !== true || manifest.deferred_boundary?.rsh_043_authorized !== false || manifest.deferred_boundary?.rsh_040_started !== true || manifest.deferred_boundary?.rsh_041_started !== true || manifest.deferred_boundary?.rsh_042_started !== true || manifest.deferred_boundary?.rsh_043_started !== false) errors.push("RSH-043 deferred boundary changed");
  return { errors, locked: errors.length === 0, cacheMaxAge: 31536000 };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validatePerfBudgets();
  if (result.errors.length) {
    console.error(`perf-budgets fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`perf-budgets ok: cache/streaming/draw-call budgets locked; RSH-043 deferred`);
}
