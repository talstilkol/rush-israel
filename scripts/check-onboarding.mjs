#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "950ec77212bb773c9d1357d0f4f93f1a208f917ccb9173c30e0e6d00133e45ec";
export const EXPECTED_LOCK_SHA256 = "445d75d62abeb283541be32cdc42efb65cc508f0069c13725de058855ad3a921";
export const EXPECTED_INDEX_SHA256 = "58b564d8c79216a0593c45c2d60928e737441a7118de050af0ed3dc065e710d0";
export const EXPECTED_CONTRACT_SHA256 = "adbf5952b5dda29cae566b61c20ac4b857d178f7e2de1d8a1e2312d7667d15fd";
export const EXPECTED_CHECKER_TEST_SHA256 = "1f9bea6c6cd9decd6715d49bc9d7ba4f9422add36c0dc98940a415cf1b877729";
export const EXPECTED_DIGEST_SHA256 = "f132225ed918c6cd27efe7b4c9a96832f0607ea8a89eacf5c9435bb184ee68d6";
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
export const EXPECTED_INPUT_MAPS_LOCK_SHA256 = "11ca4e04c9bb1040955d54cb9b52df337217c71fcaf78a0a0b5918aa66c4ff2c";
export const EXPECTED_RTL_SCOPE_LOCK_SHA256 = "3763e29aaeef4d8c0342ea118b81ea3b5f643f79f6fe9b02dd750e2225c9fa8a";
export const EXPECTED_I18N_SHA256 = "55878103cfc92169bfd6f54f3c2ff11ac129a203d46382059cebddddeb11b318";
export const EXPECTED_GAME_APP_SHA256 = "4569f67f6a8659252e3c3cf332fa377f263d3f41fcd03ced60a007aa0148cc4b";
export const EXPECTED_SCREENS_SHA256 = "37e532f6920a249564eeacfc3473d14b6731da97cff1763eec5e78a1c6cce91d";
export const EXPECTED_SAVE_RECOVERY_UI_SHA256 = "21ff2aab6db8581da4a6b53f6b5938b0006a7cd00da5b14816cf5309a4529a26";
export const EXPECTED_SAVE_RECOVERY_SHA256 = "0833fee5f8c0e324290ac8daffc6becee692ee435e9a92df7915701408dfc18f";

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
  return "onboarding_complete=true\ntitle_boot=true\nsettings_panel=true\nsave_recovery_ux=true\nfirst_run_wizard=false\nboot_screen=title\npwa_complete=false\na11y_complete=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

