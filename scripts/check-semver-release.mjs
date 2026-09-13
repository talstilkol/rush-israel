#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "719eb5463c4e9841e745d722fc1603a8d8e1f29e20c17c6143fca3e72a008ce5";
export const EXPECTED_LOCK_SHA256 = "5655fa792bcc5670205223cb2c334263f8cbe5ff5ccde2a93704ee0b8a23d918";
export const EXPECTED_INDEX_SHA256 = "0fed1e6288471c894edff66cab9024017ce1d887fcefb915134e757e6ae2c79d";
export const EXPECTED_CONTRACT_SHA256 = "6264daa35b1ba61a6ad6a171d0042a32da65cdcf622ef28f9159800a4f8c6817";
export const EXPECTED_CHECKER_TEST_SHA256 = "72befab0c5f4743278122cc43c81c4bf153b206c33355e789b09c522d16a3015";
export const EXPECTED_DIGEST_SHA256 = "8d8d148332fe8bf3b60cf5da12f64d1c0bfc93cacc45c1e18bf846acd446c775";
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
  return "semver_locked=true\nchangelog_locked=true\npackage_json_frozen=true\npublic_distribution=false\ngithub_release_created=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

export function readLockInputs() {
  return {
    manifestSource: readFileSync(fromRoot("SEMVER-RELEASE-MANIFEST.json"), "utf8"),
    lockSource: readFileSync(fromRoot("src/game/semver-release/semver.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src/game/semver-release/index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-063-SEMVER-RELEASE-CONTRACT.md"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts/check-semver-release.test.mjs"), "utf8"),
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
    return { errors: [`RSH-063 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("semver-release manifest differs from the reviewed RSH-063 authority");
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
  if (sha256(canonicalDigest()) !== EXPECTED_DIGEST_SHA256 || manifest.identities?.lock_digest_sha256 !== EXPECTED_DIGEST_SHA256) errors.push("semver-release digest identity changed");
  if (manifest.unit !== "RSH-063") errors.push("RSH-063 unit identity changed");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-063 must not claim GIS accuracy, owner freeze or public distribution");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-063 must not claim a real-device baseline");
  if (!/export const LOCK_DEFINED = true/.test(input.lockSource)) errors.push("lock defined token missing");
  if (!/from "\.\/semver"/.test(input.indexSource)) errors.push("semver-release index no longer re-exports lock");
  if (!/export const SEMVER_LOCKED = true/.test(input.lockSource)) errors.push("semver_locked token missing");
  if (!/export const CHANGELOG_LOCKED = true/.test(input.lockSource)) errors.push("changelog_locked token missing");
  if (!/export const PACKAGE_JSON_FROZEN = true/.test(input.lockSource)) errors.push("package_json_frozen token missing");
  if (!/export const PUBLIC_DISTRIBUTION = false/.test(input.lockSource)) errors.push("public_distribution token missing");
  if (!/export const GITHUB_RELEASE_CREATED = false/.test(input.lockSource)) errors.push("github_release_created token missing");
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

  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-063 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-064 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-064" || manifest.deferred_boundary?.rsh_063_authorized !== true || manifest.deferred_boundary?.rsh_064_authorized !== false) errors.push("RSH-064 deferred boundary changed");
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
    console.error(`semver-release fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`semver-release ok: RSH-063 locked; RSH-064 deferred`);
}
