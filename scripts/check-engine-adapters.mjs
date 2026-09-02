#!/usr/bin/env node
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot } from "./project-root.mjs";
import { gitBlobSha1, sha256 } from "./load-world-builders.mjs";
import {
  RSH016_ENGINE_BYTES,
  RSH016_ENGINE_GIT_BLOB_SHA1,
  RSH016_ENGINE_LINES,
  RSH016_ENGINE_SHA256,
  reconstructRsh016EngineSource,
} from "./load-engine-adapters.mjs";

export const EXPECTED_MANIFEST_SHA256 = "c19a9b9fe933d3c877d3e44cc10ebf7361623561d5f114ec742ec5d807d249e4";
export const EXPECTED_ENGINE_SHA256 = "6a592288cd778922b32bc918f63fd865a4b41312ce07130a61214014fa533c8b";
export const EXPECTED_ADAPTER_PATHS = [
  "src/game/engine/loop-adapter.ts",
  "src/game/engine/rendering-adapter.ts",
  "src/game/engine/physics-adapter.ts",
  "src/game/engine/qa-adapter.ts",
];
export const EXPECTED_SUPPORT_PATH = "src/game/engine/adapter-host.ts";
export const EXPECTED_PRESERVED = {
  "src/game/physics.ts": "cbff35aa2e2e4b509decf38e9f1ca3d262667675af81e0352ba02f460f5723c1",
  "src/game/world.ts": "b750d1ffc51a34a5b5d557e821577f6c679cef903c3b682514b03d52078b3fdc",
  "src/game/world-core.ts": "cbb9ac1f9de387cb1b31290fbc617b0ca34536b97067198b61e82ffcaf31fafe",
  "src/game/save.ts": "3b454e60fe1cc635a0b3051dc9a75191f7098df0b6989b1bea9ca845784b7df2",
  "src/game/records.ts": "1394102cc0c744a3000a0ad191bca61efc79880b874a7ded3794b51bf0d3a502",
  "src/components/game-app.tsx": "4569f67f6a8659252e3c3cf332fa377f263d3f41fcd03ced60a007aa0148cc4b",
  "WORLD-BUILDER-MANIFEST.json": "5921e14be99509e8b812bc3f556643b98d2244d1f8b77c2b928e02a99de90f00",
  "TRACK-MODULE-MANIFEST.json": "a8891a4af9345dbfa34fcb998302b77383f3b14f19fd240c9a8c46d2e5a43fdd",
  "TRACK-SCHEMA.json": "56f2f29c131d8df1b98c5fdc909fd1fe35cf21de2346d6f9f8189b6d1abec208",
  "ASSET-PROVENANCE.json": "6881756ee4c3fba9ce798208f5222dbadc3820e18d676b4f8c93733e8fe5f6e5",
  "PRODUCT-DEFINITION.json": "66c445b89f73fd84bfd0ea85b80097945546241e85d7b1f3b738bc98ebe0e4ca",
  "package.json": "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94",
  "package-lock.json": "55afd975f03b12867aada083c375e2fadc402b654ddaf0f0934807966fa9f1ed",
  "src/rendering/RendererFacade.ts": "90d8b440c1dcbb2020196ea1b99c854ae4e44c3a30b094f015fef6e98fefc904",
  "src/rendering/EnvironmentState.ts": "a4471989af161d1e9d195cf1b9972c3ba4b6a9e85d09a1d9c60a9beb309b69a2",
  "src/rendering/ResourceRegistry.ts": "97a4d36cb120714df59c7f14c4218169b7ac05a9875be87089acdd96caeeed35",
};

function walkFiles(directory, prefix = "") {
  const out = [];
  for (const name of readdirSync(directory)) {
    if ([".git", "node_modules", "dist", ".output", ".nitro", ".vercel"].includes(name)) continue;
    const absolute = `${directory}/${name}`;
    const relative = prefix ? `${prefix}/${name}` : name;
    if (statSync(absolute).isDirectory()) out.push(...walkFiles(absolute, relative));
    else out.push(relative);
  }
  return out.sort();
}

export function readEngineAdapterInputs() {
  const manifestSource = readFileSync(fromRoot("ENGINE-ADAPTER-MANIFEST.json"), "utf8");
  const manifest = JSON.parse(manifestSource);
  return {
    manifestSource,
    engineSource: readFileSync(fromRoot("src", "game", "engine.ts"), "utf8"),
    supportSource: readFileSync(fromRoot(...manifest.extraction.support.path.split("/")), "utf8"),
    adapterSources: Object.fromEntries(
      manifest.extraction.adapters.map((adapter) => [
        adapter.path,
        readFileSync(fromRoot(...adapter.path.split("/")), "utf8"),
      ]),
    ),
    assetSource: readFileSync(fromRoot("ASSET-PROVENANCE.json"), "utf8"),
    trackManifestSource: readFileSync(fromRoot("TRACK-MODULE-MANIFEST.json"), "utf8"),
    preservedSources: Object.fromEntries(
      Object.keys(EXPECTED_PRESERVED).map((path) => [
        path,
        readFileSync(fromRoot(...path.split("/")), "utf8"),
      ]),
    ),
    repositoryFiles: walkFiles(fromRoot()),
  };
}

