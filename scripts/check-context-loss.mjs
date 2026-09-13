#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "b2ca02990fec8eadaf9e3002bd68933e5c26e50797d0f560bedb05caa08572a9";
export const EXPECTED_RESTORE_SHA256 = "1f0095b6ec5c0aa704c04d42ca11b8798c1911b84fdcf1f739dad1764e41e54d";
export const EXPECTED_INDEX_SHA256 = "8c51c52b7ca8c2f694eb4156236446e48eb3fbf73cc71447d6336dfe0281ab55";
export const EXPECTED_CONTRACT_SHA256 = "6851e040a9a722876f03d29cb03bcf380027c9c288df2577fc8739ef1e452578";
export const EXPECTED_LOOP_ADAPTER_SHA256 = "88d8f39ff363664cc0a0ab965f7d9a174377961b8683d0752b200769439262c8";
export const EXPECTED_ENGINE_SHA256 = "6a592288cd778922b32bc918f63fd865a4b41312ce07130a61214014fa533c8b";
export const EXPECTED_RACE_CONTROLLER_SHA256 = "e01c955f700b0f7c1fa20f876a8f3ad8b294f3edbdf3bcdf4ed16e6821188670";
export const EXPECTED_CHECKER_TEST_SHA256 = "6aa1ce2d5488e7531f65820098547a979f92a7835a21192f748b604e72522260";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_CONTEXT_DIGEST_SHA256 = "883de6a9ca78f3567eff1c8c1c3f4e9cc5922d64edeb57a48d806a7dd6474c49";
export const EXPECTED_FREEZE_DIGEST_SHA256 = "9b7a9ffa0ed5835294f11c3f941d40abf015d85c76c03f2e9e94403bd08b5098";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";
export const EXPECTED_QUALITY_PROFILES_SHA256 = "566b1b15cbe67e4a9d6c8c4d671b8f5b29f036f38e0d3815616b59c3b3706a0a";
export const EXPECTED_BUDGETS_SHA256 = "c51a8040c9179ff6a5290ed39249eb7c38d1cd14dc0143982cc594801c421990";
export const EXPECTED_STREAM_FLAG_SHA256 = "725fa71482e7d45fbe92bbe3dcd6d90feed05bd58f2b4f7fa45e815f4bad3f7f";
export const EXPECTED_REGISTRY_SHA256 = "97a4d36cb120714df59c7f14c4218169b7ac05a9875be87089acdd96caeeed35";
export const EXPECTED_CYCLES_SHA256 = "b45b8e137ede67201a960d107f7f709296483bb154e5b03bb4463322ad5b60bd";

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

export function canonicalContextDigest() {
  return [
    "context_loss_cycles=8",
    "prevent_default=true",
    "skip_frames_while_lost=true",
    "restore_clears_gl_lost=true",
    "restore_remounts_race=true",
    "save_data_survives=true",
    "context_loss_enforced=true",
    "soak_enforced=false",
    "real_device_baseline=false",
    "gis=false",
    "owner_freeze=false",
    "public_distribution=false",
  ].join("\n") + "\n";
}

