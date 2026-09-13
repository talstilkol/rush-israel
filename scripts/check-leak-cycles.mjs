#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "5438db673b26645706a0e6145302533a4aa721c651de4f5cd70ace82f0cb923c";
export const EXPECTED_CYCLES_SHA256 = "b45b8e137ede67201a960d107f7f709296483bb154e5b03bb4463322ad5b60bd";
export const EXPECTED_INDEX_SHA256 = "976cbbc6513426f5272652d7f579bd2309a181478f0c089db23213006a4f5c11";
export const EXPECTED_CONTRACT_SHA256 = "130ef04232021e0cc47ed8380d9dc758a192e07674769bc304bb2c51fb031bf9";
export const EXPECTED_REGISTRY_SHA256 = "97a4d36cb120714df59c7f14c4218169b7ac05a9875be87089acdd96caeeed35";
export const EXPECTED_DISPOSE_OBJECT3D_SHA256 = "606e9905b68a2949d2d49407d5815672763b0252c41ffb36aa1484c8e3315264";
export const EXPECTED_SOAK_SHA256 = "a684508627830a4fff5030232ba36dd1b81df82b4924aa307f94116a5dc7df60";
export const EXPECTED_SOAK_SMOKE_SHA256 = "46f3c813263d2046771a918bdaa624c13ff42fdef580448764bfe6b45a6f33c2";
export const EXPECTED_CHECKER_TEST_SHA256 = "379c471867f98858f142642afea4fea210184d61e47c0758537533a0352a7139";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_LEAK_DIGEST_SHA256 = "d4a6b8abcdf23a734f40b96001a3146ae20056e4ef30536aada7052c943c69a2";
export const EXPECTED_FREEZE_DIGEST_SHA256 = "9b7a9ffa0ed5835294f11c3f941d40abf015d85c76c03f2e9e94403bd08b5098";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";
export const EXPECTED_QUALITY_PROFILES_SHA256 = "566b1b15cbe67e4a9d6c8c4d671b8f5b29f036f38e0d3815616b59c3b3706a0a";
export const EXPECTED_BUDGETS_SHA256 = "c51a8040c9179ff6a5290ed39249eb7c38d1cd14dc0143982cc594801c421990";
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