export function validateEngineAdapters(overrides = {}) {
  const input = { ...readEngineAdapterInputs(), ...overrides };
  const errors = [];
  let manifest;
  try {
    manifest = JSON.parse(input.manifestSource);
  } catch (error) {
    return { errors: [`ENGINE-ADAPTER-MANIFEST.json invalid: ${error.message}`] };
  }

  if (sha256(input.manifestSource) !== EXPECTED_MANIFEST_SHA256) errors.push("engine-adapter manifest differs from the accepted authority");
  if (manifest.unit !== "RSH-017" || manifest.extraction.adapter_count !== 4 || manifest.extraction.adapters.length !== 4) errors.push("engine-adapter manifest identity/count is invalid");
  if (manifest.accepted_pre_extraction_engine.sha256 !== RSH016_ENGINE_SHA256 || manifest.accepted_pre_extraction_engine.git_blob_sha1 !== RSH016_ENGINE_GIT_BLOB_SHA1 || manifest.accepted_pre_extraction_engine.lines !== RSH016_ENGINE_LINES || manifest.accepted_pre_extraction_engine.bytes !== RSH016_ENGINE_BYTES) errors.push("accepted RSH-016 engine identity changed");

  const adapterPaths = Object.keys(input.adapterSources).sort();
  if (JSON.stringify(adapterPaths) !== JSON.stringify([...EXPECTED_ADAPTER_PATHS].sort())) errors.push("engine adapter set differs from the canonical four adapters");
  if (JSON.stringify(manifest.extraction.adapter_order) !== JSON.stringify(["loop", "rendering", "physics", "qa"])) errors.push("engine adapter order changed");

  const seenMethods = new Set();
  for (const adapter of manifest.extraction.adapters) {
    const source = input.adapterSources[adapter.path];
    if (typeof source !== "string") {
      errors.push(`missing engine adapter ${adapter.path}`);
      continue;
    }
    if (sha256(source) !== adapter.sha256 || gitBlobSha1(source) !== adapter.git_blob_sha1 || (source.match(/\n/g) ?? []).length !== adapter.lines || Buffer.byteLength(source) !== adapter.bytes) errors.push(`engine adapter identity changed: ${adapter.id}`);
    if (/^\s*\/\/\s*@ts-nocheck/m.test(source)) errors.push(`@ts-nocheck is forbidden: ${adapter.path}`);
    if (/from ["'][^"']*engine\/(?:loop|rendering|physics|qa)-adapter["']/.test(source)) errors.push(`engine adapters may not import another adapter: ${adapter.id}`);
    for (const method of adapter.methods) {
      if (seenMethods.has(method)) errors.push(`engine method assigned more than once: ${method}`);
      seenMethods.add(method);
      if ((source.match(new RegExp(`export function ${method}\\b`, "g")) ?? []).length !== 1) errors.push(`engine adapter export missing or duplicated: ${method}`);
      if ((source.match(new RegExp(`RSH-017-BODY-BEGIN:${method}`, "g")) ?? []).length !== 1 || (source.match(new RegExp(`RSH-017-BODY-END:${method}`, "g")) ?? []).length !== 1) errors.push(`engine adapter markers missing or duplicated: ${method}`);
    }
  }
  if (seenMethods.size !== manifest.extraction.moved_method_count || seenMethods.size !== manifest.reconstruction.methods.length) errors.push("moved engine method count changed");

  if (sha256(input.engineSource) !== EXPECTED_ENGINE_SHA256 || sha256(input.engineSource) !== manifest.extraction.engine.sha256 || gitBlobSha1(input.engineSource) !== manifest.extraction.engine.git_blob_sha1) errors.push("engine.ts differs from the accepted RSH-017 facade");
  if ((input.engineSource.match(/from ["']\.\/engine\/(?:loop|rendering|physics|qa)-adapter["']/g) ?? []).length !== 4) errors.push("engine.ts adapter wiring changed");
  for (const method of manifest.reconstruction.methods) {
    if ((input.engineSource.split(method.wrapper_source).length - 1) !== 1) errors.push(`engine facade wrapper changed: ${method.name}`);
  }
  if (sha256(input.supportSource) !== manifest.extraction.support.sha256 || gitBlobSha1(input.supportSource) !== manifest.extraction.support.git_blob_sha1) errors.push("engine adapter host changed");
  if (/\bany\b/.test(input.supportSource)) errors.push("engine adapter host must not contain any");
  if (/\[[^\]]*:\s*string\s*\]/.test(input.supportSource)) errors.push("engine adapter host must not contain an index signature");
  if (/declare\s+module/.test(input.supportSource)) errors.push("engine adapter host must not contain ambient module overloads");
  if (!manifest.typing || manifest.typing.permissive_index_signature !== false || manifest.typing.ambient_module_overloads !== false || manifest.typing.support_contains_any !== false) errors.push("engine adapter typing authority is invalid");
  if (manifest.typing && manifest.typing.host_member_count !== manifest.typing.host_members?.length) errors.push("engine adapter host member authority is inconsistent");
  for (const key of manifest.typing?.host_members ?? []) {
    const declaration = `${key}: RaceEngine[${JSON.stringify(key)}];`;
    if (!input.supportSource.includes(declaration)) errors.push(`engine adapter host member type changed: ${key}`);
  }
  if (!input.engineSource.includes(manifest.typing?.bridge_source ?? "__missing_bridge__")) errors.push("engine adapter bridge changed");
  for (const method of manifest.reconstruction.methods) {
    const source = input.adapterSources[method.path] ?? "";
    if (!method.adapter_signature || (source.split(method.adapter_signature).length - 1) !== 1) errors.push(`engine adapter exact signature changed: ${method.name}`);
    if (!method.wrapper_source.includes(`${manifest.typing?.bridge_name}(this)`)) errors.push(`engine facade typed bridge changed: ${method.name}`);
  }
  if (/^\s*\/\/\s*@ts-nocheck/m.test(input.engineSource + input.supportSource)) errors.push("@ts-nocheck is forbidden in the engine facade/support");

  try {
    const reconstructed = reconstructRsh016EngineSource(input.engineSource, manifest, input.adapterSources);
    if (sha256(reconstructed) !== manifest.reconstruction.expected_sha256 || gitBlobSha1(reconstructed) !== manifest.reconstruction.expected_git_blob_sha1 || (reconstructed.match(/\n/g) ?? []).length !== manifest.reconstruction.expected_lines || Buffer.byteLength(reconstructed) !== manifest.reconstruction.expected_bytes) errors.push("RSH-016 engine reconstruction drifted");
  } catch (error) {
    errors.push(`RSH-016 engine reconstruction failed: ${error.message}`);
  }

  for (const [path, expected] of Object.entries(EXPECTED_PRESERVED)) {
    if (sha256(input.preservedSources[path] ?? "") !== expected) errors.push(`preserved source changed: ${path}`);
  }
  const trackManifest = JSON.parse(input.trackManifestSource);
  if (trackManifest.modules.length !== 56 || trackManifest.counts.mvp !== 8 || trackManifest.counts.deferred !== 48) errors.push("track count/classification changed");
  const asset = JSON.parse(input.assetSource);
  if (asset.scope.unverified_asset_files !== 66 || asset.scope.public_distribution_authorized !== false || asset.truth_boundaries.release_gates_green !== 0 || asset.truth_boundaries.release_gates_total !== 13) errors.push("asset/distribution/release boundary changed");

  const engineDirectory = input.repositoryFiles.filter((path) => path.startsWith("src/game/engine/"));
  const expectedDirectory = [...EXPECTED_ADAPTER_PATHS, EXPECTED_SUPPORT_PATH].sort();
  if (JSON.stringify(engineDirectory.sort()) !== JSON.stringify(expectedDirectory)) errors.push(`unmanifested engine structure: ${engineDirectory.join(", ")}`);
  const noncanonicalGameApp = input.repositoryFiles.filter((path) => path.startsWith("src/components/game/") || path.startsWith("src/game/screens/") || path.startsWith("src/game/hud/") || path === "src/game/race-controller.ts");
  if (noncanonicalGameApp.length) errors.push(`noncanonical game-app structure: ${noncanonicalGameApp.join(", ")}`);
  const temp = input.repositoryFiles.filter((path) => path.startsWith(".github/workflows/rsh-017-") || path.startsWith(".rsh017-overlay.part-"));
  if (temp.length) errors.push(`temporary RSH-017 transfer files remain: ${temp.join(", ")}`);

  return {
    errors,
    adapterCount: manifest.extraction.adapters.length,
    movedMethodCount: manifest.extraction.moved_method_count,
    engineLines: (input.engineSource.match(/\n/g) ?? []).length,
    engineBytes: Buffer.byteLength(input.engineSource),
  };
}

function isMainModule(url) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(url);
  } catch {
    return false;
  }
}

if (isMainModule(import.meta.url)) {
  const result = validateEngineAdapters();
  if (result.errors.length) {
    console.error("engine-adapters fail\n" + result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`engine-adapters ok: ${result.adapterCount} adapters/${result.movedMethodCount} methods; engine ${result.engineLines} lines/${result.engineBytes} bytes; 0 runtime drift`);
}
