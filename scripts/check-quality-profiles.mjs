#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "7cc8b0473cb5b7ee6b435252ac9a627f2657e2f25e77082ed20189b4c645ca2c";
export const EXPECTED_PROFILES_SHA256 = "566b1b15cbe67e4a9d6c8c4d671b8f5b29f036f38e0d3815616b59c3b3706a0a";
export const EXPECTED_HYSTERESIS_SHA256 = "0398a113fe0643804ad0349201eb1f3a4dd88d54811b5497dbc8128ff9f2da7e";
export const EXPECTED_INDEX_SHA256 = "f000f8f0b6b1d39a132190ec6d1225386e0950d1c2b84f09bd529d53222a0786";
export const EXPECTED_CONTRACT_SHA256 = "5cdeaac7c9d6da3205f55990579a71f6cfe828700f85311eec125f62fb0cc5a7";
export const EXPECTED_LIVE_PROFILE_SHA256 = "9da86b5461433767b9851625b5c7346c981f4901d6b67e3db9884c625c0af10e";
export const EXPECTED_LIVE_HYSTERESIS_SHA256 = "fd0e6b4a7c5578186de11eae4f465bbfe863b3f6f493f2f17e84005abf4b8271";
export const EXPECTED_CHECKER_TEST_SHA256 = "fb09306f6553ad33f7bd228dbdb19d1a8a36d5858466b3e2b4ebbd8147983267";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_QUALITY_DIGEST_SHA256 = "df5b4b3c1fd9ac7ab5fbaa2a8441da83c6b6ab5a83c97ec3914c3d63313fac6a";
export const EXPECTED_FREEZE_DIGEST_SHA256 = "9b7a9ffa0ed5835294f11c3f941d40abf015d85c76c03f2e9e94403bd08b5098";
export const EXPECTED_PERF_METRICS_SHA256 = "d76bc0131c31dfbf3d86de081d45a70fba49d0130755ad04368aceaf4592492a";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";

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

