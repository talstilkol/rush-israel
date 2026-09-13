#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "9e9a30d08e5008a31f7702297a3fb5e17943dc22996f7659b92dc9ea7666731a";
export const EXPECTED_LOCK_SHA256 = "88bca96d7d44c337e7aa2ab97bb0e31e2c9b22029868cd400bc05e20ef42ab8f";
export const EXPECTED_INDEX_SHA256 = "91d8e47a549b7942afd9bea331b69084b55af9b37d60b9de9b8ac8b055666fc0";
export const EXPECTED_CONTRACT_SHA256 = "036968ff9485d0f7cdb1e3f760efd7e2f4fc1d2eab7a28b8617d37c5cd75fdbb";
export const EXPECTED_CHECKER_TEST_SHA256 = "4780eb80cb98c0b00b14e9c8f0762f6a24494169ea54adec11359343b0c4e93c";
export const EXPECTED_DIGEST_SHA256 = "ede491dd14218e76cfc7f35533cd8f0181033cf03784b618c7d181d27d766c98";
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
export const EXPECTED_ONBOARDING_LOCK_SHA256 = "445d75d62abeb283541be32cdc42efb65cc508f0069c13725de058855ad3a921";
export const EXPECTED_I18N_SHA256 = "55878103cfc92169bfd6f54f3c2ff11ac129a203d46382059cebddddeb11b318";
export const EXPECTED_GAME_APP_SHA256 = "4569f67f6a8659252e3c3cf332fa377f263d3f41fcd03ced60a007aa0148cc4b";
export const EXPECTED_ROOT_SHA256 = "a242e4f8c4463313309001eec031897c8b9555ea2505e065b777489027374709";
export const EXPECTED_STYLES_SHA256 = "b7238994617b20c40ff3443ea430a0a0b94bcc908d70fc78df6b22de3eb104b3";
export const EXPECTED_PLUGIN_SHA256 = "3401f7f3f059cb87d376ccb9dfa1ea47eb0ff887aab7de33d48d8eeea3f20f23";
export const EXPECTED_SHARED_SHA256 = "860da7df5e0e5698ccc0ed9def2eb981c2f396831c5523368d031ec740b88b9c";
export const EXPECTED_RUSH_PWA_SHA256 = "a59c8552dbc1bc5e4b2d4d142c9dc6f5e764939cccbd2199260ff8394487efdf";
export const EXPECTED_MIDDLEWARE_SHA256 = "c79b5a7d0e283df3397606bc7e99608b0cc0ddd17e4c88bbbc5ba49c159e825b";
export const EXPECTED_PRODUCT_METADATA_SHA256 = "415b32bc00e9614249c332dfcc2530cad18a792deaa8373d6ffc81e4bebcd979";

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
  return "pwa_complete=true\nmanifest_present=true\nmanifest_path=/__grok/manifest.webmanifest\ndisplay_standalone=true\nstart_url=/\nservice_worker=false\noffline_cache=false\nupdate_prompt=false\npublic_install=false\na11y_complete=false\ngis=false\nowner_freeze=false\npublic_distribution=false\n";
}

export function readLockInputs() {
  return {
    manifestSource: readFileSync(fromRoot("PWA-MANIFEST.json"), "utf8"),
    lockSource: readFileSync(fromRoot("src/game/pwa/offline.ts"), "utf8"),
    indexSource: readFileSync(fromRoot("src/game/pwa/index.ts"), "utf8"),
    contractSource: readFileSync(fromRoot("RSH-047-PWA-CONTRACT.md"), "utf8"),
    checkerTestSource: readFileSync(fromRoot("scripts/check-pwa.test.mjs"), "utf8"),
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
    onboardingLockSource: readFileSync(fromRoot("src", "game", "onboarding", "flow.ts"), "utf8"),
    i18nSource: readFileSync(fromRoot("src", "game", "i18n.ts"), "utf8"),
    gameAppSource: readFileSync(fromRoot("src", "components", "game-app.tsx"), "utf8"),
    rootSource: readFileSync(fromRoot("src", "routes", "__root.tsx"), "utf8"),
    stylesSource: readFileSync(fromRoot("src", "styles.css"), "utf8"),
    pluginSource: readFileSync(fromRoot("scripts", "grok-pwa-plugin.mjs"), "utf8"),
    sharedSource: readFileSync(fromRoot("scripts", "grok-pwa-shared.mjs"), "utf8"),
    rushPwaSource: readFileSync(fromRoot("scripts", "rush-pwa.mjs"), "utf8"),
    middlewareSource: readFileSync(fromRoot("server", "middleware", "grok-pwa.ts"), "utf8"),
    productMetadataSource: readFileSync(fromRoot("PRODUCT-METADATA.json"), "utf8"),
    repositoryFiles: trackedFiles(),
  };
}