export function readContextLossInputs() {
  return {
    manifestSource: readFileSync(fromRoot("CONTEXT-LOSS-MANIFEST.json"), "utf8"),
    restoreSource: readFileSync(fromRoot("src", "game", "context-loss", "restore.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src", "game", "context-loss", "index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-041-CONTEXT-LOSS-CONTRACT.md"), "utf8"),
    loopSource: readFileSync(fromRoot("src", "game", "engine", "loop-adapter.ts"), "utf8"),
    engineSource: readFileSync(fromRoot("src", "game", "engine.ts"), "utf8"),
    raceSource: readFileSync(fromRoot("src", "components", "game-app", "race-controller.tsx"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts", "check-context-loss.test.mjs"), "utf8"),
    packageSource: readFileSync(fromRoot("package.json"), "utf8"),
    freezeSource: readFileSync(fromRoot("AYALON-FREEZE-MANIFEST.json"), "utf8"),
    findingsSource: readFileSync(fromRoot("FINDINGS-REGISTER.md"), "utf8"),
    hudSource: readFileSync(fromRoot("src", "components", "game-app", "hud.tsx"), "utf8"),
    qualitySource: readFileSync(fromRoot("src", "game", "quality-profiles", "profiles.ts"), "utf8"),
    budgetsSource: readFileSync(fromRoot("src", "game", "perf-budgets", "budgets.ts"), "utf8"),
    streamFlagSource: readFileSync(fromRoot("src", "game", "stream-flag.ts"), "utf8"),
    registrySource: readFileSync(fromRoot("src", "rendering", "ResourceRegistry.ts"), "utf8"),
    cyclesSource: readFileSync(fromRoot("src", "game", "leak-cycles", "cycles.ts"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateContextLoss(overrides = {}) {
  const input = { ...readContextLossInputs(), ...overrides };
  const errors = [];
  let manifest, freeze;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
  } catch (error) {
    return { errors: [`RSH-041 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("context-loss manifest differs from the reviewed RSH-041 authority");
  const identities = {
    restore_source_sha256: [input.restoreSource, EXPECTED_RESTORE_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    loop_adapter_source_sha256: [input.loopSource, EXPECTED_LOOP_ADAPTER_SHA256],
    engine_source_sha256: [input.engineSource, EXPECTED_ENGINE_SHA256],
    race_controller_source_sha256: [input.raceSource, EXPECTED_RACE_CONTROLLER_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    registry_source_sha256: [input.registrySource, EXPECTED_REGISTRY_SHA256],
    leak_cycles_source_sha256: [input.cyclesSource, EXPECTED_CYCLES_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalContextDigest()) !== EXPECTED_CONTEXT_DIGEST_SHA256 || manifest.identities?.context_digest_sha256 !== EXPECTED_CONTEXT_DIGEST_SHA256) errors.push("context-loss digest identity changed");
  if (manifest.unit !== "RSH-041") errors.push("RSH-041 unit identity changed");
  if (manifest.lock?.context_loss_cycles !== 8) errors.push("context-loss cycle count changed");
  if (manifest.lock?.prevent_default !== true) errors.push("preventDefault contract changed");
  if (manifest.lock?.skip_frames_while_lost !== true) errors.push("skip-frame contract changed");
  if (manifest.lock?.restore_remounts_race !== true) errors.push("restore remount contract changed");
  if (manifest.lock?.save_data_survives !== true) errors.push("save-data survival contract changed");
  if (manifest.lock?.context_loss_enforced !== true) errors.push("RSH-041 must enforce context-loss recovery");
  if (manifest.lock?.soak_enforced !== false) errors.push("RSH-041 must not enforce the 30-minute soak");
  if (manifest.lock?.real_device_baseline_accepted !== false) errors.push("RSH-041 must not claim a real-device baseline");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-041 must not claim GIS accuracy, owner freeze or public distribution");
  if (!/export const CONTEXT_LOSS_DEFINED = true/.test(input.restoreSource)) errors.push("context-loss defined token missing");
  if (!/export const CONTEXT_LOSS_ENFORCED = true/.test(input.restoreSource)) errors.push("context-loss enforced token missing");
  if (!/export const SOAK_ENFORCED = false/.test(input.restoreSource)) errors.push("soak token missing");
  if (!/from "\.\/restore"/.test(input.indexSource)) errors.push("context-loss index no longer re-exports restore");
  if (!/e\.preventDefault\(\);/.test(input.loopSource) || !/this\.glLost = true;/.test(input.loopSource)) errors.push("loop-adapter no longer prevents default context loss");
  if (!/this\.glLost = false;/.test(input.loopSource) || !/this\.opts\.onRestore\?\.\(\);/.test(input.loopSource)) errors.push("loop-adapter restore no longer clears glLost and remounts");
  if (!/if \(this\.disposed \|\| this\.glLost\) return;/.test(input.loopSource)) errors.push("loop-adapter no longer skips frames while the context is lost");
  if (!/canvas\.addEventListener\("webglcontextlost"/.test(input.engineSource) || !/canvas\.addEventListener\("webglcontextrestored"/.test(input.engineSource)) errors.push("engine no longer listens for WebGL context loss/restore");
  if (!/onRestore: \(\) => setRaceKey\(\(k\) => k \+ 1\)/.test(input.raceSource)) errors.push("race controller no longer remounts on restore");
  if (!/export const CONTEXT_LOSS_ENFORCED = false/.test(input.cyclesSource)) errors.push("RSH-040 leak-cycle lock must keep context-loss unenforced");
  if (sha256(input.hudSource) !== EXPECTED_HUD_SHA256) errors.push("HUD source drifted");
  if (sha256(input.qualitySource) !== EXPECTED_QUALITY_PROFILES_SHA256) errors.push("quality-profile lock drifted");
  if (sha256(input.budgetsSource) !== EXPECTED_BUDGETS_SHA256) errors.push("perf-budget lock drifted");
  if (sha256(input.streamFlagSource) !== EXPECTED_STREAM_FLAG_SHA256) errors.push("live stream-flag drifted");
  if (!/export const MESH_STREAMING = false/.test(input.streamFlagSource)) errors.push("live stream-flag MESH_STREAMING is not false");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN until a real-device baseline exists");
  if (!/\| P2-09 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-09 must stay OPEN until a production JS/asset byte-size check exists");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.engine_adapter_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-041 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-043 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-043" || manifest.deferred_boundary?.rsh_042_authorized !== true || manifest.deferred_boundary?.rsh_043_authorized !== false || manifest.deferred_boundary?.rsh_042_started !== true || manifest.deferred_boundary?.rsh_043_started !== false) errors.push("RSH-043 deferred boundary changed");
  return { errors, locked: errors.length === 0, cycles: 8 };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try { return realpathSync(entry) === fileURLToPath(url); } catch { return false; }
}
if (isMainModule(import.meta.url)) {
  const result = validateContextLoss();
  if (result.errors.length) {
    console.error(`context-loss fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`context-loss ok: 8 recovery cycles locked; RSH-043 deferred`);
}
