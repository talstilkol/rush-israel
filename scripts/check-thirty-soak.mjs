#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "5560c0dd1e4b68644cdd8c69a1be203015ef284e9f5dc88cacb3ee4c7226b4cb";
export const EXPECTED_SOAK_LOCK_SHA256 = "242c76268bed6f562fd58e191416f176b409fb44491ab4adc428ca43ff61031d";
export const EXPECTED_INDEX_SHA256 = "82c873fc3b39163ab45457afd0d2108375afe1dade24ae52699ddf4d6beab967";
export const EXPECTED_CONTRACT_SHA256 = "f51e2e48af14171f95bc3f7ebf7252ba9087f099975da4c52a8e367e98024bdd";
export const EXPECTED_LIVE_SOAK_SHA256 = "a684508627830a4fff5030232ba36dd1b81df82b4924aa307f94116a5dc7df60";
export const EXPECTED_SOAK_SMOKE_SHA256 = "46f3c813263d2046771a918bdaa624c13ff42fdef580448764bfe6b45a6f33c2";
export const EXPECTED_CONTEXT_RESTORE_SHA256 = "1f0095b6ec5c0aa704c04d42ca11b8798c1911b84fdcf1f739dad1764e41e54d";
export const EXPECTED_CHECKER_TEST_SHA256 = "3c0c5aa0aac428eb02567a6228f578eac7adb7b2a30101e1924fce9b3fa19f14";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_SOAK_DIGEST_SHA256 = "0676c73f186564cbf6b87c7a838707b1110581d60f5a251870fcf4226a5905b0";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";
export const EXPECTED_QUALITY_PROFILES_SHA256 = "566b1b15cbe67e4a9d6c8c4d671b8f5b29f036f38e0d3815616b59c3b3706a0a";
export const EXPECTED_BUDGETS_SHA256 = "c51a8040c9179ff6a5290ed39249eb7c38d1cd14dc0143982cc594801c421990";
export const EXPECTED_STREAM_FLAG_SHA256 = "725fa71482e7d45fbe92bbe3dcd6d90feed05bd58f2b4f7fa45e815f4bad3f7f";
export const EXPECTED_REGISTRY_SHA256 = "97a4d36cb120714df59c7f14c4218169b7ac05a9875be87089acdd96caeeed35";
export const EXPECTED_CYCLES_SHA256 = "b45b8e137ede67201a960d107f7f709296483bb154e5b03bb4463322ad5b60bd";
export const EXPECTED_LOOP_ADAPTER_SHA256 = "88d8f39ff363664cc0a0ab965f7d9a174377961b8683d0752b200769439262c8";

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

