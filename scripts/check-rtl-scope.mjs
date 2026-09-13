#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "bb856e472bd73e1819640de3f8fe8823b96a0512edea97c900bbe63a73c69bc8";
export const EXPECTED_LOCK_SHA256 = "41946eea04a2f4ff8dcbf90d3d0100d5c78da82309e44f105f94f269372debd8";
export const EXPECTED_INDEX_SHA256 = "7523513909e99cd43e835e319a4c6ca4bbd20b9ae29ddcd0d73c5089efa40577";
export const EXPECTED_CONTRACT_SHA256 = "f0586e527c58e637fd710333cbb9c743cdc4ba45375e40913c68f6f4fa5f9bf7";
export const EXPECTED_CHECKER_TEST_SHA256 = "1b450e34f82777fd2b7d751efd0d71cde1b5e1da230880797b2205487495f3bd";
export const EXPECTED_DIGEST_SHA256 = "8623a2e637ffe19cad23650dd3e3f89be506a7890e5df640e8f99e62a72ce6ad";
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
export const EXPECTED_I18N_SHA256 = "55878103cfc92169bfd6f54f3c2ff11ac129a203d46382059cebddddeb11b318";
export const EXPECTED_GAME_APP_SHA256 = "4569f67f6a8659252e3c3cf332fa377f263d3f41fcd03ced60a007aa0148cc4b";
export const EXPECTED_ROOT_SHA256 = "a242e4f8c4463313309001eec031897c8b9555ea2505e065b777489027374709";
export const EXPECTED_STYLES_SHA256 = "b7238994617b20c40ff3443ea430a0a0b94bcc908d70fc78df6b22de3eb104b3";

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
  return "rtl_scope_complete=true\nhebrew_rtl=true\nenglish_ltr=true\narabic_in_scope=true\narabic_copy_complete=false\narabic_fallback_english=true\ndefault_lang=he\nlang_count=3\nonboarding_complete=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

