#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "a9300cf35c36977915a9bdee9eff40c6467cfe8505e49d7576c0d82530637f9b";
export const EXPECTED_LOCK_SHA256 = "8381cea4daa2fed5034ac53f7de29d0b9e1afc65b4aca6b01e831861456ae003";
export const EXPECTED_INDEX_SHA256 = "a55d5f13d31ecb92492a156fed4e64841272d031195f7d624f05d2fb422ed88c";
export const EXPECTED_CONTRACT_SHA256 = "33c2ba66cfe688865a1a43438041e0b12c239f4e100a9948e42dd23ecedd0892";
export const EXPECTED_CHECKER_TEST_SHA256 = "e76422d96a1bde0f38d23e1eb99a3696fdaa18780087e63ae3c73fb402067377";
export const EXPECTED_DIGEST_SHA256 = "fbafb52fe362fbf0fbaee36b86fb305eee4a255ee14b8d282cb5ff8de815fdc2";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_HUD_SHA256 = "97eae819cf490729bf36de0dbaf9f79a6154e52b844f42a5dd76e159e76eca35";
export const EXPECTED_QUALITY_PROFILES_SHA256 = "566b1b15cbe67e4a9d6c8c4d671b8f5b29f036f38e0d3815616b59c3b3706a0a";
export const EXPECTED_BUDGETS_SHA256 = "c51a8040c9179ff6a5290ed39249eb7c38d1cd14dc0143982cc594801c421990";
export const EXPECTED_STREAM_FLAG_SHA256 = "725fa71482e7d45fbe92bbe3dcd6d90feed05bd58f2b4f7fa45e815f4bad3f7f";
export const EXPECTED_REGISTRY_SHA256 = "97a4d36cb120714df59c7f14c4218169b7ac05a9875be87089acdd96caeeed35";
export const EXPECTED_CYCLES_SHA256 = "b45b8e137ede67201a960d107f7f709296483bb154e5b03bb4463322ad5b60bd";
export const EXPECTED_LOOP_ADAPTER_SHA256 = "88d8f39ff363664cc0a0ab965f7d9a174377961b8683d0752b200769439262c8";
export const EXPECTED_INPUT_SHA256 = "51d638c0a004d080d2b558d34a58e4631e74606129d557eb1ffc835218c124aa";
export const EXPECTED_TOUCH_SHA256 = "3f89972a7cf2aa62a81d0bc82aec098a91b41eae5a9d25dd74038c14577868b8";
export const EXPECTED_FEEL_SHA256 = "fea9f1a017261cb0c0649ed8c472825954bb236224e741a00ac51b71255abc1e";
export const EXPECTED_RACE_SHA256 = "e01c955f700b0f7c1fa20f876a8f3ad8b294f3edbdf3bcdf4ed16e6821188670";
export const EXPECTED_DEVICE_MATRIX_LOCK_SHA256 = "52f16f14894ae8d9fefe2d97c060733648642b6571e1b75d94d28df6b908547b";

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
  return "input_maps_unified=true\ntouch_action=none\ncanvas_touch_none=true\npointer_cancel_locked=true\nunified_action_count=7\nrtl_scope_complete=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