export function canonicalSoakDigest() {
  return [
    "soak_duration_s=1800",
    "required_ci_cycles=2",
    "enter_exit_cycles=20",
    "smoke_substitutes=false",
    "soak_enforced=true",
    "device_matrix_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}

export function readThirtySoakInputs() {
  return {
    manifestSource: readFileSync(fromRoot("THIRTY-SOAK-MANIFEST.json"), "utf8"),
    soakSource: readFileSync(fromRoot("src", "game", "thirty-soak", "soak.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "thirty-soak", "index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-042-THIRTY-SOAK-CONTRACT.md"), "utf8"),
    liveSoakSource: readFileSync(fromRoot("scripts", "soak-menu-race.mjs"), "utf8"),
    soakSmokeSource: readFileSync(fromRoot("scripts", "soak-smoke.mjs"), "utf8"),
    contextSource: readFileSync(fromRoot("src", "game", "context-loss", "restore.ts"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-thirty-soak.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    freezeSource: readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"),
    findingsSource: readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8"),
    hudSource: readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8"),
    qualitySource: readFileSync(fromRoot("src", "game", "quality-profiles", "profiles.ts"), "utf8"),
    budgetsSource: readFileSync(fromRoot("src", "game", "perf-budgets", "budgets.ts"), "utf8"),
    streamFlagSource: readFileSync(fromRoot("src", "game", "stream-flag.ts"), "utf8"),
    registrySource: readFileSync(fromRoot("src", "rendering", "ResourceRegistry.ts"), "utf8"),
    cyclesSource: readFileSync(fromRoot("src", "game", "leak-cycles", "cycles.ts"), "utf8"),
    loopSource: readFileSync(fromRoot("src", "game", "engine", "loop-adapter.ts"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateThirtySoak(overrides = {}) {
  const input = { ...readThirtySoakInputs(), ...overrides };
  const errors = [];
  let manifest, freeze;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
  } catch (error) {
    return { errors: [`RSH-042 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("thirty-soak manifest differs from the reviewed RSH-042 authority");
  const identities = {
    soak_source_sha256: [input.soakSource, EXPECTED_SOAK_LOCK_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    live_soak_source_sha256: [input.liveSoakSource, EXPECTED_LIVE_SOAK_SHA256],
    soak_smoke_source_sha256: [input.soakSmokeSource, EXPECTED_SOAK_SMOKE_SHA256],
    context_restore_source_sha256: [input.contextSource, EXPECTED_CONTEXT_RESTORE_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    registry_source_sha256: [input.registrySource, EXPECTED_REGISTRY_SHA256],
    leak_cycles_source_sha256: [input.cyclesSource, EXPECTED_CYCLES_SHA256],
    loop_adapter_source_sha256: [input.loopSource, EXPECTED_LOOP_ADAPTER_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalSoakDigest()) !== EXPECTED_SOAK_DIGEST_SHA256 || manifest.identities?.soak_digest_sha256 !== EXPECTED_SOAK_DIGEST_SHA256) errors.push("thirty-soak digest identity changed");
  if (manifest.unit !== "RSH-042") errors.push("RSH-042 unit identity changed");
  if (manifest.lock?.soak_duration_s !== 1800) errors.push("30-minute soak duration changed");
  if (manifest.lock?.required_ci_cycles !== 2) errors.push("required-CI soak-smoke cycle count changed");
  if (manifest.lock?.enter_exit_cycles !== 20) errors.push("live enter-exit cycle count changed");
  if (manifest.lock?.smoke_substitutes !== false) errors.push("RSH-042 must not treat smoke as the 30-minute soak");
  if (manifest.lock?.soak_enforced !== true) errors.push("RSH-042 must enforce the 30-minute soak contract");
  if (manifest.lock?.device_matrix_enforced !== false) errors.push("RSH-042 must not enforce the device matrix");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-042 must not claim a real-device baseline");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-042 must not claim GIS accuracy, owner freeze or public distribution");
  if (!/export const THIRTY_SOAK_DEFINED = true/.test(input.soakSource)) errors.push("thirty-soak defined token missing");
  if (!/export const SOAK_ENFORCED = true/.test(input.soakSource)) errors.push("soak enforced token missing");
  if (!/export const SMOKE_SUBSTITUTES = false/.test(input.soakSource)) errors.push("smoke-substitute token missing");
  if (!/from "\.\/soak"/.test(input.indexSource)) errors.push("thirty-soak index no longer re-exports soak");
  if (!/const CYCLES = Number\(process\.env\.SOAK_CYCLES \|\| 20\)/.test(input.liveSoakSource)) errors.push("20-cycle soak harness changed");
  if (!/dTex > 2/.test(input.liveSoakSource) || !/dGeo > 2/.test(input.liveSoakSource)) errors.push("soak leak deltas changed");
  if (!/SOAK_CYCLES \?\?= "2"/.test(input.soakSmokeSource)) errors.push("required-CI soak-smoke cycle pin changed");
  if (!/export const SOAK_ENFORCED = false/.test(input.contextSource)) errors.push("RSH-041 context-loss lock must keep soak unenforced");
  if (sha256(input.hudSource) !== EXPECTED_HUD_SHA256) errors.push("HUD source drifted");
  if (sha256(input.qualitySource) !== EXPECTED_QUALITY_PROFILES_SHA256) errors.push("quality-profile lock drifted");
  if (sha256(input.budgetsSource) !== EXPECTED_BUDGETS_SHA256) errors.push("perf-budget lock drifted");
  if (sha256(input.streamFlagSource) !== EXPECTED_STREAM_FLAG_SHA256) errors.push("live stream-flag drifted");
  if (!/export const MESH_STREAMING = false/.test(input.streamFlagSource)) errors.push("live stream-flag MESH_STREAMING is not false");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-12 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-12 must remain OPEN until the 30-minute soak is in required CI");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN until a real-device baseline exists");
  if (!/\| P2-09 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-09 must stay OPEN until a production JS/asset byte-size check exists");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-042 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-043 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-043" || manifest.deferred_boundary?.rsh_043_authorized !== false || manifest.deferred_boundary?.rsh_043_started !== false) errors.push("RSH-043 deferred boundary changed");
  return { errors, locked: errors.length === 0, durationS: 1800 };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateThirtySoak();
  if (result.errors.length) {
    console.error(`thirty-soak fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`thirty-soak ok: 1800s contract locked; smoke does not substitute; RSH-043 deferred`);
}