export function readLockInputs() {
  return {
    manifestSource: readFileSync(fromRoot("RTL-SCOPE-MANIFEST.json"), "utf8"),
    lockSource: readFileSync(fromRoot("src/game/rtl-scope/scope.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src/game/rtl-scope/index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-045-RTL-SCOPE-CONTRACT.md"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts/check-rtl-scope.test.mjs"), "utf8"),
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
    i18nSource: readFileSync(fromRoot("src", "game", "i18n.ts"), "utf8"),
    gameAppSource: readFileSync(fromRoot("src", "components", "game-app.tsx"), "utf8"),
    rootSource: readFileSync(fromRoot("src", "routes", "__root.tsx"), "utf8"),
    stylesSource: readFileSync(fromRoot("src", "styles.css"), "utf8"),
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
    return { errors: [`RSH-045 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("rtl-scope manifest differs from the reviewed RSH-045 authority");
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
    i18n_source_sha256: [input.i18nSource, EXPECTED_I18N_SHA256],
    game_app_source_sha256: [input.gameAppSource, EXPECTED_GAME_APP_SHA256],
    root_source_sha256: [input.rootSource, EXPECTED_ROOT_SHA256],
    styles_source_sha256: [input.stylesSource, EXPECTED_STYLES_SHA256],
    input_maps_lock_sha256: [input.inputMapsLockSource, EXPECTED_INPUT_MAPS_LOCK_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalDigest()) !== EXPECTED_DIGEST_SHA256 || manifest.identities?.lock_digest_sha256 !== EXPECTED_DIGEST_SHA256) errors.push("rtl-scope digest identity changed");
  if (manifest.unit !== "RSH-045") errors.push("RSH-045 unit identity changed");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-045 must not claim GIS accuracy, owner freeze or public distribution");
  if (manifest.lock?.rtl_scope_complete !== true) errors.push("RSH-045 must lock rtl_scope_complete");
  if (manifest.lock?.hebrew_rtl !== true) errors.push("RSH-045 must lock hebrew_rtl");
  if (manifest.lock?.english_ltr !== true) errors.push("RSH-045 must lock english_ltr");
  if (manifest.lock?.arabic_in_scope !== true) errors.push("RSH-045 must lock arabic_in_scope");
  if (manifest.lock?.arabic_copy_complete !== false) errors.push("RSH-045 must not claim Arabic copy complete");
  if (manifest.lock?.arabic_fallback_english !== true) errors.push("RSH-045 must lock Arabic English fallback");
  if (manifest.lock?.default_lang !== "he") errors.push("RSH-045 must lock default_lang he");
  if (manifest.lock?.lang_count !== 3) errors.push("RSH-045 must lock lang_count 3");
  if (manifest.lock?.onboarding_complete !== false) errors.push("RSH-045 must not claim onboarding complete");
  if (!/export const LOCK_DEFINED = true/.test(input.lockSource)) errors.push("lock defined token missing");
  if (!/from "\.\/scope"/.test(input.indexSource)) errors.push("rtl-scope index no longer re-exports lock");
  if (!/export const RTL_SCOPE_COMPLETE = true/.test(input.lockSource)) errors.push("rtl_scope_complete token missing");
  if (!/export const HEBREW_RTL = true/.test(input.lockSource)) errors.push("hebrew_rtl token missing");
  if (!/export const ENGLISH_LTR = true/.test(input.lockSource)) errors.push("english_ltr token missing");
  if (!/export const ARABIC_IN_SCOPE = true/.test(input.lockSource)) errors.push("arabic_in_scope token missing");
  if (!/export const ARABIC_COPY_COMPLETE = false/.test(input.lockSource)) errors.push("arabic_copy_complete token missing");
  if (!/export const ARABIC_FALLBACK_ENGLISH = true/.test(input.lockSource)) errors.push("arabic_fallback_english token missing");
  if (!/export const DEFAULT_LANG = "he"/.test(input.lockSource)) errors.push("default_lang token missing");
  if (!/export const LANG_COUNT = 3/.test(input.lockSource)) errors.push("lang_count token missing");
  if (!/export const ONBOARDING_COMPLETE = false/.test(input.lockSource)) errors.push("onboarding_complete token missing");
  if (!/acceptedAsArabicCopyComplete: false/.test(input.lockSource)) errors.push("Arabic-copy acceptance must stay false");
  if (!/acceptedAsOnboardingComplete: false/.test(input.lockSource)) errors.push("onboarding acceptance must stay false");

  if (!/export type Lang = "he" \| "ar" \| "en"/.test(input.i18nSource)) errors.push("live i18n.ts Lang union drifted");
  if (!/ar \?\? en/.test(input.i18nSource)) errors.push("live i18n.ts Arabic fallback drifted");
  if (!/return lang === "en" \? "ltr" : "rtl"/.test(input.i18nSource)) errors.push("live i18n.ts dirFor drifted");
  if (!/if \(lang === "he"\) return "ar"/.test(input.i18nSource)) errors.push("live i18n.ts nextLang cycle drifted");
  if (sha256(input.i18nSource) !== EXPECTED_I18N_SHA256) errors.push("live i18n.ts drifted");
  if (!/useState<Lang>\("he"\)/.test(input.gameAppSource)) errors.push("live game-app default lang is not Hebrew");
  if (!/dir: dirFor\(lang\)/.test(input.gameAppSource)) errors.push("live game-app missing dirFor");
  if (sha256(input.gameAppSource) !== EXPECTED_GAME_APP_SHA256) errors.push("live game-app.tsx drifted");
  if (!/lang="he"/.test(input.rootSource)) errors.push("live __root.tsx lang is not Hebrew");
  if (/<html[^>]*\sdir=/.test(input.rootSource)) errors.push("live __root.tsx must not hardcode html dir");
  if (sha256(input.rootSource) !== EXPECTED_ROOT_SHA256) errors.push("live __root.tsx drifted");
  if (!/Heebo/.test(input.stylesSource) || !/Noto Sans Arabic/.test(input.stylesSource)) errors.push("live styles.css font lock drifted");
  if (!/\[dir="rtl"\] \.boot-bar-fill/.test(input.stylesSource)) errors.push("live styles.css RTL boot-bar rule missing");
  if (sha256(input.stylesSource) !== EXPECTED_STYLES_SHA256) errors.push("live styles.css drifted");
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
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-045 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-046 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-046" || manifest.deferred_boundary?.rsh_045_authorized !== true || manifest.deferred_boundary?.rsh_046_authorized !== false) errors.push("RSH-046 deferred boundary changed");
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
    console.error(`rtl-scope fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`rtl-scope ok: RSH-045 locked; RSH-046 deferred`);
}