export function readLockInputs() {
  return {
    manifestSource: readFileSync(fromRoot("INPUT-MAPS-MANIFEST.json"), "utf8"),
    lockSource: readFileSync(fromRoot("src/game/input-maps/maps.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src/game/input-maps/index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-044-INPUT-MAPS-CONTRACT.md"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts/check-input-maps.test.mjs"), "utf8"),
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
    inputSource: readFileSync(fromRoot("src", "game", "input.ts"), "utf8"),
    touchSource: readFileSync(fromRoot("src", "components", "touch-controls.tsx"), "utf8"),
    feelSource: readFileSync(fromRoot("src", "game", "ayalon-feel", "feel.ts"), "utf8"),
    raceSource: readFileSync(fromRoot("src", "components", "game-app", "race-controller.tsx"), "utf8"),
    deviceMatrixLockSource: readFileSync(fromRoot("src", "game", "device-matrix", "matrix.ts"), "utf8"),
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
    return { errors: [`RSH-044 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("input-maps manifest differs from the reviewed RSH-044 authority");
  const identities = {
    lock_source_sha256: [input.lockSource, EXPECTED_LOCK_SHA256],
    index_source_sha256: [input.indexSource, EXPECTED_INDEX_SHA256],
    contract_sha256: [input.contractSource, EXPECTED_CONTRACT_SHA256],
    checker_test_sha256: [input.checkerTestSource, EXPECTED_CHECKER_TEST_SHA256],
    package_source_sha256: [input.packageSource, EXPECTED_PACKAGE_SHA256],
    registry_source_sha256: [input.registrySource, EXPECTED_REGISTRY_SHA256],
    leak_cycles_source_sha256: [input.cyclesSource, EXPECTED_CYCLES_SHA256],
    loop_adapter_source_sha256: [input.loopSource, EXPECTED_LOOP_ADAPTER_SHA256],
    input_source_sha256: [input.inputSource, EXPECTED_INPUT_SHA256],
    touch_source_sha256: [input.touchSource, EXPECTED_TOUCH_SHA256],
    feel_source_sha256: [input.feelSource, EXPECTED_FEEL_SHA256],
    race_source_sha256: [input.raceSource, EXPECTED_RACE_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalDigest()) !== EXPECTED_DIGEST_SHA256 || manifest.identities?.lock_digest_sha256 !== EXPECTED_DIGEST_SHA256) errors.push("input-maps digest identity changed");
  if (manifest.unit !== "RSH-044") errors.push("RSH-044 unit identity changed");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-044 must not claim GIS accuracy, owner freeze or public distribution");
  if (manifest.lock?.rtl_scope_complete !== false) errors.push("RSH-044 must not claim RTL-scope complete");
  if (manifest.lock?.input_maps_unified !== true) errors.push("RSH-044 must lock input_maps_unified");
  if (!/export const LOCK_DEFINED = true/.test(input.lockSource)) errors.push("lock defined token missing");
  if (!/from "\.\/maps"/.test(input.indexSource)) errors.push("input-maps index no longer re-exports lock");
  if (!/export const INPUT_MAPS_UNIFIED = true/.test(input.lockSource)) errors.push("input_maps_unified token missing");
  if (!/export const TOUCH_ACTION = "none"/.test(input.lockSource)) errors.push("touch_action token missing");
  if (!/export const CANVAS_TOUCH_NONE = true/.test(input.lockSource)) errors.push("canvas_touch_none token missing");
  if (!/export const POINTER_CANCEL_LOCKED = true/.test(input.lockSource)) errors.push("pointer_cancel_locked token missing");
  if (!/export const RTL_SCOPE_COMPLETE = false/.test(input.lockSource)) errors.push("rtl_scope_complete token missing");
  if (!/export const UNIFIED_ACTION_COUNT = 7/.test(input.lockSource)) errors.push("unified_action_count token missing");
  if (!/UNIFIED_ACTIONS/.test(input.lockSource)) errors.push("UNIFIED_ACTIONS missing");

  for (const token of ["KeyA", "ArrowLeft", "KeyD", "ArrowRight", "KeyW", "ArrowUp", "KeyS", "ArrowDown", "Space", "KeyE", "KeyQ", "Escape", "KeyP", "KeyR", "buttons[7]", "buttons[6]", "buttons[4]", "buttons[0]", "buttons[2]"]) {
    if (!input.inputSource.includes(token)) errors.push(`live input.ts missing unified token ${token}`);
  }
  if (!/md:hidden/.test(input.touchSource)) errors.push("live touch-controls missing md:hidden");
  if ((input.touchSource.match(/onPointerCancel/g) || []).length < 6) errors.push("live touch-controls missing pointer-cancel on pad and buttons");
  if (!/touch-none/.test(input.raceSource)) errors.push("live race-controller missing canvas touch-none");
  if (!/KEYBOARD_STEER_LEFT = \["KeyA", "ArrowLeft"\]/.test(input.feelSource)) errors.push("ayalon-feel keyboard map drifted");
  if (!/GAMEPAD_INDEX = 0/.test(input.feelSource)) errors.push("ayalon-feel gamepad map drifted");
  if (!/TOUCH_BUTTONS = \["rewind", "brake", "drift", "nitro", "gas"\]/.test(input.feelSource)) errors.push("ayalon-feel touch map drifted");

  if (sha256(input.hudSource) !== EXPECTED_HUD_SHA256) errors.push("HUD source drifted");
  if (sha256(input.qualitySource) !== EXPECTED_QUALITY_PROFILES_SHA256) errors.push("quality-profile lock drifted");
  if (sha256(input.budgetsSource) !== EXPECTED_BUDGETS_SHA256) errors.push("perf-budget lock drifted");
  if (sha256(input.streamFlagSource) !== EXPECTED_STREAM_FLAG_SHA256) errors.push("live stream-flag drifted");
  if (!/export const MESH_STREAMING = false/.test(input.streamFlagSource)) errors.push("live stream-flag MESH_STREAMING is not false");
  if (sha256(input.deviceMatrixLockSource) !== EXPECTED_DEVICE_MATRIX_LOCK_SHA256) errors.push("device-matrix lock source drifted");
  if (freeze.lock?.freeze_granted !== true || freeze.lock?.source_count !== 36) errors.push("Ayalon freeze was rewritten");
  if (sha256File(fromRoot("src", "game", "ayalon-freeze", "freeze.ts")) !== "a55772d9a2579200e67a8ebcf788b07720fcd1cb9332946971a71fb851a5dcb1") errors.push("Ayalon freeze source hash drifted");
  if (!/\| P1-12 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-12 must remain OPEN");
  if (!/\| P1-13 \| P1 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P1-13 must remain OPEN");
  if (!/\| P2-09 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-09 must remain OPEN");
  if (!/\| P2-10 \| P2 \| \*\*CLOSED\*\*/.test(input.findingsSource)) errors.push("P2-10 must be CLOSED by RSH-044");
  if (!/\| P2-11 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-11 must remain OPEN");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-044 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-045 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-045" || manifest.deferred_boundary?.rsh_044_authorized !== true || manifest.deferred_boundary?.rsh_045_authorized !== false) errors.push("RSH-045 deferred boundary changed");
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
    console.error(`input-maps fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`input-maps ok: RSH-044 locked; RSH-045 deferred`);
}
