#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "118360987f48fe1c8c704a146d636c9869a4d81cc03cabe34c99de7d49c6b76b";
export const EXPECTED_LOCK_SHA256 = "9118115bac9a4e436b731566773f37738512f842eb0b705f5ec9f7356ff18ef3";
export const EXPECTED_INDEX_SHA256 = "b76c1ab7dfc915791e6ffccfacafc95453d740149e3dee79f13d34e0b4bb575d";
export const EXPECTED_CONTRACT_SHA256 = "dc67f0e28dcf3bf02ed231ea4a7aa3773712b4ceedec580d7fe347eca2176b2c";
export const EXPECTED_CHECKER_TEST_SHA256 = "1ab95181a412c3521420a06d6d81778a94e3baf34a341b45bd9530adc95c2480";
export const EXPECTED_DIGEST_SHA256 = "233215e477d4f49ff594c51c0b7b4c25fa174328ff9c22d068fc04860bb8f57e";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
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

export function canonicalDigest() {
  return "track_id=scopus\nart_golden_locked=true\ntrack_source_freeze=true\nayalon_freeze_granted=true\nowner_settings_freeze=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

export function readLockInputs() {
  return {
    manifestSource: readFileSync(fromRoot("SCOPUS-GOLDEN-MANIFEST.json"), "utf8"),
    lockSource: readFileSync(fromRoot("src/game/scopus-golden/golden.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src/game/scopus-golden/index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-056-SCOPUS-GOLDEN-CONTRACT.md"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts/check-scopus-golden.test.mjs"), "utf8"),
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

export function validateLock(overrides = {}) {
  const input = { ...readLockInputs(), ...overrides };
  const errors = [];
  let manifest, freeze;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
  } catch (error) {
    return { errors: [`RSH-056 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("scopus-golden manifest differs from the reviewed RSH-056 authority");
  const identities = {
    lock_source_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    registry_source_sha256: [input.registrySource, EXPECTED_REGISTRY_SHA256],
    leak_cycles_source_sha256: [input.cyclesSource, EXPECTED_CYCLES_SHA256],
    loop_adapter_source_sha256: [input.loopSource, EXPECTED_LOOP_ADAPTER_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalDigest()) !== EXPECTED_DIGEST_SHA256 || manifest.identities?.lock_digest_sha256 !== EXPECTED_DIGEST_SHA256) errors.push("scopus-golden digest identity changed");
  if (manifest.unit !== "RSH-056") errors.push("RSH-056 unit identity changed");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-056 must not claim GIS accuracy, owner freeze or public distribution");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-056 must not claim a real-device baseline");
  if (!/export const LOCK_DEFINED = true/.test(input.lockSource)) errors.push("lock defined token missing");
  if (!/from "\.\/golden"/.test(input.indexSource)) errors.push("scopus-golden index no longer re-exports lock");
  if (!/export const ART_GOLDEN_LOCKED = true/.test(input.lockSource)) errors.push("art_golden_locked token missing");
  if (!/export const TRACK_SOURCE_FREEZE = true/.test(input.lockSource)) errors.push("track_source_freeze token missing");
  if (!/export const AYALON_FREEZE_GRANTED = true/.test(input.lockSource)) errors.push("ayalon_freeze_granted token missing");
  if (!/export const OWNER_SETTINGS_FREEZE = false/.test(input.lockSource)) errors.push("owner_settings_freeze token missing");
  if (sha256(input.hudSource) !== EXPECTED_HUD_SHA256) errors.push("HUD source drifted");
  if (sha256(input.qualitySource) !== EXPECTED_QUALITY_PROFILES_SHA256) errors.push("quality-profile lock drifted");
  if (sha256(input.budgetsSource) !== EXPECTED_BUDGETS_SHA256) errors.push("perf-budget lock drifted");
  if (sha256(input.streamFlagSource) !== EXPECTED_STREAM_FLAG_SHA256) errors.push("live stream-flag drifted");
  if (!/export const MESH_STREAMING = false/.test(input.streamFlagSource)) errors.push("live stream-flag MESH_STREAMING is not false");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-12 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-12 must remain OPEN");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN");
  if (!/\| P2-09 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-09 must remain OPEN");

  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-056 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-062 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-062" || manifest.deferred_boundary?.rsh_056_authorized !== true || manifest.deferred_boundary?.rsh_057_authorized !== true || manifest.deferred_boundary?.rsh_058_authorized !== true || manifest.deferred_boundary?.rsh_059_authorized !== true || manifest.deferred_boundary?.rsh_060_authorized !== true || manifest.deferred_boundary?.rsh_061_authorized !== true || manifest.deferred_boundary?.rsh_062_authorized !== false) errors.push("RSH-062 deferred boundary changed");
  return { errors, locked: errors.length === 0 };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateLock();
  if (result.errors.length) {
    console.error(`scopus-golden fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`scopus-golden ok: RSH-056 locked; RSH-062 deferred`);
}