export function canonicalLeakDigest() {
  return [
    "enter_exit_cycles=20",
    "required_ci_cycles=2",
    "texture_delta_max=2",
    "geometry_delta_max=2",
    "dispose_all_idempotent=true",
    "context_loss_enforced=false",
    "soak_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}

export function readLeakCycleInputs() {
  return {
    manifestSource: readFileSync(fromRoot("LEAK-CYCLES-MANIFEST.json"), "utf8"),
    cyclesSource: readFileSync(fromRoot("src", "game", "leak-cycles", "cycles.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "leak-cycles", "index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-040-LEAK-CYCLES-CONTRACT.md"), "utf8"),
    registrySource: readFileSync(fromRoot("src", "rendering", "ResourceRegistry.ts"), "utf8"),
    disposeSource: readFileSync(fromRoot("src", "rendering", "disposeObject3D.ts"), "utf8"),
    soakSource: readFileSync(fromRoot("scripts", "soak-menu-race.mjs"), "utf8"),
    soakSmokeSource: readFileSync(fromRoot("scripts", "soak-smoke.mjs"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-leak-cycles.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    freezeSource: readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"),
    findingsSource: readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8"),
    hudSource: readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8"),
    qualitySource: readFileSync(fromRoot("src", "game", "quality-profiles", "profiles.ts"), "utf8"),
    budgetsSource: readFileSync(fromRoot("src", "game", "perf-budgets", "budgets.ts"), "utf8"),
    streamFlagSource: readFileSync(fromRoot("src", "game", "stream-flag.ts"), "utf8"),
    engineSource: readFileSync(fromRoot("src", "game", "engine.ts"), "utf8"),
    worldSource: readFileSync(fromRoot("src", "game", "world.ts"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateLeakCycles(overrides = {}) {
  const input = { ...readLeakCycleInputs(), ...overrides };
  const errors = [];
  let manifest, freeze;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
  } catch (error) {
    return { errors: [`RSH-040 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("leak-cycles manifest differs from the reviewed RSH-040 authority");
  const identities = {
    cycles_source_sha256: [input.cyclesSource, EXPECTED_CYCLES_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    registry_source_sha256: [input.registrySource, EXPECTED_REGISTRY_SHA256],
    dispose_object3d_source_sha256: [input.disposeSource, EXPECTED_DISPOSE_OBJECT3D_SHA256],
    soak_source_sha256: [input.soakSource, EXPECTED_SOAK_SHA256],
    soak_smoke_source_sha256: [input.soakSmokeSource, EXPECTED_SOAK_SMOKE_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalLeakDigest()) !== EXPECTED_LEAK_DIGEST_SHA256 || manifest.identities?.leak_digest_sha256 !== EXPECTED_LEAK_DIGEST_SHA256) errors.push("leak digest identity changed");
  if (manifest.unit !== "RSH-040") errors.push("RSH-040 unit identity changed");
  if (manifest.lock?.enter_exit_cycles !== 20) errors.push("enter-exit cycle count changed");
  if (manifest.lock?.required_ci_cycles !== 2) errors.push("required-CI soak-smoke cycle count changed");
  if (manifest.lock?.texture_delta_max !== 2 || manifest.lock?.geometry_delta_max !== 2) errors.push("leak delta budget changed");
  if (manifest.lock?.dispose_all_idempotent !== true) errors.push("disposeAll idempotence changed");
  if (manifest.lock?.context_loss_enforced !== false) errors.push("RSH-040 must not enforce context-loss recovery");
  if (manifest.lock?.soak_enforced !== false) errors.push("RSH-040 must not enforce the 30-minute soak");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-040 must not claim a real-device baseline");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-040 must not claim GIS accuracy, owner freeze or public distribution");
  if (!/export const LEAK_CYCLES_DEFINED = true/.test(input.cyclesSource)) errors.push("leak-cycles defined token missing");
  if (!/export const CONTEXT_LOSS_ENFORCED = false/.test(input.cyclesSource)) errors.push("context-loss token missing");
  if (!/export const SOAK_ENFORCED = false/.test(input.cyclesSource)) errors.push("soak token missing");
  if (!/from "\.\/cycles"/.test(input.indexSource)) errors.push("leak-cycles index no longer re-exports cycles");
  if (!/if \(this\.dead\)/.test(input.registrySource) || !/alreadyDisposed: true/.test(input.registrySource)) errors.push("ResourceRegistry disposeAll is no longer idempotent");
  if (!/Textures are intentionally excluded/.test(input.disposeSource)) errors.push("Object3D disposal no longer excludes shared textures");
  if (!/const CYCLES = Number\(process\.env\.SOAK_CYCLES \|\| 20\)/.test(input.soakSource)) errors.push("20-cycle soak harness changed");
  if (!/dTex > 2/.test(input.soakSource) || !/dGeo > 2/.test(input.soakSource)) errors.push("soak leak deltas changed");
  if (!/SOAK_CYCLES \?\?= "2"/.test(input.soakSmokeSource)) errors.push("required-CI soak-smoke cycle pin changed");
  if (!/this\.leases\.disposeAll\(\)/.test(input.engineSource) || !/this\.world\?\.dispose\(\)/.test(input.engineSource)) errors.push("engine dispose order changed");
  if (!/disposeObject3D\(this\.scene, tracker\)/.test(input.engineSource)) errors.push("engine no longer disposes the scene graph");
  if (!/if \(disposed\) return;/.test(input.worldSource) || !/for \(let index = bag\.length - 1/.test(input.worldSource)) errors.push("world dispose bag loop changed");
  if (sha256(input.hudSource) !== EXPECTED_HUD_SHA256) errors.push("HUD source drifted");
  if (sha256(input.qualitySource) !== EXPECTED_QUALITY_PROFILES_SHA256) errors.push("quality-profile lock drifted");
  if (sha256(input.budgetsSource) !== EXPECTED_BUDGETS_SHA256) errors.push("perf-budget lock drifted");
  if (sha256(input.streamFlagSource) !== EXPECTED_STREAM_FLAG_SHA256) errors.push("live stream-flag drifted");
  if (!/export const MESH_STREAMING = false/.test(input.streamFlagSource)) errors.push("live stream-flag MESH_STREAMING is not false");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN until a real-device baseline exists");
  if (!/\| P2-09 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-09 must stay OPEN until a production JS/asset byte-size check exists");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-040 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-043 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-043" || manifest.deferred_boundary?.rsh_041_authorized !== true || manifest.deferred_boundary?.rsh_042_authorized !== true || manifest.deferred_boundary?.rsh_043_authorized !== false || manifest.deferred_boundary?.rsh_041_started !== true || manifest.deferred_boundary?.rsh_042_started !== true || manifest.deferred_boundary?.rsh_043_started !== false) errors.push("RSH-043 deferred boundary changed");
  return { errors, locked: errors.length === 0, cycles: 20 };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateLeakCycles();
  if (result.errors.length) {
    console.error(`leak-cycles fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`leak-cycles ok: 20 enter-exit cycles locked; RSH-043 deferred`);
}