export function validateLock(overrides = {}) {
  const input = { ...readLockInputs(), ...overrides };
  const errors = [];
  let manifest, freeze, metadata;
  try {
    manifest = JSON.parse(input.manifestSource);
    freeze = JSON.parse(input.freezeSource);
    metadata = JSON.parse(input.productMetadataSource);
  } catch (error) {
    return { errors: [`RSH-047 authority JSON invalid: ${error.message}`] };
  }
  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("pwa manifest differs from the reviewed RSH-047 authority");
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
    plugin_source_sha256: [input.pluginSource, EXPECTED_PLUGIN_SHA256],
    shared_source_sha256: [input.sharedSource, EXPECTED_SHARED_SHA256],
    rush_pwa_source_sha256: [input.rushPwaSource, EXPECTED_RUSH_PWA_SHA256],
    middleware_source_sha256: [input.middlewareSource, EXPECTED_MIDDLEWARE_SHA256],
    product_metadata_sha256: [input.productMetadataSource, EXPECTED_PRODUCT_METADATA_SHA256],
    input_maps_lock_sha256: [input.inputMapsLockSource, EXPECTED_INPUT_MAPS_LOCK_SHA256],
    rtl_scope_lock_sha256: [input.rtlScopeLockSource, EXPECTED_RTL_SCOPE_LOCK_SHA256],
    onboarding_lock_sha256: [input.onboardingLockSource, EXPECTED_ONBOARDING_LOCK_SHA256],
  };
  for (const [name, [source, expected]] of Object.entries(identities)) {
    if (sha256(source) !== expected || manifest.identities?.[name] !== expected) errors.push(`${name} changed`);
  }
  if (sha256(canonicalDigest()) !== EXPECTED_DIGEST_SHA256 || manifest.identities?.lock_digest_sha256 !== EXPECTED_DIGEST_SHA256) errors.push("pwa digest identity changed");
  if (manifest.unit !== "RSH-047") errors.push("RSH-047 unit identity changed");
  if (manifest.lock?.gis_claim !== false || manifest.lock?.owner_freeze !== false || manifest.lock?.public_distribution !== false) errors.push("RSH-047 must not claim GIS accuracy, owner freeze or public distribution");
  if (manifest.lock?.pwa_complete !== true) errors.push("RSH-047 must lock pwa_complete");
  if (manifest.lock?.manifest_present !== true) errors.push("RSH-047 must lock manifest_present");
  if (manifest.lock?.manifest_path !== "/__grok/manifest.webmanifest") errors.push("RSH-047 must lock manifest_path");
  if (manifest.lock?.display_standalone !== true) errors.push("RSH-047 must lock display_standalone");
  if (manifest.lock?.start_url !== "/") errors.push("RSH-047 must lock start_url");
  if (manifest.lock?.service_worker !== false) errors.push("RSH-047 must not claim a service worker");
  if (manifest.lock?.offline_cache !== false) errors.push("RSH-047 must not claim offline cache");
  if (manifest.lock?.update_prompt !== false) errors.push("RSH-047 must not claim an update prompt");
  if (manifest.lock?.public_install !== false) errors.push("RSH-047 must not claim public install");
  if (manifest.lock?.a11y_complete !== false) errors.push("RSH-047 must not claim a11y complete");
  if (!/export const LOCK_DEFINED = true/.test(input.lockSource)) errors.push("lock defined token missing");
  if (!/from "\.\/offline"/.test(input.indexSource)) errors.push("pwa index no longer re-exports lock");
  if (!/export const PWA_COMPLETE = true/.test(input.lockSource)) errors.push("pwa_complete token missing");
  if (!/export const SERVICE_WORKER = false/.test(input.lockSource)) errors.push("service_worker token missing");
  if (!/export const OFFLINE_CACHE = false/.test(input.lockSource)) errors.push("offline_cache token missing");
  if (!/export const UPDATE_PROMPT = false/.test(input.lockSource)) errors.push("update_prompt token missing");
  if (!/export const A11Y_COMPLETE = false/.test(input.lockSource)) errors.push("a11y_complete token missing");
  if (!/acceptedAsServiceWorker: false/.test(input.lockSource)) errors.push("service-worker acceptance must stay false");
  if (!/acceptedAsOfflineCache: false/.test(input.lockSource)) errors.push("offline-cache acceptance must stay false");
  if (!/acceptedAsA11yComplete: false/.test(input.lockSource)) errors.push("a11y acceptance must stay false");

  if (!/href: "\/__grok\/manifest\.webmanifest"/.test(input.rootSource)) errors.push("live __root.tsx missing product manifest link");
  if (sha256(input.rootSource) !== EXPECTED_ROOT_SHA256) errors.push("live __root.tsx drifted");
  if (!/display: "standalone"/.test(input.sharedSource)) errors.push("live grok-pwa-shared missing standalone display");
  if (!/start_url: "\/"/.test(input.rushPwaSource)) errors.push("live rush-pwa missing start_url");
  if (!/RUSH_PWA_NAME = "RUSH Israel"/.test(input.rushPwaSource)) errors.push("live rush-pwa product name drifted");
  if (/serviceWorker/.test(input.pluginSource + input.sharedSource + input.rushPwaSource + input.middlewareSource + input.gameAppSource)) errors.push("live PWA sources must not introduce a service worker in this unit");
  if (metadata.pwa?.manifest_path !== "/__grok/manifest.webmanifest") errors.push("PRODUCT-METADATA pwa.manifest_path drifted");
  if (metadata.pwa?.display !== "standalone") errors.push("PRODUCT-METADATA pwa.display drifted");
  if (metadata.pwa?.public_install_distribution_authorized !== false) errors.push("PRODUCT-METADATA public install drifted");
  if (!/export const PWA_COMPLETE = false/.test(input.onboardingLockSource)) errors.push("onboarding lock must keep PWA_COMPLETE false");
  if (sha256(input.onboardingLockSource) !== EXPECTED_ONBOARDING_LOCK_SHA256) errors.push("onboarding lock source drifted");

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
  if (!/\| P2-11 \| P2 \| \*\*CLOSED\*\*/.test(input.findingsSource)) errors.push("P2-11 must remain CLOSED");
  if (manifest.preservation?.golden_png_changes !== 0 || manifest.preservation?.package_json_changes !== 0 || manifest.preservation?.release_gates_green !== 0) errors.push("RSH-047 preservation counts changed");
  const later = input.repositoryFiles.filter((path) => manifest.deferred_boundary?.forbidden_prefixes?.some((prefix) => path.startsWith(prefix)));
  if (later.length) errors.push(`RSH-049 was precreated: ${later.join(", ")}`);
  if (manifest.deferred_boundary?.queue_head !== "RSH-049" || manifest.deferred_boundary?.rsh_047_authorized !== true || manifest.deferred_boundary?.rsh_048_authorized !== true || manifest.deferred_boundary?.rsh_049_authorized !== false) errors.push("RSH-049 deferred boundary changed");
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
    console.error(`pwa fail\n${result.errors.map((error) => `- ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`pwa ok: RSH-047 locked; RSH-049 deferred`);
}