export function readLockInputs() {
  return {
    manifestSource: readFileSync(fromRoot("ONBOARDING-MANIFEST.json"), "utf8"),
    lockSource: readFileSync(fromRoot("src/game/onboarding/flow.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src/game/onboarding/index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-046-ONBOARDING-CONTRACT.md"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts/check-onboarding.test.mjs"), "utf8"),
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
    inputMapsLockSource: readFileSync(fromRoot("src", "game", "input-maps", "maps.ts"), "utf8"),
    rtlScopeLockSource: readFileSync(fromRoot("src", "game", "rtl-scope", "scope.ts"), "utf8"),
    gameAppSource: readFileSync(fromRoot("src", "components", "game-app.tsx"), "utf8"),
    screensSource: readFileSync(fromRoot("src", "components", "game-app", "screens.tsx"), "utf8"),
    recoveryUiSource: readFileSync(fromRoot("src", "game", "save-recovery-ui.ts"), "utf8"),
    recoverySource: readFileSync(fromRoot("src", "game", "save-recovery.ts"), "utf8"),
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
    return { errors: [`RSH-046 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("onboarding manifest differs from the reviewed RSH-046 authority");
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
    game_app_source_sha256: [input.gameAppSource, EXPECTED_GAME_APP_SHA256],
    screens_source_sha256: [input.screensSource, EXPECTED_SCREENS_SHA256],
    save_recovery_ui_sha256: [input.recoveryUiSource, EXPECTED_SAVE_RECOVERY_UI_SHA256],
    save_recovery_sha256: [input.recoverySource, EXPECTED_SAVE_RECOVERY_SHA256],
    input_maps_lock_sha256: [input.inputMapsLockSource, EXPECTED_INPUT_MAPS_LOCK_SHA256],
    rtl_scope_lock_sha256: [input.rtlScopeLockSource, EXPECTED_RTL_SCOPE_LOCK_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalDigest()) !== EXPECTED_DIGEST_SHA256 || manifest.identities?.lock_digest_sha256 !== EXPECTED_DIGEST_SHA256) errors.push("onboarding digest identity changed");
  if (manifest.unit !== "RSH-046") errors.push("RSH-046 unit identity changed");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-046 must not claim GIS accuracy, owner freeze or public distribution");
  if (manifest.lock?.onboarding_complete !== true) errors.push("RSH-046 must lock onboarding_complete");
  if (manifest.lock?.title_boot !== true) errors.push("RSH-046 must lock title_boot");
  if (manifest.lock?.settings_panel !== true) errors.push("RSH-046 must lock settings_panel");
  if (manifest.lock?.save_recovery_ux !== true) errors.push("RSH-046 must lock save_recovery_ux");
  if (manifest.lock?.first_run_wizard !== false) errors.push("RSH-046 must not claim a first-run wizard");
  if (manifest.lock?.boot_screen !== "title") errors.push("RSH-046 must lock boot_screen title");
  if (manifest.lock?.pwa_complete !== false) errors.push("RSH-046 must not claim PWA complete");
  if (manifest.lock?.a11y_complete !== false) errors.push("RSH-046 must not claim a11y complete");
  if (!/export const LOCK_DEFINED = true/.test(input.lockSource)) errors.push("lock defined token missing");
  if (!/from "\.\/flow"/.test(input.indexSource)) errors.push("onboarding index no longer re-exports lock");
  if (!/export const ONBOARDING_COMPLETE = true/.test(input.lockSource)) errors.push("onboarding_complete token missing");
  if (!/export const TITLE_BOOT = true/.test(input.lockSource)) errors.push("title_boot token missing");
  if (!/export const SETTINGS_PANEL = true/.test(input.lockSource)) errors.push("settings_panel token missing");
  if (!/export const SAVE_RECOVERY_UX = true/.test(input.lockSource)) errors.push("save_recovery_ux token missing");
  if (!/export const FIRST_RUN_WIZARD = false/.test(input.lockSource)) errors.push("first_run_wizard token missing");
  if (!/export const BOOT_SCREEN = "title"/.test(input.lockSource)) errors.push("boot_screen token missing");
  if (!/export const PWA_COMPLETE = false/.test(input.lockSource)) errors.push("pwa_complete token missing");
  if (!/export const A11Y_COMPLETE = false/.test(input.lockSource)) errors.push("a11y_complete token missing");
  if (!/acceptedAsFirstRunWizard: false/.test(input.lockSource)) errors.push("first-run-wizard acceptance must stay false");
  if (!/acceptedAsPwaComplete: false/.test(input.lockSource)) errors.push("PWA acceptance must stay false");
  if (!/acceptedAsA11yComplete: false/.test(input.lockSource)) errors.push("a11y acceptance must stay false");

  if (!/useState\("title"\)/.test(input.gameAppSource)) errors.push("live game-app boot screen is not title");
  if (sha256(input.gameAppSource) !== EXPECTED_GAME_APP_SHA256) errors.push("live game-app.tsx drifted");
  if (!/"aria-label": "settings"/.test(input.screensSource)) errors.push("live screens.tsx missing settings control");
  if (!/t\("הגדרות", "Settings"\)/.test(input.screensSource)) errors.push("live screens.tsx missing settings panel");
  if (!/screen === "title"/.test(input.screensSource)) errors.push("live screens.tsx missing title boot");
  if (!/Pick a track and drive/.test(input.screensSource)) errors.push("live title onboarding copy drifted");
  if (sha256(input.screensSource) !== EXPECTED_SCREENS_SHA256) errors.push("live screens.tsx drifted");
  if (!/SAVE_STATUS_EVENT/.test(input.recoveryUiSource)) errors.push("save-recovery-ui missing status event");
  if (!/alertdialog/.test(input.recoveryUiSource)) errors.push("save-recovery-ui missing alertdialog");
  if (sha256(input.recoveryUiSource) !== EXPECTED_SAVE_RECOVERY_UI_SHA256) errors.push("save-recovery-ui drifted");
  if (!/SAVE_BACKUP_KEY/.test(input.recoverySource)) errors.push("save-recovery missing backup key");
  if (sha256(input.recoverySource) !== EXPECTED_SAVE_RECOVERY_SHA256) errors.push("save-recovery drifted");
  if (!/export const ONBOARDING_COMPLETE = false/.test(input.rtlScopeLockSource)) errors.push("rtl-scope lock must keep ONBOARDING_COMPLETE false");
  if (sha256(input.rtlScopeLockSource) !== EXPECTED_RTL_SCOPE_LOCK_SHA256) errors.push("rtl-scope lock source drifted");
  if (!/export const RTL_SCOPE_COMPLETE = false/.test(input.inputMapsLockSource)) errors.push("input-maps lock must keep RTL_SCOPE_COMPLETE false");
  if (sha256(input.inputMapsLockSource) !== EXPECTED_INPUT_MAPS_LOCK_SHA256) errors.push("input-maps lock source drifted");

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
  if (!/\| P2-10 \| P2 \| \*\*CLOSED\*\*/.test(input.findingsSource)) errors.push("P2-10 must remain CLOSED");
  if (!/\| P2-11 \| P2 \| \*\*OPEN\*\*/.test(input.findingsSource)) errors.push("P2-11 must remain OPEN");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-046 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-047 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-047" || manifest.deferred_boundary?.rsh_046_authorized !== true || manifest.deferred_boundary?.rsh_047_authorized !== false) errors.push("RSH-047 deferred boundary changed");
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
    console.error(`onboarding fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`onboarding ok: RSH-046 locked; RSH-047 deferred`);
}