export function canonicalQualityDigest() {
  return [
    "profiles=compat,balanced,high,ultra,photo",
    "legacy=low:compat,mid:balanced,high:high",
    "drop_p95_ms=20",
    "drop_frames=90",
    "raise_p95_ms=16",
    "raise_hold_s=5",
    "max_step=8",
    "drop_order=planar,bloom,csm,pixelExtra",
    "budgets_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}

export function readQualityProfileInputs() {
  return {
    manifestSource: readFileSync(fromRoot("QUALITY-PROFILES-MANIFEST.json"), "utf8"),
    profilesSource: readFileSync(fromRoot("src", "game", "quality-profiles", "profiles.ts"), "utf8"),
    hysteresisSource: readFileSync(fromRoot("src", "game", "quality-profiles", "hysteresis.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "quality-profiles", "index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-038-QUALITY-PROFILES-CONTRACT.md"), "utf8"),
    liveProfileSource: readFileSync(fromRoot("src", "rendering", "QualityProfile.ts"), "utf8"),
    liveHysteresisSource: readFileSync(fromRoot("src", "rendering", "DynamicQualityController.ts"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-quality-profiles.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    freezeSource: readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"),
    findingsSource: readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8"),
    perfMetricsSource: readFileSync(fromRoot("src", "game", "perf-instrument", "metrics.ts"), "utf8"),
    hudSource: readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateQualityProfiles(overrides = {}) {
  const input = { ...readQualityProfileInputs(), ...overrides };
  const errors = [];
  let manifest, freeze;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
  } catch (error) {
    return { errors: [`RSH-038 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("quality-profiles manifest differs from the reviewed RSH-038 authority");
  const identities = {
    profiles_source_sha256: [input.profilesSource, EXPECTED_PROFILES_SHA256],
    hysteresis_source_sha256: [input.hysteresisSource, EXPECTED_HYSTERESIS_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    live_profile_source_sha256: [input.liveProfileSource, EXPECTED_LIVE_PROFILE_SHA256],
    live_hysteresis_source_sha256: [input.liveHysteresisSource, EXPECTED_LIVE_HYSTERESIS_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalQualityDigest()) !== EXPECTED_QUALITY_DIGEST_SHA256 || manifest.identities?.quality_digest_sha256 !== EXPECTED_QUALITY_DIGEST_SHA256) errors.push("quality digest identity changed");
  if (manifest.unit !== "RSH-038") errors.push("RSH-038 unit identity changed");
  if (JSON.stringify(manifest.lock?.profiles) !== '["compat","balanced","high","ultra","photo"]') errors.push("profile set changed");
  if (manifest.lock?.drop_p95_ms !== 20 || manifest.lock?.drop_frames !== 90) errors.push("drop hysteresis changed");
  if (manifest.lock?.raise_p95_ms !== 16 || manifest.lock?.raise_hold_s !== 5) errors.push("raise hysteresis changed");
  if (manifest.lock?.max_step !== 8) errors.push("max step changed");
  if (JSON.stringify(manifest.lock?.drop_order) !== '["planar","bloom","csm","pixelExtra"]') errors.push("drop order changed");
  if (manifest.lock?.budgets_enforced !== false) errors.push("RSH-038 must not enforce budgets");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-038 must not claim a real-device baseline");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-038 must not claim GIS accuracy, owner freeze or public distribution");
  if (!/export const QUALITY_PROFILES_DEFINED = true/.test(input.profilesSource)) errors.push("quality profiles defined token missing");
  if (!/export const BUDGETS_ENFORCED = false/.test(input.profilesSource)) errors.push("budgets token missing");
  if (!/from "\.\/profiles"/.test(input.indexSource)) errors.push("quality-profiles index no longer re-exports profiles");
  if (!/from "\.\/hysteresis"/.test(input.indexSource)) errors.push("quality-profiles index no longer re-exports hysteresis");
  if (!/id: "compat"/.test(input.liveProfileSource) || !/id: "balanced"/.test(input.liveProfileSource) || !/id: "high"/.test(input.liveProfileSource) || !/id: "ultra"/.test(input.liveProfileSource) || !/id: "photo"/.test(input.liveProfileSource)) errors.push("live QualityProfile ids changed");
  if (!/pixelScale: 0\.75/.test(input.liveProfileSource) || !/pixelScale: 0\.85/.test(input.liveProfileSource)) errors.push("live QualityProfile scales changed");
  if (!/if \(q === "low"\) return PROFILES\.compat/.test(input.liveProfileSource)) errors.push("live legacy quality map changed");
  if (!/p95 > 20/.test(input.liveHysteresisSource) || !/this\.over >= 90/.test(input.liveHysteresisSource)) errors.push("live drop hysteresis changed");
  if (!/p95 < 16/.test(input.liveHysteresisSource) || !/this\.cool >= 5/.test(input.liveHysteresisSource)) errors.push("live raise hysteresis changed");
  if (!/this\.step < 8/.test(input.liveHysteresisSource)) errors.push("live max step changed");
  if (!/planar: s < 1/.test(input.liveHysteresisSource) || !/bloom: s < 2/.test(input.liveHysteresisSource) || !/csm: s < 3/.test(input.liveHysteresisSource) || !/pixelExtra: Math\.max\(0, s - 3\)/.test(input.liveHysteresisSource)) errors.push("live gfx pass flags changed");
  if (!/export const QUALITY_PROFILES_DEFINED = false/.test(input.perfMetricsSource)) errors.push("RSH-037 historical quality-profiles flag was rewritten");
  if (sha256(input.perfMetricsSource) !== EXPECTED_PERF_METRICS_SHA256) errors.push("perf-instrument metrics source drifted");
  if (sha256(input.hudSource) !== EXPECTED_HUD_SHA256) errors.push("HUD source drifted");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN until a real-device baseline exists");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-038 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-043 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-043" || manifest.deferred_boundary?.rsh_039_authorized !== true || manifest.deferred_boundary?.rsh_040_authorized !== true || manifest.deferred_boundary?.rsh_041_authorized !== true || manifest.deferred_boundary?.rsh_042_authorized !== true || manifest.deferred_boundary?.rsh_043_authorized !== false || manifest.deferred_boundary?.rsh_039_started !== true || manifest.deferred_boundary?.rsh_040_started !== true || manifest.deferred_boundary?.rsh_041_started !== true || manifest.deferred_boundary?.rsh_042_started !== true || manifest.deferred_boundary?.rsh_043_started !== false) errors.push("RSH-043 deferred boundary changed");
  return { errors, locked: errors.length === 0, profileCount: 5 };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateQualityProfiles();
  if (result.errors.length) {
    console.error(`quality-profiles fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`quality-profiles ok: 5 profiles + hysteresis; RSH-043 deferred`);
}
